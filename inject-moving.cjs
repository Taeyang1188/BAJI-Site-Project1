const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/services/cycle-vibe-service.ts');
let content = fs.readFileSync(filePath, 'utf8');

const analyzeMovingStart = content.indexOf('  const analyzeMoving = () => {');
const analyzeMovingEnd = content.indexOf('  const analyzeHealth = () => {');

if (analyzeMovingStart !== -1 && analyzeMovingEnd !== -1) {
  const newAnalyzeMoving = `  const analyzeMoving = () => {
    const movingType = interactionsData?.movingType || 'moving_house';
    const movingContext = interactionsData?.movingContext || socialContext || 'none';
    
    const isMilitary = movingContext === 'military';
    const isPublic = movingContext === 'public' || movingContext === 'corporate';
    const isBusiness = movingContext === 'business' || movingContext === 'freelancer';

    const luckGodsStr = luckGods.join(' ');
    const hasBiGyeopYear = luckGodsStr.includes('비견') || luckGodsStr.includes('겁재');
    const hasSikSangYear = luckGodsStr.includes('식신') || luckGodsStr.includes('상관');
    const hasMoveIndicator = matrix.interactions.chung.length > 0 || matrix.interactions.hyeong.length > 0 || luckGodsStr.includes('편관');

    let psychology = lang === 'KO' ? "이동과 변화에 대한 무의식적 갈망이 관측됨" : "Unconscious desire for movement and change observed.";
    
    if (hasBiGyeopYear) {
      psychology = lang === 'KO' ? "주관과 독립심이 폭발하며 새로운 환경 구축 욕구가 강함" : "Surge of independence and autonomy, strong desire to build a new environment.";
    } else if (hasSikSangYear) {
      psychology = lang === 'KO' ? "새로운 구역 침투와 변화를 향한 궤도 이탈 욕구가 강함" : "Strong desire to deviate from orbit towards new territories and changes.";
    } else if (hasMoveIndicator) {
      psychology = lang === 'KO' ? "운세의 흔들림으로 인한 불안정성 및 새로운 안착지에 대한 갈망이 높음" : "High instability due to luck fluctuations and longing for a new landing spot.";
    }

    let fateAnalysis = lang === 'KO' ? "막힌 운의 물꼬를 트는 전환점이며 전략적 실익 취득 가능" : "A turning point to unlock blocked luck and gain strategic practical benefits.";
    let finalVerdict = lang === 'KO' ? "이동을 적극적으로 고려하되, 치밀한 계획이 필요해." : "Consider moving actively, but a meticulous plan is needed.";
    let altAction = matrix.coordinator.alt_action || '';
    
    // Apply context and target specific logic
    if (movingType === 'job_change') {
      psychology = lang === 'KO' ? "현재 직장이나 소속에 대한 권태감과 벗어나고자 하는 충동(식상/편관)이 강하게 작용하여 이탈 욕구가 상승 중이야." : "Strong impulse to escape the current affiliation.";
      fateAnalysis = lang === 'KO' ? "새로운 커리어 점프나 가치 입증을 위해 판을 바꾸는 것이 의미 있는 시그널이 될 수 있지." : "Changing the board for a new career jump can be a meaningful signal.";
      
      if (matrix.coordinator.judgment_grade === 'A') {
        finalVerdict = lang === 'KO' ? "이직 및 퇴사의 타이밍이 맞아. 새로운 무대로 과감히 뛰어들어." : "Perfect timing for job change. Jump into the new stage.";
      } else if (matrix.coordinator.judgment_grade === 'B') {
        finalVerdict = lang === 'KO' ? "조건부 이직운. 갈 곳이 명확히 정해진 상태(환승 이직)가 아니라면 타이밍을 늦춰라." : "Conditional job change. Delay if the destination is not clear.";
      } else {
        finalVerdict = lang === 'KO' ? "당장 퇴사 버튼을 누르고 싶어도 멈춰라. 무방비 상태의 이탈은 백수로 가는 직행열차야." : "Stop immediately. Leaving unarmed leads to unemployment.";
      }

      if (isMilitary) {
        finalVerdict = lang === 'KO' ? "탈주(전역/퇴사)보다는 현재 궤도 내의 전술적 이동이 강력히 요구되는 시점이야." : "Tactical movement within orbit is strongly required over escape.";
        altAction = lang === 'KO' ? "군/경/소방 등 거대한 '안전 울타리'를 벗어나는 건 방패의 상실을 의미해. 차라리 장기 교육, 파견, 보직 변경으로 기운을 해소하는 생존 전략을 짜봐." : "Use internal dispatches or position changes instead of quitting.";
      } else if (isPublic) {
        altAction = lang === 'KO' ? "공공기관/대기업은 한 번 궤도를 이탈하면 재진입이 어려워. 욱하는 ма음에 사표를 던지기보단 휴직이나 연수, 파견 등으로 합법적인 '잠수'를 타는 전략을 써봐." : "Public/Corp systems are hard to re-enter. Use options like long-term training or leave of absence.";
      } else if (isBusiness) {
        altAction = lang === 'KO' ? "이동 자체가 현금 흐름에 타격을 줄 수 있어. 업장을 당장 접기보단 운영 방식을 비대면이나 새로운 플랫폼으로 일부 변경하여 이동의 기운(역마)을 액땜해보는 걸 추천해." : "Instead of closing business, apply movement energy to marketing or platform shifts.";
      }

    } else if (movingType === 'transfer') {
      psychology = lang === 'KO' ? "조직 내에서의 위치 변동이나 역할 변화, 새로운 권력 구조에 대한 에너지가 강하게 밀려오고 있어." : "Strong energy pushing towards position changes within the organization.";
      fateAnalysis = lang === 'KO' ? "새로운 부서나 임무를 맡음으로써 네 능력이 새롭게 평가받을 수 있는 기회이자, 낡은 에너지를 환기하는 돌파구야." : "Opportunity to be re-evaluated by taking a new position.";
      
      if (matrix.coordinator.judgment_grade === 'A') {
        finalVerdict = lang === 'KO' ? "강력한 전진 배치 타이밍. 주저하지 말고 핵심 부서나 파견에 자원해라." : "Strong deployment timing. Volunteer for core departments.";
      } else {
        finalVerdict = lang === 'KO' ? "전출 및 파견은 흔들리는 네 운을 흡수해주는 아주 훌륭한 '액땜' 방어막이자 긍정적 지살(地殺)의 발현이야." : "Transfers act as a great defense mechanism against shaking luck.";
      }
      
      if (isMilitary) {
        altAction = lang === 'KO' ? "군 조직 특성상 이동수(역마/충)가 들어왔을 때 전출이나 상급/타 부대 파견으로 대응하는 것은 최고의 승부수야. 짐을 싸라." : "Answering movement energy with transfers is the best tactic in military.";
      }
    } else if (movingType === 'moving_house') {
      psychology = lang === 'KO' ? "주거 환경이나 생활 반경 자체를 완전히 뒤집어엎고 싶은 지살(地殺)이나 역마의 기운이 감돌고 있어." : "Energy of wanting to completely flip the living environment.";
      fateAnalysis = lang === 'KO' ? "이사나 거주지 이동을 통해 휴식의 질을 통제하고 막힌 지기(地氣)를 뚫어낼 수 있는 풍수적 해킹 도구야." : "Moving house acts as an eco-hack to control the quality of rest.";
      
      if (matrix.coordinator.judgment_grade === 'A') {
        finalVerdict = lang === 'KO' ? "이사를 하기에 최고의 타이밍이야. 새로운 터전이 너에게 새로운 활력을 줄 거야." : "Best timing to move. New place gives new vitality.";
      } else {
        finalVerdict = lang === 'KO' ? "가용 예산을 전부 소진하며 무리하게 매매나 이사를 할 타이밍은 아니야. 방어적 이동이 필요해." : "Not the time to exhaust budget on a forced move. Defensive movement needed.";
        altAction = lang === 'KO' ? "만약 무리한 이사가 부담스럽다면, 집안의 인테리어를 크게 바꾸거나 낡고 습한 가구를 버려서 에너지의 흐름(풍수)을 쇄신해봐." : "If moving is heavy, aggressively rearrange furniture to hack the fengshui.";
      }
    }

    const seunStemEl = BAZI_MAPPING.stems[matrix.dynamic_luck.current_seun.substring(0, 1)]?.element;
    const seunBranchEl = BAZI_MAPPING.branches[matrix.dynamic_luck.current_seun.substring(1, 2)]?.element;
    
    let dominantElement = '';
    let maxRatio = 0;
    Object.entries(matrix.analysis.five_elements_score).forEach(([el, val]) => {
      if ((val) > maxRatio) {
        maxRatio = val;
        dominantElement = el;
      }
    });

    const isOverloadYear = maxRatio > 35 && (seunStemEl === dominantElement || seunBranchEl === dominantElement);

    if (isOverloadYear && movingType !== 'transfer') {
      fateAnalysis = lang === 'KO' ? "넘치는 기운이 과부하를 일으켜 판을 무리하게 엎으려는 충동 기제로 발동 중이야." : "Overflowing energy is causing an overload impulse.";
      finalVerdict = lang === 'KO' ? "이름값이 아니라 실리를 챙겨. 충동으로 움직이면 화를 부를 수 있으니, 냉정하게 득실을 계산해라." : "Take practical benefits over name value. Rash moves invite disaster.";
      matrix.coordinator.judgment_grade = 'B';
    }

    const yongshinDetail = analysis.yongshinDetail || {};
    let yongshinElement = yongshinDetail.primary?.element || yongshinDetail.heeShin?.element || '';
    
    if (!yongshinElement) {
       if (dominantElement === 'Fire') yongshinElement = 'Water';
       else if (dominantElement === 'Wood') yongshinElement = 'Metal';
       else if (dominantElement === 'Earth') yongshinElement = 'Wood';
       else if (dominantElement === 'Metal') yongshinElement = 'Fire';
       else if (dominantElement === 'Water') yongshinElement = 'Earth';
    }

    const directionsTable = {
      'Wood': lang === 'KO' ? '동쪽 (새로운 기획과 시작의 에너지)' : 'East (Energy of new planning)',
      'Fire': lang === 'KO' ? '남쪽 (열정과 명예가 확장되는 에너지)' : 'South (Energy of passion)',
      'Earth': lang === 'KO' ? '중앙 또는 인근 도시 (안정과 기반의 에너지)' : 'Central (Stability)',
      'Metal': lang === 'KO' ? '서쪽 (결실과 기술적 성취가 보장된 에너지)' : 'West (Results and achievement)',
      'Water': lang === 'KO' ? '북쪽 (지혜와 유통의 흐름이 강한 에너지)' : 'North (Wisdom and flow)'
    };
    
    let bestDirection = directionsTable[yongshinElement] || (lang === 'KO' ? '북쪽 (지혜와 유통이 강한 방위)' : 'North (Wisdom)');

    if (matrix.interactions.gong_mang.length > 0) {
       const gmElements = matrix.interactions.gong_mang.map((b) => BAZI_MAPPING.branches[b]?.element);
       if (gmElements.includes(yongshinElement)) {
           const gmWarn = lang === 'KO' 
            ? \`공망 방위(\${bestDirection.split(' ')[0]})로의 이동은 밑빠진 독에 물 붓기야. 차라리 차선책인 다른 방위를 택해.\`
            : \`Moving to Void direction is futile. Pick another direction.\`;
           altAction = (altAction ? altAction + "\\n" : "") + gmWarn;
       }
    }

    let riskCheck = '';
    if (matrix.analysis.energy_state.includes('약')) {
        riskCheck = lang === 'KO' ? "현금 유동성이 떨어질 수 있으니 초기 정착/이동 비용을 예상치보다 20% 더 확보해둬." : "Secure 20% more buffer cash.";
    } else if (matrix.analysis.temperature_index.includes('극')) {
        riskCheck = lang === 'KO' ? "사주의 온도가 극단적이니 낯선 환경에서의 외로움이나 사람 간의 마찰에 철저히 대비해." : "Prepare for stress or friction in new environment.";
    } else if (matrix.analysis.energy_state.includes('왕') || matrix.analysis.energy_state.includes('강')) {
        riskCheck = lang === 'KO' ? "과열된 독단적 판단의 위험이 높아. 이직/이사 계약 시 반드시 타인의 조언을 최소 한 번은 크로스체크해." : "Avoid rash contracts; get cross-checks.";
    } else {
        riskCheck = lang === 'KO' ? "돌발 변수에 흔들리지 않도록 자산 포트폴리오나 예산을 먼저 단단히 통제해라." : "Lock down assets against random spending.";
    }

    let spatialAdvice = lang === 'KO' ? '주변의 간섭이 철저히 차단된 너만의 요새' : 'Isolated solo space';
    if (matrix.analysis.gyeokguk.includes('상관') || matrix.analysis.gyeokguk.includes('식신')) {
      spatialAdvice = lang === 'KO' ? "집이나 직장이 무조건 정보망/트렌드 핵심지(도심)와 가까워야 유리해." : "Near active urban centers.";
    } else if (matrix.analysis.gyeokguk.includes('관') || matrix.analysis.gyeokguk.includes('살')) {
      spatialAdvice = lang === 'KO' ? "타인의 시선에서 벗어나 쉴 수 있는 숲세권/공원 인근, 혹은 폐쇄적 안정감이 있는 곳" : "Quiet forest or park area.";
    } else if (matrix.analysis.gyeokguk.includes('재')) {
      spatialAdvice = lang === 'KO' ? "이동 자체가 나의 커리어나 현금 흐름 창출과 직결되는 경제/금융 타운 인근" : "Financial district.";
    }

    const jsonPayload = {
      theme: lang === 'KO' ? "궤도의 이탈" : "Deviation from Orbit",
      grade: matrix.coordinator.judgment_grade,
      energy_status: psychology,
      value: fateAnalysis,
      judgment: finalVerdict,
      alt_action: altAction,
      action_plan: {
        direction: bestDirection,
        risk_management: riskCheck,
        optimal_space: spatialAdvice
      }
    };

    const glitchText = matrix.coordinator.judgment_grade !== 'C' ?
      (lang === 'KO' ? "이동 자체에 취하지 마, 핵심은 '어떤 장비를 챙겨서 떠나느냐'야." : "Moving is a frequency adjustment. Adjust well.") :
      (lang === 'KO' ? "이동하고픈 충동이 치밀어도 날씨가 나쁠 땐 닻을 내리고 기다리는 것이 선장의 임무다." : "The best sailor doesn't sail in bad weather.");

    return { main: JSON.stringify(jsonPayload), glitch: glitchText, matrix };
  };
`;

  content = content.substring(0, analyzeMovingStart) + newAnalyzeMoving + content.substring(analyzeMovingEnd);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully replaced analyzeMoving.");
} else {
  console.error("Could not find insertion points.");
}
