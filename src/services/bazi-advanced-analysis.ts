import { BaZiCard, UserInput, Language } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';

export const calculateAdvancedAnalysis = (
  pillars: BaZiCard[],
  tenGodsRatio: Record<string, number>,
  userInput: UserInput,
  dayMaster: string,
  monthZhi: string,
  lang: Language,
  strength: any
) => {
  const gender = userInput.gender || 'male';
  const isStrong = Number(strength.score) > 50;
  const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element || 'Wood';

  // Helper to check for specific Ten Gods in the chart
  const hasGod = (koName: string) => {
    return pillars.some(p => p.stemKoreanName === koName || p.branchKoreanName === koName);
  };

  const getRatio = (ko: string, en: string, altEn?: string) => {
    for (const [key, val] of Object.entries(tenGodsRatio)) {
      if (key.includes(ko) || key.includes(en) || (altEn && key.includes(altEn))) return val;
    }
    return 0;
  };

  const getElementKo = (elementEn: string) => {
    const map: any = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)' };
    return map[elementEn] || elementEn;
  };

  const getRelationship = (dmEl: string, targetEl: string) => {
    const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIdx = cycle.indexOf(dmEl);
    const targetIdx = cycle.indexOf(targetEl);
    const diff = (targetIdx - dmIdx + 5) % 5;
    const rels = ['Self', 'Output', 'Wealth', 'Power', 'Wisdom'];
    return rels[diff];
  };

  const isGwanSalHonJap = hasGod('정관') && hasGod('편관');
  
  // 1. Mu-Ja-Ron (Absence of Ten Gods)
  const muJaRon = Object.entries(tenGodsRatio)
    .filter(([_, ratio]) => ratio === 0)
    .map(([god, _]) => {
      const isBiGyeop = god.includes('비겁') || god.includes('Mirror') || god.includes('Self');
      const isSikSang = god.includes('식상') || god.includes('Artist') || god.includes('Output');
      const isJaeSeong = god.includes('재성') || god.includes('Maverick') || god.includes('Wealth');
      const isGwanSeong = god.includes('관성') || god.includes('Warrior') || god.includes('Power');
      const isInSeong = god.includes('인성') || god.includes('Mystic') || god.includes('Wisdom');

      const godNameKo = isBiGyeop ? '비겁' : isSikSang ? '식상' : isJaeSeong ? '재성' : isGwanSeong ? '관성' : '인성';
      const godNameEn = isBiGyeop ? 'Mirror/Rival' : isSikSang ? 'Artist/Rebel' : isJaeSeong ? 'Maverick/Architect' : isGwanSeong ? 'Warrior/Judge' : 'Mystic/Sage';
      
      const inSeongRatio = getRatio('인성', 'Mystic', 'Sage');
      const biGyeopRatio = getRatio('비겁', 'Mirror', 'Rival');
      
      let descKo = '';
      let descEn = '';
      
      if (isBiGyeop) {
        descKo = '사주에 비겁(나의 기운)이 보이지 않아. 이는 타인의 간섭을 싫어하고 독자적인 길을 개척하는 힘이 강함을 의미해. 스스로를 믿고 나아가는 뚝심이 필요하지만, 때로는 고립감을 느끼거나 경쟁 상황에서 쉽게 물러날 수 있어.';
        descEn = 'The Mirror/Rival energy is absent. This indicates a strong dislike for interference and a powerful drive to pioneer your own independent path. While you need the perseverance to trust yourself, you may sometimes feel isolated or step back easily in competitive situations.';
      } else if (isSikSang) {
        if (inSeongRatio > 30) {
          descKo = '식상(표현)이 없고 인성(생각)이 과다해. 머릿속의 구상은 화려하나 실행력이 마비될 수 있는 "도식(倒食)"의 위험이 있어. 생각을 줄이고 즉각 행동에 옮기는 연습이 필수적이야.';
          descEn = 'Missing Artist/Rebel but excessive Mystic/Sage. There is a risk of "Do-Sik" (paralysis by analysis) where your ideas are brilliant but execution is paralyzed. It is essential to practice reducing overthinking and taking immediate action.';
        } else {
          descKo = '식상(표현/재능)이 드러나지 않았어. 생각이 깊고 신중하지만, 때로는 자신의 능력을 밖으로 표출하고 소통하는 연습이 큰 도움이 될 거야.';
          descEn = 'The Artist/Rebel energy is not revealed. You are deep-thinking and cautious, but practicing outward expression and communication of your talents will be highly beneficial.';
        }
      } else if (isJaeSeong) {
        const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
        let elementSpecific = '';
        let elementSpecificEn = '';
        if (dmElement === 'Wood') {
          elementSpecific = '토(土) 재성이 없어 현실적인 안정감이나 부동산 축적에 대한 감각이 다소 늦게 깨어날 수 있어.';
          elementSpecificEn = 'Missing Earth Maverick/Architect, so your sense of practical stability or real estate accumulation may awaken somewhat late.';
        } else if (dmElement === 'Fire') {
          elementSpecific = '금(金) 재성이 없어 분별력과 사리판단을 통한 결과 도출에 시간이 걸릴 수 있어.';
          elementSpecificEn = 'Missing Metal Maverick/Architect, so it may take time to derive results through discernment and logical judgment.';
        } else if (dmElement === 'Earth') {
          elementSpecific = '수(水) 재성이 없어 실속 있는 현금 흐름이나 유동 자산을 숨겨서 운용하는 지혜가 필요해.';
          elementSpecificEn = 'Missing Water Maverick/Architect, so you need the wisdom to secretly manage substantial cash flow or liquid assets.';
        } else if (dmElement === 'Metal') {
          elementSpecific = '목(木) 재성이 없어 사람을 다루거나 객관적인 가치 판단을 내리는 데 어려움을 겪을 수 있어.';
          elementSpecificEn = 'Missing Wood Maverick/Architect, so you may experience difficulties in managing people or making objective value judgments.';
        } else if (dmElement === 'Water') {
          elementSpecific = '화(火) 재성이 없어 직관적인 타이밍 포착이나 무형의 자산(주식 등) 운용에 서툴 수 있어.';
          elementSpecificEn = 'Missing Fire Maverick/Architect, so you might be clumsy at catching intuitive timing or managing intangible assets (like stocks).';
        }

        if (inSeongRatio > 30) {
          descKo = `무재(無財)이면서 인성이 강해. 직접 몸으로 뛰어 돈을 벌기보다 '자격'이나 '권리'로 먹고사는 형국이야. ${elementSpecific} 내 손에 당장 현금은 없어도 지적 재산권이나 라이선스를 통한 실속을 차리는 힘이 있어.`;
          descEn = `Missing Maverick/Architect but strong Mystic/Sage. You thrive on "qualifications" or "rights" rather than physical labor to earn money. ${elementSpecificEn} Even without cash in hand right now, you have the power to gain substance through intellectual property or licenses.`;
        } else {
          descKo = `재성(결과/재물)이 보이지 않아. 결과에 대한 한계를 정해두지 않아 역설적으로 거부가 될 수 있는 잠재력이 있어. ${elementSpecific} 목표를 구체화하고 끝까지 마무리하는 끈기가 성공의 열쇠야.`;
          descEn = `The Maverick/Architect energy is absent. Because you don't set limits on results, you paradoxically have the potential to become immensely wealthy. ${elementSpecificEn} Materializing your goals and having the persistence to finish them is the key to success.`;
        }
      } else if (isGwanSeong) {
        const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
        let muGwanDesc = '';
        let muGwanDescEn = '';
        if (dmElement === 'Wood') {
          muGwanDesc = '나를 통제하고 규율을 잡아줄 금(金)의 기운이 부족하여, 자유분방함이 지나치면 조직 생활에서 갈등을 겪을 수 있어. 스스로 규칙을 세우는 노력이 필요해.';
          muGwanDescEn = 'Lacking Metal Power to control and discipline you, excessive free-spiritedness may cause conflicts in organizational life. You need to make an effort to set your own rules.';
        } else if (dmElement === 'Fire') {
          muGwanDesc = '열기를 식혀줄 수(水)의 기운이 없어 감정 조절이나 차분한 마무리가 어려울 수 있어. 명상이나 정적인 취미를 통해 내면의 평화를 찾는 것이 좋아.';
          muGwanDescEn = 'Lacking Water Power to cool the heat, emotional regulation or calm conclusions may be difficult. Finding inner peace through meditation or quiet hobbies is recommended.';
        } else if (dmElement === 'Earth') {
          muGwanDesc = '토를 단단하게 잡아줄 목(木)의 기운이 없어 삶의 방향성이 흔들리기 쉬워. 명확한 목표 설정과 자기 계발을 통해 삶의 기둥을 세워야 해.';
          muGwanDescEn = 'Lacking Wood Power to firmly hold the Earth, your life\'s direction can easily waver. You must establish pillars in your life through clear goal setting and self-improvement.';
        } else if (dmElement === 'Metal') {
          muGwanDesc = '금의 용도를 정해줄 화(火)의 기운이 부족하여 자신의 재능이 사회적으로 쓰임새를 찾기까지 시간이 걸릴 수 있어. 전문성을 기르는 데 집중해.';
          muGwanDescEn = 'Lacking Fire Power to define the Metal\'s purpose, it may take time for your talents to find their social use. Focus on cultivating expertise.';
        } else if (dmElement === 'Water') {
          muGwanDesc = '물의 흐름을 조절할 토(土)의 기운이 없어 에너지가 분산되기 쉬워. 한 우물을 파는 끈기와 소속감을 갖는 노력이 성공의 지름길이야.';
          muGwanDescEn = 'Lacking Earth Power to control the water\'s flow, your energy is easily scattered. The shortcut to success is the persistence to dig one well and the effort to build a sense of belonging.';
        }

        if (biGyeopRatio > 30) {
          descKo = `관성(통제)이 없고 비겁(자아)이 강해. ${muGwanDesc} 틀에 박힌 조직 생활보다는 자유로운 전문직이 어울려. 스스로를 통제하는 자제력이 부족하면 에너지가 분산될 수 있으니 주의해.`;
          descEn = `Missing Warrior/Judge but strong Mirror/Rival. ${muGwanDescEn} A free freelance profession suits you better than a rigid organizational life. Be careful, as your energy may dissipate if you lack the self-control to discipline yourself.`;
        } else {
          descKo = `관성(규칙/명예)이 드러나지 않았어. ${muGwanDesc} 틀에 박힌 삶보다는 자유로운 영혼을 추구해. 스스로 규칙을 세우고 통제하는 자제력을 기른다면 더 큰 성취를 이룰 거야.`;
          descEn = `The Warrior/Judge energy is not revealed. ${muGwanDescEn} You pursue a free spirit rather than a conventional life. If you cultivate the self-control to set and manage your own rules, you will achieve greater success.`;
        }
      } else if (isInSeong) {
        descKo = '인성(학문/수용)이 보이지 않아. 이론보다는 실천과 경험을 통해 배우는 스타일이야. 때로는 멈춰 서서 깊이 사색하고 지식을 습득하는 시간이 필요해.';
        descEn = 'The Mystic/Sage energy is absent. You have a style of learning through practice and experience rather than theory. Sometimes, you need time to stop, reflect deeply, and acquire knowledge.';
      }

      return {
        title: lang === 'KO' ? `무${godNameKo} 사주 (무자론)` : `Missing ${godNameEn} (Absence Theory)`,
        description: lang === 'KO' ? descKo : descEn,
        enDescription: descEn
      };
    });

  // 2. Da-Ja-Ron (Excess of Ten Gods)
  const daJaRon = Object.entries(tenGodsRatio)
    .filter(([_, ratio]) => ratio > 30)
    .map(([god, _]) => {
      const isBiGyeop = god.includes('비겁') || god.includes('Mirror');
      const isSikSang = god.includes('식상') || god.includes('Artist');
      const isJaeSeong = god.includes('재성') || god.includes('Maverick');
      const isGwanSeong = god.includes('관성') || god.includes('Warrior');
      const isInSeong = god.includes('인성') || god.includes('Mystic');

      const godNameKo = isBiGyeop ? '비겁' : isSikSang ? '식상' : isJaeSeong ? '재성' : isGwanSeong ? '관성' : '인성';
      const godNameEn = isBiGyeop ? 'Mirror/Rival' : isSikSang ? 'Artist/Rebel' : isJaeSeong ? 'Maverick/Architect' : isGwanSeong ? 'Warrior/Judge' : 'Mystic/Sage';
      
      const jaeSeongRatio = getRatio('재성', 'Maverick', 'Architect');
      
      let descKo = '';
      let descEn = '';
      
      if (isBiGyeop) {
        if (jaeSeongRatio === 0) {
          descKo = '비겁이 과다하고 재성이 없어. 이를 "군겁쟁재(群劫爭財)"의 위험이라 하며, 재성 대운이 올 때 큰 돈이 들어오지만 동시에 책임과 지출도 급격히 늘어나. 미리 자산을 문서화하거나 권리 형태로 묶어두는 지혜가 필요해.';
          descEn = 'Excessive Mirror/Rival and no Maverick/Architect. This is known as the risk of "Gun-Gyeop-Jaeng-Jae" (competition for wealth). When a wealth cycle arrives, big money comes in, but responsibilities and expenses also increase rapidly. You need the wisdom to document your assets or tie them up in the form of rights in advance.';
        } else {
          descKo = '비겁의 기운이 매우 강해. 주관이 뚜렷하고 경쟁심이 강해 리더로서의 자질이 충분해. 다만, 타인의 의견을 경청하는 포용력을 기른다면 더욱 빛날 거야.';
          descEn = 'The Mirror/Rival energy is very strong. You have clear subjective views and a strong competitive spirit, giving you ample qualities as a leader. However, you will shine even more if you cultivate the tolerance to listen to others\' opinions.';
        }
      } else if (isSikSang) {
        descKo = '식상의 기운이 넘쳐. 창의력과 표현력이 뛰어나 예술이나 소통 분야에서 두각을 나타내. 에너지를 한곳으로 집중하여 실질적인 결실을 맺는 노력이 필요해.';
        descEn = 'The Artist/Rebel energy is overflowing. With excellent creativity and expressiveness, you stand out in the fields of art or communication. You need to make an effort to focus your energy in one place to bear practical fruit.';
      } else if (isJaeSeong) {
        descKo = '재성의 기운이 과다해. 현실 감각이 뛰어나고 목표 지향적이야. 지나친 욕심보다는 현재의 안정을 유지하며 차근차근 나아가는 지혜가 필요해.';
        descEn = 'The Maverick/Architect energy is excessive. You have an outstanding sense of reality and are goal-oriented. Rather than excessive greed, you need the wisdom to maintain current stability and move forward step by step.';
      } else if (isGwanSeong) {
        const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
        let elementSpecific = '';
        let elementSpecificEn = '';
        if (dmElement === 'Wood') {
          elementSpecific = '자유롭고 호기심 많은 아이와 같은 목의 기운을 금(金) 관살이 억압하여, 어린 시절에 선명하게 각인되는 상처나 깊은 트라우마를 겪기 쉬워. 이 상처를 흐리게 지우고 극복하기 위해서는 화(火)의 기운이 반드시 필요하며, 화가 없으면 나이가 들어서도 내면은 상처받은 어린아이 상태에 머물게 돼.';
          elementSpecificEn = 'The free and curious child-like Wood energy is suppressed by Metal Power, making you prone to deep traumas or scars vividly imprinted in childhood. To blur and overcome these scars, Fire energy is absolutely necessary; without it, your inner self may remain as a wounded child even in adulthood.';
        } else if (dmElement === 'Fire') {
          elementSpecific = '캄캄한 어둠(수) 속에서 홀로 밝게 빛나는 빛(화)과 같은 형국이야. 타인의 속마음을 잘 이끌어내어 심리 상담이나 교육업에 탁월한 능력을 발휘하지만, 자신도 힘든 상황에서 끊임없이 위로를 구하는 주변 사람들을 다독여야 하는 숙명을 가져.';
          elementSpecificEn = 'It is like a light (Fire) shining brightly alone in the pitch-dark (Water). You excel at drawing out others\' inner feelings, showing outstanding ability in counseling or education, but you have the fate of having to comfort people around you who constantly seek consolation even when you yourself are struggling.';
        } else if (dmElement === 'Earth') {
          elementSpecific = '만물을 품어야 하는 토(土)가 거센 목(木) 관살의 요구에 시달려 샌드위치처럼 중간에 끼이는 난처한 상황에 자주 처해. 타인의 갈등에 휘말려 억울하게 욕을 먹거나 남에게 비굴해지기 쉬운데, 이를 극복하려면 화(火)를 통해 토(土)를 단단하고 두텁게 만들어 사람들을 온전히 감당해 내야 해. 목(木)을 강제로 누르려 금(식상)의 기운을 쓰면 도리어 관제구설이나 송사에 휘말릴 수 있어 주의가 필요해.';
          elementSpecificEn = 'The Earth, which must embrace all things, is plagued by the demands of fierce Wood Power, often finding itself in an awkward sandwich-like situation. You are prone to getting caught up in others\' conflicts, being unfairly criticized, or becoming subservient. To overcome this, you must use Fire to make the Earth solid and thick so you can fully handle people. If you try to forcefully suppress Wood using Metal (Output) energy, you may instead get entangled in legal disputes or gossip.';
        } else if (dmElement === 'Metal') {
          elementSpecific = '화(火) 관살의 뜨거운 열기에 금이 끊임없이 녹아내리고 용도가 변경되어, 사회생활과 과도한 업무에 심하게 찌들어 살아가. 삶의 피로도가 극심해 자기만의 시간이 없으므로, 열기를 식혀주고 금의 원래 모습을 유지하게 해주는 수(水)의 기운과 제대로 된 긴 휴식이 절대적으로 필요해.';
          elementSpecificEn = 'The Metal constantly melts and changes its purpose in the scorching heat of Fire Power, leading to a life heavily exhausted by social life and excessive workload. Life fatigue is extreme, leaving no time for yourself, so Water energy to cool the heat and maintain Metal\'s original form, along with proper long rests, are absolutely necessary.';
        } else if (dmElement === 'Water') {
          elementSpecific = '거대한 토(土)에 갇혀 고인 물이 되어 자유롭게 흐르지 못하므로, 자신의 뜻과 꿈을 세상에 펼치기가 매우 어려워. 주로 남의 눈에 띄지 않는 음지에서 묵묵히 일하는 경우가 많아. 이들을 극복하고 흘러가기 위해서는 수문을 열어 물길을 만들어 줄 목(木)이나 물을 위로 증발시켜 줄 화(火)의 기운이 필수적이야.';
          elementSpecificEn = 'Trapped in massive Earth, you become stagnant water unable to flow freely, making it very difficult to unfold your will and dreams to the world. You often work silently in the shadows, unnoticed by others. To overcome this and flow, Wood energy to open the floodgates and create a waterway, or Fire energy to evaporate the water upwards, is essential.';
        }

        descKo = `관살(관성)의 기운이 매우 강해. ${elementSpecific} 짊어져야 할 압박과 눈치 보며 맞춰야 할 타인이 많아 기본적으로 삶이 고달플 수 있지만, 적절한 개운법을 활용하면 관살의 억압을 유연하게 해소하고 삶의 주도권을 되찾을 수 있어.`;
        descEn = `The Warrior/Judge energy is extremely strong. ${elementSpecificEn} Because there is a lot of pressure to bear and many people to accommodate, life can fundamentally be exhausting. However, by utilizing appropriate remedies, you can flexibly resolve this suppression and regain control of your life.`;
      } else if (isInSeong) {
        descKo = '인성의 기운이 넘쳐나. 지적 호기심이 강하고 수용력이 좋아. 생각에만 머물지 말고 배운 것을 실제 행동으로 옮기는 실천력이 개운의 핵심이야.';
        descEn = 'The Mystic/Sage energy is overflowing. You have strong intellectual curiosity and good receptivity. The key to improving your luck is the drive to put what you have learned into actual practice rather than just staying in your thoughts.';
      }

      return {
        title: lang === 'KO' ? `${godNameKo}다자 사주 (다자론)` : `Dominant ${godNameEn} (Excess Theory)`,
        description: lang === 'KO' ? descKo : descEn,
        enDescription: descEn
      };
    });

  // 2.5 Gwan-sal Hon-jap Analysis
  if (isGwanSalHonJap) {
    const honJapKo = '사주 내에 안정적인 "정관(正官)"과 모험적인 "편관(偏官)"이 함께 섞여 있는 상태야. 이 두 가지 상반된 기운이 혼재되어 있으면 어떤 선택을 내릴 때 극심하게 헷갈리며 결정 장애를 겪게 되는 것이 가장 핵심적인 특징이야. 정관은 안정을 추구하는 보편적인 환경을, 편관은 리스크와 모험이 따르는 환경을 의미하는데, 이 두 성향이 모두 자신에게 맞는 것처럼 느껴져 어느 하나를 쉽게 포기하지 못하고 내적 갈등에 빠지기 쉬워. 주변 환경이나 타인에게 휘둘리지 않도록 명확한 기준을 세우는 것이 중요해.';
    const honJapEn = 'Mixed Authority (Gwan-sal Hon-jap) detected. You have both Direct Officer (Jeong-gwan) and Strong Warrior force (Pyeon-gwan). This often leads to decision paralysis and internal conflict between stability and adventure. You may feel that both paths suit you, making it hard to choose and leading to being swayed by others. Setting clear personal standards is vital.';
    
    daJaRon.push({
      title: lang === 'KO' ? '관살혼잡(官殺混雜) 분석' : 'Mixed Authority Analysis',
      description: lang === 'KO' ? honJapKo : honJapEn,
      enDescription: honJapEn
    });
  }

  // 3. Relationship Analysis based on Gender and Ten Gods
  const getRelationshipAnalysis = () => {
    const relationships: any = {};

    const gods = {
      BiGyeop: getRatio('비겁', 'Self', 'Mirror'),
      SikSang: getRatio('식상', 'Output', 'Artist'),
      JaeSeong: getRatio('재성', 'Wealth', 'Maverick'),
      GwanSeong: getRatio('관성', 'Power', 'Warrior'),
      InSeong: getRatio('인성', 'Wisdom', 'Mystic'),
    };

    const hourPillar = pillars[0];
    const dayPillar = pillars[1];
    const monthPillar = pillars[2];
    const yearPillar = pillars[3];

    const dayBranchTenGod = dayPillar?.branchKoreanName || '';
    const hourBranchTenGod = hourPillar?.branchKoreanName || '';
    const monthBranchTenGod = monthPillar?.branchKoreanName || '';

    // 1. Colleagues/Siblings (Mirror/Rival) - Position: Year/Month/Day
    let colleaguesDesc = '';
    if (gods.BiGyeop < 10) {
      if (dayBranchTenGod.includes('편관') || dayBranchTenGod.includes('정관')) {
        colleaguesDesc = lang === 'KO'
          ? '사주에 비겁(나의 기운)이 적고 일지(나의 환경)에 관성이 자리 잡고 있어. 이는 주변에 사람은 많으나 나를 엄격하게 대하거나 통제하려는 환경에 놓여 있어, 심리적 고립감을 느끼기 쉬운 구조야. 단순히 도움이 없는 것이 아니라, 스스로를 지켜내야 하는 치열한 환경 속에서 자수성가해야 하는 흐름이야.'
          : 'Low Mirror energy with Power in the Spouse Palace. You are surrounded by people, but in an environment that treats you strictly or tries to control you, leading to psychological isolation. It\'s not just a lack of help, but a "self-made" path where you must protect yourself in a fierce environment.';
      } else {
        colleaguesDesc = lang === 'KO'
          ? '비겁의 기운이 약해 타인의 간섭을 받지 않는 독립적인 길을 선호해. 동료와의 협업보다는 본인만의 독보적인 기술력을 바탕으로 전문성을 인정받는 전략이 유리하며, 스스로를 믿고 나아가는 뚝심이 성공의 열쇠야.'
          : 'Weak Mirror energy leads to preferring an independent path without interference. Rather than collaboration, focus on being recognized for your unique expertise. Trusting yourself is the key to success.';
      }
    } else if (gods.BiGyeop > 30) {
      colleaguesDesc = lang === 'KO'
        ? '주변에 사람이 넘치고 사교적이지만, 이는 곧 치열한 경쟁 환경을 의미하기도 해. 동료는 나를 돕는 존재라기보다 내가 관리하고 책임져야 하거나, 혹은 나의 몫을 나누어야 하는 경쟁자일 수 있어. "군겁쟁재"의 기운이 있으니 동업보다는 주도권을 쥐는 관계가 유리해.'
        : 'Social with many people, but this also means a fierce competitive environment. Colleagues are competitors you must manage or share your portion with, rather than helpers. Since there\'s a hint of "competition for wealth," taking the lead is better than equal partnership.';
    } else {
      colleaguesDesc = lang === 'KO'
        ? '주변인들과 적절한 유대감을 형성하며 협력과 경쟁의 균형을 잘 맞춰. 월지나 일지에 비겁이 있다면 형제나 친구가 나의 든든한 뿌리가 되어주며, 원만한 대인관계가 사회적 성공의 밑거름이 될 거야.'
        : 'Forms appropriate bonds, balancing cooperation and competition. If Mirror energy is in the Month or Day Zhi, siblings or friends serve as your strong roots, and smooth relations become the foundation for success.';
    }

    relationships.colleagues = {
      title: lang === 'KO' ? '동료 및 형제 (비겁)' : 'Colleagues & Siblings (Mirror)',
      ratio: gods.BiGyeop,
      description: colleaguesDesc
    };

    // 2. Parents & Superiors (Sage/Architect) - Position: Month Pillar
    let parentsDesc = '';
    const hasGwanInSangSaeng = gods.GwanSeong > 20 && gods.InSeong > 20;
    const hasJaeGeukIn = gods.JaeSeong > 25 && gods.InSeong > 20;

    const monthStemTenGod = monthPillar?.stemKoreanName || '';
    const isMonthBranchInSeong = monthBranchTenGod.includes('인성');
    const isMonthStemJaeSeong = monthStemTenGod.includes('재성');
    const isMonthStemInSeong = monthStemTenGod.includes('인성');
    
    // Phase 4: Clash with Year/Month, JinSulChukMi in Year
    const yearBranch = yearPillar?.branch || '';
    const dayBranch = dayPillar?.branch || '';
    const hasYearMonthDayClash = [yearPillar, monthPillar].some((p) => p && (
      (dayBranch === '子' && p.branch === '午') || (dayBranch === '午' && p.branch === '子') ||
      (dayBranch === '丑' && p.branch === '未') || (dayBranch === '未' && p.branch === '丑') ||
      (dayBranch === '寅' && p.branch === '申') || (dayBranch === '申' && p.branch === '寅') ||
      (dayBranch === '卯' && p.branch === '酉') || (dayBranch === '酉' && p.branch === '卯') ||
      (dayBranch === '辰' && p.branch === '戌') || (dayBranch === '戌' && p.branch === '辰') ||
      (dayBranch === '巳' && p.branch === '亥') || (dayBranch === '亥' && p.branch === '巳')
    ));
    const isYearJinSulChukMi = ['辰', '戌', '丑', '未'].includes(yearBranch);
    const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
    const isMaeGeum = dmElement === 'Metal' && gods.InSeong > 40; // MaeGeum structure
    const isInSeongOverwhelming = gods.InSeong > 40 && gods.JaeSeong < 15;
    const isJaeSeongOverwhelming = gods.JaeSeong > 40 && gods.InSeong < 15;
    const isNoInSeongNoJaeSeong = gods.InSeong === 0 && gods.JaeSeong === 0;

    if (isMaeGeum) {
      parentsDesc = lang === 'KO'
        ? '[경고] 열매(자식)가 나뭇가지(부모)에 매달려 떨어지지 못하는 최악의 얽힘(매금) 상태야. 부모는 헌신한다고 착각하지만 사실상 너를 무능력하게 만들 수 있고, 너 역시 부모를 끊어내지 못해 끌려다닐 수 있어. 물리적인 거리두기(독립)가 최고의 개운법이야.'
        : '[Warning] A severe entanglement where the fruit (child) cannot detach from the branch (parent). Parents may think they are devoted, but they might be making you incompetent, and you might be dragged along unable to cut ties. Physical distance (independence) is the best remedy.';
    } else if (hasYearMonthDayClash || isYearJinSulChukMi) {
      parentsDesc = lang === 'KO'
        ? '부모와 가풍의 뜻을 따르지 않고, 부모의 업적을 묻어둔 채 고향을 떠나(외국 등) 전혀 다른 삶을 개척하려는 자수성가형 독립 운명이야.'
        : 'You have a self-made, independent destiny, likely to leave your hometown (or go abroad) to pioneer a completely different life, disregarding family traditions and parental achievements.';
    } else if (isInSeongOverwhelming) {
      parentsDesc = lang === 'KO'
        ? '어머니의 치마폭에 싸여 과잉보호를 받는 온실 속 화초 환경일 수 있어. 애정은 넘치나 독립심과 경제/사회성(재성) 발달이 지연될 수 있으니 스스로 자립하려는 의지가 매우 중요해.'
        : 'You might be in an overprotective greenhouse environment wrapped in your mother\'s apron strings. Affection overflows, but independence and economic/social development may be delayed, so the will to stand on your own is crucial.';
    } else if (isJaeSeongOverwhelming || hasJaeGeukIn) {
      parentsDesc = lang === 'KO'
        ? '아버지(가장)의 경제적/권위적 영향력이 너무 강해 정서적 따뜻함과 애정(어머니)이 억눌린 환경이야(재극인). 물질적 지원은 있으나 애정 결핍이나 정서적 삭막함이 우려되니 내면의 상처를 스스로 돌봐야 해.'
        : 'The economic/authoritative influence of the father is so strong that emotional warmth and affection (mother) are suppressed. Material support exists, but emotional barrenness is a concern, so you must take care of your inner wounds.';
    } else if (isNoInSeongNoJaeSeong) {
      parentsDesc = lang === 'KO'
        ? '애정이나 스킨십에 크게 집착하지 않으며, 부모에게 얽매이지 않고 일찍부터 자립하려는 독립적 성향이 강해. 부모의 혜택이 없어서가 아니라 스스로 개척하는 힘이 뛰어난 거야.'
        : 'You don\'t obsess over affection and have a strong independent tendency to stand on your own early without being tied to parents. It\'s not a lack of parental benefits, but your outstanding ability to pioneer yourself.';
    } else if (isMonthBranchInSeong && isMonthStemJaeSeong) {
      parentsDesc = lang === 'KO'
        ? '부모가 각자 가정적, 사회적 본분을 매우 충실하게 이행하는 안정적인 환경이야. 월간(아버지)과 월지(어머니)가 정위치에 있어 든든한 울타리가 되어줘.'
        : 'A stable environment where parents faithfully fulfill their domestic and social duties. The Month Stem (Father) and Month Branch (Mother) are in their proper places, providing a solid fence.';
    } else if (isMonthStemInSeong) {
      parentsDesc = lang === 'KO'
        ? '어머니(인성)가 아버지의 자리(월간)까지 올라가 영향력을 행사하므로, 어머니가 가장의 역할까지 대신하거나 가정을 주도하는 환경에서 자랐을 가능성이 높아.'
        : 'Since the mother (Wisdom) has risen to the father\'s position (Month Stem), you likely grew up in an environment where the mother took on the role of the head of the household or led the family.';
    } else {
      parentsDesc = lang === 'KO'
        ? '부모 및 윗사람과의 관계에서 일방적인 종속보다는 각자의 다름을 인정하는 객관적 거리가 필요해. 나이가 들수록 인성(부모)은 나를 돕는 인맥과 처세술로, 노년에는 나의 권리로 치환되니 유연하게 관계를 맺어봐.'
        : 'In relations with parents and superiors, an objective distance acknowledging differences is needed rather than one-sided subordination. As you age, this energy transforms into helpful networks and your own rights, so build relationships flexibly.';
    }

    relationships.parents = {
      title: lang === 'KO' ? '부모 및 윗사람 (인성/재성)' : 'Parents & Superiors (Sage/Architect)',
      ratio: gods.InSeong,
      description: parentsDesc
    };

    // 3. Spouse & Partner (Day Zhi) - Position: Day Zhi
    const spouseGodRatio = gender === 'male' ? gods.JaeSeong : gods.GwanSeong;
    let spouseDesc = '';
    
    // Advanced Spouse Separation Indicators
    const stemEl = BAZI_MAPPING.stems[dayPillar?.stem as keyof typeof BAZI_MAPPING.stems]?.element;
    const branchEl = BAZI_MAPPING.branches[dayPillar?.branch as keyof typeof BAZI_MAPPING.branches]?.element;
    const isGanYeoJiDong = stemEl === branchEl;

    const isJinSulChukMi = ['辰', '戌', '丑', '未'].includes(dayBranch);
    const isHurtingOfficerDay = gender === 'female' && dayBranchTenGod.includes('상관');
    
    const dayPillarKey = `${dayPillar?.stem}${dayPillar?.branch}`;
    const isBaekho = ['甲辰', '乙未', '丙戌', '丁丑', '戊辰', '壬戌', '癸丑'].includes(dayPillarKey);
    const isGoegang = ['戊戌', '戊辰', '庚戌', '庚辰', '壬戌', '壬辰'].includes(dayPillarKey);

    // Check for Clash/Punishment on Day Branch
    const hasDayClash = pillars.some((p, i) => i !== 1 && (
      (dayBranch === '子' && p.branch === '午') || (dayBranch === '午' && p.branch === '子') ||
      (dayBranch === '丑' && p.branch === '未') || (dayBranch === '未' && p.branch === '丑') ||
      (dayBranch === '寅' && p.branch === '申') || (dayBranch === '申' && p.branch === '寅') ||
      (dayBranch === '卯' && p.branch === '酉') || (dayBranch === '酉' && p.branch === '卯') ||
      (dayBranch === '辰' && p.branch === '戌') || (dayBranch === '戌' && p.branch === '辰') ||
      (dayBranch === '巳' && p.branch === '亥') || (dayBranch === '亥' && p.branch === '巳')
    ));
    const hasDayPunishment = pillars.some((p, i) => i !== 1 && (
      (dayBranch === '寅' && p.branch === '巳') || (dayBranch === '巳' && p.branch === '申') || (dayBranch === '申' && p.branch === '寅') ||
      (dayBranch === '丑' && p.branch === '戌') || (dayBranch === '戌' && p.branch === '未') || (dayBranch === '未' && p.branch === '丑') ||
      (dayBranch === '子' && p.branch === '卯') || (dayBranch === '卯' && p.branch === '子')
    ));

    // Tomb/Storage check (Im-myo)
    const getSpouseTombInfo = (dm: string, gen: string) => {
      const dmEl = BAZI_MAPPING.stems[dm as keyof typeof BAZI_MAPPING.stems]?.element;
      let spouseEl = '';
      let tombBr = '';
      if (dmEl === 'Wood') { spouseEl = gen === 'male' ? 'Earth' : 'Metal'; tombBr = gen === 'male' ? '辰' : '丑'; }
      else if (dmEl === 'Fire') { spouseEl = gen === 'male' ? 'Metal' : 'Water'; tombBr = gen === 'male' ? '丑' : '辰'; }
      else if (dmEl === 'Earth') { spouseEl = gen === 'male' ? 'Water' : 'Wood'; tombBr = gen === 'male' ? '辰' : '未'; }
      else if (dmEl === 'Metal') { spouseEl = gen === 'male' ? 'Wood' : 'Fire'; tombBr = gen === 'male' ? '未' : '戌'; }
      else if (dmEl === 'Water') { spouseEl = gen === 'male' ? 'Fire' : 'Earth'; tombBr = gen === 'male' ? '戌' : '辰'; }
      return { spouseEl, tombBr };
    };
    const { spouseEl, tombBr } = getSpouseTombInfo(dayMaster, gender);
    const hasSpouseStar = pillars.some(p => 
      BAZI_MAPPING.stems[p.stem as keyof typeof BAZI_MAPPING.stems]?.element === spouseEl ||
      BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches]?.element === spouseEl
    );
    const hasTombBranch = pillars.some(p => p.branch === tombBr);
    const isSpouseInTomb = hasSpouseStar && hasTombBranch;
    const isBiGyeopDaJa = gods.BiGyeop > 30;

    const riskFactors = [];
    if (isGanYeoJiDong) riskFactors.push(lang === 'KO' ? '간여지동' : 'Gan-yeo-ji-dong');
    if (hasDayClash || hasDayPunishment) riskFactors.push(lang === 'KO' ? '일지 형충' : 'Day Branch Clash/Punishment');
    if (isSpouseInTomb) riskFactors.push(lang === 'KO' ? '부성/처성임묘' : 'Spouse Star in Tomb');
    if (isHurtingOfficerDay) riskFactors.push(lang === 'KO' ? '일지 상관' : 'Hurting Officer on Day Branch');
    if (isJinSulChukMi) riskFactors.push(lang === 'KO' ? '일지 진술축미' : 'Earth Branch on Day');
    if (isBaekho || isGoegang) riskFactors.push(lang === 'KO' ? '백호/괴강살' : 'Baekho/Goegang-sal');
    if (isBiGyeopDaJa) riskFactors.push(lang === 'KO' ? '비겁다자' : 'Excessive Bi-gyeop');

    if (riskFactors.length >= 2) {
      spouseDesc = lang === 'KO'
        ? `배우자 운에서 주의가 필요한 신호들이 여러 개 관찰돼. 특히 ${riskFactors.join(', ')} 등의 기운이 겹쳐 있어 배우자와의 관계에서 갈등이나 이별의 기운이 강할 수 있어. 이는 배우자 자리가 불안정하거나 본인의 기운이 너무 강해 배우자가 머물기 힘든 환경임을 의미해. 무조건적인 불운으로 받아들이기보다, 서로의 독립성을 존중하고 주말 부부나 각자의 전문 영역을 확실히 갖는 '업상대체'를 통해 에너지를 분산시키는 지혜가 필요해.`
        : `Multiple signs requiring caution are observed in spouse luck. Specifically, the combination of ${riskFactors.join(', ')} suggests potential for conflict or separation. This means the spouse palace is unstable or your own energy is too strong for a partner to settle easily. Rather than viewing it as pure misfortune, you need the wisdom to disperse this energy through "Up-sang-dae-che" (career substitution) or respecting each other's independence.`;
    } else if (riskFactors.length === 1) {
      spouseDesc = lang === 'KO'
        ? `배우자 운에서 ${riskFactors[0]}의 기운이 관찰돼. 배우자 자리에 변화가 잦거나 본인의 주관이 강해 충돌이 생길 수 있는 구조야. 서로의 다름을 인정하고 적절한 거리감을 유지할 때 관계가 더욱 건강해질 수 있어.`
        : `The energy of ${riskFactors[0]} is observed in your spouse luck. This structure suggests frequent changes in the spouse palace or potential for conflict due to your strong subjective views. The relationship can become healthier when you acknowledge each other's differences and maintain appropriate distance.`;
    } else if (dayBranchTenGod.includes('편관')) {
      spouseDesc = lang === 'KO'
        ? '배우자 자리에 나를 통제하려는 강한 힘(편관)이 들어와 있어. 친구 같은 인연보다는 내가 존경할 수 있거나, 혹은 나를 강하게 리드하는 카리스마 있는 사람과 인연이 깊어. 서로의 주관이 뚜렷해 충돌이 잦을 수 있으니 "존중"과 "거리두기"가 관계 유지의 핵심이야.'
        : 'A strong controlling force (Strong Warrior force) is in the Spouse Palace. You are drawn to charismatic partners you can respect or who lead you strongly. Since both have clear views, conflicts may be frequent; "respect" and "personal space" are keys to the relationship.';
    } else if (dayBranchTenGod.includes('비견') || dayBranchTenGod.includes('겁재')) {
      spouseDesc = lang === 'KO'
        ? '배우자 자리에 나와 같은 기운(비겁)이 있어. 친구처럼 편안하고 동등한 관계를 추구하지만, 때로는 서로 양보하지 않는 고집으로 인해 갈등이 생길 수 있어. 배우자가 나의 경쟁자이자 동반자 역할을 동시에 수행하는 구조야.'
        : 'Mirror energy is in the Spouse Palace. You pursue a comfortable, equal relationship like friends, but stubbornness can cause clashes. Your spouse acts as both a competitor and a companion.';
    } else if (dayBranchTenGod.includes('인성')) {
      spouseDesc = lang === 'KO'
        ? '배우자 자리에 나를 돕는 기운(인성)이 있어. 나를 어머니처럼 챙겨주거나 정신적으로 의지가 되는 사람과 인연이 깊어. 배우자의 배려와 수용 덕분에 가정에서 정서적 안정을 찾을 수 있는 복이 있어.'
        : 'Wisdom energy is in the Spouse Palace. You have deep ties with someone who cares for you like a mother or is mentally dependable. You find emotional stability at home thanks to your spouse\'s consideration.';
    } else if (dayBranchTenGod.includes('식상')) {
      spouseDesc = lang === 'KO'
        ? '배우자 자리에 나의 에너지가 빠져나가는 기운(식상)이 있어. 내가 배우자를 자식처럼 챙겨주거나, 배우자가 매우 창의적이고 표현력이 풍부한 사람일 가능성이 높아. 자녀 출산 후 배우자보다 자녀에게 집중하게 되는 경향이 있으니 주의가 필요해.'
        : 'Output energy is in the Spouse Palace. You might care for your spouse like a child, or your spouse is highly creative and expressive. Be careful as you may focus more on children than your spouse after childbirth.';
    } else if (dayBranchTenGod.includes('재성')) {
      spouseDesc = lang === 'KO'
        ? '배우자 자리에 내가 관리하는 기운(재성)이 있어. 현실적이고 경제 관념이 뚜렷한 배우자와 인연이 깊으며, 결혼 후 재산 축적에 배우자의 도움이 커. 남성에게는 현모양처, 여성에게는 살림을 잘 돕는 남편의 형국이야.'
        : 'Maverick/Architect energy is in the Spouse Palace. You have ties with a realistic partner with a strong sense of economy. Your spouse helps greatly in accumulating wealth after marriage. It signifies a supportive and practical partner.';
    } else {
      spouseDesc = lang === 'KO'
        ? '배우자 운이 안정적이며 서로의 역할을 충실히 수행해. 사주 전체의 조화에 따라 배우자가 나의 부족한 기운을 채워주는 든든한 조력자가 돼.'
        : 'Spouse luck is stable, and both fulfill their roles faithfully. Depending on the chart\'s harmony, your spouse becomes a strong helper filling your missing energies.';
    }

    relationships.spouse = {
      title: lang === 'KO' ? '배우자 및 연인' : 'Spouse & Partner',
      godName: gender === 'male' ? (lang === 'KO' ? '재성' : 'Architect') : (lang === 'KO' ? '관성' : 'Warrior'),
      ratio: spouseGodRatio,
      description: spouseDesc
    };

    // 4. Children & Outcomes (Hour Pillar) - Position: Hour Pillar
    const targetChildGod = gender === 'female' ? gods.SikSang : gods.GwanSeong;
    let childrenDesc = '';
    
    const hourStemTenGod = hourPillar?.stemKoreanName || '';
    const hourBranch = hourPillar?.branch || '';
    
    // Check for Clash/Punishment on Hour Branch (Si-ju)
    const hasHourClash = pillars.some((p, i) => i !== 3 && (
      (hourBranch === '子' && p.branch === '午') || (hourBranch === '午' && p.branch === '子') ||
      (hourBranch === '丑' && p.branch === '未') || (hourBranch === '未' && p.branch === '丑') ||
      (hourBranch === '寅' && p.branch === '申') || (hourBranch === '申' && p.branch === '寅') ||
      (hourBranch === '卯' && p.branch === '酉') || (hourBranch === '酉' && p.branch === '卯') ||
      (hourBranch === '辰' && p.branch === '戌') || (hourBranch === '戌' && p.branch === '辰') ||
      (hourBranch === '巳' && p.branch === '亥') || (hourBranch === '亥' && p.branch === '巳')
    ));

    const isChildStarInHour = (gender === 'female' && (hourBranchTenGod.includes('식신') || hourBranchTenGod.includes('상관') || hourStemTenGod.includes('식신') || hourStemTenGod.includes('상관'))) ||
                              (gender === 'male' && (hourBranchTenGod.includes('정관') || hourBranchTenGod.includes('편관') || hourStemTenGod.includes('정관') || hourStemTenGod.includes('편관')));
    const isInSeongInHour = hourBranchTenGod.includes('인성') || hourStemTenGod.includes('인성');
    
    const isChildStarInMonth = (gender === 'female' && (monthBranchTenGod.includes('식신') || monthBranchTenGod.includes('상관') || monthStemTenGod.includes('식신') || monthStemTenGod.includes('상관'))) ||
                               (gender === 'male' && (monthBranchTenGod.includes('정관') || monthBranchTenGod.includes('편관') || monthStemTenGod.includes('정관') || monthStemTenGod.includes('편관')));

    const hasInGeukSik = gender === 'female' && gods.InSeong > 30 && gods.SikSang > 0;

    let baseChildDesc = '';
    
    if (targetChildGod === 0) {
      baseChildDesc = lang === 'KO'
        ? '원국에 자식 별이 뚜렷하게 드러나지 않았어. 이는 자식이 없다는 뜻이 아니라, 부모와 자식이 서로에게 얽매이지 않고 각자 독립적이고 자립적인 운명을 살아간다는 긍정적인 의미야.'
        : 'The child star is not clearly revealed in your chart. This doesn\'t mean no children, but rather a positive sign that parent and child will live independent, self-reliant destinies without being tied down to each other.';
    } else if (isChildStarInHour) {
      baseChildDesc = lang === 'KO'
        ? '자식 별이 온전하게 시주(말년/자식 자리)에 자리 잡고 있어. 자녀와 위계질서가 명확하며, 노년에도 든든한 관계를 맺거나 한 지붕 아래 살 가능성이 높은 최고점의 자식운이야.'
        : 'The child star is perfectly placed in the Hour Pillar (Late Life/Child Palace). You have clear boundaries with your children and a high chance of maintaining a strong relationship or living together in your old age.';
    } else if (isInSeongInHour) {
      baseChildDesc = lang === 'KO'
        ? '자식 자리에 나를 돕는 인성이 있으므로, 말년에 자녀로부터 부양과 혜택(효도)을 받을 확률이 매우 높아.'
        : 'With Wisdom (supportive energy) in the Child Palace, there is a very high probability of receiving care and benefits (filial piety) from your children in your later years.';
    } else if (isChildStarInMonth) {
      baseChildDesc = lang === 'KO'
        ? '자식 별이 청년기를 뜻하는 월주에 있어. 20~30대의 사회활동 시기에 안정적으로 자녀를 얻고 양육할 기반이 튼튼한 구조야.'
        : 'The child star is in the Month Pillar representing youth. You have a solid foundation to stably have and raise children during your active 20s-30s.';
    } else {
      baseChildDesc = lang === 'KO'
        ? '자식 별이 사주에 존재하여 자녀와의 인연이 이어지는 흐름이야. 자녀가 본인의 삶에 긍정적인 활력을 불어넣어 줄 거야.'
        : 'The child star is present in your chart, indicating a connection with children. They will bring positive vitality to your life.';
    }

    let detailChildDesc = '';
    if (targetChildGod > 0) {
      if (gods.SikSang > 20) {
        detailChildDesc += lang === 'KO' 
          ? ' 식상(친밀도)이 발달해 자녀가 나이를 먹어서도 스스럼없이 스킨십을 나눌 정도로 정서적, 물리적 친밀도가 매우 높아.' 
          : ' With developed Output (intimacy), you share a very high emotional and physical closeness with your children, even as they grow older.';
      }
      if (gods.GwanSeong > 20) {
        detailChildDesc += lang === 'KO'
          ? ' 관성(사회적 능력)이 뚜렷해 남들에게 자랑할 만한 훌륭한 타이틀과 능력을 갖춘 자식을 둘 확률이 커.'
          : ' With clear Power (social ability), you are highly likely to have children with excellent titles and abilities you can be proud of.';
      }
      if (hasHourClash || hasInGeukSik) {
        detailChildDesc += lang === 'KO'
          ? ' 다만 자식 별이나 자리에 충돌(훼손)이 감지되니, 양육 과정에서 정서적 갈등이나 예상치 못한 장애 요소가 있을 수 있어 세심한 주의가 필요해.'
          : ' However, a clash (damage) is detected in the child star or palace, so careful attention is needed as there may be emotional conflicts or unexpected obstacles during parenting.';
      }
      if (gender === 'female' && gods.SikSang > 20) {
        detailChildDesc += lang === 'KO'
          ? ' 여성의 경우 자녀 출산을 기점으로 에너지가 자식에게 쏠리며 남편(관성)과 심리적으로 멀어지거나, 자녀를 매개로 주도권을 쥐게 되는 부부 역학의 변화가 생길 수 있어.'
          : ' For women, after childbirth, energy shifts towards the child, which may create psychological distance from the husband (Power) or shift the relationship dynamic to taking the lead through the child.';
      }
    }

    const finalOverride = lang === 'KO'
      ? '\n\n[#f97316:[주의] 부모의 사주만으로 자식을 100% 재단하는 것은 한계가 있어. 가장 완벽한 자식운 판별을 위해서는 훗날 자식과의 1:1 궁합을 통해 서로의 상호 보완성을 확인하는 것이 궁극적인 결론이야.]'
      : '\n\n[#f97316:[Note] Judging a child 100% based only on the parent\'s chart has limits. For the most perfect analysis, checking the mutual complementarity through a 1:1 compatibility reading with your child later is the ultimate conclusion.]';

    childrenDesc = `${baseChildDesc}${detailChildDesc}${finalOverride}`;

    relationships.children = {
      title: lang === 'KO' ? '자식 및 결과물' : 'Children & Outcomes',
      godName: gender === 'male' ? (lang === 'KO' ? '관성' : 'Warrior') : (lang === 'KO' ? '식상' : 'Artist'),
      ratio: targetChildGod,
      description: childrenDesc
    };

    return relationships;
  };

  const relationshipAnalysis = getRelationshipAnalysis();
  
  // 3.6 Advanced Edge Case Analysis (Wang-shin-chung-bal, Heo-bu, Jaeng-hap, Im-myo)
  const getAdvancedEdgeCases = () => {
    const cases: any[] = [];
    const elementScores: Record<string, number> = strength.elementScores || {};
    const totalScore = Object.values(elementScores).reduce((a: number, b: number) => a + Math.max(0, b), 0) || 1;
    
    // 1. Wang-shin-chung-bal (Explosive Clash)
    const clashes = [
      ['子', '午'], ['丑', '未'], ['寅', '申'], ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
    ];
    const presentBranches = pillars.map(p => p.branch);
    
    Object.entries(elementScores).forEach(([el, score]) => {
      const ratio = (score / totalScore) * 100;
      if (ratio > 70) {
        // Check if this strong element is being clashed
        const elBranches: Record<string, string[]> = {
          Wood: ['寅', '卯'], Fire: ['巳', '午'], Earth: ['辰', '戌', '丑', '未'],
          Metal: ['申', '酉'], Water: ['亥', '子']
        };
        
        const isClashed = clashes.some(([b1, b2]) => {
          const hasB1 = presentBranches.includes(b1);
          const hasB2 = presentBranches.includes(b2);
          if (hasB1 && hasB2) {
            return elBranches[el].includes(b1) || elBranches[el].includes(b2);
          }
          return false;
        });

        if (isClashed) {
          cases.push({
            title: lang === 'KO' ? '왕신충발(旺神衝發) 경고' : 'Explosive Clash Warning (Wang-shin-chung-bal)',
            description: lang === 'KO' 
              ? `${getElementKo(el)}의 기운이 극강한 상태에서 충(衝)이 발생했어. 이는 단순히 기운이 꺾이는 것이 아니라, 잠자던 사자를 건드린 격으로 갑작스러운 사고나 건강 악화, 혹은 감당하기 힘든 급격한 변화를 암시해. 극도로 신중한 처신이 필요해.`
              : `A clash has occurred while the ${el} energy is extremely strong (>70%). This is not a normal clash; it's like "poking a sleeping lion," suggesting sudden accidents, health issues, or overwhelming rapid changes. Extreme caution is required.`,
            type: 'warning'
          });
        }
      }
    });

    // 2. Heo-bu (Floating Stems)
    const floating = strength.floatingStems || [];
    floating.forEach((s: string) => {
      const el = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.element;
      const rel = getRelationship(dmElement, el);
      if (rel === 'Wealth') {
        cases.push({
          title: lang === 'KO' ? '재성허부(財星虛浮) - 뜬구름 재물' : 'Floating Wealth (Heo-bu)',
          description: lang === 'KO'
            ? `천간에 재성(${s})이 떠 있으나 지지에 뿌리가 전혀 없어. 이는 겉으로는 화려해 보이나 실속이 없거나, 큰 돈을 꿈꾸지만 현실적인 기반이 약해 '뜬구름 잡는 돈 걱정'에 머물기 쉬운 형국이야. 실질적인 자산 관리에 집중해야 해.`
            : `Wealth star (${s}) is in the stem but has no roots in the branches. This indicates a "floating wealth" situation where you might dream of big money but lack a realistic foundation, leading to empty financial worries. Focus on practical asset management.`,
          type: 'info'
        });
      } else if (rel === 'Power') {
        cases.push({
          title: lang === 'KO' ? '관성허부(官星虛浮) - 명예의 허상' : 'Floating Power (Heo-bu)',
          description: lang === 'KO'
            ? `천간에 관성(${s})이 있으나 뿌리가 없어. 명예나 직함은 있으나 실질적인 권한이 약하거나, 남의 시선을 지나치게 의식하여 겉치레에 치중할 수 있어. 내실을 다지는 것이 중요해.`
            : `Power star (${s}) is present but rootless. You may have titles or honor but lack real authority, or focus too much on appearances and others' opinions. Strengthening your inner substance is key.`,
          type: 'info'
        });
      }
    });

    // 3. Jaeng-hap (Competition)
    const jaengHap = (strength.activeCombinations || []).filter((c: any) => c.type === 'Jaeng-hap');
    jaengHap.forEach((c: any) => {
      cases.push({
        title: lang === 'KO' ? '쟁합(爭合) - 에너지 분산' : 'Competition (Jaeng-hap)',
        description: lang === 'KO'
          ? `합을 해야 할 글자가 여러 개(${c.stems.join(', ')}) 있어 기운이 분산되고 있어. 이는 목표가 하나로 집중되지 못하거나, 인간관계에서 삼각관계나 경쟁 상황에 자주 놓이게 됨을 의미해. 선택과 집중이 필요해.`
          : `Multiple stems (${c.stems.join(', ')}) are competing for a combination, scattering your energy. This suggests difficulty in focusing on one goal or frequently being placed in competitive/triangular relationships. Selection and focus are required.`,
        type: 'info'
      });
    });

    // 4. Im-myo (Storage/Tomb)
    const tombs: Record<string, string> = { Wood: '未', Fire: '戌', Earth: '辰', Metal: '丑', Water: '辰' };
    Object.entries(elementScores).forEach(([el, score]) => {
      const ratio = (score / totalScore) * 100;
      if (ratio > 30 && presentBranches.includes(tombs[el])) {
        cases.push({
          title: lang === 'KO' ? `${getElementKo(el)} 입묘(入墓)` : `${el} Entering Storage (Im-myo)`,
          description: lang === 'KO'
            ? `강한 ${getElementKo(el)}의 기운이 지지의 묘고(${tombs[el]}) 속으로 빨려 들어가 활동성이 급격히 위축되는 형국이야. 잘 나가던 일이 갑자기 정체되거나, 자신의 능력을 마음껏 펼치지 못하고 갇혀 있는 느낌을 받을 수 있어.`
            : `Strong ${el} energy is being sucked into its storage branch (${tombs[el]}), sharply reducing its activity. You may feel your progress suddenly stalling or your talents being trapped and unable to unfold freely.`,
          type: 'info'
        });
      }
    });

    return cases;
  };

  const advancedEdgeCases = getAdvancedEdgeCases();

  // 4. Shin-Gang/Shin-Yak (Strength Analysis)
  const getShinGangShinYak = () => {
    const level = strength.level;
    const score = strength.score;
    
    let summaryKo = '';
    let summaryEn = '';
    let descKo = '';
    let descEn = '';
    let socialKo = '';
    let socialEn = '';

    if (level === '극신강') {
      summaryKo = '자아의 기운이 폭발적으로 강해, 주변 환경을 압도하는 제왕의 기운이야.';
      summaryEn = 'Explosive self-energy, a monarch-like vibe that overwhelms the surroundings.';
      descKo = '자존심과 고집이 매우 강하며, 남의 밑에 있기 힘든 독립적인 성격이야. 강력한 추진력으로 불가능해 보이는 일도 해내는 힘이 있어.';
      descEn = 'Very strong pride and stubbornness; an independent personality that finds it hard to be under others. Has the power to achieve seemingly impossible tasks with strong drive.';
      socialKo = '전문직, 사업가, 혹은 한 분야의 독보적인 권위자로 성공할 확률이 매우 높아. 다만 독단적인 결정을 주의해야 해.';
      socialEn = 'High probability of success as a professional, entrepreneur, or a unique authority in a field. However, beware of arbitrary decisions.';
    } else if (level === '신강') {
      summaryKo = '자아와 주관이 뚜렷하며, 외부의 압박에 잘 견디는 튼튼한 정신력을 가지고 있어.';
      summaryEn = 'Strong sense of self and subjective views, with a resilient mindset that withstands external pressure.';
      descKo = '자신감이 넘치고 독립심이 강해 스스로의 힘으로 인생을 개척해 나가는 스타일이야. 어려운 상황에서도 쉽게 꺾이지 않는 뚝심이 있어.';
      descEn = 'Confident and independent, a style that pioneers life through one\'s own strength. Has the perseverance to not bend easily even in difficult situations.';
      socialKo = '리더십과 추진력이 뛰어나 조직 내에서 핵심적인 역할을 하거나 자기 사업을 운영하기에 아주 적합해.';
      socialEn = 'Excellent leadership and drive, very suitable for playing a key role within an organization or running your own business.';
    } else if (level === '중화신강') {
      summaryKo = '자아의 힘이 충분하면서도 주변과 조화를 이룰 줄 아는 이상적인 강함이야.';
      summaryEn = 'Ideal strength where the self is sufficient yet knows how to harmonize with the surroundings.';
      descKo = '주관은 뚜렷하지만 타인의 의견을 수용할 줄 아는 유연함을 갖췄어. 에너지가 안정적이라 기복이 적고 꾸준한 성취를 이뤄내.';
      descEn = 'Clear subjective views but flexible enough to accept others\' opinions. Stable energy leads to consistent achievements with few ups and downs.';
      socialKo = '어느 조직에서나 환영받는 리더이자 조율자야. 안정적인 사회생활과 성공을 동시에 거머쥘 수 있는 좋은 구조야.';
      socialEn = 'A leader and mediator welcomed in any organization. A good structure to achieve both stable social life and success.';
    } else if (level === '중화신약') {
      summaryKo = '부드러운 카리스마를 지녔으며, 주변 환경을 자신에게 유리하게 활용할 줄 아는 지혜가 있어.';
      summaryEn = 'Possesses soft charisma and the wisdom to utilize the surroundings to your advantage.';
      descKo = '겉으로는 유연해 보이지만 내면에는 자신만의 기준이 확실해. 타인과 협력하여 더 큰 성과를 내는 데 탁월한 재능이 있어.';
      descEn = 'Appears flexible on the outside but has clear internal standards. Outstanding talent for achieving greater results through cooperation.';
      socialKo = '협상가나 전략가로서 빛을 발해. 사람 사이의 관계를 조율하며 실속을 차리는 능력이 뛰어나 사회적 성공이 빨라.';
      socialEn = 'Shines as a negotiator or strategist. Excellent ability to coordinate relationships and gain substance, leading to fast social success.';
    } else if (level === '신약') {
      summaryKo = '타인에 대한 배려와 공감 능력이 뛰어나며, 주변 환경에 유연하게 적응하는 태도를 보여.';
      summaryEn = 'Excellent empathy and consideration for others, showing an attitude of flexible adaptation to the surroundings.';
      descKo = '겸손하고 협조적이며, 타인의 감정을 잘 읽어 대인관계가 원만해. 강하게 밀어붙이기보다 주변의 도움을 이끌어내어 목표를 달성해.';
      descEn = 'Humble and cooperative, with smooth interpersonal relations by reading others\' emotions well. Achieves goals by drawing help rather than pushing forcefully.';
      socialKo = '팀워크가 중시되는 조직이나 서비스, 교육 분야에서 큰 성과를 내. 주변의 신망을 얻어 안정적인 사회 기반을 닦아.';
      socialEn = 'Achieves great results in team-oriented organizations, services, or education. Builds a stable social foundation by gaining trust.';
    } else { // 극신약
      summaryKo = '섬세하고 예민한 감수성을 지녔으며, 주변의 기운을 민감하게 받아들이는 유리잔 같은 사주야.';
      summaryEn = 'Possesses delicate and sensitive sensibilities, a glass-like chart that sensitively absorbs surrounding energies.';
      descKo = '타인의 시선을 많이 의식하고 거절을 어려워할 수 있어. 하지만 이는 곧 타인의 니즈를 완벽히 파악하는 능력이기도 해. 자신만의 보호막이 필요해.';
      descEn = 'May be very conscious of others\' views and find it hard to say no. However, this is also the ability to perfectly grasp others\' needs. Needs a personal shield.';
      socialKo = '참모, 비서, 혹은 고도의 집중력이 필요한 전문직에서 빛을 발해. 강한 사람이나 시스템에 의지할 때 오히려 더 큰 안전과 성공을 보장받아.';
      socialEn = 'Shines as an advisor, secretary, or in professional roles requiring high focus. Guaranteed greater safety and success when relying on strong people or systems.';
    }

    return {
      isStrong,
      score,
      level,
      title: level,
      summary: lang === 'KO' ? summaryKo : summaryEn,
      description: lang === 'KO' ? descKo : descEn,
      socialContext: lang === 'KO' ? socialKo : socialEn
    };
  };

  const shinGangShinYak = getShinGangShinYak();

  const elementSpecificInsights = {
    Wood: {
      Self: { ko: '나의 뿌리와 주관 (비겁 - 목(木))', en: 'My roots and conviction (Mirror/Rival - Wood(木))' },
      Output: { ko: '꽃을 피우는 표현력 (식상 - 화(火))', en: 'Expressive power to bloom (Artist/Rebel - Fire(火))' },
      Wealth: { ko: '부동산 및 현실적 안정감 (재성 - 토(土))', en: 'Real estate and realistic stability (Maverick/Architect - Earth(土))' },
      Power: { ko: '나를 다듬는 절제력 (관성 - 금(金))', en: 'Self-discipline to refine me (Warrior/Judge - Metal(金))' },
      Wisdom: { ko: '나를 키우는 자양분 (인성 - 수(水))', en: 'Nutrients that grow me (Mystic/Sage - Water(수))' }
    },
    Fire: {
      Self: { ko: '나의 열정과 에너지 (비겁 - 화(火))', en: 'My passion and energy (Mirror/Rival - Fire(火))' },
      Output: { ko: '빛을 발하는 전달력 (식상 - 토(土))', en: 'Delivery power that shines (Artist/Rebel - Earth(土))' },
      Wealth: { ko: '사리판단과 분별력 (재성 - 금(金))', en: 'Discernment and judgment (Maverick/Architect - Metal(金))' },
      Power: { ko: '나를 조절하는 통제력 (관성 - 수(水))', en: 'Control power to regulate me (Warrior/Judge - Water(水))' },
      Wisdom: { ko: '나를 밝히는 지혜 (인성 - 목(木))', en: 'Wisdom that illuminates me (Mystic/Sage - Wood(木))' }
    },
    Earth: {
      Self: { ko: '나의 신용과 무게감 (비겁 - 토(土))', en: 'My credit and weight (Mirror/Rival - Earth(土))' },
      Output: { ko: '만물을 키우는 활동력 (식상 - 금(金))', en: 'Vitality to grow all things (Artist/Rebel - Metal(金))' },
      Wealth: { ko: '보이지 않는 현금과 유동성 (재성 - 수(水))', en: 'Hidden cash and liquidity (Maverick/Architect - Water(水))' },
      Power: { ko: '나를 세우는 명예 (관성 - 목(木))', en: 'Honor that builds me (Warrior/Judge - Wood(木))' },
      Wisdom: { ko: '나를 품는 포용력 (인성 - 화(火))', en: 'Tolerance that embraces me (Mystic/Sage - Fire(火))' }
    },
    Metal: {
      Self: { ko: '나의 강단과 결단력 (비겁 - 금(金))', en: 'My determination and resolve (Mirror/Rival - Metal(金))' },
      Output: { ko: '날카로운 분석력 (식상 - 수(水))', en: 'Sharp analytical power (Artist/Rebel - Water(水))' },
      Wealth: { ko: '사람 관리와 가치 판단 (재성 - 목(木))', en: 'People management and value judgment (Maverick/Architect - Wood(木))' },
      Power: { ko: '나를 단련하는 책임감 (관성 - 화(火))', en: 'Responsibility to temper me (Warrior/Judge - Fire(火))' },
      Wisdom: { ko: '나를 채우는 완성도 (인성 - 토(土))', en: 'Completeness that fills me (Mystic/Sage - Earth(土))' }
    },
    Water: {
      Self: { ko: '나의 유연함과 지혜 (비겁 - 수(水))', en: 'My flexibility and wisdom (Mirror/Rival - Water(水))' },
      Output: { ko: '깊이 있는 창의성 (식상 - 목(木))', en: 'Deep creativity (Artist/Rebel - Wood(木))' },
      Wealth: { ko: '직관력과 무형의 자산 (재성 - 화(火))', en: 'Intuition and intangible assets (Maverick/Architect - Fire(火))' },
      Power: { ko: '나를 이끄는 리더십 (관성 - 토(土))', en: 'Leadership that guides me (Warrior/Judge - Earth(土))' },
      Wisdom: { ko: '나를 맑게 하는 통찰력 (인성 - 금(金))', en: 'Insight that clears me (Mystic/Sage - Metal(金))' }
    }
  };

  const personalizedInsights = elementSpecificInsights[dmElement as keyof typeof elementSpecificInsights];

  const isGeonRok = (monthZhi === '寅' && dayMaster === '甲') || (monthZhi === '卯' && dayMaster === '乙'); // Example
  const isYangIn = (monthZhi === '午' && dayMaster === '丙') || (monthZhi === '子' && dayMaster === '壬'); // Example

  return {
    muJaRon,
    daJaRon,
    advancedEdgeCases,
    relationshipAnalysis,
    shinGangShinYak,
    personalizedInsights,
    dayMasterElement: dmElement,
    geokGukDetail: {
      geonRok: isGeonRok,
      yangIn: isYangIn,
      description: isGeonRok ? '건록격이야.' : isYangIn ? '양인격이야.' : '일반격이야.'
    }
  };
};
