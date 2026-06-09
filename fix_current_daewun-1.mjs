import fs from 'fs';
let code = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf8');

const target = `           if (featuresStr.includes("관살") || featuresStr.includes("관성")) {
               if (currentTenGod === '식상') {
                   interpretation = \`내면의 관살(압박, 통제)이 당신을 옥죄던 상황에서, 마침내 그것을 쳐낼 예리한 무기(상관/식신)를 손에 쥐었습니다. 참는 자가 이기는 시대는 끝났습니다. 이제는 나의 목소리를 내어 현실의 유리천장을 깨고 주도권을 되찾는 역동의 시기입니다.\`;
               } else if (currentTenGod === '재성') {
                   interpretation = \`일만 하고 성과는 보이지 않던 시야가 트입니다. 그간 쌓아온 관살(책임)의 하중이 재성(현실적 결실)으로 치환되어 손에 잡히는 수확이 생깁니다. 단, 재성이 관성을 더욱 무겁게 할 수 있으니 무리한 확장보다 확실한 내실 다지기에 집중하세요.\`;
               } else {
                   interpretation = \`당신을 둘러싼 과도한 통제력(관살)에 또 다른 \$\{currentTenGod\} 기운이 더해졌습니다. 무게중심이 옮겨가는 과도기입니다. 섣불리 틀을 부수려 하기보단 뿌리를 내리는 깊이 있는 통찰이 요구됩니다.\`;
               }
           } else if (featuresStr.includes("재다") || featuresStr.includes("재성")) {
               if (currentTenGod === '비겁' || currentTenGod === '인성') {
                   interpretation = \`흔들리던 현실의 기반을 단단히 붙잡아줄 든든한 방패를 얻었습니다. 헛돌던 에너지는 폭주를 멈추고 온전히 나의 자산으로 안착할 것입니다.\`;
               } else {
                   interpretation = \`끝없는 현실적 욕망과 갈증에 불을 지피는 \$\{currentTenGod\} 기운이 지배하고 있습니다. 지금 당신이 쥐어야 할 것은 넓은 바다가 아니라 길을 잃지 않을 나침반입니다.\`;
               }
           } else {
               interpretation = \`당신의 사주 구조 내에서 \$\{currentTenGod\} 기운이 전면으로 나서며 삶의 엔진을 강하게 회전시키고 있습니다. 머물렀던 과거와 작별하고 온전한 자기 확신으로 나아가야 할 때입니다.\`;
           }`;

const replace = `           const specialCombosCurrent = (result?.analysis?.specialCombinations || []).map((c: any) => c.title).join(' ');
           let comboAddonCur = "";
           if (specialCombosCurrent.includes("살인상생") || specialCombosCurrent.includes("관인상생")) {
               if (currentTenGod === '인성') comboAddonCur = " 특히 당신의 명식에 내재된 살인상생의 잠재력이 폭발하여, 주변의 곱지 않은 시선이나 억압이 오히려 당신의 명예와 커리어 상승으로 역전되는 짜릿한 성취의 시기입니다.";
           } else if (specialCombosCurrent.includes("식상생재")) {
               if (currentTenGod === '재성' || currentTenGod === '식상') comboAddonCur = " 원국에 흐르는 식상생재의 탁월한 기운이 새로운 대운과 맞물려, 당신의 재능과 아이디어가 거침없이 현금 흐름으로 직결되는 황금기입니다.";
           } else if (specialCombosCurrent.includes("식신제살")) {
               if (currentTenGod === '식상' || currentTenGod === '관성') comboAddonCur = " 식신제살의 날카로운 투기가 발동하여, 당신을 옥죄던 낡은 시스템과 라이벌을 정면으로 돌파하고 강력한 카리스마로 무리를 이끌게 됩니다.";
           }

           if (featuresStr.includes("관살") || featuresStr.includes("관성")) {
               if (currentTenGod === '식상') {
                   interpretation = \`내면의 관살(압박, 통제)이 당신을 옥죄던 상황에서, 마침내 그것을 쳐낼 예리한 무기(상관/식신)를 손에 쥐었습니다. 참는 자가 이기는 시대는 끝났습니다. 이제는 나의 목소리를 내어 현실의 유리천장을 깨고 주도권을 되찾는 역동의 시기입니다.\`;
               } else if (currentTenGod === '재성') {
                   interpretation = \`일만 하고 성과는 보이지 않던 시야가 트입니다. 그간 쌓아온 관살(책임)의 하중이 재성(현실적 결실)으로 치환되어 손에 잡히는 수확이 생깁니다. 단, 재성이 관성을 더욱 무겁게 할 수 있으니 무리한 확장보다 확실한 내실 다지기에 집중하세요.\`;
               } else {
                   interpretation = \`당신을 둘러싼 과도한 통제력(관살)에 또 다른 \$\{currentTenGod\} 기운이 더해졌습니다. 무게중심이 옮겨가는 과도기입니다. 섣불리 틀을 부수려 하기보단 뿌리를 내리는 깊이 있는 통찰이 요구됩니다.\`;
               }
           } else if (featuresStr.includes("재다") || featuresStr.includes("재성")) {
               if (currentTenGod === '비겁' || currentTenGod === '인성') {
                   interpretation = \`흔들리던 현실의 기반을 단단히 붙잡아줄 든든한 방패를 얻었습니다. 헛돌던 에너지는 폭주를 멈추고 온전히 나의 자산으로 안착할 것입니다.\`;
               } else {
                   interpretation = \`끝없는 현실적 욕망과 갈증에 불을 지피는 \$\{currentTenGod\} 기운이 지배하고 있습니다. 지금 당신이 쥐어야 할 것은 넓은 바다가 아니라 길을 잃지 않을 나침반입니다.\`;
               }
           } else {
               if (isStrong) {
                   interpretation = \`중화신강(혹은 신강)한 당신의 단단한 자아 위에 \$\{currentTenGod\} 기운이 전면으로 나섰습니다. 넘치는 에너지를 마음껏 발산하며 머물렀던 과거와 작별하고 확신을 향해 엑셀을 밟아도 좋은 때입니다.\`;
               } else {
                   interpretation = \`다소 방어적이었던(신약) 당신의 사주 구조 내에서 \$\{currentTenGod\} 기운이 전면으로 나서 삶의 엔진을 회전시킵니다. 불안했던 과거와 작별하고 자기 확신을 채워나갈 과도기입니다.\`;
               }
           }
           interpretation += comboAddonCur;
           `;

code = code.replace(target, replace);
fs.writeFileSync('src/services/timeline-briefing-service.ts', code, 'utf8');
console.log('Fixed current daewun logic combos');
