const fs = require('fs');
let code = fs.readFileSync('src/components/BaZiResultPage.tsx', 'utf-8');
code = code.replace(/\$\{dominant\.name\}/g, '${dominant?.name || "균형잡힌"}');
fs.writeFileSync('src/components/BaZiResultPage.tsx', code);
