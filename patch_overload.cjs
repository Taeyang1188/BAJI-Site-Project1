const fs = require('fs');
const content = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf8');

let newContent = content.replace(/combos: string\[\];/, "combos: string[];\n        uTierEff: number;\n        pTierEff: number;");
newContent = newContent.replace(/combos: Array\.from\(new Set\(crossCombos\[el\]\)\)/, "combos: Array.from(new Set(crossCombos[el])),\n            uTierEff: effectiveUTier,\n            pTierEff: effectivePTier");

const payload = `        } else if (type === 'OVERLOAD' || type === 'COLD_PRESSURE') {
            gateName = isKO ? \`🩸 [에너지 과부하: 서늘한 압박 (\${elKOs})]\` : \`🩸 [Energy Overload: Cold Pressure (\${els})]\`;
            
            const uBurden = badges.some(b => b.uTierEff >= 4);
            const pBurden = badges.some(b => b.pTierEff >= 4);
            let targetKO = '한 쪽';
            let targetEN = 'one';
            if (uBurden && !pBurden) {
                 targetKO = '당신(나)';
                 targetEN = 'you';
            } else if (!uBurden && pBurden) {
                 targetKO = '상대방';
                 targetEN = 'your partner';
            } else if (uBurden && pBurden) {
                 targetKO = '서로';
                 targetEN = 'both of you';
            }

            gateDesc = isKO
                ? \`합의 작용으로 \${elKOs} 기운이 증폭되지만, 이는 \${targetKO}의 큰 무력감을 댓가로 삼아 에너지 불균형이 극심해집니다.\\n\\n<span class="text-[10px] text-rose-400 opacity-80">\${comboTags}</span>\`
                : \`Huge \${els} synergy forms, but acts as a heavy burden for \${targetEN}.\\n\\n<span class="text-[10px] text-rose-400 opacity-80">\${comboTags}</span>\`;`;

const regex = /\} else if \(type === 'OVERLOAD' \|\| type === 'COLD_PRESSURE'\) \{[\s\S]*?: `Huge \$\{els\} synergy forms, but acts as a heavy burden for one\.\\n\\n<span class="text-\[10px\] text-rose-400 opacity-80">\$\{comboTags\}<\/span>`;/;

if (regex.test(newContent)) {
    newContent = newContent.replace(regex, payload);
    fs.writeFileSync('src/services/relationship-dynamics-service.ts', newContent);
    console.log("PATCHED");
} else {
    console.log("NOT FOUND");
}
