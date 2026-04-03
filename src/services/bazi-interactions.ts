
import { BaZiCard } from '../types';

export interface Interaction {
  type: string;
  subtype?: string;
  stems?: string[];
  branches?: string[];
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
    if (idx === 0) return "말년/자식";
    if (idx === 1) return "나 자신/배우자";
    if (idx === 2) return "사회생활/청년기";
    if (idx === 3) return "초년/조상";
  } else {
    if (idx === 0) return "Later Years/Children";
    if (idx === 1) return "Self/Spouse";
    if (idx === 2) return "Social Life/Youth";
    if (idx === 3) return "Early Years/Ancestors";
  }
  return "";
};

const getPillarName = (idx: number, lang: 'KO' | 'EN') => {
  if (lang === 'KO') {
    if (idx === 0) return "시지";
    if (idx === 1) return "일지";
    if (idx === 2) return "월지";
    if (idx === 3) return "연지";
  } else {
    if (idx === 0) return "Time Branch";
    if (idx === 1) return "Day Branch";
    if (idx === 2) return "Month Branch";
    if (idx === 3) return "Year Branch";
  }
  return "";
};

const getElementKo = (elementEn: string) => {
  const map: any = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)' };
  return map[elementEn] || elementEn;
};

function generateCombinationNote(
  type: string, 
  combBranches: string[], 
  resultElement: string, 
  pillars: BaZiCard[] | undefined, 
  allBranches: string[]
): string {
  if (!pillars) {
    return `${combBranches.join('-')} ${type} (${resultElement})`;
  }

  const indices = combBranches.map(b => allBranches.indexOf(b)).filter(idx => idx !== -1);
  
  if (indices.length < 2) {
    return `${combBranches.join('-')} ${type} (${resultElement})`;
  }

  const koPositions = indices.map(idx => `${getPillarName(idx, 'KO')}(${combBranches[indices.indexOf(idx)]})`).join('와 ');
  const koTenGods = indices.map(idx => `${pillars[idx].branchKoreanName}(${combBranches[indices.indexOf(idx)]})`).join('과 ');
  const koPillarMeanings = indices.map(idx => `${getPillarName(idx, 'KO')}(${getPillarMeaning(idx, 'KO')})`).join('와 ');
  
  let koDesc = "";
  if (type === "육합") {
    koDesc = `육합은 부부나 연인처럼 다정한 합입니다. ${koPillarMeanings}가 합을 하고 있어 정서적인 안정감을 줍니다. 또한 ${koTenGods}이 합을 하므로, 해당 십성들의 에너지가 서로 긍정적으로 연결되어 시너지를 냅니다.`;
  } else if (type === "삼합" || type === "반합") {
    koDesc = `${type}은 사회적인 목적을 위한 강력한 결속입니다. ${koPillarMeanings}가 합을 하여 ${getElementKo(resultElement)}의 기운을 만들어냅니다. ${koTenGods}이 결합하여 사회적 성취와 목적 달성을 향한 강한 원동력이 됩니다.`;
  } else if (type === "방합" || type === "준방합") {
    koDesc = `${type}은 같은 계절(방향)의 강력한 세력입니다. ${koPillarMeanings}가 모여 ${getElementKo(resultElement)}의 기운을 증폭시킵니다. ${koTenGods}이 무리를 지어 해당 분야에서 폭발적인 에너지와 추진력을 발휘하게 됩니다.`;
  } else if (type === "암합") {
    koDesc = `암합은 지장간 내부에서 일어나는 은밀한 합입니다. ${koPillarMeanings} 사이에 보이지 않는 강한 끌림과 결속력이 존재하며, ${koTenGods} 간의 은밀한 조력이나 연결고리가 있음을 암시합니다.`;
  }

  const koNote = `<div class="space-y-2"><b>${type}: ${combBranches.join('-')} ${type}</b><br/><b>위치:</b> ${koPositions}<br/><b>성격:</b> ${getElementKo(resultElement)}의 기운을 강화합니다.<br/><b>영향:</b> ${koDesc}</div>`;

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

  const enNote = `<div class="space-y-2"><b>${type}: ${combBranches.join('-')} ${type}</b><br/><b>Position:</b> ${enPositions}<br/><b>Nature:</b> Strengthens ${resultElement} energy.<br/><b>Influence:</b> ${enDesc}</div>`;

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
          element: stemHapPairs[pair].result,
          severity,
          note
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
    const present = group.branches.filter(b => branches.includes(b));
    if (present.length === 3) {
      interactions.push({
        type: "삼합",
        branches: group.branches,
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
    const present = group.branches.filter(b => branches.includes(b));
    if (present.length === 3) {
      interactions.push({
        type: "방합",
        branches: group.branches,
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
    const present = group.branches.filter(b => branches.includes(b));
    if (present.length === 3) {
      interactions.push({
        type: "삼형",
        branches: group.branches,
        category: group.category,
        severity: "full",
        note: `${group.branches.join('')} 삼형 (${group.category})`
      });
    } else if (present.length === 2) {
      interactions.push({
        type: "반형",
        branches: present,
        category: group.category,
        severity: "half",
        note: `${present.join('')} 반형 (${group.category})`
      });
    }
  });

  // c. 자형 (Self Punishments)
  const jaHyeongBranches = ['午', '酉', '亥', '辰'];
  jaHyeongBranches.forEach(b => {
    const indices: number[] = [];
    branches.forEach((branch, idx) => {
      if (branch === b) indices.push(idx);
    });
    
    if (indices.length >= 2) {
      let note = `${b}${b} 자형`;
      if (pillars) {
        const pNames = indices.map(idx => PILLAR_NAMES[idx]);
        let explanation = "";
        if (b === '午') explanation = "자기 확신이 강해 스스로 번민에 빠질 수 있으니 유연한 사고가 필요합니다.";
        else if (b === '酉') explanation = "칼날 같은 예민함으로 스스로를 다치게 할 수 있으니 마음의 여유가 필요합니다.";
        else if (b === '亥') explanation = "생각이 너무 깊어 우울감에 빠질 수 있으니 긍정적인 활동이 필요합니다.";
        else if (b === '辰') explanation = "이상과 현실의 괴리로 인한 스트레스가 있을 수 있으니 현실적인 목표 설정이 중요합니다.";
        
        note = `${pNames.join('와 ')}의 ${b}가 겹쳐 자형을 이룹니다. ${explanation}`;
      }

      interactions.push({
        type: "자형",
        branches: [b, b],
        category: "자형",
        severity: "full",
        note
      });
    }
  });

  // d. 복음 (Bok-eum)
  const uniqueBranches = Array.from(new Set(branches));
  uniqueBranches.forEach(b => {
    const count = branches.filter(x => x === b).length;
    if (count >= 2) {
      interactions.push({
        type: "복음",
        branches: Array(count).fill(b),
        category: "복음",
        severity: "full",
        note: `${b} 복음 (${count}개)`
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

        if (pillars && yongshinDetail && distance === 1) {
          const yongshinElement = yongshinDetail.primary.element;
          const stemIElement = STEM_ELEMENTS[stems[i]];
          const stemJElement = STEM_ELEMENTS[stems[j]];
          
          let yongshinIdx = -1;
          let otherIdx = -1;
          
          if (stemIElement === yongshinElement) {
            yongshinIdx = i;
            otherIdx = j;
          } else if (stemJElement === yongshinElement) {
            yongshinIdx = j;
            otherIdx = i;
          }
          
          if (yongshinIdx !== -1) {
            const yongshinStem = stems[yongshinIdx];
            const otherStem = stems[otherIdx];
            const otherPillarName = PILLAR_NAMES[otherIdx];
            const otherPillarNameEn = PILLAR_NAMES_EN[otherIdx];
            const otherTenGod = pillars[otherIdx].stemKoreanName;
            const otherTenGodEn = pillars[otherIdx].stemEnglishName;
            
            let pillarMeaning = "";
            let pillarMeaningEn = "";
            if (otherIdx === 0) { pillarMeaning = "말년/자식"; pillarMeaningEn = "Later Years/Children"; }
            else if (otherIdx === 1) { pillarMeaning = "나 자신/배우자"; pillarMeaningEn = "Self/Spouse"; }
            else if (otherIdx === 2) { pillarMeaning = "사회 생활"; pillarMeaningEn = "Social Life"; }
            else if (otherIdx === 3) { pillarMeaning = "국가/조상"; pillarMeaningEn = "Nation/Ancestors"; }
            
            note = `용신인 ${yongshinStem}가 ${otherPillarName}(${otherStem})과 충을 하고 있습니다. 이는 ${pillarMeaning}(${otherPillarName})에서 나의 ${otherTenGod}을(를) 지키기 위한 투쟁이 치열함을 뜻합니다.|The Yongshin ${yongshinStem} is clashing with the ${otherPillarNameEn} (${otherStem}). This indicates a fierce struggle to protect your ${otherTenGodEn} in the area of ${pillarMeaningEn} (${otherPillarNameEn}).`;
          }
        }

        interactions.push({
          type,
          stems: [stems[i], stems[j]],
          severity,
          note
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
        interactions.push({
          type: "지지충",
          branches: [branches[i], branches[j]],
          severity: "full",
          note: `${branches[i]}-${branches[j]} 지지충`
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
          severity: "full",
          note: `${branches[i]}-${branches[j]} 파`
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
          severity: "full",
          note: `${branches[i]}-${branches[j]} 해`
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
      note: `${(it.branches || []).join('')} 합이 충에 의해 해소됨`
    });
  });

  return { interactions, conflicts };
}
