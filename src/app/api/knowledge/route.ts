import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const DEFAULT_STARTER_DOCS = [
  {
    title: 'Viral LinkedIn Growth Playbook 2026',
    category: 'swipe_file',
    content: `High-Performance LinkedIn Writing Rules:
1. Opening Hook: First 210 characters must create curiosity, challenge common beliefs, or present specific numbers.
2. Whitespace: 1-2 sentence paragraphs maximum. Never post walls of text.
3. Bullet Frameworks: Use distinct bullets (→, ✦, •, ✓) to make advice skimmable.
4. Closing Engagement: Always end with a 1-sentence open-ended question to maximize comment velocity.
5. Hashtags: 3-5 relevant hashtags at the bottom.`,
    tags: 'playbook, frameworks, copywriting',
  },
  {
    title: 'B2B Founder Storytelling Archetypes',
    category: 'case_study',
    content: `3 Core Founder Story Archetypes for LinkedIn:
- The Vulnerable Mistake: "In 2024, I made a $50k hiring error. Here are the 3 red flags I missed..."
- The Behind-The-Scenes Metric: "How we achieved $20k MRR in 90 days with 0 paid ads..."
- The Contrarian Stance: "Why doing more 1-on-1 meetings is destroying engineering productivity..."`,
    tags: 'storytelling, founders, case studies',
  },
];

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    let docs = await prisma.knowledgeDocument.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    // If user has no docs yet, seed default starter docs
    if (docs.length === 0) {
      for (const starter of DEFAULT_STARTER_DOCS) {
        await prisma.knowledgeDocument.create({
          data: {
            userId: user.id,
            title: starter.title,
            category: starter.category,
            content: starter.content,
            tags: starter.tags,
          },
        });
      }
      docs = await prisma.knowledgeDocument.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ success: true, documents: docs });
  } catch (error: any) {
    console.error('Knowledge GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch knowledge documents' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { title, content, category, tags } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const doc = await prisma.knowledgeDocument.create({
      data: {
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        category: category || 'general',
        tags: tags?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error: any) {
    console.error('Knowledge POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create knowledge document' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Document ID is required' }, { status: 400 });
    }

    await prisma.knowledgeDocument.deleteMany({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Knowledge DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete knowledge document' },
      { status: 500 }
    );
  }
}
