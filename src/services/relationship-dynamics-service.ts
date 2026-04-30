import { BaZiResult, Language } from '../types';
import { STEM_ELEMENTS, BRANCH_ELEMENTS } from './bazi-engine';
import { getIljuData } from '../data/ilju-dataset';

// Helper to clean key (e.g. 'Wood(목)' -> 'Wood')
const cleanElement = (k: string) => {
    let clean = k.split('(')[0].trim();
    if (clean === '목') return 'Wood';
    if (clean === '화') return 'Fire';
    if (clean === '토') return 'Earth';
    if (clean === '금') return 'Metal';
    if (clean === '수') return 'Water';
    return clean;
};

const getElements = (detailObj: any) => {
    if (!detailObj) return [];
    return detailObj.element ? detailObj.element.split(',').map((s: string) => s.trim()) : [];
};

export interface RelationshipDynamicsResult {
    syncScore: number;
    relation: string;
    isGlowing: boolean;
    text: string;
    temperature: number;
    isEasterEgg: boolean;
    gates: { name: string; desc: string }[];
    structuralSynergy?: { badge: string; desc: string; level: 'gold' | 'silver' };
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
    let baseScore = 50;
    const isKO = lang === 'KO';
    
    const uYongHee = [
        ...getElements(userResult.analysis?.yongshinDetail?.primary),
        ...getElements(userResult.analysis?.yongshinDetail?.heeShin)
    ].filter(Boolean) as string[];

    const uGiGu = [
        ...getElements(userResult.analysis?.yongshinDetail?.giShin),
        ...getElements(userResult.analysis?.yongshinDetail?.guShin)
    ].filter(Boolean) as string[];

    const pYongHee = [
        ...getElements(partnerResult.analysis?.yongshinDetail?.primary),
        ...getElements(partnerResult.analysis?.yongshinDetail?.heeShin)
    ].filter(Boolean) as string[];

    const pGiGu = [
        ...getElements(partnerResult.analysis?.yongshinDetail?.giShin),
        ...getElements(partnerResult.analysis?.yongshinDetail?.guShin)
    ].filter(Boolean) as string[];

    let uBenefitScore = 0;
    Object.entries(partnerAdjustedElements).forEach(([k, v]) => {
        const el = cleanElement(k);
        const val = v as number;
        if (uYongHee.includes(el)) uBenefitScore += (val / 100) * 15;
        if (uGiGu.includes(el)) uBenefitScore -= (val / 100) * 15;
    });

    let pBenefitScore = 0;
    Object.entries(userAdjustedElements).forEach(([k, v]) => {
        const el = cleanElement(k);
        const val = v as number;
        if (pYongHee.includes(el)) pBenefitScore += (val / 100) * 15;
        if (pGiGu.includes(el)) pBenefitScore -= (val / 100) * 15;
    });

    // Make it symmetric
    baseScore = 50 + uBenefitScore + pBenefitScore;
    const diff = Math.abs(uBenefitScore - pBenefitScore);
    baseScore -= diff * 0.5;

    let hasHap = false;
    let hasChung = false;
    let hasWonjin = false;

    const isHyung = (b1: string, b2: string) => {
        const pairs = [['寅','巳'], ['巳','申'], ['寅','申'], ['丑','戌'], ['戌','未'], ['丑','未'], ['子','卯'], ['辰','辰'], ['午','午'], ['酉','酉'], ['亥','亥']];
        return pairs.some(p => (p[0] === b1 && p[1] === b2) || (p[1] === b1 && p[0] === b2));
    };
    const isPa = (b1: string, b2: string) => {
        const pairs = [['子','酉'], ['丑','辰'], ['寅','亥'], ['卯','午'], ['巳','申'], ['戌','未']];
        return pairs.some(p => (p[0] === b1 && p[1] === b2) || (p[1] === b1 && p[0] === b2));
    };
    const isHae = (b1: string, b2: string) => {
        const pairs = [['子','未'], ['丑','午'], ['寅','巳'], ['卯','辰'], ['申','亥'], ['酉','戌']];
        return pairs.some(p => (p[0] === b1 && p[1] === b2) || (p[1] === b1 && p[0] === b2));
    };

    let gateBonus = 0;
    let gatePenalty = 0;
    
    const uGender = userResult.analysis?.gender || 'male';
    const pGender = partnerResult.analysis?.gender || 'female';
    const isSameGender = uGender === pGender || uGender === 'non-binary' || pGender === 'non-binary' || uGender === 'prefer-not-to-tell' || pGender === 'prefer-not-to-tell';
    
    const YUKHAP: Record<string, string> = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
    const CHUNG: Record<string, string> = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
    const WONJIN: Record<string, string> = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '酉', '酉': '寅', '卯': '申', '申': '卯', '辰': '亥', '亥': '辰', '巳': '戌', '戌': '巳' };
    
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
    
    const uDayBranch = userResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.branch || '';
    const pDayBranch = partnerResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.branch || '';

    const uDayStem = userResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.stem || '';
    const pDayStem = partnerResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.stem || '';

    let hasStemHap = false;
    let hasStemChung = false;

    if (uDayStem && pDayStem) {
        if (STEM_HAP[uDayStem] === pDayStem) hasStemHap = true;
        if (STEM_CHUNG[uDayStem]?.includes(pDayStem)) hasStemChung = true;
    }
    
    const gates: { name: string; desc: string }[] = [];
    
    // SamHap / BanHap check
    const SAMHAP_GROUPS = [
        { branches: ['申', '子', '辰'], element: 'Water', name: '신자진 수국' },
        { branches: ['寅', '午', '戌'], element: 'Fire', name: '인오술 화국' },
        { branches: ['巳', '酉', '丑'], element: 'Metal', name: '사유축 금국' },
        { branches: ['亥', '卯', '未'], element: 'Wood', name: '해묘미 목국' }
    ];

    let samhapMatch = null;
    for (const group of SAMHAP_GROUPS) {
        if (group.branches.includes(uDayBranch) && group.branches.includes(pDayBranch) && uDayBranch !== pDayBranch) {
            samhapMatch = group;
            hasHap = true;
            break;
        }
    }

    if (uDayBranch && pDayBranch) {
        if (YUKHAP[uDayBranch] === pDayBranch) hasHap = true;
        if (CHUNG[uDayBranch] === pDayBranch) hasChung = true;
        if (WONJIN[uDayBranch] === pDayBranch) hasWonjin = true;
    }

    const hyungCheck = uDayBranch && pDayBranch ? isHyung(uDayBranch, pDayBranch) : false;
    const paCheck = uDayBranch && pDayBranch ? isPa(uDayBranch, pDayBranch) : false;
    const haeCheck = uDayBranch && pDayBranch ? isHae(uDayBranch, pDayBranch) : false;
    
    if (hasHap && (hyungCheck || paCheck || haeCheck)) {
         gates.push({ name: isKO ? "🔗⚠️ [중첩된 구속] 파괴적 카르마" : "🔗⚠️ [Overlapped Bound] Destructive Karma", desc: isKO ? "너무 사랑해서 서로를 파괴하는 관계입니다. 지독한 끌림(합) 이면에 서사를 흔드는 깊은 상처와 교정의 욕구가 공존합니다." : "You are drawn to each other deeply, yet subtly destroy one another. A toxic but undeniable bond." });
         gateBonus += 5;
    } else {
         if (hasHap) gateBonus += 15;
         if (paCheck) {
             gatePenalty += 5;
             gates.push({ name: isKO ? "🧊 [Shattered Glass: 유리 파편의 미학]" : "🧊 [Shattered Glass]", desc: isKO ? "겉은 매끄러워 보이지만 내면엔 미세한 균열이 가득합니다. 어느 한쪽이 선을 넘는 순간, 관계는 복구 불가능한 파편으로 흩어질 준비가 되어 있습니다." : "Smooth on the surface, but filled with micro-cracks inside. One wrong move could shatter it completely." });
         }
         if (haeCheck) {
             gatePenalty += 8;
             gates.push({ name: isKO ? "🧪 [Slow Poison: 잠식하는 독소]" : "🧪 [Slow Poison]", desc: isKO ? "누군가 한 명의 희생이 전제된 관계입니다. 상대의 성장이 나의 결핍을 야기하거나, 보이지 않는 곳에서 서로의 발목을 붙잡는 '우아한 방해'가 진행 중입니다." : "An elegant hindrance. Someone's sacrifice is mandatory for this relationship to continue." });
         }
    }

    if (hasStemHap && hasChung) {
        gates.push({ name: isKO ? "🌀 [이성적인 모순]" : "🌀 [Rational Contradiction]", desc: isKO ? "머리로는 완벽히 이해하는데, 몸과 현실(지지)이 거부하는 관계입니다." : "You understand each other perfectly in your minds, but reality and instincts reject the connection." });
        gateBonus += 5;
    } else if (hasStemHap) {
        gates.push({ name: isKO ? "🕊️ [정신적 결속] 천간합" : "🕊️ [Spiritual Union] Stem Hap", desc: isKO ? "가치관과 이상형이 맞아떨어집니다. 본능적인 끌림 이전에 생각의 주파수가 통하는 정신적 소울메이트입니다." : "Your values and ideals align perfectly. A spiritual soulmate connection." });
        gateBonus += 10;
    }

    if (hasStemChung && hasHap) {
        gates.push({ name: isKO ? "🔥 [본능적인 중독]" : "🔥 [Instinctive Addiction]", desc: isKO ? "만나기만 하면 가치관으로 싸우는데, 돌아서면 몸이 먼저 그리워지는 지독한 미련입니다." : "You fiercely clash in values, but instinctively crave each other. A toxic yet irresistible addiction." });
        gatePenalty += 5;
    } else if (hasStemChung) {
        gates.push({ name: isKO ? "⚔️ [가치관의 충돌] 천간충" : "⚔️ [Ideological Clash] Stem Chung", desc: isKO ? "서로의 확고한 생각과 가치관이 치열하게 부딪힙니다. 다름을 인정하지 않으면 사사건건 날 선 자존심 싸움으로 번질 수 있습니다." : "Direct clashes in thoughts and values. May lead to pride battles if differences aren't respected." });
        gatePenalty += 10;
    }

    if (hasChung) gatePenalty += 15;
    if (hasWonjin) gatePenalty += 12;


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

    const uHasSavior = uCE.includes(pDayBranch) || uCE.includes(pMBR);
    const pHasSavior = pCE.includes(uDayBranch) || pCE.includes(uMBR);

    if (uHasSavior && pHasSavior) {
        gates.push({ 
            name: isKO ? "🏆 [Double Crown Savior: 쌍방 천을귀인]" : "🏆 [Double Crown Savior]", 
            desc: isKO ? "서로가 서로의 삶에 나타난 최고의 선물입니다. 같이 있는 것만으로 보이지 않는 재앙이 막아지고 사회적 지위가 귀하게 격상되는 기적 같은 관계입니다." : "You are the greatest gifts to each other. Being together elevates both your statuses and its mere presence blocks misfortune." 
        });
        gateBonus += 30;
    } else if (uHasSavior) {
        gates.push({ 
            name: isKO ? "🏆 [The Crown’s Savior: 천을귀인]" : "🏆 [The Crown's Savior]", 
            desc: isKO ? "상대는 당신의 삶에 닥칠 재앙을 막아주는 천상적 방패입니다. 존재만으로 당신의 격을 높여주며 당신을 지켜주는 수호천사와 같습니다." : "The partner functions as a heavenly shield, protecting you from disasters and elevating your status." 
        });
        gateBonus += 20;
    } else if (pHasSavior) {
        gates.push({ 
            name: isKO ? "🏆 [The Crown’s Savior: 당신이 그의 천을귀인]" : "🏆 [You are the Savior]", 
            desc: isKO ? "당신은 상대방의 삶에 닥칠 재앙을 막아주는 천상적 방패이자 귀인입니다. 당신의 넉넉한 기운이 상대의 격을 높여주고 위기에서 구해냅니다." : "You function as a heavenly shield for the partner, protecting them from disasters and elevating their status." 
        });
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

         const isShenZi = (uDayBranch === '申' && pDayBranch === '子') || (uDayBranch === '子' && pDayBranch === '申');
         if (isShenZi) {
              gates.push({ name: isKO ? "🌊 [영혼의 주파수: 신자합]" : "🌊 [Soul Resonator: Shen-Zi Hap]", desc: isKO ? "상대방과 깊은 영혼의 결속력을 가집니다. 서로가 함께할 때 큰 시너지(수국)를 만들어냅니다." : "Deep spiritual connection forming powerful synergy." });
         } else {
              gates.push({ name: isKO ? `🔗 [강력한 결속: ${uDayBranch}${pDayBranch} 반합]` : `🔗 [Strong Bond: Half-Hap]`, desc: isKO ? `두 사람의 내면이 같은 방향(${samhapMatch.element})성을 향해 매끄럽게 융합됩니다.` : "Your inner energies blend seamlessly in the same direction." });
         }
    }

    const uBranches = userResult.pillars.map((p: any) => p.branch).filter(Boolean);
    const pBranches = partnerResult.pillars.map((p: any) => p.branch).filter(Boolean);

    // [New] Cross-branch Hyung Check & In-Sa-Sin Samhyeongsal
    let crossHyung = false;
    for(const ub of uBranches) {
        for(const pb of pBranches) {
            if(isHyung(ub, pb)) crossHyung = true;
        }
    }
    const combinedBranches = Array.from(new Set([...uBranches, ...pBranches]));
    const hasInSaSin = combinedBranches.includes('寅') && combinedBranches.includes('巳') && combinedBranches.includes('申');
    const hasPartialInSaSin = (combinedBranches.includes('寅') && combinedBranches.includes('巳')) || 
                              (combinedBranches.includes('巳') && combinedBranches.includes('申')) || 
                              (combinedBranches.includes('寅') && combinedBranches.includes('申'));
    const hasChukSulMi = combinedBranches.includes('丑') && combinedBranches.includes('戌') && combinedBranches.includes('未');
    const hasPartialChukSulMi = (combinedBranches.includes('丑') && combinedBranches.includes('戌')) || 
                                (combinedBranches.includes('戌') && combinedBranches.includes('未')) || 
                                (combinedBranches.includes('丑') && combinedBranches.includes('未'));

    if (hasInSaSin || hasChukSulMi) {
        gates.push({
            name: isKO ? `⚠️ [운명의 심판대: ${hasInSaSin ? '인사신' : '축술미'} 삼형살]` : `⚠️ [Judgment of Fate: Samhyeongsal]`,
            desc: isKO ? "두 사람의 기운이 모여 거대한 충돌(삼형살)을 완성합니다. 강한 권력 투쟁이나 서로를 고통스럽게 개조하려는 극단적인 갈등이 잠재되어 있습니다. 잦은 타협과 거리가 필요합니다." : "Your combined energies trigger a massive cosmic collision. Extreme power struggles and attempts to forcefully remodel each other are highly likely. Keep boundaries."
        });
        gatePenalty += 20;
    } else if (hasPartialInSaSin || hasPartialChukSulMi || crossHyung) {
        gates.push({ 
            name: isKO ? "🔪 [Surgical Adjustment: 교정과 마찰의 형살]" : "🔪 [Surgical Adjustment]", 
            desc: isKO ? "서로의 뼈를 깎아 맞추는 고통스러운 수술대에 올랐습니다. 서로의 기운이 만나 부분적인 형살(마찰)을 일으킵니다. 이 관계는 '사랑'보다는 '교정'에 가깝습니다. 서로를 바꾸려 할수록 갈등이 커집니다." : "A relationship built on mutual correction. Combines to create partial punishment (Hyung). The more you try to change each other, the deeper the scalpel goes." 
        });
        gatePenalty += 15;
    }

    // [v5.3] 공망의 심연 (Gongmang Dynamics)
    const uGongmang = userResult.analysis?.gongmang?.branches || [];
    const uInteractions = userResult.analysis?.interactions || [];
    
    // 탈공 여부 판단 (Talgong Check)
    const isTalgong = uInteractions.some((interaction: any) => {
        const type = interaction.type || '';
        const branches = interaction.branches || [];
        return (type.includes('합') || type.includes('충') || type.includes('Combine') || type.includes('Clash')) &&
            branches.some((b: string) => uGongmang.includes(b));
    });
    
    if (pDayBranch && uGongmang.includes(pDayBranch)) {
        if (isTalgong) {
            gates.push({
                name: isKO ? "🔗 [Resonance] 공명(共鳴)" : "🔗 [Resonance]",
                desc: isKO ? "비어있던 흉터가 같음을 확인합니다. 서로의 결핍을 아는 동질감이 형성됩니다." : "You acknowledge the same empty scar. A resonance forms through understanding each other's voids."
            });
            gateBonus += 10;
        } else {
            gates.push({
                name: isKO ? "🕳️ [The Unreachable Shadow] 닿지 않는 그림자" : "🕳️ [The Unreachable Shadow]",
                desc: isKO ? "상대는 당신의 영혼에 뚫린 구멍을 자극합니다. 가장 가깝게 느껴지는 순간조차 손가락 사이로 빠져나가는 안개처럼, 영원한 갈증을 유발하는 치명적인 함정입니다." : "The partner stimulates the hole in your soul; a fatal trap causing eternal thirst."
            });
            gatePenalty += 10;
        }
    } else if (uGongmang.length > 0) {
        const hapChungPairs = ['子丑','丑子','寅亥','亥寅','卯戌','戌卯','辰酉','酉辰','巳申','申巳','午未','未午', 
                               '子午','午子','丑未','未丑','寅申','申寅','卯酉','酉卯','辰戌','戌辰','巳亥','亥巳'];
        let realVoidBreaker = false;
        let abstractVoidBreaker = false;
        for (const gm of uGongmang) {
            if (pBranches.some((pb: string) => pb && hapChungPairs.includes(gm + pb))) {
                if (uBranches.includes(gm)) {
                    realVoidBreaker = true;
                } else {
                    abstractVoidBreaker = true;
                }
            }
        }
        
        if (!isTalgong) {
            if (realVoidBreaker) {
                gates.push({
                    name: isKO ? "🕯️ [The Void Breaker] 공망의 해구" : "🕯️ [The Void Breaker]",
                    desc: isKO ? "밑 빠진 독이었던 당신의 현실적 결핍을 상대가 깨부수거나(충) 메워버립니다(합). 당신의 고질적인 한계를 돌파하게 해줄 결정적 처방전입니다." : "The partner breaks or fills your bottomless pit. The decisive prescription for your chronic limitations.",
                });
                gateBonus += 15;
            } else if (abstractVoidBreaker) {
                gates.push({
                    name: isKO ? "🪶 [추상적 위안] 공망의 그림자" : "🪶 [Abstract Comfort]",
                    desc: isKO ? "심리적 허기로 맴돌던 당신의 막연한 갈증을 상대방이 달래줍니다. 치명적인 결핍은 아니더라도 함께 있으면 마음이 편안해지는 소박한 위안입니다." : "Provides light comfort for your psychological hunger. Not a lifesaver, but a pleasant solace.",
                });
                gateBonus += 2;
            }
        }
    }

    const getFrames = (b: string[]) => {
        const frames = [];
        if ((b.includes('寅') && b.includes('午')) || (b.includes('午') && b.includes('戌')) || (b.includes('寅') && b.includes('戌')) || (b.includes('巳') && b.includes('午') && b.includes('未'))) frames.push('Fire');
        if ((b.includes('申') && b.includes('子')) || (b.includes('子') && b.includes('辰')) || (b.includes('申') && b.includes('辰')) || (b.includes('亥') && b.includes('子') && b.includes('丑'))) frames.push('Water');
        if ((b.includes('巳') && b.includes('酉')) || (b.includes('酉') && b.includes('丑')) || (b.includes('巳') && b.includes('丑')) || (b.includes('申') && b.includes('酉') && b.includes('戌'))) frames.push('Metal');
        if ((b.includes('亥') && b.includes('卯')) || (b.includes('卯') && b.includes('未')) || (b.includes('亥') && b.includes('未')) || (b.includes('寅') && b.includes('卯') && b.includes('辰'))) frames.push('Wood');
        return frames;
    };
    
    const uFrames = getFrames(uBranches);
    const pFrames = getFrames(pBranches);

    if ((uFrames.includes('Fire') && pFrames.includes('Water')) || (uFrames.includes('Water') && pFrames.includes('Fire'))) {
        gates.push({
            name: isKO ? "⚖️ [수화기제] 최고 역동의 밸런스" : "⚖️ [Water & Fire Harmony]",
            desc: isKO ? "한쪽의 폭발적인 조열함(화/불)과 다른 쪽의 응축된 한랭함(수/물)이 만나, 서로를 파괴하지 않고 완벽한 시너지(수화기제)를 만들어냅니다." : "Explosive fire and condensed water meet to form a perfect, productive balance."
        });
        if (!hasChung && !hasStemChung) {
            gateBonus += 25;
        } else {
            gateBonus += 20;
        }
    } else if ((uFrames.includes('Wood') && pFrames.includes('Metal')) || (uFrames.includes('Metal') && pFrames.includes('Wood'))) {
        gates.push({
            name: isKO ? "🪓 [금목상쟁의 승화] 동량지재의 조각가" : "🪓 [Metal & Wood Synergy]",
            desc: isKO ? "거침없이 뻗어나가는 나무(목)를 예리한 금속(금)이 아름답고 쓸모 있는 재목으로 조각하듯, 서로를 자극하여 성장시킵니다." : "Sharp metal carves wild wood into a masterpiece, pushing each other to grow."
        });
        gateBonus += 15;
    }

    
    if (hasWonjin) {
        gates.push({
            name: isKO ? "⚠️ [원진/귀문] 이유 없는 예민함과 신경전" : "⚠️ [Wonjin] Unreasonable Sensitivity",
            desc: isKO ? "일지 간 원진 작용으로 강렬하게 끌리면서도 예민함이 발동합니다. 여유가 필요합니다." : "You feel an intense pull but also unexplainable misunderstandings."
        });
    }

    const uTenGods = userResult.analysis?.tenGodsRatio || {};
    const pTenGods = partnerResult.analysis?.tenGodsRatio || {};
    const parseGod = (tenObj: any, en: string, ko: string) => (tenObj[en] || tenObj[ko] || 0) as number;
    const uGwanSal = parseGod(uTenGods, 'Warrior/Judge', '관성(Warrior/Judge)');
    const pGwanSal = parseGod(pTenGods, 'Warrior/Judge', '관성(Warrior/Judge)');
    const uSikSang = parseGod(uTenGods, 'Artist/Rebel', '식상(Artist/Rebel)');
    const pSikSang = parseGod(pTenGods, 'Artist/Rebel', '식상(Artist/Rebel)');
    const uJaeSeong = parseGod(uTenGods, 'Maverick/Architect', '재성(Maverick/Architect)');
    const pJaeSeong = parseGod(pTenGods, 'Maverick/Architect', '재성(Maverick/Architect)');
    const uInSeong = parseGod(uTenGods, 'Mystic/Sage', '인성(Mystic/Sage)');
    const pInSeong = parseGod(pTenGods, 'Mystic/Sage', '인성(Mystic/Sage)');
    const uBiGeop = parseGod(uTenGods, 'Mirror/Rival', '비겁(Mirror/Rival)');
    const pBiGeop = parseGod(pTenGods, 'Mirror/Rival', '비겁(Mirror/Rival)');

    const uElements = userResult.analysis?.elementRatios || {};
    const pElements = partnerResult.analysis?.elementRatios || {};
    const uWeak = (userResult.analysis?.dayMasterStrength?.score || 50) < 35;
    const pWeak = (partnerResult.analysis?.dayMasterStrength?.score || 50) < 35;

    if (uWeak && pSikSang > 40) {
        gates.push({ name: isKO ? "🕷️ [The Abyssal Drain: 에너지 기생]" : "🕷️ [The Abyssal Drain]", desc: isKO ? "상대는 당신의 생명력을 빨아들여 자신의 꽃을 피웁니다. 함께할수록 당신은 원인 모를 무력감에 빠지게 됩니다." : "The partner drains your life force to bloom their own flowers. You fall into unexplainable lethargy." }); 
        gatePenalty += 15;
    }
    if (pWeak && uSikSang > 40) {
        gates.push({ name: isKO ? "🕷️ [The Abyssal Drain: 에너지 기생 (상대)]" : "🕷️ [The Abyssal Drain (Partner)]", desc: isKO ? "당신이 무의식중에 상대의 기운을 과도하게 끌어다 쓰고 있을 가능성이 있습니다. 상대방이 지쳐가지 않는지 살펴주세요." : "You might be draining the partner's life force to bloom your own flowers." }); 
        gatePenalty += 15;
    }

    // [New] 괴강살(Gwaegangsal) & Ego (Authority/Stubbornness) Clash Check
    const GWAEGANG_PILLARS = ['庚辰', '庚戌', '壬辰', '戊戌'];
    const uGwaegangPillars = userResult.pillars.filter(p => GWAEGANG_PILLARS.includes((p.stem||'') + (p.branch||'')));
    const pGwaegangPillars = partnerResult.pillars.filter(p => GWAEGANG_PILLARS.includes((p.stem||'') + (p.branch||'')));
    
    const uGwaegangElements = uGwaegangPillars.map(p => STEM_ELEMENTS[p.stem as string] || '').filter(Boolean);
    const pGwaegangElements = pGwaegangPillars.map(p => STEM_ELEMENTS[p.stem as string] || '').filter(Boolean);

    const uGwaegang = uGwaegangPillars.length > 0;
    const pGwaegang = pGwaegangPillars.length > 0;

    let pGwaegangFatal = false;
    let pGwaegangSavior = false;
    
    for (const el of pGwaegangElements) {
        if (isCrushed(el, uPYong)) pGwaegangFatal = true;
        if (uPYong && el.toLowerCase() === uPYong.toLowerCase()) pGwaegangSavior = true;
    }

    let uGwaegangFatal = false;
    let uGwaegangSavior = false;
    
    for (const el of uGwaegangElements) {
        if (isCrushed(el, pPYong)) uGwaegangFatal = true;
        if (pPYong && el.toLowerCase() === pPYong.toLowerCase()) uGwaegangSavior = true;
    }

    // Partner -> User Effect
    if (pGwaegangFatal) {
        let penalty = 30;
        if (uWeak) penalty = 40;
        gates.push({
            name: isKO ? "⚔️ [Fatal Suppression: 괴강살의 억압]" : "⚔️ [Fatal Suppression]",
            desc: isKO ? "상대의 거대한 괴강살이 당신의 용신(숨통)을 정확히 타격합니다. 상대의 틀에 당신의 자아가 갇혀 소멸될 수 있는 강력한 실존적 위협이 감지됩니다. 이 관계는 당신을 질식시킬 위험이 있습니다." : "Their massive Gwaegang energy fatally strikes your most needed element. A powerful existential threat where your ego could be suffocated."
        });
        gatePenalty += penalty;
    } else if (pGwaegangSavior) {
        gates.push({
            name: isKO ? "💎 [The Ruthless Savior: 잔혹한 구원자]" : "💎 [The Ruthless Savior]",
            desc: isKO ? "상대의 강압적인 에너지가 역설적으로 당신에게 가장 필요한 기운입니다. 뼈를 깎는 스파르타식 훈련 같지만, 그 묵직한 압박 덕분에 당신이 제련되고 단단해집니다." : "Their oppressive energy is paradoxically what you need most. A Spartan-like relationship that refines you into a jewel."
        });
        gateBonus += 30;
    } else if (pGwaegang && (uBiGeop > 30 || uGwanSal > 30) && !uWeak) {
        gates.push({
            name: isKO ? "⚡ [Dominance vs Ego: 체제의 억압과 아집]" : "⚡ [Dominance vs Ego (Partner)]",
            desc: isKO ? "상대의 막강한 카리스마(괴강살)가 당신의 굳건한 아집과 자존심을 통제하려 들며 거센 마찰이 발생합니다. 숨막히는 권력 투쟁이 될 수 있으니 주의가 필요합니다." : "Their highly dominant energy (Gwaegang) clashes with your stubborn ego. Intense power struggles may block harmony."
        });
        gatePenalty += 15;
    }

    // User -> Partner Effect
    if (uGwaegangFatal) {
        let penalty = 30;
        if (pWeak) penalty = 40;
        gates.push({
            name: isKO ? "⚔️ [Fatal Suppression: 나의 억압과 상대의 질식]" : "⚔️ [Fatal Suppression (You)]",
            desc: isKO ? "당신의 거대한 괴강살이 상대의 용신(숨통)을 정확히 타격하고 있습니다. 당신의 의도와 상관없이 상대방의 자아와 가능성이 당신의 틀 안에서 질식하고 있을 수 있습니다." : "Your massive Gwaegang energy fatally strikes their most needed element, potentially suffocating their ego and potential."
        });
        gatePenalty += penalty;
    } else if (uGwaegangSavior) {
        gates.push({
            name: isKO ? "💎 [The Ruthless Savior: 스파르타식 교관]" : "💎 [The Ruthless Savior (You)]",
            desc: isKO ? "당신의 강요와 통제가 상대에게 꼭 필요한 자극제이자 진정한 구원으로 작용합니다. 때로는 당신의 거친 방식이 상대를 더 크게 성장시킵니다." : "Your dominant nature acts as a necessary stimulant and salvation for them. Your rough ways help them grow immensely."
        });
        gateBonus += 30;
    } else if (uGwaegang && (pBiGeop > 30 || pGwanSal > 30) && !pWeak) {
        gates.push({
            name: isKO ? "⚡ [Dominance vs Ego: 나의 통제와 상대의 아집]" : "⚡ [Dominance vs Ego]",
            desc: isKO ? "당신의 강력한 지배력(괴강살)이 상대의 굽히지 않는 아집과 자존심을 누르려 하며 잔혹한 스파크가 튑니다. 주도권 싸움이 잦으며, 파국으로 치달을 수 있습니다." : "Your highly dominant energy clashes with their stubborn ego, creating intense power struggles. Respect is vital."
        });
        gatePenalty += 15;
    }

    const uDayIlju = uDayStem + uDayBranch;
    const pDayIlju = pDayStem + pDayBranch;

    const ELEMENT_GANYEO: Record<string, { pillars: string[], ko: string, en: string, descKo: string, descEn: string }> = {
        'Wood': { 
            pillars: ['甲寅', '乙卯'], 
            ko: "🌳 [대지의 뿌리] 생명력의 회복", 
            en: "🌳 [Roots of Life] Vitality Restored",
            descKo: "원국에 부족한 나무(목) 기운을 상대의 울창한 숲이 채워줍니다. 정체되었던 삶에 활기가 도는 관계입니다.",
            descEn: "Their lush forest energy fills your missing wood element. Life gains new momentum."
        },
        'Fire': { 
            pillars: ['丙午', '丁巳'], 
            ko: "🔥 [태양의 온기] 얼어붙은 영혼의 해빙", 
            en: "🔥 [Solar Warmth] Thawing the Frozen Soul",
            descKo: "원국에 부족한 불(화) 기운을 상대의 뜨거운 심장이 채워줍니다. 차가웠던 삶에 열정과 사랑이 피어납니다.",
            descEn: "Their passionate fire energy thaws your cold natal chart. Passion and warmth bloom."
        },
        'Earth': { 
            pillars: ['戊辰', '戊戌', '己丑', '己未'], 
            ko: "⛰️ [흔들리지 않는 대지] 삶의 중심", 
            en: "⛰️ [Unshakable Ground] The Center of Life",
            descKo: "원국에 부족한 흙(토) 기운을 상대의 단단한 대지가 채워줍니다. 방황하던 삶에 안식처와 지지대를 얻는 관계입니다.",
            descEn: "Their solid earth energy provides the foundation you lack. You find a true home."
        },
        'Metal': { 
            pillars: ['庚申', '辛酉'], 
            ko: "⚔️ [정교한 칼날] 결단과 정의", 
            en: "⚔️ [Precision Blade] Decision and Justice",
            descKo: "원국에 부족한 금(금) 기운을 상대의 예리한 결단력이 채워줍니다. 흐릿했던 삶의 방향이 명확해지는 관계입니다.",
            descEn: "Their sharp metal energy provides the decisiveness you lack. Your life path becomes clear."
        },
        'Water': { 
            pillars: ['壬子', '癸亥'], 
            ko: "🌊 [생명의 단비] 갈증을 해소하는 바다", 
            en: "🌊 [Life-Saving Rain] The Thirst-Quenching Sea",
            descKo: "원국에 부족한 물(수) 기운을 상대의 거대한 바다가 채워줍니다. 존재만으로도 성격의 건조함과 갈증이 해소되는 관계입니다.",
            descEn: "Their massive water energy quenches your elemental thirst. They bring fluid grace to your life."
        }
    };

    Object.entries(ELEMENT_GANYEO).forEach(([el, info]) => {
        const uVal = uElements[el + '(수)'] || uElements[el] || 0;
        const pVal = pElements[el + '(수)'] || pElements[el] || 0;

        if (uVal <= 0 && info.pillars.includes(pDayIlju)) {
            gates.push({ name: isKO ? info.ko : info.en, desc: isKO ? info.descKo : info.descEn });
            gateBonus += 20;
        }
        if (pVal <= 0 && info.pillars.includes(uDayIlju)) {
            const partnerDescKo = info.descKo.replace('원국에 부족한', '상대방의').replace('채워줍니다', '당신의 기운이 해결해줍니다').replace('관계입니다', '구원자입니다');
            const partnerDescEn = info.descEn.replace('Their', 'Your').replace('fills your', 'fills their').replace('You find', 'They find');
            gates.push({ name: isKO ? info.ko : info.en, desc: isKO ? partnerDescKo : partnerDescEn });
            gateBonus += 20;
        }
    });

    const checkJDSY = (res: any) => {
        const note = res.analysis?.logicNote || "";
        return note.includes('재다신약') || note.includes('Jae-da-shin-yak');
    };
    const isUJDSY = checkJDSY(userResult);
    const isPJDSY = checkJDSY(partnerResult);

    // counts for elements (8 characters)
    const countEl = (res: BaZiResult, targetEl: string) => {
        let count = 0;
        res.pillars.forEach(p => {
            if (STEM_ELEMENTS[p.stem] === targetEl) count++;
            if (BRANCH_ELEMENTS[p.branch] === targetEl) count++;
        });
        return count;
    };

    const pWoodCount = countEl(partnerResult, 'Wood');
    const pFireCount = countEl(partnerResult, 'Fire');
    const pEarthCount = countEl(partnerResult, 'Earth');
    const pMetalCount = countEl(partnerResult, 'Metal');
    const pWaterCount = countEl(partnerResult, 'Water');

    const uWoodCount = countEl(userResult, 'Wood');
    const uFireCount = countEl(userResult, 'Fire');
    const uEarthCount = countEl(userResult, 'Earth');
    const uMetalCount = countEl(userResult, 'Metal');
    const uWaterCount = countEl(userResult, 'Water');

    // --- Advanced Logic: Overload (과유불급) ---

    // 1. Deng-Ra-Gye-Gap (藤羅繫甲)
    if (uDayStem === '乙' && (partnerResult.pillars.some(p => p.stem === '甲' || p.branch === '寅'))) {
        const uMetalVal = uElements['Metal(금)'] || uElements['Metal'] || 0;
        if (uWeak || uMetalVal > 30) {
            gates.push({ 
                name: isKO ? "🌿 [등라계갑] 거목을 만난 넝쿨" : "🌿 [Deng-Ra-Gye-Gap]", 
                desc: isKO ? "을목인 당신은 상대라는 거대한 갑목을 타고 하늘로 뻗어 나갑니다. 당신에게 상대는 성장의 발판이자 가장 강력한 보호막입니다. 주도권은 매달리는 자(당신)에게 있습니다." : "As Eul-mok, you climb the partner's giant Gap-mok tree. They are your ladder to the sky and strongest shield. The initiative lies with you." 
            });
            gateBonus += 20;
        }
    }
    if (pDayStem === '乙' && (userResult.pillars.some(p => p.stem === '甲' || p.branch === '寅'))) {
        gates.push({ 
            name: isKO ? "🛡️ [자비로운 짐] 등라계갑의 버팀목" : "🛡️ [Benevolent Burden]", 
            desc: isKO ? "상대(을목)는 당신이라는 거목을 타고 하늘로 뻗어 나갑니다. 당신은 상대의 성장을 위해 자신의 에너지를 기꺼이 내어주는 헌신적인 보호막 역할을 하고 있습니다." : "The partner (Eul-mok) climbs you, the Gap-mok tree. You are a devoted shield, giving your energy for their growth." 
        });
        // Bonus is smaller or neutral for the supporter as it's a "burden"
        gateBonus += 5;
    }

    // 2. Geum-Da-Su-Tak (金多水濁) & Geum-Da-Su-Che
    if ((uDayStem === '壬' || uDayStem === '癸') && pMetalCount >= 3) {
        gates.push({
            name: isKO ? "🧪 [금다수탁] 탁해진 심연" : "🧪 [Geum-Da-Su-Tak]",
            desc: isKO ? "맑아야 할 당신의 샘물에 거대한 바위(금)들이 쏟아져 들어왔습니다. 이는 생(生)이 아니라 압살입니다. 상대의 과도한 보호와 통제가 당신의 자아를 진흙탕으로 만들고 있습니다." : "Massive rocks (Metal) poured into your clear water. This isn't support; it's smothering. Their excessive control turns your ego into mud."
        });
        gatePenalty += 25;
    }
    if ((pDayStem === '壬' || pDayStem === '癸') && uMetalCount >= 3) {
        gates.push({
            name: isKO ? "🧪 [금다수탁] 의도치 않은 압박" : "🧪 [Geum-Da-Su-Tak (Reverse)]",
            desc: isKO ? "당신의 과도한 금(Metal) 기운이 상대의 맑은 물을 탁하게 만들고 있을 수 있습니다. 사랑이라는 이름의 통제가 상대를 질식시키고 있지는 않은지 돌아봐야 합니다." : "Your excessive Metal energy might be muddying their clear water. Check if your 'loving control' is suffocating them."
        });
        gatePenalty += 15;
    }

    // 3.1 Mok-Da-Hwa-Sik (木多火熄)
    if ((uDayStem === '丙' || uDayStem === '丁') && pWoodCount >= 3) {
        gates.push({
            name: isKO ? "🕯️ [목다화식] 꺼져가는 불꽃" : "🕯️ [Mok-Da-Hwa-Sik]",
            desc: isKO ? "상대의 지나친 간섭과 지원이 오히려 당신의 재능(불꽃)을 질식시키고 있습니다. 타오르고 싶어도 숨 쉴 틈이 없습니다." : "Their excessive interference suffocates your talent. You want to burn bright, but there's no room to breathe."
        });
        gatePenalty += 20;
    }

    // 3.2 To-Da-Mae-Geum (土多埋金)
    if ((uDayStem === '庚' || uDayStem === '辛') && pEarthCount >= 3) {
        gates.push({
            name: isKO ? "💎 [토다매금] 묻혀버린 보석" : "💎 [To-Da-Mae-Geum]",
            desc: isKO ? "상대의 보수적이고 답답한 기운이 당신의 날카로운 천재성을 흙 속에 묻어버렸습니다. 세상에 드러날 기회를 잃어가는 중입니다." : "Their conservative and heavy energy buries your sharp brilliance in the soil. You're losing chances to shine."
        });
        gatePenalty += 15;
    }

    // 3.3 Su-Da-Mok-Pyo (水多木漂)
    if ((uDayStem === '甲' || uDayStem === '乙') && pWaterCount >= 3) {
        gates.push({
            name: isKO ? "🌊 [수다목표] 뿌리 뽑힌 부표" : "🌊 [Su-Da-Mok-Pyo]",
            desc: isKO ? "과도한 감정과 수용력이 당신의 현실적 기반(뿌리)을 앗아갔습니다. 정착하지 못하고 상대의 감정에 휘말려 표류하는 관계입니다." : "Excessive emotions and receptivity took away your grounded roots. You are drifting in their emotional currents without settling."
        });
        gatePenalty += 18;
    }

    // 3.4 Hwa-Da-To-Cho (火多土焦)
    if ((uDayStem === '戊' || uDayStem === '己') && pFireCount >= 3) {
        gates.push({
            name: isKO ? "🔥 [화다토초] 갈라진 불모지" : "🔥 [Hwa-Da-To-Cho]",
            desc: isKO ? "상대의 폭발적인 열정이 당신의 인내심을 하얗게 태워버렸습니다. 아무것도 자랄 수 없는 메마른 관계, 갈증만이 남았습니다." : "Their explosive passion scorched your patience. A barren relationship where nothing can grow, leaving only thirst."
        });
        gatePenalty += 22;
    }

    // Jae-Da-Shin-Yak Synergy
    if (isUJDSY && (pBiGeop > 30 || pInSeong > 30)) {
        gates.push({
            name: isKO ? "💼 [재다신약의 구원] 부하분담의 동반자" : "💼 [Saving Wealth] Burden Sharing",
            desc: isKO ? "당신이 감당하기 벅찬 현실의 무게(재성)와 일들을 상대방의 뚝심(비겁/인성)이 든든하게 나눠 짊어집니다." : "They share the heavy weight of your responsibilities with strong support."
        });
        gateBonus += 15;
    } else if (isPJDSY && (uBiGeop > 30 || uInSeong > 30)) {
        gates.push({
            name: isKO ? "🛡️ [재다신약의 구원] 기댈 수 있는 언덕" : "🛡️ [Saving Wealth] A Hill to Lean On",
            desc: isKO ? "상대방이 현실의 과도한 압박(재성)에 치여 지칠 때, 당신의 강한 기운(비겁/인성)이 완벽한 안식처이자 힘이 되어줍니다." : "When they are exhausted by pressure, you provide a perfect shelter and strength."
        });
        gateBonus += 15;
    }

    if (!isSameGender) {
        if (uGender === 'female' && pGender === 'male') {
            if (uSikSang > 35 && pInSeong > 30) { gates.push({ name: isKO ? "[인성용식] 깊은 신뢰와 안식처" : "[Inseong-Yongsik] Deep Trust & Shelter", desc: isKO ? "당신의 널뛰는 감정과 에너지를 상대방이 무한한 수용력으로 안아줍니다." : "Your fluctuating emotions are endlessly embraced by his receptive energy." }); gateBonus += 15; }
            if (pGwanSal > 35) gateBonus += 10;
            const uWaterMetal = (uElements['Water(수)'] || uElements['Water'] || 0) + (uElements['Metal(금)'] || uElements['Metal'] || 0);
            const pFire = pElements['Fire(화)'] || pElements['Fire'] || 0;
            if (uWaterMetal > 45 && pFire > 30) { gates.push({ name: isKO ? "[조후 구원] 얼어붙은 심장에 봄을 부르다" : "[Temperature Savior] Melting the Heart", desc: isKO ? "당신의 차가운 내면을 상대의 따뜻한 기운이 녹여주는 구원자적 유대감입니다." : "His warm fire energy melts your cold inner self." }); gateBonus += 15; }
        } else if (uGender === 'male' && pGender === 'female') {
            if (uGwanSal > 35 && pSikSang > 30) { gates.push({ name: isKO ? "[식신제살] 숨 막히는 현실의 해방구" : "[Siksin-Jesal] Ultimate Escape", desc: isKO ? "짓누르는 책임감과 압박을 상대의 자유로움이 완벽히 해소해줍니다." : "Her cheerful rhythm perfectly releases you from heavy responsibilities." }); gateBonus += 15; }
            const uFireEarth = (uElements['Fire(화)'] || uElements['Fire'] || 0) + (uElements['Earth(토)'] || uElements['Earth'] || 0);
            const pWater = pElements['Water(수)'] || pElements['Water'] || 0;
            if (uFireEarth > 45 && pWater > 30) { gates.push({ name: isKO ? "[정신적 휴식] 폭주하는 열기를 식히다" : "[Mental Oasis] Cooling the Heat", desc: isKO ? "과열된 엔진 열기를 상대의 지혜로운 물기운이 씻어 완벽한 휴식을 줍니다." : "Her calm water energy cools down your overheated engine." }); gateBonus += 15; }
        }
    } else {
        const uDMStemForEaster = userResult?.pillars?.[1]?.stem || userResult?.pillars?.find(p => p.title === 'Day' || p.title === '일 || Day')?.stem || '甲';
        const pDMStemForEaster = partnerResult?.pillars?.[1]?.stem || partnerResult?.pillars?.find(p => p.title === 'Day' || p.title === '일 || Day')?.stem || '甲';
        const isMountainSynergy = (uDMStemForEaster === '戊' || uDMStemForEaster === '己') && (pDMStemForEaster === '戊' || pDMStemForEaster === '己') && ((uDayBranch === '寅' && pDayBranch === '午') || (uDayBranch === '午' && pDayBranch === '寅') || (uDMStemForEaster === '戊' && pDMStemForEaster === '戊'));
        
        if (isMountainSynergy && uDayBranch && ['寅', '午'].includes(uDayBranch) && pDayBranch && ['寅', '午'].includes(pDayBranch)) {
             gates.push({ name: isKO ? "🌋 [절대적 화력의 공유]" : "🌋 [Absolute Firepower]", desc: isKO ? "서로가 서로의 불꽃을 키워주는 위험하고도 완벽한 엔진입니다." : "A dangerously perfect engine feeding each other's flames." });
             gateBonus += 20;
        } else if (uBiGeop > 35 && pBiGeop > 35) { gates.push({ name: isKO ? "⚠️ [숙명의 라이벌] 두 마리 호랑이" : "⚠️ [Rivals of Destiny] Two Tigers", desc: isKO ? "주도권을 향한 자존심 싸움이 치열합니다. 공통의 목표가 없다면 부딪히기 쉽습니다." : "Fierce pride battles. You need a shared goal." }); gatePenalty += 10; }
        else if (uBiGeop < 20 && pBiGeop < 20) { 
            const GANYEOJIDONG = ['甲寅', '乙卯', '丙午', '丁巳', '戊辰', '戊戌', '己丑', '己未', '庚申', '辛酉', '壬子', '癸亥'];
            // Using existing uDayStem + uDayBranch
            const isUGan = GANYEOJIDONG.includes(uDayStem + uDayBranch);
            const isPGan = GANYEOJIDONG.includes(pDayStem + pDayBranch);

            if (isUGan && isPGan) {
                gates.push({ 
                    name: isKO ? "💎 [간여지동의 공명] 강한 영혼의 마주침" : "💎 [Resonance of Independence]", 
                    desc: isKO ? "둘 다 내면의 뿌리가 매우 강한 간여지동입니다. 서로의 고집을 꺾으려 하기보다, 그 단단한 자립심을 존중하며 같은 곳을 바라볼 때 무적의 파트너가 됩니다." : "Both have incredibly strong inner roots. When you respect each other's independence, you become invincible." 
                });
                gateBonus += 15;
            } else if (isUGan || isPGan) {
                const who = isUGan ? (isKO ? "당신" : "You") : (isKO ? "상대" : "Partner");
                gates.push({ 
                    name: isKO ? "🤝 [외유내강] 엇갈리는 자아" : "🤝 [Soft Outside, Hard Inside]", 
                    desc: isKO ? who + "은 겉으로는 유해 보여도 내면에 굽히지 않는 고집(간여지동)을 품고 있습니다. 이 역설적인 무게감 때문에 서로의 속도를 맞추는 데 노력이 필요합니다." : who + " has a hidden stubbornness. Effort is needed to synchronize your paces due to this paradoxical weight." 
                });
                // No bonus for one-sided GanYeoJiDong as requested
            } else {
                gates.push({ name: isKO ? "🤝 [도원결의] 편안한 안식처" : "🤝 [Oath of the Peach Garden]", desc: isKO ? "두 사람은 서로를 든든하게 받쳐주는 평화로운 관계지만, 동시에 공유하는 큰 목표가 꼭 필요합니다." : "Peaceful bond, needs a trigger to push forward." }); 
                gateBonus += 10; 
            }
        }
        if ((uSikSang > 30 && pJaeSeong > 30) || (pSikSang > 30 && uJaeSeong > 30)) { const i = uSikSang > 30 ? "당신의 아이디어" : "상대의 아이디어"; const m = uJaeSeong > 30 ? "당신의 현실 감각" : "상대의 현실 감각"; gates.push({ name: isKO ? "💼 [창과 방패] 비즈니스 콤비" : "💼 [Spear and Shield] Business Combo", desc: isKO ? i+"와 "+m+"가 만나 실질적 성과를 냅니다." : "Ideas meet realistic senses to produce results." }); gateBonus += 15; }
        const uYang = uSikSang + uBiGeop; const pYang = pSikSang + pBiGeop;
        if (Math.abs(uYang - pYang) > 25) { const l = uYang > pYang ? "당신" : "상대"; const s = uYang > pYang ? "상대" : "당신"; gates.push({ name: isKO ? "⚖️ [극성 조화] 추진체와 키잡이" : "⚖️ [Polarity Harmony] Lead and Support", desc: isKO ? l+"이 폭발력 있는 엔진이라면, "+s+"는 방향을 잡는 키잡이입니다." : "One is the engine, the other the steering wheel." }); gateBonus += 10; }
    }

    if (!isSameGender && uGender === 'female' && pGender === 'male' && !uWeak && pWeak) { gates.push({ name: isKO ? "🔄 [역할 반전] 보호하는 사자" : "🔄 [Role Reversal] The Protector", desc: isKO ? "당신이 이 관계의 든든한 뼈대(양)를 지탱하고 상대가 그 위에서 꽃피우는 구조입니다." : "You are the solid foundation supporting his growth." }); gateBonus += 10; }

    let structuralSynergy: { badge: string; desc: string; level: 'gold' | 'silver' } | undefined = undefined;

    // Disease logic (오행의 병폐 진단)
    const uFire = (uElements['Fire(화)'] || uElements['Fire'] || 0);
    const uEarth = (uElements['Earth(토)'] || uElements['Earth'] || 0);
    const uMetal = (uElements['Metal(금)'] || uElements['Metal'] || 0);
    const uWater = (uElements['Water(수)'] || uElements['Water'] || 0);
    const uWood = (uElements['Wood(목)'] || uElements['Wood'] || 0);
    
    // Partner's
    const pFire = (pElements['Fire(화)'] || pElements['Fire'] || 0);
    const pEarth = (pElements['Earth(토)'] || pElements['Earth'] || 0);
    const pMetal = (pElements['Metal(금)'] || pElements['Metal'] || 0);
    const pWater = (pElements['Water(수)'] || pElements['Water'] || 0);
    const pWood = (pElements['Wood(목)'] || pElements['Wood'] || 0);

    let diseaseBonus = 0;

    if (uEarth > 45 && uMetal > 0 && uMetal <= 15 && pWood > 20) {
        structuralSynergy = { badge: isKO ? "[토다매금 해소: 매몰된 보석을 캐내다]" : "[Freeing the Buried Gem]", desc: isKO ? "상대의 나무(목) 기운이 두터운 흙을 파내어 당신의 묻혀있던 재능(금)을 세상 밖으로 끄집어냅니다." : "Their wood energy unearths your hidden talents buried under thick earth.", level: 'gold' };
        diseaseBonus += 15;
        if (uYongHee.includes('Wood')) diseaseBonus += 5;
    } else if (uFire > 45 && uMetal > 0 && uMetal <= 15 && (pWater > 20 || pEarth > 20)) {
        structuralSynergy = { badge: isKO ? "[화다금용 해소: 녹아내리는 멘탈의 구원]" : "[Saving the Melting Metal]", desc: isKO ? "과도한 열기로 녹아내리던 당신의 자신감(금)을 상대의 기운이 식히고 보존해줍니다." : "Their cool energy preserves your confidence melting under excessive heat.", level: 'gold' };
        diseaseBonus += 15;
        if (uYongHee.includes('Water') || uYongHee.includes('Earth')) diseaseBonus += 5;
    } else if (uWater > 45 && uWood > 0 && uWood <= 15 && pEarth > 20) {
        structuralSynergy = { badge: isKO ? "[수다목부 해소: 떠내려가는 삶에 닻을 내리다]" : "[Anchor for the Drifting Wood]", desc: isKO ? "생각과 지원이 너무 많아 표류하던 당신(목)에게 상대방(토)이 단단한 댐이 되어 뿌리를 내리게 합니다." : "Their solid earth provides an anchor for your life drifting in endless water.", level: 'gold' };
        diseaseBonus += 15;
        if (uYongHee.includes('Earth')) diseaseBonus += 5;
    } else if (uFire > 45 && uEarth > 0 && uEarth <= 25 && pWater > 20) {
        structuralSynergy = { badge: isKO ? "[화다토초 해소: 메마른 대지의 단비]" : "[Rain on Scorched Earth]", desc: isKO ? "열정만 가득하고 결실이 없던 메마른 땅(토)에 상대방(수)이 단비가 되어 발복하게 합니다." : "Their water energy brings rain to your scorched, overpassionate earth to bear fruits.", level: 'gold' };
        diseaseBonus += 15;
        if (uYongHee.includes('Water')) diseaseBonus += 5;
    }

    // Custom check for 寅亥合 softening Gwan-seong
    const uBranchesStr = userResult.pillars.map(p => p.branch).join('');
    const pBranchesStr = partnerResult.pillars.map(p => p.branch).join('');
    if (uBranchesStr.includes('寅') && pBranchesStr.includes('亥')) {
        const uDM = userResult.pillars.find(p => p.title === 'Day')?.stem;
        const pDM = partnerResult.pillars.find(p => p.title === 'Day')?.stem;
        if (uDM === '戊' && pDM && STEM_ELEMENTS[pDM] === 'Wood') {
             structuralSynergy = { 
                 badge: isKO ? "[寅亥합: 목과 수의 포용]" : "[In-Hae Hap: Embracing Synergy]", 
                 desc: isKO ? "당신의 강경하고 경직된 통제력(관성)을 상대방의 부드러운 수용력(인성)이 寅亥合으로 감싸안아, 날 선 금목상쟁의 마찰을 따뜻한 에너지로 완화시켜주는 훌륭한 구조입니다." : "The strict authority in you is beautifully softened by the partner's fluid and accepting energy through the In-Hae combination.", 
                 level: 'gold' 
             };
             diseaseBonus += 25;
        }
    }

    if (!structuralSynergy) {
        // GeJu Synergy Logic (뇌의 궁합)
        const getGeJuClass = (gejuStr: string, tenGods: Record<string, number>, isDom: boolean) => {
            if (gejuStr) {
                if (gejuStr.includes('관') || gejuStr.includes('살')) return 'Gwan';
                if (gejuStr.includes('인')) return 'In';
                if (gejuStr.includes('식') || gejuStr.includes('상')) return 'Sik';
                if (gejuStr.includes('재')) return 'Jae';
                if (gejuStr.includes('비') || gejuStr.includes('겁') || gejuStr.includes('록') || gejuStr.includes('양인')) return 'Bi';
                if (gejuStr.includes('종') || gejuStr.includes('염상') || gejuStr.includes('곡직') || gejuStr.includes('종혁') || gejuStr.includes('윤하') || gejuStr.includes('가색')) return 'Special';
            }
            if (isDom) return 'Bi';
            const list = [
               { k: 'Gwan', v: uGwanSal },
               { k: 'In', v: uInSeong },
               { k: 'Sik', v: uSikSang },
               { k: 'Jae', v: uJaeSeong },
               { k: 'Bi', v: uBiGeop }
            ].sort((a,b)=>b.v - a.v);
            return list[0].k;
        };

        const uGc = getGeJuClass(userResult.analysis?.geJu || '', uTenGods, !uWeak);
        const pGc = getGeJuClass(partnerResult.analysis?.geJu || '', pTenGods, !pWeak);
        const uGeJuRaw = userResult.analysis?.geJu || '';
        const pGeJuRaw = partnerResult.analysis?.geJu || '';

        const applySynergy = (c1: string, c2: string) => {
            const hasGwanSikClash = (uGeJuRaw.includes('정관') && pGeJuRaw.includes('상관')) || (uGeJuRaw.includes('상관') && pGeJuRaw.includes('정관'));
            if (hasGwanSikClash) {
                return { badge: "상관견관(傷官見官) 리스크", desc: "⚠️ [가치관의 균열] 규율과 저항의 정면충돌입니다. 한 명의 원리원칙이 다른 한 명의 구속을 극도로 싫어하는 자유를 옥죄며 큰 파열음을 낼 수 있습니다.", penalty: 15 };
            }

            const combo = `${c1}-${c2}`;
            if (combo === 'Gwan-In' || combo === 'In-Gwan') return { badge: "관인상생(官印相生)", desc: "🛡️ [신뢰의 방파제] 세상의 막중한 책임감(관성)을 상대방의 깊은 수용력(인성)이 하나도 놓치지 않고 따뜻하게 껴안아 흡수해주는 단단한 결속의 파트너입니다.", bonus: 15 };
            if (combo === 'Gwan-Sik' || combo === 'Sik-Gwan') return { badge: "식신제살(食神制殺)", desc: "⚔️ [해결사 콤비] 한 명이 느끼는 견딜 수 없는 억압과 사면초가의 압박감을, 파트너의 기발한 창의성과 실천력(식상)이 완벽하게 돌파해줍니다.", bonus: 15 };
            if (combo === 'Sik-Jae' || combo === 'Jae-Sik') return { badge: "식상생재(食傷生財)", desc: "🤝 [이익 창출 콤비] 한 명의 넘치는 끼와 아이디어(식상)가 상대의 현실적이고 촘촘한 수익(재성)으로 확실하게 변환되는 효율적인 비즈니스 구조입니다.", bonus: 10 };
            if (combo === 'Sik-In' || combo === 'In-Sik') return { badge: "인성용식(印星用食)", desc: "🧠 [지혜의 조율자] 겉잡을 수 없이 뻗어가는 날것의 창의성이나 과도한 에너지(식상)를 파트너의 깊은 지혜(인성)로 정교하게 통제해내어 걸작을 만듭니다.", bonus: 5 };
            if (combo === 'Jae-Gwan' || combo === 'Gwan-Jae') return { badge: "재생관(財生官)", desc: "🤝 [제국의 건설자] 한 명의 현실 감각과 추진력(재성)이 상대방의 명예와 지위(관성)를 단단하게 세워주는 강력한 권력 결탁의 구조입니다.", bonus: 12 };
            if (combo === 'Bi-Jae' || combo === 'Jae-Bi') return { badge: "부하분담(負荷分擔)", desc: "🛡️ [짐을 나누는 동료] 한 명이 감당하기 힘든 벅찬 현실적 무대와 책임(재성)을, 파트너의 강력한 맷집(비겁)이 든든하게 받쳐줍니다.", bonus: 5 };
            if (combo === 'In-Bi' || combo === 'Bi-In') return { badge: "수기유행(秀氣流行)", desc: "💡 [세상 밖의 등대] 한 명의 깊은 사유와 지식(인성)을, 다른 한 명의 강력한 주체성과 실행력(비겁)이 세상 밖으로 속 시원히 꺼내어 형태 있는 것으로 조력합니다.", bonus: 5 };
            return null;
        };

        const gejuSynergy = applySynergy(uGc, pGc);
        if (gejuSynergy) {
            let comboBadge = isKO ? `[${gejuSynergy.badge} 게이트]` : `[${gejuSynergy.badge} Gate]`;
            structuralSynergy = { badge: comboBadge, desc: gejuSynergy.desc, level: 'gold' };
            if ((gejuSynergy as any).bonus) diseaseBonus += (gejuSynergy as any).bonus;
            if ((gejuSynergy as any).penalty) gatePenalty += (gejuSynergy as any).penalty;
        }

        // Special GeJu Penalty/Bonus logic
        if (uGc === 'Special' || pGc === 'Special') {
             const getStrongEl = (ratios: any) => Object.entries(ratios).sort((a: any, b: any) => b[1] - a[1])[0][0].split('(')[0].trim();
             const uDom = getStrongEl(userAdjustedElements);
             const pDom = getStrongEl(partnerAdjustedElements);
             const clashPairs = ['Water-Fire', 'Fire-Water', 'Wood-Metal', 'Metal-Wood', 'Earth-Water', 'Water-Earth'];
             if (clashPairs.includes(`${uDom}-${pDom}`)) {
                  diseaseBonus -= 20;
             } else if (uDom === pDom) {
                  diseaseBonus += 10;
                  structuralSynergy = { badge: isKO ? "[전왕/종격 조화: 극한의 동화]" : "[Flow Harmony]", desc: isKO ? "거스를 수 없는 거대한 하나의 기운에 상대가 완벽하게 동화되어 극강의 시너지를 만듭니다." : "They perfectly assimilate into your singular, unstoppable flow of energy, doubling the power.", level: 'gold' };
                  gates.push({ name: isKO ? "⚠️ [과열/폭주 위험] 거울의 독" : "⚠️ [Overheat Risk] Poison of the Mirror", desc: isKO ? "결핍의 교환 쌍방 없이 오직 같은 목표물을 향해 묶인 시너지가 폭발합니다. 하지만 이는 통제 불능의 가속과, 실패 시 함께 잿더미(Burn-out)가 될 수 있는 리스크를 내포합니다." : "Extreme unity of goals creates explosive synergy, but holds an incredible burn-out risk. If you fall, you crash together." });
             }
        }
    }

    if (uYongHee.length > 0 || pYongHee.length > 0) {
        // Give bonus if Partner provides User's YongHee powerfully
        let partnerProviders = Object.entries(partnerAdjustedElements).filter(([k,v]) => uYongHee.includes(cleanElement(k)) && v > 20);
        let userProviders = Object.entries(userAdjustedElements).filter(([k,v]) => pYongHee.includes(cleanElement(k)) && v > 20);
        if (partnerProviders.length > 0) diseaseBonus += 5;
        if (userProviders.length > 0) diseaseBonus += 5;
        if (partnerProviders.length > 0 && userProviders.length > 0) {
            gates.push({ name: isKO ? "⚖️ [The Mirroring Bonus] 크로스 카르마" : "⚖️ [The Mirroring Bonus] Cross Karma", desc: isKO ? "서로가 서로의 결핍을 완벽하게 채워주는 '구원자'이자 '수혜자'의 역할을 동시에 수행합니다. 역할의 대칭성이 극강의 안정감을 부여합니다." : "You and your partner act as each other's saviors simultaneously, providing unparalleled stability." });
            diseaseBonus += 10;
        }
    }

    gateBonus += diseaseBonus;

    const checkOverDrain = () => {};


    let syncScore = Math.max(0, Math.min(100, Math.round(baseScore + gateBonus - gatePenalty)));

    const uDMStemForEaster = userResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.stem || '甲';
    const pDMStem = partnerResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.stem || '甲';

    const uIljuData = getIljuData(uDMStemForEaster, uDayBranch);
    const pIljuData = getIljuData(pDMStem, pDayBranch);
    const isSameIlju = (uDMStemForEaster === pDMStem) && (uDayBranch === pDayBranch);
    const isIljiChung = CHUNG[uDayBranch] === pDayBranch;

    let resultText = '';
    
    const pGothKo = pIljuData?.core_identity?.goth_punk_vibe?.ko?.replace(/당신의/g, '상대의').replace(/당신은/g, '상대는').replace(/당신에게/g, '상대에게').replace(/당신이/g, '상대가').replace(/당신/g, '상대') || '';
    const pDefaultKo = pIljuData?.narrative_blocks?.default?.ko?.replace(/당신의/g, '상대의').replace(/당신은/g, '상대는').replace(/당신에게/g, '상대에게').replace(/당신이/g, '상대가').replace(/당신/g, '상대') || '';
    const pGothEn = pIljuData?.core_identity?.goth_punk_vibe?.en?.replace(/\bYour\b/g, 'Their').replace(/\byour\b/g, 'their').replace(/\bYou are\b/g, 'They are').replace(/\byou are\b/g, 'they are').replace(/\bYou\b/g, 'They').replace(/\byou\b/g, 'they') || '';

    if (isKO) {
        // [Section 1: Identity] 두 영혼의 질감
        resultText += `[Identity: 두 영혼의 질감]\n**당신은 "${uIljuData?.metadata?.kr_name}" : ${uIljuData?.core_identity?.persona?.ko}입니다.**\n${uIljuData?.core_identity?.goth_punk_vibe?.ko} 당신은 ${uIljuData?.narrative_blocks?.default?.ko}\n\n`;
        resultText += `**상대방은 "${pIljuData?.metadata?.kr_name}" : ${pIljuData?.core_identity?.persona?.ko}입니다.**\n${pGothKo} 상대는 ${pDefaultKo}\n\n`;
        
        if (isSameIlju) {
             resultText += `🎭 [거울 치료] 두 분은 놀랍게도 나와 똑같은 일주(${uDMStemForEaster}${uDayBranch})를 가진 도플갱어와도 같습니다. 상대의 혐오스러운 단점이 곧 나의 쉐도우(그림자)임을 인정할 때 강렬한 소울메이트가 됩니다.\n\n`;
             syncScore += 10;
        } else if (isIljiChung) {
             resultText += `🌪️ [긴장감의 미학] 두 사람의 본성(일지)이 끊임없이 부딪히며 스파크를 일으킵니다(${uDayBranch}-${pDayBranch} 충). 이 위태로운 충돌이 역설적으로 눈을 뗄 수 없는 섹슈얼한 혹은 극도의 긴장감 있는 매력으로 작용합니다.\n\n`;
        }

        if (isSameGender) {
            resultText += `[관계 극성 (Bro/Sister Synergy)]\n서로의 에너지가 사회적 결속과 비즈니스 및 삶의 시너지를 내는 데 어떻게 부합하는지 입체적으로 분석합니다.\n\n`;
        } else {
            resultText += `[심리적/구조적 결합 (Dynamics)]\n두 혼돈의 영혼이 부딪히며 만들어내는 결핍과 충족의 화학 반응을 추적합니다.\n\n`;
        }
    } else {
        const getRomanizedName = (krName: string | undefined) => {
            if (!krName || krName.length < 2) return krName || '';
            const stem = krName[0];
            const branch = krName[1];
            const STEM_ROMAN: Record<string, string> = {
                "갑": "Gap", "을": "Eul", "병": "Byeong", "정": "Jeong", "무": "Mu",
                "기": "Gi", "경": "Gyeong", "신": "Sin", "임": "Im", "계": "Gye"
            };
            const BRANCH_ROMAN: Record<string, string> = {
                "자": "ja", "축": "chuk", "인": "in", "묘": "myo", "진": "jin", "사": "sa",
                "오": "o", "미": "mi", "신": "sin", "유": "yu", "술": "sul", "해": "hae"
            };
            const s = STEM_ROMAN[stem];
            const b = BRANCH_ROMAN[branch];
            if (s && b) return `${s}-${b}(${stem}${branch})`;
            return krName;
        };
        const uRoman = getRomanizedName(uIljuData?.metadata?.kr_name);
        const pRoman = getRomanizedName(pIljuData?.metadata?.kr_name);

        resultText += `[Identity: Textures of Two Souls]\n**You are "${uRoman}" : ${uIljuData?.core_identity?.persona?.en}.**\n${uIljuData?.core_identity?.goth_punk_vibe?.en}\n\n`;
        resultText += `**Partner is "${pRoman}" : ${pIljuData?.core_identity?.persona?.en}.**\n${pGothEn}\n\n`;

        if (isSameGender) {
            resultText += `[Social Bond (Bro/Sister Synergy)]\nAnalyzing how your energies align for social, business, and life synergy.\n\n`;
        } else {
            resultText += `[Psychological & Structural Dynamics]\nThe core of this relationship is how you fill each other's lacking energies and harmonize overflowing traits.\n\n`;
        }
    }
            
    // Reconstruct missing vars: temperature, isEasterEgg, etc.
    const easterEggs = [
        { u: '壬', p: '丁' }, { u: '丁', p: '壬' },
        { u: '戊', p: '癸' }, { u: '癸', p: '戊' },
        { u: '庚', p: '乙' }, { u: '乙', p: '庚' },
        { u: '甲', p: '己' }, { u: '己', p: '甲' },
        { u: '丙', p: '辛' }, { u: '辛', p: '丙' }
    ];
    const isEasterEgg = easterEggs.some(e => e.u === uDMStemForEaster && e.p === pDMStem) && syncScore > 50;
    
    
    let temp = 36.5;
    const calculateHeat = (ratios: any) => {
        let heat = 0;
        Object.entries(ratios).forEach(([k, v]) => {
            const el = cleanElement(k);
            const val = v as number;
            if (el === 'Fire') heat += val * 1.5;
            else if (el === 'Wood') heat += val * 0.5;
            else if (el === 'Water') heat -= val * 1.5;
            else if (el === 'Metal') heat -= val * 0.5;
        });
        return heat; 
    };
    const getFixedAdjusted = (res: any) => {
        const rawRatios = res.analysis?.elementRatios || {};
        const cycle = res.grandCycles?.[res.currentCycleIndex];
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

    const isDaewunHap = (dBranch: string | undefined, oBranch: string | undefined) => {
        if (!dBranch || !oBranch) return false;
        const hapPairs = [
            ['寅','午'], ['午','戌'], ['寅','戌'],
            ['亥','卯'], ['卯','未'], ['亥','未'],
            ['申','子'], ['子','辰'], ['申','辰'],
            ['巳','酉'], ['酉','丑'], ['巳','丑'],
            ['子','丑'], ['寅','亥'], ['卯','戌'],
            ['辰','酉'], ['巳','申'], ['午','未']
        ];
        return hapPairs.some(p => (p[0] === dBranch && p[1] === oBranch) || (p[1] === dBranch && p[0] === oBranch));
    };

    if (isDaewunHap(uDaewunBranch, pDayBranch) || isDaewunHap(pDaewunBranch, uDayBranch)) {
        syncScore = Math.min(100, syncScore + 15);
        gates.push({ name: isKO ? "🔗 [강력한 결속] 대운 지지 합" : "🔗 [Strong Union] Daewun Hap", desc: isKO ? "대운과 상대의 사주가 합을 이루어, 이 시기에 놀라운 기회와 깊은 운명적 끌림을 경험합니다." : "Daewun period forms a strong karmic union with the partner." });
    }

    const uHeat = calculateHeat(userAdjustedElements);
    const pHeat = calculateHeat(partnerAdjustedElements);
    temp += (uHeat * 0.1) + (pHeat * 0.1);
    
    if (hasHap) temp += 5;
    if (hasChung) temp += 10; 
    if (hasStemHap) temp -= 2;
    if (hasStemChung) temp += 5;
    if (hasWonjin) temp -= 5;
    if (hyungCheck) temp -= 3;
    if (paCheck) temp += 0;
    if (haeCheck) temp -= 4;
    
    temp = Math.max(-10, Math.min(100, temp));

    let temperature = Math.round(temp * 10) / 10;
    
    let isSpecial = false; // We can default to false
    
    let tempText = "";
    let clashText = "";
            
    const dmElements: Record<string, string> = { '甲':'Wood', '乙':'Wood', '丙':'Fire', '丁':'Fire', '戊':'Earth', '己':'Earth', '庚':'Metal', '辛':'Metal', '壬':'Water', '癸':'Water' };
    const uDMElement = dmElements[uDMStemForEaster] || 'Wood';
            const pDMElement = dmElements[pDMStem] || 'Wood';

            const getMediator = (e1: string, e2: string) => {
                const pair = [e1, e2].sort().join('-');
                const mediators: Record<string, string> = { 'Earth-Wood': 'Fire', 'Metal-Wood': 'Water', 'Fire-Metal': 'Earth', 'Fire-Water': 'Wood', 'Earth-Water': 'Metal' };
                return mediators[pair] || '';
            };
            
            let mediator = getMediator(uDMElement, pDMElement);
            if (!mediator) {
                 const getStrongEl = (ratios: any) => Object.entries(ratios).sort((a: any, b: any) => b[1] - a[1])[0][0].split('(')[0].trim();
                 mediator = getMediator(getStrongEl(userAdjustedElements), getStrongEl(partnerAdjustedElements)) || 'Water';
            }
            
            const MEDIATOR_KO_EL: Record<string, string> = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)' };
            const mediatorKo = MEDIATOR_KO_EL[mediator] || '수(水)';
            const medStrKo = `[${mediatorKo}]`;
            const medStrEn = `[${mediator}]`;

            let uTopGive = '';
            let uTopGiveVal = 0;
            let pTopGive = '';
            let pTopGiveVal = 0;

            const koElements: Record<string, string> = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)' };
            const getKo = (el: string) => koElements[el] || el;

            Object.entries(partnerAdjustedElements).forEach(([k, v]) => {
                const el = cleanElement(k);
                const val = v as number;
                if (uYongHee.includes(el) && val > pTopGiveVal) {
                    pTopGiveVal = val;
                    pTopGive = el;
                }
            });

            Object.entries(userAdjustedElements).forEach(([k, v]) => {
                const el = cleanElement(k);
                const val = v as number;
                if (pYongHee.includes(el) && val > uTopGiveVal) {
                    uTopGiveVal = val;
                    uTopGive = el;
                }
            });

            if (isKO) {
                // 1. Sync level
                if (syncScore >= 90) resultText += "현재 두 분의 싱크로율 수치는 서로의 에너지 방향성이 완벽하게 일치하여, 억지로 맞추려 하지 않아도 서로의 존재만으로 빛이 나는 천생연분임을 의미합니다. ";
                else if (syncScore >= 70) resultText += "현재 싱크로율 수치는 서로의 에너지가 부드럽게 조화를 이루며, 조금의 맞춰가는 노력만으로도 긍정적인 시너지를 만들어낼 수 있는 훌륭한 인연임을 의미합니다. ";
                else if (syncScore >= 50) resultText += "현재 싱크로율 수치는 두 분의 기운이 때로는 부딪히고 때로는 융화되는 현실적 구간임을 의미합니다. 다름을 인정하고 양보를 통해 타협점을 찾아가는 지혜가 필요합니다. ";
                else resultText += "현재 싱크로율 수치는 두 분의 에너지 방향성이 크게 달라, 억지로 맞추려 하면 한쪽이 소진될 가능성이 있는 다소 도전적인 관계임을 의미합니다. ";

                // 2. Benefit (용희신 보완) & Hyung (형살) Overwrite
                if (hyungCheck) {
                    resultText += `\n\n[서로의 뼈를 깎는 수술대] 특별히 상대방의 단점을 다정하게 감싸기보다는, 치열한 '교정'과 '구조조정'의 메스를 들이대는 관계입니다. 다름을 인정하기보다 서로의 틀에 맞추려 살을 도려내는 고통스러운 마찰과 서늘한 긴장감이 지배합니다. `;
                } else if (uBenefitScore > 10 && pBenefitScore > 10) {
                    resultText += `\n\n[상호 운명적 보완] 서로가 서로의 가장 결정적인 결핍을 채워주는 쌍방향 구원자입니다. 나의 부족한 ${getKo(pTopGive)} 기운을 상대방이 채워주고, 상대의 부족한 ${getKo(uTopGive)} 기운을 내가 채워주며 폭발적인 시너지가 발생하는 [상호 에너지 수혈] 상위 1%의 조합입니다. `;
                } else if (uBenefitScore > 10 && pBenefitScore <= 0) {
                    resultText += `\n\n[일방적 에너지 수혈] 상대방이 당신의 절대적인 부족함을 묵묵히 채워주는 맹목적인 관계입니다. 내겐 구원자와 같아서 상대의 넉넉한 ${getKo(pTopGive)} 기운 덕분에 내가 심리적 안정감을 얻고 살아나지만, 반대로 상대방은 에너지가 소진될 수 있으니 당신의 끝없는 감사와 배려가 필수적입니다. `;
                } else if (uBenefitScore <= 0 && pBenefitScore > 10) {
                     resultText += `\n\n[헌신적 조력자] 당신이 상대방을 끌어안고 단점을 메워주는 헌신적인 관계입니다. 당신의 넉넉한 ${getKo(uTopGive)} 기운이 상대의 부족함을 채워주며 상대방은 당신 곁에서 큰 안도감과 발전을 얻습니다. 하지만 당신 스스로 감정적인 소진이 올 수 있으니 개인적인 공간과 휴식이 꼭 필요합니다. `;
                } else {
                     resultText += `\n\n[독립적 동행] 특별히 한쪽이 기운을 절대적으로 내어주고 받기보다 두 사람 모두 고유의 독립적인 기운이 강합니다. 서로에게 일방적으로 의존하거나 바꾸려 하기보다는, 각자의 고유한 영역을 존중하고 적절한 거리감을 허용할 때 가장 훌륭한 텐션과 밸런스를 유지합니다. `;
                }

                // 3. Temp
                if (isEasterEgg) {
                     tempText += "\n\n🌡️ 온도계 예측: [라이벌 연대] 극단적으로 맞닿은 뜨겁거나 차가운 온도가 오히려 둘을 뭉치게 하는 기적적인 시너지의 온도입니다.";
                 } else {
                     if (temperature >= 65) {
                         tempText += "\n\n🌡️ 온도계 예측: [폭염/열광] 강렬한 이끌림과 스파크가 튀는 시기. 체온이 크게 상승하는 열정적이고 때로는 다툼마저 맹렬한 온도입니다.";
                     } else if (temperature >= 45) {
                         tempText += "\n\n🌡️ 온도계 예측: [지옥의 가마솥] 함께 타버릴 각오 없이는 발을 들일 수 없는 지옥의 가마솥입니다. 단순한 열정을 넘어 서로의 자아를 증발시키는 맹렬한 상호 파괴적 폭주가 일어납니다.";
                     } else if (temperature >= 38) {
                         tempText += "\n\n🌡️ 온도계 예측: [고열/과열] 심장이 터질 듯한 강렬한 동질감과 과열된 시너지. 엔진이 터지기 직전입니다. 의도적으로 열기를 식힐 '수(水)' 기운의 냉각이 필요합니다.";
                     } else if (temperature >= 35) {
                         if (hyungCheck) {
                             tempText += "\n\n🌡️ 온도계 예측: [메스 든 평온] 겉보기엔 안락한 36.5도처럼 보이지만, 그 이면에는 언제든 서로의 허점을 찌르기 위한 서늘한 통제욕과 긴장감이 흐르고 있습니다.";
                         } else {
                             tempText += "\n\n🌡️ 온도계 예측: [안락/평온] 가장 편안한 36.5도 구간에 머물러 있습니다. 극단적임 없이 온화하고 안락한 휴식처가 되어주는 관계입니다.";
                         }
                     } else if (temperature >= 20) {
                         tempText += "\n\n🌡️ 온도계 예측: [서늘한 긴장감] 온도가 35도 아래로 떨어지며 날선 감각과 서늘한 이성이 지배합니다. 감정적 온기보다는 냉철하고 비판적인 시각이 우선시되는 긴장된 구간입니다.";
                     } else if (temperature >= 5) {
                         tempText += "\n\n🌡️ 온도계 예측: [조후 급랭/결빙] 온도가 서늘하게 얼어붙어 있습니다. 지나치게 이성적인 분석은 멈추고, 스킨십이나 감동적인 대화를 의도적으로 늘려 훈기를 불어넣어야 합니다.";
                     } else {
                         const uWater = userAdjustedElements['Water(수)'] || userAdjustedElements['Water'] || 0;
                         const uMetal = userAdjustedElements['Metal(금)'] || userAdjustedElements['Metal'] || 0;
                         const pWater = partnerAdjustedElements['Water(수)'] || partnerAdjustedElements['Water'] || 0;
                         const pMetal = partnerAdjustedElements['Metal(금)'] || partnerAdjustedElements['Metal'] || 0;
                         const bothCold = (uWater > 30 || uMetal > 30) && (pWater > 30 || pMetal > 30);
                         
                         if (bothCold) {
                            tempText += "\n\n🌡️ 온도계 예측: [조후 급랭/빙점] 극단적으로 차가운 빙점의 온도입니다. 두 사람 모두에게 금/수(金/水) 기운이 강하게 교차하며 뼈를 에이는 듯한 심리적 위축이나 소외감이 발생할 수 있습니다. 따뜻한 성찰과 현실적인 거리를 유지하며 얼음이 녹기를 기다리는 지혜가 필요합니다.";
                         } else {
                            tempText += "\n\n🌡️ 온도계 예측: [빙점/차분함] 상당히 차가운 이성의 온도입니다. 감정적 융화보다는 객관적 평가가 앞설 수 있으니, 의식적으로 온기를 불어넣는 칭찬과 배려가 필요합니다.";
                         }
                     }
                 }
                 
                 if (!isEasterEgg && (syncScore < 40 || hasWonjin || hasChung || hasStemChung || hyungCheck || paCheck || haeCheck)) {
                     clashText += "\n\n🛡️ [풀어야 할 과제] 구조적인 오행 충돌(형충파해/원진/천간충)로 인해 다름을 맞추어가는 인내심이 크게 요구됩니다. 알 수 없는 끌림과 마찰이 공존합니다.\n";
                     clashText += `🤝 [통관신(중재 기운)] 두 사람 사이의 벽을 허물기 위해 의식적으로 ${medStrKo} 기운을 활용해 보세요. 직접 부딪히기보다 제3자나 취미를 매개로 소통하는 것이 이롭습니다.\n`;
                     clashText += "⚡ [Action Guide] 감정적 융화보다는 서로의 다름을 직시하고 한 발짝 물러서는 신중한 거리가 필요합니다.";
                 }

                 resultText += tempText + clashText;

            } else {
                 if (syncScore >= 90) resultText += "Your energies fit together perfectly, meaning you naturally shine together without forcing it. ";
                 else if (syncScore >= 70) resultText += "Your energies harmonize smoothly. You create great synergy with just a little effort to understand each other. ";
                 else if (syncScore >= 50) resultText += "This is a practical phase where your energies sometimes clash and sometimes blend. It requires wisdom to compromise and respect your differences. ";
                 else resultText += "Your energy directions are quite different, making it a challenging relationship where forcing alignment could burn one out. ";

                 if (hyungCheck) {
                     resultText += `\n\n[Surgical Table of Correction] Rather than affectionately embracing each other's flaws, this relationship brings a fierce scalpel of 'correction.' Painful friction and a chilling tension dominate as you both try to carve the other into a specific mold instead of accepting differences.`;
                 } else if (uBenefitScore > 10 && pBenefitScore > 10) {
                     resultText += `\n\n[Mutual Salvation] You mutually fill each other's decisive voids. The exact energy you lack (${pTopGive}) is provided by your partner, and vice versa (${uTopGive}), creating top 1% synergy.`;
                 } else if (uBenefitScore > 10 && pBenefitScore <= 0) {
                     resultText += `\n\n[One-Sided Energy Fill] A devoted relationship where the partner silently fills your absolute lack. Like a savior, their abundant ${pTopGive} energy brings you stability. Ensure you show endless gratitude to prevent them from burning out.`;
                 } else if (uBenefitScore <= 0 && pBenefitScore > 10) {
                     resultText += `\n\n[Dedicated Supporter] You are the one embracing and filling the partner's voids. Your abundant ${uTopGive} energy gives them great relief and growth. Make sure to take time for yourself to avoid emotional burn-out.`;
                 } else {
                     resultText += `\n\n[Independent Journey] Rather than a one-sided energetic supply, you both possess strong independent traits. The balance is best when you respect each other's boundaries instead of relying heavily on one another.`;
                 }

                 if (isEasterEgg) {
                     tempText += "\n\n🌡️ Temperature: [Rival Synergy] Extreme identical temperatures forge a miraculous and unstoppable synergy for you both.";
                 } else {
                     if (temperature >= 65) {
                         tempText += "\n\n🌡️ Temperature: [Scorching/Fervor] Intense attraction and sparks. A highly passionate phase where even arguments are fiery.";
                     } else if (temperature >= 45) {
                         tempText += "\n\n🌡️ Temperature: [Cauldron of Hell] A vicious, mutually destructive overdrive that cannot be entered without the resolve to burn together. A high-heat fusion disaster that evaporates each other's egos.";
                     } else if (temperature >= 38) {
                         tempText += "\n\n🌡️ Temperature: [Overheating/Fever] Intense affinity and overheated synergy. Intentional cooling elements (Water) are recommended to prevent burnout.";
                     } else if (temperature >= 35) {
                         if (hyungCheck) {
                             tempText += "\n\n🌡️ Temperature: [Scalpel-Holding Peace] It seems like a comfortable 36.5°C on the surface, but underneath flows a chilling tension and a desire for control, ready to pierce each other's weak points.";
                         } else {
                             tempText += "\n\n🌡️ Temperature: [Comfort/Peace] Remaining in the most comfortable 36.5°C realm. A gentle shelter without extremes.";
                         }
                     } else if (temperature >= 20) {
                         tempText += "\n\n🌡️ Temperature: [Chilling Tension] The temperature drops below 35°C, dominated by sharp senses and cold rationality. It is a tense zone where cool, critical views rule over emotional warmth.";
                     } else if (temperature >= 15) {
                         tempText += "\n\n🌡️ Temperature: [Cool/Stable] Quiet trust based on reason. A calm temperature that safely guards each other's daily life.";
                     } else {
                         tempText += "\n\n🌡️ Temperature: [Freezing/Calm] A fairly cold rationale temperature. Conscious efforts to add warmth and compliments are needed.";
                     }
                 }
                 
                 if (!isEasterEgg && (syncScore < 40 || hasWonjin || hasChung || hasStemChung || hyungCheck || paCheck || haeCheck)) {
                     clashText += "\n\n🛡️ [Unresolved Task] Structural element clash (Hyung/Chung/Wonjin/Stem Clash) causes you to speak completely different languages, creating both magnetic pull and friction.\n";
                     clashText += `🤝 [Mediator] Find a mediator element (${medStrEn}) or a third-party hobby for smoother communication.\n`;
                     clashText += "⚡ [Action Guide] Focus on objective boundaries rather than forcing emotional alignment.";
                 }

                 resultText += tempText + clashText;
            }

            const uniqueGates = Array.from(new Set(gates.map(g => g.name)))
                 .map(name => gates.find(g => g.name === name)!);

            let relation = isKO ? "평범한 동행" : "Ordinary Companion";
            if (syncScore > 80) relation = isKO ? "천생연분" : "Soulmate";
            else if (syncScore > 60) relation = isKO ? "성장 파트너" : "Growth Partner";
            else if (syncScore > 40) relation = isKO ? "현실적 조율기" : "Practical Phase";
            else relation = isKO ? "숙제와 성찰" : "Task and Reflection";

            let isGlowing = syncScore >= 85 || isEasterEgg;

            return {
                syncScore,
                temperature,
                relation,
                isGlowing,
                text: resultText,
                isEasterEgg,
                gates: uniqueGates,
                structuralSynergy
            };
        }
