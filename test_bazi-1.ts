import { calculateRealBaZi } from './src/services/bazi-service';

const input1 = {
  name: 'User1',
  birthDate: '1992-06-11',
  birthTime: '10:40',
  calendarType: 'solar' as const,
  gender: 'male' as const,
  city: '서울'
};

const input2 = {
  name: 'User2',
  birthDate: '1993-02-26',
  birthTime: '10:40',
  calendarType: 'solar' as const,
  gender: 'male' as const,
  city: '서울'
};

const input3 = {
  name: 'User3',
  birthDate: '1990-11-16',
  birthTime: '14:00',
  calendarType: 'solar' as const,
  gender: 'female' as const,
  city: '서울'
};

const bazi1 = calculateRealBaZi(input1, 37.5, 126.9, 'KO');
const bazi2 = calculateRealBaZi(input2, 37.5, 126.9, 'KO');
const bazi3 = calculateRealBaZi(input3, 37.5, 126.9, 'KO');

const cleanBazi = (b: any) => ({
  pillars: b.pillars,
  analysis: b.analysis,
  daeun: typeof b.daeun !== 'undefined' ? (b.daeun ? b.daeun.slice(0, 2) : 'none') : 'none'
});

console.log('--- 19920611 10:40 Male ---');
console.log(JSON.stringify(cleanBazi(bazi1), null, 2));
console.log('--- 19930226 10:40 Male ---');
console.log(JSON.stringify(cleanBazi(bazi2), null, 2));
console.log('--- 19901116 14:00 Female ---');
console.log(JSON.stringify(cleanBazi(bazi3), null, 2));
