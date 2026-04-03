import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BaZiResult, Language } from '../types';
import { TRANSLATIONS, ELEMENT_COLORS, TEN_GOD_COLORS } from '../constants';
import { SHINSAL_DEFINITIONS } from '../constants/shinsal-definitions';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { calculateTenGods } from '../services/bazi-engine';
import { ChevronDown, ChevronUp, MessageSquare, Sun, Moon, HelpCircle, X } from 'lucide-react';

const GongmangDetail = ({ result, lang }: { result: BaZiResult, lang: Language }) => {
  const gongmang = result.analysis.gongmang;
  if (!gongmang || !gongmang.branches || gongmang.branches.length === 0) return null;

  const affectedPillars = gongmang.affectedPillars || [];
  const interactions = result.analysis.interactions || [];
  
  // Check for Tal-gong (탈공)
  const isResolved = interactions.some(interaction => 
    (interaction.type.includes('합') || interaction.type.includes('충') || interaction.type.includes('Combine') || interaction.type.includes('Clash')) &&
    interaction.branches && interaction.branches.some(b => gongmang.branches.includes(b))
  );

  // Find Ten Gods for the Gongmang branches
  const gongmangTenGods: string[] = [];
  result.pillars.forEach((p, idx) => {
    if (idx < 4 && gongmang.branches.includes(p.branch)) {
      gongmangTenGods.push(lang === 'KO' ? p.branchKoreanName : p.branchEnglishName);
    }
  });

  if (lang === 'KO') {
    return (
      <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
        <h4 className="text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-pink"></span>
          공망(空亡) 심층 분석
        </h4>
        <div className="space-y-4 text-xs text-white/70 leading-relaxed">
          {!gongmang.inChart ? (
            <div className="p-3 bg-neon-pink/10 rounded border border-neon-pink/20 text-white/90">
              {gongmang.note}
            </div>
          ) : (
            <>
              <p>
                <strong className="text-white/90">공망의 3대 핵심 작용:</strong><br/>
                1. <strong>허망함과 집착:</strong> 비어 있기 때문에 오히려 그것을 채우려 하는 강한 집착이 생깁니다. {gongmangTenGods.length > 0 && `현재 원국에서는 [${gongmangTenGods.join(', ')}]에 공망이 들어, 해당 십성이 상징하는 영역에 대한 갈증이 남들보다 클 수 있습니다.`}<br/>
                2. <strong>변질과 비정상성:</strong> 해당 글자가 가진 본래의 기능이 정상적으로 작동하지 않아, 인연이 박하거나 덕을 보기 어려운 상황으로 나타날 수 있습니다.<br/>
                3. <strong>정신적/형이상학적 발달:</strong> 현실적인 힘은 약해지지만, 대신 정신적, 철학적, 예술적 기운이 맑아집니다.
              </p>
              
              <div>
                <strong className="text-white/90">궁성(자리)에 따른 의미:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  {affectedPillars.includes('년주') && <li><strong>년주(Year):</strong> 조상의 덕이 부족하거나 고향을 떠나 자수성가해야 할 수 있습니다.</li>}
                  {affectedPillars.includes('월주') && <li><strong>월주(Month):</strong> 부모, 형제의 덕이 약하며 사회 생활이나 직장 운에서 정착이 어려울 수 있습니다.</li>}
                  {affectedPillars.includes('일주') && <li><strong>일주(Day):</strong> 본인의 내면적 공허함이 있거나 배우자와의 인연이 약할 수 있습니다.</li>}
                  {affectedPillars.includes('시주') && <li><strong>시주(Hour):</strong> 노년의 고독이나 자식과의 인연이 박할 수 있으며, 일의 최종 결과물이 허무할 수 있습니다.</li>}
                </ul>
              </div>

              <div className="p-3 bg-black/30 rounded border border-white/5">
                <strong className="text-white/90">탈공(脫空) 여부:</strong><br/>
                {isResolved ? (
                  <span className="text-neon-blue">원국 내에 공망된 글자를 깨우는 합(合)이나 충(沖)이 존재하여, 공망의 작용이 일시적으로 해소(탈공)되는 긍정적인 구조입니다. 비어있던 글자를 써먹을 수 있게 됩니다.</span>
                ) : (
                  <span>현재 원국 내에서는 합(合)이나 충(沖)으로 인한 탈공이 뚜렷하지 않습니다. 하지만 대운이나 세운에서 공망인 글자가 직접 들어오거나 합/충하는 운이 올 때 공망의 굴레에서 벗어나 실체를 가지게 됩니다.</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
      <h4 className="text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-neon-pink"></span>
        In-depth Void (Gongmang) Analysis
      </h4>
      <div className="space-y-4 text-xs text-white/70 leading-relaxed">
        {!gongmang.inChart ? (
          <div className="p-3 bg-neon-pink/10 rounded border border-neon-pink/20 text-white/90">
            {gongmang.noteEn}
          </div>
        ) : (
          <>
            <p>
              <strong className="text-white/90">3 Core Effects of Void:</strong><br/>
              1. <strong>Emptiness & Obsession:</strong> Because it is empty, a strong obsession to fill it arises. {gongmangTenGods.length > 0 && `In your chart, [${gongmangTenGods.join(', ')}] is in Void, meaning you may feel a greater thirst in these areas.`}<br/>
              2. <strong>Alteration & Abnormality:</strong> The original function of the element does not operate normally, often resulting in weak karmic ties or difficulty receiving its benefits.<br/>
              3. <strong>Spiritual/Metaphysical Development:</strong> While realistic power weakens, spiritual, philosophical, and artistic energies become clearer.
            </p>
            
            <div>
              <strong className="text-white/90">Meaning by Pillar Position:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                {affectedPillars.includes('년주') && <li><strong>Year Pillar:</strong> Lack of ancestral benefits; may need to leave home and succeed independently.</li>}
                {affectedPillars.includes('월주') && <li><strong>Month Pillar:</strong> Weak benefits from parents/siblings; may face challenges settling in society or career.</li>}
                {affectedPillars.includes('일주') && <li><strong>Day Pillar:</strong> Inner emptiness or weak karmic ties/alignment with a spouse.</li>}
                {affectedPillars.includes('시주') && <li><strong>Hour Pillar:</strong> Solitude in old age, weak ties with children, or feeling empty about final outcomes.</li>}
              </ul>
            </div>

            <div className="p-3 bg-black/30 rounded border border-white/5">
              <strong className="text-white/90">Resolution (Tal-gong):</strong><br/>
              {isResolved ? (
                <span className="text-neon-blue">Your chart contains a Combine or Clash that awakens the Void branch, temporarily resolving its effects. You can actively utilize this element.</span>
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

interface BaZiResultPageProps {
  result: BaZiResult;
  lang: Language;
  userName: string;
  onBack: () => void;
}

const BaziTooltip = ({ content, children, lang }: { content: { ko: string, en: string }, children: React.ReactNode, lang: Language, key?: any }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'top' as 'top' | 'bottom' });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const updatePosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const tooltipWidth = 256; // w-64 = 16rem = 256px
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

  const handleTouch = (e: React.MouseEvent | React.TouchEvent) => {
    // For touch devices, toggle visibility
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
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
    <div 
      ref={containerRef}
      className="relative inline-block" 
      onMouseEnter={showTooltip} 
      onMouseLeave={hideTooltip}
      onClick={handleTouch}
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
              className="w-64 p-3 bg-black/95 border border-white/20 rounded-lg shadow-2xl backdrop-blur-xl pointer-events-none"
            >
              <p className="text-xs text-white/90 leading-relaxed font-sans">
                {lang === 'KO' ? content.ko : content.en}
              </p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default function BaZiResultPage({ result, lang, userName, onBack }: BaZiResultPageProps) {
  const t = TRANSLATIONS[lang].result as any;

  const renderPillarText = (type: 'stem' | 'branch', value: string) => {
    const mapping = (type === 'stem' ? BAZI_MAPPING.stems : BAZI_MAPPING.branches) as any;
    const info = mapping[value];
    if (!info) return value;
    
    if (lang === 'KO') {
      return `${info.ko}(${value})`;
    }
    return info.en;
  };

  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [showTongGwanInfo, setShowTongGwanInfo] = useState(false);
  const [showEokbuInfo, setShowEokbuInfo] = useState(false);
  const [showYongshinInfo, setShowYongshinInfo] = useState(false);
  const [showInteractionInfo, setShowInteractionInfo] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showHanja, setShowHanja] = useState(false);

  const elementData = useMemo(() => {
    const counts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
    result.pillars.forEach(p => {
      const stemElement = BAZI_MAPPING.stems[p.stem as keyof typeof BAZI_MAPPING.stems]?.element;
      const branchElement = BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches]?.element;
      if (stemElement && counts[stemElement as keyof typeof counts] !== undefined) counts[stemElement as keyof typeof counts]++;
      if (branchElement && counts[branchElement as keyof typeof counts] !== undefined) counts[branchElement as keyof typeof counts]++;
    });
    
    return [
      { name: lang === 'KO' ? '목(Wood)' : 'Wood', value: counts.Wood, color: '#22c55e' },
      { name: lang === 'KO' ? '화(Fire)' : 'Fire', value: counts.Fire, color: '#ef4444' },
      { name: lang === 'KO' ? '토(Earth)' : 'Earth', value: counts.Earth, color: '#eab308' },
      { name: lang === 'KO' ? '금(Metal)' : 'Metal', value: counts.Metal, color: '#f8fafc' },
      { name: lang === 'KO' ? '수(Water)' : 'Water', value: counts.Water, color: '#3b82f6' },
    ].filter(d => d.value > 0);
  }, [result.pillars, lang]);

  const getAnalysisText = () => {
    if (!result.analysis) {
      const sorted = [...elementData].sort((a, b) => b.value - a.value);
      const dominant = sorted[0];
      const missing = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].filter(e => !elementData.find(d => d.name.includes(e)));
      
      if (lang === 'KO') {
        return `당신의 영혼 매트릭스는 ${dominant.name}의 기운이 지배적입니다. 사이버네틱 코어에 각인된 이 강력한 에너지는 당신을 끊임없이 움직이게 하지만, ${missing.length > 0 ? missing.map(m => m === 'Wood' ? '목' : m === 'Fire' ? '화' : m === 'Earth' ? '토' : m === 'Metal' ? '금' : '수').join(', ') + '의 결핍이 시스템의 과부하를 초래할 수 있습니다.' : '모든 원소가 균형을 이루어 안정적인 출력을 자랑합니다.'} 충돌하는 기운을 제어하고 당신만의 네온 불빛을 밝히십시오.`;
      } else {
        return `Your soul matrix is dominated by the energy of ${dominant.name}. This powerful force engraved in your cybernetic core drives you relentlessly, but ${missing.length > 0 ? 'the lack of ' + missing.join(', ') + ' may cause system overloads.' : 'all elements are balanced, boasting stable output.'} Control the clashing energies and ignite your own neon lights.`;
      }
    }
    const { geJu, yongShen } = result.analysis;
    if (lang === 'KO') {
      return `${geJu}으로 태어나 ${yongShen}을 삶의 핵심 에너지로 사용합니다.`;
    }
    const gejuInfo = BAZI_MAPPING.geju[geJu as keyof typeof BAZI_MAPPING.geju];
    const gejuEn = gejuInfo?.en || geJu;
    return `Born with ${gejuEn}, utilizing ${yongShen} as your primary cosmic driver.`;
  };

  const getYongshinName = (god: string) => {
    if (lang === 'KO') return god;
    return BAZI_MAPPING.yongshin[god as keyof typeof BAZI_MAPPING.yongshin]?.en || god;
  };

  const getStrengthLevel = (level: string) => {
    if (lang === 'KO') return level;
    return BAZI_MAPPING.strength[level as keyof typeof BAZI_MAPPING.strength]?.en || level;
  };

  const getGodElementInfo = (godCategory: string) => {
    const dayMaster = result.pillars[1].stem;
    const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
    if (!dmElement) return null;

    const elementsOrder = ["Wood", "Fire", "Earth", "Metal", "Water"];
    const dmIdx = elementsOrder.indexOf(dmElement);
    
    const godOffsets: Record<string, number> = {
      "비겁": 0,
      "식상": 1,
      "재성": 2,
      "관성": 3,
      "인성": 4,
    };

    const offset = godOffsets[godCategory];
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

    const elementKo = BAZI_MAPPING.elements[targetElement as keyof typeof BAZI_MAPPING.elements]?.ko.split(' ')[0];
    const elementEn = targetElement;

    return {
      elementKo,
      elementEn,
      stems: stems || []
    };
  };

  const renderYongshinWithElement = (god: string) => {
    const info = getGodElementInfo(god);
    const godName = getYongshinName(god);
    
    if (!info) return godName;

    const stemText = info.stems.map(s => {
      const stemInfo = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems];
      return `${lang === 'KO' ? stemInfo.ko : stemInfo.en} (${s})`;
    }).join(' / ');

    return (
      <div className="flex flex-col items-center">
        <span>{godName}</span>
        <span className="text-[9px] text-white/40 font-normal mt-0.5">
          {lang === 'KO' ? `${info.elementKo} - ${stemText}` : `${info.elementEn} - ${stemText}`}
        </span>
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

  const getInteractionTooltip = (type: string) => {
    const mapping = BAZI_MAPPING.interactions[type as keyof typeof BAZI_MAPPING.interactions];
    const tooltipKey = type === '격합' ? 'gyeokHap' : 
                       type === '원합' ? 'wonHap' : 
                       type === '격충' ? 'gyeokChung' : 
                       type === '원충' ? 'wonChung' : null;
    
    if (tooltipKey) {
      return BAZI_MAPPING.tooltips[tooltipKey as keyof typeof BAZI_MAPPING.tooltips];
    }
    
    return {
      ko: mapping?.ko || type,
      en: mapping?.en || type
    };
  };

  const renderTitle = () => {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <div className="flex items-center text-3xl md:text-5xl font-gothic tracking-widest uppercase">
          <span className="text-white">{userName.toUpperCase()}</span>
          <span className="text-[0.7em] text-white/40 ml-2 self-end mb-1 md:mb-2">{lang === 'KO' ? '님의' : "'S"}</span>
        </div>
        <div className="inline-block relative">
          <h2 className="font-gothic text-3xl md:text-5xl tracking-widest uppercase neon-text-pink">
            {t.title}
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-1 bg-neon-cyan rounded-full shadow-[0_0_15px_#00F2FF] mt-1" 
          />
        </div>
      </div>
    );
  };

  const formatName = (name: string) => {
    if (lang === 'KO') return name;
    return name.startsWith('The ') ? name.slice(4) : name;
  };

  const getTenGodColor = (name: string) => {
    return TEN_GOD_COLORS[name as keyof typeof TEN_GOD_COLORS] || '#FFFFFF';
  };

  const currentCycle = result.grandCycles[result.currentCycleIndex] || result.grandCycles[0];
  const dayMaster = result.pillars[1].stem;
  
  const tenGod = React.useMemo(() => {
    return calculateTenGods(dayMaster, currentCycle.element);
  }, [dayMaster, currentCycle.element]);

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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-12">
      <div className="text-center">
        {renderTitle()}
      </div>

      {/* Character Commentary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="goth-glass p-6 rounded-2xl border-l-4 border-neon-pink flex items-start gap-4"
      >
        <div className="bg-neon-pink/20 p-3 rounded-full">
          <MessageSquare className="w-6 h-6 text-neon-pink" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-display font-medium text-white/50 uppercase tracking-[0.2em]">{t.seasonVibe}</div>
            <div className="text-[10px] text-white/30 italic">{t.seasonVibeDisclaimer}</div>
          </div>
          <p className="text-lg font-display italic text-white leading-relaxed">
            "{((t.comments[currentCycle.element as keyof typeof t.comments] as any)?.[tenGod] || 
               (t.comments[currentCycle.element as keyof typeof t.comments] as any)?.BiGyean)}"
          </p>
        </div>
      </motion.div>

      {/* 8 Pillars Grid (4x2) */}
      <div className="space-y-4">
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setShowHanja(!showHanja)} 
            className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors text-white/70"
          >
            {showHanja ? (lang === 'KO' ? '한자 숨기기' : 'Hide Hanja') : (lang === 'KO' ? '한자 보기' : 'Show Hanja')}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {result.pillars.map((pillar, i) => (
            <motion.div
              key={`stem-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="goth-glass rounded-xl border-t-2 flex flex-col overflow-hidden"
              style={{ borderColor: ELEMENT_COLORS[pillar.element as keyof typeof ELEMENT_COLORS] || '#FF007A' }}
            >
              <div className="p-3 md:p-4 flex flex-col items-center text-center space-y-2 flex-grow relative">
                <div className="absolute top-2 right-2 opacity-40">
                  <PolarityIcon polarity={pillar.stemPolarity} />
                </div>
                <div className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase">
                  {lang === 'KO' ? 
                    (pillar.title === 'Year' ? '연간' : pillar.title === 'Month' ? '월간' : pillar.title === 'Day' ? '일간' : '시간') : 
                    `${pillar.title} Stem`}
                </div>
                <div className="text-xl md:text-3xl font-gothic text-white leading-tight min-h-[3.2em] flex flex-col justify-center">
                  {lang === 'KO' ? 
                    (showHanja ? `${pillar.stem}(${BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.ko || pillar.stem})` : `${BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.ko || pillar.stem}`) : 
                    (showHanja ? `${pillar.stem} (${BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.en || pillar.stem})` : (BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.en || pillar.stem).split(' ').map((word, idx) => (
                      <div key={idx}>{word}</div>
                    )))}
                </div>
              </div>
              <div className="bg-white/5 border-t border-white/10 py-2 px-1 text-center">
                <div 
                  className="text-[10px] md:text-[11px] font-display font-bold uppercase tracking-wider truncate"
                  style={{ color: getTenGodColor(lang === 'KO' ? pillar.stemKoreanName : pillar.stemEnglishName) }}
                >
                  {lang === 'KO' ? pillar.stemKoreanName : formatName(pillar.stemEnglishName)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {result.pillars.map((pillar, i) => {
            const lifeStage = BAZI_MAPPING.lifeStages[dayMaster as keyof typeof BAZI_MAPPING.lifeStages]?.[pillar.branch as keyof typeof BAZI_MAPPING.lifeStages[keyof typeof BAZI_MAPPING.lifeStages]];
            return (
              <motion.div
                key={`branch-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 4) * 0.05 }}
                className="goth-glass rounded-xl border-t-2 flex flex-col overflow-hidden"
                style={{ borderColor: ELEMENT_COLORS[BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FF007A' }}
              >
                <div className="p-3 md:p-4 flex flex-col items-center text-center space-y-2 flex-grow relative">
                  <div className="absolute top-2 right-2 opacity-40">
                    <PolarityIcon polarity={pillar.branchPolarity} />
                  </div>
                  <div className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase">
                    {lang === 'KO' ? 
                      (pillar.title === 'Year' ? '연지' : pillar.title === 'Month' ? '월지' : pillar.title === 'Day' ? '일지' : '시지') : 
                      `${pillar.title} Branch`}
                  </div>
                  <div className="text-xl md:text-3xl font-gothic text-white/60 leading-tight min-h-[1.6em] flex flex-col justify-center">
                    {lang === 'KO' ? 
                      (showHanja ? `${pillar.branch}(${BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches]?.ko || pillar.branch})` : `${BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches]?.ko || pillar.branch}`) : 
                      (showHanja ? `${pillar.branch} (${BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches]?.en || pillar.branch})` : (BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches]?.en || pillar.branch))}
                  </div>
                  <div className="text-[10px] text-neon-cyan font-bold">
                    {lang === 'KO' ? lifeStage.ko : lifeStage.en}
                  </div>
                </div>
                <div className="bg-white/5 border-t border-white/10 py-2 px-1 text-center">
                  <div 
                    className="text-[10px] md:text-[11px] font-display font-bold uppercase tracking-wider truncate"
                    style={{ color: getTenGodColor(lang === 'KO' ? pillar.branchKoreanName : pillar.branchEnglishName) }}
                  >
                    {lang === 'KO' ? pillar.branchKoreanName : formatName(pillar.branchEnglishName)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>



      {/* Grand Cycle Timeline */}
      <div className="space-y-6">
        <h3 className="text-xs font-display font-bold tracking-[0.4em] text-white/60 uppercase text-center">
          {t.grandCycle}
        </h3>
        <div className="relative overflow-x-auto pb-4 scrollbar-neon-purple" dir="rtl">
          <div className="flex gap-4 min-w-max px-4 flex-row-reverse">
            {[...result.grandCycles].reverse().map((cycle, i) => {
              const actualIndex = result.grandCycles.length - 1 - i;
              const isCurrent = actualIndex === result.currentCycleIndex;
              const isExpanded = expandedCycle === actualIndex;

              return (
                <div key={actualIndex} className="flex flex-col items-center space-y-1" dir="ltr">
                  <div className="text-xs text-white/40 font-mono">
                    {cycle.year}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-1" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[cycle.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                    <PolarityIcon polarity={cycle.stemPolarity} size={8} />
                    {lang === 'KO' ? cycle.stemTenGodKo : cycle.stemTenGodEn}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setExpandedCycle(isExpanded ? null : actualIndex);
                      setExpandedYear(null);
                      setExpandedMonth(null);
                    }}
                    className={`w-16 h-24 rounded-xl border transition-all flex flex-col items-center justify-center p-2 relative ${
                      isCurrent ? 'border-neon-pink bg-neon-pink/10 shadow-[0_0_15px_rgba(255,0,122,0.3)]' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-white/40 mb-1 uppercase leading-tight text-center px-1">
                      {getLifeStage(cycle.age)}
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{cycle.age}</div>
                    <div 
                      className="text-[10px] md:text-xs font-gothic leading-tight text-center"
                      style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[cycle.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                    >
                      {renderPillarText('stem', cycle.stem)}
                    </div>
                    <div 
                      className="text-[10px] md:text-xs font-gothic leading-tight text-center opacity-80"
                      style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[cycle.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                    >
                      {renderPillarText('branch', cycle.branch)}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      {isExpanded ? <ChevronUp className="w-3 h-3 text-neon-pink" /> : <ChevronDown className="w-3 h-3 text-white/20" />}
                    </div>
                  </motion.button>
                  <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-1" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[cycle.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
                    <PolarityIcon polarity={cycle.branchPolarity} size={8} />
                    {lang === 'KO' ? cycle.branchTenGodKo : cycle.branchTenGodEn}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Timeline Line */}
          <div className="absolute top-[55px] left-0 w-full h-[1px] bg-white/10 -z-10" />
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
                  return (
                    <div key={api} className="flex flex-col items-center space-y-1">
                      <div className="text-[10px] font-mono text-white/40">{ap.year}</div>
                      <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[ap.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                        <PolarityIcon polarity={ap.stemPolarity} size={6} />
                        {lang === 'KO' ? ap.stemTenGodKo : ap.stemTenGodEn}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setExpandedYear(isYearExpanded ? null : api);
                          setExpandedMonth(null);
                        }}
                        className={`w-16 bg-white/5 rounded-lg p-2 flex flex-col items-center border transition-all relative ${
                          isYearExpanded ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/5'
                        }`}
                      >
                        <div className="text-xs font-bold text-white mb-1">{ap.age}</div>
                        <div 
                          className="text-[10px] font-gothic font-bold text-center"
                          style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[ap.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                        >
                          {renderPillarText('stem', ap.stem)}
                        </div>
                        <div 
                          className="text-[10px] font-gothic text-center opacity-70"
                          style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[ap.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                        >
                          {renderPillarText('branch', ap.branch)}
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                          {isYearExpanded ? <ChevronUp className="w-2 h-2 text-neon-cyan" /> : <ChevronDown className="w-2 h-2 text-white/20" />}
                        </div>
                      </motion.button>
                      <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[ap.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
                        <PolarityIcon polarity={ap.branchPolarity} size={6} />
                        {lang === 'KO' ? ap.branchTenGodKo : ap.branchTenGodEn}
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
                          return (
                            <div key={mi} className="flex flex-col items-center space-y-1 w-24">
                              <div className="text-[13px] font-mono text-white/90 font-bold uppercase">
                                {t.months[m.month - 1]}
                              </div>
                              <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[m.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                                <PolarityIcon polarity={m.stemPolarity} size={6} />
                                {lang === 'KO' ? m.stemTenGodKo : m.stemTenGodEn}
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setExpandedMonth(isMonthExpanded ? null : mi)}
                                className={`w-full bg-white/5 rounded-lg p-3 flex flex-col items-center border transition-all min-h-[70px] justify-center relative ${
                                  isMonthExpanded ? 'border-neon-pink bg-neon-pink/5' : 'border-white/5'
                                }`}
                              >
                                <div 
                                  className="text-[10px] font-gothic font-bold text-center"
                                  style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[m.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                >
                                  {renderPillarText('stem', m.stem)}
                                </div>
                                <div 
                                  className="text-[10px] font-gothic text-center opacity-70"
                                  style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[m.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                >
                                  {renderPillarText('branch', m.branch)}
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                                  {isMonthExpanded ? <ChevronUp className="w-2 h-2 text-neon-pink" /> : <ChevronDown className="w-2 h-2 text-white/20" />}
                                </div>
                              </motion.button>
                              <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[m.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
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
                            {result.grandCycles[expandedCycle].annualPillars[expandedYear].monthlyPillars[expandedMonth].dailyPillars.map((d, di) => (
                              <div key={di} className="flex flex-col items-center space-y-1 w-16 flex-shrink-0">
                                <div className="text-[12px] font-mono text-white/90 font-bold">{d.day}</div>
                                <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[d.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                                  <PolarityIcon polarity={d.stemPolarity} size={5} />
                                  {lang === 'KO' ? d.stemTenGodKo : d.stemTenGodEn}
                                </div>
                                <div className="w-full bg-white/5 rounded-lg p-2 flex flex-col items-center border border-white/5">
                                  <div 
                                    className="text-[10px] font-gothic font-bold text-center"
                                    style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[d.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                  >
                                    {renderPillarText('stem', d.stem)}
                                  </div>
                                  <div 
                                    className="text-[10px] font-gothic text-center opacity-70"
                                    style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[d.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                  >
                                    {renderPillarText('branch', d.branch)}
                                  </div>
                                </div>
                                <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[d.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
                                  <PolarityIcon polarity={d.branchPolarity} size={5} />
                                  {lang === 'KO' ? d.branchTenGodKo : d.branchTenGodEn}
                                </div>
                              </div>
                            ))}
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

      {/* Saju Analysis Button & Report */}
      <div className="flex flex-col items-center space-y-6 pt-8">
        <button 
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="px-6 py-3 bg-neon-pink/20 border border-neon-pink text-neon-pink font-display font-bold tracking-widest uppercase hover:bg-neon-pink hover:text-white transition-all rounded-lg shadow-[0_0_15px_rgba(255,20,147,0.4)]"
        >
          {lang === 'KO' ? '사주 풀이하기 (Extract Soul Details)' : 'Extract Soul Details'}
        </button>

        <AnimatePresence>
          {showAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full overflow-hidden"
            >
              <div className="goth-glass p-6 rounded-2xl border border-white/10 space-y-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-[1px] w-12 bg-neon-cyan/50"></div>
                  <h3 className="text-xl font-display font-medium text-neon-cyan uppercase tracking-[0.2em]">
                    {lang === 'KO' ? '오행 분석 리포트' : 'Elemental Analysis Report'}
                  </h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-cyan/20 to-transparent"></div>
                </div>
                
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
                          contentStyle={{ backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: number) => [`${(value / 8 * 100).toFixed(1)}%`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {elementData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-sm text-white/80 font-mono">{d.name}: {(d.value / 8 * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                      <p className="text-sm font-display leading-relaxed text-white/90 italic">
                        "{getAnalysisText()}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Advanced Analysis Section */}
                {result.analysis && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div className="space-y-4">
                      <BaziTooltip content={BAZI_MAPPING.tooltips.geJu} lang={lang}>
                        <div className="flex items-center gap-3 mb-4 cursor-help">
                          <div className="h-[1px] w-8 bg-neon-pink/50"></div>
                          <h4 className="text-sm font-display font-medium text-neon-pink uppercase tracking-[0.2em]">{lang === 'KO' ? '격국과 용신 (Structure & Useful God)' : 'Structure & Useful God'}</h4>
                          <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-pink/20 to-transparent"></div>
                        </div>
                      </BaziTooltip>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3 h-full">
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-white/60 text-xs shrink-0 pt-0.5">{lang === 'KO' ? '격국 (Structure)' : 'Structure'}</span>
                          <span className="text-white font-bold text-right">{lang === 'KO' ? result.analysis.geJu : (BAZI_MAPPING.geju[result.analysis.geJu as keyof typeof BAZI_MAPPING.geju]?.en || result.analysis.geJu)}</span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <BaziTooltip content={BAZI_MAPPING.tooltips.dayMasterStrength} lang={lang}>
                            <span className="text-white/60 text-xs cursor-help shrink-0 pt-0.5">{lang === 'KO' ? '일간 강약 (DM Strength)' : 'DM Strength'}</span>
                          </BaziTooltip>
                          <span className="text-white font-bold text-right">{getStrengthLevel(result.analysis.dayMasterStrength.level)} ({result.analysis.dayMasterStrength.score.toFixed(1)})</span>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <BaziTooltip content={BAZI_MAPPING.tooltips.yongShen} lang={lang}>
                            <div className="flex items-center gap-1 cursor-help" onClick={() => setShowYongshinInfo(true)}>
                              <span className="text-white/60 text-xs shrink-0 pt-0.5">{lang === 'KO' ? '용신 (Useful God)' : 'Useful God'}</span>
                              <HelpCircle className="w-3 h-3 text-white/40 hover:text-white transition-colors cursor-pointer" />
                            </div>
                          </BaziTooltip>
                          <span className="text-white font-bold text-neon-pink text-right">{result.analysis.yongShen}</span>
                        </div>
                        {result.analysis.yongshinDetail.byeongYak && (
                          <div className="pt-2 border-t border-white/5 space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="h-[1px] w-4 bg-yellow-400/50"></div>
                              <div className="text-[10px] font-display font-medium text-yellow-400/80 uppercase tracking-[0.2em]">{lang === 'KO' ? '병약용신' : 'Byeong-Yak'}</div>
                            </div>
                            <div className="text-xs text-yellow-400/80 italic">{lang === 'KO' ? result.analysis.yongshinDetail.byeongYak.note : result.analysis.yongshinDetail.byeongYak.noteEn}</div>
                          </div>
                        )}
                        {result.analysis.yongshinDetail.tongGwan && (
                          <div className="pt-2 border-t border-white/5 space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="h-[1px] w-4 bg-neon-cyan/50"></div>
                              <div className="text-[10px] font-display font-medium text-neon-cyan/80 uppercase tracking-[0.2em]">{lang === 'KO' ? '통관용신' : 'Tong-Gwan'}</div>
                              <button onClick={() => setShowTongGwanInfo(true)} className="text-neon-cyan/60 hover:text-neon-cyan transition-colors" title={lang === 'KO' ? '설명 보기' : 'View explanation'}>
                                <HelpCircle className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-xs text-neon-cyan/80 italic">{lang === 'KO' ? result.analysis.yongshinDetail.tongGwan.note : result.analysis.yongshinDetail.tongGwan.noteEn}</div>
                          </div>
                        )}
                        {result.analysis.yongshinDetail.eokbu && (
                          <div className="pt-2 border-t border-white/5 space-y-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="h-[1px] w-4 bg-neon-pink/50"></div>
                              <div className="text-[10px] font-display font-medium text-neon-pink/80 uppercase tracking-[0.2em]">{lang === 'KO' ? '억부용신' : 'Eokbu'}</div>
                              <button onClick={() => setShowEokbuInfo(true)} className="text-neon-pink/60 hover:text-neon-pink transition-colors" title={lang === 'KO' ? '설명 보기' : 'View explanation'}>
                                <HelpCircle className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-xs text-neon-pink/80 italic">{lang === 'KO' ? result.analysis.yongshinDetail.eokbu.note : result.analysis.yongshinDetail.eokbu.noteEn}</div>
                          </div>
                        )}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] text-white/40 uppercase">{lang === 'KO' ? '희신' : 'HeeShin'}</span>
                            <span className="text-[11px] text-green-400 font-bold text-center">{renderYongshinWithElement(result.analysis.yongshinDetail.heeShin.god)}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] text-white/40 uppercase">{lang === 'KO' ? '기신' : 'GiShin'}</span>
                            <span className="text-[11px] text-red-400 font-bold text-center">{renderYongshinWithElement(result.analysis.yongshinDetail.giShin.god)}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-[9px] text-white/40 uppercase">{lang === 'KO' ? '구신' : 'GuShin'}</span>
                            <span className="text-[11px] text-orange-400 font-bold text-center">{renderYongshinWithElement(result.analysis.yongshinDetail.guShin.god)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <BaziTooltip content={BAZI_MAPPING.tooltips.interactions} lang={lang}>
                        <div className="flex items-center gap-3 mb-4 cursor-help">
                          <div className="h-[1px] w-8 bg-neon-cyan/50"></div>
                          <h4 className="text-sm font-display font-medium text-neon-cyan uppercase tracking-[0.2em]">{lang === 'KO' ? '합형충파해 (Interactions)' : 'Interactions'}</h4>
                          <div className="h-[1px] flex-1 bg-gradient-to-r from-neon-cyan/20 to-transparent"></div>
                        </div>
                      </BaziTooltip>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4 h-full">
                        {result.analysis.interactions.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {result.analysis.interactions.map((interaction, i) => (
                              <BaziTooltip 
                                key={i} 
                                content={getInteractionTooltip(interaction.type)} 
                                lang={lang}
                              >
                                <div 
                                  className="flex flex-col p-2 bg-white/5 rounded border border-white/10 min-w-[80px] cursor-pointer hover:bg-white/10 transition-colors"
                                  onClick={() => setShowInteractionInfo(interaction.type)}
                                >
                                  <span className="text-[10px] text-white/40 uppercase tracking-tighter">{getInteractionName(interaction.type)}</span>
                                  <span className="text-xs text-white font-bold">{interaction.note}</span>
                                  <span className="text-[9px] text-neon-cyan/60">
                                    {interaction.branches?.join('-') || interaction.stems?.join('-')}
                                  </span>
                                </div>
                              </BaziTooltip>
                            ))}
                          </div>
                        ) : (
                          <span className="text-white/40 text-xs italic">{lang === 'KO' ? '특별한 충돌이나 결합이 없습니다.' : 'No significant interactions.'}</span>
                        )}
                        
                        {result.analysis.conflicts.length > 0 && (
                          <div className="pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-[1px] w-4 bg-red-400/50"></div>
                              <div className="text-[10px] font-display font-medium text-red-400/80 uppercase tracking-[0.2em]">{lang === 'KO' ? '주의할 충돌' : 'Conflicts'}</div>
                            </div>
                            <div className="space-y-1">
                              {result.analysis.conflicts.map((c, i) => (
                                <div key={i} className="text-[11px] text-red-400/80 italic">• {c.note}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-[1px] w-8 bg-green-400/50"></div>
                        <h4 className="text-sm font-display font-medium text-green-400 uppercase tracking-[0.2em]">{lang === 'KO' ? '십성 비율 (Ten Gods Ratio)' : 'Ten Gods Ratio'}</h4>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-green-400/20 to-transparent"></div>
                      </div>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                        <div className="flex flex-wrap gap-4 justify-between">
                          {Object.entries(result.analysis.tenGodsRatio).map(([god, ratio]) => (
                            <div key={god} className="flex flex-col items-center space-y-2 flex-1 min-w-[80px]">
                              <span className="text-xs text-white/60 text-center">{god}</span>
                              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-400 rounded-full"
                                  style={{ width: `${ratio}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-white">{ratio}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                      <BaziTooltip content={BAZI_MAPPING.tooltips.shinsal} lang={lang}>
                        <div className="flex items-center gap-3 mb-4 cursor-help">
                          <div className="h-[1px] w-8 bg-yellow-400/50"></div>
                          <h4 className="text-sm font-display font-medium text-yellow-400 uppercase tracking-[0.2em]">{lang === 'KO' ? '신살 및 공망 (Divine Stars & Void)' : 'Divine Stars & Void'}</h4>
                          <div className="h-[1px] flex-1 bg-gradient-to-r from-yellow-400/20 to-transparent"></div>
                        </div>
                      </BaziTooltip>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4">
                        {result.analysis.shinsal.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {result.analysis.shinsal.map((star, i) => {
                              const shinsalName = getShinsalName(star.name);
                              const definition = SHINSAL_DEFINITIONS[shinsalName as keyof typeof SHINSAL_DEFINITIONS];
                              
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
                                      star.severity === 'strong' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400' : 'bg-yellow-400/5 border-yellow-400/30 text-yellow-400/70'
                                    }`}>
                                      <span>{shinsalName}</span>
                                    </div>
                                  </div>
                                </BaziTooltip>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-white/40 text-xs italic">{lang === 'KO' ? '해당되는 주요 신살이 없습니다.' : 'No major divine stars present.'}</span>
                        )}
                        
                        <div className="pt-2 border-t border-white/5">
                          <BaziTooltip content={BAZI_MAPPING.tooltips.gongmang} lang={lang}>
                            <div className="flex items-center gap-2 mb-2 cursor-help">
                              <div className="h-[1px] w-4 bg-white/30"></div>
                              <div className="text-[10px] font-display font-medium text-white/60 uppercase tracking-[0.2em]">{lang === 'KO' ? '공망 (Void Branches)' : 'Void Branches'}</div>
                            </div>
                          </BaziTooltip>
                          <div className="flex gap-2">
                            {result.analysis.gongmang?.branches?.map((b: string, i: number) => (
                              <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-white/60 border border-white/10">
                                {b}
                              </span>
                            ))}
                            <span className="text-[10px] text-white/30 self-center ml-2 italic">
                              {result.analysis.gongmang?.inChart 
                                ? (lang === 'KO' ? `(${result.analysis.gongmang?.affectedPillars?.join(', ')} 기운 약화)` : `(Weakens ${result.analysis.gongmang?.affectedPillars?.join(', ')} pillars)`)
                                : (lang === 'KO' ? '(원국에 없음)' : '(Not in chart)')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                    
                  <GongmangDetail result={result} lang={lang} />
                </>
              )}
            </div>
          </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onBack}
          className="px-8 py-3 border border-neon-pink text-neon-pink text-xs font-bold tracking-[0.3em] hover:bg-neon-pink hover:text-white transition-all rounded-full"
        >
          {t.back}
        </button>
      </div>

      {/* Tong-Gwan Yongshin Info Modal */}
      <AnimatePresence>
        {showTongGwanInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowTongGwanInfo(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-neon-cyan">
                    {lang === 'KO' ? '통관용신(通關用神)이란?' : 'What is Tong-Gwan (Mediating) Yongshin?'}
                  </h3>
                  <button onClick={() => setShowTongGwanInfo(false)} className="text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="text-sm text-white/80 space-y-4 leading-relaxed">
                  <p>
                    {lang === 'KO' 
                      ? '대립하는 두 기운 사이를 이어주어 소통시키는 오행입니다.' 
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
          </div>
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
              className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-neon-pink">
                    {lang === 'KO' ? '용신(用神)이란?' : 'What is Yongshin?'}
                  </h3>
                  <button onClick={() => setShowYongshinInfo(false)} className="text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="text-sm text-white/80 space-y-4 leading-relaxed">
                  <p>
                    {lang === 'KO' 
                      ? '용신은 사주팔자의 균형을 맞추고, 부족한 기운을 보완하여 인생의 흐름을 원활하게 만드는 가장 필요한 오행입니다.' 
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
              className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-neon-pink">
                    {lang === 'KO' ? '억부용신(抑扶用神)이란?' : 'What is Eokbu (Balancing) Yongshin?'}
                  </h3>
                  <button onClick={() => setShowEokbuInfo(false)} className="text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="text-sm text-white/80 space-y-4 leading-relaxed">
                  <p>
                    {lang === 'KO' 
                      ? '사주의 균형을 맞추기 위해, 너무 강한 기운은 억제(抑)하고 부족한 기운은 도와주는(扶) 오행입니다.' 
                      : 'To balance the chart, Eokbu Yongshin suppresses (抑) overly strong elements and supports (扶) weak ones.'}
                  </p>

                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                    <h4 className="font-bold text-white/90">{lang === 'KO' ? '사용자 맞춤 분석' : 'Personalized Analysis'}</h4>
                    <p>
                      {lang === 'KO' 
                        ? '사주 내에서 강한 기운을 조절하여 전체적인 균형을 잡는 역할을 합니다.'
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
              className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-neon-cyan">
                    {lang === 'KO' ? '상호작용 상세' : 'Interaction Details'}
                  </h3>
                  <button onClick={() => setShowInteractionInfo(null)} className="text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
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
                    <p>{lang === 'KO' ? '상세 설명이 준비 중입니다.' : 'Detailed explanation is being prepared.'}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
