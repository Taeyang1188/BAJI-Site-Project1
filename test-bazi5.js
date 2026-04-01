import { Solar, Lunar, EightChar } from 'lunar-typescript';

const date1 = new Date(2000, 1, 8, 23, 0, 0);
const lunar1 = Lunar.fromDate(date1);
const bazi1 = lunar1.getEightChar();

bazi1.setSect(2); // Night Rat Hour
console.log("Sect 2:");
console.log("Day:", bazi1.getDayGan() + bazi1.getDayZhi());
console.log("Hour:", bazi1.getTimeGan() + bazi1.getTimeZhi());

bazi1.setSect(1); // Morning Rat Hour
console.log("Sect 1:");
console.log("Day:", bazi1.getDayGan() + bazi1.getDayZhi());
console.log("Hour:", bazi1.getTimeGan() + bazi1.getTimeZhi());
