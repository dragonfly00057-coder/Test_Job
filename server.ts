import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { generateDefaultBrief, generateDynamicRegionalOffers, SAMPLE_OFFERS } from './src/data/regionalJobData';
import { FrenchRegion, JobDomain, JobOffer } from './src/types/jobMarket';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Helper for timing out slow remote LLM calls
function timeoutPromise<T>(promise: Promise<T>, ms: number, fallbackValue: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallbackValue), ms)),
  ]);
}

// Generate or update daily morning brief
app.post('/api/market-brief', async (req, res) => {
  const { region, domain, jobTitle, experienceLevel, remotePreference } = req.body;

  const validRegion = (region || 'Auvergne-Rhône-Alpes') as FrenchRegion;
  const validDomain = (domain || 'Informatique & Tech') as JobDomain;
  const validJob = jobTitle || 'Développeur Fullstack';

  // Fallback template and dynamic fresh offers
  const fallback = generateDefaultBrief(validRegion, validDomain, validJob);
  const freshOffers = generateDynamicRegionalOffers(validRegion, validDomain, validJob);

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      brief: fallback,
      offers: freshOffers,
      source: 'local_database',
      refreshedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
  }

  try {
    const todayFormatted = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    const prompt = `Génère le BRIEFING MATINAL de l'emploi pour ${todayFormatted} en France.
Région : ${validRegion}
Domaine : ${validDomain}
Poste ciblé : ${validJob}
Expérience : ${experienceLevel || '3-5 ans'}
Télétravail : ${remotePreference || 'Hybride'}

Donne des constats concrets pour ${validRegion}, les salaires régionaux observés, 4 compétences clés et 3-4 entreprises régionales en recrutement actif. Réponds en JSON.`;

    const apiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            marketTensionLabel: {
              type: Type.STRING,
              description: "Ex: 'Marché très dynamique (Pénurie de profils)' ou 'Marché équilibré' ou 'Marché sélectif'",
            },
            marketTensionScore: {
              type: Type.NUMBER,
              description: "Score de tension entre 1 et 100",
            },
            freshOffersCount: {
              type: Type.NUMBER,
              description: "Nombre estimé de nouvelles offres apparues depuis 24h",
            },
            weekVariationRate: {
              type: Type.STRING,
              description: "Ex: '+12% vs semaine précédente'",
            },
            executiveSummary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 à 4 constats clés majeurs sur le marché ce matin",
            },
            salaryBenchmark: {
              type: Type.OBJECT,
              properties: {
                min: { type: Type.NUMBER, description: "Salaire min en k€ brut annuel" },
                median: { type: Type.NUMBER, description: "Salaire médian en k€ brut annuel" },
                max: { type: Type.NUMBER, description: "Salaire max en k€ brut annuel" },
                currency: { type: Type.STRING, description: "k€ brut/an" },
                trendComment: { type: Type.STRING, description: "Commentaire court sur la négociation et l'évolution" },
              },
              required: ['min', 'median', 'max', 'currency', 'trendComment'],
            },
            emergingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING, description: "Technique, Méthodologie, Outil ou Soft skill" },
                  demandLevel: { type: Type.STRING, description: "Très forte, Forte, ou En croissance" },
                  growthPercentage: { type: Type.STRING, description: "Ex: +45%" },
                  context: { type: Type.STRING, description: "Pourquoi cette compétence est recherchée dans la région" },
                },
                required: ['name', 'category', 'demandLevel', 'growthPercentage', 'context'],
              },
            },
            topRecruiters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  city: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  openPositionsCount: { type: Type.NUMBER },
                  highlight: { type: Type.STRING },
                },
                required: ['name', 'city', 'domain', 'openPositionsCount', 'highlight'],
              },
            },
            morningAdvice: {
              type: Type.STRING,
              description: "Un conseil tactique actionnable immédiatement ce matin pour le candidat",
            },
            economicContext: {
              type: Type.STRING,
              description: "Contexte macro-économique de la région",
            },
            voiceScript: {
              type: Type.STRING,
              description: "Texte fluide de 40 secondes pour lecture audio",
            },
          },
          required: [
            'date',
            'marketTensionLabel',
            'marketTensionScore',
            'freshOffersCount',
            'weekVariationRate',
            'executiveSummary',
            'salaryBenchmark',
            'emergingSkills',
            'topRecruiters',
            'morningAdvice',
            'economicContext',
            'voiceScript',
          ],
        },
      },
    });

    // 6-second timeout race to ensure lightning-fast UI responsiveness
    const response = await timeoutPromise(apiCall, 6000, null as any);

    if (!response || !response.text) {
      return res.json({
        brief: fallback,
        offers: freshOffers,
        source: 'fast_fallback',
        refreshedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    }

    const parsed = JSON.parse(response.text || '{}');
    const brief = {
      ...parsed,
      region: validRegion,
      domain: validDomain,
      jobTitleTarget: validJob,
    };

    return res.json({
      brief,
      offers: freshOffers,
      source: 'gemini_live',
      refreshedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
  } catch (error: any) {
    console.error('Error querying Gemini API for market brief:', error);
    return res.json({
      brief: fallback,
      offers: freshOffers,
      source: 'fallback_error',
      refreshedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
  }
});

// Match a job offer with user profile
app.post('/api/match-offer', async (req, res) => {
  const { offer, userProfile } = req.body;

  if (!offer) {
    return res.status(400).json({ error: 'Offre manquante' });
  }

  const defaultMatch = {
    matchScore: 88,
    strengths: [
      `Votre profil en ${userProfile?.domain || offer.domain} cadre bien avec les besoins de ${offer.company}.`,
      `Localisation compatible avec vos préférences en région ${offer.region}.`,
    ],
    missingSkills: ['Valorisez vos réalisations concrètes et métriques chiffrées lors de l\'entretien.'],
    recommendedPitch: `Bonjour, vivement intéressé(e) par votre offre de ${offer.title} chez ${offer.company}, mon parcours correspond aux compétences clés recherchées. Je serais ravi(e) d'échanger avec vous.`,
    salaryNegotiationTip: `Pour cette offre affichée à ${offer.salaryDisplay}, vous pouvez viser le milieu ou haut de fourchette en mettant en avant votre autonomie opérationnelle.`,
  };

  if (!process.env.GEMINI_API_KEY) {
    return res.json(defaultMatch);
  }

  try {
    const prompt = `Analyse l'adéquation :
Offre: ${offer.title} chez ${offer.company} (${offer.location}, ${offer.salaryDisplay}).
Profil: ${userProfile?.jobTitle || 'Candidat'} - ${userProfile?.experienceLevel || '3-5 ans'} (${userProfile?.region || offer.region}).
Compétences déclarées: ${(userProfile?.userSkills || []).join(', ')}.`;

    const apiCall = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedPitch: { type: Type.STRING },
            salaryNegotiationTip: { type: Type.STRING },
          },
          required: ['matchScore', 'strengths', 'missingSkills', 'recommendedPitch', 'salaryNegotiationTip'],
        },
      },
    });

    const response = await timeoutPromise(apiCall, 5000, null as any);
    if (!response || !response.text) {
      return res.json(defaultMatch);
    }

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error: any) {
    console.error('Error in match-offer:', error);
    return res.json(defaultMatch);
  }
});

// Generate fresh job offers stream for the region/domain
app.post('/api/fetch-offers', async (req, res) => {
  const { region, domain, jobTitle } = req.body;
  const targetRegion = (region || 'Auvergne-Rhône-Alpes') as FrenchRegion;
  const targetDomain = (domain || 'Informatique & Tech') as JobDomain;

  const dynamicOffers = generateDynamicRegionalOffers(targetRegion, targetDomain, jobTitle || 'Développeur');

  res.json({
    offers: dynamicOffers,
    count: dynamicOffers.length,
    timestamp: new Date().toLocaleTimeString('fr-FR'),
  });
});

// Mount Vite middleware or static serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MatinalJob server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
