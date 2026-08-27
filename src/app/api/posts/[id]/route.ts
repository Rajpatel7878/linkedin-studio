import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const post = await prisma.post.findFirst({
      where: { id: params.id, userId: user.id },
      include: {
        voiceProfile: true,
        template: true,
        snapshots: { orderBy: { recordedAt: 'desc' } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { topic, content, tone, angle, status, scheduledAt, imageUrl, mediaType, voiceProfileId, templateId } = body;

    const existing = await prisma.post.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const data: any = {};
    if (topic !== undefined) data.topic = topic;
    if (content !== undefined) data.content = content;
    if (tone !== undefined) data.tone = tone;
    if (angle !== undefined) data.angle = angle;
    if (status !== undefined) data.status = status;
    if (scheduledAt !== undefined) data.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (mediaType !== undefined) data.mediaType = mediaType;
    if (voiceProfileId !== undefined) data.voiceProfileId = voiceProfileId;
    if (templateId !== undefined) data.templateId = templateId;

    const updated = await prisma.post.update({
      where: { id: params.id },
      data,
      include: { voiceProfile: true, template: true },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.post.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
