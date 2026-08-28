import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://linkedin-studio-gules.vercel.app'),
  title: {
    default: 'Content to Post on LinkedIn — #1 Free AI LinkedIn Post Generator & Studio',
    template: '%s | LinkedIn Studio',
  },
  description:
    'Need high-performing content to post on LinkedIn? Generate viral, high-converting LinkedIn posts in seconds with AI. 8 viral templates, personal voice cloner, visual stat cards, and 1-click scheduling.',
  keywords: [
    'content to post on linkedin',
    'what to post on linkedin',
    'linkedin post generator',
    'linkedin ai post generator',
    'linkedin content generator',
    'ideas for linkedin posts',
    'viral linkedin post generator',
    'how to write linkedin posts',
    'ai writing tool for linkedin',
    'linkedin hook generator',
    'linkedin post scheduler',
    'b2b linkedin content',
    'grow linkedin audience',
  ],
  authors: [{ name: 'LinkedIn Studio Team' }],
  creator: 'LinkedIn Studio',
  publisher: 'LinkedIn Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://linkedin-studio-gules.vercel.app',
  },
  openGraph: {
    title: 'Content to Post on LinkedIn — #1 Free AI Post Generator & Studio',
    description:
      'Turn rough ideas into viral, high-converting LinkedIn posts in seconds. Voice cloner, hook scorer, visual graphics, and 1-click scheduling.',
    url: 'https://linkedin-studio-gules.vercel.app',
    siteName: 'LinkedIn Studio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'LinkedIn Studio — AI Content Generator for LinkedIn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Content to Post on LinkedIn — #1 Free AI Post Generator & Studio',
    description:
      'Generate viral LinkedIn posts, visual cards, and schedules in seconds in your authentic voice.',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google1356ca983175fb32',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://linkedin-studio-gules.vercel.app/#webapp',
      name: 'LinkedIn Studio — AI Content Creator',
      url: 'https://linkedin-studio-gules.vercel.app',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1280',
        bestRating: '5',
        worstRating: '1',
      },
      description:
        'The #1 AI post generator for LinkedIn. Create viral posts, clone your authentic tone, generate stat cards, and schedule directly.',
    },
    {
      '@type': 'Organization',
      '@id': 'https://linkedin-studio-gules.vercel.app/#organization',
      name: 'LinkedIn Studio',
      url: 'https://linkedin-studio-gules.vercel.app',
      logo: 'https://linkedin-studio-gules.vercel.app/favicon.ico',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the best content to post on LinkedIn?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The best content to post on LinkedIn includes storytelling lessons, contrarian industry insights, actionable listicles, build-in-public metrics, and career milestones that capture attention within the first 210 characters.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I generate high-converting LinkedIn posts with AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Simply enter your rough topic into LinkedIn Studio, choose an angle (Bold Hook, Listicle, or Story), and our AI will craft 3 complete formatted variations with viral hook scoring.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I publish directly to LinkedIn?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! LinkedIn Studio integrates with LinkedIn OAuth 2.0 to publish or schedule posts directly to your profile with 1 click.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark bg-[#090d16]">
      <head>
        <meta name="google-site-verification" content="google1356ca983175fb32" />
        <meta name="google-site-verification" content="1356ca983175fb32" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-[#090d16] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <AuthProvider>
          <div className="flex h-screen overflow-hidden bg-[#090d16]">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#090d16]">
              <Navbar />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090d16]">
                <div className="max-w-7xl mx-auto w-full">{children}</div>
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
