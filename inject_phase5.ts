import fs from 'fs';
import { phase5Data } from './add_phase5';

let fileContent = fs.readFileSync('src/data/ilju-dataset.ts', 'utf8');
const searchTarget = '};\n';
const idx = fileContent.lastIndexOf(searchTarget);

if (idx === -1) {
    console.log("Could not find the end of ILJU_DATASET");
    process.exit(1);
}

function escapeStr(s: string) {
    if (!s) return '""';
    return '"' + s.replace(/\\"/g, '\\\\"').replace(/\\n/g, '\\\\n') + '"';
}

function locStr(ls: {ko: string, en: string}) {
    return '{ ko: ' + escapeStr(ls.ko) + ', en: ' + escapeStr(ls.en) + ' }';
}

let tsOutput = '';

for (const key of Object.keys(phase5Data)) {
    const item = phase5Data[key];
    tsOutput += "  '" + key + "': {\n";
    tsOutput += "    id: '" + item.id + "',\n";
    tsOutput += "    metadata: {\n";
    tsOutput += "      kr_name: '" + item.metadata.kr_name + "',\n";
    tsOutput += "      en_name: '" + item.metadata.en_name + "',\n";
    tsOutput += "      element: '" + item.metadata.element + "',\n";
    tsOutput += "      animal: '" + item.metadata.animal + "',\n";
    tsOutput += "      nature_symbol: " + locStr(item.metadata.nature_symbol) + "\n";
    tsOutput += "    },\n";

    tsOutput += "    core_identity: {\n";
    tsOutput += "      persona: " + locStr(item.core_identity.persona) + ",\n";
    tsOutput += "      goth_punk_vibe: " + locStr(item.core_identity.goth_punk_vibe) + ",\n";
    tsOutput += "      shadow_side: " + locStr(item.core_identity.shadow_side) + "\n";
    tsOutput += "    },\n";

    tsOutput += "    behavior_metrics: { drive: " + item.behavior_metrics.drive + ", empathy: " + item.behavior_metrics.empathy + ", stability: " + item.behavior_metrics.stability + ", unpredictability: " + item.behavior_metrics.unpredictability + " },\n";
    
    tsOutput += "    compatibility_tags: {\n";
    tsOutput += "      ideal_partner: [" + item.compatibility_tags.ideal_partner.map((x) => escapeStr(x)).join(', ') + "],\n";
    tsOutput += "      caution_partner: [" + item.compatibility_tags.caution_partner.map((x) => escapeStr(x)).join(', ') + "]\n";
    tsOutput += "    },\n";

    tsOutput += "    narrative_blocks: {\n";
    tsOutput += "      default: " + locStr(item.narrative_blocks.default) + ",\n";
    tsOutput += "      relationship: " + locStr(item.narrative_blocks.relationship);
    
    if (item.narrative_blocks.timing_modifiers) {
        tsOutput += ",\n      timing_modifiers: {\n";
        const tm = item.narrative_blocks.timing_modifiers;
        tsOutput += "        wood: " + locStr(tm.wood) + ",\n";
        tsOutput += "        fire: " + locStr(tm.fire) + ",\n";
        tsOutput += "        earth: " + locStr(tm.earth) + ",\n";
        tsOutput += "        metal: " + locStr(tm.metal) + ",\n";
        tsOutput += "        water: " + locStr(tm.water) + "\n";
        tsOutput += "      }\n";
    } else if (item.narrative_blocks.timing_modifier) {
        tsOutput += ",\n      timing_modifier: " + locStr(item.narrative_blocks.timing_modifier) + "\n";
    } else {
        tsOutput += "\n";
    }
    tsOutput += "    }\n";
    tsOutput += "  },\n";
}

fileContent = fileContent.substring(0, idx) + tsOutput + fileContent.substring(idx);

fs.writeFileSync('src/data/ilju-dataset.ts', fileContent, 'utf8');
console.log('Phase 5 injected');
