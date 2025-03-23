const express = require('express');
const router = express.Router();
const yamlSceneController = require('../controllers/yamlSceneController');

// 获取所有YAML场景
router.get('/yaml-scenes', yamlSceneController.getAllScenes);

// 获取单个YAML场景
router.get('/yaml-scenes/:id', yamlSceneController.getSceneById);

// 创建新的YAML场景
router.post('/yaml-scenes', yamlSceneController.createScene);

// 更新YAML场景
router.put('/yaml-scenes/:id', yamlSceneController.updateScene);

// 删除YAML场景
router.delete('/yaml-scenes/:id', yamlSceneController.deleteScene);

// 执行YAML场景
router.post('/yaml-scenes/:id/execute', yamlSceneController.executeScene);

// 获取场景执行历史
router.get('/yaml-scenes/:id/history', yamlSceneController.getExecutionHistory);

module.exports = router; 