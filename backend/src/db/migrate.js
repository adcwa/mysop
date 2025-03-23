require('dotenv').config();
const { Sequelize } = require('sequelize');
const models = require('./models');

async function migrate() {
  try {
    // Create database if it doesn't exist
    const adminDb = new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres', // Connect to the default postgres database
      logging: false
    });

    try {
      await adminDb.query(`CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`Database ${process.env.DB_NAME} created successfully.`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`Database ${process.env.DB_NAME} already exists.`);
      } else {
        throw error;
      }
    } finally {
      await adminDb.close();
    }

    // Sync all models
    await models.sequelize.sync({ force: true });
    console.log('All models were synchronized successfully.');

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate(); 