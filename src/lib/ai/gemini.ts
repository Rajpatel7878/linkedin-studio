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
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.75,
      },
      systemInstruction: buildSystemPrompt(voiceProfile),
    });

    const userPrompt = buildGenerationUserPrompt(request, template);
    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);
    const drafts: GeneratedDraftOption[] = (parsed.drafts || []).map((d: any, idx: number) => {
      const angle = (d.angle as PostAngle) || selectedAngles[idx] || 'bold-hook';
      const angleConfig = ANGLE_DEFINITIONS[angle] || ANGLE_DEFINITIONS['bold-hook'];
      const content = d.content || '';
      const charCount = content.length;
      const words = content.split(/\s+/).filter(Boolean).length;
      const readSeconds = Math.max(1, Math.round((words / 200) * 60));
      const readTime = readSeconds < 60 ? `${readSeconds}s read` : `${Math.ceil(readSeconds / 60)}m read`;

      return {
        id: `draft-${Date.now()}-${idx}`,
        angle,
        angleLabel: angleConfig.label,
        angleDescription: angleConfig.description,
        content,
        hook: d.hook || content.slice(0, 80),
        seeMoreIndex: d.seeMoreIndex || Math.min(210, content.indexOf('\n') > 0 ? content.indexOf('\n') : 210),
        characterCount: charCount,
        estimatedReadTime: readTime,
        hashtags: d.hashtags || [],
        cta: d.cta || '',
      };
    });

    return {
      drafts: drafts.length > 0 ? drafts : generateSmartFallbackDrafts(request.topic, selectedAngles, request.targetAudience, request.keyTakeaway, voiceProfile, template),
      modelUsed: 'Gemini 1.5 Flash (Live LLM)',
      voiceUsed: !!voiceProfile,
      templateUsed: template?.name || null,
    };
  } catch (error: any) {
    console.error('Gemini API Error, falling back to smart heuristic generator:', error);
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
      modelUsed: 'Smart AI Engine (Local Heuristic Fallback)',
      voiceUsed: !!voiceProfile,
      templateUsed: template?.name || null,
    };
  }
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

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { temperature: 0.8 },
        systemInstruction: buildSystemPrompt(voiceProfile),
      });

      const prompt = `Here is a LinkedIn post draft:
"""
${content}
"""

Please rewrite and refine this post completely according to this instruction: "${instruction}".
Ensure it has:
- A scroll-stopping opening hook (under 210 chars before see-more)
- Clean whitespace and 1-2 sentence paragraphs
- Bullet points (→ or • or ✦) for easy skim-reading
- An engaging open-ended question at the end
- 3-5 relevant hashtags

Return ONLY the complete revised LinkedIn post text without conversational chatter.`;

      const result = await model.generateContent(prompt);
      const revised = result.response.text().trim();
      if (revised && revised.length > 30) {
        return revised;
      }
    } catch (error) {
      console.error('Gemini refine error, falling back to smart heuristic rewriter:', error);
    }
  }

  // Smart Heuristic Transformation Engine (never leaves content unchanged)
  return smartHeuristicRefine(content, instruction);
}

function smartHeuristicRefine(content: string, instruction: string): string {
  const lower = instruction.toLowerCase();
  const cleanContent = content.trim();
  const lines = cleanContent.split('\n').map((l) => l.trim()).filter(Boolean);
  
  const firstLine = lines[0] || 'LinkedIn Growth';
  const middleLines = lines.slice(1).filter((l) => !l.startsWith('#') && l.length > 10);
  const rawTopic = firstLine.replace(/^[^a-zA-Z0-9]+/, '').slice(0, 50) || 'growth strategy';

  if (lower.includes('rewrite') || lower.includes('regenerate') || lower.includes('fresh')) {
    const bullets = middleLines.length >= 2
      ? middleLines.slice(0, 3).map((l, i) => `→ ${i + 1}. ${l.replace(/^[^a-zA-Z0-9]+/, '')}`)
      : [
          `→ 1. Audit what is already working (stop reinventing the wheel)`,
          `→ 2. Focus 80% of energy on high-leverage activities`,
          `→ 3. Execute with consistency over perfection`,
        ];

    return `90% of people approach ${rawTopic} completely backwards.\n\nHere is the exact playbook that separates top 1% creators from everyone else:\n\n${bullets.join('\n\n')}\n\nThe takeaway?\nExecution discipline beats complex strategy every single time.\n\nWhat is your biggest bottleneck right now? Drop your perspective below! 👇\n\n#Leadership #Strategy #Growth #Founders`;
  }

  if (lower.includes('shorter') || lower.includes('concise')) {
    const shortPoints = lines.slice(0, 4).map((l) => l.replace(/^[^a-zA-Z0-9]+/, '')).filter(Boolean);
    return `Unpopular truth about ${rawTopic}:\n\n${shortPoints[0] || 'Simplicity beats complexity.'}\n\nKey rules to remember:\n${shortPoints.slice(1, 3).map((p) => `• ${p}`).join('\n')}\n\nAgree or disagree? Drop a comment below! 👇\n\n#Leadership #Focus #Productivity`;
  }

  if (lower.includes('bolder') || lower.includes('bold') || lower.includes('contrarian')) {
    return `🚨 Hard truth most leaders refuse to admit about ${rawTopic}:\n\n${lines.slice(0, 3).join('\n\n')}\n\nStop overthinking the process.\nStart taking high-conviction action.\n\nWho else needed this reminder today? 👇\n\n#HighAgency #Leadership #Founders`;
  }

  if (lower.includes('question') || lower.includes('cta')) {
    const existingWithoutTags = lines.filter((l) => !l.startsWith('#')).join('\n\n');
    return `${existingWithoutTags}\n\n---\n\nWhat is your #1 takeaway from this? Drop your thoughts below! 👇\n\n#Discussion #Leadership`;
  }

  return `✨ Refined Version:\n\n${cleanContent}\n\nWhat are your thoughts on this? 👇`;
}

export async function generateViralHooks(
  content: string,
  topic?: string
): Promise<Array<{ angle: string; label: string; hookText: string; score: number; whyItWorks: string }>> {
  let apiKey = process.env.GEMINI_API_KEY;
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: 'GEMINI_API_KEY' },
    });
    if (setting?.value) apiKey = setting.value;
  } catch (e) {}

  const fallbackHooks = [
    {
      angle: 'contrarian',
      label: 'Contrarian Truth',
      hookText: `Most advice about ${topic || 'LinkedIn growth'} is completely backwards.\nHere is what actually works in 2026:`,
      score: 98,
      whyItWorks: 'Stops the scroll by challenging common assumptions.',
    },
    {
      angle: 'numbered',
      label: '3-Point Framework',
      hookText: `I analyzed 500+ top posts in ${topic || 'our industry'}.\n3 counter-intuitive patterns emerged:`,
      score: 96,
      whyItWorks: 'Uses specific numbers and proof to build immediate authority.',
    },
    {
      angle: 'cliffhanger',
      label: 'Raw Story Hook',
      hookText: `In 2024, I made a mistake that almost destroyed my momentum.\nHere is the real lesson:`,
      score: 95,
      whyItWorks: 'Vulnerability drives high empathy and comments.',
    },
    {
      angle: 'bold_statement',
      label: 'High Conviction',
      hookText: `The #1 skill that separates top 1% creators from everyone else:\n(It is not what you think)`,
      score: 97,
      whyItWorks: 'Creates a curiosity gap before the "...see more" cutoff.',
    },
    {
      angle: 'how_to',
      label: 'Tactical Playbook',
      hookText: `How to get results with ${topic || 'content'} in 15 minutes a day:\nA step-by-step breakdown:`,
      score: 94,
      whyItWorks: 'Promises high-utility actionable advice.',
    },
  ];

  if (!apiKey) return fallbackHooks;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json', temperature: 0.8 },
    });

    const prompt = `You are a viral LinkedIn ghostwriter.
Generate exactly 5 viral opening hook angles for this post/topic:
Content: "${content || topic}"

Return JSON:
{
  "hooks": [
    {
      "angle": "contrarian",
      "label": "Contrarian Truth",
      "hookText": "Opening hook text (1-2 lines with \\n)...",
      "score": 98,
      "whyItWorks": "Short 1-sentence reason..."
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());
    return parsed.hooks || fallbackHooks;
  } catch (e) {
    return fallbackHooks;
  }
}
