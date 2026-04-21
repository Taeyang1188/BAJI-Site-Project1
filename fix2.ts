import * as fs from 'fs';
const text = fs.readFileSync('src/services/cycle-vibe-service.ts', 'utf8');
const lines = text.split('\n');

const startIndex = lines.findIndex((l, i) => i > 1700 && l.includes("if (luck.reason === '불안정한 안방의 안착(합)' || luck.reason === 'Settling of Unstable Palace (Combination)') {"));
const endIndex = lines.findIndex((l, i) => i > 1850 && l.includes("const analyzeWealth = () => {"));

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `      if (luck.reason === '불안정한 안방의 안착(합)' || luck.reason === 'Settling of Unstable Palace (Combination)') {
        const isPastInBlock = luck.year <= currentYear;
        return lang === 'KO' ?
          \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 불안정했던 안방을 단단하게 묶어주는 강력한 합(Combination)의 기운이 들어오는 해이야. 떠돌던 마음이 비로소 안착할 곳을 찾는 <strong>결합과 시작</strong>의 시기지. \${isPastInBlock ? '운명의 짝을 만났거나 가정을 꾸렸을 가능성이 높아.' : '새로운 울타리를 만들 준비를 해봐.'}\${goldenTime}\` :
          \`\${luck.year} (\${luck.stem}\${luck.branch}): A year of <strong>Combination and Start</strong> where a strong connection settles your unstable inner palace. \${isPastInBlock ? 'You likely found a partner or build a family.' : 'Prepare to build a new boundary.'}\${goldenTime}\`;
      }

      if (luck.reason === '비밀스러운 인연의 시작(암합)' || luck.reason === 'Secret Attraction (Combination)') {
        return lang === 'KO' ?
          \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 겉으로 드러나지 않아도 은밀하게 끌어당기는 강력한 암합(Hidden Combination)의 기운이 한 사람을 네 삶의 울타리 안으로 깊숙이 \${isPast ? '끌어당겼던 시기야.' : '끌어당기는 해이야.'} 예상치 못한 타이밍에 운명처럼 느껴지는 결합이지.\${goldenTime}\` :
          \`\${luck.year} (\${luck.stem}\${luck.branch}): While connection energy might not be obvious on the surface, a strong unseen attraction (Hidden Combination) pull\${isPast ? 'ed' : 's'} someone into your inner circle. A union that feels like fate at an unexpected timing.\${goldenTime}\`;
      }

      if (luck.reason === '조후 해결(정서적 안정)' || luck.reason === 'Emotional Grounding (Climate Resolution)' || luck.reason === '조후 해결(그늘과 안식처)' || luck.reason === 'Shade and Resting Place (Climate Resolution)') {
        const isHotDryCase = luck.reason.includes('그늘') || luck.reason.includes('Shade');
        let keyword = lang === 'KO' ? '촉촉한 단비' : 'sweet rain';
        if (specialStatuses.isFireEarthHeavy) keyword = lang === 'KO' ? '안락한 안식처' : 'comfortable shelter';
        else if (specialStatuses.isWoodHeavy) keyword = lang === 'KO' ? '새로운 질서' : 'new order';

        if (isHotDryCase) {
          return lang === 'KO' ?
            \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 너무 뜨겁고 메말랐던 네 삶에 드디어 안착할 수 있는 '\${keyword}'가 들어오는 해이야. 정서적인 갈증이 해소되면서, 비로소 누군가를 온전히 받아들일 수 있는 마음의 여유가 생겨.\${goldenTime}\` :
            \`\${luck.year} (\${luck.stem}\${luck.branch}): A year where '\${keyword}' finally enters your overly hot and dry life. As emotional thirst is quenched, you gain the peace of mind to fully accept someone.\${goldenTime}\`;
        }

        return lang === 'KO' ?
          \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 너무 뜨겁고 건조했던 네 삶에 드디어 \${keyword}가 내리며 정서적인 갈증이 해소\${isPast ? '됐던 시기야.' : '되는 시기야.'} 마음의 안정을 찾으면서 자연스럽게 가정을 꾸리고 정착하고 싶은 욕구가 강해지는 타이밍이지.\${goldenTime}\` :
          \`\${luck.year} (\${luck.stem}\${luck.branch}): \${keyword} finally fall\${isPast ? 's' : 's'} on your overly hot and dry life, quenching your emotional thirst. As you find peace of mind, the desire to build a family and settle down naturally grows stronger.\${goldenTime}\`;
      }

      if (luck.reason === '재성(이성운)' || luck.reason === 'Wealth (romance)') {
        const isOverwhelmed = luck.score < (isPrimeAge ? 100 : 0) + 50;
        let koPrime = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 재성(이성운)이 강하게 들어오며 '결단과 시작'을 하기에 아주 좋은 시기야. 네 매력이 빛을 발하고, 실질적인 결실을 맺을 확률이 매우 높은 해지.\${goldenTime}\`;
        let koOther = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 삶의 안정을 찾으며 소중한 인연과의 관계를 돈독히 하는 '재회와 안정'의 시기야. 마음의 평온 속에서 든든한 내 편과 함께하기 좋은 해지.\${goldenTime}\`;

        if (isOverwhelmed) {
          koPrime = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 이성운이 들어오긴 하는데, 주변 눈치 보느라 네가 짓눌리는 해이야. 주체적인 선택보다는 상황에 떠밀려 결정하기 쉬우니까 주의해야 해.\${goldenTime}\`;
          koOther = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 인연의 기운 속에서도 책임감이 무겁게 느껴지는 시기야. 주변 기대에 부응하려 애쓰느라 정작 네 행복을 놓칠 수 있으니 내면의 소리에 집중해봐.\${goldenTime}\`;
        }

        const enPrime = \`\${luck.year} (\${luck.stem}\${luck.branch}): A great time for 'Decision and Start' as Wealth (romance) energy is strong. Your charm shines, and there's a high probability of practical results.\${goldenTime}\`;
        const enOther = \`\${luck.year} (\${luck.stem}\${luck.branch}): A time of 'Reunion and Stability' finding peace in life and strengthening relationships. A good year to be with a reliable partner.\${goldenTime}\`;

        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason === '관성(이성운)' || luck.reason === 'Power (romance)') {
        const isOverwhelmed = luck.score < (isPrimeAge ? 100 : 0) + 50;
        let koPrime = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 관성(이성운)이 강하게 들어오며 사회적 성취와 함께 '결단과 시작'을 하는 해이야. 믿음직한 인연이 네 삶으로 훅 들어와서 새로운 울타리를 만들게 될 거야.\${goldenTime}\`;
        let koOther = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 삶의 책임감을 나누며 안정을 찾는 '재회와 안정'의 시기야. 듬직한 내 편과 함께 미래를 약속하며 삶의 무게를 덜어내기에 딱 좋은 타이밍이지.\${goldenTime}\`;

        if (isOverwhelmed) {
          koPrime = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 관성의 기운이 강해지며 널 향한 사회적 압박과 기대가 피크를 찍는 해이야. 결혼이 축복이 아니라 '해결해야 할 숙제'처럼 느껴질 수 있으니 주도권을 잃지 마.\${goldenTime}\`;
          koOther = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 책임감이 무겁게 다가오는 시기야. 주변 기대에 맞추려다 본인의 행복을 놓치지 않도록 경계해야 해.\${goldenTime}\`;
        }

        const enPrime = \`\${luck.year} (\${luck.stem}\${luck.branch}): A year of 'Decision and Start' with social achievement as Power (romance) energy is strong. A trustworthy partner enters your life to build a new boundary.\${goldenTime}\`;
        const enOther = \`\${luck.year} (\${luck.stem}\${luck.branch}): A time of 'Reunion and Stability' sharing life's responsibilities. The best timing to promise a future and lighten life's burden with a reliable partner.\${goldenTime}\`;

        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.isFullSentence) {
        return lang === 'KO' ? 
          \`\${luck.reason.replace(/^(?:\\*\\*)?[0-9]+년\\([^)]+\\)(?:\\*\\*)?:\\s*/, '')}\${goldenTime}\` :
          \`\${luck.reason.replace(/^(?:\\*\\*)?[0-9]+\\s*\\([^)]+\\)(?:\\*\\*)?:\\s*/, '')}\${goldenTime}\`;
      }

      const koPrimeFallback = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): \${luck.reason}의 기운이 강하게 들어오며 '결단과 시작'을 하기에 유력한 시기야. \${luck.year < currentYear ? '이미 지나갔거나 현재 진행 중인 강력한 인연의 타이밍이지.' : '앞으로 다가올 가장 강력한 결합의 기회야.'}\${goldenTime}\`;
      const koOtherFallback = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): \${luck.reason}의 기운 속에서 '재회와 안정'을 찾는 소중한 시기야. 마음의 평온을 찾으며 든든한 동반자와 함께 안착하기 좋은 해지.\${goldenTime}\`;

      const isOverwhelmed = luck.score < (isPrimeAge ? 100 : 0) + 50;
      if (isOverwhelmed) {
        const koOverwhelmed = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): \${luck.reason}의 기운이 들어오지만, 이미 넘쳐나는 에너지가 널 압박하는 해이야. 주체적인 선택보다는 주변의 기대에 부응하려 애쓰는 시기가 될 수 있으니 내면의 목소리에 귀를 기울여봐.\${goldenTime}\`;
        return koOverwhelmed;
      }
      const enPrimeFallback = \`\${luck.year} (\${luck.stem}\${luck.branch}): A likely time for 'Decision and Start' with strong \${luck.reason} energy. \${luck.year < currentYear ? 'A timing of strong connection that has passed or is ongoing.' : 'The strongest upcoming opportunity for a deep union.'}\${goldenTime}\`;
      const enOtherFallback = \`\${luck.year} (\${luck.stem}\${luck.branch}): A precious time to find 'Reunion and Stability' within \${luck.reason} energy. A good year to settle down with a reliable partner.\${goldenTime}\`;

      return getNarrative(koPrimeFallback, koOtherFallback, enPrimeFallback, enOtherFallback);
    };

    const main = lang === 'KO' ? 
      \`네 인연의 타임라인을 스캔해봤어. [delay:1500]\\n\\n\` +
      \`[가장 가까웠던/현재의 결혼운]\\n\${pastLuck.year}년(\${pastLuck.stem}\${pastLuck.branch}년): \${formatLuck(pastLuck).replace(/^(?:\\*\\*)?[0-9]+년\\([^)]+\\)(?:\\*\\*)?:\\s*/, '')}\\n\\n\` +
      \`[향후 가장 강력한 결혼운]\\n\${finalFutureLuck.year}년(\${finalFutureLuck.stem}\${finalFutureLuck.branch}년): \${formatLuck(finalFutureLuck).replace(/^(?:\\*\\*)?[0-9]+년\\([^)]+\\)(?:\\*\\*)?:\\s*/, '')}\\n\\n\` +
      \`결혼은 단순히 운의 흐름을 타는 게 아니라, 그 흐름 속에서 네가 어떤 선택을 하느냐가 중요해. 이 시기들을 잘 활용해봐.\` :
      \`I've scanned your relationship timeline. [delay:1500]\\n\\n\` +
      \`🕒 [Most Recent/Current Marriage Luck]\\n\${pastLuck.year} (\${pastLuck.stem}\${pastLuck.branch}): \${formatLuck(pastLuck).replace(/^(?:\\*\\*)?[0-9]+\\s*\\([^)]+\\)(?:\\*\\*)?:\\s*/, '')}\\n\\n\` +
      \`🚀 [Strongest Future Marriage Luck]\\n\${finalFutureLuck.year} (\${finalFutureLuck.stem}\${finalFutureLuck.branch}): \${formatLuck(finalFutureLuck).replace(/^(?:\\*\\*)?[0-9]+\\s*\\([^)]+\\)(?:\\*\\*)?:\\s*/, '')}\\n\\n\` +
      \`Marriage isn't just about following the flow of luck, but about the choices you make within that flow. Use these timings wisely.\`;

    const glitch = lang === 'KO' ? '운명은 준비된 자에게 찾아오는 법이야.' : 'Fate comes to those who are prepared.';
    return { main, glitch };
  };`;

  lines.splice(startIndex, endIndex - startIndex, replacement);
  fs.writeFileSync('src/services/cycle-vibe-service.ts', lines.join('\\n'), 'utf8');
  console.log("Fixed lines between " + startIndex + " and " + endIndex + " in fix2");
} else {
  console.log("Could not find lines. startIndex: " + startIndex + " endIndex: " + endIndex);
}
