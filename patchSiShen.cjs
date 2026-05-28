const fs = require('fs');
const file = 'src/components/BaZiResultPage.tsx';
let code = fs.readFileSync(file, 'utf8');

const anchor = '                                            return (\n                                              <div className="space-y-3 mt-3">';

const injection = `
                                            // Dynamic overrides for specific combinations based on chart environment
                                            if (activeUserMatch && activeUserMatch.branches) {
                                                const bStr = [...activeUserMatch.branches].sort().join('');
                                                const hasWaterStem = (result.stems || []).some(s => s === '壬' || s === '癸');
                                                const hasFireStemOrBranch = (result.stems || []).some(s => s === '丙' || s === '丁') || (result.branches || []).filter(b => b === '午' || b === '巳').length > 1;
                                                const hasFire = hasFireStemOrBranch; 
                                                const hasMetalStem = (result.stems || []).some(s => s === '庚' || s === '辛');
                                                const hasFireStem = (result.stems || []).some(s => s === '丙' || s === '丁');

                                                if (bStr === '巳申' || bStr === '申巳') {
                                                    let shinTenGod = "금(金) 십성";
                                                    activeUserMatch.branches.forEach((b: string, i: number) => {
                                                        if (b === '申') {
                                                            const pIdx = activeUserMatch.pillarIndices[i];
                                                            shinTenGod = result.pillars[pIdx]?.branchTenGodKo || "비견";
                                                        }
                                                    });

                                                    if (hasWaterStem) {
                                                        detailTxtKo = \`사신합(\${remoteBranchesStr})은 천간에 수(水) 기운이 떠 있어 온전한 합화(合化) 작용이 일어납니다. 수 기운 본연의 유연함과 통찰력이 강화되며, 사(巳)와 신(申)이 매끄럽게 연대하여 맹렬하면서도 단합된 사회적 성취를 이루어냅니다.\`;
                                                        detailTxtEn = \`The Si-Shen combination (\${remoteBranchesStrEn}) successfully transforms into Water due to the presence of Water stems, leading to smooth collaboration and strong bonding.\`;
                                                    } else if (!hasWaterStem && hasFire) {
                                                        detailTxtKo = \`물(水)이 없고 불(火)이 강한 환경으로 인해, 사신합(\${remoteBranchesStr})의 합이 온전치 못하고 형살(刑殺)의 역동이 거세게 드러납니다. 금(金) 기운이 다치기 쉬우니, 신금(申金)의 십성인 \${shinTenGod} 영역(건강, 재물, 대인관계 등)에서 무리한 제어나 충돌 사고를 주의해야 합니다.\`;
                                                        detailTxtEn = \`Due to the lack of Water and strong Fire, the Si-Shen combination (\${remoteBranchesStrEn}) breaks and turns into a Punishment (Hyeong), potentially damaging the Metal element. Exercise caution in the areas represented by \${shinTenGod}.\`;
                                                    } else {
                                                        detailTxtKo = \`육합, 형, 파가 얽힌 사신(\${remoteBranchesStr})은 환경에 따라 수(水)나 금(金)으로 주도권이 변하며, 합(융합)과 형(갈등 및 재조립)을 오갑니다. 상황 변화에 따른 극적인 리모델링이나 패러다임 전환의 역동성을 지닙니다.\`;
                                                        detailTxtEn = \`The Si-Shen relationship (\${remoteBranchesStrEn}) fluctuates between fusion and friction depending on the environment, creating dynamic cycles of breaking and remaking.\`;
                                                    }
                                                } else if (bStr === '卯戌' || bStr === '戌卯') {
                                                    if (hasFireStem) {
                                                        detailTxtKo = \`묘술합(\${remoteBranchesStr})은 천간에 화(火) 기운이 있어 불꽃으로 변하는 합화가 원활합니다. 예술적 열정이나 학문적 이상이 화려하게 만개하는 긍정적인 발현을 이룹니다.\`;
                                                        detailTxtEn = \`The Mao-Xu combination (\${remoteBranchesStrEn}) smoothly transforms into Fire, igniting artistic passion and academic ideals.\`;
                                                    } else {
                                                        detailTxtKo = \`화(火) 기운이 다소 부족한 묘술합(\${remoteBranchesStr})으로, 완전한 융합보다는 목(木)과 토(土)의 은근한 견제와 속을 알 수 없는 미묘한 끌림이 지속되는 형태를 띱니다.\`;
                                                        detailTxtEn = \`Without sufficient Fire stems, the Mao-Xu combination (\${remoteBranchesStrEn}) acts as a mysterious attraction rather than a full transformation, maintaining subtle friction.\`;
                                                    }
                                                } else if (bStr === '辰酉' || bStr === '酉辰') {
                                                    if (hasMetalStem) {
                                                        detailTxtKo = \`진유합(\${remoteBranchesStr})은 천간의 금(金) 기운을 받아 예리하고 단단한 속성으로 완벽히 변모합니다. 매우 견고한 카르텔적 의리와 전문적인 비즈니스 계약이 빈틈없이 성사됩니다.\`;
                                                        detailTxtEn = \`The Chen-You combination (\${remoteBranchesStrEn}) transforms perfectly into Metal, ensuring highly robust cartels and tight professional agreements.\`;
                                                    } else {
                                                        detailTxtKo = \`진유합(\${remoteBranchesStr})은 든든히 밀어주는 조력자적 화합으로, 금(金)기가 폭발하기보다는 안정적인 습토(辰)가 보석(酉)을 묵묵히 생조하고 보호하는 형태로 나타납니다.\`;
                                                        detailTxtEn = \`The Chen-You combination (\${remoteBranchesStrEn}) provides reliable, stable support where the moist earth gently nurtures and protects the precious metal.\`;
                                                    }
                                                }
                                            }

                                            return (
                                              <div className="space-y-3 mt-3">
`;

code = code.replace(anchor, injection);
fs.writeFileSync(file, code);
console.log('done patching BaZiResultPage.tsx for SiShen condition');
