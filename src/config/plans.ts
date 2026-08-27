export interface PlanConfig {
  id: 'free' | 'pro' | 'team';
  name: string;
  badge?: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
  limits: {
    postsGeneratedPerMonth: number; // e.g. 15 for free, -1 for unlimited
    postsPublishedPerMonth: number; // e.g. 5 for free, -1 for unlimited
    voiceProfilesLimit: number; // 1 for free, 10 for pro, 50 for team
    watermarkOnImages: boolean; // true for free, false for pro/team
    aiSuggestionsPanel: boolean;
    teamSeats: number;
    analyticsHistoryDays: number;
  };
  features: string[];
}

export const PLANS: Record<'free' | 'pro' | 'team', PlanConfig> = {
  free: {
    id: 'free',
    name: 'Starter Free',
    description: 'Perfect for creators experimenting with AI-powered LinkedIn content.',
    priceMonthly: 0,
    priceAnnual: 0,
    limits: {
      postsGeneratedPerMonth: 15,
      postsPublishedPerMonth: 5,
      voiceProfilesLimit: 1,
      watermarkOnImages: true,
      aiSuggestionsPanel: true,
      teamSeats: 1,
      analyticsHistoryDays: 7,
    },
    features: [
      '15 AI post generations / month',
      '5 scheduled & published posts / month',
      '1 custom Voice Style profile',
      'All 8 prebuilt content templates',
      'Live Hook Strength & AI suggestions panel',
      'Visual Card Studio (with watermark)',
      '7-day basic analytics',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro Creator',
    badge: 'Most Popular',
    description: 'For founders, executives, and creators scaling their personal brand.',
    priceMonthly: 29,
    priceAnnual: 24, // $24/mo billed annually ($288/yr)
    stripePriceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly_placeholder',
    stripePriceIdAnnual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual_placeholder',
    limits: {
      postsGeneratedPerMonth: -1, // Unlimited
      postsPublishedPerMonth: -1, // Unlimited
      voiceProfilesLimit: 15,
      watermarkOnImages: false,
      aiSuggestionsPanel: true,
      teamSeats: 1,
      analyticsHistoryDays: 365,
    },
    features: [
      'Unlimited AI post generations',
      'Unlimited scheduled & published posts',
      '15 custom Voice Profiles & Style Cloner',
      'Automated "Learn My Voice" DNA extraction',
      'No watermark on visual cards & PNGs',
      'Custom Content Templates creation',
      'Priority LinkedIn rate-limit queueing',
      '365-day advanced analytics & topic trends',
    ],
  },
  team: {
    id: 'team',
    name: 'Team & Agency',
    badge: 'Scale',
    description: 'For agencies, marketing teams, and executive ghostwriters.',
    priceMonthly: 79,
    priceAnnual: 65, // $65/mo billed annually
    stripePriceIdMonthly: process.env.STRIPE_TEAM_MONTHLY_PRICE_ID || 'price_team_monthly_placeholder',
    stripePriceIdAnnual: process.env.STRIPE_TEAM_ANNUAL_PRICE_ID || 'price_team_annual_placeholder',
    limits: {
      postsGeneratedPerMonth: -1,
      postsPublishedPerMonth: -1,
      voiceProfilesLimit: 50,
      watermarkOnImages: false,
      aiSuggestionsPanel: true,
      teamSeats: 5,
      analyticsHistoryDays: 365,
    },
    features: [
      'Everything in Pro Creator',
      'Up to 5 team member seats',
      'Shared team templates & voice library',
      'Multi-account LinkedIn management',
      'Dedicated Slack / Email priority support',
      'Custom branding & palette exporter',
    ],
  },
};

export function getPlanConfig(planId?: string | null): PlanConfig {
  if (planId === 'pro') return PLANS.pro;
  if (planId === 'team') return PLANS.team;
  return PLANS.free;
}
