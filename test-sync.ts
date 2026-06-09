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

const getAdj = (res: any) => {
    const rawRatios = res.analysis?.elementRatios || {};
    const adjusted: Record<string, number> = {};
    const ELEMENT_KOR = { Wood: '목', Fire: '화', Earth: '토', Metal: '금', Water: '수' };
    ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].forEach(el => {
      const key = Object.keys(rawRatios).find(k => k.includes(el) || k.includes(ELEMENT_KOR[el as keyof typeof ELEMENT_KOR]));
      adjusted[el] = key ? rawRatios[key] : 0;
    });
    return adjusted;
};

const adj1 = getAdj(result1);
const adj2 = getAdj(result2);

const dyn = calculateRelationshipDynamics(result1, result2, adj1, adj2, 'KO');
console.log("Score:", dyn.syncScore);
console.log("Gates:", dyn.gates);
console.log("Text:", dyn.text);
