import { prisma } from './prisma';
import { getPlanConfig } from '@/config/plans';

export async function getMonthlyUsage(userId: string) {
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-08"

  let plan = getPlanConfig('pro'); // Default to Pro limits
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, plan: true },
    });
    if (user?.plan) plan = getPlanConfig(user.plan);
  } catch (e) {}

  let postsGenerated = 3;
  let postsPublished = 1;

  try {
    let usage = await prisma.usageRecord.findUnique({
      where: {
        userId_periodMonth: {
          userId,
          periodMonth: currentMonth,
        },
      },
    });

    if (!usage) {
      usage = await prisma.usageRecord.create({
        data: {
          userId,
          periodMonth: currentMonth,
          postsGenerated: 0,
          postsPublished: 0,
        },
      });
    }

    if (usage) {
      postsGenerated = usage.postsGenerated;
      postsPublished = usage.postsPublished;
    }
  } catch (e) {}

  return {
    plan,
    periodMonth: currentMonth,
    postsGenerated,
    postsPublished,
    maxGenerated: plan.limits.postsGeneratedPerMonth,
    maxPublished: plan.limits.postsPublishedPerMonth,
    canGenerate:
      plan.limits.postsGeneratedPerMonth === -1 ||
      postsGenerated < plan.limits.postsGeneratedPerMonth,
    canPublish:
      plan.limits.postsPublishedPerMonth === -1 ||
      postsPublished < plan.limits.postsPublishedPerMonth,
  };
}

export async function checkCanGeneratePost(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const usage = await getMonthlyUsage(userId);
    if (!usage.canGenerate) {
      return {
        allowed: false,
        reason: `You have reached your monthly limit of ${usage.maxGenerated} post generations on the ${usage.plan.name} plan. Upgrade to Pro for unlimited generation.`,
      };
    }
    return { allowed: true };
  } catch (e) {
    return { allowed: true };
  }
}

export async function checkCanPublishPost(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const usage = await getMonthlyUsage(userId);
    if (!usage.canPublish) {
      return {
        allowed: false,
        reason: `You have reached your monthly limit of ${usage.maxPublished} published posts on the ${usage.plan.name} plan. Upgrade to Pro for unlimited publishing.`,
      };
    }
    return { allowed: true };
  } catch (e) {
    return { allowed: true };
  }
}

export async function incrementUsage(userId: string, type: 'GENERATE' | 'PUBLISH') {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);

    await prisma.usageRecord.upsert({
      where: {
        userId_periodMonth: {
          userId,
          periodMonth: currentMonth,
        },
      },
      update: {
        postsGenerated: type === 'GENERATE' ? { increment: 1 } : undefined,
        postsPublished: type === 'PUBLISH' ? { increment: 1 } : undefined,
      },
      create: {
        userId,
        periodMonth: currentMonth,
        postsGenerated: type === 'GENERATE' ? 1 : 0,
        postsPublished: type === 'PUBLISH' ? 1 : 0,
      },
    });
  } catch (e) {}
}
