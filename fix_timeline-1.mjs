import fs from 'fs';

let ts = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf8');

const regex = /\} else \{[\s\S]*?intensity: 0\.75;\s*\}\s*\}/;

const replacement = `} else {
        const getElements = (detailObj: any) => detailObj?.element ? detailObj.element.split(',').map((s: string) => s.trim()) : [];
        const myYongHee = [...getElements(result.analysis?.yongshinDetail?.primary), ...getElements(result.analysis?.yongshinDetail?.heeShin)].filter(Boolean) as string[];
        
        let personaTitle = isKO ? "[나를 찾는 여정] 자존감의 회복" : "[Journey to Self]";
        let personaPsy = isKO ? "새로운 기운이 들어와 타인에게 의존하던 마음을 비우고 홀로 설 수 있는 자존감을 되찾습니다." : "You regain self-esteem and independence.";
        let personaInt = isKO ? "과거의 의존성에서 벗어나, 파트너와 대등하게 교감하는 진정한 '동반자'로 격상됩니다." : "You upgrade to a true partner.";
        
        if (myFutureElements.includes('Metal')) {
             personaTitle = isKO ? "[이성적 전지(剪枝)] 얽힌 덤불을 베어내는 결단" : "[Pruning] Decisive Cut";
             personaPsy = isKO ? "예리하고 서늘한 금(金)의 기운이 들어와 복잡했던 감정선이 이성적으로 정리됩니다." : "Sharp Metal energy brings rationality and clears emotions.";
             personaInt = isKO ? "방황하거나 감정에 휩쓸리는 상대방(파트너)의 곁에서, 당신이 냉정하고 이성적인 판단으로 끊어낼 것은 끊어주는 '해결사'의 역할을 맡게 됩니다." : "You act as a resolver, pruning away the partner's emotional wandering with cold rationality.";
        } else if (myFutureElements.includes('Fire')) {
             personaTitle = isKO ? "[온기 어린 공명] 얼어붙은 명식을 데우다" : "[Warm Resonance] Melting the Frozen Core";
             personaPsy = isKO ? "내면에서 타오르는 화(火)의 온기가 솟아올라 주변을 너그럽게 품을 수 있는 포용력이 차오릅니다." : "Warm Fire energy rises, bringing generous embrace.";
             personaInt = isKO ? "차가운 현실 속에서 얼어붙은 상대방(파트너)의 깊은 한기를 당신의 넉넉한 체온으로 데워줍니다. 서로의 상처를 치유하는 온기 어린 공명이 일어납니다." : "You melt the partner's frozen realistic struggles with your generous warmth, resonating deeply.";
        } else if (myFutureElements.includes('Earth')) {
             personaTitle = isKO ? "[제방(堤防) 역할] 흔들림 없는 방파제" : "[Breakwater] Unshaken Anchor";
             personaPsy = isKO ? "묵직하고 단단한 토(土)의 기운이 중심을 잡아주며 웬만한 일에는 흔들리지 않는 여유가 생깁니다." : "Sturdy Earth energy brings grounding and unshaken confidence.";
             personaInt = isKO ? "크고 작은 감정의 파도를 겪는 상대방(파트너)에게 당신은 결코 무너지지 않는 '방파제'가 되어줍니다. 당신의 묵직한 존재감이 관계의 안전핀 역할을 합니다." : "You become the unshaken breakwater for the partner's emotional waves, securing the relationship.";
        } else if (myFutureElements.includes('Water')) {
             personaTitle = isKO ? "[유연한 스며듦] 마찰을 줄이는 윤활유" : "[Flexible Integration] Smoothing Friction";
             personaPsy = isKO ? "모든 것을 수용하는 수(水)의 지혜가 발현되어, 고집을 꺾고 상황의 흐름에 유연하게 대처하게 됩니다." : "Water's wisdom brings flexibility and acceptance.";
             personaInt = isKO ? "강경하게 부딪히던 파트너와의 관계에서 굳이 이기려 하지 않고 물처럼 유연하게 스며듭니다. 당신이 관계의 마찰을 줄여주는 '윤활유'가 됩니다." : "You flow like water, acting as a lubricant to reduce friction and gently embracing the partner.";
        } else if (myFutureElements.includes('Wood')) {
             personaTitle = isKO ? "[적극적 소생] 정체된 관계를 깨우는 새싹" : "[Active Revival] Awakening Stagnation";
             personaPsy = isKO ? "위로 뻗으려는 목(木)의 생명력이 발동하여 관계나 상황에서 주도권을 잡고 앞으로 나아가려 합니다." : "Wood's vitality brings proactive energy and leadership.";
             personaInt = isKO ? "정체되어 있거나 현실에 안주하려는 상대방(파트너)을 깨워, 당신이 먼저 리드하고 새로운 목표를 향해 함께 뛰도록 자극합니다." : "You awaken the stagnant partner, proactively leading and inspiring mutual growth.";
        }

        narrative.title = personaTitle;
        narrative.psychology = personaPsy;
        narrative.interaction = personaInt;
        narrative.intensity = 0.75;
    }`;

ts = ts.replace(regex, replacement);

fs.writeFileSync('src/services/timeline-briefing-service.ts', ts, 'utf8');
console.log('Fixed overlapping fallbacks for future/past in Relationship Dynamics');
