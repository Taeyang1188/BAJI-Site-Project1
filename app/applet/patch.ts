import fs from 'fs';
let content = fs.readFileSync('src/components/DestinyMapSection.tsx', 'utf8');

content = content.replace(
  /\$\{partnerAnalysisMemo\.isEasterEgg \? '\(partnerAnalysisMemo\.isEasterEgg \|\| partnerAnalysisMemo\.isExtremeMode\) \? 'text-red-400 font-bold' : 'text-white\/50'\}`\}/,
  "${(partnerAnalysisMemo.isEasterEgg || partnerAnalysisMemo.isExtremeMode) ? 'text-red-400 font-bold' : 'text-white/50'}`"
);

content = content.replace(
  "{lang === 'KO' \n                                    ? `사용자",
  "{partnerAnalysisMemo.isEasterEgg ? (lang === 'KO' \n                                    ? `사용자"
);

content = content.replace(
  ". Indicates soulmate potential.`}\n                            </div>",
  ". Indicates soulmate potential.`) : partnerAnalysisMemo.extremeModeDesc}\n                            </div>"
);

content = content.replace(
  /<div className="flex flex-col mb-4">\n\s*<span className="text-sm font-bold text-white\/80 flex items-center gap-1\.5 mb-2">\n\s*<span className="text-lg">\{partnerAnalysisMemo\.syncIcon\}<\/span> \{partnerAnalysisMemo\.syncTierText\}\n\s*<\/span>\n\s*<div className="flex flex-col gap-2 w-full">/,
  "<div className=\"flex flex-col mb-4\">\n                        <div className=\"flex flex-col gap-2 w-full mt-2\">"
);

content = content.replace(
  /<div className="flex flex-col gap-1 mb-4">\n\s*<span className="text-sm font-bold text-white\/80 flex items-center gap-1\.5">\n\s*<span className="text-lg">\{partnerAnalysisMemo\.syncIcon\}<\/span> \{partnerAnalysisMemo\.syncTierText\}\n\s*<\/span>\n\s*<span className=\{`text-\[2\.2rem\] leading-none font-mono font-bold \$\{partnerAnalysisMemo\.isEasterEgg \? 'text-red-500' : 'text-fuchsia-300'\}`\}>/,
  `<div className="flex flex-col gap-1 mb-4">
                            {!partnerAnalysisMemo.isExtremeMode && (
                                <span className="text-sm font-bold text-white/80 flex items-center gap-1.5">
                                    <span className="text-lg">{partnerAnalysisMemo.syncIcon}</span> {partnerAnalysisMemo.syncTierText}
                                </span>
                            )}
                            <span className={\`text-[2.2rem] leading-none font-mono font-bold \${(partnerAnalysisMemo.isEasterEgg || partnerAnalysisMemo.isExtremeMode) ? 'text-red-500' : 'text-fuchsia-300'}\`}>`
);

fs.writeFileSync('src/components/DestinyMapSection.tsx', content);
console.log("Done");
