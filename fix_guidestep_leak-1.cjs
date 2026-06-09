const fs = require('fs');
const file_path = "src/components/BaZiResultPage.tsx";

const lines = fs.readFileSync(file_path, 'utf-8').split('\n');

const startIdx = 4090; // The line with `                  </div>` for Initial/Middle/Main
const endIdx = 4458; // The line with `              </div>` right before section 3 space-y-4.

// Verify endIdx to be safe
if (lines[endIdx+1].includes('space-y-4') && lines[endIdx+2].includes('Life Seasons: Daewun')) {
    const newLines = [
        ...lines.slice(0, startIdx + 1),
        '                </div>',
        '              </div>',
        ...lines.slice(endIdx + 1)
    ];
    fs.writeFileSync(file_path, newLines.join('\n'));
    console.log("Successfully stripped corrupted guideStep === 6 block.");
} else {
    // If not matching, just look for the Daewun section
    const targetEnd = lines.findIndex(l => l.includes('Life Seasons: Daewun'));
    if (targetEnd !== -1) {
        // the targetEnd is the h4. targetEnd-1 is space-y-4
        // so we replace up to targetEnd - 3 (which is empty line probably)
        const newLines = [
            ...lines.slice(0, startIdx + 1),
            '                </div>',
            '              </div>',
            '',
            ...lines.slice(targetEnd - 1)
        ];
        fs.writeFileSync(file_path, newLines.join('\n'));
        console.log("Found Daewun section dynamically and fixed.");
    }
}
