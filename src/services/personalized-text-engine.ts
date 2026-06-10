// =====================================================================
// 개인화 텍스트 생성 엔진
// — 실제 천간·지지 이름을 포함한 심층 해설 텍스트를 동적으로 조합 —
// =====================================================================

import { BaZiCard, BaZiResult } from '../types';
import {
  STEM_PERSONALITIES,
  BRANCH_PERSONALITIES,
  TEN_GOD_POSITION_EFFECTS,
  SIGNATURE_PATTERN_TITLES,
} from '../constants/stem-branch-personalities';
import { BAZI_MAPPING } from '../constants/bazi-mapping';

export interface PersonalizedSection {
  title: string;
  description: string;
  keyPillars: { pillarTitle: string; type: 'stem' | 'branch' }[];
}

export interface PersonalizedTexts {
  innateTemperament: PersonalizedSection;
  lifestylePattern: PersonalizedSection;
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
}

// ─────────────────────────────────────────────
// 영어 번역 데이터베이스
// ─────────────────────────────────────────────
const STEM_EN_NAMES: Record<string, string> = {
  '甲': 'Gap Wood', '乙': 'Eul Wood', '丙': 'Byeong Fire', '丁': 'Jeong Fire', '戊': 'Mu Earth', '己': 'Gi Earth', '庚': 'Gyeong Metal', '辛': 'Sin Metal', '壬': 'Im Water', '癸': 'Gye Water'
};

const BRANCH_EN_NAMES: Record<string, string> = {
  '子': 'Ja Water', '丑': 'Chuk Earth', '寅': 'In Wood', '卯': 'Myo Wood', '辰': 'Jin Earth', '巳': 'Sa Fire', '午': 'Oh Fire', '未': 'Mi Earth', '申': 'Sin Metal', '酉': 'Yu Metal', '戌': 'Sul Earth', '亥': 'Hae Water'
};

const STEM_INFO_EN: Record<string, { coreIdentity: string, innateDesire: string, strengthInSociety: string, shadowSide: string }> = {
  '甲': {
    coreIdentity: "a giant tree stretching straight toward the sky, holding a pioneering instinct and unbending willpower in your DNA.",
    innateDesire: "You possess a strong drive to leave a unique mark on the world, with a hidden fear of being unrecognized or ignored.",
    strengthInSociety: "Your strength lies in offering clear direction, maintaining focus in chaos, and carrying out responsibilities single-handedly.",
    shadowSide: "Your stubbornness can make collaboration rigid, as you find it hard to compromise or accept other ways of doing things."
  },
  '乙': {
    coreIdentity: "a delicate ivy or wildflower climbing along others, holding a flexible survival instinct and natural coexisting charm.",
    innateDesire: "You desire to bloom safely within a stable environment, harboring a primal fear of being left alone in the wild.",
    strengthInSociety: "Your strength is your outstanding adaptability and sociability to blend in, drawing help from strong partners.",
    shadowSide: "You tend to overly compromise to fit in, sometimes losing track of your own desires and failing to take a clear stand."
  },
  '丙': {
    coreIdentity: "the brilliant sun in the sky, naturally sharing warmth and seeking to shine at the center of any stage.",
    innateDesire: "You have a strong desire to be noticed, appreciated, and recognized, feeling empty when the spotlight fades.",
    strengthInSociety: "Your warm charisma and sociability can instantly brighten up any atmosphere, serving as a valuable social asset.",
    shadowSide: "You feel anxious and empty when not in the spotlight, sometimes leading to over-expression or seeking attention."
  },
  '丁': {
    coreIdentity: "a flickering candle light, quietly illuminating the darkness for those closest to you with precision and sincerity.",
    innateDesire: "You yearn for sincere connections and deep understanding, often holding a quiet disappointment towards the busy world.",
    strengthInSociety: "Your sharp observation, sensitive intuition, and deep loyalty to those you care about create solid relationships.",
    shadowSide: "Your sensitive nature makes you easily hurt, and you tend to suppress emotions rather than speak out."
  },
  '戊': {
    coreIdentity: "a massive mountain, providing a heavy presence, steady stability, and broad tolerance to those around you.",
    innateDesire: "You desire to keep your place securely, harboring resistance to sudden changes or unverified concepts.",
    strengthInSociety: "Your reliable presence keeps relationships and organizations grounded, earning deep trust over time.",
    shadowSide: "Your resistance to change and attachment to old methods can delay your growth in a rapidly changing world."
  },
  '己': {
    coreIdentity: "fertile garden soil, naturally nurturing seeds with a strategic mindset that prepares thoroughly before action.",
    innateDesire: "You pursue practical results and inner substance over flashiness, fearing hollow success or unstable foundations.",
    strengthInSociety: "Your ability to quickly identify and utilize people's strengths, combined with a sharp sense of reality, is key.",
    shadowSide: "Your suspicious nature makes you slow to open up, and you might appear overly calculating or miss opportunities."
  },
  '庚': {
    coreIdentity: "hard steel or raw iron, guided by unyielding principles and clear standards, choosing logic over emotion.",
    innateDesire: "You want your standards to be respected, feeling highly uncomfortable with compromise, exceptions, or chaos.",
    strengthInSociety: "Your iron willpower and structured decision-making excel in organizing chaos and building efficient systems.",
    shadowSide: "Your bluntness and lack of emotional consideration can freeze relationships, and you struggle to admit mistakes."
  },
  '辛': {
    coreIdentity: "a refined gem or sharp needle, possessing precise, delicate senses and aiming for absolute perfection.",
    innateDesire: "You want to be recognized in your unique domain, rejecting mediocrity and always finding your distinct value.",
    strengthInSociety: "Your detail-oriented observation and high standards create unmatched professionalism and quality.",
    shadowSide: "Your high standards can exhaust both you and others, sometimes leading to self-criticism or hesitation to start."
  },
  '壬': {
    coreIdentity: "a grand river or ocean, containing a vast mind that constantly flows, adapts, and seeks new horizons.",
    innateDesire: "You yearn for freedom and endless expansion, showing resistance to boundaries, rules, or being boxed in.",
    strengthInSociety: "Your quick wit, high adaptability across fields, and strategic vision help you connect naturally with anyone.",
    shadowSide: "You may spread yourself too thin without completing tasks, and you keep true feelings hidden from deep commitments."
  },
  '癸': {
    coreIdentity: "clear morning dew or spring water, soft on the surface but seeping in with profound wisdom and sharp intuition.",
    innateDesire: "You seek deep truths and meaning in life, feeling empty with superficial interactions or mundane routines.",
    strengthInSociety: "Your sharp intuition to read people and detect hidden patterns quietly helps you adapt and gather information.",
    shadowSide: "You overanalyze and hesitate to make decisions, and keeping thoughts to yourself can create isolation."
  }
};

const BRANCH_INFO_EN: Record<string, { lifeEnvironment: string, behavioralTrigger: string, socialPattern: string, hiddenStruggle: string }> = {
  '子': {
    lifeEnvironment: "a quiet midnight setting, where you enjoy reflection and inner conversations away from external noise.",
    behavioralTrigger: "harboring a strong defense when your private space is invaded or trust is broken.",
    socialPattern: "preferring a small circle of deep relationships, slow to trust but deeply loyal once committed.",
    hiddenStruggle: "suppressing intense emotional waves inside while appearing calm on the outside, which can lead to isolation."
  },
  '丑': {
    lifeEnvironment: "frozen earth at winter's end, quietly concealing strong life forces that bloom after long patience.",
    behavioralTrigger: "feeling deep disappointment and frustration when your hard work goes unrecognized or unrewarded.",
    socialPattern: "silently carrying out your duties and preferring stable, practical connections over flashy ones.",
    hiddenStruggle: "accumulating unexpressed grievances inside, which may erupt unexpectedly under pressure."
  },
  '寅': {
    lifeEnvironment: "the vigorous energy of early dawn, filled with a desire to start, pioneer, and keep moving.",
    behavioralTrigger: "acting immediately upon new excitement, but feeling severe boredom with repetitive routines.",
    socialPattern: "thriving in relationships with influential leaders, naturally acting as the brave pioneer.",
    hiddenStruggle: "struggling to finish what you start, often leaving projects incomplete as your focus shifts."
  },
  '卯': {
    lifeEnvironment: "a spring flower garden, valuing your own space, delicate sensitivity, and unique pace.",
    behavioralTrigger: "reacting strongly when your personal values, aesthetic standards, or originality are ignored.",
    socialPattern: "sticking to your own world rather than conforming, but forming deep bonds with those who understand you.",
    hiddenStruggle: "appearing highly independent while harboring a deep desire to be understood by someone."
  },
  '辰': {
    lifeEnvironment: "a sleeping dragon's cave, quiet on the surface but concealing explosive potential and energy.",
    behavioralTrigger: "unleashing massive energy and focus when a critical opportunity or moment of proof arrives.",
    socialPattern: "showing strong presence in key moments and helping to organize chaotic situations.",
    hiddenStruggle: "handling too many possibilities at once, leading to internal distraction and lack of focus."
  },
  '巳': {
    lifeEnvironment: "a strategic snake observing in silence, moving precisely at the most beneficial moment.",
    behavioralTrigger: "moving actively when a clear advantage or opportunity arises, but ignoring meaningless requests.",
    socialPattern: "building selective relationships after evaluating the potential and values of others.",
    hiddenStruggle: "concealing your true feelings to avoid appearing calculating, making it hard for others to read you."
  },
  '午': {
    lifeEnvironment: "the burning midday sun, direct, honest, and unable to hide emotions or opinions.",
    behavioralTrigger: "reacting instantly to injustice or hypocrisy, especially when your core values are challenged.",
    socialPattern: "forming a wide network of friends, but having frequent clashes with those of different values.",
    hiddenStruggle: "riding intense emotional rollercoasters, which can make you appear unpredictable to others."
  },
  '未': {
    lifeEnvironment: "dry earth under the summer sun, focusing on inner substance and practical results over appearance.",
    behavioralTrigger: "participating actively when your worth is recognized or tangible results are in sight.",
    socialPattern: "valuing trust and practical help in relationships, building trust through deeds rather than words.",
    hiddenStruggle: "possessing a stubborn nature that makes it hard to accept new directions or others' methods."
  },
  '申': {
    lifeEnvironment: "a sharp sword, featuring a bright mind and quick analytical skills to find the best path.",
    behavioralTrigger: "striving to improve systems when facing technical challenges or inefficient methods.",
    socialPattern: "preferring competency-based networks, thriving in environments with talented peers.",
    hiddenStruggle: "suffering from impatience, making hasty decisions or rushing others who move slower."
  },
  '酉': {
    lifeEnvironment: "the tranquility of twilight, pursuing a refined personal world with strict standards.",
    behavioralTrigger: "reacting strongly when your aesthetic standards or professional judgment are questioned.",
    socialPattern: "slow to open up but building highly precise and deep connections that grow stronger over time.",
    hiddenStruggle: "letting your high standards exhaust you and others, sometimes creating a cycle of isolation."
  },
  '戌': {
    lifeEnvironment: "an evening field, holding deep reflection, strong principles, and immense loyalty.",
    behavioralTrigger: "defending fiercely when your values are challenged or those under your protection are threatened.",
    socialPattern: "maintaining relationships with unchanging loyalty, standing firmly by those you trust.",
    hiddenStruggle: "holding onto stubborness and old emotions, making forgiveness and letting go difficult."
  },
  '亥': {
    lifeEnvironment: "the deep sea, quiet on the surface but holding massive depth, intuition, and truth underneath.",
    behavioralTrigger: "diving head-on when your intuition triggers, but losing energy in artificial or calculating setups.",
    socialPattern: "reading people's energies instinctively, drawn to those with genuine sincerity.",
    hiddenStruggle: "absorbing others' emotions easily due to vague boundaries, struggling to separate your own feelings."
  }
};

const TG_POSITION_EFFECTS_EN: Record<string, { monthly: string, yearly: string }> = {
  '편관': {
    monthly: "constantly refines you in the form of social pressure and competition. While this tension makes you strong, it can build up chronic stress.",
    yearly: "brings strictness or challenges from your ancestral or early environment. Enduring early hardships has built your resilient character."
  },
  '정관': {
    monthly: "keeps your radar for social norms and honor active. You have a natural instinct to follow rules, which is the foundation of your trustworthiness.",
    yearly: "brings a family background that values honor and ethics. You find comfort in treading within structures and order."
  },
  '편재': {
    monthly: "serves as a direct channel for opportunities. You have strong practical drive and an outstanding ability to seize opportunities through networks.",
    yearly: "brings a practical and realistic mindset from your early environment. You learned early on to value results over abstract ideals."
  },
  '정재': {
    monthly: "diligently accumulates steady results through proven methods. Consistency and trust are your keys, valuing long-term stability over risk.",
    yearly: "brings values that emphasize security and reality from your family background, treading a steady path rather than a risky one."
  },
  '식신': {
    monthly: "creates an environment where your talents and creativity flow naturally. You find joy in refining your expertise and stable outputs.",
    yearly: "brings a relaxed and creative temperament from your early background, naturally enjoying life and expressing yourself in your own way."
  },
  '상관': {
    monthly: "fills you with a challenging spirit to break conventional boundaries and show your unique charm, driving you to shake things up.",
    yearly: "brings a free-spirited or rebellious nature from your early background, rejecting rigid constraints and seeking your own path."
  },
  '편인': {
    monthly: "positions deep, philosophical contemplation at the center. Your strength is your unique intuition to see hidden patterns and non-mainstream ideas.",
    yearly: "brings a unique, unconventional worldview from your early environment, showing interest in topics different from your peers."
  },
  '정인': {
    monthly: "creates a structure where you gain stability and energy from learning, drawing academic authority and excellent mentors.",
    yearly: "brings a family background that highly values education and wisdom, fostering your growth in a supportive early setup."
  },
  '비견': {
    monthly: "positions a strong ego and independence. You grow through competition and collaborations, experiencing both synergy and friction with peers.",
    yearly: "brings self-reliance and strong individuality from your early environment, standing out as independent from a young age."
  },
  '겁재': {
    monthly: "brings intense competitive drive and active momentum, giving you the grit to never give up, alongside risks of impulsive choices.",
    yearly: "brings a strong survival instinct from your early environment, learning to fight and adapt in competitive situations early on."
  }
};

const TEN_GOD_EN_NAMES: Record<string, string> = {
  '비견': 'Mirror',
  '겁재': 'Rival',
  '식신': 'Artist',
  '상관': 'Rebel',
  '편재': 'Maverick',
  '정재': 'Architect',
  '편관': 'Warrior',
  '정관': 'Judge',
  '편인': 'Mystic',
  '정인': 'Sage',
  '비겁': 'Companion',
  '식상': 'Creator',
  '재성': 'Wealth',
  '관성': 'Officer',
  '인성': 'Resource'
};

const REAL_WORLD_DESC_EN: Record<string, string> = {
  GWAN_DA_SHIN_YAK: `**"I must act responsibly"** — this voice echoes inside you dozens of times a day.\nYou tend to jump into action before even questioning if a task is yours to carry. While others see you as highly reliable, this trust can quickly drain your energy.\n**A repeating cycle of failing to say no, taking on sole responsibility, and eventually burning out** is your key pattern.`,
  JAE_DA_SHIN_YAK: `**Countless opportunities are visible at once** — this is your natural sense.\nHowever, you tend to jump to the next opportunity before fully completing the previous one, dispersing your energy in many directions.\n**Only when you utilize partnerships and delegate roles** can your vast ideas materialize into actual wealth and success.`,
  SIKSANG_GWADA: `**Your expressive energy flows out unstoppably.**\nYou excel at blunt honesty and speaking truths that others find uncomfortable. While this works positively for creative planning and persuasion, it can create friction if left unrefined.\n**Refining the timing and tone of your expression** is your key lesson to let your energy shine.`,
  INSEONG_GWADA: `**You always ask "Why?" first** — this is your contemplative nature.\nWithout a complete understanding, you find it hard to take action. While your depth of knowledge is outstanding, you risk missing timings by waiting for perfect preparation.\n**Combining your deep strategy with rapid execution** will unleash your ultimate potential in reality.`,
  BIGYEOP_GWADA: `**You stay quiet until provoked, but once crossed, you explode.**\nYou silently focus on your work, but your defensive energy erupts the moment your principles or self-esteem are threatened. You dislike interference and absolutely prefer self-reliance.\n**This independent energy builds your path to success**, though it can sometimes push away helpful helpers.`,
  BALANCED: `**Keeping balance in any extreme situation** — this is your core strength.\nYou stay calm in conflicts, earning trust as a natural mediator who understands both sides.\n**However, by prioritizing harmony too much**, you might put your own desires and goals on the back burner.`
};

const realWorldDescMap: Record<string, string> = {
  GWAN_DA_SHIN_YAK: `**"내가 책임져야 해"** — 하루에도 수십 번씩 이 말이 내면에서 울립니다.\n의심하기도 전에 먼저 몸을 던지며, 이 책임감이 당신을 믿음직하게 만들지만 동시에 피로를 유발합니다.\n**거절하지 못하고 독박 책임을 지며 결국 번아웃되는 순환**이 주요 현실 패턴입니다.`,
  JAE_DA_SHIN_YAK: `**수많은 기회가 한눈에 보인다** — 이것이 당신의 직감입니다.\n하지만 결과를 완성하기도 전에 또 다른 기회로 관심을 돌려 에너지가 분산되기 쉽습니다.\n**동료와 역할을 분담하고 협력할 때** 비로소 거대한 아이디어가 실재하는 재물과 성과로 실현됩니다.`,
  SIKSANG_GWADA: `**당신의 표현하고 표출하는 에너지가 거침없이 흘러나옵니다.**\n솔직하고 직설적인 조언이나 남들이 꺼리는 팩트를 과감히 찌르는 강점이 있습니다. 창의적 기획이나 설득력에는 강점이지만 정제되지 않으면 구설을 만들기 쉽습니다.\n**표현의 타이밍과 강도를 조절하는 것**이 에너지를 가치 있게 만드는 핵심 레슨입니다.`,
  INSEONG_GWADA: `**항상 "왜?"라는 의문을 먼저 던집니다** — 깊은 사색가 기질입니다.\n완벽한 이해와 납득이 없으면 행동을 개시하기 어려워합니다. 사물과 사람을 읽는 깊이는 탁월하나 완벽한 준비를 기다리다 타이밍을 놓칠 우려가 있습니다.\n**깊은 생각에 즉각적인 실행력을 더할 때** 현실에서 폭발적인 에너지가 발동됩니다.`,
  BIGYEOP_GWADA: `**평소에는 잠잠하지만 자존심을 건드리면 폭발합니다.**\n묵묵하게 자기 일을 해내다가도 자신의 원칙이나 개성이 침해받는 순간 강한 방어 기제를 보입니다. 간섭을 싫어하고 혼자 결정하여 밀고 나가는 주체성이 강합니다.\n**이 독고다이 에너지가 인생의 강력한 돌파구를 열어주지만**, 귀인의 도움을 밀어내는 요인이 되기도 합니다.`,
  BALANCED: `**어떤 극단적인 상황에서도 중심을 잡는다** — 이것이 당신의 핵심 능력입니다.\n갈등 상황에서 의외로 차분한 모습을 보여 주변의 신뢰를 얻으며, 양쪽 입장을 모두 이해하고 중재하는 역할을 자연스럽게 맡습니다.\n**다만 지나치게 조화를 중시하다 보면** 정작 자신의 진짜 욕구와 목표를 후순위로 미루는 함정에 빠질 수 있습니다.`
};

const SIGNATURE_PATTERN_TITLES_EN: Record<string, Record<string, string>> = {
  GWAN_DA_SHIN_YAK: {
    '甲': "Invisible Armor — Self-imprisonment under the name of responsibility",
    '乙': "Clinging Ivy — Unyielding persistence amid relational pressure",
    '丙': "Needing to Shine with Low Energy — Burnout between duty and expression",
    '丁': "Candle in the Wind — An unquenchable flame despite being hurt",
    '戊': "Why the Mountain is Heavy — The solitude of carrying everything alone",
    '己': "Doing Everything Behind the Scenes — The weight of unappreciated devotion",
    '庚': "Why the Iron Wall was Built — Defensive instincts growing harder under pressure",
    '辛': "Scars Behind Perfection — The paradox of crumbling due to high standards",
    '壬': "Deep Water Blocking the River — Inner pressure accumulating in silence",
    '癸': "How Dew Endures — Seeping in and wearing out silently without a sound",
  },
  JAE_DA_SHIN_YAK: {
    '甲': "The Tree Seeks to Grow Tall, but Roots cannot Hold — Overloaded growth desire",
    '乙': "Reaching for Opportunities, but the Body cannot Follow — Between dependence and independence",
    '丙': "Too Much Light Creates Shadows — Overflowing desire and energy depletion",
    '丁': "Placing Too Heavy a Load on a Small Fire — Overload due to excessive expectations",
    '戊': "Too Much Weight Causes a Landslide — Clashes between spreading thin and coping",
    '己': "Between Greed and Reality — The paradox of wealth slipping away when grasped",
    '庚': "Hands Cut Trying to Grasp Everything Sharply — The boomerang of goal overload",
    '辛': "Things Lost trying to be a Perfect Gem — The link between high standards and burnout",
    '壬': "When the Ocean Tries to Contain Everything — The dilemma of expansion vs substance",
    '癸': "Risk of Vanishing by Absorbing Everything — Depletion of desires and self",
  },
  SIKSANG_GWADA: {
    '甲': "Speaking Straight Wood — Unbending expression sometimes breaking your own branches",
    '乙': "Erupting when Suppressed — Between soft appearance and explosive expression instinct",
    '丙': "The Sun cannot Hide its Light — Excessive expression sometimes burning others",
    '丁': "Small Fire trying to Illuminate Everywhere — Clash of delicate sensitivity and blunt expression",
    '戊': "When the Mountain Speaks — The drop between usual silence and explosive remarks",
    '己': "Accumulated Words Erupting at Once — Gap between calculated expression and emotional outburst",
    '庚': "Sharp Blade and Sharp Tongue — The boomerang of blunt fact-bombing",
    '辛': "Two Faces of the Perfect Critic — Accurate but sometimes hurtful words",
    '壬': "Words Flowing like Water Everywhere — Between freedom of expression and ripple control",
    '癸': "Words Seeping in like Dew — Soft but sharp expressions piercing the core",
  },
  INSEONG_GWADA: {
    '甲': "Too Dense a Forest of Thoughts — Having directions but failing to start",
    '乙': "When vines of worry wrap around you — The boundary where flexibility becomes indecision",
    '丙': "Seeking to Shine but Held back by Thoughts — A thinker living inside an action-oriented soul",
    '丁': "Burning like a Candle but Snuffed by Thoughts — Endless inner debate of emotion and logic",
    '戊': "The Mountain Pondering Deeply — Unyielding stubbornness refusing to move until decided",
    '己': "Moving Only after Analyzing Everything — The dilemma of perfect prep and missed timings",
    '庚': "Sword Seeking Exit in a Maze of Logic — The paradox of deep thoughts blocking action",
    '辛': "The World Passes by while Seeking the Perfect Answer — Silence during the wait",
    '壬': "Pondering Deeply like the Ocean — Missing the timing to float along the flow",
    '癸': "Why the Deepest Thinker Speaks Last — The quiet pain of analysis paralysis",
  },
  BIGYEOP_GWADA: {
    '甲': "Explosive Power in Silence — The unyielding energy of Gap-wood before provocation",
    '乙': "Steel Will behind a Soft Exterior — Resilience to find a new path when ivy breaks",
    '丙': "The Sun's Stubbornness to Shine for All — Strong self-esteem of needing no help",
    '丁': "Unquenchable Stubbornness of Candlelight — Small but never compromising your light",
    '戊': "Unmoving Mountain's Resistance — Heavy resistance growing stronger when pushed",
    '己': "Quiet but Never Bending — Soft outside but zero compromise inside",
    '庚': "No Compromise even if Steel Breaks — The lone wolf spirit of Gyeong-metal",
    '辛': "The Solitude of a Perfectionist — Choosing never to lower your standards",
    '壬': "The River never Changes Path when Meeting Mountains — The flowing independence of Im-water",
    '癸': "Dew Shines with its Own Light — Gye-water's quiet declaration of independence",
  },
  BALANCED: {
    '甲': "Tree Flowing with the Seasons — Principled yet flexible moderation",
    '乙': "Vines with Roots even in the Wind — Balanced adaptability of Eul-wood",
    '丙': "Sunlight Shining Evenly on All — Fair and warm balance of Byeong-fire",
    '丁': "Candle Adjusting Brightness to the Wind — Delicate balance of Jeong-fire",
    '戊': "Big Mountain Embracing Four Seasons — Heavy centering force of Mu-earth",
    '己': "Earth Nurturing Everything Evenly — Harmonious embrace of Gi-earth",
    '庚': "A Refined Sword is not Drawn Rashly — Restrained balance of Gyeong-metal",
    '辛': "Gem Reflecting Light Evenly — Exquisite balance of Sin-metal",
    '壬': "River Containing All but never Overflowing — Flexible moderation of Im-water",
    '癸': "Dew Seeping Evenly into the Earth — Quiet and balanced seeping of Gye-water",
  }
};

// ─────────────────────────────────────────────
// 헬퍼 및 사주 연산 데이터베이스
// ─────────────────────────────────────────────
const STEM_INFO_LOCAL: Record<string, { element: string, polarity: number }> = {
  '甲': { element: 'Wood', polarity: 1 }, '乙': { element: 'Wood', polarity: -1 },
  '丙': { element: 'Fire', polarity: 1 }, '丁': { element: 'Fire', polarity: -1 },
  '戊': { element: 'Earth', polarity: 1 }, '己': { element: 'Earth', polarity: -1 },
  '庚': { element: 'Metal', polarity: 1 }, '辛': { element: 'Metal', polarity: -1 },
  '壬': { element: 'Water', polarity: 1 }, '癸': { element: 'Water', polarity: -1 }
};

const BRANCH_INFO_LOCAL: Record<string, { element: string, polarity: number }> = {
  '子': { element: 'Water', polarity: 1 }, '丑': { element: 'Earth', polarity: -1 },
  '寅': { element: 'Wood', polarity: 1 }, '卯': { element: 'Wood', polarity: -1 },
  '辰': { element: 'Earth', polarity: 1 }, '巳': { element: 'Fire', polarity: 1 },
  '午': { element: 'Fire', polarity: -1 }, '未': { element: 'Earth', polarity: -1 },
  '申': { element: 'Metal', polarity: 1 }, '酉': { element: 'Metal', polarity: -1 },
  '戌': { element: 'Earth', polarity: 1 }, '亥': { element: 'Water', polarity: 1 }
};

const ELEMENTS_LOCAL = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

const BRANCH_MAIN_QI: Record<string, string> = {
  '子': '癸', '丑': '己', '寅': '甲', '卯': '乙', '辰': '戊', '巳': '丙', '午': '丁', '未': '己', '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬'
};

export interface TraitScore {
  key: string;
  name: string;
  score: number;
}

// 십성 연산 헬퍼
function computeTenGodLocal(dayGan: string, targetChar: string, isStem: boolean): string {
  const self = STEM_INFO_LOCAL[dayGan] || { element: 'Earth', polarity: 1 };
  const target = isStem 
    ? (STEM_INFO_LOCAL[targetChar] || { element: 'Earth', polarity: 1 })
    : (BRANCH_INFO_LOCAL[targetChar] || { element: 'Earth', polarity: 1 });

  const sIdx = ELEMENTS_LOCAL.indexOf(self.element);
  const tIdx = ELEMENTS_LOCAL.indexOf(target.element);
  if (sIdx === -1 || tIdx === -1) return '비견';
  
  const diff = (tIdx - sIdx + 5) % 5;
  const samePolarity = self.polarity === target.polarity;

  if (diff === 0) return samePolarity ? '비견' : '겁재';
  if (diff === 1) return samePolarity ? '식신' : '상관';
  if (diff === 2) return samePolarity ? '편재' : '정재';
  if (diff === 3) return samePolarity ? '편관' : '정관';
  if (diff === 4) return samePolarity ? '편인' : '정인';
  return '비견';
}

// 오행 도미넌트 계산
function dominantElement(elements: (string | undefined)[]): string {
  const freq: Record<string, number> = {};
  elements.filter(Boolean).forEach(e => {
    if (e) freq[e] = (freq[e] || 0) + 1;
  });
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Earth';
}

// 지지합 체크 헬퍼
function isHapPair(b1: string, b2: string): boolean {
  if (!b1 || !b2) return false;
  const p1 = b1 < b2 ? `${b1}${b2}` : `${b2}${b1}`;
  const yukHaps = ['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'];
  if (yukHaps.includes(p1)) return true;
  
  const samHaps = [
    '亥卯', '卯未', '亥未',
    '寅午', '午戌', '寅戌',
    '巳酉', '酉丑', '巳丑',
    '申子', '子辰', '申辰'
  ];
  if (samHaps.includes(p1)) return true;
  return false;
}

// 지지 충형파 검출
function hasChungHyeongPah(branches: string[]): boolean {
  const chungs = [['子','午'], ['丑','未'], ['寅','申'], ['卯','酉'], ['辰','戌'], ['巳','亥']];
  for (const pair of chungs) {
    if (branches.includes(pair[0]) && branches.includes(pair[1])) return true;
  }

  const hyeongs = [['寅','巳'], ['巳','申'], ['申','寅'], ['丑','戌'], ['戌','未'], ['未','丑'], ['子','卯']];
  for (const pair of hyeongs) {
    if (branches.includes(pair[0]) && branches.includes(pair[1])) return true;
  }
  
  const counts: Record<string, number> = {};
  branches.forEach(b => { counts[b] = (counts[b] || 0) + 1; });
  if (['辰', '午', '酉', '亥'].some(b => counts[b] >= 2)) return true;

  const pahs = [['子','酉'], ['丑','辰'], ['寅','亥'], ['卯','오'], ['巳','申'], ['未','戌']];
  for (const pair of pahs) {
    if (branches.includes(pair[0]) && branches.includes(pair[1])) return true;
  }

  return false;
}

// 1순위: 삼합/방합 투간
function findHapNetwork(
  stems: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[],
  branches: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[]
) {
  const branchVals = branches.map(b => b.val);
  const stemVals = stems.map(s => s.val);

  const combinations = [
    { name: '해묘미 삼합', type: 'Wood', req: ['亥', '卯', '未'], stems: ['甲', '乙'], koName: '해묘미(亥卯未) 목(木) 삼합', enName: 'Hae-Myo-Mi Wood Triple Union' },
    { name: '인오술 삼합', type: 'Fire', req: ['寅', '午', '戌'], stems: ['丙', '丁'], koName: '인오술(寅午戌) 화(火) 삼합', enName: 'In-Oh-Sul Fire Triple Union' },
    { name: '사유축 삼합', type: 'Metal', req: ['巳', '酉', '丑'], stems: ['庚', '辛'], koName: '사유축(巳酉丑) 금(金) 삼합', enName: 'Sa-Yu-Chuk Metal Triple Union' },
    { name: '신자진 삼합', type: 'Water', req: ['申', '子', '辰'], stems: ['壬', '癸'], koName: '신자진(申子辰) 수(水) 삼합', enName: 'Sin-Ja-Jin Water Triple Union' },
    
    { name: '인묘진 방합', type: 'Wood', req: ['寅', '卯', '辰'], stems: ['甲', '乙'], koName: '인묘진(寅卯辰) 목(木) 방합', enName: 'In-Myo-Jin Wood Directional Union' },
    { name: '사오미 방합', type: 'Fire', req: ['巳', '午', '未'], stems: ['丙', '丁'], koName: '사오미(巳오未) 화(火) 방합', enName: 'Sa-Oh-Mi Fire Directional Union' },
    { name: '신유술 방합', type: 'Metal', req: ['申', '酉', '戌'], stems: ['庚', '辛'], koName: '신유술(申酉戌) 금(金) 방합', enName: 'Sin-Yu-Sul Metal Directional Union' },
    { name: '해자축 방합', type: 'Water', req: ['亥', '子', '丑'], stems: ['壬', '癸'], koName: '해자축(亥자축) 수(水) 방합', enName: 'Hae-Ja-Chuk Water Directional Union' },
  ];

  for (const comb of combinations) {
    const hasAllBranches = comb.req.every(r => branchVals.includes(r));
    const hasTugwan = comb.stems.some(s => stemVals.includes(s));

    if (hasAllBranches && hasTugwan) {
      const keyPillars: { pillarTitle: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch' }[] = [];
      stems.forEach(s => {
        if (comb.stems.includes(s.val)) keyPillars.push({ pillarTitle: s.title, type: 'stem' });
      });
      branches.forEach(b => {
        if (comb.req.includes(b.val)) keyPillars.push({ pillarTitle: b.title, type: 'branch' });
      });
      return { matched: true, type: comb.type, koName: comb.koName, enName: comb.enName, keyPillars };
    }
  }
  return null;
}

// 2순위: 특정 성분 도배 (3개 이상)
function findOverloadedTenGods(
  dayStem: string,
  stems: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[],
  branches: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[]
) {
  const allChars: { title: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch'; char: string; element: string; tenGodGroup: string }[] = [];
  
  stems.forEach(s => {
    const el = STEM_INFO_LOCAL[s.val]?.element || 'Earth';
    const tg = s.title === 'Day' ? 'Self' : computeTenGodLocal(dayStem, s.val, true);
    let tgGroup = '비겁';
    if (tg === '식신' || tg === '상관') tgGroup = '식상';
    else if (tg === '편재' || tg === '정재') tgGroup = '재성';
    else if (tg === '편관' || tg === '정관') tgGroup = '관성';
    else if (tg === '편인' || tg === '정인') tgGroup = '인성';
    
    allChars.push({ title: s.title, type: 'stem', char: s.val, element: el, tenGodGroup: s.title === 'Day' ? '비겁' : tgGroup });
  });

  branches.forEach(b => {
    const el = BRANCH_INFO_LOCAL[b.val]?.element || 'Earth';
    const tg = computeTenGodLocal(dayStem, b.val, false);
    let tgGroup = '비겁';
    if (tg === '식신' || tg === '상관') tgGroup = '식상';
    else if (tg === '편재' || tg === '정재') tgGroup = '재성';
    else if (tg === '편관' || tg === '정관') tgGroup = '관성';
    else if (tg === '편인' || tg === '정인') tgGroup = '인성';

    allChars.push({ title: b.title, type: 'branch', char: b.val, element: el, tenGodGroup: tgGroup });
  });

  const elCounts: Record<string, number> = {};
  allChars.forEach(c => { elCounts[c.element] = (elCounts[c.element] || 0) + 1; });

  const tgCounts: Record<string, number> = {};
  allChars.forEach(c => { tgCounts[c.tenGodGroup] = (tgCounts[c.tenGodGroup] || 0) + 1; });

  const maxTg = Object.entries(tgCounts).filter(([_, count]) => count >= 3).sort((a, b) => b[1] - a[1])[0];
  const maxEl = Object.entries(elCounts).filter(([_, count]) => count >= 3).sort((a, b) => b[1] - a[1])[0];

  const EN_GROUPS: Record<string, string> = { '비겁': 'Companion (Bi-Gyeop)', '식상': 'Creator (Sik-Sang)', '재성': 'Wealth (Jae-Seong)', '관성': 'Officer (Gwan-Seong)', '인성': 'Resource (In-Seong)' };
  const EN_ELEMENTS: Record<string, string> = { 'Wood': 'Wood', 'Fire': 'Fire', 'Earth': 'Earth', 'Metal': 'Metal', 'Water': 'Water' };
  const KO_ELEMENTS: Record<string, string> = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)' };

  if (maxTg && maxTg[1] >= 3) {
    const keyPillars = allChars.filter(c => c.tenGodGroup === maxTg[0]).map(c => ({ pillarTitle: c.title, type: c.type }));
    return { matched: true, type: 'TenGod', nameKo: maxTg[0], nameEn: EN_GROUPS[maxTg[0]] || maxTg[0], keyPillars };
  } else if (maxEl && maxEl[1] >= 3) {
    const keyPillars = allChars.filter(c => c.element === maxEl[0]).map(c => ({ pillarTitle: c.title, type: c.type }));
    return { matched: true, type: 'Element', nameKo: KO_ELEMENTS[maxEl[0]] || maxEl[0], nameEn: EN_ELEMENTS[maxEl[0]] || maxEl[0], keyPillars };
  }
  return null;
}

// 3순위: 비겁의 뿌리 (2개 이상)
function findSiblingRoots(
  dayStem: string,
  branches: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[]
) {
  const dmElement = STEM_INFO_LOCAL[dayStem]?.element || '';
  const matchingBranches = branches.filter(b => {
    const el = BRANCH_INFO_LOCAL[b.val]?.element || '';
    return el === dmElement;
  });

  if (matchingBranches.length >= 2) {
    const keyPillars = matchingBranches.map(b => ({ pillarTitle: b.title, type: 'branch' as const }));
    return { matched: true, keyPillars };
  }
  return null;
}

// ─────────────────────────────────────────────
// 잠재력 강점 상세 매핑 헬퍼
// ─────────────────────────────────────────────
function getTraitDetailText(key: string, score: number, lang: string = 'KO'): string {
  const isKO = lang === 'KO';
  
  if (key === 'creativity') {
    if (score >= 75) {
      return isKO 
        ? `**창의력(${score}점)**이 매우 높아 기존의 방식을 깨고 세상에 없던 독창적인 아이디어와 가치를 창조해내는 데 탁월한 두각을 드러내며`
        : `with **Creativity (${score})** being exceptionally high, allowing you to break conventional molds and pioneer original ideas;`;
    } else if (score >= 40) {
      return isKO
        ? `**창의력(${score}점)**이 양호하여 기존의 방식들을 영리하게 재조합하고 실무에서 즉시 활용할 수 있는 현실적인 아이디어를 응용하는 능력이 있고`
        : `with **Creativity (${score})** being balanced, enabling you to combine existing templates into practical applications;`;
    } else {
      return isKO
        ? `**창의력(${score}점)**이 담담하여 허황된 상상보다는 이미 검증되어 있는 탄탄한 매뉴얼과 성공 규칙을 충실히 실행하는 안정을 택하며`
        : `with **Creativity (${score})** being low, preferring to follow structured rules and proven manuals over speculative changes;`;
    }
  }
  
  if (key === 'expressiveness') {
    if (score >= 75) {
      return isKO
        ? `**표현력(${score}점)**이 매우 강력하여 글, 말, 혹은 감정적 호소력을 동원해 자신의 생각을 상대의 머릿속에 선명하게 각인시키는 설득력이 비범하고`
        : `with **Expressiveness (${score})** being very strong, giving you the ability to vividly project and print your thoughts into others' minds;`;
    } else if (score >= 40) {
      return isKO
        ? `**표현력(${score}점)**이 적절하여 과장이나 허세 없이 필요한 내용을 조리 있고 명확하게 상대방에게 오해 없이 전달하는 실무형 소통이 훌륭하며`
        : `with **Expressiveness (${score})** being decent, enabling clear and constructive communication without unnecessary exaggeration;`;
    } else {
      return isKO
        ? `**표현력(${score}점)**이 묵직하여 겉으로 화려하게 자기를 드러내기보다 침묵과 진지한 실천으로 결과 자체를 묵묵히 증명해내며`
        : `with **Expressiveness (${score})** being low, choosing to remain quiet and prove your worth through silent execution rather than words;`;
    }
  }

  if (key === 'leadership') {
    if (score >= 75) {
      return isKO
        ? `**리더십(${score}점)**이 매우 높아 스스로 책임감 있게 무대의 전면에 나서서 집단과 조직이 나아갈 큰 그림을 제시하고 진두지휘하는 데 타고난 카리스마를 발휘하며`
        : `with **Leadership (${score})** being very high, allowing you to take charge and steer organizations with visionary charisma;`;
    } else if (score >= 40) {
      return isKO
        ? `**리더십(${score}점)**이 완만하여 권위적으로 지배하기보다는 수평적이고 민주적인 소통으로 팀원들의 잠재력을 끌어내는 뒤편의 중재자 역할을 잘 해내고`
        : `with **Leadership (${score})** being moderate, leading not by authority but through cooperative orchestration of team members;`;
    } else {
      return isKO
        ? `**리더십(${score}점)**이 낮아 전면에 나서는 책임 부담보다는 실무 전문가로서 나만의 영역을 온전히 구축하고 임무를 수행하는 데 더 편안함을 느끼며`
        : `with **Leadership (${score})** being low, feeling more at ease performing as a specialist rather than carrying the burden of leading others;`;
    }
  }

  if (key === 'decisionMaking') {
    if (score >= 75) {
      return isKO
        ? `**결단력(${score}점)**이 아주 높아 어떤 불확실한 위기나 리스크 속에서도 주저함 없이 신속하게 핵심을 파고들어 단호한 실행을 돌파하고`
        : `with **Decision Making (${score})** being very high, enabling swift, bold choices and immediate execution under pressure;`;
    } else if (score >= 40) {
      return isKO
        ? `**결단력(${score}점)**이 합리적이어서 정보와 데이터를 충분히 검토하고 비교 분석하여 가장 안전하고 확실한 대안을 선택하는 데 탁월하고`
        : `with **Decision Making (${score})** being sensible, carefully balancing options and data before choosing the safest route;`;
    } else {
      return isKO
        ? `**결단력(${score}점)**이 신중하여 때로 결정 장애나 우유부단함을 겪을 수 있으나 실수와 실패 리스크를 극소화하는 돌다리 두드리기 강점이 돋보이고`
        : `with **Decision Making (${score})** being overly cautious, minimizing risks of failure by double-checking all variables;`;
    }
  }

  if (key === 'mental') {
    if (score >= 75) {
      return isKO
        ? `**멘탈(${score}점)**이 대단히 강건하여 혹독한 외부의 압박이나 갈등이 밀려와도 감정적으로 굴복하지 않고 내면의 평정심과 냉철함을 지키는 회복탄력성이 넘치며`
        : `with **Mental Strength (${score})** being extremely robust, granting high resilience to withstand external pressure without losing focus;`;
    } else if (score >= 40) {
      return isKO
        ? `**멘탈(${score}점)**이 평이하여 보편적인 환경에서는 안정감을 가지나 스트레스 수치가 한계에 달할 때는 나만의 휴식과 심리적 정화가 요구되고`
        : `with **Mental Strength (${score})** being average, staying stable under normal situations but requiring proper reset cycles when highly stressed;`;
    } else {
      return isKO
        ? `**멘탈(${score}점)**이 매우 섬세하여 환경의 미세한 변화나 타인의 시선에 민감하게 반응하므로 평정심을 지켜줄 든든한 지지층과 루틴을 필요로 하고`
        : `with **Mental Strength (${score})** being sensitive, making you vulnerable to external opinions and requiring protective boundaries;`;
    }
  }

  if (key === 'responsibility') {
    if (score >= 75) {
      return isKO
        ? `**책임감(${score}점)**이 완벽에 가까워 자기 영역의 성과나 약속을 타협 없이 지켜내며, 아무리 고단해도 조직과 약자를 위해 끝까지 헌신해내는 신뢰를 주며`
        : `with **Responsibility (${score})** being absolute, ensuring you fulfill your commitments to the end, earning deep respect for your integrity;`;
    } else if (score >= 40) {
      return isKO
        ? `**책임감(${score}점)**이 성실하여 나에게 할당된 직무는 꼼꼼히 소화하되 나의 일상과 건강도 소중히 지키는 스마트한 라이프 밸런스를 발휘하며`
        : `with **Responsibility (${score})** being diligent, performing your assigned duties reliably while maintaining a healthy personal boundaries;`;
    } else {
      return isKO
        ? `**책임감(${score}점)**이 유연하여 스스로 모든 짐을 짊어지려 애쓰기보다 적절한 타이밍에 주위에 도움을 요청하고 역할을 지혜롭게 분배할 줄 알며`
        : `with **Responsibility (${score})** being flexible, knowing when to delegate and share the load rather than burning out from carrying it alone;`;
    }
  }

  if (key === 'fightingSpirit') {
    if (score >= 75) {
      return isKO
        ? `**승부욕(${score}점)**이 뜨겁게 타올라 어려운 장벽이나 라이벌이 나타날 때 강한 투지를 불태우며 목표를 쟁취해내는 승부사 마인드가 강하고`
        : `with **Competitive Drive (${score})** being intense, igniting a powerful fighting spirit and drive to win when facing obstacles or rivals;`;
    } else if (score >= 40) {
      return isKO
        ? `**승부욕(${score}점)**이 적절하여 굳이 남을 밟고 올라서기보다 어제의 나 자신을 극복하려는 평화적이며 건강한 성장에 초점을 맞추며`
        : `with **Competitive Drive (${score})** being healthy, focusing on personal growth and self-improvement rather than fighting others;`;
    } else {
      return isKO
        ? `**승부욕(${score}점)**이 완만하여 대립과 소모적 경쟁을 지양하고 다 함께 시너지를 낼 수 있는 따뜻한 연대와 타협을 지향하며`
        : `with **Competitive Drive (${score})** being low, prioritizing collaboration and mutual alignment over exhausting rivalry;`;
    }
  }

  if (key === 'nobleSupport') {
    if (score >= 75) {
      return isKO
        ? `**귀인복(${score}점)**이 대단히 훌륭하여 인생의 결정적 위기마다 생각지 못한 스승, 파트너, 혹은 조력자가 나타나 구원의 물꼬를 트여주는 혜택을 누리며`
        : `with **Benefactor Luck (${score})** being exceptional, ensuring supportive mentors, patrons, or opportunities emerge to guide you through crises;`;
    } else if (score >= 40) {
      return isKO
        ? `**귀인복(${score}점)**이 원만하여 본인의 성실하고 예의 바른 태도를 통해 서서히 믿음직한 인맥과 동료들의 소중한 지지를 획득해내며`
        : `with **Benefactor Luck (${score})** being decent, gradually earning valuable support and trust through your polite and honest interactions;`;
    } else {
      return isKO
        ? `**귀인복(${score}점)**에 의지하기보다 오직 내 실력과 의지로 삶의 개척길을 열어가야 하니 강인한 자수성가형 독립 정신을 입증하며`
        : `with **Benefactor Luck (${score})** being low, prompting you to build success strictly on your own merits, proving a self-made resilience;`;
    }
  }

  if (key === 'peopleReading') {
    if (score >= 75) {
      return isKO
        ? `**사람보는 눈(${score}점)**이 극도로 예리하여 스쳐 지나가는 대화나 눈빛만으로도 상대방의 숨겨진 장단점과 속내를 꿰뚫어보는 초감각적 인간 통찰을 가졌으며`
        : `with **Insight into People (${score})** being extremely sharp, allowing you to read hidden motives and traits through microscopic cues;`;
    } else if (score >= 40) {
      return isKO
        ? `**사람보는 눈(${score}점)**이 균형을 이루어 열린 태도로 사람들과 소통하면서도 상식을 바탕으로 객관적인 신용도를 합리적으로 검증해내는 안목이 있고`
        : `with **Insight into People (${score})** being pragmatic, communicating openly while maintaining logical filters to assess trustworthiness;`;
    } else {
      return isKO
        ? `**사람보는 눈(${score}점)**이 소박하여 남들을 지나치게 긍정적으로 믿다가 상처를 받을 수 있으니 계약이나 금전 동업 시 철저한 팩트 체크가 필요하며`
        : `with **Insight into People (${score})** being low, cautioning you to rely on written contracts and facts rather than blind assumptions;`;
    }
  }

  if (key === 'sensitivity') {
    if (score >= 75) {
      return isKO
        ? `**감수성(${score}점)**이 깊어 예술적 정서, 타인의 마음 상처에 공감하는 온기를 품고 있어 다른 이들이 포착하지 못하는 미세한 뉘앙스를 섬세히 만져줄 수 있고`
        : `with **Sensitivity (${score})** being deep, gifting you a rich artistic sense and emotional empathy to connect with hidden nuances;`;
    } else if (score >= 40) {
      return isKO
        ? `**감수성(${score}점)**이 건강하여 상대방의 아픔을 공감해주면서도 감정에 매몰되지 않는 냉철한 균형 감각을 현명하게 이끌어내며`
        : `with **Sensitivity (${score})** being balanced, offering warm empathy without letting emotions cloud your logical judgment;`;
    } else {
      return isKO
        ? `**감수성(${score}점)**이 담백하여 불필요한 감정 소모를 배제하고 객관적인 팩트와 수치, 현실적인 결과 중심의 냉철한 이성을 중시하며`
        : `with **Sensitivity (${score})** being low, keeping interactions objective and focusing strictly on practical facts and results;`;
    }
  }

  if (key === 'independence') {
    if (score >= 75) {
      return isKO
        ? `**독립심(${score}점)**이 우뚝 서 있어 타인의 잔소리나 지시를 극도로 기피하며, 모든 중요한 행보는 주체적으로 설계하고 책임질 때 깊은 주권 행복을 얻고`
        : `with **Independence (${score})** being very high, refusing subordinate constraints and thriving best when commanding your own path;`;
    } else if (score >= 40) {
      return isKO
        ? `**독립심(${score}점)**이 성숙하여 내 주관을 뚜렷이 수호하되 타인의 합당한 비판이나 조언은 겸허히 융합할 수 있는 유연한 에고를 가지고 있고`
        : `with **Independence (${score})** being balanced, maintaining your values while constructively integrating others' feedback;`;
    } else {
      return isKO
        ? `**독립심(${score}점)**이 낮아 혼자 고립되는 것보다 거대한 기업의 인프라, 든든한 멘토, 혹은 시스템의 조력을 결합할 때 안정과 성장이 극대화되고`
        : `with **Independence (${score})** being low, thriving best when leaning on robust systems, partners, or corporate infrastructures;`;
    }
  }

  if (key === 'patience') {
    if (score >= 75) {
      return isKO
        ? `**인내심(${score}점)**이 아주 두터워 모든 이가 낙담하고 중도 하차하는 지루한 모래밭 싸움 속에서도 기어이 버티며 임계점을 넘는 끝판왕 끈기가 강점이며`
        : `with **Patience (${score})** being very high, empowering you to persist through prolonged hardships and cross the finish line;`;
    } else if (score >= 40) {
      return isKO
        ? `**인내심(${score}점)**이 현실적이어서 가망 없는 곳에 무작정 존버하기보다는 효율성과 가능성을 영리하게 재서 방향을 틀 줄 아는 순발력이 조화롭고`
        : `with **Patience (${score})** being practical, knowing when to endure and when to pivot to preserve resources;`;
    } else {
      return isKO
        ? `**인내심(${score}점)**이 급하여 변화 없는 단순 반복을 견디기 어렵지만 빠른 속도와 기동성이 요구되는 단기 임팩트 무대에서 놀라운 몰입을 끌어내고`
        : `with **Patience (${score})** being low, finding routine boring but exhibiting explosive concentration in fast-paced short-term tasks;`;
    }
  }

  if (key === 'businessSense') {
    if (score >= 75) {
      return isKO
        ? `**사업감각(${score}점)**이 탁월하여 무형의 가치나 상황에서 기회와 돈의 냄새를 맡고 자원을 효율적으로 배분해 현실적 실속을 쓸어 담는 장사꾼 직감이 있고`
        : `with **Business Acumen (${score})** being exceptional, letting you spot market opportunities and allocate assets to maximize profits;`;
    } else if (score >= 40) {
      return isKO
        ? `**사업감각(${score}점)**이 차분하여 일확천금을 쫓기보다 명확한 저축, 합리적 지출 필터를 작동시켜 가계를 단단히 설계하는 안정주의 재테크를 선호하며`
        : `with **Business Acumen (${score})** being stable, avoiding speculative gambles and focusing on reliable asset accumulation and management;`;
    } else {
      return isKO
        ? `**사업감각(${score}점)**이 순수하여 오직 이익만을 쫓는 계산적 처세보다는 공익, 도덕적 가치, 혹은 정신적 만족을 우선하는 따뜻한 인도주의를 품었고`
        : `with **Business Acumen (${score})** being low, prioritizing intellectual values, public good, or artistic growth over calculations;`;
    }
  }

  if (key === 'relationshipLuck') {
    if (score >= 75) {
      return isKO
        ? `**관계운(${score}점)**이 넘치어 특유의 사교성과 호감 가는 처세로 처음 보는 사람과도 금방 벽을 허물며 풍성한 대인관계를 유지하는 재주를 보이고`
        : `with **Relationship Luck (${score})** being high, helping you break boundaries easily with social warmth and charm;`;
    } else if (score >= 40) {
      return isKO
        ? `**관계운(${score}점)**이 합리적이어서 불필요하게 넓은 인간관계로 에너지를 낭비하지 않고 소수와의 단단한 정서적 유대를 실리적으로 지향하고`
        : `with **Relationship Luck (${score})** being average, maintaining healthy distance and focusing on meaningful, stable connections;`;
    } else {
      return isKO
        ? `**관계운(${score}점)**이 고독하여 얕고 시끄러운 모임을 거부하고 나만의 사색과 진정한 소수정예 친밀함으로 불필요한 인간적 피로를 차단하며`
        : `with **Relationship Luck (${score})** being low, avoiding superficial networking and preserving your energy through solitary focus;`;
    }
  }

  return '';
}

// ─────────────────────────────────────────────
// 천간 투간(투출) 감지 헬퍼 & 행동 양식/모순점 매핑
// ─────────────────────────────────────────────
const tenGodPenetrationKo: Record<string, string> = {
  '비겁': '주변과 조율하면서도 본인의 독립적인 신념과 주체성을 타협 없이 관철하려는 성향이 돋보입니다. 다만 겉으로는 조화롭게 수용하는 듯 제스처를 취하지만, 실제 행동 단계에서는 무의식적으로 내 고집대로 밀어붙이는 이중적인 태도(모순점)가 종종 버릇으로 관찰됩니다.',
  '식상': '내면에 내포된 창의적 아이디어와 비평적 안목(식상)을 말, 글, 또는 독창적인 기획으로 거침없이 바깥으로 방출하는 능력이 탑재되어 있습니다. 그러나 하고 싶은 말을 참지 못하고 섣부르게 뱉어 가벼운 오해를 사거나, 기획의 출발은 요란하나 세부 디테일을 끝까지 챙기지 못하는 행동적 버릇(문제점)을 겪기 쉽습니다.',
  '재성': '현실적으로 이익이 되는 기회와 결과를 포착하고, 구체적인 목표 의식과 계산기를 작동시키는 안목이 남다릅니다. 다만 정신적 명분을 사수하려는 자존심과, 실제적 실리를 단단히 움켜쥐려는 계산 본능이 충돌할 때, 겉으로는 초탈한 척하면서도 속으로는 손익을 처절하게 계산하며 스트레스를 자초하는 모순된 습관이 작용합니다.',
  '관성': '사회적인 규율과 규칙, 그리고 대외적인 완벽한 평판을 한 몸에 짊어지려는 남다른 의무감을 보입니다. 항상 빈틈없는 모습을 보이려다 보니 만성적인 긴장에 노출되기 쉽고, 스스로의 엄격한 자존심 때문에 타인의 사소한 비효율이나 미숙함에도 내심 엄한 잣대를 들이대며 갈등을 겪는 문제적 버릇이 있습니다.',
  '인성': '체계적인 지식과 철학적 통찰, 혹은 상황에 대한 깊은 사색을 거쳐 움직이려는 지적 지향성이 강합니다. 그러나 머릿속으로 100가지 가상 시나리오를 그리며 검증하느라, 정작 행동에 나설 최적의 타이밍을 놓쳐버리는 "생각에 의한 행동 마비(결정 장애)"가 가장 큰 모순이자 극복 과제입니다.'
};

const tenGodPenetrationEn: Record<string, string> = {
  '비겁': 'You project a highly cooperative and agreeable persona, yet internally carry an uncompromising sense of independence. This contradiction often shows when you nod in agreement but quietly execute only your own decisions.',
  '식상': 'You possess a powerful drive to express your creative ideas and intellectual criticisms. However, your verbal drive often outpaces physical implementation, leaving projects half-finished or inviting unnecessary friction due to unfiltered speech.',
  '재성': 'You have an outstanding instinct for recognizing profit and seizing practical results. The friction lies between maintaining a noble image (stems) and calculating immediate gains (branches), generating silent stress from over-analyzing values versus costs.',
  '관성': 'You hold yourself to strict social standards and responsibility, striving to maintain a perfect public reputation. This creates chronic tension as you find it difficult to delegate duties, holding others to the same strict standards and provoking internal friction.',
  '인성': 'You seek absolute clarity and logical consistency before taking steps. However, this easily leads to analysis paralysis, where you keep researching and checking scenarios, missing key windows of opportunity due to overthinking.'
};

function findPenetrationDetails(
  dayStem: string,
  stems: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[],
  branches: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[]
): { matchedStems: string[], matchedBranches: string[], explanationKo: string, explanationEn: string } {
  
  const matches: { sTitle: string, sVal: string, bTitle: string, bVal: string }[] = [];
  
  branches.forEach(b => {
    const mainQi = BRANCH_MAIN_QI[b.val];
    if (mainQi) {
      stems.forEach(s => {
        if (s.val === mainQi) {
          matches.push({ sTitle: s.title, sVal: s.val, bTitle: b.title, bVal: b.val });
        }
      });
    }
  });

  const matchedStems: string[] = [];
  const matchedBranches: string[] = [];
  const uniqueTenGods = new Set<string>();

  matches.forEach(m => {
    matchedStems.push(m.sTitle);
    matchedBranches.push(m.bTitle);
    
    const sTenGod = m.sTitle === 'Day' ? '비견' : computeTenGodLocal(dayStem, m.sVal, true);
    let tgGroup = '비겁';
    if (sTenGod === '식신' || sTenGod === '상관') tgGroup = '식상';
    else if (sTenGod === '편재' || sTenGod === '정재') tgGroup = '재성';
    else if (sTenGod === '편관' || sTenGod === '정관') tgGroup = '관성';
    else if (sTenGod === '편인' || sTenGod === '정인') tgGroup = '인성';
    
    uniqueTenGods.add(tgGroup);
  });

  let descKo = '';
  let descEn = '';

  if (uniqueTenGods.size > 0) {
    descKo = `\n\n특히 귀하의 지향성과 내밀한 본능이 연결되어 다음과 같은 일상적인 습관과 자가당착(모순점)이 삶에서 반복하여 발현되기 쉽습니다.`;
    descEn = `\n\nSpecifically, the projection of your core elements into your consciousness shapes the following behavioral habits and contradictions:`;
    
    Array.from(uniqueTenGods).forEach(tg => {
      if (tenGodPenetrationKo[tg]) {
        descKo += `\n\n- **${tg}의 투출 성향**: ${tenGodPenetrationKo[tg]}`;
      }
      if (tenGodPenetrationEn[tg]) {
        descEn += `\n\n- **Projected ${tg} Trait**: ${tenGodPenetrationEn[tg]}`;
      }
    });
  }

  return {
    matchedStems,
    matchedBranches,
    explanationKo: descKo,
    explanationEn: descEn
  };
}

// ─────────────────────────────────────────────
// 지지 형충파해 감지 및 성격/행동/모순점 분기 해설
// ─────────────────────────────────────────────
function findClashHyeongDetails(
  branches: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[],
  dayStem: string
): { explanationKo: string, explanationEn: string } {
  
  let descKo = '';
  let descEn = '';
  const foundPairs = new Set<string>();

  const chungs = [['子','午'], ['丑','未'], ['寅','申'], ['卯','酉'], ['辰','戌'], ['巳','亥']];
  const hyeongs = [['寅','巳'], ['巳','申'], ['申','寅'], ['丑','戌'], ['戌','未'], ['未','丑'], ['子','卯']];
  const pahs = [['子','酉'], ['丑','辰'], ['寅','亥'], ['卯','午'], ['巳','申'], ['未','戌']];

  // 1. Clash (충)
  let clashDescKo = '';
  let clashDescEn = '';
  
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const b1 = branches[i];
      const b2 = branches[j];
      const pairKey = [b1.val, b2.val].sort().join('');
      if (foundPairs.has(pairKey)) continue;

      const isChung = chungs.some(p => (p[0] === b1.val && p[1] === b2.val) || (p[0] === b2.val && p[1] === b1.val));
      if (isChung) {
        foundPairs.add(pairKey);
        const val1 = b1.val;
        const val2 = b2.val;
        
        let customKo = '';
        let customEn = '';
        if ((val1 === '子' && val2 === '午') || (val1 === '午' && val2 === '子') || (val1 === '巳' && val2 === '亥') || (val1 === '亥' && val2 === '巳')) {
          customKo = '지지의 물(水)과 불(火)이 격렬하게 충돌하며 감정과 이성 사이의 심한 조율 장애(온도 차)를 일으킵니다. 순간적인 강한 동기나 감정으로 열정을 급격히 피워 올렸다가도, 어느 순간 차갑게 식어 냉담해지는 변덕(모순점)이 보입니다. 대인관계에서도 극적 몰입과 단호한 단절을 오가기 쉽습니다.';
          customEn = 'The collision of Water and Fire in your branches creates a sharp oscillation between rational coldness and emotional passion. You might work with explosive energy, only to shut down and isolate yourself without warning, creating an emotional rollercoaster that puzzles those around you.';
        } else if ((val1 === '寅' && val2 === '申') || (val1 === '申' && val2 === '寅') || (val1 === '卯' && val2 === '酉') || (val1 === '酉' && val2 === '卯')) {
          customKo = '지지의 금(Metal)과 목(Wood)의 충돌로 인해 돌진하려는 본능과 억제하려는 규율이 매 순간 부딪힙니다. 무언가 의욕적으로 시작해 보려고(목) 하면, 스스로 "이것이 완벽한가? 나에게 실효성이 있는가?"를 냉혹하게 자문(금)하여 자기검열에 걸려 스스로의 날개를 꺾어버리는 포기 습관(모순점)이 나타나기 쉽습니다.';
          customEn = 'The clash between Metal and Wood pits your pioneering, creative drive against strict self-censorship and rules. Whenever you feel excited to launch a new project, you might immediately scrutinize and doubt your own ability, resulting in self-sabotage or leaving tasks half-finished.';
        } else {
          customKo = '지지의 토(Earth)들이 충돌하면서 내면의 가치관 신조들이 무겁게 요동칩니다. 평소에는 무덤덤하고 인내심 강하게 자리를 지키는 척하지만, 내면의 자존심이나 영역이 침범당하면 겉잡을 수 없이 고집스럽게 폭발하는 버릇을 내재합니다. 옛 일이나 해묵은 섭섭함을 마음에 오랫동안 묻어두고 꺼내며 괴로워하는 모순을 띱니다.';
          customEn = 'The friction between Earth elements triggers a deep stubbornness and conflicts over core values. You usually present a steady, unmoving patience, but when a personal boundary or self-esteem is threatened, you might release an explosive, unyielding anger. You also tend to store past emotional grudges deeply, finding it hard to forgive.';
        }

        const titleKoMap: Record<string, string> = { Day: '일지', Month: '월지', Year: '년지', Hour: '시지' };
        const titleEnMap: Record<string, string> = { Day: 'Day Branch', Month: 'Month Branch', Year: 'Year Branch', Hour: 'Hour Branch' };
        clashDescKo += `\n\n- **${titleKoMap[b1.title]} ${b1.val}와 ${titleKoMap[b2.title]} ${b2.val}의 충돌**: ${customKo}`;
        clashDescEn += `\n\n- **Clash between ${titleEnMap[b1.title]} ${b1.val} and ${titleEnMap[b2.title]} ${b2.val}**: ${customEn}`;
      }
    }
  }

  // 2. Punishment (형)
  let hyeongDescKo = '';
  let hyeongDescEn = '';
  const branchVals = branches.map(b => b.val);
  const hasInSaSin = ['寅', '巳', '申'].filter(v => branchVals.includes(v)).length >= 2;
  const hasChukSulMi = ['丑', '戌', '未'].filter(v => branchVals.includes(v)).length >= 2;
  const hasJaMyo = branchVals.includes('子') && branchVals.includes('卯');

  if (hasInSaSin) {
    hyeongDescKo += `\n\n- **지지의 역동적 충돌(寅·巳·申 형살)**: 몸과 마음을 쉴 새 없이 바쁘게 몰아치며 효율을 고집하는 조급한 습관이 있습니다. 신속한 결단력을 발휘하지만, 속도를 중시하느라 사소한 절차적 누락을 내거나 주변 동료에게도 과도한 가속을 요구해 갈등(문제점)을 자초하기도 합니다.`;
    hyeongDescEn += `\n\n- **Dynamic Action Penalty (In-Sa-Sin Hyeong)**: The dynamic, fast-moving penalty (Hyeong) in your branches induces impatience and a low tolerance for inefficiency. You might rush processes to secure quick results, leading to oversight or creating friction by demanding the same speed from others.`;
  }
  if (hasChukSulMi) {
    hyeongDescKo += `\n\n- **지지의 축적된 마찰(丑·戌·未 형살)**: 나만의 확고한 신조와 논리에 함몰되어 타인의 합리적인 비판이나 피드백을 수용하기 힘들어하는 고집스러운 모순이 보입니다. 가슴속에 답답함과 불편을 쌓아두다가 해소하지 못한 채 인간관계를 조용히 단절해 버리는 냉소적인 태도를 가지기 쉽습니다.`;
    hyeongDescEn += `\n\n- **Earth Consolidation Penalty (Chuk-Sul-Mi Hyeong)**: The Earth penalty (Hyeong) introduces a stubborn attachment to your own logic, making it difficult to accept external advice. You tend to swallow grievances silently for long periods, which can culminate in sudden, cold terminations of relationships.`;
  }
  if (hasJaMyo) {
    hyeongDescKo += `\n\n- **지지의 무례 갈등(子·卯 형살)**: 가깝고 사적인 인간관계에서 "상대방이 나의 호의와 선을 배려하지 않았다"고 느껴 홀로 토라지고 서운해하는 감정의 조율 장애(문제점)가 관찰됩니다. 상대방의 말이나 태도의 미세한 뉘앙스를 예민하게 주시하다 오해를 키우는 모순을 주의해야 합니다.`;
    hyeongDescEn += `\n\n- **Relational Friction Penalty (Ja-Myo Hyeong)**: The Ja-Myo penalty introduces sensitivity in close relationships. You easily feel neglected or hurt when others do not match your exact standards of consideration, sometimes magnifying minor slights into deep misunderstandings.`;
  }

  // 3. Self-penalty (자형)
  let selfDescKo = '';
  let selfDescEn = '';
  const counts: Record<string, number> = {};
  branches.forEach(b => { counts[b.val] = (counts[b.val] || 0) + 1; });
  const selfPenalties = ['辰', '午', '酉', '亥'].filter(bChar => counts[bChar] >= 2);
  if (selfPenalties.length > 0) {
    selfDescKo += `\n\n- **스스로를 채찍질하는 자형(${selfPenalties.join(', ')} 중첩)**: 타인이 나를 비판하기 전에 스스로에게 지나치게 매정한 잣대를 들이대며 괴롭히는 강박적 완벽주의를 겪습니다. 실수할까 두려울 때 속마음을 단단한 에고의 가면 뒤에 숨기고 깊은 동굴로 숨어버리는 모순을 띱니다.`;
    selfDescEn += `\n\n- **Self-Penalty (Ja-Hyeong for ${selfPenalties.join(', ')})**: The duplication of matching branch characters triggers self-penalty (Ja-Hyeong). You suffer from a self-sabotaging perfectionism, criticizing yourself before anyone else can. When anxious, you tend to build thick defensive walls and isolate yourself.`;
  }

  // 4. Pah (파)
  let pahDescKo = '';
  let pahDescEn = '';
  for (let i = 0; i < branches.length; i++) {
    for (let j = i + 1; j < branches.length; j++) {
      const b1 = branches[i];
      const b2 = branches[j];
      const isPah = pahs.some(p => (p[0] === b1.val && p[1] === b2.val) || (p[0] === b2.val && p[1] === b1.val));
      if (isPah) {
        pahDescKo += `\n\n- **지지의 매듭짓기 불안정(破)**: 일을 의욕 넘치게 설계하고 착수하지만, 마지막 마무리를 해야 할 중요한 고비나 서류 마감 단계에서 급격히 집중력이 흐트러지며 어처구니없는 실수를 반복하는 뒷심 부족(모순점)이 습관적으로 발생할 수 있습니다.`;
        pahDescEn += `\n\n- **Interference (Pah)**: The presence of breaking (Pah) energy in your branches indicates difficulty in closing projects. You start tasks with high momentum but lose steam during the final 10%, leading to administrative oversights or unfinished details.`;
        break;
      }
    }
  }

  descKo = [clashDescKo, hyeongDescKo, selfDescKo, pahDescKo].filter(Boolean).join('');
  descEn = [clashDescEn, hyeongDescEn, selfDescEn, pahDescEn].filter(Boolean).join('');

  return {
    explanationKo: descKo,
    explanationEn: descEn
  };
}

// ─────────────────────────────────────────────
// 메인 생성 함수 (Priority Queue 기반 개편)
// ─────────────────────────────────────────────
export function generatePersonalizedTexts(
  dayPillar: BaZiCard | undefined,
  monthPillar: BaZiCard | undefined,
  yearPillar: BaZiCard | undefined,
  hourPillar: BaZiCard | undefined,
  baseProfileCode: string,
  hasDeungRa: boolean,
  lang: string = 'KO',
  traitScores?: TraitScore[],
  result?: BaZiResult
): PersonalizedTexts & { wealthFlow: PersonalizedSection } {

  const isKO = lang === 'KO';

  // 글자 및 기둥 배열 구조화
  const dayStem    = dayPillar?.stem    || '甲';
  const dayBranch  = dayPillar?.branch  || '子';
  const monthStem  = monthPillar?.stem  || '甲';
  const monthBranch = monthPillar?.branch || '子';
  const yearStem   = yearPillar?.stem   || '甲';
  const yearBranch  = yearPillar?.branch  || '子';
  const hourStem   = (hourPillar && !hourPillar.isUnknown) ? (hourPillar.stem || '') : '';
  const hourBranch  = (hourPillar && !hourPillar.isUnknown) ? (hourPillar.branch || '') : '';

  const stems: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[] = [
    { title: 'Day', val: dayStem },
    { title: 'Month', val: monthStem },
    { title: 'Year', val: yearStem }
  ];
  if (hourStem) stems.push({ title: 'Hour', val: hourStem });

  const branches: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[] = [
    { title: 'Day', val: dayBranch },
    { title: 'Month', val: monthBranch },
    { title: 'Year', val: yearBranch }
  ];
  if (hourBranch) branches.push({ title: 'Hour', val: hourBranch });

  const dayMasterKo = isKO ? (STEM_PERSONALITIES[dayStem]?.koName || dayStem) : (STEM_EN_NAMES[dayStem] || dayStem);

  // 최상위 잠재력 수치 연동 접미사 (High/Mid/Low 정밀 해설 포함)
  let traitsSuffixKo = '';
  let traitsSuffixEn = '';
  if (traitScores && traitScores.length >= 2) {
    const top1 = traitScores[0];
    const top2 = traitScores[1];
    
    const explanation1Ko = getTraitDetailText(top1.key, top1.score, 'KO');
    const explanation2Ko = getTraitDetailText(top2.key, top2.score, 'KO');
    
    const explanation1En = getTraitDetailText(top1.key, top1.score, 'EN');
    const explanation2En = getTraitDetailText(top2.key, top2.score, 'EN');

    traitsSuffixKo = `\n\n특히 귀하의 잠재력 지표 중 가장 강력하게 작용하는 핵심 무기는 **${top1.name}(${top1.score}점)**과 **${top2.name}(${top2.score}점)**입니다. 귀하는 ${explanation1Ko} 또한 ${explanation2Ko} 이러한 지표들이 결합할 때 귀하만의 고유한 기질적 본질이 삶과 사회 무대에서 폭발적인 성공 가능성으로 발현됩니다.`;
    traitsSuffixEn = `\n\nSpecifically, the strongest potential traits in your profile are **${top1.name} (${top1.score} points)** and **${top2.name} (${top2.score} points)**. You are someone who, ${explanation1En} and also ${explanation2En} When these qualities align, they form your ultimate cosmic weapon, translating your inner potential into outstanding reality.`;
  }

  // ─────────────────────────────────────────────
  // 1. [타고난 기질] 연산 및 텍스트 구성
  // ─────────────────────────────────────────────
  let innateTitle = '';
  let innateDesc = '';
  let innatePillars: { pillarTitle: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch' }[] = [];

  const hapNet = findHapNetwork(stems, branches);
  const overload = findOverloadedTenGods(dayStem, stems, branches);
  const siblingRoot = findSiblingRoots(dayStem, branches);

  if (hapNet) {
    // 1순위: 합 네트워크
    innateTitle = isKO 
      ? `[합(合) 네트워크] 우주적 에너지가 결집된 강력한 지향성` 
      : `[Union Network] Powerful Alignment Crafted by Cosmic Conjunction`;
    innateDesc = isKO
      ? `당신의 명식은 지지에 **${hapNet.koName}**의 결합을 완성하고, 그 강한 기운이 천간 **${hapNet.type}** 오행으로 분출되어 투간된 매우 비범한 구조입니다. 이는 에너지가 한곳으로 집중되어 강력한 돌파력과 확실한 정체성을 발휘함을 의미합니다. 혼란 속에서도 명확한 지향점을 스스로 설정하고 이끌어갈 수 있는 선천적 리더십과 추진력이 탑재되어 있습니다.`
      : `Your chart exhibits a rare and powerful structure where the branches complete the **${hapNet.enName}** union, channelizing this immense energy directly into the **${hapNet.type}** element of the stem. This suggests your core drive is highly focused, granting you unyielding determination and a clear sense of identity. You are naturally equipped with the pioneering leadership to define your own path and command situations even amidst chaos.`;
    innateDesc += traitsSuffixKo;
    innatePillars = hapNet.keyPillars;
  } else if (overload) {
    // 2순위: 특정 성분 도배
    innateTitle = isKO 
      ? `[성분 집중형] ${overload.nameKo} 에너지가 지배하는 개성파 기질` 
      : `[Concentrated Type] Character Dominated by ${overload.nameEn}`;
    innateDesc = isKO
      ? `귀하의 사주는 **${overload.nameKo}** 기운이 3개 이상 포진하여, 해당 에너지가 성격과 행동 양식을 강력하게 지배하고 있습니다. 이는 남들과 구별되는 극대화된 개성과 독창적인 무기를 의미합니다. 스스로의 확고한 주도권과 전문 영역을 확보할 때 이 쏠린 에너지는 폭발적인 창조력으로 승화됩니다.`
      : `In your cosmic layout, more than three characters are saturated with **${overload.nameEn}** energy, causing this specific vibration to strongly dictate your behavior and character. This marks you as an individual of extreme color and distinct talent. When you establish your own sovereign domain and specialty, this concentrated energy sublimes into an explosive creative force.`;
    innateDesc += traitsSuffixKo;
    innatePillars = overload.keyPillars;
  } else if (siblingRoot) {
    // 3순위: 비겁의 뿌리 세포
    innateTitle = isKO
      ? `[주체성의 뿌리] 스스로를 지탱하는 자아의 근본 기둥`
      : `[Root of Ego] Indestructible Foundation Anchoring the Self`;
    innateDesc = isKO
      ? `귀하의 명식은 비록 강한 쏠림은 없으나, 지지에 일간의 든든한 동료이자 힘이 되어주는 비겁(뿌리) 글자들이 2개 이상 포진하고 있습니다. 이는 외부 환경에 쉽게 흔들리지 않고 스스로 중심을 잡는 '자아의 뿌리 세포'가 매우 튼튼함을 의미합니다. 실패를 겪어도 오뚝이처럼 일어나는 복원력과 주체성이 귀하의 근본 강점입니다.`
      : `While free from extreme imbalances, your configuration features two or more branches that act as the supportive roots of your Day Master. This signifies a highly resilient "ego root system" that keeps you anchored through any external turbulence. Your fundamental strength lies in your autonomous recovery power and self-reliance, rising like a phoenix from any setback.`;
    innateDesc += traitsSuffixKo;
    innatePillars = siblingRoot.keyPillars;
  } else {
    // 4순위: 일간 중심 삼각편대 (Default)
    const innateElem = dominantElement([
      BAZI_MAPPING.branches[dayBranch as keyof typeof BAZI_MAPPING.branches]?.element,
      BAZI_MAPPING.stems[monthStem   as keyof typeof BAZI_MAPPING.stems]?.element,
      BAZI_MAPPING.stems[yearStem    as keyof typeof BAZI_MAPPING.stems]?.element,
    ]);

    const innateTitleMap: Record<string, string> = {
      Wood:  isKO ? `${dayMasterKo}에 심어진 성장의 불꽃 — 앞으로만 나아가는 선천적 기질` : `Flame of growth planted in ${dayMasterKo} — Your innate pioneering temperament`,
      Fire:  isKO ? `${dayMasterKo} 안에서 타오르는 열정 — 감정과 표현이 삶을 이끄는 방식` : `Passion burning within ${dayMasterKo} — How emotions and expressions guide your life`,
      Earth: isKO ? `${dayMasterKo}의 무게 — 흔들리지 않는 내면이 만드는 신뢰의 기질` : `The weight of ${dayMasterKo} — A steady, reliable nature crafted by your inner anchor`,
      Metal: isKO ? `${dayMasterKo}의 날카로움 — 원칙과 기준으로 세상을 다스리는 기질` : `The sharpness of ${dayMasterKo} — A principled mind ruling the world with standards`,
      Water: isKO ? `${dayMasterKo}이 담아낸 지혜 — 흐르며 꿰뚫어보는 선천적 통찰` : `The wisdom contained in ${dayMasterKo} — Innate flowing insight that sees through situations`,
    };

    innateTitle = innateTitleMap[innateElem] || (isKO ? `${dayMasterKo}이 빚어낸 타고난 기질` : `Innate Temperament Crafted by ${dayMasterKo}`);

    // 기존 삼각편대 조립
    const p1 = isKO
      ? (STEM_PERSONALITIES[dayStem] ? `당신의 ${dayStem}(${dayMasterKo}) 일간은 **${STEM_PERSONALITIES[dayStem].coreIdentity}**\n${STEM_PERSONALITIES[dayStem].innateDesire}` : `**당신의 일간 ${dayStem}의 기운이 삶의 모든 방향을 결정하는 핵심 축이 됩니다.**`)
      : (STEM_INFO_EN[dayStem] ? `Your Day Master ${dayStem}(${dayMasterKo}) is **${STEM_INFO_EN[dayStem].coreIdentity}**\n${STEM_INFO_EN[dayStem].innateDesire}` : `**Your Day Master ${dayStem} serves as the core axis deciding all directions of your life.**`);

    const p2 = isKO
      ? (monthPillar && TEN_GOD_POSITION_EFFECTS[computeTenGodLocal(dayStem, monthStem, true)]?.monthly
        ? `여기에 월간 ${monthStem}(${isKO ? (STEM_PERSONALITIES[monthStem]?.koName || monthStem) : (STEM_EN_NAMES[monthStem] || monthStem)})의 ${computeTenGodLocal(dayStem, monthStem, true)} 기운이 겹쳐집니다.\n**${TEN_GOD_POSITION_EFFECTS[computeTenGodLocal(dayStem, monthStem, true)].monthly}**`
        : '')
      : (monthPillar && TG_POSITION_EFFECTS_EN[computeTenGodLocal(dayStem, monthStem, true)]
        ? `Here, the ${TEN_GOD_EN_NAMES[computeTenGodLocal(dayStem, monthStem, true)] || computeTenGodLocal(dayStem, monthStem, true)} energy of Month Stem ${monthStem}(${isKO ? (STEM_PERSONALITIES[monthStem]?.koName || monthStem) : (STEM_EN_NAMES[monthStem] || monthStem)}) overlays.\n**${TG_POSITION_EFFECTS_EN[computeTenGodLocal(dayStem, monthStem, true)].monthly}**`
        : '');

    const p3 = isKO
      ? (yearPillar && TEN_GOD_POSITION_EFFECTS[computeTenGodLocal(dayStem, yearStem, true)]?.yearly
        ? `조상과 초년의 기질로 자리 잡은 년간 ${yearStem}(${isKO ? (STEM_PERSONALITIES[yearStem]?.koName || yearStem) : (STEM_EN_NAMES[yearStem] || yearStem)})의 ${computeTenGodLocal(dayStem, yearStem, true)}은\n**${TEN_GOD_POSITION_EFFECTS[computeTenGodLocal(dayStem, yearStem, true)].yearly}**`
        : '')
      : (yearPillar && TG_POSITION_EFFECTS_EN[computeTenGodLocal(dayStem, yearStem, true)]
        ? `The ${TEN_GOD_EN_NAMES[computeTenGodLocal(dayStem, yearStem, true)] || computeTenGodLocal(dayStem, yearStem, true)} of Year Stem ${yearStem}(${isKO ? (STEM_PERSONALITIES[yearStem]?.koName || yearStem) : (STEM_EN_NAMES[yearStem] || yearStem)}), representing your ancestors and early years,\n**${TG_POSITION_EFFECTS_EN[computeTenGodLocal(dayStem, yearStem, true)].yearly}**`
        : '');

    const p4 = isKO
      ? (BRANCH_PERSONALITIES[dayBranch] ? `일지 ${dayBranch}(${isKO ? (BRANCH_PERSONALITIES[dayBranch]?.koName || dayBranch) : (BRANCH_EN_NAMES[dayBranch] || dayBranch)})은 귀하의 가장 내밀한 내면의 분위기를 이룹니다.\n**${BRANCH_PERSONALITIES[dayBranch].hiddenStruggle}**\n또한 ${BRANCH_PERSONALITIES[dayBranch].behavioralTrigger}` : '')
      : (BRANCH_INFO_EN[dayBranch] ? `The Day Branch ${dayBranch}(${isKO ? (BRANCH_PERSONALITIES[dayBranch]?.koName || dayBranch) : (BRANCH_EN_NAMES[dayBranch] || dayBranch)}) forms the most private atmosphere of your inner self.\n**${BRANCH_INFO_EN[dayBranch].hiddenStruggle}**\nAlso, it triggers when ${BRANCH_INFO_EN[dayBranch].behavioralTrigger}` : '');

    const p5 = isKO
      ? (STEM_PERSONALITIES[dayStem] ? `이 기운들이 합쳐질 때 귀하에게는 뚜렷한 이중성이 나타납니다.\n**${STEM_PERSONALITIES[dayStem].strengthInSociety}**\n반면 ${STEM_PERSONALITIES[dayStem].shadowSide}` : '')
      : (STEM_INFO_EN[dayStem] ? `When these energies combine, a distinct duality emerges within you.\n**${STEM_INFO_EN[dayStem].strengthInSociety}**\nOn the other hand, ${STEM_INFO_EN[dayStem].shadowSide}` : '');

    innateDesc = [p1, p2, p3, p4, p5].filter(s => s.trim().length > 0).join('\n\n');
    innateDesc += isKO ? traitsSuffixKo : traitsSuffixEn;

    innatePillars = [
      { pillarTitle: 'Day',   type: 'branch' as const },
      { pillarTitle: 'Month', type: 'stem'   as const }
    ];
    if (hourStem) {
      innatePillars.push({ pillarTitle: 'Hour', type: 'stem' as const });
    } else {
      innatePillars.push({ pillarTitle: 'Year', type: 'stem' as const });
    }
  }

  // ─────────────────────────────────────────────
  // 2. [살아가는 방식] 연산 및 텍스트 구성
  // ─────────────────────────────────────────────
  let lifeTitle = '';
  let lifeDesc = '';
  let lifePillars: { pillarTitle: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch' }[] = [];

  const branchList = [dayBranch, monthBranch, yearBranch, hourBranch].filter(Boolean);
  const stemList = [dayStem, monthStem, yearStem, hourStem].filter(Boolean);
  
  let tugwanCount = 0;
  branchList.forEach(b => {
    const mainQi = BRANCH_MAIN_QI[b];
    if (mainQi && stemList.includes(mainQi)) {
      tugwanCount++;
    }
  });

  const hasTension = hasChungHyeongPah(branchList);

  // 개별 지지 환경 상세 카드는 모든 유형에 공통적으로 병합하여 구체적인 해석을 보장합니다.
  const ls1 = isKO
    ? (BRANCH_PERSONALITIES[monthBranch] ? `\n\n귀하의 사회적 삶은 **월지 ${monthBranch}(${isKO ? (BRANCH_PERSONALITIES[monthBranch]?.koName || monthBranch) : (BRANCH_EN_NAMES[monthBranch] || monthBranch)})**의 분위기 안에서 펼쳐집니다.\n**${BRANCH_PERSONALITIES[monthBranch].lifeEnvironment}**\n${BRANCH_PERSONALITIES[monthBranch].socialPattern}` : '')
    : (BRANCH_INFO_EN[monthBranch] ? `\n\nYour social life unfolds within the atmosphere of **Month Branch ${monthBranch}(${isKO ? (BRANCH_PERSONALITIES[monthBranch]?.koName || monthBranch) : (BRANCH_EN_NAMES[monthBranch] || monthBranch)})**.\n**${BRANCH_INFO_EN[monthBranch].lifeEnvironment}**\n${BRANCH_INFO_EN[monthBranch].socialPattern}` : '');

  const ls2 = isKO
    ? (BRANCH_PERSONALITIES[yearBranch] ? `\n\n삶의 뿌리와 행동 방식의 토대를 이루는 **년지 ${yearBranch}(${isKO ? (BRANCH_PERSONALITIES[yearBranch]?.koName || yearBranch) : (BRANCH_EN_NAMES[yearBranch] || yearBranch)})**은 귀하의 가장 기본적인 관계 패턴을 형성합니다.\n**${BRANCH_PERSONALITIES[yearBranch].lifeEnvironment}**\n${BRANCH_PERSONALITIES[yearBranch].socialPattern}` : '')
    : (BRANCH_INFO_EN[yearBranch] ? `\n\nThe **Year Branch ${yearBranch}(${isKO ? (BRANCH_PERSONALITIES[yearBranch]?.koName || yearBranch) : (BRANCH_EN_NAMES[yearBranch] || yearBranch)})**, forming the root and foundation of your life, shapes your basic relationship patterns.\n**${BRANCH_INFO_EN[yearBranch].lifeEnvironment}**\n${BRANCH_INFO_EN[yearBranch].socialPattern}` : '');

  const ls3 = isKO
    ? (BRANCH_PERSONALITIES[hourBranch] ? `\n\n**시지 ${hourBranch}(${isKO ? (BRANCH_PERSONALITIES[hourBranch]?.koName || hourBranch) : (BRANCH_EN_NAMES[hourBranch] || hourBranch)})**은 귀하가 진정으로 원하고 이루고자 하는 욕망의 방향을 보여줍니다.\n**${BRANCH_PERSONALITIES[hourBranch].behavioralTrigger}**\n${BRANCH_PERSONALITIES[hourBranch].hiddenStruggle}` : '')
    : (BRANCH_INFO_EN[hourBranch] ? `\n\nThe **Hour Branch ${hourBranch}(${isKO ? (BRANCH_PERSONALITIES[hourBranch]?.koName || hourBranch) : (BRANCH_EN_NAMES[hourBranch] || hourBranch)})** reveals the direction of your true desires and goals.\n**${BRANCH_INFO_EN[hourBranch].behavioralTrigger}**\n${BRANCH_INFO_EN[hourBranch].hiddenStruggle}` : '');

  const individualDetails = [ls1, ls2, ls3].filter(s => s.trim().length > 0).join('');

  if (tugwanCount >= 2) {
    // 1순위: 천간 지향형 페르소나
    const pen = findPenetrationDetails(dayStem, stems, branches);
    lifeTitle = isKO
      ? `[천간 지향형] 가치관과 명분을 세상에 투사하는 삶의 가치`
      : `[Stem-oriented Persona] A Life Projecting Values and Honor to the World`;
    
    let detailKo = `귀하의 사주는 지지의 주요 기운들이 천간으로 투간하여 가치관과 정신적 지향점이 매우 뚜렷한 '천간 지향형' 구조입니다. 현실적인 타협이나 눈앞의 이익보다는 명분, 신념, 그리고 사회적인 명예와 약속을 가장 중요하게 여깁니다. 세상을 향해 뚜렷한 가치관을 전파하고 자신의 신조를 증명해 나가는 방식으로 삶을 개척합니다.`;
    let detailEn = `Your chart belongs to the "Stem-oriented" category, where the hidden elements of the branches soar into the stems, granting you clear ideological orientation and mental clarity. You prioritize honor, integrity, beliefs, and social promises over immediate gains or convenience. You carve your destiny by demonstrating your values and proving your convictions to the world.`;

    if (pen.explanationKo) {
      detailKo += `\n\n**원국 분석 결과, 다음 글자들이 천간으로 곧게 투출되어 삶의 지향 가치를 형성합니다:**${pen.explanationKo}`;
      detailEn += `\n\n**Analysis of your birth chart reveals the following stem penetrations:**${pen.explanationEn}`;
    }

    lifeDesc = detailKo + individualDetails;
    if (!isKO) lifeDesc = detailEn + individualDetails;
    
    const keyPillars: { pillarTitle: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch' }[] = [];
    stems.forEach(s => {
      if (pen.matchedStems.includes(s.title)) {
        keyPillars.push({ pillarTitle: s.title, type: 'stem' });
      }
    });
    branches.forEach(b => {
      if (pen.matchedBranches.includes(b.title)) {
        keyPillars.push({ pillarTitle: b.title, type: 'branch' });
      }
    });
    if (keyPillars.length === 0) {
      keyPillars.push({ pillarTitle: 'Day', type: 'stem' });
      keyPillars.push({ pillarTitle: 'Month', type: 'stem' });
    }
    lifePillars = keyPillars;
  } else if (hasTension) {
    // 2순위: 지지 현실 극복형
    const tensionDetails = findClashHyeongDetails(branches, dayStem);
    lifeTitle = isKO
      ? `[지지 현실형] 형충파해의 긴장 속에서 단련되는 처세와 생존`
      : `[Branch-realistic Type] Life Refined Under Dynamic Clashes and Tension`;
    
    let detailKo = `귀하의 지지는 충(沖), 형(刑), 파(破) 등 강한 상호 작용과 변동성이 맞물려 있는 '현실 극복형' 구조입니다. 이는 삶의 무대에서 마주하는 긴장감과 예기치 못한 변화를 헤쳐 나가며 강력한 처세술과 서바이벌 능력을 키우게 됨을 뜻합니다. 위기 상황 속에서 오히려 본인의 진짜 강점과 십성의 무기가 발동되어 극적인 역전을 만들어냅니다.`;
    let detailEn = `Your branches are knit with strong structural tensions such as Chung, Hyeong, or Pah, designating you as a "realistic survivor." This implies you refine your tactical adaptability and survival skills by navigating real-world challenges and volatility. Instead of breaking under crisis, your hidden weapons activate to spark dramatic reversals and growth.`;

    if (tensionDetails.explanationKo) {
      detailKo += `\n\n**귀하의 지지에서 상호작용하는 핵심 갈등 구조는 다음과 같습니다:**${tensionDetails.explanationKo}`;
      detailEn += `\n\n**The key structural interactions found in your Earthly Branches are:**${tensionDetails.explanationEn}`;
    }

    lifeDesc = detailKo + individualDetails;
    if (!isKO) lifeDesc = detailEn + individualDetails;

    const keyPillars: { pillarTitle: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch' }[] = [];
    branches.forEach(b => {
      keyPillars.push({ pillarTitle: b.title, type: 'branch' });
    });
    lifePillars = keyPillars;
  } else {
    // 3순위: 사회적 소통형 (Default)
    const lifeElem = dominantElement([
      BAZI_MAPPING.branches[hourBranch  as keyof typeof BAZI_MAPPING.branches]?.element,
      BAZI_MAPPING.branches[monthBranch as keyof typeof BAZI_MAPPING.branches]?.element,
      BAZI_MAPPING.branches[yearBranch  as keyof typeof BAZI_MAPPING.branches]?.element,
    ]);

    const lifeTitleMap: Record<string, string> = {
      Wood:  isKO ? `새로운 무대를 향해 끊임없이 전진하는 ${dayMasterKo}의 삶의 방식` : `Way of life of ${dayMasterKo} constantly advancing towards new stages`,
      Fire:  isKO ? `관계의 중심에서 열정으로 소통하는 ${dayMasterKo}의 삶의 방식` : `Way of life of ${dayMasterKo} communicating with passion at the center of relationships`,
      Earth: isKO ? `신뢰를 쌓으며 천천히 깊어지는 ${dayMasterKo}의 삶의 방식` : `Way of life of ${dayMasterKo} slowly deepening while building trust`,
      Metal: isKO ? `명확한 원칙과 경계로 효율을 극대화하는 ${dayMasterKo}의 삶의 방식` : `Way of life of ${dayMasterKo} maximizing efficiency with clear rules and boundaries`,
      Water: isKO ? `상황을 읽으며 유연하게 흘러가는 ${dayMasterKo}의 삶의 방식` : `Way of life of ${dayMasterKo} flowing flexibly while reading the situation`,
    };

    lifeTitle = lifeTitleMap[lifeElem] || (isKO ? `${dayMasterKo}이 살아가는 방식` : `Way of Life of ${dayMasterKo}`);

    lifeDesc = individualDetails;

    lifePillars = [
      { pillarTitle: 'Month', type: 'branch' as const },
      { pillarTitle: 'Month', type: 'stem' as const }
    ];
    if (hourBranch) {
      lifePillars.push({ pillarTitle: 'Hour', type: 'branch' as const });
    } else {
      lifePillars.push({ pillarTitle: 'Year', type: 'branch' as const });
    }
  }

  // ─────────────────────────────────────────────
  // 3. [부의 흐름] 연산 및 텍스트 구성 (7대 유형 및 3대 지표 개편)
  // ─────────────────────────────────────────────
  const tenGods = result?.analysis?.tenGodsRatio || {};
  const getScore = (keywords: string[]) => {
    return Object.entries(tenGods).reduce((sum, [key, val]) => {
      if (keywords.some(kw => key.includes(kw))) {
        return sum + (val as number);
      }
      return sum;
    }, 0);
  };
  const biGyeop = getScore(['비겁', 'Companion', 'Sibling', 'Rival', 'Mirror']);
  const sikSang = getScore(['식상', 'Artist', 'Rebel', 'Creator']);
  const jaeSeong = getScore(['재성', 'Maverick', 'Architect', 'Wealth']);
  const gwanSeong = getScore(['관성', 'Warrior', 'Judge', 'Officer']);
  const inSeong = getScore(['인성', 'Mystic', 'Sage', 'Resource']);

  const hasSikSang = sikSang > 0;
  const hasJaeSeong = jaeSeong > 0;
  const hasGwanSeong = gwanSeong > 0;

  const expansionScore = Math.round(Math.min(100, Math.max(15, (sikSang * 1.5 + jaeSeong * 1.5))));
  const securityScore = Math.round(Math.min(100, Math.max(15, (inSeong * 1.5 + gwanSeong * 1.5))));
  const pioneeringScore = Math.round(Math.min(100, Math.max(15, biGyeop * 2.5)));

  let expansionAnalysis = '';
  let securityAnalysis = '';
  let pioneeringAnalysis = '';

  if (isKO) {
    if (expansionScore >= 70) {
      expansionAnalysis = `귀하의 재물 팽창력은 **${expansionScore}점**으로 매우 높은 편에 속합니다. 이는 시장의 새로운 트렌드나 기회를 즉각적으로 포착하여 빠르게 수익 기회로 유통해내는 능력이 탁월함을 말합니다. 추진력이 뛰어난 만큼 단기간에 판을 개척하는 능력이 훌륭한 장점을 가집니다. 다만, 때로는 마음이 앞서 너무 성급하게 무리한 베팅을 하다가 불필요한 고정비를 과다하게 유발하거나, 마지막 디테일 관리가 누수되어 벌어들인 만큼의 자금이 한순간에 새어나가는 모순을 겪을 확률이 큽니다. 따라서 벌리는 기동성만큼이나 지출 통제 규칙을 강제로 설정해야 합니다.`;
    } else if (expansionScore >= 35) {
      expansionAnalysis = `귀하의 재물 팽창력은 **${expansionScore}점**으로 안정적인 균형을 이루고 있습니다. 이는 요란한 투기나 무모한 도박을 배제하고, 내가 감당 가능한 현실 범위 내에서 실리적 결과물을 차분하게 축적해 나가는 스타일임을 뜻합니다. 무리수를 두지 않아 자산의 급격한 파탄 리스크가 적은 장점이 있으나, 과감한 투자 결단을 내려야 하는 결정적인 국면이나 시장의 큰 트렌드가 바뀔 때 지나친 신중함으로 인해 아까운 타이밍을 놓치고 남에게 기회를 내어주기 쉽습니다.`;
    } else {
      expansionAnalysis = `귀하의 재물 팽창력은 **${expansionScore}점**으로 다소 신중하고 낮게 계산됩니다. 이는 눈앞의 기회를 쫓아 리스크를 무릅쓰거나, 공격적으로 영업/마케팅 전선에 나서서 판을 벌리는 일을 기피하는 경향을 나타냅니다. 정적인 직무나 고정적인 소득 시스템에 의존하려는 경향이 강해 안정성은 높으나, 새로운 수익 파이프라인(부업, 지식창업 등)을 선도하지 못해 전체적인 소득 증식 속도가 정체되는 한계를 갖습니다.`;
    }

    if (securityScore >= 70) {
      securityAnalysis = `귀하의 재물 방어력은 **${securityScore}점**으로 아주 견고한 철벽을 두르고 있습니다. 이는 자산에 손실이 날 구멍을 철저히 모니터링하며, 리스크 있는 투자 사기나 정서적 동업 차용을 꼼꼼하게 필터링하는 경향성을 뜻합니다. 새어나가는 돈이 없어 자산의 바닥이 단단한 장점이 있으나, 자산을 적극적으로 굴려 부의 레버리지를 일으키는 투자 재배치에 지나친 두려움을 가져 머릿속으로만 계산하다가 현금을 묵혀두어 화폐가치 하락을 겪는 분석 마비에 빠질 우려가 큽니다.`;
    } else if (securityScore >= 35) {
      securityAnalysis = `귀하의 재물 방어력은 **${securityScore}점**으로 보편적이고 안전한 수준입니다. 가계부를 설계하거나 고정비를 관리하는 안정 지향적 감각이 작동합니다. 다만 대규모 계약이나 장기적 동업 구도에서 정교한 계약서를 꼼꼼히 구비해두지 않으면, 최종 수익 배분 단계나 청산 시점에 정서적 신뢰가 깨지며 예기치 못한 세무/법적 마찰로 자산이 묶이는 위험 요소가 잠재되어 있습니다.`;
    } else {
      securityAnalysis = `귀하의 재물 방어력은 **${securityScore}점**으로 다소 취약하게 계산됩니다. 이는 번 소득에 비해 돈을 담아두는 댐의 높이가 부실하여 돈이 물새듯 빠져나가는 경향성을 말합니다. 귀가 얇아 주변 지인의 투자 리딩방 유혹에 휩쓸리거나, 거절을 못 해 돈을 빌려주고도 받지 못하는 일, 혹은 충동적인 스트레스 해소성 소비로 한순간에 통장 잔고가 유실되는 취약점이 있습니다.`;
    }

    if (pioneeringScore >= 70) {
      pioneeringAnalysis = `귀하의 주체적 추진력은 **${pioneeringScore}점**으로 자수성가형 리더의 에너지가 넘쳐납니다. 남에게 지시받거나 귀속되는 종속적 직무를 견디지 못하며, 오직 스스로 기획하고 책임질 때 극대화된 에너지가 뿜어져 나옴을 뜻합니다. 다만 내 주관과 아집(에고)이 너무 단단한 탓에, 파트너의 지혜로운 만류나 시장의 실질적인 경고 지표마저 차단한 채 독불장군식 마이웨이를 걷기 쉽고, 모든 실무를 남에게 맡기지 못해 1부터 10까지 혼자 움켜쥐다 과로를 겪는 모순이 발생합니다.`;
    } else if (pioneeringScore >= 35) {
      pioneeringAnalysis = `귀하의 주체적 추진력은 **${pioneeringScore}점**으로 민주적이고 조화로운 수준입니다. 내 의견을 당당히 펼치며 독자적인 커리어를 주도하되, 주위의 현명한 충고나 파트너십을 유연하게 결합하여 윈-윈 구조를 만들어내는 유연함이 훌륭합니다. 다만, 사업 환경이 매우 혼란스러워질 때 내 강력한 뚝심을 지키지 못하고 타인의 요구에 과도하게 흔들려 비즈니스의 조타권을 상실할 위험성이 있습니다.`;
    } else {
      pioneeringAnalysis = `귀하의 주체적 추진력은 **${pioneeringScore}점**으로 다소 의존적이고 낮게 계산됩니다. 이는 맨땅에서 깃발을 꽂고 홀로 리스크를 짊어지며 사업체를 헤쳐나가는 것을 본능적으로 두려워함을 말합니다. 1인 창업보다는 대형 공공기관, 대기업의 시스템 인프라 그늘 아래 안착하거나, 확실한 가이드라인을 제공해 줄 수 있는 강력한 리더와 손을 잡고 동행할 때 심리적 안정성과 실질적 성취도가 대폭 상승합니다.`;
    }
  } else {
    if (expansionScore >= 70) {
      expansionAnalysis = `Your Wealth Expansion capacity stands at **${expansionScore} points**, indicating an exceptional drive to capture emerging opportunities and transform them into swift cash flows. While you excel at pioneering and starting ventures, you run a risk of ignoring detailed budgeting, leading to overhead leaks or short-term optimization at the expense of long-term stability.`;
    } else if (expansionScore >= 35) {
      expansionAnalysis = `Your Wealth Expansion capacity stands at **${expansionScore} points**, showing a balanced approach. You avoid speculative traps and grow your assets gradually within safe limits. However, your caution might cause you to hesitate during pivotal moments that require bold bets or market leadership.`;
    } else {
      expansionAnalysis = `Your Wealth Expansion capacity stands at **${expansionScore} points**, leaning conservative. You prefer stable routines over chasing market trends. Because you hesitate to launch new side projects or business models, your income levels may experience plateaus.`;
    }

    if (securityScore >= 70) {
      securityAnalysis = `Your Wealth Security level is **${securityScore} points**, providing bulletproof defense. You inspect contracts and scan for scams with extreme detail. However, this high defensive guard can freeze your assets, causing you to accumulate cash rather than reinvesting it for asset expansion.`;
    } else if (securityScore >= 35) {
      securityAnalysis = `Your Wealth Security level is **${securityScore} points**, indicating reasonable defense. You manage cash flow well under normal settings. However, you must ensure all major agreements are formalized in writing to prevent financial disputes or split settlements in partnerships.`;
    } else {
      securityAnalysis = `Your Wealth Security level is **${securityScore} points**, showing vulnerability to asset leaks. You might lose hard-earned capital through emotional loans to friends, speculative scams, or impulsive spending when stressed. Set up automated lock systems to protect your earnings.`;
    }

    if (pioneeringScore >= 70) {
      pioneeringAnalysis = `Your Pioneering Power is **${pioneeringScore} points**, displaying fierce independent drive. You thrive when directing your own ship. However, your strong ego can cause you to dismiss valuable external warnings, or you may fail to delegate, leading to severe burnout.`;
    } else if (pioneeringScore >= 35) {
      pioneeringAnalysis = `Your Pioneering Power is **${pioneeringScore} points**, presenting a balanced ego. You steer your career confidently while integrating advice from trusted partners. However, you might lose your core footing and yield key control to helpers during highly volatile phases.`;
    } else {
      pioneeringAnalysis = `Your Pioneering Power is **${pioneeringScore} points**, favoring system security. Instead of launching a startup alone, your wealth grows safest when plugged into strong corporate platforms, licenses, or working under capable leaders.`;
    }
  }

  // 7대 부의 엔진 유형 판별
  const dmElement = STEM_INFO_LOCAL[dayStem]?.element || 'Earth';
  const wealthTombs: string[] = [];
  if (dmElement === 'Wood') wealthTombs.push('辰', '戌', '丑', '未');
  else if (dmElement === 'Fire') wealthTombs.push('丑');
  else if (dmElement === 'Earth') wealthTombs.push('辰');
  else if (dmElement === 'Metal') wealthTombs.push('未');
  else if (dmElement === 'Water') wealthTombs.push('戌');

  const branchesStr = branches.map(b => b.val);
  const hasWealthTomb = wealthTombs.some(t => branchesStr.includes(t));
  const hourHapsYearBranch = hourBranch ? isHapPair(hourBranch, yearBranch) : false;
  const hasExplosiveTrigger = hasWealthTomb || hourHapsYearBranch;

  const jaeCount = stems.filter(s => s.title !== 'Day' && (computeTenGodLocal(dayStem, s.val, true) === '편재' || computeTenGodLocal(dayStem, s.val, true) === '정재')).length +
                   branches.filter(b => (computeTenGodLocal(dayStem, b.val, false) === '편재' || computeTenGodLocal(dayStem, b.val, false) === '정재')).length;

  let typeTitle = '';
  let pipeline = '';
  let defaultPsychology = '';
  let actionPlans: string[] = [];
  let wealthPillars: { pillarTitle: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch' }[] = [];

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 일간 × 격국 조합별 개인화 파이프라인 생성 함수
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  type WealthEngineType = 'EXPLOSIVE' | 'CIRCULATION' | 'SYSTEM' | 'IP' | 'SHIELD' | 'ARTISAN' | 'SELFMADE';

  const getPipelineByDayStem = (stem: string, engineType: WealthEngineType): string => {
    // 일간별 고유 적성과 격국 유형을 결합한 현대적 파이프라인 추천
    const pipelineMap: Record<string, Record<WealthEngineType, string>> = {
      '甲': {
        EXPLOSIVE:   '대규모 부동산 개발·분양, 숲·생태 관련 ESG 펀드, 타이밍 기반 부동산 레버리지 투자',
        CIRCULATION: '롱폼 콘텐츠 창작(유튜브·책·강의), 목재·자연 소재 제조업, 스타트업 창업자',
        SYSTEM:      '법인 대표·CEO 포지션, 임업·조경·환경 관련 인허가 사업, 플랫폼 가맹 본부',
        IP:          '출판·저작권 에이전시, 브랜드 상표권 라이선싱, 콘텐츠 IP 개발 스튜디오',
        SHIELD:      '1인 법인 독점 계약, 개인 사업체 지분 100% 단독 운영, 자연·로컬 기반 고가 서비스업',
        ARTISAN:     '고난도 목공·조각·공예 장인, 독립 서적 출판, 시나리오·소설 창작',
        SELFMADE:    '프리랜서 기획자·PD, 독립 에이전시 운영, 강의 크리에이터',
      },
      '乙': {
        EXPLOSIVE:   '소형 꽃·식물 시장 레버리지 투자, 경매·공매 소형 부동산, 뷰티·웰니스 브랜드 론칭',
        CIRCULATION: '뷰티·라이프스타일 콘텐츠 크리에이터, 온라인 플라워샵·원예 쇼핑몰, 수공예 아트샵',
        SYSTEM:      '뷰티·헬스케어 프랜차이즈 가맹, 중소 법인 CFO·재무 파트너, 리셀링 플랫폼 유통',
        IP:          '수공예·패턴 디자인 저작권, 뷰티 레시피 라이선싱, 핸드메이드 브랜드 상표권',
        SHIELD:      '소규모 고급 아틀리에 독립 운영, 개인 스튜디오 멤버십 운영, 수익형 소형 임대업',
        ARTISAN:     '플로리스트·패션 디자이너, 인테리어 소품 작가, 독립 일러스트레이터',
        SELFMADE:    '1인 스타일리스트·뷰티 컨설턴트, 소셜 셀러, 핸드메이드 작가',
      },
      '丙': {
        EXPLOSIVE:   '미디어·엔터테인먼트 투자, 태양광·재생에너지 펀드, 핫이슈 브랜드 론칭 타이밍 투자',
        CIRCULATION: '브랜드 홍보 마케터, 유튜브·인플루언서 미디어 채널, 이벤트·공연 기획 에이전시',
        SYSTEM:      '미디어 법인·MCN 설립, 대형 행사 대행사, 공공기관 홍보·광고 입찰 사업',
        IP:          '브랜드 캐릭터·IP 라이선스, 음악·영상 저작권 에이전시, 셀럽·인플루언서 상표권',
        SHIELD:      '개인 브랜드 독립 에이전시, 유명인 전속 계약 매니지먼트, 1인 미디어 법인',
        ARTISAN:     '영화·뮤직비디오 감독, 독립 음악 프로듀서, 무대 조명·연출가',
        SELFMADE:    '유튜버·팟캐스터, 1인 광고 대행사, 이벤트 MC·스피커',
      },
      '丁': {
        EXPLOSIVE:   '아트·공예 작품 경매 투자, 교육 콘텐츠 플랫폼 지분 투자, 소규모 임대 레버리지',
        CIRCULATION: '아트·공예 디지털 콘텐츠, 상담·코칭 프로그램, 전통 기술 온라인 강의',
        SYSTEM:      '상담 센터 법인 운영, 아카데미·교육원 프랜차이즈, 전문 자격증 기반 사무소',
        IP:          '전통 공예·레시피 저작권, 심리·상담 콘텐츠 라이선싱, 예술 작품 NFT화',
        SHIELD:      '전속 계약 기반 독립 상담사, 소규모 공방 단독 운영, 구독형 심층 멘토링',
        ARTISAN:     '한복·도예 등 전통 공예 장인, 화가·캘리그래피 작가, 명상·힐링 콘텐츠',
        SELFMADE:    '1인 코치·상담사, 독립 아카데미 강사, 아트 큐레이터',
      },
      '戊': {
        EXPLOSIVE:   '토지·부동산 대규모 개발 레버리지, 건설·인프라 PF 투자, 물류 창고 임대업',
        CIRCULATION: '부동산 중개·임대 관리, 건설·인테리어 시공, 농업·푸드 유통 비즈니스',
        SYSTEM:      '부동산 법인·지주회사 설립, 대형 건설 하도급 계약, 부동산 개발 디벨로퍼',
        IP:          '토지·건축 기술 특허, 부동산 데이터·솔루션 SaaS, 인테리어 디자인 저작권',
        SHIELD:      '단독 법인 토지 소유, 소형 부동산 포트폴리오 독점 관리, 고급 창고·물류센터',
        ARTISAN:     '전통 건축·석공 장인, 조경 전문가, 흙·자연 소재 아트워크',
        SELFMADE:    '독립 건설 현장 관리, 부동산 컨설턴트, 1인 인테리어 시공 업체',
      },
      '己': {
        EXPLOSIVE:   '농지·전원주택 레버리지 투자, 식품·헬스케어 브랜드 론칭 타이밍 투자, 경매 소형 부동산',
        CIRCULATION: '식품·요식 비즈니스, 생활용품·뷰티 D2C 브랜드, 농업·원예 유통',
        SYSTEM:      '식품·외식 프랜차이즈 가맹, 중소 법인 운영 관리자, 공공 조달·식자재 납품',
        IP:          '레시피·식품 특허, 농업 기술 라이선싱, 생활 브랜드 상표권',
        SHIELD:      '개인 식당·카페 독립 운영, 가족 기업 단독 지분, 소규모 농장 직거래',
        ARTISAN:     '전통 발효식품·도자기 장인, 정원 디자이너, 한식 셰프',
        SELFMADE:    '1인 식품 창업, 독립 식자재 유통, 소규모 케이터링',
      },
      '庚': {
        EXPLOSIVE:   '주식·원자재 레버리지 투자, 제조 설비 대규모 투자, 금속·광물 선물 거래',
        CIRCULATION: '제조·기계 부품 생산, 법률·세무 전문 서비스업, 컨설팅 에이전시',
        SYSTEM:      '제조 법인·공장 설립, 법무·특허 법인, 대형 B2B 공급 계약',
        IP:          '제조 공정 특허, 법률·컨설팅 방법론 저작권, 기술 라이선스 거래',
        SHIELD:      '1인 법인 독점 계약, 전문직 단독 개업(변호사·세무사 등), 기계 임대업',
        ARTISAN:     '금속 공예·칼 제작 장인, 독립 조각가, 금형·정밀 제조 전문가',
        SELFMADE:    '프리랜서 컨설턴트·자문, 1인 제조 공방, 독립 법률·세무 사무소',
      },
      '辛': {
        EXPLOSIVE:   '귀금속·보석 레버리지 투자, 명품·하이엔드 브랜드 투자, 특허 경매·M&A 투자',
        CIRCULATION: '주얼리·명품 리셀링, 전문직 컨설팅, 퍼스널 브랜딩·이미지 컨설팅',
        SYSTEM:      '명품 유통 법인, 전문직 라이선스 기반 프랜차이즈, 미용·뷰티 법인 체인',
        IP:          '디자인·패션 특허, 뷰티 포뮬러 라이선싱, 전문 브랜드 상표권 거래',
        SHIELD:      '하이엔드 1인 전문 서비스(퍼스널 쇼퍼, 프리미엄 컨설팅), 단독 미용실·클리닉',
        ARTISAN:     '보석 세공·주얼리 디자이너, 퍼퓨머, 정밀 공예 장인',
        SELFMADE:    '1인 스타일리스트·이미지 컨설턴트, 독립 디자이너, 프리랜서 에디터',
      },
      '壬': {
        EXPLOSIVE:   '해외 투자·글로벌 펀드, 무역·물류 대규모 레버리지, 핀테크·블록체인 스타트업 투자',
        CIRCULATION: '무역·수출입 에이전시, 글로벌 플랫폼 비즈니스, 물류·유통 중개 서비스',
        SYSTEM:      '무역 법인·수출입 회사, 글로벌 B2B 플랫폼 운영, 해운·물류 법인',
        IP:          '무역 노하우 컨설팅 저작권, 글로벌 SaaS·솔루션 라이선싱, 물류 기술 특허',
        SHIELD:      '개인 무역 독립 에이전시, 단독 온라인 셀링 계정(아마존·쿠팡), 글로벌 1인 비즈니스',
        ARTISAN:     '해양·수중 아트워크, 독립 다큐멘터리 감독, 글로벌 여행 콘텐츠 크리에이터',
        SELFMADE:    '1인 무역업, 독립 글로벌 컨설턴트, 온라인 수출입 셀러',
      },
      '癸': {
        EXPLOSIVE:   '소형 펀드·ETF 레버리지, 정보·데이터 기반 스타트업 투자, 교육 플랫폼 투자',
        CIRCULATION: '데이터 분석·리서치 서비스, 온라인 교육 플랫폼, 심리상담·코칭 콘텐츠',
        SYSTEM:      '정보 서비스 법인, 교육 기관 운영, 데이터 솔루션 B2B 계약',
        IP:          '연구·리서치 저작권, 데이터셋 라이선싱, 심리 검사·교육 콘텐츠 IP',
        SHIELD:      '1인 리서처·분석가 독립 운영, 구독형 뉴스레터·리포트, 개인 연구소',
        ARTISAN:     '독립 작가·시인, 심리 아트 테라피스트, 아카이브·큐레이터',
        SELFMADE:    '1인 데이터 분석가, 독립 교육 강사, 프리랜서 카피라이터·편집자',
      },
    };
    return pipelineMap[stem]?.[engineType] ||
      '전문 기술직 프리랜서, 콘텐츠 기반 1인 비즈니스, 전문 컨설팅 서비스';
  };

  if (hasExplosiveTrigger) {
    typeTitle = isKO ? "[재고귀인 폭발형] 재고(財庫)의 금고를 열어 일구는 폭발적 자산" : "[Tomb-Wealth Explosive Type] Sudden Wealth Vault Unlock";
    pipeline = getPipelineByDayStem(dayStem, 'EXPLOSIVE');
    defaultPsychology = isKO
      ? "당신의 사주에는 재물을 가두고 지키는 거대한 창고인 재고(財庫) 또는 지지 결합 구조가 발달해 있습니다. 평소에는 일반적인 자산 흐름을 유지하다가, 운에서 이를 충하거나 합하여 창고 문을 열 때 일확천금과 같은 비약적인 부를 움켜쥐는 강력한 에너지가 숨어 있습니다."
      : "Your chart holds a cosmic vault (Wealth Tomb) or branch conjunctions. Your asset levels stay normal until a luck cycle clashes or merges to unlock this vault, triggering rapid and explosive financial gains.";
    actionPlans = isKO ? [
      "운(대운/세운)에서 충·합이 들어오는 타이밍을 기다리며 종잣돈을 극단적으로 압축·보존할 것",
      "자잘한 단타 투자나 리딩방 같은 사소한 유혹에 절대 흔들리지 말고 '큰 판'을 설계할 것",
      "자산이 묶이는 부동산이나 장기 채권 형태의 가상 금고를 만들어 스스로 돈을 꺼내 쓰지 못하게 락(Lock)을 걸 것"
    ] : [
      "Patiently compress and preserve your seed money until the luck cycles trigger a clash or union.",
      "Stay away from day-trading or speculative online tips, and focus strictly on large-scale plays.",
      "Lock your funds in illiquid assets like real estate or long-term bonds so you cannot touch them impulsively."
    ];

    branches.forEach(b => {
      if (wealthTombs.includes(b.val)) {
        wealthPillars.push({ pillarTitle: b.title, type: 'branch' });
      }
    });
    if (hourHapsYearBranch) {
      wealthPillars.push({ pillarTitle: 'Hour', type: 'branch' });
      wealthPillars.push({ pillarTitle: 'Year', type: 'branch' });
    }
    if (wealthPillars.length === 0) {
      wealthPillars.push({ pillarTitle: 'Year', type: 'branch' });
    }
  } else if (hasSikSang && hasJaeSeong) {
    typeTitle = isKO ? "[식상생재 순환형] 마르지 않는 재물의 파이프라인과 순환" : "[Expression-to-Wealth Circulating Type] Perpetual Product Cash Pipeline";
    pipeline = getPipelineByDayStem(dayStem, 'CIRCULATION');
    defaultPsychology = isKO
      ? "내 재능과 추진력(식상)이 돈(재성)으로 바로 환원되는 순환 구조를 타고났습니다. 남의 도구를 빌리기보다는 나만의 무기, 아이디어, 창작물 자체를 가치 있는 상품으로 변환해 평생 지속되는 마르지 않는 파이프라인을 다집니다."
      : "You possess a flowing pipeline where your creative output (SikSang) directly transforms into capital (JaeSeong). Success comes from converting your personal ideas, codes, or assets into scalable assets.";
    actionPlans = isKO ? [
      "스스로 만족하는 예술에 그치지 말고 시장 수요와 즉시 결합해 상품화할 것",
      "내 콘텐츠·기술·브랜드를 자동 복제할 수 있는 시스템(온라인 강의, 솔루션 등)으로 확장할 것",
      "일하는 시간을 직접 파는 구조에서 벗어나 지적재산화하는 데 초점을 맞출 것"
    ] : [
      "Ensure your creative work matches actual market demands rather than just personal satisfaction.",
      "Scale your skills into duplicate-friendly assets like templates, courses, or automated tools.",
      "Shift away from trading time for money and focus heavily on intellectual property licensing."
    ];

    stems.forEach(s => {
      if (s.title !== 'Day') {
        const tg = computeTenGodLocal(dayStem, s.val, true);
        if (['식신', '상관', '편재', '정재'].includes(tg)) {
          wealthPillars.push({ pillarTitle: s.title, type: 'stem' });
        }
      }
    });
    branches.forEach(b => {
      const tg = computeTenGodLocal(dayStem, b.val, false);
      if (['식신', '상관', '편재', '정재'].includes(tg)) {
        wealthPillars.push({ pillarTitle: b.title, type: 'branch' });
      }
    });
    if (wealthPillars.length === 0) {
      wealthPillars.push({ pillarTitle: 'Day', type: 'branch' });
      wealthPillars.push({ pillarTitle: 'Month', type: 'branch' });
    }
  } else if (hasJaeSeong && hasGwanSeong) {
    typeTitle = isKO ? "[재생관 시스템형] 시스템과 인프라가 지키는 철벽의 자산" : "[Wealth-to-Officer System Type] Rigid Asset Protected by Corporate Systems";
    pipeline = getPipelineByDayStem(dayStem, 'SYSTEM');
    defaultPsychology = isKO
      ? "돈(재성)이 나를 보호하는 거대한 조직이나 신용망(관성)을 든든하게 받쳐주는 구조입니다. 내 육체 노동보다 대형 플랫폼, 법인 설립, 특허·저작권 라이선스, 또는 공적인 파트너십 같은 '시스템의 그늘' 아래서 자산을 굴려야 안전합니다."
      : "Your wealth (JaeSeong) supports and feeds corporate systems and legal networks (Officer). Instead of high-risk hustling, your wealth compounds safest when placed under systematic shields.";
    actionPlans = isKO ? [
      "직접 모든 실무를 총괄하지 말고 매뉴얼과 규정을 만들어 시스템이 돌아가게 만들 것",
      "회사 신용도와 개인의 브랜드 평판에 대한 관리를 최우선 가치로 둘 것",
      "정기적인 로열티나 고정 임대료 등 규칙적으로 회수되는 캐시카우 형성에 집중할 것"
    ] : [
      "Stop micromanaging operations and write clear standard operating procedures to delegate.",
      "Prioritize your corporate credit score and brand reputation as your most valuable assets.",
      "Focus heavily on recurring revenue streams such as subscription fees or lease yields."
    ];

    stems.forEach(s => {
      if (s.title !== 'Day') {
        const tg = computeTenGodLocal(dayStem, s.val, true);
        if (['편재', '정재', '편관', '정관'].includes(tg)) {
          wealthPillars.push({ pillarTitle: s.title, type: 'stem' });
        }
      }
    });
    branches.forEach(b => {
      const tg = computeTenGodLocal(dayStem, b.val, false);
      if (['편재', '정재', '편관', '정관'].includes(tg)) {
        wealthPillars.push({ pillarTitle: b.title, type: 'branch' });
      }
    });
    if (wealthPillars.length === 0) {
      wealthPillars.push({ pillarTitle: 'Month', type: 'branch' });
      wealthPillars.push({ pillarTitle: 'Year', type: 'branch' });
    }
  } else if (hasJaeSeong && inSeong >= 20) {
    typeTitle = isKO ? "[인성 라이선스형] 특허와 지식재산(IP)의 권리 자산" : "[IP Owner Resource-Wealth Type] Intellectual Document Wealth Engine";
    pipeline = getPipelineByDayStem(dayStem, 'IP');
    defaultPsychology = isKO
      ? "학습과 정보, 혹은 라이선스(인성)가 돈(재성)을 끌어오거나 지키는 자산 구조입니다. 몸을 바쁘게 움직여 영업을 뛰기보다는, 특정한 계약 권리나 학구적 가치, 무형의 스펙을 문서화하여 대가를 받는 것이 소득 효율이 높습니다."
      : "Learning, qualifications, and licensing (Resource) act as the primary magnet and shield for your money. You scale best when converting intellectual competence into legal documents.";
    actionPlans = isKO ? [
      "무형의 노하우를 방치하지 말고 반드시 상표 등록, 특허, 혹은 책 출판 등으로 문서화하여 락을 걸 것",
      "전문가 집단과의 교류를 통해 내 지식의 권위와 가치를 사회적으로 공인받을 것",
      "단기 실무 대행보다 내 지식을 가르치고 라이선스를 부여하는 상위 포지션으로 이동할 것"
    ] : [
      "Always convert your invisible know-how into physical documents like patents, copyrights, or books.",
      "Participate in authoritative expert circles to get your knowledge formally verified.",
      "Shift from consulting execution to teaching and licensing your credentials to others."
    ];

    stems.forEach(s => {
      if (s.title !== 'Day') {
        const tg = computeTenGodLocal(dayStem, s.val, true);
        if (['편재', '정재', '편인', '정인'].includes(tg)) {
          wealthPillars.push({ pillarTitle: s.title, type: 'stem' });
        }
      }
    });
    branches.forEach(b => {
      const tg = computeTenGodLocal(dayStem, b.val, false);
      if (['편재', '정재', '편인', '정인'].includes(tg)) {
        wealthPillars.push({ pillarTitle: b.title, type: 'branch' });
      }
    });
    if (wealthPillars.length === 0) {
      wealthPillars.push({ pillarTitle: 'Month', type: 'branch' });
      wealthPillars.push({ pillarTitle: 'Year', type: 'branch' });
    }
  } else if (biGyeop >= 30 && jaeCount > 0) {
    typeTitle = isKO ? "[군비쟁재 리스크관리형] 내 돈을 사수하여 불리는 자산 보호기" : "[Shielded Partner Risk-Control Type] High-Guard Asset Protection Engine";
    pipeline = getPipelineByDayStem(dayStem, 'SHIELD');
    defaultPsychology = isKO
      ? "나와 동등한 세력(비겁)이 돈을 노리는 구조가 발달하여 동업이나 차용에 있어 손실을 보기 쉬운 명식입니다. 남 좋은 일 시켜주는 돈 탈탈 털리기 버릇을 조심하고, 버는 즉시 부동산이나 강제 저축으로 현금을 묶어 보이지 않게 감추어야 합니다."
      : "The presence of rival stars (BiGyeop) competing for your wealth makes you vulnerable to losses in joint ventures. You must hide and lock your cash into illiquid holdings.";
    actionPlans = isKO ? [
      "아무리 친한 사이여도 동업, 투자 유치, 돈을 빌려주는 거래는 인생에서 원천 차단할 것",
      "수입이 발생하면 현금 통장에 두지 말고 즉시 부동산, 청약, 연금 등 강제 출금 제한 계좌로 이체할 것",
      "내 수입 규모나 투자 자산을 절대로 주변 동료나 친구들에게 떠벌리지 말고 비밀을 유지할 것"
    ] : [
      "Strictly avoid partnerships, co-signing loans, or investing with close friends.",
      "Do not keep cash fluid; deposit earnings directly into restrictive accounts like pension or real estate.",
      "Maintain absolute secrecy about your income and net worth with colleagues and friends."
    ];

    wealthPillars = [
      { pillarTitle: 'Day', type: 'branch' },
      { pillarTitle: 'Month', type: 'branch' }
    ];
  } else if (hasSikSang && jaeCount === 0) {
    typeTitle = isKO ? "[무재 역발상 예술형] 돈을 쫓지 않음으로써 완성되는 예술가형 부" : "[No-Wealth Visionary Artisan] Wealth Compounded by Ignoring Money";
    pipeline = getPipelineByDayStem(dayStem, 'ARTISAN');
    defaultPsychology = isKO
      ? "사주에 돈을 뜻하는 재성 글자가 없어 돈 계산 자체에 얽매이면 행동이 막히는 사주입니다. 하지만 내 '재미'와 '창의력(식상)'에 극단적으로 몰입하여 독보적인 전문 영역을 굳힐 때 돈이 나를 알아서 찾아오는 놀라운 기류를 가집니다."
      : "Lacking Wealth elements, trying to chase profits directly blocks your decision-making. Your income compounds dramatically when you immerse yourself fully in your creativity and craft.";
    actionPlans = isKO ? [
      "수익 모델을 억지로 짜느라 고통받지 말고, 나보다 철저한 파트너나 기계적인 시스템에 돈 관리를 위탁할 것",
      "계약서 작성 및 정당한 대가 청구를 머뭇거리지 말고, 고정된 표준 요율표를 미리 공표해 둘 것",
      "내가 가진 특수한 스킬의 가치를 시장이 알아볼 때까지 한 우물만 깊게 파는 장인 정신을 유지할 것"
    ] : [
      "Do not stress over financial models; delegate cash management to a trusted partner or automated tools.",
      "Pre-establish a standard pricing rate chart to avoid hesitation when billing clients.",
      "Maintain a focused artisan spirit, keeping your specialized craft sharp until the market yields to you."
    ];

    branches.forEach(b => {
      const tg = computeTenGodLocal(dayStem, b.val, false);
      if (['식신', '상관'].includes(tg)) {
        wealthPillars.push({ pillarTitle: b.title, type: 'branch' });
      }
    });
    if (wealthPillars.length === 0) {
      wealthPillars.push({ pillarTitle: 'Month', type: 'branch' });
    }
  } else {
    typeTitle = isKO ? "[비식재 자수성가형] 내 몸과 기술로 일구는 단단한 자산 엔진" : "[Self-Made Engine Type] Autonomous Cash Engine Fueled by Personal Expertise";
    pipeline = getPipelineByDayStem(dayStem, 'SELFMADE');
    defaultPsychology = isKO
      ? "주체성(비겁)과 실행력(식상)을 결합하여 맨땅에서 스스로 가치를 키워내는 자수성가형 명식입니다. 외부 대기업의 인프라나 타인의 혜택에 의존하지 않고 본인의 높은 기준과 실전 감각으로 부딪혀 몸값을 높여 나갈 때 가장 안전합니다."
      : "You possess an autonomous cash engine powered by your own willpower and executing skills. Your wealth compounds safest when you actively scale your personal skills and leverage them.";
    actionPlans = isKO ? [
      "몸값을 무작정 올리기만 하지 말고, 내 기술 노하우를 전자책이나 강좌로 패키징하여 자가 유통망을 만들 것",
      "일에 치여 쓰러지지 않도록 일정한 시간과 에너지를 나만의 루틴 구축과 건강 보존에 투자할 것",
      "내 실무력을 맹신하지 말고 1인 비즈니스를 조금씩 아웃소싱하여 협업 모델로 점진적 확장할 것"
    ] : [
      "Do not just raise your hourly rate; pack your expertise into templates or guides for passive sales.",
      "Protect your physical health and set strict work hours to prevent burnout from solo executions.",
      "Outsource basic administrative tasks step-by-step to free up your high-value creative hours."
    ];

    wealthPillars = [
      { pillarTitle: 'Day', type: 'branch' },
      { pillarTitle: 'Month', type: 'branch' }
    ];
  }

  const wealthTitle = typeTitle;
  const wealthDesc = isKO
    ? `${defaultPsychology}\n\n**📊 추천 현대적 자산 파이프라인**\n${pipeline}`
    : `${defaultPsychology}\n\n**💼 Recommended Pipeline**\n${pipeline}`;

  // C. 현실에서 나타나는 패턴 (격국×일간 맞춤)
  // ─────────────────────────────────────────────
  const signatureTitle = isKO
    ? (SIGNATURE_PATTERN_TITLES[baseProfileCode]?.[dayStem] ||
       SIGNATURE_PATTERN_TITLES['BALANCED']?.[dayStem]    ||
       '삶의 반복되는 패턴 속에 숨겨진 나만의 공식')
    : (SIGNATURE_PATTERN_TITLES_EN[baseProfileCode]?.[dayStem] ||
       SIGNATURE_PATTERN_TITLES_EN['BALANCED']?.[dayStem]    ||
       'Your Signature Formula Hidden in Life\'s Repeating Patterns');

  let realWorldDesc = isKO
    ? (realWorldDescMap[baseProfileCode] || realWorldDescMap['BALANCED'])
    : (REAL_WORLD_DESC_EN[baseProfileCode] || REAL_WORLD_DESC_EN['BALANCED']);

  if (hasDeungRa) {
    realWorldDesc += isKO
      ? `\n\n**등라계갑(藤蘿繫甲)의 귀인 흡인력이 이 모든 패턴 위에 더해집니다.**\n혼자 돌파하려 할 때보다 탁월한 파트너나 멘토와 함께할 때 이 에너지가 배가되어 실현됩니다.`
      : `\n\n**The benefactor pull of Deungra-Gyegap (藤蘿繫甲) is added on top of all these patterns.**\nRather than breaking through alone, this energy is magnified when you collaborate with an outstanding partner or mentor.`;
  }

  return {
    innateTemperament: {
      title: innateTitle,
      description: innateDesc,
      keyPillars: innatePillars,
    },
    lifestylePattern: {
      title: lifeTitle,
      description: lifeDesc,
      keyPillars: lifePillars,
    },
    wealthFlow: {
      title: wealthTitle,
      description: wealthDesc,
      keyPillars: wealthPillars,
      typeTitle,
      pipeline,
      expansionScore,
      securityScore,
      pioneeringScore,
      expansionAnalysis,
      securityAnalysis,
      pioneeringAnalysis,
      actionPlans,
    },
    realWorldPattern: {
      title: signatureTitle,
      description: realWorldDesc,
    },
  };
}

