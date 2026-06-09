import fs from 'fs';
let code = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf8');

const regex = /\/\/ PAST OR FUTURE LOGIC[\s\S]*?if \(\!interpretation\) interpretation = \`당신의 사주 구조 내에서 \$\{tenGodRoleKo\} 기운이 전면으로 나서며 삶의 엔진을 강하게 회전시키고 있습니다\.\`;/;

const replacement = `// PAST OR FUTURE LOGIC
            let interpretation = "";
            const featuresStr = (result?.analysis?.balanceWarnings || []).map((w: any) => w.title).join(' ');
            const specialCombos = (result?.analysis?.specialCombinations || []).map((c: any) => c.title).join(' ');
            
            // 1. Blend in Combos (식상생재, 살인상생, etc)
            let comboAddon = "";
            if (specialCombos.includes("살인상생") || specialCombos.includes("관인상생")) {
                if (diff === 4) comboAddon = " 원국에 흐르는 살인상생의 기틀이 인성(인정, 수용)을 만나 마침내 당신의 권위와 명예로 환산되는 시기입니다.";
            } else if (specialCombos.includes("식상생재")) {
                if (diff === 2) comboAddon = " 타고난 식상생재의 사업적 감각이 재성(물질적 수확)을 만나며, 그동안 뿌린 땀방울이 거대한 금전적 결실로 폭발합니다.";
            } else if (specialCombos.includes("식신제살")) {
                if (diff === 1) comboAddon = " 당신의 명식에 각인된 식신제살의 야성이 폭발합니다. 불합리한 억압을 깨부수고 리더십을 확고히 다지게 됩니다.";
            } else if (specialCombos.includes("재극인")) {
                if (diff === 4 || diff === 2) comboAddon = " 재극인의 딜레마(이상과 현실의 충돌)가 수면 위로 극대화됩니다. 영리를 좇다 명예를 놓치지 않도록 신중해야 합니다.";
            }

            // 2. Base + ShinGang/ShinYak Structure
            if (featuresStr.includes("관살") || featuresStr.includes("관성")) {
                if (diff === 3 || diff === 2) { 
                    interpretation = \`자신을 억누르던 외부의 통제력과 책임감(\$\{tenGodRoleKo\})이 최고조에 달합니다. 억압이 심화되는 만큼 독립적인 숨통을 트는 것이 최우선입니다.\`;
                } else if (diff === 0 || diff === 1) {
                    interpretation = \`무거운 압박감을 벗어던지고 온전한 나의 목소리(\$\{tenGodRoleKo\})를 내며 해방되는 시기입니다. 억눌림에서 벗어나 강한 궤도를 개척합니다.\`;
                } else {
                    interpretation = \`오행의 변화가 \$\{tenGodRoleKo\}으로 작용하며, 삶의 무게를 수용하고 내면을 단단히 다지게 됩니다.\`;
                }
            } else if (featuresStr.includes("재다") || featuresStr.includes("재성")) {
                 if (diff === 0 || diff === 4) {
                     interpretation = \`흔들리던 현실의 기반을 단단히 붙잡아줄 든든한 \$\{tenGodRoleKo\} 기운이 들어옵니다. 그토록 원했던 주도권을 쟁취하게 될 것입니다.\`;
                 } else {
                     interpretation = \`물질적, 현실적 결과(\$\{tenGodRoleKo\})에 대한 갈망이 커집니다. 과도한 확장을 경계하고 실속을 차리는 전략이 필요합니다.\`;
                 }
            } else {
                 if (isStrong) {
                     if (diff === 1 || diff === 2 || diff === 3) {
                         interpretation = \`중화신강(혹은 신강)한 당신의 명식에 강력한 \$\{tenGodRoleKo\} 기운이 작용합니다. 넘치는 에너지를 사회적으로 배출하고 마침내 잠재력을 터뜨리는 시기입니다.\`;
                     } else {
                         interpretation = \`이미 강한 자아에 \$\{tenGodRoleKo\} 에너지가 더해져 더욱 강한 주도권을 쥐지만, 독단에 빠지지 않도록 유치한 고집을 버려야 합니다.\`;
                     }
                 } else {
                     if (diff === 0 || diff === 4) {
                         interpretation = \`약해졌던 자아에 든든한 지원군(\$\{tenGodRoleKo\})이 합류합니다. 자신감을 되찾고 세상의 중심에 우뚝 서는 강력한 도약기입니다.\`;
                     } else {
                         interpretation = \`신약한 기반에 \$\{tenGodRoleKo\} 기운이 몰아쳐 현실적 무게감이 다소 버거울 수 있습니다. 무리한 확장보다 멘탈 붕괴를 막는 안정이 필수입니다.\`;
                     }
                 }
            }

            interpretation += comboAddon;
            if (!interpretation) interpretation = \`당신의 명식 구조 내에서 \$\{tenGodRoleKo\} 기운이 전면으로 나서며 삶의 엔진을 강하게 회전시키고 있습니다.\`;`;

const newCode = code.replace(/\/\/ PAST OR FUTURE LOGIC[\s\S]*?if \(\!interpretation\) interpretation = \`당신의 사주 구조 내에서 \$\{tenGodRoleKo\} 기운이 전면으로 나서며 삶의 엔진을 강하게 회전시키고 있습니다\.\`;/, replacement);
fs.writeFileSync('src/services/timeline-briefing-service.ts', newCode);
console.log('Fixed Past/Future Logic with Combos');
