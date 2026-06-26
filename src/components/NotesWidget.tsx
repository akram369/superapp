'use client';

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Edit3, HardDrive } from 'lucide-react';

export default function NotesWidget() {
  const { notes, saveNotes } = useAppStore();

  return (
    <div className="glass-card rounded-[28px] p-6 flex flex-col h-full shadow-2xl border border-amber-500/20 glow-gold relative overflow-hidden">
      
      {/* Visual cyber glow in top corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-4 select-none">
        <h2 className="text-xl font-bold tracking-wider text-amber-400 flex items-center gap-2 uppercase text-sm md:text-base">
          <Edit3 size={16} className="text-amber-400 animate-pulse" />
          Personal Log
        </h2>
        <span className="flex items-center gap-1 text-[10px] text-amber-500/60 font-mono font-bold">
          <HardDrive size={10} />
          AUTO_SYNC.IO
        </span>
      </div>
      
      {/* Writing Area */}
      <div className="flex-1 relative">
        <textarea
          value={notes}
          onChange={(e) => saveNotes(e.target.value)}
          placeholder="[SECURE NOTE ENTRY] This is how I am going to learn MERN Stack in next 3 months..."
          className="w-full h-full resize-none bg-black/20 text-amber-300 placeholder-amber-500/40 text-sm font-mono leading-relaxed focus:outline-none focus:ring-0 border border-amber-500/10 rounded-xl p-4 overflow-y-auto scrollbar-thin shadow-inner"
          style={{
            scrollbarColor: 'rgba(243, 199, 95, 0.3) transparent',
          }}
        />
      </div>
    </div>
  );
}
