'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Mail, User, Shield } from 'lucide-react';

export default function ProfileWidget() {
  const { user, selectedCategories } = useAppStore();

  if (!user) return null;

  return (
    <div className="glass-card rounded-[28px] p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-2xl text-white h-full relative overflow-hidden border border-white/5">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Avatar Image container with Neon Ring */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-brand-green/60 p-1 shrink-0 shadow-lg glow-green bg-black/40">
        <div className="w-full h-full rounded-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=vinay"
            alt="User Avatar"
            className="w-full h-full object-cover scale-110"
          />
        </div>
      </div>

      {/* Profile Details */}
      <div className="flex-1 flex flex-col justify-between h-full space-y-4 w-full text-center sm:text-left">
        <div className="space-y-1.5">
          {/* Status Badge */}
          <div className="flex justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-brand-green font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <Shield size={10} />
              Verified User
            </span>
          </div>
          <p className="text-xl font-bold tracking-tight text-white">{user.name}</p>
          <p className="text-xs text-zinc-400 font-medium break-all flex items-center justify-center sm:justify-start gap-1">
            <Mail size={12} className="text-zinc-500" />
            {user.email}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tighter text-zinc-200 mt-1">
            @{user.username}
          </h2>
        </div>

        {/* Selected Categories Grid */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
          {selectedCategories.map((category) => (
            <div
              key={category}
              className="bg-white/[0.03] border border-white/10 hover:border-brand-green/30 text-zinc-300 hover:text-white rounded-lg py-1 px-3 text-[10px] font-bold tracking-wide backdrop-blur-md transition-all select-none uppercase"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
