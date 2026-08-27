import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const where: any = {
      OR: [
        { isPrebuilt: true },
        ...(user ? [{ userId: user.id }] : []),
      ],
    };

    if (category && category !== 'ALL') {
      where.category = category;
    }

    const templates = await prisma.contentTemplate.findMany({
      where,
      orderBy: [
        { isPrebuilt: 'desc' },
        { usageCount: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, category = 'general', description, hookPattern, bodyPattern, ctaPattern } = body;

    if (!name || !description || !hookPattern || !bodyPattern) {
      return NextResponse.json(
        { error: 'name, description, hookPattern, and bodyPattern are required' },
        { status: 400 }
      );
    }

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
