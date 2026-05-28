const fs = require('fs');
const file = 'src/services/cycle-vibe-service.ts';
let code = fs.readFileSync(file, 'utf8');

const regex = /const formatB = \(branch\) => \{[\s\S]*?return `\[#\$\{color\}:\$\{branch\}\]`;\s*\};/g;

const replacement = `const formatB = (branch) => {
          if(!branch) return '';
          const el = BAZI_MAPPING.branches[branch]?.element || "Wood";
          const color = typeof ELEMENT_COLORS !== 'undefined' ? (ELEMENT_COLORS[el] || "#FFFFFF") : (el === 'Wood' ? '#10B981' : el === 'Fire' ? '#EF4444' : el === 'Earth' ? '#F59E0B' : el === 'Metal' ? '#9CA3AF' : '#3B82F6');
          
          const koName = BAZI_MAPPING.branches[branch]?.nameKo || branch;
          return \`[#\${color}:\${koName}(\${branch})]\`;
        };`;

code = code.replace(regex, replacement);

fs.writeFileSync(file, code);
console.log('Done formatB replacement');
