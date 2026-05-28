import { calculateRealBaZi } from './services/bazi-service';

const input = {
  calendarType: 'solar' as const,
  birthDate: '1993-08-03',
  birthTime: '10:53',
  isTimeUnknown: false,
  gender: 'female' as const,
  name: '사용자',
  city: 'Singapore'
};

const result = calculateRealBaZi(input, 1.3521, 103.8198, 'KO'); // Singapore Latitude & Longitude
import { generateCycleVibe } from './services/cycle-vibe-service';

console.log("=== PILLARS ===");
result.pillars.forEach(p => {
  console.log(`${p.title}: ${p.hanja} (${p.stemKoreanName} / ${p.branchKoreanName}) [${p.element}]`);
});

console.log("\n=== Day Master ===");
console.log(result.pillars[1].stem);

import { generateCoreRemedy } from './services/cycle-vibe-service';
console.log("\n=== CORE REMEDY KO ===");
console.log(generateCoreRemedy(result.analysis, 'KO'));

console.log("\n=== Special Patterns (귀격 및 특수 패턴) ===");
console.log(result.analysis.specialPatterns);

