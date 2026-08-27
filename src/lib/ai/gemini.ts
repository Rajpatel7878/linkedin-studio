import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeneratePostRequest, GeneratedDraftOption, PostAngle, VoiceProfileItem, ContentTemplateItem } from '@/types';
import { buildGenerationUserPrompt, buildSystemPrompt, ANGLE_DEFINITIONS, TONE_DEFINITIONS } from './promptBuilder';
import { generateSmartFallbackDrafts } from './fallbackGenerator';
import { prisma } from '../prisma';

export async function generateLinkedInDrafts(
  request: GeneratePostRequest,
  voiceProfile?: VoiceProfileItem | null,
  template?: ContentTemplateItem | null
): Promise<{ drafts: GeneratedDraftOption[]; modelUsed: string; voiceUsed: boolean; templateUsed?: string | null }> {
  const selectedAngles: PostAngle[] =
    request.angles && request.angles.length > 0
      ? request.angles
      : ['storytelling', 'listicle', 'bold-hook'];

  // Look for API Key in DB Settings or process.env
  let apiKey = process.env.GEMINI_API_KEY;
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: 'GEMINI_API_KEY' },
    });
    if (setting?.value) {
      apiKey = setting.value;
    }
  } catch (e) {}

  if (!apiKey) {
    const fallbackDrafts = generateSmartFallbackDrafts(
      request.topic,
      selectedAngles,
      request.targetAudience,
      request.keyTakeaway,
      voiceProfile,
      template
    );
    return {
      drafts: fallbackDrafts,
      modelUsed: 'Smart AI Engine (Local Fallback - Add Gemini Key in Settings for live LLM)',
      voiceUsed: !!voiceProfile,
      templateUsed: template?.name || null,
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = buildSystemPrompt(voiceProfile, template);
    const userPrompt = buildGenerationUserPrompt({
      topic: request.topic,
      angles: selectedAngles,
      targetAudience: request.targetAudience,
      keyTakeaway: request.keyTakeaway,
      callToAction: request.callToAction,
      customInstructions: request.customInstructions,
      length: request.length,
    });

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);
    const draftsArray = parsed.drafts || parsed;

    if (Array.isArray(draftsArray) && draftsArray.length > 0) {
      const formattedDrafts: GeneratedDraftOption[] = draftsArray.map((item: any) => {
        const angle: PostAngle = item.angle || 'bold-hook';
        const tone = item.tone || 'professional';
        const content = item.content || '';
        const words = content.split(/\s+/).length;
        const readMinutes = Math.max(1, Math.round(words / 180));
        const seeMoreIndex = Math.min(210, content.length);

        return {
          angle,
          angleLabel: item.angleLabel || ANGLE_DEFINITIONS[angle]?.label || angle,
          tone,
          toneLabel: item.toneLabel || TONE_DEFINITIONS[tone]?.label || tone,
          hook: item.hook || content.split('\n')[0] || '',
          content,
          characterCount: content.length,
          seeMoreIndex,
          estimatedReadTime: `${readMinutes} min read`,
          suggestedHashtags: item.suggestedHashtags || [],
        };
      });

      return {
        drafts: formattedDrafts,
        modelUsed: 'Gemini 1.5 Flash',
        voiceUsed: !!voiceProfile,
        templateUsed: template?.name || null,
      };
    }
  } catch (error: any) {
    console.warn('Gemini API call failed, using fallback generator:', error.message);
  }

  // Fallback if LLM parsing or API failed
  const fallbackDrafts = generateSmartFallbackDrafts(
    request.topic,
    selectedAngles,
    request.targetAudience,
    request.keyTakeaway,
    voiceProfile,
    template
  );
  return {
    drafts: fallbackDrafts,
    modelUsed: 'Smart AI Engine (Fallback)',
    voiceUsed: !!voiceProfile,
    templateUsed: template?.name || null,
  };
}

export async function refinePostWithAI(
  content: string,
  instruction: string,
  voiceProfile?: VoiceProfileItem | null
): Promise<string> {
  let apiKey = process.env.GEMINI_API_KEY;
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: 'GEMINI_API_KEY' },
    });
    if (setting?.value) apiKey = setting.value;
  } catch (e) {}

  if (!apiKey) {
    // Quick heuristic refinement if no key
    const lower = instruction.toLowerCase();
    if (lower.includes('shorter') || lower.includes('concise')) {
      const lines = content.split('\n').filter((l) => l.trim().length > 0);
      return lines.slice(0, Math.max(3, Math.ceil(lines.length * 0.7))).join('\n\n');
    }
    if (lower.includes('bolder') || lower.includes('bold')) {
      return `🚨 Unpopular truth that leaders need to hear:\n\n${content}`;
    }
    if (lower.includes('question') || lower.includes('cta')) {
      return `${content}\n\nWhat is your biggest takeaway from this? Drop your perspective below! 👇`;
    }
    return content;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { temperature: 0.7 },
      systemInstruction: buildSystemPrompt(voiceProfile),
    });

    const prompt = `Here is a LinkedIn post draft:
"""
${content}
"""

Please re-prompt and rewrite this post according to this instruction: "${instruction}".
Keep the high-converting LinkedIn post structure (punchy hook under 210 chars, clean line breaks, bullet points, open-ended question at the end, hashtags).
Return ONLY the revised post text without conversational commentary.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Refine post error:', error);
    return content;
  }
}
