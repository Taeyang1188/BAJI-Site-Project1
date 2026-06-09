import fs from 'fs';

// 1. Rewrite generateIndividualTimelineBriefing in timeline-briefing-service.ts
let ts = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf-8');

const newFunc = `export function generateIndividualTimelineBriefing(
    result: any,
    currentDaewun: any,
    adjustedElements: any,
    lang: 'KO' | 'EN',
    isPast: boolean,
    isFuture: boolean
): string {
    const isKO = lang === 'KO';
    
    // 1. Base Structure Analysis
    const getTopElement = (adjusted: any) => {
        if (!adjusted) return 'Wood';
        const sorted = Object.entries(adjusted).sort((a, b: any) => (b[1] as number) - (a[1] as number));
        return sorted[0][0];
    };
    
    const topElRaw = getTopElement(adjustedElements);
    const topElName = topElRaw.split('(')[0].trim();
    
    // Find Ten God of this Top Element relative to Day Master
    const dayMaster = result?.pillars?.[2]?.stem || '甲';
    const STEM_ELEMENTS: any = { '甲':'Wood', '乙':'Wood', '丙':'Fire', '丁':'Fire', '戊':'Earth', '己':'Earth', '庚':'Metal', '辛':'Metal', '壬':'Water', '癸':'Water' };
    const dmElement = STEM_ELEMENTS[dayMaster] || 'Wood';

    const cycle = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dmIdx = cycle.indexOf(dmElement);
    const targetIdx = cycle.indexOf(topElName);
    const diff = (targetIdx - dmIdx + 5) % 5;
    
    const tenGodsKo = ['비겁(대등/수평)', '식상(표현/활동)', '재성(결과/현실)', '관성(책임/압박)', '인성(수용/성찰)'];
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
        // 격국 (Structure Aware) Interpretation
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
                 interpretation = \`흔들리던 현실의 기반을 단단히 붙잡아줄 든든한 \${tenGodRoleKo} 기운이 들어옵니다. 그토록 원했던 주도권과 안정감을 쟁취하게 될 것입니다.\`;
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

        narrative += \`당신(태양)의 명식에 \${tenGodRoleKo} 대운이 지배적으로 작용하고 있습니다.\\n\\n\`;
        narrative += \`[심리 역학] \${interpretation}\\n\`;
        
        if (!isPast) {
             narrative += \`[실전 지침] 주어진 상황에 무력하게 타협하지 마세요. 불필요한 마찰을 줄이고 부족한 기운을 의식적으로 끌어오며 운의 주도권을 장악해야 합니다.\`;
        }
        
    } else {
        narrative += \`During this phase, the \${tenGodRoleEn} energy assumes the leading role in your chart.\\n\\n\`;
        narrative += \`[Phase Flow] The dynamic shift highly influences your path. Evaluate where this energy pushes you, and balance the tension intentionally.\\n\`;
    }

    return narrative;
}`;

ts = ts.replace(/export function generateIndividualTimelineBriefing[\s\S]*?return narrative;\n}/, newFunc);
fs.writeFileSync('src/services/timeline-briefing-service.ts', ts, 'utf-8');
console.log("Updated timeline-briefing-service.ts");
