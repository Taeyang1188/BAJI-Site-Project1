const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/services/cycle-vibe-service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const analyzeWealthStart = content.indexOf('  const analyzeWealth = () => {');
const analyzeMovingStart = content.indexOf('  const analyzeMoving = () => {');

if (analyzeWealthStart !== -1 && analyzeMovingStart !== -1) {
  const newAnalyzeWealth = `  const analyzeWealth = () => {
    const ELEMENT_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmStem = result.pillars[1].stem;
    const dmElement = BAZI_MAPPING.stems[dmStem as keyof typeof BAZI_MAPPING.stems]?.element || 'Wood';
    const dmIndex = ELEMENT_CYCLE.indexOf(dmElement);
    const wealthElement = ELEMENT_CYCLE[(dmIndex + 2) % 5];

    // Current year analysis
    const currentYearPillar = result.currentYearPillar;
    const currentYear = currentYearPillar?.year || new Date().getFullYear();
    
    // Evaluate function
    const evaluateWealthScore = (pillar: any) => {
      let score = 50;
      const sEl = BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.element;
      const bEl = BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches]?.element;
      
      if (sEl === wealthElement) score += 25;
      if (bEl === wealthElement) score += 25;
      
      if (primEl && (sEl === primEl || bEl === primEl)) score += 20;
      if (hEl && (sEl === hEl || bEl === hEl)) score += 10;
      if (gEl && (sEl === gEl || bEl === gEl)) score -= 25;

      const godsStr = (pillar.stemTenGodKo || '') + (pillar.branchTenGodKo || '');
      if (godsStr.includes('정재')) score += 15;
      if (godsStr.includes('편재')) score += 20;
      if (godsStr.includes('겁재')) score -= 15;
      if (godsStr.includes('비견')) score -= 10;

      return Math.min(Math.max(score, 0), 100);
    };

    const currentYearScore = evaluateWealthScore(currentAnnualPillar || {});
    
    // Evaluate Daewun baseline
    const daewunScore = evaluateWealthScore(currentCycle || {});

    // Find best years in current 10-year cycle
    const annualScores = (currentCycle.annualPillars || []).map((p: any) => ({
      year: p.year,
      stem: p.stem,
      branch: p.branch,
      score: evaluateWealthScore(p)
    }));

    annualScores.sort((a: any, b: any) => b.score - a.score);
    const bestYears = annualScores.filter((y: any) => y.year >= currentYear).slice(0, 2);
    
    // If no future best years left in current daewun, just take top 2 overall
    const topYearsToDisplay = bestYears.length > 0 ? bestYears : annualScores.slice(0, 2);

    let report = '';
    
    // 1. Current Daewun Overview
    const daewunLabel = \`\${currentCycle.age}세-\${currentCycle.age + 9}세 대운(\${currentCycle.stem}\${currentCycle.branch})\`;
    if (daewunScore >= 70) {
      report += lang === 'KO' 
        ? \`현재 진행 중인 \${daewunLabel}은 큰 재물의 흐름이 들어오는 황금기야. 물이 들어왔으니 힘차게 노를 저어야 할 때지.\\n\\n\`
        : \`The current \${daewunLabel} cycle brings a strong flow of wealth. It's a golden period.\\n\\n\`;
    } else if (daewunScore >= 40) {
      report += lang === 'KO' 
        ? \`현재 \${daewunLabel}은 재물이 평탄하게 흐르는 시기야. 무리한 투자보다는 안정적인 축적에 유리해.\\n\\n\`
        : \`The current \${daewunLabel} cycle has a stable wealth flow. Focus on safe accumulation.\\n\\n\`;
    } else {
      report += lang === 'KO'
        ? \`현재 \${daewunLabel}은 재물의 흐름이 다소 묶이거나 새어나가기 쉬운 방어적 시기야. 이럴 땐 큰 배팅보다는 내실을 다지고 현금 유동성을 확보하는 게 최고야.\\n\\n\`
        : \`The current \${daewunLabel} cycle is defensive for wealth. Avoid big bets and secure cash flow.\\n\\n\`;
    }

    // 2. Current Year
    if (currentYearScore >= 70) {
      report += lang === 'KO'
        ? \`올해(\${currentYear}년 \${currentYearPillar?.stem}\${currentYearPillar?.branch}년)는 특히 돋보이는 재물운을 가지고 있어! 성과가 보상으로 직결되는 짜릿한 한 해가 될 가능성이 높아.\\n\\n\`
        : \`This year (\${currentYear}) highlights exceptionally strong wealth luck! Hard work directly translates to rewards.\\n\\n\`;
    } else if (currentYearScore >= 40) {
      report += lang === 'KO'
        ? \`올해(\${currentYear}년 \${currentYearPillar?.stem}\${currentYearPillar?.branch}년)의 재물운은 무난한 흐름이야. 계획했던 대로 차곡차곡 모아가는 재미를 느껴봐.\\n\\n\`
        : \`This year (\${currentYear}) features ordinary but stable wealth luck. Follow your plans.\\n\\n\`;
    } else {
      report += lang === 'KO'
        ? \`올해(\${currentYear}년 \${currentYearPillar?.stem}\${currentYearPillar?.branch}년)는 재물운이 잠시 쉬어가는 해(점수: \${currentYearScore}점)야. 예상치 못한 지출이나 충동구매의 유혹이 강할 수 있어.\\n\`
          + \`[액땜 꿀팁] 큰 돈이 나갈 뻔한 위기를 '나를 위한 자기계발 투자'나 '오래 쓸 수 있는 좋은 물건 구매'로 스스로 돈의 흐름을 긍정적으로 바꿔보는(액땜) 걸 추천해. 어차피 나갈 돈이라면 가치 있게 쓰는 거지!\\n\\n\`
        : \`This year (\${currentYear}) brings a pause in wealth luck. Watch out for unexpected expenses.\\n\` 
          + \`[Remedy] Consider \"warding off\" bad luck by actively spending on self-development. If money must flow out, make it valuable for your future!\\n\\n\`;
    }

    // 3. Best upcoming years
    if (topYearsToDisplay.length > 0) {
      const yearListKO = topYearsToDisplay.map((y: any) => \`\${y.year}년(\${y.stem}\${y.branch}년)\`).join(', ');
      const yearListEN = topYearsToDisplay.map((y: any) => \`\${y.year}\`).join(', ');
      
      report += lang === 'KO'
        ? \`지금 대운 안에서 **가장 돈 냄새가 짙게 나는 해는 \${yearListKO}**야. 이 시기를 위해 지금부터 씨드머니를 장전하고 타점을 노려봐.\`
        : \`In this 10-year cycle, the **most lucrative years are \${yearListEN}**. Prepare your seed money for these prime timings.\`;
    }

    const glitch = currentYearScore < 50 
      ? (lang === 'KO' ? '비가 올 땐 독에 금이 가지 않았는지 점검할 때야.' : 'Check your jars for cracks when it rains.')
      : (lang === 'KO' ? '탐욕은 눈을 가리지만, 현명한 투자는 시야를 넓혀줘.' : 'Greed blinds, but wise investment broadens vision.');

    return { main: report, glitch };
  };
`;

  content = content.substring(0, analyzeWealthStart) + newAnalyzeWealth + content.substring(analyzeMovingStart);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully replaced analyzeWealth.");
} else {
  console.error("Could not find insertion points.");
}
