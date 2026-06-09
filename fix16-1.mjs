import fs from 'fs';

let dm = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf-8');
dm = dm.replace(
    /if \(sliderIndex !== currentIndex\) \{\n\s*const isPast = sliderIndex < currentIndex;\n\s*const isFuture = sliderIndex > currentIndex;\n\s*return generateIndividualTimelineBriefing\(result, currentDaewun, adjustedElements, lang, isPast, isFuture\);\n\s*\}\n\s*return parsedJson\.overview;/,
    `const isPast = sliderIndex < currentIndex;
      const isFuture = sliderIndex > currentIndex;
      return generateIndividualTimelineBriefing(result, currentDaewun, adjustedElements, lang, isPast, isFuture, sliderIndex);`
);

fs.writeFileSync('src/components/DestinyMapSection.tsx', dm, 'utf-8');

// Now update timeline-briefing-service.ts
let ts = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf-8');
const tsRegex = /export function generateIndividualTimelineBriefing\([\s\S]*?return narrative;\n}/;

const newTs = `export function generateIndividualTimelineBriefing(
    result: any,
    currentDaewun: any,
    adjustedElements: any,
    lang: 'KO' | 'EN',
    isPast: boolean,
    isFuture: boolean,
    sliderIndex?: number
): string {
    const isKO = lang === 'KO';
    
    // Base Structure
    const getTopElement = (adjusted: any) => {
        if (!adjusted) return 'Wood';
        const sorted = Object.entries(adjusted).sort((a, b: any) => (b[1] as number) - (a[1] as number));
        return sorted[0][0];
    };
    const topElRaw = getTopElement(adjustedElements);
    const topElName = topElRaw.split('(')[0].trim();
    
    const dayMaster = result?.pillars?.[2]?.stem || '甲';
    const STEM_ELEMENTS: any = { '甲':'Wood', '乙':'Wood', '丙':'Fire', '丁':'Fire', '戊':'Earth', '己':'Earth', '庚':'Metal', '辛':'Metal', '壬':'Water', '癸':'Water' };
    const dmElement = STEM_ELEMENTS[dayMaster] || 'Wood';

    const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIdx = cycle.indexOf(dmElement);
    const targetIdx = cycle.indexOf(topElName);
    const diff = (targetIdx - dmIdx + 5) % 5;
    
    const tenGodsKo = ['비겁(견고/투쟁)', '식상(표현/결과)', '재성(실리/소유)', '관성(압박/명예)', '인성(수용/정지)'];
    const tenGodsEn = ['Companion', 'Expression', 'Wealth', 'Power', 'Resource'];
    
    const tenGodRoleKo = tenGodsKo[diff];
    const tenGodRoleEn = tenGodsEn[diff];

    const isStrong = result?.analysis?.shinGangShinYak?.isStrong;
    
    let timePrefix = "";
    if (isKO) {
        timePrefix = isPast ? "[과거 대운] " : (isFuture ? "[미래 대운] " : "[현재 대운: 운명의 중심점] ");
    } else {
        timePrefix = isPast ? "[Past Phase] " : (isFuture ? "[Future Phase] " : "[Current Phase: Center of Destiny] ");
    }

    let narrative = timePrefix + "\\n\\n";

    if (isKO) {
        if (!isPast && !isFuture) {
           // CURRENT DAEWUN LOGIC (Compare with Previous)
           let prevDaewunStr = "";
           let prevDaewunDiff = -1;
           if (sliderIndex !== undefined && sliderIndex > 0) {
               const prevDaewun = result.grandCycles[sliderIndex - 1];
               const prevBranch = prevDaewun.branch;
               const BRANCH_ELEMENTS: any = { '子':'Water','丑':'Earth','寅':'Wood','卯':'Wood','辰':'Earth','巳':'Fire','午':'Fire','未':'Earth','申':'Metal','酉':'Metal','戌':'Earth','亥':'Water' };
               const prevEl = BRANCH_ELEMENTS[prevBranch] || 'Wood';
               const prevIdx = cycle.indexOf(prevEl);
               prevDaewunDiff = (prevIdx - dmIdx + 5) % 5;
           }

           let pastTenGod = prevDaewunDiff !== -1 ? tenGodsKo[prevDaewunDiff].split('(')[0] : "알 수 없는 기운";
           let currentTenGod = tenGodRoleKo.split('(')[0];

           narrative += \`[과거와의 결별] 지난 대운이 당신을 짓누르고 테스트하는 '\${pastTenGod}'의 시간이었다면, 이제는 판도가 완전히 뒤바뀌었습니다. \`
           narrative += \`당신의 명식 구조 안착부(지지)를 장악했던 무거운 공기가 걷히고, 이제는 '\${currentTenGod}' 기운이 온몸의 감각을 지배하게 됩니다.\\n\\n\`;

           const featuresStr = (result?.analysis?.balanceWarnings || []).map((w: any) => w.title).join(' ');
           let interpretation = "";

           if (featuresStr.includes("관살") || featuresStr.includes("관성")) {
               if (currentTenGod === '식상') {
                   interpretation = \`내면의 관살(압박, 통제)이 당신을 옥죄던 상황에서, 마침내 그것을 쳐낼 예리한 무기(상관/식신)를 손에 쥐었습니다. 참는 자가 이기는 시대는 끝났습니다. 이제는 나의 목소리를 내어 현실의 유리천장을 깨고 주도권을 되찾는 역동의 시기입니다.\`;
               } else if (currentTenGod === '재성') {
                   interpretation = \`일만 하고 성과는 보이지 않던 시야가 트입니다. 그간 쌓아온 관살(책임)의 하중이 재성(현실적 결실)으로 치환되어 손에 잡히는 수확이 생깁니다. 단, 재성이 관성을 더욱 무겁게 할 수 있으니 무리한 확장보다 확실한 내실 다지기에 집중하세요.\`;
               } else {
                   interpretation = \`당신을 둘러싼 과도한 통제력(관살)에 또 다른 \${currentTenGod} 기운이 더해졌습니다. 무게중심이 옮겨가는 과도기입니다. 섣불리 틀을 부수려 하기보단 뿌리를 내리는 깊이 있는 통찰이 요구됩니다.\`;
               }
           } else if (featuresStr.includes("재다") || featuresStr.includes("재성")) {
               if (currentTenGod === '비겁' || currentTenGod === '인성') {
                   interpretation = \`흔들리던 현실의 기반을 단단히 붙잡아줄 든든한 방패를 얻었습니다. 헛돌던 에너지는 폭주를 멈추고 온전히 나의 자산으로 안착할 것입니다.\`;
               } else {
                   interpretation = \`끝없는 현실적 욕망과 갈증에 불을 지피는 \${currentTenGod} 기운이 지배하고 있습니다. 지금 당신이 쥐어야 할 것은 넓은 바다가 아니라 길을 잃지 않을 나침반입니다.\`;
               }
           } else {
               interpretation = \`당신의 사주 구조 내에서 \${currentTenGod} 기운이 전면으로 나서며 삶의 엔진을 강하게 회전시키고 있습니다. 머물렀던 과거와 작별하고 온전한 자기 확신으로 나아가야 할 때입니다.\`;
           }

           narrative += \`[현재의 역동] \${interpretation}\\n\\n\`;
           
           // Calculate Temp/Heat to give [실전 개운법]
           const calculateHeat = (ratios: any) => {
               if (!ratios) return 0;
               let heat = 0;
               Object.entries(ratios).forEach(([k, v]) => {
                   const el = typeof k === 'string' ? k.split('(')[0].trim() : 'Wood';
                   const val = v as number;
                   if (el === 'Fire') heat += val * 1.5;
                   else if (el === 'Wood') heat += val * 0.5;
                   else if (el === 'Water') heat -= val * 1.5;
                   else if (el === 'Metal') heat -= val * 0.5;
               });
               return heat; 
           };
           let temp = 36.5 + (calculateHeat(adjustedElements) * 0.2);
           temp = Math.max(0, Math.min(100, temp));
           
           let actionGuide = "";
           if (temp > 65) actionGuide = "현재 사주의 온도가 치솟고 있습니다. 과열된 감정이나 급진적인 무리수보다, 스스로 열기를 식힐 수 있는 서늘하고 이성적인 판단이 가장 훌륭한 개운액션입니다.";
           else if (temp < 15) actionGuide = "온도가 크게 낮아져 냉기가 돌고 있습니다. 지금 당장 성과를 재촉하기보다는, 마음을 데우고 인간적인 유대와 열정을 서서히 끌어올리며 내실을 쌓아야 합니다.";
           else actionGuide = "현재 에너지가 최상의 온도 밸런스를 향해 움직이고 있습니다. 치우침 없는 현재의 페이스를 마음껏 누리며, 두려움 없이 액셀러레이터를 밟아도 좋습니다.";

           narrative += \`[실전 개운법] \${actionGuide}\`;

        } else {
            // PAST OR FUTURE LOGIC
            let interpretation = "";
            const featuresStr = (result?.analysis?.balanceWarnings || []).map((w: any) => w.title).join(' ');
            
            if (featuresStr.includes("관살") || featuresStr.includes("관성")) {
                if (diff === 3 || diff === 2) { 
                    interpretation = \`자신을 억누르던 외부의 통제력과 책임감(\${tenGodRoleKo})이 최고조에 달합니다. 사회적 압박이 심화되는 만큼 독립적인 숨통을 트는 것이 최우선입니다.\`;
                } else if (diff === 0 || diff === 1) {
                    interpretation = \`무거운 압박감을 벗어던지고 온전한 나의 목소리(\${tenGodRoleKo})를 내며 해방되는 시기입니다. 억눌림에서 벗어나 당신만의 강한 궤도를 개척합니다.\`;
                } else {
                    interpretation = \`오행의 변화가 \${tenGodRoleKo}으로 작용하며, 삶의 무게를 수용하고 내면을 단단히 다지게 됩니다.\`;
                }
            } else if (featuresStr.includes("재다") || featuresStr.includes("재성")) {
                 if (diff === 0 || diff === 4) {
                     interpretation = \`흔들리던 현실의 기반을 단단히 붙잡아줄 든든한 \${tenGodRoleKo} 기운이 들어옵니다. 그토록 원했던 주도권을 쟁취하게 될 것입니다.\`;
                 } else {
                     interpretation = \`물질적, 현실적 결과(\${tenGodRoleKo})에 대한 갈망이 커집니다. 과도한 확장을 경계하고 실속을 차리는 전략이 필요합니다.\`;
                 }
            } else {
                 if (isStrong) {
                     if (diff === 1 || diff === 2 || diff === 3) {
                         interpretation = \`넘치는 에너지를 사회적으로 배출하고 결실을 맺는 \${tenGodRoleKo} 기운이 강력하게 작용하여, 마침내 잠재력을 터뜨리는 시기입니다.\`;
                     } else {
                         interpretation = \`이미 강한 자아에 \${tenGodRoleKo} 에너지가 더해져 강한 주도권을 쥐지만, 독단에 빠지지 않도록 유연함을 의식해야 합니다.\`;
                     }
                 } else {
                     if (diff === 0 || diff === 4) {
                         interpretation = \`부족했던 자신감을 굳건히 세워주는 \${tenGodRoleKo} 기운이 들어와 세상의 풍파에 맞설 수 있는 강력한 무기가 생깁니다.\`;
                     } else {
                         interpretation = \`현실적인 목표와 책임감(\${tenGodRoleKo})이 무겁게 다가오는 압박 구간입니다. 거친 파도를 타며 버티는 내성을 길러야 합니다.\`;
                     }
                 }
            }

            narrative += \`당신의 명식에 \${tenGodRoleKo} 대운이 지배적으로 작용하고 있습니다.\\n\\n\`;
            narrative += \`[심리 역학] \${interpretation}\\n\`;
            
            if (!isPast) {
                 narrative += \`[실전 지침] 주어진 상황에 무력하게 타협하지 마세요. 불필요한 마찰을 줄이고 운의 주도권을 장악해야 합니다.\`;
            }
        }
    } else {
        narrative += \`During this phase, the \${tenGodRoleEn} energy assumes the leading role in your chart.\\n\\n\`;
        if (!isPast && !isFuture) {
             narrative += \`[Phase Shift] Moving from the previous cycle, the shift heavily impacts your structural balance.\\n\\n\`;
        }
        narrative += \`[Phase Flow] The dynamic shift highly influences your path. Evaluate where this energy pushes you, and balance the tension intentionally.\\n\`;
    }

    return narrative;
}`;

ts = ts.replace(tsRegex, newTs);
fs.writeFileSync('src/services/timeline-briefing-service.ts', ts, 'utf-8');
