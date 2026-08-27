import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { format, subDays } from 'date-fns';
import { getMonthlyUsage } from '@/lib/usage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { voiceProfile: true, template: true },
    });

    const totalPosts = posts.length;
    const publishedPosts = posts.filter((p) => p.status === 'PUBLISHED');
    const scheduledPosts = posts.filter((p) => p.status === 'SCHEDULED');
    const draftPosts = posts.filter((p) => p.status === 'DRAFT');

    let totalImpressions = 0;
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;

    publishedPosts.forEach((p) => {
      totalImpressions += p.impressions;
      totalLikes += p.likes;
      totalComments += p.comments;
      totalShares += p.shares;
    });

    const totalInteractions = totalLikes + totalComments + totalShares;
    const averageEngagementRate =
      totalImpressions > 0 ? Number(((totalInteractions / totalImpressions) * 100).toFixed(2)) : 0;

    const sortedByEngagement = [...publishedPosts].sort(
      (a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares)
    );
    const topPerformingPost = sortedByEngagement.length > 0 ? sortedByEngagement[0] : null;

    // 7-day timeline
    const impressionsByDay: { date: string; impressions: number; reactions: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dayDate = subDays(new Date(), i);
      const dateStr = format(dayDate, 'yyyy-MM-dd');
      const label = format(dayDate, 'MMM d');

      const postsOnDay = publishedPosts.filter((p) => {
        const pDate = p.publishedAt ? format(p.publishedAt, 'yyyy-MM-dd') : null;
        return pDate === dateStr;
      });

      const dayImpressions = postsOnDay.reduce((sum, p) => sum + p.impressions, 0);
      const dayReactions = postsOnDay.reduce((sum, p) => sum + p.likes + p.comments, 0);

      impressionsByDay.push({
        date: label,
        impressions: dayImpressions,
        reactions: dayReactions,
      });
    }

    // Day of week breakdown
    const daysMap: Record<string, { count: number; totalInteractions: number }> = {
      Mon: { count: 0, totalInteractions: 0 },
      Tue: { count: 0, totalInteractions: 0 },
      Wed: { count: 0, totalInteractions: 0 },
      Thu: { count: 0, totalInteractions: 0 },
      Fri: { count: 0, totalInteractions: 0 },
      Sat: { count: 0, totalInteractions: 0 },
      Sun: { count: 0, totalInteractions: 0 },
    };

    publishedPosts.forEach((p) => {
      if (p.publishedAt) {
        const dayName = format(p.publishedAt, 'EEE');
        if (daysMap[dayName]) {
          daysMap[dayName].count += 1;
          daysMap[dayName].totalInteractions += p.likes + p.comments;
        }
      }
    });

    const dayOfWeekBreakdown = Object.entries(daysMap).map(([day, data]) => ({
      day,
      count: data.count,
      avgEngagement: data.count > 0 ? Math.round(data.totalInteractions / data.count) : 0,
    }));

    // Templates breakdown
    const templates = await prisma.contentTemplate.findMany({
      where: {
        OR: [{ isPrebuilt: true }, { userId: user.id }],
      },
      include: {
        posts: { where: { userId: user.id } },
      },
    });

    const topTemplates = templates
      .filter((t) => t.posts.length > 0)
      .map((t) => {
        const pCount = t.posts.length;
        const totalImp = t.posts.reduce((s, p) => s + p.impressions, 0);
        return {
          name: t.name,
          postCount: pCount,
          avgImpressions: pCount > 0 ? Math.round(totalImp / pCount) : 0,
        };
      });

    // Voice Profiles breakdown
    const voices = await prisma.voiceProfile.findMany({
      where: { userId: user.id },
      include: { posts: { where: { userId: user.id } } },
    });

    const topVoices = voices.map((v) => {
      const pCount = v.posts.length;
      const totalEng = v.posts.reduce((s, p) => s + p.likes + p.comments, 0);
      return {
        name: v.name,
        postCount: pCount,
        avgEngagement: pCount > 0 ? Math.round(totalEng / pCount) : 0,
      };
    });

    const usage = await getMonthlyUsage(user.id);

    return NextResponse.json({
      success: true,
      summary: {
        totalPosts,
        publishedPosts: publishedPosts.length,
        scheduledPosts: scheduledPosts.length,
        draftPosts: draftPosts.length,
        totalImpressions,
        totalLikes,
        totalComments,
        totalShares,
        averageEngagementRate,
        topPerformingPost,
        impressionsByDay,
        dayOfWeekBreakdown,
        topTemplates,
        topVoices,
        usage,
      },
      posts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
