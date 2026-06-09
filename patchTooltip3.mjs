import fs from 'fs';
let content = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf8');

const s2 = `{partnerAnalysisMemo.isEasterEgg && !partnerAnalysisMemo.isExtremeMode ? (lang === 'KO' 
                                    ? \`사주의 특수 법칙에 따라 0에 수렴해야 할 점수가 반전되어 도출된, 극도로 치명적이고 강렬한 기운의 끌림입니다.\` 
                                    : \`A rare twist of fate—an intense, rule-breaking attraction derived from special energetic structures.\`) : partnerAnalysisMemo.extremeModeDesc}`;

const r2 = `{partnerAnalysisMemo.isEasterEgg ? (lang === 'KO' 
                                    ? \`사주의 특수 법칙에 따라 0에 수렴해야 할 점수가 반전되어 도출된, 극도로 치명적이고 강렬한 기운의 끌림입니다.\` 
                                    : \`A rare twist of fate—an intense, rule-breaking attraction derived from special energetic structures.\`) : partnerAnalysisMemo.extremeModeDesc}`;
                            
if (content.includes(s2)) {
  content = content.replace(s2, r2);
  fs.writeFileSync('src/components/DestinyMapSection.tsx', content);
  console.log("tooltip correctly prioritized for EasterEgg");
} else {
  console.log("not found");
}
