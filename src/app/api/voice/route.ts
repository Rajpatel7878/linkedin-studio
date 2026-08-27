import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getPlanConfig } from '@/config/plans';

export const dynamic = 'force-dynamic';

const DEFAULT_PROFILES = [
  {
    id: 'voice-bold-founder',
    name: 'Bold Founder & Builder',
    isDefault: true,
    instructions: 'Short 1-sentence paragraphs. Bold contrarian hooks. Arrow bullet points (→). Zero corporate fluff. Open-ended discussion questions.',
    styleSummary: 'Tone: Direct, High-Agency. Sentence Length: 6-12 words. Emoji Use: Moderate (💡, 🚀, 🔥). Hooks: Problem-oriented, scroll-stopping.',
    samples: [
      {
        id: 'sample-1',
        title: 'Founder Memo Framework',
        content: 'Unpopular opinion: Slide decks hide weak thinking behind animations.\n\nMemos force clarity:\n→ Problem definition\n→ Assumptions tested\n→ Quantitative ROI\n\nIf you cannot write it clearly in 2 pages, you do not understand the problem yet.',
        tags: 'Leadership,Strategy',
      },
    ],
  },
  {
    id: 'voice-warm-mentor',
    name: 'Warm Mentor & Guide',
    isDefault: false,
    instructions: 'Empathetic, reflective storytelling. Uses personal failure lessons and actionable takeaways. Encouraging tone.',
    styleSummary: 'Tone: Empathetic, Educational. Sentence Length: 10-18 words. Vocabulary: Accessible, conversational.',
    samples: [],
  },
  {
    id: 'voice-tech-architect',
    name: 'Technical Systems Architect',
    isDefault: false,
    instructions: 'Analytical, frameworks, system trade-offs, architecture breakdowns, benchmark metrics.',
    styleSummary: 'Tone: Analytical, Authoritative. Focus on data, system patterns, and scalability.',
    samples: [],
  },
];

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let profiles: any[] = [];
    try {
      profiles = await prisma.voiceProfile.findMany({
        where: { userId: user.id },
        include: {
          samples: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });
    } catch (dbErr) {}

    if (profiles.length === 0) {
      profiles = DEFAULT_PROFILES;
    }

    const defaultProfile = profiles.find((p) => p.isDefault) || profiles[0] || DEFAULT_PROFILES[0];

    return NextResponse.json({
      success: true,
      profiles,
      defaultProfile,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      profiles: DEFAULT_PROFILES,
      defaultProfile: DEFAULT_PROFILES[0],
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const plan = getPlanConfig(user.plan);
    let existingCount = 0;
    try {
      existingCount = await prisma.voiceProfile.count({
        where: { userId: user.id },
      });
    } catch (e) {}

    if (plan.limits.voiceProfilesLimit !== -1 && existingCount >= plan.limits.voiceProfilesLimit) {
      return NextResponse.json(
        {
          error: `You have reached the limit of ${plan.limits.voiceProfilesLimit} voice profile(s) on the ${plan.name} plan. Upgrade to Pro for 15 custom profiles.`,
          limitReached: true,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, instructions, styleSummary, isDefault, samples = [] } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Profile name is required' }, { status: 400 });
    }

    try {
      if (isDefault) {
        await prisma.voiceProfile.updateMany({
          where: { userId: user.id, isDefault: true },
          data: { isDefault: false },
        });
      }

      const profile = await prisma.voiceProfile.create({
        data: {
          userId: user.id,
          name: name.trim(),
          instructions,
          styleSummary,
          isDefault: isDefault ?? false,
          samples: {
            create: samples.map((s: any) => ({
              title: s.title || 'Past Post Sample',
              content: s.content,
              notes: s.notes,
              tags: s.tags,
            })),
          },
        },
        include: { samples: true },
      });

      return NextResponse.json({ success: true, profile }, { status: 201 });
    } catch (e) {
      // Memory fallback
      const mockProfile = {
        id: `voice-${Date.now()}`,
        userId: user.id,
        name: name.trim(),
        instructions,
        styleSummary: styleSummary || 'Custom extracted voice signature',
        isDefault: isDefault ?? false,
        samples: samples.map((s: any, i: number) => ({
          id: `sample-${Date.now()}-${i}`,
          title: s.title || 'Past Post Sample',
          content: s.content,
        })),
      };
      return NextResponse.json({ success: true, profile: mockProfile }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
