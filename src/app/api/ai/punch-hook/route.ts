import { NextRequest, NextResponse } from 'next/server';
import { generateViralHooks } from '@/lib/ai/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { content, topic } = await req.json();

    if (!content && !topic) {
      return NextResponse.json(
        { success: false, error: 'Please provide content or topic to punch up the hook.' },
        { status: 400 }
      );
    }

    const hooks = await generateViralHooks(content, topic);

    return NextResponse.json({
      success: true,
      hooks,
    });
  } catch (error: any) {
    console.error('Punch-hook route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to punch up hook.' },
      { status: 500 }
    );
  }
}
