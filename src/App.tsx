/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, MouseEvent as ReactMouseEvent, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, Calendar, User, ChevronRight, ChevronLeft, Languages, Clock, Sun, Moon, Keyboard, Zap, Menu, X, Trash2, Edit2, Save, Youtube, Compass, BookOpen, Plus, Bookmark, LogIn } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { Language, UserInput, BaZiResult } from './types';
import { TRANSLATIONS } from './constants';
import CosmicWheel from './components/CosmicWheel';
import AuroraBackground from './components/AuroraBackground';

import BaZiResultPage, { SoulSummaryCard } from './components/BaZiResultPage';
import BaZiInterpretationPage from './components/BaZiInterpretationPage';

import { calculateRealBaZi } from './services/bazi-service';
import { decompressPayload, decompressFromShortId } from './services/share-compress-service';

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
        <Calendar className="ml-4 w-4 h-4 text-neon-pink pointer-events-none shrink-0" />
        
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
          className={`flex-1 min-w-0 bg-transparent px-3 h-full tracking-[0.05em] font-mono focus:outline-none ${
            theme === 'light' ? 'text-slate-800 placeholder:text-slate-400 font-semibold' : 'text-white placeholder:text-white/20'
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

// Saved Bazi (Saju record) definition and metadata
export interface SavedBazi {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  isTimeUnknown: boolean;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-tell';
  calendarType: 'solar' | 'lunar';
  city: string;
  memo: string;
  lat?: number;
  lon?: number;
  socialContext?: any;
  stem: string;
  branch: string;
  group?: string;
  createdAt?: number;
}

const STEM_INFO: Record<string, { color: string; ko: string; bg: string; element: string }> = {
  '甲': { color: '#4ADE80', ko: '갑', bg: 'rgba(74, 222, 128, 0.1)', element: 'Wood' },
  '乙': { color: '#22C55E', ko: '을', bg: 'rgba(34, 197, 94, 0.1)', element: 'Wood' },
  '丙': { color: '#F87171', ko: '병', bg: 'rgba(248, 113, 113, 0.1)', element: 'Fire' },
  '丁': { color: '#EF4444', ko: '정', bg: 'rgba(239, 68, 68, 0.1)', element: 'Fire' },
  '戊': { color: '#FBBF24', ko: '무', bg: 'rgba(251, 191, 36, 0.1)', element: 'Earth' },
  '己': { color: '#D97706', ko: '기', bg: 'rgba(217, 119, 6, 0.1)', element: 'Earth' },
  '庚': { color: '#FAFAFA', ko: '경', bg: 'rgba(226, 232, 240, 0.1)', element: 'Metal' },
  '辛': { color: '#CBD5E1', ko: '신', bg: 'rgba(148, 163, 184, 0.1)', element: 'Metal' },
  '壬': { color: '#60A5FA', ko: '임', bg: 'rgba(96, 165, 250, 0.1)', element: 'Water' },
  '癸': { color: '#3B82F6', ko: '계', bg: 'rgba(59, 130, 246, 0.1)', element: 'Water' },
};

const STEM_EN: Record<string, string> = {
  '甲': 'Gap', '乙': 'Eul', '丙': 'Byeong', '丁': 'Jeong', '戊': 'Mu',
  '己': 'Gi', '庚': 'Gyeong', '辛': 'Sin', '壬': 'Im', '癸': 'Gye'
};

const BRANCH_INFO: Record<string, { color: string; ko: string; animal: string; bg: string; element: string }> = {
  '子': { color: '#3B82F6', ko: '자', animal: '쥐', bg: 'rgba(59, 130, 246, 0.1)', element: 'Water' },
  '丑': { color: '#D97706', ko: '축', animal: '소', bg: 'rgba(217, 119, 6, 0.1)', element: 'Earth' },
  '寅': { color: '#4ADE80', ko: '인', animal: '호랑이', bg: 'rgba(74, 222, 128, 0.1)', element: 'Wood' },
  '卯': { color: '#22C55E', ko: '묘', animal: '토끼', bg: 'rgba(34, 197, 94, 0.1)', element: 'Wood' },
  '辰': { color: '#FBBF24', ko: '진', animal: '용', bg: 'rgba(251, 191, 36, 0.1)', element: 'Earth' },
  '巳': { color: '#F87171', ko: '사', animal: '뱀', bg: 'rgba(248, 113, 113, 0.1)', element: 'Fire' },
  '午': { color: '#EF4444', ko: '오', animal: '말', bg: 'rgba(239, 68, 68, 0.1)', element: 'Fire' },
  '未': { color: '#D97706', ko: '미', animal: '양', bg: 'rgba(217, 119, 6, 0.1)', element: 'Earth' },
  '申': { color: '#FAFAFA', ko: '신', animal: '원숭이', bg: 'rgba(226, 232, 240, 0.1)', element: 'Metal' },
  '酉': { color: '#CBD5E1', ko: '유', animal: '닭', bg: 'rgba(148, 163, 184, 0.1)', element: 'Metal' },
  '戌': { color: '#FBBF24', ko: '술', animal: '개', bg: 'rgba(251, 191, 36, 0.1)', element: 'Earth' },
  '亥': { color: '#3B82F6', ko: '해', animal: '돼지', bg: 'rgba(59, 130, 246, 0.1)', element: 'Water' },
};

const BRANCH_EN: Record<string, string> = {
  '子': 'ja', '丑': 'chuk', '寅': 'in', '卯': 'myo', '辰': 'jin',
  '巳': 'sa', '午': 'o', '未': 'mi', '申': 'sin', '酉': 'yu',
  '戌': 'sul', '亥': 'hae'
};

const IljuStampImage: React.FC<{ stem: string; branch: string; lang: 'KO' | 'EN' }> = ({ stem, branch, lang }) => {
  const { theme } = useTheme();
  const stemData = STEM_INFO[stem] || { color: '#FFF', ko: stem, bg: 'rgba(255,255,255,0.1)', element: 'None' };
  const branchData = BRANCH_INFO[branch] || { color: '#FFF', ko: branch, animal: '', bg: 'rgba(255,255,255,0.1)', element: 'None' };

  const isLight = theme === 'light';

  const getElementColor = (color: string, element: string) => {
    if (!isLight) return color;
    switch (element) {
      case 'Wood':
        return '#16a34a'; // Premium dark green
      case 'Fire':
        return '#dc2626'; // Premium dark red
      case 'Earth':
        return '#ca8a04'; // Premium dark gold/brown
      case 'Metal':
        return '#4b5563'; // Premium deep metal gray
      case 'Water':
        return '#2563eb'; // Premium dark blue
      default:
        return '#374151';
    }
  };

  const stemColor = getElementColor(stemData.color, stemData.element);
  const branchColor = getElementColor(branchData.color, branchData.element);
  const iljuRomanized = `${STEM_EN[stem] || stem}${BRANCH_EN[branch] || branch}`;

  return (
    <div 
      className={`relative w-12 h-12 rounded-xl overflow-hidden shrink-0 flex flex-col items-center justify-center p-1 select-none pointer-events-none transition-all duration-300 ${
        isLight 
          ? 'border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.05)]' 
          : 'border border-white/10 shadow-lg'
      }`}
      style={{
        background: isLight 
          ? `linear-gradient(135deg, ${stemColor}15 0%, ${branchColor}15 100%)`
          : `linear-gradient(135deg, ${stemData.color}15 0%, ${branchData.color}15 100%)`,
        boxShadow: isLight
          ? `inset 0 0 8px ${stemColor}10`
          : `inset 0 0 8px ${stemData.color}15, 0 4px 10px rgba(0,0,0,0.4)`
      }}
    >
      {/* Decorative Elemental Ring */}
      <div 
        className="absolute inset-[2px] rounded-[10px] border border-dashed opacity-30"
        style={{ borderColor: isLight ? stemColor : stemData.color }}
      />
      {/* Dynamic Hanja Text Stamps */}
      <div className="flex gap-[1px] items-center justify-center font-gothic z-10 leading-none">
        <span className="text-xs font-black" style={{ color: stemColor, textShadow: isLight ? 'none' : `0 0 4px ${stemData.color}50` }}>{stem}</span>
        <span className="text-xs font-black" style={{ color: branchColor, textShadow: isLight ? 'none' : `0 0 4px ${branchData.color}50` }}>{branch}</span>
      </div>
      {/* Korean text tag / English phonetic tag */}
      <span className={`text-[8px] font-bold z-10 tracking-tighter leading-none mt-1.5 px-1 py-0.5 rounded text-center truncate max-w-full transition-colors ${
        isLight 
          ? 'bg-slate-100 text-slate-705 font-extrabold border border-slate-200/60' 
          : 'bg-black/50 text-white/95 border border-white/5'
      }`}>
        {lang === 'KO' ? `${stemData.ko}${branchData.ko}일주` : iljuRomanized}
      </span>
    </div>
  );
};

// Main Application Component
export default function App() {
  const currentTitleFont = titleFonts[titleFontVariant];
  const currentButton = buttonStyles[buttonVariant];
  const { theme, toggleTheme } = useTheme();
  
  const [page, setPage] = useState<1 | 2 | 3>(1);
  const [resultViewMode, setResultViewMode] = useState<'result' | 'interpretation'>('result');
  const [ufoLoaded, setUfoLoaded] = useState(false);
  const [lang, setLang] = useState<Language>('KO');

  // Shared Mode States
  const [sharedInput, setSharedInput] = useState<UserInput | null>(null);
  const [isSharedView, setIsSharedView] = useState<boolean>(false);
  const [sharedCoords, setSharedCoords] = useState({ lat: 37.5665, lon: 126.9780 });
  const [sharedViewMode, setSharedViewMode] = useState<'summary' | 'interpretation'>('summary');

  // URL decoding for sharing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedParam = params.get('s');
    const langParam = params.get('lang');
    const viewParam = params.get('view');
    if (langParam) {
      const normalizedLang = langParam.toUpperCase();
      if (normalizedLang === 'EN' || normalizedLang === 'KO') {
        setLang(normalizedLang as Language);
      }
    }
    if (viewParam === 'interpretation') {
      setSharedViewMode('interpretation');
    } else {
      setSharedViewMode('summary');
    }
    if (sharedParam) {
      try {
        const decodedPayload = decodeURIComponent(escape(atob(sharedParam)));
        let parsedInput: any = null;
        if (decodedPayload.startsWith('v5_') || decodedPayload.startsWith('v4_')) {
          parsedInput = decompressFromShortId(decodedPayload);
        } else {
          try {
            const rawObj = JSON.parse(decodedPayload);
            parsedInput = decompressPayload(rawObj);
          } catch (jsonErr) {
            // Check if decodePayload itself might be a direct shortId string (without JSON wrapping)
            parsedInput = decompressFromShortId(decodedPayload);
          }
        }

        if (parsedInput && parsedInput.birthDate) {
          setSharedInput(parsedInput);
          setIsSharedView(true);
          const finalLat = parsedInput.lat !== undefined ? parsedInput.lat : 37.5665;
          const finalLon = parsedInput.lon !== undefined ? parsedInput.lon : 126.9780;
          setSharedCoords({ lat: finalLat, lon: finalLon });
        }
      } catch (e) {
        console.error("Failed to parse shared soul profile payload", e);
      }
    }
  }, []);

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [savedBaziList, setSavedBaziList] = useState<SavedBazi[]>([]);
  const [newRecordCustomName, setNewRecordCustomName] = useState('');
  const [newRecordMemo, setNewRecordMemo] = useState('');
  const [showPendingModal, setShowPendingModal] = useState<string | null>(null);
  
  // Stored Record Edit states
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    birthDate: string;
    birthTime: string;
    isTimeUnknown: boolean;
    gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-tell';
    calendarType: 'solar' | 'lunar';
    memo: string;
  } | null>(null);
  
  // Storage Group & Paging states
  const [profileGroups, setProfileGroups] = useState<{ id: string; name: string }[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('void_saved_groups_v1');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [{ id: 'me', name: 'me' }];
  });
  const [selectedSaveGroup, setSelectedSaveGroup] = useState<string>('me');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(4);

  // Group creator modal states
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedProfileIdsForNewGroup, setSelectedProfileIdsForNewGroup] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('void_saved_groups_v1', JSON.stringify(profileGroups));
  }, [profileGroups]);

  // Reset pagination count when filter changes
  useEffect(() => {
    setVisibleCount(4);
  }, [filterGroup]);

  // Load saved bazi list from localStorage on init
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('void_saved_bazi_v1');
        if (stored) {
          setSavedBaziList(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load saved bazi storage:", e);
      }
    }
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
    calendarType: 'solar',
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

  // Shared BaZi Calculation with Error Handling
  const sharedResult = useMemo(() => {
    if (isSharedView && sharedInput && sharedInput.birthDate && sharedInput.birthTime) {
      try {
        console.log("Attempting shared BaZi calculation with:", sharedInput.birthDate, sharedInput.birthTime, sharedCoords.lat, sharedCoords.lon, lang);
        return calculateRealBaZi(sharedInput, sharedCoords.lat, sharedCoords.lon, lang);
      } catch (error) {
        console.error("Shared BaZi calculation failed in App.tsx:", error);
        return null;
      }
    }
    return null;
  }, [isSharedView, sharedInput, sharedCoords.lat, sharedCoords.lon, lang]);

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
    setResultViewMode('result'); // Reset view mode to summary when calculating new result
    setDebouncedInput(userInput); // Set immediately to prevent debounce lag on page change
    setPage(3);
  };

  const handleSaveCurrentBazi = () => {
    if (!userInput.birthDate || !userInput.birthTime) {
      alert(lang === 'KO' ? '먼저 생년월일과 태어난 시간을 채워주세요!' : 'Please enter birthdate and time first.');
      return;
    }
    try {
      // Compute the real Bazi to extract the correct Ilju
      const baziRes = calculateRealBaZi(userInput, coords.lat, coords.lon, lang);
      const dayPillar = baziRes.pillars.find(p => p.title === 'Day');
      const stem = dayPillar?.stem || '甲';
      const branch = dayPillar?.branch || '子';
      
      const newRecord: SavedBazi = {
        id: Date.now().toString(),
        name: newRecordCustomName.trim() || userInput.name || (lang === 'KO' ? '무명씨' : 'Anonymous'),
        birthDate: userInput.birthDate,
        birthTime: userInput.birthTime,
        isTimeUnknown: !!userInput.isTimeUnknown,
        gender: userInput.gender || 'male',
        calendarType: userInput.calendarType || 'solar',
        city: userInput.city || 'Seoul',
        memo: newRecordMemo.trim(),
        lat: coords.lat,
        lon: coords.lon,
        socialContext: userInput.socialContext || 'none',
        stem,
        branch,
        group: selectedSaveGroup,
        createdAt: Date.now()
      };
      
      const updatedList = [newRecord, ...savedBaziList];
      setSavedBaziList(updatedList);
      localStorage.setItem('void_saved_bazi_v1', JSON.stringify(updatedList));
      
      // Reset input fields
      setNewRecordCustomName('');
      setNewRecordMemo('');
      
      alert(lang === 'KO' ? '명식이 명식저장소에 안전하게 보관되었습니다!' : 'Saju record saved to local storage!');
    } catch (e) {
      console.error(e);
      alert(lang === 'KO' ? '명식 생성 및 계산 중 오류가 발생했습니다.' : 'Failed to analyze and save record.');
    }
  };

  const handleToggleRecordGroup = (id: string, group: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedList = savedBaziList.map(item => {
      if (item.id === id) {
        const nextGroup = item.group === group ? 'others' : group;
        return { ...item, group: nextGroup };
      }
      return item;
    });
    setSavedBaziList(updatedList);
    localStorage.setItem('void_saved_bazi_v1', JSON.stringify(updatedList));
  };

  const handleDeleteGroup = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const groupName = profileGroups.find(g => g.id === groupId)?.name || '';
    const confirmMsg = lang === 'KO' 
      ? `정말 '${groupName}' 그룹을 삭제하시겠습니까? (그룹 내 명식들은 보존됩니다)` 
      : `Are you sure you want to delete the '${groupName}' group? (The profiles will not be deleted)`;
    if (confirm(confirmMsg)) {
      const updatedGroups = profileGroups.filter(g => g.id !== groupId);
      setProfileGroups(updatedGroups);
      localStorage.setItem('void_saved_groups_v1', JSON.stringify(updatedGroups));
      
      // Cleanup references in profiles
      const updatedProfiles = savedBaziList.map(item => {
        if (item.group === groupId) {
          return { ...item, group: 'others' };
        }
        return item;
      });
      setSavedBaziList(updatedProfiles);
      localStorage.setItem('void_saved_bazi_v1', JSON.stringify(updatedProfiles));
      
      if (filterGroup === groupId) {
        setFilterGroup('all');
      }
    }
  };

  const handleCreateGroup = () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) {
      alert(lang === 'KO' ? '그룹 이름을 입력해주세요.' : 'Please enter a group name.');
      return;
    }
    const newId = 'group_' + Date.now();
    const newGroup = { id: newId, name: trimmed };
    setProfileGroups(prev => [...prev, newGroup]);

    // Update group for all checked profiles
    if (selectedProfileIdsForNewGroup.length > 0) {
      const updatedProfiles = savedBaziList.map(item => {
        if (selectedProfileIdsForNewGroup.includes(item.id)) {
          return { ...item, group: newId };
        }
        return item;
      });
      setSavedBaziList(updatedProfiles);
      localStorage.setItem('void_saved_bazi_v1', JSON.stringify(updatedProfiles));
    }

    // Reset and close
    setNewGroupName('');
    setSelectedProfileIdsForNewGroup([]);
    setIsAddingGroup(false);
  };

  const executeDeleteBazi = (id: string) => {
    const updatedList = savedBaziList.filter(item => item.id !== id);
    setSavedBaziList(updatedList);
    localStorage.setItem('void_saved_bazi_v1', JSON.stringify(updatedList));
    if (editingRecordId === id) {
      setEditingRecordId(null);
      setEditForm(null);
    }
    if (pendingDeleteId === id) {
      setPendingDeleteId(null);
    }
  };

  const handleDeleteBazi = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop clicking row from loading the deleted item
    setPendingDeleteId(id);
  };

  const handleUpdateBazi = (id: string, updated: {
    name: string;
    birthDate: string;
    birthTime: string;
    isTimeUnknown: boolean;
    gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-tell';
    calendarType: 'solar' | 'lunar';
    memo: string;
  }) => {
    try {
      const match = savedBaziList.find(item => item.id === id);
      if (!match) return;

      const dummyInput: UserInput = {
        name: updated.name,
        birthDate: updated.birthDate,
        birthTime: updated.birthTime,
        isTimeUnknown: updated.isTimeUnknown,
        gender: updated.gender,
        calendarType: updated.calendarType,
        city: match.city || 'Seoul'
      };

      const latVal = match.lat !== undefined ? match.lat : 37.5665;
      const lonVal = match.lon !== undefined ? match.lon : 126.9780;

      // Compute correct stem/branch
      const baziRes = calculateRealBaZi(dummyInput, latVal, lonVal, lang);
      const dayPillar = baziRes.pillars.find(p => p.title === 'Day');
      const stem = dayPillar?.stem || '甲';
      const branch = dayPillar?.branch || '子';

      const updatedList = savedBaziList.map(item => {
        if (item.id === id) {
          return {
            ...item,
            name: updated.name.trim() || (lang === 'KO' ? '무명씨' : 'Anonymous'),
            birthDate: updated.birthDate,
            birthTime: updated.birthTime,
            isTimeUnknown: updated.isTimeUnknown,
            gender: updated.gender,
            calendarType: updated.calendarType,
            memo: updated.memo.trim(),
            stem,
            branch
          };
        }
        return item;
      });

      setSavedBaziList(updatedList);
      localStorage.setItem('void_saved_bazi_v1', JSON.stringify(updatedList));
      setEditingRecordId(null);
      setEditForm(null);
    } catch (e) {
      console.error(e);
      alert(lang === 'KO' ? '수정 중 오류가 발생했습니다.' : 'Error occurred while saving changes.');
    }
  };

  const handleLoadBazi = (record: SavedBazi) => {
    const freshInput = {
      name: record.name,
      birthDate: record.birthDate,
      birthTime: record.birthTime,
      isTimeUnknown: record.isTimeUnknown,
      city: record.city,
      gender: record.gender,
      calendarType: record.calendarType,
      socialContext: record.socialContext || 'none'
    };
    setUserInput(freshInput);
    setDebouncedInput(freshInput); // Bypass debounce lag immediately on loading
    setCoords({
      lat: record.lat !== undefined ? record.lat : 37.5665,
      lon: record.lon !== undefined ? record.lon : 126.9780
    });
    setPage(3);
    setIsMenuOpen(false); // close side menu
  };

  const handleBack = () => {
    if (page === 2) setPage(1);
    else if (page === 3) {
      if (resultViewMode === 'interpretation') {
        setResultViewMode('result');
      } else {
        setPage(2);
      }
    }
  };

  return (
    <div className="min-h-screen bg-goth-bg text-white selection:bg-neon-pink selection:text-white overflow-x-hidden">
      {/* Global Star Field Background */}
      <div className="fixed inset-0 star-field opacity-20 pointer-events-none" />
      
      {/* Top Navigation */}
      <nav id="top-nav-bar" className="fixed top-0 w-full px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center z-50 transition-opacity duration-300 pointer-events-auto bg-goth-bg/40 backdrop-blur-md border-b border-white/5">
        {/* Left Elements: Logo, Back Button & Unified Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => {
              setPage(1);
            }}
            className="font-gothic text-xl sm:text-2xl tracking-tighter neon-text-pink hover:scale-105 transition-transform cursor-pointer bg-transparent border-none p-0 focus:outline-none shrink-0"
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
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center goth-glass rounded-lg border border-white/20 hover:border-white transition-all group shrink-0"
                title={t.nav.back}
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white group-hover:scale-110 transition-transform" />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center goth-glass rounded-lg border border-white/10 hover:border-white hover:bg-neon-pink/10 transition-all shrink-0"
            title={lang === 'KO' ? '메뉴 & 명식저장소' : 'Menu & Storage'}
          >
            <Menu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neon-pink animate-pulse shrink-0" />
          </button>
        </div>

        {/* Right Elements: Saju Metadata (desktop only), Theme Toggle, Language Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <AnimatePresence>
            {page === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden md:flex items-center gap-2 text-[10px] sm:text-xs text-white/60 font-mono leading-none mr-3 border-r border-white/10 pr-3 h-4"
              >
                <span className="font-bold text-white/80 max-w-[80px] truncate">{userInput.name || (lang === 'KO' ? '무명씨' : 'Anonymous')}</span>
                <span>{userInput.birthDate}</span>
                <span>{userInput.isTimeUnknown ? (lang === 'KO' ? '시간모름' : 'Time Unknown') : userInput.birthTime}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 goth-glass rounded-full hover:border-[#FF2A6D] transition-all group shrink-0"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neon-pink group-hover:text-white transition-colors" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neon-pink group-hover:text-black transition-colors" />
            )}
          </button>
          
          <button 
            onClick={() => setLang(lang === 'KO' ? 'EN' : 'KO')}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 goth-glass rounded-full text-[9px] sm:text-[10px] font-bold tracking-widest hover:border-neon-cyan transition-all shrink-0"
          >
            <Languages className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-neon-cyan" />
            {lang === 'KO' ? 'EN' : 'KO'}
          </button>
        </div>
      </nav>

      <main className="relative pt-16 sm:pt-20 pb-12 min-h-screen flex flex-col items-center justify-center">
        {<AuroraBackground />}
        <AnimatePresence mode="wait">
          {isSharedView && sharedResult && sharedInput ? (
            sharedViewMode === 'interpretation' ? (
              <div className="w-full max-w-4xl mx-auto px-4 relative z-10 py-6 animate-fade-in">
                <div className="mb-8 text-center p-6 rounded-3xl border border-neon-purple/20 bg-neon-purple/5 backdrop-blur-md shadow-[0_0_20px_rgba(155,48,255,0.05)] relative overflow-hidden">
                  {/* Subtle reflection light effect */}
                  <div className="absolute -top-12 -left-12 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/30 text-neon-purple text-[10px] sm:text-xs font-bold uppercase tracking-wider font-mono select-none mb-3"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-neon-purple" />
                    {lang === 'KO' ? '공유된 운명의 상세 해설 리포트' : 'Shared Detailed Interpretation Report'}
                  </motion.div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan pr-1 select-none font-black">
                      {sharedInput.name || (lang === 'KO' ? '익명' : 'Anonymous')}
                    </span>
                    <span className="text-white/90">
                      {lang === 'KO' ? '님의 상세 분석 해설' : "'s Detailed Interpretation"}
                    </span>
                  </h1>
                  <p className="text-[10px] sm:text-xs text-white/40 mt-1.5 font-sans">
                    {lang === 'KO' ? '공유된 링크를 통해 상세 해설을 열람 중입니다.' : 'Viewing detailed interpretation via a shared link.'}
                  </p>
                </div>

                <BaZiInterpretationPage
                  result={sharedResult}
                  lang={lang}
                  userInput={sharedInput}
                  coords={sharedCoords}
                  onBack={() => {
                    if (typeof window !== 'undefined') {
                      const newUrl = window.location.origin + window.location.pathname;
                      window.history.replaceState(null, '', newUrl);
                    }
                    setIsSharedView(false);
                    setSharedInput(null);
                    setPage(1);
                  }}
                  isSharedView={true}
                  skipLoading={true}
                  onStartAnalysis={() => {
                    if (typeof window !== 'undefined') {
                      const newUrl = window.location.origin + window.location.pathname;
                      window.history.replaceState(null, '', newUrl);
                    }
                    setIsSharedView(false);
                    setSharedInput(null);
                    setPage(2); // Go directly to saju birth date input form
                  }}
                />
              </div>
            ) : (
              <motion.div
                key="shared-view"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center justify-center text-center py-10"
              >
                {/* Specialized Header for Shared Mode */}
                <div className="mb-8 space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-xs font-semibold uppercase tracking-widest font-mono select-none"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-neon-pink" />
                    {lang === 'KO' ? '공유된 운명의 우주 프로필' : 'Shared Cosmic Soul Profile'}
                  </motion.div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan select-none pr-1">
                      {sharedInput.name || (lang === 'KO' ? '익명' : 'Anonymous')}
                    </span>
                    {lang === 'KO' ? '님의 실시간 영혼의 테마' : "'s Soul Theme Analysis"}
                  </h1>
                  <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto font-sans leading-relaxed">
                    {lang === 'KO' 
                      ? '사주(BaZi)의 기하학적 기운과 에너지를 결합해 정교하게 추출된 자아 분석 리포트입니다.'
                      : 'A sophisticated self-analysis report calculated from the energetic geometry of their birth time.'}
                  </p>
                </div>

                {/* Render the full SoulSummaryCard */}
                <div className="w-full max-w-3xl">
                  <SoulSummaryCard 
                    result={sharedResult} 
                    lang={lang} 
                    userInput={sharedInput} 
                    coords={sharedCoords} 
                    isSharedView={true}
                  />
                </div>

                {/* High-Impact CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full max-w-md mx-auto mt-10 px-4"
                >
                  <div className="relative group p-[2px] rounded-2xl bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan animate-[pulse_3s_infinite] shadow-[0_0_25px_rgba(255,0,122,0.25)] hover:shadow-[0_0_35px_rgba(0,243,255,0.4)] transition-all duration-300">
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          const newUrl = window.location.origin + window.location.pathname;
                          window.history.replaceState(null, '', newUrl);
                        }
                        setIsSharedView(false);
                        setSharedInput(null);
                        setPage(2); // Go directly to saju birth date input form
                      }}
                      className="w-full py-5 px-6 bg-[#0B0118] hover:bg-[#0B0118]/80 text-white font-bold rounded-2xl transition-all flex flex-col items-center justify-center gap-1.5 focus:outline-none"
                    >
                      <span className={`text-base sm:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-neon-cyan flex items-center gap-2 ${lang === 'KO' ? 'font-sans tracking-normal' : 'font-display tracking-wider'}`}>
                        🌌 {lang === 'KO' ? '나도 5초만에 무료 영혼 분석 시작하기' : 'Analyze My Cosmic Soul Theme too for Free'}
                      </span>
                      <span className="text-[10px] sm:text-xs text-white/50 font-sans tracking-normal font-normal">
                        {lang === 'KO' ? '이름과 태어난 일시만 입력하면 즉시 계산 완료! (100% 무료)' : 'Takes only 5 seconds to reveal your destiny!'}
                      </span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )
          ) : page === 1 && (
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
                  userInput={userInput}
                  coords={coords}
                  viewMode={resultViewMode}
                  setViewMode={setResultViewMode}
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

      {/* Side Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop Overlay - Light translucent layer allowing fully visible background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[100] pointer-events-auto"
            />
            
            {/* Drawer Body - Compact width so it leaves interpretation screen visible on both mobile & desktop */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className={`fixed inset-y-0 left-0 w-[80vw] max-w-[320px] ${
                theme === 'light' 
                  ? 'bg-slate-50 border-r border-slate-200 text-slate-800' 
                  : 'bg-[#0b0512]/95 border-r border-[#FF2A6D]/30 text-white'
              } backdrop-blur-md z-[101] shadow-2xl flex flex-col h-full overflow-hidden pointer-events-auto`}
            >
              {/* Drawer Header */}
              <div className={`flex items-center justify-between p-4 border-b ${
                theme === 'light' ? 'border-slate-250 bg-slate-100' : 'border-white/10 bg-black/40'
              }`}>
                <div className="flex items-center gap-2">
                  <Bookmark className={`w-5 h-5 ${theme === 'light' ? 'text-[#E8185A]' : 'text-[#FF2A6D]'} animate-pulse`} />
                  <span className={`font-gothic text-lg font-bold tracking-tight ${
                    theme === 'light' ? 'text-slate-800' : 'text-white'
                  } select-none`}>
                    {lang === 'KO' ? '메뉴 & 명식저장소' : 'Menu & Saju Storage'}
                  </span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    theme === 'light' 
                      ? 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-100 text-slate-700' 
                      : 'border-white/10 hover:border-white hover:bg-white/5 text-white/70 hover:text-white'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Main Scrollable Area */}
              <div className={`flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin ${
                theme === 'light' ? 'scrollbar-thumb-slate-350' : 'scrollbar-thumb-white/15'
              } scrollbar-track-transparent`}>
                
                {/* 1. Save Current Saju Area */}
                <div className={`space-y-3 p-4 rounded-2xl border relative overflow-hidden group ${
                  theme === 'light' ? 'bg-white border-slate-250 shadow-sm' : 'bg-white/5 border-white/10'
                }`}>
                  <div className={`absolute top-0 right-0 w-24 h-24 ${
                    theme === 'light' ? 'bg-[#E8185A]/5' : 'bg-[#FF2A6D]/5'
                  } rounded-bl-full blur-xl pointer-events-none`} />
                  
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xs font-bold font-mono tracking-wider uppercase ${
                      theme === 'light' ? 'text-[#E8185A]' : 'text-[#FF2A6D]'
                    }`}>
                      {lang === 'KO' ? '현재 명식 저장하기' : 'Save Current Profile'}
                    </h3>
                    <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>Local Storage</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {/* Saju Brief Information Label */}
                    <div className={`p-2.5 rounded-xl border ${
                      theme === 'light' 
                        ? 'bg-slate-50 border-slate-200 text-slate-700' 
                        : 'bg-black/30 border border-white/5 text-white/70'
                    }`}>
                      <div className={`flex justify-between font-bold mb-1 ${
                        theme === 'light' ? 'text-sky-750 font-bold' : 'text-[#05d9e8]'
                      }`}>
                        <span>{userInput.name || (lang === 'KO' ? '무명씨(미입력)' : 'Anonymous')}</span>
                        <span>{userInput.gender === 'male' ? '남성' : userInput.gender === 'female' ? '여성' : '선택무'}</span>
                      </div>
                      <div className={`text-[11px] leading-relaxed ${
                        theme === 'light' ? 'text-slate-500' : 'text-white/50'
                      }`}>
                        {userInput.birthDate} {userInput.isTimeUnknown ? '시간모름' : userInput.birthTime} ({(!userInput.calendarType || userInput.calendarType === 'solar') ? '양력' : '음력'})
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-2 mt-2">
                      <label className={`block text-[11px] font-semibold ${
                        theme === 'light' ? 'text-slate-600' : 'text-white/60'
                      }`}>{lang === 'KO' ? '저장용 별명/이름' : 'Custom Nickname'}</label>
                      <input
                        type="text"
                        placeholder={userInput.name || (lang === 'KO' ? '예: 내 사주, 친구 사주' : 'My Saju')}
                        value={newRecordCustomName}
                        onChange={(e) => setNewRecordCustomName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none transition-colors ${
                          theme === 'light' 
                            ? 'bg-slate-50 border-slate-250 text-slate-800 placeholder-slate-400 focus:border-[#E8185A]' 
                            : 'bg-black/40 border-white/10 text-white placeholder-white/30 focus:border-[#FF2A6D]'
                        }`}
                      />

                      <label className={`block text-[11px] font-semibold mt-1 ${
                        theme === 'light' ? 'text-slate-600' : 'text-white/60'
                      }`}>{lang === 'KO' ? '메모 (궁합, 직업, 메모 등)' : 'Memo Note'}</label>
                      <textarea
                        rows={2}
                        placeholder={lang === 'KO' ? '이 명식에 관한 정보나 특징을 기록해보세요.' : 'Record characteristics, notes & tags.'}
                        value={newRecordMemo}
                        onChange={(e) => setNewRecordMemo(e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-none transition-colors resize-none mb-1 ${
                          theme === 'light' 
                            ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-[#E8185A]' 
                            : 'bg-black/40 border-[#FF2A6D]/20 text-white placeholder-white/30 focus:border-[#FF2A6D]'
                        }`}
                      />

                      {/* Group selection */}
                      <label className={`block text-[11px] font-semibold mt-1 ${
                        theme === 'light' ? 'text-slate-600' : 'text-white/60'
                      }`}>{lang === 'KO' ? '📂 저장 그룹 선택' : '📂 Select Profile Group'}</label>
                      <div className="flex flex-wrap gap-1 max-h-[100px] overflow-y-auto pr-1">
                        {[
                          ...profileGroups,
                          { id: 'others', name: lang === 'KO' ? '기타/해제' : 'Other' }
                        ].map((g) => {
                          const active = selectedSaveGroup === g.id;
                          const label = g.id === 'me' ? (lang === 'KO' ? '나' : 'Me') : g.name;
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => setSelectedSaveGroup(g.id)}
                              className={`py-1 px-2.5 rounded-lg text-[9px] font-bold border transition-all text-center shrink-0 ${
                                active
                                  ? theme === 'light'
                                    ? 'bg-[#E8185A]/15 border-[#E8185A] text-[#E8185A] shadow-[0_0_6px_rgba(232,24,90,0.15)]'
                                    : 'bg-[#FF2A6D]/20 border-[#FF2A6D] text-white shadow-[0_0_6px_rgba(255,42,109,0.4)]'
                                  : theme === 'light'
                                    ? 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
                                    : 'bg-black/40 border-white/10 text-white/55 hover:border-white/20 hover:text-white'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (userInput.birthDate && userInput.birthTime) {
                          handleSaveCurrentBazi();
                        }
                      }}
                      style={{ color: '#ffffff' }}
                      className={`w-full mt-3 py-2 px-4 rounded-xl hover:brightness-110 text-xs font-bold tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md text-white keep-white ${
                        (!userInput.birthDate || !userInput.birthTime)
                          ? 'opacity-40 pointer-events-none'
                          : ''
                      } ${
                        theme === 'light'
                          ? 'bg-gradient-to-r from-[#E8185A] to-[#8024D9] shadow-inner'
                          : 'bg-gradient-to-r from-[#FF2A6D] to-[#9B30FF] shadow-[#FF2A6D]/10'
                      }`}
                    >
                      <Save className="w-3.5 h-3.5 text-white keep-white" style={{ color: '#ffffff' }} />
                      <span className="text-white keep-white" style={{ color: '#ffffff' }}>{lang === 'KO' ? '사주 저장소에 입력' : 'Save To Repository'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Saved Records List */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between px-1">
                      <h3 className={`text-xs font-bold font-mono tracking-wider uppercase ${
                        theme === 'light' ? 'text-sky-750 font-bold' : 'text-neon-cyan'
                      }`}>
                        {lang === 'KO' ? `보관 목록` : `Repository`}
                      </h3>
                      <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-slate-400' : 'text-white/40'}`}>
                        {lang === 'KO' ? `총 ${savedBaziList.length}개` : `${savedBaziList.length} total`}
                      </span>
                    </div>

                    {/* Group Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none no-scrollbar flex-nowrap">
                      {/* 'all' Tab */}
                      {(() => {
                        const active = filterGroup === 'all';
                        const count = savedBaziList.length;
                        return (
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() => setFilterGroup('all')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                active
                                  ? theme === 'light'
                                    ? 'bg-sky-50 border-sky-600 text-sky-700 shadow-sm'
                                    : 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan shadow-[0_0_6px_rgba(5,217,232,0.3)]'
                                  : theme === 'light'
                                    ? 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-850'
                                    : 'bg-white/[0.02] border-white/5 text-white/55 hover:border-white/10 hover:text-white'
                              }`}
                            >
                              {lang === 'KO' ? '전체' : 'All'} <span className="opacity-60 text-[9px] font-mono">({count})</span>
                            </button>
                          </div>
                        );
                      })()}

                      {/* Dynamic Groups (starting with 'me' and then custom ones) */}
                      {profileGroups.map((g) => {
                        const active = filterGroup === g.id;
                        const label = g.id === 'me' ? (lang === 'KO' ? '나' : 'Me') : g.name;
                        const count = savedBaziList.filter(item => item.group === g.id).length;
                        
                        return (
                          <div key={g.id} className="relative shrink-0 flex items-center">
                            <button
                              type="button"
                              onClick={() => setFilterGroup(g.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                g.id !== 'me' ? 'pr-5.5' : ''
                              } ${
                                active
                                  ? theme === 'light'
                                    ? 'bg-sky-50 border-sky-600 text-sky-700 shadow-sm'
                                    : 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan shadow-[0_0_6px_rgba(5,217,232,0.3)]'
                                  : theme === 'light'
                                    ? 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-850'
                                    : 'bg-white/[0.02] border-white/5 text-white/55 hover:border-white/10 hover:text-white'
                              }`}
                            >
                              {label} <span className="opacity-60 text-[9px] font-mono">({count})</span>
                            </button>
                            
                            {g.id !== 'me' && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteGroup(g.id, e)}
                                className={`absolute right-1.5 font-bold text-[10px] w-3 h-3 flex items-center justify-center transition-all cursor-pointer ${
                                  theme === 'light' ? 'text-slate-400 hover:text-red-650' : 'text-white/40 hover:text-red-500'
                                }`}
                                title={lang === 'KO' ? '그룹 삭제' : 'Delete Group'}
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* 'others' Tab for ungrouped items */}
                      {(() => {
                        const active = filterGroup === 'others';
                        const count = savedBaziList.filter(item => !item.group || item.group === 'others' || !profileGroups.some(g => g.id === item.group)).length;
                        return (
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() => setFilterGroup('others')}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                                active
                                  ? theme === 'light'
                                    ? 'bg-sky-50 border-sky-600 text-sky-700 shadow-sm'
                                    : 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan shadow-[0_0_6px_rgba(5,217,232,0.3)]'
                                  : theme === 'light'
                                    ? 'bg-slate-100 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-850'
                                    : 'bg-white/[0.02] border-white/5 text-white/55 hover:border-white/10 hover:text-white'
                              }`}
                            >
                              {lang === 'KO' ? '기타/해제' : 'Others'} <span className="opacity-60 text-[9px] font-mono">({count})</span>
                            </button>
                          </div>
                        );
                      })()}
                      
                      {/* "+ 그룹" ('+ Add Group') Tab button */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingGroup(true);
                          setNewGroupName('');
                          setSelectedProfileIdsForNewGroup([]);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-extrabold border border-dashed transition-all shrink-0 flex items-center gap-0.5 cursor-pointer ${
                          theme === 'light'
                            ? 'bg-[#E8185A]/10 border-[#E8185A]/30 text-[#E8185A] hover:bg-[#E8185A]/15'
                            : 'bg-[#FF2A6D]/15 border-[#FF2A6D]/40 text-[#FF2A6D] hover:bg-[#FF2A6D]/25'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        <span>{lang === 'KO' ? '그룹 추가' : 'Add Group'}</span>
                      </button>
                    </div>
                  </div>

                  <div className={`space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin ${
                    theme === 'light' ? 'scrollbar-thumb-slate-300' : 'scrollbar-thumb-white/10'
                  } scrollbar-track-transparent`}>
                    {(() => {
                      const filteredList = savedBaziList.filter(item => {
                        if (filterGroup === 'all') return true;
                        if (filterGroup === 'others') {
                          return !item.group || item.group === 'others' || !profileGroups.some(g => g.id === item.group);
                        }
                        return item.group === filterGroup;
                      });

                      const displayedList = filteredList.slice(0, visibleCount);

                      if (filteredList.length === 0) {
                        return (
                          <div className={`text-center p-6 rounded-2xl border border-dashed mt-1 ${
                            theme === 'light' ? 'border-slate-350 text-slate-400' : 'border-white/10 text-white/40'
                          }`}>
                            <Bookmark className="w-8 h-8 mx-auto opacity-25 mb-2" />
                            <p className="text-xs font-medium font-gothic">
                              {lang === 'KO' ? '저장된 사주가 없습니다.' : 'No saved records.'}
                            </p>
                            <p className="text-[10px] opacity-65 mt-1 leading-relaxed">
                              {lang === 'KO' ? '현재 카테고리에 조건이 맞는 사주 기록이 비어있습니다.' : 'No profiles match the active filter.'}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-2">
                          {displayedList.map((item) => {
                            // Find creation date timestamp
                            const rawTs = item.createdAt || (isNaN(Number(item.id)) ? null : Number(item.id));
                            const dateStr = rawTs 
                              ? new Date(rawTs).toLocaleDateString(lang === 'KO' ? 'ko' : 'en-US', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit'
                                }).replace(/\.$/, '')
                              : '';

                            if (editingRecordId === item.id && editForm) {
                              return (
                                <div
                                  key={item.id}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`p-3 rounded-xl border-2 flex flex-col gap-2 mb-2 transition-all cursor-default ${
                                    theme === 'light' 
                                      ? 'bg-white border-sky-400 shadow-md text-slate-800' 
                                      : 'bg-black/50 border-2 border-[#05d9e8]/40 shadow-[0_0_12px_rgba(5,217,232,0.1)]'
                                  }`}
                                >
                                  <div className={`flex items-center justify-between border-b pb-1.5 mb-1 ${
                                    theme === 'light' ? 'border-slate-200' : 'border-white/10'
                                  }`}>
                                    <span className={`text-[11px] font-bold ${
                                      theme === 'light' ? 'text-sky-750 font-bold' : 'text-neon-cyan'
                                    }`}>{lang === 'KO' ? '📝 명식 수정' : '📝 Edit Profile'}</span>
                                    <button
                                      onClick={() => { setEditingRecordId(null); setEditForm(null); }}
                                      className={`transition-colors text-[10px] ${
                                        theme === 'light' ? 'text-slate-400 hover:text-slate-800' : 'text-white/40 hover:text-white'
                                      }`}
                                    >
                                      {lang === 'KO' ? '취소' : 'Cancel'}
                                    </button>
                                  </div>

                                  <div>
                                    <label className={`block text-[9px] mb-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-white/55'}`}>{lang === 'KO' ? '이름' : 'Name'}</label>
                                    <input
                                      type="text"
                                      value={editForm.name}
                                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                      className={`w-full px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 ${
                                        theme === 'light' 
                                          ? 'bg-slate-50 border border-slate-250 text-slate-800 focus:border-sky-400 focus:ring-sky-455' 
                                          : 'bg-black/60 border border-white/15 text-white focus:border-neon-cyan'
                                      }`}
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className={`block text-[9px] mb-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-white/55'}`}>{lang === 'KO' ? '생년월일' : 'Birth Date'}</label>
                                      <input
                                        type="date"
                                        value={editForm.birthDate}
                                        onChange={(e) => setEditForm({...editForm, birthDate: e.target.value})}
                                        className={`w-full px-1.5 py-1 rounded text-[10px] focus:outline-none ${
                                          theme === 'light' 
                                            ? 'bg-slate-50 border border-slate-250 text-slate-800 focus:border-sky-400' 
                                            : 'bg-black/60 border border-white/15 text-white focus:border-neon-cyan'
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <label className={`block text-[9px] mb-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-white/55'}`}>{lang === 'KO' ? '달력 구분' : 'Calendar'}</label>
                                      <select
                                        value={editForm.calendarType}
                                        onChange={(e) => setEditForm({...editForm, calendarType: e.target.value as 'solar' | 'lunar'})}
                                        className={`w-full px-1.5 py-1 rounded text-[10px] focus:outline-none ${
                                          theme === 'light' 
                                            ? 'bg-slate-50 border border-slate-250 text-slate-800 focus:border-sky-400' 
                                            : 'bg-black/60 border border-white/15 text-white focus:border-neon-cyan'
                                        }`}
                                      >
                                        <option value="solar">{lang === 'KO' ? '양력' : 'Solar'}</option>
                                        <option value="lunar">{lang === 'KO' ? '음력' : 'Lunar'}</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 items-end">
                                    <div>
                                      <label className={`block text-[9px] mb-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-white/55'}`}>{lang === 'KO' ? '태어난 시간' : 'Birth Time'}</label>
                                      <input
                                        type="time"
                                        disabled={editForm.isTimeUnknown}
                                        value={editForm.isTimeUnknown ? "12:00" : editForm.birthTime}
                                        onChange={(e) => setEditForm({...editForm, birthTime: e.target.value})}
                                        className={`w-full px-1.5 py-1 rounded text-[10px] focus:outline-none disabled:opacity-30 ${
                                          theme === 'light' 
                                            ? 'bg-slate-50 border border-slate-250 text-slate-800 focus:border-sky-400' 
                                            : 'bg-black/60 border border-white/15 text-white focus:border-neon-cyan'
                                        }`}
                                      />
                                    </div>
                                    <div className={`flex items-center gap-1.5 mb-1 px-2 py-1 rounded border h-7 ${
                                      theme === 'light' 
                                        ? 'bg-slate-100 border-slate-200' 
                                        : 'bg-black/35 border-white/5'
                                    }`}>
                                      <input
                                        type="checkbox"
                                        id={`edit-time-unknown-${item.id}`}
                                        checked={editForm.isTimeUnknown}
                                        onChange={(e) => setEditForm({...editForm, isTimeUnknown: e.target.checked})}
                                        className="rounded border-white/20 text-[#05d9e8] focus:ring-0 cursor-pointer w-3.5 h-3.5"
                                      />
                                      <label htmlFor={`edit-time-unknown-${item.id}`} className={`text-[9px] cursor-pointer select-none ${
                                        theme === 'light' ? 'text-slate-650' : 'text-white/60'
                                      }`}>
                                        {lang === 'KO' ? '시간모름' : 'Unknown'}
                                      </label>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className={`block text-[9px] mb-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-white/55'}`}>{lang === 'KO' ? '성별' : 'Gender'}</label>
                                      <select
                                        value={editForm.gender}
                                        onChange={(e) => setEditForm({...editForm, gender: e.target.value as any})}
                                        className={`w-full px-1.5 py-1 rounded text-[10px] focus:outline-none ${
                                          theme === 'light' 
                                            ? 'bg-slate-50 border border-slate-250 text-slate-800 focus:border-sky-400' 
                                            : 'bg-black/60 border border-white/15 text-white text-[10px] focus:outline-none focus:border-neon-cyan'
                                        }`}
                                      >
                                        <option value="male">{lang === 'KO' ? '남성' : 'Male'}</option>
                                        <option value="female">{lang === 'KO' ? '여성' : 'Female'}</option>
                                        <option value="non-binary">{lang === 'KO' ? '비바이너리' : 'Non-binary'}</option>
                                        <option value="prefer-not-to-tell">{lang === 'KO' ? '비공개' : 'Secret'}</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className={`block text-[9px] mb-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-white/55'}`}>{lang === 'KO' ? '메모' : 'Memo'}</label>
                                      <input
                                        type="text"
                                        value={editForm.memo}
                                        onChange={(e) => setEditForm({...editForm, memo: e.target.value})}
                                        className={`w-full px-1.5 py-1 rounded text-[10px] focus:outline-none ${
                                          theme === 'light' 
                                            ? 'bg-slate-50 border border-slate-250 text-slate-800 focus:border-sky-400' 
                                            : 'bg-black/60 border border-white/15 text-white text-[10px] focus:outline-none focus:border-neon-cyan'
                                        }`}
                                        placeholder={lang === 'KO' ? '메모' : 'Memo'}
                                      />
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleUpdateBazi(item.id, editForm)}
                                    className={`w-full mt-1 py-1.5 rounded-lg font-black text-[10px] tracking-widest transition-all flex items-center justify-center gap-1 ${
                                      theme === 'light' 
                                        ? 'bg-sky-650 hover:brightness-110 text-white shadow-sm' 
                                        : 'bg-neon-cyan hover:brightness-110 text-black shadow-[0_0_8px_rgba(5,217,232,0.25)]'
                                    }`}
                                  >
                                    <Save className="w-3 h-3" />
                                    <span>{lang === 'KO' ? '수정 완료' : 'Save Changes'}</span>
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={item.id}
                                onClick={() => handleLoadBazi(item)}
                                className={`group relative flex flex-col p-3 rounded-xl border cursor-pointer transition-all duration-300 mb-2 ${
                                  theme === 'light' 
                                    ? 'bg-white border-slate-200 hover:border-[#E8185A] hover:bg-slate-50 text-slate-850 shadow-sm' 
                                    : 'bg-white/[0.02] border border-white/10 hover:border-[#FF2A6D] hover:bg-[#FF2A6D]/5 text-white'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    {/* ILJU IMAGE BADGE */}
                                    <IljuStampImage stem={item.stem} branch={item.branch} lang={lang} />
                                    
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`font-bold text-xs truncate max-w-[110px] transition-colors ${
                                          theme === 'light' ? 'text-slate-800 group-hover:text-[#E8185A]' : 'text-white group-hover:text-[#FF2A6D]'
                                        }`}>
                                          {item.name}
                                        </span>
                                        <span className={`text-[9px] px-1 py-[1.5px] rounded border leading-none shrink-0 ${
                                          theme === 'light' 
                                            ? 'text-sky-700 bg-sky-50 border-sky-200' 
                                            : 'text-[#05d9e8] bg-[#05d9e8]/10 border-[#05d9e8]/20'
                                        }`}>
                                          {item.gender === 'male' ? (lang === 'KO' ? '남' : 'M') : item.gender === 'female' ? (lang === 'KO' ? '여' : 'F') : 'N/A'}
                                        </span>
                                      </div>
                                      <p className={`text-[10px] mt-1 font-mono whitespace-nowrap ${
                                        theme === 'light' ? 'text-slate-500' : 'text-white/50'
                                      }`}>
                                        {item.birthDate} &bull; {item.isTimeUnknown ? (lang === 'KO' ? '시간모름' : 'Unknown') : item.birthTime}
                                      </p>
                                    </div>
                                  </div>

                                  {pendingDeleteId === item.id ? (
                                    <div 
                                      className={`flex items-center gap-1.5 border px-2 py-1 rounded-lg shrink-0 ${
                                        theme === 'light' ? 'bg-red-50 border-red-200 text-slate-800' : 'bg-red-950/40 border-red-500/35 text-white'
                                      }`} 
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <span className={`text-[10px] font-black ${theme === 'light' ? 'text-red-700' : 'text-red-400'}`}>
                                        {lang === 'KO' ? '삭제할까요?' : 'Delete?'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          executeDeleteBazi(item.id);
                                        }}
                                        className="px-1.5 py-0.5 rounded bg-red-600 hover:bg-red-750 text-white text-[9px] font-bold transition-all"
                                      >
                                        {lang === 'KO' ? '삭제' : 'Yes'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPendingDeleteId(null);
                                        }}
                                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                                          theme === 'light' ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-white/10 hover:bg-white/20 text-white'
                                        }`}
                                      >
                                        {lang === 'KO' ? '취소' : 'No'}
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingRecordId(item.id);
                                          setEditForm({
                                            name: item.name,
                                            birthDate: item.birthDate,
                                            birthTime: item.birthTime,
                                            isTimeUnknown: !!item.isTimeUnknown,
                                            gender: item.gender,
                                            calendarType: item.calendarType || 'solar',
                                            memo: item.memo || ''
                                          });
                                        }}
                                        className={`p-1 rounded-lg transition-colors ${
                                          theme === 'light' ? 'text-slate-450 hover:text-sky-650 hover:bg-slate-100' : 'text-white/30 hover:text-neon-cyan hover:bg-white/5'
                                        }`}
                                        title={lang === 'KO' ? '수정' : 'Edit'}
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => handleDeleteBazi(item.id, e)}
                                        className={`p-1 rounded-lg transition-colors ${
                                          theme === 'light' ? 'text-slate-450 hover:text-[#E8185A] hover:bg-slate-100' : 'text-white/30 hover:text-[#FF2A6D] hover:bg-white/5'
                                        }`}
                                        title={lang === 'KO' ? '삭제' : 'Delete'}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                      {dateStr && (
                                        <span className={`text-[8px] font-mono leading-none ml-1 shrink-0 ${
                                          theme === 'light' ? 'text-slate-400' : 'text-white/30'
                                        }`}>
                                          {dateStr}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {item.memo && (
                                  <p className={`text-[10px] mt-2 truncate pl-1.5 leading-tight italic border-l ${
                                    theme === 'light' ? 'text-sky-750 font-bold border-sky-300' : 'text-[#05d9e8] border-[#05d9e8]/30'
                                  }`}>
                                    {item.memo}
                                  </p>
                                )}

                                {/* Group assignment & cancel toggles */}
                                <div className={`flex items-center gap-1 mt-2.5 pt-2 border-t flex-wrap ${
                                  theme === 'light' ? 'border-slate-150' : 'border-white/5'
                                }`}>
                                  <span className={`text-[8px] mr-1 font-semibold ${
                                    theme === 'light' ? 'text-slate-400' : 'text-white/35'
                                  }`}>{lang === 'KO' ? '그룹 지정:' : 'Set group:'}</span>
                                  {(() => {
                                    const assignableGroups = [
                                      { id: 'me', name: lang === 'KO' ? '나' : 'Me' },
                                      ...profileGroups.filter(g => g.id !== 'me'),
                                      { id: 'others', name: lang === 'KO' ? '해제' : 'Clear' }
                                    ];

                                    return assignableGroups.map((grp) => {
                                      const isTargetActive = item.group === grp.id || (grp.id === 'others' && (!item.group || item.group === 'others' || !profileGroups.some(pg => pg.id === item.group)));
                                      return (
                                        <button
                                          key={grp.id}
                                          type="button"
                                          onClick={(e) => handleToggleRecordGroup(item.id, grp.id, e)}
                                          className={`text-[8.5px] px-1.5 py-0.5 rounded transition-all font-bold ${
                                            isTargetActive 
                                              ? theme === 'light'
                                                ? 'bg-[#E8185A]/10 text-[#E8185A] border border-[#E8185A]/20 shadow-sm'
                                                : 'bg-[#FF2A6D]/20 text-[#FF2A6D] border border-[#FF2A6D]/40 shadow-[0_0_4px_rgba(255,42,109,0.2)]' 
                                              : theme === 'light'
                                                ? 'bg-slate-100 text-slate-455 hover:bg-slate-200 hover:text-slate-700 border border-transparent'
                                                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-transparent'
                                          }`}
                                        >
                                          {grp.name}
                                        </button>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>
                            );
                          })}

                          {/* Paging / Load More View Controls */}
                          <div className="flex items-center justify-between gap-2 pt-2 mt-1">
                            {filteredList.length > visibleCount && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVisibleCount(prev => prev + 4);
                                }}
                                className={`flex-1 py-2 px-3 rounded-xl border border-dashed text-[11px] font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-1 ${
                                  theme === 'light'
                                    ? 'border-slate-300 hover:border-sky-600 text-slate-500 hover:text-sky-750 hover:bg-sky-50/50'
                                    : 'border-white/10 hover:border-[#05d9e8] text-white/50 hover:text-[#05d9e8] hover:bg-[#05d9e8]/5'
                                }`}
                              >
                                <span>{lang === 'KO' ? `더보기 (${visibleCount}/${filteredList.length})` : `Load More (${visibleCount}/${filteredList.length})`}</span>
                              </button>
                            )}

                            {visibleCount > 4 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVisibleCount(4);
                                }}
                                className={`py-2 px-3 rounded-xl text-[10px] font-semibold border border-transparent transition-all ${
                                  theme === 'light'
                                    ? 'hover:bg-slate-100 text-slate-450 hover:text-slate-750 hover:border-slate-200'
                                    : 'hover:bg-white/5 text-white/40 hover:text-white hover:border-white/10'
                                }`}
                              >
                                {lang === 'KO' ? '목록 접기' : 'Collapse'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* 3. Extra Services (회원가입, 커뮤니티, 유튜브 바로가기 등) */}
                <div className={`space-y-2 border-t pt-4 ${theme === 'light' ? 'border-slate-150' : 'border-white/5'}`}>
                  <h3 className={`text-xs font-bold font-mono tracking-wider px-1 mb-2 uppercase ${
                    theme === 'light' ? 'text-slate-500' : 'text-white/60'
                  }`}>
                    {lang === 'KO' ? '계정 및 즐겨찾기' : 'Global Portals'}
                  </h3>

                  {/* 회원가입 (Sign Up) 개발준비중 */}
                  <button
                    onClick={() => setShowPendingModal('signup')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-xs font-medium group text-left ${
                      theme === 'light'
                        ? 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-800'
                        : 'bg-white/[0.02] border border-white/5 hover:border-white/20 text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LogIn className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                        theme === 'light' ? 'text-[#E8185A]' : 'text-[#FF2A6D]'
                      }`} />
                      <span>{lang === 'KO' ? '회원가입' : 'Sign Up'}</span>
                    </div>
                    <span className={`text-[9px] font-mono tracking-tighter border px-1.5 py-0.5 rounded uppercase ${
                      theme === 'light'
                        ? 'bg-[#E8185A]/10 border-[#E8185A]/20 text-[#E8185A]'
                        : 'bg-neon-pink/10 border border-neon-pink/30 text-[#FF2A6D]'
                    }`}>
                      {lang === 'KO' ? '개발 준비 중' : 'Coming Soon'}
                    </span>
                  </button>

                  {/* 커뮤니티 바로가기 */}
                  <a
                    href="https://cafe.naver.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-xs font-medium group ${
                      theme === 'light'
                        ? 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-800'
                        : 'bg-white/[0.02] border border-white/5 hover:border-white/20 text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Compass className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                        theme === 'light' ? 'text-sky-650' : 'text-neon-cyan'
                      }`} />
                      <span>{lang === 'KO' ? '커뮤니티 바로가기' : 'Go to Community Cafe'}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${
                      theme === 'light' ? 'text-slate-400' : 'text-white/30'
                    }`} />
                  </a>

                  {/* 유튜브 바로가기 */}
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-xs font-medium group ${
                      theme === 'light'
                        ? 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-800'
                        : 'bg-white/[0.02] border border-white/5 hover:border-white/20 text-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Youtube className="w-4 h-4 text-[#FF0000] rotate-0 group-hover:scale-110 transition-transform" />
                      <span>{lang === 'KO' ? '유튜브 비법 바로가기' : 'Secrets on YouTube Channels'}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${
                      theme === 'light' ? 'text-slate-400' : 'text-white/30'
                    }`} />
                  </a>
                </div>

              </div>
              
              {/* Footer and credit info */}
              <div className={`p-4 border-t text-center font-mono text-[9px] ${
                theme === 'light'
                  ? 'border-slate-200 bg-slate-100 text-slate-500'
                  : 'border-white/5 bg-black/60 text-white/40'
              }`}>
                VOID Saju Engine v1.1.2 &bull; Cloud Storage Offline
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Under Development Modal */}
      <AnimatePresence>
        {showPendingModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPendingModal(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-[#130b1e] border-2 border-[#FF2A6D] p-6 rounded-3xl shadow-2xl z-10 text-center"
            >
              <div className="w-14 h-14 bg-[#FF2A6D]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF2A6D]/30">
                <LogIn className="w-6 h-6 text-[#FF2A6D] animate-bounce" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2 font-gothic tracking-tight">
                {lang === 'KO' ? '🔒 회원가입 기능 개발 안내' : '🔒 Sign Up Feature Info'}
              </h3>
              
              <div className="text-white/70 text-xs leading-relaxed mb-6 whitespace-pre-line text-left bg-black/40 p-4 rounded-2xl border border-white/10">
                {lang === 'KO' 
                  ? '회선 및 동기화 보안을 적용한 프리미엄 회원가입/로그인 기능이 현재 개발 준비 중입니다!\n\n현재 고객님의 명식 및 메모 데이터는 이용 중이신 기기의 웹 브라우저 로컬 저장소(LocalStorage) 내에 128비트 독립 규격으로 안전하게 격리되어 보관됩니다.\n\n앱을 다시 방문하시거나 껐다 켜보셔도 절대 초기화되지 않으니 회원가입 없이도 안심하고 소중하게 데이터를 보관하고 이용하세요!'
                  : 'Premium database sign up & cloud synchronization features are currently under busy development!\n\nAll of your private Saju profiles and custom memo lists remain 100% safely protected inside your browser\'s local sandboxed secure storage.\n\nYour saved records will stay completely intact even if you restart or return to the website later!'
                }
              </div>

              <button
                onClick={() => setShowPendingModal(null)}
                className="w-full py-3 bg-gradient-to-r from-[#FF2A6D] to-[#9B30FF] text-white font-bold rounded-2xl text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-lg"
              >
                {lang === 'KO' ? '안심하고 이용하기' : 'Continue Safe'}
              </button>
            </motion.div>
          </div>
        )}

        {isAddingGroup && (
          <div className="fixed inset-0 flex items-center justify-center z-[200] p-4">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingGroup(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-[#0b0512] border-2 border-neon-cyan/50 p-6 rounded-3xl shadow-2xl z-20 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-sm font-bold text-neon-cyan flex items-center gap-1.5 font-gothic">
                  <Bookmark className="w-4 h-4 text-[#FF2A6D]" />
                  {lang === 'KO' ? '📂 새 저장 그룹 추가' : '📂 Add New Group'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingGroup(false)}
                  className="text-white/45 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Group Name input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] text-white/60 font-semibold">
                  {lang === 'KO' ? '그룹 이름' : 'Group Name'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'KO' ? '예: 대학 동창, 직장 동료' : 'e.g. Work Colleagues'}
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/20 text-xs focus:outline-none focus:border-neon-cyan transition-colors"
                />
              </div>

              {/* Saved profiles checklist selection */}
              <div className="space-y-1.5">
                <label className="block text-[11px] text-white/60 font-semibold flex justify-between">
                  <span>{lang === 'KO' ? '해당 그룹에 넣을 명식 지정' : 'Add Saju Profiles'}</span>
                  <span className="text-[10px] text-white/35">({selectedProfileIdsForNewGroup.length} {lang === 'KO' ? '개 선택됨' : 'selected'})</span>
                </label>
                
                {savedBaziList.length === 0 ? (
                  <div className="p-4 text-center rounded-xl bg-black/40 border border-white/5 text-[10px] text-white/40">
                    {lang === 'KO' ? '저장된 사주 명식이 존재하지 않습니다.' : 'No saved saju profiles found.'}
                  </div>
                ) : (
                  <div className="max-h-[160px] overflow-y-auto border border-white/10 rounded-xl p-2 space-y-1.5 bg-black/45 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {savedBaziList.map((bz) => {
                      const isSelected = selectedProfileIdsForNewGroup.includes(bz.id);
                      return (
                        <div
                          key={bz.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedProfileIdsForNewGroup(prev => prev.filter(id => id !== bz.id));
                            } else {
                              setSelectedProfileIdsForNewGroup(prev => [...prev, bz.id]);
                            }
                          }}
                          className={`flex items-center gap-2 p-1.5 rounded-lg border cursor-pointer select-none transition-all ${
                            isSelected 
                              ? 'bg-neon-cyan/10 border-neon-cyan/40 text-white shadow-[0_0_8px_rgba(5,217,232,0.1)]' 
                              : 'bg-white/[0.01] border-transparent text-white/60 hover:bg-white/5'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="rounded border-white/20 text-neon-cyan focus:ring-0 cursor-pointer w-3.5 h-3.5"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold truncate">{bz.name}</p>
                            <p className="text-[8px] text-white/30 truncate font-mono">
                              {bz.birthDate} &bull; {bz.isTimeUnknown ? '시간모름' : bz.birthTime}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingGroup(false)}
                  className="flex-1 py-1.5 text-xs text-white/60 hover:text-white bg-white/10 hover:bg-white/15 rounded-xl font-bold transition-all cursor-pointer"
                >
                  {lang === 'KO' ? '취소' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleCreateGroup}
                  className="flex-1 py-1.5 text-xs text-black bg-neon-cyan hover:brightness-110 rounded-xl font-black transition-all shadow-[0_0_12px_rgba(5,217,232,0.3)] cursor-pointer"
                >
                  {lang === 'KO' ? '그룹 추가 완료' : 'Create Group'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
