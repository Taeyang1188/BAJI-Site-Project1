const fs = require('fs');
const file = 'src/components/BaZiResultPage.tsx';
let code = fs.readFileSync(file, 'utf8');

const anchorRegex = /if \(activeUserMatch\.branches && activeUserMatch\.pillarIndices && activeUserMatch\.branches\.length === activeUserMatch\.pillarIndices\.length\) \{[\s\S]*?remoteBranchesStr = formattedStemsKo\.join\(" \+ "\);\n\s*\}/g;

const matched = code.match(anchorRegex);
console.log("Matched strings Count:", matched ? matched.length : 0);

if (matched) {
    const newLogic = `if (activeUserMatch.branches && activeUserMatch.pillarIndices && activeUserMatch.pillarIndices.length > 0) {
                                                const pillarNamesKo = ["년지", "월지", "일지", "시지"];
                                                const pillarNamesEn = ["Year", "Month", "Day", "Hour"];
                                                
                                                // Group duplicate branches
                                                const branchMap = new Map();
                                                activeUserMatch.pillarIndices.forEach((pIdx, i) => {
                                                    let b = activeUserMatch.branches[i] || activeUserMatch.branches[activeUserMatch.branches.length - 1];
                                                    const safeIdx = pIdx >= 0 && pIdx <= 3 ? pIdx : 0;
                                                    if (!branchMap.has(b)) {
                                                        branchMap.set(b, []);
                                                    }
                                                    branchMap.get(b).push(pillarNamesKo[safeIdx]);
                                                });
                                                
                                                const formattedBranchesKo = [];
                                                for (let [b, names] of branchMap.entries()) {
                                                    const el = BAZI_MAPPING.branches[b]?.element || "Wood";
                                                    const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el] || "#FFFFFF") : "#FFFFFF";
                                                    let name = BAZI_MAPPING.branches[b]?.ko || b;
                                                    if (name.length > 1) name = name.substring(0, 1);
                                                    const nameStr = names.join("·"); 
                                                    formattedBranchesKo.push(\`\${nameStr}의 [\${color}:\${name}(\${b})]\`);
                                                }
                                                remoteBranchesStr = formattedBranchesKo.join(" + ");
                                                
                                                // Handle English
                                                const branchMapEn = new Map();
                                                activeUserMatch.pillarIndices.forEach((pIdx, i) => {
                                                    let b = activeUserMatch.branches[i] || activeUserMatch.branches[activeUserMatch.branches.length - 1];
                                                    const safeIdx = pIdx >= 0 && pIdx <= 3 ? pIdx : 0;
                                                    if (!branchMapEn.has(b)) {
                                                        branchMapEn.set(b, []);
                                                    }
                                                    branchMapEn.get(b).push(pillarNamesEn[safeIdx]);
                                                });
                                                const formattedBranchesEn = [];
                                                for (let [b, names] of branchMapEn.entries()) {
                                                    const el = BAZI_MAPPING.branches[b]?.element || "Wood";
                                                    const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el] || "#FFFFFF") : "#FFFFFF";
                                                    let name = BAZI_MAPPING.branches[b]?.en?.split(" ")[0] || b;
                                                    const nameStr = names.join("/");
                                                    formattedBranchesEn.push(\`\${nameStr} [\${color}:\${name}(\${b})]\`);
                                                }
                                                remoteBranchesStrEn = formattedBranchesEn.join(" + ");
                                            } else if (activeUserMatch.stems && activeUserMatch.pillarIndices && activeUserMatch.pillarIndices.length > 0) {
                                                const pillarNamesKo = ["년간", "월간", "일간", "시간"];
                                                const pillarNamesEn = ["Year Stem", "Month Stem", "Day Stem", "Hour Stem"];
                                                
                                                const stemMap = new Map();
                                                activeUserMatch.pillarIndices.forEach((pIdx, i) => {
                                                    let s = activeUserMatch.stems[i] || activeUserMatch.stems[activeUserMatch.stems.length - 1];
                                                    const safeIdx = pIdx >= 0 && pIdx <= 3 ? pIdx : 0;
                                                    if (!stemMap.has(s)) {
                                                        stemMap.set(s, []);
                                                    }
                                                    stemMap.get(s).push(pillarNamesKo[safeIdx]);
                                                });
                                                const formattedStemsKo = [];
                                                for (let [s, names] of stemMap.entries()) {
                                                    const el = BAZI_MAPPING.stems[s]?.element || "Wood";
                                                    const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el] || "#FFFFFF") : "#FFFFFF";
                                                    let name = BAZI_MAPPING.stems[s]?.ko || s;
                                                    if (name.length > 1) name = name.substring(0, 1);
                                                    const nameStr = names.join("·");
                                                    formattedStemsKo.push(\`\${nameStr}의 [\${color}:\${name}(\${s})]\`);
                                                }
                                                remoteBranchesStr = formattedStemsKo.join(" + ");
                                                
                                                const stemMapEn = new Map();
                                                activeUserMatch.pillarIndices.forEach((pIdx, i) => {
                                                    let s = activeUserMatch.stems[i] || activeUserMatch.stems[activeUserMatch.stems.length - 1];
                                                    const safeIdx = pIdx >= 0 && pIdx <= 3 ? pIdx : 0;
                                                    if (!stemMapEn.has(s)) {
                                                        stemMapEn.set(s, []);
                                                    }
                                                    stemMapEn.get(s).push(pillarNamesEn[safeIdx]);
                                                });
                                                const formattedStemsEn = [];
                                                for (let [s, names] of stemMapEn.entries()) {
                                                    const el = BAZI_MAPPING.stems[s]?.element || "Wood";
                                                    const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el] || "#FFFFFF") : "#FFFFFF";
                                                    let name = BAZI_MAPPING.stems[s]?.en?.split(" ")[0] || s;
                                                    const nameStr = names.join("/");
                                                    formattedStemsEn.push(\`\${nameStr} [\${color}:\${name}(\${s})]\`);
                                                }
                                                remoteBranchesStrEn = formattedStemsEn.join(" + ");
                                            }`;

    code = code.replace(anchorRegex, newLogic);
    fs.writeFileSync(file, code);
    console.log("Successfully replaced rule and added grouping (e.g. 일지·연지의 사화).");
} else {
    console.log("Regex didn't match. Here is the context:");
    const testMatch = code.match(/if \(activeUserMatch/);
    console.log(testMatch ? testMatch[0] : 'no match at all');
}
