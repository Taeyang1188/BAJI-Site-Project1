const fs = require('fs');
const content = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf-8');
const searchString = content.substring(content.indexOf('    // [Parasite vs Symbiosis]'), content.indexOf('    if (maxProvidedToMe.isGongmang && isHighlyBeneficialToMe) {'));
const replaceString = `    // [Parasite vs Symbiosis]
    const isHighlyBeneficialToMe = myBenefitScore > 15;
    const isHarmfulToMe = myBenefitScore < -15;
    const isHighlyBeneficialToPartner = partnerBenefitScore > 15;
    const isHarmfulToPartner = partnerBenefitScore < -15;

    // Gap Logic
    const DRAIN_THRESHOLD = 20;
    const isParasiteToMe = (partnerBenefitScore - myBenefitScore) >= DRAIN_THRESHOLD; // I give to partner, partner gives me nothing
    const isParasiteToPartner = (myBenefitScore - partnerBenefitScore) >= DRAIN_THRESHOLD; // Partner gives to me, I give nothing
    
    if (isParasiteToMe) {
        text = lang === 'KO' ? 
            \`[일방적 헌신] 당신이 상대방에게 끝없이 베풀고 에너지를 소모하는 관계입니다. 당신의 헌신(\${myEnergyDesc})이 상대를 밝게 빛내주지만, 스스로 지치지 않도록 주의해야 합니다.\` : 
            \`[Unilateral Devotion] You endlessly provide your energy (\${myEnergyDescEng}) to your partner. Make sure you don't burn out while supporting them.\`;
        relation = 'draining';
    } else if (isParasiteToPartner) {
        text = lang === 'KO' ? 
            \`[운명적 보완] 상대방이 당신의 절대적인 부족함을 묵묵히 채워주는 맹목적인 관계입니다. 내겐 구원자와 같지만(\${pEnergyDesc}), 상대방은 에너지가 소진될 수 있으니 감사와 배려가 필수입니다.\` : 
            \`[Savior Relationship] Your partner unilaterally supplies exactly what you desperately need (\${pEnergyDescEng}). You must consciously appreciate their support so they don't burn out.\`;
        relation = 'synergy';
        isGlowing = true;
    } else if (isHighlyBeneficialToMe && isHighlyBeneficialToPartner) {
        text = lang === 'KO' ? 
            \`[완벽한 상생 궁합] 서로의 결핍을 폭발적으로 채워주는 진정한 소울메이트입니다. 나의 \${myProvidedKor} 기운과 상대의 \${partnerProvidedKor} 기운이 완벽하게 맞물려 에너지가 수직 상승합니다.\` : 
            \`[Perfect Symbiosis] A mutual soulmate connection. Your \${myProvidedKor} and their \${partnerProvidedKor} perfectly balance each other out, deeply revitalizing both of you.\`;
        relation = 'synergy';
        isGlowing = true;
    } else if (isHarmfulToMe && isHarmfulToPartner) {
        if (hasSpecialGeju) {
           let specialTarget = lang === 'KO' ? '두 사람의 특수한 기운(전왕격)' : 'both of your special chart structures';
           if (!isMeSpecial || !isPartnerSpecial) {
               specialTarget = isPartnerSpecial ? (lang === 'KO' ? '상대방의 특수한 기운' : 'your partner\\'s special chart structure') : (lang === 'KO' ? '당신의 특수한 기운' : 'your special chart structure');
           }
           text = lang === 'KO' ? 
              \`[태양을 삼킨 연합] 일반적인 눈으로는 '0점'의 위험한 관계처럼 보일 수 있지만, \${specialTarget}은 이 뜨거움을 오히려 성장의 동력으로 삼습니다.\\n\\n남들은 타 죽을까 봐 겁내는 뜨거운 열기를 두 사람은 서로 공유하며 세상을 녹여버립니다. 단, 두 사람의 고집이 합쳐지면 아무도 막을 수 없으니 '멈춰야 할 때' 만 미리 서로 합의해 두세요.\` : 
              \`[The Sun Swallowing Alliance] To normal eyes, this looks like a 0-point dangerous relationship. However, \${specialTarget} takes this intense heat and uses it as explosive fuel for growth.\\n\\nYou both share a burning intensity that others fear. Together, you can melt the world. Just be sure to agree on an 'emergency stop' word in advance, because once your combined stubbornness ignites, no one can stop you.\`;
           relation = 'synergy';
           isGlowing = true;
        } else {
            text = lang === 'KO' ? 
                \`[거울 인연] 서로가 너무 닮아서 부딪히는 고에너지 관계입니다. 나의 넘치는 에너지(\${myProvidedKor})와 상대의 기운(\${partnerProvidedKor})이 충돌하여 마찰이 생길 수 있습니다. 하지만 이 폭발적인 텐션을 '공동의 목표'나 '외부의 적'으로 돌린다면, 누구보다도 강력한 추진력을 내는 최강의 전우가 될 수 있습니다.\` : 
                \`[Mirror Effect] You are so similar that your strong energies clash. Your dominant energy (\${myProvidedKor}) and theirs (\${partnerProvidedKor}) create high tension. If you redirect this explosive tension toward a shared ambitious goal, you will become an unstoppable team.\`;
             relation = 'conflict';
        }
    } else {
        text = lang === 'KO' ?
            \`[무난한 균형] 일방적이거나 파괴적이지 않고 비교적 평온한 관계입니다. 서로 다른 성향을 존중하는 담백한 소통이 중요합니다.\` :
            \`[Stable Balance] A stable relationship without extreme emotional swings. Mutual respect for differences is key.\`;
        relation = 'neutral';
    }

`;
fs.writeFileSync('src/components/DestinyMapSection.tsx', content.replace(searchString, replaceString));
console.log("Done");
