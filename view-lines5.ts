import * as fs from 'fs';
let txt = fs.readFileSync('src/services/cycle-vibe-service.ts', 'utf8');
const lines = txt.split('\n');
for(let i = 2000; i < 2150; i++) {
   console.log(i + ": " + lines[i]);
}
