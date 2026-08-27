import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkCanPublishPost, incrementUsage } from '@/lib/usage';
import { publishPostToLinkedIn } from '@/lib/linkedin/client';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const post = await prisma.post.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const canPublish = await checkCanPublishPost(user.id);
    if (!canPublish.allowed) {
      return NextResponse.json({ error: canPublish.reason, limitReached: true }, { status: 403 });
    }

    const result = await publishToLinkedIn(post.id);

    if (result.success) {
      await incrementUsage(user.id, 'PUBLISH');
      return NextResponse.json({
        success: true,
        message: 'Post published successfully to LinkedIn!',
        urn: result.urn,
      });
    } else if (result.rateLimited) {
      return NextResponse.json({
        success: false,
        rateLimited: true,
        message: result.error,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || 'Publishing failed',
      }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
