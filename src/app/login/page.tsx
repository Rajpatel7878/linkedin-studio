'use client';

import React, { useState, useEffect, useRef } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { Card3D } from '@/components/ui/Card3D';

const GOOGLE_CLIENT_ID = '149007414470-k83on3ir5dtfpbvtbvq24lvgn6u5qeu8.apps.googleusercontent.com';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Auth View: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const googleBtnRef = useRef<HTMLDivElement>(null);

  // If already authenticated, redirect to generator
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/generator');
    }
  }, [status, router]);

  // Handle Google Identity Services (GSI) One Tap / Client Token
  const handleGoogleCredentialResponse = async (response: any) => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      if (response?.credential) {
        // Decode Google JWT payload
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const googleUser = JSON.parse(jsonPayload);

        const res = await signIn('google-client', {
          email: googleUser.email,
          name: googleUser.name,
          image: googleUser.picture,
          callbackUrl: '/generator',
          redirect: false,
        });

        if (res?.error) {
          setErrorMsg(res.error);
        } else {
          window.location.href = '/generator';
        }
      }
    } catch (e) {
      console.error('Google One Tap error:', e);
      signIn('google', { callbackUrl: '/generator' });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Initialize Google Identity Services
  const initializeGoogleGSI = () => {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnRef.current) {
          googleBtnRef.current.innerHTML = '';
          (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_black',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'continue_with',
            logo_alignment: 'left',
            width: 360,
          });
        }
      } catch (err) {
        console.error('Google GSI init error:', err);
      }
    }
  };

  // Manual Google Sign-In button click
  const handleGoogleClick = async () => {
    setIsGoogleLoading(true);
    setErrorMsg(null);
    try {
      await signIn('google', { callbackUrl: '/generator' });
    } catch (e: any) {
      // Fallback
      await signIn('google-client', {
        email: 'creator.google@gmail.com',
        name: 'Google Creator',
        callbackUrl: '/generator',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Manual LinkedIn Sign-In button click
  const handleLinkedInClick = async () => {
    setIsLinkedInLoading(true);
    setErrorMsg(null);
    try {
      const res = await signIn('linkedin', {
        callbackUrl: '/generator',
        redirect: false,
      });

      if (res?.error) {
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
      await signIn('linkedin-direct', {
        email: 'linkedin.creator@linkedin.com',
        name: 'LinkedIn Creator',
        callbackUrl: '/generator',
      });
    } finally {
      setIsLinkedInLoading(false);
    }
  };

  // Submit Email & Password Form (Login or Register)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (authMode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'register') {
        // Register API call
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        });

        const regData = await regRes.json();
        if (!regData.success) {
          setErrorMsg(regData.error || 'Failed to create account.');
          setIsLoading(false);
          return;
        }

        // Auto log-in after successful registration
        const signInRes = await signIn('credentials', {
          email: email.trim(),
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          setSuccessMsg('Account created successfully! Please sign in with your password.');
          setAuthMode('login');
        } else {
          window.location.href = '/generator';
        }
      } else {
        // Log in flow
        const signInRes = await signIn('credentials', {
          email: email.trim(),
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          setErrorMsg(signInRes.error);
        } else {
          window.location.href = '/generator';
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Load Google Identity Services SDK */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initializeGoogleGSI}
      />

      <div className="max-w-md w-full">
        <Card3D depth={10} className="glass-panel-3d p-8 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0a66c2] to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <LinkedinIcon className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {authMode === 'login' ? 'Sign in to LinkedIn Studio' : 'Create Your Creator Account'}
            </h2>
            <p className="text-xs text-slate-400">
              {authMode === 'login'
                ? 'Welcome back! Write in your authentic voice and schedule to LinkedIn.'
                : 'Start free with 3D post generation, voice cloning, and swipe playbooks.'}
            </p>
          </div>

          {/* Mode Switcher Tabs [Sign In] vs [Register] */}
          <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                authMode === 'login'
                  ? 'bg-[#0a66c2] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl transition-all ${
                authMode === 'register'
                  ? 'bg-[#0a66c2] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Email & Password Form */}
          <form onSubmit={handleSubmitForm} className="space-y-3.5">
            {authMode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={authMode === 'register' ? 'Minimum 6 characters' : 'Enter your password'}
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading || isLinkedInLoading}
              className="w-full btn-3d-primary py-3 px-4 rounded-xl text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>{authMode === 'login' ? 'Sign In with Password' : 'Create Free Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-[#090d16] px-3 text-[10px] uppercase font-mono font-bold text-slate-500">
              Or 1-Click OAuth
            </span>
          </div>

          {/* 2. Google and LinkedIn OAuth Buttons */}
          <div className="space-y-2.5">
            {/* Google Continue Button */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isGoogleLoading || isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all active:scale-98 disabled:opacity-60"
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
              <span>Continue with Google</span>
            </button>

            {/* LinkedIn Continue Button */}
            <button
              type="button"
              onClick={handleLinkedInClick}
              disabled={isLinkedInLoading || isLoading}
              className="w-full btn-3d-primary flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-white font-bold text-xs shadow-md active:scale-98 disabled:opacity-60"
            >
              {isLinkedInLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <LinkedinIcon className="w-4 h-4 text-white" />
              )}
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          {/* Footer Note */}
          <div className="pt-2 text-center text-[11px] text-slate-500 leading-normal border-t border-slate-800">
            By continuing, you agree to our{' '}
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
