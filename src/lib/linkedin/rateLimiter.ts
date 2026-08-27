import { prisma } from '../prisma';

export async function checkRateLimitAndQueue(postId: string): Promise<{ canPublish: boolean; waitSeconds?: number; reason?: string }> {
  const account = await prisma.linkedInAccount.findUnique({
    where: { id: 'default' },
  });

  if (!account) {
    return { canPublish: true };
  }

  const today = new Date().toISOString().split('T')[0];
  if (account.lastResetDate !== today) {
    // Reset daily count for a new day
    await prisma.linkedInAccount.update({
      where: { id: 'default' },
      data: { dailyPostCount: 0, lastResetDate: today },
    });
    return { canPublish: true };
  }

  if (account.dailyPostCount >= account.dailyPostLimit) {
    // Queue post with rate limited status
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'QUEUED_RATE_LIMITED',
        errorMessage: `Rate limit reached (${account.dailyPostCount}/${account.dailyPostLimit} posts today). Queued for next window.`,
        retryCount: { increment: 1 },
        lastRetryAt: new Date(),
      },
    });

    return {
      canPublish: false,
      waitSeconds: 3600,
      reason: `Daily quota limit reached (${account.dailyPostLimit} posts/day). Post queued.`,
    };
  }

  return { canPublish: true };
}
