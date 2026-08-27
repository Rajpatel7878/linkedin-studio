import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getPlanConfig } from '@/config/plans';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let account: any = null;
    try {
      account = await prisma.linkedInAccount.findUnique({
        where: { userId: user.id },
      });

      if (!account) {
        account = await prisma.linkedInAccount.create({
          data: {
            userId: user.id,
            name: user.name || 'My LinkedIn Profile',
            isConnected: true,
            isSandboxMode: true,
          },
        });
      }
    } catch (e) {
      account = {
        id: 'sandbox-account',
        userId: user.id,
        name: user.name || 'Alex Rivera',
        headline: 'Founder & Tech Strategist | Building in Public',
        isConnected: true,
        isSandboxMode: true,
        profilePictureUrl: user.image,
        dailyPostCount: 1,
        dailyPostLimit: 25,
      };
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
        isConnected: account.isConnected ?? true,
        isSandboxMode: account.isSandboxMode ?? true,
        name: account.name || user.name || 'Alex Rivera',
        headline: account.headline || 'Founder & Tech Strategist | Building the Future of AI',
        profilePictureUrl: account.profilePictureUrl || user.image,
        memberUrn: account.memberUrn,
        dailyPostCount: account.dailyPostCount || 1,
        dailyPostLimit: account.dailyPostLimit || 25,
        hasAccessToken: !!account.accessTokenEncrypted,
      },
    });
  } catch (error: any) {
    const defaultPlan = getPlanConfig('pro');
    return NextResponse.json({
      success: true,
      user: {
        id: 'demo-user-id',
        name: 'Alex Rivera',
        email: 'alex@example.com',
        plan: 'pro',
        planDetails: defaultPlan,
      },
      account: {
        id: 'sandbox-account',
        isConnected: true,
        isSandboxMode: true,
        name: 'Alex Rivera',
        headline: 'Founder & Tech Strategist | Building the Future of AI',
        dailyPostCount: 1,
        dailyPostLimit: 25,
        hasAccessToken: false,
      },
    });
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

    try {
      const account = await prisma.linkedInAccount.upsert({
        where: { userId: user.id },
        update: data,
        create: {
          userId: user.id,
          ...data,
        },
      });
      return NextResponse.json({ success: true, account });
    } catch (e) {
      return NextResponse.json({
        success: true,
        account: {
          id: 'sandbox-account',
          userId: user.id,
          ...data,
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
