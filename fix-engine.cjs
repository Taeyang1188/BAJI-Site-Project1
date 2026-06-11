const fs = require('fs');
const filepath = './src/services/personalized-text-engine.ts';
let code = fs.readFileSync(filepath, 'utf8');

// 1. Convert windows CRLF to standard LF to prevent mismatch
code = code.replace(/\r\n/g, '\n');

// 2. Perform the sweep-and-replace from getTraitDetailText down to tenGodPenetrationKo
// This cleanly evaporates the corrupt legacy duplication block at the end
const traitRegex = /function\s+getTraitDetailText[\s\S]+?(?=const\s+tenGodPenetrationKo)/;

const getTraitDetailTextReplacement = `function getTraitDetailText(key: string, score: number, lang: string = 'KO'): string {
  const isKO = lang === 'KO';
  
  if (key === 'creativity') {
    if (score >= 75) {
      return isKO 
        ? \`**창의력(\${score}점)**이 매우 높아 **기존의 방식을 깨고** 세상에 없던 **독창적인 아이디어와 가치를 창조**하는 데 탁월한 두각을 드러내며\`
        : \`with **Creativity (\${score})** being exceptionally high, allowing you to **break conventional molds** and **pioneer original ideas**;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**창의력(\${score}점)**이 양호하여 기존의 방식들을 영리하게 새롭게 **재조합**하고 실무에서 즉시 활용할 수 있는 **현실적인 아이디어를 응용**하는 능력이 있고\`
        : \`with **Creativity (\${score})** being balanced, enabling you to **combine existing templates** into **practical applications**;\`;
    } else {
      return isKO
        ? \`**창의력(\${score}점)**이 담담하여 허황된 상상보다는 이미 검증되어 있는 탄탄한 매뉴얼과 **성공 규칙을 충실히 실행**하는 안정을 택하며\`
        : \`with **Creativity (\${score})** being low, preferring to **follow structured rules and proven manuals** over speculative changes;\`;
    }
  }
  
  if (key === 'expressiveness') {
    if (score >= 75) {
      return isKO
        ? \`**표현력(\${score}점)**이 매우 강력하여 글, 말, 혹은 감정적 호소력을 동원해 자신의 생각을 상대의 머릿속에 **선명하게 각인시키는 설득력**이 비범하고\`
        : \`with **Expressiveness (\${score})** being very strong, giving you the ability to **vividly project and print** your thoughts into others' minds;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**표현력(\${score}점)**이 적절하여 과장이나 허세 없이 필요한 내용을 **조리 있고 명확하게** 상대방에게 오해 없이 전달하는 실무형 소통이 훌륭하며\`
        : \`with **Expressiveness (\${score})** being decent, enabling **clear and constructive communication** without unnecessary exaggeration;\`;
    } else {
      return isKO
        ? \`**표현력(\${score}점)**이 묵직하여 겉으로 화려하게 자기를 드러내기보다 침묵과 진지한 실천으로 **결과 자체를 묵묵히 증명**해내며\`
        : \`with **Expressiveness (\${score})** being low, choosing to remain quiet and **prove your worth through silent execution** rather than words;\`;
    }
  }

  if (key === 'leadership') {
    if (score >= 75) {
      return isKO
        ? \`**리더십(\${score}점)**이 매우 높아 스스로 책임감 있게 무대의 전면에 나서서 집단과 조직이 나아갈 **큰 그림을 제시하고 진두지휘**하는 데 타고난 카리스마를 발휘하며\`
        : \`with **Leadership (\${score})** being very high, allowing you to **take charge and steer organizations** with **visionary charisma**;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**리더십(\${score}점)**이 완만하여 권위적으로 지배하기보다는 **수평적이고 민주적인 소통**으로 팀원들의 잠재력을 끌어내는 뒤편의 중재자 역할을 잘 해내고\`
        : \`with **Leadership (\${score})** being moderate, leading not by authority but through **cooperative orchestration** of team members;\`;
    } else {
      return isKO
        ? \`**리더십(\${score}점)**이 낮아 전면에 나서는 책임 부담보다는 실무 전문가로서 **나만의 영역을 온전히 구축**하고 임무를 수행하는 데 더 편안함을 느끼며\`
        : \`with **Leadership (\${score})** being low, feeling more at ease performing as a **specialist** rather than carrying the burden of leading others;\`;
    }
  }

  if (key === 'decisionMaking') {
    if (score >= 75) {
      return isKO
        ? \`**결단력(\${score}점)**이 아주 높아 어떤 불확실한 위기나 리스크 속에서도 주저함 없이 **신속하게 핵심을 파고들어** 단호한 실행을 돌파하고\`
        : \`with **Decision Making (\${score})** being very high, enabling **swift, bold choices** and **immediate execution** under pressure;\`;
    } else if (score >= 40) { 
      return isKO
        ? \`**결단력(\${score}점)**이 합리적이어서 정보와 데이터를 충분히 검토하고 비교 분석하여 **가장 안전하고 확실한 대안**을 선택하는 데 탁월하고\`
        : \`with **Decision Making (\${score})** being sensible, carefully balancing options and data before **choosing the safest route**;\`;
    } else {
      return isKO
        ? \`**결단력(\${score}점)**이 신중하여 때로 결정 장애나 우유부단함을 겪을 수 있으나 실수와 실패 리스크를 극소화하는 **돌다리 두드리기** 강점이 돋보이고\`
        : \`with **Decision Making (\${score})** being overly cautious, **minimizing risks of failure** by double-checking all variables;\`;
    }
  }

  if (key === 'mental') {
    if (score >= 75) {
      return isKO
        ? \`**멘탈(\${score}점)**이 대단히 강건하여 혹독한 외부의 압박이나 갈등이 밀려와도 감정적으로 굴복하지 않고 내면의 **평정심과 냉철함**을 지키는 회복탄력성이 넘치며\`
        : \`with **Mental Strength (\${score})** being extremely robust, granting **high resilience** to withstand external pressure without losing focus;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**멘탈(\${score}점)**이 평이하여 보편적인 환경에서는 안정감을 가지나 스트레스 수치가 한계에 달할 때는 나만의 **휴식과 심리적 정화**가 요구되고\`
        : \`with **Mental Strength (\${score})** being average, staying stable under normal situations but requiring **proper reset cycles** when highly stressed;\`;
    } else {
      return isKO
        ? \`**멘탈(\${score}점)**이 매우 섬세하여 환경의 미세한 변화나 타인의 시선에 민감하게 반응하므로 평정심을 지켜줄 든든한 **지지층과 루틴**을 필요로 하고\`
        : \`with **Mental Strength (\${score})** being sensitive, making you vulnerable to external opinions and requiring **protective boundaries**;\`;
    }
  }

  if (key === 'responsibility') {
    if (score >= 75) {
      return isKO
        ? \`**책임감(\${score}점)**이 완벽에 가까워 자기 영역의 성과나 약속을 타협 없이 지켜내며, 아무리 고단해도 조직과 약자를 위해 **끝까지 헌신해내는 신뢰**를 주며\`
        : \`with **Responsibility (\${score})** being absolute, ensuring you **fulfill your commitments to the end**, earning deep respect for your integrity;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**책임감(\${score}점)**이 성실하여 나에게 할당된 직무는 꼼꼼히 소화하되 나의 일상과 건강도 소중히 지키는 스마트한 **라이프 밸런스**를 발휘하며\`
        : \`with **Responsibility (\${score})** being diligent, performing your assigned duties reliably while maintaining **healthy personal boundaries**;\`;
    } else {
      return isKO
        ? \`**책임감(\${score}점)**이 유연하여 스스로 모든 짐을 짊어지려 애쓰기보다 적절한 타이밍에 주위에 도움을 요청하고 **역할을 지혜롭게 분배**할 줄 알며\`
        : \`with **Responsibility (\${score})** being flexible, knowing **when to delegate and share the load** rather than burning out from carrying it alone;\`;
    }
  }

  if (key === 'fightingSpirit') {
    if (score >= 75) {
      return isKO
        ? \`**승부욕(\${score}점)**이 뜨겁게 타올라 어려운 장벽이나 라이벌이 나타날 때 **강한 투지를 불태우며** 목표를 쟁취해내는 승부사 마인드가 강하고\`
        : \`with **Competitive Drive (\${score})** being intense, igniting a **powerful fighting spirit and drive to win** when facing obstacles or rivals;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**승부욕(\${score}점)**이 적절하여 굳이 남을 밟고 올라서기보다 어제의 나 자신을 극복하려는 **평화적이며 건강한 성장**에 초점을 맞추며\`
        : \`with **Competitive Drive (\${score})** being healthy, focusing on **personal growth and self-improvement** rather than fighting others;\`;
    } else {
      return isKO
        ? \`**승부욕(\${score}점)**이 완만하여 대립과 소모적 경쟁을 지양하고 다 함께 시너지를 낼 수 있는 따뜻한 **연대와 타협**을 지향하며\`
        : \`with **Competitive Drive (\${score})** being low, prioritizing **collaboration and mutual alignment** over exhausting rivalry;\`;
    }
  }

  if (key === 'nobleSupport') {
    if (score >= 75) {
      return isKO
        ? \`**귀인복(\${score}점)**이 대단히 훌륭하여 인생의 결정적 위기마다 생각지 못한 스승, 파트너, 혹은 조력자가 나타나 **구원의 물꼬**를 트여주는 혜택을 누리며\`
        : \`with **Benefactor Luck (\${score})** being exceptional, ensuring **supportive mentors, patrons, or opportunities** emerge to guide you through crises;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**귀인복(\${score}점)**이 원만하여 본인의 성실하고 예의 바른 태도를 통해 서서히 **믿음직한 인맥과 동료들의 소중한 지지지**를 획득해내며\`
        : \`with **Benefactor Luck (\${score})** being decent, gradually earning **valuable support and trust** through your polite and honest interactions;\`;
    } else {
      return isKO
        ? \`**귀인복(\${score}점)**에 의지하기보다 오직 내 실력과 의지로 삶의 개척길을 열어가야 하니 강인한 **자수성가형 독립 정신**을 입증하며\`
        : \`with **Benefactor Luck (\${score})** being low, prompting you to build success strictly on your own merits, proving a **self-made resilience**;\`;
    }
  }

  if (key === 'peopleReading') {
    if (score >= 75) {
      return isKO
        ? \`**사람보는 눈(\${score}점)**이 극도로 예리하여 스쳐 지나가는 대화나 눈빛만으로도 상대방의 숨겨진 장단점과 속내를 꿰뚫어보는 **초감각적 인간 통찰**을 가졌으며\`
        : \`with **Insight into People (\${score})** being extremely sharp, allowing you to **read hidden motives and traits** through microscopic cues;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**사람보는 눈(\${score}점)**이 균형을 이루어 열린 태도로 사람들과 소통하면서도 상식을 바탕으로 객관적인 신용도를 합리적으로 **검증해내는 안목**이 있고\`
        : \`with **Insight into People (\${score})** being pragmatic, communicating openly while maintaining logical filters to **assess trustworthiness**;\`;
    } else {
      return isKO
        ? \`**사람보는 눈(\${score}점)**이 소박하여 남들을 지나치게 긍정적으로 믿다가 상처를 받을 수 있으니 계약이나 금전 동업 시 **철저한 팩트 체크**가 필요하며\`
        : \`with **Insight into People (\${score})** being low, cautioning you to **rely on written contracts and facts** rather than blind assumptions;\`;
    }
  }

  if (key === 'sensitivity') {
    if (score >= 75) {
      return isKO
        ? \`**감수성(\${score}점)**이 깊어 예술적 정서, 타인의 마음 상처에 공감하는 온기를 품고 있어 다른 이들이 포착하지 못하는 **미세한 뉘앙스를 섬세히 만져줄 수** 있고\`
        : \`with **Sensitivity (\${score})** being deep, gifting you a **rich artistic sense and emotional empathy** to connect with hidden nuances;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**감수성(\${score}점)**이 건강하여 상대방의 아픔을 공감해주면서도 감정에 매몰되지 않는 **냉철한 균형 감각**을 현명하게 이끌어내며\`
        : \`with **Sensitivity (\${score})** being balanced, offering warm empathy without letting emotions **cloud your logical judgment**;\`;
    } else {
      return isKO
        ? \`**감수성(\${score}점)**이 담백하여 불필요한 감정 소모를 배제하고 객관적인 팩트와 수치, 현실적인 결과 중심의 **냉철한 이성**을 중시하며\`
        : \`with **Sensitivity (\${score})** being low, keeping interactions objective and focusing strictly on **practical facts and results**;\`;
    }
  }

  if (key === 'independence') {
    if (score >= 75) {
      return isKO
        ? \`**독립심(\${score}점)**이 우뚝 서 있어 타인의 잔소리나 지시를 극도로 기피하며, 모든 중요한 행보는 **주체적으로 설계하고 책임**질 때 깊은 주권 행복을 얻고\`
        : \`with **Independence (\${score})** being very high, refusing subordinate constraints and thriving best when **commanding your own path**;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**독립심(\${score}점)**이 성숙하여 내 주관을 뚜렷이 수호하되 타인의 합당한 비판이나 조언은 겸허히 융합할 수 있는 **유연한 에고**를 가지고 있고\`
        : \`with **Independence (\${score})** being balanced, maintaining your values while constructively **integrating others' feedback**;\`;
    } else {
      return isKO
        ? \`**독립심(\${score}점)**이 낮아 혼자 고립되는 것보다 거대한 기업의 인프라, 든든한 멘토, 혹은 **시스템의 조력을 결합**할 때 안정과 성장이 극대화되고\`
        : \`with **Independence (\${score})** being low, thriving best when leaning on **robust systems, partners, or corporate infrastructures**;\`;
    }
  }

  if (key === 'patience') {
    if (score >= 75) {
      return isKO
        ? \`**인내심(\${score}점)**이 아주 두터워 모든 이가 낙담하고 중도 하차하는 지루한 모래밭 싸움 속에서도 기어이 버티며 임계점을 넘는 **끝판왕 끈기**가 강점이며\`
        : \`with **Patience (\${score})** being very high, empowering you to **persist through prolonged hardships** and cross the finish line;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**인내심(\${score}점)**이 현실적이어서 가망 없는 곳에 무작정 존버하기보다는 효율성과 가능성을 영리하게 재서 방향을 틀 줄 아는 **순발력이 조화롭고**\`
        : \`with **Patience (\${score})** being practical, knowing **when to endure and when to pivot** to preserve resources;\`;
    } else {
      return isKO
        ? \`**인내심(\${score}점)**이 급하여 변화 없는 단순 반복을 견디기 어렵지만 빠른 속도와 기동성이 요구되는 단기 임팩트 무대에서 **놀라운 몰입**을 끌어내고\`
        : \`with **Patience (\${score})** being low, finding routine boring but exhibiting **explosive concentration** in fast-paced short-term tasks;\`;
    }
  }

  if (key === 'businessSense') {
    if (score >= 75) {
      return isKO
        ? \`**사업감각(\${score}점)**이 탁월하여 무형의 가치나 상황에서 기회와 돈의 냄새를 맡고 자원을 효율적으로 배분해 현실적 실속을 쓸어 담는 **장사꾼 직감**이 있고\`
        : \`with **Business Acumen (\${score})** being exceptional, letting you **spot market opportunities** and allocate assets to maximize profits;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**사업감각(\${score}점)**이 차분하여 일확천금을 쫓기보다 명확한 저축, 합리적 지출 필터를 작동시켜 가계를 단단히 설계하는 **안정주의 재테크**를 선호하며\`
        : \`with **Business Acumen (\${score})** being stable, avoiding speculative gambles and focusing on **reliable asset accumulation** and management;\`;
    } else {
      return isKO
        ? \`**사업감각(\${score}점)**이 순수하여 오직 이익만을 쫓는 계산적 처세보다는 공익, 도덕적 가치, 혹은 정신적 만족을 우선하는 **따뜻한 인도주의**를 품었고\`
        : \`with **Business Acumen (\${score})** being low, prioritizing **intellectual values, public good**, or artistic growth over calculations;\`;
    }
  }

  if (key === 'relationshipLuck') {
    if (score >= 75) {
      return isKO
        ? \`**관계운(\${score}점)**이 넘치어 특유의 사교성과 호감 가는 처세로 처음 보는 사람과도 금방 벽을 허물며 **풍성한 대인관계를 유지**하는 재주를 보이고\`
        : \`with **Relationship Luck (\${score})** being high, helping you **break boundaries easily** with social warmth and charm;\`;
    } else if (score >= 40) {
      return isKO
        ? \`**관계운(\${score}점)**이 합리적이어서 불필요하게 넓은 인간관계로 에너지를 낭비하지 않고 소수와의 **단단한 정서적 유대**를 실리적으로 지향하고\`
        : \`with **Relationship Luck (\${score})** being average, maintaining healthy distance and focusing on **meaningful, stable connections**;\`;
    } else {
      return isKO
        ? \`**관계운(\${score}점)**이 고독하여 얕고 시끄러운 모임을 거부하고 나만의 사색과 진정한 소수정예 친밀함으로 **불필요한 인간적 피로를 차단**하며\`
        : \`with **Relationship Luck (\${score})** being low, avoiding superficial networking and **preserving your energy** through solitary focus;\`;
    }
  }

  return '';
}

`;

if (traitRegex.test(code)) {
  code = code.replace(traitRegex, getTraitDetailTextReplacement);
  console.log('Successfully swept and replaced the entire function including lingering duplicate segments!');
} else {
  console.log('Failed to match traitRegex.');
}

fs.writeFileSync(filepath, code, 'utf8');
