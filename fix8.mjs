import fs from 'fs';

// 1. Add generateIndividualTimelineBriefing to timeline-briefing-service.ts
let tbs = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf-8');

const newFunction = `
export function generateIndividualTimelineBriefing(
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
    
    const koElements: any = { 'Wood': '목(木)', 'Fire': '화(火)', 'Earth': '토(土)', 'Metal': '금(金)', 'Water': '수(水)' };
    const koEl = koElements[topElName] || topElName;

    // 2. YongHee vs GiGu Check
    const getElementsArray = (detailObj: any) => detailObj?.element ? detailObj.element.split(',').map((s: string) => s.trim()) : [];
    const myYongHee = [...getElementsArray(result.analysis?.yongshinDetail?.primary), ...getElementsArray(result.analysis?.yongshinDetail?.heeShin)].filter(Boolean) as string[];
    const isYongHee = myYongHee.includes(topElName);

    let timePrefix = "";
    if (isKO) {
        timePrefix = isPast ? "[과거 대운 분석] " : (isFuture ? "[미래 대운 분석] " : "[현재 대운 분석] ");
    } else {
        timePrefix = isPast ? "[Past Cycle] " : (isFuture ? "[Future Cycle] " : "[Current Cycle] ");
    }

    let narrative = timePrefix + "\\n\\n";

    if (isKO) {
        narrative += \`이 시기에는 당신의 사주에서 \${koEl} 기운이 가장 주도권을 쥐게 됩니다. \`;
        if (isYongHee) {
            narrative += \`자신에게 부족했던 \${koEl} 기운이 크게 융성하는 매우 긍정적인 [발복(發福)] 구간입니다. 사막에서 오아시스를 만난 듯 억눌렸던 에너지가 해방되며, 스스로의 장점이 극대화됩니다.\\n\\n\`;
            narrative += \`[이점] 심리적으로 큰 여유와 자신감이 생깁니다. 장애물이 나타나도 쉽게 돌파할 수 있는 기지(機智)가 발휘되며 인간관계나 일적인 성과 면에서 주도권을 잡게 됩니다.\\n\`;
            narrative += \`[주의할 점] 모든 것이 뜻대로 풀리기 쉬워 자만심이 생길 수 있습니다. 좋은 기운일수록 주변을 살피고 결실을 베푸는 지혜가 필요합니다.\`;
        } else {
            narrative += \`자신에게 이미 넘치거나 다소 부담스러운 \${koEl} 기운이 가중되는 압박 구간이기도 합니다.\\n\\n\`;
            narrative += \`[이점] 불필요한 마찰을 줄이고, 삶의 방향성을 깊이 성찰하기에 가장 좋은 시기입니다. 궂은 날씨에 내실을 다지듯 전문성을 기르거나 명상에 집중하면 내면적으로 큰 발전을 이룹니다.\\n\`;
            narrative += \`[주의할 점] \${koEl} 오행의 쏠림으로 인해 감정적 기복이나 맹목적인 고집이 생기기 쉽습니다. 외부로 사업이나 활동을 크게 확장하기보다 현상 유지에 힘쓰고 자신만의 '안전 기지'를 확보하는 것이 좋습니다.\`;
        }
        
    } else {
        narrative += \`During this phase, \${koEl} energy assumes the dominant role in your chart. \`;
        if (isYongHee) {
            narrative += \`This is a highly positive phase where your much-needed \${koEl} flourishes. Like finding an oasis, suppressed energy is freed, maximizing your potential.\\n\\n\`;
            narrative += \`[Psychology/Benefit] You gain significant mental ease and confidence. Obstacles are easily overcome, and you take the lead in relationships and achievements.\\n\`;
            narrative += \`[Caution] It's easy to become overconfident as things go your way. Exercise wisdom by staying humble and sharing your success.\`;
        } else {
            narrative += \`This phase intensifies the already heavy \${koEl} energy, challenging your limits.\\n\\n\`;
            narrative += \`[Psychology/Benefit] This is an excellent time for deep introspection. Like staying indoors during a storm, focusing on internal growth and expertise brings great evolution.\\n\`;
            narrative += \`[Caution] Emotional fluctuations or stubbornness are likely due to elemental imbalance. Focus on maintenance rather than reckless expansion, and secure your 'safe haven' first.\`;
        }
    }

    return narrative;
}
`;

tbs += newFunction;
fs.writeFileSync('src/services/timeline-briefing-service.ts', tbs, 'utf-8');

// 2. Fix DestinyMapSection.tsx
let dm = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf-8');

const dmRegex = /if \(sliderIndex < currentIndex\) \{\n[\s\S]*?\} else if \(sliderIndex > currentIndex\) \{\n[\s\S]*?\} else \{\n[\s\S]*?\}/;
// Wait, the block is:
/*
  const dynamicOverview = useMemo(() => {
    if (sliderIndex < currentIndex) {
      if (lang === 'KO') {
        return `[과거 대운 분석]\n과거 이 시기의 네 에너지는...`;
      } else {
        return `...`;
      }
    } else if (sliderIndex > currentIndex) {
      if (lang === 'KO') {
...
      }
    }
    return parsedJson.overview;
  }, [sliderIndex, currentIndex, parsedJson.overview, lang]);
*/

const dmRegex2 = /if \(sliderIndex < currentIndex\) \{[\s\S]*?return parsedJson\.overview;/;

const newDmCode = `
      if (sliderIndex !== currentIndex) {
         const isPast = sliderIndex < currentIndex;
         const isFuture = sliderIndex > currentIndex;
         return generateIndividualTimelineBriefing(result, currentDaewun, adjustedElements, lang, isPast, isFuture);
      }
      return parsedJson.overview;`;

dm = dm.replace(dmRegex2, newDmCode);

// Add import
if (!dm.includes('generateIndividualTimelineBriefing')) {
    dm = dm.replace(
        "import { generateRelationshipDynamics } from '../services/timeline-briefing-service';",
        "import { generateRelationshipDynamics, generateIndividualTimelineBriefing } from '../services/timeline-briefing-service';"
    );
}

fs.writeFileSync('src/components/DestinyMapSection.tsx', dm, 'utf-8');
console.log('Fixed fix8.mjs successfully');
