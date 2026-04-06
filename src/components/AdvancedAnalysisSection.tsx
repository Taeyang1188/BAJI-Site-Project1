import React from 'react';
import { BaZiResult, Language } from '../types';

interface AdvancedAnalysisSectionProps {
  result: BaZiResult;
  lang: Language;
}

export const AdvancedAnalysisSection: React.FC<AdvancedAnalysisSectionProps> = ({ result, lang }) => {
  const analysis = result.analysis;
  if (!analysis) return null;

  return (
    <div className="space-y-6 md:col-span-2">
      {/* Gender Specific Analysis */}
      {analysis.genderSpecificAnalysis && (
        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
          <h4 className="text-sm font-display font-medium text-blue-400 uppercase tracking-[0.2em] mb-2">
            {lang === 'KO' ? '성별 사주 원리' : 'Gender Specific Analysis'}
          </h4>
          <p className="text-xs text-white/70">{analysis.genderSpecificAnalysis.wifeOrMoney}</p>
          <p className="text-xs text-white/70">{analysis.genderSpecificAnalysis.husbandOrCareer}</p>
          <p className="text-xs text-white/70">{analysis.genderSpecificAnalysis.children}</p>
        </div>
      )}

      {/* Mu-Ja-Ron & Da-Ja-Ron */}
      {(analysis.muJaRon || analysis.daJaRon) && (
        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
          <h4 className="text-sm font-display font-medium text-purple-400 uppercase tracking-[0.2em] mb-2">
            {lang === 'KO' ? '무자론 및 다자론' : 'Mu-Ja & Da-Ja Analysis'}
          </h4>
          <div className="space-y-2">
            {analysis.muJaRon?.map((item, i) => (
              <div key={i} className="text-xs text-white/70">
                <span className="font-bold text-purple-300">{item.title}:</span> {lang === 'KO' ? item.description : item.enDescription}
              </div>
            ))}
            {analysis.daJaRon?.map((item, i) => (
              <div key={i} className="text-xs text-white/70">
                <span className="font-bold text-purple-300">{item.title}:</span> {lang === 'KO' ? item.description : item.enDescription}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shin-Gang/Shin-Yak */}
      {analysis.shinGangShinYak && (
        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
          <h4 className="text-sm font-display font-medium text-orange-400 uppercase tracking-[0.2em] mb-2">
            {analysis.shinGangShinYak.title}
          </h4>
          <p className="text-xs text-white/70 mb-2">{lang === 'KO' ? analysis.shinGangShinYak.description : analysis.shinGangShinYak.enDescription}</p>
          <p className="text-xs text-white/50 italic">{lang === 'KO' ? analysis.shinGangShinYak.socialContext : analysis.shinGangShinYak.enSocialContext}</p>
        </div>
      )}
    </div>
  );
};
