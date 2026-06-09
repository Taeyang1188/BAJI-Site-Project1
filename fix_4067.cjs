const fs = require('fs');
const file_path = "src/components/BaZiResultPage.tsx";

const lines = fs.readFileSync(file_path, 'utf-8').split('\n');

// Find the line that starts with "-sm text-white/80"
const targetIdx = lines.findIndex(l => l.startsWith('-sm text-white/80'));

if (targetIdx !== -1) {
    lines[targetIdx] = '                     <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">';
    fs.writeFileSync(file_path, lines.join('\n'));
    console.log("Fixed line 4067");
}
