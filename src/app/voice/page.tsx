'use client';

import React, { useState, useEffect } from 'react';
import { VoiceSampleList } from '@/components/voice/VoiceSampleList';
import { VoiceProfileItem } from '@/types';
import { Loader2 } from 'lucide-react';

export default function VoicePage() {
  const [profile, setProfile] = useState<VoiceProfileItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/voice');
      const data = await res.json();
      if (data.success && data.defaultProfile) {
        setProfile(data.defaultProfile);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a66c2]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 text-center text-slate-500">
        Could not load voice profile.
      </div>
    );
  }

  return (
    <div className="pb-12">
      <VoiceSampleList profile={profile} onRefresh={fetchProfile} />
    </div>
  );
}
