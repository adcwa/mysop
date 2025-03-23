const { Scene, SceneInstance, SceneInstanceStep } = require('../db/models');
const { v4: uuidv4 } = require('uuid');

// Get all scenes
exports.getAllScenes = async (req, res) => {
  try {
    const scenes = await Scene.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(scenes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to get scenes', error: error.message });
  }
};

// Get scene by ID
exports.getSceneById = async (req, res) => {
  try {
    const scene = await Scene.findByPk(req.params.id, {
      include: [{
        model: SceneInstance,
        as: 'instances',
        limit: 10,
        order: [['createdAt', 'DESC']]
      }]
    });
    
    if (!scene) {
      return res.status(404).json({ message: 'Scene not found' });
    }
    
    return res.status(200).json(scene);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to get scene', error: error.message });
  }
};

// Create a new scene
exports.createScene = async (req, res) => {
  try {
    const { name, description, sceneData } = req.body;
    
    if (!name || !sceneData) {
      return res.status(400).json({ message: 'Name and scene data are required' });
    }
    
    const scene = await Scene.create({
      id: uuidv4(),
      name,
      description,
      sceneData
    });
    
    return res.status(201).json(scene);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create scene', error: error.message });
  }
};

// Update a scene
exports.updateScene = async (req, res) => {
  try {
    const { name, description, sceneData } = req.body;
    const scene = await Scene.findByPk(req.params.id);
    
    if (!scene) {
      return res.status(404).json({ message: 'Scene not found' });
    }
    
    await scene.update({
      name: name || scene.name,
      description: description !== undefined ? description : scene.description,
      sceneData: sceneData || scene.sceneData
    });
    
    return res.status(200).json(scene);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update scene', error: error.message });
  }
};

// Delete a scene
exports.deleteScene = async (req, res) => {
  try {
    const scene = await Scene.findByPk(req.params.id);
    
    if (!scene) {
      return res.status(404).json({ message: 'Scene not found' });
    }
    
    await scene.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete scene', error: error.message });
  }
}; 