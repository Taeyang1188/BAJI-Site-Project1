import fs from 'fs';

// 1. relationship-dynamics-service.ts
let rs = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');

// (1) 조후 보완 (Temperature Balance)
const johooCode = `
    const checkJoHoo = () => {
        const uFire = uElements['Fire(화)'] || uElements['Fire'] || 0;
        const uWater = uElements['Water(수)'] || uElements['Water'] || 0;
        const pFire = pElements['Fire(화)'] || pElements['Fire'] || 0;
        const pWater = pElements['Water(수)'] || pElements['Water'] || 0;
        
        if (uFire > 30 && pWater > 30) {
            gates.push({
                name: isKO ? "[조후 보완] 한랭함을 녹이다" : "[Temperature Balance] Melting the Cold",
                desc: isKO
                    ? "나의 뜨거운 사주(화) 기운이 상대의 차갑고 얼어붙은 해월(수) 기운을 데워줍니다. 메마르고 얼어붙은 감정에 봄이 온 듯 심리적 온기를 전하는 귀한 역할입니다."
                    : "Your hot Fire energy warms the partner's cold Water energy, bringing a spring-like psychological warmth."
            });
            gateBonus += 10;
        } else if (pFire > 30 && uWater > 30) {
            gates.push({
                name: isKO ? "[조후 보완] 한랭함을 녹이다" : "[Temperature Balance] Melting the Cold",
                desc: isKO
                    ? "상대의 뜨거운 사주(화) 기운이 나의 차갑고 얼어붙은 해월(수) 기운을 데워줍니다. 혼란스럽고 차가운 마음을 따뜻하게 감싸 안는 소중한 인연입니다."
                    : "The partner's hot Fire energy warms your cold Water energy, melting away frozen emotions."
            });
            gateBonus += 10;
        }
    };
    checkJoHoo();
`;

// Insert johooCode before checkSameElementTrap
rs = rs.replace('// Edge Cases', johooCode + '\n    // Edge Cases');


// (2) Pressure Vent 원진 특수 로직 & 원진 기본 문구
// Make sure we replace the checkPressureVent accurately
const oldCPV = `const checkPressureVent = (uGS: number, partnerLacksWood: boolean, userName: string) => {
        if (uGS > 35 && partnerLacksWood) {
            gates.push({
                name: isKO ? "[Pressure Vent] 압박감의 승화" : "[Pressure Vent] Sublimation of Pressure",
                desc: isKO 
                    ? \`한쪽을 짓누르던 엄격한 잣대가 상대방의 유연한 수용성 안에서 '삶의 가이드'로 승화됩니다. 이 인연은 만성적인 긴장을 완화해주는 강력한 진정제입니다.\`
                    : \`The strict standards suppressing one side are sublimated into a 'life guide' within the partner's flexible receptivity.\`
            });
            gateBonus += 12;
        }
    };
    checkPressureVent(uGwanSal, hasLack(pElements, 'Wood'), 'A');
    checkPressureVent(pGwanSal, hasLack(uElements, 'Wood'), 'B');`;

const newCPV = `const checkPressureVent = (uGS: number, partnerLacksWood: boolean, userName: string) => {
        if (uGS > 35 && partnerLacksWood) {
            if (branchInteraction === 'wonjin') {
                gates.push({
                    name: isKO ? "[Pressure Vent] 압박의 해방 (구조적 전지)" : "[Pressure Vent] Liberation via Surgery",
                    desc: isKO 
                        ? "나를 짓누르던 무거운 관살(목)의 압박을 상대방의 예리한 기운(금)이 가지치기(전지)해 줍니다. 원진 관계로 인해 그 과정이 다소 아프고 날카로운 신경전이 동반되지만, 결과적으로 삶의 숨통을 터주는 '필요한 수술'과도 같습니다."
                        : "The partner's sharp energy trims away your heavy structural pressure. Due to Wonjin, it feels agonizing but is a necessary surgery."
                });
            } else {
                gates.push({
                    name: isKO ? "[Pressure Vent] 압박의 해방" : "[Pressure Vent] Sublimation of Pressure",
                    desc: isKO 
                        ? "한쪽을 짓누르던 엄격한 잣대가 상대방의 유연한 수용성 안에서 '삶의 가이드'로 승화됩니다. 이 인연은 만성적인 긴장을 완화해주는 강력한 진정제입니다."
                        : "The strict standards suppressing one side are sublimated into a 'life guide' within the partner's flexible receptivity."
                });
            }
            gateBonus += 12;
        }
    };
    checkPressureVent(uGwanSal, hasLack(pElements, 'Wood'), 'A');
    checkPressureVent(pGwanSal, hasLack(uElements, 'Wood'), 'B');`;

// Because the original string might have small whitespace differences, we use regex carefully.
rs = rs.replace(
    /const checkPressureVent = \(uGS: number, partnerLacksWood: boolean, userName: string\) => \{[\s\S]*?checkPressureVent\(pGwanSal, hasLack\(uElements, 'Wood'\), 'B'\);/,
    newCPV
);

// 원진 일반 게이트 추가
rs = rs.replace(
    /if \(branchInteraction === 'chung' \|\| branchInteraction === 'wonjin'\) gatePenalty \+= 10;/,
    `if (branchInteraction === 'chung' || branchInteraction === 'wonjin') gatePenalty += 10;
    
    if (branchInteraction === 'wonjin') {
        gates.push({
            name: isKO ? "⚠️ [원진/귀문] 이유 없는 예민함과 날카로운 신경전" : "⚠️ [Wonjin] Unreasonable Sensitivity",
            desc: isKO
                ? "일지 간의 원진(寅酉 등) 작용으로 인해, 서로에게 강렬하게 끌리면서도 알 수 없는 오해와 예민함이 작동합니다. 사소한 일로 날카로운 신경전을 벌일 수 있으니 섣부른 다가감보다 거리를 두는 여유가 필요합니다."
                : "You feel an intense pull but also unexplainable misunderstandings. Maintain healthy distance to avoid sharp nerve wars."
        });
    }`
);

// (3) 온도계 해석 수정 (syncScore < 40 금지어, 39도 갈등 등)
rs = rs.replace(
    /\/\/ 3\. Temp\n\s*if \(temperature > 65\) resultText \+= "\\n\\n🌡️ 온도계 예측: \[열정\/연광\][^"]*";\n\s*else if \(temperature < 15\) resultText \+= "\\n\\n🌡️ 온도계 예측: \[냉철\/침착\][^"]*";\n\s*else resultText \+= "\\n\\n🌡️ 온도계 예측: \[안락\/평온\][^"]*";/,
    `// 3. Temp
            if (syncScore < 40) {
                 resultText += "\\n\\n🌡️ 온도계 예측: [서늘한 긴장감] 풀어야 할 업보(Karma)가 공존하는 온도입니다. 감정적 융화보다는 서로의 다름을 직시하고 한 발짝 물러서는 신중한 거리가 필요합니다.";
            } else {
                 if (temperature > 65) resultText += "\\n\\n🌡️ 온도계 예측: [열정/연광] 강렬한 이끌림과 스파크가 튀는 시기. 체온이 상승하는 열정적이고 때로는 다툼마저 뜨거운 온도입니다.";
                 else if (temperature > 37.5) resultText += "\\n\\n🌡️ 온도계 예측: [미열/갈등] 미열이 있는 갈등 상태. 묘한 신경전과 은근한 대조가 피어나는 온도입니다.";
                 else if (temperature < 15) resultText += "\\n\\n🌡️ 온도계 예측: [냉철/침착] 이성적 신뢰를 바탕으로 조용히 스며드는 시기. 들뜬 감정보다는 서로의 일상을 지켜주는 차분한 온도입니다.";
                 else resultText += "\\n\\n🌡️ 온도계 예측: [안락/평온] 가장 편안한 36.5도에 가깝습니다. 함께 있을 때 계절의 극단 없이 온화하고 안락한 휴식처가 되어줍니다.";
            }`
);

rs = rs.replace(
    /if \(temperature > 65\) resultText \+= "\\n\\n🌡️ Temperature: \[Hot\/Passionate\][^"]*";\n\s*else if \(temperature < 15\) resultText \+= "\\n\\n🌡️ Temperature: \[Cool\/Calm\][^"]*";\n\s*else resultText \+= "\\n\\n🌡️ Temperature: \[Comfort\/Peace\][^"]*";/,
    `if (syncScore < 40) {
                 resultText += "\\n\\n🌡️ Temperature: [Cool Tension] A temperature of unresolved karma. Cautious distance is needed.";
            } else {
                 if (temperature > 65) resultText += "\\n\\n🌡️ Temperature: [Hot/Passionate] Intense attraction and sparks. A very warm, passionate phase, where even arguments are fiery.";
                 else if (temperature > 37.5) resultText += "\\n\\n🌡️ Temperature: [Feverish Conflict] Slight feverish tension and subtle nerve wars.";
                 else if (temperature < 15) resultText += "\\n\\n🌡️ Temperature: [Cool/Calm] Quiet, rational trust. A calm phase guarding each other's daily life safely.";
                 else resultText += "\\n\\n🌡️ Temperature: [Comfort/Peace] Very comfortable 36.5°C. A gentle and warm shelter without extremes.";
            }`
);

fs.writeFileSync('src/services/relationship-dynamics-service.ts', rs, 'utf-8');

// 2. timeline-briefing-service.ts (나를 찾는 여정)
let ts = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf-8');

ts = ts.replace(
    /narrative\.title = isKO \? "\[독립과 신뢰\] 의존을 넘어선 동반자" : "\[Independence\] Moving Beyond Dependency";\s*narrative\.psychology = isKO \? "[^"]*" : "[^"]*";\s*narrative\.interaction = isKO \? \`[^`]*\` : \`[^`]*\`;/,
    `narrative.title = isKO ? "[나를 찾는 여정] 자존감의 회복과 주체적 애착" : "[Journey to Self] Rising Self-Esteem";
            narrative.psychology = isKO ? "나의 자아와 표현력을 일깨우는 기운(비겁/식상)이 들어와, 타인에게 의존하던 마음을 비우고 오롯이 홀로 설 수 있는 강한 자존감을 되찾습니다." : "You regain strong self-esteem, discarding dependency as your core elements awake.";
            narrative.interaction = isKO ? "과거엔 결핍을 채우기 위해 맹목적으로 의존했다면, 이제는 나만의 단단한 중심을 잃지 않으면서도 파트너와 대등하게 교감하는 진정한 '동반자'로 격상됩니다." : "You upgrade to a true partner who deeply connects without losing your own solid center.";`
);

fs.writeFileSync('src/services/timeline-briefing-service.ts', ts, 'utf-8');

console.log('Update complete!');
