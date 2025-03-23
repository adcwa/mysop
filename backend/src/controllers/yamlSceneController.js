const { YamlScene, SceneInstance, SceneInstanceStep } = require('../db/models');
const { v4: uuidv4 } = require('uuid');
const yaml = require('js-yaml');

// Get all YAML scenes
exports.getAllYamlScenes = async (req, res) => {
  try {
    const scenes = await YamlScene.findAll({
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json(scenes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to get YAML scenes', error: error.message });
  }
};

// Get YAML scene by ID
exports.getYamlSceneById = async (req, res) => {
  try {
    const scene = await YamlScene.findByPk(req.params.id, {
      include: [{
        model: SceneInstance,
        as: 'instances',
        limit: 10,
        order: [['createdAt', 'DESC']],
        where: { sceneType: 'yaml' }
      }]
    });
    
    if (!scene) {
      return res.status(404).json({ message: 'YAML scene not found' });
    }
    
    return res.status(200).json(scene);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to get YAML scene', error: error.message });
  }
};

// Create a new YAML scene
exports.createYamlScene = async (req, res) => {
  try {
    const { name, description, yamlContent } = req.body;
    
    if (!name || !yamlContent) {
      return res.status(400).json({ message: 'Name and YAML content are required' });
    }
    
    // Validate YAML syntax
    try {
      yaml.load(yamlContent);
    } catch (yamlError) {
      return res.status(400).json({ message: 'Invalid YAML syntax', error: yamlError.message });
    }
    
    const scene = await YamlScene.create({
      id: uuidv4(),
      name,
      description,
      yamlContent
    });
    
    return res.status(201).json(scene);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create YAML scene', error: error.message });
  }
};

// Update a YAML scene
exports.updateYamlScene = async (req, res) => {
  try {
    const { name, description, yamlContent } = req.body;
    const scene = await YamlScene.findByPk(req.params.id);
    
    if (!scene) {
      return res.status(404).json({ message: 'YAML scene not found' });
    }
    
    // Validate YAML syntax if provided
    if (yamlContent) {
      try {
        yaml.load(yamlContent);
      } catch (yamlError) {
        return res.status(400).json({ message: 'Invalid YAML syntax', error: yamlError.message });
      }
    }
    
    await scene.update({
      name: name || scene.name,
      description: description !== undefined ? description : scene.description,
      yamlContent: yamlContent || scene.yamlContent
    });
    
    return res.status(200).json(scene);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update YAML scene', error: error.message });
  }
};

// Delete a YAML scene
exports.deleteYamlScene = async (req, res) => {
  try {
    const scene = await YamlScene.findByPk(req.params.id);
    
    if (!scene) {
      return res.status(404).json({ message: 'YAML scene not found' });
    }
    
    await scene.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to delete YAML scene', error: error.message });
  }
}; 