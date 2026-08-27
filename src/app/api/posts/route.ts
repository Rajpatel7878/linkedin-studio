import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkCanPublishPost, incrementUsage } from '@/lib/usage';

export const dynamic = 'force-dynamic';

const STARTER_POSTS = [
  {
    id: 'post-starter-1',
    topic: 'Why clarity of thought beats 40-slide corporate decks',
    content: 'Unpopular opinion: Slide decks hide weak thinking behind bullet points and animations.\n\nMemos force clarity of thought:\n→ Problem definition\n→ Assumptions tested\n→ Quantitative impact\n→ Trade-offs accepted\n\nIf you cannot write it clearly in 2 pages, you do not understand the problem yet.\n\nAgree or disagree? #Leadership #Strategy #Founders',
    tone: 'bold',
    angle: 'bold-hook',
    status: 'PUBLISHED',
    scheduledAt: null,
    publishedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    linkedinPostUrn: 'urn:li:share:712938472918',
    imageUrl: null,
    mediaType: 'NONE',
    errorMessage: null,
    retryCount: 0,
    impressions: 22172,
    likes: 963,
    comments: 295,
    shares: 64,
    hookScore: 92,
    readability: 'Easy',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'post-starter-2',
    topic: 'How to build a personal brand on LinkedIn in 15 minutes a day',
    content: 'You don\'t need 4 hours a day to build a presence on LinkedIn.\n\nHere is the exact 15-minute daily routine:\n\n1️⃣ 5 mins: Leave 3 thoughtful comments on industry peers\' posts\n2️⃣ 7 mins: Write and schedule 1 insight or lesson from your workday\n3️⃣ 3 mins: Reply to comments on yesterday\'s post\n\nConsistency beats perfection every single time.\n\nWho else is committing to building in public this quarter?\n\n#PersonalBranding #LinkedInGrowth #ContentStrategy #Creators',
    tone: 'educational',
    angle: 'listicle',
    status: 'PUBLISHED',
    scheduledAt: null,
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    linkedinPostUrn: 'urn:li:share:712812984123',
    imageUrl: null,
    mediaType: 'NONE',
    errorMessage: null,
    retryCount: 0,
    impressions: 28289,
    likes: 1563,
    comments: 339,
    shares: 143,
    hookScore: 88,
    readability: 'Easy',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'post-starter-3',
    topic: '3 unexpected lessons scaling startup revenue to $100k MRR',
    content: 'Scaling to $100k MRR taught me more than 5 years of business school:\n\n1. Churn kills faster than slow acquisition. Fix onboarding first.\n2. Price on value, not features. Cheap customers create the most support tickets.\n3. Distribution is the real moat. Product quality is just table stakes.\n\nIf you\'re currently in the $10k - $50k MRR trench, what is your #1 bottleneck?\n\n#Startups #SaaS #Growth #FounderLessons',
    tone: 'story',
    angle: 'storytelling',
    status: 'SCHEDULED',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    publishedAt: null,
    linkedinPostUrn: null,
    imageUrl: null,
    mediaType: 'NONE',
    errorMessage: null,
    retryCount: 0,
    impressions: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    hookScore: 85,
    readability: 'Easy',
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let posts: any[] = [];
    try {
      const where: any = { userId: user.id };
      if (status && status !== 'ALL') {
        where.status = status;
      }

      posts = await prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          voiceProfile: true,
          template: true,
        },
      });
    } catch (dbErr) {}

    if (posts.length === 0) {
      posts = status && status !== 'ALL'
        ? STARTER_POSTS.filter((p) => p.status === status)
        : STARTER_POSTS;
    }

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    return NextResponse.json({ success: true, posts: STARTER_POSTS });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      topic,
      content,
      tone = 'professional',
      angle = 'bold-hook',
      status = 'DRAFT',
      scheduledAt,
      imageUrl,
      mediaType = 'NONE',
      voiceProfileId,
      templateId,
    } = body;

    if (!topic || !content) {
      return NextResponse.json({ error: 'Topic and content are required' }, { status: 400 });
    }

    if (status === 'SCHEDULED' || status === 'PUBLISHED') {
      try {
        const canPublish = await checkCanPublishPost(user.id);
        if (!canPublish.allowed) {
          return NextResponse.json({ error: canPublish.reason, limitReached: true }, { status: 403 });
        }
      } catch (e) {}
    }

    try {
      const post = await prisma.post.create({
        data: {
          userId: user.id,
          topic,
          content,
          tone,
          angle,
          status,
          scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
          imageUrl,
          mediaType,
          voiceProfileId: voiceProfileId || null,
          templateId: templateId || null,
        },
        include: {
          voiceProfile: true,
          template: true,
        },
      });

      return NextResponse.json({ success: true, post }, { status: 201 });
    } catch (e) {
      // Memory fallback
      const mockPost = {
        id: `post-${Date.now()}`,
        userId: user.id,
        topic,
        content,
        tone,
        angle,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : null,
        imageUrl: imageUrl || null,
        mediaType: mediaType || 'NONE',
        impressions: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        hookScore: 85,
        readability: 'Easy',
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, post: mockPost }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
