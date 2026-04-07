import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BaZiResult, Language } from '../types';
import { TRANSLATIONS, ELEMENT_COLORS, TEN_GOD_COLORS } from '../constants';
import { SHINSAL_DEFINITIONS } from '../constants/shinsal-definitions';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { AdvancedAnalysisSection } from './AdvancedAnalysisSection';
import { GeJuHelpModal } from './GeJuHelpModal';
import { calculateTenGods, STEM_ELEMENTS, BRANCH_ELEMENTS } from '../services/bazi-engine';
import { 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Sun, 
  Moon, 
  HelpCircle, 
  X, 
  Zap, 
  BookOpen, 
  Clock,
  CheckCircle2,
  Sparkles,
  Share2
} from 'lucide-react';

import { generateSoulSummary, SoulSummary } from '../services/bazi-summary-service';

const TypingText: React.FC<{ text: string, speed?: number }> = ({ text, speed = 30 }) => {
  const [displayedElements, setDisplayedElements] = React.useState<React.ReactNode[]>([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [showCursor, setShowCursor] = React.useState(true);

  // Blinking cursor effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Reset state when text changes
  React.useEffect(() => {
    setDisplayedElements([]);
    setCurrentIndex(0);
  }, [text]);

  const charInfos = React.useMemo(() => {
    if (!text) return [];
    
    const infos: { char: string, delay: number, color?: string, isBlinking?: boolean }[] = [];
    const effectNames = ["식상생재", "재생관", "살인상생", "식신제살", "관인상생", "상관패인", "재극인", "아능생모", "겁재탈재"];
    
    const closingRemarks = [
      "이제 네 독설조차 고귀한 비평으로 대접받을거야.",
      "이제 그 감각을 통장 잔고로 증명할 시간이야, 후훗.",
      "어둠 속에서 더 빛나는 법이지.",
      "이제 네 실력을 똑똑히 보여줘.",
      "세상이 널 위해 레드카펫을 깔아주는 기분이랄까?",
      "명예도 좋지만, 가끔은 속물적인 성공도 달콤한 법이지."
    ];

    for (let i = 0; i < text.length; i++) {
      const foundRemark = closingRemarks.find(remark => text.substring(i).startsWith(remark));
      if (foundRemark) {
        infos.push({ char: '\n', delay: speed });
        infos.push({ char: '', delay: 2500, isBlinking: true });
        
        for (let j = 0; j < foundRemark.length; j++) {
          infos.push({ char: foundRemark[j], delay: speed });
        }
        i += foundRemark.length - 1;
        continue;
      }

      const yearMatch = text.substring(i).match(/^\d{4}(년)?/);
      if (yearMatch) {
        const yearStr = yearMatch[0];
        for (let j = 0; j < yearStr.length; j++) {
          infos.push({ char: yearStr[j], delay: speed, color: '#00F2FF' });
        }
        i += yearStr.length - 1;
        continue;
      }

      if (text[i] === "'") {
        const endQuoteIndex = text.indexOf("'", i + 1);
        if (endQuoteIndex !== -1) {
          const quotedText = text.substring(i + 1, endQuoteIndex);
          const multiplier = 3; // 3x slower as requested
          
          infos.push({ char: "'", delay: speed * multiplier });
          for (let j = 0; j < quotedText.length; j++) {
            infos.push({ char: quotedText[j], delay: speed * multiplier });
          }
          infos.push({ char: "'", delay: speed * multiplier });
          
          i = endQuoteIndex;
          continue;
        }
      }

      const char = text[i];
      let delay = speed;
      if (char === ',') delay = 1500;
      else if (char === '.') {
        delay = 2000;
        infos.push({ char, delay });
        // Add line break after period for better layout
        if (i < text.length - 1 && text[i+1] !== '\n') {
          infos.push({ char: '\n', delay: speed });
          // Skip next space if it exists to keep alignment clean
          if (text[i+1] === ' ') i++;
        }
        continue;
      }
      else if (char === '\n') delay = speed * 15;

      infos.push({ char, delay });
    }
    return infos;
  }, [text, speed]);

  React.useEffect(() => {
    if (currentIndex < charInfos.length) {
      const info = charInfos[currentIndex];
      // Logic: Wait based on the PREVIOUS character's delay requirement.
      // This ensures the current character (like a comma) is shown FIRST, then we wait.
      const prevInfo = currentIndex > 0 ? charInfos[currentIndex - 1] : null;
      const currentDelay = prevInfo ? prevInfo.delay : speed;

      const timeout = setTimeout(() => {
        if (info.char !== '') {
          setDisplayedElements(prev => [
            ...prev, 
            <span key={currentIndex} style={{ color: info.color }}>{info.char}</span>
          ]);
        }
        setCurrentIndex(prev => prev + 1);
      }, currentDelay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, charInfos, speed]);

  return (
    <span className="whitespace-pre-wrap">
      {displayedElements}
      {currentIndex < charInfos.length && (
        <span className={`${showCursor ? "opacity-100" : "opacity-0"} inline-block w-[2px] h-[1.2em] bg-neon-pink ml-1 align-middle shadow-[0_0_8px_rgba(255,20,147,0.8)]`}></span>
      )}
    </span>
  );
};



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
              
              <div className="p-4 bg-neon-pink/5 rounded-xl border border-neon-pink/20 shadow-[0_0_15px_rgba(255,20,147,0.05)]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-neon-pink/20 text-neon-pink px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Personalized</span>
                  <strong className="text-white/90">궁성(자리)에 따른 나의 공망 의미:</strong>
                </div>
                <ul className="list-disc pl-4 space-y-2">
                  {affectedPillars.includes('년주') && <li><strong className="text-neon-pink/90">년주(Year):</strong> 조상의 덕이 부족하거나 고향을 떠나 자수성가해야 할 수 있습니다.</li>}
                  {affectedPillars.includes('월주') && <li><strong className="text-neon-pink/90">월주(Month):</strong> 부모, 형제의 덕이 약하며 사회 생활이나 직장 운에서 정착이 어려울 수 있습니다.</li>}
                  {affectedPillars.includes('일주') && <li><strong className="text-neon-pink/90">일주(Day):</strong> 본인의 내면적 공허함이 있거나 배우자와의 인연이 약할 수 있습니다.</li>}
                  {affectedPillars.includes('시주') && <li><strong className="text-neon-pink/90">시주(Hour):</strong> 노년의 고독이나 자식과의 인연이 박할 수 있으며, 일의 최종 결과물이 허무할 수 있습니다.</li>}
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
            
            <div className="p-4 bg-neon-pink/5 rounded-xl border border-neon-pink/20 shadow-[0_0_15px_rgba(255,20,147,0.05)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-neon-pink/20 text-neon-pink px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Personalized</span>
                <strong className="text-white/90">Meaning by Pillar Position in Your Chart:</strong>
              </div>
              <ul className="list-disc pl-4 space-y-2">
                {affectedPillars.includes('년주') && <li><strong className="text-neon-pink/90">Year Pillar:</strong> Lack of ancestral benefits; may need to leave home and succeed independently.</li>}
                {affectedPillars.includes('월주') && <li><strong className="text-neon-pink/90">Month Pillar:</strong> Weak benefits from parents/siblings; may face challenges settling in society or career.</li>}
                {affectedPillars.includes('일주') && <li><strong className="text-neon-pink/90">Day Pillar:</strong> Inner emptiness or weak karmic ties/alignment with a spouse.</li>}
                {affectedPillars.includes('시주') && <li><strong className="text-neon-pink/90">Hour Pillar:</strong> Solitude in old age, weak ties with children, or feeling empty about final outcomes.</li>}
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
              className="w-64 p-3 bg-black/95 border border-white/20 rounded-lg shadow-2xl backdrop-blur-xl pointer-events-none"
            >
              <div 
                className="text-xs text-white/90 leading-relaxed font-sans"
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
  const [showYongshinRolesInfo, setShowYongshinRolesInfo] = useState(false);
  const [showInteractionInfo, setShowInteractionInfo] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showHanja, setShowHanja] = useState(true);
  const [showStrengthInfo, setShowStrengthInfo] = useState(false);
  const [showGeJuInfo, setShowGeJuInfo] = useState(false);
  const [showMuJaDaJaInfo, setShowMuJaDaJaInfo] = useState<{ title: string, description: string } | null>(null);
  const [showMuJaDaJaHelp, setShowMuJaDaJaHelp] = useState(false);
  const [isCycleVibeExpanded, setIsCycleVibeExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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
    const { geJu, yongShen, structureDetail } = result.analysis;
    if (structureDetail) {
      if (lang === 'KO') {
        return `${structureDetail.title} (${structureDetail.category === 'Standard' ? '내격' : '종격'})으로 태어났습니다. ${structureDetail.marketingMessage} ${yongShen}을 삶의 핵심 에너지로 사용합니다.`;
      }
      return `Born with ${structureDetail.enTitle} (${structureDetail.category} Alignment). ${structureDetail.enMarketingMessage} Utilizing ${yongShen} as your primary cosmic driver.`;
    }
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
    const dayPillar = result.pillars.find(p => p.title === 'Day');
    if (!dayPillar) return null;
    
    const dayMaster = dayPillar.stem;
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

  const renderYongshinWithElement = (god: string, isModal: boolean = false) => {
    const info = getGodElementInfo(god);
    const godName = getYongshinName(god);
    
    if (!info) return <span>{godName}</span>;

    const stemText = info.stems.map(s => {
      const stemInfo = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems];
      return `${lang === 'KO' ? stemInfo.ko : stemInfo.en} (${s})`;
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
    return TEN_GOD_COLORS[name as keyof typeof TEN_GOD_COLORS] || '#FFFFFF';
  };

  const colorizeAdvancedAnalysis = (text: string) => {
    if (!text) return text;
    let colorized = text;
    const dayMaster = result.pillars[1].stem;
    const dmElement = STEM_ELEMENTS[dayMaster];
    const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIdx = cycle.indexOf(dmElement);

    const elements = {
      BiGyeop: cycle[dmIdx],
      SikSang: cycle[(dmIdx + 1) % 5],
      JaeSeong: cycle[(dmIdx + 2) % 5],
      GwanSeong: cycle[(dmIdx + 3) % 5],
      InSeong: cycle[(dmIdx + 4) % 5]
    };

    const tenGodsMap = {
      '비겁': elements.BiGyeop,
      '비견': elements.BiGyeop,
      '겁재': elements.BiGyeop,
      'Self': elements.BiGyeop,
      'Mirror/Rival': elements.BiGyeop,
      'Mirror': elements.BiGyeop,
      'Rival': elements.BiGyeop,
      '식상': elements.SikSang,
      '식신': elements.SikSang,
      '상관': elements.SikSang,
      'Output': elements.SikSang,
      'Artist/Rebel': elements.SikSang,
      'Artist': elements.SikSang,
      'Rebel': elements.SikSang,
      '재성': elements.JaeSeong,
      '편재': elements.JaeSeong,
      '정재': elements.JaeSeong,
      'Wealth': elements.JaeSeong,
      'Maverick/Architect': elements.JaeSeong,
      'Maverick': elements.JaeSeong,
      'Architect': elements.JaeSeong,
      '관성': elements.GwanSeong,
      '편관': elements.GwanSeong,
      '정관': elements.GwanSeong,
      'Power': elements.GwanSeong,
      'Warrior/Judge': elements.GwanSeong,
      'Warrior': elements.GwanSeong,
      'Judge': elements.GwanSeong,
      '인성': elements.InSeong,
      '편인': elements.InSeong,
      '정인': elements.InSeong,
      'Wisdom': elements.InSeong,
      'Mystic/Sage': elements.InSeong,
      'Mystic': elements.InSeong,
      'Sage': elements.InSeong,
      '무재': elements.JaeSeong,
      '무관': elements.GwanSeong,
      '무인': elements.InSeong,
      '무식상': elements.SikSang,
      '무비겁': elements.BiGyeop,
    };

    const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // First, protect '천재성' by replacing it with a placeholder
    const placeholder = "__GENIUS_PLACEHOLDER__";
    colorized = colorized.replace(/천재성/g, placeholder);

    // Sort keys by length descending to match longer terms first
    const sortedEntries = Object.entries(tenGodsMap).sort((a, b) => b[0].length - a[0].length);

    // Colorize Ten Gods
    sortedEntries.forEach(([god, element]) => {
      const color = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS];
      const isEnglish = /^[A-Za-z]/.test(god);
      const regex = isEnglish ? new RegExp(`\\b${escapeRegex(god)}\\b`, 'g') : new RegExp(escapeRegex(god), 'g');
      colorized = colorized.replace(regex, (match) => `<span style="color: ${color}; font-weight: bold;">${match}</span>`);
    });

    // Restore '천재성'
    colorized = colorized.replace(new RegExp(placeholder, 'g'), '천재성');

    // Colorize Elements
    const elementNames = {
      '목(木)': 'Wood',
      '화(火)': 'Fire',
      '토(土)': 'Earth',
      '금(金)': 'Metal',
      '수(水)': 'Water',
      'Wood(木)': 'Wood',
      'Fire(火)': 'Fire',
      'Earth(土)': 'Earth',
      'Metal(金)': 'Metal',
      'Water(水)': 'Water',
      'Wood': 'Wood',
      'Fire': 'Fire',
      'Earth': 'Earth',
      'Metal': 'Metal',
      'Water': 'Water',
    };

    Object.entries(elementNames).forEach(([el, element]) => {
      const color = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS];
      const regex = new RegExp(`\\b(${escapeRegex(el)})\\b|(${escapeRegex(el)})`, 'g');
      colorized = colorized.replace(regex, (match) => `<span style="color: ${color}; font-weight: bold;">${match}</span>`);
    });

    return colorized;
  };

  const currentCycle = result.grandCycles[result.currentCycleIndex] || result.grandCycles[0];
  const dayMaster = result.pillars[1].stem;
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  const currentAnnualPillar = React.useMemo(() => {
    if (!currentCycle.annualPillars) return null;
    return currentCycle.annualPillars.find(ap => ap.year === currentYear) || currentCycle.annualPillars[0];
  }, [currentCycle, currentYear]);

  const tenGod = React.useMemo(() => {
    return calculateTenGods(dayMaster, currentCycle.element);
  }, [dayMaster, currentCycle.element]);

  const cycleVibe = React.useMemo(() => {
    if (!currentAnnualPillar) {
      return ((t.comments[currentCycle.element as keyof typeof t.comments] as any)?.[tenGod] || 
              (t.comments[currentCycle.element as keyof typeof t.comments] as any)?.BiGyean);
    }

    const daewoonGodEn = currentCycle.stemTenGodEn || '';
    const daewoonGodKo = currentCycle.stemTenGodKo || '';
    const sewoonGodEn = currentAnnualPillar.stemTenGodEn || '';
    const sewoonGodKo = currentAnnualPillar.stemTenGodKo || '';

    const d = `${daewoonGodEn} ${daewoonGodKo}`;
    const s = `${sewoonGodEn} ${sewoonGodKo}`;

    // Check for specific interactions between Daewoon and Sewoon
    const interactions = [
      {
        // 상관패인: 상관(Rebel) + 인성(Sage/Mystic)
        condition: (d: string, s: string) => 
          ((d.includes('Rebel') || d.includes('상관')) && (s.includes('Sage') || s.includes('Mystic') || s.includes('정인') || s.includes('편인'))) || 
          ((s.includes('Rebel') || s.includes('상관')) && (d.includes('Sage') || d.includes('Mystic') || d.includes('정인') || d.includes('편인'))),
        key: 'SangGwanPaeIn'
      },
      {
        // 재극인: 재성(Maverick/Architect) + 인성(Sage/Mystic)
        condition: (d: string, s: string) => 
          ((d.includes('Maverick') || d.includes('Architect') || d.includes('편재') || d.includes('정재')) && (s.includes('Sage') || s.includes('Mystic') || s.includes('정인') || s.includes('편인'))) || 
          ((s.includes('Maverick') || s.includes('Architect') || s.includes('편재') || s.includes('정재')) && (d.includes('Sage') || d.includes('Mystic') || d.includes('정인') || d.includes('편인'))),
        key: 'JaeGeukIn'
      },
      {
        // 식상생재: 식상(Artist/Rebel) + 재성(Maverick/Architect)
        condition: (d: string, s: string) => 
          ((d.includes('Artist') || d.includes('Rebel') || d.includes('식신') || d.includes('상관')) && (s.includes('Maverick') || s.includes('Architect') || s.includes('편재') || s.includes('정재'))) || 
          ((s.includes('Artist') || s.includes('Rebel') || s.includes('식신') || s.includes('상관')) && (d.includes('Maverick') || d.includes('Architect') || d.includes('편재') || d.includes('정재'))),
        key: 'SikSangSaengJae'
      },
      {
        // 관인상생: 관성(Warrior/Judge) + 인성(Sage/Mystic)
        condition: (d: string, s: string) => 
          ((d.includes('Warrior') || d.includes('Judge') || d.includes('편관') || d.includes('정관')) && (s.includes('Sage') || s.includes('Mystic') || s.includes('정인') || s.includes('편인'))) || 
          ((s.includes('Warrior') || s.includes('Judge') || s.includes('편관') || s.includes('정관')) && (d.includes('Sage') || d.includes('Mystic') || d.includes('정인') || d.includes('편인'))),
        key: 'GwanInSangSaeng'
      },
      {
        // 식신제살: 식신(Artist) + 편관(Warrior)
        condition: (d: string, s: string) => 
          ((d.includes('Artist') || d.includes('식신')) && (s.includes('Warrior') || s.includes('편관'))) || 
          ((s.includes('Artist') || s.includes('식신')) && (d.includes('Warrior') || d.includes('편관'))),
        key: 'SikSinJeSal'
      },
      {
        // 살인상생: 편관(Warrior) + 인성(Sage/Mystic)
        condition: (d: string, s: string) => 
          ((d.includes('Warrior') || d.includes('편관')) && (s.includes('Sage') || s.includes('Mystic') || s.includes('정인') || s.includes('편인'))) || 
          ((s.includes('Warrior') || s.includes('편관')) && (d.includes('Sage') || d.includes('Mystic') || d.includes('정인') || d.includes('편인'))),
        key: 'SalInSangSaeng'
      }
    ];

    for (const inter of interactions) {
      if (inter.condition(d, s)) {
        const msg = (TRANSLATIONS.INTERACTION_MESSAGES as any)[lang][inter.key];
        if (msg) {
          if (lang === 'KO') {
            return `있잖아, 지금 네 대운의 '${daewoonGodKo}'이랑 올해 세운의 '${sewoonGodKo}'이 만났어. 그래서 ${currentAnnualPillar.year}년인 올해 너는 '${msg.title}'의 효과를 제대로 받고 있는 중이야. ${msg.detail}`;
          }
          return `Hey, your Major Cycle's '${daewoonGodEn}' met this year's '${sewoonGodEn}'. So in ${currentAnnualPillar.year}, you're feeling the effects of '${msg.title}'. ${msg.detail}`;
        }
      }
    }

    return ((t.comments[currentCycle.element as keyof typeof t.comments] as any)?.[tenGod] || 
            (t.comments[currentCycle.element as keyof typeof t.comments] as any)?.BiGyean);
  }, [currentCycle, currentAnnualPillar, tenGod, lang]);

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
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 py-4 sm:py-12 space-y-8 sm:space-y-12">
      <div className="text-center">
        {renderTitle()}
      </div>

      {/* Character Commentary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="goth-glass p-6 rounded-2xl border-l-4 border-neon-pink flex flex-col gap-4"
      >
        <div className="flex items-start gap-4">
          <div className="bg-neon-pink/20 p-3 rounded-full shrink-0">
            <MessageSquare className="w-6 h-6 text-neon-pink" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-[11px] font-display font-medium text-white/50 uppercase tracking-[0.2em]">{t.seasonVibe}</div>
                <div className="text-[10px] text-white/30 italic">{t.seasonVibeDisclaimer}</div>
              </div>
              <button 
                onClick={() => setIsCycleVibeExpanded(!isCycleVibeExpanded)}
                className="text-[10px] font-bold text-neon-pink/60 hover:text-neon-pink transition-colors flex items-center gap-1 uppercase tracking-widest"
              >
                {isCycleVibeExpanded ? (lang === 'KO' ? '접기' : 'COLLAPSE') : (lang === 'KO' ? '펼치기' : 'EXPAND')}
                {isCycleVibeExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            
            <div className="relative">
              {!isCycleVibeExpanded ? (
                <p className="text-sm font-display italic text-white/60 leading-relaxed cursor-pointer hover:text-white/80 transition-colors" onClick={() => setIsCycleVibeExpanded(true)}>
                  {lang === 'KO' 
                    ? `요번 ${new Date().getFullYear()}년도의 너의 행운은 어떨 것 같아? 시험 해 볼까?` 
                    : `What do you think your luck for ${new Date().getFullYear()} will be? Shall we test it?`}
                </p>
              ) : (
                <p className="text-lg font-display italic text-white leading-relaxed">
                  <TypingText key={lang + cycleVibe} text={cycleVibe} />
                </p>
              )}
            </div>
          </div>
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
      <div className="space-y-4">
        <div className="flex justify-end gap-2">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHanja(!showHanja)} 
            className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors text-white/70"
          >
            {showHanja ? (lang === 'KO' ? '한자 숨기기' : 'Hide Hanja') : (lang === 'KO' ? '한자 보기' : 'Show Hanja')}
          </motion.button>
        </div>
        <div className="grid grid-cols-4 gap-0.5 sm:gap-2 md:gap-4 items-stretch">
          {result.pillars.map((pillar, i) => {
            const lifeStage = BAZI_MAPPING.lifeStages[dayMaster as keyof typeof BAZI_MAPPING.lifeStages]?.[pillar.branch as keyof typeof BAZI_MAPPING.lifeStages[keyof typeof BAZI_MAPPING.lifeStages]];
            const branchData = BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches];
            const hiddenStems = branchData?.hiddenStems || [];
            const isDayPillar = pillar.title === 'Day';
            const pillarName = lang === 'KO' ? 
              (pillar.title === 'Year' ? '연주' : pillar.title === 'Month' ? '월주' : pillar.title === 'Day' ? '일주' : '시주') : 
              (pillar.title === 'Hour' ? 'Time Pillar' : `${pillar.title} Pillar`);

            return (
              <div key={`pillar-${i}`} className="flex flex-col gap-1 sm:gap-2 h-full">
                <div className={`text-[9px] sm:text-xs font-bold text-center mb-1 uppercase tracking-widest ${isDayPillar ? 'text-neon-cyan' : 'text-white/40'}`}>
                  {pillarName}
                </div>
                {/* Stem Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-full min-w-0 goth-glass rounded-lg sm:rounded-xl border-t-2 flex flex-col overflow-hidden flex-1 ${isDayPillar ? 'ring-1 ring-neon-cyan/30 bg-neon-cyan/5' : ''}`}
                  style={{ borderColor: ELEMENT_COLORS[pillar.element as keyof typeof ELEMENT_COLORS] || '#FF007A' }}
                >
                  <div className="w-full p-1.5 sm:p-3 md:p-4 flex flex-col text-center flex-grow relative">
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-40 z-10">
                      <PolarityIcon polarity={pillar.stemPolarity} size={8} />
                    </div>
                    <div className="flex-1 flex items-start justify-center">
                      <div className="text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-tighter sm:tracking-[0.2em] text-white/40 uppercase">
                        {lang === 'KO' ? 
                          (pillar.title === 'Year' ? '연간' : pillar.title === 'Month' ? '월간' : pillar.title === 'Day' ? '일간' : '시간') : 
                          (pillar.title === 'Hour' ? 'Time Stem' : `${pillar.title} Stem`)}
                      </div>
                    </div>
                    <div className="w-full text-base sm:text-xl md:text-3xl font-gothic text-white leading-tight flex flex-col items-center justify-center shrink-0 py-1 sm:py-2">
                      {lang === 'KO' ? 
                        (showHanja ? `${pillar.stem}(${BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.ko || pillar.stem})` : `${BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.ko || pillar.stem}`) : 
                        (showHanja ? (
                          <div className="flex flex-col items-center">
                            <span>{pillar.stem}</span>
                            <span className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap tracking-tighter text-white/80">{BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.en || pillar.stem}</span>
                          </div>
                        ) : (
                          <span className="text-sm sm:text-base md:text-xl whitespace-nowrap tracking-tighter">{BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.en || pillar.stem}</span>
                        ))}
                    </div>
                    <div className="flex-1 flex items-end justify-center">
                      <div className="text-[8px] sm:text-[10px] opacity-0 pointer-events-none font-bold select-none" aria-hidden="true">
                        {lang === 'KO' ? '장생' : 'Growth'}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 border-t border-white/10 py-2 sm:py-3 px-0.5 min-h-[1.6rem] sm:min-h-[2.4rem] flex items-center justify-center shrink-0">
                    <span 
                      className="text-[8px] sm:text-[10px] md:text-[11px] font-display font-bold uppercase leading-tight"
                      style={{ color: getTenGodColor(lang === 'KO' ? pillar.stemKoreanName : pillar.stemEnglishName) }}
                    >
                      {lang === 'KO' ? pillar.stemKoreanName : formatName(pillar.stemEnglishName)}
                    </span>
                  </div>
                </motion.div>

                {/* Branch Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (i + 4) * 0.05 }}
                  className={`w-full min-w-0 goth-glass rounded-lg sm:rounded-xl border-t-2 flex flex-col overflow-hidden flex-1 ${isDayPillar ? 'ring-1 ring-neon-cyan/10' : ''}`}
                  style={{ borderColor: ELEMENT_COLORS[branchData?.element as keyof typeof ELEMENT_COLORS] || '#FF007A' }}
                >
                  <div className="w-full p-1.5 sm:p-3 md:p-4 flex flex-col text-center flex-grow relative">
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-40 z-10">
                      <PolarityIcon polarity={pillar.branchPolarity} size={8} />
                    </div>
                    <div className="flex-1 flex items-start justify-center">
                      <div className="text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-tighter sm:tracking-[0.2em] text-white/40 uppercase">
                        {lang === 'KO' ? 
                          (pillar.title === 'Year' ? '연지' : pillar.title === 'Month' ? '월지' : pillar.title === 'Day' ? '일지' : '시지') : 
                          (pillar.title === 'Hour' ? 'Time Branch' : `${pillar.title} Branch`)}
                      </div>
                    </div>
                    <div className="w-full text-base sm:text-xl md:text-3xl font-gothic text-white/60 leading-tight flex flex-col items-center justify-center shrink-0 py-1 sm:py-2">
                      {lang === 'KO' ? 
                        (showHanja ? `${pillar.branch}(${branchData?.ko || pillar.branch})` : `${branchData?.ko || pillar.branch}`) : 
                        (showHanja ? (
                          <div className="flex flex-col items-center">
                            <span>{pillar.branch}</span>
                            <span className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap tracking-tighter">{branchData?.en || pillar.branch}</span>
                          </div>
                        ) : (
                          <span className="text-sm sm:text-base md:text-xl whitespace-nowrap tracking-tighter">{branchData?.en || pillar.branch}</span>
                        ))}
                    </div>
                    <div className="flex-1 flex items-end justify-center">
                      <div className="text-[8px] sm:text-[10px] text-neon-cyan font-bold">
                        {lang === 'KO' ? lifeStage?.ko : lifeStage?.en}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 border-t border-white/10 py-2 sm:py-3 px-0.5 min-h-[1.6rem] sm:min-h-[2.4rem] flex items-center justify-center shrink-0">
                    <span 
                      className="text-[8px] sm:text-[10px] md:text-[11px] font-display font-bold uppercase leading-tight"
                      style={{ color: getTenGodColor(lang === 'KO' ? pillar.branchKoreanName : pillar.branchEnglishName) }}
                    >
                      {lang === 'KO' ? pillar.branchKoreanName : formatName(pillar.branchEnglishName)}
                    </span>
                  </div>
                </motion.div>

                {/* Hidden Stems (지장간) */}
                <div className="flex flex-col gap-0.5 sm:gap-1 mt-1">
                  <div className="text-[7px] sm:text-[9px] text-white/30 uppercase font-bold text-center">
                    {lang === 'KO' ? '지장간' : 'Hidden'}
                  </div>
                  <div className="flex flex-wrap justify-center gap-0.5 sm:gap-1">
                    {hiddenStems.map((hs, idx) => {
                      const hsData = BAZI_MAPPING.stems[hs as keyof typeof BAZI_MAPPING.stems];
                      const hsTenGod = getDetailedTenGod(dayMaster, hs);
                      return (
                        <div 
                          key={idx}
                          className="flex flex-col items-center p-0.5 sm:p-1 rounded bg-white/5 border border-white/10 min-w-[20px] sm:min-w-[28px]"
                        >
                          <div 
                            className="text-[9px] sm:text-xs font-gothic"
                            style={{ color: ELEMENT_COLORS[hsData?.element as keyof typeof ELEMENT_COLORS] }}
                          >
                            {showHanja ? hs : (lang === 'KO' ? hsData?.ko : hsData?.en.charAt(0))}
                          </div>
                          <div 
                            className="text-[6px] sm:text-[8px] font-bold tracking-tighter opacity-70"
                            style={{ color: getTenGodColor(hsTenGod.ko) }}
                          >
                            {lang === 'KO' ? hsTenGod.ko : hsTenGod.en.substring(0, 2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {/* Grand Cycle Timeline */}
      <div className="space-y-6">
        <h3 className="text-xs font-display font-bold tracking-[0.4em] text-white/60 uppercase text-center flex items-center justify-center gap-2">
          {t.grandCycle}
          <BaziTooltip content={{ ko: "대운(환경): 10년 동안 내가 처한 '무대'입니다. 기존의 틀을 깨고 새로운 아이디어를 내놓아야 하는 환경 혹은 내 재능을 세상에 드러내야 하는 10년입니다.\n세운(사건): 그 10년 중 올해 일어나는 '구체적인 사건'입니다. 깊이 있는 공부, 문서 계약, 혹은 예리한 통찰력을 발휘할 일이 생깁니다.", en: "Daewoon (Environment): The 'stage' you are in for 10 years. An environment where you need to break existing molds and propose new ideas, or a period to reveal your talents.\nSe-woon (Event): The 'specific event' that happens this year within those 10 years. Deep study, document contracts, or exercising sharp insight." }} lang={lang}>
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
                  const isCurrentYear = ap.year === currentYear;
                  
                  let borderClass = 'border-white/5';
                  if (isYearExpanded) borderClass = 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_10px_rgba(0,255,255,0.2)]';
                  else if (isCurrentYear) borderClass = 'border-neon-pink bg-neon-pink/5';

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
                        className={`w-16 bg-white/5 rounded-lg p-2 flex flex-col items-center border transition-all relative ${borderClass}`}
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
                          const isCurrentMonth = m.month === currentMonth && result.grandCycles[expandedCycle].annualPillars[expandedYear].year === currentYear;
                          
                          let borderClass = 'border-white/5';
                          if (isMonthExpanded) borderClass = 'border-neon-cyan bg-neon-cyan/5 shadow-[0_0_10px_rgba(0,255,255,0.2)]';
                          else if (isCurrentMonth) borderClass = 'border-neon-pink bg-neon-pink/5';

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
                                className={`w-full bg-white/5 rounded-lg p-3 flex flex-col items-center border transition-all min-h-[70px] justify-center relative ${borderClass}`}
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
                                  <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[d.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
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
                                  </motion.button>
                                  <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[d.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
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
                      <p className="text-sm font-display leading-relaxed text-white/90 italic" dangerouslySetInnerHTML={{ __html: `"${colorizeAdvancedAnalysis(getAnalysisText())}"` }} />
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
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-1 cursor-help" onClick={() => setShowGeJuInfo(true)}>
                              <span className="text-white/60 text-xs shrink-0 pt-0.5">{lang === 'KO' ? '격국 (Structure)' : 'Structure'}</span>
                              <HelpCircle className="w-3 h-3 text-neon-cyan/60" />
                            </div>
                            <div className="text-right">
                              <span className="text-white font-bold block">
                                {result.analysis.structureDetail 
                                  ? (lang === 'KO' ? result.analysis.structureDetail.title : result.analysis.structureDetail.enTitle)
                                  : (lang === 'KO' ? result.analysis.geJu : (BAZI_MAPPING.geju[result.analysis.geJu as keyof typeof BAZI_MAPPING.geju]?.en || result.analysis.geJu))
                                }
                              </span>
                              {result.analysis.structureDetail && (
                                <span className="text-[10px] text-neon-pink/70 font-medium uppercase tracking-wider">
                                  {result.analysis.structureDetail.category === 'Standard' ? (lang === 'KO' ? '내격' : 'Standard') : (lang === 'KO' ? '종격/전왕격' : 'Special')}
                                </span>
                              )}
                            </div>
                          </div>
                          {result.analysis.structureDetail && (
                            <div className="mt-1 p-2 bg-white/5 rounded border border-white/10 text-[10px] leading-relaxed text-white/60 italic">
                              {result.analysis.structureDetail.logicNote}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex items-center gap-1 cursor-help" onClick={() => setShowStrengthInfo(true)}>
                            <span className="text-white/60 text-xs shrink-0 pt-0.5">{lang === 'KO' ? '일간 강약 (DM Strength)' : 'DM Strength'}</span>
                            <HelpCircle className="w-3 h-3 text-neon-cyan/60" />
                          </div>
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
                        {result.analysis.yongshinDetail.eokbu && (
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
                        <div className="pt-4 border-t border-white/5 space-y-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-[1px] w-4 bg-purple-400/50"></div>
                              <div className="text-[10px] font-display font-medium text-purple-400/80 uppercase tracking-[0.2em]">
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
                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] text-white/40 uppercase">{lang === 'KO' ? '희신' : 'HeeShin'}</span>
                              {renderYongshinWithElement(result.analysis.yongshinDetail.heeShin.god)}
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] text-white/40 uppercase">{lang === 'KO' ? '기신' : 'GiShin'}</span>
                              {result.analysis.yongshinDetail.giShin.god ? (
                                renderYongshinWithElement(result.analysis.yongshinDetail.giShin.god)
                              ) : (
                                <div className="text-[10px] text-white/60 italic mt-1 text-center">
                                  {lang === 'KO' ? '해당 국격은 기신이 없습니다.' : 'No GiShin for this structure.'}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[9px] text-white/40 uppercase">{lang === 'KO' ? '구신' : 'GuShin'}</span>
                              {renderYongshinWithElement(result.analysis.yongshinDetail.guShin.god)}
                            </div>
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
                                    const map: any = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)' };
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
                                    className="flex flex-col p-2 bg-white/5 rounded border border-white/10 min-w-[80px] cursor-pointer hover:bg-white/10 transition-colors"
                                  >
                                    <span className="text-[10px] text-white/40 uppercase tracking-tighter">{getInteractionName(interaction.type)}</span>
                                    <span className="text-[9px] text-neon-cyan/60">
                                      {interaction.branches?.join('-') || interaction.stems?.join('-')}
                                    </span>
                                  </div>
                                </BaziTooltip>
                              );
                            })}
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
                              {result.analysis.conflicts.map((c, i) => {
                                let displayNote = c.note || '';
                                if (displayNote.includes('|')) {
                                  const [koNote, enNote] = displayNote.split('|');
                                  displayNote = lang === 'KO' ? koNote : enNote;
                                }
                                return (
                                  <div key={i} className="text-[11px] text-red-400/80 italic">• {displayNote}</div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-[1px] w-8 bg-green-400/50"></div>
                        <h4 className="text-sm font-display font-medium text-green-400 uppercase tracking-[0.2em]">{lang === 'KO' ? '십성 및 관계 분석' : 'Ten Gods & Relationships'}</h4>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-green-400/20 to-transparent"></div>
                      </div>
                      
                      <div className="space-y-6">
                        {/* Ten Gods Ratios */}
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

                        {/* Relationship Analysis */}
                        {result.analysis.relationshipAnalysis && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(result.analysis.relationshipAnalysis).map(([key, data]: [string, any]) => (
                              <div key={key} className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2 hover:border-neon-cyan/30 transition-all group">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan group-hover:animate-pulse" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{data.title}</span>
                                  </div>
                                  {data.ratio !== undefined && (
                                    <span className="text-[10px] font-mono text-white/40">{data.ratio}%</span>
                                  )}
                                </div>
                                <p 
                                  className="text-[11px] leading-relaxed text-white/60"
                                  dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(data.description) }}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Absence / Excess Summary */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{lang === 'KO' ? '무자/다자 분석' : 'Absence / Excess Analysis'}</span>
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
                                className="px-3 py-1.5 bg-red-900/10 border border-red-500/20 rounded-lg flex items-center gap-2 hover:border-red-500/50 transition-all group text-left"
                              >
                                <span className="w-1 h-1 rounded-full bg-red-500 group-hover:animate-pulse" />
                                <span className="text-[10px] text-red-400 font-bold tracking-tight">{item.title}</span>
                              </button>
                            ))}
                            {result.analysis.daJaRon?.map((item: any, i: number) => (
                              <button 
                                key={i} 
                                onClick={() => setShowMuJaDaJaInfo(item)}
                                className="px-3 py-1.5 bg-purple-900/10 border border-purple-500/20 rounded-lg flex items-center gap-2 hover:border-purple-500/50 transition-all group text-left"
                              >
                                <span className="w-1 h-1 rounded-full bg-purple-500 group-hover:animate-pulse" />
                                <span className="text-[10px] text-purple-400 font-bold tracking-tight">{item.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
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
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4">
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
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowTongGwanInfo(false)} 
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
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
                <p 
                  className="text-xs leading-relaxed text-white/70"
                  dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(result.analysis.shinGangShinYak.summary) }}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">{lang === 'KO' ? '나의 상태' : 'My Status'}</p>
                  <p 
                    className="text-xs leading-relaxed text-white/70"
                    dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(result.analysis.shinGangShinYak.description) }}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">{lang === 'KO' ? '사회적 발현' : 'Social Manifestation'}</p>
                  <p 
                    className="text-xs leading-relaxed text-white/70"
                    dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(result.analysis.shinGangShinYak.socialContext) }}
                  />
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
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${showMuJaDaJaInfo.title.includes('무') ? 'bg-red-500/20' : 'bg-purple-500/20'}`}>
                  <Zap className={`w-6 h-6 ${showMuJaDaJaInfo.title.includes('무') ? 'text-red-400' : 'text-purple-400'}`} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-white">{showMuJaDaJaInfo.title}</h3>
                  <p className="text-xs text-white/40 tracking-widest uppercase">{lang === 'KO' ? '상세 분석' : 'Detailed Analysis'}</p>
                </div>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                <p 
                  className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(lang === 'KO' ? showMuJaDaJaInfo.description : (showMuJaDaJaInfo.enDescription || showMuJaDaJaInfo.description)) }}
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-[10px] text-white/40 text-center italic">
                  {lang === 'KO' ? '*이 해석은 사주의 전체적인 흐름과 조화를 고려한 맞춤형 분석입니다.' : '*This interpretation is a customized analysis considering the overall flow and harmony of the chart.'}
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
                      ? '사주에 특정 십성이 아예 없는 경우를 말합니다. 이는 단순히 해당 에너지가 결핍된 것이 아니라, 오히려 그 에너지를 "한계 없이" 쓰거나, 혹은 그 에너지에 대한 집착이 강할 수 있음을 의미합니다. 없는 글자가 당신의 가장 큰 무기가 될 수 있습니다.'
                      : 'Refers to the complete absence of a specific Ten God. This doesn\'t just mean a lack; it means you can use that energy "without limits" or may have a strong obsession with it. The missing element can become your greatest weapon.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-purple-400">{lang === 'KO' ? '2. 다자론 (多者論): 과유불급의 원리' : '2. Excess Theory: The Principle of Excess'}</p>
                  <p className="text-xs leading-relaxed text-white/70">
                    {lang === 'KO'
                      ? '특정 십성이 3개 이상(비율 30% 초과)인 경우입니다. 해당 에너지가 과다하여 삶의 균형이 깨지기 쉽고, 그 십성이 상징하는 육친이나 사회적 관계에서 스트레스를 받을 수 있음을 의미합니다. 넘치는 에너지를 어떻게 조절하느냐가 핵심입니다.'
                      : 'Refers to having 3 or more of a specific Ten God (over 30%). Excessive energy can easily disrupt life balance and cause stress in related social or familial relationships. The key is how to regulate this overflowing energy.'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-neon-pink">{lang === 'KO' ? '3. 무비겁 (無比劫): 독자적인 개척자' : '3. No Bi-Geop: Independent Pioneer'}</p>
                  <p className="text-xs leading-relaxed text-white/70">
                    {lang === 'KO'
                      ? '비견과 겁재가 없는 경우입니다. 타인의 시선에 민감하지 않고 독자적인 길을 가지만, 때로는 고립감을 느끼거나 경쟁 상황에서 쉽게 물러날 수 있습니다. 자신만의 뚝심을 기르는 것이 중요합니다.'
                      : 'Refers to the absence of Bi-Gyean and Geob-Jae. You walk your own path without being sensitive to others\' views, but may sometimes feel isolated or retreat easily in competitive situations. Cultivating your own inner strength is vital.'}
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                  <p className="text-xs font-bold text-neon-cyan" dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(
                    lang === 'KO' 
                      ? `${BAZI_MAPPING.elements[result.analysis.dayMasterElement as keyof typeof BAZI_MAPPING.elements]?.ko || result.analysis.dayMasterElement}(${BAZI_MAPPING.elements[result.analysis.dayMasterElement as keyof typeof BAZI_MAPPING.elements]?.hanja || ''}) 일간의 십성별 본질` 
                      : `Essence of Ten Gods for ${result.analysis.dayMasterElement}(${BAZI_MAPPING.elements[result.analysis.dayMasterElement as keyof typeof BAZI_MAPPING.elements]?.hanja || ''}) DM`
                  ) }} />
                  <ul className="space-y-2 text-[10px] text-white/60 list-disc pl-4">
                    {result.analysis.personalizedInsights && Object.entries(result.analysis.personalizedInsights).map(([key, value]: [string, any]) => (
                      <li key={key}>
                        <span className="text-white/80 font-bold" dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(lang === 'KO' ? value.ko : value.en) }} />
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
                    ? '사주의 균형을 잡아주는 핵심 에너지인 용신(用神)을 기준으로, 나에게 도움이 되는 기운과 방해가 되는 기운을 분류한 것입니다.' 
                    : 'Based on the Yongshin (Useful God) which balances your chart, these represent the energies that either support or hinder you.'}
                </p>
                
                <div className="space-y-3">
                  <div className="bg-white/5 p-3 rounded-lg border border-green-400/30">
                    <h4 className="font-bold text-green-400 mb-1">{lang === 'KO' ? '희신 (喜神 - 기쁠 희, 귀신 신)' : 'HeeShin (喜神 - Joyful God)'}</h4>
                    <p className="text-xs text-white/70 mb-2">
                      {lang === 'KO' ? '용신을 도와주는 긍정적인 에너지입니다. 용신이 힘을 잃지 않도록 보좌하는 역할을 합니다.' : 'Positive energy that supports the Yongshin. It assists the Useful God so it doesn\'t lose power.'}
                    </p>
                    <div className="text-xs bg-black/40 p-2 rounded text-green-400/90 flex items-center gap-2">
                      <span className="font-bold">{lang === 'KO' ? '나의 희신:' : 'Your HeeShin:'}</span>
                      {renderYongshinWithElement(result.analysis.yongshinDetail.heeShin.god, true)}
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-red-400/30">
                    <h4 className="font-bold text-red-400 mb-1">{lang === 'KO' ? '기신 (忌神 - 꺼릴 기, 귀신 신)' : 'GiShin (忌神 - Taboo God)'}</h4>
                    <p className="text-xs text-white/70 mb-2">
                      {lang === 'KO' ? '용신을 극(沖/剋)하여 방해하는 부정적인 에너지입니다. 이 기운이 강해지면 삶의 균형이 깨지기 쉽습니다.' : 'Negative energy that attacks or hinders the Yongshin. When this energy is strong, life\'s balance can easily be disrupted.'}
                    </p>
                    <div className="text-xs bg-black/40 p-2 rounded text-red-400/90 flex items-center gap-2">
                      <span className="font-bold">{lang === 'KO' ? '나의 기신:' : 'Your GiShin:'}</span>
                      {renderYongshinWithElement(result.analysis.yongshinDetail.giShin.god, true)}
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-lg border border-orange-400/30">
                    <h4 className="font-bold text-orange-400 mb-1">{lang === 'KO' ? '구신 (仇神 - 원수 구, 귀신 신)' : 'GuShin (仇神 - Enemy God)'}</h4>
                    <p className="text-xs text-white/70 mb-2">
                      {lang === 'KO' ? '희신을 극하여 방해하거나, 기신을 도와주는 에너지입니다. 기신 다음으로 주의해야 할 기운입니다.' : 'Energy that attacks the HeeShin or supports the GiShin. It is the second most cautious energy after GiShin.'}
                    </p>
                    <div className="text-xs bg-black/40 p-2 rounded text-orange-400/90 flex items-center gap-2">
                      <span className="font-bold">{lang === 'KO' ? '나의 구신:' : 'Your GuShin:'}</span>
                      {renderYongshinWithElement(result.analysis.yongshinDetail.guShin.god, true)}
                    </div>
                  </div>
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
              className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
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
                    <p>{lang === 'KO' ? '상세 설명이 준비 중입니다.' : 'Detailed explanation is being prepared.'}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Soul Summary Report Card */}
      <SoulSummaryCard result={result} lang={lang} />

      <div className="flex justify-center pt-12 pb-20">
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-12 py-4 border border-neon-pink text-neon-pink text-sm font-bold tracking-[0.3em] hover:bg-neon-pink hover:text-white transition-all rounded-full"
        >
          {t.back}
        </motion.button>
      </div>
    </div>
  );
}

const SoulSummaryCard = ({ result, lang }: { result: BaZiResult, lang: Language }) => {
  const summary = React.useMemo(() => generateSoulSummary(result, lang), [result, lang]);
  const dayPillar = result.pillars.find(p => p.title === 'Day');
  const isMuO = dayPillar?.stem === '戊' && dayPillar?.branch === '午';
  const isMuIn = dayPillar?.stem === '戊' && dayPillar?.branch === '寅';
  const [isImageViewMode, setIsImageViewMode] = React.useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 p-1 bg-gradient-to-br from-neon-pink/20 via-neon-cyan/20 to-neon-purple/20 rounded-[2rem] shadow-[0_0_30px_rgba(255,0,122,0.15)]"
    >
      <div className="bg-[#050505] rounded-[1.9rem] p-6 sm:p-10 border border-white/10 relative overflow-hidden min-h-[600px] flex flex-col justify-center">
        {(isMuO || isMuIn) && (
          <button 
            onClick={() => setIsImageViewMode(!isImageViewMode)}
            className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-bold text-white/80 hover:text-white hover:bg-black/80 transition-all flex items-center gap-2"
          >
            {isImageViewMode ? (lang === 'KO' ? '이미지 닫기' : 'Close Image') : (lang === 'KO' ? '이미지 보기' : 'View Image')}
          </button>
        )}

        {isMuO && (
          <img 
            src="https://i.imgur.com/6Kqibqt.jpeg"
            alt="Mu-o Background"
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ease-in-out ${isImageViewMode ? 'opacity-100' : 'opacity-40'}`}
          />
        )}
        {isMuIn && (
          <img 
            src="https://i.imgur.com/msGP3dO.jpeg"
            alt="Mu-in Background"
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ease-in-out ${isImageViewMode ? 'opacity-100' : 'opacity-40'}`}
          />
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
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center text-center space-y-6 w-full"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-black/30 backdrop-blur-[8px] border border-white/10 text-[10px] font-display font-bold tracking-[0.3em] text-white/40 uppercase shadow-lg">
                Soul Summary Report
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
                  <p className="text-xl sm:text-2xl text-neon-cyan font-bold">
                    {summary.coreEnergy.element}
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
              className="w-full py-4 bg-black/40 backdrop-blur-md border border-dashed border-white/20 rounded-2xl text-white/30 text-sm font-display tracking-widest uppercase cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
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
