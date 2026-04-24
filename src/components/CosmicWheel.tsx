import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZODIAC_ANIMALS } from '../constants';

interface CosmicWheelProps {
  birthDate: string;
}

const ASTRO_SYMBOLS = ['♈\uFE0E', '♉\uFE0E', '♊\uFE0E', '♋\uFE0E', '♌\uFE0E', '♍\uFE0E', '♎\uFE0E', '♏\uFE0E', '♐\uFE0E', '♑\uFE0E', '♒\uFE0E', '♓\uFE0E'];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const HorizontalDial = ({ 
  items, 
  selectedIndex, 
  radius, 
  anglePerItem = 15,
  isImage = false,
  isSymbol = false,
  visibleCount = 9
}: { 
  items: any[], 
  selectedIndex: number, 
  radius: number, 
  anglePerItem?: number,
  isImage?: boolean,
  isSymbol?: boolean,
  visibleCount?: number
}) => {
  const [prevIndex, setPrevIndex] = useState(selectedIndex);
  const [direction, setDirection] = useState(1);

  const getImagePath = (item: any) => {
    return item.imgUrl;
  };

  useEffect(() => {
    if (selectedIndex !== prevIndex) {
      let diff = selectedIndex - prevIndex;
      if (diff > items.length / 2) diff -= items.length;
      if (diff < -items.length / 2) diff += items.length;
      
      setDirection(diff > 0 ? 1 : -1);
      setPrevIndex(selectedIndex);
    }
  }, [selectedIndex, prevIndex, items.length]);

  const half = Math.floor(visibleCount / 2);
  const visibleOffsets = Array.from({ length: visibleCount }, (_, i) => i - half);

  return (
    <div className="absolute bottom-[-60px] sm:bottom-[-40px] left-1/2 w-0 h-0 flex items-center justify-center z-30">
      <AnimatePresence custom={direction}>
        {visibleOffsets.map(offset => {
          const itemIndex = (selectedIndex + offset + items.length * 100) % items.length;
          const item = items[itemIndex];
          
          const isCenter = offset === 0;
          const opacity = isCenter ? 1 : Math.max(0, 1 - Math.abs(offset) * (1 / half));
          const scale = isCenter ? 1.2 : Math.max(0.6, 1 - Math.abs(offset) * 0.12);
          const blurAmount = isCenter ? 0 : Math.abs(offset) * 1.2;
          const rotateZ = offset * anglePerItem;

          return (
            <motion.div
              key={itemIndex}
              custom={{ dir: direction, rz: rotateZ }}
              variants={{
                initial: (c: any) => ({ rotate: c.rz + c.dir * anglePerItem }),
                animate: (c: any) => ({ rotate: c.rz }),
                exit: (c: any) => ({ rotate: c.rz - c.dir * anglePerItem })
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.6 }}
              className="absolute flex flex-col items-center justify-start"
              style={{
                height: `${radius * 2}px`,
                bottom: `-${radius}px`,
                transformOrigin: 'center center'
              }}
            >
              <motion.div 
                className="absolute top-0 flex items-center justify-center origin-center -translate-y-1/2"
                custom={{ dir: direction, rz: rotateZ }}
                variants={{
                  initial: (c: any) => ({ 
                    opacity: 0,
                    filter: `blur(4px)`,
                    scale: 0.5,
                    rotate: -(c.rz + c.dir * anglePerItem)
                  }),
                  animate: (c: any) => ({ 
                    opacity,
                    filter: `blur(${blurAmount}px)`,
                    scale,
                    rotate: -c.rz
                  }),
                  exit: (c: any) => ({ 
                    opacity: 0,
                    filter: `blur(4px)`,
                    scale: 0.5,
                    rotate: -(c.rz - c.dir * anglePerItem)
                  })
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.6 }}
              >
                {isImage ? (
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-500 ${isCenter ? 'scale-110' : 'scale-100'}`}>
                    <img 
                      src={getImagePath(item)} 
                      alt={item.name} 
                      className="w-full h-full object-contain" 
                      loading="lazy"
                      style={{ 
                        mixBlendMode: 'screen',
                        filter: isCenter 
                          ? 'sepia(1) saturate(3) hue-rotate(-10deg) brightness(1.2) contrast(1.2) drop-shadow(0 0 8px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 2px rgba(255, 215, 0, 1))' 
                          : 'sepia(0.8) saturate(1.5) brightness(0.8) drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))' 
                      }}
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                ) : isSymbol ? (
                  <span className={`font-bold text-[#FFD700] transition-all duration-500 ${isCenter ? 'text-4xl sm:text-5xl [text-shadow:0_0_25px_rgba(255,215,0,1),0_0_10px_rgba(255,215,0,0.8)]' : 'text-3xl sm:text-4xl [text-shadow:0_0_10px_rgba(255,215,0,0.4)]'}`} style={{ fontFamily: 'sans-serif' }}>
                    {item}
                  </span>
                ) : (
                  <span className={`font-bold text-[#FFD700] transition-all duration-500 ${isCenter ? 'text-lg sm:text-xl [text-shadow:0_0_15px_rgba(255,215,0,1)]' : 'text-sm sm:text-base [text-shadow:0_0_8px_rgba(255,215,0,0.4)]'}`} style={{ fontFamily: 'sans-serif' }}>
                    {item}
                  </span>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default function CosmicWheel({ birthDate }: CosmicWheelProps) {
  const date = useMemo(() => {
    const d = birthDate ? new Date(birthDate) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  }, [birthDate]);
  
  const yearIndex = (date.getFullYear() - 4) % 12;
  const normalizedYearIndex = yearIndex < 0 ? yearIndex + 12 : yearIndex;
  const monthIndex = date.getMonth(); 
  const dayIndex = date.getDate() - 1; 

  return (
    <div className="relative w-full max-w-3xl h-[130px] sm:h-[240px] mx-auto flex items-center justify-center bg-[#050505] rounded-2xl border border-purple-900/40 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-black to-pink-950/20" />

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
            <div className="absolute w-[520px] h-[520px] rounded-full border-[3px] border-[#FF1493]/90 shadow-[0_0_20px_rgba(255,20,147,0.8),inset_0_0_10px_rgba(255,20,147,0.4)]" />
            
            {/* Line 3 (Between Zodiac and Symbols) */}
            <div className="absolute w-[370px] h-[370px] rounded-full border-[2px] border-[#FF1493]/70 shadow-[0_0_15px_rgba(255,20,147,0.6)]" />
            
            {/* Line 2 (Between Symbols and Numbers) */}
            <div className="absolute w-[230px] h-[230px] rounded-full border-[2px] border-[#FF1493]/50 shadow-[0_0_10px_rgba(255,20,147,0.4)]" />
            
            {/* Line 1 (Inner boundary of Numbers) - Weakest */}
            <div className="absolute w-[90px] h-[90px] rounded-full border-[1px] border-[#FF1493]/30 bg-[radial-gradient(circle_at_center,transparent_70%,rgba(255,20,147,0.05)_100%)] backdrop-blur-[1px] shadow-[0_0_8px_rgba(255,20,147,0.2)]" />
          </div>

          {/* The Active Wedge (Central Highlight / Crosshair) */}
          <div className="absolute bottom-[-60px] sm:bottom-[-40px] left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none">
            <div className="absolute w-[520px] h-[520px] rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[260px]"
                style={{ clipPath: 'polygon(35% 0, 65% 0, 50% 100%)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/15 via-[#FFD700]/5 to-transparent backdrop-blur-[1px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[100%] bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.3)_0%,transparent_80%)]" />
              </div>
            </div>
          </div>

          {/* Outer Layer: Zodiac (Counter-rotated to stay upright) */}
          <HorizontalDial items={ZODIAC_ANIMALS} selectedIndex={normalizedYearIndex} radius={220} anglePerItem={24} isImage={true} visibleCount={11} />
          
          {/* Middle Layer: Symbols */}
          <HorizontalDial items={ASTRO_SYMBOLS} selectedIndex={monthIndex} radius={150} anglePerItem={30} isSymbol={true} visibleCount={9} />
          
          {/* Inner Layer: Numbers */}
          <HorizontalDial items={DAYS} selectedIndex={dayIndex} radius={80} anglePerItem={36} visibleCount={7} /> 
        </div>
      </div>
    </div>
  );
};
