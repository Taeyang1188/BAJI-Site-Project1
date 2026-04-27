import fs from 'fs';
let code = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf8');

const target1 = `           const specialCombosCurrent = (result?.analysis?.specialCombinations || []).map((c: any) => c.title).join(' ');
           let comboAddonCur = "";
           if (specialCombosCurrent.includes("살인상생") || specialCombosCurrent.includes("관인상생")) {
               if (currentTenGod === '인성') comboAddonCur = " 특히 당신의 명식에 내재된 살인상생의 잠재력이 폭발하여, 주변의 곱지 않은 시선이나 억압이 오히려 당신의 명예와 커리어 상승으로 역전되는 짜릿한 성취의 시기입니다.";
           } else if (specialCombosCurrent.includes("식상생재")) {
               if (currentTenGod === '재성' || currentTenGod === '식상') comboAddonCur = " 원국에 흐르는 식상생재의 탁월한 기운이 새로운 대운과 맞물려, 당신의 재능과 아이디어가 거침없이 현금 흐름으로 직결되는 황금기입니다.";
           } else if (specialCombosCurrent.includes("식신제살")) {
               if (currentTenGod === '식상' || currentTenGod === '관성') comboAddonCur = " 식신제살의 날카로운 투기가 발동하여, 당신을 옥죄던 낡은 시스템과 라이벌을 정면으로 돌파하고 강력한 카리스마로 무리를 이끌게 됩니다.";
           }`;

const replace1 = `           let comboAddonCur = "";`;

code = code.replace(target1, replace1);

const target2 = `            const specialCombos = (result?.analysis?.specialCombinations || []).map((c: any) => c.title).join(' ');
            
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
            }`;

const replace2 = `            let comboAddon = "";`;

code = code.replace(target2, replace2);

fs.writeFileSync('src/services/timeline-briefing-service.ts', code, 'utf8');
console.log('Fixed invalid map on specialCombinations object');
