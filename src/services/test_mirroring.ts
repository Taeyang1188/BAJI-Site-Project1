import { calculateRealBaZi } from './bazi-service';
import { calculateRelationshipDynamics } from './relationship-dynamics-service';

const u1 = { name: "User M", birthDate: "1993-02-26", birthTime: "10:40", city: "서울", gender: 'male' as const, calendarType: 'solar' as const };
const u2 = { name: "User F", birthDate: "1990-11-16", birthTime: "14:00", city: "서울", gender: 'female' as const, calendarType: 'solar' as const };

const bazi1 = calculateRealBaZi(u1, 37.5, 126.97, 'KO');
const bazi2 = calculateRealBaZi(u2, 37.5, 126.97, 'KO');

const rel1 = calculateRelationshipDynamics(bazi1, bazi2, bazi1.analysis?.elementRatios || {}, bazi2.analysis?.elementRatios || {}, 'KO');
const gates1 = rel1.gates.map(g => g.name);

const rel2 = calculateRelationshipDynamics(bazi2, bazi1, bazi2.analysis?.elementRatios || {}, bazi1.analysis?.elementRatios || {}, 'KO');
const gates2 = rel2.gates.map(g => g.name);

console.log("M DM:", bazi1.pillars.find(p=>p.title==='Day' || p.title==='일주')?.stem);
console.log("M Branches:", bazi1.pillars.map(p=>p.branch).join(''));
console.log("F DM:", bazi2.pillars.find(p=>p.title==='Day' || p.title==='일주')?.stem);
console.log("F Branches:", bazi2.pillars.map(p=>p.branch).join(''));
console.log("F User GeJu:", bazi2.analysis?.geJu, "Weak:", (bazi2.analysis?.dayMasterStrength?.score || 50) < 35);

const uGc1 = bazi1.analysis?.geJu;
const uGc2 = bazi2.analysis?.geJu;
console.log("GeJu pair rel1:", uGc1, "and", uGc2);
console.log("rel1 (M user):", gates1);
console.log("rel1 structuralSynergy:", rel1.structuralSynergy?.badge);
console.log("rel2 (F user):", gates2);
console.log("rel2 structuralSynergy:", rel2.structuralSynergy?.badge);
