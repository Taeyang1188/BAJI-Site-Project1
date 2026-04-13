
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
const ROOTING_DATA: Record<string, { strong: string[], mid: string[], weak: string[] }> = {
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

export function calcDayMasterStrength(stems: string[], branches: string[]) {
  const dayMaster = stems[1]; // 일간
  const dmElement = STEM_ELEMENTS[dayMaster];
  const monthZhi = branches[2]; // 월지
  const monthElement = BRANCH_ELEMENTS[monthZhi];
  
  // 1. Base Element Scores
  const elementScores: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const floatingStems: string[] = [];
  
  // Stems: 10 points each (DM gets 20 for base presence)
  stems.forEach((s, i) => {
    const base = i === 1 ? 20 : 10;
    
    // Check for Floating Stems (Heo-bu)
    const rooting = ROOTING_DATA[s];
    const hasRoot = rooting && branches.some(b => 
      rooting.strong.includes(b) || rooting.mid.includes(b) || rooting.weak.includes(b)
    );
    
    if (!hasRoot) {
      floatingStems.push(s);
      elementScores[STEM_ELEMENTS[s]] += base * 0.3; // 70% reduction for floating stems
    } else {
      elementScores[STEM_ELEMENTS[s]] += base;
    }
  });
  
  // Branches: Using JIJANGAN for accurate distribution
  branches.forEach((b, i) => {
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
    const present = group.branches.filter(b => branches.includes(b));
    if (present.length === 3 || (present.length === 2 && present.includes(monthZhi))) {
      const bonus = present.length === 3 ? 40 : 20;
      elementScores[group.element] += bonus;
      activeCombinations.push({ type: 'Bang-hap', element: group.element });
    }
  });

  // Check Sam-hap
  COMBINATIONS.SAM_HAP.forEach(group => {
    const present = group.branches.filter(b => branches.includes(b));
    const center = group.branches[1];
    if (present.length === 3 || (present.length === 2 && branches.includes(center))) {
      const bonus = present.length === 3 ? 30 : 15;
      elementScores[group.element] += bonus;
      activeCombinations.push({ type: 'Sam-hap', element: group.element });
    }
  });

  // Stem Hap Transformation (Identity Crisis)
  // Check for jaeng-hap (competition) - if multiple stems of same kind exist, transformation is hindered
  const stemCounts: Record<string, number> = {};
  stems.forEach(s => stemCounts[s] = (stemCounts[s] || 0) + 1);

  COMBINATIONS.STEM_HAP.forEach(group => {
    const s1 = group.stems[0];
    const s2 = group.stems[1];
    if (stems.includes(s1) && stems.includes(s2)) {
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
    const rooting = ROOTING_DATA[s];
    if (!rooting) return;

    let maxMult = 0.5;
    branches.forEach((b, bIdx) => {
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
      branches.forEach(b => {
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
    elementScores // Return raw scores for advanced analysis
  };
}

export function determineYongshin(stems: string[], branches: string[], geju: string, strength: any, structureDetail?: any) {
  const dayMaster = stems[1];
  const dmElement = STEM_ELEMENTS[dayMaster];
  const isStrong = strength.score > 50;

  let primary = { god: "", element: "", reason: "", reasonEn: "" };
  let heeShin = { god: "", element: "" };
  let giShin = { god: "", element: "" };
  let guShin = { god: "", element: "" };
  let method = "격국용신";
  let eokbu: any = null;

  const getElementByRel = (rel: string) => {
    const dmIdx = ELEMENT_CYCLE.indexOf(dmElement);
    const rels = ['Self', 'Artist', 'Wealth', 'Power', 'Wisdom'];
    const targetIdx = (dmIdx + rels.indexOf(rel)) % 5;
    return ELEMENT_CYCLE[targetIdx];
  };

  // 0. Threshold Logic for Extreme Elemental Dominance (>= 60%)
  // If one element is overwhelming, normal balance (Eok-bu) logic fails and can be dangerous.
  const elementRatios = strength.elementScores || {};
  const totalScore = Object.values(elementRatios).reduce((a: any, b: any) => a + b, 0) as number;
  
  let extremeElement = "";
  let extremeRatio = 0;
  
  for (const [el, score] of Object.entries(elementRatios)) {
    const ratio = ((score as number) / totalScore) * 100;
    if (ratio >= 60) {
      extremeElement = el;
      extremeRatio = ratio;
      break;
    }
  }

  if (extremeElement) {
    method = "전왕격용신"; // Treat as Monarch/Extreme logic
    const mIdx = ELEMENT_CYCLE.indexOf(extremeElement);
    
    // For extreme dominance, we follow the flow (Sun-eung)
    // Useful = Output (Draining), Supporting = Dominant (Mirror), Danger = Clashing (Wang-shin-chung-bal)
    primary = { 
      god: extremeElement === dmElement ? "비겁" : "인성", // Simplified mapping
      element: ELEMENT_CYCLE[(mIdx + 1) % 5], // Earth if Fire is extreme
      reason: `${extremeElement} 기운이 ${Math.round(extremeRatio)}%로 압도적임. 강한 기운을 설기(泄氣)해야 함.`,
      reasonEn: `${extremeElement} energy is overwhelming at ${Math.round(extremeRatio)}%. Must drain (leak) the strong energy.`
    };

    // User requested mapping for extreme Fire: [Fire=Hee, Earth=Yong, Metal=Hee/Han, Water=Gi(Danger), Wood=Gu]
    heeShin = { 
      god: "비겁, 재성", 
      element: `${extremeElement}, ${ELEMENT_CYCLE[(mIdx + 2) % 5]}` 
    };
    giShin = { 
      god: "관성", 
      element: ELEMENT_CYCLE[(mIdx + 3) % 5] // Water if Fire is extreme
    };
    guShin = { 
      god: "인성", 
      element: ELEMENT_CYCLE[(mIdx + 4) % 5] // Wood if Fire is extreme
    };
    const hanShin = {
      god: "식상",
      element: ELEMENT_CYCLE[(mIdx + 1) % 5] // Earth (Primary is already Earth)
    };

    return { primary, heeShin, giShin, guShin, hanShin, method, byeongYak: null, tongGwan: null, eokbu: null };
  }

  // 0. Special Structure Handling (Jong-gyeok / Jeon-wang-gyeok)
  if (structureDetail && structureDetail.category === 'Adaptive') {
    method = "종격용신";
    const title = structureDetail.title;
    
    if (title.includes("종아격")) {
      primary = { god: "식상", element: getElementByRel('Artist'), reason: "종아격 → 식상용신", reasonEn: "Adaptive Alignment [Artist/Rebel] → Artist/Rebel Useful God" };
      heeShin = { god: "재성", element: getElementByRel('Wealth') };
      giShin = { god: "인성", element: getElementByRel('Wisdom') };
      guShin = { god: "비겁", element: getElementByRel('Self') };
    } else if (title.includes("종재격")) {
      primary = { god: "재성", element: getElementByRel('Wealth'), reason: "종재격 → 재성용신", reasonEn: "Adaptive Alignment [Maverick/Architect] → Maverick/Architect Useful God" };
      heeShin = { god: "식상", element: getElementByRel('Artist') };
      giShin = { god: "비겁", element: getElementByRel('Self') };
      guShin = { god: "인성", element: getElementByRel('Wisdom') };
    } else if (title.includes("종살격")) {
      primary = { god: "관성", element: getElementByRel('Power'), reason: "종살격 → 관성용신", reasonEn: "Adaptive Alignment [Warrior/Judge] → Warrior/Judge Useful God" };
      heeShin = { god: "재성", element: getElementByRel('Wealth') };
      giShin = { god: "식상", element: getElementByRel('Artist') };
      guShin = { god: "비겁", element: getElementByRel('Self') };
    } else if (title.includes("종왕격")) {
      primary = { god: "비겁", element: getElementByRel('Self'), reason: "종왕격 → 비겁용신", reasonEn: "Adaptive Alignment [Mirror/Rival] → Mirror/Rival Useful God" };
      heeShin = { god: "인성", element: getElementByRel('Wisdom') };
      giShin = { god: "식상", element: getElementByRel('Artist') };
      guShin = { god: "재성", element: getElementByRel('Wealth') };
    }
  } else if (structureDetail && structureDetail.category === 'Monarch') {
    method = "전왕격용신";
    const monarchEl = structureDetail.mainElement || dmElement;
    const mIdx = ELEMENT_CYCLE.indexOf(monarchEl);
    
    primary = { god: "비겁", element: monarchEl, reason: "전왕격 → 비겁용신", reasonEn: "Monarch Alignment → Mirror/Rival Useful God" };
    
    // User requested mapping for Monarch structures:
    // [Monarch=Hee, Output=Hee, Wealth=Han, Power=Gi, Resource=Gu]
    // Example Fire Monarch: Fire=Hee, Earth=Hee, Metal=Han, Water=Gi, Wood=Gu
    
    heeShin = { 
      god: "비겁, 식상", 
      element: `${monarchEl}, ${ELEMENT_CYCLE[(mIdx + 1) % 5]}` 
    };
    giShin = { 
      god: "관성", 
      element: ELEMENT_CYCLE[(mIdx + 3) % 5] 
    };
    guShin = { 
      god: "인성", 
      element: ELEMENT_CYCLE[(mIdx + 4) % 5] 
    };
    const hanShin = {
      god: "재성",
      element: ELEMENT_CYCLE[(mIdx + 2) % 5]
    };
    return { primary, heeShin, giShin, guShin, hanShin, method, byeongYak: null, tongGwan: null, eokbu: null };
  } else if (structureDetail && structureDetail.category === 'Image') {
    method = "특수격용신";
    const title = structureDetail.title;
    const targetEl = structureDetail.mainElement || dmElement;
    const targetIdx = ELEMENT_CYCLE.indexOf(targetEl);
    
    const rel = getRelationship(dmElement, targetEl);
    const godMap: Record<string, string> = {
      'Self': '비겁',
      'Artist': '식상',
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
  }
  // 1. Standard Structure Logic
  else if (geju.includes("정관") || geju.includes("JUDGE")) {
    if (!isStrong) {
      primary = { god: "인성", element: getElementByRel('Wisdom'), reason: "정관격 일간약 → 인성용신", reasonEn: "Warrior/Judge Structure & Weak DM → Mystic/Sage Useful God" };
      heeShin = { god: "비겁", element: getElementByRel('Self') };
      giShin = { god: "상관", element: getElementByRel('Artist') };
      guShin = { god: "재성", element: getElementByRel('Wealth') };
    } else {
      primary = { god: "재성", element: getElementByRel('Wealth'), reason: "정관격 일간강 → 재성용신", reasonEn: "Warrior/Judge Structure & Strong DM → Maverick/Architect Useful God" };
      heeShin = { god: "관성", element: getElementByRel('Power') };
      giShin = { god: "비겁", element: getElementByRel('Self') };
      guShin = { god: "인성", element: getElementByRel('Wisdom') };
    }
  } else if (geju.includes("편관") || geju.includes("칠살") || geju.includes("WARRIOR")) {
    if (!isStrong) {
      primary = { god: "인성", element: getElementByRel('Wisdom'), reason: "편관격 일간약 → 인성용신 (인수화살)", reasonEn: "Warrior/Judge Structure & Weak DM → Mystic/Sage Useful God" };
      heeShin = { god: "비겁", element: getElementByRel('Self') };
      giShin = { god: "재성", element: getElementByRel('Wealth') };
      guShin = { god: "식상", element: getElementByRel('Artist') };
    } else {
      primary = { god: "식상", element: getElementByRel('Artist'), reason: "편관격 일간강 → 식상용신 (식신제살)", reasonEn: "Warrior/Judge Structure & Strong DM → Artist/Rebel Useful God" };
      heeShin = { god: "인성", element: getElementByRel('Wisdom') };
      giShin = { god: "비겁", element: getElementByRel('Self') };
      guShin = { god: "재성", element: getElementByRel('Wealth') };
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
      const monarchEl = yongshin.primary.element;
      const mIdx = ELEMENT_CYCLE.indexOf(monarchEl);
      const drainEl = ELEMENT_CYCLE[(mIdx + 1) % 5]; // Output element
      
      const elementKoMap: Record<string, string> = { 
        Wood: '목(식상)', 
        Fire: '화(식상)', 
        Earth: '토(식상)', 
        Metal: '금(식상)', 
        Water: '수(식상)' 
      };
      const koDrain = elementKoMap[drainEl] || drainEl;

      return {
        byeong: monarchEl,
        yak: drainEl,
        note: `전왕격은 강한 기운을 거스르면 안 돼. ${koDrain}으로 기운을 부드럽게 설기하는 것이 좋아.`,
        noteEn: `Monarch structures should not be clashed. It is best to gently drain the energy with ${drainEl} (Artist/Rebel).`
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

export function analyzeSpecialStructure(stems: string[], branches: string[], elementScores: Record<string, number>, lang: any) {
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
    const el = BRANCH_ELEMENTS[b];
    if (el !== powerEl && el !== wealthEl && el !== artistEl) return false;
    
    // Check if the root is "functional" or "attacked"
    if (el === 'Metal' && ratios['Fire'] > 60) {
      // Metal root in Fire-heavy chart
      const hasMetalHap = (branches.includes('酉') && (branches.includes('巳') || branches.includes('丑'))) ||
                         (branches.includes('申') && (branches.includes('子') || branches.includes('辰')));
      if (hasMetalHap) return true; // Functional via combination (e.g., 1989's Sa-Yu)
      return false; // Isolated Metal root is "melted" (e.g., 1992's Shin)
    }
    
    if (el === 'Water' && ratios['Earth'] > 60) {
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
          if (dmElement === 'Earth' && (ratios['Metal'] > 25 || branches.some(b => b === '酉'))) {
             const hasMetalHap = (branches.includes('酉') && (branches.includes('巳') || branches.includes('丑')));
             if (hasMetalHap || ratios['Metal'] > 30) return null;
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

  // 2. 특수 이미지 격국 (Image Logic)
  const checkImage = () => {
    // 금수쌍청
    if (['庚', '辛'].includes(dayMaster) && ['申', '酉', '亥', '子'].includes(monthZhi)) {
      if (ratios['Metal'] + ratios['Water'] >= 70) {
        const isDirty = ratios['Earth'] > 10 || ratios['Fire'] > 15;
        return {
          name: '금수쌍청',
          nameEn: 'Metal-Water Purity',
          category: 'Image',
          mainElement: 'Water',
          confidence: isDirty ? 60 : 80,
          isDirty,
          description: "금과 수의 기운이 맑고 깨끗한 격국.",
          enDescription: "A structure where Metal and Water energies are clear and pure."
        };
      }
    }
    // 목화통명
    if (['甲', '乙'].includes(dayMaster) && ['寅', '卯', '辰', '巳', '午'].includes(monthZhi)) {
      if (ratios['Wood'] + ratios['Fire'] >= 60) {
        const isDirty = ratios['Water'] > 25 || ratios['Metal'] > 20;
        return {
          name: '목화통명',
          nameEn: 'Wood-Fire Brilliance',
          category: 'Image',
          mainElement: 'Fire',
          confidence: isDirty ? 60 : 80,
          isDirty,
          description: "나무가 불을 만나 밝게 빛나는 총명한 격국.",
          enDescription: "A brilliant structure where Wood meets Fire and shines brightly."
        };
      }
    }
    // 수목청화
    if (['壬', '癸'].includes(dayMaster) && ['亥', '子', '丑', '寅', '卯'].includes(monthZhi)) {
      if (ratios['Water'] + ratios['Wood'] >= 60) {
        const isDirty = ratios['Earth'] > 20 || ratios['Metal'] > 30;
        return {
          name: '수목청화',
          nameEn: 'Water-Wood Purity',
          category: 'Image',
          mainElement: 'Wood',
          confidence: isDirty ? 60 : 80,
          isDirty,
          description: "물과 나무가 어우러져 맑고 화사한 격국.",
          enDescription: "A clear and radiant structure where Water and Wood harmonize."
        };
      }
    }
    // 금백수청
    if (['庚', '辛'].includes(dayMaster) && ['申', '酉', '戌', '亥', '子'].includes(monthZhi)) {
      if (ratios['Metal'] >= 40 && ratios['Water'] >= 30) {
        const isDirty = ratios['Earth'] > 10 || ratios['Fire'] > 15;
        return {
          name: '금백수청',
          nameEn: 'Metal-White Water-Clear',
          category: 'Image',
          mainElement: 'Water',
          confidence: isDirty ? 60 : 85,
          isDirty,
          description: "금은 하얗고 물은 맑으니 고결하고 깨끗한 격국.",
          enDescription: "A noble and clean structure where Metal is white and Water is clear."
        };
      }
    }
    // 화토중탁
    if (['丙', '丁', '戊', '己'].includes(dayMaster) && (monthElement === 'Fire' || ['辰', '戌', '丑', '未'].includes(monthZhi))) {
      // Strict filter for Fire-Earth Turbid
      const isYinEarth = dayMaster === '己';
      const isJeongFire = dayMaster === '丁';
      const fireEarthRatio = ratios['Fire'] + ratios['Earth'];
      
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
        if (ratios['Fire'] > 50) {
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

      if (fireEarthRatio >= 75 && ratios['Water'] < 10) {
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
          mainElement: 'Earth',
          confidence: 90,
          isDirty: true,
          description: "불과 흙이 뒤섞여 메마르고 탁해진 격국. 조후가 시급함.",
          enDescription: "A dry and turbid structure where Fire and Earth are mixed. Urgent need for temperature balance."
        };
      }
    }
    return null;
  };

  return checkJunWang() || checkImage();
}
