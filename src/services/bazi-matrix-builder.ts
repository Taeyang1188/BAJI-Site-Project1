import { BaZiResult, BaziMatrix, SocialContext } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { ROOTING_DATA } from './bazi-yongshin';
// Import any other necessary things. But we can deduce missing elements and temperature index here.

export function buildBaziMatrix(result: BaZiResult, socialContext: SocialContext = 'none', overridingLuckScore?: number): BaziMatrix {
  // 1. Profile
  const profile = {
    social_context: socialContext,
    gender: result.pillars[1].stem 
  };

  // 2. Pillars
  const four_pillars = {
    year: { stem: result.pillars[3].stem, branch: result.pillars[3].branch, element: 'Water/Metal' }, 
    month: { stem: result.pillars[2].stem, branch: result.pillars[2].branch, element: 'Wood/Wood' },
    day: { stem: result.pillars[1].stem, branch: result.pillars[1].branch, element: 'Earth/Wood' },
    hour: { stem: result.pillars[0].stem, branch: result.pillars[0].branch, element: 'Fire/Fire' },
  };

  // Helper mapping
  const getStemElement = (stem: string) => BAZI_MAPPING.stems[stem as keyof typeof BAZI_MAPPING.stems]?.element || '';
  const getBranchElement = (branch: string) => BAZI_MAPPING.branches[branch as keyof typeof BAZI_MAPPING.branches]?.element || '';

  four_pillars.year.element = `${getStemElement(four_pillars.year.stem)}/${getBranchElement(four_pillars.year.branch)}`;
  four_pillars.month.element = `${getStemElement(four_pillars.month.stem)}/${getBranchElement(four_pillars.month.branch)}`;
  four_pillars.day.element = `${getStemElement(four_pillars.day.stem)}/${getBranchElement(four_pillars.day.branch)}`;
  four_pillars.hour.element = `${getStemElement(four_pillars.hour.stem)}/${getBranchElement(four_pillars.hour.branch)}`;

  // 3. Analysis Matrix
  const analysisObj = result.analysis || {} as any;
  const ratios = analysisObj.elementRatios || { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  const missing_elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].filter(el => !ratios[el as keyof typeof ratios] || (ratios[el as keyof typeof ratios] as number) === 0);
  
  // Calculate Temperature Index
  const fireEarth = (ratios.Fire as number || 0) + (ratios.Earth as number || 0);
  const waterMetal = (ratios.Water as number || 0) + (ratios.Metal as number || 0);
  let temperature_index = '중화(Moderate)';
  if (fireEarth > 60 && waterMetal < 15) temperature_index = '극열(Extreme Hot)';
  else if (fireEarth > 45) temperature_index = '조열(Hot)';
  else if (waterMetal > 60 && fireEarth < 15) temperature_index = '극한(Extreme Cold)';
  else if (waterMetal > 45) temperature_index = '한습(Cold)';

  const gyeokguk = analysisObj.structureDetail?.title || '알 수 없음';
  const dmStrength = analysisObj.dayMasterStrength?.score || 50;
  let energy_state = dmStrength >= 65 ? '태왕(극강)' : (dmStrength >= 50 ? '신강' : (dmStrength >= 35 ? '신약' : '극약/태약'));

  const analysis = {
    gyeokguk,
    temperature_index,
    energy_state,
    missing_elements,
    five_elements_score: ratios as Record<string, number>
  };

  // 4. Interactions
  const allInteractions = analysisObj.interactions || [];
  const interactions = {
    hap: allInteractions.filter((i: any) => i.type.includes('합')).map((i: any) => i.note),
    chung: allInteractions.filter((i: any) => i.type.includes('충')).map((i: any) => i.note),
    hyeong: allInteractions.filter((i: any) => i.type.includes('형')).map((i: any) => i.note),
    sin_sal: analysisObj.shinsal?.map((s: any) => s.name) || [],
    gong_mang: analysisObj.gongmang || []
  };

  // 5. Risk Gravity (Move up for momentum calculation)
  let risk_gravity = 0;
  if (temperature_index.includes('극')) risk_gravity += 20;
  if (interactions.hyeong.length > 0) risk_gravity += 20;
  if (interactions.chung.length > 0) risk_gravity += 10;
  if (interactions.gong_mang.length > 1) risk_gravity += 10;
  if (missing_elements.length >= 2) risk_gravity += 10;

  // 6. Dynamic Luck
  const currentAnnualPillar = result.currentYearPillar;
  const current_seun = currentAnnualPillar ? `${currentAnnualPillar.stem}${currentAnnualPillar.branch}` : '알 수 없음';
  
  // Use passed luckScore or find it in result.
  const luckScore = overridingLuckScore !== undefined ? overridingLuckScore : ( (result as any).luckScore || (result.analysis as any)?.luckScore || 50 );
  
  // Energy Momentum (Logic Gate 2) - compare score differences or element flow.
  const momentum_score = luckScore > 50 ? luckScore - (risk_gravity / 2) : luckScore + (risk_gravity / 5);
  
  // Elemental Friction Logic
  let frictionType = '안정적 흐름 (Smooth flow)';
  let frictionLevel = 10;
  
  if (interactions.chung.length > 1) {
    frictionType = '격렬한 충돌 (Violent Collision)';
    frictionLevel = 60;
  } else if (interactions.hyeong.length > 0) {
    frictionType = '내부적 갈등 (Internal Friction)';
    frictionLevel = 45;
  } else if (temperature_index.includes('극')) {
    frictionType = '환경적 압박 (Environmental Pressure)';
    frictionLevel = 30;
  }

  const dynamic_luck = {
    current_daewoon: result.grandCycles[result.currentCycleIndex] ? `${result.grandCycles[result.currentCycleIndex].stem}${result.grandCycles[result.currentCycleIndex].branch}` : "알 수 없음",
    current_seun,
    momentum_score: Math.floor(momentum_score),
    seun_score: luckScore,
    elemental_friction: { type: frictionType, level: frictionLevel }
  };

  // 7. Coordinator & Guardrail
  // 3-Stage Guardrail
  let judgment_grade: 'A' | 'B' | 'C' = 'B';
  if (luckScore > 65 && risk_gravity < 30) judgment_grade = 'A';
  else if (luckScore < 40 || risk_gravity >= 50) judgment_grade = 'C';

  const remedy_gate: string[] = [];
  if (interactions.hyeong.length > 0) {
    remedy_gate.push('헌혈이나 기부, 혹은 강도 높은 운동을 통해 억압된 에너지를 미리 배출하여 사고(형살)를 대체하라(업상대체).');
  }
  if (temperature_index === '극열(Extreme Hot)') {
    remedy_gate.push('감정 통제가 불가능한 순간이 오면 모든 결정을 24시간 뒤로 미루고, 서늘한 물가에서 심박수를 낮춰라.');
  } else if (temperature_index === '극한(Extreme Cold)') {
    remedy_gate.push('사람들과의 단절을 막기 위해 의도적으로 밝고 따뜻한 분위기의 모임에 참석해 체온과 활기를 올려라.');
  }

  const coordinator = {
    risk_gravity,
    judgment_grade,
    alt_action: judgment_grade === 'C' && socialContext === 'military_public' ? '물리적 이사 대신 전출이나 북쪽으로의 짧은 휴가로 에너지를 소진할 것.' : undefined
  };

  return {
    profile,
    four_pillars,
    analysis,
    interactions,
    dynamic_luck,
    coordinator,
    remedy_gate
  };
}
