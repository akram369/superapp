'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import ProfileWidget from '@/components/ProfileWidget';
import WeatherWidget from '@/components/WeatherWidget';
import NotesWidget from '@/components/NotesWidget';
import TimerWidget from '@/components/TimerWidget';
import NewsWidget from '@/components/NewsWidget';
import { ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, selectedCategories, logoutUser } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Set mounted flag to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth & Gatekeeping check
  useEffect(() => {
    if (mounted) {
      if (!isLoggedIn || !user) {
        router.push('/');
      } else if (selectedCategories.length < 3) {
        router.push('/categories');
      }
    }
  }, [mounted, isLoggedIn, user, selectedCategories, router]);

  if (!mounted || !user || selectedCategories.length < 3) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#05060d] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-green"></div>
      </div>
    );
  }

  const handleBrowse = () => {
    router.push('/movies');
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#05060d] text-white p-4 md:p-8 flex flex-col justify-between font-sans relative overflow-hidden">
      
      {/* Decorative Glow Spheres */}
      <div className="absolute top-[-30%] left-[-10%] w-[50%] h-[75%] rounded-full bg-emerald-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-10%] w-[50%] h-[75%] rounded-full bg-purple-950/15 blur-[120px] pointer-events-none" />

      {/* Top Console Branding (Sleek cockpit header) */}
      <header className="flex justify-between items-center mb-6 relative z-10 select-none border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2 text-zinc-400 font-semibold text-xs tracking-widest uppercase">
          <LayoutDashboard size={14} className="text-brand-green animate-pulse" />
          <span>Superapp Cockpit</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-zinc-500 font-mono font-bold hidden sm:inline">
            CONSOLE.V1.2
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 select-none"
          >
            <LogOut size={12} />
            Log Out
          </button>
        </div>
      </header>

      {/* Dashboard Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-stretch relative z-10">
        
        {/* Left 2 Columns Wrapper */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Col 1: Profile + Weather */}
          <div className="flex flex-col gap-6 justify-between h-full">
            <div className="flex-1 min-h-[220px]">
              <ProfileWidget />
            </div>
            <div className="flex-1 min-h-[160px]">
              <WeatherWidget />
            </div>
          </div>

          {/* Col 2: Notes */}
          <div className="h-full min-h-[350px] md:min-h-0">
            <NotesWidget />
          </div>

          {/* Bottom row: Timer (Spans across Col 1 and Col 2) */}
          <div className="md:col-span-2 min-h-[160px]">
            <TimerWidget />
          </div>

        </div>

        {/* Right Column: News Widget & Browse Action */}
        <div className="flex flex-col gap-4 h-full min-h-[450px] lg:min-h-0">
          <div className="flex-1">
            <NewsWidget />
          </div>
          
          {/* Browse Navigation Button */}
          <div className="flex justify-end shrink-0 select-none">
            <button
              onClick={handleBrowse}
              className="bg-brand-green hover:bg-emerald-600 text-white font-extrabold py-3 px-8 rounded-full border border-emerald-400/20 transition-all duration-300 tracking-wider text-xs uppercase cursor-pointer shadow-lg hover:shadow-emerald-500/10 flex items-center gap-1.5 active:scale-95 animate-pulse-glow"
            >
              Browse Movies
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
