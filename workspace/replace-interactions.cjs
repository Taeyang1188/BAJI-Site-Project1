const fs = require('fs');
const file = 'src/services/cycle-vibe-service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /between Daewun and Seun/g,
  'between Life Seasons and annual alignment'
);
code = code.replace(
  /between Natal Chart and Daewun/g,
  'between Natal Chart and Life Seasons'
);
code = code.replace(
  /between Natal Chart and Seun/g,
  'between Natal Chart and annual alignment'
);

code = code.replace(
  /A strong sensitivity and unconscious obsession \(Wonjin\/Gwimun\)/g,
  'A strong sensitivity and unconscious obsession (Resentment/Ghost Gate)'
);
code = code.replace(
  /Intuition and extreme sensitivity \(Gwimun\)/g,
  'Intuition and extreme sensitivity (Ghost Gate)'
);
code = code.replace(
  /Unexplained friction and resentment \(Wonjin\)/g,
  'Unexplained friction and resentment (Resentment)'
);
code = code.replace(
  /softly bonds \(Six Combination\)/g,
  'softly bonds (Combination)'
);
code = code.replace(
  /Punitive, reconstructive energy \(Hyeong\)/g,
  'Punitive, reconstructive energy (Punishment)'
);
code = code.replace(
  /Fierce clash dynamics \$\{targetEn\}/g,
  'Fierce clash dynamics (Clash) ${targetEn}'
);
code = code.replace(
  /Minor misalignments or hidden harms \(Pa\/Hae\)/g,
  'Minor misalignments or hidden harms (Destruction/Harm)'
);

code = code.replace(
  /Destiny Turning Point: Dynamics Analysis \]\\n\$\{enNotes\.join\('\\n'\)\}\`;/g,
  "Destiny Turning Point: Dynamics Analysis ]\\n💡 *Hover over the interaction terms (e.g., Clash, Punishment) for a brief explanation, or check the Detailed Guide for more information.*\\n\\n${enNotes.join('\\n')}`;"
);

fs.writeFileSync(file, code);
console.log('Done!');
