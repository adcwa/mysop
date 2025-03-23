const express = require('express');
const router = express.Router();
const sceneController = require('../controllers/sceneController');
const instanceController = require('../controllers/instanceController');

// Scene routes
router.get('/scenes', sceneController.getAllScenes);
router.get('/scenes/:id', sceneController.getSceneById);
router.post('/scenes', sceneController.createScene);
router.put('/scenes/:id', sceneController.updateScene);
router.delete('/scenes/:id', sceneController.deleteScene);

// Instance routes
router.get('/instances/:id', instanceController.getInstanceById);
router.post('/instances', instanceController.createAndRunInstance);
router.get('/scenes/:sceneId/instances', instanceController.getInstancesBySceneId);

module.exports = router; 