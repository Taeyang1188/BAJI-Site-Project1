import { Solar, Lunar, EightChar } from 'lunar-typescript';

// Test default behavior
const date1 = new Date(2000, 1, 8, 23, 0, 0);
const lunar1 = Lunar.fromDate(date1);
const bazi1 = lunar1.getEightChar();
console.log("Default 23:00:");
console.log("Day:", bazi1.getDayGan() + bazi1.getDayZhi());
console.log("Hour:", bazi1.getTimeGan() + bazi1.getTimeZhi());

// Test with exact time and sect
bazi1.setSect(2); // 1 for early rat, 2 for late rat?
console.log("Sect 2 23:00:");
console.log("Day:", bazi1.getDayGan() + bazi1.getDayZhi());
console.log("Hour:", bazi1.getTimeGan() + bazi1.getTimeZhi());

bazi1.setSect(1);
console.log("Sect 1 23:00:");
console.log("Day:", bazi1.getDayGan() + bazi1.getDayZhi());
console.log("Hour:", bazi1.getTimeGan() + bazi1.getTimeZhi());
