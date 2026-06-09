import * as fs from 'fs';

const filePath = 'src/components/BaZiResultPage.tsx';
let data = fs.readFileSync(filePath, 'utf8');

// Find start string
const startMarker = `className="text-[11.5px] leading-relaxed pr-1 space-y-3"`;
const startIdx = data.indexOf(startMarker);
if (startIdx === -1) {
  console.error("Start marker not found");
  process.exit(1);
}

// Inside that block, find {(() => {
const fnsStartMarker = `{(() => {`;
const fnsStartIdx = data.indexOf(fnsStartMarker, startIdx);
if (fnsStartIdx === -1) {
  console.error("fnsStartIdx not found");
  process.exit(1);
}

// Find the end marker
const endMarker = `/* Advanced Multiple Interactions Breakdown (Moved to Right Panel inside motion.div) */`;
const endIdx = data.indexOf(endMarker, fnsStartIdx);
if (endIdx === -1) {
  console.error("End marker not found");
  process.exit(1);
}

// We want to find the last })()} before the end marker
const searchArea = data.substring(fnsStartIdx, endIdx);
const lastClosingIdx = searchArea.lastIndexOf('})()}');
if (lastClosingIdx === -1) {
  console.error("lastClosingIdx not found");
  process.exit(1);
}

const sliceEnd = fnsStartIdx + lastClosingIdx + 5; // length of '})()' is 5 or '})()}' is 6

console.log("Replacing chunk of length:", sliceEnd - fnsStartIdx);

const replacement = `{(() => {
                              const activeUserMatch = getUserInteractionMatch(guideRelTab, activeItem.branches);
                              if (!activeUserMatch) return null;

                              const matchStrength = getInteractionStrength(activeUserMatch);
                              if (!matchStrength) return null;

                              const level = matchStrength.level;

                              let containerClass = "";
                              let pulseDescClass = "";
                              let strengthBadgeTxt = "";
                              let detailTxtKo = "";
                              let detailTxtEn = "";

                              const isClash = guideRelTab === 'clash';
                              const isHyeong = guideRelTab === 'punish';
                              const isPa = guideRelTab === 'destroy';
                              const isHae = guideRelTab === 'harm';

                              const pIndices = activeUserMatch.pillarIndices || [];
                              const remoteBranchesStr = pIndices.map((pIdx: number) => {
                                const pName = getPillarNameLocal(pIdx, lang);
                                const pMean = getPillarMeaningLocal(pIdx, lang);
                                return \`\${pName}(\${pMean})\`;
                              }).join(' ↔ ');

                              const remoteBranchesStrEn = pIndices.map((pIdx: number) => {
                                const pName = getPillarNameLocal(pIdx, 'EN');
                                const pMean = getPillarMeaningLocal(pIdx, 'EN');
                                return \`\${pName} (\${pMean})\`;
                              }).join(' ↔ ');

                              const actualName = lang === 'KO' ? activeItem.resultKo : activeItem.resultEn;
                              const actualNameEn = activeItem.resultEn;

                              // stems in chart
                              const stems = result?.pillars?.map((p: any) => p.stem) || [];

                              if (level === 'full') {
                                pulseDescClass = "desc-glow-full";
                                containerClass = isLight 
                                  ? 'bg-amber-500/5 border-amber-400 text-amber-950 shadow-[0_3px_12px_rgba(245,158,11,0.15)] font-bold' 
                                  : 'bg-[#1e1302] border-amber-500/40 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-bold';
                                
                                strengthBadgeTxt = lang === 'KO' ? '완전 활성화(초강력)' : 'Active (Strong)';
                                detailTxtKo = \`당신의 명식 내부에서 인접한 두 기둥 사이에 가장 강력하고 완전한 온전한 결합이 이루어졌습니다. 두 글자 간의 상호작용이 인생 전체에 걸쳐 지배적이며 압도적인 테마로 직접 가동됩니다.\`;
                                detailTxtEn = \`A complete close interaction is fully formed and loaded, acting as a highly prominent and central psychological driver in your chart.\`;
                              } else if (level === 'half') {
                                pulseDescClass = "desc-glow-half";
                                containerClass = isLight 
                                  ? 'bg-sky-500/5 border-sky-400 text-sky-950 shadow-[0_3px_12px_rgba(14,165,233,0.15)] font-bold' 
                                  : 'bg-[#091a27] border-sky-500/40 text-sky-200 shadow-[0_0_12px_rgba(14,165,233,0.2)] font-bold';
                                
                                strengthBadgeTxt = lang === 'KO' ? '부분적 결합 가동(강)' : 'Semi-Active';
                                detailTxtKo = \`사주 원국 내에 부분적(반합, 가합 등)으로 결속되어 완벽한 결합을 지원할 준비가 끝난 주파수입니다. 상황이나 대운/세운 등 새로운 인연의 유입에 따라 폭발적인 힘으로 전환될 가능성을 가집니다.\`;
                                detailTxtEn = \`A semi-active connection is established in your chart. This relationship carries vibrant readiness to spark into full activation upon receiving temporal triggers.\`;
                              } else if (level === 'remote') {
                                pulseDescClass = "desc-glow-present";
                                containerClass = isLight 
                                  ? 'bg-violet-500/5 border-violet-400 text-violet-950 shadow-[0_3px_12px_rgba(139,92,246,0.15)] text-xs' 
                                  : 'bg-[#120a1f] border-violet-500/40 text-violet-200 shadow-[0_0_12px_rgba(139,92,246,0.2)] text-xs';
                                
                                if (isClash) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격충 조율' : 'Remote Clash';
                                  detailTxtKo = \`사주 원국 양 극단(\${remoteBranchesStr})에 위치하여 간접적으로 작용하는 원격충(\${actualName})입니다. 현실에서의 물리적인 갈등이나 급변함은 최소화되나, 내면에 예술적인 정밀함, 신중한 판단력, 그리고 시간의 흐름을 기다릴 줄 아는 성숙한 지혜의 자양분이 됩니다.\`;
                                  detailTxtEn = \`Quiet remote friction presents low physical clash but triggers deep self-reflection, artistic inspiration, and seasoned strategic prudence.\`;
                                } else if (isHyeong) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 형살' : 'Remote Punishment';
                                  detailTxtKo = \`멀리 떨어져서 작용하는 원격 형살(\${remoteBranchesStr}, \${actualName})입니다. 실생활의 직접 조율 마찰보다는 미학적/정신적 성찰, 그리고 점진적 조절 능력을 키워줍니다.\`;
                                  detailTxtEn = \`Remote punishment operates quietly at a distance, refining your inner discipline and strategic patience rather than causing active friction.\`;
                                } else if (isPa) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 파살' : 'Remote Destruction';
                                  detailTxtKo = \`보이지 않는 먼 거리에서 작용하는 원격 파살(\${remoteBranchesStr}, \${actualName})입니다. 은근한 틈새를 정돈하며 사소한 오점이나 사각지대를 수시로 조용하게 보완해 가는 힘을 줍니다.\`;
                                  detailTxtEn = \`Remote destruction works slowly in the background, offering subtle, precise corrective opportunities over time.\`;
                                } else if (isHae) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 해살' : 'Remote Harm';
                                  detailTxtKo = \`원거리에서 조율하는 원격 해살(\${remoteBranchesStr}, \${actualName})입니다. 불필요한 감정 자극 없이 담백하고 이성적인 대인관계의 안정 거리를 유지하는 방어기제로 작동합니다.\`;
                                  detailTxtEn = \`Remote harm acts as a protective boundary, helping you maintain healthy, objective personal distances.\`;
                                } else {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 마찰 조율' : 'Remote Friction';
                                  detailTxtKo = \`원거리 지지 간의 완만한 마찰 관계를 조화롭게 다듬습니다.\`;
                                  detailTxtEn = \`Gently calibrates the remote relational tension across the chart.\`;
                                }
                              } else if (level === 'clash_full') {
                                pulseDescClass = "desc-glow-full";
                                containerClass = isLight 
                                  ? 'bg-rose-500/5 border-rose-400 text-rose-950 shadow-[0_3px_12px_rgba(244,63,94,0.15)]' 
                                  : 'bg-[#210915] border-rose-500/45 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)]';
                                
                                if (isClash) {
                                  strengthBadgeTxt = lang === 'KO' ? '정면충돌 작용(초강력)' : 'Direct Class Collision';
                                  detailTxtKo = \`인접한 사주 기둥 사이에서 직접적이고 강력한 정면충(\${remoteBranchesStr}, \${actualName})이 전면 가동 중입니다. 인생 전반에 걸쳐 고여있는 고정관념을 일거에 깨부수는 파괴적 개혁, 혁신, 급진적인 패러다임 리셋을 통한 눈부신 기회 창출을 이끕니다.\`;
                                  detailTxtEn = \`A direct, heavy branch collision (\${remoteBranchesStrEn}) is fully active. This supreme tension demands and grants swift, dramatic transformations, letting you break through stagnant limits.\`;
                                } else if (isHyeong) {
                                  if (activeUserMatch.type === '삼형') {
                                    strengthBadgeTxt = lang === 'KO' ? '삼형살 가동(초강력)' : 'Complete Tri-Punishment';
                                    detailTxtKo = \`사주 원국에 3개의 지지(\${remoteBranchesStr})가 완벽히 모여 거대한 \${actualName}이 완성되었습니다. 거침없는 에너지가 정밀한 제어망을 통과하며, 생살여탈을 쥐는 권력, 사람을 살리는 의료, 혹은 극도로 고도화된 정밀 엔지니어링/법조 분야에서 범접할 수 없는 카리스마와 탁월한 대업을 이룩할 폭발력을 선사합니다.\`;
                                    detailTxtEn = \`A complete Tri-Punishment (\${remoteBranchesStrEn}) is locked into your destiny. This overwhelming energy grants you immense charisma and unparalleled mastery in high-stakes fields like legal, life-saving medical, or supreme structural engineering.\`;
                                  } else {
                                    strengthBadgeTxt = lang === 'KO' ? '형살 가동(완전)' : 'Active Punishment';
                                    detailTxtKo = \`사주원국에서 강력하게 매칭된 형살(\${remoteBranchesStr}, \${actualName})의 압박과 조율 능력이 직접 작동하고 있습니다. 이 날카로운 설계 도면을 깎고 다듬는 과정에서 아무나 가질 수 없는 고도의 전문성(의료/보건, 법조/수사, 정밀 엔지니어링, 설계 편집 등)을 확보하여 압도적인 해결사로서 세상을 이끌어갑니다.\`;
                                    detailTxtEn = \`The comprehensive, active force of Punishment is processed, polishing your expertise in legal, medical, surgical, structural, or precise engineering fields.\`;
                                  }
                                } else if (isPa) {
                                  strengthBadgeTxt = lang === 'KO' ? '파살 조율(강)' : 'Strong Destruction';
                                  detailTxtKo = \`미세한 조정과 수정을 상징하는 파살(\${remoteBranchesStr}, \${actualName})이 강력히 발현되어 있습니다. 미처 완성되지 않은 아이디어의 틈새를 정교하게 메우고 결점을 제거하는 디버깅 역량, 리모델링, 기성 부품을 맞춤 성형하는 유연한 트러블슈팅 능력의 절정을 선사합니다.\`;
                                  detailTxtEn = \`The sharp destructive adjustment is highly active, reinforcing your ability to inspect, repair, debug, and remodel existing ideas.\`;
                                } else if (isHae) {
                                  strengthBadgeTxt = lang === 'KO' ? '해살 방어(강)' : 'Strong Harm Barrier';
                                  detailTxtKo = \`방해 요소나 대인관계의 피로감을 다스리는 해살(\${remoteBranchesStr}, \${actualName})의 주파수가 위치합니다. 이를 통해 사람 간의 보이지 않는 선을 분명히 그어 내면의 영역을 수호하는 조밀함이 가동되며, 법적 문서나 계약서의 은밀한 위험요소를 잡아내는 완벽주의적 안목이 대단히 명확해집니다.\`;
                                  detailTxtEn = \`Harm boundaries are highly active, helping you define emotional barriers and identify hidden legal or contractual details with high scrutiny.\`;
                                } else {
                                  strengthBadgeTxt = lang === 'KO' ? '조율 작용 가동' : 'Active Adjuster';
                                  detailTxtKo = \`사주 내 긴장감을 해소하고 새로운 발판을 마련하는 심부 조율 주파수가 작동 중입니다. 미세 교정 및 균형 조정을 통해 삶의 품질을 우수하게 끌어올려 줍니다.\`;
                                  detailTxtEn = \`The inner adjustment functions actively to fine-tune your path and system stability.\`;
                                }
                              } else if (level === 'clash_half') {
                                pulseDescClass = "desc-glow-present";
                                containerClass = isLight 
                                  ? 'bg-orange-500/5 border-orange-400 text-orange-950 shadow-[0_3px_12px_rgba(249,115,22,0.15)]' 
                                  : 'bg-[#351909] border-orange-500/45 text-orange-200 shadow-[0_0_12px_rgba(249,115,22,0.2)]';
                                
                                if (isClash) {
                                  strengthBadgeTxt = lang === 'KO' ? '격충 마찰' : 'Separated Friction';
                                  detailTxtKo = \`한 기둥을 건너뛰어 성립한 격충(\${remoteBranchesStr}, \${actualName}) 또는 중간 수준의 마찰입니다. 끊임없는 직접 부딪침보다는 긴장감이 내포된 정밀 조정 능력으로 발현되며, 이로써 고유의 문제해결 능력, 전문 제어력, 엄밀한 리스크 관리를 고도화시킵니다.\`;
                                  detailTxtEn = \`Moderate friction operates through spanned pillars, building sharp situational awareness, systemic regulation, and exceptional crisis-resolution mastery.\`;
                                } else if (isHyeong) {
                                  strengthBadgeTxt = lang === 'KO' ? '형살 조율' : 'Moderate Punishment';
                                  detailTxtKo = \`일부 지지가 맞춰져 성립한 형살(\${remoteBranchesStr}, \${actualName})의 조율 주파수가 감지됩니다. 주변 환경이나 기성 규격의 문제점을 예리하게 포착해내어 가장 효율적이고 완벽한 상태로 교정, 편집, 개혁해내는 탁월한 솔루션 제공 인프라를 마련해 줍니다.\`;
                                  detailTxtEn = \`The partial force of Punishment is processed, offering sharp problem-solving skills, structural revisions, and precise design capability.\`;
                                } else if (isPa) {
                                  strengthBadgeTxt = lang === 'KO' ? '파살 조율' : 'Moderate Destruction';
                                  detailTxtKo = \`기 흘러가는 과정에 얽힌 파살(\${remoteBranchesStr}, \${actualName})의 보정 기능이 작동하고 있습니다. 타성적으로 유지되던 계약이나 시스템의 맹점을 찾아내 개선하며, 완고함을 탈피하여 끊임없는 자기 쇄신과 융통성 있는 대안을 제시하는 지혜를 심어줍니다.\`;
                                  detailTxtEn = \`Subtle destructions operate as a corrective mechanism, highlighting system loopholes to support smooth and proactive upgrades.\`;
                                } else if (isHae) {
                                  strengthBadgeTxt = lang === 'KO' ? '해살 조율' : 'Moderate Harm Adjust';
                                  detailTxtKo = \`영역 간의 경계를 짓는 해살(\${remoteBranchesStr}, \${actualName})의 정진력이 흐릅니다. 섣부른 감정 투자로 인한 심리적 소모를 사전에 지혜롭게 예방하고, 상대의 숨은 의도를 기민하게 간파함으로써 나를 지키는 냉철하며 합리적인 처세의 무기를 가집니다.\`;
                                  detailTxtEn = \`The protective alert of Harm is processed, enabling intuitive defense against unexpected personal drain or subtle relational conflicts.\`;
                                } else {
                                  strengthBadgeTxt = lang === 'KO' ? '중간 마찰 조율' : 'Moderate Friction';
                                  detailTxtKo = \`인접하지 않은 두 글자가 만나는 중간 수준의 보정 과정입니다. 삶의 다양한 가능성을 실현하기 위해 조심스럽게 영역을 점검하고 보정해 가는 안락한 힘을 마련해 줍니다.\`;
                                  detailTxtEn = \`Moderate distant friction operates as a stable calibration force across your life.\`;
                                }
                              } else { // clash_remote or general punish/pa/hae
                                pulseDescClass = "desc-glow-present";
                                containerClass = isLight 
                                  ? 'bg-[#291132] border-fuchsia-500/45 text-fuchsia-200 shadow-sm' 
                                  : 'bg-[#291132] border-fuchsia-500/45 text-fuchsia-200';
                                
                                if (isClash) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격충 조율' : 'Remote Clash';
                                  detailTxtKo = \`사주 원국 양 극단(\${remoteBranchesStr})에 위치하여 간접적으로 작용하는 원격충(\${actualName})입니다. 현실에서의 물리적인 갈등이나 급변함은 최소화되나, 내면에 예술적인 정밀함, 신중한 판단력, 그리고 시간의 흐름을 기다릴 줄 아는 성숙한 지혜의 자양분이 됩니다.\`;
                                  detailTxtEn = \`Quiet remote friction presents low physical clash but triggers deep self-reflection, artistic inspiration, and seasoned strategic prudence.\`;
                                } else if (isHyeong) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 형살' : 'Remote Punishment';
                                  detailTxtKo = \`멀리 떨어져서 작용하는 원격 형살(\${remoteBranchesStr}, \${actualName})입니다. 실생활의 직접 조율 마찰보다는 미학적/정신적 성찰, 그리고 점진적 조절 능력을 키워줍니다.\`;
                                  detailTxtEn = \`Remote punishment operates quietly at a distance, refining your inner discipline and strategic patience rather than causing active friction.\`;
                                } else if (isPa) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 파살' : 'Remote Destruction';
                                  detailTxtKo = \`보이지 않는 먼 거리에서 작용하는 원격 파살(\${remoteBranchesStr}, \${actualName})입니다. 은근한 틈새를 정돈하며 사소한 오점이나 사각지대를 수시로 조용하게 보완해 가는 힘을 줍니다.\`;
                                  detailTxtEn = \`Remote destruction works slowly in the background, offering subtle, precise corrective opportunities over time.\`;
                                } else if (isHae) {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 해살' : 'Remote Harm';
                                  detailTxtKo = \`원거리에서 조율하는 원격 해살(\${remoteBranchesStr}, \${actualName})입니다. 불필요한 감정 자극 없이 담백하고 이성적인 대인관계의 안정 거리를 유지하는 방어기제로 작동합니다.\`;
                                  detailTxtEn = \`Remote harm acts as a protective boundary, helping you maintain healthy, objective personal distances.\`;
                                } else {
                                  strengthBadgeTxt = lang === 'KO' ? '원격 마찰 조율' : 'Remote Friction';
                                  detailTxtKo = \`원거리 지지 간의 완만한 마찰 관계를 조화롭게 다듬습니다.\`;
                                  detailTxtEn = \`Gently calibrates the remote relational tension across the chart.\`;
                                }
                              }

                              // 특수 결합 보정 규칙 (사신합, 묘술합, 진유합 등)
                              const bStr = activeUserMatch.branches ? activeUserMatch.branches.join('') : '';
                              if (bStr) {
                                const hasFireStem = stems && (stems.includes('丙') || stems.includes('丁'));
                                const hasWaterStem = stems && (stems.includes('壬') || stems.includes('癸'));
                                const hasMetalStem = stems && (stems.includes('庚') || stems.includes('辛'));
                                
                                if ((bStr === '巳申' || bStr === '申巳') && activeUserMatch.type === '육합') {
                                  if (hasFireStem && !hasWaterStem) {
                                    const shinTenGod = getTenGodNameLocal('申', dayMaster, lang);
                                    detailTxtKo = \`사신합(\${remoteBranchesStr})은 고열의 기운(巳)과 정밀 금속(申)의 만남입니다. 천간에 화(火)가 강하게 내리쬐고 이의 폭주를 막을 수(수)가 결여되어, 합화(융합)의 긍정적 성취보다는 온전히 조율되지 못하고 형살(刑殺)의 역동이 거세게 드러납니다. 금(金) 기운이 다치기 쉬우니, 신금(申金)의 십성인 \${shinTenGod} 영역(건강, 재물, 대인관계 등)에서 무리한 제어나 충돌 사고를 주의해야 합니다.\`;
                                    detailTxtEn = \`Due to the lack of Water and strong Fire, the Si-Shen combination (\${remoteBranchesStrEn}) breaks and turns into a Punishment (Hyeong), potentially damaging the Metal element. Exercise caution in the areas represented by \${shinTenGod}.\`;
                                  } else {
                                    detailTxtKo = \`육합, 형, 파가 얽힌 사신(\${remoteBranchesStr})은 환경에 따라 수(수)나 금(金)으로 주도권이 변하며, 합(융합)과 형(갈등 및 재조립)을 오갑니다. 상황 변화에 따른 극적인 리모델링이나 패러다임 전환의 역동성을 지닙니다.\`;
                                    detailTxtEn = \`The Si-Shen relationship (\${remoteBranchesStrEn}) fluctuates between fusion and friction depending on the environment, creating dynamic cycles of breaking and remaking.\`;
                                  }
                                } else if ((bStr === '卯戌' || bStr === '戌卯') && activeUserMatch.type === '육합') {
                                  if (hasFireStem) {
                                    detailTxtKo = \`묘술합(\${remoteBranchesStr})은 천간에 화(火) 기운이 있어 불꽃으로 변하는 합화가 원활합니다. 예술적 열정이나 학문적 이상이 화려하게 만개하는 긍정적인 발현을 이룹니다.\`;
                                    detailTxtEn = \`The Mao-Xu combination (\${remoteBranchesStrEn}) smoothly transforms into Fire, igniting artistic passion and academic ideals.\`;
                                  } else {
                                    detailTxtKo = \`화(火) 기운이 다소 부족한 묘술합(\${remoteBranchesStr})으로, 완전한 융합보다는 목(木)과 토(土)의 은근한 견제와 속을 알 수 없는 미묘한 끌림이 지속되는 형태를 띱니다.\`;
                                    detailTxtEn = \`Without sufficient Fire stems, the Mao-Xu combination (\${remoteBranchesStrEn}) acts as a mysterious attraction rather than a full transformation, maintaining subtle friction.\`;
                                  }
                                } else if ((bStr === '辰酉' || bStr === '酉辰') && activeUserMatch.type === '육합') {
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
                                  <div className={\`p-3.5 rounded-xl border flex items-start gap-2.5 backdrop-blur-sm transition-all duration-300 \${containerClass} \${pulseDescClass}\`}>
                                    <span className="text-base mt-1 flex animate-bounce shrink-0 select-none">✨</span>
                                    <div className="flex-1 space-y-1">
                                      <div className="text-xs font-black flex flex-wrap items-center gap-1.5 uppercase tracking-wide">
                                        <span>
                                          {lang === 'KO' 
                                            ? '내 사주 원국에 실제 존재' 
                                            : 'Present in your BaZi Chart'}
                                        </span>
                                        <span className={\`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase \${matchStrength.badgeClass}\`}>
                                          {strengthBadgeTxt}
                                        </span>
                                      </div>
                                      <p className="text-[11px] leading-relaxed opacity-95">
                                        {lang === 'KO' ? <ParsedText text={detailTxtKo} lang={lang} /> : <ParsedText text={detailTxtEn} lang={lang} />}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}`;

const output = data.substring(0, fnsStartIdx) + replacement + data.substring(sliceEnd);

fs.writeFileSync(filePath, output, 'utf8');
console.log("Successfully replaced corrupted code block.");
fs.unlinkSync('replace.ts'); // clean up
