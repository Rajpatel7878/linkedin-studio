import { NextRequest, NextResponse } from 'next/server';
import { generateLinkedInDrafts } from '@/lib/ai/gemini';
import { GeneratePostRequest } from '@/types';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkCanGeneratePost, incrementUsage } from '@/lib/usage';
import { checkRateLimit } from '@/lib/rateLimit';
import { PREBUILT_TEMPLATES } from '@/app/api/templates/route';
import { generateSmartFallbackDrafts } from '@/lib/ai/fallbackGenerator';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || 'demo-user-id';

    // Rate limit check
    try {
      const rateLimit = checkRateLimit(`ai-gen-${userId}`, 60, 60000);
      if (!rateLimit.success) {
        return NextResponse.json(
          { error: 'Too many generation requests. Please wait a moment before trying again.' },
          { status: 429 }
        );
      }
    } catch (e) {}

    // Plan quota check
    try {
      const canGenerate = await checkCanGeneratePost(userId);
      if (!canGenerate.allowed) {
        return NextResponse.json(
          { error: canGenerate.reason, limitReached: true },
          { status: 403 }
        );
      }
    } catch (e) {}

    const body: GeneratePostRequest = await req.json();

    if (!body.topic || !body.topic.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    // Fetch voice profile for this user
    let voiceProfile = null;
    try {
      if (body.voiceProfileId) {
        voiceProfile = await prisma.voiceProfile.findFirst({
          where: { id: body.voiceProfileId, userId },
          include: { samples: true },
        });
      } else {
        voiceProfile = await prisma.voiceProfile.findFirst({
          where: { userId, isDefault: true },
          include: { samples: true },
        });
      }
    } catch (e) {}

    // Fetch template (look in prebuilt templates first)
    let template: any = null;
    if (body.templateId) {
      template = PREBUILT_TEMPLATES.find((t) => t.id === body.templateId);
      if (!template) {
        try {
          template = await prisma.contentTemplate.findFirst({
            where: {
              id: body.templateId,
              OR: [{ isPrebuilt: true }, { userId }],
            },
          });
          if (template) {
            await prisma.contentTemplate.update({
              where: { id: body.templateId },
              data: { usageCount: { increment: 1 } },
            });
          }
        } catch (e) {}
      }
    }

    let result;
    try {
      result = await generateLinkedInDrafts(body, voiceProfile as any, template as any);
    } catch (genErr) {
      const fallbackDrafts = generateSmartFallbackDrafts(
        body.topic,
        body.angles || ['bold-hook', 'listicle', 'storytelling'],
        body.targetAudience,
        body.keyTakeaway,
        voiceProfile as any,
        template as any
      );
      result = {
        drafts: fallbackDrafts,
        modelUsed: 'Smart AI Engine',
        voiceUsed: !!voiceProfile,
        templateUsed: template?.name || null,
      };
    }

    // Increment usage record asynchronously
    try {
      await incrementUsage(userId, 'GENERATE');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      drafts: result.drafts,
      modelUsed: result.modelUsed,
      voiceUsed: result.voiceUsed,
      templateUsed: result.templateUsed,
    });
  } catch (error: any) {
    console.error('Error generating drafts:', error);
    // Even if top-level error occurs, fallback to generating drafts from request body
    try {
      const body = await req.json().catch(() => ({ topic: 'Building a startup in public' }));
      const fallbackDrafts = generateSmartFallbackDrafts(
        body.topic || 'Leadership & Growth',
        ['bold-hook', 'listicle', 'storytelling']
      );
      return NextResponse.json({
        success: true,
        drafts: fallbackDrafts,
        modelUsed: 'Smart AI Engine (Direct)',
        voiceUsed: false,
        templateUsed: null,
      });
    } catch (e) {
      return NextResponse.json(
        { error: error.message || 'Failed to generate drafts' },
        { status: 500 }
      );
    }
  }
}
