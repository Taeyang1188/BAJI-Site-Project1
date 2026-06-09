const fs = require('fs');

const code = fs.readFileSync('src/components/BaZiResultPage.tsx', 'utf8');
const lines = code.split('\n');

let tagStack = [];
for (let i = 3862; i < 4428; i++) {
    const line = lines[i];

    // Remove text content to avoid matching false positives
    const cleanerLine = line.replace(/\{[^}]+\}/g, '').replace(/="[^"]*"/g, '=""');
    
    const opener = /<(div|motion\.div|h3|h4|h5|p|ul|li|span)(\s|>)/g;
    let match;
    while ((match = opener.exec(cleanerLine)) !== null) {
        // Simple check for self closing
        const tagStr = cleanerLine.slice(match.index);
        const closeBracket = tagStr.indexOf('>');
        if (closeBracket !== -1 && tagStr[closeBracket - 1] === '/') {
            continue; // self closing
        }
        tagStack.push({ tag: match[1], line: i + 1 });
    }
    
    const closer = /<\/(div|motion\.div|h3|h4|h5|p|ul|li|span)>/g;
    while ((match = closer.exec(cleanerLine)) !== null) {
        if (tagStack.length > 0) {
            const popped = tagStack.pop();
            if (popped.tag !== match[1]) {
                console.log(`Mismatch at line ${i + 1}: expected </${popped.tag}> (opened at ${popped.line}) but got </${match[1]}>`);
            }
        } else {
            console.log(`Orphan closer at line ${i + 1}: </${match[1]}>`);
        }
    }
}
console.log("Remaining tags:", tagStack);
