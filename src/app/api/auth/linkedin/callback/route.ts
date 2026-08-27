import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exchangeCodeForTokens, fetchLinkedInProfile } from '@/lib/linkedin/oauth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
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

    const account = await prisma.linkedInAccount.findUnique({
      where: { id: 'default' },
    });

    if (!account?.clientId || !account?.clientSecret) {
      return NextResponse.redirect(
        new URL('/settings?error=LinkedIn+Client+ID+or+Secret+missing', req.url)
      );
    }

    const redirectUri = account.redirectUri || 'http://localhost:3000/api/auth/linkedin/callback';
    const tokens = await exchangeCodeForTokens(
      code,
      account.clientId,
      account.clientSecret,
      redirectUri
    );

    const profile = await fetchLinkedInProfile(tokens.accessToken);
    const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);

    await prisma.linkedInAccount.update({
      where: { id: 'default' },
      data: {
        isConnected: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || null,
        tokenExpiresAt: expiresAt,
        memberUrn: profile.memberUrn,
        name: profile.name || account.name,
        profilePictureUrl: profile.pictureUrl || account.profilePictureUrl,
      },
    });

    return NextResponse.redirect(
      new URL('/settings?success=LinkedIn+account+connected+successfully', req.url)
    );
  } catch (err: any) {
    console.error('LinkedIn OAuth callback error:', err);
    return NextResponse.redirect(
      new URL(`/settings?error=${encodeURIComponent(err.message)}`, req.url)
    );
  }
}
