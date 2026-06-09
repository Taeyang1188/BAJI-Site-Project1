import fs from 'fs';

const file = 'src/services/relationship-dynamics-service.ts';
let content = fs.readFileSync(file, 'utf8');

const stemChungMapDef = `
    const STEM_HAP: Record<string, string> = { '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊' };
    const STEM_CHUNG: Record<string, string[]> = {
        '甲': ['庚', '戊'],
        '乙': ['辛', '己'],
        '丙': ['壬', '庚'],
        '丁': ['癸', '辛'],
        '戊': ['甲', '壬'],
        '己': ['乙', '癸'],
        '庚': ['丙', '甲'],
        '辛': ['丁', '乙'],
        '壬': ['戊', '丙'],
        '癸': ['己', '丁']
    };
`;

content = content.replace(
    /const WONJIN: Record<string, string>.+?;/,
    `$&
${stemChungMapDef}`
);

const stemCheckLogic = `
    const uDayStem = userResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.stem || '';
    const pDayStem = partnerResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.stem || '';
    
    let hasStemHap = false;
    let hasStemChung = false;
    
    if (uDayStem && pDayStem) {
        if (STEM_HAP[uDayStem] === pDayStem) hasStemHap = true;
        if (STEM_CHUNG[uDayStem]?.includes(pDayStem)) hasStemChung = true;
    }
`;

content = content.replace(
    /const uDayBranch =.+?;/,
    `${stemCheckLogic}
    $&`
);

const gateLogic = `
    if (hasStemHap) {
        gates.push({ name: isKO ? "🕊️ [정신적 결속] 천간합" : "🕊️ [Spiritual Union] Stem Hap", desc: isKO ? "가치관과 이상형이 맞아떨어집니다. 본능적인 끌림 이전에 생각의 주파수가 통하는 정신적 소울메이트입니다." : "Your values and ideals align perfectly. A spiritual soulmate connection." });
        gateBonus += 10;
        temp -= 2;
    }
    if (hasStemChung) {
        gates.push({ name: isKO ? "⚔️ [가치관의 충돌] 천간충" : "⚔️ [Ideological Clash] Stem Chung", desc: isKO ? "서로의 확고한 생각과 가치관이 치열하게 부딪힙니다. 다름을 인정하지 않으면 사사건건 날 선 자존심 싸움으로 번질 수 있습니다." : "Direct clashes in thoughts and values. May lead to pride battles if differences aren't respected." });
        gatePenalty += 10;
        temp += 5;
    }
`;

content = content.replace(
    /if \(hasChung \|\| hasWonjin\) gatePenalty \+\= 10;/,
    `$&
${gateLogic}`
);

fs.writeFileSync(file, content);
console.log('Update done');
