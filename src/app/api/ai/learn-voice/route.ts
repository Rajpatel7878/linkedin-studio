import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getPlanConfig } from '@/config/plans';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const plan = getPlanConfig(user.plan);
    const existingCount = await prisma.voiceProfile.count({ where: { userId: user.id } });

    if (plan.limits.voiceProfilesLimit !== -1 && existingCount >= plan.limits.voiceProfilesLimit) {
      return NextResponse.json(
        {
          error: `You have reached the limit of ${plan.limits.voiceProfilesLimit} voice profile(s) on the ${plan.name} plan. Upgrade to Pro for 15 custom profiles.`,
          limitReached: true,
        },
        { status: 403 }
      );
    }

    const { profileName, posts } = await req.json();

    if (!posts || !Array.isArray(posts) || posts.length < 1) {
      return NextResponse.json(
        { error: 'Please provide at least 1-5 past posts to learn your voice.' },
        { status: 400 }
      );
    }

    const name = profileName?.trim() || 'Learned Signature Voice';

    let apiKey = process.env.GEMINI_API_KEY;
    const setting = await prisma.appSetting.findUnique({ where: { key: 'GEMINI_API_KEY' } });
    if (setting?.value) apiKey = setting.value;

    let styleSummary = '';
    let instructions = '';

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `You are an expert linguistic analyst and ghostwriter.
Analyze these ${posts.length} real past LinkedIn posts from this author:

${posts.map((p: string, idx: number) => `--- [Post ${idx + 1}] ---\n${p}\n`).join('\n')}

Extract a comprehensive style DNA profile and return ONLY a JSON object with this schema:
{
  "styleSummary": "A 2-sentence summary of tone, sentence cadence, and formatting habits",
  "instructions": "4-6 concrete prompt instructions to ghostwrite in this author's voice (e.g. sentence length, emoji frequency, hook style, paragraph breaks, closing CTA)"
}`;

        const result = await model.generateContent(prompt);
        const parsed = JSON.parse(result.response.text());
        styleSummary = parsed.styleSummary || '';
        instructions = parsed.instructions || '';
      } catch (err: any) {
        console.warn('Gemini style extraction fallback:', err.message);
      }
    }

    // Heuristic fallback extraction
    if (!styleSummary || !instructions) {
      const allText = posts.join(' ');
      const words = allText.split(/\s+/).filter(Boolean);
      const sentences = allText.split(/[.!?\n]+/).filter(Boolean);
      const avgLength = Math.round(words.length / Math.max(1, sentences.length));
      const hasBullets = allText.includes('•') || allText.includes('→') || allText.includes('-');

      styleSummary = `Tone: Authentic, High-Agency. Sentence Length: ~${avgLength} words/sentence. Formatting: ${
        hasBullets ? 'Heavy use of structured bullet points' : 'Conversational narrative'
      }.`;

      instructions = `1. Use short 1-2 sentence paragraphs with clear spacing between thoughts.
2. Match sentence length of ~${avgLength} words per sentence.
3. ${hasBullets ? 'Use clear bullet points (→ or •) for step-by-step takeaways.' : 'Use natural conversational flow.'}
4. Avoid corporate buzzwords.
5. End with an authentic, low-friction discussion question.`;
    }

    // Create the Voice Profile scoped to user
    const newProfile = await prisma.voiceProfile.create({
      data: {
        userId: user.id,
        name,
        isDefault: false,
        instructions,
        styleSummary,
        samples: {
          create: posts.map((postText: string, idx: number) => ({
            title: `Sample ${idx + 1}: ${postText.slice(0, 30).trim()}...`,
            content: postText.trim(),
            tags: 'learned-post, authentic',
          })),
        },
      },
      include: { samples: true },
    });

    return NextResponse.json({
      success: true,
      profile: newProfile,
      styleSummary,
      instructions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
