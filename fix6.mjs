import fs from 'fs';

// 1. Fix DestinyMapSection.tsx logic
let dm = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf-8');

const regex = /let bridgeText = lang === 'KO' \? [\s\S]*?(?=if \(dyn\.isEasterEgg\))/;

const newDmLogic = `let bridgeText = lang === 'KO' ? '서로의 에너지가 융화되는 구간입니다.' : 'Your energies blend naturally.';
    if (dyn.syncScore >= 85) bridgeText = lang === 'KO' ? '서로가 서로에게 부족한 기운을 넘치게 채워주는 강력한 보완 관계입니다.' : 'A powerful complementary relationship where both fill each other\\'s void.';
    else if (dyn.syncScore >= 60) bridgeText = lang === 'KO' ? '서로의 기운이 부드럽게 조화를 이루며 긍정적인 시너지를 만들어냅니다.' : 'Your energies harmonize smoothly.';
    else if (dyn.syncScore >= 45) bridgeText = lang === 'KO' ? '때로는 마찰이 있지만 양보를 통해 타협점을 찾아가야 하는 현실적 구간입니다.' : 'A practical phase requiring compromise to overcome occasional friction.';
    else bridgeText = lang === 'KO' ? '에너지가 크게 충돌하며 잦은 마찰을 빚을 수 있으니, 각자의 공간과 거리두기가 필요합니다.' : 'Strong energies clash severely; maintaining proper distance is highly recommended.';

    `;

dm = dm.replace(regex, newDmLogic);
fs.writeFileSync('src/components/DestinyMapSection.tsx', dm, 'utf-8');
console.log('Fixed DestinyMapSection.tsx');

// 2. Fix relationship-dynamics-service.ts
let rs = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');

const rsRegex = /const getBaseRelationDesc = \(\) => \{\n[\s\S]*?    \};\n/;

const newRsLogic = `const getBaseRelationDesc = () => {
        let resultText = '';
        if (isKO) {
            // 1. Sync level
            if (syncScore >= 90) resultText += "두 분의 기운은 서로가 서로에게 완벽한 퍼즐 조각처럼 들어맞습니다. ";
            else if (syncScore >= 70) resultText += "서로의 다름이 오히려 긍정적인 시너지로 작용하는 훌륭한 인연입니다. ";
            else if (syncScore >= 50) resultText += "공통점과 차이점이 공존하며, 다름을 인정하고 이해하려는 노력이 빛을 발하는 관계입니다. ";
            else resultText += "서로의 주관과 강한 에너지가 부딪히며 마찰을 일으킬 수 있는 도전적인 '거울'과도 같습니다. ";

            // 2. Benefit (용희신 보완)
            if (uBenefitScore > 10 && pBenefitScore > 10) {
                resultText += "특히 상대방 곁에 있을 때 서로의 결핍된 기운이 채워지고, 막혔던 에너지가 순환하는 강력한 상호 보완의 축복을 누립니다. ";
            } else if (uBenefitScore > 10 && pBenefitScore <= 0) {
                resultText += "한쪽의 기운이 다른 쪽을 부드럽게 감싸주며 심리적 안정감과 돌파구를 제공하는 헌신적인 면모가 돋보입니다. ";
            } else if (uBenefitScore <= 0 && pBenefitScore > 10) {
                 resultText += "상대방의 존재가 나의 일상에 활력을 불어넣고, 부족한 에너지를 적극적으로 끌어올려주는 긍정적인 역할을 합니다. ";
            } else {
                 resultText += "두 사람 모두 독립적인 기운이 강해, 일방적으로 의존하기보다는 각자의 고유한 영역을 존중할 때 가장 훌륭한 밸런스를 이룹니다. ";
            }

            // 3. Temp
            if (temperature > 65) resultText += "관계의 온도는 매우 뜨겁고 맹렬하여, 열정적이고 때로는 폭발적인 감정 교류가 일어나는 불꽃 같은 만남입니다.";
            else if (temperature < 15) resultText += "관계의 온도는 서늘하고 냉철하며, 들뜬 감정보다는 이성적 신뢰를 바탕으로 조용히 스며드는 이슬 같은 만남입니다.";
            else resultText += "관계의 온도는 가장 편안한 36.5도에 가깝습니다. 함께 있을 때 계절의 극단 없이 온화하고 안락한 휴식처가 되어줍니다.";
        } else {
            if (syncScore >= 90) resultText += "Your energies fit together like perfect puzzle pieces. ";
            else if (syncScore >= 70) resultText += "Your differences act as positive synergy, creating a wonderful bond. ";
            else if (syncScore >= 50) resultText += "Similarities and differences coexist, shining brightest when you try to understand one another. ";
            else resultText += "Your strong energies may clash, acting as a challenging mirror for each other. ";

            if (uBenefitScore > 10 && pBenefitScore > 10) {
                resultText += "You mutually fill each other's voids, experiencing the blessing of energetic circulation. ";
            } else if (uBenefitScore > 10 && pBenefitScore <= 0 || uBenefitScore <= 0 && pBenefitScore > 10) {
                resultText += "There is a devoted or mentoring aspect where one side softly embraces and stabilizes the other. ";
            } else {
                 resultText += "You both have strong independent energies. The balance is best when you respect each other's boundaries rather than relying on one another. ";
            }

            if (temperature > 65) resultText += "The connection is very hot, leading to passionate and sometimes explosive emotional exchanges.";
            else if (temperature < 15) resultText += "The connection is cool and logical, building quietly on trust rather than explosive emotion.";
            else resultText += "The connection is highly comfortable, offering gentle and warm stability without extremes.";
        }
        return resultText;
    };
`;

rs = rs.replace(rsRegex, newRsLogic);
fs.writeFileSync('src/services/relationship-dynamics-service.ts', rs, 'utf-8');
console.log('Fixed relationship-dynamics-service.ts');
