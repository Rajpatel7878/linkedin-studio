export type PostTone = 'professional' | 'bold' | 'casual' | 'story' | 'educational';

export type PostAngle = 'storytelling' | 'listicle' | 'bold-hook';

export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'QUEUED_RATE_LIMITED' | 'PUBLISHED' | 'FAILED';

export interface ContentTemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  hookPattern: string;
  bodyPattern: string;
  ctaPattern: string;
  isPrebuilt: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostItem {
  id: string;
  topic: string;
  content: string;
  tone: string;
  angle?: string | null;
  status: PostStatus;
  scheduledAt: string | null;
  publishedAt: string | null;
  linkedinPostUrn: string | null;
  imageUrl: string | null;
  mediaType: string | null;
  errorMessage: string | null;
  retryCount: number;
  lastRetryAt: string | null;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  hookScore?: number | null;
  readability?: string | null;
  createdAt: string;
  updatedAt: string;
  voiceProfileId: string | null;
  voiceProfile?: VoiceProfileItem | null;
  templateId?: string | null;
  template?: ContentTemplateItem | null;
}

export interface VoiceSampleItem {
  id: string;
  title: string;
  content: string;
  notes: string | null;
  tags: string | null;
  createdAt: string;
  voiceProfileId: string | null;
}

export interface VoiceProfileItem {
  id: string;
  name: string;
  isDefault: boolean;
  instructions: string | null;
  styleSummary?: string | null;
  samples: VoiceSampleItem[];
  createdAt: string;
  updatedAt: string;
}

export interface LinkedInAccountConfig {
  id: string;
  isConnected: boolean;
  isSandboxMode: boolean;
  memberUrn: string | null;
  name: string | null;
  headline: string | null;
  profilePictureUrl: string | null;
  accessToken: string | null;
  clientId: string | null;
  redirectUri: string | null;
  dailyPostCount: number;
  dailyPostLimit: number;
  lastResetDate: string | null;
}

export interface GeneratePostRequest {
  topic: string;
  angles?: PostAngle[];
  tones?: PostTone[];
  targetAudience?: string;
  keyTakeaway?: string;
  callToAction?: string;
  voiceProfileId?: string;
  templateId?: string;
  customInstructions?: string;
  length?: 'short' | 'medium' | 'long';
}

export interface GeneratedDraftOption {
  angle: PostAngle;
  angleLabel: string;
  tone: PostTone;
  toneLabel: string;
  hook: string;
  content: string;
  characterCount: number;
  seeMoreIndex: number;
  estimatedReadTime: string;
  suggestedHashtags: string[];
}

export interface GeneratePostResponse {
  success: boolean;
  drafts: GeneratedDraftOption[];
  modelUsed: string;
  voiceUsed: boolean;
  templateUsed?: string | null;
  error?: string;
}

export interface AISuggestionsResponse {
  hookScore: number;
  hookRating: 'Needs Work' | 'Good' | 'High-Converting' | 'Viral';
  hookAnalysis: string;
  alternativeHooks: string[];
  readability: {
    gradeLevel: string;
    avgSentenceLength: number;
    jargonFound: string[];
  };
  suggestedHashtags: string[];
  bestPostingTime: string;
  similarPostIdeas: string[];
  carouselSuggestion?: {
    isApplicable: boolean;
    reason: string;
    slideCount: number;
    previewCards: { slideNumber: number; headline: string; body: string }[];
  };
}

export interface GraphicCardConfig {
  cardType?: 'headline' | 'quote' | 'stat';
  headline: string;
  subtext?: string;
  statNumber?: string;
  statLabel?: string;
  categoryTag?: string;
  authorName?: string;
  authorTitle?: string;
  authorAvatar?: string;
  theme: 'dark-luxe' | 'gradient-indigo' | 'minimal-ivory' | 'bold-crimson' | 'emerald-growth' | 'ocean-deep';
  aspectRatio: '1:1' | '4:5' | '16:9';
  showWatermark?: boolean;
}

export interface AnalyticsSummary {
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  draftPosts: number;
  totalImpressions: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageEngagementRate: number;
  topPerformingPost?: PostItem | null;
  impressionsByDay: { date: string; impressions: number; reactions: number }[];
  dayOfWeekBreakdown: { day: string; count: number; avgEngagement: number }[];
  topTemplates: { name: string; postCount: number; avgImpressions: number }[];
  topVoices: { name: string; postCount: number; avgEngagement: number }[];
}
