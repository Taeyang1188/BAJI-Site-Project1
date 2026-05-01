import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaZiResult } from '../types';
import { getNextNode, PersonaNode } from '../data/persona-engine';

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
  const [fatigueScore, setFatigueScore] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(1);
  
  const targetName = userName && userName.length >= 2 ? (userName.length === 3 ? userName.substring(1) : userName) : '너';

  const currentNode = getNextNode(baziResult, targetName, answers);

  const formatText = (text: string) => {
    let res = text;
    res = res.replace(/\{\{target은는\}\}/g, attachJosa(targetName, '은는'));
    res = res.replace(/\{\{target이가\}\}/g, attachJosa(targetName, '이가'));
    res = res.replace(/\{\{target을를\}\}/g, attachJosa(targetName, '을를'));
    res = res.replace(/\{\{target와과\}\}/g, attachJosa(targetName, '와과'));
    res = res.replace(/\{\{target의\}\}/g, attachJosa(targetName, '의'));
    res = res.replace(/\{\{target\}\}/g, targetName);
    return res;
  };

  const handleReaction = (optionId: string) => {
    if (!currentNode) return;
    
    // Calculate fatigue informally
    let added = 20;
    if (optionId === 'yes') added = 25 + Math.floor(Math.random() * 5);
    else if (optionId === 'no') added = 35 + Math.floor(Math.random() * 5);
    
    setFatigueScore(prev => Math.min(100, prev + added));
    
    const newAnswers = { ...answers, [currentNode.id]: optionId };
    setAnswers(newAnswers);
    
    const nextNode = getNextNode(baziResult, targetName, newAnswers);
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
            <h3 className="text-2xl font-gothic text-neon-pink mb-4">입체적 무의식 & 쉐도우 진단</h3>
            <p className="text-sm font-light text-white/70 leading-relaxed font-mono whitespace-pre-wrap">
              {`당신의 사주 데이터를 바탕으로 심연을 파헤칩니다.\n본질은 심리테스트가 아닙니다.\n데이터가 당신의 본성, 가면, 그리고 치부까지 어떻게 꿰뚫어보는지 확인하세요.\n\n아키네이터처럼 질문에 팩트폭격 당할 준비가 되셨나요?`}
            </p>
            <button
              onClick={() => setPhase('question')}
              className="mt-6 px-8 py-3 bg-neon-pink/20 text-neon-pink border border-neon-pink/50 rounded-full text-sm font-bold tracking-widest hover:bg-neon-pink hover:text-black transition-all"
            >
              진단 시작
            </button>
          </motion.div>
        )}

        {phase === 'question' && !currentNode.isEnd && (
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
                 PHASE 0{questionCount}
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
          </motion.div>
        )}

        {phase === 'report' && currentNode.isEnd && currentNode.report && (
          <motion.div 
            key="report"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full space-y-6"
          >
            <div className="text-center mb-8">
               <h2 className="text-2xl md:text-3xl font-gothic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mb-2">
                 무의식 해부 리포트
               </h2>
               <div className="text-xs font-mono text-neon-pink tracking-widest uppercase">BAZI DATA ANALYSIS</div>
            </div>

            <div className="space-y-4">
               {/* 가족 앞 */}
               <div className="p-5 bg-black/50 border border-white/10 rounded-2xl">
                  <div className="text-[10px] text-white/40 mb-2 font-bold tracking-widest uppercase">당신의 가족 앞에서 드러나는 성격</div>
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
                    <div className="text-[10px] text-neon-cyan/60 mb-2 font-bold tracking-widest uppercase">당신의 자녀 앞에서 드러나는 성격</div>
                    <div className="text-sm md:text-base text-white/90 leading-relaxed break-keep">{currentNode.report.children}</div>
                 </div>
               )}
               
               {/* 형제 동료 앞 */}
               <div className="p-5 bg-black/50 border border-white/10 rounded-2xl">
                  <div className="text-[10px] text-white/40 mb-2 font-bold tracking-widest uppercase">당신의 형제나 동료 앞에서 드러나는 성격</div>
                  <div className="text-sm md:text-base text-white/90 leading-relaxed break-keep">{currentNode.report.siblings}</div>
               </div>

               {/* 사회적 관계 */}
               <div className="p-5 bg-black/50 border border-white/10 rounded-2xl">
                  <div className="text-[10px] text-white/40 mb-2 font-bold tracking-widest uppercase">당신의 사회적 관계에서 드러나는 성격</div>
                  <div className="text-sm md:text-base text-white/90 leading-relaxed break-keep">{currentNode.report.social}</div>
               </div>

               {/* 추구미 */}
               <div className="p-5 bg-black/50 border border-white/10 rounded-2xl mt-8">
                  <div className="text-[10px] text-white/40 mb-2 font-bold tracking-widest uppercase">당신이 원하는 이상적인 모습 (추구미)</div>
                  <div className="text-sm md:text-base text-white/90 leading-relaxed break-keep">{currentNode.report.ideal}</div>
               </div>

               {/* 본성 */}
               <div className="p-5 bg-white/5 border border-white/20 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                  <div className="text-[10px] text-white mb-2 font-bold tracking-widest uppercase">진짜 당신의 모습</div>
                  <div className="text-sm md:text-base text-white leading-relaxed break-keep font-medium">{currentNode.report.trueSelf}</div>
               </div>

               {/* 그림자 */}
               <div className="p-5 bg-black border border-neon-purple/30 rounded-2xl">
                  <div className="text-[10px] text-neon-purple/60 mb-2 font-bold tracking-widest uppercase">당신의 무의식적 그림자</div>
                  <div className="text-sm md:text-base text-neon-purple/90 leading-relaxed break-keep">{currentNode.report.shadow}</div>
               </div>
               
               {/* 영혼의 피로도 */}
               <div className="p-5 bg-black/50 border border-neon-pink/20 rounded-2xl relative overflow-hidden mt-8">
                  <div className="flex justify-between items-center mb-3">
                     <div className="text-[10px] text-neon-pink/60 font-bold tracking-widest uppercase">영혼의 피로도 / 방어기제 수준</div>
                     <div className="text-sm font-mono text-neon-pink font-bold">
                        {fatigueScore}%
                     </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${fatigueScore}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-red-500 to-neon-pink"
                     />
                  </div>
               </div>

               {/* 어드바이스 */}
               <div className="mt-8 p-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl relative">
                  <div className="absolute -top-3 left-6 px-3 py-1 bg-black text-white text-[10px] font-bold tracking-widest uppercase border border-white/20 rounded-full">빌런의 어드바이스</div>
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
                     다른 데이터 보기
                  </button>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

