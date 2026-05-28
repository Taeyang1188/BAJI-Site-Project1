const fs = require('fs');
const file = 'src/components/BaZiResultPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// The logic previously added:
/*
if (activeUserMatch.branches && activeUserMatch.pillarIndices && activeUserMatch.branches.length === activeUserMatch.pillarIndices.length) { ... }
*/

// Let's replace that full if-else block with a more robust one that handles mismatched lengths or just uses pillarIndices to directly reconstruct it!
// Oh wait, `activeUserMatch.branches` for `방합` when it's `length === 3` and `pillarIndices` `length === 3`.
// If `activeUserMatch.branches` is `['巳', '酉']` and `pillarIndices` is `[0, 3]`.

const newLogic = `if (activeUserMatch.branches && activeUserMatch.pillarIndices && activeUserMatch.pillarIndices.length > 0) {
                                                const pillarNamesKo = ["년지", "월지", "일지", "시지"];
                                                const pillarNamesEn = ["Year", "Month", "Day", "Hour"];
                                                
                                                // Map over pillarIndices to handle multiple occurrences properly
                                                const formattedBranchesKo = activeUserMatch.pillarIndices.map((pIdx: number, i: number) => {
                                                  // get the branch... if branches is shorter, fallback to the last one or wrap around.
                                                  let b = activeUserMatch.branches[i] || activeUserMatch.branches[activeUserMatch.branches.length - 1];
                                                  const safeIdx = pIdx >= 0 && pIdx <= 3 ? pIdx : 0;
                                                  const el = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.element || "Wood";
                                                  const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el as keyof typeof ELEMENT_COLORS] || "#FFFFFF") : "#FFFFFF";
                                                  let name = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.ko || b;
                                                  if (name.length > 1) name = name.substring(0, 1);
                                                  return \`\${pillarNamesKo[safeIdx]}의 [\${color}:\${name}(\${b})]\`;
                                                });
                                                remoteBranchesStr = formattedBranchesKo.join(" + ");
                                                
                                                const formattedBranchesEn = activeUserMatch.pillarIndices.map((pIdx: number, i: number) => {
                                                  let b = activeUserMatch.branches[i] || activeUserMatch.branches[activeUserMatch.branches.length - 1];
                                                  const safeIdx = pIdx >= 0 && pIdx <= 3 ? pIdx : 0;
                                                  const el = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.element || "Wood";
                                                  const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el as keyof typeof ELEMENT_COLORS] || "#FFFFFF") : "#FFFFFF";
                                                  let name = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.en?.split(" ")[0] || b;
                                                  return \`\${pillarNamesEn[safeIdx]} [\${color}:\${name}(\${b})]\`;
                                                });
                                                remoteBranchesStrEn = formattedBranchesEn.join(" + ");
                                            } else if (activeUserMatch.stems && activeUserMatch.pillarIndices && activeUserMatch.pillarIndices.length > 0) {
                                                const pillarNamesKo = ["년간", "월간", "일간", "시간"];
                                                const pillarNamesEn = ["Year Stem", "Month Stem", "Day Stem", "Hour Stem"];
                                                
                                                const formattedStemsKo = activeUserMatch.pillarIndices.map((pIdx: number, i: number) => {
                                                  let s = activeUserMatch.stems[i] || activeUserMatch.stems[activeUserMatch.stems.length - 1];
                                                  const safeIdx = pIdx >= 0 && pIdx <= 3 ? pIdx : 0;
                                                  const el = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.element || "Wood";
                                                  const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el as keyof typeof ELEMENT_COLORS] || "#FFFFFF") : "#FFFFFF";
                                                  let name = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.ko || s;
                                                  if (name.length > 1) name = name.substring(0, 1);
                                                  return \`\${pillarNamesKo[safeIdx]}의 [\${color}:\${name}(\${s})]\`;
                                                });
                                                remoteBranchesStr = formattedStemsKo.join(" + ");
                                                
                                                const formattedStemsEn = activeUserMatch.pillarIndices.map((pIdx: number, i: number) => {
                                                  let s = activeUserMatch.stems[i] || activeUserMatch.stems[activeUserMatch.stems.length - 1];
                                                  const safeIdx = pIdx >= 0 && pIdx <= 3 ? pIdx : 0;
                                                  const el = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.element || "Wood";
                                                  const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el as keyof typeof ELEMENT_COLORS] || "#FFFFFF") : "#FFFFFF";
                                                  let name = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.en?.split(" ")[0] || s;
                                                  return \`\${pillarNamesEn[safeIdx]} [\${color}:\${name}(\${s})]\`;
                                                });
                                                remoteBranchesStrEn = formattedStemsEn.join(" + ");
                                            }`;

code = code.replace(/if \(activeUserMatch\.branches && activeUserMatch\.pillarIndices && activeUserMatch\.branches\.length === activeUserMatch\.pillarIndices\.length\) \{[\s\S]*?remoteBranchesStrEn = formattedStemsEn\.join\(" \+ "\);\n\s*\}/g, newLogic);
                            
fs.writeFileSync(file, code);
console.log("done relaxing length equality rule");
