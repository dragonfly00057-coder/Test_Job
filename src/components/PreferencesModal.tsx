import React, { useState } from 'react';
import { X, MapPin, Briefcase, Clock, Award, Laptop, Check } from 'lucide-react';
import { UserPreferences, FrenchRegion, JobDomain, ExperienceLevel, RemotePreference } from '../types/jobMarket';
import { REGIONS_LIST, DOMAINS_LIST } from '../data/regionalJobData';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (newPreferences: UserPreferences) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
}) => {
  if (!isOpen) return null;

  const [formState, setFormState] = useState<UserPreferences>({ ...preferences });
  const [newSkill, setNewSkill] = useState('');

  const selectedRegionInfo = REGIONS_LIST.find((r) => r.id === formState.region);
  const selectedDomainInfo = DOMAINS_LIST.find((d) => d.id === formState.domain);

  const handleDomainChange = (domain: JobDomain) => {
    const domainDef = DOMAINS_LIST.find((d) => d.id === domain);
    setFormState((prev) => ({
      ...prev,
      domain,
      jobTitle: domainDef ? domainDef.defaultJob : prev.jobTitle,
      userSkills: domainDef ? domainDef.keySkills.slice(0, 4) : prev.userSkills,
    }));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !formState.userSkills.includes(newSkill.trim())) {
      setFormState((prev) => ({
        ...prev,
        userSkills: [...prev.userSkills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormState((prev) => ({
      ...prev,
      userSkills: prev.userSkills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSave = () => {
    onSave(formState);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Paramètres de votre Veille Matinale
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personnalisez l'analyse quotidienne selon votre localisation et métier
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Région */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              1. Région ciblée en France
            </label>
            <select
              value={formState.region}
              onChange={(e) => setFormState({ ...formState, region: e.target.value as FrenchRegion })}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {REGIONS_LIST.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
            {selectedRegionInfo && (
              <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700">Pôles économiques majeurs : </span>
                {selectedRegionInfo.hubs.join(' · ')}
                <div className="mt-1 text-slate-600">
                  <span className="font-semibold text-slate-700">Points forts : </span>
                  {selectedRegionInfo.economicFocus}
                </div>
              </div>
            )}
          </div>

          {/* Domaine & Métier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                2. Domaine d'emploi
              </label>
              <select
                value={formState.domain}
                onChange={(e) => handleDomainChange(e.target.value as JobDomain)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {DOMAINS_LIST.map((dom) => (
                  <option key={dom.id} value={dom.id}>
                    {dom.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Intitulé de poste ciblé
              </label>
              <input
                type="text"
                value={formState.jobTitle}
                onChange={(e) => setFormState({ ...formState, jobTitle: e.target.value })}
                placeholder="Ex: Développeur Fullstack React"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Séniorité & Télétravail */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Niveau d'expérience
              </label>
              <select
                value={formState.experienceLevel}
                onChange={(e) =>
                  setFormState({ ...formState, experienceLevel: e.target.value as ExperienceLevel })
                }
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Junior (0-2 ans)">Junior (0-2 ans)</option>
                <option value="Intermédiaire (3-5 ans)">Intermédiaire (3-5 ans)</option>
                <option value="Senior (6-10 ans)">Senior (6-10 ans)</option>
                <option value="Lead / Direction (10+ ans)">Lead / Direction (10+ ans)</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <Laptop className="w-4 h-4 text-indigo-600" />
                Modalité de télétravail
              </label>
              <select
                value={formState.remotePreference}
                onChange={(e) =>
                  setFormState({ ...formState, remotePreference: e.target.value as RemotePreference })
                }
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Tous">Tous modes acceptés</option>
                <option value="Hybride (2-3j/semaine)">Hybride (2-3 jours remote)</option>
                <option value="Télétravail total">100% Télétravail (Full remote)</option>
                <option value="Présentiel">Sur site prioritaire</option>
              </select>
            </div>
          </div>

          {/* Heure de briefing matinal & Compétences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Heure idéale de votre briefing matinal
              </label>
              <input
                type="time"
                value={formState.morningTime}
                onChange={(e) => setFormState({ ...formState, morningTime: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Le marché de la nuit est analysé et compilé dès cette heure.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Objectif salarial brut (optionnel, en k€)
              </label>
              <input
                type="number"
                value={formState.minSalaryTarget || ''}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    minSalaryTarget: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  })
                }
                placeholder="Ex: 50"
                min="20"
                max="250"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Compétences clés du profil */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Vos compétences clés (utilisées pour le calcul d'affinité avec les offres)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formState.userSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-medium border border-slate-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Ajouter une compétence (ex: Docker, Anglais C1, Lean...)"
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Ajouter
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Check className="w-4 h-4" />
            Enregistrer & Actualiser
          </button>
        </div>
      </div>
    </div>
  );
};
