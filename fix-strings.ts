import * as fs from 'fs';
let txt = fs.readFileSync('src/services/cycle-vibe-service.ts', 'utf8');

// Replace newlines following single quotes that were broken
txt = txt.replace(/'\n\n\[경고\]/g, "'\\n\\n[경고]");
txt = txt.replace(/'\n\n\[Warning\]/g, "'\\n\\n[Warning]");

txt = txt.replace(/'\n\n\[주의\]/g, "'\\n\\n[주의]");
txt = txt.replace(/'\n\n\[Note\]/g, "'\\n\\n[Note]");

txt = txt.replace(/'\n\n마지막으로/g, "'\\n\\n마지막으로");
txt = txt.replace(/'\n\nLastly/g, "'\\n\\nLastly");

txt = txt.replace(/' : '\n\n/g, "' : '\\n\\n");

fs.writeFileSync('src/services/cycle-vibe-service.ts', txt, 'utf8');
console.log("Fixed broken string newlines!");
