import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { generateDefaultBrief, generateDynamicRegionalOffers } from './src/data/regionalJobData';
import { FrenchRegion, JobDomain, UserPreferences } from './src/types/jobMarket';
import { checkOllama, runAssistedBriefingAgents, runOfferMatcher } from './src/server/ollamaAgents';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '1mb' }));

const nowTime = () => new Date().toLocaleTimeString('fr-FR', {
  hour: '2-digit', minute: '2-digit', second: '2-digit',
});

// Health endpoint: reports the local model connection and availability.
app.get('/api/health', async (_req, res) => {
  try {
    const ollama = await checkOllama();
    res.json({ status: 'ok', provider: 'ollama', ...ollama, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      provider: 'ollama',
      connected: false,
      model: process.env.OLLAMA_MODEL || 'qwen3:8b',
      error: error instanceof Error ? error.message : 'Ollama indisponible',
      timestamp: new Date().toISOString(),
    });
  }
});

// Assisted workflow: launched on demand by the UI. Agents only analyze the local demo dataset
// until a real job-board API has been configured.
app.post('/api/market-brief', async (req, res) => {
  const body = req.body as Partial<UserPreferences>;
  const validRegion = (body.region || 'Grand Est') as FrenchRegion;
  const validDomain = (body.domain || 'Informatique & Tech') as JobDomain;
  const validJob = body.jobTitle || 'Administrateur systèmes et réseaux';
  const preferences = {
    region: validRegion,
    department: typeof body.department === 'string' ? body.department : undefined,
    domain: validDomain,
    jobTitle: validJob,
    experienceLevel: body.experienceLevel || 'Intermédiaire (3-5 ans)',
    remotePreference: body.remotePreference || 'Hybride (2-3j/semaine)',
    morningTime: body.morningTime || '07:30',
    notificationEnabled: body.notificationEnabled ?? false,
    userSkills: Array.isArray(body.userSkills) ? body.userSkills : [],
  } as UserPreferences;

  const fallback = generateDefaultBrief(validRegion, validDomain, validJob);
  const offers = generateDynamicRegionalOffers(validRegion, validDomain, validJob);

  try {
    const result = await runAssistedBriefingAgents({ preferences, offers, fallback });
    res.json({
      brief: result.brief,
      offers,
      source: 'ollama_assisted_demo_data',
      dataNotice: 'Données locales de démonstration : aucune offre n’a été vérifiée sur un site d’emploi.',
      agents: result.agents,
      provider: 'ollama',
      model: process.env.OLLAMA_MODEL || 'qwen3:8b',
      refreshedAt: nowTime(),
    });
  } catch (error) {
    console.error('Assisted agent workflow failed:', error);
    res.status(503).json({
      error: 'Le workflow d’agents Ollama n’a pas pu aboutir.',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      hint: 'Vérifiez qu’Ollama fonctionne et que le modèle qwen3:8b est téléchargé (ollama pull qwen3:8b).',
    });
  }
});

// Offer matching is also performed locally by Qwen3.
app.post('/api/match-offer', async (req, res) => {
  const { offer, userProfile } = req.body || {};
  if (!offer || !userProfile) return res.status(400).json({ error: 'Offre ou profil manquant.' });

  try {
    const result = await runOfferMatcher(offer, userProfile);
    res.json({ ...result, provider: 'ollama', model: process.env.OLLAMA_MODEL || 'qwen3:8b' });
  } catch (error) {
    console.error('Offer matching failed:', error);
    res.status(503).json({
      error: 'Impossible de lancer l’agent Matcher.',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      hint: 'Vérifiez Ollama et le modèle qwen3:8b.',
    });
  }
});

// Explicitly returns the current local demo dataset. This endpoint does not scrape job boards.
app.post('/api/fetch-offers', (req, res) => {
  const { region, domain, jobTitle } = req.body || {};
  const targetRegion = (region || 'Grand Est') as FrenchRegion;
  const targetDomain = (domain || 'Informatique & Tech') as JobDomain;
  const offers = generateDynamicRegionalOffers(targetRegion, targetDomain, jobTitle || 'Administrateur systèmes et réseaux');
  res.json({
    offers,
    count: offers.length,
    source: 'local_demo_dataset',
    dataNotice: 'Offres fictives de démonstration, non vérifiées en temps réel.',
    timestamp: nowTime(),
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.resolve(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MatinalJob server running on http://0.0.0.0:${PORT}`);
    console.log(`AI provider: Ollama (${process.env.OLLAMA_MODEL || 'qwen3:8b'})`);
  });
}

startServer().catch((err) => console.error('Failed to start server:', err));
