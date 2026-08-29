import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getLinkedInAuthUrl } from '@/lib/linkedin/oauth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    const host = req.headers.get('host') || 'linkedin-studio-gules.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/linkedin/callback`;

    if (!clientId || !clientSecret || clientId.includes('placeholder')) {
      // Connect sandbox LinkedIn account and redirect to studio
      try {
        const defaultEmail = 'linkedin.creator@linkedin.com';
        let user = await prisma.user.findUnique({ where: { email: defaultEmail } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: defaultEmail,
              name: 'LinkedIn Creator',
              plan: 'pro',
            },
          });
        }

        await prisma.linkedInAccount.upsert({
          where: { userId: user.id },
          update: { isConnected: true, isSandboxMode: true },
          create: {
            userId: user.id,
            name: 'LinkedIn Creator',
            headline: 'Creator & Tech Strategist | LinkedIn Studio',
            isConnected: true,
            isSandboxMode: true,
          },
        });
      } catch (e) {}

      return NextResponse.redirect(new URL('/generator?success=LinkedIn+Creator+Account+Connected!', req.url));
    }

    const state = Math.random().toString(36).substring(2, 15);
    const authUrl = getLinkedInAuthUrl(clientId, redirectUri, state);
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url)
    );
  }
}
