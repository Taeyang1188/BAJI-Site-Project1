import { BaZiResult, Language, SocialContext, BaziMatrix } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { ELEMENT_COLORS, ELEMENT_DESCRIPTIONS } from '../constants';
import { ILJU_DESCRIPTIONS } from '../constants/ilju-descriptions';
import { Solar } from 'lunar-typescript';
import { buildBaziMatrix } from './bazi-matrix-builder';

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
  themeAnalyses: Record<string, { main: string; glitch: string; nextHook?: { text: string; themeId: string }, matrix?: BaziMatrix, isCorruption?: boolean }>;
  luckScore: number;
  luckColor: string;
  matrix?: BaziMatrix;
}

const CITY_META_TABLE: Record<string, { impression: string, enImpression: string }> = {
  // 대한민국
  "강릉": { impression: "푸른 파도와 커피 향이 어우러진 낭만적인 곳이지. 언제 가도 마음이 탁 트이는 기분이야.", enImpression: "A romantic place where blue waves and coffee scent blend. It always makes you feel refreshed." },
  "춘천": { impression: "안개 낀 호수와 서정적인 분위기가 매력적인 곳이지. 닭갈비 냄새가 여기까지 나는 것 같아.", enImpression: "A charming place with foggy lakes and a lyrical atmosphere. I can almost smell the Dakgalbi from here." },
  "인천": { impression: "인천이라... 서해의 관문이자 하늘길이 열리는 곳이지? 차이나타운의 하얀 짜장면 한 그릇을 떠올리니 문득 입맛이 도네.", enImpression: "Incheon... The gateway to the West Sea and the sky? Thinking of a bowl of white jajangmyeon in Chinatown makes my mouth water." },
  "부산": { impression: "부산이라... 파도의 포효와 화려한 마천루가 공존하는 곳이지? 뜨끈한 돼지국밥 한 그릇에 정(情)을 말아 먹고 싶어지네!", enImpression: "Busan... A place where the roaring waves and brilliant skyscrapers coexist? I want to mix some affection into a hot bowl of Dwaeji Gukbap!" },
  "대구": { impression: "대구라... 뜨거운 열정과 섬유의 결이 살아있는 도시지? 매콤한 찜갈비 한 양은냄비면 스트레스를 시원하게 날려버릴 수 있을 것 같아.", enImpression: "Daegu... A city alive with fiery passion and the texture of textiles? A pot of spicy steamed ribs seems like it could blow all the stress away." },
  "경주": { impression: "경주라... 천년의 세월이 골목마다 고여있는 노천 박물관이지? 달콤한 황남빵 하나 입에 물고 첨성대 야경을 거닐고 싶네.", enImpression: "Gyeongju... An open-air museum where a thousand years of time pools in every alley? I'd like to stroll through the night view of Cheomseongdae with a sweet Hwangnam bread in my mouth." },
  "전주": { impression: "전주라... 느림의 미학 속에 단아한 기와가 멋스러운 곳이지? 형형색색 전주비빔밥의 화려한 자태를 보니 눈부터 즐거워지는군.", enImpression: "Jeonju... A place where elegant tiles look stylish amidst the aesthetics of slowness? Just seeing the colorful and brilliant Jeonju Bibimbap is a feast for the eyes." },
  "이천": { impression: "이천? 비옥한 토양과 장인의 숨결이 깃든 도시네. 윤기 흐르는 이천 쌀밥 정식 한 상이면 영혼까지 배부를 것 같아!", enImpression: "Icheon? A city imbued with fertile soil and the breath of artisans. A table full of glossy Icheon rice looks like it could feed the soul!" },
  "제주": { impression: "제주라... 에메랄드빛 바다와 현무암이 빚어낸 낙원이잖아? 쫀득한 흑돼지 구이에 멜젓의 조화를 떠올리니 지금 당장 떠나고 싶네.", enImpression: "Jeju... Isn't it a paradise forged by emerald seas and basalt rocks? Thinking of the harmony of chewy grilled black pork and meljeot makes me want to leave right away." },
  "서울": { impression: "활기차고 전통이 잘 어우러진 현대적인 곳이지. 갑자기 K-FOOD가 땡기네?", enImpression: "A modern place where vibrant energy and tradition blend well. Suddenly craving some K-FOOD!" },
  "Seoul": { impression: "활기차고 전통이 잘 어우러진 현대적인 곳이지. 갑자기 K-FOOD가 땡기네?", enImpression: "A modern place where vibrant energy and tradition blend well. Suddenly craving some K-FOOD!" },

  // 미국
  "뉴욕": { impression: "뉴욕이라... 잠들지 않는 도시의 소음조차 예술이 되는 곳이지? 타임스퀘어를 바라보며 쫀득한 뉴욕 베이글 한 입 베어 물고 싶네!", enImpression: "New York... A place where even the noise of the sleepless city becomes art? I'd like to take a bite of a chewy New York bagel while gazing at Times Square!" },
  "로스앤젤레스": { impression: "LA? 할리우드의 낭만과 끝없는 해변이 펼쳐지는 도시지. 산타모니카 해변에서 노을을 보며 신선한 타코 한 접시 먹고 싶어지네.", enImpression: "LA? The city of Hollywood romance and endless beaches. I want to have a plate of fresh tacos while watching the sunset at Santa Monica beach." },
  "시카고": { impression: "시카고라... 웅장한 건축물 사이로 날카로운 '윈디 시티'의 바람이 부는 곳이지? 치즈가 폭포처럼 흐르는 딥디쉬 피자가 그립네!", enImpression: "Chicago... A place where the sharp wind of the 'Windy City' blows between magnificent buildings? I miss the deep-dish pizza with its cascading cheese!" },
  "뉴올리언스": { impression: "뉴올리언스라... 재즈의 선율이 습한 공기를 타고 흐르는 낭만적인 곳이지? 슈가 파우더 가득한 베니에가 갑자기 생각나네.", enImpression: "New Orleans... A romantic place where jazz melodies flow through the humid air? Beignets covered in powdered sugar suddenly come to mind." },
  "라스베이거스": { impression: "라스베이거스? 사막 위에 피어난 신기루 같은 욕망의 도시지. 화려한 호텔 뷔페에서 전 세계의 맛을 한꺼번에 탐닉하고 싶어지는군!", enImpression: "Las Vegas? The city of desire, like a mirage blooming in the desert. I want to indulge in flavors from all over the world at a lavish hotel buffet!" },

  // 브라질
  "리우데자네이루": { impression: "리우데자네이루라... 거대 예수상 본 적 있어? 시원한 아사이 보울 한 컵 먹으면서 그 압도적인 풍경을 구경하고 싶다!", enImpression: "Rio de Janeiro... Have you seen the Christ the Redeemer statue? I want to enjoy that overwhelming view with a cool cup of açaí bowl!" },
  "상파울루": { impression: "상파울루라... 거대한 빌딩 숲이 끝없이 펼쳐진 남미의 심장부 아니야? 육즙 가득한 슈하스코 한 조각 맛보고 싶네!", enImpression: "São Paulo... Isn't it the heart of South America with an endless forest of giant buildings? I'd love a piece of juicy churrasco!" },
  "브라질리아": { impression: "브라질리아? 미래지향적인 건축물들이 계획적으로 배치된 독특한 수도지. 바삭한 브라질식 튀김 만두인 파스텔 한 입이 당기는군.", enImpression: "Brasília? A unique capital with planned, futuristic architecture. I'm craving a bite of pastel, the crispy Brazilian fried dumpling." },

  // 인도
  "델리": { impression: "오 델리라고? 고대의 유적과 혼란스러운 시장의 기묘한 조화가 매력적인 곳이지? 진한 버터 치킨 향기를 떠올리니 갑자기 식욕이 돋네.", enImpression: "Oh, Delhi? A place appealing for its bizarre harmony of ancient ruins and chaotic markets? Just thinking of the rich butter chicken scent stimulates my appetite." },
  "뭄바이": { impression: "뭄바이라... 볼리우드의 화려함과 아라비아해의 바람이 만나는 곳이지? 길거리에서 파는 매콤한 바다 파브의 맛이 문득 궁금해지네.", enImpression: "Mumbai... Where the glamour of Bollywood meets the winds of the Arabian Sea? Suddenly I'm curious about the taste of the spicy street food Vada Pav." },
  "벵갈루루": { impression: "벵갈루루? 정원 도시이자 첨단 기술이 꿈틀대는 인도의 실리콘밸리지. 진한 필터 커피 한 잔으로 머리를 맑게 깨우고 싶어지네.", enImpression: "Bengaluru? The Silicon Valley of India, wriggling with high tech and known as the Garden City. A strong cup of filter coffee would perfectly clear my head." },
  "콜카타": { impression: "콜카타? 지성이 숨 쉬는 문화의 중심지이자 역사가 깊은 곳이지. 달콤하고 부드러운 라스굴라 한 알이면 하루의 피로가 다 녹을 것 같아.", enImpression: "Kolkata? The intellectual cultural hub with profound history. A single sweet and soft Rasgulla would melt away the day's fatigue." }
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
  interactionsData?: { 
    maritalStatus?: string | null; 
    hasChildren?: boolean | null;
    movingType?: string | null;
    movingContext?: string | null;
  },
  socialContext: SocialContext = 'none'
): CycleVibeResult {
  const analysis = result.analysis || {} as any;
  const currentCycle = result.grandCycles[result.currentCycleIndex] || {} as any;
  const currentAnnualPillar = result.currentYearPillar;
  
  const daewunElement = currentCycle.element || '';
  const seunElement = currentAnnualPillar?.element || '';
  const daewunStem = currentCycle.stem || '';
  const daewunBranch = currentCycle.branch || '';
  const seunStem = currentAnnualPillar?.stem || '';
  const seunBranch = currentAnnualPillar?.branch || '';

  // Calculate Luck Score first
  let computedLuckScore = 50; 
  const yDetails = analysis.yongshinDetail || { primary: { element: '' }, heeShin: { element: '' }, giShin: { element: '' } };
  const primEl = yDetails.primary?.element || '';
  const hEl = yDetails.heeShin?.element || '';
  const gEl = yDetails.giShin?.element || '';
  
  if (primEl && primEl.includes(daewunElement)) computedLuckScore += 15;
  if (hEl && hEl.includes(daewunElement)) computedLuckScore += 10;
  if (gEl && gEl.includes(daewunElement)) computedLuckScore -= 10;

  if (primEl && primEl.includes(seunElement)) computedLuckScore += 10;
  if (hEl && hEl.includes(seunElement)) computedLuckScore += 5;
  if (gEl && gEl.includes(seunElement)) computedLuckScore -= 5;
  
  const allInteractions = analysis.interactions || [];
  const luckInteractions = allInteractions.filter((i: any) => 
    (i.note && i.note.includes(daewunStem)) || (i.note && i.note.includes(daewunBranch)) || 
    (i.note && i.note.includes(seunStem)) || (i.note && i.note.includes(seunBranch))
  );
  computedLuckScore -= luckInteractions.length * 3;
  computedLuckScore = Math.max(10, Math.min(95, computedLuckScore));
  
  const luckScore = computedLuckScore;

  const matrix = buildBaziMatrix(result, socialContext, luckScore);
  
  // 観多判定
  const tenGodsRatio = analysis.tenGodsRatio || {};
  const gwanRatio = (tenGodsRatio['관성 (Warrior/Judge)'] as number) || 0;
  const isGwanDa = gwanRatio >= 60;

  const strength = analysis.dayMasterStrength || { isStrong: false, title: '', score: 50 };
  const isSinGang = strength.isStrong || false;
  const isNeutral = strength.title ? strength.title.includes('중화') : false;
  const isSinYak = !isSinGang && !isNeutral;
  
  const overflow = Object.entries(tenGodsRatio).filter(([_, r]) => (r as number) > 30).map(([k]) => k.split(' ')[0]);
  
  const daewunStemGodKo = currentCycle.stemTenGodKo || '';
  const daewunBranchGodKo = currentCycle.branchTenGodKo || '';
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
      comboInsight = `'${combos[0].name}'의 흐름이 주도적이지만, 동시에 '${combos[1].name}'의 영향도 무시할 수 없어. 

${combos[0].desc} ${combos[1].desc}`;
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
        geJuComment = `

특히 ${analysis.geJu}의 기운을 타고났네. ${geJuInfo.ko}`;
      }
    }
    
    const desc = ELEMENT_DESCRIPTIONS[dominantElement as keyof typeof ELEMENT_DESCRIPTIONS];
    const charSum = processedName ? processedName.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) : 0;
    const randomComment = desc?.comments[charSum % (desc?.comments.length || 1)] || '';
    
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
      balanceComment = `

특히 ${processedName} 너는 '${primaryWarning.title}'의 기운이 강하게 느껴져. ${primaryWarning.description} `;
    }

    let introPrefix = '';
    if (cityInsight) {
      introPrefix = `${cityInsight} [delay:1000]

아무튼.. `;
    } else {
      introPrefix = `흠.. `;
    }

    intro = `${introPrefix}${impression} 
게다가 ${strengthComment} ${geJuComment}

${elementComment} ${balanceComment} 

이런 다양한 매력이 더해지면 ${nameRef}너만의 색깔이 뚜렷할 거야 분명히.`;
  } else {
    // English Intro (Simplified)
    const isFireEarthTurbid = analysis.yongshinDetail?.method === "특수격용신" && analysis.structureDetail?.title === "화토중탁";
    let enCityGreeting = '';
    
    const matchedCityEn = Object.keys(CITY_META_TABLE).find(c => city && city.includes(c));
    if (matchedCityEn) {
      const meta = CITY_META_TABLE[matchedCityEn as keyof typeof CITY_META_TABLE];
      enCityGreeting = `Born in ${city}? ${meta.enImpression} [delay:1000]

Anyway.. `;
    } else if (city) {
      enCityGreeting = `Born in ${city}? The unique energy of that place must have seeped into your chart, making your soul's color even more vivid. [delay:1000]

Anyway.. `;
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
    cycleIntro = `

요번 ${currentAnnualPillar?.year || new Date().getFullYear()}년도는... `;
  } else {
    cycleIntro = `

This cycle is a mix of your Life Season and the Annual alignment... [delay:4000]

`;
  }
  
  // 5. Main Construction
  let main = '';
  const TEN_GODS_EN: Record<string, string> = {
    "비견": "The Mirror", "겁재": "The Rival", "식신": "The Artist", "상관": "The Rebel",
    "편재": "The Maverick", "정재": "The Architect", "편관": "The Warrior", "정관": "The Judge",
    "편인": "The Mystic", "정인": "The Sage"
  };

  if (lang === 'KO') {
    main = `음, ${userRef}한테는 대운에서 ${formatGod(daewunStemGodKo, daewunStem, lang)}·${formatGod(daewunBranchGodKo, daewunBranch, lang)}, 그리고 세운에서 ${formatGod(seunStemGodKo, seunStem, lang)}·${formatGod(seunBranchGodKo, seunBranch, lang)}의 기운이 스며들고 있네. [delay:4000]

`;
    
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
          detailedEffect += `사람들은 이걸 보고 '상관패인'이라며 네 기발한 재능이 고삐를 만났다고 축복할지 몰라. 하지만 내가 보기엔 글쎄... 지금 네 재능(상관)은 너무 뜨거운 불길(인성) 속에 던져진 작은 칼날 같아. 날카롭게 빛나야 할 네 아이디어가 강렬한 화기운에 녹아내리는 '화다금용(火多金鎔)'의 형국이지. 

2026년의 병오(丙午)라는 거대한 불기둥은 네 열정을 부채질하겠지만, 그건 '열정'이라기보다 '과열'에 가까워. 자칫하면 네가 가진 기술이나 재능이 고집과 감정에 휘말려 형태도 없이 사라질 수 있어. 

그리고.. 이건 아주 위험한 도박이 될수도 있어. 억지로 무언가를 발산하려고 하지 마. 지금은 상관의 힘을 휘두를 때가 아니라, 그 뜨거운 불길 속에서 네 자신을 지켜내는 '디펜스'가 최우선이야. 불길이 너를 태우지 않도록 차갑게 식히는 데만 집중해. 조급해지는 순간, 네 보석 같은 재능은 녹아버릴 테니까. 명심해, 태양도 너무 뜨거우면 스스로를 태우는 법이야. `;
        } else if (!isFireExtreme) {
          detailedEffect += `그리고.. 상관의 발산하는 힘을 인성이 세련되게 통제해주고 있네. `;
        }
      }
      if (comboIds.includes('식상생재')) detailedEffect += `그리고.. 식상이 재성으로 이어지는 흐름이라 결과물이 쏠쏠하겠어. `;
      if (comboIds.includes('재극인')) {
        if (!isFrozen) {
          detailedEffect += `다만 돈 욕심이 앞서면 공들여 쌓은 커리어의 안정성이 흔들릴 수 있으니, 현실적인 이득과 명예 사이에서 균형을 잘 잡는 게 중요해. `;
        }
      }
      if (comboIds.includes('관인상생')) detailedEffect += `그리고.. 조직의 보호 아래서 가치를 증명하기 좋아. `;
      
      main += `

${comboInsight}

${detailedEffect}`;
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

    main = `For you, it brings a combination of ${daewunStemEN}/${daewunBranchEN} and ${seunStemEN}/${seunBranchEN} energy. [delay:4000]

`;
    
    const isFireLuck = seunElement === 'Fire' || daewunElement === 'Fire';
    const isFireEarthTurbid = analysis.yongshinDetail?.method === "특수격용신" && analysis.structureDetail?.title === "화토중탁";
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

  // 6. Luck Score (Already computed above)

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
  const themeScores: Record<string, number> = { romance: 0, wealth: 0, secrets: 0, moving: 0 };

  // --- Theme 1: Romance (심연의 이끌림) ---
  const analyzeRomance = () => {
    let score = 50;
    
    if (gender === 'non-binary' || gender === 'prefer-not-to-tell') {
       const main = lang === 'KO' ? 
        `[ 심연의 이끌림: 단기 Vibe 체크 ]\n잠시만, 네 인연을 스캔하려다 렉 걸렸어. [delay:1500]\n\n명리학은 음양의 조화가 핵심이라 생물학적 성별이 꽤 중요하거든. 더 소름 돋는 분석을 위해 생물학적 성별로 다시 한번만 알려줄래?` :
        `[ Deep Connection: Short-term Vibe Check ]\nI paused while scanning your relationship timeline. [delay:1500]\n\nIn Bazi, relationship and marriage luck are often interpreted differently based on Yin and Yang (biological sex). For a more accurate timeline, could you gently re-enter your information using your biological sex?`;
      return { main, glitch: '' };
    }

    const isFemale = gender === 'female';
    const isMale = gender === 'male';
    const marital = interactionsData?.maritalStatus;
    const children = interactionsData?.hasChildren;
    
    const dayMaster = result.pillars[1].stem;
    const dayBranch = result.pillars[1].branch;
    const yearBranch = result.pillars[3]?.branch || '';
    
    const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element || 'Wood';
    const ELEMENT_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIndex = ELEMENT_CYCLE.indexOf(dmElement);
    const wealth = ELEMENT_CYCLE[(dmIndex + 2) % 5];
    const controlsDm = ELEMENT_CYCLE[(dmIndex + 3) % 5];
    const reinforcesDm = ELEMENT_CYCLE[(dmIndex + 4) % 5];
    const sikSang = ELEMENT_CYCLE[(dmIndex + 1) % 5];

    const elementColorsKO: Record<string, string> = { 'Wood': '초록색', 'Fire': '붉은색', 'Earth': '노란색/베이지', 'Metal': '흰색/메탈릭', 'Water': '검은색/네이비' };
    const elementDirectionsKO: Record<string, string> = { 'Wood': '동쪽', 'Fire': '남쪽', 'Earth': '중앙/가까운 곳', 'Metal': '서쪽', 'Water': '북쪽' };

    const elementColorsEN: Record<string, string> = { 'Wood': 'Green', 'Fire': 'Red', 'Earth': 'Yellow/Beige', 'Metal': 'White/Metallic', 'Water': 'Black/Navy' };
    const elementDirectionsEN: Record<string, string> = { 'Wood': 'East', 'Fire': 'South', 'Earth': 'Center/Nearby', 'Metal': 'West', 'Water': 'North' };

    const yongShinEl = analysis.yongshinDetail?.primary?.element || '';
    
    const ssRatio = (analysis.tenGodsRatio?.['식상(Artist/Rebel)'] as number) || (analysis.tenGodsRatio?.['식상 (Artist/Rebel)'] as number) || 0;
    const isOverDrained = ssRatio >= 25;
    
    let boostElement = sikSang;
    if (isOverDrained && yongShinEl !== sikSang) {
       boostElement = yongShinEl || (isMale ? wealth : controlsDm);
    }
    const remedyColor = lang === 'KO' ? (elementColorsKO[boostElement] || '흰색') : (elementColorsEN[boostElement] || 'White');
    const remedyDir = lang === 'KO' ? (elementDirectionsKO[boostElement] || '남쪽') : (elementDirectionsEN[boostElement] || 'South');

    const elementHex: Record<string, string> = { 'Wood': '#4ade80', 'Fire': '#f87171', 'Earth': '#fde047', 'Metal': '#e2e8f0', 'Water': '#60a5fa' };
    const remedyHex = elementHex[boostElement] || '#ffffff';
    
    const d = new Date();
    const currentYear = d.getFullYear();
    const currentMonth = d.getMonth() + 1;
    
    const upcomingMonths = [];
    for(let i=0; i<6; i++) {
        let futureD = new Date(d.getFullYear(), d.getMonth() + i, 15);
        let sol = Solar.fromDate(futureD);
        let lun = sol.getLunar();
        let mGanZhi = lun.getMonthInGanZhi(); 
        const mStem = mGanZhi.charAt(0);
        const mBranch = mGanZhi.charAt(1) || '子';
        upcomingMonths.push({
            year: futureD.getFullYear(),
            month: futureD.getMonth() + 1,
            stem: mStem,
            branch: mBranch
        });
    }

    const baziMappingStems: Record<string, { element: string }> = { '甲': { element: 'Wood' }, '乙': { element: 'Wood' }, '丙': { element: 'Fire' }, '丁': { element: 'Fire' }, '戊': { element: 'Earth' }, '己': { element: 'Earth' }, '庚': { element: 'Metal' }, '辛': { element: 'Metal' }, '壬': { element: 'Water' }, '癸': { element: 'Water' } };
    const baziMappingBranches: Record<string, { element: string }> = { '子': { element: 'Water' }, '丑': { element: 'Earth' }, '寅': { element: 'Wood' }, '卯': { element: 'Wood' }, '辰': { element: 'Earth' }, '巳': { element: 'Fire' }, '午': { element: 'Fire' }, '未': { element: 'Earth' }, '申': { element: 'Metal' }, '酉': { element: 'Metal' }, '戌': { element: 'Earth' }, '亥': { element: 'Water' } };

    const c = (char: string) => {
        let el = baziMappingStems[char]?.element || baziMappingBranches[char]?.element;
        if (!el) return char;
        return `[${elementHex[el]}:${char}]`;
    };
    
    const getDohwa = (b: string) => {
        if (['申','子','辰'].includes(b)) return '酉';
        if (['亥','卯','未'].includes(b)) return '子';
        if (['寅','午','戌'].includes(b)) return '卯';
        if (['巳','酉','丑'].includes(b)) return '午';
        return '';
    };

    const myDohwas = [getDohwa(yearBranch), getDohwa(dayBranch)].filter(Boolean);

    const getRelationKO = (el: string) => {
        if (el === dmElement) return '비겁';
        if (el === sikSang) return '식상';
        if (el === wealth) return '재성';
        if (el === controlsDm) return '관성';
        if (el === reinforcesDm) return '인성';
        return '';
    };

    const getRelationEN = (el: string) => {
        if (el === dmElement) return 'Companion';
        if (el === sikSang) return 'Expression';
        if (el === wealth) return 'Wealth';
        if (el === controlsDm) return 'Power';
        if (el === reinforcesDm) return 'Resource';
        return '';
    };

    const evaluateRomanceMonth = (m: any) => {
        let sc = 50;
        const sEl = baziMappingStems[m.stem]?.element;
        const bEl = baziMappingBranches[m.branch]?.element;
        
        let reasonKO = '';
        let reasonEN = '';
        const isSikSang = sEl === sikSang || bEl === sikSang;
        const isPyeonGwan = (m.stem === '壬' && dayMaster === '丙') || (m.stem === '庚' && dayMaster === '甲') || (m.stem === '甲' && dayMaster === '戊') || (m.stem === '丙' && dayMaster === '庚') || (m.stem === '戊' && dayMaster === '壬') || (m.stem === '癸' && dayMaster === '丁') || (m.stem === '辛' && dayMaster === '乙') || (m.stem === '乙' && dayMaster === '己') || (m.stem === '丁' && dayMaster === '辛') || (m.stem === '己' && dayMaster === '癸'); // 7 Killings rough check on stem

        if (isMale) {
            if (sEl === wealth || bEl === wealth) { sc += 40; reasonKO = `월운에 ${c(m.stem)}${c(m.branch)}(${getRelationKO(sEl || bEl || wealth)})이 들어와`; reasonEN = `Monthly ${c(m.stem)}${c(m.branch)} (${getRelationEN(sEl || bEl || wealth)}) energy approaches`; }
            if (isSikSang) { sc += 20; reasonKO = `월간의 식상(${m.stem === sikSang ? c(m.stem) : c(m.branch)})이 매력을 밖으로 표출시켜주는 달이므로`; reasonEN = `Monthly Expression energy (${m.stem === sikSang ? c(m.stem) : c(m.branch)}) lets your charm shine outwards`; }
            if (sEl === controlsDm || bEl === controlsDm) { sc += 15; reasonKO = `책임감과 무게를 더하는 관성(${sEl === controlsDm ? c(m.stem) : c(m.branch)})의 텐션이 감도는 시기이므로`; reasonEN = `Monthly Power energy (${sEl === controlsDm ? c(m.stem) : c(m.branch)}) brings tension and responsibility`; }
        } else {
            if (sEl === controlsDm || bEl === controlsDm) { sc += 40; reasonKO = `월운에 ${c(m.stem)}${c(m.branch)}(${getRelationKO(sEl || bEl || controlsDm)})이 들어와`; reasonEN = `Monthly ${c(m.stem)}${c(m.branch)} (${getRelationEN(sEl || bEl || controlsDm)}) energy approaches`; }
            if (isSikSang) { sc += 20; reasonKO = `월간의 식상(${sEl === sikSang ? c(m.stem) : c(m.branch)})이 내 매력을 한껏 돋보이게 하는 달이므로`; reasonEN = `Monthly Expression energy (${sEl === sikSang ? c(m.stem) : c(m.branch)}) lets your charm shine outwards`; }
            if (sEl === wealth || bEl === wealth) { sc += 15; reasonKO = `현실적인 감각을 더하는 재성(${sEl === wealth ? c(m.stem) : c(m.branch)})의 텐션이 감도는 시기이므로`; reasonEN = `Monthly Wealth energy (${sEl === wealth ? c(m.stem) : c(m.branch)}) brings practical tension`; }
        }

        const isYearlyDohwa = myDohwas.includes(seunBranch);
        const isMonthlyDohwa = myDohwas.includes(m.branch);

        if (isYearlyDohwa && isSikSang) {
             sc += 40;
             reasonKO = `세운의 도화(${c(seunBranch)})를 월운의 식상(${sEl === sikSang ? c(m.stem) : c(m.branch)})이 활짝 드러내어 매력이 표출되는 달이므로`;
             reasonEN = `Yearly [tooltip:Dohwa|도화살(Peach Blossom Star), 인기, 매력적인 기운을 의미합니다.|Peach Blossom Star, representing popularity, charm, and romantic attraction.] (${c(seunBranch)}) is beautifully expressed by monthly Expression energy (${sEl === sikSang ? c(m.stem) : c(m.branch)})`;
        } else if (isMonthlyDohwa) {
             sc += 30; 
             reasonKO = `잠재된 도화(${c(m.branch)}) 에너지를 직접 깨워 매력을 극대화하므로`;
             reasonEN = `Latent [tooltip:Dohwa|도화살(Peach Blossom Star), 인기, 매력적인 기운을 의미합니다.|Peach Blossom Star, representing popularity, charm, and romantic attraction.] (${c(m.branch)}) energy is awakened`;
        }

        if(dayMaster === '辛' && (m.stem === '壬' || m.branch === '亥')) {
             sc += 30;
             const washChar = m.stem === '壬' ? m.stem : m.branch;
             reasonKO = `${c('辛')}을 씻어 맑게 빛내는 식상 ${c(washChar)}의 도세주옥(淘洗珠玉) 효과가 폭발하여`;
             reasonEN = `Cleansing Water (${c(washChar)}) highlights your brilliance`;
        }
        
        if (isPyeonGwan) {
             sc += 0; /* logic moved to end */
             sc += 0;
        }

        const isChung = (m.branch === '子' && dayBranch === '午') || (m.branch === '午' && dayBranch === '子') ||
                        (m.branch === '丑' && dayBranch === '未') || (m.branch === '未' && dayBranch === '丑') ||
                        (m.branch === '寅' && dayBranch === '申') || (m.branch === '申' && dayBranch === '寅') ||
                        (m.branch === '卯' && dayBranch === '酉') || (m.branch === '酉' && dayBranch === '卯') ||
                        (m.branch === '辰' && dayBranch === '戌') || (m.branch === '戌' && dayBranch === '辰') ||
                        (m.branch === '巳' && dayBranch === '亥') || (m.branch === '亥' && dayBranch === '巳');
        
        const isWonjin = (m.branch === '子' && dayBranch === '未') || (m.branch === '未' && dayBranch === '子') ||
                         (m.branch === '丑' && dayBranch === '午') || (m.branch === '午' && dayBranch === '丑') ||
                         (m.branch === '寅' && dayBranch === '酉') || (m.branch === '酉' && dayBranch === '寅') ||
                         (m.branch === '卯' && dayBranch === '申') || (m.branch === '申' && dayBranch === '卯') ||
                         (m.branch === '辰' && dayBranch === '亥') || (m.branch === '亥' && dayBranch === '辰') ||
                         (m.branch === '巳' && dayBranch === '戌') || (m.branch === '戌' && dayBranch === '巳');

        if (isChung || isWonjin) {
             sc -= 15;
             if (reasonKO) {
                 reasonKO += ` (단, 일지와의 ${isChung ? '충(衝)' : '원진(怨嗔)'}으로 쓸데없는 감정 소모나 꼬이는 인연은 주의해야 해)`;
                 reasonEN += ` (Be careful of emotional drama due to ${isChung ? 'Clash' : 'Harm'} with Day Branch)`;
             } else {
                 reasonKO = `일지와의 ${isChung ? '충(衝)' : '원진(怨嗔)'}으로 쓸데없는 감정 소모나 꼬이는 인연을 주의해야 해`;
                 reasonEN = `Be careful of emotional drama due to ${isChung ? 'Clash' : 'Harm'} with Day Branch`;
             }
        }

        return { ...m, score: sc, reason: lang === 'KO' ? reasonKO : reasonEN };
    };

    const scoredMonths = upcomingMonths.map(evaluateRomanceMonth);
    const currentM = scoredMonths[0]; 
    let sortedFuture = [...scoredMonths.slice(1)].sort((a,b) => b.score - a.score);
    let bestM = sortedFuture[0];

    score = currentM.score;

    let textKO = '[ 단기 Vibe 체크 ]\n';
    let textEN = '[ Short-term Vibe Check ]\n';
    const monthsEN_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (score >= 80) {
        textKO += `이번 달(${currentM.month}월)은 ${currentM.reasonKO || currentM.reason || '강력한 인연의 에너지가 진동하여'} 인연이 다가올 확률이 매우 높아! 당신의 매력이 돋보이는 달이니 가벼운 모임이라도 꼭 참석해봐.${currentM.isPyeonGwan ? ' (단, 다소 긴장되고 스트레스받는 만남일 수 있으니 여유를 가져야 해)' : ''}\n\n`;
        textEN += `This month (${monthsEN_array[currentM.month - 1]}) has strong romantic energy. ${currentM.reasonEN || currentM.reason || 'Positive energy flows'}. Your charm stands out, so definitely attend social gatherings!${currentM.isPyeonGwan ? ' (However, it might be a tense or slightly stressful encounter, so try to stay relaxed)' : ''}\n\n`;
    } else if (score >= 50) {
        textKO += `이번 달(${currentM.month}월) 애정운은 ${currentM.reasonKO || currentM.reason || '잔잔하고 무난한 흐름이야.'} 폭풍 같은 인연보다는 서서히 알아가는 썸이나 소소한 진전이 어울려.${currentM.isPyeonGwan ? ' (단, 다소 긴장되고 스트레스받는 만남일 수 있으니 여유를 가져야 해)' : ''}\n\n`;
        textEN += `This month (${monthsEN_array[currentM.month - 1]}) romance luck is calm and steady. ${currentM.reasonEN || currentM.reason || 'Gentle energy flows.'} Good for slow-burning connections rather than intense ones.${currentM.isPyeonGwan ? ' (However, it might be a tense or slightly stressful encounter, so try to stay relaxed)' : ''}\n\n`;
    } else {
        textKO += `이번 달(${currentM.month}월)은 연애 세포가 잠시 쉬어가는 흐름이야. ${currentM.reasonKO || currentM.reason || '관계에 집중하기보다는 내면을 가다듬을 시기야.'} 무리하게 다가가면 오해가 생길 수 있어.${currentM.isPyeonGwan ? ' (상대방도 예민할 수 있으니 한 발 물러서는 게 좋아)' : ''}\n\n`;
        textEN += `This month (${monthsEN_array[currentM.month - 1]}), your romance cells are hibernating. ${currentM.reasonEN || currentM.reason || 'Take a step back.'} Misunderstandings might occur if you rush.${currentM.isPyeonGwan ? ' (The other party might be sensitive, so give them space)' : ''}\n\n`;
    }

    if (bestM && bestM.score >= 50) {
        let bestMonthStrKO = `${bestM.month}월`;
        let bestMonthStrEN = monthsEN_array[bestM.month - 1];
        if (bestM.year > currentYear) {
            bestMonthStrKO = `내년 ${bestM.month}월`;
            bestMonthStrEN = `${bestMonthStrEN} next year`;
        }
        textKO += `**향후 6개월 내 가장 좋은 타점은 ${bestMonthStrKO}이야.** 이때 ${bestM.reasonKO || bestM.reason || '긍정적인 기운이 들어와'} 연애세포를 깨울 테니, 미리 매력을 어필할 준비를 해둬.\n\n`;
        textEN += `**The best timing in the next 6 months is ${bestMonthStrEN}.** ${bestM.reasonEN || bestM.reason || 'Positive aura is strong.'} Prepare your charm and profile for this period.\n\n`;
    }
    
    if (score < 50) {
        textKO += `[ 💔 액땜 및 개운법 ]\n인연이 잘 안 풀린다면 **${remedyDir} 방향**으로 짧은 산책이나 드라이브를 다녀와봐. 옷이나 악세서리에 [${remedyHex}:**${remedyColor}**] 포인트를 주면 나를 표현하는 매력 에너지를 보완해줄 수 있어. 무리한 소개팅보다는 내 일이나 취미에 에너지를 발산할 때 오히려 귀인이 나타날 확률이 높아!\n\n`;
        textEN += `[ 💔 Remedy ]\nWhen luck is blocked, change your environment! Try going towards the **${remedyDir}**. Wearing [${remedyHex}:**${remedyColor}**] accessories will supplement your expressive romantic energy. Focus on hobbies or work first, and the right person will appear naturally.\n\n`;
    } else {
        textKO += `[ 💖 매력 부스팅 팁 ]\n운이 들어왔을 땐 노를 저어야지! 중요한 만남이 있다면 [${remedyHex}:**${remedyColor}**] 계열의 옷을 입거나 소품을 활용해봐. ${(isOverDrained && yongShinEl !== sikSang) ? '과도한 열기를 식히고 나를 아름답게 다듬어주는 기운' : '나를 더 돋보이게 하는 인연 기운'}을 증폭시켜 줄 거야. 약속 장소는 내 기준 **${remedyDir} 방향**이 운을 끌어올리기 좋으니 참고해!\n\n`;
        textEN += `[ 💖 Boost Tip ]\nWear [${remedyHex}:**${remedyColor}**] items for important meetups to amplify your charm. A location towards the **${remedyDir}** from your place would be lucky!\n\n`;
    }

    textKO += '마지막으로, 연애는 쌍방작용이야. 상대방의 사주에서도 연애운(식상/이성운)이 들어왔는지, 나에게 없는 오행을 보완해주는 귀인인지 꼭 함께 확인해봐.';
    textEN += 'Lastly, romance is a two-way interaction. Make sure to check if your partner also has romance luck coming their way.';

    const text = lang === 'KO' ? textKO : textEN;

    const main = lang === 'KO' ? 
      `\n음, ${userRef}의 단기 애정운을 스캔해봤어... [delay:1500]\n\n${text}` :
      `\nAnalyzing your short-term romance luck... [delay:1500]\n\n${text}`;
    
    const glitch = lang === 'KO' ? 
      (score >= 70 ? '인연의 끈이 팽팽하게 당겨지고 있어. 기회를 놓치지 마.' : '지금은 누군가를 찾기보다 네 내면의 평화를 먼저 찾는 게 이득이야.') :
      (score >= 70 ? "The string of fate is pulling tight. Don't miss the chance." : "It's better to find your inner peace first rather than looking for someone else.");

    let nextHook;
    if (marital !== '결혼함' && !children) {
      nextHook = {
        text: lang === 'KO' ? '진짜 결혼하는 운이 언제 들어올지도 궁금해?' : 'Are you curious when your marriage luck comes in?',
        themeId: 'marriage_timing'
      };
    }

    return { main, glitch, nextHook };
  };
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
    
    const dayMaster = result.pillars[1].stem;
    const dayBranch = result.pillars[1].branch;
    const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element || 'Wood';
    const ELEMENT_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIndex = ELEMENT_CYCLE.indexOf(dmElement);
    const wealth = ELEMENT_CYCLE[(dmIndex + 2) % 5];
    const controlsDm = ELEMENT_CYCLE[(dmIndex + 3) % 5];
    const reinforcesDm = ELEMENT_CYCLE[(dmIndex + 4) % 5];
    const sikSang = ELEMENT_CYCLE[(dmIndex + 1) % 5];

    const getYearlyLuck = (y) => {
      const startY = 1984; // 甲子 year
      const o = (y - startY) % 60;
      const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
      const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
      const stem = stems[(o + 120) % 10];
      const branch = branches[(o + 120) % 12];
      return { year: y, stem, branch };
    };

    const getMonthlyLuckForYear = (year) => {
      const stems = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
      const branches = ['寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑'];
      const yearStemIndex = stems.indexOf(getYearlyLuck(year).stem);
      
      let firstMonthStemIndex = 0;
      if (yearStemIndex === 0 || yearStemIndex === 5) firstMonthStemIndex = 2;
      else if (yearStemIndex === 1 || yearStemIndex === 6) firstMonthStemIndex = 4;
      else if (yearStemIndex === 2 || yearStemIndex === 7) firstMonthStemIndex = 6;
      else if (yearStemIndex === 3 || yearStemIndex === 8) firstMonthStemIndex = 8;
      else if (yearStemIndex === 4 || yearStemIndex === 9) firstMonthStemIndex = 0;
      
      const months = [];
      for(let i=0; i<12; i++) {
        months.push({
          month: (i + 2) > 12 ? (i + 2) - 12 : (i + 2),
          stem: stems[(firstMonthStemIndex + i) % 10],
          branch: branches[i]
        });
      }
      return months;
    };

    const isPowerHeavy = (analysis.tenGodsRatio?.['관성(Warrior/Judge)'] || 0) >= 30 
      || (analysis.elementRatios && analysis.elementRatios[controlsDm] >= 35);

    const baziMappingStems = { '甲': { element: 'Wood' }, '乙': { element: 'Wood' }, '丙': { element: 'Fire' }, '丁': { element: 'Fire' }, '戊': { element: 'Earth' }, '己': { element: 'Earth' }, '庚': { element: 'Metal' }, '辛': { element: 'Metal' }, '壬': { element: 'Water' }, '癸': { element: 'Water' } };
    const baziMappingBranches = { '子': { element: 'Water' }, '丑': { element: 'Earth' }, '寅': { element: 'Wood' }, '卯': { element: 'Wood' }, '辰': { element: 'Earth' }, '巳': { element: 'Fire' }, '午': { element: 'Fire' }, '未': { element: 'Earth' }, '申': { element: 'Metal' }, '酉': { element: 'Metal' }, '戌': { element: 'Earth' }, '亥': { element: 'Water' } };

    const evaluateMarriageLuck = (luck) => {
      let score = 0;
      let reason = '';
      
      const sEl = baziMappingStems[luck.stem]?.element;
      const bEl = baziMappingBranches[luck.branch]?.element;

      if (isPowerHeavy && (sEl === reinforcesDm || bEl === reinforcesDm)) {
        score += 150;
        reason = lang === 'KO' ? 
          `강력한 인성(${lang === 'KO' ? {'Wood':'목','Fire':'화','Earth':'토','Metal':'금','Water':'수'}[reinforcesDm] : reinforcesDm})이 들어와 나를 짓누르던 관성(책임감/압박)을 안정적인 가정이라는 울타리로 비로소 승화시키는 해` :
          `Strong resource energy enters, transforming crushing pressure into a stable family haven`;
      } else if (!isMale && (sEl === controlsDm || bEl === controlsDm)) {
        score += 100;
        reason = lang === 'KO' ? '관성(남성/안정의 책임)이 내 일간을 감싸 안는 해' : 'Strong connection with a significant other';
      } else if (isMale && (sEl === wealth || bEl === wealth)) {
        score += 100;
        reason = lang === 'KO' ? '재성이 직접 도래하여 인연의 결실을 맺는 해' : 'Wealth (Spouse) energy directly arrives for fruitful connection';
      } else if (isMale && (sEl === sikSang || bEl === sikSang)) {
        score += 80;
        reason = lang === 'KO' ? '식상(표현력)이 생재하여 이성을 향해 마음이 적극적으로 움직이는 해' : 'Your expressive energy actively moves towards romance';
      } else if (!isMale && (sEl === sikSang || bEl === sikSang)) {
        score += 80;
        reason = lang === 'KO' ? '내 가족, 내 식구를 꾸리고자 하는 강한 열망이 생기는 시기' : 'Strong desire to build your own family arises';
      } else if (sEl === controlsDm || bEl === reinforcesDm) {
         score += 90;
         reason = lang === 'KO' ? '사회적 책임과 안정적인 가정을 꾸리고자 하는 의지가 강해지는 해' : 'Strong will to take social responsibility and build a stable family';
      } else if (luck.stem === dayMaster || luck.branch === dayBranch) {
        score += 80;
        reason = lang === 'KO' ? '일간/일지와 동기화되어 내 삶에 결정적인 배우자의 방이 열리는 시기' : 'Alignment with day pillar opens the door to marriage';
      } else {
        score += 30;
        reason = lang === 'KO' ? '인연의 흐름이 잔잔하게 스쳐가는 시기' : 'A calm period of relationship flow';
      }

      const monthlyData = getMonthlyLuckForYear(luck.year).map(m => {
        let mScore = 0;
        const msEl = baziMappingStems[m.stem]?.element;
        const mbEl = baziMappingBranches[m.branch]?.element;
        
        const isHap = (m.branch === '子' && dayBranch === '丑') || (m.branch === '丑' && dayBranch === '子') ||
                      (m.branch === '寅' && dayBranch === '亥') || (m.branch === '亥' && dayBranch === '寅') ||
                      (m.branch === '卯' && dayBranch === '戌') || (m.branch === '戌' && dayBranch === '卯') ||
                      (m.branch === '辰' && dayBranch === '酉') || (m.branch === '酉' && dayBranch === '辰') ||
                      (m.branch === '巳' && dayBranch === '申') || (m.branch === '申' && dayBranch === '巳') ||
                      (m.branch === '午' && dayBranch === '未') || (m.branch === '未' && dayBranch === '午');
        const samHapGroups = [['亥', '卯', '未'], ['寅', '午', '戌'], ['巳', '酉', '丑'], ['申', '子', '辰']];
        const isSamHap = samHapGroups.some(g => g.includes(m.branch) && g.includes(dayBranch) && m.branch !== dayBranch);
        
        if (isHap || isSamHap) mScore += 30;
        if (isMale && (msEl === wealth || mbEl === wealth)) mScore += 20;
        if (!isMale && (msEl === controlsDm || mbEl === controlsDm)) mScore += 20;
        if (msEl === sikSang || mbEl === sikSang) mScore += 10;
        
        return { ...m, score: mScore };
      });

      monthlyData.sort((a,b) => b.score - a.score);
      let bestMonths = monthlyData.slice(0, 3).filter(m => m.score > 0);
      if (bestMonths.length === 0) bestMonths = monthlyData.slice(0, 2);
      bestMonths.sort((a, b) => a.month - b.month);
      const targetMonths = bestMonths.map(m => m.month);

      return { ...luck, score, reason, targetMonths };
    };

    const pastYears = [currentYear - 2, currentYear - 1, currentYear];
    const futureYears = [currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4, currentYear + 5];

    const pastLucks = pastYears.map(y => evaluateMarriageLuck(getYearlyLuck(y)));
    const futureLucks = futureYears.map(y => evaluateMarriageLuck(getYearlyLuck(y)));

    pastLucks.sort((a, b) => b.score - a.score);
    futureLucks.sort((a, b) => b.score - a.score);

    const bestPast = pastLucks[0];
    const bestFuture = futureLucks[0];

    const formatLuck = (l) => {
      const monthStr = l.targetMonths.join(', ');
      return lang === 'KO' 
        ? `${l.reason}야. **(성취 확률이 높은 달: ${monthStr}월)**`
        : `${l.reason}. **(High success months: ${monthStr})**`;
    };

    const main = lang === 'KO' ? 
      `네 인연의 타임라인을 스캔해봤어. [delay:1500]\n\n🕒 [가장 가까웠던/현재의 결혼운]\n${bestPast.year}년(${bestPast.stem}${bestPast.branch}년): ${formatLuck(bestPast)}\n\n🚀 [향후 가장 강력한 결혼운]\n${bestFuture.year}년(${bestFuture.stem}${bestFuture.branch}년): ${formatLuck(bestFuture)}\n\n결혼은 단순히 운의 흐름을 타는 게 아니라, 그 흐름 속에서 네가 어떤 선택을 하느냐가 중요해.` :
      `I've scanned your relationship timeline. [delay:1500]\n\n🕒 [Most Recent/Current Marriage Luck]\n${bestPast.year} (${bestPast.stem}${bestPast.branch}): ${formatLuck(bestPast)}\n\n🚀 [Strongest Future Marriage Luck]\n${bestFuture.year} (${bestFuture.stem}${bestFuture.branch}): ${formatLuck(bestFuture)}\n\nMarriage is about the choices you make.`;

    return { main, glitch: lang === 'KO' ? '운명은 준비된 자에게 찾아온다.' : 'Fate comes to the prepared.' };
  };
  const analyzeWealth = () => {
    const ELEMENT_CYCLE = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmStem = result.pillars[1].stem;
    const dmElement = BAZI_MAPPING.stems[dmStem as keyof typeof BAZI_MAPPING.stems]?.element || 'Wood';
    const dmIndex = ELEMENT_CYCLE.indexOf(dmElement);
    const sikElement = ELEMENT_CYCLE[(dmIndex + 1) % 5];
    const wealthElement = ELEMENT_CYCLE[(dmIndex + 2) % 5];
    const gwanElement = ELEMENT_CYCLE[(dmIndex + 3) % 5];
    const inElement = ELEMENT_CYCLE[(dmIndex + 4) % 5];
    const biElement = dmElement;

    // Current year analysis
    const currentYearPillar = result.currentYearPillar;
    const currentYear = currentYearPillar?.year || new Date().getFullYear();
    
    // Evaluate function
    const evaluateWealthScore = (pillar: any) => {
      let score = 50;
      const sEl = BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.element;
      const bEl = BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches]?.element;
      
      let traits: Record<string, boolean> = {
        isWealth: false,
        isSik: false,
        isGwan: false,
        isIn: false,
        isBi: false,
        isYong: false
      };

      if (sEl === wealthElement || bEl === wealthElement) traits.isWealth = true;
      if (sEl === sikElement || bEl === sikElement) traits.isSik = true;
      if (sEl === gwanElement || bEl === gwanElement) traits.isGwan = true;
      if (sEl === inElement || bEl === inElement) traits.isIn = true;
      if (sEl === biElement || bEl === biElement) traits.isBi = true;

      // Wealth specific score boosts
      if (sEl === wealthElement) score += 25;
      if (bEl === wealthElement) score += 25;
      if (sEl === sikElement) score += 15;
      if (bEl === sikElement) score += 15;
      
      // General luck boosts
      if (primEl && (sEl === primEl || bEl === primEl)) {
        score += 15;
        traits.isYong = true;
      }
      if (hEl && (sEl === hEl || bEl === hEl)) score += 10;
      if (gEl && (sEl === gEl || bEl === gEl)) score -= 20;

      const godsStr = (pillar.stemTenGodKo || '') + (pillar.branchTenGodKo || '');
      if (godsStr.includes('정재')) score += 15;
      if (godsStr.includes('편재')) score += 20;
      if (godsStr.includes('식신') || godsStr.includes('상관')) score += 10;
      if (godsStr.includes('겁재')) score -= 15;
      if (godsStr.includes('비견')) score -= 10;

      return { score: Math.min(Math.max(score, 0), 100), traits };
    };

    const currentYearData = evaluateWealthScore(currentAnnualPillar || {});
    const currentYearScore = currentYearData.score;
    
    // Evaluate Daewun baseline
    const daewunScore = evaluateWealthScore(currentCycle || {}).score;

    // Find best years in current 10-year cycle
    const annualScores = (currentCycle.annualPillars || []).map((p: any) => ({
      year: p.year,
      stem: p.stem,
      branch: p.branch,
      ...evaluateWealthScore(p)
    }));

    annualScores.sort((a: any, b: any) => b.score - a.score);
    const bestYears = annualScores.filter((y: any) => y.year >= currentYear).slice(0, 2);
    
    // If no future best years left in current daewun, just take top 2 overall
    const topYearsToDisplay = bestYears.length > 0 ? bestYears : annualScores.slice(0, 2);

    let report = '';
    
    // Helper to explain the "vibe" of the year
    const getYearVibeDescription = (traits: Record<string, boolean>) => {
      if (traits.isWealth && traits.isSik) return lang === 'KO' ? '내 능력과 활동이 바로 돈으로 직결되는 강력한 금전운' : 'very strong cash flow fueled by your active talents';
      if (traits.isWealth) return lang === 'KO' ? '직접적인 재물 기운이 꽂혀 돈 냄새가 짙게 나는' : 'a direct influx of wealth energy, smelling strongly of money';
      if (traits.isSik) return lang === 'KO' ? '새로운 아이디어나 활발한 활동이 돈으로 연결되는' : 'opportunities to turn new ideas and actions into cash';
      if (traits.isGwan && traits.isYong) return lang === 'KO' ? '명예와 직장의 기운이 좋아져 승진이나 입지 강화로 재물을 확보하는' : 'wealth growth driven by career advancement and enhanced reputation';
      if (traits.isIn && traits.isYong) return lang === 'KO' ? '부동산 계약이나 자격증 같은 문서운으로 자산을 크게 굳히는' : 'excellent chances to secure wealth through documents like real estate or contracts';
      if (traits.isBi && traits.isYong) return lang === 'KO' ? '인맥과 주변 동료의 기운으로 함께 판을 키워 이득을 보는' : 'benefiting from collaborations and expanding your network to boost resources';
      return lang === 'KO' ? '전체적인 흐름이 나에게 유리하게 작용하여 뜻밖의 성과를 내는' : 'overall favorable conditions leading to unexpected positive outcomes';
    };

    // 1. Current Daewun Overview
    const stemEl = BAZI_MAPPING.stems[currentCycle.stem as keyof typeof BAZI_MAPPING.stems]?.element || 'Wood';
    const branchEl = BAZI_MAPPING.branches[currentCycle.branch as keyof typeof BAZI_MAPPING.branches]?.element || 'Wood';
    
    // We get hex colors based on Bazi elements
    const getElementColorHex = (element: string) => {
      const colors: Record<string, string> = { 'Wood': '#22c55e', 'Fire': '#ef4444', 'Earth': '#eab308', 'Metal': '#94a3b8', 'Water': '#3b82f6' };
      return colors[element] || '#ffffff';
    };
    
    const stemColor = getElementColorHex(stemEl);
    const branchColor = getElementColorHex(branchEl);

    const daewunLabelKO = `${currentCycle.age}세-${currentCycle.age + 9}세 대운([${stemColor}:${currentCycle.stem}][${branchColor}:${currentCycle.branch}])`;
    const daewunLabelEN = `Ages ${currentCycle.age}-${currentCycle.age + 9} Daewun ([${stemColor}:${currentCycle.stem}][${branchColor}:${currentCycle.branch}])`;

    if (daewunScore >= 70) {
      report += lang === 'KO' 
        ? `현재 진행 중인 ${daewunLabelKO}은 큰 재물의 흐름이 들어오는 황금기야. 물이 들어왔으니 힘차게 노를 저어야 할 때지.\n\n`
        : `The current ${daewunLabelEN} cycle brings a strong flow of wealth. It's a golden period.\n\n`;
    } else if (daewunScore >= 40) {
      report += lang === 'KO' 
        ? `현재 ${daewunLabelKO}은 재물이 평탄하게 흐르는 시기야. 무리한 투자보다는 안정적인 축적에 유리해.\n\n`
        : `The current ${daewunLabelEN} cycle has a stable wealth flow. Focus on safe accumulation.\n\n`;
    } else {
      report += lang === 'KO'
        ? `현재 ${daewunLabelKO}은 큰 배팅보다는 내실을 다지고 현금 유동성을 확보하는 게 유리한 방어적 시기야. 하지만 기회는 항상 존재하는 법이지!\n\n`
        : `The current ${daewunLabelEN} cycle is defensive. Focus on securing cash flow rather than big bets, but stay alert for opportunities!\n\n`;
    }

    // 2. Current Year
    const currentYearBranch = currentYearPillar?.branch;
    const chartBranches = result.pillars.map((p: any) => p.branch);
    const punishments = ['辰', '午', '酉', '亥'];
    const hasSelfPunishment = currentYearBranch && punishments.includes(currentYearBranch) && chartBranches.includes(currentYearBranch);

    let currentYearIntro = lang === 'KO' ? `올해(${currentYear}년 ${currentYearPillar?.stem}${currentYearPillar?.branch}년)는 ` : `This year (${currentYear}) `;
    
    if (currentYearScore >= 70) {
      report += lang === 'KO'
        ? `${currentYearIntro}${getYearVibeDescription(currentYearData.traits)} 해로, 특히 돋보이는 운을 가지고 있어! 성과가 보상으로 직결되는 짜릿한 한 해가 될 가능성이 높아.\n`
        : `${currentYearIntro}brings ${getYearVibeDescription(currentYearData.traits)}, highlighting exceptionally strong luck! Hard work directly translates to rewards.\n`;
    } else if (currentYearScore >= 40) {
      report += lang === 'KO'
        ? `${currentYearIntro}재물 측면에서 무난한 흐름이야. 일확천금보다는 계획했던 대로 차곡차곡 모아가는 재미를 느껴봐.\n`
        : `${currentYearIntro}features ordinary but stable wealth luck. Follow your plans for steady accumulation.\n`;
    } else {
      report += lang === 'KO'
        ? `${currentYearIntro}재물운이 잠시 쉬어가는 흐름이야. 예상치 못한 지출이나 충동구매의 유혹이 강할 수 있어.\n\n`
          + `[액땜 꿀팁] 큰 돈이 나갈 뻔한 위기를 '나를 위한 자기계발 투자'나 '오래 쓸 수 있는 좋은 물건 구매'로 스스로 돈의 흐름을 긍정적으로 바꿔보는(액땜) 걸 추천해. 어차피 나갈 돈이라면 가치 있게 쓰는 거지!\n`
        : `${currentYearIntro}brings a pause in wealth luck. Watch out for unexpected expenses.\n\n` 
          + `[Remedy] Consider "warding off" bad luck by actively spending on self-development. If money must flow out, make it valuable for your future!\n`;
    }

    if (hasSelfPunishment) {
      const tooltipTermEN = '[tooltip:Self-Punishment|스스로를 형(刑)하는 기운. 내적 갈등이나 자기 검열이 심해질 수 있으나, 이를 극복하면 큰 성장을 이룰 수 있습니다.|Self-Punishment: Energy that punishes oneself. Can cause internal conflict, but overcoming it leads to great growth.]';
      const tooltipTermKO = '[tooltip:자형|스스로를 형(刑)하는 기운. 내적 갈등이나 자기 검열이 심해질 수 있으나, 이를 극복하면 큰 성장을 이룰 수 있습니다.|Self-Punishment: Energy that punishes oneself. Can cause internal conflict, but overcoming it leads to great growth.]';
      report += lang === 'KO'
        ? `\n다만 현재 느끼는 압박은 사실 외부적인 요인보다 본인의 조급함에서 오는 '${tooltipTermKO}'의 기운 때문이야. 남 탓보다는 내 안의 조급함을 달래는 게 먼저라는 점, 꼭 명심해.\n\n`
        : `\nHowever, the pressure you feel right now likely comes from your own impatience rather than external factors, due to ${tooltipTermEN} energy. Soothe your inner impatience first before blaming others.\n\n`;
    } else {
      report += `\n`;
    }

    // 3. Best upcoming years
    // Exclude current year if it was already highlighted as a top year to avoid repetition
    let filteredTopYears = topYearsToDisplay;
    if (currentYearScore >= 40 && topYearsToDisplay.some((y: any) => y.year === currentYear)) {
       // If current year is in top years AND we already discussed its okay/great state,
       // we shouldn't redundantly say "The most money-smelling year is THIS year".
       // We can change the wording.
       filteredTopYears = topYearsToDisplay.filter((y: any) => y.year !== currentYear);
    }
    
    if (filteredTopYears.length > 0) {
      // Create descriptions for the best remaining years
      let yearDescriptionsKO = '';
      if (lang === 'KO') {
        const groupedYears: Array<{desc: string, years: any[]}> = [];
        filteredTopYears.forEach((y: any) => {
          const desc = getYearVibeDescription(y.traits);
          const existingGroup = groupedYears.find(g => g.desc === desc);
          if (existingGroup) {
            existingGroup.years.push(y);
          } else {
            groupedYears.push({ desc, years: [y] });
          }
        });
        
        yearDescriptionsKO = groupedYears.map(g => {
          const yearsStr = g.years.map(y => `**${y.year}년(${y.stem}${y.branch}년)**`).join(', ');
          return `${yearsStr}(${g.desc} 시기)`;
        }).join(' 그리고 ');
      }
      
      const yearListEN = filteredTopYears.map((y: any) => `**${y.year}**`).join(' and ');
      
      report += lang === 'KO'
        ? `지금 대운 안에서 네가 특히 주목해야 할 타점은 ${yearDescriptionsKO}야. 이 중요한 기회를 잡기 위해 지금부터 멘탈과 시드머니를 장전해둬.`
        : `In this 10-year cycle, the key timings to watch out for are ${yearListEN}. Prepare your seed money and mental focus to catch these prime opportunities.`;
    } else if (topYearsToDisplay.length > 0) {
      // means current year was the only top year left
      report += lang === 'KO'
        ? `이미 올해가 대운 내에서 손꼽히는 기회의 해이니, 지금의 흐름을 최대한 활용하는 데 집중해봐!`
        : `Since this year is already one of the best in your current cycle, focus completely on maximizing the present momentum!`;
    }

    const branches = result.pillars.map((p: any) => p.branch);
    const hasMaoYouClash = branches.includes('卯') && branches.includes('酉');
    if (dmElement === 'Metal' && hasMaoYouClash) {
      report += lang === 'KO' 
        ? `\n\n[ ⚠️ 특별 자산 방어 경고 ]\n명식에 재물(卯)과 주변의 강력한 금(酉)들이 수시로 충돌하는 군비쟁재(군중이 내 재물을 노림)와 묘유충의 기운이 강해. 이 타점에 돈이 들어오더라도 주변에 **절대 소문내지 말고 비밀리에 자산을 확보해!** 쉽게 들어온 돈은 주변 사람들에 의해 순식간에 흩어질 수 있으니 투자나 동업은 피하고 단단히 묶어둬야 해.`
        : `\n\n[ ⚠️ Asset Defense Warning ]\nYour chart has a strong internal clash regarding wealth. When money comes in, **do not spread rumors and secure your assets secretly!** Wealth can easily scatter among peers or competitors, so avoid joint investments and hold onto your money carefully.`;
    }

    const glitch = currentYearScore < 50 
      ? (lang === 'KO' ? '비가 올 땐 독에 금이 가지 않았는지 점검할 때야.' : 'Check your jars for cracks when it rains.')
      : (lang === 'KO' ? '탐욕은 눈을 가리지만, 현명한 투자는 시야를 넓혀줘.' : 'Greed blinds, but wise investment broadens vision.');

    return { main: report, glitch };
  };
  const analyzeMoving = () => {
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
            ? `공망 방위(${bestDirection.split(' ')[0]})로의 이동은 밑빠진 독에 물 붓기야. 차라리 차선책인 다른 방위를 택해.`
            : `Moving to Void direction is futile. Pick another direction.`;
           altAction = (altAction ? altAction + "\n" : "") + gmWarn;
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
  const analyzeHealth = () => {
    return { main: lang === 'KO' ? '건강운은 현재 비공개 상태야.' : 'Health luck is currently private.', glitch: 'Rest up.' };
  };

  const analyzeSecrets = () => {
    return { main: lang === 'KO' ? '너만 아는 은밀한 이야기가 있니? 지금은 비밀을 지키는 게 좋겠어.' : 'Keep your secrets guarded for now.', glitch: 'Stay discreet.' };
  };

  const analyzeGeneral = () => {
    return { main, glitch, matrix };
  };

  const analyzeTaboo = () => {
    return { main: lang === 'KO' ? '금기된 행동을 하고 있지는 않은지 스스로를 돌아봐.' : 'Check if you are doing something taboo.', glitch: 'Be careful.' };
  };

  const analyzeDarkCurtain = () => {
    return { main: lang === 'KO' ? '어둠의 장막이 걷히길 기다려.' : 'Wait for the dark curtain to lift.', glitch: 'Stay hidden.' };
  };

  const analyzeDestinyMap = () => {
    const elRatios = analysis.elementRatios || { Wood: 20, Fire: 20, Earth: 20, Metal: 20, Water: 20 };
    const jsonPayload = {
      theme: lang === 'KO' ? '운명의 지도' : 'Destiny Map',
      momentum_score: luckScore,
      elements: elRatios,
      overview: lang === 'KO' 
        ? `오행의 분포와 대운의 흐름(Momentum)을 시각화한 데이터야. 현재 네 에너지는 ${luckScore}점으로 ${luckScore >= 70 ? '순항 중' : luckScore >= 40 ? '안정적' : '조절 지향적'}인 구간에 들어서 있어.` 
        : `Visualizing your five elements and momentum. Your current energy is at ${luckScore}, placing you in a ${luckScore >= 70 ? 'strong' : luckScore >= 40 ? 'stable' : 'defensive'} phase.`
    };
    
    const glitchText = lang === 'KO' 
      ? '지도는 내비게이션이 아냐. 길은 네가 뚫고 가는 거지.' 
      : 'A map is not a GPS. You forge the path.';
      
    return { main: JSON.stringify(jsonPayload), glitch: glitchText };
  };

  themeAnalyses['romance'] = analyzeRomance();
  themeAnalyses['marriage_timing'] = analyzeMarriageTiming();
  themeAnalyses['wealth'] = analyzeWealth();
  themeAnalyses['health'] = analyzeHealth();
  themeAnalyses['secrets'] = analyzeSecrets();
  themeAnalyses['moving'] = analyzeMoving();
  themeAnalyses['general'] = analyzeGeneral();
  themeAnalyses['taboo'] = analyzeTaboo();
  themeAnalyses['dark_curtain'] = analyzeDarkCurtain();
  themeAnalyses['destiny_map'] = analyzeDestinyMap();

  // Next Hook Logic
  const interactionsPool = analysis.interactions || [];
  const hasWonjin = interactionsPool.some((i: any) => i.type.includes('원진'));
  if (hasWonjin) {
    themeAnalyses['wealth'].nextHook = { text: "금화의 흐름은 읽었어. 그런데 네 사주 구석에 숨은 지독한 악연(원진)이 네 재물을 갉아먹고 있는 건 알고 있어? 이 비밀의 페이지도 열어볼래?", themeId: 'secrets' };
    themeAnalyses['general'].nextHook = { text: "전반적인 흐름은 이래. 그런데 네 인연의 실타래가 아주 복잡하게 꼬여있는 게 보이네. 확인해볼래?", themeId: 'romance' };
  }

  // Theme Targeting Score Calculation
  themeScores.health = 0;
  themeScores.taboo = 0;
  themeScores.dark_curtain = 0;

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
    // { 
    //   id: 'health', 
    //   title: lang === 'KO' ? '[영혼의 균열]' : '[Crack in the Soul]', 
    //   question: lang === 'KO' ? "자꾸만 흔들리는 내 몸과 마음... 어떻게 해야 이 고통을 잠재우고 평화를 찾을 수 있을까?" : "My body and mind keep shaking... How can I calm this pain and find peace?", 
    //   priority: themeScores.health 
    // },
    { 
      id: 'secrets', 
      title: lang === 'KO' ? '[비밀의 방]' : '[Chamber of Secrets]', 
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
      title: lang === 'KO' ? '[운명의 흐름]' : '[Flow of Destiny]', 
      question: lang === 'KO' ? "올해의 전반적인 흐름과 오늘의 기운을 한눈에 보여줘." : "Show me the overall flow of this year and today's energy at a glance.", 
      priority: 90 
    },
    // {
    //   id: 'taboo',
    //   title: lang === 'KO' ? '[금기된 페이지]' : '[Taboo Page]',
    //   question: lang === 'KO' ? "운명에 잠복한 치명적 위협, 삼형살(三刑殺)과 원진살의 폭발 시점을 경고해줘." : "Warn me of the fatal threats lurking in my destiny, the explosion point of Samhyeongsal and Wonjinsal.",
    //   priority: themeScores.taboo
    // },
    // {
    //   id: 'dark_curtain',
    //   title: lang === 'KO' ? '[암막의 장막]' : '[The Dark Curtain]',
    //   question: lang === 'KO' ? "내 삶의 밑빠진 독(공망)과 채워지지 않는 결핍(결핍 오행)이 의미하는 카르마를 읽어줘." : "Read the karma of the bottomless pit (Gongmang) and unquenchable deficit (Missing Elements) in my life.",
    //   priority: themeScores.dark_curtain
    // },
    {
      id: 'destiny_map',
      title: lang === 'KO' ? '[운명의 지도]' : '[Map of Destiny]',
      question: lang === 'KO' ? "내 사주 오행의 구조적 균형과 대운의 관성 점수를 시각적으로 분석해줘." : "Visually analyze the structural balance of my Bazi elements and the momentum score of my Grand Cycle.",
      priority: 95
    }
  ];

  const topTargeted = allThemes
    .filter(t => !['romance', 'wealth', 'general', 'destiny_map', 'taboo', 'dark_curtain', 'health'].includes(t.id))
    .sort((a, b) => b.priority - a.priority)[0];

  const displayThemes = [
    allThemes.find(t => t.id === 'romance')!,
    allThemes.find(t => t.id === 'wealth')!,
    topTargeted,
    allThemes.find(t => t.id === 'secrets')!,
    allThemes.find(t => t.id === 'moving')!,
    // allThemes.find(t => t.id === 'health')!,
    // allThemes.find(t => t.id === 'taboo')!,
    // allThemes.find(t => t.id === 'dark_curtain')!,
    allThemes.find(t => t.id === 'destiny_map')!,
    allThemes.find(t => t.id === 'general')!
  ].filter(Boolean);

  // Remove duplicates and ensure general is always there
  const finalThemes = Array.from(new Set(displayThemes));

  return {
    intro,
    questionPrompt: lang === 'KO' ? 
      `[delay:2000]

지금 네가 가장 궁금한 걸 대답해줄게. 뭐가 궁금해서 이런 심연(void)까지 찾아왔어?` :
      `[delay:2000]

I will answer what you are most curious about. What brought you to this void?`,
    themes: finalThemes,
    themeAnalyses,
    luckScore,
    luckColor: luckScore >= 70 ? '#00F2FF' : luckScore >= 40 ? '#FFD700' : '#FF1493'
  };
}
