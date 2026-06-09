import * as fs from 'fs';

let txt = fs.readFileSync('src/services/cycle-vibe-service.ts', 'utf8');

// The problematic snippet is:
// clashNarrative = "
// 
// 이 시기에는 감정적인 혼인신고보다는 충분한 시간을 둔 검증이 필요해.";

const oldStr = `clashNarrative = "\n\n이 시기에는 감정적인 혼인신고보다는 충분한 시간을 둔 검증이 필요해.";`;
const newStr = `clashNarrative = "\\n\\n이 시기에는 감정적인 혼인신고보다는 충분한 시간을 둔 검증이 필요해.";`;

txt = txt.replace(oldStr, newStr);

fs.writeFileSync('src/services/cycle-vibe-service.ts', txt, 'utf8');

console.log("Fixed clash narrative string newline!");
