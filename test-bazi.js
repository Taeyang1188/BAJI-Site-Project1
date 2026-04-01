import { Solar, Lunar } from 'lunar-typescript';
const date = new Date(2000, 1, 8, 23, 0, 0); // 2000-02-08 23:00
const lunar = Lunar.fromDate(date);
const bazi = lunar.getEightChar();
console.log(bazi.getYearGan() + bazi.getYearZhi());
console.log(bazi.getMonthGan() + bazi.getMonthZhi());
console.log(bazi.getDayGan() + bazi.getDayZhi());
console.log(bazi.getTimeGan() + bazi.getTimeZhi());
