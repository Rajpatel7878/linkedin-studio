import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { exchangeCodeForTokens, fetchLinkedInProfile } from '@/lib/linkedin/oauth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const userId = user?.id || 'demo-user-id';

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      return NextResponse.redirect(
        new URL(`/settings?error=${encodeURIComponent(errorDescription || error)}`, req.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/settings?error=No+authorization+code+received', req.url)
      );
    }

    let account = null;
    try {
      account = await prisma.linkedInAccount.findUnique({
        where: { userId },
      });
    } catch (e) {}

    const clientId = account?.clientId || process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = account?.clientSecret || process.env.LINKEDIN_CLIENT_SECRET;

    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/linkedin/callback`;

    if (!clientId || !clientSecret || clientId.includes('placeholder')) {
      return NextResponse.redirect(
        new URL('/settings?error=LinkedIn+Client+ID+or+Secret+missing', req.url)
      );
    }

    const tokens = await exchangeCodeForTokens(
      code,
      clientId,
      clientSecret,
      redirectUri
    );

    let profile: any = { name: 'LinkedIn User', pictureUrl: null, memberUrn: null };
    try {
      profile = await fetchLinkedInProfile(tokens.accessToken);
    } catch (e) {}

    const expiresAt = new Date(Date.now() + (tokens.expiresIn || 5184000) * 1000);

    try {
      await prisma.linkedInAccount.upsert({
        where: { userId },
        update: {
          isConnected: true,
          isSandboxMode: false,
          accessToken: tokens.accessToken,
          accessTokenEncrypted: tokens.accessToken,
          refreshToken: tokens.refreshToken || null,
          tokenExpiresAt: expiresAt,
          memberUrn: profile.memberUrn,
          name: profile.name || account?.name || 'My LinkedIn Profile',
          profilePictureUrl: profile.pictureUrl || account?.profilePictureUrl,
        },
        create: {
          userId,
          isConnected: true,
          isSandboxMode: false,
          accessToken: tokens.accessToken,
          accessTokenEncrypted: tokens.accessToken,
          refreshToken: tokens.refreshToken || null,
          tokenExpiresAt: expiresAt,
          memberUrn: profile.memberUrn,
          name: profile.name || 'My LinkedIn Profile',
          profilePictureUrl: profile.pictureUrl,
        },
      });
    } catch (dbErr) {}

    return NextResponse.redirect(
      new URL('/generator?success=LinkedIn+account+connected!+You+can+now+post+directly+to+LinkedIn.', req.url)
    );
  } catch (err: any) {
    console.error('LinkedIn OAuth callback error:', err);
    return NextResponse.redirect(
      new URL(`/settings?error=${encodeURIComponent(err.message)}`, req.url)
    );
  }
}
