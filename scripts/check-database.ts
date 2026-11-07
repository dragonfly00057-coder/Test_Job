import 'dotenv/config';
import { checkDatabaseConnection, pool } from '../src/db';

try {
  await checkDatabaseConnection();
  console.log('Connexion PostgreSQL via Drizzle : OK');
} catch (error) {
  console.error('Échec de la connexion PostgreSQL :', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
