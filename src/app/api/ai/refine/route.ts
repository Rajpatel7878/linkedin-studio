import { NextRequest, NextResponse } from 'next/server';
import { refinePostWithAI } from '@/lib/ai/gemini';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const content = body.content || body.currentContent || body.topic || '';
    const instruction = body.instruction || body.prompt || '';
    const voiceProfileId = body.voiceProfileId;

    if (!content.trim() || !instruction.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content and instruction are required to refine the post.' },
        { status: 400 }
      );
    }

    let voiceProfile = null;
    if (voiceProfileId) {
      try {
        voiceProfile = await prisma.voiceProfile.findUnique({
          where: { id: voiceProfileId },
          include: { samples: true },
        });
      } catch (e) {}
    }

    const refinedContent = await refinePostWithAI(content, instruction, voiceProfile as any);

    return NextResponse.json({
      success: true,
      refinedContent: refinedContent || content,
    });
  } catch (error: any) {
    console.error('Refine route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to refine post' },
      { status: 500 }
    );
  }
}
