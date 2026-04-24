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

    const getYearlyLuck = (y) => {
      const startY = 1984; // 甲子 year
      const o = (y - startY) % 60;
      const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
      const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
      const stem = stems[(o + 120) % 10];
      const branch = branches[(o + 120) % 12];
      return { year: y, stem, branch };
    };

    const getMonthlyLuckForYear = (year) => {
      const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
      const branches = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];
      const yearStemIndex = stems.indexOf(getYearlyLuck(year).stem);
      
      let firstMonthStemIndex = 0;
      if (yearStemIndex === 0 || yearStemIndex === 5) firstMonthStemIndex = 2;
      else if (yearStemIndex === 1 || yearStemIndex === 6) firstMonthStemIndex = 4;
      else if (yearStemIndex === 2 || yearStemIndex === 7) firstMonthStemIndex = 6;
      else if (yearStemIndex === 3 || yearStemIndex === 8) firstMonthStemIndex = 8;
      else if (yearStemIndex === 4 || yearStemIndex === 9) firstMonthStemIndex = 0;
      
      const months = [];
      for(let i=0; i<12; i++) {
        months.push({
          month: (i + 2) > 12 ? (i + 2) - 12 : (i + 2),
          stem: stems[(firstMonthStemIndex + i) % 10],
          branch: branches[i]
        });
      }
      return months;
    };

    const isPowerHeavy = (analysis.tenGodsRatio?.['관성(Warrior/Judge)'] || 0) >= 30 
      || (analysis.elementRatios && analysis.elementRatios[controlsDm] >= 35);

    const baziMappingStems = { '甲': { element: 'Wood' }, '乙': { element: 'Wood' }, '丙': { element: 'Fire' }, '丁': { element: 'Fire' }, '戊': { element: 'Earth' }, '己': { element: 'Earth' }, '庚': { element: 'Metal' }, '辛': { element: 'Metal' }, '壬': { element: 'Water' }, '癸': { element: 'Water' } };
    const baziMappingBranches = { '子': { element: 'Water' }, '丑': { element: 'Earth' }, '寅': { element: 'Wood' }, '卯': { element: 'Wood' }, '辰': { element: 'Earth' }, '巳': { element: 'Fire' }, '午': { element: 'Fire' }, '未': { element: 'Earth' }, '申': { element: 'Metal' }, '酉': { element: 'Metal' }, '戌': { element: 'Earth' }, '亥': { element: 'Water' } };

    const evaluateMarriageLuck = (luck) => {
      let score = 0;
      let reason = '';
      
      const sEl = baziMappingStems[luck.stem]?.element;
      const bEl = baziMappingBranches[luck.branch]?.element;

      if (isPowerHeavy && (sEl === reinforcesDm || bEl === reinforcesDm)) {
        score += 150;
        reason = lang === 'KO' ? 
          \`강력한 인성(\${lang === 'KO' ? {'Wood':'목','Fire':'화','Earth':'토','Metal':'금','Water':'수'}[reinforcesDm] : reinforcesDm})이 들어와 나를 짓누르던 관성(책임감/압박)을 안정적인 가정이라는 울타리로 비로소 승화시키는 해\` :
          \`Strong resource energy enters, transforming crushing pressure into a stable family haven\`;
      } else if (!isMale && (sEl === controlsDm || bEl === controlsDm)) {
        score += 100;
        reason = lang === 'KO' ? '관성(남성/안정의 책임)이 내 일간을 감싸 안는 해' : 'Strong connection with a significant other';
      } else if (isMale && (sEl === wealth || bEl === wealth)) {
        score += 100;
        reason = lang === 'KO' ? '재성이 직접 도래하여 인연의 결실을 맺는 해' : 'Wealth (Spouse) energy directly arrives for fruitful connection';
      } else if (isMale && (sEl === sikSang || bEl === sikSang)) {
        score += 80;
        reason = lang === 'KO' ? '식상(표현력)이 생재하여 이성을 향해 마음이 적극적으로 움직이는 해' : 'Your expressive energy actively moves towards romance';
      } else if (!isMale && (sEl === sikSang || bEl === sikSang)) {
        score += 80;
        reason = lang === 'KO' ? '내 가족, 내 식구를 꾸리고자 하는 강한 열망이 생기는 시기' : 'Strong desire to build your own family arises';
      } else if (sEl === controlsDm || bEl === reinforcesDm) {
         score += 90;
         reason = lang === 'KO' ? '사회적 책임과 안정적인 가정을 꾸리고자 하는 의지가 강해지는 해' : 'Strong will to take social responsibility and build a stable family';
      } else if (luck.stem === dayMaster || luck.branch === dayBranch) {
        score += 80;
        reason = lang === 'KO' ? '일간/일지와 동기화되어 내 삶에 결정적인 배우자의 방이 열리는 시기' : 'Alignment with day pillar opens the door to marriage';
      } else {
        score += 30;
        reason = lang === 'KO' ? '인연의 흐름이 잔잔하게 스쳐가는 시기' : 'A calm period of relationship flow';
      }

      const monthlyData = getMonthlyLuckForYear(luck.year).map(m => {
        let mScore = 0;
        const msEl = baziMappingStems[m.stem]?.element;
        const mbEl = baziMappingBranches[m.branch]?.element;
        
        const isHap = (m.branch === '子' && dayBranch === '丑') || (m.branch === '丑' && dayBranch === '子') ||
                      (m.branch === '寅' && dayBranch === '亥') || (m.branch === '亥' && dayBranch === '寅') ||
                      (m.branch === '卯' && dayBranch === '戌') || (m.branch === '戌' && dayBranch === '卯') ||
                      (m.branch === '辰' && dayBranch === '酉') || (m.branch === '酉' && dayBranch === '辰') ||
                      (m.branch === '巳' && dayBranch === '申') || (m.branch === '申' && dayBranch === '巳') ||
                      (m.branch === '午' && dayBranch === '未') || (m.branch === '未' && dayBranch === '午');
        const samHapGroups = [['亥', '卯', '未'], ['寅', '午', '戌'], ['巳', '酉', '丑'], ['申', '子', '辰']];
        const isSamHap = samHapGroups.some(g => g.includes(m.branch) && g.includes(dayBranch) && m.branch !== dayBranch);
        
        if (isHap || isSamHap) mScore += 30;
        if (isMale && (msEl === wealth || mbEl === wealth)) mScore += 20;
        if (!isMale && (msEl === controlsDm || mbEl === controlsDm)) mScore += 20;
        if (msEl === sikSang || mbEl === sikSang) mScore += 10;
        
        return { ...m, score: mScore };
      });

      monthlyData.sort((a,b) => b.score - a.score);
      let bestMonths = monthlyData.slice(0, 3).filter(m => m.score > 0);
      if (bestMonths.length === 0) bestMonths = monthlyData.slice(0, 2);
      bestMonths.sort((a, b) => a.month - b.month);
      const targetMonths = bestMonths.map(m => m.month);

      return { ...luck, score, reason, targetMonths };
    };

    const pastYears = [currentYear - 2, currentYear - 1, currentYear];
    const futureYears = [currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4, currentYear + 5];

    const pastLucks = pastYears.map(y => evaluateMarriageLuck(getYearlyLuck(y)));
    const futureLucks = futureYears.map(y => evaluateMarriageLuck(getYearlyLuck(y)));

    pastLucks.sort((a, b) => b.score - a.score);
    futureLucks.sort((a, b) => b.score - a.score);

    const bestPast = pastLucks[0];
    const bestFuture = futureLucks[0];

    const formatLuck = (l) => {
      const monthStr = l.targetMonths.join(', ');
      return lang === 'KO' 
        ? \`\${l.reason}야. **(성취 확률이 높은 달: \${monthStr}월)**\`
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
}
