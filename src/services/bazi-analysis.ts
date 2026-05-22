import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { Language } from '../types';
import { SPECIAL_STRUCTURE_DEFINITIONS } from '../constants/special-structures';
import { JIJANGAN } from '../constants/bazi-data';

const STEM_ELEMENTS: Record<string, string> = {
  '甲': 'Wood', '乙': 'Wood', '丙': 'Fire', '丁': 'Fire', '戊': 'Earth',
  '己': 'Earth', '庚': 'Metal', '辛': 'Metal', '壬': 'Water', '癸': 'Water'
};

const BRANCH_ELEMENTS: Record<string, string> = {
  '寅': 'Wood', '卯': 'Wood', '巳': 'Fire', '午': 'Fire', '辰': 'Earth',
  '戌': 'Earth', '丑': 'Earth', '未': 'Earth', '申': 'Metal', '酉': 'Metal',
  '亥': 'Water', '子': 'Water'
};

const ELEMENT_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

function getRelationship(dmElement: string, targetElement: string): string {
  const dmIdx = ELEMENT_CYCLE.indexOf(dmElement);
  const targetIdx = ELEMENT_CYCLE.indexOf(targetElement);
  const diff = (targetIdx - dmIdx + 5) % 5;
  
  const relationships = ['Self', 'Artist', 'Wealth', 'Power', 'Wisdom'];
  return relationships[diff];
}

// 1. 격국 (Structure/Pattern) - Refined based on Month Branch (월지) and Revelation (투출)
export const calculateGeJu = (dayGan: string, monthZhi: string, allStems: string[], allBranches: string[], elementScores: Record<string, number>, lang: Language, isTimeUnknown?: boolean): { geJu: string, isOverridden: boolean, originalGeJu: string } => {
  const hiddenStems = JIJANGAN[monthZhi]?.stems || [];
  
  // Stems to check for revelation (Hour, Month, Year - skip Hour if unknown)
  const externalStems = isTimeUnknown ? [allStems[2], allStems[3]] : [allStems[0], allStems[2], allStems[3]];
  
  // Find which hidden stems are revealed
  const revealedStems = hiddenStems.filter(s => externalStems.includes(s));
  
  // Priority: Main Qi (last) > others
  const mainQi = hiddenStems[hiddenStems.length - 1];
  let targetStem = mainQi;
  let isOverridden = false;
  let originalTargetStem = mainQi;
  
  const totalScore = Object.values(elementScores).reduce((a, b) => a + Math.max(0, b), 0) || 1;
  const mainQiElement = STEM_ELEMENTS[mainQi];
  const mainQiRatio = (elementScores[mainQiElement] / totalScore) * 100;
  
  if (revealedStems.length > 0) {
    if (revealedStems.includes(mainQi)) {
      targetStem = mainQi;
    } else {
      // If multiple non-main are revealed, take the first one found in JIJANGAN order
      targetStem = revealedStems[0];
      originalTargetStem = targetStem;
      
      const targetElement = STEM_ELEMENTS[targetStem];
      let adjustedTargetRatio = (elementScores[targetElement] / totalScore) * 100;
      let adjustedMainQiRatio = mainQiRatio;

      // [3] 조후 및 계절성 감쇄 로직 (The Season Filter)
      // 진월(Earth)의 계수(Water)는 땅에 흡수되는 기운이므로 주도권 감쇄
      if (mainQiElement === 'Earth' && targetElement === 'Water') {
        adjustedTargetRatio *= 0.4;
      }

      // [2] 지지 세력 가중치 (핵심 로직: 자형 및 합)
      // 지지에 월지와 동일한 글자가 2개 이상일 때 가중치 폭발
      const monthBranchCount = allBranches.filter(b => b === monthZhi).length;
      if (monthBranchCount >= 2) {
        adjustedMainQiRatio *= 1.5;
      }
      
      // Override logic: 실질적 세력(본기)이 투출된 기운보다 2배 이상 강할 경우 격국 강제 전환
      if (adjustedMainQiRatio > adjustedTargetRatio * 2) {
        targetStem = mainQi;
        isOverridden = true;
      }
    }
  }

  const stemsInfo: Record<string, { element: string, polarity: number }> = {
    '甲': { element: 'Wood', polarity: 1 }, '乙': { element: 'Wood', polarity: -1 },
    '丙': { element: 'Fire', polarity: 1 }, '丁': { element: 'Fire', polarity: -1 },
    '戊': { element: 'Earth', polarity: 1 }, '己': { element: 'Earth', polarity: -1 },
    '庚': { element: 'Metal', polarity: 1 }, '辛': { element: 'Metal', polarity: -1 },
    '壬': { element: 'Water', polarity: 1 }, '癸': { element: 'Water', polarity: -1 }
  };

  const self = stemsInfo[dayGan];
  const target = stemsInfo[targetStem];
  const originalTarget = stemsInfo[originalTargetStem];
  
  const getGeJuName = (t: { element: string, polarity: number }) => {
    if (!self || !t) {
      const info = BAZI_MAPPING.geju['건록' as keyof typeof BAZI_MAPPING.geju];
      return lang === 'KO' ? info.ko : info.en;
    }

    const sIdx = ELEMENT_CYCLE.indexOf(self.element);
    const tIdx = ELEMENT_CYCLE.indexOf(t.element);
    const diff = (tIdx - sIdx + 5) % 5;
    const samePolarity = self.polarity === t.polarity;

    let tenGod = '';
    if (diff === 0) tenGod = samePolarity ? '비견' : '겁재';
    else if (diff === 1) tenGod = samePolarity ? '식신' : '상관';
    else if (diff === 2) tenGod = samePolarity ? '편재' : '정재';
    else if (diff === 3) tenGod = samePolarity ? '편관' : '정관';
    else if (diff === 4) tenGod = samePolarity ? '편인' : '정인';

    // Special handling for Geon-rok and Yang-in (only if based on Month Branch relationship)
    if (t === stemsInfo[mainQi] || revealedStems.length === 0) {
      const monthBranchElement = BRANCH_ELEMENTS[monthZhi];
      const monthBranchPolarity = ['寅', '辰', '巳', '申', '戌', '亥'].includes(monthZhi) ? 1 : -1;
      
      if (self.element === monthBranchElement) {
        if (self.polarity === monthBranchPolarity) {
          const info = BAZI_MAPPING.geju['건록' as keyof typeof BAZI_MAPPING.geju];
          return lang === 'KO' ? info.ko : info.en;
        } else {
          if (self.polarity === 1) {
            const info = BAZI_MAPPING.geju['양인' as keyof typeof BAZI_MAPPING.geju];
            return lang === 'KO' ? info.ko : info.en;
          }
        }
      }
    }

    const info = BAZI_MAPPING.geju[tenGod as keyof typeof BAZI_MAPPING.geju];
    if (!info) return tenGod;
    return lang === 'KO' ? info.ko : info.en;
  };

  return {
    geJu: getGeJuName(target),
    isOverridden,
    originalGeJu: getGeJuName(originalTarget)
  };
};

/**
 * Determine the final structure (Ge-Ju), including Special Structures (Jong-gyeok).
 */
export const determineStructure = (
  dayGan: string,
  pillars: any[],
  strength: any,
  tenGodsRatio: Record<string, number>,
  lang: Language,
  isTimeUnknown?: boolean
) => {
  const dmElement = STEM_ELEMENTS[dayGan];
  const isYangGan = ['甲', '丙', '戊', '庚', '壬'].includes(dayGan);
  const branches = pillars.map(p => p.branch);
  const stems = pillars.map(p => p.stem);
  const monthZhi = branches[2]; // 월지
  
  let logicNote = "";
  let structureKey = "";

  // 1. Check for Jeon-wang-gyeok (Monarch Alignment)
  // Use strength.elementScores for more accurate ratio detection
  const elementScores: Record<string, number> = strength.elementScores || {};
  const totalScore = Object.values(elementScores).reduce((a, b) => a + Math.max(0, b), 0) || 1;
  const dmElementRatio = (elementScores[dmElement] / totalScore) * 100;

  // 1.5 Check for Frozen Chart (Jo-hu Priority)
  const waterRatio = (elementScores['Water'] / totalScore) * 100;
  const metalRatio = (elementScores['Metal'] / totalScore) * 100;
  const isFrozen = (waterRatio + metalRatio > 50) && ['丑', '子', '亥'].includes(monthZhi);

  if (dmElementRatio > 70 && strength.score > 75) {
    const monarchMap: Record<string, string> = {
      'Wood': '곡직격', 'Fire': '염상격', 'Earth': '가색격', 'Metal': '종혁격', 'Water': '윤하격'
    };
    
    // Guardrail: Check for clashing/controlling elements in stems (Purity check)
    const externalStems = isTimeUnknown ? [stems[2], stems[3]] : [stems[0], stems[2], stems[3]]; // Year, Month, Hour (Skip Hour if unknown)
    let isPure = true;
    
    externalStems.forEach(s => {
      const el = STEM_ELEMENTS[s];
      const rel = getRelationship(dmElement, el);
      // Monarch structures hate Power (Clash) and Wealth (Drain/Conflict)
      if (rel === 'Power' || rel === 'Wealth') {
        isPure = false;
      }
    });

    if (isPure) {
      structureKey = monarchMap[dmElement];
      logicNote = lang === 'KO' 
        ? `일간의 오행(${dmElement})이 사주 전체에서 압도적인 세력을 형성하고, 이를 방해하는 기운(재성/관성)이 천간에 드러나지 않아 해당 기운으로 모든 것이 집중된 전왕격으로 판정됐어.`
        : `The Day Master's element (${dmElement}) forms an overwhelming force, and with no interfering elements (Wealth/Power) revealed in the stems, it is judged as a Monarch Alignment.`;
    }
  }

  // 1.7 Check for Jong-gang-gyeok (Resource Dominant - Follow the Strong)
  if (!structureKey && strength.score > 75) {
    const dmIdx = ELEMENT_CYCLE.indexOf(dmElement);
    const resourceElement = ELEMENT_CYCLE[(dmIdx + 4) % 5];
    const resourceRatio = (elementScores[resourceElement] / totalScore) * 100;
    
    if (resourceRatio > 70) {
      // Purity check for Jong-gang-gyeok
      const externalStems = [stems[0], stems[2], stems[3]];
      let isPure = true;
      externalStems.forEach(s => {
        const el = STEM_ELEMENTS[s];
        const rel = getRelationship(dmElement, el);
        // Follow Resource (Jong-gang) hates Wealth (destroys Resource) and Artist (drains Resource)
        if (rel === 'Wealth' || rel === 'Artist') {
          isPure = false;
        }
      });

      if (isPure) {
        structureKey = "종강격";
        logicNote = lang === 'KO'
          ? `나를 생하는 인성(${resourceElement})의 기운이 사주 전체를 지배하고, 이를 파괴하는 재성이 천간에 없어 인성의 기운에 순응하는 종강격으로 판정됐어.`
          : `Judged as Jong-gang-gyeok because Resource (${resourceElement}) energy dominates the chart and no Wealth elements are present in the stems to destroy it.`;
      }
    }
  }

  // 2. Check for Jong-gyeok (Adaptive Alignment)
  if (!structureKey && strength.score < 20) {
    let canBeJong = true;
    let guardrailNote = "";

    // Guardrail 1: Resource Protection (인성 보호)
    const hasResourceRoot = branches.some(b => {
      const rel = getRelationship(dmElement, BRANCH_ELEMENTS[b]);
      return rel === 'Wisdom';
    });
    const hasResourceSupport = [stems[0], stems[2]].some(s => { // 월간, 시간
      const rel = getRelationship(dmElement, STEM_ELEMENTS[s]);
      return rel === 'Wisdom';
    });

    if (hasResourceRoot || hasResourceSupport) {
      canBeJong = false;
      guardrailNote = lang === 'KO' 
        ? "지지에 인성의 뿌리가 있거나 월간/시간의 인성이 일간을 돕고 있어 종격이 아닌 내격(극약)으로 유지돼."
        : "Maintained as Standard Alignment (Extreme Weak) because of Resource roots in branches or support from Month/Hour stems.";
    }

    // Guardrail 2: Bi-geop Root (비겁 뿌리)
    // Simplified: Check if any branch is the same element as DM
    const hasBiGeopRoot = branches.some(b => {
      const rel = getRelationship(dmElement, BRANCH_ELEMENTS[b]);
      return rel === 'Self';
    });

    if (canBeJong && hasBiGeopRoot) {
      canBeJong = false;
      guardrailNote = lang === 'KO'
        ? "지지에 일간의 뿌리(비겁)가 존재하여 종격으로 흐르지 않고 내격으로 남게 돼."
        : "Remains a Standard Alignment because a Bi-geop root exists in the branches.";
    }

    // Guardrail 3: Yang Stem Strictness (양간의 특성)
    if (canBeJong && isYangGan && strength.score > 12) {
      canBeJong = false;
      guardrailNote = lang === 'KO'
        ? "양간(Yang Stem)은 쉽게 종하지 않는 특성이 있어, 현재 점수(12점 초과)로는 내격으로 판정해."
        : "Yang Stems do not easily adapt; since the score is above 12, it is judged as a Standard Alignment.";
    }

    if (canBeJong) {
      // Determine which Jong-gyeok
      const ratios = tenGodsRatio;
      // Get the highest ratio among non-Self/Wisdom
      const categories = [
        { key: '종아격', ratio: ratios['식상(Artist/Rebel)'] || ratios['Artist/Rebel'] || 0 },
        { key: '종재격', ratio: ratios['재성(Maverick/Architect)'] || ratios['Maverick/Architect'] || 0 },
        { key: '종살격', ratio: ratios['관성(Warrior/Judge)'] || ratios['Warrior/Judge'] || 0 },
        { key: '종왕격', ratio: ratios['비겁(Mirror/Rival)'] || ratios['Mirror/Rival'] || 0 }
      ];
      categories.sort((a, b) => b.ratio - a.ratio);
      structureKey = categories[0].key;
      logicNote = lang === 'KO'
        ? `일간이 극히 약하고 뿌리가 없어 가장 강한 세력인 [${structureKey}]에 순응하는 종격으로 판정됐어.`
        : `Judged as an Adaptive Alignment (Jong-gyeok) following the strongest force [${structureKey}] due to an extremely weak Day Master with no roots.`;
    } else {
      logicNote = guardrailNote;
    }
  }

  // 3. Standard Structure (Nae-gyeok)
  if (!structureKey) {
    const geJuResult = calculateGeJu(dayGan, monthZhi, stems, branches, elementScores, lang);
    const standardGeJu = geJuResult.geJu;
    
    if (!logicNote) {
      if (geJuResult.isOverridden) {
        const hiddenStems = JIJANGAN[monthZhi]?.stems || [];
        const mainQi = hiddenStems[hiddenStems.length - 1];
        const mainQiElement = STEM_ELEMENTS[mainQi];
        const elementKoMap: Record<string, string> = { Wood: '목(木)', Fire: '화(火)', Earth: '토(土)', Metal: '금(金)', Water: '수(水)' };
        const translatedMainQiElement = lang === 'KO' ? elementKoMap[mainQiElement] || mainQiElement : mainQiElement;

        logicNote = lang === 'KO'
          ? `기계적으로는 천간에 투출한 기운을 따라 '${geJuResult.originalGeJu}'으로 볼 수 있으나, 지지의 세력(${translatedMainQiElement})이 압도적으로 강해 본질적인 기운인 '${standardGeJu}'으로 재판정했어. 투출의 함정을 보정한 결과야.`
          : `Mechanically, it could be seen as '${geJuResult.originalGeJu}' based on the revealed stem, but the earthly branch power (${translatedMainQiElement}) is overwhelmingly strong, so it was re-evaluated as '${standardGeJu}'. This corrects the 'trap of revelation'.`;
      } else {
        logicNote = lang === 'KO'
          ? "전통적인 월지 지장간 투출 원리에 따른 내격 구조야."
          : "A standard alignment structure based on the traditional principle of Month Branch hidden stems.";
      }
    }
    
    // For marketing tone of "Extreme Weak Nae-gyeok"
    let marketingMessage = "";
    let enMarketingMessage = "";
    
    if (geJuResult.isOverridden && standardGeJu.includes('편인') && geJuResult.originalGeJu.includes('상관')) {
      marketingMessage = "숨겨진 조율자: 겉으로는 파격적인 아이디어(상관)를 내뿜는 듯 보이지만, 사실은 그 이면에 수만 번의 검열과 깊은 생각(편인)이 자리 잡고 있어. 상관은 주인공이 아니라, 폭주하는 기운을 제어하는 날카로운 조절자 역할을 할 뿐이야.";
      enMarketingMessage = "Hidden Coordinator: Outwardly, you seem to emit unconventional ideas (Artist), but in reality, tens of thousands of censorships and deep thoughts (Mystic) reside behind it. The Artist is not the protagonist, but merely a sharp regulator controlling runaway energy.";
    } else if (isFrozen) {
      marketingMessage = "냉철한 잠재력: 차갑고 습한 기운 속에 보석 같은 재능을 품고 있어. 따뜻한 온기(火)를 통해 그 재능을 꽃피우는 것이 삶의 중요한 과제야.";
      enMarketingMessage = "Cool Potential: You hold gem-like talents within cold and damp energy. Blooming those talents through warmth (Fire) is an important life task.";
      logicNote = lang === 'KO'
        ? "조후가 매우 차갑고 습한 '동결된 사주'야. 일반적인 관인상생보다 '해동(解凍)'이 최우선 과제인 특수 상황으로 판정됐어."
        : "A 'Frozen Chart' that is extremely cold and wet. Thawing (Jo-hu resolution) is the top priority, overriding standard structural flows.";
    } else if (strength.score < 35) {
      const jaeRatio = tenGodsRatio['재성(Maverick/Architect)'] || tenGodsRatio['Maverick/Architect'] || 0;
      if (jaeRatio > 40) {
        marketingMessage = lang === 'KO' ? "재다신약의 지혜: 주변에 기회와 재물은 넘치나 내 몸이 감당하기 버거운 형국이야. 욕심을 줄이고 사람들과 나누며 건강을 챙기는 것이 최고의 개운법이야." : "Wisdom of Wealth-Heavy Weak: Opportunities and wealth overflow around you, but it's overwhelming for your strength. Reducing greed, sharing with others, and taking care of health is the best remedy.";
        enMarketingMessage = "Wisdom of Wealth-Heavy Weak: Opportunities and wealth overflow around you, but it's overwhelming for your strength. Reducing greed, sharing with others, and taking care of health is the best remedy.";
        logicNote = lang === 'KO' ? "일간이 약한 상태에서 재성(Wealth)의 기운이 40%를 초과하여 '재다신약(財多身弱)' 구조로 판정됐어." : "Judged as 'Jae-da-shin-yak' (Wealth-Heavy Weak) because Wealth energy exceeds 40% while the Day Master is weak.";
      } else {
        marketingMessage = "위기를 돌파하는 전문성: 극한의 상황에서도 자신을 지켜내는 독보적인 전문 기술과 끈기를 가졌어.";
        enMarketingMessage = "Expertise that breaks through crises: Possesses unique technical skills and persistence to protect oneself even in extreme situations.";
      }
    }

    return {
      title: standardGeJu,
      enTitle: standardGeJu, // Simplified for now
      category: "Standard",
      description: "",
      enDescription: "",
      marketingMessage,
      enMarketingMessage,
      logicNote
    };
  }

  const info = SPECIAL_STRUCTURE_DEFINITIONS[structureKey];
  return {
    ...info,
    logicNote
  };
};

// 2. 십성비율 (Ten Gods Ratio)
export const calculateTenGodsRatio = (pillars: any[], lang: Language, isTimeUnknown?: boolean) => {
  const counts: Record<string, number> = {
    'Mirror/Rival': 0,
    'Artist/Rebel': 0,
    'Maverick/Architect': 0,
    'Warrior/Judge': 0,
    'Mystic/Sage': 0
  };

  let total = 0;

  pillars.forEach((p, idx) => {
    if (isTimeUnknown && idx === 0) return; // Skip unknown hour
    const stemGod = p.stemKoreanName;
    const branchGod = p.branchKoreanName;

    const mapGod = (god: string) => {
      if (god.includes('비견') || god.includes('겁재')) return 'Mirror/Rival';
      if (god.includes('일간')) return null; // Exclude Day Master itself from the ratio for Mu-Ja-Ron detection
      if (god.includes('식신') || god.includes('상관')) return 'Artist/Rebel';
      if (god.includes('편재') || god.includes('정재')) return 'Maverick/Architect';
      if (god.includes('편관') || god.includes('정관')) return 'Warrior/Judge';
      if (god.includes('편인') || god.includes('정인')) return 'Mystic/Sage';
      return null;
    };

    const sGroup = mapGod(stemGod);
    const bGroup = mapGod(branchGod);

    if (sGroup) { counts[sGroup]++; total++; }
    if (bGroup) { counts[bGroup]++; total++; }
  });

  const ratio: Record<string, number> = {};
  for (const key in counts) {
    let displayKey = key;
    if (lang === 'KO') {
      if (key === 'Mirror/Rival') displayKey = '비겁(Mirror/Rival)';
      if (key === 'Artist/Rebel') displayKey = '식상(Artist/Rebel)';
      if (key === 'Maverick/Architect') displayKey = '재성(Maverick/Architect)';
      if (key === 'Warrior/Judge') displayKey = '관성(Warrior/Judge)';
      if (key === 'Mystic/Sage') displayKey = '인성(Mystic/Sage)';
    }
    ratio[displayKey] = total > 0 ? Math.round((counts[key] / total) * 100) : 0;
  }

  return ratio;
};

export const detectSpecialPatterns = (
  stems: string[],
  branches: string[],
  lang: string,
  elementRatios: Record<string, number> = {},
  strength: any = {},
  isTimeUnknown?: boolean
) => {
  const patterns: { 
    code: string; 
    name: string; 
    rarity: string; 
    effect: string; 
    enName: string; 
    enEffect: string;
    isNoble?: boolean;
    efficiency?: number;
    logicDetails?: string[];
    logicDetailsEn?: string[];
    tooltipText?: string;
    tooltipTextEn?: string;
  }[] = [];

  if (stems.length !== 4 || branches.length !== 4 || isTimeUnknown) return patterns;

  // 천원일기격 (天元一氣) / 천지동도격
  if (stems.every(s => s === stems[0])) {
    const isJiWon = branches.every(b => b === branches[0]);
    if (isJiWon) {
      patterns.push({
        code: "cheon_ji_dong_do",
        name: "천지동도격(天地同道格)",
        rarity: "LEGEND",
        effect: "하늘과 땅의 기운이 완벽히 일치하여 평범함을 거부하는 독보적인 삶의 궤적을 그립니다.",
        enName: "Heaven-Earth Integration (Cheon-Ji-Dong-Do)",
        enEffect: "Heaven and earth energies are perfectly aligned, creating an unmatched and absolute life trajectory."
      });
    } else {
      patterns.push({
        code: "cheon_won_il_gi",
        name: "천원일기격(天元一氣格)",
        rarity: "SSR",
        effect: `천간의 기운이 ${stems[0]}으로 통일되어 타협 없는 고집과 강력한 추진력이 극대화됩니다.`,
        enName: "Single Heavenly Energy (Cheon-Won-Il-Gi)",
        enEffect: `The heavenly stems are unified with ${stems[0]}, maximizing uncompromising stubbornness and intense driving force.`
      });
    }
  } else if (branches.every(b => b === branches[0])) {
    patterns.push({
      code: "ji_won_il_gi",
      name: "지원일기격(地元一氣格)",
      rarity: "SSR",
      effect: `지지가 모두 ${branches[0]}로 통일되어 환경적 고집과 한 가지 분야의 압도적인 장인 정신이 강화됩니다.`,
      enName: "Single Earthly Energy (Ji-Won-Il-Gi)",
      enEffect: `The earthly branches are unified with ${branches[0]}, enhancing environmental persistence and overwhelming craftsmanship in one field.`
    });
  }

  // 양간지지격
  const uniqueStems = [...new Set(stems)];
  const uniqueBranches = [...new Set(branches)];
  if (uniqueStems.length === 2 && stems.filter(s => s === uniqueStems[0]).length === 2 &&
      uniqueBranches.length === 2 && branches.filter(b => b === uniqueBranches[0]).length === 2) {
    patterns.push({
      code: "yang_gan_ji_ji",
      name: "양간지지격(兩干支格)",
      rarity: "SR",
      effect: "삶의 이중성을 이해하고, 두 가지의 전문 분야를 동시에 능숙하게 다루는 탁월한 재능이 돋보입니다.",
      enName: "Dual Pillar Resonance",
      enEffect: "Provides an exceptional ability to handle two distinct domains simultaneously, balancing the dualities of life."
    });
  }

  // 천지덕합
  const hasStemComb = (s1: string, s2: string) => {
    const sArray = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const idx1 = sArray.indexOf(s1);
    const idx2 = sArray.indexOf(s2);
    if (idx1 === -1 || idx2 === -1) return false;
    return Math.abs(idx1 - idx2) === 5;
  };
  
  const hasBranchComb = (b1: string, b2: string) => {
    const bArray = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const idx1 = bArray.indexOf(b1);
    const idx2 = bArray.indexOf(b2);
    if (idx1 === -1 || idx2 === -1) return false;
    const sum = idx1 + idx2;
    return sum === 1 || sum === 13;
  };

  const isYearMonthComb = hasStemComb(stems[0], stems[1]) && hasBranchComb(branches[0], branches[1]);
  const isMonthDayComb = hasStemComb(stems[1], stems[2]) && hasBranchComb(branches[1], branches[2]);
  const isDayHourComb = hasStemComb(stems[2], stems[3]) && hasBranchComb(branches[2], branches[3]);

  if (isYearMonthComb || isMonthDayComb || isDayHourComb) {
    patterns.push({
      code: "cheon_ji_deok_hap",
      name: "천지덕합격(天地德合格)",
      rarity: "SR",
      effect: "천간합과 지지합이 일치하여 대인관계의 완벽한 조화, 강력한 귀인의 조력, 매력과 사교성이 빛납니다.",
      enName: "Heaven-Earth Virtuous Harmony",
      enEffect: "Provides perfect harmony in personal relationships, assistance from noble benefactors, and overwhelming charm and sociability."
    });
  }

  // --- 귀격 및 특수 케이스 고도화 추가 (수보양광, 목화통명, 벽갑인화, 등라계갑) ---
  const dayMaster = stems[1]; // 일간
  const monthZhi = branches[2]; // 월지
  
  const fireRatio = elementRatios['Fire'] || 0;
  const earthRatio = elementRatios['Earth'] || 0;
  const waterRatio = elementRatios['Water'] || 0;
  const metalRatio = elementRatios['Metal'] || 0;
  const woodRatio = elementRatios['Wood'] || 0;
  const strengthScore = strength?.score || 50;

  // 1. 수보양광 (水輔陽光)
  // 일간이 병화(丙)이거나 임수(壬)여야 하고, 상대 글자가 바로 옆(시간 stems[0] 또는 월간 stems[2])에 인접해야 함
  const isSuboYanggwangAdjacent = (stems[1] === '丙' && (stems[0] === '壬' || stems[2] === '壬')) ||
                                  (stems[1] === '壬' && (stems[0] === '丙' || stems[2] === '丙'));

  if (isSuboYanggwangAdjacent) {
    let efficiency = 100;
    const logicDetails: string[] = [];
    const logicDetailsEn: string[] = [];

    // 조후 과열 검증 (Fire+Earth 비율이 지나치게 강해 물이 증발할 우려)
    const fireEarthSum = fireRatio + earthRatio;
    if (fireEarthSum >= 55) {
      efficiency -= 25;
      logicDetails.push("조후 과열 요인(-25%): 원국에 화토(火土) 기운이 과도하여 강물(壬)이 건조해질 우려가 있어 명예의 지속성이 다소 약화됩니다.");
      logicDetailsEn.push("Overheated Climate (-25%): Strong Fire/Earth energy dries up the river water (Im), slightly weakening the stability of prestige.");
    }

    // 조후 한랭 검증 (Water+Metal이 지나치게 한랭하고 겨울 월인 경우)
    const waterMetalSum = waterRatio + metalRatio;
    const isColdMonth = ['亥', '子', '丑'].includes(monthZhi);
    if (waterMetalSum >= 55 && isColdMonth) {
      efficiency -= 25;
      logicDetails.push("조후 동결 요인(-25%): 겨울철 냉랭한 물과 금의 기운으로 동결되어, 병화(太陽)의 따뜻함이 만물에 전달되는 효율이 다소 막힙니다.");
      logicDetailsEn.push("Frozen Slate (-25%): Extremely cold winter water/metal chills the sun (Byeong), limiting its ability to nurture the surroundings.");
    }

    // 천간 병임충(丙壬沖) 검증 (둘이 인접해 있는 상태이므로 항상 참)
    efficiency -= 20;
    logicDetails.push("천간 병임충(丙壬沖) 영향(-20%): 병화와 임수가 주체인 일간 옆에서 격렬히 충돌하여 삶의 다이내믹한 굴곡과 예기치 못한 도발적 기회가 상존합니다.");
    logicDetailsEn.push("Stem Clash Interference (-20%): Directly adjacent Byeong-Im clash brings dramatic life changes and sudden breakthrough points.");

    // 지지 충극 검증 (사해충, 자오충)
    if (branches.includes('巳') && branches.includes('亥')) {
      efficiency -= 15;
      logicDetails.push("사해충(巳亥沖) 영향(-15%): 지지에서 병화와 임수의 주 뿌리가 정면 충돌하여 기반이 다소 불안정해집니다.");
      logicDetailsEn.push("Sa-Hae Branch Clash (-15%): Major roots of Fire and Water directly collide, destabilizing the architectural foundation.");
    }
    if (branches.includes('子') && branches.includes('午')) {
      efficiency -= 15;
      logicDetails.push("자오충(子午沖) 영향(-15%): 지지의 강력한 물과 불의 충돌로 조화가 일부 훼손됩니다.");
      logicDetailsEn.push("Ja-Oh Branch Clash (-15%): Severe sub-surface Fire-Water crash partially diminishes internal harmony.");
    }

    efficiency = Math.max(30, efficiency); // 최소 30% 보장

    patterns.push({
      code: "subo_yanggwang",
      name: "수보양광(水輔陽光)",
      rarity: "SSR",
      effect: "태양이 맑은 강물을 비춰 함께 눈부시게 빛납니다. 명예와 지위, 사회적 권위가 빛나고 타인에게 찬사를 한몸에 얻는 명예의 귀격입니다.",
      enName: "Solar-River Radiance (Subo-Yanggwang)",
      enEffect: "The sun radiates over crisp, clean river waters. Endows great social prestige, high office, and brilliant popular appeal.",
      isNoble: true,
      efficiency,
      logicDetails,
      logicDetailsEn,
      tooltipText: "태양(丙)과 강물(壬)이 조화를 이루어 서로의 존재감을 무한히 밝혀주는 명품 격국입니다. 대중적 명성과 사회적 권위를 상징합니다.",
      tooltipTextEn: "The union of Sun (Byeong) and Infinite Water (Im), magnifying each other's beauty. Denotes eminent renown and noble social status."
    });
  }

  // 2. 목화통명 (木火通明)
  // 일간이 목(甲, 乙)이면서 인접한 천간(시간 stems[0] 또는 월간 stems[2])에 화(丙, 丁)가 뜨거나 주위 지지(시간, 일지, 월지)에 강력한 화(巳, 午)가 박혀야 함 (또는 반대)
  let isMokhwaAdjacent = false;
  if (['甲', '乙'].includes(dayMaster)) {
    const hasAdjacentFireStem = ['丙', '丁'].includes(stems[0]) || ['丙', '丁'].includes(stems[2]);
    const hasNearbyFireBranch = ['巳', '午'].includes(branches[0]) || ['巳', '午'].includes(branches[1]) || ['巳', '午'].includes(branches[2]);
    if (hasAdjacentFireStem || hasNearbyFireBranch) {
      isMokhwaAdjacent = true;
    }
  } else if (['丙', '丁'].includes(dayMaster)) {
    const hasAdjacentWoodStem = ['甲', '乙'].includes(stems[0]) || ['甲', '乙'].includes(stems[2]);
    const hasNearbyWoodBranch = ['寅', '卯'].includes(branches[0]) || ['寅', '卯'].includes(branches[1]) || ['寅', '卯'].includes(branches[2]);
    if (hasAdjacentWoodStem || hasNearbyWoodBranch) {
      isMokhwaAdjacent = true;
    }
  }

  const woodFireSum = woodRatio + fireRatio;

  if (isMokhwaAdjacent && woodFireSum >= 45) {
    let efficiency = 100;
    const logicDetails: string[] = [];
    const logicDetailsEn: string[] = [];

    // 동결 상태 검증 (겨울철 지독히 차가운 경우 나무가 얼어 불을 지피기 힘듬)
    const isWinter = ['亥', '子', '丑'].includes(monthZhi);
    if (isWinter && waterRatio >= 30 && fireRatio < 15) {
      efficiency -= 30;
      logicDetails.push("동결된 땔감인자(-30%): 겨울철 얼어붙은 수기운(水)이 화기를 억누르고 나무를 젖게 만들어, 불길이 활발히 타오르기 어렵습니다.");
      logicDetailsEn.push("Frozen Wood (-30%): Cold winter water dampens the wood and suppresses heat, preventing the flame from shining widely.");
    }

    // 강력한 금극목 충돌로 나무 밑둉이 망가짐 (인신충, 묘유충)
    const hasInShinClash = branches.includes('寅') && branches.includes('申');
    const hasMyoYuClash = branches.includes('卯') && branches.includes('酉');
    if ((hasInShinClash || hasMyoYuClash) && metalRatio >= 25) {
      efficiency -= 20;
      logicDetails.push("금극목 충돌 위협(-20%): 지지 금기운의 도끼질로 인해 나무 뿌리가 훼손되어 지식의 안정적인 유통과 계승에 차질이 생깁니다.");
      logicDetailsEn.push("Metal-Wood Fracture (-20%): Earthly metal clashes shear the wood's vital core, disrupting consistent intellectual focus.");
    }

    efficiency = Math.max(30, efficiency);

    patterns.push({
      code: "mokhwa_tongmyeong",
      name: "목화통명(木火通明)",
      rarity: "SSR",
      effect: "나무가 아낌없이 타올라 어둠을 깊은 슬기로 밝힙니다. 깊은 학문 연구, 언론, 지식전달 등 지혜와 명성을 지배하는 총명한 두뇌의 귀격입니다.",
      enName: "Wood-Fire Brilliancy (Mokhwa-Tongmyeong)",
      enEffect: "Wood transforms into pure, illuminating Fire. Represents high intellect, brilliant wisdom, and sublime academic or artistic success.",
      isNoble: true,
      efficiency,
      logicDetails,
      logicDetailsEn,
      tooltipText: "초목이 따사로운 불길을 만나 자신의 지혜와 재능을 세상만방에 널리 퍼트리는 귀격입니다. 지적 탁월함, 언론, 강단에서의 명망을 상징합니다.",
      tooltipTextEn: "Benevolent wood fueling an eternal light. Symbolizes academic genius, clarity of speech, and high reputation through intellectual work."
    });
  }

  // 3. 벽갑인화 (劈甲引火)
  // 일간이 甲, 丁, 庚 중 하나여야 하고, 나머지 두 핵심 성분이 원국에 있어야 하며 최소한 하나 이상이 일간 옆 천간에 인접해야 함
  let isByeokGapFormed = false;
  if (dayMaster === '甲') {
    const isAdjacentToGyeongOrJeong = ['庚', '丁'].includes(stems[0]) || ['庚', '丁'].includes(stems[2]);
    const hasGyeong = stems.includes('庚') || branches.includes('申');
    const hasJeong = stems.includes('丁') || branches.includes('午') || branches.includes('巳');
    if (isAdjacentToGyeongOrJeong && hasGyeong && hasJeong) {
      isByeokGapFormed = true;
    }
  } else if (dayMaster === '丁') {
    const isAdjacentToGyeongOrGap = ['庚', '甲'].includes(stems[0]) || ['庚', '甲'].includes(stems[2]);
    const hasGyeong = stems.includes('庚') || branches.includes('申');
    const hasGap = stems.includes('甲') || branches.includes('寅');
    if (isAdjacentToGyeongOrGap && hasGyeong && hasGap) {
      isByeokGapFormed = true;
    }
  } else if (dayMaster === '庚') {
    const isAdjacentToGapOrJeong = ['甲', '丁'].includes(stems[0]) || ['甲', '丁'].includes(stems[2]);
    const hasGap = stems.includes('甲') || branches.includes('寅');
    const hasJeong = stems.includes('丁') || branches.includes('午') || branches.includes('巳');
    if (isAdjacentToGapOrJeong && hasGap && hasJeong) {
      isByeokGapFormed = true;
    }
  }

  if (isByeokGapFormed && metalRatio >= 10 && woodRatio >= 10) {
    let efficiency = 100;
    const logicDetails: string[] = [];
    const logicDetailsEn: string[] = [];

    // 수다멸화 (물이 너무 많아 정화 모닥불이 위태로운 경우)
    if (waterRatio >= 30) {
      efficiency -= 30;
      logicDetails.push("수다멸화(水多滅火) 압박(-30%): 홍수와 같은 지독한 물기운으로 인해 경금 도끼가 무뎌지고 정화 불씨가 꺼질 위협이 도사립니다.");
      logicDetailsEn.push("Excessive Water Threat (-30%): Flooding water rusts the ax (Gyeong) and puts out the vital hearth fire (Jeong).");
    }

    // 지지 인신충(寅申沖)으로 도끼와 통나무가 거칠게 박살남
    if (branches.includes('寅') && branches.includes('申')) {
      efficiency -= 20;
      logicDetails.push("인신충(寅申沖) 장애(-20%): 지지에서 도끼(申)와 고목(寅)이 너무 난폭하게 부딪혀, 땔감을 부드럽게 가공해 내는 안정성이 손상됩니다.");
      logicDetailsEn.push("In-Shin Clash Disturbance (-20%): Severe physical friction between metal and wood limits precise, constructive splitting.");
    }

    efficiency = Math.max(30, efficiency);

    patterns.push({
      code: "byeokgap_inhwa",
      name: "벽갑인화(劈甲引火)",
      rarity: "LEGEND",
      effect: "무쇠 도끼(庚)로 큰 통나무(甲)를 솜씨 좋게 쪼개어 영롱한 횃불(丁)을 밝힙니다. 위대한 전문적 권위와 난관을 보석 같은 기회로 뒤집어 극복하는 귀격입니다.",
      enName: "Ax-Split Hearth Fire (Byeokgap-Inhwa)",
      enEffect: "Heaving the ax (Gyeong) to split mature timber (Gap) and fuel the blazing hearth (Jeong). Bestows immense technical mastery and crisis navigation power.",
      isNoble: true,
      efficiency,
      logicDetails,
      logicDetailsEn,
      tooltipText: "경력과 역량(庚)을 다해 미지의 원석(甲)을 조각내어 찬란한 지혜와 전문성(丁)을 피워 올리는 극귀한 전문가 귀격입니다.",
      tooltipTextEn: "Splitting raw wood with sharp metal to generate enduring fire. Denotes extraordinary professional resilience and master problem-solving skills."
    });
  }

  // 4. 등라계갑 (藤羅繫甲)
  const hasBackingOak = stems.includes('甲') || branches.includes('寅') || branches.includes('亥');
  if (dayMaster === '乙' && hasBackingOak) {
    let efficiency = 100;
    const logicDetails: string[] = [];
    const logicDetailsEn: string[] = [];

    // 일간의 신강 조건 검증 (이미 을목이 든든하게 강하면 굳이 갑목을 귀히 붙잡지 않고 경쟁함)
    if (strengthScore > 52) {
      efficiency -= 30;
      logicDetails.push("일간 기운 과잉(-30%): 을목 스스로 이미 힘이 넘쳐, 참나무(甲)의 소중한 그늘과 조력에 대한 이점 활용도가 절반으로 저하됩니다.");
      logicDetailsEn.push("Self-Sufficient Overload (-30%): Strong Eul-Wood requires less support, turning potential cooperation with Gap-Wood into competition.");
    }

    // 갑목이 무쇠(庚金) 등 극심한 금기운에게 정면 강해 목숨을 다치는 경우 (갑경충)
    const hasGyeongStem = stems.includes('庚');
    if (hasGyeongStem && metalRatio >= 25) {
      efficiency -= 20;
      logicDetails.push("갑목 지지목 손상 요인(-20%): 타고 올라갈 든든한 참나무(甲)가 가혹한 금기운(庚)의 도끼날에 상처 입어 지지 기둥이 흔들립니다.");
      logicDetailsEn.push("Damaged Support Stem (-20%): The sturdy tree (Gap) faces severe ax strokes from Gyeong-Metal, destabilizing your safe climbing support.");
    }

    efficiency = Math.max(30, efficiency);

    patterns.push({
      code: "deungra_gyegap",
      name: "등라계갑(藤羅繫甲)",
      rarity: "SR",
      effect: "여린 덩굴(乙)이 거목(甲)을 휘감아 하늘 높이 비상합니다. 나 혼자 독고다이로 돌파하려 들면 곧 꺾이지만, 거대한 인프라나 타인의 힘을 주저 없이 '빌려 쓰고 얹혀가는' 의존을 택할 때 마침내 운명이 개척됩니다. 철저히 남의 덕을 보고 빌려 쓰며 생존해 나가는 강력한 상호협력과 귀인의 격국입니다.",
      enName: "Ivy Climbing the Oak (Deungra-Gyegap)",
      enEffect: "The slender Ivy (Eul) ascends to the heavens by scaling the giant Oak (Gap). You cannot survive on solo struggle; true glory unfolds only when you gracefully rely on someone else's backing or platforms. Winning through collaborative dependence is your ultimate key.",
      isNoble: true,
      efficiency,
      logicDetails,
      logicDetailsEn,
      tooltipText: "가녀린 을목이 자존심을 내려놓고 든든한 수호자(甲)를 획득해 온갖 비바람을 함께 극복하는 수호격입니다. ‘현명한 의존’이 최대의 무기입니다.",
      tooltipTextEn: "Surviving and scaling the heights by gracefully relying on a sturdy pillar (Gap). Embracing smart dependence is your biggest asset, not a weakness."
    });
  }

  return patterns;
};