
export type Language = 'KO' | 'EN';

export interface UserInput {
  name: string;
  birthDate: string;
  birthTime: string;
  city: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-tell';
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
}
