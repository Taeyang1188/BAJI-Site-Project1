import fs from 'fs';

const content = fs.readFileSync('src/data/ilju-dataset.ts', 'utf8');

if (!content.includes('export const getIljuData')) {
  fs.writeFileSync('src/data/ilju-dataset.ts', content + `\n
export const getIljuData = (id: string): any => {
  return Object.values(ILJU_DATASET).find((data: any) => data.id === id);
};
`);
}
