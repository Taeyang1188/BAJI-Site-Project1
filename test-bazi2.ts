import { analyzeBazi } from './src/services/bazi-engine.ts';

const bazi = analyzeBazi('1991-09-18', '18:00', 'female');
console.log("Yongshin:", bazi.analysis.yongShin);
console.log("Hishin:", bazi.analysis.hiShin);
console.log("Ten gods:", bazi.pillars.map(p => p.stemTenGodKo + ' ' + p.branchTenGodKo));

const currentCycle = bazi.cycles.daewun.currentCycle;
const currentYr = new Date().getFullYear();
const annualScores = currentCycle.annualPillars.map(p => {
    let score = 50;
    const sEl = p.stem === '丙' || p.stem === '丁' ? 'Fire' : p.stem === '戊' || p.stem === '己' ? 'Earth' : p.stem === '庚' || p.stem === '辛' ? 'Metal' : p.stem === '壬' || p.stem === '癸' ? 'Water' : 'Wood';
    const bEl = p.branch === '巳' || p.branch === '午' ? 'Fire' : p.branch === '辰' || p.branch === '戌' || p.branch === '丑' || p.branch === '未' ? 'Earth' : p.branch === '申' || p.branch === '酉' ? 'Metal' : p.branch === '亥' || p.branch === '子' ? 'Water' : 'Wood';
    
    if (sEl === 'Wood') score += 25;
    if (bEl === 'Wood') score += 25;
    if (sEl === 'Water') score += 15;
    if (bEl === 'Water') score += 15;
    if (sEl === bazi.analysis.yongShin || bEl === bazi.analysis.yongShin) score += 15;
    if (sEl === bazi.analysis.hiShin || bEl === bazi.analysis.hiShin) score += 10;
    if (sEl === bazi.analysis.giShin || bEl === bazi.analysis.giShin) score -= 20;

    const godsStr = p.stemTenGodKo + ' ' + p.branchTenGodKo;
    if (godsStr.includes('정재')) score += 15;
    if (godsStr.includes('편재')) score += 20;
    if (godsStr.includes('식신') || godsStr.includes('상관')) score += 10;
    if (godsStr.includes('겁재')) score -= 15;
    if (godsStr.includes('비견')) score -= 10;
    return { year: p.year, score, stem: p.stem, branch: p.branch };
});
console.log(annualScores.sort((a,b) => b.score - a.score));

