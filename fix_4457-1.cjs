const fs = require('fs');
const file_path = "src/components/BaZiResultPage.tsx";

const lines = fs.readFileSync(file_path, 'utf-8').split('\n');
const fixedLines = [];

for (let i=0; i<lines.length; i++) {
    // 4457 index is 4456
    let targetIdx = i; // just check the line content around 4457
    if (lines[i].includes('              </div>') &&
        lines[i-1].includes('                </div>') &&
        lines[i-2].includes('                  })()')) {
        // Change from </div> to )}
        lines[i] = '              )}';
        console.log("Fixed 4457 equivalent");
    }
}

fs.writeFileSync(file_path, lines.join('\n'));
