const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src/components/ParsedText.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  "  let processedText = text;",
  "  let processedText = text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');"
);

fs.writeFileSync(filePath, content, 'utf8');
