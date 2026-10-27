import { FrenchRegion, JobDomain, JobOffer, DailyMarketBrief } from '../types/jobMarket';

export const REGIONS_LIST: { id: FrenchRegion; name: string; hubs: string[]; economicFocus: string }[] = [
  {
    id: 'Île-de-France',
    name: 'Île-de-France',
    hubs: ['Paris', 'La Défense', 'Saclay', 'Boulogne-Billancourt', 'Saint-Denis'],
    economicFocus: 'Sièges sociaux, FinTech, IA, Conseil, Luxe, Recherche de pointe'
  },
  {
    id: 'Auvergne-Rhône-Alpes',
    name: 'Auvergne-Rhône-Alpes',
    hubs: ['Lyon', 'Grenoble', 'Clermont-Ferrand', 'Annecy', 'Saint-Étienne'],
    economicFocus: 'Semiconducteurs, Biotech/Santé, Industrie 4.0, Énergie, Chimie'
  },
  {
    id: 'Nouvelle-Aquitaine',
    name: 'Nouvelle-Aquitaine',
    hubs: ['Bordeaux', 'Pau', 'Poitiers', 'La Rochelle', 'Limoges'],
    economicFocus: 'Aéronautique/Défense, Vins & Spiritueux, Énergies renouvelables, E-santé'
  },
  {
    id: 'Occitanie',
    name: 'Occitanie',
    hubs: ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan', 'Tarbes'],
    economicFocus: 'Aérospatial, MedTech, Agro-écologie, Numérique & Cybersécurité'
  },
  {
    id: 'Hauts-de-France',
    name: 'Hauts-de-France',
    hubs: ['Lille', 'Valenciennes', 'Amiens', 'Dunkerque', 'Arras'],
    economicFocus: 'Batteries électriques (Gigafactories), RetailTech, Agroalimentaire, Logistique'
  },
  {
    id: 'Provence-Alpes-Côte d\'Azur',
    name: 'Provence-Alpes-Côte d\'Azur',
    hubs: ['Marseille', 'Nice', 'Sophia Antipolis', 'Aix-en-Provence', 'Toulon'],
    economicFocus: 'Télécoms, Microélectronique, Spatial, Économie maritime, Tourisme'
  },
  {
    id: 'Bretagne',
    name: 'Bretagne',
    hubs: ['Rennes', 'Brest', 'Lorient', 'Vannes', 'Saint-Brieuc'],
    economicFocus: 'Cybersécurité, Agroalimentaire de pointe, Télécoms, Énergies marines'
  },
  {
    id: 'Pays de la Loire',
    name: 'Pays de la Loire',
    hubs: ['Nantes', 'Angers', 'Le Mans', 'Saint-Nazaire', 'Cholet'],
    economicFocus: 'Construction navale, Électronique IoT, Numérique, Énergie offshore'
  },
  {
    id: 'Grand Est',
    name: 'Grand Est',
    hubs: ['Strasbourg', 'Metz', 'Nancy', 'Reims', 'Mulhouse'],
    economicFocus: 'Institutions européennes, Pharmacie, Industrie métallurgique, Matériaux'
  },
  {
    id: 'Normandie',
    name: 'Normandie',
    hubs: ['Rouen', 'Caen', 'Le Havre', 'Cherbourg'],
    economicFocus: 'Pétrochimie bas carbone, Énergie nucléaire & éolien, Logistique portuaire'
  },
  {
    id: 'Bourgogne-Franche-Comté',
    name: 'Bourgogne-Franche-Comté',
    hubs: ['Dijon', 'Besançon', 'Belfort', 'Chalon-sur-Saône'],
    economicFocus: 'Microtechniques, Horlogerie industrielle, Hydrogène, Santé'
  },
  {
    id: 'Centre-Val de Loire',
    name: 'Centre-Val de Loire',
    hubs: ['Orléans', 'Tours', 'Chartres', 'Bourges'],
    economicFocus: 'Cosmetic Valley, Pharmacie, Logistique centrale, Équipements'
  },
  {
    id: 'Corse',
    name: 'Corse',
    hubs: ['Ajaccio', 'Bastia', 'Porto-Vecchio'],
    economicFocus: 'Agroalimentaire local, Éco-tourisme, Services aux collectivités'
  },
  {
    id: 'DROM-COM',
    name: 'DROM-COM (Guadeloupe, Martinique, Réunion, etc.)',
    hubs: ['Saint-Denis (Réunion)', 'Pointe-à-Pitre', 'Fort-de-France', 'Cayenne'],
    economicFocus: 'Énergies insulaires, Biodiversité, BTP résilient, Services de santé'
  }
];

export const DOMAINS_LIST: { id: JobDomain; label: string; defaultJob: string; keySkills: string[] }[] = [
  {
    id: 'Informatique & Tech',
    label: 'Informatique, Cloud & Data',
    defaultJob: 'Développeur Fullstack',
    keySkills: ['React / TypeScript', 'Python', 'Cloud AWS/GCP', 'Docker/K8s', 'IA & LLM integration', 'Cybersécurité', 'PostgreSQL']
  },
  {
    id: 'Ingénierie & Industrie',
    label: 'Ingénierie & Industrie 4.0',
    defaultJob: 'Ingénieur Systèmes Embarqués',
    keySkills: ['Modélisation CAO/CATIA', 'Automatisme PLC', 'Gestion de production Lean', 'Mécatronique', 'Normes ISO 9001/14001', 'IoT Industriel']
  },
  {
    id: 'Santé & Médico-social',
    label: 'Santé, Médical & BioTech',
    defaultJob: 'Infirmier Coordinateur',
    keySkills: ['Coordination de soins', 'Protocoles cliniques', 'Dossier Patient Informatisé', 'Management d\'équipe soignante', 'Assurance Qualité Pharma']
  },
  {
    id: 'Finance, Comptabilité & Audit',
    label: 'Finance, Audit & Contrôle de gestion',
    defaultJob: 'Contrôleur de Gestion',
    keySkills: ['PowerBI / DAX', 'Modélisation financière', 'Normes IFRS', 'SAP / ERP', 'Audit budgétaire', 'Fiscalité d\'entreprise']
  },
  {
    id: 'Marketing, Communication & Vente',
    label: 'Marketing Digital & Business Development',
    defaultJob: 'Responsable Marketing Digital',
    keySkills: ['Growth Hacking', 'SEO/SEA data-driven', 'CRM Hubspot/Salesforce', 'Copywriting & Content', 'Négociation B2B Grands Comptes']
  },
  {
    id: 'Ressources Humaines & Recrutement',
    label: 'Ressources Humaines & RSE',
    defaultJob: 'Talent Acquisition Specialist',
    keySkills: ['Sourcing technique', 'Marque employeur', 'Droit social français', 'SIRH Workday', 'Plan de développement des compétences']
  },
  {
    id: 'Transition Écologique & Énergie',
    label: 'Énergie, Décarbonation & RSE',
    defaultJob: 'Chef de Projet Énergies Renouvelables',
    keySkills: ['Bilan Carbone (Méthode ADEME)', 'Développement PV / Éolien', 'Audit énergétique tertiaire', 'CSRD & Reporting extra-financier']
  },
  {
    id: 'Logistique, Transport & Supply Chain',
    label: 'Supply Chain & Logistique',
    defaultJob: 'Responsable Supply Chain',
    keySkills: ['Optimisation de flux WMS/TMS', 'Planification S&OP', 'Gestion des stocks juste-à-temps', 'Douane & transport international']
  },
  {
    id: 'Juridique & Conformité',
    label: 'Juridique, Droit des Affaires & Compliance',
    defaultJob: 'Juriste Droit des Affaires & RGPD',
    keySkills: ['Contrats commerciaux internationaux', 'Conformité RGPD & AI Act', 'Contentieux', 'Gouvernance d\'entreprise']
  },
  {
    id: 'BTP & Construction',
    label: 'BTP, Architecture & Travaux',
    defaultJob: 'Conducteur de Travaux Principal',
    keySkills: ['Suivi de chantier TCE', 'Management sous-traitants', 'BIM / Revit', 'Réglementation RE2020', 'Sécurité SPS']
  },
  {
    id: 'Hôtellerie & Restauration',
    label: 'Hôtellerie, Restauration & Événementiel',
    defaultJob: 'Directeur d\'Exploitation Hôtelière',
    keySkills: ['Yield Management', 'Normes HACCP', 'Expérience client premium', 'Gestion des plannings équipes', 'P&L Restauration']
  }
];

export const SAMPLE_OFFERS: JobOffer[] = [
  // Auvergne-Rhône-Alpes Tech
  {
    id: 'job-ara-01',
    title: 'Développeur Fullstack React / Node.js (H/F)',
    company: 'Lumio Analytics (GreenTech)',
    location: 'Lyon (Part-Dieu)',
    department: 'Rhône (69)',
    region: 'Auvergne-Rhône-Alpes',
    domain: 'Informatique & Tech',
    contractType: 'CDI',
    remote: 'Hybride',
    salaryMin: 45,
    salaryMax: 55,
    salaryDisplay: '45k€ - 55k€',
    publishedAt: 'Aujourd\'hui, 06:45',
    isFreshToday: true,
    description: 'Au sein d\'une équipe produit de 8 ingénieurs, vous concevez la nouvelle plateforme SaaS d\'optimisation énergétique pour les collectivités territoriales.',
    requirements: ['3+ ans d\'expérience React & TypeScript', 'Maîtrise de Node.js / Express ou Fastify', 'Expérience pratique Docker et CI/CD GitHub Actions', 'Sensibilité aux enjeux d\'éco-conception logicielle'],
    perks: ['2 jours de télétravail/semaine', 'Carte ticket restaurant Swile 11€', 'Prime de participation aux bénéfices', 'Forfait mobilités durables (vélo/train)'],
    source: 'Apec',
    contactOrUrl: 'https://apec.fr'
  },
  {
    id: 'job-ara-02',
    title: 'Ingénieur Data & MLOps',
    company: 'BioSens Grenoble Labs',
    location: 'Grenoble (Presqu\'île Scientifique)',
    department: 'Isère (38)',
    region: 'Auvergne-Rhône-Alpes',
    domain: 'Informatique & Tech',
    contractType: 'CDI',
    remote: 'Hybride',
    salaryMin: 50,
    salaryMax: 62,
    salaryDisplay: '50k€ - 62k€',
    publishedAt: 'Aujourd\'hui, 05:20',
    isFreshToday: true,
    description: 'Industrialisation de pipelines de modèles prédictifs appliqués aux diagnostics médicaux précoces. Environnement cloud hybride AWS / On-Premise GPU.',
    requirements: ['Python avancé', 'K8s, Kubeflow ou MLflow', 'Bases solides en architecture de données distribuées', 'Anglais technique courant'],
    perks: ['RTT (12 jours/an)', 'Mutuelle prise en charge à 85%', 'Accès direct Tram B'],
    source: 'France Travail',
    contactOrUrl: 'https://francetravail.fr'
  },
  {
    id: 'job-ara-03',
    title: 'Lead Architecte Cloud & Sécurité',
    company: 'Groupe Siprel Industrie',
    location: 'Clermont-Ferrand',
    department: 'Puy-de-Dôme (63)',
    region: 'Auvergne-Rhône-Alpes',
    domain: 'Informatique & Tech',
    contractType: 'CDI',
    remote: 'Hybride',
    salaryMin: 65,
    salaryMax: 78,
    salaryDisplay: '65k€ - 78k€',
    publishedAt: 'Hier, 18:30',
    isFreshToday: false,
    description: 'Pilotage de la migration vers une infrastructure souveraine et sécurisée pour 12 sites industriels européens.',
    requirements: ['Expertise Terraform / Ansible', 'Certification AWS ou Azure Solutions Architect', 'Expérience audits de sécurité ISO 27001'],
    perks: ['Voiture de fonction hybride', 'Télétravail 2 jours/semaine', 'Intéressement attractif'],
    source: 'LinkedIn',
    contactOrUrl: 'https://siprel.fr'
  },
  // Île-de-France Tech
  {
    id: 'job-idf-01',
    title: 'Ingénieur IA Générative & Agents LLM',
    company: 'CognitiveScale Paris',
    location: 'Paris (Sentier - 2e)',
    department: 'Paris (75)',
    region: 'Île-de-France',
    domain: 'Informatique & Tech',
    contractType: 'CDI',
    remote: 'Hybride',
    salaryMin: 60,
    salaryMax: 75,
    salaryDisplay: '60k€ - 75k€',
    publishedAt: 'Aujourd\'hui, 07:10',
    isFreshToday: true,
    description: 'Conception de copilotes métiers B2B intégrant RAG multimodal, fine-tuning et orchestration d\'agents autonomes pour les grands comptes bancaires.',
    requirements: ['Maîtrise Python & frameworks agents (LangChain/LlamaIndex)', 'Connaissance approfondie de Gemini / modèles modernes', 'API REST & vector databases (Qdrant/Pinecone)'],
    perks: ['Bureaux au cœur de Paris avec terrasse', 'Budget équipement 2500€', 'Pass Navigo 100% remboursé'],
    source: 'Welcome to the Jungle',
    contactOrUrl: 'https://welcometothejungle.com'
  },
  {
    id: 'job-idf-02',
    title: 'Product Manager Senior - Plateforme FinTech',
    company: 'Kyros Payment Solutions',
    location: 'La Défense',
    department: 'Hauts-de-Seine (92)',
    region: 'Île-de-France',
    domain: 'Informatique & Tech',
    contractType: 'CDI',
    remote: 'Hybride',
    salaryMin: 65,
    salaryMax: 80,
    salaryDisplay: '65k€ - 80k€',
    publishedAt: 'Aujourd\'hui, 06:15',
    isFreshToday: true,
    description: 'Responsable de la roadmap des flux de paiement instantané européen (SEPA Instant & Open Banking). Coordination transverse tech/sales/conformité.',
    requirements: ['5+ ans en Product Management B2B', 'Excellente compréhension des régulations DSP2/DSP3', 'Leadership analytique et communication fluide'],
    perks: ['BSPCE attractifs', 'Gymlib & séances de sport sur site', '3 jours de remote/semaine'],
    source: 'LinkedIn',
    contactOrUrl: 'https://linkedin.com'
  },
  // Occitanie Tech / Ingénierie
  {
    id: 'job-occ-01',
    title: 'Ingénieur Cybersécurité Systèmes Critiques (Aérospatial)',
    company: 'AeroShield Toulouse',
    location: 'Toulouse (Colomiers)',
    department: 'Haute-Garonne (31)',
    region: 'Occitanie',
    domain: 'Informatique & Tech',
    contractType: 'CDI',
    remote: 'Sur site',
    salaryMin: 48,
    salaryMax: 60,
    salaryDisplay: '48k€ - 60k€',
    publishedAt: 'Aujourd\'hui, 05:45',
    isFreshToday: true,
    description: 'Évaluation des vulnérabilités et durcissement des systèmes embarqués de télémesure satellite et d\'avionique civile.',
    requirements: ['Connaissance DO-326A / DO-356A', 'Reverse engineering & pentest hardware', 'Habilitation Secret Défense requise'],
    perks: ['14 jours de RTT', 'Comité d\'entreprise avantageux', 'Accès restaurant d\'entreprise'],
    source: 'Apec',
    contactOrUrl: 'https://apec.fr'
  },
  {
    id: 'job-occ-02',
    title: 'Développeur Frontend Vue 3 / TypeScript',
    company: 'MedData Méditerranée',
    location: 'Montpellier (Ecusson / Millénaire)',
    department: 'Hérault (34)',
    region: 'Occitanie',
    domain: 'Informatique & Tech',
    contractType: 'CDI',
    remote: 'Hybride',
    salaryMin: 42,
    salaryMax: 50,
    salaryDisplay: '42k€ - 50k€',
    publishedAt: 'Aujourd\'hui, 06:30',
    isFreshToday: true,
    description: 'Interface d\'analyse épidémiologique pour les centres hospitaliers universitaires du sud de la France.',
    requirements: ['Vue 3 (Composition API)', 'Pinia / TypeScript', 'Visualisation de données complexes (D3.js ou Chart.js)'],
    perks: ['Cadre de vie ensoleillé à 15 min des plages', 'Horaires flexibles', 'Prime vacances'],
    source: 'France Travail',
    contactOrUrl: 'https://francetravail.fr'
  },
  // Nouvelle-Aquitaine
  {
    id: 'job-na-01',
    title: 'Consultant Transition Écologique & Bilan Carbone',
    company: 'Terra Climat Conseil',
    location: 'Bordeaux (Bassins à flot)',
    department: 'Gironde (33)',
    region: 'Nouvelle-Aquitaine',
    domain: 'Transition Écologique & Énergie',
    contractType: 'CDI',
    remote: 'Hybride',
    salaryMin: 40,
    salaryMax: 52,
    salaryDisplay: '40k€ - 52k€',
    publishedAt: 'Aujourd\'hui, 07:05',
    isFreshToday: true,
    description: 'Accompagnement de PME et ETI viticoles et industrielles dans leur stratégie de décarbonation et conformité CSRD.',
    requirements: ['Formation Ingénieur ou Master Environnement', 'Maîtrise méthode Bilan Carbone ADEME', 'Aisance orale client'],
    perks: ['Vélo de fonction électrique', 'Tickets restaurant 10€', '3 jours de télétravail'],
    source: 'Apec',
    contactOrUrl: 'https://apec.fr'
  },
  // Hauts-de-France
  {
    id: 'job-hdf-01',
    title: 'Chef de Projet Automatismes & Robotique (Gigafactory)',
    company: 'Nordic Battery Drive',
    location: 'Dunkerque',
    department: 'Nord (59)',
    region: 'Hauts-de-France',
    domain: 'Ingénierie & Industrie',
    contractType: 'CDI',
    remote: 'Sur site',
    salaryMin: 52,
    salaryMax: 65,
    salaryDisplay: '52k€ - 65k€',
    publishedAt: 'Aujourd\'hui, 04:50',
    isFreshToday: true,
    description: 'Mise en service des lignes automatisées de fabrication de cellules de batteries de nouvelle génération pour l\'automobile électrique.',
    requirements: ['Programmation Siemens TIA Portal & Schneider', 'Gestion de projets industriels neufs', 'Anglais opérationnel'],
    perks: ['Package de relocalisation offert', 'Prime d\'astreinte et intéressement', 'Mutuelle familiale haut de gamme'],
    source: 'France Travail',
    contactOrUrl: 'https://francetravail.fr'
  },
  // Bretagne
  {
    id: 'job-bre-01',
    title: 'Analyste SOC & Réponse à Incident (Cyberdéfense)',
    company: 'Armor Cyber Defense',
    location: 'Rennes (Atalante Beaulieu)',
    department: 'Ille-et-Vilaine (35)',
    region: 'Bretagne',
    domain: 'Informatique & Tech',
    contractType: 'CDI',
    remote: 'Hybride',
    salaryMin: 44,
    salaryMax: 56,
    salaryDisplay: '44k€ - 56k€',
    publishedAt: 'Aujourd\'hui, 06:00',
    isFreshToday: true,
    description: 'Surveillance et détection d\'intrusions pour des opérateurs d\'importance vitale (OIV). Analyse de malwares et forensics.',
    requirements: ['Expérience SIEM (Splunk, Elastic)', 'Analyse de trames réseau (Wireshark)', 'Certifications CEH, OSCP ou Cybersécurité'],
    perks: ['Centre d\'excellence Cyber breton', 'Formations certifiantes prises en charge', '2 jours remote'],
    source: 'Apec',
    contactOrUrl: 'https://apec.fr'
  },
  // Pays de la Loire
  {
    id: 'job-pdl-01',
    title: 'Responsable Supply Chain & Logistique Maritime',
    company: 'Atlantique Ocean Lines',
    location: 'Nantes / Saint-Nazaire',
    department: 'Loire-Atlantique (44)',
    region: 'Pays de la Loire',
    domain: 'Logistique, Transport & Supply Chain',
    contractType: 'CDI',
    remote: 'Hybride',
    salaryMin: 50,
    salaryMax: 64,
    salaryDisplay: '50k€ - 64k€',
    publishedAt: 'Aujourd\'hui, 07:15',
    isFreshToday: true,
    description: 'Pilotage opérationnel de la chaîne logistique d\'approvisionnement des chantiers navals et des sous-traitants offshore.',
    requirements: ['7+ ans en Supply Chain industrielle', 'Maîtrise ERP SAP S/4HANA', 'Négociation transporteurs maritimes'],
    perks: ['13e mois', 'Accord d\'intéressement solide (environ 1.5 mois)', 'Véhicule de fonction'],
    source: 'LinkedIn',
    contactOrUrl: 'https://linkedin.com'
  }
];

export function generateDefaultBrief(
  region: FrenchRegion,
  domain: JobDomain,
  jobTitle: string = 'Développeur Fullstack'
): DailyMarketBrief {
  const dateStr = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return {
    date: formattedDate,
    region,
    domain,
    jobTitleTarget: jobTitle,
    executiveSummary: [
      `Marché très dynamique ce matin en ${region} avec 28 nouvelles offres identifiées ces dernières 24h.`,
      `Forte tension sur les profils ayant 3 à 6 ans d'expérience : les recruteurs accélèrent les prises de contact directes.`,
      `Les compétences orientées modernisation des outils et décarbonation/sécurité affichent une prime salariale de +8% à +12%.`,
      `Meilleur créneau d'envoi constaté : postulez entre 08h00 et 09h30 pour figurer en tête de boîte de réception des recruteurs.`
    ],
    marketTensionLabel: 'Marché très dynamique (Pénurie de profils)',
    marketTensionScore: 78,
    freshOffersCount: 28,
    weekVariationRate: '+14% vs semaine précédente',
    salaryBenchmark: {
      min: 42,
      median: 51,
      max: 65,
      currency: 'k€ brut/an',
      trendComment: 'Légère hausse observée sur les postes avec maîtrise cloud et IA (+3k€ sur la médiane régionale).'
    },
    emergingSkills: [
      {
        name: 'TypeScript & Architecture Propre',
        category: 'Technique',
        demandLevel: 'Très forte',
        growthPercentage: '+34%',
        context: 'Exigé dans 72% des offres tech régionales publiées ce mois-ci.'
      },
      {
        name: 'Intégration Modèles LLM & RAG',
        category: 'Technique',
        demandLevel: 'Très forte',
        growthPercentage: '+82%',
        context: 'Forte accélération des entreprises locales automatisant leurs processus internes.'
      },
      {
        name: 'DevOps / CI-CD Docker & K8s',
        category: 'Outil',
        demandLevel: 'Forte',
        growthPercentage: '+22%',
        context: 'Compétence clé pour l\'autonomie en équipe agile distribuée.'
      },
      {
        name: 'Sensibilité FinOps & Éco-conception',
        category: 'Méthodologie',
        demandLevel: 'En croissance',
        growthPercentage: '+45%',
        context: 'Nouvel atout décisif lors des entretiens pour optimiser les coûts cloud.'
      }
    ],
    topRecruiters: [
      {
        name: 'Thales / Pôles Régionaux',
        city: region === 'Occitanie' ? 'Toulouse' : region === 'Auvergne-Rhône-Alpes' ? 'Valence / Lyon' : 'Paris',
        domain: 'Défense, Sécurité & Tech',
        openPositionsCount: 14,
        highlight: 'Campagne de recrutement active sur les projets de souveraineté numérique.'
      },
      {
        name: 'Capgemini Engineering',
        city: 'Agences régionales',
        domain: 'Conseil & Transformation',
        openPositionsCount: 22,
        highlight: 'Recherche active de profils confirmés avec démarrage sous 1 à 2 mois.'
      },
      {
        name: 'Scale-ups & PME Locales Innovantes',
        city: 'Métropoles régionales',
        domain: 'Produits SaaS & Industrie 4.0',
        openPositionsCount: 9,
        highlight: 'Avantages télétravail hybride souple et participation aux résultats.'
      }
    ],
    morningAdvice: `Ce matin, concentrez vos candidatures sur les 3 premières offres publiées avant 08h00. Personnalisez l'accroche de votre message en mentionnant explicitement un projet concret résolu récemment.`,
    economicContext: `La région ${region} bénéficie d'investissements régionaux soutenus dans la transition numérique et industrielle, favorisant les embauches en CDI.`,
    voiceScript: `Bonjour ! Voici votre briefing emploi du ${formattedDate} pour la région ${region} dans le secteur ${domain}. Le marché est particulièrement dynamique ce matin avec 28 nouvelles offres recensées ces dernières 24 heures. La fourchette salariale médiane se situe à 51 000 euros brut annuel. Le conseil du matin : envoyez vos candidatures avant 09h30 pour maximiser votre taux d'ouverture.`
  };
}

export function generateDynamicRegionalOffers(
  region: FrenchRegion,
  domain: JobDomain,
  jobTitle: string = 'Développeur Fullstack'
): JobOffer[] {
  const regionInfo = REGIONS_LIST.find((r) => r.id === region) || REGIONS_LIST[1];
  const domainInfo = DOMAINS_LIST.find((d) => d.id === domain) || DOMAINS_LIST[0];
  const hubs = regionInfo.hubs;

  const now = new Date();
  const times = [
    'Aujourd\'hui, 07:45',
    'Aujourd\'hui, 07:15',
    'Aujourd\'hui, 06:50',
    'Aujourd\'hui, 06:20',
    'Aujourd\'hui, 05:40',
    'Hier, 19:15',
    'Hier, 17:30',
  ];

  const contractTypes: ('CDI' | 'CDD' | 'Freelance' | 'Alternance')[] = ['CDI', 'CDI', 'CDI', 'Freelance', 'CDD'];
  const remotes: ('Hybride' | 'Total' | 'Sur site')[] = ['Hybride', 'Hybride', 'Total', 'Sur site'];

  const companyPrefixes = ['Groupe', 'Laboratoires', 'Technologies', 'Innovations', 'Solutions', 'Ateliers', 'Coopérative'];
  const companySuffixes = ['Régional', 'Digital', 'Systèmes', 'Avenir', 'Partenaires', 'France', 'Ouest', 'Rhône'];

  const titles = [
    `${jobTitle} Confirmé(e)`,
    `${jobTitle} - Projets Stratégiques`,
    `Lead ${jobTitle}`,
    `${jobTitle} (H/F) - CDI`,
    `Consultant / ${jobTitle} Senior`,
    `${jobTitle} Junior / Intermédiaire`,
    `${jobTitle} - Pôle Innovation`,
  ];

  const salaries = [
    { min: 42, max: 52, display: '42k€ - 52k€' },
    { min: 48, max: 58, display: '48k€ - 58k€' },
    { min: 52, max: 65, display: '52k€ - 65k€' },
    { min: 45, max: 55, display: '45k€ - 55k€' },
    { min: 60, max: 75, display: '60k€ - 75k€' },
    { min: 38, max: 46, display: '38k€ - 46k€' },
    { min: 50, max: 62, display: '50k€ - 62k€' },
  ];

  const sources: ('France Travail' | 'Apec' | 'LinkedIn' | 'Welcome to the Jungle' | 'Entreprise Direct')[] = [
    'Apec',
    'France Travail',
    'LinkedIn',
    'Welcome to the Jungle',
    'Entreprise Direct',
  ];

  return titles.map((title, i) => {
    const hub = hubs[i % hubs.length];
    const prefix = companyPrefixes[i % companyPrefixes.length];
    const suffix = companySuffixes[(i + 2) % companySuffixes.length];
    const company = `${prefix} ${region.split('-')[0]} ${suffix}`;
    const sal = salaries[i % salaries.length];
    const contract = contractTypes[i % contractTypes.length];
    const remote = remotes[i % remotes.length];
    const time = times[i % times.length];
    const source = sources[i % sources.length];

    const req1 = domainInfo.keySkills[0] || 'Expertise métier';
    const req2 = domainInfo.keySkills[1] || 'Autonomie en équipe agile';
    const req3 = domainInfo.keySkills[2] || 'Rigueur et esprit de synthèse';
    const req4 = `Expérience confirmée sur le secteur ${domain}`;

    return {
      id: `offer-${region.slice(0, 3).toLowerCase()}-${domain.slice(0, 3).toLowerCase()}-${i}-${Date.now().toString().slice(-4)}`,
      title,
      company,
      location: `${hub} (${region})`,
      department: region,
      region,
      domain,
      contractType: contract,
      remote,
      salaryMin: sal.min,
      salaryMax: sal.max,
      salaryDisplay: sal.display,
      publishedAt: time,
      isFreshToday: i < 5,
      description: `Dans le cadre du développement de nos activités en ${region}, nous recrutons un profil motivé pour piloter des projets d'envergure dans le domaine ${domain}. Environnement collaboratif axé sur la performance et le bien-être.`,
      requirements: [req1, req2, req3, req4],
      perks: [
        remote === 'Total' ? '100% télétravail avec indemnité mensuelle' : '2 à 3 jours de télétravail/semaine',
        'Carte ticket restaurant Swile (10€)',
        'Accord d\'intéressement et participation',
        'Mutuelle d\'entreprise avantageuse',
      ],
      source,
      contactOrUrl: 'https://francetravail.fr',
    };
  });
}

