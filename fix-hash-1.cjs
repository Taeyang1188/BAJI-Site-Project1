const fs = require('fs');
const file = 'src/services/cycle-vibe-service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/return `\[#\$\{color\}:\$\{koName\}\(\$\{branch\}\)\]`;/g, 'return `[${color}:${koName}(${branch})]`;');

fs.writeFileSync(file, code);
console.log('done fixing hash');
