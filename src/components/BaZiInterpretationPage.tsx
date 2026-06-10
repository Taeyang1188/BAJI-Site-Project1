import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Award, Compass, Heart, AlertCircle, Shield,
  User, Landmark, Calendar, Activity, Zap, Check,
  ArrowLeft, Gem, Briefcase, Eye, ThumbsUp, RefreshCw, Share2
} from 'lucide-react';
import { BaZiResult, UserInput, Language } from '../types';
import { generateBaziInterpretation, BaziInterpretationData } from '../services/bazi-interpretation-service';
import { useTheme } from '../contexts/ThemeContext';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { ILJU_DESCRIPTIONS } from '../constants/ilju-descriptions';
import { compressToShortId } from '../services/share-compress-service';

interface BaZiInterpretationPageProps {
  result: BaZiResult;
  lang: Language;
  userInput: UserInput;
  coords?: { lat: number; lon: number };
  onBack: () => void;
  isSharedView?: boolean;
  onStartAnalysis?: () => void;
  skipLoading?: boolean;
  onLoadingComplete?: () => void;
}

const ELEMENT_STYLES = {
  Wood: { color: '#39FF14', bg: 'bg-[#39FF14]/10', border: 'border-[#39FF14]/30', ko: '목(木)', name: 'Wood' },
  Fire: { color: '#FF2A6D', bg: 'bg-[#FF2A6D]/10', border: 'border-[#FF2A6D]/30', ko: '화(火)', name: 'Fire' },
  Earth: { color: '#FFD700', bg: 'bg-[#FFD700]/10', border: 'border-[#FFD700]/30', ko: '토(土)', name: 'Earth' },
  Metal: { color: '#E2E8F0', bg: 'bg-white/10', border: 'border-white/20', ko: '금(金)', name: 'Metal' },
  Water: { color: '#00F3FF', bg: 'bg-[#00F3FF]/10', border: 'border-[#00F3FF]/30', ko: '수(水)', name: 'Water' }
};

const ELEMENT_STYLES_LIGHT = {
  Wood: { color: '#059669', bg: 'bg-[#059669]/10', border: 'border-[#059669]/30', ko: '목(木)', name: 'Wood' },
  Fire: { color: '#E11D48', bg: 'bg-[#E11D48]/10', border: 'border-[#E11D48]/30', ko: '화(火)', name: 'Fire' },
  Earth: { color: '#B45309', bg: 'bg-[#B45309]/10', border: 'border-[#B45309]/30', ko: '토(土)', name: 'Earth' },
  Metal: { color: '#52525B', bg: 'bg-[#52525B]/10', border: 'border-[#52525B]/30', ko: '금(金)', name: 'Metal' },
  Water: { color: '#2563EB', bg: 'bg-[#2563EB]/10', border: 'border-[#2563EB]/30', ko: '수(수)', name: 'Water' }
};

const ZODIAC_EMOJIS: Record<string, string> = {
  '子': '🐭', '丑': '🐮', '寅': '🐯', '卯': '🐰', '辰': '🐉', '巳': '🐍',
  '午': '🐴', '未': '🐑', '申': '🐵', '酉': '🐔', '戌': '🐶', '亥': '🐷'
};

const formatKeyPillarsEn = (keyPillars: { pillarTitle: string; type: 'stem' | 'branch' }[]) => {
  const stems = keyPillars.filter(kp => kp.type === 'stem').map(kp => kp.pillarTitle);
  const branches = keyPillars.filter(kp => kp.type === 'branch').map(kp => kp.pillarTitle);
  
  const parts: string[] = [];
  if (stems.length > 0) {
    if (stems.length === 1) {
      parts.push(`${stems[0]} Stem`);
    } else {
      parts.push(`${stems.join(', ')} Stems`);
    }
  }
  if (branches.length > 0) {
    if (branches.length === 1) {
      parts.push(`${branches[0]} Branch`);
    } else {
      parts.push(`${branches.join(', ')} Branches`);
    }
  }
  return parts.join(' · ');
};

export default function BaZiInterpretationPage({
  result,
  lang,
  userInput,
  coords,
  onBack,
  isSharedView = false,
  onStartAnalysis,
  skipLoading = false,
  onLoadingComplete
}: BaZiInterpretationPageProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const elementStyles = isLight ? ELEMENT_STYLES_LIGHT : ELEMENT_STYLES;
  const woodColor = isLight ? '#059669' : '#39FF14';
  const cyanColor = isLight ? '#0284c7' : '#00F3FF';
  const pinkColor = isLight ? '#E11D48' : '#FF2A6D';
  const purpleColor = isLight ? '#7C3AED' : '#9B30FF';

  const [isLoading, setIsLoading] = useState(!skipLoading);
  const [progress, setProgress] = useState(skipLoading ? 100 : 0);
  const [activeStep, setActiveStep] = useState(skipLoading ? 7 : 0);

  const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle');

  const handleShare = async () => {
    const title = lang === 'KO' ? '나의 소울 프로필 (V.O.I.D)' : 'My Soul Profile (V.O.I.D)';
    
    // Extract clean title inside single quotes if present
    const quoteMatch = data.profile.title.match(/'([^']+)'/);
    let cleanTitle = data.profile.title;
    if (quoteMatch) {
      const typeName = quoteMatch[1];
      const suffix = lang === 'KO' ? ' 유형' : ' Type';
      cleanTitle = `'${typeName}'${suffix}`;
    } else if (data.profile.title.startsWith('[')) {
      cleanTitle = data.profile.title.slice(1).replace(']', ':');
    }

    const text = lang === 'KO' 
      ? `내 사주로 분석한 영혼의 소울 테마는 [${cleanTitle}]야! 네 우주의 중심 에너지와 행운의 요소를 지금 열어봐 🌌`
      : `My soul profile theme analyzed from my BaZi is [${cleanTitle}]! Open your cosmic core energy and lucky features now 🌌`;
    
    let url = window.location.href;
    if (userInput) {
      try {
        const shortId = compressToShortId(userInput, coords?.lat, coords?.lon);
        const b64 = btoa(unescape(encodeURIComponent(shortId)))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
        url = `${window.location.origin}${window.location.pathname}?s=${encodeURIComponent(b64)}&lang=${lang}`;
      } catch (e) {
        console.error("Error generating share URL", e);
      }
    }

    const shareContent = `${text}\n👉 ${url}`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareContent).then(() => {
        setShareState('copied');
        setTimeout(() => setShareState('idle'), 3000);
      }).catch(() => {
        setShareState('error');
        setTimeout(() => setShareState('idle'), 3000);
      });
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareContent;
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

  // Generate Bazi Interpretation data
  const data: BaziInterpretationData = useMemo(() => {
    return generateBaziInterpretation(result, userInput, lang);
  }, [result, userInput, lang]);

  const [checkedPlans, setCheckedPlans] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    setCheckedPlans([false, false, false]);
  }, [data]);

  // Derive day pillar info for use in JSX
  const dayPillar = result.pillars?.find(p => p.title === 'Day');
  const dayMasterStem = dayPillar?.stem || '戊';
  const dayMasterElement = dayPillar?.element || 'Earth';

  const iljuData = useMemo(() => {
    return dayPillar ? ILJU_DESCRIPTIONS[dayPillar.hanja as keyof typeof ILJU_DESCRIPTIONS] : null;
  }, [dayPillar]);

  const iljuText = useMemo(() => {
    if (!iljuData) return lang === 'KO' ? '부드러우면서도 단단하며 조화를 이루는 영혼입니다.' : 'A gentle yet firm and harmonious soul.';
    const baseText = lang === 'KO' ? iljuData.ko : iljuData.en;
    // 첫 문장(일주 소개)을 제거하고 뒤쪽 해설을 가져옵니다.
    const bodyText = baseText.replace(/.*?\./, '').trim();
    
    // 인상평(impression)이 있으면 결합해줍니다.
    if (iljuData.impression && lang === 'KO') {
      return `${bodyText} ${iljuData.impression}`;
    }
    return bodyText;
  }, [iljuData, lang]);

  // Loading Steps Config
  const loadingSteps = useMemo(() => {
    return lang === 'KO' ? [
      `${data.userName}님의 사주팔자 8글자 스캔 중...`,
      `타고난 성격과 일간 기질 분석 중...`,
      `일주의 물상 정보(핵심 이미지) 수집 완료`,
      `십성 비율 및 오행 밸런스 측정 완료`,
      `${data.userName}님의 사주 특별 성향(격국) 감지 중...`,
      `당신의 상위 잠재력 속성 ${data.traitScores.slice(0, 3).map(t => t.name).join(', ')} 측정 완료`,
      `대운-세운 타이밍 흐름 교차 분석 중...`,
      `${data.userName}님 전용 맞춤 해설 리포트 작성 완료!`
    ] : [
      `Scanning ${data.userName}'s 8 Bazi Characters...`,
      `Analyzing Innate Temperament and Day Master...`,
      `Collecting Pillar Metaphor and Imagery...`,
      `Measuring Ten Gods Ratios and Element Balance...`,
      `Detecting special Bazi structures...`,
      `Calculating top potential traits: ${data.traitScores.slice(0, 3).map(t => t.name).join(', ')}...`,
      `Analyzing Luck Cycles (Daeun/Seeun)...`,
      `Customized Interpretation Report ready!`
    ];
  }, [data, lang]);

  // Loading effect
  useEffect(() => {
    if (skipLoading) {
      onLoadingComplete?.();
      return;
    }
    let timer: number;
    let currentProgress = 0;
    let currentStep = 0; // 로컬 변수로 단계 추적 (state 의존성 제거)

    const tick = () => {
      currentProgress += Math.random() * 2.7 + 1; // 기존 대비 약 3배 느리게
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
          onLoadingComplete?.();
        }, 600); // 완료 후 여운 600ms
      } else {
        setProgress(Math.floor(currentProgress));

        // Progress steps mapping - activeStep state 대신 로컬 변수 사용
        const stepIdx = Math.floor((currentProgress / 100) * loadingSteps.length);
        if (stepIdx !== currentStep && stepIdx < loadingSteps.length) {
          currentStep = stepIdx;
          setActiveStep(stepIdx);
        }

        timer = window.setTimeout(tick, 180 + Math.random() * 120); // 기존 대비 약 3배 느린 간격
      }
    };

    timer = window.setTimeout(tick, 50);
    return () => clearTimeout(timer);
  }, [loadingSteps, skipLoading]);

  // Render loading screen
  if (isLoading) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-300 ${
        isLight ? 'bg-[#FAF9F6] text-neutral-900' : 'bg-[#0B0118] text-white'
      }`}>
        {/* Decorative Blur Backgrounds */}
        <div className={`absolute top-[20%] left-[20%] w-72 h-72 rounded-full blur-[120px] pointer-events-none ${
          isLight ? 'bg-rose-400/10' : 'bg-neon-pink/15'
        }`} />
        <div className={`absolute bottom-[20%] right-[20%] w-80 h-80 rounded-full blur-[120px] pointer-events-none ${
          isLight ? 'bg-sky-400/10' : 'bg-neon-cyan/15'
        }`} />

        <div className="w-full max-w-lg space-y-8 relative z-10 flex flex-col items-center">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 animate-[pulse_1.5s_infinite] mx-auto border ${
              isLight 
                ? 'bg-rose-50 border-rose-200/50 text-rose-500' 
                : 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink'
            }`}>
              <RefreshCw className="w-7 h-7 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <h2 className={`text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r font-display ${
              isLight 
                ? 'from-rose-500 via-purple-600 to-sky-600' 
                : 'from-neon-pink via-neon-purple to-neon-cyan'
            }`}>
              {lang === 'KO' ? '운명의 실타래 해체 중' : 'Decoding Cosmic DNA'}
            </h2>
            <p className={`text-xs uppercase tracking-widest font-mono ${
              isLight ? 'text-neutral-400' : 'text-white/40'
            }`}>
              Analyzing BaZi Matrix
            </p>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full space-y-2">
            <div className={`flex justify-between text-xs font-mono ${
              isLight ? 'text-neutral-500' : 'text-white/50'
            }`}>
              <span>{lang === 'KO' ? '분석 진행도' : 'Analysis Progress'}</span>
              <span className={`font-bold ${isLight ? 'text-sky-600' : 'text-neon-cyan'}`}>{progress}%</span>
            </div>
            <div className={`w-full rounded-full h-3 overflow-hidden p-[2px] border ${
              isLight ? 'bg-neutral-200/50 border-neutral-300/50' : 'bg-white/5 border-white/10'
            }`}>
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${
                  isLight 
                    ? 'from-rose-500 via-purple-500 to-sky-500 shadow-[0_0_10px_rgba(2,132,199,0.2)]' 
                    : 'from-neon-pink via-neon-purple to-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                }`}
                style={{ width: `${progress}%` }}
                layout
              />
            </div>
          </div>

          {/* Loading Steps Checklist */}
          <div className={`w-full p-5 rounded-3xl border space-y-3 font-sans h-64 overflow-y-auto custom-scrollbar shadow-inner ${
            isLight 
              ? 'bg-white/80 border-black/5' 
              : 'bg-black/40 border-white/5'
          }`}>
            {loadingSteps.map((step, idx) => {
              const isCompleted = idx < activeStep;
              const isCurrent = idx === activeStep;

              let iconClass = "";
              if (isCompleted) {
                iconClass = isLight 
                  ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
              } else if (isCurrent) {
                iconClass = isLight 
                  ? 'bg-rose-100 text-rose-500 border border-rose-200 animate-pulse' 
                  : 'bg-neon-pink/20 text-neon-pink border border-neon-pink/40 animate-pulse';
              } else {
                iconClass = isLight 
                  ? 'bg-neutral-100 text-neutral-300 border border-neutral-200' 
                  : 'bg-white/5 text-white/10 border border-white/5';
              }

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: isCompleted ? 0.6 : isCurrent ? 1 : 0.2,
                    x: 0
                  }}
                  className="flex items-center gap-3 text-xs sm:text-sm"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${iconClass}`}>
                    {isCompleted ? (
                      <Check className="w-3 h-3 font-black" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </div>
                  <span className={`font-medium tracking-tight ${
                    isCurrent 
                      ? (isLight ? 'text-neutral-900 font-bold' : 'text-white font-bold') 
                      : (isLight ? 'text-neutral-500' : 'text-white/70')
                  }`}>
                    {step}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── 텍스트 파서 헬퍼 ─────────────────────────────────────────

  // [한자]([한국어]) 패턴 감지 → 한자를 오행 색으로 렌더링
  const CJK_PAREN_RE = /([甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥])(\([^)]+\))/g;

  const colorizeChars = (text: string, baseClass: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    CJK_PAREN_RE.lastIndex = 0;                    // reset stateful regex

    while ((m = CJK_PAREN_RE.exec(text)) !== null) {
      // 매치 이전 텍스트
      if (m.index > last) nodes.push(<span key={`t${last}`} className={baseClass}>{text.slice(last, m.index)}</span>);

      const char = m[1];   // 한자 글자 (e.g. 甲)
      const paren = m[2];  // 괄호 (e.g. (갑목))

      const stemElem   = BAZI_MAPPING.stems?.[char   as keyof typeof BAZI_MAPPING.stems]?.element;
      const branchElem = BAZI_MAPPING.branches?.[char as keyof typeof BAZI_MAPPING.branches]?.element;
      const elemKey    = (stemElem || branchElem) as keyof typeof ELEMENT_STYLES | undefined;
      const elemColor  = elemKey ? elementStyles[elemKey]?.color : (isLight ? '#171717' : '#ffffff');

      nodes.push(
        <span key={`c${m.index}`}>
          <span className="font-black font-gothic" style={{ color: elemColor }}>{char}</span>
          <span className={`${isLight ? 'text-black/45' : 'text-white/45'} text-[0.82em] tracking-tight`}>{paren}</span>
        </span>
      );
      last = m.index + m[0].length;
    }

    // 나머지 텍스트
    if (last < text.length) nodes.push(<span key={`t${last}`} className={baseClass}>{text.slice(last)}</span>);
    return nodes.length ? nodes : [<span key="0" className={baseClass}>{text}</span>];
  };

  // **강조** 마커 파싱 후 각 세그먼트에 colorizeChars 적용
  const parseHighlighted = (text: string): React.ReactNode => {
    const parts = text.split(/\*\*(.*?)\*\*/gs);
    const boldClass = isLight ? 'text-black font-semibold' : 'text-white font-semibold';
    const normalClass = isLight ? 'text-black/70' : 'text-white/70';

    return parts.map((part, i) =>
      i % 2 === 1
        // 강조 구간
        ? <span key={i} className={boldClass}>{colorizeChars(part, boldClass)}</span>
        // 일반 구간
        : <span key={i}>{colorizeChars(part, normalClass)}</span>
    );
  };

  // \n\n 로 단락 분리, \n 으로 소프트 줄바꿈
  const renderParagraphs = (description: string, accentColor: string) => {
    const p1Class = isLight ? 'text-black/85' : 'text-white/85';
    const pNClass = isLight ? 'text-black/70' : 'text-white/70';
    return (
      <div className="space-y-3 font-sans">
        {description.split('\n\n').map((para, pi) => (
          <p key={pi} className={`text-xs sm:text-sm leading-relaxed ${pi === 0 ? p1Class : pNClass}`}>
            {para.split('\n').map((line, li, arr) => (
              <span key={li}>
                {parseHighlighted(line)}
                {li < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        ))}
      </div>
    );
  };

  // [유형명] 설명 형식을 파싱: 유형명만 강조하는 렌더러
  const renderTypeTitle = (title: string, accentColor?: string): React.ReactNode => {
    // 1. Single quote pattern (for main profile titles, e.g. "그 어떤 비바람에도 흔들리지 않고 독고다이로 돌파하는 '강인한 개척자' 유형")
    const quoteMatch = title.match(/'([^']+)'/);
    if (quoteMatch) {
      const typeName = quoteMatch[1];
      const suffix = lang === 'KO' ? ' 유형' : ' Type';
      return (
        <span>
          <span
            className="font-black tracking-tight"
            style={accentColor ? { color: accentColor } : {}}
          >
            {`'${typeName}'`}
          </span>
          <span className={`font-medium text-[0.8em] ml-1 ${isLight ? 'text-black/50' : 'text-white/50'}`}>
            {suffix}
          </span>
        </span>
      );
    }

    // 2. Bracket pattern (for section sub-type titles like "[군비쟁재 리스크관리형] ...")
    const bracketMatch = title.match(/^\[([^\]]+)\]\s*(.*)$/);
    if (bracketMatch) {
      const typeName = bracketMatch[1];
      // 설명은 무시하고 유형명만 표시
      return (
        <span>
          <span
            className="font-black tracking-tight"
            style={accentColor ? { color: accentColor } : {}}
          >
            {typeName}
          </span>
        </span>
      );
    }
    // 대괄호 없는 경우 그대로 반환
    return <span className="font-black" style={accentColor ? { color: accentColor } : {}}>{title}</span>;
  };


  // Loaded Content View
  return (
    <div className={`w-full max-w-3xl mx-auto px-4 py-8 space-y-10 sm:space-y-14 relative z-10 select-text bazi-interpretation-root ${isLight ? 'text-neutral-900' : 'text-white'}`}>
      {/* Go Back button */}
      <div className="flex justify-start">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all tracking-wider border ${
            isLight
              ? 'bg-black/5 border-black/10 text-neutral-700 hover:bg-black/10 hover:text-black'
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-neon-pink" />
          {lang === 'KO' ? '결과 요약으로 돌아가기' : 'Back to Summary'}
        </button>
      </div>

      {/* Hero Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 pt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-pink/15 border border-neon-pink/30 text-neon-pink text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          {data.iljuName}
        </div>

        <h1 className={`text-2xl sm:text-4xl font-extrabold leading-tight px-2 ${isLight ? 'text-black' : 'text-white'}`}>
          {lang === 'KO' ? `${data.userName}님의 사주 분석 리포트` : `${data.userName}'s BaZi Analysis Report`}
        </h1>

        {/* Dynamic Type Card */}
        <div className="p-[1px] bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan rounded-3xl shadow-[0_0_40px_rgba(255,0,122,0.15)] mt-4">
          <div className={`p-6 sm:p-8 rounded-[23px] space-y-3 ${isLight ? 'bg-white' : 'bg-[#0B0118]/95'}`}>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold block" style={{ color: woodColor }}>
              ✦ {lang === 'KO' ? '당신을 정의하는 한 마디' : 'Your Cosmic Identity'}
            </span>
            <h2 className={`text-xl sm:text-2xl font-black leading-normal tracking-tight font-display ${isLight ? 'text-black' : 'text-white'}`}>
              {renderTypeTitle(data.profile.title)}
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-neon-pink to-neon-cyan mx-auto rounded-full my-2" />
            <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${isLight ? 'text-neutral-600' : 'text-white/60'}`}>
              {data.profile.character}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 8-Letter grid visualization */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-neon-cyan/50"></div>
          <h3 className="text-sm font-bold text-neon-cyan uppercase tracking-widest">
            {lang === 'KO' ? '사주팔자 명식 판독' : 'Bazi Eight Characters'}
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-cyan/20 to-transparent"></div>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {['Hour', 'Day', 'Month', 'Year'].map((title, idx) => {
            const pillar = result.pillars?.find(p => p.title === title) || {
              stem: '?', branch: '?', stemKoreanName: '?', stemEnglishName: '?', branchKoreanName: '?', branchEnglishName: '?', element: 'Earth', hanja: '??'
            };
            const stemStyle = elementStyles[BAZI_MAPPING.stems?.[pillar.stem]?.element as keyof typeof elementStyles] || elementStyles.Earth;
            const branchStyle = elementStyles[BAZI_MAPPING.branches?.[pillar.branch]?.element as keyof typeof elementStyles] || elementStyles.Earth;
            const animalEmoji = ZODIAC_EMOJIS[pillar.branch] || '🌌';

            return (
              <div
                key={title}
                className={`flex flex-col rounded-2xl border ${title === 'Day'
                  ? 'bg-neon-pink/5 border-neon-pink shadow-[0_0_20px_rgba(255,0,122,0.15)]'
                  : (isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10')
                  } overflow-hidden`}
              >
                {/* Pillar Header */}
                <div className={`py-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-center ${title === 'Day' ? 'bg-neon-pink/20 text-neon-pink' : (isLight ? 'bg-black/10 text-neutral-500' : 'bg-white/5 text-white/40')
                  }`}>
                  {lang === 'KO'
                    ? (title === 'Hour' ? '시주 (Hour)' : title === 'Day' ? '일주 (Day)' : title === 'Month' ? '월주 (Month)' : '연주 (Year)')
                    : (title === 'Hour' ? 'Hour Pillar' : title === 'Day' ? 'Day Pillar' : title === 'Month' ? 'Month Pillar' : 'Year Pillar')
                  }
                </div>

                {/* Stem Card */}
                <div className={`p-3 sm:p-5 border-b flex flex-col items-center space-y-1 ${isLight ? 'border-black/5' : 'border-white/5'}`}>
                  <span className="text-2xl sm:text-4xl font-black font-gothic transition-transform hover:scale-110" style={{ color: stemStyle.color }}>
                    {pillar.stem}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold ${isLight ? 'text-neutral-600' : 'text-white/50'}`}>
                    {lang === 'KO' ? pillar.stemKoreanName : pillar.stemEnglishName}
                  </span>
                  <span className="text-[7px] sm:text-[8px] opacity-60 uppercase font-mono px-1 rounded-sm" style={{ color: stemStyle.color, backgroundColor: `${stemStyle.color}15` }}>
                    {lang === 'KO' ? stemStyle.ko : stemStyle.name}
                  </span>
                </div>

                {/* Branch Card */}
                <div className={`p-3 sm:p-5 flex flex-col items-center space-y-1 ${isLight ? 'bg-black/5' : 'bg-black/20'}`}>
                  <span className="text-2xl sm:text-4xl font-black font-gothic transition-transform hover:scale-110" style={{ color: branchStyle.color }}>
                    {pillar.branch}
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold flex items-center gap-0.5 ${isLight ? 'text-neutral-600' : 'text-white/50'}`}>
                    {lang === 'KO' ? pillar.branchKoreanName : pillar.branchEnglishName} {animalEmoji}
                  </span>
                  <span className="text-[7px] sm:text-[8px] opacity-60 uppercase font-mono px-1 rounded-sm" style={{ color: branchStyle.color, backgroundColor: `${branchStyle.color}15` }}>
                    {lang === 'KO' ? branchStyle.ko : branchStyle.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Innate Potential Scores */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-neon-purple/50"></div>
          <h3 className="text-sm font-bold text-neon-purple uppercase tracking-widest">
            {lang === 'KO' ? '당신이 타고난 잠재력 수치' : 'Your Innate Potential Levels'}
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-purple/20 to-transparent"></div>
        </div>

        <div className={`goth-glass p-6 rounded-3xl border ${isLight ? 'border-black/10' : 'border-white/10'} space-y-4`}>
          <div className={`flex items-center gap-2 mb-2 text-xs sm:text-sm ${isLight ? 'text-black/60' : 'text-white/60'}`}>
            <Activity className="w-4 h-4 text-neon-purple" />
            <span>
              {lang === 'KO'
                ? '나의 사주 구조(오행/십성)를 분석하여 환산한 8가지 개인 강점 지표입니다.'
                : '8 personal strength indicators calculated by analyzing your BaZi structure (elements/stars).'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {data.traitScores.map((trait, idx) => {
              // Neon gradient based on index (higher traits get brighter gradients)
              const gradientClass = idx < 3
                ? 'bg-gradient-to-r from-neon-pink to-neon-purple shadow-[0_0_10px_rgba(255,42,109,0.3)]'
                : idx < 7
                  ? 'bg-gradient-to-r from-neon-purple to-neon-cyan shadow-[0_0_8px_rgba(0,243,255,0.2)]'
                  : (isLight ? 'bg-neutral-500' : 'bg-white/20');

              return (
                <div key={trait.key} className={`space-y-1.5 p-3 rounded-2xl border ${isLight ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-bold flex items-center gap-1.5 ${isLight ? 'text-black' : 'text-white'}`}>
                      {idx < 3 && <Gem className="w-3.5 h-3.5 text-neon-pink" />}
                      {trait.name}
                    </span>
                    <span className={`font-mono font-bold ${idx < 3 ? 'text-neon-pink text-sm' : (isLight ? 'text-black/70' : 'text-white/70')}`}>
                      {trait.score} <span className={`text-[10px] ${isLight ? 'text-black/40' : 'text-white/40'}`}>/ 100</span>
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2.5 overflow-hidden ${isLight ? 'bg-neutral-300' : 'bg-white/5'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${trait.score}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.05 }}
                      className={`h-full rounded-full ${gradientClass}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ─── 타고난 기질 ─────────────────────────────────────────── */}
      {data.innateTemperament && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8" style={{ backgroundColor: `${woodColor}80` }}></div>
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: woodColor }}>
              {lang === 'KO' ? '타고난 기질' : 'Innate Temperament'}
            </h3>
            <div className="h-[1px] flex-1" style={{ backgroundImage: `linear-gradient(to right, ${woodColor}33, transparent)` }}></div>
          </div>

          {/* 어떤 글자들이 영향을 주는지 */}
          <div className={`text-xs flex items-center gap-1.5 ${isLight ? 'text-black/60' : 'text-white/50'}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: woodColor }}></span>
            {lang === 'KO' ? (
              <>
                당신의 타고난 기질은 8글자 중{' '}
                <span className="font-bold" style={{ color: woodColor }}>
                  {data.innateTemperament.keyPillars.map(kp => {
                    const tMap: Record<string, string> = { Day: '일', Month: '월', Year: '년', Hour: '시' };
                    const typeMap: Record<string, string> = { stem: '간', branch: '지' };
                    return `${tMap[kp.pillarTitle] || kp.pillarTitle}${typeMap[kp.type] || kp.type}`;
                  }).join(' · ')}
                </span>{' '}
                {data.innateTemperament.keyPillars.length}글자가 큰 영향을 끼칩니다
              </>
            ) : (
              <>
                Your innate temperament is highly influenced by{' '}
                <span className="font-bold" style={{ color: woodColor }}>
                  {formatKeyPillarsEn(data.innateTemperament.keyPillars)}
                </span>{' '}
                among the 8 characters
              </>
            )}
          </div>

          {/* 미니 사주표 (해당 셀 하이라이트) */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {['Hour', 'Day', 'Month', 'Year'].map((title) => {
              const pillar = result.pillars?.find(p => p.title === title) || { stem: '?', branch: '?', stemKoreanName: '', stemEnglishName: '', branchKoreanName: '', branchEnglishName: '', element: 'Earth' };
              const stemStyle = elementStyles[BAZI_MAPPING.stems?.[pillar.stem]?.element as keyof typeof elementStyles] || elementStyles.Earth;
              const branchStyle = elementStyles[BAZI_MAPPING.branches?.[pillar.branch]?.element as keyof typeof elementStyles] || elementStyles.Earth;
              const innateKey = data.innateTemperament!.keyPillars;
              const isStemHighlighted  = innateKey?.some(k => k.pillarTitle === title && k.type === 'stem');
              const isBranchHighlighted = innateKey?.some(k => k.pillarTitle === title && k.type === 'branch');
              const isHighlighted = isStemHighlighted || isBranchHighlighted;
              
              const borderClass = isHighlighted
                ? (isLight ? 'border-emerald-600/40 shadow-[0_0_12px_rgba(5,150,105,0.15)]' : 'border-[#39FF14]/40 shadow-[0_0_12px_rgba(57,255,20,0.15)]')
                : (isLight ? 'border-black/10' : 'border-white/5');
              const opacityClass = isHighlighted ? '' : 'opacity-30';
              const stemBg = isStemHighlighted
                ? (isLight ? 'bg-emerald-500/10' : 'bg-[#39FF14]/10')
                : (isLight ? 'bg-black/[0.02]' : 'bg-white/3');
              const branchBg = isBranchHighlighted
                ? (isLight ? 'bg-emerald-500/10' : 'bg-[#39FF14]/10')
                : (isLight ? 'bg-black/[0.04]' : 'bg-black/20');

              return (
                <div key={title} className={`flex flex-col rounded-xl border overflow-hidden ${borderClass} ${opacityClass}`}>
                  <div className={`p-2 sm:p-3 border-b flex flex-col items-center gap-0.5 ${isLight ? 'border-black/5' : 'border-white/5'} ${stemBg}`}>
                    <span className="text-lg sm:text-2xl font-black font-gothic" style={{ color: isStemHighlighted ? stemStyle.color : (isLight ? '#00000030' : '#ffffff40') }}>{pillar.stem}</span>
                    <span className={`text-[8px] ${isLight ? 'text-neutral-500 font-bold' : 'text-white/40'}`}>{lang === 'KO' ? pillar.stemKoreanName : pillar.stemEnglishName}</span>
                  </div>
                  <div className={`p-2 sm:p-3 flex flex-col items-center gap-0.5 ${isLight ? 'border-black/5' : 'border-white/5'} ${branchBg}`}>
                    <span className="text-lg sm:text-2xl font-black font-gothic" style={{ color: isBranchHighlighted ? branchStyle.color : (isLight ? '#00000030' : '#ffffff40') }}>{pillar.branch}</span>
                    <span className={`text-[8px] ${isLight ? 'text-neutral-500 font-bold' : 'text-white/40'}`}>{lang === 'KO' ? pillar.branchKoreanName : pillar.branchEnglishName}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 개인화 해설 */}
          <div className="goth-glass p-5 sm:p-7 rounded-3xl space-y-4" style={{ borderColor: `${woodColor}26` }}>
            <h4 className="text-sm sm:text-base font-bold leading-snug" style={{ color: woodColor }}>{renderTypeTitle(data.innateTemperament.title, woodColor)}</h4>
            <div className="w-20 h-[1px]" style={{ backgroundColor: `${woodColor}4d` }}></div>
            {renderParagraphs(data.innateTemperament.description, woodColor)}
          </div>
        </motion.div>
      )}

      {/* ─── 살아가는 방식 ────────────────────────────────────────── */}
      {data.lifestylePattern && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8" style={{ backgroundColor: `${cyanColor}80` }}></div>
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: cyanColor }}>
              {lang === 'KO' ? '살아가는 방식' : 'Way of Living'}
            </h3>
            <div className="h-[1px] flex-1" style={{ backgroundImage: `linear-gradient(to right, ${cyanColor}33, transparent)` }}></div>
          </div>

          <div className={`text-xs flex items-center gap-1.5 ${isLight ? 'text-black/60' : 'text-white/50'}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cyanColor }}></span>
            {lang === 'KO' ? (
              <>
                당신의 살아가는 방식은 8글자 중{' '}
                <span className="font-bold" style={{ color: cyanColor }}>
                  {data.lifestylePattern.keyPillars.map(kp => {
                    const tMap: Record<string, string> = { Day: '일', Month: '월', Year: '년', Hour: '시' };
                    const typeMap: Record<string, string> = { stem: '간', branch: '지' };
                    return `${tMap[kp.pillarTitle] || kp.pillarTitle}${typeMap[kp.type] || kp.type}`;
                  }).join(' · ')}
                </span>{' '}
                {data.lifestylePattern.keyPillars.length}글자가 큰 영향을 끼칩니다
              </>
            ) : (
              <>
                Your way of living is highly influenced by{' '}
                <span className="font-bold" style={{ color: cyanColor }}>
                  {formatKeyPillarsEn(data.lifestylePattern.keyPillars)}
                </span>{' '}
                among the 8 characters
              </>
            )}
          </div>

          {/* 미니 사주표 (천간/지지 하이라이트) */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {['Hour', 'Day', 'Month', 'Year'].map((title) => {
              const pillar = result.pillars?.find(p => p.title === title) || { stem: '?', branch: '?', stemKoreanName: '', stemEnglishName: '', branchKoreanName: '', branchEnglishName: '', element: 'Earth' };
              const stemStyle = elementStyles[BAZI_MAPPING.stems?.[pillar.stem]?.element as keyof typeof elementStyles] || elementStyles.Earth;
              const branchStyle = elementStyles[BAZI_MAPPING.branches?.[pillar.branch]?.element as keyof typeof elementStyles] || elementStyles.Earth;
              const lifeKey = data.lifestylePattern!.keyPillars;
              const isStemHighlighted  = lifeKey?.some(k => k.pillarTitle === title && k.type === 'stem');
              const isBranchHighlighted = lifeKey?.some(k => k.pillarTitle === title && k.type === 'branch');
              const isHighlighted = isStemHighlighted || isBranchHighlighted;
              
              const borderClass = isHighlighted
                ? (isLight ? 'border-sky-500/40 shadow-[0_0_12px_rgba(2,132,199,0.15)]' : 'border-neon-cyan/40 shadow-[0_0_12px_rgba(0,243,255,0.12)]')
                : (isLight ? 'border-black/10' : 'border-white/5');
              const opacityClass = isHighlighted ? '' : 'opacity-30';
              const stemBg = isStemHighlighted
                ? (isLight ? 'bg-sky-500/10' : 'bg-neon-cyan/10')
                : (isLight ? 'bg-black/[0.02]' : 'bg-white/3');
              const branchBg = isBranchHighlighted
                ? (isLight ? 'bg-sky-500/10' : 'bg-neon-cyan/10')
                : (isLight ? 'bg-black/[0.04]' : 'bg-black/20');

              return (
                <div key={title} className={`flex flex-col rounded-xl border overflow-hidden ${borderClass} ${opacityClass}`}>
                  <div className={`p-2 sm:p-3 border-b flex flex-col items-center gap-0.5 ${isLight ? 'border-black/5' : 'border-white/5'} ${stemBg}`}>
                    <span className="text-lg sm:text-2xl font-black font-gothic" style={{ color: isStemHighlighted ? stemStyle.color : (isLight ? '#00000025' : '#ffffff30') }}>{pillar.stem}</span>
                    <span className={`text-[8px] ${isLight ? 'text-neutral-400/60 font-bold' : 'text-white/30'}`}>{lang === 'KO' ? pillar.stemKoreanName : pillar.stemEnglishName}</span>
                  </div>
                  <div className={`p-2 sm:p-3 flex flex-col items-center gap-0.5 ${isLight ? 'border-black/5' : 'border-white/5'} ${branchBg}`}>
                    <span className="text-lg sm:text-2xl font-black font-gothic" style={{ color: isBranchHighlighted ? branchStyle.color : (isLight ? '#00000025' : '#ffffff30') }}>{pillar.branch}</span>
                    <span className={`text-[8px] ${isLight ? 'text-neutral-500 font-bold' : 'text-white/40'}`}>{lang === 'KO' ? pillar.branchKoreanName : pillar.branchEnglishName}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="goth-glass p-5 sm:p-7 rounded-3xl space-y-4" style={{ borderColor: `${cyanColor}26` }}>
            <h4 className="text-sm sm:text-base font-bold leading-snug" style={{ color: cyanColor }}>{renderTypeTitle(data.lifestylePattern.title, cyanColor)}</h4>
            <div className="w-20 h-[1px]" style={{ backgroundColor: `${cyanColor}4d` }}></div>
            {renderParagraphs(data.lifestylePattern.description, cyanColor)}
          </div>
        </motion.div>
      )}

      {/* ─── 부의 흐름 ────────────────────────────────────────── */}
      {data.wealthFlow && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8" style={{ backgroundColor: `${purpleColor}80` }}></div>
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: purpleColor }}>
              {lang === 'KO' ? '부의 흐름' : 'Wealth Flow'}
            </h3>
            <div className="h-[1px] flex-1" style={{ backgroundImage: `linear-gradient(to right, ${purpleColor}33, transparent)` }}></div>
          </div>

          <div className={`text-xs flex items-center gap-1.5 ${isLight ? 'text-black/60' : 'text-white/50'}`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: purpleColor }}></span>
            {lang === 'KO' ? (
              <>
                당신의 재물 기운과 흐름은{' '}
                <span className="font-bold" style={{ color: purpleColor }}>
                  {data.wealthFlow.keyPillars.map(kp => {
                    const tMap: Record<string, string> = { Day: '일', Month: '월', Year: '년', Hour: '시' };
                    const typeMap: Record<string, string> = { stem: '간', branch: '지' };
                    return `${tMap[kp.pillarTitle] || kp.pillarTitle}${typeMap[kp.type] || kp.type}`;
                  }).join(' · ')}
                </span>
                {' '}글자의 영향을 강하게 받습니다
              </>
            ) : (
              <>
                Your wealth flows and energy are strongly influenced by{' '}
                <span className="font-bold" style={{ color: purpleColor }}>
                  {formatKeyPillarsEn(data.wealthFlow.keyPillars)}
                </span>
              </>
            )}
          </div>

          {/* 미니 사주표 (부의 흐름 하이라이트) */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {['Hour', 'Day', 'Month', 'Year'].map((title) => {
              const pillar = result.pillars?.find(p => p.title === title) || { stem: '?', branch: '?', stemKoreanName: '', stemEnglishName: '', branchKoreanName: '', branchEnglishName: '', element: 'Earth' };
              const stemStyle = elementStyles[BAZI_MAPPING.stems?.[pillar.stem]?.element as keyof typeof elementStyles] || elementStyles.Earth;
              const branchStyle = elementStyles[BAZI_MAPPING.branches?.[pillar.branch]?.element as keyof typeof elementStyles] || elementStyles.Earth;
              const wealthKey = data.wealthFlow!.keyPillars;
              const isStemHighlighted  = wealthKey?.some(k => k.pillarTitle === title && k.type === 'stem');
              const isBranchHighlighted = wealthKey?.some(k => k.pillarTitle === title && k.type === 'branch');
              const isHighlighted = isStemHighlighted || isBranchHighlighted;
              
              const borderClass = isHighlighted
                ? (isLight ? 'border-purple-600/40 shadow-[0_0_12px_rgba(124,58,237,0.15)]' : 'border-[#9B30FF]/40 shadow-[0_0_12px_rgba(155,48,255,0.15)]')
                : (isLight ? 'border-black/10' : 'border-white/5');
              const opacityClass = isHighlighted ? '' : 'opacity-30';
              const stemBg = isStemHighlighted
                ? (isLight ? 'bg-purple-500/10' : 'bg-[#9B30FF]/10')
                : (isLight ? 'bg-black/[0.02]' : 'bg-white/3');
              const branchBg = isBranchHighlighted
                ? (isLight ? 'bg-purple-500/10' : 'bg-[#9B30FF]/10')
                : (isLight ? 'bg-black/[0.04]' : 'bg-black/20');

              return (
                <div key={title} className={`flex flex-col rounded-xl border overflow-hidden ${borderClass} ${opacityClass}`}>
                  <div className={`p-2 sm:p-3 border-b flex flex-col items-center gap-0.5 ${isLight ? 'border-black/5' : 'border-white/5'} ${stemBg}`}>
                    <span className="text-lg sm:text-2xl font-black font-gothic" style={{ color: isStemHighlighted ? stemStyle.color : (isLight ? '#00000030' : '#ffffff40') }}>{pillar.stem}</span>
                    <span className={`text-[8px] ${isLight ? 'text-neutral-500 font-bold' : 'text-white/40'}`}>{lang === 'KO' ? pillar.stemKoreanName : pillar.stemEnglishName}</span>
                  </div>
                  <div className={`p-2 sm:p-3 flex flex-col items-center gap-0.5 ${isLight ? 'border-black/5' : 'border-white/5'} ${branchBg}`}>
                    <span className="text-lg sm:text-2xl font-black font-gothic" style={{ color: isBranchHighlighted ? branchStyle.color : (isLight ? '#00000030' : '#ffffff40') }}>{pillar.branch}</span>
                    <span className={`text-[8px] ${isLight ? 'text-neutral-500 font-bold' : 'text-white/40'}`}>{lang === 'KO' ? pillar.branchKoreanName : pillar.branchEnglishName}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 1. Wealth Engine Type Title Card */}
          <div className="p-[1px] bg-gradient-to-r from-neon-purple/60 via-[#9B30FF]/40 to-neon-cyan/40 rounded-3xl shadow-[0_0_25px_rgba(155,48,255,0.15)]">
            <div className={`p-6 sm:p-8 rounded-[23px] space-y-3 ${isLight ? 'bg-white' : 'bg-[#0B0118]/95'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center text-neon-purple shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold block" style={{ color: purpleColor }}>
                  ✦ {lang === 'KO' ? '나의 부의 엔진 유형' : 'My Wealth Engine Type'}
                </span>
              </div>
              <h4 className={`text-lg sm:text-xl font-black leading-snug tracking-tight font-display ${isLight ? 'text-black' : 'text-white'}`}>
                {renderTypeTitle(data.wealthFlow.typeTitle, purpleColor)}
              </h4>
              <div className="w-full h-[1px]" style={{ backgroundImage: `linear-gradient(to right, ${purpleColor}4d, transparent)` }}></div>
              <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-neutral-600' : 'text-white/60'}`}>
                {lang === 'KO' 
                  ? "귀하의 타고난 사주 원국과 십성 비율을 기반으로 도출된 최적의 부의 작동 메커니즘입니다."
                  : "The optimal wealth mechanism derived from your innate Bazi chart and Ten Gods ratio."}
              </p>
            </div>
          </div>

          {/* 2. 3-Indicator Stats with narrative analyses */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">📊</span>
              <h5 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${isLight ? 'text-neutral-700' : 'text-white/80'}`}>
                {lang === 'KO' ? '재물 핵심 3대 지표 분석' : '3 Core Wealth Indicators'}
              </h5>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Indicator 1: 재물 팽창력 */}
              <div className={`goth-glass p-5 rounded-2xl border ${isLight ? 'border-black/15 bg-white/70' : 'border-white/10 bg-[#0B0118]/40'} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                        {lang === 'KO' ? '재물 팽창력' : 'Wealth Expansion'}
                      </h6>
                      <span className={`text-[10px] ${isLight ? 'text-neutral-500' : 'text-white/40'}`}>
                        {lang === 'KO' ? '식상·재성 기반 기회 포착력' : 'Opportunity Capture (Expression/Wealth)'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 self-end sm:self-auto">
                    <span className="text-lg font-black text-rose-500 font-mono">
                      {data.wealthFlow.expansionScore}
                    </span>
                    <span className={`text-xs font-mono ${isLight ? 'text-neutral-400' : 'text-white/30'}`}>/ 100</span>
                  </div>
                </div>

                <div className={`w-full rounded-full h-2 overflow-hidden ${isLight ? 'bg-neutral-200' : 'bg-white/5'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${data.wealthFlow.expansionScore}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                  />
                </div>

                <div className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-neutral-700' : 'text-white/70'} pt-1`}>
                  {parseHighlighted(data.wealthFlow.expansionAnalysis)}
                </div>
              </div>

              {/* Indicator 2: 재물 방어력 */}
              <div className={`goth-glass p-5 rounded-2xl border ${isLight ? 'border-black/15 bg-white/70' : 'border-white/10 bg-[#0B0118]/40'} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-500 shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                        {lang === 'KO' ? '재물 방어력' : 'Wealth Security'}
                      </h6>
                      <span className={`text-[10px] ${isLight ? 'text-neutral-500' : 'text-white/40'}`}>
                        {lang === 'KO' ? '인성·관성 기반 자산 보호 능력' : 'Asset Protection (Resource/Officer)'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 self-end sm:self-auto">
                    <span className="text-lg font-black text-sky-500 font-mono">
                      {data.wealthFlow.securityScore}
                    </span>
                    <span className={`text-xs font-mono ${isLight ? 'text-neutral-400' : 'text-white/30'}`}>/ 100</span>
                  </div>
                </div>

                <div className={`w-full rounded-full h-2 overflow-hidden ${isLight ? 'bg-neutral-200' : 'bg-white/5'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${data.wealthFlow.securityScore}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.3)]"
                  />
                </div>

                <div className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-neutral-700' : 'text-white/70'} pt-1`}>
                  {parseHighlighted(data.wealthFlow.securityAnalysis)}
                </div>
              </div>

              {/* Indicator 3: 주체적 추진력 */}
              <div className={`goth-glass p-5 rounded-2xl border ${isLight ? 'border-black/15 bg-white/70' : 'border-white/10 bg-[#0B0118]/40'} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 shrink-0">
                      <Gem className="w-4 h-4" />
                    </div>
                    <div>
                      <h6 className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                        {lang === 'KO' ? '주체적 추진력' : 'Pioneering Power'}
                      </h6>
                      <span className={`text-[10px] ${isLight ? 'text-neutral-500' : 'text-white/40'}`}>
                        {lang === 'KO' ? '비겁 기반 자립 및 창업가 정신' : 'Independence & Drive (Companion)'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 self-end sm:self-auto">
                    <span className="text-lg font-black text-purple-500 font-mono">
                      {data.wealthFlow.pioneeringScore}
                    </span>
                    <span className={`text-xs font-mono ${isLight ? 'text-neutral-400' : 'text-white/30'}`}>/ 100</span>
                  </div>
                </div>

                <div className={`w-full rounded-full h-2 overflow-hidden ${isLight ? 'bg-neutral-200' : 'bg-white/5'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${data.wealthFlow.pioneeringScore}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                  />
                </div>

                <div className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-neutral-700' : 'text-white/70'} pt-1`}>
                  {parseHighlighted(data.wealthFlow.pioneeringAnalysis)}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Recommended Modern Asset Pipeline */}
          <div className={`goth-glass p-5 sm:p-6 rounded-3xl border ${isLight ? 'border-black/15 bg-white/70' : 'border-white/10 bg-[#0B0118]/40'} space-y-3`}>
            <div className="flex items-center gap-2">
              <span className="text-base">💼</span>
              <h5 className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${isLight ? 'text-neutral-800' : 'text-white'}`}>
                {lang === 'KO' ? '추천 현대적 자산 파이프라인' : 'Recommended Modern Asset Pipeline'}
              </h5>
            </div>
            <p className={`text-[11px] sm:text-xs leading-normal ${isLight ? 'text-neutral-500' : 'text-white/40'} pb-1`}>
              {lang === 'KO' 
                ? '귀하의 명식 구조에 가장 적합한 현대적 형태의 소득 파이프라인 경로입니다.' 
                : 'The modern income pipeline forms best suited for your structural Bazi blueprint.'}
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.wealthFlow.pipeline.split(',').map((item, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 ${
                    isLight
                      ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm'
                      : 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple shadow-[0_0_10px_rgba(155,48,255,0.05)]'
                  }`}
                >
                  {item.trim()}
                </span>
              ))}
            </div>
          </div>

        </motion.div>
      )}

      {/* ─── 현실에서 나타나는 패턴 ──────────────────────────────── */}
      {data.realWorldPattern && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-[1px] w-8" style={{ backgroundColor: `${pinkColor}80` }}></div>
            <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: pinkColor }}>
              {lang === 'KO' ? '현실에서 나타나는 패턴' : 'Real-World Patterns'}
            </h3>
            <div className="h-[1px] flex-1" style={{ backgroundImage: `linear-gradient(to right, ${pinkColor}33, transparent)` }}></div>
          </div>

          <div className="p-[1px] bg-gradient-to-br from-neon-pink/60 via-neon-purple/40 to-neon-cyan/30 rounded-3xl">
            <div className={`p-5 sm:p-7 rounded-[23px] space-y-3 ${isLight ? 'bg-white' : 'bg-[#0B0118]/95'}`}>
              {/* 시그니처 제목 */}
              <div className="flex items-start gap-3">
                <span className="text-xl sm:text-2xl mt-0.5">🔥</span>
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold block mb-1" style={{ color: `${pinkColor}b3` }}>
                    {lang === 'KO' ? '시그니처 패턴' : 'Signature Pattern'}
                  </span>
                  <h4 className={`text-sm sm:text-base font-black leading-snug ${isLight ? 'text-black' : 'text-white'}`}>
                    {renderTypeTitle(data.realWorldPattern.title, pinkColor)}
                  </h4>
                </div>
              </div>
              <div className="w-full h-[1px]" style={{ backgroundImage: `linear-gradient(to right, ${pinkColor}4d, transparent)` }}></div>
              {renderParagraphs(data.realWorldPattern.description, pinkColor)}
            </div>
          </div>
        </motion.div>
      )}



      {/* Yongshin / Heeshin Advice */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-neon-purple/50"></div>
          <h3 className="text-sm font-bold text-neon-purple uppercase tracking-widest">
            {lang === 'KO' ? '나를 돕는 영적 처방 & 행운 요소' : 'Lucky Vibes & Habits'}
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-purple/20 to-transparent"></div>
        </div>

        <div className={`goth-glass p-6 sm:p-8 rounded-3xl border ${isLight ? 'border-black/10' : 'border-white/10'} space-y-6`}>
          <h4 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-black' : 'text-white'}`}>
            <Zap className="w-4 h-4 text-neon-purple animate-[bounce_2s_infinite]" />
            {data.yongshinAdvice.title}
          </h4>

          {/* Colors, Items, Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lucky colors */}
            <div className={`p-4 rounded-2xl border space-y-2 flex flex-col items-center text-center ${isLight ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
              <div className="w-8 h-8 rounded-full bg-neon-pink/20 flex items-center justify-center text-neon-pink text-xs font-bold">
                🎨
              </div>
              <span className={`text-xs font-bold ${isLight ? 'text-neutral-800' : 'text-white/80'}`}>{lang === 'KO' ? '행운의 칼라' : 'Lucky Colors'}</span>
              <div className={`flex flex-col gap-1 text-[11px] ${isLight ? 'text-neutral-600' : 'text-white/60'}`}>
                {data.yongshinAdvice.colors.map((c, i) => (
                  <span key={i} className="font-medium">{c}</span>
                ))}
              </div>
            </div>

            {/* Lucky items */}
            <div className={`p-4 rounded-2xl border space-y-2 flex flex-col items-center text-center ${isLight ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
              <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan text-xs font-bold">
                💎
              </div>
              <span className={`text-xs font-bold ${isLight ? 'text-neutral-800' : 'text-white/80'}`}>{lang === 'KO' ? '행운의 아이템' : 'Lucky Items'}</span>
              <div className={`flex flex-col gap-1 text-[11px] ${isLight ? 'text-neutral-600' : 'text-white/60'}`}>
                {data.yongshinAdvice.luckyItems.map((item, i) => (
                  <span key={i} className="font-medium leading-tight">{item}</span>
                ))}
              </div>
            </div>

            {/* Lucky habits */}
            <div className={`p-4 rounded-2xl border space-y-2 flex flex-col items-center text-center col-span-1 md:col-span-1 ${isLight ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
              <div className="w-8 h-8 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple text-xs font-bold">
                🌿
              </div>
              <span className={`text-xs font-bold ${isLight ? 'text-neutral-800' : 'text-white/80'}`}>{lang === 'KO' ? '행운의 생활 습관' : 'Lucky Habits'}</span>
              <div className={`flex flex-col gap-1 text-[11px] ${isLight ? 'text-neutral-600' : 'text-white/60'}`}>
                <span className="font-medium leading-normal">{data.yongshinAdvice.actions[0]}</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border text-xs space-y-2 ${isLight ? 'bg-black/5 border-black/5 text-black/70' : 'bg-white/5 border-white/5 text-white/70'}`}>
            <span className={`font-bold block ${isLight ? 'text-black' : 'text-white'}`}>
              {lang === 'KO' ? '🌱 추천 행동 리스트:' : '🌱 Recommended Habits:'}
            </span>
            <ul className="list-disc pl-4 space-y-1">
              {data.yongshinAdvice.actions.map((act, i) => (
                <li key={i} className="leading-relaxed font-sans">{act}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Luck Cycles Timeline (Daeun/Seeun) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="h-[1px] w-8 bg-neon-pink/50"></div>
          <h3 className="text-sm font-bold text-neon-pink uppercase tracking-widest">
            {lang === 'KO' ? '나의 대운 & 올해 세운 흐름' : 'Luck Timeline Analysis'}
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-pink/20 to-transparent"></div>
        </div>

        <div className={`goth-glass p-6 sm:p-8 rounded-3xl border ${isLight ? 'border-black/10' : 'border-white/10'} space-y-5`}>
          {/* Daeun Card */}
          <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neon-pink flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neon-pink" />
                {lang === 'KO' ? '대운 흐름 (Grand Luck Cycle)' : 'Grand Luck Cycle'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-[10px] font-bold text-neon-pink font-mono">
                {data.luckTiming.currentDaeun}
              </span>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isLight ? 'text-neutral-800' : 'text-white/80'}`}>
              {data.luckTiming.currentDaeunInterpretation}
            </p>
          </div>

          {/* Seeun Card */}
          <div className={`p-4 rounded-2xl border space-y-2 ${isLight ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neon-cyan flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-neon-cyan" />
                {lang === 'KO' ? '올해 세운 흐름 (Annual Luck Cycle)' : 'Annual Luck Cycle'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-[10px] font-bold text-neon-cyan font-mono">
                {data.luckTiming.currentSewun}
              </span>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed font-sans ${isLight ? 'text-neutral-800' : 'text-white/80'}`}>
              {data.luckTiming.currentSewunInterpretation}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Share and Back buttons and bottom signature */}
      <div className="flex flex-col items-center space-y-6 pt-6 pb-12 w-full">
        {isSharedView ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md mx-auto px-4"
          >
            <div className="relative group p-[2px] rounded-2xl bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan animate-[pulse_3s_infinite] shadow-[0_0_25px_rgba(255,0,122,0.25)] hover:shadow-[0_0_35px_rgba(0,243,255,0.4)] transition-all duration-300">
              <button
                onClick={() => {
                  onStartAnalysis?.();
                }}
                className="w-full py-5 px-6 bg-[#0B0118] hover:bg-[#0B0118]/85 text-white font-bold rounded-2xl transition-all flex flex-col items-center justify-center gap-1.5 focus:outline-none"
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
        ) : (
          <>
            <motion.button
              onClick={handleShare}
              animate={{
                y: [0, -4, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: isLight
                  ? "0 10px 25px rgba(204, 88, 88, 0.4)"
                  : "0 0 30px rgba(250, 30, 142, 0.5)"
              }}
              whileTap={{ scale: 0.98 }}
              className={`px-12 py-4 rounded-full font-bold text-sm tracking-[0.2em] transition-all flex items-center gap-2 border cursor-pointer ${
                shareState === 'copied'
                  ? 'bg-emerald-500 text-white-force shadow-[0_0_20px_rgba(16,185,129,0.4)] border-emerald-500'
                  : shareState === 'error'
                    ? 'bg-rose-500 text-white-force shadow-[0_0_20px_rgba(244,63,94,0.4)] border-rose-500'
                    : 'bg-gradient-to-r from-neon-pink to-neon-purple text-white-force shadow-[0_0_20px_rgba(255,42,109,0.35)] border-transparent'
              }`}
            >
              <Share2 className="w-4 h-4 text-white-force" />
              {shareState === 'copied'
                ? (lang === 'KO' ? '링크 복사 완료!' : 'Link Copied!')
                : shareState === 'error'
                  ? (lang === 'KO' ? '오류 발생' : 'Error Occurred')
                  : (lang === 'KO' ? '내 영혼의 해설 공유하기' : 'Share My Soul Analysis')}
            </motion.button>

            <button
              onClick={onBack}
              className={`px-12 py-3 rounded-full text-xs font-bold tracking-[0.3em] transition-all border ${
                isLight
                  ? 'bg-black/5 border-black/10 text-neutral-700 hover:bg-black/10 hover:text-black'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {lang === 'KO' ? '결과 요약 화면으로' : 'Back to Summary'}
            </button>
          </>
        )}

        <p className={`text-[10px] tracking-widest uppercase font-mono select-none ${isLight ? 'text-black/30' : 'text-white/30'}`}>
          ✦ V.O.I.D Destiny Matrix Engine ✦
        </p>
      </div>
    </div>
  );
}
