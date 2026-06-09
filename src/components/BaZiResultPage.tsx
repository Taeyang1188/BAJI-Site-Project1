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
  Image,
  Link
} from 'lucide-react';

import { generateSoulSummary, SoulSummary } from '../services/bazi-summary-service';
import { generateCycleVibe, CycleVibeResult } from '../services/cycle-vibe-service';
import { getTodayPillar } from '../services/bazi-service';
import { ILJU_DESCRIPTIONS } from '../constants/ilju-descriptions';
import { TEN_GOD_DESCRIPTIONS } from '../constants/tenGodDescriptions';
import { useTheme } from '../contexts/ThemeContext';
import { compressPayload } from '../services/share-compress-service';

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

import { SocialContext, UserInput } from '../types';

interface BaZiResultPageProps {
  result: BaZiResult;
  lang: Language;
  userName: string;
  gender: string;
  city: string;
  socialContext?: SocialContext;
  onBack: () => void;
  skipTyping?: boolean;
  userInput?: UserInput;
  coords?: { lat: number; lon: number };
}

const parseColorBracketsToHtml = (text: string): string => {
  if (!text) return text;
  let result = text;
  result = result.replace(/\[tooltip:([^|\]]+)(?:\|[^\]]+)?\]/g, '$1');
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\[([^:\]]+):([^\]]+)\]/g, (match, color, content) => {
    return `<span style="color: ${color}; font-weight: bold;">${content}</span>`;
  });
  
  // Only skip <br/> insertion if it explicitly starts with <div (block elements)
  // Inline elements like <strong> or <span> should retain <br /> for newlines.
  if (result.trim().startsWith('<div')) {
    result = result.replace(/\r?\n/g, ' ');
  } else {
    result = result.replace(/\n/g, '<br />');
  }
  return result;
};

const BaziTooltip = ({ 
  content, 
  children, 
  lang, 
  onVisibleChange 
}: { 
  content: { ko: string, en: string }, 
  children: React.ReactNode, 
  lang: Language, 
  key?: any,
  onVisibleChange?: (visible: boolean) => void 
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'top' as 'top' | 'bottom' });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;
      const tooltipWidth = isMobile ? 250 : 285;
      let left = rect.left + rect.width / 2 - tooltipWidth / 2;
      
      // Boundary checks to keep tooltip within viewport with safe margins
      const margin = 8;
      if (left < margin) left = margin;
      if (left + tooltipWidth > window.innerWidth - margin) {
        left = window.innerWidth - tooltipWidth - margin;
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

  const handleInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (timerRef.current) clearTimeout(timerRef.current);
    updatePosition();
    setIsVisible((prev) => !prev);

    // Auto hide after 5s for touch
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  const onVisibleChangeRef = React.useRef(onVisibleChange);
  React.useEffect(() => {
    onVisibleChangeRef.current = onVisibleChange;
  }, [onVisibleChange]);

  React.useEffect(() => {
    onVisibleChangeRef.current?.(isVisible);
  }, [isVisible]);

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
      className="relative inline-block cursor-help animate-none" 
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
      onTouchStart={handleTouchStart}
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
              className={`w-[250px] sm:w-[285px] p-2.5 sm:p-3 border rounded-lg shadow-2xl backdrop-blur-xl pointer-events-none transition-colors duration-300 ${
                isLight 
                  ? 'bg-white/95 border-slate-200 text-slate-900 shadow-[0_8px_25px_rgba(0,0,0,0.12)]' 
                  : 'bg-black/95 border-white/20 text-white/90 shadow-2xl'
              }`}
            >
              <div 
                className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-800' : 'text-white/90'}`}
                dangerouslySetInnerHTML={{ 
                  __html: parseColorBracketsToHtml(lang === 'KO' ? content.ko : content.en) 
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
};

export default function BaZiResultPage({ result, lang, userName, gender, city, socialContext, onBack, skipTyping = false, userInput, coords }: BaZiResultPageProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const t = TRANSLATIONS[lang].result as any;
  const [guideSelectedPillar, setGuideSelectedPillar] = React.useState<'Year' | 'Month' | 'Day' | 'Hour'>('Day');
  const [hoveredHiddenStem, setHoveredHiddenStem] = React.useState<{pillarIdx: number, hsIdx: number, hs: string, connectedStems: string[], isDestroyed?: boolean} | null>(null);
  const [guideRelTab, setGuideRelTab] = React.useState<'samhap' | 'banghap' | 'yukhap' | 'clash' | 'punish' | 'destroy' | 'harm'>('samhap');
  const [activeSubIndex, setActiveSubIndex] = React.useState<number>(0);
  const [guideInsightCollapsed, setGuideInsightCollapsed] = React.useState<boolean>(true);

  // Removed. Code moved down below state declarations.

  React.useEffect(() => {
    if (!result) return;
    const samhapBranches = ['해묘미(亥卯未)', '인오술(寅午戌)', '사유축(巳酉丑)', '신자진(申子辰)'];
    let foundIdx = -1;
    for (let i = 0; i < samhapBranches.length; i++) {
      if (getUserInteractionMatch('samhap', samhapBranches[i])) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx !== -1) {
      setActiveSubIndex(foundIdx);
    } else {
      setActiveSubIndex(0);
    }
  }, [result]);

  const dayMasterDetails = result?.analysis?.dayMasterStrength?.rootingDetails?.find((r: any) => r.pillarTitle === 'Day');
  const isDayMasterRooted = !!(dayMasterDetails && dayMasterDetails.roots && dayMasterDetails.roots.some((rt: any) => !rt.isDestroyed));

  // 등라계갑 특별 예외 연산
  const dayPillarForSpecial = result?.pillars?.find((p: any) => p.title === 'Day');
  const dayMasterForSpecial = dayPillarForSpecial?.stem;
  const isEulDM = dayMasterForSpecial === '乙';
  const stemsListForSpecial = result?.pillars?.map((p: any) => p.stem) || [];
  const branchesListForSpecial = result?.pillars?.map((p: any) => p.branch) || [];
  const hasBackingOak = stemsListForSpecial.includes('甲') || branchesListForSpecial.includes('寅') || branchesListForSpecial.includes('亥');
  const isDeungRaGyeGap = isEulDM && hasBackingOak;
  const giShinGodForSpecial = result?.analysis?.yongshinDetail?.giShin?.god;
  const isGiShinWood = giShinGodForSpecial === '비겁' || giShinGodForSpecial === '비견' || giShinGodForSpecial === '겁재';
  const shouldApplyDeungRaSpecial = isDeungRaGyeGap && isGiShinWood;

  const getUserInteractionMatch = (guideCategory: string, itemBranchesStr: string) => {
    if (!result || !result.analysis || !result.analysis.interactions) return null;
    
    const branchHanjaToKo: Record<string, string> = {
      '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
      '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
    };

    const stemHanjaToKo: Record<string, string> = {
      '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무', '己': '기',
      '庚': '경', '辛': '신', '壬': '임', '癸': '계'
    };

    const convertHanjaListToKo = (hanjaList: string[]): string[] => {
      return hanjaList.map(h => branchHanjaToKo[h] || stemHanjaToKo[h] || h);
    };

    const interactions = result.analysis.interactions;
    const subItems = itemBranchesStr.split('/').map(s => s.trim());
    const parsedGuideGroups: string[][] = subItems.map(subStr => {
      const koChars = subStr.match(/[가-힣]/g) || [];
      return koChars as string[];
    });
    
    const matchedInteractions: any[] = [];
    
    for (const inter of interactions) {
      const interType = inter.type; // standard Korean or specific string like '삼합', '반합', etc.
      
      let isCategoryMatch = false;
      if (guideCategory === 'samhap' && (interType === '삼합' || interType === '반합')) isCategoryMatch = true;
      else if (guideCategory === 'banghap' && (interType === '방합' || interType === '준방합')) isCategoryMatch = true;
      else if (guideCategory === 'yukhap' && interType === '육합') isCategoryMatch = true;
      else if (guideCategory === 'clash' && (interType === '지지충' || interType === '격충' || interType === '원충' || interType === '천간충')) isCategoryMatch = true;
      else if (guideCategory === 'punish' && (interType === '삼형' || interType === '반형' || interType === '자형' || interType === '복음' || interType === '상형')) isCategoryMatch = true;
      else if (guideCategory === 'destroy' && interType === '파') isCategoryMatch = true;
      else if (guideCategory === 'harm' && interType === '해') isCategoryMatch = true;
      
      if (!isCategoryMatch) continue;
      
      const interBranches = (inter.branches || []) as string[];
      const interStems = (inter.stems || []) as string[];
      const interItems = interBranches.length > 0 ? interBranches : interStems;
      if (interItems.length === 0) continue;

      const interItemsKo = convertHanjaListToKo(interItems);
      
      for (const gdGroup of parsedGuideGroups) {
        if (gdGroup.length === 0) continue;
        const uniqueInterItems = Array.from(new Set(interItemsKo));
        const uniqueGdGroup = Array.from(new Set(gdGroup));
        const uniqueOverlap = uniqueInterItems.filter((char: string) => uniqueGdGroup.includes(char));
        
        let isMatch = false;
        if (interType === '자형' || interType === '복음') {
          // Self-relations (e.g. 진진, 오오, 유유, 해해): match if the single unique branch is contained in gdGroup
          isMatch = uniqueOverlap.length === 1 && (gdGroup.includes('진') || gdGroup.includes('오') || gdGroup.includes('유') || gdGroup.includes('해'));
        } else {
          // Multi-party relations (combinations, clashes, punishments, harms, destructions etc.)
          // require at least 2 distinct matching characters to prevent false matching from duplicate single branches
          isMatch = uniqueOverlap.length >= 2;
        }
        
        if (isMatch) {
          if (!matchedInteractions.some(m => m === inter)) {
            matchedInteractions.push(inter);
          }
        }
      }
    }
    
    if (matchedInteractions.length === 0) return null;
    
    const getInterPriority = (it: any) => {
      const sev = it.severity || "full";
      const type = it.type || "";
      
      if (type === '지지충' || type === '천간충' || type === '삼형' || type === '자형' || type === '복음' || type === '육합' || type === '삼합' || type === '방합') {
        if (sev === 'full') return 10;
      }
      if (type === '격충' || type === '반형' || type === '상형' || type === '반합' || type === '준방합') {
        if (sev === 'half') return 7;
      }
      if (type === '원충' || type === '격합' || type === '원합' || type === '원격합' || type === '원형' || type === '원격충') {
        if (sev === 'partial' || sev === 'half') return 4;
      }
      if (sev === 'full') return 9;
      if (sev === 'half') return 6;
      if (sev === 'partial') return 3;
      return 1;
    };
    
    matchedInteractions.sort((a, b) => getInterPriority(b) - getInterPriority(a));
    
    return {
      ...matchedInteractions[0],
      allMatches: matchedInteractions
    };
  };

  const getInteractionStrength = (inter: any) => {
    if (!inter) return null;
    const type = inter.type;
    const severity = inter.severity || "full"; // "full" | "half" | "partial"
    
    const isHap = type.includes('합');
    
    if (isHap) {
      if (severity === 'full') {
        return {
          level: 'full',
          labelKo: '합완성',
          labelEn: 'Full Combo',
          colorKo: 'text-amber-600 dark:text-amber-400',
          badgeClass: 'bg-amber-400/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
        };
      } else if (severity === 'half' || type === '반합' || type === '준방합') {
        return {
          level: 'half',
          labelKo: '반합 형성',
          labelEn: 'Half Combo',
          colorKo: 'text-sky-600 dark:text-cyan-300',
          badgeClass: 'bg-sky-100 text-sky-900 dark:bg-sky-400/20 dark:text-cyan-300 border border-sky-300 dark:border-sky-450/30 font-bold'
        };
      } else {
        // partial (격합, 원합 등)
        return {
          level: 'remote',
          labelKo: '원격합',
          labelEn: 'Remote Combo',
          colorKo: 'text-violet-600 dark:text-violet-300',
          badgeClass: 'bg-violet-400/20 text-violet-750 dark:text-violet-300 border border-violet-400/30'
        };
      }
    } else {
      // Clashes, punishments, harms, destructions
      const isClash = type.includes('충');
      const isPunish = type.includes('형');
      const isPa = type === '파';
      const isHae = type === '해';
      
      if (severity === 'full') {
        return {
          level: 'clash_full',
          labelKo: isClash ? '완전충' : (isPunish ? '형살완전' : (isPa ? '파살완전' : '해살완전')),
          labelEn: 'Full Friction',
          colorKo: 'text-rose-600 dark:text-neon-pink',
          badgeClass: 'bg-rose-400/20 text-rose-700 dark:text-neon-pink border border-rose-500/30'
        };
      } else if (severity === 'half') {
        return {
          level: 'clash_half',
          labelKo: isClash ? '격충/마찰' : (isPunish ? '반형/마찰' : '중급마찰'),
          labelEn: 'Mid Friction',
          colorKo: 'text-orange-600 dark:text-orange-300',
          badgeClass: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/25'
        };
      } else {
        // partial (e.g. 원충)
        return {
          level: 'clash_remote',
          labelKo: isClash ? '원격충' : '원격마찰',
          labelEn: 'Remote Friction',
          colorKo: 'text-fuchsia-600 dark:text-fuchsia-300',
          badgeClass: 'bg-fuchsia-500/15 text-fuchsia-750 dark:text-fuchsia-300 border border-fuchsia-500/25'
        };
      }
    }
  };

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

  // Auto-scroll logic for guide steps
  const guideGridRef = React.useRef<HTMLDivElement>(null);
  const tenGodsGridRef = React.useRef<HTMLDivElement>(null);
  const lifeSeasonsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (guideStep === 0) {
      document.body.classList.remove('guide-active');
      return;
    }
    document.body.classList.add('guide-active');
    
    // Slight delay to ensure elements are rendered/uncollapsed properly before scrolling
    const timer = setTimeout(() => {
      let refToScroll: React.RefObject<HTMLDivElement> | null = null;
      if (guideStep >= 1 && guideStep <= 5) refToScroll = guideGridRef;
      else if (guideStep === 6) refToScroll = tenGodsGridRef;
      else if (guideStep === 7) refToScroll = lifeSeasonsRef;

      if (refToScroll?.current) {
        // Calculate offset to place it beautifully (e.g. slightly above center)
        let yOffset = 55; // Push chart up just enough to hide the button but keep pillar headers visible
        if (guideStep === 5) {
          yOffset = 220; // Push chart up significantly so the hidden stems and explanation popover are fully visible
        } else if (guideStep === 6) {
          yOffset = -30;
        } else if (guideStep === 7) {
          yOffset = -320;
        }

        const y = refToScroll.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [guideStep]);

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

  // Auto-scroll logic for annual, monthly, and daily pillars to align them centered
  React.useEffect(() => {
    if (expandedCycle !== null) {
      const timer = setTimeout(() => {
        let targetElement = document.getElementById(`bazi-annual-item-${currentYear}`);
        if (!targetElement) {
          const annualPillars = result.grandCycles[expandedCycle]?.annualPillars;
          if (annualPillars && annualPillars.length > 0) {
            const middleIndex = Math.floor(annualPillars.length / 2);
            const middleYear = annualPillars[middleIndex].year;
            targetElement = document.getElementById(`bazi-annual-item-${middleYear}`);
          }
        }
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [expandedCycle, currentYear, result.grandCycles]);

  React.useEffect(() => {
    if (expandedYear !== null && expandedCycle !== null) {
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(`bazi-monthly-item-${currentMonth}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [expandedYear, expandedCycle, currentMonth]);

  React.useEffect(() => {
    if (expandedMonth !== null && expandedYear !== null && expandedCycle !== null) {
      const timer = setTimeout(() => {
        let targetElement = document.getElementById(`bazi-daily-item-${currentDay}`);
        if (!targetElement) {
          const dailyPillars = result.grandCycles[expandedCycle]?.annualPillars?.[expandedYear]?.monthlyPillars?.[expandedMonth]?.dailyPillars;
          if (dailyPillars && dailyPillars.length > 0) {
            const fallbackDay = dailyPillars[dailyPillars.length - 1].day;
            targetElement = document.getElementById(`bazi-daily-item-${fallbackDay}`);
          }
        }
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [expandedMonth, expandedYear, expandedCycle, currentDay, result.grandCycles]);

  React.useEffect(() => {
    if (showGuideDetailModal) {
      setTimeout(() => {
        let targetId = '';
        if (guideStep >= 1 && guideStep <= 4) {
          targetId = 'guide-section-tree';
        } else if (guideStep === 5) {
          targetId = 'guide-section-jijangan';
        } else if (guideStep === 6) {
          targetId = 'guide-section-tengods';
        } else if (guideStep === 7) {
          targetId = 'guide-section-daewun';
        }
        
        if (targetId) {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 50); // delay minimally, scrollIntoView handles the rest better
    }
  }, [showGuideDetailModal, guideStep]);
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
        let categoryName = '종격';
        if (structureDetail.category === 'Standard') categoryName = '내격';
        else if (structureDetail.category === 'Image') categoryName = '특수격';
        else if (structureDetail.category === 'Monarch') categoryName = '전왕격';
        return `${structureDetail.title} (${categoryName})으로 태어났어. ${structureDetail.marketingMessage} ${yongShen}을 삶의 핵심 에너지로 사용해.`;
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
      let stems = stemsMap[targetElement] ? [...stemsMap[targetElement]] : [];

      const giShinGod = result?.analysis?.yongshinDetail?.giShin?.god;
      
      // 등라계갑 예외 처리: 기신이 비겁(목 오행)인 경우, 기신 구하는 호출에서 '甲'을 배제함
      if (shouldApplyDeungRaSpecial && targetElement === 'Wood' && godCategory === giShinGod) {
        stems = stems.filter(s => s !== '甲');
      }

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
          <div className={`flex flex-col items-center gap-2 mt-4 px-6 py-3 rounded-2xl max-w-md w-full border ${
            isLight 
              ? 'bg-blue-50/60 border-blue-200/70 shadow-sm' 
              : 'bg-neon-cyan/10 border-neon-cyan/30'
          }`}>
            <div className={`flex justify-between w-full text-xs font-bold tracking-widest ${
              isLight ? 'text-blue-700 font-semibold' : 'text-neon-cyan font-mono'
            }`}>
              <span>{lang === 'KO' ? '분석 완성도' : 'Analysis Completeness'}</span>
              <span>75%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${
              isLight ? 'bg-slate-200/80' : 'bg-black/50'
            }`}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                className={`h-full ${
                  isLight ? 'bg-blue-500 shadow-sm' : 'bg-neon-cyan shadow-[0_0_10px_#00F2FF]'
                }`}
              />
            </div>
            <p className={`text-[10px] sm:text-xs text-center mt-1 leading-relaxed ${
              isLight ? 'text-slate-600 font-medium' : 'text-white/60'
            }`}>
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
      
      // Protect '천재성' by temporarily shielding it
      colorized = colorized.replace(/천재성/g, '##CHEONJAESEONG##');
      
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
      
      // Restore '천재성' back to normal
      colorized = colorized.replace(/##CHEONJAESEONG##/g, '천재성');
      
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

    // 등라계갑 특별 예외 운세 연산
    const dayPillarForSpecial = result?.pillars?.find((p: any) => p.title === 'Day');
    const dayMasterForSpecial = dayPillarForSpecial?.stem;
    const isEulDM = dayMasterForSpecial === '乙';
    const stemsListForSpecial = result?.pillars?.map((p: any) => p.stem) || [];
    const branchesListForSpecial = result?.pillars?.map((p: any) => p.branch) || [];
    const hasBackingOak = stemsListForSpecial.includes('甲') || branchesListForSpecial.includes('寅') || branchesListForSpecial.includes('亥');
    const isDeungRaGyeGap = isEulDM && hasBackingOak;
    const isDengLaWithTodayGap = isDeungRaGyeGap && todayPillar.stem === '甲';
    
    // 1. Yongshin/Gishin check
    let dailyLuckScore = 50;
    let isStemYongshin = yongShin.includes(todayStemElement) || (todayStemElementKo && yongShin.includes(todayStemElementKo));
    let isStemGishin = giShin.includes(todayStemElement) || (todayStemElementKo && giShin.includes(todayStemElementKo));
    let isBranchYongshin = yongShin.includes(todayBranchElement) || (todayBranchElementKo && yongShin.includes(todayBranchElementKo));

    // 등라계갑 당일 갑목 영접 특별 조율: 기신 취급 전면 배제 및 든든한 버팀목(희신) 환원
    if (isDengLaWithTodayGap) {
      isStemGishin = false;
      isStemYongshin = true;
      dailyLuckScore += 20;
    }
    
    if (isStemYongshin) dailyLuckScore += 15;
    if (isStemGishin && !isDengLaWithTodayGap) dailyLuckScore -= 15;
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
      
      main = `오늘의 에너지는 [${stemColor}:${stemKo}], [${branchColor}:${branchKo}]([${stemColor}:${todayPillar.stem}][${branchColor}:${todayPillar.branch}]) 바이브야!${ganYeoComment} ${processedName} ${address}한테는 ${formatGod(todayPillar.stemTenGodKo, todayPillar.stem)}이랑 ${formatGod(todayPillar.branchTenGodKo, todayPillar.branch)}의 기운으로 들어오네. \n\n`;

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
      if (isDengLaWithTodayGap) {
        main += `오늘 천간(정신)의 기운은 갑목(甲)이야. 비겁(목 오행)이라 원래대로라면 기신(불리한 기운)이어야 하지만, 너는 을목(乙)으로서 거목을 감고 올라가는 등라계갑(藤羅繫甲)의 수호 구조를 취하고 있어! 오늘 찾아온 갑목(甲)은 기신 작용에서 완전히 해방되며, 오히려 너를 귀인처럼 당겨주고 자라나게 해주는 최상의 버팀목(희신) 역할을 멋지게 해낼 거야. `;
      } else if (isStemYongshin) {
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
      if (isDengLaWithTodayGap) {
        main += `\n\n[특수 기운: 등라계갑(藤羅繫甲)]\n오늘은 을목(乙)이 거목 갑목(甲)을 만나 든든한 날개와 기둥을 얻는 등라계갑의 날이야! 혼자 힘으로는 오르기 힘들었던 높은 위치에 아주 손쉽게 도달하거나, 나를 책임감 있게 지원해 줄 든든한 환경과 귀인을 마주하게 되는 매우 길하고 특별한 기운이 돌기 시작해.`;
      }
      if (isSuHwaGiJe) {
        main += `\n\n[특수 기운: 수화기제]\n오늘은 수(水)와 화(火)가 만나는 '수화기제'의 날이야. 일이 완벽히 끝나는 건 아니지만, 막혔던 일이 일단락되고 매듭지어지며 다음 스텝을 도모할 수 있는 중요한 전환점이 될 거야.`;
      }
    } else {
      // English version
      main = `Today's vibe is [${stemColor}:${todayPillar.stem}][${branchColor}:${todayPillar.branch}]!${ganYeoComment} For you, it's [${stemColor}:${stemGod}] and [${branchColor}:${branchGod}]. \n\n`;

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
      if (isDengLaWithTodayGap) {
        main += `Today's Heavenly Stem is Gap-Wood (甲). Although traditionally a GiShin (unfavorable), your Eul-Wood (乙) Day Master benefits from the Deungra-Gyegap (藤羅繫甲) structure where the giant oak holds you up! Therefore, Gap-Wood is exempt from negative impacts and instead acts as an elite supportive guide (HeeShin) to boost your potential. `;
      } else if (isStemYongshin) {
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

      if (isDengLaWithTodayGap) {
        main += `\n\n[Special Energy: Deungra-Gyegap (藤羅繫甲)]\nToday, your Eul-Wood (乙) climbs up the grand Gap-Wood (甲) oak! It marks a highly rare cycle where you easily scale heights or secure a supportive guide who pushes your limits. Spectacular opportunities await.`;
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

  const PolarityIcon = ({ polarity, size = 10, className = "", char }: { polarity: number, size?: number, className?: string, char?: string }) => {
    if (polarity === 1) return <Sun size={size} className={`text-amber-400 drop-shadow-[0_0_2px_rgba(251,191,36,0.2)] ${className}`} strokeWidth={2.5} />;
    return <Moon size={size} className={`text-sky-300 drop-shadow-[0_0_2px_rgba(125,211,252,0.2)] ${className}`} strokeWidth={2.5} />;
  };

  type AdditionalContext = { stem: string, branch: string, labelKo: string, labelEn: string };

  const getPillarInteractionsTooltipContent = (stem: string, branch: string, extraContexts: AdditionalContext[] = []) => {
    const INTERACTION_TIPS: Record<string, { descKo: string, descEn: string }> = {
      '천간합': {
        descKo: '생각의 마음이 일치하고 매력과 이성이 끌려 기분 좋은 타협과 만남이 열림',
        descEn: 'Mental harmony, charm expression, and cooperative agreements'
      },
      '천간충': {
        descKo: '치열한 내면적 소통 혹은 상황의 전환, 빠르고 대담함으로 돌파구 마련',
        descEn: 'Mental conflict or fast transition, activating rapid execution'
      },
      '육합': {
        descKo: '1:1의 끈끈한 친밀감, 서로 뜻이 맞아 비법을 전수하거나 비밀리에 연대',
        descEn: 'Close one-on-one affinity, trusting parters or mutual projects'
      },
      '충': {
        descKo: '판도가 흔들리며 완전히 새로워지는 정면 기회, 이동(이사/이직)이나 강력한 동력',
        descEn: 'Dynamic collision opening up new paths, major relocations or transitions'
      },
      '형살': {
        descKo: '깎여 나가며 다듬어가는 가위질, 계약 검토나 디테일한 점검을 장려하는 피드백 시기',
        descEn: 'Precision trimming and control, checking legal details and fine-tuning'
      },
      '파살': {
        descKo: '조율과 조정 중에 실없는 오해가 없도록 점검, 기존 일의 마무리 및 조정',
        descEn: 'Minor repairs and re-arrangements to refine plans'
      },
      '해살': {
        descKo: '인간관계나 신뢰의 피로감 주의, 불필요한 감정 소모보다 나만의 고요한 시간에 전념',
        descEn: 'Friction warning, focus on self-healing rather than outer controversies'
      },
      '원진': {
        descKo: '이유 모를 자극과 부딪침 조심, 적합한 심리적 거리를 유지하며 덤덤함을 유지',
        descEn: 'Unexplained emotional friction, healthy relational distancing'
      },
      '귀문': {
        descKo: '비약적으로 치솟는 번뜩이는 직관력과 창작력, 오직 마음에 고요를 비치어 예술로 풀이',
        descEn: 'Brilliant creative flashes and extreme focus, best channeled artistic flow'
      },
      '반합': {
        descKo: '공동의 결단을 내리는 다리 역할, 힘을 실어줄 세력이 모여 방향이 확실해짐',
        descEn: 'Part of dynamic alliance establishing basic platform expansion'
      },
      '삼합 완': {
        descKo: '사회적으로 모두가 공감하는 완벽한 합작과 성취, 스케일이 확실한 무대 등장',
        descEn: 'Magnificent unified assembly forming a massive productive system'
      },
      '방합 완': {
        descKo: '특정 환경과 사람들을 완벽히 단결하여 강력한 내 편의 벽을 완성함',
        descEn: 'Massive regional framework backing and community support'
      }
    };

    const getTip = (nameKo: string) => {
      if (nameKo.includes('삼합') || nameKo.includes('수국 완성') || nameKo.includes('화국 완성') || nameKo.includes('목국 완성') || nameKo.includes('금국 완성')) {
        if (nameKo.includes('방합')) return INTERACTION_TIPS['방합 완'];
        return INTERACTION_TIPS['삼합 완'];
      }
      for (const key of Object.keys(INTERACTION_TIPS)) {
        if (nameKo.includes(key)) {
          return INTERACTION_TIPS[key];
        }
      }
      return null;
    };

    const extraStems = extraContexts.map(c => c.stem);
    const extraBranches = extraContexts.map(c => c.branch);
    // Only calculate interactions against the core Birth Chart (원국) to prevent guest-to-guest clutter
    const stemInteractions = getCycleInteractions(stem, true, [], []);
    const branchInteractions = getCycleInteractions(branch, false, [], []);

    const getPillarTitle = (idx: number) => result?.pillars?.[idx]?.title;
    
    const getPillarNameKO = (idx: number, isStem: boolean) => {
      if (result && idx >= (result.pillars?.length || 4)) return extraContexts[idx - (result.pillars?.length || 4)].labelKo;
      const title = getPillarTitle(idx);
      if (title === 'Year') return isStem ? "연간" : "연지";
      if (title === 'Month') return isStem ? "월간" : "월지";
      if (title === 'Day') return isStem ? "일간" : "일지";
      if (title === 'Hour') return isStem ? "시간" : "시지";
      return isStem ? "천간" : "지지";
    };
    
    const getPillarNameEN = (idx: number, isStem: boolean) => {
      if (result && idx >= (result.pillars?.length || 4)) return extraContexts[idx - (result.pillars?.length || 4)].labelEn;
      const title = getPillarTitle(idx);
      if (title === 'Year') return isStem ? "Year Stem" : "Year Branch";
      if (title === 'Month') return isStem ? "Month Stem" : "Month Branch";
      if (title === 'Day') return isStem ? "Day Stem" : "Day Branch";
      if (title === 'Hour') return isStem ? "Hour Stem" : "Hour Branch";
      return isStem ? "Stem" : "Branch";
    };

    const getCharAtIndex = (idx: number, isStem: boolean) => {
      if (result && idx >= (result.pillars?.length || 4)) return isStem ? extraStems[idx - (result.pillars?.length || 4)] : extraBranches[idx - (result.pillars?.length || 4)];
      return isStem ? result.pillars?.[idx]?.stem : result.pillars?.[idx]?.branch;
    };

    const getPillarTenGodKo = (idx: number, isStemFlag: boolean): string => {
      if (!result || !result.pillars || !result.pillars[idx]) return '';
      const p = result.pillars[idx];
      return isStemFlag ? (p.stemKoreanName || '') : (p.branchKoreanName || '');
    };

    const getDetailedTenGodClean = (godKo: string): string => {
      if (!godKo) return '';
      if (godKo.includes('비견') || godKo.includes('겁재')) return '비겁';
      if (godKo.includes('식신') || godKo.includes('상관')) return '식상';
      if (godKo.includes('편재') || godKo.includes('정재')) return '재성';
      if (godKo.includes('편관') || godKo.includes('정관')) return '관성';
      if (godKo.includes('편인') || godKo.includes('정인')) return '인성';
      return '';
    };

    const getElementRelation = (dmEl: string, targetEl: string): string => {
      if (dmEl === targetEl) return '비겁';
      if (
        (dmEl === '목' && targetEl === '화') ||
        (dmEl === '화' && targetEl === '토') ||
        (dmEl === '토' && targetEl === '금') ||
        (dmEl === '금' && targetEl === '수') ||
        (dmEl === '수' && targetEl === '목')
      ) {
        return '식상';
      }
      if (
        (dmEl === '목' && targetEl === '토') ||
        (dmEl === '토' && targetEl === '수') ||
        (dmEl === '수' && targetEl === '화') ||
        (dmEl === '화' && targetEl === '금') ||
        (dmEl === '금' && targetEl === '목')
      ) {
        return '재성';
      }
      if (
        (targetEl === '목' && dmEl === '토') ||
        (targetEl === '토' && dmEl === '수') ||
        (targetEl === '수' && dmEl === '화') ||
        (targetEl === '화' && dmEl === '금') ||
        (targetEl === '금' && dmEl === '목')
      ) {
        return '관성';
      }
      if (
        (targetEl === '목' && dmEl === '화') ||
        (targetEl === '화' && dmEl === '토') ||
        (targetEl === '토' && dmEl === '금') ||
        (targetEl === '금' && dmEl === '수') ||
        (targetEl === '수' && dmEl === '목')
      ) {
        return '인성';
      }
      return '';
    };

    const getPersonalizedActionGuide = (nameKo: string, targetChar: string, isStemFlag: boolean, pIndices: number[]) => {
      const isSpecialCombo = nameKo.includes('완성') || nameKo.includes('국 완성') || nameKo.includes('국(방합)');
      const validIdxs = pIndices.filter(i => i >= 0 && i <= 3);
      if (validIdxs.length === 0 && !isSpecialCombo) return { ko: '', en: '' };

      const positions = validIdxs.map(idx => getPillarNameKO(idx, isStemFlag)).join('·');
      const uniqueGods = Array.from(new Set(validIdxs.map(idx => getPillarTenGodKo(idx, isStemFlag)).filter(Boolean)));
      const godLabel = uniqueGods.join('/');
      let godType = uniqueGods.length > 0 ? getDetailedTenGodClean(uniqueGods[0]) : '';

      let guideKo = '';
      let guideEn = '';

      const isHap = nameKo.includes('합') || isSpecialCombo;
      const isChung = nameKo.includes('충') || nameKo.includes('형살');
      const isWonJin = nameKo.includes('귀문') || nameKo.includes('원진');
      const isHaePa = nameKo.includes('해살') || nameKo.includes('파살');

      if (isSpecialCombo) {
        const dayMaster = result?.pillars?.[2]?.stem || '甲';
        const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element || '목';
        
        let targetElement = '';
        if (nameKo.includes('금국') || nameKo.includes('신유술')) targetElement = '금';
        else if (nameKo.includes('목국') || nameKo.includes('인묘진')) targetElement = '목';
        else if (nameKo.includes('화국') || nameKo.includes('사오미')) targetElement = '화';
        else if (nameKo.includes('수국') || nameKo.includes('해자축')) targetElement = '수';

        const comboGodType = getElementRelation(dmElement, targetElement);
        
        const concreteGuides: Record<string, Record<string, { ko: string; en: string }>> = {
          '금': {
            '비겁': {
              ko: '금(金) 비겁의 형성으로 내면의 주체성과 자아가 아주 단단하게 응축되어 결단력이 치솟습니다. 우유부단함을 털어버리고 나만의 명확한 원칙을 세워 냉철하고 강력하게 추진할 원동력을 얻습니다.',
              en: 'Your identity and inner drive are highly fortified. Exceptional alignment with core allies triggers dynamic breakthrough forces.'
            },
            '식상': {
              ko: '금(金) 식상의 활동력이 극대화되어 표현과 기획에 예리한 절제력과 단호함이 장착됩니다. 머릿속 아이디어들이 군더더기 없이 일목요연하고 설득력 높은 설계나 구체적이고 확실한 행동 성과물로 단숨에 현실화됩니다.',
              en: 'Expression power surges to peak state. Unleash specialized creativity and innovative plans onto the active stages seamlessly.'
            },
            '재성': {
              ko: '금(金) 재성의 결속으로 이성적인 계산과 손익 분석의 안목이 고도로 발달합니다. 흐릿했던 금전적 소유권, 지분 관계, 현실 계약 조율을 명확하게 매듭짓고 확실한 자금 통제권과 실리를 확보합니다.',
              en: 'Massive wealth flow connects flawlessly under unified frames. Optimal timing to lock down large-scale asset agreements.'
            },
            '관성': {
              ko: '금(金) 관성의 체제가 정립되어 공적인 자격이나 규율이 단단하게 연결됩니다. 원칙과 책임감을 치밀하게 지키며 소속 단체, 경쟁 조직으로부터 무거운 책임 영역이나 명망 높은 주도권을 정당하게 양도받습니다.',
              en: 'Prestigious power and leadership frames align with outstanding authority. Great timing for official appointments or system upgrades.'
            },
            '인성': {
              ko: '금(金) 인성의 후원으로 나를 책임질 안정적인 권리 취득, 자격 인증, 계약 운로가 완벽해집니다. 어설픈 사설 정보 대신 검증된 핵심 면허나 결점이 없는 견고한 약속 서류를 정확하게 움켜쥐기에 수월합니다.',
              en: 'High-leverage resource energies lock firmly in place. Perfect for finalizing official certifications, core assets, and dynamic licenses.'
            }
          },
          '목': {
            '비겁': {
              ko: '목(木) 비겁의 강력한 추동력으로 새로운 탄생과 시작을 향한 파릇한 자아 의지가 만개합니다. 동료들과 적극적으로 생각을 분출하며 열정적으로 프로젝트의 스타트 라인을 힘차게 넘어설 조력을 얻습니다.',
              en: 'Wood companion energy flourishes. Great timing to unite with active partners, build start-up momentum and advance together.'
            },
            '식상': {
              ko: '목(木) 식상의 에너지가 가동되며 세상에 나를 드러내는 호기심과 성장의 기쁨이 폭발합니다. 참신한 상상력이 가지를 뻗듯 끝없이 자라나며, 외부 영업, 창조적인 지식 콘텐츠 연구, 대중 발표 활동을 시원하게 확장합니다.',
              en: 'Your ideas grow like fresh sprouts, creating superb avenues for networking, active promotion, and creative expression.'
            },
            '재성': {
              ko: '목(木) 재성의 형성에 따라 신규 비즈니스의 씨앗을 심고 무대를 확장하는 역동적인 개척력이 열립니다. 미래 잠재력이 눈부신 신흥 판로를 적극 발굴하여 실제 매출과 이익 성장의 마중물로 삼습니다.',
              en: 'Active wealth creation seeds new growth potential. Exceptional timing to step into untouched markets and expand resources.'
            },
            '관성': {
              ko: '목(木) 관성이 깃들어 나를 지탱하는 조직과 직장의 규칙에 역동적이고 신선한 변화가 시작됩니다. 오랜 침체를 벗어난 유연한 소속 관계를 확립하여 내 책임 지위와 권익 세력을 한층 크게 격상시킵니다.',
              en: 'Gaining status in growth-oriented institutions. Ideal for establishing progressive structures and setting organizational leadership.'
            },
            '인성': {
              ko: '목(木) 인성의 결집으로 배움과 명상의 지혜가 기분 좋게 차오릅니다. 나를 진심으로 발돋움하게 도울 훌륭한 멘토를 발견하거나, 장기적으로 무궁무진한 영감을 전해줄 계약 문서나 학습 코스를 영입하게 됩니다.',
              en: 'Dynamic learning opportunity appears with elegant mentors. Excellent for acquiring progressive certificates or strategic content.'
            }
          },
          '화': {
            '비겁': {
              ko: '화(火) 비겁의 세력이 만개하여 나만의 열정과 기백이 대단히 뜨겁게 폭발합니다. 주위 사람들과의 주도적 대화와 탁월한 사교력으로 내 주장에 힘과 찬사를 얻으며 강력하고 명랑하게 군중을 이끌고 우뚝 섭니다.',
              en: 'Fire companion energy peaks, radiating intense social confidence. Perfect for taking central leadership and gathering enthusiastic support.'
            },
            '식상': {
              ko: '화(火) 식상의 눈부신 기운으로 내 매력과 역량을 만천하에 드러낼 열정적인 무대가 밝게 조명됩니다. 세련된 설득, 시각 미디어, 혹은 대담한 선언을 통해 대중의 이목을 싹쓸이하는 눈부신 홍보 성취를 달성합니다.',
              en: 'Your radiant expression reaches peak visibility. Excellent for promotional events, key presentations, and massive public branding.'
            },
            '재성': {
              ko: '화(火) 재성의 흐름을 타면서 막혔던 자금 수혈이나 대규모 금융 기회가 아주 화끈하고 기동력 있게 가동됩니다. 유동성 높은 거래, 단기 금융 협상, 혹은 시원하고 기분 좋은 대규모 재정 성과를 즉각 움켜쥔 장을 선물받습니다.',
              en: 'Dynamic financial opportunities move rapidly. Outstanding momentum to engage in high-velocity deals and enjoy prominent capital gains.'
            },
            '관성': {
              ko: '화(火) 관성의 위상으로 내 가치와 책임감 있는 직위가 주변 시선과 소속 한가운데에 가장 화려하고 자랑스럽게 공개됩니다. 지지와 신뢰가 쏟아지는 영광스러운 감투를 수려하고 품격 있게 수락하는 국면입니다.',
              en: 'Your reputation and leadership roles are publicly elevated. Excellent for stepping into competitive posts and showing authority.'
            },
            '인성': {
              ko: '화(火) 인성의 기운으로 내 능력과 명성이 널리 알려지며 공식 자격 취득, 인허가 서류 확보가 한결 수월해집니다. 소중한 지식재산이나 권리 문서를 확실하게 매듭짓고 인정받는 든든한 시기입니다.',
              en: 'Acquiring highly visible asset credentials or official agreements. Perfect for brand patents and public endorsement contracts.'
            }
          },
          '수': {
            '비겁': {
              ko: '수(水) 비겁의 극진한 몰입 기운이 일어나며 보이지 않는 영역에서 지혜와 안목이 깊어집니다. 겉으로 호들갑 떨지 않으면서도 핵심 사람들과 단단한 막후 정치를 완벽히 조율해, 꺾이지 않을 조용한 주도권을 거머쥡니다.',
              en: 'Deep water companion connection expands. Establish profound private alliances and silent, unshakeable influence.'
            },
            '식상': {
              ko: '수(水) 식상의 유연하고 깊은 감각이 작동하여, 타인의 속내와 심리를 자석처럼 꿰뚫는 노련한 지혜의 기획이 활개칩니다. 깊은 연구 저술, 컨설팅, 치유, 혹은 은밀히 설계된 특수 성과물로 눈부신 실속을 차립니다.',
              en: 'Deep instinct and quiet expressive power are activated. Perfect for strategy planning, writing, counseling, or hidden design works.'
            },
            '재성': {
              ko: '수(水) 재성의 연계에 힘입어 수면 아래의 내실 가득한 현금 안목과 자금 파이프라인 정비가 이뤄집니다. 보이지 않는 알짜배기 자산 가치나 비공개 금융 지분을 선점해 흔들림 없는 든든한 금전 기틀을 구축합니다.',
              en: 'Securing valuable private cash flows or non-public financial agreements. Highly efficient for establishing stable backend incomes.'
            },
            '관성': {
              ko: '수(水) 관성의 조율사가 되어 겉치레 대신 외풍을 차단할 실속 있는 배후의 보호막 소속을 굳힙니다. 위기 조율 능력을 증명하며 조직 내 은밀하고 강력한 인사 통제나 의결권을 수임하게 됩니다.',
              en: 'Gaining immense silent authority or defense positions. Excellent for critical dispute resolution and handling organizational leverage.'
            },
            '인성': {
              ko: '수(水) 인성의 비호 속에서 깊이 있는 전문 학문, 오랜 연구 성과, 비방의 자격 인가를 기어코 취득합니다. 가치 변동이 없는 알짜배기 원천 자산 문서를 내 명의로 온전하고 수려하게 이전하기 매우 이로운 적기입니다.',
              en: 'Securing profound intellectual property, core credentials, or secret patents. Extremely favorable for real asset contracts.'
            }
          },
          '토': {
            '비겁': {
              ko: '토(土) 비겁의 거대한 신뢰성이 구축되며 흔들림 없는 안정된 기조와 리더십을 회복합니다. 흔들리는 흐름에 휩쓸리지 않고 태산 같은 듬직함으로 주체적인 세력을 정돈하고 나아갑니다.',
              en: 'Unshakable self-confidence and grounding energy are restored. Stand firm with reliable companion systems.'
            },
            '식상': {
              ko: '토(土) 식상의 무거운 지구력이 채워지며 어떤 외풍에도 묵묵하고 꾸준히 하나의 과업을 성사해 내는 실천력이 주어집니다. 안전하고 정밀하게 설계된 생산활동에 심혈을 기울여 보수적인 성취를 다져냅니다.',
              en: 'Steadfast perseverance empowers physical labor or long-term design. Great for creating a solid foundation of execution.'
            },
            '재성': {
              ko: '토(土) 재성의 안정화에 힘입어 토지, 빌딩, 영구적인 물리적 자산처럼 가치가 보수적이고 안전한 무거운 부동산 실물이나 고정 자금의 계약과 든든히 결탁합니다.',
              en: 'Securing long-term fixed assets, stable real estate, or robust collateral. Favorable for building a concrete legacy.'
            },
            '관성': {
              ko: '토(土) 관성의 임무 운으로 국가공인 기관이나 오랜 신뢰를 쌓아온 우량 단체로부터 영속적인 신임 감투나 확실한 역할 책임을 인가받아 지위의 지속성을 고도로 향상시킵니다.',
              en: 'Entrusted with reliable official authority or public platform projects. Establishes long-lasting professional stability.'
            },
            '인성': {
              ko: '토(土) 인성의 정적인 후원으로 세월의 신망이 검증된 가업의 상속, 오랫동안 누려온 권익문서 및 신용 자격을 완전하게 양도받아 가치 있는 기반을 대대로 공고화합니다.',
              en: 'Acquiring mature asset inheritance or certified licenses. Exceptional timing for securing long-term strategic documents.'
            }
          }
        };

        const keyEl = targetElement || '금';
        const keyGod = comboGodType || '비겁';
        const customGuide = concreteGuides[keyEl]?.[keyGod];
        
        if (customGuide) {
          guideKo = customGuide.ko;
          guideEn = customGuide.en;
        } else {
          guideKo = `${targetElement} 오행의 완성으로 ${comboGodType} 기운의 눈부신 활로가 트이며 내면 역량과 현실 방향이 조화롭게 열리는 흐름입니다.`;
          guideEn = `The system completes the ${targetElement} axis (${comboGodType}). Opening promising real-world pathways.`;
        }
        return { ko: guideKo, en: guideEn };
      }

      if (isWonJin) {
        if (godType === '인성') {
          guideKo = `생각이 머릿속을 맴돌며 감정 과부하가 걸리기 쉬우니, 잡념을 털어내고 책을 읽거나 소중한 탐구 연구에 에너지를 몰입해 보세요.`;
          guideEn = `Heavy thoughts and overthinking. Greatly suited to dive deep into study, private analysis, or strategic planning.`;
        } else if (godType === '식상') {
          guideKo = `작업 성과에 예민한 완벽주의 감정이 앞설 수 있으니, 반짝이는 감각을 디자인이나 글쓰기, 전문 전공 기획으로 승화하세요.`;
          guideEn = `Intense perfectionism on details. Best channeled by putting inspiration into bold creation or custom design.`;
        } else if (godType === '재성') {
          guideKo = `손익 계산에 신경이 날카로워져 조급해지기 쉬우니, 금전적 판단을 서둘지 말고 이성적으로 재점검하세요.`;
          guideEn = `Hyper-sensitive regarding tangible outputs. Avoid rushing deals under pressure, rely strictly on clear logic.`;
        } else if (godType === '관성') {
          guideKo = `주변의 이목이나 타인의 평가를 유독 귀담아듣기 쉬운 구간입니다. 기분 좋은 거리감을 유지하며 마음의 주체성을 지키세요.`;
          guideEn = `Sensitive to social judgments or environmental stress. Gently ground your inner self and avoid taking small comments too seriously.`;
        } else if (godType === '비겁') {
          guideKo = `자책을 일삼거나 가까운 사람에게 소소한 상실감을 느끼기 쉬우니, 관계 유지보다 나를 채우는 힐링에 시간을 쏟으세요.`;
          guideEn = `Self-criticism or subtle relational disappointment. Focus purely on private healing rather than social interactions.`;
        } else {
          guideKo = `직관이 치솟아 주변 자극에 날카로워질 수 있는 시기입니다. 차분히 명상을 거치거나 예술 연구에 집중해 번뇌를 털어두세요.`;
          guideEn = `Extremely heightened intuition. Decongest thoughts by indulging in quiet meditation or physical hobbies.`;
        }
      } else if (isChung) {
        if (godType === '관성') {
          guideKo = `역할, 부서, 이직 등 공헌 위치에 커다란 역동성과 세력 쇄신이 밀려옵니다. 능동적인 대안 제시로 기회를 포획하십시오.`;
          guideEn = `Clear momentum for professional change, promotions, or relocating. Harness high external pressure into decisive negotiations.`;
        } else if (godType === '재성') {
          guideKo = `막혔던 재물과 자산 흐름의 활로가 시원하게 트이며, 자금 활용성이 커집니다. 문서 계약, 지분율 조정 등 실질적인 이권을 유리하게 확보하고 가치를 높이기에 최적의 기회입니다.`;
          guideEn = `Moving blockages in asset flow or remodeling. Review legal clauses carefully to maximize real dividends.`;
        } else if (godType === '식상') {
          guideKo = `지체되어 온 업무 절차와 불리한 루틴을 대폭 수리하는 흐름입니다. 결단을 내려 쓸모없는 오랜 거죽을 화끈하게 제거하십시오.`;
          guideEn = `Active revision of working methodologies. Discard sluggish routines and install high-performing habits.`;
        } else if (godType === '인성') {
          guideKo = `기존의 전문 자격이나 체결된 계약, 공부하고 있는 분야를 한층 더 보완하고 새롭게 다듬기 좋은 상생의 변화기입니다. 디테일을 꼼꼼하게 검토하여 배움의 깊이를 더하고 소중한 내 권리를 확실히 다지세요.`;
          guideEn = `Redrafting agreements, updating strategic licenses, or relocating study focuses. Refine documentation with critical insight.`;
        } else if (godType === '비겁') {
          guideKo = `늘 끌려가던 소모적 인간관계를 기백 있게 청소하고 우뚝 설 기회입니다. 자립 주도권을 확실하게 되찾아 승배를 안으세요.`;
          guideEn = `Upgrades in inner circle, cutting parasitic bonds, or setting a major boundary. Embrace constructive independence.`;
        } else {
          guideKo = `지체되어 정체되던 불합리한 틀에서 가치 있게 탈피합니다. 변화와 이동 국면을 당당히 장악하며 성취에 기여해 보세요.`;
          guideEn = `Breaking old stagnation blocks to pioneer dynamic personal growth.`;
        }
      } else if (isHap) {
        if (godType === '식상') {
          guideKo = `번뜩이는 아이디어와 기획이 우군을 만나 물 흐르듯 가동됩니다. 수월하게 협상을 이끌고 나를 널리 부각시킬 타이밍입니다.`;
          guideEn = `Your ideas gain tremendous popular demand or active team support, smoothing overall project delivery.`;
        } else if (godType === '재성') {
          guideKo = `탄탄한 시장 수요를 맞추거나 투자 동반자의 러브콜을 얻어 장기 소득의 기둥과 풍요로운 자산 발판을 확보합니다.`;
          guideEn = `Generating a robust income channel and establishing stable capital alliances with top allies.`;
        } else if (godType === '인성') {
          guideKo = `우호적인 지지가 결성되거나 면허 취득, 계약 승인 등 핵심 문서와 자격 권한을 순조롭게 손에 넣는 시기입니다.`;
          guideEn = `Securing dynamic mentorship or passing key strategic certifications. Contract actions run smooth.`;
        } else if (godType === '관성') {
          guideKo = `든든하고 정평 있는 집단에 소속되거나 높은 책임 직위를 인가받습니다. 리크루팅 제안이나 합작 성과가 탄탄히 굳어집니다.`;
          guideEn = `Upgraded status, gaining stable protective umbrella or joining highly competitive teams.`;
        } else if (godType === '비겁') {
          guideKo = `주변과 유기적으로 협력하고 상생하는 시기입니다. 공동의 지향점을 향해 나아가며 압도적인 성장의 시너지를 발휘하세요.`;
          guideEn = `Rallying passionate companions to launch strong joint play instead of wandering on a solo path.`;
        } else {
          guideKo = `조화로운 유대의 은덕이 가득 가중되고 우호적 원조 세력이 보강되어, 추진하던 바가 한결 유연하고 견고하게 발달합니다.`;
          guideEn = `Bringing supportive entities closer to create high-leverage collaborations.`;
        }
      } else if (isHaePa) {
        guideKo = `새로운 일을 크게 벌이거나 무리하기보다는, 현재 상황의 세밀한 틈새나 계획을 점검하며 내실을 다질 때입니다. 마음의 안정을 취하고 차분히 정돈하는 시간을 가지세요.`;
        guideEn = `Refine plan structures and check minor points. Avoid rush projects and secure protective boundaries.`;
      }

      return { ko: guideKo, en: guideEn };
    };

    const stemCharName = BAZI_MAPPING.stems[stem as keyof typeof BAZI_MAPPING.stems]?.ko || stem;
    const branchCharName = BAZI_MAPPING.branches[branch as keyof typeof BAZI_MAPPING.branches]?.ko || branch;
    const stemCharNameEn = BAZI_MAPPING.stems[stem as keyof typeof BAZI_MAPPING.stems]?.en || stem;
    const branchCharNameEn = BAZI_MAPPING.branches[branch as keyof typeof BAZI_MAPPING.branches]?.en || branch;

    const stemElementColor = ELEMENT_COLORS[BAZI_MAPPING.stems[stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
    const branchElementColor = ELEMENT_COLORS[BAZI_MAPPING.branches[branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';

    let koList: string[] = [];
    let enList: string[] = [];

    // Stem
    if (stemInteractions.length > 0) {
      const stemLinesKO: string[] = [];
      const stemLinesEN: string[] = [];
      
      type GroupedStemInteraction = {
        nameKo: string;
        nameEn: string;
        targetChar: string;
        targetColor: string;
        pIndices: number[];
        isSpecial?: boolean;
      };

      const groupedStems: Record<string, GroupedStemInteraction> = {};

      stemInteractions.forEach(item => {
        if (item.isSpecial) {
          const key = `special-${item.nameKo}`;
          if (!groupedStems[key]) {
            groupedStems[key] = {
              nameKo: item.nameKo,
              nameEn: item.nameEn,
              targetChar: '',
              targetColor: '',
              pIndices: [],
              isSpecial: true
            };
          }
        } else {
          const targetChar = getCharAtIndex(item.pIndex, true) || '';
          const targetColor = ELEMENT_COLORS[BAZI_MAPPING.stems[targetChar as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
          const key = `${targetChar}-${item.nameKo}`;
          if (!groupedStems[key]) {
            groupedStems[key] = {
              nameKo: item.nameKo,
              nameEn: item.nameEn,
              targetChar,
              targetColor,
              pIndices: []
            };
          }
          groupedStems[key].pIndices.push(item.pIndex);
        }
      });

      Object.values(groupedStems).forEach(grouped => {
        const pGuide = getPersonalizedActionGuide(grouped.nameKo, grouped.targetChar, true, grouped.pIndices);
        const guideTextKo = pGuide.ko ? `<div class="text-[11px] text-amber-300 drop-shadow-[0_0_3px_rgba(251,191,36,0.15)] font-sans mt-0.5 leading-tight font-normal" style="padding-left: 12px; margin-bottom: 4px;">${pGuide.ko}</div>` : '';
        const guideTextEn = pGuide.en ? `<div class="text-[10px] text-teal-300/80 font-sans mt-0.5 leading-tight font-normal" style="padding-left: 12px; margin-bottom: 4px;">* ${pGuide.en}</div>` : '';

        if (grouped.isSpecial) {
          stemLinesKO.push(`<div class="ml-2 pl-2 border-l border-white/10 mb-1.5"><span class="text-white/90 font-medium">- <strong>${grouped.nameKo}</strong></span>${guideTextKo}</div>`);
          stemLinesEN.push(`<div class="ml-2 pl-2 border-l border-white/10 mb-1.5">- <strong>${grouped.nameEn}</strong>${guideTextEn}</div>`);
        } else {
          const pillarNamesKo = grouped.pIndices.map(idx => getPillarNameKO(idx, true)).join(', ');
          const pillarNamesEn = grouped.pIndices.map(idx => getPillarNameEN(idx, true)).join(', ');

          stemLinesKO.push(`<div class="ml-2 pl-2 border-l border-white/10 mb-1.5"><span class="text-white/90 font-medium">- ${pillarNamesKo} <span style="color: ${grouped.targetColor}; font-weight: bold;">${grouped.targetChar}</span>와(과) <strong>${grouped.nameKo}</strong></span>${guideTextKo}</div>`);
          stemLinesEN.push(`<div class="ml-2 pl-2 border-l border-white/10 mb-1.5">- <strong>${grouped.nameEn}</strong> with ${pillarNamesEn} <span style="color: ${grouped.targetColor}; font-weight: bold;">${grouped.targetChar}</span>${guideTextEn}</div>`);
        }
      });

      koList.push(`<div class="mb-3"><div class="mb-1"><span style="color: ${stemElementColor}; font-weight: bold;">천간 ${stemCharName}(${stem})</span>:</div> ${stemLinesKO.join('')}</div>`);
      enList.push(`<div class="mb-3"><div class="mb-1"><span style="color: ${stemElementColor}; font-weight: bold;">Stem ${stemCharNameEn}(${stem})</span>:</div> ${stemLinesEN.join('')}</div>`);
    } else {
      koList.push(`<div class="mb-3"><span style="color: ${stemElementColor}; font-weight: bold;">천간 ${stemCharName}(${stem})</span>: 없음</div>`);
      enList.push(`<div class="mb-3"><span style="color: ${stemElementColor}; font-weight: bold;">Stem ${stemCharNameEn}(${stem})</span>: None</div>`);
    }

    // Branch
    if (branchInteractions.length > 0) {
      const branchLinesKO: string[] = [];
      const branchLinesEN: string[] = [];
      
      type GroupedBranchInteraction = {
        nameKo: string;
        nameEn: string;
        targetChar: string;
        targetColor: string;
        pIndices: number[];
        isSpecial?: boolean;
        specialIndices?: number[];
      };

      const groupedBranches: Record<string, GroupedBranchInteraction> = {};

      branchInteractions.forEach(item => {
        if (item.isSpecial) {
          const key = `special-${item.nameKo}`;
          if (!groupedBranches[key]) {
            groupedBranches[key] = {
              nameKo: item.nameKo,
              nameEn: item.nameEn,
              targetChar: '',
              targetColor: '',
              pIndices: [],
              isSpecial: true,
              specialIndices: item.pIndices
            };
          }
        } else {
          const targetChar = getCharAtIndex(item.pIndex, false) || '';
          const targetColor = ELEMENT_COLORS[BAZI_MAPPING.branches[targetChar as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
          const key = `${targetChar}-${item.nameKo}`;
          if (!groupedBranches[key]) {
            groupedBranches[key] = {
              nameKo: item.nameKo,
              nameEn: item.nameEn,
              targetChar,
              targetColor,
              pIndices: []
            };
          }
          groupedBranches[key].pIndices.push(item.pIndex);
        }
      });

      Object.values(groupedBranches).forEach(grouped => {
        const pGuide = getPersonalizedActionGuide(grouped.nameKo, grouped.targetChar, false, grouped.pIndices);
        const guideTextKo = pGuide.ko ? `<div class="text-[11px] text-amber-300 drop-shadow-[0_0_3px_rgba(251,191,36,0.15)] font-sans mt-0.5 leading-tight font-normal" style="padding-left: 12px; margin-bottom: 4px;">${pGuide.ko}</div>` : '';
        const guideTextEn = pGuide.en ? `<div class="text-[10px] text-teal-300/80 font-sans mt-0.5 leading-tight font-normal" style="padding-left: 12px; margin-bottom: 4px;">* ${pGuide.en}</div>` : '';

        if (grouped.isSpecial) {
          const partnersKo = (grouped.specialIndices || []).map((idx: number) => {
              const char = getCharAtIndex(idx, false);
              const color = ELEMENT_COLORS[BAZI_MAPPING.branches[char as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
              return `${getPillarNameKO(idx, false)} <span style="color: ${color}; font-weight: bold;">${char}</span>`;
          }).join(', ');
          
          const partnersEn = (grouped.specialIndices || []).map((idx: number) => {
              const char = getCharAtIndex(idx, false);
              const color = ELEMENT_COLORS[BAZI_MAPPING.branches[char as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
              return `${getPillarNameEN(idx, false)} <span style="color: ${color}; font-weight: bold;">${char}</span>`;
          }).join(', ');

          branchLinesKO.push(`<div class="ml-2 pl-2 border-l border-white/10 mb-1.5"><span class="text-white/90 font-medium">- ${partnersKo}와(과) 함께 <strong>${grouped.nameKo}</strong></span>${guideTextKo}</div>`);
          branchLinesEN.push(`<div class="ml-2 pl-2 border-l border-white/10 mb-1.5">- <strong>${grouped.nameEn}</strong> together with ${partnersEn}${guideTextEn}</div>`);
        } else {
          const pillarNamesKo = grouped.pIndices.map(idx => getPillarNameKO(idx, false)).join(', ');
          const pillarNamesEn = grouped.pIndices.map(idx => getPillarNameEN(idx, false)).join(', ');

          branchLinesKO.push(`<div class="ml-2 pl-2 border-l border-white/10 mb-1.5"><span class="text-white/90 font-medium">- ${pillarNamesKo} <span style="color: ${grouped.targetColor}; font-weight: bold;">${grouped.targetChar}</span>와(과) <strong>${grouped.nameKo}</strong></span>${guideTextKo}</div>`);
          branchLinesEN.push(`<div class="ml-2 pl-2 border-l border-white/10 mb-1.5">- <strong>${grouped.nameEn}</strong> with ${pillarNamesEn} <span style="color: ${grouped.targetColor}; font-weight: bold;">${grouped.targetChar}</span>${guideTextEn}</div>`);
        }
      });

      koList.push(`<div class="mb-3"><div class="mb-1"><span style="color: ${branchElementColor}; font-weight: bold;">지지 ${branchCharName}(${branch})</span>:</div> ${branchLinesKO.join('')}</div>`);
      enList.push(`<div class="mb-3"><div class="mb-1"><span style="color: ${branchElementColor}; font-weight: bold;">Branch ${branchCharNameEn}(${branch})</span>:</div> ${branchLinesEN.join('')}</div>`);
    } else {
      koList.push(`<div class="mb-3"><span style="color: ${branchElementColor}; font-weight: bold;">지지 ${branchCharName}(${branch})</span>: 없음</div>`);
      enList.push(`<div class="mb-3"><span style="color: ${branchElementColor}; font-weight: bold;">Branch ${branchCharNameEn}(${branch})</span>: None</div>`);
    }

    return {
      ko: `<div class="space-y-1 w-full"><div class="font-bold border-b border-white/20 pb-2 mb-3 tracking-tight">📊 사주 원국과의 합형충파해 분석 (Natal Interactions)</div>${koList.join('')}</div>`,
      en: `<div class="space-y-1 w-full"><div class="font-bold border-b border-white/20 pb-2 mb-3 tracking-tight">📊 Associated Natal Interactions</div>${enList.join('')}</div>`
    };
  };

  const getCycleInteractions = (targetChar: string, isStem: boolean, extraStems: string[] = [], extraBranches: string[] = []) => {
    if (!result?.pillars) return [];
    
    const activeInteractions: any[] = [];
    const natalStems = [...result.pillars.map(p => p.stem), ...extraStems];
    const natalBranches = [...result.pillars.map(p => p.branch), ...extraBranches];
    
    if (isStem) {
        const stemHapPairs: Record<string, string> = { '甲己': '합', '己甲': '합', '乙庚': '합', '庚乙': '합', '丙辛': '합', '辛丙': '합', '丁壬': '합', '壬丁': '합', '戊癸': '합', '癸戊': '합' };
        const stemChungPairs: Record<string, string> = { '甲庚': '충', '庚甲': '충', '乙辛': '충', '辛乙': '충', '丙壬': '충', '壬丙': '충', '丁癸': '충', '癸丁': '충' };
        
        natalStems.forEach((nb, index) => {
           const pair = [nb, targetChar].join('');
           if (stemHapPairs[pair]) activeInteractions.push({ nameKo: '천간합', nameEn: 'Stem Combo', pIndex: index, isPos: true });
           if (stemChungPairs[pair]) activeInteractions.push({ nameKo: '천간충', nameEn: 'Stem Clash', pIndex: index, isPos: false });
        });
    } else {
        const wonJinPairs = [['子', '未'], ['丑', '午'], ['寅', '酉'], ['卯', '申'], ['辰', '亥'], ['巳', '戌'], ['午', '丑'], ['未', '子'], ['申', '卯'], ['酉', '寅'], ['戌', '巳'], ['亥', '辰']];
        const guiMenPairs = [['子', '酉'], ['丑', '午'], ['寅', '未'], ['卯', '申'], ['辰', '亥'], ['巳', '戌'], ['酉', '子'], ['午', '丑'], ['未', '寅'], ['申', '卯'], ['亥', '辰'], ['戌', '巳']];
        const chungPairs: Record<string, string> = { '子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥', '午': '子', '未': '丑', '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳' };
        const hapPairs: Record<string, string> = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
        const hyeongPairs = [['寅', '巳'], ['巳', '申'], ['申', '寅'], ['丑', '戌'], ['戌', '未'], ['未', '丑'], ['辰', '辰'], ['午', '午'], ['酉', '酉'], ['亥', '亥'], ['寅', '申']];
        const paPairs: Record<string, string> = { '子': '酉', '酉': '子', '午': '卯', '卯': '午', '巳': '申', '申': '巳', '寅': '亥', '亥': '寅', '辰': '丑', '丑': '辰', '戌': '未', '未': '戌' };
        const haePairs: Record<string, string> = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅', '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉' };
        const frameGroups = [
            { chars: ['申','子','辰'], nameKo: '신자진 수국', nameEn: 'Shen-Zi-Chen Water Frame', element: 'Water' },
            { chars: ['寅','午','戌'], nameKo: '인오술 화국', nameEn: 'Yin-Wu-Xu Fire Frame', element: 'Fire' },
            { chars: ['巳','酉','丑'], nameKo: '사유축 금국', nameEn: 'Si-You-Chou Metal Frame', element: 'Metal' },
            { chars: ['亥','卯','未'], nameKo: '해묘미 목국', nameEn: 'Hai-Mao-Wei Wood Frame', element: 'Wood' },
            { chars: ['寅','卯','辰'], nameKo: '인묘진 목국(방합)', nameEn: 'Yin-Mao-Chen Wood Direction', element: 'Wood' },
            { chars: ['巳','午','未'], nameKo: '사오미 화국(방합)', nameEn: 'Si-Wu-Wei Fire Direction', element: 'Fire' },
            { chars: ['申','酉','戌'], nameKo: '신유술 금국(방합)', nameEn: 'Shen-You-Xu Metal Direction', element: 'Metal' },
            { chars: ['亥','子','丑'], nameKo: '해자축 수국(방합)', nameEn: 'Hai-Zi-Chou Water Direction', element: 'Water' }
        ];

        natalBranches.forEach((nb, index) => {
           if (hapPairs[nb] === targetChar) activeInteractions.push({ nameKo: '육합', nameEn: 'Six Combo', pIndex: index, isPos: true });
           if (chungPairs[nb] === targetChar) activeInteractions.push({ nameKo: '충', nameEn: 'Clash', pIndex: index, isPos: false });
           if (hyeongPairs.some(p => (p[0] === nb && p[1] === targetChar) || (p[1] === nb && p[0] === targetChar))) activeInteractions.push({ nameKo: '형살', nameEn: 'Punishment', pIndex: index, isPos: false });
           if (paPairs[nb] === targetChar) activeInteractions.push({ nameKo: '파살', nameEn: 'Destruction', pIndex: index, isPos: false });
           if (haePairs[nb] === targetChar) activeInteractions.push({ nameKo: '해살', nameEn: 'Harm', pIndex: index, isPos: false });
           if (wonJinPairs.some(p => (p[0] === nb && p[1] === targetChar) || (p[1] === nb && p[0] === targetChar))) activeInteractions.push({ nameKo: '원진', nameEn: 'Resentment', pIndex: index, isPos: false });
           if (guiMenPairs.some(p => (p[0] === nb && p[1] === targetChar) || (p[1] === nb && p[0] === targetChar))) activeInteractions.push({ nameKo: '귀문', nameEn: 'Ghost Gate', pIndex: index, isPos: false });
        });

        frameGroups.forEach(group => {
            if (group.chars.includes(targetChar)) {
                const otherChars = group.chars.filter(c => c !== targetChar);
                const matchingIndices = natalBranches.map((nb, i) => otherChars.includes(nb) ? i : -1).filter(i => i !== -1);
                const uniqueMatchingChars = new Set(matchingIndices.map(i => natalBranches[i]));
                
                if (uniqueMatchingChars.size === 2) {
                    activeInteractions.push({ 
                        isSpecial: true, 
                        isPos: true,
                        nameKo: `${group.nameKo} 완성`, 
                        nameEn: `${group.nameEn} Complete`,
                        pIndices: matchingIndices,
                        element: group.element
                    });
                } else if (uniqueMatchingChars.size === 1) {
                    matchingIndices.forEach(idx => {
                        activeInteractions.push({ nameKo: '반합', nameEn: 'Half-Combo', pIndex: idx, isPos: true });
                    });
                }
            }
        });
    }
    
    const unique = [];
    const seen = new Set();
    for (const item of activeInteractions) {
        if (item.isSpecial) {
            const key = `special-${item.nameKo}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(item);
            }
        } else {
            const key = `${item.nameKo}-${item.pIndex}`;
            if (!seen.has(key)) {
                seen.add(key);
                unique.push(item);
            }
        }
    }
    return unique;
  };

  const RenderCycleChar = ({ char, isStem, hideUnderline = false, hideTooltip = false }: { char: string, isStem: boolean, hideUnderline?: boolean, hideTooltip?: boolean }) => {
    const interactions = getCycleInteractions(char, isStem);
    const content = renderPillarText(isStem ? 'stem' : 'branch', char);
    if (hideUnderline || hideTooltip || !interactions.length) {
        return (
           <span className={`relative inline-block transition-all duration-300 mx-0.5 ${lang === 'EN' ? 'whitespace-normal text-center break-words' : 'whitespace-nowrap'}`}>
             <span className="relative z-10 block font-bold">
               {content}
             </span>
           </span>
        );
    }
    
    const hasPos = interactions.some(i => i.isPos);
    const hasNeg = interactions.some(i => !i.isPos);
    
    const isLight = theme === 'light';
    let lineClass = "";
    let shadowClass = "";
    
    if (hasPos && !hasNeg) {
        lineClass = isLight 
            ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" 
            : "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.9)]";
        shadowClass = isLight ? "group-hover:drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" : "group-hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.7)]";
    } else if (hasNeg && !hasPos) {
        lineClass = isLight 
            ? "bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]" 
            : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)]";
        shadowClass = isLight ? "group-hover:drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]" : "group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]";
    } else {
        lineClass = isLight 
            ? "bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]" 
            : "bg-fuchsia-400 shadow-[0_0_8px_rgba(232,121,249,0.9)]";
        shadowClass = isLight ? "group-hover:drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]" : "group-hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.7)]";
    }
    
    // Group interactions by nameKo and natal character to consolidate duplicates
    const grouped: Record<string, { count: number, pIndices: number[], nameEn: string, isSpecial?: boolean, specialNameKo?: string, specialNameEn?: string, element?: string }> = {};
    for (const i of interactions) {
        if (i.isSpecial) {
            const keyKo = `special-${i.nameKo}`;
            grouped[keyKo] = { count: 1, pIndices: i.pIndices, nameEn: i.nameEn, isSpecial: true, specialNameKo: i.nameKo, specialNameEn: i.nameEn, element: i.element };
        } else {
            const natalChar = isStem ? result?.pillars?.[i.pIndex]?.stem : result?.pillars?.[i.pIndex]?.branch;
            const keyKo = `${natalChar}-${i.nameKo}`;
            if (!grouped[keyKo]) {
                 grouped[keyKo] = { count: 0, pIndices: [], nameEn: i.nameEn };
            }
            grouped[keyKo].count += 1;
            grouped[keyKo].pIndices.push(i.pIndex);
        }
    }

    const tooltipKoList = [];
    const tooltipEnList = [];
    
    // Sort keys by importance and influence:
    // 1. Hap & Chung (합과 충) is the strongest.
    // 2. Day (일) > Month (월) > Year (년) > Hour (시) is the order of pillars.
    const sortedKeys = Object.keys(grouped).sort((keyA, keyB) => {
        const gA = grouped[keyA];
        const gB = grouped[keyB];

        const nameA = gA.isSpecial ? (gA.specialNameKo || '') : keyA.split('-')[1] || '';
        const nameB = gB.isSpecial ? (gB.specialNameKo || '') : keyB.split('-')[1] || '';

        const hasHapChungA = gA.isSpecial || nameA.includes('합') || nameA.includes('충');
        const hasHapChungB = gB.isSpecial || nameB.includes('합') || nameB.includes('충');

        if (hasHapChungA !== hasHapChungB) {
            return hasHapChungA ? -1 : 1;
        }

        const getPillarPrio = (idx: number) => {
            if (idx === 1) return 4; // 일 (Day)
            if (idx === 2) return 3; // 월 (Month)
            if (idx === 3) return 2; // 년 (Year)
            if (idx === 0) return 1; // 시 (Hour)
            return 0;
        };

        const getMaxPillarPrio = (indices: number[]) => {
            if (!indices || indices.length === 0) return 0;
            return Math.max(...indices.map(getPillarPrio));
        };

        const prioA = getMaxPillarPrio(gA.pIndices);
        const prioB = getMaxPillarPrio(gB.pIndices);

        if (prioA !== prioB) {
            return prioB - prioA;
        }

        const isHapA = nameA.includes('합');
        const isHapB = nameB.includes('합');
        if (isHapA !== isHapB) {
            return isHapA ? -1 : 1;
        }

        return 0;
    });

    for (const keyKo of sortedKeys) {
        const g = grouped[keyKo];
        
        if (g.isSpecial) {
            const positionNamesKo = g.pIndices.map(idx => ['시지', '일지', '월지', '년지'][idx]).join(', ');
            const positionNamesEn = g.pIndices.map(idx => ['Hour', 'Day', 'Month', 'Year'][idx] + ' Branch').join(', ');
            const charColor = ELEMENT_COLORS[g.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
            
            tooltipKoList.push(`${positionNamesKo}와 만나 [${charColor}:${g.specialNameKo}]`);
            tooltipEnList.push(`${positionNamesEn} Combined: [${charColor}:${g.specialNameEn}]`);
        } else {
            const parts = keyKo.split('-');
            const natalChar = parts[0];
            const nameKo = parts[1];
            
            const koNameObj = isStem ? BAZI_MAPPING.stems[natalChar as keyof typeof BAZI_MAPPING.stems] : BAZI_MAPPING.branches[natalChar as keyof typeof BAZI_MAPPING.branches];
            const koCharName = koNameObj?.ko || natalChar;
            const enCharName = koNameObj?.en?.split(' ')[0] || natalChar;
            const charColor = ELEMENT_COLORS[koNameObj?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
            
            const positionNamesKo = g.pIndices.map(idx => ['시', '일', '월', '년'][idx] + (isStem ? '간' : '지')).join(', ');
            const positionNamesEn = g.pIndices.map(idx => ['Hour', 'Day', 'Month', 'Year'][idx] + (isStem ? ' Stem' : ' Branch')).join(', ');
            
            const coloredKoTxt = `[${charColor}:${koCharName}(${natalChar})]`;
            const coloredEnTxt = `[${charColor}:${enCharName}(${natalChar})]`;
            
            const endsWithConsonant = koCharName.endsWith('목') || koCharName.endsWith('금') || koCharName.endsWith('수') || koCharName.endsWith('화') || koCharName.endsWith('토');
            const particle = (koCharName.endsWith('목') || koCharName.endsWith('금') || koCharName.endsWith('수') || koCharName.endsWith('화') || koCharName.endsWith('토')) ? (koCharName.endsWith('목') || koCharName.endsWith('금') ? '과' : '와') : '와';
            
            let koTxt = `${positionNamesKo} ${coloredKoTxt}${particle} ${nameKo}`;
            let enTxt = `${positionNamesEn} ${coloredEnTxt}: ${g.nameEn}`;
            
            if (g.count > 1) {
                koTxt += ` x${g.count}`;
                enTxt += ` x${g.count}`;
            }
            
            tooltipKoList.push(koTxt);
            tooltipEnList.push(enTxt);
        }
    }
    
    const tooltipKo = tooltipKoList.join('<br/>');
    const tooltipEn = tooltipEnList.join('<br/>');
    
    return (
        <BaziTooltip content={{ ko: tooltipKo, en: tooltipEn }} lang={lang}>
           <span className={`relative inline-block cursor-help group transition-all duration-300 mx-0.5 ${lang === 'EN' ? 'whitespace-normal text-center break-words' : 'whitespace-nowrap'} ${shadowClass}`}>
             <span className="relative z-10 transition-transform duration-300 block group-hover:-translate-y-[1px]">
               {content}
             </span>
             {!hideUnderline && (
               <span className={`absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-[60%] h-[1.5px] rounded-full opacity-60 group-hover:opacity-100 group-hover:w-[90%] transition-all duration-300 ${lineClass} animate-pulse`} />
             )}
           </span>
        </BaziTooltip>
    );
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
                  <p className={`text-sm sm:text-[15px] ${lang === 'KO' ? 'font-display italic' : 'font-sans'} font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse leading-relaxed transition-colors cycle-vibe-preview-text`}>
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
                                      <h3 className="text-xl sm:text-2xl font-bold text-slate-400 tracking-tight">[{lang === 'KO' ? '어둠의 장막' : 'Dark Curtain'}]</h3>
                                    </div>
                                    <div className="p-4 bg-slate-900/20 border border-slate-500/30 rounded-xl">
                                      <p className="text-sm font-display text-white/90 leading-relaxed">
                                        {mainText}
                                      </p>
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
      <div ref={guideGridRef} className="space-y-4 relative">
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
                  className={`absolute left-0 right-0 z-[60] p-3 sm:p-5 rounded-2xl border border-neon-cyan/40 bg-goth-bg/95 shadow-[0_0_30px_rgba(0,242,255,0.3)] pointer-events-auto top-[100%] mt-4 overflow-y-auto max-h-[85vh] sm:max-h-[80vh]`}
                >
                <button onClick={() => setGuideStep(0)} className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 flex-shrink-0 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
                <div className="flex flex-col gap-2 sm:gap-4 relative pr-6 sm:pr-8">
                  {guideStep === 6 && (
                    <div className="w-full mb-1">
                      <div className="flex flex-col gap-1">
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
                          <div key={i} className="flex flex-row bg-white/5 border border-white/10 rounded-lg overflow-hidden h-9 sm:h-auto">
                            <div className="w-14 sm:w-20 lg:w-24 flex-shrink-0 flex items-center justify-center border-r border-white/10" style={{ backgroundColor: `color-mix(in srgb, ${g.color} 20%, transparent)` }}>
                              <span className="font-bold text-[8.5px] sm:text-[10px] tracking-widest text-center" style={{ color: g.color }}>
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
                  <div className="flex flex-row gap-3 sm:gap-4 items-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center shrink-0 border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,242,255,0.4)]">
                      {guideStep === 1 && <span className="text-xl sm:text-2xl" role="img" aria-label="roots">🌱</span>}
                      {guideStep === 2 && <span className="text-xl sm:text-2xl" role="img" aria-label="trunk">🪵</span>}
                      {guideStep === 3 && <span className="text-xl sm:text-2xl" role="img" aria-label="flower">🌸</span>}
                      {guideStep === 4 && <span className="text-xl sm:text-2xl" role="img" aria-label="fruit">🍏</span>}
                      {guideStep === 5 && <span className="text-xl sm:text-2xl" role="img" aria-label="hidden">✨</span>}
                      {guideStep === 6 && <span className="text-xl sm:text-2xl" role="img" aria-label="masks">🎭</span>}
                      {guideStep === 7 && <span className="text-xl sm:text-2xl" role="img" aria-label="seasons">🌤️</span>}
                    </div>
                    <div className="flex-1">
                    <h4 className="text-[0.95rem] sm:text-lg font-bold text-neon-cyan mb-1.5 flex flex-wrap items-center gap-2">
                      {lang === 'KO' ? (
                        <>
                          {guideStep === 1 && '연주 - 나의 뿌리와 조상'}
                          {guideStep === 2 && '월주 - 환경과 부모님'}
                          {guideStep === 3 && '일주 - 나 자신과 배우자'}
                          {guideStep === 4 && '시주 - 미래와 숨은 본능'}
                          {guideStep === 5 && '지장간 - 땅 속에 감춰진 잠재력'}
                          {guideStep === 6 && '십성 - 나의 사회적 가면'}
                          {guideStep === 7 && '대운 - 내게 주어진 10년의 테마'}
                        </>
                      ) : (
                        <>
                          {guideStep === 1 && 'Year Pillar - Roots & Ancestry'}
                          {guideStep === 2 && 'Month Pillar - Environment & Parents'}
                          {guideStep === 3 && 'Day Pillar - Self & Spouse'}
                          {guideStep === 4 && 'Hour Pillar - Future & Hidden Defaults'}
                          {guideStep === 5 && 'Hidden Stems - Concealed Potential'}
                          {guideStep === 6 && 'Ten Gods - Your Social Masks'}
                          {guideStep === 7 && 'Life Seasons - The 10-Year Theme'}
                        </>
                      )}
                      <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-white/70 whitespace-nowrap">
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
                              {isDayMasterRooted ? (
                                <span className={`text-[10.5px] sm:text-[11.5px] p-2 rounded-lg break-keep shadow-sm ${theme === 'light' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'}`}>
                                  <span className="font-bold">✨ 통근(뿌리) 총람:</span> 귀하는 지지에 강력한 뿌리를 두고 있는 <strong className={theme === 'light' ? 'text-amber-700' : 'text-white'}>기반이 튼튼한 사주</strong>입니다.
                                </span>
                              ) : (
                                <span className={`text-[10.5px] sm:text-[11.5px] p-2 rounded-lg break-keep shadow-sm ${theme === 'light' ? 'bg-slate-50 text-slate-800 border border-slate-200' : 'bg-white/5 text-white/80 border border-white/10'}`}>
                                  <span className="font-bold">✨ 통근(뿌리) 총람:</span> 귀하는 지지에 뚜렷한 뿌리가 없어 <strong className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>고정된 틀에서 자유롭고 환경에 대한 유연한 대처능력</strong>을 지닌 사주입니다.
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
                          {guideStep === 7 && (
                            <span className="block space-y-2">
                              <span>계절이 바뀌듯 10년 단위로 당신에게 펼쳐지는 환경과 무대입니다. 인생의 어떤 계절을 지나고 있는지 확인해보세요.</span>
                              <span className={`block text-[11px] leading-relaxed p-2.5 rounded-xl border font-sans font-medium space-y-1 ${theme === 'light' ? 'bg-amber-50/50 text-amber-900 border-amber-200/60' : 'bg-neon-cyan/5 text-neon-cyan/90 border-neon-cyan/25'}`}>
                                <strong className={`font-bold block text-xs ${theme === 'light' ? 'text-amber-800' : 'text-white'}`}>🔗 Tip. 합형충파해(Interactions) 확인하는 법</strong>
                                <span>각 대운/세운 카드 우측 상단 고리 모양의 체인(🔗) 아이콘에 마우스를 올리거나(모바일 터치) 하시면, 해당 대운/세운이 내 사주 원국과 어떤 결속(합)이나 조율(충) 등의 역동적인 관계를 맺는지 팝업 해설로 바로 알 수 있습니다!</span>
                              </span>
                            </span>
                          )}
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
                              {isDayMasterRooted ? (
                                <span className={`text-[10.5px] sm:text-[11.5px] p-2 rounded-lg break-keep shadow-sm ${theme === 'light' ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'}`}>
                                  <span className="font-bold">✨ Rooting Overview:</span> You have a <strong className={theme === 'light' ? 'text-amber-700' : 'text-white'}>strongly rooted and stable foundation</strong> in your chart.
                                </span>
                              ) : (
                                <span className={`text-[10.5px] sm:text-[11.5px] p-2 rounded-lg break-keep shadow-sm ${theme === 'light' ? 'bg-slate-50 text-slate-800 border border-slate-200' : 'bg-white/5 text-white/80 border border-white/10'}`}>
                                  <span className="font-bold">✨ Rooting Overview:</span> You have a <strong className={theme === 'light' ? 'text-slate-700' : 'text-slate-300'}>highly flexible, adaptive, and frame-free foundation</strong> with great versatility in life.
                                </span>
                              )}
                              <span>These are your true weapons and hidden instincts. The small tags below show how strongly this potential is connected to the Heavenly Stems above. Hover over them to see the glowing connections.</span>
                              {presentRootTags.size > 0 && (
                                <span className={`text-[10px] sm:text-[11px] p-1.5 rounded break-keep flex flex-wrap gap-x-2 gap-y-1 mt-1 ${theme === 'light' ? 'bg-slate-50 text-slate-700 border border-slate-200' : 'bg-white/5 text-white/80 border border-white/10'}`}>
                                  {presentRootTags.has('MAIN') && <span><span className={`font-bold ${theme === 'light' ? 'text-rose-600' : 'text-neon-pink'}`}>MAIN:</span> Core strength directly rooted to its own Heavenly Stem. </span>}
                                  {presentRootTags.has('E-MN') && <span><span className={`font-bold ${theme === 'light' ? 'text-rose-600' : 'text-neon-pink'}`}>Y/M/D/H:</span> Strong Main-Qi root connecting directly to the designated Heavenly Stem. </span>}
                                  {presentRootTags.has('GEN') && <span><span className={`font-bold ${theme === 'light' ? 'text-amber-600' : 'text-yellow-400'}`}>GEN:</span> Supportive potential feeding its own Heavenly Stem. </span>}
                                  {presentRootTags.has('E-GN') && <span><span className={`font-bold ${theme === 'light' ? 'text-amber-600' : 'text-yellow-400'}`}>Y-GN/M-GN/D-GN/H-GN:</span> Generative support feeding and empowering the designated Heavenly Stem. </span>}
                                  {presentRootTags.has('SUB') && <span><span className={`font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>SUB:</span> A highly flexible, resilient backup weapon for its own Heavenly Stem. </span>}
                                  {presentRootTags.has('E-SB') && <span><span className={`font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>Y-SB/M-SB/D-SB/H-SB:</span> Resilient secondary/sub root backing up the designated Heavenly Stem.</span>}
                                </span>
                              )}
                            </span>
                          )}
                          {guideStep === 6 && 'Represents 10 psychological and behavioral patterns of how you relate to others. It is your weapon and mask in this world.'}
                          {guideStep === 7 && (
                            <span className="block space-y-2">
                              <span>Just like seasons change, this represents the shifting environment and theme you face every 10 years.</span>
                              <span className={`block text-[11px] leading-relaxed p-2.5 rounded-xl border font-sans font-medium space-y-1 ${theme === 'light' ? 'bg-amber-50/50 text-amber-900 border-amber-200/60' : 'bg-neon-cyan/5 text-neon-cyan/90 border-neon-cyan/25'}`}>
                                <strong className={`font-bold block text-xs ${theme === 'light' ? 'text-amber-800' : 'text-white'}`}>🔗 Tip. Finding Interactions</strong>
                                <span>Hover over (or tap on mobile) the chain (🔗) icon on the top-right of each season card to view popup descriptions of how that cycle interacts with your natal chart through dynamic combinations or clashes.</span>
                              </span>
                            </span>
                          )}
                        </>
                      )}
                    </p>
                    <div className="flex gap-1.5 sm:gap-2 justify-end w-full pt-1 sm:pt-0">
                      <button onClick={() => setShowGuideDetailModal(true)} className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm rounded border border-white/20 text-white hover:bg-white/10 transition-colors mr-auto whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {lang === 'KO' ? '자세히 알아보기' : 'Learn More'}
                        </span>
                      </button>
                      {guideStep > 1 && (
                        <button onClick={() => setGuideStep(p => p - 1)} className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm rounded border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap">
                          {lang === 'KO' ? '이전' : 'Prev'}
                        </button>
                      )}
                      {guideStep < 7 ? (
                        <button onClick={() => setGuideStep(p => p + 1)} className="px-3 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-sm rounded bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 flex items-center justify-center transition-colors whitespace-nowrap">
                          {lang === 'KO' ? '다음' : 'Next'} <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
                        </button>
                      ) : (
                        <button onClick={() => setGuideStep(0)} className="px-3 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-sm rounded bg-neon-pink/20 border border-neon-pink text-neon-pink hover:bg-neon-pink/30 flex items-center justify-center transition-colors whitespace-nowrap">
                          {lang === 'KO' ? '가이드 종료' : 'Finish Guide'} <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
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
                      <div 
                        className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 z-10 flex items-center justify-center w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] rounded-full border transition-all duration-300 ${
                          isLight 
                            ? 'bg-slate-50/95 border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)]' 
                            : 'bg-[#0f0f1b]/80 border-white/10 shadow-[0_1.5px_3px_rgba(0,0,0,0.25)]'
                        }`}
                        title={lang === 'KO' ? (pillar.stemPolarity === 1 ? '양(陽)' : '음(陰)') : (pillar.stemPolarity === 1 ? 'Yang (+)' : 'Yin (-)')}
                      >
                        <PolarityIcon polarity={pillar.stemPolarity} size={11} className="sm:scale-110" />
                      </div>
                    )}
                    <div className="absolute top-1.5 sm:top-2.5 left-0 right-0 px-6 flex justify-center">
                      <div className={`text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-tighter sm:tracking-[0.2em] uppercase ${isUnknownPillar ? 'text-white/20' : 'text-white/40'}`}>
                        {lang === 'KO' ? 
                          (pillar.title === 'Year' ? '연간' : pillar.title === 'Month' ? '월간' : pillar.title === 'Day' ? '일간' : '시간') : 
                          (pillar.title === 'Hour' ? 'Time Stem' : `${pillar.title} Stem`)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-grow w-full pt-3.5 sm:pt-2.5 md:pt-3">
                      <div 
                        className={`w-full text-base sm:text-xl md:text-3xl font-gothic leading-tight flex flex-col items-center justify-center py-1 ${isUnknownPillar ? 'text-white/30' : ''}`}
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
                              <div className="text-sm sm:text-[17px] md:text-xl truncate w-full text-center tracking-tighter px-1">{getRomanized(pillar.stem).toUpperCase()}</div>
                            ))
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-1 sm:bottom-1.5 left-0 right-0 px-2 flex justify-center">
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
                      <div 
                        className={`absolute top-1 right-1 sm:top-1.5 sm:right-1.5 z-10 flex items-center justify-center w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] rounded-full border transition-all duration-300 ${
                          isLight 
                            ? 'bg-slate-50/95 border-slate-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.05)]' 
                            : 'bg-[#0f0f1b]/80 border-white/10 shadow-[0_1.5px_3px_rgba(0,0,0,0.25)]'
                        }`}
                        title={lang === 'KO' ? (pillar.branchPolarity === 1 ? '양(陽)' : '음(陰)') : (pillar.branchPolarity === 1 ? 'Yang (+)' : 'Yin (-)')}
                      >
                        <PolarityIcon polarity={pillar.branchPolarity} char={pillar.branch} size={11} className="sm:scale-110" />
                      </div>
                    )}
                    <div className="absolute top-1.5 sm:top-2.5 left-0 right-0 px-6 flex justify-center">
                      <div className={`text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-tighter sm:tracking-[0.2em] uppercase ${isUnknownPillar ? 'text-white/20' : 'text-white/40'}`}>
                        {lang === 'KO' ? 
                          (pillar.title === 'Year' ? '연지' : pillar.title === 'Month' ? '월지' : pillar.title === 'Day' ? '일지' : '시지') : 
                          (pillar.title === 'Hour' ? 'Time Branch' : `${pillar.title} Branch`)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-grow w-full pt-3.5 sm:pt-2.5 md:pt-3">
                      <div 
                        className={`w-full text-base sm:text-xl md:text-3xl font-gothic leading-tight flex flex-col items-center justify-center py-1 ${isUnknownPillar ? 'text-white/30' : ''}`}
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
                    </div>
                    <div className="absolute bottom-1 sm:bottom-1.5 left-0 right-0 px-2 flex justify-center">
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
                  <div className="flex flex-wrap justify-center items-center gap-1 w-full sm:flex-nowrap sm:gap-1.5">
                    {isUnknownPillar ? (
                      <div className="text-[9px] text-center text-white/20 my-2">?</div>
                    ) : (
                      hiddenStems.map((hs, idx) => {
                        const isThirdOfThree = hiddenStems.length === 3 && idx === 2;
                        const spansClass = isThirdOfThree ? "w-full" : "w-[45%]";
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
                              if (pillar.title === 'Day') {
                                rootTypeKo = " [일간 결속]";
                                origRootTextKo = `원래는 본신인 일간 [${dayMaster}]과 직접 통근/상생 결속되어 수호하는 중심 역할을 했습니다.`;
                              } else {
                                rootTypeKo = " [일간·천간 이중 결속]";
                                origRootTextKo = `원래는 천간 [${pillar.stem}] 및 일간 [${dayMaster}]과 이중 통근/상생 결속되어 수호하는 중심 역할을 했습니다.`;
                              }
                            } else if (hasPillarRoot || allRootedStems.length > 0) {
                              rootTypeKo = ` [다중 연계 파괴]`;
                              origRootTextKo = `천간의 에너지를 강하게 지지해주던 뿌리였습니다.`;
                            } else {
                              rootTypeKo = " [미통근/생조]";
                              origRootTextKo = "천간이나 일간으로 직접 통근하지 않는 일반 수집 에너지였습니다.";
                            }

                            conclusionTitle = `🚨 통근 파괴됨${rootTypeKo}`;
                            conclusionDesc = `<strong>상태:</strong> ${rootItem?.damages?.[0] || '충(衝)으로 인해 지장간 뿌리가 파괴되었습니다.'}<br/><span class="mt-1 block text-[9px] sm:text-[10px] ${isLight ? 'text-red-750 border-t border-red-200' : 'text-red-200/65 border-t border-red-500/10'} pt-1 leading-normal"><strong>원래 관계:</strong> ${origRootTextKo}</span>`;
                            conclusionColorClass = isLight ? "text-red-650" : "text-red-400";
                            conclusionBgClass = isLight ? "bg-red-50 border-red-200 text-red-900 font-medium" : "bg-red-950/30 border-red-900/40 text-red-100";
                          } else if (isTwisted) {
                            let rootTypeKo = "";
                            let origRootTextKo = "";
                            if (pillarRootInfo && dmRootInfo) {
                              if (pillar.title === 'Day') {
                                rootTypeKo = " [일간 결속]";
                                origRootTextKo = `본신인 일간 [${dayMaster}]과 직접 강력한 수호 결속을 형성하고 있습니다.`;
                              } else {
                                rootTypeKo = " [일간·천간 이중 결속]";
                                origRootTextKo = `천간 [${pillar.stem}] 및 일간 [${dayMaster}]과 강력한 이중 수호 결속을 형성하고 있습니다.`;
                              }
                            } else if (hasPillarRoot || allRootedStems.length > 0) {
                              rootTypeKo = ` [다중 연계 불안정]`;
                              origRootTextKo = `천간에 연결된 소중한 비옥한 뿌리입니다.`;
                            } else {
                              rootTypeKo = " [생조 지원]";
                              origRootTextKo = "천간이나 일간을 향해 원활한 생조 보조 작용을 하고 있습니다.";
                            }

                            conclusionTitle = `⚡ 형살/비틀림${rootTypeKo}`;
                            conclusionDesc = `<strong>상태:</strong> ${rootItem?.damages?.[0] || '형살 작용으로 에너지가 다소 뒤틀려 압박을 지닙니다.'}<br/><span class="mt-1 block text-[9.5px] ${isLight ? 'text-amber-800/95 border-t border-amber-200' : 'text-amber-200/70 border-t border-amber-500/10'} pt-1 leading-normal"><strong>통근 관계:</strong> ${origRootTextKo}</span>`;
                            conclusionColorClass = isLight ? "text-amber-600" : "text-amber-400";
                            conclusionBgClass = isLight ? "bg-amber-50 border-amber-200 text-amber-900 font-medium" : "bg-amber-950/20 border-amber-900/40 text-amber-100";
                          } else {
                            if (allRootedStems.length > 0) {
                              const bestRoot = allRootedStems[0];
                              conclusionTitle = allRootedStems.length > 1 ? `✨ 다중 연계 [${bestRoot.short} 등]` : (bestRoot.pIdx === i ? `📍 기둥 연계 [${bestRoot.short}]` : `🌟 외부 연계 [${bestRoot.short}]`);
                              const rootTexts = allRootedStems.map(r => `[${r.pNameKo}(${r.stem}) ➔ ${r.short}]`).join(', ');
                              conclusionDesc = `천간에 연결되어 힘을 보탭니다:<br/><span class="text-[10px] sm:text-[11px] font-black mt-0.5 inline-block">${rootTexts}</span>`;
                              
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
                              if (pillar.title === 'Day') {
                                rootTypeEn = " [Day Master Guard]";
                                origRootTextEn = `Originally established a powerful direct protective connection to the Day Master [${dayMaster}].`;
                              } else {
                                rootTypeEn = " [Double Guard]";
                                origRootTextEn = `Originally established a powerful double connection protecting both stem [${pillar.stem}] and day master [${dayMaster}].`;
                              }
                            } else if (hasPillarRoot || allRootedStems.length > 0) {
                              rootTypeEn = ` [Multi-Root Shattered]`;
                              origRootTextEn = `Originally rooted directly into top stems.`;
                            } else {
                              rootTypeEn = " [Unrooted]";
                              origRootTextEn = "A floating resource energy without direct stem rooting.";
                            }

                            conclusionTitle = `🚨 Root Shattered${rootTypeEn}`;
                            conclusionDesc = `<strong>Status:</strong> ${rootItem?.damagesEn?.[0] || 'Adjacent clash is shattering rooting stability.'}<br/><span class="mt-1 block text-[9.5px] ${isLight ? 'text-red-770/85 border-t border-red-200' : 'text-red-200/60 border-t border-red-500/10'} pt-1 leading-normal"><strong>Original Connection:</strong> ${origRootTextEn}</span>`;
                            conclusionColorClass = isLight ? "text-red-600 animate-pulse font-bold" : "text-red-400";
                            conclusionBgClass = isLight ? "bg-red-50 border-red-200 text-red-900" : "bg-red-950/30 border-red-900/40 text-red-100";
                          } else if (isTwisted) {
                            let rootTypeEn = "";
                            let origRootTextEn = "";
                            if (pillarRootInfo && dmRootInfo) {
                              if (pillar.title === 'Day') {
                                rootTypeEn = " [Day Master Guard]";
                                origRootTextEn = `Forms a protective connection to Day Master [${dayMaster}].`;
                              } else {
                                rootTypeEn = " [Double Guard]";
                                origRootTextEn = `Forms a dual protective connection to both stem [${pillar.stem}] and day master [${dayMaster}].`;
                              }
                            } else if (hasPillarRoot || allRootedStems.length > 0) {
                              rootTypeEn = ` [Multi-Root Twisted]`;
                              origRootTextEn = `An important root for top stems, currently unstable.`;
                            } else {
                              rootTypeEn = " [Generative]";
                              origRootTextEn = "Provides pure supportive/generative assistance to the stem.";
                            }

                            conclusionTitle = `⚡ Squeezed/Twisted${rootTypeEn}`;
                            conclusionDesc = `<strong>Status:</strong> ${rootItem?.damagesEn?.[0] || 'Adjacent punishment is twisting this energy.'}<br/><span class="mt-1 block text-[9.5px] ${isLight ? 'text-amber-800/95 border-t border-amber-200' : 'text-amber-200/70 border-t border-amber-500/10'} pt-1 leading-normal"><strong>Root Connection:</strong> ${origRootTextEn}</span>`;
                            conclusionColorClass = isLight ? "text-amber-600 font-bold" : "text-amber-400";
                            conclusionBgClass = isLight ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-amber-950/20 border-amber-900/40 text-amber-100";
                          } else {
                            if (allRootedStems.length > 0) {
                              const bestRoot = allRootedStems[0];
                              conclusionTitle = allRootedStems.length > 1 ? `✨ Multi Align [${bestRoot.short}]` : (bestRoot.pIdx === i ? `📍 Pillar Align [${bestRoot.short}]` : `🌟 External Align [${bestRoot.short}]`);
                              const rootTexts = allRootedStems.map(r => `[${r.pNameEn}(${r.stem}) ➔ ${r.short}]`).join(', ');
                              conclusionDesc = `Supports and grounds these stems:<br/><span class="text-[10px] sm:text-[11px] font-black mt-0.5 inline-block">${rootTexts}</span>`;
                              
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
                            <div class="pt-1 sm:pt-1.5 border-t ${combTitleBorder} space-y-0.5 sm:space-y-1">
                              <div class="font-bold ${combTitleClass} flex items-center gap-1 text-[10px] sm:text-[11px] leading-tight mt-0.5">🤝 삼합·방합·육합 지지 합화 지원:</div>
                              <ul class="text-[9.5px] sm:text-[10px] pl-1.5 sm:pl-2 list-disc list-inside space-y-0.5 leading-normal sm:leading-relaxed p-1 sm:p-1.5 rounded-lg border ${combBg} font-sans">
                                ${pRootDetails.combinations.map((c: any) => `<li>${c.ko}</li>`).join('')}
                              </ul>
                            </div>
                          `;
                          combHtmlEn = `
                            <div class="pt-1 sm:pt-1.5 border-t ${combTitleBorder} space-y-0.5 sm:space-y-1">
                              <div class="font-bold ${combTitleClass} flex items-center gap-1 text-[10px] sm:text-[11px] leading-tight mt-0.5">🤝 Active Branches Hap-hwa Support:</div>
                              <ul class="text-[9.5px] sm:text-[10px] pl-1.5 sm:pl-2 list-disc list-inside space-y-0.5 leading-normal sm:leading-relaxed p-1 sm:p-1.5 rounded-lg border ${combBg} font-display">
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
<div class="space-y-1 sm:space-y-2 text-xs ${isLight ? 'text-slate-900' : 'text-white/90'}">
  <div class="pb-0.5 sm:pb-1 border-b ${isLight ? 'border-slate-200' : 'border-white/10'} flex justify-between items-center font-display">
    <div class="flex items-center gap-1">
      <span class="font-bold ${isLight ? 'text-slate-800' : 'text-neon-cyan'} text-[13px] sm:text-sm leading-none">${hs} (${hsData?.ko || hs})</span>
      <span class="flex items-center justify-center w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'} shadow-sm">${polarityIconSvg}</span>
    </div>
    <span class="text-[9px] sm:text-[10px] ${isLight ? 'bg-slate-100' : 'bg-white/10'} px-1 py-0.5 rounded font-bold leading-none" style="color: ${getTenGodColor(hsTenGod.ko)}">${hsTenGod.ko}</span>
  </div>
  <div class="flex items-center gap-1 pt-0.5 pb-0.5 sm:pb-1 text-[10.5px] sm:text-xs">
    <span class="${isLight ? 'text-slate-500' : 'text-white/50'}">속성:</span>
    <span class="font-bold" style="color: ${colorHex}">${hsDataElementKo} (${hsData?.element})</span>
  </div>
  
  <div class="pt-1 sm:pt-1.5 border-t ${isLight ? 'border-indigo-100' : 'border-white/10'} space-y-0.5 sm:space-y-1">
    <div class="font-bold text-[11px] sm:text-[11.5px] tracking-tight ${conclusionColorClass} flex items-center gap-1">${conclusionTitle}</div>
    <div class="pl-1.5 sm:pl-2 leading-snug sm:leading-relaxed text-[10px] sm:text-[11px] p-1 sm:p-2 rounded-lg border ${conclusionBgClass} font-sans">
      ${conclusionDesc}
    </div>
  </div>

  ${!isDestroyed ? combHtmlKo : ''}
</div>
`;

                        const tooltipContentEn = `
<div class="space-y-1 sm:space-y-2 text-xs ${isLight ? 'text-slate-900' : 'text-white/90'}">
  <div class="pb-0.5 sm:pb-1 border-b ${isLight ? 'border-slate-200' : 'border-white/10'} flex justify-between items-center font-display">
    <div class="flex items-center gap-1">
      <span class="font-bold ${isLight ? 'text-slate-800' : 'text-neon-cyan'} text-[13px] sm:text-sm leading-none">${hs} (${hsNameEnBase})</span>
      <span class="flex items-center justify-center w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/10 bg-black/20'} shadow-sm">${polarityIconSvg}</span>
    </div>
    <span class="text-[9px] sm:text-[10px] ${isLight ? 'bg-slate-100' : 'bg-white/10'} px-1 py-0.5 rounded font-bold leading-none" style="color: ${getTenGodColor(hsTenGod.ko)}">${hsTenGod.en}</span>
  </div>
  <div class="flex items-center gap-1 pt-0.5 pb-0.5 sm:pb-1 text-[10.5px] sm:text-xs">
    <span class="${isLight ? 'text-slate-500' : 'text-white/50'}">Element:</span>
    <span class="font-bold" style="color: ${colorHex}">${hsData?.element}</span>
  </div>
  
  <div class="pt-1 sm:pt-1.5 border-t ${isLight ? 'border-indigo-100' : 'border-white/10'} space-y-0.5 sm:space-y-1">
    <div class="font-bold text-[11px] sm:text-[11.5px] tracking-tight ${conclusionColorClass} flex items-center gap-1">${conclusionTitle}</div>
    <div class="pl-1.5 sm:pl-2 leading-snug sm:leading-relaxed text-[10px] sm:text-[11px] p-1 sm:p-2 rounded-lg border ${conclusionBgClass} font-display">
      ${conclusionDesc}
    </div>
  </div>

  ${!isDestroyed ? combHtmlEn : ''}
</div>
`;

                        const bestTagInfo = allRootedStems[0];
                        const itemWidthClass = lang === 'KO' 
                          ? 'w-full max-w-[34px] sm:max-w-[46px] md:max-w-[56px]' 
                          : 'w-full max-w-[40px] sm:max-w-[54px] md:max-w-[64px] lg:max-w-[70px]';

                        return (
                          <div 
                            key={idx} 
                            className={`${spansClass} flex justify-center sm:w-auto`}
                          >
                            <BaziTooltip 
                              content={{ ko: tooltipContentKo, en: tooltipContentEn }}
                              lang={lang}
                              onVisibleChange={(visible) => {
                                if (visible) {
                                  setHoveredHiddenStem({
                                    pillarIdx: i, 
                                    hsIdx: idx, 
                                    hs, 
                                    connectedStems: allRootedStems.map(r => r.stem), 
                                    isDestroyed
                                  });
                                } else {
                                  setHoveredHiddenStem(prev => {
                                    if (prev && prev.pillarIdx === i && prev.hsIdx === idx) {
                                      return null;
                                    }
                                    return prev;
                                  });
                                }
                              }}
                            >
                              <div 
                                className={`flex flex-col items-center p-1 sm:p-1.5 md:p-2 rounded ${itemWidthClass} border transition-all duration-300 relative ${highlightClass}`}
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
                                              ? `${bestTagInfo.pNameEn === 'Year' ? 'Y' : bestTagInfo.pNameEn === 'Month' ? 'M' : bestTagInfo.pNameEn === 'DM' ? 'D' : 'H'}-MN` 
                                              : bestTagInfo.type === 'sub_residual' 
                                                ? `${bestTagInfo.pNameEn === 'Year' ? 'Y' : bestTagInfo.pNameEn === 'Month' ? 'M' : bestTagInfo.pNameEn === 'DM' ? 'D' : 'H'}-SB` 
                                                : `${bestTagInfo.pNameEn === 'Year' ? 'Y' : bestTagInfo.pNameEn === 'Month' ? 'M' : bestTagInfo.pNameEn === 'DM' ? 'D' : 'H'}-GN`))
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
                          </div>
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
      <div ref={lifeSeasonsRef} className={`space-y-6 transition-all duration-500 ease-in-out relative ${guideStep === 7 ? 'scale-105 z-50 p-4 bg-black/40 border border-neon-cyan/40 rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.2)]' : ''} ${guideStep > 0 && guideStep !== 7 ? 'opacity-20 blur-[2px] grayscale-[50%]' : 'z-10'}`}>
        <AnimatePresence>
          {guideStep === 7 && (
            <motion.div 
              key="guideStep7"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute left-0 right-0 z-[60] p-4 sm:p-6 rounded-2xl border border-neon-cyan/40 bg-goth-bg/95 shadow-[0_0_30px_rgba(0,242,255,0.3)] pointer-events-auto bottom-[100%] mb-4`}
            >
              <button onClick={() => setGuideStep(0)} className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex flex-row gap-3 sm:gap-4 items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center shrink-0 border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,242,255,0.4)] mt-1">
                  <span className="text-xl sm:text-2xl" role="img" aria-label="seasons">🌤️</span>
                </div>
                <div className="flex-1 pr-6 sm:pr-0">
                  <h4 className="text-base sm:text-lg font-bold text-neon-cyan mb-1 flex flex-wrap items-center gap-2">
                    {lang === 'KO' ? '대운 - 내게 주어진 10년의 테마' : 'Life Seasons - The 10-Year Theme'}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-white/70 whitespace-nowrap">
                      Step 7 / 7
                    </span>
                  </h4>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-4">
                    {lang === 'KO' 
                      ? '계절이 바뀌듯 10년 단위로 당신에게 펼쳐지는 환경과 무대입니다. 인생의 어떤 계절을 지나고 있는지 확인해보세요. (각 대운/세운 카드 우측 상단의 체인(🔗) 메뉴에 마우스를 올리면 내 사주 원국과의 합형충파해 작용을 바로 확인할 수 있습니다.)' 
                      : 'Just like seasons change, this represents the shifting environment and theme you face every 10 years. (You can hover over the chain (🔗) icon on the top-right of each card to confirm dynamic combinations and clashes with your natal chart.)'}
                  </p>
                  <div className="flex gap-1.5 sm:gap-2 justify-end w-full pt-1 sm:pt-0">
                    <button onClick={() => setShowGuideDetailModal(true)} className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm rounded border border-white/20 text-white hover:bg-white/10 transition-colors mr-auto whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        {lang === 'KO' ? '자세히 알아보기' : 'Learn More'}
                      </span>
                    </button>
                    <button onClick={() => setGuideStep(6)} className="px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-sm rounded border border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap">
                      {lang === 'KO' ? '이전' : 'Prev'}
                    </button>
                    <button onClick={() => setGuideStep(0)} className="px-3 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-sm rounded bg-neon-pink/20 border border-neon-pink text-neon-pink hover:bg-neon-pink/30 flex items-center justify-center transition-colors whitespace-nowrap">
                      {lang === 'KO' ? '가이드 종료' : 'Finish Guide'} <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
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
                  {(() => {
                    const extraContexts: AdditionalContext[] = [];
                    const extraStems = extraContexts.map(c => c.stem);
                    const extraBranches = extraContexts.map(c => c.branch);
                    const stemInts = getCycleInteractions(cycle.stem, true, extraStems, extraBranches);
                    const branchInts = getCycleInteractions(cycle.branch, false, extraStems, extraBranches);
                    const hasInteractions = stemInts.length > 0 || branchInts.length > 0;
                    const tooltipContent = hasInteractions ? getPillarInteractionsTooltipContent(cycle.stem, cycle.branch, extraContexts) : { ko: '', en: '' };

                    return (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setExpandedCycle(isExpanded ? null : actualIndex);
                          setExpandedYear(null);
                          setExpandedMonth(null);
                        }}
                        className={`w-full min-h-[110px] sm:min-h-[120px] flex-1 rounded-xl transition-all flex flex-col items-center justify-start pt-2 px-1 pb-4 relative shadow-sm cursor-pointer select-none ${
                          isCurrent 
                            ? (theme === 'light' ? 'ring-2 ring-pink-400 bg-pink-50 shadow-[0_4px_12px_rgba(236,72,153,0.15)] z-10' : 'ring-2 ring-neon-pink bg-[#1a0515] border border-neon-pink/50 shadow-[0_0_20px_rgba(255,0,122,0.4)] z-10')
                            : (theme === 'light' ? 'bg-white border border-slate-200 hover:bg-slate-50' : 'bg-black/80 border border-white/10 hover:bg-white/10')
                        }`}
                      >
                        {hasInteractions && (
                          <div 
                            className="absolute -top-1.5 -right-1.5 z-30" 
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                          >
                            <BaziTooltip content={tooltipContent} lang={lang}>
                              <motion.div 
                                whileHover={{ scale: 1.25 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1 rounded-full transition-all duration-300 cursor-pointer ${
                                  theme === 'light'
                                    ? 'bg-purple-100 border border-purple-200 text-purple-600 hover:bg-purple-200'
                                    : 'bg-purple-950/50 border border-purple-500/40 text-purple-400 hover:text-purple-300 hover:bg-purple-900/60 shadow-[0_0_6px_rgba(168,85,247,0.3)]'
                                }`}
                              >
                                <Link className="w-2.5 h-2.5" />
                              </motion.div>
                            </BaziTooltip>
                          </div>
                        )}

                        <div className={`text-[9px] sm:text-[10px] font-bold mb-0.5 uppercase leading-[1.1] text-center px-0.5 flex items-center justify-center ${isCurrent ? (theme === 'light' ? 'text-pink-600' : 'text-neon-pink') : (theme === 'light' ? 'text-slate-400' : 'text-white/40')}`}>
                           {getLifeStage(cycle.age)}
                        </div>
                        <div className={`text-xs sm:text-sm font-bold mb-0.5 ${isCurrent ? (theme === 'light' ? 'text-slate-900' : 'text-white') : (theme === 'light' ? 'text-slate-800' : 'text-white')}`}>{cycle.age}</div>
                        
                        <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0">
                          <div 
                            className={`font-gothic font-bold leading-none text-center ${lang === 'EN' ? 'text-[11px] sm:text-[12px] md:text-[13px] mb-1' : 'text-[14px] sm:text-[15px] md:text-[16px] mb-0.5'}`}
                            style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[cycle.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                          >
                            <RenderCycleChar char={cycle.stem} isStem={true} hideUnderline={true} hideTooltip={true} />
                          </div>
                          <div 
                            className={`font-gothic font-bold leading-none text-center opacity-90 ${lang === 'EN' ? 'text-[11px] sm:text-[12px] md:text-[13px] leading-tight' : 'text-[14px] sm:text-[15px] md:text-[16px] -mt-[1px]'}`}
                            style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[cycle.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                          >
                            <RenderCycleChar char={cycle.branch} isStem={false} hideUnderline={true} hideTooltip={true} />
                          </div>
                        </div>
                        
                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full p-0.5 border shadow-sm transition-all z-20 ${
                          theme === 'light'
                            ? 'bg-white border-slate-200 text-slate-400'
                            : 'bg-[#0B0416] border-white/10 text-white/40'
                        }`}>
                          {isExpanded 
                            ? <ChevronUp className={`w-3 h-3 ${theme === 'light' ? 'text-pink-500' : 'text-neon-pink'}`} /> 
                            : <ChevronDown className="w-3 h-3 text-white/20" />
                          }
                        </div>
                      </motion.div>
                    );
                  })()}
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
                <div className="text-xs font-display font-medium text-white/60 uppercase tracking-[0.2em] text-center">
                  {lang === 'KO' ? '세운표 (연도별 흐름)' : 'Annual Alignment (Se-Un)'}
                </div>
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
                    <div key={api} id={`bazi-annual-item-${ap.year}`} className="flex flex-col items-center space-y-1 w-20 flex-shrink-0">
                      <div className="text-xs sm:text-[13px] font-mono font-bold text-white/60">{ap.year}</div>
                      <div 
                        className="text-[11px] sm:text-[12px] font-bold uppercase tracking-tighter flex items-center justify-center text-center h-[28px] w-full" 
                        style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[ap.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}
                      >
                        {renderTenGodLabel(ap.stemTenGodKo, ap.stemTenGodEn, ap.stemPolarity)}
                      </div>
                      {(() => {
                        const cycle = result.grandCycles[expandedCycle];
                        const extraContexts: AdditionalContext[] = [
                            { stem: cycle.stem, branch: cycle.branch, labelKo: `대운`, labelEn: `Daewun` }
                        ];
                        const extraStems = extraContexts.map(c => c.stem);
                        const extraBranches = extraContexts.map(c => c.branch);
                        const stemInts = getCycleInteractions(ap.stem, true, extraStems, extraBranches);
                        const branchInts = getCycleInteractions(ap.branch, false, extraStems, extraBranches);
                        const hasInteractions = stemInts.length > 0 || branchInts.length > 0;
                        const tooltipContent = hasInteractions ? getPillarInteractionsTooltipContent(ap.stem, ap.branch, extraContexts) : { ko: '', en: '' };

                        return (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setExpandedYear(isYearExpanded ? null : api);
                              setExpandedMonth(null);
                            }}
                            className={`w-full bg-white/5 rounded-xl pt-0 flex flex-col items-center border transition-all relative min-h-[90px] sm:min-h-[100px] justify-start cursor-pointer select-none ${borderClass} px-1 pb-3`}
                          >
                            {hasInteractions && (
                              <div 
                                className="absolute -top-1.5 -right-1.5 z-30" 
                                onClick={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                              >
                                <BaziTooltip content={tooltipContent} lang={lang}>
                                  <motion.div 
                                    whileHover={{ scale: 1.25 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-0.5 rounded-full transition-all duration-300 cursor-pointer ${
                                      theme === 'light'
                                        ? 'bg-purple-100 border border-purple-200 text-purple-600 hover:bg-purple-200'
                                        : 'bg-purple-950/50 border border-purple-500/40 text-purple-400 hover:text-purple-300 hover:bg-purple-900/60 shadow-[0_0_6px_rgba(168,85,247,0.3)]'
                                    }`}
                                  >
                                    <Link className="w-2 h-2" />
                                  </motion.div>
                                </BaziTooltip>
                              </div>
                            )}

                            {/* To visually match Daewun box, we pad the top slightly to account for the missing lifeStage text */}
                            <div className="h-[12px] sm:h-[14px]"></div>
                            
                            <div className={`text-[12px] sm:text-[13px] font-bold mb-0.5 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{ap.age}</div>
                            
                            <div className="flex-1 flex flex-col justify-center items-center w-full min-h-0">
                              <div 
                                className={`font-gothic font-bold text-center leading-tight ${lang === 'EN' ? 'text-[10px] sm:text-[11px] md:text-xs mb-0.5' : 'text-[13px] sm:text-[14px]'}`}
                                style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[ap.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                              >
                                <RenderCycleChar char={ap.stem} isStem={true} hideUnderline={true} hideTooltip={true} />
                              </div>
                              <div 
                                className={`font-gothic font-bold text-center leading-tight opacity-90 ${lang === 'EN' ? 'text-[10px] sm:text-[11px] md:text-xs' : 'text-[13px] sm:text-[14px]'}`}
                                style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[ap.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                              >
                                <RenderCycleChar char={ap.branch} isStem={false} hideUnderline={true} hideTooltip={true} />
                              </div>
                            </div>

                            <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full p-0.5 border shadow-sm transition-all z-20 ${
                              theme === 'light'
                                ? 'bg-white border-slate-200 text-slate-400'
                                : 'bg-[#0B0416] border-white/10 text-white/40'
                            }`}>
                              {isYearExpanded 
                                ? <ChevronUp className={`w-2.5 h-2.5 ${theme === 'light' ? 'text-indigo-500' : 'text-neon-cyan'}`} /> 
                                : <ChevronDown className="w-2.5 h-2.5 text-white/20" />
                              }
                            </div>
                          </motion.div>
                        );
                      })()}
                      <div 
                        className="text-[11px] sm:text-[12px] font-bold uppercase tracking-tighter flex items-center justify-center text-center h-[28px] w-full" 
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
                            <div key={mi} id={`bazi-monthly-item-${m.month}`} className="flex flex-col items-center space-y-1 w-24">
                              <div className="text-[13px] font-mono text-white/90 font-bold uppercase">
                                {t.months[m.month - 1]}
                              </div>
                              <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[m.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                                <PolarityIcon polarity={m.stemPolarity} size={6} />
                                {lang === 'KO' ? m.stemTenGodKo : m.stemTenGodEn}
                              </div>
                              {(() => {
                                const cycle = result.grandCycles[expandedCycle];
                                const ap = cycle.annualPillars[expandedYear];
                                const extraContexts: AdditionalContext[] = [
                                    { stem: cycle.stem, branch: cycle.branch, labelKo: `대운`, labelEn: `Daewun` },
                                    { stem: ap.stem, branch: ap.branch, labelKo: `세운`, labelEn: `Sewun` }
                                ];
                                const extraStems = extraContexts.map(c => c.stem);
                                const extraBranches = extraContexts.map(c => c.branch);
                                const stemInts = getCycleInteractions(m.stem, true, extraStems, extraBranches);
                                const branchInts = getCycleInteractions(m.branch, false, extraStems, extraBranches);
                                const hasInteractions = stemInts.length > 0 || branchInts.length > 0;
                                const tooltipContent = hasInteractions ? getPillarInteractionsTooltipContent(m.stem, m.branch, extraContexts) : { ko: '', en: '' };

                                return (
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setExpandedMonth(isMonthExpanded ? null : mi)}
                                    className={`w-full bg-white/5 rounded-lg p-3 flex flex-col items-center border transition-all min-h-[70px] justify-center relative cursor-pointer select-none ${borderClass}`}
                                  >
                                    {hasInteractions && (
                                      <div 
                                        className="absolute -top-1.5 -right-1.5 z-30" 
                                        onClick={(e) => e.stopPropagation()}
                                        onTouchStart={(e) => e.stopPropagation()}
                                      >
                                        <BaziTooltip content={tooltipContent} lang={lang}>
                                          <motion.div 
                                            whileHover={{ scale: 1.25 }}
                                            whileTap={{ scale: 0.9 }}
                                            className={`p-0.5 rounded-full transition-all duration-300 cursor-pointer ${
                                              theme === 'light'
                                                ? 'bg-purple-100 border border-purple-200 text-purple-600 hover:bg-purple-200'
                                                : 'bg-purple-950/50 border border-purple-500/40 text-purple-400 hover:text-purple-300 hover:bg-purple-900/60 shadow-[0_0_6px_rgba(168,85,247,0.3)]'
                                            }`}
                                          >
                                            <Link className="w-2 h-2" />
                                          </motion.div>
                                        </BaziTooltip>
                                      </div>
                                    )}

                                    <div 
                                      className="text-[10px] font-gothic font-bold text-center"
                                      style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[m.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                    >
                                      <RenderCycleChar char={m.stem} isStem={true} hideUnderline={true} hideTooltip={true} />
                                    </div>
                                    <div 
                                      className="text-[10px] font-gothic text-center opacity-70"
                                      style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[m.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                    >
                                      <RenderCycleChar char={m.branch} isStem={false} hideUnderline={true} hideTooltip={true} />
                                    </div>

                                    <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full p-0.5 border shadow-sm transition-all z-20 ${
                                      theme === 'light'
                                        ? 'bg-white border-slate-200 text-slate-400'
                                        : 'bg-[#0B0416] border-white/10 text-white/40'
                                    }`}>
                                      {isMonthExpanded 
                                        ? <ChevronUp className={`w-2.5 h-2.5 ${theme === 'light' ? 'text-pink-500' : 'text-neon-pink'}`} /> 
                                        : <ChevronDown className="w-2.5 h-2.5 text-white/20" />
                                      }
                                    </div>
                                  </motion.div>
                                );
                              })()}
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
                                <div key={di} id={`bazi-daily-item-${d.day}`} className="flex flex-col items-center space-y-1 w-16 flex-shrink-0">
                                  <div className="text-[12px] font-mono text-white/90 font-bold">{d.day}</div>
                                  <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[d.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                                    <PolarityIcon polarity={d.stemPolarity} size={5} />
                                    {lang === 'KO' ? d.stemTenGodKo : d.stemTenGodEn}
                                  </div>
                                  {(() => {
                                    const cycle = result.grandCycles[expandedCycle];
                                    const ap = cycle.annualPillars[expandedYear];
                                    const m = ap.monthlyPillars[expandedMonth];
                                    const extraContexts: AdditionalContext[] = [
                                        { stem: cycle.stem, branch: cycle.branch, labelKo: `대운`, labelEn: `Daewun` },
                                        { stem: ap.stem, branch: ap.branch, labelKo: `세운`, labelEn: `Sewun` },
                                        { stem: m.stem, branch: m.branch, labelKo: `월운`, labelEn: `Monthly` }
                                    ];
                                    const extraStems = extraContexts.map(c => c.stem);
                                    const extraBranches = extraContexts.map(c => c.branch);
                                    const stemInts = getCycleInteractions(d.stem, true, extraStems, extraBranches);
                                    const branchInts = getCycleInteractions(d.branch, false, extraStems, extraBranches);
                                    const hasInteractions = stemInts.length > 0 || branchInts.length > 0;
                                    const tooltipContent = hasInteractions ? getPillarInteractionsTooltipContent(d.stem, d.branch, extraContexts) : { ko: '', en: '' };

                                    return (
                                      <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedDay(isDaySelected ? null : di)}
                                        className={`w-full bg-white/5 rounded-lg p-2 flex flex-col items-center border transition-all relative cursor-pointer select-none ${borderClass}`}
                                      >
                                        {hasInteractions && (
                                          <div 
                                            className="absolute -top-1.5 -right-1.5 z-30" 
                                            onClick={(e) => e.stopPropagation()}
                                            onTouchStart={(e) => e.stopPropagation()}
                                          >
                                            <BaziTooltip content={tooltipContent} lang={lang}>
                                              <motion.div 
                                                whileHover={{ scale: 1.25 }}
                                                whileTap={{ scale: 0.9 }}
                                                className={`p-0.5 rounded-full transition-all duration-300 cursor-pointer ${
                                                  theme === 'light'
                                                    ? 'bg-purple-100 border border-purple-200 text-purple-600 hover:bg-purple-200'
                                                    : 'bg-purple-950/50 border border-purple-500/40 text-purple-400 hover:text-purple-300 hover:bg-purple-900/60 shadow-[0_0_6px_rgba(168,85,247,0.3)]'
                                                }`}
                                              >
                                                <Link className="w-1.5 h-1.5" />
                                              </motion.div>
                                            </BaziTooltip>
                                          </div>
                                        )}

                                        <div 
                                          className="text-[10px] font-gothic font-bold text-center"
                                          style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems?.[d.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                        >
                                          <RenderCycleChar char={d.stem} isStem={true} hideUnderline={true} hideTooltip={true} />
                                        </div>
                                        <div 
                                          className="text-[10px] font-gothic text-center opacity-70"
                                          style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches?.[d.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                        >
                                          <RenderCycleChar char={d.branch} isStem={false} hideUnderline={true} hideTooltip={true} />
                                        </div>
                                      </motion.div>
                                    );
                                  })()}
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
                                      {(() => {
                                        const cat = result.analysis.structureDetail.category;
                                        if (cat === 'Standard') return lang === 'KO' ? '내격' : 'Standard';
                                        if (cat === 'Image') return lang === 'KO' ? '특수격' : 'Special';
                                        if (cat === 'Monarch') return lang === 'KO' ? '전왕격' : 'Monarch';
                                        return lang === 'KO' ? '종격' : 'Adaptive';
                                      })()}
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
                                  {shouldApplyDeungRaSpecial && (
                                    <div className="mt-1 flex flex-col items-center">
                                      <BaziTooltip 
                                        content={{
                                          ko: "을목(乙) 일간이 등라계갑(藤羅繫甲)의 구조를 충족하는 경우, 목 오행이 원래 기신이더라도 갑목(甲)은 기신 작용에서 배제됩니다. 오히려 기댈 거목이 되어 희신 역할을 온전히 수행하며 대운과 세운에서 만나면 아주 유기적으로 발전합니다.",
                                          en: "Under the Deungra-Gyegap dynamics, even if Wood is traditionally a GiShin, Gap-Wood (甲) stays protected from negative effects and instead acts as a helpful energy (HeeShin) in both major and annual cycles."
                                        }}
                                        lang={lang}
                                      >
                                        <span 
                                          className="text-sm font-bold mb-0.5 cursor-help border-b border-dashed border-emerald-500/40 pb-0.5 font-sans"
                                          style={{ color: '#10b981' }}
                                        >
                                          {lang === 'KO' ? '목 - 갑목 (甲)' : 'Wood - Gap (甲)'}
                                        </span>
                                      </BaziTooltip>
                                      <span className="text-[10px] opacity-60 font-sans">({lang === 'KO' ? '등라계갑' : 'DeungRa-GyeGap'})</span>
                                    </div>
                                  )}
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
                                <BaziTooltip 
                                  key={i}
                                  content={{
                                    ko: `<div class="font-bold text-sm text-rose-400 mb-1 font-gothic">${item.title}</div><div class="text-xs leading-relaxed opacity-90">${item.description}</div>`,
                                    en: `<div class="font-bold text-sm text-rose-400 mb-1">${item.title}</div><div class="text-xs leading-relaxed opacity-90">${item.enDescription || item.description}</div>`
                                  }}
                                  lang={lang}
                                >
                                  <div 
                                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border cursor-help transition-all duration-300 ${isLight ? 'bg-rose-50/50 border-rose-250 hover:border-rose-400 hover:bg-rose-50 text-rose-800 shadow-sm' : 'bg-red-900/10 border-red-500/25 hover:border-red-500/50 text-red-200'}`}
                                  >
                                    <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                                    <span className={`text-[10px] font-bold tracking-tight ${isLight ? 'text-red-700' : 'text-red-400'}`}>{item.title}</span>
                                  </div>
                                </BaziTooltip>
                              ))}
                              {result.analysis.daJaRon?.map((item: any, i: number) => (
                                <BaziTooltip
                                  key={i}
                                  content={{
                                    ko: `<div class="font-bold text-sm text-purple-400 mb-1 font-gothic">${item.title}</div><div class="text-xs leading-relaxed opacity-90">${item.description}</div>`,
                                    en: `<div class="font-bold text-sm text-purple-400 mb-1">${item.title}</div><div class="text-xs leading-relaxed opacity-90">${item.enDescription || item.description}</div>`
                                  }}
                                  lang={lang}
                                >
                                  <div 
                                    className={`px-3 py-1.5 rounded-lg flex items-center gap-2 border cursor-help transition-all duration-300 ${isLight ? 'bg-indigo-50/50 border-indigo-250 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-800 shadow-sm' : 'bg-purple-900/10 border-purple-500/25 hover:border-purple-500/50 text-purple-200'}`}
                                  >
                                    <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse" />
                                    <span className={`text-[10px] font-bold tracking-tight ${isLight ? 'text-indigo-700' : 'text-purple-400'}`}>{item.title}</span>
                                  </div>
                                </BaziTooltip>
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
            <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-black/20 rounded-t-2xl gap-3">
              <h3 className="text-[1.1rem] sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-cyan drop-shadow-[0_0_10px_rgba(188,0,255,0.3)] whitespace-nowrap overflow-hidden text-ellipsis">
                {lang === 'KO' ? '사주명리학의 우주적 시선' : 'Cosmic Perspective of BaZi'}
              </h3>
              <button 
                onClick={() => setShowGuideDetailModal(false)}
                className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8 no-scrollbar">

              <div className="space-y-4">
                <h4 id="guide-section-tree" className="text-lg font-bold text-white flex items-center gap-2 scroll-mt-6">
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
                <h4 id="guide-section-jijangan" className={`text-lg font-bold flex items-center gap-2 scroll-mt-6 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm">2</span>
                  {lang === 'KO' ? '땅 속에 감춰진 씨앗: 지장간' : 'Hidden Seeds: Ji-Jang-Gan'}
                </h4>
                <div className={`relative w-full rounded-2xl border p-4 sm:p-6 flex flex-col gap-6 ${isLight ? 'bg-slate-50 border-amber-200/80 shadow-sm' : 'bg-black/50 border-amber-500/20'}`}>
                  
                  {/* Concept Intro */}
                  <div className="flex flex-col gap-4">
                    <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-700 font-medium' : 'text-white/80'}`}>
                      {lang === 'KO' ? 
                        `사람의 마음은 단 하나로 정의할 수 없는 여러 개의 '페르소나(가면)'로 이루어져 있습니다. 사주에서 땅(지지) 속에 감춰진 2~3개의 숨은 성향이 바로 '지장간(地藏干)'입니다. 평소에는 겉으로 드러나지 않지만, 내 무의식의 밑바탕을 지배하는 '진짜 속마음'과 '숨은 잠재력'을 의미합니다.` : 
                        `A human mind is not defined by a single trait but made up of multiple 'personas'. In BaZi, the 2-3 hidden energies concealed within the earth (branches) are called 'Ji-Jang-Gan'. They represent your 'true inner mind' and 'hidden potential' that typically remain unseen but unconsciously influence you.`}
                    </p>

                    <div className={
                      isLight 
                        ? (isDayMasterRooted 
                            ? 'bg-amber-100/40 border-amber-200 rounded-xl p-4 flex flex-col gap-2 border' 
                            : 'bg-slate-100/70 border-slate-200 rounded-xl p-4 flex flex-col gap-2 border')
                        : (isDayMasterRooted 
                            ? 'bg-amber-500/10 border-amber-500/20 shadow-[inset_0_0_15px_rgba(245,158,11,0.05)] border rounded-xl p-4 flex flex-col gap-2' 
                            : 'bg-slate-500/10 border-slate-500/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)] border rounded-xl p-4 flex flex-col gap-2')
                    }>
                      <h5 className={`${isLight ? (isDayMasterRooted ? 'text-amber-800' : 'text-slate-700') : (isDayMasterRooted ? 'text-amber-500' : 'text-slate-400')} font-bold text-xs sm:text-sm flex items-center gap-2`}>
                        ✨ {lang === 'KO' ? '통근(뿌리) 총람' : 'Rooting Overview'}
                      </h5>
                      <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                        {lang === 'KO' ? (
                          isDayMasterRooted ? (
                            <>
                              귀하는 지지에 강력한 뿌리를 두고 있는 <strong className={`font-extrabold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>기반이 튼튼한 사주</strong>입니다.
                            </>
                          ) : (
                            <>
                              귀하는 지지에 뚜렷한 뿌리가 없어 고정된 기성 틀에 얽매이지 않고, 대단히 <strong className={`font-extrabold ${isLight ? 'text-indigo-600' : 'text-[#6DABFF]'}`}>자유롭고 유연하게 대처할 수 있는 기반</strong>을 품은 사주입니다.
                            </>
                          )
                        ) : (
                          isDayMasterRooted ? (
                            <>
                              You possess a <strong className={`font-extrabold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>strongly rooted and stable foundation</strong> in your chart.
                            </>
                          ) : (
                            <>
                              You carry a <strong className={`font-extrabold ${isLight ? 'text-indigo-600' : 'text-[#6DABFF]'}`}>fluid, self-adaptive and versatile layout</strong> that thrives on change rather than rigid forms.
                            </>
                          )
                        )}
                      </p>
                    </div>

                    {/* PIllar differences */}
                    <div className={`border rounded-xl p-4 flex flex-col gap-3 ${isLight ? 'bg-amber-50/40 border-amber-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.01)]' : 'bg-amber-500/10 border-amber-500/20 shadow-[inset_0_0_15px_rgba(245,158,11,0.05)]'}`}>
                      <h5 className={`font-bold text-xs sm:text-sm ${isLight ? 'text-amber-800' : 'text-amber-500'}`}>
                        {lang === 'KO' ? '네 기둥의 지장간은 역할이 다릅니다' : 'The roles of Hidden Stems in Four Pillars'}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs sm:text-sm">
                        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                          <span className={`whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-white/50'}`}>🌱 {lang === 'KO' ? '년지:' : 'Year Branch:'}</span> 
                          <span className={`${isLight ? 'text-slate-700 font-medium' : 'text-white/90'} leading-snug`}>{lang === 'KO' ? '가문으로부터 물려받은 무의식적 기질' : 'Unconscious traits inherited from ancestors'}</span>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                          <span className={`whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-white/50'}`}>🪵 {lang === 'KO' ? '월지:' : 'Month Branch:'}</span> 
                          <span className={`${isLight ? 'text-slate-705 font-medium' : 'text-white/90'} leading-snug`}>{lang === 'KO' ? '사회생활, 직업에서 드러나는 찐 능력' : 'True abilities shown in society and career'}</span>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                          <span className={`whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-white/50'}`}>🌸 {lang === 'KO' ? '일지:' : 'Day Branch:'}</span> 
                          <span className={`${isLight ? 'text-blue-600' : 'text-neon-cyan'} font-bold leading-snug`}>{lang === 'KO' ? '남들은 모르는 나의 은밀한 속마음(본성)' : 'My secret inner mind & true nature'}</span>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-start gap-2">
                          <span className={`whitespace-nowrap ${isLight ? 'text-slate-500' : 'text-white/50'}`}>🍏 {lang === 'KO' ? '시지:' : 'Hour Branch:'}</span> 
                          <span className={`${isLight ? 'text-slate-700 font-medium' : 'text-white/90'} leading-snug`}>{lang === 'KO' ? '내 심연에 숨겨진 마지막 미래의 욕망' : 'Deepest hidden desires and future traits'}</span>
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
                           <span className="leading-snug">{lang === 'KO' ? '본기(Main) 뿌리: 제자리 천간에 직접 직결된 기운. 외부 기둥과 연결될 경우 해당 천간 배지(일간, 시간, 월간, 연간)로 교체되어 발현 범위를 표시합니다.' : 'Main Root: Directly connected core energy. When linked to other pillars, it dynamically shows the specific stem initial (Y, M, D, H).'}</span>
                         </li>
                         <li className="flex items-start gap-2">
                           <span className="text-[10px] sm:text-[11px] p-1 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap mt-0.5">{lang === 'KO' ? '중여' : 'SUB'}</span>
                           <span className="leading-snug">{lang === 'KO' ? '중여(Sub) 뿌리: 상황에 따라 유연하게 꺼내는 보완 기운. 외부 기둥과 연결될 경우 접미사 "중"과 조합(일중, 시중, 월중, 연중)되어 표시됩니다.' : 'Sub Root: A flexible secondary/sub-Qi backup root. When connected to other pillars, it is displayed with the "-SB" suffix (D-SB, H-SB, M-SB, Y-SB).'}</span>
                         </li>
                         <li className="flex items-start gap-2">
                           <span className="text-[10px] sm:text-[11px] p-1 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap mt-0.5">{lang === 'KO' ? '생조' : 'GEN'}</span>
                           <span className="leading-snug">{lang === 'KO' ? '생조(Generative) 지지: 오행 간 상생으로 끊임없이 기운을 공급하는 원조력. 외부 글자와 상생 시에는 접미사 "생"과 조합(일생, 시생, 월생, 연생)되어 표시됩니다.' : 'Generative Support: Energy supplying support through mutual generation. When supporting other pillars, it is displayed with the "-GN" suffix (D-GN, H-GN, M-GN, Y-GN).'}</span>
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
                <h4 id="guide-section-daewun" className="text-lg font-bold text-white flex items-center gap-2 scroll-mt-6">
                  <span className="w-6 h-6 rounded-full bg-neon-purple/20 text-neon-purple flex items-center justify-center text-sm">3</span>
                  {lang === 'KO' ? '시간의 파도: 대운' : 'Life Seasons'}
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
                       <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-500/20 border-2 border-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)] backdrop-blur-md">
                         <span className="text-sm sm:text-lg">🌾</span>
                       </div>
                       <div className="absolute top-[24px] sm:top-[28px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 hidden sm:block whitespace-nowrap">
                         <span className="text-yellow-400 font-bold block text-xs">{lang === 'KO' ? '수확기(가을)' : 'Harvest(Autumn)'}</span>
                         <span className="text-white/50 text-[10px] block leading-tight mt-1">{lang === 'KO' ? '열매를 맺고\n결실을 거둠' : 'Fruits ripen\nand harvest'}</span>
                       </div>
                       <div className="absolute top-[24px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 sm:hidden whitespace-nowrap">
                         <span className="text-yellow-400 font-bold block text-[10px]">{lang === 'KO' ? '가을' : 'Autumn'}</span>
                       </div>
                     </div>

                     {/* 4. Winter (Storage): Valley 2 - 83.3% left, 85% top */}
                     <div className="absolute z-10 transition-transform hover:scale-110" style={{ top: '85%', left: '83.3%' }}>
                       <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] backdrop-blur-md">
                         <span className="text-sm sm:text-lg">❄️</span>
                       </div>
                       <div className="absolute bottom-[24px] sm:bottom-[28px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 hidden sm:block whitespace-nowrap">
                         <span className="text-blue-400 font-bold block text-xs">{lang === 'KO' ? '저장기(겨울)' : 'Storage(Winter)'}</span>
                         <span className="text-white/50 text-[10px] block leading-tight mt-1">{lang === 'KO' ? '만물을 저장하고\n휴식하며 준비함' : 'Storing all\nresting & preparing'}</span>
                       </div>
                       <div className="absolute bottom-[24px] -translate-x-1/2 text-center bg-black/70 px-2 py-1 rounded backdrop-blur-md border border-white/10 sm:hidden whitespace-nowrap">
                         <span className="text-blue-400 font-bold block text-[10px]">{lang === 'KO' ? '겨울' : 'Winter'}</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>



                        {/* 대운과 세운의 작용 가이드 및 동적 해설 */}
                        <div className="space-y-4 mb-8">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-[1px] w-8 bg-neon-purple/50"></div>
                            <h4 className="text-sm font-display font-medium text-neon-purple uppercase tracking-[0.2em]">{lang === 'KO' ? '대운·세운 (Cycle & Se-woon)' : 'Life Cycle & Se-woon'}</h4>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-purple/20 to-transparent"></div>
                          </div>
                          
                          <div className={`p-4 sm:p-5 rounded-xl space-y-4 border leading-relaxed text-sm sm:text-base mb-6 ${isLight ? 'bg-indigo-50/50 border-indigo-100/50 text-slate-700' : 'bg-[#0f0f1b]/80 border-white/10 text-white/90 shadow-[0_0_15px_rgba(188,0,255,0.1)]'}`}>
                            {lang === 'KO' ? (
                              <div className="space-y-4 text-sm leading-relaxed">
                                <p><strong className="text-neon-purple">대운(大運)</strong>은 10년 단위로 흐르는 거대한 계절입니다. 삶의 거시적 환경과 방향을 결정하는 밑바탕으로, 원국에 미치는 영향의 깊이와 지속성이 가장 강력합니다.</p>
                                <p><strong className="text-neon-pink">세운(歲運)</strong>은 1년 단위로 찾아오는 날씨입니다. 대운이라는 환경 위에서 실제 사건을 촉발하는 열쇠로, 체감되는 구체적 변화는 세운을 통해 드러납니다.</p>
                                <p><strong>천간</strong>은 드러나는 방향과 명분, <strong>지지</strong>는 실질적인 힘과 뿌리입니다.</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                  <div className={`p-3 rounded-lg border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/40 border-white/5'}`}>
                                    <div className="font-bold mb-2 text-neon-cyan flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neon-cyan/50"></span>대운 천간 & 지지</div>
                                    <ul className="list-disc pl-5 space-y-1.5 text-[13px] opacity-90">
                                      <li><strong>천간:</strong> 10년간 추구할 방향·명분</li>
                                      <li><strong>지지:</strong> 삶의 기반을 바꾸는 실질 에너지</li>
                                    </ul>
                                  </div>
                                  <div className={`p-3 rounded-lg border ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-black/40 border-white/5'}`}>
                                    <div className="font-bold mb-2 text-neon-pink flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neon-pink/50"></span>세운 천간 & 지지</div>
                                    <ul className="list-disc pl-5 space-y-1.5 text-[13px] opacity-90">
                                      <li><strong>천간:</strong> 사건의 인과·계기</li>
                                      <li><strong>지지:</strong> 사건의 결과·실체</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className={`text-xs p-3 rounded-lg font-medium text-center border mt-2 ${isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-white/50'}`}>
                                  힘의 크기 순서: 대운 지지 <span className="opacity-50">→</span> 대운 천간 <span className="opacity-50">→</span> 세운 지지 <span className="opacity-50">→</span> 세운 천간
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4 text-sm leading-relaxed">
                                <p><strong className="text-neon-purple">Grand Cycle (Life Season)</strong> acts as the macro environment lasting 10 years, exerting the most profound and sustained influence on your destiny chart.</p>
                                <p><strong className="text-neon-pink">Annual Cycle (Se-Un)</strong> is the specific 'weather' of the year, triggering concrete events within your current life season.</p>
                                <p><strong>Stems</strong> represent the apparent direction and rationale, while <strong>Branches</strong> manifest practical impact and foundation.</p>
                              </div>
                            )}
                          </div>
                          
                          {/* 동적 해설: 대운/세운 천간/지지 십성 해설 */}
                          {currentAnnualPillar && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                              {[
                                { pos: '대운천간', char: currentCycle.stem, tenGodKo: currentCycle.stemTenGodKo, tenGodEn: currentCycle.stemTenGodEn, type: '대운', descKo: '10년간 추구할 방향·명분', descEn: 'Direction & Purpose for 10 years', color: 'text-neon-cyan', bg: isLight ? 'bg-cyan-50/50 border-cyan-100 shadow-sm' : 'bg-cyan-900/10 border-cyan-500/20 shadow-[0_0_10px_rgba(0,242,255,0.05)]' },
                                { pos: '대운지지', char: currentCycle.branch, tenGodKo: currentCycle.branchTenGodKo, tenGodEn: currentCycle.branchTenGodEn, type: '대운', descKo: '삶의 기반을 바꾸는 실질 에너지', descEn: 'Practical energy shifting life foundation', color: 'text-neon-cyan', bg: isLight ? 'bg-cyan-50/50 border-cyan-100 shadow-sm' : 'bg-cyan-900/10 border-cyan-500/20 shadow-[0_0_10px_rgba(0,242,255,0.05)]' },
                                { pos: '세운천간', char: currentAnnualPillar.stem, tenGodKo: currentAnnualPillar.stemTenGodKo, tenGodEn: currentAnnualPillar.stemTenGodEn, type: '세운', descKo: '올해 사건의 인과·계기', descEn: 'Cause & Trigger of this year', color: 'text-neon-pink', bg: isLight ? 'bg-pink-50/50 border-pink-100 shadow-sm' : 'bg-pink-900/10 border-pink-500/20 shadow-[0_0_10px_rgba(255,0,128,0.05)]' },
                                { pos: '세운지지', char: currentAnnualPillar.branch, tenGodKo: currentAnnualPillar.branchTenGodKo, tenGodEn: currentAnnualPillar.branchTenGodEn, type: '세운', descKo: '올해 사건의 결과·실체', descEn: 'Result & Reality of this year', color: 'text-neon-pink', bg: isLight ? 'bg-pink-50/50 border-pink-100 shadow-sm' : 'bg-pink-900/10 border-pink-500/20 shadow-[0_0_10px_rgba(255,0,128,0.05)]' }
                              ].map((item, idx) => {
                                 // Get text from TEN_GOD_DESCRIPTIONS
                                 const tenGodClean = item.tenGodKo.replace(/편인|정인|편관|정관|편재|정재|비견|겁재|식신|상관/, (match) => match).substring(0, 2); 
                                 
                                 const textObjRaw = (TEN_GOD_DESCRIPTIONS[dayMaster]?.[item.pos]?.[tenGodClean] 
                                      || TEN_GOD_DESCRIPTIONS['공통']?.[item.pos]?.[tenGodClean] 
                                      || { ko: "해설 준비 중입니다.", en: "Description coming soon." });
                                      
                                 const displayDesc = typeof textObjRaw === 'string' ? textObjRaw : (lang === 'KO' ? textObjRaw.ko : (textObjRaw.en || textObjRaw.ko));
                                 const posLabel = lang === 'KO' ? item.pos : (item.pos.includes('대운') ? (item.pos.includes('천간') ? 'Cycle Stem' : 'Cycle Branch') : (item.pos.includes('천간') ? 'Annual Stem' : 'Annual Branch'));
                                 
                                 return (
                                    <div key={idx} className={`p-4 sm:p-5 rounded-xl border ${item.bg}`}>
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${isLight ? 'bg-white shadow' : 'bg-black/50 text-white/90'}`}>
                                          {posLabel}
                                        </span>
                                        <span className={`font-bold text-base ${item.color}`}>
                                            {item.char} ({lang === 'KO' ? item.tenGodKo : item.tenGodEn})
                                        </span>
                                      </div>
                                      <div className={`text-[12px] font-medium opacity-70 mb-3`}>
                                        — {lang === 'KO' ? item.descKo : item.descEn}
                                      </div>
                                      <div className={`text-sm sm:text-[15px] leading-relaxed break-keep ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                                        {displayDesc}
                                      </div>
                                    </div>
                                 );
                              })}
                            </div>
                          )}
                        </div>

                        
               {/* Sub-section 1: Branch Interactivity */}
                {(() => {
                  const baziBranchData: Record<string, { hanja: string; en: string; colorLight: string; colorDark: string; elementKo: string; elementEn: string }> = {
                    '자': { hanja: '子', en: 'Ja', colorLight: 'text-sky-600 font-extrabold', colorDark: 'text-[#00bfff] font-extrabold', elementKo: '수(Water)', elementEn: 'Water' },
                    '축': { hanja: '丑', en: 'Chuk', colorLight: 'text-amber-700 font-extrabold', colorDark: 'text-[#f5b800] font-extrabold', elementKo: '토(Earth)', elementEn: 'Earth' },
                    '인': { hanja: '寅', en: 'In', colorLight: 'text-emerald-600 font-extrabold', colorDark: 'text-[#00ea5e] font-extrabold', elementKo: '목(Wood)', elementEn: 'Wood' },
                    '묘': { hanja: '卯', en: 'Myo', colorLight: 'text-emerald-600 font-extrabold', colorDark: 'text-[#00ea5e] font-extrabold', elementKo: '목(Wood)', elementEn: 'Wood' },
                    '진': { hanja: '辰', en: 'Jin', colorLight: 'text-amber-700 font-extrabold', colorDark: 'text-[#f5b800] font-extrabold', elementKo: '토(Earth)', elementEn: 'Earth' },
                    '사': { hanja: '巳', en: 'Sa', colorLight: 'text-rose-600 font-extrabold', colorDark: 'text-[#ff4747] font-extrabold', elementKo: '화(Fire)', elementEn: 'Fire' },
                    '오': { hanja: '午', en: 'Oh', colorLight: 'text-rose-600 font-extrabold', colorDark: 'text-[#ff4747] font-extrabold', elementKo: '화(Fire)', elementEn: 'Fire' },
                    '미': { hanja: '未', en: 'Mi', colorLight: 'text-amber-700 font-extrabold', colorDark: 'text-[#f5b800] font-extrabold', elementKo: '토(Earth)', elementEn: 'Earth' },
                    '신': { hanja: '申', en: 'Sin', colorLight: 'text-slate-500 font-extrabold', colorDark: 'text-[#d8d8d8] font-extrabold', elementKo: '금(Metal)', elementEn: 'Metal' },
                    '유': { hanja: '酉', en: 'Yu', colorLight: 'text-slate-500 font-extrabold', colorDark: 'text-[#d8d8d8] font-extrabold', elementKo: '금(Metal)', elementEn: 'Metal' },
                    '술': { hanja: '戌', en: 'Sul', colorLight: 'text-amber-700 font-extrabold', colorDark: 'text-[#f5b800] font-extrabold', elementKo: '토(Earth)', elementEn: 'Earth' },
                    '해': { hanja: '亥', en: 'Hae', colorLight: 'text-sky-600 font-extrabold', colorDark: 'text-[#00bfff] font-extrabold', elementKo: '수(Water)', elementEn: 'Water' },
                  };

                  const renderFormattedBranches = (inputText: string, lang: string, isLight: boolean) => {
                    const parts = inputText.split('/');
                    return parts.map((part, partIdx) => {
                      const trimmed = part.trim();
                      if (!trimmed) return null;

                      const matches = trimmed.match(/^([가-힣\s]+)\(([^)]+)\)$/);
                      let element: React.ReactNode;

                      if (matches) {
                        const koStr = matches[1].replace(/\s+/g, '');
                        const hanjaStr = matches[2].replace(/\s+/g, '');

                        const koSpans: React.ReactNode[] = [];
                        const hanjaSpans: React.ReactNode[] = [];

                        for (let i = 0; i < koStr.length; i++) {
                          const char = koStr[i];
                          const data = baziBranchData[char];
                          const color = data ? (isLight ? data.colorLight : data.colorDark) : '';

                          if (lang === 'KO') {
                            koSpans.push(
                              <span key={`ko-${i}`} className={color}>
                                {char}
                              </span>
                            );
                          } else {
                            const enStr = data ? data.en : char;
                            koSpans.push(
                              <span key={`en-${i}`} className={color}>
                                {enStr}
                              </span>
                            );
                            if (i < koStr.length - 1) {
                              koSpans.push(
                                <span key={`hyphen-${i}`} className={isLight ? 'text-slate-400 mx-0.5 font-normal' : 'text-white/40 mx-0.5 font-normal'}>
                                  -
                                </span>
                              );
                            }
                          }

                          const hanjaChar = hanjaStr[i] || '';
                          hanjaSpans.push(
                            <span key={`hanja-${i}`} className={color}>
                              {hanjaChar}
                            </span>
                          );
                        }

                        element = (
                          <span className="inline-flex items-center whitespace-nowrap flex-nowrap">
                            {koSpans}
                            <span className={isLight ? 'text-slate-400 ml-0.5 font-normal' : 'text-white/40 ml-0.5 font-normal'}>(</span>
                            {hanjaSpans}
                            <span className={isLight ? 'text-slate-400 font-normal' : 'text-white/40 font-normal'}>)</span>
                          </span>
                        );
                      } else {
                        // For items without parenthesis or with plain slash format
                        const textSpans: React.ReactNode[] = [];
                        for (let i = 0; i < trimmed.length; i++) {
                          const char = trimmed[i];
                          const data = baziBranchData[char];
                          const color = data ? (isLight ? data.colorLight : data.colorDark) : '';
                          if (data) {
                            if (lang === 'KO') {
                              textSpans.push(<span key={i} className={color}>{char}</span>);
                            } else {
                              textSpans.push(
                                <span key={i} className={color}>
                                  {data.en}
                                </span>
                              );
                              if (i < trimmed.length - 1 && baziBranchData[trimmed[i + 1]]) {
                                textSpans.push(<span key={`hyphen-${i}`} className="opacity-40">-</span>);
                              }
                            }
                          } else {
                            textSpans.push(<span key={i}>{char}</span>);
                          }
                        }
                        element = <span className="inline-flex items-center whitespace-nowrap flex-nowrap">{textSpans}</span>;
                      }

                      return (
                        <React.Fragment key={partIdx}>
                          {partIdx > 0 && (
                            <span className={isLight ? 'text-slate-400 mx-1.5' : 'text-white/30 mx-1.5'}>
                              /
                            </span>
                          )}
                          {element}
                        </React.Fragment>
                      );
                    });
                  };

                  const relationCategories = {
                    samhap: {
                      titleKo: '삼합 (三合) - 사회적 목적과 비전',
                      titleEn: 'Sam-hap: Business & Common Goal',
                      icon: '🪐',
                      borderClass: 'border-neon-purple/30',
                      bgClass: 'bg-indigo-50/40 border-indigo-100 dark:border-neon-purple/20',
                      badgeClass: 'text-indigo-800 bg-indigo-100/50',
                      badgeDarkClass: 'text-neon-purple bg-neon-purple/5',
                      descKo: '서로 완전히 다른 오행 세 글자가 특정한 "사회적 합작 및 공통 목표(비즈니스, 학문, 정신)"를 두고 똘똘 뭉쳐 하나의 거대한 성향을 이끌어내는 결합입니다.',
                      descEn: 'Three distinct branches unite with shared professional/metaphysical purpose, forming powerful elemental fields.',
                      items: [
                        {
                          branches: '해묘미(亥卯未)',
                          resultKo: '목(Wood)국 형성',
                          resultEn: 'Wood Realm',
                          colorKo: 'text-emerald-750',
                          colorEn: 'text-[#00ea5e]',
                          detailKo: '해수(지혜와 자원)와 묘목(중심세력), 미토(완성 및 보관)가 합쳐져 강력한 시작과 추진력, 성장의 나무 기운을 창조해냅니다. 기획력과 창의성, 새로운 아이디어 개척에 최고의 시너지를 냅니다.',
                          detailEn: 'Hae (Water-resource), Myo (Wood-core), and Mi (Earth-storage) unite to create powerful vertical growth. Brings creativity, vision-sharing, and pioneering academic/professional ventures.'
                        },
                        {
                          branches: '인오술(寅午戌)',
                          resultKo: '화(Fire)국 형성',
                          resultEn: 'Fire Realm',
                          colorKo: 'text-rose-750',
                          colorEn: 'text-[#f87171]',
                          detailKo: '인목(시작과 동력)과 오화(정상과 중심), 술토(회수 및 저장)가 결집하여 찬란하고 폭발적인 불의 기운을 발산합니다. 예술, 미디어, 브랜딩, 사람들의 마음에 큰 파급력을 행사하는 영역에서 발군의 능력을 발휘합니다.',
                          detailEn: 'In (Wood-start), Oh (Fire-peak), and Sul (Earth-end) unite to generate brilliant radiant heat. Ideal for public relations, entertainment, expressive arts, and high-influence leadership.'
                        },
                        {
                          branches: '사유축(巳酉丑)',
                          resultKo: '금(Metal)국 형성',
                          resultEn: 'Metal Realm',
                          colorKo: 'text-slate-600',
                          colorEn: 'text-[#d8d8d8]',
                          detailKo: '사화(전환과 발열)와 유금(순수 보석과 구조), 축토(안정과 마감)가 응축하여 예리하고 단단한 금속 기운을 만듭니다. 법률, 금융, 정밀 과학, 조직 설계 등 체계적인 규칙과 고성능 정교함을 상징합니다.',
                          detailEn: 'Sa (Fire-catalyst), Yu (Metal-gem), and Chuk (Earth-lock) condense into super-dense focus. Best for legal planning, financial calculation, high-precision engineering, and systemic execution.'
                        },
                        {
                          branches: '신자진(申子辰)',
                          resultKo: '수(Water)국 형성',
                          resultEn: 'Water Realm',
                          colorKo: 'text-sky-705',
                          colorEn: 'text-[#00bfff]',
                          detailKo: '신금(근원과 정수)과 자수(심연과 중심), 진토(통제 및 저장)가 넓게 수렴하여 깊고 한계 없는 수의 지혜와 흐름을 만듭니다. 물류, 무역, 학문, 사색, 시장 유통망 형성 같이 국경과 장벽을 뛰어넘는 교류를 뜻합니다.',
                          detailEn: 'Sin (Metal-wellhead), Ja (Water-deep), and Jin (Earth-delta) flow together into broad currents of wisdom. Fosters international trade, deep research, dynamic distribution networks, and intelligence.'
                        }
                      ]
                    },
                    banghap: {
                      titleKo: '방합 (方合) - 계절적 동맹 / 가족적 세력',
                      titleEn: 'Bang-hap: Family & Seasonal Gravity',
                      icon: '🌲',
                      borderClass: 'border-[#00ea5e]/30',
                      bgClass: 'bg-green-50/40 border-green-105 dark:border-green-500/20',
                      badgeClass: 'text-emerald-800 bg-green-100/50',
                      badgeDarkClass: 'text-[#00ea5e] bg-green-500/5',
                      descKo: '같은 계절과 방위(봄·여름·가을·겨울)를 온전히 차지한 혈연, 고향, 가문, 혹은 기득권적인 강력한 연대감입니다. 기운의 크기로는 명리학상 가장 막강합니다.',
                      descEn: 'Alliances representing coordinates of the same season. Uniquely stable block resembling regional, familial, or massive organizational gravity.',
                      items: [
                        {
                          branches: '인묘진(寅卯辰)',
                          resultKo: '동방 목국 (봄)',
                          resultEn: 'Wood (Spring / East)',
                          colorKo: 'text-emerald-750',
                          colorEn: 'text-[#00ea5e]',
                          detailKo: '봄철과 동방을 관장하는 인묘진이 모여 자연스러운 생명력의 연대를 구축합니다. 교육, 자선, 기여, 봄날 아지랑이 같은 순수한 생기 투사력을 나타냅니다.',
                          detailEn: 'Wood elemental fortress dominant in Spring and Eastern direction. Represents community growth, education, nurturing, and pure lifeforce drive.'
                        },
                        {
                          branches: '사오미(巳午未)',
                          resultKo: '남방 화국 (여름)',
                          resultEn: 'Fire (Summer / South)',
                          colorKo: 'text-rose-750',
                          colorEn: 'text-[#f87171]',
                          detailKo: '여름철과 남방을 달구는 사오미가 모여 뜨겁고 강력한 외향적 발산력을 이룹니다. 축제, 마케팅, 광활한 표현 영역에서 활기를 최대화합니다.',
                          detailEn: 'Fire elemental fortress dominant in Summer and Southern direction. Shows highly expressive, energetic outreach, marketing expansion, and passion.'
                        },
                        {
                          branches: '신유술(申酉戌)',
                          resultKo: '서방 금국 (가을)',
                          resultEn: 'Metal (Autumn / West)',
                          colorKo: 'text-slate-600',
                          colorEn: 'text-[#d8d8d8]',
                          detailKo: '가을철과 서방을 이끄는 신유술이 모여 단호하고 알찬 결실의 연대를 이룹니다. 단단한 조직력, 군경, 정제된 실리 및 계약 중심의 세력을 의미합니다.',
                          detailEn: 'Metal elemental fortress dominant in Autumn and Western direction. Portrays sharp structural discipline, security operations, contracts, and harvesting practical results.'
                        },
                        {
                          branches: '해자축(亥子丑)',
                          resultKo: '북방 수국 (겨울)',
                          resultEn: 'Water (Winter / North)',
                          colorKo: 'text-sky-705',
                          colorEn: 'text-[#00bfff]',
                          detailKo: '겨울철과 북방을 덮는 해자축이 모여 침잠하고 꼼꼼한 응축의 연대를 갖춥니다. 철학, 연구, 내실형 자본 축적, 보이지 않는 곳에서 작용하는 영향력을 의미합니다.',
                          detailEn: 'Water elemental fortress dominant in Winter and Northern direction. Signifies deep philosophical intuition, research-dominated work, and covert financial/strategic planning.'
                        }
                      ]
                    },
                    yukhap: {
                      titleKo: '육합 (六合) - 개인적 끌림 / 애정',
                      titleEn: 'Yuk-hap: Close & Secret Affinity',
                      icon: '💞',
                      borderClass: 'border-neon-cyan/30',
                      bgClass: 'bg-cyan-50/40 border-cyan-105 dark:border-neon-cyan/20',
                      badgeClass: 'text-cyan-800 bg-cyan-100/50',
                      badgeDarkClass: 'text-neon-cyan bg-neon-cyan/5',
                      descKo: '열두 지지가 1:1로 비밀스럽게 짝을 지어 자석처럼 꼭 달라붙는 끌림입니다. 사적 비밀 연애나 소중하고 내밀한 오행의 협력을 의미합니다.',
                      descEn: 'A personal 1:1 partnership formed by direct magnetic attraction, representing private affection or supportive micro-alliances.',
                      items: [
                        {
                          branches: '자축(子丑)',
                          resultKo: '토/수 합',
                          resultEn: 'Earth/Water Union',
                          colorKo: 'text-indigo-750',
                          colorEn: 'text-indigo-400',
                          detailKo: '밤과 겨울의 가장 깊은 지점에서의 결합으로, 내밀한 자금 거래나 깊은 신뢰 등 한눈에 드러나지 않는 아주 친밀한 동맹을 뜻합니다.',
                          detailEn: 'Combination at the deepest midnight points. Suggests deep private contracts, confidential fund pools, or profound personal trusts.'
                        },
                        {
                          branches: '인해(寅亥)',
                          resultKo: '목 합',
                          resultEn: 'Wood Union',
                          colorKo: 'text-emerald-750',
                          colorEn: 'text-[#00ea5e]',
                          detailKo: '차갑고 넘실대는 바다(해)가 어린 생명의 나무(인)에 유기적으로 기운을 적셔주어, 생기가 새로 피어나는 따뜻한 끌림과 상부상조의 뜻을 갖습니다.',
                          detailEn: 'Generates Wood energy as Hae (Water) nurtures In (Wood). Represents life-producing empathy, academic support, and productive synergy.'
                        },
                        {
                          branches: '묘술(卯戌)',
                          resultKo: '화 합',
                          resultEn: 'Fire Union',
                          colorKo: 'text-rose-750',
                          colorEn: 'text-[#f87171]',
                          detailKo: '봄 풀잎(묘)이 메마른 가을 영토(술)에 안겨 따스하게 보호막을 친 뒤 화(Fire) 기운으로 피어오르는 모양새로, 서로 이질적인 환경을 극복하는 강렬한 정을 의미합니다.',
                          detailEn: 'Grass (Myo) seeking safe shelter in Earth soil (Sul) to blossom with Fire. Fosters strong emotional bond despite contrasting backgrounds.'
                        },
                        {
                          branches: '진유(辰酉)',
                          resultKo: '금 합',
                          resultEn: 'Metal Union',
                          colorKo: 'text-slate-650',
                          colorEn: 'text-[#d8d8d8]',
                          detailKo: '비옥하고 습한 대지(진)가 귀한 금속과 보석(유)을 영양 공급하듯 든든히 지원하여 강력한 단단함을 얻어내며, 확실하게 실속을 차리는 굳건한 약속을 나타냅니다.',
                          detailEn: 'Fertile moist earth (Jin) wrapping precious metal gems (Yu). Assures premium commercial deals and sturdy material agreements.'
                        },
                        {
                          branches: '사신(巳申)',
                          resultKo: '수/금 합',
                          resultEn: 'Water/Metal Union',
                          colorKo: 'text-amber-750',
                          colorEn: 'text-amber-400',
                          detailKo: '뜨거운 빛(사)과 차가운 철강(신)이 부딪혀 녹아내리며 물로 수렴되거나 결합하는 과정입니다. 애증이 공존하며 복잡한 법적 타협이나 고난도 연대합의 과정을 겪습니다.',
                          detailEn: 'Complex blend of clash, punishment, and eventual fluid union. Best for resolving delicate administrative negotiations and deep technical contracts.'
                        },
                        {
                          branches: '오미(午未)',
                          resultKo: '화/토 합',
                          resultEn: 'Fire/Earth Union',
                          colorKo: 'text-amber-755',
                          colorEn: 'text-amber-400',
                          detailKo: '가장 강렬한 대낮의 화염(오)과 가득 머금은 열풍의 건조한 흙(미)이 하나로 녹아나는 결합으로, 타오르는 공동의 이상과 높은 자존심, 사적인 열렬성을 의미합니다.',
                          detailEn: 'Midday sun (Oh) and baking warm soil (Mi) dissolving into a dry heat fields. Promotes strong spiritual bonds, mutual defense, and shared core values.'
                        }
                      ]
                    },
                    clash: {
                      titleKo: '충 (冲) - 격렬한 확장 / 역동적인 Reset',
                      titleEn: 'Clash (冲) - Dynamic Reset & Extension',
                      icon: '💥',
                      borderClass: 'border-red-500/30',
                      bgClass: 'bg-rose-50/70 border-rose-205 dark:border-red-500/20',
                      badgeClass: 'text-rose-705 bg-rose-100/55',
                      badgeDarkClass: 'text-rose-400 bg-rose-500/5',
                      descKo: '반대 방향의 기류가 정면 충돌하여 극단적인 이동, 돌발적 깨어남, 혹은 이사/이직 마인드를 폭발시킵니다. 정체된 에너지를 돌리는 일생일대의 파격적인 원동력입니다.',
                      descEn: 'Forces crashing from opposite directions, stimulating immediate movement, abrupt growth, or dynamic re-evaluation.',
                      items: [
                        {
                          branches: '자오(子午)',
                          resultKo: '수화충돌 (정서와 이성의 격돌)',
                          resultEn: 'Water-Fire Clash',
                          colorKo: 'text-rose-750',
                          colorEn: 'text-rose-400',
                          detailKo: '가장 어두운 자수와 가장 밝은 오화가 격돌해 심리적 동요, 환경 리셋, 급변하는 이동을 만듭니다. 신체적 심장/신장 조절 신경과 영감의 충돌이기도 합니다.',
                          detailEn: 'Midnight Water facing Midday Fire. Causes high emotional fluctuation, mental awakening, sudden movement, or deep relocations. Takes care of cardiovascular systems.'
                        },
                        {
                          branches: '사해(巳亥)',
                          resultKo: '수화충돌 (글로벌 이동과 정보 교환)',
                          resultEn: 'Fire-Water Global Clash',
                          colorKo: 'text-sky-705',
                          colorEn: 'text-[#00bfff]',
                          detailKo: '하늘을 가르는 빛(사)과 온 바다의 물길(해)이 만나서 빚는 세계적인 역마살입니다. 비행기 선박을 이용한 해외 출장, 기술 특화 연동, 격정적인 시야 변화를 유래합니다.',
                          detailEn: 'Solar thermal light rays meeting deep global oceanic stream. Sparks high-frequency flight travels, foreign network upgrades, and technological changes.'
                        },
                        {
                          branches: '인신(寅申)',
                          resultKo: '금목충돌 (행동과 이동의 정면격돌)',
                          resultEn: 'Wood-Metal Clash',
                          colorKo: 'text-emerald-750',
                          colorEn: 'text-emerald-450',
                          detailKo: '달리기 시작하려는 역마(인)와 이를 가로막는 무거운 철갑차(신)가 만납니다. 급격한 역마살 변동, 해외 교류 추진, 교통이나 신체 동력의 대수선, 돌격 성향을 나타냅니다.',
                          detailEn: 'Rising Wood (In) hitting dense Metal wagon (Sin). Fosters extreme geographical travel, vehicle switches, swift career turns, or muscular/spine care.'
                        },
                        {
                          branches: '묘유(卯酉)',
                          resultKo: '금목충돌 (섬세한 분리 및 갈등)',
                          resultEn: 'Wood-Metal Sharp Clash',
                          colorKo: 'text-slate-650',
                          colorEn: 'text-slate-400',
                          detailKo: '부드러운 화초나 신경선(묘)에 날카로운 칼(유)을 대고 수술하거나 다듬는 상태입니다. 인간관계 결별이나 세련된 전문 수술, 미용, 신경계통의 정교한 탈바꿈을 띱니다.',
                          detailEn: 'Soft twigs (Myo) vs razor blades (Yu). Represents surgical intervention, crisp separations in close unions, neurological updates, or precision craftsmanship.'
                        },
                        {
                          branches: '진술(辰戌)',
                          resultKo: '토토충돌 (정신 세계와 창고의 대격변)',
                          resultEn: 'Earth-Earth Clash (The Underworlds)',
                          colorKo: 'text-amber-750',
                          colorEn: 'text-amber-400',
                          detailKo: '저승과 하늘의 관문인 진과 술이 만나 깊은 심리적 영역이나 천문, 종교, 철학, 깊이 갈고닦은 사색, 문서화된 영토의 대규모 개방과 수정을 낳습니다.',
                          detailEn: 'Confrontation of mystical reservoirs (Jin as water storage vs Sul as fire storage). Promotes metaphysical breakthroughs, large document redesigns, or spiritual renewals.'
                        },
                        {
                          branches: '축미(丑未)',
                          resultKo: '토토충돌 (자산 및 내부 조율)',
                          resultEn: 'Earth-Earth Clash',
                          colorKo: 'text-amber-750',
                          colorEn: 'text-amber-400',
                          detailKo: '얼어붙은 겨울 흙(축)과 뜨거운 여름 흙(미)이 부딪혀 속의 금고들을 여는 양상입니다. 금전, 부동산, 가문 이권, 상속 등 물질적 기반의 리모델링을 의미합니다.',
                          detailEn: 'Wet frozen earth contrasting baked hot soil. Triggers asset reallocation, estate modifications, deep vault opening, or structural reassessments.'
                        }
                      ]
                    },
                    punish: {
                      titleKo: '형 (刑) - 제어와 정교한 조율',
                      titleEn: 'Punishment (刑) - Precision Correction',
                      icon: '⛓️',
                      borderClass: 'border-amber-500/30',
                      bgClass: 'bg-amber-50/70 border-amber-205 dark:border-amber-500/20',
                      badgeClass: 'text-amber-805 bg-amber-100/55',
                      badgeDarkClass: 'text-amber-400 bg-amber-500/5',
                      descKo: '서로 마찰하며 쓸모없는 뼈대를 깎아내거나 칼을 대어 가공하는 에너지입니다. 꼼꼼한 마찰을 겪으며 의료, 법무, 세무, 세밀 가공 등 최고의 극기형 전문성으로 거듭납니다.',
                      descEn: 'A carving friction that forces systematic adjustments, refinement of systems, or professional authority like legal/medical/computational arts.',
                      items: [
                        {
                          branches: '인사신(寅巳申)',
                          resultKo: '지세지형 (조직의 과속 제어)',
                          resultEn: 'Regulatory speed-control of system',
                          colorKo: 'text-red-750',
                          colorEn: 'text-red-400',
                          detailKo: '날렵한 세 역마가 모여 최고 속도로 달리다가 정밀 충돌 조율을 겪는 상황입니다. 강한 추진력을 바탕으로 군경검, 대형 엔지니어링, 복잡한 사법적/의료적 집행 능력을 이끌어냅니다.',
                          detailEn: 'Three speedways interacting at full gallop. Empowers supreme authority in legal structures, critical surgical commands, or complex system integrations.'
                        },
                        {
                          branches: '축술미(丑戌未)',
                          resultKo: '무은지형 (자산/이권 조절 갈등)',
                          resultEn: 'Resource Allocation friction',
                          colorKo: 'text-amber-750',
                          colorEn: 'text-amber-400',
                          detailKo: '대지의 보물 상자 세 개가 모여 흙먼지를 피우며 내부 규칙을 고치는 양상입니다. 금전 분쟁, 지분 조절, 정교한 공적 감사, 세무 조사, 부동산 리빌딩의 전조입니다.',
                          detailEn: 'Three giant earth vaults restructuring. Directs detailed audits, financial compromise, land division, and rigorous organizational realignment.'
                        },
                        {
                          branches: '자묘(子卯)',
                          resultKo: '무례지형 (인적 예의와 감정 마찰)',
                          resultEn: 'Interpersonal & courtesy friction',
                          colorKo: 'text-rose-750',
                          colorEn: 'text-rose-450',
                          detailKo: '맑고 차가운 이슬(자)이 화초(묘)에 지나치게 쏟아져 짓무르는 갈등입니다. 남녀나 가족간의 서운함, 소통의 예의 결여, 산부인과/비뇨기 정밀 수술, 혹은 계약 마찰을 제어합니다.',
                          detailEn: 'Excess dew causing minor branch rot. Challenges social relationships to implement high courtesy, emotional intelligence, skin/urological medicine, or fine adjustments.'
                        },
                        {
                          branches: '진진 / 오오 / 유유 / 해해',
                          resultKo: '자형 (과잉과 고집해결 및 성찰)',
                          resultEn: 'Self-Correction of Excess',
                          colorKo: 'text-indigo-750',
                          colorEn: 'text-indigo-400',
                          detailKo: '똑같은 넘치는 기운이 겹쳐 스스로 고심하며 오답 노트를 적는 격입니다. 지나친 완벽주의나 고집을 꺾고 자기 성찰을 거치면 최고의 독자적 대가로 발돋움합니다.',
                          detailEn: 'Doubled energy fields leading to inner reflections. Fosters extreme professional focus and artistic perfectionism through personal audit cycles.'
                        }
                      ]
                    },
                    destroy: {
                      titleKo: '파 (破) - 국소 미세균열',
                      titleEn: 'Destruction (破) - Local Fissures',
                      icon: '🔨',
                      borderClass: 'border-yellow-600/30',
                      bgClass: 'bg-yellow-50/50 border-yellow-250 dark:border-yellow-600/20',
                      badgeClass: 'text-yellow-805 bg-yellow-101',
                      badgeDarkClass: 'text-yellow-500 bg-yellow-500/5',
                      descKo: '어떤 틀이나 진행중인 사안 중 불필요한 일부 부품을 "깨뜨려 보수하는" 미세조정입니다. 리모델링, 기획 단계의 기민한 수정 등을 유인합니다.',
                      descEn: 'Local fissures introducing small micro-adjustments or component replacements. Perfect for fine polishing and repair stages.',
                      items: [
                        {
                          branches: '자유(子酉)',
                          resultKo: '정밀보완 (가습 및 보정 조율)',
                          resultEn: 'Fluid Adjustment',
                          colorKo: 'text-sky-705',
                          colorEn: 'text-sky-400',
                          detailKo: '귀한 금속(유)을 수(자)로 씻겨내는 도중 금이 가거나 너무 매끄러워 미끄러지는 형국입니다. 미세한 가습, 수술, 기획안의 잔부분 교체를 요합니다.',
                          detailEn: 'Water and Metal slipping on subtle friction. Demands minor revision of drafts, surgical polish, or chemical adjustments.'
                        },
                        {
                          branches: '축진(丑辰)',
                          resultKo: '습토 결의 조율 및 윤택화',
                          resultEn: 'Mud Wall Fissures',
                          colorKo: 'text-amber-750',
                          colorEn: 'text-amber-400',
                          detailKo: '질퍽한 봄 흙(진)과 동토(축)가 비벼지며 미세하게 둑이 가라앉는 격입니다. 기초 대사 조절이나 오래된 부품 갈아끼우기를 진행하는 데 쓰입니다.',
                          detailEn: 'Two wet soft soils blending loosely. Refreshes obsolete database elements or physical joint/metabolism routines.'
                        },
                        {
                          branches: '인해(寅亥)',
                          resultKo: '선합후파 (밀착 후 미세교정)',
                          resultEn: 'First Combine, Then Refine',
                          colorKo: 'text-emerald-750',
                          colorEn: 'text-[#00ea5e]',
                          detailKo: '먼저 친하여 강력하게 뭉쳐진 뒤(육합), 상호간의 세부 역할 분담 과정에서 한두 군데 삐걱거리는 것을 수정하여 더욱 완벽한 결속을 자아냅니다.',
                          detailEn: 'A bond that seals tightly first and then undergoes a fine-tuning phase to re-delegate exact responsibilities.'
                        },
                        {
                          branches: '묘오(卯午)',
                          resultKo: '속도연소 및 활력 리듬제어',
                          resultEn: 'Sudden Fire Burn Repair',
                          colorKo: 'text-rose-750',
                          colorEn: 'text-[#ff4747]',
                          detailKo: '목재(묘)가 용광로(오)에서 불타며 연기를 내기 쉬워, 연소 화력을 제어하는 굴뚝의 마찰과 같습니다. 감정 발산 속도의 리듬을 타게 돕습니다.',
                          detailEn: 'Dry grass feeding a giant bonfire too rapidly. Sparks a need to manage expressiveness rhythm and physical fatigue.'
                        },
                        {
                          branches: '사신(巳申)',
                          resultKo: '용하 결합과 구조적 입체화',
                          resultEn: 'Break and Bond Re-cycle',
                          colorKo: 'text-emerald-750',
                          colorEn: 'text-[#00ea5e]',
                          detailKo: '육합, 형, 파가 얽힌 사신은 격정적 결성 뒤 한 번 완전히 뜯어고쳐 새로운 패러다임으로 업그레이드하는 극적 리모델링 가치를 내포합니다.',
                          detailEn: 'Contains multi-layered fusion, penalty, and fraction. Converts old systems entirely into state-of-the-art standards.'
                         },
                         {
                           branches: '술미(戌未)',
                           resultKo: '건토 버석거림 조절',
                           resultEn: 'Dry Clay Fracture',
                           colorKo: 'text-amber-750',
                           colorEn: 'text-amber-400',
                           detailKo: '가을 영토(술)와 뜨거운 모래밭(미)이 만나 뭉쳐지지 않고 버석거리며 갈라지는 틈입니다. 계약서의 특약 사항이나 겉핥기 협약의 공백을 정위합니다.',
                           detailEn: 'Baked clay and warm desert dust colliding. Leads to re-checking safety clauses in loose partnerships.'
                         }
                       ]
                     },
                     harm: {
                       titleKo: '해 (害) - 은밀한 정체/방해',
                       titleEn: 'Harm (害) - Passive Friction',
                       icon: '🛡️',
                       borderClass: 'border-indigo-500/30',
                       bgClass: 'bg-indigo-50/70 border-indigo-200/80 dark:border-indigo-500/20',
                       badgeClass: 'text-indigo-805 bg-indigo-100/55',
                       badgeDarkClass: 'text-indigo-400 bg-indigo-500/5',
                       descKo: '합(끌림)을 뒤에서 훼방 놓는 성분으로, 진행이 다소 늦어지거나 인간관계 오해를 자아내며 속을 끓입니다. 정면승부보단 기민한 심리적 경계 정리가 요망됩니다.',
                       descEn: 'Passive elements blocking cozy combinations, suggesting invisible delays or subtle psychological distances.',
                       items: [
                         {
                           branches: '자미(子未)',
                           resultKo: '탁수 원망 (정서 미묘 원망)',
                           resultEn: 'Muddy Stream Friction',
                           colorKo: 'text-purple-750',
                           colorEn: 'text-purple-400',
                           detailKo: '자수의 맑음과 미토의 건조함이 섞여 흙탕물을 형성하듯 미성숙한 원망심이 일어날 수 있습니다. 내면의 정서를 고요하게 관망하는 지혜가 필요합니다.',
                           detailEn: 'Clean spring mixed with hot dust. Invites you to let emotional sediments settle naturally rather than reacting hastily.'
                         },
                         {
                           branches: '축오(丑午)',
                           resultKo: '탕화 가열 (내면 조급증 극복)',
                           resultEn: 'Steam Engine Friction',
                           colorKo: 'text-red-750',
                           colorEn: 'text-[#ff4747]',
                          detailKo: '얼음 땅(축)과 뜨거운 쇳물(오)이 만나 증기를 급작스럽게 뿜으며 내부 압력이 오르는 격입니다. 충동적 분노를 가라앉히고 우아하게 삭여 해결합니다.',
                          detailEn: 'Extreme hot and extreme cold touching. Generates internal thermal pressure, advising slow, conscious breathing and mindful meditation.'
                        },
                        {
                          branches: '인사(寅巳)',
                          resultKo: '조급 가열 조절',
                          resultEn: 'Overheated Drive',
                          colorKo: 'text-orange-750',
                          colorEn: 'text-orange-400',
                          detailKo: '거친 나무(인)가 너무 센 화염(사) 속으로 자진해서 뛰어들듯 하여 일찍 연고가 소모되는 모양입니다. 완급조절과 일과 휴식의 분배가 최선입니다.',
                          detailEn: 'Wood pushing its bounds into dynamic Fire prematurely. Demands strategic pacing to avoid exhaustion.'
                        },
                        {
                          branches: '묘진(卯辰)',
                          resultKo: '경계 협조 조정',
                          resultEn: 'Territorial Boundary Spans',
                          colorKo: 'text-emerald-750',
                          colorEn: 'text-[#00ea5e]',
                          detailKo: '봄 풀잎이 윤택한 토양의 주권을 가두려 하여 가까운 사이의 서운한 이기심이 생깁니다. 각자의 고유 영토와 경제적 선을 명확히 함으로써 완충됩니다.',
                          detailEn: 'Minor boundary disputes between plants and mud beds. Fixed by setting sweet, respectful personal lines.'
                        },
                        {
                          branches: '신해(申亥)',
                          resultKo: '소소 정체 (강철 부식 습기)',
                          resultEn: 'Metallic Corrosion Damp',
                          colorKo: 'text-teal-750',
                          colorEn: 'text-teal-400',
                          detailKo: '잘 다듬어진 강철(신)이 흐르지 않는 수중에 침잠해 미세하게 녹이 스는 듯한 passive 한 오해입니다. 명징한 텍스트로 오해 요소를 선제 타파하십시오.',
                          detailEn: 'Steel (Sin) soaking in damp channels (Hae). Reminds you to document all verbal plans to prevent unwritten issues.'
                        },
                        {
                          branches: '유술(酉戌)',
                          resultKo: '찰과상 극복 (보검의 자갈밭 격마찰)',
                          resultEn: 'Jewel Sand Abrasion',
                          colorKo: 'text-amber-750',
                          colorEn: 'text-amber-400',
                          detailKo: '금 보검(유)이 메마른 자갈 영토(술)에 긁혀 잔상이 생기는 격마찰입니다. 남모르게 내뱉는 질투 섞인 말들로부터 내 진성 가치를 굳게 지킬 때입니다.',
                          detailEn: 'High polished metal sliding across gravel soil. Encourages you to ignore peripheral complaints and shine with master dignity.'
                        }
                      ]
                    }
                  } satisfies Record<string, { titleKo: string; titleEn: string; icon: string; borderClass: string; bgClass: string; badgeClass: string; badgeDarkClass: string; descKo: string; descEn: string; items: any[] }>;

                  const getPillarNameLocal = (idx: number, lg: 'KO' | 'EN') => {
                    if (lg === 'KO') {
                      return ["시주", "일주", "월주", "연주"][idx] || "";
                    }
                    return ["Hour", "Day", "Month", "Year"][idx] || "";
                  };

                  const getPillarMeaningLocal = (idx: number, lg: 'KO' | 'EN') => {
                    if (lg === 'KO') {
                      return ["자식/미래", "나/배우자", "부모/사회", "조상/근본"][idx] || "";
                    }
                    return ["Children/Future", "Self/Spouse", "Parents/Society", "Ancestors/Roots"][idx] || "";
                  };

                  const tabsConf = [
                    { id: 'samhap', labelKo: '삼합 (三合)', labelEn: 'Sam-hap', themeColor: 'text-[#a78bfa] dark:text-[#c084fc]', colorClass: 'border-neon-purple/20' },
                    { id: 'banghap', labelKo: '방합 (方合)', labelEn: 'Bang-hap', themeColor: 'text-emerald-600 dark:text-[#a3e635]', colorClass: 'border-green-500/20' },
                    { id: 'yukhap', labelKo: '육합 (六合)', labelEn: 'Yuk-hap', themeColor: 'text-cyan-600 dark:text-[#22d3ee]', colorClass: 'border-neon-cyan/20' },
                    { id: 'clash', labelKo: '충 (冲)', labelEn: 'Clash', themeColor: 'text-rose-600 dark:text-[#f43f5e]', colorClass: 'border-red-500/20' },
                    { id: 'punish', labelKo: '형 (刑)', labelEn: 'Punishment', themeColor: 'text-amber-600 dark:text-[#fbbf24]', colorClass: 'border-amber-500/20' },
                    { id: 'destroy', labelKo: '파 (破)', labelEn: 'Destruction', themeColor: 'text-yellow-600 dark:text-[#facc15]', colorClass: 'border-yellow-500/10' },
                    { id: 'harm', labelKo: '해 (害)', labelEn: 'Harm', themeColor: 'text-indigo-600 dark:text-[#818cf8]', colorClass: 'border-indigo-500/20' },
                  ] as const;

                  const selectGuideTab = (tabId: 'samhap' | 'banghap' | 'yukhap' | 'clash' | 'punish' | 'destroy' | 'harm') => {
                    setGuideRelTab(tabId);
                    const catItems = relationCategories[tabId]?.items || [];
                    let foundIdx = -1;
                    for (let i = 0; i < catItems.length; i++) {
                      const item = catItems[i];
                      const userMatch = getUserInteractionMatch(tabId, item.branches);
                      if (userMatch) {
                        foundIdx = i;
                        break;
                      }
                    }
                    if (foundIdx !== -1) {
                      setActiveSubIndex(foundIdx);
                    } else {
                      setActiveSubIndex(0);
                    }
                  };

                  const currentCategory = relationCategories[guideRelTab] || relationCategories.clash;
                  const currentCategoryItems = currentCategory.items;
                  const safeActiveIndex = activeSubIndex >= currentCategoryItems.length ? 0 : activeSubIndex;
                  const activeItem = currentCategoryItems[safeActiveIndex];
                  const activeUserMatch = activeItem ? getUserInteractionMatch(guideRelTab, activeItem.branches) : null;

                  const handlePrevItem = () => {
                    const currentIndex = tabsConf.findIndex(t => t.id === guideRelTab);
                    const prevIndex = (currentIndex - 1 + tabsConf.length) % tabsConf.length;
                    const prevTabId = tabsConf[prevIndex].id;
                    selectGuideTab(prevTabId);
                  };

                  const handleNextItem = () => {
                    const currentIndex = tabsConf.findIndex(t => t.id === guideRelTab);
                    const nextIndex = (currentIndex + 1) % tabsConf.length;
                    const nextTabId = tabsConf[nextIndex].id;
                    selectGuideTab(nextTabId);
                  };

                  return (
                    <div className="space-y-4">
                      {/* Sub-navigation tabs: Slide rail style */}
                      <div className={`p-1.5 rounded-xl border flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none select-none ${isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-black/55 border-white/5'}`}>
                        {tabsConf.map((tab) => {
                          const isActive = guideRelTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              id={`bazi-guide-tab-${tab.id}`}
                              onClick={() => {
                                selectGuideTab(tab.id);
                              }}
                              className={`px-3 py-2 text-xs font-bold rounded-lg shrink-0 transition-all duration-300 active:scale-95 flex items-center gap-1 cursor-pointer border ${
                                isActive 
                                  ? (isLight 
                                      ? `bg-white border-slate-300 text-slate-800 shadow-sm ${tab.themeColor}` 
                                      : `bg-[#24253e] border-white/10 ${tab.themeColor} shadow-md shadow-black/40 glow-[0_0_12px_rgba(255,255,255,0.05)]`)
                                  : (isLight
                                      ? 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/50'
                                      : 'bg-transparent border-transparent text-white/50 hover:text-white/80 hover:bg-white/5')
                              }`}
                            >
                              <span>{relationCategories[tab.id].icon}</span>
                              <span>{lang === 'KO' ? tab.labelKo : tab.labelEn}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Main explanation card */}
                      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                        isLight 
                          ? 'bg-white border-slate-200 shadow-sm' 
                          : 'bg-[#1c1d30]/65 border-white/10 shadow-xl'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                          <h5 className={`text-base font-black flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            <span className="text-xl">{currentCategory.icon}</span>
                            <span>{lang === 'KO' ? currentCategory.titleKo : currentCategory.titleEn}</span>
                          </h5>
                          <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full border border-dashed shrink-0 self-start ${
                            isLight ? 'bg-slate-50 border-slate-300 text-slate-400' : 'bg-black/30 border-white/10 text-white/40'
                          }`}>
                            {guideRelTab}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/70'}`}>
                          {lang === 'KO' ? currentCategory.descKo : currentCategory.descEn}
                        </p>

                        {/* Combined Grid selector and carousel view */}
                        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                          
                          {/* Left Panel: Direct list selectors (Compact buttons grid) */}
                          <div className="lg:col-span-5 space-y-2">
                            <span className={`text-[10px] uppercase font-semibold tracking-wider block ${isLight ? 'text-slate-450' : 'text-white/40'}`}>
                              {lang === 'KO' ? '지자 조합 리스트' : 'Combination List'}
                            </span>
                            
                            <style>{`
                              @keyframes bazi-glow-full-l {
                                0%, 100% { border-color: rgba(217, 119, 6, 0.45); background-color: rgba(254, 243, 199, 0.65); box-shadow: 0 0 6px rgba(245, 158, 11, 0.15); }
                                50% { border-color: rgba(180, 83, 9, 1); background-color: rgba(254, 243, 199, 1); box-shadow: 0 0 18px rgba(245, 158, 11, 0.85), inset 0 0 8px rgba(245, 158, 11, 0.3); transform: translateY(-2px); }
                              }
                              @keyframes bazi-glow-full-d {
                                0%, 100% { border-color: rgba(245, 158, 11, 0.35); background-color: rgba(49, 35, 20, 0.45); box-shadow: 0 0 6px rgba(245, 158, 11, 0.15); }
                                50% { border-color: rgba(245, 158, 11, 1); background-color: rgba(60, 42, 22, 0.95); box-shadow: 0 0 24px rgba(245, 158, 11, 0.75), inset 0 0 10px rgba(245, 158, 11, 0.4); transform: translateY(-2px); }
                              }
                              @keyframes bazi-glow-half-l {
                                0%, 100% { border-color: rgba(14, 165, 233, 0.4); background-color: rgba(240, 249, 255, 0.65); box-shadow: 0 0 6px rgba(14, 165, 233, 0.15); }
                                50% { border-color: rgba(2, 132, 199, 1); background-color: rgba(224, 242, 254, 1); box-shadow: 0 0 16px rgba(14, 165, 233, 0.75), inset 0 0 6px rgba(14, 165, 233, 0.25); transform: translateY(-2px); }
                              }
                              @keyframes bazi-glow-half-d {
                                0%, 100% { border-color: rgba(0, 191, 255, 0.3); background-color: rgba(18, 40, 62, 0.45); box-shadow: 0 0 6px rgba(0, 191, 255, 0.15); }
                                50% { border-color: rgba(0, 191, 255, 1); background-color: rgba(18, 40, 62, 0.95); box-shadow: 0 0 22px rgba(0, 191, 255, 0.7), inset 0 0 8px rgba(0, 191, 255, 0.3); transform: translateY(-2px); }
                              }
                              @keyframes bazi-glow-remote-l {
                                0%, 100% { border-color: rgba(139, 92, 246, 0.35); background-color: rgba(245, 243, 255, 0.65); box-shadow: 0 0 4px rgba(139, 92, 246, 0.1); }
                                50% { border-color: rgba(109, 40, 217, 0.85); background-color: rgba(237, 233, 254, 0.95); box-shadow: 0 0 14px rgba(139, 92, 246, 0.55), inset 0 0 6px rgba(139, 92, 246, 0.2); transform: translateY(-1px); }
                              }
                              @keyframes bazi-glow-remote-d {
                                0%, 100% { border-color: rgba(139, 92, 246, 0.25); background-color: rgba(28, 20, 48, 0.45); box-shadow: 0 0 4px rgba(139, 92, 246, 0.1); }
                                50% { border-color: rgba(167, 139, 250, 0.9); background-color: rgba(40, 28, 68, 0.95); box-shadow: 0 0 18px rgba(139, 92, 246, 0.6), inset 0 0 6px rgba(139, 92, 246, 0.2); transform: translateY(-1px); }
                              }
                              @keyframes bazi-glow-clash-full-l {
                                0%, 100% { border-color: rgba(244, 63, 94, 0.45); background-color: rgba(255, 241, 242, 0.65); box-shadow: 0 0 6px rgba(244, 63, 94, 0.15); }
                                50% { border-color: rgba(225, 29, 72, 1); background-color: rgba(254, 226, 226, 1); box-shadow: 0 0 18px rgba(244, 63, 94, 0.85), inset 0 0 8px rgba(244, 63, 94, 0.3); transform: translateY(-2px); }
                              }
                              @keyframes bazi-glow-clash-full-d {
                                0%, 100% { border-color: rgba(244, 63, 94, 0.35); background-color: rgba(41, 17, 28, 0.45); box-shadow: 0 0 6px rgba(244, 63, 94, 0.15); }
                                50% { border-color: rgba(255, 0, 122, 1); background-color: rgba(41, 17, 28, 0.95); box-shadow: 0 0 24px rgba(255, 0, 122, 0.75), inset 0 0 10px rgba(255, 0, 122, 0.4); transform: translateY(-2px); }
                              }
                              @keyframes bazi-glow-clash-half-l {
                                0%, 100% { border-color: rgba(249, 115, 22, 0.4); background-color: rgba(255, 247, 237, 0.65); box-shadow: 0 0 6px rgba(249, 115, 22, 0.15); }
                                50% { border-color: rgba(234, 88, 12, 1); background-color: rgba(255, 237, 213, 1); box-shadow: 0 0 16px rgba(249, 115, 22, 0.75); transform: translateY(-1.5px); }
                              }
                              @keyframes bazi-glow-clash-half-d {
                                0%, 100% { border-color: rgba(249, 115, 22, 0.3); background-color: rgba(56, 27, 12, 0.45); box-shadow: 0 0 6px rgba(249, 115, 22, 0.15); }
                                50% { border-color: rgba(249, 115, 22, 1); background-color: rgba(56, 27, 12, 0.95); box-shadow: 0 0 20px rgba(249, 115, 22, 0.65); transform: translateY(-1.5px); }
                              }
                              @keyframes bazi-glow-clash-remote-l {
                                0%, 100% { border-color: rgba(217, 70, 239, 0.35); background-color: rgba(253, 244, 255, 0.65); box-shadow: 0 0 4px rgba(217, 70, 239, 0.10); }
                                50% { border-color: rgba(192, 38, 211, 0.85); background-color: rgba(250, 232, 255, 0.95); box-shadow: 0 0 14px rgba(217, 70, 239, 0.55); transform: translateY(-1px); }
                              }
                              @keyframes bazi-glow-clash-remote-d {
                                0%, 100% { border-color: rgba(217, 70, 239, 0.25); background-color: rgba(43, 15, 48, 0.45); box-shadow: 0 0 4px rgba(217, 70, 239, 0.10); }
                                50% { border-color: rgba(217, 70, 239, 0.95); background-color: rgba(43, 15, 48, 0.95); box-shadow: 0 0 18px rgba(217, 70, 239, 0.6); transform: translateY(-1px); }
                              }

                              @keyframes bazi-desc-glow-half {
                                0%, 100% { border-color: rgba(14, 165, 233, 0.3); box-shadow: 0 0 4px rgba(14, 165, 233, 0.05); }
                                50% { border-color: rgba(14, 165, 233, 0.85); box-shadow: 0 0 12px rgba(14, 165, 233, 0.3); }
                              }
                              @keyframes bazi-desc-glow-full {
                                0%, 100% { border-color: rgba(245, 158, 11, 0.3); box-shadow: 0 0 4px rgba(245, 158, 11, 0.05); }
                                50% { border-color: rgba(245, 158, 11, 0.85); box-shadow: 0 0 12px rgba(245, 158, 11, 0.3); }
                              }
                              @keyframes bazi-desc-glow-present {
                                0%, 100% { border-color: rgba(244, 63, 94, 0.3); box-shadow: 0 0 4px rgba(244, 63, 94, 0.05); }
                                50% { border-color: rgba(244, 63, 94, 0.85); box-shadow: 0 0 12px rgba(244, 63, 94, 0.3); }
                              }
                              
                              .bazi-pulse-full-light { animation: bazi-glow-full-l 2.4s infinite ease-in-out; }
                              .bazi-pulse-full-dark { animation: bazi-glow-full-d 2.4s infinite ease-in-out; }
                              .bazi-pulse-half-light { animation: bazi-glow-half-l 2.4s infinite ease-in-out; }
                              .bazi-pulse-half-dark { animation: bazi-glow-half-d 2.4s infinite ease-in-out; }
                              .bazi-pulse-remote-light { animation: bazi-glow-remote-l 2.4s infinite ease-in-out; }
                              .bazi-pulse-remote-dark { animation: bazi-glow-remote-d 2.4s infinite ease-in-out; }

                              .bazi-pulse-clash-full-light { animation: bazi-glow-clash-full-l 2.4s infinite ease-in-out; }
                              .bazi-pulse-clash-full-dark { animation: bazi-glow-clash-full-d 2.4s infinite ease-in-out; }
                              .bazi-pulse-clash-half-light { animation: bazi-glow-clash-half-l 2.4s infinite ease-in-out; }
                              .bazi-pulse-clash-half-dark { animation: bazi-glow-clash-half-d 2.4s infinite ease-in-out; }
                              .bazi-pulse-clash-remote-light { animation: bazi-glow-clash-remote-l 2.4s infinite ease-in-out; }
                              .bazi-pulse-clash-remote-dark { animation: bazi-glow-clash-remote-d 2.4s infinite ease-in-out; }

                              .desc-glow-half { animation: bazi-desc-glow-half 2.8s infinite ease-in-out; }
                              .desc-glow-full { animation: bazi-desc-glow-full 2.8s infinite ease-in-out; }
                              .desc-glow-present { animation: bazi-desc-glow-present 2.8s infinite ease-in-out; }
                            `}</style>

                            <div className="grid grid-cols-2 gap-2 min-h-[182px] w-full min-w-0">
                               {currentCategoryItems.map((item, idx) => {
                                 const isItemActive = idx === safeActiveIndex;
                                 const userMatch = getUserInteractionMatch(guideRelTab, item.branches);
                                 const matchStrength = getInteractionStrength(userMatch);

                                 let buttonStyleClass = "";
                                 let animStyleClass = "";

                                 if (matchStrength) {
                                   const level = matchStrength.level;
                                   if (level === 'full') {
                                     animStyleClass = isLight ? "bazi-pulse-full-light" : "bazi-pulse-full-dark";
                                     if (isItemActive) {
                                       buttonStyleClass = isLight
                                         ? 'border-amber-600 text-amber-950 ring-2 ring-amber-400 bg-amber-100/40 shadow-md font-black'
                                         : 'border-amber-400 text-white ring-2 ring-amber-400/40 bg-[#312314] shadow-[0_0_15px_rgba(245,158,11,0.5)] font-black';
                                     } else {
                                       buttonStyleClass = isLight
                                         ? 'border-amber-300 text-amber-900 bg-amber-50/25 font-bold hover:bg-amber-100/30'
                                         : 'border-amber-500/20 text-amber-300 font-bold bg-amber-500/5 hover:bg-amber-500/10';
                                     }
                                   } else if (level === 'half') {
                                     animStyleClass = isLight ? "bazi-pulse-half-light" : "bazi-pulse-half-dark";
                                     if (isItemActive) {
                                       buttonStyleClass = isLight
                                         ? 'border-sky-500 text-sky-950 ring-2 ring-sky-305 font-black bg-sky-100/40 shadow-md'
                                         : 'border-sky-400 text-white ring-2 ring-sky-400/40 bg-[#12283e] shadow-[0_0_15px_rgba(0,191,255,0.45)] font-black';
                                     } else {
                                       buttonStyleClass = isLight
                                         ? 'border-sky-300 text-sky-900 bg-sky-50/25 font-bold hover:bg-sky-100/30'
                                         : 'border-[#0ea5e9]/20 text-sky-300 font-bold bg-sky-500/5 hover:bg-sky-500/10';
                                     }
                                   } else if (level === 'remote') {
                                     animStyleClass = isLight ? "bazi-pulse-remote-light" : "bazi-pulse-remote-dark";
                                     if (isItemActive) {
                                       buttonStyleClass = isLight
                                         ? 'border-violet-550 text-violet-950 ring-2 ring-violet-350 bg-violet-100/40 shadow-md font-black'
                                         : 'border-violet-400 text-white ring-2 ring-violet-455/40 bg-[#21163a] shadow-[0_0_15px_rgba(139,92,246,0.45)] font-black';
                                     } else {
                                       buttonStyleClass = isLight
                                         ? 'border-violet-300 text-violet-900 bg-violet-50/25 font-bold hover:bg-violet-100/30'
                                         : 'border-violet-500/20 text-violet-300 font-bold bg-violet-500/5 hover:bg-violet-500/10';
                                     }
                                   } else if (level === 'clash_full') {
                                     animStyleClass = isLight ? "bazi-pulse-clash-full-light" : "bazi-pulse-clash-full-dark";
                                     if (isItemActive) {
                                       buttonStyleClass = isLight
                                         ? 'border-rose-600 text-rose-950 ring-2 ring-rose-350 bg-rose-100/40 shadow-md font-black'
                                         : 'border-rose-450 text-white ring-2 ring-rose-450/40 bg-[#29111c] shadow-[0_0_15px_rgba(255,0,122,0.45)] font-black';
                                     } else {
                                       buttonStyleClass = isLight
                                         ? 'border-rose-300 text-rose-905 bg-rose-50/25 font-bold hover:bg-rose-100/30'
                                         : 'border-rose-500/20 text-rose-300 font-bold bg-rose-500/5 hover:bg-rose-500/10';
                                     }
                                   } else if (level === 'clash_half') {
                                     animStyleClass = isLight ? "bazi-pulse-clash-half-light" : "bazi-pulse-clash-half-dark";
                                     if (isItemActive) {
                                       buttonStyleClass = isLight
                                         ? 'border-orange-550 text-orange-950 ring-2 ring-orange-355 bg-orange-100/40 shadow-md font-black'
                                         : 'border-orange-400 text-white ring-2 ring-orange-450/40 bg-[#351a0b] shadow-[0_0_15px_rgba(249,115,22,0.45)] font-black';
                                     } else {
                                       buttonStyleClass = isLight
                                         ? 'border-orange-300 text-orange-900 bg-orange-50/19 font-bold hover:bg-orange-100/30'
                                         : 'border-orange-500/20 text-orange-300 font-bold bg-orange-500/5 hover:bg-orange-500/10';
                                     }
                                   } else if (level === 'clash_remote') {
                                     animStyleClass = isLight ? "bazi-pulse-clash-remote-light" : "bazi-pulse-clash-remote-dark";
                                     if (isItemActive) {
                                       buttonStyleClass = isLight
                                         ? 'border-fuchsia-550 text-fuchsia-950 ring-2 ring-fuchsia-350 bg-fuchsia-100/40 shadow-md font-black'
                                         : 'border-[#d946ef] text-white ring-2 ring-fuchsia-450/40 bg-[#2a1130] shadow-[0_0_15px_rgba(217,70,239,0.45)] font-black';
                                     } else {
                                       buttonStyleClass = isLight
                                         ? 'border-fuchsia-300 text-fuchsia-900 bg-fuchsia-50/25 font-bold hover:bg-[#fdf4ff]'
                                         : 'border-fuchsia-500/20 text-fuchsia-300 font-bold bg-fuchsia-500/5 hover:bg-fuchsia-500/10';
                                     }
                                   } else {
                                     buttonStyleClass = isLight
                                       ? 'border-[#cbd5e1] text-slate-700 bg-transparent hover:bg-slate-50/30'
                                       : 'border-white/5 text-white/50 bg-transparent hover:bg-white/5';
                                   }
                                 } else {
                                   if (isItemActive) {
                                     buttonStyleClass = isLight
                                       ? 'bg-indigo-50/50 border-indigo-400/80 shadow-sm ring-1 ring-indigo-400/20 text-slate-900 font-bold'
                                       : 'bg-[#2b2c4e] border-neon-cyan/50 shadow-lg ring-1 ring-neon-cyan/10 ring-offset-black/20 text-white';
                                   } else {
                                     buttonStyleClass = isLight
                                       ? 'bg-slate-50/60 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/50'
                                       : 'bg-black/35 border-white/5 text-white/70 hover:border-white/15 hover:bg-white/5';
                                   } }

                                const isLongBranches = item.branches.length > 6 || lang !== 'KO';
                                const fontSizeClass = isLongBranches
                                  ? "text-[9.5px] sm:text-[10px]"
                                  : "text-[10.5px] sm:text-xs";

                                return (
                                  <button
                                    key={idx}
                                    id={`bazi-guide-sub-${idx}`}
                                    onClick={() => setActiveSubIndex(idx)}
                                    className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 min-w-0 select-none transition-all duration-300 active:scale-[0.98] cursor-pointer w-full overflow-hidden ${buttonStyleClass} ${animStyleClass}`}
                                  >
                                    <span className={`${fontSizeClass} font-gothic flex flex-wrap items-center gap-x-0.5 gap-y-0.5 leading-tight uppercase w-full break-normal`}>
                                      {renderFormattedBranches(item.branches, lang, isLight)}
                                    </span>
                                    {matchStrength && (() => {
                                      const badgeText = lang === 'KO' ? matchStrength.labelKo : matchStrength.labelEn;
                                      const badgeColorClass = matchStrength.badgeClass;

                                      return (
                                        <div className="flex justify-start">
                                          <span className={`text-[8px] font-black tracking-normal px-1 py-0.5 rounded flex items-center gap-x-0.5 whitespace-nowrap scale-90 origin-left ${badgeColorClass}`}>
                                            <span className="text-[7px]">✦</span>
                                            <span>{badgeText}</span>
                                          </span>
                                        </div>
                                      );
                                    })()}
                                    <span className={`text-[10px] font-black tracking-tight block ${
                                      isItemActive 
                                        ? (isLight ? 'text-indigo-750 font-black' : 'text-neon-cyan') 
                                        : (isLight ? 'text-slate-400' : 'text-white/40')
                                    }`}>
                                      {lang === 'KO' ? item.resultKo : item.resultEn}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Advanced Synthesis of Multiple Conflicts/Unions (Moved to Left Panel) */}
                            {activeUserMatch && activeUserMatch.allMatches && activeUserMatch.allMatches.length > 1 && (
                              <div className="space-y-1 mt-4">
                                <button
                                  onClick={() => setGuideInsightCollapsed(!guideInsightCollapsed)}
                                  className={`w-full p-2.5 px-3 rounded-lg border text-xs leading-relaxed flex items-center justify-between transition-all duration-200 hover:scale-[0.99] active:scale-[0.98] cursor-pointer ${
                                    isLight 
                                      ? 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 text-slate-800 shadow-sm' 
                                      : 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/15 text-zinc-200'
                                  }`}
                                >
                                  <span className="font-bold flex items-center gap-1.5 text-[10.5px] text-amber-600 dark:text-amber-400">
                                    <span>💎</span>
                                    <span>
                                      {lang === 'KO' ? '복합 사주 엣지케이스 정밀 해독' : 'Multiple Overlap Deep Interpretation'}
                                    </span>
                                  </span>
                                  <span className="text-[9px] flex items-center gap-1 opacity-70 font-bold uppercase tracking-wider">
                                    <span>{lang === 'KO' ? (guideInsightCollapsed ? '자세히보기' : '접기') : (guideInsightCollapsed ? 'Expand' : 'Collapse')}</span>
                                    <span className={`transform transition-transform duration-200 inline-block text-[7px] ${guideInsightCollapsed ? '' : 'rotate-90'}`}>▶</span>
                                  </span>
                                </button>

                                {!guideInsightCollapsed && (
                                  <div className={`p-3 rounded-lg border text-xs leading-relaxed transition-all duration-300 mt-1 ${
                                    isLight 
                                      ? 'bg-amber-550/[0.02] border-amber-500/15 text-slate-800' 
                                      : 'bg-amber-550/[0.02] border border-amber-500/10 text-zinc-200'
                                  }`}>
                                    <p className="text-[10px] leading-relaxed opacity-95 whitespace-pre-line font-light">
                                      {lang === 'KO' ? (
                                        guideRelTab === 'clash' ? (
                                          '당신의 명식에는 단일한 부딪침을 넘어 다중 충돌(쟁충/첩충)이 흐르고 있습니다. 자수와 다수의 오화가 얽히는 경우처럼, 하나의 구심점이 다각도에서 인장력을 받아 "지속적인 환경 쇄신과 심장 발전기 구동" 상태가 됩니다.\n\n정면 충돌(지지충)은 일상 속 직접적인 돌파와 위기극복으로 나타나며, 건너뛴 충돌(격충)은 한 템포 간격을 둔 전략적 긴장감 및 보완설계 능력을 드높여, 당신에게 탁월한 생존 위기관리력과 매력적인 승부사 안목을 동시에 선사합니다.'
                                        ) : guideRelTab.includes('hap') || guideRelTab.includes('uhap') || guideRelTab.includes('samhap') || guideRelTab.includes('banghap') || guideRelTab === 'yukhap' ? (
                                          '사주 원국 내에 복수의 합이 다각적으로 결합하는 다중 결속(정합/쟁합) 구조입니다. 이는 단순히 하나의 관계나 단일 목적에 얽매이지 않고, 한편으로는 일관된 협업을 도모하면서(삼합/방합) 다른 한편으로는 정서적인 연합이나 유연한 거래망(육합)을 입체적으로 가동할 수 있는 탁월한 네트워크 역량 및 대인관계 지평이 열려있음을 증명합니다.'
                                        ) : guideRelTab === 'punish' ? (
                                          '형살과 복음 등의 조율 장치가 다중으로 맞물려 있어 인생에 매우 정밀한 성찰 교정 능력이 작동하고 있습니다. 이 복합적인 압박감은 당신을 주도면밀함의 한계치까지 밀어붙여 세무, 기술, 엔지니어링, 설계, 의료 등 남들이 함부로 감내할 수 없는 고도의 난제 해결 역량을 완벽하게 단련시키는 극단적인 프로페셔널의 밑거름이 됩니다.'
                                        ) : (
                                          '서로 교차하는 복합적 균열과 보정 지대입니다. 인생 행보 중 예기치 못한 작은 변동이나 조정 사항이 나타날 수 있지만, 오히려 그 미세한 균열을 꼼꼼하게 메우는 보완 설비, 감사, 교정, 기록 보정 능력이 남들보다 압도적으로 발달하여 장기적인 리스크 관리 능력에서 절대 우위를 선점합니다.'
                                        )
                                      ) : (
                                        guideRelTab === 'clash' ? (
                                          'Your chart carries multiple co-existing clashes (contested/overlapping clashes). This acts as a continuous paradigm-shift engine where a direct clash provides instant breakthroughs while separated clashes grant long-term strategic anticipation, building supreme resilience and outstanding crisis-resolution mastery.'
                                        ) : guideRelTab.includes('hap') || guideRelTab.includes('uhap') || guideRelTab.includes('samhap') || guideRelTab.includes('banghap') || guideRelTab === 'yukhap' ? (
                                          'Having multiple co-existing combinations indicates a multi-perspective collaborative potential. Instead of being bound to a single domain, your capabilities are diversified to navigate robust professional alliances (triads/seasonal) as well as cozy personal networking agreements with incredible emotional intelligence.'
                                        ) : guideRelTab === 'punish' ? (
                                          'Co-existing punishments create multiple deep layers of quality-control and auditing consciousness. It refines your performance until you construct flawless masterpieces in legal, surgery, high-precision engineering, or forensic debugging.'
                                        ) : (
                                          'The multi-frictional adjustment enables you to foresee microscopic system discrepancies, rendering you an exceptionally sharp risk auditor and troubleshooter who turns potential errors into robust systems.'
                                        )
                                      )}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Right Panel: Interactive slider detail explanation card */}
                          <div className="lg:col-span-7 h-full">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${guideRelTab}-${safeActiveIndex}`}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.22 }}
                            className="text-[11.5px] leading-relaxed pr-1 space-y-3"
                          >
                            <p className={isLight ? 'text-slate-700 font-medium' : 'text-white/80'}>
                              {lang === 'KO' ? activeItem.detailKo : activeItem.detailEn}
                            </p>

                            {(() => {
                              const activeUserMatch = getUserInteractionMatch(guideRelTab, activeItem.branches);
                              if (!activeUserMatch) return null;

                              const matchStrength = getInteractionStrength(activeUserMatch);
                              if (!matchStrength) return null;

                              const level = matchStrength.level;

                              let containerClass = "";
                              let pulseDescClass = "";
                              let strengthBadgeTxt = "";
                              let detailTxtKo = "";
                              let detailTxtEn = "";

                              const isClash = guideRelTab === 'clash';
                              const isHyeong = guideRelTab === 'punish';
                              const isPa = guideRelTab === 'destroy';
                              const isHae = guideRelTab === 'harm';

                              const pIndices = activeUserMatch.pillarIndices || [];
                              const remoteBranchesStr = pIndices.map((pIdx: number) => {
                                const pName = getPillarNameLocal(pIdx, lang);
                                const pMean = getPillarMeaningLocal(pIdx, lang);
                                return `${pName}(${pMean})`;
                              }).join(' ↔ ');

                              const remoteBranchesStrEn = pIndices.map((pIdx: number) => {
                                const pName = getPillarNameLocal(pIdx, 'EN');
                                const pMean = getPillarMeaningLocal(pIdx, 'EN');
                                return `${pName} (${pMean})`;
                              }).join(' ↔ ');

                              const actualName = lang === 'KO' ? activeItem.resultKo : activeItem.resultEn;
                              const actualNameEn = activeItem.resultEn;

                              // stems in chart
                              const stems = result?.pillars?.map((p: any) => p.stem) || [];
                              const stemElements = stems.map(s => BAZI_MAPPING.stems?.[s as keyof typeof BAZI_MAPPING.stems]?.element || '');
                              const hasFireStem = stemElements.includes('Fire');
                              const hasWaterStem = stemElements.includes('Water');
                              const hasMetalStem = stemElements.includes('Metal');

                              if (level === 'full') {
                                pulseDescClass = "desc-glow-full";
                                containerClass = isLight 
                                  ? 'bg-amber-500/5 border-amber-400 text-amber-950 shadow-[0_3px_12px_rgba(245,158,11,0.15)] font-bold' 
                                  : 'bg-[#1e1302] border-amber-500/40 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold';
                                
                                strengthBadgeTxt = lang === 'KO' ? '완전 활성화(초강력)' : 'Active (Strong)';
                                detailTxtKo = `당신의 명식 내부에서 인접한 두 기둥 사이에 가장 강력하고 완전한 온전한 결합이 이루어졌습니다. 두 글자 간의 상호작용이 인생 전체에 걸쳐 지배적이며 압도적인 테마로 직접 가동됩니다.`;
                                detailTxtEn = `A complete close interaction is fully formed and loaded, acting as a highly prominent and central psychological driver in your chart.`;
                              } else if (level === 'half') {
                                pulseDescClass = "desc-glow-half";
                                containerClass = isLight 
                                  ? 'bg-sky-500/5 border-sky-400 text-sky-950 shadow-[0_3px_12px_rgba(14,165,233,0.15)] font-bold' 
                                  : 'bg-[#091a27] border-sky-500/40 text-sky-200 shadow-[0_0_12px_rgba(14,165,233,0.2)] font-bold';
                                
                                strengthBadgeTxt = lang === 'KO' ? '부분적 결합 가동(강)' : 'Semi-Active';
                                detailTxtKo = `사주 원국 내에 부분적(반합, 가합 등)으로 결속되어 완벽한 결합을 지원할 준비가 끝난 주파수입니다. 상황이나 대운/세운 등 새로운 인연의 유입에 따라 폭발적인 힘으로 전환될 가능성을 가집니다.`;
                                detailTxtEn = `A semi-active connection is established in your chart. This relationship carries vibrant readiness to spark into full activation upon receiving temporal triggers.`;
                              } else if (level === 'remote') {
                                pulseDescClass = "desc-glow-present";
                                containerClass = isLight 
                                  ? 'bg-violet-500/5 border-violet-400 text-violet-950 shadow-[0_3px_12px_rgba(139,92,246,0.15)] text-xs' 
                                  : 'bg-[#120a1f] border-violet-500/40 text-violet-200 shadow-[0_0_12px_rgba(139,92,246,0.2)] text-xs';
                                
                                if (isClash) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격충 조율' : 'Remote Clash';
                                  detailTxtKo = `사주 원국 양 극단(${remoteBranchesStr})에 위치하여 간접적으로 작용하는 원격충(${actualName})입니다. 현실에서의 물리적인 갈등이나 급변함은 최소화되나, 내면에 예술적인 정밀함, 신중한 판단력, 그리고 시간의 흐름을 기다릴 줄 아는 성숙한 지혜의 자양분이 됩니다.`;
                                  detailTxtEn = `Quiet remote friction presents low physical clash but triggers deep self-reflection, artistic inspiration, and seasoned strategic prudence.`;
                                } else if (isHyeong) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 형살' : 'Remote Punishment';
                                  detailTxtKo = `멀리 떨어져서 작용하는 원격 형살(${remoteBranchesStr}, ${actualName})입니다. 실생활의 직접 조율 마찰보다는 미학적/정신적 성찰, 그리고 점진적 조절 능력을 키워줍니다.`;
                                  detailTxtEn = `Remote punishment operates quietly at a distance, refining your inner discipline and strategic patience rather than causing active friction.`;
                                } else if (isPa) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 파살' : 'Remote Destruction';
                                  detailTxtKo = `보이지 않는 먼 거리에서 작용하는 원격 파살(${remoteBranchesStr}, ${actualName})입니다. 은근한 틈새를 정돈하며 사소한 오점이나 사각지대를 수시로 조용하게 보완해 가는 힘을 줍니다.`;
                                  detailTxtEn = `Remote destruction works slowly in the background, offering subtle, precise corrective opportunities over time.`;
                                } else if (isHae) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 해살' : 'Remote Harm';
                                  detailTxtKo = `원거리에서 조율하는 원격 해살(${remoteBranchesStr}, ${actualName})입니다. 불필요한 감정 자극 없이 담백하고 이성적인 대인관계의 안정 거리를 유지하는 방어기제로 작동합니다.`;
                                  detailTxtEn = `Remote harm acts as a protective boundary, helping you maintain healthy, objective personal distances.`;
                                } else {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 마찰 조율' : 'Remote Friction';
                                  detailTxtKo = `원거리 지지 간의 완만한 마찰 관계를 조화롭게 다듬습니다.`;
                                  detailTxtEn = `Gently calibrates the remote relational tension across the chart.`;
                                }
                              } else if (level === 'clash_full') {
                                pulseDescClass = "desc-glow-full";
                                containerClass = isLight 
                                  ? 'bg-rose-500/5 border-rose-400 text-rose-950 shadow-[0_3px_12px_rgba(244,63,94,0.15)]' 
                                  : 'bg-[#210915] border-rose-500/45 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)]';
                                
                                if (isClash) {
                                  strengthBadgeTxt = lang === 'KO' ? '정면충돌 작용(초강력)' : 'Direct Class Collision';
                                  detailTxtKo = `인접한 사주 기둥 사이에서 직접적이고 강력한 정면충(${remoteBranchesStr}, ${actualName})이 전면 가동 중입니다. 인생 전반에 걸쳐 고여있는 고정관념을 일거에 깨부수는 파괴적 개혁, 혁신, 급진적인 패러다임 리셋을 통한 눈부신 기회 창출을 이끕니다.`;
                                  detailTxtEn = `A direct, heavy branch collision (${remoteBranchesStrEn}) is fully active. This supreme tension demands and grants swift, dramatic transformations, letting you break through stagnant limits.`;
                                } else if (isHyeong) {
                                  if (activeUserMatch.type === '삼형') {
                                    strengthBadgeTxt = lang === 'KO' ? '삼형살 가동(초강력)' : 'Complete Tri-Punishment';
                                    detailTxtKo = `사주 원국에 3개의 지지(${remoteBranchesStr})가 완벽히 모여 거대한 ${actualName}이 완성되었습니다. 거침없는 에너지가 정밀한 제어망을 통과하며, 생살여탈을 쥐는 권력, 사람을 살리는 의료, 혹은 극도로 고도화된 정밀 엔지니어링/법조 분야에서 범접할 수 없는 카리스마와 탁월한 대업을 이룩할 폭발력을 선사합니다.`;
                                    detailTxtEn = `A complete Tri-Punishment (${remoteBranchesStrEn}) is locked into your destiny. This overwhelming energy grants you immense charisma and unparalleled mastery in high-stakes fields like legal, life-saving medical, or supreme structural engineering.`;
                                  } else {
                                    strengthBadgeTxt = lang === 'KO' ? '형살 가동(완전)' : 'Active Punishment';
                                    detailTxtKo = `사주원국에서 강력하게 매칭된 형살(${remoteBranchesStr}, ${actualName})의 압박과 조율 능력이 직접 작동하고 있습니다. 이 날카로운 설계 도면을 깎고 다듬는 과정에서 아무나 가질 수 없는 고도의 전문성(의료/보건, 법조/수사, 정밀 엔지니어링, 설계 편집 등)을 확보하여 압도적인 해결사로서 세상을 이끌어갑니다.`;
                                    detailTxtEn = `The comprehensive, active force of Punishment is processed, polishing your expertise in legal, medical, surgical, structural, or precise engineering fields.`;
                                  }
                                } else if (isPa) {
                                  strengthBadgeTxt = lang === 'KO' ? '파살 조율(강)' : 'Strong Destruction';
                                  detailTxtKo = `미세한 조정과 수정을 상징하는 파살(${remoteBranchesStr}, ${actualName})이 강력히 발현되어 있습니다. 미처 완성되지 않은 아이디어의 틈새를 정교하게 메우고 결점을 제거하는 디버깅 역량, 리모델링, 기성 부품을 맞춤 성형하는 유연한 트러블슈팅 능력의 절정을 선사합니다.`;
                                  detailTxtEn = `The sharp destructive adjustment is highly active, reinforcing your ability to inspect, repair, debug, and remodel existing ideas.`;
                                } else if (isHae) {
                                  strengthBadgeTxt = lang === 'KO' ? '해살 방어(강)' : 'Strong Harm Barrier';
                                  detailTxtKo = `방해 요소나 대인관계의 피로감을 다스리는 해살(${remoteBranchesStr}, ${actualName})의 주파수가 위치합니다. 이를 통해 사람 간의 보이지 않는 선을 분명히 그어 내면의 영역을 수호하는 조밀함이 가동되며, 법적 문서나 계약서의 은밀한 위험요소를 잡아내는 완벽주의적 안목이 대단히 명확해집니다.`;
                                  detailTxtEn = `Harm boundaries are highly active, helping you define emotional barriers and identify hidden legal or contractual details with high scrutiny.`;
                                } else {
                                  strengthBadgeTxt = lang === 'KO' ? '조율 작용 가동' : 'Active Adjuster';
                                  detailTxtKo = `사주 내 긴장감을 해소하고 새로운 발판을 마련하는 심부 조율 주파수가 작동 중입니다. 미세 교정 및 균형 조정을 통해 삶의 품질을 우수하게 끌어올려 줍니다.`;
                                  detailTxtEn = `The inner adjustment functions actively to fine-tune your path and system stability.`;
                                }
                              } else if (level === 'clash_half') {
                                pulseDescClass = "desc-glow-present";
                                containerClass = isLight 
                                  ? 'bg-orange-500/5 border-orange-400 text-orange-950 shadow-[0_3px_12px_rgba(249,115,22,0.15)]' 
                                  : 'bg-[#351909] border-orange-500/45 text-orange-200 shadow-[0_0_12px_rgba(249,115,22,0.2)]';
                                
                                if (isClash) {
                                  strengthBadgeTxt = lang === 'KO' ? '격충 마찰' : 'Separated Friction';
                                  detailTxtKo = `한 기둥을 건너뛰어 성립한 격충(${remoteBranchesStr}, ${actualName}) 또는 중간 수준의 마찰입니다. 끊임없는 직접 부딪침보다는 긴장감이 내포된 정밀 조정 능력으로 발현되며, 이로써 고유의 문제해결 능력, 전문 제어력, 엄밀한 리스크 관리를 고도화시킵니다.`;
                                  detailTxtEn = `Moderate friction operates through spanned pillars, building sharp situational awareness, systemic regulation, and exceptional crisis-resolution mastery.`;
                                } else if (isHyeong) {
                                  strengthBadgeTxt = lang === 'KO' ? '형살 조율' : 'Moderate Punishment';
                                  detailTxtKo = `일부 지지가 맞춰져 성립한 형살(${remoteBranchesStr}, ${actualName})의 조율 주파수가 감지됩니다. 주변 환경이나 기성 규격의 문제점을 예리하게 포착해내어 가장 효율적이고 완벽한 상태로 교정, 편집, 개혁해내는 탁월한 솔루션 제공 인프라를 마련해 줍니다.`;
                                  detailTxtEn = `The partial force of Punishment is processed, offering sharp problem-solving skills, structural revisions, and precise design capability.`;
                                } else if (isPa) {
                                  strengthBadgeTxt = lang === 'KO' ? '파살 조율' : 'Moderate Destruction';
                                  detailTxtKo = `기 흘러가는 과정에 얽힌 파살(${remoteBranchesStr}, ${actualName})의 보정 기능이 작동하고 있습니다. 타성적으로 유지되던 계약이나 시스템의 맹점을 찾아내 개선하며, 완고함을 탈피하여 끊임없는 자기 쇄신과 융통성 있는 대안을 제시하는 지혜를 심어줍니다.`;
                                  detailTxtEn = `Subtle destructions operate as a corrective mechanism, highlighting system loopholes to support smooth and proactive upgrades.`;
                                } else if (isHae) {
                                  strengthBadgeTxt = lang === 'KO' ? '해살 조율' : 'Moderate Harm Adjust';
                                  detailTxtKo = `영역 주권과 미세 조율에 관계하는 해살(${remoteBranchesStr}, ${actualName})입니다. 불필요하게 영역 내부로 침범당하거나 소용돌이치는 오성 갈등을 차단하며, 타인의 일방적인 경계 침범에 명확하고 냉정한 거절 의사를 표명해 선을 보호하는 현실적인 방어력을 드높여줍니다.`;
                                  detailTxtEn = `Harm adjustments operate moderately, building clear emotional boundaries and strong risk-mitigation focus around partnerships.`;
                                } else {
                                  strengthBadgeTxt = lang === 'KO' ? '조율 작용 가동' : 'Active Adjuster';
                                  detailTxtKo = `원국 지지 간의 긴장을 해소하고 부드럽게 완화해 나가는 완만 조율 기능이 들어와 있습니다.`;
                                  detailTxtEn = `A mild corrective adjustment operates gently to align details and restore structural comfort.`;
                                }
                              }

                              const bStr = activeItem.branches;
                              if ((bStr === '巳申' || bStr === '申巳') && activeUserMatch.type === '육합') {
                                if (isHyeong) {
                                  detailTxtKo = `사신합(${remoteBranchesStr})이자 동시에 사신형살(刑)의 성질과 파살(破)의 역동성이 함께 주파수로 교차합니다. 처음에는 강한 은혜와 합화(융합)의 완벽한 밀착으로 출발하나, 시간이 흐르며 권력 구조나 조율적 마찰로 흐르기 쉽고, 다시 금(金)으로 주도권이 변하며, 합(융합)과 형(갈등 및 재조립)을 오갑니다. 상황 변화에 따른 극적인 리모델링이나 패러다임 전환의 역동성을 지닙니다.`;
                                  detailTxtEn = `The Si-Shen relationship (${remoteBranchesStrEn}) fluctuates between fusion and friction depending on the environment, creating dynamic cycles of breaking and remaking.`;
                                } else {
                                  detailTxtKo = `사신합(${remoteBranchesStr})은 합이면서 동시에 형살(刑)의 성질과 파살(破)의 역동성이 교차합니다. 처음엔 강한 은혜와 합화(융합)로 보이나 갈등 해결과 교정 마찰을 통해 금(金)으로 주도권이 변하며, 합(융합)과 형(갈등 및 재조립)을 오갑니다. 상황 변화에 따른 극적인 리모델링이나 패러다임 전환의 역동성을 지닙니다.`;
                                  detailTxtEn = `The Si-Shen relationship (${remoteBranchesStrEn}) fluctuates between fusion and friction depending on the environment, creating dynamic cycles of breaking and remaking.`;
                                }
                              } else if ((bStr === '卯戌' || bStr === '戌卯') && activeUserMatch.type === '육합') {
                                  if (hasFireStem) {
                                    detailTxtKo = `묘술합(${remoteBranchesStr})은 천간에 화(火) 기운이 있어 불꽃으로 변하는 합화가 원활합니다. 예술적 열정이나 학문적 이상이 화려하게 만개하는 긍정적인 발현을 이룹니다.`;
                                    detailTxtEn = `The Mao-Xu combination (${remoteBranchesStrEn}) smoothly transforms into Fire, igniting artistic passion and academic ideals.`;
                                  } else {
                                    detailTxtKo = `화(火) 기운이 다소 부족한 묘술합(${remoteBranchesStr})으로, 완전한 융합보다는 목(木)과 토(土)의 은근한 견제와 속을 알 수 없는 미묘한 끌림이 지속되는 형태를 띱니다.`;
                                    detailTxtEn = `Without sufficient Fire stems, the Mao-Xu combination (${remoteBranchesStrEn}) acts as a mysterious attraction rather than a full transformation, maintaining subtle friction.`;
                                  }
                                } else if ((bStr === '辰酉' || bStr === '酉辰') && activeUserMatch.type === '육합') {
                                  if (hasMetalStem) {
                                    detailTxtKo = `진유합(${remoteBranchesStr})은 천간의 금(金) 기운을 받아 예리하고 단단한 속성으로 완벽히 변모합니다. 매우 견고한 카르텔적 의리와 전문적인 비즈니스 계약이 빈틈없이 성사됩니다.`;
                                    detailTxtEn = `The Chen-You combination (${remoteBranchesStrEn}) transforms perfectly into Metal, ensuring highly robust cartels and tight professional agreements.`;
                                  } else {
                                    detailTxtKo = `진유합(${remoteBranchesStr})은 든든히 밀어주는 조력자적 화합으로, 금(金)기가 폭발하기보다는 안정적인 습토(辰)가 보석(酉)을 묵묵히 생조하고 보호하는 형태로 나타납니다.`;
                                    detailTxtEn = `The Chen-You combination (${remoteBranchesStrEn}) provides reliable, stable support where the moist earth gently nurtures and protects the precious metal.`;
                                  }
                                }

                              return (
                                <div className="space-y-3 mt-3">
                                  <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 backdrop-blur-sm transition-all duration-300 ${containerClass} ${pulseDescClass}`}>
                                    <span className="text-base mt-1 flex animate-bounce shrink-0 select-none">✨</span>
                                    <div className="flex-1 space-y-1">
                                      <div className="text-xs font-black flex flex-wrap items-center gap-1.5 uppercase tracking-wide">
                                        <span>
                                          {lang === 'KO' 
                                            ? '내 사주 원국에 실제 존재' 
                                            : 'Present in your BaZi Chart'}
                                        </span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${matchStrength.badgeClass}`}>
                                          {strengthBadgeTxt}
                                        </span>
                                      </div>
                                      <p className="text-[11px] leading-relaxed opacity-95">
                                        {lang === 'KO' ? <ParsedText text={detailTxtKo} lang={lang} /> : <ParsedText text={detailTxtEn} lang={lang} />}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}

                                          {/* Advanced Multiple Interactions Breakdown (Moved to Right Panel inside motion.div) */}
                                          {activeUserMatch && activeUserMatch.allMatches && activeUserMatch.allMatches.length > 1 && (
                                            <div className={`p-3.5 rounded-xl border space-y-3 transition-all duration-300 mt-4 shadow-sm ${
                                              isLight 
                                                ? 'bg-slate-50 border-slate-200' 
                                                : 'bg-[#18181b]/98 border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.5)]'
                                            }`}>
                                              <div className="text-[10px] font-extrabold uppercase tracking-wider opacity-90 flex items-center gap-1">
                                                <span>🔗</span>
                                                <span className={isLight ? 'text-slate-800' : 'text-zinc-200'}>
                                                  {lang === 'KO' 
                                                    ? `복합 작용 발생 (${activeUserMatch.allMatches.length}개의 중첩 관계 발견)` 
                                                    : `Complex Multi-Overlap Detected (${activeUserMatch.allMatches.length} Relations)`}
                                                </span>
                                              </div>
                                              
                                              <div className="space-y-2 text-[10.5px]">
                                                {activeUserMatch.allMatches.map((m: any, mIdx: number) => {
                                                  const mPillars = m.pillarIndices || [];
                                                  const locTxt = mPillars.map((pIdx: number) => {
                                                    const pName = getPillarNameLocal(pIdx, lang);
                                                    const pMean = getPillarMeaningLocal(pIdx, lang);
                                                    return `${pName}(${pMean})`;
                                                  }).join(' ↔ ');
                                                  
                                                  let relationName = "";
                                                  let relationDescKo = "";
                                                  let relationDescEn = "";
                                                   
                                                   if (m.type === '복음') {
                                                     relationName = lang === 'KO' ? '복음 (기둥 중복)' : 'Pillar Duplication (Bok-eum)';
                                                     relationDescKo = m.note ? m.note.split('|')[0].replace(/<[^>]*>/g, '') : '동일 기운의 중공/중복으로 행동 정체나 고도 집중 성찰 주기가 발현됩니다.';
                                                     relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : 'Same pillar energy duplicates, causing potential stagnation or amplified focus.';
                                                   } else if (m.type === '지지충') {
                                                     relationName = lang === 'KO' ? '정면 지지충' : 'Direct Branch Clash';
                                                     relationDescKo = '인접 지지의 충돌로 즉각적이고 과감한 환경 변화나 인생의 강한 역동성을 개척합니다.';
                                                     relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : 'Direct close collision driving instant, catalytic resets and powerful environmental expansion.';
                                                   } else if (m.type === '격충') {
                                                     relationName = lang === 'KO' ? '건너뛴 격충' : 'Separated Branch Clash';
                                                     relationDescKo = '기둥을 건너뛴 마찰로, 간헐적인 심리적 긴장감 및 예리하고 정밀한 보완 능력을 기릅니다.';
                                                     relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : 'Collision across one pillar triggering alert situational awareness and precise detail planning.';
                                                   } else if (m.type === '원충') {
                                                     relationName = lang === 'KO' ? '원격 원충' : 'Remote Branch Clash';
                                                     relationDescKo = '원거리 간접 충돌로, 실생활 변동보다는 철학적 깊이와 성찰 안목을 키워줍니다.';
                                                     relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : 'Remote spaced clash granting subtle caution, artistic wisdom, and background prudence.';
                                                   } else if (m.type === '반합' || m.type === '가합') {
                                                     relationName = lang === 'KO' ? '지합 반합' : 'Half Triad Combination';
                                                    relationDescKo = '핵심 오행을 포함한 결속으로, 힘차게 돌아가는 엔진 축처럼 기능적 협률을 생산합니다.';
                                                    relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : 'Powerful partial triad producing stable functional cooperation and dynamic action.';
                                                  } else if (m.type === '삼합') {
                                                    relationName = lang === 'KO' ? '삼합 완성' : 'Full Triad Combination';
                                                    relationDescKo = '세 지지의 완전한 목적 연대로, 사회적 큰 성취와 단단한 공동체 비전을 제시합니다.';
                                                    relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : 'Complete strategic alliance creating high collaborative success and shared milestones.';
                                                  } else if (m.type === '방합') {
                                                    relationName = lang === 'KO' ? '계절 방합' : 'Directional Season Union';
                                                    relationDescKo = '가문 계절 무리의 강력한 세력으로, 독보적인 영역 주도권과 동맹력을 가져옵니다.';
                                                    relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : 'Seasonal coalition yielding unshakeable field mastery and robust, family-level bonds.';
                                                  } else if (m.type === '준방합') {
                                                    relationName = lang === 'KO' ? '준방합 형성' : 'Semi-Directional Union';
                                                    relationDescKo = '계절의 준합화로 은근한 카르텔적 유대감과 든든한 배경 우군을 구축합니다.';
                                                    relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : 'Partial seasonal harmony that builds background stability and supportive backings.';
                                                  } else if (m.type === '육합') {
                                                    relationName = lang === 'KO' ? '친밀 육합' : 'Six Affectionate Combo';
                                                    relationDescKo = '일대일의 긴밀한 사적 연합으로, 돈독한 상호 신뢰와 안락한 지지력입니다.';
                                                    relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : 'Close-knit private combination delivering trustworthy emotional and material support.';
                                                  } else if (m.type === '삼형' || m.type === '반형' || m.type === '자형' || m.type === '상형') {
                                                    relationName = lang === 'KO' ? `형살 조율 (${m.type})` : `Correction Punishment (${m.type})`;
                                                    relationDescKo = '서로 제어하고 깎는 교정력으로, 완벽주의 검증을 거쳐 일류 기질의 칼 끝을 연마합니다.';
                                                    relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : 'Surgical reshaping force which fertilizes professional mastership through strict auditing.';
                                                  } else {
                                                    relationName = m.type;
                                                    relationDescKo = m.note ? m.note.split('|')[0].replace(/<[^>]*>/g, '') : '';
                                                    relationDescEn = m.note && m.note.split('|')[1] ? m.note.split('|')[1].replace(/<[^>]*>/g, '') : '';
                                                  }

                                                  return (
                                                    <div 
                                                      key={mIdx} 
                                                      className={`p-2.5 rounded-lg border leading-relaxed ${
                                                        isLight 
                                                          ? 'bg-white border-slate-150 text-slate-800' 
                                                          : 'bg-[#18181b]/50 border-zinc-800 text-zinc-300'
                                                      }`}
                                                    >
                                                      <div className="flex items-center justify-between gap-1 mb-1">
                                                        <span className="font-semibold flex items-center gap-1 shrink-0">
                                                          <span className="text-[8px]">🔸</span>
                                                          <span>{relationName}</span>
                                                        </span>
                                                        <span className={`text-[8.5px] font-black opacity-80 uppercase px-1.5 py-0.2 rounded shrink-0 ${
                                                          m.severity === 'full' 
                                                            ? 'bg-rose-455/10 text-rose-600 dark:text-rose-400' 
                                                            : (m.severity === 'half' ? 'bg-orange-455/10 text-orange-600 dark:text-orange-400' : 'bg-fuchsia-455/10 text-fuchsia-600 dark:text-fuchsia-400')
                                                        }`}>
                                                          {m.severity}
                                                        </span>
                                                      </div>
                                                      <div className="font-mono text-[9px] opacity-70 font-semibold mb-1">
                                                        {locTxt}
                                                      </div>
                                                      <p className="text-[10px] leading-relaxed opacity-90 font-light pl-2 border-l border-slate-200 dark:border-zinc-800">
                                                        {lang === 'KO' ? relationDescKo : relationDescEn}
                                                      </p>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          )}
                                        </motion.div>
                                      </AnimatePresence>
                                    </div>

                              {/* Footer: Bottom dot sliders and navigation buttons */}
                              <div className={`flex items-center justify-between border-t pt-3 mt-4 ${
                                isLight ? 'border-slate-200' : 'border-white/5'
                              }`}>
                                
                                {/* Dots indicator */}
                                <div className="flex items-center gap-1">
                                  {currentCategoryItems.map((_, dotIdx) => {
                                    const isDotActive = dotIdx === safeActiveIndex;
                                    return (
                                      <button
                                        key={dotIdx}
                                        onClick={() => setActiveSubIndex(dotIdx)}
                                        className={`h-1.5 transition-all duration-350 cursor-pointer ${
                                          isDotActive 
                                            ? (isLight ? 'w-4 rounded-full bg-indigo-600' : 'w-4 rounded-full bg-neon-cyan shadow-[0_0_8px_rgba(34,211,238,0.5)]') 
                                            : (isLight ? 'w-1.5 rounded-full bg-slate-300 hover:bg-slate-400' : 'w-1.5 rounded-full bg-white/15 hover:bg-white/30')
                                        }`}
                                        title={`Go to slide ${dotIdx + 1}`}
                                      />
                                    );
                                  })}
                                </div>

                                {/* Slider Navigation Arrows at the Bottom for both Mobile and Desktop */}
                                <div className="flex items-center gap-1">
                                  <button 
                                    onClick={handlePrevItem}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-base font-bold cursor-pointer transition-all active:scale-90 ${
                                      isLight
                                        ? 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-950 shadow-sm active:bg-slate-100'
                                        : 'bg-black/40 border-white/10 text-white/60 hover:bg-white/5 hover:text-white active:bg-white/5'
                                    }`}
                                    title="Previous"
                                  >
                                    ‹
                                  </button>
                                  <button 
                                    onClick={handleNextItem}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg border text-base font-bold cursor-pointer transition-all active:scale-90 ${
                                      isLight
                                        ? 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-950 shadow-sm active:bg-slate-100'
                                        : 'bg-black/40 border-white/10 text-white/60 hover:bg-white/5 hover:text-white active:bg-white/5'
                                    }`}
                                    title="Next"
                                  >
                                    ›
                                  </button>
                                </div>

                              </div>

                            </div>
                          </div>
                        </div>
                      );
                    })()}

              {/* 4. 오행 생극제화 관계 가이드 섹션 */}
              <div id="five-elements-guide-section" className="space-y-4 pt-6 mt-6 border-t border-white/10">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neon-cyan/20 text-neon-cyan flex items-center justify-center text-sm">4</span>
                  {lang === 'KO' ? '대자연의 조화: 오행의 생극제화(生剋制化)' : 'Cosmic Balance: Generation & Control'}
                </h4>
                <p className="text-sm leading-relaxed text-white/80">
                  {lang === 'KO' ? 
                    '우주와 삶은 오행의 순환 속에 있습니다. 상생(相生)은 기운을 키우고 흘러가게 돕는 힘이며, 상극(相剋)은 기운을 제어하여 균형을 잡아주는 힘입니다. 이것이 서로 조화를 이루는 과정이 생극제화(生剋制化)입니다.' : 
                    'The cosmic nature operates through the cycle of five elements. Generating (Mutual Generation) is the force that nourishes and flows, while Controlling (Mutual Control) is the governing force that maintains balance through restraint.'}
                </p>

                <FiveElementsDiagram lang={lang} isLight={isLight} />

                {(() => {
                  const elementsCycle = [
                    {
                      element: 'Wood',
                      labelKo: '木 (목·Wood)',
                      labelEn: 'Wood (木)',
                      icon: '🌱',
                      color: ELEMENT_COLORS.Wood,
                      shengOut: { element: 'Fire', icon: '🔥', labelKo: '火 (화·Fire)', labelEn: 'Fire (火)', phraseKo: '木生火 (목생화)', phraseEn: 'Wood feeds Fire', descKo: '나무가 자신을 태워 불꽃을 피움', descEn: 'Wood burns to sustain Fire.' },
                      shengIn: { element: 'Water', icon: '💧', labelKo: '水 (수·Water)', labelEn: 'Water (水)', phraseKo: '水生木 (수생목)', phraseEn: 'Water grows Wood', descKo: '생명수가 나무뿌리를 적셔 길러냄', descEn: 'Water flows to dynamic roots, nurturing Wood.' },
                      keOut: { element: 'Earth', icon: '🏔️', labelKo: '土 (토·Earth)', labelEn: 'Earth (土)', phraseKo: '木剋土 (목극토)', phraseEn: 'Wood parts Earth', descKo: '나무뿌리가 흙을 움켜쥐고 고정함', descEn: 'Wood parts and restrains Earth with roots.' },
                      keIn: { element: 'Metal', icon: '⚔️', labelKo: '金 (금·Metal)', labelEn: 'Metal (金)', phraseKo: '金剋木 (금극목)', phraseEn: 'Metal cuts Wood', descKo: '금속 도구가 뻗어나간 가지를 쳐냄', descEn: 'Metal axes chop overgrown Wood.' },
                    },
                    {
                      element: 'Fire',
                      labelKo: '火 (화·Fire)',
                      labelEn: 'Fire (火)',
                      icon: '🔥',
                      color: ELEMENT_COLORS.Fire,
                      shengOut: { element: 'Earth', icon: '🏔️', labelKo: '土 (토·Earth)', labelEn: 'Earth (土)', phraseKo: '화생토 (화생토)', phraseEn: 'Fire forms Earth', descKo: '불이 탄 재가 다시 흙을 비옥하게 함', descEn: 'Fire turns to rich ash, enriching Earth.' },
                      shengIn: { element: 'Wood', icon: '🌱', labelKo: '木 (목·Wood)', labelEn: 'Wood (木)', phraseKo: '목생화 (목생화)', phraseEn: 'Wood feeds Fire', descKo: '나무가 땔감이 되어 찬란히 빛나게 함', descEn: 'Wood burns to sustain Fire.' },
                      keOut: { element: 'Metal', icon: '⚔️', labelKo: '金 (금·Metal)', labelEn: 'Metal (金)', phraseKo: '화극금 (화극금)', phraseEn: 'Fire melts Metal', descKo: '뜨거운 불꽃이 금속 원석을 제련함', descEn: 'Fire melts raw Metal to forge useful tools.' },
                      keIn: { element: 'Water', icon: '💧', labelKo: '水 (수·Water)', labelEn: 'Water (水)', phraseKo: '수극화 (水剋火)', phraseEn: 'Water tames Fire', descKo: '시원한 물줄기가 뜨거운 불길을 조율함', descEn: 'Water extinguishes rising flames of Fire.' },
                    },
                    {
                      element: 'Earth',
                      labelKo: '土 (토·Earth)',
                      labelEn: 'Earth (土)',
                      icon: '🏔️',
                      color: ELEMENT_COLORS.Earth,
                      shengOut: { element: 'Metal', icon: '⚔️', labelKo: '金 (금·Metal)', labelEn: 'Metal (金)', phraseKo: '토생금 (토생금)', phraseEn: 'Earth forms Metal', descKo: '단단한 대지 속에 광물을 품어 길러냄', descEn: 'Earth forms precious Minerals and Metals.' },
                      shengIn: { element: 'Fire', icon: '🔥', labelKo: '火 (화·Fire)', labelEn: 'Fire (火)', phraseKo: '화생토 (화생토)', phraseEn: 'Fire forms Earth', descKo: '뜨겁게 타오른 재가 흙을 윤택하게 함', descEn: 'Fire turns to rich ash, enriching Earth.' },
                      keOut: { element: 'Water', icon: '💧', labelKo: '水 (수·Water)', labelEn: 'Water (水)', phraseKo: '토극수 (토극수)', phraseEn: 'Earth dams Water', descKo: '견고한 대지가 굽이치는 물줄기를 가둠', descEn: 'Earth dams up, absorbs, and directs Water.' },
                      keIn: { element: 'Wood', icon: '🌱', labelKo: '木 (목·Wood)', labelEn: 'Wood (木)', phraseKo: '목극토 (목극토)', phraseEn: 'Wood parts Earth', descKo: '단단한 나무뿌리가 흙을 관통해 누름', descEn: 'Wood parts and restrains Earth with roots.' },
                    },
                    {
                      element: 'Metal',
                      labelKo: '金 (금·Metal)',
                      labelEn: 'Metal (金)',
                      icon: '⚔️',
                      color: ELEMENT_COLORS.Metal,
                      shengOut: { element: 'Water', icon: '💧', labelKo: '수 (수·Water)', labelEn: 'Water (水)', phraseKo: '금생수 (금생수)', phraseEn: 'Metal condenses Water', descKo: '정제된 금속 표면에 이슬(물)이 맺힘', descEn: 'Metal cools to condense clean dew.' },
                      shengIn: { element: 'Earth', icon: '🏔️', labelKo: '土 (토·Earth)', labelEn: 'Earth (土)', phraseKo: '토생금 (토생금)', phraseEn: 'Earth forms Metal', descKo: '흙 속의 풍부한 무기물이 원석을 벼려냄', descEn: 'Earth compresses and forms precious Metals.' },
                      keOut: { element: 'Wood', icon: '🌱', labelKo: '木 (목·Wood)', labelEn: 'Wood (木)', phraseKo: '금극목 (금극목)', phraseEn: 'Metal cuts Wood', descKo: '예리한 날이 우거진 가지를 극제하여 정돈함', descEn: 'Metal axes chop and sculpt overgrown Wood.' },
                      keIn: { element: 'Fire', icon: '🔥', labelKo: '火 (화·Fire)', labelEn: 'Fire (火)', phraseKo: '화극금 (화극금)', phraseEn: 'Fire melts Metal', descKo: '용광로의 화기가 견고한 금속 구조를 교정함', descEn: 'Fire melts raw Metal to reshape its physical form.' },
                    },
                    {
                      element: 'Water',
                      labelKo: '水 (수·Water)',
                      labelEn: 'Water (水)',
                      icon: '💧',
                      color: ELEMENT_COLORS.Water,
                      shengOut: { element: 'Wood', icon: '🌱', labelKo: '목 (목·Wood)', labelEn: 'Wood (木)', phraseKo: '수생목 (수생목)', phraseEn: 'Water grows Wood', descKo: '흘려보내듯 자비로운 물길이 나무를 키움', descEn: 'Water flows to dynamic roots, nurturing Wood.' },
                      shengIn: { element: 'Metal', icon: '⚔️', labelKo: '금 (금·Metal)', labelEn: 'Metal (金)', phraseKo: '금생수 (금생수)', phraseEn: 'Metal condenses Water', descKo: '시원하고 차가운 암반을 거쳐 맑은 샘물이 흘러나옴', descEn: 'Metal cools to condense clean dew.' },
                      keOut: { element: 'Fire', icon: '🔥', labelKo: '화 (화·Fire)', labelEn: 'Fire (火)', phraseKo: '수극화 (수극화)', phraseEn: 'Water tames Fire', descKo: '유연한 물이 치성하게 번져가는 불을 가라앉힘', descEn: 'Water extinguishes rising flames of Fire.' },
                      keIn: { element: 'Earth', icon: '🏔️', labelKo: '토 (토·Earth)', labelEn: 'Earth (土)', phraseKo: '토극수 (토극수)', phraseEn: 'Earth dams Water', descKo: '묵묵한 대지와 제방이 세찬 강줄기를 붙잡음', descEn: 'Earth dams up, absorbs, and directs Water.' },
                    }
                  ];

                  const RenderElementBadge = ({ info }: { info: any }) => {
                    const badgeColor = ELEMENT_COLORS[info.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
                    return (
                      <div className="flex flex-col items-center text-center p-2 rounded-xl transition-all duration-300 hover:bg-white/5 select-none h-full justify-center font-sans">
                        <div 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold border"
                          style={{
                            backgroundColor: badgeColor + '12',
                            borderColor: badgeColor + '30',
                            color: badgeColor
                          }}
                        >
                          <span>{info.icon}</span>
                          <span>{lang === 'KO' ? info.phraseKo : info.phraseEn}</span>
                        </div>
                        <p className={`mt-1.5 text-[10px] sm:text-[11px] leading-relaxed max-w-[150px] font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                          {lang === 'KO' ? info.descKo : info.descEn}
                        </p>
                      </div>
                    );
                  };

                  return (
                    <div className="mt-4 font-sans">
                      <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isLight
                          ? 'bg-slate-50/50 border-slate-200/80 shadow-sm'
                          : 'bg-zinc-950/20 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md'
                      }`}>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-left text-xs min-w-[760px]">
                            <thead>
                              <tr className={`border-b ${isLight ? 'border-slate-200 bg-slate-100/50' : 'border-white/10 bg-white/5'}`}>
                                <th className={`py-4 px-4 font-bold uppercase tracking-wider text-center ${isLight ? 'text-slate-600' : 'text-zinc-400'}`} style={{ width: '12%' }}>
                                  {lang === 'KO' ? '기준 오행' : 'Base Element'}
                                </th>
                                <th className={`py-4 px-4 font-bold uppercase tracking-wider text-center ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} style={{ width: '22%' }}>
                                  {lang === 'KO' ? '상생: 내가 생(生)함 [출력]' : 'Generate (Out): Generates'}
                                </th>
                                <th className={`py-4 px-4 font-bold uppercase tracking-wider text-center ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} style={{ width: '22%' }}>
                                  {lang === 'KO' ? '상생: 나를 생(生)함 [입력]' : 'Generate (In): Nourished By'}
                                </th>
                                <th className={`py-4 px-4 font-bold uppercase tracking-wider text-center ${isLight ? 'text-rose-700' : 'text-rose-400'}`} style={{ width: '22%' }}>
                                  {lang === 'KO' ? '상극: 내가 극(剋)함 [제어]' : 'Control (Out): Controls'}
                                </th>
                                <th className={`py-4 px-4 font-bold uppercase tracking-wider text-center ${isLight ? 'text-rose-700' : 'text-rose-400'}`} style={{ width: '22%' }}>
                                  {lang === 'KO' ? '상극: 나를 극(剋)함 [피극]' : 'Control (In): Controlled By'}
                                </th>
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${isLight ? 'divide-slate-200/80' : 'divide-white/10'}`}>
                              {elementsCycle.map((item, idx) => (
                                <tr 
                                  key={idx} 
                                  className={`transition-colors ${
                                    isLight ? 'hover:bg-slate-100/45' : 'hover:bg-white/[0.015]'
                                  }`}
                                >
                                  {/* 기준 오행 */}
                                  <td className={`py-4 px-3 text-center border-r border-dashed ${isLight ? 'border-slate-200 bg-slate-50/20' : 'border-white/5 bg-white/[0.005]'}`}>
                                    <div className="flex flex-col items-center justify-center min-w-[70px]">
                                      <div 
                                        className="w-11 h-11 rounded-full flex flex-col items-center justify-center border font-black select-none transition-all duration-300 hover:scale-105"
                                        style={{ 
                                          backgroundColor: item.color + '18',
                                          borderColor: item.color + '88',
                                          color: item.color,
                                          boxShadow: `0 0 15px ${item.color}25`
                                        }}
                                      >
                                        <span className="text-base leading-none -mb-0.5">{item.icon}</span>
                                        <span className="text-[10px] font-black leading-none uppercase tracking-tighter col-span-1">
                                          {lang === 'KO' ? item.labelKo.split(' ')[0] : item.labelEn.split(' ')[0]}
                                        </span>
                                      </div>
                                      <span className={`text-[10px] font-bold mt-1.5 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                                        {lang === 'KO' ? item.labelKo : item.labelEn}
                                      </span>
                                    </div>
                                  </td>

                                  {/* 생출 */}
                                  <td className={`py-3 px-1 border-r border-dashed ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                                    <RenderElementBadge info={item.shengOut} />
                                  </td>

                                  {/* 생입 */}
                                  <td className={`py-3 px-1 border-r border-dashed ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                                    <RenderElementBadge info={item.shengIn} />
                                  </td>

                                  {/* 극출 */}
                                  <td className={`py-3 px-1 border-r border-dashed ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                                    <RenderElementBadge info={item.keOut} />
                                  </td>

                                  {/* 극입 */}
                                  <td className="py-3 px-1">
                                    <RenderElementBadge info={item.keIn} />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Table Bottom Quick Legend */}
                        <div className={`p-3 text-[10.5px] border-t flex flex-wrap gap-x-4 gap-y-1.5 items-center justify-center ${
                          isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/[0.01] border-white/10 text-zinc-500'
                        }`}>
                          <span className="font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {lang === 'KO' ? '상생(相生): 기운을 듬뿍 실어주고 북돋아주는 관계' : 'Generating (Creation): Nurturing relationship that fuels other element'}
                          </span>
                          <span className="font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            {lang === 'KO' ? '상극(相剋): 기운을 제어하여 흐트러짐 없게 조율하는 관계' : 'Overcoming (Restraint): Governing relationship that controls and balances other element'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 제장제화(制化) 설명 */}
                <div className={`p-4 rounded-xl border leading-relaxed text-xs sm:text-sm ${
                  isLight ? 'bg-slate-100/80 border-slate-200 text-slate-800' : 'bg-white/5 border-white/10 text-white/50'
                }`}>
                  <h6 className={`font-bold mb-2 flex items-center gap-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    💡 {lang === 'KO' ? '생극제화(生剋制化)의 진실: 모든 기운은 필요합니다' : 'The Truth of Generation & Restraint: Every Force is Vital'}
                  </h6>
                  <p className="leading-relaxed opacity-95">
                    {lang === 'KO' ? (
                      <>
                        명리학에서 상생은 무조건 착하고 좋으며 상극은 파괴적이고 나쁘다는 식의 이분법적 오해는 절대적 오해입니다. 
                        생(生)하는 힘만 있고 극(剋)하는 통제력이 없다면 과잉되어 결국 자라지 못하거나 붕괴하게 됩니다. 
                        반대로 지나친 극(剋)만 존재하면 기가 위축되고 파괴되나, 적절히 생(生)과 극(剋)이 맞물릴 때 비로소 사회적 자제력과 삶의 세련된 조절능력이 균형을 이룹니다. 
                        이러한 자연의 기묘한 역동성을 이해할 때 내 사주 원국의 각 오행 성향을 온전히 조화롭게 활용할 수 있는 내면의 열쇠를 얻게 됩니다.
                      </>
                    ) : (
                      <>
                        In genuine BaZi, it is a grand misconception to classify creation (Generation) as unconditionally good and overcoming (Restraint) as bad. 
                        Without Generation, nothing grows. Without Restraint (control), there is infinite growth leading to catastrophic decay. 
                        When creation and restraint interact dynamically (Generation-Restraint-Harmonization), true psychological mastery and profound balance emerge.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div ref={tenGodsGridRef} className="space-y-4 pt-6 mt-6 border-t border-white/10">
                <h4 id="guide-section-tengods" className="text-lg font-bold text-white flex items-center gap-2 scroll-mt-6">
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
                    <div key={i} className={`flex flex-col lg:flex-row rounded-xl overflow-hidden transition-all duration-300 border ${isLight ? 'bg-slate-50 border-slate-200 shadow-sm hover:border-slate-300/80' : 'bg-[#1b1c31]/30 border-white/10 shadow-lg hover:border-white/20'}`}>
                      <div 
                        className={`lg:w-[180px] p-4 lg:p-6 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-1 shrink-0 border-b lg:border-b-0 lg:border-r text-center ${isLight ? 'border-slate-200' : 'border-white/10'}`}
                        style={{ backgroundColor: isLight ? `color-mix(in srgb, ${g.color} 12%, transparent)` : `color-mix(in srgb, ${g.color} 8%, transparent)` }}
                      >
                        <div className="flex flex-col items-start lg:items-center text-left lg:text-center">
                          <span className={`font-bold text-[10px] tracking-wider uppercase mb-0.5 ${isLight ? 'text-slate-400 font-medium' : 'text-white/40'}`}>Mask Group</span>
                          <span className="font-black text-base sm:text-lg md:text-xl tracking-wide font-gothic" style={{ color: g.color }}>
                            {lang === 'KO' ? g.groupKo : g.groupEn}
                          </span>
                        </div>
                        <span className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                          {lang === 'KO' ? g.groupEn : g.groupKo}
                        </span>
                      </div>

                      <div className={`flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${isLight ? 'divide-slate-200' : 'divide-white/10'}`}>
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
                            '子': { element: 'Water', polarity: -1 }, '丑': { element: 'Earth', polarity: -1 },
                            '寅': { element: 'Wood', polarity: 1 }, '卯': { element: 'Wood', polarity: -1 },
                            '辰': { element: 'Earth', polarity: 1 }, '巳': { element: 'Fire', polarity: 1 },
                            '午': { element: 'Fire', polarity: -1 }, '未': { element: 'Earth', polarity: -1 },
                            '申': { element: 'Metal', polarity: 1 }, '酉': { element: 'Metal', polarity: -1 },
                            '戌': { element: 'Earth', polarity: 1 }, '亥': { element: 'Water', polarity: 1 }
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
                            <div key={j} className={`p-5 flex flex-col justify-between h-full transition-colors duration-300 ${isLight ? 'bg-white hover:bg-slate-100/50' : 'bg-[#161623]/20 hover:bg-[#1c1c30]/40'}`}>
                              <div className="flex flex-col gap-2 mb-3">
                                <div className="flex items-center justify-between gap-3 min-w-0">
                                  <div className="flex items-baseline gap-2 min-w-0">
                                    <span className={`text-sm sm:text-base md:text-lg font-bold leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                                      {lang === 'KO' ? item.nameKo : item.nameEn}
                                    </span>
                                    <span className={`text-xs font-medium ${isLight ? 'text-slate-400' : 'text-white/45'}`}>
                                      {lang === 'KO' ? item.nameEn : item.nameKo}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap items-center justify-end gap-1 shrink-0">
                                    {tenGodChars.filter(tc => tc.inChart).map((tc, idx) => (
                                      <div 
                                        key={idx} 
                                        className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full border ${isLight ? 'bg-slate-100/95 shadow-sm border-slate-300' : 'bg-white/10 shadow-[0_0_8px_rgba(255,255,255,0.15)] border-white/30'}`}
                                      >
                                        <span className="text-[10px] sm:text-xs font-bold leading-none" style={{ color: ELEMENT_COLORS[tc.element as keyof typeof ELEMENT_COLORS] || (isLight ? '#333' : '#fff') }}>
                                          {tc.hanja}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className={`text-xs sm:text-sm leading-relaxed break-keep ${isLight ? 'text-slate-600 font-medium' : 'text-white/70'}`} style={{ wordBreak: 'keep-all' }}>
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
              className="bg-[#0a0a0a] border border-purple-500/30 rounded-2xl p-4 sm:p-5 max-w-[420px] w-full shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowYongshinRolesInfo(false)}
                className="absolute top-3.5 right-3.5 text-white/40 hover:text-white transition-colors"
                id="close-yongshin-roles-info-btn"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg sm:text-xl font-bold text-purple-400 mb-2.5">
                {lang === 'KO' ? '희신, 기신, 구신이란?' : 'HeeShin, GiShin, and GuShin'}
              </h3>
              
              <div className="text-xs sm:text-sm text-white/80 space-y-3 leading-relaxed max-h-[72vh] sm:max-h-[78vh] overflow-y-auto pr-1.5 custom-scrollbar">
                <p className="text-white/70">
                  {lang === 'KO' 
                    ? '사주의 균형을 잡아주는 핵심 에너지인 용신(用神)을 기준으로, 나에게 도움이 되는 기운과 방해가 되는 기운을 분류한 거야.' 
                    : 'Based on the Yongshin (Useful God) which balances your chart, these represent the energies that either support or hinder you.'}
                </p>
                
                <div className="space-y-2">
                  <div className="bg-white/5 p-2.5 sm:p-3 rounded-lg border border-green-400/20">
                    <h4 className="font-bold text-green-400 text-xs sm:text-sm mb-0.5">{lang === 'KO' ? '희신 (喜神 - 기쁠 희, 귀신 신)' : 'HeeShin (喜神 - Joyful God)'}</h4>
                    <p className="text-[11px] sm:text-xs text-white/60 mb-1.5">
                      {lang === 'KO' ? '용신을 도와주는 긍정적인 에너지야. 용신이 힘을 잃지 않도록 보좌하는 역할을 해.' : 'Positive energy that supports the Yongshin. It assists the Useful God so it doesn\'t lose power.'}
                    </p>
                    <div className="text-[11px] sm:text-xs bg-black/40 p-1.5 rounded text-green-400/90 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{lang === 'KO' ? '나의 희신:' : 'Your HeeShin:'}</span>
                        {renderYongshinWithElement(result.analysis.yongshinDetail.heeShin.god, true)}
                      </div>
                      
                      {/* 등라계갑 특별 희신 모달 내 표시 */}
                      {shouldApplyDeungRaSpecial && (
                        <div className="mt-1.5 pt-1.5 border-t border-white/5 text-[10px] leading-relaxed text-emerald-300">
                          <span className="font-bold">🌿 등라계갑 [甲(갑목)]: </span>
                          {lang === 'KO' 
                            ? '을목(乙) 일간이 거목에 의지해 비상하는 수호 구조에 해당하여, 전체 비겁(목 오행) 중 갑목(甲)은 기신 작용에서 배제되고 든든한 희신 역할을 수행합니다. 대운과 세운에서 갑목을 만나면 큰 귀인 역량과 일어설 발판을 얻게 됩니다.'
                            : 'Since you have a Deungra-Gyegap structure, the Gap-Wood (甲) is excluded from negative influences and acts as a powerful helper (HeeShin). Meeting Gap-Wood in major/annual cycles triggers magnificent backing and prosperity.'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 p-2.5 sm:p-3 rounded-lg border border-red-400/20">
                    <h4 className="font-bold text-red-400 text-xs sm:text-sm mb-0.5">{lang === 'KO' ? '기신 (忌神 - 꺼릴 기, 귀신 신)' : 'GiShin (忌神 - Taboo God)'}</h4>
                    <p className="text-[11px] sm:text-xs text-white/60 mb-1.5">
                      {lang === 'KO' ? '용신을 극(沖/剋)하여 방해하는 부정적인 에너지야. 이 기운이 강해지면 삶의 균형이 깨지기 쉬워.' : 'Negative energy that attacks or hinders the Yongshin. When this energy is strong, life\'s balance can easily be disrupted.'}
                    </p>
                    <div className="text-[11px] sm:text-xs bg-black/40 p-1.5 rounded text-red-400/90 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{lang === 'KO' ? '나의 기신:' : 'Your GiShin:'}</span>
                        {renderYongshinWithElement(result.analysis.yongshinDetail.giShin.god, true)}
                      </div>
                      
                      {/* 등라계갑 기신 배제 모달 내 안내 */}
                      {shouldApplyDeungRaSpecial && (
                        <div className="mt-1.5 pt-1.5 border-t border-white/5 text-[10px] leading-relaxed text-red-300/80">
                          <span className="font-bold">ℹ️ 등라계갑 갑목(甲) 예외: </span>
                          {lang === 'KO'
                            ? '목 오행이 기신이더라도, 등라계갑 성립으로 인해 갑목(甲)은 기신 작용에서 제외됩니다. (을목(乙) 기운만 경쟁심이나 방해 요인으로 작용합니다.)'
                            : 'Even though Wood is GiShin, Gap-Wood (甲) is excluded due to Deungra-Gyegap. Only Eul-Wood (乙) remains as a negative force.'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white/5 p-2.5 sm:p-3 rounded-lg border border-orange-400/20">
                    <h4 className="font-bold text-orange-400 text-xs sm:text-sm mb-0.5">{lang === 'KO' ? '구신 (仇神 - 원수 구, 귀신 신)' : 'GuShin (仇神 - Enemy God)'}</h4>
                    <p className="text-[11px] sm:text-xs text-white/60 mb-1.5">
                      {lang === 'KO' ? '희신을 극하여 방해하거나, 기신을 도와주는 에너지야. 기신 다음으로 주의해야 할 기운이야.' : 'Energy that attacks the HeeShin or supports the GiShin. It is the second most cautious energy after GiShin.'}
                    </p>
                    <div className="text-[11px] sm:text-xs bg-black/40 p-1.5 rounded text-orange-400/90 flex items-center gap-1.5">
                      <span className="font-bold">{lang === 'KO' ? '나의 구신:' : 'Your GuShin:'}</span>
                      {renderYongshinWithElement(result.analysis.yongshinDetail.guShin.god, true)}
                    </div>
                  </div>

                  {result.analysis.yongshinDetail.hanShin && (
                    <div className="bg-white/5 p-2.5 sm:p-3 rounded-lg border border-blue-400/20">
                      <h4 className="font-bold text-blue-400 text-xs sm:text-sm mb-0.5">{lang === 'KO' ? '한신 (閑神 - 한가할 한, 귀신 신)' : 'HanShin (閑神 - Idle God)'}</h4>
                      <p className="text-[11px] sm:text-xs text-white/60 mb-1.5">
                        {lang === 'KO' ? '용신에 큰 영향을 주지 않는 중립적인 에너지야. 상황에 따라 희신이나 기신을 돕기도 해.' : 'Neutral energy that doesn\'t significantly affect the Yongshin. It may support HeeShin or GiShin depending on the situation.'}
                      </p>
                      <div className="text-[11px] sm:text-xs bg-black/40 p-1.5 rounded text-blue-400/90 flex items-center gap-1.5">
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
      <SoulSummaryCard result={result} lang={lang} userInput={userInput} coords={coords} />

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
      <div className={`fixed bottom-0 left-0 right-0 z-50 pt-6 pb-[calc(1rem+env(safe-area-inset-bottom))] px-4 bg-gradient-to-t from-[#0B0118] via-[#0B0118]/90 to-transparent backdrop-blur-sm pointer-events-none flex justify-center transition-all duration-300 ${guideStep > 0 ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'}`}>
        <div className={`w-full max-w-sm sm:max-w-md ${guideStep > 0 ? 'pointer-events-none' : 'pointer-events-auto'}`}>
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

export const SoulSummaryCard = ({ 
  result, 
  lang,
  userInput,
  coords,
  isSharedView = false
}: { 
  result: BaZiResult, 
  lang: Language,
  userInput?: UserInput,
  coords?: { lat: number; lon: number },
  isSharedView?: boolean
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const summary = React.useMemo(() => generateSoulSummary(result, lang), [result, lang]);
  const dayPillar = result.pillars.find(p => p.title === 'Day');
  const iljuData = dayPillar ? ILJU_DESCRIPTIONS[dayPillar.hanja] : null;
  const [isImageViewMode, setIsImageViewMode] = React.useState(false);
  const [shareState, setShareState] = React.useState<'idle' | 'success' | 'error' | 'copied'>('idle');
  
  // Compact state toggles
  const [isCompact, setIsCompact] = React.useState(isSharedView);
  const [activeTab, setActiveTab] = React.useState<'elements' | 'energy' | 'fortune'>('fortune');

  const handleShare = async () => {
    const zodiacEmojis: Record<string, string> = {
      '子': '🐭',
      '丑': '🐮',
      '寅': '🐯',
      '卯': '🐰',
      '辰': '🐉',
      '巳': '🐍',
      '午': '🐴',
      '未': '🐑',
      '申': '🐵',
      '酉': '🐔',
      '戌': '🐶',
      '亥': '🐷'
    };
    const dayBranch = dayPillar?.branch || '';
    const zZodiacEmoji = zodiacEmojis[dayBranch] || '🌌';

    const title = lang === 'KO' ? '나의 소울 프로필 (V.O.I.D)' : 'My Soul Profile (V.O.O.I.D)';
    const text = lang === 'KO' 
      ? `내 사주로 분석한 영혼의 소울 테마는 [${summary.oneLineReview}]야! 네 우주의 중심 에너지와 행운의 요소를 지금 열어봐 ${zZodiacEmoji}`
      : `My soul profile theme analyzed from my BaZi is [${summary.oneLineReview}]! Open your cosmic core energy and lucky features now ${zZodiacEmoji}`;
    
    let url = window.location.href;
    if (userInput) {
      try {
        const compressed = compressPayload(userInput, coords?.lat, coords?.lon);
        const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(compressed))));
        url = `${window.location.origin}${window.location.pathname}?s=${encodeURIComponent(b64)}&lang=${lang}`;
      } catch (e) {
        console.error("Error generating share URL", e);
      }
    } else {
      // Append or replace language parameter even if url is window.location.href
      try {
        const u = new URL(window.location.href);
        u.searchParams.set('lang', lang);
        url = u.toString();
      } catch (e) {
        url = `${window.location.href}${window.location.href.includes('?') ? '&' : '?'}lang=${lang}`;
      }
    }

    const shareContent = `${text}\n👉 ${url}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareContent,
        });
        setShareState('success');
        setTimeout(() => setShareState('idle'), 3000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareContent);
        }
      }
    } else {
      copyToClipboard(shareContent);
    }
  };

  const copyToClipboard = (textToCopy: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 3000);
      }).catch(() => {
        setShareState('error');
        setTimeout(() => setShareState('idle'), 3000);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 3000);
      } catch (err) {
        setShareState('error');
        setTimeout(() => setShareState('idle'), 3000);
      }
      document.body.removeChild(textArea);
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-6 p-1 bg-gradient-to-br from-neon-pink/20 via-neon-cyan/20 to-neon-purple/20 rounded-[2rem] shadow-[0_0_30px_rgba(255,0,122,0.15)]"
    >
      <div className="bg-black/95 rounded-[1.9rem] border border-white/10 relative overflow-hidden flex flex-col justify-center p-5 sm:p-8 min-h-[500px]">
        {iljuData?.detailImg && (
          <img 
            src={iljuData.cardBg || iljuData.detailImg}
            alt={`${dayPillar?.hanja} Background`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full z-0 opacity-30 object-cover transition-opacity duration-700"
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
          className="relative z-10 flex flex-col items-center text-center space-y-5 w-full"
        >
          {/* Aligned balanced top header row when reading content to prevent visual overlap */}
          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-3 pb-3 border-b border-white/5">
            <div className="inline-block px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-[8px] border border-white/10 text-[10px] font-display font-bold tracking-[0.3em] text-white/40 uppercase shadow-lg">
              Soul Summary Report
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Switcher */}
              <div className="inline-flex p-0.5 bg-white/5 rounded-lg border border-white/10 select-none">
                <button
                  type="button"
                  onClick={() => setIsCompact(true)}
                  className={`px-3 py-1 text-[9px] sm:text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    isCompact 
                      ? 'bg-neon-pink text-white shadow-[0_0_10px_rgba(255,0,122,0.4)]' 
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {lang === 'KO' ? '요약 보기' : 'Quick Glance'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCompact(false)}
                  className={`px-3 py-1 text-[9px] sm:text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    !isCompact 
                      ? 'bg-neon-pink text-white shadow-[0_0_10px_rgba(255,0,122,0.4)]' 
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  {lang === 'KO' ? '전체 보기' : 'Full Scroll'}
                </button>
              </div>

              {!isImageViewMode && iljuData?.detailImg && (
                <button 
                  onClick={() => setIsImageViewMode(true)}
                  className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg bg-neon-pink/10 backdrop-blur-md border border-neon-pink/30 text-[10px] font-bold text-neon-pink hover:text-white hover:bg-neon-pink transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,0,122,0.15)]"
                >
                  <Image className="w-3.5 h-3.5" />
                  {lang === 'KO' ? '원화 보기' : 'View Art'}
                </button>
              )}
            </div>
          </div>
              
          <div className="space-y-2 w-full p-5 bg-black/30 backdrop-blur-[8px] border border-white/10 rounded-2xl shadow-lg">
            <div className="text-neon-pink text-xs font-bold tracking-widest uppercase">{summary.iljuName}</div>
            <h2 className="text-xl sm:text-3xl font-display font-bold text-white tracking-tight leading-tight px-1">
              "{summary.oneLineReview}"
            </h2>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {summary.hashtags.map((tag, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-full bg-black/40 border border-gray-400/40 text-[10px] sm:text-xs text-[#39FF14] font-bold shadow-[0_0_8px_rgba(57,255,20,0.25)] tracking-wide">
                  {tag}
                </span>
              ))}
            </div>
          </div>
              
          {isCompact ? (
            /* Interactive Compact Segmented Tab Layout */
            <div className="w-full flex flex-col space-y-4">
              <div className="w-full flex p-1 bg-white/5 backdrop-blur-[10px] rounded-xl border border-white/10 gap-1 select-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('fortune')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'fortune'
                      ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-lg font-extrabold'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 transition-colors ${activeTab === 'fortune' ? 'text-white' : 'text-neon-pink'}`} />
                  <span className={lang === 'KO' ? 'font-sans' : 'font-display'}>
                    {lang === 'KO' ? '행운 처방' : 'Lucky Vibe'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('energy')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'energy'
                      ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-lg font-extrabold'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 transition-colors ${activeTab === 'energy' ? 'text-white' : 'text-neon-cyan'}`} />
                  <span className={lang === 'KO' ? 'font-sans' : 'font-display'}>
                    {lang === 'KO' ? '핵심 에너지' : 'Core Energy'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('elements')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'elements'
                      ? 'bg-gradient-to-r from-neon-cyan to-emerald-400 text-black shadow-lg font-extrabold'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className={lang === 'KO' ? 'font-sans' : 'font-display'}>
                    {lang === 'KO' ? '오행 밸런스' : 'Elements'}
                  </span>
                </button>
              </div>

              <div className="w-full min-h-[250px] flex items-center">
                <AnimatePresence mode="wait">
                  {activeTab === 'elements' && (
                    <motion.div
                      key="elements-tab"
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex flex-col justify-center items-center"
                    >
                      <div className="w-full bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 shadow-inner space-y-3">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block text-center">
                          {lang === 'KO' ? '오행 밸런스 요약' : 'Cosmic Elemental Balance'}
                        </span>
                        <div className="grid grid-cols-5 gap-2.5 pt-1">
                          {summary.elementStrengths.map((es, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5">
                              <div className="w-full bg-white/5 rounded-full h-20 relative overflow-hidden">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${Math.min(es.percentage, 100)}%` }}
                                  transition={{ delay: 0.05, duration: 0.6, ease: "easeOut" }}
                                  className="absolute bottom-0 left-0 w-full"
                                  style={{ backgroundColor: es.color }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-white/60">{es.name}</span>
                              <span className="text-[9px] font-mono text-white/40 font-semibold">{es.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'energy' && (
                    <motion.div
                      key="energy-tab"
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full text-left bg-black/30 backdrop-blur-[8px] p-5 rounded-2xl border border-white/10 space-y-3 pt-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                          {lang === 'KO' ? '가까이 해야할 핵심에너지' : 'Core Energy to Keep Close'}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-display font-extrabold uppercase tracking-widest transition-colors duration-500">
                          {(() => {
                            const elementStr = summary.coreEnergy.element || '';
                            const parts = elementStr.split(/(\s*[\/·,]\s*|\s+)/g);
                            return parts.map((part, index) => {
                              const isSeparator = /^[\s\/·,]+$/.test(part);
                              if (isSeparator) {
                                return (
                                  <span key={index} className="text-slate-400 dark:text-white/40 mx-0.5">
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
                                    textShadow: isLight ? 'none' : `0 0 10px ${color}55`
                                  }}
                                  className="transition-all duration-300"
                                >
                                  {part}
                                </span>
                              );
                            });
                          })()}
                        </h3>
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed font-sans mt-1 ${isLight ? 'text-slate-700' : 'text-white/80'}`}>
                        {summary.coreEnergy.description}
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'fortune' && (
                    <motion.div
                      key="fortune-tab"
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full space-y-3.5 text-left"
                    >
                      <div className="p-4 bg-black/30 backdrop-blur-[8px] rounded-xl border border-white/10 text-left space-y-1">
                        <div className="flex items-center gap-1.5 text-neon-pink">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">{lang === 'KO' ? '행동 처방전' : 'Action Prescription'}</span>
                        </div>
                        <p className={`text-xs leading-normal font-sans ${isLight ? 'text-slate-800 font-medium' : 'text-white/85'}`}>{summary.actionPrescription}</p>
                      </div>

                      <div className="p-4 bg-black/30 backdrop-blur-[8px] rounded-xl border border-white/10 text-left space-y-1">
                        <div className="flex items-center gap-1.5 text-neon-cyan">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">{lang === 'KO' ? '행운의 습관' : 'Lucky Habit'}</span>
                        </div>
                        <p className={`text-[11px] leading-normal font-sans ${isLight ? 'text-slate-800 font-medium' : 'text-white/80'}`}>{summary.coreEnergy.luckyHabit}</p>
                      </div>

                      <div className="p-4 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 text-left space-y-2">
                        <div className={`px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 border ${
                          isLight 
                            ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20 text-emerald-800' 
                            : 'bg-gradient-to-r from-[#39FF14]/15 via-[#39FF14]/5 to-transparent border-[#39FF14]/20 text-[#39FF14]'
                        } mb-1.5`}>
                          <span className="text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                            🍀 {lang === 'KO' ? '최고의 시너지 행운 아이템' : 'Lucky Synergy Items'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {summary.luckyItems.map((item, i) => (
                            <div key={i} className="p-2 bg-white/5 rounded-lg border border-white/5 text-left">
                              <div className="text-[10px] text-neon-purple font-bold uppercase block leading-none mb-1">{item.name}</div>
                              <p className={`text-[10px] leading-snug font-sans ${isLight ? 'text-slate-500 font-medium' : 'text-white/50'}`}>{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* Traditional Full Scroll Layout */
            <>
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
                  <p className={`text-lg sm:text-xl font-medium leading-relaxed mt-2 ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
                    {summary.coreEnergy.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 bg-black/30 backdrop-blur-[8px] rounded-2xl border border-white/10 shadow-lg text-left space-y-2">
                    <div className="flex items-center gap-2 text-neon-pink">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{lang === 'KO' ? '이번 달 행동 처방전' : 'Action Prescription'}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-800 font-medium' : 'text-white/70'}`}>{summary.actionPrescription}</p>
                  </div>
                  
                  <div className="p-5 bg-black/30 backdrop-blur-[8px] rounded-2xl border border-white/10 shadow-lg text-left space-y-2">
                    <div className="flex items-center gap-2 text-neon-cyan">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">{lang === 'KO' ? '행운의 습관' : 'Lucky Habit'}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-800 font-medium' : 'text-white/70'}`}>{summary.coreEnergy.luckyHabit}</p>
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
                          <p className={`text-[11px] leading-snug ${isLight ? 'text-slate-600 font-medium' : 'text-white/70'}`}>{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4 p-5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg flex flex-col justify-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase self-center border ${
                      isLight 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800' 
                        : 'bg-white/5 border border-white/10 text-[#39FF14]'
                    }`}>
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
            </>
          )}
          
          {!isSharedView && (
            <div className="pt-4 w-full relative">
              <button 
                onClick={handleShare}
                className={`w-full py-4 rounded-2xl cursor-pointer flex items-center justify-center gap-2 font-black active:scale-[0.98] transition-all duration-300 mb-2 
                  ${isLight 
                    ? 'bg-gradient-to-r from-[#5f46eb] via-[#8539f8] to-[#ea187c] shadow-[0_5px_22px_rgba(95,70,235,0.45)] hover:shadow-[0_8px_30px_rgba(95,70,235,0.65)] border border-white/40 hover:scale-[1.02]' 
                    : 'bg-gradient-to-r from-neon-pink/30 via-neon-purple/40 to-neon-cyan/30 shadow-[0_0_20px_rgba(250,30,142,0.3)] hover:shadow-[0_0_30px_rgba(5,230,255,0.5)] border border-white/30 hover:border-white/60 hover:scale-[1.02]'
                  } 
                  ${lang === 'KO' ? 'font-sans text-[15px] tracking-wide' : 'font-display text-sm tracking-widest uppercase'}`}
              >
                <Share2 className="w-4 h-4 animate-bounce text-white" style={{ stroke: '#ffffff', filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.85)) drop-shadow(-1px -1px 0 #000) drop-shadow(1px 1px 0 #000)' }} />
                <span className="high-contrast-neon-text">
                  {lang === 'KO' ? '나의 소울 리포트 공유하기' : 'Share My Soul Report'}
                </span>
              </button>

              <AnimatePresence>
                {shareState !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: -35, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    className={`fixed top-24 left-1/2 -translate-x-1/2 z-[10000] flex items-center gap-2 px-6 py-3 rounded-full min-w-[280px] justify-center transition-all duration-300 border
                      ${isLight 
                        ? 'bg-white/95 backdrop-blur-md border-black/10 shadow-[0_10px_35px_rgba(0,0,0,0.12)]' 
                        : 'bg-black/90 backdrop-blur-md border-white/20 shadow-[0_10px_35px_rgba(0,0,0,0.6)]'
                      }`}
                  >
                    {shareState === 'copied' && (
                      <>
                        <span className="text-neon-cyan font-bold">🔗</span>
                        <span className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {lang === 'KO' ? '링크 복사 완료! 원하는 메신저/인스타에 붙여넣어봐!' : 'Link copied! Paste it anywhere!'}
                        </span>
                      </>
                    )}
                    {shareState === 'success' && (
                      <>
                        <span className="text-emerald-400 font-bold">🎉</span>
                        <span className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {lang === 'KO' ? '소울 리포트 공유 성공!' : 'Soul report shared successfully!'}
                        </span>
                      </>
                    )}
                    {shareState === 'error' && (
                      <>
                        <span className="text-rose-400 font-bold">😢</span>
                        <span className={`text-xs sm:text-sm font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {lang === 'KO' ? '링크 복사에 실패했어. 브라우저 주소창을 복사해줘!' : 'Failed to copy URL.'}
                        </span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const FiveElementsDiagram = ({ lang, isLight }: { lang: 'KO' | 'EN'; isLight: boolean }) => {
  const [hovered, setHovered] = React.useState<string | null>(null);
  
  // 5대 원소의 중심 좌표와 설정
  const cx = 250;
  const cy = 200;
  const rPosition = 125; // 배치 반경 (외곽 화살표를 위해 크기 조절)
  const rBadge = 34;    // 개별 원소 원의 반경
  
  // Element 정보 정의
  const elements = [
    { id: 'Fire', ko: '화', en: 'Fire', han: '火', emoji: '🔥', angle: -90, color: ELEMENT_COLORS.Fire, nextId: 'Earth', keId: 'Metal', descKo: '뜨겁게 타오르는 불씨. 열정, 발산, 추진력을 상징합니다.', descEn: 'Passionate bright flame. Symbol of energy, expression and warmth.' },
    { id: 'Earth', ko: '토', en: 'Earth', han: '土', emoji: '🏔️', angle: -18, color: ELEMENT_COLORS.Earth, nextId: 'Metal', keId: 'Water', descKo: '묵묵히 품어주는 대지. 수용, 중재, 포용력을 상징합니다.', descEn: 'Mother nature, soil, foundation. Symbol of stability and balancing.' },
    { id: 'Metal', ko: '금', en: 'Metal', han: '金', emoji: '⚔️', angle: 54, color: ELEMENT_COLORS.Metal, nextId: 'Water', keId: 'Wood', descKo: '단단하고 날카로운 광물. 정밀, 결단, 결실의 기운입니다.', descEn: 'Forged steel, gems, minerals. Symbol of clarity, structure and decision.' },
    { id: 'Water', ko: '수', en: 'Water', han: '水', emoji: '💧', angle: 126, color: ELEMENT_COLORS.Water, nextId: 'Wood', keId: 'Fire', descKo: '유연하게 흘러가는 생명수. 지혜, 침잠, 응집을 나타냅니다.', descEn: 'Flowing clear water, depths. Symbol of intelligence, mystery and storage.' },
    { id: 'Wood', ko: '목', en: 'Wood', han: '木', emoji: '🌱', angle: 198, color: ELEMENT_COLORS.Wood, nextId: 'Fire', keId: 'Earth', descKo: '하늘을 향해 뻗어가는 새싹. 성장, 생명력, 기획력을 상징합니다.', descEn: 'Sprouting new seedling, tree. Symbol of growth, life-force and begin.' },
  ];

  // 각 원소의 좌표 계산
  const coords = elements.reduce((acc, el) => {
    const rad = (el.angle * Math.PI) / 180;
    acc[el.id] = {
      x: cx + rPosition * Math.cos(rad),
      y: cy + rPosition * Math.sin(rad),
    };
    return acc;
  }, {} as Record<string, { x: number; y: number }>);

  // 상생(Sheng) 연결선 데이터 준비 (M x1 y1 A r r 0 0 1 x2 y2)
  const shengArcs = elements.map((el, index) => {
    const nextEl = elements[(index + 1) % 5];
    
    // 시작과 끝 각도 (라디안 단위)
    const radStart = ((el.angle + 20) * Math.PI) / 180;
    const radEnd = ((nextEl.angle - 20) * Math.PI) / 180;
    
    // 외곽에 호를 그리므로 반경을 rPosition + 12 정도로 세팅
    const rArc = rPosition + 14;
    const sx = cx + rArc * Math.cos(radStart);
    const sy = cy + rArc * Math.sin(radStart);
    const ex = cx + rArc * Math.cos(radEnd);
    const ey = cy + rArc * Math.sin(radEnd);
    
    // 텍스트 위치 계산 (중간 지점 바깥쪽)
    const radMid = (((el.angle + nextEl.angle) / 2) * Math.PI) / 180;
    // Wood -> Fire 은 각도가 198에서 -90이므로 보정 필요
    let compensatedRadMid = radMid;
    if (el.id === 'Wood' && nextEl.id === 'Fire') {
      compensatedRadMid = (((198 + 270) / 2) * Math.PI) / 180;
    }
    const tx = cx + (rArc + 12) * Math.cos(compensatedRadMid);
    const ty = cy + (rArc + 12) * Math.sin(compensatedRadMid);
    
    const isRelated = hovered === el.id || hovered === nextEl.id;

    return {
      source: el.id,
      target: nextEl.id,
      path: `M ${sx} ${sy} A ${rArc} ${rArc} 0 0 1 ${ex} ${ey}`,
      tx,
      ty,
      isRelated,
      color: el.color,
    };
  });

  // 상극(Ke) 연결선 데이터 준비 (Straight lines forming a star)
  const keLines = elements.map((el) => {
    const targetEl = elements.find(item => item.id === el.keId)!;
    const pA = coords[el.id];
    const pB = coords[targetEl.id];
    
    // 벡터 계산하여 노드의 외곽선 밖에서 시작하도록 조절
    const dx = pB.x - pA.x;
    const dy = pB.y - pA.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / dist;
    const uy = dy / dist;
    
    // 시작점 (Node A 외곽)
    const sx = pA.x + ux * rBadge;
    const sy = pA.y + uy * rBadge;
    // 끝점 (Node B 외곽 - 화살표 자리를 위해 조금 넉넉히)
    const ex = pB.x - ux * (rBadge + 10);
    const ey = pB.y - uy * (rBadge + 10);
    
    const isRelated = hovered === el.id || hovered === targetEl.id;

    return {
      source: el.id,
      target: targetEl.id,
      sx, sy, ex, ey,
      isRelated
    };
  });

  // 호버 중인 정보 텍스트 결정
  const activeDetail = elements.find(el => el.id === hovered);

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 font-sans flex flex-col items-center w-full ${
      isLight 
        ? 'bg-slate-50/70 border-slate-200/80 shadow-sm' 
        : 'bg-zinc-950/30 border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-md'
    }`}>
      {/* 타이틀 및 가이드 범례 */}
      <div className="w-full text-center mb-2">
        <h5 className={`text-base font-bold flex items-center justify-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-white'}`}>
          🌐 {lang === 'KO' ? '오행 상생 상극도 (五行 相生相剋圖)' : 'Five Elements Generating & Overcoming Cycle'}
        </h5>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          {lang === 'KO' ? '각 오행 위에 마우스를 올려 상생과 상극 관계의 흐름을 확인해 보세요.' : 'Hover over elements to trace and visualize interaction dynamics.'}
        </p>
      </div>

      <div className="relative w-full max-w-[480px] flex flex-col items-center">
        {/* SVG 영역 */}
        <svg viewBox="0 0 500 420" className="w-full h-auto overflow-visible select-none">
          <defs>
            {/* 상생 화살표 마커 (녹색 계열) */}
            <marker id="arrow-sheng" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
            </marker>
            {/* 상극 화살표 마커 (적색 계열) */}
            <marker id="arrow-ke" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#EF4444" />
            </marker>
            
            {/* 활성화된 상생 화살표 마커 (강조용 녹색) */}
            <marker id="arrow-sheng-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#34D399" />
            </marker>
            {/* 활성화된 상극 화살표 마커 (강조용 적색) */}
            <marker id="arrow-ke-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#F87171" />
            </marker>
          </defs>

          {/* 1. 배경 가이드 원 (상생 원궤도) */}
          <circle cx={cx} cy={cy} r={rPosition} fill="none" stroke={isLight ? '#E2E8F0' : '#27272A'} strokeWidth="1" strokeDasharray="3 3" />

          {/* 2. 상생(Sheng, 녹색 아크) 라인 그리기 */}
          {shengArcs.map((arc, i) => {
            const opacity = hovered ? (arc.isRelated ? 1.0 : 0.15) : 0.65;
            const strokeColor = arc.isRelated ? '#34D399' : '#10B981';
            const marker = arc.isRelated ? 'url(#arrow-sheng-active)' : 'url(#arrow-sheng)';
            const strokeWidth = arc.isRelated ? 3 : 1.8;
            
            return (
              <g key={`sheng-${i}`} style={{ transition: 'opacity 0.3s ease' }} opacity={opacity}>
                <path
                  d={arc.path}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  markerEnd={marker}
                  className="transition-all"
                  strokeDasharray={arc.isRelated ? '4 2' : 'none'}
                />
                {/* '생 (生)' 라벨 */}
                <rect
                  x={arc.tx - 18}
                  y={arc.ty - 10}
                  width="36"
                  height="18"
                  rx="6"
                  fill={isLight ? '#E6F4EA' : '#0B2519'}
                  stroke={arc.isRelated ? '#10B981' : 'transparent'}
                  strokeWidth="0.8"
                />
                <text
                  x={arc.tx}
                  y={arc.ty + 3}
                  textAnchor="middle"
                  fill="#10B981"
                  fontSize="9.5"
                  fontWeight="black"
                  className="font-sans"
                >
                  {lang === 'KO' ? '생 (生)' : 'Gen'}
                </text>
              </g>
            );
          })}

          {/* 3. 상극(Ke, 적색 별모양 직선) 라인 그리기 */}
          {keLines.map((ke, i) => {
            const opacity = hovered ? (ke.isRelated ? 1.0 : 0.12) : 0.6;
            const strokeColor = ke.isRelated ? '#F87171' : '#EF4444';
            const marker = ke.isRelated ? 'url(#arrow-ke-active)' : 'url(#arrow-ke)';
            const strokeWidth = ke.isRelated ? 2.5 : 1.5;

            return (
              <g key={`ke-${i}`} style={{ transition: 'opacity 0.3s ease' }} opacity={opacity}>
                <line
                  x1={ke.sx}
                  y1={ke.sy}
                  x2={ke.ex}
                  y2={ke.ey}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  markerEnd={marker}
                  className="transition-all"
                  strokeDasharray={ke.isRelated ? '3 1.5' : 'none'}
                />
              </g>
            );
          })}

          {/* 4. 정중앙 '극 (剋)' 동그라미 배치 (상극도 중앙) */}
          <g opacity={hovered ? 0.3 : 1} style={{ transition: 'opacity 0.3s' }}>
            <circle
              cx={cx}
              cy={cy}
              r="22"
              fill={isLight ? '#FCE8E6' : '#2D1616'}
              stroke="#EA4335"
              strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }}
            />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fill="#EA4335"
              fontSize={lang === 'KO' ? "12" : "9.5"}
              fontWeight="black"
              className="font-sans"
            >
              {lang === 'KO' ? '극 (剋)' : 'Control'}
            </text>
          </g>

          {/* 5. 오행 원소 노드 렌더링 */}
          {elements.map((el) => {
            const pos = coords[el.id];
            const isHovered = hovered === el.id;
            const isScale = isHovered;
            const opacity = hovered ? (isHovered ? 1 : 0.4) : 1;
            
            // 그라디언트 및 링 효과를 위한 개별 오행 컬러
            const elementColor = el.color;

            return (
              <g
                key={el.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(el.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', opacity }}
              >
                {/* 빛나는 오프셋 배경 링 (호버시) */}
                <circle
                  cx="0"
                  cy="0"
                  r={rBadge + 6}
                  fill="none"
                  stroke={elementColor}
                  strokeWidth={isScale ? 3 : 0}
                  className="transition-all duration-300"
                  opacity="0.35"
                  strokeDasharray="4 2"
                />

                {/* 메인 배지 원 */}
                <circle
                  cx="0"
                  cy="0"
                  r={rBadge}
                  fill={isLight ? '#FFFFFF' : '#18181B'}
                  stroke={elementColor}
                  strokeWidth="2.5"
                  style={{
                    filter: isHovered 
                      ? `drop-shadow(0 0 12px ${elementColor}aa)` 
                      : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
                  }}
                  className="transition-all duration-300"
                />

                {/* 이중 안쪽 얇은 선 */}
                <circle
                  cx="0"
                  cy="0"
                  r={rBadge - 4}
                  fill="none"
                  stroke={isLight ? '#F3F4F6' : '#27272A'}
                  strokeWidth="1"
                />

                {/* 이모지 및 한자 */}
                <text x="0" y="-4" textAnchor="middle" fontSize="17" className="select-none leading-none">
                  {el.emoji}
                </text>
                <text
                  x="0"
                  y="16"
                  textAnchor="middle"
                  fill={isLight ? '#1F2937' : '#E4E4E7'}
                  fontSize="12.5"
                  fontWeight="900"
                  className="font-sans tracking-wide"
                >
                  {el.han}
                </text>

                {/* 외곽 텍스트 라벨 (목/木, 화/火 등 - 위치 제어) */}
                {(() => {
                  let labelOffset: { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' } = { dx: 0, dy: 0, anchor: 'middle' };
                  if (el.id === 'Fire') { labelOffset = { dx: 0, dy: -(rBadge + 14), anchor: 'middle' }; }
                  else if (el.id === 'Earth') { labelOffset = { dx: rBadge + 14, dy: 5, anchor: 'start' }; }
                  else if (el.id === 'Metal') { labelOffset = { dx: rBadge, dy: rBadge + 4, anchor: 'start' }; }
                  else if (el.id === 'Water') { labelOffset = { dx: -rBadge, dy: rBadge + 4, anchor: 'end' }; }
                  else if (el.id === 'Wood') { labelOffset = { dx: -(rBadge + 14), dy: 5, anchor: 'end' }; }

                  return (
                    <g transform={`translate(${labelOffset.dx}, ${labelOffset.dy})`}>
                      <text
                        x="0"
                        y="0"
                        textAnchor={labelOffset.anchor}
                        fill={isLight ? '#111827' : '#FFFFFF'}
                        fontSize="12"
                        fontWeight="black"
                        className="font-sans"
                      >
                        {lang === 'KO' ? `${el.ko} (${el.han})` : `${el.en}`}
                      </text>
                      {/* 서브텍스트 한글/영어 */}
                      <text
                        x="0"
                        y="12"
                        textAnchor={labelOffset.anchor}
                        fill={isLight ? '#6B7280' : '#A1A1AA'}
                        fontSize="9.5"
                        fontWeight="bold"
                        className="font-mono tracking-tighter"
                      >
                        {lang === 'KO' ? el.en : el.ko}
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </svg>

        {/* 인터랙티브 말풍선 카드 설명란 (선택된 요소에 맞춰 정보 제공) */}
        <div style={{ minHeight: '64px' }} className="w-full mt-2 transition-all duration-300">
          {activeDetail ? (
            <div 
              className={`p-3 rounded-xl border text-xs leading-relaxed transition-all duration-300 ${isLight ? 'bg-white shadow' : 'bg-white/5 backdrop-blur-sm'}`}
              style={{ borderColor: activeDetail.color + '60' }}
            >
              <div className="flex items-center gap-1.5 font-bold text-sm mb-1" style={{ color: activeDetail.color }}>
                <span>{activeDetail.emoji}</span>
                <span>{lang === 'KO' ? `${activeDetail.ko}(${activeDetail.han}) 기운` : `${activeDetail.en} Energy`}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isLight ? 'bg-slate-100/80 text-slate-500' : 'bg-white/10 text-zinc-400'}`}>
                  {lang === 'KO' ? '순환 중심' : 'Cycle Guide'}
                </span>
              </div>
              <p className={isLight ? 'text-slate-600' : 'text-zinc-300'}>
                {lang === 'KO' ? activeDetail.descKo : activeDetail.descEn}
              </p>
              
              {/* 상생 상극 요약 칩 표시 */}
              <div className="flex flex-wrap items-center gap-4 mt-2 pt-2 border-t border-dashed border-zinc-200/40">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className={`font-semibold mr-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {lang === 'KO' ? '상생:' : 'Generating (Saeng):'}
                  </span>
                  <span className="font-bold flex items-center gap-1">
                    {(() => {
                      const sourceEl = activeDetail;
                      const shengTarget = elements.find(item => item.id === sourceEl.nextId)!;
                      return (
                        <>
                          <span style={{ color: sourceEl.color }}>
                            {lang === 'KO' ? sourceEl.han : `${sourceEl.han} (${sourceEl.en})`}
                          </span>
                          <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>➔</span>
                          <span style={{ color: shengTarget.color }}>
                            {lang === 'KO' ? shengTarget.han : `${shengTarget.han} (${shengTarget.en})`}
                          </span>
                        </>
                      );
                    })()}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span className={`font-semibold mr-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {lang === 'KO' ? '상극:' : 'Overcoming (Keuk):'}
                  </span>
                  <span className="font-bold flex items-center gap-1">
                    {(() => {
                      const sourceEl = activeDetail;
                      const keTarget = elements.find(item => item.id === sourceEl.keId)!;
                      return (
                        <>
                          <span style={{ color: sourceEl.color }}>
                            {lang === 'KO' ? sourceEl.han : `${sourceEl.han} (${sourceEl.en})`}
                          </span>
                          <span className={`text-xs ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>➔</span>
                          <span style={{ color: keTarget.color }}>
                            {lang === 'KO' ? keTarget.han : `${keTarget.han} (${keTarget.en})`}
                          </span>
                        </>
                      );
                    })()}
                  </span>
                </span>
              </div>
            </div>
          ) : (
            <div className={`p-4 rounded-xl border border-dashed text-center text-xs leading-relaxed ${
              isLight ? 'border-slate-200 bg-slate-100/10 text-slate-400' : 'border-white/5 bg-white/[0.01] text-zinc-500'
            }`}>
              {lang === 'KO' 
                ? '💡 오행의 특정 원소를 마우스로 가리키면 구체적인 상생(生)·상극(剋) 순환 흐름 카드가 활성화됩니다.'
                : '💡 Hover over any element circle to unlock real-time generation and overcoming cycle details.'
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
