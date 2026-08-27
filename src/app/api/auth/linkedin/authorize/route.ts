import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getLinkedInAuthUrl } from '@/lib/linkedin/oauth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const account = await prisma.linkedInAccount.findUnique({
      where: { id: 'default' },
    });

    if (!account?.clientId) {
      return NextResponse.redirect(
        new URL('/settings?error=Please+enter+your+LinkedIn+Client+ID+first', req.url)
      );
    }

    const redirectUri = account.redirectUri || 'http://localhost:3000/api/auth/linkedin/callback';
    const state = Math.random().toString(36).substring(2, 15);

    const authUrl = getLinkedInAuthUrl(account.clientId, redirectUri, state);
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.redirect(
      new URL(`/settings?error=${encodeURIComponent(error.message)}`, req.url)
    );
  }
}
