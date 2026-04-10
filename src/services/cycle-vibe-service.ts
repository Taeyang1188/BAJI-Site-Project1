import { BaZiResult, Language } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { ELEMENT_COLORS, ELEMENT_DESCRIPTIONS } from '../constants';
import { ILJU_DESCRIPTIONS } from '../constants/ilju-descriptions';

export interface ThemeOption {
  id: string;
  title: string;
  question: string;
  priority: number;
}

export interface CycleVibeResult {
  intro: string;
  questionPrompt: string;
  themes: ThemeOption[];
  themeAnalyses: Record<string, { main: string; glitch: string; nextHook?: { text: string; themeId: string } }>;
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
  city: string,
  interactionsData?: { maritalStatus?: string | null; hasChildren?: boolean | null }
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

  // Frozen Chart Detection (Jo-hu Priority)
  const elementRatios = analysis.elementRatios || {};
  const waterRatio = elementRatios['Water'] || 0;
  const metalRatio = elementRatios['Metal'] || 0;
  const monthZhi = result.pillars[2]?.branch || '';
  const isFrozen = (waterRatio + metalRatio > 50) && ['丑', '子', '亥'].includes(monthZhi);

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

  const daewunElement = BAZI_MAPPING.stems[daewunStem as keyof typeof BAZI_MAPPING.stems]?.element || '';
  const seunElement = BAZI_MAPPING.stems[seunStem as keyof typeof BAZI_MAPPING.stems]?.element || '';

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
    const isJeonWang = analysis.yongshinDetail?.method === "전왕격용신" || analysis.yongshinDetail?.method === "특수격용신";
    const isFireExtreme = (analysis.elementRatios?.Fire || 0) >= 60;
    const is2026 = currentAnnualPillar?.year === 2026;
    const isFireLuck = seunElement === 'Fire' || daewunElement === 'Fire';

    if (isFrozen && isFireLuck) {
      comboInsight = `이번 시기는 **'해동(解凍)'**의 기적 같은 흐름이야. 차갑게 얼어붙어 있던 네 원국이 따뜻한 불을 만나 비로소 녹기 시작하고 있어. 관인상생이나 재극인 같은 복잡한 이론보다, "냉동실에서 나온 보석이 태양을 만나 빛나는 형국"이라는 점에 집중해.`;
    } else if (isJeonWang && isFireExtreme && is2026 && combos.some(c => c.id === '상관패인')) {
      comboInsight = `이번 시기는 **'화다금용(火多金鎔)'**의 위태로운 흐름이야. 네 넘치는 생각이 실질적인 재능(상관)을 녹여버리고 있어. 머리만 쓰지 말고 손을 움직여 결과물을 굳혀야 해.`;
    } else if (combos.length === 1) {
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
    const isGeukGang = strength.level === '극강';
    
    if (isGeukGang) {
      strengthComment = '에너지가 정말 압도적이네. 누구의 간섭도 허용하지 않는 강력한 주체성이 느껴져.';
    } else if (isSinGang) {
      strengthComment = '주관이 뚜렷하고 밀어붙이는 힘이 느껴져.';
    } else if (isNeutral) {
      strengthComment = '에너지가 아주 균형 잡혀 있네. 상황에 따라 유연하게 대처하면서도 자기 중심을 잘 잡는 스타일이야.';
    } else {
      strengthComment = '섬세하고 차분한 에너지가 느껴져. 주변의 흐름을 잘 읽고 세밀하게 반응하는 감각이 있네.';
    }

    const isGeukYak = (strength.title && strength.title.includes('극약')) || (strength.score && strength.score < 20);
    const hasHeavyGwan = (tenGodsRatio['관성 (Warrior/Judge)'] as number) > 25;
    
    if (isGeukYak && hasHeavyGwan) {
      strengthComment = `${processedName} 너는 책임감(관성)은 태산 같은데 내 몸(일간)은 작은 언덕인 상태네. "책임감이라는 무게를 견디느라 그동안 얼마나 고단했겠어"라는 말이 먼저 나오네..`;
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
    
    const isJeonWang = analysis.yongshinDetail?.method === "전왕격용신" || analysis.yongshinDetail?.method === "특수격용신";
    const isFireExtreme = (analysis.elementRatios?.Fire || 0) >= 60;
    
    // Balance Warnings Integration
    let balanceComment = '';
    const balanceWarnings = analysis.balanceWarnings || [];
    if (balanceWarnings.length > 0) {
      const primaryWarning = balanceWarnings[0];
      balanceComment = `\n\n특히 ${processedName} 너는 **'${primaryWarning.title}'**의 기운이 강하게 느껴져. ${primaryWarning.description} `;
    }

    intro = `${cityInsight}흠.. ${impression} \n게다가 ${strengthComment} \n\n${elementComment} ${balanceComment} \n\n이런 다양한 매력이 더해지면 ${nameRef}너만의 색깔이 뚜렷할 거야 분명히.`;
  } else {
    // English Intro (Simplified)
    const isFireEarthTurbid = analysis.yongshinDetail?.method === "특수격용신" && analysis.structureDetail?.title === "화토중탁";
    let enCityGreeting = '';
    if (city) {
      enCityGreeting = `Born in ${city}? That's quite a vibe. `;
    }
    
    let enSpecialGreeting = '';
    if (isFireEarthTurbid) {
      enSpecialGreeting = `Your chart has a unique 'Fire-Earth Heavy-Turbid' structure—dry, intense, and powerful. `;
    }

    intro = `${enCityGreeting}Hmm.. ${iljuInfo.en} ${enSpecialGreeting}Plus, you have ${isSinGang ? 'plenty of' : isNeutral ? 'balanced' : 'delicate'} energy. Your unique color will definitely shine.`;
  }

  // 4. Cycle Intro Construction
  let cycleIntro = '';
  const daewunColor = ELEMENT_COLORS[daewunElement as keyof typeof ELEMENT_COLORS] || '#FFFFFF';
  const seunColor = ELEMENT_COLORS[seunElement as keyof typeof ELEMENT_COLORS] || '#FFFFFF';

  if (lang === 'KO') {
    cycleIntro = `\n\n요번 ${currentAnnualPillar?.year || new Date().getFullYear()}년도는... `;
  } else {
    cycleIntro = `\n\nThis cycle is a mix of your Life Season and the Annual alignment... [delay:4000]\n\n`;
  }
  
  // 5. Main Construction
  let main = '';
  const TEN_GODS_EN: Record<string, string> = {
    "비견": "The Mirror", "겁재": "The Rival", "식신": "The Artist", "상관": "The Rebel",
    "편재": "The Maverick", "정재": "The Architect", "편관": "The Warrior", "정관": "The Judge",
    "편인": "The Mystic", "정인": "The Sage"
  };

  if (lang === 'KO') {
    main = `음, ${userRef}한테는 대운에서 ${formatGod(daewunStemGodKo, daewunStem, lang)}·${formatGod(daewunBranchGodKo, daewunBranch, lang)}, 그리고 세운에서 ${formatGod(seunStemGodKo, seunStem, lang)}·${formatGod(seunBranchGodKo, seunBranch, lang)}의 기운이 스며들고 있네. [delay:4000]\n\n`;
    
    if (comboInsight) {
      let detailedEffect = '';
      const yongshinDetail = analysis.yongshinDetail || { primary: { element: '' }, heeShin: { element: '' }, giShin: { element: '' } };
      const primaryElement = yongshinDetail.primary?.element || '';
      const heeShinElement = yongshinDetail.heeShin?.element || '';
      
      const isYongShinYear = (primaryElement && primaryElement.includes(seunElement)) || 
                             (heeShinElement && heeShinElement.includes(seunElement));
      
      const isFireExtreme = (analysis.elementRatios?.Fire || 0) >= 60;
      const is2026 = currentAnnualPillar?.year === 2026;
      const isFireLuck = seunElement === 'Fire' || daewunElement === 'Fire';

      if (isFrozen && isFireLuck) {
        detailedEffect += `그동안 굳어있던 네 문서(인성)와 결과물(재성)이 드디어 가치를 발휘하기 시작할 거야. "커리어를 건드린다"는 식의 겁주는 말은 잊어버려. 지금은 돈이 되는 문서를 잡고, 차가운 뚝심이 세상의 빛을 보아 에너지가 폭발하는 시기니까. `;
      } else if (isSinGang && !isFireExtreme) {
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
        const isFireExtreme = (analysis.elementRatios?.Fire || 0) >= 60;
        const hasOhBranch = result.pillars.some(p => p.branch === '午');
        const hasByeongStem = result.pillars.some(p => p.stem === '丙');
        const isBokEum = hasByeongStem && hasOhBranch;
        const isJaHyeong = hasOhBranch;

        if (isFireExtreme) {
          detailedEffect += `2026년의 병오(丙午)라는 거대한 불기둥은 너에게 '열정'이라기보다 '과열'에 가까운 압박으로 다가올 거야. `;
          if (isBokEum) {
            detailedEffect += `특히 네 원국과 똑같은 기운이 들어오는 **'복음(伏吟)'**의 해라, 엎드려 울 일이 생길 만큼 자기 확신이 독이 될 수 있어. `;
          } else if (isJaHyeong) {
            detailedEffect += `스스로를 옥죄는 **'자형(自刑)'**의 기운이 겹치니, 네 고집이 결국 너를 찌르는 칼날이 되지 않게 조심해야 해. `;
          }
        } else if (isYongShinYear) {
          detailedEffect += `특히 2026년의 뜨거운 태양은 그동안 정체되었던 일들을 시원하게 뚫어줄 거야. 네 아이디어가 드디어 '공인된 문서'나 '자격'으로 변하는 시기니, 겁먹지 말고 그 기운을 온전히 타도 좋아. `;
        } else if (isSinGang) {
          detailedEffect += `2026년의 강한 화(Fire) 기운은 너의 열정을 더욱 부채질하겠지만, 자칫 과열되어 주변과 마찰이 생길 수 있으니 속도 조절이 필요해. `;
        }
      }

      const comboIds = combos.map(c => c.id);
      if (comboIds.includes('상관패인')) {
        const fireRatio = analysis.elementRatios?.Fire || 0;
        const hasMetalSangGwan = (seunBranch === '酉' || seunBranch === '申' || (tenGodsRatio['식상 (Artist/Rebel)'] as number) > 10);
        
        if (fireRatio > 60 && hasMetalSangGwan) {
          detailedEffect += `사람들은 이걸 보고 **'상관패인'**이라며 네 기발한 재능이 고삐를 만났다고 축복할지 몰라. 하지만 내가 보기엔 글쎄... 지금 네 재능(상관)은 너무 뜨거운 불길(인성) 속에 던져진 작은 칼날 같아. 날카롭게 빛나야 할 네 아이디어가 강렬한 화기운에 녹아내리는 **'화다금용(火多金鎔)'**의 형국이지. \n\n2026년의 병오(丙午)라는 거대한 불기둥은 네 열정을 부채질하겠지만, 그건 '열정'이라기보다 '과열'에 가까워. 자칫하면 네가 가진 기술이나 재능이 고집과 감정에 휘말려 형태도 없이 사라질 수 있어. \n\n그리고.. 이건 아주 위험한 도박이 될수도 있어. 억지로 무언가를 발산하려고 하지 마. 지금은 상관의 힘을 휘두를 때가 아니라, 그 뜨거운 불길 속에서 네 자신을 지켜내는 **'디펜스'**가 최우선이야. 불길이 너를 태우지 않도록 차갑게 식히는 데만 집중해. 조급해지는 순간, 네 보석 같은 재능은 녹아버릴 테니까. 명심해, 태양도 너무 뜨거우면 스스로를 태우는 법이야. `;
        } else if (!isFireExtreme) {
          detailedEffect += `상관의 발산하는 힘을 인성이 세련되게 통제해주고 있네. `;
        }
      }
      if (comboIds.includes('식상생재')) detailedEffect += `식상이 재성으로 이어지는 흐름이라 결과물이 쏠쏠하겠어. `;
      if (comboIds.includes('재극인')) {
        if (!isFrozen) {
          detailedEffect += `다만 돈 욕심이 앞서면 공들여 쌓은 커리어를 건드릴 수 있어. `;
        }
      }
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
    const daewunStemEN = TEN_GODS_EN[daewunStemGodKo] || daewunStemGodKo;
    const daewunBranchEN = TEN_GODS_EN[daewunBranchGodKo] || daewunBranchGodKo;
    const seunStemEN = TEN_GODS_EN[seunStemGodKo] || seunStemGodKo;
    const seunBranchEN = TEN_GODS_EN[seunBranchGodKo] || seunBranchGodKo;

    main = `For you, it brings a combination of ${daewunStemEN}/${daewunBranchEN} and ${seunStemEN}/${seunBranchEN} energy. [delay:4000]\n\n`;
    
    const isFireLuck = seunElement === 'Fire' || daewunElement === 'Fire';
    const isFireEarthTurbid = analysis.yongshinDetail?.method === "특수격용신" && analysis.structureDetail?.title === "화토중탁";
    const luckScore = analysis.luckScore || 50;
    const is2026 = currentAnnualPillar?.year === 2026;

    if (isFrozen && isFireLuck) {
      main += `This is a miracle of 'Thawing'. Your frozen chart is finally meeting the warm Fire and beginning to melt. Focus on the fact that "a gem from the freezer meets the sun and shines." Forget about standard theories; your cold persistence is finally seeing the light of day. `;
    } else if (isFireEarthTurbid) {
      main += `Since your chart is already heavy with Fire and Earth, this cycle's energy might feel a bit dry. Stay hydrated and focus on keeping your cool. `;
      if (is2026 && seunElement === 'Fire') {
        main += `Especially in 2026, the intense Fire might lead to overheating. Prioritize cooling down and protecting your core. `;
      }
    } else {
      const conjunction = luckScore >= 60 ? "And" : "But..";
      main += `${conjunction} the flow is ${luckScore >= 70 ? 'strong' : 'moderate'}. Stay focused on your inner voice. `;
    }
    
    if (luckScore >= 70) {
      main += `You're in a great position to push forward with your plans. `;
    } else if (luckScore < 40) {
      main += `It's a time for reflection rather than aggressive action. `;
    }
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
  
  const allInteractions = analysis.interactions || [];
  const luckInteractions = allInteractions.filter((i: any) => 
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

    const isFireExtreme = (analysis.elementRatios?.Fire || 0) >= 60;

    if (luckScore >= 75) {
      const is2026 = currentAnnualPillar?.year === 2026;
      
      if (isFireExtreme && is2026) {
        glitch = `복음과 자형이 겹치는 잔혹한 시기야. 에너지가 과열되어 스스로를 태울 수 있으니 철저히 자신을 낮춰야 해. `;
      } else {
        glitch = `운의 흐름이 워낙 강력하고 매끄러워서 큰 걱정은 없겠어. 다만 너무 잘 풀린다고 방심하다가 사소한 디테일을 놓칠 수 있으니, 그 부분만 살짝 신경 써줘. `;
      }
    } else if (luckScore >= 45) {
      const isJeonWang = analysis.yongshinDetail?.method === "전왕격용신" || analysis.yongshinDetail?.method === "특수격용신";
      const isFireJeonWang = isJeonWang && (analysis.yongshinDetail?.primary?.element === 'Fire' || analysis.yongshinDetail?.primary?.element?.includes('Fire'));
      
      if (isFireJeonWang && isWaterYear) {
        glitch = `**왕신충발(旺神衝發)** 주의. 거대한 변화가 예상돼. 감당할 수 없는 수준의 환경 변화와 건강 관리가 필수야. 변화를 거부하지 말고, 기존의 고집(인성)을 버리고 철저히 현실(재성)의 논리를 따를 때만 살아남아 성공할 수 있어. `;
      } else if (!isFireExtreme) {
        glitch = `운의 흐름이 비교적 매끄러운 편이지만, 네 페이스를 잃지 않는 게 중요해. 주변 소음보다는 네 내면의 목소리에 더 집중해봐. `;
      } else {
        glitch = `에너지가 임계치를 넘나드는 시기야. 무리한 확장보다는 내실을 기하며 폭풍이 지나가길 기다리는 지혜가 필요해. `;
      }
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

  // 7. Theme-based Analysis Logic
  const themeAnalyses: Record<string, { main: string; glitch: string; nextHook?: { text: string; themeId: string } }> = {};
  const themeScores: Record<string, number> = { romance: 0, wealth: 0, health: 0, secrets: 0, moving: 0 };

  // --- Theme 1: Romance (심연의 이끌림) ---
  const analyzeRomance = () => {
    let score = 50;
    let text = '';
    const isFemale = gender === 'female';
    const isMale = gender === 'male';
    const marital = interactionsData?.maritalStatus;
    const children = interactionsData?.hasChildren;
    
    const hasTargetLuck = isFemale ? (luckGods.some(g => g.includes('관성'))) : isMale ? (luckGods.some(g => g.includes('재성'))) : true;
    const hasSikSangLuck = luckGods.some(g => g.includes('식상'));
    
    if (hasTargetLuck || hasSikSangLuck) score += 20;
    
    const dayBranch = result.pillars[1].branch;
    const dayBranchInteractions = allInteractions.filter((i: any) => i.note.includes(dayBranch) && (i.note.includes(daewunBranch) || i.note.includes(seunBranch)));
    
    const hasHap = dayBranchInteractions.some((i: any) => i.type.includes('합'));
    const hasChung = dayBranchInteractions.some((i: any) => i.type.includes('충'));
    const hasWonjin = dayBranchInteractions.some((i: any) => i.type.includes('원진'));

    // Contextual prefix based on marital status
    if (marital === '기혼') {
      text += lang === 'KO' ? `이미 가정을 이룬 상태구나. ` : `You are already married. `;
      if (hasHap) {
        text += lang === 'KO' ? `안방에 합이 들어오니 배우자와의 관계가 더 돈독해지거나, 집안에 경사가 생길 수 있어. ` : `With a combination in your spouse palace, your relationship will deepen, or there might be good news at home. `;
      } else if (hasChung || hasWonjin) {
        text += lang === 'KO' ? `하지만 안방이 흔들리거나 원진이 끼어있네. 사소한 오해가 큰 싸움으로 번지지 않게 서로 배려가 필요한 시기야. ` : `However, your spouse palace is shaken or has a resentment interaction. Be careful not to let small misunderstandings turn into big fights. `;
      } else {
        text += lang === 'KO' ? `큰 파도 없이 안정적인 흐름이야. ` : `It's a stable flow without major waves. `;
      }
      
      if (children) {
        text += lang === 'KO' ? `아이들과 함께하는 시간에서 큰 에너지를 얻겠어. ` : `You will gain great energy from spending time with your children. `;
      }
    } else if (marital === '돌싱') {
      text += lang === 'KO' ? `새로운 시작을 꿈꾸고 있네. ` : `You are dreaming of a new beginning. `;
      if (hasHap || hasTargetLuck) {
        text += lang === 'KO' ? `과거의 아픔을 씻어줄 새로운 인연의 기운이 강하게 들어오고 있어. 이번엔 좀 더 신중하게 마음을 열어봐. ` : `A strong energy of a new connection that will wash away past pain is coming in. Open your heart a bit more carefully this time. `;
      } else {
        text += lang === 'KO' ? `지금은 누군가를 만나기보다 자신을 먼저 돌보는 게 우선이야. ` : `Right now, taking care of yourself is more important than meeting someone new. `;
      }
    } else {
      // Single or Private
      if (hasHap) {
        score += 30;
        text += lang === 'KO' ? `내 안방(일지)의 문이 활짝 열리는 시기야. 깊은 관계가 진전되거나 결혼, 동거 같은 실질적인 결합이 일어나기 좋지. ` : `The door to your spouse palace is wide open. It's a good time for deep relationships to progress or for practical unions like marriage or cohabitation. `;
      } else if (hasChung) {
        score += 10;
        text += lang === 'KO' ? `기존의 관계가 깨지거나, 갑작스럽고 불안정한 인연이 들이닥칠 수 있어. 폭풍 같은 연애가 예상되네. ` : `Existing relationships might break, or sudden, unstable connections might rush in. Expect a stormy romance. `;
      } else if (hasWonjin) {
        score -= 10;
        text += lang === 'KO' ? `끌리지만 괴로운, 지독한 애증의 인연이 시작될 수 있어. 마음을 다치지 않게 조심해야 해. ` : `A toxic, love-hate relationship that you're drawn to might begin. Be careful not to get your heart broken. `;
      }
    }

    if (isFrozen && (daewunElement === 'Fire' || seunElement === 'Fire')) {
      score += 20;
      text += lang === 'KO' ? `얼어붙은 네 마음을 녹여줄 온기 같은 사람이 나타날 거야. 이건 단순한 연애가 아니라 생존을 위한 이끌림이지. ` : `Someone with warmth who will melt your frozen heart will appear. This isn't just romance; it's an attraction for survival. `;
    }

    const main = lang === 'KO' ? 
      `음, ${userRef}의 애정운을 보니... ${text || '평온한 흐름 속에 잔잔한 인연이 스며드는 시기야.'} [delay:3000]\n\n인연의 무게를 견딜 준비가 됐어?` :
      `Looking at your romance... ${text || 'It is a period of calm and steady connections.'} [delay:3000]\n\nAre you ready to bear the weight of connection?`;
    
    const glitch = lang === 'KO' ? 
      (score >= 70 ? '인연의 끈이 팽팽하게 당겨지고 있어. 기회를 놓치지 마.' : '지금은 누군가를 찾기보다 네 내면의 평화를 먼저 찾는 게 이득이야.') :
      (score >= 70 ? 'The string of fate is pulling tight. Don\'t miss the chance.' : 'It\'s better to find your inner peace first rather than looking for someone else.');

    return { main, glitch };
  };

  // --- Theme 2: Wealth (황금의 그림자) ---
  const analyzeWealth = () => {
    const hasOriginalJae = Object.entries(tenGodsRatio).some(([k, v]) => k.includes('재성') && (v as number) > 0);
    const hasOriginalBiGyeop = Object.entries(tenGodsRatio).some(([k, v]) => k.includes('비겁') && (v as number) > 0);
    
    const hasPyunJae = luckGods.some(g => g.includes('편재'));
    const hasJungJae = luckGods.some(g => g.includes('정재'));
    const hasBiGyeopLuck = luckGods.some(g => g.includes('비견') || g.includes('겁재'));
    
    const isJaeDaSinYak = isSinYak && hasOriginalJae;
    const isJaengJae = hasBiGyeopLuck && hasOriginalJae;
    
    const fireRatio = analysis.elementRatios?.Fire || 0;
    const isFireOverload = fireRatio >= 40;
    const isEarthDayMaster = result.pillars[1].stem === '戊' || result.pillars[1].stem === '己';

    // Layer 1: 거시적 그릇 (The Birthright)
    let layer1 = '';
    if (isSinGang && hasOriginalJae) {
      layer1 = `너는 황금을 넉넉히 담을 수 있는 거대한 가마솥(신강)을 타고났어. 결국 물질의 주인이 될 잠재력이 충분하지.`;
    } else if (isJaeDaSinYak) {
      layer1 = `재물은 주변에 널려있지만, 그걸 담아낼 그릇이 아직은 예쁘고 얇은 찻잔(신약) 같아. 돈을 쫓을수록 몸이 상할 수 있어.`;
    } else {
      layer1 = `타고난 금고의 크기보다는, 네 고유의 재능이나 명예를 지렛대 삼아 부를 창출해야 하는 사주야.`;
    }

    // Layer 2: 중기적 궤도 (The Era)
    let layer2 = '';
    if (luckScore >= 65) {
      layer2 = `지금 네 인생의 계절은 수확을 앞둔 가을이야. 대운의 바람이 네 등 뒤에서 불고 있으니 돛을 올려도 좋아.`;
    } else if (luckScore < 45) {
      layer2 = `하지만 지금은 씨를 뿌리고 견뎌야 하는 긴 겨울을 지나는 중이야. 큰 판을 벌리기엔 아직 땅이 얼어있어.`;
    } else {
      layer2 = `지금은 계절이 바뀌는 환절기야. 무리한 확장보다는 상황을 관망하며 내실을 다지는 게 유리해.`;
    }

    // Layer 3: 미시적 현상 (The Current) & Glitch (The Defense)
    let layer3 = '';
    let glitch = '';

    if (isFrozen && (seunElement === 'Fire' || daewunElement === 'Fire')) {
      layer3 = `특히 올해는 얼어붙었던 네 사주에 불(火)이 들어오는 해지. 멈췄던 심장이 다시 뛰며 황금을 쫓을 강렬한 동력이 생길 거야.`;
      glitch = `얼음이 녹으면서 드러나는 기회들을 놓치지 마. 지금은 움직여야 할 때야.`;
    } else if (isFireOverload && isEarthDayMaster) {
      layer3 = `경고 하나 할게. 불길이 너무 강해 네 땅(재물)을 다 태우고 친구들과 나눠 가져야 해. 독식하려다간 네 손이 먼저 탈 거야.`;
      glitch = `욕심을 버리고 파이를 나눠라. 혼자 다 먹으려다간 뼈도 못 추려.`;
    } else if (isJaengJae) {
      layer3 = `올해는 네 황금을 노리는 까마귀들(비겁)이 주변을 맴돌고 있어. 동업이나 금전 거래는 절대 금물이야.`;
      glitch = `돈이 강제로 뺏길 운이야. 차라리 평소 사고 싶었던 고가의 장비를 질러버려. '쇼핑'으로 액땜을 하는 거지.`;
    } else if (hasPyunJae) {
      layer3 = `올해는 '편재'의 기운, 즉 도박사의 운명이 널 덮쳤어. 전부를 얻거나, 전부를 잃거나. 네 영혼을 건 베팅이 시작됐지.`;
      glitch = `하이 리스크 하이 리턴. 판돈을 걸 거면 확실하게 걸고, 아니면 아예 쳐다보지도 마.`;
    } else if (hasJungJae) {
      layer3 = `올해는 '정재'의 기운이 강해. 횡재수보다는 티끌 모아 성을 쌓는 시기야. 성실함과 계산적인 태도가 네 유일한 구원이지.`;
      glitch = `지루하더라도 엑셀을 켜고 가계부를 써. 1원 단위의 통제가 널 지켜줄 거야.`;
    } else if (isJaeDaSinYak) {
      layer3 = `돈 냄새는 나는데, 무리해서 쫓아가면 네가 먼저 쓰러질 수 있어.`;
      glitch = `돈은 보이는데 네 몸이 버겁대. 건강검진에 돈을 쓰거나 운동에 투자해. 몸집을 키워야 그 돈을 들 수 있어.`;
    } else {
      layer3 = `올해 당장 큰 돈이 쏟아지는 마법은 없지만, 지금 흘리는 땀이 내일의 자본이 될 거야.`;
      glitch = `황금의 그림자가 저 멀리서 아른거리고 있어. 아직은 손을 뻗을 때가 아니야.`;
    }

    const main = lang === 'KO' ? 
      `재물과 성취의 기회라... [delay:1500]\n\n${layer1}\n\n${layer2}\n\n${layer3}` :
      `About your wealth... [delay:1500]\n\n${layer1}\n\n${layer2}\n\n${layer3}`;
    
    return { main, glitch };
  };

  // --- Theme 3: Health/Mental (영혼의 균열) ---
  const analyzeHealth = () => {
    let text = '';
    if (isFrozen || (analysis.elementRatios?.Fire || 0) >= 60) {
      text = lang === 'KO' ? `조후의 불균형이 심해지면서 몸과 마음이 쉽게 지칠 수 있어. 특히 ${isFrozen ? '냉증과 우울감' : '화기와 조급함'}을 다스리는 게 급선무야. ` : `As the temperature imbalance worsens, your body and mind can easily get exhausted. It's urgent to manage ${isFrozen ? 'coldness and depression' : 'heat and impatience'}. `;
    }
    if (allInteractions.some((i: any) => i.type === '충')) {
      text += lang === 'KO' ? `원국에 강한 충이 발생하면서 에너지가 자꾸만 분산되고 있어. 휴식이 최고의 개운법이야. ` : `A strong clash in your chart is constantly scattering your energy. Resting is the best remedy. `;
    }

    const main = lang === 'KO' ? 
      `흔들리는 영혼의 균열을 메우고 싶구나. ${text || '다행히 큰 위기는 없지만, 규칙적인 생활로 리듬을 찾는 게 좋아.'} [delay:3000]\n\n평화는 네 안에서 시작될 거야.` :
      `Regarding your health and peace... ${text || 'Fortunately, there are no major crises, but it is good to find a rhythm with a regular lifestyle.'} [delay:3000]\n\nPeace will begin within you.`;
    
    const glitch = lang === 'KO' ? '몸이 보내는 작은 신호를 무시하지 마. 그게 곧 운의 흐름이니까.' : 'Do not ignore the small signals your body sends. That is the flow of luck.';
    return { main, glitch };
  };

  // --- Theme 4: Secrets (금기된 페이지) ---
  const analyzeSecrets = () => {
    let text = '';
    const hasAmHap = allInteractions.some((i: any) => i.type.includes('암합'));
    const hasWonjin = allInteractions.some((i: any) => i.type.includes('원진'));
    const hasChung = allInteractions.some((i: any) => i.type.includes('충'));
    const hasHyung = allInteractions.some((i: any) => i.type.includes('형'));
    
    // 12-stage Life Cycle (12운성) check
    const seunStage = result.currentYearPillar?.lifeStage;
    const isMokYok = seunStage === '목욕';
    const isDeathOrGrave = seunStage === '사' || seunStage === '묘';

    const marital = interactionsData?.maritalStatus;
    const children = interactionsData?.hasChildren;

    // Corruption Logic (재물과 탐욕)
    const originalGods = result.pillars.flatMap(p => [p.stemKoreanName, p.branchKoreanName]).filter(Boolean);
    const hasOriginalInseong = originalGods.some(g => g?.includes('인성') || g?.includes('정인') || g?.includes('편인'));
    const hasLuckJaeseong = luckGods.some(g => g.includes('재성') || g.includes('정재') || g.includes('편재'));
    const isDarkDeal = hasAmHap && hasOriginalInseong && hasLuckJaeseong;

    const hasLuckSangGwan = luckGods.some(g => g.includes('상관'));
    const hasPyunJae = luckGods.some(g => g.includes('편재')) || originalGods.some(g => g?.includes('편재'));
    const isGamblersMadness = hasLuckSangGwan && hasPyunJae;

    const hasOriginalJae = originalGods.some(g => g?.includes('재성') || g?.includes('정재') || g?.includes('편재'));
    const hasBiGyeopLuck = luckGods.some(g => g.includes('비견') || g.includes('겁재'));
    const isGunBiJaengJae = hasBiGyeopLuck && hasOriginalJae;
    const isBloodMoney = isGunBiJaengJae && hasWonjin;

    let isCorruption = false;
    let corruptionText = '';

    if (isDarkDeal) {
      isCorruption = true;
      corruptionText = lang === 'KO' ? `문서 아래로 오가는 검은 손길... 지금 잡는 그 돈은 네 명예(인성)를 갉아먹는 대가야. 들키지 않을 거라 믿어? 종이는 불을 이기지 못해. ` : `A dark hand moving under the documents... The money you are grabbing now is the price eating away at your honor. Do you believe you won't get caught? Paper cannot beat fire. `;
    } else if (isGamblersMadness) {
      isCorruption = true;
      corruptionText = lang === 'KO' ? `법의 테두리를 벗어난 질주야. 네 기발한 속임수가 통할 것 같지? 하지만 벼랑 끝에 선 건 너 자신이야. 한탕의 꿈이 무덤이 되는 건 한 끗 차이지. ` : `It's a sprint outside the boundaries of the law. Do you think your clever tricks will work? But you are the one standing on the edge of the cliff. The dream of a jackpot becoming a grave is a fine line. `;
    } else if (isBloodMoney) {
      isCorruption = true;
      corruptionText = lang === 'KO' ? `돈 냄새를 맡은 까마귀들이 서로의 눈을 파먹고 있네. 네가 쥔 그 황금은 누군가의 눈물이고 원망이야. 그 돈을 쓰며 잠이 올까? ` : `Crows smelling money are pecking at each other's eyes. The gold you hold is someone's tears and resentment. Can you sleep while spending that money? `;
    }

    let prefix = '';
    if (!isCorruption) {
      if (marital === '기혼') {
        prefix = lang === 'KO' ? `이미 가정을 이룬 상태에서 이런 기운을 마주하다니, 위태롭네. ` : `Facing this energy while already married is quite precarious. `;
        if (children) {
          prefix += lang === 'KO' ? `지켜야 할 것들이 있는데도 흔들리는 마음 때문에 더 괴로울 수 있어. ` : `It might be more painful because your heart is wavering despite having things to protect. `;
        }
      } else if (marital === '돌싱') {
        prefix = lang === 'KO' ? `한 번의 굴레를 벗어났음에도, 또다시 위험한 불꽃에 눈길이 가고 있네. ` : `Even after escaping the cycle once, your eyes are drawn to a dangerous flame again. `;
      } else {
        prefix = lang === 'KO' ? `아직 얽매인 곳은 없지만, 남들에게 쉽게 털어놓지 못할 은밀한 서사가 시작되려 해. ` : `You are not bound to anyone yet, but a secret narrative that you can't easily share with others is about to begin. `;
      }
    }

    if (hasAmHap && hasChung) {
      text = lang === 'KO' ? `겉으로는 차갑게 밀어내고 싸우면서도, 지장간 속에서는 몰래 손을 잡는 '암합'의 긴장감이 흐르고 있어. 이건 지독한 집착이야. 낮에는 적이지만 밤에는 서로의 그림자를 쫓는 기묘한 관계에 중독될 수 있어. ` : `While pushing away and fighting on the surface, there's a hidden tension of 'Am-Hap' secretly holding hands underneath. This is a severe obsession. You might get addicted to a bizarre relationship where you are enemies by day but chase each other's shadows by night. `;
    } else if (hasAmHap) {
      text = lang === 'KO' ? `겉으론 아무 일 없는 척해도, 네 무의식은 이미 그 사람의 그림자를 쫓고 있어. 들키고 싶지 않은 그 은밀한 긴장감이 네 영혼을 갉아먹고 있네. ` : `Even if you pretend nothing is happening, your subconscious is already chasing their shadow. That secret tension you don't want to be caught in is eating away at your soul. `;
    }

    if (isMokYok) {
      text += lang === 'KO' ? `게다가 지금은 '목욕(Mok-Yok)'의 기운이 네 이성을 마비시키고 있어. 품격보다는 본능, 사랑보다는 탐닉이 앞서는 시기지. 이 관계는 축복보다는 치명적인 중독에 가까워. ` : `Moreover, the energy of 'Mok-Yok (Bathing)' is paralyzing your reason right now. It's a time when instinct precedes dignity, and indulgence precedes love. This relationship is closer to a fatal addiction than a blessing. `;
    } else if (isDeathOrGrave) {
      text += lang === 'KO' ? `기운이 극도로 침잠된 상태에서 만나는 인연이야. 화려함은 없지만, 서로의 상처를 파고드는 지독한 연민이 사랑으로 착각될 수 있어. ` : `It's a connection met in a state of extremely sunken energy. There's no glamour, but a deep compassion that digs into each other's wounds can be mistaken for love. `;
    }

    if (!text && hasWonjin) {
      text = lang === 'KO' ? `미워할수록 더 깊게 중독되는 원진의 굴레에 갇혀 있네. 망할 걸 알면서도 끌리는 불나방 같은 선택을 조심해. ` : `You are trapped in the cycle of Wonjin, where the more you hate, the deeper you get addicted. Be careful of making choices like a moth drawn to a flame, knowing it will ruin you. `;
    }

    const isSecretAffairTrigger = hasAmHap || isMokYok || hasWonjin || isDeathOrGrave;
    let consequence = '';

    if (isSecretAffairTrigger && (hasChung || hasHyung)) {
      consequence = lang === 'KO' ? `비밀은 달콤하지만, 그 대가는 소금보다 쓸 거야. 지금 네가 잡은 그 손은 결국 수갑(관재)이나 낙인(구설)이 되어 돌아올 텐데, 그래도 열어보겠어? ` : `Secrets are sweet, but the price will be more bitter than salt. The hand you are holding now will eventually return as handcuffs (legal issues) or a stigma (gossip). Will you still open it? `;
    }

    if (isFrozen && isSecretAffairTrigger) {
      consequence += lang === 'KO' ? `이건 사랑이 아니라 저체온증이 만든 환각이야. 너무 추워서 옆에 있는 독초를 난로라 착각하고 품으려 하는구나. ` : `This is not love, but a hallucination created by hypothermia. You are so cold that you mistake the poisonous plant next to you for a heater and try to embrace it. `;
    }

    const finalNarrative = isCorruption ? corruptionText : `${prefix}\n\n${text || (lang === 'KO' ? '네 안의 본능이 조용히 숨죽이고 있네. 하지만 언제든 타오를 준비가 되어 있어.' : 'Your instincts are quiet for now, but ready to ignite.')}\n\n${consequence}`;

    const main = lang === 'KO' ? 
      `금기된 페이지를 열어보고 싶어? [delay:1500]\n\n${finalNarrative} [delay:3000]\n\n비밀은 무덤까지 가져갈 수 있을까?\n\n[#9ca3af:이 메시지는 1분 뒤 자동 삭제됩니다.]` :
      `Opening the forbidden page... [delay:1500]\n\n${finalNarrative} [delay:3000]\n\nCan you take the secret to your grave?\n\n[#9ca3af:This message will self-destruct in 1 minute.]`;
    
    let glitch = '';
    if (isCorruption) {
      glitch = lang === 'KO' ? '법의 심판을 비웃는 대가로 네 평안을 팔겠어?' : 'Will you sell your peace in exchange for mocking the judgment of the law?';
    } else {
      glitch = lang === 'KO' ? 
        (isMokYok ? '이성이 본능을 이길 수 없는 시기야. 후회할 짓은 하지 마, 아니면 제대로 즐기든가.' : '비밀이 탄로 나는 순간, 네가 쌓아온 모든 게 흔들릴 수 있다는 걸 명심해.') :
        (isMokYok ? 'Reason cannot beat instinct right now. Don\'t do anything you\'ll regret, or just enjoy it fully.' : 'Keep in mind that the moment the secret is revealed, everything you\'ve built could be shaken.');
    }

    return { main, glitch, isCorruption };
  };

  // --- Theme 5: Moving (궤도의 이탈) ---
  const analyzeMoving = () => {
    let text = '';
    const hasYeokma = analysis.shinsal?.some((s: any) => s.name.includes('역마'));
    const dayBranch = result.pillars[1].branch;
    const monthBranch = result.pillars[2].branch;
    const hasBranchChung = allInteractions.some((i: any) => (i.note.includes(dayBranch) || i.note.includes(monthBranch)) && i.type.includes('충'));
    
    if (hasYeokma && hasBranchChung) {
      text = lang === 'KO' ? `역마의 기운이 충을 맞아 궤도를 이탈하려는 에너지가 폭발하고 있어. 이사나 이직, 혹은 완전히 새로운 환경으로의 이동이 강하게 예견돼. ` : `The energy of Yeokma (traveling star) is clashing, exploding the desire to break out of orbit. Moving, changing jobs, or shifting to a completely new environment is strongly predicted. `;
    } else if (hasBranchChung) {
      text = lang === 'KO' ? `지금 머무는 곳의 근간이 흔들리고 있네. "때려치우고 싶다"는 욕구가 머리 끝까지 찼을 거야. ` : `The foundation of where you are staying is shaking. The desire to "just quit" must be up to your neck. `;
    } else {
      text = lang === 'KO' ? `이동보다는 현재의 자리를 지키며 내실을 다지는 게 유리한 흐름이야. ` : `It's a more favorable flow to keep your current position and build inner strength rather than moving. `;
    }

    const main = lang === 'KO' ? 
      `지금 머무는 곳이 네 무덤일까, 아니면 발판일까? ${text} [delay:3000]\n\n새로운 궤도로 진입할 준비를 해.` :
      `Is your current place a grave or a stepping stone? ${text} [delay:3000]\n\nPrepare to enter a new orbit.`;
    
    const glitch = lang === 'KO' ? '이동은 조후의 변화를 동반해. 방위를 잘 따져보고 움직여.' : 'Moving brings a change in temperature. Consider the direction carefully before moving.';
    return { main, glitch };
  };

  // --- Theme 6: General Luck (금년운세) ---
  const analyzeGeneral = () => {
    const prefix = lang === 'KO' ? 
      `이번에는 대운과 세운의 흐름을 좀 볼까? 보채지는 말아줘. \n\n` : 
      `Let's look at your cycles. Don't rush me. \n\n`;
    return { main: prefix + main, glitch: glitch };
  };

  // Populate Analyses
  themeAnalyses['romance'] = analyzeRomance();
  themeAnalyses['wealth'] = analyzeWealth();
  themeAnalyses['health'] = analyzeHealth();
  themeAnalyses['secrets'] = analyzeSecrets();
  themeAnalyses['moving'] = analyzeMoving();
  themeAnalyses['general'] = analyzeGeneral();

  // Next Hook Logic
  const interactions = analysis.interactions || [];
  const hasWonjin = interactions.some((i: any) => i.type.includes('원진'));
  if (hasWonjin) {
    themeAnalyses['wealth'].nextHook = { text: "금화의 흐름은 읽었어. 그런데 네 사주 구석에 숨은 지독한 악연(원진)이 네 재물을 갉아먹고 있는 건 알고 있어? 이 비밀의 페이지도 열어볼래?", themeId: 'secrets' };
    themeAnalyses['general'].nextHook = { text: "전반적인 흐름은 이래. 그런데 네 인연의 실타래가 아주 복잡하게 꼬여있는 게 보이네. 확인해볼래?", themeId: 'romance' };
  }

  // Theme Targeting Score Calculation
  if (isFrozen || (analysis.elementRatios?.Fire || 0) >= 60) themeScores.health += 50;
  if (allInteractions.some((i: any) => i.type === '충')) themeScores.health += 30;

  const hasAmHapGlobal = allInteractions.some((i: any) => i.type.includes('암합'));
  const hasDohwa = analysis.shinsal?.some((s: any) => s.name.includes('도화'));
  const hasWonjinSal = allInteractions.some((i: any) => i.type.includes('원진'));
  const hasBathGlobal = result.pillars.some((p) => p.lifeStage === '목욕');
  if (hasAmHapGlobal) themeScores.secrets += 50;
  if (hasDohwa) themeScores.secrets += 30;
  if (hasWonjinSal && hasBathGlobal) themeScores.secrets += 40;

  const hasYeokmaGlobal = analysis.shinsal?.some((s: any) => s.name.includes('역마'));
  const dayBranchGlobal = result.pillars[1].branch;
  const monthBranchGlobal = result.pillars[2].branch;
  const hasBranchChungGlobal = allInteractions.some((i: any) => (i.note.includes(dayBranchGlobal) || i.note.includes(monthBranchGlobal)) && i.type.includes('충'));
  if (hasYeokmaGlobal) themeScores.moving += 50;
  if (hasBranchChungGlobal) themeScores.moving += 40;

  // 3+1 Strategy
  const allThemes: ThemeOption[] = [
    { id: 'romance', title: '[심연의 이끌림]', question: "나를 구원할 인연일까, 아니면 나를 집어삼킬 악연일까? 내 안의 이 지독한 외로움이 향하는 곳을 알려줘.", priority: 100 },
    { id: 'wealth', title: '[황금의 그림자]', question: "타오르는 열망이 금화가 되어 돌아올까? 아니면 한 줌의 재로 흩어질까? 내가 쥔 재물과 성취의 기회를 설명해줘.", priority: 100 },
    { id: 'health', title: '[영혼의 균열]', question: "자꾸만 흔들리는 내 몸과 마음... 어떻게 해야 이 고통을 잠재우고 평화를 찾을 수 있을까?", priority: themeScores.health },
    { id: 'secrets', title: '[금기된 페이지]', question: "입 밖으로 낼 수 없는 비밀, 혹은 나조차 모르는 내 안의 본능... 그 위험한 불길이 언제 타오를지 미리 경고해줘.", priority: themeScores.secrets },
    { id: 'moving', title: '[궤도의 이탈]', question: "궤도의 이탈: 지금 머무는 이곳이 네 무덤일까, 아니면 발판일까?", priority: themeScores.moving },
    { id: 'general', title: '[운명의 지도]', question: "올해의 전반적인 흐름과 오늘의 기운을 한눈에 보여줘.", priority: 90 }
  ];

  const topTargeted = allThemes
    .filter(t => !['romance', 'wealth', 'general'].includes(t.id))
    .sort((a, b) => b.priority - a.priority)[0];

  const displayThemes = [
    allThemes.find(t => t.id === 'romance')!,
    allThemes.find(t => t.id === 'wealth')!,
    topTargeted,
    allThemes.find(t => t.id === 'secrets')!,
    allThemes.find(t => t.id === 'moving')!,
    allThemes.find(t => t.id === 'health')!,
    allThemes.find(t => t.id === 'general')!
  ].filter(Boolean);

  // Remove duplicates and ensure general is always there
  const finalThemes = Array.from(new Set(displayThemes));

  return {
    intro,
    questionPrompt: lang === 'KO' ? 
      `[delay:2000]\n\n지금 네가 가장 궁금한 걸 대답해줄게. 뭐가 궁금해서 이런 심연(void)까지 찾아왔어?` :
      `[delay:2000]\n\nI will answer what you are most curious about. What brought you to this void?`,
    themes: finalThemes,
    themeAnalyses,
    luckScore,
    luckColor: luckScore >= 70 ? '#00F2FF' : luckScore >= 40 ? '#FFD700' : '#FF1493'
  };
}
