import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fullData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        posts: {
          include: { snapshots: true },
        },
        voiceProfiles: {
          include: { samples: true },
        },
        contentTemplates: true,
        linkedInAccount: {
          select: {
            id: true,
            isConnected: true,
            isSandboxMode: true,
            memberUrn: true,
            name: true,
            headline: true,
            dailyPostCount: true,
            dailyPostLimit: true,
            updatedAt: true,
          },
        },
        usageRecords: true,
      },
    });

    const exportPayload = {
      exportMetadata: {
        exportedAt: new Date().toISOString(),
        formatVersion: '1.0',
        platform: 'LinkedIn AI Content Studio',
      },
      user: fullData,
    };

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="linkedin-studio-export-${user.id}-${Date.now()}.json"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
