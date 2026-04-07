import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Language, BaZiResult } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface GeJuHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: BaZiResult;
  lang: Language;
  colorizeAdvancedAnalysis: (text: string) => string;
}

export const GeJuHelpModal: React.FC<GeJuHelpModalProps> = ({ isOpen, onClose, result, lang, colorizeAdvancedAnalysis }) => {
  if (!isOpen || !result.analysis) return null;

  const dayMaster = result.pillars[1].stem;
  const monthBranch = result.pillars[2].branch;
  const monthBranchTenGodKo = result.pillars[2].branchKoreanName;
  const monthBranchTenGodEn = result.pillars[2].branchEnglishName;
  
  // Extract base Ten God (e.g., '편관' from '편관 (Warrior/Judge)')
  const baseTenGod = monthBranchTenGodKo.split(' ')[0];
  const baseTenGodEn = BAZI_MAPPING.tenGods[baseTenGod as keyof typeof BAZI_MAPPING.tenGods]?.en.replace('The ', '') || monthBranchTenGodEn.split('/')[0].trim();

  const strength = result.analysis.dayMasterStrength.level;
  const score = result.analysis.dayMasterStrength.score;
  const isStrong = score > 50;
  
  // Determine Johu (Seasonality)
  const spring = ['寅', '卯', '辰'];
  const summer = ['巳', '午', '未'];
  const autumn = ['申', '酉', '戌'];
  const winter = ['亥', '子', '丑'];
  
  let season = '';
  if (spring.includes(monthBranch)) season = 'spring';
  else if (summer.includes(monthBranch)) season = 'summer';
  else if (autumn.includes(monthBranch)) season = 'autumn';
  else if (winter.includes(monthBranch)) season = 'winter';

  // Mapping for Month Branch Ten God
  const tenGodMapping: Record<string, any> = {
    '비견': {
      roleKo: '나와 동등한 경쟁자 혹은 동료',
      roleEn: 'an equal competitor or colleague',
      personaKo: '자립심 강한 개척자',
      personaEn: 'Independent Pioneer',
      keywordKo: '당당한 자립',
      keywordEn: 'Confident Independence'
    },
    '겁재': {
      roleKo: '나와 동등한 경쟁자 혹은 동료',
      roleEn: 'an equal competitor or colleague',
      personaKo: '승부사, 야심가',
      personaEn: 'Competitor, Ambitious',
      keywordKo: '치열한 경쟁',
      keywordEn: 'Fierce Competition'
    },
    '식신': {
      roleKo: '무언가를 계속 만들어내야 하는 생산자',
      roleEn: 'a producer who must constantly create',
      personaKo: '전문가, 연구자, 장인',
      personaEn: 'Expert, Researcher, Artisan',
      keywordKo: '꾸준한 몰입',
      keywordEn: 'Steady Immersion'
    },
    '상관': {
      roleKo: '무언가를 계속 만들어내야 하는 생산자',
      roleEn: 'a producer who must constantly create',
      personaKo: '아이디어 뱅크, 개혁가, 예술가',
      personaEn: 'Idea Bank, Reformer, Artist',
      keywordKo: '톡톡 튀는 존재감',
      keywordEn: 'Sparkling Presence'
    },
    '편재': {
      roleKo: '결과물을 관리하고 책임지는 관리자',
      roleEn: 'a manager responsible for outcomes',
      personaKo: '사업가, 모험가, 스케일이 큰 리더',
      personaEn: 'Entrepreneur, Adventurer, Grand Leader',
      keywordKo: '넓은 무대',
      keywordEn: 'Broad Stage'
    },
    '정재': {
      roleKo: '결과물을 관리하고 책임지는 관리자',
      roleEn: 'a manager responsible for outcomes',
      personaKo: '치밀한 관리자, 신용가',
      personaEn: 'Meticulous Manager, Trustworthy',
      keywordKo: '정확한 계산',
      keywordEn: 'Accurate Calculation'
    },
    '편관': {
      roleKo: '규율에 순응해야 하는 조직원',
      roleEn: 'an organization member who must conform to discipline',
      personaKo: '전사, 해결사, 카리스마 리더',
      personaEn: 'Warrior, Troubleshooter, Charismatic Leader',
      keywordKo: '강한 카리스마',
      keywordEn: 'Strong Charisma'
    },
    '정관': {
      roleKo: '규율에 순응해야 하는 조직원',
      roleEn: 'an organization member who must conform to discipline',
      personaKo: '모범생, 원칙주의자, 공무원 타입',
      personaEn: 'Model Student, Principled, Official Type',
      keywordKo: '신뢰할 수 있는 사람',
      keywordEn: 'Trustworthy Person'
    },
    '편인': {
      roleKo: '지식을 전수받거나 보호받아야 할 대상',
      roleEn: 'a subject to receive knowledge or protection',
      personaKo: '신비주의자, 전략가, 특수 분야 전문가',
      personaEn: 'Mystic, Strategist, Special Field Expert',
      keywordKo: '비범한 통찰력',
      keywordEn: 'Extraordinary Insight'
    },
    '정인': {
      roleKo: '지식을 전수받거나 보호받아야 할 대상',
      roleEn: 'a subject to receive knowledge or protection',
      personaKo: '모범적인 학생, 계승자, 사랑받는 자',
      personaEn: 'Model Student, Successor, Beloved',
      keywordKo: '도와주고 싶은 사람',
      keywordEn: 'Someone to Help'
    }
  };

  const currentTenGod = tenGodMapping[baseTenGod] || tenGodMapping['정관'];

  // Strength text
  const strengthTextKo = isStrong 
    ? '사회의 요구에 당당히 맞서며 주도권을 잡으려 합니다. ("내가 이 판의 주인공이다.")'
    : '사회의 요구가 버거워 눈치를 보거나 시스템에 의존하려 합니다. ("나를 좀 도와달라.")';
  const strengthTextEn = isStrong
    ? 'Confidently faces societal demands and tries to take the initiative. ("I am the main character here.")'
    : 'Finds societal demands overwhelming and tends to rely on the system. ("Please help me.")';

  // Season text
  const seasonTextKo = (season === 'spring' || season === 'summer')
    ? '사회가 나에게 성장과 확장을 기대합니다. (활발함, 시작)'
    : '사회가 나에게 수확과 정리, 내실을 기대합니다. (냉철함, 완성)';
  const seasonTextEn = (season === 'spring' || season === 'summer')
    ? 'Society expects growth and expansion from you. (Activity, Beginning)'
    : 'Society expects harvest, organization, and substance from you. (Cool-headedness, Completion)';

  // Johu Graph Data
  // We'll create a simple temperature difference graph based on season and day master element
  const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
  const monthElement = BAZI_MAPPING.branches[monthBranch as keyof typeof BAZI_MAPPING.branches]?.element;
  
  // Element Colors mapping
  const ELEMENT_COLORS: Record<string, string> = {
    Wood: '#4ADE80',
    Fire: '#F87171',
    Earth: '#FACC15',
    Metal: '#E2E8F0',
    Water: '#60A5FA'
  };

  let socialTemp = 50; // 0 is cold, 100 is hot
  if (season === 'summer') socialTemp = 90;
  else if (season === 'spring') socialTemp = 60;
  else if (season === 'autumn') socialTemp = 40;
  else if (season === 'winter') socialTemp = 10;

  let innerTemp = 50;
  if (dmElement === 'Fire') innerTemp = 85;
  else if (dmElement === 'Wood') innerTemp = 65;
  else if (dmElement === 'Earth') innerTemp = 50;
  else if (dmElement === 'Metal') innerTemp = 35;
  else if (dmElement === 'Water') innerTemp = 15;

  const tempDiff = Math.abs(socialTemp - innerTemp);
  let tempDiffTextKo = '';
  let tempDiffTextEn = '';
  let subTextKo = '';
  let subTextEn = '';

  // Check for Overload Warning
  const isOverload = season === 'summer' && dmElement === 'Fire';
  
  // Check for Weapon (Yongshin)
  const yongshinElement = result.analysis.yongshinDetail?.primary?.element;
  let hasWeapon = false;
  if (tempDiff > 40) {
    if (socialTemp > 60 && innerTemp > 60 && yongshinElement === 'Water') hasWeapon = true;
    if (socialTemp < 40 && innerTemp < 40 && yongshinElement === 'Fire') hasWeapon = true;
  }

  if (isOverload) {
    tempDiffTextKo = "⚠️ 과부하 경고: 열기가 너무 강해 폭발할 위험이 있습니다. 냉정이 필요합니다.";
    tempDiffTextEn = "⚠️ Overload Warning: Heat is too intense, risk of explosion. Coolness is required.";
  } else if (hasWeapon) {
    tempDiffTextKo = "스트레스는 크지만 극복할 무기가 있습니다. 위기를 기회로 바꿉니다.";
    tempDiffTextEn = "Stress is high, but you have weapons to overcome it. Turn crisis into opportunity.";
  } else if (tempDiff > 40) {
    tempDiffTextKo = "사회적 요구와 내 본심이 정면충돌하여 스트레스가 높습니다.";
    tempDiffTextEn = "Societal demands and your true self clash head-on, resulting in high stress.";
  } else if (tempDiff < 20) {
    tempDiffTextKo = "사회적 역할과 나의 적성이 찰떡궁합입니다. 사회생활이 즐겁습니다.";
    tempDiffTextEn = "Your social role and aptitude are a perfect match. Social life is enjoyable.";
  } else {
    tempDiffTextKo = "사회적 요구와 내 본심이 적절한 균형을 이루고 있습니다.";
    tempDiffTextEn = "There is a proper balance between societal demands and your true self.";
  }

  subTextKo = "월지(세상)와 일간(나)의 온도차가 클수록, 당신은 세상을 살아가기 위해 더 많은 '배터리'를 소모하고 있습니다.";
  subTextEn = "The larger the temperature difference between the world (Month) and yourself (DM), the more 'battery' you consume to live in society.";

  const geJuName = result.analysis.structureDetail 
    ? (lang === 'KO' ? result.analysis.structureDetail.title : result.analysis.structureDetail.enTitle)
    : (lang === 'KO' ? result.analysis.geJu : (BAZI_MAPPING.geju[result.analysis.geJu as keyof typeof BAZI_MAPPING.geju]?.en || result.analysis.geJu));

  const geJuCategory = result.analysis.structureDetail 
    ? (result.analysis.structureDetail.category === 'Standard' ? (lang === 'KO' ? '내격' : 'Standard') : (lang === 'KO' ? '종격/전왕격' : 'Special'))
    : '';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0a0a0a] border border-neon-cyan/30 rounded-2xl shadow-[0_0_30px_rgba(0,255,255,0.15)] p-6 md:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-display font-bold text-neon-cyan tracking-wider">
              {lang === 'KO' ? '격국 심층 분석' : 'In-depth Structure Analysis'}
            </h3>
            <p className="text-neon-pink font-bold text-lg">
              📍 {geJuName} {geJuCategory && `(${geJuCategory})`}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-neon-cyan font-bold mb-2">
                {lang === 'KO' ? '[도움말: 환경이 나를 보는 시선]' : '[Help: How the Environment Sees Me]'}
              </h4>
              <p className="text-white/90 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(
                lang === 'KO' 
                  ? `"당신은 이 세상의 '${currentTenGod.personaKo}'(으)로 캐스팅되었습니다."`
                  : `"You have been cast as the '${currentTenGod.personaEn}' of this world."`
              )}} />
            </div>

            <div className="space-y-3 text-sm text-white/80 leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(
                lang === 'KO'
                  ? `<strong class="text-white">사회의 시선 (월지 ${baseTenGod}):</strong> 사회는 나를 <strong>'${currentTenGod.roleKo}'</strong>로 봅니다. 사람들은 당신을 보며 "${currentTenGod.keywordKo}"을 기대합니다.`
                  : `<strong class="text-white">Society's View (Month ${baseTenGodEn}):</strong> Society sees me as <strong>'${currentTenGod.roleEn}'</strong>. People expect "${currentTenGod.keywordEn}" from you.`
              )}} />
              
              <p dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(
                lang === 'KO'
                  ? `<strong class="text-white">나의 체감 (일간 강약):</strong> ${strengthTextKo}`
                  : `<strong class="text-white">My Experience (DM Strength):</strong> ${strengthTextEn}`
              )}} />

              <p dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(
                lang === 'KO'
                  ? `<strong class="text-white">계절감 (조후):</strong> ${seasonTextKo}`
                  : `<strong class="text-white">Seasonality (Johu):</strong> ${seasonTextEn}`
              )}} />
            </div>
          </div>

          {/* Johu Graph (Thermometer) */}
          <div className="pt-6 border-t border-white/10">
            <h4 className="text-neon-cyan font-bold mb-8 text-center">
              {lang === 'KO' ? '🌡️ 온도차 분석 (사회적 가면 vs 본연의 나)' : '🌡️ Temperature Difference (Social Mask vs True Self)'}
            </h4>
            
            <div className="relative w-full max-w-md mx-auto px-4 mb-12">
              <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] border border-white/20">
                
                {/* Social Temp Marker (Top) */}
                <div 
                  className="absolute top-0 -translate-y-full -translate-x-1/2 flex flex-col items-center pb-2 transition-all duration-700"
                  style={{ left: `${socialTemp}%` }}
                >
                  <span className="text-[10px] font-bold whitespace-nowrap mb-1 px-2 py-0.5 rounded bg-black/80 border border-white/20" style={{ color: monthElement ? ELEMENT_COLORS[monthElement] : '#fff' }}>
                    {lang === 'KO' ? '사회적 가면' : 'Social Mask'}
                  </span>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px]" style={{ borderTopColor: monthElement ? ELEMENT_COLORS[monthElement] : '#fff' }}></div>
                </div>

                {/* Inner Temp Marker (Bottom) */}
                <div 
                  className="absolute bottom-0 translate-y-full -translate-x-1/2 flex flex-col items-center pt-2 transition-all duration-700"
                  style={{ left: `${innerTemp}%` }}
                >
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px]" style={{ borderBottomColor: dmElement ? ELEMENT_COLORS[dmElement] : '#fff' }}></div>
                  <span className="text-[10px] font-bold whitespace-nowrap mt-1 px-2 py-0.5 rounded bg-black/80 border border-white/20" style={{ color: dmElement ? ELEMENT_COLORS[dmElement] : '#fff' }}>
                    {lang === 'KO' ? '본연의 나' : 'True Self'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-neon-pink mt-4 font-medium" dangerouslySetInnerHTML={{ __html: colorizeAdvancedAnalysis(
              lang === 'KO' ? tempDiffTextKo : tempDiffTextEn
            )}} />
            <p className="text-center text-[11px] text-white/40 mt-2 leading-relaxed max-w-sm mx-auto">
              {lang === 'KO' ? subTextKo : subTextEn}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
