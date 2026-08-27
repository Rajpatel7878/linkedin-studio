import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { scheduledAt } = await req.json();

    if (!scheduledAt) {
      return NextResponse.json(
        { error: 'scheduledAt datetime is required' },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ error: 'Invalid datetime format' }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        status: 'SCHEDULED',
        scheduledAt: scheduledDate,
        errorMessage: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Post successfully scheduled for ${scheduledDate.toLocaleString()}`,
      post: updatedPost,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
