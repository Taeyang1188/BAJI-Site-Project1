
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

export function calcDayMasterStrength(stems: string[], branches: string[]) {
  const dayMaster = stems[1]; // 일간
  const dmElement = STEM_ELEMENTS[dayMaster];
  const monthZhi = branches[2]; // 월지
  
  let score = 0;
  let breakdown = { monthReign: 0, branchSupport: 0, stemSupport: 0 };

  // 1. 월령득기 (Month Reign) - 40%
  const monthJijangan = JIJANGAN[monthZhi];
  if (monthJijangan) {
    // Check if DM element is in month jijangan (Main Qi or others)
    // Simplified: If DM element matches month branch element or is supported by it
    const monthElement = BRANCH_ELEMENTS[monthZhi];
    const rel = getRelationship(dmElement, monthElement);
    if (rel === 'Self' || rel === 'Wisdom') {
      score += 40;
      breakdown.monthReign = 40;
    }
  }

  // 2. 지지 생조 (Branch Support) - 30%
  // 4지지 중 일간과 같은 오행 또는 생해주는 오행 개수
  let branchSupportCount = 0;
  branches.forEach(b => {
    const bElement = BRANCH_ELEMENTS[b];
    const rel = getRelationship(dmElement, bElement);
    if (rel === 'Self' || rel === 'Wisdom') {
      branchSupportCount++;
    }
  });
  const branchSupportScore = (branchSupportCount / 4) * 30;
  score += branchSupportScore;
  breakdown.branchSupport = branchSupportScore;

  // 3. 천간 생조 (Stem Support) - 30%
  // 시·월·년간 중 일간 생조 천간 (일간 제외 3개)
  let stemSupportCount = 0;
  [stems[0], stems[2], stems[3]].forEach(s => {
    const sElement = STEM_ELEMENTS[s];
    const rel = getRelationship(dmElement, sElement);
    if (rel === 'Self' || rel === 'Wisdom') {
      stemSupportCount++;
    }
  });
  const stemSupportScore = (stemSupportCount / 3) * 30;
  score += stemSupportScore;
  breakdown.stemSupport = stemSupportScore;

  let level = "";
  if (score <= 30) level = "극약";
  else if (score <= 45) level = "약";
  else if (score <= 55) level = "중화";
  else if (score <= 70) level = "강";
  else level = "극강";

  return { score, level, breakdown };
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
    primary = { god: "비겁", element: dmElement, reason: "전왕격 → 비겁용신", reasonEn: "Monarch Alignment → Mirror/Rival Useful God" };
    heeShin = { god: "인성", element: getElementByRel('Wisdom') };
    giShin = { god: "관성", element: getElementByRel('Power') };
    guShin = { god: "재성", element: getElementByRel('Wealth') };
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
        note: `일간이 강하므로 기운을 빼주는 식상, 재성, 관성(${elementsStr})이 용신으로 작용합니다.`,
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
        note: `일간이 약하므로 기운을 보태주는 인성, 비겁(${elementsStr})이 용신으로 작용합니다.`,
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
    // Identify "약" (Medicine) - element that overcomes the disease
    const byeongIdx = ELEMENT_CYCLE.indexOf(byeong);
    const yakIdx = (byeongIdx + 3) % 5; // Keuk relationship: Wood -> Earth -> Water -> Fire -> Metal -> Wood
    // Wait, Keuk is: Wood keuk Earth (2), Earth keuk Water (2), Water keuk Fire (2), Fire keuk Metal (2), Metal keuk Wood (2)
    // Actually, (byeongIdx + 2) % 5 is what byeong keuks. 
    // What keuks byeong is (byeongIdx + 3) % 5.
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
