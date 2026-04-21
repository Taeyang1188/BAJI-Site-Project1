import * as fs from 'fs';
const text = fs.readFileSync('src/services/cycle-vibe-service.ts', 'utf8');
const lines = text.split('\\n');
fs.writeFileSync('src/services/cycle-vibe-service.ts', lines.join('\n'), 'utf8');
console.log("Restored newlines, total lines: " + lines.length);
