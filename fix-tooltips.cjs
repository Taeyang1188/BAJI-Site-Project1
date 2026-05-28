const fs = require('fs');
const file = 'src/services/cycle-vibe-service.ts';
let code = fs.readFileSync(file, 'utf8');

const t1 = `[tooltip:Resentment/Ghost Gate|원진/귀문살. 예민함, 직관력, 집착, 원망 등을 의미합니다.|Wonjin/Gwimun. Indicates high sensitivity, intuition, obsession, or resentment.]`;
const t2 = `[tooltip:Ghost Gate|귀문관살. 뛰어난 직관력과 예술적 영감, 혹은 극심한 예민함을 의미합니다.|Gwimun. Indicates brilliant intuition, artistic inspiration, or extreme emotional sensitivity.]`;
const t3 = `[tooltip:Resentment|원진살. 이유 없는 갈등, 미움, 혹은 섬세한 감수성을 의미합니다.|Wonjin. Indicates unexplained friction, animosity, or delicate sensibility.]`;
const t4 = `[tooltip:Combination|육합. 다정하고 부드러운 화합과 결속을 의미합니다.|Liu He (Six Combination). Indicates a soft, affectionate bond and harmony.]`;
const t5 = `[tooltip:Punishment|형살. 조정, 수술, 법적 문제 혹은 완벽주의적 자기 검열을 의미합니다.|Hyeong (Punishment). Indicates adjustment, surgery, legal matters, or perfectionistic self-censorship.]`;
const t6 = `[tooltip:Clash|충살. 강한 충돌, 이동, 역동적인 변화와 발전을 의미합니다.|Clash. Indicates strong impact, movement, dynamic change, and breakthrough.]`;
const t7 = `[tooltip:Destruction/Harm|파/해. 내부적인 조정, 사소한 엇갈림, 숨겨진 흠집을 의미합니다.|Pa/Hae (Destruction/Harm). Indicates internal adjustments, minor misalignments, or hidden flaws.]`;

code = code.replace(/\(Resentment\/Ghost Gate\)/g, t1);
code = code.replace(/\(Ghost Gate\)/g, t2);
code = code.replace(/\(Resentment\)/g, t3);
code = code.replace(/\(Combination\)/g, t4);
code = code.replace(/\(Punishment\)/g, t5);
code = code.replace(/\(Clash\)/g, t6);
code = code.replace(/\(Destruction\/Harm\)/g, t7);

code = code.replace(
  /\\n💡 \*Hover over the interaction terms.*?more information\.\*\\n\\n/g,
  '\n'
);

fs.writeFileSync(file, code);
console.log('Done!');
