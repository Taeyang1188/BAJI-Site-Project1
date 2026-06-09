const fs = require('fs');
const file = 'src/services/cycle-vibe-service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/Liu He \(Six Combination\)/g, 'Yuk-hap (Six Combination)');

fs.writeFileSync(file, code);
console.log('Done!');
