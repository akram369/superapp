'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { MOVIE_CATALOG, Movie } from '@/data/movieCatalog';
import { X, Star, Film, User, Feather, Globe, Clock, Calendar, Clapperboard, LogOut } from 'lucide-react';

export default function MoviesPage() {
  const router = useRouter();
  const { user, isLoggedIn, selectedCategories, logoutUser } = useAppStore();
  const [mounted, setMounted] = useState(false);

  // Movie listings state
  const [moviesByGenre, setMoviesByGenre] = useState<Record<string, Movie[]>>({});
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Set mounted flag to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auth gate check
  useEffect(() => {
    if (mounted) {
      if (!isLoggedIn || !user) {
        router.push('/');
      } else if (selectedCategories.length < 3) {
        router.push('/categories');
      }
    }
  }, [mounted, isLoggedIn, user, selectedCategories, router]);

  // Fetch movies from OMDB if API key is provided, else use local catalog
  useEffect(() => {
    if (!mounted || selectedCategories.length < 3) return;

    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;

    const fetchAllMovies = async () => {
      setLoading(true);
      const moviesData: Record<string, Movie[]> = {};

      for (const genre of selectedCategories) {
        let genreMovies = [...(MOVIE_CATALOG[genre] || [])];

        if (apiKey) {
          try {
            const queryMap: Record<string, string> = {
              Action: 'Black Adam',
              Drama: 'Shawshank',
              Romance: 'Titanic',
              Thriller: 'Shutter Island',
              Western: 'Django',
              Horror: 'Annabelle',
              Fantasy: 'Harry Potter',
              Music: 'Whiplash',
              Fiction: 'Interstellar',
            };

            const searchWord = queryMap[genre] || genre;
            const res = await fetch(
              `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchWord}&type=movie`
            );
            const data = await res.json();

            if (data && data.Search && data.Search.length > 0) {
              const detailPromises = data.Search.slice(0, 4).map(async (item: { imdbID: string }) => {
                const detailRes = await fetch(
                  `https://www.omdbapi.com/?apikey=${apiKey}&i=${item.imdbID}&plot=short`
                );
                return detailRes.json();
              });

              const details = await Promise.all(detailPromises);
              
              const formattedMovies: Movie[] = details.map((m: any) => ({
                imdbID: m.imdbID,
                Title: m.Title,
                Year: m.Year,
                imdbRating: m.imdbRating || 'N/A',
                Genre: m.Genre || genre,
                Director: m.Director || 'N/A',
                Writer: m.Writer || 'N/A',
                Actors: m.Actors || 'N/A',
                Plot: m.Plot || 'N/A',
                Language: m.Language || 'N/A',
                Poster: m.Poster && m.Poster !== 'N/A' ? m.Poster : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=300',
              }));

              if (formattedMovies.length > 0) {
                genreMovies = formattedMovies;
              }
            }
          } catch (err) {
            console.warn(`Failed to fetch OMDB movies for ${genre}, using local catalog fallback.`, err);
          }
        }
        
        moviesData[genre] = genreMovies;
      }

      setMoviesByGenre(moviesData);
      setLoading(false);
    };

    fetchAllMovies();
  }, [mounted, selectedCategories]);

  // Click on a movie poster opens the modal
  const handleMovieClick = async (movie: Movie) => {
    const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;
    
    if (movie.imdbID.startsWith('act-') || movie.imdbID.startsWith('dra-') || movie.imdbID.startsWith('rom-') || 
        movie.imdbID.startsWith('thr-') || movie.imdbID.startsWith('wes-') || movie.imdbID.startsWith('hor-') || 
        movie.imdbID.startsWith('fan-') || movie.imdbID.startsWith('mus-') || movie.imdbID.startsWith('fic-') ||
        !apiKey) {
      setSelectedMovie(movie);
      return;
    }

    setModalLoading(true);
    setSelectedMovie(movie); 
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}&plot=full`);
      const fullData = await res.json();
      if (fullData && fullData.Response !== 'False') {
        setSelectedMovie({
          imdbID: fullData.imdbID,
          Title: fullData.Title,
          Year: fullData.Year,
          imdbRating: fullData.imdbRating || 'N/A',
          Genre: fullData.Genre || movie.Genre,
          Director: fullData.Director || movie.Director,
          Writer: fullData.Writer || movie.Writer,
          Actors: fullData.Actors || movie.Actors,
          Plot: fullData.Plot || movie.Plot,
          Language: fullData.Language || movie.Language,
          Poster: fullData.Poster && fullData.Poster !== 'N/A' ? fullData.Poster : movie.Poster,
        });
      }
    } catch (err) {
      console.warn('Failed to fetch full movie plot from OMDB.', err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  if (!mounted || !user || selectedCategories.length < 3) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#05060d] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-green"></div>
      </div>
    );
  }

  // Genre color shadows on hover
  const shadowColorMap: Record<string, string> = {
    Action: 'hover:shadow-[0_0_20px_rgba(255,94,58,0.25)] hover:border-[#FF5E3A]/40',
    Drama: 'hover:shadow-[0_0_20px_rgba(215,164,255,0.25)] hover:border-[#D7A4FF]/40',
    Romance: 'hover:shadow-[0_0_20px_rgba(20,133,47,0.25)] hover:border-emerald-500/40',
    Thriller: 'hover:shadow-[0_0_20px_rgba(132,194,255,0.25)] hover:border-[#84C2FF]/40',
    Western: 'hover:shadow-[0_0_20px_rgba(161,62,27,0.25)] hover:border-[#A13E1B]/40',
    Horror: 'hover:shadow-[0_0_20px_rgba(115,88,255,0.25)] hover:border-[#7358FF]/40',
    Fantasy: 'hover:shadow-[0_0_20px_rgba(255,74,222,0.25)] hover:border-[#FF4ADE]/40',
    Music: 'hover:shadow-[0_0_20px_rgba(230,30,42,0.25)] hover:border-[#E61E2A]/40',
    Fiction: 'hover:shadow-[0_0_20px_rgba(108,208,97,0.25)] hover:border-[#6CD061]/40',
  };

  return (
    <div className="min-h-screen bg-[#05060d] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      
      {/* Background Radial light spots */}
      <div className="absolute top-[-30%] left-[-10%] w-[50%] h-[70%] rounded-full bg-emerald-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-10%] w-[50%] h-[70%] rounded-full bg-purple-950/10 blur-[120px] pointer-events-none" />

      {/* Header Row */}
      <header className="flex justify-between items-center mb-10 select-none border-b border-white/5 pb-4 relative z-10">
        <h1 
          className="text-3xl font-logo text-brand-green tracking-wide cursor-pointer"
          onClick={() => router.push('/dashboard')}
        >
          Super app
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer active:scale-95 select-none"
          >
            <LogOut size={12} />
            Log Out
          </button>
          
          {/* User avatar linking back to dashboard */}
          <div 
            onClick={() => router.push('/dashboard')}
            className="w-10 h-10 md:w-11 h-11 rounded-full border-2 border-brand-green/60 p-0.5 cursor-pointer bg-zinc-800 shadow-md hover:shadow-emerald-500/20 transform hover:scale-105 transition-transform"
          >
            <div className="w-full h-full rounded-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://api.dicebear.com/7.x/adventurer/svg?seed=vinay"
                alt="User Profile"
                className="w-full h-full object-cover scale-110"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Page Title Header */}
      <div className="mb-10 space-y-2 relative z-10 select-none">
        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
          <Clapperboard size={12} className="text-brand-green" />
          Personalized Cinema Portal
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
          Entertainment according to your choice
        </h2>
      </div>

      {/* Movies Grid Rows */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3 relative z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-green"></div>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Syncing Movie Library...</p>
        </div>
      ) : (
        <div className="space-y-14 relative z-10">
          {selectedCategories.map((genre) => {
            const movies = moviesByGenre[genre] || [];
            const hoverShadowClass = shadowColorMap[genre] || 'hover:shadow-white/10';
            
            return (
              <section key={genre} className="space-y-4">
                <h3 className="text-lg md:text-xl font-black tracking-widest text-zinc-400 uppercase select-none flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-brand-green rounded-full shrink-0" />
                  {genre}
                </h3>
                
                {/* Horizontal grid rows */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <div
                      key={movie.imdbID}
                      onClick={() => handleMovieClick(movie)}
                      className={`group cursor-pointer rounded-2xl overflow-hidden border border-white/5 bg-[#0f1225]/45 backdrop-blur-md transition-all duration-500 transform hover:scale-[1.03] shadow-lg ${hoverShadowClass}`}
                    >
                      {/* Image container */}
                      <div className="relative aspect-[2/3] w-full bg-zinc-950 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={movie.Poster}
                          alt={movie.Title}
                          className="w-full h-full object-cover group-hover:brightness-110 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                      </div>
                      
                      {/* Caption text */}
                      <div className="p-4 select-none space-y-1">
                        <h4 className="text-xs md:text-sm font-bold truncate text-zinc-200 group-hover:text-white transition-colors">
                          {movie.Title}
                        </h4>
                        <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                          <span>{movie.Year}</span>
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <Star size={10} fill="currentColor" />
                            <span className="text-zinc-400">{movie.imdbRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Details Pop-up Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="glass-card border border-white/10 text-white rounded-[32px] w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] glow-purple">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 rounded-full p-2 border border-white/10 transition-colors cursor-pointer text-white"
            >
              <X size={18} />
            </button>

            {/* Left Col: Poster Section */}
            <div className="w-full md:w-2/5 relative bg-zinc-950 overflow-hidden shrink-0 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedMovie.Poster}
                alt={selectedMovie.Title}
                className="w-full h-full object-cover max-h-[260px] md:max-h-full"
              />
            </div>

            {/* Right Col: Details Section */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-5 flex flex-col justify-between">
              
              {/* Header Details */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight pr-8">
                    {selectedMovie.Title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-bold">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-brand-green" />
                      {selectedMovie.Year}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star size={13} fill="currentColor" />
                      {selectedMovie.imdbRating} / 10
                    </span>
                  </div>
                </div>

                {/* Genre badges */}
                <div className="flex flex-wrap gap-1.5">
                  {selectedMovie.Genre.split(',').map((g) => (
                    <span
                      key={g.trim()}
                      className="bg-white/[0.04] border border-white/10 text-zinc-300 rounded-md py-1 px-3 text-[10px] font-bold uppercase tracking-wider"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>

                {/* Plot info */}
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Plot Outline</h4>
                  {modalLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 bg-white/5 rounded w-full"></div>
                      <div className="h-3 bg-white/5 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <p className="text-xs md:text-sm leading-relaxed text-zinc-300 select-text font-medium">
                      {selectedMovie.Plot}
                    </p>
                  )}
                </div>
              </div>

              {/* Crew & Language Details */}
              <div className="border-t border-white/5 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-400">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Film size={14} className="text-brand-green mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-zinc-300 font-bold uppercase text-[9px] tracking-wider block">Director</strong>
                      {selectedMovie.Director}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Feather size={14} className="text-brand-green mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-zinc-300 font-bold uppercase text-[9px] tracking-wider block">Writer</strong>
                      {selectedMovie.Writer}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User size={14} className="text-brand-green mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-zinc-300 font-bold uppercase text-[9px] tracking-wider block">Actors</strong>
                      {selectedMovie.Actors}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe size={14} className="text-brand-green mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-zinc-300 font-bold uppercase text-[9px] tracking-wider block">Language</strong>
                      {selectedMovie.Language}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
