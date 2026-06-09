import fs from 'fs';
let code = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf8');

const target1 = `            if (isEasterEgg) {
                resultText += "\\n\\n🌡️ 온도계 예측: [라이벌 연대] 극단적으로 맞닿은 뜨겁거나 차가운 온도가 오히려 둘을 뭉치게 하는 기적적인 시너지의 온도입니다.";
            } else if (syncScore < 40) {
                 resultText += "\\n\\n🌡️ 온도계 예측: [서늘한 긴장감] 풀어야 할 업보(Karma)가 공존하는 온도입니다.\\n";
                 resultText += "\\n🛡️ [Clash Reason] 구조적인 오행 충돌로 인해 같은 상황에서도 완전히 다른 언어를 사용하게 됩니다.\\n";
                 resultText += "🤝 [Mediator] 서로의 부족함을 보완할 수 있는 통관신(중재 기운)을 의식적으로 찾아야 합니다. 직접 맞붙기보단 제3자나 취미를 매개로 소통하세요.\\n";
                 resultText += "⚡ [Action Guide] 감정적 융화보다는 서로의 다름을 직시하고 한 발짝 물러서는 신중한 거리가 필요합니다.";
            } else {`;

const replace1 = `            if (isEasterEgg) {
                resultText += "\\n\\n🌡️ 온도계 예측: [라이벌 연대] 극단적으로 맞닿은 뜨겁거나 차가운 온도가 오히려 둘을 뭉치게 하는 기적적인 시너지의 온도입니다.";
            } else if (syncScore < 40 || branchInteraction === 'wonjin' || branchInteraction === 'chung') {
                 resultText += "\\n\\n🌡️ 온도계 예측: [서늘한 긴장감] 풀어야 할 업보(Karma)가 공존하는 온도입니다.\\n";
                 resultText += "\\n🛡️ [Clash Reason] 구조적인 오행 충돌(원진/충 등)로 인해 같은 상황에서도 완전히 다른 언어를 사용하게 됩니다.\\n";
                 resultText += "🤝 [Mediator] 서로의 부족함을 보완할 수 있는 통관신(중재 기운)을 의식적으로 찾아야 합니다. 직접 맞붙기보단 제3자나 취미를 매개로 소통하세요.\\n";
                 resultText += "⚡ [Action Guide] 감정적 융화보다는 서로의 다름을 직시하고 한 발짝 물러서는 신중한 거리가 필요합니다.";
            } else {`;

code = code.replace(target1, replace1);

const target2 = `            if (isEasterEgg) {
                resultText += "\\n\\n🌡️ Temperature: [Rival Synergy] Extreme identical temperatures forge a miraculous and unstoppable synergy for you both.";
            } else if (syncScore < 40) {
                 resultText += "\\n\\n🌡️ Temperature: [Cool Tension]\\n\\n🛡️ [Clash Reason] Structural element clash causes you to speak completely different languages.\\n🤝 [Mediator] Find a mediator element or a third-party hobby for smoother communication.\\n⚡ [Action Guide] A temperature of unresolved karma. Cautious distance is needed.";
            } else {`;

const replace2 = `            if (isEasterEgg) {
                resultText += "\\n\\n🌡️ Temperature: [Rival Synergy] Extreme identical temperatures forge a miraculous and unstoppable synergy for you both.";
            } else if (syncScore < 40 || branchInteraction === 'wonjin' || branchInteraction === 'chung') {
                 resultText += "\\n\\n🌡️ Temperature: [Cool Tension]\\n\\n🛡️ [Clash Reason] Structural element clash (Wonjin/Chung) causes you to speak completely different languages.\\n🤝 [Mediator] Find a mediator element or a third-party hobby for smoother communication.\\n⚡ [Action Guide] A temperature of unresolved karma. Cautious distance is needed.";
            } else {`;

code = code.replace(target2, replace2);

fs.writeFileSync('src/services/relationship-dynamics-service.ts', code);
console.log('Fixed Relationship Dynamics text visibility');
