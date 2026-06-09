import fs from 'fs';

let content = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf8');

const oldCode = `        const applySynergy = (c1: string, c2: string) => {
            const uLower = uGeJuRaw.toLowerCase();
            const pLower = pGeJuRaw.toLowerCase();
            const uIsGwan = uLower.includes('정관') || uLower.includes('judge') || uLower.includes('direct officer');
            const uIsSik = uLower.includes('상관') || uLower.includes('rebel') || uLower.includes('hurting officer');
            const pIsGwan = pLower.includes('정관') || pLower.includes('judge') || pLower.includes('direct officer');
            const pIsSik = pLower.includes('상관') || pLower.includes('rebel') || pLower.includes('hurting officer');
            const hasGwanSikClash = (uIsGwan && pIsSik) || (uIsSik && pIsGwan);
            
            if (hasGwanSikClash) {
                return { badge: "상관견관(傷官見官) 리스크", desc: "⚠️ [가치관의 균열] 규율과 저항의 정면충돌입니다. 한 명의 원리원칙이 다른 한 명의 구속을 극도로 싫어하는 자유를 옥죄며 큰 파열음을 낼 수 있습니다.", penalty: 15 };
            }

            const combo = \`\${c1}-\${c2}\`;
            if (combo === 'Gwan-In' || combo === 'In-Gwan') return { badge: "관인상생(官印相生)", desc: "🛡️ [신뢰의 방파제] 세상의 막중한 책임감(관성)을 상대방의 깊은 수용력(인성)이 하나도 놓치지 않고 따뜻하게 껴안아 흡수해주는 단단한 결속의 파트너입니다.", bonus: 15 };
            if (combo === 'Gwan-Sik' || combo === 'Sik-Gwan') return { badge: "식신제살(食神制殺)", desc: "⚔️ [해결사 콤비] 한 명이 느끼는 견딜 수 없는 억압과 사면초가의 압박감을, 파트너의 기발한 창의성과 실천력(식상)이 완벽하게 돌파해줍니다.", bonus: 15 };
            if (combo === 'Sik-Jae' || combo === 'Jae-Sik') return { badge: "식상생재(食傷生財)", desc: "🤝 [이익 창출 콤비] 한 명의 넘치는 끼와 아이디어(식상)가 상대의 현실적이고 촘촘한 수익(재성)으로 확실하게 변환되는 효율적인 비즈니스 구조입니다.", bonus: 10 };
            if (combo === 'Sik-In' || combo === 'In-Sik') return { badge: "인성용식(印星用食)", desc: "🧠 [지혜의 조율자] 겉잡을 수 없이 뻗어가는 날것의 창의성이나 과도한 에너지(식상)를 파트너의 깊은 지혜(인성)로 정교하게 통제해내어 걸작을 만듭니다.", bonus: 5 };
            if (combo === 'Jae-Gwan' || combo === 'Gwan-Jae') return { badge: "재생관(財生官)", desc: "🤝 [제국의 건설자] 한 명의 현실 감각과 추진력(재성)이 상대방의 명예와 지위(관성)를 단단하게 세워주는 강력한 권력 결탁의 구조입니다.", bonus: 12 };
            if (combo === 'Bi-Jae' || combo === 'Jae-Bi') return { badge: "부하분담(負荷分擔)", desc: "🛡️ [짐을 나누는 동료] 한 명이 감당하기 힘든 벅찬 현실적 무대와 책임(재성)을, 파트너의 강력한 맷집(비겁)이 든든하게 받쳐줍니다.", bonus: 5 };
            if (combo === 'In-Bi' || combo === 'Bi-In') return { badge: "수기유행(秀氣流行)", desc: "💡 [세상 밖의 등대] 한 명의 깊은 사유와 지식(인성)을, 다른 한 명의 강력한 주체성과 실행력(비겁)이 세상 밖으로 속 시원히 꺼내어 형태 있는 것으로 조력합니다.", bonus: 5 };
            return null;
        };`;

const newCode = `        const applySynergy = (c1: string, c2: string) => {
            const uLower = uGeJuRaw.toLowerCase();
            const pLower = pGeJuRaw.toLowerCase();
            const uIsGwan = (uLower.includes('정관') || uLower.includes('judge') || uLower.includes('direct officer')) && c1 === 'Gwan';
            const uIsSik = (uLower.includes('상관') || uLower.includes('rebel') || uLower.includes('hurting officer')) && c1 === 'Sik';
            const pIsGwan = (pLower.includes('정관') || pLower.includes('judge') || pLower.includes('direct officer')) && c2 === 'Gwan';
            const pIsSik = (pLower.includes('상관') || pLower.includes('rebel') || pLower.includes('hurting officer')) && c2 === 'Sik';
            
            if (uIsGwan && pIsSik) return { badge: "상관견관(傷官見官) 리스크", desc: isKO ? "⚠️ [가치관의 균열] 당신의 원리원칙과 규율이 구속을 극도로 싫어하는 상대방의 자유를 옥죄며 큰 파열음을 낼 수 있습니다." : "⚠️ [Value Clash] Your strict principles may suffocate your partner's desire for extreme freedom, causing loud friction.", penalty: 15 };
            if (uIsSik && pIsGwan) return { badge: "상관견관(傷官見官) 리스크", desc: isKO ? "⚠️ [가치관의 균열] 상대방의 원리원칙과 규율이 구속을 극도로 싫어하는 당신의 자유를 옥죄며 큰 파열음을 낼 수 있습니다." : "⚠️ [Value Clash] Your partner's strict principles may suffocate your desire for extreme freedom, causing loud friction.", penalty: 15 };

            const combo = \`\${c1}-\${c2}\`;
            if (combo === 'Gwan-In') return { badge: "관인상생(官印相生)", desc: isKO ? "🛡️ [신뢰의 방파제] 세상의 막중한 책임감을 짊어진 당신(관성)을 상대방의 깊은 수용력(인성)이 하나도 놓치지 않고 따뜻하게 껴안아 흡수해줍니다." : "🛡️ [Breakwater of Trust] Your heavy responsibilities (Gwan) are warmly embraced and absorbed by your partner's deep acceptance (In).", bonus: 15 };
            if (combo === 'In-Gwan') return { badge: "관인상생(官印相生)", desc: isKO ? "🛡️ [신뢰의 방파제] 세상의 막중한 책임감을 짊어진 상대방(관성)을 당신의 깊은 수용력(인성)이 하나도 놓치지 않고 따뜻하게 껴안아 흡수해줍니다." : "🛡️ [Breakwater of Trust] Your partner's heavy responsibilities (Gwan) are warmly embraced and absorbed by your deep acceptance (In).", bonus: 15 };

            if (combo === 'Gwan-Sik') return { badge: "식신제살(食神制殺)", desc: isKO ? "⚔️ [해결사 콤비] 당신이 느끼는 억압과 사면초가의 압박감(편관)을, 파트너의 기발한 창의성과 실천력(식상)이 완벽하게 돌파해줍니다." : "⚔️ [Problem-Solver Duo] The extreme pressure and oppression you feel (Gwan) is thoroughly broken through by your partner's brilliant creativity and execution (Sik).", bonus: 15 };
            if (combo === 'Sik-Gwan') return { badge: "식신제살(食神制殺)", desc: isKO ? "⚔️ [해결사 콤비] 상대방이 느끼는 억압과 사면초가의 압박감(편관)을, 당신의 기발한 창의성과 실천력(식상)이 완벽하게 돌파해줍니다." : "⚔️ [Problem-Solver Duo] The extreme pressure and oppression your partner feels (Gwan) is thoroughly broken through by your brilliant creativity and execution (Sik).", bonus: 15 };

            if (combo === 'Sik-Jae') return { badge: "식상생재(食傷生財)", desc: isKO ? "🤝 [이익 창출 콤비] 당신의 넘치는 끼와 아이디어(식상)가 상대방의 현실적이고 촘촘한 기획(재성)을 만나 확실한 수익으로 변환됩니다." : "🤝 [Profit Duo] Your overflowing talent and ideas (Sik) meet your partner's realistic logic (Jae) to reliably transform into real profit.", bonus: 10 };
            if (combo === 'Jae-Sik') return { badge: "식상생재(食傷生財)", desc: isKO ? "🤝 [이익 창출 콤비] 상대방의 넘치는 끼와 아이디어(식상)가 당신의 현실적이고 촘촘한 기획(재성)을 만나 확실한 수익으로 변환됩니다." : "🤝 [Profit Duo] Your partner's overflowing talent and ideas (Sik) meet your realistic logic (Jae) to reliably transform into real profit.", bonus: 10 };

            if (combo === 'Sik-In') return { badge: "인성용식(印星用食)", desc: isKO ? "🧠 [지혜의 조율자] 겉잡을 수 없이 뻗어가는 당신의 날것의 창의성과 에너지(식상)를 파트너의 깊은 지혜(인성)로 정교하게 통제해내어 걸작을 만듭니다." : "🧠 [Coordinator of Wisdom] Your untamed creativity and energy (Sik) are meticulously refined by your partner's profound wisdom (In) to create a masterpiece.", bonus: 5 };
            if (combo === 'In-Sik') return { badge: "인성용식(印星用食)", desc: isKO ? "🧠 [지혜의 조율자] 겉잡을 수 없이 뻗어가는 상대방의 날것의 창의성과 에너지(식상)를 당신의 깊은 지혜(인성)로 정교하게 통제해내어 걸작을 만듭니다." : "🧠 [Coordinator of Wisdom] Your partner's untamed creativity and energy (Sik) are meticulously refined by your profound wisdom (In) to create a masterpiece.", bonus: 5 };
            
            if (combo === 'Jae-Gwan') return { badge: "재생관(財生官)", desc: isKO ? "🤝 [제국의 건설자] 당신의 현실 감각과 추진력(재성)이 상대방의 명예와 지위(관성)를 단단하게 세워주는 강력한 권력 결탁의 구조입니다." : "🤝 [Empire Builders] Your sharp reality and drive (Jae) solidly elevate your partner's honor and status (Gwan) in a powerful alliance.", bonus: 12 };
            if (combo === 'Gwan-Jae') return { badge: "재생관(財生官)", desc: isKO ? "🤝 [제국의 건설자] 상대방의 현실 감각과 추진력(재성)이 당신의 명예와 지위(관성)를 단단하게 세워주는 강력한 권력 결탁의 구조입니다." : "🤝 [Empire Builders] Your partner's sharp reality and drive (Jae) solidly elevate your honor and status (Gwan) in a powerful alliance.", bonus: 12 };

            if (combo === 'Bi-Jae') return { badge: "부하분담(負荷分擔)", desc: isKO ? "🛡️ [짐을 나누는 동료] 상대방이 감당하기 힘든 벅찬 현실적 무대와 금전적 짐(재성)을, 당신의 강력한 맷집과 자아(비겁)가 든든하게 함께 짊어지고 버텨냅니다." : "🛡️ [Burden Sharers] The overwhelming, heavy burdens of reality that your partner faces (Jae) are steadily supported and shared by your strong ego and grit (Bi).", bonus: 5 };
            if (combo === 'Jae-Bi') return { badge: "부하분담(負荷分擔)", desc: isKO ? "🛡️ [짐을 나누는 동료] 당신이 감당하기 힘든 벅찬 현실적 무대와 금전적 짐(재성)을, 상대방의 강력한 맷집과 자아(비겁)가 든든하게 함께 짊어지고 버텨냅니다." : "🛡️ [Burden Sharers] The overwhelming, heavy burdens of reality that you face (Jae) are steadily supported and shared by your partner's strong ego and grit (Bi).", bonus: 5 };

            if (combo === 'In-Bi') return { badge: "수기유행(秀氣流行)", desc: isKO ? "💡 [세상 밖의 등대] 당신의 깊은 사유와 지식(인성)을, 상대방의 강력한 주체성과 실행력(비겁)이 세상 밖으로 속 시원히 꺼내어 현실화하도록 조력합니다." : "💡 [Lighthouse to the World] Your profound thoughts and knowledge (In) are brilliantly brought out and actualized into the world by your partner's powerful drive and execution (Bi).", bonus: 5 };
            if (combo === 'Bi-In') return { badge: "수기유행(秀氣流行)", desc: isKO ? "💡 [세상 밖의 등대] 상대방의 깊은 사유와 지식(인성)을, 당신의 강력한 주체성과 실행력(비겁)이 세상 밖으로 속 시원히 꺼내어 현실화하도록 조력합니다." : "💡 [Lighthouse to the World] Your partner's profound thoughts and knowledge (In) are brilliantly brought out and actualized into the world by your powerful drive and execution (Bi).", bonus: 5 };
            return null;
        };`;

if (content.includes(oldCode)) {
    content = content.replace(oldCode, newCode);
    fs.writeFileSync('src/services/relationship-dynamics-service.ts', content);
    console.log("patched applySynergy successfully");
} else {
    console.error("failed to find oldCode in relationship-dynamics-service.ts");
}
