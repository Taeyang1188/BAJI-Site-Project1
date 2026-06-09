import * as fs from 'fs';
const text = fs.readFileSync('src/services/cycle-vibe-service.ts', 'utf8');
const lines = text.split('\n');

const startIndex = lines.findIndex(l => l.includes("if (luck.reason?.includes('식상운') || luck.reason?.includes('Sik-sang')) {"));
const endIndex = lines.findIndex((l, i) => i > startIndex && l.includes("return getNarrative(koPrime, koOther, enPrime, enOther);"));

if (startIndex !== -1 && endIndex !== -1) {
  lines.splice(startIndex, endIndex - startIndex + 2,
`      if (luck.reason?.includes('식상운') || luck.reason?.includes('Sik-sang')) {
        const koPrime = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 그동안 억눌렸던 네 재능과 에너지가 밖으로 터져 나오는 식상운의 해이야. 네 매력이 십분 발휘되면서, 네가 주도적으로 인연을 끌어당기고 관계의 결실을 보기에 아주 좋은 타이밍이지.\${goldenTime}\`;
        const koOther = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 그동안 억눌렸던 네 재능과 에너지가 밖으로 터져 나오는 식상운의 해이야. 네 매력이 발휘되며 자연스럽게 인연이 다가오고 안정을 찾기에 좋은 해지.\${goldenTime}\`;
        const enPrime = \`\${luck.year} (\${luck.stem}\${luck.branch}): A year of Sik-sang where suppressed talent and energy burst out. Your charm shines, making it a great time to proactively attract a partner and see results.\${goldenTime}\`;
        const enOther = \`\${luck.year} (\${luck.stem}\${luck.branch}): A year of Sik-sang where suppressed energy bursts out. Your charm naturally attracts a partner for stability.\${goldenTime}\`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }

      if (luck.reason?.includes('관인상생') || luck.reason?.includes('Gwan-in-sang-saeng')) {
        const koPrime = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 나를 억누르던 압박이 든든한 지원군으로 변하는 관인상생의 해이야. 널 지켜주는 따뜻한 안식처 같은 인연을 만나 심리적 안정을 찾고 새로운 시작을 하기에 아주 좋은 타이밍이지.\${goldenTime}\`;
        const koOther = \`\${luck.year}년(\${luck.stem}\${luck.branch}년): 나를 억누르던 압박이 든든한 지원군으로 변하는 관인상생의 해이야. 널 지켜주는 따뜻한 안식처 같은 인연을 만나 심리적 안정을 찾기에 아주 좋은 타이밍이지.\${goldenTime}\`;
        const enPrime = \`\${luck.year} (\${luck.stem}\${luck.branch}): A year of Gwan-in-sang-saeng where pressure turns into support. A great timing to find emotional stability and start anew with a reliable partner.\${goldenTime}\`;
        const enOther = \`\${luck.year} (\${luck.stem}\${luck.branch}): A year of Gwan-in-sang-saeng where pressure turns into support. A great timing to find emotional stability with a partner who acts as a reliable shelter.\${goldenTime}\`;
        return getNarrative(koPrime, koOther, enPrime, enOther);
      }`
  );
  fs.writeFileSync('src/services/cycle-vibe-service.ts', lines.join('\n'), 'utf8');
  console.log("Fixed lines between " + startIndex + " and " + (endIndex+1));
} else {
  console.log("Could not find lines");
}
