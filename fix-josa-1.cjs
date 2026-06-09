const fs = require('fs');
const file = 'src/services/cycle-vibe-service.ts';
let code = fs.readFileSync(file, 'utf8');

// Replacements for the formTitleKO and the descKo sentences 
// Currently: `대운 ${formatB(int.natalBranch)}와 세운 ${formatB(int.cycleBranch)}`
// We replace '와 세운', '와 대운' with '와(과) 세운', '와(과) 대운'
code = code.replace(/}와 세운/g, '}와(과) 세운');
code = code.replace(/}와 대운/g, '}와(과) 대운');

// '가 만나' -> '이(가) 만나'
code = code.replace(/}가 만나/g, '}이(가) 만나');
// '가 부드럽게 결합' -> '이(가) 부드럽게 결합'
code = code.replace(/}가 부드럽게 결합/g, '}이(가) 부드럽게 결합');
// '가 강하게 충돌' -> '이(가) 강하게 충돌'
code = code.replace(/}가 강하게 충돌/g, '}이(가) 강하게 충돌');

fs.writeFileSync(file, code);
console.log('done josa');
