import sys

file_path = "src/components/BaZiResultPage.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# The error starts at line 4067 (index 4066) where we have:
# <p className="text                      const base = baseBehaviors[tenGodKo] || { 

start_idx = 4066
end_idx = 4422 # which is line 4423 in 1-based, actually line 4422 is `};`

# We need to construct the correct block. 
# First, the closing of guideStep === 5
# Then the start of guideStep === 6 IIFE
# Then the getTenGodBehavior function definition based on the scraped content.

replacement = """-sm text-white/80 leading-relaxed font-sans">
                      {lang === 'KO' ? '지장간은 보통 3가지 기운의 시간적 흐름으로 나뉩니다.' : 'Ji-Jang-Gan is usually divided into 3 temporal phases of energy.'}
                     </p>
                     <ul className="text-xs sm:text-sm text-white/80 space-y-2 list-disc pl-4 font-sans">
                       <li>
                         <span className="font-bold text-emerald-400">
                           {lang === 'KO' ? '초기 (여기, Initial)' : 'Initial Qi (Yeo-gi)'}
                         </span>
                         : {lang === 'KO' ? '전 달의 기운이 아직 남아있는 상태. 은근히 영향을 주는 지나간 습관과 같습니다.' : 'Lingering energy from the previous month. Like an old habit that subtly influences you.'}
                       </li>
                       <li>
                         <span className="font-bold text-blue-400">
                           {lang === 'KO' ? '중기 (Middle)' : 'Middle Qi (Jung-gi)'}
                         </span>
                         : {lang === 'KO' ? '오행이 진화해 나가는 중간 단계. 상황에 따라 유연하게 쓰는 무기입니다.' : 'The transitional phase of elements. A flexible weapon used depending on the situation.'}
                       </li>
                       <li>
                         <span className="font-bold text-neon-pink">
                           {lang === 'KO' ? '정기 (본기, Main)' : 'Main Qi (Jeong-gi)'}
                         </span>
                         : {lang === 'KO' ? '이 지지가 가진 본질적인 핵심 기운! 내 무의식을 지배하는 가장 강력한 본성입니다.' : 'The core essence of this branch! It is the most powerful nature that dominates your unconscious.'}
                       </li>
                     </ul>
                  </div>
                </div>
              )}

              {guideStep === 6 && (
                <div className="flex flex-col gap-6">
                  {(() => {
                    const pillarMap: Record<string, number> = { 'Year': 0, 'Month': 1, 'Day': 2, 'Hour': 3 };
                    const pIdx = pillarMap[guideSelectedPillar];
                    if (pIdx === undefined) return null;
                    const pillarData = result.pillars[pIdx];
                    const stem = pillarData.stem;
                    const branch = pillarData.branch;
                    const namePossessive = lang === 'KO' ? `${userName}님의` : `${userName}'s`;
                    const nameStr = lang === 'KO' ? `${userName}님` : userName;
                    const dayMaster = result.pillars[2].stem;

                    // Collect all rooting points for this specific Heavenly Stem
                    const rootStems = analysis?.rootingInfo?.roots[stem] || [];
                    const rootBranchNames = rootStems.map(r => r.branch);
                    // Evaluate if the current pillar's branch is a root for this stem
                    let bestRootType = 'none';
                    let damageInfo = null;

                    const activeRoot = rootStems.find(r => r.branch === branch);
                    if (activeRoot) {
                        bestRootType = activeRoot.isGenerative ? 'gen' : activeRoot.type;
                        damageInfo = activeRoot.damageInfo;
                    }

                    const getTenGodBehavior = (tenGodKo: string, lang: 'KO'|'EN', pillar: 'Year'|'Month'|'Day'|'Hour', damageInfo: any, targetType: 'stem'|'initial'|'middle'|'main', stemChar: string, userName: string, rootType: string) => {
                      const baseBehaviors: Record<string, {ko: any, en: any}> = {
                        '비견': {
                          ko: { action: "주관과 마이웨이", strategy: "눈치 보지 말고 내 방식대로 내 영역 구축하기", caution: "너무 나 혼자 다 하려다 번아웃 올 수 있음" },
                          en: { action: "Subjectivity & My Way", strategy: "Build your territory your way without caring about others", caution: "Burnout from trying to do everything alone" }
                        },
                        '겁재': {
                          ko: { action: "도발과 한 방 승부", strategy: "위기를 기회로, 치열한 판에서 대담하게 승부수 던지기", caution: "조급한 배팅이나 무리한 경쟁은 낭패의 지름길" },
                          en: { action: "Provocation & Boldness", strategy: "Boldly bet in fierce environments, turning crisis into chance", caution: "Hasty bets or forced competition lead to ruin" }
                        },
                        '식신': {
                          ko: { action: "오타쿠적 장인 정신", strategy: "내가 꽂힌 것 하나만 집요하게 파고들어 압도적 퀄리티 만들기", caution: "내가 안 좋아하는 일은 죽어도 안 하려는 편식 주의" },
                          en: { action: "Artisan Spirit", strategy: "Focus obsessively on what you love to create overwhelming quality", caution: "Strong picky tendency against things you dislike" }
                        },
                        '상관': {
                          ko: { action: "기존 프레임 깨부수기", strategy: "낡은 룰을 비판하고 내 식대로 더 나은 대안을 센스 있게 제시하기", caution: "말 한마디로 적을 만들기 쉬워요. 비판할 땐 꼭 '현실적 대안'을 같이 던져서 입을 싹 닫게 만드세요!" },
                          en: { action: "Breaking Existing Frames", strategy: "Critique outdated rules and propose your own better solutions", caution: "Words can hurt easily; always present alternatives when criticizing" }
                        },
                        '편재': {
                          ko: { action: "스케일이 다른 판 짜기", strategy: "돈냄새, 사람 냄새 기가 막히게 맡는 편이네요. 이것저것 요리조리 연결해서 완전히 판을 크게 키우고 기회를 뻥튀기하는 특출난 감각을 마음껏 써먹으세요.", caution: "판은 기가 막히게 벌리는데 수습과 디테일에 약한 게 흠이죠. 뒤치다꺼리 확실하게 해주는 꼼꼼한 파트너 한 명 무조건 곁에 두세요." },
                          en: { action: "Designing the Big Picture", strategy: "Connect different resources to create new broad opportunities", caution: "You might miss details; keep a meticulous partner close" }
                        },
                        '정재': {
                          ko: { action: "계산기 두드리는 치밀함", strategy: "허황된 꿈꾸는 거 딱 질색이죠? 뜬구름 잡지 않고 현실적으로 계산기 딱딱 두드려서 한 푼 두 푼 낭비 없이 촘촘하게 내 자산을 쌓아가는 게 최고의 전략이에요.", caution: "눈앞에 떨어진 동전 줍다가 저 멀리서 오는 금덩이를 놓칠 수 있어요. 조금 손해 보더라도 장기적으로 크게 베팅해야 할 타이밍을 볼 줄 알아야 해요." },
                          en: { action: "Securing Solid Results", strategy: "Calculate exactly and stack results without waste", caution: "Don't miss the big forest while chasing immediate gains" }
                        },
                        '편관': {
                          ko: { action: "위기를 명성으로", strategy: "남들이 다들 겁먹고 도망가는 헬파티나 개노답 프로젝트, 은근히 '내가 영웅처럼 해결해서 폼나게 인정받고 싶다'는 생각 들 때 있지 않나요? 그 미친 돌파력이 바로 나의 강력한 브랜드가 됩니다.", caution: "과도한 책임감 때문에 나를 갉아먹기 딱 좋은 스타일. '내가 안 하면 안 돼'라는 병을 버리고 위임하는 법을 꼭 병행하세요." },
                          en: { action: "Solving the Impossible", strategy: "Turn around crises everyone avoids to build your strong reputation", caution: "Perfectionism can cause burnout; enforce strict rest" }
                        },
                        '정관': {
                          ko: { action: "안정적인 시스템의 수호자", strategy: "아슬아슬한 모험보단, 탄탄하게 검증된 룰이나 폼 나는 타이틀 딱 등에 업고 흔들림 없이 쭉쭉 치고 나갈 때 가장 편하고 든든할 거예요. 그 안정감이 내 최고의 무기입니다.", caution: "가끔은 매뉴얼에 없는 미친 짓(?)이 필요할 때도 있어요. 너무 FM대로만 살면 꼰대 소리 들으니 융통성 한 스푼 필히 장착!" },
                          en: { action: "Stabilizing via Rules", strategy: "Move forward steadily relying on established rules and your position", caution: "Too much strictness ruins flexibility; always have a Plan B" }
                        },
                        '편인': {
                          ko: { action: "촌철살인 매력", strategy: "남들 다 '네~' 할 때 혼자 '진짜 그런가?' 하고 삐딱선 한 번 타서 이면을 쫙 파헤쳐내 본 적, 많으실 거예요. 그 누구도 흉내 못 낼 그 오묘한 통찰력과 촉이 진짜 치명적인 무기가 됩니다.", caution: "머릿속으로 '이렇게 하면 쩔겠지?' 생각만 오만 번 하다가 타이밍 다 놓치는 게 문제예요. 고민 좀 적당히 하고 일단 세상에 지르고 보세요." },
                          en: { action: "Discovering Hidden Edges", strategy: "Observe differently and build your unique irreplaceable know-how", caution: "Don't get trapped in your head; show your ideas to the world early" }
                        },
                        '정인': {
                          ko: { action: "무한 프리패스 자격증", strategy: "남들이 피땀 흘릴 때, 기가 막히게 라이선스 하나 딱 따서 그걸로 두고두고 편안하게 대접받고 사랑받고 싶지 않나요? 신뢰감 있는 자격이나 학위가 나를 평생 우아하게 지켜줄 거예요.", caution: "준비만 완벽하게 하려다가 나이만 먹을 수 있어요. 제발 생각 좀 멈추고 당장 뭐라도 허접하게 들이밀면서 시작해 보세요." },
                          en: { action: "Building Trusted Authority", strategy: "Gain a loved position using verified skills or credentials", caution: "Perfectionist planning delays execution; start small and adapt" }
                        }
                      };

                      const base = baseBehaviors[tenGodKo] || { 
                        ko: {action: "본질 파악", strategy: "재능 구체화", caution: "밸런스 유지"}, 
                        en: {action: "Identify core", strategy: "Manifest talents", caution: "Maintain balance"} 
                      };

                      if (lang === 'EN') return base;

                      const STEM_TRAITS: Record<string, string> = {
                          '甲': '기획하고 거침없이 밀고 나가는',
                          '乙': '어떤 환경에서도 유연하게 살아남는 잡초 같은',
                          '丙': '화려하게 나를 드러내고 사방으로 뻗어가는',
                          '丁': '하나를 파고들면 무섭게 집중하는 예리한',
                          '戊': '모두를 아우르고 묵직하게 버텨내는 산 같은',
                          '己': '디테일 하나 놓치지 않고 실속을 챙기는 깐깐한',
                          '庚': '아니다 싶으면 과감하게 끊어내고 밀어붙이는 돌파력 있는',
                          '辛': '불필요한 건 단호하게 잘라버리고 극한의 완성도를 추구하는',
                          '壬': '변수를 넉넉히 품어 안으면서도 큰 그림을 꿰뚫어 보는',
                          '癸': '어느새 스며들어 분위기를 맞추고 사람 마음을 읽어내는'
                      };

                      const YEAR_TAILS: Record<string, string> = {
                          '비견': '주변 핑계 안 대고 내 방식대로 쿨하게 내 영역을 지켜내는 뚝심이 진짜 매력이네요.',
                          '겁재': '다들 머뭇거릴 때 과감하게 베팅해서 짜릿한 반전을 만들어낼 수 있는 대담함이 진짜 매력이네요.',
                          '식신': '내가 꽂힌 것에 집요하게 파고들어 압도적인 퀄리티를 뽑아내는 장인 정신이 진짜 매력이네요.',
                          '상관': '당신의 진짜 매력은 남들과는 차원이 다른 감각적이고 빠른 솔루션을 만드는 능력이네요.',
                          '편재': '돈과 사람을 요리조리 엮어내 특출난 기회를 뻥튀기하는 남다른 스케일이 진짜 매력이네요.',
                          '정재': '허황된 꿈 대신 계산기 딱딱 두드려가며 낭비 없이 현실을 탄탄히 다지는 꼼꼼함이 진짜 매력이네요.',
                          '편관': '남들이 피하는 힘든 일이나 위기를 특유의 맷집으로 뚫어내고 내 브랜드로 만드는 돌파력이 진짜 매력입니다.',
                          '정관': '탄탄히 검증된 룰과 명분 속에서 흔들리지 않고 안정감 있게 주도권을 쥐는 카리스마가 진짜 매력입니다.',
                          '편인': '남들 다 "네~" 할 때 이면을 쫙 파헤쳐내 아무도 흉내 못 낼 통찰력을 뿜어내는 게 진짜 매력이네요.',
                          '정인': '단단한 신뢰와 확실한 자격을 바탕으로 어디서든 편안하게 대접받고 사랑받을 수 있는 힘이 진짜 매력입니다.'
                      };

                      const JOB_ROLES: Record<string, string> = {
                          '비견': '눈치 안 보는 독립적 프리랜서나 자수성가형 리더',
                          '겁재': '일단 지르고 보는 혁신가나 파격적인 승부사',
                          '식신': '내 취향을 집요하게 파고드는 장인이나 크리에이터',
                          '상관': '기존 룰을 아작내는 트렌드 세터나 감각적인 기획자',
                          '편재': '스케일 크게 돈과 사람을 엮어내는 비즈니스 네트워커',
                          '정재': '리스크를 철저히 관리하고 계산기 확실히 두드리는 재무 통제관',
                          '편관': '다들 도망가는 난제를 보란 듯이 해결해서 영웅이 되는 사령관',
                          '정관': '체계적이고 흔들림 없는 원칙주의자, 믿음직한 관리자',
                          '편인': '이면을 날카롭게 캐치하는 심리분석가나 아이디어 뱅크',
                          '정인': '누구나 무조건 고개 끄덕이게 만드는 검증된 최고 전문가'
                      };

                      const YEAR_FAMILIES: Record<string, string> = {
                          '비견': '일찍부터 자립심과 주체성을 터득해야 했던 백그라운드',
                          '겁재': '은근히 생존 본능과 치열한 생리를 몸으로 체득한 집안 분위기',
                          '식신': '내 취향과 활동성을 솔찬히 챙겨주고 지원받았을 법한 가풍',
                          '상관': '얽매임 없이 좀 자유롭게 속마음 털어놓도록 자라왔을 환경',
                          '편재': '이리저리 바쁘고 스케일이 컸던, 역마살 느낌 낭낭한 환경',
                          '정재': '아낄 거 철저히 아끼며 안정감 최고로 쳤던 깐깐한 집안 분위기',
                          '편관': '엄격한 룰 안에서 책임감의 무게를 은근히 느끼며 자랐을 가풍',
                          '정관': '교과서처럼 반듯하게 선 긋고 도리에 어긋남 없도록 배운 환경',
                          '편인': '어딘가 유별나고 독특한 세계관, 외롭지만 속 깊은 정서를 키운 곳',
                          '정인': '사랑채 마냥 따뜻하고 전폭적인 지지를 받아 정서적으로 든든했던 환경'
                      };

                      let ctxStrategyContext = '';
                      let ctxCaution = base.ko.caution;

                      const stemTraitText = STEM_TRAITS[stemChar] || '';
                      const tailSentence = YEAR_TAILS[tenGodKo] || '';
                      let coreKo = base.ko.strategy;

                      if (pillar === 'Year') {
                          if (targetType === 'stem') {
                              ctxStrategyContext = `어릴 적 가풍이나 부모님으로부터 [${YEAR_FAMILIES[tenGodKo]}] 속에서 자라오셨네요. 이런 바탕 덕분에 [${stemTraitText}] 기질을 본능적으로 흡수하셨을 겁니다.`;
                              coreKo = tailSentence;
                          } else if (targetType === 'main') {
                              const rootStr = (rootType === 'main') ? '아주 확고하고 흔들림 없이' : (rootType === 'sub' || rootType === 'gen') ? '상황에 따라 다소 기복은 있지만 끈질기게' : '마음속 깊은 곳에서 조용히 불태우며';
                              ctxStrategyContext = `나의 밑바탕을 이루는 가장 핵심적인 무기로서, ${rootStr} [${stemTraitText}] 기력을 발휘합니다. `;
                          } else if (targetType === 'initial') {
                              ctxStrategyContext = `새로운 환경이나 낯선 사람을 처음 겪을 때 가장 먼저 발동하는 기질이라, [${stemTraitText}] 성향을 가볍게 워밍업하듯 꺼내 쓰곤 하죠. `;
                          } else {
                              ctxStrategyContext = `특정 상황에서 예기치 않게 발휘되는 비장의 카드로, [${stemTraitText}] 기질을 상황에 맞게 융통성 있게 활용하는 편입니다. `;
                          }
                      } else if (pillar === 'Month') {
                          if (targetType === 'stem') {
                              ctxStrategyContext = `사회생활이나 직장 같은 빡센 무대에서 ${nameStr}은(는) [${JOB_ROLES[tenGodKo]}] 역할을 맡을 때 포텐이 제대로 터집니다. [${stemTraitText}] 기질을 실무에 거침없이 녹여내서, `;
                          } else if (targetType === 'main') {
                              const rootStr = (rootType === 'main') ? '매우 강력하고 주도적으로' : (rootType === 'sub' || rootType === 'gen') ? '주변과 타협하면서도 집요하게' : '주로 보이지 않는 곳에서 전략적으로';
                              ctxStrategyContext = `사회적 무대에서 내가 진짜로 승부를 볼 때 꺼내 드는 핵심 무기입니다. ${rootStr} [${stemTraitText}] 기력을 터뜨리며 환경을 장악해 갑니다. `;
                          } else if (targetType === 'initial') {
                              ctxStrategyContext = `업무나 프로젝트를 처음 시작할 때 혹은 직장 내 관계의 초반에, [${stemTraitText}] 성향을 은근슬쩍 내비치며 탐색전을 펼치네요. `;
                          } else {
                              ctxStrategyContext = `사회생활 중 돌발 상황이 발생했을 때나 특별한 협상이 필요할 때, [${stemTraitText}] 기질을 스위치 켜듯 꺼내어 상황을 타개하는 기지가 있습니다. `;
                          }
                      } else if (pillar === 'Day') {
                          if (targetType === 'stem') {
                              ctxStrategyContext = `[${stemTraitText}] 것이 바로 ${namePossessive} 일상적 성격입니다. 남 눈치 안 볼 때 제일 편안하게 나오는 모습이기도 하죠. 이 강력하고 솔직한 동력을 바탕으로, `;
                          } else if (targetType === 'main') {
                              const rootStr = (rootType === 'main') ? '강한 자기 확신을 가지고 흔들림 없이' : (rootType === 'sub' || rootType === 'gen') ? '상황에 유연하게 대처하면서도 끈기 있게' : '자신만의 내면 속에서 조용하고 강렬하게';
                              ctxStrategyContext = `가장 프라이빗한 나의 본질이자 내면의 진정한 자원입니다. ${rootStr} [${stemTraitText}] 기질을 거침없이 사용하여 내 삶을 보호하고 이끌어갑니다. `;
                          } else if (targetType === 'initial') {
                              ctxStrategyContext = `퇴근 후의 개인적 일상을 시작할 때나 심리적으로 아주 편안한 상대를 만날 때, 무의식적으로 가장 먼저 편하게 툭 튀어나오는 [${stemTraitText}] 성향입니다. `;
                          } else {
                              ctxStrategyContext = `지극히 사적인 영역에서 갑자기 텐션을 올리거나 내 공간을 방어해야 할 때 발동하는 [${stemTraitText}] 기질입니다. `;
                          }
                      } else if (pillar === 'Hour') {
                          if (targetType === 'stem') {
                              ctxStrategyContext = `장기적인 노후의 지향점이자, 길게 봤을 때 내가 이기적으로라도 꼭 쥐고 싶은 인생의 결과물은 놀랍게도 [${stemTraitText}] 성향과 꼭 맞닿아 있습니다. 먼 미래의 진짜 내 모습을 위해, `;
                          } else if (targetType === 'main') {
                              const rootStr = (rootType === 'main') ? '아주 굳건하고 변함없이' : (rootType === 'sub' || rootType === 'gen') ? '시간이 지날수록 서서히 강력해지며' : '마음속 깊이 품숙한 야망으로서 묵묵히';
                              ctxStrategyContext = `내 인생을 완성 짓는 궁극적인 무기이자 최종 목표입니다. 미래 경을 향해 ${rootStr} [${stemTraitText}] 기력을 쏟아붓습니다. `;
                          } else if (targetType === 'initial') {
                              ctxStrategyContext = `어떤 일을 전부 끝내고 뒷정리를 할 때, 혹은 은밀한 개인 프로젝트를 착수할 때 발동하는 치밀한 [${stemTraitText}] 성향입니다. `;
                          } else {
                              ctxStrategyContext = `미래를 준비하는 긴 여정이나 나의 아랫사람(자식/후배)과 관계를 맺을 때, 간혹 예기치 않게 뿜어져 나오는 비장의 [${stemTraitText}] 기질입니다. `;
                          }
                      }

                      if (damageInfo) {
                          if (damageInfo.type.includes('충')) {
                              ctxCaution += ` 💥 (아! 뼈 때리는 조언 하나: 도중에 '${damageInfo.target}' 글자랑 세게 부딪혀서 갑자기 판이 엎어지거나 궤도 수정할 일이 자주 생길 수 있어요. 위기 탈출 능력은 필수입니다.)`;
                          } else if (damageInfo.type.includes('형')) {
                              ctxCaution += ` ✂️ (아! 뼈 때리는 조언 하나: '${damageInfo.target}' 글자 때문에 내 맘대로 시원하게 안 풀리고 억지로 고치거나 조율하느라 피곤할 수 있어요. 너무 과한 고집은 내려놓는 게 상책!)`;
                          }
                      }

                      return { 
                        ko: { ...base.ko, strategyContext: ctxStrategyContext, strategyCore: coreKo, caution: ctxCaution }, 
                        en: { ...base.en, strategyContext: "(Contextual prepended logic unused in EN)", strategyCore: base.en.strategy, caution: base.en.caution } 
                      };
                    };\n"""

new_lines = lines[:start_idx] + [replacement] + lines[end_idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)
