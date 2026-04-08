import { Solar, Lunar, EightChar } from 'lunar-typescript';
import { DateTime } from 'luxon';
import { UserInput, BaZiResult, BaZiCard, Language } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { calculateGeJu, calculateTenGodsRatio, determineStructure } from './bazi-analysis';
import { calculateInteractions as calculateDetailedInteractions } from './bazi-interactions';
import { detectShinsal } from './bazi-shinsal';
import { calcDayMasterStrength, determineYongshin, checkByeongYak, checkTongGwan } from './bazi-yongshin';
import { calculateAdvancedAnalysis } from './bazi-advanced-analysis';

import { getPreciseSajuTime } from './bazi-time';

const STEMS_INFO: Record<string, { element: string, polarity: number }> = {
  '甲': { element: 'Wood', polarity: 1 }, '乙': { element: 'Wood', polarity: -1 },
  '丙': { element: 'Fire', polarity: 1 }, '丁': { element: 'Fire', polarity: -1 },
  '戊': { element: 'Earth', polarity: 1 }, '己': { element: 'Earth', polarity: -1 },
  '庚': { element: 'Metal', polarity: 1 }, '辛': { element: 'Metal', polarity: -1 },
  '壬': { element: 'Water', polarity: 1 }, '癸': { element: 'Water', polarity: -1 }
};

const BRANCHES_INFO: Record<string, { element: string, polarity: number }> = {
  '子': { element: 'Water', polarity: 1 }, '丑': { element: 'Earth', polarity: -1 },
  '寅': { element: 'Wood', polarity: 1 }, '卯': { element: 'Wood', polarity: -1 },
  '辰': { element: 'Earth', polarity: 1 }, '巳': { element: 'Fire', polarity: -1 },
  '午': { element: 'Fire', polarity: 1 }, '未': { element: 'Earth', polarity: -1 },
  '申': { element: 'Metal', polarity: 1 }, '酉': { element: 'Metal', polarity: -1 },
  '戌': { element: 'Earth', polarity: 1 }, '亥': { element: 'Water', polarity: -1 }
};

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

/**
 * Calculate Ten God (십성) based on Day Master and target Gan/Zhi.
 */
const getTenGod = (dayGan: string, targetGan: string, targetZhi: string) => {
  const self = STEMS_INFO[dayGan] || { element: 'Earth', polarity: 1 };
  const targetS = STEMS_INFO[targetGan] || { element: 'Earth', polarity: 1 };
  const targetB = BRANCHES_INFO[targetZhi] || { element: 'Earth', polarity: 1 };

  const getTenGodName = (s: { element: string, polarity: number }, t: { element: string, polarity: number }) => {
    const sIdx = ELEMENTS.indexOf(s.element);
    const tIdx = ELEMENTS.indexOf(t.element);
    if (sIdx === -1 || tIdx === -1) return '비견';
    
    const diff = (tIdx - sIdx + 5) % 5;
    const samePolarity = s.polarity === t.polarity;

    if (diff === 0) return samePolarity ? '비견' : '겁재';
    if (diff === 1) return samePolarity ? '식신' : '상관';
    if (diff === 2) return samePolarity ? '편재' : '정재';
    if (diff === 3) return samePolarity ? '편관' : '정관';
    if (diff === 4) return samePolarity ? '편인' : '정인';
    return '비견';
  };

  const sName = getTenGodName(self, targetS);
  const bName = getTenGodName(self, targetB);

  const sInfo = BAZI_MAPPING.tenGods[sName as keyof typeof BAZI_MAPPING.tenGods] || { en: sName, ko: sName };
  const bInfo = BAZI_MAPPING.tenGods[bName as keyof typeof BAZI_MAPPING.tenGods] || { en: bName, ko: bName };

  return {
    stemTenGodKo: sInfo.ko,
    stemTenGodEn: sInfo.en,
    branchTenGodKo: bInfo.ko,
    branchTenGodEn: bInfo.en,
    stemPolarity: targetS.polarity,
    branchPolarity: targetB.polarity
  };
};

/**
 * Calculate BaZi (Saju) using lunar-typescript.
 */
export const getTodayPillar = (dayMaster: string) => {
  const today = new Date();
  const solar = Solar.fromDate(today);
  const lunar = solar.getLunar();
  const baZi = lunar.getEightChar();
  
  const stem = baZi.getDayGan();
  const branch = baZi.getDayZhi();
  const tenGod = getTenGod(dayMaster, stem, branch);
  
  return {
    stem,
    branch,
    stemTenGodKo: tenGod.stemTenGodKo,
    branchTenGodKo: tenGod.branchTenGodKo,
    stemTenGodEn: tenGod.stemTenGodEn,
    branchTenGodEn: tenGod.branchTenGodEn,
  };
};

export const calculateRealBaZi = (input: UserInput, lat: number, lon: number, lang: Language): BaZiResult => {
  try {
    let solarYear = 0, solarMonth = 0, solarDay = 0;

    if (input.calendarType === 'lunar') {
      const parts = input.birthDate.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        const lunarObj = Lunar.fromYmd(y, m, d);
        const solarObj = lunarObj.getSolar();
        solarYear = solarObj.getYear();
        solarMonth = solarObj.getMonth();
        solarDay = solarObj.getDay();
      }
    } else {
      const parts = input.birthDate.split('-');
      if (parts.length === 3) {
        solarYear = parseInt(parts[0], 10);
        solarMonth = parseInt(parts[1], 10);
        solarDay = parseInt(parts[2], 10);
      }
    }

    // 1. Get precise cosmic time using the new engine
    const timeResult = getPreciseSajuTime(solarYear, solarMonth, solarDay, input.birthTime, lon);
    
    // 2. Initialize Solar/Lunar with corrected time
    const solar = Solar.fromYmdHms(
      timeResult.correctedYear,
      timeResult.correctedMonth,
      timeResult.correctedDay,
      timeResult.correctedHour,
      timeResult.correctedMinute,
      0
    );
    
    const lunar = solar.getLunar();
    const baZi = lunar.getEightChar();
    
    if (!baZi) {
      throw new Error("Failed to generate Eight Characters (BaZi) for this cosmic alignment.");
    }
  
  // 3. Extract 4 Pillars (Year, Month, Day, Hour)
  // lunar-typescript automatically handles Jo-ja-shi (advances day if hour >= 23)
  const dayGan = baZi.getDayGan();
  const dayZhi = baZi.getDayZhi();
  const timeGan = baZi.getTimeGan();
  const timeZhi = baZi.getTimeZhi();
  
  const pillarsRaw = [
    { title: 'Hour', stem: timeGan, branch: timeZhi },
    { title: 'Day', stem: dayGan, branch: dayZhi },
    { title: 'Month', stem: baZi.getMonthGan(), branch: baZi.getMonthZhi() },
    { title: 'Year', stem: baZi.getYearGan(), branch: baZi.getYearZhi() },
  ];

  // 4. Map to Goth-Punk UI Cards
  const pillars: BaZiCard[] = pillarsRaw.map((p) => {
    const stemInfo = BAZI_MAPPING.stems[p.stem as keyof typeof BAZI_MAPPING.stems] || { ko: p.stem, en: p.stem, element: 'Earth' };
    const branchInfo = BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches] || { ko: p.branch, en: p.branch };
    
    // Calculate Ten Gods (십성) using our custom function to ensure accuracy with overridden pillars
    const tenGods = getTenGod(dayGan, p.stem, p.branch);
    let stemTenGod = tenGods.stemTenGodKo;
    let branchTenGod = tenGods.branchTenGodKo;
    
    if (p.title === 'Day') {
      stemTenGod = 'Self';
    }

    const stemTenGodInfo = BAZI_MAPPING.tenGods[stemTenGod as keyof typeof BAZI_MAPPING.tenGods] || { en: stemTenGod, ko: stemTenGod };
    const branchTenGodInfo = BAZI_MAPPING.tenGods[branchTenGod as keyof typeof BAZI_MAPPING.tenGods] || { en: branchTenGod, ko: branchTenGod };
    
    return {
      title: p.title,
      hanja: `${p.stem}${p.branch}`,
      stem: p.stem,
      branch: p.branch,
      stemEnglishName: stemTenGod === 'Self' ? 'The Ego' : stemTenGodInfo.en,
      stemKoreanName: stemTenGod === 'Self' ? '일간(나)' : stemTenGodInfo.ko,
      branchEnglishName: branchTenGodInfo.en,
      branchKoreanName: branchTenGodInfo.ko,
      element: (stemInfo.element || 'Earth') as any,
      description: lang === 'KO' ? `${stemInfo.ko} / ${branchInfo.ko}` : `${stemInfo.en} / ${branchInfo.en}`,
      stemPolarity: STEMS_INFO[p.stem]?.polarity || 1,
      branchPolarity: BRANCHES_INFO[p.branch]?.polarity || 1
    };
  });

  // 5. Grand Cycles (대운)
  const genderValue = input.gender === 'female' ? 0 : 1;
  const yun = baZi.getYun(genderValue); 
  const daYun = yun.getDaYun();
  
  const now = DateTime.now();
  const birth = DateTime.fromISO(input.birthDate);
  const currentAge = Math.floor(now.diff(birth, 'years').years) + 1; 
  
  // Custom DaYun start age calculation (3 days = 1 year, rounded)
  const getCustomStartAge = () => {
    const yearGan = baZi.getYearGan();
    const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(yearGan);
    const isForward = (input.gender === 'male' && isYangYear) || (input.gender === 'female' && !isYangYear);
    
    const birthJieQi = lunar.getPrevJie();
    const nextJieQi = lunar.getNextJie();
    
    const targetJieQi = isForward ? nextJieQi : birthJieQi;
    const targetSolar = targetJieQi.getSolar();
    
    const birthDateObj = new Date(
      timeResult.correctedYear,
      timeResult.correctedMonth - 1,
      timeResult.correctedDay,
      timeResult.correctedHour,
      timeResult.correctedMinute
    );
    const targetDateObj = new Date(targetSolar.getYear(), targetSolar.getMonth() - 1, targetSolar.getDay(), targetSolar.getHour(), targetSolar.getMinute());
    
    const diffMs = Math.abs(targetDateObj.getTime() - birthDateObj.getTime());
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    
    // 정운법 (Jeong-un-beop)
    const totalDays = Math.floor(diffDays);
    const quotient = Math.floor(totalDays / 3);
    const remainder = totalDays % 3;
    
    let startAge = quotient;
    if (remainder === 2) {
      startAge += 1;
    }
    
    if (startAge === 0) startAge = 1;
    return startAge;
  };
  
  const customStartAge = getCustomStartAge();
  
  let currentCycleIndex = -1;

  const grandCycles = daYun.slice(1, 11).map((dy: any, idx: number) => {
    try {
      if (!dy) throw new Error("Null cycle");
      
      const ganZhi = dy.getGanZhi();
      const gan = ganZhi[0];
      const zhi = ganZhi[1];
      
      const startAge = customStartAge + (idx * 10);
      const startYear = birth.year + startAge;
      const gTenGod = getTenGod(dayGan, gan, zhi);

      // Calculate annual pillars (Se-Un) for this Grand Cycle manually to match custom startYear
      const annualPillars = Array.from({ length: 10 }).map((_, i) => {
        const year = startYear + i;
        
        // Get Year GanZhi (use June 1st to safely get the year's GanZhi)
        const solar = Solar.fromYmd(year, 6, 1);
        const lunar = solar.getLunar();
        const baZi = lunar.getEightChar();
        const lnGan = baZi.getYearGan();
        const lnZhi = baZi.getYearZhi();
        const lnTenGod = getTenGod(dayGan, lnGan, lnZhi);
        
        // Calculate monthly pillars (Wol-Un) for this year
        const monthlyPillars = Array.from({ length: 12 }).map((_, monthIdx) => {
          // Solar months roughly start around the 4th-8th of each Gregorian month.
          // Solar month 1 (Yin) is roughly Feb 4 to Mar 5.
          // So Gregorian month 2 (Feb) 15th is safely in Solar month 1.
          let gMonth = monthIdx + 2; 
          let gYear = year;
          if (gMonth > 12) {
            gMonth -= 12;
            gYear += 1;
          }
          
          const mSolar = Solar.fromYmd(gYear, gMonth, 15);
          const mLunar = mSolar.getLunar();
          const mBaZi = mLunar.getEightChar();
          const lyGan = mBaZi.getMonthGan();
          const lyZhi = mBaZi.getMonthZhi();
          const lyTenGod = getTenGod(dayGan, lyGan, lyZhi);

          // Calculate daily pillars for the month
          const dailyPillars: any[] = [];
          const uiMonth = monthIdx + 1;
          
          // Get number of days in the month
          const daysInMonth = new Date(year, uiMonth, 0).getDate();
          
          for (let day = 1; day <= daysInMonth; day++) {
            try {
              const date = new Date(year, uiMonth - 1, day);
              const dSolar = Solar.fromDate(date);
              const dLunar = dSolar.getLunar();
              const dBaZi = dLunar.getEightChar();
              
              const dGan = dBaZi.getDayGan();
              const dZhi = dBaZi.getDayZhi();
              const dTenGod = getTenGod(dayGan, dGan, dZhi);
              
              dailyPillars.push({
                day,
                stem: dGan,
                branch: dZhi,
                ...dTenGod
              });
            } catch (e) {
              // Skip invalid dates
            }
          }

          return {
            month: uiMonth,
            stem: lyGan,
            branch: lyZhi,
            element: BAZI_MAPPING.stems[lyGan as keyof typeof BAZI_MAPPING.stems]?.element || 'Earth',
            ...lyTenGod,
            dailyPillars
          };
        });

        return {
          year: year,
          age: startAge + i,
          stem: lnGan,
          branch: lnZhi,
          element: BAZI_MAPPING.stems[lnGan as keyof typeof BAZI_MAPPING.stems]?.element || 'Earth',
          ...lnTenGod,
          monthlyPillars
        };
      });

      const currentYear = new Date().getFullYear();
      if (annualPillars.some((ap: any) => ap.year === currentYear)) {
        currentCycleIndex = idx;
      }

      return {
        age: startAge,
        year: startYear,
        stem: gan,
        branch: zhi,
        element: BAZI_MAPPING.stems[gan as keyof typeof BAZI_MAPPING.stems]?.element || 'Earth',
        ...gTenGod,
        annualPillars
      };
    } catch (e) {
      console.error(`Error mapping Grand Cycle at index ${idx}:`, e);
      return { 
        age: 0, 
        year: 0, 
        stem: '', 
        branch: '', 
        element: 'Earth', 
        annualPillars: [],
        stemTenGodKo: '',
        stemTenGodEn: '',
        branchTenGodKo: '',
        branchTenGodEn: '',
        stemPolarity: 1,
        branchPolarity: 1
      };
    }
  });

  // 6. Analysis (격국, 용신, 합형충파해, 신살)
  const monthZhi = baZi.getMonthZhi();
  const yearZhi = baZi.getYearZhi();
  const yearGan = baZi.getYearGan();
  const allBranches = pillars.map(p => p.branch);
  const allStems = pillars.map(p => p.stem);
  
  const elementCounts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  pillars.forEach(p => {
    if (p.element) elementCounts[p.element]++;
    const branchElement = BRANCHES_INFO[p.branch]?.element;
    if (branchElement) elementCounts[branchElement as keyof typeof elementCounts as keyof typeof elementCounts]++;
  });

  const totalElements = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  const elementRatios: Record<string, number> = {};
  Object.entries(elementCounts).forEach(([el, count]) => {
    elementRatios[el] = totalElements > 0 ? Math.round((count / totalElements) * 100) : 20;
  });

  const geJu = calculateGeJu(dayGan, monthZhi, lang);
  const tenGodsRatio = calculateTenGodsRatio(pillars, lang);
  
  // New detailed calculations
  const shinsalResult = detectShinsal(allStems, allBranches, yearGan, yearZhi, dayGan, dayZhi);
  const strength = calcDayMasterStrength(allStems, allBranches);
  const structureDetail = determineStructure(dayGan, pillars, strength, tenGodsRatio, lang);

  const yongshinDetail = determineYongshin(allStems, allBranches, geJu, strength, structureDetail);
  const interactionsResult = calculateDetailedInteractions(allStems, allBranches, pillars, yongshinDetail);
  
  // Check for ByeongYak and TongGwan
  const byeongYak = checkByeongYak(allStems, allBranches, yongshinDetail);
  const tongGwan = checkTongGwan(allStems, allBranches);
  
  if (byeongYak) yongshinDetail.byeongYak = byeongYak;
  if (tongGwan) yongshinDetail.tongGwan = tongGwan;

  let translatedGod = yongshinDetail.primary.god;
  let translatedElement = yongshinDetail.primary.element;
  
  if (lang === 'EN') {
    if (translatedGod === "식상/재성/관성") translatedGod = "Artist/Rebel, Maverick/Architect, Warrior/Judge";
    else if (translatedGod === "인성/비겁") translatedGod = "Mystic/Sage, Mirror/Rival";
    else if (translatedGod === "인성") translatedGod = "Mystic/Sage";
    else if (translatedGod === "비겁") translatedGod = "Mirror/Rival";
    else if (translatedGod === "식상") translatedGod = "Artist/Rebel";
    else if (translatedGod === "재성") translatedGod = "Maverick/Architect";
    else if (translatedGod === "관성") translatedGod = "Warrior/Judge";
  } else if (lang === 'KO') {
    const elementKoMap: Record<string, string> = { Wood: '목(木)', Fire: '화(火)', Earth: '토(土)', Metal: '금(金)', Water: '수(水)' };
    if (translatedElement.includes('/')) {
      translatedElement = translatedElement.split('/').map(el => elementKoMap[el] || el).join('/');
    } else {
      translatedElement = elementKoMap[translatedElement] || translatedElement;
    }
  }

  if (currentCycleIndex === -1) {
    currentCycleIndex = 0;
  }

  // Calculate the actual current year's pillar (Se-Un) regardless of DaYun
  const currentYear = new Date().getFullYear();
  let currentYearPillar = null;
  
  try {
    // Use June 1st to safely get the year's GanZhi (avoids LiChun boundary issues)
    const solar = Solar.fromYmd(currentYear, 6, 1);
    const lunar = solar.getLunar();
    const baZi = lunar.getEightChar();
    const yGan = baZi.getYearGan();
    const yZhi = baZi.getYearZhi();
    const yTenGod = getTenGod(dayGan, yGan, yZhi);
    
    currentYearPillar = {
      year: currentYear,
      stem: yGan,
      branch: yZhi,
      element: BAZI_MAPPING.stems[yGan as keyof typeof BAZI_MAPPING.stems]?.element || 'Earth',
      ...yTenGod
    };
  } catch (e) {
    console.error("Error calculating current year pillar:", e);
  }

  const advancedAnalysis = calculateAdvancedAnalysis(pillars, tenGodsRatio, input, dayGan, monthZhi, lang, strength);
  
  return {
    pillars,
    grandCycles,
    currentCycleIndex,
    currentYearPillar,
    timeCorrectionMessages: timeResult.messages,
    analysis: {
      geJu,
      yongShen: `${translatedElement} (${translatedGod})`,
      interactions: interactionsResult.interactions,
      conflicts: interactionsResult.conflicts,
      shinsal: shinsalResult.shinsal,
      gongmang: shinsalResult.gongmang,
      tenGodsRatio,
      dayMasterStrength: strength,
      yongshinDetail,
      structureDetail,
      elementRatios,
      ...advancedAnalysis
    }
  };
} catch (error) {
  console.error("BaZi calculation error in service:", error);
  throw error;
}
};
