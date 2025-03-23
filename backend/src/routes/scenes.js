const express = require('express');
const { v4: uuidv4 } = require('uuid');
const yaml = require('js-yaml');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 使用 child_process 执行 midscene CLI 命令
const runMidscene = async (yamlContent, params = {}) => {
  // 创建临时 YAML 文件
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'midscene-'));
  const yamlFile = path.join(tmpDir, 'scene.yaml');
  fs.writeFileSync(yamlFile, yamlContent);

  // 创建参数文件（如果有参数）
  let paramsArg = '';
  if (Object.keys(params).length > 0) {
    const paramsFile = path.join(tmpDir, 'params.json');
    fs.writeFileSync(paramsFile, JSON.stringify(params));
    paramsArg = ` --params ${paramsFile}`;
  }

  console.log(`执行命令: npx @midscene/cli run ${yamlFile}${paramsArg} \n ${yamlContent}`);
  return new Promise((resolve, reject) => {
    // 使用 midscene CLI 执行 YAML
    exec(`npx @midscene/cli ${yamlFile}${paramsArg}`, (error, stdout, stderr) => {
      try {
        // 清理临时文件
        fs.rmSync(tmpDir, { recursive: true, force: true });
        
        if (error) {
          console.error(`执行错误: ${error.message}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        
        // 解析输出结果
        const result = JSON.parse(stdout);
        console.log('执行结果:', result);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
};

module.exports = (pool) => {
  const router = express.Router();

  // 获取所有场景
  router.get('/', async (req, res, next) => {
    try {
      const result = await pool.query(
        'SELECT id, name, description, type, tags, created_at, updated_at FROM scenes ORDER BY updated_at DESC'
      );
      
      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  });

  // 获取单个场景详情
  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        'SELECT * FROM scenes WHERE id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: true, message: '未找到场景' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  });

  // 创建新场景
  router.post('/', async (req, res, next) => {
    try {
      const { name, description, type, tags, yaml_content } = req.body;
      
      // 验证必填字段
      if (!name || !yaml_content) {
        return res.status(400).json({ error: true, message: '名称和YAML内容是必填项' });
      }
      
      // 验证YAML格式
      try {
        yaml.load(yaml_content);
      } catch (yamlError) {
        return res.status(400).json({ error: true, message: `YAML格式无效: ${yamlError.message}` });
      }
      
      const id = uuidv4();
      const now = new Date();
      
      const result = await pool.query(
        `INSERT INTO scenes (id, name, description, type, tags, yaml_content, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [id, name, description, type, tags, yaml_content, now, now]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  });

  // 更新场景
  router.put('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description, type, tags, yaml_content } = req.body;
      
      // 验证必填字段
      if (!name || !yaml_content) {
        return res.status(400).json({ error: true, message: '名称和YAML内容是必填项' });
      }
      
      // 验证YAML格式
      try {
        yaml.load(yaml_content);
      } catch (yamlError) {
        return res.status(400).json({ error: true, message: `YAML格式无效: ${yamlError.message}` });
      }
      
      // 检查场景是否存在
      const checkResult = await pool.query(
        'SELECT id FROM scenes WHERE id = $1',
        [id]
      );
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: true, message: '未找到场景' });
      }
      
      const now = new Date();
      
      const result = await pool.query(
        `UPDATE scenes 
         SET name = $1, description = $2, type = $3, tags = $4, yaml_content = $5, updated_at = $6
         WHERE id = $7
         RETURNING *`,
        [name, description, type, tags, yaml_content, now, id]
      );
      
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  });

  // 删除场景
  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // 检查场景是否存在
      const checkResult = await pool.query(
        'SELECT id FROM scenes WHERE id = $1',
        [id]
      );
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: true, message: '未找到场景' });
      }
      
      await pool.query(
        'DELETE FROM scenes WHERE id = $1',
        [id]
      );
      
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  // 验证YAML
  router.post('/validate', (req, res) => {
    const { yaml_content } = req.body;
    
    if (!yaml_content) {
      return res.status(400).json({ error: true, message: 'YAML内容是必填项' });
    }
    
    try {
      yaml.load(yaml_content);
      res.json({ valid: true, message: 'YAML格式有效' });
    } catch (yamlError) {
      res.status(400).json({ valid: false, message: `YAML格式无效: ${yamlError.message}` });
    }
  });

  // 执行场景 - 使用 midscene CLI
  router.post('/:id/run', async (req, res, next) => {
    try {
      const { id } = req.params;
      const { params = {} } = req.body;
      
      // 获取场景
      const sceneResult = await pool.query(
        'SELECT * FROM scenes WHERE id = $1',
        [id]
      );
      
      if (sceneResult.rows.length === 0) {
        return res.status(404).json({ error: true, message: '未找到场景' });
      }
      
      const scene = sceneResult.rows[0];
      
      // 创建执行记录
      const executionId = uuidv4();
      const now = new Date();
      
      const executionResult = await pool.query(
        `INSERT INTO executions (id, scene_id, status, start_time, params, logs, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [executionId, id, 'running', now, params, [], now]
      );
      
      const execution = executionResult.rows[0];
      
      // 异步执行场景
      executeScene(scene, execution, params, pool);
      
      res.status(202).json({
        id: execution.id,
        scene_id: execution.scene_id,
        status: execution.status,
        start_time: execution.start_time,
        message: '场景执行已启动'
      });
    } catch (err) {
      next(err);
    }
  });

  // 测试执行YAML（不保存到数据库）
  router.post('/test-run', async (req, res, next) => {
    try {
      const { yaml_content, params = {} } = req.body;
      
      if (!yaml_content) {
        return res.status(400).json({ error: true, message: 'YAML内容是必填项' });
      }
      
      // 验证YAML格式
      try {
        yaml.load(yaml_content);
      } catch (yamlError) {
        return res.status(400).json({ error: true, message: `YAML格式无效: ${yamlError.message}` });
      }
      
      try {
        // 使用 midscene CLI 执行 YAML
        const result = await runMidscene(yaml_content, params);
        res.json(result);
      } catch (runError) {
        res.status(400).json({ 
          error: true, 
          message: '执行YAML失败', 
          details: runError.message 
        });
      }
    } catch (err) {
      next(err);
    }
  });

  return router;
};

// 异步执行场景函数
async function executeScene(scene, execution, params, pool) {
  let logs = [];
  let status = 'failed';
  let endTime = new Date();
  
  try {
    logs.push({
      timestamp: new Date(),
      level: 'info',
      message: '开始执行场景'
    });
    
    logs.push({
      timestamp: new Date(),
      level: 'info',
      message: '使用MidScene引擎执行YAML'
    });
    
    try {
      // 使用 midscene CLI 执行 YAML
      const result = await runMidscene(scene.yaml_content, params);
      
      logs.push({
        timestamp: new Date(),
        level: 'info',
        message: '执行完成',
        result: result
      });
      
      status = 'success';
    } catch (error) {
      logs.push({
        timestamp: new Date(),
        level: 'error',
        message: `执行出错: ${error.message}`
      });
      
      console.error(`执行场景 ${scene.id} 失败:`, error);
    }
  } catch (error) {
    logs.push({
      timestamp: new Date(),
      level: 'error',
      message: `执行出错: ${error.message}`
    });
    
    console.error(`执行场景 ${scene.id} 失败:`, error);
  } finally {
    // 更新执行记录
    endTime = new Date();
    
    try {
      await pool.query(
        `UPDATE executions 
         SET status = $1, end_time = $2, logs = $3 
         WHERE id = $4`,
        [status, endTime, JSON.stringify(logs), execution.id]
      );
    } catch (dbError) {
      console.error('更新执行记录失败:', dbError);
    }
  }
} 