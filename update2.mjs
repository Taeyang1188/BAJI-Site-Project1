import fs from 'fs';

let tsCode = fs.readFileSync('src/data/ilju-dataset.ts', 'utf8');

const newInterface = [
'export interface LocalizedString {',
'  ko: string;',
'  en: string;',
'}',
'',
'export interface IljuData {',
'  id: string;',
'  metadata: {',
'    kr_name: string;',
'    en_name: string;',
'    element: string;',
'    animal: string;',
'    nature_symbol: LocalizedString;',
'  };',
'  core_identity: {',
'    persona: LocalizedString;',
'    goth_punk_vibe: LocalizedString;',
'    shadow_side: LocalizedString;',
'  };',
'  behavior_metrics: {',
'    drive: number;',
'    empathy: number;',
'    stability: number;',
'    unpredictability: number;',
'  };',
'  compatibility_tags: {',
'    ideal_partner: string[];',
'    caution_partner: string[];',
'  };',
'  narrative_blocks: {',
'    default: LocalizedString;',
'    relationship: LocalizedString;',
'    timing_modifiers: {',
'      wood: LocalizedString;',
'      fire: LocalizedString;',
'      earth: LocalizedString;',
'      metal: LocalizedString;',
'      water: LocalizedString;',
'    };',
'  };',
'}',
''
].join('\\n');

const commentIdx = tsCode.indexOf('// Goth-Punk 스타일의');
if (commentIdx > -1) {
    tsCode = newInterface + tsCode.substring(commentIdx);
} else {
    console.log("Could not find Goth-Punk comment!");
}

const fieldsToWrap = [
  'nature_symbol:', 'persona:', 'goth_punk_vibe:', 'shadow_side:', 
  'default:', 'relationship:', 'wood:', 'fire:', 'earth:', 'metal:', 'water:'
];

const lines = tsCode.split('\\n');
for (let i=0; i<lines.length; i++) {
    for(const field of fieldsToWrap) {
        if (lines[i].indexOf(field) > -1) {
            let parts = lines[i].split(field);
            let val = parts[1].trim();
            if (val.endsWith(',')) {
                val = val.substring(0, val.length - 1);
                lines[i] = parts[0] + field + ' { ko: ' + val + ', en: "" },';
            } else {
                lines[i] = parts[0] + field + ' { ko: ' + val + ', en: "" }';
            }
        }
    }
}

tsCode = lines.join('\\n');
// We need to add en_name: "", after kr_name
// We'll avoid regex too
const krlines = tsCode.split('\\n');
for (let i=0; i<krlines.length; i++) {
    if (krlines[i].indexOf('kr_name:') > -1) {
        krlines[i] = krlines[i] + '\\n      en_name: "",';
    }
}
tsCode = krlines.join('\\n');

fs.writeFileSync('src/data/ilju-dataset.ts', tsCode, 'utf8');
console.log('Migration completed.');
