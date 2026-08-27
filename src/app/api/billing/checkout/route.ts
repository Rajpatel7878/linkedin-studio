import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId = 'pro', interval = 'monthly' } = await req.json();

    if (planId !== 'pro' && planId !== 'team') {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const successUrl = `${origin}/billing?success=true`;
    const cancelUrl = `${origin}/billing?canceled=true`;

    const result = await createCheckoutSession({
      userId: user.id,
      planId,
      interval,
      successUrl,
      cancelUrl,
    });

    return NextResponse.json({ success: true, url: result.url, isSimulation: result.isSimulation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
