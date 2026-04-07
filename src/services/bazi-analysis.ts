import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { Language } from '../types';
import { SPECIAL_STRUCTURE_DEFINITIONS } from '../constants/special-structures';

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

// 1. 격국 (Structure/Pattern) - Simplified based on Month Branch (월지) and Day Master (일간)
export const calculateGeJu = (dayGan: string, monthZhi: string, lang: Language) => {
  const monthZhiMainQi: Record<string, string> = {
    '子': '癸', '丑': '己', '寅': '甲', '卯': '乙',
    '辰': '戊', '巳': '丙', '午': '丁', '未': '己',
    '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬'
  };
  
  const mainQi = monthZhiMainQi[monthZhi];
  if (!mainQi) {
    const info = BAZI_MAPPING.geju['건록' as keyof typeof BAZI_MAPPING.geju];
    return lang === 'KO' ? info.ko : info.en;
  }

  // Calculate Ten God of the main Qi relative to Day Master
  const stemsInfo: Record<string, { element: string, polarity: number }> = {
    '甲': { element: 'Wood', polarity: 1 }, '乙': { element: 'Wood', polarity: -1 },
    '丙': { element: 'Fire', polarity: 1 }, '丁': { element: 'Fire', polarity: -1 },
    '戊': { element: 'Earth', polarity: 1 }, '己': { element: 'Earth', polarity: -1 },
    '庚': { element: 'Metal', polarity: 1 }, '辛': { element: 'Metal', polarity: -1 },
    '壬': { element: 'Water', polarity: 1 }, '癸': { element: 'Water', polarity: -1 }
  };

  const self = stemsInfo[dayGan];
  const target = stemsInfo[mainQi];
  
  if (!self || !target) {
    const info = BAZI_MAPPING.geju['건록' as keyof typeof BAZI_MAPPING.geju];
    return lang === 'KO' ? info.ko : info.en;
  }

  const sIdx = ELEMENT_CYCLE.indexOf(self.element);
  const tIdx = ELEMENT_CYCLE.indexOf(target.element);
  const diff = (tIdx - sIdx + 5) % 5;
  const samePolarity = self.polarity === target.polarity;

  let tenGod = '';
  if (diff === 0) tenGod = samePolarity ? '비견' : '겁재';
  else if (diff === 1) tenGod = samePolarity ? '식신' : '상관';
  else if (diff === 2) tenGod = samePolarity ? '편재' : '정재';
  else if (diff === 3) tenGod = samePolarity ? '편관' : '정관';
  else if (diff === 4) tenGod = samePolarity ? '편인' : '정인';

  if (tenGod === '비견' || tenGod === '겁재') {
    const geonrok = BAZI_MAPPING.geju['건록' as keyof typeof BAZI_MAPPING.geju];
    const yangin = BAZI_MAPPING.geju['양인' as keyof typeof BAZI_MAPPING.geju];
    return lang === 'KO' ? `${geonrok.ko} / ${yangin.ko}` : `${geonrok.en} / ${yangin.en}`;
  }

  const info = BAZI_MAPPING.geju[tenGod as keyof typeof BAZI_MAPPING.geju];
  return lang === 'KO' ? info.ko : info.en;
};

/**
 * Determine the final structure (Ge-Ju), including Special Structures (Jong-gyeok).
 */
export const determineStructure = (
  dayGan: string,
  pillars: any[],
  strength: any,
  tenGodsRatio: Record<string, number>,
  lang: Language
) => {
  const dmElement = STEM_ELEMENTS[dayGan];
  const isYangGan = ['甲', '丙', '戊', '庚', '壬'].includes(dayGan);
  const branches = pillars.map(p => p.branch);
  const stems = pillars.map(p => p.stem);
  const monthZhi = branches[2]; // 월지
  
  let logicNote = "";
  let structureKey = "";

  // 1. Check for Jeon-wang-gyeok (Monarch Alignment)
  // If one element is extremely dominant and matches DM
  const elementRatio: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  pillars.forEach(p => {
    elementRatio[STEM_ELEMENTS[p.stem]] += 10;
    elementRatio[BRANCH_ELEMENTS[p.branch]] += 15; // Branches carry more weight
  });

  const totalWeight = Object.values(elementRatio).reduce((a, b) => a + b, 0);
  const dmElementRatio = (elementRatio[dmElement] / totalWeight) * 100;

  if (dmElementRatio > 75 && strength.score > 80) {
    const monarchMap: Record<string, string> = {
      'Wood': '곡직격', 'Fire': '염상격', 'Earth': '가색격', 'Metal': '종혁격', 'Water': '윤하격'
    };
    structureKey = monarchMap[dmElement];
    logicNote = lang === 'KO' 
      ? `일간의 오행(${dmElement})이 사주 전체의 75% 이상을 차지하여 해당 기운으로 모든 것이 집중된 전왕격으로 판정되었습니다.`
      : `The Day Master's element (${dmElement}) accounts for over 75% of the chart, concentrating all energy into a Monarch Alignment.`;
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
        ? "지지에 인성의 뿌리가 있거나 월간/시간의 인성이 일간을 돕고 있어 종격이 아닌 내격(극약)으로 유지됩니다."
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
        ? "지지에 일간의 뿌리(비겁)가 존재하여 종격으로 흐르지 않고 내격으로 남습니다."
        : "Remains a Standard Alignment because a Bi-geop root exists in the branches.";
    }

    // Guardrail 3: Yang Stem Strictness (양간의 특성)
    if (canBeJong && isYangGan && strength.score > 12) {
      canBeJong = false;
      guardrailNote = lang === 'KO'
        ? "양간(Yang Stem)은 쉽게 종하지 않는 특성이 있어, 현재 점수(12점 초과)로는 내격으로 판정합니다."
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
        ? `일간이 극히 약하고 뿌리가 없어 가장 강한 세력인 [${structureKey}]에 순응하는 종격으로 판정되었습니다.`
        : `Judged as an Adaptive Alignment (Jong-gyeok) following the strongest force [${structureKey}] due to an extremely weak Day Master with no roots.`;
    } else {
      logicNote = guardrailNote;
    }
  }

  // 3. Standard Structure (Nae-gyeok)
  if (!structureKey) {
    const standardGeJu = calculateGeJu(dayGan, monthZhi, lang);
    if (!logicNote) {
      logicNote = lang === 'KO'
        ? "전통적인 월지 지장간 투출 원리에 따른 내격 구조입니다."
        : "A standard alignment structure based on the traditional principle of Month Branch hidden stems.";
    }
    
    // For marketing tone of "Extreme Weak Nae-gyeok"
    let marketingMessage = "";
    let enMarketingMessage = "";
    if (strength.score < 20) {
      marketingMessage = "위기를 돌파하는 전문성: 극한의 상황에서도 자신을 지켜내는 독보적인 전문 기술과 끈기를 가졌습니다.";
      enMarketingMessage = "Expertise that breaks through crises: Possesses unique technical skills and persistence to protect oneself even in extreme situations.";
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
export const calculateTenGodsRatio = (pillars: any[], lang: Language) => {
  const counts: Record<string, number> = {
    'Mirror/Rival': 0,
    'Artist/Rebel': 0,
    'Maverick/Architect': 0,
    'Warrior/Judge': 0,
    'Mystic/Sage': 0
  };

  let total = 0;

  pillars.forEach(p => {
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
