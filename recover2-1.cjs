const fs = require('fs');

const distFile = fs.readdirSync('dist/assets').find(f => f.startsWith('index-') && f.endsWith('.js'));
if (!distFile) {
    console.log("No index file found");
    process.exit(1);
}

const content = fs.readFileSync('dist/assets/' + distFile, 'utf8');
const searchStr = 'RD={';
const startIdx = content.indexOf(searchStr);

if (startIdx === -1) {
    console.log("RD not found");
    process.exit(1);
}

// Find the matching closing bracket for RD={...}
let openBrackets = 0;
let endIdx = -1;

for (let i = startIdx + Math.max(searchStr.length - 1, 0); i < content.length; i++) {
    if (content[i] === '{') openBrackets++;
    else if (content[i] === '}') {
        openBrackets--;
        if (openBrackets === 0) {
            endIdx = i;
            break;
        }
    }
}

if (endIdx === -1) {
    console.log("no matching end bracket");
    process.exit(1);
}

const rdStr = content.substring(startIdx + searchStr.length - 1, endIdx + 1);

// This rdStr is a JS object literal: "{癸卯:{id:"gye-myo",...},壬寅:{...}}"
// Because it came from Vite minifier, keys are NOT quoted unless necessary. But we can parse it using the Function constructor or eval.
let RD;
try {
   RD = (new Function("return " + rdStr))();
} catch(e) {
   console.log("Eval failed", e);
   process.exit(1);
}

// Now we have the object RD !
// Let's create the final TS output
const tsHeader = `export interface LocalizedString {
  ko: string;
  en: string;
}

export interface IljuData {
  id: string;
  metadata: {
    kr_name: string;
    en_name: string;
    element: string;
    animal: string;
    nature_symbol: LocalizedString;
  };
  core_identity: {
    persona: LocalizedString;
    goth_punk_vibe: LocalizedString;
    shadow_side: LocalizedString;
  };
  behavior_metrics: {
    drive: number;
    empathy: number;
    stability: number;
    unpredictability: number;
  };
  compatibility_tags: {
    ideal_partner: string[];
    caution_partner: string[];
  };
  narrative_blocks: {
    default: LocalizedString;
    relationship: LocalizedString;
    timing_modifiers?: {
      wood: LocalizedString;
      fire: LocalizedString;
      earth: LocalizedString;
      metal: LocalizedString;
      water: LocalizedString;
    };
    timing_modifier?: LocalizedString;
  };
}

// Goth-Punk 스타일의 60갑자 데이터베이스
// 10개씩 Phase별로 작성됨.
export const ILJU_DATASET: Record<string, IljuData> = {
`;

function escapeStr(s) {
    if (!s) return '""';
    return '"' + s.replace(/\\"/g, '\\\\"').replace(/\\n/g, '\\\\n') + '"';
}

function locStr(s) {
    return '{ ko: ' + escapeStr(s) + ', en: "" }';
}

let tsOutput = tsHeader;

for (const key of Object.keys(RD)) {
    const item = RD[key];
    tsOutput += "  '" + key + "': {\n";
    tsOutput += "    id: '" + item.id + "',\n";
    tsOutput += "    metadata: {\n";
    tsOutput += "      kr_name: '" + item.metadata.kr_name + "',\n";
    tsOutput += "      en_name: '',\n";
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
    tsOutput += "      ideal_partner: [" + item.compatibility_tags.ideal_partner.map(escapeStr).join(', ') + "],\n";
    tsOutput += "      caution_partner: [" + item.compatibility_tags.caution_partner.map(escapeStr).join(', ') + "]\n";
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

tsOutput += "};\n";

fs.writeFileSync('src/data/ilju-dataset.ts', tsOutput, 'utf8');
console.log('Recovery and migration completed!');
