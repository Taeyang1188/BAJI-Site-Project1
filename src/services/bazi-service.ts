import { Solar, Lunar } from 'lunar-typescript';
import { DateTime } from 'luxon';
import tzlookup from 'tz-lookup';
import { UserInput, BaZiResult, BaZiCard, Language } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';

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
 * Calculate precise cosmic time including Timezone, DST, and Longitude adjustment.
 */
export const getCosmicTime = (dateStr: string, timeStr: string, lat: number, lon: number) => {
  // 1. Find timezone ID from lat/lon (e.g., "America/New_York")
  const zone = tzlookup(lat, lon) || 'Asia/Seoul';
  
  // 2. Create DateTime in that zone to check for DST
  // ISO format: YYYY-MM-DDTHH:mm
  const dt = DateTime.fromISO(`${dateStr}T${timeStr}`, { zone });
  
  if (!dt.isValid) {
    throw new Error(`Invalid Date or Time: ${dateStr} ${timeStr}`);
  }
  
  // 3. True Solar Time (TST) correction
  // Standard Meridian for the timezone (approximate by rounding longitude to nearest 15 degrees)
  const stdMeridian = Math.round(lon / 15) * 15;
  const longitudeAdjustment = (lon - stdMeridian) * 4; // 4 minutes per degree
  
  // 4. Final adjusted date for BaZi calculation
  // We subtract DST offset if active (BaZi usually uses standard time or TST)
  // Most BaZi systems use TST which is: Local Standard Time + Longitude Adjustment
  // If DST is active, we need to subtract 1 hour to get back to Standard Time first.
  let finalDate = dt;
  if (dt.isInDST) {
    finalDate = dt.minus({ hours: 1 });
  }
  
  // Apply longitude adjustment
  const tstDate = finalDate.plus({ minutes: longitudeAdjustment });
  
  return { 
    zone, 
    isDST: dt.isInDST, 
    longitudeAdjustment,
    tstDate: tstDate.toJSDate()
  };
};

/**
 * Calculate BaZi (Saju) using lunar-typescript.
 */
export const calculateRealBaZi = (input: UserInput, lat: number, lon: number, lang: Language): BaZiResult => {
  try {
    // 1. Get precise cosmic time
    const { tstDate, zone } = getCosmicTime(input.birthDate, input.birthTime, lat, lon);
    console.log(`Cosmic Time: ${tstDate.toString()} (Zone: ${zone})`);
    
    // 2. Initialize Lunar/Solar
    const solar = Solar.fromDate(tstDate);
    console.log("Solar initialized:", solar.toFullString());
    
    // Check range (lunar-typescript typically supports 1900-2100)
    const year = tstDate.getFullYear();
    if (year < 1900 || year > 2100) {
      throw new Error(`Date ${year} is out of cosmic range (1900-2100)`);
    }

    const lunar = Lunar.fromDate(tstDate);
    console.log("Lunar initialized:", lunar.toFullString());
    
    const baZi = lunar.getEightChar();
    console.log("BaZi EightChar:", baZi ? "Generated" : "FAILED");
    
    if (!baZi) {
      throw new Error("Failed to generate Eight Characters (BaZi) for this cosmic alignment.");
    }
  
  // 3. Extract 4 Pillars (Year, Month, Day, Hour)
  const dayGan = baZi.getDayGan();
  const pillarsRaw = [
    { title: 'Hour', stem: baZi.getTimeGan(), branch: baZi.getTimeZhi() },
    { title: 'Day', stem: baZi.getDayGan(), branch: baZi.getDayZhi() },
    { title: 'Month', stem: baZi.getMonthGan(), branch: baZi.getMonthZhi() },
    { title: 'Year', stem: baZi.getYearGan(), branch: baZi.getYearZhi() },
  ];

  // 4. Map to Goth-Punk UI Cards
  const pillars: BaZiCard[] = pillarsRaw.map((p) => {
    const stemInfo = BAZI_MAPPING.stems[p.stem as keyof typeof BAZI_MAPPING.stems] || { ko: p.stem, en: p.stem, element: 'Earth' };
    const branchInfo = BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches] || { ko: p.branch, en: p.branch };
    
    // Calculate Ten Gods (십성)
    let stemTenGod = '';
    let branchTenGod = '';
    try {
      if (p.title === 'Year') {
        stemTenGod = baZi.getYearShiShenGan();
        branchTenGod = baZi.getYearShiShenZhi()[0];
      }
      if (p.title === 'Month') {
        stemTenGod = baZi.getMonthShiShenGan();
        branchTenGod = baZi.getMonthShiShenZhi()[0];
      }
      if (p.title === 'Day') {
        stemTenGod = 'Self';
        branchTenGod = baZi.getDayShiShenZhi()[0];
      }
      if (p.title === 'Hour') {
        stemTenGod = baZi.getTimeShiShenGan();
        branchTenGod = baZi.getTimeShiShenZhi()[0];
      }
    } catch (e) {
      console.warn(`Failed to get Ten God for ${p.title}`, e);
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
  
  let currentCycleIndex = -1;

  const grandCycles = daYun.slice(1, 11).map((dy: any, idx: number) => {
    try {
      if (!dy) throw new Error("Null cycle");
      
      const ganZhi = dy.getGanZhi();
      const gan = ganZhi[0];
      const zhi = ganZhi[1];
      
      const startAge = dy.getStartAge();
      const startYear = dy.getStartYear();
      const gTenGod = getTenGod(dayGan, gan, zhi);

      if (currentAge >= startAge) {
        currentCycleIndex = idx;
      }

      // Calculate annual pillars (Se-Un) for this Grand Cycle using LiuNian
      const liuNian = dy.getLiuNian();
      const annualPillars = liuNian.map((ln: any) => {
        const lnGanZhi = ln.getGanZhi();
        const lnGan = lnGanZhi[0];
        const lnZhi = lnGanZhi[1];
        const lnTenGod = getTenGod(dayGan, lnGan, lnZhi);
        
        // Calculate monthly pillars (Wol-Un) for this year using LiuYue
        const liuYue = ln.getLiuYue();
        const monthlyPillars = liuYue.map((ly: any, monthIdx: number) => {
          const lyGanZhi = ly.getGanZhi();
          const lyGan = lyGanZhi[0];
          const lyZhi = lyGanZhi[1];
          const lyTenGod = getTenGod(dayGan, lyGan, lyZhi);

          // For daily pillars, we still need to calculate them manually or from Solar
          // To keep it performant, we only calculate daily pillars for the CURRENT month or if explicitly needed
          // But for now, let's just provide a placeholder or a limited set to avoid performance issues
          // Actually, let's just calculate them for the first day of each month to show something
          const dailyPillars: any[] = [];
          // (Daily pillars are very heavy, consider lazy loading or limiting)

          return {
            month: monthIdx + 1,
            stem: lyGan,
            branch: lyZhi,
            element: BAZI_MAPPING.stems[lyGan as keyof typeof BAZI_MAPPING.stems]?.element || 'Earth',
            ...lyTenGod,
            dailyPillars
          };
        });

        return {
          year: ln.getYear(),
          age: startAge + (ln.getYear() - startYear),
          stem: lnGan,
          branch: lnZhi,
          element: BAZI_MAPPING.stems[lnGan as keyof typeof BAZI_MAPPING.stems]?.element || 'Earth',
          ...lnTenGod,
          monthlyPillars
        };
      });

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

  return {
    pillars,
    grandCycles,
    currentCycleIndex
  };
} catch (error) {
  console.error("BaZi calculation error in service:", error);
  throw error;
}
};
