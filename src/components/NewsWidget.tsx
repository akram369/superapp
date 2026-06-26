'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  content: string;
  image: string;
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: 'Want to climb Mount Everest?',
    date: '2-20-2023 | 07:35 PM',
    content: "In the years since human beings first reached the summit of Mount Everest in 1953, climbing the world's highest mountain has changed dramatically. Today, hundreds of mountaineers manage the feat each year thanks to improvements in knowledge, technology, and the significant infrastructure provided by commercially guided expeditions that provide a veritable highway up the mountain for those willing to accept both the risks and the rewards...",
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600',
  },
  {
    id: 2,
    title: "NASA's James Webb Captures Stellar Nursery",
    date: '6-24-2026 | 11:20 AM',
    content: 'The James Webb Space Telescope has captured a stunning new image of a nearby stellar nursery, revealing never-before-seen details of infant stars and cosmic dust. Researchers say this new perspective will help scientists better understand the early stages of star formation and chemical evolution in our galaxy. The image shows glowing clouds of molecular hydrogen and dust pillars stretching across light-years of space, acting as stellar nurseries...',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600',
  },
  {
    id: 3,
    title: 'Generative AI Reshapes Software Development',
    date: '6-24-2026 | 09:15 AM',
    content: 'Software engineering is undergoing a massive shift as agentic AI developers assist coders worldwide. Studies show code generation models increase productivity by up to 50% for standard tasks, allowing software engineers to focus on architecture, system design, and product experience. Experts believe that the future of engineering is collaborative pair-programming where agents run verification suites and deploy code autonomously...',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600',
  },
  {
    id: 4,
    title: 'New Breakthrough in Gene Editing Technologies',
    date: '6-23-2026 | 04:45 PM',
    content: 'Scientists have announced a major breakthrough in CRISPR gene-editing, successfully correcting genetic mutations in laboratory settings with near-zero off-target effects. This advancement brings us one step closer to treating complex hereditary disorders that were previously considered untreatable, giving new hope to millions of patients suffering from genetic diseases globally. Clinical trials are expected to commence early next year...',
    image: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?q=80&w=600',
  },
  {
    id: 5,
    title: 'Deep Ocean Exploration Discovers New Species',
    date: '6-22-2026 | 02:10 PM',
    content: 'A marine exploration crew diving in the Mariana Trench has cataloged over 20 new bioluminescent species living at depths of 8,000 meters. The discoveries include translucent deep-sea creatures, unique soft corals, and extremophilic bacteria that thrive in the crushing pressure and complete darkness of the deep ocean floor. Researchers emphasize the importance of protecting these delicate ecosystems from seabed mining and climate changes...',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=600',
  },
];

export default function NewsWidget() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % NEWS_ARTICLES.length);
        setFade(true);
      }, 300);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const currentArticle = NEWS_ARTICLES[index];

  return (
    <div className="glass-card rounded-[28px] overflow-hidden shadow-2xl flex flex-col h-full border border-white/5 bg-[#0b0c16]/50">
      
      {/* Top portion: Image with text overlay */}
      <div className="relative h-[220px] sm:h-[240px] md:h-[260px] w-full shrink-0 overflow-hidden border-b border-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentArticle.image}
          alt="News Visual"
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            fade ? 'opacity-100' : 'opacity-60'
          }`}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05060d] via-[#05060d]/50 to-transparent" />
        
        {/* News Feed Category Badge */}
        <div className="absolute top-4 left-4 bg-black/60 text-brand-green font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md select-none flex items-center gap-1">
          <Newspaper size={10} />
          Hot Feed
        </div>

        {/* Text Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-5 text-white space-y-1.5 transition-opacity duration-300 ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}>
          <h3 className="text-lg md:text-xl font-extrabold leading-tight text-white drop-shadow-md select-none">
            {currentArticle.title}
          </h3>
          <p className="text-[10px] sm:text-xs text-zinc-400 font-bold tracking-wide select-none">
            {currentArticle.date}
          </p>
        </div>
      </div>

      {/* Bottom portion: Text content */}
      <div className="flex-1 p-5 overflow-y-auto bg-black/10 select-text">
        <p className={`text-xs md:text-sm leading-relaxed text-zinc-300 font-medium tracking-wide transition-opacity duration-300 ${
          fade ? 'opacity-100' : 'opacity-0'
        }`}>
          {currentArticle.content}
        </p>
      </div>
    </div>
  );
}
