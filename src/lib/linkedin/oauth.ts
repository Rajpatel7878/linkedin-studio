import { prisma } from '../prisma';

export function getLinkedInAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const scopes = encodeURIComponent('openid profile email w_member_social');
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${scopes}`;
}

export async function exchangeCodeForTokens(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<{ accessToken: string; expiresIn: number; refreshToken?: string }> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  });

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to exchange LinkedIn auth code: ${errText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    refreshToken: data.refresh_token,
  };
}

export async function fetchLinkedInProfile(
  accessToken: string
): Promise<{ memberUrn: string; name: string; headline?: string; pictureUrl?: string }> {
  try {
    // OpenID userinfo endpoint
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const data = await response.json();
      const memberUrn = `urn:li:person:${data.sub}`;
      const name = data.name || `${data.given_name || ''} ${data.family_name || ''}`.trim() || 'LinkedIn User';
      const pictureUrl = data.picture || undefined;

      return {
        memberUrn,
        name,
        pictureUrl,
      };
    }
  } catch (e) {
    console.warn('Could not fetch LinkedIn userinfo:', e);
  }

  return {
    memberUrn: 'urn:li:person:me',
    name: 'LinkedIn User',
  };
}
