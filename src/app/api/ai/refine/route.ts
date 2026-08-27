import { NextRequest, NextResponse } from 'next/server';
import { refinePostWithAI } from '@/lib/ai/gemini';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { content, instruction, voiceProfileId } = await req.json();

    if (!content || !instruction) {
      return NextResponse.json(
        { error: 'content and instruction are required' },
        { status: 400 }
      );
    }

    let voiceProfile = null;
    if (voiceProfileId) {
      voiceProfile = await prisma.voiceProfile.findUnique({
        where: { id: voiceProfileId },
        include: { samples: true },
      });
    }

    const refinedContent = await refinePostWithAI(content, instruction, voiceProfile as any);

    return NextResponse.json({
      success: true,
      refinedContent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to refine post' },
      { status: 500 }
    );
  }
}
