import { calculateRealBaZi } from './src/services/bazi-service.js';

const input = {
  name: "Test",
  gender: "male",
  birthDate: "2000-02-08",
  birthTime: "23:00",
  location: "Seoul"
};

const result = calculateRealBaZi(input, 37.5665, 126.9780, 'KO');
console.log("23:00 Pillars:");
result.pillars.forEach(p => console.log(`${p.title}: ${p.hanja} (${p.stemKoreanName} / ${p.branchKoreanName})`));

const input2 = {
  ...input,
  birthTime: "23:30"
};
const result2 = calculateRealBaZi(input2, 37.5665, 126.9780, 'KO');
console.log("\n23:30 Pillars:");
result2.pillars.forEach(p => console.log(`${p.title}: ${p.hanja} (${p.stemKoreanName} / ${p.branchKoreanName})`));

const input3 = {
  ...input,
  birthDate: "2000-02-09",
  birthTime: "00:00"
};
const result3 = calculateRealBaZi(input3, 37.5665, 126.9780, 'KO');
console.log("\n00:00 Pillars:");
result3.pillars.forEach(p => console.log(`${p.title}: ${p.hanja} (${p.stemKoreanName} / ${p.branchKoreanName})`));
