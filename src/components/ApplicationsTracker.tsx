import React, { useState } from 'react';
import { BookmarkCheck, Plus, Trash2, Calendar, FileText, CheckCircle, Clock, Send, Download } from 'lucide-react';
import { ApplicationTrackerItem } from '../types/jobMarket';

interface ApplicationsTrackerProps {
  applications: ApplicationTrackerItem[];
  onUpdateStatus: (id: string, newStatus: ApplicationTrackerItem['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onRemove: (id: string) => void;
  onAddManual: (title: string, company: string) => void;
}

export const ApplicationsTracker: React.FC<ApplicationsTrackerProps> = ({
  applications,
  onUpdateStatus,
  onUpdateNotes,
  onRemove,
  onAddManual,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newCompany.trim()) {
      onAddManual(newTitle.trim(), newCompany.trim());
      setNewTitle('');
      setNewCompany('');
      setShowAddForm(false);
    }
  };

  const handleExportCSV = () => {
    const headers = 'ID,Poste,Entreprise,Date,Statut,Notes\n';
    const rows = applications
      .map(
        (app) =>
          `"${app.id}","${app.offerTitle}","${app.company}","${app.dateAdded}","${app.status}","${(app.notes || '').replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mes_candidatures_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const countSent = applications.filter((a) => a.status === 'Postulé ce matin').length;
  const countInterview = applications.filter((a) => a.status === 'Entretien obtenu').length;

  return (
    <div className="space-y-6">
      {/* Top Bar with KPI */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Mes Candidatures & Veille Active
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Suivi de vos envois matinaux et gestion des relances
            </p>
          </div>

          <div className="flex items-center gap-2">
            {applications.length > 0 && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                title="Télécharger l'historique en CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporter CSV</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une candidature</span>
            </button>
          </div>
        </div>

        {/* Quick KPI count */}
        <div className="grid grid-cols-3 gap-4 pt-6">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">Total suivi</div>
            <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
              {applications.length}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">Postulées ce matin</div>
            <div className="text-xl font-bold font-mono tabular-nums text-indigo-600">
              {countSent}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500">Entretiens décrochés</div>
            <div className="text-xl font-bold font-mono tabular-nums text-emerald-600">
              {countInterview}
            </div>
          </div>
        </div>
      </div>

      {/* Optional Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl border border-indigo-200 p-5 shadow-sm space-y-4"
        >
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Ajouter manuellement une opportunité
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Titre du poste
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Responsable RSE & Climat"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Entreprise
              </label>
              <input
                type="text"
                required
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Ex: Michelin / Schneider Electric"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <BookmarkCheck className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">
            Aucune candidature enregistrée pour le moment
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Consultez le radar des offres matinales et cliquez sur « Ajouter à mes candidatures » pour organiser vos démarches.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-700">{app.company}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{app.dateAdded}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{app.offerTitle}</h4>
                <div className="mt-2">
                  <input
                    type="text"
                    value={app.notes || ''}
                    onChange={(e) => onUpdateNotes(app.id, e.target.value)}
                    placeholder="Ajouter une note (contact RH, date de relance...)"
                    className="w-full text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Status & Delete */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={app.status}
                  onChange={(e) =>
                    onUpdateStatus(app.id, e.target.value as ApplicationTrackerItem['status'])
                  }
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none ${
                    app.status === 'Postulé ce matin'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : app.status === 'Entretien obtenu'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : app.status === 'Refusé'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <option value="À postuler">À postuler</option>
                  <option value="Postulé ce matin">Postulé ce matin</option>
                  <option value="Entretien obtenu">Entretien obtenu</option>
                  <option value="Refusé">Refusé</option>
                  <option value="Offre reçue">Offre reçue</option>
                </select>

                <button
                  type="button"
                  onClick={() => onRemove(app.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
