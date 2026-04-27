import fs from 'fs';

// 1. Fix relationships-service
let rs = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');
rs = rs.replace(/p\.name === 'Day' \|\| p\.name === '일주'/g, "p.title === 'Day' || p.title === '일주'");
fs.writeFileSync('src/services/relationship-dynamics-service.ts', rs, 'utf-8');

// 2. Fix DestinyMapSection import
let dm = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf-8');
if (!dm.includes("import { calculateRelationshipDynamics }")) {
  // just prepend it to the file
  dm = "import { calculateRelationshipDynamics } from '../services/relationship-dynamics-service';\n" + dm;
  fs.writeFileSync('src/components/DestinyMapSection.tsx', dm, 'utf-8');
}
