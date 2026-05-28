import { calculateRealBaZi } from './src/services/bazi-service';

const result = calculateRealBaZi({
    birthDate: '1993-02-26',
    birthTime: '10:40',
    gender: 'male',
    isLunar: false,
    isIntermonth: false,
    isTimeUnknown: false
}, 37.5, 127.0, 'KO');

console.log('Pillars:', result.pillars.map(p => p.stem + p.branch));
console.log('Gender:', result.gender);
console.log('Direction:', result.daeunDirection);
// print current daeun
console.log('Current cycle index:', result.currentCycleIndex);
console.log('Current cycle:', result.grandCycles[result.currentCycleIndex]);

console.log('Current year pillar:', result.currentYearPillar);
