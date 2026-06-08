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
    baseElement: string;
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

const STEM_TRANSLITERATION: Record<string, string> = {
  '甲': 'GAP', '乙': 'EUL', '丙': 'BYEONG', '丁': 'JEONG', '戊': 'MU',
  '己': 'GI', '庚': 'GYEONG', '辛': 'SIN', '壬': 'IM', '癸': 'GYE'
};

const BRANCH_TRANSLITERATION: Record<string, string> = {
  '子': 'JA', '丑': 'CHUK', '寅': 'IN', '卯': 'MYO', 'JIN': 'JIN', '辰': 'JIN', '巳': 'SA',
  '午': 'O', '未': 'MI', '申': 'SHIN', '酉': 'YU', '戌': 'SUL', '亥': 'HAE'
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
  "#다재다능": "#Versatile", "#변화무쌍": "#ConstantChange", "#재치": "#Witty", "#호기심": "#Curious",
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
  const iljuName = dayPillar ? (
    lang === 'KO' ? 
      `${STEM_NAMES[dayPillar.stem] || dayPillar.stem}${BRANCH_NAMES[dayPillar.branch] || dayPillar.branch}일주 (${dayPillar.hanja})` : 
      `${STEM_TRANSLITERATION[dayPillar.stem] || dayPillar.stem}-${BRANCH_TRANSLITERATION[dayPillar.branch] || dayPillar.branch} (${dayPillar.hanja}) Day Pillar`
  ) : (
    lang === 'KO' ? "무인일주 (戊寅)" : "MU-IN (戊寅) Day Pillar"
  );

  const charData = getIljuCharacter(iljuKey, lang);
  const strength = result.analysis?.strength?.score ?? 50;
  const tenGods = result.analysis?.tenGodsRatio || {};
  const shinsal = result.analysis?.shinsal || [];

  // Step 2 & 3: Dynamic Filtering and Vibe Mapping (Granular Segmentation)
  let hashtags = [...charData.hashtags];
  
  const oneLineReview = charData.scene;

  // Helper for random tags
  const pickRandom = (tags: string[], count: number = 2) => [...tags].sort(() => 0.5 - Math.random()).slice(0, count);

  // 1. Ten Gods Scores (Da-ja / Mu-ja)
  const getTenGodScore = (keywords: string[]) => {
    return Object.entries(tenGods).reduce((sum, [key, val]) => {
      if (keywords.some(kw => key.includes(kw))) {
        return sum + (val as number);
      }
      return sum;
    }, 0);
  };

  const bigyeopScore = getTenGodScore(['비겁', 'Mirror', 'Rival']);
  const sikSangScore = getTenGodScore(['식상', 'Artist', 'Rebel']);
  const jaeSeongScore = getTenGodScore(['재성', 'Maverick', 'Architect']);
  const gwanSeongScore = getTenGodScore(['관성', 'Warrior', 'Judge']);
  const inSeongScore = getTenGodScore(['인성', 'Mystic', 'Sage']);

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
    if (jaeSeongScore > 35) {
      if (strength < 40) {
        // Jae-da-shin-yak: High wealth elements but weak DM strength
        hashtags.push(...pickRandom(["#재다신약", "#일복터짐", "#내돈어디에", "#그림의떡", "#열심히일한당신", "#은행원재질"]));
      } else {
        // Strong enough to handle wealth
        if (inSeongScore === 0 && gwanSeongScore === 0) {
          hashtags.push(...pickRandom(["#자본주의괴물", "#돈냄새콜렉터", "#실외주의", "#수익형인간", "#야망가"]));
        } else {
          hashtags.push(...pickRandom(["#현실주의자", "#계산기만렙", "#재테크요정", "#실속파", "#갓생러"]));
        }
      }
    } else if (jaeSeongScore === 0) {
      hashtags.push(...pickRandom(["#무소유의미학", "#과정중심", "#낭만주의자", "#돈보다꿈", "#물욕제로"]));
    }

    // Gwan-Seong (Power/Officer)
    if (gwanSeongScore > 35) {
      const pyeonGwanCount = result.pillars?.reduce((c, p) => c + (p.stemKoreanName?.includes('편관') ? 1 : 0) + (p.branchKoreanName?.includes('편관') ? 1 : 0), 0) || 0;
      const jeongGwanCount = result.pillars?.reduce((c, p) => c + (p.stemKoreanName?.includes('정관') ? 1 : 0) + (p.branchKoreanName?.includes('정관') ? 1 : 0), 0) || 0;
      
      const isGwanSalHonJap = pyeonGwanCount > 0 && jeongGwanCount > 0 && (pyeonGwanCount + jeongGwanCount >= 2);

      if (isGwanSalHonJap) {
        hashtags.push(...pickRandom(["#천의얼굴", "#다기능멀티탭", "#카멜레온", "#양파같은매력", "#어떨땐FM어떨땐야생마"]));
      } else if (pyeonGwanCount > jeongGwanCount) {
        hashtags.push(...pickRandom(["#책임감지옥", "#원칙주의자", "#완벽주의", "#보스기질", "#카리스마"]));
      } else {
        hashtags.push(...pickRandom(["#K-직장인", "#바른생활", "#모범생", "#FM", "#신뢰의아이콘"]));
      }
    }
    else if (gwanSeongScore === 0) {
      if (jaeSeongScore > 35) {
        hashtags.push(...pickRandom(["#통제불가불도저", "#일단질러", "#자유로운영혼", "#브레이크고장", "#내맘대로살거야"]));
      } else {
        const randomTags = pickRandom(["#규칙브레이커", "#자유로운영혼", "#통제불가", "#내맘대로살거야"]);
        hashtags.push(...randomTags, "#보헤미안");
      }
    }

    // In-Seong (Resource)
    if (inSeongScore > 35) {
      hashtags.push(...pickRandom(["#생각부자", "#프로고민러", "#학구파", "#사색가", "#지식컬렉터"]));
    } else if (inSeongScore === 0) {
      if (jaeSeongScore > 35) {
        hashtags.push(...pickRandom(["#실전압축형", "#생각보다몸이먼저", "#눈치백단", "#실속파", "#결과중심"]));
      } else {
        hashtags.push(...pickRandom(["#행동파", "#경험주의", "#일단고", "#눈치백단", "#실전압축형"]));
      }
    }

    // 2. Gan-Yeo-Ji-Dong (Day Pillar Stem/Branch same element)
    if (dayPillar && BAZI_MAPPING.stems[dayPillar.stem]?.element === BAZI_MAPPING.branches[dayPillar.branch]?.element) {
      hashtags.push(...pickRandom(["#자존심끝판왕", "#확신의주관", "#꺾이지않는마음", "#고집불통", "#외유내강"]));
    }

    // 3. Interactions (Hap/Chung/Hyeong)
    const interactions = result.analysis?.interactions || [];
    if (interactions.some((i: any) => i.type.includes('충') || i.type.includes('형') || i.type.includes('파') || i.type.includes('원진'))) {
      hashtags.push(...pickRandom(["#변화무쌍", "#스펙터클", "#롤러코스터인생", "#긴장감백배", "#반전매력"]));
    }
    if (interactions.some((i: any) => i.type.includes('합'))) {
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
    if (gwanSeongScore > 35) {
      const pyeonGwanCount = result.pillars?.reduce((c, p) => c + (p.stemKoreanName?.includes('편관') ? 1 : 0) + (p.branchKoreanName?.includes('편관') ? 1 : 0), 0) || 0;
      const jeongGwanCount = result.pillars?.reduce((c, p) => c + (p.stemKoreanName?.includes('정관') ? 1 : 0) + (p.branchKoreanName?.includes('정관') ? 1 : 0), 0) || 0;
      
      if (pyeonGwanCount > jeongGwanCount) {
        hashtags.push(...pickRandom(["#ResponsibilityHell", "#RuleFollower", "#Perfectionist", "#BossVibe", "#CharismaFocus"]));
      } else {
        hashtags.push(...pickRandom(["#CorporateHero", "#GoodTwoShoes", "#ModelCitizen", "#ByTheBook", "#TrustIcon"]));
      }
    }
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
    if (interactions.some((i: any) => i.type.includes('충') || i.type.includes('형') || i.type.includes('파') || i.type.includes('원진'))) {
      hashtags.push(...pickRandom(["#EverChanging", "#Spectacular", "#RollercoasterLife", "#HighIntensity", "#PlotTwist"]));
    }
    if (interactions.some((i: any) => i.type.includes('합'))) {
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
  const primaryElementField = result.analysis?.yongshinDetail?.primary?.element || "";
  const hasMultipleElements = primaryElementField.includes('/');
  const yongShenElements = hasMultipleElements ? primaryElementField.split('/') : [primaryElementField];
  
  // Extract base element if it contains English terminology (e.g., "Water (Maverick/Architect)")
  let baseElement = yongShen;
  const enElementMatch = yongShen.match(/(Wood|Fire|Earth|Metal|Water)/);
  if (enElementMatch) {
    baseElement = enElementMatch[1];
  }

  // Ensure baseElement is a valid element key (Strip terminology if present in analysis)
  if (baseElement.includes('비겁')) baseElement = elementsOrder[dmIdx];
  else if (baseElement.includes('식상')) baseElement = elementsOrder[(dmIdx + 1) % 5];
  else if (baseElement.includes('재성')) baseElement = elementsOrder[(dmIdx + 2) % 5];
  else if (baseElement.includes('관성')) baseElement = elementsOrder[(dmIdx + 3) % 5];
  else if (baseElement.includes('인성')) baseElement = elementsOrder[(dmIdx + 4) % 5];

  // Core Energy (Use Yong-shin as the key energy to utilize)
  let displayElem = baseElement;
  if (hasMultipleElements && yongShenElements.length > 1) {
    displayElem = lang === 'KO' 
      ? yongShenElements.map(el => {
          const ko = BAZI_MAPPING.elements[el as keyof typeof BAZI_MAPPING.elements]?.ko?.split(' ')[0] || el;
          const hanja = BAZI_MAPPING.elements[el as keyof typeof BAZI_MAPPING.elements]?.hanja || "";
          return `${ko}(${hanja})`;
        }).join(' · ')
      : yongShenElements.join(' / ');
  } else {
    const rawElemKo = BAZI_MAPPING.elements[baseElement as keyof typeof BAZI_MAPPING.elements]?.ko || baseElement;
    const coreElemKo = rawElemKo.split(' ')[0]; // Strip terminology
    const hanja = BAZI_MAPPING.elements[baseElement as keyof typeof BAZI_MAPPING.elements]?.hanja || "";
    displayElem = lang === 'KO' ? `${coreElemKo}(${hanja})` : baseElement;
  }

  const rawGeju = result.analysis?.geJu || "";
  const isSelfDominantGeju = rawGeju.includes("건록") || rawGeju.includes("비견") || rawGeju.includes("겁재") || rawGeju.includes("양인") ||
                              rawGeju.toLowerCase().includes("prosperity") || rawGeju.toLowerCase().includes("mirror") || rawGeju.toLowerCase().includes("rival") || rawGeju.toLowerCase().includes("blade");
  const isThreeElementsYongshin = isSelfDominantGeju || yongShenElements.length >= 3;

  if (isThreeElementsYongshin) {
    const threeElementsIndices = [(dmIdx + 1) % 5, (dmIdx + 2) % 5, (dmIdx + 3) % 5];
    const threeElements = threeElementsIndices.map(idx => elementsOrder[idx]);
    displayElem = lang === 'KO' 
      ? threeElements.map(el => {
          const ko = BAZI_MAPPING.elements[el as keyof typeof BAZI_MAPPING.elements]?.ko?.split(' ')[0] || el;
          const hanja = BAZI_MAPPING.elements[el as keyof typeof BAZI_MAPPING.elements]?.hanja || "";
          return `${ko}(${hanja})`;
        }).join(' · ')
      : threeElements.join(' / ');
  }

  // Core Energy logic based on Yong-shin's role (Ten Gods)
  const yongShenRoleIdx = (elementsOrder.indexOf(baseElement) - dmIdx + 5) % 5;
  const roles = ["비겁", "식상", "재성", "관성", "인성"];
  const role = roles[yongShenRoleIdx];

  const elementMetaphors: Record<string, { ko: string, en: string }> = {
    "Wood": { ko: "거목처럼 흔들림 없이", en: "like a deeply rooted tree" },
    "Fire": { ko: "불꽃처럼 강렬하게", en: "like a blazing fire" },
    "Earth": { ko: "대지처럼 묵묵하게", en: "like the solid earth" },
    "Metal": { ko: "단단한 금속처럼 예리하게", en: "like sharp, refined metal" },
    "Water": { ko: "물처럼 유연하게", en: "like flowing water" }
  };
  const metaphor = elementMetaphors[baseElement] || { ko: "자연스럽게", en: "naturally" };

  const isStrongDM = (result.analysis?.dayMasterStrength?.score ?? 3.0) >= 3.5;

  const coreEnergyMap: Record<string, any> = {
    "인성": {
      ko: {
        description: isStrongDM 
          ? `내안의 강한 주관을 지혜롭게 뒷받침할 수 있도록, 객관적인 지식과 깊이 있는 성찰을 조화롭게 채워가는 시기입니다.`
          : `학문이나 전문 분야에 깊이 몰입하며, 내외면을 차분하게 지탱해줄 라이선스나 가치 있는 배움을 정성껏 축적하기 좋은 때입니다.`,
        practicalAdvice: isStrongDM
          ? `신뢰도 높은 연구나 배움을 통해 한층 더 공인되고 전문적인 깊이를 지혜롭게 갖추어 보세요.`
          : `외부 활동에 내 에너지를 낭비하지 마시고, 조용한 서재를 지어 독서하거나 무언가를 배우는 시간을 편안히 늘려보세요.`,
        luckyHabit: isStrongDM
          ? `매일 아침 차분히 계획을 마주하고, 일상의 사소한 우선순위들부터 미루지 않고 이행하기`
          : `하루를 마감하며 내적인 일정을 기록하고, 조용히 책을 읽거나 일기장을 기록하는 고요한 시간 갖기`
      },
      en: {
        description: isStrongDM
          ? `A refined period to support your solid inner convictions with objective knowledge and reflective learning.`
          : `An excellent season to immerse yourself in study and accumulate valuable knowledge that serves as a foundation for your future designs.`,
        practicalAdvice: isStrongDM
          ? `Expand your professional expertise and solidify your academic or technical depth with structured learning.`
          : `Instead of overextending your energy in social interactions, allocate calm moments to quiet study and self-reflection.`,
        luckyHabit: isStrongDM
          ? `Review your core daily schedules calmly each morning, executing essential tasks in order without delay.`
          : `Dedicating a peaceful space in the evening to journal or read a thoughtful book.`
      }
    },
    "비겁": {
      ko: {
        description: !isStrongDM
          ? `타인의 참견이나 외부의 불필요한 요구에 흘들리지 마시고, 내 삶의 주권적 가치관과 주도적인 결정을 평온하게 지켜가야 하는 흐름입니다.`
          : `모든 과업을 홀로 감당하며 지치는 것보다는, 뜻이 맞고 끈끈한 가치관을 공유하는 신뢰 어린 조력자 동료들과 조화롭게 소통할 때 성장의 깊이가 커집니다.`,
        practicalAdvice: !isStrongDM
          ? `모든 결정에서 무의식적으로 타인의 승인이나 합의를 갈구하기보다는, 스스로 정립한 곧은 기준을 온전히 신뢰해 보세요.`
          : `오랜 지지나 두터운 우정을 나눌 소중할 지인들과 진솔한 티타임을 가지며 마음의 유대감을 깊이 다져보세요.`,
        luckyHabit: !isStrongDM
          ? `아침을 시작하며 내 일과와 삶의 진정한 주권과 최종 선택권이 오롯이 나에게 있음을 담담히 되새기기`
          : `평소 묵묵히 나를 격려하고 지탱해 주는 가족이나 절친한 동료에게 따뜻한 진심과 가벼운 감사의 소품 선물하기`
      },
      en: {
        description: !isStrongDM
          ? `A healthy period to establish calm boundaries, prioritizing your own values and independent decisions instead of seeking outside approval.`
          : `Rather than carrying every burden alone to physical exhaustion, seek out trustworthy allies to build meaningful solutions together.`,
        practicalAdvice: !isStrongDM
          ? `Trust your own structured frameworks rather than looking for immediate appreciation or consensus from your peers.`
          : `Create comfortable, conversational moments with loyal mentors to strengthen your social anchors.`,
        luckyHabit: !isStrongDM
          ? `Gently declare your own autonomy over your agenda as you begin each workday.`
          : `Express quiet gratitude with a warm message to those who always keep you anchored and supported.`
      }
    },
    "식상": {
      ko: {
        description: isStrongDM
          ? `마음속 깊이 오랫동안 축적해 온 독창적인 아이디어와 세밀한 계획을 현실 세계에 아낌없이 투영하고 적극적으로 표출해야 할 때입니다.`
          : `거창한 사회적 눈높이나 외부의 날카로운 성취 지표에서 가벼운 마음으로 걸어 나와, 순수한 나의 즐거움과 무해한 취미 활동에 안식을 부여해 보세요.`,
        practicalAdvice: isStrongDM
          ? `고치고 수정하는 완벽주의에 갇히기보다는, 작은 결과물이라도 용기 있게 무대 위로 올려 직접 펼쳐 보이며 첫발을 때어보세요.`
          : `물질적인 보상이나 거창한 실익에만 얽매이지 않고, 내면의 호기심과 영감이 조화롭게 일깨워지는 따뜻한 순간을 충분히 즐겨보세요.`,
        luckyHabit: isStrongDM
          ? `흥미로운 지점이나 직관적인 아이디어가 떠오른 즉시 메모장에 따뜻한 문장으로 부드럽게 기록해 두기`
          : `어떤 사회적 목적도 두지 않고 편안한 노트 위에 낙서하듯 흘려 쓴 상상을 즐겨보기`
      },
      en: {
        description: isStrongDM
          ? `A vibrant time to let your unique inspirations, talents, and hidden strategies manifest into practical creative output.`
          : `A pleasant season to step back from heavy performance metrics and allow your creative side to roam freely through personal hobbies.`,
        practicalAdvice: isStrongDM
          ? `Avoid get bogged down in endless editing; launching your thoughts into the world is key to capturing current opportunities.`
          : `Let go of standard outcome-based measurements and spend quality time on creative pursuits that genuinely refresh you.`,
        luckyHabit: isStrongDM
          ? `Make a quick note or doodle in your pocket notebook the moment an inspiring pattern captures your attention.`
          : `Enjoy private, off-grid hours to jot down your imaginative daydreams without self-censoring.`
      }
    },
    "재성": {
      ko: {
        description: isStrongDM
          ? `흘러가는 생각들을 객관적으로 관조하고 현실의 명확한 흐름과 유한한 삶의 자원들을 질서 정연하게 조율해 나가기에 좋은 운세입니다.`
          : `불필요한 외부의 유혹에 흘들리지 마시고, 내가 확실하고 차분하게 통제할 수 있는 정돈된 영역부터 착실하게 정리하는 지혜가 빛납니다.`,
        practicalAdvice: isStrongDM
          ? `나의 가까운 일정을 담백하게 정비해 보고, 삶의 지출 현황이나 자산의 자원 배분을 부담 없이 편안하게 조율해 보세요.`
          : `구체적이지 않은 조언이나 풍문에 휘둘리지 마시고, 소박하더라도 오랜 세월 검증된 탄탄한 일상의 기반부터 차분히 강화해 보세요.`,
        luckyHabit: isStrongDM
          ? `주말마다 손때 묻은 작업대나 거실을 정리하며, 불필요한 잔짐들과 낡은 요소들을 마음에 서서히 걷어내기`
          : `일상을 정교하게 살아가며 가벼운 금전 흐름만을 간략히 정돈하고, 합리적이고 안전한 생활 기준 확립하기`
      },
      en: {
        description: isStrongDM
          ? `A structured season to calibrate your resources, refine your long-term budgets, and manage your commitments cleanly.`
          : `An insightful period to focus on securing what you can comfortably execute rather than reaching too far.`,
        practicalAdvice: isStrongDM
          ? `Tidy up your calendar and spend some time restructuring your goals and finances with ease.`
          : `Decline speculative, high-octane calls that raise your stress, dedicating attention to solid foundations.`,
        luckyHabit: isStrongDM
          ? `Tidy your physical room and declutter redundant elements to bring clarity to your inner peace.`
          : `Review your basic expenditures and establish pleasant, secure habits that feel comfortable.`
      }
    },
    "관성": {
      ko: {
        description: isStrongDM
          ? `나의 탄탄한 전문성을 세상에 증명할 때입니다. 강단 있는 선택과 책임감 있는 조율을 통해 명예와 신뢰를 공고히 쌓아 가세요.`
          : `남들이 부과하는 지나치게 무거운 도덕적 의무에 마음 상하지 마시고, 나만을 위한 명확한 한계를 설정해 온전한 충전을 가지는 것이 절실합니다.`,
        practicalAdvice: isStrongDM
          ? `지나친 즉흥적 충동보다는 이미 확립된 단단한 규범과 신중한 지혜를 바탕으로 차분하게 상황을 이끌어 보세요.`
          : `과도하게 넘치는 부탁이나 감당하기 어려운 경계를 다정하게 밀어두고, 나의 건강한 하루를 온전히 존중하여 깊이 충전해 보세요.`,
        luckyHabit: isStrongDM
          ? `매일 아침 하루의 일정을 반듯하게 구성하고, 핵심 목표를 향해 흐트러짐 없이 나아가기`
          : `정규 일과의 종료 시간에 맞추어 불필요한 알림을 완전히 꺼두고, 나만의 안전하고 완전한 마음의 안식 즐기기`
      },
      en: {
        description: isStrongDM
          ? `Align your private expertise with social standards and high-trust rules to elevate your professional reputation.`
          : `Do not let social expectations drain you; establish clear boundaries and honor your need for rest.`,
        practicalAdvice: isStrongDM
          ? `Practice disciplined self-regulation and lead by quiet example within your community.`
          : `Politely decline overhead requests and set clear boundaries to safeguard your creative energy.`,
        luckyHabit: isStrongDM
          ? `Review your structured routine and complete your core priorities strictly on schedule.`
          : `Unplug from social and professional notifications at a set hour to enjoy pure personal rest.`
      }
    }
  };

  const threeElementsCoreInfo = {
    ko: {
      description: `스스로의 뿌리가 아주 단단한 격국(${rawGeju})입니다. 독립적인 에너지를 바탕으로 다양한 아이디어(식상을 통한 창의적 표현)와 현실적인 성과(재성을 통한 결과물), 그리고 확실한 책임감(관성을 통한 신뢰)을 고루 발휘해 스스로 길을 개척하고 큰 성공을 이뤄낼 수 있습니다.`,
      practicalAdvice: `생각에 머무는 계획을 거칠게라도 당장 세상에 드러내고(식상), 일의 마무리 단계를 꼼꼼히 챙겨 실리적 결과로 매듭지으며(재성), 신뢰 가득하고 책임감 있는 정돈된 원칙을 지켜 사회적 신용을 높여 보세요(관성).`,
      luckyHabit: `매주 하나의 독창적인 성과를 기록하고, 합리적인 자금 흐름을 조율하며, 공적인 모임에서 약속과 품위를 신사적으로 관리하기`
    },
    en: {
      description: `With an exceptionally strong and stable personal foundation (${rawGeju}), you possess the rare capacity to seamlessly balance and utilize three practical keys: Output (creative expression), Wealth (tangible results), and Power (social recognition & systems). By remaining anchored in self-reliance while designing, materializing, and scaling within structure, you can masterfully unlock your ultimate success.`,
      practicalAdvice: `Immediately launch your ideas and refine them in action (Output), meticulously close loop ends to secure real-life gains (Wealth), and maintain transparent, highly disciplined codes of conduct to elevate your social reputation (Power).`,
      luckyHabit: `Drafting one creative milestone weekly, auditing your personal finance flow, and gracefully refining your public-facing commitments and etiquette.`
    }
  };

  let coreInfo = coreEnergyMap[role]?.[lang === 'KO' ? 'ko' : 'en'] || coreEnergyMap["인성"][lang === 'KO' ? 'ko' : 'en'];
  if (isThreeElementsYongshin) {
    coreInfo = threeElementsCoreInfo[lang === 'KO' ? 'ko' : 'en'];
  }

  // Dynamic Destiny Remedy Summary (개운법)
  let destinyRemedySummary = "";
  if (lang === 'KO') {
    if (isThreeElementsYongshin) {
      destinyRemedySummary = "나의 단단한 중심을 믿고 완벽주의(인성)에 갇히기보다, 아이디어를 적극적으로 실행(식상)하며 확실한 실질 결과(재성)를 만들고 책임감(관성) 마인드로 신뢰를 탄탄하게 세워보세요.";
    } else if (sikSangScore >= 35) {
      destinyRemedySummary = "머릿속 기획과 재능을 완벽히 다듬으려 지체하기보다, 조금 투박하더라도 글, 창작, 기술 등 눈에 보이는 실리와 결과(재성)로 매듭지어 세상과 시원하게 승부해 보세요.";
    } else if (jaeSeongScore >= 35) {
      destinyRemedySummary = "매사 이익이나 당장의 효율에 집착해 뇌를 과열시키는 대신, 조급함을 끄고 나를 지탱할 학술, 자격증, 지혜 같은 단단한 내실(인성)을 충분히 보강하세요.";
    } else if (gwanSeongScore >= 35) {
      destinyRemedySummary = "엄격한 시선과 책임지옥에 숨 막혀하기보다, 명확한 전문 스펙(인성)을 강화하거나 날카로운 개성(식상)으로 나만의 독자적인 영역을 능동적으로 장악하세요.";
    } else if (bigyeopScore >= 40) {
      destinyRemedySummary = "소모적인 기싸움이나 해묵은 고집으로 감정을 허비하기 전, 내 주권을 담대히 긍정하고 창작(식상 설기)이나 비즈니스 목표에 모든 에너지를 쏟아보세요.";
    } else if (inSeongScore >= 40) {
      destinyRemedySummary = "생각의 성에서 탈출하여 완벽한 준비를 내려놓고, 미완성의 초안이라도 거칠게 실천(식상)하며 실제 세속적인 이익(재성)과 시장 피드백을 통해 역량을 검증해 보세요.";
    } else {
      if (role === "식상") {
        destinyRemedySummary = "내 안의 흥미로운 아이디어와 끼를 지체 없이 표현하고 가벼운 취미와 발산 욕구를 건강하게 해소해 보세요.";
      } else if (role === "재성") {
        destinyRemedySummary = "정밀한 계획 복원과 현실적인 자금/일정의 최적화에 힘쓰고 일상의 군더더기를 정리해 가치 중심의 성과로 이끄세요.";
      } else if (role === "관성") {
        destinyRemedySummary = "즉흥적인 충동을 긍정적으로 제어하며, 공적인 대의와 단단한 규칙을 바탕으로 원칙주의적인 신뢰도를 대폭 높이세요.";
      } else if (role === "인성") {
        destinyRemedySummary = "조용히 서재를 지어 독서에 힘쓰거나 가치 있는 배움과 검증된 라이선스를 획득해 내면의 흔들리지 않는 닻을 내리세요.";
      } else {
        destinyRemedySummary = "외부의 지나친 눈치와 참견을 차단하고, 내 삶의 주권적 가치를 회복하며 든든하고 소박한 조력자 동료들과 연대하세요.";
      }
    }
  } else {
    if (isThreeElementsYongshin) {
      destinyRemedySummary = "Leverage your solid inner-strength to launch bold ideas (Output), close operational ends (Wealth), and maintain elegant discipline (Power) simultaneously.";
    } else if (sikSangScore >= 35) {
      destinyRemedySummary = "Instead of perfecting ideas, project your raw talents into visible, real-world assets (Wealth) to claim tangible rewards.";
    } else if (jaeSeongScore >= 35) {
      destinyRemedySummary = "Step back from hyper-focusing on monetary margins, cooling down your overtaxed brain to enrich your license, wisdom, and inner reserves (Resource).";
    } else if (gwanSeongScore >= 35) {
      destinyRemedySummary = "Do not let social obligations exhaust you; secure heavy credentials (Resource) or make your own Rules of the Game with dynamic speech (Output).";
    } else if (bigyeopScore >= 40) {
      destinyRemedySummary = "Avoid wasting titanium focus on low-level clashes; direct your raw drive fully into grand creative ambitions or pioneering disruptions.";
    } else if (inSeongScore >= 40) {
      destinyRemedySummary = "Shatter your sacred perfectionism; release rough drafts immediately to collect actual market feedback and capitalize on secular rewards.";
    } else {
      if (role === "식상") {
        destinyRemedySummary = "Inject your unique voice and innovative sparks directly into tangible outcomes and enjoy creative hobbies.";
      } else if (role === "재성") {
        destinyRemedySummary = "Organize loose ends, budget your commitments, and focus tightly on high-trust routines and actionable projects.";
      } else if (role === "관성") {
        destinyRemedySummary = "Lead by quiet example, align with high-trust communal systems, and protect your schedule with healthy limits.";
      } else if (role === "인성") {
        destinyRemedySummary = "Quietly refine your master skill sets, absorb certified wisdom, and allow yourself cozy off-grid moments.";
      } else {
        destinyRemedySummary = "Reclaim sovereign control over your calendar, refuse unsolicited criticism, and foster deep bonds with true allies.";
      }
    }
  }

  // Action Prescription
  const actionPrescription = lang === 'KO' ?
    `이번 달은 ${displayElem}의 기운을 활용하는 것이 최고의 개운법입니다. ${destinyRemedySummary}` :
    `This month, utilizing the energy of ${displayElem} is your best destiny remedy. ${destinyRemedySummary}`;

  // Lucky Items
  const luckyItemsMap: Record<string, { name: string, description: string }[]> = {
    "Wood": [
      { name: lang === 'KO' ? "싱그러운 식물" : "Fresh Plant", description: lang === 'KO' ? "생동감 넘치는 초록빛 생명력을 가까이 두어 일상에 평온과 은근한 성장의 에너지를 채워 보세요." : "Keep a touch of nature nearby to foster calm focus and continuous inner growth." },
      { name: lang === 'KO' ? "우드 라이팅 펜" : "Wooden Pen", description: lang === 'KO' ? "자연의 부드러움을 가진 필기구로 가벼운 단상이나 하루의 정제된 계획들을 진솔하게 기록해 보세요." : "Use a wooden writing tool to reflectively capture your daily plans with a calm touch." }
    ],
    "Fire": [
      { name: lang === 'KO' ? "붉은 톤의 소품" : "Warm Accent Wallet", description: lang === 'KO' ? "활력 넘치는 붉은빛의 따뜻함을 곁에 두어 긍정의 기운과 당당한 자존감을 은근히 깨워 보세요." : "Incorporate warm, red accents to invite optimistic energy and subtle confidence into your workspace." },
      { name: lang === 'KO' ? "정갈한 향수" : "Signature Scent", description: lang === 'KO' ? "마음을 명징하게 해줄 은은하고 맑은 향기를 통해 정돈된 매력과 깊이를 편안하게 전해해 보세요." : "Wear a calm signature scent that conveys your elegant presence and poised character." }
    ],
    "Earth": [
      { name: lang === 'KO' ? "도자기 머그컵" : "Ceramic Mug", description: lang === 'KO' ? "흙의 차분한 온기를 간직한 컵으로 따뜻한 물을 차례로 나누며 마음의 든든한 평온을 겪어 보세요." : "Use a ceramic cup to enjoy a warm beverage, restoring your focus and grounded stillness during a draft." },
      { name: lang === 'KO' ? "가죽 액세서리" : "Leather Card Case", description: lang === 'KO' ? "견고하게 마감된 질감의 상자나 홀더로 나의 가치와 리소스들을 흔들림 없이 수호해 보세요." : "Choose high-quality, durable leather accessories to help manage and organize your essentials cleanly." }
    ],
    "Metal": [
      { name: lang === 'KO' ? "실버 톤 액세서리" : "Silver-Tone Accent", description: lang === 'KO' ? "선명하고 정교한 금속재 실버 소품을 통해 일상의 우유부단함에서 벗어나 정연한 판단력을 세워 보세요." : "Add sleek silver-toned items to sharpen your focus and eliminate distracting background noises." },
      { name: lang === 'KO' ? "클래식 화이트 셔츠" : "Crisp White Apparel", description: lang === 'KO' ? "정갈하고 깔끔한 복장을 갖추어 마음을 담백하게 가다듬고 세련된 태도로 일과를 가꾸어 가 보세요." : "Dress in clean white attire to clear complex thoughts and greet your goals with pure focus." }
    ],
    "Water": [
      { name: lang === 'KO' ? "딥 블루 텀블러" : "Deep Blue Tumbler", description: lang === 'KO' ? "깊고 유연한 푸른빛 물병으로 지친 일상을 깨우며, 막힘없이 조화로운 지혜를 지켜가 보세요." : "Hydrate with a deep blue bottle to welcome clear thoughts and a flexible, refreshing demeanor." },
      { name: lang === 'KO' ? "클래식 다이어리" : "Timeless Journal", description: lang === 'KO' ? "단정하게 정돈된 어둠을 닮은 지면 위에 성찰 가득한 깨달음을 묵묵하고 세밀하게 담아 보세요." : "Keep a classic dark journal to document your daily insights and wisdom over seasons." }
    ]
  };

  const luckyItems = luckyItemsMap[baseElement] || luckyItemsMap["Earth"];

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
      baseElement,
      ...coreInfo
    },
    actionPrescription,
    luckyItems,
    elementStrengths
  };
}
