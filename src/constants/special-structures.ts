export interface SpecialStructureInfo {
  title: string;
  enTitle: string;
  category: 'Monarch' | 'Adaptive';
  description: string;
  enDescription: string;
  marketingMessage: string;
  enMarketingMessage: string;
}

export const SPECIAL_STRUCTURE_DEFINITIONS: Record<string, SpecialStructureInfo> = {
  // 전왕격 (Monarch Alignment)
  "곡직격": {
    title: "곡직격 (曲直格)",
    enTitle: "THE MONARCH ALIGNMENT [Wood]",
    category: "Monarch",
    description: "목(木)의 기운이 온 사주를 지배하는 격국으로, 인자함과 성장을 상징해.",
    enDescription: "A structure where Wood energy dominates the entire chart, symbolizing benevolence and growth.",
    marketingMessage: "굽히지 않는 생명력과 타인을 포용하는 리더십의 소유자야.",
    enMarketingMessage: "A leader with unyielding vitality and an inclusive nature."
  },
  "염상격": {
    title: "염상격 (炎上格)",
    enTitle: "THE MONARCH ALIGNMENT [Fire]",
    category: "Monarch",
    description: "화(火)의 기운이 치솟는 격국으로, 예의와 열정, 화려함을 상징해.",
    enDescription: "A structure where Fire energy blazes upward, symbolizing etiquette, passion, and brilliance.",
    marketingMessage: "세상을 밝히는 열정과 화려한 존재감으로 무대를 장악해.",
    enMarketingMessage: "Dominates the stage with passion that lights up the world and a brilliant presence."
  },
  "가색격": {
    title: "가색격 (稼穡格)",
    enTitle: "THE MONARCH ALIGNMENT [Earth]",
    category: "Monarch",
    description: "토(土)의 기운이 두텁게 쌓인 격국으로, 신용과 풍요, 포용력을 상징해.",
    enDescription: "A structure with thick Earth energy, symbolizing trust, abundance, and tolerance.",
    marketingMessage: "모든 것을 품어 결실을 맺게 하는 대지와 같은 포용력의 소유자야.",
    enMarketingMessage: "Possesses the tolerance of the earth, embracing everything to bring it to fruition."
  },
  "종혁격": {
    title: "종혁격 (從革格)",
    enTitle: "THE MONARCH ALIGNMENT [Metal]",
    category: "Monarch",
    description: "금(金)의 기운이 결집된 격국으로, 의리와 변혁, 결단력을 상징해.",
    enDescription: "A structure where Metal energy is concentrated, symbolizing loyalty, transformation, and decisiveness.",
    marketingMessage: "낡은 것을 혁파하고 새로운 질서를 세우는 강력한 결단력의 소유자야.",
    enMarketingMessage: "Possesses powerful decisiveness to overthrow the old and establish a new order."
  },
  "윤하격": {
    title: "윤하격 (潤下格)",
    enTitle: "THE MONARCH ALIGNMENT [Water]",
    category: "Monarch",
    description: "수(水)의 기운이 깊게 흐르는 격국으로, 지혜와 유연성, 침투력을 상징해.",
    enDescription: "A structure where Water energy flows deeply, symbolizing wisdom, flexibility, and penetration.",
    marketingMessage: "어떤 장애물도 유연하게 넘어서는 깊은 지혜와 통찰력의 소유자야.",
    enMarketingMessage: "Possesses deep wisdom and insight to flexibly overcome any obstacle."
  },

  // 종격 (Adaptive Alignment)
  "종아격": {
    title: "종아격 (從兒格)",
    enTitle: "THE ADAPTIVE ALIGNMENT [Artist/Rebel]",
    category: "Adaptive",
    description: "자신의 기운을 쏟아내는 식상(Artist/Rebel)의 기운에 순응하는 격국이야.",
    enDescription: "A structure that adapts to the energy of Sik-sang (Artist/Rebel), which pours out one's own energy.",
    marketingMessage: "환경에 적응하는 천재성: 시대의 흐름을 읽고 자신의 재능을 무한히 확장해.",
    enMarketingMessage: "Genius of adaptation: Reads the trends of the times and infinitely expands their talent."
  },
  "종재격": {
    title: "종재격 (從財格)",
    enTitle: "THE ADAPTIVE ALIGNMENT [Maverick/Architect]",
    category: "Adaptive",
    description: "세상의 결과물인 재성(Maverick/Architect)의 흐름에 몸을 맡기는 격국이야.",
    enDescription: "A structure that entrusts itself to the flow of Jae-seong (Maverick/Architect), the results of the world.",
    marketingMessage: "환경에 적응하는 천재성: 시장의 흐름을 포착하여 거대한 부와 성과를 일궈냅니다.",
    enMarketingMessage: "Genius of adaptation: Captures market trends to build immense wealth and results."
  },
  "종살격": {
    title: "종살격 (從殺格)",
    enTitle: "THE ADAPTIVE ALIGNMENT [Warrior/Judge]",
    category: "Adaptive",
    description: "강력한 조직이나 규칙인 관성(Warrior/Judge)의 권위에 순응하는 격국이야.",
    enDescription: "A structure that adapts to the authority of Gwan-seong (Warrior/Judge), representing powerful organizations or rules.",
    marketingMessage: "환경에 적응하는 천재성: 거대한 조직의 흐름을 타고 최고의 권위에 도달해.",
    enMarketingMessage: "Genius of adaptation: Rides the flow of large organizations to reach the highest authority."
  },
  "종왕격": {
    title: "종왕격 (從旺格)",
    enTitle: "THE ADAPTIVE ALIGNMENT [Mirror/Rival]",
    category: "Adaptive",
    description: "나와 같은 기운인 비겁(Mirror/Rival)의 강력한 세력에 합류하는 격국이야.",
    enDescription: "A structure that joins the powerful force of Bi-geop (Mirror/Rival), which is the same energy as oneself.",
    marketingMessage: "환경에 적응하는 천재성: 강력한 네트워크와 동료애를 바탕으로 독보적인 세력을 구축해.",
    enMarketingMessage: "Genius of adaptation: Builds a unique force based on powerful networks and camaraderie."
  },
  "종강격": {
    title: "종강격 (從强格)",
    enTitle: "THE ADAPTIVE ALIGNMENT [Mystic/Sage]",
    category: "Adaptive",
    description: "나를 생해주는 인성(Mystic/Sage)의 강력한 기운에 순응하는 격국이야.",
    enDescription: "A structure that adapts to the powerful energy of In-seong (Mystic/Sage), which supports oneself.",
    marketingMessage: "환경에 적응하는 천재성: 깊은 학문과 지혜의 흐름을 타고 정신적 지도자의 길을 걷습니다.",
    enMarketingMessage: "Genius of adaptation: Rides the flow of deep learning and wisdom to walk the path of a spiritual leader."
  }
};
