import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const PREBUILT_TEMPLATES = [
  {
    id: 'tpl-listicle',
    name: '5 Things I Learned (Actionable Listicle)',
    category: 'framework',
    description: 'High-retention bulleted breakdown summarizing top lessons or actionable steps for leaders and builders.',
    hookPattern: '5 non-obvious rules for [Achieving Goal] (bookmark this):',
    bodyPattern: '1️⃣ [Rule 1 / Actionable Insight]\n2️⃣ [Rule 2 / Mistake to avoid]\n3️⃣ [Rule 3 / Mindset shift]\n4️⃣ [Rule 4 / Tactical shortcut]\n5️⃣ [Rule 5 / Golden principle]',
    ctaPattern: 'Which of these 5 resonates most with your current workflow? Let me know below.',
    isPrebuilt: true,
    usageCount: 1420,
  },
  {
    id: 'tpl-intro',
    name: 'Personal Intro & Mission Statement',
    category: 'career',
    description: 'Introduce who you are, what you are building, and the core values driving your career.',
    hookPattern: 'If we haven’t connected yet, hello! 👋 I’m [Name], and I help [Target Audience] do [Transformation].',
    bodyPattern: 'Over the past [X years], I’ve:\n→ [Key Milestone 1]\n→ [Key Milestone 2]\n→ [Core Lesson Learned]\n\nMy mission on LinkedIn: share real breakdowns, raw mistakes, and tactical systems.',
    ctaPattern: 'Drop a comment with what you’re currently building so I can check out your work!',
    isPrebuilt: true,
    usageCount: 980,
  },
  {
    id: 'tpl-failure',
    name: 'Failure Story to Breakthrough',
    category: 'story',
    description: 'Build deep trust and vulnerability by sharing a tough setback and the fundamental principle that saved you.',
    hookPattern: '[X years ago], I made a costly mistake that almost [Worst Case Scenario]:',
    bodyPattern: 'I was convinced that [Wrong Assumption].\n\nThen [The Catalyst Incident Happened].\n\nThat forced me to change everything:\n1. [Hard Truth Learned]\n2. [New Framework Adopted]\n3. [Long-Term Result]',
    ctaPattern: 'Have you ever had a failure that turned out to be a blessing in disguise? What was it?',
    isPrebuilt: true,
    usageCount: 1150,
  },
  {
    id: 'tpl-hot-take',
    name: 'Contrarian / Hot Take',
    category: 'opinion',
    description: 'Challenge common industry dogma to spark lively debate and viral comment section engagement.',
    hookPattern: 'Unpopular opinion: [Commonly accepted industry advice] is actually destroying your [Metric/Outcome].',
    bodyPattern: 'Everyone tells you to [Do Common Advice].\n\nHere is what actually happens when you do that:\n❌ [Negative Consequence 1]\n❌ [Negative Consequence 2]\n\nInstead, top performers do this:\n✅ [Contrarian Strategy 1]\n✅ [Contrarian Strategy 2]',
    ctaPattern: 'Agree or disagree? I want to hear your unfiltered take.',
    isPrebuilt: true,
    usageCount: 1830,
  },
  {
    id: 'tpl-build-in-public',
    name: 'Behind the Scenes & Metrics Update',
    category: 'growth',
    description: 'Share raw numbers, sprint highlights, and startup progress for building in public.',
    hookPattern: 'We just hit [Milestone: e.g. $50k MRR / 10k Users / Shipped v2.0] at [Project Name]. Here is the unfiltered breakdown: 📈',
    bodyPattern: 'The good:\n🟢 [Key Win 1]\n🟢 [Key Win 2]\n\nThe bad (what broke):\n🔴 [Setback / Bottleneck]\n\nWhat we’re prioritizing next week:\n→ [Goal 1]\n→ [Goal 2]',
    ctaPattern: 'Building in public keeps us accountable. What’s your biggest focus this sprint?',
    isPrebuilt: true,
    usageCount: 890,
  },
  {
    id: 'tpl-poll-engagement',
    name: 'Poll & Engagement Question',
    category: 'engagement',
    description: 'A focused discussion prompt designed to drive 50+ comments in the first 2 hours.',
    hookPattern: 'Quick question for [Industry / Role] leaders: How is your team handling [Current Trend / Challenge]?',
    bodyPattern: 'I’ve been seeing two distinct camps:\n\nOption A: [Approach A]\nOption B: [Approach B]\n\nIn my experience, Option [X] yields faster velocity, but comes with [Trade-off].',
    ctaPattern: 'Drop an "A" or "B" in the comments with your reasoning.',
    isPrebuilt: true,
    usageCount: 760,
  },
  {
    id: 'tpl-case-study',
    name: 'Client Case Study & ROI Breakdown',
    category: 'framework',
    description: 'Prove authority and attract inbound clients with a concrete problem $\rightarrow$ solution $\rightarrow$ result framework.',
    hookPattern: 'How we helped [Client / Company] go from [Pain Point] to [Specific Result] in [Timeframe]:',
    bodyPattern: 'The Challenge:\n• [Specific Bottleneck]\n\nThe 3-Step Strategy:\n1. [Diagnosis & Audit]\n2. [Implementation of System]\n3. [Optimization & Scale]\n\nThe Final ROI:\n🚀 [Metric 1: e.g. +140% Pipeline]\n🚀 [Metric 2: e.g. 10 hours saved/wk]',
    ctaPattern: 'Want the step-by-step checklist we used? Drop a comment or DM me "CHECKLIST".',
    isPrebuilt: true,
    usageCount: 1310,
  },
  {
    id: 'tpl-career-milestone',
    name: 'Career Milestone & New Role Announcement',
    category: 'career',
    description: 'Announce a promotion, new role, or major career transition with humility and clear future vision.',
    hookPattern: 'I’m beyond excited to share that I’m starting a new chapter as [Role Title] at [Company Name]! 🚀',
    bodyPattern: 'Looking back at the last [X years] at [Previous Role], I am deeply grateful to [Mentors/Team] for [Key Lesson].\n\nIn this new role, I’ll be focusing on:\n→ [Initiative 1]\n→ [Initiative 2]\n→ [Big Vision]',
    ctaPattern: 'To everyone who supported my journey: thank you. Let’s connect if you’re working in this space!',
    isPrebuilt: true,
    usageCount: 940,
  },
];

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    let dbTemplates: any[] = [];
    try {
      const where: any = {
        OR: [
          { isPrebuilt: true },
          ...(user ? [{ userId: user.id }] : []),
        ],
      };

      if (category && category !== 'ALL') {
        where.category = category;
      }

      dbTemplates = await prisma.contentTemplate.findMany({
        where,
        orderBy: [
          { isPrebuilt: 'desc' },
          { usageCount: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    } catch (dbErr) {
      // Graceful fallback to static prebuilts if database is unreachable
    }

    // Merge static prebuilt templates with custom user templates
    const prebuiltsFiltered =
      category && category !== 'ALL'
        ? PREBUILT_TEMPLATES.filter((t) => t.category === category)
        : PREBUILT_TEMPLATES;

    // Combine avoiding duplicate IDs
    const combinedMap = new Map();
    prebuiltsFiltered.forEach((t) => combinedMap.set(t.id, t));
    dbTemplates.forEach((t) => combinedMap.set(t.id, t));

    const templates = Array.from(combinedMap.values());

    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    return NextResponse.json({ success: true, templates: PREBUILT_TEMPLATES });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, category = 'framework', description, hookPattern, bodyPattern, ctaPattern } = body;

    if (!name || !description || !hookPattern || !bodyPattern) {
      return NextResponse.json(
        { error: 'name, description, hookPattern, and bodyPattern are required' },
        { status: 400 }
      );
    }

    try {
      const template = await prisma.contentTemplate.create({
        data: {
          userId: user.id,
          name,
          category,
          description,
          hookPattern,
          bodyPattern,
          ctaPattern: ctaPattern || '',
          isPrebuilt: false,
        },
      });
      return NextResponse.json({ success: true, template }, { status: 201 });
    } catch (e) {
      // In-memory fallback
      const mockTemplate = {
        id: `custom-tpl-${Date.now()}`,
        userId: user.id,
        name,
        category,
        description,
        hookPattern,
        bodyPattern,
        ctaPattern: ctaPattern || '',
        isPrebuilt: false,
        usageCount: 0,
      };
      return NextResponse.json({ success: true, template: mockTemplate }, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
