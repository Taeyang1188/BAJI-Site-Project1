const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/services/cycle-vibe-service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const analyzeMarriageTimingStart = content.indexOf('  const analyzeMarriageTiming = () => {');
const analyzeWealthStart = content.indexOf('  const analyzeWealth = () => {');

if (analyzeMarriageTimingStart !== -1 && analyzeWealthStart !== -1) {
  const newAnalyzeMarriageTiming = `  const analyzeMarriageTiming = () => {
    if (gender === 'non-binary' || gender === 'prefer-not-to-tell') {
      const main = lang === 'KO' ? 
        \`잠시만, 네 인연을 스캔하려다 렉 걸렸어. [delay:1500]\\n\\n명리학은 음양의 조화가 핵심이라 생물학적 성별이 꽤 중요하거든. 더 소름 돋는 분석을 위해 생물학적 성별로 다시 한번만 알려줄래? 네 진짜 에너지를 제대로 읽어보고 싶어.\` :
        \`I paused while scanning your relationship timeline. [delay:1500]\\n\\nIn Bazi, relationship and marriage luck are often interpreted differently based on Yin and Yang (biological sex). For a more accurate timeline, could you gently re-enter your information using your biological sex? I want to understand your unique energy more deeply.\`;
      return { main, glitch: '' };
    }

    const currentYear = new Date().getFullYear();
    const isFemale = gender === 'female';
    const isMale = gender === 'male';
    
    const dayMaster = result.pillars[1].stem;
    const dayBranch = result.pillars[1].branch;
    const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element || 'Wood';
    const ELEMENT_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIndex = ELEMENT_CYCLE.indexOf(dmElement);
    const wealth = ELEMENT_CYCLE[(dmIndex + 2) % 5];
    const controlsDm = ELEMENT_CYCLE[(dmIndex + 3) % 5];
    const reinforcesDm = ELEMENT_CYCLE[(dmIndex + 4) % 5];
    const sikSang = ELEMENT_CYCLE[(dmIndex + 1) % 5];

    const elementMonths: Record<string, number[]> = {
      'Wood': [2, 3],
      'Fire': [5, 6],
      'Earth': [4, 7, 10, 1],
      'Metal': [8, 9],
      'Water': [11, 12]
    };

    let targetMonths: number[] = [];
    if (isMale) {
      targetMonths = [...(elementMonths[sikSang] || []), ...(elementMonths[wealth] || [])];
    } else {
      targetMonths = [...(elementMonths[controlsDm] || []), ...(elementMonths[wealth] || [])];
    }

    const getYearlyLuck = (y: number) => {
      const startY = 1984; // 甲子 year
      const o = (y - startY) % 60;
      const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
      const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
      const stem = stems[(o + 120) % 10]; // avoid negative mod
      const branch = branches[(o + 120) % 12];
      return { year: y, stem, branch };
    };

    const isPowerHeavy = (analysis.tenGodsRatio?.['관성(Warrior/Judge)'] || 0) >= 30 
      || (analysis.elementRatios && analysis.elementRatios[controlsDm as keyof typeof analysis.elementRatios] >= 35);

    const baziMappingStems: Record<string, { element: string }> = { '甲': { element: 'Wood' }, '乙': { element: 'Wood' }, '丙': { element: 'Fire' }, '丁': { element: 'Fire' }, '戊': { element: 'Earth' }, '己': { element: 'Earth' }, '庚': { element: 'Metal' }, '辛': { element: 'Metal' }, '壬': { element: 'Water' }, '癸': { element: 'Water' } };
    const baziMappingBranches: Record<string, { element: string }> = { '子': { element: 'Water' }, '丑': { element: 'Earth' }, '寅': { element: 'Wood' }, '卯': { element: 'Wood' }, '辰': { element: 'Earth' }, '巳': { element: 'Fire' }, '午': { element: 'Fire' }, '未': { element: 'Earth' }, '申': { element: 'Metal' }, '酉': { element: 'Metal' }, '戌': { element: 'Earth' }, '亥': { element: 'Water' } };

    const evaluateMarriageLuck = (luck: any) => {
      let score = 0;
      let reason = '';
      
      const sEl = baziMappingStems[luck.stem]?.element;
      const bEl = baziMappingBranches[luck.branch]?.element;

      if (isPowerHeavy && (sEl === reinforcesDm || bEl === reinforcesDm)) {
        score += 150;
        reason = lang === 'KO' ? 
          \`강력한 인성(\${lang === 'KO' ? {\'Wood\':\'목\',\'Fire\':\'화\',\'Earth\':\'토\',\'Metal\':\'금\',\'Water\':\'수\'}[reinforcesDm] : reinforcesDm})이 들어와 나를 짓누르던 관성(책임감/압박)을 안정적인 가정이라는 울타리로 비로소 승화시키는 해\` :
          \`Strong resource energy enters, transforming crushing pressure into a stable family haven\`;
      } else if (isMale && (sEl === wealth || bEl === wealth || sEl === sikSang || bEl === sikSang)) {
        score += 100;
        reason = lang === 'KO' ? 
          (sEl === wealth || bEl === wealth ? '재성(여성/결과)의 기운이 뚜렷하게 발현되는 해' : '식상(표현력)이 생재하여 이성을 향해 마음이 적극적으로 움직이는 해') :
          'Energy of romance and result manifests strongly';
      } else if (!isMale && (sEl === controlsDm || bEl === controlsDm)) {
        score += 100;
        reason = lang === 'KO' ? '관성(남성/안정의 책임)이 내 일간을 감싸 안는 해' : 'Strong connection with a significant other';
      } else if (luck.stem === dayMaster || luck.branch === dayBranch) {
        score += 80;
        reason = lang === 'KO' ? '일간/일지와 동기화되어 내 삶에 결정적인 배우자의 방이 열리는 시기' : 'Alignment with day pillar opens the door to marriage';
      } else {
        score += 30;
        reason = lang === 'KO' ? '인연의 흐름이 잔잔하게 스쳐가는 시기' : 'A calm period of relationship flow';
      }

      return { ...luck, score, reason };
    };

    // Calculate Past and Future Luck
    const pastYears = [currentYear - 2, currentYear - 1];
    const futureYears = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4];

    const pastLucks = pastYears.map(y => evaluateMarriageLuck(getYearlyLuck(y)));
    const futureLucks = futureYears.map(y => evaluateMarriageLuck(getYearlyLuck(y)));

    pastLucks.sort((a, b) => b.score - a.score);
    futureLucks.sort((a, b) => b.score - a.score);

    const bestPast = pastLucks[0];
    const bestFuture = futureLucks[0];

    const formatLuck = (l: any) => {
      const monthStr = targetMonths.length > 0 ? targetMonths.join(', ') : '2, 3';
      return lang === 'KO' 
        ? \`\${l.reason}이야. **(성취 확률이 높은 달: \${monthStr}월)**\`
        : \`\${l.reason}. **(High success months: \${monthStr})**\`;
    };

    const main = lang === 'KO' ? 
      \`네 인연의 타임라인을 스캔해봤어. [delay:1500]\\n\\n🕒 [가장 가까웠던/현재의 결혼운]\\n\${bestPast.year}년(\${bestPast.stem}\${bestPast.branch}년): \${formatLuck(bestPast)}\\n\\n🚀 [향후 가장 강력한 결혼운]\\n\${bestFuture.year}년(\${bestFuture.stem}\${bestFuture.branch}년): \${formatLuck(bestFuture)}\\n\\n결혼은 단순히 운의 흐름을 타는 게 아니라, 그 흐름 속에서 네가 어떤 선택을 하느냐가 중요해.\` :
      \`I've scanned your relationship timeline. [delay:1500]\\n\\n🕒 [Most Recent/Current Marriage Luck]\\n\${bestPast.year} (\${bestPast.stem}\${bestPast.branch}): \${formatLuck(bestPast)}\\n\\n🚀 [Strongest Future Marriage Luck]\\n\${bestFuture.year} (\${bestFuture.stem}\${bestFuture.branch}): \${formatLuck(bestFuture)}\\n\\nMarriage is about the choices you make.\`;

    return { main, glitch: lang === 'KO' ? '운명은 준비된 자에게 찾아온다.' : 'Fate comes to the prepared.' };
  };
`;

  content = content.substring(0, analyzeMarriageTimingStart) + newAnalyzeMarriageTiming + content.substring(analyzeWealthStart);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully replaced analyzeMarriageTiming.");
} else {
  console.error("Could not find insertion points.");
}
