import * as fs from 'fs';

const filePath = 'src/services/cycle-vibe-service.ts';
let code = fs.readFileSync(filePath, 'utf8');

const lines = code.split('\n');
const startLineIdx = 1872;  // "const analyzeWealth = () => {"
const endLineIdx = 2291;    // "};" before "const analyzeHealth = () => {"

let replacement = `  // --- Theme 2: Wealth Focus (황금의 늪) ---
  const analyzeWealth = () => {
    const jaeSeongScore = Object.entries(tenGodsRatio).reduce((s, [k, v]) => k.includes('재성') ? s + (v as number) : s, 0);
    const dmStrengthScore = result.analysis?.dayMasterStrength?.score ?? 50;
    
    const hasPyunJae = seunAllGods.some(g => g.includes('편재')) || luckGods.some(g => g.includes('편재'));
    const hasJungJae = seunAllGods.some(g => g.includes('정재')) || luckGods.some(g => g.includes('정재'));

    const isTrueJaeDaSinYak = jaeSeongScore >= 40 && dmStrengthScore <= 35;
    const isSimpleJaeDaSinYak = jaeSeongScore >= 30 && jaeSeongScore < 40 && dmStrengthScore < 45;

    let layer1 = ''; // Structure
    let layer2 = ''; // Annual Flow
    let layer3 = ''; // Tactical Advice
    let wealthGlitch = ''; // Glitch

    if (lang === 'KO') {
      if (jaeSeongScore >= 40) {
        layer1 = "사주에 <strong>재물의 기운</strong>이 이미 가득 차 있어. 돈을 쫓는 감각과 결과물을 만들어내는 능력은 탁월하지만, 그 무게가 때로는 본인의 에너지를 압도할 수 있겠네.";
      } else if (jaeSeongScore === 0) {
        layer1 = "명식에 드러난 재물운이 약한 편이지만, 이는 오히려 돈에 얽매이지 않는 <strong>자유로운 영혼</strong>임을 뜻해. 성실함과 운의 조력이 만날 때 예상치 못한 큰 성취를 이룰 수 있는 잠재력이 있어.";
      } else {
        layer1 = "당장 큰 돈이 쏟아지는 구조는 아니지만, 본인의 <strong>성실함과 운의 조력</strong>에 따라 충분히 남부럽지 않은 성취를 이룰 수 있는 잠재력이 있어.";
      }

      if (hasPyunJae) {
        layer2 = "올해는 <strong>편재(횡재수)</strong>의 기운이 네 주변을 맴돌고 있어. 한 번에 큰 것을 노리고 싶은 도파민이 솟구치는 해가 될 거야.";
      } else if (hasJungJae) {
        layer2 = "올해는 <strong>정재(안정 자산)</strong>의 기운이 강해. 무리한 투자보다는 현재의 수익원을 잘 지키고 관리하는 것이 부를 쌓는 지름길이야.";
      } else {
        layer2 = "특별한 재물운의 급격한 변동보다는 <strong>안정적인 흐름</strong>을 유지하며 다음 큰 기회를 위해 자본을 비축해야 하는 시기야.";
      }

      if (isTrueJaeDaSinYak) {
        layer3 = "올해 가장 경계해야 할 것은 '어설픈 개입'이야. 네게 쥐어진 얄팍한 무기를 믿고 무리하게 투자를 하거나 판을 키우려 들면, 그 거대한 재물의 무게에 짓눌려 빚더미에 앉을 수 있어.";
        wealthGlitch = "물타기, 영끌, 무리한 확장은 절대 금물. 차라리 부자들 옆에 납작 엎드려 콩고물이나 주워 먹는 게 현명해.";
      } else if (isSimpleJaeDaSinYak) {
        layer3 = "돈 냄새는 나는데, 무리해서 쫓아가면 네가 먼저 쓰러질 수 있어.";
        wealthGlitch = "돈은 보이는데 네 몸이 버겁대. 건강검진에 돈을 쓰거나 운동에 투자해. 몸집을 키워야 그 돈을 들 수 있어.";
      } else if (hasPyunJae) {
        layer3 = "하이 리스크 하이 리턴... 하지만 확실한 판이 아니면 승부수를 걸지 마, 아니면 아예 쳐다보지도 마.";
        wealthGlitch = "도파민에 속지마. 네 판단력은 생각보다 날카로우니까.";
      } else if (hasJungJae) {
        layer3 = "지금은 실속을 챙겨야 할 때야. 나가는 돈을 막고 들어오는 돈을 차곡차곡 쌓는 게 네 유일한 구원이자 전략이야.";
        wealthGlitch = "지루하더라도 엑셀을 켜고 가계부를 써. 1원 단위의 통제가 널 지켜줄 거야.";
      } else {
        layer3 = "조급하게 성과를 내려고 하면 오히려 더 꼬일 수 있어. <strong>현 상태를 유지</strong>하면서 다음 상승 운을 기다리는 여유가 필요해.";
        wealthGlitch = "황금의 그림자가 저 멀리서 아른거리고 있어. 아직은 손을 뻗을 때가 아니야.";
      }
    } else {
      layer1 = jaeSeongScore >= 40 ? "Your chart is full of wealth energy." : "You have steady potential for wealth.";
      layer2 = hasPyunJae ? "This year brings windfall opportunities." : "Focus on stable income management.";
      layer3 = "Focus on practical gains and steady growth.";
      wealthGlitch = "Stay calculated and steady.";
    }

    const main = lang === 'KO' ? 
      \`네 지갑의 운명을 스캔해봤어. [delay:1500]

**[자산 운용 성향]**
\${layer1}

**[올해의 흐름]**
\${layer2}

**[전술적 조언]**
\${layer3}\` :
      \`Scanning your wealth destiny... [delay:1500]

**[Wealth Potential]**
\${layer1}

**[Annual Flow]**
\${layer2}

**[Tactical Advice]**
\${layer3}\`;

    return { main, glitch: wealthGlitch };
  };

  // --- Theme 5: Moving (궤도의 이탈) ---
  const analyzeMoving = () => {
    const targetDayMaster = result.pillars[1].stem;
    const movingDmElement = BAZI_MAPPING.stems[targetDayMaster as keyof typeof BAZI_MAPPING.stems]?.element || '';
    const dmStrengthScoreVal = result.analysis?.dayMasterStrength?.score ?? 50;
    const structureDetail = result.analysis?.structureDetail;
    const ratios = result.analysis?.elementRatios || {};
    
    let gwanSeongScoreValue = 0;
    let jaeSeongScoreValue = 0;
    let inSeongScoreValue = 0;
    let biGyeopScoreValue = 0;

    Object.entries(result.analysis?.tenGodsRatio || {}).forEach(([k, v]) => {
      const val = v as number;
      if (k.includes('관성')) gwanSeongScoreValue += val;
      if (k.includes('재성')) jaeSeongScoreValue += val;
      if (k.includes('인성')) inSeongScoreValue += val;
      if (k.includes('비겁')) biGyeopScoreValue += val;
    });
    
    const isJaeDaShinYak = jaeSeongScoreValue > 35 && dmStrengthScoreVal < 40;
    const isGwanSalTaeGwang = gwanSeongScoreValue > 35 && dmStrengthScoreVal < 40;
    const isShinGangInBi = (inSeongScoreValue + biGyeopScoreValue) > 50;
    
    const isToDaMaeGeum = movingDmElement === 'Metal' && ratios.Earth > 50;
    const isHwaDaGeumYong = movingDmElement === 'Metal' && ratios.Fire > 40 && ratios.Water < 10;

    const hasYeokma = analysis.shinsal?.some((s: any) => s.name.includes('역마'));
    const isChungDay = allInteractions.some(i => i.note.includes(result.pillars[2].branch) && i.type.includes('충'));
    const isChungMonth = allInteractions.some(i => i.note.includes(result.pillars[1].branch) && i.type.includes('충'));

    const hasMoveIndicator = hasYeokma || isChungDay || isChungMonth;
    const isGoodLuckValue = luckScore >= 60;

    let psychology = '';
    const currentYearNum = currentAnnualPillar?.year || new Date().getFullYear();
    const seunAllGodsLocal = [seunStemGodKo, seunBranchGodKo];
    const hasBiGyeopYear = seunAllGodsLocal.some(g => g?.includes('비견') || g?.includes('겁재'));
    const hasSikSangYear = seunAllGodsLocal.some(g => g?.includes('식신') || g?.includes('상관'));

    if (lang === 'KO') {
      if (hasBiGyeopYear) {
        psychology = \`올해(\${currentYearNum}년)는 본인의 주관과 독립심이 폭발하는 해입니다. 주변에 휘둘리지 않고 본인만의 룰을 세우고자 강하게 환경을 바꾸고 싶어 합니다.\`;
      } else if (hasSikSangYear) {
        psychology = \`올해(\${currentYearNum}년)는 내면에서 새로운 시도와 변화를 향한 욕구가 요동치는 해입니다. 틀에 박힌 생활에서 벗어나 궤도를 이탈하고 싶은 충동이 강할 것입니다.\`;
      } else if (hasMoveIndicator) {
        psychology = \`올해(\${currentYearNum}년)는 운세의 흔들림으로 인해 마음이 불안정해지기 쉬운 해입니다. 어디론가 훌쩍 떠나 새롭게 안착하고 싶은 열망이 피어오르고 있습니다.\`;
      } else {
        psychology = \`올해(\${currentYearNum}년)는 외부적인 이동보다는 내면의 성찰이 깊어지는 시기일 것입니다. 스스로 변화의 필요성을 고민하며 은밀히 다음 스텝을 재고 있습니다.\`;
      }

      let fateAnalysis = '';
      if (isToDaMaeGeum || isHwaDaGeumYong) {
        fateAnalysis = \`사주 구조상 이번 이동은 잠든 천재성을 깨우기 위한 필수 생존 기제로 발동하며, 귀하의 가치를 새롭게 입증할 기회가 될 것입니다.\`;
      } else if (isShinGangInBi) {
        fateAnalysis = \`내면의 거대한 에너지를 밖으로 표출할 영역 확장의 시기로, 이동 시 뚜렷한 주도권 획득과 사회적 입지 강화를 기대할 수 있습니다.\`;
      } else if (isJaeDaShinYak) {
        fateAnalysis = \`이번 이동은 적극적인 수익 확장보다는 소진되는 에너지를 보존하고 번아웃상태에서 벗어나기 위한 휴식의 성격이 강해야 합니다.\`;
      } else if (isGwanSalTaeGwang) {
        fateAnalysis = \`억압과 책임감에서 벗어나려는 탈출의 성격이 짙으므로, 준비되지 않은 이동은 피하고 자기방어를 우선시하는 실리적 선택이 필요합니다.\`;
      } else {
        fateAnalysis = \`이번 이동수는 막힌 운의 물꼬를 트는 전환점이 될 수 있으며, 환경 변화가 제공하는 유리한 조건들을 전략적으로 취할 수 있을 것입니다.\`;
      }

      let finalVerdict = '';
      if (isGoodLuckValue && hasMoveIndicator) {
        finalVerdict = \`당신의 명식과 올해 운기가 완벽히 부합하니 더 큰 무대로 비상하기 위한 골든타임입니다. 과감하게 이동을 추진하세요.\`;
      } else if (isGoodLuckValue && !hasMoveIndicator) {
        finalVerdict = \`길운의 흐름은 좋으나 굳이 먼 이동을 감행할 필요는 없습니다. 지금 자리에서 내실을 다지고 주도권을 확고히 하는 데 주력하세요.\`;
      } else if (!isGoodLuckValue && hasMoveIndicator) {
        finalVerdict = \`이동하고 싶은 충동은 강하지만, 무리하면 실익을 잃을 위험이 큽니다. 잠시 뜻을 접고 에너지가 차오를 때까지 기다리는 것이 현명합니다.\`;
      } else {
        finalVerdict = \`변화보다는 보수적인 태도로 현재 자리를 단단하게 지키는 것이 이롭습니다. 무리한 개척보다는 안전자산을 확보하며 유연하게 버티세요.\`;
      }

      const yongshinElement = analysis.yongshinDetail?.primary?.element || '';
      const directionsTable: Record<string, string> = {
        'Wood': '동쪽(푸른 계열의 에너지가 강한 곳)', 
        'Fire': '남쪽(화창하고 빛이 잘 드는 곳)', 
        'Metal': '서쪽(바람이 통하고 깔끔한 곳)', 
        'Water': '북쪽(차분하고 조용한 곳)', 
        'Earth': '중앙 또는 연고지(안정적인 기반)'
      };
      const bestDirection = directionsTable[yongshinElement];
      
      const riskCheck = (isJaeDaShinYak || isGwanSalTaeGwang) ? 
        \`이동 직후 6개월간은 에너지가 크게 소모될 수 있으니 무리한 투자는 피하고 비상 현금 흐름 확보에 집중하세요.\` :
        \`이해관계가 복잡해질 수 있으니 초기 6개월간은 주변과의 조화로운 관계 형성과 네트워킹 구축에 만전을 기하세요.\`;

      const gyeokName = (structureDetail as any)?.title || '';
      let spatialAdvice = '';
      if (gyeokName.includes('상관') || gyeokName.includes('식신')) {
        spatialAdvice = \`교류가 활발하고 사람들의 아이디어가 섞이는 활기찬 도심지나 오피스 밀집 지역이 운기에 가장 이상적입니다.\`;
      } else if (isGwanSalTaeGwang || isJaeDaShinYak) {
        spatialAdvice = \`심리적 압박에서 벗어나 재충전할 수 있는 조용하고 프라이버시가 완벽히 보장되는 독립적인 주거 형태를 추천합니다.\`;
      } else {
        spatialAdvice = \`본인의 기질을 넓게 펼쳐 활동성을 극대화할 수 있도록 채광이 좋고 개방감이 돋보이는 트인 공간을 1순위로 고려하세요.\`;
      }

      const mainText = 
        \`### [궤도의 이탈: 이동수 검증 리포트]

1. **[심리 상태]**: \${psychology}
2. **[운기 분석]**: \${fateAnalysis}
3. **[최종 판결]**: \${finalVerdict}

4. **[성공 전략]**:
   - 전략적 방향성: \${bestDirection || '유연한 방향 탐색'}
   - 6개월 리스크 방어: \${riskCheck}
   - 최적 공간 조건: \${spatialAdvice}\`;
      
      const glitchText = isGoodLuckValue ?
        "이사나 이직은 단순한 변경이 아닌 에너지 진동수의 재조정입니다. 본인에게 맞는 공간을 찾는 것이 개운의 핵심 기제입니다." :
        "이동하고픈 바람은 헛된 것이 아닐지라도, 날씨가 나쁠 땐 출항하지 않는 것이 최고의 뱃사공입니다.";

      return { main: mainText, glitch: glitchText };
    } else {
      const mainText = \`### [Mobility Verification Report]

1. **[Psychology]**: The energy for change is building up. Make sure your desires are not just a craving for escape.
2. **[Fate Analysis]**: Moving can serve as a catalyst to unlock dormant energy and expand your domain.
3. **[Final Verdict]**: Follow your intuition, but ensure you land in a secure place.

4. **[Success Strategy]**:
   - Navigate towards elements that support your core.
   - Maintain a solid financial buffer for at least 6 months.
   - Choose spaces that nurture your personal expression and comfort.\`;

      return { 
        main: mainText, 
        glitch: 'Moving is a retuning of your life frequency. Choose wisely.' 
      };
    }
  };`

lines.splice(startLineIdx, endLineIdx - startLineIdx + 1, replacement);

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
