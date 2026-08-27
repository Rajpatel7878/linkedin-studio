import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createCustomerPortalSession } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    const returnUrl = `${origin}/billing`;

    const result = await createCustomerPortalSession({
      userId: user.id,
      returnUrl,
    });

    return NextResponse.json({ success: true, url: result.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
