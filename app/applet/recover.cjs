const fs = require('fs');

const distFile = fs.readdirSync('dist/assets').find(f => f.startsWith('index-') && f.endsWith('.js'));
if (!distFile) {
    console.log("No index file found");
    process.exit(1);
}

const content = fs.readFileSync('dist/assets/' + distFile, 'utf8');
const idx = content.indexOf('신비주의 뱀파이어');
if (idx > -1) {
    // We found it. It's likely inside an object literal.
    const startIdx = content.lastIndexOf('{', idx);
    // Let's just find the whole ILJU dataset by regex.
    // It usually starts with "var RD={" or similar, and has all 60 items.
    // We can search for the first key, e.g. "癸卯:{" 
    // And grab the object up to the closing brace.
    const startStr = content.lastIndexOf('={', startIdx);
    
    // We can output a substring representing the object.
    console.log(content.substring(startStr, startStr + 1500));
} else {
    console.log('not found');
}
