require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// 数据库连接配置
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mysop',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// 创建数据库表
const createTables = async () => {
  const client = await pool.connect();
  try {
    // 开始事务
    await client.query('BEGIN');

    console.log('创建场景表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS scenes (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        type VARCHAR(100),
        tags VARCHAR(255),
        yaml_content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `);

    console.log('创建执行历史表...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS executions (
        id UUID PRIMARY KEY,
        scene_id UUID NOT NULL REFERENCES scenes(id) ON DELETE CASCADE,
        status VARCHAR(50) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        params JSONB,
        logs JSONB,
        created_at TIMESTAMP NOT NULL
      )
    `);

    // 添加索引
    console.log('创建索引...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_scenes_name ON scenes(name)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_scenes_updated_at ON scenes(updated_at)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_executions_scene_id ON executions(scene_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_executions_start_time ON executions(start_time)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_executions_status ON executions(status)');

    // 提交事务
    await client.query('COMMIT');
    console.log('数据库表创建成功');
  } catch (err) {
    // 回滚事务
    await client.query('ROLLBACK');
    console.error('创建数据库表失败', err);
    throw err;
  } finally {
    // 释放客户端
    client.release();
  }
};

// 添加示例数据
const insertSampleData = async () => {
  const client = await pool.connect();
  try {
    // 检查是否已有数据
    const sceneResult = await client.query('SELECT COUNT(*) FROM scenes');
    if (parseInt(sceneResult.rows[0].count) > 0) {
      console.log('数据库中已有数据，跳过示例数据创建');
      return;
    }

    // 开始事务
    await client.query('BEGIN');

    // 插入示例场景
    console.log('插入示例场景...');
    
    // 示例场景1
    const scene1Id = '550e8400-e29b-41d4-a716-446655440000';
    const scene1YamlContent = `
name: 数据导入场景
description: 从CSV文件导入数据并进行处理

steps:
  - id: step1
    name: 读取CSV文件
    type: file-read
    data:
      path: "/data/input.csv"
      
  - id: step2
    name: 数据转换
    type: transform
    data:
      input: $ref:step1.result
      transform: uppercase
      
  - id: step3
    name: 保存结果
    type: file-write
    data:
      content: $ref:step2.result
      path: "/data/output.csv"
    `;
    
    await client.query(
      `INSERT INTO scenes (id, name, description, type, tags, yaml_content, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        scene1Id, 
        '数据导入场景', 
        '从CSV文件导入数据并进行处理', 
        '数据处理',
        'csv,导入,数据处理',
        scene1YamlContent,
        new Date('2023-06-15T14:30:00Z'),
        new Date('2023-06-15T14:30:00Z')
      ]
    );
    
    // 示例场景2
    const scene2Id = '550e8400-e29b-41d4-a716-446655440001';
    const scene2YamlContent = `
name: 定时备份流程
description: 每日定时将数据备份到S3存储

steps:
  - id: step1
    name: 连接数据库
    type: db-connect
    data:
      host: "localhost"
      port: 5432
      database: "appdb"
      
  - id: step2
    name: 导出数据
    type: db-export
    data:
      connection: $ref:step1.result
      query: "SELECT * FROM users"
      
  - id: step3
    name: 上传到S3
    type: s3-upload
    data:
      content: $ref:step2.result
      bucket: "backups"
      key: "users-backup.json"
    `;
    
    await client.query(
      `INSERT INTO scenes (id, name, description, type, tags, yaml_content, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        scene2Id, 
        '定时备份流程', 
        '每日定时将数据备份到S3存储', 
        '集成',
        'backup,s3,数据库',
        scene2YamlContent,
        new Date('2023-06-10T16:45:00Z'),
        new Date('2023-06-10T16:45:00Z')
      ]
    );
    
    // 示例执行历史
    console.log('插入示例执行历史...');
    
    // 场景1的执行历史
    const exec1Logs = JSON.stringify([
      { timestamp: new Date('2023-06-15T14:30:05Z'), level: 'info', message: '开始执行场景' },
      { timestamp: new Date('2023-06-15T14:30:10Z'), level: 'info', message: '读取CSV文件' },
      { timestamp: new Date('2023-06-15T14:30:15Z'), level: 'info', message: '数据转换' },
      { timestamp: new Date('2023-06-15T14:30:20Z'), level: 'info', message: '保存结果' },
      { timestamp: new Date('2023-06-15T14:32:00Z'), level: 'info', message: '执行完成' }
    ]);
    
    await client.query(
      `INSERT INTO executions (id, scene_id, status, start_time, end_time, params, logs, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        '660e8400-e29b-41d4-a716-446655440000',
        scene1Id,
        'success',
        new Date('2023-06-15T14:30:00Z'),
        new Date('2023-06-15T14:32:15Z'),
        JSON.stringify({}),
        exec1Logs,
        new Date('2023-06-15T14:30:00Z')
      ]
    );
    
    // 场景2的执行历史
    const exec2Logs = JSON.stringify([
      { timestamp: new Date('2023-06-15T00:00:05Z'), level: 'info', message: '开始执行场景' },
      { timestamp: new Date('2023-06-15T00:00:10Z'), level: 'info', message: '连接数据库' },
      { timestamp: new Date('2023-06-15T00:01:15Z'), level: 'info', message: '导出数据' },
      { timestamp: new Date('2023-06-15T00:04:20Z'), level: 'info', message: '上传到S3' },
      { timestamp: new Date('2023-06-15T00:05:00Z'), level: 'info', message: '执行完成' }
    ]);
    
    await client.query(
      `INSERT INTO executions (id, scene_id, status, start_time, end_time, params, logs, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        '660e8400-e29b-41d4-a716-446655440001',
        scene2Id,
        'success',
        new Date('2023-06-15T00:00:00Z'),
        new Date('2023-06-15T00:05:30Z'),
        JSON.stringify({}),
        exec2Logs,
        new Date('2023-06-15T00:00:00Z')
      ]
    );

    // 提交事务
    await client.query('COMMIT');
    console.log('示例数据插入成功');
  } catch (err) {
    // 回滚事务
    await client.query('ROLLBACK');
    console.error('插入示例数据失败', err);
    throw err;
  } finally {
    // 释放客户端
    client.release();
  }
};

// 主函数
const initDatabase = async () => {
  try {
    console.log('开始初始化数据库...');
    
    await createTables();
    await insertSampleData();
    
    console.log('数据库初始化完成');
    process.exit(0);
  } catch (err) {
    console.error('数据库初始化失败:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// 执行初始化
initDatabase(); 