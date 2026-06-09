import fs from 'fs';

let ts = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf8');

const regex = /예컨대 돈과 이익을 쫓았으나, 결국 막중한 책임감이나 압박으로 둔갑하게 되는 특수한 시기입니다\./;

const replacement = `\${(originalTenGod === '재성' && newTenGod === '관성') ? '예컨대 돈과 이익을 쫓았으나, 결국 막중한 책임감이나 압박으로 둔갑하게 되는 특수한 시기입니다.' : '당초 기대했던 사건의 방향성이 전혀 다른 결실로 이어지게 되는 특수한 시기입니다.'}`;

ts = ts.replace(regex, replacement);

fs.writeFileSync('src/services/timeline-briefing-service.ts', ts, 'utf8');
console.log('Fixed hardcoded Hap trap message.');
