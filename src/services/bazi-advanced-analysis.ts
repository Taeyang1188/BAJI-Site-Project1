import { BaZiCard, UserInput, Language } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';

export const calculateAdvancedAnalysis = (
  pillars: BaZiCard[],
  tenGodsRatio: Record<string, number>,
  userInput: UserInput,
  dayMaster: string,
  monthZhi: string,
  lang: Language,
  strength: any,
  yongshinDetail: any,
  interactions: any[] = []
) => {
  const gender = userInput.gender || 'male';
  const isStrong = Number(strength.score) > 50;
  const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element || 'Wood';
  const ELEMENT_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

  const getColor = (el: string) => {
    const colors: Record<string, string> = {
      'Wood': '#22c55e',
      'Fire': '#ef4444',
      'Earth': '#eab308',
      'Metal': '#94a3b8',
      'Water': '#3b82f6'
    };
    return colors[el] || '#ffffff';
  };

  const woodCol = getColor('Wood');
  const fireCol = getColor('Fire');
  const earthCol = getColor('Earth');
  const metalCol = getColor('Metal');
  const waterCol = getColor('Water');

  const dmIdx = ELEMENT_CYCLE.indexOf(dmElement);
  // Sik-sang (Output) color
  const artistCol = getColor(ELEMENT_CYCLE[(dmIdx + 1) % 5]);
  // Jae-seong (Wealth) color
  const wealthCol = getColor(ELEMENT_CYCLE[(dmIdx + 2) % 5]);
  // Gwan-seong (Power) color
  const gwanCol = getColor(ELEMENT_CYCLE[(dmIdx + 3) % 5]);
  // In-seong (Resource) color
  const inSeongCol = getColor(ELEMENT_CYCLE[(dmIdx + 4) % 5]);

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

  const gods = {
    BiGyeop: getRatio('비겁', 'Mirror', 'Rival'),
    SikSang: getRatio('식상', 'Artist', 'Output'),
    JaeSeong: getRatio('재성', 'Maverick', 'Wealth'),
    GwanSeong: getRatio('관성', 'Warrior', 'Power'),
    InSeong: getRatio('인성', 'Mystic', 'Sage')
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

  // --- New Special Statuses ---
  const elementCounts: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  pillars.forEach(p => {
    const sEl = BAZI_MAPPING.stems[p.stem as keyof typeof BAZI_MAPPING.stems]?.element;
    const bEl = BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches]?.element;
    if (sEl) elementCounts[sEl]++;
    if (bEl) elementCounts[bEl]++;
  });
  const totalElements = Object.values(elementCounts).reduce((a, b) => a + b, 0);
  const elementRatios = Object.fromEntries(Object.entries(elementCounts).map(([k, v]) => [k, (v / totalElements) * 100]));

  const inSeongBranchesCount = pillars.filter(p => {
    const bEl = BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches]?.element;
    const rel = getRelationship(dmElement, bEl || '');
    return rel === 'Wisdom';
  }).length;

  const isFireEarthHeavy = (elementRatios.Fire + elementRatios.Earth) >= 70 || inSeongBranchesCount >= 3;
  const earthBranchesCount = pillars.filter(p => BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches]?.element === 'Earth').length;
  const isGoldBuried = (dayMaster === '庚' || dayMaster === '辛') && earthBranchesCount >= 3;

  const monthBranch = pillars.find(p => p.title === 'Month')?.branch || '';
  const isWinter = ['亥', '子', '丑'].includes(monthBranch);
  const isColdWater = (elementRatios.Metal + elementRatios.Water) >= 60 && isWinter;

  const isSikSangIsolated = (gods.BiGyeop + gods.JaeSeong) >= 60 && gods.SikSang === 0;

  const isDryChart = (elementRatios.Fire + elementRatios.Earth + elementRatios.Wood) >= 75 && elementRatios.Water <= 10;

  const isColdWet = (monthBranch === '亥' || monthBranch === '子' || monthBranch === '丑') && (elementRatios.Water + elementRatios.Metal) >= 50;
  const isHotDry = (monthBranch === '巳' || monthBranch === '午' || monthBranch === '未') && elementRatios.Fire >= 40;
  const isWoodHeavy = elementRatios.Wood >= 45;

  // --- Universal Energy Balancing Engine ---
  const monthBranchElement = BAZI_MAPPING.branches[monthBranch as keyof typeof BAZI_MAPPING.branches]?.element || '';
  const dayBranch = pillars.find(p => p.title === 'Day')?.branch || '';
  const dayBranchElement = BAZI_MAPPING.branches[dayBranch as keyof typeof BAZI_MAPPING.branches]?.element || '';
  
  // Detect Overloaded/Surplus Element
  // 1. Ratio >= 45%
  // 2. Ratio >= 35% AND it's in the Month Branch (Strongest influence)
  // 3. Ratio >= 35% AND it's in the Day Branch
  const surplusElement = Object.entries(elementRatios).find(([el, ratio]) => {
    if (ratio >= 45) return true;
    if (ratio >= 35 && (el === monthBranchElement || el === dayBranchElement)) return true;
    return false;
  })?.[0] || null;

  const surplusGod = Object.entries(gods).find(([_, ratio]) => ratio >= 40)?.[0] || null;
  
  // Palace State Detection
  const dayBranchInteractions = interactions.filter(i => i.note.includes(dayBranch));
  const hasHapInChart = dayBranchInteractions.some(i => i.type.includes('합'));
  const hasChungInChart = dayBranchInteractions.some(i => i.type.includes('충'));
  
  // If the day branch is being controlled by many elements in the chart
  const controllingElement = ELEMENT_CYCLE[(ELEMENT_CYCLE.indexOf(dayBranchElement) + 4) % 5];
  const controlCount = pillars.filter(p => {
    const sEl = BAZI_MAPPING.stems[p.stem as keyof typeof BAZI_MAPPING.stems]?.element;
    const bEl = BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches]?.element;
    return sEl === controllingElement || bEl === controllingElement;
  }).length;
  
  const palaceState = (controlCount >= 3 || hasChungInChart) ? 'suppressed' : (!hasHapInChart ? 'unstable' : 'stable');

  // --- Special Combinations (물상론) ---
  const hasJeongFire = pillars.some(p => p.stem === '丁' || (BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches]?.hiddenStems || []).includes('丁'));
  const hasJinEarth = pillars.some(p => p.branch === '辰');

  const specialCombinations = {
    isByeokGapInHwa: dayMaster === '甲' && hasJeongFire, // Will check Gyeong Metal in cycle-vibe
    isDengLaJieJia: dayMaster === '乙', // Will check Gap Wood in cycle-vibe
    isDoSeJuOk: dayMaster === '辛', // Will check Im Water in cycle-vibe
    isGangHwiSangYeong: dayMaster === '壬', // Will check Byeong Fire in cycle-vibe
    isHwaChiSeungRyong: (elementRatios.Fire >= 50) && hasJinEarth,
    isGiToTakIm: dayMaster === '壬' // Will check Gi Earth in cycle-vibe
  };
  
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
        let muBiDesc = '';
        let muBiDescEn = '';
        if (dmElement === 'Wood') {
          muBiDesc = `[${woodCol}:목(木) 비겁]이 없는 '뿌리 없는 나무'와 같아. 지지해줄 형제나 동료가 부족해 외로움을 타기 쉽지만, 그만큼 독립심이 강해 혼자서도 잘 해내는 자수성가형의 힘이 있어.`;
          muBiDescEn = `Like a 'rootless tree' lacking [${woodCol}:Wood]. You may feel lonely due to a lack of supportive siblings or peers, but you have the self-made strength to succeed independently.`;
        } else if (dmElement === 'Fire') {
          muBiDesc = `[${fireCol}:화(火) 비겁]이 없는 '빛 없는 불꽃'이야. 열정을 공유할 동료가 없어 고립감을 느낄 수 있지만, 타인의 시선에 구애받지 않고 자신만의 길을 묵묵히 가는 뚝심이 돋보여.`;
          muBiDescEn = `A 'lightless flame' without [${fireCol}:Fire]. You may feel isolated without peers to share your passion, but your perseverance to walk your own path regardless of others' opinions stands out.`;
        } else if (dmElement === 'Earth') {
          muBiDesc = `[${earthCol}:토(土) 비겁]이 없는 '기반 없는 대지'야. 넓은 포용력을 발휘할 대상이 없어 허전할 수 있지만, 특정 집단에 얽매이지 않는 자유로운 영혼으로 살아가기에 매우 유리한 구조야.`;
          muBiDescEn = `A 'foundationless land' without [${earthCol}:Earth]. You may feel empty without targets for your broad tolerance, but it's an advantageous structure for living as a free spirit unbound by specific groups.`;
        } else if (dmElement === 'Metal') {
          muBiDesc = `[${metalCol}:금(金) 비겁]이 없는 '동료 없는 칼날'이야. 자신의 강단과 결단력을 지지해줄 세력이 부족해 보이지만, 오히려 타협하지 않는 순수한 정의감을 유지하며 독자적인 영역을 구축해.`;
          muBiDescEn = `A 'peerless blade' without [${metalCol}:Metal]. While you seem to lack forces to support your resolve, you maintain an uncompromising sense of justice and build an independent domain.`;
        } else if (dmElement === 'Water') {
          muBiDesc = `[${waterCol}:수(水) 비겁]이 없는 '흐르지 않는 물'이야. 지혜를 나눌 벗이 없어 생각이 깊어질 수 있지만, 외부의 오염 없이 맑은 통찰력을 유지하며 독자적인 지적 영역을 완성하는 힘이 있어.`;
          muBiDescEn = `A 'non-flowing water' without [${waterCol}:Water]. Thoughts may deepen without friends to share wisdom, but you have the power to maintain clear insight without external pollution and complete an independent intellectual domain.`;
        }
        descKo = muBiDesc;
        descEn = muBiDescEn;
      } else if (isSikSang) {
        let muSikDesc = '';
        let muSikDescEn = '';
        if (dmElement === 'Wood') {
          muSikDesc = `[${fireCol}:화(火) 식상]이 없는 '꽃 피지 않는 나무'와 같아. 생각은 깊으나 표현이 서툴러 자신의 진가를 알리기 어려울 수 있어. 소통의 기술을 배우고 감정을 밖으로 드러내는 연습이 필요해.`;
          muSikDescEn = `Like a 'non-blooming tree' without [${fireCol}:Fire]. Deep thoughts but poor expression may make it hard to show your true value. Learning communication skills and practicing emotional expression is needed.`;
        } else if (dmElement === 'Fire') {
          muSikDesc = `[${earthCol}:토(土) 식상]이 없는 '재 없는 불꽃'이야. 열정은 뜨거우나 이를 담아낼 그릇이나 결과물이 흩어지기 쉬워. 계획적인 행동과 마무리를 통해 열정의 결실을 맺으려는 노력이 중요해.`;
          muSikDescEn = `A 'fire without ash' lacking [${earthCol}:Earth]. Passion is hot but the vessel to contain it or the results can easily scatter. Effort to bear fruit through planned action and follow-through is important.`;
        } else if (dmElement === 'Earth') {
          muSikDesc = `[${metalCol}:금(金) 식상]이 없는 '열매 없는 대지'야. 포용력은 넓으나 결실을 맺는 날카로운 추진력이 부족할 수 있어. 목표를 향한 과감한 결단력과 실행력을 기른다면 더 큰 성취를 이룰 거야.`;
          muSikDescEn = `A 'fruitless land' without [${metalCol}:Metal]. Broad tolerance but may lack the sharp drive to bear fruit. You'll achieve more by developing bold decisiveness and execution toward your goals.`;
        } else if (dmElement === 'Metal') {
          muSikDesc = `[${waterCol}:수(水) 식상]이 없는 '무딘 칼날'이야. 강단은 있으나 유연함과 재치가 부족해 주변에 딱딱하게 느껴질 수 있어. 유머 감각을 기르고 상황에 유연하게 대처하는 여유를 갖는 것이 좋아.`;
          muSikDescEn = `A 'blunt blade' without [${waterCol}:Water]. You have resolve but lack flexibility and wit, which may seem rigid to others. It's good to develop a sense of humor and the ease to handle situations flexibly.`;
        } else if (dmElement === 'Water') {
          muSikDesc = `[${woodCol}:목(木) 식상]이 없는 '고인 물'과 같아. 지혜는 깊으나 이를 밖으로 흘려보내 생명을 키우는 활동력이 약할 수 있어. 적극적인 사회 참여와 취미 활동을 통해 내면의 에너지를 순환시켜야 해.`;
          muSikDescEn = `Like 'stagnant water' without [${woodCol}:Wood]. Deep wisdom but weak vitality to flow out and grow life. You must circulate inner energy through active social participation and hobbies.`;
        }
        
        if (gods.InSeong > 30) {
          descKo = `[${artistCol}:식상(표현)]이 없고 [${inSeongCol}:인성(생각)]이 과다해. ${muSikDesc} 특히 머릿속의 구상은 화려하나 실행력이 마비될 수 있는 [#ef4444:도식(倒食)]의 위험이 있으니 즉각 행동에 옮기는 연습이 필수적이야.`;
          descEn = `Missing [${artistCol}:Artist/Rebel] but excessive [${inSeongCol}:Mystic/Sage]. ${muSikDescEn} Especially, there is a risk of [#ef4444:Do-Sik] (paralysis by analysis) where ideas are brilliant but execution is paralyzed; immediate action is essential.`;
        } else {
          descKo = muSikDesc;
          descEn = muSikDescEn;
        }
      } else if (isJaeSeong) {
        let elementSpecific = '';
        let elementSpecificEn = '';
        if (dmElement === 'Wood') {
          elementSpecific = `[${earthCol}:토(土) 재성]이 없어 현실적인 안정감이나 부동산 축적에 대한 감각이 다소 늦게 깨어날 수 있어.`;
          elementSpecificEn = `Missing [${earthCol}:Earth Maverick/Architect], so your sense of practical stability or real estate accumulation may awaken somewhat late.`;
        } else if (dmElement === 'Fire') {
          elementSpecific = `[${metalCol}:금(金) 재성]이 없어 분별력과 사리판단을 통한 결과 도출에 시간이 걸릴 수 있어.`;
          elementSpecificEn = `Missing [${metalCol}:Metal Maverick/Architect], so it may take time to derive results through discernment and logical judgment.`;
        } else if (dmElement === 'Earth') {
          elementSpecific = `[${waterCol}:수(水) 재성]이 없어 실속 있는 현금 흐름이나 유동 자산을 숨겨서 운용하는 지혜가 필요해.`;
          elementSpecificEn = `Missing [${waterCol}:Water Maverick/Architect], so you need the wisdom to secretly manage substantial cash flow or liquid assets.`;
        } else if (dmElement === 'Metal') {
          elementSpecific = `[${woodCol}:목(木) 재성]이 없어 사람을 다루거나 객관적인 가치 판단을 내리는 데 어려움을 겪을 수 있어.`;
          elementSpecificEn = `Missing [${woodCol}:Wood Maverick/Architect], so you may experience difficulties in managing people or making objective value judgments.`;
        } else if (dmElement === 'Water') {
          elementSpecific = `[${fireCol}:화(火) 재성]이 없어 직관적인 타이밍 포착이나 무형의 자산(주식 등) 운용에 서툴 수 있어.`;
          elementSpecificEn = `Missing [${fireCol}:Fire Maverick/Architect], so you might be clumsy at catching intuitive timing or managing intangible assets (like stocks).`;
        }

        if (gods.InSeong > 30) {
          descKo = `[${wealthCol}:무재(無財)]이면서 [${inSeongCol}:인성]이 강해. 직접 몸으로 뛰어 돈을 벌기보다 '자격'이나 '권리'로 먹고사는 형국이야. ${elementSpecific} 내 손에 당장 현금은 없어도 지적 재산권이나 라이선스를 통한 실속을 차리는 힘이 있어.`;
          descEn = `Missing [${wealthCol}:Maverick/Architect] but strong [${inSeongCol}:Mystic/Sage]. You thrive on "qualifications" or "rights" rather than physical labor to earn money. ${elementSpecificEn} Even without cash in hand right now, you have the power to gain substance through intellectual property or licenses.`;
        } else {
          descKo = `[${wealthCol}:재성(결과/재물)]이 보이지 않아. 결과에 대한 한계를 정해두지 않아 역설적으로 거부가 될 수 있는 잠재력이 있어. ${elementSpecific} 목표를 구체화하고 끝까지 마무리하는 끈기가 성공의 열쇠야.`;
          descEn = `The [${wealthCol}:Maverick/Architect] energy is absent. Because you don't set limits on results, you paradoxically have the potential to become immensely wealthy. ${elementSpecificEn} Materializing your goals and having the persistence to finish them is the key to success.`;
        }
      } else if (isGwanSeong) {
        let muGwanDesc = '';
        let muGwanDescEn = '';
        if (dmElement === 'Wood') {
          muGwanDesc = `[${metalCol}:금(金)]의 기운이 부족한 '울타리 없는 숲'과 같아. 자유분방함이 지나치면 조직 생활에서 갈등을 겪을 수 있으니, 스스로 규칙을 세우고 통제하는 자제력을 기른다면 더 큰 성취를 이룰 거야.`;
          muGwanDescEn = `Like a 'forest without a fence' lacking [${metalCol}:Metal]. Excessive free-spiritedness may cause conflicts in organizational life; you'll achieve more by setting your own rules and self-discipline.`;
        } else if (dmElement === 'Fire') {
          muGwanDesc = `열기를 식혀줄 [${waterCol}:수(水)]가 없는 '꺼지지 않는 불꽃'이야. 감정 조절이나 차분한 마무리가 어려울 수 있으니, 명상이나 정적인 취미를 통해 내면의 평화를 찾는 것이 중요해.`;
          muGwanDescEn = `An 'unquenchable flame' without [${waterCol}:Water] to cool the heat. Emotional regulation or calm conclusions may be difficult; finding inner peace through meditation is crucial.`;
        } else if (dmElement === 'Earth') {
          muGwanDesc = `토를 단단하게 잡아줄 [${woodCol}:목(木)]이 없는 '기둥 없는 대지'야. 삶의 방향성이 흔들리기 쉬우니, 명확한 목표 설정과 자기 계발을 통해 삶의 든든한 기둥을 세워야 해.`;
          muGwanDescEn = `A 'pillarless land' without [${woodCol}:Wood] to hold the Earth. Life's direction can easily waver; establish strong pillars through clear goal setting and self-improvement.`;
        } else if (dmElement === 'Metal') {
          muGwanDesc = `강한 금을 제련할 [${fireCol}:화(火)]가 없는 '제련되지 않은 원석'이야. 자신의 재능을 다듬고 빛내기 위해 혹독한 자기 훈련과 인내의 시간이 필요해.`;
          muGwanDescEn = `An 'unrefined gemstone' without [${fireCol}:Fire] to smelt the Metal. You need rigorous self-discipline and patience to refine and shine your talents.`;
        } else if (dmElement === 'Water') {
          muGwanDesc = `물의 흐름을 조절할 [${earthCol}:토(土)]가 없는 '제방 없는 강물'이야. 에너지가 사방으로 흩어지기 쉬우니, 선택과 집중을 통해 자신의 역량을 한곳으로 모으는 연습이 필요해.`;
          muGwanDescEn = `A 'river without a levee' lacking [${earthCol}:Earth] to control the flow. Energy can easily scatter; practice focusing your capabilities through selection and concentration.`;
        }
        descKo = muGwanDesc;
        descEn = muGwanDescEn;
      } else if (isInSeong) {
        let muInDesc = '';
        let muInDescEn = '';
        if (dmElement === 'Wood') {
          muInDesc = `수분이 부족한 '메마른 나무'와 같아. 이론보다는 실천과 경험을 통해 배우는 스타일이지만, 때로는 멈춰 서서 깊이 사색하고 지식을 습득하여 내면의 자양분을 채워야 해.`;
          muInDescEn = `Like a 'dry tree' lacking moisture. You learn through practice and experience, but sometimes you must stop to reflect deeply and acquire knowledge to fill your inner nourishment.`;
        } else if (dmElement === 'Fire') {
          muInDesc = `땔감이 없는 '땔감 없는 불'이야. 열정은 넘치나 지속력이 부족할 수 있으니, 꾸준한 학습과 자기 성찰을 통해 열정의 근원을 만들어가는 노력이 필요해.`;
          muInDescEn = `A 'fire without firewood'. You have passion but may lack endurance; effort to create the source of passion through steady learning and self-reflection is needed.`;
        } else if (dmElement === 'Earth') {
          muInDesc = `온기가 없는 '얼어붙은 땅'이야. 수용력이 부족해 타인의 조언을 듣지 않을 수 있으니, 마음을 열고 다양한 지식과 경험을 받아들이는 유연함을 길러야 해.`;
          muInDescEn = `A 'frozen land' without warmth. Lacking receptivity, you might ignore advice; develop flexibility to open your heart and accept diverse knowledge and experiences.`;
        } else if (dmElement === 'Metal') {
          muInDesc = `토대가 없는 '뿌리 없는 칼날'이야. 날카롭지만 위태로울 수 있으니, 탄탄한 이론적 배경과 인격 수양을 통해 흔들리지 않는 삶의 기반을 마련해야 해.`;
          muInDescEn = `A 'rootless blade' without a foundation. Sharp but precarious; establish an unwavering life base through solid theoretical background and character building.`;
        } else if (dmElement === 'Water') {
          muInDesc = `근원이 없는 '근원 없는 샘물'이야. 금방 말라버릴 수 있으니, 깊이 있는 학문 탐구나 정신적 수양을 통해 끊임없이 솟아나는 지혜의 샘을 파야 해.`;
          muInDescEn = `A 'sourceless spring'. It can dry up quickly; dig a spring of wisdom that constantly wells up through deep academic pursuit or spiritual cultivation.`;
        }
        descKo = muInDesc;
        descEn = muInDescEn;
      }

      return {
        title: lang === 'KO' ? `무${godNameKo} 사주 (무자론)` : `Missing ${godNameEn} (Absence Theory)`,
        description: lang === 'KO' ? descKo : descEn,
        enDescription: descEn
      };
    });

  // 2. Da-Ja-Ron (Abundance of Ten Gods)
  const daJaRon = Object.entries(tenGodsRatio)
    .filter(([_, ratio]) => ratio > 35)
    .map(([god, ratio]) => {
      const isBiGyeop = god.includes('비겁') || god.includes('Mirror') || god.includes('Self');
      const isSikSang = god.includes('식상') || god.includes('Artist') || god.includes('Output');
      const isJaeSeong = god.includes('재성') || god.includes('Maverick') || god.includes('Wealth');
      const isGwanSeong = god.includes('관성') || god.includes('Warrior') || god.includes('Power');
      const isInSeong = god.includes('인성') || god.includes('Mystic') || god.includes('Wisdom');

      const godNameKo = isBiGyeop ? '비겁' : isSikSang ? '식상' : isJaeSeong ? '재성' : isGwanSeong ? '관성' : '인성';
      const godNameEn = isBiGyeop ? 'Mirror/Rival' : isSikSang ? 'Artist/Rebel' : isJaeSeong ? 'Maverick/Architect' : isGwanSeong ? 'Warrior/Judge' : 'Mystic/Sage';
      
      let descKo = '';
      let descEn = '';
      
      if (isBiGyeop) {
        let biGyeopDesc = '';
        let biGyeopDescEn = '';
        if (dmElement === 'Wood') {
          biGyeopDesc = `"빽빽한 숲속의 치열한 생존 경쟁." 주변에 사람이 많아 든든하지만, 한정된 자원을 두고 다투는 경쟁이 매우 치열해. [${wealthCol}:토(재)]가 부족하면 재산 분탈([tooltip:군비쟁재])이 일어나기 쉬우니 금전 거래에 각별히 주의해야 해.`;
          biGyeopDescEn = `"Fierce survival competition in a dense forest." Surrounded by many people, but competition for limited resources is intense. Without [${wealthCol}:Earth Wealth], property disputes are likely; be extra cautious with financial transactions.`;
        } else if (dmElement === 'Fire') {
          biGyeopDesc = `"맹렬하게 타오르는 불바다." 열정과 에너지가 넘쳐 주변을 압도하지만, 감정 조절이 안 되면 주변을 태워버릴 수 있어. [${wealthCol}:금(재)]가 녹아내리지 않도록 냉철한 이성과 평정심을 유지하는 것이 성공의 열쇠야.`;
          biGyeopDescEn = `"A fiercely blazing sea of fire." Overwhelming passion and energy, but uncontrolled emotions can burn those around you. Maintaining cool reason and composure to prevent [${wealthCol}:Metal Wealth] from melting is the key to success.`;
        } else if (dmElement === 'Earth') {
          biGyeopDesc = `"거대하고 단단한 산맥." 고집과 주관이 너무 강해 타인의 의견이 들어갈 틈이 부족할 수 있어. [${wealthCol}:수(재)]가 막히면 융통성 없는 고집불통이 될 수 있으니, 유연한 사고와 포용력을 기르는 연습이 필요해.`;
          biGyeopDescEn = `"A massive and solid mountain range." Strong convictions may leave little room for others' opinions. If [${wealthCol}:Water Wealth] is blocked, you may become inflexible; practice cultivating flexible thinking and tolerance.`;
        } else if (dmElement === 'Metal') {
          biGyeopDesc = `"강철로 이루어진 무적의 군단." 결단력과 추진력이 독보적이지만, 너무 날카로워 주변 사람들에게 의도치 않게 상처를 주기 쉬워. [${wealthCol}:목(재)]가 꺾이지 않도록 부드러운 카리스마와 배려심을 갖춰야 해.`;
          biGyeopDescEn = `"An invincible army of steel." Unrivaled decisiveness and drive, but so sharp you may unintentionally hurt others. You must possess soft charisma and consideration to prevent [${wealthCol}:Wood Wealth] from breaking.`;
        } else if (dmElement === 'Water') {
          biGyeopDesc = `"범람하는 거대한 강물." 지혜와 유연함이 넘치지만, 명확한 방향성을 잃으면 방탕함이나 깊은 우울감에 빠지기 쉬워. [${wealthCol}:화(재)]가 꺼지지 않도록 뚜렷한 목표 의식과 자기 통제력을 가져야 해.`;
          biGyeopDescEn = `"A flooding massive river." Abundant wisdom and flexibility, but without clear direction, you may fall into dissipation or deep depression. Maintain a clear sense of purpose and self-control to keep [${wealthCol}:Fire Wealth] from extinguishing.`;
        }
        descKo = biGyeopDesc;
        descEn = biGyeopDescEn;
      } else if (isSikSang) {
        let sikSangDesc = '';
        let sikSangDescEn = '';
        if (dmElement === 'Wood') {
          sikSangDesc = `"충동적 실행력과 호기심의 끝판왕." 생각이 떠오르면 즉시 실행하지만, 뒷심이 부족해 여러 개를 벌려놓고 끝맺지 못하는 경우가 많아. [${gwanCol}:금(관)]의 기운이 부족하면 통제가 어려울 수 있으니 주의해.`;
          sikSangDescEn = `"The ultimate impulsive executor and curiosity seeker." You act immediately on ideas but often fail to finish what you start. Without [${gwanCol}:Metal Power], control can be difficult.`;
        } else if (dmElement === 'Fire') {
          sikSangDesc = `"만능 해결사, 하지만 실속은 남에게." 타인을 돕는 데 에너지를 다 쓰지만 정작 자신의 결과물은 챙기지 못할 수 있어. [${gwanCol}:수(관)]이 없으면 빛 좋은 개살구가 될 수 있으니 실속을 챙겨야 해.`;
          sikSangDescEn = `"The universal fixer, but others get the benefits." You spend energy helping others but may fail to secure your own results. Without [${gwanCol}:Water Power], it might be all show and no substance.`;
        } else if (dmElement === 'Earth') {
          sikSangDesc = `"날카로운 비판가, 완벽주의자." 언변이 뛰어나고 분석적이지만, 때로는 타인에게 상처를 주는 독설이 될 수 있어. [${gwanCol}:목(관)]이 없으면 절제 없는 비판으로 고립될 수 있으니 유연함이 필요해.`;
          sikSangDescEn = `"A sharp critic and perfectionist." Eloquent and analytical, but can be hurtful. Without [${gwanCol}:Wood Power], unrestrained criticism may lead to isolation; flexibility is needed.`;
        } else if (dmElement === 'Metal') {
          sikSangDesc = `"예술적 감수성과 깊은 고독." 감수성이 풍부하고 창의적이지만, 현실 세계와의 괴리감으로 인해 우울감에 빠지기 쉬워. [${gwanCol}:화(관)]이 없으면 자기만의 세계에 갇힐 수 있으니 사회적 교류가 중요해.`;
          sikSangDescEn = `"Artistic sensitivity and deep loneliness." Rich in sensitivity and creativity, but prone to depression due to a sense of detachment from reality. Without [${gwanCol}:Fire Power], you might get trapped in your own world; social interaction is important.`;
        } else if (dmElement === 'Water') {
          sikSangDesc = `"자유로운 영혼, 방랑자." 호기심이 많고 틀에 얽매이는 것을 극도로 싫어해. [${gwanCol}:토(관)]이 없으면 방종으로 흐를 수 있으니 스스로 규칙을 정하고 지키는 연습이 필요해.`;
          sikSangDescEn = `"A free spirit, a wanderer." Highly curious and hates being confined by rules. Without [${gwanCol}:Earth Power], it may lead to indulgence; practice setting and keeping your own rules.`;
        }
        descKo = sikSangDesc;
        descEn = sikSangDescEn;
      } else if (isGwanSeong) {
        let gwanSeongDesc = '';
        let gwanSeongDescEn = '';
        if (dmElement === 'Wood') {
          gwanSeongDesc = `"도끼에 찍히는 나무." 지나친 책임감과 타인의 시선에 대한 의식으로 스스로를 옭아매고 있어. [${inSeongCol}:수(인)]이 없으면 스트레스로 인해 건강이 상할 수 있으니, 남의 기대보다 내 마음의 소리에 귀 기울여야 해.`;
          gwanSeongDescEn = `"A tree struck by an axe." You bind yourself with excessive responsibility and consciousness of others' opinions. Without [${inSeongCol}:Water Resource], stress may harm your health; listen to your inner voice rather than others' expectations.`;
        } else if (dmElement === 'Fire') {
          gwanSeongDesc = `"폭우 속에 갇힌 불꽃." 주변의 압박과 억압으로 인해 자신의 열정과 능력을 제대로 펼치지 못하고 있어. [${inSeongCol}:목(인)]이 없으면 무기력증에 빠질 수 있으니, 자신을 지지해주는 환경을 찾는 것이 시급해.`;
          gwanSeongDescEn = `"A flame trapped in heavy rain." You cannot properly unfold your passion and abilities due to surrounding pressure and suppression. Without [${inSeongCol}:Wood Resource], you may fall into lethargy; finding a supportive environment is urgent.`;
        } else if (dmElement === 'Earth') {
          gwanSeongDesc = `"뿌리가 너무 깊어 갈라지는 땅." 명예와 권력에 대한 집착이 강해 주변 사람들과 마찰을 빚을 수 있어. [${inSeongCol}:화(인)]이 없으면 고집불통으로 낙인찍힐 수 있으니, 타인과 타협하고 포용하는 자세를 길러야 해.`;
          gwanSeongDescEn = `"Earth cracking from roots too deep." Strong obsession with honor and power may cause friction with those around you. Without [${inSeongCol}:Fire Resource], you might be branded as stubborn; cultivate an attitude of compromise and embrace.`;
        } else if (dmElement === 'Metal') {
          gwanSeongDesc = `"불에 녹아내리는 칼." 과도한 업무나 엄격한 규율이 자신을 변형시키고 고통스럽게 할 수 있어. [${inSeongCol}:토(인)]이 없으면 인내심의 한계에 부딪혀 폭발할 수 있으니, 적절한 감정 분출구와 휴식이 필수야.`;
          gwanSeongDescEn = `"A blade melting in fire." Excessive work or strict discipline may deform and distress you. Without [${inSeongCol}:Earth Resource], you may hit the limit of patience and explode; an emotional outlet and rest are essential.`;
        } else if (dmElement === 'Water') {
          gwanSeongDesc = `"흙탕물이 된 강물." 조직의 틀에 갇혀 자신의 지혜와 유연함을 잃어버릴 위험이 있어. [${inSeongCol}:금(인)]이 없으면 판단력이 흐려지고 이용당하기 쉬우니, 맑은 정신을 유지하고 주관을 뚜렷이 세워야 해.`;
          gwanSeongDescEn = `"A river turned into muddy water." Risk of losing wisdom and flexibility trapped in organizational frameworks. Without [${inSeongCol}:Metal Resource], judgment may blur and you may be exploited; maintain a clear mind and firm convictions.`;
        }
        descKo = gwanSeongDesc;
        descEn = gwanSeongDescEn;
      } else if (isInSeong) {
        let inSeongDesc = '';
        let inSeongDescEn = '';
        if (dmElement === 'Wood') {
          inSeongDesc = `"생각의 늪에 빠진 철학자." 수용력과 지혜는 깊으나 생각이 너무 많아 실행력이 떨어질 수 있어. [${artistCol}:화(식상)]이 없으면 행동력 제로가 될 수 있으니 즉각적인 실천이 중요해.`;
          inSeongDescEn = `"A philosopher trapped in a swamp of thoughts." Deep wisdom but overthinking delays action. Without [${artistCol}:Fire Output], action might be zero; immediate practice is key.`;
        } else if (dmElement === 'Fire') {
          inSeongDesc = `"활활 타오르는 열정, 하지만 금방 식는 냄비." 배우고자 하는 열의는 강하나 끈기가 부족해 중도 포기하기 쉬워. [${artistCol}:토(식상)]이 없으면 뒷심 부족으로 결과가 미흡할 수 있으니 마무리에 집중해.`;
          inSeongDescEn = `"Blazing passion, but quick to cool." Strong desire to learn but lacks persistence. Without [${artistCol}:Earth Output], results may be poor due to weak follow-through; focus on finishing.`;
        } else if (dmElement === 'Earth') {
          inSeongDesc = `"고집불통 보수주의자." 자신의 신념이 너무 강해 타인의 의견을 배척하고 변화를 거부할 수 있어. [${artistCol}:금(식상)]이 없으면 융통성 제로가 되어 고립될 수 있으니 개방적인 태도가 필요해.`;
          inSeongDescEn = `"A stubborn conservative." Strong convictions may lead to rejecting others' opinions and resisting change. Without [${artistCol}:Metal Output], you might become inflexible and isolated; an open attitude is needed.`;
        } else if (dmElement === 'Metal') {
          inSeongDesc = `"매몰된 보석, 인정 욕구의 화신." 재능은 있으나 밖으로 드러내지 못하고 누군가 알아주기만을 기다릴 수 있어. [${artistCol}:수(식상)]이 없으면 빛을 보지 못하니 스스로를 세상에 알리는 용기가 필요해.`;
          inSeongDescEn = `"A buried gem, an incarnation of the desire for recognition." Talented but hidden, waiting for someone to notice. Without [${artistCol}:Water Output], you won't see the light; you need the courage to show yourself to the world.`;
        }
        descKo = inSeongDesc;
        descEn = inSeongDescEn;
      } else {
        descKo = `"평범함 속에 감춰진 비범함." 특별히 치우친 기운은 없지만, 그만큼 어떤 환경에도 잘 적응할 수 있는 유연함이 너의 무기야.`;
        descEn = `"Extraordinariness hidden in ordinariness." No particularly skewed energy, but that flexibility to adapt to any environment is your weapon.`;
      }
      
      return {
        title: lang === 'KO' ? `${godNameKo}다자 사주 (다자론)` : `Abundant ${godNameEn} (Abundance Theory)`,
        description: lang === 'KO' ? descKo : descEn,
        enDescription: descEn
      };
    });

  // --- 3. Relationships Analysis ---
  const getRelationshipAnalysis = () => {
    const relationships: any = {};
    const dayPillar = pillars.find(p => p.title === 'Day');
    const dayBranch = dayPillar?.branch || '';
    const dayBranchTenGod = dayPillar?.branchKoreanName || '';

    const isMaeGeum = dmElement === 'Metal' && gods.InSeong > 40;
    const isToDaMokJeol = dmElement === 'Wood' && gods.JaeSeong > 40;
    const isSuDaMokBu = dmElement === 'Wood' && gods.InSeong > 40;
    const isMokDaHwaSik = dmElement === 'Fire' && gods.InSeong > 40;

    // 1. Siblings & Peers (BiGeob/SikSang)
    let siblingsDesc = '';
    let siblingsDescEn = '';
    if (gods.BiGyeop > 30) {
      siblingsDesc = "비겁이 강해. 형제나 동료와 경쟁심이 강하고, 때로는 부딪힐 수 있지만 결국 서로에게 자극제가 되는 관계야. 독립심을 기르는 게 중요해.";
      siblingsDescEn = "Strong Peer energy. You have strong competition with siblings or peers, and though you may clash, you ultimately stimulate each other. Fostering independence is important.";
    } else if (gods.SikSang > 30) {
      siblingsDesc = "식상이 강해. 형제나 동료를 챙기고 돌보는 역할을 자처할 수 있어. 베푸는 만큼 돌아오지 않아 서운할 수 있으니 적당한 거리 유지가 필요해.";
      siblingsDescEn = "Strong Output energy. You may take on the role of caring for siblings or peers. You might feel disappointed if you don't receive as much as you give, so maintaining a proper distance is needed.";
    } else {
      siblingsDesc = "형제나 동료와의 관계가 무난한 편이야. 서로의 영역을 존중하며 평력적인 관계를 유지할 수 있어.";
      siblingsDescEn = "Your relationship with siblings or peers is generally smooth. You can maintain an egalitarian relationship while respecting each other's boundaries.";
    }

    relationships.siblings = {
      title: lang === 'KO' ? '형제 및 동료 (비겁/식상)' : 'Siblings & Peers (Peer/Output)',
      ratio: Math.max(gods.BiGyeop, gods.SikSang),
      description: lang === 'KO' ? siblingsDesc : siblingsDescEn
    };

    // 2. Parents & Superiors (Month Zhi) - Position: Month Zhi
  let parentsDesc = '';
  const monthPillar = pillars.find(p => p.title === 'Month');
  const monthStemGod = monthPillar?.stemKoreanName || '';
  const monthZhiGod = monthPillar?.branchKoreanName || '';

  const getInversionNarrative = () => {
    let fictionKo = '';
    let truthKo = '';
    let fictionEn = '';
    let truthEn = '';
    
    // Step 1: System Affirmation (The Bait) & Step 2: Existential Subversion (The Twist)
    if (monthStemGod.includes('정관') || monthZhiGod.includes('정관')) {
      fictionKo = `월주에 [${gwanCol}:정관(正官)]이 있으니 너는 가문의 명예를 업고 태어난 귀공자나 공주님이어야 해. 번듯한 배경과 도덕적 교육이 너를 지탱하는 힘이라고 교과서엔 적혀 있겠지.`;
      truthKo = "근데 사실 그 '번듯함'이 네 숨통을 조이는 단두대야. 부모의 체면과 사회적 시선이라는 금방석에 앉아있느라 너 본연의 야성은 거세당했네. 탈출 불가능한 우아한 감옥이지.";
      fictionEn = `With [${gwanCol}:Proper Power] in the Month Pillar, textbooks would say you were born to carry the family's honor, supported by a respectable background and moral education.`;
      truthEn = "But in reality, that 'respectability' is a guillotine choking you. Sitting on the golden cushion of your parents' face-saving and societal expectations has castrated your true wildness. It's an elegant, inescapable prison.";
    } else if (monthStemGod.includes('편관') || monthZhiGod.includes('편관')) {
      fictionKo = `월주 [${gwanCol}:편관]이면 부모님이 너를 지켜주는 거대한 방패나 권위 있는 존재처럼 보이기 쉬워. 든든한 울타리 안에서 보호받는 형상이라고들 하지.`;
      truthKo = "진실은 그 방패에 네가 깔려 죽기 직전이라는 거야. 부모의 강압적인 기운이 너를 압박하고, 그들의 짐을 네가 대신 짊어져야 하는 구조네. 부모님의 그늘을 벗어나 세상을 마주하려는 그 용기를 응원할게!";
      fictionEn = `With [${gwanCol}:the Warrior] in the Month Pillar, it's easy to see your parents as a giant shield or authoritative figures protecting you within a sturdy fence.`;
      truthEn = "The truth is, you're about to be crushed to death by that shield. The oppressive energy of your parents pressures you, and you are structured to carry their burdens instead. I cheer for your courage to step out of their shadow and face the world!";
    } else if (monthStemGod.includes('정인') || monthZhiGod.includes('정인')) {
      fictionKo = `[${inSeongCol}:정인(正印)]이 월주에 가득하니 부모님의 무조건적인 사랑과 혜택을 듬뿍 받고 자란 행운아라고 하겠지. 부족함 없는 지원이 너의 자양분이라고 말이야.`;
      truthKo = "실상은 '부드러운 폭력'이야. 부모의 과잉보호가 너의 자립심을 녹여버렸어. 사랑이라는 이름의 늪에 빠져서 혼자서는 아무것도 못 하는 바보가 되길 강요받는 셈이지. [tooltip:모다멸자](母多滅子)의 전형이야.";
      fictionEn = `Full of [${inSeongCol}:The Sage] in the Month Pillar, they'd call you a lucky one raised with unconditional love and abundant benefits from your parents. Flawless support is supposedly your nourishment.`;
      truthEn = "The reality is 'soft violence'. Your parents' overprotection has melted away your independence. You're forced to become a fool who can't do anything alone, drowning in a swamp called love. It's the epitome of 'Too Many Mothers Ruin the Child'.";
    } else if (monthStemGod.includes('편인') || monthZhiGod.includes('편인')) {
      fictionKo = `[${inSeongCol}:편인(偏印)]의 기운이 강하니 부모님이 너에게 특별한 재능이나 깊은 지혜를 물려주셨다고 해석할 거야. 남다른 통찰력을 가진 가문이라고 치켜세우겠지.`;
      truthKo = "글쎄, 그건 '조건부 사랑'의 다른 이름일 뿐이야. 부모의 기분에 따라 변하는 애정 때문에 너는 눈치 보느라 속이 다 썩었네. 혜택이 아니라 나중에 갚아야 할 빚처럼 느껴지는 무거운 유산이지.";
      fictionEn = `With strong [${inSeongCol}:The Mystic] energy, they'll interpret that your parents passed down special talents or deep wisdom to you, praising your family's extraordinary insight.`;
      truthEn = "Well, that's just another name for 'conditional love'. Because of affection that fluctuates with your parents' moods, you've rotted inside trying to read the room. It's a heavy legacy that feels like a debt to be repaid later, not a benefit.";
    } else if (monthStemGod.includes('재성') || monthZhiGod.includes('재성')) {
      fictionKo = `월주에 [${wealthCol}:재성(財星)]이 뚜렷하니 부모님이 닦아놓은 탄탄한 경제적 기반이 너를 받쳐준다고 하겠지. 금수저 필터 통과라며 다들 부러워할 거야.`;
      truthKo = "현실은 네가 부모님의 '자산 관리인'으로 고용된 격이야. 돈은 주지만 그 대가로 너의 자유를 저당 잡았네. 현실적인 이득 때문에 너의 꿈을 포기해야 하는 기만적인 거래지.";
      fictionEn = `With clear [${wealthCol}:Wealth] in the Month Pillar, they'd say the solid economic foundation laid by your parents supports you. Everyone will envy you for passing the 'silver spoon' filter.`;
      truthEn = "The reality is you're hired as your parents' 'asset manager'. They give you money, but they've mortgaged your freedom in return. It's a deceptive trade where you have to give up your dreams for realistic gains.";
    } else if (monthStemGod.includes('식상') || monthZhiGod.includes('식상')) {
      fictionKo = `[${artistCol}:식상(食傷)]이 월주에 있으니 부모님이 너의 재능을 지지해주고 자유로운 환경을 만들어주셨다고 보겠지. 창의성을 키워주는 열린 부모님이라고 말이야.`;
      truthKo = "사실은 부모님이 못다 이룬 꿈을 너를 통해 대리 만족하려는 거야. '특별해야 한다'는 강박이 너의 어깨를 누르고 있어. 자유로운 척하지만 사실은 부모의 기대를 연기하는 광대 노릇 중이지.";
      fictionEn = `With [${artistCol}:Output] in the Month Pillar, they'd assume your parents supported your talents and created a free environment, praising them as open-minded parents who foster creativity.`;
      truthEn = "The truth is your parents are trying to live out their unfulfilled dreams through you. The obsession that you 'must be special' weighs on your shoulders. You pretend to be free, but you're actually playing the clown, acting out your parents' expectations.";
    } else if (monthStemGod.includes('비겁') || monthZhiGod.includes('비겁')) {
      fictionKo = `[${getColor(dmElement)}:비겁(比劫)]이 월주에 강하니 형제나 부모님이 친구처럼 평등하고 독립적인 관계라고 하겠지. 서로 돕고 사는 끈끈한 동료애가 느껴진다고 할 거야.`;
      truthKo = "진실은 끊임없는 경쟁과 비교야. 내 몫을 지키기 위해 가족 안에서도 칼을 품어야 하는 구조네. 사생활은 없고 모든 걸 공유해야 하는, 숨 막히는 집단주의의 허구지.";
      fictionEn = `With strong [${getColor(dmElement)}:Peer] energy in the Month Pillar, they'd say you have an equal, independent, friend-like relationship with your siblings or parents, feeling a tight-knit camaraderie.`;
      truthEn = "The truth is endless competition and comparison. It's a structure where you have to harbor a knife even within your family to protect your share. It's the fiction of suffocating collectivism where there's no privacy and everything must be shared.";
    } else if (isMaeGeum) {
      fictionKo = "금(金) 일간에 토(土) 인성이 가득하니 부모님의 지원이 보석을 닦아주는 귀한 손길처럼 보일 거야.";
      truthKo = "하지만 현실은 '위장된 번영'이지. 흙이 너무 많아 보석인 네가 빛을 잃고 묻혀버렸어. 사랑이라는 이름으로 너를 매장하고 있는 [tooltip:토다매금](土多埋金)의 현장이야. 너는 지금 숨이 막혀.";
      fictionEn = "As a Metal Day Master full of Earth Resource, your parents' support might look like precious hands polishing a gem.";
      truthEn = "But the reality is 'disguised prosperity'. There's too much dirt, so you, the gem, have lost your light and been buried. It's a scene of being buried alive under the name of love. You are suffocating right now. This is [tooltip:To-da-mae-geum].";
    } else if (isToDaMokJeol) {
      fictionKo = "목(木) 일간에 토(土) 재성이 풍부하니 부모님이 물려줄 땅과 자산이 넘쳐나는 풍요로운 환경이라 하겠지.";
      truthKo = "진실은 '텅 빈 껍데기'야. 부모의 자산이라는 흙이 너무 단단해서 나무인 너의 뿌리가 뻗지 못하고 부러지고 있어. 겉은 화려한데 네 속은 영양실조 상태지. 너만의 영역이 없어.";
      fictionEn = "As a Wood Day Master abundant in Earth Wealth, they'd call it a prosperous environment overflowing with land and assets to inherit from your parents.";
      truthEn = "The truth is an 'empty shell'. The dirt, which is your parents' assets, is so hard that your roots as a tree cannot spread and are breaking. It's flashy on the outside, but you're malnourished on the inside. You have no domain of your own.";
    } else if (isSuDaMokBu) {
      fictionKo = "목(木) 일간에 수(水) 인성이 넘치니 고서에 따르면 너의 사주는 마르지 않는 샘물같은 부모님의 사랑을 아낌없이 받는 형국이라고 볼거야.";
      truthKo = "그치만 내가 볼때는 이건 일종의 '정서적 잠식'이야. 부모의 감정적 과잉이라는 파도때문에 너는 뿌리 내리지 못하고 떠내려가고 있는 [tooltip:수다목부](水多木浮)의 상태야. 네 인생의 방향타를 부모가 쥐고 흔드니 너는 늘 불안하고 공허하지 않아?";
      fictionEn = "As a Wood Day Master overflowing with Water Resource, ancient texts would say your chart is receiving endless love from your parents like an undrying spring.";
      truthEn = "But the way I see it, this is a kind of 'emotional encroachment'. You are unable to take root and are drifting away due to the waves of your parents' emotional excess ([tooltip:Su-da-mok-bu]). With your parents holding the rudder of your life, aren't you always anxious and empty?";
    } else if (isMokDaHwaSik) {
      fictionKo = "화(火) 일간에 목(木) 인성이 가득하니 부모님이 땔감을 끊임없이 공급해주는 든든한 후원자라 하겠지.";
      truthKo = "현실은 '역전된 부양'의 압박이야. 땔감이 너무 많아 오히려 너의 불꽃이 꺼져버리는 [tooltip:목다화식](木多火息)의 형국이지. 과도한 기대와 지원이 너의 야성을 죽이고, 결국 네가 그 무거운 나무더미를 치워야 하는 짐이 됐어.";
      fictionEn = "As a Fire Day Master full of Wood Resource, they'd say your parents are reliable sponsors constantly supplying firewood.";
      truthEn = "The reality is the pressure of 'reversed support'. There's so much firewood that your flame is actually being extinguished ([tooltip:Mok-da-hwa-sik]). Excessive expectations and support have killed your wildness, and ultimately, it's become a burden where you have to clear away that heavy pile of wood.";
    } else {
      fictionKo = "부모님과의 관계가 원만하고 사회적인 기반이 잘 닦여 있는 구조라고들 말하지.";
      truthKo = "근데 그 원만함은 네가 입을 닫고 있기 때문에 유지되는 거야. 겉으로는 평화로워 보이지만 속으로는 각자 다른 연기를 하고 있는, 잘 짜인 연극 무대 같네.";
      fictionEn = "They say it's a structure with an amicable relationship with parents and a well-established social foundation.";
      truthEn = "But that amicability is maintained because you keep your mouth shut. It looks peaceful on the outside, but inside, it's like a well-choreographed theater stage where everyone is playing a different role.";
    }

    // Step 3: The X-Factor (Hap/Chung/Hyung/Pa/Hae/Wonjin)
    let inversionKo = '';
    let inversionEn = '';
    
    const wonjinPairs: Record<string, string> = {
      '子': '未', '未': '子',
      '丑': '午', '午': '丑',
      '寅': '酉', '酉': '寅',
      '卯': '申', '申': '卯',
      '辰': '亥', '亥': '辰',
      '巳': '戌', '戌': '巳'
    };

    const gwimunPairs: Record<string, string> = {
      '子': '酉', '酉': '子',
      '丑': '午', '午': '丑',
      '寅': '未', '未': '寅',
      '卯': '申', '申': '卯',
      '辰': '亥', '亥': '辰',
      '巳': '戌', '戌': '巳'
    };

    const isMonthWonjinWithDay = wonjinPairs[monthZhi] === dayBranch;
    const isMonthGwimunWithDay = gwimunPairs[monthZhi] === dayBranch;
    const isMonthHyungWithDay = (
      (monthZhi === '寅' && dayBranch === '巳') || (monthZhi === '巳' && dayBranch === '寅') ||
      (monthZhi === '巳' && dayBranch === '申') || (monthZhi === '申' && dayBranch === '巳') ||
      (monthZhi === '寅' && dayBranch === '申') || (monthZhi === '申' && dayBranch === '寅') ||
      (monthZhi === '丑' && dayBranch === '戌') || (monthZhi === '戌' && dayBranch === '丑') ||
      (monthZhi === '戌' && dayBranch === '未') || (monthZhi === '未' && dayBranch === '戌') ||
      (monthZhi === '丑' && dayBranch === '未') || (monthZhi === '未' && dayBranch === '丑') ||
      (monthZhi === '子' && dayBranch === '卯') || (monthZhi === '卯' && dayBranch === '子') ||
      (monthZhi === '辰' && dayBranch === '辰') || (monthZhi === '午' && dayBranch === '午') ||
      (monthZhi === '酉' && dayBranch === '酉') || (monthZhi === '亥' && dayBranch === '亥')
    );
    const isMonthPaWithDay = (
      (monthZhi === '子' && dayBranch === '酉') || (monthZhi === '酉' && dayBranch === '子') ||
      (monthZhi === '丑' && dayBranch === '辰') || (monthZhi === '辰' && dayBranch === '丑') ||
      (monthZhi === '寅' && dayBranch === '亥') || (monthZhi === '亥' && dayBranch === '寅') ||
      (monthZhi === '卯' && dayBranch === '午') || (monthZhi === '午' && dayBranch === '卯') ||
      (monthZhi === '巳' && dayBranch === '申') || (monthZhi === '申' && dayBranch === '巳') ||
      (monthZhi === '未' && dayBranch === '戌') || (monthZhi === '戌' && dayBranch === '未')
    );
    const isMonthHaeWithDay = (
      (monthZhi === '子' && dayBranch === '未') || (monthZhi === '未' && dayBranch === '子') ||
      (monthZhi === '丑' && dayBranch === '午') || (monthZhi === '午' && dayBranch === '丑') ||
      (monthZhi === '寅' && dayBranch === '巳') || (monthZhi === '巳' && dayBranch === '寅') ||
      (monthZhi === '卯' && dayBranch === '辰') || (monthZhi === '辰' && dayBranch === '卯') ||
      (monthZhi === '申' && dayBranch === '亥') || (monthZhi === '亥' && dayBranch === '申') ||
      (monthZhi === '酉' && dayBranch === '戌') || (monthZhi === '戌' && dayBranch === '酉')
    );
    const isMonthChungWithDay = (
      (monthZhi === '子' && dayBranch === '午') || (monthZhi === '午' && dayBranch === '子') ||
      (monthZhi === '丑' && dayBranch === '未') || (monthZhi === '未' && dayBranch === '丑') ||
      (monthZhi === '寅' && dayBranch === '申') || (monthZhi === '申' && dayBranch === '寅') ||
      (monthZhi === '卯' && dayBranch === '酉') || (monthZhi === '酉' && dayBranch === '卯') ||
      (monthZhi === '辰' && dayBranch === '戌') || (monthZhi === '戌' && dayBranch === '辰') ||
      (monthZhi === '巳' && dayBranch === '亥') || (monthZhi === '亥' && dayBranch === '巳')
    );
    const isMonthHapWithDay = (
      (monthZhi === '子' && dayBranch === '丑') || (monthZhi === '丑' && dayBranch === '子') ||
      (monthZhi === '寅' && dayBranch === '亥') || (monthZhi === '亥' && dayBranch === '寅') ||
      (monthZhi === '卯' && dayBranch === '戌') || (monthZhi === '戌' && dayBranch === '卯') ||
      (monthZhi === '辰' && dayBranch === '酉') || (monthZhi === '酉' && dayBranch === '辰') ||
      (monthZhi === '巳' && dayBranch === '申') || (monthZhi === '申' && dayBranch === '巳') ||
      (monthZhi === '午' && dayBranch === '未') || (monthZhi === '未' && dayBranch === '午')
    );

    if (isMonthWonjinWithDay || isMonthGwimunWithDay) {
      inversionKo = "\n\n부모님과 원진이나 귀문으로 연결되어 있네. 서로 아끼면서도 막상 같이 있으면 사소한 일로 부딪히고 감정 소모가 커서 많이 지쳤겠다. 부모님의 감정을 네가 다 받아주느라 마음고생이 많았어. 이제는 적당한 거리를 두고 네 마음부터 챙겼으면 좋겠어.";
      inversionEn = "\n\nYou are connected to your parents through Wonjin or Gwimun. Even though you care for each other, when you're actually together, you clash over trivial things and the emotional drain is exhausting. You've suffered a lot trying to absorb all your parents' emotions. Now, I hope you keep a healthy distance and take care of your own heart first.";
    } else if (isMonthHyungWithDay) {
      inversionKo = "\n\n부모님과 형(刑)의 관계가 보이네. 부모님이 바라는 모습과 네가 살고 싶은 삶이 달라서 자주 부딪히고 답답했을 거야. 널 위한다는 말이 때로는 무거운 족쇄처럼 느껴졌지? 네 잘못이 아니야. 부모님의 기대보다 네 행복이 먼저라는 걸 잊지 마.";
      inversionEn = "\n\nI see a Penalty (Hyung) relationship with your parents. You must have felt frustrated and clashed often because the image your parents want for you is different from the life you want to live. Did their words 'it's for your own good' sometimes feel like heavy shackles? It's not your fault. Don't forget that your happiness comes before your parents' expectations.";
    } else if (isMonthChungWithDay) {
      inversionKo = "\n\n부모님과 충(沖)으로 부딪히는 기운이 있어. 서로 가치관이 달라서 대화가 단절되거나 크게 다투는 일이 잦았을 텐데, 그 과정에서 네가 받았을 상처가 참 컸겠다. 하지만 이 충돌은 네가 독립적인 어른으로 성장하기 위한 자연스러운 과정이기도 해. 네 삶을 찾아가는 용기를 응원할게.";
      inversionEn = "\n\nThere's a Clashing (Chung) energy with your parents. With different values, conversations were likely cut off or you had frequent big arguments, and the scars you received in the process must have been deep. However, this clash is also a natural process for you to grow into an independent adult. I cheer for your courage to find your own life.";
    } else if (isMonthPaWithDay) {
      inversionKo = "\n\n부모님과 파(破)의 기운이 엮여 있네. 평온하다가도 갑자기 관계가 틀어지거나 오해가 생겨서 마음 졸이는 일이 많았지? 겉으로는 괜찮은 척해도 속으로 많이 외로웠을 거야. 억지로 완벽한 가족이 되려고 애쓰지 않아도 괜찮아.";
      inversionEn = "\n\nThe energy of Destruction (Pa) is intertwined with your parents. Even when things were peaceful, relationships would suddenly sour or misunderstandings would arise, causing you a lot of anxiety, right? Even if you pretended to be okay on the outside, you must have been very lonely on the inside. It's okay not to force yourself to be a perfect family.";
    } else if (isMonthHaeWithDay) {
      inversionKo = "\n\n부모님과 해(害)의 작용이 있네. 부모님의 지나친 간섭이나 걱정이 오히려 네 앞길을 막는 것처럼 느껴져서 많이 답답했겠다. 널 사랑해서 그러는 거라며 참아왔던 시간들이 얼마나 버거웠을까. 이제는 네 선택을 믿고 조금씩 선을 그어보는 연습을 해보자.";
      inversionEn = "\n\nThere's an action of Harm (Hae) with your parents. You must have felt very suffocated because your parents' excessive interference or worry felt like it was blocking your path. How burdensome must the times have been when you endured it because they said 'it's out of love'. Now, let's practice trusting your choices and drawing boundaries little by little.";
    } else if (isMonthHapWithDay) {
      inversionKo = "\n\n부모님과 합(合)으로 강하게 묶여 있네. 겉보기엔 화목해 보이지만, 사실 넌 부모님을 실망시키지 않으려고 네 진짜 마음을 많이 숨기고 참아왔을 거야. 착한 자식이 되느라 정작 널 돌보지 못한 건 아닐까? 가끔은 부모님보다 널 먼저 생각해도 괜찮아. 정말 고생 많았어.";
      inversionEn = "\n\nYou are strongly bound to your parents through Combination (Hap). It looks harmonious on the outside, but in reality, you've probably hidden your true feelings and endured a lot so as not to disappoint them. Haven't you neglected taking care of yourself while trying to be a good child? It's okay to think of yourself before your parents sometimes. You've really worked hard.";
    }

    return {
      ko: `${fictionKo}\n\n${truthKo}${inversionKo}`,
      en: `${fictionEn}\n\n${truthEn}${inversionEn}`
    };
  };

  const inversionNarrative = getInversionNarrative();
  parentsDesc = lang === 'KO' ? inversionNarrative.ko : inversionNarrative.en;

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
    if (isGanYeoJiDong) riskFactors.push(lang === 'KO' ? '[tooltip:간여지동]' : '[tooltip:Gan-yeo-ji-dong]');
    
    if (hasDayClash || hasDayPunishment) {
      // Find the specific clash/punishment involving the Day Branch (index 1)
      const dayInteraction = interactions.find(i => 
        (i.type.includes('충') || i.type.includes('형')) && 
        i.pillarIndices && i.pillarIndices.includes(1)
      );
      
      let tooltipText = lang === 'KO' ? '일지 형충' : 'Day Branch Clash/Punishment';
      if (dayInteraction && dayInteraction.note) {
        const [koNote, enNote] = dayInteraction.note.split('|');
        // Extract just the text content from the HTML note for the tooltip
        const stripHtml = (html: string) => html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ');
        const cleanKo = stripHtml(koNote);
        const cleanEn = stripHtml(enNote || koNote);
        tooltipText = `[tooltip:${tooltipText}|${cleanKo}|${cleanEn}]`;
      } else {
        tooltipText = `[tooltip:${tooltipText}]`;
      }
      riskFactors.push(tooltipText);
    }
    
    if (isSpouseInTomb) riskFactors.push(lang === 'KO' ? '[tooltip:부성/처성임묘]' : '[tooltip:Spouse Star in Tomb]');
    if (isHurtingOfficerDay) riskFactors.push(lang === 'KO' ? '일지 상관' : 'Hurting Officer on Day Branch');
    if (isJinSulChukMi) riskFactors.push(lang === 'KO' ? '[tooltip:일지 진술축미]' : '[tooltip:Earth Branch on Day]');
    if (isBaekho || isGoegang) riskFactors.push(lang === 'KO' ? '[tooltip:백호/괴강살]' : '[tooltip:White tiger star/Overload star]');
    if (isBiGyeopDaJa) riskFactors.push(lang === 'KO' ? '비겁다자' : 'Excessive Bi-gyeop');

    if (riskFactors.length >= 2) {
      spouseDesc = lang === 'KO'
        ? `배우자 운에서 주의가 필요한 신호들이 여러 개 관찰돼. 특히 [#ef4444:${riskFactors.join(', ')}] 등의 기운이 겹쳐 있어 배우자와의 관계에서 갈등이나 이별의 기운이 강할 수 있어. 이는 배우자 자리가 불안정하거나 본인의 기운이 너무 강해 배우자가 머물기 힘든 환경임을 의미해. 무조건적인 불운으로 받아들이기보다, 서로의 독립성을 존중하고 주말 부부나 각자의 전문 영역을 확실히 갖는 [#3b82f6:'[tooltip:업상대체]']를 통해 에너지를 분산시키는 지혜가 필요해.`
        : `Multiple signs requiring caution are observed in spouse luck. Specifically, the combination of [#ef4444:${riskFactors.join(', ')}] suggests potential for conflict or separation. This means the spouse palace is unstable or your own energy is too strong for a partner to settle easily. Rather than viewing it as pure misfortune, you need the wisdom to disperse this energy through [#3b82f6:"[tooltip:up-sang-dae-che]"] (career substitution) or respecting each other's independence.`;
    } else if (riskFactors.length === 1) {
      spouseDesc = lang === 'KO'
        ? `배우자 운에서 [#ef4444:${riskFactors[0]}]의 기운이 관찰돼. 배우자 자리에 변화가 잦거나 본인의 주관이 강해 충돌이 생길 수 있는 구조야. 서로의 다름을 인정하고 적절한 거리감을 유지할 때 관계가 더욱 건강해질 수 있어.`
        : `The energy of [#ef4444:${riskFactors[0]}] is observed in your spouse luck. This structure suggests frequent changes in the spouse palace or potential for conflict due to your strong subjective views. The relationship can become healthier when you acknowledge each other's differences and maintain appropriate distance.`;
    } else if (dayBranchTenGod.includes('편관')) {
      spouseDesc = lang === 'KO'
        ? `배우자 자리에 나를 통제하려는 강한 힘([${gwanCol}:편관])이 들어와 있어. 친구 같은 인연보다는 내가 존경할 수 있거나, 혹은 나를 강하게 리드하는 카리스마 있는 사람과 인연이 깊어. 서로의 주관이 뚜렷해 충돌이 잦을 수 있으니 [#3b82f6:"존중"]과 [#3b82f6:"거리두기"]가 관계 유지의 핵심이야.`
        : `A strong controlling force ([${gwanCol}:Strong Warrior force]) is in the Spouse Palace. You are drawn to charismatic partners you can respect or who lead you strongly. Since both have clear views, conflicts may be frequent; [#3b82f6:"respect"] and [#3b82f6:"personal space"] are keys to the relationship.`;
    } else if (dayBranchTenGod.includes('비견') || dayBranchTenGod.includes('겁재')) {
      spouseDesc = lang === 'KO'
        ? `배우자 자리에 나와 같은 기운([${getColor(dmElement)}:비겁])이 있어. 친구처럼 편안하고 동등한 관계를 추구하지만, 때로는 서로 양보하지 않는 고집으로 인해 갈등이 생길 수 있어. 배우자가 나의 경쟁자이자 동반자 역할을 동시에 수행하는 구조야.`
        : `[${getColor(dmElement)}:Mirror energy] is in the Spouse Palace. You pursue a comfortable, equal relationship like friends, but stubbornness can cause clashes. Your spouse acts as both a competitor and a companion.`;
    } else if (dayBranchTenGod.includes('인성')) {
      spouseDesc = lang === 'KO'
        ? `배우자 자리에 나를 돕는 기운([${inSeongCol}:인성])이 있어. 나를 어머니처럼 챙겨주거나 정신적으로 의지가 되는 사람과 인연이 깊어. 배우자의 배려와 수용 덕분에 가정에서 정서적 안정을 찾을 수 있는 복이 있어.`
        : `[${inSeongCol}:Wisdom energy] is in the Spouse Palace. You have deep ties with someone who cares for you like a mother or is mentally dependable. You find emotional stability at home thanks to your spouse's consideration.`;
    } else if (dayBranchTenGod.includes('식상')) {
      spouseDesc = lang === 'KO'
        ? `배우자 자리에 나의 에너지가 빠져나가는 기운([${artistCol}:식상])이 있어. 내가 배우자를 자식처럼 챙겨주거나, 배우자가 매우 창의적이고 표현력이 풍부한 사람일 가능성이 높아. 자녀 출산 후 배우자보다 자녀에게 집중하게 되는 경향이 있으니 주의가 필요해.`
        : `[${artistCol}:Output energy] is in the Spouse Palace. You might care for your spouse like a child, or your spouse is highly creative and expressive. Be careful as you may focus more on children than your spouse after childbirth.`;
    } else if (dayBranchTenGod.includes('재성')) {
      spouseDesc = lang === 'KO'
        ? `배우자 자리에 내가 관리하는 기운([${wealthCol}:재성])이 있어. 현실적이고 경제 관념이 뚜렷한 배우자와 인연이 깊으며, 결혼 후 재산 축적에 배우자의 도움이 커. 남성에게는 현모양처, 여성에게는 살림을 잘 돕는 남편의 형국이야.`
        : `[${wealthCol}:Maverick/Architect energy] is in the Spouse Palace. You have ties with a realistic partner with a strong sense of economy. Your spouse helps greatly in accumulating wealth after marriage. It signifies a supportive and practical partner.`;
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
    
    const hourPillar = pillars.find(p => p.title === 'Hour');
    const hourBranch = hourPillar?.branch || '';
    const hourBranchTenGod = hourPillar?.branchKoreanName || '';
    const hourStemTenGod = hourPillar?.stemKoreanName || '';
    
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
    
    const isChildStarInMonth = (gender === 'female' && (monthZhiGod.includes('식신') || monthZhiGod.includes('상관') || monthStemGod.includes('식신') || monthStemGod.includes('상관'))) ||
                               (gender === 'male' && (monthZhiGod.includes('정관') || monthZhiGod.includes('편관') || monthStemGod.includes('정관') || monthStemGod.includes('편관')));

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
    
    // 0. Gwan-Sal Hon-Jap check (Power Mixture)
    const pyeonGwanCount = (pillars?.reduce((c, p) => c + (p.stemKoreanName?.includes('편관') ? 1 : 0) + (p.branchKoreanName?.includes('편관') ? 1 : 0), 0) || 0);
    const jeongGwanCount = (pillars?.reduce((c, p) => c + (p.stemKoreanName?.includes('정관') ? 1 : 0) + (p.branchKoreanName?.includes('정관') ? 1 : 0), 0) || 0);
    const hasGwanSalHonJap = pyeonGwanCount > 0 && jeongGwanCount > 0 && (pyeonGwanCount + jeongGwanCount >= 2);
    
    if (hasGwanSalHonJap) {
      cases.push({
        title: lang === 'KO' ? '관살혼잡(官殺混雜) - 명예와 책임의 과부하' : 'Power Mixture (Gwan-Sal Hon-Jap)',
        description: lang === 'KO' 
          ? `정관(명예)과 편관(권위)이 섞여 있어 삶의 목표가 충돌하고 에너지가 분산되는 형상이야. 책임감이 너무 강해 스스로를 볶아치거나, 이성 관계 및 직장 생활에서 선택의 기로에 놓이기 쉬워. 하나를 확실히 택하거나, [${inSeongCol}:인성(Mystic/Sage)]을 통해 이 기운을 부드럽게 소화하는 게 유일한 살길이야.`
          : `Jeong-Gwan (Honor) and Pyeon-Gwan (Authority) are mixed, causing conflicting life goals and scattered energy. You may push yourself too hard due to excessive responsibility or face frequent dilemmas in relationships and career. The key is to choose one path firmly or utilize [${inSeongCol}:Wisdom (Mystic/Sage)] to handle this intensity.`,
        type: 'warning'
      });
    }

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
              ? `[${getColor(el)}:${getElementKo(el)}]의 기운이 극강한 상태에서 충(衝)이 발생했어. 이는 단순히 기운이 꺾이는 것이 아니라, 잠자던 사자를 건드린 격으로 갑작스러운 사고나 건강 악화, 혹은 감당하기 힘든 급격한 변화를 암시해. 극도로 신중한 처신이 필요해.`
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

  const isGeonRok = (monthZhi === '寅' && dayMaster === '甲') || (monthZhi === '卯' && dayMaster === '乙'); // Example
  const isYangIn = (monthZhi === '午' && dayMaster === '丙') || (monthZhi === '子' && dayMaster === '壬'); // Example

  const getLifeCycleAnalysis = () => {
    const birthDate = new Date(userInput.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    let cycleTitle = '';
    let cycleDesc = '';

    if (age < 20) {
      cycleTitle = lang === 'KO' ? '10대: 비겁의 시대 (자아 형성기)' : '10s: Era of Mirror/Rival (Self-Formation)';
      cycleDesc = lang === 'KO' 
        ? '무리를 짓고 친구들과 어울리며 자아를 형성하는 시기입니다.'
        : 'A period of forming self-identity by hanging out with peers.';
    } else if (age < 30) {
      cycleTitle = lang === 'KO' ? '20대: 식상의 시대 (자유와 도전)' : '20s: Era of Artist/Rebel (Freedom & Challenge)';
      cycleDesc = lang === 'KO'
        ? '집단에서 벗어나 개별성과 자유가 강조되며, 기존의 틀에 반항하고 자신만의 길을 찾는 시기입니다.'
        : 'A period where individuality and freedom are emphasized, rebelling against existing frameworks and finding your own path.';
    } else if (age < 40) {
      cycleTitle = lang === 'KO' ? '30대: 식상생재의 시대 (현실적 도약)' : '30s: Era of Output-Wealth (Realistic Leap)';
      cycleDesc = lang === 'KO'
        ? '미래에 대한 걱정과 경제관념이 생기며, 자신의 재능을 실질적인 결과물로 바꾸기 위해 현실적인 계산을 시작하는 시기입니다.'
        : 'A period where worries about the future and economic sense arise, starting realistic calculations to turn talents into practical outcomes.';
    } else if (age < 50) {
      cycleTitle = lang === 'KO' ? '40대: 재성의 시대 (경제적 완성)' : '40s: Era of Maverick/Architect (Economic Completion)';
      cycleDesc = lang === 'KO'
        ? '철저한 경제력과 능력 기준으로 사람을 평가하며, 자본과 안정적인 기반 구축이 중심이 되는 시기입니다.'
        : 'A period centered on capital and building a stable foundation, evaluating people based on strict economic power and ability.';
    } else if (age < 60) {
      cycleTitle = lang === 'KO' ? '50대: 관성의 시대 (사회적 지위)' : '50s: Era of Warrior/Judge (Social Status)';
      cycleDesc = lang === 'KO'
        ? '돈보다 사회적 위치, 신분, 체면이 중요해지며, 조직이나 사회에서의 자신의 역할을 공고히 하는 시기입니다.'
        : 'A period where social position, status, and reputation become more important than money, solidifying one\'s role in organization or society.';
    } else {
      cycleTitle = lang === 'KO' ? '60대 이상: 인성의 시대 (지혜와 회고)' : '60s+: Era of Mystic/Sage (Wisdom & Reflection)';
      cycleDesc = lang === 'KO'
        ? '자신의 경험을 노하우로 전환하여 어른 대접을 받고자 하며, 삶을 정리하고 지혜를 나누는 시기입니다.'
        : 'A period of converting experiences into know-how, seeking respect as an elder, and organizing life while sharing wisdom.';
    }

    // Dynamic commentary based on chart
    let dynamicCommentary = '';
    if (age >= 30 && age < 50 && (gods.JaeSeong === 0)) {
       dynamicCommentary = lang === 'KO' 
         ? '\n\n[#ef4444:현재 재성의 시기를 지나고 있으나 원국에 재성이 부족하여 경제적 현실과 이상의 괴리가 클 수 있습니다. 실질적인 목표 설정이 중요합니다.]'
         : '\n\n[#ef4444:You are passing through the Wealth era, but lacking Wealth in your chart may cause a gap between economic reality and ideals. Practical goal setting is crucial.]';
    } else if (age >= 50 && age < 60 && (gods.GwanSeong === 0 || gods.SikSang > 30)) {
       dynamicCommentary = lang === 'KO'
         ? '\n\n[#ef4444:현재 관성의 시기이나 관이 부족하거나 식상이 강해 마이웨이를 걷기 쉽습니다. 조직 내에서의 상대적 박탈감을 주의하고 자신만의 명예를 찾아보세요.]'
         : '\n\n[#ef4444:You are in the Power era, but lacking Power or having strong Output makes it easy to walk your own path. Beware of relative deprivation in organizations and find your own honor.]';
    } else if (age >= 40 && age < 50 && gods.BiGyeop > 30) {
       dynamicCommentary = lang === 'KO'
         ? '\n\n[#ef4444:재성의 시기에 비겁이 강해 재산 손실이나 가정 내 갈등이 생기기 쉬운 구조입니다. 동업이나 무리한 투자를 피하고 내실을 기하세요.]'
         : '\n\n[#ef4444:In the Wealth era, strong Mirror/Rival energy makes you prone to property loss or domestic conflict. Avoid partnerships or reckless investments and focus on inner substance.]';
    }

    return {
      title: cycleTitle,
      description: cycleDesc + dynamicCommentary,
      age
    };
  };

  const lifeCycle = getLifeCycleAnalysis();

  const personalizedInsights = {
    ...elementSpecificInsights[dmElement as keyof typeof elementSpecificInsights],
    lifeCycle: {
      ko: `[${lifeCycle.title}] ${lifeCycle.description}`,
      en: `[${lifeCycle.title}] ${lifeCycle.description}`
    }
  };

  return {
    muJaRon,
    daJaRon,
    advancedEdgeCases,
    relationshipAnalysis: getRelationshipAnalysis(),
    shinGangShinYak,
    personalizedInsights,
    dayMasterElement: dmElement,
    specialStatuses: {
      isFireEarthHeavy,
      isGoldBuried,
      isColdWater,
      isSikSangIsolated,
      isDryChart,
      isColdWet,
      isHotDry,
      isWoodHeavy,
      elementRatios,
      surplusElement,
      surplusGod,
      palaceState
    },
    specialCombinations,
    geokGukDetail: {
      geonRok: isGeonRok,
      yangIn: isYangIn,
      isSpecial: yongshinDetail?.method === '종격용신' || yongshinDetail?.method === '전왕격용신' || yongshinDetail?.method === '특수격용신',
      specialTitle: yongshinDetail?.primary?.reason?.split(' → ')[0] || '',
      description: (() => {
        if (yongshinDetail?.method === '종격용신') return lang === 'KO' ? `귀한 [${yongshinDetail.primary.reason.split(' → ')[0]}]이야. 자신의 고집을 버리고 대세의 흐름에 몸을 맡길 때 거대한 성공이 보장되는 특별한 명식이지.` : `Special Adaptive Structure [${yongshinDetail.primary.reasonEn.split(' → ')[0]}]. Great success is guaranteed when you flow with the dominant energy rather than resisting it.`;
        if (yongshinDetail?.method === '전왕격용신') return lang === 'KO' ? `강력한 [${yongshinDetail.primary.reason.split(' → ')[0]}]이야. 한 오행의 기운이 온 세상을 뒤덮은 격으로, 그 기운을 막힘없이 써야만 대업을 이룰 수 있는 영웅의 사주야.` : `Powerful Monarch Structure [${yongshinDetail.primary.reasonEn.split(' → ')[0]}]. A heroic chart where one element dominates, and success comes from following that unstoppable force.`;
        if (isGeonRok) return lang === 'KO' ? '정석적이고 바른 [건록격]이야. 스스로의 힘으로 가문을 일으키고 자수성가할 수 있는 튼튼한 기반을 가졌어.' : 'Ideal [Geon-rok] structure. You have a solid foundation to build your own legacy and succeed through self-made effort.';
        if (isYangIn) return lang === 'KO' ? '카리스마 넘치는 [양인격]이야. 남다른 경쟁심과 추진력을 가졌으나, 칼을 휘두를 땐 늘 절제가 필요함을 잊지 마.' : 'Charismatic [Yang-in] structure. You possess extraordinary competitive spirit and drive; remember that wielding such power requires constant self-control.';
        return lang === 'KO' ? '안정적인 [일반격]이야. 오행의 조력이 필요한 만큼 주변과 협조하며 차근차근 성공을 일궈가는 스타일이야.' : 'Stable [Standard] structure. You succeed by cooperating with others and building progress step-by-step as needed by your elemental balance.';
      })()
    }
  };
};
