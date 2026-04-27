import fs from 'fs';

let content = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf-8');

const regex = /  const partnerAnalysisMemo = useMemo\(\(\) => \{\n[\s\S]*?  \}, \[partnerResult, result, lang\]\);\n/;

const newCode = `  const partnerAnalysisMemo = useMemo(() => {
    if (!partnerResult) return null;

    const dyn = calculateRelationshipDynamics(result, partnerResult, adjustedElements, partnerAdjustedElements || {}, lang as 'KO' | 'EN');

    let titleSync = lang === 'KO' ? '무난하고 현실적인 동행' : 'Stable & Practical Connection';
    if (dyn.syncScore >= 95) titleSync = lang === 'KO' ? '✨ 천생연분 (영혼의 단짝)' : '✨ Soulmates (Karmic Bond)';
    else if (dyn.syncScore >= 85) titleSync = lang === 'KO' ? '🔥 찰떡궁합 (최고의 시너지)' : '🔥 Top-tier Synergy';
    else if (dyn.syncScore >= 70) titleSync = lang === 'KO' ? '🤝 상호보완적 조력자' : '🤝 Great Supporters';
    else if (dyn.syncScore <= 40) titleSync = lang === 'KO' ? '🌪️ 거센 마찰과 성장의 과제' : '🌪️ Friction and Growth';

    let syncTierText = lang === 'KO' ? '적합' : 'Good';
    let syncColor = 'bg-fuchsia-400';
    let syncIcon = '✅';

    if (dyn.syncScore >= 90) { syncTierText = lang === 'KO' ? '완벽' : 'Perfect'; syncColor = 'bg-rose-500'; syncIcon = '💘'; }
    else if (dyn.syncScore >= 70) { syncTierText = lang === 'KO' ? '우수' : 'Excellent'; syncColor = 'bg-fuchsia-500'; syncIcon = '✨'; }
    else if (dyn.syncScore >= 50) { syncTierText = lang === 'KO' ? '보통' : 'Average'; syncColor = 'bg-fuchsia-300'; syncIcon = '🤝'; }
    else { syncTierText = lang === 'KO' ? '주의' : 'Warning'; syncColor = 'bg-white/30'; syncIcon = '⚠️'; }

    let bridgeText = lang === 'KO' ? '서로의 에너지가 자연스럽게 융화되는 구간입니다.' : 'Your energies blend naturally.';
    if (dyn.syncScore >= 85) bridgeText = lang === 'KO' ? '서로가 서로에게 부족한 기운을 넘치게 채워주는 강력한 보완 관계입니다.' : 'A powerful complementary relationship where both fill each other\\'s void.';
    else if (dyn.syncScore <= 40) bridgeText = lang === 'KO' ? '서로의 주관과 기운이 강하게 부딪칠 수 있으니, 한 발짝 물러서는 여유가 필요합니다.' : 'Strong energies clash; taking a step back and giving space is recommended.';

    if (dyn.isEasterEgg) {
        titleSync = lang === 'KO' ? '🚨 비상 규격 외의 인연 (Easter Egg)' : '🚨 Out-of-Bounds Fate (Easter Egg)';
        syncColor = 'bg-fuchsia-500';
        syncIcon = '⚡';
        bridgeText = lang === 'KO' 
            ? \`사주의 특수 법칙에 따라 0에 수렴해야 할 점수가 반전되어 도출된, 극도로 치명적이고 강렬한 기운의 끌림입니다.\` 
            : \`A rare twist of fate—an intense, rule-breaking attraction derived from special energetic structures.\`;
    }

    return { 
        text: dyn.text, 
        relation: dyn.relation, 
        isGlowing: dyn.isGlowing, 
        syncScore: dyn.syncScore, 
        temperature: dyn.temperature, 
        titleSync, 
        isEasterEgg: dyn.isEasterEgg,
        syncTierText,
        syncColor,
        syncIcon,
        bridgeText,
        gates: dyn.gates
    };
  }, [partnerResult, result, lang, adjustedElements, partnerAdjustedElements]);
`;

if (regex.test(content)) {
    content = content.replace(regex, newCode);
    
    // Add import if missing
    if (!content.includes('calculateRelationshipDynamics')) {
      content = content.replace("import { TimelineNarrative } from '../types';", "import { TimelineNarrative } from '../types';\\nimport { calculateRelationshipDynamics } from '../services/relationship-dynamics-service';");
    }

    fs.writeFileSync('src/components/DestinyMapSection.tsx', content, 'utf-8');
    console.log("Replaced successfully!");
} else {
    console.log("No match found.");
}
