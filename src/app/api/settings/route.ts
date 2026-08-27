import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getPlanConfig } from '@/config/plans';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let account = await prisma.linkedInAccount.findUnique({
      where: { userId: user.id },
    });

    if (!account) {
      account = await prisma.linkedInAccount.create({
        data: {
          userId: user.id,
          name: user.name || 'My LinkedIn Profile',
          isConnected: false,
          isSandboxMode: true,
        },
      });
    }

    const plan = getPlanConfig(user.plan);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        plan: user.plan,
        planDetails: plan,
      },
      account: {
        id: account.id,
        isConnected: account.isConnected,
        isSandboxMode: account.isSandboxMode,
        name: account.name,
        headline: account.headline,
        profilePictureUrl: account.profilePictureUrl,
        memberUrn: account.memberUrn,
        dailyPostCount: account.dailyPostCount,
        dailyPostLimit: account.dailyPostLimit,
        hasAccessToken: !!account.accessTokenEncrypted,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, headline, isSandboxMode, isConnected } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (headline !== undefined) data.headline = headline;
    if (isSandboxMode !== undefined) data.isSandboxMode = isSandboxMode;
    if (isConnected !== undefined) data.isConnected = isConnected;

    const account = await prisma.linkedInAccount.upsert({
      where: { userId: user.id },
      update: data,
      create: {
        userId: user.id,
        ...data,
      },
    });

    return NextResponse.json({ success: true, account });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
