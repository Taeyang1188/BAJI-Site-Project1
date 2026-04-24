import { analyzeBazi } from './src/services/bazi-engine';
import { BAZI_MAPPING } from './src/constants/bazi-mapping';

const bazi = analyzeBazi('1991-09-18', '18:00', 'female');
console.log(JSON.stringify(bazi.analysis.fiveElements, null, 2));
console.log("Yongshin:", bazi.analysis.yongShin);
console.log("Hishin:", bazi.analysis.hiShin);
console.log("Gishin:", bazi.analysis.giShin);

console.log("Current cycle:", bazi.cycles.daewun.currentCycle);
const annuals = bazi.cycles.daewun.currentCycle.annualPillars;
console.log("Annuals:");
annuals.forEach(p => {
    // calculate score manually to see
    console.log(p.year, p.stem, p.branch, p.stemTenGodKo, p.branchTenGodKo);
});
