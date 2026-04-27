import fs from 'fs';

let rs = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');

// I will rebuild checkPressureVent, checkDrainGlow, checkWeightBalance, checkVoidFilling, checkDominantNeutralizer
// Instead of complex regex string replacement, I can replace the whole block from "const checkPressureVent =" to "checkJoHoo();"

const oldGateStart = "const checkPressureVent =";
const oldGateEnd = "checkJoHoo();";

// Wait, I need to know exactly where oldGateEnd starts and ends
const startIndex = rs.indexOf(oldGateStart);
const endIndex = rs.indexOf(oldGateEnd) + oldGateEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
    const newGates = `
    const KO_EL: Record<string, string> = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)' };
    
    // We must check symmetrically! (A to B, or B to A)
    const checkPressureVent = (uGS: number, partnerLacksWood: boolean, isUserA: boolean) => {
        if (uGS > 35 && partnerLacksWood) {
            const subject = isUserA ? "당신" : "상대방";
            const target = isUserA ? "상대방" : "당신";
            if (branchInteraction === 'wonjin') {
                gates.push({
                    name: isKO ? "[Pressure Vent] 압박의 해방 (구조적 전지)" : "[Pressure Vent] Liberation via Surgery",
                    desc: isKO 
                        ? \`\${subject}을 짓누르던 무거운 관살(관성)의 압박을 \${target}의 예리한 기운이 가지치기(전지)해 줍니다. 원진 관계로 인해 그 과정이 다소 아프고 날카로운 신경전이 동반되지만, 결과적으로 삶의 숨통을 터주는 '필요한 수술'과도 같습니다.\`
                        : "The partner's sharp energy trims away your heavy structural pressure. Due to Wonjin, it feels agonizing but is a necessary surgery."
                });
            } else {
                gates.push({
                    name: isKO ? "[Pressure Vent] 압박의 해방" : "[Pressure Vent] Sublimation of Pressure",
                    desc: isKO 
                        ? \`\${subject}을 짓누르던 엄격한 잣대가 \${target}의 유연한 수용성 안에서 '삶의 가이드'로 승화됩니다. 이 인연은 만성적인 긴장을 완화해주는 강력한 진정제입니다.\`
                        : "The strict standards suppressing one side are sublimated into a 'life guide' within the partner's flexible receptivity."
                });
            }
            gateBonus += 12;
        }
    };
    checkPressureVent(uGwanSal, hasLack(pElements, 'Wood'), true);
    checkPressureVent(pGwanSal, hasLack(uElements, 'Wood'), false);

    const checkDrainGlow = (uSS: number, partnerLacksInseong: boolean, isUserA: boolean) => {
        if (uSS > 40 && partnerLacksInseong) {
            const subject = isUserA ? "당신" : "상대방";
            const target = isUserA ? "상대방" : "당신";
            gates.push({
                name: isKO ? "[Drain & Glow] 창조적 도화지" : "[Drain & Glow] Creative Canvas",
                desc: isKO
                    ? \`\${subject}의 쉴 새 없이 뿜어져 나오는 열정과 에너지(식상)가 \${target}이라는 '도화지(빈 인성)'를 만나 비로소 작품이 됩니다. 헛돌던 열정에 확실한 목적지가 생깁니다.\`
                    : \`Overflowing ideas and energy finally become a masterpiece when meeting the partner's 'canvas'.\`
            });
            gateBonus += 12;
        }
    };
    checkDrainGlow(uSikSang, pInSeong < 10, true);
    checkDrainGlow(pSikSang, uInSeong < 10, false);

    const checkWeightBalance = (uJS: number, pBG: number, isUserA: boolean) => {
        if (uJS > 35 && pBG > 30) {
            const subject = isUserA ? "당신" : "상대방";
            const target = isUserA ? "상대방" : "당신";
            gates.push({
                name: isKO ? "[Weight Balance] 하중 분산" : "[Weight Balance] Distribution of Load",
                desc: isKO
                    ? \`\${subject}이 감당하기 버거웠던 현실의 무게(과다한 재성)를 \${target}의 단단한 주체성(비겁)이 기꺼이 나누어 짊어집니다. 혼자일 때보다 두 배의 결실을 맺으며 피로도는 비약적으로 줄어듭니다.\`
                    : \`The realistic weight that was overwhelming is willingly shared by the partner's solid presence.\`
            });
            gateBonus += 12;
        }
    };
    checkWeightBalance(uJaeSeong, pBiGeop, true);
    checkWeightBalance(pJaeSeong, uBiGeop, false);

    const checkVoidFilling = (uElementsObj: any, pElementsObj: any, isUserA: boolean) => {
        ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].forEach(el => {
            let uVal = 0, pVal = 0;
            Object.entries(uElementsObj).forEach(([k, v]) => { if (cleanElement(k) === el) uVal = v as number; });
            Object.entries(pElementsObj).forEach(([k, v]) => { if (cleanElement(k) === el) pVal = v as number; });
            
            if (uVal === 0 && pVal >= 30) {
                const subject = isUserA ? "당신" : "상대방";
                const target = isUserA ? "상대방" : "당신";
                const targetElStr = KO_EL[el];
                gates.push({
                    name: isKO ? \`[Void Filling] 텅 빈 방에 등불이 켜지다\` : \`[Void Filling] Resolving Lack\`,
                    desc: isKO
                        ? \`\${subject}의 무오행(無\${el}) 갈증을 \${target}의 강력한 \${targetElStr} 기운이 채워줍니다. '내가 가진 지도의 빈칸'이 메워지는 강력한 시너지를 경험하게 됩니다.\`
                        : \`A lifelong thirst for needed energy is fulfilled just by the partner's presence.\`
                });
                gateBonus += 15;
            }
        });
    };
    checkVoidFilling(uElements, pElements, true);
    checkVoidFilling(pElements, uElements, false);

    const checkDominantNeutralizer = (uElementsObj: any, pDayBranch: string, isUserA: boolean) => {
        ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].forEach(el => {
            let uVal = 0;
            Object.entries(uElementsObj).forEach(([k, v]) => { if (cleanElement(k) === el) uVal = v as number; });
            if (uVal > 40 && pDayBranch) {
                let formsHap = false;
                const haps = Object.entries(YUKHAP);
                for (const [k, v] of haps) {
                    if (v === pDayBranch && (BRANCH_ELEMENTS as any)[k] === el) formsHap = true;
                }
                if (formsHap) {
                    const subject = isUserA ? "당신" : "상대방";
                    const target = isUserA ? "상대방" : "당신";
                    gates.push({
                        name: isKO ? "[Dominant Neutralizer] 넘치는 폭주를 잠재우다" : "[Dominant Neutralizer] Calming the Rampage",
                        desc: isKO
                            ? \`\${subject}의 통제 불능이었던 편중된 에너지를 \${target}의 유연한 일지 기운이 부드럽게 감싸 안아 '생산적인 에너지'로 치환합니다. 폭주를 막는 가장 견고한 안전장치입니다.\`
                            : \`Uncontrollable energy is softly embraced and sublimated by the partner into productive force.\`
                    });
                    gateBonus += 10;
                }
            }
        });
    };
    checkDominantNeutralizer(uElements, pDayBranch, true);
    checkDominantNeutralizer(pElements, uDayBranch, false);

    const checkJoHoo = () => {
        const uFire = uElements['Fire(화)'] || uElements['Fire'] || 0;
        const uWater = uElements['Water(수)'] || uElements['Water'] || 0;
        const pFire = pElements['Fire(화)'] || pElements['Fire'] || 0;
        const pWater = pElements['Water(수)'] || pElements['Water'] || 0;
        
        if (uFire > 30 && pWater > 30) {
            gates.push({
                name: isKO ? "[조후 보완] 한랭함을 녹이다" : "[Temperature Balance] Melting the Cold",
                desc: isKO
                    ? "당신의 뜨거운 사주(화) 기운이 상대방의 차갑고 얼어붙은 해월/자월(수) 기운을 데워줍니다. 메마르고 얼어붙은 감정에 봄이 온 듯 심리적 온기를 전하는 귀한 역할입니다."
                    : "Your hot Fire energy warms the partner's cold Water energy, bringing a spring-like psychological warmth."
            });
            gateBonus += 10;
        } else if (pFire > 30 && uWater > 30) {
            gates.push({
                name: isKO ? "[조후 보완] 한랭함을 녹이다" : "[Temperature Balance] Melting the Cold",
                desc: isKO
                    ? "상대방의 뜨거운 사주(화) 기운이 당신의 차갑고 얼어붙은 해월/자월(수) 기운을 데워줍니다. 혼란스럽고 차가운 마음을 따뜻하게 감싸 안는 소중한 인연입니다."
                    : "The partner's hot Fire energy warms your cold Water energy, melting away frozen emotions."
            });
            gateBonus += 10;
        }
    };
    checkJoHoo();`;
    
    rs = rs.substring(0, startIndex) + newGates + rs.substring(endIndex);
    fs.writeFileSync('src/services/relationship-dynamics-service.ts', rs, 'utf-8');
    console.log("Gates successfully updated");
}

let code2 = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');
// For syncScore < 40: 3단 조립 서사
// 1) [Clash Reason]
// 2) [Mediator]
// 3) [Action Guide]
// We can find `if (syncScore < 40) {`
const tempIndex = code2.indexOf("if (syncScore < 40) {");
if (tempIndex !== -1) {
    const endTemp = code2.indexOf("} else {", tempIndex);
    if (endTemp !== -1) {
        // We replace inside syncScore < 40
        const newTemp = `if (syncScore < 40) {
                 // Easter Egg for Rival 99%
                 if (temperature >= 60 || temperature <= 25) {
                     resultText += "\\n\\n🌡️ 심리 기반 지수: [라이벌 지수 99%] 서로가 서로를 한계까지 몰아붙이는 동시에 거울처럼 내면의 결핍을 폭로하는 카르마적 인연입니다.\\n";
                     resultText += "\\n🛡️ [Clash Reason] 오행과 조후가 극단적으로 충돌하며 각자의 강한 소신이 평행선을 달립니다.\\n";
                     resultText += "🤝 [Mediator] 다름을 인정하는 '객관화(인성)' 기운이 중재 역할을 해야 합니다. 상대를 통제하려 들지 마세요.\\n";
                     resultText += "⚡ [Action Guide] 풀어야 할 업보(Karma)가 공존하는 온도입니다. 감정적 융화보다는 서로의 다름을 직시하고 한 발짝 물러서는 신중한 거리가 필수적인 개운법입니다.";
                 } else {
                     resultText += "\\n\\n🌡️ 온도계 예측: [서늘한 긴장감] 풀어야 할 업보(Karma)가 공존하는 온도입니다.\\n";
                     resultText += "\\n🛡️ [Clash Reason] 구조적인 오행 충돌로 인해 같은 상황에서도 완전히 다른 언어를 사용하게 됩니다.\\n";
                     resultText += "🤝 [Mediator] 서로의 부족함을 보완할 수 있는 통관신(중재 기운)을 의식적으로 찾아야 합니다. 직접 맞붙기보단 제3자나 취미를 매개로 소통하세요.\\n";
                     resultText += "⚡ [Action Guide] 감정적 융화보다는 서로의 다름을 직시하고 한 발짝 물러서는 신중한 거리가 필요합니다.";
                 }
            `;
            code2 = code2.substring(0, tempIndex) + newTemp + code2.substring(endTemp);
            fs.writeFileSync('src/services/relationship-dynamics-service.ts', code2, 'utf-8');
            console.log("Easter egg / Rival index and 3-stage clash updated");
    }
}
