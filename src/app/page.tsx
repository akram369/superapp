'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { User, Mail, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { registerUser, loginUser, user, isLoggedIn, selectedCategories } = useAppStore();

  
  const [isLoginView, setIsLoginView] = useState(false);

  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [agreedToShare, setAgreedToShare] = useState(false);

  
  const [errors, setErrors] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    agreedToShare: '',
  });

  
  useEffect(() => {
    if (isLoggedIn && user) {
      if (selectedCategories.length >= 3) {
        router.push('/dashboard');
      } else {
        router.push('/categories');
      }
    }
  }, [isLoggedIn, user, selectedCategories, router]);

  
  useEffect(() => {
    setErrors({
      name: '',
      username: '',
      email: '',
      mobile: '',
      agreedToShare: '',
    });
  }, [isLoginView]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      username: '',
      email: '',
      mobile: '',
      agreedToShare: '',
    };

    if (isLoginView) {
      
      if (!username.trim()) {
        newErrors.username = 'Username is required';
        isValid = false;
      }
      setErrors(newErrors);
      return isValid;
    }

    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!mobileRegex.test(mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
      isValid = false;
    }

    if (!agreedToShare) {
      newErrors.agreedToShare = 'You must agree to share registration data';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      if (isLoginView) {
        const success = await loginUser(username);
        if (success) {
          const store = useAppStore.getState();
          if (store.selectedCategories.length >= 3) {
            router.push('/dashboard');
          } else {
            router.push('/categories');
          }
        } else {
          setErrors(prev => ({
            ...prev,
            username: 'Account does not exist or username is incorrect',
          }));
        }
      } else {
        const success = await registerUser({
          name,
          username,
          email,
          mobile,
          agreedToShare,
        });
        if (success) {
          router.push('/categories');
        } else {
          setErrors(prev => ({
            ...prev,
            username: 'Registration failed or Username already exists',
          }));
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10 font-sans relative overflow-hidden">
      
      {}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-emerald-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-purple-950/15 blur-[120px] pointer-events-none" />

      {}
      <div className="w-full max-w-5xl glass-card rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10 min-h-[600px] border border-white/5">
        
        {}
        <div 
          className="relative flex-1 p-8 md:p-16 flex flex-col justify-between min-h-[350px] md:min-h-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(6, 9, 28, 0.9) 0%, rgba(4, 5, 10, 0.4) 100%), url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200')`,
          }}
        >
          {}
          <div className="flex items-center space-x-2 select-none">
            <span className="text-2xl font-black text-brand-green tracking-wide drop-shadow-md">
              SUPER.APP
            </span>
          </div>

          {}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 glow-green max-w-[400px] space-y-4 transform hover:scale-[1.02] transition-transform duration-300">
            <span className="bg-emerald-500/10 text-brand-green font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
              NEW RELEASE
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Discover new things on <span className="text-brand-green">Superapp</span>
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              Unlock a hyper-personalized cockpit dashboard loaded with real-time weather analytics, alarm integrations, note tracking, and curated entertainment discovery.
            </p>
          </div>

          {}
          <div className="flex items-center space-x-6 text-zinc-500 text-xs">
            <span>Powered by Next.js 15</span>
            <span>•</span>
            <span>Secure & Local Storage</span>
          </div>
        </div>

        {}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center bg-black/45 backdrop-blur-md">
          <div className="w-full max-w-[400px] mx-auto space-y-8">
            
            {}
            <div className="space-y-2 select-none">
              <h2 className="text-4xl font-bold tracking-tight text-white flex items-center gap-2">
                {isLoginView ? 'Welcome Back' : 'Get Started'}
                <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-ping" />
              </h2>
              <p className="text-zinc-400 text-sm font-medium">
                {isLoginView ? 'Log in to access your custom cockpit.' : 'Create a customized account in seconds.'}
              </p>
            </div>

            {}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {}
              {!isLoginView && (
                <>
                  {}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-0 ${
                        errors.name ? 'border-red-500/60 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1 font-medium select-none">{errors.name}</p>
                    )}
                  </div>
                </>
              )}

              {}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none font-bold text-xs select-none">
                  @
                </span>
                <input
                  type="text"
                  placeholder="UserName"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-0 ${
                    errors.username ? 'border-red-500/60 focus:border-red-500' : ''
                  }`}
                />
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1 font-medium select-none">{errors.username}</p>
                )}
              </div>

              {!isLoginView && (
                <>
                  {}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-0 ${
                        errors.email ? 'border-red-500/60 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1 font-medium select-none">{errors.email}</p>
                    )}
                  </div>

                  {}
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
                      <Smartphone size={16} />
                    </span>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className={`w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-0 ${
                        errors.mobile ? 'border-red-500/60 focus:border-red-500' : ''
                      }`}
                    />
                    {errors.mobile && (
                      <p className="text-xs text-red-500 mt-1 font-medium select-none">{errors.mobile}</p>
                    )}
                  </div>

                  {}
                  <div className="space-y-1">
                    <label className="flex items-center space-x-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreedToShare}
                        onChange={(e) => setAgreedToShare(e.target.checked)}
                        className="w-4 h-4 rounded bg-zinc-950 border border-zinc-800 checked:bg-brand-green checked:border-transparent focus:ring-0 focus:outline-none accent-brand-green cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-zinc-400 font-medium">
                        Share my registration data with Superapp
                      </span>
                    </label>
                    {errors.agreedToShare && (
                      <p className="text-xs text-red-500 font-medium select-none">{errors.agreedToShare}</p>
                    )}
                  </div>
                </>
              )}

              {}
              <button
                type="submit"
                className="w-full bg-brand-green hover:bg-[#059669] hover:scale-[1.01] text-white font-bold py-3.5 px-4 rounded-xl tracking-wider uppercase transition-all duration-300 text-sm cursor-pointer shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 select-none animate-pulse-glow"
              >
                {isLoginView ? 'Log In' : 'Sign Up Now'}
                <ArrowRight size={16} />
              </button>
            </form>

            {}
            <div className="text-center select-none">
              <button
                type="button"
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                {isLoginView ? (
                  <>
                    Don&apos;t have an account yet?{' '}
                    <span className="text-brand-green font-bold hover:underline">Register here</span>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <span className="text-brand-green font-bold hover:underline">Log in here</span>
                  </>
                )}
              </button>
            </div>

            {}
            <div className="space-y-2.5 text-[10px] text-zinc-500 leading-normal border-t border-white/5 pt-4 select-none">
              <p className="flex items-start gap-1.5">
                <ShieldCheck size={14} className="text-brand-green shrink-0 mt-0.5" />
                <span>
                  By signing up, you agree to the Superapp{' '}
                  <a href="#" className="text-brand-green hover:underline">
                    Terms & Conditions
                  </a>.
                </span>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
