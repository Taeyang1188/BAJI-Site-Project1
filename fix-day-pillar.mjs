import fs from 'fs';

let ts = fs.readFileSync('src/services/timeline-briefing-service.ts', 'utf-8');

ts = ts.replace(/result\?\.pillars\?\.\[2\]\?\.branch/g, "result?.pillars?.find((p: any) => p.title === 'Day')?.branch");
ts = ts.replace(/result\?\.pillars\?\.\[2\]\?\.stem/g, "result?.pillars?.find((p: any) => p.title === 'Day')?.stem");

fs.writeFileSync('src/services/timeline-briefing-service.ts', ts, 'utf-8');
console.log('Fixed Day pillar index reference.');
