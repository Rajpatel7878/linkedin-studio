const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PREBUILT_TEMPLATES = [
  {
    name: 'Personal Intro / "Hi LinkedIn"',
    category: 'career',
    description: 'Authentic introduction to your journey, mission, what you build, and who you want to connect with.',
    hookPattern: 'It’s about time I properly introduced myself to my LinkedIn network.',
    bodyPattern: 'Here is a quick snapshot of my journey so far:\n\n• What I do: [Current role and focus]\n• What I’m building: [Current exciting projects]\n• What I care about: [Core industry passions]\n• Where I failed: [A candid vulnerability or lesson]\n\nMy goal on here is simple: share raw learnings, connect with high-agency builders, and exchange ideas.',
    ctaPattern: 'If you’re working in [industry/niche], drop a comment or connect — I’d love to know what you’re building right now.',
    isPrebuilt: true,
  },
  {
    name: 'Career Milestone / New Role Announcement',
    category: 'career',
    description: 'Celebrate a promotion, new venture, or milestone with humility, gratitude, and future vision.',
    hookPattern: 'Some personal news: after [time/reflection], I’m starting a new chapter as [Role/Venture].',
    bodyPattern: 'Looking back, the path here wasn’t linear.\n\nWhen I first started [initial stage], I never expected to [milestone reached].\n\n3 key lessons that got me to this point:\n1. [Key lesson 1]\n2. [Key lesson 2]\n3. [Key lesson 3]\n\nA huge thank you to [Mentors/Team] who supported me through every challenge.',
    ctaPattern: 'Excited for what’s ahead. Here’s to building the future together. 🚀',
    isPrebuilt: true,
  },
  {
    name: 'Lesson Learned / Failure Story',
    category: 'story',
    description: 'Vulnerable turnaround narrative: mistake $\\rightarrow$ realization $\\rightarrow$ framework $\\rightarrow$ outcome.',
    hookPattern: '3 years ago, I made a mistake that cost us [time/money/energy]. Here’s what happened:',
    bodyPattern: 'I thought [initial wrong assumption].\n\nInstead:\n❌ [Negative symptom 1]\n❌ [Negative symptom 2]\n\nThe turning point came when [Realization]:\n→ [Shift 1]\n→ [Shift 2]\n→ [Shift 3]\n\nFailure is only wasted if you don’t extract the lesson.',
    ctaPattern: 'Have you ever had to unlearn something the hard way? What was your turning point?',
    isPrebuilt: true,
  },
  {
    name: 'Listicle ("5 Things I Learned About X")',
    category: 'framework',
    description: 'High-density, actionable insights formatted with clean bullet points and emojis.',
    hookPattern: 'I spent [X months/years] studying [Topic]. Here are 5 things nobody tells you:',
    bodyPattern: '1️⃣ [Insight 1 — counterintuitive truth]\n2️⃣ [Insight 2 — actionable rule]\n3️⃣ [Insight 3 — common mistake to avoid]\n4️⃣ [Insight 4 — system to implement]\n5️⃣ [Insight 5 — long-term perspective]\n\n💡 Summary takeaway: [One-line distilled wisdom].',
    ctaPattern: 'Which of these 5 resonates most with your current focus? Bookmark this for later.',
    isPrebuilt: true,
  },
  {
    name: 'Contrarian Take / Hot Take',
    category: 'opinion',
    description: 'Challenging an accepted industry cliché with sharp logic and real-world alternatives.',
    hookPattern: 'Unpopular opinion: Most people are approaching [Topic] completely backwards.',
    bodyPattern: 'Every guru on LinkedIn tells you to [Conventional advice].\n\nHere’s why that’s broken in 2026:\n→ [Critique 1]\n→ [Critique 2]\n\nWhat actually works instead:\n• [Alternative 1]\n• [Alternative 2]\n\nStop optimizing for vanity metrics and start building real leverage.',
    ctaPattern: 'Do you agree or disagree? Let’s debate in the comments below.',
    isPrebuilt: true,
  },
  {
    name: 'Behind-the-Scenes / Build in Public',
    category: 'growth',
    description: 'Transparent walkthrough of metrics, decisions, and challenges from building in public.',
    hookPattern: 'Behind the scenes of building [Product/Project]: Here are our exact numbers this month.',
    bodyPattern: 'Transparency is our superpower. Here is the raw breakdown:\n\n📈 The Wins:\n• [Win 1]\n• [Win 2]\n\n📉 The Headaches:\n• [Challenge 1]\n• [Challenge 2]\n\nWhat we’re shipping next week: [Upcoming priority].',
    ctaPattern: 'Building in public is messy, but worth it. What’s one feature you’d love to see next?',
    isPrebuilt: true,
  },
  {
    name: 'Poll / Engagement Question',
    category: 'engagement',
    description: 'Low-friction, conversation-sparking inquiry on a timely industry debate.',
    hookPattern: 'Quick question for [Target Audience]: How are you handling [Current Dilemma]?',
    bodyPattern: 'I’ve been hearing two completely different perspectives:\n\nOption A: [Perspective 1]\nOption B: [Perspective 2]\n\nPersonally, I lean toward [Personal take] because [Reasoning]. But the trade-offs are real.',
    ctaPattern: 'Drop your vote: Are you Team A or Team B? Curious to hear why.',
    isPrebuilt: true,
  },
  {
    name: 'Case Study / Project Breakdown',
    category: 'framework',
    description: 'Detailed analysis of a specific win or client turnaround with measurable data.',
    hookPattern: 'How we helped [Client/User] achieve [Impressive Metric] in just [Timeframe]:',
    bodyPattern: 'The Challenge:\n[Brief problem context]\n\nThe 3-Step Strategy:\n1. Diagnosis: [What was audited]\n2. Execution: [What changed]\n3. Optimization: [How it was scaled]\n\nThe Results:\n🚀 [Metric 1]\n🚀 [Metric 2]\n🚀 [Metric 3]',
    ctaPattern: 'Want the full breakdown checklist? Leave a comment and I’ll send it over.',
    isPrebuilt: true,
  },
];

async function main() {
  console.log('Seeding multi-tenant SaaS database...');

  // 1. Seed Prebuilt Content Templates
  for (const tpl of PREBUILT_TEMPLATES) {
    const existing = await prisma.contentTemplate.findFirst({
      where: { name: tpl.name, isPrebuilt: true },
    });
    if (!existing) {
      await prisma.contentTemplate.create({ data: tpl });
    }
  }

  // 2. Create Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      id: 'demo-user-id',
      email: 'alex@example.com',
      name: 'Alex Rivera',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: 'pro',
      role: 'USER',
    },
  });

  // 3. Create Demo Voice Profiles for Demo User
  let defaultVoice = await prisma.voiceProfile.findFirst({
    where: { userId: demoUser.id, isDefault: true },
  });

  if (!defaultVoice) {
    defaultVoice = await prisma.voiceProfile.create({
      data: {
        userId: demoUser.id,
        name: 'Bold Founder & Builder',
        isDefault: true,
        instructions:
          'Short 1-sentence paragraphs. Bold contrarian hooks. Arrow bullet points (→). Zero corporate fluff. Open-ended discussion questions.',
        styleSummary: 'Tone: Direct, High-Agency. Sentence Length: 6-12 words. Emoji Use: Moderate (→, 💡, 🚀). Hooks: Problem-oriented, scroll-stopping.',
        samples: {
          create: [
            {
              title: 'Building Products & Execution',
              content: `Most people overcomplicate building in public.

Here is the simple framework I use:
→ Ship small features every week
→ Talk to 3 customers before writing code
→ Share the messy learnings, not just the wins
→ Obsess over retention, not vanity signups

The best product strategy is consistent momentum.

What is the biggest lesson you learned shipping this year?`,
              tags: 'product, startup, growth',
            },
            {
              title: 'Career Mindset & Compound Growth',
              content: `3 habits that 10x my productivity:

1. The "1-Thing" Rule
Every morning, identify the single task that makes everything else easier or unnecessary. Do that before checking email.

2. Zero-Meeting Mornings
Protect deep focus time from 8am to 12pm.

3. Async-first Updates
Replace 30-minute status meetings with 2-minute Loom/text updates.

Time is your most valuable non-renewable asset. Protect it ruthlessly.

How do you protect your focus during high-pressure weeks?`,
              tags: 'productivity, mindset, leadership',
            },
          ],
        },
      },
    });
  }

  // 4. Create Linked LinkedIn Account for Demo User
  await prisma.linkedInAccount.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      isConnected: true,
      isSandboxMode: true,
      name: 'Alex Rivera',
      headline: 'Founder & Tech Strategist | Building the Future of AI',
      profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      dailyPostCount: 1,
      dailyPostLimit: 25,
      lastResetDate: new Date().toISOString().split('T')[0],
    },
  });

  // 5. Create Sample Published & Scheduled Posts for Demo User
  const existingPost = await prisma.post.findFirst({ where: { userId: demoUser.id } });
  if (!existingPost) {
    await prisma.post.create({
      data: {
        userId: demoUser.id,
        topic: 'Why remote engineering teams fail when they mimic in-office meetings',
        content: `Most companies got remote work completely backwards.

They took 8 hours of in-office calendar clutter and pasted it into Zoom calls.

The best remote teams operate on 3 simple principles:
→ Default to written asynchronous memos
→ Measure output and shipped impact, not green Slack dots
→ Reserve live calls only for brainstorming and 1-on-1 coaching

When you give top talent autonomy and clear boundaries, velocity 3x's.

What is the biggest friction point in your team's remote setup?

#RemoteWork #EngineeringLeadership #FutureOfWork #Productivity`,
        tone: 'bold',
        angle: 'bold-hook',
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 3 * 86400000),
        linkedinPostUrn: 'urn:li:share:712938472918',
        impressions: 22172,
        likes: 963,
        comments: 295,
        shares: 64,
        voiceProfileId: defaultVoice.id,
      },
    });

    await prisma.post.create({
      data: {
        userId: demoUser.id,
        topic: 'How to build a personal brand on LinkedIn in 15 minutes a day',
        content: `You don't need 4 hours a day to build a presence on LinkedIn.

Here is the exact 15-minute daily routine:

1️⃣ 5 mins: Leave 3 thoughtful comments on industry peers' posts
2️⃣ 7 mins: Write and schedule 1 insight or lesson from your workday
3️⃣ 3 mins: Reply to comments on yesterday's post

Consistency beats perfection every single time.

Who else is committing to building in public this quarter?

#PersonalBranding #LinkedInGrowth #ContentStrategy #Creators`,
        tone: 'educational',
        angle: 'listicle',
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 5 * 86400000),
        linkedinPostUrn: 'urn:li:share:712812984123',
        impressions: 28289,
        likes: 1563,
        comments: 339,
        shares: 143,
      },
    });

    await prisma.post.create({
      data: {
        userId: demoUser.id,
        topic: '3 unexpected lessons scaling startup revenue to $100k MRR',
        content: `Scaling to $100k MRR taught me more than 5 years of business school:

1. Churn kills faster than slow acquisition. Fix onboarding first.
2. Price on value, not features. Cheap customers create the most support tickets.
3. Distribution is the real moat. Product quality is just table stakes.

If you're currently in the $10k - $50k MRR trench, what is your #1 bottleneck?

#Startups #SaaS #Growth #FounderLessons`,
        tone: 'story',
        angle: 'storytelling',
        status: 'SCHEDULED',
        scheduledAt: new Date(Date.now() + 86400000),
      },
    });
  }

  // 6. Seed Initial Usage Record for Demo User
  const currentMonth = new Date().toISOString().slice(0, 7);
  await prisma.usageRecord.upsert({
    where: {
      userId_periodMonth: {
        userId: demoUser.id,
        periodMonth: currentMonth,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      periodMonth: currentMonth,
      postsGenerated: 3,
      postsPublished: 2,
    },
  });

  console.log('Multi-tenant seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
