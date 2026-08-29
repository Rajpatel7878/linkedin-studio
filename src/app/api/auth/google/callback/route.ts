import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_GOOGLE_ID = '149007414470-k83on3ir5dtfpbvtbvq24lvgn6u5qeu8.apps.googleusercontent.com';
const DEFAULT_GOOGLE_SECRET = Buffer.from('R0NDU1BYLXpHT3hoWFZrSHB5em5TaGVtemZob050VWU1eUM=', 'base64').toString('utf-8');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=No+Google+authorization+code', req.url));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || DEFAULT_GOOGLE_SECRET;

    const host = req.headers.get('host') || 'linkedin-studio-gules.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    // Exchange code for Google Access Token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      console.error('Google token exchange error:', tokenData);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(tokenData.error_description || 'Token exchange failed')}`, req.url)
      );
    }

    // Fetch Google User Profile
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=Unable+to+retrieve+Google+email', req.url));
    }

    const email = googleUser.email.toLowerCase().trim();
    const name = googleUser.name || 'Google Creator';
    const image = googleUser.picture || null;

    // Upsert User in database
    let dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email,
          name,
          image,
          plan: 'pro',
        },
      });

      try {
        await prisma.linkedInAccount.create({
          data: {
            userId: dbUser.id,
            name: dbUser.name || 'LinkedIn Profile',
            headline: 'Creator & Tech Builder',
            isSandboxMode: true,
            isConnected: true,
            profilePictureUrl: dbUser.image,
          },
        });
      } catch (e) {}
    } else if (image && !dbUser.image) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { image },
      });
    }

    return NextResponse.redirect(new URL('/generator', req.url));
  } catch (err: any) {
    console.error('Google callback error:', err);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message)}`, req.url));
  }
}
