import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getPlanConfig } from '@/config/plans';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profiles = await prisma.voiceProfile.findMany({
      where: { userId: user.id },
      include: {
        samples: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    const defaultProfile = profiles.find((p) => p.isDefault) || profiles[0] || null;

    return NextResponse.json({
      success: true,
      profiles,
      defaultProfile,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const plan = getPlanConfig(user.plan);
    const existingCount = await prisma.voiceProfile.count({
      where: { userId: user.id },
    });

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
