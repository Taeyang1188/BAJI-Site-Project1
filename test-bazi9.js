import { Solar, Lunar } from 'lunar-typescript';
const date = new Date(2000, 1, 9, 1, 0, 0);
const lunar = Lunar.fromDate(date);
const bazi = lunar.getEightChar();
console.log("01:00:", bazi.getDayGan() + bazi.getDayZhi(), bazi.getTimeGan() + bazi.getTimeZhi());
