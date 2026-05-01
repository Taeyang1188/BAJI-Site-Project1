import { calculateRealBaZi } from './src/services/bazi-service.ts';

const bd = {
  birthDate: "1964-06-05",
  birthTime: "11:00",
  calendarType: "solar" as any,
  gender: 'female' as any,
  name: 'test',
  city: 'Test'
};

const result = calculateRealBaZi(bd, 37.4563, 126.7052, 'KO');
console.log(result.pillars);
