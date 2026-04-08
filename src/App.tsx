/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, Calendar, User, ChevronRight, ChevronLeft, Languages, Clock } from 'lucide-react';
import { Language, UserInput, BaZiResult } from './types';
import { TRANSLATIONS } from './constants';
import CosmicWheel from './components/CosmicWheel';
import BaZiResultPage from './components/BaZiResultPage';

import { calculateRealBaZi } from './services/bazi-service';

import { useMemo, useRef } from 'react';

const TimeInput = ({ value, onChange, lang }: { value: string, onChange: (v: string) => void, lang: Language }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const prev = value;
    const isDeleting = val.length < prev.length;
    
    let formatted = val;
    if (isDeleting) {
      // Backspace through separator: delete the character before it too
      if (prev.endsWith(':') && val.length === 2) {
        formatted = val.slice(0, -1);
      }
    } else {
      // Auto-formatting for typing/pasting
      const digits = val.replace(/\D/g, '');
      if (digits.length <= 2) {
        formatted = digits;
        if (digits.length === 2) formatted += ':';
      } else {
        formatted = digits.slice(0, 2) + ':' + digits.slice(2);
      }
    }
    
    // Limit length to 5 (HH:MM)
    if (formatted.length <= 5) {
      onChange(formatted);
    }
  };

  return (
    <div className="relative w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus-within:border-neon-pink transition-all flex items-center">
      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-pink pointer-events-none" />
      <input 
        type="text"
        placeholder="HH:MM (24h)"
        value={value}
        onChange={handleChange}
        className="w-full bg-transparent text-white focus:outline-none placeholder:text-white/20"
      />
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
      const g: any = { v: "weekly" };
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
  }, [page]);

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
            setUserInput(prev => ({ ...prev, city: place.name || '' }));
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
  }, [page, debouncedInput.birthDate, debouncedInput.birthTime, debouncedInput.gender, coords.lat, coords.lon, lang]);

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
      setThrottleMessage('우주의 기운이 너무 복잡하여 잠시 휴식이 필요합니다');
      
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

        <button 
          onClick={() => setLang(lang === 'KO' ? 'EN' : 'KO')}
          className="flex items-center gap-2 px-4 py-2 goth-glass rounded-full text-[10px] font-bold tracking-widest hover:border-neon-cyan transition-all"
        >
          <Languages className="w-3 h-3 text-neon-cyan" />
          {lang}
        </button>
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
              <div className="relative w-64 h-64">
                {/* Speech Bubble */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-12 -right-12 goth-glass p-4 rounded-2xl rounded-bl-none max-w-[180px] z-20"
                >
                  <p className="text-[11px] font-medium leading-relaxed italic">
                    "{greeting}"
                  </p>
                </motion.div>
                
                {/* Placeholder for 3D Character (Stylized SVG) */}
                <div className="w-full h-full rounded-full bg-gradient-to-b from-neon-purple/20 to-transparent flex items-center justify-center border border-white/5 relative">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-8xl"
                  >
                    🧛‍♀️
                  </motion.div>
                  {/* Neon Ring */}
                  <div className="absolute inset-0 border-2 border-neon-pink/30 rounded-full animate-pulse" />
                </div>
              </div>

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
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-pink" />
                      <input 
                        type="text"
                        placeholder={t.input.name}
                        value={userInput.name}
                        onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-neon-pink transition-all placeholder:text-white/20"
                      />
                    </div>

                    {/* Date & Calendar Type */}
                    <div className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-pink pointer-events-none" />
                        <input 
                          type="text"
                          placeholder="YYYY-MM-DD"
                          value={userInput.birthDate}
                          onChange={(e) => {
                            const val = e.target.value;
                            const prev = userInput.birthDate;
                            const isDeleting = val.length < prev.length;
                            let formatted = val;

                            if (isDeleting) {
                              if (prev.endsWith('-') && (val.length === 4 || val.length === 7)) {
                                formatted = val.slice(0, -1);
                              }
                            } else {
                              const digits = val.replace(/\D/g, '');
                              if (digits.length <= 4) {
                                formatted = digits;
                                if (digits.length === 4) formatted += '-';
                              } else if (digits.length <= 6) {
                                formatted = digits.slice(0, 4) + '-' + digits.slice(4);
                                if (digits.length === 6) formatted += '-';
                              } else {
                                formatted = digits.slice(0, 4) + '-' + digits.slice(4, 6) + '-' + digits.slice(6);
                              }
                            }

                            if (formatted.length <= 10) {
                              setUserInput({ ...userInput, birthDate: formatted });
                            }
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-neon-pink transition-all placeholder:text-white/20"
                        />
                      </div>
                      
                      {lang === 'KO' && (
                        <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1 h-[42px] items-center">
                          <button 
                            onClick={() => setUserInput({ ...userInput, calendarType: 'solar' })}
                            className={`px-2 py-1 rounded-xl text-[9px] font-bold transition-all whitespace-nowrap ${(!userInput.calendarType || userInput.calendarType === 'solar') ? 'bg-neon-cyan text-black' : 'text-white/40 hover:text-white/60'}`}
                          >
                            {t.input.solar}
                          </button>
                          <button 
                            onClick={() => setUserInput({ ...userInput, calendarType: 'lunar' })}
                            className={`px-2 py-1 rounded-xl text-[9px] font-bold transition-all whitespace-nowrap ${userInput.calendarType === 'lunar' ? 'bg-neon-pink text-white' : 'text-white/40 hover:text-white/60'}`}
                          >
                            {t.input.lunar}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Time */}
                    <div className="relative">
                      <TimeInput 
                        value={userInput.birthTime}
                        onChange={(v) => setUserInput({ ...userInput, birthTime: v })}
                        lang={lang}
                      />
                    </div>

                    {/* Gender Selection */}
                    <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="flex items-center gap-1.5 pl-2 border-r border-white/10 pr-2">
                        <User className="w-3.5 h-3.5 text-neon-pink" />
                        <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase whitespace-nowrap">{t.input.gender}</span>
                      </div>
                      <div className="flex flex-1 items-center gap-1 overflow-x-auto no-scrollbar">
                        <button 
                          onClick={() => setUserInput({ ...userInput, gender: 'male' })}
                          className={`px-2.5 py-1 rounded-xl text-[9px] font-bold transition-all whitespace-nowrap ${userInput.gender === 'male' ? 'bg-neon-cyan text-black' : 'text-white/40 hover:text-white/60'}`}
                        >
                          {t.input.male}
                        </button>
                        <button 
                          onClick={() => setUserInput({ ...userInput, gender: 'female' })}
                          className={`px-2.5 py-1 rounded-xl text-[9px] font-bold transition-all whitespace-nowrap ${userInput.gender === 'female' ? 'bg-neon-pink text-white' : 'text-white/40 hover:text-white/60'}`}
                        >
                          {t.input.female}
                        </button>
                        {lang === 'EN' && (
                          <>
                            <button 
                              onClick={() => setUserInput({ ...userInput, gender: 'non-binary' })}
                              className={`px-2.5 py-1 rounded-xl text-[9px] font-bold transition-all whitespace-nowrap ${userInput.gender === 'non-binary' ? 'bg-gradient-to-r from-neon-cyan to-neon-pink text-white' : 'text-white/40 hover:text-white/60'}`}
                            >
                              {t.input.nonBinary}
                            </button>
                            <button 
                              onClick={() => setUserInput({ ...userInput, gender: 'prefer-not-to-tell' })}
                              className={`px-2.5 py-1 rounded-xl text-[9px] font-bold transition-all whitespace-nowrap ${userInput.gender === 'prefer-not-to-tell' ? 'bg-red-900 text-white' : 'text-white/40 hover:text-white/60'}`}
                            >
                              {t.input.preferNotToTell}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* City */}
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-pink" />
                      <input 
                        ref={inputRef}
                        type="text"
                        placeholder={t.input.city}
                        value={userInput.city}
                        onChange={(e) => setUserInput({ ...userInput, city: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-neon-pink transition-all placeholder:text-white/20"
                      />
                      <AnimatePresence>
                        {isLocationSynced && (
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neon-cyan uppercase"
                          >
                            {t.nav.synced}
                          </motion.div>
                        )}
                      </AnimatePresence>
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
