import { BaZiResult, Language } from '../types';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { ELEMENT_COLORS } from '../constants';

export interface SoulSummary {
  oneLineReview: string;
  iljuName: string;
  hashtags: string[];
  traits: string[];
  coreEnergy: {
    element: string;
    description: string;
    practicalAdvice: string;
    luckyHabit: string;
  };
  actionPrescription: string;
  luckyItems: {
    name: string;
    description: string;
  }[];
  elementStrengths: {
    name: string;
    percentage: number;
    color: string;
  }[];
}

interface IljuCharacter {
  core: { ko: string; en: string };
  traits: string[];
  hashtags: string[];
  scene: { ko: string; en: string };
}

const ILJU_CHARACTER_DATA: Record<string, IljuCharacter> = {
  "갑자": { core: { ko: "밤의 호수 위로 솟은 푸른 나무", en: "A green tree rising above a midnight lake" }, traits: [], hashtags: ["#선구자", "#학구파", "#냉철함", "#고결함"], scene: { ko: "밤의 호수 위로 솟은 푸른 나무", en: "A green tree rising above a midnight lake" } },
  "갑술": { core: { ko: "가을 산을 지키는 든든한 나무", en: "A sturdy tree guarding the autumn mountain" }, traits: [], hashtags: ["#책임감", "#현실주의", "#신용", "#묵직함"], scene: { ko: "가을 산을 지키는 든든한 나무", en: "A sturdy tree guarding the autumn mountain" } },
  "갑신": { core: { ko: "바위 산 위에서 바람을 견디는 소나무", en: "A pine tree enduring the wind on a rocky mountain" }, traits: [], hashtags: ["#인내심", "#강직함", "#원칙주의", "#고독한리더"], scene: { ko: "바위 산 위에서 바람을 견디는 소나무", en: "A pine tree enduring the wind on a rocky mountain" } },
  "갑오": { core: { ko: "한여름 태양 아래 붉게 타오르는 꽃나무", en: "A flowering tree burning red under the midsummer sun" }, traits: [], hashtags: ["#열정", "#표현력", "#명랑함", "#아이디어뱅크"], scene: { ko: "한여름 태양 아래 붉게 타오르는 꽃나무", en: "A flowering tree burning red under the midsummer sun" } },
  "갑진": { core: { ko: "비옥한 땅에 뿌리 내린 거목", en: "A giant tree rooted in fertile soil" }, traits: [], hashtags: ["#성장", "#안정감", "#포용력", "#실속파"], scene: { ko: "비옥한 땅에 뿌리 내린 거목", en: "A giant tree rooted in fertile soil" } },
  "갑인": { core: { ko: "봄의 숲을 호령하는 거대한 나무", en: "A giant tree commanding the spring forest" }, traits: [], hashtags: ["#리더십", "#추진력", "#자존심", "#독립심"], scene: { ko: "봄의 숲을 호령하는 거대한 나무", en: "A giant tree commanding the spring forest" } },
  "을축": { core: { ko: "눈 덮인 들판을 뚫고 나오는 새싹", en: "A sprout breaking through a snow-covered field" }, traits: [], hashtags: ["#끈기", "#생명력", "#외유내강", "#성실함"], scene: { ko: "눈 덮인 들판을 뚫고 나오는 새싹", en: "A sprout breaking through a snow-covered field" } },
  "을해": { core: { ko: "푸른 바다 위를 떠다니는 연꽃", en: "A lotus floating on the blue sea" }, traits: [], hashtags: ["#감수성", "#유연함", "#예술가", "#지혜"], scene: { ko: "푸른 바다 위를 떠다니는 연꽃", en: "A lotus floating on the blue sea" } },
  "을유": { core: { ko: "바위 틈 사이에서 피어난 야생화", en: "A wildflower blooming in a rock crevice" }, traits: [], hashtags: ["#예리함", "#섬세함", "#완벽주의", "#독특함"], scene: { ko: "바위 틈 사이에서 피어난 야생화", en: "A wildflower blooming in a rock crevice" } },
  "을미": { core: { ko: "뜨거운 모래 언덕 위 선인장", en: "A cactus on a hot sand dune" }, traits: [], hashtags: ["#적응력", "#실속", "#현실감각", "#생존력"], scene: { ko: "뜨거운 모래 언덕 위 선인장", en: "A cactus on a hot sand dune" } },
  "을사": { core: { ko: "화려한 불꽃 속에서 춤추는 넝쿨", en: "A vine dancing in a brilliant flame" }, traits: [], hashtags: ["#화려함", "#사교성", "#재주꾼", "#분위기메이커"], scene: { ko: "화려한 불꽃 속에서 춤추는 넝쿨", en: "A vine dancing in a brilliant flame" } },
  "을묘": { core: { ko: "봄 동산에 가득 피어난 푸른 풀밭", en: "A green meadow blooming in a spring garden" }, traits: [], hashtags: ["#친화력", "#유연성", "#성장", "#순수함"], scene: { ko: "봄 동산에 가득 피어난 푸른 풀밭", en: "A green meadow blooming in a spring garden" } },
  "병인": { core: { ko: "숲속을 밝히는 찬란한 아침 햇살", en: "Brilliant morning sunlight illuminating the forest" }, traits: [], hashtags: ["#희망", "#긍정", "#시작", "#따뜻함"], scene: { ko: "숲속을 밝히는 찬란한 아침 햇살", en: "Brilliant morning sunlight illuminating the forest" } },
  "병자": { core: { ko: "밤의 호수를 비추는 둥근 달빛", en: "Round moonlight reflecting on a midnight lake" }, traits: [], hashtags: ["#감성", "#직관력", "#신비로움", "#통찰력"], scene: { ko: "밤의 호수를 비추는 둥근 달빛", en: "Round moonlight reflecting on a midnight lake" } },
  "병술": { core: { ko: "석양 아래 붉게 물든 가을 산", en: "An autumn mountain dyed red under the sunset" }, traits: [], hashtags: ["#예술성", "#사색", "#낭만", "#깊이감"], scene: { ko: "석양 아래 붉게 물든 가을 산", en: "An autumn mountain dyed red under the sunset" } },
  "병신": { core: { ko: "바위 산 너머로 지는 화려한 노을", en: "A spectacular sunset setting over a rocky mountain" }, traits: [], hashtags: ["#다재다능", "#변화무쌍", "#재치", "#호기심"], scene: { ko: "바위 산 너머로 지는 화려한 노을", en: "A spectacular sunset setting over a rocky mountain" } },
  "병오": { core: { ko: "한여름 대지를 달구는 뜨거운 태양", en: "The scorching sun heating the midsummer earth" }, traits: [], hashtags: ["#카리스마", "#자신감", "#솔직함", "#에너지"], scene: { ko: "한여름 대지를 달구는 뜨거운 태양", en: "The scorching sun heating the midsummer earth" } },
  "병진": { core: { ko: "구름 위를 날아오르는 붉은 용", en: "A red dragon soaring above the clouds" }, traits: [], hashtags: ["#명랑에너지", "#다재다능", "#표현력", "#낙천주의"], scene: { ko: "구름 위를 날아오르는 붉은 용", en: "A red dragon soaring above the clouds" } },
  "정묘": { core: { ko: "꽃 피는 동산 위 따뜻한 등불", en: "A warm lantern in a blooming garden" }, traits: [], hashtags: ["#섬세함", "#다정함", "#예술감각", "#힐러"], scene: { ko: "꽃 피는 동산 위 따뜻한 등불", en: "A warm lantern in a blooming garden" } },
  "정축": { core: { ko: "눈 덮인 들판 위 따뜻한 화로", en: "A warm brazier on a snow-covered field" }, traits: [], hashtags: ["#내실", "#인내", "#포용", "#은근한열정"], scene: { ko: "눈 덮인 들판 위 따뜻한 화로", en: "A warm brazier on a snow-covered field" } },
  "정해": { core: { ko: "밤바다 위를 비추는 등대", en: "A lighthouse illuminating the night sea" }, traits: [], hashtags: ["#지혜", "#안정", "#신뢰", "#조용한리더"], scene: { ko: "밤바다 위를 비추는 등대", en: "A lighthouse illuminating the night sea" } },
  "정유": { core: { ko: "보석 상자 속 반짝이는 촛불", en: "A flickering candle in a jewelry box" }, traits: [], hashtags: ["#귀티", "#완벽주의", "#미적감각", "#깔끔함"], scene: { ko: "보석 상자 속 반짝이는 촛불", en: "A flickering candle in a jewelry box" } },
  "정미": { core: { ko: "뜨거운 사막 위 타오르는 횃불", en: "A blazing torch on a hot desert" }, traits: [], hashtags: ["#독립심", "#강한의지", "#전문성", "#뚝심"], scene: { ko: "뜨거운 사막 위 타오르는 횃불", en: "A blazing torch on a hot desert" } },
  "정사": { core: { ko: "화려한 불꽃 쇼의 주인공", en: "The star of a spectacular fireworks show" }, traits: [], hashtags: ["#화려함", "#열정", "#자기표현", "#스타성"], scene: { ko: "화려한 불꽃 쇼의 주인공", en: "The star of a spectacular fireworks show" } },
  "무진": { core: { ko: "비를 머금은 광활한 대지", en: "A vast earth holding the rain" }, traits: [], hashtags: ["#포용력", "#안정감", "#실속", "#든든함"], scene: { ko: "비를 머금은 광활한 대지", en: "A vast earth holding the rain" } },
  "무인": { core: { ko: "태산을 지키는 영험한 호랑이", en: "A mystical tiger guarding a great mountain" }, traits: [], hashtags: ["#명예지향", "#카리스마", "#고독한성취가", "#츤데레"], scene: { ko: "태산을 지키는 영험한 호랑이", en: "A mystical tiger guarding a great mountain" } },
  "무자": { core: { ko: "밤의 호수를 품은 거대한 산", en: "A massive mountain embracing a midnight lake" }, traits: [], hashtags: ["#신중함", "#재물복", "#내실", "#무게감"], scene: { ko: "밤의 호수를 품은 거대한 산", en: "A massive mountain embracing a midnight lake" } },
  "무술": { core: { ko: "황금빛 노을이 지는 광활한 대지", en: "A vast earth under a golden sunset" }, traits: [], hashtags: ["#고집", "#신념", "#강직함", "#우직함"], scene: { ko: "황금빛 노을이 지는 광활한 대지", en: "A vast earth under a golden sunset" } },
  "무신": { core: { ko: "바위 산 위에서 세상을 굽어보는 대지", en: "The earth looking down on the world from a rocky mountain" }, traits: [], hashtags: ["#다재다능", "#활동성", "#재치", "#모험가"], scene: { ko: "바위 산 위에서 세상을 굽어보는 대지", en: "The earth looking down on the world from a rocky mountain" } },
  "무오": { core: { ko: "한여름 태양 아래 뜨거운 화산", en: "A hot volcano under the midsummer sun" }, traits: [], hashtags: ["#폭발력", "#자존심", "#강한에너지", "#직진"], scene: { ko: "한여름 태양 아래 뜨거운 화산", en: "A hot volcano under the midsummer sun" } },
  "기사": { core: { ko: "화려한 불꽃 속 비옥한 텃밭", en: "A fertile garden in a brilliant flame" }, traits: [], hashtags: ["#지혜", "#학구파", "#다정함", "#내실"], scene: { ko: "화려한 불꽃 속 비옥한 텃밭", en: "A fertile garden in a brilliant flame" } },
  "기묘": { core: { ko: "꽃 피는 동산 위 작은 정원", en: "A small garden on a blooming hill" }, traits: [], hashtags: ["#섬세함", "#예술성", "#유연함", "#친화력"], scene: { ko: "꽃 피는 동산 위 작은 정원", en: "A small garden on a blooming hill" } },
  "기축": { core: { ko: "눈 덮인 들판 속 따뜻한 흙", en: "Warm soil in a snow-covered field" }, traits: [], hashtags: ["#인내심", "#성실함", "#신용", "#우직함"], scene: { ko: "눈 덮인 들판 속 따뜻한 흙", en: "Warm soil in a snow-covered field" } },
  "기해": { core: { ko: "바다 위를 떠다니는 비옥한 섬", en: "A fertile island floating on the sea" }, traits: [], hashtags: ["#안정감", "#포용력", "#지혜", "#실속"], scene: { ko: "바다 위를 떠다니는 비옥한 섬", en: "A fertile island floating on the sea" } },
  "기유": { core: { ko: "보석을 품은 비옥한 대지", en: "Fertile earth embracing jewels" }, traits: [], hashtags: ["#재능", "#깔끔함", "#미적감각", "#전문성"], scene: { ko: "보석을 품은 비옥한 대지", en: "Fertile earth embracing jewels" } },
  "기미": { core: { ko: "뜨거운 모래 언덕 위 단단한 흙", en: "Solid earth on a hot sand dune" }, traits: [], hashtags: ["#고집", "#자립심", "#생활력", "#강한의지"], scene: { ko: "뜨거운 모래 언덕 위 단단한 흙", en: "Solid earth on a hot sand dune" } },
  "경오": { core: { ko: "한여름 태양 아래 빛나는 칼날", en: "A shining blade under the midsummer sun" }, traits: [], hashtags: ["#정의감", "#결단력", "#카리스마", "#명예"], scene: { ko: "한여름 태양 아래 빛나는 칼날", en: "A shining blade under the midsummer sun" } },
  "경진": { core: { ko: "비를 머금은 대지 위 단단한 바위", en: "A solid rock on the rain-soaked earth" }, traits: [], hashtags: ["#무게감", "#포용력", "#강직함", "#신용"], scene: { ko: "비를 머금은 대지 위 단단한 바위", en: "A solid rock on the rain-soaked earth" } },
  "경인": { core: { ko: "숲속을 누비는 용맹한 백호", en: "A brave white tiger roaming the forest" }, traits: [], hashtags: ["#추진력", "#리더십", "#모험심", "#강한의지"], scene: { ko: "숲속을 누비는 용맹한 백호", en: "A brave white tiger roaming the forest" } },
  "경자": { core: { ko: "밤의 호수 위에 비치는 차가운 칼날", en: "A cold blade reflecting on a midnight lake" }, traits: [], hashtags: ["#냉철함", "#예리함", "#표현력", "#완벽주의"], scene: { ko: "밤의 호수 위에 비치는 차가운 칼날", en: "A cold blade reflecting on a midnight lake" } },
  "경술": { core: { ko: "가을 산 위를 지키는 단단한 원석", en: "A solid gemstone guarding the autumn mountain" }, traits: [], hashtags: ["#의리", "#강직함", "#신념", "#묵직함"], scene: { ko: "가을 산 위를 지키는 단단한 원석", en: "A solid gemstone guarding the autumn mountain" } },
  "경신": { core: { ko: "바위 산 위에서 빛나는 거대한 바위", en: "A massive rock shining on a rocky mountain" }, traits: [], hashtags: ["#자존심", "#강한자아", "#독립심", "#불도저"], scene: { ko: "바위 산 위에서 빛나는 거대한 바위", en: "A massive rock shining on a rocky mountain" } },
  "신미": { core: { ko: "뜨거운 모래 언덕 위 반짝이는 보석", en: "A sparkling jewel on a hot sand dune" }, traits: [], hashtags: ["#섬세함", "#자립심", "#예술성", "#내실"], scene: { ko: "뜨거운 모래 언덕 위 반짝이는 보석", en: "A sparkling jewel on a hot sand dune" } },
  "신사": { core: { ko: "화려한 불꽃 속에서 빛나는 다이아몬드", en: "A diamond shining in a brilliant flame" }, traits: [], hashtags: ["#고귀함", "#깔끔함", "#지혜", "#명예"], scene: { ko: "화려한 불꽃 속에서 빛나는 다이아몬드", en: "A diamond shining in a brilliant flame" } },
  "신묘": { core: { ko: "꽃 피는 동산 위 섬세한 가위", en: "Delicate scissors on a blooming hill" }, traits: [], hashtags: ["#예리함", "#재주꾼", "#미적감각", "#민감함"], scene: { ko: "꽃 피는 동산 위 섬세한 가위", en: "Delicate scissors on a blooming hill" } },
  "신축": { core: { ko: "눈 덮인 들판 속 차가운 보석", en: "A cold jewel in a snow-covered field" }, traits: [], hashtags: ["#인내심", "#냉철함", "#완벽주의", "#고결함"], scene: { ko: "눈 덮인 들판 속 차가운 보석", en: "A cold jewel in a snow-covered field" } },
  "신해": { core: { ko: "맑은 바다 위에서 빛나는 진주", en: "A pearl shining on the clear sea" }, traits: [], hashtags: ["#감수성", "#표현력", "#지혜", "#청초함"], scene: { ko: "맑은 바다 위에서 빛나는 진주", en: "A pearl shining on the clear sea" } },
  "신유": { core: { ko: "보석 상자 속 가장 빛나는 보석", en: "The brightest jewel in the jewelry box" }, traits: [], hashtags: ["#자존심", "#완벽주의", "#깔끔함", "#예리함"], scene: { ko: "보석 상자 속 가장 빛나는 보석", en: "The brightest jewel in the jewelry box" } },
  "임신": { core: { ko: "바위 산 위에서 솟구치는 거대한 폭포", en: "A massive waterfall surging from a rocky mountain" }, traits: [], hashtags: ["#지혜", "#활동성", "#다재다능", "#추진력"], scene: { ko: "바위 산 위에서 솟구치는 거대한 폭포", en: "A massive waterfall surging from a rocky mountain" } },
  "임오": { core: { ko: "한여름 태양 아래 시원한 강물", en: "A cool river under the midsummer sun" }, traits: [], hashtags: ["#재치", "#사교성", "#유연함", "#실속"], scene: { ko: "한여름 태양 아래 시원한 강물", en: "A cool river under the midsummer sun" } },
  "임진": { core: { ko: "비를 머금은 대지 위 거대한 호수", en: "A massive lake on the rain-soaked earth" }, traits: [], hashtags: ["#포용력", "#무게감", "#잠재력", "#카리스마"], scene: { ko: "비를 머금은 대지 위 거대한 호수", en: "A massive lake on the rain-soaked earth" } },
  "임인": { core: { ko: "밤의 숲을 누비는 지혜로운 흑호", en: "A wise black tiger roaming the night forest" }, traits: [], hashtags: ["#지적호기심", "#추진력", "#유연함", "#감수성"], scene: { ko: "밤의 숲을 누비는 지혜로운 흑호", en: "A wise black tiger roaming the night forest" } },
  "임자": { core: { ko: "깊은 밤 끝없이 펼쳐진 바다", en: "The endless sea in the deep night" }, traits: [], hashtags: ["#강한자아", "#깊이감", "#지혜", "#카리스마"], scene: { ko: "깊은 밤 끝없이 펼쳐진 바다", en: "The endless sea in the deep night" } },
  "임술": { core: { ko: "석양 아래 고요하게 흐르는 강물", en: "A river flowing quietly under the sunset" }, traits: [], hashtags: ["#신중함", "#책임감", "#내실", "#강직함"], scene: { ko: "석양 아래 고요하게 흐르는 강물", en: "A river flowing quietly under the sunset" } },
  "계유": { core: { ko: "보석 상자 위로 내리는 맑은 빗물", en: "Clear rain falling on a jewelry box" }, traits: [], hashtags: ["#섬세함", "#지혜", "#깔끔함", "#학구파"], scene: { ko: "보석 상자 위로 내리는 맑은 빗물", en: "Clear rain falling on a jewelry box" } },
  "계미": { core: { ko: "뜨거운 모래 언덕 위 단비", en: "Sweet rain on a hot sand dune" }, traits: [], hashtags: ["#인내심", "#적응력", "#실속", "#유연함"], scene: { ko: "뜨거운 모래 언덕 위 단비", en: "Sweet rain on a hot sand dune" } },
  "계사": { core: { ko: "화려한 불꽃 위로 내리는 이슬비", en: "Drizzle falling over a brilliant flame" }, traits: [], hashtags: ["#재치", "#사교성", "#지혜", "#다재다능"], scene: { ko: "화려한 불꽃 위로 내리는 이슬비", en: "Drizzle falling over a brilliant flame" } },
  "계묘": { core: { ko: "꽃 피는 동산 위 맑은 아침 이슬", en: "Clear morning dew on a blooming hill" }, traits: [], hashtags: ["#순수함", "#예술성", "#다정함", "#인기쟁이"], scene: { ko: "꽃 피는 동산 위 맑은 아침 이슬", en: "Clear morning dew on a blooming hill" } },
  "계축": { core: { ko: "눈 덮인 들판 위 차가운 서리", en: "Cold frost on a snow-covered field" }, traits: [], hashtags: ["#인내심", "#강한의지", "#냉철함", "#뚝심"], scene: { ko: "눈 덮인 들판 위 차가운 서리", en: "Cold frost on a snow-covered field" } },
  "계해": { core: { ko: "끝없이 펼쳐진 밤의 바다", en: "The endless night sea" }, traits: [], hashtags: ["#지혜", "#포용력", "#유연함", "#깊이감"], scene: { ko: "끝없이 펼쳐진 밤의 바다", en: "The endless night sea" } }
};

const STEM_NAMES: Record<string, string> = {
  '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
  '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계'
};

const BRANCH_NAMES: Record<string, string> = {
  '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
  '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해'
};

const STEM_METAPHORS: Record<string, { ko: string, en: string }> = {
  '甲': { ko: '거대한 나무', en: 'Giant Tree' },
  '乙': { ko: '유연한 넝쿨', en: 'Flexible Vine' },
  '丙': { ko: '찬란한 태양', en: 'Brilliant Sun' },
  '丁': { ko: '따뜻한 등불', en: 'Warm Lantern' },
  '戊': { ko: '광활한 대지', en: 'Vast Earth' },
  '己': { ko: '비옥한 텃밭', en: 'Fertile Garden' },
  '庚': { ko: '단단한 원석', en: 'Solid Ore' },
  '辛': { ko: '섬세한 보석', en: 'Delicate Jewel' },
  '壬': { ko: '거대한 강물', en: 'Massive River' },
  '癸': { ko: '고요한 빗물', en: 'Quiet Rain' }
};

const BRANCH_METAPHORS: Record<string, { ko: string, en: string }> = {
  '子': { ko: '깊은 밤 호수 위', en: 'On a deep night lake' },
  '丑': { ko: '눈 덮인 들판 위', en: 'On a snow-covered field' },
  '寅': { ko: '이른 봄 숲속', en: 'In an early spring forest' },
  '卯': { ko: '꽃 피는 동산 위', en: 'On a blooming hill' },
  '辰': { ko: '비구름 머금은 대지 위', en: 'On a rain-cloud earth' },
  '巳': { ko: '화려한 불꽃 춤 속', en: 'In a brilliant flame dance' },
  '午': { ko: '한여름 태양 아래', en: 'Under the midsummer sun' },
  '未': { ko: '뜨거운 모래 언덕 위', en: 'On a hot sand dune' },
  '申': { ko: '바람 부는 바위 산 위', en: 'On a windy rocky mountain' },
  '酉': { ko: '결실의 계절 속', en: 'In the season of harvest' },
  '戌': { ko: '석양 지는 가을 산 위', en: 'On a sunset autumn mountain' },
  '亥': { ko: '끝없는 바다 위', en: 'On an endless sea' }
};

const EN_HASHTAG_MAP: Record<string, string> = {
  "#선구자": "#Trailblazer", "#학구파": "#Nerd", "#냉철함": "#CoolHeaded", "#고결함": "#Noble",
  "#책임감": "#Responsible", "#현실주의": "#Realist", "#신용": "#Trustworthy", "#묵직함": "#HeavyDuty",
  "#인내심": "#Patient", "#강직함": "#Upright", "#원칙주의": "#Principled", "#고독한리더": "#LoneLeader",
  "#열정": "#Passion", "#표현력": "#Expressive", "#명랑함": "#Cheerful", "#아이디어뱅크": "#IdeaBank",
  "#성장": "#Growth", "#안정감": "#Stable", "#포용력": "#Inclusive", "#실속파": "#Pragmatic",
  "#리더십": "#Leadership", "#추진력": "#Driven", "#자존심": "#Pride", "#독립심": "#Independent",
  "#끈기": "#Tenacity", "#생명력": "#Vitality", "#외유내강": "#SoftOutsideToughInside", "#성실함": "#Diligent",
  "#감수성": "#Sensitive", "#유연함": "#Flexible", "#예술가": "#Artist", "#지혜": "#Wisdom",
  "#예리함": "#Sharp", "#섬세함": "#Delicate", "#완벽주의": "#Perfectionist", "#독특함": "#Unique",
  "#적응력": "#Adaptable", "#실속": "#Substance", "#현실감각": "#RealityCheck", "#생존력": "#Survivor",
  "#화려함": "#Glamorous", "#사교성": "#SocialButterfly", "#재주꾼": "#Talented", "#분위기메이커": "#MoodMaker",
  "#친화력": "#Friendly", "#유연성": "#Flexibility", "#순수함": "#Pure",
  "#희망": "#Hope", "#긍정": "#Positive", "#시작": "#NewBeginnings", "#따뜻함": "#Warmth",
  "#감성": "#Emotional", "#직관력": "#Intuitive", "#신비로움": "#Mysterious", "#통찰력": "#Insightful",
  "#예술성": "#Artistic", "#사색": "#Thoughtful", "#낭만": "#Romantic", "#깊이감": "#Deep",
  "#다재다능": "#Versatile", "#변화무쌍": "#Dynamic", "#재치": "#Witty", "#호기심": "#Curious",
  "#카리스마": "#Charisma", "#자신감": "#Confident", "#솔직함": "#Honest", "#에너지": "#Energy",
  "#명랑에너지": "#BrightEnergy", "#낙천주의": "#Optimist",
  "#다정함": "#Affectionate", "#예술감각": "#ArtisticSense", "#힐러": "#Healer",
  "#내실": "#Substantial", "#인내": "#Patience", "#포용": "#Embrace", "#은근한열정": "#QuietPassion",
  "#안정": "#Stability", "#신뢰": "#Trust", "#조용한리더": "#QuietLeader",
  "#귀티": "#Classy", "#미적감각": "#Aesthetic", "#깔끔함": "#Neat",
  "#강한의지": "#StrongWill", "#전문성": "#Expertise", "#뚝심": "#Perseverance",
  "#자기표현": "#SelfExpression", "#스타성": "#StarQuality",
  "#든든함": "#Reliable",
  "#명예지향": "#HonorSeeker", "#고독한성취가": "#LoneAchiever", "#츤데레": "#Tsundere",
  "#신중함": "#Cautious", "#재물복": "#WealthyVibes", "#무게감": "#Weighty",
  "#고집": "#Stubborn", "#신념": "#Conviction", "#우직함": "#Steadfast",
  "#활동성": "#Active", "#모험가": "#Adventurer",
  "#폭발력": "#Explosive", "#강한에너지": "#StrongEnergy", "#직진": "#StraightForward",
  "#자립심": "#SelfReliant", "#생활력": "#SurvivalSkills",
  "#정의감": "#Justice", "#명예": "#Honor",
  "#모험심": "#Adventurous",
  "#의리": "#Loyalty",
  "#강한자아": "#StrongEgo", "#불도저": "#Bulldozer",
  "#고귀함": "#NobleVibes",
  "#민감함": "#SensitiveVibes",
  "#청초함": "#Innocent",
  "#지적호기심": "#IntellectualCuriosity",
  "#잠재력": "#Potential",
  "#인기쟁이": "#Popular",
  "#결단력": "#Decisive",
  "#재능": "#Talented"
};

// Fallback for missing Ilju data
const getIljuCharacter = (key: string, lang: Language): { core: string, traits: string[], hashtags: string[], scene: string } => {
  const data = ILJU_CHARACTER_DATA[key];
  if (data) {
    return {
      core: lang === 'KO' ? data.core.ko : data.core.en,
      traits: data.traits,
      hashtags: lang === 'KO' ? data.hashtags : data.hashtags.map(tag => EN_HASHTAG_MAP[tag] || tag),
      scene: lang === 'KO' ? data.scene.ko : data.scene.en
    };
  }

  // Dynamic fallback based on Stem/Branch
  const stemName = key[0];
  const branchName = key[1];
  
  // Find Hanja to get elements
  const stemHanja = Object.keys(STEM_NAMES).find(k => STEM_NAMES[k] === stemName) || '';
  const branchHanja = Object.keys(BRANCH_NAMES).find(k => BRANCH_NAMES[k] === branchName) || '';
  
  const s = STEM_METAPHORS[stemHanja] || { ko: stemName, en: stemName };
  const b = BRANCH_METAPHORS[branchHanja] || { ko: branchName, en: branchName };
  const sElem = BAZI_MAPPING.stems[stemHanja as keyof typeof BAZI_MAPPING.stems]?.element || 'Earth';
  const bElem = BAZI_MAPPING.branches[branchHanja as keyof typeof BAZI_MAPPING.branches]?.element || 'Earth';

  const core = lang === 'KO' ? `${b.ko} 자리한 ${s.ko}` : `A ${s.en} situated ${b.en.toLowerCase()}`;
  
  // Dynamic hashtags based on elements
  const hashtags = [];
  if (lang === 'KO') {
    if (sElem === 'Wood') hashtags.push("#성장형", "#개척자");
    else if (sElem === 'Fire') hashtags.push("#열정파", "#표현가");
    else if (sElem === 'Earth') hashtags.push("#안정형", "#포용력");
    else if (sElem === 'Metal') hashtags.push("#결단력", "#원칙주의");
    else if (sElem === 'Water') hashtags.push("#지혜형", "#유연함");

    if (bElem === 'Wood') hashtags.push("#생명력");
    else if (bElem === 'Fire') hashtags.push("#에너지");
    else if (bElem === 'Earth') hashtags.push("#든든함");
    else if (bElem === 'Metal') hashtags.push("#예리함");
    else if (bElem === 'Water') hashtags.push("#깊이감");
  } else {
    if (sElem === 'Wood') hashtags.push("#GrowthMindset", "#Trailblazer");
    else if (sElem === 'Fire') hashtags.push("#Passionate", "#Expressive");
    else if (sElem === 'Earth') hashtags.push("#StableVibes", "#Inclusive");
    else if (sElem === 'Metal') hashtags.push("#Decisive", "#Principled");
    else if (sElem === 'Water') hashtags.push("#Wise", "#Flexible");

    if (bElem === 'Wood') hashtags.push("#Vitality");
    else if (bElem === 'Fire') hashtags.push("#HighEnergy");
    else if (bElem === 'Earth') hashtags.push("#Reliable");
    else if (bElem === 'Metal') hashtags.push("#Sharp");
    else if (bElem === 'Water') hashtags.push("#DeepThinker");
  }

  return {
    core,
    traits: [],
    hashtags: hashtags.slice(0, 3),
    scene: core
  };
};

export function generateSoulSummary(result: BaZiResult, lang: Language): SoulSummary {
  const dayPillar = result.pillars.find(p => p.title === 'Day');
  const iljuKey = dayPillar ? `${STEM_NAMES[dayPillar.stem] || ''}${BRANCH_NAMES[dayPillar.branch] || ''}` : "무인";
  const iljuName = dayPillar ? (lang === 'KO' ? `${STEM_NAMES[dayPillar.stem] || dayPillar.stem}${BRANCH_NAMES[dayPillar.branch] || dayPillar.branch}일주` : `${dayPillar.stemEnglishName} ${dayPillar.branchEnglishName} Pillar`) : "무인일주";

  const charData = getIljuCharacter(iljuKey, lang);
  const strength = result.analysis?.strength?.score ?? 50;
  const tenGods = result.analysis?.tenGodsRatio || {};
  const shinsal = result.analysis?.shinsal || [];

  // Step 2 & 3: Dynamic Filtering and Vibe Mapping (Granular Segmentation)
  let hashtags = [...charData.hashtags];
  let oneLineReview = charData.scene;

  // Helper for random tags
  const pickRandom = (tags: string[], count: number = 2) => [...tags].sort(() => 0.5 - Math.random()).slice(0, count);

  // 1. Ten Gods Scores (Da-ja / Mu-ja)
  const bigyeopScore = (tenGods['Friend'] || 0) + (tenGods['Rob Money'] || 0);
  const sikSangScore = (tenGods['Eating God'] || 0) + (tenGods['Hurting Officer'] || 0);
  const jaeSeongScore = (tenGods['Indirect Wealth'] || 0) + (tenGods['Direct Wealth'] || 0);
  const gwanSeongScore = (tenGods['Indirect Officer'] || 0) + (tenGods['Direct Officer'] || 0);
  const inSeongScore = (tenGods['Indirect Resource'] || 0) + (tenGods['Direct Resource'] || 0);

  if (lang === 'KO') {
    // Bi-Gyeop (Self)
    if (bigyeopScore > 35) {
      if (sikSangScore > 20) hashtags.push(...pickRandom(["#핵인싸", "#확신의대문자E", "#분위기메이커", "#에너지뿜뿜", "#인간비타민"]));
      else hashtags.push(...pickRandom(["#자발적아싸", "#고독한늑대", "#마이웨이", "#독고다이", "#혼자가편해"]));
    }

    // Sik-Sang (Output)
    if (sikSangScore > 35) hashtags.push(...pickRandom(["#표현의귀재", "#아이디어뱅크", "#말발천재", "#창의력대장", "#오지라퍼"]));
    else if (sikSangScore === 0) hashtags.push(...pickRandom(["#과묵한포스", "#생각이행동으로", "#신중함의끝", "#조용한강자", "#팩트폭격기"]));

    // Jae-Seong (Wealth)
    if (jaeSeongScore > 35) hashtags.push(...pickRandom(["#현실주의자", "#계산기만렙", "#자본주의괴물", "#재테크요정", "#실속파"]));
    else if (jaeSeongScore === 0) hashtags.push(...pickRandom(["#무소유의미학", "#과정중심", "#낭만주의자", "#돈보다꿈", "#물욕제로"]));

    // Gwan-Seong (Power/Officer)
    if (gwanSeongScore > 35) hashtags.push(...pickRandom(["#K-직장인", "#책임감지옥", "#원칙주의자", "#완벽주의", "#바른생활"]));
    else if (gwanSeongScore === 0) hashtags.push(...pickRandom(["#규칙브레이커", "#자유로운영혼", "#통제불가", "#내맘대로살거야", "#보헤미안"]));

    // In-Seong (Resource)
    if (inSeongScore > 35) hashtags.push(...pickRandom(["#생각부자", "#프로고민러", "#학구파", "#망상가", "#지식컬렉터"]));
    else if (inSeongScore === 0) hashtags.push(...pickRandom(["#행동파", "#경험주의", "#일단고", "#눈치백단", "#실전압축형"]));

    // 2. Gan-Yeo-Ji-Dong (Day Pillar Stem/Branch same element)
    if (dayPillar && BAZI_MAPPING.stems[dayPillar.stem]?.element === BAZI_MAPPING.branches[dayPillar.branch]?.element) {
      hashtags.push(...pickRandom(["#자존심끝판왕", "#확신의주관", "#꺾이지않는마음", "#고집불통", "#외유내강"]));
    }

    // 3. Interactions (Hap/Chung/Hyeong)
    const interactions = result.analysis?.interactions || [];
    if (interactions.some((i: any) => i.type === 'Chung' || i.type === 'Hyeong')) {
      hashtags.push(...pickRandom(["#변화무쌍", "#스펙터클", "#롤러코스터인생", "#다이나믹", "#반전매력"]));
    }
    if (interactions.some((i: any) => i.type === 'Hap')) {
      hashtags.push(...pickRandom(["#평화주의자", "#금사빠", "#인간관계장인", "#둥글둥글", "#친화력갑"]));
    }

    // 4. Specific Ten Gods Vibe
    if ((tenGods['Hurting Officer'] || 0) > 20) hashtags.push(...pickRandom(["#말발천재", "#재주꾼", "#팩폭러", "#센스쟁이"]));
    if ((tenGods['Indirect Officer'] || 0) > 20) hashtags.push(...pickRandom(["#완벽주의", "#유리멘탈리더", "#카리스마", "#책임감"]));
    if ((tenGods['Indirect Wealth'] || 0) > 20) hashtags.push(...pickRandom(["#재테크왕", "#갓생러", "#투자귀재", "#사업가기질"]));

    // 5. Shinsal Mapping
    if (shinsal.some((s: any) => s.name === '역마살')) {
      hashtags.push(...pickRandom(["#공항도둑아님", "#전국팔도유랑", "#엉덩이가벼움", "#노마드라이프", "#자유로운영혼"]));
    }
    if (shinsal.some((s: any) => s.name === '도화살' || s.name === '홍염살')) {
      hashtags.push(...pickRandom(["#시선강탈", "#인간자석", "#확신의센터상", "#분위기깡패", "#매력철철"]));
    }
    if (shinsal.some((s: any) => s.name === '백호살' || s.name === '괴강살')) {
      hashtags.push(...pickRandom(["#강한멘탈", "#승부사", "#불도저", "#카리스마", "#멘탈갑"]));
    }
  } else {
    // Bi-Gyeop (Self)
    if (bigyeopScore > 35) {
      if (sikSangScore > 20) hashtags.push(...pickRandom(["#SocialButterfly", "#MainCharacterEnergy", "#VibeCreator", "#HypeBeast", "#HumanVitamin"]));
      else hashtags.push(...pickRandom(["#LoneWolf", "#IntrovertLife", "#MyWay", "#SoloDolo", "#PeaceAndQuiet"]));
    }

    // Sik-Sang (Output)
    if (sikSangScore > 35) hashtags.push(...pickRandom(["#Yapper", "#IdeaBank", "#SmoothTalker", "#CreativeGenius", "#NosyButCaring"]));
    else if (sikSangScore === 0) hashtags.push(...pickRandom(["#SilentAura", "#ActionsOverWords", "#SuperCautious", "#QuietStrength", "#FactDropper"]));

    // Jae-Seong (Wealth)
    if (jaeSeongScore > 35) hashtags.push(...pickRandom(["#Realist", "#HumanCalculator", "#CapitalistMonster", "#FinanceFairy", "#Pragmatic"]));
    else if (jaeSeongScore === 0) hashtags.push(...pickRandom(["#Minimalist", "#ProcessOverResult", "#Romantic", "#DreamsOverMoney", "#ZeroMaterialism"]));

    // Gwan-Seong (Power/Officer)
    if (gwanSeongScore > 35) hashtags.push(...pickRandom(["#CorporateSlave", "#ResponsibilityHell", "#RuleFollower", "#Perfectionist", "#GoodTwoShoes"]));
    else if (gwanSeongScore === 0) hashtags.push(...pickRandom(["#RuleBreaker", "#FreeSpirit", "#Uncontrollable", "#MyLifeMyRules", "#Bohemian"]));

    // In-Seong (Resource)
    if (inSeongScore > 35) hashtags.push(...pickRandom(["#Overthinker", "#ProfessionalWorrier", "#Nerd", "#Daydreamer", "#KnowledgeCollector"]));
    else if (inSeongScore === 0) hashtags.push(...pickRandom(["#ActionTaker", "#ExperienceFirst", "#JustDoIt", "#StreetSmart", "#PracticalAF"]));

    // 2. Gan-Yeo-Ji-Dong (Day Pillar Stem/Branch same element)
    if (dayPillar && BAZI_MAPPING.stems[dayPillar.stem]?.element === BAZI_MAPPING.branches[dayPillar.branch]?.element) {
      hashtags.push(...pickRandom(["#UltimatePride", "#StrongOpinions", "#UnbreakableSpirit", "#StubbornAF", "#SoftOutsideToughInside"]));
    }

    // 3. Interactions (Hap/Chung/Hyeong)
    const interactions = result.analysis?.interactions || [];
    if (interactions.some((i: any) => i.type === 'Chung' || i.type === 'Hyeong')) {
      hashtags.push(...pickRandom(["#EverChanging", "#Spectacular", "#RollercoasterLife", "#Dynamic", "#PlotTwist"]));
    }
    if (interactions.some((i: any) => i.type === 'Hap')) {
      hashtags.push(...pickRandom(["#Pacifist", "#FallsInLoveFast", "#SocialGenius", "#EasyGoing", "#FriendlyAF"]));
    }

    // 4. Specific Ten Gods Vibe
    if ((tenGods['Hurting Officer'] || 0) > 20) hashtags.push(...pickRandom(["#SmoothTalker", "#TalentedAF", "#FactDropper", "#WittyVibes"]));
    if ((tenGods['Indirect Officer'] || 0) > 20) hashtags.push(...pickRandom(["#Perfectionist", "#GlassHeartLeader", "#Charisma", "#ResponsibleAF"]));
    if ((tenGods['Indirect Wealth'] || 0) > 20) hashtags.push(...pickRandom(["#FinanceKing", "#HustleCulture", "#InvestmentGenius", "#CEOEnergy"]));

    // 5. Shinsal Mapping
    if (shinsal.some((s: any) => s.name === '역마살')) {
      hashtags.push(...pickRandom(["#NotAnAirportThief", "#Wanderlust", "#CantSitStill", "#NomadLife", "#FreeSpirit"]));
    }
    if (shinsal.some((s: any) => s.name === '도화살' || s.name === '홍염살')) {
      hashtags.push(...pickRandom(["#AttentionGrabber", "#HumanMagnet", "#MainCharacterEnergy", "#VibeBoss", "#RizzGod"]));
    }
    if (shinsal.some((s: any) => s.name === '백호살' || s.name === '괴강살')) {
      hashtags.push(...pickRandom(["#StrongMental", "#Gamer", "#Bulldozer", "#Charisma", "#MentalBoss"]));
    }
  }

  // Final Hashtag Selection (Unique 5)
  hashtags = Array.from(new Set(hashtags)).slice(0, 5);

  // Core Energy Calculation Variables
  const dayMaster = dayPillar?.stem || '戊';
  const dmElement = BAZI_MAPPING.stems[dayMaster as keyof typeof BAZI_MAPPING.stems]?.element || 'Earth';
  const elementsOrder = ["Wood", "Fire", "Earth", "Metal", "Water"];
  const dmIdx = elementsOrder.indexOf(dmElement);

  let yongShen = result.analysis?.yongShen || 'Wood';
  // Ensure yongShen is a valid element key (Strip terminology if present in analysis)
  if (yongShen.includes('비겁')) yongShen = elementsOrder[dmIdx];
  else if (yongShen.includes('식상')) yongShen = elementsOrder[(dmIdx + 1) % 5];
  else if (yongShen.includes('재성')) yongShen = elementsOrder[(dmIdx + 2) % 5];
  else if (yongShen.includes('관성')) yongShen = elementsOrder[(dmIdx + 3) % 5];
  else if (yongShen.includes('인성')) yongShen = elementsOrder[(dmIdx + 4) % 5];

  // Core Energy (Use Yong-shin as the key energy to utilize)
  const rawElemKo = BAZI_MAPPING.elements[yongShen as keyof typeof BAZI_MAPPING.elements]?.ko || yongShen;
  const coreElemKo = rawElemKo.split(' ')[0]; // Strip terminology
  const hanja = BAZI_MAPPING.elements[yongShen as keyof typeof BAZI_MAPPING.elements]?.hanja || "";
  const displayElem = lang === 'KO' ? `${coreElemKo}(${hanja})` : yongShen;

  // Core Energy logic based on Yong-shin's role (Ten Gods)
  const yongShenRoleIdx = (elementsOrder.indexOf(yongShen) - dmIdx + 5) % 5;
  const roles = ["비겁", "식상", "재성", "관성", "인성"];
  const role = roles[yongShenRoleIdx];

  const coreEnergyMap: Record<string, any> = {
    "인성": {
      ko: {
        description: `비옥한 대지처럼 모든 지식을 흡수하고, 당신만의 전문 자격과 지식 스택을 쌓는 것이 개운의 핵심입니다.`,
        practicalAdvice: `이론에 그치지 말고 자격증이나 결과물로 '전문가 포스'를 증명하세요.`,
        luckyHabit: `매일 30분, 나만의 전문 분야 딥다이브로 뇌 근육 키우기`
      },
      en: {
        description: `Like a sponge, absorbing knowledge and building your own unique skill stack is the ultimate cheat code.`,
        practicalAdvice: `Talk is cheap. Flex your 'Expert Vibe' with actual receipts (certs, projects, results).`,
        luckyHabit: `30 mins of daily deep-diving into your hyper-fixation to build that brain muscle.`
      }
    },
    "비겁": {
      ko: {
        description: `거대한 바위처럼 자신을 믿고 뚝심 있게 밀어붙이는 강한 자존감이 필요합니다.`,
        practicalAdvice: `타인의 시선은 '노이즈'일 뿐, 나의 내면 목소리에 집중하세요.`,
        luckyHabit: `거울 보며 '오늘도 내가 최고다' 3번 외치기`
      },
      en: {
        description: `You need that unbothered, main character energy to trust yourself and push through.`,
        practicalAdvice: `Other people's opinions are just background noise. Focus on your own plotline.`,
        luckyHabit: `Looking in the mirror and saying 'I am the moment' 3 times.`
      }
    },
    "식상": {
      ko: {
        description: `물처럼 유연하게 당신의 재능과 아이디어를 세상에 화려하게 표출하세요.`,
        practicalAdvice: `머릿속 구상을 즉각 행동으로 옮기는 '광속 실행력'이 답입니다.`,
        luckyHabit: `새로운 아이디어 떠오를 때마다 바로 메모하고 1개라도 실행하기`
      },
      en: {
        description: `Flex your talents and let your ideas flow into the world like water. Don't hold back.`,
        practicalAdvice: `Stop overthinking. 'Light-speed execution' is your best friend right now.`,
        luckyHabit: `Jotting down every random 3 AM idea and actually doing one of them.`
      }
    },
    "재성": {
      ko: {
        description: `끝없이 펼쳐진 황금 들판처럼 현실적인 목표를 세우고 결과물을 만들어내는 감각을 키우세요.`,
        practicalAdvice: `막연한 꿈보다 '통장 잔고'나 '구체적 숫자'로 성과를 확인하세요.`,
        luckyHabit: `가계부 작성이나 투자 포트폴리오 점검하며 자산 감각 깨우기`
      },
      en: {
        description: `Time to secure the bag. Set realistic goals and develop a radar for actual results.`,
        practicalAdvice: `Dreams are cool, but numbers don't lie. Track your wins with actual data (and bank balances).`,
        luckyHabit: `Checking your budget or portfolio to keep that financial energy high.`
      }
    },
    "관성": {
      ko: {
        description: `날카로운 칼날처럼 자신만의 규칙과 절제로 사회적 명예를 쌓아가는 힘이 필요합니다.`,
        practicalAdvice: `루틴을 지키고 책임감 있는 모습으로 '신뢰 자본'을 쌓으세요.`,
        luckyHabit: `정해진 시간에 기상하고 하루 계획 100% 완수 도전하기`
      },
      en: {
        description: `Channel your inner boss. You need discipline and your own set of rules to level up your status.`,
        practicalAdvice: `Build that 'trust capital' by sticking to your routines and actually showing up.`,
        luckyHabit: `Waking up on time and speed-running your daily to-do list.`
      }
    }
  };

  const coreInfo = coreEnergyMap[role]?.[lang === 'KO' ? 'ko' : 'en'] || coreEnergyMap["인성"][lang === 'KO' ? 'ko' : 'en'];

  // Action Prescription
  const actionPrescription = lang === 'KO' ?
    `이번 달은 ${displayElem}의 기운을 활용해 ${coreInfo.practicalAdvice}` :
    `This month, use the energy of ${yongShen} to ${coreInfo.practicalAdvice}`;

  // Lucky Items
  const luckyItemsMap: Record<string, { name: string, description: string }[]> = {
    "Wood": [
      { name: lang === 'KO' ? "초록색 식물" : "Green Plant", description: lang === 'KO' ? "성장판 자극하는 초록 에너지를 곁에 두세요. (물 주는 건 잊지 말기!)" : "Keep that green energy close to stimulate growth. (Don't forget to water it, though!)" },
      { name: lang === 'KO' ? "나무 재질 펜" : "Wooden Pen", description: lang === 'KO' ? "내 안의 창의력을 깨울 마법의 지팡이입니다. 아날로그 감성은 덤!" : "A magic wand to wake up your inner creative genius. Analog vibes included." }
    ],
    "Fire": [
      { name: lang === 'KO' ? "붉은색 지갑" : "Red Wallet", description: lang === 'KO' ? "재물을 끌어당기는 자석! 열정 만수르를 위한 핫한 아이템입니다." : "A literal magnet for wealth. A hot item for your passionate era." },
      { name: lang === 'KO' ? "향수" : "Signature Scent", description: lang === 'KO' ? "세상의 주인공이 된 것 같은 아우라를 선사합니다. 향기로 압도하세요." : "Gives you that 'main character' aura. Overwhelm them with your vibe." }
    ],
    "Earth": [
      { name: lang === 'KO' ? "황토색 머그컵" : "Earthy Mug", description: lang === 'KO' ? "내 멘탈을 잡아줄 든든한 버팀목! 따뜻한 차 한 잔으로 평온을 찾으세요." : "A solid anchor for your mental health. Find your zen with a warm cup of tea." },
      { name: lang === 'KO' ? "가죽 지갑" : "Leather Wallet", description: lang === 'KO' ? "통장 잔고를 지켜줄 든든한 가드! 재물을 담아두는 튼튼한 대지입니다." : "A heavy-duty guard for your bank balance. Solid ground to hold your bag." }
    ],
    "Metal": [
      { name: lang === 'KO' ? "실버 액세서리" : "Silver Jewelry", description: lang === 'KO' ? "결단력 200% 충전! 우유부단함을 날려버릴 시크한 아이템입니다." : "Decisiveness charged to 200%! A chic item to banish your indecision." },
      { name: lang === 'KO' ? "화이트 셔츠" : "Crisp White Shirt", description: lang === 'KO' ? "복잡한 머릿속을 정리해줄 마법의 유니폼! 깔끔한 시작을 도와줍니다." : "A magic uniform to clear your cluttered mind. Perfect for a fresh start." }
    ],
    "Water": [
      { name: lang === 'KO' ? "블루 텀블러" : "Blue Tumbler", description: lang === 'KO' ? "지혜가 샘솟는 블루 에너지! 유연한 사고를 돕는 필수템입니다." : "Blue energy overflowing with wisdom. An absolute must-have for flexible thinking." },
      { name: lang === 'KO' ? "검정색 다이어리" : "Black Journal", description: lang === 'KO' ? "유연한 대처 능력을 기록하세요. 당신의 지혜를 담는 보물상자입니다." : "Write down your big brain moments. A treasure chest for your wisdom." }
    ]
  };

  const luckyItems = luckyItemsMap[yongShen] || luckyItemsMap["Earth"];

  // Element Strengths
  const elementRatios = result.analysis?.elementRatios || { 'Wood': 20, 'Fire': 20, 'Earth': 20, 'Metal': 20, 'Water': 20 };
  const elementStrengths = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].map(el => ({
    name: lang === 'KO' ? BAZI_MAPPING.elements[el as keyof typeof BAZI_MAPPING.elements]?.ko || el : el,
    percentage: elementRatios[el] || 0,
    color: (ELEMENT_COLORS as any)[el] || '#ccc'
  }));

  return {
    oneLineReview,
    iljuName,
    hashtags,
    traits: charData.traits,
    coreEnergy: {
      element: displayElem,
      ...coreInfo
    },
    actionPrescription,
    luckyItems,
    elementStrengths
  };
}
