import fs from 'fs';
let ts = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf8');
ts = ts.replace("{lang === 'KO' ?  : }", "{lang === 'KO' ? `${currentDaewun.year}년 ~ : ${currentDaewun.stem}${currentDaewun.branch} 대운` : `${currentDaewun.year} ~ : ${currentDaewun.stem}${currentDaewun.branch} Phase`}");
fs.writeFileSync('src/components/DestinyMapSection.tsx', ts);
console.log("Fixed map section");
