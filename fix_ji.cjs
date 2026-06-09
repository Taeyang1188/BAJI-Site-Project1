const fs = require('fs');
const file_path = "src/components/BaZiResultPage.tsx";

const lines = fs.readFileSync(file_path, 'utf-8').split('\n');

const targetIdx = lines.findIndex((l, i) => l.trim() === '</ul>' && lines[i+1].trim() === '</div>' && lines[i+2].trim() === '</div>' && lines[i+3].trim() === '</div>');

console.log("Target idx:", targetIdx);

if (targetIdx !== -1) {
    const replacement = `                      </ul>
                   </div>

                   {/* Rooting Tags Explained */}
                   <div className="space-y-3 pt-4 border-t border-white/10">
                       <p className="text-sm font-bold text-white/90">
                         {lang === 'KO' ? '통근(뿌리) 표식의 의미' : 'Meaning of Rooting Tags'}
                       </p>
                       <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                        {lang === 'KO' ? 
                          '사주 원국의 천간(하늘)에 있는 기운이 지장간(땅 속)에 같은 오행을 두고 있을 때 "통근(뿌리내림)"했다고 합니다. 개별 지장간 하단의 꼬리표는 이 연결의 깊이를 나타냅니다.' : 
                          'When a Heavenly Stem shares energy with a Hidden Stem, it is "rooted". These tags indicate the strength of that connection.'}
                       </p>
                       <ul className="text-xs sm:text-sm text-white/80 space-y-3 list-none pl-1 font-sans">
                         <li className="flex items-start gap-2">
                           <span className="text-[10px] sm:text-[11px] p-1 rounded font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 whitespace-nowrap mt-0.5">MAIN</span>
                           <span className="leading-snug">{lang === 'KO' ? '본기(Main) 뿌리: 나의 밑바탕을 이루는 가장 핵심적이고 강력한 기반 무기.' : 'Main Root: The strongest and most direct foundation.'}</span>
                         </li>
                         <li className="flex items-start gap-2">
                           <span className="text-[10px] sm:text-[11px] p-1 rounded font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 whitespace-nowrap mt-0.5">SUB</span>
                           <span className="leading-snug">{lang === 'KO' ? '여기/중기(Sub) 뿌리: 상황에 따라 다소 기복은 있지만 끈질기게 쓰이는 서브 무기.' : 'Sub Root: A persistent secondary weapon with some situational behavior.'}</span>
                         </li>
                         <li className="flex items-start gap-2">
                           <span className="text-[10px] sm:text-[11px] p-1 rounded font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 whitespace-nowrap mt-0.5">GEN</span>
                           <span className="leading-snug">{lang === 'KO' ? '상생(Generative) 뿌리: 직접 같은 글자는 아니지만 나를 밀어주는 든든한 조력자.' : 'Generative Root: Not exactly the same element, but a reliable supporter pushing from behind.'}</span>
                         </li>
                         <li className="flex items-start gap-2">
                           <span className="text-[10px] sm:text-[11px] p-1 rounded font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30 whitespace-nowrap mt-0.5">미통근</span>
                           <span className="leading-snug">{lang === 'KO' ? '뿌리 없음: 얽매이지 않고 유연하고 탄력적으로 쓰는 무기 (아무런 태그가 표시되지 않음).' : 'Unrooted: A flexibly used weapon not tied to a specific root (no tags).'}</span>
                         </li>
                       </ul>
                   </div>
                 </div>
               </div>`;

    
    lines.splice(targetIdx, 4, replacement);
    fs.writeFileSync(file_path, lines.join('\n'));
    console.log("Fixed!");
}
