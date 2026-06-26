'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { AlertTriangle, X, Check, Film } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  bgColorClass: string;
  glowColor: string;
  borderColor: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'Action',
    name: 'Action',
    bgColorClass: 'bg-gradient-to-br from-amber-600/40 to-[#FF5E3A]/80',
    glowColor: 'rgba(255, 94, 58, 0.5)',
    borderColor: 'border-[#FF5E3A]/40',
    image: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=300',
  },
  {
    id: 'Drama',
    name: 'Drama',
    bgColorClass: 'bg-gradient-to-br from-[#D7A4FF]/30 to-[#9B51E0]/80',
    glowColor: 'rgba(215, 164, 255, 0.5)',
    borderColor: 'border-[#D7A4FF]/40',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=300',
  },
  {
    id: 'Romance',
    name: 'Romance',
    bgColorClass: 'bg-gradient-to-br from-emerald-800/40 to-[#14852F]/80',
    glowColor: 'rgba(20, 133, 47, 0.5)',
    borderColor: 'border-emerald-500/40',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=300',
  },
  {
    id: 'Thriller',
    name: 'Thriller',
    bgColorClass: 'bg-gradient-to-br from-sky-600/30 to-[#58a6ff]/80',
    glowColor: 'rgba(132, 194, 255, 0.5)',
    borderColor: 'border-[#84C2FF]/40',
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=300',
  },
  {
    id: 'Western',
    name: 'Western',
    bgColorClass: 'bg-gradient-to-br from-[#A13E1B]/35 to-amber-900/80',
    glowColor: 'rgba(161, 62, 27, 0.5)',
    borderColor: 'border-[#A13E1B]/40',
    image: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?q=80&w=300',
  },
  {
    id: 'Horror',
    name: 'Horror',
    bgColorClass: 'bg-gradient-to-br from-[#7358FF]/30 to-[#4F46E5]/80',
    glowColor: 'rgba(115, 88, 255, 0.5)',
    borderColor: 'border-[#7358FF]/40',
    image: 'https://images.unsplash.com/photo-1505635338263-f7f565b19a36?q=80&w=300',
  },
  {
    id: 'Fantasy',
    name: 'Fantasy',
    bgColorClass: 'bg-gradient-to-br from-[#FF4ADE]/30 to-pink-700/80',
    glowColor: 'rgba(255, 74, 222, 0.5)',
    borderColor: 'border-[#FF4ADE]/40',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300',
  },
  {
    id: 'Music',
    name: 'Music',
    bgColorClass: 'bg-gradient-to-br from-[#E61E2A]/30 to-rose-700/80',
    glowColor: 'rgba(230, 30, 42, 0.5)',
    borderColor: 'border-[#E61E2A]/40',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300',
  },
  {
    id: 'Fiction',
    name: 'Fiction',
    bgColorClass: 'bg-gradient-to-br from-emerald-600/30 to-[#059669]/80',
    glowColor: 'rgba(108, 208, 97, 0.5)',
    borderColor: 'border-[#6CD061]/40',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=300',
  },
];

export default function CategoriesPage() {
  const router = useRouter();
  const { user, isLoggedIn, selectedCategories, toggleCategory, removeCategory } = useAppStore();
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    setMounted(true);
  }, []);

  
  useEffect(() => {
    if (mounted && (!isLoggedIn || !user)) {
      router.push('/');
    }
  }, [mounted, isLoggedIn, user, router]);

  if (!mounted || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#05060d] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-green"></div>
      </div>
    );
  }

  const isGatekeepSatisfied = selectedCategories.length >= 3;

  const handleNextPage = () => {
    if (isGatekeepSatisfied) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#05060d] text-white p-6 lg:p-12 font-sans relative overflow-hidden">
      
      {}
      <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[70%] rounded-full bg-purple-950/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-30%] left-[-10%] w-[60%] h-[70%] rounded-full bg-emerald-950/15 blur-[120px] pointer-events-none" />

      {}
      <div className="flex flex-col justify-between w-full lg:w-1/3 mb-10 lg:mb-0 lg:pr-12 relative z-10">
        <div className="space-y-6">
          <div className="flex items-center space-x-2 select-none">
            <span className="text-xl font-black text-brand-green tracking-wide">
              SUPER.APP
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white select-none">
              Choose your <br className="hidden lg:block" />
              entertainment <br />
              <span className="text-brand-green">category</span>
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-[320px] select-none">
              Tell us what genres excite you. Select at least three categories to dynamically customize your dashboard experience.
            </p>
          </div>
          
          {}
          <div className="flex flex-wrap gap-2.5 mt-6">
            {selectedCategories.map((catName) => {
              const matchedCat = CATEGORIES.find(c => c.id === catName);
              return (
                <div
                  key={catName}
                  className="flex items-center space-x-2 bg-emerald-950/20 text-emerald-400 rounded-full px-4 py-2 text-xs font-bold border border-emerald-500/30 shadow-sm animate-fade-in select-none"
                >
                  <span>{catName}</span>
                  <button
                    onClick={() => removeCategory(catName)}
                    className="hover:bg-red-500/20 hover:text-red-400 rounded-full p-0.5 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {}
        <div className="mt-8 space-y-4">
          {!isGatekeepSatisfied && (
            <div className="flex items-center space-x-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-2xl p-4 text-xs font-semibold animate-pulse-glow max-w-[320px] select-none">
              <AlertTriangle size={18} className="shrink-0 text-yellow-500" />
              <span>Please select at least 3 categories to proceed.</span>
            </div>
          )}
          
          <button
            onClick={handleNextPage}
            disabled={!isGatekeepSatisfied}
            className={`w-full lg:w-auto bg-brand-green hover:bg-emerald-600 text-white font-bold py-3.5 px-10 rounded-full transition-all duration-300 tracking-wider text-sm cursor-pointer shadow-lg select-none ${
              !isGatekeepSatisfied 
                ? 'opacity-30 cursor-not-allowed border-none' 
                : 'hover:shadow-emerald-500/20 animate-pulse-glow'
            }`}
          >
            Next Page
          </button>
        </div>
      </div>

      {}
      <div className="flex-1 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            return (
              <div
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`relative rounded-3xl p-5 h-[160px] md:h-[190px] flex flex-col justify-between cursor-pointer select-none transition-all duration-500 border overflow-hidden ${
                  isSelected ? category.bgColorClass : 'glass-card hover:bg-white/[0.03]'
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 30px ${category.glowColor}` : 'none',
                  borderColor: isSelected ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
                }}
              >
                {}
                {isSelected && (
                  <div className="absolute inset-0 bg-white/5 opacity-50 pointer-events-none" />
                )}

                {}
                <div className="flex justify-between items-start z-10">
                  <h3 className="text-lg md:text-xl font-extrabold tracking-wide text-white drop-shadow-md">
                    {category.name}
                  </h3>
                  
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-md animate-scale-up">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Film size={10} className="text-zinc-500" />
                    </span>
                  )}
                </div>
                
                {}
                <div className="w-full h-[60%] relative overflow-hidden rounded-2xl z-10 border border-white/5 bg-zinc-950">
                  {}
                  <img
                    src={category.image}
                    alt={category.name}
                    className={`w-full h-full object-cover rounded-2xl transition-transform duration-700 ease-out hover:scale-110 ${
                      isSelected ? 'brightness-110' : 'brightness-75 opacity-70'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
