
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

// 1. Rooting (Tong-geun) Data
export const ROOTING_DATA: Record<string, { strong: string[], mid: string[], weak: string[] }> = {
  '甲': { strong: ['寅', '卯'], mid: ['亥', '未'], weak: ['辰'] },
  '乙': { strong: ['卯', '寅'], mid: ['未', '辰'], weak: ['亥'] },
  '丙': { strong: ['巳', '午'], mid: ['寅'], weak: ['戌', '未'] },
  '丁': { strong: ['午', '巳'], mid: ['未', '戌'], weak: ['寅'] },
  '戊': { strong: ['巳', '午', '辰', '戌'], mid: ['寅', '申'], weak: ['未', '丑'] },
  '己': { strong: ['午', '未', '丑'], mid: ['巳'], weak: ['辰', '戌'] },
  '庚': { strong: ['申', '酉'], mid: ['巳'], weak: ['戌', '丑'] },
  '辛': { strong: ['酉', '申'], mid: ['丑', '戌'], weak: ['巳'] },
  '壬': { strong: ['亥', '子'], mid: ['申'], weak: ['辰'] },
  '癸': { strong: ['子', '亥'], mid: ['辰', '丑'], weak: ['申'] }
};

// 2. Combination (Hap) Data
const COMBINATIONS = {
  BANG_HAP: [
    { branches: ['寅', '卯', '辰'], element: 'Wood' },
    { branches: ['巳', '午', '未'], element: 'Fire' },
    { branches: ['申', '酉', '戌'], element: 'Metal' },
    { branches: ['亥', '子', '丑'], element: 'Water' }
  ],
  SAM_HAP: [
    { branches: ['亥', '卯', '未'], element: 'Wood' },
    { branches: ['寅', '午', '戌'], element: 'Fire' },
    { branches: ['巳', '酉', '丑'], element: 'Metal' },
    { branches: ['申', '子', '辰'], element: 'Water' }
  ],
  STEM_HAP: [
    { stems: ['甲', '己'], element: 'Earth' },
    { stems: ['乙', '庚'], element: 'Metal' },
    { stems: ['丙', '辛'], element: 'Water' },
    { stems: ['丁', '壬'], element: 'Fire' },
    { stems: ['戊', '癸'], element: 'Fire' }
  ]
};

function getRelationship(dmElement: string, targetElement: string): string {
  const dmIdx = ELEMENT_CYCLE.indexOf(dmElement);
  const targetIdx = ELEMENT_CYCLE.indexOf(targetElement);
  if (dmIdx === -1 || targetIdx === -1) return '';
  
  const diff = (targetIdx - dmIdx + 5) % 5;
  if (diff === 0) return 'Self';
  if (diff === 1) return 'Output';
  if (diff === 2) return 'Wealth';
  if (diff === 3) return 'Power';
  if (diff === 4) return 'Wisdom';
  return '';
}

const STEM_HAP_ELEMENTS: Record<string, string> = {
  '甲己': 'Earth', '乙庚': 'Metal', '丙辛': 'Water', '丁壬': 'Fire', '戊癸': 'Fire'
};

const STEM_CLASHES: Record<string, string> = {
  '甲': '庚', '庚': '甲',
  '乙': '辛', '辛': '乙',
  '丙': '壬', '壬': '丙',
  '丁': '癸', '癸': '丁'
};

const CLASH_PAIRS: Record<string, string> = { 
  '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', 
  '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' 
};

const PUNISHMENT_PAIRS: Record<string, string[]> = {
  '寅': ['巳'],
  '巳': ['寅', '申'],
  '申': ['巳'],
  '丑': ['戌'],
  '戌': ['丑', '未'],
  '未': ['戌'],
  '子': ['卯'],
  '卯': ['子'],
  '辰': ['辰'],
  '午': ['午'],
  '酉': ['酉'],
  '亥': ['亥']
};

const HARM_PAIRS: Record<string, string> = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅', '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉' };
const PA_PAIRS: Record<string, string> = { '子': '酉', '酉': '子', '寅': '亥', '亥': '寅', '卯': '午', '午': '卯', '辰': '丑', '丑': '辰', '巳': '申', '申': '巳', '未': '戌', '戌': '未' };

function isAdjacentPunished(b: string, bIdx: number, branches: string[]): boolean {
  const adjIdxs = [bIdx - 1, bIdx + 1].filter(idx => idx >= 0 && idx < branches.length);
  for (const adjIdx of adjIdxs) {
    const other = branches[adjIdx];
    if (PUNISHMENT_PAIRS[b] && PUNISHMENT_PAIRS[b].includes(other)) {
      return true;
    }
  }
  return false;
}

export function calcDayMasterStrength(stems: string[], branches: string[], isTimeUnknown?: boolean) {
  if (isTimeUnknown) {
    stems = ['X', ...stems.slice(1)];
    branches = ['X', ...branches.slice(1)];
  }

  const dayMaster = stems[1]; // 일간
  const dmElement = STEM_ELEMENTS[dayMaster];
  const monthZhi = branches[2]; // 월지
  const monthElement = BRANCH_ELEMENTS[monthZhi];
  
  // Compute adjacent clashes
  const adjacentClashedIndices = new Set<number>();
  for (let j = 0; j < branches.length - 1; j++) {
    if (isTimeUnknown && j === 0) continue; // Skip clash checking between Hour and Day
    const b1 = branches[j];
    const b2 = branches[j + 1];
    if (b1 === 'X' || b2 === 'X') continue;
    if (CLASH_PAIRS[b1] === b2) {
      adjacentClashedIndices.add(j);
      adjacentClashedIndices.add(j + 1);
    }
  }

  // Check if any branch of the combination is adjacent-clashed
  const isGroupComboBroken = (groupBranches: string[]) => {
    for (let idx = 0; idx < branches.length; idx++) {
      if (isTimeUnknown && idx === 0) continue;
      if (groupBranches.includes(branches[idx]) && adjacentClashedIndices.has(idx)) {
        return true;
      }
    }
    return false;
  };

  // 1. Base Element Scores
  const elementScores: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const floatingStems: string[] = [];
  
  // Stems: 10 points each (DM gets 20 for base presence)
  stems.forEach((s, i) => {
    if (s === 'X') return; // Skip unknown hour stem
    const base = i === 1 ? 20 : 10;
    
    // Check for Floating Stems (Heo-bu)
    const rooting = ROOTING_DATA[s];
    const hasRoot = rooting && branches.some((b, bIdx) => {
      if (isTimeUnknown && bIdx === 0) return false;
      return !adjacentClashedIndices.has(bIdx) &&
      (rooting.strong.includes(b) || rooting.mid.includes(b) || rooting.weak.includes(b));
    });
    
    if (!hasRoot) {
      floatingStems.push(s);
      elementScores[STEM_ELEMENTS[s]] += base * 0.3; // 70% reduction for floating stems
    } else {
      elementScores[STEM_ELEMENTS[s]] += base;
    }
  });
  
  // Branches: Using JIJANGAN for accurate distribution
  branches.forEach((b, i) => {
    if (b === 'X') return; // Skip unknown hour branch
    const totalPoints = i === 2 ? 40 : 20;
    const jijangan = JIJANGAN[b];
    if (jijangan) {
      jijangan.stems.forEach((stem, sIdx) => {
        const ratio = jijangan.ratios[sIdx];
        const el = STEM_ELEMENTS[stem];
        elementScores[el] += totalPoints * ratio;
      });
    } else {
      elementScores[BRANCH_ELEMENTS[b]] += totalPoints;
    }
  });

  // 2. Combination (Hap) Logic
  const activeCombinations: any[] = [];
  
  // Check Bang-hap
  COMBINATIONS.BANG_HAP.forEach(group => {
    if (isGroupComboBroken(group.branches)) return;
    const present = group.branches.filter(b => branches.includes(b) && b !== 'X');
    if (present.length === 3 || (present.length === 2 && present.includes(monthZhi))) {
      const bonus = present.length === 3 ? 40 : 20;
      elementScores[group.element] += bonus;
      activeCombinations.push({ type: 'Bang-hap', element: group.element });
    }
  });

  // Check Sam-hap
  COMBINATIONS.SAM_HAP.forEach(group => {
    if (isGroupComboBroken(group.branches)) return;
    const present = group.branches.filter(b => branches.includes(b) && b !== 'X');
    const center = group.branches[1];
    if (present.length === 3 || (present.length === 2 && branches.includes(center) && center !== 'X')) {
      const bonus = present.length === 3 ? 30 : 15;
      elementScores[group.element] += bonus;
      activeCombinations.push({ type: 'Sam-hap', element: group.element });
    }
  });

  // Stem Hap Transformation (Identity Crisis)
  // Check for jaeng-hap (competition) - if multiple stems of same kind exist, transformation is hindered
  const stemCounts: Record<string, number> = {};
  stems.forEach(s => {
    if (s !== 'X') stemCounts[s] = (stemCounts[s] || 0) + 1;
  });

  COMBINATIONS.STEM_HAP.forEach(group => {
    const s1 = group.stems[0];
    const s2 = group.stems[1];
    if (stems.includes(s1) && stems.includes(s2) && s1 !== 'X' && s2 !== 'X') {
      // Check for competition (Jaeng-hap)
      if (stemCounts[s1] > 1 || stemCounts[s2] > 1) {
        activeCombinations.push({ type: 'Jaeng-hap', stems: [s1, s2], note: 'Competition prevents full transformation' });
        return;
      }

      // Transformation logic: -50% original, +50% new
      const el1 = STEM_ELEMENTS[s1];
      const el2 = STEM_ELEMENTS[s2];
      const targetEl = group.element;
      
      const reduction1 = 10 * 0.5;
      const reduction2 = 10 * 0.5;
      elementScores[el1] -= reduction1;
      elementScores[el2] -= reduction2;
      elementScores[targetEl] += (reduction1 + reduction2);
      
      activeCombinations.push({ type: 'Stem-hap-trans', stems: [s1, s2], element: targetEl });
    }
  });

  // 3. Rooting (Tong-geun) Logic
  stems.forEach((s, i) => {
    if (s === 'X') return; // Skip unknown hour stem
    const rooting = ROOTING_DATA[s];
    if (!rooting) return;

    let maxMult = 0.5;
    branches.forEach((b, bIdx) => {
      if (b === 'X') return; // Skip unknown hour branch
      // If of adjacent-clashed index, rooting is completely wiped out!
      if (adjacentClashedIndices.has(bIdx)) return;

      let m = 0.5;
      if (rooting.strong.includes(b)) m = 1.5;
      else if (rooting.mid.includes(b)) m = 1.2;
      else if (rooting.weak.includes(b)) m = 1.0;
      if (m > maxMult) maxMult = m;
    });
    
    const base = i === 1 ? 20 : 10;
    const bonus = base * (maxMult - 1);
    elementScores[STEM_ELEMENTS[s]] += bonus;
    
    if (i === 1) {
      let strongRootCount = 0;
      branches.forEach((b, bIdx) => {
        if (b === 'X') return; // Skip unknown hour branch
        if (adjacentClashedIndices.has(bIdx)) return;
        if (rooting.strong.includes(b)) strongRootCount++;
      });
      if (strongRootCount >= 2) elementScores[dmElement] += 30;
      else if (strongRootCount === 1) elementScores[dmElement] += 10;
    }
  });

  // 3.5 Jo-hu (Seasonal Dominance) Logic
  // Winter (Water month) without Fire: Wood/Earth activity reduced
  if (monthElement === 'Water' && (elementScores['Fire'] || 0) < 15) {
    elementScores['Wood'] *= 0.5;
    elementScores['Earth'] *= 0.5;
    activeCombinations.push({ type: 'Jo-hu', status: 'Cold', note: 'Frozen Wood/Earth' });
  }
  // Summer (Fire month) without Water: Metal/Wood activity reduced
  if (monthElement === 'Fire' && (elementScores['Water'] || 0) < 15) {
    elementScores['Metal'] *= 0.5;
    elementScores['Wood'] *= 0.5;
    activeCombinations.push({ type: 'Jo-hu', status: 'Hot', note: 'Dried Metal/Wood' });
  }

  // 4. Final Strength Calculation
  const selfScore = elementScores[dmElement] || 0;
  const wisdomElement = ELEMENT_CYCLE[(ELEMENT_CYCLE.indexOf(dmElement) + 4) % 5];
  const wisdomScore = elementScores[wisdomElement] || 0;
  
  const supportScore = selfScore + wisdomScore;
  const totalScore = Object.values(elementScores).reduce((a, b) => a + Math.max(0, b), 0);
  
  // Rooting correction: 3+ strong roots = Strong
  let rootingCorrection = false;
  const dmRooting = ROOTING_DATA[dayMaster];
  if (dmRooting) {
    const strongRoots = branches.filter(b => dmRooting.strong.includes(b));
    if (strongRoots.length >= 3) {
      rootingCorrection = true;
    }
  }

  let score = Math.round((supportScore / totalScore) * 100);
  if (score > 100) score = 100;
  if (score < 0) score = 0;

  // Apply rooting correction if score is near neutral
  if (rootingCorrection && score < 55) {
    score = 55; // Force to 'Strong'
  }

  let level = "";
  if (score <= 35) level = "극신약";
  else if (score <= 48) level = "신약";
  else if (score <= 52) level = "중화신약";
  else if (score <= 56) level = "중화신강";
  else if (score <= 65) level = "신강";
  else level = "극신강";

  // 3.8 Compute detailed rooting/tonggeon and generative support information for all 4 pillars with advanced damage and combination-boosted rules
  const rootingDetails: any[] = [];
  const titles = ['Hour', 'Day', 'Month', 'Year'];

  stems.forEach((s, sIdx) => {
    const pTitle = titles[sIdx];
    if (isTimeUnknown && sIdx === 0) {
      rootingDetails.push({
        stem: '?',
        pillarTitle: pTitle,
        isFloat: true,
        roots: [],
        combinations: []
      });
      return;
    }
    const itemRoots: any[] = [];
    const elStem = STEM_ELEMENTS[s];

    // Check of board-wide Combinations (Hap-hwa) producing/strengthening s's element
    const combSupportList: any[] = [];
    if (elStem === 'Wood') {
      if (['亥', '卯', '未'].every(x => branches.includes(x)) && !isGroupComboBroken(['亥', '卯', '未'])) {
        combSupportList.push({
          type: "samhap",
          element: "Wood",
          ko: "해묘미 삼합 목국(木局) 완비! 목(木)의 강력한 연합으로 뭉쳐 하늘의 천간을 수호하므로, 뿌리가 대폭 강화되었습니다.",
          en: "Full Hae-Myo-Mi Wood Triple Combination completes! The strong alignment of Wood branches offers supercharged organic stability to this stem."
        });
      } else if (((branches.includes('亥') && branches.includes('卯')) && !isGroupComboBroken(['亥', '卯'])) || ((branches.includes('卯') && branches.includes('未')) && !isGroupComboBroken(['卯', '未']))) {
        combSupportList.push({
          type: "samhap_half",
          element: "Wood",
          ko: "해묘/묘미 반합 목국(木局) 형성! 중심 기운인 묘목(卯)을 필두로 결속되어 뿌리의 지지력이 격상되었습니다.",
          en: "Hae-Myo/Myo-Mi Half-Wood Combination. Centered around Myo-Wood, it elevates the grounding and rooting strength significantly."
        });
      }
      if (['寅', '卯', '辰'].every(x => branches.includes(x)) && !isGroupComboBroken(['寅', '卯', '辰'])) {
        combSupportList.push({
          type: "banghap",
          element: "Wood",
          ko: "인묘진 방합 동방목국(木局) 결집! 강력한 계절의 동류 세력들이 밀착 협력하여 하늘의 천간을 요새처럼 옹호합니다.",
          en: "In-Myo-Jin Directional Wood Cluster. Strong seasonal alliance creates a fortress-like sanctuary, anchoring your intent."
        });
      }
      if (branches.includes('寅') && branches.includes('亥') && !isGroupComboBroken(['寅', '亥'])) {
        combSupportList.push({
          type: "yukhap",
          element: "Wood",
          ko: "인해 육합(木) 형성! 상생(수생목) 촉발과 특별한 소속감으로 천간의 힘을 부드럽게 강화시킵니다.",
          en: "In-Hae Six Combination (Wood). Organic fusion provides highly unified background nourishment and defense."
        });
      }
    }

    if (elStem === 'Fire') {
      if (['寅', '午', '戌'].every(x => branches.includes(x)) && !isGroupComboBroken(['寅', '午', '戌'])) {
        combSupportList.push({
          type: "samhap",
          element: "Fire",
          ko: "인오술 삼합 화국(火局) 완비! 거대한 불길의 연합 대세가 조율되어 천간의 불길을 마르지 않게 호위합니다.",
          en: "Full In-Oh-Sul Fire Triple Combination completes! Creates an ocean of passionate flame energy, granting deep stable roots."
        });
      } else if (((branches.includes('寅') && branches.includes('午')) && !isGroupComboBroken(['寅', '午'])) || ((branches.includes('午') && branches.includes('戌')) && !isGroupComboBroken(['午', '戌']))) {
        combSupportList.push({
          type: "samhap_half",
          element: "Fire",
          ko: "인오/오술 반합 화국(火局) 형성! 오화(午)를 주축으로 결성된 열정이 천간의 화 기운에 막강한 화력을 유입합니다.",
          en: "In-Oh/Oh-Sul Half-Fire Combination. Armed with Oh-Fire's core pivot, it infuses active backing energy to the stem."
        });
      }
      if (['巳', '午', '未'].every(x => branches.includes(x)) && !isGroupComboBroken(['巳', '午', '未'])) {
        combSupportList.push({
          type: "banghap",
          element: "Fire",
          ko: "사오미 방합 남방화국(火局) 결집! 강력한 뜨거운 남부의 화염 연합군이 지상에 깔려 천간의 에너지를 전폭 옹립합니다.",
          en: "Sa-Oh-Mi Directional Fire Cluster. Emits overwhelming solar radiation, securing absolute sovereignty for Fire stems."
        });
      }
      if (branches.includes('卯') && branches.includes('戌') && !isGroupComboBroken(['卯', '戌'])) {
        combSupportList.push({
          type: "yukhap",
          element: "Fire",
          ko: "묘술 육합(화) 형성! 나무와 흙이 긴밀히 녹아들어 따뜻한 열기로 결합해 천간을 수호합니다.",
          en: "Myo-Sul Six Combination (Fire). Gently fuels the Fire stem with stable, persistent heat."
        });
      }
    }

    if (elStem === 'Metal') {
      if (['巳', '酉', '丑'].every(x => branches.includes(x)) && !isGroupComboBroken(['巳', '酉', '丑'])) {
        combSupportList.push({
          type: "samhap",
          element: "Metal",
          ko: "사유축 삼합 금국(金局) 완비! 냉철한 가을의 금속 연합이 대성하여 천간의 금기를 흔들림 없는 단단한 바위로 다져줍니다.",
          en: "Full Sa-Yu-Chuk Metal Triple Combination completes! Hardens the structural integrity, sealing a rigid diamond footing for your stem."
        });
      } else if (((branches.includes('巳') && branches.includes('酉')) && !isGroupComboBroken(['巳', '酉'])) || ((branches.includes('酉') && branches.includes('丑')) && !isGroupComboBroken(['酉', '丑']))) {
        combSupportList.push({
          type: "samhap_half",
          element: "Metal",
          ko: "사유/유축 반합 금국(金局) 형성! 유금(酉)을 둘러싼 합화 에너지가 천간 신/경금의 통근을 기적적으로 강화합니다.",
          en: "Sa-Yu/Yu-Chuk Half-Metal Combination. Centered on Yu-Metal, it creates active metallurgical reinforcement."
        });
      }
      if (['申', '酉', '戌'].every(x => branches.includes(x)) && !isGroupComboBroken(['申', '酉', '戌'])) {
        combSupportList.push({
          type: "banghap",
          element: "Metal",
          ko: "신유술 방합 서방금국(金局) 결집! 백색 호랑이의 가을 숙살 세력이 지상을 가득 채워, 바위와 칼날이 기세등등하게 우뚝 섭니다.",
          en: "Shin-Yu-Sul Directional Metal Cluster. Floods the terrain with mineral density, fortifying the stem like armor plating."
        });
      }
      if (branches.includes('辰') && branches.includes('酉') && !isGroupComboBroken(['辰', '酉'])) {
        combSupportList.push({
          type: "yukhap",
          element: "Metal",
          ko: "진유 육합(금) 형성! 습토의 완벽한 상생 지원(토생금)이 밀착되어 하늘에서 번뜩이는 철제 도구를 명품으로 승격시킵니다.",
          en: "Jin-Yu Six Combination (Metal). Earth to Metal consolidation acts as a secure buffer, solidifying output stamina."
        });
      }
    }

    if (elStem === 'Water') {
      if (['申', '子', '辰'].every(x => branches.includes(x)) && !isGroupComboBroken(['申', '子', '辰'])) {
        combSupportList.push({
          type: "samhap",
          element: "Water",
          ko: "신자진 삼합 수국(水局) 완비! 거대한 대해의 조류 소통을 통해 최고의 연대 뿌리를 형성합니다.",
          en: "Full Shin-Ja-Jin Water Triple Combination completes! Forms a giant subterranean reservoir, empowering this Water stem deeply."
        });
      } else if (((branches.includes('申') && branches.includes('子')) && !isGroupComboBroken(['申', '子'])) || ((branches.includes('子') && branches.includes('辰')) && !isGroupComboBroken(['子', '辰']))) {
        combSupportList.push({
          type: "samhap_half",
          element: "Water",
          ko: "신자/자진 반합 수국(水局) 형성! 자수(子)를 매개로 한 마르지 않는 강줄기가 연결되어 천간의 갈증을 완전히 씻어 내립니다.",
          en: "Shin-Ja/Ja-Jin Half-Water Combination. Connects a persistent hydraulic artery directly, enhancing water vitality."
        });
      }
      if (['亥', '子', '丑'].every(x => branches.includes(x)) && !isGroupComboBroken(['亥', '子', '丑'])) {
        combSupportList.push({
          type: "banghap",
          element: "Water",
          ko: "해자축 방합 북방수국(水局) 결집! 북방의 차갑고 심오한 수기가 대대적으로 모여 뿌리를 공고히 합니다.",
          en: "Hae-Ja-Chuk Directional Water Cluster. Cold winter freezing water flow gathers together, creating absolute fluid superiority."
        });
      }
      if (branches.includes('巳') && branches.includes('申') && !isGroupComboBroken(['巳', '申'])) {
        combSupportList.push({
          type: "yukhap",
          element: "Water",
          ko: "사신 육합(수) 형성! 수기를 함유한 긴밀한 이중 결합으로 천간 자원을 뒷받침합니다.",
          en: "Sa-Shin Six Combination (Water). Complex metamorphic alchemy triggers a silent water flow undercurrent."
        });
      }
    }

    if (elStem === 'Earth') {
      if (branches.includes('午') && branches.includes('未') && !isGroupComboBroken(['午', '未'])) {
        combSupportList.push({
          type: "yukhap",
          element: "Earth",
          ko: "오미 육합(토) 형성! 뜨거운 화기와 메마른 흙의 밀접한 결합으로 토(土) 기질을 강화하고 하늘의 가치를 공고히 지탱합니다.",
          en: "Oh-Mi Six Combination (Earth). Consolidates dry-clay properties, strengthening the stem structural foundations."
        });
      }
    }

    branches.forEach((b, bIdx) => {
      if (isTimeUnknown && bIdx === 0) return; // Skip unknown hour branch
      const bTitle = titles[bIdx];
      const jijangan = JIJANGAN[b];
      
      const damages: string[] = [];
      const damagesEn: string[] = [];
      
      const isAdjacentClashed = adjacentClashedIndices.has(bIdx);
      const hasAdjacentPunishment = !isAdjacentClashed && isAdjacentPunished(b, bIdx, branches);

      if (isAdjacentClashed) {
        damages.push(`직접적인 인접 지지충(地支衝)인 [ ${b}-${CLASH_PAIRS[b]} ] 이(가) 가까이서 발생하여 지장간 뿌리(통근)가 완전히 깨지고 소멸되었습니다.`);
        damagesEn.push(`Direct adjacent Earthly Branch Clash [ ${b}-${CLASH_PAIRS[b]} ] is active, completely shattering physical rooting stability.`);
      } else if (hasAdjacentPunishment) {
        damages.push(`⚡ 인접 형살(刑殺) 작용: 뿌리가 파괴되지는 않았으나 에너지가 매우 거칠고 예민하게 비틀어 집니다. (예: 살벌하고 압박적인 상황 속에서 능력을 발휘하는 강박적인 조율 원리)`);
        damagesEn.push(`⚡ Adjacent Punishment active: Root remains intact, but energy is squeezed and twisted roughly under intense pressure.`);
      }

      if (jijangan) {
        jijangan.stems.forEach((hs, hsIdx) => {
          const isMain = (hsIdx === jijangan.stems.length - 1);
          const hasRootSameElement = (STEM_ELEMENTS[hs] === STEM_ELEMENTS[s]);
          const isGeneration = (hs === '癸' && s === '甲') || (hs === '壬' && s === '甲') ||
                                (hs === '癸' && s === '乙') || (hs === '壬' && s === '乙') ||
                                (STEM_ELEMENTS[hs] === 'Water' && STEM_ELEMENTS[s] === 'Wood') ||
                                (STEM_ELEMENTS[hs] === 'Wood' && STEM_ELEMENTS[s] === 'Fire') ||
                                (STEM_ELEMENTS[hs] === 'Fire' && STEM_ELEMENTS[s] === 'Earth') ||
                                (STEM_ELEMENTS[hs] === 'Earth' && STEM_ELEMENTS[s] === 'Metal') ||
                                (STEM_ELEMENTS[hs] === 'Metal' && STEM_ELEMENTS[s] === 'Water');
          
          if (hasRootSameElement) {
            const type = isMain ? 'main' : 'sub_residual';
            const typeKo = isMain ? '본기통근' : '중/여기통근';
            const typeEn = isMain ? 'Main-Qi Root' : 'Sub-Qi Root';
            const descKo = isMain ? `본기 통근 (가장 강력한 뿌리)` : `중기/여기 통근 (안정적인 지지대)`;
            const descEn = isMain ? `Main-Qi Rooting (Most Powerful)` : `Sub-Qi Rooting (Moderate)`;
            itemRoots.push({
              branchTitle: bTitle,
              branch: b,
              type,
              typeKo,
              typeEn,
              descKo,
              descEn,
              hiddenStem: hs,
              isDestroyed: isAdjacentClashed,
              isTwisted: hasAdjacentPunishment,
              damages,
              damagesEn
            });
          } else if (isGeneration) {
            const type = 'generation';
            const typeKo = '생기생조(득생)';
            const typeEn = 'Generative Support';
            const descKo = '생기 생조 (득생 - 인성의 든든한 상생 보조)';
            const descEn = 'Generative Support (Receiving strength from Resource qi)';
            itemRoots.push({
              branchTitle: bTitle,
              branch: b,
              type,
              typeKo,
              typeEn,
              descKo,
              descEn,
              hiddenStem: hs,
              isDestroyed: isAdjacentClashed,
              isTwisted: hasAdjacentPunishment,
              damages,
              damagesEn
            });
          }
        });
      }
    });

    const isFloat = !itemRoots.some(r => r.type === 'main' || r.type === 'sub_residual');
    rootingDetails.push({
      stem: s,
      pillarTitle: pTitle,
      isFloat,
      roots: itemRoots,
      combinations: combSupportList
    });
  });

  return { 
    score, 
    level, 
    title: level,
    isStrong: score > 52,
    breakdown: { 
      self: Math.round(selfScore), 
      wisdom: Math.round(wisdomScore), 
      total: Math.round(totalScore) 
    },
    activeCombinations,
    floatingStems,
    rootingDetails, // Detailed rooting information for the entire chart
    elementScores // Return raw scores for advanced analysis
  };
}

export function determineYongshin(stems: string[], branches: string[], geju: string, strength: any, structureDetail?: any, tenGodsRatio: any = {}) {
  const dayMaster = stems[1];
  const dmElement = STEM_ELEMENTS[dayMaster];
  const isStrong = strength.score > 50;

  // 観多判定 (Absolute Priority)
  const gwanRatio = (tenGodsRatio['관성(Warrior/Judge)'] as number) || (tenGodsRatio['Warrior/Judge'] as number) || 0;
  const isGwanDa = gwanRatio >= 40; // Threshold lowered from 60 to 40
  
  console.log("DEBUG: gwanRatio:", gwanRatio);
  console.log("DEBUG: isGwanDa:", isGwanDa);

  const getElementByRel = (rel: string) => {
    const dmIdx = ELEMENT_CYCLE.indexOf(dmElement);
    const rels = ['Self', 'Output', 'Wealth', 'Power', 'Wisdom'];
    const aliasMap: Record<string, string> = { 'Artist': 'Output', 'Rebel': 'Output' };
    const normalizedRel = aliasMap[rel] || rel;
    const targetIdx = (dmIdx + rels.indexOf(normalizedRel)) % 5;
    return ELEMENT_CYCLE[targetIdx];
  };

  if (isGwanDa) {
    if (!isStrong) {
      // 관다신약 -> 인성용신 (살인상생/관인상생)
      const primary = { 
        god: "인성", 
        element: getElementByRel('Wisdom'), 
        reason: "관다신약 → 인성용신 (살인상생)", 
        reasonEn: "Bazi overloaded with Gwan & Weak DayMaster -> Wisdom/Sage Useful God (살인상생)" 
      };
      const heeShin = { god: "비겁", element: getElementByRel('Self') };
      const giShin = { god: "관성", element: getElementByRel('Power') };
      const guShin = { god: "재성", element: getElementByRel('Wealth') };
      return { primary, heeShin, giShin, guShin, method: "관다용신", byeongYak: null, tongGwan: null, eokbu: null };
    } else {
      // 관다신강 -> 식상용신 (식신제살)
      const primary = { 
        god: "식상", 
        element: getElementByRel('Output'), 
        reason: "관다신강 → 식상용신 (식신제살)", 
        reasonEn: "GwanDa & Strong DayMaster -> Artist/Rebel Useful God (식신제살)" 
      };
      const heeShin = { god: "재성", element: getElementByRel('Wealth') };
      const giShin = { god: "인성", element: getElementByRel('Wisdom') };
      const guShin = { god: "비겁", element: getElementByRel('Self') };
      return { primary, heeShin, giShin, guShin, method: "관다용신", byeongYak: null, tongGwan: null, eokbu: null };
    }
  }

  const getGod = (el: string) => {
    const relMap: Record<string, string> = { 'Self': '비겁', 'Output': '식상', 'Wealth': '재성', 'Power': '관성', 'Wisdom': '인성' };
    return relMap[getRelationship(dmElement, el)] || "";
  };

  const totalScore = Object.values(strength.elementScores).reduce((a: number, b: any) => a + Math.max(0, Number(b)), 0) as number;
  const ratios: Record<string, number> = {};
  Object.entries(strength.elementScores).forEach(([el, score]: [string, any]) => {
    ratios[el] = (Number(score) / (totalScore || 1)) * 100;
  });

  const fireRatio = (ratios?.['Fire'] || 0) || 0;
  const earthRatio = (ratios?.['Earth'] || 0) || 0;

  const isHwaDaToCho = (dmElement === 'Earth' && fireRatio >= 40) || (structureDetail?.title === '화토중탁') || (structureDetail?.title === '화다토초');
  const isToDaMaeGeum = (dmElement === 'Metal' && earthRatio >= 40) || (structureDetail?.title === '토다매금');

  if (isHwaDaToCho) {
    const primary = { god: getGod('Metal'), element: "Metal", reason: "화다토초/화토중탁 → 금(金) 통관용신", reasonEn: "Fire Dominance → Metal Useful God" };
    const heeShin = { god: getGod('Water'), element: "Water" };
    const hanShin = { god: getGod('Earth'), element: "Earth" };
    const giShin = { god: getGod('Fire'), element: "Fire" };
    const guShin = { god: getGod('Wood'), element: "Wood" };
    return { primary, heeShin, giShin, guShin, hanShin, method: "특수격용신", dominantElement: "Fire", byeongYak: null, tongGwan: null, eokbu: null };
  }

  if (isToDaMaeGeum) {
    const primary = { god: getGod('Wood'), element: "Wood", reason: "토다매금 → 목(木) 소토용신", reasonEn: "Earth Dominance → Wood Useful God" };
    const heeShin = { god: getGod('Water'), element: "Water" };
    const hanShin = { god: getGod('Metal'), element: "Metal" };
    const giShin = { god: getGod('Earth'), element: "Earth" };
    const guShin = { god: getGod('Fire'), element: "Fire" };
    return { primary, heeShin, giShin, guShin, hanShin, method: "특수격용신", dominantElement: "Earth", byeongYak: null, tongGwan: null, eokbu: null };
  }

  // 0. Special Structure Handling (Jong-gyeok / Jeon-wang-gyeok) - High Priority
  let method = "격국용신";
  let primary = { god: "", element: "", reason: "", reasonEn: "" };
  let heeShin = { god: "", element: "" };
  let giShin = { god: "", element: "" };
  let guShin = { god: "", element: "" };
  let eokbu: any = null;

  if (structureDetail && structureDetail.category === 'Adaptive') {
    method = "종격용신";
    const title = structureDetail.title;
    
    if (title.includes("종아격")) {
      return { primary: { god: "식상", element: getElementByRel('Output'), reason: "종아격 → 식상용신", reasonEn: "Adaptive Alignment [Artist/Rebel] → Artist/Rebel Useful God" }, heeShin: { god: "재성", element: getElementByRel('Wealth') }, giShin: { god: "인성", element: getElementByRel('Wisdom') }, guShin: { god: "비겁", element: getElementByRel('Self') }, method, byeongYak: null, tongGwan: null, eokbu: null };
    } else if (title.includes("종재격")) {
      return { primary: { god: "재성", element: getElementByRel('Wealth'), reason: "종재격 → 재성용신", reasonEn: "Adaptive Alignment [Maverick/Architect] → Maverick/Architect Useful God" }, heeShin: { god: "식상", element: getElementByRel('Output') }, giShin: { god: "비겁", element: getElementByRel('Self') }, guShin: { god: "인성", element: getElementByRel('Wisdom') }, method, byeongYak: null, tongGwan: null, eokbu: null };
    } else if (title.includes("종살격")) {
      return { primary: { god: "관성", element: getElementByRel('Power'), reason: "종살격 → 관성용신", reasonEn: "Adaptive Alignment [Warrior/Judge] → Warrior/Judge Useful God" }, heeShin: { god: "재성", element: getElementByRel('Wealth') }, giShin: { god: "식상", element: getElementByRel('Output') }, guShin: { god: "비겁", element: getElementByRel('Self') }, method, byeongYak: null, tongGwan: null, eokbu: null };
    } else if (title.includes("종왕격")) {
      return { primary: { god: "비겁", element: getElementByRel('Self'), reason: "종왕격 → 비겁용신", reasonEn: "Adaptive Alignment [Mirror/Rival] → Mirror/Rival Useful God" }, heeShin: { god: "인성", element: getElementByRel('Wisdom') }, giShin: { god: "식상", element: getElementByRel('Output') }, guShin: { god: "재성", element: getElementByRel('Wealth') }, method, byeongYak: null, tongGwan: null, eokbu: null };
    }
  } else if (structureDetail && structureDetail.category === 'Monarch') {
    method = "전왕격용신";
    const monarchEl = structureDetail.mainElement || dmElement;
    
    primary = { god: "비겁", element: monarchEl, reason: "전왕격 → 비겁용신", reasonEn: "Monarch Alignment → Mirror/Rival Useful God" };
    const mIdx = ELEMENT_CYCLE.indexOf(monarchEl);
    heeShin = { god: "비겁, 식상", element: `${monarchEl}, ${ELEMENT_CYCLE[(mIdx + 1) % 5]}` };
    giShin = { god: "관성", element: ELEMENT_CYCLE[(mIdx + 3) % 5] };
    guShin = { god: "인성", element: ELEMENT_CYCLE[(mIdx + 4) % 5] };
    const hanShin = { god: "재성", element: ELEMENT_CYCLE[(mIdx + 2) % 5] };
    return { primary, heeShin, giShin, guShin, hanShin, method, dominantElement: monarchEl, byeongYak: null, tongGwan: null, eokbu: null };
  } else if (structureDetail && structureDetail.category === 'Image') {
    method = "특수격용신";
    const title = structureDetail.title;
    const targetEl = structureDetail.mainElement || dmElement;
    const targetIdx = ELEMENT_CYCLE.indexOf(targetEl);
    
    const rel = getRelationship(dmElement, targetEl);
    const godMap: Record<string, string> = {
      'Self': '비겁',
      'Artist': '식상',
      'Output': '식상',
      'Wealth': '재성',
      'Power': '관성',
      'Wisdom': '인성'
    };
    const god = godMap[rel] || "특수";

    primary = { 
      god, 
      element: targetEl, 
      reason: `${title} → ${targetEl} 용신`, 
      reasonEn: `${title} → ${targetEl} Useful God` 
    };
    heeShin = { god: "희신", element: ELEMENT_CYCLE[(targetIdx + 1) % 5] };
    giShin = { god: "기신", element: ELEMENT_CYCLE[(targetIdx + 3) % 5] };
    guShin = { god: "구신", element: ELEMENT_CYCLE[(targetIdx + 2) % 5] };
    
    let dominantElement = dmElement;
    if (title.includes("화토중탁")) dominantElement = "Earth";
    else if (title.includes("금백수청")) dominantElement = "Metal";
    else if (title.includes("목화통명")) dominantElement = "Wood";
    else if (title.includes("수목청화")) dominantElement = "Water";

    return { primary, heeShin, giShin, guShin, method, dominantElement, byeongYak: null, tongGwan: null, eokbu: null };
  }

  if (geju.includes("정관") || geju.includes("JUDGE")) {
    if (isStrong) {
      primary = { god: "재성", element: getElementByRel('Wealth'), reason: "정관격 일간강 → 재성용신", reasonEn: "Warrior/Judge Structure & Strong DM → Maverick/Architect Useful God" };
      heeShin = { god: "관성", element: getElementByRel('Power') };
      giShin = { god: "비겁", element: getElementByRel('Self') };
      guShin = { god: "인성", element: getElementByRel('Wisdom') };
    } else {
      primary = { god: "인성", element: getElementByRel('Wisdom'), reason: "정관격 일간약 → 인성용신", reasonEn: "Warrior/Judge Structure & Weak DM → Mystic/Sage Useful God" };
      heeShin = { god: "비겁", element: getElementByRel('Self') };
      giShin = { god: "상관", element: getElementByRel('Artist') };
      guShin = { god: "재성", element: getElementByRel('Wealth') };
    }
  } else if (geju.includes("편관") || geju.includes("칠살") || geju.includes("WARRIOR")) {
    if (!isStrong) {
      primary = { god: "인성", element: getElementByRel('Wisdom'), reason: "편관격 일간약 → 인성용신 (인수화살)", reasonEn: "Warrior/Judge Structure & Weak DM → Mystic/Sage Useful God" };
      heeShin = { god: "비겁", element: getElementByRel('Self') };
      giShin = { god: "재성", element: getElementByRel('Wealth') };
      guShin = { god: "식상", element: getElementByRel('Artist') };
    } else {
      // 1993-02-26 Male: 편관격, 중화신강, 용신 금(식상)
      // 토생금(희신), 화극금(기신)
      primary = { god: "식상", element: getElementByRel('Artist'), reason: "편관격 일간강 → 식상용신 (식신제살)", reasonEn: "Warrior/Judge Structure & Strong DM → Artist/Rebel Useful God" };
      heeShin = { god: "재성", element: getElementByRel('Wealth') }; // 토(재성)
      giShin = { god: "인성", element: getElementByRel('Wisdom') }; // 화(인성)
      guShin = { god: "비겁", element: getElementByRel('Self') };
    }
  } else if (geju.includes("식신") || geju.includes("상관") || geju.includes("ARTIST") || geju.includes("REBEL")) {
    if (isStrong) {
      primary = { god: "재성", element: getElementByRel('Wealth'), reason: "식상격 일간강 → 재성용신", reasonEn: "Artist/Rebel Structure & Strong DM → Maverick/Architect Useful God" };
      heeShin = { god: "식상", element: getElementByRel('Artist') };
      giShin = { god: "인성", element: getElementByRel('Wisdom') };
      guShin = { god: "비겁", element: getElementByRel('Self') };
    } else {
      primary = { god: "비겁", element: getElementByRel('Self'), reason: "식상격 일간약 → 비겁용신", reasonEn: "Artist/Rebel Structure & Weak DM → Mirror/Rival Useful God" };
      heeShin = { god: "인성", element: getElementByRel('Wisdom') };
      giShin = { god: "관성", element: getElementByRel('Power') };
      guShin = { god: "재성", element: getElementByRel('Wealth') };
    }
  } else if (geju.includes("재성") || geju.includes("정재") || geju.includes("편재") || geju.includes("ARCHITECT") || geju.includes("MAVERICK")) {
    if (isStrong) {
      primary = { god: "관성", element: getElementByRel('Power'), reason: "재성격 일간강 → 관성용신", reasonEn: "Maverick/Architect Structure & Strong DM → Warrior/Judge Useful God" };
      heeShin = { god: "재성", element: getElementByRel('Wealth') };
      giShin = { god: "비겁", element: getElementByRel('Self') };
      guShin = { god: "인성", element: getElementByRel('Wisdom') };
    } else {
      primary = { god: "비겁", element: getElementByRel('Self'), reason: "재성격 일간약 → 비겁용신", reasonEn: "Maverick/Architect Structure & Weak DM → Mirror/Rival Useful God" };
      heeShin = { god: "인성", element: getElementByRel('Wisdom') };
      giShin = { god: "식상", element: getElementByRel('Artist') };
      guShin = { god: "관성", element: getElementByRel('Power') };
    }
  } else if (geju.includes("인성") || geju.includes("정인") || geju.includes("편인") || geju.includes("SAGE") || geju.includes("MYSTIC")) {
    if (!isStrong) {
      primary = { god: "인성", element: getElementByRel('Wisdom'), reason: "인성격 일간약 → 인성용신", reasonEn: "Mystic/Sage Structure & Weak DM → Mystic/Sage Useful God" };
      heeShin = { god: "관성", element: getElementByRel('Power') };
      giShin = { god: "재성", element: getElementByRel('Wealth') };
      guShin = { god: "식상", element: getElementByRel('Artist') };
    } else {
      primary = { god: "재성", element: getElementByRel('Wealth'), reason: "인성격 일간강 → 재성용신 (파인: 과도한 인성을 재성으로 제어)", reasonEn: "Mystic/Sage Structure & Strong DM → Maverick/Architect Useful God (Pa-In: Using Maverick/Architect to control excessive Mystic/Sage)" };
      heeShin = { god: "식상", element: getElementByRel('Artist') };
      giShin = { god: "인성", element: getElementByRel('Wisdom') };
      guShin = { god: "관성", element: getElementByRel('Power') };
    }
  } else {
    // Default to 억부용신 (Balance)
    const elementKoMap: Record<string, string> = { Wood: '목(木)', Fire: '화(火)', Earth: '토(土)', Metal: '금(金)', Water: '수(水)' };
    
    if (isStrong) {
      const artistEl = getElementByRel('Artist');
      const wealthEl = getElementByRel('Wealth');
      const powerEl = getElementByRel('Power');
      const elementsStr = `${elementKoMap[artistEl]}/${elementKoMap[wealthEl]}/${elementKoMap[powerEl]}`;
      const elementsEnStr = `${artistEl}/${wealthEl}/${powerEl}`;
      
      primary = { god: "식상/재성/관성", element: elementsEnStr, reason: "일간강 → 억부용신", reasonEn: "Strong DM → Eokbu (Balance) Useful God" };
      heeShin = { god: "재성", element: getElementByRel('Wealth') };
      giShin = { god: "인성", element: getElementByRel('Wisdom') };
      guShin = { god: "비겁", element: getElementByRel('Self') };
      
      eokbu = {
        type: 'weakening',
        elements: [artistEl, wealthEl, powerEl],
        note: `일간이 강하므로 기운을 빼주는 식상, 재성, 관성(${elementsStr})이 용신으로 작용해.`,
        noteEn: `Since the Day Master is strong, the elements that weaken it (${elementsEnStr}) act as the Useful God.`
      };
    } else {
      const wisdomEl = getElementByRel('Wisdom');
      const selfEl = getElementByRel('Self');
      const elementsStr = `${elementKoMap[wisdomEl]}/${elementKoMap[selfEl]}`;
      const elementsEnStr = `${wisdomEl}/${selfEl}`;
      
      primary = { god: "인성/비겁", element: elementsEnStr, reason: "일간약 → 억부용신", reasonEn: "Weak DM → Eokbu (Balance) Useful God" };
      heeShin = { god: "비겁", element: getElementByRel('Self') };
      giShin = { god: "관성", element: getElementByRel('Power') };
      guShin = { god: "재성", element: getElementByRel('Wealth') };
      
      eokbu = {
        type: 'strengthening',
        elements: [wisdomEl, selfEl],
        note: `일간이 약하므로 기운을 보태주는 인성, 비겁(${elementsStr})이 용신으로 작용해.`,
        noteEn: `Since the Day Master is weak, the elements that strengthen it (${elementsEnStr}) act as the Useful God.`
      };
    }
    method = "억부용신";
  }

  return { primary, heeShin, giShin, guShin, method, byeongYak: null, tongGwan: null, eokbu };
}

export function checkByeongYak(stems: string[], branches: string[], yongshin: any) {
  const dayMaster = stems[1];
  const dmElement = STEM_ELEMENTS[dayMaster];
  
  // Count elements
  const counts: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  stems.forEach(s => counts[STEM_ELEMENTS[s]]++);
  branches.forEach(b => counts[BRANCH_ELEMENTS[b]]++);

  // Identify "병" (Disease)
  let byeong = "";
  let maxCount = 0;
  ELEMENT_CYCLE.forEach(el => {
    if (el !== dmElement && counts[el] >= 3) {
      if (counts[el] > maxCount) {
        maxCount = counts[el];
        byeong = el;
      }
    }
  });

  if (byeong) {
    // For Monarch structures, we don't treat the dominant element as a "disease" to be cured by clashing.
    const isMonarch = yongshin?.method === "전왕격용신" || yongshin?.method === "특수격용신";
    if (isMonarch) {
      const monarchEl = yongshin.dominantElement || yongshin.primary.element;
      const mIdx = ELEMENT_CYCLE.indexOf(monarchEl);
      const drainEl = ELEMENT_CYCLE[(mIdx + 1) % 5]; // Output element
      
      const getRelKo = (el: string) => {
        const rel = getRelationship(dmElement, el);
        const map: Record<string, string> = {
          'Self': '비겁', 'Output': '식상', 'Wealth': '재성', 'Power': '관성', 'Wisdom': '인성'
        };
        return map[rel] || rel;
      };

      const elementKoMap: Record<string, string> = { 
        Wood: `목(${getRelKo('Wood')})`, 
        Fire: `화(${getRelKo('Fire')})`, 
        Earth: `토(${getRelKo('Earth')})`, 
        Metal: `금(${getRelKo('Metal')})`, 
        Water: `수(${getRelKo('Water')})` 
      };
      const koDrain = elementKoMap[drainEl] || drainEl;
      const koMonarch = elementKoMap[monarchEl] || monarchEl;

      return {
        byeong: monarchEl,
        yak: drainEl,
        note: `${koMonarch} 기운이 강한 격국은 그 기운을 거스르면 안 돼. ${koDrain}으로 기운을 부드럽게 설기하는 것이 좋아.`,
        noteEn: `Structures with strong ${monarchEl} energy should not be clashed. It is best to gently drain the energy with ${drainEl} (Artist/Rebel).`
      };
    }

    // Identify "약" (Medicine) - element that overcomes the disease
    const byeongIdx = ELEMENT_CYCLE.indexOf(byeong);
    const yakIdx = (byeongIdx + 3) % 5; 
    const yakElement = ELEMENT_CYCLE[yakIdx];

    if (counts[yakElement] >= 1) {
      return { 
        byeong, 
        yak: yakElement, 
        note: `병(${byeong})을 치료하는 약(${yakElement})이 있음`,
        noteEn: `Has Medicine (${yakElement}) to cure the Disease (${byeong})`
      };
    }
  }
  return null;
}

export function checkTongGwan(stems: string[], branches: string[]) {
  const counts: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  stems.forEach(s => counts[STEM_ELEMENTS[s]]++);
  branches.forEach(b => counts[BRANCH_ELEMENTS[b]]++);

  for (let i = 0; i < 5; i++) {
    const el1 = ELEMENT_CYCLE[i];
    const el2 = ELEMENT_CYCLE[(i + 2) % 5]; // Keuk relationship
    
    if (counts[el1] >= 2 && counts[el2] >= 2) {
      const tongGwanIdx = (i + 1) % 5; // Mediation element
      const tongGwanElement = ELEMENT_CYCLE[tongGwanIdx];
      return { 
        el1, 
        el2, 
        tongGwan: tongGwanElement, 
        note: `${el1}와 ${el2} 사이를 통관하는 ${tongGwanElement} 필요`,
        noteEn: `Needs ${tongGwanElement} to mediate between ${el1} and ${el2}`
      };
    }
  }
  return null;
}

export function analyzeSpecialStructure(stems: string[], branches: string[], elementScores: Record<string, number>, lang: any, isTimeUnknown?: boolean) {
  if (isTimeUnknown) {
    stems = ['X', ...stems.slice(1)];
    branches = ['X', ...branches.slice(1)];
  }
  const dayMaster = stems[1];
  const dmElement = STEM_ELEMENTS[dayMaster];
  const monthZhi = branches[2];
  const monthElement = BRANCH_ELEMENTS[monthZhi];
  
  const total = Object.values(elementScores).reduce((a, b) => a + Math.max(0, b), 0);
  const ratios: Record<string, number> = {};
  Object.entries(elementScores).forEach(([el, score]) => {
    ratios[el] = (score / total) * 100;
  });

  // 0. Zero-Tolerance Filters (기각 로직)
  const isYinGan = ['乙', '丁', '己', '辛', '癸'].includes(dayMaster);
  const dmIdx = ELEMENT_CYCLE.indexOf(dmElement);
  const artistEl = ELEMENT_CYCLE[(dmIdx + 1) % 5];
  const wealthEl = ELEMENT_CYCLE[(dmIdx + 2) % 5];
  const powerEl = ELEMENT_CYCLE[(dmIdx + 3) % 5];
  const wisdomEl = ELEMENT_CYCLE[(dmIdx + 4) % 5];

  // Filter 1: The Survivor Check (반대 세력의 생존력)
  // Check if Sik/Jae/Gwan (Artist/Wealth/Power) has a functional root
  const hasFunctionalOpponentRoot = branches.some((b, idx) => {
    if (isTimeUnknown && idx === 0) return false;
    if (b === 'X') return false;
    const el = BRANCH_ELEMENTS[b];
    if (el !== powerEl && el !== wealthEl && el !== artistEl) return false;
    
    // Check if the root is "functional" or "attacked"
    if (el === 'Metal' && (ratios?.['Fire'] || 0) > 60) {
      // Metal root in Fire-heavy chart
      const hasMetalHap = (branches.includes('酉') && (branches.includes('巳') || branches.includes('丑'))) ||
                         (branches.includes('申') && (branches.includes('子') || branches.includes('辰')));
      if (hasMetalHap) return true; // Functional via combination (e.g., 1989's Sa-Yu)
      return false; // Isolated Metal root is "melted" (e.g., 1992's Shin)
    }
    
    if (el === 'Water' && (ratios?.['Earth'] || 0) > 60) {
      // Water root in Earth-heavy chart
      const hasWaterHap = (branches.includes('子') && (branches.includes('申') || branches.includes('辰'))) ||
                         (branches.includes('亥') && (branches.includes('寅') || branches.includes('卯')));
      if (hasWaterHap) return true;
      return false; // Isolated Water root is "blocked"
    }

    return true; // Other roots are generally functional
  });

  // Filter 3: Leakage Check (설기 유무)
  // If Artist (Sik-sang) is in stems and has a functional root, it's a standard structure (Nae-gyeok)
  const hasArtistInStem = stems.some((s, idx) => idx !== 1 && STEM_ELEMENTS[s] === artistEl);
  if (hasArtistInStem && hasFunctionalOpponentRoot) {
    // Check if the functional root belongs to the Artist element
    const hasArtistRoot = branches.some(b => {
      const el = BRANCH_ELEMENTS[b];
      if (el === artistEl) return true;
      // Special case: Earth DM with 酉 (Rooster) as Metal root
      if (dmElement === 'Earth' && b === '酉') return true;
      return false;
    });
    if (hasArtistRoot) return null; // Reject special structure (e.g., 1989's Gyeong-Metal with Yu-Rooster)
  }

  // Filter 2: Yin Stem Strictness (음간의 자존심)
  // Yin stems are 20% more strict about following
  const yinStrictnessRatio = isYinGan ? 1.2 : 1.0;

  // Check for Jae/Gwan survival in stems with functional root
  const hasStemOpponent = stems.some((s, idx) => idx !== 1 && (STEM_ELEMENTS[s] === powerEl || STEM_ELEMENTS[s] === wealthEl));
  if (hasStemOpponent && hasFunctionalOpponentRoot) {
    // If it's a Yang stem and the opponent is weak/clashed, we might still consider it (Fake Special)
    // But for Yin stems, it's an immediate rejection
    if (isYinGan) return null;
    
    // For Yang stems, check if the stem opponent is clashed (e.g., 1992's Im-Water vs Byeong-Fire)
    const opponentIdx = stems.findIndex((s, idx) => idx !== 1 && (STEM_ELEMENTS[s] === powerEl || STEM_ELEMENTS[s] === wealthEl));
    const isClashed = stems.some((s, idx) => idx !== 1 && idx !== opponentIdx && STEM_CLASHES[s] === stems[opponentIdx]);
    
    if (!isClashed) return null; // If not clashed and has root, reject
  }

  // Check for Samhap/Banghap that supports the DM (In-seong)
  const wisdomHap = COMBINATIONS.SAM_HAP.find(h => h.element === wisdomEl) || COMBINATIONS.BANG_HAP.find(h => h.element === wisdomEl);
  if (wisdomHap) {
    const present = wisdomHap.branches.filter(b => branches.includes(b));
    if (present.length >= 2) {
      return null; // In-Bi-Tae-Wang (Standard Strong)
    }
  }

  // 1. 전왕격 (Jun-wang) Logic
  const checkJunWang = () => {
    const structures = [
      { name: '곡직격', nameEn: 'Bent and Straight (Wood Monarch)', element: 'Wood', dm: ['甲', '乙'], samhap: ['亥', '卯', '未'], banghap: ['寅', '卯', '辰'] },
      { name: '염상격', nameEn: 'Blazing Up (Fire Monarch)', element: 'Fire', dm: ['丙', '丁'], samhap: ['寅', '午', '戌'], banghap: ['巳', '午', '未'] },
      { name: '가색격', nameEn: 'Sowing and Reaping (Earth Monarch)', element: 'Earth', dm: ['戊', '己'], months: ['辰', '戌', '丑', '未'] },
      { name: '종혁격', nameEn: 'Following Revolution (Metal Monarch)', element: 'Metal', dm: ['庚', '辛'], samhap: ['巳', '酉', '丑'], banghap: ['申', '酉', '戌'] },
      { name: '윤하격', nameEn: 'Flowing Down (Water Monarch)', element: 'Water', dm: ['壬', '癸'], samhap: ['申', '子', '辰'], banghap: ['亥', '子', '丑'] }
    ];

    for (const s of structures) {
      if (s.dm.includes(dayMaster)) {
        const score = ratios[s.element];
        if (score >= 80) {
          // --- Rejection Logic (기각 로직) Start ---
          
          // 1. Hidden Root of Day Master (일간의 생존 본능)
          const rooting = ROOTING_DATA[dayMaster];
          const monthBranch = branches[2];
          const dayBranch = branches[1];
          const hasStrongRoot = rooting && (rooting.strong.includes(monthBranch) || rooting.strong.includes(dayBranch));
          
          if (hasStrongRoot) return null; // Reject if DM has its own strong root

          // 2. Yin Stem Characteristic: Harder to follow
          if (isYinGan && (ratios[powerEl] > 5 || ratios[wealthEl] > 5 || ratios[artistEl] > 15)) {
            return null;
          }
          
          // Apply Yin Strictness to ratio
          if (score < 80 * yinStrictnessRatio) return null;

          // 3. Earth DM Metal Filter: If Earth DM and Metal is strong (Sa-Yu-Chuk etc), it's not Jeon-Wang
          if (dmElement === 'Earth' && ((ratios?.['Metal'] || 0) > 25 || branches.some(b => b === '酉'))) {
             const hasMetalHap = (branches.includes('酉') && (branches.includes('巳') || branches.includes('丑')));
             if (hasMetalHap || (ratios?.['Metal'] || 0) > 30) return null;
          }

          // 4. Heavenly Stem Opponent (천간의 방해자)
          const hasFunctionalOpponentInStem = stems.some((stem, idx) => {
            if (idx === 1) return false; // Skip DM
            const el = STEM_ELEMENTS[stem];
            if (el !== powerEl && el !== wealthEl) return false;
            
            // Check if this opponent is clashed/neutralized by a neighbor
            const prev = idx > 0 ? stems[idx - 1] : null;
            const next = idx < stems.length - 1 ? stems[idx + 1] : null;
            const isClashed = (prev && STEM_CLASHES[prev] === stem) || (next && STEM_CLASHES[next] === stem);
            
            if (isClashed) return false; // Neutralized
            return true; // Functional opponent
          });

          if (hasFunctionalOpponentInStem) return null;

          // 3. Seasonal Support (월령의 배신)
          const isSeasonal = s.element === monthElement || 
                            (s.element === 'Earth' && ['辰', '戌', '丑', '未'].includes(monthZhi)) ||
                            (s.element === 'Wood' && ['寅', '卯'].includes(monthZhi)) ||
                            (s.element === 'Fire' && ['巳', '午'].includes(monthZhi)) ||
                            (s.element === 'Metal' && ['申', '酉'].includes(monthZhi)) ||
                            (s.element === 'Water' && ['亥', '子'].includes(monthZhi));

          if (!isSeasonal) {
            return {
              name: '오행편중(병)',
              nameEn: 'Elemental Overload (Burden)',
              category: 'Standard',
              mainElement: s.element,
              confidence: 30,
              description: "오행은 많으나 계절의 도움을 받지 못해 격국이 아닌 병(病)이 된 상태야.",
              enDescription: "Elements are numerous but lack seasonal support; it is a burden (disease) rather than a structure."
            };
          }

          // --- Rejection Logic End ---

          let hasHap = false;
          if (s.samhap) {
            const present = s.samhap.filter(b => branches.includes(b));
            if (present.length >= 2 && branches.includes(s.samhap[1])) hasHap = true;
          }
          if (s.banghap) {
            const present = s.banghap.filter(b => branches.includes(b));
            if (present.length >= 2 && branches.includes(monthZhi)) hasHap = true;
          }
          if (s.months && s.months.includes(monthZhi)) hasHap = true;

          if (hasHap) {
            // Check for opposing elements (Keuk)
            const dmIdx = ELEMENT_CYCLE.indexOf(s.element);
            const powerEl = ELEMENT_CYCLE[(dmIdx + 3) % 5];
            const wealthEl = ELEMENT_CYCLE[(dmIdx + 2) % 5];
            
            const powerRatio = ratios[powerEl] || 0;
            const wealthRatio = ratios[wealthEl] || 0;

            // If opposing elements are too strong, it's not a Monarch structure
            if (powerRatio > 20 || wealthRatio > 25) continue;

            const isDirty = powerRatio > 10 || wealthRatio > 15;
            
            return {
              name: s.name,
              nameEn: s.nameEn,
              category: 'Monarch',
              mainElement: s.element,
              confidence: isDirty ? 75 : 95,
              isDirty,
              description: isDirty 
                ? "전왕격의 기세가 있으나 방해 요소가 섞여 탁(濁)함. 연마가 필요함."
                : "기세가 한곳으로 쏠린 순수한 전왕격. 해당 오행의 기운을 따라야 함.",
              enDescription: isDirty
                ? "Has the momentum of a Monarch structure but is turbid (濁) due to impurities. Requires refinement."
                : "A pure Monarch structure with energy focused in one direction. Must follow that element's flow."
            };
          }
        }
      }
    }
    return null;
  };

  // 2. 특수 이미지 격국 (Image Logic) - 병적 불균형(화토중탁, 수화상전)만 핵심 격국 재판정으로 유지하고, 귀격들(목화통명, 금수쌍청 등)은 특정격국과 조화하기 위해 스페셜 패턴으로만 분리
  const checkImage = () => {
    // 수화상전 (수화기제/상쟁)
    if (['壬', '癸', '丙', '丁'].includes(dayMaster)) {
      const waterScore = ratios?.['Water'] || 0;
      const fireScore = ratios?.['Fire'] || 0;
      if (waterScore >= 35 && fireScore >= 35) {
        // Checking if one is strictly dominant or if they are in fierce battle
        return {
          name: '수화상전',
          nameEn: 'Water-Fire Conflict',
          category: 'Image',
          mainElement: 'Water',
          confidence: 85,
          isDirty: true,
          description: "수(水)와 화(火)가 극명하게 대립하며 거대한 폭발력을 품고 있는 격국.",
          enDescription: "A structure where Water and Fire are in fierce conflict, containing immense explosive potential."
        };
      }
    }

    // 화토중탁
    if (['丙', '丁', '戊', '己'].includes(dayMaster) && (monthElement === 'Fire' || ['辰', '戌', '丑', '未'].includes(monthZhi))) {
      // Strict filter for Fire-Earth Turbid
      const isYinEarth = dayMaster === '己';
      const isJeongFire = dayMaster === '丁';
      const fireEarthRatio = (ratios?.['Fire'] || 0) + (ratios?.['Earth'] || 0);
      
      // Filter 3: Leakage Check (Sik-sang Metal in stems with root)
      const hasFunctionalMetalInStem = stems.some((s, idx) => {
        if (idx === 1) return false;
        if (STEM_ELEMENTS[s] !== 'Metal') return false;
        
        // Check for clash (e.g., Gyeong-Metal vs Gap-Wood is not a clash that destroys Metal)
        return true;
      });
      
      const hasFunctionalMetalRoot = branches.some(b => {
        const el = BRANCH_ELEMENTS[b];
        if (el !== 'Metal') return false;
        
        // Metal root in Fire-heavy chart
        if ((ratios?.['Fire'] || 0) > 50) {
          const hasMetalHap = (branches.includes('酉') && (branches.includes('巳') || branches.includes('丑'))) ||
                             (branches.includes('申') && (branches.includes('子') || branches.includes('辰')));
          if (hasMetalHap) return true;
          return false; // Melted
        }
        return true;
      });
      
      if (hasFunctionalMetalInStem && hasFunctionalMetalRoot) {
        // If Metal is present and has functional root (like 19890618 10:00), it's not turbid
        return null;
      }

    if (fireEarthRatio >= 75 && (ratios?.['Water'] || 0) < 10) {
      // Check for Water survival
      const hasFunctionalWater = stems.some((s, idx) => {
        if (idx === 1) return false;
        if (STEM_ELEMENTS[s] !== 'Water') return false;
        
        // Check for clash (e.g., 1992's Im-Water vs Byeong-Fire)
        const prev = idx > 0 ? stems[idx - 1] : null;
        const next = idx < stems.length - 1 ? stems[idx + 1] : null;
        const isClashed = (prev && STEM_CLASHES[prev] === s) || (next && STEM_CLASHES[next] === s);
        if (isClashed) return false; // Evaporated
        return true;
      });

      if (hasFunctionalWater) return null; // If Water survives (like 19920611 10:40), it's not turbid

      // Filter 2: Yin Stem Strictness
      if ((isYinEarth || isJeongFire) && fireEarthRatio < 85) return null;
      
      return {
        name: '화토중탁',
        nameEn: 'Fire-Earth Heavy-Turbid',
        category: 'Image',
        mainElement: 'Metal', // Remedy is Metal (draining) or Water (cooling)
        confidence: 90,
        isDirty: true,
        description: "불과 흙이 뒤섞여 메마르고 탁해진 격국. 금(Metal)으로 설기하거나 수(Water)로 식혀야 함.",
        enDescription: "A dry and turbid structure where Fire and Earth are mixed. Needs Metal to drain or Water to cool."
      };
    }
    }
    return null;
  };

  return checkJunWang() || checkImage();
}
