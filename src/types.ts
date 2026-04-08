
export type Language = 'KO' | 'EN';

export interface UserInput {
  name: string;
  birthDate: string;
  birthTime: string;
  city: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-tell';
  calendarType?: 'solar' | 'lunar';
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

export interface BaZiResult {
  pillars: BaZiCard[];
  grandCycles: GrandCycle[];
  currentCycleIndex: number;
  currentYearPillar?: any;
  timeCorrectionMessages?: string[];
  analysis?: {
    geJu: string;
    yongShen: string;
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
  };
}
