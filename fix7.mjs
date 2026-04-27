import fs from 'fs';

// 1. Fix relationship-dynamics-service.ts
let content = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');

const regex = /const getBaseRelationDesc = \(\) => \{\n[\s\S]*?    \};\n/;

const newCode = `
    const getBaseRelationDesc = () => {
        let resultText = '';
        
        let uTopGive = '';
        let uTopGiveVal = 0;
        let pTopGive = '';
        let pTopGiveVal = 0;

        const koElements = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)' };
        const getKo = (el) => koElements[el] || el;

        Object.entries(partnerAdjustedElements).forEach(([k, v]) => {
            const el = cleanElement(k);
            const val = v;
            if (uYongHee.includes(el) && val > pTopGiveVal) {
                pTopGiveVal = val;
                pTopGive = el;
            }
        });

        Object.entries(userAdjustedElements).forEach(([k, v]) => {
            const el = cleanElement(k);
            const val = v;
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
                resultText += \`\\\n\\\n[상호 운명적 보완] 서로가 서로의 가장 결정적인 결핍을 채워주는 쌍방향 구원자입니다. 나의 부족한 \${getKo(pTopGive)} 기운을 상대방이 채워주고, 상대의 부족한 \${getKo(uTopGive)} 기운을 내가 채워주며 폭발적인 시너지가 발생하는 [상호 에너지 수혈] 상위 1%의 조합입니다. \`;
            } else if (uBenefitScore > 10 && pBenefitScore <= 0) {
                resultText += \`\\\n\\\n[일방적 에너지 수혈] 상대방이 당신의 절대적인 부족함을 묵묵히 채워주는 맹목적인 관계입니다. 내겐 구원자와 같아서 상대의 넉넉한 \${getKo(pTopGive)} 기운 덕분에 내가 심리적 안정감을 얻고 살아나지만, 반대로 상대방은 에너지가 소진될 수 있으니 당신의 끝없는 감사와 배려가 필수적입니다. \`;
            } else if (uBenefitScore <= 0 && pBenefitScore > 10) {
                 resultText += \`\\\n\\\n[헌신적 조력자] 당신이 상대방을 끌어안고 단점을 메워주는 헌신적인 관계입니다. 당신의 넉넉한 \${getKo(uTopGive)} 기운이 상대의 부족함을 채워주며 상대방은 당신 곁에서 큰 안도감과 발전을 얻습니다. 하지만 당신 스스로 감정적인 소진이 올 수 있으니 개인적인 공간과 휴식이 꼭 필요합니다. \`;
            } else {
                 resultText += \`\\\n\\\n[독립적 동행] 특별히 한쪽이 기운을 내어주고 받는 관계라기보다 두 사람 모두 독립적인 기운이 강합니다. 서로에게 일방적으로 의존하기보다는, 각자의 고유한 영역을 존중하고 취미나 철학을 공유할 때 가장 훌륭한 밸런스를 이룹니다. \`;
            }

            // 3. Temp
            if (temperature > 65) resultText += "\\\n\\\n🌡️ 온도계 예측: [열정/연광] 강렬한 이끌림과 스파크가 튀는 시기. 체온이 상승하는 열정적이고 때로는 다툼마저 뜨거운 온도입니다.";
            else if (temperature < 15) resultText += "\\\n\\\n🌡️ 온도계 예측: [냉철/침착] 이성적 신뢰를 바탕으로 조용히 스며드는 시기. 들뜬 감정보다는 서로의 일상을 지켜주는 차분한 온도입니다.";
            else resultText += "\\\n\\\n🌡️ 온도계 예측: [안락/평온] 가장 편안한 36.5도에 가깝습니다. 함께 있을 때 계절의 극단 없이 온화하고 안락한 휴식처가 되어줍니다.";
        } else {
            if (syncScore >= 90) resultText += "Your energies fit together perfectly, meaning you naturally shine together without forcing it. ";
            else if (syncScore >= 70) resultText += "Your energies harmonize smoothly. You create great synergy with just a little effort to understand each other. ";
            else if (syncScore >= 50) resultText += "This is a practical phase where your energies sometimes clash and sometimes blend. It requires wisdom to compromise and respect your differences. ";
            else resultText += "Your energy directions are quite different, making it a challenging relationship where forcing alignment could burn one out. ";

            if (uBenefitScore > 10 && pBenefitScore > 10) {
                resultText += \`\\\n\\\n[Mutual Salvation] You mutually fill each other's decisive voids. The exact energy you lack (\${pTopGive}) is provided by your partner, and vice versa (\${uTopGive}), creating top 1% synergy.\`;
            } else if (uBenefitScore > 10 && pBenefitScore <= 0) {
                resultText += \`\\\n\\\n[One-Sided Energy Fill] A devoted relationship where the partner silently fills your absolute lack. Like a savior, their abundant \${pTopGive} energy brings you stability. Ensure you show endless gratitude to prevent them from burning out.\`;
            } else if (uBenefitScore <= 0 && pBenefitScore > 10) {
                resultText += \`\\\n\\\n[Dedicated Supporter] You are the one embracing and filling the partner's voids. Your abundant \${uTopGive} energy gives them great relief and growth. Make sure to take time for yourself to avoid emotional burn-out.\`;
            } else {
                 resultText += \`\\\n\\\n[Independent Journey] Rather than a one-sided energetic supply, you both possess strong independent traits. The balance is best when you respect each other's boundaries instead of relying heavily on one another.\`;
            }

            if (temperature > 65) resultText += "\\\n\\\n🌡️ Temperature: [Hot/Passionate] Intense attraction and sparks. A very warm, passionate phase, where even arguments are fiery.";
            else if (temperature < 15) resultText += "\\\n\\\n🌡️ Temperature: [Cool/Calm] Quiet, rational trust. A calm phase guarding each other's daily life safely.";
            else resultText += "\\\n\\\n🌡️ Temperature: [Comfort/Peace] Very comfortable 36.5°C. A gentle and warm shelter without extremes.";
        }
        return resultText;
    };
`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/services/relationship-dynamics-service.ts', content, 'utf-8');

// 2. Fix DestinyMapSection.tsx
let dm = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf-8');

// Allow timeline briefing on current index
dm = dm.replace(
    /if \(\!partnerResult \|\| \!partnerAnalysisMemo \|\| sliderIndex === currentIndex\) return null;/,
    "if (!partnerResult || !partnerAnalysisMemo) return null;"
);

// We want to reduce bridgeText to just the one liner, and put the detailed narrative where bridgeText used to be.
// But the user liked exactly how it was in the old UI. In the old UI, bridgeText (the short sentence) was merged into the text string, or it was shown at the bottom.
// Wait, the new UI has:
// <div className="bg-white/5 rounded-lg p-3 border border-white/5">
//    <span className="text-xs text-fuchsia-200/80 leading-relaxed block">{partnerAnalysisMemo.bridgeText}</span>
// </div>
// <p>{partnerAnalysisMemo.text}</p>
// Thus we can just leave the UI layout as is, but our new dyn.text will contain the rich specific text. 
// I'll make bridgeText empty if it's already redundant, or simply just render dyn.text without bridgeText if needed. 
// Let's actually remove bridgeText block in DestinyMapSection.tsx for better layout since dyn.text now has everything well formatted!

const dmRegex = /<div className="bg-white\/5 rounded-lg p-3 border border-white\/5">\s*<span className="text-xs text-fuchsia-200\/80 leading-relaxed block">\s*\{partnerAnalysisMemo\.bridgeText\}\s*<\/span>\s*<\/div>/;
dm = dm.replace(dmRegex, "");

fs.writeFileSync('src/components/DestinyMapSection.tsx', dm, 'utf-8');
console.log('Fixed fix7.mjs successfully');
