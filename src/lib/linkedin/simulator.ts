import { prisma } from '../prisma';

export interface PublishResult {
  success: boolean;
  urn?: string;
  rateLimited?: boolean;
  retryAfterSeconds?: number;
  error?: string;
}

export async function simulateLinkedInPublish(
  postId: string,
  content: string,
  imageUrl?: string | null
): Promise<PublishResult> {
  // Check account quota
  let account = await prisma.linkedInAccount.findUnique({
    where: { id: 'default' },
  });

  if (!account) {
    account = await prisma.linkedInAccount.create({
      data: {
        id: 'default',
        isConnected: true,
        isSandboxMode: true,
        name: 'Alex Rivera',
        headline: 'Founder & Tech Strategist | Building the Future of AI',
      },
    });
  }

  // Simulate Rate Limit check if daily post limit reached
  if (account.dailyPostCount >= account.dailyPostLimit) {
    return {
      success: false,
      rateLimited: true,
      retryAfterSeconds: 3600, // retry in 1 hour
      error: `LinkedIn API Rate Limit: Daily limit of ${account.dailyPostLimit} posts reached. Post has been queued for auto-retry.`,
    };
  }

  // Add realistic latency (simulate API call)
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Generate simulated LinkedIn Post URN
  const simulatedUrn = `urn:li:share:${Date.now()}`;

  // Increment daily counter
  await prisma.linkedInAccount.update({
    where: { id: 'default' },
    data: {
      dailyPostCount: { increment: 1 },
      lastResetDate: new Date().toISOString().split('T')[0],
    },
  });

  return {
    success: true,
    urn: simulatedUrn,
  };
}

export function generateSimulatedAnalytics(
  publishedAt: Date,
  impressionsBase: number = 0
): { impressions: number; likes: number; comments: number; shares: number } {
  const hoursSincePublished = Math.max(
    1,
    Math.round((Date.now() - publishedAt.getTime()) / (1000 * 60 * 60))
  );

  // Progressive realistic engagement growth
  const multiplier = Math.min(24, hoursSincePublished);
  const baseImp = impressionsBase > 0 ? impressionsBase : Math.floor(120 + Math.random() * 250);
  const totalImp = Math.floor(baseImp * (1 + multiplier * 0.15));
  const totalLikes = Math.max(1, Math.floor(totalImp * (0.035 + Math.random() * 0.025)));
  const totalComments = Math.max(0, Math.floor(totalLikes * (0.18 + Math.random() * 0.15)));
  const totalShares = Math.max(0, Math.floor(totalLikes * (0.05 + Math.random() * 0.05)));

  return {
    impressions: totalImp,
    likes: totalLikes,
    comments: totalComments,
    shares: totalShares,
  };
}
