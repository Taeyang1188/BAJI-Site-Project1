const fs = require('fs');
const file = 'src/components/BaZiResultPage.tsx';
let code = fs.readFileSync(file, 'utf8');

// First, remove the block I added in patchRemoteHap2.cjs
// It starts with `let remoteBranchesStr = "년지와 시지 등";`
// and ends right before `detailTxtKo = ... `

const regexRemove = /let remoteBranchesStr = "년지와 시지 등";[\s\S]*?remoteBranchesStrEn = formattedStemsEn\.join\(" \+ "\);\n\s*\}/g;

code = code.replace(regexRemove, '');

// Now insert that block right after `let actualName = ""; ... else if (isHae) ...;`
// We'll attach it before `if (level === 'full') {`

const insertRegex = /else if \(isHae\) actualName = matchedBranchesKo \? `\$\{matchedBranchesKo\}해` : "지미해";/g;

const insertion = `else if (isHae) actualName = matchedBranchesKo ? \`\$\{matchedBranchesKo\}해\` : "지미해";

                                            let remoteBranchesStr = "년지와 시지 등";
                                            let remoteBranchesStrEn = "Year and Hour branches etc.";
                                            if (activeUserMatch.branches && activeUserMatch.pillarIndices && activeUserMatch.branches.length === activeUserMatch.pillarIndices.length) {
                                                const pillarNamesKo = ["년지", "월지", "일지", "시지"];
                                                const pillarNamesEn = ["Year", "Month", "Day", "Hour"];
                                                const formattedBranchesKo = activeUserMatch.branches.map((b: string, i: number) => {
                                                  const pIdx = activeUserMatch.pillarIndices[i] >= 0 && activeUserMatch.pillarIndices[i] <= 3 ? activeUserMatch.pillarIndices[i] : 0;
                                                  const el = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.element || "Wood";
                                                  const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el as keyof typeof ELEMENT_COLORS] || "#FFFFFF") : "#FFFFFF";
                                                  let name = BAZI_MAPPING.branches[b as keyof typeof BAZI_MAPPING.branches]?.ko || b;
                                                  if (name.length > 1) name = name.substring(0, 1);
                                                  return \`\${pillarNamesKo[pIdx]}의 [\${color}:\${name}(\${b})]\`;
                                                });
                                                remoteBranchesStr = formattedBranchesKo.join(" + ");
                                            } else if (activeUserMatch.stems && activeUserMatch.pillarIndices && activeUserMatch.stems.length === activeUserMatch.pillarIndices.length) {
                                                const pillarNamesKo = ["년간", "월간", "일간", "시간"];
                                                const pillarNamesEn = ["Year Stem", "Month Stem", "Day Stem", "Hour Stem"];
                                                const formattedStemsKo = activeUserMatch.stems.map((s: string, i: number) => {
                                                  const pIdx = activeUserMatch.pillarIndices[i] >= 0 && activeUserMatch.pillarIndices[i] <= 3 ? activeUserMatch.pillarIndices[i] : 0;
                                                  const el = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.element || "Wood";
                                                  const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el as keyof typeof ELEMENT_COLORS] || "#FFFFFF") : "#FFFFFF";
                                                  let name = BAZI_MAPPING.stems[s as keyof typeof BAZI_MAPPING.stems]?.ko || s;
                                                  if (name.length > 1) name = name.substring(0, 1);
                                                  return \`\${pillarNamesKo[pIdx]}의 [\${color}:\${name}(\${s})]\`;
                                                });
                                                remoteBranchesStr = formattedStemsKo.join(" + ");
                                            }`;
                                            
code = code.replace(insertRegex, insertion);

// Now replace (년지와 시지 등) everywhere with (__remoteBranchesStr__)
// Since it's in string literals, we can replace '(년지와 시지 등)' with `(${remoteBranchesStr})`
code = code.replace(/\(년지와 시지 등\)/g, '(${remoteBranchesStr})');

// BUT we need to make sure the templates use backticks where they were single quotes!
// Let's replace '사주 원국 양 극단(${remoteBranchesStr})에 위치하여...' -> wait, if they were backticks already, it's fine.
// If it was single quotes:
// detailTxtKo = '합을 구성하는 글자들이 멀리 떨어져서(${remoteBranchesStr}) 성립하는 원격 합입니다. ...' -> won't interpolate.
code = code.replace(/detailTxtKo = '합을 구성하는 글자들이 멀리 떨어져서\(\$\\{remoteBranchesStr\\}\) 성립하는 원격 합입니다([^']*)';/g, 
  "detailTxtKo = `합을 구성하는 글자들이 멀리 떨어져서(${remoteBranchesStr}) 성립하는 원격 합입니다$1`;");

fs.writeFileSync(file, code);
console.log('done global remoteBranchesStr');
