import fs from 'fs';
const ts = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf-8');

const regex = /const pStrongestEl = getTopElement\(partnerAdjustedElements\);[\s\S]*?let narrative: TimelineNarrative = \{/;

const replacement = `const pStrongestEl = getTopElement(partnerAdjustedElements);
    const myFutureStemCore = STEM_ELEMENTS[currentDaewun.stem as keyof typeof STEM_ELEMENTS];
    let myFutureBranchCore = BRANCH_ELEMENTS[currentDaewun.branch as keyof typeof BRANCH_ELEMENTS];
    
    // YUKHAP logic for relationship
    const dayBranch = result?.pillars?.[2]?.branch || '寅';
    const hapPair = dayBranch + currentDaewun.branch;
    const yukhapMap: Record<string, string> = {
        '子丑': 'Earth', '丑子': 'Earth',
        '寅亥': 'Wood', '亥寅': 'Wood',
        '卯戌': 'Fire', '戌卯': 'Fire',
        '辰酉': 'Metal', '酉辰': 'Metal',
        '巳申': 'Water', '申巳': 'Water',
        '午未': 'Fire', '未午': 'Fire'
    };
    
    let hapTransformed = false;
    if (yukhapMap[hapPair]) {
        myFutureBranchCore = yukhapMap[hapPair];
        hapTransformed = true;
    }
    
    const myFutureElements = [myFutureStemCore, myFutureBranchCore].filter(Boolean);

    let narrative: TimelineNarrative = {`;

const newCode = ts.replace(regex, replacement);
fs.writeFileSync('src/services/timeline-briefing-service.ts', newCode, 'utf-8');

// Also inject the '조후 급랭' logic
let rs = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf-8');
const coolRegex = /\} else if \(myFutureElements\.includes\('Water'\) && pStrongestEl === 'Fire'\) \{/;
const coolReplacement = `} else if (hapTransformed && myFutureElements.includes('Wood') && (pStrongestEl === 'Water' || pStrongestEl === 'Metal')) {
        narrative.title = isKO ? "[조후의 급랭] 합(合)이 불러온 차가운 거리감" : "[Rapid Cooling] Distance from Transformation";
        narrative.psychology = isKO ? "일지와 대운의 결합(육합)으로 성질이 변하면서, 상대를 향한 감정적 기대치가 갑작스럽게 냉정하게 가라앉습니다." : "Transformation in your elements leads to emotional cooling.";
        narrative.interaction = isKO ? \`상대방의 차가운 금/수(金/水) 기운이 당신의 변화된 기운과 맞물리며 '조후의 급랭(결빙)' 현상을 일으킵니다. 열정적이었던 관계가 갑자기 이성적이고 서늘한 텐션으로 전환될 수 있습니다.\` : \`Metal/Water of your partner meets your transformed energy, creating a sudden cooling effect in the relationship.\`;
        narrative.intensity = 0.9;
    } else if (myFutureElements.includes('Water') && (pStrongestEl === 'Water' || pStrongestEl === 'Metal')) {
        narrative.title = isKO ? "[조후의 급랭] 뼈를 에이는 심리적 결빙" : "[Rapid Cooling] Freezing Tension";
        narrative.psychology = isKO ? "물과 물, 금과 물이 만나 세상의 온도를 얼려버릴 듯한 극단적인 이성주의와 방어기제가 작동합니다." : "Extreme rationality and defense mechanisms activate like freezing ice.";
        narrative.interaction = isKO ? \`서로의 날카롭고 차가운 기운(금/수)이 증폭되어 '조후의 급랭' 현상이 일어납니다. 사소한 서운함이 싸늘한 벽으로 변하기 쉬운 때이므로, 따뜻한 안부와 물리적인 거리 유지가 약이 됩니다.\` : \`Cold energies amplify, creating an emotional freeze. Small distances can become cold walls.\`;
        narrative.intensity = 0.95;
    } else if (myFutureElements.includes('Water') && pStrongestEl === 'Fire') {`;

rs = rs.replace(coolRegex, coolReplacement);
fs.writeFileSync('src/services/timeline-briefing-service.ts', rs, 'utf-8');
console.log('Fixed timeline-briefing-service.ts with Hap and Temperature');
