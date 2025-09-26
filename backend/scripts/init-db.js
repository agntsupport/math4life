const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'math4life',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database initialization...');
    
    // Check if tables already exist
    const tableCheck = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'grade_levels'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Database already initialized');
      return;
    }
    
    // Read and execute schema
    console.log('📋 Creating database schema...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schemaSql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
        } catch (error) {
          console.error('Error executing statement:', statement.substring(0, 100) + '...');
          console.error(error.message);
        }
      }
    }
    
    console.log('✅ Database schema created successfully');
    
    // Read and execute seeder
    console.log('🌱 Seeding initial data...');
    const seederPath = path.join(__dirname, '..', 'database', 'seeders', 'standards.seed.sql');
    const seederSql = fs.readFileSync(seederPath, 'utf8');
    
    const seederStatements = seederSql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of seederStatements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
        } catch (error) {
          console.error('Error executing seeder statement:', statement.substring(0, 100) + '...');
          console.error(error.message);
        }
      }
    }
    
    console.log('✅ Database seeded successfully');
    console.log('🎉 Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run initialization
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database initialization completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase };