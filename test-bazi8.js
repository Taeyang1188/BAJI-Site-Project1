import { Solar, Lunar } from 'lunar-typescript';

function getCustomPillars(date) {
  const lunar = Lunar.fromDate(date);
  const bazi = lunar.getEightChar();
  
  let dayGan = bazi.getDayGan();
  let dayZhi = bazi.getDayZhi();
  let timeGan = bazi.getTimeGan();
  let timeZhi = bazi.getTimeZhi();
  
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  
  if (hour === 23) {
    if (minute < 30) {
      // 23:00 ~ 23:29: Pig hour of current day
      const noonDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
      const noonLunar = Lunar.fromDate(noonDate);
      const noonBazi = noonLunar.getEightChar();
      
      dayGan = noonBazi.getDayGan();
      dayZhi = noonBazi.getDayZhi();
      
      const dayStemIdx = stems.indexOf(dayGan);
      const timeBranchIdx = 11; // 亥
      const timeStemIdx = (dayStemIdx * 2 + timeBranchIdx) % 10;
      
      timeGan = stems[timeStemIdx];
      timeZhi = branches[timeBranchIdx];
    } else {
      // 23:30 ~ 23:59: Night Rat Hour of current day
      const noonDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
      const noonLunar = Lunar.fromDate(noonDate);
      const noonBazi = noonLunar.getEightChar();
      
      dayGan = noonBazi.getDayGan();
      dayZhi = noonBazi.getDayZhi();
      
      const dayStemIdx = stems.indexOf(dayGan);
      const timeBranchIdx = 0; // 子
      const timeStemIdx = (dayStemIdx * 2 + timeBranchIdx) % 10;
      
      timeGan = stems[timeStemIdx];
      timeZhi = branches[timeBranchIdx];
    }
  } else if (hour === 0) {
    // 00:00 ~ 00:59: Morning Rat Hour of current day (which is the "next day" relative to 23:00)
    // lunar-typescript already handles 00:00 as Rat hour of the current date.
    const noonDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
      const noonLunar = Lunar.fromDate(noonDate);
      const noonBazi = noonLunar.getEightChar();
      
      dayGan = noonBazi.getDayGan();
      dayZhi = noonBazi.getDayZhi();
      
      const dayStemIdx = stems.indexOf(dayGan);
      const timeBranchIdx = 0; // 子
      // Morning Rat Hour uses the NEXT day's Rat hour stem?
      // Wait, 00:00 is Morning Rat Hour of the current date.
      // The current date is already the "next day" relative to 23:00.
      // So we just use the current date's Rat hour stem.
      const timeStemIdx = (dayStemIdx * 2 + timeBranchIdx) % 10;
      
      timeGan = stems[timeStemIdx];
      timeZhi = branches[timeBranchIdx];
  }
  
  return { dayGan, dayZhi, timeGan, timeZhi };
}

console.log("23:00:", getCustomPillars(new Date(2000, 1, 8, 23, 0, 0)));
console.log("23:30:", getCustomPillars(new Date(2000, 1, 8, 23, 30, 0)));
console.log("00:00:", getCustomPillars(new Date(2000, 1, 9, 0, 0, 0)));
