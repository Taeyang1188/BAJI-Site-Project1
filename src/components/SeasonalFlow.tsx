import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const SEASONS = {
  spring: {
    ko: '봄 (Spring)',
    en: 'Spring',
    items: [
      { char: '寅', nameKo: '인목', nameEn: 'Yin Wood', type: '생 (시작)', typeEn: 'Birth (Begin)', typeKo: '새로운 생명과 진취적 시작', typeDescEn: 'New life and progressive start', colorClass: 'bg-[#2ECC71] dark:bg-[#27AE60]' },
      { char: '卯', nameKo: '묘목', nameEn: 'Mao Wood', type: '왕 (왕성)', typeEn: 'Prosperity', typeKo: '폭발적이고 뚜렷한 봄의 기운', typeDescEn: 'Explosive and distinct spring energy', colorClass: 'bg-[#2ECC71] dark:bg-[#27AE60]' },
      { char: '辰', nameKo: '진토', nameEn: 'Chen Earth', type: '고 (저장)', typeEn: 'Storage (End)', typeKo: '봄 기운을 갈무리·여름 준비', typeDescEn: 'Gathering spring energy and preparing for summer', colorClass: 'bg-[#F1C40F] dark:bg-[#D4AC0D]' },
    ],
    activeColor: 'bg-green-50/80 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
  },
  summer: {
    ko: '여름 (Summer)',
    en: 'Summer',
    items: [
      { char: '巳', nameKo: '사화', nameEn: 'Si Fire', type: '생 (시작)', typeEn: 'Birth (Begin)', typeKo: '밝은 열정과 확산의 시작', typeDescEn: 'Bright passion and the start of expansion', colorClass: 'bg-[#FF4136] dark:bg-[#E74C3C]' },
      { char: '午', nameKo: '오화', nameEn: 'Wu Fire', type: '왕 (왕성)', typeEn: 'Prosperity', typeKo: '가장 뜨겁고 화려한 여름 본질', typeDescEn: 'Hottest and most splendid summer essence', colorClass: 'bg-[#FF4136] dark:bg-[#E74C3C]' },
      { char: '未', nameKo: '미토', nameEn: 'Wei Earth', type: '고 (저장)', typeEn: 'Storage (End)', typeKo: '여름 열기를 담아 가을 준비', typeDescEn: 'Containing summer heat to prepare for autumn', colorClass: 'bg-[#F1C40F] dark:bg-[#D4AC0D]' },
    ],
    activeColor: 'bg-red-50/80 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
  },
  autumn: {
    ko: '가을 (Autumn)',
    en: 'Autumn',
    items: [
      { char: '申', nameKo: '신금', nameEn: 'Shen Metal', type: '생 (시작)', typeEn: 'Birth (Begin)', typeKo: '결실을 맺기 위한 숙살의 시작', typeDescEn: 'Start of refinement for bearing fruit', colorClass: 'bg-white dark:bg-[#E2E8F0]' },
      { char: '酉', nameKo: '유금', nameEn: 'You Metal', type: '왕 (왕성)', typeEn: 'Prosperity', typeKo: '단단하고 예리한 가을 본질', typeDescEn: 'Solid and sharp autumn essence', colorClass: 'bg-white dark:bg-[#E2E8F0]' },
      { char: '戌', nameKo: '술토', nameEn: 'Xu Earth', type: '고 (저장)', typeEn: 'Storage (End)', typeKo: '가을 결실을 지키고 겨울 준비', typeDescEn: 'Guarding autumn fruits and preparing for winter', colorClass: 'bg-[#F1C40F] dark:bg-[#D4AC0D]' },
    ],
    activeColor: 'bg-slate-50/80 text-slate-700 border-slate-300 dark:bg-slate-800/50 dark:text-slate-200 dark:border-slate-600'
  },
  winter: {
    ko: '겨울 (Winter)',
    en: 'Winter',
    items: [
      { char: '亥', nameKo: '해수', nameEn: 'Hai Water', type: '생 (시작)', typeEn: 'Birth (Begin)', typeKo: '응축과 지혜의 씨앗이 시작됨', typeDescEn: 'Condensation and the seed of wisdom begins', colorClass: 'bg-[#1a1a2e] dark:bg-black' },
      { char: '子', nameKo: '자수', nameEn: 'Zi Water', type: '왕 (왕성)', typeEn: 'Prosperity', typeKo: '가장 차갑고 깊은 겨울 본질', typeDescEn: 'Coldest and deepest winter essence', colorClass: 'bg-[#1a1a2e] dark:bg-black' },
      { char: '丑', nameKo: '축토', nameEn: 'Chou Earth', type: '고 (저장)', typeEn: 'Storage (End)', typeKo: '겨울 추위를 품고 새 봄 준비', typeDescEn: 'Embracing winter cold and preparing for new spring', colorClass: 'bg-[#F1C40F] dark:bg-[#D4AC0D]' },
    ],
    activeColor: 'bg-slate-200 text-slate-800 border-slate-400 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'
  }
};

export const SeasonalFlow = ({ lang, isLight }: { lang: string, isLight: boolean }) => {
  const [activeSeason, setActiveSeason] = useState<keyof typeof SEASONS>('spring');

  return (
    <div className={`mt-6 rounded-2xl p-4 sm:p-6 border ${isLight ? 'bg-slate-50/50 shadow-sm border-slate-200' : 'bg-[#111111]/80 border-white/5'}`}>
      <h4 className={`text-sm sm:text-base font-bold mb-3 ${isLight ? 'text-slate-800' : 'text-white'}`}>
        {lang === 'KO' ? '🌍 지장간과 계절의 흐름' : 'Seasonal Flow of Hidden Stems'}
      </h4>
      <p className={`text-xs sm:text-[13px] mb-6 leading-relaxed ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
        {lang === 'KO' ? 
          '월지(월주의 지지)의 순서를 나타낼 때는 우리가 아는 子丑寅卯 辰巳午未 순서가 아니라, 계절의 흐름에 따라 寅卯辰(봄), 巳午未(여름), 申酉戌(가을), 亥子丑(겨울) 순서로 봅니다.' : 
          'The order of branches in the month pillar follows the seasons: Spring, Summer, Autumn, and Winter.'}
      </p>

      {/* Season Buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(Object.keys(SEASONS) as Array<keyof typeof SEASONS>).map((season) => (
          <button
            key={season}
            onClick={() => setActiveSeason(season)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
              activeSeason === season 
                ? SEASONS[season].activeColor
                : (isLight ? 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100' : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10')
            }`}
          >
            {SEASONS[season][lang === 'KO' ? 'ko' : 'en']}
          </button>
        ))}
      </div>

      {/* Season Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSeason}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="flex justify-center flex-nowrap mb-6 px-1"
        >
          {SEASONS[activeSeason].items.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className={`text-[65px] sm:text-[90px] font-serif font-black leading-none mb-1 tracking-tighter ${isLight ? 'text-black' : 'text-white'}`}>
                {item.char}
              </div>
              <div className={`w-[95%] h-3 sm:h-4 mb-3 border-2 ${isLight ? 'border-[#333]' : 'border-[#222] ring-1 ring-white/10'} ${item.colorClass}`} />
              <div className={`text-xl sm:text-2xl font-black mb-3 tracking-[0.1em] ${isLight ? 'text-black' : 'text-white'}`}>
                {lang === 'KO' ? item.nameKo : item.nameEn}
              </div>
              <div className={`text-[10px] sm:text-xs font-bold px-2 py-1 rounded w-max mb-1.5 ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-white/70'}`}>
                {lang === 'KO' ? item.type : item.typeEn}
              </div>
              <div className={`text-[9.5px] sm:text-[11px] text-center leading-snug px-1 line-clamp-2 max-w-[120px] ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                {lang === 'KO' ? item.typeKo : item.typeDescEn}
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className={`mt-8 p-3 sm:p-4 rounded-xl text-xs sm:text-[13px] break-keep font-sans flex flex-col gap-2.5 ${isLight ? 'bg-[#f4f7fb] text-slate-700 border border-slate-200' : 'bg-white/5 text-white/70 border border-white/5'}`}>
        <p><strong className={isLight ? 'text-slate-900' : 'text-white/90'}>{lang === 'KO' ? '생 (시작한다):' : 'Birth (Begins):'}</strong> <span className="font-serif font-black" style={{color: 'var(--color-wood)'}}>寅</span>, <span className="font-serif font-black" style={{color: 'var(--color-fire)'}}>巳</span>, <span className="font-serif font-black" style={{color: 'var(--color-metal)'}}>申</span>, <span className="font-serif font-black" style={{color: 'var(--color-water)'}}>亥</span>{lang === 'KO' ? '는 각 계절의 시작을 나타내며 에너지가 힘차게 솟아납니다.' : ' represent the beginning of each season where energy vigorously emerges.'}</p>
        <p><strong className={isLight ? 'text-slate-900' : 'text-white/90'}>{lang === 'KO' ? '왕 (왕성하다):' : 'Prosperity (Peak):'}</strong> <span className="font-serif font-black" style={{color: 'var(--color-wood)'}}>卯</span>, <span className="font-serif font-black" style={{color: 'var(--color-fire)'}}>午</span>, <span className="font-serif font-black" style={{color: 'var(--color-metal)'}}>酉</span>, <span className="font-serif font-black" style={{color: 'var(--color-water)'}}>子</span>{lang === 'KO' ? '는 각 계절의 중심에 해당하여 가장 순수하고 왕성한 기운을 가집니다.' : ' lie at the heart of each season, holding the purest and most active energy.'}</p>
        <p><strong className={isLight ? 'text-slate-900' : 'text-white/90'}>{lang === 'KO' ? '고 (침잠하다):' : 'Storage (Retreat):'}</strong> <span className="font-serif font-black" style={{color: 'var(--color-earth)'}}>辰</span>, <span className="font-serif font-black" style={{color: 'var(--color-earth)'}}>未</span>, <span className="font-serif font-black" style={{color: 'var(--color-earth)'}}>戌</span>, <span className="font-serif font-black" style={{color: 'var(--color-earth)'}}>丑</span>{lang === 'KO' ? '는 각 계절의 끝에 해당하며 에너지를 고이 묻어두고 다음 기운을 준비합니다.' : ' represent the end of each season, burying the energy to prepare for the next flow.'}</p>
      </div>
    </div>
  );
};
