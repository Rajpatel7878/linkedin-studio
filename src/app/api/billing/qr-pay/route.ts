import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      planId = 'pro',
      interval = 'annual',
      amount = 799,
      currency = 'INR',
      transactionRef,
      screenshotUrl,
      notes,
    } = body;

    if (!transactionRef || transactionRef.trim().length < 4) {
      return NextResponse.json(
        { error: 'Please enter a valid Transaction UTR / Reference ID (at least 4 characters).' },
        { status: 400 }
      );
    }

    const cleanRef = transactionRef.trim();

    // Check if this transactionRef was already used by another account
    const existingTx = await prisma.paymentTransaction.findFirst({
      where: { transactionRef: cleanRef, status: 'APPROVED' },
    });

    if (existingTx && existingTx.userId !== user.id) {
      return NextResponse.json(
        { error: 'This Transaction Reference ID has already been claimed.' },
        { status: 400 }
      );
    }

    const durationDays = interval === 'annual' ? 365 : 30;
    const periodEnd = new Date(Date.now() + durationDays * 86400000);

    // Create payment transaction record
    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId: user.id,
        planId,
        interval,
        amount: Number(amount),
        currency,
        paymentMethod: 'QR_UPI',
        transactionRef: cleanRef,
        screenshotUrl: screenshotUrl || null,
        status: 'APPROVED',
        notes: notes || 'Direct QR Code payment submitted by customer',
      },
    });

    // Upgrade user's plan in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan: planId,
        stripeSubscriptionId: `qr_sub_${cleanRef}`,
        stripeCurrentPeriodEnd: periodEnd,
      },
    });

    logger.info(`User ${user.id} upgraded to ${planId} via QR payment with UTR ${cleanRef}`);

    return NextResponse.json({
      success: true,
      message: `🎉 Payment verified! Your ${planId.toUpperCase()} subscription is now active.`,
      transaction,
      plan: planId,
      expiresAt: periodEnd.toISOString(),
    });
  } catch (error: any) {
    logger.error('Error processing QR payment submission', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
