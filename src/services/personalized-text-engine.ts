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
    coreIdentity: "a giant tree stretching straight toward the sky, holding a **pioneering instinct** and **unbending willpower** in your DNA.",
    innateDesire: "You possess a **strong drive to leave a unique mark** on the world, with a hidden fear of being unrecognized or ignored.",
    strengthInSociety: "Your strength lies in **offering clear direction**, maintaining focus in chaos, and **carrying out responsibilities single-handedly**.",
    shadowSide: "Your **stubbornness** can make collaboration rigid, as you find it hard to compromise or accept other ways of doing things."
  },
  '乙': {
    coreIdentity: "a delicate ivy or wildflower climbing along others, holding a **flexible survival instinct** and **natural coexisting charm**.",
    innateDesire: "You desire to **bloom safely within a stable environment**, harboring a primal fear of being left alone in the wild.",
    strengthInSociety: "Your strength is your **outstanding adaptability** and sociability to blend in, drawing help from strong partners.",
    shadowSide: "You tend to **overly compromise to fit in**, sometimes losing track of your own desires and failing to take a clear stand."
  },
  '丙': {
    coreIdentity: "the brilliant sun in the sky, naturally **sharing warmth** and seeking to **shine at the center of any stage**.",
    innateDesire: "You have a **strong desire to be noticed, appreciated, and recognized**, feeling empty when the spotlight fades.",
    strengthInSociety: "Your **warm charisma and sociability** can instantly brighten up any atmosphere, serving as a valuable social asset.",
    shadowSide: "You feel **anxious and empty** when not in the spotlight, sometimes leading to over-expression or seeking attention."
  },
  '丁': {
    coreIdentity: "a flickering candle light, **quietly illuminating the darkness** for those closest to you with **precision and sincerity**.",
    innateDesire: "You yearn for **sincere connections and deep understanding**, often holding a quiet disappointment towards the busy world.",
    strengthInSociety: "Your **sharp observation, sensitive intuition**, and deep loyalty to those you care about create solid relationships.",
    shadowSide: "Your **sensitive nature** makes you easily hurt, and you tend to suppress emotions rather than speak out."
  },
  '戊': {
    coreIdentity: "a massive mountain, providing a **heavy presence, steady stability**, and broad tolerance to those around you.",
    innateDesire: "You desire to **keep your place securely**, harboring resistance to sudden changes or unverified concepts.",
    strengthInSociety: "Your **reliable presence** keeps relationships and organizations grounded, earning deep trust over time.",
    shadowSide: "Your **resistance to change** and attachment to old methods can delay your growth in a rapidly changing world."
  },
  '己': {
    coreIdentity: "fertile garden soil, naturally **nurturing seeds** with a **strategic mindset** that prepares thoroughly before action.",
    innateDesire: "You pursue **practical results and inner substance** over flashiness, fearing hollow success or unstable foundations.",
    strengthInSociety: "Your ability to **quickly identify and utilize people's strengths**, combined with a sharp sense of reality, is key.",
    shadowSide: "Your **suspicious nature** makes you slow to open up, and you might appear overly calculating or miss opportunities."
  },
  '庚': {
    coreIdentity: "hard steel or raw iron, guided by **unyielding principles and clear standards**, choosing logic over emotion.",
    innateDesire: "You want your **standards to be respected**, feeling highly uncomfortable with compromise, exceptions, or chaos.",
    strengthInSociety: "Your **iron willpower and structured decision-making** excel in organizing chaos and building efficient systems.",
    shadowSide: "Your **bluntness and lack of emotional consideration** can freeze relationships, and you struggle to admit mistakes."
  },
  '辛': {
    coreIdentity: "a refined gem or sharp needle, possessing precise, delicate senses and **aiming for absolute perfection**.",
    innateDesire: "You want to be **recognized in your unique domain**, rejecting mediocrity and always finding your distinct value.",
    strengthInSociety: "Your **detail-oriented observation and high standards** create unmatched professionalism and quality.",
    shadowSide: "Your **high standards** can exhaust both you and others, sometimes leading to self-criticism or hesitation to start."
  },
  '壬': {
    coreIdentity: "a grand river or ocean, containing a vast mind that **constantly flows, adapts**, and seeks new horizons.",
    innateDesire: "You yearn for **freedom and endless expansion**, showing resistance to boundaries, rules, or being boxed in.",
    strengthInSociety: "Your **quick wit, high adaptability**, and strategic vision help you connect naturally with anyone.",
    shadowSide: "You may spread yourself too thin without completing tasks, and you **keep true feelings hidden** from deep commitments."
  },
  '癸': {
    coreIdentity: "clear morning dew or spring water, soft on the surface but seeping in with **profound wisdom and sharp intuition**.",
    innateDesire: "You seek **deep truths and meaning** in life, feeling empty with superficial interactions or mundane routines.",
    strengthInSociety: "Your **sharp intuition to read people** and detect hidden patterns quietly helps you adapt and gather information.",
    shadowSide: "You **overanalyze and hesitate** to make decisions, and keeping thoughts to yourself can create isolation."
  }
};

const BRANCH_INFO_EN: Record<string, { lifeEnvironment: string, behavioralTrigger: string, socialPattern: string, hiddenStruggle: string }> = {
  '子': {
    lifeEnvironment: "a quiet midnight setting, where you enjoy **reflection and inner conversations** away from external noise.",
    behavioralTrigger: "harboring a **strong defense** when your private space is invaded or trust is broken.",
    socialPattern: "preferring a **small circle of deep relationships**, slow to trust but deeply loyal once committed.",
    hiddenStruggle: "suppressing **intense emotional waves** inside while appearing calm on the outside, which can lead to isolation."
  },
  '丑': {
    lifeEnvironment: "frozen earth at winter's end, quietly concealing **strong life forces** that bloom after long patience.",
    behavioralTrigger: "feeling **deep disappointment and frustration** when your hard work goes unrecognized or unrewarded.",
    socialPattern: "silently **carrying out your duties** and preferring stable, practical connections over flashy ones.",
    hiddenStruggle: "accumulating **unexpressed grievances** inside, which may erupt unexpectedly under pressure."
  },
  '寅': {
    lifeEnvironment: "the vigorous energy of early dawn, filled with a **desire to start, pioneer**, and keep moving.",
    behavioralTrigger: "acting **immediately upon new excitement**, but feeling severe boredom with repetitive routines.",
    socialPattern: "thriving in relationships with **influential leaders**, naturally acting as the brave pioneer.",
    hiddenStruggle: "struggling to **finish what you start**, often leaving projects incomplete as your focus shifts."
  },
  '卯': {
    lifeEnvironment: "a spring flower garden, valuing your **own space, delicate sensitivity**, and unique pace.",
    behavioralTrigger: "reacting **strongly when your personal values**, aesthetic standards, or originality are ignored.",
    socialPattern: "sticking to your **own world** rather than conforming, but forming deep bonds with those who understand you.",
    hiddenStruggle: "appearing highly independent while harboring a **deep desire to be understood** by someone."
  },
  '辰': {
    lifeEnvironment: "a sleeping dragon's cave, quiet on the surface but concealing **explosive potential and energy**.",
    behavioralTrigger: "unleashing **massive energy and focus** when a critical opportunity or moment of proof arrives.",
    socialPattern: "showing **strong presence** in key moments and helping to organize chaotic situations.",
    hiddenStruggle: "handling **too many possibilities** at once, leading to internal distraction and lack of focus."
  },
  '巳': {
    lifeEnvironment: "a strategic snake observing in silence, moving **precisely at the most beneficial moment**.",
    behavioralTrigger: "moving actively when a **clear advantage or opportunity** arises, but ignoring meaningless requests.",
    socialPattern: "building **selective relationships** after evaluating the potential and values of others.",
    hiddenStruggle: "concealing your **true feelings** to avoid appearing calculating, making it hard for others to read you."
  },
  '午': {
    lifeEnvironment: "the burning midday sun, direct, honest, and **unable to hide emotions or opinions**.",
    behavioralTrigger: "reacting **instantly to injustice or hypocrisy**, especially when your core values are challenged.",
    socialPattern: "forming a **wide network of friends**, but having frequent clashes with those of different values.",
    hiddenStruggle: "riding **intense emotional rollercoasters**, which can make you appear unpredictable to others."
  },
  '未': {
    lifeEnvironment: "dry earth under the summer sun, focusing on **inner substance and practical results** over appearance.",
    behavioralTrigger: "participating actively when your **worth is recognized** or tangible results are in sight.",
    socialPattern: "valuing **trust and practical help** in relationships, building trust through deeds rather than words.",
    hiddenStruggle: "possessing a **stubborn nature** that makes it hard to accept new directions or others' methods."
  },
  '申': {
    lifeEnvironment: "a sharp sword, featuring a **bright mind and quick analytical skills** to find the best path.",
    behavioralTrigger: "striving to **improve systems** when facing technical challenges or inefficient methods.",
    socialPattern: "preferring **competency-based networks**, thriving in environments with talented peers.",
    hiddenStruggle: "suffering from **impatience**, making hasty decisions or rushing others who move slower."
  },
  '酉': {
    lifeEnvironment: "the tranquility of twilight, pursuing a **refined personal world with strict standards**.",
    behavioralTrigger: "reacting **strongly when your aesthetic standards** or professional judgment are questioned.",
    socialPattern: "slow to open up but building **highly precise and deep connections** that grow stronger over time.",
    hiddenStruggle: "letting your **high standards exhaust you** and others, sometimes creating a cycle of isolation."
  },
  '戌': {
    lifeEnvironment: "an evening field, holding **deep reflection, strong principles, and immense loyalty**.",
    behavioralTrigger: "defending **fiercely when your values** are challenged or those under your protection are threatened.",
    socialPattern: "maintaining relationships with **unchanging loyalty**, standing firmly by those you trust.",
    hiddenStruggle: "holding onto **stubborness and old emotions**, making forgiveness and letting go difficult."
  },
  '亥': {
    lifeEnvironment: "the deep sea, quiet on the surface but holding **massive depth, intuition, and truth** underneath.",
    behavioralTrigger: "diving **head-on when your intuition triggers**, but losing energy in artificial or calculating setups.",
    socialPattern: "reading people's **energies instinctively**, drawn to those with genuine sincerity.",
    hiddenStruggle: "absorbing others' **emotions easily due to vague boundaries**, struggling to separate your own feelings."
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
  const groups: Record<string, { ko: string; en: string; keyPillars: { pillarTitle: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch' }[] }> = {
    '비겁': { ko: '비겁', en: 'Companion (Bi-Geop)', keyPillars: [] },
    '식상': { ko: '식상', en: 'Expression (Sik-Sang)', keyPillars: [] },
    '재성': { ko: '재성', en: 'Wealth (Jae-Seong)', keyPillars: [] },
    '관성': { ko: '관성', en: 'Influence (Gwan-Seong)', keyPillars: [] },
    '인성': { ko: '인성', en: 'Intellect (In-Seong)', keyPillars: [] },
  };

  stems.forEach(s => {
    const tg = s.title === 'Day' ? '비견' : computeTenGodLocal(dayStem, s.val, true);
    let tgGroup = '비겁';
    if (tg === '식신' || tg === '상관') tgGroup = '식상';
    else if (tg === '편재' || tg === '정재') tgGroup = '재성';
    else if (tg === '편관' || tg === '정관') tgGroup = '관성';
    else if (tg === '편인' || tg === '정인') tgGroup = '인성';

    groups[tgGroup].keyPillars.push({ pillarTitle: s.title, type: 'stem' });
  });

  branches.forEach(b => {
    const tg = computeTenGodLocal(dayStem, b.val, false);
    let tgGroup = '비겁';
    if (tg === '식신' || tg === '상관') tgGroup = '식상';
    else if (tg === '편재' || tg === '정재') tgGroup = '재성';
    else if (tg === '편관' || tg === '정관') tgGroup = '관성';
    else if (tg === '편인' || tg === '정인') tgGroup = '인성';

    groups[tgGroup].keyPillars.push({ pillarTitle: b.title, type: 'branch' });
  });

  for (const group of Object.values(groups)) {
    if (group.keyPillars.length >= 3) {
      return {
        nameKo: group.ko,
        nameEn: group.en,
        keyPillars: group.keyPillars,
      };
    }
  }

  return null;
}

function findSiblingRoots(
  dayStem: string,
  branches: { title: 'Day' | 'Month' | 'Year' | 'Hour', val: string }[]
) {
  const keyPillars: { pillarTitle: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch' }[] = [];

  branches.forEach(b => {
    const tg = computeTenGodLocal(dayStem, b.val, false);
    if (tg === '비견' || tg === '겁재') {
      keyPillars.push({ pillarTitle: b.title, type: 'branch' });
    }
  });

  if (keyPillars.length >= 2) {
    return { keyPillars };
  }
  return null;
}

function getTraitDetailText(key: string, score: number, lang: string = 'KO'): string {
  const isKO = lang === 'KO';
  
  if (key === 'creativity') {
    if (score >= 75) {
      return isKO 
        ? `**창의력(${score}점)**이 매우 높아 **기존의 방식을 깨고** 세상에 없던 **독창적인 아이디어와 가치를 창조**하는 데 탁월한 두각을 드러내며`
        : `with **Creativity (${score})** being exceptionally high, allowing you to **break conventional molds** and **pioneer original ideas**;`;
    } else if (score >= 40) {
      return isKO
        ? `**창의력(${score}점)**이 양호하여 기존의 방식들을 영리하게 새롭게 **재조합**하고 실무에서 즉시 활용할 수 있는 **현실적인 아이디어를 응용**하는 능력이 있고`
        : `with **Creativity (${score})** being balanced, enabling you to **combine existing templates** into **practical applications**;`;
    } else {
      return isKO
        ? `**창의력(${score}점)**이 담담하여 허황된 상상보다는 이미 검증되어 있는 탄탄한 매뉴얼과 **성공 규칙을 충실히 실행**하는 안정을 택하며`
        : `with **Creativity (${score})** being low, preferring to **follow structured rules and proven manuals** over speculative changes;`;
    }
  }
  
  if (key === 'expressiveness') {
    if (score >= 75) {
      return isKO
        ? `**표현력(${score}점)**이 매우 강력하여 글, 말, 혹은 감정적 호소력을 동원해 자신의 생각을 상대의 머릿속에 **선명하게 각인시키는 설득력**이 비범하고`
        : `with **Expressiveness (${score})** being very strong, giving you the ability to **vividly project and print** your thoughts into others' minds;`;
    } else if (score >= 40) {
      return isKO
        ? `**표현력(${score}점)**이 적절하여 과장이나 허세 없이 필요한 내용을 **조리 있고 명확하게** 상대방에게 오해 없이 전달하는 실무형 소통이 훌륭하며`
        : `with **Expressiveness (${score})** being decent, enabling **clear and constructive communication** without unnecessary exaggeration;`;
    } else {
      return isKO
        ? `**표현력(${score}점)**이 묵직하여 겉으로 화려하게 자기를 드러내기보다 침묵과 진지한 실천으로 **결과 자체를 묵묵히 증명**해내며`
        : `with **Expressiveness (${score})** being low, choosing to remain quiet and **prove your worth through silent execution** rather than words;`;
    }
  }

  if (key === 'leadership') {
    if (score >= 75) {
      return isKO
        ? `**리더십(${score}점)**이 매우 높아 스스로 책임감 있게 무대의 전면에 나서서 집단과 조직이 나아갈 **큰 그림을 제시하고 진두지휘**하는 데 타고난 카리스마를 발휘하며`
        : `with **Leadership (${score})** being very high, allowing you to **take charge and steer organizations** with **visionary charisma**;`;
    } else if (score >= 40) {
      return isKO
        ? `**리더십(${score}점)**이 완만하여 권위적으로 지배하기보다는 **수평적이고 민주적인 소통**으로 팀원들의 잠재력을 끌어내는 뒤편의 중재자 역할을 잘 해내고`
        : `with **Leadership (${score})** being moderate, leading not by authority but through **cooperative orchestration** of team members;`;
    } else {
      return isKO
        ? `**리더십(${score}점)**이 낮아 전면에 나서는 책임 부담보다는 실무 전문가로서 **나만의 영역을 온전히 구축**하고 임무를 수행하는 데 더 편안함을 느끼며`
        : `with **Leadership (${score})** being low, feeling more at ease performing as a **specialist** rather than carrying the burden of leading others;`;
    }
  }

  if (key === 'decisionMaking') {
    if (score >= 75) {
      return isKO
        ? `**결단력(${score}점)**이 아주 높아 어떤 불확실한 위기나 리스크 속에서도 주저함 없이 **신속하게 핵심을 파고들어** 단호한 실행을 돌파하고`
        : `with **Decision Making (${score})** being very high, enabling **swift, bold choices** and **immediate execution** under pressure;`;
    } else if (score >= 40) { 
      return isKO
        ? `**결단력(${score}점)**이 합리적이어서 정보와 데이터를 충분히 검토하고 비교 분석하여 **가장 안전하고 확실한 대안**을 선택하는 데 탁월하고`
        : `with **Decision Making (${score})** being sensible, carefully balancing options and data before **choosing the safest route**;`;
    } else {
      return isKO
        ? `**결단력(${score}점)**이 신중하여 때로 결정 장애나 우유부단함을 겪을 수 있으나 실수와 실패 리스크를 극소화하는 **돌다리 두드리기** 강점이 돋보이고`
        : `with **Decision Making (${score})** being overly cautious, **minimizing risks of failure** by double-checking all variables;`;
    }
  }

  if (key === 'mental') {
    if (score >= 75) {
      return isKO
        ? `**멘탈(${score}점)**이 대단히 강건하여 혹독한 외부의 압박이나 갈등이 밀려와도 감정적으로 굴복하지 않고 내면의 **평정심과 냉철함**을 지키는 회복탄력성이 넘치며`
        : `with **Mental Strength (${score})** being extremely robust, granting **high resilience** to withstand external pressure without losing focus;`;
    } else if (score >= 40) {
      return isKO
        ? `**멘탈(${score}점)**이 평이하여 보편적인 환경에서는 안정감을 가지나 스트레스 수치가 한계에 달할 때는 나만의 **휴식과 심리적 정화**가 요구되고`
        : `with **Mental Strength (${score})** being average, staying stable under normal situations but requiring **proper reset cycles** when highly stressed;`;
    } else {
      return isKO
        ? `**멘탈(${score}점)**이 매우 섬세하여 환경의 미세한 변화나 타인의 시선에 민감하게 반응하므로 평정심을 지켜줄 든든한 **지지층과 루틴**을 필요로 하고`
        : `with **Mental Strength (${score})** being sensitive, making you vulnerable to external opinions and requiring **protective boundaries**;`;
    }
  }

  if (key === 'responsibility') {
    if (score >= 75) {
      return isKO
        ? `**책임감(${score}점)**이 완벽에 가까워 자기 영역의 성과나 약속을 타협 없이 지켜내며, 아무리 고단해도 조직과 약자를 위해 **끝까지 헌신해내는 신뢰**를 주며`
        : `with **Responsibility (${score})** being absolute, ensuring you **fulfill your commitments to the end**, earning deep respect for your integrity;`;
    } else if (score >= 40) {
      return isKO
        ? `**책임감(${score}점)**이 성실하여 나에게 할당된 직무는 꼼꼼히 소화하되 나의 일상과 건강도 소중히 지키는 스마트한 **라이프 밸런스**를 발휘하며`
        : `with **Responsibility (${score})** being diligent, performing your assigned duties reliably while maintaining **healthy personal boundaries**;`;
    } else {
      return isKO
        ? `**책임감(${score}점)**이 유연하여 스스로 모든 짐을 짊어지려 애쓰기보다 적절한 타이밍에 주위에 도움을 요청하고 **역할을 지혜롭게 분배**할 줄 알며`
        : `with **Responsibility (${score})** being flexible, knowing **when to delegate and share the load** rather than burning out from carrying it alone;`;
    }
  }

  if (key === 'fightingSpirit') {
    if (score >= 75) {
      return isKO
        ? `**승부욕(${score}점)**이 뜨겁게 타올라 어려운 장벽이나 라이벌이 나타날 때 **강한 투지를 불태우며** 목표를 쟁취해내는 승부사 마인드가 강하고`
        : `with **Competitive Drive (${score})** being intense, igniting a **powerful fighting spirit and drive to win** when facing obstacles or rivals;`;
    } else if (score >= 40) {
      return isKO
        ? `**승부욕(${score}점)**이 적절하여 굳이 남을 밟고 올라서기보다 어제의 나 자신을 극복하려는 **평화적이며 건강한 성장**에 초점을 맞추며`
        : `with **Competitive Drive (${score})** being healthy, focusing on **personal growth and self-improvement** rather than fighting others;`;
    } else {
      return isKO
        ? `**승부욕(${score}점)**이 완만하여 대립과 소모적 경쟁을 지양하고 다 함께 시너지를 낼 수 있는 따뜻한 **연대와 타협**을 지향하며`
        : `with **Competitive Drive (${score})** being low, prioritizing **collaboration and mutual alignment** over exhausting rivalry;`;
    }
  }

  if (key === 'nobleSupport') {
    if (score >= 75) {
      return isKO
        ? `**귀인복(${score}점)**이 대단히 훌륭하여 인생의 결정적 위기마다 생각지 못한 스승, 파트너, 혹은 조력자가 나타나 **구원의 물꼬**를 트여주는 혜택을 누리며`
        : `with **Benefactor Luck (${score})** being exceptional, ensuring **supportive mentors, patrons, or opportunities** emerge to guide you through crises;`;
    } else if (score >= 40) {
      return isKO
        ? `**귀인복(${score}점)**이 원만하여 본인의 성실하고 예의 바른 태도를 통해 서서히 **믿음직한 인맥과 동료들의 소중한 지지지**를 획득해내며`
        : `with **Benefactor Luck (${score})** being decent, gradually earning **valuable support and trust** through your polite and honest interactions;`;
    } else {
      return isKO
        ? `**귀인복(${score}점)**에 의지하기보다 오직 내 실력과 의지로 삶의 개척길을 열어가야 하니 강인한 **자수성가형 독립 정신**을 입증하며`
        : `with **Benefactor Luck (${score})** being low, prompting you to build success strictly on your own merits, proving a **self-made resilience**;`;
    }
  }

  if (key === 'peopleReading') {
    if (score >= 75) {
      return isKO
        ? `**사람보는 눈(${score}점)**이 극도로 예리하여 스쳐 지나가는 대화나 눈빛만으로도 상대방의 숨겨진 장단점과 속내를 꿰뚫어보는 **초감각적 인간 통찰**을 가졌으며`
        : `with **Insight into People (${score})** being extremely sharp, allowing you to **read hidden motives and traits** through microscopic cues;`;
    } else if (score >= 40) {
      return isKO
        ? `**사람보는 눈(${score}점)**이 균형을 이루어 열린 태도로 사람들과 소통하면서도 상식을 바탕으로 객관적인 신용도를 합리적으로 **검증해내는 안목**이 있고`
        : `with **Insight into People (${score})** being pragmatic, communicating openly while maintaining logical filters to **assess trustworthiness**;`;
    } else {
      return isKO
        ? `**사람보는 눈(${score}점)**이 소박하여 남들을 지나치게 긍정적으로 믿다가 상처를 받을 수 있으니 계약이나 금전 동업 시 **철저한 팩트 체크**가 필요하며`
        : `with **Insight into People (${score})** being low, cautioning you to **rely on written contracts and facts** rather than blind assumptions;`;
    }
  }

  if (key === 'sensitivity') {
    if (score >= 75) {
      return isKO
        ? `**감수성(${score}점)**이 깊어 예술적 정서, 타인의 마음 상처에 공감하는 온기를 품고 있어 다른 이들이 포착하지 못하는 **미세한 뉘앙스를 섬세히 만져줄 수** 있고`
        : `with **Sensitivity (${score})** being deep, gifting you a **rich artistic sense and emotional empathy** to connect with hidden nuances;`;
    } else if (score >= 40) {
      return isKO
        ? `**감수성(${score}점)**이 건강하여 상대방의 아픔을 공감해주면서도 감정에 매몰되지 않는 **냉철한 균형 감각**을 현명하게 이끌어내며`
        : `with **Sensitivity (${score})** being balanced, offering warm empathy without letting emotions **cloud your logical judgment**;`;
    } else {
      return isKO
        ? `**감수성(${score}점)**이 담백하여 불필요한 감정 소모를 배제하고 객관적인 팩트와 수치, 현실적인 결과 중심의 **냉철한 이성**을 중시하며`
        : `with **Sensitivity (${score})** being low, keeping interactions objective and focusing strictly on **practical facts and results**;`;
    }
  }

  if (key === 'independence') {
    if (score >= 75) {
      return isKO
        ? `**독립심(${score}점)**이 우뚝 서 있어 타인의 잔소리나 지시를 극도로 기피하며, 모든 중요한 행보는 **주체적으로 설계하고 책임**질 때 깊은 주권 행복을 얻고`
        : `with **Independence (${score})** being very high, refusing subordinate constraints and thriving best when **commanding your own path**;`;
    } else if (score >= 40) {
      return isKO
        ? `**독립심(${score}점)**이 성숙하여 내 주관을 뚜렷이 수호하되 타인의 합당한 비판이나 조언은 겸허히 융합할 수 있는 **유연한 에고**를 가지고 있고`
        : `with **Independence (${score})** being balanced, maintaining your values while constructively **integrating others' feedback**;`;
    } else {
      return isKO
        ? `**독립심(${score}점)**이 낮아 혼자 고립되는 것보다 거대한 기업의 인프라, 든든한 멘토, 혹은 **시스템의 조력을 결합**할 때 안정과 성장이 극대화되고`
        : `with **Independence (${score})** being low, thriving best when leaning on **robust systems, partners, or corporate infrastructures**;`;
    }
  }

  if (key === 'patience') {
    if (score >= 75) {
      return isKO
        ? `**인내심(${score}점)**이 아주 두터워 모든 이가 낙담하고 중도 하차하는 지루한 모래밭 싸움 속에서도 기어이 버티며 임계점을 넘는 **끝판왕 끈기**가 강점이며`
        : `with **Patience (${score})** being very high, empowering you to **persist through prolonged hardships** and cross the finish line;`;
    } else if (score >= 40) {
      return isKO
        ? `**인내심(${score}점)**이 현실적이어서 가망 없는 곳에 무작정 존버하기보다는 효율성과 가능성을 영리하게 재서 방향을 틀 줄 아는 **순발력이 조화롭고**`
        : `with **Patience (${score})** being practical, knowing **when to endure and when to pivot** to preserve resources;`;
    } else {
      return isKO
        ? `**인내심(${score}점)**이 급하여 변화 없는 단순 반복을 견디기 어렵지만 빠른 속도와 기동성이 요구되는 단기 임팩트 무대에서 **놀라운 몰입**을 끌어내고`
        : `with **Patience (${score})** being low, finding routine boring but exhibiting **explosive concentration** in fast-paced short-term tasks;`;
    }
  }

  if (key === 'businessSense') {
    if (score >= 75) {
      return isKO
        ? `**사업감각(${score}점)**이 탁월하여 무형의 가치나 상황에서 기회와 돈의 냄새를 맡고 자원을 효율적으로 배분해 현실적 실속을 쓸어 담는 **장사꾼 직감**이 있고`
        : `with **Business Acumen (${score})** being exceptional, letting you **spot market opportunities** and allocate assets to maximize profits;`;
    } else if (score >= 40) {
      return isKO
        ? `**사업감각(${score}점)**이 차분하여 일확천금을 쫓기보다 명확한 저축, 합리적 지출 필터를 작동시켜 가계를 단단히 설계하는 **안정주의 재테크**를 선호하며`
        : `with **Business Acumen (${score})** being stable, avoiding speculative gambles and focusing on **reliable asset accumulation** and management;`;
    } else {
      return isKO
        ? `**사업감각(${score}점)**이 순수하여 오직 이익만을 쫓는 계산적 처세보다는 공익, 도덕적 가치, 혹은 정신적 만족을 우선하는 **따뜻한 인도주의**를 품었고`
        : `with **Business Acumen (${score})** being low, prioritizing **intellectual values, public good**, or artistic growth over calculations;`;
    }
  }

  if (key === 'relationshipLuck') {
    if (score >= 75) {
      return isKO
        ? `**관계운(${score}점)**이 넘치어 특유의 사교성과 호감 가는 처세로 처음 보는 사람과도 금방 벽을 허물며 **풍성한 대인관계를 유지**하는 재주를 보이고`
        : `with **Relationship Luck (${score})** being high, helping you **break boundaries easily** with social warmth and charm;`;
    } else if (score >= 40) {
      return isKO
        ? `**관계운(${score}점)**이 합리적이어서 불필요하게 넓은 인간관계로 에너지를 낭비하지 않고 소수와의 **단단한 정서적 유대**를 실리적으로 지향하고`
        : `with **Relationship Luck (${score})** being average, maintaining healthy distance and focusing on **meaningful, stable connections**;`;
    } else {
      return isKO
        ? `**관계운(${score}점)**이 고독하여 얕고 시끄러운 모임을 거부하고 나만의 사색과 진정한 소수정예 친밀함으로 **불필요한 인간적 피로를 차단**하며`
        : `with **Relationship Luck (${score})** being low, avoiding superficial networking and **preserving your energy** through solitary focus;`;
    }
  }

  return '';
}

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
        const tgEn = TEN_GOD_EN_NAMES[tg] || tg;
        descEn += `\n\n- **Projected ${tgEn} Trait**: ${tenGodPenetrationEn[tg]}`;
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
          customKo = '지지의 물(水)과 불(火)이 격렬하게 충돌하며 **감정과 이성 사이의 심한 온도 차이**를 일으킵니다. 실제 삶에서 **순간적인 열정으로 번개처럼 몰입**했다가도, 어느 순간 차갑게 식어 냉담해져 버리는 **강한 행동적 모순점**이 도드라집니다. 대인관계 역시 **극적인 감정 표현**과 **단호한 침묵/단절**의 양극단을 오가는 패턴이 반복되기 쉽습니다.';
          customEn = 'The collision of Water and Fire in your branches creates a sharp oscillation between rational coldness and emotional passion. You might work with explosive energy, only to shut down and isolate yourself without warning, creating an emotional rollercoaster that puzzles those around you.';
        } else if ((val1 === '寅' && val2 === '申') || (val1 === '申' && val2 === '寅') || (val1 === '卯' && val2 === '酉') || (val1 === '酉' && val2 === '卯')) {
          customKo = '지지의 금(Metal)과 목(Wood)의 결합으로 **시작하는 추진력과 끊어내는 자기검열이 정면 충돌**합니다. 새로운 일이나 프로젝트를 **의욕적으로 벌여놓고도**, 스스로 **"이게 정말 가치 있고 완벽한가?" 하는 차갑고 비판적인 계산**에 휩싸여 주저앉게 됩니다. **시작은 창대했으나 중간에 스스로 검열해 손을 놓아버리는 행동 습관**을 주의해야 합니다.';
          customEn = 'The clash between Metal and Wood pits your pioneering, creative drive against strict self-censorship and rules. Whenever you feel excited to launch a new project, you might immediately scrutinize and doubt your own ability, resulting in self-sabotage or leaving tasks half-finished.';
        } else {
          customKo = '지지의 토(Earth)들이 서로 부딪히며 **내면의 신념과 자존심이 무겁게 요동치는 갈등**을 보입니다. 평소에는 **묵묵히 참고 인내심 깊게 인연이나 조직을 지탱**하는 듯 보이지만, 임계점을 넘어 **나의 사적 선이 침범당하면 걷잡을 수 없이 강박 어린 아집과 고집으로 폭발**합니다. 마음속 깊이 **오래된 서운함과 해묵은 감정 응어리를 품고 혼자 앓는 내면적 모순**을 의식해야 합니다.';
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
    hyeongDescKo += `\n\n- **지지의 역동적 충돌(寅·巳·申 형살)**: 가만히 있으면 도태될 것 같은 불안에 치여 **자신을 극도로 피로하고 급박하게 채찍질하며 속도에 집착하는 습관**이 있습니다. 해결사 노릇을 톡톡히 하지만, **과도한 효율성과 가속도를 곁의 동료에게도 강요**함으로써 **대인공간에서 불필요한 대립과 갈등을 스스로 유발하고 고립을 자초**하는 모순적 행동양식이 활성화됩니다.`;
    hyeongDescEn += `\n\n- **Dynamic Action Penalty (In-Sa-Sin Hyeong)**: The dynamic, fast-moving penalty (Hyeong) in your branches induces impatience and a low tolerance for inefficiency. You might rush processes to secure quick results, leading to oversight or creating friction by demanding the same speed from others.`;
  }
  if (hasChukSulMi) {
    hyeongDescKo += `\n\n- **지지의 축적된 마찰(丑·戌·未 형살)**: 스스로 설정한 법관 같은 완고한 프레임 안에 갇혀, **외부의 건설적인 제언이나 따뜻한 피드백에 대해 차가운 불신과 철벽**을 세우는 경향이 있습니다. 갈등이 생기면 **풀어보려 소통하기보다 가슴속에 앙금을 눌러 담은 뒤 소리 없이 관계를 끊고 고독망 속으로 침잠**해 버리는 행동양식을 성찰할 필요가 있습니다.`;
    hyeongDescEn += `\n\n- **Earth Consolidation Penalty (Chuk-Sul-Mi Hyeong)**: The Earth penalty (Hyeong) introduces a stubborn attachment to your own logic, making it difficult to accept external advice. You tend to swallow grievances silently for long periods, which can culminate in sudden, cold terminations of relationships.`;
  }
  if (hasJaMyo) {
    hyeongDescKo += `\n\n- **지지의 감정적 조율 갈등(子·卯 형살)**: 아주 친밀하고 사적인 연인이나 파트너 관계에서 **"상대가 내 진심 어린 배려와 친절에 눈높이를 맞추지 못한다"며 무기력감과 서운함을 쉽게 느끼는 패턴**이 있습니다. 말 한마디, 행동 속 **미세한 온도의 변화에 가시 돋친 듯 예민하게 반응**하여 인간관계에서 **스스로 상처를 지어내는 악순환**을 다스리는 것이 시급합니다.`;
    hyeongDescEn += `\n\n- **Relational Friction Penalty (Ja-Myo Hyeong)**: The Ja-Myo penalty introduces sensitivity in close relationships. You easily feel neglected or hurt when others do not match your exact standards of consideration, sometimes magnifying minor slights into deep misunderstandings.`;
  }

  // 3. Self-penalty (자형)
  let selfDescKo = '';
  let selfDescEn = '';
  const counts: Record<string, number> = {};
  branches.forEach(b => { counts[b.val] = (counts[b.val] || 0) + 1; });
  const selfPenalties = ['辰', '午', '酉', '亥'].filter(bChar => counts[bChar] >= 2);
  if (selfPenalties.length > 0) {
    selfDescKo += `\n\n- **스스로를 가두고 채찍질하는 자형(${selfPenalties.join(', ')} 중첩)**: 타인이 평가하기 전에 **내가 먼저 심장의 방아쇠를 당기듯 심한 자기검열과 자책**을 선사합니다. 실수에 대한 가혹한 공포심 탓에 **일정 선 이상의 부담을 주는 상황에서는 무의식적으로 에고의 가면을 쓰고 연락을 두절한 채 동굴 속으로 숨어버리는 극단적 완벽주의 행동**을 초래하기 쉽습니다.`;
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
        pahDescKo += `\n\n- **마무리에 다다르면 흔들리는 매듭 불안정(破)**: 초기 실행 단계에서는 놀라운 야심과 속도전으로 진두지휘하지만, **마무리를 장식해야 할 최종 서류 마감이나 뒷수습 구간에서 급격하게 집중력이 증발해 다 망쳐버리는 패턴**이 성화를 냅니다. **마지막 10%의 매듭짓기를 소홀히 여겨 그동안 쌓아올린 막강한 실적의 알맹이를 사소한 누락으로 상실**하기 십상입니다.`;
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

const humanTenGodMap: Record<string, { titleKo: string; descKo: string; titleEn: string; descEn: string }> = {
  '비견': {
    titleKo: '동반자적 주체성',
    descKo: '동등한 관계를 추구하며 독립적으로 자아를 실현하는 강건한 의지',
    titleEn: 'Companion/Independent Ego',
    descEn: 'Strong-willed, structured independence seeking equal relations and autonomy.'
  },
  '겁재': {
    titleKo: '과시/경쟁적 추진력',
    descKo: '타인을 의식하며 강한 정복 욕구와 승부사 기질로 돌풍을 일으키는 능력',
    titleEn: 'Rivalry/Competitive Edge',
    descEn: 'Competitive spark focused on conquest, showing performance driven by rivalry.'
  },
  '식신': {
    titleKo: '풍요로운 탐구와 창작',
    descKo: '한 분야에 깊게 침잠하여 평화롭게 탐미하고 생산성 높은 결실을 맺는 능력',
    titleEn: 'Creative Explorer',
    descEn: 'Deep focus on specialization and crafting, producing rich creative outputs.'
  },
  '상관': {
    titleKo: '표출적인 개성과 달변',
    descKo: '참신한 언변과 반짝이는 재치로 대중의 이목을 끌고 정면 돌파하는 개성',
    titleEn: 'Expressive Maverick',
    descEn: 'Refined self-expression and wit to command attention and challenge conventions.'
  },
  '편재': {
    titleKo: '영토 지배와 스케일',
    descKo: '판을 흔드는 과감한 사업 수단과 입체적인 공간지각력으로 시장을 장악하는 눈',
    titleEn: 'Dynamic Wealth/Pioneer',
    descEn: 'Agile business maneuvering and macro asset exploitation with wide coverage.'
  },
  '정재': {
    titleKo: '정밀하고 성실한 자원 관리',
    descKo: '안전지대를 지키며 꼼꼼한 축재와 안정적인 구조설계로 절대 무너지지 않는 성',
    titleEn: 'Solid Steward/Financier',
    descEn: 'Meticulous asset optimization and steady control over practical structures.'
  },
  '편관': {
    titleKo: '카리스마적 사명감과 통제',
    descKo: '어려운 난제를 독수리처럼 날아와 단칼에 제압하며 선을 지키는 단호함과 책임감',
    titleEn: 'Charismatic Lawgiver',
    descEn: 'Eagle-eyed crisis management and self-sacrifice for a greater duty.'
  },
  '정관': {
    titleKo: '이정표가 되는 평화 관리',
    descKo: '합리적인 신용과 품격 넘치는 약속 이행으로 사회적 표준을 제시하는 공정과 신뢰',
    titleEn: 'Standard-Bearer/Guarantor',
    descEn: 'Rational credibility, institutional stability, and serving as a trusted beacon.'
  },
  '편인': {
    titleKo: '고독한 철학적 깊이',
    descKo: '의심하고 재해석하여 세상의 보이지 않는 비책과 정수를 취하는 깊은 정신성',
    titleEn: 'Esoteric Seeker',
    descEn: 'Skeptical query and deep philosophical lens looking for unconventional truths.'
  },
  '정인': {
    titleKo: '정화하는 학문적 수용력',
    descKo: '풍성한 공감 능력과 지적 스킬을 통해 편안하고 따뜻하게 세상의 사랑을 이끄는 수용성',
    titleEn: 'Nurturing Intellect',
    descEn: 'Graceful receptivity, warm guidance, and absorbing structured knowledge with empathy.'
  }
};

const positionTextMapKo = (pos: 'Day' | 'Month' | 'Year' | 'Hour', type: 'stem' | 'branch'): string => {
  if (type === 'stem') {
    if (pos === 'Day') return '나라는 사람을 대표하는 가장 중심적인 정체성과 기본 성향';
    if (pos === 'Month') return '사회 속에서 내가 드러내고자 하는 가치관과 대외적인 지향점';
    if (pos === 'Year') return '내가 태어나서 자라온 환경으로부터 자연스럽게 스며든 무의식적인 시각';
    return '살아가면서 마지막까지 추구하고 실현하고 싶은 나만의 꿈과 인생 기획안';
  } else {
    if (pos === 'Day') return '가장 가깝고 내밀한 사생활 공간에서 나오는 진짜 생각과 감정 표현 방식';
    if (pos === 'Month') return '직장 생활이나 사회적 무대에서 실제로 보여주는 실천 능력과 행동 방식';
    if (pos === 'Year') return '어린 시절부터 몸에 배어 위기 상황이나 평상시에 무의식적으로 튀어나오는 본능적인 반응';
    return '남들에게 굳이 드러내지 않는 고요하고 개인적인 생각과 야망';
  }
};

const positionTextMapEn = (pos: 'Day' | 'Month' | 'Year' | 'Hour', type: 'stem' | 'branch'): string => {
  if (type === 'stem') {
    if (pos === 'Day') return 'The sovereign anchor of your mind and conscious soul';
    if (pos === 'Month') return 'The heavenly spotlight illuminating your ideals and societal goals';
    if (pos === 'Year') return 'The legacy anchor directing your foundational sense of honor';
    return 'The ultimate vessel where your thoughts manifest into reality';
  } else {
    if (pos === 'Day') return 'Your innermost emotional core and private demeanor';
    if (pos === 'Month') return 'The heavy arena of your actual career and societal environment';
    if (pos === 'Year') return 'The instinctual habits formed since your childhood';
    return 'The reserved silent garden keeping your private dreams and secrets';
  }
};

function getDynamicPositionExplanationKo(
  pos: 'Day' | 'Month' | 'Year' | 'Hour',
  char: string,
  type: 'stem' | 'branch',
  dayGan: string
) {
  // STEMS (天干)
  if (type === 'stem') {
    switch (char) {
      case '甲':
        if (pos === 'Day') {
          return {
            coreIdentity: "하늘을 향해 곧게 뻗는 큰 나무처럼, 남의 눈치나 불필요한 규칙에 얽매이지 않고 **오롯이 나만의 주관과 소신**을 지키며 살아갑니다. 남이 만들어 놓은 안전한 길을 가기보다는 **맨땅에 스스로 새로운 길을 개척하는 적극성**이 나를 지켜주는 가장 원초적인 활력소입니다.",
            innateDesire: "누군가 나를 함부로 깎아내리거나 통제하려 할 때 **강한 거부감과 자존심**이 솟구치며, 세상 속에서 **나만의 개성과 가치를 당당히 증명**하여 독보적인 인정을 받고 싶어 합니다."
          };
        } else if (pos === 'Month') {
          return {
            coreIdentity: "사회적 무대에서 활동할 때 주눅 들거나 망설이지 않고, **과감하게 먼저 한 발자국 내딛는 적극성**을 보입니다. 말보다 **먼저 앞장서는 것을 추구**하며 사람들을 모으고, 얄팍한 기교 대신 **우직하게 내 책임을 다해 실력으로 결과를 증명**하려는 성향입니다.",
            innateDesire: "남의 지시를 수동적으로 따르기보다, **내가 직접 주도하는 추진력**을 바탕으로 **확실한 주도권과 실속**을 일구어내고자 합니다."
          };
        } else if (pos === 'Hour') {
          return {
            coreIdentity: "혼자만의 사색 속에서 언젠가는 **나의 지혜와 구체적인 계획**으로 **나만의 튼튼한 성취와 성공**을 완성하겠다는 원대한 목표를 간직합니다. 나이가 들수록 **더 깊이 신뢰받는 존재**로 우뚝 서고자 합니다.",
            innateDesire: "순간의 요란한 칭찬에 흔들리지 않고, 인생의 후반부에 **가장 가치 있고 나다운 명예**를 조용히 완성하겠다는 **단단한 의지**를 품고 있습니다."
          };
        } else {
          return {
            coreIdentity: "어린 시절의 환경 속에서 '주눅 들지 않고 떳떳하게 **먼저 앞장서는 자세**를 가져야 한다'는 생각이 자연스럽게 몸에 배어, 언제나 **늠름하고 주체적인 태도**로 나타납니다.",
            innateDesire: "눈치 싸움이나 편법에 기대기보다는 **정직하고 올곧게 승부**하여, 누구도 무시할 수 없는 **든든한 삶의 기준점**으로 우뚝 서고 싶어 합니다."
          };
        }
      case '乙':
        if (pos === 'Day') {
          return {
            coreIdentity: "바위를 휘감고 올라 대지를 푸르게 덮는 덩굴처럼, 어떤 어려운 환경에서도 **유연하게 길을 찾아내는 뛰어난 적응력**을 가지고 있습니다. 겉보기에는 부드러워 보이지만, 속으로는 **어떻게든 살아남아 꽃을 피우는 강인한 생명력**을 품고 있습니다.",
            innateDesire: "마음을 편히 기댈 수 있는 **따뜻하고 안전한 동반자와 환경**을 찾고자 하며, 그 안에서 **나만의 섬세한 재능과 감각**을 아낌없이 펼쳐 보이려 합니다."
          };
        } else if (pos === 'Month') {
          return {
            coreIdentity: "조직 안에서 활동할 때 강하게 부딪치기보다는 **부드럽고 영리한 대화와 처세**로 주변 사람들을 내 편으로 만듭니다. 갈등 없이 **나만의 실속과 권한**을 실속 있게 챙겨가는 뛰어난 조율가입니다.",
            innateDesire: "억지로 내 주장을 강요하기보다는 **부드러운 공감대를 형성**하여, 주변 분위기를 **내가 원하는 방향으로 자연스럽게 이끄는 것**을 목표로 삼습니다."
          };
        } else if (pos === 'Hour') {
          return {
            coreIdentity: "혼자만의 내밀한 꿈은 피곤한 경쟁에서 벗어나, **나만의 아기자기하고 품격 있는 취향**을 즐길 수 있는 **아늑한 비밀 정원** 같은 삶을 가꾸는 것입니다.",
            innateDesire: "인생의 후반부에는 무거운 책임의 짐을 내려놓고, **좋아하는 일에 몰두**하며 **마음이 맞는 소중한 사람들과 따뜻한 온기**를 나누는 꿈을 꿉니다."
          };
        } else {
          return {
            coreIdentity: "첫인상이나 평상시 행동에서 **은은하고 상냥하며 온화한 매력**이 풍겨 나옵니다. 상대방에게 경계심을 주지 않고 **친근하게 다가가는 다정함**이 돋보입니다.",
            innateDesire: "불필요하게 날을 세워 적을 만들기보다, 타인의 긴장을 풀고 **나를 도와줄 든든한 조력자**를 주변에 많이 만들어 **서로 도우며 살아가는 안전한 환경**을 지향합니다."
          };
        }
      case '丙':
        if (pos === 'Day') {
          return {
            coreIdentity: "한여름의 눈부신 햇살처럼 **한 점의 뒤끝이나 꿍꿍이도 없이 솔직하고 시원한 성격**을 지녔습니다. 감정이 표정에 정직하게 드러나며, 가는 곳마다 **유쾌하게 분위기를 살려내는 활력소 역할**을 톡톡히 합니다.",
            innateDesire: "세상 속에서 **나만의 존재감을 환히 발휘**하고 **사람들을 유쾌하게 이끌 때** 큰 보람을 느끼며, 구석에서 기죽어 묻히는 것을 참지 못합니다."
          };
        } else if (pos === 'Month') {
          return {
            coreIdentity: "사회 생활에서 자질구레한 계산이나 뒷담화를 넘어서, **대범하고 화통한 성격**으로 조직의 미래 방향을 밝히는 **중요한 리더십이나 해결사 역할**을 하고자 합니다.",
            innateDesire: "침체된 분위기에 **거침없는 활력과 밝은 희망의 비전**을 제시하여, **나만의 역량과 가치를 널리 인정**받고자 하는 열망이 가득합니다."
          };
        } else if (pos === 'Hour') {
          return {
            coreIdentity: "마음속 깊은 곳에서는 세상 사람들을 깜짝 놀라게 할 **창의적이고 혁신적인 생각과 계획**을 항상 품고 있습니다.",
            innateDesire: "평범한 삶에 만족하기보다는 두고두고 **자랑스러워할 족적이나 따뜻한 유산**을 남겨, 오랫동안 **빛나는 인물로 기억되고 싶은 열망**이 있습니다."
          };
        } else {
          return {
            coreIdentity: "어릴 때부터 세상을 **긍정적이고 밝게 바라보는 시각**이 발달하여, 첫인상이 **시원시원하고 마음이 넓어 보여** 사람들에게 쉽게 호감을 줍니다.",
            innateDesire: "어두운 고민에 깊이 빠져들기보다, 어떤 어려움도 **가볍고 대범한 유머**로 털어버리는 **건강하고 씩씩한 태도**를 잃지 않으려 합니다."
          };
        }
      case '丁':
        if (pos === 'Day') {
          return {
            coreIdentity: "어두운 길을 밝혀주는 따뜻한 촛불이나 밤하늘의 은하수처럼, 겉보기엔 조용해도 **날카로운 관찰력과 진정성**을 지닌 탐구자입니다. 얄팍한 거짓이나 가식을 조용히 꿰뚫어 보는 **단호한 주관과 차분한 성품**을 가지고 있습니다.",
            innateDesire: "시끄럽고 얕은 인간관계보다, 마음의 주파수가 맞아 **서로의 상처를 진심으로 다독여주는 소수의 소중한 내 편**을 찾아 오래도록 함께 지켜내고자 합니다."
          };
        } else if (pos === 'Month') {
          return {
            coreIdentity: "직장이나 사회 생활에서 일을 처리할 때, **장인 정신**처럼 사소한 흠집이나 문제를 끝까지 해결해 내어 **가장 완성도 높은 결과물**을 만들어 내는 꼼꼼함을 보여줍니다.",
            innateDesire: "떠들썩하게 앞에 서기보다는 뒤에서 **핵심적인 흐름과 마무리**를 조용히 도맡아 하며, 아무도 내 빈자리를 쉽게 대신할 수 없는 **조용한 조력자이자 중요한 실력자**로서 자부심을 지키고자 합니다."
          };
        } else if (pos === 'Hour') {
          return {
            coreIdentity: "겉보기와 달리 깊은 내면에 품은 꿈은 복잡한 욕심을 내려놓고, **나만의 깊이 있는 전문성과 지식**을 끝까지 파고들어 **자신만의 단단한 내적 자부심**을 지키는 것입니다.",
            innateDesire: "사람들의 무의미한 갈등과 욕망에서 벗어나, **그동안 쌓아온 지혜와 통찰**을 통해 인생 후반에 사람들에게 **진심 어린 조언과 도움을 주는 스승**이 되고자 합니다."
          };
        } else {
          return {
            coreIdentity: "어릴 때의 환경 덕분에 사람의 작은 기분 변화나 눈치를 빠르게 포착하는 **사려 깊은 눈치와 세심함**이 몸에 배어 있습니다. 그리하여 첫인상이 **단정하고 믿음직스럽게** 느껴집니다.",
            innateDesire: "예의 없이 다가오는 무례한 태도를 경계하며, **상호 신뢰와 품격을 오래도록 확인**하면서 함께 평생을 걸쳐 **소중한 관계의 울타리**를 지키고자 합니다."
          };
        }
      case '戊':
        if (pos === 'Day') {
          return {
            coreIdentity: "비바람이 아무리 몰아쳐도 같은 자리를 묵묵히 지키는 거대한 산맥처럼, **한없이 든든하고 신뢰감을 주는 동반자**입니다. **내가 세운 가치관이나 지켜야 할 사람들**을 끝까지 **단호히 지켜내는 든든한 등대** 같은 존재입니다.",
            innateDesire: "내가 가꾼 안전한 영역과 관계가 흔들리거나, 소중한 사람들이 **나를 믿지 못해 떠나는 불안한 갈등 상황**을 막기 위해 **단단하게 지키고 다스리려** 합니다."
          };
        } else if (pos === 'Month') {
          return {
            coreIdentity: "사회 생활이나 일터에서 조급해하지 않고 **묵직하고 믿음직하게 전체 조율을 해내는 중재자이자 기둥 역할**을 훌륭히 수행합니다. 임기응변보다는 **오랜 신용과 정직**으로 사람들의 협력을 이끌어냅니다.",
            innateDesire: "주변 사람들이 흔들리고 다툴 때도 **중심을 굳건히 지키고 서서**, 사람들의 신뢰와 성과를 **자신의 확실한 안전지대로 든든하게 모으려** 합니다."
          };
        } else if (pos === 'Hour') {
          return {
            coreIdentity: "마음속 가장 깊은 안식처에는 온갖 삶의 굴곡을 다 겪어낸 후에도 **조금도 흔들리지 않을 만큼 단단하고 굳건한 삶의 영토**를 착실히 다져가고 있습니다.",
            innateDesire: "일시적인 유행에 흔들리지 않고 인생의 후반까지 **나만의 단단하고 깊이 있는 주관**을 유지하여, 많은 이들이 기대고 조언을 구할 수 있는 **듬직한 기둥이나 조력자**가 되고자 하는 소망이 있습니다."
          };
        } else {
          return {
            coreIdentity: "무의식 속에 매사 여유를 두고 **주변 상황을 차분히 아우르는 포용력**이 깊게 자리 잡고 있습니다. 그래서 첫 만남에서도 **듬직하고 넓은 도량**이 잘 묻어납니다.",
            innateDesire: "쉽게 흔들리지 않는 **듬직한 태도와 안목**으로, 소중한 사람들이 망설임 없이 고민을 털어놓을 수 있는 **편안한 보금자리**가 되어 주려 합니다."
          };
        }
      case '己':
        if (pos === 'Day') {
          return {
            coreIdentity: "씨앗을 안아 풍성한 수확을 내는 부드러운 흙처럼, 무리한 욕심보다 **가까운 사람들과의 관계를 소중히 돌보는 다정다감하고 따뜻한 성품**을 지녔습니다. 낭비를 피하고 실속을 차리며 **내실 있는 성공**을 이루려 합니다.",
            annateDesire: "겉만 화려한 말뿐인 대박보다는, 차곡차곡 모아 **내가 확실하게 관리할 수 있는 알짜 자산과 따뜻한 가정**을 지속적으로 가꾸고 모으려 합니다."
          };
        } else if (pos === 'Month') {
          return {
            coreIdentity: "사회 생활에서 주변의 강약점을 세밀하게 파악하여, **가장 안전하고 효율적으로 일할 수 있는 명확한 가이드라인**을 제시하는 **뛰어난 기획자나 관리자 자질**을 보여줍니다.",
            innateDesire: "자신이 일구어낸 **내실과 권한을 소중히 지키면서도**, 겉으로는 늘 **상냥하고 싹싹하게 협력하여** 주도권을 부드럽게 유지하고자 합니다."
          };
        } else if (pos === 'Hour') {
          return {
            coreIdentity: "혼자 꿈꾸는 평생의 꿈은 치열한 경쟁을 거친 뒤, **가장 따뜻한 보금자리**에서 나만의 취향과 평온한 일상을 **조용히 돌보며 여유를 누리는 것**입니다.",
            innateDesire: "인생의 후반부에는 피곤한 간섭에서 벗어나, **실용적이고 아늑한 나만의 안식처**에서 **하루하루 확실하고 평안한 실속**을 누리겠다는 계획을 품고 있습니다."
          };
        } else {
          return {
            coreIdentity: "성장 과정에서 꼼꼼하고 차분하게 준비하여 실수를 줄이는 **신중하고 똑 부러진 태도**가 몸에 배어 있습니다. 어디서나 **단정하고 빈틈없는 모습**으로 신뢰를 줍니다.",
            innateDesire: "쓸데없이 피곤한 갈등에 엮이지 않고, **내가 충분히 관리할 수 있는 확실한 내 바운더리** 안에서 **행복과 평화를 안정적으로 다지는 것**을 중요하게 생각합니다."
          };
        }
      case '庚':
        if (pos === 'Day') {
          return {
            coreIdentity: "단단하게 제련된 쇠붙이처럼, **신의와 규칙을 최고의 가치**로 여기며 한 번 결심한 목표는 쉽게 굽히지 않는 **올곧고 시원시원한 성품**을 지녔습니다. 꼼수나 타협을 꺼리는 강직함이 돋보입니다.",
            innateDesire: "상황이 애매모호하게 흘러가는 것을 답답해하며, **확실하게 선을 그어 옳고 그름을 가리고** 소중한 사람들을 **안전하게 지켜내고자 굳건하게 나아갑니다**."
          };
        } else if (pos === 'Month') {
          return {
            coreIdentity: "사회 생활이나 조직 속에서 눈치나 비위를 맞추기보다, **비효율적이거나 불합리한 부분을 과감히 도려내어** 시원하게 일을 정리하는 **단호하고 추진력 있는 해결사 기질**을 발휘합니다.",
            innateDesire: "자신의 **단호하고 뚝심 있는 행동력과 일관성**을 정당하게 인정받아 든든한 신뢰를 지키고, **원칙 없이 흘러가는 비효율적인 상황들을 똑 부러지게 바로잡는 것**을 추구합니다."
          };
        } else if (pos === 'Hour') {
          return {
            coreIdentity: "가장 소중히 품은 내면의 목표는 온갖 난관을 돌파하여 **자신만의 확고한 가치와 원칙**을 세우고, 흐트러진 상황을 **질서 있게 바로잡는 것**입니다.",
            innateDesire: "인생 후반부에도 기죽거나 약해지지 않으며, **더욱 단단하고 무게감 있는 모습**으로 주변에 **흔들리지 않는 이정표이자 어른**이 되어 주겠다는 신념을 간직하고 있습니다."
          };
        } else {
          return {
            coreIdentity: "어린 시절 엄격한 도덕과 질서를 중시하는 가풍 아래 자라났습니다. 그래서 첫인상에 **단단한 위엄과 무게감**이 서려 있어, 함부로 대하기 힘든 **신뢰감을 주는 인상**을 풍깁니다.",
            innateDesire: "알맹이 없는 기분 맞추기 대화보다는, **확실한 신뢰와 약속**을 바탕으로 **평생 흔들리지 않는 든든한 가치**를 실천하고자 합니다."
          };
        }
      case '辛':
        if (pos === 'Day') {
          return {
            coreIdentity: "정교하게 다듬어진 투명한 보석처럼, 평범하게 묻어가는 것을 피하고 **나만의 독창적이고 섬세한 가치**를 추구하는 특별한 성정을 지녔습니다. 타인이 쉽게 흉내 낼 수 없는 **세련된 감각과 매서운 집중력**을 보여줍니다.",
            innateDesire: "자신만의 **섬세하고 날카로운 감각과 높은 안목**을 인정받고자 하며, 직접 해낸 결과물에 **단 하나의 흠집도 용서하지 않는 치밀한 완벽주의**를 지향합니다."
          };
        } else if (pos === 'Month') {
          return {
            coreIdentity: "사회 생활과 업무에서 적당히 타협하고 대충 넘기는 방식을 꺼리며, **정확하고 오점 없는 매듭**을 지어 완벽한 결과로 **자신의 실력을 확실하게 보여주려** 노력합니다.",
            innateDesire: "시끄럽게 겉만 포장하기보다는, 누구도 따라올 수 없는 **정교하고 전문성 높은 기량**을 발휘하여 **독보적인 전문가로서 확고한 입지**를 굳히고자 합니다."
          };
        } else if (pos === 'Hour') {
          return {
            coreIdentity: "혼자 품어온 야망은 번잡한 소음에서 벗어나, **오롯이 나만의 깊이 있는 공부나 작품**에 몰두하여 **가치 있는 결과물을 끝끝내 완성해내는 단단함**입니다.",
            innateDesire: "인생의 마지막 순간에도 잡념 없이 **나만의 깨끗하고 정교한 가치**를 고스란히 간직하여, **진정한 보람과 품격 있는 삶**으로 완성하고자 하는 마음입니다."
          };
        } else {
          return {
            coreIdentity: "어릴 적부터 사물의 작은 모순이나 흐름을 빠르게 감지하는 **예리한 통찰력과 섬세한 감수성**을 길러왔습니다. 그리하여 첫인상에 **지적이고 세련되게 정돈된 인상**을 줍니다.",
            innateDesire: "의미 없는 어울림보다 **자신의 격조와 기준**을 지키고자 하며, 내 진정한 가치를 깊이 존중하고 알아주는 사람들과 **깊은 신뢰를 성실히 나누고자** 합니다."
          };
        }
      case '壬':
        if (pos === 'Day') {
          return {
            coreIdentity: "어떤 억압이나 한계도 뚫고 바다로 흘러가는 강물처럼, **끝없이 새로운 변화와 지식의 세계**로 나아가려는 **총명한 탐구심**을 지녔습니다.",
            innateDesire: "좁은 규칙이나 낡은 규율 속에 얽매이는 것을 거부하며, **광활한 세상 속에서 마음껏 자유**롭게 **나다운 큰 날개를 펼쳐 날아가기를** 희망합니다."
          };
        } else if (pos === 'Month') {
          return {
            coreIdentity: "업무나 비즈니스 영역에서 작은 일에 일희일비하지 않고, **먼 미래의 기류와 기회를 넓은 안목으로 바라보며** 판을 짜고 기획을 전개하는 **큰 지혜를 발휘**합니다.",
            innateDesire: "사소한 자리에 만족하기보다 **나만의 독창적인 사업이나 영역**을 만들고 키워, 모든 기회와 자원이 **나를 중심으로 자연스럽게 흐르도록 설계**하고자 합니다."
          };
        } else if (pos === 'Hour') {
          return {
            coreIdentity: "마음 한편에 둔 진짜 소망은 다양한 세상을 직접 경험하며 **나만의 유용한 철학과 삶의 진수**를 마음껏 누리는 **자율적인 도전을 완성하는 것**입니다.",
            innateDesire: "무거운 대외적 직함에서 벗어나, 인생의 후반부에는 **자유롭고 넓은 안목**으로 **영혼을 편안하고 풍족하게 해방하여 완성하는 꿈**을 꿉니다."
          };
        } else {
          return {
            coreIdentity: "무의식 속에 전체 상황을 한발 물러서서 관찰하려는 **대인배 같은 도량**이 서려 있습니다. 그리하여 평소 태도에 **여유가 넘치고 속 깊은 심지**가 잘 드러납니다.",
            innateDesire: "눈앞의 장벽에 부딪히기보다, **흐르는 강물처럼 유연한 지혜**를 발휘하여 원하는 목표에 **가장 부드럽고 안전하게 도달하고자 하는 영민함**이 있습니다."
          };
        }
      case '癸':
        if (pos === 'Day') {
          return {
            coreIdentity: "소리 없이 대지를 적시는 단비처럼, 크게 목소리를 높이지 않아도 **사람들의 마음에 조용히 스며들어** 긍정적인 변화를 일으키는 **부드러운 지혜**를 지녔습니다.",
            innateDesire: "시끄럽고 가벼운 요란함을 경계하며, 세상의 본질과 **숨겨진 가치를 깊이 통찰하고 이해하고자 하는 영리한 탐구욕**을 품고 있습니다."
          };
        } else if (pos === 'Month') {
          return {
            coreIdentity: "사회 생활에서 상대를 강압적으로 대하기보다, **상대의 마음과 감정을 정성껏 어루만져 주며** 자연스럽게 내 편으로 만드는 **세심한 배려와 조율 능력**을 발휘합니다.",
            innateDesire: "겉보기에는 한없이 부드러워 보이지만, 실은 **상황의 핵심 흐름과 정보를 날카롭게 분석**하여 중요한 자리에 **꼭 필요한 실력자로 조용히 실권을 확보**하려 합니다."
          };
        } else if (pos === 'Hour') {
          return {
            coreIdentity: "내면 깊이 그리는 소망은 속세의 무의미한 경쟁을 떠나, **누구도 침범할 수 없는 맑고 깊이 있는 학문이나 예술적 영역**을 완성하여 조용한 평화를 이루는 것입니다.",
            innateDesire: "자신의 주관이 세상의 가치에 휩쓸리지 않도록 잘 지켜내어, **깨끗하고 품격 있는 나만의 삶의 성**을 굳건히 유지하며 마무리하고자 합니다."
          };
        } else {
          return {
            coreIdentity: "어릴 때부터 '행동하기 전에 먼저 충분히 생각해야 안전하다'는 생각이 자라났습니다. 그리하여 첫인상에 **지적이면서도 차분하고 신중한 분위기**가 고스란히 묻어납니다.",
            innateDesire: "불필요하게 부딪혀 충돌하기보다는 **조용하고 끈기 있게 스며드는 방법**을 통해, 원하는 목표를 **결국 평화롭고 완벽하게 이루는 것**을 중시합니다."
          };
        }
      default:
        return {
          coreIdentity: "우주 속에 스민 조화로운 성품으로 차분히 전개해 나갑니다.",
          innateDesire: "안정과 번영을 실천하며 주변과 조화롭게 공존코자 약속합니다."
        };
    }
  }

  // BRANCHES (地支)
  switch (char) {
    case '子':
      if (pos === 'Day') {
        return {
          coreIdentity: "깊은 겨울밤 흐르는 맑은 샘물처럼, **혼자 조용히 사색하고 내면을 탐구하는 시간**을 무척 소중히 여깁니다. 겉으로는 차분해 보여도 내면에는 **세상에 쉽게 드러나지 않는 예리한 관찰력과 깊이**를 지니고 있습니다.",
          innateDesire: "자신의 **소중한 내면 공간과 가치**가 타인의 경솔한 말이나 행동에 의해 **함부로 간섭받거나 얕게 오해받는 것**을 경계하여 든든하게 지키려 합니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "업무나 사회 생활을 할 때 요란하게 나서지 않지만, 남들이 놓치는 **핵심 흐름과 맥락을 파악**하여 **가장 정확하고 조용한 기획과 대안을 제시**하는 뛰어난 브레인 역할을 수행합니다.",
          innateDesire: "실속 없는 화려함보다는 **자신만의 날카로운 실무 역량과 정밀한 완성도**를 인정받아, 누구도 대신할 수 없는 **대체 불가능한 핵심 인력**이 되기를 바랍니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "마음속 깊이 그리는 소망은 복잡한 세상 소음에서 완전히 벗어나, **나만의 관심사나 지적 성취**에 몰두하며 **고요하고 품격 있는 인생 후반부**를 완성하는 것입니다.",
          innateDesire: "복잡하고 어지러웠던 책임에서 가볍게 해방되어, **가장 온전한 자유**를 누리며 **조용하게 마음을 정리하고 마무리하는 것**을 원합니다."
        };
      } else {
        return {
          coreIdentity: "어릴 때부터 어떤 어려운 상황이 닥쳐도 **차분히 마음을 돌아보는 내면의 깊이**를 자연스럽게 길러왔습니다. 평소에는 말이 없어도 **생각의 깊이가 대단히 단단합니다**.",
          innateDesire: "조급하게 서두르다 실수하기보다, **차분히 흐름을 기다렸다가** 가장 정확한 타이밍에 **가진 역량을 시원하게 쏟아내는 신중한 삶**을 중시합니다."
        };
      }
    case '丑':
      if (pos === 'Day') {
        return {
          coreIdentity: "겨울철 단단한 대지 밑에서 봄의 새싹을 묵묵히 기르는 흙처럼, 어떤 어려움이나 시련 앞에서도 쉽게 꺾이지 않는 **단단한 인내심과 묵직한 끈기**를 가지고 있습니다.",
          innateDesire: "쉽게 포기하라는 시선이나 의심에 흔들리지 않고, **자신이 정한 길을 끝까지 뚝심 있게 실천**하여 **시간이 흐를수록 빛을 발하는 결실을 입증**하려 합니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "일터나 프로젝트에서 복잡하고 까다로운 짐을 외면하지 않고, **책임감을 갖고 성실하게 끝까지 파고들어** 결국 **실질적인 성과와 가치**를 일구어내는 뛰어난 실천가입니다.",
          innateDesire: "유행하는 흐름을 가볍게 뒤쫓기보다는, 미래의 안정된 삶을 위해 **한 걸음 한 걸음 알짜배기 자산과 결과**를 정직하게 다져가고자 합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "인생 후반의 가장 진실한 소망은 온갖 노력을 겪은 후에도 **자신을 단단히 지켜줄 든든하고 확실한 기반**을 완성하는 것입니다.",
          innateDesire: "그동안 쌓아온 실력과 신용을 바탕으로, 인생의 마지막에는 **누구도 침범할 수 없는 안전한 울타리**를 만들어 **소중한 이들과 따뜻하고 평온하게 지내는 것**을 갈망합니다."
        };
      } else {
        return {
          coreIdentity: "어릴 적부터 성급히 서두르기보다 차근차근 다지는 쪽이 결국 승리한다는 점을 잘 알고 있습니다. 평소 **말수가 적고 듬직해 보이지만** 내면에는 **따뜻한 우직함**이 자리하고 있습니다.",
          innateDesire: "자신의 실력과 노력을 차곡차곡 축적하여, **진정한 실력이 필요한 핵심 순간**에 **결과로 우직하게 입증해내겠다는 오기**가 작동합니다."
        };
      }
    case '寅':
      if (pos === 'Day') {
        return {
          coreIdentity: "새벽의 어둠을 뚫고 대지로 솟구치는 아침의 **단단한 기상**처럼, 남의 뒤를 따르기보다 **스스로 선두에 서서 돌파해 나가는 추진력**을 지녔습니다.",
          innateDesire: "타인이 정해놓은 답답한 규칙을 부수고, 직접 미지의 들판에 **자신만의 첫 발자국을 남기며 우뚝 서려는 선봉장 기질**입니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "업무나 사회 생활을 할 때 망설이지 않고 **과감하게 일의 뼈대를 구성**하여, 주변 사람들을 **강력하게 이끄는 통솔 본능**을 보여줍니다.",
          innateDesire: "지루한 관행에 얽매여 시간을 끄는 비효율을 **과감히 부숴버리고**, 오직 실력과 결단력으로 **자신만의 전성기를 활짝 여는 것**을 추구합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "내부의 고요한 상자 속 꿈은 영구히 늙지 않는 총명한 모험가로서 세상에 매번 기상천외한 도전과 기획을 펼쳐 성취하는 소년의 자아를 아끼는 것입니다.",
          innateDesire: "인생길 전체에 그 어떤 의욕 소실도 침범하지 못하게, 영원한 개척 열기를 가득 충전하여 결국 내 이름을 세상 한복판에 기둥 깊이 새겨 마치는 일입니다."
        };
      } else {
        return {
          coreIdentity: "어린 날 자랄 때부터 '우물쭈물하다 기회를 가로채인다'는 무의식의 굳건한 신조가 서렸습니다. 평소 성향이 활기 가득하고 매우 빠릿빠릿합니다.",
          innateDesire: "말만 헐하게 지껄이며 판을 질질 끄는 군상들을 정리하고, 웅장한 몸짓 하나로 기선 제압을 완치하여 입지를 고정하는 일입니다."
        };
      }
    case '卯':
      if (pos === 'Day') {
        return {
          coreIdentity: "대지를 비집고 솟아나 새 봄을 알리는 여린 새싹처럼, **나다운 섬세한 감성과 고유한 개성**을 간직한 인물입니다. 겉으론 부드러워 보여도 **자신만의 주관과 감각을 끝까지 지키는 단단함**이 있습니다.",
          innateDesire: "타인의 낡은 조언이나 표준에 휩쓸리지 않으며, **오롯이 내 개성으로 일상을 디자인하고 자유롭게 살아가는 삶**을 갈망합니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "직장에서 기계적으로 반복되는 일에 얽매이기보다, **남다른 미적 감각이나 영리한 아이디어**를 발휘하여 **실속 있고 매력적인 결과**를 만들어 내는 능력을 보여줍니다.",
          innateDesire: "수직적이고 딱딱한 관계망에 얽매여 갇히기보다는, **자신만의 똑 부러지는 기지와 장점**을 살려 **스스로 확실한 성과를 다지는 것**을 지향합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "내밀한 비밀 공간에 간직한 이상향은, **아기자기하고 완벽하게 정돈된 나만의 아늑한 세계**에서 좋아하는 취향과 취미를 **마음 편히 누리는 것**입니다.",
          innateDesire: "바깥의 차가운 경쟁과 자잘한 소동에서 한 걸음 물러나, **내 마음이 편안하게 느끼는 분야에 집중**하며 **안정적인 행복을 즐기는 생**을 소망합니다."
        };
      } else {
        return {
          coreIdentity: "어릴 때부터 외부의 간섭으로부터 나를 지키는 법을 터득해 왔습니다. 첫눈에 **산뜻하고 영리한 느낌**을 주며 **상대방을 친절하게 맞이하는 센스**를 타고났습니다.",
          innateDesire: "강압적이고 무거운 부담을 주는 환경을 유연하게 흘려보내고, **내가 원하는 편안한 속도와 방식**으로 **즐거운 길을 걸어가고자 하는 마음**이 숨어있습니다."
        };
      }
    case '辰':
      if (pos === 'Day') {
        return {
          coreIdentity: "때를 기다리는 하늘의 비룡처럼, 내면에 **넓은 포용력과 큰 안목**을 차곡차곡 축적하며 **중요한 기회를 위해 기량을 벼르는 호방함**을 갖추고 있습니다.",
          innateDesire: "사소하고 지루한 일상에 안주하여 에너지를 낭비하기보다, **인생의 결정적인 기회와 무대**에서 **가진 실력을 당당하게 터뜨리며 도약하고자 하는 큰 꿈**을 잃지 않습니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "일터나 사회 생활에서 낡은 제도를 바로잡고 **획기적인 변화를 이끌어내는 큰 그림의 설계자**입니다. 복잡한 난제를 만나도 **상황의 맥락을 넓게 보고 해결해내는 추진력**이 있습니다.",
          innateDesire: "단순한 지시를 수동적으로 따르기보다, **규모가 큰 비즈니스나 프로젝트를 총괄**하여 **자신의 구상대로 대세를 역동적으로 주도하는 것**을 목표로 합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "내면 깊숙이 그리는 커다란 야망은 기회가 왔을 때 **단 한 번의 결정적인 기획과 행동**으로 **상황의 판도를 흔들 만큼 거대한 성과**를 이루어내는 것입니다.",
          innateDesire: "지엽적인 갈등에 마음을 낭비하지 않고, **나의 전성기와 핵심 기회**가 왔을 때 **평생의 공헌과 능력을 세상에 확실히 인정받고자** 합니다."
        };
      } else {
        return {
          coreIdentity: "어릴 때부터 상황을 넓게 보는 **호방한 도량과 배포**를 키워왔습니다. 어려움이 닥칠수록 **더욱 단단하게 주도력을 발휘하여 앞장서는 기상**이 돋보입니다.",
          innateDesire: "눈앞의 자잘한 다툼을 넘어서, **더욱 가치 있고 넓은 비전을 제시**하여 **주변 사람들을 긍정적인 방향으로 든든하게 이끌어주려** 합니다."
        };
      }

    case '巳':
      if (pos === 'Day') {
        return {
          coreIdentity: "어떤 순간에도 쉽게 감정에 휘둘리지 않으며, **차분하고 예리하게 주변의 흐름**을 살핀 뒤 **가장 확실하고 똑 부러지게 움직이는 영민한 이성**을 타고났습니다.",
          innateDesire: "자신의 **사생활과 주관적인 영역**이 무례하게 침범받는 것을 경계하며, **스스로 세운 높은 기준และ 내실의 조화**를 흐트러짐 없이 유지하고자 합니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "사회 생활에서 크고 작은 문제나 혼선이 생겼을 때, **침착하게 핵심 원인을 규명**하여 **가장 효율적인 방안으로 상황을 완벽하게 수습해내는 역량**을 보입니다.",
          innateDesire: "겉만 화려하고 알맹이가 없는 말이나 허세에 넘어가지 않고, **눈에 보이는 확실한 현실적 실속과 데이터**를 바탕으로 **안정적인 기반을 튼튼히 다지는 것**을 원합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "마음속 조용히 품은 평생의 꿈은 세간의 번잡함에서 벗어나, **나만의 독창적인 기획이나 귀중한 전문성**을 조용히 연구하여 **완벽한 성공과 노후를 마치는 것**입니다.",
          innateDesire: "진심 없는 인간관계에 힘을 빼기보다, **이성적이고 현명한 안목**으로 **인생 후반부를 위한 든든하고 풍요로운 성과**를 조용히 준비하고자 합니다."
        };
      } else {
        return {
          coreIdentity: "어릴 때의 배움 속에서 매사 돌다리도 두드려보고 건너는 **신중함과 예리한 판단력**을 갖추게 되었습니다. **이성적인 차분함 속에 남다른 섬세함**을 동시에 품고 있습니다.",
          innateDesire: "자신의 실속이 없는 지시나 섣부른 약속에 쉽게 끌려다니지 않고, **상황을 면밀하게 헤아려** **내 안전과 소중한 가치를 든든히 지켜내려** 합니다."
        };
      }

    case '午':
      if (pos === 'Day') {
        return {
          coreIdentity: "한낮의 태양처럼 거침없이 솔직하여, **가식이나 거짓을 멀리하고 뒤끝 없이 시원하게 마음을 털어놓는 솔직함**을 자랑합니다. 그 누구도 **순수하고 인간미 넘치는 소통**을 보여줍니다.",
          innateDesire: "자신의 **따뜻한 애정과 밝고 유쾌한 에너지**가 구속당하거나 눌려 지내는 것을 원하지 않으며, **주변 사람들과 환하게 교감하고 즐기는 삶**을 지향합니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "일터에서 해묵은 침체나 무거운 분위기를 한순간에 걷어내며, **동료들에게 활력과 희망찬 비전**을 선물하는 **든든한 리더이자 마스코트 역할**을 훌륭히 해냅니다.",
          innateDesire: "사소한 시기나 어려움을 **과감한 열정과 솔직한 뚝심**으로 헤쳐 나가며, **조직의 믿음직한 중심축**으로 동료들과 함께 든든하게 나아가길 원합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "가장 소중히 간직한 내면의 소망은, **나의 진심과 뜨거운 열정**이 사람들의 막막한 현실을 **따뜻하게 격려하고 이끌어주는 등대**로 기억되는 것입니다.",
          innateDesire: "상황에 따라 쉽게 말을 바꾸는 이기적인 태도를 경계하며, **초심을 잃지 않는 우직한 신념과 진심**으로 **인생 후반부까지 명예롭고 떳떳하게 살아가는 것**을 소망합니다."
        };
      } else {
        return {
          coreIdentity: "어릴 적부터 **투명하고 뒤끝 없는 솔직함과 정직성**이 몸에 배어 있습니다. 기쁠 때나 아쉬울 때나 **감정을 명쾌하고 담백하게 소통하는 것**이 큰 매력입니다.",
          innateDesire: "뒷공작이나 시끄러운 잔머리를 쓰지 않고, **언제나 당당하고 밝은 에너지**로 험난한 길을 씩씩하게 개척하며 **정정당당하게 삶을 설계하려** 합니다."
        };
      }
    case '未':
      if (pos === 'Day') {
        return {
          coreIdentity: "외부의 불안정한 여건 속에서도 **자신이 세운 원칙과 소중한 자산**을 단단히 지켜내는 **강한 인내심과 끈기**를 자랑합니다. 겉치레보다는 **내실과 실속**을 중요하게 챙기는 실용적인 성향입니다.",
          innateDesire: "겉만 요란하고 알맹이 없는 얘기보다는, **내가 직접 관리할 수 있는 손에 잡히는 진짜 성과**와 **가족들의 든든한 안정감**을 차분히 일구려 합니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "사회 생활과 커리어에서 충동적인 결정을 피하고, **한 걸음씩 계획적이고 꼼꼼하게 실질적 성과**를 다져가는 **성실하고 탁월한 실무 능력**을 보여줍니다.",
          innateDesire: "쉽게 반짝이고 사라질 유행보다는, 어떠한 위기가 닥쳐도 흔들리지 않을 **나만의 튼튼한 안전망과 탄탄한 기반**을 견고하게 완성하는 것을 추구합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "인생 후반에 품은 소망은 번잡한 소동에서 벗어나, **그동안 땀 흘려 가꾼 든든한 실속과 성취**가 가득한 **나만의 편안한 공간에서 평화롭게 휴식을 누리는 것**입니다.",
          innateDesire: "무의미하고 소모적인 관계에 마음을 쓰기보다, **평생 성실히 일군 귀중한 결과물**을 잘 지키며 **안락하고 품위 있게 마무리하고자** 합니다."
        };
      } else {
        return {
          coreIdentity: "어릴 때부터 겉치레를 멀리하고 **내실을 탄탄하게 다지는 쪽**이 더 중요하다는 실무적 신조를 키워왔습니다. 평소 **매우 꼼꼼하고 차분한 인상**을 줍니다.",
          innateDesire: "자신을 뒤흔드는 주변 of 가벼운 참견들을 흘려보내고, **스스로 신용하는 든든한 영역**을 **안전하고 풍요롭게 지켜나가고자** 합니다."
        };
      }
    case '申':
      if (pos === 'Day') {
        return {
          coreIdentity: "잘 제련된 칼날처럼 **날카롭고 예리한 판단력과 상황 포착 능력**을 지니고 있습니다. 상황 적응력이 무척 뛰어나며, 기회가 보일 때 **누구보다 기민하게 치고 들어가 성과를 내는 민첩함**을 지녔습니다.",
          innateDesire: "답답하고 오래된 방식에 머물기보다는, **가장 똑 부러지고 세련된 방법**으로 혁신을 꾀하여 **남들보다 한발 앞선 주도권을 잡고자** 합니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "사회 생활이나 조직에서 복잡하게 얽힌 문제들을 단숨에 풀어내어, **최고의 효율과 성과**로 깔끔하게 처리하는 **능력 있는 해결사 역할**을 톡톡히 해냅니다.",
          innateDesire: "주변이 우왕좌왕할 때 **한발 앞선 기막힌 돌파구를 제시**하여, 일을 성공시키고 **자신의 유능함을 당당히 드러내 인정받고자** 합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "내면 깊숙이 지닌 평생의 꿈은 오랫동안 연마한 **나만의 탄탄한 전문성이나 비기**를 활용하여, 중요하고 실용적인 성과에서 **독보적인 위치를 조용히 완성하는 것**입니다.",
          innateDesire: "시간이 흘러도 녹슬지 않는 **날카로운 전문성과 아이디어**를 유지하여, 인생 후반에도 **어려운 문제를 단숨에 풀어내는 기둥**으로 쓰임 받고자 합니다."
        };
      } else {
        return {
          coreIdentity: "어릴 적부터 기민하게 행동하여 확실히 준비해야 한다는 감각을 익혀왔습니다. 그래서 **상황 판단과 행동이 매우 신속하며** 첫인상에서 **스마트하고 명민한 기운**을 강하게 뿜어냅니다.",
          innateDesire: "지지부진하고 지체되는 방식에 나를 맞추지 않고, **가장 정확하고 군더더기 없는 방법**으로 **원하는 목표를 선점하여 능력을 당당히 증명**하고자 합니다."
        };
      }
    case '酉':
      if (pos === 'Day') {
        return {
          coreIdentity: "단 한 점의 흠집도 용납하지 않는 투명한 다이아몬드처럼, **극도로 정밀하고 높은 격조**를 지향하며 **세상이 나를 쉽게 규정하지 못하도록 완벽하게 처신하고 지키는 성정**입니다.",
          innateDesire: "자신의 가치관과 원칙이 **애매하게 타협되거나 흔들리는 것을 꺼리며**, 일의 결과물에서도 **빈틈없는 깔끔함으로 진정한 격식과 실력을 입증**하려 합니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "직무를 수행할 때 가짜 시늉이나 대충 때우는 요령을 예리하게 간파하며, **단단하고 정교한 완성도**를 구현하여 동료들에게 **모범이 될 확실한 결과**를 보여줍니다.",
          innateDesire: "수많은 일을 적당히 하기보다 **단 하나를 완벽하게 정교히 깎아내어**, 누구도 쉽게 넘볼 수 없는 **독보적인 전문성을 널리 공인받고자** 합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "내밀하게 지니는 장기적 소망은 자신만의 **예리한 예술적 감각이나 전문 기량**을 성실히 길러, 평생 **명예로운 최고의 가치 하나**를 온전히 이루어내는 것입니다.",
          innateDesire: "피곤하고 세속적인 욕심에 마음을 뺏기기보다는, 인생의 후반까지 **진정으로 정교하고 우아한 나만의 질서**를 **흐트러짐 없이 단단하게 유지하며 마무리하고자** 합니다."
        };
      } else {
        return {
          coreIdentity: "성장 과정 속에서 주위를 단정하고 조화롭게 관리하는 엄격한 기준을 키워왔습니다. 첫눈에 **기품 있고 똑 부러지게 정돈된 지적 매력**을 건냅니다.",
          innateDesire: "경솔하게 다가오는 사람들에게 쉽게 마음의 문을 열지 않고, **내 진정한 가치관과 생각을 존중해 주는 깊은 인연**과만 **단단하고 깊이 있는 소통**을 나누려 합니다."
        };
      }
    case '戌':
      if (pos === 'Day') {
        return {
          coreIdentity: "눈앞의 이익이나 유혹에 흔들리지 않으며, **소중히 간직한 원칙과 나를 믿어준 사람들**을 한결같이 따뜻하고 **든든하게 지켜내는 다정하고 우직한 수호자**입니다.",
          innateDesire: "나의 **소중한 안식처와 지인들**이 상처받거나 훼손되는 것을 꺼리며, **어떠한 난관 속에서도 변치 않는 단단한 연대와 신용**을 실천하고 싶어 합니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "주변 상황이 혼란스럽거나 이해타산에 따라 움직일 때도, **자신이 소속된 조직의 가치와 기강을 올곧게 지키며** 사람들에게 **가장 믿음직한 주춧돌**이 되는 저력을 보입니다.",
          innateDesire: "사소한 눈앞의 이익에 따라 쉽게 흔들리기보다, **어려운 국면 속에서도 내 동료와 가족**을 **끝까지 든든하게 지켜주는 울타리**가 되어 주려 합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "내면 깊숙이 지닌 신념은 어떠한 상황에서도 **자신과의 떳떳한 약속과 소신**을 끝까지 잃지 않고 **한결같이 당당하고 멋지게 살아가는 것**입니다.",
          innateDesire: "어려울 때도 **우정과 신의**를 지키려 노력하며, 인생의 후반부에 **스스로 한결같았노라 떳떳하게 돌아볼 수 있는 명예로운 마침표**를 찍고 싶어 합니다."
        };
      } else {
        return {
          coreIdentity: "어릴 적부터 신용과 약속을 소중히 하는 가품 속에서 든든하게 자라났습니다. 평소 **말이 많지 않아도 든든한 행동**으로 주변에 **큰 신뢰와 따뜻한 안정감**을 건냅니다.",
          innateDesire: "겉과 속이 다르거나 상황에 따라 말을 쉽게 바꾸는 이들을 경계하며, **한결같이 따뜻하고 단단한 신뢰와 정직**을 바탕으로 **소중한 관계망**을 평화롭게 이어가려 합니다."
        };
      }
    case '亥':
      if (pos === 'Day') {
        return {
          coreIdentity: "드넓은 심해처럼 가벼운 겉모습 이면에 숨겨진 **상황의 진짜 흐름과 본질을 꿰뚫어 보는 남다른 통찰**을 지녔습니다. 얄팍한 시끄러움보다 **고요하고 깊은 진리에 깊이 몰두하는 지혜**가 있습니다.",
          innateDesire: "의미 없이 서로의 시시비비를 가리는 피곤한 구도에서 벗어나, **나만의 풍요롭고 넓은 지적 공간**에서 **삶의 진짜 정수와 평화를 찾고자** 합니다."
        };
      } else if (pos === 'Month') {
        return {
          coreIdentity: "직장이나 사회 생활에서 눈앞에 보이는 표면보다 **그 뒤에 깔린 거대한 판도와 변화**를 영민하게 읽어냅니다. 요란하지 않게 **나만의 실질적인 실무와 영향력**을 준비하는 영리한 전략가입니다.",
          innateDesire: "딱딱한 형식이나 권위주의적인 지시에 숨 막혀하기보다, **흐르는 물처럼 유연하게 조율하는 장기**를 살려 조직에 **없어서는 안 될 지혜로운 주축**이 되고자 합니다."
        };
      } else if (pos === 'Hour') {
        return {
          coreIdentity: "내면 깊이 그리는 최종적인 소망은 번거로운 욕망과 소동에서 벗어나, **더욱 깊은 사색과 연구**에 집중하며 **나만의 가치와 마음의 평온**을 고스란히 간직하는 것입니다.",
          innateDesire: "바쁜 책임과 의무의 짐을 훌훌 털고, **드넓고 고요한 영혼의 자유** 속에서 **아름답고 보람차게 삶을 정리하고 마감하는 것**을 동경합니다."
        };
      } else {
        return {
          coreIdentity: "어릴 적부터 어떤 어려운 갈등이나 마찰도 **넓은 아량으로 보듬고 해결해내는 너그러운 포용력**을 길러왔습니다. 평소 **매우 차분하고 여유로워** 보이지만 내면에는 **묵직한 지혜**가 담겨있습니다.",
          innateDesire: "자잘한 규제나 간섭으로 나를 가두려는 시도를 부드럽게 무력화하며, **나만의 자유롭고 유연한 방식**으로 **원하는 성공을 평화롭게 거두려** 합니다."
        };
      }
    default:
      return {
        coreIdentity: "조용하고도 우직하게 세상을 마주하며 본연의 걸음을 걷습니다.",
        innateDesire: "나만의 소중한 울타리를 보살피며 건강하게 자립하고 공헌합니다."
      };
  }
}
const getStemDetail = (pos: 'Day' | 'Month' | 'Year' | 'Hour', char: string, dayGan: string, isKO: boolean) => {
  const personality = STEM_PERSONALITIES[char] || { koName: char, coreIdentity: '', innateDesire: '', strengthInSociety: '', shadowSide: '' };
  const infoEn = STEM_INFO_EN[char] || { coreIdentity: '', innateDesire: '', strengthInSociety: '', shadowSide: '' };
  const tenGod = computeTenGodLocal(dayGan, char, true);
  const tenGodHuman = humanTenGodMap[tenGod] || { titleKo: '고유성', descKo: '', titleEn: 'Uniqueness', descEn: '' };

  const posNameKo = pos === 'Day' ? '일간' : pos === 'Month' ? '월간' : pos === 'Year' ? '년간' : '시간';
  const posNameEn = pos === 'Day' ? 'Day Master' : pos === 'Month' ? 'Month Stem' : pos === 'Year' ? 'Year Stem' : 'Hour Stem';

  let coreIdentityKo = personality.coreIdentity || '';
  let innateDesireKo = personality.innateDesire || '';

  if (isKO) {
    const dynamicExplanation = getDynamicPositionExplanationKo(pos, char, 'stem', dayGan);
    coreIdentityKo = dynamicExplanation.coreIdentity;
    innateDesireKo = dynamicExplanation.innateDesire;
  }

  return {
    pos,
    type: 'stem' as const,
    char,
    name: isKO ? (personality.koName || char) : (STEM_EN_NAMES[char] || char),
    posNameKo,
    posNameEn,
    posDescKo: positionTextMapKo(pos, 'stem'),
    posDescEn: positionTextMapEn(pos, 'stem'),
    coreIdentityKo,
    coreIdentityEn: infoEn.coreIdentity || '',
    innateDesireKo,
    innateDesireEn: infoEn.innateDesire || '',
    tenGodNameKo: tenGod,
    tenGodNameEn: TEN_GOD_EN_NAMES[tenGod] || tenGod,
    tenGodHumanKoTitle: tenGodHuman.titleKo,
    tenGodHumanKoDesc: tenGodHuman.descKo,
    tenGodHumanEnTitle: tenGodHuman.titleEn,
    tenGodHumanEnDesc: tenGodHuman.descEn
  };
};

const getBranchDetail = (pos: 'Day' | 'Month' | 'Year' | 'Hour', char: string, dayGan: string, isKO: boolean) => {
  const personality = BRANCH_PERSONALITIES[char] || { koName: char, lifeEnvironment: '', hiddenStruggle: '', socialPattern: '' };
  const infoEn = BRANCH_INFO_EN[char] || { lifeEnvironment: '', hiddenStruggle: '', socialPattern: '' };
  const tenGod = computeTenGodLocal(dayGan, char, false);
  const tenGodHuman = humanTenGodMap[tenGod] || { titleKo: '고유성', descKo: '', titleEn: 'Uniqueness', descEn: '' };

  const posNameKo = pos === 'Day' ? '일지' : pos === 'Month' ? '월지' : pos === 'Year' ? '년지' : '시지';
  const posNameEn = pos === 'Day' ? 'Day Branch' : pos === 'Month' ? 'Month Branch' : pos === 'Year' ? 'Year Branch' : 'Hour Branch';

  let coreIdentityKo = `${personality.lifeEnvironment || ''} ${personality.hiddenStruggle || ''}`.trim();
  let innateDesireKo = personality.socialPattern || '';

  if (isKO) {
    const dynamicExplanation = getDynamicPositionExplanationKo(pos, char, 'branch', dayGan);
    coreIdentityKo = dynamicExplanation.coreIdentity;
    innateDesireKo = dynamicExplanation.innateDesire;
  }

  return {
    pos,
    type: 'branch' as const,
    char,
    name: isKO ? (personality.koName || char) : (BRANCH_EN_NAMES[char] || char),
    posNameKo,
    posNameEn,
    posDescKo: positionTextMapKo(pos, 'branch'),
    posDescEn: positionTextMapEn(pos, 'branch'),
    coreIdentityKo,
    coreIdentityEn: `${infoEn.lifeEnvironment || ''} ${infoEn.hiddenStruggle || ''}`.trim(),
    innateDesireKo,
    innateDesireEn: infoEn.socialPattern || '',
    tenGodNameKo: tenGod,
    tenGodNameEn: TEN_GOD_EN_NAMES[tenGod] || tenGod,
    tenGodHumanKoTitle: tenGodHuman.titleKo,
    tenGodHumanKoDesc: tenGodHuman.descKo,
    tenGodHumanEnTitle: tenGodHuman.titleEn,
    tenGodHumanEnDesc: tenGodHuman.descEn
  };
};

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

  const dayStem = dayPillar?.stem || '';
  const dayBranch = dayPillar?.branch || '';
  const monthStem = monthPillar?.stem || '';
  const monthBranch = monthPillar?.branch || '';
  const yearStem = yearPillar?.stem || '';
  const yearBranch = yearPillar?.branch || '';
  const hourStem = hourPillar?.stem || '';
  const hourBranch = hourPillar?.branch || '';

  const dayMasterStem = dayStem;
  const dayMasterKo = dayPillar?.stemKoreanName || '';
  const dayMasterEn = dayPillar?.stemEnglishName || '';

  const stems: { title: 'Day' | 'Month' | 'Year' | 'Hour'; val: string }[] = [
    { title: 'Day', val: dayStem },
    { title: 'Month', val: monthStem },
    { title: 'Year', val: yearStem },
    { title: 'Hour', val: hourStem }
  ].filter(s => !!s.val) as any;

  const branches: { title: 'Day' | 'Month' | 'Year' | 'Hour'; val: string }[] = [
    { title: 'Day', val: dayBranch },
    { title: 'Month', val: monthBranch },
    { title: 'Year', val: yearBranch },
    { title: 'Hour', val: hourBranch }
  ].filter(b => !!b.val) as any;

  const hapNet = findHapNetwork(stems, branches);
  const overload = findOverloadedTenGods(dayStem, stems, branches);
  const siblingRoot = findSiblingRoots(dayStem, branches);

  let innateTitle = '';
  let innateDesc = '';
  let innatePillars: { pillarTitle: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch' }[] = [];

  const overloadAdvantageKo: Record<string, string> = {
    '비겁': '타인의 시선이나 간섭에 휘둘리지 않고 나만의 소신과 투지로 돌파구를 일구는 단단한 자립력과 주체적인 의지',
    '식상': '틀에 갇히지 않고 새로운 아이디어와 혁신적인 돌파구를 마음껏 기획하며 능동적으로 가치를 완성해내는 독창적인 기획력',
    '재성': '복잡하고 어지러운 상황 속에서도 실질적인 성과와 현실적인 이득을 냉철하게 포착하고 한결같이 마무리해내는 뛰어난 현실 대처력',
    '관성': '어떤 위기 속에서도 자신이 약속한 책임을 끝끝내 마주하며, 조직 속에서 묵묵히 신용과 명예를 지켜내는 숭고한 통제력',
    '인성': '조급하게 반응하기보다 넓은 마음으로 현상을 수용하며, 깊이 있는 지적 재능과 철학적 안목으로 핵심을 헤아리는 고도의 통찰력'
  };

  const overloadShadowKo: Record<string, string> = {
    '비겁': '나의 고집이나 경쟁의식만 부리다가 소중한 지인과 파트너들의 합리적인 조언을 완전히 외면하고, 손해를 보더라도 자존심 때문에 독단적으로 행동을 밀어붙이게 되는 완고함',
    '식상': '마음속 생각을 정제되지 않은 언어로 충동적으로 내뱉어 타인과의 오래된 신뢰를 한순간에 그르치거나, 기성 조직이나 상식적인 선을 불필요하게 어기며 감정적인 편을 가르게 되는 모습',
    '재성': '눈앞에 당장 쥐어지는 확실한 수치나 실익에 지나치게 얽매여, 가장 소중한 주변 사람들과의 따뜻한 인간적 호의와 마음의 교류를 단순한 득실로 치부하다가 서운함과 불신을 사고 마는 실리 위주의 태도',
    '관성': '스스로 감당하기 힘들 정도로 과도한 의무감과 타인의 평판에 사로잡혀 자신을 가혹하게 검열하며 지치게 만들고, 주변 사람들에게까지 무거운 규율과 가차없는 잣대를 들이대며 가로막는 엄격함',
    '인성': '실제 현장에서 두 발로 실행하기보다 지나치게 복잡한 고민과 사색, 또는 마음의 부정적인 염려에 먼저 주저앉아, 눈앞의 소중한 타이밍을 놓치고 타인의 선의조차가 왜곡해서 받아들이며 정체되는 모습'
  };

  let categoryTitle = '';
  let categoryDesc = '';

  if (hapNet) {
    categoryTitle = isKO 
      ? `[연합 에너지] 여러 기운이 힘을 합쳐 발휘하는 강력한 집중력` 
      : `[Union Network] Powerful Alignment Crafted by Cosmic Conjunction`;
    categoryDesc = isKO
      ? `당신의 성향은 아래 지지 영역에서 **${hapNet.koName} 기운의 긴밀한 연대가 완성**되고, 그 강력한 지향성이 천간의 **${hapNet.type}** 에너지로 고스란히 흘러갑니다. 이는 생각과 실제 행동이 조화롭게 한 방향으로 연결되어, **한곳에 정신을 집중하는 남다른 돌파력과 확실한 정체성**을 보여줍니다. 다만 **기운이 이처럼 한쪽으로 쏠린 만큼, 특정 분야나 생각에 깊게 빠져들면 주위의 부드럽고 합리적인 조언을 듣지 않고 나만의 방식만 고집하는 경향**이 나타나기도 합니다. 위기 극복이나 중요한 실적으로 증명해내야 할 상황에서는 엄청난 에너지를 뿜어내지만, 직장과 가족 등 평온한 일상에서 서로 조율하고 협조할 때는 의식적으로 소통하는 태도가 꼭 필요합니다.`
      : `Your chart exhibits a rare and powerful structure where the branches complete the **${hapNet.enName}** union, channelizing this immense energy directly into the **${hapNet.type}** element of the stem. This suggests your **core drive is highly focused**, granting you **unyielding determination** and a **clear sense of identity**. You are naturally equipped with the **pioneering leadership to define your own path** and command situations even amidst chaos.`;
    innatePillars = hapNet.keyPillars;
  } else if (overload) {
    categoryTitle = isKO 
      ? `[특정 성향의 집중] ${overload.nameKo} 에너지가 이끄는 뚜렷한 개성` 
      : `[Concentrated Type] Character Dominated by ${overload.nameEn}`;
    
    const advantage = overloadAdvantageKo[overload.nameKo] || '남들과 차별화되는 자신만의 독특하고 선명한 재능';
    const shadow = overloadShadowKo[overload.nameKo] || '특정 상황에서 유연함을 잃고 주위와의 마찰을 고집스럽게 반복하는 경향';

    categoryDesc = isKO
      ? `당신의 성향은 여러 심리 자원 중 특히 **${overload.nameKo} 기운**에 힘이 강하게 흘러 있어, 남들과 확연히 구별되는 선명한 정체성을 지니고 있습니다. 이는 **${advantage}**이라는 훌륭한 평생의 무기가 되지만, 반대로 기운이 지나치게 집중되는 과정에서 주변 상황이나 관계에 걸림돌이 생겼을 때 **${shadow}**로 이어질 우려가 함께 공존합니다. 스스로 과몰입하게 되는 특정 고집의 원천을 정교하게 이해하고, 평온한 일상의 조화로운 루틴과 따뜻한 소통을 늘 곁에 두신다면, 이 강력한 에너지는 세상과 더불어 찬란하게 빛나는 최고의 성공 기반이 되어줄 것입니다.`
      : `In your cosmic layout, more than three characters are saturated with **${overload.nameEn}** energy, causing this specific vibration to **strongly dictate your behavior and character**. This marks you as an individual of **extreme color and distinct talent**. When you establish your own sovereign domain and specialty, this concentrated energy sublimes into an **explosive creative force**.`;
    innatePillars = overload.keyPillars;
  } else if (siblingRoot) {
    categoryTitle = isKO
      ? `[자아의 든든한 지지대] 스스로 중심을 잡고 일어서는 힘`
      : `[Root of Ego] Indestructible Foundation Anchoring the Self`;
    categoryDesc = isKO
      ? `당신의 성향은 모질고 극단적인 쏠림 없이, **나 자신과 뜻을 함께하고 든든하게 받쳐주는 내면의 지지대(자존감과 중심)**를 아름답게 갖추고 있습니다. 이는 외부 여건이 다소 불안정하거나 거친 상황에 직면하더라도, **타인에게 과하게 의지하지 않고 스스로 판단하며 유연하게 일어날 수 있는 견고한 자립력과 마음의 회복탄력성**이 확실하게 정착되어 있음을 의미합니다. 다만, **자신의 생각과 기준이 외부에 의해 사소하게 흔들리거나 반대를 겪을 때, 스스로를 지키려는 방어벽이 과도하게 올라가 상대를 날카롭게 차단하는 모습**을 보일 수 있으니 주의하는 것이 좋습니다. 세상을 투쟁 대상으로 대하기보다 나와 함께할 동반자로 마주할 때 한층 더 편안한 깊이를 가질 수 있습니다.`
      : `While free from extreme imbalances, your configuration features two or more branches that act as the supportive roots of your Day Master. This signifies a **highly resilient "ego root system"** that keeps you **anchored through any external turbulence**. Your fundamental strength lies in your **autonomous recovery power and self-reliance**, rising like a phoenix from any setback.`;
    innatePillars = siblingRoot.keyPillars;
  } else {
    // Default
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

    categoryTitle = innateTitleMap[innateElem] || (isKO ? `${dayMasterKo}이 빚어낸 타고난 기질` : `Innate Temperament Crafted by ${dayMasterKo}`);

    categoryDesc = isKO
      ? (STEM_PERSONALITIES[dayStem] ? `당신에게는 일간을 둘러싼 성분들이 조화를 이루며 독특한 이중성과 균형을 보여줍니다. **${STEM_PERSONALITIES[dayStem].strengthInSociety}** 반면 때로는 **${STEM_PERSONALITIES[dayStem].shadowSide}**` : '')
      : (STEM_INFO_EN[dayStem] ? `A distinct duality and balance emerge from the surrounding elements around your Day Master. **${STEM_INFO_EN[dayStem].strengthInSociety}** On the other hand, **${STEM_INFO_EN[dayStem].shadowSide}**` : '');

    innatePillars = [
      { pillarTitle: 'Day',   type: 'branch' as const },
      { pillarTitle: 'Month', type: 'stem'   as const }
    ];
    if (hourStem && !result?.isTimeUnknown) {
      innatePillars.push({ pillarTitle: 'Hour', type: 'stem' as const });
    } else {
      innatePillars.push({ pillarTitle: 'Year', type: 'stem' as const });
    }
  }

  // Build unique dynamic array of actually highlighted elements to explain (Day Master is always first)
  const explainedElements: any[] = [];
  
  // 1. Day Master (Always first)
  explainedElements.push(getStemDetail('Day', dayStem, dayStem, isKO));
  
  // 2. Add others from innatePillars
  innatePillars.forEach(p => {
    // Skip if it's Day Master itself to avoid duplicate
    if (p.pillarTitle === 'Day' && p.type === 'stem') return;
    
    // Resolve correct glyph/character
    let char = '';
    if (p.type === 'stem') {
      if (p.pillarTitle === 'Day') char = dayStem;
      else if (p.pillarTitle === 'Month') char = monthStem;
      else if (p.pillarTitle === 'Year') char = yearStem;
      else if (p.pillarTitle === 'Hour') char = hourStem;
    } else {
      if (p.pillarTitle === 'Day') char = dayBranch;
      else if (p.pillarTitle === 'Month') char = monthBranch;
      else if (p.pillarTitle === 'Year') char = yearBranch;
      else if (p.pillarTitle === 'Hour') char = hourBranch;
    }
    
    if (!char) return;
    
    const alreadyAdded = explainedElements.some(el => el.pos === p.pillarTitle && el.type === p.type);
    if (alreadyAdded) return;
    
    if (p.type === 'stem') {
      explainedElements.push(getStemDetail(p.pillarTitle, char, dayStem, isKO));
    } else {
      explainedElements.push(getBranchDetail(p.pillarTitle, char, dayStem, isKO));
    }
  });

  // Construct dynamic element descriptions
  const elementDescriptionsKo = explainedElements.map(el => {
    const header = `• **${el.posNameKo} ${el.char}(${el.name}) — ${el.posDescKo}**`;
    if (el.pos === 'Day') {
      return `${header}\n  ${el.coreIdentityKo} 이를 바탕으로 삶에서는 ${el.innateDesireKo}`;
    } else {
      return `${header}\n  이 자리는 사주 내에서 **${el.tenGodNameKo}**(${el.tenGodHumanKoTitle})의 기운으로 작용합니다. 즉, ${el.tenGodHumanKoDesc} ${el.coreIdentityKo} 한편으로 내면 깊은 곳에서는 ${el.innateDesireKo}`;
    }
  }).join('\n\n');

  const elementDescriptionsEn = explainedElements.map(el => {
    const header = `• **${el.posNameEn} ${el.char}(${el.name}) — ${el.posDescEn}**`;
    if (el.pos === 'Day') {
      return `${header}\n  ${el.coreIdentityEn} Driven by this foundation, you ${el.innateDesireEn.charAt(0).toLowerCase() + el.innateDesireEn.slice(1)}`;
    } else {
      return `${header}\n  This position acts as **${el.tenGodNameEn}** (${el.tenGodHumanEnTitle}) within your chart, which means ${el.tenGodHumanEnDesc} ${el.coreIdentityEn} Deep down, you ${el.innateDesireEn.charAt(0).toLowerCase() + el.innateDesireEn.slice(1)}`;
    }
  }).join('\n\n');

  // Construct dynamic interaction narrative based on the collection of highlighted elements
  const groupCounts: Record<string, number> = { '비겁': 0, '식상': 0, '재성': 0, '관성': 0, '인성': 0 };
  explainedElements.forEach(el => {
    if (el.pos === 'Day' && el.type === 'stem') return; // Skip Day Master itself
    const groupName = el.tenGodNameKo === '비견' || el.tenGodNameKo === '겁재' ? '비겁' :
                      el.tenGodNameKo === '식신' || el.tenGodNameKo === '상관' ? '식상' :
                      el.tenGodNameKo === '편재' || el.tenGodNameKo === '정재' ? '재성' :
                      el.tenGodNameKo === '편관' || el.tenGodNameKo === '정관' ? '관성' :
                      el.tenGodNameKo === '편인' || el.tenGodNameKo === '정인' ? '인성' : '';
    if (groupName) {
      groupCounts[groupName]++;
    }
  });

  let interactionNarrativeKo = '';
  let interactionNarrativeEn = '';

  const activeGroups = Object.entries(groupCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (activeGroups.length === 0) {
    interactionNarrativeKo = `귀하의 주어진 사주 자원들은 특정한 한쪽으로 쏠리지 않고 고르게 분산되어 있습니다. 이는 성격적으로 모나지 않은 높은 유연성과 뛰어난 상황 적응력으로 나타납니다. 다른 사람들과 유연하게 벽 없이 융화되면서도 자기 행동의 기준을 잃지 않는 은은한 마음의 중심이 돋보입니다.`;
    interactionNarrativeEn = `Your selected cosmic resources are evenly balanced without extreme bias, granting you superb interpersonal flexibility and high adaptability. You are able to merge harmoniously with your surroundings while keeping an exquisite anchor of self intact.`;
  } else {
    const topGroup = activeGroups[0][0];
    const secondGroup = activeGroups.length > 1 ? activeGroups[1][0] : null;

    const koSegments: string[] = [];
    const enSegments: string[] = [];

    if (topGroup === '관성') {
      koSegments.push(`스스로를 지키는 울타리와 규율인 **'관성(수호 규율)'**이 주된 축을 형성합니다. 타고난 기질적으로 매사에 흐지부지 넘어가는 것을 경계하며, **책임감 있게 자신을 조절하고 다스리는 규율성**이 아주 돋보입니다. 타인 앞에서는 함부로 행동하지 않고 **선과 도덕적 의무를 명확히 지키기** 때문에, 대외적으로 **매우 진중하고 신뢰할 수 있는 묵직한 존재감**을 발산합니다.`);
      enSegments.push(`A strong framework of **'Influence/Power'** functions as your guiding anchor. You value **self-discipline, boundaries, and responsibility**, which manifests as a **dignified, reliable, and slightly guarded outer presence**.`);
    } else if (topGroup === '식상') {
      koSegments.push(`창의성과 개성을 발휘하여 표현하는 **'식상(표현 설계)'**이 핵심 기조를 이룹니다. 매사에 높은 호기심을 지니고서 **나만의 영감이나 기획을 세상에 구체적인 실체로 구현하는 표현력**이 뛰어나며, 가식이나 꾸밈이 없는 **솔직하고 담백한 소통**을 지향합니다. 기존의 가둔 틀에 순응하기보다 **자신만의 독창적인 방식과 세련된 색채**를 우아하게 발산해 나갑니다.`);
      enSegments.push(`Your natural disposition is centered on **'Expression'** as a tool of creation and ingenuity. You approach life with **organic curiosity, seeking to turn inspiration into actual deliverables**, preferring **candid, unfiltered dialogue** over rigid protocols.`);
    } else if (topGroup === '재성') {
      koSegments.push(`목표를 실제적인 성취와 결실로 바꾸는 **'재성(실리 성과)'**이 강하게 흐르고 있습니다. 추상적인 아이디어에 그치기보다는 **눈에 선명히 보이고 정량할 수 있는 확실한 결과물**을 이끌어내며, **합리적인 자원 관리와 실리적인 효율 분배**에 뛰어난 역량을 보입니다. 무모한 리스크나 불필요한 감정 낭비를 현명하게 피해 가며 **최적의 마무리 성과를 도출해내는 탁월한 감각**이 있습니다.`);
      enSegments.push(`A pragmatic drive of **'Wealth/Pragmatism'** acts as the engine of your thoughts. You prefer **highly visible results, concrete data, and tactical asset management** over floating theories, excelling at **bypassing emotional leaks**.`);
    } else if (topGroup === '인성') {
      koSegments.push(`세상의 원리와 깊은 배움을 차분히 수용하는 **'인성(학자 수용)'**이 높은 비중을 차지합니다. 외부 자극에 성급하고 가벼이 움직이지 않고, **한 걸음 멈추어 전체 맥락과 원리를 깊이 성찰하며** 숙성된 지혜의 정답을 찾아냅니다. 깊은 생각 속에서 배어나오는 **사려 깊은 경청과 따뜻한 감수성**은 상대방에게 **온 마음으로 기댈 수 있는 편안한 안식처**가 되어 줍니다.`);
      enSegments.push(`A contemplative current of **'Intellect/Wisdom'** defines your mind. Rather than reacting aggressively to immediate impulses, you choose to **absorb, analyze background contexts, and craft deeply matured answers**, radiating **comfortable wisdom**.`);
    } else if (topGroup === '비겁') {
      koSegments.push(`자신에 대한 흔들림 없는 확신과 독립적인 힘을 뜻하는 **'비겁(강인 주체성)'**이 방향을 주도합니다. 누군가의 부당한 강제나 통제를 본능적으로 꺼리며, **스스로 개척하고 주도해 나가는 굳건한 자립심과 신념**이 흐릅니다. 곤경 앞에서도 **나 자아 본질의 주체성을 지키며 뚝심 있게 다시 일어서는 회복탄력성**이 매우 견고합니다.`);
      enSegments.push(`An indomitable axis of **'Companion/Ego'** steers your life directions. You instinctively challenge external command structures, choosing to **survive and conquer with your pure willpower and self-defined standards**.`);
    }

    if (secondGroup) {
      if (secondGroup === '관성') {
        koSegments.push(`여기에 성실한 조직적 신뢰와 조절 능력을 가진 **관성**이 조화롭게 더해져, **단순한 개인 행동을 넘어 체계적인 조율 능력을 바탕으로 신뢰받는 지위를 견고히 구축하는 역량**을 보완합니다.`);
        enSegments.push(`Combined with the structured discipline of **Influence**, you possess a **highly organized methodology to secure respected positions in social groups**.`);
      } else if (secondGroup === '식상') {
        koSegments.push(`여기에 세상과 끊임없이 소통하고자 하는 **식상**이 유기적으로 맞물려, **자신의 주도적인 에너지를 다채롭고 창의적인 말, 글, 창조적 산출물로 흘려보내며 매혹적인 영향력**을 주위에 발산하게 됩니다.`);
        enSegments.push(`Combined with the creative flow of **Expression**, your inner drives translate easily into **fluent communicative forms, artistic crafts, or fascinating concepts**.`);
      } else if (secondGroup === '재성') {
        koSegments.push(`여기에 현실적인 **재성**의 목표의식이 성공적으로 결합되어, **가벼이 흩어지기 쉬운 무수한 생각들을 실물 경제적인 가치나 피부에 와닿는 뚜렷한 실적 성취**로 확실하게 종지부 찍는 힘을 실어줍니다.`);
        enSegments.push(`Combined with the finishing touch of **Wealth**, your abstract pursuits find immediate grounding, transforming **ideals into economic gains and concrete wealth**.`);
      } else if (secondGroup === '인성') {
        koSegments.push(`여기에 깊고 사색적인 **인성**의 흡수력이 보력으로 조화를 이루며, **지나치게 충동적인 행동 전개를 한 템포 가다듬어 주어 실수를 면하고 평정심을 현명히 이어가도록** 돕습니다.`);
        enSegments.push(`Combined with the calm filtering of **Intellect**, you avoid premature burnout, enjoying an **intellectual layer of mindfulness that guards your decisions**.`);
      } else if (secondGroup === '비겁') {
        koSegments.push(`여기에 주체성 넘치는 **비겁**의 심지가 단단하게 받쳐주며, **사회 도덕적 한계나 모진 외부 부침에 의해서 자존심이 꺾이지 않고 당당한 태도로 자신의 주권을 의지로 수호하는 강력한 방패**가 되어 줍니다.`);
        enSegments.push(`Combined with the self-reliant shield of **Companion**, you are protected by a **diamond-hard emotional resilience that refuses to crack under societal trends**.`);
      }
    } else {
      koSegments.push(`이 선명하고 돋보이는 자원의 흐름은 오직 **당신만이 가질 수 있는 뚜렷한 가치 기준과 강렬한 정체성**을 빚어내어, 시류에 어설프게 휩쓸리지 않는 단단함을 발현하게 조력합니다.`);
      enSegments.push(`This pure, focused current helps you **cultivate a highly distinctive identity, remaining unfazed by shallow trends** as you define your own customized space.`);
    }

    koSegments.push(`\n\n결과적으로, 이 자원들의 상호작용은 귀하 정체성 내부에서 **'나(일간)'**와 **'강조된 성분들'** 사이에 끊임없는 대화와 연대를 이루고 있습니다. 전문용어를 빌리지 않더라도, 귀하는 **본인의 내면적 신조와 사회적으로 입은 명확한 옷(강조된 부위들)이 한데 어우러져 한 사람의 독특하고 안정적인 삶의 오케스트라**를 완성하는 아름다운 구조를 가지고 있습니다.`);
    enSegments.push(`\n\nUltimately, the constant dialogue between **'You (Day Master)'** and these **'Highlighted Elements'** crafts a beautiful inner symphony. Even without any esoteric jargon, your true beauty lies in this seamless alignment of your innermost self and your designated outer tools, working in harmony.`);

    interactionNarrativeKo = koSegments.join(' ');
    interactionNarrativeEn = enSegments.join(' ');
  }

  const pillarTemperamentDesc = isKO
    ? `**[🔍 기둥별 타고난 기질 해설]**\n\n${elementDescriptionsKo}`
    : `**[🔍 Pillar-by-Pillar Innate Temperament]**\n\n${elementDescriptionsEn}`;

  const categorySection = isKO
    ? `**[🧬 기질의 구조적 지향성: ${categoryTitle}]**\n\n${categoryDesc}\n\n**[🤝 강조 자원들의 성격적 상호작용 및 해설]**\n\n${interactionNarrativeKo}`
    : `**[🧬 Structural Focus: ${categoryTitle}]**\n\n${categoryDesc}\n\n**[🤝 Highlighted Resources' Personality Play & Interaction]**\n\n${interactionNarrativeEn}`;

  let traitsSection = '';
  if (traitScores && traitScores.length >= 2) {
    const top1 = traitScores[0];
    const top2 = traitScores[1];
    
    const explanation1Ko = getTraitDetailText(top1.key, top1.score, 'KO');
    const explanation2Ko = getTraitDetailText(top2.key, top2.score, 'KO');
    
    const explanation1En = getTraitDetailText(top1.key, top1.score, 'EN');
    const explanation2En = getTraitDetailText(top2.key, top2.score, 'EN');

    traitsSection = isKO
      ? `**[📊 기질적 강점과 잠재력 분석]**\n\n귀하의 잠재력 지표 중 가장 강력하게 작용하는 핵심 무기는 **${top1.name}(${top1.score}점)**과 **${top2.name}(${top2.score}점)**입니다. 귀하는 ${explanation1Ko} 또한 ${explanation2Ko} 이러한 지표들이 결합할 때 귀하만의 고유한 기질적 본질이 삶과 사회 무대에서 폭발적인 성공 가능성으로 발현됩니다.`
      : `**[📊 Cosmic Weapon & Potential Analysis]**\n\nSpecifically, the strongest potential traits in your profile are **${top1.name} (${top1.score} points)** and **${top2.name} (${top2.score} points)**. You are someone who, ${explanation1En} and also ${explanation2En} When these qualities align, they form your ultimate cosmic weapon, translating your inner potential into outstanding reality.`;
  }

  innateTitle = categoryTitle;
  innateDesc = `${pillarTemperamentDesc}\n\n─────────────────────────────────────────────\n\n${categorySection}\n\n─────────────────────────────────────────────\n\n${traitsSection}`;

  // ─────────────────────────────────────────────
  // 2. [살아가는 방식] 연산 및 텍스트 구성
  // ─────────────────────────────────────────────
  let lifeTitle = '';
  let lifeDesc = '';
  let lifePillars: { pillarTitle: 'Day' | 'Month' | 'Year' | 'Hour'; type: 'stem' | 'branch' }[] = [];

  const branchList = [dayBranch, monthBranch, yearBranch, result?.isTimeUnknown ? '' : hourBranch].filter(Boolean);
  const stemList = [dayStem, monthStem, yearStem, result?.isTimeUnknown ? '' : hourStem].filter(Boolean);
  
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
    ? (BRANCH_PERSONALITIES[monthBranch] ? `\n\n귀하의 사회적 삶은 **월지 ${monthBranch}(${isKO ? (BRANCH_PERSONALITIES[monthBranch]?.koName || monthBranch) : (BRANCH_EN_NAMES[monthBranch] || monthBranch)})**의 분위기 안에서 펼쳐집니다.\n${BRANCH_PERSONALITIES[monthBranch].lifeEnvironment}\n${BRANCH_PERSONALITIES[monthBranch].socialPattern}` : '')
    : (BRANCH_INFO_EN[monthBranch] ? `\n\nYour social life unfolds within the atmosphere of **Month Branch ${monthBranch}(${isKO ? (BRANCH_PERSONALITIES[monthBranch]?.koName || monthBranch) : (BRANCH_EN_NAMES[monthBranch] || monthBranch)})**.\n${BRANCH_INFO_EN[monthBranch].lifeEnvironment}\n${BRANCH_INFO_EN[monthBranch].socialPattern}` : '');

  const ls2 = isKO
    ? (BRANCH_PERSONALITIES[yearBranch] ? `\n\n삶의 뿌리와 행동 방식의 토대를 이루는 **년지 ${yearBranch}(${isKO ? (BRANCH_PERSONALITIES[yearBranch]?.koName || yearBranch) : (BRANCH_EN_NAMES[yearBranch] || yearBranch)})**은 귀하의 가장 기본적인 관계 패턴을 형성합니다.\n${BRANCH_PERSONALITIES[yearBranch].lifeEnvironment}\n${BRANCH_PERSONALITIES[yearBranch].socialPattern}` : '')
    : (BRANCH_INFO_EN[yearBranch] ? `\n\nThe **Year Branch ${yearBranch}(${isKO ? (BRANCH_PERSONALITIES[yearBranch]?.koName || yearBranch) : (BRANCH_EN_NAMES[yearBranch] || yearBranch)})**, forming the root and foundation of your life, shapes your basic relationship patterns.\n${BRANCH_INFO_EN[yearBranch].lifeEnvironment}\n${BRANCH_INFO_EN[yearBranch].socialPattern}` : '');

  const ls3 = result?.isTimeUnknown ? '' : (isKO
    ? (BRANCH_PERSONALITIES[hourBranch] ? `\n\n**시지 ${hourBranch}(${isKO ? (BRANCH_PERSONALITIES[hourBranch]?.koName || hourBranch) : (BRANCH_EN_NAMES[hourBranch] || hourBranch)})**은 귀하가 진정으로 원하고 이루고자 하는 욕망의 방향을 보여줍니다.\n${BRANCH_PERSONALITIES[hourBranch].behavioralTrigger}\n${BRANCH_PERSONALITIES[hourBranch].hiddenStruggle}` : '')
    : (BRANCH_INFO_EN[hourBranch] ? `\n\nThe **Hour Branch ${hourBranch}(${isKO ? (BRANCH_PERSONALITIES[hourBranch]?.koName || hourBranch) : (BRANCH_EN_NAMES[hourBranch] || hourBranch)})** reveals the direction of your true desires and goals.\n${BRANCH_INFO_EN[hourBranch].behavioralTrigger}\n${BRANCH_INFO_EN[hourBranch].hiddenStruggle}` : ''));

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
    if (hourBranch && !result?.isTimeUnknown) {
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
    const pipelineMapKo: Record<string, Record<WealthEngineType, string>> = {
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
        EXPLOSIVE:   '해외 투자·글로벌 펀드, 무역·물류 대규모 레버리지, 핀테크·블록체임 스타트업 투자',
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

    const pipelineMapEn: Record<string, Record<WealthEngineType, string>> = {
      '甲': {
        EXPLOSIVE:   'Large-scale Property Development, ESG Forestry/Ecology Funds, Timing Real Estate Leverage',
        CIRCULATION: 'Long-form Content Creation, Wood/Natural Material Manufacturing, Startup Founder',
        SYSTEM:      'Corporate CEO Position, Forestry/Environmental Business Licensing, Platform Franchise Headquarters',
        IP:          'Publishing/Copyright Agency, Brand Trademark Licensing, Content IP Development Studio',
        SHIELD:      'Single-member Corp Sole Contract, 100% Sole Ownership Business, Premium Nature-based Service',
        ARTISAN:     'Master Woodworker/Sculptor, Independent Book Publishing, Screenplay/Novel Writing',
        SELFMADE:    'Freelance Planner/Producer, Independent Agency Operation, Lecture Creator',
      },
      '乙': {
        EXPLOSIVE:   'Small-scale Flower Market Leverage, Small Property Auction, Beauty/Wellness Brand Launch',
        CIRCULATION: 'Beauty/Lifestyle Content Creator, Online Floral/Gardening Shop, Handmade Craft Art Shop',
        SYSTEM:      'Beauty/Healthcare Franchise, SME CFO/Financial Partner, Reselling Platform Distribution',
        IP:          'Handicraft/Pattern Design Copyright, Beauty Recipe Licensing, Handmade Brand Trademark',
        SHIELD:      'Small Premium Atelier Operation, Private Studio Membership, Income-generating Small Rental',
        ARTISAN:     'Florist/Fashion Designer, Interior Props Artist, Independent Illustrator',
        SELFMADE:    'Sole Stylist/Beauty Consultant, Social Seller, Handmade Artist',
      },
      '丙': {
        EXPLOSIVE:   'Media/Entertainment Investment, Solar/Renewable Energy Funds, Hot-issue Brand Launch Investment',
        CIRCULATION: 'Brand PR Marketer, YouTube/Influencer Media Channel, Event/Performance Planning Agency',
        SYSTEM:      'Media Corp/MCN Establishment, Large Event Agency, Public Agency PR/Advertising Bidding',
        IP:          'Brand Character/IP Licensing, Music/Video Copyright Agency, Celeb/Influencer Trademark',
        SHIELD:      'Personal Brand Independent Agency, Celebrity Exclusive Management, Solo Media Corporation',
        ARTISAN:     'Film/Music Video Director, Independent Music Producer, Stage Lighting/Production Director',
        SELFMADE:    'YouTuber/Podcaster, Solo Advertising Agency, Event MC/Speaker',
      },
      '丁': {
        EXPLOSIVE:   'Art/Craft Auction Investment, Edtech Platform Equity Investment, Small-scale Rental Leverage',
        CIRCULATION: 'Art/Craft Digital Content, Counseling/Coaching Programs, Traditional Skill Online Lectures',
        SYSTEM:      'Counseling Center Corporate Operation, Academy/Educational Franchise, Professional License-based Office',
        IP:          'Traditional Craft/Recipe Copyright, Psychological Counseling Content Licensing, Art NFT Creation',
        SHIELD:      'Exclusive Contract Independent Counselor, Small Workshop Sole Operation, Subscription Mentorship',
        ARTISAN:     'Traditional Craft Artisan, Painter/Calligrapher, Meditation/Healing Content Creator',
        SELFMADE:    'Sole Coach/Counselor, Independent Academy Lecturer, Art Curator',
      },
      '戊': {
        EXPLOSIVE:   'Large-scale Property Development Leverage, Construction/Infrastructure PF Investment, Logistics Warehouse Rental',
        CIRCULATION: 'Real Estate Brokerage/Rental Management, Construction/Interior Contracting, Agriculture/Food Distribution',
        SYSTEM:      'Real Estate Corporation, Large Construction Subcontracting, Real Estate Developer',
        IP:          'Land/Construction Patents, Real Estate Data/Solution SaaS, Interior Design Copyright',
        SHIELD:      'Sole Corporate Land Ownership, Private Real Estate Portfolio Management, Premium Warehousing/Logistics',
        ARTISAN:     'Traditional Architecture/Stonemason Master, Landscaping Specialist, Earth/Natural Material Artwork',
        SELFMADE:    'Independent Construction Site Management, Real Estate Consultant, Sole Interior Contractor',
      },
      '己': {
        EXPLOSIVE:   'Farmland/Rural Home Leverage, Food/Healthcare Brand Launch, Small Real Estate Auction',
        CIRCULATION: 'Food/Beverage Business, Daily Supplies/Beauty D2C Brand, Agriculture/Gardening Distribution',
        SYSTEM:      'Food Franchise Franchising, SME Operations Manager, Public Procurement/Food Ingredients Supply',
        IP:          'Recipe/Food Patents, Agricultural Technology Licensing, Lifestyle Brand Trademark',
        SHIELD:      'Private Restaurant/Cafe Sole Operation, Family Business Sole Ownership, Small Farm Direct Trade',
        ARTISAN:     'Traditional Fermented Food/Pottery Artisan, Garden Designer, Korean Cuisine Chef',
        SELFMADE:    'Sole Food Business Founder, Independent Food Distributor, Small-scale Catering',
      },
      '庚': {
        EXPLOSIVE:   'Stock/Commodity Leverage Investment, Large Manufacturing Facility Investment, Metal/Mineral Futures Trading',
        CIRCULATION: 'Manufacturing/Machinery Parts Production, Professional Law/Tax Services, Consulting Agency',
        SYSTEM:      'Manufacturing Corp/Factory Establishment, Law/Patent Firm, Large B2B Supply Contracts',
        IP:          'Manufacturing Process Patents, Legal/Consulting Methodology Copyright, Technology Licensing',
        SHIELD:      'Solo Corp Exclusive Contract, Professional Sole Practice, Machinery Rental',
        ARTISAN:     'Metal Craft/Blade Master, Independent Sculptor, Mold/Precision Manufacturing Specialist',
        SELFMADE:    'Freelance Consultant/Advisor, Solo Manufacturing Workshop, Independent Law/Tax Office',
      },
      '辛': {
        EXPLOSIVE:   'Precious Metal/Gemstone Leverage, Luxury/High-end Brand Investment, Patent Auction/M&A Investment',
        CIRCULATION: 'Jewelry/Luxury Reselling, Professional Consulting, Personal Branding/Image Consulting',
        SYSTEM:      'Luxury Distribution Corp, Professional License-based Franchise, Hair/Beauty Corporate Chain',
        IP:          'Design/Fashion Patents, Beauty Formula Licensing, Professional Brand Trademark Trade',
        SHIELD:      'High-end Sole Professional Service, Private Salon/Clinic',
        ARTISAN:     'Jewelry Craftsman/Designer, Perfumer, Precision Craft Master',
        SELFMADE:    'Sole Stylist/Image Consultant, Independent Designer, Freelance Editor',
      },
      '壬': {
        EXPLOSIVE:   'Overseas/Global Fund Investment, Large-scale Trade/Logistics Leverage, Fintech/Blockchain Startup Investment',
        CIRCULATION: 'Trade/Import-Export Agency, Global Platform Business, Logistics/Distribution Brokerage',
        SYSTEM:      'Trade Corp/Import-Export Company, Global B2B Platform Operations, Shipping/Logistics Corp',
        IP:          'Trade Know-how Consulting Copyright, Global SaaS/Solutions Licensing, Logistics Technology Patents',
        SHIELD:      'Private Trade Independent Agency, Sole Online Seller Account, Global Sole Business',
        ARTISAN:     'Ocean/Underwater Artwork, Independent Documentary Director, Global Travel Content Creator',
        SELFMADE:    'Sole Trade Business, Independent Global Consultant, Online Importer-Exporter Seller',
      },
      '癸': {
        EXPLOSIVE:   'Small Fund/ETF Leverage, Info/Data-based Startup Investment, Edtech Platform Investment',
        CIRCULATION: 'Data Analysis/Research Service, Online Education Platform, Counseling/Coaching Content',
        SYSTEM:      'Information Service Corp, Educational Institution Operation, B2B Data Solution Contract',
        IP:          'Research/Study Copyright, Dataset Licensing, Psychological Test/Educational Content IP',
        SHIELD:      'Sole Researcher/Analyst Operation, Subscription Newsletter/Reports, Private Institute',
        ARTISAN:     'Independent Writer/Poet, Art Therapist, Archive/Curator',
        SELFMADE:    'Sole Data Analyst, Independent Educational Instructor, Freelance Copywriter/Editor',
      },
    };

    const pipelineMap = isKO ? pipelineMapKo : pipelineMapEn;
    return pipelineMap[stem]?.[engineType] ||
      (isKO 
        ? '전문 기술직 프리랜서, 콘텐츠 기반 1인 비즈니스, 전문 컨설팅 서비스'
        : 'Specialized Freelancing, Content-based Solo Business, Professional Consulting');
  };

  if (hasExplosiveTrigger) {
    typeTitle = isKO ? "[재고귀인 폭발형] 재고(財庫)의 금고를 열어 일구는 폭발적 자산" : "[Tomb-Wealth Explosive Type] Sudden Wealth Vault Unlock";
    pipeline = getPipelineByDayStem(dayStem, 'EXPLOSIVE');
    defaultPsychology = isKO
      ? "귀하는 재물을 묵직하게 가두고 지키는 거대한 비밀 금고인 **재고(財庫)** 또는 지지 결합 구조가 발달해 있습니다. 돈을 대할 때 **잔돈을 허투루 쓰지 않고** 언젠가 올 큰 승부처를 위해 **인내하며 시기를 기다리는 대범함이 특징**입니다. 돈을 벌 때는 평소에는 일반적인 **자산 규모를 조용히 보존하며** 종잣돈을 극단적으로 압축하고 있다가, 대운이나 세운에서 이 **금고 문을 열어젖히는 결정적인 타이밍(충·합의 시기)에 한 번의 웅장한 도약으로 거대한 부를 일시적으로 거머쥐어야 합니다.** 즉, **잔돈을 벌기 위해 힘을 빼기보다** 내 인생을 바꿀 수 있는 **큰 자산 흐름을 설계하는 것이 중요**합니다. 주의할 점은 사소한 유혹이나 단타 투자, 주변의 가벼운 권유에 흔들려 **애써 축적한 종잣돈을 허비하는 것**입니다. 스스로 돈을 쉽게 꺼내 쓰지 못하도록 자산이 완전히 묶이는 부동산이나 장기 채권 형태의 가상 금고를 다져야 비로소 폭발적인 자산이 누수 없이 온전히 귀하의 것이 됩니다."
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
      ? "귀하는 타고난 재능과 기획력(**식상**)이 즉각적인 재물(**재성**)로 선순환하는 흐름을 가지고 있습니다. **돈을 대할 때** 단순히 남 밑에서 고정된 월급을 받는 것보다, 내가 직접 머리를 쓰고 행동하여 부가가치를 창출하는 것에 가장 큰 짜릿함을 느낍니다. **돈을 벌 때는** 자신의 아이디어, 콘텐츠, 혹은 전문 스킬을 복제 가능한 상품(온라인 강의, 솔루션, 지적재산 등)으로 패키징하여 **시간과 소득을 분리시키는 구조**를 만드는 것이 핵심 전략입니다. 일하는 시간을 직접 파는 구조에서 벗어나 **내 브랜드를 자동 복제할 수 있는 시스템**으로 확장해야 합니다. **주의할 점**은 자신만의 만족이나 예술에 그쳐 시장의 실제 수요를 놓치는 것입니다. 내가 좋아하는 것보다 **시장이 기꺼이 지갑을 여는 지점**을 날카롭게 분석해 상품화할 때, 비로소 마르지 않는 재물의 파이프라인이 완성됩니다."
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
      ? "귀하는 재물(**재성**)을 벌어들이고 이를 튼튼한 시스템이나 신용망(**관성**)으로 안전하게 지켜내는 구조를 지녔습니다. **돈을 대할 때** 일시적인 일확천금보다는 안정적이고 영속적인 흐름을 중시하는 경향이 있습니다. **돈을 벌 때는** 내 몸을 바쳐 직접 노동하기보다, 프랜차이즈, 법인 시스템, 혹은 대형 플랫폼이나 정부 지원과의 연계 등 **'시스템의 그늘'**을 빌려 자산을 굴려야 가장 강력해집니다. 체계적인 매뉴얼과 규정을 만들어 **내가 없어도 굴러가는 구조**를 설계하는 것이 정답입니다. **주의할 점**은 개인 신용도나 기업 브랜드 평판의 흠집입니다. 평판을 잃는 순간 재물의 흐름도 흔들리니, 항상 **정직하고 공적인 약속 이행**을 최우선으로 삼으며 규칙적인 캐시카우(정기 로열티, 고정 임대료 등)를 모아나가야 합니다."
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
      ? "귀하는 탄탄한 정보와 지식 자격(**인성**)이 실질적인 자산(**재성**)으로 치환되는 흐름을 지녔습니다. **돈을 대할 때** 단순한 육체노동이나 영업보다는 지식과 기술의 가치를 높게 사며, 무형의 스펙과 권리에 큰 가치를 둡니다. **돈을 벌 때는** 몸을 분주히 움직여 영업하기보다 내 노하우와 학술 가치를 문서로 박제(**상표 등록, 특허, 저작권, 출판 등**)하여 로열티를 받는 방식으로 벌어야 효율이 극대화됩니다. 단기 대행 업무에 갇히기보다는 내 지식을 남에게 가르치고 **라이선스를 부여하는 상위 포지션**에 앉아야 합니다. **주의할 점**은 무형의 자산을 제대로 지키지 못하고 방치하는 것입니다. 반드시 내 결과물들에 **법적 권리 장치**를 마련하고 전문가 집단과의 교류를 통해 내 지식의 권위를 끊임없이 사회적으로 인증받아야 합니다."
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
      ? "귀하는 나와 힘이 대등한 동료나 경쟁자(**비겁**)가 내 재물(**재성**)을 두고 치열하게 다투는 군비쟁재 흐름을 타고났습니다. **돈을 대할 때** 인정이 많아 주변 사람에게 베풀거나 쉽게 빌려주는 등 돈 관리에 있어 귀가 얇아지기 쉽습니다. **돈을 벌 때는** 타인과의 경쟁 속에서 독자적인 기량을 발휘해 내 몫을 똑 부러지게 쟁취해야 합니다. 또한 번 돈을 **시야에서 완전히 감추는 것**이 자산을 불리는 가장 빠른 지름길입니다. 현금이 통장에 가볍게 굴러다니면 반드시 쓸 곳이 생기거나 남에게 흘러가므로, 버는 즉시 부동산, 연금, 청약 등 **강제로 출금이 묶이는 곳**으로 이체하여 보이지 않게 잠가야 합니다. **주의할 점**은 주변의 동업 제안, 투자 권유, 혹은 돈을 빌려달라는 요청입니다. 인생에서 이 세 가지를 원천 차단하고 **내 구체적인 자산 규모를 철저히 비밀**로 부칠 때 자산이 안전하게 보호됩니다."
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
      ? "귀하는 사주 원국에 재물의 직접적인 형상(**재성**)이 없거나 옅은 구조로, 돈을 노골적으로 쫓으려 계산기를 두드릴수록 되려 일이 꼬이고 결정이 흐려집니다. **돈을 대할 때** 돈 그 자체보다 내가 가진 순수한 열정, 흥미, 그리고 창작의 가치(**식상**)를 소중히 생각합니다. **돈을 벌 때는** 역설적이게도 '돈 생각'을 버리고 **나만의 깊이 있는 전문성과 특수한 재능**에 온전히 집착하듯 몰입하여 독보적인 장인 영역을 구축할 때 비로소 거대한 부가 나를 찾아옵니다. 내 특수한 스킬이 시장의 인정을 받을 때까지 한 우물만 우직하게 파는 **장인 정신**이 정답입니다. **주의할 점**은 대가 청구와 수익 정산 같은 자잘한 계산을 꺼리다가 실속을 잃는 것입니다. 정당한 대가를 요구하는 것을 머뭇거리지 마시고 **고정 요율표를 투명하게 미리 공시**해두거나, 돈 관리 자체는 나보다 계산이 철저한 신뢰할 수 있는 파트너나 아웃소싱 시스템에 아예 위탁해 버리는 것이 현명합니다."
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
      ? "귀하는 주체적인 뚝심(**비겁**)과 강력한 실천력(**식상**), 그리고 정직한 결과(**재성**)가 촘촘히 엮여 맨땅에서 직접 일어나는 자수성가형 흐름을 지녔습니다. **돈을 대할 때** 남에게 아쉬운 소리를 하거나 얹혀가는 것을 극도로 거부하며, 내 땀방울로 정직하게 일구어낸 자산에만 진정한 믿음을 보냅니다. **돈을 벌 때는** 거대 대기업의 줄을 잡거나 남의 혜택에 의존하기보다, 나만의 확실한 기술력과 독보적인 실전 감각을 갈고닦아 **본인의 몸값을 스스로 올리는 방향**을 잡아야 성공합니다. 내 기술적 노하우를 패키징하여 전자책이나 강좌 같은 **나만의 독자적인 유통 루트**를 만드는 것이 자산을 폭발시키는 열쇠입니다. **주의할 점**은 내 몸을 너무 과신하여 모든 실무를 혼자 다 껴안다가 몸이 망가지는 것입니다. 1인 비즈니스 단계를 넘어서면 점진적으로 **업무를 아웃소싱하고 협업**해야 하며, 무엇보다 일정한 시간과 에너지를 **나만의 건강 루틴을 보존하는 데 최우선 배정**해야 평생 건강하게 부를 누릴 수 있습니다."
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
  const wealthDesc = defaultPsychology;

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

  const cleanInnatePillars = result?.isTimeUnknown
    ? innatePillars.filter(kp => kp.pillarTitle !== 'Hour')
    : innatePillars;

  const cleanLifePillars = result?.isTimeUnknown
    ? lifePillars.filter(kp => kp.pillarTitle !== 'Hour')
    : lifePillars;

  const cleanWealthPillars = result?.isTimeUnknown
    ? wealthPillars.filter(kp => kp.pillarTitle !== 'Hour')
    : wealthPillars;

  return {
    innateTemperament: {
      title: innateTitle,
      description: innateDesc,
      keyPillars: cleanInnatePillars,
    },
    lifestylePattern: {
      title: lifeTitle,
      description: lifeDesc,
      keyPillars: cleanLifePillars,
    },
    wealthFlow: {
      title: wealthTitle,
      description: wealthDesc,
      keyPillars: cleanWealthPillars,
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

