import * as fs from 'fs';
import { resolve } from 'path';

const dataStr = fs.readFileSync(resolve('src/data/ilju-dataset.ts'), 'utf-8');

const suspiciousWords = [
  '파괴자', '승부사', '스나이퍼', '반역자', '혁명가', '마스터', '마키아벨리', '스파이', '기획자', '집행관'
];

let matchCount = 0;
const lines = dataStr.split('\n');

let currentTarget = '';

for(let i=0; i<lines.length; i++) {
  const line = lines[i];
  
  const krMatch = line.match(/"kr_name": "(.*?)"/);
  if (krMatch) {
    currentTarget = krMatch[1];
  }
  
  // check words
  for (const word of suspiciousWords) {
    if (line.includes(word)) {
       console.log(`Found [${word}] in ${currentTarget} at line ${i+1}: ${line.trim()}`);
    }
  }
}

