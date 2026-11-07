# MatinalJob — architecture multi-utilisateur

## État audité

- Frontend React + Vite ; backend Express dans `server.ts`.
- Aucune base de données ni authentification actuellement.
- Préférences, offres sauvegardées et candidatures persistées dans le `localStorage` du navigateur.
- Les routes `/api/market-brief` et `/api/match-offer` sont publiques. Le profil envoyé à Matcher vient actuellement du client.
- Les agents Ollama sont exécutés côté serveur, ce qui permet de conserver les appels au modèle hors du navigateur.
- Le dépôt ne contient pas de `package-lock.json`.
- Docker Compose et le modèle `.env.example` ont été ajoutés pour lancer PostgreSQL localement ; l'application n'est pas encore connectée à la base.

## Architecture cible proposée

### Stack

- PostgreSQL comme source de vérité persistante.
- Better Auth pour l'inscription, la connexion, les sessions et les cookies sécurisés.
- Drizzle ORM pour les données métier et les migrations SQL versionnées.
- PostgreSQL local en développement via Docker Compose ; PostgreSQL managé en production, sans dépendance à un fournisseur précis.
- Sessions par cookie HttpOnly, Secure en production, SameSite adapté ; aucun jeton de session stocké dans localStorage.

### Modèle de données

- `user` : identité et compte, gérés par Better Auth.
- `user_preferences` : relation 1–1 avec `user`, profil de recherche, compétences, région, département, télétravail, salaire cible et heure de briefing.
- `saved_offers` : relation entre un utilisateur et une offre, contrainte unique sur (user_id, offer_id).
- `applications` : candidatures et notes, toujours rattachées à un utilisateur.
- `job_offers` : offres collectées, indépendantes des utilisateurs ; une offre peut être sauvegardée par plusieurs comptes.
- Les tables métier contenant des données privées portent un `user_id` obligatoire et indexé.

### Règles de sécurité non négociables

1. Chaque route privée valide la session côté serveur.
2. Le serveur déduit le `user_id` de la session ; il ne fait jamais confiance à un identifiant utilisateur envoyé par le navigateur.
3. Les requêtes SQL filtrent les données privées par le `user_id` authentifié.
4. Le Matcher charge le profil depuis PostgreSQL à partir de la session ; il n'accepte plus un profil arbitraire fourni par le client.
5. Les secrets restent dans les variables d'environnement et ne sont jamais exposés au bundle Vite.
6. Les routes publiques (inscription, connexion, santé) sont séparées des routes métier protégées.

## Plan d'implémentation

1. [En place] Ajouter PostgreSQL local avec Docker Compose et variables d'environnement.
2. [À faire] Ajouter le client PostgreSQL, Drizzle et les migrations ; vérifier la connexion depuis le serveur.
3. Installer et configurer Better Auth ; créer inscription/connexion/déconnexion et protection des routes.
4. Créer les tables métier et les migrations.
5. Remplacer progressivement les lectures/écritures localStorage par l'API authentifiée.
6. Prévoir une importation explicite des anciennes données localStorage vers le compte connecté, sans importer les données de démonstration comme de vraies candidatures.
7. Adapter les endpoints briefing et matching pour charger le profil du compte côté serveur.
8. Ajouter des tests d'isolation : un compte A ne peut jamais lire, modifier ou supprimer les données du compte B.

## Configuration locale Better Auth

Ajouter dans `.env` : `BETTER_AUTH_SECRET` (secret aléatoire d'au moins 32 caractères) et `BETTER_AUTH_URL=http://localhost:3000`. Le secret ne doit jamais être commité ni exposé au frontend.

## Décisions à confirmer avant le premier changement technique

- Mode de développement : PostgreSQL local via Docker Compose (recommandé) ou instance PostgreSQL distante.
- Authentification initiale : email + mot de passe ; OAuth pourra être ajouté ensuite.
- Déploiement cible : à définir plus tard ; le schéma reste portable entre fournisseurs PostgreSQL.

## Hors périmètre de la première étape

La collecte d'offres réelles (France Travail, Apec, sites carrières) reste un chantier séparé. La base multi-utilisateur ne transforme pas les offres fictives actuelles en offres vérifiées.
