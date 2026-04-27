import fs from 'fs';

let ts = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf-8');

const regex1 = /const targetIdx = cycle\.indexOf\(daewunBranchEl\);\s*const diff = \(targetIdx - dmIdx \+ 5\) % 5;/;
const replacement1 = `const targetIdx = cycle.indexOf(daewunBranchEl);
    
    const dayBranch = result?.pillars?.[2]?.branch || '寅';
    let finalBranchEl = daewunBranchEl;
    let formsHap = false;
    let hapTransformed = false;

    // Yukhap check
    const yukhapMap: Record<string, string> = {
        '子丑': 'Earth', '丑子': 'Earth',
        '寅亥': 'Wood', '亥寅': 'Wood',
        '卯戌': 'Fire', '戌卯': 'Fire',
        '辰酉': 'Metal', '酉辰': 'Metal',
        '巳申': 'Water', '申巳': 'Water',
        '午未': 'Fire', '未午': 'Fire'
    };

    const hapPair = dayBranch + daewunBranch;
    if (yukhapMap[hapPair]) {
        formsHap = true;
        finalBranchEl = yukhapMap[hapPair];
    }
    
    // Calculate Original vs Transformed Ten God
    const originalTargetIdx = cycle.indexOf(daewunBranchEl);
    const originalDiff = (originalTargetIdx - dmIdx + 5) % 5;
    
    const finalTargetIdx = cycle.indexOf(finalBranchEl);
    const finalDiff = (finalTargetIdx - dmIdx + 5) % 5;
    
    if (originalDiff !== finalDiff) hapTransformed = true;

    const diff = finalDiff;`;

ts = ts.replace(regex1, replacement1);

const regex2 = /let narrative = timePrefix \+ "\\n\\n";/;
const replacement2 = `let narrative = timePrefix + "\\n\\n";
    if (isKO && formsHap && hapTransformed) {
        const originalTenGod = tenGodsKo[originalDiff].split('(')[0];
        const newTenGod = tenGodsKo[finalDiff].split('(')[0];
        narrative += \`[숨겨진 역동성: 합(合)의 함정] 겉보기에는 '\${originalTenGod}'의 운으로 다가오지만, 당신의 일지(\${dayBranch})와 대운(\${daewunBranch})이 강력하게 결합하여(육합), 결과적으로 '\${newTenGod}'의 성질로 완전히 변질됩니다. 예컨대 돈과 이익을 쫓았으나, 결국 막중한 책임감이나 압박으로 둔갑하게 되는 특수한 시기입니다.\\n\\n\`;
    }`;

ts = ts.replace(regex2, replacement2);

fs.writeFileSync('src/services/timeline-briefing-service.ts', ts, 'utf-8');
console.log("Updated timeline-briefing-service.ts with Hap Transformation");
