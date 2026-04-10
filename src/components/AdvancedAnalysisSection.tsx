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

      {/* Overload Analysis */}
      {analysis.overloadAnalysis && analysis.overloadAnalysis.length > 0 && (
        <div className="p-4 bg-red-900/20 rounded-xl border border-red-500/20">
          <h4 className="text-sm font-display font-medium text-red-400 uppercase tracking-[0.2em] mb-2">
            {lang === 'KO' ? '오행 과다 주의보' : 'Elemental Overload Warning'}
          </h4>
          <div className="space-y-3">
            {analysis.overloadAnalysis.map((item, i) => (
              <div key={i} className="text-xs text-white/70">
                <div className="font-bold text-red-300 mb-1">{lang === 'KO' ? item.title : item.titleEn}</div>
                <div>{lang === 'KO' ? item.description : item.enDescription}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Edge Cases */}
      {analysis.advancedEdgeCases && analysis.advancedEdgeCases.length > 0 && (
        <div className="p-4 bg-amber-900/20 rounded-xl border border-amber-500/20">
          <h4 className="text-sm font-display font-medium text-amber-400 uppercase tracking-[0.2em] mb-2">
            {lang === 'KO' ? '심층 엣지케이스 분석' : 'Advanced Edge Case Analysis'}
          </h4>
          <div className="space-y-3">
            {analysis.advancedEdgeCases.map((item, i) => (
              <div key={i} className="text-xs text-white/70">
                <div className={`font-bold mb-1 ${item.type === 'warning' ? 'text-red-400' : 'text-amber-300'}`}>
                  {item.title}
                </div>
                <div>{item.description}</div>
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
