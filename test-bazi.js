const { Solar } = require('lunar-typescript');
const solar = Solar.fromYmdHms(1993, 2, 26, 10, 40, 0);
const lunar = solar.getLunar();
const baZi = lunar.getEightChar();
console.log(baZi.getYearGan() + baZi.getYearZhi());
console.log(baZi.getMonthGan() + baZi.getMonthZhi());
console.log(baZi.getDayGan() + baZi.getDayZhi());
console.log(baZi.getTimeGan() + baZi.getTimeZhi());
