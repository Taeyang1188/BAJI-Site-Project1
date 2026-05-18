/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, Calendar, User, ChevronRight, ChevronLeft, Languages, Clock, Sun, Moon } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { Language, UserInput, BaZiResult } from './types';
import { TRANSLATIONS } from './constants';
import CosmicWheel from './components/CosmicWheel';
import BaZiResultPage from './components/BaZiResultPage';

import { calculateRealBaZi } from './services/bazi-service';

import doorGif from './assets/door.gif';

const HorizontalScrollArea = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const onMouseDown = (e: ReactMouseEvent) => {
    setIsDragging(true);
    setDragDistance(0);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const onMouseLeave = () => setIsDragging(false);
  const onMouseUp = () => setIsDragging(false);

  const onMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll-fast
    setDragDistance(Math.abs(walk));
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const onClickCapture = (e: ReactMouseEvent) => {
    if (dragDistance > 10) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div 
      ref={scrollRef}
      className={`overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing ${className || ''}`}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onClickCapture={onClickCapture}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {children}
    </div>
  );
};

const TimeInput = ({ 
  value, 
  isUnknown,
  onChange, 
  onUnknownChange,
  lang 
}: { 
  value: string, 
  isUnknown?: boolean,
  onChange: (v: string) => void, 
  onUnknownChange: (u: boolean) => void,
  lang: Language 
}) => {
  // value is HH:MM (24h)
  const [hour24, minute24] = value.split(':');
  const h24 = parseInt(hour24);
  const isPM = h24 >= 12;
  
  // Display value in 12h format: "HHMM"
  const getDisplayValue = (h: number, m: string) => {
    const h12 = h === 0 ? 12 : (h > 12 ? h - 12 : h);
    return `${h12.toString().padStart(2, '0')}${m}`;
  };

  const [inputValue, setInputValue] = useState(getDisplayValue(h24, minute24));

  // Sync with external value
  useEffect(() => {
    const [h, m] = value.split(':');
    setInputValue(getDisplayValue(parseInt(h), m));
  }, [value]);

  const handleInputChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 4);
    setInputValue(clean);

    if (clean.length === 4) {
      let h = parseInt(clean.slice(0, 2));
      let m = parseInt(clean.slice(2, 4));
      
      if (m > 59) m = 59;
      
      let newIsPM = isPM;
      // Smart 24h detection
      if (h === 24) {
        h = 12;
        newIsPM = false; // 12 AM (00:00)
      } else if (h >= 13 && h <= 23) {
        h -= 12;
        newIsPM = true;
      } else if (h === 12) {
        newIsPM = true;
      } else if (h === 0) {
        h = 12;
        newIsPM = false;
      } else if (h > 12) {
        // Just in case (though logically impossible with the above else-ifs)
        h = 12;
      }
      
      let finalH24 = h;
      if (newIsPM) {
        finalH24 = (h === 12) ? 12 : h + 12;
      } else {
        finalH24 = (h === 12) ? 0 : h;
      }

      const formatted = `${finalH24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      onChange(formatted);
      if (isUnknown) onUnknownChange(false);
    }
  };

  const toggleAMPM = () => {
    let finalH24 = h24;
    if (isPM) {
      finalH24 = (h24 === 12) ? 0 : h24 - 12;
    } else {
      finalH24 = (h24 === 0) ? 12 : h24 + 12;
    }
    const formatted = `${finalH24.toString().padStart(2, '0')}:${minute24}`;
    onChange(formatted);
    if (isUnknown) onUnknownChange(false);
  };

  // Format display for the input: "HH : MM"
  const displayString = inputValue.length >= 3 
    ? `${inputValue.slice(0, 2)} : ${inputValue.slice(2)}`
    : inputValue;

  return (
    <div className="flex gap-2 items-center w-full">
      <div className={`flex-1 min-w-0 flex items-center bg-white/5 border rounded-2xl transition-all h-[44px] ${isUnknown ? 'border-white/5 opacity-50' : 'border-white/10 focus-within:border-neon-pink'}`}>
        <Clock className="ml-4 w-4 h-4 text-neon-pink pointer-events-none shrink-0" />
        
        <input 
          type="text"
          inputMode="numeric"
          value={isUnknown ? (lang === 'KO' ? '모름' : 'Unknown') : displayString}
          onChange={(e) => {
            if (isUnknown) onUnknownChange(false);
            handleInputChange(e.target.value);
          }}
          onFocus={(e) => e.target.select()}
          onBlur={() => {
            if (isUnknown) return;
            // Ensure 4 digits on blur
            const padded = inputValue.padEnd(4, '0');
            handleInputChange(padded);
          }}
          className="flex-1 min-w-0 bg-transparent px-3 h-full text-white tracking-[0.1em] font-mono focus:outline-none placeholder:text-white/20"
          placeholder="00 : 00"
        />

        {!isUnknown && (
          <button 
            onClick={toggleAMPM}
            className={`mr-2 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tighter transition-all shrink-0 ${isPM ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,0,122,0.4)]' : 'bg-neon-cyan text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]'}`}
          >
            {isPM ? 'PM' : 'AM'}
          </button>
        )}
      </div>
      <button
        onClick={() => onUnknownChange(!isUnknown)}
        className={`shrink-0 px-3 flex items-center justify-center rounded-2xl text-xs font-bold transition-all whitespace-nowrap border h-[44px] ${isUnknown ? 'bg-neon-pink text-white border-neon-pink shadow-[0_0_15px_rgba(255,0,122,0.4)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/80'}`}
      >
        {lang === 'KO' ? '모름' : 'Unknown'}
      </button>
    </div>
  );
};

declare global {
  interface Window {
    google: any;
  }
}

// Main Application Component
export default function App() {
  const { theme, toggleTheme } = useTheme();
  
  const [page, setPage] = useState<1 | 2 | 3>(1);
  const [lang, setLang] = useState<Language>('KO');
  const [userInput, setUserInput] = useState<UserInput>({
    name: '',
    birthDate: '1993-01-01',
    birthTime: '12:00',
    city: 'Seoul',
  });
  const [botField, setBotField] = useState('');
  const [debouncedInput, setDebouncedInput] = useState<UserInput>(userInput);
  const [coords, setCoords] = useState({ lat: 37.5665, lon: 126.9780 }); // Default to Seoul
  const [isLocationSynced, setIsLocationSynced] = useState(false);
  const [greeting, setGreeting] = useState('');
  
  // Throttling State
  const [submitTimestamps, setSubmitTimestamps] = useState<number[]>([]);
  const [isThrottled, setIsThrottled] = useState(false);
  const [throttleMessage, setThrottleMessage] = useState('');

  const t = TRANSLATIONS[lang];

  // Google Maps Autocomplete Ref
  const autocompleteRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce Input for Calculation
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(userInput);
    }, 800);
    return () => clearTimeout(handler);
  }, [userInput]);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        console.warn("Google Maps API Key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your environment.");
        return;
      }

      if (window.google?.maps?.importLibrary) {
        if (page === 2 && !autocompleteRef.current) initAutocomplete();
        return;
      }

      // Modern way to load Google Maps (TS-friendly version)
      const g: any = { 
        v: "weekly",
        language: lang.toLowerCase()
      };
      const b: any = window;
      let d = b.google?.maps || (b.google = b.google || {}, b.google.maps = b.google.maps || {});
      const r = new Set();
      const e = new URLSearchParams();
      let h: any;
      const u = () => h || (h = new Promise(async (f, n) => {
        const a = document.createElement("script");
        e.set("libraries", [...r] + "");
        for (const k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
        e.set("key", (a.dataset.key = apiKey));
        a.src = `https://maps.googleapis.com/maps/api/js?` + e;
        (d as any).__ib__ = f;
        a.onerror = () => (h = n(Error("The Google Maps JavaScript API could not load.")));
        const nonceScript = document.querySelector("script[nonce]") as any;
        a.nonce = nonceScript?.nonce || "";
        document.head.append(a);
      }));
      if (!d.importLibrary) {
        d.importLibrary = (f: any, ...n: any[]) => r.add(f) && u().then(() => d.importLibrary(f, ...n));
      }

      try {
        await window.google.maps.importLibrary("places");
        if (page === 2 && !autocompleteRef.current) initAutocomplete();
      } catch (e) {
        console.error("Google Maps failed to load", e);
      }
    };

    loadGoogleMaps();
    
    // Cleanup autocomplete instance when leaving page 2
    if (page !== 2) {
      autocompleteRef.current = null;
    }
  }, [page, lang]);

  const initAutocomplete = async () => {
    if (autocompleteRef.current) return; // Guard against multiple initializations

    console.log("Initializing Autocomplete...", { 
      hasInput: !!inputRef.current, 
      hasGoogle: !!window.google?.maps 
    });

    if (inputRef.current && window.google?.maps) {
      try {
        const { Autocomplete } = await window.google.maps.importLibrary("places");
        
        if (autocompleteRef.current) return; // Double check after await

        console.log("Places library loaded, creating Autocomplete instance.");

        const autocomplete = new Autocomplete(inputRef.current, {
          types: ['(cities)'],
          fields: ['geometry', 'name']
        });

        autocompleteRef.current = autocomplete;

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          console.log("Place selected:", place?.name);
          if (place?.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lon = place.geometry.location.lng();
            setCoords({ lat, lon });
            // Use place.name for a cleaner display (e.g., "Busan" instead of "South Korea Busan")
            const cityName = place.name || inputRef.current?.value || '';
            setUserInput(prev => ({ ...prev, city: cityName }));
            setIsLocationSynced(true);
            setGreeting(t.input.locationSynced);
            setTimeout(() => setIsLocationSynced(false), 3000);
          }
        });
      } catch (e) {
        console.error("Error initializing Autocomplete", e);
      }
    } else if (page === 2) {
      // If we are on page 2 but input is not ready, retry once
      setTimeout(initAutocomplete, 100);
    }
  };

  useEffect(() => {
    const greetings = t.intro.greetings;
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, [lang, page]);

  // Real BaZi Calculation with Error Handling
  const result = useMemo(() => {
    // Only calculate on page 3 (Reveal) to prevent heavy CPU usage while typing
    if (page === 3 && debouncedInput.birthDate && debouncedInput.birthTime) {
      // Validate year range before calculating to avoid library errors
      const year = parseInt(debouncedInput.birthDate.split('-')[0]);
      if (isNaN(year) || year < 1900 || year > 2100) {
        return null;
      }

      try {
        console.log("Attempting BaZi calculation with:", debouncedInput.birthDate, debouncedInput.birthTime, coords.lat, coords.lon, lang);
        return calculateRealBaZi(debouncedInput, coords.lat, coords.lon, lang);
      } catch (error) {
        console.error("BaZi calculation failed in App.tsx:", error);
        return null;
      }
    }
    return null;
  }, [page, debouncedInput, coords.lat, coords.lon, lang]);

  const handleReveal = () => {
    // 1. Honeypot Check
    if (botField) {
      alert("Bot detected. Calculation aborted.");
      return;
    }

    // 2. Throttling Check
    const now = Date.now();
    const recentSubmits = submitTimestamps.filter(timestamp => now - timestamp < 10000); // 10 seconds window
    
    if (recentSubmits.length >= 3) {
      setIsThrottled(true);
      setThrottleMessage(t.input.throttleMessage);
      
      // Clear throttle after 5 seconds
      setTimeout(() => {
        setIsThrottled(false);
        setThrottleMessage('');
      }, 5000);
      return;
    }

    setSubmitTimestamps([...recentSubmits, now]);
    setPage(3);
  };

  const handleBack = () => {
    if (page === 2) setPage(1);
    else if (page === 3) setPage(2);
  };

  return (
    <div className="min-h-screen bg-goth-bg text-white selection:bg-neon-pink selection:text-white overflow-x-hidden">
      {/* Global Star Field Background */}
      <div className="fixed inset-0 star-field opacity-20 pointer-events-none" />
      
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full p-4 sm:p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setPage(1);
              // Optional: Reset greeting or other states if desired
            }}
            className="font-gothic text-2xl tracking-tighter neon-text-pink hover:scale-105 transition-transform cursor-pointer bg-transparent border-none p-0 focus:outline-none"
            title={t.nav.home}
          >
            V.O.I.D
          </button>
          
          <AnimatePresence>
            {page > 1 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={handleBack}
                className="w-8 h-8 flex items-center justify-center goth-glass rounded-lg border border-white/20 hover:border-white transition-all group shrink-0"
                title={t.nav.back}
              >
                <ChevronLeft className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {page === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 text-[10px] sm:text-xs text-white/60 font-mono leading-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>{userInput.birthDate}</span>
                  <span>{userInput.birthTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  {userInput.calendarType && (
                    <span className="text-[8px] sm:text-[10px] uppercase px-1 sm:px-1.5 py-0.5 rounded bg-white/10">
                      {userInput.calendarType === 'solar' ? (lang === 'KO' ? '양력' : 'Solar') : (lang === 'KO' ? '음력' : 'Lunar')}
                    </span>
                  )}
                  {userInput.gender && (
                    <span className="text-[8px] sm:text-[10px] uppercase px-1 sm:px-1.5 py-0.5 rounded bg-white/10">
                      {userInput.gender === 'male' ? (lang === 'KO' ? '남' : 'M') : userInput.gender === 'female' ? (lang === 'KO' ? '여' : 'F') : userInput.gender === 'non-binary' ? 'NB' : 'N/A'}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center p-2 goth-glass rounded-full hover:border-theme-primary transition-all group"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-neon-pink group-hover:text-white transition-colors" />
            ) : (
              <Moon className="w-4 h-4 text-neon-pink group-hover:text-black transition-colors" />
            )}
          </button>
          
          <button 
            onClick={() => setLang(lang === 'KO' ? 'EN' : 'KO')}
            className="flex items-center gap-2 px-4 py-2 goth-glass rounded-full text-[10px] font-bold tracking-widest hover:border-neon-cyan transition-all"
          >
            <Languages className="w-3 h-3 text-neon-cyan" />
            {lang}
          </button>
        </div>
      </nav>

      <main className="relative pt-24 pb-12 min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {page === 1 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center space-y-12 px-6"
            >
              {/* Character Section */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`relative mt-8 ${theme === 'dark' ? 'mb-4 w-[332px] h-[332px]' : '-mb-16 sm:-mb-24 w-full max-w-[500px] z-20'}`}
              >
                {/* Speech Bubble */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`absolute ${theme === 'dark' ? '-top-[70px] -right-4 sm:-right-12' : '-top-[10px] sm:-top-[30px] right-0 translate-x-1/4 sm:translate-x-1/3 shadow-xl border border-black/5'} goth-glass p-4 rounded-2xl rounded-bl-none max-w-[220px] w-max z-30`}
                >
                  <p className="text-[12px] sm:text-[13px] font-medium leading-relaxed italic text-white/90">
                    "{greeting}"
                  </p>
                </motion.div>
                
                {theme === 'dark' ? (

                  <>
                    {/* UFO Saucer Rings (Background) */}
                    <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[104px] sm:h-[125px] rounded-[50%] bg-gradient-to-t from-neon-purple/30 to-transparent border border-neon-purple/40 blur-[1px] z-0" />
                    <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[190%] h-[125px] sm:h-[145px] rounded-[50%] border-t border-b border-neon-cyan/20 shadow-[0_0_40px_rgba(0,242,255,0.2)] z-0" />

                    {/* Character Circle (UFO Dome) */}
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-neon-purple/20 to-neon-purple/5 border border-white/5 relative overflow-hidden z-10 shadow-[0_-15px_40px_rgba(188,0,255,0.15)]" style={{ isolation: 'isolate' }}>
                      <div
                        className="absolute inset-[16px] flex items-center justify-center overflow-hidden rounded-full bg-black/10"
                      >
                        <img 
                          src={doorGif} 
                          alt="Cosmic Door" 
                          className="w-full h-full object-cover relative z-10"
                        />

                        {/* UFO Dashboard Overlay (Hides the bottom of the character) */}
                        <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-[#0B0416] via-[#0B0416] to-[#0B0416]/90 border-t border-neon-cyan/30 z-20 flex flex-col items-center pt-2.5 backdrop-blur-sm">
                          
                          {/* Left Joystick */}
                          <div className="absolute left-[20%] bottom-full flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-[#ff0033] shadow-[0_0_10px_rgba(255,0,51,0.8)] z-10" />
                            <div className="w-1 h-5 bg-gradient-to-b from-gray-400 to-gray-600 -mt-1" />
                            <div className="w-6 h-2 bg-[#1a1a1a] rounded-t-full border-t border-gray-600" />
                          </div>

                          {/* Right Button */}
                          <div className="absolute right-[20%] bottom-full flex flex-col items-center justify-end">
                            <div className="w-4 h-2 rounded-t-full bg-[#ff0033] shadow-[0_0_10px_rgba(255,0,51,0.8)] z-10 relative top-[1px]" />
                            <div className="w-8 h-2 bg-[#1a1a1a] rounded-t-full border-t border-gray-600" />
                          </div>

                          {/* Dashboard Indicators */}
                          <div className="flex gap-4 items-center opacity-80 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-neon-pink shadow-[0_0_8px_rgba(255,0,122,1)] animate-pulse" style={{ animationDuration: '2s' }} />
                            <div className="flex gap-1.5">
                              <div className="w-3 h-1 rounded-sm bg-neon-cyan/40" />
                              <div className="w-2 h-1 rounded-sm bg-neon-cyan shadow-[0_0_8px_rgba(0,242,255,1)]" />
                              <div className="w-3 h-1 rounded-sm bg-neon-cyan/40" />
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(0,242,255,1)] animate-pulse" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }} />
                          </div>
                        </div>
                      </div>
                      {/* Neon Ring */}
                      <div className="absolute inset-0 border-[16px] border-neon-purple/40 rounded-full animate-pulse z-20 pointer-events-none" />
                    </div>

                    {/* UFO Front Rim (Foreground) */}
                    <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[190%] h-[125px] sm:h-[145px] rounded-[50%] border-b-[5px] border-neon-cyan shadow-[0_20px_60px_rgba(0,255,170,0.6)] pointer-events-none z-20" style={{ clipPath: 'polygon(-20% 50%, 120% 50%, 120% 200%, -20% 200%)' }} />
                    
                    {/* UFO Lights */}
                    <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[190%] h-[125px] sm:h-[145px] rounded-[50%] z-20 pointer-events-none" style={{ clipPath: 'polygon(-20% 50%, 120% 50%, 120% 200%, -20% 200%)' }}>
                      <div className="absolute bottom-[20px] sm:bottom-[23px] left-[15%] w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neon-pink rounded-full shadow-[0_0_10px_5px_rgba(255,0,122,0.8)] animate-pulse" />
                      <div className="absolute bottom-[5px] sm:bottom-[6px] left-[35%] w-2 h-2 sm:w-2.5 sm:h-2.5 bg-neon-cyan rounded-full shadow-[0_0_12px_6px_rgba(0,242,255,0.8)] animate-pulse" style={{ animationDelay: '0.3s' }} />
                      <div className="absolute bottom-[2px] sm:bottom-[3px] left-[50%] -translate-x-1/2 w-3 h-1.5 sm:w-4 sm:h-2 bg-white rounded-full shadow-[0_0_15px_8px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: '0s' }} />
                      <div className="absolute bottom-[5px] sm:bottom-[6px] left-[65%] w-2 h-2 sm:w-2.5 sm:h-2.5 bg-neon-cyan rounded-full shadow-[0_0_12px_6px_rgba(0,242,255,0.8)] animate-pulse" style={{ animationDelay: '0.7s' }} />
                      <div className="absolute bottom-[20px] sm:bottom-[23px] left-[85%] w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neon-pink rounded-full shadow-[0_0_10px_5px_rgba(255,0,122,0.8)] animate-pulse" style={{ animationDelay: '1.2s' }} />
                    </div>
                  </>
                ) : (
                  <div className="w-full relative flex flex-col items-center justify-center z-10 pointer-events-none">
                    {/* Character placement to look like they are riding the UFO */}
                    <img 
                      src={doorGif} 
                      alt="Character" 
                      className="w-[190px] h-[190px] sm:w-[230px] sm:h-[230px] object-cover relative z-10"
                      style={{ objectPosition: 'center top' }}
                    />
                    {/* UFO */}
                    <img 
                      src="https://i.imgur.com/AptrSjO.png" 
                      alt="UFO" 
                      className="w-[440px] sm:w-[500px] max-w-none h-auto relative z-20 pointer-events-none shrink-0 -mt-[105px] sm:-mt-[135px]"
                    />
                  </div>
                )}
              </motion.div>

              <div className="space-y-4">
                <h1 className="font-gothic text-7xl md:text-8xl tracking-tighter neon-text-pink">
                  {t.intro.title}
                </h1>
                <p className="text-sm font-light text-white/60 tracking-[0.2em] max-w-xs mx-auto">
                  {t.intro.subtitle}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(2)}
                className="group relative px-12 py-4 bg-transparent overflow-hidden rounded-full border border-neon-cyan transition-all"
              >
                <div className="absolute inset-0 bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition-all" />
                <span className="relative text-xs font-bold tracking-[0.5em] text-neon-cyan">
                  {t.intro.button}
                </span>
              </motion.button>
            </motion.div>
          )}

          {page === 2 && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-md px-6"
            >
              <div className="goth-glass rounded-[40px] p-4 sm:p-6 space-y-3 sm:space-y-4 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-neon-pink/10 blur-[60px]" />

                <CosmicWheel birthDate={userInput.birthDate} />

                <div className="space-y-3 relative z-10">
                  <div className="text-center">
                    <h2 className="text-[10px] font-display font-bold tracking-[0.4em] text-white/40 uppercase">
                      {t.input.title}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {/* Honeypot Field */}
                    <input 
                      type="text" 
                      name="bot_field" 
                      style={{ display: 'none' }} 
                      value={botField}
                      onChange={(e) => setBotField(e.target.value)}
                      tabIndex={-1} 
                      autoComplete="off" 
                    />

                    {/* Name */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl focus-within:border-neon-pink transition-all h-[44px]">
                      <User className="ml-4 w-4 h-4 text-neon-pink shrink-0" />
                      <input 
                        type="text"
                        placeholder={t.input.name}
                        value={userInput.name}
                        onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
                        className="flex-1 bg-transparent px-3 py-1 h-full text-base focus:outline-none placeholder:text-white/20 min-w-0"
                      />
                    </div>

                    {/* Date & Time Section */}
                    {lang === 'KO' ? (
                      <>
                        {/* Date Row (KO) */}
                        <div className="flex gap-2 items-center">
                          <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-2xl focus-within:border-neon-pink transition-all min-w-0 h-[44px]">
                            <Calendar className="ml-4 w-4 h-4 text-neon-pink pointer-events-none shrink-0" />
                            <input 
                              type="date"
                              max="9999-12-31"
                              required
                              value={userInput.birthDate}
                              onChange={(e) => setUserInput({ ...userInput, birthDate: e.target.value })}
                              className="flex-1 bg-transparent px-3 h-full appearance-none text-base font-mono tracking-[0.1em] focus:outline-none transition-all text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert min-w-0 m-0"
                            />
                          </div>
                          <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1 h-[44px] items-center shrink-0">
                            <button 
                              onClick={() => setUserInput({ ...userInput, calendarType: 'solar' })}
                              className={`flex-1 h-full px-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${(!userInput.calendarType || userInput.calendarType === 'solar') ? 'bg-neon-cyan text-black' : 'text-white/40 hover:text-white/60'}`}
                            >
                              {t.input.solar}
                            </button>
                            <button 
                              onClick={() => setUserInput({ ...userInput, calendarType: 'lunar' })}
                              className={`flex-1 h-full px-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${userInput.calendarType === 'lunar' ? 'bg-neon-pink text-white' : 'text-white/40 hover:text-white/60'}`}
                            >
                              {t.input.lunar}
                            </button>
                          </div>
                        </div>
                        {/* Time Row (KO) */}
                        <TimeInput 
                          value={userInput.birthTime}
                          isUnknown={userInput.isTimeUnknown}
                          onUnknownChange={(u) => setUserInput({ ...userInput, isTimeUnknown: u })}
                          onChange={(v) => setUserInput({ ...userInput, birthTime: v })}
                          lang={lang}
                        />
                      </>
                    ) : (
                      /* Date & Time Section (EN) */
                      <>
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl focus-within:border-neon-pink transition-all h-[44px]">
                          <Calendar className="ml-4 w-4 h-4 text-neon-pink pointer-events-none shrink-0" />
                          <input 
                            type="date"
                            max="9999-12-31"
                            required
                            value={userInput.birthDate}
                            onChange={(e) => setUserInput({ ...userInput, birthDate: e.target.value })}
                            className="flex-1 bg-transparent px-3 h-full appearance-none text-base font-mono tracking-[0.1em] focus:outline-none transition-all text-white [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert min-w-0"
                          />
                        </div>
                        <TimeInput 
                          value={userInput.birthTime}
                          isUnknown={userInput.isTimeUnknown}
                          onUnknownChange={(u) => setUserInput({ ...userInput, isTimeUnknown: u })}
                          onChange={(v) => setUserInput({ ...userInput, birthTime: v })}
                          lang={lang}
                        />
                      </>
                    )}

                    {/* Gender Selection */}
                    <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="flex items-center gap-1.5 pl-2 border-r border-white/10 pr-2">
                        <User className="w-3.5 h-3.5 text-neon-pink" />
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest text-white/40 uppercase whitespace-nowrap">{t.input.gender}</span>
                      </div>
                      <HorizontalScrollArea className="flex flex-1 items-center gap-1">
                        <button 
                          onClick={() => setUserInput({ ...userInput, gender: 'male' })}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${userInput.gender === 'male' ? 'bg-neon-cyan text-black' : 'text-white/40 hover:text-white/60'}`}
                        >
                          {t.input.male}
                        </button>
                        <button 
                          onClick={() => setUserInput({ ...userInput, gender: 'female' })}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${userInput.gender === 'female' ? 'bg-neon-pink text-white' : 'text-white/40 hover:text-white/60'}`}
                        >
                          {t.input.female}
                        </button>
                        <button 
                          onClick={() => setUserInput({ ...userInput, gender: 'non-binary' })}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${userInput.gender === 'non-binary' ? 'bg-gradient-to-r from-neon-cyan to-neon-pink text-white' : 'text-white/40 hover:text-white/60'}`}
                        >
                          {t.input.nonBinary}
                        </button>
                        <button 
                          onClick={() => setUserInput({ ...userInput, gender: 'prefer-not-to-tell' })}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${userInput.gender === 'prefer-not-to-tell' ? 'bg-red-900 text-white' : 'text-white/40 hover:text-white/60'}`}
                        >
                          {t.input.preferNotToTell}
                        </button>
                      </HorizontalScrollArea>
                    </div>

                    {/* City */}
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl focus-within:border-neon-pink transition-all relative">
                      <Globe className="ml-4 w-4 h-4 text-neon-pink shrink-0" />
                      <input 
                        ref={inputRef}
                        type="text"
                        placeholder={t.input.city}
                        value={userInput.city}
                        onChange={(e) => setUserInput({ ...userInput, city: e.target.value })}
                        className="flex-1 bg-transparent py-2.5 pl-3 pr-4 text-base focus:outline-none placeholder:text-white/20 min-w-0"
                      />
                      <AnimatePresence>
                        {isLocationSynced && (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neon-cyan uppercase pointer-events-none"
                          >
                            {t.nav.synced}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="relative flex flex-col gap-1.5 mt-2">
                       <label className="text-xs text-white/50 pl-2 uppercase font-mono">{lang === 'KO' ? '사회적 환경 (선택)' : 'Social Context (Optional)'}</label>
                       <select 
                          value={userInput.socialContext || 'none'}
                          onChange={(e) => setUserInput({ ...userInput, socialContext: e.target.value as any })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 text-base focus:outline-none focus:border-neon-pink transition-all text-white/80 appearance-none"
                       >
                         <option value="none" className="bg-black text-white">{lang === 'KO' ? '선택 안함' : 'None'}</option>
                         <option value="military_public" className="bg-black text-white">{lang === 'KO' ? '군인/경찰/공무원' : 'Military/Public Service'}</option>
                         <option value="corporate" className="bg-black text-white">{lang === 'KO' ? '일반 직장인' : 'Corporate Employee'}</option>
                         <option value="business_freelance" className="bg-black text-white">{lang === 'KO' ? '사업/프리랜서' : 'Business/Freelance'}</option>
                         <option value="professional_it" className="bg-black text-white">{lang === 'KO' ? '전문직/IT' : 'Professional/IT'}</option>
                         <option value="education" className="bg-black text-white">{lang === 'KO' ? '교육/교직' : 'Education/Teaching'}</option>
                         <option value="arts_creative" className="bg-black text-white">{lang === 'KO' ? '예술/창작' : 'Arts/Creative'}</option>
                         <option value="student" className="bg-black text-white">{lang === 'KO' ? '학생/취업준비' : 'Student/Job Seeker'}</option>
                       </select>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isThrottled && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center text-neon-pink text-xs font-bold p-2 bg-red-900/20 border border-red-500/30 rounded-lg"
                      >
                        {throttleMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReveal}
                    disabled={!userInput.birthDate || !userInput.birthTime || isThrottled}
                    className="w-full py-4 bg-gradient-to-r from-neon-pink to-neon-purple rounded-2xl text-xs font-bold tracking-[0.4em] uppercase shadow-[0_10px_30px_rgba(255,0,122,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.input.button}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {page === 3 && !result && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full space-y-6 text-center"
            >
              <div className="text-4xl text-red-500">⚠️</div>
              <h2 className="text-2xl font-bold text-red-400">{t.input.errorTitle}</h2>
              <p className="text-white/60 max-w-md">{t.input.errorDesc}</p>
              <button 
                onClick={() => setPage(2)}
                className="px-8 py-3 border border-neon-pink text-neon-pink rounded-full hover:bg-neon-pink hover:text-white transition-all"
              >
                {t.input.errorButton}
              </button>
            </motion.div>
          )}

          {page === 3 && result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <BaZiResultPage 
                result={result} 
                lang={lang} 
                userName={userInput.name}
                gender={userInput.gender}
                city={userInput.city}
                socialContext={userInput.socialContext}
                onBack={() => setPage(2)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Particle Overlay for Reveal */}
      <AnimatePresence>
        {page === 3 && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          >
             <div className="w-full h-full bg-white animate-flash" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
