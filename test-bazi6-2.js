import { Solar, Lunar } from 'lunar-typescript';
const date = new Date(2000, 1, 8, 12, 0, 0); // 2000-02-08 12:00
const lunar = Lunar.fromDate(date);
const bazi = lunar.getEightChar();
console.log("Day:", bazi.getDayGan() + bazi.getDayZhi());
