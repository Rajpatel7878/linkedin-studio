import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { confirmation } = await req.json();
    if (confirmation !== 'DELETE MY ACCOUNT') {
      return NextResponse.json(
        { error: 'Please provide exact confirmation phrase: "DELETE MY ACCOUNT"' },
        { status: 400 }
      );
    }

    // Cancel Stripe subscription if active
    if (user.stripeSubscriptionId && !user.stripeSubscriptionId.startsWith('sub_mock_')) {
      try {
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      } catch (e: any) {
        logger.warn('Stripe subscription cancellation on user delete error', e.message);
      }
    }

    // Delete user from database (Cascades all posts, voices, templates, LinkedIn accounts, sessions)
    await prisma.user.delete({
      where: { id: user.id },
    });

    logger.info(`User ${user.id} (${user.email}) permanently deleted.`);

    return NextResponse.json({
      success: true,
      message: 'Your account and all associated data have been permanently deleted.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
