/**
 * Database initialization script
 * This script will create the required tables and seed data for the application
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configure PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mysop',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function initializeDatabase() {
  let client;
  
  try {
    // Connect to the database
    client = await pool.connect();
    console.log('Connected to the database');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    console.log('Creating database schema...');
    await client.query(schema);
    console.log('Database schema created successfully');
    
    console.log('Database initialization complete');
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run the initialization function
initializeDatabase(); 