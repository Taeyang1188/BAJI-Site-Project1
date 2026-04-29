import { ILJU_DATASET, getIljuData } from '../data/ilju-dataset';
import { BaZiResult, TimelineNarrative } from '../types';
import { STEM_ELEMENTS, BRANCH_ELEMENTS } from './bazi-engine';

const YUKHAP: Record<string, string> = { '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午' };
const CHUNG: Record<string, string> = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' };

export function generateRelationshipDynamics(
    result: BaZiResult,
    partnerResult: BaZiResult,
    currentDaewun: any,
    partnerAdjustedElements: any,
    temperature: number,
    lang: 'KO' | 'EN',
    partnerDaewun?: any
): TimelineNarrative {
    const getTopElement = (adjusted: any) => {
        if (!adjusted) return 'Wood';
        const sorted = Object.entries(adjusted).sort((a, b) => (b[1] as number) - (a[1] as number));
        return sorted[0][0];
    };

    const pStrongestEl = getTopElement(partnerAdjustedElements);
    const myFutureStemCore = STEM_ELEMENTS[currentDaewun.stem as keyof typeof STEM_ELEMENTS];
    let myFutureBranchCore = BRANCH_ELEMENTS[currentDaewun.branch as keyof typeof BRANCH_ELEMENTS];
    
    // YUKHAP and SAMHAP logic for relationship
    const myBranches = (result?.pillars || []).map((p: any) => p.branch);
    const dayBranch = result?.pillars?.find((p: any) => p.title === 'Day')?.branch || '寅';
    const dwBranch = currentDaewun.branch;
    const hapPair = dayBranch + dwBranch;
    const yukhapMap: Record<string, string> = {
        '子丑': 'Earth', '丑子': 'Earth',
        '寅亥': 'Wood', '亥寅': 'Wood',
        '卯戌': 'Fire', '戌卯': 'Fire',
        '辰酉': 'Metal', '酉辰': 'Metal',
        '巳申': 'Water', '申巳': 'Water',
        '午未': 'Fire', '未午': 'Fire'
    };
    
    let hapTransformed = false;
    let isSamHap = false;
    let samhapGroup: any = null;
    
    // Check SamHap / BanHap / BangHap
    const SAMHAP_GROUPS = [
        { branches: ['申', '子', '辰'], element: 'Water', name: '수국(삼합)' },
        { branches: ['寅', '午', '戌'], element: 'Fire', name: '화국(삼합)' },
        { branches: ['巳', '酉', '丑'], element: 'Metal', name: '금국(삼합)' },
        { branches: ['亥', '卯', '未'], element: 'Wood', name: '목국(삼합)' },
        { branches: ['亥', '子', '丑'], element: 'Water', name: '수국(방합)' },
        { branches: ['寅', '卯', '辰'], element: 'Wood', name: '목국(방합)' },
        { branches: ['巳', '午', '未'], element: 'Fire', name: '화국(방합)' },
        { branches: ['申', '酉', '戌'], element: 'Metal', name: '금국(방합)' }
    ];
    
    for (const group of SAMHAP_GROUPS) {
        if (group.branches.includes(dwBranch)) {
            const overlap = myBranches.filter((b: string) => group.branches.includes(b) && b !== dwBranch);
            if (overlap.length >= 1) { // BanHap / SamHap
                myFutureBranchCore = group.element;
                hapTransformed = true;
                isSamHap = true;
                samhapGroup = group;
                break;
            }
        }
    }

    if (!isSamHap && yukhapMap[hapPair]) {
        myFutureBranchCore = yukhapMap[hapPair];
        hapTransformed = true;
    }
    
    const myFutureElements = [myFutureStemCore, myFutureBranchCore].filter(Boolean);

    let narrative: TimelineNarrative = {
        title: lang === 'KO' ? "[관계성 환기] 미세한 템포의 변화" : "[Relationship Shift] Subtle Pacing Change",
        psychology: lang === 'KO' ? "대운의 기운이 변하면서 당신의 내면에도 미세한 동요와 새로운 기준이 세워집니다." : "As cycles change, subtle shifts in your inner standards occur.",
        interaction: lang === 'KO' ? "상대방과의 관계에서 기존의 역할이 조금씩 재편되고 있습니다. 예전에는 당연했던 것들이 다르게 느껴질 수 있습니다." : "Roles in the relationship subtly reorganize. What was natural feels different.",
        action_guide: lang === 'KO' ? "서로의 변화를 선입견 없이 관찰하고 새로운 리듬에 적응할 시간을 두세요." : "Observe without prejudice and allow time to adapt.",
        intensity: 0.5
    };

    const isKO = lang === 'KO';

    const matchTenGod = (tg: string, type: '관'|'재'|'식'|'인'|'비') => {
        if (!tg) return false;
        if (type === '관') return tg.includes('정관') || tg.includes('편관') || tg.includes('살');
        if (type === '재') return tg.includes('정재') || tg.includes('편재');
        if (type === '식') return tg.includes('식신') || tg.includes('상관') || tg.includes('식상');
        if (type === '인') return tg.includes('정인') || tg.includes('편인') || tg.includes('인성');
        if (type === '비') return tg.includes('비견') || tg.includes('겁재') || tg.includes('비겁');
        return false;
    };

    const uDMStem = result?.pillars?.find((p: any) => p.title === 'Day')?.stem || '甲';
    const pDMStem = partnerResult?.pillars?.find((p: any) => p.title === 'Day')?.stem || '甲';
    const uDMBranch = result?.pillars?.find((p: any) => p.title === 'Day')?.branch || '子';
    const pDMBranch = partnerResult?.pillars?.find((p: any) => p.title === 'Day')?.branch || '子';
    const isMountainSynergy = (uDMStem === '戊' || uDMStem === '己') && (pDMStem === '戊' || pDMStem === '己')
                          && ((uDMBranch === '寅' && pDMBranch === '午') || (uDMBranch === '午' && pDMBranch === '寅'));

    if (isMountainSynergy) {
         narrative.title = isKO ? "[거대한 공명] 두 개의 산이 하나로 합쳐지는 지각변동" : "[Massive Resonance] Two Mountains Merging";
         narrative.psychology = isKO ? "고독하게 서 있던 영토가 서로 맞닿으며, 심연부터 끓어오르는 거대한 지각변동을 경험합니다." : "Experience a massive tectonic shift as your territories touch.";
         narrative.interaction = isKO ? "결핍의 교환이 아닙니다. 두 개의 산이 하나로 연결되며, 내면의 용암(열정)이 서로의 산맥을 타고 걷잡을 수 없이 증폭되는 압도적인 시기입니다." : "An overwhelming period where your shared lava multiplies exponentially.";
         narrative.intensity = 0.99;
    } else if (isSamHap && samhapGroup?.element === 'Fire' && (pStrongestEl === 'Water' || pStrongestEl === 'Metal')) {
        narrative.title = isKO ? `[수화기제] 대운 ${samhapGroup.name}의 폭주를 막는 오아시스` : "[Water-Fire Perfect Balance]";
        narrative.psychology = isKO ? `사주 원국과 대운이 만나 거대한 ${samhapGroup.name}(火)을 형성하며 내면의 에너지가 걷잡을 수 없이 뜨거워지고 조급성(조열함)이 극대화됩니다.` : "Intense fire frame makes you passionate but restless.";
        narrative.interaction = isKO ? `화국(火局)으로 불타오르고 폭주할 뻔한 당신의 거친 템포를, 파트너의 강력한 수(水) 기운이 놀랍도록 평온하게 식혀주며 '수화기제(水火旣济)'의 압도적 시너지를 발휘합니다.` : "Your exploding fire frame is perfectly quenched by partner's water.";
        narrative.intensity = 0.98;
    } else if (isSamHap && samhapGroup?.element === 'Water' && (pStrongestEl === 'Fire' || pStrongestEl === 'Earth')) {
        narrative.title = isKO ? `[수화기제] 대운 ${samhapGroup.name}의 한파를 녹이는 불꽃` : "[Ice-Fire Perfect Balance]";
        narrative.psychology = isKO ? `사주 원국과 대운이 만나 거대한 ${samhapGroup.name}(水)을 형성하며 극도의 우울감이나 차갑고 이성적인 성향이 지배하게 됩니다.` : "Intense water frame makes you overly cold or depressed.";
        narrative.interaction = isKO ? `한파증(수국)에 시달릴 뻔한 당신을, 파트너의 따뜻하고 든든한 화/토(火/土) 기운이 부드럽게 감싸 안아 최적의 온도로 끌어올립니다.` : "Your freezing frame is perfectly warmed by partner's fire/earth.";
        narrative.intensity = 0.98;
    } else if (myFutureElements.includes('Fire') && (pStrongestEl === 'Water' || pStrongestEl === 'Metal')) {
        narrative.title = isKO ? "[조후 보완] 얼어붙은 현실에 뜬 태양" : "[Warmth] Sun Rising on Frozen Ground";
        narrative.psychology = isKO ? "날카롭거나 차가웠던 당신의 마음에 상대와 세상을 넉넉히 품을 수 있는 화(火)의 온기가 차오릅니다." : "Warmth fills your mind, shedding past sharp or cold energies.";
        narrative.interaction = isKO ? `차가운 현실(금/수)에 치여 감정이 메말라가는 상대에게 당신은 가장 필요한 온기를 주는 '유일한 안식처'가 됩니다. 예전엔 당신이 냉정함에 상처를 받기도 했다면, 이제는 감정적으로 그를 단숨에 무장해제 시켜버리는 주도권을 쥡니다.` : `You become the emotional safe haven for your cold/realistic partner.`;
        narrative.intensity = 0.9;
    } else if (myFutureElements.includes('Metal') && pStrongestEl === 'Wood') {
        narrative.title = isKO ? "[전지(剪枝) 작용] 얽힌 가지를 쳐내는 해결사" : "[Pruning] The Clear Resolver";
        narrative.psychology = isKO ? "복잡했던 생각들이 예리한 금(金)의 기운을 만나 명확히 정리되며, 강단과 결단력이 생깁니다." : "Complex thoughts are cleared by sharp Metal energy; decisiveness takes holding.";
        narrative.interaction = isKO ? `생각이 많고 뻗어나가기만 하는 압박감 속에 사는 상대(목)에게 당신은 눈앞을 맑게 해주는 '해결사'입니다. 예전엔 그의 복잡함에 당신마저 휩쓸렸다면, 이제는 확실한 선을 긋고 리드하게 됩니다.` : `You prune their overthinking Wood energy, providing clear direction.`;
        narrative.intensity = 0.85;
    } else if (myFutureElements.includes('Earth') && pStrongestEl === 'Water') {
        narrative.title = isKO ? "[제방(堤防) 역할] 요동치는 감정의 방파제" : "[Breakwater] Shielding the Emotional Waves";
        narrative.psychology = isKO ? "불안정했던 마음들이 단단한 토(土)의 기운을 만나 굳건하게 뿌리를 내리며 여유를 찾습니다." : "Your unsteady mind finds grounding in Earth, rooting deeply.";
        narrative.interaction = isKO ? `비현실적이고 정처 없이 요동치는 상대방의 감정(수) 밑바탕에 당신의 굳건한 신념이 '방파제'가 되어줍니다. 파동치던 상대는 당신의 묵직함에서 연애를 넘어선 강한 소속감을 느낍니다.` : `Your solid Earth provides a breakwater for their restless Water energy.`;
        narrative.intensity = 0.85;
    } else if (hapTransformed && myFutureElements.includes('Wood') && (pStrongestEl === 'Water' || pStrongestEl === 'Metal')) {
        narrative.title = isKO ? "[조후의 급랭] 합(合)이 불러온 차가운 거리감" : "[Rapid Cooling] Distance from Transformation";
        narrative.psychology = isKO ? "일지와 대운의 결합(육합)으로 성질이 변하면서, 상대를 향한 감정적 기대치가 갑작스럽게 냉정하게 가라앉습니다." : "Transformation in your elements leads to emotional cooling.";
        narrative.interaction = isKO ? `상대방의 차가운 금/수(金/水) 기운이 당신의 변화된 기운과 맞물리며 '조후의 급랭(결빙)' 현상을 일으킵니다. 열정적이었던 관계가 갑자기 이성적이고 서늘한 텐션으로 전환될 수 있습니다.` : `Metal/Water of your partner meets your transformed energy, creating a sudden cooling effect in the relationship.`;
        narrative.intensity = 0.9;
    } else if (myFutureElements.includes('Water') && (pStrongestEl === 'Water' || pStrongestEl === 'Metal')) {
        narrative.title = isKO ? "[조후의 급랭] 뼈를 에이는 심리적 결빙" : "[Rapid Cooling] Freezing Tension";
        narrative.psychology = isKO ? "물과 물, 금과 물이 만나 세상의 온도를 얼려버릴 듯한 극단적인 이성주의와 방어기제가 작동합니다." : "Extreme rationality and defense mechanisms activate like freezing ice.";
        narrative.interaction = isKO ? `서로의 날카롭고 차가운 기운(금/수)이 증폭되어 '조후의 급랭' 현상이 일어납니다. 사소한 서운함이 싸늘한 벽으로 변하기 쉬운 때이므로, 따뜻한 안부와 물리적인 거리 유지가 약이 됩니다.` : `Cold energies amplify, creating an emotional freeze. Small distances can become cold walls.`;
        narrative.intensity = 0.95;
    } else if (myFutureElements.includes('Water') && pStrongestEl === 'Fire') {
        narrative.title = isKO ? "[진정 작용] 타오르는 불길을 다스리다" : "[Calming] Soothing the Raging Fire";
        narrative.psychology = isKO ? "겉으로 발산하기만 하던 당신이 깊은 수(水)의 통찰력을 덧입어 내면 깊은 곳을 성찰하고 유연해집니다." : "You learn flexibility and introspection through Water's depth.";
        narrative.interaction = isKO ? `폭발적이고 조급한 상대(화)를 당신의 차분하고 서늘한 에너지가 감싸 안습니다. 쉼 없이 밖으로 치닫던 상대가 당신 곁에서 비로소 호흡을 고르고 안식을 청하게 됩니다.` : `Your calm Water energy pacifies their explosive Fire, offering rest.`;
        narrative.intensity = 0.85;
    } else if (myFutureElements.includes('Wood') && pStrongestEl === 'Earth') {
        narrative.title = isKO ? "[소생(蘇生)] 황무지에 생명력을 심다" : "[Revival] Planting Roots in Wasteland";
        narrative.psychology = isKO ? "성장과 시작의 기운인 목(木)이 들어오며 머뭇거렸던 당신에게 앞으로 나아갈 강력한 동기가 부여됩니다." : "Wood energy brings motivation and the courage to start anew.";
        narrative.interaction = isKO ? `현실에 안주하거나 답답하게 굳어있던 상대(토)에게 당신의 진취적인 성향이 파격적인 자극이 됩니다. 멈춰있던 상대를 일으켜 세워 함께 뛰게 만드는 구심점이 됩니다.` : `Your proactive Wood drives and stimulates the conservative Earth partner.`;
        narrative.intensity = 0.8;
    } else {
        const getElements = (detailObj: any) => detailObj?.element ? detailObj.element.split(',').map((s: string) => s.trim()) : [];
        const myYongHee = [...getElements(result.analysis?.yongshinDetail?.primary), ...getElements(result.analysis?.yongshinDetail?.heeShin)].filter(Boolean) as string[];
        const dmStem = result?.pillars?.find((p: any) => p.title === 'Day')?.stem || '甲';
        const daewunStem = currentDaewun.stem;
        const isStemHap = (
            (dmStem === '甲' && daewunStem === '己') || (dmStem === '己' && daewunStem === '甲') ||
            (dmStem === '乙' && daewunStem === '庚') || (dmStem === '庚' && daewunStem === '乙') ||
            (dmStem === '丙' && daewunStem === '辛') || (dmStem === '辛' && daewunStem === '丙') ||
            (dmStem === '丁' && daewunStem === '壬') || (dmStem === '壬' && daewunStem === '丁') ||
            (dmStem === '戊' && daewunStem === '癸') || (dmStem === '癸' && daewunStem === '戊')
        );

        if (isStemHap && ((dmStem === '丙' && daewunStem === '辛') || (dmStem === '辛' && daewunStem === '丙'))) {
            narrative.title = isKO ? "[병신합: 정서적 결합과 정착]" : "[Bing-Xin Hap: Emotional Settlement]";
            narrative.psychology = isKO ? "강렬하게 끌리는 대상(결실)에게 마음이 묶이는 시기입니다. 바람 같던 에너지가 안정되고 싶어 하는 정착 심리가 지배적입니다." : "A period of emotional settlement where your free-spirited energy seeks stability.";
            narrative.interaction = isKO ? "과거엔 결핍을 채우기 위해 방황했다면, 이제는 파트너라는 확고한 목적지(정재)에 이끌려 진지한 책임감을 느끼고 관계에 깊이 뿌리를 내리려 합니다." : "You feel a deep sense of responsibility and root yourself in the relationship.";
            narrative.intensity = 0.95;
        } else if (isStemHap) {
            narrative.title = isKO ? "[천간합: 강렬한 끌림과 몰입]" : "[Stem Hap: Intense Attraction]";
            narrative.psychology = isKO ? "운의 흐름이 나의 자아(일간)와 강하게 결합(천간합)하며, 특정 대상이나 목표에 강렬하게 이끌리고 몰입하게 되는 시기입니다." : "Intense attraction and immersion due to celestial stem transformation.";
            narrative.interaction = isKO ? "이성적 통제를 넘어서 서로에게 자석처럼 끌리는 역동성이 발생합니다. 마음이 단단히 묶이는 듯한 강한 유대감을 형성하게 됩니다." : "Dynamic magnetic attraction forms a strong, binding bond.";
            narrative.intensity = 0.9;
        } else if (myYongHee.includes(myFutureStemCore) || myYongHee.includes(myFutureBranchCore)) {
            narrative.title = isKO ? "[나를 찾는 여정] 자존감의 회복과 주체적 애착" : "[Journey to Self] Rising Self-Esteem";
            narrative.psychology = isKO ? "나의 중심을 굳건히 다지는 기운이 들어와, 타인에게 의존하던 마음을 비우고 오롯이 홀로 설 수 있는 강한 자존감을 되찾습니다." : "You regain strong self-esteem, discarding dependency as your core elements awake.";
            narrative.interaction = isKO ? "과거엔 결핍을 채우기 위해 맹목적으로 의존했다면, 이제는 나만의 단단한 중심을 잃지 않으면서도 파트너와 대등하게 교감하는 진정한 '동반자'로 격상됩니다." : "You upgrade to a true partner who deeply connects without losing your own solid center.";
            narrative.intensity = 0.75;
        }
    }

    // TEMPERATURE ACTION GUIDE (Combine with the above)
    if (temperature >= 45) {
        narrative.action_guide = isKO 
            ? "🔥 현재 두 분의 온도가 폭발적으로 상승해 '열정적 과부하' 상태입니다. 서로를 강하게 원하지만 그만큼 숨이 막힐 수 있으니, 각자의 독립된 시간(방)을 보장해주는 것이 이 시기의 최고 개운법입니다." 
            : "🔥 Your relationship temperature is very high. Maintain personal space to prevent 'passionate overload'.";
    } else if (temperature >= 35) {
        narrative.action_guide = isKO
            ? "🌡️ 이상적이고 따뜻한 온도입니다. 갑작스러운 변화 없이 지금처럼 서로의 달라진 템포를 편견 없이 응원해 주세요."
            : "🌡️ The temperature is stable. Keep observing each other's pacing changes without prejudice.";
    } else {
        narrative.action_guide = isKO
            ? "❄️ 온도가 다소 서늘하게 얼어붙어 있습니다. 지나치게 이성적인 분석은 멈추고, 스킨십이나 감동적인 대화를 의도적으로 늘려 훈기를 불어넣어야 합니다."
            : "❄️ The temperature is quite low. Consciously add warmth through small gestures and affectionate conversations.";
    }

    // HAP / CHUNG interactions with day branch
    const partnerDayBranch = partnerResult.pillars[1]?.branch || '';
    const dBranch = currentDaewun.branch;

    if (partnerDayBranch && YUKHAP[dBranch] === partnerDayBranch) {
        narrative.title += isKO ? ' ⚡(운명적 끌림)' : ' ⚡(Karmic Pull)';
        narrative.interaction += isKO ? ` 특히 당신의 대운과 상대의 가장 내밀한 본성(일지)이 완벽하게 결합(合)되어, 거부할 수 없는 짜릿한 목표와 설렘이 덤으로 싹틉니다.` : ` Your phase intensely combines with their core, sparking an irresistible connection.`;
        narrative.intensity = Math.min(1.0, narrative.intensity + 0.15);
    } else if (partnerDayBranch && CHUNG[dBranch] === partnerDayBranch) {
        narrative.title += isKO ? ' 🌪️(성장의 마찰)' : ' 🌪️(Friction of Growth)';
        narrative.interaction += isKO ? ` 이 변화 과정에서 상대의 기존 패턴과 잦은 충돌(衝)이 빚어질 수 있지만, 이를 피하지 마세요. 거친 마찰음 뒤에 서로의 묵은 껍질이 벗겨지고 폭발적인 관계로 도약할 것입니다.` : ` Clashes cause friction, but it serves to break old shells and fuel explosive growth.`;
        narrative.intensity = Math.min(1.0, narrative.intensity + 0.15);
    }

    // OVERLAP LOGIC (과도기 완충)
    const currentYear = new Date().getFullYear();
    const isTransition = Math.abs(currentDaewun.year - currentYear) <= 2;
    if (isTransition) {
        narrative.psychology = isKO 
            ? `[과도기적 혼란] 대운이 막 교차하는 시기입니다. 묵은 기운과 새로운 기운이 충돌하며 내면에 복잡미묘한 감정 기복이 일어날 수 있습니다. 하지만 이는 점진적인 환승 구간이니 자연스럽게 받아들이세요. ${narrative.psychology}` 
            : `[Transition Phase] Cycles are overlapping. You may feel mixed energies. ${narrative.psychology}`;
    }

    
    if (partnerDaewun && partnerResult) {
        const STEM_ELEMENTS: any = { '甲':'Wood', '乙':'Wood', '丙':'Fire', '丁':'Fire', '戊':'Earth', '己':'Earth', '庚':'Metal', '辛':'Metal', '壬':'Water', '癸':'Water', 'Jia':'Wood', 'Yi':'Wood', 'Bing':'Fire', 'Ding':'Fire', 'Wu':'Earth', 'Ji':'Earth', 'Geng':'Metal', 'Xin':'Metal', 'Ren':'Water', 'Gui':'Water', 'Xin (Metal)':'Metal', 'Xin(Metal)':'Metal' };
        const BRANCH_ELEMENTS: any = { '子':'Water', '丑':'Earth', '寅':'Wood', '卯':'Wood', '辰':'Earth', '巳':'Fire', '午':'Fire', '未':'Earth', '申':'Metal', '酉':'Metal', '戌':'Earth', '亥':'Water', 'Zi':'Water', 'Chou':'Earth', 'Yin':'Wood', 'Mao':'Wood', 'Chen':'Earth', 'Si':'Fire', 'Wu':'Fire', 'Wei':'Earth', 'Shen':'Metal', 'You':'Metal', 'Xu':'Earth', 'Hai':'Water' };
        
        let actualStem = partnerDaewun.stem;
        let actualBranch = partnerDaewun.branch;
        
        if (actualStem === '辛' || actualStem === 'Xin') actualStem = '辛';
        if (actualBranch === '酉' || actualBranch === 'You') actualBranch = '酉';
        
        const pDaewunStemEl = STEM_ELEMENTS[actualStem] || partnerDaewun.element || 'Wood';
        const pDaewunBranchEl = BRANCH_ELEMENTS[actualBranch] || partnerDaewun.element || 'Wood';
        
        const yongshinDetail = partnerResult?.analysis?.yongshinDetail || {};
        const pYongHeeStr = [yongshinDetail.primary?.element || '', yongshinDetail.heeShin?.element || ''].join(',');
        const pGiGuStr = [yongshinDetail.giShin?.element || '', yongshinDetail.guShin?.element || ''].join(',');
        
        const branchIsUnlucky = pGiGuStr.includes(pDaewunBranchEl);
        const stemIsLucky = pYongHeeStr.includes(pDaewunStemEl);

        const getEnvText = (tenGod: string, element: string, isUnlucky: boolean) => {
            if (matchTenGod(tenGod, '관')) return isUnlucky ? `무거운 책임과 규칙을 강요받는 척박한 압박의 무대(${element})` : `사회적 인정과 지위를 구축할 준비가 된 안정적인 무대(${element})`;
            if (matchTenGod(tenGod, '재')) return isUnlucky ? `극심한 생존과 효율을 쫓아야만 하는 냉혹한 결과의 도마 위(${element})` : `현실적인 이득과 자산을 눈앞에 둔 매력적인 성취의 무대(${element})`;
            if (matchTenGod(tenGod, '식')) return isUnlucky ? `쉴 새 없이 에너지를 착취당하며 흔들리는 불안정한 무대(${element})` : `자신의 역량을 마음껏 뽐내고 활동 반경을 넓힐 수 있는 자유의 공간(${element})`;
            if (matchTenGod(tenGod, '인')) return isUnlucky ? `과거에 머물러 현실 감각이 단절된 방어적인 고립의 무대(${element})` : `내면의 안식과 깊은 학문적 평안을 얻을 수 있는 수용의 무대(${element})`;
            if (matchTenGod(tenGod, '비')) return isUnlucky ? `치열한 경쟁자와 마찰이 난무하는 생존 투쟁의 무대(${element})` : `나의 고유한 영토를 부양하고 조력자가 나타나는 지지적 토대(${element})`;
            return `변화무쌍한 현실의 시험대(${element})`;
        };

        const getAttText = (tenGod: string, element: string, isLucky: boolean) => {
            const elDesc = element === 'Metal' ? 'Metal: certainty/decision' : (element === 'Wood' ? 'Wood: will/growth' : element);
            if (matchTenGod(tenGod, '관')) return `엄격한 규칙과 이성적 통제력을 앞세워 상황을 지배하려는 주체적 결단력(${elDesc})`;
            if (matchTenGod(tenGod, '재')) return `철저한 손익 계산에 맞춰 빠르고 매몰차게 결론을 내려는 결과 지향적 본능(${elDesc})`;
            if (matchTenGod(tenGod, '식')) return `억눌림 없이 자신의 날것의 감정과 가치관을 거침없이 피력하려는 의지(${elDesc})`;
            if (matchTenGod(tenGod, '인')) return `관계에 섣불리 뛰어들지 않고 본인만의 깊은 생각과 정신적 안식처를 찾으려는 통찰력(${elDesc})`;
            if (matchTenGod(tenGod, '비')) return `타인의 개입을 차단하고 오직 자신의 강력한 고집만을 관철하려는 주관(${elDesc})`;
            return `숨겨진 자아를 드러내려는 본능(${elDesc})`;
        };

        const envTextKo = getEnvText(partnerDaewun.branchTenGodKo || '', pDaewunBranchEl, branchIsUnlucky);
        const attTextKo = getAttText(partnerDaewun.stemTenGodKo || '', pDaewunStemEl, stemIsLucky);

        let synthesisKo = `**${envTextKo}**라는 환경 속에서, 어떻게든 **${attTextKo}**를 사수하려 방어적이고 고독한 투쟁을 이어가고 있습니다.`;
        if (stemIsLucky) {
             synthesisKo = `철저한 **${envTextKo}** 위에서, 오히려 이를 무대 삼아 폭발적으로 **${attTextKo}**를 현실로 관철하려는 압도적 기세를 보이고 있습니다.`;
        }
        synthesisKo = `상대방의 [${actualStem}${partnerDaewun.branch} 대운] 시기입니다. 지금 상대방은, ` + synthesisKo;

        const checkRootless = (stemEl: string, branchEl: string) => {
             const clashPairs = ['Wood-Metal', 'Fire-Water', 'Earth-Wood', 'Metal-Fire', 'Water-Earth']; // Branch destroys Stem
             return clashPairs.includes(`${stemEl}-${branchEl}`);
        };
        const isRootless = checkRootless(pDaewunStemEl, pDaewunBranchEl);
        
        let edgeTextKo = "";
        if (isRootless) {
             edgeTextKo = ` 다만 현실(지지)의 칼날이 너무 날카로워, 이 같은 주체적 다짐이 머릿속에 맴돌 뿐 아직 유연한 실천력으로 뻗어 나오진 못하고 약간 지쳐있는 상태일 수 있습니다. `;
        } else if (pDaewunStemEl === pDaewunBranchEl) {
             edgeTextKo = ` 천간과 지지가 동일한 강한 기운(간여지동)으로 들어와, 이 시기의 상대방은 외부의 주장에 절대 꺾이지 않는 돌격전차와 같습니다. 억지로 설득하려 하지 마세요.`;
        }

        if (lang === 'KO') {
            narrative.psychology += `\n\n👉 [상대의 타이밍 읽기: 딥 로직 분석]\n참고로 ${synthesisKo}${edgeTextKo} 상대방과 당신 사이의 '동상이몽'을 꿰뚫어 보고, 이타적인 포용력을 발휘하는 것이 이번 대운 동안의 관계 역동성에서 결정적인 역할을 하게 될겁니다.`;
        } else {
            narrative.psychology += `\n\n👉 [Reading the Partner]\nInterestingly, your partner currently faces a foundational shift. Your partner is trying to assert a new attitude against the current reality. Understanding this tension will be the key to your relationship over this cycle.`;
        }
    }

    return narrative;
}

export function generateIndividualTimelineBriefing(
    result: any,
    currentDaewun: any,
    adjustedElements: any,
    lang: 'KO' | 'EN',
    isPast: boolean,
    isFuture: boolean,
    sliderIndex?: number
): string {
    const isKO = lang === 'KO';
    
    // Base Structure
    const dayMaster = result?.pillars?.find((p: any) => p.title === 'Day')?.stem || '甲';
    const STEM_ELEMENTS: any = { '甲':'Wood', '乙':'Wood', '丙':'Fire', '丁':'Fire', '戊':'Earth', '己':'Earth', '庚':'Metal', '辛':'Metal', '壬':'Water', '癸':'Water' };
    const BRANCH_ELEMENTS: any = { '子':'Water','丑':'Earth','寅':'Wood','卯':'Wood','辰':'Earth','巳':'Fire','午':'Fire','未':'Earth','申':'Metal','酉':'Metal','戌':'Earth','亥':'Water' };
    
    const dmElement = STEM_ELEMENTS[dayMaster] || 'Wood';
    const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIdx = cycle.indexOf(dmElement);
    
    const daewunBranch = currentDaewun?.branch || '子';
    const daewunBranchEl = BRANCH_ELEMENTS[daewunBranch] || 'Water';
    const targetIdx = cycle.indexOf(daewunBranchEl);
    
    const dayBranch = result?.pillars?.find((p: any) => p.title === 'Day')?.branch || '寅';
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

    const diff = finalDiff;
    
    const tenGodsKo = ['비겁(견고/투쟁)', '식상(표현/결과)', '재성(실리/소유)', '관성(압박/명예)', '인성(수용/정지)'];
    const tenGodsEn = ['Companion', 'Expression', 'Wealth', 'Power', 'Resource'];
    
    const tenGodRoleKo = tenGodsKo[diff];
    const tenGodRoleEn = tenGodsEn[diff];

    const isStrong = result?.analysis?.shinGangShinYak?.isStrong;
    
    let timePrefix = "";
    if (isKO) {
        timePrefix = isPast ? "[과거 대운] " : (isFuture ? "[미래 대운] " : "[현재 대운: 운명의 중심점] ");
    } else {
        timePrefix = isPast ? "[Past Phase] " : (isFuture ? "[Future Phase] " : "[Current Phase: Center of Destiny] ");
    }

    let narrative = timePrefix + "\n\n";
    if (isKO && formsHap && hapTransformed) {
        const originalTenGod = tenGodsKo[originalDiff].split('(')[0];
        const newTenGod = tenGodsKo[finalDiff].split('(')[0];
        narrative += `[숨겨진 역동성: 합(合)의 함정] 겉보기에는 '${originalTenGod}'의 운으로 다가오지만, 당신의 일지(${dayBranch})와 대운(${daewunBranch})이 강력하게 결합하여(육합), 결과적으로 '${newTenGod}'의 성질로 완전히 변질됩니다. ${(originalTenGod === '재성' && newTenGod === '관성') ? '예컨대 돈과 이익을 쫓았으나, 결국 막중한 책임감이나 압박으로 둔갑하게 되는 특수한 시기입니다.' : '당초 기대했던 사건의 방향성이 전혀 다른 결실로 이어지게 되는 특수한 시기입니다.'}\n\n`;
    }

    if (isKO) {
        if (!isPast && !isFuture) {
           // CURRENT DAEWUN LOGIC (Compare with Previous)
           let prevDaewunStr = "";
           let prevDaewunDiff = -1;
           if (sliderIndex !== undefined && sliderIndex > 0) {
               const prevDaewun = result.grandCycles[sliderIndex - 1];
               const prevBranch = prevDaewun.branch;
               const BRANCH_ELEMENTS: any = { '子':'Water','丑':'Earth','寅':'Wood','卯':'Wood','辰':'Earth','巳':'Fire','午':'Fire','未':'Earth','申':'Metal','酉':'Metal','戌':'Earth','亥':'Water' };
               const prevEl = BRANCH_ELEMENTS[prevBranch] || 'Wood';
               const prevIdx = cycle.indexOf(prevEl);
               prevDaewunDiff = (prevIdx - dmIdx + 5) % 5;
           }

                      let pastTenGod = prevDaewunDiff !== -1 ? tenGodsKo[prevDaewunDiff].split('(')[0] : "알 수 없는 기운";
           let currentTenGod = tenGodRoleKo.split('(')[0];

           if (pastTenGod === currentTenGod) {
               narrative += `[과거와의 연장선] 지난 대운부터 이어온 '${pastTenGod}'의 테마가 이제는 온전히 무르익어 절정에 달하고 있습니다. `;
               narrative += `당신의 명식 구조에 잠복해 있던 공기가 한층 짙어지며, '${currentTenGod}' 기운이 지배하게 됩니다.\n\n`;
           } else {
               narrative += `[과거와의 결별] 당신을 짓누르고 방황하게 했던 이전 패러다임이 끝나고, 이제는 국면이 완전히 뒤바뀌었습니다. `
               narrative += `당신의 안착부를 장악했던 불필요한 공기가 걷히고, 이제부터는 '${currentTenGod}' 기운이 주도권을 쥐게 됩니다.\n\n`;
           }

           const featuresStr = (result?.analysis?.balanceWarnings || []).map((w: any) => w.title).join(' ');
           let interpretation = "";

           const strScore = result?.analysis?.dayMasterStrength?.score ?? result?.analysis?.strength?.score ?? 50;
           let strengthStr = "";
           if (strScore >= 75) strengthStr = "극신강(가장 굳건하고 강건한 자아)";
           else if (strScore >= 60) strengthStr = "신강(확고하고 자립적인 자아)";
           else if (strScore >= 55) strengthStr = "중화신강(안정적이고 다소 능동적인 자아)";
           else if (strScore >= 45) strengthStr = "중화(유연하고 균형 잡힌 자아)";
           else if (strScore >= 40) strengthStr = "중화신약(부드럽지만 방어적인 자아)";
           else if (strScore >= 25) strengthStr = "신약(조심스럽고 수용성이 높은 자아)";
           else strengthStr = "극신약(외부의 흐름에 무의식적으로 순응하는 섬세한 자아)";

           if (featuresStr.includes("관살") || featuresStr.includes("관성")) {
               if (currentTenGod === '식상') {
                   interpretation = `내면의 관살(압박, 통제)이 당신을 옥죄던 상황에서, 마침내 그것을 쳐낼 예리한 무기(상관/식신)를 손에 쥐었습니다. 참는 자가 이기는 시대는 끝났습니다. 이제는 나의 목소리를 내어 현실의 유리천장을 깨고 주도권을 되찾는 역동의 시기입니다.`;
               } else if (currentTenGod === '재성') {
                   interpretation = `일만 하고 성과는 보이지 않던 시야가 트입니다. 그간 쌓아온 관살(책임)의 하중이 재성(현실적 결실)으로 치환되어 손에 잡히는 수확이 생깁니다. 단, 재성이 관성을 더욱 무겁게 할 수 있으니 무리한 확장보다 확실한 내실 다지기에 집중하세요.`;
               } else {
                   interpretation = `당신을 둘러싼 과도한 통제력(관살)에 또 다른 ${currentTenGod} 기운이 더해졌습니다. 무게중심이 옮겨가는 과도기입니다. 섣불리 틀을 부수려 하기보단 뿌리를 내리는 깊이 있는 통찰이 요구됩니다.`;
               }
           } else if (featuresStr.includes("재다") || featuresStr.includes("재성")) {
               if (currentTenGod === '비겁' || currentTenGod === '인성') {
                   interpretation = `흔들리던 현실의 기반을 단단히 붙잡아줄 든든한 방패를 얻었습니다. 헛돌던 에너지는 폭주를 멈추고 온전히 나의 자산으로 안착할 것입니다.`;
               } else {
                   interpretation = `끝없는 현실적 욕망과 갈증에 불을 지피는 ${currentTenGod} 기운이 지배하고 있습니다. 지금 당신이 쥐어야 할 것은 넓은 바다가 아니라 길을 잃지 않을 나침반입니다.`;
               }
           } else {
               interpretation = `현실적 엔진이 새롭게 가동됩니다. 타인과 세상에 섬세하게 반응하던 당신의 [${strengthStr}] 바탕 위에 ${currentTenGod} 기운이 전면으로 나서 삶의 축을 세워나갑니다. 과거의 불안을 뒤로하고 안정적으로 자기 확신을 채워나갈 중요한 전환점입니다. 서두르지 말고 자신의 원래 페이스를 되찾는 것에 집중하세요.`;
           }
           
           

           narrative += `[현재의 역동] ${interpretation}\n\n`;
           
           // Calculate Temp/Heat to give [실전 개운법]
           const calculateHeat = (ratios: any) => {
               if (!ratios) return 0;
               let heat = 0;
               Object.entries(ratios).forEach(([k, v]) => {
                   const el = typeof k === 'string' ? k.split('(')[0].trim() : 'Wood';
                   const val = v as number;
                   if (el === 'Fire') heat += val * 1.5;
                   else if (el === 'Wood') heat += val * 0.5;
                   else if (el === 'Water') heat -= val * 1.5;
                   else if (el === 'Metal') heat -= val * 0.5;
               });
               return heat; 
           };
           let temp = 36.5 + (calculateHeat(adjustedElements) * 0.2);
           temp = Math.max(0, Math.min(100, temp));
           
           let actionGuide = "";
           if (temp > 65) actionGuide = "현재 사주의 온도가 치솟고 있습니다. 과열된 감정이나 급진적인 무리수보다, 스스로 열기를 식힐 수 있는 서늘하고 이성적인 판단이 가장 훌륭한 개운액션입니다.";
           else if (temp < 15) actionGuide = "온도가 크게 낮아져 냉기가 돌고 있습니다. 지금 당장 성과를 재촉하기보다는, 마음을 데우고 인간적인 유대와 열정을 서서히 끌어올리며 내실을 쌓아야 합니다.";
           else actionGuide = "현재 에너지가 최상의 온도 밸런스를 향해 움직이고 있습니다. 치우침 없는 현재의 페이스를 마음껏 누리며, 두려움 없이 액셀러레이터를 밟아도 좋습니다.";

           narrative += `[실전 개운법] ${actionGuide}`;

        } else {
            // PAST OR FUTURE LOGIC
            let interpretation = "";
            const featuresStr = (result?.analysis?.balanceWarnings || []).map((w: any) => w.title).join(' ');
            
            if (featuresStr.includes("관살") || featuresStr.includes("관성")) {
                if (diff === 3 || diff === 2) { 
                    interpretation = `자신을 억누르던 외부의 통제력과 책임감(${tenGodRoleKo})이 최고조에 달합니다. 사회적 압박이 심화되는 만큼 독립적인 숨통을 트는 것이 최우선입니다.`;
                } else if (diff === 0 || diff === 1) {
                    interpretation = `무거운 압박감을 벗어던지고 온전한 나의 목소리(${tenGodRoleKo})를 내며 해방되는 시기입니다. 억눌림에서 벗어나 당신만의 강한 궤도를 개척합니다.`;
                } else {
                    interpretation = `오행의 변화가 ${tenGodRoleKo}으로 작용하며, 삶의 무게를 수용하고 내면을 단단히 다지게 됩니다.`;
                }
            } else if (featuresStr.includes("재다") || featuresStr.includes("재성")) {
                 if (diff === 0 || diff === 4) {
                     interpretation = `흔들리던 현실의 기반을 단단히 붙잡아줄 든든한 ${tenGodRoleKo} 기운이 들어옵니다. 그토록 원했던 주도권을 쟁취하게 될 것입니다.`;
                 } else {
                     interpretation = `물질적, 현실적 결과(${tenGodRoleKo})에 대한 갈망이 커집니다. 과도한 확장을 경계하고 실속을 차리는 전략이 필요합니다.`;
                 }
            } else {
                 if (isStrong) {
                     if (diff === 1 || diff === 2 || diff === 3) {
                         interpretation = `넘치는 에너지를 사회적으로 배출하고 결실을 맺는 ${tenGodRoleKo} 기운이 강력하게 작용하여, 마침내 잠재력을 터뜨리는 시기입니다.`;
                     } else {
                         interpretation = `이미 강한 자아에 ${tenGodRoleKo} 에너지가 더해져 강한 주도권을 쥐지만, 독단에 빠지지 않도록 유연함을 의식해야 합니다.`;
                     }
                 } else {
                     if (diff === 0 || diff === 4) {
                         interpretation = `부족했던 자신감을 굳건히 세워주는 ${tenGodRoleKo} 기운이 들어와 세상의 풍파에 맞설 수 있는 강력한 무기가 생깁니다.`;
                     } else {
                         interpretation = `현실적인 목표와 책임감(${tenGodRoleKo})이 무겁게 다가오는 압박 구간입니다. 거친 파도를 타며 버티는 내성을 길러야 합니다.`;
                     }
                 }
            }

            narrative += `당신의 명식에 ${tenGodRoleKo} 대운이 지배적으로 작용하고 있습니다.\n\n`;
            narrative += `[심리 역학] ${interpretation}\n`;
            
            if (!isPast) {
                 narrative += `[실전 지침] 주어진 상황에 무력하게 타협하지 마세요. 불필요한 마찰을 줄이고 운의 주도권을 장악해야 합니다.`;
            }
        }
    } else {
        narrative += `During this phase, the ${tenGodRoleEn} energy assumes the leading role in your chart.\n\n`;
        if (!isPast && !isFuture) {
             narrative += `[Phase Shift] Moving from the previous cycle, the shift heavily impacts your structural balance.\n\n`;
        }
        narrative += `[Phase Flow] The dynamic shift highly influences your path. Evaluate where this energy pushes you, and balance the tension intentionally.\n`;
    }

    const dStem = result?.pillars?.find((p: any) => p.title === 'Day')?.stem || '甲';
    const dBranch = result?.pillars?.find((p: any) => p.title === 'Day')?.branch || '寅';
    const iljuInfo = getIljuData(dStem, dBranch);

    if (isKO) {
        if (iljuInfo) {
            const daewunBranchElement = (BRANCH_ELEMENTS[currentDaewun?.branch || '子'] || 'Wood').toLowerCase() as 'wood' | 'fire' | 'earth' | 'metal' | 'water';
            let timingMod = iljuInfo.narrative_blocks.timing_modifiers?.[daewunBranchElement];
            if (!timingMod) {
                  timingMod = iljuInfo.narrative_blocks.timing_modifier;
            }
            const timingModText = timingMod ? timingMod.ko : '이번 사이클에서의 역동적인 흐름에 주목하십시오.';
            narrative += `\n\n[운명의 화학식] ${timingModText}`;
        }
    } else {
        if (iljuInfo) {
            const daewunBranchElement = (BRANCH_ELEMENTS[currentDaewun?.branch || '子'] || 'Wood').toLowerCase() as 'wood' | 'fire' | 'earth' | 'metal' | 'water';
            let timingMod = iljuInfo.narrative_blocks.timing_modifiers?.[daewunBranchElement];
            if (!timingMod) {
                  timingMod = iljuInfo.narrative_blocks.timing_modifier;
            }
            const timingModText = timingMod && timingMod.en ? timingMod.en : 'Focus on the dynamic flow of this cycle.';
            narrative += `\n\n[Destiny Equation] ${timingModText}`;
        }
    }

    return narrative;
}
