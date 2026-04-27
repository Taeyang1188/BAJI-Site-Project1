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
}

export function calculateRelationshipDynamics(
    userResult: BaZiResult,
    partnerResult: BaZiResult,
    userAdjustedElements: Record<string, number>,
    partnerAdjustedElements: Record<string, number>,
    lang: Language
): RelationshipDynamicsResult {
    const isKO = lang === 'KO';
    
    let baseScore = 50;

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

    baseScore = 50 + uBenefitScore + pBenefitScore;
    const diff = Math.abs(uBenefitScore - pBenefitScore);
    baseScore -= diff * 0.5;

    let branchInteraction = 'none';
    let gateBonus = 0;
    let gatePenalty = 0;
    const gates: { name: string; desc: string }[] = [];
    
    const uGender = userResult.analysis?.gender || 'male';
    const pGender = partnerResult.analysis?.gender || 'female';
    const isSameGender = uGender === pGender;

    const YUKHAP: Record<string, string> = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
    const CHUNG: Record<string, string> = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };
    const WONJIN: Record<string, string> = { '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '酉', '酉': '寅', '卯': '申', '申': '卯', '辰': '亥', '亥': '辰', '巳': '戌', '戌': '巳' };

    const uDayBranch = userResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.branch || '';
    const pDayBranch = partnerResult.pillars.find(p => p.title === 'Day' || p.title === '일주')?.branch || '';

    if (uDayBranch && pDayBranch) {
        if (YUKHAP[uDayBranch] === pDayBranch) branchInteraction = 'hap';
        else if (CHUNG[uDayBranch] === pDayBranch) branchInteraction = 'chung';
        else if (WONJIN[uDayBranch] === pDayBranch) branchInteraction = 'wonjin';
    }

    if (branchInteraction === 'hap') gateBonus += 15;
    if (branchInteraction === 'chung' || branchInteraction === 'wonjin') gatePenalty += 10;
    
    if (branchInteraction === 'wonjin') {
        gates.push({
            name: isKO ? "⚠️ [원진/귀문] 날카로운 신경전과 흡인력" : "⚠️ [Wonjin] Magnetic Pull & Conflicts",
            desc: isKO ? "일지 간 원진 작용으로, 강렬하게 끌리면서도 알 수 없는 오해와 예민함이 발동합니다. 밀착하기보다 약간의 거리를 둘 때 오히려 관계가 애틋해집니다." : "You feel an intense pull but also unexplainable misunderstandings."
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
    const uStrong = (userResult.analysis?.dayMasterStrength?.score || 50) >= 50;
    const pStrong = (partnerResult.analysis?.dayMasterStrength?.score || 50) >= 50;

    const uWaterMetal = (uElements['Water(수)'] || uElements['Water'] || 0) + (uElements['Metal(금)'] || uElements['Metal'] || 0);
    const uFireEarth = (uElements['Fire(화)'] || uElements['Fire'] || 0) + (uElements['Earth(토)'] || uElements['Earth'] || 0);
    const pWaterMetal = (pElements['Water(수)'] || pElements['Water'] || 0) + (pElements['Metal(금)'] || pElements['Metal'] || 0);
    const pFireEarth = (pElements['Fire(화)'] || pElements['Fire'] || 0) + (pElements['Earth(토)'] || pElements['Earth'] || 0);
    const pFire = pElements['Fire(화)'] || pElements['Fire'] || 0;
    const pWater = pElements['Water(수)'] || pElements['Water'] || 0;
    const uFire = uElements['Fire(화)'] || uElements['Fire'] || 0;
    const uWater = uElements['Water(수)'] || uElements['Water'] || 0;

    // --- GENDER AWARE LOGIC --- 
    if (!isSameGender) {
        if (uGender === 'female' && pGender === 'male') {
            // [Female User -> Male Partner]
            if (uSikSang > 35 && pInSeong > 30) {
                gates.push({
                    name: isKO ? "💖 [인성용식] 깊은 신뢰와 안식처" : "💖 [Inseong-Yongsik] Deep Trust & Shelter",
                    desc: isKO ? "당신의 널뛰는 감정과 발산하는 에너지(식상)를 상대방이 무한한 수용력(인성)으로 든든하게 안아줍니다. 감정의 롤러코스터를 멈추게 하는 당신만의 유일한 안식처입니다." : "Your fluctuating emotions are endlessly embraced by his receptive energy."
                });
                gateBonus += 15;
            }
            if (pGwanSal > 40) {
                gates.push({
                    name: isKO ? "🛡️ [관성 의존] 든든한 울타리" : "🛡️ [Gwanseong] Reliable Fence",
                    desc: isKO ? "상대방의 튼튼한 관성(책임감과 명예)이 당신의 불안을잠재우고 삶을 든든하게 보호하는 울타리 역할을 합니다." : "His strong responsibility becomes a reliable fence that calms your anxiety."
                });
                gateBonus += 10;
            }
            if (uWaterMetal > 45 && pFire > 30) {
                gates.push({
                    name: isKO ? "🔥 [조후 구원] 얼어붙은 심장에 봄을 부르다" : "🔥 [Temperature Savior] Melting the Heart",
                    desc: isKO ? "당신의 한랭하고 외로운 내면(금/수)을 상대의 따뜻한 불기운이 녹여줍니다. 단순한 호감을 넘어, 심리적 구원자에 가까운 강력한 이끌림과 유대감을 느낄 수 있습니다." : "His warm fire energy melts your cold and lonely inner self."
                });
                gateBonus += 15;
            }
        } 
        else if (uGender === 'male' && pGender === 'female') {
            // [Male User -> Female Partner]
            if (uGwanSal > 35 && pSikSang > 30) {
                gates.push({
                    name: isKO ? "✨ [식신제살] 숨 막히는 현실의 해방구" : "✨ [Siksin-Jesal] Ultimate Escape",
                    desc: isKO ? "당신을 짓누르는 무거운 책임감과 보이지 않는 압박(관살)을 상대의 경쾌한 리듬감과 자유로움(식상)이 완벽히 해소해줍니다. 스트레스가 씻겨 내려가는 최고의 궁합입니다." : "Her cheerful rhythm perfectly releases you from heavy responsibilities and pressure."
                });
                gateBonus += 15;
            }
            if (uWeak && pSikSang > 40) {
                gates.push({
                    name: isKO ? "⚠️ [통제 상실] 걷잡을 수 없는 자유" : "⚠️ [Loss of Control] Uncontrollable Freedom",
                    desc: isKO ? "상대의 자유분방함과 폭발적인 표현력이 신약한 당신에겐 가끔 버겁습니다. 당신의 원칙을 허물며, 멘탈을 흔드는 통제 밖의 불안 요소로 체감될 수 있습니다." : "Her overwhelming free spirit might shake your principles and become a source of anxiety."
                });
                gatePenalty += 10;
            }
            if (uFireEarth > 45 && pWater > 30) {
                gates.push({
                    name: isKO ? "🌊 [정신적 휴식] 폭주하는 열기를 식히다" : "🌊 [Mental Oasis] Cooling the Heat",
                    desc: isKO ? "당신의 과열된 엔진과 폭주하는 열기(화/토)를 상대의 차분하고 지혜로운 물기운이 시원하게 씻어내 줍니다. 치열한 전투 후 만나는 완벽한 정신적 휴식처입니다." : "Her calm water energy cools down your overheated engine, providing a perfect mental oasis."
                });
                gateBonus += 15;
            }
        }

        // Role Reversal if extreme differences
        if (uGender === 'female' && pGender === 'male' && uStrong && pWeak) {
            gates.push({
                name: isKO ? "🔄 [현대적 극성 조화] 보호하는 사자" : "🔄 [Role Reversal] The Fierce Protector",
                desc: isKO ? "관습적 성역할을 뒤집는 특별한 구조입니다. 당신이 이 관계의 든든한 뼈대(양)가 되어 지탱하고, 상대가 당신의 보호막 위에서 꽃피우고 유연함을 더해줍니다." : "Moving past conventional roles, you are the solid foundation supporting his growth."
            });
            gateBonus += 10;
        } else if (uGender === 'male' && pGender === 'female' && uWeak && pStrong) {
            gates.push({
                name: isKO ? "🔄 [현대적 극성 조화] 보듬는 나무" : "🔄 [Role Reversal] The Sheltering Tree",
                desc: isKO ? "관습적 성역할을 벗어나, 상대방이 당신의 흔들리는 멘탈과 현실을 든든하게 받쳐주는 거대한 나무(양)의 역할을 합니다. 당신은 그 그늘에서 확신을 얻습니다." : "She acts as the giant tree that grounds your reality, reversing conventional roles."
            });
            gateBonus += 10;
        }
    } else {
        // --- BRO MODE / SISTER MODE (Social Bond & Business Synergy) ---
        if (uBiGeop > 35 && pBiGeop > 35) {
            gates.push({
                name: isKO ? "⚔️ [숙명의 라이벌] 두 마리 호랑이" : "⚔️ [Rivals of Destiny] Two Tigers",
                desc: isKO ? "주도권 쟁탈전이 치열합니다. 두 마리의 호랑이가 한 산에 있는 격입니다. 명확한 공동의 목표나 철저한 영역 분담이 없다면, 최고의 아군이 최악의 적이 될 수 있는 아슬아슬한 '거울 관계'입니다." : "Fierce pride battles for control. You need a shared goal or strict boundaries to succeed together."
            });
            gatePenalty += 15;
        } else if (uBiGeop < 20 && pBiGeop < 20) {
            gates.push({
                name: isKO ? "🤝 [도원결의] 편안한 동지애" : "🤝 [Oath of the Peach Garden]",
                desc: isKO ? "서로를 찌르지 않고 든든한 백업이 되어주는 평화로운 관계입니다. 다만 엄청난 돌파력은 부족할 수 있으니, 큰 목표를 향해 함께 엑셀(추진력)을 밟아줄 강력한 계기나 시스템이 속해 있어야 합니다." : "A peaceful bond without rivalry. A strong trigger is needed to push forward with drive."
            });
            gateBonus += 10;
        }

        if ((uSikSang > 30 && pJaeSeong > 30) || (pSikSang > 30 && uJaeSeong > 30)) {
            const hasIdea = uSikSang > 30 ? "당신의 통통 튀는 기획력" : "상대의 뛰어난 기획력";
            const hasMoney = uJaeSeong > 30 ? "당신의 날카로운 현실 감각" : "상대의 날카로운 현실 감각";
            gates.push({
                name: isKO ? "💼 [창과 방패] 환상의 비즈니스 콤비" : "💼 [Spear and Shield] Perfect Business Combo",
                desc: isKO ? "생명력과 생산성이 극대화되는 황금 궁합입니다. " + hasIdea + "(식상)과 " + hasMoney + "(재성)이 만나 무형의 아이디어를 실질적인 자본과 결과물로 완벽하게 치환시킵니다." : "Maximum productivity. Ideas meet realistic senses to produce tangible results."
            });
            gateBonus += 20;
        }

        const uYang = uSikSang + uBiGeop;
        const pYang = pSikSang + pBiGeop;
        if (Math.abs(uYang - pYang) > 25) {
            const lead = uYang > pYang ? "당신" : "상대방";
            const support = uYang > pYang ? "상대방" : "당신";
            gates.push({
                name: isKO ? "⚖️ [에너지 극성 조화] 추진체와 키잡이" : "⚖️ [Polarity Harmony] Lead and Support",
                desc: isKO ? "에너지의 역할 분담이 확실합니다. " + lead + "이(가) 폭발력을 뿜어내는 '엔진(추진체)'이라면, " + support + "은(는) 궤도를 다듬고 방향을 잡아주는 정밀한 '조향 장치(키잡이)'입니다." : "Clear energy roles. One is the engine, the other is the steering wheel."
            });
            gateBonus += 10;
        }
    }

    // Edge Cases (General)
    if (uStrong && pStrong) {
         gates.push({
            name: isKO ? "⚠️ [주도권 충돌] 팽팽한 줄다리기" : "⚠️ [Power Struggle] Strong Tugs",
            desc: isKO ? "둘 다 꺾이지 않는 강한 자아를 가졌습니다. 의견 대립 시 누구도 물러서지 않아 마찰이 커집니다. '먼저 져주는 지혜'가 이 관계를 살리는 구명조끼입니다." : "Both have unyielding strong egos. Learning to yield is the lifesaver here."
         });
         gatePenalty += 10;
    }

    if (uWeak && pStrong && isSameGender) {
        gates.push({
            name: isKO ? "⚠️ [과설기 주의보] 방전되는 파트너십" : "⚠️ [Over-Drain Warning]",
            desc: isKO ? "상대와 있으면 좋으면서도 묘하게 당신의 기운이 소진되고 지치는 느낌(Burn-out)을 받을 수 있습니다. 항상 연결되어 있기보단 적당한 혼자만의 '충전 시간'이 보장되어야 합니다." : "You may feel inexplicably drained. Maintaining appropriate distance for self-recharging is necessary."
        });
        gatePenalty += 5;
    }

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
    
    temp = Math.max(0, Math.min(100, temp));

    let finalScore = Math.floor(baseScore + gateBonus - gatePenalty);
    finalScore = Math.max(0, Math.min(100, finalScore));

    let resultText = "";
    if (isKO) {
        resultText += `두 분의 결합 텐션(Sync Score)은 ${finalScore}% 입니다.\n\n`;
        
        if (isSameGender) {
            resultText += `[관계 극성 (Bro/Sister Synergy)]\n서로의 에너지가 사회적 결속과 비즈니스 및 삶의 시너지를 내는 데 어떻게 부합하는지 분석합니다.\n\n`;
        } else {
            resultText += `[심리적/구조적 결합 (Dynamics)]\n이 만남은 서로의 부족한 에너지를 어떻게 채워주고, 넘치는 힘을 어떻게 조율하는가가 핵심입니다.\n\n`;
        }
        
        gates.forEach(g => {
            resultText += `[ ${g.name} ]\n${g.desc}\n\n`;
        });
        
        if (temp > 65) resultText += `🌡️ 온도계: [열정/스파크] 체온이 상승하는 열정적인 온도입니다. 하지만 작은 마찰이 큰 싸움으로 번질 수 있는 뜨거운 상태이니 열기를 식힐 여유가 필요합니다.\n\n`;
        else if (temp < 25) resultText += `🌡️ 온도계: [냉철/침착] 가끔 뼈가 시리듯 건조하게 느껴질 수 있습니다. 감정이 상했을 땐 불필요한 고집을 버리고 먼저 곁을 내어주는 따뜻함이 필수적입니다.\n\n`;
        else resultText += `🌡️ 온도계: [안온/평온] 가장 편안한 36.5도를 유지합니다. 함께 있을 때 계절의 극단 없이 조용히 스며드는 안락함을 느낄 수 있습니다.\n\n`;

        if (branchInteraction === 'chung' || branchInteraction === 'wonjin') {
            const getEl = (el: string) => (uElements[el] || 0) + (pElements[el] || 0);
            let needed = 'Fire';
            if (getEl('Wood') > 30 && getEl('Earth') > 30) needed = 'Fire';
            else if (getEl('Metal') > 30 && getEl('Wood') > 30) needed = 'Water';
            else if (getEl('Earth') > 30 && getEl('Water') > 30) needed = 'Metal';
            else if (getEl('Water') > 30 && getEl('Fire') > 30) needed = 'Wood';
            else if (getEl('Fire') > 30 && getEl('Metal') > 30) needed = 'Earth';
    
            let actionGuide = "";
            if (needed === 'Fire') {
                actionGuide = "논리적인 잘잘못을 따지기보다 스킨십이나 따뜻한 감정적 공감이 우선입니다. '많이 속상했겠다' 한마디가 충돌을 멈추는 마법의 열쇠입니다.";
            } else if (needed === 'Metal') {
                actionGuide = "감정의 파도를 막으려면 냉철한 룰과 선(Line)이 필요합니다. 각자의 영역을 명확히 하고, 문서화된 규칙이나 약속을 철저히 지키며 1보 후퇴하세요.";
            } else if (needed === 'Water') {
                actionGuide = "날카로운 대립 시, 그 자리에서 끝장 보려는 진지한 대화는 독입니다. 자리를 피해 바람을 쐬거나 주변 환경(공간)을 유연하게 바꿔 심리적 열기부터 식히세요.";
            } else if (needed === 'Wood') {
                actionGuide = "차가운 침묵이나 거리 두기보다는, 솔직하고 인간적인 성장의 대화가 필요합니다. 상대를 향한 아주 사소한 호의나 칭찬(부드러운 액션)을 먼저 던져보세요.";
            } else {
                actionGuide = "서로 좁혀지지 않는 평행선을 달릴 땐, 억지로 개조하려 하지 말고 현실적인 차이를 그대로 믿어주고 수용해 주는 '포용(흙)'만이 가장 훌륭한 해답입니다.";
            }
            resultText += `💡 [갈등 관리 Action Guide (통관신 전략)]\n두 사람 사이 미묘한 긴장감과 갈등 억제기가 필요할 땐 다음 솔루션을 꺼내세요:\n=> ${actionGuide}\n\n`;
        }

    } else {
        resultText += `Your relationship tension (Sync Score) is ${finalScore}%.\n\n`;
        if (isSameGender) {
            resultText += `[Social Bond (Bro/Sister Synergy)]\n`;
        }
        gates.forEach(g => {
            resultText += `[ ${g.name} ]\n${g.desc}\n\n`;
        });
    }

    const uniqueGates = Array.from(new Set(gates.map(g => g.name)))
         .map(name => gates.find(g => g.name === name)!);

    let relation = isKO ? "평범한 인연" : "Ordinary Companion";
    if (finalScore >= 85) relation = isKO ? "천생연분" : "Soulmates";
    else if (finalScore >= 70) relation = isKO ? "성장 파트너" : "Growth Partners";
    else if (finalScore >= 50) relation = isKO ? "현실적 동행" : "Practical Partners";
    else relation = isKO ? "숙제와 성찰" : "Task and Reflection";

    return {
        syncScore: finalScore,
        temperature: temp,
        relation,
        isGlowing: finalScore >= 85,
        text: resultText.trim(),
        isEasterEgg: false,
        gates: uniqueGates
    };
}
