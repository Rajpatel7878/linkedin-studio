import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkCanPublishPost, incrementUsage } from '@/lib/usage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = { userId: user.id };
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        voiceProfile: true,
        template: true,
      },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      topic,
      content,
      tone = 'professional',
      angle = 'bold-hook',
      status = 'DRAFT',
      scheduledAt,
      imageUrl,
      mediaType = 'NONE',
      voiceProfileId,
      templateId,
    } = body;

    if (!topic || !content) {
      return NextResponse.json({ error: 'Topic and content are required' }, { status: 400 });
    }

    if (status === 'SCHEDULED' || status === 'PUBLISHED') {
      const canPublish = await checkCanPublishPost(user.id);
      if (!canPublish.allowed) {
        return NextResponse.json({ error: canPublish.reason, limitReached: true }, { status: 403 });
      }
    }

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        topic,
        content,
        tone,
        angle,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        imageUrl,
        mediaType,
        voiceProfileId: voiceProfileId || null,
        templateId: templateId || null,
      },
      include: {
        voiceProfile: true,
        template: true,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
