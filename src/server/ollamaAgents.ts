import type { DailyMarketBrief, JobOffer, UserPreferences } from '../types/jobMarket';

type AgentRun = {
  id: 'scout' | 'analyst' | 'reviewer' | 'matcher';
  name: string;
  status: 'completed' | 'failed';
  summary: string;
};

const OLLAMA_URL = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen3:8b';
const REQUEST_TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 120_000);

async function ollamaChat(system: string, user: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        think: false,
        format: 'json',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        options: {
          temperature: 0.2,
          num_ctx: 8192,
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Ollama HTTP ${response.status}: ${detail.slice(0, 500)}`);
    }

    const payload = await response.json() as { message?: { content?: string }; error?: string };
    if (payload.error) throw new Error(payload.error);
    if (!payload.message?.content) throw new Error('Ollama a retourné une réponse vide.');
    return payload.message.content;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Ollama n'a pas répondu dans les ${REQUEST_TIMEOUT_MS / 1000} secondes.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function parseJson<T>(raw: string): T {
  const cleaned = raw
    .replace(/^\s*```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const first = cleaned.indexOf('{');
    const last = cleaned.lastIndexOf('}');
    if (first >= 0 && last > first) return JSON.parse(cleaned.slice(first, last + 1)) as T;
    throw new Error('La réponse du modèle ne contient pas de JSON valide.');
  }
}

function buildEvidence(offers: JobOffer[]) {
  const salaries = offers
    .flatMap((offer) => [offer.salaryMin, offer.salaryMax])
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
    .sort((a, b) => a - b);

  const midpoints = offers
    .filter((offer) => typeof offer.salaryMin === 'number' && typeof offer.salaryMax === 'number')
    .map((offer) => ((offer.salaryMin as number) + (offer.salaryMax as number)) / 2)
    .sort((a, b) => a - b);
  const medianEstimate = midpoints.length
    ? midpoints.length % 2
      ? midpoints[Math.floor(midpoints.length / 2)]
      : (midpoints[midpoints.length / 2 - 1] + midpoints[midpoints.length / 2]) / 2
    : null;

  const companyCounts = new Map<string, number>();
  const skillCounts = new Map<string, number>();
  for (const offer of offers) {
    companyCounts.set(offer.company, (companyCounts.get(offer.company) || 0) + 1);
    for (const skill of offer.requirements || []) {
      skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
    }
  }

  return {
    datasetType: 'Données locales de démonstration de MatinalJob. Ce ne sont PAS des offres vérifiées en temps réel.',
    offersCount: offers.length,
    freshOffersCount: offers.filter((offer) => offer.isFreshToday).length,
    locations: [...new Set(offers.map((offer) => offer.location))],
    salary: salaries.length
      ? { min: Math.min(...offers.map((offer) => offer.salaryMin).filter((value): value is number => typeof value === 'number')), medianEstimate, max: Math.max(...offers.map((offer) => offer.salaryMax).filter((value): value is number => typeof value === 'number')), unit: 'k€ brut annuel', note: 'Médiane estimée à partir des milieux de fourchettes des données locales, pas une médiane de marché.' }
      : null,
    companies: [...companyCounts.entries()].map(([name, count]) => ({ name, offers: count })),
    mostRequestedRequirements: [...skillCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count })),
    offers: offers.slice(0, 30).map((offer) => ({
      title: offer.title,
      company: offer.company,
      location: offer.location,
      salaryMin: offer.salaryMin,
      salaryMax: offer.salaryMax,
      salaryDisplay: offer.salaryDisplay,
      publishedAt: offer.publishedAt,
      requirements: offer.requirements,
      remote: offer.remote,
    })),
  };
}

function normalizeBrief(parsed: Partial<DailyMarketBrief>, fallback: DailyMarketBrief): DailyMarketBrief {
  const score = Number(parsed.marketTensionScore);
  const salary = parsed.salaryBenchmark;
  return {
    ...fallback,
    ...parsed,
    marketTensionScore: Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : fallback.marketTensionScore,
    executiveSummary: Array.isArray(parsed.executiveSummary) ? parsed.executiveSummary.slice(0, 5) : fallback.executiveSummary,
    emergingSkills: Array.isArray(parsed.emergingSkills) ? parsed.emergingSkills.slice(0, 6) : fallback.emergingSkills,
    topRecruiters: Array.isArray(parsed.topRecruiters) ? parsed.topRecruiters.slice(0, 6) : fallback.topRecruiters,
    salaryBenchmark: salary && Number.isFinite(salary.min) && Number.isFinite(salary.median) && Number.isFinite(salary.max)
      ? salary
      : fallback.salaryBenchmark,
  };
}

export async function runAssistedBriefingAgents(args: {
  preferences: UserPreferences;
  offers: JobOffer[];
  fallback: DailyMarketBrief;
}): Promise<{ brief: DailyMarketBrief; agents: AgentRun[] }> {
  const { preferences, offers, fallback } = args;
  const agents: AgentRun[] = [];
  const evidence = buildEvidence(offers);

  // Scout is a deterministic data-collection agent: it computes facts from the supplied dataset.
  agents.push({
    id: 'scout',
    name: 'Scout — collecte',
    status: 'completed',
    summary: `${offers.length} offre(s) inspectée(s), ${evidence.freshOffersCount} signalée(s) comme récente(s) dans le jeu de données local.`,
  });

  const analystRaw = await ollamaChat(
    [
      'Tu es Analyst, un agent d’analyse du marché de l’emploi.',
      'Tu travailles uniquement à partir des éléments fournis. Ne prétends jamais avoir effectué une recherche Internet.',
      'Le jeu de données est une démonstration locale : indique clairement cette limite dans economicContext et morningAdvice.',
      'Ne fabrique aucune statistique. Pour les salaires, reprends uniquement les bornes de evidence.salary ; utilise medianEstimate uniquement comme estimation issue des milieux de fourchettes, jamais comme médiane du marché.',
      'Réponds exclusivement en JSON valide, sans Markdown.',
      'Schéma attendu : date, marketTensionLabel, marketTensionScore, freshOffersCount, weekVariationRate, executiveSummary (string[]), salaryBenchmark (min, median, max, currency, trendComment), emergingSkills (name, category, demandLevel, growthPercentage, context), topRecruiters (name, city, domain, openPositionsCount, highlight), morningAdvice, economicContext, voiceScript.',
    ].join(' '),
    JSON.stringify({ preferences, evidence, fallbackBrief: fallback }, null, 2),
  );
  const analystResult = parseJson<Partial<DailyMarketBrief>>(analystRaw);
  agents.push({
    id: 'analyst',
    name: 'Analyst — analyse',
    status: 'completed',
    summary: 'Briefing rédigé à partir des données transmises et des préférences du candidat.',
  });

  const reviewRaw = await ollamaChat(
    [
      'Tu es Reviewer, l’agent de contrôle qualité de MatinalJob.',
      'Vérifie le briefing proposé exclusivement avec les données de preuve fournies.',
      'Corrige les chiffres non justifiés, les entreprises absentes des données et toute formulation qui prétend à une veille Internet en direct.',
      'Conserve exactement le schéma du briefing. Ne rajoute aucune donnée externe.',
      'Réponds exclusivement en JSON valide, sans Markdown.',
    ].join(' '),
    JSON.stringify({ evidence, proposedBrief: analystResult }, null, 2),
  );
  const reviewed = parseJson<Partial<DailyMarketBrief>>(reviewRaw);
  agents.push({
    id: 'reviewer',
    name: 'Reviewer — vérification',
    status: 'completed',
    summary: 'Contrôle de cohérence effectué ; aucune recherche externe n’a été réalisée.',
  });

  return {
    brief: normalizeBrief(reviewed, fallback),
    agents,
  };
}

export async function runOfferMatcher(offer: JobOffer, userProfile: UserPreferences) {
  const raw = await ollamaChat(
    [
      'Tu es Matcher, un conseiller en recrutement français.',
      'Compare le profil candidat à l’offre sans inventer de compétences ou d’expériences.',
      'Le score est une estimation argumentée, pas une probabilité de recrutement.',
      'Réponds exclusivement en JSON valide avec matchScore (0-100), strengths (string[]), missingSkills (string[]), recommendedPitch (string), salaryNegotiationTip (string).',
    ].join(' '),
    JSON.stringify({ offer, userProfile }, null, 2),
  );

  const result = parseJson<{
    matchScore: number;
    strengths: string[];
    missingSkills: string[];
    recommendedPitch: string;
    salaryNegotiationTip: string;
  }>(raw);

  return {
    matchScore: Number.isFinite(result.matchScore) ? Math.max(0, Math.min(100, result.matchScore)) : 0,
    strengths: Array.isArray(result.strengths) ? result.strengths : [],
    missingSkills: Array.isArray(result.missingSkills) ? result.missingSkills : [],
    recommendedPitch: result.recommendedPitch || '',
    salaryNegotiationTip: result.salaryNegotiationTip || '',
  };
}

export async function checkOllama() {
  const response = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error(`Ollama HTTP ${response.status}`);
  const data = await response.json() as { models?: Array<{ name: string }> };
  const models = (data.models || []).map((model) => model.name);
  return { connected: true, model: OLLAMA_MODEL, modelAvailable: models.some((name) => name === OLLAMA_MODEL || name.startsWith(`${OLLAMA_MODEL}:`)), models };
}
