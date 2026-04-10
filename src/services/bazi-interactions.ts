
import { BaZiCard } from '../types';

export interface Interaction {
  type: string;
  subtype?: string;
  stems?: string[];
  branches?: string[];
  pillarIndices?: number[];
  elements?: string[];
  element?: string;
  severity: "full" | "half" | "partial";
  isFull?: boolean;
  partial?: boolean;
  note: string;
  category?: string;
}

export interface BaziInteractions {
  interactions: Interaction[];
  conflicts: { resolved: string; affected: string[]; note?: string }[];
}

const STEM_ELEMENTS: Record<string, string> = {
  '甲': 'Wood', '乙': 'Wood', '丙': 'Fire', '丁': 'Fire', '戊': 'Earth',
  '己': 'Earth', '庚': 'Metal', '辛': 'Metal', '壬': 'Water', '癸': 'Water'
};

const BRANCH_ELEMENTS: Record<string, string> = {
  '寅': 'Wood', '卯': 'Wood', '巳': 'Fire', '午': 'Fire', '辰': 'Earth',
  '戌': 'Earth', '丑': 'Earth', '未': 'Earth', '申': 'Metal', '酉': 'Metal',
  '亥': 'Water', '子': 'Water'
};

const PILLAR_NAMES = ["시주", "일주", "월주", "년주"];
const PILLAR_NAMES_EN = ["Time", "Day", "Month", "Year"];

const getPillarMeaning = (idx: number, lang: 'KO' | 'EN') => {
  if (lang === 'KO') {
    if (idx === 3) return "조상/근본";
    if (idx === 2) return "부모/사회";
    if (idx === 1) return "나/배우자";
    if (idx === 0) return "자식/미래";
  } else {
    if (idx === 3) return "Ancestors/Roots";
    if (idx === 2) return "Parents/Society";
    if (idx === 1) return "Self/Spouse";
    if (idx === 0) return "Children/Future";
  }
  return "";
};

const getPillarName = (idx: number, lang: 'KO' | 'EN') => {
  if (lang === 'KO') {
    if (idx === 3) return "연주";
    if (idx === 2) return "월주";
    if (idx === 1) return "일주";
    if (idx === 0) return "시주";
  } else {
    if (idx === 3) return "Year";
    if (idx === 2) return "Month";
    if (idx === 1) return "Day";
    if (idx === 0) return "Hour";
  }
  return "";
};

const getElementKo = (elementEn: string) => {
  const map: any = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)' };
  return map[elementEn] || elementEn;
};

const getInteractionTypeEn = (type: string) => {
  const map: Record<string, string> = {
    "천간합": "Stem Combination",
    "격합": "Distant Combination",
    "원합": "Far Combination",
    "육합": "Six Combination",
    "삼합": "Triple Combination",
    "반합": "Half Combination",
    "방합": "Directional Combination",
    "준방합": "Semi-Directional Combination",
    "암합": "Hidden Combination",
    "삼형": "Triple Punishment",
    "반형": "Half Punishment",
    "상형": "Mutual Punishment",
    "자형": "Self Punishment",
    "복음": "Duplicate Pillar",
    "지지충": "Branch Clash",
    "천간충": "Stem Clash",
    "격충": "Distant Clash",
    "원충": "Remote Clash",
    "파": "Destruction",
    "해": "Harm",
    "원진": "Resentment",
    "귀문": "Ghost Gate"
  };
  return map[type] || type;
};

function generateCombinationNote(
  type: string, 
  combBranches: string[], 
  resultElement: string, 
  pillars: BaZiCard[] | undefined, 
  allBranches: string[]
): string {
  if (!pillars) {
    return `${combBranches.join('-')} ${type} (${resultElement})|${combBranches.join('-')} ${type} (${resultElement})`;
  }

  const indices = combBranches.map(b => allBranches.indexOf(b)).filter(idx => idx !== -1);
  
  if (indices.length < 2) {
    return `${combBranches.join('-')} ${type} (${resultElement})|${combBranches.join('-')} ${type} (${resultElement})`;
  }

  const koPositions = indices.map(idx => `${getPillarName(idx, 'KO')}(${combBranches[indices.indexOf(idx)]})`).join('와 ');
  const koTenGods = indices.map(idx => `${pillars[idx].branchKoreanName}(${combBranches[indices.indexOf(idx)]})`).join('과 ');
  const koPillarMeanings = indices.map(idx => `${getPillarName(idx, 'KO')}(${getPillarMeaning(idx, 'KO')})`).join('와 ');
  
  let koDesc = "";
  if (type === "육합") {
    koDesc = `육합은 부부나 연인처럼 다정한 합이야. ${koPillarMeanings}가 합을 하고 있어 정서적인 안정감을 줘. 또한 ${koTenGods}이 합을 하므로, 해당 십성들의 에너지가 서로 긍정적으로 연결되어 시너지를 내.`;
  } else if (type === "삼합" || type === "반합") {
    koDesc = `${type}은 사회적인 목적을 위한 강력한 결속이야. ${koPillarMeanings}가 합을 하여 ${getElementKo(resultElement)}의 기운을 만들어내. ${koTenGods}이 결합하여 사회적 성취와 목적 달성을 향한 강한 원동력이 돼.`;
  } else if (type === "방합" || type === "준방합") {
    koDesc = `${type}은 같은 계절(방향)의 강력한 세력이야. ${koPillarMeanings}가 모여 ${getElementKo(resultElement)}의 기운을 증폭시켜. ${koTenGods}이 무리를 지어 해당 분야에서 폭발적인 에너지와 추진력을 발휘하게 돼.`;
  } else if (type === "암합") {
    koDesc = `암합은 지장간 내부에서 일어나는 은밀한 합이야. ${koPillarMeanings} 사이에 보이지 않는 강한 끌림과 결속력이 존재하며, ${koTenGods} 간의 은밀한 조력이나 연결고리가 있음을 암시해.`;
  }

  const koNote = `<div class="space-y-2"><b>${type}: ${combBranches.join('-')}</b><br/><b>위치:</b> ${koPositions}<br/><b>성격:</b> ${getElementKo(resultElement)}의 기운을 강화해.<br/><b>영향:</b> ${koDesc}</div>`;

  const enPositions = indices.map(idx => `${getPillarName(idx, 'EN')} (${combBranches[indices.indexOf(idx)]})`).join(' and ');
  const enTenGods = indices.map(idx => `${pillars[idx].branchEnglishName} (${combBranches[indices.indexOf(idx)]})`).join(' and ');
  const enPillarMeanings = indices.map(idx => `${getPillarName(idx, 'EN')} (${getPillarMeaning(idx, 'EN')})`).join(' and ');
  
  let enDesc = "";
  if (type === "육합") {
    enDesc = `The Six Combination is an affectionate bond like a couple. The ${enPillarMeanings} are combining, providing emotional stability. Also, the ${enTenGods} combine, creating a positive synergy between these energies.`;
  } else if (type === "삼합" || type === "반합") {
    enDesc = `This combination is a strong alliance for social purpose. The ${enPillarMeanings} combine to create ${resultElement} energy. The ${enTenGods} unite to become a strong driving force for social achievement.`;
  } else if (type === "방합" || type === "준방합") {
    enDesc = `This is a powerful force of the same season/direction. The ${enPillarMeanings} gather to amplify ${resultElement} energy. The ${enTenGods} form a group, exerting explosive energy and drive in their respective fields.`;
  } else if (type === "암합") {
    enDesc = `The Hidden Combination is a secret bond within the hidden stems. There is an invisible strong attraction between ${enPillarMeanings}, suggesting secret assistance or connection between ${enTenGods}.`;
  }

  const enNote = `<div class="space-y-2"><b>${getInteractionTypeEn(type)}: ${combBranches.join('-')}</b><br/><b>Position:</b> ${enPositions}<br/><b>Nature:</b> Strengthens ${resultElement} energy.<br/><b>Influence:</b> ${enDesc}</div>`;

  return `${koNote}|${enNote}`;
}

function generateStemInteractionNote(
  type: string,
  stems: string[],
  pillars: BaZiCard[] | undefined,
  indices: number[],
  element?: string
): string {
  if (!pillars) return `${stems.join('-')} ${type}|${stems.join('-')} ${type}`;

  const koPositions = indices.map(idx => `${getPillarName(idx, 'KO')}(${stems[indices.indexOf(idx)]})`).join('와 ');
  const koPillarMeanings = indices.map(idx => `${getPillarName(idx, 'KO')}(${getPillarMeaning(idx, 'KO')})`).join('와 ');
  const koTenGods = indices.map(idx => `${pillars[idx].stemKoreanName}(${stems[indices.indexOf(idx)]})`).join('과 ');

  const enPositions = indices.map(idx => `${getPillarName(idx, 'EN')} (${stems[indices.indexOf(idx)]})`).join(' and ');
  const enPillarMeanings = indices.map(idx => `${getPillarName(idx, 'EN')} (${getPillarMeaning(idx, 'EN')})`).join(' and ');
  const enTenGods = indices.map(idx => `${pillars[idx].stemEnglishName} (${stems[indices.indexOf(idx)]})`).join(' and ');

  let koEffect = "";
  let enEffect = "";

  if (type.includes("합")) {
    koEffect = `${koPillarMeanings} 간의 정신적 결합이야. ${koTenGods}이 서로 합을 하여 지향하는 가치가 일치함을 의미해.`;
    enEffect = `Mental combination between ${enPillarMeanings}. Represents alignment of values between ${enTenGods}.`;
  } else if (type === "천간충") {
    koEffect = `${koPillarMeanings} 간의 정신적 충돌이야. ${koTenGods}이 서로 부딪혀 생각의 차이나 목표의 갈등이 생길 수 있어.`;
    enEffect = `Mental conflict between ${enPillarMeanings}. Suggests differences in thoughts or goals between ${enTenGods}.`;
  } else if (type === "격충") {
    koEffect = `${koPillarMeanings} 간의 간접적인 정신적 충돌이야. ${koTenGods}이 서로 부딪혀 생각의 차이가 생길 수 있으나 제한적이야.`;
    enEffect = `Indirect mental conflict between ${enPillarMeanings}. Suggests differences in thoughts between ${enTenGods} but with limited impact.`;
  } else if (type === "원충") {
    koEffect = `${koPillarMeanings} 간의 먼 정신적 충돌이야. ${koTenGods}이 서로 부딪히나 그 영향은 미미해.`;
    enEffect = `Remote mental conflict between ${enPillarMeanings}. Suggests differences in thoughts between ${enTenGods} but with minimal impact.`;
  } else {
    koEffect = `${koPillarMeanings} 간의 정신적 충돌이야. ${koTenGods}이 서로 부딪혀 생각의 차이나 목표의 갈등이 생길 수 있어.`;
    enEffect = `Mental conflict between ${enPillarMeanings}. Suggests differences in thoughts or goals between ${enTenGods}.`;
  }

  const koNote = `<div class="space-y-1"><b>${type}: ${stems.join('-')}</b><br/><b>위치:</b> ${koPositions}<br/><b>영향:</b> ${koEffect}</div>`;
  const enNote = `<div class="space-y-1"><b>${getInteractionTypeEn(type)}: ${stems.join('-')}</b><br/><b>Position:</b> ${enPositions}<br/><b>Influence:</b> ${enEffect}</div>`;

  return `${koNote}|${enNote}`;
}

function generateInteractionNote(
  type: string,
  branches: string[],
  pillars: BaZiCard[] | undefined,
  allBranches: string[],
  category?: string,
  pillarIndices?: number[]
): string {
  if (!pillars) return `${branches.join('-')} ${type}|${branches.join('-')} ${type}`;

  const indices = pillarIndices || branches.map(b => allBranches.indexOf(b)).filter(idx => idx !== -1);
  if (indices.length < 2) return `${branches.join('-')} ${type}|${branches.join('-')} ${type}`;

  const koPositions = indices.map(idx => `${getPillarName(idx, 'KO')}(${branches[indices.indexOf(idx)]})`).join('와 ');
  const koPillarMeanings = indices.map(idx => `${getPillarName(idx, 'KO')}(${getPillarMeaning(idx, 'KO')})`).join('와 ');
  const koTenGods = indices.map(idx => `${pillars[idx].branchKoreanName}(${branches[indices.indexOf(idx)]})`).join('과 ');

  const enPositions = indices.map(idx => `${getPillarName(idx, 'EN')} (${branches[indices.indexOf(idx)]})`).join(' and ');
  const enPillarMeanings = indices.map(idx => `${getPillarName(idx, 'EN')} (${getPillarMeaning(idx, 'EN')})`).join(' and ');
  const enTenGods = indices.map(idx => `${pillars[idx].branchEnglishName} (${branches[indices.indexOf(idx)]})`).join(' and ');

  let koEffect = "";
  let enEffect = "";

  if (type === "지지충") {
    koEffect = `${koPillarMeanings} 간의 정면 충돌이야. ${koTenGods}이 서로 부딪혀 해당 영역에서의 급격한 변화나 갈등이 예상돼.`;
    enEffect = `Direct collision between ${enPillarMeanings}. Rapid changes or friction expected between ${enTenGods}.`;
  } else if (type === "격충") {
    koEffect = `${koPillarMeanings} 간의 간접적인 충돌이야. ${koTenGods}이 서로 부딪혀 갈등이 예상되나 그 영향은 제한적이야.`;
    enEffect = `Indirect collision between ${enPillarMeanings}. Friction expected between ${enTenGods} but with limited impact.`;
  } else if (type === "원충") {
    koEffect = `${koPillarMeanings} 간의 먼 충돌이야. ${koTenGods}이 서로 부딪히나 그 영향은 미미해.`;
    enEffect = `Remote collision between ${enPillarMeanings}. Friction expected between ${enTenGods} but with minimal impact.`;
  } else if (type === "삼형" || type === "반형") {
    koEffect = `${koPillarMeanings} 간의 형(刑) 작용이야. ${koTenGods} 사이의 조정이나 법적/심리적 압박이 있을 수 있으니 세밀한 관리가 필요해.`;
    enEffect = `Punishment between ${enPillarMeanings}. May lead to adjustments or legal/psychological pressure between ${enTenGods}.`;
  } else if (type === "자형") {
    koEffect = `${koPillarMeanings}에서 스스로를 볶는 기운이 강해져. ${koTenGods}의 에너지가 과잉되어 스스로 심리적 압박을 가할 수 있으니 주의가 필요해.`;
    enEffect = `Self-punishment in ${enPillarMeanings}. Overactive energy of ${enTenGods} may cause internal stress.`;
  } else if (type === "복음") {
    koEffect = `${koPillarMeanings}에 같은 기운이 중첩됐어. ${koTenGods}의 에너지가 정체되거나 중복된 고민이 생길 수 있는 시기야.`;
    enEffect = `Overlapping energy in ${enPillarMeanings}. Stagnation or repetitive concerns related to ${enTenGods}.`;
  } else if (type === "파") {
    koEffect = `${koPillarMeanings} 간의 파괴 작용이야. ${koTenGods} 사이의 관계나 일의 마무리에 있어 균열이 생기지 않도록 주의해야 해.`;
    enEffect = `Destruction between ${enPillarMeanings}. Caution needed in relationships or finalizing tasks between ${enTenGods}.`;
  } else if (type === "해") {
    koEffect = `${koPillarMeanings} 간의 해로움이야. ${koTenGods} 사이의 보이지 않는 방해나 시기, 질투로 인한 갈등을 경계해야 해.`;
    enEffect = `Harm between ${enPillarMeanings}. Guard against invisible interference or jealousy between ${enTenGods}.`;
  }

  const koNote = `<div class="space-y-1"><b>${type}: ${branches.join('-')}</b><br/><b>위치:</b> ${koPositions}<br/><b>영향:</b> ${koEffect}</div>`;
  const enNote = `<div class="space-y-1"><b>${getInteractionTypeEn(type)}: ${branches.join('-')}</b><br/><b>Position:</b> ${enPositions}<br/><b>Influence:</b> ${enEffect}</div>`;

  return `${koNote}|${enNote}`;
}

export function calculateInteractions(stems: string[], branches: string[], pillars?: BaZiCard[], yongshinDetail?: any): BaziInteractions {
  const interactions: Interaction[] = [];
  const conflicts: { resolved: string; affected: string[]; note?: string }[] = [];

  // 1. 천간합 (Stem Combinations)
  const stemHapPairs: Record<string, { result: string }> = {
    '甲己': { result: 'Earth' },
    '乙庚': { result: 'Metal' },
    '丙辛': { result: 'Water' },
    '丁壬': { result: 'Fire' },
    '戊癸': { result: 'Fire' }
  };

  for (let i = 0; i < stems.length; i++) {
    for (let j = i + 1; j < stems.length; j++) {
      const pair = [stems[i], stems[j]].sort().join('');
      if (stemHapPairs[pair]) {
        const distance = Math.abs(i - j);
        let type = "천간합";
        let note = `${stems[i]}-${stems[j]} 천간합 (${stemHapPairs[pair].result})`;
        let severity: Interaction["severity"] = "full";

        if (distance === 2) {
          type = "격합";
          note = `${stems[i]}-${stems[j]} 격합 (영향력 약함)`;
          severity = "half";
        } else if (distance === 3) {
          type = "원합";
          note = `${stems[i]}-${stems[j]} 원합 (영향력 미미)`;
          severity = "partial";
        }

        interactions.push({
          type,
          stems: [stems[i], stems[j]],
          pillarIndices: [i, j],
          element: stemHapPairs[pair].result,
          severity,
          note: generateStemInteractionNote(type, [stems[i], stems[j]], pillars, [i, j], stemHapPairs[pair].result)
        });
      }
    }
  }

  // 2. 지지 육합 (Branch Six Combinations)
  const branchSixHapPairs: Record<string, string> = {
    '子丑': 'Earth', '寅亥': 'Wood', '卯戌': 'Fire', '辰酉': 'Metal', '巳申': 'Water', '午未': 'Fire'
  };

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const pair = [branches[i], branches[j]].sort().join('');
      if (branchSixHapPairs[pair]) {
        interactions.push({
          type: "육합",
          branches: [branches[i], branches[j]],
          pillarIndices: [i, j],
          element: branchSixHapPairs[pair],
          severity: "full",
          note: generateCombinationNote("육합", [branches[i], branches[j]], branchSixHapPairs[pair], pillars, branches)
        });
      }
    }
  }

  // 3. 지지 삼합 (Branch Triple Combinations)
  const samHapGroups = [
    { branches: ['申', '子', '辰'], element: 'Water' },
    { branches: ['寅', '午', '戌'], element: 'Fire' },
    { branches: ['巳', '酉', '丑'], element: 'Metal' },
    { branches: ['亥', '卯', '未'], element: 'Wood' }
  ];

  const centers = ['子', '午', '酉', '卯'];

  samHapGroups.forEach(group => {
    const presentIndices = group.branches.map(b => branches.indexOf(b)).filter(idx => idx !== -1);
    const present = presentIndices.map(idx => branches[idx]);

    if (present.length === 3) {
      interactions.push({
        type: "삼합",
        branches: group.branches,
        pillarIndices: presentIndices,
        element: group.element,
        severity: "full",
        isFull: true,
        note: generateCombinationNote("삼합", group.branches, group.element, pillars, branches)
      });
    } else if (present.length === 2) {
      // Check if center is present
      const center = group.branches[1]; // Center is always the middle one in the standard list
      if (branches.includes(center)) {
        interactions.push({
          type: "반합",
          branches: present,
          pillarIndices: presentIndices,
          element: group.element,
          severity: "half",
          isFull: false,
          note: generateCombinationNote("반합", present, group.element, pillars, branches)
        });
      }
    }
  });

  // 4. 방합 (Directional Combinations)
  const bangHapGroups = [
    { branches: ['寅', '卯', '辰'], element: 'Wood', name: '방합', enName: 'Directional Combination' },
    { branches: ['巳', '午', '未'], element: 'Fire', name: '방합', enName: 'Directional Combination' },
    { branches: ['申', '酉', '戌'], element: 'Metal', name: '방합', enName: 'Directional Combination' },
    { branches: ['亥', '子', '丑'], element: 'Water', name: '방합', enName: 'Directional Combination' }
  ];

  bangHapGroups.forEach(group => {
    const presentIndices = group.branches.map(b => branches.indexOf(b)).filter(idx => idx !== -1);
    const present = presentIndices.map(idx => branches[idx]);

    if (present.length === 3) {
      interactions.push({
        type: "방합",
        branches: group.branches,
        pillarIndices: presentIndices,
        element: group.element,
        severity: "full",
        partial: false,
        note: generateCombinationNote("방합", group.branches, group.element, pillars, branches)
      });
    } else if (present.length === 2) {
      interactions.push({
        type: "방합",
        subtype: "준방합",
        branches: present,
        pillarIndices: presentIndices,
        element: group.element,
        severity: "partial",
        partial: true,
        note: generateCombinationNote("준방합", present, group.element, pillars, branches)
      });
    }
  });

  // 5. 형 (Punishments)
  // a. 삼형 (Triple Punishments)
  const samHyeongGroups = [
    { branches: ['寅', '巳', '申'], category: '지세', enCategory: 'Power/Force' },
    { branches: ['丑', '戌', '未'], category: '무은', enCategory: 'Ingratitude' }
  ];

  samHyeongGroups.forEach(group => {
    const presentIndices = group.branches.map(b => branches.indexOf(b)).filter(idx => idx !== -1);
    const present = presentIndices.map(idx => branches[idx]);

    if (present.length === 3) {
      interactions.push({
        type: "삼형",
        branches: group.branches,
        pillarIndices: presentIndices,
        category: group.category,
        severity: "full",
        note: generateInteractionNote("삼형", group.branches, pillars, branches, group.category, presentIndices)
      });
    } else if (present.length === 2) {
      interactions.push({
        type: "반형",
        branches: present,
        pillarIndices: presentIndices,
        category: group.category,
        severity: "half",
        note: generateInteractionNote("반형", present, pillars, branches, group.category, presentIndices)
      });
    }
  });

  // b. 상형 (Mutual Punishment)
  const sangHyeong = ['子', '卯'];
  const sangIndices = sangHyeong.map(b => branches.indexOf(b)).filter(idx => idx !== -1);
  if (sangIndices.length === 2) {
    interactions.push({
      type: "반형",
      subtype: "상형",
      branches: sangHyeong,
      pillarIndices: sangIndices,
      category: "무례",
      severity: "half",
      note: generateInteractionNote("반형", sangHyeong, pillars, branches, "무례", sangIndices)
    });
  }

  // c. 자형 (Self Punishments)
  const jaHyeongBranches = ['午', '酉', '亥', '辰'];
  jaHyeongBranches.forEach(b => {
    const indices: number[] = [];
    branches.forEach((branch, idx) => {
      if (branch === b) indices.push(idx);
    });
    
    if (indices.length >= 2) {
      interactions.push({
        type: "자형",
        branches: [b, b],
        pillarIndices: indices,
        category: "자형",
        severity: "full",
        note: generateInteractionNote("자형", [b, b], pillars, branches, "자형", indices)
      });
    }
  });

  // d. 복음 (Bok-eum)
  const uniqueBranches = Array.from(new Set(branches));
  uniqueBranches.forEach(b => {
    const indices: number[] = [];
    branches.forEach((branch, idx) => {
      if (branch === b) indices.push(idx);
    });

    if (indices.length >= 2) {
      interactions.push({
        type: "복음",
        branches: Array(indices.length).fill(b),
        pillarIndices: indices,
        category: "복음",
        severity: "full",
        note: generateInteractionNote("복음", Array(indices.length).fill(b), pillars, branches, "복음", indices)
      });
    }
  });

  // 6. 충 (Clashes)
  const stemChungPairs: Record<string, string> = {
    '甲': '庚', '庚': '甲', '乙': '辛', '辛': '乙', '丙': '壬', '壬': '丙', '丁': '癸', '癸': '丁'
  };
  for (let i = 0; i < stems.length; i++) {
    for (let j = i + 1; j < stems.length; j++) {
      if (stemChungPairs[stems[i]] === stems[j]) {
        const distance = Math.abs(i - j);
        let type = "천간충";
        let note = `${stems[i]}-${stems[j]} 천간충`;
        let severity: Interaction["severity"] = "full";

        if (distance === 2) {
          type = "격충";
          note = `${stems[i]}-${stems[j]} 격충 (영향력 약함)`;
          severity = "half";
        } else if (distance === 3) {
          type = "원충";
          note = `${stems[i]}-${stems[j]} 원충 (영향력 미미)`;
          severity = "partial";
        }

        interactions.push({
          type,
          stems: [stems[i], stems[j]],
          pillarIndices: [i, j],
          severity,
          note: generateStemInteractionNote(type, [stems[i], stems[j]], pillars, [i, j])
        });
      }
    }
  }

  const branchChungPairs: Record<string, string> = {
    '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
  };
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (branchChungPairs[branches[i]] === branches[j]) {
        const distance = Math.abs(i - j);
        let type = "지지충";
        let severity: Interaction["severity"] = "full";

        if (distance === 2) {
          type = "격충";
          severity = "half";
        } else if (distance === 3) {
          type = "원충";
          severity = "partial";
        }

        interactions.push({
          type,
          branches: [branches[i], branches[j]],
          pillarIndices: [i, j],
          severity,
          note: generateInteractionNote(type, [branches[i], branches[j]], pillars, branches, undefined, [i, j])
        });
      }
    }
  }

  // 7. 파 (Destructions)
  const branchPaPairs: Record<string, string> = {
    '子': '酉', '酉': '子', '午': '卯', '卯': '午', '巳': '申', '申': '巳', '寅': '亥', '亥': '寅', '辰': '丑', '丑': '辰', '戌': '未', '未': '戌'
  };
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (branchPaPairs[branches[i]] === branches[j]) {
        interactions.push({
          type: "파",
          branches: [branches[i], branches[j]],
          pillarIndices: [i, j],
          severity: "full",
          note: generateInteractionNote("파", [branches[i], branches[j]], pillars, branches, undefined, [i, j])
        });
      }
    }
  }

  // 8. 해 (Harms)
  const branchHaePairs: Record<string, string> = {
    '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '巳', '巳': '寅', '卯': '辰', '辰': '卯', '申': '亥', '亥': '申', '酉': '戌', '戌': '酉'
  };
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      if (branchHaePairs[branches[i]] === branches[j]) {
        interactions.push({
          type: "해",
          branches: [branches[i], branches[j]],
          pillarIndices: [i, j],
          severity: "full",
          note: generateInteractionNote("해", [branches[i], branches[j]], pillars, branches, undefined, [i, j])
        });
      }
    }
  }

  // Conflict Resolution (Simplified)
  // 충개합: If there's a clash and a combination involving the same branches, the clash breaks the combination.
  const clashBranches = interactions.filter(it => it.type === "지지충").flatMap(it => it.branches || []);
  const combinationsToBreak = interactions.filter(it => (it.type === "육합" || it.type === "삼합" || it.type === "반합") && it.branches?.some(b => clashBranches.includes(b)));

  combinationsToBreak.forEach(it => {
    conflicts.push({
      resolved: "충>합 (충개합)",
      affected: it.branches || [],
      note: `${(it.branches || []).join('')} 합이 충에 의해 해소됨|Combination ${(it.branches || []).join('')} is broken by Clash`
    });
  });

  return { interactions, conflicts };
}
