import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';
import { ZODIAC_ANIMALS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface CosmicWheelProps {
  birthDate: string;
}

const lightModeZodiacImages: Record<string, string> = {
  'za': 'https://i.imgur.com/fewPGoU.png',
  'chuck': 'https://i.imgur.com/WkHjxWz.png',
  'in': 'https://i.imgur.com/J338Daq.png',
  'myo': 'https://i.imgur.com/JQlp1wo.png',
  'zin': 'https://i.imgur.com/3A3pE9f.png',
  'sa': 'https://i.imgur.com/kL0dmGI.png',
  'oh': 'https://i.imgur.com/SMNqqrj.png',
  'me': 'https://i.imgur.com/lEa2Dvw.png',
  'sin': 'https://i.imgur.com/5mjY91o.png',
  'yu': 'https://i.imgur.com/Ek7aKRg.png',
  'sul': 'https://i.imgur.com/GsEA6cP.png',
  'hae': 'https://i.imgur.com/bhhCUj0.png'
};

const ASTRO_SYMBOLS = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎'];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const HorizontalDial = ({ 
  items, 
  targetValue, 
  radius, 
  anglePerItem = 15,
  isImage = false,
  isSymbol = false,
  visibleCount = 9
}: { 
  items: any[], 
  targetValue: number, 
  radius: number, 
  anglePerItem?: number,
  isImage?: boolean,
  isSymbol?: boolean,
  visibleCount?: number
}) => {
  const { theme } = useTheme();
  // We track the continuous value to allow "spinning through" items
  const animatedValue = useMotionValue(targetValue);
  
  // Create a spring-animated value for smooth movement
  // Stiffness and mass adjusted for a "heavy" physical feel
  const smoothValue = useSpring(animatedValue, {
    stiffness: 25, 
    damping: 14,
    mass: 2.5
  });

  const [currentValue, setCurrentValue] = useState(targetValue);

  useEffect(() => {
    animatedValue.set(targetValue);
    const unsubscribe = smoothValue.on('change', (v) => {
      setCurrentValue(v);
    });
    return () => unsubscribe();
  }, [targetValue, animatedValue, smoothValue]);

  const getImagePath = (item: any) => {
    if (theme === 'light' && item.slug && lightModeZodiacImages[item.slug]) {
      return lightModeZodiacImages[item.slug];
    }
    return item.imgUrl;
  };

  const normalizedValue = ((currentValue % items.length) + items.length) % items.length;

  return (
    <div className="absolute bottom-[-60px] sm:bottom-[-40px] left-1/2 w-0 h-0 flex items-center justify-center z-30">
      {items.map((item, index) => {
        // Calculate shortest distance in circular list
        let diff = index - normalizedValue;
        if (diff > items.length / 2) diff -= items.length;
        if (diff < -items.length / 2) diff += items.length;

        // Skip if far outside visible area for performance
        const threshold = visibleCount / 2 + 1;
        if (Math.abs(diff) > threshold) return null;

        const rotateZ = diff * anglePerItem;
        const distFromCenter = Math.abs(diff);
        const opacity = Math.max(0, 1 - distFromCenter / threshold);
        const scale = 1.2 * Math.max(0.4, 1 - distFromCenter * 0.12);
        const blurAmount = distFromCenter * 2;
        const isCenter = distFromCenter < 0.5;

        return (
          <div
            key={index}
            className="absolute flex flex-col items-center justify-start"
            style={{
              height: `${radius * 2}px`,
              bottom: `-${radius}px`,
              transformOrigin: 'center center',
              transform: `rotate(${rotateZ}deg)`
            }}
          >
            <div 
              className="absolute top-0 flex items-center justify-center origin-center -translate-y-1/2"
              style={{
                opacity,
                filter: `blur(${blurAmount}px)`,
                transform: `scale(${scale}) rotate(${-rotateZ}deg)`
              }}
            >
              {isImage ? (
                <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-500 ${isCenter ? 'scale-110' : 'scale-100'}`}>
                  <img 
                    src={getImagePath(item)} 
                    alt={item.name} 
                    className="w-full h-full object-contain" 
                    loading="lazy"
                    style={{ 
                      mixBlendMode: theme === 'light' ? 'normal' : 'screen',
                      filter: theme === 'light' 
                        ? `brightness(0) drop-shadow(0 2px 4px rgba(0,0,0,0.1))`
                        : isCenter 
                          ? 'sepia(1) saturate(3) hue-rotate(-10deg) brightness(1.2) contrast(1.2) drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 2px rgba(255, 215, 0, 1))' 
                          : 'sepia(1) saturate(2) hue-rotate(-10deg) brightness(0.8) contrast(1.1) drop-shadow(0 0 4px rgba(255, 215, 0, 0.2))',
                      opacity: isCenter ? 1 : 0.8
                    }}
                    referrerPolicy="no-referrer" 
                  />
                </div>
              ) : isSymbol ? (
                <span className={`font-bold transition-all duration-500 ${theme === 'light' ? 'text-[#222222]' : 'text-[#FFD700]'} ${isCenter ? (theme === 'light' ? 'text-4xl sm:text-5xl' : 'text-4xl sm:text-5xl [text-shadow:0_0_25px_rgba(255,215,0,1),0_0_10px_rgba(255,215,0,0.8)]') : (theme === 'light' ? 'text-3xl sm:text-4xl opacity-30' : 'text-3xl sm:text-4xl opacity-30 [text-shadow:0_0_10px_rgba(255,215,0,0.4)]')}`} style={{ fontFamily: 'sans-serif' }}>
                  {item}
                </span>
              ) : (
                <span className={`font-bold transition-all duration-500 ${theme === 'light' ? 'text-[#222222]' : 'text-[#FFD700]'} ${isCenter ? (theme === 'light' ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl [text-shadow:0_0_15px_rgba(255,215,0,1)]') : (theme === 'light' ? 'text-sm sm:text-base opacity-30' : 'text-sm sm:text-base opacity-30 [text-shadow:0_0_8px_rgba(255,215,0,0.4)]')}`} style={{ fontFamily: 'sans-serif' }}>
                  {item}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function CosmicWheel({ birthDate }: CosmicWheelProps) {
  const { theme } = useTheme();
  
  // Track "stable" states that only update after input is confirmed complete
  const [stableTarget, setStableTarget] = useState(() => {
    const d = birthDate ? new Date(birthDate) : new Date();
    const date = isNaN(d.getTime()) ? new Date() : d;
    return {
      yearVal: date.getFullYear() - 4,
      monthVal: date.getMonth(),
      dayVal: date.getDate() - 1
    };
  });

  const lastProcessedDate = useRef(birthDate);

  useEffect(() => {
    // Check if birthDate is a full YYYY-MM-DD string
    // This prevents premature updates when only part of the date is typed
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    
    if (birthDate && datePattern.test(birthDate) && birthDate !== lastProcessedDate.current) {
      const timer = setTimeout(() => {
        const d = new Date(birthDate);
        if (!isNaN(d.getTime())) {
          setStableTarget({
            yearVal: d.getFullYear() - 4,
            monthVal: d.getMonth(),
            dayVal: d.getDate() - 1
          });
          lastProcessedDate.current = birthDate;
        }
      }, 700); // 0.7 second delay as requested
      
      return () => clearTimeout(timer);
    }
  }, [birthDate]);

  return (
    <div className={`relative w-full max-w-3xl h-[130px] sm:h-[240px] mx-auto flex items-center justify-center rounded-2xl border transition-all duration-500 overflow-hidden ${
      theme === 'light' 
        ? 'bg-[#FCFDFF] border-sky-100 shadow-[0_8px_30px_rgba(56,189,248,0.12)]' 
        : 'bg-[#050505] border-purple-900/40 shadow-[0_0_50px_rgba(168,85,247,0.15)]'
    }`}>
      
      {/* Background Gradient */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        theme === 'light' 
          ? 'bg-gradient-to-b from-sky-50/40 via-white/80 to-rose-50/30' 
          : 'bg-gradient-to-b from-purple-950/30 via-black to-pink-950/20'
      }`} />

      {/* CSS Mask for fading out left and right edges */}
      <div 
        className="relative w-full h-full flex items-center justify-center z-10"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[320px] scale-[0.6] sm:scale-100 origin-bottom">
          {/* Base Pivot Container for Rings (The Misty Energy Field) */}
          <div className="absolute bottom-[-60px] sm:bottom-[-40px] left-1/2 -translate-x-1/2 flex items-center justify-center z-0 pointer-events-none">
            {/* Line 4 (Outer boundary of Zodiac) - Strongest */}
            <div className={`absolute w-[520px] h-[520px] rounded-full border-[3px] transition-all duration-500 ${
              theme === 'light' 
                ? 'border-sky-300/90 shadow-[0_0_12px_rgba(244,63,94,0.35),inset_0_0_8px_rgba(244,63,94,0.15)]' 
                : 'border-[#FF1493]/90 shadow-[0_0_20px_rgba(255,20,147,0.8),inset_0_0_10px_rgba(255,20,147,0.4)]'
            }`} />
            
            {/* Line 3 (Between Zodiac and Symbols) */}
            <div className={`absolute w-[370px] h-[370px] rounded-full border-[2px] transition-all duration-500 ${
              theme === 'light' 
                ? 'border-sky-300/80 shadow-[0_0_10px_rgba(244,63,94,0.32),inset_0_0_6px_rgba(244,63,94,0.12)]' 
                : 'border-[#FF1493]/70 shadow-[0_0_15px_rgba(255,20,147,0.6)]'
            }`} />
            
            {/* Line 2 (Between Symbols and Numbers) */}
            <div className={`absolute w-[230px] h-[230px] rounded-full border-[2px] transition-all duration-500 ${
              theme === 'light' 
                ? 'border-sky-300/70 shadow-[0_0_8px_rgba(244,63,94,0.28),inset_0_0_5px_rgba(244,63,94,0.1)]' 
                : 'border-[#FF1493]/50 shadow-[0_0_10px_rgba(255,20,147,0.4)]'
            }`} />
            
            {/* Line 1 (Inner boundary of Numbers) - Weakest */}
            <div className={`absolute w-[90px] h-[90px] rounded-full border-[1px] transition-all duration-500 ${
              theme === 'light' 
                ? 'border-sky-300/60 bg-[radial-gradient(circle_at_center,transparent_70%,rgba(244,63,94,0.02)_100%)] backdrop-blur-[1px] shadow-[0_0_6px_rgba(244,63,94,0.22)]' 
                : 'border-[#FF1493]/30 bg-[radial-gradient(circle_at_center,transparent_70%,rgba(255,20,147,0.05)_100%)] backdrop-blur-[1px] shadow-[0_0_8px_rgba(255,20,147,0.2)]'
            }`} />
          </div>
 
          {/* The Active Wedge (Central Highlight / Crosshair) */}
          <div className="absolute bottom-[-60px] sm:bottom-[-40px] left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none">
            <div className="absolute w-[520px] h-[520px] rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[260px]"
                style={{ clipPath: 'polygon(35% 0, 65% 0, 50% 100%)' }}
              >
                {/* Dark Mode Spotlight - Soft Golden Glow */}
                <div className={`absolute inset-0 bg-gradient-to-b from-[#FFD700]/15 via-[#FFD700]/5 to-transparent backdrop-blur-[1px] transition-opacity duration-500 ${theme === 'light' ? 'opacity-0' : 'opacity-100'}`} />
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[100%] bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.3)_0%,transparent_80%)] transition-opacity duration-500 ${theme === 'light' ? 'opacity-0' : 'opacity-100'}`} />
 
                {/* Light Mode Spotlight - Soft Blue/Red mixed Spotlight */}
                <div className={`absolute inset-0 bg-gradient-to-b from-sky-200/18 via-rose-100/5 to-transparent backdrop-blur-[1px] transition-opacity duration-500 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} />
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[100%] bg-[radial-gradient(ellipse_at_top,rgba(244,63,94,0.16)_0%,rgba(14,165,233,0.12)_50%,transparent_100%)] transition-opacity duration-500 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`} />
              </div>
            </div>
          </div>

          {/* Outer Layer: Zodiac (Sequential year rotation) */}
          <HorizontalDial items={ZODIAC_ANIMALS} targetValue={stableTarget.yearVal} radius={220} anglePerItem={24} isImage={true} visibleCount={15} />
          
          {/* Middle Layer: Symbols (Sequential month rotation) */}
          <HorizontalDial items={ASTRO_SYMBOLS} targetValue={stableTarget.monthVal} radius={150} anglePerItem={30} isSymbol={true} visibleCount={11} />
          
          {/* Inner Layer: Numbers (Sequential day rotation) */}
          <HorizontalDial items={DAYS} targetValue={stableTarget.dayVal} radius={80} anglePerItem={36} visibleCount={9} /> 
        </div>
      </div>
    </div>
  );
};
