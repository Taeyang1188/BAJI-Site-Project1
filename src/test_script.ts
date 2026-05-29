import { calculateRealBaZi } from './services/bazi-service';

const input = {
  calendarType: 'solar' as const,
  birthDate: '1994-04-13',
  birthTime: '23:18',
  isTimeUnknown: false,
  gender: 'male' as const,
  name: '사용자',
  city: 'Seoul'
};

const result = calculateRealBaZi(input, 37.5665, 126.9780, 'KO'); 
import { generateCoreRemedy, generateCycleVibe } from './services/cycle-vibe-service';

console.log("\n=== CORE REMEDY KO ===");
console.log(generateCoreRemedy(result.analysis, 'KO'));

console.log("\n=== CYCLE VIBE GENERAL MAIN (Includes remedy?) ===");
const cycleResult = generateCycleVibe(result, 'KO', 'Tester', 'male', 'Seoul', { maritalStatus: 'single', hasChildren: false });
console.log(cycleResult.themeAnalyses['general'].main.includes("개운법"));
