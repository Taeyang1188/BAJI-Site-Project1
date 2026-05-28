import { calculateRealBaZi } from './services/bazi-service';
const result = calculateRealBaZi({
  calendarType: 'solar',
  birthDate: '1993-08-03',
  birthTime: '10:54',
  isTimeUnknown: false,
  gender: 'female',
  name: '사용자',
  city: 'Singapore'
}, 1.3521, 103.8198, 'KO');

console.log(JSON.stringify(result.analysis.interactions, null, 2));

const currentCycle = result.grandCycles[result.currentCycleIndex];
console.log("Daewun:", currentCycle.stem, currentCycle.branch);

const yearCycle = result.currentYearPillar;
console.log("Seun:", yearCycle.stem, yearCycle.branch);

// Also let's check Daewun/Seun specific interactions:
import { analyzeInteractionsDynamic } from './services/bazi-interactions';
const dyn = analyzeInteractionsDynamic(result.pillars.map(p => p.branch), currentCycle.branch, yearCycle.branch);
console.log(JSON.stringify(dyn, null, 2));
