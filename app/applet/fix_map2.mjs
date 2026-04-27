import fs from 'fs';
let ts = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf8');
ts = ts.replace(
  "partnerAdjustedElements,",
  "partnerAdjustedElements,\n        partnerAnalysisMemo.temperature,"
);
// I should use regex replace to safely add it to the call signature
let code = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf8');
const callRegex = /generateRelationshipDynamics\([\s\S]*?lang as 'KO' \| 'EN'[\s\S]*?\)/;
const match = code.match(callRegex);
if(match) {
    const newCall = `generateRelationshipDynamics(
        result,
        partnerResult,
        currentDaewun,
        partnerAdjustedElements,
        partnerAnalysisMemo.temperature,
        lang as 'KO' | 'EN',
        partnerMatchDaewun
    )`;
    code = code.replace(callRegex, newCall);
    fs.writeFileSync('src/components/DestinyMapSection.tsx', code);
}
