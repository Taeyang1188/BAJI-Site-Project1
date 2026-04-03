import { Solar, Lunar, EightChar } from 'lunar-typescript';
import { DateTime } from 'luxon';
import tzlookup from 'tz-lookup';
import { UserInput, BaZiResult, BaZiCard, Language } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { calculateGeJu, calculateTenGodsRatio, determineStructure } from './bazi-analysis';
import { calculateInteractions as calculateDetailedInteractions } from './bazi-interactions';
import { detectShinsal } from './bazi-shinsal';
import { calcDayMasterStrength, determineYongshin, checkByeongYak, checkTongGwan } from './bazi-yongshin';

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
 * Calculate precise cosmic time including Timezone and DST adjustment.
 * Longitude adjustment is explicitly removed per user request to prioritize Standard Time.
 */
export const getCosmicTime = (dateStr: string, timeStr: string, lat: number, lon: number) => {
  // 1. Find timezone ID from lat/lon (e.g., "America/New_York")
  const zone = tzlookup(lat, lon) || 'Asia/Seoul';
  
  // Parse timeStr to ensure 24-hour format
  let hour = 0;
  let minute = 0;
  
  // Handle "HH:mm AM/PM" or "HH:mm" formats
  const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM|am|pm))?$/);
  if (timeMatch) {
    let h = parseInt(timeMatch[1], 10);
    const m = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3]?.toUpperCase();

    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    
    hour = h;
    minute = m;
  } else {
    // Fallback if format is unexpected, though input type="time" usually gives HH:mm in 24h
    const parts = timeStr.split(':');
    hour = parseInt(parts[0], 10) || 0;
    minute = parseInt(parts[1], 10) || 0;
  }

  // Format as strict ISO 8601 time string (HH:mm:00)
  const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
  
  // 2. Create DateTime in that zone to check for DST
  // ISO format: YYYY-MM-DDTHH:mm:00
  const dt = DateTime.fromISO(`${dateStr}T${formattedTime}`, { zone });
  
  if (!dt.isValid) {
    throw new Error(`Invalid Date or Time: ${dateStr} ${timeStr} (parsed as ${formattedTime})`);
  }
  
  console.log(`Parsed Time: Input=${timeStr}, Hour=${hour}, Minute=${minute}, Formatted=${formattedTime}`);

  // 3. Final adjusted date for BaZi calculation
  // We subtract DST offset if active to get Standard Time.
  // Longitude adjustment is REMOVED to keep the exact input time (Standard Time).
  let finalDate = dt;
  if (dt.isInDST) {
    finalDate = dt.minus({ hours: 1 });
  }
  
  // 4. Create a local Date object matching the exact Standard Time components.
  // This ensures lunar-typescript reads the exact year, month, day, hour, minute
  // regardless of the server's actual timezone.
  const tstDate = new Date(
    finalDate.year,
    finalDate.month - 1,
    finalDate.day,
    finalDate.hour,
    finalDate.minute
  );
  
  return { 
    zone, 
    isDST: dt.isInDST, 
    longitudeAdjustment: 0,
    tstDate
  };
};

/**
 * Calculate BaZi (Saju) using lunar-typescript.
 */
export const calculateRealBaZi = (input: UserInput, lat: number, lon: number, lang: Language): BaZiResult => {
  try {
    let birthDateStr = input.birthDate;

    if (input.calendarType === 'lunar') {
      const parts = birthDateStr.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        const lunarObj = Lunar.fromYmd(y, m, d);
        const solarObj = lunarObj.getSolar();
        birthDateStr = `${solarObj.getYear()}-${solarObj.getMonth().toString().padStart(2, '0')}-${solarObj.getDay().toString().padStart(2, '0')}`;
        console.log(`Converted Lunar ${input.birthDate} to Solar ${birthDateStr}`);
      }
    }

    // 1. Get precise cosmic time
    const { tstDate, zone } = getCosmicTime(birthDateStr, input.birthTime, lat, lon);
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
  let dayGan = baZi.getDayGan();
  let dayZhi = baZi.getDayZhi();
  let timeGan = baZi.getTimeGan();
  let timeZhi = baZi.getTimeZhi();
  
  const hour = tstDate.getHours();
  const minute = tstDate.getMinutes();
  
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  
  if (hour === 23) {
    // For 23:00 ~ 23:59, we use the current day's pillar.
    // lunar-typescript might advance the day at 23:00, so we get the day pillar from 12:00 PM of the same date.
    const noonDate = new Date(tstDate.getFullYear(), tstDate.getMonth(), tstDate.getDate(), 12, 0, 0);
    const noonLunar = Lunar.fromDate(noonDate);
    const noonBazi = noonLunar.getEightChar();
    
    dayGan = noonBazi.getDayGan();
    dayZhi = noonBazi.getDayZhi();
    
    const dayStemIdx = stems.indexOf(dayGan);
    
    if (minute < 30) {
      // 23:00 ~ 23:29: Pig hour (亥時) of the current day
      const timeBranchIdx = 11; // 亥
      const timeStemIdx = (dayStemIdx * 2 + timeBranchIdx) % 10;
      timeGan = stems[timeStemIdx];
      timeZhi = branches[timeBranchIdx];
    } else {
      // 23:30 ~ 23:59: Night Rat Hour (夜子時) of the current day
      const timeBranchIdx = 0; // 子
      const timeStemIdx = (dayStemIdx * 2 + timeBranchIdx) % 10;
      timeGan = stems[timeStemIdx];
      timeZhi = branches[timeBranchIdx];
    }
  } else if (hour === 0) {
    // 00:00 ~ 00:59: Morning Rat Hour (朝子時)
    // lunar-typescript handles this correctly (uses current date's day pillar, and Rat hour stem calculated from it).
    // However, to be absolutely safe and consistent with standard Bazi, 
    // Morning Rat Hour uses the Rat hour stem of the CURRENT day (which is the "next day" relative to 23:00).
    // So we can just use lunar-typescript's default output.
  }
  
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
    
    const birthDateObj = tstDate;
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

          // Calculate daily pillars for the month
          const dailyPillars: any[] = [];
          const year = ln.getYear();
          const month = monthIdx + 1;
          
          // Get number of days in the month
          const daysInMonth = new Date(year, month, 0).getDate();
          
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const solar = Solar.fromDate(date);
            const lunar = Lunar.fromDate(date);
            const baZi = lunar.getEightChar();
            
            const dGan = baZi.getDayGan();
            const dZhi = baZi.getDayZhi();
            const dTenGod = getTenGod(dayGan, dGan, dZhi);
            
            dailyPillars.push({
              day,
              stem: dGan,
              branch: dZhi,
              ...dTenGod
            });
          }

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
    if (branchElement) elementCounts[branchElement as keyof typeof elementCounts]++;
  });

  const geJu = calculateGeJu(dayGan, monthZhi, lang);
  const tenGodsRatio = calculateTenGodsRatio(pillars, lang);
  
  // New detailed calculations
  const shinsalResult = detectShinsal(allStems, allBranches, yearGan, yearZhi, dayGan, dayZhi);
  const strength = calcDayMasterStrength(allStems, allBranches);
  const structureDetail = determineStructure(dayGan, pillars, strength, tenGodsRatio, lang);

  const yongshinDetail = determineYongshin(allStems, allBranches, geJu, strength);
  const interactionsResult = calculateDetailedInteractions(allStems, allBranches, pillars, yongshinDetail);
  
  // Check for ByeongYak and TongGwan
  const byeongYak = checkByeongYak(allStems, allBranches, yongshinDetail);
  const tongGwan = checkTongGwan(allStems, allBranches);
  
  if (byeongYak) yongshinDetail.byeongYak = byeongYak;
  if (tongGwan) yongshinDetail.tongGwan = tongGwan;

  let translatedGod = yongshinDetail.primary.god;
  let translatedElement = yongshinDetail.primary.element;
  
  if (lang === 'EN') {
    if (translatedGod === "식상/재성/관성") translatedGod = "Output/Wealth/Power";
    else if (translatedGod === "인성/비겁") translatedGod = "Wisdom/Self";
    else if (translatedGod === "인성") translatedGod = "Wisdom";
    else if (translatedGod === "비겁") translatedGod = "Self";
    else if (translatedGod === "식상") translatedGod = "Output";
    else if (translatedGod === "재성") translatedGod = "Wealth";
    else if (translatedGod === "관성") translatedGod = "Power";
  } else if (lang === 'KO') {
    const elementKoMap: Record<string, string> = { Wood: '목(木)', Fire: '화(火)', Earth: '토(土)', Metal: '금(金)', Water: '수(水)' };
    if (translatedElement.includes('/')) {
      translatedElement = translatedElement.split('/').map(el => elementKoMap[el] || el).join('/');
    } else {
      translatedElement = elementKoMap[translatedElement] || translatedElement;
    }
  }

  return {
    pillars,
    grandCycles,
    currentCycleIndex,
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
      structureDetail
    }
  };
} catch (error) {
  console.error("BaZi calculation error in service:", error);
  throw error;
}
};
