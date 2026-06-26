'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Play, Pause, RotateCcw, Clock } from 'lucide-react';

export default function TimerWidget() {
  
  const [inputHrs, setInputHrs] = useState(0);
  const [inputMins, setInputMins] = useState(5);
  const [inputSecs, setInputSecs] = useState(0);

  
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  
  const triggerAlarm = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const playBeep = (startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, startTime); 
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      
      playBeep(ctx.currentTime, 0.25);
      playBeep(ctx.currentTime + 0.3, 0.25);
      playBeep(ctx.currentTime + 0.6, 0.4);
    } catch (e) {
      console.warn('Audio Context error (needs user interaction first):', e);
    }
  };

  
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            triggerAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  
  const adjustHrs = (amount: number) => {
    if (isRunning) return;
    setInputHrs((prev) => Math.max(0, Math.min(99, prev + amount)));
  };

  const adjustMins = (amount: number) => {
    if (isRunning) return;
    setInputMins((prev) => {
      const newVal = prev + amount;
      if (newVal > 59) return 0;
      if (newVal < 0) return 59;
      return newVal;
    });
  };

  const adjustSecs = (amount: number) => {
    if (isRunning) return;
    setInputSecs((prev) => {
      const newVal = prev + amount;
      if (newVal > 59) return 0;
      if (newVal < 0) return 59;
      return newVal;
    });
  };

  
  const handleToggle = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      const total = inputHrs * 3600 + inputMins * 60 + inputSecs;
      if (total <= 0) return;
      
      if (remainingSeconds === 0) {
        setTotalSeconds(total);
        setRemainingSeconds(total);
      }
      setIsRunning(true);
    }
  };

  
  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(0);
    setTotalSeconds(0);
  };

  
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return {
      hStr: h.toString().padStart(2, '0'),
      mStr: m.toString().padStart(2, '0'),
      sStr: s.toString().padStart(2, '0'),
      full: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
    };
  };

  const activeTime = isRunning || remainingSeconds > 0 ? remainingSeconds : (inputHrs * 3600 + inputMins * 60 + inputSecs);
  const timeStrings = formatTime(activeTime);

  
  
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 100;
  const strokeOffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="glass-card rounded-[28px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-red-500/10 glow-coral text-white h-full relative overflow-hidden">
      
      {}
      <div className="absolute top-0 left-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />

      {}
      <div className="relative w-40 h-40 md:w-44 md:h-44 flex items-center justify-center shrink-0">
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="coralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6B6B" />
              <stop offset="100%" stopColor="#FD5F5F" />
            </linearGradient>
          </defs>
          {}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="7"
          />
          {}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke="url(#coralGradient)"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeOffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear filter drop-shadow-[0_0_8px_rgba(255,107,107,0.35)]"
          />
        </svg>
        {}
        <div className="absolute font-mono text-xl md:text-2xl font-black select-none tracking-widest text-[#FF6B6B] drop-shadow-[0_0_8px_rgba(255,107,107,0.3)]">
          {timeStrings.full}
        </div>
      </div>

      {}
      <div className="flex flex-col items-center md:items-start gap-2 select-none shrink-0 relative z-10">
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Quick Presets</span>
        <div className="grid grid-cols-3 gap-2">
          {[1, 3, 5, 10, 15, 30].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                if (isRunning) setIsRunning(false);
                setInputHrs(0);
                setInputMins(mins);
                setInputSecs(0);
                setRemainingSeconds(0);
                setTotalSeconds(0);
              }}
              className="bg-white/5 hover:bg-white/10 hover:border-red-400/40 border border-white/5 rounded-xl px-3 py-1.5 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer text-center select-none active:scale-95"
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="flex flex-col justify-center space-y-4 w-full md:max-w-[220px] relative z-10 shrink-0">
        
        {}
        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-widest select-none">
          <Clock size={12} className="text-zinc-500" />
          Countdown Control
        </div>

        {}
        <div className="flex justify-between items-center text-center">
          
          {}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1 select-none font-bold">Hours</span>
            <button 
              onClick={() => adjustHrs(1)} 
              disabled={isRunning}
              className={`hover:text-[#FF6B6B] transition-colors p-1 cursor-pointer bg-white/5 border border-white/5 rounded-md ${
                isRunning ? 'opacity-20 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <ChevronUp size={16} />
            </button>
            <span className="text-3xl font-bold select-none w-12 tracking-tighter my-1">
              {isRunning || remainingSeconds > 0 ? timeStrings.hStr : inputHrs.toString().padStart(2, '0')}
            </span>
            <button 
              onClick={() => adjustHrs(-1)} 
              disabled={isRunning}
              className={`hover:text-[#FF6B6B] transition-colors p-1 cursor-pointer bg-white/5 border border-white/5 rounded-md ${
                isRunning ? 'opacity-20 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <span className="text-xl font-light text-zinc-700 mb-1 select-none">:</span>

          {}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1 select-none font-bold">Mins</span>
            <button 
              onClick={() => adjustMins(1)} 
              disabled={isRunning}
              className={`hover:text-[#FF6B6B] transition-colors p-1 cursor-pointer bg-white/5 border border-white/5 rounded-md ${
                isRunning ? 'opacity-20 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <ChevronUp size={16} />
            </button>
            <span className="text-3xl font-bold select-none w-12 tracking-tighter my-1">
              {isRunning || remainingSeconds > 0 ? timeStrings.mStr : inputMins.toString().padStart(2, '0')}
            </span>
            <button 
              onClick={() => adjustMins(-1)} 
              disabled={isRunning}
              className={`hover:text-[#FF6B6B] transition-colors p-1 cursor-pointer bg-white/5 border border-white/5 rounded-md ${
                isRunning ? 'opacity-20 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <span className="text-xl font-light text-zinc-700 mb-1 select-none">:</span>

          {}
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1 select-none font-bold">Secs</span>
            <button 
              onClick={() => adjustSecs(1)} 
              disabled={isRunning}
              className={`hover:text-[#FF6B6B] transition-colors p-1 cursor-pointer bg-white/5 border border-white/5 rounded-md ${
                isRunning ? 'opacity-20 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <ChevronUp size={16} />
            </button>
            <span className="text-3xl font-bold select-none w-12 tracking-tighter my-1">
              {isRunning || remainingSeconds > 0 ? timeStrings.sStr : inputSecs.toString().padStart(2, '0')}
            </span>
            <button 
              onClick={() => adjustSecs(-1)} 
              disabled={isRunning}
              className={`hover:text-[#FF6B6B] transition-colors p-1 cursor-pointer bg-white/5 border border-white/5 rounded-md ${
                isRunning ? 'opacity-20 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <ChevronDown size={16} />
            </button>
          </div>

        </div>

        {}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleToggle}
            className="flex-1 bg-[#FF6B6B] hover:bg-red-400 text-white font-bold py-2.5 px-4 rounded-xl text-center transition-all duration-300 tracking-wide text-xs cursor-pointer shadow-md hover:shadow-red-500/10 flex items-center justify-center gap-1.5 select-none active:scale-[0.98]"
          >
            {isRunning ? (
              <>
                <Pause size={14} />
                Pause
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                Start
              </>
            )}
          </button>
          
          {(remainingSeconds > 0 || isRunning) && (
            <button
              onClick={handleReset}
              className="bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-white font-semibold px-3 border border-zinc-800 hover:border-zinc-600 rounded-xl text-center transition-all text-xs cursor-pointer select-none flex items-center justify-center gap-1 active:scale-[0.98]"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
