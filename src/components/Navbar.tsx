import React from 'react';
import { Sparkles, Bell, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { UserPreferences } from '../types/jobMarket';

interface NavbarProps {
  preferences: UserPreferences;
  onOpenPreferences: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeTab: 'brief' | 'offers' | 'salary' | 'applications';
  onSelectTab: (tab: 'brief' | 'offers' | 'salary' | 'applications') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  preferences,
  onOpenPreferences,
  onRefresh,
  isRefreshing,
  activeTab,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectTab('brief');
              }}
              className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap hover:text-indigo-600 transition-colors"
            >
              Matinal<span className="text-indigo-600">Job</span>
            </a>
            <span className="hidden sm:inline-block text-xs text-slate-400">·</span>
            <span className="hidden sm:inline-block text-xs font-medium text-slate-500 whitespace-nowrap">
              Radar de l'Emploi Régional
            </span>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSelectTab('brief')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'brief'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Briefing du Jour
            </button>
            <button
              onClick={() => onSelectTab('offers')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'offers'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Radar des Offres
            </button>
            <button
              onClick={() => onSelectTab('salary')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'salary'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Baromètre Salarial
            </button>
            <button
              onClick={() => onSelectTab('applications')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap py-1 border-b-2 ${
                activeTab === 'applications'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent'
              }`}
            >
              Mes Candidatures
            </button>
          </nav>

          {/* Zone 3: 1 primary action + configuration trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenPreferences}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              title="Modifier ma région et mon domaine"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">{preferences.region}</span>
              <span className="text-slate-400">·</span>
              <span className="max-w-[120px] truncate">{preferences.domain.split('&')[0]}</span>
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-70 rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Analyse...' : 'Actualiser le marché'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
