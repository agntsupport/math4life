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

async function seedData() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting data seeding...');
    
    // Clear existing data to prevent conflicts
    console.log('🧹 Clearing existing seed data...');
    
    await client.query('DELETE FROM problem_attempts');
    await client.query('DELETE FROM lesson_progress');
    await client.query('DELETE FROM problems');
    await client.query('DELETE FROM lessons');
    await client.query('DELETE FROM standards');
    await client.query('DELETE FROM clusters');
    await client.query('DELETE FROM grade_domains');
    
    console.log('✅ Existing data cleared');
    
    // Read and execute standards seeder
    console.log('🌱 Seeding standards data...');
    const standardsSeederPath = path.join(__dirname, '..', 'database', 'seeders', 'standards.seed.sql');
    const standardsSeederSql = fs.readFileSync(standardsSeederPath, 'utf8');
    
    const standardsStatements = standardsSeederSql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of standardsStatements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
        } catch (error) {
          console.error('Error executing standards statement:', statement.substring(0, 100) + '...');
          console.error(error.message);
        }
      }
    }
    
    console.log('✅ Standards seeded successfully');
    
    // Read and execute lessons seeder
    console.log('🌱 Seeding lessons and problems...');
    const lessonsSeederPath = path.join(__dirname, '..', 'database', 'seeders', 'lessons.seed.sql');
    const lessonsSeederSql = fs.readFileSync(lessonsSeederPath, 'utf8');
    
    const lessonsStatements = lessonsSeederSql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of lessonsStatements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
        } catch (error) {
          console.error('Error executing lessons statement:', statement.substring(0, 100) + '...');
          console.error(error.message);
        }
      }
    }
    
    console.log('✅ Lessons and problems seeded successfully');
    
    // Verify data was loaded
    const standardsCount = await client.query('SELECT COUNT(*) FROM standards');
    const lessonsCount = await client.query('SELECT COUNT(*) FROM lessons');
    const problemsCount = await client.query('SELECT COUNT(*) FROM problems');
    
    console.log(`📊 Data loaded successfully:`);
    console.log(`   - Standards: ${standardsCount.rows[0].count}`);
    console.log(`   - Lessons: ${lessonsCount.rows[0].count}`);
    console.log(`   - Problems: ${problemsCount.rows[0].count}`);
    
    console.log('🎉 Data seeding complete!');
    
  } catch (error) {
    console.error('❌ Data seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run seeding
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Data seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Data seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedData };