import { BAZI_MAPPING } from '../constants/bazi-mapping';

// 1. 격국 (Structure/Pattern) - Simplified based on Month Branch (월지) and Day Master (일간)
export const calculateGeJu = (dayGan: string, monthZhi: string) => {
  const monthZhiMainQi: Record<string, string> = {
    '子': '癸', '丑': '己', '寅': '甲', '卯': '乙',
    '辰': '戊', '巳': '丙', '午': '丁', '未': '己',
    '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬'
  };
  
  const mainQi = monthZhiMainQi[monthZhi];
  if (!mainQi) return '건록격(建祿格)';

  // Calculate Ten God of the main Qi relative to Day Master
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const stemsInfo: Record<string, { element: string, polarity: number }> = {
    '甲': { element: 'Wood', polarity: 1 }, '乙': { element: 'Wood', polarity: -1 },
    '丙': { element: 'Fire', polarity: 1 }, '丁': { element: 'Fire', polarity: -1 },
    '戊': { element: 'Earth', polarity: 1 }, '己': { element: 'Earth', polarity: -1 },
    '庚': { element: 'Metal', polarity: 1 }, '辛': { element: 'Metal', polarity: -1 },
    '壬': { element: 'Water', polarity: 1 }, '癸': { element: 'Water', polarity: -1 }
  };

  const self = stemsInfo[dayGan];
  const target = stemsInfo[mainQi];
  
  if (!self || !target) return '건록격(建祿格)';

  const sIdx = elements.indexOf(self.element);
  const tIdx = elements.indexOf(target.element);
  const diff = (tIdx - sIdx + 5) % 5;
  const samePolarity = self.polarity === target.polarity;

  let tenGod = '';
  if (diff === 0) tenGod = samePolarity ? '비견' : '겁재';
  else if (diff === 1) tenGod = samePolarity ? '식신' : '상관';
  else if (diff === 2) tenGod = samePolarity ? '편재' : '정재';
  else if (diff === 3) tenGod = samePolarity ? '편관' : '정관';
  else if (diff === 4) tenGod = samePolarity ? '편인' : '정인';

  if (tenGod === '비견' || tenGod === '겁재') return '건록격(建祿格) / 양인격(羊刃格)';
  return `${tenGod}격(${tenGod}格)`;
};

// 2. 용신 (Useful God) - Simplified based on dominant element
export const calculateYongShen = (elementCounts: Record<string, number>, dayMasterElement: string) => {
  // Very simplified logic: if day master element is too strong, use weakening element. If too weak, use strengthening element.
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const dmIdx = elements.indexOf(dayMasterElement);
  
  const motherIdx = (dmIdx - 1 + 5) % 5;
  const childIdx = (dmIdx + 1) % 5;
  const wealthIdx = (dmIdx + 2) % 5;
  const powerIdx = (dmIdx + 3) % 5;

  const myStrength = (elementCounts[dayMasterElement] || 0) + (elementCounts[elements[motherIdx]] || 0);
  const otherStrength = (elementCounts[elements[childIdx]] || 0) + (elementCounts[elements[wealthIdx]] || 0) + (elementCounts[elements[powerIdx]] || 0);

  if (myStrength > otherStrength) {
    // Strong Day Master: Use Power, Wealth, or Child
    if ((elementCounts[elements[powerIdx]] || 0) > 0) return `${elements[powerIdx]} (관성 용신)`;
    if ((elementCounts[elements[wealthIdx]] || 0) > 0) return `${elements[wealthIdx]} (재성 용신)`;
    return `${elements[childIdx]} (식상 용신)`;
  } else {
    // Weak Day Master: Use Mother or Self
    if ((elementCounts[elements[motherIdx]] || 0) > 0) return `${elements[motherIdx]} (인성 용신)`;
    return `${dayMasterElement} (비겁 용신)`;
  }
};

// 3. 합형충파해 (Combinations, Clashes, Punishments, Harms)
export const calculateInteractions = (branches: string[]) => {
  const interactions: string[] = [];
  
  // Clashes (충)
  const clashes: Record<string, string> = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥'
  };
  
  // Combinations (합)
  const combinations: Record<string, string> = {
    '子': '丑', '寅': '亥', '卯': '戌', '辰': '酉', '巳': '申', '午': '未'
  };

  // Punishments (형)
  const punishments = [
    ['寅', '巳', '申'], ['丑', '戌', '未'], ['子', '卯'], ['辰', '辰'], ['午', '午'], ['酉', '酉'], ['亥', '亥']
  ];

  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const b1 = branches[i];
      const b2 = branches[j];
      
      if (clashes[b1] === b2 || clashes[b2] === b1) {
        interactions.push(`${b1}-${b2} 충(沖)`);
      }
      if (combinations[b1] === b2 || combinations[b2] === b1) {
        interactions.push(`${b1}-${b2} 육합(六合)`);
      }
    }
  }

  // Check punishments
  punishments.forEach(p => {
    if (p.length === 3) {
      if (branches.includes(p[0]) && branches.includes(p[1]) && branches.includes(p[2])) {
        interactions.push(`${p.join('')} 삼형(三刑)`);
      } else if ((branches.includes(p[0]) && branches.includes(p[1])) || 
                 (branches.includes(p[1]) && branches.includes(p[2])) || 
                 (branches.includes(p[0]) && branches.includes(p[2]))) {
        interactions.push(`${p[0]}${p[1]}${p[2]} 반형(半刑)`);
      }
    } else if (p.length === 2) {
      if (p[0] === p[1]) {
        if (branches.filter(b => b === p[0]).length >= 2) {
          interactions.push(`${p[0]}${p[1]} 자형(自刑)`);
        }
      } else {
        if (branches.includes(p[0]) && branches.includes(p[1])) {
          interactions.push(`${p[0]}${p[1]} 형(刑)`);
        }
      }
    }
  });

  return Array.from(new Set(interactions));
};

// 4. 신살 (Divine Stars)
export const calculateShenSha = (dayGan: string, dayZhi: string, yearZhi: string, branches: string[]) => {
  const shenSha: { name: string, description: string }[] = [];

  // 천을귀인 (Tian Yi Gui Ren)
  const tianYi: Record<string, string[]> = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '辛': ['寅', '午'],
    '壬': ['卯', '巳'], '癸': ['卯', '巳']
  };

  // 역마살 (Yi Ma)
  const yiMa: Record<string, string> = {
    '申': '寅', '子': '寅', '辰': '寅',
    '寅': '申', '午': '申', '戌': '申',
    '亥': '巳', '卯': '巳', '未': '巳',
    '巳': '亥', '酉': '亥', '丑': '亥'
  };

  // 도화살 (Tao Hua)
  const taoHua: Record<string, string> = {
    '申': '酉', '子': '酉', '辰': '酉',
    '寅': '卯', '午': '卯', '戌': '卯',
    '亥': '子', '卯': '子', '未': '子',
    '巳': '午', '酉': '午', '丑': '午'
  };

  // 백호대살 (Bai Hu)
  const baiHu = ['甲辰', '乙未', '丙戌', '丁丑', '戊辰', '壬戌', '癸丑'];

  // 괴강살 (Kui Gang)
  const kuiGang = ['庚辰', '庚戌', '壬辰', '壬戌', '戊戌'];

  branches.forEach(b => {
    if (tianYi[dayGan]?.includes(b)) {
      shenSha.push({ name: '천을귀인(天乙貴人)', description: '어려움 속에서도 돕는 귀인이 나타나 위기를 모면하게 해주는 길성입니다. 현대에는 인적 네트워크와 위기 관리 능력으로 해석됩니다.' });
    }
    if (yiMa[dayZhi] === b || yiMa[yearZhi] === b) {
      shenSha.push({ name: '역마살(驛馬煞)', description: '이동과 변화를 상징합니다. 현대에는 글로벌 비즈니스, 잦은 출장, 혹은 변화를 두려워하지 않는 개척 정신으로 긍정적으로 해석됩니다.' });
    }
    if (taoHua[dayZhi] === b || taoHua[yearZhi] === b) {
      shenSha.push({ name: '도화살(桃花煞)', description: '매력과 인기를 상징합니다. 현대에는 연예인, 인플루언서, 대인관계에서의 강한 매력과 스타성으로 긍정적으로 해석됩니다.' });
    }
  });

  const dayGanZhi = `${dayGan}${dayZhi}`;
  if (baiHu.includes(dayGanZhi)) {
    shenSha.push({ name: '백호대살(白虎大煞)', description: '강한 에너지와 압박을 상징합니다. 현대에는 프로페셔널한 전문가, 강한 카리스마, 혹은 큰 수술이나 사고를 이겨내는 강인한 생명력으로 해석됩니다.' });
  }
  if (kuiGang.includes(dayGanZhi)) {
    shenSha.push({ name: '괴강살(魁罡煞)', description: '우두머리의 기질과 굽히지 않는 강한 고집을 상징합니다. 현대에는 강력한 리더십, 결단력, 주체적인 삶을 개척하는 힘으로 해석됩니다.' });
  }

  // Deduplicate
  const uniqueShenSha = [];
  const seen = new Set();
  for (const s of shenSha) {
    if (!seen.has(s.name)) {
      seen.add(s.name);
      uniqueShenSha.push(s);
    }
  }

  return uniqueShenSha;
};

// 5. 십성비율 (Ten Gods Ratio)
export const calculateTenGodsRatio = (pillars: any[]) => {
  const counts: Record<string, number> = {
    '비겁(Self/Rival)': 0,
    '식상(Artist/Rebel)': 0,
    '재성(Wealth)': 0,
    '관성(Power/Judge)': 0,
    '인성(Mystic/Sage)': 0
  };

  let total = 0;

  pillars.forEach(p => {
    const stemGod = p.stemKoreanName;
    const branchGod = p.branchKoreanName;

    const mapGod = (god: string) => {
      if (god.includes('비견') || god.includes('겁재') || god.includes('일간')) return '비겁(Self/Rival)';
      if (god.includes('식신') || god.includes('상관')) return '식상(Artist/Rebel)';
      if (god.includes('편재') || god.includes('정재')) return '재성(Wealth)';
      if (god.includes('편관') || god.includes('정관')) return '관성(Power/Judge)';
      if (god.includes('편인') || god.includes('정인')) return '인성(Mystic/Sage)';
      return null;
    };

    const sGroup = mapGod(stemGod);
    const bGroup = mapGod(branchGod);

    if (sGroup) { counts[sGroup]++; total++; }
    if (bGroup) { counts[bGroup]++; total++; }
  });

  const ratio: Record<string, number> = {};
  for (const key in counts) {
    ratio[key] = total > 0 ? Math.round((counts[key] / total) * 100) : 0;
  }

  return ratio;
};
