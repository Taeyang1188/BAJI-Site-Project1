import fs from 'fs';

let rs = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');

// 1. Rewrite syncScore manipulation and Easter Egg logic at the bottom
const bottomPartStart = "// Temperature (Symmetric)";
const bottomPartIndex = rs.indexOf(bottomPartStart);

if (bottomPartIndex !== -1) {
    const newBottom = `// Temperature (Symmetric)
    const calculateHeat = (ratios: any) => {
        if (!ratios) return 0;
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
    const avgHeat = (calculateHeat(uElements) + calculateHeat(pElements)) / 2;
    // Normalize temperature
    let temperature = 36.5 + (avgHeat * 0.2); 
    // keep in reasonable bounds
    temperature = Math.max(0, Math.min(100, temperature));

    let isEasterEgg = false;

    // Check for Rival Index Easter Egg
    // "0%의 반전: 싱크로율이 10% 미만이면서 조후가 극단적으로 겹칠 때 라이벌 지수 99% 셋팅"
    if (syncScore < 10 && (temperature >= 60 || temperature <= 25)) {
        isEasterEgg = true;
        syncScore = 99; // 강제 반전
    }

    let text = "";
    let relation = 'neutral';
    let isGlowing = syncScore >= 80;
    
    if (syncScore >= 80) relation = 'good';
    else if (syncScore <= 40) relation = 'bad';

    const isUserSpecial = userResult.analysis?.structureDetail?.category === 'Adaptive' || userResult.analysis?.structureDetail?.category === 'Monarch';
    const isPartnerSpecial = partnerResult.analysis?.structureDetail?.category === 'Adaptive' || partnerResult.analysis?.structureDetail?.category === 'Monarch';
    const isSpecial = isUserSpecial || isPartnerSpecial;

    const getBaseRelationDesc = () => {
        let resultText = '';
        
        // variables...
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
            if (isEasterEgg) {
                resultText += "[태양을 삼킨 연합/거울 인연] 당신과 상대방은 오행과 조후가 극단적으로 겹치며 원래라면 밀어내야 할 인연이지만, 극한에 달한 반발력이 폭발적인 라이벌 시너지로 반전되었습니다. 서로가 서로를 비추는 단단한 거울이 되어 함께 성장하는 99%의 카르마적 인연입니다.";
            } else {
                if (syncScore >= 90) resultText += "현재 두 분의 싱크로율 수치는 서로의 에너지 방향성이 완벽하게 일치하여, 억지로 맞추려 하지 않아도 서로의 존재만으로 빛이 나는 천생연분임을 의미합니다. ";
                else if (syncScore >= 70) resultText += "현재 싱크로율 수치는 서로의 에너지가 부드럽게 조화를 이루며, 조금의 맞춰가는 노력만으로도 긍정적인 시너지를 만들어낼 수 있는 훌륭한 인연임을 의미합니다. ";
                else if (syncScore >= 50) resultText += "현재 싱크로율 수치는 두 분의 기운이 때로는 부딪히고 때로는 융화되는 현실적 구간임을 의미합니다. 다름을 인정하고 양보를 통해 타협점을 찾아가는 지혜가 필요합니다. ";
                else resultText += "현재 싱크로율 수치는 두 분의 에너지 방향성이 크게 달라, 억지로 맞추려 하면 한쪽이 소진될 가능성이 있는 다소 도전적인 관계임을 의미합니다. ";

                if (uBenefitScore > 10 && pBenefitScore > 10) {
                    resultText += \`\\n\\n[상호 운명적 보완] 서로가 가장 결정적인 결핍을 채워줍니다. 당신의 부족한 \${getKo(pTopGive)} 기운을 상대가 먼저 채워주고, 상대의 부족한 \${getKo(uTopGive)} 기운을 당신이 채워줍니다.\`;
                } else if (uBenefitScore > 10 && pBenefitScore <= 0) {
                    resultText += \`\\n\\n[일방적 에너지 수혈] 상대방이 당신의 절대적인 부족함을 묵묵히 채워주는 맹목적인 관계입니다. 내겐 구원자와 같아서 상대의 넉넉한 \${getKo(pTopGive)} 기운 덕분에 내가 심리적 안정감을 얻고 살아납니다.\`;
                } else if (uBenefitScore <= 0 && pBenefitScore > 10) {
                     resultText += \`\\n\\n[헌신적 조력자] 당신이 상대를 끌어안고 단점을 메워줍니다. 당신의 넉넉한 \${getKo(uTopGive)} 기운이 상대의 부족함을 채워주며 상대는 큰 안도감과 발전을 얻습니다.\`;
                } else {
                     resultText += \`\\n\\n[독립적 동행] 특별히 한쪽이 능방적으로 내어주고 받기보다 두 사람 모두 고유한 자기 기운이 강합니다. 서로의 다름을 존중할 때 가장 좋은 밸런스를 이룹니다.\`;
                }
            }

            // Temp
            if (isEasterEgg) {
                resultText += "\\n\\n🌡️ 온도계 예측: [라이벌 연대] 극단적으로 맞닿은 뜨겁거나 차가운 온도가 오히려 둘을 뭉치게 하는 기적적인 시너지의 온도입니다.";
            } else if (syncScore < 40) {
                 resultText += "\\n\\n🌡️ 온도계 예측: [서늘한 긴장감] 풀어야 할 업보(Karma)가 공존하는 온도입니다.\\n";
                 resultText += "\\n🛡️ [Clash Reason] 구조적인 오행 충돌로 인해 같은 상황에서도 완전히 다른 언어를 사용하게 됩니다.\\n";
                 resultText += "🤝 [Mediator] 서로의 부족함을 보완할 수 있는 통관신(중재 기운)을 의식적으로 찾아야 합니다. 직접 맞붙기보단 제3자나 취미를 매개로 소통하세요.\\n";
                 resultText += "⚡ [Action Guide] 감정적 융화보다는 서로의 다름을 직시하고 한 발짝 물러서는 신중한 거리가 필요합니다.";
            } else {
                 if (temperature >= 45 && isSpecial) {
                     resultText += "\\n\\n🌡️ 온도계 예측: [폭발적 시너지/고온] 특수격국의 매우 뜨거운 온도가 오히려 엄청난 성장의 동력으로 작용해 둘의 잠재력을 폭발시킵니다.";
                 } else if (temperature > 65) {
                     resultText += "\\n\\n🌡️ 온도계 예측: [열정/연광] 강렬한 이끌림과 스파크가 튀는 시기. 체온이 상승하는 열정적이고 때로는 다툼마저 뜨거운 온도입니다.";
                 } else if (temperature > 37.5) {
                     resultText += "\\n\\n🌡️ 온도계 예측: [미열/갈등] 미열이 있는 갈등 상태. 묘한 신경전과 은근한 대조가 피어나는 온도입니다.";
                 } else if (temperature < 15) {
                     resultText += "\\n\\n🌡️ 온도계 예측: [냉철/침착] 이성적 신뢰를 바탕으로 조용히 스며드는 시기. 들뜬 감정보다는 서로의 일상을 지켜주는 차분한 온도입니다.";
                 } else {
                     resultText += "\\n\\n🌡️ 온도계 예측: [안락/평온] 가장 편안한 36.5도에 가깝습니다. 함께 있을 때 계절의 극단 없이 온화하고 안락한 휴식처가 되어줍니다.";
                 }
            }
        } else {
            // EN Logic
            if (isEasterEgg) {
                resultText += "[Rival Bond / Mirror Mate] An extreme overlap of elements leads to a reversed 99% synergy where you mirror and push each other to the limits, growing together through a karmic connection.";
            } else {
                if (syncScore >= 90) resultText += "Your energies fit together perfectly, meaning you naturally shine together without forcing it. ";
                else if (syncScore >= 70) resultText += "Your energies harmonize smoothly. You create great synergy with just a little effort to understand each other. ";
                else if (syncScore >= 50) resultText += "This is a practical phase where your energies sometimes clash and sometimes blend. It requires wisdom to compromise and respect your differences. ";
                else resultText += "Your energy directions are quite different, making it a challenging relationship where forcing alignment could burn one out. ";
            }

            if (isEasterEgg) {
                resultText += "\\n\\n🌡️ Temperature: [Rival Synergy] Extreme identical temperatures forge a miraculous and unstoppable synergy for you both.";
            } else if (syncScore < 40) {
                 resultText += "\\n\\n🌡️ Temperature: [Cool Tension]\\n\\n🛡️ [Clash Reason] Structural element clash causes you to speak completely different languages.\\n🤝 [Mediator] Find a mediator element or a third-party hobby for smoother communication.\\n⚡ [Action Guide] A temperature of unresolved karma. Cautious distance is needed.";
            } else {
                 if (temperature >= 45 && isSpecial) {
                     resultText += "\\n\\n🌡️ Temperature: [Explosive Synergy/High Heat] The highly concentrated heat acts as a powerful growth engine due to the special chart structure.";
                 } else if (temperature > 65) resultText += "\\n\\n🌡️ Temperature: [Hot/Passionate] Intense attraction and sparks. A very warm, passionate phase, where even arguments are fiery.";
                 else if (temperature > 37.5) resultText += "\\n\\n🌡️ Temperature: [Feverish Conflict] Slight feverish tension and subtle nerve wars.";
                 else if (temperature < 15) resultText += "\\n\\n🌡️ Temperature: [Cool/Calm] Quiet, rational trust. A calm phase guarding each other's daily life safely.";
                 else resultText += "\\n\\n🌡️ Temperature: [Comfort/Peace] Very comfortable 36.5°C. A gentle and warm shelter without extremes.";
            }
        }
        return resultText;
    };
    
    const uniqueGates = Array.from(new Set(gates.map(g => JSON.stringify(g)))).map((g: string) => JSON.parse(g));
    
    return {
        syncScore,
        temperature,
        relation,
        isGlowing,
        text: getBaseRelationDesc(),
        isEasterEgg,
        gates: uniqueGates
    };
}`;

    rs = rs.substring(0, bottomPartIndex) + newBottom + '\n}\n';
    fs.writeFileSync('src/services/relationship-dynamics-service.ts', rs, 'utf-8');
}
