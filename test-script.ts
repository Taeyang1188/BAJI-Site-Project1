import { calculateRealBaZi } from './src/services/bazi-service';
import { calculateRelationshipDynamics } from './src/services/relationship-dynamics-service';

const uInput: any = { year: 1993, month: 2, day: 26, hour: 10, minute: 40, isLunar: false, gender: 'male', birthDate: '1993-02-26', birthTime: '10:40' };
const pInput: any = { year: 1990, month: 11, day: 16, hour: 14, minute: 0, isLunar: false, gender: 'female', birthDate: '1990-11-16', birthTime: '14:00' };

const test = () => {
    try {
        const uKo = calculateRealBaZi(uInput, 37.5665, 126.9780, 'KO');
        const pKo = calculateRealBaZi(pInput, 37.5665, 126.9780, 'KO');
        
        const uEn = calculateRealBaZi(uInput, 37.5665, 126.9780, 'EN');
        const pEn = calculateRealBaZi(pInput, 37.5665, 126.9780, 'EN');
        
        const resKo = calculateRelationshipDynamics(uKo as any, pKo as any, uKo.analysis.elementRatios, pKo.analysis.elementRatios, 'KO');
        const resEn = calculateRelationshipDynamics(uEn as any, pEn as any, uEn.analysis.elementRatios, pEn.analysis.elementRatios, 'EN');
        
        console.log("KO Score:", resKo.syncScore);
        console.log("EN Score:", resEn.syncScore);
    } catch(e) {
        console.error(e);
    }
}

test();

