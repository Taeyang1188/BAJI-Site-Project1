import fs from 'fs';
let content = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf8');

const s2 = `                                {lang === 'KO' 
                                    ? \`사용자('\${result.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}')와 상대방('\${partnerResult.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}')의 일간이 천간합을 이루며, 궁합 점수가 50점 이상일 때 표시됩니다. 서로의 정신적인 주파수가 일치하여 소울메이트가 될 수 있음을 의미합니다.\` 
                                    : \`Triggers when Day Stems '\${result.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}' and '\${partnerResult.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}' form a Heavenly Stem Match with a score > 50. Indicates soulmate potential.\`}
                            </div>`;

const r2 = `                                {partnerAnalysisMemo.isEasterEgg && !partnerAnalysisMemo.isExtremeMode ? (lang === 'KO' 
                                    ? \`사용자('\${result.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}')와 상대방('\${partnerResult.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}')의 일간이 천간합을 이루며, 궁합 점수가 50점 이상일 때 표시됩니다. 서로의 정신적인 주파수가 일치하여 소울메이트가 될 수 있음을 의미합니다.\` 
                                    : \`Triggers when Day Stems '\${result.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}' and '\${partnerResult.pillars.find((p: any) => p.title === 'Day' || p.title === '일주')?.stem}' form a Heavenly Stem Match with a score > 50. Indicates soulmate potential.\`) : partnerAnalysisMemo.extremeModeDesc}
                            </div>`;
                            
if (content.includes(s2)) {
  content = content.replace(s2, r2);
  fs.writeFileSync('src/components/DestinyMapSection.tsx', content);
  console.log("tooltip patched successfully");
} else {
  console.log("not found");
}
