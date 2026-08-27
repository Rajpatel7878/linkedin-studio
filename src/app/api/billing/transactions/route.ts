import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let transactions: any[] = [];
    try {
      transactions = await prisma.paymentTransaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, transactions });
  } catch (error: any) {
    return NextResponse.json({ success: true, transactions: [] });
  }
}
