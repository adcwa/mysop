const { Scene, SceneInstance, SceneInstanceStep } = require('../db/models');
const { v4: uuidv4 } = require('uuid');

// Create a mock MidScene class since the real package doesn't exist
class MidScene {
  constructor(sceneData) {
    this.sceneData = sceneData;
    this.stepCallbacks = [];
  }

  onStep(callback) {
    this.stepCallback = callback;
  }

  async run(inputParams) {
    // Mock the execution of scene steps
    const steps = [
      { name: 'Initialize', number: 1, data: { action: 'init', params: inputParams } },
      { name: 'Process', number: 2, data: { action: 'process', target: this.sceneData.objects?.[0]?.id } },
      { name: 'Finalize', number: 3, data: { action: 'finalize', result: 'success' } }
    ];

    const result = { success: true, processedObjects: this.sceneData.objects || [] };
    
    // Execute each step with a delay to simulate processing
    for (const step of steps) {
      if (this.stepCallback) {
        const complete = await this.stepCallback(step.name, step.number, step.data);
        // Wait a bit to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        await complete({ status: 'completed', data: step.data });
      }
    }
    
    return result;
  }
}

// Get instance by ID
exports.getInstanceById = async (req, res) => {
  try {
    const instance = await SceneInstance.findByPk(req.params.id, {
      include: [
        {
          model: Scene,
          as: 'scene'
        },
        {
          model: SceneInstanceStep,
          as: 'steps',
          order: [['stepNumber', 'ASC']]
        }
      ]
    });
    
    if (!instance) {
      return res.status(404).json({ message: 'Instance not found' });
    }
    
    return res.status(200).json(instance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to get instance', error: error.message });
  }
};

// Create and run a new instance
exports.createAndRunInstance = async (req, res) => {
  try {
    const { sceneId, inputParams } = req.body;
    
    if (!sceneId || !inputParams) {
      return res.status(400).json({ message: 'Scene ID and input parameters are required' });
    }
    
    // Find the scene
    const scene = await Scene.findByPk(sceneId);
    if (!scene) {
      return res.status(404).json({ message: 'Scene not found' });
    }
    
    // Create a new instance
    const instance = await SceneInstance.create({
      id: uuidv4(),
      sceneId,
      inputParams,
      status: 'running'
    });
    
    // Start scene execution in the background
    executeScene(instance.id, scene.sceneData, inputParams);
    
    return res.status(201).json(instance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create instance', error: error.message });
  }
};

// Get all instances for a scene
exports.getInstancesBySceneId = async (req, res) => {
  try {
    const { sceneId } = req.params;
    
    const instances = await SceneInstance.findAll({
      where: { sceneId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: SceneInstanceStep,
          as: 'steps',
          order: [['stepNumber', 'ASC']],
          limit: 1
        }
      ]
    });
    
    return res.status(200).json(instances);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to get instances', error: error.message });
  }
};

// Helper function to execute a scene
async function executeScene(instanceId, sceneData, inputParams) {
  try {
    // Get the instance
    const instance = await SceneInstance.findByPk(instanceId);
    if (!instance) {
      console.error(`Instance ${instanceId} not found`);
      return;
    }
    
    // Initialize MidScene
    const midScene = new MidScene(sceneData);
    
    // Set up progress callback
    midScene.onStep(async (stepName, stepNumber, stepData) => {
      // Record step start
      const step = await SceneInstanceStep.create({
        id: uuidv4(),
        instanceId,
        stepNumber,
        stepName,
        stepData,
        status: 'running',
        startTime: new Date()
      });
      
      return async (stepResult) => {
        // Record step completion
        await step.update({
          status: 'completed',
          endTime: new Date(),
          stepData: { ...step.stepData, result: stepResult }
        });
      };
    });
    
    // Run the scene
    const result = await midScene.run(inputParams);
    
    // Update instance with result
    await instance.update({
      status: 'completed',
      outputResult: result
    });
    
  } catch (error) {
    console.error(`Error executing scene ${instanceId}:`, error);
    
    // Update instance with error
    const instance = await SceneInstance.findByPk(instanceId);
    if (instance) {
      await instance.update({
        status: 'failed',
        outputResult: { error: error.message }
      });
    }
    
    // Update any running steps with error
    const runningSteps = await SceneInstanceStep.findAll({
      where: {
        instanceId,
        status: 'running'
      }
    });
    
    for (const step of runningSteps) {
      await step.update({
        status: 'failed',
        endTime: new Date(),
        stepData: { ...step.stepData, error: error.message }
      });
    }
  }
} 