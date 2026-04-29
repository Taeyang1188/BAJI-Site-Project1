import fs from 'fs';

const content = fs.readFileSync('src/data/ilju-dataset.ts', 'utf8');

const regex = /persona:\s*\{\s*ko:\s*(".*?"|'.*?'),\s*en:\s*(["'].*?["'])\s*\}/g;
console.log("Matches:", content.match(regex)?.length);
