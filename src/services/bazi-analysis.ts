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
export const calculateGeJu = (dayGan: string, monthZhi: string, allStems: string[], allBranches: string[], elementScores: Record<string, number>, lang: Language): { geJu: string, isOverridden: boolean, originalGeJu: string } => {
  const hiddenStems = JIJANGAN[monthZhi]?.stems || [];
  
  // Stems to check for revelation (Hour, Month, Year)
  const externalStems = [allStems[0], allStems[2], allStems[3]];
  
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
    const externalStems = [stems[0], stems[2], stems[3]]; // Year, Month, Hour
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
