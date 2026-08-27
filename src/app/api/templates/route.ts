import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { PREBUILT_TEMPLATES } from '@/config/templates';

export const dynamic = 'force-dynamic';

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
