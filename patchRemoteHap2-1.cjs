const fs = require('fs');
const file = 'src/components/BaZiResultPage.tsx';
let code = fs.readFileSync(file, 'utf8');

const regex = /let remoteBranchesStr = "년지와 시지 등";[^]*?detailTxtEn = `The combination is spaced apart \(\$\{remoteBranchesStrEn\}\), manifesting as a subtle background cohesion, reflective long-term vision, or pleasant long-distance support\.`;/g;

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
                                                  let name = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.ko || b;
                                                  if (name.length > 1) name = name.substring(0, 1);
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
                                              } else if (activeUserMatch.stems && activeUserMatch.pillarIndices && activeUserMatch.stems.length === activeUserMatch.pillarIndices.length) {
                                                const pillarNamesKo = ["년간", "월간", "일간", "시간"];
                                                const pillarNamesEn = ["Year Stem", "Month Stem", "Day Stem", "Hour Stem"];
                                                
                                                const formattedStemsKo = activeUserMatch.stems.map((s: string, i: number) => {
                                                  const pIdx = activeUserMatch.pillarIndices[i];
                                                  const el = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.element || "Wood";
                                                  const color = typeof ELEMENT_COLORS !== 'undefined' ? 
                                                    (ELEMENT_COLORS[el as keyof typeof ELEMENT_COLORS] || "#FFFFFF") : 
                                                    (el === 'Wood' ? '#10B981' : el === 'Fire' ? '#EF4444' : el === 'Earth' ? '#F59E0B' : el === 'Metal' ? '#9CA3AF' : '#3B82F6');
                                                  let name = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.ko || s;
                                                  if (name.length > 1) name = name.substring(0, 1);
                                                  return \`\${pillarNamesKo[pIdx]}의 [#\${color}:\${name}(\${s})]\`;
                                                });
                                                remoteBranchesStr = formattedStemsKo.join(" + ");

                                                const formattedStemsEn = activeUserMatch.stems.map((s: string, i: number) => {
                                                  const pIdx = activeUserMatch.pillarIndices[i];
                                                  const el = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.element || "Wood";
                                                  const color = typeof ELEMENT_COLORS !== 'undefined' ? 
                                                    (ELEMENT_COLORS[el as keyof typeof ELEMENT_COLORS] || "#FFFFFF") : 
                                                    (el === 'Wood' ? '#10B981' : el === 'Fire' ? '#EF4444' : el === 'Earth' ? '#F59E0B' : el === 'Metal' ? '#9CA3AF' : '#3B82F6');
                                                  const name = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.en?.split(" ")[0] || s;
                                                  return \`\${pillarNamesEn[pIdx]} [#\${color}:\${name}(\${s})]\`;
                                                });
                                                remoteBranchesStrEn = formattedStemsEn.join(" + ");
                                              }

                                              detailTxtKo = \`합을 구성하는 글자들이 멀리 떨어져서(\${remoteBranchesStr}) 성립하는 원격 합입니다. 정면에서 직접 끌어당기기보다는 보이지 않는 온화한 연대감, 사색적 성찰감, 또는 시간이 흐른 뒤 비로소 구현되는 은근한 소통 창구로 조화롭게 기능합니다.\`;
                                              detailTxtEn = \`The combination is spaced apart (\${remoteBranchesStrEn}), manifesting as a subtle background cohesion, reflective long-term vision, or pleasant long-distance support.\`;`;

code = code.replace(regex, replacement);

fs.writeFileSync(file, code);
console.log('done replacing remote hap logic');
