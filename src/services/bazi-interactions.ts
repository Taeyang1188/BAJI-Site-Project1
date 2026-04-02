
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

export function calculateInteractions(stems: string[], branches: string[]): BaziInteractions {
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
          note: `${branches[i]}-${branches[j]} 육합 (${branchSixHapPairs[pair]})`
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
        note: `${group.branches.join('')} 삼합 (${group.element})`
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
          note: `${present.join('')} 반합 (${group.element})`
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
        note: `${group.branches.join('')} 방합 (${group.element})`
      });
    } else if (present.length === 2) {
      interactions.push({
        type: "방합",
        subtype: "준방합",
        branches: present,
        element: group.element,
        severity: "partial",
        partial: true,
        note: `${present.join('')} 준방합 (${group.element})`
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
    if (branches.filter(x => x === b).length >= 2) {
      interactions.push({
        type: "자형",
        branches: [b, b],
        category: "자형",
        severity: "full",
        note: `${b}${b} 자형`
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
