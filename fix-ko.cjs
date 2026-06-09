const fs = require('fs');
const file = 'src/services/cycle-vibe-service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/if \(koName\.length > 1\) koName = koName\.substring\(0, 1\);/g, '');

fs.writeFileSync(file, code);
console.log('done fixing koName');
