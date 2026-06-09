import fs from 'fs';
let code = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf8');

code = code.replace(
  /partnerAnalysisMemo\.isEasterEgg \? '\(partnerAnalysisMemo\.isEasterEgg \|\| partnerAnalysisMemo\.isExtremeMode\) \? '/g,
  "(partnerAnalysisMemo.isEasterEgg || partnerAnalysisMemo.isExtremeMode) ? '"
);

fs.writeFileSync('src/components/DestinyMapSection.tsx', code);
console.log('regex patch applied');
