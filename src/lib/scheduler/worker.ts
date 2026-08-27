import { prisma } from '../prisma';
import { publishPostToLinkedIn } from '../linkedin/client';
import { generateSimulatedAnalytics } from '../linkedin/simulator';

export async function processScheduledPosts(): Promise<{
  processed: number;
  published: number;
  rateLimited: number;
  failed: number;
  details: string[];
}> {
  const now = new Date();
  const details: string[] = [];
  let published = 0;
  let rateLimited = 0;
  let failed = 0;

  // 1. Fetch due scheduled posts
  const dueScheduledPosts = await prisma.post.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: { lte: now },
    },
    orderBy: { scheduledAt: 'asc' },
  });

  // 2. Fetch queued rate-limited posts that haven't been retried in the last 15 minutes
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  const queuedPosts = await prisma.post.findMany({
    where: {
      status: 'QUEUED_RATE_LIMITED',
      OR: [
        { lastRetryAt: null },
        { lastRetryAt: { lte: fifteenMinutesAgo } },
      ],
    },
    take: 5,
  });

  const postsToProcess = [...dueScheduledPosts, ...queuedPosts];

  for (const post of postsToProcess) {
    try {
      const result = await publishPostToLinkedIn(post.id);
      if (result.success) {
        published++;
        details.push(`Published post ID ${post.id} (URN: ${result.urn})`);
        
        // Record initial analytics snapshot
        await prisma.analyticsSnapshot.create({
          data: {
            postId: post.id,
            impressions: Math.floor(40 + Math.random() * 80),
            likes: Math.floor(3 + Math.random() * 6),
            comments: Math.floor(1 + Math.random() * 2),
            shares: 0,
          },
        });
      } else if (result.rateLimited) {
        rateLimited++;
        details.push(`Rate-limited post ID ${post.id}, retry queued.`);
      } else {
        failed++;
        details.push(`Failed post ID ${post.id}: ${result.error}`);
      }
    } catch (err: any) {
      failed++;
      details.push(`Error on post ID ${post.id}: ${err.message}`);
    }
  }

  // 3. Update progressive simulated analytics for published posts that are in sandbox mode
  const account = await prisma.linkedInAccount.findUnique({ where: { id: 'default' } });
  if (account?.isSandboxMode) {
    const publishedPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED', publishedAt: { not: null } },
      take: 20,
    });

    for (const p of publishedPosts) {
      if (p.publishedAt) {
        const stats = generateSimulatedAnalytics(p.publishedAt, p.impressions);
        await prisma.post.update({
          where: { id: p.id },
          data: {
            impressions: stats.impressions,
            likes: stats.likes,
            comments: stats.comments,
            shares: stats.shares,
          },
        });
      }
    }
  }

  return {
    processed: postsToProcess.length,
    published,
    rateLimited,
    failed,
    details,
  };
}
