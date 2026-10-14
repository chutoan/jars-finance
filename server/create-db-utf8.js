import pg from 'pg';

const client = new pg.Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres'
});

async function run() {
  await client.connect();
  console.log('Connected to postgres database');
  
  await client.query(`
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = 'jars_finance' AND pid <> pg_backend_pid();
  `);
  
  await client.query('DROP DATABASE IF EXISTS jars_finance');
  await client.query("CREATE DATABASE jars_finance WITH TEMPLATE template0 ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C'");
  console.log('✅ Recreated jars_finance with ENCODING UTF8 successfully!');
  await client.end();
}

run().catch(console.error);
