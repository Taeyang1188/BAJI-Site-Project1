import { Solar, Lunar, EightChar } from 'lunar-typescript';

const date1 = new Date(2000, 1, 8, 22, 30, 0); // 23:00 minus 30 mins
const lunar1 = Lunar.fromDate(date1);
const bazi1 = lunar1.getEightChar();

console.log("22:30:");
console.log("Day:", bazi1.getDayGan() + bazi1.getDayZhi());
console.log("Hour:", bazi1.getTimeGan() + bazi1.getTimeZhi());

const date2 = new Date(2000, 1, 8, 23, 0, 0); // 23:30 minus 30 mins
const lunar2 = Lunar.fromDate(date2);
const bazi2 = lunar2.getEightChar();

console.log("23:00:");
console.log("Day:", bazi2.getDayGan() + bazi2.getDayZhi());
console.log("Hour:", bazi2.getTimeGan() + bazi2.getTimeZhi());
