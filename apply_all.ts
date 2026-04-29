import fs from 'fs';
import { batch_all } from './batch_all';

let fileContent = fs.readFileSync('src/data/ilju-dataset.ts', 'utf8');

function escapeStr(s: string) {
    if (!s) return '';
    return s.replace(/\\"/g, '\\\\"').replace(/\\n/g, '\\\\n');
}

function apply() {
    for (const key of Object.keys(batch_all)) {
        const item = batch_all[key];
        const start = fileContent.indexOf(`  '${key}': {`);
        if (start === -1) {
            console.log("Missing key:", key);
            continue;
        }
        let end = fileContent.indexOf(`\n  '`, start + 10);
        if (end === -1) end = fileContent.indexOf(`\n};`, start + 10);
        
        let block = fileContent.substring(start, end);

        block = block.replace(/persona:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/, `persona: { ko: $1, en: "${item.persona}" }`);
        block = block.replace(/goth_punk_vibe:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/, `goth_punk_vibe: { ko: $1, en: "${item.vibe}" }`);
        block = block.replace(/shadow_side:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/, `shadow_side: { ko: $1, en: "${item.shadow}" }`);

        block = block.replace(/default:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/, `default: { ko: $1, en: "${item.def}" }`);
        block = block.replace(/relationship:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/, `relationship: { ko: $1, en: "${item.rel}" }`);

        block = block.replace(/wood:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/, `wood: { ko: $1, en: "${escapeStr(item.w)}" }`);
        block = block.replace(/fire:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/, `fire: { ko: $1, en: "${escapeStr(item.f)}" }`);
        block = block.replace(/earth:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/, `earth: { ko: $1, en: "${escapeStr(item.e)}" }`);
        block = block.replace(/metal:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/, `metal: { ko: $1, en: "${escapeStr(item.m)}" }`);
        block = block.replace(/water:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/, `water: { ko: $1, en: "${escapeStr(item.wa)}" }`);

        fileContent = fileContent.substring(0, start) + block + fileContent.substring(end);
    }
    fs.writeFileSync('src/data/ilju-dataset.ts', fileContent, 'utf8');
    console.log("Done");
}

apply();
