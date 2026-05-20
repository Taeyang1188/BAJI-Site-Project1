import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { BaZiResult, Language } from '../types';
import { TRANSLATIONS, ELEMENT_COLORS, TEN_GOD_COLORS, ELEMENT_DESCRIPTIONS } from '../constants';
import { SHINSAL_DEFINITIONS } from '../constants/shinsal-definitions';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { AdvancedAnalysisSection } from './AdvancedAnalysisSection';
import { DestinyMapSection } from './DestinyMapSection';
import { PillarDetailGuide } from './PillarDetailGuide';
import { ParsedText, TooltipWrapper } from './ParsedText';
import { GeJuHelpModal } from './GeJuHelpModal';
import PersonaTestSection from './PersonaTestSection';
import { SeasonalFlow } from './SeasonalFlow';
import { calculateTenGods, STEM_ELEMENTS, BRANCH_ELEMENTS } from '../services/bazi-engine';
import { 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Sun, 
  Moon, 
  HelpCircle, 
  X, 
  Zap, 
  BookOpen, 
  Clock,
  CheckCircle2,
  Sparkles,
  Share2,
  ChevronRight,
  AlertTriangle,
  Shield,
  Image
} from 'lucide-react';

import { generateSoulSummary, SoulSummary } from '../services/bazi-summary-service';
import { generateCycleVibe, CycleVibeResult } from '../services/cycle-vibe-service';
import { getTodayPillar } from '../services/bazi-service';
import { ILJU_DESCRIPTIONS } from '../constants/ilju-descriptions';
import { useTheme } from '../contexts/ThemeContext';

const ILJU_BACKGROUND_IMAGES: Record<string, { base: string, detailed: string }> = {
  '己丑': { base: 'https://i.imgur.com/RyKP0u5.jpeg', detailed: 'https://i.imgur.com/RyKP0u5.jpeg' },
  '庚子': { base: 'https://i.imgur.com/PHSlQOn.jpeg', detailed: 'https://i.imgur.com/PHSlQOn.jpeg' },
  '庚寅': { base: 'https://i.imgur.com/Isk1umc.jpeg', detailed: 'https://i.imgur.com/Isk1umc.jpeg' },
  '庚午': { base: 'https://i.imgur.com/aA94qPC.jpeg', detailed: 'https://i.imgur.com/aA94qPC.jpeg' },
  '庚申': { base: 'https://i.imgur.com/7YAltfY.jpeg', detailed: 'https://i.imgur.com/7YAltfY.jpeg' },
  '辛丑': { base: 'https://i.imgur.com/KyBoOpe.jpeg', detailed: 'https://i.imgur.com/KyBoOpe.jpeg' },
  '辛卯': { base: 'https://i.imgur.com/lVuVjGP.jpeg', detailed: 'https://i.imgur.com/lVuVjGP.jpeg' },
  '乙亥': { base: 'https://i.imgur.com/3nOSRA9.png', detailed: 'https://i.imgur.com/INHddT3.png' },
  '甲辰': { base: 'https://i.imgur.com/Jej3sQC.png', detailed: 'https://i.imgur.com/sDVDQ82.png' },
  '壬子': { base: 'https://i.imgur.com/VjDvE52.png', detailed: 'https://i.imgur.com/jTZBawc.png' },
  '庚戌': { base: 'https://i.imgur.com/gcFLDVe.png', detailed: 'https://i.imgur.com/Vm78FRr.png' },
  '丙辰': { base: 'https://i.imgur.com/cy1Dpkw.png', detailed: 'https://i.imgur.com/umERQUa.png' },
  '己酉': { base: 'https://i.imgur.com/3RoRUcx.png', detailed: 'https://i.imgur.com/j7Xq42C.png' },
  '己亥': { base: 'https://i.imgur.com/tSNZPod.png', detailed: 'https://i.imgur.com/zjlgWhY.png' },
  '戊寅': { base: 'https://i.imgur.com/6aGeVq2.png', detailed: 'https://i.imgur.com/x4ce1iO.png' },
  '乙酉': { base: 'https://i.imgur.com/c8ZbId7.png', detailed: 'https://i.imgur.com/LWqXO6c.png' },
  '壬寅': { base: 'https://i.imgur.com/R7fduL6.png', detailed: 'https://i.imgur.com/Lg1hHFR.png' },
};

const getRootingInfoText = (stem: string, hs: string, isMain: boolean, lang: Language): { type: 'main' | 'sub_residual' | 'generation', text: string, short: string } | null => {
  const STEM_ELEMENTS: Record<string, string> = {
    '甲': 'Wood', '乙': 'Wood', '丙': 'Fire', '丁': 'Fire', '戊': 'Earth',
    '己': 'Earth', '庚': 'Metal', '辛': 'Metal', '壬': 'Water', '癸': 'Water'
  };

  const elStem = STEM_ELEMENTS[stem];
  const elHs = STEM_ELEMENTS[hs];

  if (!elStem || !elHs) return null;

  if (elStem === elHs) {
    const isExactMain = isMain || (stem === hs);
    if (isExactMain) {
      return {
        type: 'main',
        text: lang === 'KO' 
          ? `본기 통근(本氣 通根) - 하늘의 '${stem}' 기운이 땅 속의 가장 깊고 주도적인 에너지인 '${hs}'에 뿌리를 내려 흔들림 없이 아주 강력하게 직결되어 있습니다.` 
          : `Main-Qi Rooting - The stem '${stem}' roots in the prime energy '${hs}' of the branch, giving it maximum stability and power.`,
        short: lang === 'KO' ? "본기통근" : "Main Qi Root"
      };
    } else {
      return {
        type: 'sub_residual',
        text: lang === 'KO' 
          ? `중/여기 통근(中/餘氣 通根) - 하늘의 '${stem}' 기운이 땅 밑에 부수적으로 감춰진 동일 기운인 '${hs}'에 발을 디뎌 안정적인 내재적 생명력을 지니고 있습니다.` 
          : `Sub/Residual Qi Rooting - The stem '${stem}' is supported by the hidden equivalent '${hs}', maintaining high intrinsic survival capacity.`,
        short: lang === 'KO' ? "중/여기통근" : "Sub Qi Root"
      };
    }
  }

  const isGeneration = (elHs === 'Water' && elStem === 'Wood') ||
                        (elHs === 'Wood' && elStem === 'Fire') ||
                        (elHs === 'Fire' && elStem === 'Earth') ||
                        (elHs === 'Earth' && elStem === 'Metal') ||
                        (elHs === 'Metal' && elStem === 'Water');

  if (isGeneration) {
    return {
      type: 'generation',
      text: lang === 'KO' 
          ? `생기 생조(生氣 生助, 득생) - 동일 상생의 인성(印星) 기운인 '${hs}'으로부터 메마르지 않는 젖줄 같은 지지와 보호, 기운을 끊임없이 공급받고 있습니다.` 
          : `Generative Support - The stem '${stem}' receives non-stop generative nourishment and support from the resource element '${hs}' inside the branch.`,
      short: lang === 'KO' ? "생기생조" : "Nourished"
    };
  }

  return null;
};

const WeatherWidget = ({ city, lang }: { city: string; lang: Language }) => {
  const [location, setLocation] = React.useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  // Mock weather data based on location or city
  const weatherData = React.useMemo(() => {
    // In a real app, we'd fetch from an API using location or city
    return {
      temp: { high: 22, low: 14 },
      rainProb: 15,
      condition: 'Sunny',
      locationName: location ? (lang === 'KO' ? '현재 위치' : 'Current Location') : city
    };
  }, [location, city, lang]);

  const weatherComment = React.useMemo(() => {
    if (lang !== 'KO') return '';
    if (weatherData.rainProb > 50) return '비가 오네. 이런 날엔 실내에서 네 내면의 목소리에 집중해봐.';
    if (weatherData.temp.high > 28) return '날씨가 꽤 덥네. 열기에 휩쓸리지 말고 차분함을 유지하는 게 좋겠어.';
    if (weatherData.temp.low < 5) return '공기가 꽤 차가워. 몸을 따뜻하게 하고 네 에너지를 아껴둬.';
    return '날씨가 꽤 쾌적하네. 가벼운 산책이라도 하면서 영감을 얻어보는 건 어때?';
  }, [weatherData, lang]);

  return (
    <div className="flex flex-col items-end gap-1 max-w-full">
      <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 overflow-hidden">
        <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 shrink-0" />
        <span className="text-[10px] sm:text-[11px] font-mono text-white/80 whitespace-nowrap">
          {weatherData.temp.high}°/{weatherData.temp.low}°
        </span>
        <div className="w-[1px] h-3 bg-white/20 shrink-0" />
        <span className="text-[10px] sm:text-[11px] font-mono text-white/80 whitespace-nowrap">
          {weatherData.rainProb}% ☔
        </span>
        <div className="w-[1px] h-3 bg-white/20 shrink-0" />
        <span className="text-[9px] sm:text-[10px] font-display text-white/60 uppercase tracking-tighter truncate max-w-[60px] sm:max-w-[100px]">
          {loading ? '...' : weatherData.locationName}
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] font-display italic text-white/40 text-right leading-tight">
        {weatherComment}
      </span>
    </div>
  );
};

const TEN_GODS_HANJA: Record<string, string> = {
  "비견": "比肩", "겁재": "劫財", "식신": "食神", "상관": "傷官",
  "편재": "偏財", "정재": "正財", "편관": "偏官", "정관": "正官",
  "편인": "偏印", "정인": "正印"
};

const CITY_META_TABLE: Record<string, { keywords: string; vibe: string; point: string }> = {
  "강릉시": { keywords: "바다, 커피, 경포대, 정동진", vibe: "낭만적인, 푸른, 여유로운", point: "푸른 파도와 커피 향" },
  "부산시": { keywords: "항구, 역동적, 마천루, 사투리", vibe: "거친, 에너제틱한, 화려한", point: "거친 파도와 도시의 소음" },
  "춘천시": { keywords: "호수, 안개, 닭갈비, 소양강", vibe: "몽환적인, 잔잔한, 서정적인", point: "안개 낀 호수와 새벽 공기" },
  "경주시": { keywords: "고분, 신라, 역사, 황리단길", vibe: "신비로운, 오래된, 정갈한", point: "천 년의 세월이 흐르는 땅" },
  "제주시": { keywords: "바람, 돌, 한라산, 이국적", vibe: "자유로운, 거친, 신비로운", point: "현무암 사이를 지나는 바람" },
  "서울": { keywords: "남산타워, 한강, 빌딩숲, 잠들지 않는 도시", vibe: "세련된, 바쁜, 화려한", point: "갑자기 K-FOOD가 땡기네" }
};

const getGanYeoJiDong = (stem: string, branch: string) => {
  const stemEl = STEM_ELEMENTS[stem as keyof typeof STEM_ELEMENTS];
  const branchEl = BRANCH_ELEMENTS[branch as keyof typeof BRANCH_ELEMENTS];
  return stemEl === branchEl;
};

const getRomanized = (hanja: string) => {
  const map: Record<string, string> = {
    '甲': 'Gap', '乙': 'Eul', '丙': 'Byeong', '丁': 'Jeong', '戊': 'Mu',
    '己': 'Gi', '庚': 'Gyeong', '辛': 'Sin', '壬': 'Im', '癸': 'Gye',
    '子': 'Ja', '丑': 'Chuk', '寅': 'In', '卯': 'Myo', '辰': 'Jin', '巳': 'Sa',
    '午': 'Oh', '未': 'Mi', '申': 'Sin', '酉': 'Yu', '戌': 'Sul', '亥': 'Hae'
  };
  return map[hanja] || hanja;
};

const getCleanBranchEn = (rawEn: string) => {
  if (!rawEn) return '';
  const match = rawEn.match(/\(([^)]+)\)/);
  if (match) {
    return match[1];
  }
  return rawEn;
};

const getElementColorForText = (text: string, isLight: boolean = false): string => {
  const t = text.toLowerCase();
  if (isLight) {
    if (t.includes('wood') || t.includes('목')) return '#059669'; // Wood - Emerald 600
    if (t.includes('fire') || t.includes('화')) return '#E11D48'; // Fire - Rose 600
    if (t.includes('earth') || t.includes('토')) return '#B45309'; // Earth - Amber 700
    if (t.includes('metal') || t.includes('금')) return '#52525B'; // Metal - Zinc 600
    if (t.includes('water') || t.includes('수')) return '#2563EB'; // Water - Blue 600
    return '#090D16';
  } else {
    if (t.includes('wood') || t.includes('목')) return '#4ADE80'; // Wood - Emerald 400
    if (t.includes('fire') || t.includes('화')) return '#F87171'; // Fire - Rose 400
    if (t.includes('earth') || t.includes('토')) return '#FACC15'; // Earth - Yellow 400
    if (t.includes('metal') || t.includes('금')) return '#E2E8F0'; // Metal - Slate 100
    if (t.includes('water') || t.includes('수')) return '#60A5FA'; // Water - Blue 400
    return '#00E5FF';
  }
};

const LIGHT_MODE_ELEMENT_TINTS: Record<string, { border: string; bg: string }> = {
  Wood: { border: '#059669', bg: 'rgba(5, 150, 105, 0.13)' },
  Fire: { border: '#E11D48', bg: 'rgba(225, 29, 72, 0.13)' },
  Earth: { border: '#B45309', bg: 'rgba(180, 83, 9, 0.13)' },
  Metal: { border: '#52525B', bg: 'rgba(82, 82, 91, 0.13)' },
  Water: { border: '#3A8FD8', bg: 'rgba(58, 143, 216, 0.13)' }
};

const TypingText: React.FC<{ text: string, speed?: number, onComplete?: () => void, lang?: 'KO' | 'EN', skip?: boolean }> = ({ text, speed = 30, onComplete, lang = 'KO', skip = false }) => {
  const [displayedElements, setDisplayedElements] = React.useState<React.ReactNode[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showCursor, setShowCursor] = React.useState(true);
  const wasCompletedRef = React.useRef(false);

  // Blinking cursor effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const charInfos = React.useMemo(() => {
    if (!text) return [];
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const infos: { char: string, delay: number, color?: string, isBold?: boolean, isTooltip?: boolean, tooltipProps?: any }[] = [];
    let isBold = false;
    let i = 0;
    while (i < text.length) {
      // Check for tags
      if (text.startsWith('<strong>', i)) {
        isBold = true;
        i += 8;
        continue;
      } else if (text.startsWith('</strong>', i)) {
        isBold = false;
        i += 9;
        continue;
      } else if (text[i] === '[') {
        const endBracketIndex = text.indexOf(']', i + 1);
        if (endBracketIndex !== -1) {
          const tagContent = text.substring(i + 1, endBracketIndex);
          if (tagContent.startsWith('delay:')) {
            const ms = parseInt(tagContent.split(':')[1]);
            if (!isNaN(ms)) {
              infos.push({ char: '', delay: ms });
            }
            i = endBracketIndex + 1;
            continue;
          }
          if (tagContent.startsWith('tooltip:')) {
            const content = tagContent.substring(8);
            let term = content;
            let info;
            if (content.includes('|')) {
              const parts = content.split('|');
              term = parts[0];
              info = { ko: parts[1], en: parts[2] || parts[1] };
            }
            infos.push({ char: '', delay: speed, isTooltip: true, tooltipProps: { term, info } });
            i = endBracketIndex + 1;
            continue;
          }
          const colonIndex = tagContent.indexOf(':');
          if (colonIndex !== -1) {
            const color = tagContent.substring(0, colonIndex);
            const content = tagContent.substring(colonIndex + 1);
            
            for (let j = 0; j < content.length; j++) {
              infos.push({ char: content[j], delay: speed, color, isBold });
            }
            i = endBracketIndex + 1;
            continue;
          }
        }
      }

      // Handle normal character
      let delay = speed;
      const char = text[i];
      if (char === ',') delay = speed * 2;
      else if (char === '.') {
        delay = speed * 3;
      }
      else if (char === '\n') delay = speed * 4;

      infos.push({ char, delay, isBold });
      i++;
    }
    return infos;
  }, [text, speed]);

  // Remove separate completion flag effect, handle in one place

  // Reset or instantly fill elements when text changes (or skip becomes true)
  React.useEffect(() => {
    // text changed or skip changed
    if (skip) {
      const elements = charInfos.map((info, idx) => {
        if (info.isTooltip && info.tooltipProps) {
          return (
            <TooltipWrapper key={`idx-${idx}`} term={info.tooltipProps.term} info={info.tooltipProps.info} lang={lang}>
              {info.tooltipProps.term}
            </TooltipWrapper>
          );
        } else if (info.char !== '') {
          const boldBaseClass = "font-bold drop-shadow-[0_0_5px_rgba(255,42,133,0.5)]";
          const boldColorClass = info.color ? "" : "text-neon-pink";
          
          return (
            <span 
              key={`idx-${idx}`} 
              style={{ color: info.color }} 
              className={info.isBold ? `${boldBaseClass} ${boldColorClass}` : ''}
            >
              {info.char}
            </span>
          );
        }
        return null;
      }).filter(Boolean);
      setDisplayedElements(elements);
      setCurrentIndex(charInfos.length);
      onComplete?.();
    } else {
      setDisplayedElements([]);
      setCurrentIndex(0);
      wasCompletedRef.current = false;
    }
  }, [charInfos, lang, skip]);

  React.useEffect(() => {
    if (skip) {
      return; 
    }

    if (currentIndex < charInfos.length) {
      const info = charInfos[currentIndex];
      const currentDelay = info.delay;

      const timeout = setTimeout(() => {
        if (info.isTooltip && info.tooltipProps) {
          setDisplayedElements(prev => [
            ...prev,
            <TooltipWrapper key={`idx-${currentIndex}`} term={info.tooltipProps.term} info={info.tooltipProps.info} lang={lang}>
              {info.tooltipProps.term}
            </TooltipWrapper>
          ]);
        } else if (info.char !== '') {
          const boldBaseClass = "font-bold drop-shadow-[0_0_5px_rgba(255,42,133,0.5)]";
          const boldColorClass = info.color ? "" : "text-neon-pink";
          
          setDisplayedElements(prev => [
            ...prev, 
            <span 
              key={`idx-${currentIndex}`} 
              style={{ color: info.color }} 
              className={info.isBold ? `${boldBaseClass} ${boldColorClass}` : ''}
            >
              {info.char}
            </span>
          ]);
        }
        setCurrentIndex(prev => prev + 1);
      }, currentDelay);
      return () => clearTimeout(timeout);
    } else if (currentIndex === charInfos.length && charInfos.length > 0) {
      if (!wasCompletedRef.current) {
        wasCompletedRef.current = true;
        onComplete?.();
      }
    }
  }, [currentIndex, charInfos]);


  return (
    <span className="whitespace-pre-wrap">
      {displayedElements}
      {currentIndex < charInfos.length && (
        <span className={`${showCursor ? "opacity-100" : "opacity-0"} inline-block w-[2px] h-[1.2em] bg-neon-pink ml-1 align-middle shadow-[0_0_8px_rgba(255,20,147,0.8)]`}></span>
      )}
    </span>
  );
};



const GongmangDetail = ({ result, lang, isLight }: { result: BaZiResult, lang: Language, isLight?: boolean }) => {
  const gongmang = result.analysis.gongmang;
  if (!gongmang || !gongmang.branches || gongmang.branches.length === 0) return null;

  const affectedPillars = gongmang.affectedPillars || [];
  const interactions = result.analysis.interactions || [];
  
  // Check for Tal-gong (탈공)
  const isResolved = interactions.some(interaction => {
    const type = interaction.type || '';
    const branches = interaction.branches || [];
    const gongmangBranches = gongmang?.branches || [];
    
    return (type.includes('합') || type.includes('충') || type.includes('Combine') || type.includes('Clash')) &&
    branches.some(b => gongmangBranches.includes(b));
  });

  // Find Ten Gods for the Gongmang branches
  const gongmangTenGods: string[] = [];
  const gongmangBranches = gongmang?.branches || [];
  result.pillars.forEach((p, idx) => {
    if (idx < 4 && gongmangBranches.includes(p.branch)) {
      gongmangTenGods.push(lang === 'KO' ? p.branchKoreanName : p.branchEnglishName);
    }
  });

  if (lang === 'KO') {
    return (
      <div className={`mt-6 p-4 rounded-xl border ${isLight ? 'bg-white shadow-sm border-slate-200' : 'bg-white/5 border-white/10'}`}>
        <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-neon-pink"></span>
          공망(空亡) 심층 분석
        </h4>
        <div className={`space-y-4 text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
          {!gongmang.inChart ? (
            <div className={`p-3 rounded border ${isLight ? 'bg-pink-50 border-pink-200 text-slate-800' : 'bg-neon-pink/10 border-neon-pink/20 text-white/90'}`}>
              {gongmang.note}
            </div>
          ) : (
            <>
              <p>
                <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>공망의 3대 핵심 작용:</strong><br/>
                1. <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>허망함과 집착:</strong> 비어 있기 때문에 오히려 그것을 채우려 하는 강한 집착이 생겨. {gongmangTenGods.length > 0 && `현재 원국에서는 [${gongmangTenGods.join(', ')}]에 공망이 들어, 해당 십성이 상징하는 영역에 대한 갈증이 남들보다 클 수 있어.`}<br/>
                2. <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>변질과 비정상성:</strong> 해당 글자가 가진 본래의 기능이 정상적으로 작동하지 않아, 인연이 박하거나 덕을 보기 어려운 상황으로 나타날 수 있어.<br/>
                3. <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>정신적/형이상학적 발달:</strong> 현실적인 힘은 약해지지만, 대신 정신적, 철학적, 예술적 기운이 맑아집니다.
              </p>
              
              <div className={`p-4 rounded-xl border ${isLight ? 'bg-pink-50/50 border-pink-100 shadow-sm' : 'bg-neon-pink/5 border-neon-pink/20 shadow-[0_0_15px_rgba(255,20,147,0.05)]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${isLight ? 'bg-pink-100 text-pink-600' : 'bg-neon-pink/20 text-neon-pink'}`}>Personalized</span>
                  <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>궁성(자리)에 따른 나의 공망 의미:</strong>
                </div>
                <ul className="list-disc pl-4 space-y-2">
                  {affectedPillars.includes('년주') && <li><strong className={isLight ? 'text-pink-600' : 'text-neon-pink/90'}>년주(Year):</strong> 조상의 덕이 부족하거나 고향을 떠나 자수성가해야 할 수 있어.</li>}
                  {affectedPillars.includes('월주') && <li><strong className={isLight ? 'text-pink-600' : 'text-neon-pink/90'}>월주(Month):</strong> 부모, 형제의 덕이 약하며 사회 생활이나 직장 운에서 정착이 어려울 수 있어.</li>}
                  {affectedPillars.includes('일주') && <li><strong className={isLight ? 'text-pink-600' : 'text-neon-pink/90'}>일주(Day):</strong> 본인의 내면적 공허함이 있거나 배우자와의 인연이 약할 수 있어.</li>}
                  {affectedPillars.includes('시주') && <li><strong className={isLight ? 'text-pink-600' : 'text-neon-pink/90'}>시주(Hour):</strong> 노년의 고독이나 자식과의 인연이 박할 수 있으며, 일의 최종 결과물이 허무할 수 있어.</li>}
                </ul>
              </div>

              <div className={`p-3 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
                <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>탈공(脫空) 여부:</strong><br/>
                {isResolved ? (
                  <span className={isLight ? 'text-blue-600 font-medium' : 'text-neon-blue'}>원국 내에 공망된 글자를 깨우는 합(合)이나 충(沖)이 존재하여, 공망의 작용이 일시적으로 해소(탈공)되는 긍정적인 구조야. 비어있던 글자를 써먹을 수 있게 돼.</span>
                ) : (
                  <span>현재 원국 내에서는 합(合)이나 충(沖)으로 인한 탈공이 뚜렷하지 않아. 하지만 대운이나 세운에서 공망인 글자가 직접 들어오거나 합/충하는 운이 올 때 공망의 굴레에서 벗어나 실체를 가지게 돼.</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-6 p-4 rounded-xl border ${isLight ? 'bg-white shadow-sm border-slate-200' : 'bg-white/5 border-white/10'}`}>
      <h4 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-neon-pink"></span>
        In-depth Void (Gongmang) Analysis
      </h4>
      <div className={`space-y-4 text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
        {!gongmang.inChart ? (
          <div className={`p-3 rounded border ${isLight ? 'bg-pink-50 border-pink-200 text-slate-800' : 'bg-neon-pink/10 border-neon-pink/20 text-white/90'}`}>
            {gongmang.noteEn}
          </div>
        ) : (
          <>
            <p>
              <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>3 Core Effects of Void:</strong><br/>
              1. <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>Emptiness & Obsession:</strong> Because it is empty, a strong obsession to fill it arises. {gongmangTenGods.length > 0 && `In your chart, [${gongmangTenGods.join(', ')}] is in Void, meaning you may feel a greater thirst in these areas.`}<br/>
              2. <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>Alteration & Abnormality:</strong> The original function of the element does not operate normally, often resulting in weak karmic ties or difficulty receiving its benefits.<br/>
              3. <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>Spiritual/Metaphysical Development:</strong> While realistic power weakens, spiritual, philosophical, and artistic energies become clearer.
            </p>
            
            <div className={`p-4 rounded-xl border ${isLight ? 'bg-pink-50/50 border-pink-100 shadow-sm' : 'bg-neon-pink/5 border-neon-pink/20 shadow-[0_0_15px_rgba(255,20,147,0.05)]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${isLight ? 'bg-pink-100 text-pink-600' : 'bg-neon-pink/20 text-neon-pink'}`}>Personalized</span>
                <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>Meaning by Pillar Position in Your Chart:</strong>
              </div>
              <ul className="list-disc pl-4 space-y-2">
                {affectedPillars.includes('년주') && <li><strong className={isLight ? 'text-pink-600' : 'text-neon-pink/90'}>Year Pillar:</strong> Lack of ancestral benefits; may need to leave home and succeed independently.</li>}
                {affectedPillars.includes('월주') && <li><strong className={isLight ? 'text-pink-600' : 'text-neon-pink/90'}>Month Pillar:</strong> Weak benefits from parents/siblings; may face challenges settling in society or career.</li>}
                {affectedPillars.includes('일주') && <li><strong className={isLight ? 'text-pink-600' : 'text-neon-pink/90'}>Day Pillar:</strong> Inner emptiness or weak karmic ties/alignment with a spouse.</li>}
                {affectedPillars.includes('시주') && <li><strong className={isLight ? 'text-pink-600' : 'text-neon-pink/90'}>Hour Pillar:</strong> Solitude in old age, weak ties with children, or feeling empty about final outcomes.</li>}
              </ul>
            </div>

            <div className={`p-3 rounded border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-white/5'}`}>
              <strong className={isLight ? 'text-slate-800' : 'text-white/90'}>Resolution (Tal-gong):</strong><br/>
              {isResolved ? (
                <span className={isLight ? 'text-blue-600 font-medium' : 'text-neon-blue'}>Your chart contains a Combine or Clash that awakens the Void branch, temporarily resolving its effects. You can actively utilize this element.</span>
              ) : (
                <span>There is no clear Combine or Clash in your chart to resolve the Void. However, when the Void branch or its Clash/Combine arrives in your 10-year or annual luck cycles, the Void will be resolved and take form.</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

import { SocialContext } from '../types';

interface BaZiResultPageProps {
  result: BaZiResult;
  lang: Language;
  userName: string;
  gender: string;
  city: string;
  socialContext?: SocialContext;
  onBack: () => void;
  skipTyping?: boolean;
}

const BaziTooltip = ({ content, children, lang }: { content: { ko: string, en: string }, children: React.ReactNode, lang: Language, key?: any }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'top' as 'top' | 'bottom' });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const tooltipWidth = 300; // w-[300px] = 300px
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      
      // Boundary checks to keep tooltip within viewport
      if (left < 10) left = 10;
      if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
      }

      let top = rect.top - 8;
      let placement: 'top' | 'bottom' = 'top';

      // If tooltip would go off top of screen, show below
      if (top < 120) {
        top = rect.bottom + 8;
        placement = 'bottom';
      }

      setPosition({ top, left, placement });
    }
  };

  const showTooltip = () => {
    updatePosition();
    setIsVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouch) {
      // On touch, toggle and prevent default to avoid hover/click conflict
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
        // Auto hide after 5s for touch
        timerRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        hideTooltip();
      }
    };

    if (isVisible) {
      window.addEventListener('click', handleClickOutside);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible]);

  return (
    <motion.div 
      ref={containerRef}
      className="relative inline-block cursor-help" 
      onMouseEnter={() => {
        if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
          showTooltip();
        }
      }} 
      onMouseLeave={() => {
        if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
          hideTooltip();
        }
      }}
      onClick={handleInteraction}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div 
              initial={{ opacity: 0, y: position.placement === 'top' ? 5 : -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: position.placement === 'top' ? 5 : -5 }}
              style={{ 
                position: 'fixed', 
                top: position.top, 
                left: position.left, 
                transform: position.placement === 'top' ? 'translateY(-100%)' : 'none',
                zIndex: 9999 
              }}
              className={`w-[300px] p-3 border rounded-lg shadow-2xl backdrop-blur-xl pointer-events-none transition-colors duration-300 ${
                isLight 
                  ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_10px_35px_rgba(0,0,0,0.12)]' 
                  : 'bg-black/95 border-white/20 text-white/90 shadow-2xl'
              }`}
            >
              <div 
                className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-800' : 'text-white/90'}`}
                dangerouslySetInnerHTML={{ __html: lang === 'KO' ? content.ko : content.en }}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default function BaZiResultPage({ result, lang, userName, gender, city, socialContext, onBack, skipTyping = false }: BaZiResultPageProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const t = TRANSLATIONS[lang].result as any;
  const [guideSelectedPillar, setGuideSelectedPillar] = React.useState<'Year' | 'Month' | 'Day' | 'Hour'>('Day');
  const [hoveredHiddenStem, setHoveredHiddenStem] = React.useState<{pillarIdx: number, hsIdx: number, hs: string, connectedStems: string[], isDestroyed?: boolean} | null>(null);

  const renderTenGodLabel = (ko: string, en: string, polarity: number) => {
    if (lang === 'KO') {
      return (
        <span className="flex items-center justify-center gap-0.5 whitespace-nowrap">
          <PolarityIcon polarity={polarity} size={6} />
          <span>{ko}</span>
        </span>
      );
    }
    if (en && en.startsWith("The ")) {
      const rest = en.substring(4);
      return (
        <span className="flex flex-col items-center justify-center text-center leading-[1.0] select-none">
          <span className="text-[6.5px] opacity-65 font-normal tracking-wide">THE</span>
          <span className="text-[8px] sm:text-[9px] font-extrabold tracking-tight">{rest}</span>
        </span>
      );
    }
    if (en && en.includes(" ")) {
      const parts = en.split(" ");
      return (
        <span className="flex flex-col items-center justify-center text-center leading-[1.0] select-none">
          {parts.map((p, pIdx) => (
            <span key={pIdx} className="text-[8px] sm:text-[9px] font-extrabold tracking-tight">{p}</span>
          ))}
        </span>
      );
    }
    return (
      <span className="text-[8px] sm:text-[9.5px] font-extrabold tracking-tight text-center">{en}</span>
    );
  };

  const dayMaster = result.pillars[1].stem;
  const currentCycle = result.grandCycles[result.currentCycleIndex];
  const currentAnnualPillar = result.currentYearPillar;

  const presentRootTags = useMemo(() => {
    const tags = new Set<string>();
    if (!result || !result.pillars) return tags;
    
    const dayMaster = result.pillars.find(p => p.title === 'Day')?.stem || '';

    result.pillars.forEach((pillar, i) => {
      if (pillar.isUnknown) return;
      const branchData = BAZI_MAPPING.branches?.[pillar.branch as keyof typeof BAZI_MAPPING.branches];
      const hiddenStems = branchData?.hiddenStems || [];
      hiddenStems.forEach((hs, idx) => {
        const isMain = idx === hiddenStems.length - 1;
        
        const allRootedStems: {title: string, stem: string, pIdx: number, pNameKo: string, pNameEn: string, type: string, short: string, text: string}[] = [];
        result.pillars.forEach((p2, p2Idx) => {
          if (p2.isUnknown) return;
          const rootInfo = getRootingInfoText(p2.stem, hs, isMain, lang);
          if (rootInfo) {
            const isDay = p2.title === 'Day';
            allRootedStems.push({
              title: p2.title,
              stem: p2.stem,
              pIdx: p2Idx,
              pNameKo: isDay ? '일간' : p2.title === 'Year' ? '연간' : p2.title === 'Month' ? '월간' : '시간',
              pNameEn: p2.title + ' Stem',
              type: rootInfo.type,
              short: rootInfo.short,
              text: rootInfo.text
            });
          }
        });

        const getRootPriorityValue = (r: { pIdx: number, type: string }) => {
          const isSamePillar = r.pIdx === i;
          if (isSamePillar) {
            if (r.type === 'main') return 10;
            if (r.type === 'sub_residual') return 8;
            if (r.type === 'generation') return 6;
          } else {
            if (r.type === 'main') return 9;
            if (r.type === 'sub_residual') return 7;
            if (r.type === 'generation') return 5;
          }
          return 0;
        };

        const sortedRootedStems = [...allRootedStems].sort((a, b) => getRootPriorityValue(b) - getRootPriorityValue(a));
        const bestTagInfo = sortedRootedStems[0];

        if (bestTagInfo) {
          const type = bestTagInfo.type;
          const isDm = bestTagInfo.title === 'Day' && bestTagInfo.pIdx !== i; // True if it's connected to DM but NOT self pillar
          const isExternal = bestTagInfo.pIdx !== i;

          if (type === 'main') {
            tags.add(isExternal ? (isDm ? 'E-MN' : 'E-MN') : 'MAIN');
          } else if (type === 'sub_residual') {
            tags.add(isExternal ? (isDm ? 'E-SB' : 'E-SB') : 'SUB');
          } else if (type === 'generation') {
            tags.add(isExternal ? (isDm ? 'E-GN' : 'E-GN') : 'GEN');
          }
        }
      });
    });
    return tags;
  }, [result, lang]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const renderPillarText = (type: 'stem' | 'branch', value: string) => {
    const mapping = (type === 'stem' ? BAZI_MAPPING.stems : BAZI_MAPPING.branches) as any;
    const info = mapping[value];
    if (!info) return value;
    
    if (lang === 'KO') {
      return `${info.ko}(${value})`;
    }
    if (type === 'stem') {
      return info.en.split(' ')[0]; // 'Gap'
    } else {
      const roman = getRomanized(value);
      const animal = getCleanBranchEn(info.en);
      return `${roman} (${animal})`; // 'Ja (Rat)'
    }
  };

  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [showTongGwanInfo, setShowTongGwanInfo] = useState(false);
  const [showEokbuInfo, setShowEokbuInfo] = useState(false);
  const [showYongshinInfo, setShowYongshinInfo] = useState(false);
  const [showYongshinRolesInfo, setShowYongshinRolesInfo] = useState(false);
  const [showInteractionInfo, setShowInteractionInfo] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showHanja, setShowHanja] = useState(true);
  const [guideStep, setGuideStep] = useState(0); // 0: None, 1: Year, 2: Month, 3: Day, 4: Hour, 5: JiJangGan, 6: TenGods, 7: Daewun
  const [showGuideDetailModal, setShowGuideDetailModal] = useState(false);

  const [showStrengthInfo, setShowStrengthInfo] = useState(false);
  const [showGeJuInfo, setShowGeJuInfo] = useState(false);
  const [showMuJaDaJaInfo, setShowMuJaDaJaInfo] = useState<{ title: string, description: string, enDescription?: string } | null>(null);
  const [showMuJaDaJaHelp, setShowMuJaDaJaHelp] = useState(false);
  const [isCycleVibeExpanded, setIsCycleVibeExpanded] = useState(false);
  const [showVibeTooltip, setShowVibeTooltip] = useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showVibeTooltip) {
      timer = setTimeout(() => setShowVibeTooltip(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [showVibeTooltip]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showDailyVibe, setShowDailyVibe] = useState(false);
  const [vibePhase, setVibePhase] = useState<'intro' | 'question' | 'analysis'>('intro');
  const [skipCycleVibeTyping, setSkipCycleVibeTyping] = useState(false);
  const [isQuestionPromptComplete, setIsQuestionPromptComplete] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [hasAskedAnotherQuestion, setHasAskedAnotherQuestion] = useState(false);

  // Local state for skipping text typing effects
  const [internalSkipTyping, setInternalSkipTyping] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('void_skip_typing') === 'true';
    }
    return skipTyping;
  });

  React.useEffect(() => {
    setInternalSkipTyping(skipTyping);
  }, [skipTyping]);

  const handleToggleSkipTyping = () => {
    const newVal = !internalSkipTyping;
    setInternalSkipTyping(newVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('void_skip_typing', String(newVal));
    }
  };
  
  // Romance specific states
  const [romanceStep, setRomanceStep] = useState<'marital' | 'children' | 'final'>('marital');
  const [maritalStatus, setMaritalStatus] = useState<string | null>(null);
  const [hasChildren, setHasChildren] = useState<boolean | null>(null);

  // Moving specific states
  const [movingStep, setMovingStep] = useState<'target' | 'context' | 'final'>('target');
  const [movingTarget, setMovingTarget] = useState<string | null>(null);
  const [movingContext, setMovingContext] = useState<string>(socialContext || 'none');
  
  const vibeContainerRef = React.useRef<HTMLDivElement>(null);
  const interactionsData = useMemo(() => {
    return {
      maritalStatus,
      hasChildren,
      movingType: movingTarget,
      movingContext: movingContext
    };
  }, [maritalStatus, hasChildren, movingTarget, movingContext]);

  const [showAllThemes, setShowAllThemes] = useState(false);

  const elementData = useMemo(() => {
    const defaultCounts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
    const counts = result.analysis?.elementRatios || defaultCounts;
    
    return [
      { name: lang === 'KO' ? '목(Wood)' : 'Wood', value: counts?.Wood || 0, color: ELEMENT_COLORS.Wood },
      { name: lang === 'KO' ? '화(Fire)' : 'Fire', value: counts?.Fire || 0, color: ELEMENT_COLORS.Fire },
      { name: lang === 'KO' ? '토(Earth)' : 'Earth', value: counts?.Earth || 0, color: ELEMENT_COLORS.Earth },
      { name: lang === 'KO' ? '금(Metal)' : 'Metal', value: counts?.Metal || 0, color: ELEMENT_COLORS.Metal },
      { name: lang === 'KO' ? '수(Water)' : 'Water', value: counts?.Water || 0, color: ELEMENT_COLORS.Water },
    ].filter(d => d.value > 0);
  }, [result.analysis?.elementRatios, lang]);

  const getAnalysisText = () => {
    if (!result.analysis) {
      const sorted = [...elementData].sort((a, b) => b.value - a.value);
      const dominant = sorted[0];
      const missing = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].filter(e => !elementData.find(d => d.name && d.name.includes(e)));
      
      if (lang === 'KO') {
        return `당신의 영혼 매트릭스는 ${dominant.name}의 기운이 지배적이야. 사이버네틱 코어에 각인된 이 강력한 에너지는 당신을 끊임없이 움직이게 하지만, ${missing.length > 0 ? missing.map(m => m === 'Wood' ? '목' : m === 'Fire' ? '화' : m === 'Earth' ? '토' : m === 'Metal' ? '금' : '수').join(', ') + '의 결핍이 시스템의 과부하를 초래할 수 있어.' : '모든 원소가 균형을 이루어 안정적인 출력을 자랑해.'} 충돌하는 기운을 제어하고 당신만의 네온 불빛을 밝혀봐.`;
      } else {
        return `Your soul matrix is dominated by the energy of ${dominant.name}. This powerful force engraved in your cybernetic core drives you relentlessly, but ${missing.length > 0 ? 'the lack of ' + missing.join(', ') + ' may cause system overloads.' : 'all elements are balanced, boasting stable output.'} Control the clashing energies and ignite your own neon lights.`;
      }
    }
    const { geJu, yongShen, structureDetail } = result.analysis;
    if (structureDetail) {
      if (lang === 'KO') {
        return `${structureDetail.title} (${structureDetail.category === 'Standard' ? '내격' : '종격'})으로 태어났어. ${structureDetail.marketingMessage} ${yongShen}을 삶의 핵심 에너지로 사용해.`;
      }
      return `Born with ${structureDetail.enTitle} (${structureDetail.category} Alignment). ${structureDetail.enMarketingMessage} Utilizing ${yongShen} as your primary cosmic driver.`;
    }
    if (lang === 'KO') {
      return `${geJu}으로 태어나 ${yongShen}을 삶의 핵심 에너지로 사용해.`;
    }
    const gejuInfo = BAZI_MAPPING.geju[geJu as keyof typeof BAZI_MAPPING.geju];
    const gejuEn = gejuInfo?.en || geJu;
    return `Born with ${gejuEn}, utilizing ${yongShen} as your primary cosmic driver.`;
  };

  const getYongshinName = (god: string) => {
    if (lang === 'KO') return god;
    const parts = god.split(/[,/]/).map(s => s.trim());
    return parts.map(p => {
      const yongshinMatch = BAZI_MAPPING.yongshin[p as keyof typeof BAZI_MAPPING.yongshin]?.en;
      if (yongshinMatch) return yongshinMatch;
      const tenGodMatch = BAZI_MAPPING.tenGods[p as keyof typeof BAZI_MAPPING.tenGods]?.en;
      if (tenGodMatch) return tenGodMatch;
      return p;
    }).join(', ');
  };

  const getStrengthLevel = (level: string) => {
    if (lang === 'KO') return level;
    return BAZI_MAPPING.strength[level as keyof typeof BAZI_MAPPING.strength]?.en || level;
  };

  const getGodElementInfo = (godCategory: string) => {
    const dayPillar = result.pillars.find(p => p.title === 'Day');
    if (!dayPillar) return null;
    
    const dayMaster = dayPillar.stem;
    const dmElement = BAZI_MAPPING.stems?.[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
    if (!dmElement) return null;

    const elementsOrder = ["Wood", "Fire", "Earth", "Metal", "Water"];
    const dmIdx = elementsOrder.indexOf(dmElement);
    
    const godOffsets: Record<string, number> = {
      "비겁": 0, "비견": 0, "겁재": 0,
      "식상": 1, "식신": 1, "상관": 1,
      "재성": 2, "편재": 2, "정재": 2,
      "관성": 3, "편관": 3, "정관": 3,
      "인성": 4, "편인": 4, "정인": 4,
    };

    const categories = godCategory.split(/[,/]/).map(s => s.trim());
    const results = categories.map(cat => {
      const offset = godOffsets[cat];
      if (offset === undefined) return null;

      const targetElement = elementsOrder[(dmIdx + offset) % 5];
      const stemsMap: Record<string, string[]> = {
        "Wood": ["甲", "乙"],
        "Fire": ["丙", "丁"],
        "Earth": ["戊", "己"],
        "Metal": ["庚", "辛"],
        "Water": ["壬", "癸"],
      };
      const stems = stemsMap[targetElement];

      const elementKo = BAZI_MAPPING.elements?.[targetElement as keyof typeof BAZI_MAPPING.elements]?.ko.split(' ')[0];
      const elementEn = targetElement;

      return {
        elementKo,
        elementEn,
        stems: stems || []
      };
    }).filter(r => r !== null) as { elementKo: string; elementEn: string; stems: string[] }[];

    if (results.length === 0) return null;

    return {
      elementKo: Array.from(new Set(results.map(r => r.elementKo))).join(', '),
      elementEn: Array.from(new Set(results.map(r => r.elementEn))).join(', '),
      stems: Array.from(new Set(results.flatMap(r => r.stems)))
    };
  };

  const renderYongshinWithElement = (god: string, isModal: boolean = false) => {
    const info = getGodElementInfo(god);
    const godName = getYongshinName(god);
    
    if (!info) return <span>{godName}</span>;

    const stemText = info.stems.map(s => {
      const stemInfo = BAZI_MAPPING.stems?.[s as keyof typeof BAZI_MAPPING.stems];
      return `${lang === 'KO' ? (stemInfo?.ko || s) : (stemInfo?.en || s)} (${s})`;
    }).join(' / ');

    const elementColor = ELEMENT_COLORS[info.elementEn as keyof typeof ELEMENT_COLORS] || '#FFFFFF';

    if (isModal) {
      return (
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm font-bold" style={{ color: elementColor }}>
            {lang === 'KO' ? `${info.elementKo} - ${stemText}` : `${info.elementEn} - ${stemText}`}
          </span>
          <span className="text-xs opacity-70">({godName})</span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center mt-1">
        <span 
          className="text-sm font-bold mb-0.5"
          style={{ color: elementColor }}
        >
          {lang === 'KO' ? `${info.elementKo} - ${stemText}` : `${info.elementEn} - ${stemText}`}
        </span>
        <span className="text-[10px] opacity-70">{godName}</span>
      </div>
    );
  };

  const getInteractionName = (type: string) => {
    const mapping = BAZI_MAPPING.interactions[type as keyof typeof BAZI_MAPPING.interactions];
    if (lang === 'KO') return mapping?.ko || type;
    return mapping?.en || type;
  };

  const getShinsalName = (name: string) => {
    const info = BAZI_MAPPING.shenSha[name as keyof typeof BAZI_MAPPING.shenSha];
    if (lang === 'KO') return info?.ko || name;
    return info?.en || name;
  };

  const getShinsalDesc = (name: string) => {
    const info = BAZI_MAPPING.shenSha[name as keyof typeof BAZI_MAPPING.shenSha];
    if (lang === 'KO') return info?.descKo || info?.desc || "";
    return info?.desc || "";
  };

  const getInteractionTooltip = (interaction: any) => {
    const { type, note } = interaction;
    
    if (note && note.includes('|')) {
      const [ko, en] = note.split('|');
      return {
        ko: ko,
        en: en
      };
    }

    const mapping = BAZI_MAPPING.interactions[type as keyof typeof BAZI_MAPPING.interactions];
    return {
      ko: mapping?.ko || type,
      en: mapping?.en || type
    };
  };

  const getVibeColor = (element: string) => {
    return ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
  };

  const renderTitle = () => {
    const isUnknown = result.isTimeUnknown;
    let mainTitle = t.title;
    if (isUnknown) {
      mainTitle = lang === 'KO' ? '삼주(三柱) 기반 요약 리포트' : 'Three-Pillar Summary Report';
    }

    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <div className="flex items-center text-3xl md:text-5xl font-gothic tracking-widest uppercase">
            <span className="text-white">{userName.toUpperCase()}</span>
            <span className="text-[0.7em] text-white/40 ml-2 self-end mb-1 md:mb-2">{lang === 'KO' ? '님의' : "'S"}</span>
          </div>
          <div className="inline-block relative">
            <h2 className={`font-gothic text-3xl md:text-5xl tracking-widest uppercase ${isUnknown ? 'neon-text-cyan' : 'neon-text-pink'}`}>
              {mainTitle}
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-1 rounded-full mt-1 ${isUnknown ? 'bg-neon-cyan shadow-[0_0_15px_#00F2FF]' : 'bg-neon-pink shadow-[0_0_15px_rgba(255,0,122,0.8)]'}`} 
            />
          </div>
        </div>
        
        {isUnknown && (
          <div className="flex flex-col items-center gap-2 mt-4 px-6 py-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-2xl max-w-md w-full">
            <div className="flex justify-between w-full text-xs font-bold font-mono tracking-widest text-neon-cyan">
              <span>{lang === 'KO' ? '분석 완성도' : 'Analysis Completeness'}</span>
              <span>75%</span>
            </div>
            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className="h-full bg-neon-cyan shadow-[0_0_10px_#00F2FF]"
              />
            </div>
            <p className="text-[10px] sm:text-xs text-white/60 text-center mt-1">
              {lang === 'KO' 
                ? '시주(시간)가 미반영된 삼주 기반 리포트입니다. 정확한 시간을 알면 100% 완성된 분석을 볼 수 있습니다.' 
                : 'This is a Three-Pillar report excluding birth time. Precise time provides a 100% complete analysis.'}
            </p>
          </div>
        )}
      </div>
    );
  };

    const formatName = (name: string) => {
      if (lang === 'KO') return name;
      return name.startsWith('The ') ? name.slice(4) : name;
    };

    const getDetailedTenGod = (dm: string, target: string) => {
      const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
      const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
      
      const dmIdx = stems.indexOf(dm);
      const targetIdx = stems.indexOf(target);
      
      if (dmIdx === -1 || targetIdx === -1) return { ko: '?', en: '?' };
      
      const dmElemIdx = Math.floor(dmIdx / 2);
      const targetElemIdx = Math.floor(targetIdx / 2);
      
      const diff = (targetElemIdx - dmElemIdx + 5) % 5;
      const samePolarity = (dmIdx % 2) === (targetIdx % 2);
      
      const tenGodsMap: Record<number, [string, string]> = {
        0: samePolarity ? ['비견', 'Mirror'] : ['겁재', 'Rival'],
        1: samePolarity ? ['식신', 'Artist'] : ['상관', 'Rebel'],
        2: samePolarity ? ['편재', 'Maverick'] : ['정재', 'Architect'],
        3: samePolarity ? ['편관', 'Warrior'] : ['정관', 'Judge'],
        4: samePolarity ? ['편인', 'Mystic'] : ['정인', 'Sage'],
      };
      
      const [ko, en] = tenGodsMap[diff] || ['?', '?'];
      return { ko, en };
    };

    const getTenGodColor = (name: string) => {
      return TEN_GOD_COLORS[name as keyof typeof TEN_GOD_COLORS] || 'var(--color-dm-text, #FFFFFF)';
    };

    const colorizeAdvancedAnalysis = (text: string) => {
      if (!text) return text;
      let colorized = text;
      
      const godToCategory: Record<string, string> = {
        '비견': '비겁', '겁재': '비겁', '비겁': '비겁',
        '식신': '식상', '상관': '식상', '식상': '식상',
        '편재': '재성', '정재': '재성', '재성': '재성',
        '편관': '관성', '정관': '관성', '관성': '관성',
        '편인': '인성', '정인': '인성', '인성': '인성'
      };
      
      Object.keys(godToCategory).forEach(god => {
        const category = godToCategory[god];
        const info = getGodElementInfo(category);
        if (info) {
          const color = ELEMENT_COLORS[info.elementEn as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
          const regex = new RegExp(god, 'g');
          colorized = colorized.replace(regex, `<span style="color: ${color}">${god}</span>`);
        }
      });
      
      return colorized;
    };

    const formatGod = (god: string, stemOrBranch: string) => {
      if (lang !== 'KO') return god;
      const base = god.substring(0, 2);
      const hanja = TEN_GODS_HANJA[base] || '';
      
      let element = '';
      if (BAZI_MAPPING.stems?.[stemOrBranch as keyof typeof BAZI_MAPPING.stems]) {
        element = BAZI_MAPPING.stems?.[stemOrBranch as keyof typeof BAZI_MAPPING.stems].element;
      } else if (BAZI_MAPPING.branches?.[stemOrBranch as keyof typeof BAZI_MAPPING.branches]) {
        element = BAZI_MAPPING.branches?.[stemOrBranch as keyof typeof BAZI_MAPPING.branches].element;
      }
      
      const color = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
      return `[${color}:${base}(${hanja})]`;
    };

  const cycleVibe = React.useMemo(() => {
    return generateCycleVibe(
      result, 
      lang, 
      userName, 
      gender, 
      city, 
      { maritalStatus, hasChildren, movingType: movingTarget, movingContext: movingContext }, 
      socialContext
    );
  }, [result, lang, userName, gender, city, maritalStatus, hasChildren, movingTarget, movingContext, socialContext]);

  const dailyVibe = React.useMemo(() => {
    const todayPillar = getTodayPillar(dayMaster);
    const tenGodsRatio = result.analysis?.tenGodsRatio || {};
    const missing = Object.entries(tenGodsRatio).filter(([_, r]) => r === 0).map(([k]) => k.split(' ')[0]);
    const overflow = Object.entries(tenGodsRatio).filter(([_, r]) => r > 30).map(([k]) => k.split(' ')[0]);

    const isSinGang = result.analysis?.shinGangShinYak?.title ? result.analysis.shinGangShinYak.title.includes('강') : false;
    const yongShin = result.analysis?.yongShen || '';
    const giShin = result.analysis?.yongshinDetail?.giShin?.element || '';
    
    const todayStemElement = BAZI_MAPPING.stems?.[todayPillar.stem as keyof typeof BAZI_MAPPING.stems]?.element || '';
    const todayBranchElement = BAZI_MAPPING.branches?.[todayPillar.branch as keyof typeof BAZI_MAPPING.branches]?.element || '';
    const todayStemElementKo = BAZI_MAPPING.elements?.[todayStemElement as keyof typeof BAZI_MAPPING.elements]?.ko || '';
    const todayBranchElementKo = BAZI_MAPPING.elements?.[todayBranchElement as keyof typeof BAZI_MAPPING.elements]?.ko || '';

    const dayBranch = result.pillars[1].branch;
    
    // 1. Yongshin/Gishin check
    let dailyLuckScore = 50;
    let isStemYongshin = yongShin.includes(todayStemElement) || (todayStemElementKo && yongShin.includes(todayStemElementKo));
    let isStemGishin = giShin.includes(todayStemElement) || (todayStemElementKo && giShin.includes(todayStemElementKo));
    let isBranchYongshin = yongShin.includes(todayBranchElement) || (todayBranchElementKo && yongShin.includes(todayBranchElementKo));
    
    if (isStemYongshin) dailyLuckScore += 15;
    if (isStemGishin) dailyLuckScore -= 15;
    if (isBranchYongshin) dailyLuckScore += 10;

    // 2. Clash with Day Pillar
    const hasDayClash = (
      (dayBranch === '子' && todayPillar.branch === '午') || (dayBranch === '午' && todayPillar.branch === '子') ||
      (dayBranch === '丑' && todayPillar.branch === '未') || (dayBranch === '未' && todayPillar.branch === '丑') ||
      (dayBranch === '寅' && todayPillar.branch === '申') || (dayBranch === '申' && todayPillar.branch === '寅') ||
      (dayBranch === '卯' && todayPillar.branch === '酉') || (dayBranch === '酉' && todayPillar.branch === '卯') ||
      (dayBranch === '辰' && todayPillar.branch === '戌') || (dayBranch === '戌' && todayPillar.branch === '辰') ||
      (dayBranch === '巳' && todayPillar.branch === '亥') || (dayBranch === '亥' && todayPillar.branch === '巳')
    );
    if (hasDayClash) dailyLuckScore -= 20;

    // 2.5 Samhap (Ban-hap) with Day Branch
    let samhapElement = '';
    if ((dayBranch === '寅' || dayBranch === '午' || dayBranch === '戌') && (todayPillar.branch === '寅' || todayPillar.branch === '午' || todayPillar.branch === '戌') && dayBranch !== todayPillar.branch) samhapElement = 'Fire';
    if ((dayBranch === '申' || dayBranch === '子' || dayBranch === '辰') && (todayPillar.branch === '申' || todayPillar.branch === '子' || todayPillar.branch === '辰') && dayBranch !== todayPillar.branch) samhapElement = 'Water';
    if ((dayBranch === '巳' || dayBranch === '酉' || dayBranch === '丑') && (todayPillar.branch === '巳' || todayPillar.branch === '酉' || todayPillar.branch === '丑') && dayBranch !== todayPillar.branch) samhapElement = 'Metal';
    if ((dayBranch === '亥' || dayBranch === '卯' || dayBranch === '未') && (todayPillar.branch === '亥' || todayPillar.branch === '卯' || todayPillar.branch === '未') && dayBranch !== todayPillar.branch) samhapElement = 'Wood';

    const isSamhapYongshin = samhapElement && (yongShin.includes(samhapElement) || (BAZI_MAPPING.elements?.[samhapElement as keyof typeof BAZI_MAPPING.elements]?.ko && yongShin.includes(BAZI_MAPPING.elements?.[samhapElement as keyof typeof BAZI_MAPPING.elements].ko)));
    const isSamhapGishin = samhapElement && (giShin.includes(samhapElement) || (BAZI_MAPPING.elements?.[samhapElement as keyof typeof BAZI_MAPPING.elements]?.ko && giShin.includes(BAZI_MAPPING.elements?.[samhapElement as keyof typeof BAZI_MAPPING.elements].ko)));

    if (isSamhapYongshin) dailyLuckScore += 15;
    if (isSamhapGishin) dailyLuckScore -= 15;

    // 3. Special Energy (수화기제)
    const isSuHwaGiJe = (todayPillar.stem === '壬' || todayPillar.stem === '癸') && (todayPillar.branch === '巳' || todayPillar.branch === '午');

    // 4. Time-based Fortune
    const currentHour = new Date().getHours();
    const hourBranch = currentHour >= 23 || currentHour < 1 ? '子' :
                       currentHour < 3 ? '丑' :
                       currentHour < 5 ? '寅' :
                       currentHour < 7 ? '卯' :
                       currentHour < 9 ? '辰' :
                       currentHour < 11 ? '巳' :
                       currentHour < 13 ? '午' :
                       currentHour < 15 ? '未' :
                       currentHour < 17 ? '申' :
                       currentHour < 19 ? '酉' :
                       currentHour < 21 ? '戌' : '亥';
    const hourElement = BAZI_MAPPING.branches?.[hourBranch as keyof typeof BAZI_MAPPING.branches]?.element;
    const dmElement = BAZI_MAPPING.stems?.[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
    
    const ELEMENT_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIndex = ELEMENT_CYCLE.indexOf(dmElement);
    const generatesDm = ELEMENT_CYCLE[(dmIndex + 4) % 5];
    const sameAsDm = dmElement;
    const wealth = ELEMENT_CYCLE[(dmIndex + 2) % 5];
    const controlsDm = ELEMENT_CYCLE[(dmIndex + 3) % 5];
    const drainsDm = ELEMENT_CYCLE[(dmIndex + 1) % 5];

    const isSaengBiJae = hourElement === generatesDm || hourElement === sameAsDm || hourElement === wealth;
    const isGeukSeol = hourElement === controlsDm || hourElement === drainsDm;

    if (isSaengBiJae) dailyLuckScore += 10;
    if (isGeukSeol) dailyLuckScore -= 10;

    const stemGod = (lang === 'KO' ? todayPillar.stemTenGodKo : todayPillar.stemTenGodEn) || '';
    const branchGod = (lang === 'KO' ? todayPillar.branchTenGodKo : todayPillar.branchTenGodEn) || '';
    const stemColor = getVibeColor(STEM_ELEMENTS[todayPillar.stem as keyof typeof STEM_ELEMENTS]);
    const branchColor = getVibeColor(BRANCH_ELEMENTS[todayPillar.branch as keyof typeof BRANCH_ELEMENTS]);

    // Name Processing
    let processedName = userName;
    if (lang === 'KO' && userName.length === 3) {
      processedName = userName.substring(1);
    } else if (lang === 'EN' && userName.includes(' ')) {
      processedName = userName.split(' ')[0];
    }

    const address = (() => {
      if (gender === 'prefer-not-to-tell') return '';
      if (lang === 'KO') {
        if (gender === 'female') return '언니';
        if (gender === 'male') return '친구';
        if (gender === 'non-binary') return '자기';
        return '';
      } else {
        if (gender === 'female') return 'sis';
        if (gender === 'male') return 'bro';
        if (gender === 'non-binary') return 'friend';
        return '';
      }
    })();

    const userRef = (() => {
      if (gender === 'prefer-not-to-tell') return lang === 'KO' ? '너' : 'you';
      if (lang === 'KO') {
        if (gender === 'female') return '언니';
        if (gender === 'male') return '친구';
        if (gender === 'non-binary') return '자기';
        return '너';
      } else {
        if (gender === 'female') return 'girl';
        if (gender === 'male') return 'guy';
        if (gender === 'non-binary') return 'star';
        return 'you';
      }
    })();

    const ganYeoComment = getGanYeoJiDong(todayPillar.stem, todayPillar.branch) ? (lang === 'KO' ? ' 오, 위아래로 같은 기운이 꽉 찼네? 에너지가 아주 선명해.' : ' Oh, the same energy is packed top to bottom. Very vivid.') : '';

    let main = '';
    if (lang === 'KO') {
      const stemKo = BAZI_MAPPING.stems?.[todayPillar.stem as keyof typeof BAZI_MAPPING.stems]?.ko;
      const branchKo = BAZI_MAPPING.branches?.[todayPillar.branch as keyof typeof BAZI_MAPPING.branches]?.ko;
      
      main = `오늘의 에너지는 [${stemColor}:${stemKo},${branchKo}(${todayPillar.stem}${todayPillar.branch})] 바이브야!${ganYeoComment} ${processedName} ${address}한테는 ${formatGod(todayPillar.stemTenGodKo, todayPillar.stem)}이랑 ${formatGod(todayPillar.branchTenGodKo, todayPillar.branch)}의 기운으로 들어오네. \n\n`;

      // 1. Base Fortune & Clash
      if (hasDayClash) {
        main += `오늘은 일지(내 안방/환경)와 충(沖)을 일으키는 날이라 전반적인 베이스 운이 좀 불안정해. 예기치 않은 부딪힘이나 변화가 생길 수 있으니 마음의 여유를 가져. `;
      } else if (dailyLuckScore >= 70) {
        main += `전체적인 베이스 운이 아주 긍정적이야! 우주가 네 편이 되어주는 느낌일 거야. `;
      } else if (dailyLuckScore <= 30) {
        main += `전반적인 베이스 운이 다소 무겁게 가라앉아 있어. 무리하지 말고 방어적으로 하루를 보내는 게 좋아. `;
      } else {
        main += `전체적으로 무난하고 평온한 베이스 운을 띠고 있어. `;
      }

      // 2. Stem (Mind) vs Branch (Reality)
      main += `\n\n${lang === 'KO' ? '그럼 이제 정신과 현실의 분리를 볼까?' : "Shall we look at the separation of mind and reality?"}\n`;
      if (isStemYongshin) {
        main += `오늘 천간(정신)의 기운이 네게 희신(좋은 기운)으로 작용해. 스트레스가 풀리고 심리적으로 아주 맑고 긍정적인 기분을 느낄 수 있어. `;
      } else if (isStemGishin) {
        main += `오늘 천간(정신)의 기운이 구신(나쁜 기운)으로 작용해. 괜한 강박이나 스트레스, 우울감이 몰려올 수 있으니 마인드 컨트롤이 필수야. `;
      } else {
        main += `심리적인 상태는 크게 요동치지 않고 평온할 거야. `;
      }

      if (samhapElement) {
        if (isSamhapYongshin) {
          main += `\n또한, 지지(현실)에서 합이 일어나 네게 유리한 용신 기운(${BAZI_MAPPING.elements?.[samhapElement as keyof typeof BAZI_MAPPING.elements]?.ko})을 만들어내고 있어. 현실에서 일어나는 사건과 결과가 너에게 아주 유리하게 돌아갈 확률이 높아! `;
        } else if (isSamhapGishin) {
          main += `\n하지만 지지(현실)에서 합이 일어나 네게 불리한 기운(${BAZI_MAPPING.elements?.[samhapElement as keyof typeof BAZI_MAPPING.elements]?.ko})을 형성하고 있어. 현실적인 결과나 사건이 네 의도와 다르게 꼬일 수 있으니 주의가 필요해. `;
        } else {
          main += `\n지지(현실)에서 합이 일어나 새로운 기운(${BAZI_MAPPING.elements?.[samhapElement as keyof typeof BAZI_MAPPING.elements]?.ko})을 만들고 있어. 주변 환경이나 상황에 흥미로운 변화가 생길 수 있겠네. `;
        }
      }

      // 3. Special Energy
      if (isSuHwaGiJe) {
        main += `\n\n[특수 기운: 수화기제]\n오늘은 수(水)와 화(火)가 만나는 '수화기제'의 날이야. 일이 완벽히 끝나는 건 아니지만, 막혔던 일이 일단락되고 매듭지어지며 다음 스텝을 도모할 수 있는 중요한 전환점이 될 거야.`;
      }
    } else {
      // English version
      main = `Today's vibe is [${stemColor}:${todayPillar.stem},${todayPillar.branch}]!${ganYeoComment} For you, it's [${stemColor}:${stemGod}] and [${branchColor}:${branchGod}]. \n\n`;

      if (hasDayClash) {
        main += `Today clashes with your Day Branch (your environment), making the base fortune unstable. Expect unexpected bumps or changes, so keep an open mind. `;
      } else if (dailyLuckScore >= 70) {
        main += `The overall base fortune is very positive! You'll feel like the universe is on your side. `;
      } else if (dailyLuckScore <= 30) {
        main += `The overall base fortune is quite heavy. It's better to spend the day defensively without overdoing it. `;
      } else {
        main += `The overall base fortune is smooth and peaceful. `;
      }

      main += `\n\nShall we look at the separation of mind and reality?\n`;
      if (isStemYongshin) {
        main += `Today's Heavenly Stem (mind) acts as a favorable energy. Stress will relieve, and you'll feel psychologically clear and positive. `;
      } else if (isStemGishin) {
        main += `Today's Heavenly Stem (mind) acts as an unfavorable energy. Unnecessary obsessions, stress, or gloominess might rush in, so mind control is essential. `;
      } else {
        main += `Your psychological state will be calm without major fluctuations. `;
      }

      if (samhapElement) {
        if (isSamhapYongshin) {
          main += `\nAlso, a combination in the Earthly Branches (reality) is creating a favorable energy (${BAZI_MAPPING.elements?.[samhapElement as keyof typeof BAZI_MAPPING.elements]?.en}) for you. The events and results in reality are highly likely to turn out in your favor! `;
        } else if (isSamhapGishin) {
          main += `\nHowever, a combination in the Earthly Branches (reality) is forming an unfavorable energy (${BAZI_MAPPING.elements?.[samhapElement as keyof typeof BAZI_MAPPING.elements]?.en}) for you. Practical results or events might get tangled differently from your intentions, so be careful. `;
        } else {
          main += `\nA combination in the Earthly Branches (reality) is creating a new energy (${BAZI_MAPPING.elements?.[samhapElement as keyof typeof BAZI_MAPPING.elements]?.en}). You might see some interesting changes in your surroundings or situations. `;
        }
      }

      if (isSuHwaGiJe) {
        main += `\n\n[Special Energy: Water-Fire Equilibrium]\nToday is a day where Water and Fire meet. Things might not finish perfectly, but blocked issues will be wrapped up, marking an important turning point for your next step.`;
      }
    }

    // 4. 10 Gods Filtering & Over-saturation Check
    main += `\n\n${lang === 'KO' ? '오늘은...' : "Today..."}\n`;
    
    const isOverloaded = overflow.some(o => stemGod.includes(o));
    
    if (isOverloaded) {
      if (lang === 'KO') {
        main += `오, 그런데 ${stemGod}의 기운이 이미 네 사주에 넘치고 있어! 오늘은 이 기운이 과해지면서 오히려 고집이 세지거나, 생각이 너무 많아져서 행동이 굼떠질 수 있으니 주의가 필요해. 객관성을 잃지 않도록 조심해.`;
      } else {
        main += `Oh, but the energy of ${stemGod} is already overflowing in your chart! Today, this energy might become excessive, making you stubborn or causing analysis paralysis. Be careful not to lose objectivity.`;
      }
    } else {
      if (lang === 'KO') {
        if (stemGod.includes('비견') || stemGod.includes('겁재')) {
          main += `비견/겁재일: 재성(돈)을 극하는 날이라 지출이 생기거나 남에게 뺏길 확률이 높아. 대신 경쟁심과 욕심이 생기고 두려움이 없어지며(겁상실), 동등한 위치의 친구나 사람을 많이 만나게 될 거야.`;
        } else if (stemGod.includes('식신') || stemGod.includes('상관')) {
          main += `식신/상관일: 말문이 트이고 아이디어나 표현력이 강하게 발휘되는 날이야. 단, 다른 기운에 의해 막히면 오히려 답답해지고 혀가 꼬일 수 있으니 상황을 잘 살펴.`;
        } else if (stemGod.includes('정인')) {
          main += `정인일: 남들에게 정직하게 인정받고 싶어 하는 날이야. 엄마의 보살핌처럼 안정적이고 편안함을 느끼며, 누군가에게 밥을 얻어먹는 등 소소한 이득이 생길 수 있어.`;
        } else if (stemGod.includes('편인')) {
          main += `편인일: 긍정적인 생각보다 부정적인 생각과 의심, 잦은 실수가 유발되기 쉬워. 특히 식신(즐거움)을 극하는 '도식' 작용이 일어나 몸에 힘이 빠지고 만사가 귀찮아질 수 있으니 억지로라도 텐션을 올려봐.`;
        } else if (stemGod.includes('편관')) {
          main += `편관일: 무언가를 기필코 해내야겠다는 강한 의지와 목표 의식이 생겨. 하지만 이로 인해 정도를 벗어나거나 초조함, 강박을 심하게 느낄 수 있으니 릴렉스하는 게 중요해.`;
        } else if (stemGod.includes('정관')) {
          main += `정관일: 원칙과 규칙을 지키며 안정감을 느끼는 날이야. 명예나 직장운이 상승하고 바른 생활을 추구하게 돼.`;
        } else if (stemGod.includes('정재') || stemGod.includes('편재')) {
          main += `재성일: 현실 감각이 뛰어나고 결과물에 집중하는 날이야. 금전적인 흐름이 활발해지거나 이성과의 만남이 있을 수 있어.`;
        }
      } else {
        if (stemGod.includes('Mirror') || stemGod.includes('Rival')) {
          main += `Mirror/Rival Day: High chance of spending money or losing it. Instead, you'll feel competitive, fearless, and meet many friends or equals.`;
        } else if (stemGod.includes('Artist') || stemGod.includes('Rebel')) {
          main += `Artist/Rebel Day: You'll be talkative, and your ideas and expression will shine. But if blocked by other energies, you might feel frustrated and tongue-tied.`;
        } else if (stemGod.includes('Sage')) {
          main += `Proper Sage Day: You want honest recognition. You'll feel stable and comfortable like a mother's care, and might get small benefits like free meals.`;
        } else if (stemGod.includes('Mystic')) {
          main += `Mystic Day: Prone to negative thoughts, doubts, and frequent mistakes. Energy drains and you might feel lazy, so try to force your tension up.`;
        } else if (stemGod.includes('Strong Warrior')) {
          main += `Strong Warrior Day: Strong will and goal-oriented. However, this might cause you to deviate from the standard or feel severe anxiety and obsession. Relax.`;
        } else if (stemGod.includes('Proper Warrior')) {
          main += `Proper Warrior Day: A day of feeling stable by keeping rules. Honor or career luck rises, pursuing a righteous life.`;
        } else if (stemGod.includes('Maverick') || stemGod.includes('Architect')) {
          main += `Wealth Day: Excellent sense of reality, focusing on results. Financial flow becomes active, or you might meet potential partners.`;
        }
      }
    }

    // 5. Time-based Fortune
    if (lang === 'KO') {
      main += `\n\n마지막으로 지금 이 시간은..\n네가 이 운세를 확인하는 지금 이 시간(${currentHour}시), `;
      if (isSaengBiJae) {
        main += `시간의 기운이 너를 도와주는 '생비재'에 해당해! 지금 마주한 사건의 결과나 타이밍이 아주 긍정적(길)으로 흘러갈 확률이 높아. 멋진 기회를 꼭 잡아봐!`;
      } else if (isGeukSeol) {
        main += `시간의 기운이 너의 힘을 빼는 '극설'에 해당해. 지금은 섣불리 움직이면 손해나 어려움을 겪을 수 있으니(흉), 방어적인 태도를 취하는 게 안전해.`;
      } else {
        main += `시간의 기운이 중립적이야. 네 의지대로 상황을 이끌어갈 수 있어.`;
      }
    } else {
      main += `\n\nLastly, at this moment...\nAt this time (${currentHour}:00) when you check this fortune, `;
      if (isSaengBiJae) {
        main += `the time energy supports you! The outcome or timing of current events is highly likely to be positive. Grab the chance!`;
      } else if (isGeukSeol) {
        main += `the time energy drains you. Moving hastily now might lead to loss or difficulty, so take a defensive stance.`;
      } else {
        main += `the time energy is neutral. You can lead the situation with your will.`;
      }
    }

    return main;
  }, [dayMaster, result, lang, userName, gender]);

  const handleShowDailyVibe = () => {
    setShowDailyVibe(true);
  };

  const getLifeStage = (age: number) => {
    const stages = t.lifeStages;
    if (age < 20) return stages.childhood;
    if (age < 40) return stages.youth;
    if (age < 60) return stages.maturity;
    return stages.legacy;
  };

  const PolarityIcon = ({ polarity, size = 10 }: { polarity: number, size?: number }) => {
    if (polarity === 1) return <Sun size={size} className="text-yellow-400" />;
    return <Moon size={size} className="text-blue-300" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 py-4 sm:py-12 space-y-8 sm:space-y-12 bazi-result-root">
      <div className="text-center">
        {renderTitle()}
      </div>

      {/* Character Commentary */}
      <motion.div 
        ref={vibeContainerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`goth-glass p-6 rounded-2xl border-l-4 border-neon-pink flex flex-col ${hasAskedAnotherQuestion ? 'gap-1 sm:gap-2' : 'gap-5'}`}
      >
        {/* Header Row - Optimized for single-line horizontal layout to save vertical space */}
        <div className="flex flex-row items-center justify-between gap-1 sm:gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 max-w-[40%] sm:max-w-none">
            <div 
              className="bg-neon-pink/20 p-1.5 sm:p-2.5 rounded-full shrink-0 cursor-pointer hover:bg-neon-pink/30 transition-all flex items-center justify-center shadow-[0_0_10px_rgba(255,20,147,0.25)]"
              onClick={() => { !isCycleVibeExpanded && setIsCycleVibeExpanded(true); setShowVibeTooltip(false); }}
            >
              <Play className="w-3 h-3 sm:w-4 sm:h-4 text-neon-pink" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-display font-bold text-white/70 uppercase tracking-widest truncate">{t.seasonVibe}</span>
          </div>
          
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 min-w-0 flex-1">
            <span className="text-[7.5px] sm:text-[10px] text-white/40 italic truncate pr-0.5 sm:pr-1 min-w-0 text-right w-full">
              {t.seasonVibeDisclaimer}
            </span>
            
            {/* SKIP Switch for overall text typing animation */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSkipTyping();
              }}
              className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border text-[7.5px] sm:text-[9px] font-bold tracking-widest transition-all shrink-0 ${
                internalSkipTyping
                  ? 'border-neon-pink text-neon-pink bg-neon-pink/5 shadow-[0_0_8px_rgba(255,0,122,0.25)]'
                  : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 bg-white/5'
              }`}
              title={lang === 'KO' ? '텍스트 연출 스킵 켜기/끄기' : 'Toggle Fast skipping'}
            >
              <Zap className={`w-2 h-2 sm:w-2.5 sm:h-2.5 ${internalSkipTyping ? 'text-neon-pink animate-pulse' : 'text-white/40'}`} />
              <span className="hidden sm:inline">{internalSkipTyping ? 'SKIP ON' : 'SKIP OFF'}</span>
              <span className="inline sm:hidden">{internalSkipTyping ? 'ON' : 'OFF'}</span>
            </button>

            <button 
              onClick={() => { setIsCycleVibeExpanded(!isCycleVibeExpanded); setShowVibeTooltip(false); }}
              className="text-[10px] font-bold text-neon-pink/60 hover:text-neon-pink transition-colors flex items-center shrink-0"
            >
              <span className="hidden sm:inline mr-1 tracking-widest uppercase">{isCycleVibeExpanded ? (lang === 'KO' ? '접기' : 'COLLAPSE') : (lang === 'KO' ? '펼치기' : 'EXPAND')}</span>
              {isCycleVibeExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div className="relative">
              {!isCycleVibeExpanded ? (
                <div className="cursor-pointer relative inline-block mt-2" onClick={() => { setIsCycleVibeExpanded(true); setShowVibeTooltip(false); }}>
                  {/* Tooltip */}
                  <AnimatePresence>
                    {showVibeTooltip && (
                       <motion.div
                         initial={{ opacity: 0, y: 15, scale: 0.8 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
                         exit={{ opacity: 0, scale: 0.9 }}
                         className="absolute -top-10 -right-4 sm:-top-8 sm:-right-4 bg-neon-pink text-black font-bold text-[10px] sm:text-[11px] px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(255,0,255,0.6)] z-10 whitespace-nowrap pointer-events-none"
                       >
                         {lang === 'KO' ? '가장 먼저 운세부터 확인해볼까?' : 'Shall we check your fortune first?'}
                         <div className="absolute top-full right-6 sm:right-8 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-neon-pink"></div>
                       </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="text-sm sm:text-[15px] font-display italic font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse leading-relaxed transition-colors cycle-vibe-preview-text">
                    <TypingText 
                           key="short-vibe-preview" 
                           text={lang === 'KO' 
                             ? `요번 ${new Date().getFullYear()}년도의 너의 행운은 어떨 것 같아? 시험 해 볼까? (클릭해서 나의 운세 알아보기)` 
                             : `What do you think your luck for ${new Date().getFullYear()} will be? Click to test it!`}
                           speed={40} 
                           lang={lang}
                           skip={internalSkipTyping}
                           onComplete={() => setShowVibeTooltip(true)}
                         />
                  </p>
                </div>
              ) : (
                <div className={!hasAskedAnotherQuestion ? "flex flex-col gap-6" : "flex flex-col mt-[-10px] sm:mt-[-15px]"}>
                  {vibePhase === 'intro' && !hasAskedAnotherQuestion && (
                    <div className="relative">
                      <p className="text-sm sm:text-base font-display italic text-white leading-relaxed whitespace-pre-wrap">
                        <TypingText 
                          key="vibe-intro" 
                          text={cycleVibe.intro} 
                          speed={20} 
                          lang={lang}
                          skip={skipCycleVibeTyping || internalSkipTyping}
                          onComplete={() => setVibePhase('question')}
                        />
                      </p>
                      {!skipCycleVibeTyping && !internalSkipTyping && (
                        <div className="flex justify-end mt-2">
                          <button onClick={() => setSkipCycleVibeTyping(true)} className="text-xs text-white/40 hover:text-white/80 bg-black/50 px-2 py-1 rounded">
                            SKIP ▹▹
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {vibePhase === 'question' && !hasAskedAnotherQuestion && (
                    <p className="text-sm sm:text-base font-display italic text-white leading-relaxed whitespace-pre-wrap mt-0">
                      <ParsedText lang={lang} text={cycleVibe.intro} />
                    </p>
                  )}

                  {vibePhase === 'question' && (
                    <div className="space-y-4 relative">
                      <p className="text-sm sm:text-base font-display italic text-neon-pink leading-relaxed whitespace-pre-wrap">
                        <TypingText 
                          key="vibe-questionPrompt" 
                          text={hasAskedAnotherQuestion ? cycleVibe.questionPrompt.replace(/\[delay:\d+\]/, '').replace(/^\s+/, '').trimStart() : cycleVibe.questionPrompt} 
                          speed={20} 
                          lang={lang}
                          skip={skipCycleVibeTyping || internalSkipTyping}
                          onComplete={() => setIsQuestionPromptComplete(true)}
                        />
                      </p>
                      {!isQuestionPromptComplete && !skipCycleVibeTyping && !internalSkipTyping && (
                        <div className="flex justify-end mt-2">
                          <button onClick={() => setSkipCycleVibeTyping(true)} className="text-xs text-white/40 hover:text-white/80 bg-black/50 px-2 py-1 rounded">
                            SKIP ▹▹
                          </button>
                        </div>
                      )}
                      
                      <AnimatePresence>
                        {isQuestionPromptComplete && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
                          >
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                setSelectedThemeId('daily_vibe');
                                setVibePhase('analysis');
                                handleShowDailyVibe();
                                setTimeout(() => {
                                  vibeContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 50);
                              }}
                              className="p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-left transition-all group"
                            >
                              <div className="text-neon-pink text-xs font-bold mb-1 uppercase tracking-widest">{lang === 'KO' ? '[오늘의 운세]' : '[TODAY\'S FORTUNE]'}</div>
                              <div className="text-white/80 text-sm leading-snug group-hover:text-white">{lang === 'KO' ? '오늘 하루는 내게 어떤 기운일까? 운세를 봐줘!' : 'How is today\'s vibe? Tell me my fortune!'}</div>
                            </motion.button>

                            {(showAllThemes ? cycleVibe.themes : cycleVibe.themes.slice(0, 1)).map((theme) => (
                              <motion.button
                                key={theme.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  setSelectedThemeId(theme.id);
                                  if (theme.id === 'romance' || theme.id === 'secrets') {
                                    setRomanceStep('marital');
                                  } else {
                                    setRomanceStep('final');
                                  }
                                  if (theme.id === 'moving') {
                                    setMovingStep('target');
                                  } else {
                                    setMovingStep('final');
                                  }
                                  setVibePhase('analysis');
                                  setTimeout(() => {
                                    vibeContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                  }, 50);
                                }}
                                className="p-4 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-left transition-all group"
                              >
                                <div className="text-neon-pink text-xs font-bold mb-1 uppercase tracking-widest">{theme.title}</div>
                                <div className="text-white/80 text-sm leading-snug group-hover:text-white">{theme.question}</div>
                              </motion.button>
                            ))}
                            
                            {!showAllThemes && cycleVibe.themes.length > 1 && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowAllThemes(true)}
                                className="p-4 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all group"
                              >
                                <div className="w-8 h-8 rounded-full bg-neon-pink/20 flex items-center justify-center group-hover:bg-neon-pink/30 transition-colors">
                                  <span className="text-neon-pink text-xl font-bold">+</span>
                                </div>
                                <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest group-hover:text-white/60">
                                  {lang === 'KO' ? '더 많은 질문 보기' : 'SEE MORE QUESTIONS'}
                                </div>
                              </motion.button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {vibePhase === 'analysis' && selectedThemeId && (
                    <div className="space-y-4 sm:space-y-6">
                      {selectedThemeId === 'daily_vibe' ? (
                        <div className="p-4 sm:p-6 bg-black/40 rounded-2xl border border-neon-pink/30 relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-neon-pink" />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
                              <h4 className="text-neon-pink font-display font-bold flex items-center space-x-2">
                                <Sparkles className="w-5 h-5" />
                                <span>{lang === 'KO' ? 'TODAY\'S VIBE' : 'TODAY\'S VIBE'}</span>
                              </h4>
                            </div>
                            <div className="flex items-center justify-end gap-4">
                              <WeatherWidget city={city} lang={lang} />
                            </div>
                          </div>
                          <p className="text-sm sm:text-base font-display italic text-white/90 leading-relaxed whitespace-pre-wrap">
                            <TypingText key="daily-vibe" text={dailyVibe} speed={20} lang={lang} skip={internalSkipTyping} />
                          </p>
                        </div>
                      ) : selectedThemeId === 'psych_test' ? (
                        <div className="w-full">
                           <PersonaTestSection 
                             userName={userName}
                             ilju={result.pillars[1] ? `${result.pillars[1].stem}${result.pillars[1].branch}` : '壬申'}
                             baziResult={result}
                             lang={lang}
                             onComplete={() => {
                               setSelectedThemeId(null);

                               setVibePhase('question');
                             }}
                           />
                        </div>
                      ) : (selectedThemeId === 'romance' || selectedThemeId === 'secrets') && romanceStep !== 'final' ? (
                        <div className="p-4 sm:p-6 bg-neon-pink/10 border border-neon-pink/30 rounded-2xl space-y-4 sm:space-y-6">
                          {romanceStep === 'marital' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                              <p className="text-sm sm:text-base font-display italic text-white">
                                {result.currentYearPillar?.age < 30 ? (lang === 'KO' ? '아직 자기는 어리긴 하지만 혹시 몰라서 물어볼게. ' : 'You are still young, but just in case. ') : ''}
                                {lang === 'KO' ? '먼저 자기, 혹시 결혼은 했어?' : 'First, are you married?'}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { ko: '미혼', en: 'Single' },
                                  { ko: '기혼', en: 'Married' },
                                  { ko: '돌싱', en: 'Single Again' }
                                ].map((status) => (
                                  <button
                                    key={status.ko}
                                    onClick={() => {
                                      setMaritalStatus(status.ko);
                                      setRomanceStep('children');
                                    }}
                                    className="px-4 sm:px-6 py-2 bg-white/10 hover:bg-neon-pink/20 border border-white/20 rounded-full text-sm text-white transition-all"
                                  >
                                    {lang === 'KO' ? status.ko : status.en}
                                  </button>
                                ))}
                                <button
                                  onClick={() => {
                                    setMaritalStatus('비공개');
                                    setRomanceStep('children');
                                  }}
                                  className="px-4 sm:px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-white/60 transition-all"
                                >
                                  {lang === 'KO' ? '말하기 싫어' : 'Prefer not to say'}
                                </button>
                              </div>
                            </motion.div>
                          )}
                          
                          {romanceStep === 'children' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                              <p className="text-sm sm:text-base font-display italic text-white">
                                {lang === 'KO' ? '그럼 자녀는 있어?' : 'Do you have children?'}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setHasChildren(true);
                                    setRomanceStep('final');
                                  }}
                                  className="px-4 sm:px-6 py-2 bg-white/10 hover:bg-neon-pink/20 border border-white/20 rounded-full text-sm text-white transition-all"
                                >
                                  {lang === 'KO' ? '응, 있어' : 'Yes, I do'}
                                </button>
                                <button
                                  onClick={() => {
                                    setHasChildren(false);
                                    setRomanceStep('final');
                                  }}
                                  className="px-4 sm:px-6 py-2 bg-white/10 hover:bg-neon-pink/20 border border-white/20 rounded-full text-sm text-white transition-all"
                                >
                                  {lang === 'KO' ? '아니, 없어' : 'No, I don\'t'}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ) : selectedThemeId === 'moving' && movingStep !== 'final' ? (
                        <div className="p-4 sm:p-6 bg-neon-pink/10 border border-neon-pink/30 rounded-2xl space-y-4 sm:space-y-6">
                          {movingStep === 'target' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                              <p className="text-sm sm:text-base font-display italic text-white">
                                {lang === 'KO' ? '이동하는 운에 관해서 답변 해줄게. 구체적으로 어떤 이동을 고민하고 있어?' : 'Tell me what kind of movement you are planning?'}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'job_change', ko: '이직 / 퇴사', en: 'Job Change / Resignation' },
                                  { id: 'transfer', ko: '부서이동 / 전출 / 파견', en: 'Transfer / Dispatch' },
                                  { id: 'moving_house', ko: '이사 / 거주지 이동', en: 'Moving House' }
                                ].map((choice) => (
                                  <button
                                    key={choice.id}
                                    onClick={() => {
                                      setMovingTarget(choice.id);
                                      if (choice.id === 'moving_house') {
                                        setMovingContext('none');
                                        setMovingStep('final');
                                      } else if (socialContext && socialContext !== 'none') {
                                        setMovingContext(socialContext);
                                        setMovingStep('final');
                                      } else {
                                        setMovingStep('context');
                                      }
                                    }}
                                    className="px-4 sm:px-6 py-2 bg-white/10 hover:bg-neon-pink/20 border border-white/20 rounded-full text-sm text-white transition-all"
                                  >
                                    {lang === 'KO' ? choice.ko : choice.en}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                          {movingStep === 'context' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                              <p className="text-sm sm:text-base font-display italic text-white">
                                {lang === 'KO' ? '보다 정확한 전술을 위해, 혹시 현재 소속된 직군이나 환경이 어떻게 돼?' : 'For a more accurate tactic, what is your current social context?'}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'military_public', ko: '군인 / 경찰 / 공무원', en: 'Military/Public Service' },
                                  { id: 'corporate', ko: '일반 직장인', en: 'Corporate Employee' },
                                  { id: 'business_freelance', ko: '사업 / 프리랜서', en: 'Business/Freelance' },
                                  { id: 'professional_it', ko: '전문직 / IT', en: 'Professional/IT' },
                                  { id: 'education', ko: '교육 / 교직', en: 'Education/Teaching' },
                                  { id: 'arts_creative', ko: '예술 / 창작', en: 'Arts/Creative' },
                                  { id: 'student', ko: '학생 / 취업준비', en: 'Student/Job Seeker' },
                                  { id: 'none', ko: '기타 (해당 없음)', en: 'Other' },
                                ].map((choice) => (
                                  <button
                                    key={choice.id}
                                    onClick={() => {
                                      setMovingContext(choice.id);
                                      setMovingStep('final');
                                    }}
                                    className="px-4 sm:px-6 py-2 bg-white/10 hover:bg-neon-pink/20 border border-white/20 rounded-full text-sm text-white transition-all"
                                  >
                                    {lang === 'KO' ? choice.ko : choice.en}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <div 
                          className="p-4 sm:p-6 border rounded-xl relative overflow-hidden ilju-theme-block"
                          style={{
                            backgroundColor: 'rgba(255, 42, 133, 0.1)',
                            borderColor: 'rgba(255, 42, 133, 0.3)',
                            backgroundImage: (() => {
                              const ilju = result.pillars[1].stem + result.pillars[1].branch;
                              const img = ILJU_BACKGROUND_IMAGES[ilju];
                              return img ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${img.base})` : 'none';
                            })(),
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="text-neon-pink text-[10px] sm:text-xs font-bold mb-2 uppercase tracking-widest">
                            {cycleVibe.themes.find(t => t.id === selectedThemeId)?.title || '[운명의 대답]'}
                          </div>
                          {(() => {
                            const mainText = cycleVibe.themeAnalyses[selectedThemeId].main;
                            let parsedJson = null;
                            try {
                              if (mainText.startsWith('{') && ['moving', 'taboo', 'dark_curtain', 'destiny_map', 'soul_intersection'].includes(selectedThemeId)) {
                                parsedJson = JSON.parse(mainText);
                              }
                            } catch (e) {}

                            if (parsedJson && parsedJson.theme) {
                              let gradeColor = 'text-[#facc15]';
                              let gradeBorder = 'border-[#facc15]/30';
                              let gradeBg = 'bg-[#facc15]/10';

                              if (parsedJson.grade === 'A') {
                                gradeColor = 'text-green-400';
                                gradeBorder = 'border-green-400/30';
                                gradeBg = 'bg-green-400/10';
                              } else if (parsedJson.grade === 'C') {
                                gradeColor = 'text-red-400';
                                gradeBorder = 'border-red-400/30';
                                gradeBg = 'bg-red-400/10';
                              }

                              if (selectedThemeId === 'moving') {
                                return (
                                  <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                                    className="space-y-4"
                                  >
                                    <div className="flex items-center gap-3 mb-4">
                                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">[{parsedJson.theme}: 모빌리티 리포트]</h3>
                                      {parsedJson.grade && (
                                        <span className={`px-2 py-0.5 border rounded text-xs font-bold ${gradeColor} ${gradeBorder} ${gradeBg}`}>
                                          Grade {parsedJson.grade}
                                        </span>
                                      )}
                                    </div>
                                    <div className="space-y-3">
                                      <div className="text-sm sm:text-base font-display text-white/90">
                                        <strong className="text-neon-pink drop-shadow-[0_0_5px_rgba(255,42,133,0.5)]">1. 에너지 현황:</strong> <ParsedText className="text-white inline" text={parsedJson.energy_status} lang={lang} />
                                      </div>
                                      <div className="text-sm sm:text-base font-display text-white/90">
                                        <strong className="text-neon-pink drop-shadow-[0_0_5px_rgba(255,42,133,0.5)]">2. 이동의 가치:</strong> <ParsedText className="text-white inline" text={parsedJson.value} lang={lang} />
                                      </div>
                                      <div className={`text-sm sm:text-base font-display text-white/90 p-3 rounded border ${gradeBg} ${gradeBorder}`}>
                                        <strong className="text-neon-pink drop-shadow-[0_0_5px_rgba(255,42,133,0.5)]">3. 최종 판결:</strong> <ParsedText className={`${gradeColor} ml-1 font-bold inline`} text={parsedJson.judgment} lang={lang} />
                                      </div>
                                      {parsedJson.alt_action && parsedJson.alt_action.trim() !== '' && (
                                        <div className="text-sm sm:text-base font-display text-white/90 p-3 rounded border bg-neon-cyan/10 border-neon-cyan/30 mt-2">
                                          <strong className="text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">전략적 중재 (Alt-Action):</strong> <ParsedText className="text-white ml-1 inline" text={parsedJson.alt_action} lang={lang} />
                                        </div>
                                      )}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/10">
                                      <div className="text-sm sm:text-base font-display text-white/90 mb-3">
                                        <strong className="text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">4. 전략적 액션 플랜:</strong>
                                      </div>
                                      <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-white/80">
                                        <li><strong className="text-white">핵심 방향:</strong> <ParsedText className="inline" text={parsedJson.action_plan.direction} lang={lang} /></li>
                                        <li><strong className="text-white">자산/리스크 관리:</strong> <ParsedText className={`${parsedJson.grade === 'A' ? 'text-green-400' : 'text-red-400'} inline`} text={parsedJson.action_plan.risk_management} lang={lang} /></li>
                                        <li><strong className="text-white">에너지 최적지:</strong> <ParsedText className="inline" text={parsedJson.action_plan.optimal_space} lang={lang} /></li>
                                      </ul>
                                    </div>
                                  </motion.div>
                                );
                              } else if (selectedThemeId === 'taboo') {
                                return (
                                  <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                                    className="space-y-4"
                                  >
                                    <div className="flex items-center gap-3 mb-4">
                                      <h3 className="text-xl sm:text-2xl font-bold text-red-500 tracking-tight">[{parsedJson.theme}: 잠복된 위협]</h3>
                                    </div>
                                    <div className="space-y-4">
                                      {parsedJson.risks.map((risk: any, i: number) => (
                                        <div key={i} className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                                          <h4 className="text-red-400 font-bold mb-1 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            {risk.name} 
                                            <span className="text-[10px] px-1.5 py-0.5 border border-red-500/50 rounded bg-red-500/10 uppercase tracking-widest">{risk.severity}</span>
                                          </h4>
                                          <p className="text-sm text-white/80">{risk.desc}</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-red-500/20">
                                      <h4 className="text-neon-cyan font-bold mb-3 flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        {lang === 'KO' ? '레메디 게이트 (Remedy Gate)' : 'Remedy Gate'}
                                      </h4>
                                      <ul className="space-y-2">
                                        {parsedJson.remedy_gate.map((remedy: string, i: number) => (
                                          <li key={i} className="text-sm text-neon-cyan/90 bg-neon-cyan/10 p-3 rounded-lg border border-neon-cyan/20">
                                            {remedy}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </motion.div>
                                );
                              } else if (selectedThemeId === 'dark_curtain') {
                                return (
                                  <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                                    className="space-y-4"
                                  >
                                    <div className="flex items-center gap-3 mb-4">
                                      <h3 className="text-xl sm:text-2xl font-bold text-purple-400 tracking-tight">[{parsedJson.theme}: 까르마의 흔적]</h3>
                                    </div>
                                    <div className="space-y-4">
                                      {parsedJson.insights.map((insight: string, i: number) => (
                                        <div key={i} className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl relative overflow-hidden group">
                                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                          <p className="text-sm font-display text-white/90 relative z-10 leading-relaxed">
                                            {insight}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                );
                              } else if (selectedThemeId === 'destiny_map') {
                                return (
                                  <DestinyMapSection result={result} lang={lang} parsedJson={parsedJson} />
                                );
                              } else if (selectedThemeId === 'soul_intersection') {
                                return (
                                  <DestinyMapSection result={result} lang={lang} parsedJson={parsedJson} scannerOnly={true} />
                                );
                              }
                            } else {
                                return (
                                  <p className="text-sm sm:text-base font-display italic text-white leading-relaxed whitespace-pre-wrap">
                                    <TypingText 
                                      key={selectedThemeId + (selectedThemeId === 'romance' || selectedThemeId === 'secrets' ? maritalStatus + hasChildren : '')} 
                                      text={mainText} 
                                      speed={20} 
                                      lang={lang}
                                      skip={internalSkipTyping}
                                    />
                                  </p>
                                );
                              }
                          })()}
                          <div className="mt-4 pt-4 border-t border-neon-pink/20">
                            <p className={`text-xs sm:text-sm font-display italic ${cycleVibe.themeAnalyses[selectedThemeId].isCorruption ? 'text-cycle-corruption bg-black/80 px-2 py-1 inline-block rounded' : 'text-neon-pink/80'}`}>
                              <ParsedText lang={lang} text={cycleVibe.themeAnalyses[selectedThemeId].glitch} />
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedThemeId !== 'psych_test' && cycleVibe.themeAnalyses[selectedThemeId]?.nextHook && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl"
                        >
                          <p className="text-xs sm:text-sm font-display text-white/90 italic mb-3">
                            <ParsedText lang={lang} text={cycleVibe.themeAnalyses[selectedThemeId]?.nextHook?.text || ''} />
                          </p>
                          <button
                            onClick={() => {
                              const nextId = cycleVibe.themeAnalyses[selectedThemeId]?.nextHook?.themeId;
                              if (nextId) setSelectedThemeId(nextId);
                            }}
                            className="text-[10px] sm:text-xs font-bold text-neon-cyan hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
                          >
                            {(() => {
                              const nextId = cycleVibe.themeAnalyses[selectedThemeId]?.nextHook?.themeId;
                              if (nextId === 'marriage_timing') return lang === 'KO' ? '결혼운 확인하기' : 'CHECK MARRIAGE LUCK';
                              if (nextId === 'romance') return lang === 'KO' ? '인연의 실타래 풀기' : 'UNTANGLE ROMANCE';
                              return lang === 'KO' ? '비밀의 페이지 열기' : 'OPEN THE SECRET PAGE';
                            })()}
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </motion.div>
                      )}

                      <div className="flex flex-col gap-3 mt-6 mb-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
                        <button 
                          onClick={() => {
                            setVibePhase('question');
                            setSelectedThemeId(null);
                            setHasAskedAnotherQuestion(true);
                            setSkipCycleVibeTyping(true);
                            setIsQuestionPromptComplete(true);
                            setTimeout(() => {
                              vibeContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 50);
                          }}
                          className="w-fit px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-xs text-white/70 transition-all font-medium"
                        >
                          {lang === 'KO' ? '다른 질문 하기' : 'ASK ANOTHER QUESTION'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
      </motion.div>

      {/* Time Correction Messages */}
      {result.timeCorrectionMessages && result.timeCorrectionMessages.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="goth-glass p-4 rounded-xl border border-neon-cyan/30 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 text-neon-cyan">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wider">TIME CORRECTION ENGINE</span>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {result.timeCorrectionMessages.map((msg, idx) => (
              <li key={idx} className="text-xs text-white/80 leading-relaxed">
                {msg}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* 8 Pillars Grid (4x2) */}
      <div className="space-y-4 relative">
        {/* Guide UI Overlay & Popover */}
        <AnimatePresence>
          {guideStep > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex flex-col pointer-events-none"
            >
              {/* Dimmed Overlay Base */}
              <div className="absolute inset-0 -mx-4 -my-4 lg:-mx-12 lg:-my-8 bg-black/60 backdrop-blur-[2px] rounded-2xl pointer-events-auto" onClick={() => setGuideStep(0)} />

              {/* Guide Content Box */}
              {guideStep < 7 && (
                <motion.div 
                  key={guideStep}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`absolute left-0 right-0 z-[60] p-4 sm:p-6 rounded-2xl border border-neon-cyan/40 bg-goth-bg/95 shadow-[0_0_30px_rgba(0,242,255,0.3)] pointer-events-auto ${guideStep === 6 ? 'top-[0%] mt-8' : 'top-[100%] mt-4'} overflow-y-auto max-h-[80vh]`}
                >
                <button onClick={() => setGuideStep(0)} className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
                <div className="flex flex-col gap-4">
                  {guideStep === 6 && (
                    <div className="w-full mb-2">
                      <div className="flex flex-col gap-1.5">
                        {[
                          { groupKo: '나침반', groupEn: 'Identity', color: 'var(--tengod-identity)', items: [
                            { nameKo: '비견', nameEn: 'Mirror', descKo: '주체성/독립심', descEn: 'Independence' },
                            { nameKo: '겁재', nameEn: 'Rival', descKo: '승부욕/경쟁', descEn: 'Competitiveness' }
                          ]},
                          { groupKo: '엔진', groupEn: 'Expression', color: 'var(--tengod-expression)', items: [
                            { nameKo: '식신', nameEn: 'Artist', descKo: '창작/몰입', descEn: 'Creation/Focus' },
                            { nameKo: '상관', nameEn: 'Rebel', descKo: '언변/파격', descEn: 'Eloquence/Rebel' }
                          ]},
                          { groupKo: '안테나', groupEn: 'Wealth', color: 'var(--tengod-wealth)', items: [
                            { nameKo: '정재', nameEn: 'Architect', descKo: '안정/꼼꼼함', descEn: 'Stability/Meticulous' },
                            { nameKo: '편재', nameEn: 'Maverick', descKo: '스케일/네트워크', descEn: 'Scale/Network' }
                          ]},
                          { groupKo: '브레이크', groupEn: 'Power', color: 'var(--tengod-power)', items: [
                            { nameKo: '정관', nameEn: 'Judge', descKo: '원칙/체면', descEn: 'Principles/Honor' },
                            { nameKo: '편관', nameEn: 'Warrior', descKo: '극기/카리스마', descEn: 'Endurance/Power' }
                          ]},
                          { groupKo: '충전소', groupEn: 'Resource', color: 'var(--tengod-resource)', items: [
                            { nameKo: '정인', nameEn: 'Sage', descKo: '수용/학문', descEn: 'Acceptance/Study' },
                            { nameKo: '편인', nameEn: 'Mystic', descKo: '직관/비판', descEn: 'Intuition/Critical' }
                          ]}
                        ].map((g, i) => (
                          <div key={i} className="flex flex-row bg-white/5 border border-white/10 rounded-lg overflow-hidden h-10 sm:h-auto">
                            <div className="w-16 sm:w-20 lg:w-24 flex-shrink-0 flex items-center justify-center border-r border-white/10" style={{ backgroundColor: `color-mix(in srgb, ${g.color} 20%, transparent)` }}>
                              <span className="font-bold text-[9px] sm:text-[10px] tracking-widest text-center" style={{ color: g.color }}>
                                {lang === 'KO' ? g.groupKo : g.groupEn}
                              </span>
                            </div>
                            <div className="flex-1 flex flex-row divide-x divide-white/10">
                              {g.items.map((item, j) => {
                                const matchingChars: { char: string; hanja: string; type: 'stem'|'branch', element: string }[] = [];
                                result.pillars.forEach((p) => {
                                  if (p.isUnknown) return;
                                  if (p.stemKoreanName === item.nameKo || (item.nameKo === '비견' && p.stemKoreanName.includes('일간'))) {
                                    const enName = BAZI_MAPPING.stems?.[p.stem as keyof typeof BAZI_MAPPING.stems]?.en.split(' ')[0] || p.stem;
                                    const koName = BAZI_MAPPING.stems?.[p.stem as keyof typeof BAZI_MAPPING.stems]?.ko.slice(0, 1) || p.stem;
                                    const element = BAZI_MAPPING.stems?.[p.stem as keyof typeof BAZI_MAPPING.stems]?.element || '';
                                    matchingChars.push({ char: lang === 'KO' ? koName : enName, hanja: p.stem, element, type: 'stem' });
                                  }
                                  if (p.branchKoreanName === item.nameKo) {
                                    const enName = BAZI_MAPPING.branches?.[p.branch as keyof typeof BAZI_MAPPING.branches]?.en.split(' ')[0] || p.branch;
                                    const koName = BAZI_MAPPING.branches?.[p.branch as keyof typeof BAZI_MAPPING.branches]?.ko.slice(0, 1) || p.branch;
                                    const element = BAZI_MAPPING.branches?.[p.branch as keyof typeof BAZI_MAPPING.branches]?.element || '';
                                    matchingChars.push({ char: lang === 'KO' ? koName : enName, hanja: p.branch, element, type: 'branch' });
                                  }
                                });
                                
                                const hasGod = matchingChars.length > 0;
                                return (
                                  <div key={j} className={`flex-1 px-1.5 sm:px-2 py-1 flex items-center justify-between transition-colors overflow-hidden ${hasGod ? 'bg-white/10 shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]' : 'bg-black/40 opacity-50'}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
                                      <div className={`text-[9.5px] sm:text-[11px] font-bold whitespace-nowrap ${hasGod ? 'text-white' : 'text-white/40'}`}>
                                        {lang === 'KO' ? item.nameKo : item.nameEn}
                                      </div>
                                      <div className="text-[8px] sm:text-[9.5px] text-white/50 truncate" title={lang === 'KO' ? item.descKo : item.descEn}>
                                        {lang === 'KO' ? item.descKo : item.descEn}
                                      </div>
                                    </div>
                                    {hasGod && (
                                      <div className="flex items-center gap-0.5 ml-1 shrink-0">
                                        {matchingChars.map((mc, idx) => (
                                          <div key={idx} className="flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white/30 bg-white/10">
                                            <span className="text-[7.5px] sm:text-[9px] font-bold leading-none" style={{ color: ELEMENT_COLORS[mc.element as keyof typeof ELEMENT_COLORS] || '#fff' }}>
                                              {mc.hanja}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center shrink-0 border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                      {guideStep === 1 && <span className="text-2xl" role="img" aria-label="roots">🌱</span>}
                      {guideStep === 2 && <span className="text-2xl" role="img" aria-label="trunk">🪵</span>}
                      {guideStep === 3 && <span className="text-2xl" role="img" aria-label="flower">🌸</span>}
                      {guideStep === 4 && <span className="text-2xl" role="img" aria-label="fruit">🍏</span>}
                      {guideStep === 5 && <span className="text-2xl" role="img" aria-label="hidden">✨</span>}
                      {guideStep === 6 && <span className="text-2xl" role="img" aria-label="masks">🎭</span>}
                      {guideStep === 7 && <span className="text-2xl" role="img" aria-label="seasons">🌤️</span>}
                    </div>
                    <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-bold text-neon-cyan mb-1 flex items-center gap-2">
                      {lang === 'KO' ? (
                        <>
                          {guideStep === 1 && '연주 (Year Pillar) - 나의 뿌리와 조상'}
                          {guideStep === 2 && '월주 (Month Pillar) - 환경과 부모님'}
                          {guideStep === 3 && '일주 (Day Pillar) - 나 자신과 배우자'}
                          {guideStep === 4 && '시주 (Hour Pillar) - 미래와 숨은 본능'}
                          {guideStep === 5 && '지장간 (Hidden Stems) - 땅 속에 감춰진 잠재력'}
                          {guideStep === 6 && '십성 (Ten Gods) - 나의 사회적 가면'}
                          {guideStep === 7 && '대운 (Daewun) - 내게 주어진 10년의 테마'}
                        </>
                      ) : (
                        <>
                          {guideStep === 1 && 'Year Pillar - Roots & Ancestry'}
                          {guideStep === 2 && 'Month Pillar - Environment & Parents'}
                          {guideStep === 3 && 'Day Pillar - Self & Spouse'}
                          {guideStep === 4 && 'Hour Pillar - Future & Hidden Defaults'}
                          {guideStep === 5 && 'Hidden Stems - Concealed Potential'}
                          {guideStep === 6 && 'Ten Gods - Your Social Masks'}
                          {guideStep === 7 && 'Daewun - The 10-Year Life Theme'}
                        </>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-white/70 whitespace-nowrap">
                        Step {guideStep} / 7
                      </span>
                    </h4>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                      {lang === 'KO' ? (
                        <>
                          {guideStep === 1 && (
                            <span className="block space-y-2">
                              <span>마치 나무의 뿌리처럼 당신의 태생적 환경, 유전적 특성, 그리고 가문을 넘어선 우주적 조상의 기운을 나타냅니다.</span>
                              <span className={`block text-[11px] leading-relaxed p-2.5 rounded-xl border font-sans font-medium space-y-1 ${theme === 'light' ? 'bg-amber-50/50 text-amber-900 border-amber-200/60' : 'bg-neon-cyan/5 text-neon-cyan/90 border-neon-cyan/25'}`}>
                                <strong className={`font-bold block text-xs ${theme === 'light' ? 'text-amber-800' : 'text-white'}`}>☀️ Tip. 음양(Yin & Yang) 구별하는 법</strong>
                                <span>각 기둥 상자의 우측 상단엔 해(☀️)와 달(🌙) 아이콘이 표기되어 있어. 해는 외향적이고 적극적인 양(Yang)의 기운을, 달은 유연하고 탐구적인 음(Yin)의 기운을 나타내고 있으니 음양 분포를 한눈에 쉽게 확인해 봐!</span>
                              </span>
                            </span>
                          )}
                          {guideStep === 2 && '뿌리에서 자라난 튼튼한 기둥입니다. 당신이 속한 사회적 환경, 가정의 분위기, 그리고 청년기와 성장 과정을 뜻합니다.'}
                          {guideStep === 3 && '사주에서 가장 핵심이 되는 꽃, 바로 \'나 자신\'입니다. 윗글자(일간)는 당신의 영혼을, 아랫글자(일지)는 배우자를 의미합니다.'}
                          {guideStep === 4 && '나무가 열매를 맺듯 당신이 이루어낼 무의식적 결과이자 인생의 후반기입니다. 생시를 알아야 완벽한 통변이 가능한 이유입니다.'}
                          {guideStep === 5 && (
                            <span className="flex flex-col gap-2">
                              {(result.analysis?.dayMasterStrength?.score || 0) >= 3.5 && (
                                <span className={`text-[10.5px] sm:text-[11.5px] p-2 rounded-lg break-keep shadow-sm ${theme === 'light' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'}`}>
                                  <span className="font-bold">✨ 통근(뿌리) 총람:</span> 귀하는 지지에 강력한 뿌리를 두고 있는 <strong className={theme === 'light' ? 'text-amber-700' : 'text-white'}>기반이 튼튼한 사주</strong>입니다.
                                </span>
                              )}
                              <span>각 지지 속에 숨겨져 있는 핵심 무기와 본능입니다. 하단의 꼬리표는 이 지장간이 사주 원국의 윗글자(천간)들과 얼마나 다각적으로 결속되어 현실로 발현되는지를 나타냅니다. 마우스를 올리면 통근된 글자가 반응합니다.</span>
                              {presentRootTags.size > 0 && (
                                <span className={`text-[10px] sm:text-[11px] p-1.5 rounded break-keep flex flex-wrap gap-x-2 gap-y-1 mt-1 ${theme === 'light' ? 'bg-slate-50 text-slate-700 border border-slate-200' : 'bg-white/5 text-white/80 border border-white/10'}`}>
                                  {presentRootTags.has('MAIN') && <span><span className={`font-bold ${theme === 'light' ? 'text-rose-600' : 'text-neon-pink'}`}>본기:</span> 제자리 천간에 직접 연결된 핵심 주특기. </span>}
                                  {presentRootTags.has('E-MN') && <span><span className={`font-bold ${theme === 'light' ? 'text-rose-600' : 'text-neon-pink'}`}>연간/월간/일간/시간:</span> 각각 해당 천간으로 투출해 사회적/현실적 무기로 뻗어 나가는 강력한 본기 통근. </span>}
                                  {presentRootTags.has('GEN') && <span><span className={`font-bold ${theme === 'light' ? 'text-amber-600' : 'text-yellow-400'}`}>생조:</span> 제자리 천간을 밀어주는 내적인 잠재력. </span>}
                                  {presentRootTags.has('E-GN') && <span><span className={`font-bold ${theme === 'light' ? 'text-amber-600' : 'text-yellow-400'}`}>연생/월생/일생/시생:</span> 각각 해당 천간으로 기운을 공급하여 상생과 원조를 아끼지 않는 조력의 뿌리. </span>}
                                  {presentRootTags.has('SUB') && <span><span className={`font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>중여:</span> 제자리 천간과 연결되는 유연하고 탄탄한 서브 무기. </span>}
                                  {presentRootTags.has('E-SB') && <span><span className={`font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>연중/월중/일중/시중:</span> 각각 해당 천간에 유연한 수단을 한 단계 거쳐 작용하게 만드는 탄탄한 보완의 뿌리.</span>}
                                </span>
                              )}
                            </span>
                          )}
                          {guideStep === 6 && '나와 타인이 맺는 관계방식을 10가지 역할로 나눈 심리/행동 패턴입니다. 당신이 세상을 살아가는 무기이자 가면입니다.'}
                          {guideStep === 7 && '계절이 바뀌듯 10년 단위로 당신에게 펼쳐지는 환경과 무대입니다. 인생의 어떤 계절을 지나고 있는지 확인해보세요.'}
                        </>
                      ) : (
                        <>
                          {guideStep === 1 && (
                            <span className="block space-y-2">
                              <span>Like the roots of a tree, this represents your inherited environment, genetics, and the cosmic ancestral energy you were born into.</span>
                              <span className={`block text-[11px] leading-relaxed p-2.5 rounded-xl border font-sans font-medium space-y-1 ${theme === 'light' ? 'bg-amber-50/50 text-amber-900 border-amber-200/60' : 'bg-neon-cyan/5 text-neon-cyan/90 border-neon-cyan/25'}`}>
                                <strong className={`font-bold block text-xs ${theme === 'light' ? 'text-amber-800' : 'text-white'}`}>☀️ Tip. How to read Yin & Yang</strong>
                                <span>The sun (☀️) icon on the top-right of each card represents the active, outgoing "Yang" energy, while the moon (🌙) icon represents the deep, contemplative "Yin" energy. Easily spot your Yin/Yang balance!</span>
                              </span>
                            </span>
                          )}
                          {guideStep === 2 && 'The trunk that grows from the roots. It indicates your social environment, family atmosphere, and your developing youth phase.'}
                          {guideStep === 3 && 'The blossoming flower, the most crucial part: You. The top stem rules your core identity, while the bottom branch signifies your spouse.'}
                          {guideStep === 4 && 'The fruits you bear in your twilight years. It symbolizes your offspring, hidden desires, and long-term results.'}
                          {guideStep === 5 && (
                            <span className="flex flex-col gap-2">
                              {(result.analysis?.dayMasterStrength?.score || 0) >= 3.5 && (
                                <span className={`text-[10.5px] sm:text-[11.5px] p-2 rounded-lg break-keep shadow-sm ${theme === 'light' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'}`}>
                                  <span className="font-bold">✨ Rooting Overview:</span> You have a <strong className={theme === 'light' ? 'text-amber-700' : 'text-white'}>strongly rooted and stable foundation</strong> in your chart.
                                </span>
                              )}
                              <span>These are your true weapons and hidden instincts. The small tags below show how strongly this potential is connected to the Heavenly Stems above. Hover over them to see the glowing connections.</span>
                              {presentRootTags.size > 0 && (
                                <span className={`text-[10px] sm:text-[11px] p-1.5 rounded break-keep flex flex-wrap gap-x-2 gap-y-1 mt-1 ${theme === 'light' ? 'bg-slate-50 text-slate-700 border border-slate-200' : 'bg-white/5 text-white/80 border border-white/10'}`}>
                                  {presentRootTags.has('MAIN') && <span><span className={`font-bold ${theme === 'light' ? 'text-rose-600' : 'text-neon-pink'}`}>MAIN:</span> Core strength directly rooted to its own Heavenly Stem. </span>}
                                  {presentRootTags.has('E-MN') && <span><span className={`font-bold ${theme === 'light' ? 'text-rose-600' : 'text-neon-pink'}`}>Year/Month/DM/Hour:</span> Strong Main-Qi root connecting directly to the designated Heavenly Stem. </span>}
                                  {presentRootTags.has('GEN') && <span><span className={`font-bold ${theme === 'light' ? 'text-amber-600' : 'text-yellow-400'}`}>GEN:</span> Supportive potential feeding its own Heavenly Stem. </span>}
                                  {presentRootTags.has('E-GN') && <span><span className={`font-bold ${theme === 'light' ? 'text-amber-600' : 'text-yellow-400'}`}>Year-GN/Month-GN/DM-GN/Hour-GN:</span> Generative support feeding and empowering the designated Heavenly Stem. </span>}
                                  {presentRootTags.has('SUB') && <span><span className={`font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>SUB:</span> A highly flexible, resilient backup weapon for its own Heavenly Stem. </span>}
                                  {presentRootTags.has('E-SB') && <span><span className={`font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>Year-SB/Month-SB/DM-SB/Hour-SB:</span> Resilient secondary/sub root backing up the designated Heavenly Stem.</span>}
                                </span>
                              )}
                            </span>
                          )}
                          {guideStep === 6 && 'Represents 10 psychological and behavioral patterns of how you relate to others. It is your weapon and mask in this world.'}
                          {guideStep === 7 && 'Just like seasons change, this represents the shifting environment and theme you face every 10 years.'}
                        </>
                      )}
                    </p>
                    <div className="flex gap-2 justify-end w-full">
                      <button onClick={() => setShowGuideDetailModal(true)} className="px-4 py-2 text-xs sm:text-sm rounded border border-white/20 text-white hover:bg-white/10 transition-colors mr-auto">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {lang === 'KO' ? '자세히 알아보기' : 'Learn More'}
                        </span>
                      </button>
                      {guideStep > 1 && (
                        <button onClick={() => setGuideStep(p => p - 1)} className="px-4 py-2 text-xs sm:text-sm rounded border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                          {lang === 'KO' ? '이전' : 'Prev'}
                        </button>
                      )}
                      {guideStep < 7 ? (
                        <button onClick={() => setGuideStep(p => p + 1)} className="px-5 py-2 text-xs sm:text-sm rounded bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 flex items-center justify-center transition-colors">
                          {lang === 'KO' ? '다음' : 'Next'} <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      ) : (
                        <button onClick={() => setGuideStep(0)} className="px-5 py-2 text-xs sm:text-sm rounded bg-neon-pink/20 border border-neon-pink text-neon-pink hover:bg-neon-pink/30 flex items-center justify-center transition-colors">
                          {lang === 'KO' ? '가이드 종료' : 'Finish Guide'} <CheckCircle2 className="w-4 h-4 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                </div>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

        <div className="flex justify-between items-end gap-2 relative z-50">
          <div className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(0, 242, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGuideStep(1)}
              className="group flex flex-col sm:flex-row items-center sm:items-start text-left px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-neon-cyan/10 to-transparent border border-neon-cyan/30 rounded-lg sm:rounded-full hover:bg-neon-cyan/20 transition-all text-white relative shadow-lg"
            >
              <div className="absolute inset-0 rounded-lg sm:rounded-full border border-neon-cyan/50 animate-pulse mix-blend-overlay"></div>
              <div className="flex items-center gap-2 w-full">
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-neon-cyan group-hover:text-white transition-colors" />
                <span className="text-xs sm:text-sm font-bold whitespace-nowrap text-neon-cyan group-hover:text-white transition-colors">
                  {lang === 'KO' ? "사주가 처음이신가요?" : "New to BaZi?"}
                </span>
              </div>
            </motion.button>
          </div>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHanja(!showHanja)} 
            className="text-xs px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors text-white/70 whitespace-nowrap whitespace-nowrap flex-shrink-0"
          >
            {showHanja ? (lang === 'KO' ? '한자 숨기기' : 'Hide Hanja') : (lang === 'KO' ? '한자 보기' : 'Show Hanja')}
          </motion.button>
        </div>
        <div className="grid grid-cols-4 gap-0.5 sm:gap-2 md:gap-4 items-stretch relative">
          {result.pillars.map((pillar, i) => {
            const lifeStage = BAZI_MAPPING.lifeStages[dayMaster as keyof typeof BAZI_MAPPING.lifeStages]?.[pillar.branch as keyof typeof BAZI_MAPPING.lifeStages[keyof typeof BAZI_MAPPING.lifeStages]];
            const branchData = BAZI_MAPPING.branches?.[pillar.branch as keyof typeof BAZI_MAPPING.branches];
            const hiddenStems = branchData?.hiddenStems || [];
            const isDayPillar = pillar.title === 'Day';
            const pillarName = lang === 'KO' ? 
              (pillar.title === 'Year' ? '연주' : pillar.title === 'Month' ? '월주' : pillar.title === 'Day' ? '일주' : '시주') : 
              (pillar.title === 'Hour' ? 'Time Pillar' : `${pillar.title} Pillar`);

            const iljuData = isDayPillar ? ILJU_DESCRIPTIONS[pillar.hanja] : null;

            // map guideStep (1:Year, 2:Month, 3:Day, 4:Hour) to index
            // since index 0 is Hour, 1 is Day, 2 is Month, 3 is Year (assuming standard right-to-left config inside result.pillars array structure for korean bazi usually)
            // But let's check pillar.title
            const pillarGuideStep = pillar.title === 'Year' ? 1 : pillar.title === 'Month' ? 2 : pillar.title === 'Day' ? 3 : 4;
            const isHighlighted = guideStep === pillarGuideStep;
            const isDimmed = guideStep > 0 && !isHighlighted && guideStep !== 5 && guideStep !== 6 && guideStep !== 7;
            const isUnknownPillar = pillar.isUnknown;
            const isRelatedStemHovered = hoveredHiddenStem?.connectedStems.includes(pillar.stem);
            const isHoveredStemDestroyed = hoveredHiddenStem?.isDestroyed;
            const isLight = theme === 'light';
            const glowColor = ELEMENT_COLORS[pillar.element as keyof typeof ELEMENT_COLORS] || '#FF007A';
            const baseColor = isLight ? `color-mix(in srgb, ${glowColor} 80%, #FAF9F6)` : glowColor;

            const auraShadow = isRelatedStemHovered 
              ? (isHoveredStemDestroyed 
                  ? '0 0 20px rgba(239, 68, 68, 0.55), 0 0 10px rgba(239, 68, 68, 0.3), inset 0 0 12px rgba(239, 68, 68, 0.25)' 
                  : isLight
                    ? `0 0 35px 4px color-mix(in srgb, ${glowColor} 60%, transparent), 0 0 15px 1px color-mix(in srgb, ${glowColor} 30%, transparent), inset 0 0 15px color-mix(in srgb, ${glowColor} 15%, transparent)`
                    : `0 0 45px 8px color-mix(in srgb, ${glowColor} 80%, transparent), 0 0 20px 2px color-mix(in srgb, ${glowColor} 55%, transparent), inset 0 0 18px color-mix(in srgb, ${glowColor} 25%, transparent)`)
              : undefined;

            return (
              <div 
                key={`pillar-${i}`} 
                className={`flex flex-col gap-1 sm:gap-2 h-full transition-all duration-500 ease-in-out ${isHighlighted ? 'scale-[1.03] sm:scale-105 z-50' : ''} ${guideStep === 5 ? 'z-50' : ''} ${isDimmed ? 'opacity-20 blur-[2px] grayscale-[50%]' : 'z-10'} ${isUnknownPillar ? 'opacity-40 grayscale' : ''}`}
              >
                <div className={`text-[9px] sm:text-xs font-bold text-center mb-1 uppercase tracking-widest transition-colors ${isDayPillar || isHighlighted ? 'text-neon-cyan drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]' : isUnknownPillar ? 'text-white/20' : 'text-white/40'}`}>
                  {pillarName}
                </div>
                {/* Stem Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-full min-w-0 goth-glass rounded-lg sm:rounded-xl border-t-2 flex flex-col overflow-hidden h-[114px] sm:h-[148px] md:h-[168px] ${isDayPillar ? 'ring-1 ring-neon-cyan/30 bg-neon-cyan/5' : ''} ${guideStep === 5 && !isRelatedStemHovered ? 'opacity-40 blur-[1px]' : ''} relative transition-all duration-300 ${isRelatedStemHovered ? (isHoveredStemDestroyed ? 'scale-[1.02] z-[90] ring-2 ring-red-500/50 bg-red-500/5 !border-red-500/30' : (isLight ? 'goth-glass-hover-active scale-[1.06] z-[100]' : 'animate-bazi-related-glow scale-[1.06] z-[100] border-2')) : ''}`}
                  style={{ 
                    '--glow-color': glowColor,
                    '--light-hover-bg': isLight && isRelatedStemHovered && !isHoveredStemDestroyed ? (LIGHT_MODE_ELEMENT_TINTS[pillar.element as keyof typeof LIGHT_MODE_ELEMENT_TINTS]?.bg) : undefined,
                    '--light-hover-border': isLight && isRelatedStemHovered && !isHoveredStemDestroyed ? (LIGHT_MODE_ELEMENT_TINTS[pillar.element as keyof typeof LIGHT_MODE_ELEMENT_TINTS]?.border) : undefined,
                    borderColor: isRelatedStemHovered 
                      ? (isHoveredStemDestroyed ? '#EF4444' : (isLight ? undefined : glowColor)) 
                      : (isUnknownPillar ? '#333' : glowColor),
                    boxShadow: isLight && isRelatedStemHovered && !isHoveredStemDestroyed ? 'none' : auraShadow
                  } as any}
                >
                  <div className="relative z-10 flex flex-col h-full w-full min-w-0">
                    <div className="w-full min-w-0 p-1.5 sm:p-3 md:p-4 flex flex-col text-center flex-grow relative">
                    {!isUnknownPillar && (
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-40 z-10">
                        <PolarityIcon polarity={pillar.stemPolarity} size={8} />
                      </div>
                    )}
                    <div className="flex-1 flex items-start justify-center">
                      <div className={`text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-tighter sm:tracking-[0.2em] uppercase ${isUnknownPillar ? 'text-white/20' : 'text-white/40'}`}>
                        {lang === 'KO' ? 
                          (pillar.title === 'Year' ? '연간' : pillar.title === 'Month' ? '월간' : pillar.title === 'Day' ? '일간' : '시간') : 
                          (pillar.title === 'Hour' ? 'Time Stem' : `${pillar.title} Stem`)}
                      </div>
                    </div>
                    <div 
                      className={`w-full text-base sm:text-xl md:text-3xl font-gothic leading-tight flex flex-col items-center justify-center shrink-0 py-1 sm:py-2 ${isUnknownPillar ? 'text-white/30' : ''}`}
                      style={{ color: isUnknownPillar ? undefined : (ELEMENT_COLORS[pillar.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF') }}
                    >
                      {isUnknownPillar ? (
                        <span>?</span>
                      ) : (
                        lang === 'KO' ? 
                          (showHanja ? `${pillar.stem}(${BAZI_MAPPING.stems?.[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.ko || pillar.stem})` : `${BAZI_MAPPING.stems?.[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.ko || pillar.stem}`) : 
                          (showHanja ? (
                            <div className="flex flex-col items-center w-full min-w-0">
                              <span className="truncate w-full text-center px-1">{pillar.stem}({getRomanized(pillar.stem).toUpperCase()})</span>
                              <div className="text-[10px] sm:text-xs md:text-sm truncate w-full text-center tracking-tighter text-white/80 px-1">{BAZI_MAPPING.stems?.[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.element || pillar.stem}</div>
                            </div>
                          ) : (
                            <div className="text-sm sm:text-base md:text-xl truncate w-full text-center tracking-tighter px-1">{getRomanized(pillar.stem).toUpperCase()}</div>
                          ))
                      )}
                    </div>
                    <div className="flex-1 flex items-end justify-center">
                      <div className="text-[8px] sm:text-[10px] opacity-0 pointer-events-none font-bold select-none" aria-hidden="true">
                        {lang === 'KO' ? '장생' : 'Growth'}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 border-t border-white/10 py-1.5 sm:py-2 px-0.5 min-h-[24px] sm:min-h-[32px] flex items-center justify-center shrink-0">
                    <span 
                      className={`text-[8px] sm:text-[10px] md:text-[11px] font-display font-bold uppercase tracking-wide leading-none ${isUnknownPillar ? 'text-white/30' : ''}`}
                      style={{ color: isUnknownPillar ? undefined : getTenGodColor(lang === 'KO' ? pillar.stemKoreanName : pillar.stemEnglishName) }}
                    >
                      {isUnknownPillar ? (lang === 'KO' ? '미정' : 'Unknown') : (lang === 'KO' ? pillar.stemKoreanName : formatName(pillar.stemEnglishName))}
                    </span>
                  </div>
                </div>
                </motion.div>

                {/* Branch Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i + 4) * 0.05 }}
                  className={`w-full min-w-0 goth-glass rounded-lg sm:rounded-xl border-t-2 flex flex-col overflow-hidden h-[114px] sm:h-[148px] md:h-[168px] ${isDayPillar ? 'ring-1 ring-neon-cyan/10 bg-neon-cyan/5' : ''} ${guideStep === 5 ? 'opacity-30 blur-[1px]' : ''} relative`}
                  style={{ 
                    borderColor: isUnknownPillar ? '#333' : (ELEMENT_COLORS[branchData?.element as keyof typeof ELEMENT_COLORS] || '#FF007A')
                  }}
                >
                  <div className="relative z-10 flex flex-col h-full w-full min-w-0">
                    <div className="w-full min-w-0 p-1.5 sm:p-3 md:p-4 flex flex-col text-center flex-grow relative">
                    {!isUnknownPillar && (
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-40 z-10">
                        <PolarityIcon polarity={pillar.branchPolarity} size={8} />
                      </div>
                    )}
                    <div className="flex-1 flex items-start justify-center">
                      <div className={`text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-tighter sm:tracking-[0.2em] uppercase ${isUnknownPillar ? 'text-white/20' : 'text-white/40'}`}>
                        {lang === 'KO' ? 
                          (pillar.title === 'Year' ? '연지' : pillar.title === 'Month' ? '월지' : pillar.title === 'Day' ? '일지' : '시지') : 
                          (pillar.title === 'Hour' ? 'Time Branch' : `${pillar.title} Branch`)}
                      </div>
                    </div>
                    <div 
                      className={`w-full text-base sm:text-xl md:text-3xl font-gothic leading-tight flex flex-col items-center justify-center shrink-0 py-1 sm:py-2 ${isUnknownPillar ? 'text-white/30' : ''}`}
                      style={{ color: isUnknownPillar ? undefined : (ELEMENT_COLORS[branchData?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF') }}
                    >
                      {isUnknownPillar ? (
                        <span>?</span>
                      ) : (
                        lang === 'KO' ? 
                          (showHanja ? `${pillar.branch}(${branchData?.ko || pillar.branch})` : `${branchData?.ko || pillar.branch}`) : 
                          (showHanja ? (
                            <div className="flex flex-col items-center w-full min-w-0">
                              <span className="truncate w-full text-center px-1">{pillar.branch}({getRomanized(pillar.branch)})</span>
                              <div className="text-[10px] sm:text-xs md:text-sm truncate w-full text-center tracking-tighter px-1">{getCleanBranchEn(branchData?.en || pillar.branch)}</div>
                            </div>
                          ) : (
                            <div className="text-sm sm:text-base md:text-xl truncate w-full text-center tracking-tighter px-1">{getRomanized(pillar.branch)} ({getCleanBranchEn(branchData?.en || pillar.branch)})</div>
                          ))
                      )}
                    </div>
                    <div className="flex-1 flex items-end justify-center">
                      <div className="text-[8px] sm:text-[10px] text-neon-cyan font-bold">
                        {isUnknownPillar ? '' : (lang === 'KO' ? lifeStage?.ko : null)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 border-t border-white/10 py-1.5 sm:py-2 px-0.5 min-h-[24px] sm:min-h-[32px] flex items-center justify-center shrink-0">
                    <span 
                      className={`text-[8px] sm:text-[10px] md:text-[11px] font-display font-bold uppercase tracking-wide leading-none ${isUnknownPillar ? 'text-white/30' : ''}`}
                      style={{ color: isUnknownPillar ? undefined : getTenGodColor(lang === 'KO' ? pillar.branchKoreanName : pillar.branchEnglishName) }}
                    >
                      {isUnknownPillar ? (lang === 'KO' ? '미정' : 'Unknown') : (lang === 'KO' ? pillar.branchKoreanName : formatName(pillar.branchEnglishName))}
                    </span>
                  </div>
                </div>
                </motion.div>

                {/* Hidden Stems (지장간) */}
                <div className={`flex flex-col gap-0.5 sm:gap-1 mt-1 transition-all duration-500 rounded-lg p-1 ${guideStep === 5 ? 'bg-neon-cyan/10 ring-1 ring-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.3)] scale-105' : ''}`}>
                  <div className={`text-[8.5px] sm:text-[10.5px] md:text-[12px] uppercase font-bold text-center ${guideStep === 5 ? 'text-neon-cyan' : 'text-white/30'}`}>
                    {lang === 'KO' ? '지장간' : 'Hidden'}
                  </div>
                  <div className="flex flex-wrap justify-center gap-0.5 sm:gap-1">
                    {isUnknownPillar ? (
                      <div className="text-[9px] text-center text-white/20 my-2">?</div>
                    ) : (
                      hiddenStems.map((hs, idx) => {
                        const hsData = BAZI_MAPPING.stems?.[hs as keyof typeof BAZI_MAPPING.stems];
                        const hsTenGod = getDetailedTenGod(dayMaster, hs);
                        
                        const isMain = idx === hiddenStems.length - 1;
                        const rawRootStems = result.pillars.map((p, pIdx) => {
                          if (p.isUnknown) return null;
                          const rInfo = getRootingInfoText(p.stem, hs, isMain, lang);
                          if (rInfo) {
                            return {
                              pIdx,
                              title: p.title,
                              pNameKo: p.title === 'Year' ? '연간' : p.title === 'Month' ? '월간' : p.title === 'Day' ? '일간' : '시간',
                              pNameEn: p.title === 'Year' ? 'Year' : p.title === 'Month' ? 'Month' : p.title === 'Day' ? 'DM' : 'Hour',
                              stem: p.stem,
                              ...rInfo
                            };
                          }
                          return null;
                        }).filter(Boolean) as {pIdx: number, title: string, pNameKo: string, pNameEn: string, stem: string, type: string, text: string, short: string}[];

                        const getRootPriorityValue = (r: { pIdx: number, type: string }) => {
                          const isSamePillar = r.pIdx === i;
                          if (isSamePillar) {
                            if (r.type === 'main') return 10;
                            if (r.type === 'sub_residual') return 8;
                            if (r.type === 'generation') return 6;
                          } else {
                            if (r.type === 'main') return 9;
                            if (r.type === 'sub_residual') return 7;
                            if (r.type === 'generation') return 5;
                          }
                          return 0;
                        };

                        const allRootedStems = [...rawRootStems].sort((a, b) => getRootPriorityValue(b) - getRootPriorityValue(a));

                        const hasPillarRoot = allRootedStems.some(r => r.pIdx === i);
                        const hasDmRoot = allRootedStems.some(r => r.title === 'Day');
                        const pillarRootInfo = allRootedStems.find(r => r.pIdx === i);
                        const dmRootInfo = allRootedStems.find(r => r.title === 'Day');

                        // Advanced rooting details lookup from calcDayMasterStrength
                        const pRootDetails = result.analysis?.dayMasterStrength?.rootingDetails?.[i];
                        const rootItem = pRootDetails?.roots?.find((r: any) => r.hiddenStem === hs && r.branch === pillar.branch);
                        const isDestroyed = rootItem && rootItem.isDestroyed;
                        const isTwisted = rootItem && rootItem.isTwisted;
                        const isDamaged = isDestroyed || isTwisted;

                        const isLight = theme === 'light';

                        let highlightClass = isLight ? "border-slate-200 bg-white" : "border-white/10 bg-[#1e1e1e]";
                        if (pillarRootInfo) {
                          if (pillarRootInfo.type === 'main') {
                            highlightClass = isDestroyed 
                              ? (isLight 
                                ? "ring-1 ring-red-500 border-red-500 shadow-[0_0_8px_rgba(220,38,38,0.2)] bg-red-50 text-red-700 font-bold"
                                : "ring-1 ring-red-500/50 border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)] bg-[#2a1313]")
                              : isTwisted
                              ? (isLight
                                ? "ring-1 ring-amber-500 border-amber-500 shadow-[0_0_8px_rgba(217,119,6,0.15)] bg-amber-50 text-amber-850 font-bold"
                                : "ring-1 ring-amber-500/50 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.25)] bg-[#2c2010]")
                              : (isLight
                                ? "ring-1 ring-blue-500/40 border-blue-500/40 shadow-[0_0_8px_rgba(37,99,235,0.1)] bg-[#eff6ff]"
                                : "ring-1 ring-neon-cyan/40 border-neon-cyan/40 shadow-[0_0_8px_rgba(0,242,255,0.15)] bg-[#0a2325]");
                          } else if (pillarRootInfo.type === 'sub_residual') {
                            highlightClass = isDestroyed 
                              ? (isLight
                                ? "border-dashed border-red-400 bg-[#fff5f5] text-red-700"
                                : "border-dashed border-red-500/40 bg-[#251515]")
                              : isTwisted
                              ? (isLight
                                ? "border-dashed border-amber-400 bg-[#fffbf0] text-amber-750"
                                : "border-dashed border-amber-500/40 bg-[#251d13]")
                              : (isLight
                                ? "border-dashed border-blue-300 bg-[#f8faff]"
                                : "border-dashed border-neon-cyan/30 bg-[#162022]");
                          } else if (pillarRootInfo.type === 'generation') {
                            highlightClass = isDestroyed 
                              ? (isLight
                                ? "border-red-400 bg-[#fffafa] text-red-700"
                                : "border-red-500/30 bg-[#201616]")
                              : isTwisted
                              ? (isLight
                                ? "border-amber-400 bg-[#fffdf5] text-amber-700"
                                : "border-amber-500/30 bg-[#201a15]")
                              : (isLight
                                ? "border-amber-300 bg-[#fffff8]"
                                : "border-[#f5b800]/40 bg-[#1e1e17]");
                          }
                        }

                        // Set up HTML strings for tooltip
                        const hsDataElementKo = hsData?.element === 'Wood' ? '목(木)' : hsData?.element === 'Fire' ? '화(火)' : hsData?.element === 'Earth' ? '토(土)' : hsData?.element === 'Metal' ? '금(金)' : '수(水)';
                        const colorHex = ELEMENT_COLORS[hsData?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';

                        // Calculate visual conclusion variables for streamlined display
                        let conclusionTitle = "";
                        let conclusionDesc = "";
                        let conclusionColorClass = isLight ? "text-blue-600" : "text-neon-cyan";
                        let conclusionBgClass = isLight ? "bg-white border-slate-200 text-slate-850" : "bg-white/5 border-white/10 text-white/80";

                        const isHovered = hoveredHiddenStem?.pillarIdx === i && hoveredHiddenStem?.hsIdx === idx;
                        const isRelatedStemHovered = hoveredHiddenStem && hoveredHiddenStem.connectedStems.includes(pillar.stem);

                        if (lang === 'KO') {
                          if (isDestroyed) {
                            let rootTypeKo = "";
                            let origRootTextKo = "";
                            if (pillarRootInfo && dmRootInfo) {
                              rootTypeKo = " [일간·천간 이중 결속]";
                              origRootTextKo = `원래는 천간 [${pillar.stem}] 및 일간 [${dayMaster}]과 이중 통근/상생 결속되어 수호하는 중심 역할을 했습니다.`;
                            } else if (hasPillarRoot || allRootedStems.length > 0) {
                              rootTypeKo = ` [다중 연계 파괴]`;
                              origRootTextKo = `천간의 에너지를 강하게 지지해주던 뿌리였습니다.`;
                            } else {
                              rootTypeKo = " [미통근/생조]";
                              origRootTextKo = "천간이나 일간으로 직접 통근하지 않는 일반 수집 에너지였습니다.";
                            }

                            conclusionTitle = `🚨 통근 파괴됨${rootTypeKo} (Clash)`;
                            conclusionDesc = `<strong>상태:</strong> ${rootItem?.damages?.[0] || '직접적인 인접 지지충(地支衝)으로 인해 지장간 뿌리가 완전히 파괴되었습니다.'}<br/><span class="mt-2 block text-[10px] ${isLight ? 'text-red-750 border-t border-red-200' : 'text-red-200/60 border-t border-red-500/20'} pt-1.5 leading-relaxed"><strong>원래의 관계:</strong> ${origRootTextKo}</span>`;
                            conclusionColorClass = isLight ? "text-red-650" : "text-red-400";
                            conclusionBgClass = isLight ? "bg-red-50 border-red-200 text-red-900 font-medium" : "bg-red-950/30 border-red-900/40 text-red-100";
                          } else if (isTwisted) {
                            let rootTypeKo = "";
                            let origRootTextKo = "";
                            if (pillarRootInfo && dmRootInfo) {
                              rootTypeKo = " [일간·천간 이중 결속]";
                              origRootTextKo = `천간 [${pillar.stem}] 및 일간 [${dayMaster}]과 강력한 이중 수호 결속을 형성하고 있습니다.`;
                            } else if (hasPillarRoot || allRootedStems.length > 0) {
                              rootTypeKo = ` [다중 연계 불안정]`;
                              origRootTextKo = `천간에 연결된 소중한 비옥한 뿌리입니다.`;
                            } else {
                              rootTypeKo = " [생조 지원]";
                              origRootTextKo = "천간이나 일간을 향해 원활한 생조 보조 작용을 하고 있습니다.";
                            }

                            conclusionTitle = `⚡ 형살 구속/비틀림${rootTypeKo}`;
                            conclusionDesc = `<strong>상태:</strong> ${rootItem?.damages?.[0] || '인접 형살 작용으로 에너지가 예민하게 뒤틀려 조율 압박을 받고 있습니다.'}<br/><span class="mt-2 block text-[11px] ${isLight ? 'text-amber-800/95 border-t border-amber-200' : 'text-amber-200/80 border-t border-amber-500/20'} pt-1.5 leading-relaxed"><strong>통근 관계:</strong> ${origRootTextKo}</span>`;
                            conclusionColorClass = isLight ? "text-amber-600" : "text-amber-400";
                            conclusionBgClass = isLight ? "bg-amber-50 border-amber-200 text-amber-900 font-medium" : "bg-amber-950/20 border-amber-900/40 text-amber-100";
                          } else {
                            if (allRootedStems.length > 0) {
                              const bestRoot = allRootedStems[0];
                              conclusionTitle = allRootedStems.length > 1 ? `✨ 다중 연계 [ ${bestRoot.short} 등 ]` : (bestRoot.pIdx === i ? `📍 기둥 연계 [ ${bestRoot.short} ]` : `🌟 외부 연계 [ ${bestRoot.short} ]`);
                              const rootTexts = allRootedStems.map(r => `[${r.pNameKo}(${r.stem}) -> ${r.short}]`).join(', ');
                              conclusionDesc = `다음 천간들과 연결되어 힘을 실어주고 있습니다:<br/><span class="text-[12px] font-bold mt-1 inline-block">${rootTexts}</span>`;
                              
                              conclusionColorClass = bestRoot.type === 'main' 
                                ? (isLight ? "text-rose-600 font-black" : "text-neon-pink") 
                                : bestRoot.type === 'sub_residual' 
                                  ? (isLight ? "text-emerald-700 font-black" : "text-emerald-400") 
                                  : (isLight ? "text-amber-700 font-black" : "text-yellow-400");
                              conclusionBgClass = bestRoot.type === 'main' 
                                ? (isLight ? "bg-rose-50 border-rose-200 text-slate-800" : "bg-neon-pink/5 border-neon-pink/20 text-white") 
                                : bestRoot.type === 'sub_residual' 
                                  ? (isLight ? "bg-emerald-58 border-emerald-200 text-slate-800" : "bg-emerald-950/10 border-emerald-900/25 text-white") 
                                  : (isLight ? "bg-amber-50 border-amber-200 text-slate-800" : "bg-yellow-950/10 border-yellow-900/25 text-white");
                            } else {
                              conclusionTitle = "☁️ 허부·미통근 상태 (Floating)";
                              conclusionDesc = `사주 원국의 윗글자(천간)와 어떠한 강력한 연결선점(통근/생조)이 없어 독자적으로 존재하는 숨은 본능입니다.`;
                              conclusionColorClass = isLight ? "text-slate-400" : "text-white/40";
                              conclusionBgClass = isLight ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-white/5 border-white/10 text-white/50";
                            }
                          }
                        } else {
                          // English
                          if (isDestroyed) {
                            let rootTypeEn = "";
                            let origRootTextEn = "";
                            if (pillarRootInfo && dmRootInfo) {
                              rootTypeEn = " [Double Guard]";
                              origRootTextEn = `Originally established a powerful double connection protecting both stem [${pillar.stem}] and day master [${dayMaster}].`;
                            } else if (hasPillarRoot || allRootedStems.length > 0) {
                              rootTypeEn = ` [Multi-Root Shattered]`;
                              origRootTextEn = `Originally rooted directly into top stems.`;
                            } else {
                              rootTypeEn = " [Unrooted]";
                              origRootTextEn = "A floating resource energy without direct stem rooting.";
                            }

                            conclusionTitle = `🚨 Root Shattered${rootTypeEn} (Clash)`;
                            conclusionDesc = `<strong>Status:</strong> ${rootItem?.damagesEn?.[0] || 'Adjacent branch clash is active, completely shattering physical rooting stability.'}<br/><span class="mt-2 block text-[10px] ${isLight ? 'text-red-700/85 border-t border-red-200' : 'text-red-200/60 border-t border-red-500/20'} pt-1.5 leading-relaxed"><strong>Original Connection:</strong> ${origRootTextEn}</span>`;
                            conclusionColorClass = isLight ? "text-red-600 animate-pulse font-bold" : "text-red-400";
                            conclusionBgClass = isLight ? "bg-red-50 border-red-200 text-red-900" : "bg-red-950/30 border-red-900/40 text-red-100";
                          } else if (isTwisted) {
                            let rootTypeEn = "";
                            let origRootTextEn = "";
                            if (pillarRootInfo && dmRootInfo) {
                              rootTypeEn = " [Double Guard]";
                              origRootTextEn = `Forms a dual protective connection to both stem [${pillar.stem}] and day master [${dayMaster}].`;
                            } else if (hasPillarRoot || allRootedStems.length > 0) {
                              rootTypeEn = ` [Multi-Root Twisted]`;
                              origRootTextEn = `An important root for top stems, currently unstable.`;
                            } else {
                              rootTypeEn = " [Generative]";
                              origRootTextEn = "Provides pure supportive/generative assistance to the stem.";
                            }

                            conclusionTitle = `⚡ Squeezed / Twisted${rootTypeEn}`;
                            conclusionDesc = `<strong>Status:</strong> ${rootItem?.damagesEn?.[0] || 'Adjacent punishment is active: Root remains intact, but energy is squeezed and twisted roughly.'}<br/><span class="mt-2 block text-[11px] ${isLight ? 'text-amber-800/95 border-t border-amber-200' : 'text-amber-200/80 border-t border-amber-500/20'} pt-1.5 leading-relaxed"><strong>Root Connection:</strong> ${origRootTextEn}</span>`;
                            conclusionColorClass = isLight ? "text-amber-600 font-bold" : "text-amber-400";
                            conclusionBgClass = isLight ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-amber-950/20 border-amber-900/40 text-amber-100";
                          } else {
                            if (allRootedStems.length > 0) {
                              const bestRoot = allRootedStems[0];
                              conclusionTitle = allRootedStems.length > 1 ? `✨ Multi Alignment [ ${bestRoot.short} ]` : (bestRoot.pIdx === i ? `📍 Pillar Alignment [ ${bestRoot.short} ]` : `🌟 External Alignment [ ${bestRoot.short} ]`);
                              const rootTexts = allRootedStems.map(r => `[${r.pNameEn}(${r.stem}) -> ${r.short}]`).join(', ');
                              conclusionDesc = `Provides power and grounds the following stems:<br/><span class="text-[12px] font-bold mt-1 inline-block">${rootTexts}</span>`;
                              
                              conclusionColorClass = bestRoot.type === 'main' 
                                ? (isLight ? "text-rose-600 font-black" : "text-neon-pink") 
                                : bestRoot.type === 'sub_residual' 
                                  ? (isLight ? "text-emerald-700 font-black" : "text-emerald-400") 
                                  : (isLight ? "text-amber-700 font-black" : "text-yellow-400");
                              conclusionBgClass = bestRoot.type === 'main' 
                                ? (isLight ? "bg-rose-50 border-rose-200 text-slate-800" : "bg-neon-pink/5 border-neon-pink/20 text-white") 
                                : bestRoot.type === 'sub_residual' 
                                  ? (isLight ? "bg-emerald-58 border-emerald-200 text-slate-800" : "bg-emerald-950/10 border-emerald-900/25 text-white") 
                                  : (isLight ? "bg-amber-50 border-amber-200 text-slate-800" : "bg-yellow-950/10 border-yellow-900/25 text-white");
                            } else {
                              conclusionTitle = "☁️ Floating Qi (Unrooted)";
                              conclusionDesc = `Does not directly connect (root/generate) with the active stems.`;
                              conclusionColorClass = isLight ? "text-slate-400 font-bold" : "text-white/40";
                              conclusionBgClass = isLight ? "bg-slate-50 border-slate-200 text-slate-500" : "bg-white/5 border-white/10 text-white/50";
                            }
                          }
                        }

                        // 🤝 ACTIVE COMBINATION HELPERS HTML BUILDER
                        let combHtmlKo = "";
                        let combHtmlEn = "";
                        if (pRootDetails && pRootDetails.combinations && pRootDetails.combinations.length > 0) {
                          const combBg = isLight ? "bg-blue-50/70 border-blue-200 text-blue-950 font-medium" : "bg-neon-cyan/5 border-neon-cyan/10 text-indigo-200";
                          const combTitleBorder = isLight ? "border-slate-200" : "border-neon-cyan/20";
                          const combTitleClass = isLight ? "text-blue-600" : "text-neon-cyan";
                          combHtmlKo = `
                            <div class="pt-1.5 border-t ${combTitleBorder} space-y-1">
                              <div class="font-bold ${combTitleClass} flex items-center gap-1">🤝 삼합·방합·육합 지지 합화 지원:</div>
                              <ul class="text-[10px] pl-2 list-disc list-inside space-y-0.5 leading-relaxed p-1.5 rounded-lg border ${combBg} font-sans">
                                ${pRootDetails.combinations.map((c: any) => `<li>${c.ko}</li>`).join('')}
                              </ul>
                            </div>
                          `;
                          combHtmlEn = `
                            <div class="pt-1.5 border-t ${combTitleBorder} space-y-1">
                              <div class="font-bold ${combTitleClass} flex items-center gap-1">🤝 Active Branches Hap-hwa Support:</div>
                              <ul class="text-[10px] pl-2 list-disc list-inside space-y-0.5 leading-relaxed p-1.5 rounded-lg border ${combBg} font-display">
                                ${pRootDetails.combinations.map((c: any) => `<li>${c.en}</li>`).join('')}
                              </ul>
                            </div>
                          `;
                        }

                        const isYin = ["乙", "丁", "己", "辛", "癸"].includes(hs);
                        const hsNameEnBase = hsData?.en?.replace(/\s*\(.*?\)/, '') || hs;
                        const sunSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
                        const moonSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
                        const polarityIconSvg = isYin ? moonSvg : sunSvg;

                        const tooltipContentKo = `
<div class="space-y-2 text-xs ${isLight ? 'text-slate-900' : 'text-white/90'}">
  <div class="pb-1 border-b ${isLight ? 'border-slate-200' : 'border-white/10'} flex justify-between items-center font-display">
    <div class="flex items-center gap-1.5">
      <span class="font-bold ${isLight ? 'text-slate-800' : 'text-neon-cyan'} text-sm">${hs} (${hsData?.ko || hs})</span>
      <span class="flex items-center justify-center w-5 h-5 rounded-full border ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'} shadow-sm">${polarityIconSvg}</span>
    </div>
    <span class="text-[10px] ${isLight ? 'bg-slate-100' : 'bg-white/10'} px-1 py-0.5 rounded font-bold" style="color: ${getTenGodColor(hsTenGod.ko)}">${hsTenGod.ko}</span>
  </div>
  <div class="flex items-center gap-1.5 py-0.5">
    <span class="${isLight ? 'text-slate-500' : 'text-white/50'}">속성:</span>
    <span class="font-bold" style="color: ${colorHex}">${hsDataElementKo} (${hsData?.element})</span>
  </div>
  
  <div class="pt-1.5 border-t ${isLight ? 'border-indigo-100' : 'border-white/10'} space-y-1">
    <div class="font-bold text-[11.5px] tracking-tight ${conclusionColorClass} flex items-center gap-1">${conclusionTitle}</div>
    <div class="pl-2 leading-relaxed text-[11px] p-2 rounded-lg border ${conclusionBgClass} font-sans">
      ${conclusionDesc}
    </div>
  </div>

  ${!isDestroyed ? combHtmlKo : ''}
</div>
`;

                        const tooltipContentEn = `
<div class="space-y-2 text-xs ${isLight ? 'text-slate-900' : 'text-white/90'}">
  <div class="pb-1 border-b ${isLight ? 'border-slate-200' : 'border-white/10'} flex justify-between items-center font-display">
    <div class="flex items-center gap-1.5">
      <span class="font-bold ${isLight ? 'text-slate-800' : 'text-neon-cyan'} text-sm">${hs} (${hsNameEnBase})</span>
      <span class="flex items-center justify-center w-5 h-5 rounded-full border ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'} shadow-sm">${polarityIconSvg}</span>
    </div>
    <span class="text-[10px] ${isLight ? 'bg-slate-100' : 'bg-white/10'} px-1 py-0.5 rounded font-bold" style="color: ${getTenGodColor(hsTenGod.ko)}">${hsTenGod.en}</span>
  </div>
  <div class="flex items-center gap-1.5 py-0.5">
    <span class="${isLight ? 'text-slate-500' : 'text-white/50'}">Element:</span>
    <span class="font-bold" style="color: ${colorHex}">${hsData?.element}</span>
  </div>
  
  <div class="pt-1.5 border-t ${isLight ? 'border-indigo-100' : 'border-white/10'} space-y-1">
    <div class="font-bold text-[11.5px] tracking-tight ${conclusionColorClass} flex items-center gap-1">${conclusionTitle}</div>
    <div class="pl-2 leading-relaxed text-[11px] p-2 rounded-lg border ${conclusionBgClass} font-display">
      ${conclusionDesc}
    </div>
  </div>

  ${!isDestroyed ? combHtmlEn : ''}

  <div class="pt-2 border-t ${isLight ? 'border-indigo-100' : 'border-white/10'} text-[9px] ${isLight ? 'text-slate-500' : 'text-white/40'} font-mono leading-relaxed hidden">
    <div class="font-bold ${isLight ? 'text-slate-700' : 'text-white/65'} text-[9.5px] mb-1">🏷️ Tag Legend Guide:</div>
    <div class="grid grid-cols-2 gap-x-2 gap-y-0.5">
      <div>• <strong>main</strong>: Stem Main Root</div>
      <div>• <strong>E-MN</strong>: DM Main Root</div>
      <div>• <strong>sub</strong>: Stem Sub/Resi Root</div>
      <div>• <strong>E-SB</strong>: DM Sub/Resi Root</div>
      <div>• <strong>gen</strong>: Stem Nourish Support</div>
      <div>• <strong>E-GN</strong>: DM Nourish Support</div>
    </div>
  </div>
</div>
`;

                        const bestTagInfo = allRootedStems[0];
                        const itemMinWidthClass = lang === 'KO' 
                          ? 'min-w-[24px] sm:min-w-[32px] md:min-w-[42px]' 
                          : 'min-w-[32px] sm:min-w-[44px] md:min-w-[54px] lg:min-w-[62px]';

                        return (
                          <BaziTooltip 
                            key={idx}
                            content={{ ko: tooltipContentKo, en: tooltipContentEn }}
                            lang={lang}
                          >
                            <div 
                              onMouseEnter={() => setHoveredHiddenStem({pillarIdx: i, hsIdx: idx, hs, connectedStems: allRootedStems.map(r => r.stem), isDestroyed})}
                              onMouseLeave={() => setHoveredHiddenStem(null)}
                              className={`flex flex-col items-center p-1 sm:p-1.5 md:p-2 rounded ${itemMinWidthClass} border transition-all duration-300 relative ${highlightClass}`}
                            >
                              {isDestroyed && (
                                <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border ${isLight ? 'border-white shadow-[0_0_4px_rgba(239,68,68,0.5)]' : 'border-black shadow-[0_0_4px_rgba(239,68,68,0.8)]'} animate-pulse`} />
                              )}
                              {isTwisted && (
                                <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 border ${isLight ? 'border-white shadow-[0_0_4px_rgba(245,158,11,0.5)]' : 'border-black shadow-[0_0_4px_rgba(245,158,11,0.8)]'} animate-pulse`} />
                              )}
                              <div 
                                className="text-[10px] sm:text-xs md:text-sm font-semibold mb-0.5 text-center px-0.5"
                                style={{ color: colorHex }}
                              >
                                {showHanja ? hs : (lang === 'KO' ? hsData?.ko : (hsNameEnBase.length <= 4 ? hsNameEnBase : (hsNameEnBase === 'Byeong' ? 'Byg.' : (hsNameEnBase === 'Gyeong' ? 'Gyg.' : (hsNameEnBase === 'Jeong' ? 'Jeg.' : hsNameEnBase.substring(0, 3) + '.')))))}
                              </div>
                              <div 
                                className="text-[7.5px] sm:text-[9.5px] md:text-[11px] font-bold tracking-tighter opacity-70 animate-pulse duration-1000 mb-0.5 w-full text-center"
                                style={{ color: getTenGodColor(hsTenGod.ko) }}
                              >
                                {lang === 'KO' ? (
                                  hsTenGod.ko
                                ) : (
                                  <>
                                    <span className="block sm:hidden text-[7.5px]">
                                      {hsTenGod.en.substring(0, 3)}
                                    </span>
                                    <span className="hidden sm:block text-[8.5px] md:text-[10px] truncate w-full px-0.5">
                                      {hsTenGod.en}
                                    </span>
                                  </>
                                )}
                              </div>

                              {/* Micro tag indicating the rooting relationship */}
                              {bestTagInfo && (
                                <div className={`mt-0.5 font-sans px-1 py-[3px] text-[6.5px] sm:text-[8.5px] md:text-[9.5px] leading-none rounded-[3px] font-extrabold pb-[2px] tracking-tighter ${
                                  bestTagInfo.type === 'main' 
                                    ? (isDamaged 
                                        ? (isLight ? 'bg-amber-400 text-black shadow-sm' : 'bg-red-500/20 text-red-300 border border-red-500/30') 
                                        : (isLight ? 'bg-amber-400 text-black shadow-sm' : 'bg-neon-cyan/25 text-neon-cyan border border-neon-cyan/30'))
                                    : bestTagInfo.type === 'sub_residual'
                                      ? (isDamaged 
                                          ? (isLight ? 'bg-blue-400 text-black shadow-sm' : 'bg-red-500/10 text-red-400/80 border border-red-500/20') 
                                          : (isLight ? 'bg-blue-400 text-black shadow-sm' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'))
                                      : (isLight ? 'bg-emerald-400 text-black shadow-sm' : 'bg-amber-500/20 text-amber-300 border border-[#f5b800]/30')
                                }`}>
                                  {lang === 'KO' 
                                    ? (bestTagInfo.pIdx === i 
                                        ? (bestTagInfo.type === 'main' ? '본기' : bestTagInfo.type === 'sub_residual' ? '중여' : '생조')
                                        : (bestTagInfo.type === 'main' 
                                            ? bestTagInfo.pNameKo 
                                            : bestTagInfo.type === 'sub_residual' 
                                              ? (bestTagInfo.pNameKo.charAt(0) + '중') 
                                              : (bestTagInfo.pNameKo.charAt(0) + '생'))
                                      )
                                    : (bestTagInfo.pIdx === i 
                                        ? (bestTagInfo.type === 'main' ? 'MAIN' : bestTagInfo.type === 'sub_residual' ? 'SUB' : 'GEN')
                                        : (bestTagInfo.type === 'main' 
                                            ? `${bestTagInfo.pNameEn === 'DM' ? 'DM' : bestTagInfo.pNameEn}-MN` 
                                            : bestTagInfo.type === 'sub_residual' 
                                              ? `${bestTagInfo.pNameEn === 'DM' ? 'DM' : bestTagInfo.pNameEn}-SB` 
                                              : `${bestTagInfo.pNameEn === 'DM' ? 'DM' : bestTagInfo.pNameEn}-GN`))
                                  }
                                </div>
                              )}
                              
                              {/* Visible placeholder or actual sub root */}
                              {!bestTagInfo ? (
                                <div 
                                  className="mt-0.5 font-sans px-1 py-[3px] text-[6.5px] sm:text-[8.5px] md:text-[9.5px] leading-none rounded-[3px] pb-[2px] tracking-tighter opacity-0 select-none pointer-events-none" 
                                  aria-hidden="true"
                                >
                                  {lang === 'KO' ? '본기' : 'MAIN'}
                                </div>
                              ) : null}
                            </div>
                          </BaziTooltip>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {/* Grand Cycle Timeline */}
      <div className={`space-y-6 transition-all duration-500 ease-in-out relative ${guideStep === 7 ? 'scale-105 z-50 p-4 bg-black/40 border border-neon-cyan/40 rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.2)]' : ''} ${guideStep > 0 && guideStep !== 7 ? 'opacity-20 blur-[2px] grayscale-[50%]' : 'z-10'}`}>
        <AnimatePresence>
          {guideStep === 7 && (
            <motion.div 
              key="guideStep7"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute left-0 right-0 z-[60] p-4 sm:p-6 rounded-2xl border border-neon-cyan/40 bg-goth-bg/95 shadow-[0_0_30px_rgba(0,242,255,0.3)] pointer-events-auto bottom-[100%] mb-4`}
            >
              <button onClick={() => setGuideStep(0)} className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center shrink-0 border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                  <span className="text-2xl" role="img" aria-label="seasons">🌤️</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-base sm:text-lg font-bold text-neon-cyan mb-1 flex items-center gap-2">
                    {lang === 'KO' ? '대운 (Daewun) - 내게 주어진 10년의 테마' : 'Daewun - The 10-Year Life Theme'}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-white/70 whitespace-nowrap">
                      Step 7 / 7
                    </span>
                  </h4>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                    {lang === 'KO' ? '계절이 바뀌듯 10년 단위로 당신에게 펼쳐지는 환경과 무대입니다. 인생의 어떤 계절을 지나고 있는지 확인해보세요.' : 'Just like seasons change, this represents the shifting environment and theme you face every 10 years.'}
                  </p>
                  <div className="flex gap-2 justify-end w-full">
                    <button onClick={() => setShowGuideDetailModal(true)} className="px-4 py-2 text-xs sm:text-sm rounded border border-white/20 text-white hover:bg-white/10 transition-colors mr-auto">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {lang === 'KO' ? '자세히 알아보기' : 'Learn More'}
                      </span>
                    </button>
                    <button onClick={() => setGuideStep(6)} className="px-4 py-2 text-xs sm:text-sm rounded border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                      {lang === 'KO' ? '이전' : 'Prev'}
                    </button>
                    <button onClick={() => setGuideStep(0)} className="px-5 py-2 text-xs sm:text-sm rounded bg-neon-pink/20 border border-neon-pink text-neon-pink hover:bg-neon-pink/30 flex items-center justify-center transition-colors">
                      {lang === 'KO' ? '가이드 종료' : 'Finish Guide'} <CheckCircle2 className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <h3 className="text-xs font-display font-bold tracking-[0.4em] text-white/60 uppercase text-center flex items-center justify-center gap-2">
          {t.grandCycle}
          <BaziTooltip content={{ ko: "대운(환경): 10년 동안 내가 처한 '무대'야. 기존의 틀을 깨고 새로운 아이디어를 내놓아야 하는 환경 혹은 내 재능을 세상에 드러내야 하는 10년이지.\n세운(사건): 그 10년 중 올해 일어나는 '구체적인 사건'이야. 깊이 있는 공부, 문서 계약, 혹은 예리한 통찰력을 발휘할 일이 생겨.", en: "Life Seasons (Environment): The 'stage' you are in for 10 years. An environment where you need to break existing molds and propose new ideas, or a period to reveal your talents.\nSe-woon (Event): The 'specific event' that happens this year within those 10 years. Deep study, document contracts, or exercising sharp insight." }} lang={lang}>
            <HelpCircle className="w-3 h-3 cursor-help" />
          </BaziTooltip>
        </h3>
        <div className="relative overflow-x-auto pb-4 scrollbar-neon-purple" dir="rtl">
          <div className="flex gap-4 min-w-max px-4 flex-row-reverse">
            {[...result.grandCycles].reverse().map((cycle, i) => {
              const actualIndex = result.grandCycles.length - 1 - i;
              const isCurrent = actualIndex === result.currentCycleIndex;
              const isExpanded = expandedCycle === actualIndex;

              return (
                <div key={actualIndex} className="flex flex-col items-center w-[72px] sm:w-[88px]" dir="ltr">
                  <div className="text-xs text-white/40 font-mono h-[18px] flex items-center justify-center">
                    {cycle.year}
                  </div>
                  <div 
                    className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center text-center h-[28px] mb-1.5" 
                    style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[cycle.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}
                  >
                    {renderTenGodLabel(cycle.stemTenGodKo, cycle.stemTenGodEn, cycle.stemPolarity)}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setExpandedCycle(isExpanded ? null : actualIndex);
                      setExpandedYear(null);
                      setExpandedMonth(null);
                    }}
                    className={`w-full min-h-[104px] flex-1 rounded-xl transition-all flex flex-col items-center justify-start p-2 relative shadow-sm ${
                      isCurrent 
                        ? (theme === 'light' ? 'ring-2 ring-pink-400 bg-pink-50 shadow-[0_4px_12px_rgba(236,72,153,0.15)] z-10' : 'ring-2 ring-neon-pink bg-[#1a0515] border border-neon-pink/50 shadow-[0_0_20px_rgba(255,0,122,0.4)] z-10')
                        : (theme === 'light' ? 'bg-white border border-slate-200 hover:bg-slate-50' : 'bg-black/80 border border-white/10 hover:bg-white/10')
                    }`}
                  >
                    <div className={`text-[9px] sm:text-[10px] font-bold mb-1 uppercase leading-[1.1] text-center px-0.5 min-h-[22px] flex items-center justify-center ${isCurrent ? (theme === 'light' ? 'text-pink-600' : 'text-neon-pink') : (theme === 'light' ? 'text-slate-400' : 'text-white/40')}`}>
                      {getLifeStage(cycle.age)}
                    </div>
                    <div className={`text-sm font-bold mb-1.5 ${isCurrent ? (theme === 'light' ? 'text-slate-900' : 'text-white') : (theme === 'light' ? 'text-slate-800' : 'text-white')}`}>{cycle.age}</div>
                    <div 
                      className="text-[10px] md:text-xs font-gothic leading-tight text-center mb-0.5"
                      style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[cycle.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                    >
                      {renderPillarText('stem', cycle.stem)}
                    </div>
                    <div 
                      className="text-[10px] md:text-xs font-gothic leading-tight text-center opacity-80"
                      style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[cycle.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                    >
                      {renderPillarText('branch', cycle.branch)}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0B0416] rounded-full p-0.5">
                      {isExpanded ? <ChevronUp className="w-3 h-3 text-neon-pink" /> : <ChevronDown className="w-3 h-3 text-white/20" />}
                    </div>
                  </motion.button>
                  <div 
                    className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center text-center h-[28px] mt-1.5" 
                    style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[cycle.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}
                  >
                    {renderTenGodLabel(cycle.branchTenGodKo, cycle.branchTenGodEn, cycle.branchPolarity)}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Timeline Line removed */}
        </div>

        {/* Annual Pillars Breakdown (Se-Un) */}
        <AnimatePresence mode="wait">
          {expandedCycle !== null && result.grandCycles[expandedCycle]?.annualPillars && (
            <motion.div
              key={`annual-${expandedCycle}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="goth-glass rounded-2xl p-4 border border-white/10 space-y-4"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[1px] w-8 bg-white/20"></div>
                <div className="text-xs font-display font-medium text-white/60 uppercase tracking-[0.2em] text-center">Annual Alignment (Se-Un)</div>
                <div className="h-[1px] w-8 bg-white/20"></div>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-neon-cyan px-2">
                {result.grandCycles[expandedCycle].annualPillars.map((ap, api) => {
                  const isYearExpanded = expandedYear === api;
                  const isCurrentYear = ap.year === currentYear;
                  
                  let borderClass = 'border-white/5';
                  if (isYearExpanded) borderClass = 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_10px_rgba(0,255,255,0.2)]';
                  else if (isCurrentYear) borderClass = 'border-neon-pink bg-neon-pink/5';

                  return (
                    <div key={api} className="flex flex-col items-center space-y-1 w-16 flex-shrink-0">
                      <div className="text-[10px] font-mono text-white/40">{ap.year}</div>
                      <div 
                        className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center text-center h-[28px] w-full" 
                        style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[ap.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}
                      >
                        {renderTenGodLabel(ap.stemTenGodKo, ap.stemTenGodEn, ap.stemPolarity)}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setExpandedYear(isYearExpanded ? null : api);
                          setExpandedMonth(null);
                        }}
                        className={`w-full bg-white/5 rounded-lg p-2 flex flex-col items-center border transition-all relative ${borderClass}`}
                      >
                        <div className="text-xs font-bold text-white mb-1">{ap.age}</div>
                        <div 
                          className="text-[10px] font-gothic font-bold text-center"
                          style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[ap.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                        >
                          {renderPillarText('stem', ap.stem)}
                        </div>
                        <div 
                          className="text-[10px] font-gothic text-center opacity-70"
                          style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[ap.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                        >
                          {renderPillarText('branch', ap.branch)}
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                          {isYearExpanded ? <ChevronUp className="w-2 h-2 text-neon-cyan" /> : <ChevronDown className="w-2 h-2 text-white/20" />}
                        </div>
                      </motion.button>
                      <div 
                        className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter flex items-center justify-center text-center h-[28px] w-full" 
                        style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[ap.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}
                      >
                        {renderTenGodLabel(ap.branchTenGodKo, ap.branchTenGodEn, ap.branchPolarity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Monthly Breakdown for the selected year */}
              <AnimatePresence mode="wait">
                {expandedYear !== null && result.grandCycles[expandedCycle].annualPillars[expandedYear]?.monthlyPillars && (
                  <motion.div
                    key={`monthly-${expandedCycle}-${expandedYear}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-white/5"
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="h-[1px] w-6 bg-white/10"></div>
                      <div className="text-[11px] font-display font-medium text-white/40 uppercase tracking-[0.2em] text-center">Monthly Pulse</div>
                      <div className="h-[1px] w-6 bg-white/10"></div>
                    </div>
                    <div className="overflow-x-auto pb-4 scrollbar-neon-pink">
                      <div className="flex gap-4 min-w-max">
                        {result.grandCycles[expandedCycle].annualPillars[expandedYear].monthlyPillars.map((m, mi) => {
                          const isMonthExpanded = expandedMonth === mi;
                          const isCurrentMonth = m.month === currentMonth && result.grandCycles[expandedCycle].annualPillars[expandedYear].year === currentYear;
                          
                          let borderClass = 'border-white/5';
                          if (isMonthExpanded) borderClass = 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_10px_rgba(0,255,255,0.2)]';
                          else if (isCurrentMonth) borderClass = 'border-neon-pink bg-neon-pink/5';

                          return (
                            <div key={mi} className="flex flex-col items-center space-y-1 w-24">
                              <div className="text-[13px] font-mono text-white/90 font-bold uppercase">
                                {t.months[m.month - 1]}
                              </div>
                              <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[m.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                                <PolarityIcon polarity={m.stemPolarity} size={6} />
                                {lang === 'KO' ? m.stemTenGodKo : m.stemTenGodEn}
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setExpandedMonth(isMonthExpanded ? null : mi)}
                                className={`w-full bg-white/5 rounded-lg p-3 flex flex-col items-center border transition-all min-h-[70px] justify-center relative ${borderClass}`}
                              >
                                <div 
                                  className="text-[10px] font-gothic font-bold text-center"
                                  style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[m.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                >
                                  {renderPillarText('stem', m.stem)}
                                </div>
                                <div 
                                  className="text-[10px] font-gothic text-center opacity-70"
                                  style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[m.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                >
                                  {renderPillarText('branch', m.branch)}
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                                  {isMonthExpanded ? <ChevronUp className="w-2 h-2 text-neon-pink" /> : <ChevronDown className="w-2 h-2 text-white/20" />}
                                </div>
                              </motion.button>
                              <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[m.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
                                <PolarityIcon polarity={m.branchPolarity} size={6} />
                                {lang === 'KO' ? m.branchTenGodKo : m.branchTenGodEn}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Daily Breakdown for the selected month - Moved outside of monthly scroll container */}
                    {expandedMonth !== null && result.grandCycles[expandedCycle].annualPillars[expandedYear].monthlyPillars[expandedMonth]?.dailyPillars ? (
                      <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <div className="h-[1px] w-4 bg-white/5"></div>
                          <div className="text-[11px] font-display font-medium text-white/30 uppercase tracking-[0.2em] text-center">Daily Rhythm (Full Month)</div>
                          <div className="h-[1px] w-4 bg-white/5"></div>
                        </div>
                        <div className="overflow-x-auto pb-4 scrollbar-neon-cyan px-2">
                          <div className="flex gap-3 min-w-max">
                            {result.grandCycles[expandedCycle].annualPillars[expandedYear].monthlyPillars[expandedMonth].dailyPillars.map((d, di) => {
                              const isCurrentDay = d.day === currentDay && 
                                                   result.grandCycles[expandedCycle].annualPillars[expandedYear].monthlyPillars[expandedMonth].month === currentMonth && 
                                                   result.grandCycles[expandedCycle].annualPillars[expandedYear].year === currentYear;
                              const isDaySelected = selectedDay === di;
                              
                              let borderClass = 'border-white/5';
                              if (isDaySelected) borderClass = 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_10px_rgba(0,255,255,0.2)]';
                              else if (isCurrentDay) borderClass = 'border-neon-pink bg-neon-pink/5';

                              return (
                                <div key={di} className="flex flex-col items-center space-y-1 w-16 flex-shrink-0">
                                  <div className="text-[12px] font-mono text-white/90 font-bold">{d.day}</div>
                                  <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[d.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                                    <PolarityIcon polarity={d.stemPolarity} size={5} />
                                    {lang === 'KO' ? d.stemTenGodKo : d.stemTenGodEn}
                                  </div>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDay(isDaySelected ? null : di)}
                                    className={`w-full bg-white/5 rounded-lg p-2 flex flex-col items-center border transition-all ${borderClass}`}
                                  >
                                    <div 
                                      className="text-[10px] font-gothic font-bold text-center"
                                      style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[d.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                    >
                                      {renderPillarText('stem', d.stem)}
                                    </div>
                                    <div 
                                      className="text-[10px] font-gothic text-center opacity-70"
                                      style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[d.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                    >
                                      {renderPillarText('branch', d.branch)}
                                    </div>
                                  </motion.button>
                                  <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[d.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
                                    <PolarityIcon polarity={d.branchPolarity} size={5} />
                                    {lang === 'KO' ? d.branchTenGodKo : d.branchTenGodEn}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Saju Analysis Report Section */}
      <div id="analysis-report-section" className="flex flex-col items-center space-y-6 pt-8 w-full">
        <AnimatePresence>
          {showAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full overflow-hidden"
            >
              <div className="goth-glass p-6 rounded-2xl border border-white/10 space-y-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-12 bg-neon-cyan/50"></div>
                  <h3 className="text-xl font-display font-medium text-neon-cyan uppercase tracking-[0.2em]">
                    {lang === 'KO' ? '오행 분석 리포트' : 'Elemental Analysis Report'}
                  </h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-cyan/20 to-transparent"></div>
                </div>

                {result.isTimeUnknown && (
                  <div className="mb-6 p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {lang === 'KO' 
                        ? '시주(시간)가 미반영된 삼주 기반 분석입니다. 생시를 포함하면 오행의 비율 및 분석 결과가 크게 달라질 수 있습니다.'
                        : 'This is a Three-Pillar analysis excluding birth time. Providing the exact time can significantly alter the elemental distribution and subsequent analysis.'}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={elementData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {elementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--color-chart-tooltip-bg)', border: '1px solid var(--color-chart-grid)', borderRadius: '8px' }}
                          itemStyle={{ color: 'var(--color-chart-text)' }}
                          formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {elementData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-sm text-white/80 font-mono">{d.name}: {d.value.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                    <div className={`p-4 rounded-xl border ${isLight ? 'bg-white shadow-sm border-slate-200' : 'bg-black/40 border-white/5'}`}>
                      <div 
                        className="text-sm font-display leading-relaxed text-white/90 italic"
                        dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(getAnalysisText()) }}
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced Analysis Section */}
                {result.analysis && (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-white/10 items-stretch">
                      {/* Left Column: Structure, Useful God & Interactions (Stacked vertically) */}
                      <div className="lg:col-span-5 space-y-6 flex flex-col justify-start">
                        {/* 격국과 용신 */}
                        <div className="space-y-4">
                          <BaziTooltip content={BAZI_MAPPING.tooltips.geJu} lang={lang}>
                            <div className="flex items-center gap-3 mb-4 cursor-help">
                              <div className="h-[1px] w-8 bg-neon-pink/50"></div>
                              <h4 className="text-sm font-display font-medium text-neon-pink uppercase tracking-[0.2em]">{lang === 'KO' ? '격국과 용신 (Structure & Useful God)' : 'Structure & Useful God'}</h4>
                              <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-pink/20 to-transparent"></div>
                            </div>
                          </BaziTooltip>
                          <div className={`p-4 rounded-xl space-y-3 border ${isLight ? 'bg-white shadow-sm border-slate-200 text-slate-700' : 'bg-black/40 border-white/5 text-white/90'}`}>
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-1 cursor-help" onClick={() => setShowGeJuInfo(true)}>
                                  <span className={`text-xs shrink-0 pt-0.5 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{lang === 'KO' ? '격국 (Structure)' : 'Structure'}</span>
                                  <HelpCircle className="w-3 h-3 text-neon-cyan/60" />
                                </div>
                                <div className="text-right">
                                  <span className={`font-bold block flex items-center justify-end flex-wrap gap-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                                    {(() => {
                                      const baseGeJu = result.analysis.structureDetail 
                                        ? (lang === 'KO' ? result.analysis.structureDetail.title : result.analysis.structureDetail.enTitle)
                                        : (lang === 'KO' ? result.analysis.geJu : (BAZI_MAPPING.geju[result.analysis.geJu as keyof typeof BAZI_MAPPING.geju]?.en || result.analysis.geJu));
                                      
                                      const spPattern = result.analysis.specialPatterns?.[0];
                                      if (spPattern) {
                                        return (
                                          <>
                                            <BaziTooltip content={{ ko: spPattern.effect, en: spPattern.enEffect }} lang={lang}>
                                              <span className="cursor-help text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple font-extrabold hover:underline decoration-neon-pink drop-shadow-[0_0_8px_rgba(255,0,128,0.5)]">
                                                {lang === 'KO' ? spPattern.name.replace('격', '') : spPattern.enName}
                                              </span>
                                            </BaziTooltip>
                                            <span>
                                              {lang === 'KO' ? '의 ' : ' + '}
                                            </span>
                                            <span>{baseGeJu}</span>
                                          </>
                                        );
                                      }
                                      return <span>{baseGeJu}</span>;
                                    })()}
                                  </span>
                                  {result.analysis.structureDetail && (
                                    <span className="text-[10px] text-neon-pink/70 font-medium uppercase tracking-wider">
                                      {result.analysis.structureDetail.category === 'Standard' ? (lang === 'KO' ? '내격' : 'Standard') : (lang === 'KO' ? '종격/전왕격' : 'Special')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {result.analysis.structureDetail && (
                                <div className={`mt-1 p-2 rounded border text-[10px] leading-relaxed italic ${isLight ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                  {result.analysis.structureDetail.logicNote}
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex items-center gap-1 cursor-help" onClick={() => setShowStrengthInfo(true)}>
                                <span className={`text-xs shrink-0 pt-0.5 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{lang === 'KO' ? '일간 강약 (DM Strength)' : 'DM Strength'}</span>
                                <HelpCircle className="w-3 h-3 text-neon-cyan/60" />
                              </div>
                              <span className={`font-bold text-right ${isLight ? 'text-slate-800' : 'text-white'}`}>{getStrengthLevel(result.analysis.dayMasterStrength.level)} ({result.analysis.dayMasterStrength.score.toFixed(1)})</span>
                            </div>
                            <div className="flex justify-between items-start gap-4">
                              <BaziTooltip content={BAZI_MAPPING.tooltips.yongShen} lang={lang}>
                                <div className="flex items-center gap-1 cursor-help" onClick={() => setShowYongshinInfo(true)}>
                                  <span className={`text-xs shrink-0 pt-0.5 ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{lang === 'KO' ? '용신 (Useful God)' : 'Useful God'}</span>
                                  <HelpCircle className={`w-3 h-3 transition-colors cursor-pointer ${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-white/40 hover:text-white'}`} />
                                </div>
                              </BaziTooltip>
                              <span className={`font-bold text-right ${isLight ? 'text-pink-600' : 'text-neon-pink'}`}>{result.analysis.yongShen}</span>
                            </div>
                            {result.analysis?.yongshinDetail?.byeongYak && (
                              <div className="pt-2 border-t border-white/5 space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="h-[1px] w-4 bg-yellow-400/50"></div>
                                  <div className="text-[10px] font-display font-medium text-yellow-400/80 uppercase tracking-[0.2em]">{lang === 'KO' ? '병약용신' : 'Byeong-Yak'}</div>
                                </div>
                                <div className="text-xs text-yellow-400/80 italic">{lang === 'KO' ? result.analysis.yongshinDetail.byeongYak.note : result.analysis.yongshinDetail.byeongYak.noteEn}</div>
                              </div>
                            )}
                            {result.analysis?.yongshinDetail?.tongGwan && (
                              <div className="pt-2 border-t border-white/5 space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="h-[1px] w-4 bg-neon-cyan/50"></div>
                                  <div className="text-[10px] font-display font-medium text-neon-cyan/80 uppercase tracking-[0.2em]">{lang === 'KO' ? '통관용신' : 'Tong-Gwan'}</div>
                                  <motion.button 
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowTongGwanInfo(true)} 
                                    className="text-neon-cyan/60 hover:text-neon-cyan transition-colors" 
                                    title={lang === 'KO' ? '설명 보기' : 'View explanation'}
                                  >
                                    <HelpCircle className="w-3 h-3" />
                                  </motion.button>
                                </div>
                                <div className="text-xs text-neon-cyan/80 italic">{lang === 'KO' ? result.analysis.yongshinDetail.tongGwan.note : result.analysis.yongshinDetail.tongGwan.noteEn}</div>
                              </div>
                            )}
                            {result.analysis?.yongshinDetail?.eokbu && (
                              <div className="pt-2 border-t border-white/5 space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="h-[1px] w-4 bg-neon-pink/50"></div>
                                  <div className="text-[10px] font-display font-medium text-neon-pink/80 uppercase tracking-[0.2em]">{lang === 'KO' ? '억부용신' : 'Eokbu'}</div>
                                  <motion.button 
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowEokbuInfo(true)} 
                                    className="text-neon-pink/60 hover:text-neon-pink transition-colors" 
                                    title={lang === 'KO' ? '설명 보기' : 'View explanation'}
                                  >
                                    <HelpCircle className="w-3 h-3" />
                                  </motion.button>
                                </div>
                                <div className="text-xs text-neon-pink/80 italic">{lang === 'KO' ? result.analysis.yongshinDetail.eokbu.note : result.analysis.yongshinDetail.eokbu.noteEn}</div>
                              </div>
                            )}
                            {result.analysis?.balanceWarnings && result.analysis.balanceWarnings.length > 0 && (
                              <div className="pt-2 border-t border-white/5 space-y-2">
                                {result.analysis.balanceWarnings.map((warning, idx) => (
                                  <div key={idx} className={`p-2 rounded border ${warning.type === 'danger' ? 'bg-red-500/10 border-red-500/30 text-[#fca5a5]' : 'bg-orange-500/10 border-orange-500/30 text-[#fed7aa]'} space-y-1`}>
                                    <div className="flex items-center gap-2">
                                      <AlertTriangle className={`w-3 h-3 ${warning.type === 'danger' ? 'text-red-400' : 'text-orange-400'}`} />
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${warning.type === 'danger' ? 'text-red-400' : 'text-orange-400'}`}>
                                        {lang === 'KO' ? warning.title : warning.titleEn}
                                      </span>
                                    </div>
                                    <div className={`text-[10px] leading-relaxed ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                                      <ParsedText lang={lang} text={lang === 'KO' ? warning.description : warning.enDescription} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="pt-4 border-t border-white/5 space-y-2">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-[1px] w-4 bg-purple-400/50"></div>
                                  <div className={`text-[10px] font-display font-medium uppercase tracking-[0.2em] ${isLight ? 'text-purple-600' : 'text-purple-400/80'}`}>
                                    {lang === 'KO' ? '희·기·구신' : 'Supporting Energies'}
                                  </div>
                                </div>
                                <motion.button 
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setShowYongshinRolesInfo(true)} 
                                  className="text-purple-400/60 hover:text-purple-400 transition-colors" 
                                  title={lang === 'KO' ? '설명 보기' : 'View explanation'}
                                >
                                  <HelpCircle className="w-3 h-3" />
                                </motion.button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col items-center">
                                  <span className={`text-[9px] uppercase ${isLight ? 'text-slate-400 font-medium' : 'text-white/40'}`}>{lang === 'KO' ? '희신' : 'HeeShin'}</span>
                                  {renderYongshinWithElement(result.analysis.yongshinDetail.heeShin.god)}
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className={`text-[9px] uppercase ${isLight ? 'text-slate-400 font-medium' : 'text-white/40'}`}>{lang === 'KO' ? '기신' : 'GiShin'}</span>
                                  {result.analysis.yongshinDetail.giShin.god ? (
                                    renderYongshinWithElement(result.analysis.yongshinDetail.giShin.god)
                                  ) : (
                                    <div className={`text-[10px] italic mt-1 text-center ${isLight ? 'text-slate-500' : 'text-white/60'}`}>
                                      {lang === 'KO' ? '해당 국격은 기신이 없어.' : 'No GiShin for this structure.'}
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className={`text-[9px] uppercase ${isLight ? 'text-slate-400 font-medium' : 'text-white/40'}`}>{lang === 'KO' ? '구신' : 'GuShin'}</span>
                                  {renderYongshinWithElement(result.analysis.yongshinDetail.guShin.god)}
                                </div>
                                {result.analysis.yongshinDetail.hanShin && (
                                  <div className="flex flex-col items-center">
                                    <span className={`text-[9px] uppercase ${isLight ? 'text-slate-400 font-medium' : 'text-white/40'}`}>{lang === 'KO' ? '한신' : 'HanShin'}</span>
                                    {renderYongshinWithElement(result.analysis.yongshinDetail.hanShin.god)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 합형충파해 */}
                        <div className="space-y-4">
                          <BaziTooltip content={BAZI_MAPPING.tooltips.interactions} lang={lang}>
                            <div className="flex items-center gap-3 mb-4 cursor-help">
                              <div className="h-[1px] w-8 bg-neon-cyan/50"></div>
                              <h4 className="text-sm font-display font-medium text-neon-cyan uppercase tracking-[0.2em]">{lang === 'KO' ? '합형충파해 (Interactions)' : 'Interactions'}</h4>
                              <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-cyan/20 to-transparent"></div>
                            </div>
                          </BaziTooltip>
                          <div className={`p-4 rounded-xl space-y-4 border ${isLight ? 'bg-white shadow-sm border-slate-200 text-slate-700' : 'bg-black/40 border-white/5 text-white/90'}`}>
                            {result.analysis.interactions.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {result.analysis.interactions.map((interaction, i) => {
                                  let tooltipContent = getInteractionTooltip(interaction);
                                  let displayNote = interaction.note;
                                  
                                  if (interaction.note && interaction.note.includes('|')) {
                                    const [koNote, enNote] = interaction.note.split('|');
                                    displayNote = lang === 'KO' ? koNote : enNote;
                                    
                                    // Colorize the interaction elements in the tooltip
                                    const colorizeNote = (note: string) => {
                                      let colorized = note;
                                      const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                                      
                                      const stems = interaction.stems || [];
                                      const branches = interaction.branches || [];
                                      const pillarIndices = interaction.pillarIndices || [];
    
                                      // Colorize stems and their associated Ten Gods/Pillar names
                                      stems.forEach(stem => {
                                        const element = STEM_ELEMENTS[stem];
                                        const color = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
                                        
                                        pillarIndices.forEach(idx => {
                                          if (result.pillars[idx].stem === stem) {
                                            const tenGod = lang === 'KO' ? result.pillars[idx].stemKoreanName : result.pillars[idx].stemEnglishName;
                                            const pillarName = lang === 'KO' ? ["시주", "일주", "월주", "연주"][idx] : ["Time", "Day", "Month", "Year"][idx];
                                            const pillarMeaning = lang === 'KO' ? ["자식/미래", "나/배우자", "부모/사회", "조상/근본"][idx] : ["Children/Future", "Self/Spouse", "Parents/Society", "Ancestors/Roots"][idx];
    
                                            // Replace bare words to ensure they are colored everywhere
                                            const wordsToColor = [tenGod, pillarName, pillarMeaning, stem];
                                            wordsToColor.forEach(word => {
                                              if (word) {
                                                const regex = new RegExp(`(${escapeRegex(word)})`, 'g');
                                                colorized = colorized.replace(regex, `<span style="color: ${color}; font-weight: bold;">$1</span>`);
                                              }
                                            });
                                          }
                                        });
                                      });
    
                                      // Colorize branches and their associated Ten Gods/Pillar names
                                      branches.forEach(branch => {
                                        const element = BRANCH_ELEMENTS[branch];
                                        const color = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
                                        
                                        pillarIndices.forEach(idx => {
                                          if (result.pillars[idx].branch === branch) {
                                            const tenGod = lang === 'KO' ? result.pillars[idx].branchKoreanName : result.pillars[idx].branchEnglishName;
                                            const pillarName = lang === 'KO' ? ["시주", "일주", "월주", "연주"][idx] : ["Time", "Day", "Month", "Year"][idx];
                                            const pillarMeaning = lang === 'KO' ? ["자식/미래", "나/배우자", "부모/사회", "조상/근본"][idx] : ["Children/Future", "Self/Spouse", "Parents/Society", "Ancestors/Roots"][idx];
    
                                            // Replace bare words to ensure they are colored everywhere
                                            const wordsToColor = [tenGod, pillarName, pillarMeaning, branch];
                                            wordsToColor.forEach(word => {
                                              if (word) {
                                                const regex = new RegExp(`(${escapeRegex(word)})`, 'g');
                                                colorized = colorized.replace(regex, `<span style="color: ${color}; font-weight: bold;">$1</span>`);
                                              }
                                            });
                                          }
                                        });
                                      });
    
                                      // Colorize result element
                                      if (interaction.element) {
                                        const color = ELEMENT_COLORS[interaction.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
                                        const map: any = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(Water)' };
                                        const elementKo = map[interaction.element] || interaction.element;
                                        const elementRegex = new RegExp(`(${escapeRegex(elementKo)})`, 'g');
                                        colorized = colorized.replace(elementRegex, `<span style="color: ${color}; font-weight: bold;">$1</span>`);
                                      }
                                      
                                      return colorized;
                                    };
    
                                    tooltipContent = { 
                                      ko: colorizeNote(koNote), 
                                      en: colorizeNote(enNote) 
                                    };
                                  }
    
                                  return (
                                    <BaziTooltip 
                                      key={i} 
                                      content={tooltipContent} 
                                      lang={lang}
                                    >
                                      <div 
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border cursor-pointer transition-all shadow-sm ${
                                          isLight 
                                            ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-350 hover:shadow text-slate-800' 
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                                        }`}
                                      >
                                        <span className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-indigo-650' : 'text-neon-cyan'}`}>
                                          {getInteractionName(interaction.type)}
                                        </span>
                                        <span className={`text-[9px] font-semibold ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                                          {interaction.branches?.join('-') || interaction.stems?.join('-')}
                                        </span>
                                      </div>
                                    </BaziTooltip>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className={`text-xs italic ${isLight ? 'text-slate-400' : 'text-white/40'}`}>{lang === 'KO' ? '특별한 충돌이나 결합이 없어.' : 'No significant interactions.'}</span>
                            )}
                            
                            {(result.analysis?.conflicts || []).length > 0 && (
                              <div className="pt-3 border-t border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="h-[1px] w-4 bg-red-400/50"></div>
                                  <div className={`text-[10px] font-display font-medium uppercase tracking-[0.2em] ${isLight ? 'text-rose-600' : 'text-red-400/80'}`}>{lang === 'KO' ? '주의할 충돌' : 'Conflicts'}</div>
                                </div>
                                <div className="space-y-1">
                                  {(result.analysis?.conflicts || []).map((c, i) => {
                                    let displayNote = c.note || '';
                                    if (displayNote && displayNote.includes('|')) {
                                      const [koNote, enNote] = displayNote.split('|');
                                      displayNote = lang === 'KO' ? koNote : enNote;
                                    }
                                    return (
                                      <div key={i} className={`text-[11px] italic ${isLight ? 'text-rose-700/90 font-medium' : 'text-red-400/80'}`}>• {displayNote}</div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Ten Gods & Relationship Analysis */}
                      <div className="lg:col-span-7 space-y-4 flex flex-col justify-start">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`h-[1px] w-8 ${isLight ? 'bg-emerald-400/40' : 'bg-green-400/50'}`}></div>
                          <h4 className={`text-sm font-display font-medium uppercase tracking-[0.2em] ${isLight ? 'text-emerald-600' : 'text-green-400'}`}>{lang === 'KO' ? '십성 및 관계 분석' : 'Ten Gods & Relationships'}</h4>
                          <div className={`h-[1px] flex-1 bg-gradient-to-r ${isLight ? 'from-emerald-350/20 to-transparent' : 'from-green-400/20 to-transparent'}`}></div>
                        </div>

                        {result.isTimeUnknown && (
                          <div className={`p-3 rounded-lg border flex items-start gap-2 ${isLight ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 shadow-sm' : 'bg-green-400/10 border-green-400/30 text-green-400'}`}>
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p className="text-[10px] sm:text-xs leading-relaxed">
                              {lang === 'KO' 
                                ? '현재 평가는 시주(시간)가 제외된 상태입니다. 명리학에서 시간은 부하직원, 자녀, 생의 마지막 단계(말년운) 등을 의미합니다.'
                                : 'This evaluation excludes the time pillar. In BaZi, the time pillar represents subordinates, children, and late-life fortune.'}
                            </p>
                          </div>
                        )}
                        
                        <div className="space-y-6">
                          {/* Ten Gods Ratios */}
                          <div className={`p-4 rounded-xl border ${isLight ? 'bg-white shadow-sm border-slate-200 text-slate-700' : 'bg-black/40 border-white/5 text-white'}`}>
                            <div className="flex flex-wrap gap-4 justify-between">
                              {Object.entries(result.analysis.tenGodsRatio).map(([god, ratio]) => (
                                <div key={god} className="flex flex-col items-center space-y-1 flex-1 min-w-[70px]">
                                  <span className={`text-[11px] text-center font-bold tracking-tight ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{god}</span>
                                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-white/10'}`}>
                                    <div 
                                      className={`h-full rounded-full ${isLight ? 'bg-emerald-500' : 'bg-green-400'}`}
                                      style={{ width: `${ratio}%` }}
                                    />
                                  </div>
                                  <span className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{ratio}%</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Relationship Analysis */}
                          {result.analysis.relationshipAnalysis && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {Object.entries(result.analysis.relationshipAnalysis).map(([key, data]: [string, any]) => (
                                <div key={key} className={`p-4 rounded-2xl space-y-2 transition-all group border ${isLight ? 'bg-white shadow-sm border-slate-200 hover:border-slate-350 hover:shadow-md' : 'bg-black/40 border-white/5 hover:border-neon-cyan/30'}`}>
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full group-hover:animate-pulse ${isLight ? 'bg-indigo-500' : 'bg-neon-cyan'}`} />
                                      <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-800 font-gothic' : 'text-white'}`}>{data.title}</span>
                                    </div>
                                    {data.ratio !== undefined && (
                                      <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-white/40'}`}>{data.ratio}%</span>
                                    )}
                                  </div>
                                  <div className={`text-[11px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                                    <ParsedText lang={lang} text={data.description} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Absence / Excess Summary */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-500 font-medium' : 'text-white/40'}`}>{lang === 'KO' ? '무자/다자 분석' : 'Absence / Excess Analysis'}</span>
                              <button 
                                onClick={() => setShowMuJaDaJaHelp(true)}
                                className="p-1 hover:bg-white/5 rounded-full transition-colors"
                              >
                                <HelpCircle className="w-3 h-3 text-neon-cyan/60" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {result.analysis.muJaRon?.map((item: any, i: number) => (
                                <button 
                                  key={i} 
                                  onClick={() => setShowMuJaDaJaInfo(item)}
                                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all group text-left border ${isLight ? 'bg-rose-50/50 border-rose-250 hover:border-rose-400 hover:bg-rose-50 text-rose-800 shadow-sm' : 'bg-red-900/10 border-red-500/20 hover:border-red-500/50'}`}
                                >
                                  <span className="w-1 h-1 rounded-full bg-red-500 group-hover:animate-pulse" />
                                  <span className={`text-[10px] font-bold tracking-tight ${isLight ? 'text-red-700' : 'text-red-400'}`}>{item.title}</span>
                                </button>
                              ))}
                              {result.analysis.daJaRon?.map((item: any, i: number) => (
                                <button 
                                  key={i} 
                                  onClick={() => setShowMuJaDaJaInfo(item)}
                                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all group text-left border ${isLight ? 'bg-indigo-50/50 border-indigo-250 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-800 shadow-sm' : 'bg-purple-900/10 border-purple-500/20 hover:border-purple-500/50'}`}
                                >
                                  <span className="w-1 h-1 rounded-full bg-purple-500 group-hover:animate-pulse" />
                                  <span className={`text-[10px] font-bold tracking-tight ${isLight ? 'text-indigo-700' : 'text-purple-400'}`}>{item.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Column: Divine Stars (Shinsal) & Void spanning full width */}
                      <div className="lg:col-span-12 space-y-4 pt-4 border-t border-white/5">
                        <BaziTooltip content={BAZI_MAPPING.tooltips.shinsal} lang={lang}>
                          <div className="flex items-center gap-3 mb-4 cursor-help">
                            <div className="h-[1px] w-8 bg-yellow-400/50"></div>
                            <h4 className="text-sm font-display font-medium text-yellow-400 uppercase tracking-[0.2em]">{lang === 'KO' ? '신살 및 공망 (Divine Stars & Void)' : 'Divine Stars & Void'}</h4>
                            <span className="text-[10px] text-yellow-400/50 italic font-sans">
                              {lang === 'KO' ? '*밝게 빛나는 별일수록 영향력이 더 강력해' : '*Brighter stars indicate a stronger influence'}
                            </span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-yellow-400/20 to-transparent"></div>
                          </div>
                        </BaziTooltip>
                        <div className={`p-4 rounded-xl space-y-4 border ${isLight ? 'bg-white shadow-sm border-slate-200 text-slate-700' : 'bg-black/40 border-white/5 text-white/90'}`}>
                          {result.analysis.shinsal.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                              {result.analysis.shinsal.map((star, i) => {
                                const shinsalName = getShinsalName(star.name);
                                const definition = SHINSAL_DEFINITIONS[star.name as keyof typeof SHINSAL_DEFINITIONS];
                                
                                return (
                                  <BaziTooltip 
                                    key={i} 
                                    content={{ 
                                      ko: definition ? `${definition.hanja} | ${definition.meaning}\n${definition.modern}\n${definition.desc}` : (BAZI_MAPPING.shenSha[star.name as keyof typeof BAZI_MAPPING.shenSha]?.descKo || star.note),
                                      en: definition ? `${definition.enMeaning}\n${definition.enModern}\n${definition.enDesc}` : (BAZI_MAPPING.shenSha[star.name as keyof typeof BAZI_MAPPING.shenSha]?.desc || "")
                                    }} 
                                    lang={lang}
                                  >
                                    <div className="relative group cursor-help">
                                      <div className={`px-3 py-1.5 rounded border text-sm font-bold flex flex-col ${
                                        star.severity === 'strong' 
                                          ? (isLight ? 'bg-amber-100/75 border-amber-400 text-amber-800 shadow-sm' : 'bg-yellow-400/20 border-yellow-400 text-yellow-400') 
                                          : (isLight ? 'bg-slate-100/60 border-slate-250 text-slate-700' : 'bg-yellow-400/5 border-yellow-400/30 text-yellow-400/70')
                                      }`}>
                                        <span>{shinsalName}</span>
                                      </div>
                                    </div>
                                  </BaziTooltip>
                                );
                              })}
                            </div>
                          ) : (
                            <span className={`text-xs italic ${isLight ? 'text-slate-400' : 'text-white/40'}`}>{lang === 'KO' ? '해당되는 주요 신살이 없어.' : 'No major divine stars present.'}</span>
                          )}
                          
                          <div className="pt-2 border-t border-white/5">
                            <BaziTooltip content={BAZI_MAPPING.tooltips.gongmang} lang={lang}>
                              <div className="flex items-center gap-2 mb-2 cursor-help">
                                <div className="h-[1px] w-4 bg-white/30"></div>
                                <div className={`text-[10px] font-display font-medium uppercase tracking-[0.2em] ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{lang === 'KO' ? '공망 (Void Branches)' : 'Void Branches'}</div>
                              </div>
                            </BaziTooltip>
                            <div className="flex gap-2">
                              {result.analysis.gongmang?.branches?.map((b: string, i: number) => (
                                <span key={i} className={`px-2 py-1 rounded text-xs border ${isLight ? 'bg-slate-50 text-slate-700 border-slate-200 shadow-sm' : 'bg-white/5 text-white/60 border-white/10'}`}>
                                  {b}
                                </span>
                              ))}
                              <span className={`text-[10px] self-center ml-2 italic ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                                {result.analysis.gongmang?.inChart 
                                  ? (lang === 'KO' ? `(${result.analysis.gongmang?.affectedPillars?.join(', ')} 기운 약화)` : `(Weakens ${result.analysis.gongmang?.affectedPillars?.join(', ')} pillars)`)
                                  : (lang === 'KO' ? '(원국에 없음)' : '(Not in chart)')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <GongmangDetail result={result} lang={lang} isLight={isLight} />


                  </>
                )}
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tong-Gwan Yongshin Info Modal */}
      {showTongGwanInfo && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} // might not work fully without AP, but avoids syntax crash
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowTongGwanInfo(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-neon-cyan">
                  {lang === 'KO' ? '통관용신(通關用神)이란?' : 'What is Tong-Gwan (Mediating) Yongshin?'}
                </h3>
                <button 
                  onClick={() => setShowTongGwanInfo(false)} 
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-sm text-white/80 space-y-4 leading-relaxed">
                <p>
                  {lang === 'KO' 
                    ? '대립하는 두 기운 사이를 이어주어 소통시키는 오행이야.' 
                    : 'An element that bridges two opposing forces, enabling smooth energy flow.'}
                </p>

                <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                  <h4 className="font-bold text-white/90">{lang === 'KO' ? '예시 상황' : 'Example Scenario'}</h4>
                  <ul className="space-y-2 text-xs">
                    <li><span className="text-neon-pink font-bold">{lang === 'KO' ? '상황:' : 'Situation:'}</span> {lang === 'KO' ? '수(水) ⚡ 화(火)' : 'Water ⚡ Fire'}</li>
                    <li><span className="text-neon-cyan font-bold">{lang === 'KO' ? '처방:' : 'Prescription:'}</span> {lang === 'KO' ? '목(木) - 인성 필요' : 'Wood - Resource needed'}</li>
                    <li><span className="text-green-400 font-bold">{lang === 'KO' ? '결과:' : 'Result:'}</span> {lang === 'KO' ? '수(水) → 목(木) → 화(火)' : 'Water → Wood → Fire'}</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-white/90">{lang === 'KO' ? '대립하는 기운과 통관용신' : 'Clashing Elements & Mediators'}</h4>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span>{lang === 'KO' ? '목(木) ⚡ 토(土)' : 'Wood ⚡ Earth'}</span>
                      <span className="text-red-400 font-bold">{lang === 'KO' ? '화(火)가 통관' : 'Fire mediates'}</span>
                      <span className="text-white/40">{lang === 'KO' ? '(목→화→토)' : '(Wood→Fire→Earth)'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span>{lang === 'KO' ? '화(火) ⚡ 금(金)' : 'Fire ⚡ Metal'}</span>
                      <span className="text-yellow-400 font-bold">{lang === 'KO' ? '토(土)가 통관' : 'Earth mediates'}</span>
                      <span className="text-white/40">{lang === 'KO' ? '(화→토→금)' : '(Fire→Earth→Metal)'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span>{lang === 'KO' ? '토(土) ⚡ 수(水)' : 'Earth ⚡ Water'}</span>
                      <span className="text-gray-300 font-bold">{lang === 'KO' ? '금(金)이 통관' : 'Metal mediates'}</span>
                      <span className="text-white/40">{lang === 'KO' ? '(토→금→수)' : '(Earth→Metal→Water)'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span>{lang === 'KO' ? '금(金) ⚡ 목(木)' : 'Metal ⚡ Wood'}</span>
                      <span className="text-blue-400 font-bold">{lang === 'KO' ? '수(水)가 통관' : 'Water mediates'}</span>
                      <span className="text-white/40">{lang === 'KO' ? '(금→수→목)' : '(Metal→Water→Wood)'}</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded">
                      <span>{lang === 'KO' ? '수(水) ⚡ 화(火)' : 'Water ⚡ Fire'}</span>
                      <span className="text-green-400 font-bold">{lang === 'KO' ? '목(木)이 통관' : 'Wood mediates'}</span>
                      <span className="text-white/40">{lang === 'KO' ? '(수→목→화)' : '(Water→Wood→Fire)'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Guide Detail Modal */}
      {showGuideDetailModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowGuideDetailModal(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col z-10"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20 rounded-t-2xl">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan drop-shadow-[0_0_10px_rgba(188,0,255,0.3)]">
                {lang === 'KO' ? '사주명리학의 우주적 시선' : 'Cosmic Perspective of BaZi'}
              </h3>
              <button 
                onClick={() => setShowGuideDetailModal(false)}
                className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 no-scrollbar">

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center text-sm">1</span>
                  {lang === 'KO' ? '생태계적 관점: 사주나무 (Cosmic Tree)' : 'Ecological View: The Cosmic Tree'}
                </h4>
                <div className="relative w-full aspect-square sm:aspect-video rounded-2xl bg-black/50 border border-white/10 flex flex-col items-center justify-end pb-4 sm:pb-8 overflow-hidden group">
                  {/* Glowing background */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(74,222,128,0.1)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

                  {/* Canopy/Leaves */}
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-[-40px] sm:mb-[-60px] z-10 flex items-center justify-center">
                    
                    {/* The Leaf Canopy Shape */}
                    <div className="absolute inset-[-20%] transition-transform duration-1000 group-hover:scale-105 pointer-events-none overflow-visible">
                      <svg viewBox="0 0 200 200" className="w-full h-full block">
                        <defs>
                          <filter id="leafBlur" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feComponentTransfer>
                              <feFuncA type="linear" slope="1.2" />
                            </feComponentTransfer>
                          </filter>
                          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(52,211,153,0.3)" /> {/* emerald-400 */}
                            <stop offset="100%" stopColor="rgba(4,120,87,0.4)" /> {/* emerald-700 */}
                          </linearGradient>
                          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(163,230,53,0.25)" /> {/* lime-400 */}
                            <stop offset="100%" stopColor="rgba(21,128,61,0.35)" /> {/* green-700 */}
                          </linearGradient>
                        </defs>
                        <g filter="url(#leafBlur)">
                          {/* Outer Canopy */}
                          <path fill="url(#leafGrad1)" d="M100 35 
                            C 130 35 150 50 160 70 
                            C 185 75 190 95 185 115 
                            C 180 135 160 145 140 145 
                            C 130 160 90 165 80 145 
                            C 55 145 30 135 25 115 
                            C 20 95 35 75 45 70 
                            C 50 50 70 35 100 35 Z" />
                          {/* Inner Canopy Highlights */}
                          <path fill="url(#leafGrad2)" d="M100 50 
                            C 120 50 135 60 140 75 
                            C 155 80 160 95 155 110 
                            C 150 125 135 130 120 130 
                            C 110 140 90 140 85 130 
                            C 65 130 50 125 45 110 
                            C 40 95 50 80 65 75 
                            C 70 60 80 50 100 50 Z" />
                        </g>
                      </svg>
                    </div>

                    {/* Ambient background glow */}
                    <div className="absolute inset-0 bg-green-500/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
                    
                    {/* Flower (Day Pillar) */}
                    <div className="absolute top-4 left-0 sm:top-10 sm:left-4 flex flex-col items-center">
                       <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-500/20 border border-pink-400/50 rounded-full flex flex-col items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-transform hover:scale-110 z-20">
                          <span className="text-2xl sm:text-3xl">🌸</span>
                       </div>
                       <div className="mt-2 text-center bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
                         <span className="text-pink-400 font-bold block text-xs sm:text-sm">{lang === 'KO' ? '일주' : 'Day'}</span>
                         <span className="text-white/60 text-[10px] sm:text-xs">{lang === 'KO' ? '꽃 (나)' : 'Flower (Me)'}</span>
                       </div>
                    </div>

                    {/* Fruit (Hour Pillar) */}
                    <div className="absolute top-4 right-0 sm:top-10 sm:right-4 flex flex-col items-center">
                       <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500/20 border border-yellow-400/50 rounded-full flex flex-col items-center justify-center backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-transform hover:scale-110 z-20">
                          <span className="text-2xl sm:text-3xl">🍏</span>
                       </div>
                       <div className="mt-2 text-center bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
                         <span className="text-yellow-400 font-bold block text-xs sm:text-sm">{lang === 'KO' ? '시주' : 'Hour'}</span>
                         <span className="text-white/60 text-[10px] sm:text-xs">{lang === 'KO' ? '열매 (결과)' : 'Fruit (Result)'}</span>
                       </div>
                    </div>
                  </div>

                  {/* Trunk (Month Pillar) */}
                  <div className="relative z-0 flex flex-col items-center">
                    <div className="w-16 h-24 sm:w-24 sm:h-32 bg-gradient-to-b from-amber-900/80 to-stone-900/90 rounded-t-lg border-x border-t border-amber-700/50 flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                       <div className="bg-black/60 px-2 py-1 rounded backdrop-blur-md border border-white/10 text-center">
                         <span className="text-amber-500 font-bold text-xs sm:text-sm block">{lang === 'KO' ? '월주' : 'Month'}</span>
                         <span className="text-white/60 text-[10px] sm:text-xs block leading-tight">{lang === 'KO' ? '기둥\n(환경)' : 'Trunk\n(Env)'}</span>
                       </div>
                    </div>
                  </div>

                  {/* Roots (Year Pillar) */}
                  <div className="relative flex justify-center w-full mt-[-10px] sm:mt-[-15px] z-20">
                     <svg className="absolute w-64 h-24 sm:w-96 sm:h-32 left-1/2 -translate-x-1/2 top-0 -z-10 text-amber-900/40" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                       <path d="M100 0 C 100 40, 40 60, 20 90 M100 0 C 100 40, 80 70, 70 100 M100 0 C 100 40, 120 70, 130 100 M100 0 C 100 40, 160 60, 180 90" />
                     </svg>
                     <div className="mt-4 sm:mt-8 flex flex-col items-center bg-black/60 px-3 py-1 sm:px-4 sm:py-2 rounded-xl backdrop-blur-md border border-white/10">
                       <span className="text-emerald-400 font-bold text-xs sm:text-sm">{lang === 'KO' ? '년주' : 'Year'}</span>
                       <span className="text-white/60 text-[10px] sm:text-xs">{lang === 'KO' ? '뿌리 (조상/과거)' : 'Roots (Ancestry)'}</span>
                     </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/70">
                  {lang === 'KO' ? 
                    '사주는 단순한 텍스트가 아니라 우주적인 나무와 같습니다. 년주는 당신의 뿌리(유전, 과거)요, 월주는 자라나는 기둥(부모, 환경)입니다. 일주는 코어 아이덴티티이자 파트너를 뜻하는 꽃(Flower)이며, 시주는 노년과 성과를 뜻하는 열매(Fruit)입니다.' : 
                    'BaZi (Four Pillars) can be compared to a cosmic tree. The Year Pillar is your roots (genetics, past), the Month Pillar is the trunk (parents, growing environment), the Day Pillar is the flower (core identity, spouse), and the Hour Pillar is the fruit (future, offspring).'}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm">2</span>
                  {lang === 'KO' ? '땅 속에 감춰진 씨앗: 지장간' : 'Hidden Seeds: Ji-Jang-Gan'}
                </h4>
                <div className="relative w-full rounded-2xl bg-black/50 border border-amber-500/20 p-4 sm:p-6 flex flex-col gap-6">
                  
                  {/* Concept Intro */}
                  <div className="flex flex-col gap-4">
                    <p className="text-sm leading-relaxed text-white/80">
                      {lang === 'KO' ? 
                        `사람의 마음은 단 하나로 정의할 수 없는 여러 개의 '페르소나(가면)'로 이루어져 있습니다. 사주에서 땅(지지) 속에 감춰진 2~3개의 숨은 성향이 바로 '지장간(地藏干)'입니다. 평소에는 겉으로 드러나지 않지만, 내 무의식의 밑바탕을 지배하는 '진짜 속마음'과 '숨은 잠재력'을 의미합니다.` : 
                        `A human mind is not defined by a single trait but made up of multiple 'personas'. In BaZi, the 2-3 hidden energies concealed within the earth (branches) are called 'Ji-Jang-Gan'. They represent your 'true inner mind' and 'hidden potential' that typically remain unseen but unconsciously influence you.`}
                    </p>

                    {(result?.analysis?.dayMasterStrength?.score || 0) >= 3.5 && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col gap-2 shadow-[inset_0_0_15px_rgba(245,158,11,0.05)]">
                        <h5 className="text-amber-500 font-bold text-xs sm:text-sm flex items-center gap-2">
                          ✨ {lang === 'KO' ? '통근(뿌리) 총람' : 'Rooting Overview'}
                        </h5>
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                          {lang === 'KO' ? (
                            <>
                              귀하는 지지에 강력한 뿌리를 두고 있는 <strong className="text-amber-400">기반이 튼튼한 사주</strong>입니다.
                            </>
                          ) : (
                            <>
                              You possess a <strong className="text-amber-400">strongly rooted and stable foundation</strong> in your chart.
                            </>
                          )}
                        </p>
                      </div>
                    )}

                    {/* PIllar differences */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col gap-3 shadow-[inset_0_0_15px_rgba(245,158,11,0.05)]">
                      <h5 className="text-amber-500 font-bold text-xs sm:text-sm">
                        {lang === 'KO' ? '네 기둥의 지장간은 역할이 다릅니다' : 'The roles of Hidden Stems in Four Pillars'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs sm:text-sm">
                        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                          <span className="text-white/50 whitespace-nowrap">🌱 {lang === 'KO' ? '년지:' : 'Year Branch:'}</span> 
                          <span className="text-white/90 leading-snug">{lang === 'KO' ? '가문으로부터 물려받은 무의식적 기질' : 'Unconscious traits inherited from ancestors'}</span>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                          <span className="text-white/50 whitespace-nowrap">🪵 {lang === 'KO' ? '월지:' : 'Month Branch:'}</span> 
                          <span className="text-white/90 leading-snug">{lang === 'KO' ? '사회생활, 직업에서 드러나는 찐 능력' : 'True abilities shown in society and career'}</span>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                          <span className="text-white/50 whitespace-nowrap">🌸 {lang === 'KO' ? '일지:' : 'Day Branch:'}</span> 
                          <span className="text-neon-cyan font-bold leading-snug">{lang === 'KO' ? '남들은 모르는 나의 은밀한 속마음(본성)' : 'My secret inner mind & true nature'}</span>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                          <span className="text-white/50 whitespace-nowrap">🍏 {lang === 'KO' ? '시지:' : 'Hour Branch:'}</span> 
                          <span className="text-white/90 leading-snug">{lang === 'KO' ? '내 심연에 숨겨진 마지막 미래의 욕망' : 'Deepest hidden desires and future traits'}</span>
                        </div>
                      </div>
                    </div>

                    <PillarDetailGuide 
                      result={result} 
                      lang={lang} 
                      guideSelectedPillar={guideSelectedPillar} 
                      setGuideSelectedPillar={setGuideSelectedPillar} 
                      getDetailedTenGod={getDetailedTenGod} 
                      getTenGodColor={getTenGodColor} 
                    />
                  </div>

                  {/* Initial / Middle / Main Explained */}
                  <div className="space-y-4">
                     <p className="text-[15px] sm:text-base font-bold text-white/90">
                       {lang === 'KO' ? '그렇다면 초기, 중기, 정기는 무엇인가요?' : 'What are Initial, Middle, and Main Qi?'}
                     </p>
                     <p className="text-sm sm:text-[15px] text-white/80 leading-relaxed font-sans bg-white/5 border border-white/10 p-4 rounded-xl">
                      {lang === 'KO' ? '지장간은 한 달이라는 시간 속에서 기운이 변화하는 3가지 단계를 의미해요.' : 'Ji-Jang-Gan is divided into 3 temporal phases as energy shifts through a month.'}
                     </p>
                     <ul className="text-xs sm:text-sm text-white/80 space-y-4 list-none font-sans pl-1">
                       <li className="flex flex-col gap-1">
                         <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                           <span className="font-bold text-emerald-400 text-sm">
                             {lang === 'KO' ? '초기 (여기, Initial)' : 'Initial Qi (Yeo-gi)'}
                           </span>
                         </div>
                         <p className="pl-3.5 leading-relaxed text-white/70">
                           {lang === 'KO' ? '막 계절이 바뀌었지만, 아직 지나간 전 달의 기운(날씨)이 남아있는 상태예요. 나도 모르게 은근히 튀어나오는 지나간 습관과도 같죠.' : 'The season just changed, but the lingering energy of the previous month remains. It is like an old habit that works subtly in the background.'}
                         </p>
                       </li>
                       <li className="flex flex-col gap-1">
                         <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                           <span className="font-bold text-blue-400 text-sm">
                             {lang === 'KO' ? '중기 (Middle)' : 'Middle Qi (Jung-gi)'}
                           </span>
                         </div>
                         <p className="pl-3.5 leading-relaxed text-white/70">
                           {lang === 'KO' ? '계절의 기운이 진화해 나가는 중간 단계예요. 환경이나 상황이 바뀔 때 요긴하게 꺼내 쓰는 무기 같은 역할을 한답니다.' : 'The transitional midpoint as elements evolve. It acts as a flexible, situational weapon when environments shift.'}
                         </p>
                       </li>
                       <li className="flex flex-col gap-1">
                         <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 rounded-full bg-neon-pink" />
                           <span className="font-bold text-neon-pink text-sm">
                             {lang === 'KO' ? '정기 (본기, Main)' : 'Main Qi (Jeong-gi)'}
                           </span>
                         </div>
                         <p className="pl-3.5 leading-relaxed text-white/70">
                           {lang === 'KO' ? '지금 이 계절의 진짜 핵심 기운! 내 무의식과 행동을 통째로 지배하는 가장 강력하고 솔직한 본성을 뜻해요.' : 'The core, defining essence of the season! It is the most powerful and honest nature that dominates your entire unconscious behavior.'}
                         </p>
                       </li>
                      </ul>
                   </div>

                   <SeasonalFlow lang={lang} isLight={theme === 'light'} />

                   {/* Rooting Tags Explained */}
                   <div className="space-y-3 pt-4 border-t border-white/10">
                       <p className="text-sm font-bold text-white/90">
                         {lang === 'KO' ? '통근(뿌리) 표식의 의미' : 'Meaning of Rooting Tags'}
                       </p>
                       <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                        {lang === 'KO' ? 
                          '사주 원국의 천간(하늘)에 있는 기운이 지장간(땅 속)에 같은 오행을 두고 있을 때 "통근(뿌리내림)"했다고 합니다. 개별 지장간 하단의 꼬리표는 이 연결의 깊이를 나타냅니다.' : 
                          'When a Heavenly Stem shares energy with a Hidden Stem, it is "rooted". These tags indicate the strength of that connection.'}
                       </p>
                       <ul className="text-xs sm:text-sm text-white/80 space-y-3 list-none pl-1 font-sans">
                         <li className="flex items-start gap-2">
                           <span className="text-[10px] sm:text-[11px] p-1 rounded font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 whitespace-nowrap mt-0.5">{lang === 'KO' ? '본기' : 'MAIN'}</span>
                           <span className="leading-snug">{lang === 'KO' ? '본기(Main) 뿌리: 제자리 천간에 직접 직결된 기운. 외부 기둥과 연결될 경우 해당 천간 배지(일간, 시간, 월간, 연간)로 교체되어 발현 범위를 표시합니다.' : 'Main Root: Directly connected core energy. When linked to other pillars, it dynamically shows the specific stem name (DM, Hour, Month, Year).'}</span>
                         </li>
                         <li className="flex items-start gap-2">
                           <span className="text-[10px] sm:text-[11px] p-1 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap mt-0.5">{lang === 'KO' ? '중여' : 'SUB'}</span>
                           <span className="leading-snug">{lang === 'KO' ? '중여(Sub) 뿌리: 상황에 따라 유연하게 꺼내는 보완 기운. 외부 기둥과 연결될 경우 접미사 "중"과 조합(일중, 시중, 월중, 연중)되어 표시됩니다.' : 'Sub Root: A flexible secondary/sub-Qi backup root. When connected to other pillars, it is displayed with the "-SB" suffix (DM-SB, Hour-SB, Month-SB, Year-SB).'}</span>
                         </li>
                         <li className="flex items-start gap-2">
                           <span className="text-[10px] sm:text-[11px] p-1 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap mt-0.5">{lang === 'KO' ? '생조' : 'GEN'}</span>
                           <span className="leading-snug">{lang === 'KO' ? '생조(Generative) 지지: 오행 간 상생으로 끊임없이 기운을 공급하는 원조력. 외부 글자와 상생 시에는 접미사 "생"과 조합(일생, 시생, 월생, 연생)되어 표시됩니다.' : 'Generative Support: Energy supplying support through mutual generation. When supporting other pillars, it is displayed with the "-GN" suffix (DM-GN, Hour-GN, Month-GN, Year-GN).'}</span>
                         </li>
                         <li className="flex items-start gap-2">
                           <span className="text-[10px] sm:text-[11px] p-1 rounded font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30 whitespace-nowrap mt-0.5">{lang === 'KO' ? '미통근' : 'NONE'}</span>
                           <span className="leading-snug">{lang === 'KO' ? '뿌리 없음 (Unrooted): 상황이나 관계에 얽매이지 않고 필요할 때만 유연하고 순발력 있게 사용하는 무기 (배지가 표시되지 않음).' : 'Unrooted (No Tag): Used flexibly and casually depending on circumstances, unbound by deep roots (no badge shown).'}</span>
                         </li>
                       </ul>
                   </div>
                 </div>
               </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center text-sm">3</span>
                  {lang === 'KO' ? '시간의 파도: 대운 (Life Seasons)' : 'Life Seasons: Daewun'}
                </h4>
                <div className="relative w-full h-[250px] sm:h-[300px] overflow-hidden flex items-center justify-center bg-black/40 rounded-2xl border border-neon-purple/20 py-8">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(188,0,255,0.2)_0%,transparent_70%)]"></div>
                  
                  {/* The Wave SVG */}
                  {/* Using exact viewBox 0 0 1000 200 to map percentages */}
                  <svg className="absolute w-full h-[70%]" preserveAspectRatio="none" viewBox="0 0 1000 200">
                     {/* Exact Symmetric Wave Path */}
                     <path d="M -166.7 30 C -55.6 30, 55.6 170, 166.7 170 C 277.8 170, 388.9 30, 500 30 C 611.1 30, 722.2 170, 833.3 170 C 944.4 170, 1055.6 30, 1166.7 30" fill="none" stroke="url(#wave-gradient)" strokeWidth="4" className="drop-shadow-[0_0_10px_rgba(188,0,255,0.5)]" />
                     
                     <defs>
                        <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                           <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
                           <stop offset="20%" stopColor="#4ade80" /> {/* Spring/Wood */}
                           <stop offset="40%" stopColor="#f87171" /> {/* Summer/Fire */}
                           <stop offset="60%" stopColor="#facc15" /> {/* Autumn/Metal/Earth */}
                           <stop offset="80%" stopColor="#60a5fa" /> {/* Winter/Water */}
                           <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
                        </linearGradient>
                     </defs>
                  </svg>

                  {/* Nodes on the Exact Calculated Positions of the Wave */}
                  <div className="absolute w-full h-[70%]">
                     {/* 1. Spring (Growth): Valley 1 - 16.7% left, 85% top */}
                     <div className="absolute z-10 transition-transform hover:scale-110" style={{ top: '85%', left: '16.7%' }}>
                       <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center shadow-[0_0_15px_rgba(74,222,128,0.5)] backdrop-blur-md">
                         <span className="text-sm sm:text-lg">🌱</span>
                       </div>
                       <div className="absolute bottom-[24px] sm:bottom-[28px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 hidden sm:block whitespace-nowrap">
                         <span className="text-green-400 font-bold block text-xs">{lang === 'KO' ? '성장기(봄)' : 'Growth(Spring)'}</span>
                         <span className="text-white/50 text-[10px] block leading-tight mt-1">{lang === 'KO' ? '씨앗이 발아하여\n뿌리를 내림' : 'Seeds sprout\nand take root'}</span>
                       </div>
                       <div className="absolute bottom-[24px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 sm:hidden whitespace-nowrap">
                         <span className="text-green-400 font-bold block text-[10px]">{lang === 'KO' ? '봄' : 'Spring'}</span>
                       </div>
                     </div>

                     {/* 2. Summer (Expansion): Ascending slope - 33.3% left, 50% top */}
                     <div className="absolute z-10 transition-transform hover:scale-110" style={{ top: '50%', left: '33.3%' }}>
                       <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center shadow-[0_0_15px_rgba(248,113,113,0.5)] backdrop-blur-md">
                         <span className="text-sm sm:text-lg">🔥</span>
                       </div>
                       <div className="absolute top-[24px] sm:top-[28px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 hidden sm:block whitespace-nowrap">
                         <span className="text-red-400 font-bold block text-xs">{lang === 'KO' ? '확장기(여름)' : 'Expansion(Summer)'}</span>
                         <span className="text-white/50 text-[10px] block leading-tight mt-1">{lang === 'KO' ? '꽃이 만개하고\n세력을 넓힘' : 'Flowers bloom\nand spread'}</span>
                       </div>
                       <div className="absolute top-[24px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 sm:hidden whitespace-nowrap">
                         <span className="text-red-400 font-bold block text-[10px]">{lang === 'KO' ? '여름' : 'Summer'}</span>
                       </div>
                     </div>

                     {/* 3. Autumn (Harvest): Descending slope - 66.7% left, 50% top */}
                     <div className="absolute z-10 transition-transform hover:scale-110" style={{ top: '50%', left: '66.7%' }}>
                       <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)] backdrop-blur-md">
                         <span className="text-sm sm:text-lg">🍂</span>
                       </div>
                       <div className="absolute top-[24px] sm:top-[28px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 hidden sm:block whitespace-nowrap">
                         <span className="text-yellow-400 font-bold block text-xs">{lang === 'KO' ? '수확기(가을)' : 'Harvest(Autumn)'}</span>
                         <span className="text-white/50 text-[10px] block leading-tight mt-1">{lang === 'KO' ? '열매를 맺고\n결실을 거둠' : 'Bear fruit\nand harvest'}</span>
                       </div>
                       <div className="absolute top-[24px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 sm:hidden whitespace-nowrap">
                         <span className="text-yellow-400 font-bold block text-[10px]">{lang === 'KO' ? '가을' : 'Autumn'}</span>
                       </div>
                     </div>

                     {/* 4. Winter (Contraction): Valley 2 - 83.3% left, 85% top */}
                     <div className="absolute z-10 transition-transform hover:scale-110" style={{ top: '85%', left: '83.3%' }}>
                       <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(96,165,250,0.5)] backdrop-blur-md">
                         <span className="text-sm sm:text-lg">❄️</span>
                       </div>
                       <div className="absolute bottom-[24px] sm:bottom-[28px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 hidden sm:block whitespace-nowrap">
                         <span className="text-blue-400 font-bold block text-xs">{lang === 'KO' ? '수축기(겨울)' : 'Contraction(Winter)'}</span>
                         <span className="text-white/50 text-[10px] block leading-tight mt-1">{lang === 'KO' ? '생명력을 비축하며\n휴식함' : 'Rest and reserve\nvitality'}</span>
                       </div>
                       <div className="absolute bottom-[24px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 sm:hidden whitespace-nowrap">
                         <span className="text-blue-400 font-bold block text-[10px]">{lang === 'KO' ? '겨울' : 'Winter'}</span>
                       </div>
                     </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/70">
                  {lang === 'KO' ? 
                    '태어날 때 받은 사주가 자동차라면, 대운(大運)은 그 자동차가 달리는 도로와 같습니다. 10년 단위로 바뀌는 이 운의 흐름에 따라 내게 유리한 환경이 오기도 하고, 폭풍우가 치기도 합니다. 사주 자체의 구조만큼이나 지금 내가 어느 계절을 지나는지가 중요합니다.' : 
                    'If your BaZi chart is the vehicle you were born with, Daewun (10-year cycle) is the road you are driving on. This cycle changes every 10 years, shifting the environment like seasons. Recognizing which "season" you are passing through helps align your life strategy.'}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center text-sm">4</span>
                  {lang === 'KO' ? '오행과 글자의 물상 (Metaphors of Elements)' : 'Metaphors of the Five Elements'}
                </h4>
                <p className="text-sm leading-relaxed text-white/70 mb-4">
                  {lang === 'KO' ? 
                    '사주의 글자들은 단순한 기호가 아니라 자연의 모습(물상)과 직업/환경(업상)을 나타내는 상징입니다. 같은 쇠(金)라도 모양과 쓰임새가 다릅니다.' : 
                    'The characters in BaZi are not just symbols but represent natural imagery (Metaphors) and occupational traits. Even within the same Metal (金) element, the shape and use differ.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-black/30 border border-[#00ea5e]/30 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-[#00ea5e] font-bold">
                      <span className="text-xl">🌱</span> {lang === 'KO' ? '목 (Wood): 생명력, 기획' : 'Wood (木): Vitality, Planning'}
                    </div>
                    <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
                      {lang === 'KO' ? (
                        <>
                          <li><strong className="text-white">갑(甲)/인(寅)</strong>: 하늘을 뚫고 솟는 거목. <span className="opacity-80">기획, 건축, 수직적 리더십</span></li>
                          <li><strong className="text-white">을(乙)/묘(卯)</strong>: 끈질긴 생명력의 화초. <span className="opacity-80">교육, 기획, 유연한 네트워킹</span></li>
                        </>
                      ) : (
                        <>
                          <li><strong className="text-white">Gap(甲) / In(寅)</strong>: Tall tree piercing the sky. <span className="opacity-80">Planning, architecture, vertical leadership</span></li>
                          <li><strong className="text-white">Eul(乙) / Myo(卯)</strong>: Flower/grass with tenacious vitality. <span className="opacity-80">Education, networking, flexible adaptation</span></li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="p-4 bg-black/30 border border-[#ff4747]/30 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-[#ff4747] font-bold">
                      <span className="text-xl">🔥</span> {lang === 'KO' ? '화 (Fire): 확산, 표현' : 'Fire (火): Expansion, Expression'}
                    </div>
                    <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
                      {lang === 'KO' ? (
                        <>
                          <li><strong className="text-white">병(丙)/사(巳)</strong>: 만물을 비추는 태양, 공적인 열기. <span className="opacity-80">방송, 언론, 화려한 리더십</span></li>
                          <li><strong className="text-white">정(丁)/오(午)</strong>: 세밀하고 집중된 열성, 등대. <span className="opacity-80">연구, IT, 종교, 철학</span></li>
                        </>
                      ) : (
                        <>
                          <li><strong className="text-white">Byeong(丙) / Sa(巳)</strong>: Sun shining on all things, public heat. <span className="opacity-80">Broadcasting, media, flashy leadership</span></li>
                          <li><strong className="text-white">Jeong(丁) / O(午)</strong>: Detailed and focused heat, lighthouse. <span className="opacity-80">Research, IT, religion, philosophy</span></li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="p-4 bg-black/30 border border-[#f5b800]/30 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-[#f5b800] font-bold">
                      <span className="text-xl">🪨</span> {lang === 'KO' ? '토 (Earth): 중재, 조절' : 'Earth (土): Mediation, Storage'}
                    </div>
                    <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
                      {lang === 'KO' ? (
                        <>
                          <li><strong className="text-white">무(戊)</strong>: 모든 것을 품는 광활한 산. <span className="opacity-80">부동산, 무역, 포용력</span></li>
                          <li><strong className="text-white">기(己)</strong>: 실속 있는 경작지, 정원. <span className="opacity-80">세밀한 관리, 농업, 보육</span></li>
                          <li className="text-[10px] text-white/50">※ 지지(진술축미)는 각 계절의 환절기로 저장과 전환을 담당합니다.</li>
                        </>
                      ) : (
                        <>
                          <li><strong className="text-white">Mu(戊)</strong>: Vast mountain embracing everything. <span className="opacity-80">Real estate, trade, tolerance</span></li>
                          <li><strong className="text-white">Gi(己)</strong>: Practical farmland, garden. <span className="opacity-80">Detailed management, agriculture, nurturing</span></li>
                          <li className="text-[10px] text-white/50">※ The Earth branches (Jin, Sul, Chuk, Mi) act as seasonal transitions, handling storage and transformation.</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="p-4 bg-black/30 border border-[#d8d8d8]/30 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-[#d8d8d8] font-bold">
                      <span className="text-xl">⚔️</span> {lang === 'KO' ? '금 (Metal): 분별, 수확' : 'Metal (金): Decision, Harvest'}
                    </div>
                    <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
                      {lang === 'KO' ? (
                        <>
                          <li><strong className="text-white">경(庚)/신(申)</strong>: 가공되지 않은 바위나 무쇠. <span className="opacity-80">군경, 검찰, 중공업, 큰 결단</span></li>
                          <li><strong className="text-white">신(辛)/유(酉)</strong>: 예리한 칼날, 정밀하게 세공된 보석. <span className="opacity-80">금융, 의료(수술), 정밀가공, 예민함</span></li>
                        </>
                      ) : (
                        <>
                          <li><strong className="text-white">Gyeong(庚) / Sin(申)</strong>: Unprocessed rock or raw iron. <span className="opacity-80">Military/police, heavy industry, major decisions</span></li>
                          <li><strong className="text-white">Shin(辛) / Yu(酉)</strong>: Sharp blade, finely crafted jewelry. <span className="opacity-80">Finance, medical (surgery), precision processing, sensitivity</span></li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="p-4 bg-black/30 border border-[#00bfff]/30 rounded-xl space-y-2 sm:col-span-2">
                    <div className="flex items-center gap-2 text-[#00bfff] font-bold">
                      <span className="text-xl">💧</span> {lang === 'KO' ? '수 (Water): 지혜, 흐름' : 'Water (수): Wisdom, Flow'}
                    </div>
                    <ul className="text-xs text-white/70 space-y-1 list-disc list-inside">
                      {lang === 'KO' ? (
                        <>
                          <li><strong className="text-white">임(壬)/해(亥)</strong>: 대륙을 가로지르는 큰 강물, 바다. <span className="opacity-80">해운, 유통, 외교, 거대한 구상</span></li>
                          <li><strong className="text-white">계(癸)/자(子)</strong>: 스며드는 비, 맑은 샘물, 정보. <span className="opacity-80">아이디어 기획, 철학, 내면적 사유</span></li>
                        </>
                      ) : (
                        <>
                          <li><strong className="text-white">Im(壬) / Hae(亥)</strong>: Large river crossing the continent, ocean. <span className="opacity-80">Shipping, distribution, diplomacy, grand ideas</span></li>
                          <li><strong className="text-white">Gye(癸) / Ja(子)</strong>: Seeping rain, clear spring water, information. <span className="opacity-80">Idea planning, philosophy, introspective thinking</span></li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-pink/20 text-neon-pink flex items-center justify-center text-sm">5</span>
                  {lang === 'KO' ? '마음의 10가지 가면: 십성 (The 10 Masks of Mind)' : 'The Ten Gods: 10 Masks of Mind'}
                </h4>
                <p className="text-sm leading-relaxed text-white/80">
                  {lang === 'KO' ? 
                    `십성(十星)이란, 사주의 주체인 '나(일간)'와 다른 글자들이 어떤 관계를 맺고 있는지를 10가지 심리/사회적 역할로 분류한 것입니다. 오행이 '어떤 무기'를 가졌는지 말해준다면, 십성은 '그 무기를 어떻게 사용하는지'를 말해줍니다.` : 
                    `The Ten Gods represent the 10 psychological and social roles formed by the relationship between 'You (Day Master)' and other characters in your BaZi. While Elements tell you 'what weapon' you have, Ten Gods tell you 'how you use it'.`}
                </p>
                
                <div className="flex flex-col gap-5 w-full font-gothic">
                  {[
                    { groupKo: '나침반', groupEn: 'Identity', color: 'var(--tengod-identity)', items: [
                      { nameKo: '비견', nameEn: 'Mirror', descKo: '주체성, 독립심, 평등, 마이웨이', descEn: 'Independence, self-esteem, equality' },
                      { nameKo: '겁재', nameEn: 'Rival', descKo: '경쟁심, 승부욕, 쟁취, 강력 에너지', descEn: 'Competitiveness, ambition, fierce energy' }
                    ]},
                    { groupKo: '엔진', groupEn: 'Expression', color: 'var(--tengod-expression)', items: [
                      { nameKo: '식신', nameEn: 'Artist', descKo: '몰입, 창작, 연구, 취향, 호기심, 식도락', descEn: 'Immersion, creation, hobbies, deep focus' },
                      { nameKo: '상관', nameEn: 'Rebel', descKo: '표현력, 파격, 언변, 호기심, 순발력', descEn: 'Expression, breaking rules, eloquence, wit' }
                    ]},
                    { groupKo: '안테나', groupEn: 'Wealth', color: 'var(--tengod-wealth)', items: [
                      { nameKo: '정재', nameEn: 'Architect', descKo: '안정, 소유욕, 계산, 꼼꼼함, 현실감각', descEn: 'Stability, ownership, meticulous calculating' },
                      { nameKo: '편재', nameEn: 'Maverick', descKo: '통 큰 스케일, 모험심, 유흥, 네트워크', descEn: 'Big scale, adventure, thrill, networking' }
                    ]},
                    { groupKo: '브레이크', groupEn: 'Power', color: 'var(--tengod-power)', items: [
                      { nameKo: '정관', nameEn: 'Judge', descKo: '원칙, 도덕심, 체면, 질서, 인정욕구', descEn: 'Principles, morals, honor, order, reputation' },
                      { nameKo: '편관', nameEn: 'Warrior', descKo: '카리스마, 극기, 인내, 강박, 권력', descEn: 'Charisma, endurance, overcoming crisis, power' }
                    ]},
                    { groupKo: '충전소', groupEn: 'Resource', color: 'var(--tengod-resource)', items: [
                      { nameKo: '정인', nameEn: 'Sage', descKo: '안정, 수용성, 학문, 인내, 어머니 마음', descEn: 'Stability, acceptance, academics, motherly love' },
                      { nameKo: '편인', nameEn: 'Mystic', descKo: '직관력, 눈치, 심리/철학, 비판사고', descEn: 'Intuition, insight, philosophy, critical thinking' }
                    ]}
                  ].map((g, i) => (
                    <div key={i} className="flex flex-col lg:flex-row bg-[#1b1c31]/30 border border-white/10 rounded-xl overflow-hidden shadow-lg hover:border-white/20 transition-all duration-300">
                      <div 
                        className="lg:w-[180px] p-4 lg:p-6 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-1 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 text-center"
                        style={{ backgroundColor: `color-mix(in srgb, ${g.color} 8%, transparent)` }}
                      >
                        <div className="flex flex-col items-start lg:items-center text-left lg:text-center">
                          <span className="font-bold text-[10px] tracking-wider text-white/40 uppercase mb-0.5">Mask Group</span>
                          <span className="font-black text-base sm:text-lg md:text-xl tracking-wide font-gothic" style={{ color: g.color }}>
                            {lang === 'KO' ? g.groupKo : g.groupEn}
                          </span>
                        </div>
                        <span className="text-white/60 text-xs font-medium">
                          {lang === 'KO' ? g.groupEn : g.groupKo}
                        </span>
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
                        {g.items.map((item, j) => {
                          const tenGodChars: { char: string; hanja: string; type: 'stem'|'branch', element: string, inChart: boolean }[] = [];
                          const localDayPillar = result.pillars.find(p => p.title === 'Day' && !p.isUnknown);
                          const dayMaster = localDayPillar ? localDayPillar.stem : '甲';

                          const allStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
                          allStems.forEach(s => {
                              const tg = getDetailedTenGod(dayMaster, s);
                              if (tg.ko === item.nameKo) {
                                  const isUserHas = result.pillars.some(p => !p.isUnknown && p.stem === s);
                                  const enName = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.en.split(' ')[0] || s;
                                  const koName = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.ko.slice(0, 1) || s;
                                  const element = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.element || '';
                                  tenGodChars.push({ char: lang === 'KO' ? koName : enName, hanja: s, type: 'stem', element, inChart: isUserHas });
                              }
                          });

                          const BRANCHES_INFO: Record<string, { element: string, polarity: number }> = {
                            '子': { element: 'Water', polarity: 1 }, '丑': { element: 'Earth', polarity: -1 },
                            '寅': { element: 'Wood', polarity: 1 }, '卯': { element: 'Wood', polarity: -1 },
                            '辰': { element: 'Earth', polarity: 1 }, '巳': { element: 'Fire', polarity: -1 },
                            '午': { element: 'Fire', polarity: 1 }, '未': { element: 'Earth', polarity: -1 },
                            '申': { element: 'Metal', polarity: 1 }, '酉': { element: 'Metal', polarity: -1 },
                            '戌': { element: 'Earth', polarity: 1 }, '亥': { element: 'Water', polarity: -1 }
                          };
                          const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
                          const dmIdx = allStems.indexOf(dayMaster);
                          const dmElement = dmIdx !== -1 ? ELEMENTS[Math.floor(dmIdx / 2)] : 'Wood';
                          const dmPolarity = dmIdx !== -1 ? ((dmIdx % 2) === 0 ? 1 : -1) : 1;

                          Object.keys(BRANCHES_INFO).forEach(b => {
                              const bInfo = BRANCHES_INFO[b];
                              const sIdx = ELEMENTS.indexOf(dmElement);
                              const tIdx = ELEMENTS.indexOf(bInfo.element);
                              const diff = (tIdx - sIdx + 5) % 5;
                              const samePolarity = dmPolarity === bInfo.polarity;
                              const tenGodsMap: Record<number, [string, string]> = {
                                0: samePolarity ? ['비견', 'Mirror'] : ['겁재', 'Rival'],
                                1: samePolarity ? ['식신', 'Artist'] : ['상관', 'Rebel'],
                                2: samePolarity ? ['편재', 'Maverick'] : ['정재', 'Architect'],
                                3: samePolarity ? ['편관', 'Warrior'] : ['정관', 'Judge'],
                                4: samePolarity ? ['편인', 'Mystic'] : ['정인', 'Sage'],
                              };
                              const tg = tenGodsMap[diff];
                              if (tg[0] === item.nameKo) {
                                  const isUserHas = result.pillars.some(p => !p.isUnknown && p.branch === b);
                                  const enName = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.en.split(' ')[0] || b;
                                  const koName = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.ko.slice(0, 1) || b;
                                  const element = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.element || '';
                                  tenGodChars.push({ char: lang === 'KO' ? koName : enName, hanja: b, type: 'branch', element, inChart: isUserHas });
                              }
                          });

                          return (
                            <div key={j} className="p-5 flex flex-col justify-between h-full bg-[#161623]/20 hover:bg-[#1c1c30]/40 transition-colors duration-300">
                              <div className="flex flex-col gap-2 mb-3">
                                <div className="flex items-center justify-between gap-3 min-w-0">
                                  <div className="flex items-baseline gap-2 min-w-0">
                                    <span className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight">
                                      {lang === 'KO' ? item.nameKo : item.nameEn}
                                    </span>
                                    <span className="text-xs text-white/45 font-medium">
                                      {lang === 'KO' ? item.nameEn : item.nameKo}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center justify-end gap-1 shrink-0">
                                    {tenGodChars.filter(tc => tc.inChart).map((tc, idx) => (
                                      <div 
                                        key={idx} 
                                        className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border bg-white/10 shadow-[0_0_8px_rgba(255,255,255,0.15)] border-white/30"
                                      >
                                        <span className="text-[10px] sm:text-xs font-bold leading-none" style={{ color: ELEMENT_COLORS[tc.element as keyof typeof ELEMENT_COLORS] || '#fff' }}>
                                          {tc.hanja}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs sm:text-sm text-white/70 leading-relaxed break-keep" style={{ wordBreak: 'keep-all' }}>
                                {lang === 'KO' ? item.descKo : item.descEn}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* GeJu Help Modal */}
      <GeJuHelpModal
        isOpen={showGeJuInfo}
        onClose={() => setShowGeJuInfo(false)}
        result={result}
        lang={lang}
        colorizeAdvancedAnalysis={colorizeAdvancedAnalysis}
      />

      {/* Strength Info Modal */}
      {showStrengthInfo && result.analysis?.shinGangShinYak && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-goth-bg border border-white/10 rounded-[32px] p-8 relative overflow-hidden"
          >
            <button 
              onClick={() => setShowStrengthInfo(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neon-cyan/20 flex items-center justify-center">
                  <Sun className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">{lang === 'KO' ? '일간 강약 분석' : 'DM Strength Analysis'}</h3>
                  <p className="text-xs text-white/40 tracking-widest uppercase">{result.analysis.shinGangShinYak.title}</p>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <p className="text-sm font-medium text-neon-cyan">{lang === 'KO' ? '일간 강약이란?' : 'What is DM Strength?'}</p>
                <div className="text-xs leading-relaxed text-white/70">
                  <ParsedText lang={lang} text={result.analysis.shinGangShinYak.summary} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">{lang === 'KO' ? '나의 상태' : 'My Status'}</p>
                  <div className="text-xs leading-relaxed text-white/70">
                    <ParsedText lang={lang} text={result.analysis.shinGangShinYak.description} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">{lang === 'KO' ? '사회적 발현' : 'Social Manifestation'}</p>
                  <div className="text-xs leading-relaxed text-white/70 font-sans">
                    <ParsedText lang={lang} text={result.analysis.shinGangShinYak.socialContext} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">{lang === 'KO' ? '강약 점수' : 'Strength Score'}</span>
                  <span className="text-lg font-bold text-neon-cyan">{result.analysis.dayMasterStrength.score.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Mu-Ja/Da-Ja Detail Modal */}
      {showMuJaDaJaInfo && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-goth-bg border border-white/10 rounded-[32px] p-8 relative overflow-hidden"
          >
            <button 
              onClick={() => setShowMuJaDaJaInfo(null)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${(showMuJaDaJaInfo.title && showMuJaDaJaInfo.title.includes('무')) ? 'bg-red-500/20' : 'bg-purple-500/20'}`}>
                  <Zap className={`w-6 h-6 ${(showMuJaDaJaInfo.title && showMuJaDaJaInfo.title.includes('무')) ? 'text-red-400' : 'text-purple-400'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">{showMuJaDaJaInfo.title}</h3>
                  <p className="text-xs text-white/40 tracking-widest uppercase">{lang === 'KO' ? '상세 분석' : 'Detailed Analysis'}</p>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                  <ParsedText lang={lang} text={lang === 'KO' ? showMuJaDaJaInfo.description : (showMuJaDaJaInfo.enDescription || showMuJaDaJaInfo.description)} />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] text-white/40 text-center italic">
                  {lang === 'KO' ? '*이 해석은 사주의 전체적인 흐름과 조화를 고려한 맞춤형 분석이야.' : '*This interpretation is a customized analysis considering the overall flow and harmony of the chart.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Mu-Ja/Da-Ja General Help Modal */}
      {showMuJaDaJaHelp && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-goth-bg border border-white/10 rounded-[32px] p-8 relative overflow-hidden"
          >
            <button 
              onClick={() => setShowMuJaDaJaHelp(false)}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-neon-cyan/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">{lang === 'KO' ? '무자론 & 다자론 원리' : 'Absence & Excess Principles'}</h3>
                  <p className="text-xs text-white/40 tracking-widest uppercase">{lang === 'KO' ? '명리학적 기초' : 'BaZi Fundamentals'}</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-red-400">{lang === 'KO' ? '1. 무자론 (無字論): 결핍이 곧 잠재력' : '1. Absence Theory: Absence as Potential'}</p>
                  <p className="text-xs leading-relaxed text-white/70">
                    {lang === 'KO' 
                      ? '사주에 특정 십성이 아예 없는 경우를 말해. 이는 단순히 해당 에너지가 결핍된 것이 아니라, 오히려 그 에너지를 "한계 없이" 쓰거나, 혹은 그 에너지에 대한 집착이 강할 수 있음을 의미해. 없는 글자가 당신의 가장 큰 무기가 될 수 있어.'
                      : 'Refers to the complete absence of a specific Ten God. This doesn\'t just mean a lack; it means you can use that energy "without limits" or may have a strong obsession with it. The missing element can become your greatest weapon.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-purple-400">{lang === 'KO' ? '2. 다자론 (多者論): 과유불급의 원리' : '2. Excess Theory: The Principle of Excess'}</p>
                  <p className="text-xs leading-relaxed text-white/70">
                    {lang === 'KO'
                      ? '특정 십성이 3개 이상(비율 30% 초과)인 경우야. 해당 에너지가 과다하여 삶의 균형이 깨지기 쉽고, 그 십성이 상징하는 육친이나 사회적 관계에서 스트레스를 받을 수 있음을 의미해. 넘치는 에너지를 어떻게 조절하느냐가 핵심이야.'
                      : 'Refers to having 3 or more of a specific Ten God (over 30%). Excessive energy can easily disrupt life balance and cause stress in related social or familial relationships. The key is how to regulate this overflowing energy.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-neon-pink">{lang === 'KO' ? '3. 무비겁 (無比劫): 독자적인 개척자' : '3. No Bi-Geop: Independent Pioneer'}</p>
                  <p className="text-xs leading-relaxed text-white/70">
                    {lang === 'KO'
                      ? '비견과 겁재가 없는 경우야. 타인의 시선에 민감하지 않고 독자적인 길을 가지만, 때로는 고립감을 느끼거나 경쟁 상황에서 쉽게 물러날 수 있어. 자신만의 뚝심을 기르는 것이 중요해.'
                      : 'Refers to the absence of Bi-Gyean and Geob-Jae. You walk your own path without being sensitive to others\' views, but may sometimes feel isolated or retreat easily in competitive situations. Cultivating your own inner strength is vital.'}
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                  <p className="text-xs font-bold text-neon-cyan" dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(
                    lang === 'KO' 
                      ? `${BAZI_MAPPING.elements?.[result.analysis.dayMasterElement as keyof typeof BAZI_MAPPING.elements]?.ko || result.analysis.dayMasterElement}(${BAZI_MAPPING.elements?.[result.analysis.dayMasterElement as keyof typeof BAZI_MAPPING.elements]?.hanja || ''}) 일간의 십성별 본질` 
                      : `Essence of Ten Gods for ${result.analysis.dayMasterElement}(${BAZI_MAPPING.elements?.[result.analysis.dayMasterElement as keyof typeof BAZI_MAPPING.elements]?.hanja || ''}) DM`
                  ) }} />
                  <ul className="space-y-2 text-[10px] text-white/60 list-disc pl-4">
                    {result.analysis.personalizedInsights && Object.entries(result.analysis.personalizedInsights).map(([key, value]: [string, any]) => (
                      <li key={key}>
                        <span className="text-white/80 font-bold">
                          <ParsedText lang={lang} text={lang === 'KO' ? value.ko : value.en} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Yongshin Roles Info Modal */}
      <AnimatePresence>
        {showYongshinRolesInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowYongshinRolesInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0a0a0a] border border-purple-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowYongshinRolesInfo(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-xl font-bold text-purple-400 mb-4">
                {lang === 'KO' ? '희신, 기신, 구신이란?' : 'HeeShin, GiShin, and GuShin'}
              </h3>
              
              <div className="text-sm text-white/80 space-y-4 leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <p>
                  {lang === 'KO' 
                    ? '사주의 균형을 잡아주는 핵심 에너지인 용신(用神)을 기준으로, 나에게 도움이 되는 기운과 방해가 되는 기운을 분류한 거야.' 
                    : 'Based on the Yongshin (Useful God) which balances your chart, these represent the energies that either support or hinder you.'}
                </p>
                
                <div className="space-y-3">
                  <div className="bg-white/5 p-3 rounded-lg border border-green-400/30">
                    <h4 className="font-bold text-green-400 mb-1">{lang === 'KO' ? '희신 (喜神 - 기쁠 희, 귀신 신)' : 'HeeShin (喜神 - Joyful God)'}</h4>
                    <p className="text-xs text-white/70 mb-2">
                      {lang === 'KO' ? '용신을 도와주는 긍정적인 에너지야. 용신이 힘을 잃지 않도록 보좌하는 역할을 해.' : 'Positive energy that supports the Yongshin. It assists the Useful God so it doesn\'t lose power.'}
                    </p>
                    <div className="text-xs bg-black/40 p-2 rounded text-green-400/90 flex items-center gap-2">
                      <span className="font-bold">{lang === 'KO' ? '나의 희신:' : 'Your HeeShin:'}</span>
                      {renderYongshinWithElement(result.analysis.yongshinDetail.heeShin.god, true)}
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-red-400/30">
                    <h4 className="font-bold text-red-400 mb-1">{lang === 'KO' ? '기신 (忌神 - 꺼릴 기, 귀신 신)' : 'GiShin (忌神 - Taboo God)'}</h4>
                    <p className="text-xs text-white/70 mb-2">
                      {lang === 'KO' ? '용신을 극(沖/剋)하여 방해하는 부정적인 에너지야. 이 기운이 강해지면 삶의 균형이 깨지기 쉬워.' : 'Negative energy that attacks or hinders the Yongshin. When this energy is strong, life\'s balance can easily be disrupted.'}
                    </p>
                    <div className="text-xs bg-black/40 p-2 rounded text-red-400/90 flex items-center gap-2">
                      <span className="font-bold">{lang === 'KO' ? '나의 기신:' : 'Your GiShin:'}</span>
                      {renderYongshinWithElement(result.analysis.yongshinDetail.giShin.god, true)}
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-orange-400/30">
                    <h4 className="font-bold text-orange-400 mb-1">{lang === 'KO' ? '구신 (仇神 - 원수 구, 귀신 신)' : 'GuShin (仇神 - Enemy God)'}</h4>
                    <p className="text-xs text-white/70 mb-2">
                      {lang === 'KO' ? '희신을 극하여 방해하거나, 기신을 도와주는 에너지야. 기신 다음으로 주의해야 할 기운이야.' : 'Energy that attacks the HeeShin or supports the GiShin. It is the second most cautious energy after GiShin.'}
                    </p>
                    <div className="text-xs bg-black/40 p-2 rounded text-orange-400/90 flex items-center gap-2">
                      <span className="font-bold">{lang === 'KO' ? '나의 구신:' : 'Your GuShin:'}</span>
                      {renderYongshinWithElement(result.analysis.yongshinDetail.guShin.god, true)}
                    </div>
                  </div>

                  {result.analysis.yongshinDetail.hanShin && (
                    <div className="bg-white/5 p-3 rounded-lg border border-blue-400/30">
                      <h4 className="font-bold text-blue-400 mb-1">{lang === 'KO' ? '한신 (閑神 - 한가할 한, 귀신 신)' : 'HanShin (閑神 - Idle God)'}</h4>
                      <p className="text-xs text-white/70 mb-2">
                        {lang === 'KO' ? '용신에 큰 영향을 주지 않는 중립적인 에너지야. 상황에 따라 희신이나 기신을 돕기도 해.' : 'Neutral energy that doesn\'t significantly affect the Yongshin. It may support HeeShin or GiShin depending on the situation.'}
                      </p>
                      <div className="text-xs bg-black/40 p-2 rounded text-blue-400/90 flex items-center gap-2">
                        <span className="font-bold">{lang === 'KO' ? '나의 한신:' : 'Your HanShin:'}</span>
                        {renderYongshinWithElement(result.analysis.yongshinDetail.hanShin.god, true)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Yongshin Info Modal */}
      <AnimatePresence>
        {showYongshinInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowYongshinInfo(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-neon-pink">
                    {lang === 'KO' ? '용신(用神)이란?' : 'What is Yongshin?'}
                  </h3>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowYongshinInfo(false)} 
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <div className="text-sm text-white/80 space-y-4 leading-relaxed">
                  <p>
                    {lang === 'KO' 
                      ? '용신은 사주팔자의 균형을 맞추고, 부족한 기운을 보완하여 인생의 흐름을 원활하게 만드는 가장 필요한 오행이야.' 
                      : 'Yongshin is the most essential element that balances the BaZi chart, supplements weak energies, and facilitates the smooth flow of life.'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Eokbu Yongshin Info Modal */}
      <AnimatePresence>
        {showEokbuInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowEokbuInfo(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-neon-pink">
                    {lang === 'KO' ? '억부용신(抑扶用神)이란?' : 'What is Eokbu (Balancing) Yongshin?'}
                  </h3>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEokbuInfo(false)} 
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <div className="text-sm text-white/80 space-y-4 leading-relaxed">
                  <p>
                    {lang === 'KO' 
                      ? '사주의 균형을 맞추기 위해, 너무 강한 기운은 억제(抑)하고 부족한 기운은 도와주는(扶) 오행이야.' 
                      : 'To balance the chart, Eokbu Yongshin suppresses (抑) overly strong elements and supports (扶) weak ones.'}
                  </p>

                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                    <h4 className="font-bold text-white/90">{lang === 'KO' ? '사용자 맞춤 분석' : 'Personalized Analysis'}</h4>
                    <p>
                      {lang === 'KO' 
                        ? '사주 내에서 강한 기운을 조절하여 전체적인 균형을 잡는 역할을 해.'
                        : 'It plays a role in balancing the overall chart by regulating strong energies.'}
                    </p>
                    <p className="italic text-white/60">
                      {lang === 'KO' ? result.analysis.yongshinDetail.eokbu.note : result.analysis.yongshinDetail.eokbu.noteEn}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interaction Info Modal */}
      <AnimatePresence>
        {showInteractionInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowInteractionInfo(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-neon-cyan">
                    {lang === 'KO' ? '상호작용 상세' : 'Interaction Details'}
                  </h3>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInteractionInfo(null)} 
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <div className="text-sm text-white/80 space-y-4 leading-relaxed">
                  {showInteractionInfo && BAZI_MAPPING.interactionDetails[showInteractionInfo as keyof typeof BAZI_MAPPING.interactionDetails] ? (
                    <>
                      <p className="text-lg font-bold text-white">
                        {BAZI_MAPPING.interactionDetails[showInteractionInfo as keyof typeof BAZI_MAPPING.interactionDetails][lang === 'KO' ? 'ko' : 'en'].title}
                      </p>
                      <p>{BAZI_MAPPING.interactionDetails[showInteractionInfo as keyof typeof BAZI_MAPPING.interactionDetails][lang === 'KO' ? 'ko' : 'en'].general}</p>
                      <div className="space-y-2">
                        {Object.entries(BAZI_MAPPING.interactionDetails[showInteractionInfo as keyof typeof BAZI_MAPPING.interactionDetails][lang === 'KO' ? 'ko' : 'en'].types).map(([key, value]) => (
                          <p key={key}><span className="text-neon-cyan font-bold">{key}:</span> {value}</p>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p>{lang === 'KO' ? '상세 설명이 준비 중이야.' : 'Detailed explanation is being prepared.'}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Soul Summary Report Card */}
      <SoulSummaryCard result={result} lang={lang} />

      <div className="flex justify-center pt-12 pb-[calc(100px+env(safe-area-inset-bottom))]">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-12 py-4 border border-neon-pink text-neon-pink text-sm font-bold tracking-[0.3em] hover:bg-neon-pink hover:text-white transition-all rounded-full"
        >
          {t.back}
        </motion.button>
      </div>
      
      {/* 
        Sticky Bottom Action Bar 
        iOS Notch / Home Indicator 대응 
      */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pt-6 pb-[calc(1rem+env(safe-area-inset-bottom))] px-4 bg-gradient-to-t from-[#0B0118] via-[#0B0118]/90 to-transparent backdrop-blur-sm pointer-events-none flex justify-center">
        <div className="w-full max-w-sm sm:max-w-md pointer-events-auto">
          <motion.button 
            animate={{ 
              boxShadow: ["0 0 10px rgba(255,0,122,0.4)", "0 0 25px rgba(255,0,122,0.8)", "0 0 10px rgba(255,0,122,0.4)"],
              scale: [1, 1.02, 1]
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (showAnalysis) {
                setShowAnalysis(false);
              } else {
                setShowAnalysis(true);
                setTimeout(() => {
                  const el = document.getElementById('analysis-report-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);
              }
            }}
            className="w-full py-4 bg-neon-pink/20 border border-neon-pink text-neon-pink font-display font-black text-[15px] sm:text-base tracking-[0.2em] rounded-[2rem] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,122,0.4)] relative overflow-hidden"
          >
            {/* Button Shine Effect (optional purely CSS) */}
            <div className="absolute inset-0 bg-white/10 w-[50%] -skew-x-12 -translate-x-[150%] animate-[shine_3s_infinite]" />
            {showAnalysis ? (lang === 'KO' ? '내 사주 자세히 닫기' : 'Hide Soul Details') : (lang === 'KO' ? '내 사주 자세히 보기' : 'Extract Soul Details')}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

const SoulSummaryCard = ({ result, lang }: { result: BaZiResult, lang: Language }) => {
  const isLight = typeof document !== 'undefined' ? document.body.classList.contains('light-mode') : false;
  const summary = React.useMemo(() => generateSoulSummary(result, lang), [result, lang]);
  const dayPillar = result.pillars.find(p => p.title === 'Day');
  const iljuData = dayPillar ? ILJU_DESCRIPTIONS[dayPillar.hanja] : null;
  const [isImageViewMode, setIsImageViewMode] = React.useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 p-1 bg-gradient-to-br from-neon-pink/20 via-neon-cyan/20 to-neon-purple/20 rounded-[2rem] shadow-[0_0_30px_rgba(255,0,122,0.15)]"
    >
      <div className="bg-black/95 rounded-[1.9rem] border border-white/10 relative overflow-hidden flex flex-col justify-center p-6 sm:p-10 min-h-[600px]">
        {iljuData?.detailImg && (
          <img 
            src={iljuData.cardBg || iljuData.detailImg}
            alt={`${dayPillar?.hanja} Background`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full z-0 opacity-40 object-cover transition-opacity duration-700"
          />
        )}

        {/* Fullscreen popup overlay inside React Portal for robust rendering */}
        {typeof document !== 'undefined' && createPortal(
          <div 
            onClick={() => setIsImageViewMode(false)}
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-md cursor-zoom-out transition-all duration-[400ms] ${
              isImageViewMode 
                ? 'opacity-100 pointer-events-auto' 
                : 'opacity-0 pointer-events-none'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Floating close button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsImageViewMode(false);
              }}
              className="absolute top-4 right-4 z-[10001] px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#39FF14]/40 hover:border-[#39FF14] text-[11px] sm:text-xs font-bold text-white hover:text-[#39FF14] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(57,255,20,0.25)]"
            >
              <X className="w-3.5 h-3.5 text-[#39FF14]" />
              {lang === 'KO' ? '이미지 닫기' : 'Close Image'}
            </button>

            <div 
              className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[425px] flex items-center justify-center"
              style={{ aspectRatio: '9/16' }}
            >
              {iljuData?.detailImg && (
                <img 
                  src={iljuData.detailImg}
                  alt={`${dayPillar?.hanja} Full Detail`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(255,0,122,0.35)] transition-all duration-[400ms] origin-center ${
                    isImageViewMode 
                      ? 'scale-100 opacity-100 rotate-0' 
                      : 'scale-[0.45] opacity-0 rotate-1'
                  }`}
                  style={{
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                />
              )}
              {/* Decorative neon indicator bottom stream */}
              <div 
                className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-purple transition-opacity duration-[400ms] ${
                  isImageViewMode ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              />
            </div>
          </div>,
          document.body
        )}

        {/* Decorative elements */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-neon-pink/5 blur-[100px] -z-10 transition-opacity duration-700 ${isImageViewMode ? 'opacity-0' : 'opacity-100'}`} />
        <div className={`absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/5 blur-[100px] -z-10 transition-opacity duration-700 ${isImageViewMode ? 'opacity-0' : 'opacity-100'}`} />
        
        <motion.div 
          animate={{ 
            opacity: isImageViewMode ? 0 : 1, 
            scale: isImageViewMode ? 0.95 : 1,
            pointerEvents: isImageViewMode ? 'none' : 'auto'
          }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10 flex flex-col items-center text-center space-y-6 w-full"
        >
          {/* Aligned balanced top header row when reading content to prevent visual overlap */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 pb-3 border-b border-white/5 mb-2">
            <div className="inline-block px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-[8px] border border-white/10 text-[10px] font-display font-bold tracking-[0.3em] text-white/40 uppercase shadow-lg">
              Soul Summary Report
            </div>
            {!isImageViewMode && iljuData?.detailImg && (
              <button 
                onClick={() => setIsImageViewMode(true)}
                className="px-4 py-1.5 rounded-full bg-neon-pink/10 backdrop-blur-md border border-neon-pink/30 text-[10px] sm:text-xs font-bold text-neon-pink hover:text-white hover:bg-neon-pink transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(255,0,122,0.15)] hover:shadow-[0_0_15px_rgba(255,0,122,0.35)]"
              >
                <Image className="w-3.5 h-3.5" />
                {lang === 'KO' ? '이미지 보기' : 'View Image'}
              </button>
            )}
          </div>
              
              <div className="space-y-2 w-full p-6 bg-black/30 backdrop-blur-[8px] border border-white/10 rounded-2xl shadow-lg">
                <div className="text-neon-pink text-sm font-bold tracking-widest uppercase">{summary.iljuName}</div>
                <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                  "{summary.oneLineReview}"
                </h2>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {summary.hashtags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-black/40 border border-gray-400/40 text-[11px] sm:text-xs text-[#39FF14] font-bold shadow-[0_0_8px_rgba(57,255,20,0.4)] tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-neon-pink to-transparent" />
              
              <div className="max-w-2xl w-full space-y-4">
                <div className="space-y-2 p-6 bg-black/30 backdrop-blur-[8px] border border-white/10 rounded-2xl shadow-lg">
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">
                    {lang === 'KO' ? '가까이 해야할 핵심에너지' : 'Core Energy to Keep Close'}
                  </p>
                  <p className="text-2xl sm:text-3xl font-display font-extrabold uppercase tracking-widest transition-colors duration-500">
                    {(() => {
                      const elementStr = summary.coreEnergy.element || '';
                      const parts = elementStr.split(/(\s*[\/·,]\s*|\s+)/g);
                      return parts.map((part, index) => {
                        const isSeparator = /^[\s\/·,]+$/.test(part);
                        if (isSeparator) {
                          return (
                            <span key={index} className="text-slate-400 dark:text-white/40 mx-0.5 sm:mx-1">
                              {part}
                            </span>
                          );
                        }
                        const color = getElementColorForText(part, isLight);
                        return (
                          <span 
                            key={index} 
                            style={{ 
                              color: color,
                              textShadow: isLight ? 'none' : `0 0 12px ${color}66`
                            }}
                            className="transition-all duration-300"
                          >
                            {part}
                          </span>
                        );
                      });
                    })()}
                  </p>
                  <p className="text-lg sm:text-xl text-white/90 font-medium leading-relaxed mt-2">
                    {summary.coreEnergy.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 bg-black/30 backdrop-blur-[8px] rounded-2xl border border-white/10 shadow-lg text-left space-y-2">
                    <div className="flex items-center gap-2 text-neon-pink">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{lang === 'KO' ? '이번 달 행동 처방전' : 'Action Prescription'}</span>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">{summary.actionPrescription}</p>
                  </div>
                  
                  <div className="p-5 bg-black/30 backdrop-blur-[8px] rounded-2xl border border-white/10 shadow-lg text-left space-y-2">
                    <div className="flex items-center gap-2 text-neon-cyan">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{lang === 'KO' ? '행운의 습관' : 'Lucky Habit'}</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{summary.coreEnergy.luckyHabit}</p>
              </div>
            </div>
          </div>
          
          <div className="w-full pt-4 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4 p-5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg flex flex-col">
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-white/60 uppercase self-center sm:self-start">
                  {lang === 'KO' ? '행운의 아이템' : 'Lucky Items'}
                </div>
                <div className="space-y-3 flex-1">
                  {summary.luckyItems.map((item, i) => (
                    <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 text-left">
                      <div className="text-[10px] text-neon-purple font-bold uppercase mb-1">{item.name}</div>
                      <p className="text-[11px] text-white/70 leading-snug">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 p-5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg flex flex-col justify-center">
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-widest text-white/60 uppercase self-center">
                  {lang === 'KO' ? '오행 밸런스 요약' : 'Elemental Balance'}
                </div>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {summary.elementStrengths.map((es, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-full bg-white/5 rounded-full h-16 relative overflow-hidden">
                        <motion.div 
                          initial={{ height: 0 }}
                          whileInView={{ height: `${Math.min(es.percentage, 100)}%` }}
                          className="absolute bottom-0 left-0 w-full"
                          style={{ backgroundColor: es.color }}
                        />
                      </div>
                      <span className="text-[8px] font-bold text-white/40">{es.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 w-full">
            <button 
              disabled
              className="w-full py-4 bg-black/40 backdrop-blur-md border border-dashed border-white/20 rounded-2xl text-white/30 text-sm font-display tracking-widest uppercase cursor-not-allowed flex items-center justify-center gap-2 shadow-lg mb-2"
            >
              <Share2 className="w-4 h-4" />
              {lang === 'KO' ? '리포트 공유하기 (준비 중)' : 'Share Report (Coming Soon)'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
