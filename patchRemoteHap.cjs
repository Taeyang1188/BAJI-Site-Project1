const fs = require('fs');
const file = 'src/components/BaZiResultPage.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /detailTxtKo = '합을 구성하는 글자들이 멀리 떨어져서\(년지와 시지 등\) 성립하는 원격 합입니다\.[^]*?detailTxtEn = 'The combination is spaced apart, manifesting as a subtle background cohesion, reflective long-term vision, or pleasant long-distance support\.'\;/g;

const replacement = `
                                              let remoteBranchesStr = "년지와 시지 등";
                                              let remoteBranchesStrEn = "Year and Hour branches etc.";
                                              if (activeUserMatch.branches && activeUserMatch.pillarIndices && activeUserMatch.branches.length === activeUserMatch.pillarIndices.length) {
                                                const pillarNamesKo = ["년지", "월지", "일지", "시지"];
                                                const pillarNamesEn = ["Year", "Month", "Day", "Hour"];
                                                
                                                const formattedBranchesKo = activeUserMatch.branches.map((b: string, i: number) => {
                                                  const pIdx = activeUserMatch.pillarIndices[i];
                                                  const el = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.element || "Wood";
                                                  const color = typeof ELEMENT_COLORS !== 'undefined' ? 
                                                    (ELEMENT_COLORS[el as keyof typeof ELEMENT_COLORS] || "#FFFFFF") : 
                                                    (el === 'Wood' ? '#10B981' : el === 'Fire' ? '#EF4444' : el === 'Earth' ? '#F59E0B' : el === 'Metal' ? '#9CA3AF' : '#3B82F6');
                                                  const name = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.ko || b;
                                                  return \`\${pillarNamesKo[pIdx]}의 [#\${color}:\${name}(\${b})]\`;
                                                });
                                                remoteBranchesStr = formattedBranchesKo.join(" + ");

                                                const formattedBranchesEn = activeUserMatch.branches.map((b: string, i: number) => {
                                                  const pIdx = activeUserMatch.pillarIndices[i];
                                                  const el = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.element || "Wood";
                                                  const color = typeof ELEMENT_COLORS !== 'undefined' ? 
                                                    (ELEMENT_COLORS[el as keyof typeof ELEMENT_COLORS] || "#FFFFFF") : 
                                                    (el === 'Wood' ? '#10B981' : el === 'Fire' ? '#EF4444' : el === 'Earth' ? '#F59E0B' : el === 'Metal' ? '#9CA3AF' : '#3B82F6');
                                                  const name = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.en?.split(" ")[0] || b;
                                                  return \`\${pillarNamesEn[pIdx]} [#\${color}:\${name}(\${b})]\`;
                                                });
                                                remoteBranchesStrEn = formattedBranchesEn.join(" + ");
                                              }

                                              detailTxtKo = \`합을 구성하는 글자들이 멀리 떨어져서(\${remoteBranchesStr}) 성립하는 원격 합입니다. 정면에서 직접 끌어당기기보다는 보이지 않는 온화한 연대감, 사색적 성찰감, 또는 시간이 흐른 뒤 비로소 구현되는 은근한 소통 창구로 조화롭게 기능합니다.\`;
                                              detailTxtEn = \`The combination is spaced apart (\${remoteBranchesStrEn}), manifesting as a subtle background cohesion, reflective long-term vision, or pleasant long-distance support.\`;`;

code = code.replace(regex, replacement);

const tagRegex = /<p className="text-\[11px\] leading-relaxed opacity-95">\s*\{lang === 'KO' \? detailTxtKo : detailTxtEn\}\s*<\/p>/g;
const tagReplacement = `<p className="text-[11px] leading-relaxed opacity-95">
                                                      {lang === 'KO' ? <ParsedText text={detailTxtKo} lang={lang} /> : <ParsedText text={detailTxtEn} lang={lang} />}
                                                    </p>`;
code = code.replace(tagRegex, tagReplacement);

fs.writeFileSync(file, code);
console.log('done replacing');
