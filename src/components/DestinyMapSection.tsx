import { calculateRelationshipDynamics } from '../services/relationship-dynamics-service';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { BaZiResult, Language, UserInput } from '../types';
import { ELEMENT_COLORS } from '../constants';
import { STEM_ELEMENTS, BRANCH_ELEMENTS } from '../services/bazi-engine';
import { calculateRealBaZi } from '../services/bazi-service';
import { generateRelationshipDynamics, generateIndividualTimelineBriefing } from '../services/timeline-briefing-service';
import { CheckCircle2, Heart, Sparkles, Swords, X, Calendar, Activity, Repeat, Globe } from 'lucide-react';

interface DestinyMapSectionProps {
  result: BaZiResult;
  lang: Language;
  parsedJson: any; 
}

const KARMA_QUESTS = {
  Wood: {
    ko: ['의식적으로 깊게 심호흡하기', '초록색 샐러드나 채소 챙겨 먹기', '스마트폰 끄고 숲길 산책하기'],
    en: ['Take deep, conscious breaths', 'Eat a green salad or vegetables', 'Walk in nature without your smartphone']
  },
  Fire: {
    ko: ['낮에 햇볕 쬐며 10분 걷기', '따뜻한 차나 커피 한 잔 마시기', '살짝 땀나는 운동하기'],
    en: ['Walk in the sun for 10 minutes', 'Drink a warm tea or coffee', 'Do light exercise to sweat']
  },
  Earth: {
    ko: ['천천히 오랫동안 씹어서 식사하기', '맨발로 흙 밟거나 화분 흙 만지기', '명상하며 기운 중심 잡기'],
    en: ['Chew your food slowly and mindfully', 'Touch soil or walk barefoot', 'Meditate to ground yourself']
  },
  Metal: {
    ko: ['지갑이나 책상 위 물건 정리하기', '미루던 일 하나 당장 끝내기', '하얀색이나 금속 액세서리 착용'],
    en: ['Organize your desk or wallet', 'Finish one procrastinated task', 'Wear white or metallic accessories']
  },
  Water: {
    ko: ['따뜻한 물로 샤워 길게 하기', '충분한 수분 섭취하기', '일기 쓰며 감정 흘려보내기'],
    en: ['Take a long warm shower', 'Drink plenty of water', 'Journal to release emotions']
  }
};

const ELEMENT_KOR: Record<string, string> = { "Wood": "목(木)", "Fire": "화(火)", "Earth": "토(土)", "Metal": "금(金)", "Water": "수(水)" };

export const DestinyMapSection: React.FC<DestinyMapSectionProps> = ({ result, lang, parsedJson }) => {

  const pinyinStem: Record<string, string> = { '甲':'Jia', '乙':'Yi', '丙':'Bing', '丁':'Ding', '戊':'Wu', '己':'Ji', '庚':'Geng', '辛':'Xin', '壬':'Ren', '癸':'Gui' };
  const pinyinBranch: Record<string, string> = { '子':'Zi', '丑':'Chou', '寅':'Yin', '卯':'Mao', '辰':'Chen', '巳':'Si', '午':'Wu', '未':'Wei', '申':'Shen', '酉':'You', '戌':'Xu', '亥':'Hai' };

  const getPinyin = (s: string, b: string) => {
      return (pinyinStem[s] || s) + '-' + (pinyinBranch[b] || b);
  };
  const currentIndex = result.currentCycleIndex;
  const minSlider = Math.max(0, currentIndex - 1);
  const maxSlider = Math.min(result.grandCycles.length - 1, currentIndex + 1);
  
  const [sliderIndex, setSliderIndex] = useState(currentIndex);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partnerResult, setPartnerResult] = useState<BaZiResult | null>(null);
  
  const [showTimelineDocs, setShowTimelineDocs] = useState(true);
  const [showDynamicsBrief, setShowDynamicsBrief] = useState(true);
  const [showScannerResult, setShowScannerResult] = useState(true);
  const [showFullRelationGates, setShowFullRelationGates] = useState(false);
  const [showFullRelationText, setShowFullRelationText] = useState(false);
  
  const [questCompleted, setQuestCompleted] = useState(false);
  const [questSeed, setQuestSeed] = useState(0);

  useEffect(() => { setQuestSeed(Math.floor(Math.random() * 3)); }, []);

  const currentDaewun = result.grandCycles[sliderIndex];
  const stemEl = STEM_ELEMENTS[currentDaewun.stem] || 'Wood';
  const branchEl = BRANCH_ELEMENTS[currentDaewun.branch] || 'Wood';
  
  // Theme color based on Daewun Branch
  const daewunThemeColor = ELEMENT_COLORS[branchEl as keyof typeof ELEMENT_COLORS] || '#00ffff';

  const adjustedElements = useMemo(() => {
    const rawRatios = result.analysis?.elementRatios || {};
    const adjusted: Record<string, number> = {};
    
    ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].forEach(el => {
      const key = Object.keys(rawRatios).find(k => k.includes(el) || k.includes(ELEMENT_KOR[el as keyof typeof ELEMENT_KOR]));
      const natalRatio = key ? rawRatios[key] as number : 0;
      
      let daewunAdd = 0;
      if (stemEl === el) daewunAdd += 15;
      if (branchEl === el) daewunAdd += 45;
      
      adjusted[el] = natalRatio + daewunAdd;
    });
    
    // Normalize to 100%
    const total = Object.values(adjusted).reduce((a, b) => a + b, 0) || 1;
    Object.keys(adjusted).forEach(k => {
        adjusted[k] = Math.round((adjusted[k] / total) * 100);
    });
    
    return adjusted;
  }, [result.analysis?.elementRatios, stemEl, branchEl]);

  const partnerMatchDaewun = useMemo(() => {
    if (!partnerResult) return null;
    const targetYear = currentDaewun.year;
    return partnerResult.grandCycles.find(c => targetYear >= c.year && targetYear < c.year + 10) || partnerResult.grandCycles[partnerResult.currentCycleIndex];
  }, [partnerResult, currentDaewun.year]);

  const partnerAdjustedElements = useMemo(() => {
    if (!partnerResult || !partnerMatchDaewun) return null;
    
    const rawRatios = partnerResult.analysis?.elementRatios || {};
    const pStemEl = STEM_ELEMENTS[partnerMatchDaewun.stem as keyof typeof STEM_ELEMENTS];
    const pBranchEl = BRANCH_ELEMENTS[partnerMatchDaewun.branch as keyof typeof BRANCH_ELEMENTS];
    
    const adjusted: Record<string, number> = {};
    ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].forEach(el => {
      const key = Object.keys(rawRatios).find(k => k.includes(el) || k.includes(ELEMENT_KOR[el as keyof typeof ELEMENT_KOR]));
      const natalRatio = key ? rawRatios[key] as number : 0;
      
      let daewunAdd = 0;
      if (pStemEl === el) daewunAdd += 15;
      if (pBranchEl === el) daewunAdd += 45;
      
      adjusted[el] = natalRatio + daewunAdd;
    });

    const total = Object.values(adjusted).reduce((a, b) => a + b, 0) || 1;
    Object.keys(adjusted).forEach(k => {
        adjusted[k] = Math.round((adjusted[k] / total) * 100);
    });

    return adjusted;
  }, [partnerResult, partnerMatchDaewun]);

  const weakestElement = useMemo(() => {
    let min = Infinity;
    let weakest = 'Wood';
    Object.entries(adjustedElements).forEach(([el, val]) => {
      if (val < min) { min = val; weakest = el; }
    });
    return weakest as keyof typeof KARMA_QUESTS;
  }, [adjustedElements]);

  const partnerAnalysisMemo = useMemo(() => {
    if (!partnerResult) return null;

    const dyn = calculateRelationshipDynamics(
        result, 
        partnerResult, 
        adjustedElements, 
        partnerAdjustedElements || {}, 
        lang as 'KO' | 'EN',
        currentDaewun?.branch,
        partnerMatchDaewun?.branch
    );

    const innateDyn = calculateRelationshipDynamics(
        result,
        partnerResult,
        result.analysis?.elementRatios || {},
        partnerResult.analysis?.elementRatios || {},
        lang as 'KO' | 'EN'
    );

    const getNextRatios = (res: any) => {
        const rawRatios = res.analysis?.elementRatios || {};
        const cycle = res.grandCycles?.[(res.currentCycleIndex || 0) + 1];
        if (!cycle) return rawRatios;
        const stemMap: Record<string, string> = { '甲':'Wood', '乙':'Wood', '丙':'Fire', '丁':'Fire', '戊':'Earth', '己':'Earth', '庚':'Metal', '辛':'Metal', '壬':'Water', '癸':'Water' };
        const branchMap: Record<string, string> = { '子':'Water', '丑':'Earth', '寅':'Wood', '卯':'Wood', '辰':'Earth', '巳':'Fire', '午':'Fire', '未':'Earth', '申':'Metal', '酉':'Metal', '戌':'Earth', '亥':'Water' };
        
        const adjusted: Record<string, number> = {};
        const cleanEl = (k: string) => {
            let clean = k.split('(')[0].trim();
            if (clean === '목') return 'Wood';
            if (clean === '화') return 'Fire';
            if (clean === '토') return 'Earth';
            if (clean === '금') return 'Metal';
            if (clean === '수') return 'Water';
            return clean;
        };
        Object.entries(rawRatios).forEach(([k, v]) => {
            const el = cleanEl(k);
            adjusted[el] = (adjusted[el] || 0) + (v as number);
        });
        const sEl = stemMap[cycle.stem] || 'Earth';
        const bEl = branchMap[cycle.branch] || 'Earth';
        adjusted[sEl] = (adjusted[sEl] || 0) + 15;
        adjusted[bEl] = (adjusted[bEl] || 0) + 45;
        const total = Object.values(adjusted).reduce((a, b: any) => a + b, 0) || 1;
        Object.keys(adjusted).forEach(k => { adjusted[k] = Math.round((adjusted[k] / total) * 100); });
        return adjusted;
    };

    const futureRatios = getNextRatios(result);
    const pFutureRatios = getNextRatios(partnerResult);
    const uNextBranch = result.grandCycles?.[(result.currentCycleIndex || 0) + 1]?.branch;
    const pNextBranch = partnerResult?.grandCycles?.[(partnerResult.currentCycleIndex || 0) + 1]?.branch;

    const futureDyn = calculateRelationshipDynamics(
        result,
        partnerResult,
        futureRatios,
        pFutureRatios,
        lang as 'KO' | 'EN',
        uNextBranch,
        pNextBranch
    );

    const isKO = lang === 'KO';

    // V5.4 Weighting Calculation
    const weightedScore = Math.max(0, Math.min(100, Math.round((innateDyn.syncScore * 0.75) + (dyn.syncScore * 0.25))));
    const inn = innateDyn.syncScore;
    const cur = dyn.syncScore;
    const fut = futureDyn.syncScore;

    if (inn < 65 && cur >= 90 && (cur - fut) >= 20) {
        dyn.gates.unshift({
            name: isKO ? "⏳ [한여름 밤의 꿈]" : "⏳ [Midsummer Night's Dream]",
            desc: isKO ? "지금의 절정은 곧 저물 것입니다. 화려함 뒤에 올 고요를 준비하십시오." : "The current peak will soon set. Prepare for the silence that follows the splendor."
        });
    }

    if (fut - cur >= 15 && fut > 85) {
        dyn.gates.unshift({
            name: isKO ? "🌊 [밀물: 만개하는 카르마]" : "🌊 [The Rising Tide: Blooming Karma]",
            desc: isKO ? "가장 뜨거운 계절이 다가오고 있습니다. 지금의 사소한 마찰은 거대한 합(合)의 완성으로 가는 과정일 뿐입니다." : "The hottest season is approaching. Minor frictions now are just a transition toward the completion of a massive karmic union."
        });
    }

    dyn.syncScore = weightedScore;

    let titleSync = lang === 'KO' ? '무난하고 현실적인 동행' : 'Stable & Practical Connection';
    if (dyn.syncScore >= 95) titleSync = lang === 'KO' ? '✨ 천생연분 (영혼의 단짝)' : '✨ Soulmates (Karmic Bond)';
    else if (dyn.syncScore >= 85) titleSync = lang === 'KO' ? '🔥 찰떡궁합 (최고의 시너지)' : '🔥 Top-tier Synergy';
    else if (dyn.syncScore >= 70) titleSync = lang === 'KO' ? '🤝 상호보완적 조력자' : '🤝 Great Supporters';
    else if (dyn.syncScore <= 40) titleSync = lang === 'KO' ? '🌪️ 거센 마찰과 성장의 과제' : '🌪️ Friction and Growth';

    let syncTierText = lang === 'KO' ? '적합' : 'Good';
    let syncColor = 'bg-fuchsia-400';
    let syncIcon = '✅';

    if (dyn.syncScore >= 90) { syncTierText = lang === 'KO' ? '완벽' : 'Perfect'; syncColor = 'bg-rose-500'; syncIcon = '💘'; }
    else if (dyn.syncScore >= 70) { syncTierText = lang === 'KO' ? '우수' : 'Excellent'; syncColor = 'bg-fuchsia-500'; syncIcon = '✨'; }
    else if (dyn.syncScore >= 50) { syncTierText = lang === 'KO' ? '보통' : 'Average'; syncColor = 'bg-fuchsia-300'; syncIcon = '🤝'; }
    else { syncTierText = lang === 'KO' ? '주의' : 'Warning'; syncColor = 'bg-white/30'; syncIcon = '⚠️'; }

    let bridgeText = lang === 'KO' ? '서로의 에너지가 융화되는 구간입니다.' : 'Your energies blend naturally.';
    if (dyn.syncScore >= 85) bridgeText = lang === 'KO' ? '서로가 서로에게 부족한 기운을 넘치게 채워주는 강력한 보완 관계입니다.' : 'A powerful complementary relationship where both fill each other\'s void.';
    else if (dyn.syncScore >= 60) bridgeText = lang === 'KO' ? '서로의 기운이 부드럽게 조화를 이루며 긍정적인 시너지를 만들어냅니다.' : 'Your energies harmonize smoothly.';
    else if (dyn.syncScore >= 45) bridgeText = lang === 'KO' ? '때로는 마찰이 있지만 양보를 통해 타협점을 찾아가야 하는 현실적 구간입니다.' : 'A practical phase requiring compromise to overcome occasional friction.';
    else bridgeText = lang === 'KO' ? '에너지가 크게 충돌하며 잦은 마찰을 빚을 수 있으니, 각자의 공간과 거리두기가 필요합니다.' : 'Strong energies clash severely; maintaining proper distance is highly recommended.';

    if (dyn.isEasterEgg) {
        titleSync = lang === 'KO' ? '🚨 비상 규격 외의 인연 (Easter Egg)' : '🚨 Out-of-Bounds Fate (Easter Egg)';
        syncColor = 'bg-fuchsia-500';
        syncIcon = '⚡';
        bridgeText = lang === 'KO' 
            ? `사주의 특수 법칙에 따라 0에 수렴해야 할 점수가 반전되어 도출된, 극도로 치명적이고 강렬한 기운의 끌림입니다.` 
            : `A rare twist of fate—an intense, rule-breaking attraction derived from special energetic structures.`;
    }

    return { 
        text: dyn.text, 
        relation: dyn.relation, 
        isGlowing: dyn.isGlowing, 
        syncScore: dyn.syncScore, 
        temperature: dyn.temperature, 
        titleSync, 
        isEasterEgg: dyn.isEasterEgg,
        syncTierText,
        syncColor,
        syncIcon,
        bridgeText,
        gates: dyn.gates,
        structuralSynergy: dyn.structuralSynergy
    };
  }, [partnerResult, result, lang, adjustedElements, partnerAdjustedElements]);

  const radarData = useMemo(() => {
    return ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(el => {
      const mValue = adjustedElements[el] || 0;
      let pValue = 0;
      if (partnerAdjustedElements) {
         pValue = partnerAdjustedElements[el] || 0;
      }

      return {
        subject: lang === 'KO' ? ELEMENT_KOR[el] : el,
        mine: mValue,
        partner: pValue,
        quest: questCompleted ? (el === weakestElement ? mValue + 30 : mValue) : mValue
      };
    });
  }, [adjustedElements, partnerAdjustedElements, questCompleted, weakestElement, lang]);

  const range = maxSlider - minSlider;
  const getLeftPct = (val: number) => range === 0 ? 50 : ((val - minSlider) / range) * 100;

  const dynamicOverview = useMemo(() => {
    
      const isPast = sliderIndex < currentIndex;
      const isFuture = sliderIndex > currentIndex;
      return generateIndividualTimelineBriefing(result, currentDaewun, adjustedElements, lang, isPast, isFuture, sliderIndex);
  }, [sliderIndex, currentIndex, parsedJson.overview, lang]);

  const partnerEasterEggActive = partnerAnalysisMemo?.isEasterEgg;

  const partnerTimelineBriefing = useMemo(() => {
    if (!partnerResult || !partnerAnalysisMemo) return null;
    return generateRelationshipDynamics(
        result,
        partnerResult,
        currentDaewun,
        partnerAdjustedElements,
        partnerAnalysisMemo.temperature,
        lang as 'KO' | 'EN',
        partnerMatchDaewun
    );
  }, [partnerResult, partnerAnalysisMemo, sliderIndex, currentIndex, currentDaewun, result, lang, partnerAdjustedElements]);
  
  // Override quest presentation if extreme tension
  let questTitle = lang === 'KO' ? '오늘의 카르마 퀘스트' : 'Daily Karma Quest';
  let questDesc = lang === 'KO' 
            ? `현재 대운에서 가장 부족한 [${ELEMENT_KOR[weakestElement]}] 기운을 채우는 현실 액션입니다.`
            : `A daily action to boost your weakest element [${weakestElement}] in the current phase.`;
  let questText = KARMA_QUESTS[weakestElement][lang === 'KO' ? 'ko' : 'en'][questSeed];
  let overrideColor = ELEMENT_COLORS[weakestElement];

  if (partnerEasterEggActive && partnerResult && partnerAnalysisMemo) {
       questTitle = lang === 'KO' ? '관계 텐션 완화 미션' : 'Tension Relief Quest';
       
       const isRival = partnerAnalysisMemo.titleSync.includes('라이벌');
       if (isRival) {
            questDesc = lang === 'KO' ? `서로의 강한 에너지가 부딪히는 것을 긍정적 시너지로 돌리기 위한 특별 미션입니다.` : `A special mission to prevent your strong egos from clashing.`;
            questText = lang === 'KO' ? `각자 다른 공간에서 1시간 동안 몰입하고 짧게 응원 한마디 나누기` : `Spend 1 hour apart focusing on work, then give a short encouragement.`;
       } else {
            questDesc = lang === 'KO' ? `서로의 뜨거운 동족 텐션을 식히고 객관성을 되찾기 위한 수(水) 기운 급속 충전 미션입니다.` : `A temporary mission to cool down your mirror-effect tension.`;
            questText = lang === 'KO' ? `조용한 카페에서 서로 대화 없이 1시간 동안 책 읽기` : `Sit in a quiet cafe with no talking for 1 hour, reading separate books.`;
            overrideColor = ELEMENT_COLORS['Water'];
       }
  }

  const renderDaewunBriefing = () => (
      <div className="p-4 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-bold text-white/80">{lang === 'KO' ? '대운 해설' : 'Daewun Details'}</h4>
            <button onClick={() => setShowTimelineDocs(!showTimelineDocs)} className="text-xs text-white/50 hover:text-white">
                {showTimelineDocs ? (lang === 'KO' ? '닫기' : 'Hide') : (lang === 'KO' ? '펼치기' : 'Show')}
            </button>
        </div>
        <AnimatePresence>
            {showTimelineDocs && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="text-sm text-white/80 leading-relaxed font-display whitespace-pre-wrap pt-2">
                      {dynamicOverview}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ color: daewunThemeColor }}>
          [{parsedJson.theme}]
        </h3>
      </div>

      {/* Timeline Controls */}
      <div className="p-4 bg-black/40 rounded-xl border border-white/5 relative z-20">
        <div className="text-sm font-bold text-white/70 mb-4 flex justify-between items-center">
          <span>{lang === 'KO' ? '대운 흐름 (Timeline)' : 'Daewun Timeline'}</span>
          <span className="text-xs bg-white/10 px-2 py-1 rounded transition-colors duration-1000" style={{ color: daewunThemeColor }}>
            {sliderIndex === currentIndex ? (lang === 'KO' ? '현재' : 'Current') :
             sliderIndex < currentIndex ? (lang === 'KO' ? '과거' : 'Past') : (lang === 'KO' ? '미래' : 'Future')}
          </span>
        </div>
        
        <div className="relative w-full h-8 flex items-center my-4">
          {/* Custom track */}
          <div className="absolute inset-x-0 h-2 bg-white/10 rounded-lg top-1/2 -translate-y-1/2"></div>
          
          {/* Custom points */}
          {range > 0 ? (
            [minSlider, currentIndex, maxSlider].map((val) => (
              <div key={val} className="absolute h-4 w-4 bg-white/20 rounded-full z-10 pointer-events-none"
                style={{ left: `${getLeftPct(val)}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
              ></div>
            ))
          ) : null}
          
          {/* Animated Thumb */}
          <motion.div 
            className="absolute h-6 w-6 rounded-full z-20 shadow-[0_0_10px_rgba(255,255,255,0.5)] pointer-events-none"
            style={{ backgroundColor: daewunThemeColor, top: '50%', y: '-50%', marginLeft: '-12px' }}
            animate={{ left: `${getLeftPct(sliderIndex)}%`, backgroundColor: daewunThemeColor }}
            transition={{ type: "spring", bounce: 0, duration: 1.5 }}
          />

          {/* Invisible Native Input for interaction */}
          <input 
            type="range" 
            min={minSlider} 
            max={maxSlider} 
            step="1"
            value={sliderIndex} 
            onChange={(e) => setSliderIndex(parseInt(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30 m-0 p-0"
          />
        </div>

        <div className="flex justify-between text-xs text-white/50 mt-2 font-mono">
          <span>{result.grandCycles[minSlider]?.age}세~</span>
          {range > 0 && <span>{result.grandCycles[currentIndex]?.age}세~</span>}
          {range > 0 && <span>{result.grandCycles[maxSlider]?.age}세~</span>}
        </div>
        <motion.div 
          animate={{ color: daewunThemeColor }}
          transition={{ duration: 1.5 }}
          className="text-center mt-3 font-bold text-lg"
        >
          {lang === 'KO' ? currentDaewun.year + '년 ~ : ' + currentDaewun.stem + currentDaewun.branch + ' 대운' : currentDaewun.year + ' ~ : ' + getPinyin(currentDaewun.stem, currentDaewun.branch) + ' Phase'}
        </motion.div>
      </div>

      {/* Radar Chart Section */}
      <div className={`p-2.5 sm:p-4 bg-black/40 rounded-xl border border-white/5 flex flex-col items-center relative overflow-hidden transition-all duration-1000 ${partnerAnalysisMemo?.isGlowing ? 'shadow-[0_0_60px_-10px_rgba(232,121,249,0.5)] border-fuchsia-500/30' : ''}`}
           style={{ boxShadow: partnerAnalysisMemo?.isGlowing ? undefined : `0 0 40px -10px ${daewunThemeColor}30` }}
      >
        <h4 className="text-xs font-bold text-white/60 uppercase mb-2 self-start px-1.5">
          {lang === 'KO' ? '오행 밸런스 시각화 (Element Radar)' : 'Element Balance Radar'}
        </h4>
        <div className="w-full h-64 sm:h-80 relative z-10 pointer-events-none">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart key={sliderIndex} cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff80', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              
              {questCompleted && (
                 <Radar
                   name="Quest"
                   dataKey="quest"
                   stroke={ELEMENT_COLORS[weakestElement]}
                   fill={ELEMENT_COLORS[weakestElement]}
                   fillOpacity={0.6}
                   isAnimationActive={true}
                   animationDuration={1500}
                   animationEasing="ease-out"
                 />
              )}

              {partnerResult && (
                <Radar
                   name="Partner"
                   dataKey="partner"
                   stroke="#E879F9"
                   fill="#E879F9"
                   fillOpacity={0.5}
                   isAnimationActive={true}
                   animationDuration={1500}
                   animationEasing="ease-out"
                />
              )}
              
              <Radar
                name="Mine"
                dataKey="mine"
                stroke={daewunThemeColor}
                fill={daewunThemeColor}
                fillOpacity={0.5}
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Compatibility Result Mini-Overlay */}
        {partnerResult && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
                      className="absolute top-4 right-4 bg-fuchsia-500/20 border border-fuchsia-400/50 rounded-lg p-2 flex items-center gap-2 backdrop-blur-md z-20">
             <Heart className="w-4 h-4 text-fuchsia-400" />
             <span className="text-xs font-bold text-fuchsia-200">
               {lang === 'KO' ? '궁합 스캐너 활성화됨' : 'Scanner Active'}
             </span>
             <button onClick={() => setPartnerResult(null)} className="ml-2 text-white/50 hover:text-white">
               <X className="w-3 h-3" />
             </button>
          </motion.div>
        )}
      </div>

      {/* Timeline Briefing for Relationships */}
      {partnerTimelineBriefing && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
          className={`p-4 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] bg-fuchsia-900/30 border rounded-xl space-y-3 relative overflow-hidden backdrop-blur-md ${partnerTimelineBriefing.intensity > 0.8 ? 'border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.3)]' : 'border-fuchsia-500/50'}`}>
           <div className="absolute top-0 right-0 p-2 opacity-10">
               <Heart className="w-16 h-16 text-fuchsia-300" />
           </div>
           <div className="flex items-center gap-2 border-b border-fuchsia-500/20 pb-2">
             <Repeat className="w-4 h-4 text-fuchsia-400" />
             <h4 className="text-sm font-bold text-fuchsia-100">
               {lang === 'KO' ? '관계 역동성 브리핑' : 'Relationship Dynamics Briefing'}
             </h4>
             <span className="text-xs bg-fuchsia-500/20 text-fuchsia-200 px-2 py-0.5 rounded ml-auto font-mono text-center truncate overflow-hidden whitespace-nowrap min-w-0 max-w-[80px]">
                {currentDaewun.year} {lang === 'KO' ? currentDaewun.stem + currentDaewun.branch : getPinyin(currentDaewun.stem, currentDaewun.branch)}
             </span>
             <button onClick={() => setShowDynamicsBrief(!showDynamicsBrief)} className="text-xs text-fuchsia-300 ml-2 whitespace-nowrap flex-shrink-0">
                {showDynamicsBrief ? (lang === 'KO' ? '닫기' : 'Hide') : (lang === 'KO' ? '펼치기' : 'Show')}
             </button>
           </div>
           
           <AnimatePresence>
           {showDynamicsBrief && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-3 relative z-10 overflow-hidden pt-2">
              <div>
                 <span className="text-xs font-bold text-fuchsia-300 block mb-1">{lang === 'KO' ? '관계 테마' : 'Theme'}</span>
                 <span className="text-sm font-medium text-fuchsia-50">{partnerTimelineBriefing.title}</span>
              </div>
              <div className="bg-black/20 p-2.5 rounded border border-white/5">
                 <span className="text-xs font-bold text-fuchsia-300/80 block mb-1">{lang === 'KO' ? '심리적 흐름' : 'Psychology'}</span>
                 <span className="text-sm text-fuchsia-50/90 leading-relaxed whitespace-pre-wrap">{partnerTimelineBriefing.psychology}</span>
              </div>
              <div className="bg-black/20 p-2.5 rounded border border-white/5">
                 <span className="text-xs font-bold text-fuchsia-300/80 block mb-1">{lang === 'KO' ? '관계의 역동성' : 'Interaction'}</span>
                 <span className="text-sm text-fuchsia-50/90 leading-relaxed whitespace-pre-wrap">{partnerTimelineBriefing.interaction}</span>
              </div>
              <div className="bg-fuchsia-950/50 p-2.5 rounded border border-fuchsia-500/20 text-sm text-fuchsia-200/90 mt-2">
                 <div className="font-bold text-xs text-fuchsia-400 mb-1">{lang === 'KO' ? '전략적 가이드' : 'Action Guide'}</div>
                 <div className="leading-relaxed">{partnerTimelineBriefing.action_guide}</div>
              </div>
           </motion.div>
           )}
           </AnimatePresence>
        </motion.div>
      )}

      {/* Karma Quests (Daily Action) */}
      {!partnerResult && (
      <div className="p-4 bg-black/40 border border-white/10 rounded-xl relative overflow-hidden">
        {questCompleted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-green-500/10 z-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent" />
          </motion.div>
        )}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-white/70" />
            <h4 className="text-sm font-bold text-white/80">{questTitle}</h4>
          </div>
          <p className="text-xs text-white/50 mb-4">
            {questDesc}
          </p>
          
          <div className="bg-white/5 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: overrideColor + '40', color: overrideColor }}>
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white">
                {questText}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setQuestCompleted(true)}
                disabled={questCompleted}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${questCompleted ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 hover:bg-white/20 text-white'}`}
              >
                {questCompleted 
                  ? (lang === 'KO' ? '에너지 충전 완료!' : 'Energy Charged!') 
                  : (lang === 'KO' ? '퀘스트 완료' : 'Complete Quest')}
              </button>
              {questCompleted && (
                <button onClick={() => setQuestCompleted(false)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Compatibility Scanner Trigger */}
      {!partnerResult && (
        <div className="p-4 border border-fuchsia-500/30 bg-fuchsia-500/5 rounded-xl cursor-pointer hover:bg-fuchsia-500/10 transition-colors"
             onClick={() => setShowPartnerForm(!showPartnerForm)}>
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <Swords className="w-4 h-4 text-fuchsia-400" />
               <span className="text-sm font-bold text-fuchsia-200">
                 {lang === 'KO' ? '궁합 스캐너 (Compatibility Scanner)' : 'Compatibility Scanner'}
               </span>
             </div>
             <div className="text-xs text-fuchsia-400 bg-fuchsia-500/20 px-2 py-1 rounded-full">New</div>
           </div>
           
           {showPartnerForm && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-4 mt-4 border-t border-fuchsia-500/20" onClick={e => e.stopPropagation()}>
                {/* Simplified Partner Form */}
                <PartnerQuickForm lang={lang} onSubmit={(res) => { setPartnerResult(res); setShowPartnerForm(false); }} />
             </motion.div>
           )}
        </div>
      )}

      {(!partnerResult || !partnerAnalysisMemo) && renderDaewunBriefing()}

      {partnerResult && partnerAnalysisMemo && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-xl space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-fuchsia-400" />
            <h4 className="text-sm font-bold text-fuchsia-200">
              {lang === 'KO' ? '궁합 스캐너 결과' : 'Compatibility Analysis'}
            </h4>
            <button onClick={() => setShowScannerResult(!showScannerResult)} className="ml-auto text-xs text-fuchsia-300">
                {showScannerResult ? (lang === 'KO' ? '닫기' : 'Hide') : (lang === 'KO' ? '펼치기' : 'Show')}
            </button>
          </div>
          
          <AnimatePresence>
          {showScannerResult && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 overflow-hidden">
          <div className="flex flex-col gap-3">
             <div className="bg-black/40 rounded-xl p-5 flex flex-col justify-center border border-white/5 relative overflow-hidden group">
                {partnerAnalysisMemo.isEasterEgg && (
                     <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
                <div className={`text-xs mb-3 text-left ${partnerAnalysisMemo.isEasterEgg ? 'text-red-400 font-bold' : 'text-white/50'}`}>
                    {partnerAnalysisMemo.titleSync}
                </div>
                <div className="flex flex-col gap-1 mb-4">
                    <span className="text-sm font-bold text-white/80 flex items-center gap-1.5">
                        <span className="text-lg">{partnerAnalysisMemo.syncIcon}</span> {partnerAnalysisMemo.syncTierText}
                    </span>
                    <span className={`text-[2.2rem] leading-none font-mono font-bold ${partnerAnalysisMemo.isEasterEgg ? 'text-red-500' : 'text-fuchsia-300'}`}>
                        {partnerAnalysisMemo.syncScore}%
                    </span>
                </div>
                {/* Color Gauge Bar */}
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mt-1">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${partnerAnalysisMemo.syncScore}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${partnerAnalysisMemo.syncColor}`} 
                    />
                </div>
                {partnerAnalysisMemo.structuralSynergy && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold tracking-wider mb-2">
                            <span className="shrink-0">⚜️</span>
                            {partnerAnalysisMemo.structuralSynergy.badge}
                        </div>
                        <div className="text-xs text-white/70 leading-relaxed">
                            {partnerAnalysisMemo.structuralSynergy.desc}
                        </div>
                    </div>
                )}
             </div>
             <div className="bg-black/40 rounded-xl p-4 flex flex-row items-center justify-between border border-white/5">
                <div className="text-xs text-white/50">{lang === 'KO' ? '관계의 온도' : 'Relationship Temp'}</div>
                <div className="text-2xl font-mono text-rose-400 font-bold leading-none">{partnerAnalysisMemo.temperature}℃</div>
             </div>
          </div>

          

          {(() => {
             const fullText = partnerAnalysisMemo.text;
             const splitTokenKo = "[관계 극성";
             const splitTokenEn = "[Relationship Polarity";
             const tokenIdxKo = fullText.indexOf(splitTokenKo);
             const tokenIdxEn = fullText.indexOf(splitTokenEn);
             const tokenIdx = tokenIdxKo !== -1 ? tokenIdxKo : (tokenIdxEn !== -1 ? tokenIdxEn : -1);
             const previewText = tokenIdx !== -1 ? fullText.substring(0, tokenIdx).trim() : fullText;
             const hasMoreText = tokenIdx !== -1;

             return (
               <>
                 <div className="text-[15px] tracking-tight text-fuchsia-100/90 leading-[1.7] font-display whitespace-pre-wrap mt-4 mb-2">
                   {showFullRelationText ? fullText : previewText}
                 </div>
                 {hasMoreText && (
                   <div className="flex justify-center mt-2 mb-6">
                     <button onClick={() => setShowFullRelationText(!showFullRelationText)} className="text-xs text-fuchsia-300 hover:text-fuchsia-200 transition-colors flex items-center justify-center gap-1 bg-fuchsia-900/30 px-3 py-1.5 border border-fuchsia-500/30 rounded-full">
                         {showFullRelationText ? (lang === 'KO' ? '접기 ▲' : 'Show Less ▲') : (lang === 'KO' ? '더보기 ▼' : 'Show More ▼')}
                     </button>
                   </div>
                 )}
               </>
             );
          })()}

          {partnerAnalysisMemo.gates && partnerAnalysisMemo.gates.length > 0 && (
            <div className="space-y-3 pt-6 mt-6 border-t border-fuchsia-500/20">
               <h5 className="text-[13px] font-bold text-fuchsia-200 uppercase mb-4 tracking-widest flex items-center gap-2">
                 <span>{lang === 'KO' ? '관계 역학 (Dynamics Gates)' : 'Relationship Dynamics'}</span>
                 <span className="text-[10px] bg-fuchsia-500/20 border border-fuchsia-400/30 text-fuchsia-300 px-2 py-0.5 rounded-full">{partnerAnalysisMemo.gates.length}</span>
               </h5>
               {partnerAnalysisMemo.gates.slice(0, showFullRelationGates ? undefined : 3).map((g: any, i: number) => (
                 <div key={i} className="bg-black/30 border border-fuchsia-400/20 rounded-xl px-5 py-4 relative overflow-hidden flex flex-col gap-1.5">
                   <div className="absolute top-0 left-0 w-1.5 h-full bg-fuchsia-500/50"></div>
                   <div className="text-[13px] font-bold text-fuchsia-300">{g.name}</div>
                   <div className="text-[14px] text-fuchsia-50/90 leading-[1.65]">{g.desc}</div>
                 </div>
               ))}
               {partnerAnalysisMemo.gates.length > 3 && (
                   <button onClick={() => setShowFullRelationGates(!showFullRelationGates)} className="mt-3 w-full py-2 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 rounded-lg border border-fuchsia-500/30 text-xs font-bold text-fuchsia-300/80 transition-colors flex items-center justify-center gap-1.5">
                       {showFullRelationGates ? (lang === 'KO' ? '배지 접기 ▲' : 'Hide Badges ▲') : (lang === 'KO' ? `전체 보기 (+${partnerAnalysisMemo.gates.length - 3}) ▼` : `Show All (+${partnerAnalysisMemo.gates.length - 3}) ▼`)}
                   </button>
               )}
            </div>
          )}
          </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      )}

               {partnerResult && partnerAnalysisMemo && renderDaewunBriefing()}
    </motion.div>
  );
}

// Minimal inline form for partner
const PartnerQuickForm: React.FC<{ lang: Language, onSubmit: (res: BaZiResult) => void }> = ({ lang, onSubmit }) => {
  const [year, setYear] = useState('1990');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [time, setTime] = useState('12:00');
  const [gender, setGender] = useState('m');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [city, setCity] = useState(lang === 'KO' ? '서울' : 'Seoul');
  const [coords, setCoords] = useState({ lat: 37.5665, lon: 126.9780 });
  const cityInputRef = React.useRef<HTMLInputElement>(null);
  const autocompleteRef = React.useRef<any>(null);

  useEffect(() => {
    const initPartnerAutocomplete = async () => {
      if (cityInputRef.current && window.google?.maps) {
        try {
          // Ensure places library is imported
          let AutocompleteClass;
          if (window.google.maps.places?.Autocomplete) {
            AutocompleteClass = window.google.maps.places.Autocomplete;
          } else {
            const { Autocomplete } = await window.google.maps.importLibrary("places") as any;
            AutocompleteClass = Autocomplete;
          }

          if (autocompleteRef.current) return;

          const autocomplete = new AutocompleteClass(cityInputRef.current, {
            types: ['(cities)'],
            fields: ['geometry', 'name']
          });

          autocompleteRef.current = autocomplete;

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place?.geometry?.location) {
              const lat = place.geometry.location.lat();
              const lon = place.geometry.location.lng();
              setCoords({ lat, lon });
              const cityName = place.name || cityInputRef.current?.value || '';
              setCity(cityName);
            }
          });
        } catch (e) {
          console.error("Error initializing Partner Autocomplete", e);
        }
      }
    };

    initPartnerAutocomplete();
    
    return () => {
      autocompleteRef.current = null;
    };
  }, [lang]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: UserInput = {
      name: 'Partner',
      birthDate: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
      birthTime: time,
      city: city,
      gender: gender === 'm' ? 'male' : 'female',
      calendarType
    };
    try {
      const res = calculateRealBaZi(input, coords.lat, coords.lon, lang);
      onSubmit(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
         <div className="flex bg-black/50 p-1 rounded border border-white/10">
           <button type="button" onClick={() => setCalendarType('solar')} className={`flex-1 text-[10px] py-1 rounded transition-colors ${calendarType === 'solar' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}>{lang === 'KO' ? '양력' : 'Solar'}</button>
           <button type="button" onClick={() => setCalendarType('lunar')} className={`flex-1 text-[10px] py-1 rounded transition-colors ${calendarType === 'lunar' ? 'bg-white/20 text-white' : 'text-white/50 hover:text-white/80'}`}>{lang === 'KO' ? '음력' : 'Lunar'}</button>
         </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-[10px] text-white/50">{lang === 'KO' ? '년도' : 'Year'}</label>
          <input type="number" value={year} onChange={e=>setYear(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-1 text-xs text-white" />
        </div>
        <div>
          <label className="text-[10px] text-white/50">{lang === 'KO' ? '월' : 'Month'}</label>
          <input type="number" 
            value={month} 
            onChange={e=>{
              let v = e.target.value;
              if (v.length > 2) v = v.slice(0, 2);
              if (v === '0') { setMonth(v); return; }
              let n = parseInt(v, 10);
              if (!isNaN(n)) {
                if (n > 12) v = '12';
              }
              setMonth(v);
            }} 
            className="w-full bg-black/50 border border-white/10 rounded p-1 text-xs text-white" />
        </div>
        <div>
          <label className="text-[10px] text-white/50">{lang === 'KO' ? '일' : 'Day'}</label>
          <input type="number" 
            value={day} 
            onChange={e=>{
              let v = e.target.value;
              if (v.length > 2) v = v.slice(0, 2);
              if (v === '0') { setDay(v); return; }
              let n = parseInt(v, 10);
              if (!isNaN(n)) {
                if (n > 31) v = '31';
              }
              setDay(v);
            }} 
            className="w-full bg-black/50 border border-white/10 rounded p-1 text-xs text-white" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-white/50">{lang === 'KO' ? '태어난 시간' : 'Time'}</label>
          <input type="time" lang={lang === 'KO' ? 'ko-KR' : 'en-US'} value={time} onChange={e=>setTime(e.target.value)} placeholder="HH:MM" className="w-full bg-black/50 border border-white/10 rounded p-1 text-xs text-white" />
        </div>
        <div>
          <label className="text-[10px] text-white/50">{lang === 'KO' ? '성별' : 'Gender'}</label>
          <select value={gender} onChange={e=>setGender(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-1 text-xs text-white">
            <option value="m">{lang === 'KO' ? '남성' : 'Male'}</option>
            <option value="f">{lang === 'KO' ? '여성' : 'Female'}</option>
          </select>
        </div>
      </div>
      {/* City Input */}
      <div>
        <label className="text-[10px] text-white/50">{lang === 'KO' ? '태어난 도시' : 'Birth City'}</label>
        <div className="relative">
          <Globe className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-fuchsia-400" />
          <input 
            ref={cityInputRef}
            type="text" 
            value={city} 
            onChange={e => setCity(e.target.value)}
            placeholder={lang === 'KO' ? '도시 입력' : 'Enter City'}
            className="w-full bg-black/50 border border-white/10 rounded p-1 pl-7 text-xs text-white" 
          />
        </div>
      </div>
      <button type="submit" className="w-full py-2 mt-2 bg-fuchsia-500/20 text-fuchsia-300 rounded font-bold text-xs border border-fuchsia-500/40 hover:bg-fuchsia-500/30 transition-colors">
        {lang === 'KO' ? '스캔 시작' : 'Start Scan'}
      </button>
    </form>
  );
};
