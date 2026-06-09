const fs = require('fs');
let data = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf8');

const regexSuhwa = /name: isKO \? "🌊🔥 \[수화기제\].+?\\n.+?\\n.+?\\n\s+gateBonus \+= 25;/g;

let newData = data.replace(
    /        gateBonus \+= 25;\n    } else if \(\(uFrames\.includes\('Wood'\) && pFrames\.includes\('Metal'\)\) \|\| \(uFrames\.includes\('Metal'\) && pFrames\.includes\('Wood'\)\)\) {/,
    `        if (!hasChung && !hasStemChung) {
            gateBonus += 25;
        } else {
            gateBonus += 20;
        }
    } else if ((uFrames.includes('Wood') && pFrames.includes('Metal')) || (uFrames.includes('Metal') && pFrames.includes('Wood'))) {`
);

newData = newData.replace(
    `            if (uWeak && pSikSang > 40) { gates.push({ name: isKO ? "🕷️ [The Abyssal Drain: 에너지 기생]" : "🕷️ [The Abyssal Drain]", desc: isKO ? "상대는 당신의 생명력을 빨아들여 자신의 꽃을 피웁니다. 함께할수록 당신은 원인 모를 무력감에 빠지게 됩니다." : "The partner drains your life force to bloom their own flowers. You fall into unexplainable lethargy." }); gatePenalty += 15; }\n`, 
    ``
);

const newLogic = `
    const getCheonEul = (stem: string) => {
        switch(stem) {
            case '甲': case '戊': case '庚': return ['丑', '未'];
            case '乙': case '己': return ['子', '申'];
            case '丙': case '丁': return ['亥', '酉'];
            case '辛': return ['寅', '午'];
            case '壬': case '癸': return ['卯', '巳'];
            default: return [];
        }
    };
    
    const _getEls = (r:any) => {
        if (!r) return [];
        if (typeof r === 'string') return r.split(',').map((s:string)=>s.trim()).filter(Boolean);
        return Array.isArray(r) ? r : [];
    };
    const _uyh = [..._getEls(userResult.analysis?.yongshinDetail?.primary), ..._getEls(userResult.analysis?.yongshinDetail?.heeShin)].filter(Boolean);
    const _pyh = [..._getEls(partnerResult.analysis?.yongshinDetail?.primary), ..._getEls(partnerResult.analysis?.yongshinDetail?.heeShin)].filter(Boolean);
    
    const uMBR = userResult.pillars.find(p => p.title === 'Month' || p.title === '월주')?.branch || '';
    const pMBR = partnerResult.pillars.find(p => p.title === 'Month' || p.title === '월주')?.branch || '';

    const uCE = getCheonEul(uDayStem);
    const pCE = getCheonEul(pDayStem);

    if (uCE.includes(pDayBranch) || uCE.includes(pMBR) || pCE.includes(uDayBranch) || pCE.includes(uMBR)) {
        gates.push({ name: isKO ? "🏆 [The Crown’s Savior: 천을귀인]" : "🏆 [The Crown's Savior]", desc: isKO ? "상대는 당신의 삶에 닥칠 재앙을 막아주는 천상적 방패입니다. 존재만으로 당신의 격을 높여줍니다." : "The partner functions as a heavenly shield, protecting you from disasters and elevating your status." });
        gateBonus += 20;
    }

    const _BR_E: Record<string, string> = { '子':'Water', '丑':'Earth', '寅':'Wood', '卯':'Wood', '辰':'Earth', '巳':'Fire', '午':'Fire', '未':'Earth', '申':'Metal', '酉':'Metal', '戌':'Earth', '亥':'Water' };
    const pDB_E = _BR_E[pDayBranch];
    const pMB_E = _BR_E[pMBR];
    const uDB_E = _BR_E[uDayBranch];
    const uMB_E = _BR_E[uMBR];

    let hasOasis = false;
    if (pDB_E && _uyh.includes(pDB_E)) hasOasis = true;
    if (pMB_E && _uyh.includes(pMB_E)) hasOasis = true;
    if (uDB_E && _pyh.includes(uDB_E)) hasOasis = true;
    if (uMB_E && _pyh.includes(uMB_E)) hasOasis = true;

    if (hasOasis) {
        gates.push({ name: isKO ? "💎 [Elemental Oasis: 용신 공급]" : "💎 [Elemental Oasis]", desc: isKO ? "상대는 당신이 사막에서 만난 맑은 오아시스입니다. 당신이 가장 필요로 하는 기운을 숨 쉬듯 뿜어냅니다." : "The partner is an oasis in the desert, radiating the exact energy you desperately need." });
        gateBonus += 15;
    }

    const uPYong = _getEls(userResult.analysis?.yongshinDetail?.primary)[0] || '';
    const pPYong = _getEls(partnerResult.analysis?.yongshinDetail?.primary)[0] || '';
    
    let uStrongestEl = '';
    let pStrongestEl = '';
    
    // We can calculate strongest element here
    uStrongestEl = Object.entries(userAdjustedElements).sort((a:any, b:any) => b[1] - a[1])[0]?.[0] || '';
    pStrongestEl = Object.entries(partnerAdjustedElements).sort((a:any, b:any) => b[1] - a[1])[0]?.[0] || '';

    const isCrushed = (strong: string, yong: string) => {
        if (!strong || !yong) return false;
        if (strong.includes('Wood') && yong.includes('Earth')) return true;
        if (strong.includes('Earth') && yong.includes('Water')) return true;
        if (strong.includes('Water') && yong.includes('Fire')) return true;
        if (strong.includes('Fire') && yong.includes('Metal')) return true;
        if (strong.includes('Metal') && yong.includes('Wood')) return true;
        return false;
    };

    if (isCrushed(pStrongestEl, uPYong) || isCrushed(uStrongestEl, pPYong)) {
        gates.push({ name: isKO ? "🌑 [Total Solar Eclipse: 용신 극멸]" : "🌑 [Total Solar Eclipse]", desc: isKO ? "상대의 가장 강한 에너지가 당신의 행운의 통로를 원천 봉쇄합니다. 사랑과는 별개로 당신의 세상이 어두워집니다." : "Their strongest energy completely blocks your path to luck and success." });
        gatePenalty += 20;
    }

    const isMyoGo = (br: string) => ['辰','戌','丑','未'].includes(br);
    if (isMyoGo(uDayBranch) && isMyoGo(pDayBranch) && (hasChung || hyungCheck)) {
        gates.push({ name: isKO ? "⛓️ [Locked Heavens: 진술축미 충돌]" : "⛓️ [Locked Heavens]", desc: isKO ? "서로의 내밀한 창고를 강제로 개방합니다. 숨기고 싶은 치부와 상처가 끊임없이 터져 나와 서로를 괴롭힙니다." : "Forcibly opens inner vaults, causing hidden wounds to bleed continuously." });
        gatePenalty += 12;
    }

    if (samhapMatch) {
`;

newData = newData.replace('    if (samhapMatch) {', newLogic);

fs.writeFileSync('src/services/relationship-dynamics-service.ts', newData, 'utf8');

