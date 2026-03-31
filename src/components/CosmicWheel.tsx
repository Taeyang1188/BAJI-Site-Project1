import React from 'react';
import { motion } from 'motion/react';
import { ZODIAC_ANIMALS, ELEMENT_COLORS, TRANSLATIONS } from '../constants';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { BaZiResult, Language } from '../types';

interface CosmicWheelProps {
  result: BaZiResult | null;
  lang: Language;
}

export default function CosmicWheel({ result, lang }: CosmicWheelProps) {
  // Determine rotations based on Bazi result
  // If no result, we use default rotations
  const yearPillar = result?.pillars?.find(p => p.title === 'Year');
  const monthPillar = result?.pillars?.find(p => p.title === 'Month');
  const dayPillar = result?.pillars?.find(p => p.title === 'Day');
  const hourPillar = result?.pillars?.find(p => p.title === 'Hour');

  // Unique list of 10 Ten Gods for the wheel segments
  const uniqueTenGods = [
    "비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"
  ];

  // Find index of the animal in ZODIAC_ANIMALS
  const yearAnimalIndex = yearPillar 
    ? Math.max(0, ZODIAC_ANIMALS.findIndex(a => yearPillar.hanja.includes(a.hanja))) 
    : 0;
  
  // Find index of Ten Gods in the unique list
  const monthTenGodIndex = monthPillar 
    ? Math.max(0, uniqueTenGods.findIndex(tg => {
        const info = BAZI_MAPPING.tenGods[tg as keyof typeof BAZI_MAPPING.tenGods];
        return info && (info.en === monthPillar.stemEnglishName || info.ko === monthPillar.stemKoreanName);
      }))
    : 0;
  const hourTenGodIndex = hourPillar 
    ? Math.max(0, uniqueTenGods.findIndex(tg => {
        const info = BAZI_MAPPING.tenGods[tg as keyof typeof BAZI_MAPPING.tenGods];
        return info && (info.en === hourPillar.stemEnglishName || info.ko === hourPillar.stemKoreanName);
      }))
    : 0;

  // Rotations (aligning current to top needle)
  const yearRotation = -(yearAnimalIndex * 30);
  const monthRotation = -(monthTenGodIndex * 36); // 360/10
  const hourRotation = -(hourTenGodIndex * 36);

  console.log("CosmicWheel Rotations:", { yearRotation, monthRotation, hourRotation });

  const currentColor = yearPillar 
    ? ELEMENT_COLORS[yearPillar.element as keyof typeof ELEMENT_COLORS] 
    : '#FF007A';

  const getDisplayName = (pillar: any) => {
    if (!pillar) return '--';
    return lang === 'KO' ? pillar.stemKoreanName : pillar.stemEnglishName;
  };

  const getShortName = (pillar: any) => {
    if (!pillar) return '--';
    const name = getDisplayName(pillar);
    if (lang === 'KO') return name;
    const parts = name.split(' ');
    return parts[0] === 'The' ? parts[1] : parts[0];
  };

  const t = TRANSLATIONS[lang].wheel;

  return (
    <div className="relative w-full h-72 flex flex-col items-center justify-center overflow-hidden">
      {/* Neon Glow Background */}
      <motion.div 
        animate={{ 
          backgroundColor: currentColor,
          boxShadow: `0 0 100px ${currentColor}66`
        }}
        className="absolute top-[-40%] w-96 h-96 rounded-full blur-[100px] opacity-20"
      />

      {/* The 3-Layer Wheel */}
      <div className="relative w-80 h-40 mt-24 border-t-2 border-white/10 rounded-t-full flex items-end justify-center overflow-hidden">
        
        {/* Top Needle (Fixed) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
          <div className="w-1 h-8 bg-gradient-to-b from-neon-pink to-transparent shadow-[0_0_10px_#FF007A]" />
          <div className="w-2 h-2 rounded-full bg-neon-pink shadow-[0_0_15px_#FF007A]" />
        </div>

        {/* Layer 1: Year (Outer) */}
        <motion.div 
          animate={{ rotate: yearRotation }}
          transition={{ type: 'spring', stiffness: 30, damping: 20 }}
          style={{ transformOrigin: 'center center' }}
          className="absolute w-[600px] h-[600px] top-0 flex items-center justify-center"
        >
          {ZODIAC_ANIMALS.map((animal, i) => (
            <div 
              key={animal.name}
              className="absolute h-full w-1 flex flex-col items-center"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className="mt-4 text-[12px] font-gothic text-white/40">
                {lang === 'KO' ? 
                  (BAZI_MAPPING.branches[animal.hanja as keyof typeof BAZI_MAPPING.branches]?.ko.slice(0, 1) || animal.hanja) : 
                  (BAZI_MAPPING.branches[animal.hanja as keyof typeof BAZI_MAPPING.branches]?.en || animal.hanja)}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Layer 2: Month (Middle) */}
        <motion.div 
          animate={{ rotate: monthRotation }}
          transition={{ type: 'spring', stiffness: 40, damping: 25 }}
          style={{ transformOrigin: 'center center' }}
          className="absolute w-[450px] h-[450px] top-[75px] flex items-center justify-center"
        >
          <div className="absolute inset-0 border border-white/5 rounded-full" />
          {uniqueTenGods.map((tg, i) => (
            <div 
              key={tg}
              className="absolute h-full w-1 flex flex-col items-center"
              style={{ transform: `rotate(${i * 36}deg)` }}
            >
              <div className="mt-4 text-[8px] font-display font-bold text-neon-cyan/40 uppercase tracking-tighter">
                {lang === 'KO' ? tg : BAZI_MAPPING.tenGods[tg as keyof typeof BAZI_MAPPING.tenGods]?.en?.split(' ').pop() || 'VOID'}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Layer 3: Hour (Inner) */}
        <motion.div 
          animate={{ rotate: hourRotation }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          style={{ transformOrigin: 'center center' }}
          className="absolute w-[300px] h-[300px] top-[150px] flex items-center justify-center"
        >
          <div className="absolute inset-0 border border-white/5 rounded-full" />
          {uniqueTenGods.map((tg, i) => (
            <div 
              key={tg + 'inner'}
              className="absolute h-full w-1 flex flex-col items-center"
              style={{ transform: `rotate(${i * 36}deg)` }}
            >
              <div className="mt-4 text-[6px] font-display font-bold text-neon-pink/40 uppercase">
                {lang === 'KO' ? tg : (BAZI_MAPPING.tenGods[tg as keyof typeof BAZI_MAPPING.tenGods]?.en?.split(' ').pop()?.slice(0, 3) || 'VOD')}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Current Selection Display */}
      <div className="absolute top-4 flex flex-col items-center space-y-1">
        <div className="text-[10px] font-display font-bold text-white/20 uppercase tracking-[0.3em]">
          {t.alignment}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-white/40">{t.year}</span>
            <span className="text-sm font-gothic text-neon-pink">
              {yearPillar ? (
                lang === 'KO' ? 
                  (BAZI_MAPPING.branches[yearPillar.branch as keyof typeof BAZI_MAPPING.branches]?.ko || '--') : 
                  (BAZI_MAPPING.branches[yearPillar.branch as keyof typeof BAZI_MAPPING.branches]?.en || '--')
              ) : '--'}
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-white/40">{t.month}</span>
            <span className="text-sm font-display font-bold text-neon-cyan">{getShortName(monthPillar)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-white/40">{t.hour}</span>
            <span className="text-sm font-display font-bold text-neon-pink">{getShortName(hourPillar)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
