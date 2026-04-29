const fs = require('fs');

let tsCode = fs.readFileSync('src/data/ilju-dataset.ts', 'utf8');

const newInterface = "export interface LocalizedString {\\n  ko: string;\\n  en: string;\\n}\\n\\nexport interface IljuData {\\n  id: string;\\n  metadata: {\\n    kr_name: string;\\n    en_name: string;\\n    element: string;\\n    animal: string;\\n    nature_symbol: LocalizedString;\\n  };\\n  core_identity: {\\n    persona: LocalizedString;\\n    goth_punk_vibe: LocalizedString;\\n    shadow_side: LocalizedString;\\n  };\\n  behavior_metrics: {\\n    drive: number;\\n    empathy: number;\\n    stability: number;\\n    unpredictability: number;\\n  };\\n  compatibility_tags: {\\n    ideal_partner: string[];\\n    caution_partner: string[];\\n  };\\n  narrative_blocks: {\\n    default: LocalizedString;\\n    relationship: LocalizedString;\\n    timing_modifiers: {\\n      wood: LocalizedString;\\n      fire: LocalizedString;\\n      earth: LocalizedString;\\n      metal: LocalizedString;\\n      water: LocalizedString;\\n    };\\n  };\\n}\\n\\n";

const commentIdx = tsCode.indexOf('// Goth-Punk 스타일의');
if (commentIdx > -1) {
    tsCode = newInterface + tsCode.substring(commentIdx);
} else {
    console.log("Could not find Goth-Punk comment!");
}

const fieldsToWrap = [
  'nature_symbol', 'persona', 'goth_punk_vibe', 'shadow_side', 
  'default', 'relationship', 'wood', 'fire', 'earth', 'metal', 'water'
];

for (const field of fieldsToWrap) {
  const regex = new RegExp("(" + field + "):\\\\s*('([^'\\\\\\\\\\\\]|\\\\\\\\\\\\\\\\.)*'|\\"([^\\"\\\\\\\\\\\\]|\\\\\\\\\\\\\\\\.)*\\")", "g");
  tsCode = tsCode.replace(regex, function(match, p1, p2) {
    return p1 + ": { ko: " + p2 + ", en: \\"\\" }";
  });
}

tsCode = tsCode.replace(/(kr_name:\\s*['"][^'"]+['"],)/g, '$1\\n      en_name: "",');

fs.writeFileSync('src/data/ilju-dataset.ts', tsCode, 'utf8');
console.log('Migration completed.');
