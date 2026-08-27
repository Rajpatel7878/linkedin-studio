import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSimulatedAnalytics } from '@/lib/linkedin/simulator';

export async function POST() {
  try {
    const publishedPosts = await prisma.post.findMany({
      where: { status: 'PUBLISHED', publishedAt: { not: null } },
    });

    let updatedCount = 0;
    for (const post of publishedPosts) {
      if (post.publishedAt) {
        const stats = generateSimulatedAnalytics(post.publishedAt, post.impressions);
        await prisma.post.update({
          where: { id: post.id },
          data: {
            impressions: Math.max(post.impressions, stats.impressions),
            likes: Math.max(post.likes, stats.likes),
            comments: Math.max(post.comments, stats.comments),
            shares: Math.max(post.shares, stats.shares),
          },
        });
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synchronized analytics for ${updatedCount} published posts`,
      updatedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
