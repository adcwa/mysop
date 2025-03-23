const express = require('express');
const router = express.Router();
const sceneController = require('../controllers/sceneController');
const instanceController = require('../controllers/instanceController');
const yamlSceneController = require('../controllers/yamlSceneController');
const yamlInstanceController = require('../controllers/yamlInstanceController');

// JSON Scene routes
router.get('/scenes', sceneController.getAllScenes);
router.get('/scenes/:id', sceneController.getSceneById);
router.post('/scenes', sceneController.createScene);
router.put('/scenes/:id', sceneController.updateScene);
router.delete('/scenes/:id', sceneController.deleteScene);

// JSON Instance routes
router.get('/instances/:id', instanceController.getInstanceById);
router.post('/instances', instanceController.createAndRunInstance);
router.get('/scenes/:sceneId/instances', instanceController.getInstancesBySceneId);

// YAML Scene routes
router.get('/yaml-scenes', yamlSceneController.getAllYamlScenes);
router.get('/yaml-scenes/:id', yamlSceneController.getYamlSceneById);
router.post('/yaml-scenes', yamlSceneController.createYamlScene);
router.put('/yaml-scenes/:id', yamlSceneController.updateYamlScene);
router.delete('/yaml-scenes/:id', yamlSceneController.deleteYamlScene);

// YAML Instance routes
router.post('/yaml-instances', yamlInstanceController.createAndRunYamlInstance);

module.exports = router; 