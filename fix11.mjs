import fs from 'fs';

let rs = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf-8');

rs = rs.replace("    const gates: { name: string; desc: string }[] = [];", "");

rs = rs.replace(
    "    // Day Branches",
    "    // --- Dynamics Gates ---\n    const gates: { name: string; desc: string }[] = [];\n    // Day Branches"
);

fs.writeFileSync('src/services/relationship-dynamics-service.ts', rs, 'utf-8');
console.log('Fixed variable scope for gates');
