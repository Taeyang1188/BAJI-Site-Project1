import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BaZiResult, Language } from '../types';
import { TRANSLATIONS, ELEMENT_COLORS, TEN_GOD_COLORS } from '../constants';
import { BAZI_MAPPING } from '../constants/bazi-mapping';
import { calculateTenGods } from '../services/bazi-engine';
import { ChevronDown, ChevronUp, MessageSquare, Sun, Moon } from 'lucide-react';

interface BaZiResultPageProps {
  result: BaZiResult;
  lang: Language;
  userName: string;
  onBack: () => void;
}

export default function BaZiResultPage({ result, lang, userName, onBack }: BaZiResultPageProps) {
  const t = TRANSLATIONS[lang].result as any;

  const renderPillarText = (type: 'stem' | 'branch', value: string) => {
    const mapping = (type === 'stem' ? BAZI_MAPPING.stems : BAZI_MAPPING.branches) as any;
    const info = mapping[value];
    if (!info) return value;
    
    if (lang === 'KO') {
      return `${info.ko}(${value})`;
    }
    return info.en;
  };

  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const elementData = useMemo(() => {
    const counts = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
    result.pillars.forEach(p => {
      const stemElement = BAZI_MAPPING.stems[p.stem as keyof typeof BAZI_MAPPING.stems]?.element;
      const branchElement = BAZI_MAPPING.branches[p.branch as keyof typeof BAZI_MAPPING.branches]?.element;
      if (stemElement && counts[stemElement as keyof typeof counts] !== undefined) counts[stemElement as keyof typeof counts]++;
      if (branchElement && counts[branchElement as keyof typeof counts] !== undefined) counts[branchElement as keyof typeof counts]++;
    });
    
    return [
      { name: lang === 'KO' ? '목(Wood)' : 'Wood', value: counts.Wood, color: '#22c55e' },
      { name: lang === 'KO' ? '화(Fire)' : 'Fire', value: counts.Fire, color: '#ef4444' },
      { name: lang === 'KO' ? '토(Earth)' : 'Earth', value: counts.Earth, color: '#eab308' },
      { name: lang === 'KO' ? '금(Metal)' : 'Metal', value: counts.Metal, color: '#f8fafc' },
      { name: lang === 'KO' ? '수(Water)' : 'Water', value: counts.Water, color: '#3b82f6' },
    ].filter(d => d.value > 0);
  }, [result.pillars, lang]);

  const getAnalysisText = () => {
    const sorted = [...elementData].sort((a, b) => b.value - a.value);
    const dominant = sorted[0];
    const missing = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'].filter(e => !elementData.find(d => d.name.includes(e)));
    
    if (lang === 'KO') {
      return `당신의 영혼 매트릭스는 ${dominant.name}의 기운이 지배적입니다. 사이버네틱 코어에 각인된 이 강력한 에너지는 당신을 끊임없이 움직이게 하지만, ${missing.length > 0 ? missing.map(m => m === 'Wood' ? '목' : m === 'Fire' ? '화' : m === 'Earth' ? '토' : m === 'Metal' ? '금' : '수').join(', ') + '의 결핍이 시스템의 과부하를 초래할 수 있습니다.' : '모든 원소가 균형을 이루어 안정적인 출력을 자랑합니다.'} 충돌하는 기운을 제어하고 당신만의 네온 불빛을 밝히십시오.`;
    } else {
      return `Your soul matrix is dominated by the energy of ${dominant.name}. This powerful force engraved in your cybernetic core drives you relentlessly, but ${missing.length > 0 ? 'the lack of ' + missing.join(', ') + ' may cause system overloads.' : 'all elements are balanced, boasting stable output.'} Control the clashing energies and ignite your own neon lights.`;
    }
  };

  const renderTitle = () => {
    return (
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <div className="flex items-center text-3xl md:text-5xl font-gothic tracking-widest uppercase">
          <span className="text-white">{userName.toUpperCase()}</span>
          <span className="text-[0.7em] text-white/40 ml-2 self-end mb-1 md:mb-2">{lang === 'KO' ? '님의' : "'S"}</span>
        </div>
        <div className="inline-block relative">
          <h2 className="font-gothic text-3xl md:text-5xl tracking-widest uppercase neon-text-pink">
            {t.title}
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-1 bg-neon-cyan rounded-full shadow-[0_0_15px_#00F2FF] mt-1" 
          />
        </div>
      </div>
    );
  };

  const formatName = (name: string) => {
    if (lang === 'KO') return name;
    return name.startsWith('The ') ? name.slice(4) : name;
  };

  const getTenGodColor = (name: string) => {
    return TEN_GOD_COLORS[name as keyof typeof TEN_GOD_COLORS] || '#FFFFFF';
  };

  const currentCycle = result.grandCycles[result.currentCycleIndex] || result.grandCycles[0];
  const dayMaster = result.pillars[2].stem;
  
  const tenGod = React.useMemo(() => {
    return calculateTenGods(dayMaster, currentCycle.element);
  }, [dayMaster, currentCycle.element]);

  const getLifeStage = (age: number) => {
    const stages = t.lifeStages;
    if (age < 20) return stages.childhood;
    if (age < 40) return stages.youth;
    if (age < 60) return stages.maturity;
    return stages.legacy;
  };

  const PolarityIcon = ({ polarity, size = 10 }: { polarity: number, size?: number }) => {
    if (polarity === 1) return <Sun size={size} className="text-yellow-400" />;
    return <Moon size={size} className="text-blue-300" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-12">
      <div className="text-center">
        {renderTitle()}
      </div>

      {/* Character Commentary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="goth-glass p-6 rounded-2xl border-l-4 border-neon-pink flex items-start gap-4"
      >
        <div className="bg-neon-pink/20 p-3 rounded-full">
          <MessageSquare className="w-6 h-6 text-neon-pink" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest">{t.seasonVibe}</div>
            <div className="text-[10px] text-white/30 italic">{t.seasonVibeDisclaimer}</div>
          </div>
          <p className="text-lg font-display italic text-white leading-relaxed">
            "{lang === 'KO' 
              ? t.comments[currentCycle.element as keyof typeof t.comments] 
              : (t.comments[currentCycle.element as keyof typeof t.comments] as any)[tenGod] || (t.comments[currentCycle.element as keyof typeof t.comments] as any)?.BiGyean}"
          </p>
        </div>
      </motion.div>

      {/* 8 Pillars Grid (4x2) */}
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {result.pillars.map((pillar, i) => (
            <motion.div
              key={`stem-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="goth-glass rounded-xl border-t-2 flex flex-col overflow-hidden"
              style={{ borderColor: ELEMENT_COLORS[pillar.element as keyof typeof ELEMENT_COLORS] || '#FF007A' }}
            >
              <div className="p-3 md:p-4 flex flex-col items-center text-center space-y-2 flex-grow relative">
                <div className="absolute top-2 right-2 opacity-40">
                  <PolarityIcon polarity={pillar.stemPolarity} />
                </div>
                <div className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase">
                  {lang === 'KO' ? 
                    (pillar.title === 'Year' ? '연간' : pillar.title === 'Month' ? '월간' : pillar.title === 'Day' ? '일간' : '시간') : 
                    `${pillar.title} Stem`}
                </div>
                <div className="text-xl md:text-3xl font-gothic text-white leading-tight min-h-[3.2em] flex flex-col justify-center">
                  {lang === 'KO' ? 
                    (BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.ko || pillar.stem) : 
                    (BAZI_MAPPING.stems[pillar.stem as keyof typeof BAZI_MAPPING.stems]?.en || pillar.stem).split(' ').map((word, idx) => (
                      <div key={idx}>{word}</div>
                    ))}
                </div>
              </div>
              <div className="bg-white/5 border-t border-white/10 py-2 px-1 text-center">
                <div 
                  className="text-[10px] md:text-[11px] font-display font-bold uppercase tracking-wider truncate"
                  style={{ color: getTenGodColor(lang === 'KO' ? pillar.stemKoreanName : pillar.stemEnglishName) }}
                >
                  {lang === 'KO' ? pillar.stemKoreanName : formatName(pillar.stemEnglishName)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {result.pillars.map((pillar, i) => (
            <motion.div
              key={`branch-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i + 4) * 0.05 }}
              className="goth-glass rounded-xl border-t-2 flex flex-col overflow-hidden"
              style={{ borderColor: ELEMENT_COLORS[BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FF007A' }}
            >
              <div className="p-3 md:p-4 flex flex-col items-center text-center space-y-2 flex-grow relative">
                <div className="absolute top-2 right-2 opacity-40">
                  <PolarityIcon polarity={pillar.branchPolarity} />
                </div>
                <div className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-white/40 uppercase">
                  {lang === 'KO' ? 
                    (pillar.title === 'Year' ? '연지' : pillar.title === 'Month' ? '월지' : pillar.title === 'Day' ? '일지' : '시지') : 
                    `${pillar.title} Branch`}
                </div>
                <div className="text-xl md:text-3xl font-gothic text-white/60 leading-tight min-h-[1.6em] flex flex-col justify-center">
                  {lang === 'KO' ? 
                    (BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches]?.ko || pillar.branch) : 
                    (BAZI_MAPPING.branches[pillar.branch as keyof typeof BAZI_MAPPING.branches]?.en || pillar.branch)}
                </div>
              </div>
              <div className="bg-white/5 border-t border-white/10 py-2 px-1 text-center">
                <div 
                  className="text-[10px] md:text-[11px] font-display font-bold uppercase tracking-wider truncate"
                  style={{ color: getTenGodColor(lang === 'KO' ? pillar.branchKoreanName : pillar.branchEnglishName) }}
                >
                  {lang === 'KO' ? pillar.branchKoreanName : formatName(pillar.branchEnglishName)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>



      {/* Grand Cycle Timeline */}
      <div className="space-y-6">
        <h3 className="text-xs font-display font-bold tracking-[0.4em] text-white/60 uppercase text-center">
          {t.grandCycle}
        </h3>
        <div className="relative overflow-x-auto pb-4 scrollbar-neon-purple" dir="rtl">
          <div className="flex gap-4 min-w-max px-4 flex-row-reverse">
            {[...result.grandCycles].reverse().map((cycle, i) => {
              const actualIndex = result.grandCycles.length - 1 - i;
              const isCurrent = actualIndex === result.currentCycleIndex;
              const isExpanded = expandedCycle === actualIndex;

              return (
                <div key={actualIndex} className="flex flex-col items-center space-y-1" dir="ltr">
                  <div className="text-xs text-white/40 font-mono">
                    {cycle.year}
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-1" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[cycle.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                    <PolarityIcon polarity={cycle.stemPolarity} size={8} />
                    {lang === 'KO' ? cycle.stemTenGodKo : cycle.stemTenGodEn}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setExpandedCycle(isExpanded ? null : actualIndex);
                      setExpandedYear(null);
                      setExpandedMonth(null);
                    }}
                    className={`w-16 h-24 rounded-xl border transition-all flex flex-col items-center justify-center p-2 relative ${
                      isCurrent ? 'border-neon-pink bg-neon-pink/10 shadow-[0_0_15px_rgba(255,0,122,0.3)]' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-white/40 mb-1 uppercase leading-tight text-center px-1">
                      {getLifeStage(cycle.age)}
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{cycle.age}</div>
                    <div 
                      className="text-[10px] md:text-xs font-gothic leading-tight text-center"
                      style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[cycle.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                    >
                      {renderPillarText('stem', cycle.stem)}
                    </div>
                    <div 
                      className="text-[10px] md:text-xs font-gothic leading-tight text-center opacity-80"
                      style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[cycle.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                    >
                      {renderPillarText('branch', cycle.branch)}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      {isExpanded ? <ChevronUp className="w-3 h-3 text-neon-pink" /> : <ChevronDown className="w-3 h-3 text-white/20" />}
                    </div>
                  </motion.button>
                  <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-1" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[cycle.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
                    <PolarityIcon polarity={cycle.branchPolarity} size={8} />
                    {lang === 'KO' ? cycle.branchTenGodKo : cycle.branchTenGodEn}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Timeline Line */}
          <div className="absolute top-[55px] left-0 w-full h-[1px] bg-white/10 -z-10" />
        </div>

        {/* Annual Pillars Breakdown (Se-Un) */}
        <AnimatePresence mode="wait">
          {expandedCycle !== null && result.grandCycles[expandedCycle]?.annualPillars && (
            <motion.div
              key={`annual-${expandedCycle}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="goth-glass rounded-2xl p-4 border border-white/10 space-y-4"
            >
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest text-center">Annual Alignment (Se-Un)</div>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-neon-cyan px-2">
                {result.grandCycles[expandedCycle].annualPillars.map((ap, api) => {
                  const isYearExpanded = expandedYear === api;
                  return (
                    <div key={api} className="flex flex-col items-center space-y-1">
                      <div className="text-[10px] font-mono text-white/40">{ap.year}</div>
                      <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[ap.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                        <PolarityIcon polarity={ap.stemPolarity} size={6} />
                        {lang === 'KO' ? ap.stemTenGodKo : ap.stemTenGodEn}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setExpandedYear(isYearExpanded ? null : api);
                          setExpandedMonth(null);
                        }}
                        className={`w-16 bg-white/5 rounded-lg p-2 flex flex-col items-center border transition-all relative ${
                          isYearExpanded ? 'border-neon-cyan bg-neon-cyan/5' : 'border-white/5'
                        }`}
                      >
                        <div className="text-xs font-bold text-white mb-1">{ap.age}</div>
                        <div 
                          className="text-[10px] font-gothic font-bold text-center"
                          style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[ap.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                        >
                          {renderPillarText('stem', ap.stem)}
                        </div>
                        <div 
                          className="text-[10px] font-gothic text-center opacity-70"
                          style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[ap.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                        >
                          {renderPillarText('branch', ap.branch)}
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                          {isYearExpanded ? <ChevronUp className="w-2 h-2 text-neon-cyan" /> : <ChevronDown className="w-2 h-2 text-white/20" />}
                        </div>
                      </motion.button>
                      <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[ap.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
                        <PolarityIcon polarity={ap.branchPolarity} size={6} />
                        {lang === 'KO' ? ap.branchTenGodKo : ap.branchTenGodEn}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Monthly Breakdown for the selected year */}
              <AnimatePresence mode="wait">
                {expandedYear !== null && result.grandCycles[expandedCycle].annualPillars[expandedYear]?.monthlyPillars && (
                  <motion.div
                    key={`monthly-${expandedCycle}-${expandedYear}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-white/5"
                  >
                    <div className="text-[11px] font-bold text-white/20 uppercase tracking-widest text-center mb-4">Monthly Pulse</div>
                    <div className="overflow-x-auto pb-4 scrollbar-neon-pink">
                      <div className="flex gap-4 min-w-max">
                        {result.grandCycles[expandedCycle].annualPillars[expandedYear].monthlyPillars.map((m, mi) => {
                          const isMonthExpanded = expandedMonth === mi;
                          return (
                            <div key={mi} className="flex flex-col items-center space-y-1 w-24">
                              <div className="text-[13px] font-mono text-white/90 font-bold uppercase">
                                {t.months[m.month - 1]}
                              </div>
                              <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[m.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                                <PolarityIcon polarity={m.stemPolarity} size={6} />
                                {lang === 'KO' ? m.stemTenGodKo : m.stemTenGodEn}
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setExpandedMonth(isMonthExpanded ? null : mi)}
                                className={`w-full bg-white/5 rounded-lg p-3 flex flex-col items-center border transition-all min-h-[70px] justify-center relative ${
                                  isMonthExpanded ? 'border-neon-pink bg-neon-pink/5' : 'border-white/5'
                                }`}
                              >
                                <div 
                                  className="text-[10px] font-gothic font-bold text-center"
                                  style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[m.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                >
                                  {renderPillarText('stem', m.stem)}
                                </div>
                                <div 
                                  className="text-[10px] font-gothic text-center opacity-70"
                                  style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[m.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                >
                                  {renderPillarText('branch', m.branch)}
                                </div>
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                                  {isMonthExpanded ? <ChevronUp className="w-2 h-2 text-neon-pink" /> : <ChevronDown className="w-2 h-2 text-white/20" />}
                                </div>
                              </motion.button>
                              <div className="text-[9px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[m.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
                                <PolarityIcon polarity={m.branchPolarity} size={6} />
                                {lang === 'KO' ? m.branchTenGodKo : m.branchTenGodEn}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Daily Breakdown for the selected month - Moved outside of monthly scroll container */}
                    {expandedMonth !== null && result.grandCycles[expandedCycle].annualPillars[expandedYear].monthlyPillars[expandedMonth]?.dailyPillars ? (
                      <div className="pt-4 border-t border-white/5">
                        <div className="text-[11px] font-bold text-white/20 uppercase tracking-widest text-center mb-4">Daily Rhythm (Full Month)</div>
                        <div className="overflow-x-auto pb-4 scrollbar-neon-cyan px-2">
                          <div className="flex gap-3 min-w-max">
                            {result.grandCycles[expandedCycle].annualPillars[expandedYear].monthlyPillars[expandedMonth].dailyPillars.map((d, di) => (
                              <div key={di} className="flex flex-col items-center space-y-1 w-16 flex-shrink-0">
                                <div className="text-[12px] font-mono text-white/90 font-bold">{d.day}</div>
                                <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[d.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] }}>
                                  <PolarityIcon polarity={d.stemPolarity} size={5} />
                                  {lang === 'KO' ? d.stemTenGodKo : d.stemTenGodEn}
                                </div>
                                <div className="w-full bg-white/5 rounded-lg p-2 flex flex-col items-center border border-white/5">
                                  <div 
                                    className="text-[10px] font-gothic font-bold text-center"
                                    style={{ color: ELEMENT_COLORS[BAZI_MAPPING.stems[d.stem as keyof typeof BAZI_MAPPING.stems]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                  >
                                    {renderPillarText('stem', d.stem)}
                                  </div>
                                  <div 
                                    className="text-[10px] font-gothic text-center opacity-70"
                                    style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[d.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] || '#FFFFFF' }}
                                  >
                                    {renderPillarText('branch', d.branch)}
                                  </div>
                                </div>
                                <div className="text-[8px] font-bold uppercase tracking-tighter flex items-center gap-0.5" style={{ color: ELEMENT_COLORS[BAZI_MAPPING.branches[d.branch as keyof typeof BAZI_MAPPING.branches]?.element as keyof typeof ELEMENT_COLORS] }}>
                                  <PolarityIcon polarity={d.branchPolarity} size={5} />
                                  {lang === 'KO' ? d.branchTenGodKo : d.branchTenGodEn}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Saju Analysis Button & Report */}
      <div className="flex flex-col items-center space-y-6 pt-8">
        <button 
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="px-6 py-3 bg-neon-pink/20 border border-neon-pink text-neon-pink font-display font-bold tracking-widest uppercase hover:bg-neon-pink hover:text-white transition-all rounded-lg shadow-[0_0_15px_rgba(255,20,147,0.4)]"
        >
          {lang === 'KO' ? '사주 풀이하기 (Extract Soul Details)' : 'Extract Soul Details'}
        </button>

        <AnimatePresence>
          {showAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full overflow-hidden"
            >
              <div className="goth-glass p-6 rounded-2xl border border-white/10 space-y-8">
                <h3 className="text-xl font-gothic text-center text-neon-cyan tracking-widest uppercase">
                  {lang === 'KO' ? '오행 분석 리포트' : 'Elemental Analysis Report'}
                </h3>
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={elementData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {elementData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#050505', border: '1px solid #333', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value: number) => [`${(value / 8 * 100).toFixed(1)}%`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {elementData.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                          <span className="text-sm text-white/80 font-mono">{d.name}: {(d.value / 8 * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                      <p className="text-sm font-display leading-relaxed text-white/90 italic">
                        "{getAnalysisText()}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Advanced Analysis Section */}
                {result.analysis && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-neon-pink uppercase tracking-widest">{lang === 'KO' ? '격국과 용신 (Structure & Useful God)' : 'Structure & Useful God'}</h4>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-xs">{lang === 'KO' ? '격국 (Structure)' : 'Structure'}</span>
                          <span className="text-white font-bold">{result.analysis.geJu}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60 text-xs">{lang === 'KO' ? '용신 (Useful God)' : 'Useful God'}</span>
                          <span className="text-white font-bold">{result.analysis.yongShen}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-neon-cyan uppercase tracking-widest">{lang === 'KO' ? '합형충파해 (Interactions)' : 'Interactions'}</h4>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                        {result.analysis.interactions.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {result.analysis.interactions.map((interaction, i) => (
                              <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-white/80 border border-white/10">
                                {interaction}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-white/40 text-xs italic">{lang === 'KO' ? '특별한 충돌이나 결합이 없습니다.' : 'No significant interactions.'}</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                      <h4 className="text-sm font-bold text-green-400 uppercase tracking-widest">{lang === 'KO' ? '십성 비율 (Ten Gods Ratio)' : 'Ten Gods Ratio'}</h4>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                        <div className="flex flex-wrap gap-4 justify-between">
                          {Object.entries(result.analysis.tenGodsRatio).map(([god, ratio]) => (
                            <div key={god} className="flex flex-col items-center space-y-2 flex-1 min-w-[80px]">
                              <span className="text-xs text-white/60 text-center">{god}</span>
                              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-400 rounded-full"
                                  style={{ width: `${ratio}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold text-white">{ratio}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 md:col-span-2">
                      <h4 className="text-sm font-bold text-yellow-400 uppercase tracking-widest">{lang === 'KO' ? '신살 (Divine Stars)' : 'Divine Stars'}</h4>
                      <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                        {result.analysis.shenSha.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {result.analysis.shenSha.map((star, i) => (
                              <div key={i} className="relative group cursor-help">
                                <span className="px-3 py-1.5 bg-yellow-400/10 text-yellow-400 rounded border border-yellow-400/30 text-sm font-bold">
                                  {star.name}
                                </span>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 border border-white/20 rounded-lg text-xs text-white/90 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
                                  {star.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-white/40 text-xs italic">{lang === 'KO' ? '해당되는 주요 신살이 없습니다.' : 'No major divine stars present.'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onBack}
          className="px-8 py-3 border border-neon-pink text-neon-pink text-xs font-bold tracking-[0.3em] hover:bg-neon-pink hover:text-white transition-all rounded-full"
        >
          {t.back}
        </button>
      </div>
    </div>
  );
}
