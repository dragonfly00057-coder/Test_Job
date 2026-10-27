/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { MorningBriefSection } from './components/MorningBriefSection';
import { SkillsAndRecruiters } from './components/SkillsAndRecruiters';
import { JobOffersRadar } from './components/JobOffersRadar';
import { JobDetailModal } from './components/JobDetailModal';
import { SalaryBenchmarkTab } from './components/SalaryBenchmarkTab';
import { ApplicationsTracker } from './components/ApplicationsTracker';
import { PreferencesModal } from './components/PreferencesModal';
import {
  UserPreferences,
  DailyMarketBrief,
  JobOffer,
  ApplicationTrackerItem,
} from './types/jobMarket';
import { generateDefaultBrief, SAMPLE_OFFERS } from './data/regionalJobData';
import { MapPin, Briefcase, SlidersHorizontal, Sun, Clock } from 'lucide-react';

const STORAGE_PREFS_KEY = 'matinal_job_preferences_v1';
const STORAGE_APPS_KEY = 'matinal_job_applications_v1';
const STORAGE_SAVED_KEY = 'matinal_job_saved_ids_v1';

const DEFAULT_PREFERENCES: UserPreferences = {
  region: 'Auvergne-Rhône-Alpes',
  domain: 'Informatique & Tech',
  jobTitle: 'Développeur Fullstack',
  experienceLevel: 'Intermédiaire (3-5 ans)',
  remotePreference: 'Hybride (2-3j/semaine)',
  morningTime: '07:30',
  minSalaryTarget: 50,
  notificationEnabled: true,
  userSkills: ['React / TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'API REST'],
};

export default function App() {
  // 1. User preferences with LocalStorage persistence
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // 2. Active Tab
  const [activeTab, setActiveTab] = useState<'brief' | 'offers' | 'salary' | 'applications'>('brief');

  // 3. Modals and drawers
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [selectedOfferForModal, setSelectedOfferForModal] = useState<JobOffer | null>(null);

  // 4. Briefing & Offers data
  const [brief, setBrief] = useState<DailyMarketBrief>(() =>
    generateDefaultBrief(preferences.region, preferences.domain, preferences.jobTitle)
  );
  const [offers, setOffers] = useState<JobOffer[]>(SAMPLE_OFFERS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 5. Saved & Applied tracking
  const [savedOfferIds, setSavedOfferIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [applications, setApplications] = useState<ApplicationTrackerItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_APPS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'app-init-1',
        offerId: 'job-ara-01',
        offerTitle: 'Développeur Fullstack React / Node.js (H/F)',
        company: 'Lumio Analytics (GreenTech)',
        dateAdded: 'Ce matin, 07:45',
        status: 'Postulé ce matin',
        notes: 'Candidature envoyée avec le message d\'accroche IA.',
      },
    ];
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn('Could not save preferences', e);
    }
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedOfferIds));
    } catch (e) {
      console.warn('Could not save savedOfferIds', e);
    }
  }, [savedOfferIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_APPS_KEY, JSON.stringify(applications));
    } catch (e) {
      console.warn('Could not save applications', e);
    }
  }, [applications]);

  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() =>
    new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  );

  // Fetch or refresh daily brief from Gemini API
  const fetchMarketData = useCallback(
    async (prefs: UserPreferences) => {
      setIsRefreshing(true);
      try {
        const response = await fetch('/api/market-brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prefs),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.brief) {
            setBrief(data.brief);
          }
          if (data?.offers && data.offers.length > 0) {
            setOffers(data.offers);
          }
          if (data?.refreshedAt) {
            setLastUpdatedTime(data.refreshedAt);
          } else {
            setLastUpdatedTime(
              new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            );
          }
        }
      } catch (err) {
        console.error('Error fetching brief from server, using local fallback:', err);
        setBrief(generateDefaultBrief(prefs.region, prefs.domain, prefs.jobTitle));
        setLastUpdatedTime(
          new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        );
      } finally {
        setIsRefreshing(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    fetchMarketData(preferences);
  }, []);

  const handleSavePreferences = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    fetchMarketData(newPrefs);
  };

  const handleToggleSaveOffer = (offer: JobOffer) => {
    setSavedOfferIds((prev) =>
      prev.includes(offer.id) ? prev.filter((id) => id !== offer.id) : [...prev, offer.id]
    );
  };

  const handleAddToApplications = (offer: JobOffer) => {
    if (applications.some((a) => a.offerId === offer.id)) return;
    const newItem: ApplicationTrackerItem = {
      id: `app-${Date.now()}`,
      offerId: offer.id,
      offerTitle: offer.title,
      company: offer.company,
      dateAdded: `Aujourd'hui, ${new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      status: 'À postuler',
      notes: `Fourchette : ${offer.salaryDisplay} | Contrat : ${offer.contractType}`,
    };
    setApplications((prev) => [newItem, ...prev]);
  };

  const handleUpdateAppStatus = (id: string, newStatus: ApplicationTrackerItem['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const handleUpdateAppNotes = (id: string, notes: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, notes } : app))
    );
  };

  const handleRemoveApp = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const handleAddManualApp = (title: string, company: string) => {
    const newItem: ApplicationTrackerItem = {
      id: `app-manual-${Date.now()}`,
      offerId: `manual-${Date.now()}`,
      offerTitle: title,
      company,
      dateAdded: `Aujourd'hui, ${new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      status: 'À postuler',
      notes: 'Ajout manuel',
    };
    setApplications((prev) => [newItem, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Navigation */}
      <Navbar
        preferences={preferences}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onRefresh={() => fetchMarketData(preferences)}
        isRefreshing={isRefreshing}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Profile & Routine Quick Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {/* User profile avatar & current focus */}
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/avatar_user_morning_1793106913725.jpg"
                alt="Portrait profil veille emploi"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
              />
              <div>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Votre veille quotidienne du marché</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-700">{preferences.region}</span>
                  <span aria-hidden="true">·</span>
                  <span>{preferences.jobTitle}</span>
                  <span aria-hidden="true">·</span>
                  <span>{preferences.experienceLevel}</span>
                </div>
              </div>
            </div>

            {/* Morning time reminder & edit */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-mono text-[11px] tabular-nums">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Briefing quotidien programmé : {preferences.morningTime}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPreferencesOpen(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'brief' && (
          <div className="space-y-8">
            <MorningBriefSection
              brief={brief}
              preferences={preferences}
              isRefreshing={isRefreshing}
              lastUpdatedTime={lastUpdatedTime}
              onOpenPreferences={() => setIsPreferencesOpen(true)}
              onExploreOffers={() => setActiveTab('offers')}
            />
            <SkillsAndRecruiters
              skills={brief.emergingSkills}
              recruiters={brief.topRecruiters}
              regionName={preferences.region}
            />
          </div>
        )}

        {activeTab === 'offers' && (
          <JobOffersRadar
            offers={offers}
            preferences={preferences}
            onSelectOffer={(offer) => setSelectedOfferForModal(offer)}
            savedOfferIds={savedOfferIds}
            onToggleSaveOffer={handleToggleSaveOffer}
          />
        )}

        {activeTab === 'salary' && (
          <SalaryBenchmarkTab brief={brief} preferences={preferences} />
        )}

        {activeTab === 'applications' && (
          <ApplicationsTracker
            applications={applications}
            onUpdateStatus={handleUpdateAppStatus}
            onUpdateNotes={handleUpdateAppNotes}
            onRemove={handleRemoveApp}
            onAddManual={handleAddManualApp}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">MatinalJob</span>
              <span aria-hidden="true">·</span>
              <span>Observatoire Quotidien du Marché de l'Emploi Régional</span>
            </div>
            <div>
              <span>Données consolidées & analyses générées avec Google Gemini</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSave={handleSavePreferences}
      />

      {/* Offer Detail / AI Match Modal */}
      <JobDetailModal
        offer={selectedOfferForModal}
        preferences={preferences}
        onClose={() => setSelectedOfferForModal(null)}
        onAddToApplications={handleAddToApplications}
        isAlreadyTracked={
          selectedOfferForModal
            ? applications.some((a) => a.offerId === selectedOfferForModal.id)
            : false
        }
      />
    </div>
  );
}
