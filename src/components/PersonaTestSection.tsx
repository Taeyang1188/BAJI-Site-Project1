import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaZiResult, PersonaNode } from '../types';
import { getNextNode } from '../data/persona-engine';

// Helper function for Korean Josa
function attachJosa(word: string, josaType: string): string {
  if (!word) return '';
  const lastChar = word.charCodeAt(word.length - 1);
  if (lastChar < 0xAC00 || lastChar > 0xD7A3) {
    if (word === '너') {
      if (josaType === '은는') return word + '는';
      if (josaType === '이가') return word + '가';
      if (josaType === '을를') return word + '를';
      if (josaType === '와과') return word + '와';
      if (josaType === '의') return word + '의';
    }
    return word + (josaType === '은는' ? '는' : josaType === '이가' ? '가' : josaType === '을를' ? '를' : josaType === '와과' ? '와' : josaType === '의' ? '의' : '');
  }
  
  const hasJongseong = (lastChar - 0xAC00) % 28 > 0;
  switch (josaType) {
    case '은는': return word + (hasJongseong ? '은' : '는');
    case '이가': return word + (hasJongseong ? '이' : '가');
    case '을를': return word + (hasJongseong ? '을' : '를');
    case '와과': return word + (hasJongseong ? '과' : '와');
    case '의': return word + '의';
    default: return word;
  }
}

interface PersonaTestSectionProps {
  userName: string;
  ilju: string;
  baziResult: BaZiResult;
  onComplete?: () => void;
  lang?: 'KO' | 'EN';
}

export default function PersonaTestSection({ userName, ilju, baziResult, onComplete, lang = 'KO' }: PersonaTestSectionProps) {
  const [phase, setPhase] = useState<'intro' | 'question' | 'report'>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionCount, setQuestionCount] = useState<number>(1);
  
  const targetName = userName && userName.length >= 2 ? (userName.length === 3 ? userName.substring(1) : userName) : (lang === 'KO' ? '너' : 'you');

  const spouseTitle = lang === 'KO' 
    ? (answers.marital === 'married' ? '당신의 배우자 앞에서 드러나는 성격' : '당신의 연인 앞에서 드러나는 성격')
    : (answers.marital === 'married' ? 'Character shown to your spouse' : 'Character shown to your lover');

  const currentNode = getNextNode(baziResult, targetName, answers, lang);

  const formatText = (text: string) => {
    let res = text;
    if (lang === 'KO') {
      res = res.replace(/\{\{target은는\}\}/g, attachJosa(targetName, '은는'));
      res = res.replace(/\{\{target이가\}\}/g, attachJosa(targetName, '이가'));
      res = res.replace(/\{\{target을를\}\}/g, attachJosa(targetName, '을를'));
      res = res.replace(/\{\{target와과\}\}/g, attachJosa(targetName, '와과'));
      res = res.replace(/\{\{target의\}\}/g, attachJosa(targetName, '의'));
    }
    res = res.replace(/\{\{target\}\}/g, targetName);
    return res;
  };

  const handleReaction = (optionId: string) => {
    if (!currentNode) return;
    
    const newAnswers = { ...answers, [currentNode.id]: optionId };
    setAnswers(newAnswers);
    
    const nextNode = getNextNode(baziResult, targetName, newAnswers, lang);
    if (nextNode && nextNode.isEnd) {
      setPhase('report');
    } else {
      setQuestionCount(prev => prev + 1);
    }
  };

  if (!currentNode) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 flex flex-col items-center">
      <AnimatePresence mode="wait">
        
        {phase === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6 bg-black/40 border border-white/10 p-8 rounded-3xl w-full"
          >
            <h3 className="text-2xl font-gothic text-neon-pink mb-4">
              {lang === 'KO' ? '입체적 무의식 & 쉐도우 진단' : 'Multidimensional Unconscious & Shadow Diagnosis'}
            </h3>
            <p className="text-sm font-light text-white/70 leading-relaxed font-mono whitespace-pre-wrap">
              {lang === 'KO' 
                ? `당신의 사주 데이터를 바탕으로 심연을 파헤칩니다.\n본질은 단순한 심리테스트가 아닙니다.\n데이터가 당신의 본성, 가면, 그리고 숨기고 싶은 치부까지 어떻게 꿰뚫어보는지 확인하세요.\n\n팩트폭격 당할 준비가 되셨나요?`
                : `We delve into the abyss based on your BaZi data.\nThis is not a simple psychology test.\nSee how the data pierces through your nature, your mask, and the vulnerabilities you want to hide.\n\nAre you ready for the relentless truth bombs?`}
            </p>
            <button
              onClick={() => setPhase('question')}
              className="mt-6 px-8 py-3 bg-neon-pink/20 text-neon-pink border border-neon-pink/50 rounded-full text-sm font-bold tracking-widest hover:bg-neon-pink hover:text-black transition-all"
            >
              {lang === 'KO' ? '진단 시작' : 'Start Diagnosis'}
            </button>
          </motion.div>
        )}

        {phase === 'question' && (
          <motion.div 
            key={`question_${currentNode.id}`}
            initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
            className="w-full space-y-8"
          >
            <div className="p-6 bg-gradient-to-b from-black/60 to-transparent border-t border-neon-pink/30 rounded-t-3xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-pink to-transparent" />
               <div className="text-neon-pink/60 text-[10px] font-mono tracking-widest uppercase mb-4 text-center">
                 PHASE {questionCount < 10 ? `0${questionCount}` : questionCount}
               </div>
               <p className="text-lg md:text-xl font-display text-white/90 leading-relaxed break-keep">
                 {formatText(currentNode.question || '')}
               </p>
            </div>
            
            <div className={`grid grid-cols-1 ${currentNode.options && currentNode.options.length > 2 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
               {currentNode.options?.map(opt => (
                 <button 
                   key={opt.id}
                   onClick={() => handleReaction(opt.id)}
                   className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-neon-cyan/20 hover:border-neon-cyan/50 hover:text-neon-cyan transition-all text-sm font-bold"
                 >
                   {opt.label}
                 </button>
               ))}
            </div>
            
            <div className="mt-8 w-full max-w-xs mx-auto">
              <div className="flex justify-between text-[10px] text-white/30 mb-2 font-mono uppercase">
                <span>Soul Print Progress</span>
                <span>{Math.min(100, Math.floor((questionCount/12)*100))}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-neon-pink"
                   initial={{ width: 0 }}
                   animate={{ width: `${Math.min(100, (questionCount/12)*100)}%` }}
                 />
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'report' && currentNode.report && (
          <motion.div 
            key="report"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-6"
          >
            <div className="text-center mb-8">
               <h2 className="text-2xl md:text-3xl font-gothic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mb-2">
                 {lang === 'KO' ? '무의식 해부 리포트' : 'Unconscious Dissection Report'}
               </h2>
               <div className="text-xs font-mono text-neon-pink tracking-widest uppercase">BAZI DATA ANALYSIS</div>
            </div>

            <div className="space-y-4">
               {/* 가족 앞 */}
               <div className="p-5 bg-black/50 border border-white/10 rounded-2xl">
                  <div className="text-[10px] text-white/40 mb-2 font-bold tracking-widest uppercase">
                    {lang === 'KO' ? '당신의 가족 앞에서 드러나는 성격' : 'Character shown to your family'}
                  </div>
                  <div className="text-sm md:text-base text-white/90 leading-relaxed break-keep">{currentNode.report.family}</div>
               </div>

               {/* 배우자 앞 */}
               {currentNode.report.spouse && (
                 <div className="p-5 bg-black/50 border border-neon-cyan/20 rounded-2xl">
                    <div className="text-[10px] text-neon-cyan/60 mb-2 font-bold tracking-widest uppercase">{spouseTitle}</div>
                    <div className="text-sm md:text-base text-white/90 leading-relaxed break-keep">{currentNode.report.spouse}</div>
                 </div>
               )}
               
               {/* 자녀 앞 */}
               {currentNode.report.children && (
                 <div className="p-5 bg-black/50 border border-neon-cyan/20 rounded-2xl">
                    <div className="text-[10px] text-neon-cyan/60 mb-2 font-bold tracking-widest uppercase">
                      {lang === 'KO' ? '당신의 자녀 앞에서 드러나는 성격' : 'Character shown to your children'}
                    </div>
                    <div className="text-sm md:text-base text-white/90 leading-relaxed break-keep">{currentNode.report.children}</div>
                 </div>
               )}
               
               {/* 형제 동료 앞 */}
               <div className="p-5 bg-black/50 border border-white/10 rounded-2xl">
                  <div className="text-[10px] text-white/40 mb-2 font-bold tracking-widest uppercase">
                    {lang === 'KO' ? '당신의 형제나 동료 앞에서 드러나는 성격' : 'Character shown to your siblings/colleagues'}
                  </div>
                  <div className="text-sm md:text-base text-white/90 leading-relaxed break-keep">{currentNode.report.siblings}</div>
               </div>

               {/* 사회적 관계 */}
               <div className="p-5 bg-black/50 border border-white/10 rounded-2xl">
                  <div className="text-[10px] text-white/40 mb-2 font-bold tracking-widest uppercase">
                    {lang === 'KO' ? '당신의 사회적 관계에서 드러나는 성격' : 'Character shown in social relationships'}
                  </div>
                  <div className="text-sm md:text-base text-white/90 leading-relaxed break-keep">{currentNode.report.social}</div>
               </div>

               {/* 추구미 */}
               <div className="p-5 bg-black/50 border border-white/10 rounded-2xl mt-8">
                  <div className="text-[10px] text-white/40 mb-2 font-bold tracking-widest uppercase">
                    {lang === 'KO' ? '당신이 원하는 이상적인 모습' : 'Your ideal self (What you seek)'}
                  </div>
                  <div className="text-sm md:text-base text-white/90 leading-relaxed break-keep">{currentNode.report.ideal}</div>
               </div>

               {/* 본성 */}
               <div className="p-5 bg-white/5 border border-white/20 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                  <div className="text-[10px] text-white mb-2 font-bold tracking-widest uppercase">
                    {lang === 'KO' ? '진짜 당신의 모습' : 'Your true self'}
                  </div>
                  <div className="text-sm md:text-base text-white leading-relaxed break-keep font-medium">{currentNode.report.trueSelf}</div>
               </div>

               {/* 그림자 */}
               <div className="p-5 bg-black border border-neon-purple/30 rounded-2xl">
                  <div className="text-[10px] text-neon-purple/60 mb-2 font-bold tracking-widest uppercase">
                    {lang === 'KO' ? '당신의 무의식적 그림자' : 'Your unconscious shadow'}
                  </div>
                  <div className="text-sm md:text-base text-neon-purple/90 leading-relaxed break-keep">{currentNode.report.shadow}</div>
               </div>
               
               {/* 운명 동조 스펙트럼 */}
               <div className="p-6 bg-black/50 border border-white/10 rounded-2xl relative overflow-hidden mt-8">
                  <div className="flex justify-between items-center mb-4">
                     <div className="text-[10px] text-white/50 font-bold tracking-widest uppercase">
                       {lang === 'KO' ? '운명 동기화 스펙트럼' : 'Destiny Synchronization Spectrum'}
                     </div>
                     <div className="text-sm font-mono text-white font-bold">
                        {currentNode.report.syncScore}%
                     </div>
                  </div>
                  <div className="relative w-full h-2 bg-gradient-to-r from-blue-900/50 via-purple-700/50 to-neon-pink/80 rounded-full mt-6 mb-8">
                     <div className="absolute -top-6 left-0 text-[10px] text-blue-400/80">
                        {lang === 'KO' ? '운명 거부 (저항)' : 'Destiny Rejection'}
                     </div>
                     <div className="absolute -top-6 right-0 text-[10px] text-neon-pink/80">
                        {lang === 'KO' ? '본성 완전 개방' : 'Full Unleash'}
                     </div>
                     
                     <motion.div 
                        initial={{ left: 0 }}
                        animate={{ left: `${currentNode.report.syncScore}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] border-2 border-black"
                     />
                  </div>
                  
                  <div className="text-sm text-white/80 leading-relaxed font-display break-keep">
                     {(currentNode.report.syncScore ?? 50) <= 30 ? (
                        lang === 'KO' ? '운명 저항자 (Destiny Resister) - 선천적 기질을 억누르고 사회가 요구하는 페르소나에 완벽히 동기화된 상태입니다. 엄청난 정신적 에너지를 쏟아붓고 있습니다.' : 'Destiny Resister - Suppressing innate traits, heavily adapting to your social mask.'
                     ) : (currentNode.report.syncScore ?? 50) < 70 ? (
                        lang === 'KO' ? '유연한 조율자 (Harmonizer) - 상황에 따라 본성과 가면을 적절히 스위칭하는 실용주의자입니다. 사회적 자아와 내면의 균형을 유지하고 있습니다.' : 'Harmonizer - A pragmatist switching cleanly between nature and mask.'
                     ) : (
                        lang === 'KO' ? '기질의 화신 (Incarnation) - 자신의 본성을 가감 없이 드러내며 사주대로 살아가는 날것의 상태입니다. 남들의 시선보다 내 자아가 훨씬 더 중요합니다.' : 'Incarnation - You naturally unleash your innate traits, living intensely with explosive potential.'
                     )}
                  </div>
               </div>

               {/* 어드바이스 */}
               <div className="mt-8 p-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl relative">
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-black text-white text-[10px] font-bold tracking-widest uppercase border border-white/20 rounded-full">
                    {lang === 'KO' ? '빌런의 어드바이스' : 'Villain\'s Advice'}
                  </div>
                  <div className="text-sm md:text-base text-white/90 leading-relaxed mt-2 font-display break-keep">
                    {currentNode.report.advice}
                  </div>
               </div>
            </div>

            {onComplete && (
               <div className="pt-8 flex justify-center">
                  <button 
                     onClick={onComplete}
                     className="px-6 py-2 bg-white/5 border border-white/20 rounded-full text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  >
                     {lang === 'KO' ? '다른 데이터 보기' : 'View other data'}
                  </button>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

