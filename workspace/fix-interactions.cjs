const fs = require('fs');
const file = 'src/services/cycle-vibe-service.ts';
let code = fs.readFileSync(file, 'utf8');

const replacement = `const type = int.interactionType;
        const target = int.cycle === 'daewun x seun' ? '대운과 세운 사이' : (int.cycle === 'daewun' ? '사주 원국과 대운' : '사주 원국과 세운');
        const targetEn = int.cycle === 'daewun x seun' ? 'between Life Seasons and annual alignment' : (int.cycle === 'daewun' ? 'between Natal Chart and Life Seasons' : 'between Natal Chart and annual alignment');
        
        let descKo = ''; let descEn = '';
        
        const getBranchNameKO = (idx) => ["년지", "월지", "일지", "시지"][idx] || "지표";
        const getBranchNameEN = (idx) => ["Year Branch", "Month Branch", "Day Branch", "Hour Branch"][idx] || "Branch";
        
        const formatB = (branch) => {
          if(!branch) return '';
          const el = BAZI_MAPPING.branches[branch]?.element || "Wood";
          const color = ELEMENT_COLORS[el] || "#FFFFFF";
          return \`[#\${color}:\${branch}]\`;
        };

        const formTitleKO = int.cycle === 'daewun x seun' 
           ? \`대운 \${formatB(int.natalBranch)}와 세운 \${formatB(int.cycleBranch)}\`
           : (int.cycle === 'daewun' ? \`원국 \${getBranchNameKO(int.natalIndex)} \${formatB(int.natalBranch)}와 대운 \${formatB(int.cycleBranch)}\`
                                     : \`원국 \${getBranchNameKO(int.natalIndex)} \${formatB(int.natalBranch)}와 세운 \${formatB(int.cycleBranch)}\`);
                                     
        const formTitleEN = int.cycle === 'daewun x seun'
           ? \`Life Season \${formatB(int.natalBranch)} and Annual \${formatB(int.cycleBranch)}\`
           : (int.cycle === 'daewun' ? \`Natal \${getBranchNameEN(int.natalIndex)} \${formatB(int.natalBranch)} and Life Season \${formatB(int.cycleBranch)}\`
                                     : \`Natal \${getBranchNameEN(int.natalIndex)} \${formatB(int.natalBranch)} and Annual \${formatB(int.cycleBranch)}\`);

        if (type.includes('귀문') && type.includes('원진')) {
          descKo = \`\${formTitleKO}가 만나 강력한 예민함과 무의식적 집착(원진/귀문)이 형성되고 있어. 주관적인 원망이나 과도한 완벽주의로 스스로를 갉아먹지 않도록 극도로 객관화하는 연습이 필요해.\`;
          descEn = \`\${formTitleEN} create a strong sensitivity and unconscious obsession [tooltip:Resentment/Ghost Gate|원진/귀문살. 예민함, 직관력, 집착, 원망 등을 의미합니다.|Wonjin/Gwimun. Indicates high sensitivity, intuition, obsession, or resentment.]. Avoid self-destructive perfectionism or resentment by actively seeking objective feedback.\`;
        } else if (type.includes('귀문')) {
          descKo = \`\${formTitleKO}가 만나 직관력과 예민함(귀문관살)이 극도로 고조되는 흐름이야. 이 예민함을 무너짐이 아닌 예술적 영감이나 정교한 기술로 승화시키면 독보적인 아웃풋이 터질 수 있어.\`;
          descEn = \`\${formTitleEN} peak intuition and extreme sensitivity [tooltip:Ghost Gate|귀문관살. 뛰어난 직관력과 예술적 영감, 혹은 극심한 예민함을 의미합니다.|Gwimun. Indicates brilliant intuition, artistic inspiration, or extreme emotional sensitivity.]. Sublimating this sensitivity into artistic inspiration or fine technical skills will produce unmatched results.\`;
        } else if (type.includes('원진')) {
          descKo = \`\${formTitleKO}가 만나 이유 없는 미움과 갈등(원진살)이 발생하기 쉬운 때야. 상황이 예상대로 흐르지 않아도, 이를 방해가 아닌 내실을 다지는 정교화 과정으로 받아들이는 마음가짐이 핵심이야.\`;
          descEn = \`\${formTitleEN} easily cause unexplained friction and resentment [tooltip:Resentment|원진살. 이유 없는 갈등, 미움, 혹은 섬세한 감수성을 의미합니다.|Wonjin. Indicates unexplained friction, animosity, or delicate sensibility.]. Treat unexpected delays not as roadblocks, but as refinement processes.\`;
        } else if (type.includes('육합')) {
          descKo = \`\${formTitleKO}가 부드럽게 결합(육합)하며 새로운 관계나 뜻밖의 다정한 조력자가 등장할 수 있어. 정서적 안정감이 배가되는 매우 긍정적인 신호야.\`;
          descEn = \`\${formTitleEN} softly bond [tooltip:Combination|육합. 다정하고 부드러운 화합과 결속을 의미합니다.|Yuk-hap (Six Combination). Indicates a soft, affectionate bond and harmony.], welcoming new relationships or unexpected allies. It brings emotional stability.\`;
        } else if (type.includes('형')) {
          descKo = \`\${formTitleKO}에 스스로 볶아치는 에너지나 복잡한 조율, 수술, 법적 요소(형살)가 작용해. 완벽주의 때문에 다 된 밥을 스스로 엎어버리는 습관을 각별히 경계해야 해.\`;
          descEn = \`\${formTitleEN} trigger punitive, reconstructive energy [tooltip:Punishment|형살. 조정, 수술, 법적 문제 혹은 완벽주의적 자기 검열을 의미합니다.|Hyeong (Punishment). Indicates adjustment, surgery, legal matters, or perfectionistic self-censorship.]. Be cautious of self-sabotage caused by excessive perfectionism or rigidity.\`;
        } else if (type.includes('충')) {
          descKo = \`\${formTitleKO}가 강하게 충돌(충살)하며 낡은 것을 부수고 새로운 질서를 세우는 역동적인 전개가 예상돼. 급격한 변화를 두려워하지 말고 돌파해.\`;
          descEn = \`\${formTitleEN} clash fiercely [tooltip:Clash|충살. 강한 충돌, 이동, 역동적인 변화와 발전을 의미합니다.|Clash. Indicates strong impact, movement, dynamic change, and breakthrough.], dismantling the old to build new order. Embrace dynamic changes and breakthroughs confidently.\`;
        } else if (type.includes('파') || type.includes('해')) {
          descKo = \`\${formTitleKO}가 만나 사소한 엇갈림이나 내부적인 조정(파/해)이 생길 수 있어. 인간관계나 계약에 있어 넘겨짚지 말고 문서와 팩트를 꼼꼼하게 교차 검증해야 하는 시기야.\`;
          descEn = \`\${formTitleEN} encounter minor misalignments or hidden harms [tooltip:Destruction/Harm|파/해. 내부적인 조정, 사소한 엇갈림, 숨겨진 흠집을 의미합니다.|Pa/Hae (Destruction/Harm). Indicates internal adjustments, minor misalignments, or hidden flaws.]. Double-check contracts and interpersonal details carefully.\`;
        }

        if (descKo) koNotes.push(\`- \${descKo}\`);
        if (descEn) enNotes.push(\`- \${descEn}\`);`;

const regex = /const type = int\.interactionType;[\s\S]*?if\s*\(descEn\)\s*enNotes\.push\(`-\s*\$\{descEn\}`\);/g;

code = code.replace(regex, replacement);

fs.writeFileSync(file, code);
console.log('Done replacement');
