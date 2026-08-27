import { prisma } from '../prisma';
import { simulateLinkedInPublish, PublishResult } from './simulator';
import { checkRateLimitAndQueue } from './rateLimiter';
import { decrypt } from '../crypto';

export async function publishPostToLinkedIn(postId: string): Promise<PublishResult> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return { success: false, error: 'Post not found in database' };
  }

  const account = await prisma.linkedInAccount.findUnique({
    where: { userId: post.userId },
  });

  const accessToken = account?.accessTokenEncrypted ? decrypt(account.accessTokenEncrypted) : null;

  // If in sandbox mode or no valid accessToken, use simulator
  if (!account || account.isSandboxMode || !accessToken || !account.isConnected) {
    const rateCheck = await checkRateLimitAndQueue(postId);
    if (!rateCheck.canPublish) {
      return {
        success: false,
        rateLimited: true,
        retryAfterSeconds: rateCheck.waitSeconds,
        error: rateCheck.reason,
      };
    }

    const simResult = await simulateLinkedInPublish(postId, post.content, post.imageUrl);
    if (simResult.success && simResult.urn) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          linkedinPostUrn: simResult.urn,
          errorMessage: null,
        },
      });
    } else if (simResult.rateLimited) {
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'QUEUED_RATE_LIMITED',
          errorMessage: simResult.error,
          retryCount: { increment: 1 },
          lastRetryAt: new Date(),
        },
      });
    }
    return simResult;
  }

  // Real LinkedIn API Call
  try {
    const rateCheck = await checkRateLimitAndQueue(postId);
    if (!rateCheck.canPublish) {
      return {
        success: false,
        rateLimited: true,
        retryAfterSeconds: rateCheck.waitSeconds,
        error: rateCheck.reason,
      };
    }

    const authorUrn = account.memberUrn || 'urn:li:person:me';

    // Official LinkedIn Share API payload (/rest/posts)
    const requestBody = {
      author: authorUrn,
      commentary: post.content,
      visibility: 'PUBLIC',
      distribution: {
        feedDistribution: 'MAIN_FEED',
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: 'PUBLISHED',
      isReshareDisabledByAuthor: false,
    };

    const response = await fetch('https://api.linkedin.com/rest/posts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202401',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 429) {
      const retryAfterHeader = response.headers.get('Retry-After');
      const retrySeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 3600;

      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'QUEUED_RATE_LIMITED',
          errorMessage: `LinkedIn API 429: Rate limit reached. Scheduled auto-retry in ${retrySeconds}s.`,
          retryCount: { increment: 1 },
          lastRetryAt: new Date(),
        },
      });

      return {
        success: false,
        rateLimited: true,
        retryAfterSeconds: retrySeconds,
        error: 'LinkedIn Rate limit reached (HTTP 429). Post queued for retry.',
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `LinkedIn API error (${response.status}): ${errorText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson.message || errorMsg;
      } catch (e) {}

      await prisma.post.update({
        where: { id: postId },
        data: {
          status: 'FAILED',
          errorMessage: errorMsg,
        },
      });

      return { success: false, error: errorMsg };
    }

    const postUrn = response.headers.get('x-restli-id') || `urn:li:share:${Date.now()}`;

    await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        linkedinPostUrn: postUrn,
        errorMessage: null,
      },
    });

    await prisma.linkedInAccount.update({
      where: { userId: post.userId },
      data: { dailyPostCount: { increment: 1 } },
    });

    return {
      success: true,
      urn: postUrn,
    };
  } catch (err: any) {
    const errorMsg = err.message || 'Unknown network error communicating with LinkedIn';
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'FAILED',
        errorMessage: errorMsg,
      },
    });
    return { success: false, error: errorMsg };
  }
}
