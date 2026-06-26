import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const sql = globalForDb.conn ?? postgres(connectionString, {
  ssl: 'require',
  max: 10,
});

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = sql;
}
