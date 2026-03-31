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
        Wood: "You're in your Wood Season 🌿. Time to grow and branch out, babe.",
        Fire: "You're in your Fire Season 🔥. Time to step into the spotlight, babe!",
        Earth: "You're in your Earth Season ⛰️. Stay grounded, the void is watching.",
        Metal: "You're in your Metal Season ⚔️. Sharp mind, sharp vibes. Cut through the noise.",
        Water: "You're in your Water Season 🌊. Go with the flow, or drown in the glitch."
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
      back: "다시 정렬하기",
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
        Wood: "목(Wood)의 계절입니다 🌿. 새로운 시작과 성장의 기운이 느껴지네요.",
        Fire: "화(Fire)의 계절입니다 🔥. 당신의 열정을 세상에 보여줄 때예요!",
        Earth: "토(Earth)의 계절입니다 ⛰️. 내실을 다지고 중심을 잡아야 할 시기입니다.",
        Metal: "금(Metal)의 계절입니다 ⚔️. 결단력 있게 불필요한 것들을 정리해보세요.",
        Water: "수(Water)의 계절입니다 🌊. 지혜롭게 흐름에 몸을 맡겨보세요."
      }
    }
  }
};

export const ZODIAC_ANIMALS = [
  { name: 'Rat', hanja: '子', element: 'Water' },
  { name: 'Ox', hanja: '丑', element: 'Earth' },
  { name: 'Tiger', hanja: '寅', element: 'Wood' },
  { name: 'Rabbit', hanja: '卯', element: 'Wood' },
  { name: 'Dragon', hanja: '辰', element: 'Earth' },
  { name: 'Snake', hanja: '巳', element: 'Fire' },
  { name: 'Horse', hanja: '午', element: 'Fire' },
  { name: 'Goat', hanja: '未', element: 'Earth' },
  { name: 'Monkey', hanja: '申', element: 'Metal' },
  { name: 'Rooster', hanja: '酉', element: 'Metal' },
  { name: 'Dog', hanja: '戌', element: 'Earth' },
  { name: 'Pig', hanja: '亥', element: 'Water' },
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
