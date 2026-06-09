const fs = require('fs');

const distFile = fs.readdirSync('dist/assets').find(f => f.startsWith('index-') && f.endsWith('.js'));
if (!distFile) {
    console.log("No index file found");
    process.exit(1);
}

const content = fs.readFileSync('dist/assets/' + distFile, 'utf8');
const idx = content.indexOf('신비주의 뱀파이어');
if (idx > -1) {
    const startIdx = content.lastIndexOf('={', idx);
    console.log(content.substring(startIdx - 10, startIdx + 1500));
} else {
    console.log('not found');
}
