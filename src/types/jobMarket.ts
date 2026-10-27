export type FrenchRegion = 
  | 'Île-de-France'
  | 'Auvergne-Rhône-Alpes'
  | 'Nouvelle-Aquitaine'
  | 'Occitanie'
  | 'Hauts-de-France'
  | 'Provence-Alpes-Côte d\'Azur'
  | 'Bretagne'
  | 'Pays de la Loire'
  | 'Grand Est'
  | 'Normandie'
  | 'Bourgogne-Franche-Comté'
  | 'Centre-Val de Loire'
  | 'Corse'
  | 'DROM-COM';

export type JobDomain =
  | 'Informatique & Tech'
  | 'Ingénierie & Industrie'
  | 'Santé & Médico-social'
  | 'Finance, Comptabilité & Audit'
  | 'Marketing, Communication & Vente'
  | 'Ressources Humaines & Recrutement'
  | 'Transition Écologique & Énergie'
  | 'Logistique, Transport & Supply Chain'
  | 'Juridique & Conformité'
  | 'BTP & Construction'
  | 'Hôtellerie & Restauration';

export type ExperienceLevel = 'Junior (0-2 ans)' | 'Intermédiaire (3-5 ans)' | 'Senior (6-10 ans)' | 'Lead / Direction (10+ ans)';

export type RemotePreference = 'Tous' | 'Télétravail total' | 'Hybride (2-3j/semaine)' | 'Présentiel';

export interface UserPreferences {
  region: FrenchRegion;
  department?: string;
  domain: JobDomain;
  jobTitle: string;
  experienceLevel: ExperienceLevel;
  remotePreference: RemotePreference;
  morningTime: string; // e.g. "07:30"
  minSalaryTarget?: number; // k€
  notificationEnabled: boolean;
  userSkills: string[];
}

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  department: string;
  region: FrenchRegion;
  domain: JobDomain;
  contractType: 'CDI' | 'CDD' | 'Freelance' | 'Alternance';
  remote: 'Total' | 'Hybride' | 'Sur site';
  salaryMin?: number;
  salaryMax?: number;
  salaryDisplay: string;
  publishedAt: string; // ISO date string or "Il y a 2h"
  isFreshToday: boolean;
  description: string;
  requirements: string[];
  perks: string[];
  source: 'France Travail' | 'Apec' | 'LinkedIn' | 'Welcome to the Jungle' | 'Entreprise Direct';
  contactOrUrl: string;
}

export interface EmergingSkill {
  name: string;
  category: 'Technique' | 'Méthodologie' | 'Soft skill' | 'Outil';
  demandLevel: 'Très forte' | 'Forte' | 'En croissance';
  growthPercentage: string;
  context: string;
}

export interface HiringCompany {
  name: string;
  city: string;
  domain: string;
  openPositionsCount: number;
  highlight: string;
}

export interface DailyMarketBrief {
  date: string;
  region: FrenchRegion;
  domain: JobDomain;
  jobTitleTarget: string;
  executiveSummary: string[];
  marketTensionLabel: 'Marché très dynamique (Pénurie de profils)' | 'Marché équilibré' | 'Marché sélectif (Forte concurrence)';
  marketTensionScore: number; // 0 to 100
  freshOffersCount: number;
  weekVariationRate: string;
  salaryBenchmark: {
    min: number;
    median: number;
    max: number;
    currency: string;
    trendComment: string;
  };
  emergingSkills: EmergingSkill[];
  topRecruiters: HiringCompany[];
  morningAdvice: string;
  economicContext: string;
  voiceScript: string;
}

export interface ApplicationTrackerItem {
  id: string;
  offerId: string;
  offerTitle: string;
  company: string;
  dateAdded: string;
  status: 'À postuler' | 'Postulé ce matin' | 'Entretien obtenu' | 'Refusé' | 'Offre reçue';
  notes: string;
}
