           let pastTenGod = prevDaewunDiff !== -1 ? tenGodsKo[prevDaewunDiff].split('(')[0] : "알 수 없는 기운";
           let currentTenGod = tenGodRoleKo.split('(')[0];

           if (pastTenGod === currentTenGod) {
               narrative += `[과거와의 연장선] 지난 대운부터 이어온 '${pastTenGod}'의 테마가 이제는 온전히 무르익어 절정에 달하고 있습니다. `;
               narrative += `당신의 명식 구조에 잠복해 있던 공기가 한층 짙어지며, '${currentTenGod}' 기운이 지배하게 됩니다.\n\n`;
           } else {
               narrative += `[과거와의 결별] 당신을 짓누르고 방황하게 했던 이전 패러다임이 끝나고, 이제는 국면이 완전히 뒤바뀌었습니다. `
               narrative += `당신의 안착부를 장악했던 불필요한 공기가 걷히고, 이제부터는 '${currentTenGod}' 기운이 주도권을 쥐게 됩니다.\n\n`;
           }

           const featuresStr = (result?.analysis?.balanceWarnings || []).map((w: any) => w.title).join(' ');
           let interpretation = "";

           const strScore = result?.analysis?.strength?.score || 50;
           let strengthStr = "";
           if (strScore >= 75) strengthStr = "극신강(가장 굳건하고 강건한 자아)";
           else if (strScore >= 60) strengthStr = "신강(확고하고 자립적인 자아)";
           else if (strScore >= 55) strengthStr = "중화신강(안정적이고 다소 능동적인 자아)";
           else if (strScore >= 45) strengthStr = "중화(유연하고 균형 잡힌 자아)";
           else if (strScore >= 40) strengthStr = "중화신약(부드럽지만 방어적인 자아)";
           else if (strScore >= 25) strengthStr = "신약(조심스럽고 수용성이 높은 자아)";
           else strengthStr = "극신약(외부의 흐름에 무의식적으로 순응하는 섬세한 자아)";

           if (featuresStr.includes("관살") || featuresStr.includes("관성")) {
               if (currentTenGod === '식상') {
                   interpretation = `내면의 관살(압박, 통제)이 당신을 옥죄던 상황에서, 마침내 그것을 쳐낼 예리한 무기(상관/식신)를 손에 쥐었습니다. 참는 자가 이기는 시대는 끝났습니다. 이제는 나의 목소리를 내어 현실의 유리천장을 깨고 주도권을 되찾는 역동의 시기입니다.`;
               } else if (currentTenGod === '재성') {
                   interpretation = `일만 하고 성과는 보이지 않던 시야가 트입니다. 그간 쌓아온 관살(책임)의 하중이 재성(현실적 결실)으로 치환되어 손에 잡히는 수확이 생깁니다. 단, 재성이 관성을 더욱 무겁게 할 수 있으니 무리한 확장보다 확실한 내실 다지기에 집중하세요.`;
               } else {
                   interpretation = `당신을 둘러싼 과도한 통제력(관살)에 또 다른 ${currentTenGod} 기운이 더해졌습니다. 무게중심이 옮겨가는 과도기입니다. 섣불리 틀을 부수려 하기보단 뿌리를 내리는 깊이 있는 통찰이 요구됩니다.`;
               }
           } else if (featuresStr.includes("재다") || featuresStr.includes("재성")) {
               if (currentTenGod === '비겁' || currentTenGod === '인성') {
                   interpretation = `흔들리던 현실의 기반을 단단히 붙잡아줄 든든한 방패를 얻었습니다. 헛돌던 에너지는 폭주를 멈추고 온전히 나의 자산으로 안착할 것입니다.`;
               } else {
                   interpretation = `끝없는 현실적 욕망과 갈증에 불을 지피는 ${currentTenGod} 기운이 지배하고 있습니다. 지금 당신이 쥐어야 할 것은 넓은 바다가 아니라 길을 잃지 않을 나침반입니다.`;
               }
           } else {
               interpretation = `현실적 엔진이 새롭게 가동됩니다. 타인과 세상에 섬세하게 반응하던 당신의 [${strengthStr}] 바탕 위에 ${currentTenGod} 기운이 전면으로 나서 삶의 축을 세워나갑니다. 과거의 불안을 뒤로하고 안정적으로 자기 확신을 채워나갈 중요한 전환점입니다. 서두르지 말고 자신의 원래 페이스를 되찾는 것에 집중하세요.`;
           }
} else {
    // THIS is the end of the block in my source script!
