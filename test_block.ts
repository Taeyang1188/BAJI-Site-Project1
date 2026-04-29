import fs from 'fs';

const fileContent = fs.readFileSync('src/data/ilju-dataset.ts', 'utf8');
const key = '癸卯';
const regex = new RegExp(`(  '${key}': \\{[\\s\\S]*?)(?=  '[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]'|  \\})|  '${key}': \\{[\\s\\S]*?\\}\\n\\}`);
let blockMatch = fileContent.match(regex);
console.log("Length of block:", blockMatch[0].length);
console.log("Last 50 chars of block:", blockMatch[0].slice(-50));
