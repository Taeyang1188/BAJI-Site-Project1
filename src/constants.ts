import { Language } from './types';

export const TRANSLATIONS = {
  EN: {
    intro: {
      title: "COSMIC ANARCHY",
      subtitle: "The universe is a glitch. Let's see yours.",
      button: "PEER INTO THE ABYSS",
      greetings: [
        "Hey. Let's see if your vibes are actually worth the data.",
        "The stars are literally screaming your name. It's embarrassing.",
        "Ready to unlock the chaos in your DNA?",
        "Ugh, finally. Let's see what the void has for you today."
      ]
    },
    input: {
      title: "SOUL EXTRACTION",
      name: "IDENTIFY YOURSELF",
      birthDate: "TEMPORAL ORIGIN",
      birthTime: "THE PRECISE SECOND",
      city: "SPATIAL COORDINATES",
      gender: "VIBE CHECK",
      male: "MASC",
      female: "FEMME",
      nonBinary: "NON-BINARY",
      preferNotToTell: "PREFER NOT TO TELL",
      calendarType: "CALENDAR",
      solar: "SOLAR",
      lunar: "LUNAR",
      button: "SUMMON MY DESTINY",
      locationSynced: "COORDINATES LOCKED. ✨",
      errorTitle: "GLITCH IN THE MATRIX",
      errorDesc: "The stars are literally ghosting us. Check your data and try again.",
      errorButton: "TRY AGAIN, BABE"
    },
    wheel: {
      alignment: "CURRENT ALIGNMENT",
      year: "YEAR",
      month: "MONTH",
      hour: "HOUR"
    },
    nav: {
      home: "RETURN TO THE VOID",
      synced: "LOCKED IN.",
      back: "BACK"
    },
    result: {
      title: "SOUL BLUEPRINT",
      grandCycle: "LIFE SEASONS",
      seasonVibe: "SEASON VIBE",
      seasonVibeDisclaimer: "Based on your current Grand Cycle element.",
      back: "RE-ALIGN",
      lifeStages: {
        childhood: "Childhood",
        youth: "Youth",
        maturity: "Maturity",
        legacy: "Legacy"
      },
      months: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
      comments: {
        Wood: {
          BiGyean: "The season of Wood 🌿. A time for new beginnings and growth.",
          GeopJae: "The season of Wood 🌿. Growth through healthy competition.",
          SikSin: "The season of Wood 🌿. Steady effort leads to harvest.",
          SangGwan: "The season of Wood 🌿. Creative energy is overflowing.",
          PyeonJae: "The season of Wood 🌿. Unexpected opportunities arise.",
          JeongJae: "The season of Wood 🌿. Stable wealth is on the rise.",
          PyeonGwan: "The season of Wood 🌿. A time for responsibility and leadership.",
          JeongGwan: "The season of Wood 🌿. Honor and order prevail.",
          PyeonIn: "The season of Wood 🌿. Your intuition is sharpening.",
          JeongIn: "The season of Wood 🌿. Wisdom and knowledge run deep."
        },
        Fire: {
          BiGyean: "The season of Fire 🔥. Time to show your passion to the world!",
          GeopJae: "The season of Fire 🔥. Intense competition fuels your growth.",
          SikSin: "The season of Fire 🔥. Express your talents freely.",
          SangGwan: "The season of Fire 🔥. Your expression is bold and brilliant.",
          PyeonJae: "The season of Fire 🔥. Dynamic wealth energy flows in.",
          JeongJae: "The season of Fire 🔥. Build your wealth through steady effort.",
          PyeonGwan: "The season of Fire 🔥. Strong leadership is required.",
          JeongGwan: "The season of Fire 🔥. A time for honor and recognition.",
          PyeonIn: "The season of Fire 🔥. Inspiration strikes like lightning.",
          JeongIn: "The season of Fire 🔥. Warm wisdom guides your path."
        },
        Earth: {
          BiGyean: "The season of Earth ⛰️. A time to find your center and build stability.",
          GeopJae: "The season of Earth ⛰️. Unwavering conviction is your strength.",
          SikSin: "The season of Earth ⛰️. Focus on inner growth and refinement.",
          SangGwan: "The season of Earth ⛰️. Create with a practical touch.",
          PyeonJae: "The season of Earth ⛰️. Good for stable investments.",
          JeongJae: "The season of Earth ⛰️. Manage your resources with care.",
          PyeonGwan: "The season of Earth ⛰️. Overcome challenges with persistence.",
          JeongGwan: "The season of Earth ⛰️. A time to build trust and reliability.",
          PyeonIn: "The season of Earth ⛰️. Deep reflection brings clarity.",
          JeongIn: "The season of Earth ⛰️. Acquire stable and lasting knowledge."
        },
        Metal: {
          BiGyean: "The season of Metal ⚔️. Cut away the unnecessary with precision.",
          GeopJae: "The season of Metal ⚔️. Sharp judgment in the face of competition.",
          SikSin: "The season of Metal ⚔️. Refine your skills and expertise.",
          SangGwan: "The season of Metal ⚔️. Sharp criticism turns into deep insight.",
          PyeonJae: "The season of Metal ⚔️. Bold decisions bring financial rewards.",
          JeongJae: "The season of Metal ⚔️. Meticulous management of your assets.",
          PyeonGwan: "The season of Metal ⚔️. Achieve your goals with strong will.",
          JeongGwan: "The season of Metal ⚔️. Principles and rules are your guide.",
          PyeonIn: "The season of Metal ⚔️. Sharp analytical skills shine through.",
          JeongIn: "The season of Metal ⚔️. Build a systematic foundation of knowledge."
        },
        Water: {
          BiGyean: "The season of Water 🌊. Flow with wisdom and adaptability.",
          GeopJae: "The season of Water 🌊. Flexible response to competitive challenges.",
          SikSin: "The season of Water 🌊. Create within the gentle flow of life.",
          SangGwan: "The season of Water 🌊. Solve problems with fluid thinking.",
          PyeonJae: "The season of Water 🌊. Good fortune follows the natural flow.",
          JeongJae: "The season of Water 🌊. Wealth flows in smoothly and steadily.",
          PyeonGwan: "The season of Water 🌊. Wise and adaptable leadership is key.",
          JeongGwan: "The season of Water 🌊. Gentle order and harmony prevail.",
          PyeonIn: "The season of Water 🌊. Deep insights emerge from the depths.",
          JeongIn: "The season of Water 🌊. Wisdom springs forth like a fountain."
        }
      }
    }
  },
  KO: {
    intro: {
      title: "코스믹 DNA",
      subtitle: "네 운명을 직접 확인해봐!",
      button: "지금 바로 시작하기",
      greetings: [
        "안녕, 너의 바이브를 맞춰보자.",
        "너의 코스믹 DNA를 깨울 준비 됐어?",
        "별들이 네 이름을 부르고 있어.",
        "공허가 너에게 무엇을 말하는지 보자."
      ]
    },
    input: {
      title: "코스믹 정렬",
      name: "이름",
      birthDate: "생년월일",
      birthTime: "태어난 시간",
      city: "태어난 도시",
      gender: "성별",
      male: "남성",
      female: "여성",
      nonBinary: "논바이너리",
      preferNotToTell: "밝히고 싶지 않음",
      calendarType: "양/음력",
      solar: "양력",
      lunar: "음력",
      button: "운명 확인하기",
      locationSynced: "위치 동기화 완료! ✨",
      errorTitle: "코스믹 오류 발생",
      errorDesc: "별들이 당신을 외면하고 있어요. 입력 정보를 확인하고 다시 시도해 주세요.",
      errorButton: "다시 시도하기"
    },
    wheel: {
      alignment: "현재 정렬",
      year: "연",
      month: "월",
      hour: "시"
    },
    nav: {
      home: "홈으로 돌아가기",
      synced: "동기화 완료!",
      back: "뒤로가기"
    },
    result: {
      title: "사주팔자",
      grandCycle: "대운 타임라인",
      seasonVibe: "시즌 바이브",
      seasonVibeDisclaimer: "현재 대운의 오행을 바탕으로 합니다.",
      back: "다시 입력하기",
      lifeStages: {
        childhood: "유년",
        youth: "청년",
        maturity: "중년",
        legacy: "말년"
      },
      months: [
        "1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월"
      ],
      comments: {
        Wood: {
          BiGyean: "목(Wood)의 계절입니다 🌿. 새로운 시작과 성장의 기운이 느껴지네요.",
          GeopJae: "목(Wood)의 계절입니다 🌿. 경쟁을 통해 성장하는 시기입니다.",
          SikSin: "목(Wood)의 계절입니다 🌿. 꾸준한 노력으로 결실을 맺으세요.",
          SangGwan: "목(Wood)의 계절입니다 🌿. 창의적인 에너지가 폭발합니다.",
          PyeonJae: "목(Wood)의 계절입니다 🌿. 예상치 못한 기회가 찾아옵니다.",
          JeongJae: "목(Wood)의 계절입니다 🌿. 안정적인 재물운이 상승합니다.",
          PyeonGwan: "목(Wood)의 계절입니다 🌿. 책임감이 필요한 시기입니다.",
          JeongGwan: "목(Wood)의 계절입니다 🌿. 명예와 질서가 함께합니다.",
          PyeonIn: "목(Wood)의 계절입니다 🌿. 직관력이 예리해집니다.",
          JeongIn: "목(Wood)의 계절입니다 🌿. 학문과 지혜가 깊어집니다."
        },
        Fire: {
          BiGyean: "화(Fire)의 계절입니다 🔥. 당신의 열정을 세상에 보여줄 때예요!",
          GeopJae: "화(Fire)의 계절입니다 🔥. 열정적인 경쟁이 시작됩니다.",
          SikSin: "화(Fire)의 계절입니다 🔥. 당신의 재능을 마음껏 펼치세요.",
          SangGwan: "화(Fire)의 계절입니다 🔥. 거침없는 표현력이 돋보입니다.",
          PyeonJae: "화(Fire)의 계절입니다 🔥. 화끈한 재물운이 들어옵니다.",
          JeongJae: "화(Fire)의 계절입니다 🔥. 성실한 노력으로 재물을 모으세요.",
          PyeonGwan: "화(Fire)의 계절입니다 🔥. 강렬한 리더십이 요구됩니다.",
          JeongGwan: "화(Fire)의 계절입니다 🔥. 명예가 빛나는 시기입니다.",
          PyeonIn: "화(Fire)의 계절입니다 🔥. 영감이 번뜩이는 시기입니다.",
          JeongIn: "화(Fire)의 계절입니다 🔥. 따뜻한 지혜가 함께합니다."
        },
        Earth: {
          BiGyean: "토(Earth)의 계절입니다 ⛰️. 내실을 다지고 중심을 잡아야 할 시기입니다.",
          GeopJae: "토(Earth)의 계절입니다 ⛰️. 흔들리지 않는 신념이 필요합니다.",
          SikSin: "토(Earth)의 계절입니다 ⛰️. 차분하게 내실을 다지세요.",
          SangGwan: "토(Earth)의 계절입니다 ⛰️. 현실적인 감각으로 창조하세요.",
          PyeonJae: "토(Earth)의 계절입니다 ⛰️. 안정적인 투자운이 좋습니다.",
          JeongJae: "토(Earth)의 계절입니다 ⛰️. 재물 관리에 힘쓰세요.",
          PyeonGwan: "토(Earth)의 계절입니다 ⛰️. 묵묵히 어려움을 극복하세요.",
          JeongGwan: "토(Earth)의 계절입니다 ⛰️. 신뢰를 쌓는 시기입니다.",
          PyeonIn: "토(Earth)의 계절입니다 ⛰️. 깊은 사색이 필요한 때입니다.",
          JeongIn: "토(Earth)의 계절입니다 ⛰️. 안정적인 지식을 습득하세요."
        },
        Metal: {
          BiGyean: "금(Metal)의 계절입니다 ⚔️. 결단력 있게 불필요한 것들을 정리해보세요.",
          GeopJae: "금(Metal)의 계절입니다 ⚔️. 냉철한 판단이 필요한 경쟁입니다.",
          SikSin: "금(Metal)의 계절입니다 ⚔️. 정교한 기술을 연마하세요.",
          SangGwan: "금(Metal)의 계절입니다 ⚔️. 날카로운 비판이 통찰이 됩니다.",
          PyeonJae: "금(Metal)의 계절입니다 ⚔️. 과감한 결단이 재물을 부릅니다.",
          JeongJae: "금(Metal)의 계절입니다 ⚔️. 꼼꼼한 재물 관리가 필요합니다.",
          PyeonGwan: "금(Metal)의 계절입니다 ⚔️. 강한 의지로 목표를 달성하세요.",
          JeongGwan: "금(Metal)의 계절입니다 ⚔️. 원칙을 지키는 것이 중요합니다.",
          PyeonIn: "금(Metal)의 계절입니다 ⚔️. 예리한 분석력이 빛납니다.",
          JeongIn: "금(Metal)의 계절입니다 ⚔️. 체계적인 지식을 쌓으세요."
        },
        Water: {
          BiGyean: "수(Water)의 계절입니다 🌊. 지혜롭게 흐름에 몸을 맡겨보세요.",
          GeopJae: "수(Water)의 계절입니다 🌊. 유연한 대처가 필요한 경쟁입니다.",
          SikSin: "수(Water)의 계절입니다 🌊. 부드러운 흐름 속에서 창조하세요.",
          SangGwan: "수(Water)의 계절입니다 🌊. 유연한 사고로 문제를 해결하세요.",
          PyeonJae: "수(Water)의 계절입니다 🌊. 흐름을 타는 투자운이 좋습니다.",
          JeongJae: "수(Water)의 계절입니다 🌊. 재물이 유연하게 들어옵니다.",
          PyeonGwan: "수(Water)의 계절입니다 🌊. 지혜로운 리더십이 필요합니다.",
          JeongGwan: "수(Water)의 계절입니다 🌊. 부드러운 질서가 함께합니다.",
          PyeonIn: "수(Water)의 계절입니다 🌊. 깊은 통찰력이 생깁니다.",
          JeongIn: "수(Water)의 계절입니다 🌊. 지혜가 샘솟는 시기입니다."
        }
      }
    }
  }
};

export const ZODIAC_ANIMALS = [
  { id: 1, name: 'Rat', slug: 'za', hanja: '子', imgUrl: '/assets/zodiac/1.za.png' },
  { id: 2, name: 'Ox', slug: 'chuck', hanja: '丑', imgUrl: '/assets/zodiac/2.chuck.png' },
  { id: 3, name: 'Tiger', slug: 'in', hanja: '寅', imgUrl: '/assets/zodiac/3.in.png' },
  { id: 4, name: 'Rabbit', slug: 'myo', hanja: '卯', imgUrl: '/assets/zodiac/4.myo.png' },
  { id: 5, name: 'Dragon', slug: 'zin', hanja: '辰', imgUrl: '/assets/zodiac/5.zin.png' },
  { id: 6, name: 'Snake', slug: 'sa', hanja: '巳', imgUrl: '/assets/zodiac/6.sa.png' },
  { id: 7, name: 'Horse', slug: 'oh', hanja: '午', imgUrl: '/assets/zodiac/7.oh.png' },
  { id: 8, name: 'Goat', slug: 'me', hanja: '未', imgUrl: '/assets/zodiac/8.me.png' },
  { id: 9, name: 'Monkey', slug: 'sin', hanja: '申', imgUrl: '/assets/zodiac/9.sin.png' },
  { id: 10, name: 'Rooster', slug: 'yu', hanja: '酉', imgUrl: '/assets/zodiac/10.yu.png' },
  { id: 11, name: 'Dog', slug: 'sul', hanja: '戌', imgUrl: '/assets/zodiac/11.sul.png' },
  { id: 12, name: 'Pig', slug: 'hae', hanja: '亥', imgUrl: '/assets/zodiac/12.hae.png' },
];

export const ELEMENT_COLORS = {
  Wood: '#4ADE80',
  Fire: '#F87171',
  Earth: '#FACC15',
  Metal: '#E2E8F0',
  Water: '#60A5FA',
};

export const TEN_GOD_COLORS = {
  "비견": ELEMENT_COLORS.Wood,
  "겁재": ELEMENT_COLORS.Wood,
  "식신": ELEMENT_COLORS.Fire,
  "상관": ELEMENT_COLORS.Fire,
  "편재": ELEMENT_COLORS.Earth,
  "정재": ELEMENT_COLORS.Earth,
  "편관": ELEMENT_COLORS.Metal,
  "정관": ELEMENT_COLORS.Metal,
  "편인": ELEMENT_COLORS.Water,
  "정인": ELEMENT_COLORS.Water,
  "일간(나)": '#FFFFFF',
  "The Ego": '#FFFFFF',
  "The Mirror": ELEMENT_COLORS.Wood,
  "The Rival": ELEMENT_COLORS.Wood,
  "The Artist": ELEMENT_COLORS.Fire,
  "The Rebel": ELEMENT_COLORS.Fire,
  "The Maverick": ELEMENT_COLORS.Earth,
  "The Architect": ELEMENT_COLORS.Earth,
  "The Warrior": ELEMENT_COLORS.Metal,
  "The Judge": ELEMENT_COLORS.Metal,
  "The Mystic": ELEMENT_COLORS.Water,
  "The Sage": ELEMENT_COLORS.Water,
};

export const SHINSAL_DEFINITIONS = {
  반안살: {
    hanja: '攀鞍殺',
    meaning: '말 안장에 오르다',
    modern: '승진, 자격 취득, 안락한 지위',
    desc: '전쟁(삶의 고비)에서 승리하고 돌아온 장수가 말 안장 위에 편안히 앉아 있는 형국입니다. 실속이 있고 주위의 인정을 받으며, 경제적으로나 사회적으로 안정된 궤도에 진입함을 뜻합니다.'
  },
  화개살: {
    hanja: '華蓋殺',
    meaning: '화려한 덮개를 덮다',
    modern: '예술적 재능, 종교/철학적 깊이, 반복과 복구',
    desc: '과거의 화려했던 시절을 뒤로하고 내면의 정신세계로 침잠하는 기운입니다. 머리가 영리하고 문학, 예술, 종교 쪽에 탁월한 재능을 보입니다. 또한, 한 번 멈췄던 일을 다시 시작하거나(재기), 복구하는 힘이 강합니다.'
  }
};
