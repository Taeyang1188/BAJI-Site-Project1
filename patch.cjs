const fs = require('fs');
const content = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf8');

const startPattern = `    \\[\\.\\.\\.SAMHAP_GROUPS, \\.\\.\\.BANGHAP_GROUPS\\]\\.forEach\\(group => \\{`;
const endPattern = `    \\}\\);\\n\\n    // \\[v5\\.8\\] Same-Age \\(Birth Year\\) Dynamics`;

const regex = new RegExp(startPattern + '[\\s\\S]*?' + endPattern);

const replacement = `    // [New] Cross-Chart Energy Flow (Samhap & Banghap Synergy + Mass Calculation)
    const crossMass: Record<string, number> = { 'Wood': 0, 'Fire': 0, 'Earth': 0, 'Metal': 0, 'Water': 0 };
    const crossCombos: Record<string, string[]> = { 'Wood': [], 'Fire': [], 'Earth': [], 'Metal': [], 'Water': [] };

    [...SAMHAP_GROUPS, ...BANGHAP_GROUPS].forEach(group => {
        const uHas = group.branches.filter(b => uBranches.includes(b));
        const pHas = group.branches.filter(b => pBranches.includes(b));
        const combined = Array.from(new Set([...uHas, ...pHas]));
        const count = combined.length;

        if (count === 3 && uHas.length > 0 && pHas.length > 0) {
            const shortName = group.name.replace('수국방합', '방합').replace('목국방합', '방합').replace('화국방합', '방합').replace('금국방합', '방합');
            if (uHas.length < 3 && pHas.length < 3) {
                crossMass[group.element] += 1.5;
                crossCombos[group.element].push(\`\${shortName}\`);
            } else if (uHas.length === 3 && pHas.length > 0) {
                crossMass[group.element] += 1.0;
                crossCombos[group.element].push(\`\${shortName}\`);
            } else if (pHas.length === 3 && uHas.length > 0) {
                crossMass[group.element] += 1.0;
                crossCombos[group.element].push(\`\${shortName}\`);
            } else if (uHas.length === 3 && pHas.length === 3) {
                crossMass[group.element] += 1.5;
                crossCombos[group.element].push(\`\${shortName}\`);
            }
        } else if (count === 2) {
             // Only count if it's collaborative
             if (uHas.length > 0 && pHas.length > 0 && !(uHas.length === 2 && pHas.length === 2 && uHas[0]===pHas[0]&&uHas[1]===pHas[1])) {
                 const center = group.branches[1];
                 const isWangji = ['子', '午', '卯', '酉'].includes(center) && combined.includes(center);
                 const mass = isWangji ? 0.7 : 0.3;
                 crossMass[group.element] += mass;
                 crossCombos[group.element].push(\`\${group.name.substring(0,2)}합\`);
             }
        }
    });

    const getValence = (el: string, yongHee: string[], giGu: string[]): { tier: number, name: string } => {
        if (yongHee.length > 0 && el === yongHee[0]) return { tier: 1, name: 'Vital' };
        if (yongHee.length > 1 && el === yongHee[1]) return { tier: 2, name: 'Support' };
        if (giGu.length > 1 && el === giGu[1]) return { tier: 4, name: 'Danger' };
        if (giGu.length > 0 && el === giGu[0]) return { tier: 5, name: 'Fatal' };
        if (yongHee.includes(el)) return { tier: 2, name: 'Support' };
        if (giGu.includes(el)) return { tier: 4, name: 'Danger' };
        return { tier: 3, name: 'Neutral' };
    };

    const getN = (el: string) => {
        if (el === 'Wood') return ['Metal', 'Fire'];
        if (el === 'Fire') return ['Water', 'Earth'];
        if (el === 'Earth') return ['Wood', 'Metal'];
        if (el === 'Metal') return ['Fire', 'Water'];
        if (el === 'Water') return ['Earth', 'Wood'];
        return [];
    };

    const elKORap: Record<string, string> = {'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)'};

    Object.keys(crossMass).forEach(el => {
        const mass = crossMass[el];
        if (mass === 0) return;

        const combosStr = Array.from(new Set(crossCombos[el])).join(', ');

        const uVal = getValence(el, uYongHee, uGiGu);
        const pVal = getValence(el, pYongHee, pGiGu);

        const nEls = getN(el);
        const uHasN = nEls.some(n => uYongHee.includes(n) && (userAdjustedElements[n] || 0) > 15);
        const pHasN = nEls.some(n => pYongHee.includes(n) && (partnerAdjustedElements[n] || 0) > 15);

        const uTier = uVal.tier;
        const pTier = pVal.tier;

        const uTamned = (uTier >= 4) && uHasN;
        const pTamned = (pTier >= 4) && pHasN;

        const baseScoreMap: Record<number, number> = { 1: 15, 2: 7, 3: 0, 4: -10, 5: -20 };

        let uScore = baseScoreMap[uTier] * mass;
        let pScore = baseScoreMap[pTier] * mass;

        if (uTamned) uScore = Math.abs(uScore) * 0.5; // Tamed => minor bonus
        if (pTamned) pScore = Math.abs(pScore) * 0.5;

        // Bounded score to reasonable limits
        gateBonus += Math.min(30, (uScore > 0 ? uScore : 0) + (pScore > 0 ? pScore : 0));
        gatePenalty += Math.min(30, (uScore < 0 ? Math.abs(uScore) : 0) + (pScore < 0 ? Math.abs(pScore) : 0));

        const isSurge = mass >= 1.5 || crossCombos[el].length >= 2; // threshold for surge
        const elKO = elKORap[el];
        
        let relTier = 3;
        const effectiveUTier = uTamned ? 2 : uTier;
        const effectivePTier = pTamned ? 2 : pTier;

        if (effectiveUTier >= 4 && effectivePTier >= 4) relTier = 5;
        else if (effectiveUTier >= 4 || effectivePTier >= 4) relTier = 4;
        else if (effectiveUTier <= 2 && effectivePTier <= 2) relTier = 1;
        else if (effectiveUTier <= 2 || effectivePTier <= 2) relTier = 2;

        let gateName = '';
        let gateDesc = '';

        if (isSurge) {
             if (uTamned || pTamned) {
                  gateName = isKO ? \`✨ [The Alchemist: \${elKO}의 극적인 승화]\` : \`✨ [The Alchemist: Sublimation of \${el}]\`;
                  gateDesc = isKO 
                      ? \`(Mass: \${mass.toFixed(1)}) 합(\${combosStr})으로 폭주할 뻔한 맹독의 \${elKO} 기운을 완벽히 흡수하고 승화시켜 거대한 에너지로 치환합니다.\`
                      : \`(Mass: \${mass.toFixed(1)}) A toxic surge of \${el} (\${combosStr}) is brilliantly tamed and utilized.\`;
             } else if (relTier === 5) {
                  gateName = isKO ? \`⚠️ [The Black Hole: 통제불능의 \${elKO} 폭주]\` : \`⚠️ [The Black Hole: Runaway \${el} Energy]\`;
                  gateDesc = isKO 
                      ? \`(Mass: \${mass.toFixed(1)}) 합(\${combosStr})이 중첩되어 최악의 기운인 \${elKO}가 통제 불능 상태로 폭주합니다. 서로를 수렁으로 끌어내릴 수 있습니다.\`
                      : \`(Mass: \${mass.toFixed(1)}) An overwhelming toxic surge of \${el} (\${combosStr}) drastically drains both of you.\`;
             } else if (relTier === 4) {
                  gateName = isKO ? \`🩸 [에너지 과부하: 서늘한 압박 (\${elKO})]\` : \`🩸 [Energy Overload: Cold Pressure (\${el})]\`;
                  gateDesc = isKO
                      ? \`(Mass: \${mass.toFixed(1)}) 강력한 합(\${combosStr})의 작용으로 \${elKO} 기운이 폭발하지만, 이는 한 쪽의 큰 무력감을 댓가로 삼습니다. 에너지 불균형이 극심해집니다.\`
                      : \`(Mass: \${mass.toFixed(1)}) A huge \${el} synergy forms (\${combosStr}), but acts as a heavy burden for one.\`;
             } else if (relTier === 1) {
                  gateName = isKO ? \`🏆 [골든 에너지: \${elKO} 용신의 강림]\` : \`🏆 [Golden Energy: Descent of \${el}]\`;
                  gateDesc = isKO
                      ? \`(Mass: \${mass.toFixed(1)}) 가장 필요했던 완벽한 \${elKO} 기운이 강력한 합(\${combosStr})을 통해 쏟아집니다. 한계를 부수고 비약적인 발전을 선물합니다.\` 
                      : \`(Mass: \${mass.toFixed(1)}) A massive vital \${el} energy (\${combosStr}) descends upon you both.\`;
             } else {
                  const title = {'Wood': 'Great Forest', 'Fire': 'Great Inferno', 'Earth': 'Great Mountain', 'Metal': 'Iron Storm', 'Water': 'Deep Abyss'}[el];
                  gateName = isKO ? \`🌊 [The \${title}: 압도적 \${elKO}의 파동]\` : \`🌊 [The \${title}: Overwhelming \${el}]\`;
                  gateDesc = isKO
                      ? \`(Mass: \${mass.toFixed(1)}) 사주가 강하게 결합(\${combosStr})하여 웅장한 \${elKO} 에너지를 형성합니다. 이 기운은 관계를 든든하게 받쳐주는 거대한 파동이 됩니다.\`
                      : \`(Mass: \${mass.toFixed(1)}) A magnificent \${el} energy (\${combosStr}) forms, providing strong momentum.\`;
             }
        } else {
             if (relTier === 5) {
                  gateName = isKO ? \`☠️ [맹독성 주입: 사약의 완성 (\${elKO})]\` : \`☠️ [Toxic Injection: Poisonous \${el}]\`;
                  gateDesc = isKO 
                      ? \`(Mass: \${mass.toFixed(1)}) 작지만 끈질긴 합(\${combosStr})이 맹독(\${elKO})이 되어 서로를 찌릅니다. 파괴적인 고집이 조용히 자라납니다.\`
                      : \`(Mass: \${mass.toFixed(1)}) A minor but toxic \${el} link (\${combosStr}) injects poison into the connection.\`;
             } else if (relTier === 4) {
                  gateName = isKO ? \`🍂 [에너지 과부하: 서늘한 압박 (\${elKO})]\` : \`🍂 [Energy Overload: Cold Pressure (\${el})]\`;
                  gateDesc = isKO
                      ? \`(Mass: \${mass.toFixed(1)}) 부분적인 합(\${combosStr})이 단점을 부추기는 압박으로 작용하여 관계의 피로도를 높입니다.\`
                      : \`(Mass: \${mass.toFixed(1)}) A partial \${el} energy (\${combosStr}) acts as a hidden pressure.\`;
             } else if (uTamned || pTamned) {
                  gateName = isKO ? \`🔥 [위험하지만 매력적인 도전 (\${elKO})]\` : \`🔥 [Dangerous Charm: Tamed \${el}]\`;
                  gateDesc = isKO
                      ? \`(Mass: \${mass.toFixed(1)}) 위험할 수 있는 \${elKO} 기운(\${combosStr})이 용신의 조절력 덕분에 매력적인 도전 과제로 다듬어집니다.\`
                      : \`(Mass: \${mass.toFixed(1)}) A risky \${el} link (\${combosStr}) is tamed into mutual attraction.\`;
             } else if (relTier === 1) {
                  gateName = isKO ? \`🌟 [기적의 조각: \${elKO} 용신의 조력]\` : \`🌟 [Small Miracle: Favorable \${el}]\`;
                  gateDesc = isKO
                      ? \`(Mass: \${mass.toFixed(1)}) 결합(\${combosStr})으로 파생된 \${elKO} 에너지가 두 사람의 메마른 땅을 적시는 보석 같은 힘이 됩니다.\`
                      : \`(Mass: \${mass.toFixed(1)}) A partial \${el} harmony (\${combosStr}) acts as vital support.\`;
             } else if (relTier === 2) {
                  gateName = isKO ? \`🤝 [운명의 조력: 서포트 스트림 (\${elKO})]\` : \`🤝 [Destined Help: Support Stream (\${el})]\`;
                  gateDesc = isKO
                      ? \`(Mass: \${mass.toFixed(1)}) 부분적인 합(\${combosStr})으로 파생된 \${elKO} 기운이 잔잔하게 부족한 면을 보완해줍니다.\`
                      : \`(Mass: \${mass.toFixed(1)}) The derived \${el} energy (\${combosStr}) gently supports the relationship.\`;
             }
        }

        if (gateName && relTier !== 3) {
             gates.push({ name: gateName, desc: gateDesc });
        } else if (relTier === 3 && mass > 0) {
             gates.push({ 
                 name: isKO ? \`🧩 [보조 파동: \${elKO} 에너지 흐름]\` : \`🧩 [Aux Wave: \${el} Link]\`, 
                 desc: isKO ? \`(Mass: \${mass.toFixed(1)}) 합(\${combosStr})에 의해 특별한 해악 없이 \${elKO} 에너지가 교류합니다.\` : \`(Mass: \${mass.toFixed(1)}) (\${combosStr}) increases \${el} energy smoothly.\` 
             });
        }
    });

    // [v5.8] Same-Age (Birth Year) Dynamics`;

if (regex.test(content)) {
    fs.writeFileSync('src/services/relationship-dynamics-service.ts', content.replace(regex, replacement));
    console.log('PATCH_SUCCESS');
} else {
    console.log('PATTERN_NOT_FOUND');
}
