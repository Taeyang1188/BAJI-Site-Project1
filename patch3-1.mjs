import fs from 'fs';
let code = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf8');

const s1 = "                 <div className={`text-xs mb-3 text-left relative z-10 ${partnerAnalysisMemo.isEasterEgg ? '(partnerAnalysisMemo.isEasterEgg || partnerAnalysisMemo.isExtremeMode) ? 'text-red-400 font-bold' : 'text-white/50'}`}>\n";
const r1 = "                 <div className={`text-xs mb-3 text-left relative z-10 ${(partnerAnalysisMemo.isEasterEgg || partnerAnalysisMemo.isExtremeMode) ? 'text-red-400 font-bold' : 'text-white/50'}`}>\n";
code = code.replace(s1, r1);

const s2 = "                                 {lang === 'KO' \n                                     ? `사용자('${result.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}')와 상대방('${partnerResult.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}')의 일간이 천간합을 이루며, 궁합 점수가 50점 이상일 때 표시됩니다. 서로의 정신적인 주파수가 일치하여 소울메이트가 될 수 있음을 의미합니다.` \n                                     : `Triggers when Day Stems '${result.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}' and '${partnerResult.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}' form a Heavenly Stem Match with a score > 50. Indicates soulmate potential.`}\n";
const r2 = "                                 {partnerAnalysisMemo.isEasterEgg ? (lang === 'KO' \n                                     ? `사용자('${result.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}')와 상대방('${partnerResult.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}')의 일간이 천간합을 이루며, 궁합 점수가 50점 이상일 때 표시됩니다. 서로의 정신적인 주파수가 일치하여 소울메이트가 될 수 있음을 의미합니다.` \n                                     : `Triggers when Day Stems '${result.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}' and '${partnerResult.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}' form a Heavenly Stem Match with a score > 50. Indicates soulmate potential.`) : partnerAnalysisMemo.extremeModeDesc}\n";
code = code.replace(s2, r2);

const s3 = "                 {partnerAnalysisMemo.intensityMode ? (\n                     <div className=\"flex flex-col mb-4\">\n                         <span className=\"text-sm font-bold text-white/80 flex items-center gap-1.5 mb-2\">\n                             <span className=\"text-lg\">{partnerAnalysisMemo.syncIcon}</span> {partnerAnalysisMemo.syncTierText}\n                         </span>\n                         <div className=\"flex flex-col gap-2 w-full\">\n";
const r3 = "                 {partnerAnalysisMemo.intensityMode ? (\n                     <div className=\"flex flex-col mb-4\">\n                         <div className=\"flex flex-col gap-2 w-full mt-2\">\n";
code = code.replace(s3, r3);

const s4 = "                     <>\n                         <div className=\"flex flex-col gap-1 mb-4\">\n                             <span className=\"text-sm font-bold text-white/80 flex items-center gap-1.5\">\n                                 <span className=\"text-lg\">{partnerAnalysisMemo.syncIcon}</span> {partnerAnalysisMemo.syncTierText}\n                             </span>\n                             <span className={`text-[2.2rem] leading-none font-mono font-bold ${partnerAnalysisMemo.isEasterEgg ? 'text-red-500' : 'text-fuchsia-300'}`}>\n";
const r4 = "                     <>\n                         <div className=\"flex flex-col gap-1 mb-4\">\n                             {!partnerAnalysisMemo.isExtremeMode && (\n                                 <span className=\"text-sm font-bold text-white/80 flex items-center gap-1.5\">\n                                     <span className=\"text-lg\">{partnerAnalysisMemo.syncIcon}</span> {partnerAnalysisMemo.syncTierText}\n                                 </span>\n                             )}\n                             <span className={`text-[2.2rem] leading-none font-mono font-bold ${(partnerAnalysisMemo.isEasterEgg || partnerAnalysisMemo.isExtremeMode) ? 'text-red-500' : 'text-fuchsia-300'}`}>\n";
code = code.replace(s4, r4);

fs.writeFileSync('src/components/DestinyMapSection.tsx', code);
console.log('patched successfully!');
