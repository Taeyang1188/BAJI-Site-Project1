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
  'nature_symbol', 'persona', 'goth_punk_vibe', 'shadow_side', 
  'default', 'relationship', 'wood', 'fire', 'earth', 'metal', 'water'
];

for (const field of fieldsToWrap) {
  const r1 = new RegExp(field + ":\\\\s*'([^']*)'", 'g');
  tsCode = tsCode.replace(r1, function(m, p1) {
      if (m.indexOf("\\\\n") > -1) return m; 
      return field + ": { ko: '" + p1 + "', en: '' }";
  });
  
  const r2 = new RegExp(field + ":\\\\s*\\"([^\\"]*)\\"", 'g');
  tsCode = tsCode.replace(r2, function(m, p1) {
      if (m.indexOf("\\\\n") > -1) return m;
      return field + ": { ko: \\"" + p1 + "\\", en: '' }";
  });
}

tsCode = tsCode.replace(/(kr_name:\\s*['"][^'"]+['"],)/g, '$1\\n      en_name: "",');

fs.writeFileSync('src/data/ilju-dataset.ts', tsCode, 'utf8');
console.log('Migration completed.');
