import { Solar, Lunar, EightChar } from 'lunar-typescript';

const date1 = new Date(2000, 1, 8, 23, 0, 0);
const lunar1 = Lunar.fromDate(date1);
const bazi1 = lunar1.getEightChar();

console.log("Day Gan:", bazi1.getDayGan());
console.log("Day Zhi:", bazi1.getDayZhi());
console.log("Time Gan:", bazi1.getTimeGan());
console.log("Time Zhi:", bazi1.getTimeZhi());

// Try to manually get the time pillar based on the day pillar
// The formula for time stem is: (dayStemIndex * 2 + timeBranchIndex) % 10
const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const dayStemIdx = stems.indexOf("丙"); // 2
const timeBranchIdx = branches.indexOf("子"); // 0
const timeStemIdx = (dayStemIdx * 2 + timeBranchIdx) % 10; // (2 * 2 + 0) % 10 = 4 -> 戊

console.log("Calculated Time Pillar for 丙 day, 子 hour:", stems[timeStemIdx] + branches[timeBranchIdx]);

const timeBranchIdxPig = branches.indexOf("亥"); // 11
const timeStemIdxPig = (dayStemIdx * 2 + timeBranchIdxPig) % 10; // (4 + 11) % 10 = 15 % 10 = 5 -> 己
console.log("Calculated Time Pillar for 丙 day, 亥 hour:", stems[timeStemIdxPig] + branches[timeBranchIdxPig]);

