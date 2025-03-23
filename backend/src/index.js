require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { Pool } = require('pg');
const { sequelize } = require('./db/models');
const routes = require('./routes');

// 初始化数据库连接池
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mysop',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// 初始化Express应用
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// API routes
const scenesRouter = require('./routes/scenes');
const executionsRouter = require('./routes/executions');

app.use('/api/scenes', scenesRouter(pool));
app.use('/api/executions', executionsRouter(pool));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is running' });
});

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'MidScense Scene Manager API' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: err.message || 'Internal Server Error'
  });
});

// Start the server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Start server
    app.listen(port, () => {
      console.log(`MySOP服务器已启动，端口：${port}`);
      console.log(`访问 http://localhost:${port}/api/health 检查服务状态`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app; 