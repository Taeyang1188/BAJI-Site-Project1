
import { calculateRealBaZi } from './src/services/bazi-service';
import { calculateRelationshipDynamics } from './src/services/relationship-dynamics-service';

const input1 = {
    name: 'Female 1996-11-30',
    birthDate: '1996-11-30',
    birthTime: '07:00',
    gender: 'female' as const,
    location: 'Daegu',
    calendarType: 'solar' as const,
    isIntercalary: false
};

const input2 = {
    name: 'Male 1996-04-06',
    birthDate: '1996-04-06',
    birthTime: '12:00',
    gender: 'male' as const,
    location: 'Busan',
    calendarType: 'solar' as const,
    isIntercalary: false
};

const p1 = calculateRealBaZi(input1, 35.8714, 128.6014, 'KO');
const p2 = calculateRealBaZi(input2, 35.1796, 129.0756, 'KO');

const dynamics = calculateRelationshipDynamics(
    p1, 
    p2, 
    p1.analysis.elementRatios, 
    p2.analysis.elementRatios, 
    'KO'
);

console.log('--- Simulation Analysis ---');
console.log(`Base Score: 46.875 (Estimated from debug)`);
console.log(`Sync Score: ${dynamics.syncScore}%`);
console.log(`Relation: ${dynamics.relation}`);
console.log(`Temperature: ${dynamics.temperature}C`);
console.log('Detected Gates:');
dynamics.gates.forEach(g => {
    console.log(`- [${g.name}]`);
});
if (dynamics.structuralSynergy) {
    console.log(`Structural Synergy: ${dynamics.structuralSynergy.badge}`);
}

// Manually checking the bonuses in the code logic for these inputs
// P1 Pillars: Hour: 辛卯, Day: 辛未, Month: 己亥, Year: 丙子
// P2 Pillars: Hour: 戊午, Day: 癸酉, Month: 壬辰, Year: 丙子
//
// 1. Same Age: 1996 (Rat). 丙子 vs 丙子.
//    - Day Master P1: 辛 (Metal), P2: 癸 (Water). 
//    - Metal generates Water -> Synergistic.
//    - Gate: ✨ [동갑의 시너지: 주파수 동조] (+10)
//
// 2. Day Master Interaction: 辛 (Metal) and 癸 (Water).
//    - No Stem Hap (辛-丙, 癸-戊)
//    - No Stem Chung
//
// 3. Structural synergy: 
//    - P1 GeJu: 상관격 (Sik-Sang)
//    - P2 GeJu: 정관격 (Gwan-Sal)
//    - Comparison: Sik-Gwan clash? (상관견관) 
//    - P1 GeJu: 상관격, P2 GeJu: 정관격. 
//    - applySynergy returns "상관견관(傷官見官) 리스크" (-15 penalty)
//    - But wait, if they are Gwan-Sik, does it return "식신제살" (+15 bonus)?
//    - Code check: if (hasGwanSikClash) return penalty 15.
//
// 4. Cross-Chart Samhap:
//    - Combined branches: 卯, 未, 亥, 子, 酉, 辰, 午
//    - P1 has 亥, 卯, 未 (Full Samhap Wood).
//    - P2 has 辰, 酉 (Hap).
//    - Combined has 亥, 卯, 未 (Full). 
//    - Since P1 already had it, gate "🌊 [에너지 공명: 해묘미 목국]" (+5)
//    - Combined has 申, 子, 辰? P1 has 子, P2 has 辰. Missing 申. 
//    - But 子 and 辰 are present. Does it form BanHap? 
//    - group.branches: 申, 子, 辰. combinedBranches includes 子, 辰.
//    - center is 子. 子 is in combinedBranches.
//    - Gate: 🔗 [에너지 연결: 신자진 수국 반합] (+5)
//
// 5. Cross-Karma (Mirroring):
//    - P1 Yong-hee: Metal, Earth
//    - P2 Yong-hee: Fire, Earth
//    - Does P1 provide Fire/Earth? P1 Has Fire (Year Stem 丙) and Earth (Month Stem 己, Day Branch 未). Yes.
//    - Does P2 provide Metal/Earth? P2 Has Metal (Day Branch 酉) and Earth (Month Branch 辰, Hour Stem 戊). Yes.
//    - Gate: ⚖️ [The Mirroring Bonus] 크로스 카르마 (+10)
//
// 6. Hyung (Partial): 
//    - P1: 卯, 未, 亥, 子
//    - P2: 午, 酉, 辰, 子
//    - Hyung pairs: 子-卯 (P1 子, P1 卯 - already exists in P1?). Wait, crossHyung checks cross-chart.
//    - P1 子 vs P2 ? 
//    - P1 卯 vs P2 子? No (already checked).
//    - P1 卯 vs P2 午? No.
//    - P2 酉 vs P1 ? 
//    - P1 未 vs P2 辰? No.
//    - Wait, previous run showed "🔪 [Surgical Adjustment]". Why?
//    - Let's check isHyung for (未, 辰)? No. (未, 戌)? No. (未, 丑)? Yes.
//    - (卯, 子)? Yes. P1 has 卯, P2 has 子. CROSS HYUNG! (-15 penalty).
//
// Calculation:
// Base: 46.875
// Bonuses:
// +10 (Same Age Synergy)
// +5 (Samhap Resonance Wood)
// +5 (BanHap Link Water)
// +10 (Mirroring/Karma)
// +15 (GeJu?) -> Wait, if it was Sik-Gwan bonus. or is it penalty? 
// let's run the script to see what exactly is active.
