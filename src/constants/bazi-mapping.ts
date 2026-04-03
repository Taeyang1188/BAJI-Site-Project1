
export const BAZI_MAPPING = {
  tenGods: {
    "비견": { ko: "비견", en: "The Mirror", desc: "Your twin energy. Reflective and independent." },
    "比肩": { ko: "비견", en: "The Mirror", desc: "Your twin energy. Reflective and independent." },
    "겁재": { ko: "겁재", en: "The Rival", desc: "Competitive edge. High stakes, high energy." },
    "劫财": { ko: "겁재", en: "The Rival", desc: "Competitive edge. High stakes, high energy." },
    "식신": { ko: "식신", en: "The Artist", desc: "Creative flow. Natural talent and expression." },
    "食神": { ko: "식신", en: "The Artist", desc: "Creative flow. Natural talent and expression." },
    "상관": { ko: "상관", en: "The Rebel", desc: "Rules? What rules? Disruptive and brilliant." },
    "伤官": { ko: "상관", en: "The Rebel", desc: "Rules? What rules? Disruptive and brilliant." },
    "편재": { ko: "편재", en: "The Maverick", desc: "Unconventional wealth. Big risks, big rewards." },
    "偏财": { ko: "편재", en: "The Maverick", desc: "Unconventional wealth. Big risks, big rewards." },
    "정재": { ko: "정재", en: "The Architect", desc: "Steady growth. Building your empire brick by brick." },
    "正财": { ko: "정재", en: "The Architect", desc: "Steady growth. Building your empire brick by brick." },
    "편관": { ko: "편관", en: "The Warrior", desc: "Intense pressure. Forged in fire, born to lead." },
    "七杀": { ko: "편관", en: "The Warrior", desc: "Intense pressure. Forged in fire, born to lead." },
    "정관": { ko: "정관", en: "The Judge", desc: "Order and status. Respecting the cosmic law." },
    "正官": { ko: "정관", en: "The Judge", desc: "Order and status. Respecting the cosmic law." },
    "편인": { ko: "편인", en: "The Mystic", desc: "Esoteric knowledge. Seeing what others miss." },
    "偏印": { ko: "편인", en: "The Mystic", desc: "Esoteric knowledge. Seeing what others miss." },
    "정인": { ko: "정인", en: "The Sage", desc: "Traditional wisdom. Nurtured by the ancestors." },
    "正印": { ko: "정인", en: "The Sage", desc: "Traditional wisdom. Nurtured by the ancestors." },
  },
  geju: {
    "비견": { ko: "비견격", en: "THE MIRROR ALIGNMENT" },
    "겁재": { ko: "겁재격", en: "THE RIVAL ALIGNMENT" },
    "식신": { ko: "식신격", en: "THE ARTIST ALIGNMENT" },
    "상관": { ko: "상관격", en: "THE REBEL ALIGNMENT" },
    "편재": { ko: "편재격", en: "THE MAVERICK ALIGNMENT" },
    "정재": { ko: "정재격", en: "THE ARCHITECT ALIGNMENT" },
    "편관": { ko: "편관격", en: "WARRIOR CONSTITUTION" },
    "정관": { ko: "정관격", en: "THE JUDGE ALIGNMENT" },
    "편인": { ko: "편인격", en: "THE MYSTIC ALIGNMENT" },
    "정인": { ko: "정인격", en: "THE SAGE ALIGNMENT" },
    "건록": { ko: "건록격", en: "THE PROSPERITY ALIGNMENT" },
    "양인": { ko: "양인격", en: "THE BLADE ALIGNMENT" },
  },
  interactions: {
    "충": { ko: "충(沖)", en: "Clash" },
    "육합": { ko: "육합(六合)", en: "Six Combinations" },
    "삼합": { ko: "삼합(三合)", en: "Triple Combination" },
    "방합": { ko: "방합(方合)", en: "Directional Combination" },
    "삼형": { ko: "삼형(三刑)", en: "Triple Punishment" },
    "반형": { ko: "반형(半刑)", en: "Partial Punishment" },
    "자형": { ko: "자형(自刑)", en: "Self Punishment" },
    "형": { ko: "형(刑)", en: "Punishment" },
    "파": { ko: "파(破)", en: "Destruction" },
    "해": { ko: "해(害)", en: "Harm" },
    "복음": { ko: "복음(伏吟)", en: "Duplicate Pillar" },
    "천간합": { ko: "천간합(天干合)", en: "Stem Combination" },
    "천간충": { ko: "천간충(天干沖)", en: "Stem Clash" },
    "격합": { ko: "격합(隔合)", en: "Distant Combination" },
    "원합": { ko: "원합(遠合)", en: "Remote Combination" },
    "격충": { ko: "격충(隔沖)", en: "Distant Clash" },
    "원충": { ko: "원충(遠沖)", en: "Remote Clash" },
  },
  interactionDetails: {
    "충": {
      ko: {
        title: '충(沖)',
        general: '고여서 썩어가는 기운을 강제로 깨워 흐르게 만드는 삶의 역동성입니다.',
        types: {
          wangJi: '자오묘유(子午卯酉) 간의 충돌. 타협이 없는 정면승부로, 전부 아니면 전무(All or Nothing)식의 결과가 나타납니다.',
          cheonJi: '천간과 지지가 동시에 부딪히는 현상. 인생의 전환점이 강렬하게 나타나며, 큰 위기 혹은 대역전의 기회가 됩니다.',
          saengJi: '인신사해(寅申巳亥) 간의 충돌. 역마의 기운이 강해 매우 분주하고 빠르게 변화가 나타납니다.',
          goJi: '진술축미(辰戌丑未) 간의 충돌. 창고가 열려 그 안의 보물이 나오거나 문제가 터지는 복잡한 양상을 띱니다.'
        },
        specific: {
          jaO: '일지(자수)와 시지(오화)의 충돌. 차가운 물과 뜨거운 불이 부딪히는 형상으로, 감정 기복이 심하거나 주거/환경 변화가 잦을 수 있습니다.',
          myoYu: '월지(묘목)와 연지(유금)의 충돌. 날카로운 칼이 나무를 베어내는 형상으로, 사회 생활에서의 갈등이나 이직, 가족 간의 가치관 차이가 나타날 수 있습니다.',
          byeongIm: '일간 임수(壬)와 시간 병화(丙)의 충돌. 역동적이고 화려한 충으로, 목표를 향한 저돌적인 에너지가 강하지만 스스로 피로감을 느끼기 쉽습니다.'
        }
      },
      en: {
        title: 'Clash (Chung)',
        general: 'The dynamism of life that forces stagnant energy to wake up and flow.',
        types: {
          wangJi: 'Clash between Rat, Horse, Rabbit, Rooster. No compromise, All or Nothing results.',
          cheonJi: 'Heavenly Stem and Earthly Branch clash simultaneously. Intense turning point, potential for crisis or great reversal.',
          saengJi: 'Clash between Tiger, Monkey, Snake, Pig. Strong travel energy, busy, fast changes.',
          goJi: 'Clash between Dragon, Dog, Ox, Goat. Complex, opening of storage, hidden treasures or problems emerge.'
        },
        specific: {
          jaO: 'Clash between Day Branch (Rat) and Hour Branch (Horse). Water vs Fire. Emotional instability, frequent environmental changes.',
          myoYu: 'Clash between Month Branch (Rabbit) and Year Branch (Rooster). Metal vs Wood. Social conflicts, career changes, family value differences.',
          byeongIm: 'Clash between Day Master (Yang Water) and Hour Stem (Yang Fire). Dynamic and intense. Strong drive, but prone to fatigue.'
        }
      }
    },
    "합": {
      ko: {
        title: '합(合)',
        general: '서로 다른 기운이 만나 새로운 에너지를 만들어내는 결합과 조화의 힘입니다.',
        types: {
          cheonGan: '천간끼리의 합. 정신적인 지향점이나 가치관의 결합을 의미하며, 서로에게 긍정적인 영향을 주고받습니다.',
          jiJi: '지지끼리의 합. 현실적인 환경이나 인간관계에서의 결합을 의미하며, 실질적인 협력과 안정을 가져옵니다.',
          cheonJi: '천간과 지지가 동시에 합을 이루는 현상. 정신과 현실이 일치하여 강력한 성취와 안정감을 줍니다.'
        }
      },
      en: {
        title: 'Combination (Hap)',
        general: 'The power of union and harmony where different energies meet to create something new.',
        types: {
          cheonGan: 'Combination between Stems. Represents alignment of mental goals or values, mutually positive influence.',
          jiJi: 'Combination between Branches. Represents alignment in practical environment or relationships, practical cooperation and stability.',
          cheonJi: 'Simultaneous combination of Stem and Branch. Alignment of mind and reality, leading to powerful achievements and stability.'
        }
      }
    }
  },
  shenSha: {
    "천을귀인": { ko: "천을귀인(天乙貴人)", en: "Noble Guardian", desc: "The highest noble star. Brings help from influential people and turns bad luck into good.", descKo: "최고의 길성으로, 인복이 많아지고 흉한 일을 길하게 바꾸어주는 힘이 있습니다." },
    "문창귀인": { ko: "문창귀인(文昌貴인)", en: "Literary Star", desc: "Star of intelligence and academic success. Good for writing, learning, and exams.", descKo: "지혜와 학문의 별로, 공부와 글쓰기에 재능이 있으며 시험 운이 좋습니다." },
    "학당귀인": { ko: "학당귀인(學堂貴人)", en: "Academy Star", desc: "Star of teaching and scholarship. Natural talent for education and deep study.", descKo: "교육과 학문의 별로, 가르치는 재능이 뛰어나고 깊이 있는 연구에 적합합니다." },
    "금여록": { ko: "금여록(金輿祿)", en: "Golden Carriage", desc: "Star of luxury and comfort. Indicates a high-status life and smooth career path.", descKo: "안락하고 귀한 삶을 상징하며, 배우자 덕이 있고 평탄한 삶을 돕습니다." },
    "양인살": { ko: "양인살(羊刃煞)", en: "Sheep Blade", desc: "Extreme energy and stubbornness. Can be a powerful tool for success or a cause of conflict.", descKo: "매우 강한 에너지와 고집을 상징하며, 전문직에서 성공하거나 큰 성취를 이루는 힘이 됩니다." },
    "괴강살": { ko: "괴강살(魁罡煞)", en: "The Overlord", desc: "Powerful charisma and leadership. Strong-willed and capable of great achievements.", descKo: "강력한 카리스마와 리더십을 의미하며, 대범한 성격으로 큰 일을 도모합니다." },
    "백호대살": { ko: "백호대살(白虎大煞)", en: "The White Tiger", desc: "Intense, explosive energy. Indicates strong character but potential for sudden changes.", descKo: "강하고 폭발적인 에너지를 상징하며, 전문 분야에서 두각을 나타내는 힘이 됩니다." },
    "일귀": { ko: "일귀(日貴)", en: "Day Noble", desc: "Noble character born on a lucky day. Brings elegance and respect.", descKo: "품격이 높고 귀한 인품을 상징하며, 주변의 존경을 받는 기운입니다." },
    "일덕": { ko: "일덕(日德)", en: "Day Virtue", desc: "Compassionate and virtuous character. Protected from many misfortunes.", descKo: "자비롭고 덕망이 높은 성품으로, 많은 재액으로부터 보호받는 기운입니다." },
    "겁살": { ko: "겁살(劫煞)", en: "Robbery Star", desc: "Loss or sudden change. Can also mean taking what you want with force.", descKo: "외부로부터의 압박이나 갑작스러운 변화를 의미하며, 경쟁심과 투쟁심을 자극합니다." },
    "재살": { ko: "재살(災煞)", en: "Calamity Star", desc: "Potential for obstacles or legal issues. Requires caution and strategy.", descKo: "수옥살이라고도 하며, 꾀가 많고 재치 있게 위기를 극복하는 능력을 의미합니다." },
    "천살": { ko: "천살(天煞)", en: "Heavenly Star", desc: "Forces beyond control. Indicates a need for spiritual growth or patience.", descKo: "하늘의 기운으로, 자신의 의지보다 환경의 영향을 많이 받으며 인내심이 필요합니다." },
    "지살": { ko: "지살(地煞)", en: "Earthly Star", desc: "Movement and new beginnings. Often related to moving house or starting a business.", descKo: "새로운 시작과 이동을 의미하며, 홍보나 마케팅 등 대외적인 활동에 유리합니다." },
    "년살": { ko: "년살(年煞)", en: "Annual Star", desc: "Also known as Peach Blossom. Charm, popularity, and social attraction.", descKo: "도화살로도 불리며, 타인의 시선을 끄는 매력과 예술적 재능을 상징합니다." },
    "월살": { ko: "월살(月煞)", en: "Monthly Star", desc: "Barrenness or lack of support. Indicates a time to rely on oneself.", descKo: "고초살이라고도 하며, 어려운 환경에서도 스스로 길을 개척해 나가는 힘을 의미합니다." },
    "망신살": { ko: "망신살(亡身煞)", en: "Humiliation Star", desc: "Loss of face or exposure. Can also mean being in the public eye.", descKo: "자신을 드러내어 주목받는 기운으로, 연예계나 대중 앞에 서는 일에 긍정적일 수 있습니다." },
    "장성살": { ko: "장성살(將星煞)", en: "General Star", desc: "Authority and command. Peak of power and social standing.", descKo: "권위와 중심을 상징하며, 조직에서 리더 역할을 하거나 주도적인 삶을 삽니다." },
    "반안살": { ko: "반안살(攀鞍煞)", en: "Saddle Star", desc: "Promotion and comfort. Reaching a stable and successful position.", descKo: "말 안장에 올라탄 형상으로, 출세와 번영, 안정적인 지위를 얻는 길성입니다." },
    "역마살": { ko: "역마살(驛馬煞)", en: "The Wanderer", desc: "Constant movement, travel, and international connections.", descKo: "활동 범위가 넓고 이동이 잦음을 의미하며, 해외 운이나 유통업 등에 유리합니다." },
    "육해살": { ko: "육해살(六害煞)", en: "Six Harms Star", desc: "Illness or hidden obstacles. Requires attention to health and details.", descKo: "여섯 가지 해로움을 의미하나, 직관력이 뛰어나고 영적인 감각이 발달함을 뜻하기도 합니다." },
    "화개살": { ko: "화개살(華蓋煞)", en: "Artistic Star", desc: "Solitude, religion, and art. Deep inner world and creative talent.", descKo: "화려함을 덮는다는 뜻으로, 예술적 감수성과 종교적 성향, 깊은 내면 세계를 상징합니다." },
  },
  strength: {
    "극약": { ko: "극약", en: "Extremely Weak" },
    "약": { ko: "약", en: "Weak" },
    "중화": { ko: "중화", en: "Balanced" },
    "강": { ko: "강", en: "Strong" },
    "극강": { ko: "극강", en: "Extremely Strong" },
  },
  yongshin: {
    "인성": { ko: "인성", en: "Resource" },
    "비겁": { ko: "비겁", en: "Self/Peer" },
    "식상": { ko: "식상", en: "Output/Artist" },
    "재성": { ko: "재성", en: "Wealth" },
    "관성": { ko: "관성", en: "Power/Influence" },
    "희신": { ko: "희신", en: "Favorable Element" },
    "기신": { ko: "기신", en: "Unfavorable Element" },
    "구신": { ko: "구신", en: "Rescuing Element" },
    "인성용신": { ko: "인성용신", en: "Resource as Useful God" },
    "인수화살": { ko: "인수화살", en: "Resource Transforming Seven Killings" },
    "식신제살": { ko: "식신제살", en: "Eating God Controlling Seven Killings" },
    "파인": { ko: "파인", en: "Breaking Resource" },
  },
  tooltips: {
    "geJu": {
      ko: "사주의 전체적인 구조와 사회적 성향을 결정하는 핵심 격식입니다.",
      en: "The core structure of your chart that determines your social role and primary life path."
    },
    "dayMasterStrength": {
      ko: "일간(나 자신)이 주변 오행으로부터 얼마나 많은 에너지를 얻고 있는지를 나타냅니다.",
      en: "Measures how much energy your 'Self' (Day Master) receives from other elements in the chart."
    },
    "yongShen": {
      ko: "사주의 균형을 맞추고 운의 흐름을 좋게 만드는 가장 중요한 오행입니다.",
      en: "The 'Useful God' - the most critical element needed to balance your chart and bring good fortune."
    },
    "interactions": {
      ko: "천간과 지지 사이의 결합(합)이나 충돌(충) 등을 통해 발생하는 에너지의 변화입니다.",
      en: "Dynamic energy shifts caused by combinations (Hap) or clashes (Chung) between elements."
    },
    "shinsal": {
      ko: "특정한 조합에 의해 발생하는 특별한 기운으로, 삶의 구체적인 사건이나 성격을 암시합니다.",
      en: "Special 'Stars' or symbolic energies that hint at specific life events or personality traits."
    },
    "gongmang": {
      ko: "비어있거나 기운이 약해진 지지를 의미하며, 해당 궁의 영향력이 감소함을 뜻합니다.",
      en: "Void branches - areas where the energy is hollow or weakened, reducing the influence of those pillars."
    },
    "gyeokHap": {
      ko: "한 칸 떨어져 있는 합으로, 중간의 간섭으로 인해 영향력이 50% 이하로 감소합니다.",
      en: "A combination separated by one pillar. Influence is reduced by over 50% due to interference."
    },
    "wonHap": {
      ko: "끝과 끝(연간-시간)에 있는 합으로, 거리가 너무 멀어 실질적인 결속력이 매우 약합니다.",
      en: "A remote combination between Year and Hour stems. The bond is extremely weak due to the distance."
    },
    "gyeokChung": {
      ko: "한 칸 떨어져 있는 충으로, 직접적인 충돌에 비해 그 영향력이 미미합니다.",
      en: "A clash separated by one pillar. The impact is significantly weaker than a direct adjacent clash."
    },
    "wonChung": {
      ko: "끝과 끝에 있는 충으로, 명리학적으로 작용력이 거의 없다고 봅니다.",
      en: "A remote clash between Year and Hour stems. Considered to have almost no practical effect."
    }
  },
  elements: {
    "Wood": { ko: "목 (Wood)", en: "Wood", color: "#4ADE80", vibe: "Growth & Vitality" },
    "Fire": { ko: "화 (Fire)", en: "Fire", color: "#F87171", vibe: "Passion & Intensity" },
    "Earth": { ko: "토 (Earth)", en: "Earth", color: "#FACC15", vibe: "Stability & Grounding" },
    "Metal": { ko: "금 (Metal)", en: "Metal", color: "#E2E8F0", vibe: "Precision & Clarity" },
    "Water": { ko: "수 (Water)", en: "Water", color: "#60A5FA", vibe: "Wisdom & Flow" },
  },
  stems: {
    "甲": { ko: "갑목", en: "Yang Wood", element: "Wood" },
    "乙": { ko: "을목", en: "Yin Wood", element: "Wood" },
    "丙": { ko: "병화", en: "Yang Fire", element: "Fire" },
    "丁": { ko: "정화", en: "Yin Fire", element: "Fire" },
    "戊": { ko: "무토", en: "Yang Earth", element: "Earth" },
    "己": { ko: "기토", en: "Yin Earth", element: "Earth" },
    "庚": { ko: "경금", en: "Yang Metal", element: "Metal" },
    "辛": { ko: "신금", en: "Yin Metal", element: "Metal" },
    "壬": { ko: "임수", en: "Yang Water", element: "Water" },
    "癸": { ko: "계수", en: "Yin Water", element: "Water" },
  },
  branches: {
    "子": { ko: "자수", en: "Rat", element: "Water" },
    "丑": { ko: "축토", en: "Ox", element: "Earth" },
    "寅": { ko: "인목", en: "Tiger", element: "Wood" },
    "卯": { ko: "묘목", en: "Rabbit", element: "Wood" },
    "辰": { ko: "진토", en: "Dragon", element: "Earth" },
    "巳": { ko: "사화", en: "Snake", element: "Fire" },
    "午": { ko: "오화", en: "Horse", element: "Fire" },
    "未": { ko: "미토", en: "Goat", element: "Earth" },
    "申": { ko: "신금", en: "Monkey", element: "Metal" },
    "酉": { ko: "유금", en: "Rooster", element: "Metal" },
    "戌": { ko: "술토", en: "Dog", element: "Earth" },
    "亥": { ko: "해수", en: "Pig", element: "Water" },
  },
  lifeStages: {
    "甲": { "亥": { ko: "장생", en: "Birth (Growth)" }, "子": { ko: "목욕", en: "Bath (Youth)" }, "丑": { ko: "관대", en: "Attire (Coming of Age)" }, "寅": { ko: "건록", en: "Official (Prosperity)" }, "卯": { ko: "제왕", en: "Emperor (Peak)" }, "辰": { ko: "쇠", en: "Decline (Decay)" }, "巳": { ko: "병", en: "Sickness (Illness)" }, "午": { ko: "사", en: "Death (End)" }, "未": { ko: "묘", en: "Grave (Storage)" }, "申": { ko: "절", en: "Extinction (Severance)" }, "酉": { ko: "태", en: "Fetus (Conception)" }, "戌": { ko: "양", en: "Nourishment (Incubation)" } },
    "乙": { "午": { ko: "장생", en: "Birth (Growth)" }, "巳": { ko: "목욕", en: "Bath (Youth)" }, "辰": { ko: "관대", en: "Attire (Coming of Age)" }, "卯": { ko: "건록", en: "Official (Prosperity)" }, "寅": { ko: "제왕", en: "Emperor (Peak)" }, "丑": { ko: "쇠", en: "Decline (Decay)" }, "子": { ko: "병", en: "Sickness (Illness)" }, "亥": { ko: "사", en: "Death (End)" }, "戌": { ko: "묘", en: "Grave (Storage)" }, "酉": { ko: "절", en: "Extinction (Severance)" }, "申": { ko: "태", en: "Fetus (Conception)" }, "未": { ko: "양", en: "Nourishment (Incubation)" } },
    "丙": { "寅": { ko: "장생", en: "Birth (Growth)" }, "卯": { ko: "목욕", en: "Bath (Youth)" }, "辰": { ko: "관대", en: "Attire (Coming of Age)" }, "巳": { ko: "건록", en: "Official (Prosperity)" }, "午": { ko: "제왕", en: "Emperor (Peak)" }, "未": { ko: "쇠", en: "Decline (Decay)" }, "申": { ko: "병", en: "Sickness (Illness)" }, "酉": { ko: "사", en: "Death (End)" }, "戌": { ko: "묘", en: "Grave (Storage)" }, "亥": { ko: "절", en: "Extinction (Severance)" }, "子": { ko: "태", en: "Fetus (Conception)" }, "丑": { ko: "양", en: "Nourishment (Incubation)" } },
    "丁": { "酉": { ko: "장생", en: "Birth (Growth)" }, "申": { ko: "목욕", en: "Bath (Youth)" }, "未": { ko: "관대", en: "Attire (Coming of Age)" }, "午": { ko: "건록", en: "Official (Prosperity)" }, "巳": { ko: "제왕", en: "Emperor (Peak)" }, "辰": { ko: "쇠", en: "Decline (Decay)" }, "卯": { ko: "병", en: "Sickness (Illness)" }, "寅": { ko: "사", en: "Death (End)" }, "丑": { ko: "묘", en: "Grave (Storage)" }, "子": { ko: "절", en: "Extinction (Severance)" }, "亥": { ko: "태", en: "Fetus (Conception)" }, "戌": { ko: "양", en: "Nourishment (Incubation)" } },
    "戊": { "寅": { ko: "장생", en: "Birth (Growth)" }, "卯": { ko: "목욕", en: "Bath (Youth)" }, "辰": { ko: "관대", en: "Attire (Coming of Age)" }, "巳": { ko: "건록", en: "Official (Prosperity)" }, "午": { ko: "제왕", en: "Emperor (Peak)" }, "未": { ko: "쇠", en: "Decline (Decay)" }, "申": { ko: "병", en: "Sickness (Illness)" }, "酉": { ko: "사", en: "Death (End)" }, "戌": { ko: "묘", en: "Grave (Storage)" }, "亥": { ko: "절", en: "Extinction (Severance)" }, "子": { ko: "태", en: "Fetus (Conception)" }, "丑": { ko: "양", en: "Nourishment (Incubation)" } },
    "己": { "酉": { ko: "장생", en: "Birth (Growth)" }, "申": { ko: "목욕", en: "Bath (Youth)" }, "未": { ko: "관대", en: "Attire (Coming of Age)" }, "午": { ko: "건록", en: "Official (Prosperity)" }, "巳": { ko: "제왕", en: "Emperor (Peak)" }, "辰": { ko: "쇠", en: "Decline (Decay)" }, "卯": { ko: "병", en: "Sickness (Illness)" }, "寅": { ko: "사", en: "Death (End)" }, "丑": { ko: "묘", en: "Grave (Storage)" }, "子": { ko: "절", en: "Extinction (Severance)" }, "亥": { ko: "태", en: "Fetus (Conception)" }, "戌": { ko: "양", en: "Nourishment (Incubation)" } },
    "庚": { "巳": { ko: "장생", en: "Birth (Growth)" }, "午": { ko: "목욕", en: "Bath (Youth)" }, "未": { ko: "관대", en: "Attire (Coming of Age)" }, "申": { ko: "건록", en: "Official (Prosperity)" }, "酉": { ko: "제왕", en: "Emperor (Peak)" }, "戌": { ko: "쇠", en: "Decline (Decay)" }, "亥": { ko: "병", en: "Sickness (Illness)" }, "子": { ko: "사", en: "Death (End)" }, "丑": { ko: "묘", en: "Grave (Storage)" }, "寅": { ko: "절", en: "Extinction (Severance)" }, "卯": { ko: "태", en: "Fetus (Conception)" }, "辰": { ko: "양", en: "Nourishment (Incubation)" } },
    "辛": { "子": { ko: "장생", en: "Birth (Growth)" }, "亥": { ko: "목욕", en: "Bath (Youth)" }, "戌": { ko: "관대", en: "Attire (Coming of Age)" }, "酉": { ko: "건록", en: "Official (Prosperity)" }, "申": { ko: "제왕", en: "Emperor (Peak)" }, "未": { ko: "쇠", en: "Decline (Decay)" }, "午": { ko: "병", en: "Sickness (Illness)" }, "巳": { ko: "사", en: "Death (End)" }, "辰": { ko: "묘", en: "Grave (Storage)" }, "卯": { ko: "절", en: "Extinction (Severance)" }, "寅": { ko: "태", en: "Fetus (Conception)" }, "丑": { ko: "양", en: "Nourishment (Incubation)" } },
    "壬": { "申": { ko: "장생", en: "Birth (Growth)" }, "酉": { ko: "목욕", en: "Bath (Youth)" }, "戌": { ko: "관대", en: "Attire (Coming of Age)" }, "亥": { ko: "건록", en: "Official (Prosperity)" }, "子": { ko: "제왕", en: "Emperor (Peak)" }, "丑": { ko: "쇠", en: "Decline (Decay)" }, "寅": { ko: "병", en: "Sickness (Illness)" }, "卯": { ko: "사", en: "Death (End)" }, "辰": { ko: "묘", en: "Grave (Storage)" }, "巳": { ko: "절", en: "Extinction (Severance)" }, "午": { ko: "태", en: "Fetus (Conception)" }, "未": { ko: "양", en: "Nourishment (Incubation)" } },
    "癸": { "卯": { ko: "장생", en: "Birth (Growth)" }, "寅": { ko: "목욕", en: "Bath (Youth)" }, "丑": { ko: "관대", en: "Attire (Coming of Age)" }, "子": { ko: "건록", en: "Official (Prosperity)" }, "亥": { ko: "제왕", en: "Emperor (Peak)" }, "戌": { ko: "쇠", en: "Decline (Decay)" }, "酉": { ko: "병", en: "Sickness (Illness)" }, "申": { ko: "사", en: "Death (End)" }, "未": { ko: "묘", en: "Grave (Storage)" }, "午": { ko: "절", en: "Extinction (Severance)" }, "巳": { ko: "태", en: "Fetus (Conception)" }, "辰": { ko: "양", en: "Nourishment (Incubation)" } }
  }
};
