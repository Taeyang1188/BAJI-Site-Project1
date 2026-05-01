import { calculateRealBaZi } from './src/services/bazi-service.ts';
import { calculateRelationshipDynamics } from './src/services/relationship-dynamics-service.ts';

const bd1 = {
  birthDate: "1994-10-13",
  birthTime: "15:00",
  calendarType: "solar" as any,
  gender: 'male' as any,
  name: 'User 1',
  city: 'Test'
};

const bd2 = {
  birthDate: "1992-06-11",
  birthTime: "10:40",
  calendarType: "solar" as any,
  gender: 'male' as any,
  name: 'User 2',
  city: 'Test'
};

const result1 = calculateRealBaZi(bd1, 37.4563, 126.7052, 'KO');
const result2 = calculateRealBaZi(bd2, 37.4563, 126.7052, 'KO');

const cleanElement = (el: string) => {
    return el.replace(/\(.*\)/g, '').replace(/[^a-zA-Z]/g, '').trim();
};

const getElements = (detailObj: any) => {
    if (!detailObj) return [];
    return detailObj.element ? detailObj.element.split(/[,/]/).map((s: string) => cleanElement(s.trim())).filter(Boolean) : [];
};

const uYongHee = [
    ...getElements(result1.analysis?.yongshinDetail?.primary),
    ...getElements(result1.analysis?.yongshinDetail?.heeShin)
];
const uGiGu = [
    ...getElements(result1.analysis?.yongshinDetail?.giShin),
    ...getElements(result1.analysis?.yongshinDetail?.guShin)
];
const pYongHee = [
    ...getElements(result2.analysis?.yongshinDetail?.primary),
    ...getElements(result2.analysis?.yongshinDetail?.heeShin)
];
const pGiGu = [
    ...getElements(result2.analysis?.yongshinDetail?.giShin),
    ...getElements(result2.analysis?.yongshinDetail?.guShin)
];

console.log("uYongHee", uYongHee, "uGiGu", uGiGu);
console.log("pYongHee", pYongHee, "pGiGu", pGiGu);

const adj1 = { Wood: 25, Fire: 12.5, Earth: 37.5, Metal: 12.5, Water: 12.5 };
const adj2 = { Wood: 0, Fire: 62.5, Earth: 12.5, Metal: 12.5, Water: 12.5 };

let uBenefitScore = 0;
Object.entries(adj2).forEach(([k, v]) => {
    const el = cleanElement(k);
    if (uYongHee.includes(el)) uBenefitScore += (v / 100) * 25;
    if (uGiGu.includes(el)) uBenefitScore -= (v / 100) * 25;
});

let pBenefitScore = 0;
Object.entries(adj1).forEach(([k, v]) => {
    const el = cleanElement(k);
    if (pYongHee.includes(el)) pBenefitScore += (v / 100) * 25;
    if (pGiGu.includes(el)) pBenefitScore -= (v / 100) * 25;
});

let baseScore = 50 + uBenefitScore + pBenefitScore;
const diff = Math.abs(uBenefitScore - pBenefitScore);
baseScore -= diff * 0.5;

console.log("uBenefitScore:", uBenefitScore);
console.log("pBenefitScore:", pBenefitScore);
console.log("baseScore:", baseScore);


