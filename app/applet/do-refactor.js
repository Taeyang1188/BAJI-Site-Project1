const fs = require('fs');
const content = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');

const startSig = 'export function calculateRelationshipDynamics(';
const logicStartMarker = '    let baseScore = 50;';
const logicEndMarker = '    let syncScore = Math.max(0, Math.min(100, Math.round(baseScore + gateBonus - gatePenalty)));\n';

const startIndex = content.indexOf(startSig);
const logicStartIdx = content.indexOf(logicStartMarker, startIndex);
const logicEndIdx = content.indexOf(logicEndMarker, logicStartIdx) + logicEndMarker.length;

const coreLogic = content.substring(logicStartIdx, logicEndIdx);

let newCore = `
function getCoreScore(
    userResult: BaZiResult,
    partnerResult: BaZiResult,
    userAdjustedElements: Record<string, number>,
    partnerAdjustedElements: Record<string, number>,
    uDaewunBranch: string | undefined,
    pDaewunBranch: string | undefined,
    isKO: boolean
) {
${coreLogic.split('\n').map(l => '    ' + l).join('\n')}
    return { syncScore, gates, structuralSynergy, temp, hyungCheck, paCheck, haeCheck, hasWonjin, hasChung, uBenefitScore, pBenefitScore };
}

export function calculateRelationshipDynamics(
    userResult: BaZiResult,
    partnerResult: BaZiResult,
    userAdjustedElements: Record<string, number>,
    partnerAdjustedElements: Record<string, number>,
    lang: Language,
    uDaewunBranch?: string,
    pDaewunBranch?: string
): RelationshipDynamicsResult {
    const isKO = lang === 'KO';

    const currentDynamics = getCoreScore(userResult, partnerResult, userAdjustedElements, partnerAdjustedElements, uDaewunBranch, pDaewunBranch, isKO);
    
    const innateUElements = userResult.analysis?.elementRatios || {};
    const innatePElements = partnerResult.analysis?.elementRatios || {};
    const innateDynamics = getCoreScore(userResult, partnerResult, innateUElements, innatePElements, undefined, undefined, isKO);

    const getNextDaewunElements = (res: any) => {
        const rawRatios = res.analysis?.elementRatios || {};
        const cycle = res.grandCycles?.[(res.currentCycleIndex || 0) + 1];
        const stemMap: Record<string, string> = { '甲':'Wood', '乙':'Wood', '丙':'Fire', '丁':'Fire', '戊':'Earth', '己':'Earth', '庚':'Metal', '辛':'Metal', '壬':'Water', '癸':'Water' };
        const branchMap: Record<string, string> = { '子':'Water', '丑':'Earth', '寅':'Wood', '卯':'Wood', '辰':'Earth', '巳':'Fire', '午':'Fire', '未':'Earth', '申':'Metal', '酉':'Metal', '戌':'Earth', '亥':'Water' };
        
        const adjusted: Record<string, number> = {};
        Object.entries(rawRatios).forEach(([k, v]) => {
            const el = cleanElement(k);
            adjusted[el] = (adjusted[el] || 0) + (v as number);
        });
        
        if (cycle) {
             const sEl = stemMap[cycle.stem] || 'Earth';
             const bEl = branchMap[cycle.branch] || 'Earth';
             adjusted[sEl] = (adjusted[sEl] || 0) + 15;
             adjusted[bEl] = (adjusted[bEl] || 0) + 45;
        }
        return adjusted;
    };

    const futureUElements = getNextDaewunElements(userResult);
    const futurePElements = getNextDaewunElements(partnerResult);
    const uNextBranch = userResult.grandCycles?.[(userResult.currentCycleIndex || 0) + 1]?.branch;
    const pNextBranch = partnerResult.grandCycles?.[(partnerResult.currentCycleIndex || 0) + 1]?.branch;
    
    const futureDynamics = getCoreScore(userResult, partnerResult, futureUElements, futurePElements, uNextBranch, pNextBranch, isKO);

    let finalScore = Math.max(0, Math.min(100, Math.round((innateDynamics.syncScore * 0.75) + (currentDynamics.syncScore * 0.25))));

    const gates = [...currentDynamics.gates];
    let structuralSynergy = currentDynamics.structuralSynergy;
    let temp = currentDynamics.temp;
    
    if (innateDynamics.syncScore < 65 && currentDynamics.syncScore >= 85 && (currentDynamics.syncScore - futureDynamics.syncScore) >= 20) {
        gates.push({
            name: isKO ? "⏳ [한여름 밤의 꿈] 불타오르는 신기루" : "⏳ [Midsummer Night's Dream]",
            desc: isKO ? "빌려온 불꽃은 시간이 지날수록 약해집니다. 현재의 대운(운의 흐름)이 만들어낸 절정은 다음 대운에서 빠르게 소진될 수 있으니, 지금 서로를 향한 본질적인 배려를 쌓아야 합니다." : "The borrowed flame weakens over time. The peak created by current luck may quickly fade in the next phase."
        });
    }

    if (futureDynamics.syncScore - currentDynamics.syncScore >= 15 && futureDynamics.syncScore > 85) {
        gates.push({
            name: isKO ? "🌊 [밀물: 만개하는 카르마]" : "🌊 [The Rising Tide]",
            desc: isKO ? "가장 뜨거운 계절이 다가오고 있습니다. 지금의 사소한 마찰은 거대한 합(合)의 완성으로 가기 위한 과도기일 뿐, 곧 두 사람의 관계가 극적으로 만개합니다." : "The hottest season is approaching. Minor frictions now are just a transition toward complete synergy."
        });
    }

    let syncScore = finalScore;
    const { hyungCheck, paCheck, haeCheck, hasWonjin, hasChung, uBenefitScore, pBenefitScore } = currentDynamics;

`;

const finalScript = content.substring(0, startIndex) + newCore + content.substring(logicEndIdx);
fs.writeFileSync('src/services/relationship-dynamics-service.ts', finalScript);
console.log('Script executed successfully!');
