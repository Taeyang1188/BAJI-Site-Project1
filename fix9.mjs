import fs from 'fs';

let rs = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');

rs = rs.replace(/resultText \+= \"\\\n\\\n/g, 'resultText += "\\n\\n');

fs.writeFileSync('src/services/relationship-dynamics-service.ts', rs, 'utf-8');
console.log('Done');
