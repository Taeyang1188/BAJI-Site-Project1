import { BaZiResult, Language } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { ELEMENT_COLORS, ELEMENT_DESCRIPTIONS } from '../constants';
import { ILJU_DESCRIPTIONS } from '../constants/ilju-descriptions';

export interface CycleVibeResult {
  intro: string;
  cycleIntro: string;
  main: string;
  glitch: string;
  luckScore: number;
  luckColor: string;
}

const CITY_META_TABLE: Record<string, { keywords: string; vibe: string; point: string }> = {
  "강릉시": { keywords: "바다, 커피, 경포대, 정동진", vibe: "낭만적인, 푸른, 여유로운", point: "푸른 파도와 커피 향" },
  "부산시": { keywords: "항구, 역동적, 마천루, 사투리", vibe: "거친, 에너제틱한, 화려한", point: "거친 파도와 도시의 소음" },
  "춘천시": { keywords: "호수, 안개, 닭갈비, 소양강", vibe: "몽환적인, 잔잔한, 서정적인", point: "안개 낀 호수와 새벽 공기" },
  "경주시": { keywords: "고분, 신라, 역사, 황리단길", vibe: "신비로운, 오래된, 정갈한", point: "천 년의 세월이 흐르는 땅" },
  "제주시": { keywords: "바람, 돌, 한라산, 이국적", vibe: "자유로운, 거친, 신비로운", point: "현무암 사이를 지나는 바람" },
  "서울": { keywords: "남산타워, 한강, 빌딩숲, 잠들지 않는 도시", vibe: "세련된, 바쁜, 화려한", point: "잠들지 않는 도시의 불빛" }
};

const formatGod = (god: string, stemOrBranch: string, lang: Language) => {
  if (lang !== 'KO') return god;
  const base = god.substring(0, 2);
  const TEN_GODS_HANJA: Record<string, string> = {
    "비견": "比肩", "겁재": "劫財", "식신": "食神", "상관": "傷官",
    "편재": "偏財", "정재": "正財", "편관": "偏관", "정관": "正官",
    "편인": "偏印", "정인": "正印"
  };
  const hanja = TEN_GODS_HANJA[base] || '';
  
  let element = '';
  if (BAZI_MAPPING.stems[stemOrBranch as keyof typeof BAZI_MAPPING.stems]) {
    element = BAZI_MAPPING.stems[stemOrBranch as keyof typeof BAZI_MAPPING.stems].element;
  } else if (BAZI_MAPPING.branches[stemOrBranch as keyof typeof BAZI_MAPPING.branches]) {
    element = BAZI_MAPPING.branches[stemOrBranch as keyof typeof BAZI_MAPPING.branches].element;
  }
  
  const color = ELEMENT_COLORS[element as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
  return `[${color}:${base}(${hanja})]`;
};

export function generateCycleVibe(
  result: BaZiResult, 
  lang: Language, 
  userName: string, 
  gender: string, 
  city: string
): CycleVibeResult {
  const analysis = result.analysis || {} as any;
  const strength = analysis.dayMasterStrength || { isStrong: false, title: '', score: 50 };
  const isSinGang = strength.isStrong || false;
  const isNeutral = strength.title ? strength.title.includes('중화') : false;
  const isSinYak = !isSinGang && !isNeutral;
  
  const tenGodsRatio = analysis.tenGodsRatio || {};
  const overflow = Object.entries(tenGodsRatio).filter(([_, r]) => (r as number) > 30).map(([k]) => k.split(' ')[0]);
  
  const currentCycle = result.grandCycles[result.currentCycleIndex] || {} as any;
  const currentAnnualPillar = result.currentYearPillar;
  
  const daewunStem = currentCycle.stem || '';
  const daewunBranch = currentCycle.branch || '';
  const daewunStemGodKo = currentCycle.stemTenGodKo || '';
  const daewunBranchGodKo = currentCycle.branchTenGodKo || '';
  
  const seunStem = currentAnnualPillar?.stem || '';
  const seunBranch = currentAnnualPillar?.branch || '';
  const seunStemGodKo = currentAnnualPillar?.stemTenGodKo || '';
  const seunBranchGodKo = currentAnnualPillar?.branchTenGodKo || '';
  
  const luckGods = [daewunStemGodKo, daewunBranchGodKo, seunStemGodKo, seunBranchGodKo];

  // Name Processing
  let processedName = userName;
  let nameRef = '';
  if (lang === 'KO') {
    if (userName && userName.length >= 2) {
      processedName = userName.length === 3 ? userName.substring(1) : userName;
      nameRef = `${processedName}는 `;
    } else {
      processedName = '당신';
      nameRef = '';
    }
  } else {
    processedName = userName || 'You';
    nameRef = `${processedName}, `;
  }

  const userRef = (() => {
    if (gender === 'prefer-not-to-tell') return lang === 'KO' ? '너' : 'you';
    if (lang === 'KO') {
      if (gender === 'female') return '언니';
      if (gender === 'male') return '친구';
      if (gender === 'non-binary') return '자기';
      return '너';
    } else {
      if (gender === 'female') return 'girl';
      if (gender === 'male') return 'guy';
      if (gender === 'non-binary') return 'star';
      return 'you';
    }
  })();

  const ilju = (result.pillars[1]?.stem || '') + (result.pillars[1]?.branch || '');
  const iljuInfo = ILJU_DESCRIPTIONS[ilju as keyof typeof ILJU_DESCRIPTIONS] || { ko: '', en: '', impression: '' };
  const iljuImpression = lang === 'KO' ? iljuInfo.impression : '';

  // 1. Intro: Birthplace Insight
  let cityInsight = '';
  if (lang === 'KO') {
    const matchedCity = Object.keys(CITY_META_TABLE).find(c => city && city.includes(c));
    if (matchedCity) {
      const meta = CITY_META_TABLE[matchedCity as keyof typeof CITY_META_TABLE];
      cityInsight = `${matchedCity}에서 태어났네? ${meta.point} 때문인지 너의 원국에서도 ${meta.vibe} 특성이 느껴지는 것 같아. `;
    } else if (city) {
      cityInsight = `${city}에서 태어났네? 그곳만의 독특한 기운이 네 사주에 스며들어 네 영혼의 색깔을 더 선명하게 만들었겠군. `;
    }
  }

  // 2. Bazi Combinations (Combos)
  const combos: { id: string; priority: number; name: string; desc: string }[] = [];
  if (lang === 'KO') {
    const hasSikSangLuck = luckGods.some(g => g === '식신' || g === '상관');
    const hasJaeSeongLuck = luckGods.some(g => g === '편재' || g === '정재');
    const hasGwanSeongLuck = luckGods.some(g => g === '편관' || g === '정관');
    const hasInSeongLuck = luckGods.some(g => g === '편인' || g === '정인');

    const hasSikSangBase = overflow.some(o => o.includes('식상')) || (tenGodsRatio['식상 (Artist/Rebel)'] as number) > 15;
    const hasJaeSeongBase = overflow.some(o => o.includes('재성')) || (tenGodsRatio['재성 (Maverick/Architect)'] as number) > 15;
    const hasGwanSeongBase = overflow.some(o => o.includes('관성')) || (tenGodsRatio['관성 (Warrior/Judge)'] as number) > 15;
    const hasInSeongBase = overflow.some(o => o.includes('인성')) || (tenGodsRatio['인성 (Mystic/Sage)'] as number) > 15;

    if (luckGods.includes('상관') && (hasInSeongBase || hasInSeongLuck)) {
      combos.push({ id: '상관패인', priority: 100, name: '상관패인(傷官佩印)', desc: `기발하고 날카로운 아이디어(상관)가 인성이라는 품격 있는 고삐를 만났어. 거친 재능이 다듬어져 세상의 인정을 받기 좋은 시기야.` });
    }
    if (luckGods.includes('식신') && (hasGwanSeongBase || hasGwanSeongLuck)) {
      combos.push({ id: '식신제살', priority: 95, name: '식신제살(食神制殺)', desc: `너를 괴롭히던 난관을 너만의 실력으로 시원하게 해결해버리는 시기야. 위기 돌파 능력이 빛을 발할 거야.` });
    }
    if (luckGods.includes('편관') && (hasInSeongBase || hasInSeongLuck)) {
      combos.push({ id: '살인상생', priority: 90, name: '살인상생(殺印相生)', desc: `강력한 난관(편관)을 지혜와 학문(인성)으로 녹여내어 오히려 큰 기회로 바꾸는 시기야. 위기를 기회로 만드는 반전의 드라마가 펼쳐질 거야.` });
    }
    if (hasSikSangLuck && (hasJaeSeongBase || hasJaeSeongLuck)) {
      combos.push({ id: '식상생재', priority: 85, name: '식상생재(食傷生財)', desc: `재능이 곧바로 결과물로 이어지는 흐름이야. 머릿속 계획들이 실질적인 성과로 변하는 생산적인 시기지.` });
    }
    if (hasGwanSeongLuck && (hasInSeongBase || hasInSeongLuck)) {
      combos.push({ id: '관인상생', priority: 80, name: '관인상생(官印상생)', desc: `조직의 혜택이나 윗사람의 끌어줌이 있는 시기야. 노력이 공식적으로 인정받고 명예가 올라가는 흐름이지.` });
    }
    if (hasJaeSeongLuck && (hasInSeongBase || hasInSeongLuck)) {
      combos.push({ id: '재극인', priority: 70, name: '재극인(財剋印)', desc: `현실적인 이익과 신념이 충돌하고 있어. 당장의 이익 때문에 소중한 가치를 버리지 않게 조심해.` });
    }
    if (hasGwanSeongLuck && (hasJaeSeongBase || hasJaeSeongLuck)) {
      combos.push({ id: '재생관', priority: 60, name: '재생관(財生官)', desc: `쌓아온 자산이나 노력이 사회적 지위로 연결되는 흐름이야. 내실을 다져 더 높은 곳으로 올라갈 발판을 마련하게 될 거야.` });
    }

    combos.sort((a, b) => b.priority - a.priority);
    if (combos.length > 2) combos.splice(2);
  }

  let comboInsight = '';
  if (combos.length > 0) {
    if (combos.length === 1) {
      comboInsight = `이번 시기는 **'${combos[0].name}'**의 격을 갖췄어. ${combos[0].desc}`;
    } else {
      comboInsight = `**'${combos[0].name}'**의 흐름이 주도적이지만, 동시에 **'${combos[1].name}'**의 영향도 무시할 수 없어. \n\n${combos[0].desc} ${combos[1].desc}`;
    }
  }

  // 3. Intro Construction
  let intro = '';
  if (lang === 'KO') {
    const elementRatios = analysis.elementRatios || {};
    const sortedElements = Object.entries(elementRatios).sort((a, b) => (b[1] as number) - (a[1] as number));
    const maxVal = sortedElements.length > 0 ? (sortedElements[0][1] as number) : 0;
    
    const dominantElement = sortedElements.length > 0 ? sortedElements[0][0] : 'Wood';
    
    let strengthComment = '';
    if (isSinGang) {
      strengthComment = '에너지가 꽤 넘치는 편이네? 주관이 뚜렷하고 밀어붙이는 힘이 느껴져.';
    } else if (isNeutral) {
      strengthComment = '에너지가 아주 균형 잡혀 있네. 상황에 따라 유연하게 대처하면서도 자기 중심을 잘 잡는 스타일이야.';
    } else {
      strengthComment = '섬세하고 차분한 에너지가 느껴져. 주변의 흐름을 잘 읽고 세밀하게 반응하는 감각이 있네.';
    }

    const isGeukYak = (strength.title && strength.title.includes('극약')) || (strength.score && strength.score < 20);
    const hasHeavyGwan = (tenGodsRatio['관성 (Warrior/Judge)'] as number) > 25;
    
    if (isGeukYak && hasHeavyGwan) {
      strengthComment = `${processedName} 님은 책임감(관성)은 태산 같은데 내 몸(일간)은 작은 언덕인 상태네. "책임감이라는 무게를 견디느라 그동안 얼마나 고단했겠어"라는 말이 먼저 나오네..`;
    }
    
    const desc = ELEMENT_DESCRIPTIONS[dominantElement as keyof typeof ELEMENT_DESCRIPTIONS];
    const randomComment = desc?.comments[Math.floor(Math.random() * (desc?.comments.length || 1))] || '';
    
    let elementComment = '';
    if (isNeutral && maxVal <= 30) {
      elementComment = `오행이 어느 한쪽으로 치우치지 않고 골고루 섞여 있네. 이런 중화된 사주는 삶의 굴곡이 적고 어떤 상황에서도 유연하게 대처하는 힘이 있지. 참 안정적인 에너지야.`;
    } else {
      elementComment = randomComment;
    }
    
    const impression = iljuImpression.replace('너만의', `${processedName}만의`);
    
    intro = `${cityInsight}흠.. ${impression} \n게다가 ${strengthComment} \n\n${elementComment} \n\n이런 다양한 매력이 더해지면 ${nameRef}너만의 색깔이 뚜렷할 거야 분명히. \n\n이번에는 대운과 세운의 흐름을 좀 볼까? 보채지는 말아줘`;
  } else {
    // English Intro (Simplified)
    intro = `Your Day pillar indicates yourself. ${iljuInfo.en} Plus, you have ${isSinGang ? 'plenty of' : isNeutral ? 'balanced' : 'delicate'} energy. Your unique color will definitely shine. \n\nLet's look at your cycles. Don't rush me.`;
  }

  // 4. Cycle Intro Construction
  let cycleIntro = '';
  const daewunElement = BAZI_MAPPING.stems[daewunStem as keyof typeof BAZI_MAPPING.stems]?.element || '';
  const seunElement = BAZI_MAPPING.stems[seunStem as keyof typeof BAZI_MAPPING.stems]?.element || '';
  const daewunColor = ELEMENT_COLORS[daewunElement as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
  const seunColor = ELEMENT_COLORS[seunElement as keyof typeof ELEMENT_COLORS] || '#FFFFFF';

  if (lang === 'KO') {
    cycleIntro = `\n\n요번 ${currentAnnualPillar?.year || new Date().getFullYear()}년도는... [#${daewunColor.replace('#', '')}:${daewunStem}(${currentCycle.stem || ''})] 대운과 [#${seunColor.replace('#', '')}:${seunStem}(${currentAnnualPillar?.stem || ''})] 세운이 만나는 시기네! [delay:4000]\n\n`;
  } else {
    cycleIntro = `\n\nThis cycle is a mix of Life season and Annual alignment... [delay:4000]\n\n`;
  }
  
  // 5. Main Construction
  let main = '';
  if (lang === 'KO') {
    main = `음, ${userRef}한테는 대운에서 ${formatGod(daewunStemGodKo, daewunStem, lang)}·${formatGod(daewunBranchGodKo, daewunBranch, lang)}, 그리고 세운에서 ${formatGod(seunStemGodKo, seunStem, lang)}·${formatGod(seunBranchGodKo, seunBranch, lang)}의 기운이 스며들고 있네. `;
    
    if (comboInsight) {
      let detailedEffect = '';
      const yongshinDetail = analysis.yongshinDetail || { primary: { element: '' }, heeShin: { element: '' }, giShin: { element: '' } };
      const primaryElement = yongshinDetail.primary?.element || '';
      const heeShinElement = yongshinDetail.heeShin?.element || '';
      
      const isYongShinYear = (primaryElement && primaryElement.includes(seunElement)) || 
                             (heeShinElement && heeShinElement.includes(seunElement));
      
      if (isSinGang) {
        detailedEffect += `넘치는 에너지를 통제하거나 발산할 강력한 통로가 필요한 시점이야. `;
      } else if (isNeutral) {
        detailedEffect += `이미 균형이 잘 잡힌 상태라, 들어오는 기운들을 아주 효율적으로 활용할 수 있겠어. `;
      } else {
        if (isYongShinYear) {
          detailedEffect += `에너지가 섬세한 편이지만, 이번 운에서 들어오는 기운들이 든든한 버팀목이 되어주고 있어. `;
        } else {
          detailedEffect += `에너지가 섬세한 편이라 들어오는 기운들이 다소 버거울 수 있어. 실속을 챙기는 게 우선이야. `;
        }
      }

      // Special 2026 Fire Year Logic
      if (seunElement === 'Fire' && currentAnnualPillar?.year === 2026) {
        if (isYongShinYear) {
          detailedEffect += `특히 2026년의 뜨거운 태양은 그동안 정체되었던 일들을 시원하게 뚫어줄 거야. 네 아이디어가 드디어 '공인된 문서'나 '자격'으로 변하는 시기니, 겁먹지 말고 그 기운을 온전히 타도 좋아. `;
        } else if (isSinGang) {
          detailedEffect += `2026년의 강한 화(Fire) 기운은 너의 열정을 더욱 부채질하겠지만, 자칫 과열되어 주변과 마찰이 생길 수 있으니 속도 조절이 필요해. `;
        }
      }

      const comboIds = combos.map(c => c.id);
      if (comboIds.includes('상관패인')) detailedEffect += `상관의 발산하는 힘을 인성이 세련되게 통제해주고 있네. `;
      if (comboIds.includes('식상생재')) detailedEffect += `식상이 재성으로 이어지는 흐름이라 결과물이 쏠쏠하겠어. `;
      if (comboIds.includes('재극인')) detailedEffect += `다만 돈 욕심이 앞서면 공들여 쌓은 커리어를 건드릴 수 있어. `;
      if (comboIds.includes('관인상생')) detailedEffect += `조직의 보호 아래서 가치를 증명하기 좋아. `;
      
      main += `\n\n${comboInsight}\n\n${detailedEffect}`;
    } else {
      // No combo logic
      const dominantLuckElement = daewunElement;
      const elementAdvice: Record<string, string> = {
        'Wood': '성장과 확장의 기운이 강해지는 시기야. 새로운 프로젝트를 시작하기 좋겠어.',
        'Fire': '열정과 에너지가 솟구치는 때네. 네 존재감을 드러낼 기회가 많아질 거야.',
        'Earth': '안정과 내실을 기하는 흐름이야. 기반을 튼튼히 다지는 게 이득이지.',
        'Metal': '결실과 정리가 필요한 시점이야. 핵심적인 성과에 집중해봐.',
        'Water': '지혜와 유연함이 필요한 시기네. 내면의 깊이를 더하는 쪽으로 방향을 잡아봐.'
      };
      main += elementAdvice[dominantLuckElement] || `원국의 균형을 크게 흔들지 않으면서도 적절한 자극이 되어주는 운이야. `;
    }
  } else {
    main = `For you, it brings a combination of ${daewunStemGodKo}/${daewunBranchGodKo} and ${seunStemGodKo}/${seunBranchGodKo} energy. `;
  }

  // 6. Luck Score Calculation
  let luckScore = 50; 
  const yongshinDetail = analysis.yongshinDetail || { primary: { element: '' }, heeShin: { element: '' }, giShin: { element: '' } };
  const primaryElement = yongshinDetail.primary?.element || '';
  const heeShinElement = yongshinDetail.heeShin?.element || '';
  const giShinElement = yongshinDetail.giShin?.element || '';
  
  if (primaryElement && primaryElement.includes(daewunElement)) luckScore += 15;
  if (heeShinElement && heeShinElement.includes(daewunElement)) luckScore += 10;
  if (giShinElement && giShinElement.includes(daewunElement)) luckScore -= 10;

  if (primaryElement && primaryElement.includes(seunElement)) luckScore += 10;
  if (heeShinElement && heeShinElement.includes(seunElement)) luckScore += 5;
  if (giShinElement && giShinElement.includes(seunElement)) luckScore -= 5;
  
  const interactions = analysis.interactions || [];
  const luckInteractions = interactions.filter((i: any) => 
    (i.note && i.note.includes(daewunStem)) || (i.note && i.note.includes(daewunBranch)) || 
    (i.note && i.note.includes(seunStem)) || (i.note && i.note.includes(seunBranch))
  );
  luckScore -= luckInteractions.length * 3;
  
  luckScore = Math.max(10, Math.min(95, luckScore));

  // 7. Glitch (Final Advice)
  let glitch = '';
  if (lang === 'KO') {
    const isFireYear = seunElement === 'Fire';
    const isWaterYear = seunElement === 'Water';
    const isWoodYear = seunElement === 'Wood';
    const isMetalYear = seunElement === 'Metal';
    const isEarthYear = seunElement === 'Earth';

    if (luckScore >= 75) {
      glitch = `운의 흐름이 워낙 강력하고 매끄러워서 큰 걱정은 없겠어. 다만 너무 잘 풀린다고 방심하다가 사소한 디테일을 놓칠 수 있으니, 그 부분만 살짝 신경 써줘. `;
    } else if (luckScore >= 45) {
      glitch = `운의 흐름이 비교적 매끄러운 편이지만, 네 페이스를 잃지 않는 게 중요해. 주변 소음보다는 네 내면의 목소리에 더 집중해봐. `;
    } else {
      // Low luck score - refined logic
      if (isFireYear) {
        glitch = `기운은 뜨겁게 타오르는데 네가 그 열기를 다 소화하지 못하고 있어. 겉으로만 화려해 보이고 실속이 없을 수 있으니, 에너지를 분산시키지 말고 한 곳에 집중해봐. `;
      } else if (isWaterYear) {
        glitch = `전체적으로 기운이 깊고 차분하게 가라앉아 있는 시기야. 억지로 뭔가를 바꾸려 하기보다, 지금 가진 걸 지키면서 내면의 지혜를 쌓는 쪽으로 방향을 잡아봐. `;
      } else if (isWoodYear) {
        glitch = `새로운 싹을 틔우려는데 주변 환경이 다소 척박하네. 조급하게 성과를 내려고 하면 뿌리가 상할 수 있으니, 시간을 두고 천천히 성장한다는 마음가짐이 필요해. `;
      } else if (isMetalYear) {
        glitch = `기운이 날카롭고 긴장감이 도는 시기야. 주변과 마찰이 생기기 쉬우니 언행을 조심하고, 불필요한 고집은 내려놓는 게 좋겠어. `;
      } else {
        glitch = `기운이 다소 무겁고 정체된 느낌이야. 무리한 확장보다는 내실을 다지고, 주변 정리를 통해 새로운 기운이 들어올 자리를 만드는 게 우선이야. `;
      }
    }
  } else {
    glitch = `The flow is ${luckScore >= 70 ? 'strong' : 'moderate'}. Stay focused on your inner voice.`;
  }

  return {
    intro,
    cycleIntro,
    main,
    glitch,
    luckScore,
    luckColor: luckScore >= 70 ? '#00F2FF' : luckScore >= 40 ? '#FFD700' : '#FF1493'
  };
}
