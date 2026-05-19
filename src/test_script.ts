import { calculateRealBaZi } from './services/bazi-service';

const input = {
  calendarType: 'solar' as const,
  birthDate: '1990-11-16',
  birthTime: '14:00',
  isTimeUnknown: false,
  gender: 'female' as const,
  name: '사용자',
  city: 'Seoul'
};

const result = calculateRealBaZi(input, 37.5665, 126.9780, 'KO'); // Seoul Latitude & Longitude
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

