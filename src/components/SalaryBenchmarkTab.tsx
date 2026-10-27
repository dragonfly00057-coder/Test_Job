import React, { useState } from 'react';
import { DollarSign, TrendingUp, Award, HelpCircle, Check, ArrowUpRight } from 'lucide-react';
import { DailyMarketBrief, UserPreferences } from '../types/jobMarket';

interface SalaryBenchmarkTabProps {
  brief: DailyMarketBrief;
  preferences: UserPreferences;
}

export const SalaryBenchmarkTab: React.FC<SalaryBenchmarkTabProps> = ({
  brief,
  preferences,
}) => {
  const [customSalary, setCustomSalary] = useState<number>(
    preferences.minSalaryTarget || brief.salaryBenchmark.median
  );

  // Estimations fiscales françaises moyennes pour statut Cadre
  const monthlyGross = Math.round((customSalary * 1000) / 12);
  const monthlyNetApprox = Math.round(monthlyGross * 0.77); // ~23% cotisations salariales cadre

  const salaryDeltaVsMedian = customSalary - brief.salaryBenchmark.median;
  const isAboveMedian = salaryDeltaVsMedian >= 0;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              Baromètre Régional & Négociation
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Grille Salariale en {brief.region}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Données de référence constatées sur le secteur {brief.domain} (profil {preferences.experienceLevel})
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-500">Salaire Médian Régional</div>
              <div className="text-2xl font-extrabold font-mono tabular-nums text-indigo-600">
                {brief.salaryBenchmark.median} <span className="text-sm font-normal text-slate-600">k€ brut/an</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <div className="text-xs text-slate-500">Fourchette constatée</div>
              <div className="text-sm font-bold font-mono tabular-nums text-slate-800">
                {brief.salaryBenchmark.min} - {brief.salaryBenchmark.max} k€
              </div>
            </div>
          </div>
        </div>

        {/* Visual Benchmark Slider Bar */}
        <div className="py-6">
          <div className="flex justify-between text-xs font-mono tabular-nums text-slate-500 mb-2">
            <span>Min marché : {brief.salaryBenchmark.min}k€</span>
            <span className="font-bold text-indigo-600">Médiane : {brief.salaryBenchmark.median}k€</span>
            <span>Max marché : {brief.salaryBenchmark.max}k€</span>
          </div>

          <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-indigo-700 rounded-full"
              style={{
                left: '10%',
                width: '80%',
              }}
            />
          </div>

          <p className="text-xs text-slate-600 mt-4 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="font-semibold text-slate-800">Tendance constatée ce matin : </span>
            {brief.salaryBenchmark.trendComment}
          </p>
        </div>
      </div>

      {/* Simulator & Negotiation Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Simulateur de Négociation & Rémunération Nette
          </h3>
          <p className="text-xs text-slate-500">
            Testez vos prétentions salariales pour évaluer votre compétitivité dans la région.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vos prétentions salariales annuelles (k€ brut)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={brief.salaryBenchmark.min - 5}
                max={brief.salaryBenchmark.max + 15}
                step={1}
                value={customSalary}
                onChange={(e) => setCustomSalary(parseInt(e.target.value, 10))}
                className="flex-1 accent-indigo-600"
              />
              <span className="font-mono tabular-nums font-bold text-base text-slate-900 px-3 py-1 bg-slate-100 rounded-lg min-w-[70px] text-center">
                {customSalary} k€
              </span>
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500">Brut mensuel estimé</div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                {monthlyGross.toLocaleString('fr-FR')} €
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Sur base 12 mois</div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
              <div className="text-xs text-indigo-700 font-medium">Net mensuel avant impôt</div>
              <div className="text-lg font-bold font-mono tabular-nums text-indigo-900">
                ~{monthlyNetApprox.toLocaleString('fr-FR')} €
              </div>
              <div className="text-[11px] text-indigo-600 mt-0.5">Statut cadre (~23% cotis.)</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
            <div className="font-semibold text-slate-900 mb-1">
              Positionnement par rapport au marché local :
            </div>
            {isAboveMedian ? (
              <p>
                Vous vous situez à <span className="font-bold text-indigo-600">+{salaryDeltaVsMedian} k€</span> au-dessus
                de la médiane en {brief.region}. Préparez des réalisations concrètes sur vos compétences spécialisées pour justifier cette fourchette.
              </p>
            ) : (
              <p>
                Vous êtes à <span className="font-bold text-slate-700">{Math.abs(salaryDeltaVsMedian)} k€</span> en deçà
                de la médiane. Vous disposez d'une marge de progression confortable lors des entretiens.
              </p>
            )}
          </div>
        </div>

        {/* Benefits & Negotiation tips for France */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Avantages & Packages en Région
          </h3>
          <p className="text-xs text-slate-500">
            Éléments périphériques fréquents à négocier en plus du fixe :
          </p>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Forfait Télétravail & Équipement :</strong> Prise en charge d'un écran, indemnité mensuelle de télétravail (10 à 30€/mois exonérés) et forfait mobilité durable (vélo/train jusqu'à 800€/an).
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Jours de RTT (35h à 39h) :</strong> Généralement 10 à 15 jours de repos supplémentaires par an pour les cadres au forfait jour.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Épargne Salariale (Intéressement / PEE) :</strong> Très répandu dans les ETI et grands groupes régionaux, représentant souvent 1 à 2 mois de salaire défiscalisé.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Tickets Restaurant & Mutuelle :</strong> Valeur faciale moyenne constatée entre 9,50€ et 12,00€ avec 60% prise en charge employeur.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
