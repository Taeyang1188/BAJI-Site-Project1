import { calculateBazi } from './src/services/bazi-service';
import { Lunar, Solar } from 'lunar-typescript';

const result = calculateBazi({
    birthDate: '1993-02-26',
    birthTime: '10:40',
    gender: 'male',
    isLunar: false,
    isIntermonth: false,
    isTimeUnknown: false
});

console.log('Year stem:', result.pillars[0].stem, 'Year branch:', result.pillars[0].branch);
console.log('Gender:', result.gender);
console.log('Direction:', result.daeunDirection);
// print current daeun
console.log('Current cycle:', result.grandCycles[result.currentCycleIndex]);
