import fs from 'fs';

let rs = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');

const regex = /else if \(temperature < 15\) \{[\s\S]*?\} else \{/;

const replacement = `else if (temperature < 15) {
                     const bothCold = (uElements['Water'] > 30 || uElements['Metal'] > 30) && (pElements['Water'] > 30 || pElements['Metal'] > 30);
                     if (bothCold) {
                        resultText += "\\n\\n🌡️ 온도계 예측: [조후 급랭/빙점] 극단적으로 차가운 빙점의 온도입니다. 두 사람 모두에게 금/수(金/水) 기운이 강하게 교차하며 뼈를 에이는 듯한 심리적 위축이나 소외감이 발생할 수 있습니다. 따뜻한 성찰과 현실적인 거리를 유지하며 얼음이 녹기를 기다리는 지혜가 필요합니다.";
                     } else {
                        resultText += "\\n\\n🌡️ 온도계 예측: [냉철/침착] 이성적 신뢰를 바탕으로 조용히 스며드는 시기. 들뜬 감정보다는 서로의 일상을 지켜주는 차분한 온도입니다.";
                     }
                 } else {`;

rs = rs.replace(regex, replacement);

fs.writeFileSync('src/services/relationship-dynamics-service.ts', rs, 'utf-8');
console.log("Fixed relation temp");
