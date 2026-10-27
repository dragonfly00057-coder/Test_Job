import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, Sparkles, TrendingUp, DollarSign, Briefcase, Compass, Copy, Check, Info, RefreshCw } from 'lucide-react';
import { DailyMarketBrief, UserPreferences } from '../types/jobMarket';

interface MorningBriefSectionProps {
  brief: DailyMarketBrief;
  preferences: UserPreferences;
  isRefreshing: boolean;
  lastUpdatedTime?: string;
  onOpenPreferences: () => void;
  onExploreOffers: () => void;
}

export const MorningBriefSection: React.FC<MorningBriefSectionProps> = ({
  brief,
  preferences,
  isRefreshing,
  lastUpdatedTime,
  onOpenPreferences,
  onExploreOffers,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleAudio = () => {
    if (!speechSynthesisAvailable) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = brief.voiceScript || brief.executiveSummary.join('. ');
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find((v) => v.lang.startsWith('fr') || v.lang.includes('FR'));
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleCopySummary = () => {
    const summaryText = `[Briefing Emploi Matinal - ${brief.date}]
Région : ${brief.region} | Secteur : ${brief.domain} | Cible : ${brief.jobTitleTarget}
Marché : ${brief.marketTensionLabel} (${brief.freshOffersCount} nouvelles offres)
Médiane salariale : ${brief.salaryBenchmark.median}k€ brut/an

Constats clés :
${brief.executiveSummary.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Conseil du matin :
${brief.morningAdvice}`;

    navigator.clipboard.writeText(summaryText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  return (
    <section className="space-y-6">
      {/* Header bar of the briefing */}
      <div className={`bg-white rounded-2xl border transition-all duration-300 p-6 shadow-sm ${
        isRefreshing ? 'border-indigo-300 ring-2 ring-indigo-50' : 'border-slate-200/90'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-1">
              <span className="text-indigo-600 font-semibold">{brief.region}</span>
              <span aria-hidden="true">·</span>
              <span>{brief.domain}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{brief.date}</span>
              {lastUpdatedTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono text-[11px] font-semibold tabular-nums">
                    Actualisé à {lastUpdatedTime}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Briefing Matinal du Marché
              </h1>
              {isRefreshing && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-md animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Mise à jour...
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Analyse consolidée des dynamiques de recrutement, offres de la nuit et opportunités salariales ciblées pour{' '}
              <strong className="text-slate-900 font-semibold">{preferences.jobTitle}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {speechSynthesisAvailable && (
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  isPlayingAudio
                    ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100'
                    : 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                }`}
                title="Écouter le flash radio matinal"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4 text-rose-600" />
                    <span>Arrêter la lecture</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    <span>Écouter le briefing (40s)</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors"
              title="Copier la synthèse du jour"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span className="hidden sm:inline">{isCopied ? 'Copié !' : 'Copier la synthèse'}</span>
            </button>
          </div>
        </div>

        {/* 4 Quantitative Rigor Metric Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-1">Offres fraîches (24h)</div>
            <div className={`text-2xl font-bold font-mono tabular-nums text-slate-900 transition-transform ${isRefreshing ? 'opacity-50' : ''}`}>
              {brief.freshOffersCount}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-1">
              {brief.weekVariationRate}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-1">Tension recruteurs</div>
            <div className={`text-sm font-bold text-slate-900 truncate transition-transform ${isRefreshing ? 'opacity-50' : ''}`} title={brief.marketTensionLabel}>
              {brief.marketTensionLabel.split('(')[0]}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Indice <span className="font-mono tabular-nums font-semibold text-slate-800">{brief.marketTensionScore}</span>/100
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-1">Médiane salariale {brief.region}</div>
            <div className={`text-2xl font-bold font-mono tabular-nums text-indigo-600 transition-transform ${isRefreshing ? 'opacity-50' : ''}`}>
              {brief.salaryBenchmark.median} <span className="text-sm font-normal text-slate-600">{brief.salaryBenchmark.currency}</span>
            </div>
            <div className="text-xs text-slate-500 font-mono tabular-nums mt-1">
              Fourchette : {brief.salaryBenchmark.min} - {brief.salaryBenchmark.max} k€
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-medium text-slate-500 mb-1">Créneau d'envoi optimal</div>
            <div className="text-base font-bold text-slate-900">
              08h00 - 09h30
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Top boîte de réception RH
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Points Clés du Jour & Conseil du Matin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Executive Bullet Points */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Constats Stratégiques du Jour
            </h2>
            <span className="text-xs text-slate-400">Sources : Apec, France Travail, Observatoires</span>
          </div>

          <div className="space-y-3.5">
            {brief.executiveSummary.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 text-sm text-slate-800"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center font-mono tabular-nums">
                  {index + 1}
                </span>
                <p className="leading-relaxed">{point}</p>
              </div>
            ))}
          </div>

          {/* Economic Context note */}
          <div className="mt-5 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-indigo-900">Contexte régional ({brief.region}) : </span>
              {brief.economicContext}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Conseil Tactique du Matin */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              Conseil Tactique du Matin
            </div>
            <h3 className="text-lg font-bold text-white mb-3">
              Action prioritaire avant midi
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {brief.morningAdvice}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="text-xs text-slate-300 mb-3">
              Prêt à passer à l'action ? Consultez les nouvelles offres parues cette nuit.
            </div>
            <button
              type="button"
              onClick={onExploreOffers}
              className="w-full py-2.5 px-4 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Voir les {brief.freshOffersCount} offres fraîches
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
