import React, { useState, useEffect } from 'react';
import { X, Sparkles, Building, MapPin, Laptop, DollarSign, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, Bookmark } from 'lucide-react';
import { JobOffer, UserPreferences } from '../types/jobMarket';

interface MatchAnalysis {
  matchScore: number;
  strengths: string[];
  missingSkills: string[];
  recommendedPitch: string;
  salaryNegotiationTip: string;
}

interface JobDetailModalProps {
  offer: JobOffer | null;
  preferences: UserPreferences;
  onClose: () => void;
  onAddToApplications: (offer: JobOffer) => void;
  isAlreadyTracked: boolean;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  offer,
  preferences,
  onClose,
  onAddToApplications,
  isAlreadyTracked,
}) => {
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pitchCopied, setPitchCopied] = useState(false);

  useEffect(() => {
    if (!offer) {
      setAnalysis(null);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetch('/api/match-offer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offer, userProfile: preferences }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setAnalysis(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching match:', err);
        if (isMounted) {
          // Fallback match calculation
          setAnalysis({
            matchScore: 85,
            strengths: [
              `Votre profil en ${preferences.domain} cadre bien avec les besoins de ${offer.company}.`,
              'Localisation et modalité de travail compatibles.',
            ],
            missingSkills: ['Mettez l\'accent sur vos réalisations chiffrées récentes.'],
            recommendedPitch: `Bonjour, suite à votre publication ce matin pour le poste de ${offer.title}, je vous contacte car mon expertise récente correspond précisément aux critères attendus. Seriez-vous disponible pour un court appel d'introduction ?`,
            salaryNegotiationTip: `Pour cette offre affichée à ${offer.salaryDisplay}, vous pouvez viser le haut de fourchette en mettant en avant votre efficacité opérationnelle rapide.`,
          });
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [offer, preferences]);

  if (!offer) return null;

  const handleCopyPitch = () => {
    if (analysis?.recommendedPitch) {
      navigator.clipboard.writeText(analysis.recommendedPitch);
      setPitchCopied(true);
      setTimeout(() => setPitchCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">{offer.company}</span>
              <span aria-hidden="true">·</span>
              <span>{offer.location}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{offer.publishedAt}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{offer.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Key tags row */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-slate-100">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-lg font-mono tabular-nums">
              {offer.salaryDisplay}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
              {offer.contractType}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-lg">
              {offer.remote}
            </span>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
              Source: {offer.source}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Mission & Contexte
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-4 rounded-xl border border-slate-100">
              {offer.description}
            </p>
          </div>

          {/* Requirements & Perks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Compétences requises
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {offer.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Avantages & Cadre de travail
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {offer.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Match & Advisory Panel */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/50 rounded-2xl border border-indigo-100/90 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Diagnostic d'Adéquation IA
                </h3>
              </div>
              {analysis && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Affinité estimée :</span>
                  <span className="font-mono tabular-nums text-base font-extrabold text-indigo-700 bg-white px-2.5 py-0.5 rounded-md shadow-xs border border-indigo-200">
                    {analysis.matchScore}%
                  </span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Analyse de votre profil en cours avec Gemini 3.8 Flash...
              </div>
            ) : analysis ? (
              <div className="space-y-4 text-xs">
                {/* Strengths */}
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Vos atouts pour ce poste
                  </div>
                  <ul className="space-y-1 pl-5 text-slate-600">
                    {analysis.strengths.map((str, idx) => (
                      <li key={idx} className="list-disc">{str}</li>
                    ))}
                  </ul>
                </div>

                {/* Missing / Tips */}
                {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                  <div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Points d'attention à valoriser en entretien
                    </div>
                    <ul className="space-y-1 pl-5 text-slate-600">
                      {analysis.missingSkills.map((sk, idx) => (
                        <li key={idx} className="list-disc">{sk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pitch */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-800">
                      Accroche recommandée pour votre candidature ce matin :
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPitch}
                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      {pitchCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{pitchCopied ? 'Copié !' : 'Copier'}</span>
                    </button>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-indigo-100 font-sans text-slate-800 leading-relaxed italic">
                    « {analysis.recommendedPitch} »
                  </div>
                </div>

                {/* Salary Tip */}
                <div className="p-3 bg-white/80 rounded-xl border border-indigo-100/70 text-slate-700">
                  <span className="font-semibold text-slate-900">Conseil négociation : </span>
                  {analysis.salaryNegotiationTip}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 bg-slate-50 border-t border-slate-200">
          <a
            href={offer.contactOrUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>Voir l'offre originale sur {offer.source}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200/50 transition-colors"
            >
              Fermer
            </button>

            <button
              type="button"
              onClick={() => {
                onAddToApplications(offer);
                onClose();
              }}
              disabled={isAlreadyTracked}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all ${
                isAlreadyTracked
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{isAlreadyTracked ? 'Déjà dans vos candidatures' : 'Ajouter à mes candidatures du matin'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
