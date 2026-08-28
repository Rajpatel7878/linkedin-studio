import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getLinkedInAuthUrl } from '@/lib/linkedin/oauth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || 'demo-user-id';

    let account = null;
    try {
      account = await prisma.linkedInAccount.findUnique({
        where: { userId },
      });
    } catch (e) {}

    const clientId =
      account?.clientId ||
      process.env.LINKEDIN_CLIENT_ID;

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/linkedin/callback`;

    if (!clientId || clientId.includes('placeholder')) {
      // In sandbox mode without live LinkedIn credentials, connect sandbox instantly and return to settings/studio
      if (user) {
        try {
          await prisma.linkedInAccount.upsert({
            where: { userId: user.id },
            update: { isConnected: true, isSandboxMode: true },
            create: {
              userId: user.id,
              name: user.name || 'LinkedIn Profile',
              isConnected: true,
              isSandboxMode: true,
              profilePictureUrl: user.image,
            },
          });
        } catch (e) {}
      }
      return NextResponse.redirect(
        new URL('/settings?success=LinkedIn+Sandbox+Connected+Successfully!+You+can+publish+and+schedule+posts+now.', req.url)
      );
    }

    const state = Math.random().toString(36).substring(2, 15);
    const authUrl = getLinkedInAuthUrl(clientId, redirectUri, state);
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.redirect(
      new URL(`/settings?error=${encodeURIComponent(error.message)}`, req.url)
    );
  }
}
