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
      seasonVibe: "CYCLE VIBE",
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
          BiGyean: "The grand cycle of Wood 🌿. A time for new beginnings and growth.",
          GeopJae: "The grand cycle of Wood 🌿. Growth through healthy competition.",
          SikSin: "The grand cycle of Wood 🌿. Steady effort leads to harvest.",
          SangGwan: "The grand cycle of Wood 🌿. Creative energy is overflowing.",
          PyeonJae: "The grand cycle of Wood 🌿. Unexpected opportunities arise.",
          JeongJae: "The grand cycle of Wood 🌿. Stable wealth is on the rise.",
          PyeonGwan: "The grand cycle of Wood 🌿. A time for responsibility and leadership.",
          JeongGwan: "The grand cycle of Wood 🌿. Honor and order prevail.",
          PyeonIn: "The grand cycle of Wood 🌿. Your intuition is sharpening.",
          JeongIn: "The grand cycle of Wood 🌿. Wisdom and knowledge run deep."
        },
        Fire: {
          BiGyean: "The grand cycle of Fire 🔥. Time to show your passion to the world!",
          GeopJae: "The grand cycle of Fire 🔥. Intense competition fuels your growth.",
          SikSin: "The grand cycle of Fire 🔥. Express your talents freely.",
          SangGwan: "The grand cycle of Fire 🔥. Your expression is bold and brilliant.",
          PyeonJae: "The grand cycle of Fire 🔥. Dynamic wealth energy flows in.",
          JeongJae: "The grand cycle of Fire 🔥. Build your wealth through steady effort.",
          PyeonGwan: "The grand cycle of Fire 🔥. Strong leadership is required.",
          JeongGwan: "The grand cycle of Fire 🔥. A time for honor and recognition.",
          PyeonIn: "The grand cycle of Fire 🔥. Inspiration strikes like lightning.",
          JeongIn: "The grand cycle of Fire 🔥. Warm wisdom guides your path."
        },
        Earth: {
          BiGyean: "The grand cycle of Earth ⛰️. A time to find your center and build stability.",
          GeopJae: "The grand cycle of Earth ⛰️. Unwavering conviction is your strength.",
          SikSin: "The grand cycle of Earth ⛰️. Focus on inner growth and refinement.",
          SangGwan: "The grand cycle of Earth ⛰️. Create with a practical touch.",
          PyeonJae: "The grand cycle of Earth ⛰️. Good for stable investments.",
          JeongJae: "The grand cycle of Earth ⛰️. Manage your resources with care.",
          PyeonGwan: "The grand cycle of Earth ⛰️. Overcome challenges with persistence.",
          JeongGwan: "The grand cycle of Earth ⛰️. A time to build trust and reliability.",
          PyeonIn: "The grand cycle of Earth ⛰️. Deep reflection brings clarity.",
          JeongIn: "The grand cycle of Earth ⛰️. Acquire stable and lasting knowledge."
        },
        Metal: {
          BiGyean: "The grand cycle of Metal ⚔️. Cut away the unnecessary with precision.",
          GeopJae: "The grand cycle of Metal ⚔️. Sharp judgment in the face of competition.",
          SikSin: "The grand cycle of Metal ⚔️. Refine your skills and expertise.",
          SangGwan: "The grand cycle of Metal ⚔️. Sharp criticism turns into deep insight.",
          PyeonJae: "The grand cycle of Metal ⚔️. Bold decisions bring financial rewards.",
          JeongJae: "The grand cycle of Metal ⚔️. Meticulous management of your assets.",
          PyeonGwan: "The grand cycle of Metal ⚔️. Achieve your goals with strong will.",
          JeongGwan: "The grand cycle of Metal ⚔️. Principles and rules are your guide.",
          PyeonIn: "The grand cycle of Metal ⚔️. Sharp analytical skills shine through.",
          JeongIn: "The grand cycle of Metal ⚔️. Build a systematic foundation of knowledge."
        },
        Water: {
          BiGyean: "The grand cycle of Water 🌊. Flow with wisdom and adaptability.",
          GeopJae: "The grand cycle of Water 🌊. Flexible response to competitive challenges.",
          SikSin: "The grand cycle of Water 🌊. Create within the gentle flow of life.",
          SangGwan: "The grand cycle of Water 🌊. Solve problems with fluid thinking.",
          PyeonJae: "The grand cycle of Water 🌊. Good fortune follows the natural flow.",
          JeongJae: "The grand cycle of Water 🌊. Wealth flows in smoothly and steadily.",
          PyeonGwan: "The grand cycle of Water 🌊. Wise and adaptable leadership is key.",
          JeongGwan: "The grand cycle of Water 🌊. Gentle order and harmony prevail.",
          PyeonIn: "The grand cycle of Water 🌊. Deep insights emerge from the depths.",
          JeongIn: "The grand cycle of Water 🌊. Wisdom springs forth like a fountain."
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
      title: "영혼 추출",
      name: "자신을 식별하세요",
      birthDate: "시간적 기원",
      birthTime: "정확한 시간",
      city: "공간적 좌표",
      gender: "바이브 체크",
      male: "남성",
      female: "여성",
      nonBinary: "논바이너리",
      preferNotToTell: "밝히고 싶지 않음",
      calendarType: "달력",
      solar: "양력",
      lunar: "음력",
      button: "운명 소환",
      locationSynced: "좌표 고정됨. ✨",
      errorTitle: "매트릭스 오류",
      errorDesc: "별들이 우리를 무시하고 있습니다. 데이터를 확인하고 다시 시도하세요.",
      errorButton: "다시 시도하기"
    },
    wheel: {
      alignment: "현재 정렬",
      year: "년",
      month: "월",
      hour: "시"
    },
    nav: {
      home: "공허로 돌아가기",
      synced: "고정됨.",
      back: "뒤로"
    },
    result: {
      title: "영혼 설계도",
      grandCycle: "인생의 계절",
      seasonVibe: "사이클 바이브",
      seasonVibeDisclaimer: "현재 대운의 오행을 기반으로 합니다.",
      back: "재정렬",
      lifeStages: {
        childhood: "유년기",
        youth: "청년기",
        maturity: "장년기",
        legacy: "노년기"
      },
      months: [
        "1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월"
      ],
      comments: {
        Wood: {
          BiGyean: "목(Wood)의 대운입니다 🌿. 새로운 시작과 성장의 시기입니다.",
          GeopJae: "목(Wood)의 대운입니다 🌿. 건강한 경쟁을 통한 성장입니다.",
          SikSin: "목(Wood)의 대운입니다 🌿. 꾸준한 노력이 결실로 이어집니다.",
          SangGwan: "목(Wood)의 대운입니다 🌿. 창의적인 에너지가 넘쳐납니다.",
          PyeonJae: "목(Wood)의 대운입니다 🌿. 예상치 못한 기회가 찾아옵니다.",
          JeongJae: "목(Wood)의 대운입니다 🌿. 안정적인 재물운이 상승합니다.",
          PyeonGwan: "목(Wood)의 대운입니다 🌿. 책임감과 리더십이 필요한 때입니다.",
          JeongGwan: "목(Wood)의 대운입니다 🌿. 명예와 질서가 함께합니다.",
          PyeonIn: "목(Wood)의 대운입니다 🌿. 직관력이 예리해집니다.",
          JeongIn: "목(Wood)의 대운입니다 🌿. 지혜와 지식이 깊어집니다."
        },
        Fire: {
          BiGyean: "화(Fire)의 대운입니다 🔥. 당신의 열정을 세상에 보여줄 때입니다!",
          GeopJae: "화(Fire)의 대운입니다 🔥. 치열한 경쟁이 당신을 성장시킵니다.",
          SikSin: "화(Fire)의 대운입니다 🔥. 당신의 재능을 마음껏 펼치세요.",
          SangGwan: "화(Fire)의 대운입니다 🔥. 표현이 대담하고 화려해집니다.",
          PyeonJae: "화(Fire)의 대운입니다 🔥. 역동적인 재물운이 들어옵니다.",
          JeongJae: "화(Fire)의 대운입니다 🔥. 꾸준한 노력으로 재물을 쌓으세요.",
          PyeonGwan: "화(Fire)의 대운입니다 🔥. 강한 리더십이 요구됩니다.",
          JeongGwan: "화(Fire)의 대운입니다 🔥. 명예와 인정을 받는 시기입니다.",
          PyeonIn: "화(Fire)의 대운입니다 🔥. 번뜩이는 영감이 찾아옵니다.",
          JeongIn: "화(Fire)의 대운입니다 🔥. 따뜻한 지혜가 당신을 인도합니다."
        },
        Earth: {
          BiGyean: "토(Earth)의 대운입니다 ⛰️. 내실을 다지고 중심을 잡아야 할 시기입니다.",
          GeopJae: "토(Earth)의 대운입니다 ⛰️. 흔들리지 않는 신념이 필요합니다.",
          SikSin: "토(Earth)의 대운입니다 ⛰️. 차분하게 내실을 다지세요.",
          SangGwan: "토(Earth)의 대운입니다 ⛰️. 현실적인 감각으로 창조하세요.",
          PyeonJae: "토(Earth)의 대운입니다 ⛰️. 안정적인 투자운이 좋습니다.",
          JeongJae: "토(Earth)의 대운입니다 ⛰️. 재물 관리에 힘쓰세요.",
          PyeonGwan: "토(Earth)의 대운입니다 ⛰️. 묵묵히 어려움을 극복하세요.",
          JeongGwan: "토(Earth)의 대운입니다 ⛰️. 신뢰를 쌓는 시기입니다.",
          PyeonIn: "토(Earth)의 대운입니다 ⛰️. 깊은 사색이 필요한 때입니다.",
          JeongIn: "토(Earth)의 대운입니다 ⛰️. 안정적인 지식을 습득하세요."
        },
        Metal: {
          BiGyean: "금(Metal)의 대운입니다 ⚔️. 결단력 있게 불필요한 것들을 정리해보세요.",
          GeopJae: "금(Metal)의 대운입니다 ⚔️. 냉철한 판단이 필요한 경쟁입니다.",
          SikSin: "금(Metal)의 대운입니다 ⚔️. 정교한 기술을 연마하세요.",
          SangGwan: "금(Metal)의 대운입니다 ⚔️. 날카로운 비판이 통찰이 됩니다.",
          PyeonJae: "금(Metal)의 대운입니다 ⚔️. 과감한 결단이 재물을 부릅니다.",
          JeongJae: "금(Metal)의 대운입니다 ⚔️. 꼼꼼한 재물 관리가 필요합니다.",
          PyeonGwan: "금(Metal)의 대운입니다 ⚔️. 강한 의지로 목표를 달성하세요.",
          JeongGwan: "금(Metal)의 대운입니다 ⚔️. 원칙을 지키는 것이 중요합니다.",
          PyeonIn: "금(Metal)의 대운입니다 ⚔️. 예리한 분석력이 빛납니다.",
          JeongIn: "금(Metal)의 대운입니다 ⚔️. 체계적인 지식을 쌓으세요."
        },
        Water: {
          BiGyean: "수(Water)의 대운입니다 🌊. 지혜롭게 흐름에 몸을 맡겨보세요.",
          GeopJae: "수(Water)의 대운입니다 🌊. 유연한 대처가 필요한 경쟁입니다.",
          SikSin: "수(Water)의 대운입니다 🌊. 부드러운 흐름 속에서 창조하세요.",
          SangGwan: "수(Water)의 대운입니다 🌊. 유연한 사고로 문제를 해결하세요.",
          PyeonJae: "수(Water)의 대운입니다 🌊. 흐름을 타는 투자운이 좋습니다.",
          JeongJae: "수(Water)의 대운입니다 🌊. 재물이 유연하게 들어옵니다.",
          PyeonGwan: "수(Water)의 대운입니다 🌊. 지혜로운 리더십이 필요합니다.",
          JeongGwan: "수(Water)의 대운입니다 🌊. 부드러운 질서가 함께합니다.",
          PyeonIn: "수(Water)의 대운입니다 🌊. 깊은 통찰력이 생깁니다.",
          JeongIn: "수(Water)의 대운입니다 🌊. 지혜가 샘솟는 시기입니다."
        }
      }
    }
  },
  INTERACTION_MESSAGES: {
    KO: {
      SikSinSaengJae: { title: "식신생재 (食神生財)", desc: "아이디어가 돈으로 직결됨", detail: "내가 가진 기술이나 재능(식상)이 시장의 수요(재성)를 만나 활발하게 유통되는 형상입니다. 완벽한 상품 출시와 매출 폭발." },
      JaeSaengGwan: { title: "재생관 (財生官)", desc: "자금력을 바탕으로 명예를 얻음", detail: "내가 쌓아온 재산이나 결과물(재성)이 나를 보호해주고 높여주는 조직이나 명예(관성)를 생해주는 형상입니다. 투자 성공 후 직급 상승 혹은 브랜드 가치 상승." },
      SalInSangSaeng: { title: "살인상생 (殺印相生)", desc: "위기를 기회와 권위로 바꿈", detail: "나를 힘들게 하는 압박과 스트레스(편관)를 공부와 인내, 지혜(인성)로 받아내어 오히려 내 권위로 만드는 형상입니다. 어려운 프로젝트 완수 후 독보적인 전문가로 인정됨." },
      SikSinJeSal: { title: "식신제살 (食神制殺)", desc: "내 능력으로 문제를 해결함", detail: "나를 괴롭히는 난제나 경쟁자(편관)를 나의 뛰어난 전문 기술이나 논리(식신)로 단칼에 해결하는 형상입니다. 리스크 관리 성공 및 난공불락의 거래처 확보." },
      GwanInSangSaeng: { title: "관인상생 (官印相生)", desc: "조직의 전폭적인 지원을 받음", detail: "조직(관성)의 기운이 나를 돕는 인성으로 흘러들어와 내가 편안하게 혜택을 입는 형상입니다. 대기업과의 안정적인 계약 혹은 승진 발령." },
      SangGwanPaeIn: { title: "상관패인 (傷官佩印)", desc: "날카로운 재능에 자격을 갖춤", detail: "상관(천재성, 비판력, 파격)이라는 날카로운 칼에 인성(학문, 도덕, 자격)이라는 칼집을 씌운 형상입니다. 브랜드 기획의 정점, 고도의 전략가." },
      JaeGeukIn: { title: "재극인 (財剋印)", desc: "현실적 이익과 명분의 충돌", detail: "학문이나 문서(인성)를 다루는 중에 현실적인 돈(재성)이 들어와 갈등하는 형상입니다. 학업 중단 후 취업 또는 지적 재산권을 통한 현금화." },
      ANeungSaengMo: { title: "아능생모 (兒能生母)", desc: "결과물이 다시 나를 살림", detail: "내가 만든 결과물(재성)이 너무 많아 힘들 때, 나의 활동력(식상)이 이를 소화해내는 형상입니다. 사업 확장 후 시스템 자동화 성공." },
      GeopJaeTalJae: { title: "겁재탈재 (劫財奪財)", desc: "동업 혹은 경쟁을 통한 재물 분탈", detail: "내 돈(재성)을 노리는 경쟁자나 동료(비겁)가 나타나는 형상입니다. 동업 사기 주의 또는 공동 투자로 인한 수익 배분." }
    },
    EN: {
      SikSinSaengJae: { title: "Siksin-Saengjae", desc: "Ideas directly translate to money", detail: "Your skills or talents (Sik-sang) meet market demand (Jae-seong), leading to active circulation. Perfect product launch and explosive sales." },
      JaeSaengGwan: { title: "Jae-Saeng-Gwan", desc: "Gaining honor through financial power", detail: "Your accumulated wealth or results (Jae-seong) support the organization or honor (Gwan-seong) that protects and elevates you. Career jump after investment success." },
      SalInSangSaeng: { title: "Sal-In-Sang-Saeng", desc: "Turning crisis into opportunity and authority", detail: "Taking the pressure and stress (Sal) and absorbing it with study, patience, and wisdom (In-seong) to turn it into your own authority. Recognized as an expert after completing a difficult project." },
      SikSinJeSal: { title: "Siksin-Je-Sal", desc: "Solving problems with your own ability", detail: "Using your superior technical skills or logic (Sik-sin) to resolve challenges or competitors (Sal). Risk management success and securing an impregnable client." },
      GwanInSangSaeng: { title: "Gwan-In-Sang-Saeng", desc: "Full support from the organization", detail: "The energy of the organization (Gwan-seong) flows into the In-seong that helps you, allowing you to comfortably receive benefits. Stable contract with a large corporation or promotion." },
      SangGwanPaeIn: { title: "Sang-Gwan-Pae-In", desc: "Equipping sharp talent with qualifications", detail: "The sharp blade of Sang-gwan (genius, critical power, unconventionality) is fitted with the scabbard of In-seong (academic, moral, qualification). The pinnacle of brand planning, a high-level strategist." },
      JaeGeukIn: { title: "Jae-Geuk-In", desc: "Conflict between realistic interest and justification", detail: "While dealing with academic or documents (In-seong), realistic money (Jae-seong) comes in, causing conflict. Employment after dropping out of studies or monetization through intellectual property rights." },
      ANeungSaengMo: { title: "A-Neung-Saeng-Mo", desc: "Results bring you back to life", detail: "When you have too many results (Jae-seong) and are struggling, your activity (Sik-sang) manages to digest it. Success in system automation after business expansion." },
      GeopJaeTalJae: { title: "Geop-Jae-Tal-Jae", desc: "Wealth deprivation through partnership or competition", detail: "A competitor or colleague (Bi-geop) aiming for your money (Jae-seong) appears. Beware of partnership fraud or profit sharing due to joint investment." }
    }
  }
};

export const ZODIAC_ANIMALS = [
  { id: 1, name: 'Rat', slug: 'za', hanja: '子', imgUrl: 'https://i.imgur.com/5AXZXiG.png' },
  { id: 2, name: 'Ox', slug: 'chuck', hanja: '丑', imgUrl: 'https://i.imgur.com/T6GPZ0J.png' },
  { id: 3, name: 'Tiger', slug: 'in', hanja: '寅', imgUrl: 'https://i.imgur.com/pVUcPWU.png' },
  { id: 4, name: 'Rabbit', slug: 'myo', hanja: '卯', imgUrl: 'https://i.imgur.com/zSFqWbz.png' },
  { id: 5, name: 'Dragon', slug: 'zin', hanja: '辰', imgUrl: 'https://i.imgur.com/5fxBlRf.png' },
  { id: 6, name: 'Snake', slug: 'sa', hanja: '巳', imgUrl: 'https://i.imgur.com/UyaLA4V.png' },
  { id: 7, name: 'Horse', slug: 'oh', hanja: '午', imgUrl: 'https://i.imgur.com/p7hIC28.png' },
  { id: 8, name: 'Goat', slug: 'me', hanja: '未', imgUrl: 'https://i.imgur.com/9DxZdCb.png' },
  { id: 9, name: 'Monkey', slug: 'sin', hanja: '申', imgUrl: 'https://i.imgur.com/xnsC82F.png' },
  { id: 10, name: 'Rooster', slug: 'yu', hanja: '酉', imgUrl: 'https://i.imgur.com/EtWrEIJ.png' },
  { id: 11, name: 'Dog', slug: 'sul', hanja: '戌', imgUrl: 'https://i.imgur.com/wqU5weH.png' },
  { id: 12, name: 'Pig', slug: 'hae', hanja: '亥', imgUrl: 'https://i.imgur.com/WM3tiwz.png' },
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
