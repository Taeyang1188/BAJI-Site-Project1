import { JIJANGAN, RELATIONSHIPS } from '../constants/bazi-data';

export const STEM_ELEMENTS: Record<string, string> = {
  '甲': 'Wood', '乙': 'Wood', '丙': 'Fire', '丁': 'Fire', '戊': 'Earth',
  '己': 'Earth', '庚': 'Metal', '辛': 'Metal', '壬': 'Water', '癸': 'Water'
};

export const BRANCH_ELEMENTS: Record<string, string> = {
  '寅': 'Wood', '卯': 'Wood', '巳': 'Fire', '午': 'Fire', '辰': 'Earth',
  '戌': 'Earth', '丑': 'Earth', '未': 'Earth', '申': 'Metal', '酉': 'Metal',
  '亥': 'Water', '子': 'Water'
};

const MODIFIERS = { CHUNG: 0.8, HAP: 1.5, HYEONG: 0.9 };

export function calculateBaziEnergy(pillars: any[], dayMaster: string) {
  const energyDistribution: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const weights = { month: 0.3, day: 0.2, year: 0.125, hour: 0.125, hidden: 0.25 };

  pillars.forEach((p, i) => {
    const weight = i === 1 ? weights.month : i === 2 ? weights.day : weights.year;
    energyDistribution[STEM_ELEMENTS[p.stem]] += weight * 100;
    energyDistribution[BRANCH_ELEMENTS[p.branch]] += weight * 100;
    
    JIJANGAN[p.branch].stems.forEach((stem, idx) => {
      energyDistribution[STEM_ELEMENTS[stem]] += weights.hidden * JIJANGAN[p.branch].ratios[idx] * 100;
    });
  });

  // Apply modifiers (simplified example)
  if (RELATIONSHIPS.CHUNG[pillars[1].branch] === pillars[2].branch) {
    energyDistribution[BRANCH_ELEMENTS[pillars[1].branch]] *= MODIFIERS.CHUNG;
  }

  const total = Object.values(energyDistribution).reduce((a, b) => a + b, 0);
  Object.keys(energyDistribution).forEach(k => energyDistribution[k] = Math.round((energyDistribution[k] / total) * 100));
  return energyDistribution;
}

export function calculateTenGods(dayMaster: string, targetElement: string) {
  const dmElement = STEM_ELEMENTS[dayMaster];
  const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const dmIdx = cycle.indexOf(dmElement);
  const targetIdx = cycle.indexOf(targetElement);
  
  const diff = (targetIdx - dmIdx + 5) % 5;
  const tenGods = ['BiGyean', 'SikSin', 'PyeonJae', 'PyeonGwan', 'PyeonIn'];
  return tenGods[diff];
}
