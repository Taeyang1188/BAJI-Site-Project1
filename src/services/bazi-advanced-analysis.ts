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
        descKo = '사주에 비겁(나의 기운)이 보이지 않습니다. 이는 타인의 간섭을 싫어하고 독자적인 길을 개척하는 힘이 강함을 의미합니다. 스스로를 믿고 나아가는 뚝심이 필요합니다.';
        descEn = 'The Mirror/Rival energy is absent. This indicates a strong dislike for interference and a powerful drive to pioneer your own independent path. You need the perseverance to trust yourself and move forward.';
      } else if (isSikSang) {
        if (inSeongRatio > 30) {
          descKo = '식상(표현)이 없고 인성(생각)이 과다합니다. 머릿속의 구상은 화려하나 실행력이 마비될 수 있는 "도식(倒食)"의 위험이 있습니다. 생각을 줄이고 즉각 행동에 옮기는 연습이 필수적입니다.';
          descEn = 'Missing Artist/Rebel but excessive Mystic/Sage. There is a risk of "Do-Sik" (paralysis by analysis) where your ideas are brilliant but execution is paralyzed. It is essential to practice reducing overthinking and taking immediate action.';
        } else {
          descKo = '식상(표현/재능)이 드러나지 않았습니다. 생각이 깊고 신중하지만, 때로는 자신의 능력을 밖으로 표출하고 소통하는 연습이 큰 도움이 될 것입니다.';
          descEn = 'The Artist/Rebel energy is not revealed. You are deep-thinking and cautious, but practicing outward expression and communication of your talents will be highly beneficial.';
        }
      } else if (isJaeSeong) {
        const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
        let elementSpecific = '';
        let elementSpecificEn = '';
        if (dmElement === 'Wood') {
          elementSpecific = '토(土) 재성이 없어 현실적인 안정감이나 부동산 축적에 대한 감각이 다소 늦게 깨어날 수 있습니다.';
          elementSpecificEn = 'Missing Earth Wealth, so your sense of practical stability or real estate accumulation may awaken somewhat late.';
        } else if (dmElement === 'Fire') {
          elementSpecific = '금(金) 재성이 없어 분별력과 사리판단을 통한 결과 도출에 시간이 걸릴 수 있습니다.';
          elementSpecificEn = 'Missing Metal Wealth, so it may take time to derive results through discernment and logical judgment.';
        } else if (dmElement === 'Earth') {
          elementSpecific = '수(水) 재성이 없어 실속 있는 현금 흐름이나 유동 자산을 숨겨서 운용하는 지혜가 필요합니다.';
          elementSpecificEn = 'Missing Water Wealth, so you need the wisdom to secretly manage substantial cash flow or liquid assets.';
        } else if (dmElement === 'Metal') {
          elementSpecific = '목(木) 재성이 없어 사람을 다루거나 객관적인 가치 판단을 내리는 데 어려움을 겪을 수 있습니다.';
          elementSpecificEn = 'Missing Wood Wealth, so you may experience difficulties in managing people or making objective value judgments.';
        } else if (dmElement === 'Water') {
          elementSpecific = '화(火) 재성이 없어 직관적인 타이밍 포착이나 무형의 자산(주식 등) 운용에 서툴 수 있습니다.';
          elementSpecificEn = 'Missing Fire Wealth, so you might be clumsy at catching intuitive timing or managing intangible assets (like stocks).';
        }

        if (inSeongRatio > 30) {
          descKo = `무재(無財)이면서 인성이 강합니다. 직접 몸으로 뛰어 돈을 벌기보다 '자격'이나 '권리'로 먹고사는 형국입니다. ${elementSpecific} 내 손에 당장 현금은 없어도 지적 재산권이나 라이선스를 통한 실속을 차리는 힘이 있습니다.`;
          descEn = `Missing Maverick/Architect but strong Mystic/Sage. You thrive on "qualifications" or "rights" rather than physical labor to earn money. ${elementSpecificEn} Even without cash in hand right now, you have the power to gain substance through intellectual property or licenses.`;
        } else {
          descKo = `재성(결과/재물)이 보이지 않습니다. 결과에 대한 한계를 정해두지 않아 역설적으로 거부가 될 수 있는 잠재력이 있습니다. ${elementSpecific} 목표를 구체화하고 끝까지 마무리하는 끈기가 성공의 열쇠입니다.`;
          descEn = `The Maverick/Architect energy is absent. Because you don't set limits on results, you paradoxically have the potential to become immensely wealthy. ${elementSpecificEn} Materializing your goals and having the persistence to finish them is the key to success.`;
        }
      } else if (isGwanSeong) {
        const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
        let muGwanDesc = '';
        let muGwanDescEn = '';
        if (dmElement === 'Wood') {
          muGwanDesc = '나를 통제하고 규율을 잡아줄 금(金)의 기운이 부족하여, 자유분방함이 지나치면 조직 생활에서 갈등을 겪을 수 있습니다. 스스로 규칙을 세우는 노력이 필요합니다.';
          muGwanDescEn = 'Lacking Metal Power to control and discipline you, excessive free-spiritedness may cause conflicts in organizational life. You need to make an effort to set your own rules.';
        } else if (dmElement === 'Fire') {
          muGwanDesc = '열기를 식혀줄 수(水)의 기운이 없어 감정 조절이나 차분한 마무리가 어려울 수 있습니다. 명상이나 정적인 취미를 통해 내면의 평화를 찾는 것이 좋습니다.';
          muGwanDescEn = 'Lacking Water Power to cool the heat, emotional regulation or calm conclusions may be difficult. Finding inner peace through meditation or quiet hobbies is recommended.';
        } else if (dmElement === 'Earth') {
          muGwanDesc = '토를 단단하게 잡아줄 목(木)의 기운이 없어 삶의 방향성이 흔들리기 쉽습니다. 명확한 목표 설정과 자기 계발을 통해 삶의 기둥을 세워야 합니다.';
          muGwanDescEn = 'Lacking Wood Power to firmly hold the Earth, your life\'s direction can easily waver. You must establish pillars in your life through clear goal setting and self-improvement.';
        } else if (dmElement === 'Metal') {
          muGwanDesc = '금의 용도를 정해줄 화(火)의 기운이 부족하여 자신의 재능이 사회적으로 쓰임새를 찾기까지 시간이 걸릴 수 있습니다. 전문성을 기르는 데 집중하십시오.';
          muGwanDescEn = 'Lacking Fire Power to define the Metal\'s purpose, it may take time for your talents to find their social use. Focus on cultivating expertise.';
        } else if (dmElement === 'Water') {
          muGwanDesc = '물의 흐름을 조절할 토(土)의 기운이 없어 에너지가 분산되기 쉽습니다. 한 우물을 파는 끈기와 소속감을 갖는 노력이 성공의 지름길입니다.';
          muGwanDescEn = 'Lacking Earth Power to control the water\'s flow, your energy is easily scattered. The shortcut to success is the persistence to dig one well and the effort to build a sense of belonging.';
        }

        if (biGyeopRatio > 30) {
          descKo = `관성(통제)이 없고 비겁(자아)이 강합니다. ${muGwanDesc} 틀에 박힌 조직 생활보다는 자유로운 전문직이 어울립니다. 스스로를 통제하는 자제력이 부족하면 에너지가 분산될 수 있으니 주의하십시오.`;
          descEn = `Missing Warrior/Judge but strong Mirror/Rival. ${muGwanDescEn} A free freelance profession suits you better than a rigid organizational life. Be careful, as your energy may dissipate if you lack the self-control to discipline yourself.`;
        } else {
          descKo = `관성(규칙/명예)이 드러나지 않았습니다. ${muGwanDesc} 틀에 박힌 삶보다는 자유로운 영혼을 추구합니다. 스스로 규칙을 세우고 통제하는 자제력을 기른다면 더 큰 성취를 이룰 것입니다.`;
          descEn = `The Warrior/Judge energy is not revealed. ${muGwanDescEn} You pursue a free spirit rather than a conventional life. If you cultivate the self-control to set and manage your own rules, you will achieve greater success.`;
        }
      } else if (isInSeong) {
        descKo = '인성(학문/수용)이 보이지 않습니다. 이론보다는 실천과 경험을 통해 배우는 스타일입니다. 때로는 멈춰 서서 깊이 사색하고 지식을 습득하는 시간이 필요합니다.';
        descEn = 'The Mystic/Sage energy is absent. You have a style of learning through practice and experience rather than theory. Sometimes, you need time to stop, reflect deeply, and acquire knowledge.';
      }

      return {
        title: lang === 'KO' ? `무${godNameKo} 사주` : `Missing ${godNameEn}`,
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
          descKo = '비겁이 과다하고 재성이 없습니다. 이를 "군겁쟁재(群劫爭財)"의 위험이라 하며, 재성 대운이 올 때 큰 돈이 들어오지만 동시에 책임과 지출도 급격히 늘어납니다. 미리 자산을 문서화하거나 권리 형태로 묶어두는 지혜가 필요합니다.';
          descEn = 'Excessive Mirror/Rival and no Maverick/Architect. This is known as the risk of "Gun-Gyeop-Jaeng-Jae" (competition for wealth). When a wealth cycle arrives, big money comes in, but responsibilities and expenses also increase rapidly. You need the wisdom to document your assets or tie them up in the form of rights in advance.';
        } else {
          descKo = '비겁의 기운이 매우 강합니다. 주관이 뚜렷하고 경쟁심이 강해 리더로서의 자질이 충분합니다. 다만, 타인의 의견을 경청하는 포용력을 기른다면 더욱 빛날 것입니다.';
          descEn = 'The Mirror/Rival energy is very strong. You have clear subjective views and a strong competitive spirit, giving you ample qualities as a leader. However, you will shine even more if you cultivate the tolerance to listen to others\' opinions.';
        }
      } else if (isSikSang) {
        descKo = '식상의 기운이 넘칩니다. 창의력과 표현력이 뛰어나 예술이나 소통 분야에서 두각을 나타냅니다. 에너지를 한곳으로 집중하여 실질적인 결실을 맺는 노력이 필요합니다.';
        descEn = 'The Artist/Rebel energy is overflowing. With excellent creativity and expressiveness, you stand out in the fields of art or communication. You need to make an effort to focus your energy in one place to bear practical fruit.';
      } else if (isJaeSeong) {
        descKo = '재성의 기운이 과다합니다. 현실 감각이 뛰어나고 목표 지향적입니다. 지나친 욕심보다는 현재의 안정을 유지하며 차근차근 나아가는 지혜가 필요합니다.';
        descEn = 'The Maverick/Architect energy is excessive. You have an outstanding sense of reality and are goal-oriented. Rather than excessive greed, you need the wisdom to maintain current stability and move forward step by step.';
      } else if (isGwanSeong) {
        const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
        let elementSpecific = '';
        let elementSpecificEn = '';
        if (dmElement === 'Wood') {
          elementSpecific = '자유롭고 호기심 많은 아이와 같은 목의 기운을 금(金) 관살이 억압하여, 어린 시절에 선명하게 각인되는 상처나 깊은 트라우마를 겪기 쉽습니다. 이 상처를 흐리게 지우고 극복하기 위해서는 화(火)의 기운이 반드시 필요하며, 화가 없으면 나이가 들어서도 내면은 상처받은 어린아이 상태에 머물게 됩니다.';
          elementSpecificEn = 'The free and curious child-like Wood energy is suppressed by Metal Power, making you prone to deep traumas or scars vividly imprinted in childhood. To blur and overcome these scars, Fire energy is absolutely necessary; without it, your inner self may remain as a wounded child even in adulthood.';
        } else if (dmElement === 'Fire') {
          elementSpecific = '캄캄한 어둠(수) 속에서 홀로 밝게 빛나는 빛(화)과 같은 형국입니다. 타인의 속마음을 잘 이끌어내어 심리 상담이나 교육업에 탁월한 능력을 발휘하지만, 자신도 힘든 상황에서 끊임없이 위로를 구하는 주변 사람들을 다독여야 하는 숙명을 갖습니다.';
          elementSpecificEn = 'It is like a light (Fire) shining brightly alone in the pitch-dark (Water). You excel at drawing out others\' inner feelings, showing outstanding ability in counseling or education, but you have the fate of having to comfort people around you who constantly seek consolation even when you yourself are struggling.';
        } else if (dmElement === 'Earth') {
          elementSpecific = '만물을 품어야 하는 토(土)가 거센 목(木) 관살의 요구에 시달려 샌드위치처럼 중간에 끼이는 난처한 상황에 자주 처합니다. 타인의 갈등에 휘말려 억울하게 욕을 먹거나 남에게 비굴해지기 쉬운데, 이를 극복하려면 화(火)를 통해 토(土)를 단단하고 두텁게 만들어 사람들을 온전히 감당해 내야 합니다. 목(木)을 강제로 누르려 금(식상)의 기운을 쓰면 도리어 관제구설이나 송사에 휘말릴 수 있어 주의가 필요합니다.';
          elementSpecificEn = 'The Earth, which must embrace all things, is plagued by the demands of fierce Wood Power, often finding itself in an awkward sandwich-like situation. You are prone to getting caught up in others\' conflicts, being unfairly criticized, or becoming subservient. To overcome this, you must use Fire to make the Earth solid and thick so you can fully handle people. If you try to forcefully suppress Wood using Metal (Output) energy, you may instead get entangled in legal disputes or gossip.';
        } else if (dmElement === 'Metal') {
          elementSpecific = '화(火) 관살의 뜨거운 열기에 금이 끊임없이 녹아내리고 용도가 변경되어, 사회생활과 과도한 업무에 심하게 찌들어 살아갑니다. 삶의 피로도가 극심해 자기만의 시간이 없으므로, 열기를 식혀주고 금의 원래 모습을 유지하게 해주는 수(水)의 기운과 제대로 된 긴 휴식이 절대적으로 필요합니다.';
          elementSpecificEn = 'The Metal constantly melts and changes its purpose in the scorching heat of Fire Power, leading to a life heavily exhausted by social life and excessive workload. Life fatigue is extreme, leaving no time for yourself, so Water energy to cool the heat and maintain Metal\'s original form, along with proper long rests, are absolutely necessary.';
        } else if (dmElement === 'Water') {
          elementSpecific = '거대한 토(土)에 갇혀 고인 물이 되어 자유롭게 흐르지 못하므로, 자신의 뜻과 꿈을 세상에 펼치기가 매우 어렵습니다. 주로 남의 눈에 띄지 않는 음지에서 묵묵히 일하는 경우가 많습니다. 이들을 극복하고 흘러가기 위해서는 수문을 열어 물길을 만들어 줄 목(木)이나 물을 위로 증발시켜 줄 화(火)의 기운이 필수적입니다.';
          elementSpecificEn = 'Trapped in massive Earth, you become stagnant water unable to flow freely, making it very difficult to unfold your will and dreams to the world. You often work silently in the shadows, unnoticed by others. To overcome this and flow, Wood energy to open the floodgates and create a waterway, or Fire energy to evaporate the water upwards, is essential.';
        }

        descKo = `관살(관성)의 기운이 매우 강합니다. ${elementSpecific} 짊어져야 할 압박과 눈치 보며 맞춰야 할 타인이 많아 기본적으로 삶이 고달플 수 있지만, 적절한 개운법을 활용하면 관살의 억압을 유연하게 해소하고 삶의 주도권을 되찾을 수 있습니다.`;
        descEn = `The Warrior/Judge energy is extremely strong. ${elementSpecificEn} Because there is a lot of pressure to bear and many people to accommodate, life can fundamentally be exhausting. However, by utilizing appropriate remedies, you can flexibly resolve this suppression and regain control of your life.`;
      } else if (isInSeong) {
        descKo = '인성의 기운이 넘쳐납니다. 지적 호기심이 강하고 수용력이 좋습니다. 생각에만 머물지 말고 배운 것을 실제 행동으로 옮기는 실천력이 개운의 핵심입니다.';
        descEn = 'The Mystic/Sage energy is overflowing. You have strong intellectual curiosity and good receptivity. The key to improving your luck is the drive to put what you have learned into actual practice rather than just staying in your thoughts.';
      }

      return {
        title: lang === 'KO' ? `${godNameKo}다자 사주` : `Dominant ${godNameEn}`,
        description: lang === 'KO' ? descKo : descEn,
        enDescription: descEn
      };
    });

  // 2.5 Gwan-sal Hon-jap Analysis
  if (isGwanSalHonJap) {
    const honJapKo = '사주 내에 안정적인 "정관(正官)"과 모험적인 "편관(偏官)"이 함께 섞여 있는 상태입니다. 이 두 가지 상반된 기운이 혼재되어 있으면 어떤 선택을 내릴 때 극심하게 헷갈리며 결정 장애를 겪게 되는 것이 가장 핵심적인 특징입니다. 정관은 안정을 추구하는 보편적인 환경을, 편관은 리스크와 모험이 따르는 환경을 의미하는데, 이 두 성향이 모두 자신에게 맞는 것처럼 느껴져 어느 하나를 쉽게 포기하지 못하고 내적 갈등에 빠지기 쉽습니다. 주변 환경이나 타인에게 휘둘리지 않도록 명확한 기준을 세우는 것이 중요합니다.';
    const honJapEn = 'Mixed Authority (Gwan-sal Hon-jap) detected. You have both Direct Officer (Jeong-gwan) and Seven Killings (Pyeon-gwan). This often leads to decision paralysis and internal conflict between stability and adventure. You may feel that both paths suit you, making it hard to choose and leading to being swayed by others. Setting clear personal standards is vital.';
    
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

    const dayBranch = pillars[1]?.branch;
    const monthBranch = pillars[2]?.branch;
    const yearBranch = pillars[3]?.branch;

    // Colleagues/Siblings (Mirror)
    let colleaguesDesc = '';
    if (gods.BiGyeop < 15 && !isStrong) {
      colleaguesDesc = lang === 'KO' 
        ? '주변에 사람은 많아 보일 수 있으나 정작 내가 기댈 곳은 적은 \'자수성가형\' 흐름입니다. 동료와의 협업보다는 본인만의 독보적인 기술력을 바탕으로 독립적인 전문가로 인정받는 전략이 유리합니다.'
        : 'You may seem surrounded by people, but you have few to lean on; a "self-made" path. Rather than collaboration, focus on being recognized as an independent expert through your unique skills.';
    } else if (gods.BiGyeop > 30) {
      colleaguesDesc = lang === 'KO'
        ? '주변에 사람이 많고 사교적이지만, 지나친 경쟁심이나 고집으로 갈등이 생길 수 있습니다. 동료는 도움을 주는 존재라기보다 내가 관리하고 책임져야 할 대상에 가깝습니다.'
        : 'Social with many people, but excessive competition or stubbornness may cause conflict. Colleagues are more like people you must manage or take responsibility for rather than helpers.';
    } else {
      colleaguesDesc = lang === 'KO'
        ? '주변인들과 적절한 유대감을 형성하며 협력과 경쟁의 균형을 잘 맞춥니다. 동료들과의 원만한 관계가 사회적 성공의 밑거름이 됩니다.'
        : 'Forms appropriate bonds, balancing cooperation and competition well. Smooth relations with colleagues serve as a foundation for social success.';
    }

    relationships.colleagues = {
      title: lang === 'KO' ? '동료 및 형제 (비겁)' : 'Colleagues & Siblings (Mirror)',
      ratio: gods.BiGyeop,
      description: colleaguesDesc
    };

    // Parents (Sage/Architect)
    let parentsDesc = '';
    const hasJaeGeukIn = gods.JaeSeong > 20 && gods.InSeong > 20;
    const hasGwanInSangSaeng = gods.GwanSeong > 20 && gods.InSeong > 20;

    if (hasGwanInSangSaeng) {
      parentsDesc = lang === 'KO'
        ? '단순한 지원을 넘어, 본인의 명예를 세워주기 위해 헌신하는 윗사람의 덕이 있습니다. 엄격하지만 나를 성장시키는 윗사람의 존재가 뚜렷합니다.'
        : 'Beyond simple support, you have the virtue of superiors who dedicate themselves to building your honor. There is a clear presence of a strict but growth-oriented mentor.';
    } else if (hasJaeGeukIn) {
      parentsDesc = lang === 'KO'
        ? '현실적인 이익(재성)과 본인의 신념(인성)이 충돌할 때 윗사람의 조언이 다소 강압적으로 느껴질 수 있습니다. 물질적 지원과 정신적 가치 사이의 조율이 중요합니다.'
        : 'When realistic interests (Wealth) and your beliefs (Wisdom) clash, advice from superiors may feel coercive. Balancing material support and spiritual values is key.';
    } else if (gods.InSeong === 0) {
      parentsDesc = lang === 'KO'
        ? '부모님의 후원이나 윗사람의 도움이 다소 부족할 수 있으나, 그만큼 독립심이 강합니다. 스스로 자격을 갖추고 권리를 확보하는 노력이 필요합니다.'
        : 'Support from superiors may be lacking, but this fosters strong independence. Effort to gain qualifications and secure rights through documentation is needed.';
    } else {
      parentsDesc = lang === 'KO'
        ? '윗사람의 도움을 잘 활용하며 안정적인 지원 속에서 성장합니다. 학문이나 자격증을 통해 사회적 지위를 공고히 하는 힘이 있습니다.'
        : 'Utilizes help from superiors well and grows under stable support. Has the strength to solidify social status through study or certification.';
    }

    relationships.parents = {
      title: lang === 'KO' ? '부모 및 윗사람 (인성/재성)' : 'Parents & Superiors (Sage/Architect)',
      ratio: gods.InSeong,
      description: parentsDesc
    };

    // Spouse (Male: Architect, Female: Warrior)
    const spouseGod = gender === 'male' ? gods.JaeSeong : gods.GwanSeong;
    let spouseDesc = '';
    
    // Check if Warrior is in Spouse Palace (Day Zhi)
    const isWarriorInSpousePalace = dayBranch === '寅' || dayBranch === '申' || dayBranch === '巳' || dayBranch === '亥'; // Simplified check for Warrior/Power energy
    
    if (isWarriorInSpousePalace && !isStrong) {
      spouseDesc = lang === 'KO'
        ? '나를 편안하게 해주는 친구 같은 인연보다는, 나를 긴장시키고 단련시키는 \'카리스마 있는 배우자\'와 인연이 깊습니다. 서로의 독립적인 영역을 존중할 때 관계가 안정됩니다.'
        : 'Rather than a friend-like partner who makes you comfortable, you have deep ties with a "charismatic spouse" who keeps you tense and disciplines you. Stability is found in respecting independence.';
    } else if (spouseGod === 0) {
      spouseDesc = lang === 'KO'
        ? '사주에 배우자 기운이 드러나지 않아 인연이 늦게 닿거나 평범하지 않은 만남이 예상됩니다. 상대방의 조건보다는 내면의 가치를 중시하는 것이 좋습니다.'
        : 'Karmic ties may arrive late or involve unusual encounters. Focus on inner values rather than external conditions.';
    } else {
      spouseDesc = lang === 'KO'
        ? '안정적인 배우자 운을 가지고 있으며 서로를 보완하는 관계를 형성합니다. 가정의 평화가 사회적 성공의 든든한 버팀목이 됩니다.'
        : 'Possesses stable spouse luck and forms a mutually complementary relationship. Domestic peace serves as a strong support for social success.';
    }

    relationships.spouse = {
      title: lang === 'KO' ? '배우자 및 연인' : 'Spouse & Partner',
      godName: gender === 'male' ? (lang === 'KO' ? '재성' : 'Architect') : (lang === 'KO' ? '관성' : 'Warrior'),
      ratio: spouseGod,
      description: spouseDesc
    };

    // Children (Male: Warrior, Female: Artist)
    const childrenGod = gender === 'male' ? gods.GwanSeong : gods.SikSang;
    let childrenDesc = '';
    
    // Check for Wonjin/Gwimun (In-Yu, Myo-Shin, etc.) between Output and Power
    const hasWonjin = (dayBranch === '寅' && yearBranch === '酉') || (dayBranch === '酉' && yearBranch === '寅') ||
                      (monthBranch === '寅' && yearBranch === '酉') || (monthBranch === '酉' && yearBranch === '寅');

    if (hasWonjin) {
      childrenDesc = lang === 'KO'
        ? '결과물을 만들어내는 과정에서 스스로를 강하게 몰아붙이는 완벽주의적 기질이 강합니다. 결과물에 대한 집착과 그로 인한 스트레스 관리가 성공의 핵심입니다.'
        : 'You have a strong perfectionist streak, pushing yourself hard in the process of creating results. Managing obsession with outcomes and resulting stress is key to success.';
    } else if (childrenGod === 0) {
      childrenDesc = lang === 'KO'
        ? '자녀와의 인연이 다소 늦거나, 결과물을 얻기까지 인내심이 필요합니다. 서두르지 않고 내실을 기한다면 때가 되었을 때 큰 결실을 맺을 수 있습니다.'
        : 'Karmic ties with children may be late, or patience is needed for outcomes. If you focus on inner substance without rushing, you will reap great rewards.';
    } else {
      childrenDesc = lang === 'KO'
        ? '자녀와 원만한 관계를 유지하며 노력한 만큼의 결실을 맺는 구조입니다. 자녀의 성장이 본인에게도 큰 기쁨과 보람이 됩니다.'
        : 'Maintains smooth relations with children and reaps fruits proportional to effort. Children\'s growth brings great joy and fulfillment.';
    }

    relationships.children = {
      title: lang === 'KO' ? '자식 및 결과물' : 'Children & Outcomes',
      godName: gender === 'male' ? (lang === 'KO' ? '관성' : 'Warrior') : (lang === 'KO' ? '식상' : 'Artist'),
      ratio: childrenGod,
      description: childrenDesc
    };

    return relationships;
  };

  const relationshipAnalysis = getRelationshipAnalysis();

  // 4. Shin-Gang/Shin-Yak (Strength Analysis)
  const getShinGangShinYak = () => {
    return {
      isStrong,
      title: isStrong ? (lang === 'KO' ? '신강(身强) 사주' : 'Strong Day Master (Shin-Gang)') : (lang === 'KO' ? '신약(身弱) 사주' : 'Weak Day Master (Shin-Yak)'),
      summary: lang === 'KO' 
        ? '사주의 주체인 일간(나)의 기운이 주변 환경에 비해 얼마나 강한지를 나타내는 지표입니다.'
        : 'An indicator of how strong the Day Master (Self) is compared to the surrounding environment.',
      description: isStrong 
        ? (lang === 'KO' ? '자아와 주관이 뚜렷하며, 외부의 압박에 잘 견디는 강한 정신력을 가지고 있습니다.' : 'You have a strong sense of self and subjective views, with a resilient mindset that withstands external pressure.')
        : (lang === 'KO' ? '타인에 대한 배려와 공감 능력이 뛰어나며, 유연하고 협조적인 태도를 보입니다.' : 'You possess excellent empathy and consideration for others, showing a flexible and cooperative attitude.'),
      socialContext: isStrong
        ? (lang === 'KO' ? '현대 사회에서는 리더십과 추진력으로 발현되어 전문직이나 사업가로 성공할 가능성이 높습니다.' : 'In modern society, this manifests as leadership and drive, leading to success in professional or entrepreneurial roles.')
        : (lang === 'KO' ? '현대 사회에서는 뛰어난 소통 능력과 조직 적응력으로 팀워크가 중시되는 분야에서 빛을 발합니다.' : 'In modern society, your superior communication and organizational adaptability make you shine in team-oriented fields.')
    };
  };

  const shinGangShinYak = getShinGangShinYak();

  const elementSpecificInsights = {
    Wood: {
      Self: { ko: '나의 뿌리와 주관 (비겁 - 목(木))', en: 'My roots and conviction (Mirror/Rival - Wood(木))' },
      Output: { ko: '꽃을 피우는 표현력 (식상 - 화(火))', en: 'Expressive power to bloom (Artist/Rebel - Fire(火))' },
      Wealth: { ko: '부동산 및 현실적 안정감 (재성 - 토(土))', en: 'Real estate and realistic stability (Maverick/Architect - Earth(土))' },
      Power: { ko: '나를 다듬는 절제력 (관성 - 금(金))', en: 'Self-discipline to refine me (Warrior/Judge - Metal(金))' },
      Wisdom: { ko: '나를 키우는 자양분 (인성 - 수(水))', en: 'Nutrients that grow me (Mystic/Sage - Water(水))' }
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
    relationshipAnalysis,
    shinGangShinYak,
    personalizedInsights,
    dayMasterElement: dmElement,
    geokGukDetail: {
      geonRok: isGeonRok,
      yangIn: isYangIn,
      description: isGeonRok ? '건록격입니다.' : isYangIn ? '양인격입니다.' : '일반격입니다.'
    }
  };
};
