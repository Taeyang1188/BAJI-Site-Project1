const fs = require('fs');
const content = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf8');

const regex = /\/\/ 2\. Geum-Da-Su-Tak \(金多水濁\) & Geum-Da-Su-Che[\s\S]*?gatePenalty \+= 22;\n    \}/;

const newStr = `    const overrideGlobalSyndrome = (elKO: string, elEN: string, newNameKO: string, newNameEN: string, newDescKO: string, newDescEN: string, patternPenalty: number) => {
        const keywords = [elKO, elEN];
        const existingIdx = gates.findIndex(g => 
            (g.name.includes('과부하') || g.name.includes('Overload') || g.name.includes('Black Hole') || g.name.includes('폭주')) 
            && keywords.some(k => g.name.includes(k))
        );
        
        if (existingIdx !== -1) {
            gates[existingIdx] = { name: isKO ? newNameKO : newNameEN, desc: isKO ? newDescKO : newDescEN };
            gatePenalty += 5; // Add a small extra penalty on top of the base mass penalty
        } else {
            gates.push({ name: isKO ? newNameKO : newNameEN, desc: isKO ? newDescKO : newDescEN });
            gatePenalty += patternPenalty;
        }
    };

    // 2. Geum-Da-Su-Tak (金多水濁) & Geum-Da-Su-Che
    if ((uDayStem === '壬' || uDayStem === '癸') && pMetalCount >= 3) {
        overrideGlobalSyndrome('금', 'Metal', 
            "🧪 [금다수탁(金多水濁)] 탁해진 심연", "🧪 [Geum-Da-Su-Tak]",
            "맑아야 할 당신의 샘물에 거대한 바위(금)들이 쏟아져 들어왔습니다. 이는 생(生)이 아니라 압살입니다. 상대의 과도한 보호와 통제가 당신의 자아를 진흙탕으로 만들고 있습니다.",
            "Massive rocks (Metal) poured into your clear water. This isn't support; it's smothering. Their excessive control turns your ego into mud.",
            25
        );
    }
    if ((pDayStem === '壬' || pDayStem === '癸') && uMetalCount >= 3) {
        overrideGlobalSyndrome('금', 'Metal',
            "🧪 [금다수탁(金多水濁)] 의도치 않은 압박", "🧪 [Geum-Da-Su-Tak (Reverse)]",
            "당신의 과도한 금(Metal) 기운이 상대의 맑은 물을 탁하게 만들고 있을 수 있습니다. 사랑이라는 이름의 통제가 상대를 질식시키고 있지는 않은지 돌아봐야 합니다.",
            "Your excessive Metal energy might be muddying their clear water. Check if your 'loving control' is suffocating them.",
            15
        );
    }

    // 3.1 Mok-Da-Hwa-Sik (木多火熄)
    if ((uDayStem === '丙' || uDayStem === '丁') && pWoodCount >= 3) {
        overrideGlobalSyndrome('목', 'Wood',
            "🕯️ [목다화식(木多火熄)] 꺼져가는 불꽃", "🕯️ [Mok-Da-Hwa-Sik]",
            "상대의 지나친 간섭과 지원이 오히려 당신의 재능(불꽃)을 질식시키고 있습니다. 타오르고 싶어도 숨 쉴 틈이 없습니다.",
            "Their excessive interference suffocates your talent. You want to burn bright, but there's no room to breathe.",
            20
        );
    }

    // 3.2 To-Da-Mae-Geum (土多埋金)
    if ((uDayStem === '庚' || uDayStem === '辛') && pEarthCount >= 3) {
        overrideGlobalSyndrome('토', 'Earth',
            "💎 [토다매금(土多埋金)] 묻혀버린 보석", "💎 [To-Da-Mae-Geum]",
            "상대의 보수적이고 답답한 기운이 당신의 날카로운 천재성을 흙 속에 묻어버렸습니다. 세상에 드러날 기회를 잃어가는 중입니다.",
            "Their conservative and heavy energy buries your sharp brilliance in the soil. You're losing chances to shine.",
            15
        );
    }

    // 3.3 Su-Da-Mok-Pyo (水多木漂)
    if ((uDayStem === '甲' || uDayStem === '乙') && pWaterCount >= 3) {
        overrideGlobalSyndrome('수', 'Water',
            "🌊 [수다목표(水多木漂)] 뿌리 뽑힌 부표", "🌊 [Su-Da-Mok-Pyo]",
            "과도한 감정과 수용력이 당신의 현실적 기반(뿌리)을 앗아갔습니다. 정착하지 못하고 상대의 감정에 휘말려 표류하는 관계입니다.",
            "Excessive emotions and receptivity took away your grounded roots. You are drifting in their emotional currents without settling.",
            18
        );
    }

    // 3.4 Hwa-Da-To-Cho (火多土焦)
    if ((uDayStem === '戊' || uDayStem === '己') && pFireCount >= 3) {
        overrideGlobalSyndrome('화', 'Fire',
            "🔥 [화다토초(火多土焦)] 갈라진 불모지", "🔥 [Hwa-Da-To-Cho]",
            "상대의 폭발적인 열정이 당신의 인내심을 하얗게 태워버렸습니다. 아무것도 자랄 수 없는 메마른 관계, 갈증만이 남았습니다.",
            "Their explosive passion scorched your patience. A barren relationship where nothing can grow, leaving only thirst.",
            22
        );
    }`;

if (regex.test(content)) {
    fs.writeFileSync('src/services/relationship-dynamics-service.ts', content.replace(regex, newStr));
    console.log("SUCCESS");
} else {
    console.log("FAILED TO MATCH");
}
