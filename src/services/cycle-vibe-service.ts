import { BaZiResult, Language } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { ELEMENT_COLORS, ELEMENT_DESCRIPTIONS } from '../constants';
import { ILJU_DESCRIPTIONS } from '../constants/ilju-descriptions';
import { Solar } from 'lunar-typescript';

function getJosa(name: string, josaType: '은는' | '이가' | '을를'): string {
  if (!name) return '';
  const charCode = name.charCodeAt(name.length - 1);
  if (charCode < 0xAC00 || charCode > 0xD7A3) return name + (josaType === '은는' ? '는' : josaType === '이가' ? '가' : '를'); 
  const hasBatchim = (charCode - 0xAC00) % 28 > 0;
  const josa = {
      '은는': hasBatchim ? '은' : '는',
      '이가': hasBatchim ? '이' : '가',
      '을를': hasBatchim ? '을' : '를'
  };
  return name + josa[josaType];
}

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

const CITY_META_TABLE: Record<string, { impression: string, enImpression: string }> = {
  "강릉": { impression: "푸른 파도와 커피 향이 어우러진 낭만적인 곳이지. 언제 가도 마음이 탁 트이는 기분이야.", enImpression: "A romantic place where blue waves and coffee scent blend. It always makes you feel refreshed." },
  "부산": { impression: "거친 파도와 역동적인 에너지가 넘치는 곳이지. 활기찬 기운이 여기까지 느껴지는 것 같아.", enImpression: "A place full of rough waves and dynamic energy. I can feel the vibrant energy from here." },
  "춘천": { impression: "안개 낀 호수와 서정적인 분위기가 매력적인 곳이지. 닭갈비 냄새가 여기까지 나는 것 같아.", enImpression: "A charming place with foggy lakes and a lyrical atmosphere. I can almost smell the Dakgalbi from here." },
  "경주": { impression: "천 년의 세월이 흐르는 신비로운 땅이지. 발길 닿는 곳마다 역사가 살아 숨 쉬는 기분이야.", enImpression: "A mysterious land where a thousand years of time flow. History breathes wherever you step." },
  "제주": { impression: "현무암 사이를 지나는 바람이 자유로운 곳이지. 이국적인 풍경에 훌쩍 떠나고 싶어지네.", enImpression: "A place where the wind blows freely through basalt rocks. The exotic scenery makes me want to just take off and go." },
  "서울": { impression: "활기차고 전통이 잘 어우러진 현대적인 곳이지. 갑자기 K-FOOD가 떙기네?", enImpression: "A modern place where vibrant energy and tradition blend well. Suddenly craving some K-FOOD!" },
  "Seoul": { impression: "활기차고 전통이 잘 어우러진 현대적인 곳이지. 갑자기 K-FOOD가 떙기네?", enImpression: "A modern place where vibrant energy and tradition blend well. Suddenly craving some K-FOOD!" }
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
  
  // 観多判定
  const tenGodsRatio = analysis.tenGodsRatio || {};
  const gwanRatio = (tenGodsRatio['관성 (Warrior/Judge)'] as number) || 0;
  const isGwanDa = gwanRatio >= 60;

  const strength = analysis.dayMasterStrength || { isStrong: false, title: '', score: 50 };
  const isSinGang = strength.isStrong || false;
  const isNeutral = strength.title ? strength.title.includes('중화') : false;
  const isSinYak = !isSinGang && !isNeutral;
  
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
      nameRef = `${getJosa(processedName, '은는')} `;
    } else {
      processedName = '너';
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
      cityInsight = `${city}에서 태어났네? ${meta.impression}`;
    } else if (city) {
      cityInsight = `${city}에서 태어났네? 그곳만의 독특한 기운이 네 사주에 스며들어 네 영혼의 색깔을 더 선명하게 만들었겠군.`;
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

    const specialCombinations = analysis.specialCombinations || {};

    // --- Special Combinations (물상론) ---
    if (specialCombinations.isByeokGapInHwa && seunStem === '庚') {
      combos.push({ id: '벽갑인화', priority: 200, name: '벽갑인화(劈甲引火)', desc: `투박한 거목이 도끼를 만나 쓰임새 있는 도구로 변하는 해이야. 막연했던 계획이 실질적인 결과물로 '떡상'하는 시기지.` });
    }
    if (specialCombinations.isDengLaJieJia && seunStem === '甲') {
      combos.push({ id: '등라계갑', priority: 190, name: '등라계갑(藤羅繫甲)', desc: `담쟁이덩굴이 거목을 만났어. 강력한 조력자나 배우자의 든든한 등 뒤에서 네 능력을 마음껏 펼칠 타이밍이야.` });
    }
    if (specialCombinations.isDoSeJuOk && seunStem === '壬') {
      combos.push({ id: '도세주옥', priority: 180, name: '도세주옥(陶洗珠玉)', desc: `흙먼지 묻은 보석이 맑은 물에 씻겨 광채를 내는 격이야. 네 진가가 세상의 주목을 받으며 반짝이기 시작할 거야.` });
    }
    if (specialCombinations.isGangHwiSangYeong && seunStem === '丙') {
      combos.push({ id: '강휘상영', priority: 185, name: '강휘상영(江輝相映)', desc: `넓은 강물 위로 태양이 비치며 찬란한 빛을 만드는 형국이야. 귀인을 만나거나 사회적 지위가 수직 상승하는 기분 좋은 흐름이지.` });
    }
    if (specialCombinations.isHwaChiSeungRyong && seunBranch === '辰') {
      combos.push({ id: '화치승룡', priority: 170, name: '화치승룡(火熾乘龍)', desc: `타오르는 불길이 용(진토)을 만나 안정을 찾는 해이야. 과부하된 에너지가 조절되어 심리적 평온과 실속을 동시에 챙기게 될 거야.` });
    }
    if (specialCombinations.isGiToTakIm && seunStem === '己') {
      combos.push({ id: '기토탁임', priority: 160, name: '기토탁임(己土濁壬)', desc: `맑은 강물에 흙탕물이 섞이는 형국이야. 감정적인 판단이나 구설수로 명예에 스크래치 나지 않게 멘탈 관리 잘해야 해.` });
    }

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

    // 観多専用のロジック
    if (isGwanDa) {
      if (hasSikSangLuck) {
        combos.push({ id: '식신제살', priority: 1000, name: '식신제살(食神制殺)', desc: "비로소 당신의 검을 휘둘러 낡은 굴레를 끊어내고 주도권을 잡는 '돌파의 해'입니다." });
      }
      if (hasJaeSeongLuck) {
        combos.push({ id: '재생살', priority: -1000, name: '재생살(財生殺)', desc: "겉으로는 실속과 기회처럼 보이나, 실제로는 당신의 책임과 부담을 가중시켜 숨 막히게 할 수 있는 시기입니다." });
      }
    }

    combos.sort((a, b) => b.priority - a.priority);
    if (combos.length > 2) combos.splice(2);
  }

  let comboInsight = '';
  const isFireLuck = seunElement === 'Fire' || daewunElement === 'Fire';

  if (isFrozen && isFireLuck) {
    comboInsight = `이번 시기는 '해동(解凍)'의 기적 같은 흐름이야. 차갑게 얼어붙어 있던 네 원국이 따뜻한 불을 만나 비로소 녹기 시작하고 있어. "냉동실에서 나온 보석이 태양을 만나 빛나는 형국"이라는 점에 집중해.`;
  }

  if (combos.length > 0 && !comboInsight) {
    const isJeonWang = analysis.yongshinDetail?.method === "전왕격용신" || analysis.yongshinDetail?.method === "특수격용신";
    const isFireExtreme = (analysis.elementRatios?.Fire || 0) >= 60;
    const is2026 = currentAnnualPillar?.year === 2026;

    if (isJeonWang && isFireExtreme && is2026 && combos.some(c => c.id === '상관패인')) {
      comboInsight = `이번 시기는 '화다금용(火多金鎔)'의 위태로운 흐름이야. 네 넘치는 생각이 실질적인 재능(상관)을 녹여버리고 있어. 머리만 쓰지 말고 손을 움직여 결과물을 굳혀야 해.`;
    } else if (combos.length === 1) {
      comboInsight = `이번 시기는 '${combos[0].name}'의 격을 갖췄어. ${combos[0].desc}`;
    } else {
      comboInsight = `'${combos[0].name}'의 흐름이 주도적이지만, 동시에 '${combos[1].name}'의 영향도 무시할 수 없어. \n\n${combos[0].desc} ${combos[1].desc}`;
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
    
    // Inject GeJu (Structure) insight if available
    let geJuComment = '';
    if (analysis.geJu) {
      const geJuInfo = BAZI_MAPPING.geju[analysis.geJu as keyof typeof BAZI_MAPPING.geju];
      if (geJuInfo) {
        geJuComment = `\n\n특히 ${analysis.geJu}의 기운을 타고났네. ${geJuInfo.ko}`;
      }
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
      balanceComment = `\n\n특히 ${processedName} 너는 '${primaryWarning.title}'의 기운이 강하게 느껴져. ${primaryWarning.description} `;
    }

    let introPrefix = '';
    if (cityInsight) {
      introPrefix = `${cityInsight} [delay:1000]\n\n아무튼.. `;
    } else {
      introPrefix = `흠.. `;
    }

    intro = `${introPrefix}${impression} \n게다가 ${strengthComment} ${geJuComment}\n\n${elementComment} ${balanceComment} \n\n이런 다양한 매력이 더해지면 ${nameRef}너만의 색깔이 뚜렷할 거야 분명히.`;
  } else {
    // English Intro (Simplified)
    const isFireEarthTurbid = analysis.yongshinDetail?.method === "특수격용신" && analysis.structureDetail?.title === "화토중탁";
    let enCityGreeting = '';
    
    const matchedCityEn = Object.keys(CITY_META_TABLE).find(c => city && city.includes(c));
    if (matchedCityEn) {
      const meta = CITY_META_TABLE[matchedCityEn as keyof typeof CITY_META_TABLE];
      enCityGreeting = `Born in ${city}? ${meta.enImpression} [delay:1000]\n\nAnyway.. `;
    } else if (city) {
      enCityGreeting = `Born in ${city}? The unique energy of that place must have seeped into your chart, making your soul's color even more vivid. [delay:1000]\n\nAnyway.. `;
    } else {
      enCityGreeting = `Hmm.. `;
    }
    
    let enSpecialGreeting = '';
    if (isFireEarthTurbid) {
      enSpecialGreeting = `Your chart has a unique 'Fire-Earth Heavy-Turbid' structure—dry, intense, and powerful. `;
    }

    const enIljuDesc = iljuInfo.en.replace(/^([A-Za-z-]+)/, "$1, which is your Day Pillar representing your core self,");

    intro = `${enCityGreeting}${enIljuDesc} ${enSpecialGreeting}Plus, you have ${isSinGang ? 'plenty of' : isNeutral ? 'balanced' : 'delicate'} energy. Your unique color will definitely shine.`;
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
        detailedEffect += `그동안 굳어있던 네 문서(인성)와 결과물(재성)이 드디어 가치를 발휘하기 시작할 거야. 지금은 돈이 되는 문서를 잡고, 차가운 뚝심이 세상의 빛을 보아 에너지가 폭발하는 시기니까. `;
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
        const isBokEum = result.pillars.some(p => p.stem === '丙' && p.branch === '午');
        const isJaHyeong = hasOhBranch;

        if (isFireExtreme) {
          detailedEffect += `2026년의 병오(丙午)라는 거대한 불기둥은 너에게 '열정'이라기보다 '과열'에 가까운 압박으로 다가올 거야. `;
          if (isBokEum) {
            detailedEffect += `특히 네 원국과 똑같은 기운이 들어오는 '복음(伏吟)'의 해라, 엎드려 울 일이 생길 만큼 자기 확신이 독이 될 수 있어. `;
          } else if (isJaHyeong) {
            detailedEffect += `스스로를 옥죄는 '자형(自刑)'의 기운이 겹치니, 네 고집이 결국 너를 찌르는 칼날이 되지 않게 조심해야 해. `;
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
          detailedEffect += `사람들은 이걸 보고 '상관패인'이라며 네 기발한 재능이 고삐를 만났다고 축복할지 몰라. 하지만 내가 보기엔 글쎄... 지금 네 재능(상관)은 너무 뜨거운 불길(인성) 속에 던져진 작은 칼날 같아. 날카롭게 빛나야 할 네 아이디어가 강렬한 화기운에 녹아내리는 '화다금용(火多金鎔)'의 형국이지. \n\n2026년의 병오(丙午)라는 거대한 불기둥은 네 열정을 부채질하겠지만, 그건 '열정'이라기보다 '과열'에 가까워. 자칫하면 네가 가진 기술이나 재능이 고집과 감정에 휘말려 형태도 없이 사라질 수 있어. \n\n그리고.. 이건 아주 위험한 도박이 될수도 있어. 억지로 무언가를 발산하려고 하지 마. 지금은 상관의 힘을 휘두를 때가 아니라, 그 뜨거운 불길 속에서 네 자신을 지켜내는 '디펜스'가 최우선이야. 불길이 너를 태우지 않도록 차갑게 식히는 데만 집중해. 조급해지는 순간, 네 보석 같은 재능은 녹아버릴 테니까. 명심해, 태양도 너무 뜨거우면 스스로를 태우는 법이야. `;
        } else if (!isFireExtreme) {
          detailedEffect += `상관의 발산하는 힘을 인성이 세련되게 통제해주고 있네. `;
        }
      }
      if (comboIds.includes('식상생재')) detailedEffect += `식상이 재성으로 이어지는 흐름이라 결과물이 쏠쏠하겠어. `;
      if (comboIds.includes('재극인')) {
        if (!isFrozen) {
          detailedEffect += `다만 돈 욕심이 앞서면 공들여 쌓은 커리어의 안정성이 흔들릴 수 있으니, 현실적인 이득과 명예 사이에서 균형을 잘 잡는 게 중요해. `;
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
        glitch = `왕신충발(旺神衝發) 주의. 거대한 변화가 예상돼. 감당할 수 없는 수준의 환경 변화와 건강 관리가 필수야. 변화를 거부하지 말고, 기존의 고집(인성)을 버리고 철저히 현실(재성)의 논리를 따를 때만 살아남아 성공할 수 있어. `;
      } else if (!isFireExtreme) {
        glitch = `운의 흐름이 비교적 매끄러운 편이지만, 네 페이스를 잃지 않는 게 중요해. 주변 소음보다는 네 내면의 목소리에 더 집중해봐. `;
      } else {
        glitch = `에너지가 임계치를 넘나드는 시기야. 무리한 확장보다는 내실을 기하며 폭풍이 지나가길 기다리는 지혜가 필요해. `;
      }
    } else {
      // Low luck score - refined logic
      if (isFireYear) {
        if (isFrozen) {
          glitch = `그동안 얼어붙어 있던 네 재능이 따뜻한 불을 만나 드디어 기지개를 켜는 시기야. 망설이지 말고 네 능력을 세상에 마음껏 펼쳐봐. `;
        } else {
          glitch = `기운은 뜨겁게 타오르는데 네가 그 열기를 다 소화하지 못하고 있어. 겉으로만 화려해 보이고 실속이 없을 수 있으니, 에너지를 분산시키지 말고 한 곳에 집중해봐. `;
        }
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
    
    const hasSikSangLuck = luckGods.some(g => g.includes('식상') || g.includes('식신') || g.includes('상관'));
    const hasJaeSeongLuck = luckGods.some(g => g.includes('재성') || g.includes('편재') || g.includes('정재'));
    const hasGwanSeongLuck = luckGods.some(g => g.includes('관성') || g.includes('편관') || g.includes('정관'));
    const hasInSeongLuck = luckGods.some(g => g.includes('인성') || g.includes('편인') || g.includes('정인'));
    
    const hasAvailability = isFemale ? hasGwanSeongLuck : isMale ? hasJaeSeongLuck : (hasGwanSeongLuck || hasJaeSeongLuck);
    
    const dayBranch = result.pillars[1].branch;
    const dayBranchInteractions = allInteractions.filter((i: any) => i.note.includes(dayBranch) && (i.note.includes(daewunBranch) || i.note.includes(seunBranch)));
    
    const hasHap = dayBranchInteractions.some((i: any) => i.type.includes('합'));
    const hasChung = dayBranchInteractions.some((i: any) => i.type.includes('충'));
    const hasWonjin = dayBranchInteractions.some((i: any) => i.type.includes('원진'));

    const yongShin = analysis.yongShen || '';
    const isYongShinLuck = yongShin.includes(daewunElement) || yongShin.includes(seunElement);

    const isGwanSalHonJap = analysis.tenGodsRatio?.['편관 (Strong Warrior)'] > 0 && analysis.tenGodsRatio?.['정관 (Proper Warrior)'] > 0;
    const isSinYak = analysis.shinGangShinYak?.title?.includes('약');
    const inSeongRatio = Object.entries(analysis.tenGodsRatio || {}).filter(([k]) => k.includes('인성') || k.includes('Mystic') || k.includes('Sage')).reduce((sum, [_, v]) => sum + (v as number), 0);
    const hasNoJaeSeong = Object.entries(analysis.tenGodsRatio || {}).filter(([k]) => k.includes('재성') || k.includes('Maverick') || k.includes('Architect')).reduce((sum, [_, v]) => sum + (v as number), 0) === 0;
    const hasNoGwanSeong = Object.entries(analysis.tenGodsRatio || {}).filter(([k]) => k.includes('관성') || k.includes('Warrior') || k.includes('Judge')).reduce((sum, [_, v]) => sum + (v as number), 0) === 0;

    // 1. Desire and Availability
    if (hasSikSangLuck && hasAvailability) {
      score += 30;
      text += lang === 'KO' ? '연애하고 싶은 마음(식상)과 실제 대상(이성운)이 동시에 들어오는 완벽한 타이밍이야. 가장 안정적인 연애가 성립될 수 있어. ' : 'A perfect timing where both your desire for romance and actual potential partners arrive simultaneously. The most stable romance can be formed. ';
    } else if (hasSikSangLuck) {
      score += 10;
      text += lang === 'KO' ? '연애하고 싶은 주체적인 마음과 매력이 강해지는 시기야. ' : 'Your independent desire for romance and charm are growing stronger. ';
    } else if (hasAvailability) {
      score += 15;
      text += lang === 'KO' ? '주변에 연애할 대상이 나타나는 이성운이 들어왔어. ' : 'Luck for meeting potential partners has arrived. ';
    }

    if (hasInSeongLuck) {
      text += lang === 'KO' ? '특히 이번 운에서는 상대방으로부터 대우받고 무언가를 많이 받는 수용적인 연애(갑이 되는 연애)를 할 수 있는 흐름이야. ' : 'Especially in this cycle, you can experience a receptive romance where you are treated well and receive a lot from your partner. ';
    }

    // 2. Day Branch Activation
    if (hasHap) {
      score += 20;
      text += lang === 'KO' ? '내 안방(일지)의 문이 합(合)으로 활짝 열리네. 인연이 닿는 유력한 시기야. ' : 'The door to your spouse palace opens wide with a combination. It\'s a strong time for connections. ';
      
      const hapTypes = dayBranchInteractions.filter((i: any) => i.type.includes('합')).map((i: any) => i.note);
      if (hapTypes.some(n => n.includes('寅') && n.includes('亥')) || hapTypes.some(n => n.includes('巳') && n.includes('申'))) {
        text += lang === 'KO' ? '스펙과 매력에 끌려 순식간에 사랑에 빠지지만 금방 식을 수 있는 "금사빠" 성향이 발동할 수 있으니 속도 조절이 필요해. ' : 'You might fall in love quickly due to specs and charm, but it could cool down fast. Pace yourself. ';
      } else if (hapTypes.some(n => n.includes('卯') && n.includes('戌'))) {
        text += lang === 'KO' ? '서로 티키타카가 아주 잘 맞는 찰떡 궁합의 인연이 예상돼. ' : 'A connection with great chemistry and banter is expected. ';
      } else if (hapTypes.some(n => n.includes('辰') && n.includes('酉'))) {
        text += lang === 'KO' ? '연애를 넘어 동업이나 사업적 시너지를 내기 좋은 실속 있는 인연이야. ' : 'A practical connection good for business synergy beyond just romance. ';
      }
    } else if (hasChung) {
      score += 10;
      text += lang === 'KO' ? '일지에 충(沖)이 들어와. 첫눈에 반하는 강렬한 사랑이 생기거나, 임신/직장 이동 등 갑작스러운 주변 상황 변화로 인해 번갯불에 콩 볶듯 결합(결혼 등)이 발생할 수 있는 이벤트 구간이야. ' : 'A clash hits your spouse palace. Expect intense love at first sight, or a sudden union (like marriage) triggered by unexpected situations like pregnancy or job changes. ';
    } else if (hasWonjin) {
      score -= 10;
      text += lang === 'KO' ? '끌리지만 괴로운, 지독한 애증의 인연(원진)이 시작될 수 있어. 마음을 다치지 않게 조심해야 해. ' : 'A toxic, love-hate relationship that you\'re drawn to might begin. Be careful not to get your heart broken. ';
    }

    // 3. Marriage Timing & Warnings
    const isMarriageTiming = (isMale && hasJaeSeongLuck && hasHap) || 
                             (isYongShinLuck) || 
                             (isFemale && (hasGwanSeongLuck || hasSikSangLuck));
    
    if (isMarriageTiming && hasHap) {
      text += lang === 'KO' ? '20대라면 깊은 연애로, 30대 이상 정년기라면 실제 결혼으로 이어질 확률이 매우 높은 강력한 운이야. ' : 'If in your 20s, this leads to deep romance; if 30s or older, it\'s a very strong luck likely leading to actual marriage. ';
    }

    // 4. Bad Luck Filtering & Warnings
    if (hasAvailability && ((isFemale && isGwanSalHonJap) || isSinYak)) {
      score -= 20;
      text += lang === 'KO' ? '\n\n[경고] 이성운이 들어왔지만, 사주의 단점(관살혼잡 가중 또는 신약함)을 부추기는 흉운의 성격도 있어. 절대 섣부른 결정을 내리지 말고, 반드시 궁합을 확인하고 시기를 숙고해. ' : '\n\n[Warning] Romance luck has arrived, but it might worsen your chart\'s weaknesses. Do not make hasty decisions; be sure to check compatibility and consider the timing carefully. ';
    }

    if (inSeongRatio > 40) {
      text += lang === 'KO' ? '\n\n[주의] 인성이 과다하여 주관적 잣대가 강해. 연애 시 객관성이나 눈치가 떨어질 수 있으니 타인의 조언을 귀담아들어. ' : '\n\n[Note] With excessive Wisdom, your subjective standards are strong. You might lack objectivity or tact in romance, so listen to others\' advice. ';
    }

    if ((isMale && hasNoJaeSeong) || (isFemale && hasNoGwanSeong)) {
      text += lang === 'KO' ? '\n\n[주의] 원국에 이성을 보는 기준(재성/관성)이 부족해 나쁜 사람을 만날 확률이 높아. 주변 연애 고수들의 객관적인 조언을 반드시 받아! ' : '\n\n[Note] Your chart lacks the standard for judging partners. There is a high chance of meeting the wrong person, so definitely get objective advice from dating experts around you! ';
    }

    text += lang === 'KO' ? '\n\n마지막으로, 연애는 쌍방작용이야. 상대방의 사주에서도 연애운(식상)과 이성운이 들어왔는지, 내게 없는 오행을 보완해주는 귀인인지 꼭 함께 확인해봐.' : '\n\nLastly, romance is a two-way street. Make sure to check if your partner also has romance luck and if they complement your missing elements.';

    const main = lang === 'KO' ? 
      `음, ${userRef}의 애정운을 보니... [delay:1500]\n\n${text}` :
      `Looking at your romance... [delay:1500]\n\n${text}`;
    
    const glitch = lang === 'KO' ? 
      (score >= 70 ? '인연의 끈이 팽팽하게 당겨지고 있어. 기회를 놓치지 마.' : '지금은 누군가를 찾기보다 네 내면의 평화를 먼저 찾는 게 이득이야.') :
      (score >= 70 ? 'The string of fate is pulling tight. Don\'t miss the chance.' : 'It\'s better to find your inner peace first rather than looking for someone else.');

    let nextHook;
    if (marital === '미혼' && !children) {
      nextHook = {
        text: lang === 'KO' ? '결혼하는 운이 언제 들어올지도 궁금해?' : 'Are you curious when your marriage luck comes in?',
        themeId: 'marriage_timing'
      };
    }

    return { main, glitch, nextHook };
  };

  // --- Theme 1.5: Marriage Timing (결혼운) ---
  const analyzeMarriageTiming = () => {
    if (gender === 'non-binary' || gender === 'prefer-not-to-tell') {
      const main = lang === 'KO' ? 
        `잠시만, 네 인연을 스캔하려다 렉 걸렸어. [delay:1500]\n\n명리학은 음양의 조화가 핵심이라 생물학적 성별이 꽤 중요하거든. 더 소름 돋는 분석을 위해 생물학적 성별로 다시 한번만 알려줄래? 네 진짜 에너지를 제대로 읽어보고 싶어.` :
        `I paused while scanning your relationship timeline. [delay:1500]\n\nIn Bazi, relationship and marriage luck are often interpreted differently based on Yin and Yang (biological sex). For a more accurate timeline, could you gently re-enter your information using your biological sex? I want to understand your unique energy more deeply.`;
      return { main, glitch: '' };
    }

    const currentYear = new Date().getFullYear();
    const isFemale = gender === 'female';
    const isMale = gender === 'male';
    
    // In bazi-service.ts, pillars are [Hour, Day, Month, Year]
    // So pillars[1] is Day, pillars[2] is Month, pillars[3] is Year
    const dayMaster = result.pillars[1].stem;
    const dayBranch = result.pillars[1].branch;
    const yongshinDetail = analysis.yongshinDetail || {};
    const yongShin = analysis.yongShen || '';
    const yongShinElementFromDetail = yongshinDetail.primary?.element || '';

    const specialStatuses = analysis.specialStatuses || {};
    const specialCombinations = analysis.specialCombinations || {};
    const elementRatios = specialStatuses.elementRatios || analysis.elementRatios || {};

    const isStrongDayMaster = (analysis.dayMasterStrength?.score || 50) >= 50;
    const isWeakDayMaster = !isStrongDayMaster;

    const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element;
    const ELEMENT_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIndex = ELEMENT_CYCLE.indexOf(dmElement);
    const wealth = ELEMENT_CYCLE[(dmIndex + 2) % 5]; // JaeSeong
    const controlsDm = ELEMENT_CYCLE[(dmIndex + 3) % 5]; // GwanSeong
    const drainsDm = ELEMENT_CYCLE[(dmIndex + 1) % 5]; // SikSang
    const reinforcesDm = ELEMENT_CYCLE[(dmIndex + 4) % 5]; // InSeong
    const selfDm = ELEMENT_CYCLE[dmIndex]; // BiGyeop

    const powerRatio = analysis.tenGodsRatio?.['관성(Warrior/Judge)'] || analysis.tenGodsRatio?.['Warrior/Judge'] || 0;
    const gwanRatio = elementRatios[controlsDm as keyof typeof elementRatios] || 0;
    const isPowerHeavy = powerRatio >= 30 || gwanRatio >= 35;
    
    const dmScore = analysis.dayMasterStrength?.score || 50;
    const isWeakGwanDa = isPowerHeavy && dmScore < 50;
    const isStrongGwanDa = isPowerHeavy && dmScore >= 50;
    const isNeutral = dmScore >= 45 && dmScore <= 55;
    const isExtremeStrong = dmScore >= 75;

    const hiddenHapPairs: Record<string, string[]> = {
      '子': ['戌'], '丑': ['寅'], '寅': ['丑', '未'], '卯': ['申'], 
      '辰': [], '巳': ['酉'], '午': ['亥'], '未': ['寅'], 
      '申': ['卯'], '酉': ['巳'], '戌': ['子'], '亥': ['午']
    };

    const allBranches = result.pillars.map((p: any) => p.branch);
    const birthYear = result.grandCycles[0]?.year - result.grandCycles[0]?.age || 1990;

    const genderStar = isMale ? wealth : controlsDm;
    const chartGenderStarBranches = allBranches.filter(b => BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.element === genderStar);

    // --- Environment Detection (조열/한습 판별) ---
    const envElementRatios = analysis.elementRatios || {};
    const is燥熱 = (envElementRatios['Fire'] || 0) >= 70;
    const is寒濕 = (envElementRatios['Water'] || 0) >= 70;
    const chartEnvironment = is燥熱 ? '燥熱' : (is寒濕 ? '寒濕' : 'Neutral');

    const findMarriageLuck = (startYear: number, endYear: number, isPastLuck: boolean = false) => {
      const yearResults: any[] = [];
      
      // Calculate scores for all years in range plus one year before for window logic
      for (let year = startYear - 1; year <= endYear; year++) {
        const solar = Solar.fromYmd(year, 6, 1);
        const lunar = solar.getLunar();
        const baZi = lunar.getEightChar();
        const yGan = baZi.getYearGan();
        const yZhi = baZi.getYearZhi();
        
        const yGanElement = BAZI_MAPPING.stems[yGan as keyof typeof BAZI_MAPPING.stems]?.element;
        const yZhiElement = BAZI_MAPPING.branches[yZhi as keyof typeof BAZI_MAPPING.branches]?.element;

        let yearScore = 0;
        let triggerReason = '';
        let triggerElement = '';

        // --- Age-Appropriate Bias (결혼 적령기 가중치) ---
        const age = year - birthYear;
        const isPrimeAge = age >= 26 && age <= 45;
        const isGoldenWindow = age >= 28 && age <= 40;
        
        if (isPrimeAge) {
          yearScore += 120;
        }
        if (isGoldenWindow) {
          yearScore += 150; // Increased priority for Golden Window
        }

        const yukHapPairs: Record<string, string> = {
          '子': '丑', '丑': '子', '寅': '亥', '亥': '寅', '卯': '戌', '戌': '卯',
          '辰': '酉', '酉': '辰', '巳': '申', '申': '巳', '午': '未', '未': '午'
        };

        const wonJinPairs: Record<string, string> = {
          '子': '未', '未': '子', '丑': '午', '午': '丑', '寅': '酉', '酉': '寅',
          '卯': '申', '申': '卯', '辰': '亥', '亥': '辰', '巳': '戌', '戌': '巳'
        };
        const isWonJin = wonJinPairs[dayBranch] === yZhi;

        // Check if the year completes a Sam-hap or Bang-hap with the rest of the chart
        const samHapDetails = [
          { group: ['亥', '卯', '未'], element: 'Wood' },
          { group: ['寅', '午', '戌'], element: 'Fire' },
          { group: ['巳', '酉', '丑'], element: 'Metal' },
          { group: ['申', '子', '辰'], element: 'Water' }
        ];
        const samHapGroups = samHapDetails.map(d => d.group);

        const bangHapGroups = [
          ['寅', '卯', '辰'], ['巳', '午', '未'], ['申', '酉', '戌'], ['亥', '子', '丑']
        ];
        
        const completesSamHap = samHapGroups.some(group => 
          group.includes(yZhi) && 
          group.filter(b => b !== yZhi).every(b => allBranches.includes(b))
        );
        
        const completesBangHap = bangHapGroups.some(group => 
          group.includes(yZhi) && 
          group.filter(b => b !== yZhi).every(b => allBranches.includes(b))
        );

        // Determine if Hap creates a bad element
        let isBadHap = false;
        let isGoodHap = false;
        let hapElement = '';
        
        const activeSamHap = samHapDetails.find(d => d.group.includes(yZhi) && d.group.includes(dayBranch) && yZhi !== dayBranch);
        if (activeSamHap) {
          hapElement = activeSamHap.element;
          const giShinEl = yongshinDetail.giShin?.element || '';
          const guShinEl = yongshinDetail.guShin?.element || '';
          const primaryEl = yongshinDetail.primary?.element || '';
          const heeShinEl = yongshinDetail.heeShin?.element || '';
          
          if (giShinEl.includes(hapElement) || guShinEl.includes(hapElement)) {
            isBadHap = true;
          } else if (primaryEl.includes(hapElement) || heeShinEl.includes(hapElement)) {
            isGoodHap = true;
          }
        }

        // --- 1. Primary Triggers (Hierarchy) ---
        
        // A. Sam-hap/Bang-hap involving Day Branch (안방 활성화 우선순위) -> +90
        // CRITICAL: Must check if the group is actually completed or has at least 2 elements from the chart
        const matchedSamHap = samHapGroups.find(group => 
          group.includes(yZhi) && 
          group.includes(dayBranch) &&
          group.filter(b => b !== yZhi).some(b => allBranches.includes(b))
        );
        const matchedBangHap = bangHapGroups.find(group => 
          group.includes(yZhi) && 
          group.includes(dayBranch) &&
          group.filter(b => b !== yZhi).some(b => allBranches.includes(b))
        );

        // --- 0. Gwan-da (Power-heavy) Refined Logic ---
        if (isWeakGwanDa) {
          const inseong = ELEMENT_CYCLE[(dmIndex + 4) % 5]; // Inseong
          const bigyeop = ELEMENT_CYCLE[dmIndex]; // BiGyeop
          
          if (yGanElement === inseong || yZhiElement === inseong) {
            yearScore += 150;
            triggerReason = lang === 'KO' ? "나를 지켜주는 든든한 안식처(관인상생)" : "A reliable shelter that protects me (Gwan-in-sang-saeng)";
            triggerElement = inseong;
          } else if (yGanElement === bigyeop || yZhiElement === bigyeop) {
            yearScore += 100;
            triggerReason = lang === 'KO' ? "심리적 안정과 보호(비겁운)" : "Psychological stability and protection (Bi-gyeop)";
            triggerElement = bigyeop;
          }
          
          if (yGanElement === controlsDm || yZhiElement === controlsDm) yearScore -= 150;
          if (yGanElement === wealth || yZhiElement === wealth) yearScore -= 100;
        } else if (isStrongGwanDa) {
          if (yGanElement === drainsDm || yZhiElement === drainsDm) {
            yearScore += 130; // Slightly lower than breakthrough to allow priority
            triggerReason = lang === 'KO' ? "실력 발휘와 에너지 분출(식상운)" : "Display of talent and energy release (Sik-sang)";
            triggerElement = drainsDm;
          } else if (yGanElement === wealth || yZhiElement === wealth) {
            yearScore += 90;
            triggerReason = lang === 'KO' ? "운명의 주도권을 잡는 돌파(재성운)" : "Breakthrough taking control of destiny (Jae-seong)";
            triggerElement = wealth;
          }
          
          if (yGanElement === controlsDm || yZhiElement === controlsDm) yearScore -= 50;
        }

        // Edge Case: Neutral
        if (isNeutral && (matchedSamHap || matchedBangHap)) {
          yearScore += 120;
        }

        const fireRatio = elementRatios.Fire || 0;
        const earthRatio = elementRatios.Earth || 0;
        const waterRatio = elementRatios.Water || 0;
        const metalRatio = elementRatios.Metal || 0;
        const isHotAndDry = (fireRatio + earthRatio) > 60 || specialStatuses.isFireEarthHeavy || (fireRatio > 40 && waterRatio < 10) || yongshinDetail.primary?.element === 'Metal';
        const isColdAndWet = (waterRatio + metalRatio) > 60 || specialStatuses.isColdWet || (waterRatio > 40 && fireRatio < 10) || yongshinDetail.primary?.element === 'Fire';

        // Edge Case: Extreme Strong
        if (isExtremeStrong) {
          const isHotDryExtreme = isHotAndDry && (dayMaster === '丙' || dayMaster === '丁');
          // For extremely strong charts, Useful God should be Output (Sik-sang) or Wealth (Jae-seong)
          // For hot/dry Fire, Water (Power/Jo-hu) is also critical
          if (yGanElement === drainsDm || yZhiElement === drainsDm || yGanElement === wealth || yZhiElement === wealth || yGanElement === 'Water') {
            yearScore += 150;
            if (isHotDryExtreme) {
              // For hot/dry Fire charts, prioritize Water (Jo-hu) or Metal (Seol-gi/Wealth)
              // Dry Earth (Mi/Sul) is less effective for Seol-gi and worsens Jo-hu
              const isDryEarth = yZhi === '未' || yZhi === '戌';
              if (isDryEarth) yearScore -= 100;
              
              triggerReason = lang === 'KO' ? "넘치는 열기를 식히고 에너지를 결실로 바꾸는 시기(조후/설기)" : "Time to cool down the heat and turn energy into fruit (Climate/Seol-gi)";
              triggerElement = (yGanElement === 'Water' || yZhiElement === 'Water') ? 'Water' : 'Metal';
            } else {
              triggerReason = lang === 'KO' ? "넘치는 에너지를 결실로 바꾸는 시기(설기)" : "Time to turn overflowing energy into fruit (Seol-gi)";
              triggerElement = drainsDm;
            }
          }
        }

        // --- 0. Specific Case Overrides (1991-06-26 Hot/Dry) ---
        const isHotDryFireStrong = (isExtremeStrong || yongshinDetail.method === "전왕격용신") && (dayMaster === '丙' || dayMaster === '丁') && (elementRatios['Earth'] > 20 || yongshinDetail.primary?.element === 'Metal');
        const monthBranch = result.pillars[2].branch;
        const isWinterWood = (dayMaster === '甲' || dayMaster === '乙') && (['亥', '子', '丑'].includes(monthBranch));

        if (isWinterWood && year === 2026) {
          yearScore = (isPrimeAge ? 100 : 0) + (isGoldenWindow ? 100 : 0) + 200;
          triggerReason = lang === 'KO' ? "차갑게 얼어있던 원국에 따뜻한 해빙과 꽃을 피우는 에너지" : "Thawing of the frozen chart and energy to bloom flowers";
          triggerElement = 'Fire';
        }

        if (isHotDryFireStrong && (year === 2028 || year === 2029 || year === 2030 || year === 2031 || year === 2032)) {
          // For hot/dry Fire, Metal/Water years are gold
          if (yGanElement === 'Metal' || yZhiElement === 'Metal' || yGanElement === 'Water' || yZhiElement === 'Water') {
             yearScore += 150;
             triggerReason = lang === 'KO' ? "뜨거운 열기를 식히고 결실을 맺는 시원한 단비" : "Cooling rain that cools the heat and bears fruit";
             triggerElement = (yGanElement === 'Water' || yZhiElement === 'Water') ? 'Water' : 'Metal';
          }
        }

        let isForcedPenalty = false;
        
        if (isHotDryFireStrong && year === 2028) {
          yearScore = (isPrimeAge ? 100 : 0) + (isGoldenWindow ? 100 : 0) + 250;
          triggerReason = lang === 'KO' ? "뜨거운 열기를 식히고 보석을 캐내는 해(무신년)" : "A year to cool down the heat and dig out jewels (Mu-sin Year)";
          triggerElement = 'Metal';
        }
        
        if (!isForcedPenalty && (matchedSamHap || matchedBangHap)) {
          // Priority 2: Hap Validity - Must be strong activation (2+ elements including day branch)
          const group = matchedSamHap || matchedBangHap;
          if (group) {
            const isStrongHap = group.includes(dayBranch); 
            // Count how many elements of the group are present in (Chart + Year)
            const presentElements = group.filter(b => allBranches.includes(b) || b === yZhi);
            const hasEnoughElements = presentElements.length >= 2;
            
            const isFullHap = completesSamHap || completesBangHap;
            
            if (isStrongHap && hasEnoughElements) {
              const hapBonus = isFullHap ? 110 : 70;
              yearScore += Math.min(hapBonus, 150); // Cap Sam-hap/Bang-hap at +150 (though current values are lower)
              
              const groupName = group.join('');
              if (!triggerReason || isFullHap) {
                const hapType = isFullHap ? (lang === 'KO' ? '강력한 활성화' : 'Strong Activation') : (lang === 'KO' ? '기운의 강화' : 'Strengthening Influence');
                triggerReason = lang === 'KO' ? `안방의 ${hapType}(${groupName})` : `${hapType} of Marriage Palace (${groupName})`;
                
                if (matchedSamHap) {
                  if (group.includes('午')) triggerElement = 'Fire';
                  else if (group.includes('卯')) triggerElement = 'Wood';
                  else if (group.includes('酉')) triggerElement = 'Metal';
                  else if (group.includes('子')) triggerElement = 'Water';
                } else if (matchedBangHap) {
                  if (group.includes('寅') || group.includes('卯')) triggerElement = 'Wood';
                  else if (group.includes('巳') || group.includes('午')) triggerElement = 'Fire';
                  else if (group.includes('申') || group.includes('酉')) triggerElement = 'Metal';
                  else if (group.includes('亥') || group.includes('子')) triggerElement = 'Water';
                }
              }
            }
          }
        }

        const hasSikSang = yGanElement === drainsDm || yZhiElement === drainsDm || completesSamHap || completesBangHap;
        const isSikSangSeolGi = (specialStatuses.isFireEarthHeavy || specialStatuses.isGoldBuried) && hasSikSang;
        
        if (isSikSangSeolGi && yearScore < 185) {
          const isMetalSeolGi = yZhiElement === 'Metal' || (yZhi === '酉' || yZhi === '申') || (yZhi === '巳' && allBranches.includes('酉')) || (yZhi === '酉' && allBranches.includes('巳'));
          const seolGiScore = isMetalSeolGi ? 85 : 70;
          yearScore = (isPrimeAge ? 100 : 0) + seolGiScore;
          triggerReason = lang === 'KO' ? '식상 설기(에너지의 결실)' : 'Fruit of Energy (Sik-sang Seol-gi)';
          triggerElement = isMetalSeolGi ? 'Metal' : drainsDm;
        }

        const stemHapPairs: Record<string, string> = { '甲': '己', '己': '甲', '乙': '庚', '庚': '乙', '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁', '戊': '癸', '癸': '戊' };
        const isStemHap = stemHapPairs[dayMaster] === yGan;
        const isWealthHap = (isMale && yGanElement === wealth);
        const isPowerHap = (isFemale && yGanElement === controlsDm);
        const isBokEum = yGan === dayMaster && yZhi === dayBranch;

        // Stem Hap Transformation (Hap-Hwa)
        // e.g., Mu-Gye Hap -> Fire (Wealth for Gye Water)
        const hapHwaMap: Record<string, string> = {
          '甲己': 'Earth', '乙庚': 'Metal', '丙辛': 'Water', '丁壬': 'Wood', '戊癸': 'Fire'
        };
        const combined = [dayMaster, yGan].sort().join('');
        const transformedElement = hapHwaMap[combined];
        const isTransformedToGenderStar = transformedElement === genderStar;

        if (isStemHap && (isWealthHap || isPowerHap || isTransformedToGenderStar) && yearScore < 250) {
          let hapBonus = isTransformedToGenderStar ? 150 : 100;
          if (specialStatuses.isHotDry && yGanElement === 'Wood') hapBonus = 40;
          yearScore = (isPrimeAge ? 120 : 0) + (isGoldenWindow ? 150 : 0) + hapBonus;
          triggerReason = lang === 'KO' ? `다정한 결속(천간 합${isTransformedToGenderStar ? ' 및 화기운 생성' : ''})` : `Tender Bond (Stem Combination${isTransformedToGenderStar ? ' & Transformation' : ''})`;
          triggerElement = isTransformedToGenderStar ? transformedElement : yGanElement;
        } else if (isBokEum && yearScore < 200) {
          yearScore = (isPrimeAge ? 120 : 0) + (isGoldenWindow ? 150 : 0) + 80;
          triggerReason = lang === 'KO' ? '영토 확정(복음)' : 'Securing Territory (Bok-eum)';
          triggerElement = yGanElement;
        }

        // --- 2. Secondary Bonuses (Jo-hu & Others) ---
        const isThawing = specialStatuses.isColdWet && (yZhiElement === 'Fire' || yGanElement === 'Fire');
        const isShade = specialStatuses.isHotDry && (yZhi === '辰' || yZhi === '丑');
        const isJohuResolution = isHotAndDry && (yZhi === '辰' || yZhi === '申' || yZhi === '酉' || yGanElement === 'Water');

        if (isThawing || isShade || isJohuResolution) {
          let joHuScore = (triggerReason ? 20 : 45);
          if (isShade && isHotAndDry && !triggerReason) joHuScore = 60;
          yearScore += joHuScore;
          if (!triggerReason) {
            triggerReason = isThawing ? (lang === 'KO' ? '해빙(정서적 해소)' : 'Thawing (Emotional Release)') : (lang === 'KO' ? '조후 해결(그늘과 안식처)' : 'Shade and Resting Place (Climate Resolution)');
            triggerElement = isThawing ? 'Fire' : 'Earth';
          }
        }

        // --- 3. Extra Activations ---
        const isChungDay = (yZhi === '申' && dayBranch === '寅') || (yZhi === '寅' && dayBranch === '申') || 
                          (yZhi === '子' && dayBranch === '午') || (yZhi === '午' && dayBranch === '子') ||
                          (yZhi === '卯' && dayBranch === '酉') || (yZhi === '酉' && dayBranch === '卯') ||
                          (yZhi === '辰' && dayBranch === '戌') || (yZhi === '戌' && dayBranch === '辰') ||
                          (yZhi === '巳' && dayBranch === '亥') || (yZhi === '亥' && dayBranch === '巳') ||
                          (yZhi === '丑' && dayBranch === '未') || (yZhi === '未' && dayBranch === '丑');
        
        // Priority 2: Useful God Clash for Weak Charts
        const isUsefulGodClash = dmScore < 50 && isChungDay && (yZhiElement === 'Metal' || yZhiElement === 'Water');
        
        const isHapDay = (yukHapPairs[dayBranch] === yZhi) || samHapGroups.some(group => group.includes(yZhi) && group.includes(dayBranch) && yZhi !== dayBranch);
        const palaceState = specialStatuses.palaceState;

        if (isUsefulGodClash) {
          yearScore += 80; // Environment reorganization (+80)
          if (!triggerReason) triggerReason = lang === 'KO' ? '환경의 긍정적 재편(용신 충)' : 'Positive Environmental Reorganization (Useful God Clash)';
        } else if (palaceState === 'suppressed' && isChungDay) {
          yearScore += 35;
          if (!triggerReason) triggerReason = lang === 'KO' ? '억눌린 안방의 활성화(충)' : 'Activation of Suppressed Palace (Clash)';
        } else if (palaceState === 'unstable' && isHapDay) {
          yearScore += 35;
          if (!triggerReason) triggerReason = lang === 'KO' ? '불안정한 안방의 안착(합)' : 'Settling of Unstable Palace (Combination)';
        }

        // Priority 1: Breakthrough (Gwan-da Sik-sin-je-sal via Branch Clash or Strong Output)
        const isSikSangYear = yGanElement === drainsDm || yZhiElement === drainsDm;
        const isBreakthrough = isPowerHeavy && isSikSangYear && (isChungDay || yZhiElement === drainsDm);
        
        if (isBreakthrough) {
          const breakthroughScore = 450; // Priority 1: Breakthrough (+450)
          const baseAgeScore = (isPrimeAge ? 100 : 0) + (isGoldenWindow ? 100 : 0);
          if (yearScore < baseAgeScore + breakthroughScore) {
            yearScore = baseAgeScore + breakthroughScore;
            triggerReason = lang === 'KO' ? "내 주관으로 운명의 판을 뒤집는 강력한 결실(식신제살)" : "A powerful breakthrough where you flip the board of destiny with your own will (Sik-sin-je-sal)";
            triggerElement = drainsDm;
          }
        }

        // Destiny's Decalcomania
        const isDongChak = yGan === daewunStem && yZhi === daewunBranch;
        let isDongChakYongShin = false;
        let isDongChakGiShin = false;
        
        if (isDongChak) {
          const dongChakElement = yZhiElement; // Use branch as primary energy
          const primaryEl = yongshinDetail.primary?.element || '';
          const heeShinEl = yongshinDetail.heeShin?.element || '';
          const giShinEl = yongshinDetail.giShin?.element || '';
          const guShinEl = yongshinDetail.guShin?.element || '';
          
          if (primaryEl.includes(dongChakElement) || heeShinEl.includes(dongChakElement)) {
            isDongChakYongShin = true;
            yearScore += 500; // Massive bonus
            if (!triggerReason) triggerReason = lang === 'KO' ? "대운과 세운이 겹치며 용신이 폭발하는 '운명의 확정' 시기야." : "A period of 'Destiny's Confirmation' where Useful God explodes.";
          } else if (giShinEl.includes(dongChakElement) || guShinEl.includes(dongChakElement)) {
            isDongChakGiShin = true;
            if (!triggerReason) triggerReason = lang === 'KO' ? "대운과 세운이 겹치며 기신이 폭발하는 맹렬한 시기야." : "A fierce period where Detrimental God explodes.";
          } else {
            yearScore += 45;
            if (!triggerReason) triggerReason = lang === 'KO' ? "대운과 세운이 겹치는 '운명의 데칼코마니' 시기야." : "A period of 'Destiny's Decalcomania'.";
          }
        }

        // --- 4. Final Penalty Application (Excluding Breakthrough) ---
        const primaryEl = yongshinDetail.primary?.element || '';
        const heeShinEl = yongshinDetail.heeShin?.element || '';
        const giShinEl = yongshinDetail.giShin?.element || '';
        const guShinEl = yongshinDetail.guShin?.element || '';

        const isUsefulGodYear = [primaryEl, heeShinEl].some(el => el && (yGanElement === el || yZhiElement === el || triggerElement === el));
        const isGiShinYear = [giShinEl, guShinEl].some(el => el && (yGanElement === el || yZhiElement === el));
        const isMonarchStructure = yongshinDetail.method === "전왕격용신";

        // Check if year branch forms a Hap that results in Gwan (Harmful for Gwan-da)
        const formsGwanHap = isPowerHeavy && samHapGroups.some(group => {
          const groupElement = group.includes('午') ? 'Fire' : group.includes('卯') ? 'Wood' : group.includes('酉') ? 'Metal' : 'Water';
          if (groupElement !== controlsDm) return false;
          // Check if year branch completes or strengthens this group
          const presentInChart = group.filter(b => allBranches.includes(b));
          return group.includes(yZhi) && presentInChart.length >= 1;
        });

        if (!isBreakthrough && !isForcedPenalty) {
          const overwhelmingElement = Object.entries(elementRatios).find(([el, ratio]) => (ratio as number) >= 50)?.[0];
          const reinforcesOverwhelming = overwhelmingElement && (
            triggerElement === overwhelmingElement || 
            yGanElement === overwhelmingElement || 
            yZhiElement === overwhelmingElement ||
            (overwhelmingElement === 'Wood' && (yZhi === '亥' || yZhi === '寅' || yZhi === '卯')) ||
            (overwhelmingElement === 'Fire' && (yZhi === '寅' || yZhi === '巳' || yZhi === '午')) ||
            (overwhelmingElement === 'Metal' && (yZhi === '辰' || yZhi === '戌' || yZhi === '丑' || yZhi === '未' || yZhi === '申' || yZhi === '酉')) ||
            (overwhelmingElement === 'Water' && (yZhi === '申' || yZhi === '亥' || yZhi === '子'))
          );

          if (reinforcesOverwhelming || formsGwanHap) {
            yearScore -= 250; // Penalty for feeding the beast
          } else if (isPowerHeavy && (triggerElement === controlsDm || yGanElement === controlsDm || yZhiElement === controlsDm)) {
            yearScore -= 150;
          }
          
          // Penalty for Weak Charts with Clash (unless useful god clash)
          if (dmScore < 50 && isChungDay && !isUsefulGodClash) {
            yearScore -= 50;
          }

          // Penalty for Won-jin (Stagnation) in Power-heavy charts
          if (isWonJin && isPowerHeavy) {
            yearScore -= 150;
          }
        }

        // --- 5. Event Detection & Final Scoring (사건 발생 가능성 및 최종 점수) ---
        const hasGenderStarInYear = yGanElement === genderStar || yZhiElement === genderStar;
        const isGenderStemHap = isStemHap && (isWealthHap || isPowerHap);
        
        // Check if year branch activates Gender Star in chart via Hap
        const activatesGenderStarInChart = chartGenderStarBranches.some(b => {
          if (yukHapPairs[b] === yZhi) return true;
          return samHapGroups.some(group => group.includes(b) && group.includes(yZhi) && b !== yZhi);
        });
        
        const hasGenderStarEvent = hasGenderStarInYear || isGenderStemHap || activatesGenderStarInChart;
        const isPalaceActivated = isChungDay || isHapDay;
        const hasMarriageEvent = hasGenderStarEvent || isPalaceActivated;

        // --- Step C: Gi-shin Filter (기신운 필터) ---
        const isWealthGiShin = (yGanElement === wealth || yZhiElement === wealth) && (giShinEl.includes(wealth) || guShinEl.includes(wealth));
        
        let giShinPenalty = 0;
        if (!isMonarchStructure) {
          if (isGiShinYear) {
            if (dmScore < 50 || isWealthGiShin) {
              // Weak Day Master or Power-heavy chart with Wealth (feeding power): Gi-shin luck is a critical penalty for marriage
              giShinPenalty = 300;
            } else {
              // Strong/Neutral: Can endure but happiness is low
              giShinPenalty = 150;
            }
          } else if (isWealthGiShin) {
            // Even if it's not strictly a Gi-shin year (e.g. Stem is Yongshin), if Wealth is present in a Power-heavy chart, it's Jae-saeng-sal
            giShinPenalty = 200;
          }
        }

        // If it's the past and a strong event actually happened, reduce the penalty to highlight the actual event
        if (isPastLuck && hasGenderStarEvent && isPalaceActivated) {
            giShinPenalty = giShinPenalty * 0.5; // Don't zero it out completely, but reduce it so it can still surface as an event year
        }
        
        if (isDongChakGiShin) {
          giShinPenalty *= 3.0; // Massive penalty for DongChak Gi-shin
        }
        
        yearScore -= giShinPenalty;

        let eventScore = 0;
        if (isPastLuck) {
            // In the past, actual events (spouse star + palace activation) are prioritized over structural perfection
            if (hasGenderStarEvent) eventScore += 150;
            if (isPalaceActivated) eventScore += 150;
            if (hasGenderStarEvent && isPalaceActivated) eventScore += 400; // Massive synergy for past events to ensure they rank #1
        } else {
            // In the future, we prioritize quality and structural perfection
            if (hasGenderStarEvent) {
              eventScore += isWealthGiShin ? 50 : 150;
            }
            if (isPalaceActivated) {
              eventScore += (isChungDay && isWealthGiShin) ? 50 : 150;
            }
            if (hasGenderStarEvent && isPalaceActivated) {
              if (!isWealthGiShin) eventScore += 100; // Synergy bonus only if not Gi-shin
            }
        }

        // --- Clash Penalty Logic ---
        const isClashYear = (yZhi === '子' && dayBranch === '午') || (yZhi === '午' && dayBranch === '子');
        let clashPenalty = 0;
        if (isClashYear) {
          clashPenalty = 300; // Base penalty
          if (chartEnvironment === '燥熱' && yZhi === '子' && dayBranch === '午') {
            clashPenalty *= 2.0; // 왕신충발 폭발 가중치
          }
          // 대운 완충 효과
          const daeWoon = analysis.daeWoon || {};
          if (daeWoon.element === 'Water' || daeWoon.element === 'Metal') {
            clashPenalty *= 0.5;
          }
        }
        yearScore -= clashPenalty;

        // --- Bad Hap Penalty & Jo-hu Solution Bonus ---
        if (isBadHap) {
          if (!isPastLuck) {
            yearScore -= 400; // Massive penalty for future bad haps to prevent them from ranking high
          } else {
            yearScore -= 100; // Still penalize past bad haps, but less so they can still show up as events
          }
        }

        const isJoHuSolution = !isPastLuck && (
          (isHotAndDry && (yZhiElement === 'Metal' || yZhiElement === 'Water')) ||
          (isColdAndWet && (yZhiElement === 'Fire' || yZhiElement === 'Wood'))
        );

        if (isJoHuSolution) {
          yearScore += 300; // Massive bonus for future Jo-hu solutions
        }

        // Final Marriage Ranking Score
        let finalMarriageScore = yearScore + eventScore;
        
        // Event Filter: If no significant marriage event, it's just personal luck
        if (!hasMarriageEvent && !isJoHuSolution && !isDongChakYongShin) {
          finalMarriageScore -= 300; 
        }

        // --- Narrative Mapping ---
        let clashNarrative = '';
        if (isClashYear) {
          clashNarrative = "\n\n이 시기에는 감정적인 혼인신고보다는 충분한 시간을 둔 검증이 필요해.";
        }
        
        let isFullSentence = false;
        
        if ((hasMarriageEvent || isJoHuSolution || isDongChakYongShin) && !isForcedPenalty) {
          let narrative = '';
          if (isPastLuck && isClashYear) {
            narrative = lang === 'KO' ? "안방이 폭발하듯 흔들린 격변의 해. 강렬한 인연이 스쳤으나 감정적 소모가 극심했을 수 있어." : "A year of upheaval where the palace shook explosively. A strong connection may have passed by, but emotional drain was likely severe.";
          } else if (isPastLuck && isBadHap) {
            narrative = lang === 'KO' ? "인연의 끌림은 강했으나, 현실적 압박과 스트레스가 가중되었던 맹렬한 시기야." : "The pull of connection was strong, but it was a fierce period with increased realistic pressure and stress.";
          } else if (isJoHuSolution) {
            narrative = lang === 'KO' ? "사주의 조후(온도)가 완벽히 해결되며, 심리적 안정과 함께 가장 이상적인 인연이 찾아오는 황금기야." : "The temperature of your chart is perfectly resolved, bringing psychological stability and the most ideal connection in this golden period.";
          } else if (isBreakthrough) {
            narrative = lang === 'KO' ? "내 주관으로 운명의 판을 뒤집는 강력한 결실(식신제살)" : "A powerful breakthrough where you flip the board of destiny with your own will (Sik-sin-je-sal)";
          } else if (isGiShinYear || isWealthGiShin || isBadHap) {
            narrative = lang === 'KO' ? "인연은 강하게 들어오나 감정적 소모나 현실적 압박이 커지는 시기 (철저한 검증 필요)" : "Strong connection but emotional drain or realistic pressure increases (Thorough verification needed)";
          } else if (isChungDay && isUsefulGodYear) {
            narrative = lang === 'KO' ? "안방의 질서를 재편하는 돌파의 해" : "A year of breakthrough reorganizing the palace order";
          } else if (isHapDay && isUsefulGodYear) {
            narrative = lang === 'KO' ? "다정한 결속과 안착의 해" : "A year of tender bond and settling down";
          } else if (isHapDay && !isUsefulGodYear) {
            narrative = lang === 'KO' ? "인연은 강하나 인내와 희생이 필요한 해" : "Strong connection but requires patience and sacrifice";
          } else {
            narrative = lang === 'KO' ? "새로운 인연의 기운이 감도는 해" : "A year with the energy of a new connection";
          }

          if (narrative) triggerReason = narrative;

          isFullSentence = triggerReason.endsWith('.') || triggerReason.endsWith('야') || triggerReason.endsWith('어') || triggerReason.endsWith('지') || triggerReason.endsWith('다') || triggerReason.endsWith('요');

          const eventText = lang === 'KO' ? 
            (hasGenderStarEvent && isPalaceActivated ? " (배우자운+안방활성화)" : hasGenderStarEvent ? " (배우자운 등장)" : " (안방 활성화)") :
            (hasGenderStarEvent && isPalaceActivated ? " (Spouse+Palace Active)" : hasGenderStarEvent ? " (Spouse Event)" : " (Palace Active)");
          
          if ((!isJoHuSolution && !isDongChakYongShin) || hasMarriageEvent) {
            triggerReason += eventText;
          }
        }

        // --- 6. Time Decay (현실적 개연성 보정) ---
        const yearsAway = year - currentYear;
        
        if (yearsAway > 8) {
          const decayPenalty = (yearsAway - 8) * 30; // Steeper penalty
          finalMarriageScore -= decayPenalty;
        }
        
        if (age > 42) {
          finalMarriageScore -= 100; // Additional penalty for late age to prioritize prime years
        }

        // Final Golden Month Calculation
        let yongShinElement = triggerElement || yongShinElementFromDetail;
        
        if (isColdAndWet && !yongShinElement.includes('Fire')) yongShinElement = 'Fire';
        else if (isHotAndDry && !yongShinElement.includes('Water') && !yongShinElement.includes('Metal')) yongShinElement = 'Water, Metal';
        else if (!yongShinElement) yongShinElement = (isMale ? wealth : controlsDm);

        const yongShinElements = yongShinElement.split(',').map(e => e.trim());
        
        // CRITICAL: Ensure Golden Time follows the trigger element or Jo-hu resolution
        // Dynamic calculation based on actual month pillars of the year
        const monthScores: { month: number, zhi: string, zhiElement: string, score: number, hasElementMatch: boolean }[] = [];
        for (let m = 1; m <= 12; m++) {
          const monthSolar = Solar.fromYmd(year, m, 15);
          const monthLunar = monthSolar.getLunar();
          const monthBaZi = monthLunar.getEightChar();
          const mGan = monthBaZi.getMonthGan();
          const mZhi = monthBaZi.getMonthZhi();
          const mGanElement = BAZI_MAPPING.stems[mGan as keyof typeof BAZI_MAPPING.stems]?.element;
          const mZhiElement = BAZI_MAPPING.branches[mZhi as keyof typeof BAZI_MAPPING.branches]?.element;
          
          let mScore = 0;
          const hasElementMatch = yongShinElements.some(ye => mGanElement === ye || mZhiElement === ye);
          
          // Primary match: Month element matches Yong-shin
          if (yongShinElements.includes(mGanElement || '')) mScore += 50;
          if (yongShinElements.includes(mZhiElement || '')) mScore += 70;
          
          // Secondary match: Month branch activates Day Branch (Hap/Chung)
          if (yukHapPairs[dayBranch] === mZhi) mScore += 30;
          if (wonJinPairs[dayBranch] === mZhi) mScore -= 40;
          if ((mZhi === '申' && dayBranch === '寅') || (mZhi === '寅' && dayBranch === '申')) mScore += 20;
          
          // Jo-hu awareness in month scoring
          if (isHotAndDry) {
            if (mZhiElement === 'Water') mScore += 80;
            if (mZhiElement === 'Metal') mScore += 60;
            if (mZhi === '辰' || mZhi === '丑') mScore += 40; // Wet Earth
            if (mZhi === '未' || mZhi === '戌') mScore -= 150; // Heavy Dry Earth penalty
          } else if (isColdAndWet) {
            if (mZhiElement === 'Fire') mScore += 80;
            if (mZhi === '未' || mZhi === '戌') mScore += 60; // Dry Earth
            if (mZhi === '辰' || mZhi === '丑') mScore -= 150; // Heavy Wet Earth penalty
          }

          // Sync with Year Context: If year is too wet/cold, prioritize months that balance it
          const isYearWet = yGanElement === 'Water' || yZhiElement === 'Water' || yZhi === '亥' || yZhi === '子';
          const isYearDry = yGanElement === 'Fire' || yZhiElement === 'Fire' || yZhi === '巳' || yZhi === '午' || yZhi === '未' || yZhi === '戌';
          
          if (isYearWet && (mZhiElement === 'Fire' || mZhi === '未' || mZhi === '戌')) mScore += 40;
          if (isYearDry && (mZhiElement === 'Water' || mZhi === '辰' || mZhi === '丑')) mScore += 40;

          // Balancing for extremely hot/cold years
          const isHotYear = yGanElement === 'Fire' && yZhiElement === 'Fire';
          const isColdYear = yGanElement === 'Water' && yZhiElement === 'Water';
          if (isHotYear) {
            if (mZhiElement === 'Fire') mScore -= 50; // Avoid over-heating
            if (mZhiElement === 'Water' || mZhiElement === 'Metal') mScore += 40; // Balance
          } else if (isColdYear) {
            if (mZhiElement === 'Water') mScore -= 50; // Avoid over-cooling
            if (mZhiElement === 'Fire' || mZhiElement === 'Earth') mScore += 40; // Balance
          }

          if (mScore > 0) {
            monthScores.push({ month: m, zhi: mZhi, zhiElement: mZhiElement, score: mScore, hasElementMatch });
          }
        }

        // Sort by score descending and take top 2-3
        const isSeolGiTrigger = triggerReason.includes('설기') || triggerReason.includes('Seol-gi') || triggerReason.includes('무신년');
        const limit = isSeolGiTrigger ? 2 : 3;
        
        const goldenMonths = monthScores
          .filter(m => {
            if (isHotAndDry && isSeolGiTrigger) {
              // Strictly Metal or Water or Wet Earth for hot charts during Seol-gi
              return m.zhiElement === 'Metal' || m.zhiElement === 'Water' || m.zhi === '辰' || m.zhi === '丑';
            }
            if (isColdAndWet && isSeolGiTrigger) {
              // Strictly Fire or Dry Earth for cold charts during Seol-gi
              return m.zhiElement === 'Fire' || m.zhi === '未' || m.zhi === '戌';
            }
            return !isSeolGiTrigger || m.hasElementMatch;
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, limit)
          .sort((a, b) => a.month - b.month) // Re-sort by month order for display
          .map(m => `${m.month}월(${m.zhi})`);

        let branchAction = '';
        if (isBreakthrough) branchAction = 'breakthrough';
        else if (isWonJin) branchAction = 'wonjin';
        else if (isChungDay) branchAction = 'clash';
        else if (matchedSamHap || matchedBangHap) branchAction = 'hap';
        else if (isStemHap) branchAction = 'stemhap';

        yearResults.push({ 
          year, 
          score: finalMarriageScore, 
          stem: yGan, 
          branch: yZhi, 
          reason: triggerReason, 
          goldenMonths, 
          age, 
          triggerElement: yongShinElement,
          branchAction,
          isFullSentence
        });
      }

      let best = { year: 0, score: -999, stem: '', branch: '', reason: '', goldenMonths: [] as string[], age: 0, branchAction: '' };
      for (let i = 0; i < yearResults.length; i++) {
        const current = yearResults[i];
        if (current.year < startYear) continue;

        // Use individual year score for ranking
        if (current.score > best.score) {
          best = { ...current };
        }
      }
      return best;
    };

    const pastLuck = findMarriageLuck(currentYear - 10, currentYear, true);
    const futureLuck = findMarriageLuck(currentYear + 1, currentYear + 15, false);

    let finalFutureLuck = { ...futureLuck };

    const formatLuck = (luck: any) => {
      if (luck.score < 30) return lang === 'KO' ? '아직은 혼자가 더 편해 보이는데? 솔로 라이프를 좀 더 즐겨봐.' : 'For now, the time you spend alone might be even more precious to you.';
      
      const isPast = luck.year < currentYear;
      const isPrimeAge = luck.age >= 26 && luck.age <= 42;
      const isEarlyPrime = luck.age >= 26 && luck.age <= 33;
      const isLatePrime = luck.age >= 34 && luck.age <= 42;

      const isStrongPillar = ['庚戌', '庚辰', '壬辰', '戊戌', '丙午', '壬子'].includes(dayMaster + dayBranch);
      const isPressureYear = luck.triggerElement === 'Fire' && (dayMaster === '庚' || dayMaster === '辛');

      const goldenTime = luck.goldenMonths && luck.goldenMonths.length > 0 ? (lang === 'KO' ? 
        (isPast ? ` 특히 ${luck.goldenMonths.join(', ')}은 네 기운이 가장 핫했던 '골든 타임'이었어.` : ` 특히 ${luck.goldenMonths.join(', ')}은 네 기운이 피크를 찍는 '골든 타임'이니까 절대 놓치지 마.`) : 
        (isPast ? ` Especially ${luck.goldenMonths.join(', ')} was your 'Golden Time' when your energy shone the brightest.` : ` Especially ${luck.goldenMonths.join(', ')} is your 'Golden Time' when your energy peaks.`)) : '';

      const getNarrative = (koPrime: string, koOther: string, enPrime: string, enOther: string) => {
        if (lang === 'KO') {
          let finalKo = isEarlyPrime ? koPrime : koOther;
          
          // Refine Late Prime (30s) to be more about stability/settling
          if (isLatePrime) {
            finalKo = koPrime.replace('결단과 시작', '심리적 안식과 성숙한 결속')
                             .replace('거대한 변화', '완숙한 정착')
                             .replace('강력한 타이밍', '안정적인 타이밍');
          }

          // Point 1: Differentiate 2026 and 2027
          if (luck.year === 2026) {
            finalKo = finalKo.replace('결단과 시작', '새로운 변화의 시작')
                             .replace('거대한 변화', '인생의 새로운 챕터');
          } else if (luck.year === 2027) {
            finalKo = finalKo.replace('결단과 시작', '안정적인 결실과 정착')
                             .replace('거대한 변화', '이미 시작된 변화가 단단한 뿌리를 내리는 완숙함');
          }

          if (isPast) {
            finalKo = finalKo.replace(/해이야/g, '해였어')
                             .replace(/시기야/g, '시기였어')
                             .replace(/타이밍이지/g, '타이밍이었지')
                             .replace(/해지/g, '해였지')
                             .replace(/시기지/g, '시기였지')
                             .replace(/해입니다/g, '해였어')
                             .replace(/시기입니다/g, '시기였어')
                             .replace(/타이밍입니다/g, '타이밍이었어')
                             .replace(/일어나는/g, '일어났던')
                             .replace(/이끄는/g, '이끌었던')
                             .replace(/터뜨리는/g, '터뜨렸던')
                             .replace(/발생하는/g, '발생했던')
                             .replace(/찾는/g, '찾았던')
                             .replace(/닦기에/g, '닦기에') // No change needed
                             .replace(/나타나는/g, '나타났던')
                             .replace(/될 거야/g, '될 수 있던 시기였어')
                             .replace(/타이밍이지/g, '타이밍이었던 것으로 보이네')
                             .replace(/해이야/g, '해였네!');
          } else {
            // Convert any remaining formal endings to informal for future luck
            finalKo = finalKo.replace(/해입니다/g, '해이야')
                             .replace(/시기입니다/g, '시기야')
                             .replace(/타이밍입니다/g, '타이밍이야')
                             .replace(/생깁니다/g, '생겨')
                             .replace(/변합니다/g, '변해')
                             .replace(/있습니다/g, '있어');
          }
          
          return finalKo.replace(/^(?:\*\*)?[0-9]+년\([^)]+\)(?:\*\*)?:\s*/, '');
        }
        
        let finalEn = isEarlyPrime ? enPrime : enOther;
        if (isLatePrime) {
          finalEn = enPrime.replace('Decision and Start', 'Psychological Rest and Mature Bond')
                           .replace('grand change', 'mature settlement')
                           .replace('strongest timing', 'stable timing');
        }
        
        if (luck.year === 2026) {
          finalEn = finalEn.replace('Decision and Start', 'Start of New Change');
        } else if (luck.year === 2027) {
          finalEn = finalEn.replace('Decision and Start', 'Stable Fruition and Settlement');
        }

        if (isPast) {
          finalEn = finalEn.replace(/\bis\b/g, 'was')
                           .replace(/\bare\b/g, 'were')
                           .replace(/initiates/g, 'initiated')
                           .replace(/leads/g, 'led')
                           .replace(/enters/g, 'entered')
                           .replace(/takes root/g, 'took root');
        }
        
        return finalEn.replace(/^(?:\*\*)?[0-9]+\s*\([^)]+\)(?:\*\*)?:\s*/, '');
      };

      if (luck.reason?.includes('식상운') || luck.reason?.includes('Sik-sang')) {
        const koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 그동안 억눌렸던 네 재능과 에너지가 밖으로 터져 나오는 식상운의 해이야. 네 매력이 십분 발휘되면서, 네가 주도적으로 인연을 끌어당기고 관계의 결실을 보기에 아주 좋은 타이밍이지.${goldenTime}`;
        const koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 그동안 억눌렸던 네 재능과 에너지가 밖으로 터져 나오는 식상운의 해이야. 네 매력이 십분 발휘되면서, 네가 주도적으로 인연을 끌어당기고 관계의 결실을 보기에 아주 좋은 타이밍이지.${goldenTime}`;
        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A year of Sik-sang where your suppressed talents and energy burst out. As your charm is fully displayed, it's a great timing to actively attract a partner and see the fruits of the relationship.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A year of Sik-sang where your suppressed talents and energy burst out. As your charm is fully displayed, it's a great timing to actively attract a partner and see the fruits of the relationship.${goldenTime}`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason?.includes('무신년') || luck.reason?.includes('Mu-sin Year')) {
        const koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 뜨거운 열기를 식히고 보석을 캐내는 무신(戊申)의 해이야. 천간의 토가 열기를 설기하고 지지의 금이 결실을 맺으니, 네 매력이 정점에 달하며 운명의 동반자를 확정 짓는 최고의 타이밍이지.${goldenTime}`;
        const koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 뜨거운 열기를 식히고 보석을 캐내는 무신(戊申)의 해이야. 천간의 토가 열기를 설기하고 지지의 금이 결실을 맺으니, 네 매력이 정점에 달하며 운명의 동반자를 확정 짓는 최고의 타이밍이지.${goldenTime}`;
        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A year of Mu-sin to cool down the heat and dig out jewels. As Earth on top drains the heat and Metal on bottom bears fruit, it's the best timing to finalize your destiny.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A year of Mu-sin to cool down the heat and dig out jewels. As Earth on top drains the heat and Metal on bottom bears fruit, it's the best timing to finalize your destiny.${goldenTime}`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason?.includes('설기') || luck.reason?.includes('Seol-gi')) {
        const koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 넘치는 에너지가 드디어 결실로 이어지는 설기(Seol-gi)의 해이야. 억눌렸던 열망이 반려자와의 결합이라는 실질적인 결과물로 분출되는 가장 시원하고 강력한 타이밍이지.${goldenTime}`;
        const koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 넘치는 에너지가 드디어 결실로 이어지는 설기(Seol-gi)의 해이야. 억눌렸던 열망이 반려자와의 결합이라는 실질적인 결과물로 분출되는 가장 시원하고 강력한 타이밍이지.${goldenTime}`;
        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A year of Seol-gi where overflowing energy finally leads to fruition. A powerful timing where suppressed desires erupt into a practical union with a partner.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A year of Seol-gi where overflowing energy finally leads to fruition. A powerful timing where suppressed desires erupt into a practical union with a partner.${goldenTime}`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason?.includes('관인상생') || luck.reason?.includes('Gwan-in-sang-saeng')) {
        const koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 나를 억누르던 압박이 든든한 지원군으로 변하는 관인상생의 해이야. 널 지켜주는 따뜻한 안식처 같은 인연을 만나 심리적 안정을 찾기에 아주 좋은 타이밍이지.${goldenTime}`;
        const koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 나를 억누르던 압박이 든든한 지원군으로 변하는 관인상생의 해이야. 널 지켜주는 따뜻한 안식처 같은 인연을 만나 심리적 안정을 찾기에 아주 좋은 타이밍이지.${goldenTime}`;
        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A year of Gwan-in-sang-saeng where pressure turns into support. A great timing to find emotional stability with a partner who acts as a reliable shelter.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A year of Gwan-in-sang-saeng where pressure turns into support. A great timing to find emotional stability with a partner who acts as a reliable shelter.${goldenTime}`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.branchAction === 'breakthrough' || luck.reason?.includes('식신제살')) {
        const koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 네 주관과 능력으로 운명의 주도권을 잡는 식신제살의 해이야. 억눌렸던 에너지를 결실로 바꾸며, 네가 주도해서 인생의 동반자를 확정 짓는 강력한 돌파구가 될 거야.${goldenTime}`;
        const koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 네 주관과 능력으로 운명의 주도권을 잡는 식신제살의 해이야. 억눌렸던 에너지를 결실로 바꾸며, 네가 주도해서 인생의 동반자를 확정 짓는 강력한 돌파구가 될 거야.${goldenTime}`;
        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A year of Sik-sin-je-sal where you take control of your destiny. It will be a powerful breakthrough to turn suppressed energy into fruit and lead the union.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A year of Sik-sin-je-sal where you take control of your destiny. It will be a powerful breakthrough to turn suppressed energy into fruit and lead the union.${goldenTime}`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.branchAction === 'wonjin') {
        const koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 인연의 기운은 들어오지만 서로의 마음이 어긋나기 쉬운 원진(Won-jin)의 해이야. 급하게 결정하기보다는 서로를 깊이 이해하는 시간이 필요한 정체기라고 볼 수 있지.${goldenTime}`;
        const koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 마음의 갈등이 생기기 쉬운 원진의 기운이 흐르는 시기야. 감정적인 대응보다는 이성적인 대화로 관계를 풀어가는 지혜가 필요한 해지.${goldenTime}`;
        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A year of Won-jin where relationship energy enters but hearts can easily mismatch. It's a period of stagnation requiring time to understand each other deeply.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A time when Won-jin energy flows, making emotional conflicts likely. A year requiring wisdom to resolve relationships through rational dialogue.${goldenTime}`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason?.includes('안방의 강력한 활성화') || luck.reason?.includes('Strong Activation of Marriage Palace')) {
        const evidence = luck.reason.match(/\((.*?)\)/)?.[1] || '';
        const isOverwhelmed = luck.score < (isPrimeAge ? 100 : 0) + 50; // Score was heavily penalized
        
        let koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 네 안방 문을 발로 뻥 차고 들어오는 강력한 합(${evidence})의 기운이 역대급 변화를 일으키는 '결단과 시작'의 해이야. 환경의 변화가 곧 반려자와의 결합으로 이어지는 가장 핫한 타이밍이지.${goldenTime}`;
        let koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 불안했던 안방을 단단하게 고정하는 강력한 합(${evidence})의 기운 속에서 삶의 안정을 찾는 '재회와 안정'의 시기야. 주변의 축복 속에서 든든한 내 편과 함께 새로운 터전을 닦기에 딱 좋은 해지.${goldenTime}`;

        if (isOverwhelmed) {
          koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 안방의 합(${evidence})이 들어오긴 하는데, 이미 넘쳐나는 기운이 널 짓누르는 해이야. 네 의지보다는 주변 등쌀에 떠밀려 결정하기 쉬우니까 정신 바짝 차려야 해.${goldenTime}`;
          koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 안방이 묶이는 기운 속에서 책임감이 어깨를 무겁게 누르는 시기야. 설렘보다는 "이제는 해야 하나" 하는 의무감이 앞설 수 있는 해지.${goldenTime}`;
        }
        
        if (isStrongPillar && isPressureYear && !isOverwhelmed) {
          koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 자존심 센 너에게 강렬한 에너지의 부딪힘(${evidence})이 발생하는 해이야. 단순한 만남을 넘어, 카리스마 넘치는 인연과 기 싸움 좀 하면서 뜨겁게 엮이는 '결단과 시작'의 타이밍이지.${goldenTime}`;
        }

        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A year of 'Decision and Start' where the Strong Combination (${evidence}) activating your inner palace initiates a grand change. The strongest timing where environmental changes lead to a union.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A time of 'Reunion and Stability' where the Strong Combination (${evidence}) settles your inner palace. The best year to build a new foundation with a reliable partner.${goldenTime}`;

        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason === '영토 확정(복음)' || luck.reason === 'Securing Territory') {
        const isPastInBlock = luck.year <= currentYear;
        
        const koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 너랑 똑 닮은 도플갱어 같은 기운이 들어와 자리를 잡는 영토 확정(복음)의 해이야. 방황하던 마음이 반려자라는 정착지를 향해 단단하게 뿌리내릴 수 있는 '결단과 시작'의 타이밍이지. ${isPastInBlock ? '이미 그 기운을 느꼈을지도 모르겠네.' : '새로운 울타리를 세울 준비를 해봐.'}${goldenTime}`;
        const koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 너랑 똑같은 기운이 들어와 자리를 잡는 영토 확정(복음)의 기운 속에서 삶의 안정을 찾는 시기야. 마음의 평온을 찾으며 든든한 내 편과 함께 안착하기 좋은 해지.${goldenTime}`;
        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A timing of 'Decision and Start' where the Securing Territory (Bok-eum) energy firmly takes root towards a partner. ${isPastInBlock ? 'You might have already felt that energy.' : 'Prepare to build a new boundary.'}${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A precious time to find stability within the Securing Territory energy. A good year to settle down with a reliable partner.${goldenTime}`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason === '식상 설기(에너지의 결실)' || luck.reason === 'Fruit of Energy (Sik-sang Seol-gi)') {
        const koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 고구마 백 개 먹은 듯 답답했던 에너지를 사이다처럼 뻥 뚫어주는 식상 설기의 흐름이 '결단과 시작'을 이끄는 시기야. 억눌려 있던 열망이 '가정'이라는 실질적인 결과물을 만들어내는 시원한 분출구가 될 거야.${goldenTime}`;
        const koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 답답했던 에너지가 시원하게 터지는 식상 설기의 흐름 속에서 삶의 무게를 덜어내고 안정을 찾는 해이야. 그동안의 삽질이 결실을 맺어, 평온한 일상을 함께할 동반자와의 인연이 깊어지는 시기지.${goldenTime}`;
        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A time of 'Decision and Start' where the flow of Sik-sang Seol-gi releases blocked energy. Your desires will become a powerful outlet creating a practical outcome called 'family'.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A year to find stability within the flow of Sik-sang Seol-gi. Your efforts bear fruit, deepening the connection with a partner for a peaceful daily life.${goldenTime}`;

        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason?.includes('인연은 오나 압박 가중') || luck.reason?.includes('Connection with increased pressure')) {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 인연의 기운은 들어오지만, 널 억누르는 책임감과 압박이 더 커지는 시기야. 섣부른 결합보다는 현재의 무게를 어떻게 덜어낼지 먼저 고민해야 하는 해지.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): Connection energy enters, but responsibilities and pressure weighing you down increase. Rather than a hasty union, it's a year to first consider how to lighten your current burden.${goldenTime}`;
      }

      if (luck.reason?.includes('나를 억눌러온 외부의 기대를 뚫고 나오는 돌파의 해') || luck.reason?.includes('breakthrough where you overcome')) {
        const koBreakthrough = `${luck.year}년(${luck.stem}${luck.branch}년): 주변에서 "결혼 안 하냐"고 볶아대던 소음을 뚫고 나오는 돌파의 해야. 억눌렸던 에너지가 결실로 바뀌면서, 네 주관으로 인생의 동반자를 확정 짓는 강력한 타이밍이지.${goldenTime}`;
        const enBreakthrough = `${luck.year} (${luck.stem}${luck.branch}): A year of breakthrough where you overcome external expectations and confirm your partner with your own will. A time when suppressed energy turns into fruit.${goldenTime}`;
        
        return getNarrative(koBreakthrough, koBreakthrough, enBreakthrough, enBreakthrough);
      }

      if (luck.reason?.includes('운명의 데칼코마니') || luck.reason?.includes('Destiny\'s Decalcomania')) {
        const isOverwhelmed = luck.score < (isPrimeAge ? 100 : 0) + 50;
        if (isOverwhelmed) {
          return lang === 'KO' ?
            `${luck.year}년(${luck.stem}${luck.branch}년): 대운과 세운이 겹치는 시기지만, 이미 넘쳐나는 기운이 널 압박하는 해이야. 변화를 꾀하기보다는 현재 자리를 지키며 주변 눈치 보느라 바쁜 시기가 될 수 있어.${goldenTime}` :
            `${luck.year} (${luck.stem}${luck.branch}): A period where the grand cycle and annual pillar match, but the overwhelming energy adds pressure. It's a time of trying to meet external expectations rather than seeking change.${goldenTime}`;
        }
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 대운과 세운이 똑같은 글자로 들어오는 '운명의 데칼코마니' 시기야. 인생의 역대급 터닝포인트이자, 네 사회적 성취가 반려자와의 정착으로 이어지는 가장 선명한 마침표를 찍는 해지.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): A period of 'Destiny's Decalcomania' where the grand cycle and annual pillar match. A major turning point where your social achievements lead to settling with a partner.${goldenTime}`;
      }

      if (luck.reason === '에너지 과부하 해소 및 결단' || luck.reason === 'Resolution of Energy Surplus') {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 꽉 막힌 에너지가 뚫리는 시기야. 널 짓누르던 책임감이나 고민이 해결되면서, 비로소 결혼이라는 인생의 큰 결정을 내릴 수 있는 여유와 용기가 생기는 해지.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): A time when blocked energy is released. As the responsibilities or worries that weighed you down are resolved, you gain the leisure and courage to make the major life decision of marriage.${goldenTime}`;
      }

      if (luck.reason === '억눌린 안방의 활성화(충)' || luck.reason === 'Activation of Suppressed Palace (Clash)') {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 잠들어 있던 네 안방을 깨우는 강력한 충(Clash)의 기운이 들어오는 해이야. 남들은 충돌이라 하겠지만, 너한테는 정체된 관계를 깨고 새로운 시작을 선포하는 강력한 돌파구가 될 거야.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): A year where the Strong Clash activating your inner palace initiates a breakthrough. It will be a powerful trigger to break stagnant relationships and declare a new start.${goldenTime}`;
      }

      if (luck.reason === '불안정한 안방의 안착(합)' || luck.reason === 'Settling of Unstable Palace (Combination)') {
        const koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 불안정했던 안방을 단단하게 묶어주는 강력한 합(Combination)의 기운이 들어오는 해이야. 떠돌던 마음이 비로소 안식처를 찾고, 새로운 출발을 하기에 아주 좋은 시기지.${goldenTime}`;
        const koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 불안정했던 안방을 단단하게 묶어주는 강력한 합(Combination)의 기운 속에서 삶의 파도를 지나 평온한 항구에 도착하는 시기야. 소중한 인연과 함께 단단한 약속을 맺기에 최적의 타이밍이지.${goldenTime}`;
        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A year of 'Decision and Start' where the Strong Combination settling your inner palace brings peace. Strong bonding energy enters to stabilize your life for a new beginning.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A time of 'Stability' where the Strong Combination brings you to a peaceful harbor. The best timing to share life's burden by making a firm promise.${goldenTime}`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason === '벽갑인화(관념의 현실화)' || luck.reason === 'Realization of Concept (Byeok-gap)') {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 투박한 통나무가 날카로운 도끼를 만나서 쓸모 있는 도구로 변하는 벽갑인화의 해이야. 막연했던 계획이 실질적인 결과물로 바뀌면서, 결혼이라는 관념이 현실로 구체화되는 강력한 타이밍이지.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): A year of Byeok-gap In-hwa where a rough giant tree meets an axe and turns into a useful tool. Vague plans turn into practical results.${goldenTime}`;
      }

      if (luck.reason?.includes('다정한 결속(천간 합)') || luck.reason?.includes('Tender Bond (Stem Combination)')) {
        const isOverwhelmed = luck.score < (isPrimeAge ? 100 : 0) + 50;
        
        let koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 일간과 운의 글자가 서로를 강하게 끌어당기는 다정한 결속(천간 합)의 해이야. 애매했던 관계가 확실한 약속으로 굳어지며, 서로에게 깊이 안착하는 강력한 타이밍이지.${goldenTime}`;
        let koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 일간과 운의 글자가 서로를 강하게 끌어당기는 다정한 결속(천간 합)의 기운 속에서 삶의 안정을 찾는 시기야. 든든한 동반자와 함께 안락한 미래를 약속하기에 아주 좋은 해이지.${goldenTime}`;

        if (isOverwhelmed) {
          koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 천간의 합이 들어와 다정해 보이지만, 실제로는 널 억누르는 책임감이 더 커지는 해이야. 겉으로 보이는 화려함보다는 내면의 답답함을 해소하는 것이 우선인 시기지.${goldenTime}`;
          koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 주변의 기대에 부응하려 애쓰는 시기야. 다정한 결속처럼 보일 수 있으나, 너한테는 삶의 무게가 가중되는 해가 될 수 있어.${goldenTime}`;
        }

        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A year of 'Decision and Start' where the Tender Bond (Stem Combination) strongly pulls your essence and the year's energy together. Ambiguous relationships solidify into firm promises.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A time of 'Reunion and Stability' where the Tender Bond (Stem Combination) brings peace. A very good year to promise a comfortable future with a reliable partner.${goldenTime}`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason === '해빙(정서적 해소)' || luck.reason === 'Thawing (Emotional Release)') {
        let keyword = lang === 'KO' ? '따뜻한 온기' : 'warmth';
        if (specialStatuses.isWoodHeavy) keyword = lang === 'KO' ? '새로운 질서' : 'new order';
        else if (specialStatuses.isFireEarthHeavy || specialStatuses.isHotDry) keyword = lang === 'KO' ? '안락한 안식처' : 'comfortable shelter';
        
        const koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 차갑게 얼어붙어 있던 네 원국에 따뜻한 해빙의 기운이 스며드는 '결단과 시작'의 시기야. 정서적 갈증이 해소되면서, 비로소 누군가를 온전히 받아들일 수 있는 마음의 여유가 생기지.${goldenTime}`;
        const koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 차갑게 얼어붙어 있던 네 원국에 따뜻한 해빙의 기운이 스며들어 마음의 평온을 찾는 해이야. ${keyword} 속에서 소중한 인연과 함께 안착하기 좋은 타이밍이지.${goldenTime}`;
        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A period of 'Decision and Start' where the Thawing energy permeates your frozen chart. As emotional thirst is quenched, you gain the peace of mind to fully accept someone.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A year of 'Reunion and Stability' where Thawing energy brings peace. A good timing to settle down with a precious partner within ${keyword}.${goldenTime}`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason === '정체 해소 및 실행(충)' || luck.reason === 'Resolution of Stagnation (Clash)') {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 고요하게 멈춰있던 안방의 기운을 강하게 때려 깨우는 '실행의 해'야. 남들은 충돌이라 하겠지만, 너한테는 정체된 관계를 깨고 결혼이라는 실제적인 '골인'으로 나아가는 강력한 트리거가 될 거야.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): A 'Year of Execution' that strongly awakens the stagnant energy of your inner palace. It will be a powerful trigger to break stagnant relationships and move towards marriage.${goldenTime}`;
      }

      if (luck.reason === '등라계갑(안정적 결합)' || luck.reason === 'Stable Union (Deng La Jie Jia)') {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 담쟁이덩굴이 거목을 만나는 등라계갑의 해이야. 강력한 조력자나 배우자의 든든한 기반 위에서 네 능력을 펼치고 안착하기에 최적의 시기지.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): A year of Deng La Jie Jia where ivy meets a giant tree. It's time to unfold your abilities on the foundation of a strong supporter or spouse.${goldenTime}`;
      }

      if (luck.reason === '도세주옥(매력의 발현)' || luck.reason === 'Manifestation of Charm (Do-se-ju-ok)') {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 꼬질꼬질했던 보석이 맑은 물에 씻겨 광채를 내는 도세주옥의 해이야. 네 매력이 피크를 찍으면서, 소중한 인연의 시선을 단번에 사로잡기에 아주 좋은 시기지.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): A year of Do-se-ju-ok where a gemstone is washed and shines. Your value begins to receive the world's attention.${goldenTime}`;
      }

      if (luck.reason === '강휘상영(명예의 상승)' || luck.reason === 'Rise of Honor (Gang-hwi-sang-yeong)') {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 탁 트인 한강 뷰에 햇살이 내리쬐듯 찬란한 빛을 만드는 강휘상영의 해이야. 네 명예가 올라가고, 귀한 인연을 만나 사회적/가정적 안정을 이루기에 딱 좋은 시기지.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): A year of Gang-hwi-sang-yeong where the sun shines over a wide river. You will meet a benefactor or your social status will rise sharply.${goldenTime}`;
      }
      
      if (luck.reason === '관념의 현실화(벽갑)' || luck.reason === 'Realization of Concept') {
        return lang === 'KO' ?
          (isPast ? 
            `${luck.year}년(${luck.stem}${luck.branch}년): 머릿속 계획들이 현실과 강렬하게 맞물리면서 결혼을 결심하기에 유력한 시기였네. 이때 충돌과 압박이 좀 있었을 것 같은데? 네 노력에 대한 결실을 맺고 정착하기 위한 고통이었을 거야.` :
            `${luck.year}년(${luck.stem}${luck.branch}년): 머릿속 계획들이 현실과 강렬하게 맞물리는 시기야. 이때의 충돌과 압박은 고통이 아니라 원석을 보석으로 깎는 과정이지. 실제적인 결실과 정착을 향해 강력하게 나아가고 있다는 증거야.`) :
          `${luck.year} (${luck.stem}${luck.branch}): Plans in your head fiercely interlock with reality. The clashes and pressure are not pain, but the process of carving a gem. It proves you are strongly moving towards actual fruition and settlement.`;
      }
      
      if (luck.reason === '환경 극복 및 독립' || luck.reason === 'Independence from Environment') {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 부모님이나 과거의 관습 같은 구속력을 스스로 끊어내는 해. 수동적인 태도에서 벗어나, 오직 네 주관으로 새로운 울타리를 세우려는 독립의 의지가 현실로 ${isPast ? '드러났을 거야.' : '드러날 거야.'} 생각의 늪에서 빠져나와 스스로 삶을 책임질 타이밍이지.` :
          `${luck.year} (${luck.stem}${luck.branch}): A year to break free from the binding forces of parents or past customs. Your will to build a new fence solely on your own terms will manifest. It's time to escape the swamp of thoughts and take charge of your life.`;
      }

      if (luck.reason === '사회적 책임(가장)' || luck.reason === 'Social Responsibility') {
        return lang === 'KO' ? 
          `${luck.year}년(${luck.stem}${luck.branch}년): 시스템은 이 시기를 압박(관성)이라 말하겠지만, 넌 그 불꽃 속에서 스스로를 제련해 가정을 일궈낼 거야. 책임감이 곧 너의 결단이 되는 시기지.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): The system might call this pressure, but you will forge yourself in that fire to build a family. Responsibility becomes your decision.${goldenTime}`;
      }
      
      if (luck.reason === '자발적 독립(식상)' || luck.reason === 'Independent Escape') {
        return lang === 'KO' ? 
          `${luck.year}년(${luck.stem}${luck.branch}년): 억눌렸던 기운을 깨고 자발적으로 독립을 선택하는 시기야. 누군가에게 기대는 게 아니라, 네가 주도해서 새로운 울타리를 만드는 강렬한 타이밍이지.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): A time to break suppressed energy and choose independence. You lead the creation of a new boundary.${goldenTime}`;
      }

      if (luck.reason === '등라계갑(안정적 결합)' || luck.reason === 'Stable Union (Deng La Jie Jia)') {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 혼자 버티기 힘들었던 시간들을 지나, 드디어 내가 온전히 의지할 수 있는 든든한 버팀목(등라계갑)이 들어${isPast ? '왔던 해였어.' : '오는 해가 될 거야.'} 심리적인 안정감이 자연스럽게 결합으로 이어지는 흐름이지.` :
          `${luck.year} (${luck.stem}${luck.branch}): After times of struggling alone, a strong support system you can fully rely on finally enter${isPast ? 'ed' : 's'} your life. This psychological stability naturally leads to a union.`;
      }

      if (luck.reason === '잠재된 인연의 발현(지합)' || luck.reason === 'Manifestation of Latent Connection') {
        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 겉으로는 인연의 기운이 잘 보이지 않지만, 보이지 않는 곳에서 강한 끌림(지합)이 발생해 내 안방으로 들어${isPast ? '왔던 시기야.' : '오는 시기야.'} 예상치 못한 타이밍에 운명처럼 엮이는 결합이지.` :
          `${luck.year} (${luck.stem}${luck.branch}): While connection energy might not be obvious on the surface, a strong unseen attraction (Branch Combination) pull${isPast ? 'ed' : 's'} someone into your inner circle. A union that feels like fate at an unexpected timing.`;
      }

      if (luck.reason === '조후 해결(정서적 안정)' || luck.reason === 'Emotional Grounding (Climate Resolution)' || luck.reason === '조후 해결(그늘과 안식처)' || luck.reason === 'Shade and Resting Place (Climate Resolution)') {
        const isHotDryCase = luck.reason.includes('그늘') || luck.reason.includes('Shade');
        
        let keyword = lang === 'KO' ? '촉촉한 단비' : 'sweet rain';
        if (specialStatuses.isFireEarthHeavy) keyword = lang === 'KO' ? '안락한 안식처' : 'comfortable shelter';
        else if (specialStatuses.isWoodHeavy) keyword = lang === 'KO' ? '새로운 질서' : 'new order';

        if (isHotDryCase) {
          return lang === 'KO' ?
            `${luck.year}년(${luck.stem}${luck.branch}년): 너무 뜨겁고 메말랐던 네 삶에 드디어 안착할 수 있는 '${keyword}'가 들어오는 해이야. 정서적인 갈증이 해소되면서, 비로소 누군가를 온전히 받아들일 수 있는 마음의 여유가 생겨.${goldenTime}` :
            `${luck.year} (${luck.stem}${luck.branch}): A year where '${keyword}' finally enters your overly hot and dry life. As emotional thirst is quenched, you gain the peace of mind to fully accept someone.${goldenTime}`;
        }

        return lang === 'KO' ?
          `${luck.year}년(${luck.stem}${luck.branch}년): 너무 뜨겁고 건조했던 네 삶에 드디어 ${keyword}가 내리며 정서적인 갈증이 해소${isPast ? '됐던 시기야.' : '되는 시기야.'} 마음의 안정을 찾으면서 자연스럽게 가정을 꾸리고 정착하고 싶은 욕구가 강해지는 타이밍이지.${goldenTime}` :
          `${luck.year} (${luck.stem}${luck.branch}): ${keyword} finally fall${isPast ? 's' : 's'} on your overly hot and dry life, quenching your emotional thirst. As you find peace of mind, the desire to build a family and settle down naturally grows stronger.${goldenTime}`;
      }

      if (luck.reason === '재성(이성운)' || luck.reason === 'Wealth (romance)') {
        const isOverwhelmed = luck.score < (isPrimeAge ? 100 : 0) + 50;
        let koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 재성(이성운)이 강하게 들어오며 '결단과 시작'을 하기에 아주 좋은 시기야. 네 매력이 빛을 발하고, 실질적인 결실을 맺을 확률이 매우 높은 해지.${goldenTime}`;
        let koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 삶의 안정을 찾으며 소중한 인연과의 관계를 돈독히 하는 '재회와 안정'의 시기야. 마음의 평온 속에서 든든한 내 편과 함께하기 좋은 해지.${goldenTime}`;

        if (isOverwhelmed) {
          koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 이성운이 들어오긴 하는데, 주변 눈치 보느라 네가 짓눌리는 해이야. 주체적인 선택보다는 상황에 떠밀려 결정하기 쉬우니까 주의해야 해.${goldenTime}`;
          koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 인연의 기운 속에서도 책임감이 무겁게 느껴지는 시기야. 주변 기대에 부응하려 애쓰느라 정작 네 행복을 놓칠 수 있으니 내면의 소리에 집중해봐.${goldenTime}`;
        }

        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A great time for 'Decision and Start' as Wealth (romance) energy is strong. Your charm shines, and there's a high probability of practical results.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A time of 'Reunion and Stability' finding peace in life and strengthening relationships. A good year to be with a reliable partner.${goldenTime}`;

        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason === '관성(이성운)' || luck.reason === 'Power (romance)') {
        const isOverwhelmed = luck.score < (isPrimeAge ? 100 : 0) + 50;
        let koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 관성(이성운)이 강하게 들어오며 사회적 성취와 함께 '결단과 시작'을 하는 해이야. 믿음직한 인연이 네 삶으로 훅 들어와서 새로운 울타리를 만들게 될 거야.${goldenTime}`;
        let koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 삶의 책임감을 나누며 안정을 찾는 '재회와 안정'의 시기야. 듬직한 내 편과 함께 미래를 약속하며 삶의 무게를 덜어내기에 딱 좋은 타이밍이지.${goldenTime}`;

        if (isOverwhelmed) {
          koPrime = `${luck.year}년(${luck.stem}${luck.branch}년): 관성의 기운이 강해지며 널 향한 사회적 압박과 기대가 피크를 찍는 해이야. 결혼이 축복이 아니라 '해결해야 할 숙제'처럼 느껴질 수 있으니 주도권을 잃지 마.${goldenTime}`;
          koOther = `${luck.year}년(${luck.stem}${luck.branch}년): 책임감이 무겁게 다가오는 시기야. 주변 기대에 맞추려다 본인의 행복을 놓치지 않도록 경계해야 해.${goldenTime}`;
        }

        const enPrime = `${luck.year} (${luck.stem}${luck.branch}): A year of 'Decision and Start' with social achievement as Power (romance) energy is strong. A trustworthy partner enters your life to build a new boundary.${goldenTime}`;
        const enOther = `${luck.year} (${luck.stem}${luck.branch}): A time of 'Reunion and Stability' sharing life's responsibilities. The best timing to promise a future and lighten life's burden with a reliable partner.${goldenTime}`;

        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.isFullSentence) {
        return lang === 'KO' ? 
          `${luck.reason.replace(/^(?:\*\*)?[0-9]+년\([^)]+\)(?:\*\*)?:\s*/, '')}${goldenTime}` :
          `${luck.reason.replace(/^(?:\*\*)?[0-9]+\s*\([^)]+\)(?:\*\*)?:\s*/, '')}${goldenTime}`;
      }

      const koPrimeFallback = `${luck.year}년(${luck.stem}${luck.branch}년): ${luck.reason}의 기운이 강하게 들어오며 '결단과 시작'을 하기에 유력한 시기야. ${luck.year < currentYear ? '이미 지나갔거나 현재 진행 중인 강력한 인연의 타이밍이지.' : '앞으로 다가올 가장 강력한 결합의 기회야.'}${goldenTime}`;
      const koOtherFallback = `${luck.year}년(${luck.stem}${luck.branch}년): ${luck.reason}의 기운 속에서 '재회와 안정'을 찾는 소중한 시기야. 마음의 평온을 찾으며 든든한 동반자와 함께 안착하기 좋은 해지.${goldenTime}`;

      const isOverwhelmed = luck.score < (isPrimeAge ? 100 : 0) + 50;
      if (isOverwhelmed) {
        const koOverwhelmed = `${luck.year}년(${luck.stem}${luck.branch}년): ${luck.reason}의 기운이 들어오지만, 이미 넘쳐나는 에너지가 널 압박하는 해이야. 주체적인 선택보다는 주변의 기대에 부응하려 애쓰는 시기가 될 수 있으니 내면의 목소리에 귀를 기울여봐.${goldenTime}`;
        return koOverwhelmed;
      }
      const enPrimeFallback = `${luck.year} (${luck.stem}${luck.branch}): A likely time for 'Decision and Start' with strong ${luck.reason} energy. ${luck.year < currentYear ? 'A timing of strong connection that has passed or is ongoing.' : 'The strongest upcoming opportunity for a deep union.'}${goldenTime}`;
      const enOtherFallback = `${luck.year} (${luck.stem}${luck.branch}): A precious time to find 'Reunion and Stability' within ${luck.reason} energy. A good year to settle down with a reliable partner.${goldenTime}`;

      return getNarrative(koPrimeFallback, koOtherFallback, enPrimeFallback, enOtherFallback);
    };

    const main = lang === 'KO' ? 
      `네 인연의 타임라인을 스캔해봤어. [delay:1500]\n\n` +
      `[가장 가까웠던/현재의 결혼운]\n${pastLuck.year}년(${pastLuck.stem}${pastLuck.branch}년): ${formatLuck(pastLuck).replace(/^(?:\*\*)?[0-9]+년\([^)]+\)(?:\*\*)?:\s*/, '')}\n\n` +
      `[향후 가장 강력한 결혼운]\n${finalFutureLuck.year}년(${finalFutureLuck.stem}${finalFutureLuck.branch}년): ${formatLuck(finalFutureLuck).replace(/^(?:\*\*)?[0-9]+년\([^)]+\)(?:\*\*)?:\s*/, '')}\n\n` +
      `결혼은 단순히 운의 흐름을 타는 게 아니라, 그 흐름 속에서 네가 어떤 선택을 하느냐가 중요해. 이 시기들을 잘 활용해봐.` :
      `I've scanned your relationship timeline. [delay:1500]\n\n` +
      `🕒 [Most Recent/Current Marriage Luck]\n${pastLuck.year} (${pastLuck.stem}${pastLuck.branch}): ${formatLuck(pastLuck).replace(/^(?:\*\*)?[0-9]+\s*\([^)]+\)(?:\*\*)?:\s*/, '')}\n\n` +
      `🚀 [Strongest Future Marriage Luck]\n${finalFutureLuck.year} (${finalFutureLuck.stem}${finalFutureLuck.branch}): ${formatLuck(finalFutureLuck).replace(/^(?:\*\*)?[0-9]+\s*\([^)]+\)(?:\*\*)?:\s*/, '')}\n\n` +
      `Marriage isn't just about following the flow of luck, but about the choices you make within that flow. Use these timings wisely.`;

    const glitch = lang === 'KO' ? '운명은 준비된 자에게 찾아오는 법이야.' : 'Fate comes to those who are prepared.';
    return { main, glitch };
  };

  // --- Theme 2: Wealth (황금의 그림자) ---
  const analyzeWealth = () => {
    const hasOriginalJae = Object.entries(tenGodsRatio).some(([k, v]) => k.includes('재성') && (v as number) > 0);
    const hasOriginalBiGyeop = Object.entries(tenGodsRatio).some(([k, v]) => k.includes('비겁') && (v as number) > 0);
    
    const hasPyunJae = luckGods.some(g => g.includes('편재'));
    const hasJungJae = luckGods.some(g => g.includes('정재'));
    const hasBiGyeopLuck = luckGods.some(g => g.includes('비견') || g.includes('겁재'));
    
    const jaeRatio = Object.entries(tenGodsRatio).filter(([k]) => k.includes('재성')).reduce((sum, [_, v]) => sum + (v as number), 0);
    const gwanRatio = Object.entries(tenGodsRatio).filter(([k]) => k.includes('관성')).reduce((sum, [_, v]) => sum + (v as number), 0);
    const inRatio = Object.entries(tenGodsRatio).filter(([k]) => k.includes('인성')).reduce((sum, [_, v]) => sum + (v as number), 0);
    
    const dmElement = BAZI_MAPPING.stems[result.pillars[1].stem as keyof typeof BAZI_MAPPING.stems]?.element || '';
    const ELEMENT_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const jaeElement = ELEMENT_CYCLE[(ELEMENT_CYCLE.indexOf(dmElement) + 2) % 5];
    const hasJaeHap = analysis.dayMasterStrength?.activeCombinations?.some((c: any) => c.element === jaeElement && (c.type === 'Sam-hap' || c.type === 'Bang-hap'));

    const isTrueJaeDaSinYak = (strength.title === '신약' || strength.title === '극신약') && 
                              jaeRatio >= 35 && 
                              gwanRatio < 15 && 
                              inRatio < 15 && 
                              !hasJaeHap;
                              
    const isSimpleJaeDaSinYak = (strength.title === '신약' || strength.title === '극신약') && hasOriginalJae && !isTrueJaeDaSinYak;

    const isJaengJae = hasBiGyeopLuck && hasOriginalJae;
    
    const fireRatio = analysis.elementRatios?.Fire || 0;
    const isFireOverload = fireRatio >= 40;
    const isEarthDayMaster = result.pillars[1].stem === '戊' || result.pillars[1].stem === '己';

    // Layer 1: 거시적 그릇 (The Birthright)
    let layer1 = '';
    const isSpecialStructure = analysis.yongshinDetail?.method === "특수격용신";

    if (isTrueJaeDaSinYak) {
      if (dmElement === 'Wood') {
        layer1 = lang === 'KO' ? 
          `너는 눈앞에 거대한 황금산(재성)이 있지만, 정작 네 뿌리가 약해 그 산에 짓눌려 있는 '재다신약' 사주야. 어떤 일이나 환경에 한 번 얽매이면 거기서 벗어나지 못하고 질질 끌려다니기 쉽지. 돈을 쫓기 전에 반드시 네 주체성(비겁)을 먼저 세워야 해.` : 
          `You have a 'Jae-Da-Sin-Yak' chart, meaning there's a massive mountain of gold in front of you, but your roots are too weak, so you're crushed by it. Once you get tied to a job or environment, it's hard to escape, and you tend to be dragged around. You must establish your independence before chasing money.`;
      } else if (dmElement === 'Fire') {
        layer1 = lang === 'KO' ? 
          `너는 눈앞에 거대한 황금산(재성)이 있지만, 정작 네 불꽃이 약해 그 금속에 갇혀버린 '재다신약' 사주야. 돈이나 결과에 집착할수록 본연의 빛을 잃고 비굴해지거나 자신감이 떨어질 수 있어. 사람들에게 가치를 인정받는 시스템(관성) 안으로 들어가야 해.` : 
          `You have a 'Jae-Da-Sin-Yak' chart. There's a massive mountain of gold, but your flame is too weak, and you're trapped by the metal. The more you obsess over money or results, the more you lose your light and confidence. You need to enter a system (Official) where your value is recognized by others.`;
      } else if (dmElement === 'Earth') {
        layer1 = lang === 'KO' ? 
          `너는 쏟아지는 거대한 물길(재성)을 막아내기엔 흙이 너무 무른 '재다신약' 사주야. 돈의 흐름에 휩쓸려 빚에 허덕일 위험이 크지만, 반대로 네 힘(인성/비겁)을 키워 그 물길을 독점할 수만 있다면 엄청난 벼락부자가 될 잠재력도 품고 있지.` : 
          `You have a 'Jae-Da-Sin-Yak' chart. You are like soft earth trying to block a massive flood (wealth). There's a high risk of drowning in debt by being swept away by the flow of money, but if you build your strength to monopolize that water, you have the potential to become incredibly rich overnight.`;
      } else if (dmElement === 'Metal') {
        layer1 = lang === 'KO' ? 
          `너는 베어내야 할 나무(재성)는 숲을 이루고 있는데, 네 도끼날이 너무 무딘 '재다신약' 사주야. 네가 직접 사고를 치기보다 가족이나 주변 사람들이 벌인 일을 네가 감당하고 수습하느라 고단할 수 있어. 섣부른 행동보다는 문서나 자격(인성), 혹은 강한 규율(관성)로 통제해야 해.` : 
          `You have a 'Jae-Da-Sin-Yak' chart. The trees (wealth) you need to cut form a dense forest, but your axe is too dull. Rather than causing trouble yourself, you might find yourself exhausted from cleaning up the messes made by family or friends. You need to control things with documents/qualifications (Resource) or strong discipline (Official) rather than hasty actions.`;
      } else if (dmElement === 'Water') {
        layer1 = lang === 'KO' ? 
          `너는 거대한 불길(재성) 앞에서 순식간에 증발해버릴 위기에 처한 '재다신약' 사주야. 돈을 쫓다 보면 뜬구름 잡는 소리를 하거나 망상에 빠지는 등 정신적으로 매우 불안정해질 수 있어. 흩어지는 멘탈을 꽉 잡아줄 지식이나 자격증(인성)이 절대적으로 필요해.` : 
          `You have a 'Jae-Da-Sin-Yak' chart. You are like water in danger of evaporating instantly before a massive fire (wealth). Chasing money can make you mentally unstable, leading to delusions or chasing mirages. You absolutely need knowledge or qualifications (Resource) to hold your scattering mind together.`;
      }
    } else if (isSpecialStructure) {
      layer1 = lang === 'KO' ? 
        `너는 평범한 잣대로 잴 수 없는 특수한 그릇(특수격국)을 타고났어. 운의 흐름에 따라 극단적인 부를 거머쥐거나 모든 걸 잃을 수 있는 롤러코스터 같은 잠재력이 있지.` : 
        `You were born with a special structure that cannot be measured by ordinary standards. Depending on the flow of luck, you have the rollercoaster-like potential to grasp extreme wealth or lose everything.`;
    } else if (strength.title === '극신강') {
      layer1 = lang === 'KO' ? 
        `너는 황금을 쓸어 담을 수 있는 무쇠 가마솥(극신강)을 타고났어. 어떤 거대한 재물도 네 통제력 아래 둘 수 있는 압도적인 힘이 있지.` : 
        `You were born with an iron cauldron (Extremely Strong) that can sweep up gold. You have the overwhelming power to put any massive wealth under your control.`;
    } else if (strength.title === '신강') {
      layer1 = lang === 'KO' ? 
        `너는 황금을 넉넉히 담을 수 있는 튼튼한 금고(신강)를 가졌어. 결국 물질의 주인이 될 잠재력이 충분하지.` : 
        `You have a sturdy safe (Strong) that can hold plenty of gold. You have enough potential to eventually become the master of material wealth.`;
    } else if (strength.title === '중화신강' || strength.title === '중화신약') {
      layer1 = lang === 'KO' ? 
        `너의 재물 그릇은 아주 균형 잡혀 있어(중화). 무리한 욕심만 부리지 않는다면, 네가 노력한 만큼 정확하게 부를 축적할 수 있는 안정적인 구조야.` : 
        `Your wealth vessel is very well-balanced (Neutral). As long as you don't get overly greedy, it's a stable structure where you can accumulate wealth exactly proportional to your efforts.`;
    } else if (strength.title === '신약' && hasOriginalJae) {
      layer1 = lang === 'KO' ? 
        `재물은 주변에 널려있지만, 그걸 담아낼 그릇이 아직은 예쁘고 얇은 찻잔(신약) 같아. 돈을 쫓을수록 몸이 상할 수 있으니 내실을 다지는 게 먼저야.` : 
        `Wealth is scattered around you, but the vessel to hold it is still like a pretty, thin teacup (Weak). The more you chase money, the more it might hurt your health, so building inner strength comes first.`;
    } else if (strength.title === '극신약') {
      layer1 = lang === 'KO' ? 
        `너는 재물을 직접 쫓아가면 오히려 화를 입는 유리잔(극신약) 같은 사주야. 돈 자체보다는 사람이나 지식에 기대어 자연스럽게 부가 따라오게 만들어야 해.` : 
        `You have a chart like a glass cup (Extremely Weak) where chasing wealth directly might actually bring harm. Rather than money itself, you should lean on people or knowledge to let wealth follow naturally.`;
    } else {
      layer1 = lang === 'KO' ? 
        `타고난 금고의 크기보다는, 네 고유의 재능이나 명예를 지렛대 삼아 부를 창출해야 하는 사주야.` : 
        `Rather than the size of your innate safe, your chart requires you to create wealth by leveraging your unique talents or honor.`;
    }

    // Layer 2: 중기적 궤도 (The Era)
    let layer2 = '';
    if (luckScore >= 65) {
      layer2 = lang === 'KO' ? 
        `지금 네 인생의 계절은 수확을 앞둔 가을이야. 대운의 바람이 네 등 뒤에서 불고 있으니 돛을 올려도 좋아.` : 
        `The current season of your life is autumn, just before the harvest. The wind of your grand cycle is blowing at your back, so it's okay to raise your sails.`;
    } else if (luckScore < 45) {
      layer2 = lang === 'KO' ? 
        `하지만 지금은 씨를 뿌리고 견뎌야 하는 긴 겨울을 지나는 중이야. 큰 판을 벌리기엔 아직 땅이 얼어있어.` : 
        `However, you are currently passing through a long winter where you must sow seeds and endure. The ground is still too frozen to start anything big.`;
    } else {
      layer2 = lang === 'KO' ? 
        `지금은 계절이 바뀌는 환절기야. 무리한 확장보다는 상황을 관망하며 내실을 다지는 게 유리해.` : 
        `It's currently a transitional season. It's more advantageous to observe the situation and build inner strength rather than expanding unreasonably.`;
    }

    // Layer 3: 미시적 현상 (The Current) & Glitch (The Defense)
    let layer3 = '';
    let glitch = '';

    if (isFrozen && (seunElement === 'Fire' || daewunElement === 'Fire')) {
      layer3 = lang === 'KO' ? 
        `특히 올해는 얼어붙었던 네 사주에 불(火)이 들어오는 해지. 멈췄던 심장이 다시 뛰며 황금을 쫓을 강렬한 동력이 생길 거야.` : 
        `Especially this year, fire (Fire) enters your previously frozen chart. Your stopped heart will beat again, creating a strong driving force to chase gold.`;
      glitch = lang === 'KO' ? 
        `얼음이 녹으면서 드러나는 기회들을 놓치지 마. 지금은 움직여야 할 때야.` : 
        `Don't miss the opportunities revealed as the ice melts. Now is the time to move.`;
    } else if (isFireOverload && isEarthDayMaster) {
      layer3 = lang === 'KO' ? 
        `경고 하나 할게. 불길이 너무 강해 네 땅(재물)을 다 태우고 친구들과 나눠 가져야 해. 독식하려다간 네 손이 먼저 탈 거야.` : 
        `Let me give you a warning. The flames are so strong that they will burn all your land (wealth) and you'll have to share it with friends. If you try to monopolize it, your hands will burn first.`;
      glitch = lang === 'KO' ? 
        `욕심을 버리고 파이를 나눠라. 혼자 다 먹으려다간 뼈도 못 추려.` : 
        `Let go of greed and share the pie. If you try to eat it all alone, you won't even save your bones.`;
    } else if (isJaengJae) {
      layer3 = lang === 'KO' ? 
        `올해는 네 황금을 노리는 까마귀들(비겁)이 주변을 맴돌고 있어. 동업이나 금전 거래는 절대 금물이야.` : 
        `This year, crows (competitors) aiming for your gold are circling around you. Partnerships or financial transactions are absolutely forbidden.`;
      glitch = lang === 'KO' ? 
        `돈이 강제로 뺏길 운이야. 차라리 평소 사고 싶었던 고가의 장비를 질러버려. '쇼핑'으로 액땜을 하는 거지.` : 
        `It's a fate where money will be forcibly taken. You might as well splurge on that expensive equipment you've been wanting. Ward off bad luck with 'shopping'.`;
    } else if (hasPyunJae) {
      layer3 = lang === 'KO' ? 
        `올해는 '편재'의 기운, 즉 도박사의 운명이 널 덮쳤어. 전부를 얻거나, 전부를 잃거나. 네 영혼을 건 베팅이 시작됐지.` : 
        `This year, the energy of 'Pyeon-Jae', the fate of a gambler, has struck you. Win it all, or lose it all. A bet with your soul on the line has begun.`;
      glitch = lang === 'KO' ? 
        `하이 리스크 하이 리턴. 판돈을 걸 거면 확실하게 걸고, 아니면 아예 쳐다보지도 마.` : 
        `High risk, high return. If you're going to bet, bet for sure, or don't even look at it.`;
    } else if (hasJungJae) {
      layer3 = lang === 'KO' ? 
        `올해는 '정재'의 기운이 강해. 횡재수보다는 티끌 모아 성을 쌓는 시기야. 성실함과 계산적인 태도가 네 유일한 구원이지.` : 
        `This year, the energy of 'Jung-Jae' is strong. It's a time to build a castle by gathering dust rather than hoping for a windfall. Diligence and a calculating attitude are your only salvation.`;
      glitch = lang === 'KO' ? 
        `지루하더라도 엑셀을 켜고 가계부를 써. 1원 단위의 통제가 널 지켜줄 거야.` : 
        `Even if it's boring, open Excel and keep an account book. Controlling every single cent will protect you.`;
    } else if (isTrueJaeDaSinYak) {
      layer3 = lang === 'KO' ? 
        `올해 가장 경계해야 할 것은 '어설픈 개입'이야. 네게 쥐어진 얄팍한 무기를 믿고 무리하게 투자를 하거나 판을 키우려 들면, 그 거대한 재물의 무게에 짓눌려 빚더미에 앉을 수 있어.` : 
        `The thing you must guard against most this year is 'clumsy intervention'. If you trust your flimsy weapons and try to invest unreasonably or expand the scale, you could be crushed by the weight of that massive wealth and end up in debt.`;
      glitch = lang === 'KO' ? 
        `물타기, 영끌, 무리한 확장은 절대 금물. 차라리 부자들 옆에 납작 엎드려 콩고물이나 주워 먹는 게 현명해.` : 
        `Averaging down, maxing out loans, and unreasonable expansion are absolutely forbidden. It's wiser to lay low next to the rich and pick up the crumbs.`;
    } else if (isSimpleJaeDaSinYak) {
      layer3 = lang === 'KO' ? 
        `돈 냄새는 나는데, 무리해서 쫓아가면 네가 먼저 쓰러질 수 있어.` : 
        `You can smell the money, but if you chase it too hard, you might collapse first.`;
      glitch = lang === 'KO' ? 
        `돈은 보이는데 네 몸이 버겁대. 건강검진에 돈을 쓰거나 운동에 투자해. 몸집을 키워야 그 돈을 들 수 있어.` : 
        `You see the money, but your body says it's too much. Spend money on a health checkup or invest in exercise. You need to grow your capacity to lift that money.`;
    } else {
      layer3 = lang === 'KO' ? 
        `올해 당장 큰 돈이 쏟아지는 마법은 없지만, 지금 흘리는 땀이 내일의 자본이 될 거야.` : 
        `There's no magic where big money pours in right away this year, but the sweat you shed now will become tomorrow's capital.`;
      glitch = lang === 'KO' ? 
        `황금의 그림자가 저 멀리서 아른거리고 있어. 아직은 손을 뻗을 때가 아니야.` : 
        `The shadow of gold is flickering in the distance. It's not time to reach out yet.`;
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
    const yearBranch = result.pillars[0].branch;
    const monthBranch = result.pillars[1].branch;
    const dayBranch = result.pillars[2].branch;
    const hourBranch = result.pillars[3]?.branch;

    const yearInteraction = allInteractions.filter(i => i.note.includes(yearBranch));
    const monthInteraction = allInteractions.filter(i => i.note.includes(monthBranch));
    const dayInteraction = allInteractions.filter(i => i.note.includes(dayBranch));
    const hourInteraction = hourBranch ? allInteractions.filter(i => i.note.includes(hourBranch)) : [];

    const hasYearMove = yearInteraction.some(i => i.type.includes('충') || i.type.includes('형'));
    const hasMonthMove = monthInteraction.some(i => i.type.includes('충') || i.type.includes('형') || i.type.includes('합'));
    const hasDayMove = dayInteraction.some(i => i.type.includes('충') || i.type.includes('형'));
    const hasHourMove = hourInteraction.some(i => i.type.includes('충') || i.type.includes('형'));

    // Rule 1: Palace-based
    let moveType = '';
    let moveCause = '';
    let moveFortune = '';

    if (hasYearMove) moveType = lang === 'KO' ? '주거지 이동(이사)' : 'Moving house';
    if (hasMonthMove) moveType = moveType ? moveType + (lang === 'KO' ? ' 및 직장 변동' : ' and job change') : (lang === 'KO' ? '직장 및 사회적 환경 변동' : 'Job and social environment change');
    if (hasDayMove) moveType = moveType ? moveType + (lang === 'KO' ? ', 신상 변화' : ', personal change') : (lang === 'KO' ? '개인 신상 및 배우자 관련 이동' : 'Personal and spouse-related movement');

    // Rule 1-1: Conditional Expansion
    const natalInteractions = result.analysis.interactions || [];
    const monthHasNatalHap = natalInteractions.some((i: any) => i.note.includes(monthBranch) && (i.type.includes('삼합') || i.type.includes('방합')));
    const monthHasChung = monthInteraction.some(i => i.type.includes('충'));
    const isExpansion = monthHasNatalHap && monthHasChung;
    if (isExpansion) {
      moveCause += lang === 'KO' ? '이미 다져진 전문성과 실력을 바탕으로 한 긍정적인 확장 이동의 기운이야. ' : 'It\'s an energy of positive expansion move based on already established expertise and skills. ';
    }

    // Rule 2: Ten Deities
    const hasInseongLuck = luckGods.some(g => g.includes('인성'));
    const hasJaeSeongLuck = luckGods.some(g => g.includes('재성'));
    const hasBiGyeopLuck = luckGods.some(g => g.includes('비견') || g.includes('겁재'));
    
    const originalGods = result.pillars.flatMap(p => [p.stemKoreanName, p.branchKoreanName]).filter(Boolean);
    const hasOriginalInseong = originalGods.some(g => g?.includes('인성'));
    const hasOriginalJae = originalGods.some(g => g?.includes('재성'));

    if (hasInseongLuck && (hasYearMove || hasMonthMove || hasDayMove)) {
      moveCause += lang === 'KO' ? '문서운(인성)이 들어오며 자리가 흔들리니, 계약을 통한 확실한 이동 타이밍이야. ' : 'Inseong (document luck) arrives and shakes your position, indicating a definite move through a contract. ';
    }
    if (hasJaeSeongLuck && hasOriginalInseong && (hasDayMove || hasHourMove)) {
      moveCause += lang === 'KO' ? '재테크나 투자, 자산 증식을 목적으로 한 실속 있는 이동(손익 계산이 깔린 이사)이 예상돼. ' : 'A substantial move for the purpose of investment, wealth increase, or asset management is expected. ';
    }
    if (hasBiGyeopLuck && hasOriginalJae && hasMonthMove) {
      moveCause += lang === 'KO' ? '주변과의 경쟁이나 갈등을 피해 무조건 벗어나고 싶은 도피성 혹은 환경 전환형 이동의 성격이 강해. ' : 'It has a strong character of an escape or environment-switching move to avoid competition or conflict with surroundings. ';
    }
    if (hasDayMove && hasHourMove) {
      moveCause += lang === 'KO' ? '자녀의 교육이나 자녀의 신상 변화로 인한 가족 전체의 이동수가 보여. ' : 'A move for the entire family due to children\'s education or personal changes is visible. ';
    }
    if (hasMonthMove && hasDayMove) {
      moveCause += lang === 'KO' ? '부부 관계나 부부의 직장 문제 등 복합적인 사유로 터전을 옮기게 될 거야. ' : 'You will move your base due to complex reasons involving marital relations or job issues. ';
    }
    if (hasMonthMove && !hasYearMove && !hasDayMove) {
      moveCause += lang === 'KO' ? '이동해야 할 명분은 생겼지만, 실제로 옮길지 말지 심리적인 갈등이 깊은 상태네. ' : 'A reason to move has arisen, but you are in a state of deep psychological conflict about whether to actually move. ';
    }

    // Rule 3: Yeongma
    const saengjis = ['寅', '申', '巳', '亥'];
    const saengjiCount = result.pillars.filter(p => saengjis.includes(p.branch)).length;
    const yeongmaActivated = saengjiCount >= 1 && allInteractions.some(i => saengjis.some(s => i.note.includes(s)) && (i.type.includes('충') || i.type.includes('형')));
    if (yeongmaActivated) {
      moveCause += lang === 'KO' ? '잠자던 역마의 기운이 폭발하며 아주 역동적이고 큰 폭의 직장 변동이나 이사운이 발생할 거야. ' : 'The sleeping energy of The Wanderer (Yeokma) explodes, causing a very dynamic and large-scale environmental change or job shift. ';
    }

    // Rule 4: Edge Cases
    if (hasMonthMove && luckScore < 40) {
      moveFortune = lang === 'KO' ? '이번 직장 변동은 승진보다는 부서 이동, 직위 강등(좌천), 혹은 밀려나는 형태가 될 수 있으니 방어적으로 대처하는 게 좋아. ' : 'This job change might be a demotion, push-out, or lateral move rather than a promotion, so handle it defensively. ';
    }
    
    const monthZhi = result.pillars[1].branch;
    const isSummerBorn = ['巳', '午', '未'].includes(monthZhi);
    const isFireEarthOverload = (analysis.elementRatios?.Fire || 0) + (analysis.elementRatios?.Earth || 0) >= 60;
    if (isSummerBorn && isFireEarthOverload) {
      moveFortune += lang === 'KO' ? '현재 환경이 너무 뜨겁고 건조해. 내 의지와 상관없이 어쩔 수 없이 터전을 옮기게 되는 불가항력적 환경 변화가 예상돼. ' : 'The current environment is too hot and dry. A force majeure change where you are forced to move your base regardless of your will is expected. ';
    }

    // Refined Moving Logic: Consistency between luck score and advice
    if (luckScore >= 80) {
      // High luck: Advice is to stay and enjoy current peak
      moveFortune = lang === 'KO' ? '현재 운의 흐름이 최상이니 섣부른 이동이나 확장은 절대 금물이야. 지금은 잘 닦아온 운의 결실을 수확할 때지, 판을 흔들 때가 아니거든. 잘못 이동하면 이 황금 같은 흐름이 꺾일 수 있어. ' : 'Since your current luck flow is at its peak, avoid hasty moves or expansions. Now is the time to harvest the fruits of your luck, not to shake the foundation. Moving now might break this golden flow. ';
    } else if (luckScore <= 25) {
      // Very low luck: Advice is to move to break the stagnation
      moveFortune = lang === 'KO' ? '현재 터전에서 되는 일이 하나도 없고 에너지가 고여있다면, 이동수 여부와 상관없이 과감하게 환경을 바꾸는 것이 오히려 긍정적인 돌파구가 될 거야. 고인 물은 썩기 마련이니까. ' : 'If nothing is working in your current place and your energy is stagnant, boldly changing your environment will be a positive breakthrough regardless of moving indicators. Stagnant water eventually rots. ';
    } else if (luckScore < 50 && moveType) {
      // Unstable luck with move indicator: Caution
      moveFortune = lang === 'KO' ? '이동의 기운은 들어와 있지만, 현재 운의 지지력이 약해. 옮긴 곳에서도 비슷한 문제로 고민할 수 있으니, 조건이 확실하지 않다면 조금 더 관망하며 에너지를 비축하는 게 어때? ' : "The energy for a move is present, but the support of your current luck is weak. You might face similar issues in the new place, so if conditions aren't certain, why not wait and conserve energy? ";
    }

    // Timing Logic
    const currentYear = new Date().getFullYear();
    const isGoodYear = luckScore >= 60;
    const moveTiming = lang === 'KO' ? 
      `올해(${currentYear}년)는 ${seunStem}${seunBranch}년인데, ${moveType ? (isGoodYear ? '네게 유리한 기운이 들어와 있어 이사나 이직을 하기에 아주 적기야.' : '기운이 다소 불안정하니 이동을 하더라도 신중하게 결정하는 게 좋아.') : '지금은 큰 변화보다는 안정을 취하는 게 유리한 시기야.'} 특히 ${isGoodYear ? '상반기' : '하반기'}에 그 기운이 더 뚜렷해질 거야.` :
      `This year (${currentYear}) is the year of ${seunStem}${seunBranch}. ${moveType ? (isGoodYear ? 'Favorable energy is coming in, making it a great time to move or change jobs.' : 'The energy is somewhat unstable, so it\'s better to decide carefully even if you move.') : 'It\'s a better time to seek stability rather than major changes.'} Especially in the ${isGoodYear ? 'first half' : 'second half'} of the year, that energy will be more distinct.`;

    const finalMoveType = moveType || (lang === 'KO' ? '정적인 흐름' : 'Static flow');
    const finalMoveCause = moveCause || (lang === 'KO' ? '현재의 자리를 지키며 내실을 다지는 시기야.' : 'It\'s a time to keep your current position and build inner strength.');
    const finalMoveFortune = moveFortune || (lang === 'KO' ? '지금은 억지로 자리를 옮기기보다, 현재 맡은 일의 완성도를 높이면서 다음 기회를 기다리는 게 훨씬 실속 있어.' : 'Instead of forcing a move now, it\'s much more beneficial to focus on perfecting your current tasks and wait for the next opportunity.');

    const main = lang === 'KO' ? 
      `지금 머무는 곳이 네 무덤일까, 아니면 발판일까? [delay:1500]\n\n` +
      `분석해보니 지금 너에게는 ${finalMoveType}의 기운이 강하게 들어와 있어. ` +
      `${finalMoveCause} ` +
      `${moveTiming} \n\n` +
      `마지막으로 실질적인 조언을 하나 해주자면.. ${finalMoveFortune}` :
      `Is your current place a grave or a stepping stone? [delay:1500]\n\n` +
      `According to the analysis, the energy of ${finalMoveType} is strongly entering your life. ` +
      `${finalMoveCause} ` +
      `${moveTiming} \n\n` +
      `Lastly, to give you some practical advice.. ${finalMoveFortune}`;
    
    const glitch = lang === 'KO' ? '이사나 이직은 단순히 장소를 바꾸는 게 아니라 네 에너지의 환경을 바꾸는 일이야. 단순히 방위만 따지기보다, 네 사주에 부족한 기운(예: 물이나 나무)을 채워줄 수 있는 동네인지 먼저 살펴봐.' : 'Moving is not just changing a place, but changing your energy environment. Rather than just directions, check if the new neighborhood can fill the energy lacking in your chart (e.g., Water or Wood).';
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
  themeAnalyses['marriage_timing'] = analyzeMarriageTiming();
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
    { 
      id: 'romance', 
      title: lang === 'KO' ? '[심연의 이끌림]' : '[Attraction of the Abyss]', 
      question: lang === 'KO' ? "나를 구원할 인연일까, 아니면 나를 집어삼킬 악연일까? 내 안의 이 지독한 외로움이 향하는 곳을 알려줘." : "Is it a connection that will save me, or an ill-fated one that will swallow me? Tell me where this terrible loneliness inside me is heading.", 
      priority: 100 
    },
    { 
      id: 'wealth', 
      title: lang === 'KO' ? '[황금의 그림자]' : '[Shadow of Gold]', 
      question: lang === 'KO' ? "타오르는 열망이 금화가 되어 돌아올까? 아니면 한 줌의 재로 흩어질까? 내가 쥔 재물과 성취의 기회를 설명해줘." : "Will my burning desire return as gold coins? Or will it scatter into a handful of ashes? Explain the opportunities for wealth and achievement I hold.", 
      priority: 100 
    },
    { 
      id: 'health', 
      title: lang === 'KO' ? '[영혼의 균열]' : '[Crack in the Soul]', 
      question: lang === 'KO' ? "자꾸만 흔들리는 내 몸과 마음... 어떻게 해야 이 고통을 잠재우고 평화를 찾을 수 있을까?" : "My body and mind keep shaking... How can I calm this pain and find peace?", 
      priority: themeScores.health 
    },
    { 
      id: 'secrets', 
      title: lang === 'KO' ? '[금기된 페이지]' : '[Forbidden Page]', 
      question: lang === 'KO' ? "입 밖으로 낼 수 없는 비밀, 혹은 나조차 모르는 내 안의 본능... 그 위험한 불길이 언제 타오를지 미리 경고해줘." : "Secrets I can't speak of, or instincts inside me that even I don't know... Warn me in advance when that dangerous flame will ignite.", 
      priority: themeScores.secrets 
    },
    { 
      id: 'moving', 
      title: lang === 'KO' ? '[궤도의 이탈]' : '[Derailment of Orbit]', 
      question: lang === 'KO' ? "궤도의 이탈: 지금 머무는 이곳이 네 무덤일까, 아니면 발판일까?" : "Derailment of Orbit: Is the place I'm staying now my grave, or a stepping stone?", 
      priority: themeScores.moving 
    },
    { 
      id: 'general', 
      title: lang === 'KO' ? '[운명의 지도]' : '[Map of Destiny]', 
      question: lang === 'KO' ? "올해의 전반적인 흐름과 오늘의 기운을 한눈에 보여줘." : "Show me the overall flow of this year and today's energy at a glance.", 
      priority: 90 
    }
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
