const fs = require('fs');
const file = 'src/components/BaZiResultPage.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/\[#\$\{color\}/g, '[${color}');

fs.writeFileSync(file, code);
console.log('done fixing hash in BaZiResultPage.tsx');
