/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, MouseEvent as ReactMouseEvent, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, Calendar, User, ChevronRight, ChevronLeft, Languages, Clock, Sun, Moon, Keyboard, Zap } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { Language, UserInput, BaZiResult } from './types';
import { TRANSLATIONS } from './constants';
import CosmicWheel from './components/CosmicWheel';
import AuroraBackground from './components/AuroraBackground';

const BaZiResultPage = lazy(() => import('./components/BaZiResultPage'));

import { calculateRealBaZi } from './services/bazi-service';

import characterWebm from './assets/door.webm';
import characterApng from './assets/door.png';

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

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
  const { theme } = useTheme();
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
      <div className={`flex-1 min-w-0 flex items-center border rounded-2xl transition-all h-[44px] ${isUnknown ? (theme === 'light' ? 'border-transparent opacity-50 bg-slate-100/50' : 'border-white/5 opacity-50 bg-white/5') : (theme === 'light' ? 'border-slate-200/80 bg-slate-100/80 focus-within:border-neon-pink' : 'border-white/10 bg-white/5 focus-within:border-neon-pink')}`}>
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
          className={`flex-1 min-w-0 bg-transparent px-3 h-full tracking-[0.1em] font-mono focus:outline-none ${theme === 'light' ? 'text-slate-800 placeholder:text-slate-400 font-semibold' : 'text-white placeholder:text-white/20'}`}
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
        className={`shrink-0 px-3 flex items-center justify-center rounded-2xl text-xs font-bold transition-all whitespace-nowrap border h-[44px] ${isUnknown ? 'bg-neon-pink text-white border-neon-pink shadow-[0_0_15px_rgba(255,0,122,0.4)]' : (theme === 'light' ? 'bg-slate-100/80 border-slate-200/80 text-slate-500 hover:text-slate-800' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/80')}`}
      >
        {lang === 'KO' ? '모름' : 'Unknown'}
      </button>
    </div>
  );
};

const DateInput = ({
  value,
  onChange,
  lang,
  calendarType,
  onCalendarTypeChange,
  theme,
  t
}: {
  value: string,
  onChange: (v: string) => void,
  lang: Language,
  calendarType: 'solar' | 'lunar',
  onCalendarTypeChange: (type: 'solar' | 'lunar') => void,
  theme: string,
  t: any
}) => {
  const getDisplayValue = (val: string) => {
    if (!val) return '';
    return val.replace(/\D/g, '').slice(0, 8);
  };

  const [inputValue, setInputValue] = useState(getDisplayValue(value));

  useEffect(() => {
    setInputValue(getDisplayValue(value));
  }, [value]);

  const handleInputChange = (val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 8);
    setInputValue(clean);

    if (clean.length === 8) {
      const y = clean.slice(0, 4);
      let m = clean.slice(4, 6);
      let d = clean.slice(6, 8);
      
      let intM = parseInt(m);
      if (intM < 1) intM = 1;
      if (intM > 12) intM = 12;
      m = intM.toString().padStart(2, '0');

      let intD = parseInt(d);
      if (intD < 1) intD = 1;
      if (intD > 31) intD = 31;
      d = intD.toString().padStart(2, '0');

      onChange(`${y}-${m}-${d}`);
    }
  };

  const displayString = useMemo(() => {
    if (!inputValue) return '';
    const y = inputValue.slice(0, 4);
    const m = inputValue.slice(4, 6);
    const d = inputValue.slice(6, 8);
    
    if (inputValue.length <= 4) {
      return y;
    } else if (inputValue.length <= 6) {
      return `${y}. ${m}`;
    } else {
      return `${y}. ${m}. ${d}`;
    }
  }, [inputValue]);

  return (
    <div className="flex gap-2 items-center w-full">
      <div className={`flex-1 min-w-0 flex items-center border rounded-2xl transition-all h-[44px] ${
        theme === 'light' 
          ? 'border-slate-200/80 bg-slate-100/80 focus-within:border-neon-pink' 
          : 'border-white/10 bg-white/5 focus-within:border-neon-pink'
      }`}>
        <Calendar className="ml-3 sm:ml-4 w-4 h-4 text-neon-pink pointer-events-none shrink-0" />
        
        <input 
          type="text"
          inputMode="numeric"
          value={displayString}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="YYYY. MM. DD"
          onFocus={(e) => e.target.select()}
          onBlur={() => {
            if (inputValue.length > 0 && inputValue.length < 8) {
              const padded = inputValue.padEnd(8, '1');
              handleInputChange(padded);
            }
          }}
          className={`flex-1 min-w-0 bg-transparent px-2 sm:px-3 h-full tracking-normal sm:tracking-[0.05em] font-mono focus:outline-none ${
            theme === 'light' ? 'text-slate-800 placeholder:text-slate-400 font-semibold text-base' : 'text-white placeholder:text-white/20 text-base'
          }`}
        />
      </div>

      {lang === 'KO' && (
        <div className={`flex rounded-2xl p-1 gap-1 h-[44px] items-center shrink-0 border ${
          theme === 'light' ? 'bg-slate-100/80 border-slate-200/80' : 'bg-white/5 border-white/10'
        }`}>
          <button 
            onClick={() => onCalendarTypeChange('solar')}
            type="button"
            className={`flex-1 h-full px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${(!calendarType || calendarType === 'solar') ? 'bg-neon-cyan text-black shadow-[0_0_15px_rgba(0,255,255,0.4)]' : (theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-white/40 hover:text-white/60')}`}
          >
            {t.input.solar}
          </button>
          <button 
            type="button"
            onClick={() => onCalendarTypeChange('lunar')}
            className={`flex-1 h-full px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${calendarType === 'lunar' ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,0,122,0.4)]' : (theme === 'light' ? 'text-slate-400 hover:text-slate-600' : 'text-white/40 hover:text-white/60')}`}
          >
            {t.input.lunar}
          </button>
        </div>
      )}
    </div>
  );
};

declare global {
  interface Window {
    google: any;
  }
}

const buttonVariant = 'B'; // 'A' 또는 'B'로 전환

const buttonStyles = {
  A: {
    background: 'linear-gradient(135deg, #FF2A6D 0%, #C800A1 100%)',
    boxShadow: '0 0 32px rgba(255, 42, 109, 0.45)',
    hoverShadow: '0 0 48px rgba(255, 42, 109, 0.65)',
  },
  B: {
    background: 'linear-gradient(135deg, #9B30FF 0%, #FF2A6D 100%)',
    boxShadow: '0 0 32px rgba(155, 48, 255, 0.4)',
    hoverShadow: '0 0 48px rgba(155, 48, 255, 0.6)',
  }
} as const;

const titleFontVariant = 'C'; // 'A', 'B', 'C', 'D' 중 하나로 전환

const titleFonts = {
  A: { fontFamily: "'Black Han Sans', sans-serif", letterSpacing: '-0.02em' },
  B: { fontFamily: "'Jua', sans-serif", letterSpacing: '0em' },
  C: { fontFamily: "'Gaegu', cursive", letterSpacing: '0.02em' },
  D: { fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 900, letterSpacing: '-0.03em' },
};

// Main Application Component
export default function App() {
  const currentTitleFont = titleFonts[titleFontVariant];
  const currentButton = buttonStyles[buttonVariant];
  const { theme, toggleTheme } = useTheme();
  
  const [page, setPage] = useState<1 | 2 | 3>(1);
  const [ufoLoaded, setUfoLoaded] = useState(false);
  const [lang, setLang] = useState<Language>('KO');

  // Preload key assets eagerly on initialization
  useEffect(() => {
    const ufoImg = new Image();
    ufoImg.src = "https://i.imgur.com/71XeUqK.png";
    ufoImg.onload = () => {
      setUfoLoaded(true);
    };

    const charImg = new Image();
    charImg.src = characterApng;
  }, []);

  const [skipTyping, setSkipTyping] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('void_skip_typing') === 'true';
    }
    return false;
  });
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
  const autocompleteTimeoutRef = useRef<any>(null);
  const autocompleteRetryCount = useRef<number>(0);

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

    return () => {
      if (autocompleteTimeoutRef.current) {
        clearTimeout(autocompleteTimeoutRef.current);
        autocompleteTimeoutRef.current = null;
      }
    };
  }, [page, lang]);

  const initAutocomplete = async () => {
    // Clear any preceding retry timer to prevent runaway multiple loops
    if (autocompleteTimeoutRef.current) {
      clearTimeout(autocompleteTimeoutRef.current);
      autocompleteTimeoutRef.current = null;
    }

    if (autocompleteRef.current) return; // Guard against multiple initializations

    if (inputRef.current && window.google?.maps) {
      autocompleteRetryCount.current = 0; // Reset retries on success
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
    } else if (page === 2 && autocompleteRetryCount.current < 20) {
      // Limit to max 20 retries (2 seconds) to protect browser resources on fail
      autocompleteRetryCount.current++;
      autocompleteTimeoutRef.current = setTimeout(initAutocomplete, 100);
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

      <main className="relative pt-16 sm:pt-20 pb-12 min-h-screen flex flex-col items-center justify-center">
        {<AuroraBackground />}
        <AnimatePresence mode="wait">
          {page === 1 && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center space-y-6 sm:space-y-8 px-6 relative w-full isolate z-10"
            >
              {/* Character Section */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative mt-4 sm:mt-8 z-10 -mb-20 sm:-mb-32 w-full max-w-[500px]"
              >
                
                {/* Speech Bubble */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-[10px] sm:-top-[30px] right-0 translate-x-1/4 sm:translate-x-1/3 shadow-xl border border-black/5 dark:border-white/10 goth-glass p-4 rounded-[20px] max-w-[220px] w-max z-30"
                >
                  {/* Tail (Curved SVG) */}
                  <svg 
                    className="absolute -bottom-[19px] left-6 w-[24px] h-[20px]" 
                    viewBox="0 0 24 20" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ filter: theme === 'dark' ? 'drop-shadow(0 4px 4px rgba(0,0,0,0.5))' : 'drop-shadow(0 2px 3px rgba(0,0,0,0.05))' }}
                  >
                    <path d="M24 0 Q12 10 0 20 Q10 10 12 0 Z" className={theme === 'dark' ? "fill-[#0B0416]" : "fill-[#FAF9F6]"} />
                    <path d="M24 0 Q12 10 0 20" stroke={theme === 'dark' ? "rgba(250, 30, 142, 0.2)" : "rgba(0,0,0,0.08)"} strokeWidth="1" fill="none" />
                    <path d="M0 20 Q10 10 12 0" stroke={theme === 'dark' ? "rgba(250, 30, 142, 0.2)" : "rgba(0,0,0,0.08)"} strokeWidth="1" fill="none" />
                  </svg>

                  <p className="text-[12px] sm:text-[13px] font-medium leading-relaxed italic text-white/90 relative z-10">
                    "{greeting}"
                  </p>
                </motion.div>
                
                  <div className="w-full relative flex flex-col items-center justify-center z-10 pointer-events-none">
                    {/* Character placement to look like they are riding the UFO */}
                    <div 
                      className="w-[190px] h-[190px] sm:w-[230px] sm:h-[230px] relative z-10"
                      style={{ 
                        mixBlendMode: theme === 'dark' ? 'lighten' : 'multiply',
                        opacity: theme === 'dark' ? 0.92 : 1 
                      }}
                    >
                      {isSafari ? (
                        <img
                          src={characterApng}
                          alt="Character"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center top' }}
                        />
                      ) : (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center top' }}
                        >
                          <source src={characterWebm} type="video/webm" />
                        </video>
                      )}
                    </div>
                    {/* UFO */}
                    <img 
                      src="https://i.imgur.com/71XeUqK.png"
                      alt="UFO" 
                      onLoad={() => setUfoLoaded(true)}
                      className="w-[440px] sm:w-[500px] max-w-none h-auto relative z-20 pointer-events-none shrink-0 -mt-[105px] sm:-mt-[135px] transition-all duration-700 ease-out"
                      style={{
                        aspectRatio: '1448 / 1086',
                        opacity: ufoLoaded ? 1 : 0,
                        ...(theme === 'dark' ? { filter: 'hue-rotate(200deg) brightness(0.9) saturate(1.3)' } : {})
                      }}
                      loading="eager"
                    />
                  </div>
              </motion.div>

              <div className="space-y-0 sm:space-y-1 relative z-20">
                <h1 
                  className="text-7xl md:text-8xl tracking-tighter transition-colors"
                  style={{
                    fontFamily: currentTitleFont.fontFamily,
                    fontWeight: (currentTitleFont as any).fontWeight ?? 400,
                    letterSpacing: currentTitleFont.letterSpacing,
                    color: theme === 'dark' ? '#FF2A6D' : '#E8185A',
                    textShadow: theme === 'dark'
                      ? '3px 3px 0px #1a0030, 5px 5px 0px rgba(155, 48, 255, 0.5)'
                      : '2px 2px 0px rgba(200, 0, 100, 0.25), 4px 4px 0px rgba(200, 0, 100, 0.12)',
                  }}
                >
                  {t.intro.title}
                </h1>
                <p 
                  className="max-w-xs mx-auto"
                  style={{
                    color: theme === 'dark' ? 'rgba(255, 255, 255, 0.75)' : '#555555',
                    fontSize: '1rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textShadow: theme === 'dark' ? '0 0 12px rgba(255, 255, 255, 0.2)' : 'none',
                    opacity: 1
                  }}
                >
                  {t.intro.subtitle}
                </p>
              </div>

              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: currentButton.hoverShadow,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setPage(2)}
                className="relative z-20 border-none transition-all duration-300"
                style={{
                  background: currentButton.background,
                  padding: '18px 48px',
                  borderRadius: '9999px',
                  letterSpacing: '0.05em',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  boxShadow: currentButton.boxShadow,
                }}
              >
                {t.intro.button}
              </motion.button>
            </motion.div>
          )}

          {page === 2 && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="relative w-full max-w-md px-6 z-10"
            >
              <div className="goth-glass rounded-[40px] p-4 sm:p-6 space-y-3 sm:space-y-4 relative overflow-hidden">
                {/* Subtle Ambient Top reflection */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-24 bg-white/5 blur-[50px] pointer-events-none" />

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
                    <div className={`flex items-center rounded-2xl focus-within:border-neon-pink border transition-all h-[44px] ${
                      theme === 'light' ? 'bg-slate-100/80 border-slate-200/80' : 'bg-white/5 border-white/10'
                    }`}>
                      <User className="ml-4 w-4 h-4 text-neon-pink shrink-0" />
                      <input 
                        type="text"
                        placeholder={t.input.name}
                        value={userInput.name}
                        onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
                        className={`flex-1 bg-transparent px-3 py-1 h-full text-base focus:outline-none min-w-0 ${
                          theme === 'light' ? 'text-slate-800 placeholder:text-slate-400 font-medium' : 'text-white placeholder:text-white/20'
                        }`}
                      />
                    </div>

                    {/* Date & Time Section */}
                    {lang === 'KO' ? (
                      <>
                        {/* Date Row (KO) */}
                        <DateInput 
                          value={userInput.birthDate}
                          onChange={(v) => setUserInput({ ...userInput, birthDate: v })}
                          lang={lang}
                          calendarType={userInput.calendarType || 'solar'}
                          onCalendarTypeChange={(type) => setUserInput({ ...userInput, calendarType: type })}
                          theme={theme}
                          t={t}
                        />
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
                        <DateInput 
                          value={userInput.birthDate}
                          onChange={(v) => setUserInput({ ...userInput, birthDate: v })}
                          lang={lang}
                          calendarType={userInput.calendarType || 'solar'}
                          onCalendarTypeChange={(type) => setUserInput({ ...userInput, calendarType: type })}
                          theme={theme}
                          t={t}
                        />
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
                    <div className={`flex items-center gap-2 p-1.5 border rounded-2xl ${
                      theme === 'light' ? 'bg-slate-100/80 border-slate-200/80' : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex items-center gap-1.5 pl-2 border-r border-white/10 pr-2">
                        <User className="w-3.5 h-3.5 text-neon-pink" />
                        <span className={`text-[10px] sm:text-xs font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>{t.input.gender}</span>
                      </div>
                      <HorizontalScrollArea className="flex flex-1 items-center gap-1">
                        <button 
                          onClick={() => setUserInput({ ...userInput, gender: 'male' })}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${userInput.gender === 'male' ? 'bg-neon-cyan text-black shadow-[0_0_15px_rgba(0,255,255,0.3)]' : (theme === 'light' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40' : 'text-white/40 hover:text-white/60')}`}
                        >
                          {t.input.male}
                        </button>
                        <button 
                          onClick={() => setUserInput({ ...userInput, gender: 'female' })}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${userInput.gender === 'female' ? 'bg-neon-pink text-white shadow-[0_0_15px_rgba(255,0,122,0.3)]' : (theme === 'light' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40' : 'text-white/40 hover:text-white/60')}`}
                        >
                          {t.input.female}
                        </button>
                        <button 
                          onClick={() => setUserInput({ ...userInput, gender: 'non-binary' })}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${userInput.gender === 'non-binary' ? 'bg-gradient-to-r from-neon-cyan to-neon-pink text-white shadow-[0_0_15px_rgba(255,0,122,0.3)]' : (theme === 'light' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40' : 'text-white/40 hover:text-white/60')}`}
                        >
                          {t.input.nonBinary}
                        </button>
                        <button 
                          onClick={() => setUserInput({ ...userInput, gender: 'prefer-not-to-tell' })}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap ${userInput.gender === 'prefer-not-to-tell' ? 'bg-red-900 text-white' : (theme === 'light' ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/40' : 'text-white/40 hover:text-white/60')}`}
                        >
                          {t.input.preferNotToTell}
                        </button>
                      </HorizontalScrollArea>
                    </div>

                    {/* City */}
                    <div className={`flex items-center rounded-2xl focus-within:border-neon-pink border transition-all relative ${
                      theme === 'light' ? 'bg-slate-100/80 border-slate-200/80' : 'bg-white/5 border-white/10'
                    }`}>
                      <Globe className="ml-4 w-4 h-4 text-neon-pink shrink-0" />
                      <input 
                        ref={inputRef}
                        type="text"
                        placeholder={t.input.city}
                        value={userInput.city}
                        onChange={(e) => setUserInput({ ...userInput, city: e.target.value })}
                        className={`flex-1 bg-transparent py-2.5 pl-3 pr-4 text-base focus:outline-none min-w-0 ${
                          theme === 'light' ? 'text-slate-800 placeholder:text-slate-400 font-medium' : 'text-white placeholder:text-white/20'
                        }`}
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
                       <label className={`text-xs pl-2 uppercase font-mono ${theme === 'light' ? 'text-slate-500' : 'text-white/50'}`}>{lang === 'KO' ? '사회적 환경 (선택)' : 'Social Context (Optional)'}</label>
                       <select 
                          value={userInput.socialContext || 'none'}
                          onChange={(e) => setUserInput({ ...userInput, socialContext: e.target.value as any })}
                          className={`w-full border rounded-2xl py-2.5 px-4 text-base focus:outline-none focus:border-neon-pink transition-all appearance-none ${
                            theme === 'light' ? 'bg-slate-100/80 border-slate-200/80 text-slate-800 font-medium' : 'bg-white/5 border-white/10 text-white/80'
                          }`}
                       >
                         <option value="none" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-black text-white'}>{lang === 'KO' ? '선택 안함' : 'None'}</option>
                         <option value="military_public" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-black text-white'}>{lang === 'KO' ? '군인/경찰/공무원' : 'Military/Public Service'}</option>
                         <option value="corporate" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-black text-white'}>{lang === 'KO' ? '일반 직장인' : 'Corporate Employee'}</option>
                         <option value="business_freelance" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-black text-white'}>{lang === 'KO' ? '사업/프리랜서' : 'Business/Freelance'}</option>
                         <option value="professional_it" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-black text-white'}>{lang === 'KO' ? '전문직/IT' : 'Professional/IT'}</option>
                         <option value="education" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-black text-white'}>{lang === 'KO' ? '교육/교직' : 'Education/Teaching'}</option>
                         <option value="arts_creative" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-black text-white'}>{lang === 'KO' ? '예술/창작' : 'Arts/Creative'}</option>
                         <option value="student" className={theme === 'light' ? 'bg-white text-slate-800' : 'bg-black text-white'}>{lang === 'KO' ? '학생/취업준비' : 'Student/Job Seeker'}</option>
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
                    className="w-full py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl text-xs font-bold tracking-[0.4em] uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              className="relative w-full z-10"
            >
              <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-[400px] text-neon-pink p-8">
                  <Sparkles className="w-10 h-10 animate-spin mb-4 text-neon-pink" />
                  <p className="text-sm font-mono tracking-widest uppercase text-white/80">
                    {lang === 'KO' ? '깊은 운명의 비밀들을 정교하게 계산하는 중...' : 'Decoding cosmic timelines...'}
                  </p>
                </div>
              }>
                <BaZiResultPage 
                  result={result} 
                  lang={lang} 
                  userName={userInput.name}
                  gender={userInput.gender}
                  city={userInput.city}
                  socialContext={userInput.socialContext}
                  onBack={() => setPage(2)} 
                  skipTyping={skipTyping}
                />
              </Suspense>
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
