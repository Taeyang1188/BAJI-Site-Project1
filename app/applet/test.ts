import { calculateRelationshipDynamics } from './src/services/relationship-dynamics-service.js';
import { calculateBaZi } from './src/services/bazi-service.js';
import { getAdjustedElements } from './src/services/bazi-advanced-analysis.js';

const res1 = calculateBaZi('19930803', '10:00', 'female');
const res2 = calculateBaZi('19930226', '10:40', 'male');

const uAdjusted = getAdjustedElements(res1, res1.analysis?.elementRatios);
const pAdjusted = getAdjustedElements(res2, res2.analysis?.elementRatios);

// Simulate the logic in do-refactor.ts
const ko = calculateRelationshipDynamics(res1, res2, uAdjusted, pAdjusted, 'KO');
const en = calculateRelationshipDynamics(res1, res2, uAdjusted, pAdjusted, 'EN');

console.log('KO Score:', ko.syncScore);
console.log('EN Score:', en.syncScore);

// What makes them different?
console.log('KO Gates:', ko.gates.map(g => g.name).join('\n'));
console.log('EN Gates:', en.gates.map(g => g.name).join('\n'));
