import fs from 'fs';
let dm = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf-8');
dm = dm.replace(
    "import { generateRelationshipDynamics } from '../services/timeline-briefing-service';",
    "import { generateRelationshipDynamics, generateIndividualTimelineBriefing } from '../services/timeline-briefing-service';"
);
fs.writeFileSync('src/components/DestinyMapSection.tsx', dm, 'utf-8');
