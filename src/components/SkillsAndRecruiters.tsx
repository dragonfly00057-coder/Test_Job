import React from 'react';
import { TrendingUp, Building2, Flame, MapPin } from 'lucide-react';
import { EmergingSkill, HiringCompany } from '../types/jobMarket';

interface SkillsAndRecruitersProps {
  skills: EmergingSkill[];
  recruiters: HiringCompany[];
  regionName: string;
}

export const SkillsAndRecruiters: React.FC<SkillsAndRecruitersProps> = ({
  skills,
  recruiters,
  regionName,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Compétences en forte hausse */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Compétences en Forte Demande
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Mots-clés et expertises qui surperforment dans les offres de {regionName}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-900">{skill.name}</span>
                <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded tabular-nums">
                  {skill.growthPercentage}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="font-medium text-slate-600">{skill.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">{skill.demandLevel}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {skill.context}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Top Entreprises qui recrutent */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Recruteurs Régionaux Actifs Ce Matin
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Entreprises ayant ouvert des postes récemment en {regionName}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {recruiters.map((recruiter, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-900">{recruiter.name}</span>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono tabular-nums">
                  {recruiter.openPositionsCount} postes
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {recruiter.city}
                </span>
                <span aria-hidden="true">·</span>
                <span>{recruiter.domain}</span>
              </div>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {recruiter.highlight}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
