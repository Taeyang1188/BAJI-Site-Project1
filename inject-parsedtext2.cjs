const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src/components/ParsedText.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// replace the br check with newline handling
content = content.replace(
  "if (processedText.startsWith('<br>', i) || processedText.startsWith('<br/>', i) || processedText.startsWith('<br />', i)) {",
  "if (processedText.startsWith('\\n', i)) {"
).replace(
  "i += processedText.startsWith('<br>', i) ? 4 : (processedText.startsWith('<br/>', i) ? 5 : 6);",
  "i += 1;"
);

fs.writeFileSync(filePath, content, 'utf8');
