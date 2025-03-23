const express = require('express');
const { v4: uuidv4 } = require('uuid');
const yaml = require('js-yaml');

module.exports = (pool) => {
  const router = express.Router();

  // 获取所有执行历史
  router.get('/', async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT e.id, e.scene_id, s.name AS scene_name, e.status, e.start_time, 
                e.end_time, e.logs, e.created_at 
         FROM executions e
         JOIN scenes s ON e.scene_id = s.id
         ORDER BY e.start_time DESC`
      );
      
      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  });

  // 获取单个执行详情
  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query(
        `SELECT e.*, s.name AS scene_name, s.yaml_content 
         FROM executions e
         JOIN scenes s ON e.scene_id = s.id
         WHERE e.id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: true, message: '未找到执行记录' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  });

  // 获取指定场景的执行历史
  router.get('/scene/:sceneId', async (req, res, next) => {
    try {
      const { sceneId } = req.params;
      
      const result = await pool.query(
        `SELECT e.id, e.scene_id, s.name AS scene_name, e.status, e.start_time, 
                e.end_time, e.logs, e.created_at 
         FROM executions e
         JOIN scenes s ON e.scene_id = s.id
         WHERE e.scene_id = $1
         ORDER BY e.start_time DESC`,
        [sceneId]
      );
      
      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  });

  // 执行场景
  router.post('/run/:sceneId', async (req, res, next) => {
    try {
      const { sceneId } = req.params;
      const { params } = req.body || {};
      
      // 查询场景
      const sceneResult = await pool.query(
        'SELECT * FROM scenes WHERE id = $1',
        [sceneId]
      );
      
      if (sceneResult.rows.length === 0) {
        return res.status(404).json({ error: true, message: '未找到场景' });
      }
      
      const scene = sceneResult.rows[0];
      
      // 解析YAML内容
      let yamlContent;
      try {
        yamlContent = yaml.load(scene.yaml_content);
      } catch (yamlError) {
        return res.status(400).json({ error: true, message: `YAML格式无效: ${yamlError.message}` });
      }
      
      // 创建执行记录
      const executionId = uuidv4();
      const now = new Date();
      
      const executionResult = await pool.query(
        `INSERT INTO executions (id, scene_id, status, start_time, params, logs, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
        [executionId, sceneId, 'running', now, params || {}, [], now]
      );
      
      const execution = executionResult.rows[0];
      
      // 异步执行场景（模拟）
      // 实际项目中，这里应该调用MidScense引擎执行场景
      setTimeout(async () => {
        try {
          // 模拟场景执行
          console.log(`执行场景 ${scene.name}（ID: ${sceneId}）`);
          
          // 模拟执行时间
          const executionTime = Math.floor(Math.random() * 5000) + 1000;
          await new Promise(resolve => setTimeout(resolve, executionTime));
          
          // 生成模拟日志
          const logs = [
            { timestamp: new Date(), level: 'info', message: '开始执行场景' },
            { timestamp: new Date(), level: 'info', message: '初始化完成' },
            { timestamp: new Date(), level: 'info', message: '执行步骤1' },
            { timestamp: new Date(), level: 'info', message: '执行步骤2' },
            { timestamp: new Date(), level: 'info', message: '执行完成' }
          ];
          
          // 随机成功或失败
          const status = Math.random() > 0.2 ? 'success' : 'failed';
          
          if (status === 'failed') {
            logs.push({ timestamp: new Date(), level: 'error', message: '执行出错：模拟错误' });
          }
          
          // 更新执行记录
          const endTime = new Date();
          await pool.query(
            `UPDATE executions 
             SET status = $1, end_time = $2, logs = $3 
             WHERE id = $4`,
            [status, endTime, JSON.stringify(logs), executionId]
          );
          
          console.log(`场景 ${scene.name}（ID: ${sceneId}）执行${status === 'success' ? '成功' : '失败'}`);
        } catch (error) {
          console.error(`执行场景 ${sceneId} 时出错:`, error);
          
          // 更新执行记录为失败状态
          await pool.query(
            `UPDATE executions 
             SET status = 'failed', end_time = $1, logs = $2 
             WHERE id = $3`,
            [new Date(), JSON.stringify([{ timestamp: new Date(), level: 'error', message: error.message }]), executionId]
          );
        }
      }, 100);
      
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

  // 删除执行记录
  router.delete('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // 检查执行记录是否存在
      const checkResult = await pool.query(
        'SELECT id FROM executions WHERE id = $1',
        [id]
      );
      
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: true, message: '未找到执行记录' });
      }
      
      await pool.query(
        'DELETE FROM executions WHERE id = $1',
        [id]
      );
      
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  // 批量删除执行记录（例如清空某个场景的执行历史）
  router.delete('/scene/:sceneId', async (req, res, next) => {
    try {
      const { sceneId } = req.params;
      
      await pool.query(
        'DELETE FROM executions WHERE scene_id = $1',
        [sceneId]
      );
      
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  return router;
};