const fs = require('fs');
const path = require('path');
const postgres = require('postgres');


const envPath = path.join(__dirname, '../../.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/DATABASE_URL=(.+)/);
  if (match) {
    databaseUrl = match[1].trim();
  }
}

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL is not set in environment or .env.local');
  process.exit(1);
}

console.log('Connecting to database...');
const sql = postgres(databaseUrl, { ssl: 'require' });

async function init() {
  try {
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        agreed_to_share BOOLEAN NOT NULL DEFAULT FALSE,
        selected_categories TEXT[] DEFAULT '{}',
        notes TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Users table created successfully (or already exists)!');
    
    
    const res = await sql`SELECT NOW()`;
    console.log('✅ Connection test successful! Server time:', res[0].now);
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

init();
