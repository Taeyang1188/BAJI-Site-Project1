import { Solar } from 'lunar-typescript';

const solar = Solar.fromYmd(2007, 4, 7);
const lunar = solar.getLunar();
const baZi = lunar.getEightChar();
const yun = baZi.getYun(1);
const daYun = yun.getDaYun();
const liuNian = daYun[2].getLiuNian(); // DaYun 2 (2017-2026)
const ln2026 = liuNian.find(ln => ln.getYear() === 2026);
if (ln2026) {
  const liuYue = ln2026.getLiuYue();
  liuYue.forEach((ly, i) => {
    console.log(`LiuYue ${i+1}:`, ly.getGanZhi());
  });
}
