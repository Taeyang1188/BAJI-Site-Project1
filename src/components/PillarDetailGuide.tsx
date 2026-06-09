import React from 'react';
import { BaZiResult, Language } from '../types';
import { TEN_GOD_COLORS, ELEMENT_COLORS } from '../constants';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { useTheme } from '../contexts/ThemeContext';

interface PillarDetailGuideProps {
  result: BaZiResult;
  lang: Language;
  guideSelectedPillar: 'Year' | 'Month' | 'Day' | 'Hour';
  setGuideSelectedPillar: (val: 'Year' | 'Month' | 'Day' | 'Hour') => void;
  getDetailedTenGod: (dm: string, hs: string) => { ko: string; en: string; isAuspicious?: boolean };
  getTenGodColor: (name: string) => string;
}

const GUIDE_PILLARS = [
  { key: 'Year' as const, ko: '년주', descKo: '조상/초년', en: 'Year', descEn: 'Ancestry/Early' },
  { key: 'Month' as const, ko: '월주', descKo: '사회/직업', en: 'Month', descEn: 'Society/Career' },
  { key: 'Day' as const, ko: '일주', descKo: '나/배우자', en: 'Day', descEn: 'Self/Spouse' },
  { key: 'Hour' as const, ko: '시주', descKo: '미래/자식', en: 'Hour', descEn: 'Future/Children' }
];

const TEN_GOD_DESC = {
  '비견': {
    actionKo: '마이웨이 리더십', strategyKo: '나 혼자만의 시간이나 가장 은밀한 사생활 속에서는, [모두를 아우르고 묵직하게 버텨내는 산 같은] 기질을 조용히 뿜어내며 평온을 느낍니다. 혼자 있을 땐 종종 나만의 방식으로 에너지를 충전하곤 해요.', warningKo: '내 고집이 선을 넘으면 주변에 진짜 내 편이 다 떨어져 나갈 수 있어요. 혼자만의 동굴에 갇히지 않게 조심!',
    actionEn: 'My-Way Leadership', strategyEn: 'In your private moments, you quietly emit a [robust, mountain-like resilience that embraces everything] trait, finding peace. You recharge in your own unique way.', warningEn: 'If your stubbornness crosses the line, you might push away your true allies. Be careful not to trap yourself in your own cave!'
  },
  '겁재': {
    actionKo: '승부사 기질', strategyKo: '결정적인 순간에는 무서울 정도의 집중력과 추진력을 발휘합니다. 목표가 생기면 물불 가리지 않고 쟁취해내는 승부사입니다.', warningKo: '지나친 경쟁심으로 인해 인간관계에서 불필요한 마찰을 빚을 수 있습니다. 때로는 양보의 미덕이 필요합니다.',
    actionEn: 'Competitive Spirit', strategyEn: 'At crucial moments, you show incredible focus and drive. Once a goal is set, you act as a fierce competitor who will do whatever it takes.', warningEn: 'Excessive competitiveness can cause unnecessary friction in relationships. Sometimes, the virtue of concession is needed.'
  },
  '식신': {
    actionKo: '몰입하는 장인', strategyKo: '자신이 좋아하는 일에는 시간 가는 줄 모르고 깊게 파고드는 장인정신이 있습니다. 쾌락과 즐거움을 통해 에너지를 발산합니다.', warningKo: '좋아하는 것만 편식하려는 경향이 있습니다. 현실적인 마감기한이나 타인과의 조율을 놓치기 쉽습니다.',
    actionEn: 'Immersed Artisan', strategyEn: 'You possess a craftsmanship spirit that dives deep into your passions, losing track of time. You release energy through joy and pleasure.', warningEn: 'You tend to be picky, favoring only what you like. It is easy to miss realistic deadlines or fail to coordinate with others.'
  },
  '상관': {
    actionKo: '틀을 깨는 혁신', strategyKo: '기존의 낡은 관습이나 답답한 규범을 보면 참을 수 없는 비판적 시각을 지녔습니다. 촌철살인의 매력으로 통쾌함을 줍니다.', warningKo: '팩트 폭력이 지나치면 주변 사람들에게 큰 상처를 줄 수 있습니다. 말 한마디가 양날의 검이 될 수 있음을 기억하세요.',
    actionEn: 'Frame-Breaking Innovator', strategyEn: 'You have a critical eye that cannot tolerate old customs or rigid norms. Your sharp, piercing remarks provide refreshing catharsis.', warningEn: 'Excessive blunt facts can deeply hurt those around you. Remember that a single word can be a double-edged sword.'
  },
  '편재': {
    actionKo: '빅 픽처 설계자', strategyKo: '거시적인 안목에서 큰 기회를 포착하는 감각이 탁월합니다. 사람들을 연결하고 큰 판을 벌리는 네트워킹에 능통합니다.', warningKo: '디테일에 약하고 마무리가 흐지부지될 수 있습니다. 감당하지 못할 스케일로 확장하다가 리스크를 떠안을 수 있습니다.',
    actionEn: 'Big-Picture Architect', strategyEn: 'You have an excellent sense for catching big opportunities from a macro perspective. You excel at networking, connecting people, and scaling up.', warningEn: 'You may struggle with details, leading to loose ends. Expanding beyond your capacity can bring unexpected risks.'
  },
  '정재': {
    actionKo: '정밀한 관리자', strategyKo: '하나씩 꼼꼼하게 따지고 계산하며 내 영역을 단단하게 구축해 나갑니다. 현실적 판단력과 책임감이 매우 뛰어납니다.', warningKo: '변화에 대한 두려움으로 인해 좋은 기회를 놓칠 수 있습니다. 가끔은 계산기를 내려놓고 모험을 감수해보세요.',
    actionEn: 'Precise Manager', strategyEn: 'You build your domain solidly by meticulously analyzing and calculating everything step by step. Your realistic judgment and responsibility are top-tier.', warningEn: 'Fear of change might cause you to miss good opportunities. Sometimes, try putting the calculator down and taking a risk.'
  },
  '편관': {
    actionKo: '위기를 명성으로', strategyKo: '[기획하고 거침없이 밀고 나가는] 것이 바로 당신의 일상적 성격입니다. 남 눈치 안 볼 때 제일 편안하게 나오는 모습이기도 하죠. 이 강력하고 솔직한 동력을 바탕으로 남들이 다들 겁먹고 도망가는 헬파티나 개노답 프로젝트를 해결해서 폼나게 인정받고자 하는 돌파력이 당신의 강점입니다.', warningKo: '강박적인 책임감으로 인해 스스로를 너무 혹사시킬 수 있습니다. 나를 좀먹는 완벽주의를 경계하세요.',
    actionEn: 'Crisis into Reputation', strategyEn: '[plan and push forward relentlessly] is your everyday nature. It is how you act most comfortably when not worrying about others. Your strength lies in breaking through chaotic projects that others flee from, seeking stylish recognition.', warningEn: 'Obsessive responsibility can cause you to overwork yourself. Guard against perfectionism that eats away at you.'
  },
  '정관': {
    actionKo: '원칙의 수호자', strategyKo: '누가 보지 않아도 스스로 정한 원칙과 규범을 지키려는 명예로움이 있습니다. 조직 체계 속에서 안정과 품위를 추구합니다.', warningKo: '너무 올곧은 잣대는 유연한 대처능력을 떨어뜨릴 수 있습니다. 때로는 상황에 맞게 융통성을 발휘하는 것도 실력입니다.',
    actionEn: 'Guardian of Principles', strategyEn: 'You possess an honor that upholds self-imposed rules even when nobody is watching. You seek stability and dignity within organizational systems.', warningEn: 'Standards that are too rigid can reduce your flexible adaptability. Sometimes, showing flexibility to fit the situation is also a skill.'
  },
  '편인': {
    actionKo: '날카로운 영감', strategyKo: '남들이 보지 못하는 이면의 진실을 꿰뚫어보는 직관과 눈치가 고도로 발달했습니다. 독특하고 심오한 정신세계를 가집니다.', warningKo: '머릿속으로 "이렇게 하면 쩔겠지?" 생각만 오만 번 하다가 타이밍 다 놓치는 게 문제입니다. 고민 좀 적당히 하고 세상에 질러보세요.',
    actionEn: 'Sharp Inspiration', strategyEn: 'Your intuition and perceptiveness to see the hidden truth behind things are highly developed. You possess a unique and profound mental world.', warningEn: 'The problem is thinking "This would be awesome, right?" fifty thousand times and missing the timing. Stop overthinking and just do it.'
  },
  '정인': {
    actionKo: '지혜의 스펀지', strategyKo: '세상의 지식과 정보를 스펀지처럼 부드럽게 흡수하고 활용하는 수용력이 높습니다. 인내심이 강하고 타인을 감싸안는 따뜻함이 있습니다.', warningKo: '행동하기보다는 생각이나 공부에만 머물러 실행력이 떨어질 수 있습니다. 타인에 대한 의존성이 높아질 수도 있으니 조심하세요.',
    actionEn: 'Sponge of Wisdom', strategyEn: 'You have a high capacity to gently absorb and utilize the world\'s knowledge like a sponge. You have strong patience and a warmth that embraces others.', warningEn: 'You may lack execution by staying only in thought or study rather than action. Be careful not to become too dependent on others.'
  }
};

const STEM_ATTRIBUTES: Record<string, { ko: string; en: string }> = {
  '甲': { ko: '기획하고 하늘을 향해 곧게 뻗어 올라가는 큰 나무 같은', en: 'planning and reaching straight up to the sky like a giant tree' },
  '乙': { ko: '유연하고 끈질기게 환경에 적응하며 뻗어나가는 덩굴 같은', en: 'flexibly and persistently adapting to the environment like a creeping vine' },
  '丙': { ko: '세상을 밝게 비추고 열정적으로 주변을 장악하는 태양 같은', en: 'brightly illuminating the world and passionately taking control like the sun' },
  '丁': { ko: '자신을 태워 주변을 은은하게 데우는 섬세한 모닥불 같은', en: 'burning oneself to gently warm the surroundings like a delicate campfire' },
  '戊': { ko: '모두를 아우르고 묵직하게 버텨내는 산 같은', en: 'embracing everyone and silently enduring like a mountain' },
  '己': { ko: '생명을 품어 길러내고 실용적으로 움직이는 대지 같은', en: 'nurturing life and acting practically like the warm earth' },
  '庚': { ko: '과감하게 결단하고 거침없이 밀고 나가는 무쇠 같은', en: 'making bold decisions and relentlessly pushing forward like raw iron' },
  '辛': { ko: '예리하게 다듬어져 예민하고 집요하게 파고드는 보석 같은', en: 'sharply refined and sensitively piercing like a jewel' },
  '壬': { ko: '모든 것을 깊게 포용하며 자유롭게 흐르는 거대한 바다 같은', en: 'deeply embracing everything and flowing freely like a vast ocean' },
  '癸': { ko: '소리 없이 스며들어 영리하게 적응하는 옹달샘 같은', en: 'silently seeping in and cleverly adapting like a mountain spring' }
};

export function PillarDetailGuide({ result, lang, guideSelectedPillar, setGuideSelectedPillar, getDetailedTenGod, getTenGodColor }: PillarDetailGuideProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isKo = lang === 'KO';

  const isHourUnknown = result.pillars.find(p => p.title === 'Hour')?.isUnknown;

  React.useEffect(() => {
    if (isHourUnknown && guideSelectedPillar === 'Hour') {
      setGuideSelectedPillar('Day');
    }
  }, [isHourUnknown, guideSelectedPillar, setGuideSelectedPillar]);

  const selectedPillarData = result.pillars.find(p => p.title === guideSelectedPillar);
  const localDayPillar = result.pillars.find(p => p.title === 'Day' && !p.isUnknown);
  const dayMaster = localDayPillar ? localDayPillar.stem : '甲';

  const isPillarUnknown = !selectedPillarData || selectedPillarData.isUnknown;

  // Calculate info for the selected Pillar's Stem
  const hs = !isPillarUnknown ? selectedPillarData.stem : '';
  const hsTenGod = !isPillarUnknown ? getDetailedTenGod(dayMaster, hs) : { ko: '', en: '' };
  const hsElement = !isPillarUnknown ? BAZI_MAPPING.stems[hs as keyof typeof BAZI_MAPPING.stems]?.element : '';
  const hsColor = hsElement ? (ELEMENT_COLORS[hsElement as keyof typeof ELEMENT_COLORS] || '#ffffff') : '#ffffff';
  
  let rootingDescKo = '지지에 이렇다 할 명확한 뿌리를 두고 있지 않습니다. 상황에 따라 변칙적이고 유연하게 활용되는 기운입니다.';
  let rootingTitleKo = '단독적이고 유연한 기운 (미통근)';
  let rootingDescEn = 'Does not have a clear root. Operates flexibly and independently.';
  let rootingTitleEn = 'Flexible Operator (Unrooted)';

  let isRooted = false;
  let strongRoots = 0;
  let isMainRooted = false;
  let pillarBranchClashed = false;
  let pillarBranchPunished = false;

  const pIdx = result.pillars.findIndex(p => p.title === guideSelectedPillar);
  const pRootDetails = result.analysis?.dayMasterStrength?.rootingDetails?.[pIdx];
  const branchChar = !isPillarUnknown ? selectedPillarData.branch : '';

  if (!isPillarUnknown) {
    // Scan all rooting details to see if the selected pillar's branch is clashed or punished
    result.analysis?.dayMasterStrength?.rootingDetails?.forEach((dt: any) => {
      dt.roots?.forEach((rt: any) => {
        if (rt.branchTitle === guideSelectedPillar) {
          if (rt.isDestroyed) pillarBranchClashed = true;
          if (rt.isTwisted) pillarBranchPunished = true;
        }
      });
    });

    if (pRootDetails && pRootDetails.roots) {
      pRootDetails.roots.forEach((rt: any) => {
        if (rt.isDestroyed) {
          return; // Clashed root is completely shattered, don't count it for active rooting!
        }
        
        isRooted = true;
        if (rt.type === 'main') {
          isMainRooted = true;
        }
        if (rt.hiddenStem === hs) {
          strongRoots++;
        }
      });
    }

    if (isRooted) {
       if (isMainRooted) {
          rootingTitleKo = '견고한 본기통근 (강력한 현실 구현력)';
          rootingDescKo = '지지의 본기(가장 중심이 되는 기운)에 직접 뿌리를 내리고 있어 목표 달성률과 현실화 파워가 대단히 높습니다. 강한 실행력이 돋보입니다.';
          rootingTitleEn = 'Strong Main Rooting (High Realization Power)';
          rootingDescEn = 'Has a strong main root in branches. Extremely high execution power and consistency.';
       } else if (strongRoots > 0) {
          rootingTitleKo = '조력적 통근 (환경의 지지)';
          rootingDescKo = '지지의 여기나 중기에 동일한 글자를 두어 환경의 지원을 구합니다. 상황에 맞춰 능동적으로 기운을 사용할 수 있습니다.';
          rootingTitleEn = 'Supportive Rooting (Environmental Support)';
          rootingDescEn = 'Rooted in secondary stems. Adaptable and active use of energy depending on the situation.';
       } else {
          rootingTitleKo = '일반적 통근 (잠재적 기반)';
          rootingDescKo = '동일 오행으로 지지의 지원을 받아 바탕 에너지를 현실에서 무난하게 발휘할 수 있는 동력을 갖추고 있습니다.';
          rootingTitleEn = 'Normal Rooting (Potential Base)';
          rootingDescEn = 'Supported by the same element in the branches, giving you foundational momentum.';
       }
    } else if (pillarBranchClashed) {
        rootingTitleKo = '충(衝)에 의한 무통근 (기반 소멸)';
        rootingDescKo = '본래 지지에 든든한 뿌리를 두고 있었으나, 인접한 충(衝) 작용으로 인해 그 기반이 완전히 흩어져 실질적인 통근력을 상실한 상태입니다.';
        rootingTitleEn = 'Root Lost to Adjacent Clash';
        rootingDescEn = 'Originally had a root, but it was shattered due to an adjacent clash, losing practical stability.';
    }
  }

  const stemAction = !isPillarUnknown && isKo ? ((TEN_GOD_DESC as any)[hsTenGod.ko]?.actionKo || '고유의 기질') : (!isPillarUnknown ? ((TEN_GOD_DESC as any)[hsTenGod.ko]?.actionEn || 'Unique Trait') : '');
  
  let rawStrategyKo = !isPillarUnknown ? ((TEN_GOD_DESC as any)[hsTenGod.ko]?.strategyKo || '') : '';
  let rawStrategyEn = !isPillarUnknown ? ((TEN_GOD_DESC as any)[hsTenGod.ko]?.strategyEn || '') : '';
  
  if (hs && STEM_ATTRIBUTES[hs]) {
    rawStrategyKo = rawStrategyKo.replace(/\[([^\]]+)\]/g, `[${STEM_ATTRIBUTES[hs].ko}]`);
    rawStrategyEn = rawStrategyEn.replace(/\[([^\]]+)\]/g, `[${STEM_ATTRIBUTES[hs].en}]`);
  }
  
  const stemStrategy = isKo ? rawStrategyKo : rawStrategyEn;
  const stemWarning = !isPillarUnknown && isKo ? ((TEN_GOD_DESC as any)[hsTenGod.ko]?.warningKo || '') : (!isPillarUnknown ? ((TEN_GOD_DESC as any)[hsTenGod.ko]?.warningEn || '') : '');
  const branchMapping = branchChar ? BAZI_MAPPING.branches[branchChar as keyof typeof BAZI_MAPPING.branches] : null;
  
  return (
    <div className="w-full flex flex-col gap-4 mt-6 pt-6 border-t border-white/10">
      <h3 className={`text-xl font-bold flex items-center gap-2 ${isLight ? 'text-slate-800' : 'text-[#6DABFF]'}`}>
        <span className={`w-1.5 h-6 rounded-full inline-block ${isLight ? 'bg-slate-800' : 'bg-[#6DABFF]'}`}></span>
        {isKo ? '기둥별 심층 분석 가이드' : 'In-depth Analysis Guide by Pillar'}
      </h3>

      <div className={`flex gap-2 p-1.5 rounded-xl overflow-x-auto no-scrollbar shadow-inner mt-2 ${isLight ? 'bg-slate-100' : 'bg-white/5'}`}>
        {GUIDE_PILLARS.map(p => {
          const isSelected = p.key === guideSelectedPillar;
          const isTabDisabled = p.key === 'Hour' && isHourUnknown;
          return (
            <button
              key={p.key}
              disabled={isTabDisabled}
              onClick={() => !isTabDisabled && setGuideSelectedPillar(p.key)}
              title={isTabDisabled ? (isKo ? '생시를 기입하지 않아 클릭할 수 없습니다.' : 'Time is unknown.') : undefined}
              className={`flex-1 min-w-max px-3 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 relative ${
                isTabDisabled
                  ? (isLight ? 'text-slate-300 bg-slate-100/50 cursor-not-allowed border border-dashed border-slate-200' : 'text-white/20 bg-white/5 cursor-not-allowed border border-dashed border-white/5')
                  : isSelected 
                    ? (isLight ? 'bg-blue-500 text-white shadow-md' : 'bg-[#6DABFF] text-white shadow-[0_4px_12px_rgba(109,171,255,0.4)]') 
                    : (isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-200' : 'text-white/60 hover:text-white hover:bg-white/10')
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span>{isKo ? p.ko : p.en}</span>
                <span className={`text-[10px] ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                  ({isTabDisabled ? (isKo ? '생시 미입력으로 클릭 불가' : 'Missing Time - Locked') : (isKo ? p.descKo : p.descEn)})
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="w-full relative mt-4">
        {isPillarUnknown ? (
          <div className="w-full flex items-center justify-center py-16 bg-black/20 rounded-2xl border border-white/5">
            <span className="text-white/45 text-sm font-medium font-sans">
              {isKo ? '생시를 기입하지 않아 분석할 수 없습니다.' : 'Provide an accurate time for analysis.'}
            </span>
          </div>
        ) : (
          <>
            {/* Animated Background fade effect per element color */}
            <div className="absolute inset-0 opacity-10 rounded-2xl pointer-events-none blur-3xl transition-colors duration-700" style={{ backgroundColor: hsColor }}></div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: 천간 */}
          <div className={`p-5 rounded-2xl shadow-md border ${isLight ? 'bg-[#fdfdfd] text-[#2d3748] border-slate-200' : 'bg-black/40 text-slate-200 border-white/10'}`}>
             <div className="flex items-center gap-2 mb-4">
               <span className={`font-bold text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>1. {isKo ? '천간 (의도와 지향점)' : 'Heavenly Stem (Intention)'}</span>
             </div>
             
             <div className="flex items-end gap-3 mb-4">
               <span className={`text-5xl font-serif leading-none ${isLight ? 'text-slate-800' : 'text-slate-100'}`} style={{ color: hsColor, textShadow: isLight ? '0 2px 10px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.8)' }}>{hs}</span>
               <span 
                 className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${isLight ? 'bg-white' : 'bg-black/60'}`}
                 style={{ color: getTenGodColor(hsTenGod.ko), borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
               >
                 {isKo ? hsTenGod.ko : hsTenGod.en}
               </span>
             </div>

             <div className={`flex gap-2 items-start mt-2 p-3 rounded-lg border ${isLight ? 'bg-blue-50/50 border-blue-100' : 'bg-blue-900/20 border-blue-800/30'}`}>
                <span className={`font-bold text-sm min-w-max ${isLight ? 'text-blue-500' : 'text-blue-400'}`}>{isKo ? '목표:' : 'Goal:'}</span>
                <span className={`text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{stemAction}</span>
             </div>
          </div>

          {/* Card 2: 통근여부 */}
          <div className={`p-5 rounded-2xl shadow-md border ${isLight ? 'bg-[#fdfdfd] text-[#2d3748] border-slate-200' : 'bg-black/40 text-slate-200 border-white/10'}`}>
             <div className="flex items-center gap-2 mb-4">
               <span className={`font-bold text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>2. {isKo ? '통근 여부 (현실 구현력)' : 'Rooting (Realization Power)'}</span>
             </div>
             
             <div className={`text-lg font-bold mb-2 flex flex-col gap-2`}>
               <span className={isLight ? 'text-amber-700' : 'text-amber-400'}>{isKo ? rootingTitleKo : rootingTitleEn}</span>
               {(pillarBranchClashed || pillarBranchPunished) && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {pillarBranchClashed && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${isLight ? 'bg-red-50 text-red-600 border-red-200' : 'bg-red-900/30 text-red-400 border-red-800/50'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        {isKo ? '충(衝) 발생: 지지 파괴' : 'Clash: Branch Destroyed'}
                      </span>
                    )}
                    {pillarBranchPunished && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${isLight ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-orange-900/30 text-orange-400 border-orange-800/50'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        {isKo ? '형살(刑殺) 발생: 압박 조율' : 'Punishment: Pressured Adjustment'}
                      </span>
                    )}
                  </div>
               )}
             </div>

             <p className={`text-sm leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
               {isKo ? rootingDescKo : rootingDescEn}
             </p>
          </div>
        </div>
        
        {/* Card 3: 지장간 가이드 */}
        <div className={`p-5 rounded-2xl shadow-md border mt-4 relative overflow-hidden ${isLight ? 'bg-[#f9fafb] text-[#2d3748] border-slate-200' : 'bg-[#111] text-slate-200 border-white/10'}`}>
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 text-[180px] font-serif opacity-50 pointer-events-none user-select-none ${isLight ? 'text-slate-100' : 'text-white/5'}`}>
            {branchChar}
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className={`font-bold text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>3. {isKo ? '지장간 실무 행동 가이드 (구체적 자원)' : 'Hidden Stems Action Guide (Practical Resources)'}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {branchMapping && branchMapping.hiddenStems && branchMapping.hiddenStems.map((stemChar, idx) => {
                 let phaseKo = idx === 0 ? '초기 (아이디어/기획)' : idx === 1 ? '중기 (상황별 비장무기)' : '정기 (가장 강력한 수단)';
                 let phaseEn = idx === 0 ? 'Initial (Idea/Plan)' : idx === 1 ? 'Middle (Secret Weapon)' : 'Main (Strongest Tool)';
                 if (branchMapping.hiddenStems.length === 2 && idx === 1) {
                    phaseKo = '정기 (가장 강력한 수단)';
                    phaseEn = 'Main (Strongest Tool)';
                 }

                 const subHsTenGod = getDetailedTenGod(dayMaster, stemChar);
                 const subColor = ELEMENT_COLORS[BAZI_MAPPING.stems[stemChar as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#333';
                 const subDesc = (TEN_GOD_DESC as any)[subHsTenGod.ko] || TEN_GOD_DESC['비견'];

                 return (
                   <div key={`${stemChar}-${idx}`} className={`border rounded-2xl p-4 shadow-sm flex flex-col transition-colors ${isLight ? 'bg-white text-slate-800 border-yellow-800/10 hover:border-blue-400/30' : 'bg-black/60 text-slate-200 border-white/10 hover:border-[#6DABFF]/50'}`}>
                     <div className={`flex items-center justify-between mb-3 border-b pb-2 gap-1 ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
                       <div className="flex items-center gap-1.5 shrink-0 min-w-0">
                         <span className="text-3xl font-serif leading-none" style={{ color: subColor }}>{stemChar}</span>
                         <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border whitespace-nowrap shrink-0 ${isLight ? 'bg-slate-50 text-slate-600' : 'bg-white/5 text-slate-300 border-white/10'}`}>
                           {isKo ? subHsTenGod.ko : subHsTenGod.en}
                         </span>
                       </div>
                       <span className={`text-[8.5px] sm:text-[9.5px] md:text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap shrink-0 ${isLight ? 'text-slate-500 bg-slate-100' : 'text-slate-400 bg-white/10'}`}>
                         {isKo ? phaseKo : phaseEn}
                       </span>
                     </div>

                     <div className="space-y-3.5 font-sans">
                        <div>
                          <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mr-1 ${isLight ? 'bg-[#6DABFF] text-white' : 'bg-blue-600 text-white'}`}>
                            {isKo ? '행동' : 'ACT'}
                          </span>
                          <span className={`text-sm font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>{isKo ? subDesc.actionKo : ((subDesc as any).actionEn || subDesc.actionKo)}</span>
                        </div>
                        
                        <div className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mr-1 ${isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-900/50 text-amber-200'}`}>
                            {isKo ? '전략' : 'STRAT'}
                          </span>
                          {(() => {
                            let rawKo = subDesc.strategyKo || '';
                            let rawEn = (subDesc as any).strategyEn || rawKo;
                            if (STEM_ATTRIBUTES[stemChar]) {
                              rawKo = rawKo.replace(/\[([^\]]+)\]/g, `[${STEM_ATTRIBUTES[stemChar].ko}]`);
                              rawEn = rawEn.replace(/\[([^\]]+)\]/g, `[${STEM_ATTRIBUTES[stemChar].en}]`);
                            }
                            return isKo ? rawKo : rawEn;
                          })()}
                        </div>

                        {idx === 0 && (
                          <div className="pt-1.5 border-t border-slate-100/50 dark:border-white/5">
                            <div className={`text-[10px] sm:text-xs p-2.5 rounded-lg border leading-relaxed ${isLight ? 'bg-red-50 text-red-800 border-red-100' : 'bg-red-950/30 text-red-200 border-red-900/50'}`}>
                              <span className={`font-bold mr-1 ${isLight ? 'text-red-600' : 'text-red-400'}`}>⚠️ {isKo ? '주의:' : 'Warn:'}</span> 
                              <span>{isKo ? subDesc.warningKo : ((subDesc as any).warningEn || subDesc.warningKo)}</span>
                            </div>
                          </div>
                        )}
                        {(idx === 1 && branchMapping.hiddenStems.length === 3) && (
                          <div className="pt-1.5 border-t border-slate-100/50 dark:border-white/5">
                            <div className={`text-[10px] sm:text-xs p-2.5 rounded-lg border leading-relaxed ${isLight ? 'bg-red-50 text-red-800 border-red-100' : 'bg-red-950/30 text-red-200 border-red-900/50'}`}>
                              <span className={`font-bold mr-1 ${isLight ? 'text-red-600' : 'text-red-400'}`}>⚠️ {isKo ? '주의:' : 'Warn:'}</span> 
                              <span>{isKo ? subDesc.warningKo : ((subDesc as any).warningEn || subDesc.warningKo)}</span>
                            </div>
                          </div>
                        )}
                     </div>
                   </div>
                 );
              })}
            </div>
          </div>
        </div>
        </>
      )}
      </div>
    </div>
  );
}
