import fs from 'fs';
const file = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf8');
const lines = file.split('\n');
console.log(lines.slice(150, 250).join('\n'));
