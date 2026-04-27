import { BaZiResult, Language } from '../types';
import { STEM_ELEMENTS, BRANCH_ELEMENTS } from './bazi-engine';

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
    lang: Language
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

    let branchInteraction = 'none';
    let gateBonus = 0;
    let gatePenalty = 0;
    
    const uGender = userResult.analysis?.gender || 'male';
    const pGender = partnerResult.analysis?.gender || 'female';
    const isSameGender = uGender === pGender || uGender === 'non-binary' || pGender === 'non-binary' || uGender === 'prefer-not-to-tell' || pGender === 'prefer-not-to-tell';
    
    const YUKHAP: Record<string, string> = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
    const CHUNG: Record<string, string> = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
    const WONJIN: Record<string, string> = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '酉', '酉': '寅', '卯': '申', '申': '卯', '辰': '亥', '亥': '辰', '巳': '戌', '戌': '巳' };
    
    const uDayBranch = userResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.branch || '';
    const pDayBranch = partnerResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.branch || '';
    
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
            branchInteraction = 'hap';
            break;
        }
    }

    if (uDayBranch && pDayBranch) {
        if (YUKHAP[uDayBranch] === pDayBranch) branchInteraction = 'hap';
        else if (CHUNG[uDayBranch] === pDayBranch) branchInteraction = 'chung';
        else if (WONJIN[uDayBranch] === pDayBranch) branchInteraction = 'wonjin';
    }
    
    if (branchInteraction === 'hap') gateBonus += 15;
    if (branchInteraction === 'chung' || branchInteraction === 'wonjin') gatePenalty += 10;

    if (samhapMatch) {
         const isShenZi = (uDayBranch === '申' && pDayBranch === '子') || (uDayBranch === '子' && pDayBranch === '申');
         if (isShenZi) {
              gates.push({ name: isKO ? "🌊 [영혼의 주파수: 신자합]" : "🌊 [Soul Resonator: Shen-Zi Hap]", desc: isKO ? "상대방과 깊은 영혼의 결속력을 가집니다. 서로가 함께할 때 큰 시너지(수국)를 만들어냅니다." : "Deep spiritual connection forming powerful synergy." });
         } else {
              gates.push({ name: isKO ? `🔗 [강력한 결속: ${uDayBranch}${pDayBranch} 반합]` : `🔗 [Strong Bond: Half-Hap]`, desc: isKO ? `두 사람의 내면이 같은 방향(${samhapMatch.element})성을 향해 매끄럽게 융합됩니다.` : "Your inner energies blend seamlessly in the same direction." });
         }
    }

    const uBranches = userResult.pillars.map(p => p.branch);
    const pBranches = partnerResult.pillars.map(p => p.branch);
    const hasFireFrame = (b: string[]) => (b.includes('寅') && b.includes('午')) || (b.includes('午') && b.includes('戌')) || (b.includes('寅') && b.includes('戌'));
    const hasWaterFrame = (b: string[]) => (b.includes('申') && b.includes('子')) || (b.includes('子') && b.includes('辰')) || (b.includes('申') && b.includes('辰'));

    if ((hasFireFrame(uBranches) && hasWaterFrame(pBranches)) || (hasWaterFrame(uBranches) && hasFireFrame(pBranches))) {
        gates.push({
            name: isKO ? "⚖️ [수화기제] 최고 역동의 밸런스" : "⚖️ [Water & Fire Harmony]",
            desc: isKO ? "한쪽의 폭발적인 조열함(화국)과 다른 쪽의 응축된 한랭함(수국)이 만나, 서로를 파괴하지 않고 완벽한 시너지(수화기제)를 만들어냅니다." : "Explosive fire and condensed water meet to form a perfect, productive balance."
        });
        gateBonus += 25;
    }
    
    if (branchInteraction === 'wonjin') {
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

    // Jae-Da-Shin-Yak Synergy
    if (uWeak && uJaeSeong > 40 && (pBiGeop > 30 || pInSeong > 30)) {
        gates.push({
            name: isKO ? "💼 [재다신약의 구원] 부하분담의 동반자" : "💼 [Saving Wealth] Burden Sharing",
            desc: isKO ? "당신이 감당하기 벅찬 현실의 무게(재성)와 일들을 상대방의 뚝심(비겁/인성)이 든든하게 나눠 짊어집니다." : "They share the heavy weight of your responsibilities with strong support."
        });
        gateBonus += 15;
    } else if (pWeak && pJaeSeong > 40 && (uBiGeop > 30 || uInSeong > 30)) {
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
            if (uWeak && pSikSang > 40) { gates.push({ name: isKO ? "⚠️ [통제 상실] 걷잡을 수 없는 자유" : "⚠️ [Loss of Control] Uncontrollable Freedom", desc: isKO ? "상대의 자유분방함이 신약한 당신의 원칙을 허물며 불안 요소로 체감될 수 있습니다." : "Her free spirit might become a source of anxiety." }); gatePenalty += 10; }
            const uFireEarth = (uElements['Fire(화)'] || uElements['Fire'] || 0) + (uElements['Earth(토)'] || uElements['Earth'] || 0);
            const pWater = pElements['Water(수)'] || pElements['Water'] || 0;
            if (uFireEarth > 45 && pWater > 30) { gates.push({ name: isKO ? "[정신적 휴식] 폭주하는 열기를 식히다" : "[Mental Oasis] Cooling the Heat", desc: isKO ? "과열된 엔진 열기를 상대의 지혜로운 물기운이 씻어 완벽한 휴식을 줍니다." : "Her calm water energy cools down your overheated engine." }); gateBonus += 15; }
        }
    } else {
        if (uBiGeop > 35 && pBiGeop > 35) { gates.push({ name: isKO ? "⚠️ [숙명의 라이벌] 두 마리 호랑이" : "⚠️ [Rivals of Destiny] Two Tigers", desc: isKO ? "주도권을 향한 자존심 싸움이 치열합니다. 공통의 목표가 없다면 부딪히기 쉽습니다." : "Fierce pride battles. You need a shared goal." }); gatePenalty += 10; }
        else if (uBiGeop < 20 && pBiGeop < 20) { gates.push({ name: isKO ? "🤝 [도원결의] 편안한 안식처" : "🤝 [Oath of the Peach Garden]", desc: isKO ? "두 사람은 서로를 든든하게 받쳐주는 평화로운 관계지만, 동시에 공유하는 큰 목표가 꼭 필요합니다." : "Peaceful bond, needs a trigger to push forward." }); gateBonus += 10; }
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

        const applySynergy = (c1: string, c2: string) => {
            const combo = `${c1}-${c2}`;
            if (combo === 'Gwan-In' || combo === 'In-Gwan') return { badge: isKO ? "관인상생: 신뢰의 파트너" : "Gwan-In: Trusted Partner", desc: isKO ? "한 명의 억압구조(관)를 다른 한 명이 넓은 이해와 수용력(인)으로 흡수하여 강한 신뢰를 형성합니다." : "One's heavy responsibilities are smoothly absorbed by the other's deep understanding." };
            if (combo === 'Gwan-Sik' || combo === 'Sik-Gwan') return { badge: isKO ? "식신제살: 해결사 콤비" : "Sik-Gwan: Problem Solvers", desc: isKO ? "틀에 갇힌 압박감(관)을 상대의 기발한 아이디어(식상)로 시원하게 뚫어버리는 관계입니다." : "The strict pressure is efficiently relieved by the other's brilliant ideas." };
            if (combo === 'Sik-Jae' || combo === 'Jae-Sik') return { badge: isKO ? "식상생재: 동업의 정석" : "Sik-Jae: Perfect Biz Combo", desc: isKO ? "한 명의 넘치는 끼와 아이디어(식상)가 상대의 현실적인 결과물(재성)로 변환되는 최적의 구조입니다." : "Abundant creative ideas are effortlessly translated into realistic financial results." };
            if (combo === 'Sik-In' || combo === 'In-Sik') return { badge: isKO ? "인성용식: 지혜의 조율자" : "In-Sik: Wisdom Coordinator", desc: isKO ? "무모한 폭주나 과도한 에너지(식상)를 깊은 지혜(인성)로 통제해내어 걸작을 만듭니다." : "Raw, unchecked creativity is refined into a masterpiece by profound wisdom." };
            if (combo === 'Jae-Gwan' || combo === 'Gwan-Jae') return { badge: isKO ? "재생관: 부와 명예의 결합" : "Jae-Gwan: Wealth & Honor", desc: isKO ? "뛰어난 경제적 감각(재성)이 무너지지 않도록 사회적 명예와 원칙(관성)으로 지켜주는 조합입니다." : "Excellent financial sense is firmly guarded by social honor and rules." };
            if (combo === 'Bi-Jae' || combo === 'Jae-Bi') return { badge: isKO ? "부하분담: 짐을 나누는 동료" : "Bi-Jae: Shielding the Burden", desc: isKO ? "한 명이 감당하기 힘든 큰 현실적 무대(재성)를 다른 한 명의 맷집(비겁)이 든든하게 받쳐줍니다." : "A huge stage is firmly supported by the other's strong defensive presence." };
            if (combo === 'In-Bi' || combo === 'Bi-In') return { badge: isKO ? "수기유행: 세상 밖의 등대" : "In-Bi: Worldly Lighthouse", desc: isKO ? "깊은 내면의 지식(인성)을 상대방(비겁)이 세상 밖으로 꺼내 빛나게 조력합니다." : "Deep inner knowledge is brought to the world to shine brightly by the other's presence." };
            return null;
        };

        const gejuSynergy = applySynergy(uGc, pGc);
        if (gejuSynergy) {
            let comboBadge = isKO ? `[${gejuSynergy.badge}]` : `[${gejuSynergy.badge}]`;
            structuralSynergy = { badge: comboBadge, desc: gejuSynergy.desc, level: 'gold' };
            diseaseBonus += 15;
            
            // Check if Outcome is Yong-Shin
            const checkYongShinOutcome = () => {
                if (uGc === 'Gwan' && pGc === 'In' && uYongHee.includes(pDMElement)) return true;
                if (uGc === 'In' && pGc === 'Gwan' && uYongHee.includes(pDMElement)) return true;
                return false; 
                // simplified check for brevity: We'll just grant +5 generically if the partner provides the user's top Yong-Shin
            }
            if (uYongHee.length > 0) {
               // Give bonus if Partner provides User's YongHee powerfully
               let partnerProviders = Object.entries(partnerAdjustedElements).filter(([k,v]) => uYongHee.includes(cleanElement(k)) && v > 20);
               if (partnerProviders.length > 0) diseaseBonus += 5;
            }
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
             }
        }
    }

    gateBonus += diseaseBonus;

    const checkOverDrain = () => {};


    let syncScore = Math.max(0, Math.min(100, Math.round(baseScore + gateBonus - gatePenalty)));

    let resultText = '';
    if (isKO) {
        if (isSameGender) {
            resultText += `[관계 극성 (Bro/Sister Synergy)]\n서로의 에너지가 사회적 결속과 비즈니스 및 삶의 시너지를 내는 데 어떻게 부합하는지 분석합니다.\n\n`;
        } else {
            resultText += `[심리적/구조적 결합 (Dynamics)]\n이 만남은 서로의 부족한 에너지를 어떻게 채워주고, 넘치는 힘을 어떻게 조율하는가가 핵심입니다.\n\n`;
        }
    } else {
        if (isSameGender) {
            resultText += `[Social Bond (Bro/Sister Synergy)]\nAnalyzing how your energies align for social, business, and life synergy.\n\n`;
        } else {
            resultText += `[Psychological & Structural Dynamics]\nThe core of this relationship is how you fill each other's lacking energies and harmonize overflowing traits.\n\n`;
        }
    }
            
    // Reconstruct missing vars: temperature, isEasterEgg, etc.
    const pDMStem = partnerResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.stem || '甲';
    const easterEggs = [
        { u: '壬', p: '丁' }, { u: '丁', p: '壬' },
        { u: '戊', p: '癸' }, { u: '癸', p: '戊' },
        { u: '庚', p: '乙' }, { u: '乙', p: '庚' },
        { u: '甲', p: '己' }, { u: '己', p: '甲' },
        { u: '丙', p: '辛' }, { u: '辛', p: '丙' }
    ];
    const uDMStemForEaster = userResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.stem || '甲';
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
    const uHeat = calculateHeat(userAdjustedElements);
    const pHeat = calculateHeat(partnerAdjustedElements);
    temp += (uHeat * 0.1) + (pHeat * 0.1);
    
    if (branchInteraction === 'hap') temp += 5;
    if (branchInteraction === 'chung') temp += 10; 
    if (branchInteraction === 'wonjin') temp -= 5;
    
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

                // 2. Benefit (용희신 보완)
                if (uBenefitScore > 10 && pBenefitScore > 10) {
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
                     if (temperature >= 65) tempText += "\n\n🌡️ 온도계 예측: [폭염/연광] 강렬한 이끌림과 스파크가 튀는 시기. 체온이 크게 상승하는 열정적이고 때로는 다툼마저 맹렬한 온도입니다.";
                     else if (temperature >= 45) tempText += "\n\n🌡️ 온도계 예측: [온난/따스함] 훈훈한 온기가 도는 활기찬 온도입니다. 서로의 열정이 자연스럽게 교류하며 긍정적인 자극을 줍니다.";
                     else if (temperature >= 25) tempText += "\n\n🌡️ 온도계 예측: [안락/평온] 가장 편안한 36.5도 구간에 머물러 있습니다. 극단적임 없이 온화하고 안락한 휴식처가 되어주는 관계입니다.";
                     else if (temperature >= 15) tempText += "\n\n🌡️ 온도계 예측: [냉철/안정] 이성적 신뢰를 바탕으로 조용히 스며드는 시기. 들뜬 감정보다는 서로의 일상을 든든히 지켜주는 차분하고 시원한 온도입니다.";
                     else {
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
                 
                 if (!isEasterEgg && (syncScore < 40 || branchInteraction === 'wonjin' || branchInteraction === 'chung')) {
                     clashText += "\n\n🛡️ [풀어야 할 과제] 구조적인 오행 충돌(원진/충 등)로 인해 다름을 맞추어가는 인내심이 크게 요구됩니다. 알 수 없는 끌림과 마찰이 공존합니다.\n";
                     clashText += `🤝 [통관신(중재 기운)] 두 사람 사이의 벽을 허물기 위해 의식적으로 ${medStrKo} 기운을 활용해 보세요. 직접 부딪히기보다 제3자나 취미를 매개로 소통하는 것이 이롭습니다.\n`;
                     clashText += "⚡ [Action Guide] 감정적 융화보다는 서로의 다름을 직시하고 한 발짝 물러서는 신중한 거리가 필요합니다.";
                 }

                 resultText += tempText + clashText;

            } else {
                 if (syncScore >= 90) resultText += "Your energies fit together perfectly, meaning you naturally shine together without forcing it. ";
                 else if (syncScore >= 70) resultText += "Your energies harmonize smoothly. You create great synergy with just a little effort to understand each other. ";
                 else if (syncScore >= 50) resultText += "This is a practical phase where your energies sometimes clash and sometimes blend. It requires wisdom to compromise and respect your differences. ";
                 else resultText += "Your energy directions are quite different, making it a challenging relationship where forcing alignment could burn one out. ";

                 if (uBenefitScore > 10 && pBenefitScore > 10) {
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
                     if (temperature >= 65) tempText += "\n\n🌡️ Temperature: [Scorching/Fervor] Intense attraction and sparks. A highly passionate phase where even arguments are fiery.";
                     else if (temperature >= 45) tempText += "\n\n🌡️ Temperature: [Warm/Cozy] A lively and warm temperature. Your passions naturally interact, providing positive stimulation.";
                     else if (temperature >= 25) tempText += "\n\n🌡️ Temperature: [Comfort/Peace] Remaining in the most comfortable 36.5°C realm. A gentle shelter without extremes.";
                     else if (temperature >= 15) tempText += "\n\n🌡️ Temperature: [Cool/Stable] Quiet trust based on reason. A calm temperature that safely guards each other's daily life.";
                     else tempText += "\n\n🌡️ Temperature: [Freezing/Calm] A fairly cold rationale temperature. Conscious efforts to add warmth and compliments are needed.";
                 }
                 
                 if (!isEasterEgg && (syncScore < 40 || branchInteraction === 'wonjin' || branchInteraction === 'chung')) {
                     clashText += "\n\n🛡️ [Unresolved Task] Structural element clash (Wonjin/Chung) causes you to speak completely different languages, creating both magnetic pull and friction.\n";
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
                gates: uniqueGates
            };
        }
