import { NextRequest, NextResponse } from 'next/server';
import { processScheduledPosts } from '@/lib/scheduler/worker';

export async function GET() {
  try {
    const report = await processScheduledPosts();
    return NextResponse.json({ success: true, report, timestamp: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const report = await processScheduledPosts();
    return NextResponse.json({ success: true, report, timestamp: new Date().toISOString() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
