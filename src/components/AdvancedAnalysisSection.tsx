import React from 'react';
import { BaZiResult, Language } from '../types';
import { ParsedText } from './ParsedText';

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
          <div className="text-xs text-white/70 space-y-1">
            {analysis.genderSpecificAnalysis.wifeOrMoney && <ParsedText text={analysis.genderSpecificAnalysis.wifeOrMoney} className="block" />}
            {analysis.genderSpecificAnalysis.husbandOrCareer && <ParsedText text={analysis.genderSpecificAnalysis.husbandOrCareer} className="block" />}
            {analysis.genderSpecificAnalysis.children && <ParsedText text={analysis.genderSpecificAnalysis.children} className="block" />}
          </div>
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
                <span className="font-bold text-purple-300">{item.title}:</span> <ParsedText text={lang === 'KO' ? item.description : item.enDescription} />
              </div>
            ))}
            {analysis.daJaRon?.map((item, i) => (
              <div key={i} className="text-xs text-white/70">
                <span className="font-bold text-purple-300">{item.title}:</span> <ParsedText text={lang === 'KO' ? item.description : item.enDescription} />
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
                <ParsedText text={lang === 'KO' ? item.description : item.enDescription} />
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
                <ParsedText text={item.description} />
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
          <ParsedText text={lang === 'KO' ? analysis.shinGangShinYak.description : analysis.shinGangShinYak.enDescription} className="text-xs text-white/70 mb-2 block" />
          <ParsedText text={lang === 'KO' ? analysis.shinGangShinYak.socialContext : analysis.shinGangShinYak.enSocialContext} className="text-xs text-white/50 italic block" />
        </div>
      )}
    </div>
  );
};
