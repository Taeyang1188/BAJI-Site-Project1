
export type Language = 'KO' | 'EN';

export type SocialContext = 'military_public' | 'corporate' | 'business_freelance' | 'student' | 'none';

export type JudgmentGrade = 'A' | 'B' | 'C';

export interface BaziMatrix {
  profile: {
    social_context: SocialContext;
    gender: string;
  };
  four_pillars: {
    year: { stem: string; branch: string; element: string };
    month: { stem: string; branch: string; element: string };
    day: { stem: string; branch: string; element: string };
    hour: { stem: string; branch: string; element: string };
  };
  analysis: {
    gyeokguk: string;
    temperature_index: string;
    energy_state: string;
    missing_elements: string[];
    five_elements_score: Record<string, number>;
  };
  interactions: {
    hap: string[];
    chung: string[];
    hyeong: string[];
    sin_sal: string[];
    gong_mang: string[];
  };
  dynamic_luck: {
    current_daewoon: string;
    current_seun: string;
    momentum_score: number;
    seun_score: number;
    elemental_friction: { type: string; level: number };
  };
  coordinator: {
    risk_gravity: number;
    judgment_grade: JudgmentGrade;
    alt_action?: string;
  };
  remedy_gate: string[];
}

export interface UserInput {
  name: string;
  birthDate: string;
  birthTime: string;
  city: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-tell';
  calendarType?: 'solar' | 'lunar';
  socialContext?: SocialContext;
}

export interface BaZiCard {
  title: string;
  hanja: string;
  stem: string;
  branch: string;
  stemEnglishName: string;
  stemKoreanName: string;
  branchEnglishName: string;
  branchKoreanName: string;
  element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  description: string;
  stemPolarity: number;
  branchPolarity: number;
  lifeStage?: string;
}

export interface DailyPillar {
  day: number;
  stem: string;
  branch: string;
  element: string;
  stemTenGodKo: string;
  stemTenGodEn: string;
  branchTenGodKo: string;
  branchTenGodEn: string;
  stemPolarity: number;
  branchPolarity: number;
}

export interface MonthlyPillar {
  month: number;
  stem: string;
  branch: string;
  element: string;
  stemTenGodKo: string;
  stemTenGodEn: string;
  branchTenGodKo: string;
  branchTenGodEn: string;
  dailyPillars: DailyPillar[];
  stemPolarity: number;
  branchPolarity: number;
}

export interface AnnualPillar {
  year: number;
  age: number;
  stem: string;
  branch: string;
  element: string;
  stemTenGodKo: string;
  stemTenGodEn: string;
  branchTenGodKo: string;
  branchTenGodEn: string;
  monthlyPillars: MonthlyPillar[];
  stemPolarity: number;
  branchPolarity: number;
}

export interface GrandCycle {
  age: number;
  year: number;
  stem: string;
  branch: string;
  element: string;
  stemTenGodKo: string;
  stemTenGodEn: string;
  branchTenGodKo: string;
  branchTenGodEn: string;
  annualPillars: AnnualPillar[];
  stemPolarity: number;
  branchPolarity: number;
}

export interface TimelineNarrative {
  title: string;        // 관계 테마 (ex: "[조후 보완] 얼어붙은 땅에 태양이 뜹니다")
  psychology: string;   // 유저의 심리 상태
  interaction: string;  // 상대방과의 실질적 관계 역동성 변화
  action_guide: string; // 온도 데이터와 결합된 실전 행동 지침
  intensity: number;    // 서사 강도 (UI 하이라이팅 및 이펙트 용도)
}

export interface BaZiResult {
  pillars: BaZiCard[];
  grandCycles: GrandCycle[];
  currentCycleIndex: number;
  currentYearPillar?: any;
  timeCorrectionMessages?: string[];
  analysis?: {
    geJu: string;
    yongShen: string;
    gender?: string;
    interactions: any[]; // Detailed interactions
    conflicts: any[];
    shinsal: any[];
    gongmang: any;
    tenGodsRatio: Record<string, number>;
    dayMasterStrength: any;
    yongshinDetail: any;
    structureDetail?: {
      title: string;
      enTitle: string;
      category: string;
      description: string;
      enDescription: string;
      marketingMessage: string;
      enMarketingMessage: string;
      logicNote: string;
      isDirty?: boolean;
      mainElement?: string;
    };
    muJaRon?: { title: string; description: string; enDescription: string }[];
    daJaRon?: { title: string; description: string; enDescription: string }[];
    shinGangShinYak?: { 
      isStrong: boolean;
      title: string; 
      summary: string;
      description: string; 
      enDescription?: string; 
      socialContext: string; 
      enSocialContext?: string;
    };
    relationshipAnalysis?: Record<string, {
      title: string;
      godName: string;
      ratio: number;
      description: string;
    }>;
    wolJiDeukRyeong?: string;
    jiJangGanSaRyeong?: string;
    geokGukDetail?: { geonRok: boolean; yangIn: boolean; description: string };
    personalizedInsights?: Record<string, { ko: string; en: string }>;
    dayMasterElement?: string;
    strength?: {
      level: number;
      score: number;
    };
    elementRatios?: Record<string, number>;
    balanceWarnings?: {
      title: string;
      titleEn: string;
      description: string;
      enDescription: string;
      type: 'warning' | 'danger';
      element: string;
    }[];
    genderSpecificAnalysis?: any;
    overloadAnalysis?: any;
    advancedEdgeCases?: any;
  };
}
