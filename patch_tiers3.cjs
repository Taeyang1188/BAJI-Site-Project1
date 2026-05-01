const fs = require('fs');
const content = fs.readFileSync('src/services/relationship-dynamics-service.ts', 'utf8');

const startStr = '// [v5.9] Hierarchical Filtering';
const endStr = 'let relation = isKO ? "평범한 동행" : "Ordinary Companion";';
const indexStart = content.indexOf(startStr);
const indexEnd = content.indexOf(endStr);

if (indexStart !== -1 && indexEnd !== -1) {
    const replacement = `// [v5.9] Hierarchical Filtering
            const isElementalBadge = (g) => g.desc.includes('text-[10px]') || g.desc.includes('Mass:');
            
            // Prioritize Structural Badges (Tier 1) over Elemental ones (Tier 2)
            const structuralGates = uniqueGates.filter(g => !isElementalBadge(g));
            const elementalGates = uniqueGates.filter(g => isElementalBadge(g));
            
            const finalGates = [...structuralGates, ...elementalGates];

            `;
            
    const newContent = content.substring(0, indexStart) + replacement + content.substring(indexEnd);
    fs.writeFileSync('src/services/relationship-dynamics-service.ts', newContent);
    console.log("PATCH_SUCCESS");
} else {
    console.log("PATTERN_NOT_FOUND");
}
