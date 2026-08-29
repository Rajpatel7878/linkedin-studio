import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const DEFAULT_GOOGLE_ID = '149007414470-k83on3ir5dtfpbvtbvq24lvgn6u5qeu8.apps.googleusercontent.com';

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_ID;

  const host = req.headers.get('host') || 'linkedin-studio-gules.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=openid%20email%20profile&prompt=select_account&access_type=offline`;

  return NextResponse.redirect(googleAuthUrl);
}
