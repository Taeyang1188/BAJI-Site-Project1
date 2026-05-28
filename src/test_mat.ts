import { calculateRealBaZi } from './services/bazi-service';
import { buildBaziMatrix } from './services/bazi-matrix-builder';
const result = calculateRealBaZi({
  calendarType: 'solar',
  birthDate: '1993-08-03',
  birthTime: '10:54',
  isTimeUnknown: false,
  gender: 'female',
  name: '사용자',
  city: 'Singapore'
}, 1.3521, 103.8198, 'KO');
const matrix = buildBaziMatrix(result, 'none', 50);
console.log(JSON.stringify(matrix.interactions, null, 2));
