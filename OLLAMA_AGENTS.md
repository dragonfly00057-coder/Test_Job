# MatinalJob — agents Ollama (mode assisté)

## Agents

- **Scout** inspecte et résume le jeu d’offres fourni au serveur.
- **Analyst** produit le briefing à partir des préférences et des données disponibles.
- **Reviewer** vérifie les affirmations du briefing et corrige les éléments non étayés.
- **Matcher** compare une offre au profil lorsque l’utilisateur ouvre son détail.

Les appels au modèle sont effectués côté serveur via l’API HTTP Ollama. Le mode est **assisté** : le briefing se lance au chargement/rafraîchissement et le matching à l’ouverture d’une offre. Aucun agent ne tourne en permanence et aucune candidature n’est envoyée automatiquement.

## Installation locale

1. Installer et démarrer Ollama : https://ollama.com/
2. Télécharger le modèle : `ollama pull qwen3:8b`
3. Copier `.env.example` vers `.env` et vérifier ces valeurs :

   ```env
   OLLAMA_BASE_URL=http://127.0.0.1:11434
   OLLAMA_MODEL=qwen3:8b
   OLLAMA_TIMEOUT_MS=120000
   PORT=3000
   ```

4. Lancer `npm install`, puis `npm run dev`.
5. Vérifier `http://localhost:3000/api/health` : `connected` et `modelAvailable` doivent être à `true`.

## Limite importante sur les offres

Les offres de `regionalJobData.ts` restent des **données locales de démonstration**. Scout ne consulte pas encore France Travail, Apec, LinkedIn ou Welcome to the Jungle. Les chiffres du briefing ne sont pas des statistiques du marché réel. Le raccordement à une source autorisée (par exemple une API officielle et ses identifiants) est une étape distincte.

## Dépannage

- Si `/api/health` répond 503, vérifier que le service Ollama est démarré.
- Si `modelAvailable` vaut `false`, exécuter `ollama pull qwen3:8b`.
- Si Ollama est sur une autre machine ou dans un autre conteneur, adapter `OLLAMA_BASE_URL` à une adresse joignable depuis Node.
- Ne jamais committer le fichier `.env` ni placer de secret dans le code client.
