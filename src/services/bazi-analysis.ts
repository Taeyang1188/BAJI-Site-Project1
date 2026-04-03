import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { Language } from '../types';

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
  
  if (!self || !target) {
    const info = BAZI_MAPPING.geju['건록' as keyof typeof BAZI_MAPPING.geju];
    return lang === 'KO' ? info.ko : info.en;
  }

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

  if (tenGod === '비견' || tenGod === '겁재') {
    const geonrok = BAZI_MAPPING.geju['건록' as keyof typeof BAZI_MAPPING.geju];
    const yangin = BAZI_MAPPING.geju['양인' as keyof typeof BAZI_MAPPING.geju];
    return lang === 'KO' ? `${geonrok.ko} / ${yangin.ko}` : `${geonrok.en} / ${yangin.en}`;
  }

  const info = BAZI_MAPPING.geju[tenGod as keyof typeof BAZI_MAPPING.geju];
  return lang === 'KO' ? info.ko : info.en;
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
      if (god.includes('비견') || god.includes('겁재') || god.includes('일간')) return 'Mirror/Rival';
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
