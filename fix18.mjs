import fs from 'fs';

let ts = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf-8');

const oldLogic = `    const getTopElement = (adjusted: any) => {
        if (!adjusted) return 'Wood';
        const sorted = Object.entries(adjusted).sort((a, b: any) => (b[1] as number) - (a[1] as number));
        return sorted[0][0];
    };
    const topElRaw = getTopElement(adjustedElements);
    const topElName = topElRaw.split('(')[0].trim();
    
    const dayMaster = result?.pillars?.[2]?.stem || '甲';
    const STEM_ELEMENTS: any = { '甲':'Wood', '乙':'Wood', '丙':'Fire', '丁':'Fire', '戊':'Earth', '己':'Earth', '庚':'Metal', '辛':'Metal', '壬':'Water', '癸':'Water' };
    const dmElement = STEM_ELEMENTS[dayMaster] || 'Wood';

    const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIdx = cycle.indexOf(dmElement);
    const targetIdx = cycle.indexOf(topElName);
    const diff = (targetIdx - dmIdx + 5) % 5;`;

const newLogic = `    const dayMaster = result?.pillars?.[2]?.stem || '甲';
    const STEM_ELEMENTS: any = { '甲':'Wood', '乙':'Wood', '丙':'Fire', '丁':'Fire', '戊':'Earth', '己':'Earth', '庚':'Metal', '辛':'Metal', '壬':'Water', '癸':'Water' };
    const BRANCH_ELEMENTS: any = { '子':'Water','丑':'Earth','寅':'Wood','卯':'Wood','辰':'Earth','巳':'Fire','午':'Fire','未':'Earth','申':'Metal','酉':'Metal','戌':'Earth','亥':'Water' };
    
    const dmElement = STEM_ELEMENTS[dayMaster] || 'Wood';
    const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIdx = cycle.indexOf(dmElement);
    
    const daewunBranch = currentDaewun?.branch || '子';
    const daewunBranchEl = BRANCH_ELEMENTS[daewunBranch] || 'Water';
    const targetIdx = cycle.indexOf(daewunBranchEl);
    
    const diff = (targetIdx - dmIdx + 5) % 5;`;

ts = ts.replace(oldLogic, newLogic);
fs.writeFileSync('src/services/timeline-briefing-service.ts', ts, 'utf-8');
console.log("Fixed timeline-briefing-service.ts");
