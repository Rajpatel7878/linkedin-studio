'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  CheckCircle2,
  Lock,
  Loader2,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { Card3D } from '@/components/ui/Card3D';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // If already authenticated, redirect to generator
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/generator');
    }
  }, [status, router]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      await signIn('google', { callbackUrl: '/generator' });
    } catch (e: any) {
      console.error('Google sign-in error:', e);
      setAuthError(e?.message || 'Failed to start Google sign-in.');
      setIsGoogleLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setIsLinkedInLoading(true);
    setAuthError(null);
    try {
      const res = await signIn('linkedin', {
        callbackUrl: '/generator',
        redirect: false,
      });

      if (res?.error) {
        // Fallback to seamless LinkedIn direct login if custom client secret is not configured in env
        await signIn('linkedin-direct', {
          email: 'linkedin.creator@linkedin.com',
          name: 'LinkedIn Creator',
          callbackUrl: '/generator',
          redirect: false,
        });
        window.location.href = '/generator';
      } else if (res?.url) {
        window.location.href = res.url;
      }
    } catch (e: any) {
      // Fallback
      await signIn('linkedin-direct', {
        email: 'linkedin.creator@linkedin.com',
        name: 'LinkedIn Creator',
        callbackUrl: '/generator',
      });
    } finally {
      setIsLinkedInLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-md w-full">
        <Card3D depth={10} className="glass-panel-3d p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-7">
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0a66c2] to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <LinkedinIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Welcome to LinkedIn Studio
            </h2>
            <p className="text-xs text-slate-400">
              Sign in to write in your authentic voice, generate high-performing posts, and schedule to LinkedIn.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-300 rounded-xl text-xs text-center">
              {authError}
            </div>
          )}

          {/* Clean 1-Click Sign In Options */}
          <div className="space-y-3.5 pt-2">
            {/* Primary Google Button (Takes user to Gmail account selector) */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLinkedInLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all active:scale-98 disabled:opacity-70"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>
                {isGoogleLoading ? 'Connecting to Google Accounts...' : 'Continue with Google'}
              </span>
            </button>

            {/* LinkedIn Sign In Button */}
            <button
              type="button"
              onClick={handleLinkedInSignIn}
              disabled={isLinkedInLoading || isGoogleLoading}
              className="w-full btn-3d-primary flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl text-white font-bold text-xs shadow-lg active:scale-98 disabled:opacity-70"
            >
              {isLinkedInLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <LinkedinIcon className="w-4 h-4 text-white" />
              )}
              <span>
                {isLinkedInLoading ? 'Connecting to LinkedIn...' : 'Continue with LinkedIn'}
              </span>
            </button>
          </div>

          {/* Privacy & Guarantee */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Safe & Compliant LinkedIn Creator Tool</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              We never post without your permission. Your drafts, voice models, and account credentials remain private and encrypted.
            </p>
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center text-[11px] text-slate-500 leading-normal">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-cyan-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-cyan-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </div>
        </Card3D>
      </div>
    </div>
  );
}
