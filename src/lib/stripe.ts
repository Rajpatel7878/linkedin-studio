import Stripe from 'stripe';
import { prisma } from './prisma';
import { PLANS } from '@/config/plans';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_dev_mode';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20' as any,
  typescript: true,
});

export async function getOrCreateStripeCustomer(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, stripeCustomerId: true },
  });

  if (!user) return null;
  if (user.stripeCustomerId) return user.stripeCustomerId;

  // If live stripe key is present, create customer in Stripe
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });

      return customer.id;
    } catch (e: any) {
      console.warn('Stripe customer creation error:', e.message);
    }
  }

  // Fallback dev customer ID
  const mockCustomerId = `cus_mock_${user.id}`;
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: mockCustomerId },
  });

  return mockCustomerId;
}

export async function createCheckoutSession(params: {
  userId: string;
  planId: 'pro' | 'team';
  interval: 'monthly' | 'annual';
  successUrl: string;
  cancelUrl: string;
}) {
  const customerId = await getOrCreateStripeCustomer(params.userId);
  const plan = PLANS[params.planId];

  // If real Stripe keys configured, create real checkout session
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
    const priceId =
      params.interval === 'annual'
        ? plan.stripePriceIdAnnual
        : plan.stripePriceIdMonthly;

    const session = await stripe.checkout.sessions.create({
      customer: customerId || undefined,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: params.userId,
        planId: params.planId,
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    });

    return { url: session.url };
  }

  // Instant simulation in test mode: directly upgrade user
  await prisma.user.update({
    where: { id: params.userId },
    data: {
      plan: params.planId,
      stripeSubscriptionId: `sub_mock_${Date.now()}`,
      stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 86400000),
    },
  });

  return {
    url: `${params.successUrl}?session_id=mock_checkout_success&plan=${params.planId}`,
    isSimulation: true,
  };
}

export async function createCustomerPortalSession(params: {
  userId: string;
  returnUrl: string;
}) {
  const customerId = await getOrCreateStripeCustomer(params.userId);

  if (
    process.env.STRIPE_SECRET_KEY &&
    !process.env.STRIPE_SECRET_KEY.includes('placeholder') &&
    customerId &&
    !customerId.startsWith('cus_mock_')
  ) {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: params.returnUrl,
    });
    return { url: portalSession.url };
  }

  return { url: params.returnUrl };
}
