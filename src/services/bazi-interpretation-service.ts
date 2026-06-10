import { BaZiResult, UserInput } from '../types';
import { INTERPRETATION_PROFILES, INTERPRETATION_PROFILES_EN, InterpretationProfile, INNATE_TRAITS } from '../constants/interpretationProfiles';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { generatePersonalizedTexts } from './personalized-text-engine';
import { STEM_PERSONALITIES, BRANCH_PERSONALITIES } from '../constants/stem-branch-personalities';

export interface TraitScore {
  key: string;
  name: string;
  score: number;
}

export interface BaziInterpretationData {
  userName: string;
  gender: string;
  iljuName: string;
  metaphorTitle: string;
  profileCode: string;
  baseProfileCode: string;
  isDeungRa: boolean;
  deungRaNote?: string;
  profile: InterpretationProfile;
  traitScores: TraitScore[];
  combinationCard: {
    dayMasterChar: string;
    combiningChars: { char: string; koreanPos: string; pillarTitle: string }[];
    poeticName: string;
    probability: number;
  };
  innateTemperament: {
    title: string;
    description: string;
    keyPillars: { pillarTitle: string; type: 'stem' | 'branch' }[];
  };
  lifestylePattern: {
    title: string;
    description: string;
    keyPillars: { pillarTitle: string; type: 'stem' | 'branch' }[];
  };
  wealthFlow: {
    title: string;
    description: string;
    keyPillars: { pillarTitle: string; type: 'stem' | 'branch' }[];
    typeTitle: string;
    pipeline: string;
    expansionScore: number;
    securityScore: number;
    pioneeringScore: number;
    expansionAnalysis: string;
    securityAnalysis: string;
    pioneeringAnalysis: string;
    actionPlans: string[];
  };
  realWorldPattern: {
    title: string;
    description: string;
  };
  yongshinAdvice: {
    title: string;
    luckyItems: string[];
    actions: string[];
    colors: string[];
  };
  luckTiming: {
    currentDaeun: string;
    currentDaeunInterpretation: string;
    currentSewun: string;
    currentSewunInterpretation: string;
  };
}

// Helper to extract 10-God ratios in a language-agnostic way
export function getTenGodRatios(tenGods: Record<string, number>) {
  const getScore = (keywords: string[]) => {
    return Object.entries(tenGods).reduce((sum, [key, val]) => {
      if (keywords.some(kw => key.includes(kw))) {
        return sum + (val as number);
      }
      return sum;
    }, 0);
  };

  return {
    biGyeop: getScore(['비겁', 'Companion', 'Sibling', 'Rival', 'Mirror']),
    sikSang: getScore(['식상', 'Artist', 'Rebel', 'Creator']),
    jaeSeong: getScore(['재성', 'Maverick', 'Architect', 'Wealth']),
    gwanSeong: getScore(['관성', 'Warrior', 'Judge', 'Officer']),
    inSeong: getScore(['인성', 'Mystic', 'Sage', 'Resource'])
  };
}

export function generateBaziInterpretation(result: BaZiResult, userInput: UserInput, lang: string = 'KO'): BaziInterpretationData {
  const userName = userInput.name || '';
  const nameLabel = userName ? `${userName}님` : '당신';
  const genderKo = lang === 'KO'
    ? (userInput.gender === 'male' ? "남자" : userInput.gender === 'female' ? "여자" : "사용자")
    : (userInput.gender === 'male' ? "Male" : userInput.gender === 'female' ? "Female" : "User");

  const dayPillar = result.pillars?.find(p => p.title === 'Day');
  const dayMasterStem = dayPillar?.stem || '戊';
  const dayMasterElement = dayPillar?.element || 'Earth';
  
  // 1. Get Ilju name
  const stemKoFull = BAZI_MAPPING.stems[dayMasterStem as keyof typeof BAZI_MAPPING.stems]?.[lang === 'KO' ? 'ko' : 'en'] || '';
  const branchKoFull = dayPillar ? (BAZI_MAPPING.branches[dayPillar.branch as keyof typeof BAZI_MAPPING.branches]?.[lang === 'KO' ? 'ko' : 'en'] || '') : '';
  
  const stemEngPrefix = BAZI_MAPPING.stems[dayMasterStem as keyof typeof BAZI_MAPPING.stems]?.en?.split(' ')[0] || '';
  const branchEngPrefix = dayPillar ? (BAZI_MAPPING.branches[dayPillar.branch as keyof typeof BAZI_MAPPING.branches]?.en?.split(' ')[0] || '') : '';

  const iljuKo = lang === 'KO' 
    ? (stemKoFull.charAt(0) + branchKoFull.charAt(0)) 
    : `${stemEngPrefix}-${branchEngPrefix}`;

  const iljuName = lang === 'KO' 
    ? `${iljuKo}일주 (${dayPillar?.hanja || '戊寅'})` 
    : `${iljuKo} Pillar (${dayPillar?.hanja || '戊寅'})`;

  // 2. Extract scores & stats
  const tenGods = result.analysis?.tenGodsRatio || {};
  const ratios = getTenGodRatios(tenGods);
  const elementRatios = result.analysis?.elementRatios || {};
  const isStrongDM = result.analysis?.shinGangShinYak?.isStrong ?? 
                    (result.analysis?.dayMasterStrength?.score >= 3.5 ? true : false);

  const getElementPct = (el: string) => elementRatios[el] || 0;
  const maxElement = Object.entries(elementRatios).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Earth';

  // 3. Poetic Metaphor Generator based on Day Master and dominant elements
  let metaphorTitle = "";
  if (lang === 'EN') {
    switch (dayMasterStem) {
      case '甲':
        if (maxElement === 'Water') metaphorTitle = "A clear, giant tree growing high towards the sky, absorbing the light of a deep lake";
        else if (maxElement === 'Fire') metaphorTitle = "A passionate, giant tree blooming itself under the brilliant sunlight";
        else if (maxElement === 'Metal') metaphorTitle = "A resilient pine tree firmly enduring cold winds and harsh rain on a cold cliff";
        else if (maxElement === 'Earth') metaphorTitle = "A steady, reliable pine tree deeply rooted in a wide and fertile soil";
        else metaphorTitle = "A clean, giant tree stretching towards the sky under a spring breeze";
        break;
      case '乙':
        if (maxElement === 'Metal') metaphorTitle = "A wild wildflower blooming its life even in the crevices of sharp rocks";
        else if (maxElement === 'Water') metaphorTitle = "A pure, clear lotus flower floating peacefully on a calm, wide lake";
        else if (maxElement === 'Fire') metaphorTitle = "A luscious rose vine decorating all directions in red under the passionate summer heat";
        else if (maxElement === 'Earth') metaphorTitle = "A resilient blade of grass persistently breaking through the cold fields to sprout";
        else metaphorTitle = "A flexible vine dancing gently with the wind but not easily broken";
        break;
      case '丙':
        if (maxElement === 'Water') metaphorTitle = "A majestic morning sun rising over the deep blue sea, pushing away the darkness";
        else if (maxElement === 'Wood') metaphorTitle = "Warm morning sunlight evenly sharing the warmth of life through the dense forest paths";
        else if (maxElement === 'Metal') metaphorTitle = "A flame in a blast furnace refining cold ores into brilliant gems";
        else if (maxElement === 'Earth') metaphorTitle = "Sunlight that warmly shines upon the vast earth to create abundance";
        else metaphorTitle = "A brilliant sun that illuminates all directions, bringing connection and joy";
        break;
      case '丁':
        if (maxElement === 'Water') metaphorTitle = "A lighthouse beacon quietly guiding the night sea under the pitch-black sky";
        else if (maxElement === 'Wood') metaphorTitle = "A reliable bonfire warming the hearth on a windy, deep night";
        else if (maxElement === 'Metal') metaphorTitle = "A quietly burning spark in a dark jewelry box, shining with delicate heat";
        else if (maxElement === 'Earth') metaphorTitle = "A cozy hearth warming a frozen body in a cold, snowy field";
        else metaphorTitle = "A wise lighthouse quietly warming the frozen hearts of those nearby";
        break;
      case '戊':
        if (maxElement === 'Wood') metaphorTitle = "A mysterious rocky mountain with giant trees and dense forests stretching high";
        else if (maxElement === 'Water') metaphorTitle = "A vast territory holding cool rivers and lakes in its steady embrace";
        else if (maxElement === 'Fire') metaphorTitle = "An active volcano harboring hot energy deep inside, ready to erupt anytime";
        else if (maxElement === 'Metal') metaphorTitle = "A grand mountain keeping silence while concealing hard steel and precious gems";
        else metaphorTitle = "A giant mountain that silently keeps its place to bring trust through any storm";
        break;
      case '己':
        if (maxElement === 'Wood') metaphorTitle = "A warm spring garden where fresh green sprouts and flowers bloom with vitality";
        else if (maxElement === 'Water') metaphorTitle = "Fertile soil suitable for all things to grow, moistened by soft and clear rain";
        else if (maxElement === 'Fire') metaphorTitle = "Friendly soil cultivating grains under the warm, pleasant sun";
        else if (maxElement === 'Metal') metaphorTitle = "A fertile field concealing sparkling sand and small pearls to enhance value";
        else metaphorTitle = "A moist, soft earth that warmly embraces and nurtures all seeds without discrimination";
        break;
      case '庚':
        if (maxElement === 'Fire') metaphorTitle = "A cold silver blade finished by constant tempering and hammering in fire";
        else if (maxElement === 'Water') metaphorTitle = "A precious sword concealed in a calm, dark winter lake, hiding its blade";
        else if (maxElement === 'Wood') metaphorTitle = "An iron axe creating order and utility in a wild, untamed forest";
        else if (maxElement === 'Earth') metaphorTitle = "Reliable iron ore building weight silently under the earth embankments of a giant mine";
        else metaphorTitle = "A sturdy steel rock establishing its firm justice and principles, never compromising";
        break;
      case '辛':
        if (maxElement === 'Water') metaphorTitle = "A white gold ring shining more clearly and transparently in clean, cold running water";
        else if (maxElement === 'Fire') metaphorTitle = "A diamond sparkling brilliantly under colorful stage lights";
        else if (maxElement === 'Wood') metaphorTitle = "Silver scissors precisely pruning the grass in a lush garden";
        else if (maxElement === 'Earth') metaphorTitle = "A noble gem buried deep under a snowy field but eventually shining its light";
        else metaphorTitle = "A flawless gem aiming for pure, clean, and perfect beauty";
        break;
      case '壬':
        if (maxElement === 'Wood') metaphorTitle = "A clear, grand river flowing through forest paths, full of life";
        else if (maxElement === 'Metal') metaphorTitle = "A majestic waterfall cascading with a thundering sound from rocky peaks";
        else if (maxElement === 'Fire') metaphorTitle = "Waves sparkling on a sea colored red by the golden sunset";
        else if (maxElement === 'Earth') metaphorTitle = "A deep lake surrounded by giant embankments, providing endless water of wisdom";
        else metaphorTitle = "A vast ocean silently treading with all the trials and flows of the world";
        break;
      case '癸':
        if (maxElement === 'Wood') metaphorTitle = "A cold morning dew sparkling pure and clear on fresh leaves";
        else if (maxElement === 'Fire') metaphorTitle = "A gentle rain quietly settling on burning red flames to cool down the heat";
        else if (maxElement === 'Earth') metaphorTitle = "An autumn cloud settling soundly on the cracked earth to quench the thirst of all life";
        else if (maxElement === 'Metal') metaphorTitle = "A clear night rain quietly washing over the cold metallic rocks";
        else metaphorTitle = "A morning mist quietly seeping in to fill the surroundings with new vitality";
        break;
      default:
        metaphorTitle = "A harmonious soul formed by the combination of cosmic energies";
    }
  } else {
    switch (dayMasterStem) {
      case '甲':
        if (maxElement === 'Water') metaphorTitle = "깊은 호숫가 물빛을 흡수하며 하늘 높이 자라나는 청량한 거목";
        else if (maxElement === 'Fire') metaphorTitle = "태양의 찬란한 빛을 받아 스스로 꽃 피우는 열정 가득한 거목";
        else if (maxElement === 'Metal') metaphorTitle = "차가운 절벽 위 모진 비바람을 굳건히 버텨내는 강인한 소나무";
        else if (maxElement === 'Earth') metaphorTitle = "넓고 비옥한 대지 위에 뿌리를 깊게 내린 우직하고 든든한 낙락장송";
        else metaphorTitle = "봄바람의 기운을 받아 거침없이 하늘로 뻗어나가는 청초한 거목";
        break;
      case '乙':
        if (maxElement === 'Metal') metaphorTitle = "날카로운 바위 틈 사이에서도 생명력을 움틔우는 야생 들꽃";
        else if (maxElement === 'Water') metaphorTitle = "고요하고 넓은 호수 위를 한가로이 노니는 고결하고 맑은 연꽃";
        else if (maxElement === 'Fire') metaphorTitle = "한여름 타오르는 열정 아래 사방을 붉게 장식하는 탐스러운 장미 넝쿨";
        else if (maxElement === 'Earth') metaphorTitle = "차가운 들판을 억척스럽게 뚫고 나와 기어이 싹을 틔우는 강인한 풀잎";
        else metaphorTitle = "바람을 따라 유연하게 춤추면서도 쉽게 부러지지 않는 유연한 넝쿨";
        break;
      case '丙':
        if (maxElement === 'Water') metaphorTitle = "푸르고 깊은 바다 너머로 어둠을 밀어내며 장엄하게 떠오르는 아침 태양";
        else if (maxElement === 'Wood') metaphorTitle = "무성한 숲길 사이로 생명의 온기를 골고루 나누어주는 따뜻한 아침 햇살";
        else if (maxElement === 'Metal') metaphorTitle = "차가운 원석들을 한데 모아 찬란한 보석으로 빚어내는 용광로 속 불꽃";
        else if (maxElement === 'Earth') metaphorTitle = "광활하게 펼쳐진 대지를 빈틈없이 따스하게 비추어 풍요를 만드는 햇살";
        else metaphorTitle = "온 사방을 밝게 통하게 하여 소통과 기쁨을 선사하는 찬란한 태양";
        break;
      case '丁':
        if (maxElement === 'Water') metaphorTitle = "칠흑 같은 밤하늘 아래 조용히 밤바다의 길을 지켜주는 등대의 횃불";
        else if (maxElement === 'Wood') metaphorTitle = "바람 부는 깊은 밤, 화롯가에 모닥불을 피워 주변을 데우는 든든한 촛불";
        else if (maxElement === 'Metal') metaphorTitle = "어두운 보석 상자 속에서 조용히 열기와 빛을 내며 영롱하게 반짝이는 불씨";
        else if (maxElement === 'Earth') metaphorTitle = "차가운 겨울 눈밭 속에서 얼어붙은 몸을 훈훈하게 보듬어주는 화로";
        else metaphorTitle = "주변의 얼어붙은 마음을 조용히 따스하게 어루만지는 지혜로운 등대";
        break;
      case '戊':
        if (maxElement === 'Wood') metaphorTitle = "태산 위에 곧게 뻗은 고목들과 울창한 숲이 어우러진 신비로운 바위 산";
        else if (maxElement === 'Water') metaphorTitle = "굽이쳐 흐르는 시원한 강물과 호수를 듬직하게 품어 안은 광활한 영토";
        else if (maxElement === 'Fire') metaphorTitle = "언제든 폭발할 수 있는 뜨거운 에너지를 내면에 품고 있는 활화산";
        else if (maxElement === 'Metal') metaphorTitle = "단단한 강철과 보석 원석들을 깊이 감추고 고요를 지키는 태산";
        else metaphorTitle = "어떤 폭풍우가 몰아쳐도 묵묵히 제자리를 지키며 신뢰를 주는 거대한 산";
        break;
      case '己':
        if (maxElement === 'Wood') metaphorTitle = "푸른 새싹들과 꽃송이들이 생동감 넘치게 자라나는 봄날의 따스한 정원";
        else if (maxElement === 'Water') metaphorTitle = "부드럽고 맑은 빗물이 대지를 적셔 만물이 자라나기 좋은 풍요로운 농토";
        else if (maxElement === 'Fire') metaphorTitle = "찬란한 태양 볕 아래에서 기분 좋게 알곡을 키워가는 다정한 흙";
        else if (maxElement === 'Metal') metaphorTitle = "속내에 반짝이는 모래알과 작은 진주들을 머금어 가치를 돋우는 비옥한 밭";
        else metaphorTitle = "모든 씨앗을 차별 없이 정성스럽게 보듬어 길러내는 촉촉하고 부드러운 대지";
        break;
      case '庚':
        if (maxElement === 'Fire') metaphorTitle = "화염 속에서 끊임없이 두드려지고 단련되어 완성된 차가운 은빛 칼날";
        else if (maxElement === 'Water') metaphorTitle = "고요하고 어두운 한겨울 호수 속에 깊이 가라앉아 칼날을 숨긴 보검";
        else if (maxElement === 'Wood') metaphorTitle = "거친 야생의 원시림 속에서 질서와 쓰임새를 만들어내는 무쇠 도끼";
        else if (maxElement === 'Earth') metaphorTitle = "거대한 광산의 흙제방 속에 잠겨 묵묵히 무게감을 키워가는 듬직한 철광석";
        else metaphorTitle = "자신의 확고한 정의와 원칙을 세우고 타협하지 않는 우직한 강철 바위";
        break;
      case '辛':
        if (maxElement === 'Water') metaphorTitle = "깨끗하고 차가운 흐르는 물속에서 더욱 맑고 투명하게 빛나는 백금 반지";
        else if (maxElement === 'Fire') metaphorTitle = "화려한 무대 위에서 다채로운 조명 빛을 받아 눈부시게 반짝이는 다이아몬드";
        else if (maxElement === 'Wood') metaphorTitle = "울창하게 뻗은 정원의 풀잎들을 정교하고 예리하게 손질하는 은빛 가위";
        else if (maxElement === 'Earth') metaphorTitle = "눈 덮인 들판 깊은 흙 속에 파묻혀 있으나 결국 그 빛을 발하는 고결한 보석";
        else metaphorTitle = "티 없이 맑고 순수하며 흐트러짐 없는 완벽한 아름다움을 지향하는 보석";
        break;
      case '壬':
        if (maxElement === 'Wood') metaphorTitle = "나무숲을 통과하며 굽이쳐 흘러내리는 생명력 넘치는 맑고 웅장한 대하";
        else if (maxElement === 'Metal') metaphorTitle = "바위 봉우리 사이에서 우레와 같은 소리를 내며 쏟아져 내리는 웅장한 폭포";
        else if (maxElement === 'Fire') metaphorTitle = "황금빛 노을이 붉게 물드는 바다 위에서 화려하게 반짝이는 파도";
        else if (maxElement === 'Earth') metaphorTitle = "거대한 제방에 둘러싸여 마르지 않는 지혜의 샘물을 제공하는 깊은 호수";
        else metaphorTitle = "세상의 모든 시련과 흐름을 조용히 품고 묵묵히 흘러가는 드넓은 대해";
        break;
      case '癸':
        if (maxElement === 'Wood') metaphorTitle = "싱그러운 새벽 잎사귀마다 영롱하고 깨끗하게 맺혀 있는 차가운 아침 이슬";
        else if (maxElement === 'Fire') metaphorTitle = "타오르는 붉은 불꽃 위로 조용히 내려앉아 열기를 가라앉히는 상냥한 단비";
        else if (maxElement === 'Earth') metaphorTitle = "갈라진 대지 위에 소리 없이 내려앉아 만물의 목마름을 축이는 가을 구름";
        else if (maxElement === 'Metal') metaphorTitle = "차가운 밤의 금석들을 조용히 어루만지며 씻겨 내려가는 맑은 밤비";
        else metaphorTitle = "조용하고 은은하게 스며들어 주변에 새로운 생명력을 채워주는 아침 안개";
        break;
      default:
        metaphorTitle = "하늘과 땅의 기운이 어우러져 피어난 조화로운 영혼의 모습";
    }
  }

  // 4. Structure/Special Profile Matcher
  const hasDeungRa = result.analysis?.specialPatterns?.some((p: any) => p.code === 'DEUNG_RA' || p.name?.includes('등라계갑')) || 
                     (dayMasterStem === '乙' && result.pillars?.some(p => p.title !== 'Day' && p.stem === '甲'));

  let baseProfileCode = "BALANCED";
  if (!isStrongDM && ratios.gwanSeong >= 35) {
    baseProfileCode = "GWAN_DA_SHIN_YAK";
  } else if (!isStrongDM && ratios.jaeSeong >= 35) {
    baseProfileCode = "JAE_DA_SHIN_YAK";
  } else if (ratios.sikSang >= 35) {
    baseProfileCode = "SIKSANG_GWADA";
  } else if (ratios.inSeong >= 35) {
    baseProfileCode = "INSEONG_GWADA";
  } else if (ratios.biGyeop >= 35) {
    baseProfileCode = "BIGYEOP_GWADA";
  }

  const profileCode = baseProfileCode;
  const baseProfile = lang === 'KO'
    ? (INTERPRETATION_PROFILES[profileCode] || INTERPRETATION_PROFILES["BALANCED"])
    : (INTERPRETATION_PROFILES_EN[profileCode] || INTERPRETATION_PROFILES_EN["BALANCED"]);
  const profile = { ...baseProfile };

  // 등라계갑 overlay 문구
  const deungRaNote = hasDeungRa
    ? (lang === 'KO'
      ? `이 사주에는 희귀 조합 '등라계갑(藤蘿繫甲)'이 내재합니다. 을목(乙)이 갑목(甲)을 만나 넝쿨이 거목을 타고 오르는 형상으로, 귀인복이 매우 강하고 강력한 파트너나 큰 플랫폼·조직과 연합했을 때 비약적인 시너지가 폭발합니다. 단독 행동보다 협력과 파트너십에서 이 기운이 가장 강하게 발동합니다.`
      : `This chart holds the rare combination 'Deungra-Gyegap (藤蘿繫甲)'. Representing Eul-wood climbing a giant pine tree (Gap-wood), this indicates powerful benefactor support. You achieve massive synergy when aligned with a large platform, organization, or mentor. Success blooms through collaboration rather than solo actions.`)
    : undefined;

  // 5. Dynamic Potential Scoring
  const traitsMap: Record<string, number> = {
    leadership: Math.round(Math.min(100, Math.max(30, 50 + ratios.gwanSeong * 1.2 + ratios.biGyeop * 0.5 + (isStrongDM ? 15 : 0)))),
    decisionMaking: Math.round(Math.min(100, Math.max(25, 45 + ratios.biGyeop * 1.0 + ratios.gwanSeong * 0.6 + (getElementPct('Metal') > 25 ? 10 : 0) + (isStrongDM ? 10 : 0)))),
    mental: Math.round(Math.min(100, Math.max(20, 40 + ratios.inSeong * 1.0 + ratios.biGyeop * 0.8 + (isStrongDM ? 20 : 0) - (profileCode === "GWAN_DA_SHIN_YAK" ? 25 : 0)))),
    responsibility: Math.round(Math.min(100, Math.max(35, 50 + ratios.gwanSeong * 1.5 + (isStrongDM ? 10 : 0)))),
    fightingSpirit: Math.round(Math.min(100, Math.max(20, 40 + ratios.biGyeop * 1.5 + (getElementPct('Fire') > 25 ? 10 : 0) + (isStrongDM ? 15 : 0)))),
    nobleSupport: Math.round(Math.min(100, Math.max(40, 50 + ratios.inSeong * 1.2 + (result.analysis?.shinsal?.some((s: any) => s.name?.includes('천을')) ? 20 : 0)))),
    peopleReading: Math.round(Math.min(100, Math.max(30, 45 + ratios.jaeSeong * 1.0 + ratios.inSeong * 0.8 + (getElementPct('Water') > 25 ? 10 : 0)))),
    sensitivity: Math.round(Math.min(100, Math.max(25, 40 + ratios.sikSang * 1.2 + ratios.inSeong * 0.8 + ((getElementPct('Water') > 25 || getElementPct('Wood') > 25) ? 10 : 0)))),
    independence: Math.round(Math.min(100, Math.max(20, 35 + ratios.biGyeop * 1.8 + (isStrongDM ? 20 : 0)))),
    patience: Math.round(Math.min(100, Math.max(30, 45 + ratios.inSeong * 1.0 + ratios.gwanSeong * 0.8 + (getElementPct('Earth') > 25 ? 10 : 0)))),
    businessSense: Math.round(Math.min(100, Math.max(15, 35 + ratios.jaeSeong * 1.5 + ratios.sikSang * 0.8 + (isStrongDM ? 10 : 0)))),
    relationshipLuck: Math.round(Math.min(100, Math.max(35, 50 + (userInput.gender === 'male' ? ratios.jaeSeong * 0.6 : ratios.gwanSeong * 0.6) + ratios.biGyeop * 0.4 + (result.analysis?.interactions?.some((i: any) => i.type?.includes('합')) ? 15 : 0)))),
    creativity: Math.round(Math.min(100, Math.max(25, 40 + ratios.sikSang * 1.5 + ratios.inSeong * 0.5 + ((getElementPct('Wood') > 25 || getElementPct('Fire') > 25) ? 10 : 0)))),
    expressiveness: Math.round(Math.min(100, Math.max(15, 35 + ratios.sikSang * 1.8 + (getElementPct('Fire') > 25 ? 15 : 0))))
  };

  const TRAIT_EN_NAMES: Record<string, string> = {
    leadership: "Leadership",
    decisionMaking: "Decision Making",
    mental: "Mental Strength",
    responsibility: "Responsibility",
    fightingSpirit: "Competitive Drive",
    nobleSupport: "Benefactor Luck",
    peopleReading: "Insight into People",
    sensitivity: "Sensitivity",
    independence: "Independence",
    patience: "Patience",
    businessSense: "Business Acumen",
    relationshipLuck: "Relationship Luck",
    creativity: "Creativity",
    expressiveness: "Expressiveness"
  };

  const traitScores: TraitScore[] = INNATE_TRAITS.map(t => ({
    key: t.key,
    name: lang === 'KO' ? t.name : (TRAIT_EN_NAMES[t.key] || t.key),
    score: traitsMap[t.key] || 50
  })).sort((a, b) => b.score - a.score).slice(0, 8);

  if (lang === 'KO') {
    const dynamicTexts = generatePersonalizedProfileText(
      userName,
      dayMasterStem,
      result,
      ratios,
      traitScores,
      profileCode
    );
    profile.character = dynamicTexts.character;
    profile.description = dynamicTexts.description;
  }

  // 6. Yongshin Advice extraction
  const yongShenElement = result.analysis?.yongshinDetail?.primary?.element || result.analysis?.yongShen || 'Wood';
  const yongShenElemName = yongShenElement.split('/')[0] || yongShenElement;

  const ELEM_KO_NAMES: Record<string, string> = {
    "Wood": "목(木)",
    "Fire": "화(火)",
    "Earth": "토(土)",
    "Metal": "금(金)",
    "Water": "수(水)"
  };

  const luckyHabitsMap: Record<string, string[]> = {
    "Wood": ["아침 일찍 숲이나 공원을 산책하며 생기를 받으세요.", "성장형 도서를 읽거나 새로운 외국어 공부를 시작해 보세요.", "계획을 꼼꼼히 종이에 펜으로 받아적어 실천하기"],
    "Fire": ["매일 밝은 햇볕을 30분 이상 쬐며 에너지를 흡수하세요.", "내 의견과 아이디어를 말이나 글로 가감없이 시원하게 표현하기", "적당한 유산소 운동으로 땀을 흘리고 순환하기"],
    "Earth": ["일기를 쓰거나 내면의 안정을 지키는 명상 시간 갖기", "어려운 이의 고민을 묵묵히 들어주며 포용력 기르기", "안정적인 저축이나 실질적인 재테크 계획 수립하기"],
    "Metal": ["불필요한 인간관계나 물건을 과감히 정리하는 단호함 훈련", "나만의 확실한 규칙과 루틴을 만들어 어기지 않고 실천하기", "결과 중심적인 단기 목표를 세워 하나씩 클리어해 나가기"],
    "Water": ["조용한 서재에서 독서하거나 차를 마시는 정적인 휴식", "상대의 감정에 조율하되 휩쓸리지 않고 차분히 관찰하기", "유연하고 유동적인 자세로 예상치 못한 변화 수용하기"]
  };

  const luckyColorsMap: Record<string, string[]> = {
    "Wood": ["초록색 (Green)", "올리브색 (Olive)"],
    "Fire": ["붉은색 (Red)", "오렌지색 (Orange)"],
    "Earth": ["황토색 (Yellow/Brown)", "베이지색 (Beige)"],
    "Metal": ["흰색 (White)", "금색 (Gold/Silver)"],
    "Water": ["검은색 (Black)", "남색 (Navy/Dark Blue)"]
  };

  const luckyItemsMap: Record<string, string[]> = {
    "Wood": ["나무 재질의 액세서리나 목공예 소품", "화분이나 실내 식물 기르기"],
    "Fire": ["화려하고 붉은빛의 장식품 또는 캔들", "조명 스탠드와 화려한 굿즈"],
    "Earth": ["도자기 제품이나 황토 세라믹 소품", "차분한 톤의 스톤 디퓨저"],
    "Metal": ["금속 소재의 시계나 은반지", "깔끔한 만년필 또는 스틸 프레임 안경"],
    "Water": ["물병이나 맑은 유리 화병", "바다나 파도 관련 미술 엽서"]
  };

  const luckyHabitsMapEN: Record<string, string[]> = {
    "Wood": ["Walk in a forest or park early in the morning to absorb life energy.", "Read self-growth books or start learning a new language.", "Write down plans in detail with a pen on paper to practice."],
    "Fire": ["Absorb energy by soaking in bright sunlight for more than 30 minutes daily.", "Express your opinions and ideas clearly in speech or writing.", "Sweat and improve circulation with moderate aerobic exercise."],
    "Earth": ["Have meditation time to write a diary or maintain inner peace.", "Listen quietly to others' concerns to build tolerance.", "Establish stable savings or realistic financial plans."],
    "Metal": ["Practice firmness by boldly organizing unnecessary relationships or items.", "Create and stick to your own clear rules and routines.", "Set result-oriented short-term goals and clear them one by one."],
    "Water": ["Take static rests like reading or drinking tea in a quiet study.", "Tune in to others' emotions but observe calmly without being swept away.", "Accept unexpected changes with a flexible and fluid attitude."]
  };

  const luckyColorsMapEN: Record<string, string[]> = {
    "Wood": ["Green", "Olive"],
    "Fire": ["Red", "Orange"],
    "Earth": ["Yellow/Brown", "Beige"],
    "Metal": ["White", "Gold/Silver"],
    "Water": ["Black", "Navy/Dark Blue"]
  };

  const luckyItemsMapEN: Record<string, string[]> = {
    "Wood": ["Wooden accessories or woodwork items", "Growing potted plants or indoor vegetation"],
    "Fire": ["Bright, red decorations or candles", "Lighting stands and colorful merchandise"],
    "Earth": ["Ceramic products or clay pottery items", "Stone diffusers in calm tones"],
    "Metal": ["Metallic watches or silver rings", "Sleek fountain pens or steel-framed glasses"],
    "Water": ["Water bottles or clear glass vases", "Art postcards related to the sea or waves"]
  };

  const yongshinAdvice = {
    title: lang === 'KO'
      ? `${ELEM_KO_NAMES[yongShenElemName] || yongShenElemName} (용신) 기운 보완하기`
      : `Supplementing ${yongShenElemName} (Yongshin) Energy`,
    luckyItems: lang === 'KO'
      ? (luckyItemsMap[yongShenElemName] || luckyItemsMap["Wood"])
      : (luckyItemsMapEN[yongShenElemName] || luckyItemsMapEN["Wood"]),
    actions: lang === 'KO'
      ? (luckyHabitsMap[yongShenElemName] || luckyHabitsMap["Wood"])
      : (luckyHabitsMapEN[yongShenElemName] || luckyHabitsMapEN["Wood"]),
    colors: lang === 'KO'
      ? (luckyColorsMap[yongShenElemName] || luckyColorsMap["Wood"])
      : (luckyColorsMapEN[yongShenElemName] || luckyColorsMapEN["Wood"])
  };

  // 7. Luck timing analysis
  const currentDaeun = (result as any).dynamic_luck?.current_daewoon || 
                       (result.grandCycles?.[result.currentCycleIndex] ? 
                        `${result.grandCycles[result.currentCycleIndex].stem}${result.grandCycles[result.currentCycleIndex].branch}` : (lang === 'KO' ? "대운 미정" : "Cycle Pending"));

  const currentSewun = (result as any).dynamic_luck?.current_seun || (lang === 'KO' ? "2026 병오년 (丙午)" : "2026 Year of Fire Horse (丙午)");

  const currentDaeunInterpretation = lang === 'KO'
    ? (isStrongDM 
      ? `현재 대운은 ${nameLabel}의 강한 주관을 조율하고 다듬어 더 큰 사회적 성취와 책임(관성/재성)을 잡아야 하는 판입니다. 적극적으로 사회적 무대에 오르세요.`
      : `현재 대운은 에너지를 무조건 쓰기보다 비겁(동료)과 인성(배움)을 통해 힘을 보충해야 하는 힐링 및 내실 준비 기간에 가깝습니다.`)
    : (isStrongDM
      ? `Your current grand cycle is a time to refine your strong individuality and grasp greater achievements and responsibilities (Power/Wealth). Step onto the social stage actively.`
      : `Your current grand cycle is closer to a healing and preparation period where you should recharge energy through learning and partnerships rather than exhausting your resources.`);

  const currentSewunInterpretation = lang === 'KO'
    ? `올해 세운은 ${nameLabel}의 핵심 에너지와 충/합을 이루어 뜻밖의 새로운 시작이나 전환점(계약, 문서, 이직운 등)이 열릴 조짐이 있습니다. 사소한 감정의 급물살을 피하고 신중하게 도장을 찍으세요.`
    : `This year's annual cycle interacts with your core energy, signaling unexpected new beginnings or turning points (contracts, document luck, job changes). Avoid impulsive emotional waves and sign documents carefully.`;

  // 8. Combination Card Data
  const monthPillar = result.pillars?.find(p => p.title === 'Month');
  const yearPillar = result.pillars?.find(p => p.title === 'Year');
  const hourPillar = result.pillars?.find(p => p.title === 'Hour');

  const combiningChars = [
    monthPillar ? { char: monthPillar.stem, koreanPos: '월간', pillarTitle: 'Month' } : null,
    yearPillar  ? { char: yearPillar.stem,  koreanPos: '년간', pillarTitle: 'Year'  } : null,
    dayPillar   ? { char: dayPillar.branch, koreanPos: '일지', pillarTitle: 'Day'   } : null,
  ].filter(Boolean) as { char: string; koreanPos: string; pillarTitle: string }[];

  const charSum = [dayMasterStem, monthPillar?.stem || '', yearPillar?.stem || '']
    .map(c => c.charCodeAt(0) || 0).reduce((a, b) => a + b, 0);
  const baseProbability = 1.5 + (charSum % 30) / 10;
  const combinationProbability = hasDeungRa
    ? Math.max(0.3, baseProbability * 0.2)
    : Math.max(0.8, Math.min(6.5, baseProbability));

  const combinationCard = {
    dayMasterChar: dayMasterStem,
    combiningChars,
    poeticName: metaphorTitle,
    probability: Math.round(combinationProbability * 10) / 10,
  };

  // 9~11. 개인화 텍스트 생성 (personalized-text-engine 위임)
  const personalizedTexts = generatePersonalizedTexts(
    dayPillar,
    monthPillar,
    yearPillar,
    hourPillar,
    baseProfileCode,
    hasDeungRa,
    lang,
    traitScores,
    result
  );
  const { innateTemperament, lifestylePattern, wealthFlow, realWorldPattern } = personalizedTexts;

  return {
    userName,
    gender: genderKo,
    iljuName,
    metaphorTitle,
    profileCode,
    baseProfileCode,
    isDeungRa: hasDeungRa,
    deungRaNote,
    profile,
    traitScores,
    combinationCard,
    innateTemperament,
    lifestylePattern,
    wealthFlow,
    realWorldPattern,
    yongshinAdvice,
    luckTiming: {
      currentDaeun,
      currentDaeunInterpretation,
      currentSewun,
      currentSewunInterpretation
    }
  };
}

function generatePersonalizedProfileText(
  userName: string,
  dayMasterStem: string,
  result: BaZiResult,
  ratios: ReturnType<typeof getTenGodRatios>,
  traitScores: TraitScore[],
  _profileCode: string
): { character: string; description: string } {

  // 이름 레이블 처리 (이름 없을 때 "당신" 사용)
  const nameLabel = (userName && userName !== 'OO') ? `${userName}님` : '당신';

  const dayPillar = result.pillars?.find((p: any) => p.title === 'Day');
  const dayBranch = dayPillar?.branch || '';
  const iljuHanja = dayPillar?.hanja || '';
  const branchP = dayBranch ? BRANCH_PERSONALITIES[dayBranch] : null;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [1] 일주론 기반 도입 장면 — 60 일주 자연 물상
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const ILJU_SCENE_MAP: Record<string, string> = {
    '甲子': '밤의 호수 수면 위로 곧게 솟아오른 청량한 거목의 형상입니다. 고요한 수면에 자신의 그림자를 드리우면서도 뿌리는 깊은 수심 아래까지 단단히 박혀 있어, 겉으론 차분해 보여도 내면에는 거대한 포부와 지적 탐구심이 용솟음치고 있습니다.',
    '甲戌': '가을 절벽 위에 홀로 서 있는 소나무의 형상입니다. 계절의 거센 풍파도 그 기상을 꺾지 못하며, 묵직한 책임감과 현실적인 안목으로 주변을 든든히 지켜냅니다.',
    '甲申': '바위 산 정상에서 사방을 조망하며 생존의 활로를 찾아내는 영리한 거목의 형상입니다. 척박한 환경에서도 재치 있게 길을 뚫어나가며, 변화 속에서 오히려 빛을 발합니다.',
    '甲午': '한여름 찬란한 태양 아래 꽃과 열매를 동시에 맺은 거목의 형상입니다. 넘치는 열정과 표현력으로 존재를 세상에 드러내며, 주변의 시선을 자연스럽게 끌어당깁니다.',
    '甲辰': '비옥한 대지에 깊이 뿌리 내린 거대한 나무의 형상입니다. 서두르지 않고 충분히 땅을 다진 후 묵묵히 자라나며, 안정과 성장을 동시에 이루어내는 탁월한 내공이 있습니다.',
    '甲寅': '이른 봄 숲을 호령하는 우람한 거목의 형상입니다. 독립심이 강하고 선두에 서는 것이 본능으로 자연스러우며, 신념을 굽히지 않는 당당한 기개가 주위를 압도합니다.',
    '乙丑': '눈 덮인 겨울 들판을 억척스럽게 뚫고 나오는 새싹의 형상입니다. 겉모습은 가냘프고 부드러워 보이지만 내면에는 놀라운 생존력과 끈기가 잠들어 있어, 어떤 역경도 결국 꽃으로 승화시킵니다.',
    '乙亥': '드넓은 바다 위를 고요히 떠다니는 연꽃의 형상입니다. 주변 환경에 휩쓸리지 않는 고결함과 유연함이 공존하며, 부드러운 감수성으로 사람들의 내면에 깊이 스며드는 힘이 있습니다.',
    '乙酉': '날카로운 바위 틈 사이에서도 아름다운 꽃을 피워내는 야생화의 형상입니다. 예리한 미적 감각과 완벽을 추구하는 기질이 강하며, 자신만의 선을 지키는 고결함이 매력의 핵심입니다.',
    '乙未': '뜨거운 모래 언덕 위에서 꿋꿋이 수분을 머금고 있는 선인장의 형상입니다. 부드러워 보이지만 현실 적응력이 탁월하고, 실속을 챙기는 감각이 날카로워 어디서든 살아남는 지혜를 갖추고 있습니다.',
    '乙巳': '화려한 불꽃 사이를 유연하게 춤추는 넝쿨의 형상입니다. 사교성과 언변이 뛰어나며, 강한 파트너십 기운으로 주변의 좋은 인연을 자연스럽게 끌어당깁니다.',
    '乙卯': '봄 동산에 가득 피어난 싱그러운 풀밭의 형상입니다. 순수하고 생동감 넘치며, 자신만의 감성과 속도를 지키는 독창성이 특유의 매력을 만들어냅니다.',
    '丙寅': '새벽 숲속을 깨우는 찬란한 아침 햇살의 형상입니다. 밝고 긍정적인 에너지로 주변에 희망과 생동감을 전파하며, 사람들 사이에서 자연스럽게 빛을 발하는 시작의 기운을 지닙니다.',
    '丙子': '깊은 밤 호수 위를 따뜻하게 비추는 달빛 같은 태양의 형상입니다. 뜨거운 내면의 열정을 절제된 행동으로 표현하며, 감성과 이성의 균형에서 나오는 차분한 카리스마를 지닙니다.',
    '丙戌': '석양이 물드는 가을 산 위로 작열하는 태양의 형상입니다. 한번 믿은 것에 끝까지 책임지는 의리와 열정이 강하며, 어려울수록 더욱 강하게 타오르는 집요한 추진력이 있습니다.',
    '丙申': '바위 산 너머로 지는 화려하고 다채로운 노을의 형상입니다. 다재다능한 재능과 빠른 두뇌 회전으로 어떤 판세에서도 현실적인 기회를 포착해내는 감각이 날카롭습니다.',
    '丙午': '한여름 대지를 달구는 뜨거운 정오의 태양 그 자체입니다. 숨길 수 없는 존재감과 압도적인 에너지로 자신을 표현하며, 당당한 자신감이 주위를 자연스럽게 끌어당기는 구심점이 됩니다.',
    '丙辰': '비구름을 품은 하늘 위를 날아오르는 붉은 용의 형상입니다. 포용력이 넓고 에너지가 풍부하며, 사람들을 즐겁게 만드는 낙천적인 표현력이 어디서나 중심 에너지 역할을 합니다.',
    '丁卯': '봄 동산 위를 따뜻하게 밝히는 등불의 형상입니다. 섬세한 감수성과 다정한 심성으로 가까운 이들을 깊이 보살피며, 예술적 감각이 남다른 조용한 빛을 발합니다.',
    '丁丑': '눈 덮인 들판 한밤에도 꺼지지 않는 화로의 형상입니다. 차분하고 내실 있는 심성으로 겉으로 드러내지 않아도 실속을 챙기는 지혜와 끈기가 있습니다.',
    '丁亥': '드넓은 밤바다를 고요히 비추는 등대의 형상입니다. 깊은 지혜와 맑은 영감이 내면에서 빛을 발하며, 믿음직한 존재감으로 주변 사람들의 신뢰를 자연스럽게 모읍니다.',
    '丁酉': '고귀한 보석 상자 속에서 은은하게 빛나는 촛불의 형상입니다. 세련된 감각과 예리한 판단력, 그리고 자신만의 품위를 철저히 지키는 완벽주의 기질이 공존합니다.',
    '丁未': '뜨거운 사막 한가운데서 꺼지지 않고 타오르는 횃불의 형상입니다. 한결같은 열정과 강한 의지로 한 분야를 끝까지 파고드는 전문성과 뚝심이 남다릅니다.',
    '丁巳': '불꽃 쇼의 화려한 무대 위에서 빛과 열을 뿜어내는 주인공의 형상입니다. 강한 추진력과 독립심으로 목표를 향해 화끈하게 돌진하며, 한번 타오르면 멈추기 어려운 뜨거운 기세가 있습니다.',
    '戊辰': '비를 잔뜩 머금은 광활한 대지의 형상입니다. 듬직한 포용력과 넓은 품으로 주변을 안정시키는 힘이 있으며, 어떤 상황에서도 중심을 잃지 않는 묵직한 존재감을 지닙니다.',
    '戊寅': '태산 아래에서 용맹한 호랑이가 자리를 지키는 형상입니다. 산처럼 흔들리지 않는 안정감과 호랑이의 강렬한 기세가 하나로 어우러져, 평소에는 묵직하고 과묵하지만 한번 움직이기 시작하면 아무도 막을 수 없는 폭발적인 에너지를 발휘합니다.',
    '戊子': '깊은 밤 호수를 품은 거대한 산의 형상입니다. 신중하고 현실적인 안목과 재물을 다루는 뛰어난 감각이 공존하며, 차곡차곡 내실을 쌓아가는 자수성가형 기질이 있습니다.',
    '戊戌': '황금빛 노을 아래 광활하게 펼쳐진 가을 대지의 형상입니다. 한번 믿은 신념과 사람을 끝까지 지키는 강한 의리와 고집이 특징이며, 굽히지 않는 원칙과 우직함으로 주위의 신뢰를 쌓습니다.',
    '戊申': '바위 산 위에서 사방을 내려다보는 광활한 대지의 형상입니다. 다재다능한 재능과 활동적인 사교성으로 어디서든 실속을 챙기며, 유연하게 균형을 맞추는 적응력이 강점입니다.',
    '戊午': '한여름 태양 아래 폭발하듯 뜨거운 화산의 형상입니다. 강한 자존심과 자기 확신이 굳건하며, 목표를 향해 돌진하는 폭발적인 에너지가 주변을 압도합니다.',
    '己巳': '화려한 불꽃 속에서 씨앗을 키워내는 비옥한 텃밭의 형상입니다. 지혜롭고 활동적이며, 따뜻한 대지의 포용력으로 사람들을 품어 안으면서도 상황 전체를 조용히 주도하는 전략적 기질이 있습니다.',
    '己卯': '봄 동산 위 섬세하게 가꾸어진 작은 정원의 형상입니다. 예민한 감각과 자신만의 원칙을 지키는 성실함이 있으며, 남들이 지나칠 작은 균열까지 잡아내는 예리한 직관을 지닙니다.',
    '己丑': '눈 덮인 들판 속 따뜻하게 생명을 품고 있는 흙의 형상입니다. 묵묵하고 끈질긴 인내심으로 결국 결실을 맺어내는 우직한 뚝심과 성실함이 삶 전반에 깔려 있습니다.',
    '己亥': '드넓은 바다 위를 떠다니는 비옥하고 풍요로운 섬의 형상입니다. 넓은 포용력과 따뜻한 마음씨로 사람들과 조화롭게 어우러지며, 지혜롭게 관계와 내실을 동시에 챙기는 능력이 있습니다.',
    '己酉': '보석을 가득 품고 있는 비옥한 대지의 형상입니다. 꼼꼼하고 야무진 업무 처리 능력과 자신의 가치를 높이는 데 열정적인 기질이 결합되어, 완성도 높은 결과물을 만들어냅니다.',
    '己未': '뜨거운 모래 언덕 위에도 흔들리지 않는 단단한 흙의 형상입니다. 어떤 환경에서도 실속과 생활력을 잃지 않는 강인한 생명력이 있으며, 주관이 뚜렷하고 자립심이 강합니다.',
    '庚午': '한여름 뜨거운 태양 아래 예리하게 빛나는 칼날의 형상입니다. 정의감이 강하고 위엄 있는 리더십으로 사람들의 존경을 이끌어내며, 세련된 결단력이 핵심 무기입니다.',
    '庚辰': '비를 머금은 대지 위에 단단하게 자리 잡은 거대한 바위의 형상입니다. 묵직한 카리스마와 비범한 두뇌로 큰 일을 도모하며, 강한 포용력과 신용으로 주변의 신뢰를 모읍니다.',
    '庚寅': '봄 숲속을 자유롭게 누비는 용맹한 백호의 형상입니다. 강한 추진력과 개척 정신으로 새로운 영역에 뛰어들며, 행동이 생각보다 먼저 나가는 시원시원한 실행력이 매력입니다.',
    '庚子': '깊은 밤 호수 위에서 차갑게 빛나는 칼날의 형상입니다. 냉철하고 예리한 통찰력으로 사물의 본질을 꿰뚫어보며, 거침없는 표현력으로 핵심을 직격하는 언변이 강점입니다.',
    '庚戌': '가을 산 위를 굳건히 지키는 단단한 원석의 형상입니다. 어떤 난관에도 타협하지 않는 강직함과 의리로 자신의 자리를 지키며, 한번 결심하면 끝까지 밀어붙이는 뚝심이 있습니다.',
    '庚申': '바위 산 위에서 홀로 빛나는 거대한 강철 바위의 형상입니다. 강한 자존심과 독립심을 바탕으로 자신만의 원칙 세계를 굳건히 구축하며, 타협하지 않는 독고다이 기질이 강합니다.',
    '辛未': '뜨거운 모래 언덕 위에서 빛을 발하는 예리한 보석의 형상입니다. 부드러운 외면 뒤에 날카로운 칼날을 품고 있어, 현실적인 실속을 챙기는 지혜와 자립심이 내면에 단단히 자리합니다.',
    '辛巳': '화려한 불꽃 속에서도 흔들리지 않고 빛나는 다이아몬드의 형상입니다. 세련된 감각과 합리적 사고로 일을 깔끔하게 처리하며, 명예와 품위를 중시하는 고결한 기질이 있습니다.',
    '辛卯': '봄 동산 위에서 정교하게 움직이는 섬세한 가위의 형상입니다. 예민하고 예술적인 감각으로 주변을 즐겁게 만들며, 자신만의 미적 기준을 절대 타협하지 않는 날카로운 개성이 있습니다.',
    '辛丑': '눈 덮인 들판 속 차갑게 빛나는 보석의 형상입니다. 끈기 있고 냉철한 심성으로 어려운 상황에서도 자신만의 가치를 지켜내며, 겉으로 양보하는 듯 보여도 속으론 절대 굽히지 않습니다.',
    '辛亥': '맑고 넓은 바다 위에서 영롱하게 빛나는 진주의 형상입니다. 총명하고 풍부한 감수성으로 세상을 꿰뚫어보는 통찰력이 있으며, 맑은 지혜로 사람의 진심을 읽어내는 능력이 뛰어납니다.',
    '辛酉': '보석 상자 속에서 가장 눈부시게 빛나는 완벽한 보석의 형상입니다. 자존심이 매우 강하고 자신만의 완벽한 세계를 추구하는 장인 정신이 있으며, 탁월한 전문성이 핵심 무기입니다.',
    '壬申': '바위 산 위에서 힘차게 솟구치는 거대한 폭포의 형상입니다. 지혜롭고 다재다능하며, 넓은 바다처럼 모든 것을 수용하는 포용력으로 변화에 빠르게 대응하는 능력이 강점입니다.',
    '壬午': '한여름 태양 아래 시원하게 흘러가는 강물의 형상입니다. 재치 있고 사교적이며, 현실적인 감각과 따뜻한 마음씨를 동시에 발휘해 사람들을 자연스럽게 끌어당깁니다.',
    '壬辰': '비를 잔뜩 머금은 대지 위에 고요하게 자리한 거대한 호수의 형상입니다. 강한 카리스마와 큰 포부 아래 거대한 잠재력이 응축되어 있어, 결정적인 순간에 세상을 뒤흔드는 힘이 발현됩니다.',
    '壬寅': '밤의 숲을 자유롭게 누비는 영특한 흑호의 형상입니다. 진취적이고 활동적이며, 긍정적인 추진력과 감수성이 어우러져 사람들에게 희망과 신뢰를 주는 리더십이 있습니다.',
    '壬子': '칠흑같이 깊은 밤 끝없이 펼쳐진 바다의 형상입니다. 매우 강한 주관과 총명함, 겉으로는 알 수 없는 깊은 내면의 신비로움이 공존하며, 한번 뜻을 품으면 절대 꺾이지 않는 뚝심이 있습니다.',
    '壬戌': '석양 아래 고요하고 담담하게 흘러가는 강물의 형상입니다. 강한 책임감과 깊은 영감으로 조직을 위해 헌신하면서도, 자신만의 확고한 자리와 신뢰를 지켜내는 내공이 있습니다.',
    '癸酉': '보석 상자 위로 맑고 투명하게 내리는 빗물의 형상입니다. 총명하고 섬세한 심성으로 사물의 본질을 꿰뚫어보는 예리한 통찰력이 있으며, 맑은 지혜로 주변의 신뢰를 모읍니다.',
    '癸未': '뜨거운 모래 언덕 위로 내리는 단비의 형상입니다. 온화해 보이지만 내면에는 강한 생활력과 인내심이 숨어 있어, 어떤 어려움도 지혜롭게 극복해 결국 목표를 이루어냅니다.',
    '癸巳': '화려한 불꽃 위로 조용히 내리는 이슬비의 형상입니다. 재치 있고 사교적이며, 상황의 이득을 포착하는 날카로운 현실 감각과 뛰어난 소통 능력으로 원하는 것을 얻어냅니다.',
    '癸卯': '꽃 피는 동산 위에 영롱하게 내리는 아침 이슬의 형상입니다. 다정다감하고 예술적 감수성이 풍부하며, 사람들의 마음을 자연스럽게 열게 만드는 묘한 친화력이 있습니다.',
    '癸丑': '눈 덮인 들판 위 차갑게 내려앉은 서리의 형상입니다. 강한 의지와 냉철한 뚝심으로 한번 결심한 것을 절대 포기하지 않으며, 묵묵히 쌓아올린 노력이 결국 단단한 결실로 이어집니다.',
    '癸亥': '끝없이 펼쳐진 깊은 밤의 바다의 형상입니다. 깊은 지혜와 넓은 포용력이 있으며, 겉으로 맞춰주는 것 같으면서도 속으로는 자신만의 거대한 세계를 품고 있는 강한 주관이 있습니다.',
  };

  const stemP = STEM_PERSONALITIES[dayMasterStem];
  const iljuScene = ILJU_SCENE_MAP[iljuHanja] ||
    (stemP ? stemP.coreIdentity : '독특하고 강력한 기운을 타고난 일주입니다.');

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [2] 십성 × 일간 조합별 실제 행동 패턴
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const tgScoresArr = [
    { name: '비겁', score: ratios.biGyeop },
    { name: '식상', score: ratios.sikSang },
    { name: '재성', score: ratios.jaeSeong },
    { name: '관성', score: ratios.gwanSeong },
    { name: '인성', score: ratios.inSeong }
  ].sort((a, b) => b.score - a.score);
  const topTg = tgScoresArr[0];
  const secondTg = tgScoresArr[1];

  const stemChar: Record<string, string> = {
    '甲': '거목', '乙': '넝쿨', '丙': '태양', '丁': '등불', '戊': '태산',
    '己': '대지', '庚': '강철', '辛': '보석', '壬': '대하', '癸': '이슬'
  };
  const sc = stemChar[dayMasterStem] || '일간';

  const getTgBehaviorText = (): string => {
    switch (topTg.name) {
      case '관성':
        return `${sc}의 기운 위에 나를 통제하는 책임과 명예의 관성(官星)이 강하게 자리한 ${nameLabel}은, 스스로에게 가장 엄격한 잣대를 들이대는 사람입니다. 남들이 쉽게 내려놓는 책임을 절대 가볍게 보지 않아 신뢰를 얻지만, 그만큼 혼자서 짊어지는 무게가 과해지는 순간이 반복되기 쉽습니다. 이 압박을 원동력으로 삼아 큰 성과와 무대를 완성해내는 것이 ${nameLabel}만의 방식입니다.`;
      case '식상':
        return `${sc}의 기운 위에 자유로운 창의와 표현의 식상(食傷)이 강하게 자리한 ${nameLabel}은, 남들이 정해놓은 틀을 답답해하며 스스로 아이디어를 쏟아낼 때 비로소 진가를 발휘합니다. 표현 욕구가 강해 생각을 담아두지 못하고 어딘가로 발산해야 직성이 풀리는 편이며, 이 에너지를 잘 다듬으면 남다른 창조적 결과물을 만들어냅니다.`;
      case '재성':
        return `${sc}의 기운 위에 현실적 목표 지향의 재성(財星)이 강하게 자리한 ${nameLabel}은, 막연한 이상보다 눈에 보이는 결과물에 집중합니다. 기회를 포착하는 감각이 뛰어나고 실질적인 파이프라인을 설계하는 능력이 있지만, 이것이 지나칠 때는 과욕으로 이어지거나 번 것을 제대로 지키지 못하는 패턴이 반복될 수 있습니다.`;
      case '인성':
        return `${sc}의 기운 위에 깊은 사색과 탐구의 인성(印星)이 강하게 자리한 ${nameLabel}은, 충분히 생각하고 이해한 뒤 움직이는 신중한 기질이 있습니다. 빠른 결론보다 본질을 꿰뚫는 통찰을 추구하며, 이 심층적인 분석력이 강점이지만 때로는 생각이 과해 결정을 내리지 못하는 분석 마비에 빠지기도 합니다.`;
      case '비겁':
        return `${sc}의 기운 위에 강한 자아와 독립심의 비겁(比劫)이 강하게 자리한 ${nameLabel}은, 남의 간섭이나 통제를 극도로 불편해하며 스스로의 판단으로 일을 이끌어가야 직성이 풀립니다. 이 강한 주체성이 자수성가형 리더로서의 잠재력을 만들어내지만, 협업 구도에서 독선적으로 흐르거나 타인의 조언을 차단하는 부작용이 생기기도 합니다.`;
      default:
        return `${sc}의 기운을 타고난 ${nameLabel}은 독특하고 개성 있는 자신만의 방식으로 삶을 개척해나갑니다.`;
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [3] character 최종 조합 (일주론 장면 + 십성 행동 패턴)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const character = `${iljuScene} ${getTgBehaviorText()}`;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // [4] description: 일지 기질 + 오행 구조 + 잠재력 연계
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // 일지 기반 내면 행동 패턴
  let branchBehaviorText = '';
  if (branchP) {
    branchBehaviorText = `${nameLabel}의 일지 ${dayBranch}(${branchP.koName})은 가장 내밀한 행동 방식을 보여줍니다. ${branchP.hiddenStruggle} 이 패턴은 ${branchP.behavioralTrigger} 관계에서는 ${branchP.socialPattern}`;
  }

  // 오행 쏠림 분석
  const elementCounts: Record<string, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  result.pillars?.forEach((p: any) => {
    const stemEl = BAZI_MAPPING.stems[p.stem as keyof typeof BAZI_MAPPING.stems]?.element;
    const branchEl = BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches]?.element;
    if (stemEl && Object.prototype.hasOwnProperty.call(elementCounts, stemEl)) elementCounts[stemEl]++;
    if (branchEl && Object.prototype.hasOwnProperty.call(elementCounts, branchEl)) elementCounts[branchEl]++;
  });
  const sortedEl = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]);
  const dominantEl = sortedEl[0][0];
  const dominantCount = sortedEl[0][1];

  const elKoNames: Record<string, string> = {
    Wood: '목(木)', Fire: '화(火)', Earth: '토(土)', Metal: '금(金)', Water: '수(水)'
  };

  let structureText = '';
  if (dominantCount >= 3) {
    structureText = `원국을 살펴보면 ${elKoNames[dominantEl] || dominantEl} 기운이 ${dominantCount}개로 두드러지게 많아, 에너지가 한 방향으로 강하게 응집된 구조입니다. 이는 특정 영역에서 남다른 집중력과 개성으로 발휘되지만, 균형을 잃기 쉬운 순간도 올 수 있습니다.`;
  } else {
    structureText = `원국의 오행이 비교적 고르게 분포되어 있어, 어느 한 방향으로 치우치지 않고 유연하게 중화(中和)의 균형을 이루고 있습니다. 감정과 이성의 밸런스가 좋고 어떤 환경에서도 안정망을 확보하는 능력이 있습니다.`;
  }

  // 2위 십성의 보조 에너지
  let supportText = '';
  switch (secondTg.name) {
    case '인성': supportText = ` 여기에 인성(印星)의 지적 탐구력이 더해져, 충동적으로 움직이기보다 깊이 생각하고 내린 판단을 실행하는 특유의 무게감이 형성됩니다.`; break;
    case '식상': supportText = ` 여기에 식상(食傷)의 창의적 발산력이 더해져, 딱딱한 압박 속에서도 기발한 돌파구를 찾아내고 표현의 출구를 여는 유연함이 생깁니다.`; break;
    case '재성': supportText = ` 여기에 재성(財星)의 현실 지향적 본능이 더해져, 이상보다는 눈에 보이는 성과와 결과물로 자신의 가치를 증명하려는 실용적 추진력이 형성됩니다.`; break;
    case '관성': supportText = ` 여기에 관성(官星)의 명예 지향성이 더해져, 성급한 도박보다 사회적 신뢰와 시스템 안에서 안정적으로 성취를 쌓아가는 방식을 선호하게 됩니다.`; break;
    case '비겁': supportText = ` 여기에 비겁(比劫)의 자아 중심성이 더해져, 남의 시선보다 자신의 기준을 우선하며 독자적으로 판을 이끌어가려는 강한 주체성이 형성됩니다.`; break;
  }

  // 상위 잠재력 수치 연계
  let traitText = '';
  if (traitScores && traitScores.length >= 2) {
    const t1 = traitScores[0];
    const t2 = traitScores[1];
    traitText = `\n\n${nameLabel}의 명식에서 가장 강하게 작용하는 잠재력은 **${t1.name}(${t1.score}점)**입니다. 이 수치는 단순한 능력 이상으로, 어려운 순간에 가장 먼저 발동되는 ${nameLabel}만의 생존 무기에 가깝습니다. 또한 **${t2.name}(${t2.score}점)**이 뒷받침되어, 이 두 자질이 결합될 때 ${nameLabel}만의 고유한 기질이 현실에서 가장 강력하게 발현됩니다.`;
  }

  const description = `${branchBehaviorText}\n\n${structureText}${supportText}${traitText}`;

  return { character, description };
}
