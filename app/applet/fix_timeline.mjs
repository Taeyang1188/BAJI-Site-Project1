import fs from 'fs';

let content = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf-8');

// The logic starts around line 250 with:
// let pastTenGod = prevDaewunDiff !== -1 ? tenGodsKo[prevDaewunDiff].split('(')[0] : "알 수 없는 기운";
const regex = /let pastTenGod \= prevDaewunDiff \!\=\= \-1 \? tenGodsKo\[prevDaewunDiff\]\.split\(\'\(\'\)\[0\] : "알 수 없는 기운";[\s\S]*?\} else \{\n\s*interpretation \= \`다소 방어적이었던\(신약\) 당신의 사주 구조 내에서 \$\{currentTenGod\} 기운이 전면으로 나서 삶의 엔진을 회전시킵니다\. 불안했던 과거와 작별하고 자기 확신을 채워나갈 과도기입니다\.\`;\n\s*\}\n\s*\}/;

const newLogic = `let pastTenGod = prevDaewunDiff !== -1 ? tenGodsKo[prevDaewunDiff].split('(')[0] : "알 수 없는 기운";
           let currentTenGod = tenGodRoleKo.split('(')[0];

           if (pastTenGod === currentTenGod) {
               narrative += \`[과거와의 연장선] 지난 대운부터 이어온 '\${pastTenGod}'의 테마가 이제는 완전히 무르익어 절정에 달하고 있습니다. \`;
               narrative += \`당신의 명식 구조 안착부(지지)에 잠복해 있던 공기가 한층 짙어지며, '\${currentTenGod}' 기운이 온몸의 감각을 지배하게 됩니다.\\n\\n\`;
           } else {
               narrative += \`[과거와의 결별] 지난 대운이 당신을 짓누르고 테스트하는 '\${pastTenGod}'의 시간이었다면, 이제는 판도가 완전히 뒤바뀌었습니다. \`
               narrative += \`당신의 명식 구조 안착부(지지)를 장악했던 무거운 공기가 걷히고, 이제는 '\${currentTenGod}' 기운이 온몸의 감각을 지배하게 됩니다.\\n\\n\`;
           }

           const featuresStr = (result?.analysis?.balanceWarnings || []).map((w: any) => w.title).join(' ');
           let interpretation = "";
           
           const strScore = result?.analysis?.strength?.score || 50;
           let strengthStr = "";
           if (strScore >= 75) strengthStr = "극신강(가장 견고하고 강한 자아)";
           else if (strScore >= 60) strengthStr = "신강(확고한 자아)";
           else if (strScore >= 55) strengthStr = "중화신강(안정적이고 다소 강건한 자아)";
           else if (strScore >= 45) strengthStr = "중화(유연하고 균형 잡힌 자아)";
           else if (strScore >= 40) strengthStr = "중화신약(유연하지만 방어적인 자아)";
           else if (strScore >= 25) strengthStr = "신약(조심스럽고 수용적인 자아)";
           else strengthStr = "극신약(외부 기운에 극도로 귀 기울이는 섬세한 자아)";

           if (featuresStr.includes("관살") || featuresStr.includes("관성")) {
               if (currentTenGod === '식상') {
                   interpretation = \`내면의 관살(압박, 통제)이 당신을 옥죄던 상황에서, 마침내 그것을 쳐낼 예리한 무기(상관/식신)를 손에 쥐었습니다. 참는 자가 이기는 시대는 끝났습니다. 이제는 나의 목소리를 내어 현실의 유리천장을 깨고 주도권을 되찾는 역동의 시기입니다.\`;
               } else if (currentTenGod === '재성') {
                   interpretation = \`일만 하고 성과는 보이지 않던 시야가 트입니다. 그간 쌓아온 관살(책임)의 하중이 재성(현실적 결실)으로 치환되어 손에 잡히는 수확이 생깁니다. 단, 재성이 관성을 더욱 무겁게 할 수 있으니 무리한 확장보다 확실한 내실 다지기에 집중하세요.\`;
               } else {
                   interpretation = \`당신을 둘러싼 과도한 통제력(관살)에 또 다른 \${currentTenGod} 기운이 더해졌습니다. 무게중심이 옮겨가는 과도기입니다. 섣불리 틀을 부수려 하기보단 뿌리를 내리는 깊이 있는 통찰이 요구됩니다.\`;
               }
           } else if (featuresStr.includes("재다") || featuresStr.includes("재성")) {
               if (currentTenGod === '비겁' || currentTenGod === '인성') {
                   interpretation = \`흔들리던 현실의 기반을 단단히 붙잡아줄 든든한 방패를 얻었습니다. 헛돌던 에너지는 폭주를 멈추고 온전히 나의 자산으로 안착할 것입니다.\`;
               } else {
                   interpretation = \`끝없는 현실적 욕망과 갈증에 불을 지피는 \${currentTenGod} 기운이 지배하고 있습니다. 지금 당신이 쥐어야 할 것은 넓은 바다가 아니라 길을 잃지 않을 나침반입니다.\`;
               }
           } else {
               interpretation = \`[\${strengthStr}] 바탕 위에 \${currentTenGod} 기운이 전면으로 나섰습니다. \${strScore >= 45 ? '넘치는 에너지를 마음껏 발산하며 머물렀던 과거와 작별하고 확신을 향해 엑셀을 밟아도 좋은 때입니다.' : '불안했던 과거와 작별하고 점진적으로 자기 확신을 채워나갈 과도기입니다. 서두르지 말고 자신의 페이스를 찾으세요.'}\`;
           }`;

if (regex.test(content)) {
    content = content.replace(regex, newLogic);
    fs.writeFileSync('src/services/timeline-briefing-service.ts', content, 'utf-8');
    console.log('Fixed timeline logic');
} else {
    console.log('Could not find regex target in timeline-briefing-service.ts');
}

// -------------------------------------------------------------
// 2. Fix relationship-dynamics-service.ts variables and string
let dynam = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');

// Replace "당신의 무오행... 갈증을" string
const voidRegex = /\$\{subject\}의 무오행\(無\$\{el\}\) 갈증을 \$\{target\}의 강력한 \$\{targetElStr\} 기운이 채워줍니다\. \'내가 가진 지도의 빈칸\'이 메워지는 강력한 시너지를 경험하게 됩니다\./g;
dynam = dynam.replace(voidRegex, "\${subject}의 오행 중 결핍된 글자(${targetElStr})에 대한 갈증을 ${target}의 강력한 ${targetElStr} 기운이 묵묵히 채워줍니다. '내가 결코 가질 수 없는 지도의 빈칸'이 완벽히 메워지는 엄청난 시너지를 경험하게 됩니다.");

// Now we MUST define getBaseRelationDesc and all the missing variables so tsc passes.
// We'll replace the line `text: getBaseRelationDesc(),` with the actual string construction.
// Wait, isEasterEgg, temperature, resultText are used all over in calculateRelationshipDynamics.
// Those compile errors shown were:
// src/services/relationship-dynamics-service.ts(342,22): error TS2304: Cannot find name 'isEasterEgg'.
// src/services/relationship-dynamics-service.ts(345,26): error TS2304: Cannot find name 'temperature'.

// Actually `isEasterEgg`, `temperature` were extracted into a helper earlier but I removed the definitions!
// Let me just recreate the ENTIRE bottom part of the function from `// Temp` down to `return`.
// Let's use string operations!

const marker = "// Temp";
const markerIndex = dynam.indexOf(marker);
if (markerIndex !== -1) {
    const bottomPart = \`// Temp
            let resultText = '';
            
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
            
            let temperature = (syncScore + baseScore) / 2;
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
            const medStrKo = \`[\${mediatorKo}]\`;
            const medStrEn = \`[\${mediator}]\`;

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
                    resultText += \`\\n\\n[상호 운명적 보완] 서로가 서로의 가장 결정적인 결핍을 채워주는 쌍방향 구원자입니다. 나의 부족한 \${getKo(pTopGive)} 기운을 상대방이 채워주고, 상대의 부족한 \${getKo(uTopGive)} 기운을 내가 채워주며 폭발적인 시너지가 발생하는 [상호 에너지 수혈] 상위 1%의 조합입니다. \`;
                } else if (uBenefitScore > 10 && pBenefitScore <= 0) {
                    resultText += \`\\n\\n[일방적 에너지 수혈] 상대방이 당신의 절대적인 부족함을 묵묵히 채워주는 맹목적인 관계입니다. 내겐 구원자와 같아서 상대의 넉넉한 \${getKo(pTopGive)} 기운 덕분에 내가 심리적 안정감을 얻고 살아나지만, 반대로 상대방은 에너지가 소진될 수 있으니 당신의 끝없는 감사와 배려가 필수적입니다. \`;
                } else if (uBenefitScore <= 0 && pBenefitScore > 10) {
                     resultText += \`\\n\\n[헌신적 조력자] 당신이 상대방을 끌어안고 단점을 메워주는 헌신적인 관계입니다. 당신의 넉넉한 \${getKo(uTopGive)} 기운이 상대의 부족함을 채워주며 상대방은 당신 곁에서 큰 안도감과 발전을 얻습니다. 하지만 당신 스스로 감정적인 소진이 올 수 있으니 개인적인 공간과 휴식이 꼭 필요합니다. \`;
                } else {
                     resultText += \`\\n\\n[독립적 동행] 특별히 한쪽이 기운을 절대적으로 내어주고 받는 관계라기보다 두 사람 모두 고유의 독립적인 기운이 강합니다. 서로에게 일방적으로 의존하거나 바꾸려 하기보다는, 각자의 고유한 영역을 존중하고 적절한 거리감을 허용할 때 가장 훌륭한 텐션과 밸런스를 유지합니다. \`;
                }

                // 3. Temp
                if (isEasterEgg) {
                     tempText += "\\n\\n🌡️ 온도계 예측: [라이벌 연대] 극단적으로 맞닿은 뜨겁거나 차가운 온도가 오히려 둘을 뭉치게 하는 기적적인 시너지의 온도입니다.";
                 } else {
                     if (temperature > 65) tempText += "\\n\\n🌡️ 온도계 예측: [열정/연광] 강렬한 이끌림과 스파크가 튀는 시기. 체온이 상승하는 열정적이고 때로는 다툼마저 뜨거운 온도입니다.";
                     else if (temperature < 15) {
                         const uWater = userAdjustedElements['Water(수)'] || userAdjustedElements['Water'] || 0;
                         const uMetal = userAdjustedElements['Metal(금)'] || userAdjustedElements['Metal'] || 0;
                         const pWater = partnerAdjustedElements['Water(수)'] || partnerAdjustedElements['Water'] || 0;
                         const pMetal = partnerAdjustedElements['Metal(금)'] || partnerAdjustedElements['Metal'] || 0;
                         const bothCold = (uWater > 30 || uMetal > 30) && (pWater > 30 || pMetal > 30);
                         
                         if (bothCold) {
                            tempText += "\\n\\n🌡️ 온도계 예측: [조후 급랭/빙점] 극단적으로 차가운 빙점의 온도입니다. 두 사람 모두에게 금/수(金/水) 기운이 강하게 교차하며 뼈를 에이는 듯한 심리적 위축이나 소외감이 발생할 수 있습니다. 따뜻한 성찰과 현실적인 거리를 유지하며 얼음이 녹기를 기다리는 지혜가 필요합니다.";
                         } else {
                            tempText += "\\n\\n🌡️ 온도계 예측: [냉철/침착] 이성적 신뢰를 바탕으로 조용히 스며드는 시기. 들뜬 감정보다는 서로의 일상을 지켜주는 차분한 온도입니다.";
                         }
                     }
                     else tempText += "\\n\\n🌡️ 온도계 예측: [안락/평온] 가장 편안한 36.5도에 가깝습니다. 함께 있을 때 계절의 극단 없이 온화하고 안락한 휴식처가 되어줍니다.";
                 }
                 
                 if (!isEasterEgg && (syncScore < 40 || branchInteraction === 'wonjin' || branchInteraction === 'chung')) {
                     clashText += "\\n\\n🛡️ [풀어야 할 업보] 구조적인 오행 충돌(원진/충 등)로 인해 같은 상황에서도 완전히 다른 언어를 사용하게 되며, 알 수 없는 끌림과 마찰이 공존합니다.\\n";
                     clashText += \`🤝 [통관신(중재 기운)] 두 사람 사이의 벽을 허물기 위해 의식적으로 \${medStrKo} 기운을 활용해 보세요. 직접 부딪히기보다 제3자나 취미를 매개로 소통하는 것이 이롭습니다.\\n\`;
                     clashText += "⚡ [Action Guide] 감정적 융화보다는 서로의 다름을 직시하고 한 발짝 물러서는 신중한 거리가 필요합니다.";
                 }

                 resultText += tempText + clashText;

            } else {
                 if (syncScore >= 90) resultText += "Your energies fit together perfectly, meaning you naturally shine together without forcing it. ";
                 else if (syncScore >= 70) resultText += "Your energies harmonize smoothly. You create great synergy with just a little effort to understand each other. ";
                 else if (syncScore >= 50) resultText += "This is a practical phase where your energies sometimes clash and sometimes blend. It requires wisdom to compromise and respect your differences. ";
                 else resultText += "Your energy directions are quite different, making it a challenging relationship where forcing alignment could burn one out. ";

                 if (uBenefitScore > 10 && pBenefitScore > 10) {
                     resultText += \`\\n\\n[Mutual Salvation] You mutually fill each other's decisive voids. The exact energy you lack (\${pTopGive}) is provided by your partner, and vice versa (\${uTopGive}), creating top 1% synergy.\`;
                 } else if (uBenefitScore > 10 && pBenefitScore <= 0) {
                     resultText += \`\\n\\n[One-Sided Energy Fill] A devoted relationship where the partner silently fills your absolute lack. Like a savior, their abundant \${pTopGive} energy brings you stability. Ensure you show endless gratitude to prevent them from burning out.\`;
                 } else if (uBenefitScore <= 0 && pBenefitScore > 10) {
                     resultText += \`\\n\\n[Dedicated Supporter] You are the one embracing and filling the partner's voids. Your abundant \${uTopGive} energy gives them great relief and growth. Make sure to take time for yourself to avoid emotional burn-out.\`;
                 } else {
                     resultText += \`\\n\\n[Independent Journey] Rather than a one-sided energetic supply, you both possess strong independent traits. The balance is best when you respect each other's boundaries instead of relying heavily on one another.\`;
                 }

                 if (isEasterEgg) {
                     tempText += "\\n\\n🌡️ Temperature: [Rival Synergy] Extreme identical temperatures forge a miraculous and unstoppable synergy for you both.";
                 } else {
                     if (temperature > 65) tempText += "\\n\\n🌡️ Temperature: [Hot/Passionate] Intense attraction and sparks. A very warm, passionate phase, where even arguments are fiery.";
                     else if (temperature < 15) tempText += "\\n\\n🌡️ Temperature: [Cool/Calm] Quiet, rational trust. A calm phase guarding each other's daily life safely.";
                     else tempText += "\\n\\n🌡️ Temperature: [Comfort/Peace] Very comfortable 36.5°C. A gentle and warm shelter without extremes.";
                 }
                 
                 if (!isEasterEgg && (syncScore < 40 || branchInteraction === 'wonjin' || branchInteraction === 'chung')) {
                     clashText += "\\n\\n🛡️ [Unresolved Karma] Structural element clash (Wonjin/Chung) causes you to speak completely different languages, creating both magnetic pull and friction.\\n";
                     clashText += \`🤝 [Mediator] Find a mediator element (\${medStrEn}) or a third-party hobby for smoother communication.\\n\`;
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
            else relation = isKO ? "카르마의 숙제" : "Karmic Task";

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
\`;

    const oldBottomPart = dynam.slice(markerIndex);
    dynam = dynam.slice(0, markerIndex) + bottomPart;
    fs.writeFileSync('src/services/relationship-dynamics-service.ts', dynam, 'utf-8');
    console.log('Fixed dynamics compiler issue');

} else {
    console.log('Marker temp not found');
}
