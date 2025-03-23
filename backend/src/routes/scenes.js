const express = require('express');
const { v4: uuidv4 } = require('uuid');
const yaml = require('js-yaml');

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

  return router;
}; 