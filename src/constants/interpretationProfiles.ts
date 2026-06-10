export interface InterpretationProfile {
  title: string;
  subtitle: string;
  character: string;
  description: string;
  positives: string[];
  negatives: string[];
  solution: string;
}

export const INTERPRETATION_PROFILES: Record<string, InterpretationProfile> = {
  "GWAN_DA_SHIN_YAK": {
    title: "압박 속에서 책임감으로 버티며 단단해지는 '고독한 수호자' 유형",
    subtitle: "관다신약 (官多身弱)",
    character: "주변의 시선과 기대, 사회적 규칙이라는 무게가 사방에서 누르는 형국이지만, 결코 도망치지 않고 책임을 다하는 모습입니다. 책임감이 남다르고 명예를 중요시합니다.",
    description: "관성(벼슬과 규칙, 나를 통제하는 힘)이 과도하게 많고, 일간(나 자신)의 힘이 약한 상태를 뜻합니다. 늘 '해야 할 일'과 '지켜야 할 선'에 갇혀 긴장도가 높고, 타인의 시선과 거절에 대한 부담을 크게 느끼기 쉽습니다. 하지만 조직 내에서 가장 믿음직한 인재로 평가받으며, 도덕성과 규율을 바탕으로 한 위기 극복 능력이 뛰어납니다. 내면의 에너지가 고갈되지 않도록 스스로를 돌보는 것이 평생의 과제입니다.",
    positives: [
      "탁월한 책임감과 조직 내 두터운 신뢰도",
      "도덕적이고 정의로우며 규칙을 철저히 준수하는 성품",
      "리스크를 사전에 감지하고 대비하는 신중함"
    ],
    negatives: [
      "과도한 긴장 상태로 인한 고질적인 멘탈 번아웃",
      "남의 눈치를 보느라 거절하지 못하고 독박 책임을 지는 경향",
      "실수에 대한 두려움으로 인해 과감한 도전을 망설임"
    ],
    solution: "일과 나 사이에 명확한 경계선(Boundary)을 만드세요. 주변의 모든 요구를 다 들어줄 수는 없습니다. '내가 감당할 수 있는 만큼만 받겠다'고 선언하고, 하루 1시간은 온전히 나만의 휴식을 가져야 멘탈이 무너지지 않습니다. 때로는 이기적으로 굴어도 세상은 무너지지 않습니다."
  },
  "JAE_DA_SHIN_YAK": {
    title: "세상의 기회와 판을 읽어내지만 기력을 충전해야 하는 '전략적 모험가' 유형",
    subtitle: "재다신약 (財多身弱)",
    character: "넓은 들판에 황금빛 결실이 가득한 모습이지만, 수확할 손이 부족하여 마음만 바쁘고 몸이 고단하기 쉬운 형국입니다. 세상의 기회와 돈을 다루는 안목이 매우 뛰어납니다.",
    description: "재성(결과물, 목표, 재물)이 사주에 가득하지만, 나(일간)의 힘이 약해 이를 온전히 통제하기 어려운 구조입니다. 아이디어가 많고 결과 중심적인 마인드가 돋보이며 현실 감각이 뛰어납니다. 다만, 판은 크게 벌리는데 실속을 끝까지 챙기기가 힘들어 중간에 지치거나 손실을 입을 수 있습니다. 무리한 탐욕보다는 내 체력과 내실을 먼저 다지며 믿을 만한 동료들과 협력하여 성과를 나누는 배분이 중요합니다.",
    positives: [
      "시장의 흐름과 돈이 흘러가는 방향을 짚어내는 탁월한 감각",
      "다재다능하고 유연하며 현실적인 문제 해결 능력",
      "목표 지향적이고 실리적인 비즈니스 마인드"
    ],
    negatives: [
      "벌려놓은 일에 비해 체력과 끈기 부족으로 마무리가 약함",
      "돈과 성과에 대한 욕심 때문에 건강을 해치거나 투자 실패 위험",
      "늘 마음이 바쁘고 불안하여 한 곳에 정착하지 못하는 느낌"
    ],
    solution: "체력과 건강이 곧 돈입니다. 에너지가 약하면 아무리 좋은 기회가 와도 쥘 수 없습니다. 일을 시작하기 전에 '끝까지 마무리할 수 있는 규모인가'를 검토하고, 혼자서 독식하려 하지 말고 나를 돕는 비겁(동료/파트너)이나 인성(멘토/시스템)과 수익을 셰어하세요. 함께 나눌 때 비로소 거대한 재물을 지킬 수 있습니다."
  },
  "DEUNG_RA_GYE_GAP": {
    title: "거목에 기대어 하늘 끝까지 뻗어나가는 '현명한 상생 협력자' 유형",
    subtitle: "등라계갑 (藤蘿繫甲)",
    character: "부드러운 연꽃과 넝쿨(을목)이 하늘로 곧게 뻗은 아름다운 거목(갑목)을 감아 올라가 마침내 온 동산의 햇살을 함께 품어내는 든든하고 행운 가득한 형국입니다.",
    description: "을목(乙) 일간이 사주 내에서 혹은 운에서 갑목(甲)을 만나 든든한 조력자를 얻고 함께 성장하는 귀인 패턴입니다. 혼자 힘으로 일어서려면 오랜 시간이 걸리지만, 뛰어난 인맥 활용과 귀인복을 바탕으로 주변의 큰 플랫폼이나 멘토, 큰 조직에 편승하여 비약적으로 성장합니다. 유연함과 탁월한 친화력이 무기이며, 강자에게 스며들어 윈-윈(Win-Win) 관계를 만드는 처세술의 달인입니다.",
    positives: [
      "인맥과 환경을 활용해 기회를 잡는 강력한 귀인복",
      "어떤 척박한 환경에서도 살아남는 유연함과 강한 생존력",
      "타인과 협력하고 어우러지며 시너지를 내는 네트워킹 역량"
    ],
    negatives: [
      "타인이나 특정 환경에 과도하게 의존하여 자립심이 약해질 우려",
      "조력자가 사라졌을 때 일시적으로 겪게 되는 큰 방향성 상실",
      "겉으로는 타인을 돕는 척하면서 실속만 차린다는 오해를 살 수 있음"
    ],
    solution: "의지할 수 있는 '거목(멘토, 큰 조직, 플랫폼)'을 적극적으로 찾고 결합하세요. 단, 단순히 무임승차하는 것이 아니라, 당신의 부드러움과 섬세함으로 거목의 부족한 부분을 채워주는 상생 관계를 유지해야 합니다. 든든한 파트너와 오랜 관계를 유지할 때 가장 빠르게 성공할 수 있습니다."
  },
  "SIKSANG_GWADA": {
    title: "에너지를 표출하고 세상을 변화시키는 '자유로운 영혼의 창작자' 유형",
    subtitle: "식상과다 (食傷過多)",
    character: "용암이 분출하듯 내면의 아이디어와 감정을 쉼 없이 세상 밖으로 쏟아내는 활기찬 예술가이자 혁명가의 모습입니다. 구속을 극도로 싫어하고 말과 글의 파급력이 큽니다.",
    description: "식신과 상관(내 표현력, 재능, 아웃풋)이 사주에 넘쳐나고 통제가 안 되는 구조입니다. 호기심이 많고 남들이 생각지 못한 독창적인 기획이나 미적 감각이 돋보입니다. 다만 참을성이 부족해 윗사람이나 기존 규칙과 잦은 충돌을 겪기 쉬우며, 말 실수가 부메랑으로 돌아오기도 합니다. 넘쳐나는 아웃풋의 원천을 잘 정제하여 창의적인 직무나 예술, 전문 기술로 다듬으면 큰 명성을 얻을 수 있는 그릇입니다.",
    positives: [
      "상상력과 표현력이 극대화된 독창적인 아이디어 뱅크",
      "약자의 편에 서서 불의에 항거하는 의로운 혁명가 기질",
      "매력적인 말솜씨와 세련된 표현 감각"
    ],
    negatives: [
      "참지 못하는 성격으로 직장이나 윗사람과의 잦은 트러블",
      "체계와 규율 아래 오랫동안 집중해야 하는 반복 업무에서의 극심한 지루함",
      "충동적인 언행과 생각 없는 팩트 폭격으로 인한 구설수 및 적 생성"
    ],
    solution: "자유로운 표현을 허용하는 전문적이거나 독립적인 환경에서 일해야 합니다. 억압받는 조직 생활에서는 병이 나기 쉽습니다. 또한 하고 싶은 말을 입 밖으로 내기 전에 딱 3초만 머무르며 '이 말이 가져올 파장'을 생각하는 훈련이 필요합니다. 에너지를 정제하고 글, 영상, 코딩, 기획 등으로 승화시키세요."
  },
  "INSEONG_GWADA": {
    title: "끝없는 사색과 통찰로 삶의 진리를 캐내는 '생각의 수집가' 유형",
    subtitle: "인성과다 (印星過多)",
    character: "깊고 깊은 숲 속, 온갖 서적과 사색에 잠겨 바깥 세상의 소란을 등진 채 통찰을 얻으려 노력하는 학자이자 사색가의 묵직한 모습입니다. 생각이 깊고 아는 것이 아주 많습니다.",
    description: "인성(학습력, 깊은 생각, 수용력)이 너무 과도하게 많아 입력(Input)은 100인데 출력(Output)이 부족해 행동으로 이어지기 힘든 상태를 뜻합니다. 한 분야를 연구하고 정보를 수집하며 인간에 대한 심오한 통찰을 얻는 데 능합니다. 하지만 걱정이 꼬리를 물어 '생각에 의한 마비'에 걸리기 쉬우며, 완벽하지 않으면 행동하지 않으려 해서 타이밍을 놓치기도 합니다. 생각의 방에서 나와 가볍게 행동하는 힘을 길러야 합니다.",
    positives: [
      "질적으로 깊이가 다른 사색과 상황 분석력, 학구열",
      "타인의 감정과 사물의 숨겨진 맥락을 읽어내는 탁월한 통찰",
      "문서, 학문, 라이선스 분야에서의 강력한 강점과 귀인복"
    ],
    negatives: [
      "과도한 생각과 걱정으로 인한 우유부단함과 실행 지연 (결정 장애)",
      "현실적인 실행력이 약하고 '누군가 해 주겠지' 하는 의존적 심리",
      "사소한 부정적 생각에 꽂히면 깊은 동굴로 파고드는 우울감"
    ],
    solution: "완벽한 계획은 세상에 존재하지 않습니다. 일단 70% 정도 완성되었다고 생각되면 생각 없이 몸을 먼저 던지세요. 생각(인성)을 제어해줄 현실적 활동(재성)과 행동력(식상)을 강제로 활성화해야 합니다. 매일 아침 '생각보다 몸이 먼저 가는 3가지 행동'을 실천하여 생각의 감옥에서 해방되세요."
  },
  "BIGYEOP_GWADA": {
    title: "그 어떤 비바람에도 흔들리지 않고 독고다이로 돌파하는 '강인한 개척자' 유형",
    subtitle: "비겁과다 (比劫過多)",
    character: "거친 대지 위에 굳건히 일어선 외로운 늑대처럼, 남에게 굽히지 않고 나만의 원칙과 자존심을 무기로 험난한 판을 뚫고 나가는 강직한 리더의 모습입니다. 주관과 뚝심이 엄청납니다.",
    description: "비견과 겁재(나 자신, 자아 성향)의 에너지가 사주를 장악하고 있어 자존심과 독립심이 극대화된 상태입니다. 남의 간섭이나 잔소리를 용납하지 못하며, 스스로의 의지와 결정으로 인생을 이끌어 가려는 힘이 엄청납니다. 동료들을 끄는 보스 기질과 승부사적 마인드가 있어 경쟁에서 강합니다. 하지만 고집이 강해 주변의 조언을 무시하기 쉽고, 때로는 재물 손실을 겪거나 인간관계가 독선적으로 흐를 수 있어 겸손과 배려가 필요합니다.",
    positives: [
      "어떤 패배에도 다시 일어나는 불굴의 의지와 강력한 자아성",
      "독립적이고 자주적이며 나만의 영역을 확실히 개척하는 힘",
      "동료들을 통솔하고 지켜주려는 의리와 보스 기질"
    ],
    negatives: [
      "타인의 비판이나 피드백을 수용하지 못하는 고집과 독선",
      "경쟁심과 고집 때문에 불필요한 마찰을 빚고 적을 만드는 경향",
      "주변 사람들에게 아낌없이 베풀어 겉은 화려하나 속으로 재물이 새는 경향"
    ],
    solution: "꺾이지 않는 강인함은 큰 무기이지만, 강한 태풍에는 부러지기 쉽습니다. 때로는 버드나무처럼 유연하게 숙이는 기술이 진정한 고수입니다. 다른 사람의 조언을 '나에 대한 공격'이 아닌 '나를 채워줄 보약'으로 경청하고, 동업이나 재물 거래 시 계약서를 꼼꼼히 살피어 불필요한 재물 유출을 막으세요."
  },
  "BALANCED": {
    title: "흐름이 유연하고 막힘 없이 균형 잡힌 '부드러운 중재자' 유형",
    subtitle: "중화 밸런서 (中和 Balanced)",
    character: "봄, 여름, 가을, 겨울의 기운이 치우침 없이 조화를 이루며 맑은 물이 굽이쳐 흘러내리는 평화롭고 고결한 정원의 모습입니다. 삶의 안정을 중요시합니다.",
    description: "사주에 오행과 십성이 비교적 골고루 분포되어 있어 급격한 인생의 굴곡을 피해 가고, 위기가 와도 유연하게 중재하며 안정을 찾는 균형 잡힌 구조입니다. 원만하고 합리적인 대인관계가 강점이며, 어떤 환경에 가든 적응을 잘 합니다. 큰 모험이나 위험을 감수하기보다는 안전하고 점진적인 성장을 선호하며, 갈등을 싫어하는 평화주의자입니다. 다만 지나치게 무난하여 결단력을 발휘해야 할 순간을 놓치지 않아야 합니다.",
    positives: [
      "감정과 이성의 밸런스가 뛰어나며 원만한 대인관계",
      "위기 앞에서도 이성을 잃지 않고 중심을 잡는 안정적인 멘탈",
      "삶의 전반적인 영역에서 급등락 없이 순탄한 성장 곡선"
    ],
    negatives: [
      "도전적이고 파괴적인 추진력이 부족해 평범함에 안주할 우려",
      "갈등을 회피하려다 우유부단하게 상황을 끌고 가는 경향",
      "자신만의 뚜렷한 색깔이나 개성이 부족해 보일 수 있음"
    ],
    solution: "평화롭고 균형 잡힌 삶은 큰 축복입니다. 하지만 때로는 평생에 한두 번 인생을 바꿀 과감한 결단과 승부수를 던져야 할 시기가 옵니다. 그런 기회가 포착되었을 때는 지나치게 조율만 하지 말고, 믿음직한 촉을 바탕으로 과감하게 승부수를 띄우는 용기를 훈련해 보세요."
  }
};

export const INTERPRETATION_PROFILES_EN: Record<string, InterpretationProfile> = {
  "GWAN_DA_SHIN_YAK": {
    title: "The 'Lonely Guardian' who endures with responsibility under pressure",
    subtitle: "Gwan-Da-Shin-Yak (官多身弱)",
    character: "You are surrounded by the weight of social expectations and rules pressing from all sides, yet you never run away and fulfill your duties. You have an exceptional sense of responsibility and value honor.",
    description: "This structure represents a high concentration of Officer/Power (the force that controls and regulates you) while your self-energy (Day Master) is relatively weak. You constantly feel tense, bound by 'what needs to be done' and 'boundaries to keep', and easily feel the weight of others' opinions. However, you are highly trusted as the most reliable person in any team, showing outstanding crisis management. Taking care of your own energy from draining is your lifelong task.",
    positives: [
      "Outstanding sense of responsibility and high reliability in organizations",
      "Moral, righteous, and highly disciplined character",
      "Prudence in detecting and preparing for risks in advance"
    ],
    negatives: [
      "Chronic mental burnout due to excessive state of tension",
      "Difficulty saying no, leading to taking on too much responsibility alone",
      "Hesitation to take bold challenges due to fear of failure"
    ],
    solution: "Create a clear boundary between work and yourself. You cannot satisfy everyone's demands. Declare that you will only take on what you can handle, and spend at least one hour a day solely for your own rest. The world will not crumble if you act a bit selfishly sometimes."
  },
  "JAE_DA_SHIN_YAK": {
    title: "The 'Strategic Adventurer' who reads opportunities but needs to recharge",
    subtitle: "Jae-Da-Shin-Yak (財多身弱)",
    character: "Like a vast field full of golden harvest but lacking hands to harvest it, you easily become busy in mind and exhausted in body. You have an outstanding eye for reading opportunities and managing wealth.",
    description: "This structure represents a high concentration of Wealth/Results in the chart while your self-energy (Day Master) is relatively weak, making it challenging to fully control them. You overflow with ideas, possess a results-oriented mind, and have a sharp sense of reality. However, while you start things on a grand scale, it's hard to secure the final gains, leading to fatigue or loss. Rather than chasing excessive greed, focus on building your health and foundations first, and collaborate with trusted partners to share the fruits.",
    positives: [
      "Exceptional sense to capture market trends and flow of wealth",
      "Versatile, flexible, and practical problem-solving skills",
      "Goal-oriented and realistic business mindset"
    ],
    negatives: [
      "Weak follow-through due to starting too many things relative to physical stamina",
      "Risk of health issues or investment failures due to excessive greed for results",
      "Constant restlessness and anxiety, making it hard to settle down in one place"
    ],
    solution: "Physical stamina and health are your true wealth. If your energy is weak, you cannot hold onto great opportunities even if they arrive. Before starting a project, evaluate if you can finish it, and instead of trying to monopolize it, share the returns with partners or mentors. Sharing is how you protect vast wealth."
  },
  "DEUNG_RA_GYE_GAP": {
    title: "The 'Wise Cooperator' climbing to the sky by leaning on a giant tree",
    subtitle: "Deungra-Gyegap (藤蘿繫甲)",
    character: "Like a delicate lotus or vine (Eul-wood) wrapping around a straight giant tree (Gap-wood) to share the golden sunlight of the entire garden, this is a highly fortunate and reliable pattern.",
    description: "This is a benefactor-driven pattern where the Eul-wood (乙) Day Master meets Gap-wood (甲) in the chart or luck cycle to gain a strong supporter. While standing alone takes a long time, you grow exponentially by aligning with large platforms, mentors, or major organizations through your networking. Your weapons are flexibility and outstanding friendliness, mastering the art of blending in with the strong to create a win-win.",
    positives: [
      "Powerful benefactor luck that utilizes networks and environments for opportunities",
      "Flexibility and strong survival skills to bloom in any harsh environment",
      "Excellent networking capacity to collaborate and create massive synergy"
    ],
    negatives: [
      "Risk of weakening self-reliance due to over-dependence on others or environments",
      "Temporary loss of direction when the supporter or platform disappears",
      "Potential misunderstanding of being opportunistic or only taking practical gains"
    ],
    solution: "Actively look for and align with a 'giant tree' (mentor, organization, platform). However, do not just take a free ride; maintain a win-win relationship by filling the tree's gaps with your delicate sensitivity. You achieve success fastest when maintaining long-term partnerships."
  },
  "SIKSANG_GWADA": {
    title: "The 'Free-spirited Creator' who expresses energy and changes the world",
    subtitle: "Siksang-Gwada (食傷過多)",
    character: "Like erupting lava, you constantly pour your ideas and emotions into the world. You are a lively artist and reformer who hates constraints, with powerful speech and writing.",
    description: "This structure represents an overflow of Expression/Creativity (Output) that is hard to contain. You possess immense curiosity, original concepts, and a refined aesthetic sense. However, you lack patience and face frequent friction with authority or conventional rules, and your blunt remarks can act as a boomerang. If you refine this vast expression into creative work, art, or specialized skills, you will achieve great reputation.",
    positives: [
      "Original idea bank with maximized imagination and expression",
      "Righteous reformer standing up for the weak against injustice",
      "Engaging speech and sophisticated style of expression"
    ],
    negatives: [
      "Frequent trouble at work or with authority due to an impatient nature",
      "Extreme boredom with repetitive, structured tasks under rules",
      "Gossip or enemies created by impulsive words and unfiltered truth-bombing"
    ],
    solution: "You must work in a specialized or independent environment that allows free expression. Structured organization life will only make you sick. Practice pausing for 3 seconds before speaking to consider the ripples of your words. Refine your energy into writing, video, coding, or strategy."
  },
  "INSEONG_GWADA": {
    title: "The 'Collector of Thoughts' seeking deep truths through endless reflection",
    subtitle: "Inseong-Gwada (印星過多)",
    character: "Like a scholar in a deep forest surrounded by books, away from the world's noise, you seek profound insights. You are a deep thinker with a wealth of knowledge.",
    description: "This structure represents a high concentration of Resource/Learning (Input) with relatively low Output, making it hard to translate thoughts into action. You excel in research, information gathering, and reading people's hidden motives. However, you risk falling into 'paralysis by analysis' as worries feed on worries, and you hesitate to act unless everything is perfect. You must step out of your mind and build the habit of taking action.",
    positives: [
      "Profound depth of reflection, situation analysis, and love of learning",
      "Outstanding insight to read others' emotions and hidden context",
      "Strong advantage in credentials, documentation, and academic fields with benefactor luck"
    ],
    negatives: [
      "Indecisiveness and delayed execution due to excessive thinking (analysis paralysis)",
      "Weak practical drive and a dependent mindset expecting others to do it",
      "Tendency to retreat into a deep cave of gloom when stuck on negative thoughts"
    ],
    solution: "A perfect plan does not exist. Once you feel 70% complete, throw yourself into action. Forcefully activate practical activities and execution to regulate your thoughts. Practice three simple actions every morning where your body moves before your mind has time to think, freeing yourself from the prison of thoughts."
  },
  "BIGYEOP_GWADA": {
    title: "The 'Resilient Pioneer' who breaks through solo without bending to any storm",
    subtitle: "Bigyeop-Gwada (比劫過多)",
    character: "Like a lone wolf standing firm on a harsh land, you do not bend to others. You are a strong-willed leader who breaks through challenges with self-esteem and principles.",
    description: "This structure represents a high concentration of Companion/Self energy, maximizing self-esteem and independence. You cannot stand interference or nagging, and possess immense drive to lead your life on your own terms. Your boss-like charisma and competitive mindset help you excel in competition. However, your stubbornness can make you ignore advice, and you may face financial leaks or appear dogmatic, requiring humility.",
    positives: [
      "Indomitable will to rise after any defeat and a highly resilient self",
      "Independent and self-reliant drive to pioneer your own field",
      "Loyalty and leadership to guide and protect your companions"
    ],
    negatives: [
      "Stubbornness and dogmatism that refuses to accept others' criticism or feedback",
      "Tendency to create friction and enemies due to competitive pride",
      "Tendency to be generous to a fault, leading to financial leaks behind a flashy exterior"
    ],
    solution: "Your unbending strength is a great weapon, but a rigid tree breaks easily in a storm. True mastery lies in bowing flexibly when needed. Listen to advice not as an attack, but as medicine to complete yourself. Review contracts carefully to avoid unnecessary financial leaks when dealing with partnerships."
  },
  "BALANCED": {
    title: "The 'Harmonious Balancer' who flows smoothly and maintains steady moderation",
    subtitle: "Balanced (中和 Balanced)",
    character: "Like a peaceful garden where the energies of the four seasons harmonize and clear water flows, you value stability and balance in life.",
    description: "This structure represents a relatively even distribution of elements and stars, helping you avoid extreme ups and downs. You resolve crises flexibly and maintain steady growth. Your strengths lie in amicable relationships and adapting to any environment. You prefer secure, incremental progress over high-risk adventures, and act as a peacekeeper who dislikes conflict. Be careful not to miss crucial windows of opportunity by being too passive.",
    positives: [
      "Excellent balance of emotion and logic, fostering smooth relationships",
      "Steady mental strength to keep calm and centered in crisis",
      "Smooth growth curves across life without extreme rises and falls"
    ],
    negatives: [
      "Risk of settling for mediocrity due to a lack of bold, disruptive drive",
      "Tendency to drag situations out indecisively to avoid conflict",
      "Potential lack of distinct individual colors or unique personality traits"
    ],
    solution: "A peaceful and balanced life is a great blessing. However, there comes a time once or twice in life when you must make a bold decision and take a calculated risk. When that opportunity arrives, do not spend too much time adjusting; trust your instincts and practice the courage to take a decisive leap."
  }
};

export const INNATE_TRAITS = [
  { key: "leadership", name: "리더십" },
  { key: "decisionMaking", name: "결단력" },
  { key: "mental", name: "멘탈" },
  { key: "responsibility", name: "책임감" },
  { key: "fightingSpirit", name: "승부욕" },
  { key: "nobleSupport", name: "귀인복" },
  { key: "peopleReading", name: "사람보는 눈" },
  { key: "sensitivity", name: "감수성" },
  { key: "independence", name: "독립심" },
  { key: "patience", name: "인내심" },
  { key: "businessSense", name: "사업감각" },
  { key: "relationshipLuck", name: "관계운" },
  { key: "creativity", name: "창의력" },
  { key: "expressiveness", name: "표현력" }
];
