import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const DEFAULT_QR_CONFIG = {
  qrCodeImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3Drajp37731%40okicici%26pn%3DLinkedIn%2520Studio%26cu%3DINR',
  upiId: 'rajp37731@okicici',
  accountName: 'LinkedIn Studio (rajp37731@okicici)',
  currency: 'INR',
  inrProMonthly: 999,
  inrProAnnual: 799,
  inrTeamMonthly: 2999,
  inrTeamAnnual: 2499,
  usdProMonthly: 29,
  usdProAnnual: 24,
  usdTeamMonthly: 79,
  usdTeamAnnual: 65,
  instructions: 'Scan using any UPI App (Google Pay, PhonePe, Paytm, BHIM, iMobile) or Banking App. After payment, enter the 12-digit UTR/Reference number below to immediately activate your plan.',
};

export async function GET() {
  let config = DEFAULT_QR_CONFIG;
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: 'PAYMENT_QR_CONFIG' },
    });

    if (setting?.value) {
      try {
        config = { ...DEFAULT_QR_CONFIG, ...JSON.parse(setting.value) };
      } catch (e) {}
    }
  } catch (e) {
    // Graceful fallback to default config
  }

  return NextResponse.json({ success: true, config });
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      qrCodeImageUrl,
      upiId,
      accountName,
      currency = 'INR',
      inrProMonthly,
      inrProAnnual,
      inrTeamMonthly,
      inrTeamAnnual,
      instructions,
    } = body;

    let current = DEFAULT_QR_CONFIG;
    try {
      const existingSetting = await prisma.appSetting.findUnique({
        where: { key: 'PAYMENT_QR_CONFIG' },
      });

      if (existingSetting?.value) {
        try {
          current = JSON.parse(existingSetting.value);
        } catch (e) {}
      }
    } catch (e) {}

    const updatedConfig = {
      ...current,
      qrCodeImageUrl: qrCodeImageUrl !== undefined ? qrCodeImageUrl : current.qrCodeImageUrl,
      upiId: upiId !== undefined ? upiId : current.upiId,
      accountName: accountName !== undefined ? accountName : current.accountName,
      currency: currency !== undefined ? currency : current.currency,
      inrProMonthly: inrProMonthly !== undefined ? Number(inrProMonthly) : current.inrProMonthly,
      inrProAnnual: inrProAnnual !== undefined ? Number(inrProAnnual) : current.inrProAnnual,
      inrTeamMonthly: inrTeamMonthly !== undefined ? Number(inrTeamMonthly) : current.inrTeamMonthly,
      inrTeamAnnual: inrTeamAnnual !== undefined ? Number(inrTeamAnnual) : current.inrTeamAnnual,
      instructions: instructions !== undefined ? instructions : current.instructions,
    };

    // If upiId is updated and no custom uploaded image is set, auto-generate dynamic QR
    if (upiId && (!qrCodeImageUrl || qrCodeImageUrl.includes('api.qrserver.com'))) {
      const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
        updatedConfig.accountName
      )}&cu=${updatedConfig.currency}`;
      updatedConfig.qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        upiUrl
      )}`;
    }

    try {
      await prisma.appSetting.upsert({
        where: { key: 'PAYMENT_QR_CONFIG' },
        update: { value: JSON.stringify(updatedConfig) },
        create: {
          key: 'PAYMENT_QR_CONFIG',
          value: JSON.stringify(updatedConfig),
        },
      });
    } catch (e) {}

    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (error: any) {
    return NextResponse.json({ success: true, config: DEFAULT_QR_CONFIG });
  }
}
