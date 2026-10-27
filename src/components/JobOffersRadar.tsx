import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, MapPin, Building, Clock, ChevronRight, Bookmark, Check, Laptop, DollarSign } from 'lucide-react';
import { JobOffer, UserPreferences } from '../types/jobMarket';

interface JobOffersRadarProps {
  offers: JobOffer[];
  preferences: UserPreferences;
  onSelectOffer: (offer: JobOffer) => void;
  savedOfferIds: string[];
  onToggleSaveOffer: (offer: JobOffer) => void;
}

export const JobOffersRadar: React.FC<JobOffersRadarProps> = ({
  offers,
  preferences,
  onSelectOffer,
  savedOfferIds,
  onToggleSaveOffer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContract, setSelectedContract] = useState<string>('all');
  const [selectedRemote, setSelectedRemote] = useState<string>('all');
  const [onlyFreshToday, setOnlyFreshToday] = useState(false);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = offer.title.toLowerCase().includes(query);
        const matchesCompany = offer.company.toLowerCase().includes(query);
        const matchesDesc = offer.description.toLowerCase().includes(query);
        const matchesReq = offer.requirements.some((r) => r.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesReq) return false;
      }

      // Contract filter
      if (selectedContract !== 'all' && offer.contractType !== selectedContract) {
        return false;
      }

      // Remote filter
      if (selectedRemote !== 'all') {
        if (selectedRemote === 'Total' && offer.remote !== 'Total') return false;
        if (selectedRemote === 'Hybride' && offer.remote !== 'Hybride') return false;
        if (selectedRemote === 'Sur site' && offer.remote !== 'Sur site') return false;
      }

      // Fresh today filter
      if (onlyFreshToday && !offer.isFreshToday) {
        return false;
      }

      return true;
    });
  }, [offers, searchQuery, selectedContract, selectedRemote, onlyFreshToday]);

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une compétence, entreprise ou mot-clé..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedContract('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedContract === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous contrats
              </button>
              <button
                type="button"
                onClick={() => setSelectedContract('CDI')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedContract === 'CDI'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                CDI
              </button>
              <button
                type="button"
                onClick={() => setSelectedContract('Freelance')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedContract === 'Freelance'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Freelance
              </button>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedRemote('all')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedRemote === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tout lieu
              </button>
              <button
                type="button"
                onClick={() => setSelectedRemote('Hybride')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedRemote === 'Hybride'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hybride
              </button>
              <button
                type="button"
                onClick={() => setSelectedRemote('Total')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedRemote === 'Total'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                100% Remote
              </button>
            </div>

            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-lg text-xs font-medium text-slate-700 cursor-pointer select-none transition-colors">
              <input
                type="checkbox"
                checked={onlyFreshToday}
                onChange={(e) => setOnlyFreshToday(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Parues ce matin</span>
            </label>
          </div>
        </div>
      </div>

      {/* Offers Results List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            <strong className="font-mono tabular-nums text-slate-800">{filteredOffers.length}</strong> offres trouvées
          </span>
          <span>Triées par date de publication</span>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <h3 className="text-base font-bold text-slate-800 mb-1">Aucune offre trouvée</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Aucune offre ne correspond exactement à vos critères actuels. Essayez d'élargir les filtres.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedContract('all');
                setSelectedRemote('all');
                setOnlyFreshToday(false);
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredOffers.map((offer) => {
            const isSaved = savedOfferIds.includes(offer.id);
            return (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{offer.company}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {offer.location}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-700">{offer.contractType}</span>
                    <span aria-hidden="true">·</span>
                    <span>{offer.remote}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums text-slate-500">{offer.publishedAt}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                      onClick={() => onSelectOffer(offer)}>
                    {offer.title}
                  </h3>

                  {/* Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {offer.description}
                  </p>

                  {/* Requirements / Key tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {offer.requirements.slice(0, 3).map((req, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {req}
                      </span>
                    ))}
                    {offer.requirements.length > 3 && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        +{offer.requirements.length - 3} autres
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side: Salary & Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left md:text-right">
                    <div className="text-xs text-slate-400">Rémunération</div>
                    <div className="text-sm font-bold font-mono tabular-nums text-indigo-700">
                      {offer.salaryDisplay}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleSaveOffer(offer)}
                      className={`p-2 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isSaved ? 'Retirer des favoris' : 'Enregistrer pour ce matin'}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectOffer(offer)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyser le match</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
