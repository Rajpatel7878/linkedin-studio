import { NextRequest, NextResponse } from 'next/server';
import { generateLinkedInDrafts } from '@/lib/ai/gemini';
import { GeneratePostRequest } from '@/types';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkCanGeneratePost, incrementUsage } from '@/lib/usage';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit check
    const rateLimit = checkRateLimit(`ai-gen-${user.id}`, 30, 60000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many generation requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    // Plan quota check
    const canGenerate = await checkCanGeneratePost(user.id);
    if (!canGenerate.allowed) {
      return NextResponse.json(
        { error: canGenerate.reason, limitReached: true },
        { status: 403 }
      );
    }

    const body: GeneratePostRequest = await req.json();

    if (!body.topic || !body.topic.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Fetch voice profile for this user
    let voiceProfile = null;
    if (body.voiceProfileId) {
      voiceProfile = await prisma.voiceProfile.findFirst({
        where: { id: body.voiceProfileId, userId: user.id },
        include: { samples: true },
      });
    } else {
      voiceProfile = await prisma.voiceProfile.findFirst({
        where: { userId: user.id, isDefault: true },
        include: { samples: true },
      });
    }

    // Fetch template
    let template = null;
    if (body.templateId) {
      template = await prisma.contentTemplate.findFirst({
        where: {
          id: body.templateId,
          OR: [{ isPrebuilt: true }, { userId: user.id }],
        },
      });
      if (template) {
        await prisma.contentTemplate.update({
          where: { id: body.templateId },
          data: { usageCount: { increment: 1 } },
        });
      }
    }

    const result = await generateLinkedInDrafts(body, voiceProfile as any, template as any);

    // Increment usage record
    await incrementUsage(user.id, 'GENERATE');

    return NextResponse.json({
      success: true,
      drafts: result.drafts,
      modelUsed: result.modelUsed,
      voiceUsed: result.voiceUsed,
      templateUsed: result.templateUsed,
    });
  } catch (error: any) {
    console.error('Error generating drafts:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate drafts' },
      { status: 500 }
    );
  }
}
