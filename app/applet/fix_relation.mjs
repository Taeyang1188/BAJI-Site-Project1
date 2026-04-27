import fs from 'fs';
let code = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf8');

const regex = /\/\/ Temp[\s\S]*?(?=return text;)/;

const newCode = `            // Temp
            let tempText = "";
            let clashText = "";

            // Calculate Mediator
            const dmElements: Record<string, string> = { '甲':'Wood', '乙':'Wood', '丙':'Fire', '丁':'Fire', '戊':'Earth', '己':'Earth', '庚':'Metal', '辛':'Metal', '壬':'Water', '癸':'Water' };
            const uDMStem = userResult.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem || '甲';
            const pDMStem = partnerResult.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem || '甲';
            const uDMElement = dmElements[uDMStem] || 'Wood';
            const pDMElement = dmElements[pDMStem] || 'Wood';

            const getMediator = (e1: string, e2: string) => {
                const pair = [e1, e2].sort().join('-');
                const mediators: Record<string, string> = {
                    'Earth-Wood': 'Fire',
                    'Metal-Wood': 'Water',
                    'Fire-Metal': 'Earth',
                    'Fire-Water': 'Wood',
                    'Earth-Water': 'Metal'
                };
                return mediators[pair] || '';
            };
            
            let mediator = getMediator(uDMElement, pDMElement);
            if (!mediator) {
                 // Try to formulate from strongest elements if DM doesn't clash explicitly
                 const getStrongEl = (ratios: any) => Object.entries(ratios).sort((a,b) => (b[1] as number) - (a[1] as number))[0][0].split('(')[0].trim();
                 mediator = getMediator(getStrongEl(userAdjustedElements), getStrongEl(partnerAdjustedElements)) || 'Water';
            }
            
            const mediatorKo = KO_EL[mediator] || '수(水)';
            const mediatorColor = {
                'Wood': 'green-500',
                'Fire': 'red-500',
                'Earth': 'yellow-500',
                'Metal': 'slate-400',
                'Water': 'blue-500'
            }[mediator] || 'blue-500';

            const medStrKo = \`<span class="font-bold text-\$\{mediatorColor\}">\$\{mediatorKo\}</span>\`;
            const medStrEn = \`<span class="font-bold text-\$\{mediatorColor\}">\$\{mediator\}</span>\`;

            if (isKO) {
                 if (isEasterEgg) {
                     tempText += "\\n\\n🌡️ 온도계 예측: [라이벌 연대] 극단적으로 맞닿은 뜨겁거나 차가운 온도가 오히려 둘을 뭉치게 하는 기적적인 시너지의 온도입니다.";
                 } else {
                     if (temperature >= 45 && isSpecial) {
                         tempText += "\\n\\n🌡️ 온도계 예측: [폭발적 시너지/고온] 특수격국의 매우 뜨거운 온도가 오히려 엄청난 성장의 동력으로 작용해 둘의 잠재력을 폭발시킵니다.";
                     } else if (temperature > 65) {
                         tempText += "\\n\\n🌡️ 온도계 예측: [열정/연광] 강렬한 이끌림과 스파크가 튀는 시기. 체온이 상승하는 열정적이고 때로는 다툼마저 뜨거운 온도입니다.";
                     } else if (temperature > 37.5) {
                         tempText += "\\n\\n🌡️ 온도계 예측: [미열/갈등] 미열이 있는 갈등 상태. 묘한 신경전과 은근한 대조가 피어나는 온도입니다.";
                     } else if (temperature < 15) {
                         const bothCold = (uElements['Water'] > 30 || uElements['Metal'] > 30) && (pElements['Water'] > 30 || pElements['Metal'] > 30);
                         if (bothCold) {
                            tempText += "\\n\\n🌡️ 온도계 예측: [조후 급랭/빙점] 극단적으로 차가운 빙점의 온도입니다. 두 사람 모두에게 금/수(金/水) 기운이 강하게 교차하며 뼈를 에이는 듯한 심리적 위축이나 소외감이 발생할 수 있습니다. 따뜻한 성찰과 현실적인 거리를 유지하며 얼음이 녹기를 기다리는 지혜가 필요합니다.";
                         } else {
                            tempText += "\\n\\n🌡️ 온도계 예측: [냉철/침착] 이성적 신뢰를 바탕으로 조용히 스며드는 시기. 들뜬 감정보다는 서로의 일상을 지켜주는 차분한 온도입니다.";
                         }
                     } else {
                         tempText += "\\n\\n🌡️ 온도계 예측: [안락/평온] 가장 편안한 36.5도에 가깝습니다. 함께 있을 때 계절의 극단 없이 온화하고 안락한 휴식처가 되어줍니다.";
                     }
                 }

                 if (!isEasterEgg && (syncScore < 40 || branchInteraction === 'wonjin' || branchInteraction === 'chung')) {
                     clashText += "\\n\\n🛡️ [풀어야 할 카르마] 구조적인 오행 충돌(원진/충 등)로 인해 같은 상황에서도 완전히 다른 언어를 사용하게 되며, 알 수 없는 끌림과 마찰이 공존합니다.\\n";
                     clashText += \`🤝 [통관신(중재 기운)] 두 사람 사이의 벽을 허물기 위해 의식적으로 \$\{medStrKo\} 기운을 활용해야 합니다. 직접 맞붙기보단 제3자나 취미를 매개로 소통하세요.\\n\`;
                     clashText += "⚡ [Action Guide] 감정적 융화보다는 서로의 다름을 직시하고 한 발짝 물러서는 신중한 거리가 필요합니다.";
                 }
                 
                 resultText += tempText + clashText;
            } else {
                 if (isEasterEgg) {
                     tempText += "\\n\\n🌡️ Temperature: [Rival Synergy] Extreme identical temperatures forge a miraculous and unstoppable synergy for you both.";
                 } else {
                     if (temperature >= 45 && isSpecial) {
                         tempText += "\\n\\n🌡️ Temperature: [Explosive Synergy/High Heat] The highly concentrated heat acts as a powerful growth engine due to the special chart structure.";
                     } else if (temperature > 65) tempText += "\\n\\n🌡️ Temperature: [Hot/Passionate] Intense attraction and sparks. A very warm, passionate phase, where even arguments are fiery.";
                     else if (temperature > 37.5) tempText += "\\n\\n🌡️ Temperature: [Feverish Conflict] Slight feverish tension and subtle nerve wars.";
                     else if (temperature < 15) tempText += "\\n\\n🌡️ Temperature: [Cool/Calm] Quiet, rational trust. A calm phase guarding each other's daily life safely.";
                     else tempText += "\\n\\n🌡️ Temperature: [Comfort/Peace] Close to a comfortable 36.5 degrees. Mild and peaceful without extreme seasons.";
                 }

                 if (!isEasterEgg && (syncScore < 40 || branchInteraction === 'wonjin' || branchInteraction === 'chung')) {
                     clashText += "\\n\\n🛡️ [Unresolved Karma] Structural element clash (Wonjin/Chung) causes you to speak completely different languages, creating both magnetic pull and friction.\\n";
                     clashText += \`🤝 [Mediator] Find a mediator element (\$\{medStrEn\}) or a third-party hobby for smoother communication.\\n\`;
                     clashText += "⚡ [Action Guide] Focus on objective boundaries rather than forcing emotional alignment.";
                 }

                 resultText += tempText + clashText;
            }
        }
        `;

code = code.replace(regex, newCode);
fs.writeFileSync('src/services/relationship-dynamics-service.ts', code, 'utf8');
console.log('Fixed thermometer and mediator logic in RelationshipDynamics');
