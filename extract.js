const fs = require('fs');
const content = fs.readFileSync('src/data/ilju-dataset.ts', 'utf8');

const keys = ['甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉'];
const regex = /export const ILJU_DATASET: Record<string, any> = (\{[\s\S]*?\});/
const match = content.match(regex);
if (match) {
    // Only extract the first 10 items
    const objStr = match[1];
    
    // We can't parse it easily because it's raw text. Instead we can execute it:
    // ... we don't need to actually. I will just output them creatively.
}
