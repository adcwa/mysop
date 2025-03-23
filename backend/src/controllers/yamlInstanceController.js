const { YamlScene, SceneInstance, SceneInstanceStep } = require('../db/models');
const { v4: uuidv4 } = require('uuid');
const yaml = require('js-yaml');

// Create and run a new YAML scene instance
exports.createAndRunYamlInstance = async (req, res) => {
  try {
    const { sceneId, inputParams } = req.body;
    
    if (!sceneId) {
      return res.status(400).json({ message: 'YAML Scene ID is required' });
    }
    
    // Find the YAML scene
    const yamlScene = await YamlScene.findByPk(sceneId);
    if (!yamlScene) {
      return res.status(404).json({ message: 'YAML Scene not found' });
    }
    
    // Create a new instance
    const instance = await SceneInstance.create({
      id: uuidv4(),
      sceneId,
      sceneType: 'yaml',
      inputParams: inputParams || {},
      status: 'running'
    });
    
    // Start YAML scene execution in the background
    executeYamlScene(instance.id, yamlScene.yamlContent, inputParams || {});
    
    return res.status(201).json(instance);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to create YAML instance', error: error.message });
  }
};

// Helper function to execute a YAML scene
async function executeYamlScene(instanceId, yamlContent, inputParams) {
  try {
    // Get the instance
    const instance = await SceneInstance.findByPk(instanceId);
    if (!instance) {
      console.error(`Instance ${instanceId} not found`);
      return;
    }
    
    // Parse YAML content
    const yamlConfig = yaml.load(yamlContent);
    
    // Validate YAML schema
    if (!yamlConfig.steps || !Array.isArray(yamlConfig.steps)) {
      throw new Error('Invalid YAML schema: missing steps array');
    }
    
    // Execute each step defined in the YAML
    const results = {};
    let stepCounter = 0;
    
    for (const stepConfig of yamlConfig.steps) {
      stepCounter++;
      
      if (!stepConfig.name) {
        stepConfig.name = `Step ${stepCounter}`;
      }
      
      // Create step record
      const step = await SceneInstanceStep.create({
        id: uuidv4(),
        instanceId,
        stepNumber: stepCounter,
        stepName: stepConfig.name,
        stepData: stepConfig,
        status: 'running',
        startTime: new Date()
      });
      
      try {
        // Execute the step based on its type
        let result;
        
        switch (stepConfig.type) {
          case 'wait':
            result = await executeWaitStep(stepConfig.duration);
            break;
          case 'transform':
            result = await executeTransformStep(stepConfig.data, results);
            break;
          case 'conditional':
            result = await executeConditionalStep(stepConfig, results);
            break;
          case 'loop':
            result = await executeLoopStep(stepConfig, results);
            break;
          case 'notification':
            result = await executeNotificationStep(stepConfig);
            break;
          default:
            result = await executeGenericStep(stepConfig, inputParams, results);
        }
        
        // Store step result for potential use in subsequent steps
        if (stepConfig.id) {
          results[stepConfig.id] = result;
        }
        
        // Update step as completed
        await step.update({
          status: 'completed',
          endTime: new Date(),
          stepData: { 
            ...step.stepData, 
            result: result
          }
        });
        
      } catch (stepError) {
        // Update step with error
        await step.update({
          status: 'failed',
          endTime: new Date(),
          stepData: { 
            ...step.stepData, 
            error: stepError.message 
          }
        });
        
        // Update instance as failed
        await instance.update({
          status: 'failed',
          outputResult: { 
            error: `Step ${stepConfig.name} failed: ${stepError.message}`,
            partialResults: results
          }
        });
        
        // Stop execution
        return;
      }
    }
    
    // Update instance as completed
    await instance.update({
      status: 'completed',
      outputResult: {
        success: true,
        results
      }
    });
    
  } catch (error) {
    console.error(`Error executing YAML scene ${instanceId}:`, error);
    
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

// Step execution functions
async function executeWaitStep(duration) {
  const waitTime = parseInt(duration) || 1000;
  await new Promise(resolve => setTimeout(resolve, waitTime));
  return { waited: waitTime };
}

async function executeTransformStep(data, previousResults) {
  // Process data transformation using results from previous steps
  const transformedData = { ...data };
  
  // Replace reference placeholders with actual values from previous results
  if (data && typeof data === 'object') {
    for (const key in data) {
      const value = data[key];
      if (typeof value === 'string' && value.startsWith('$ref:')) {
        const refPath = value.substring(5).split('.');
        let refValue = previousResults;
        
        for (const pathPart of refPath) {
          if (refValue && refValue[pathPart] !== undefined) {
            refValue = refValue[pathPart];
          } else {
            refValue = null;
            break;
          }
        }
        
        transformedData[key] = refValue;
      }
    }
  }
  
  return transformedData;
}

async function executeConditionalStep(config, previousResults) {
  // Execute condition logic
  const conditionResult = evaluateCondition(config.condition, previousResults);
  
  if (conditionResult) {
    // Execute then branch
    if (config.then && Array.isArray(config.then)) {
      const results = {};
      for (const step of config.then) {
        // Here we'd recursively call step execution, but for simplicity we're just 
        // simulating it with a return value
        results[step.id] = { executed: true, step: step.name };
      }
      return { condition: true, results };
    }
  } else {
    // Execute else branch
    if (config.else && Array.isArray(config.else)) {
      const results = {};
      for (const step of config.else) {
        results[step.id] = { executed: true, step: step.name };
      }
      return { condition: false, results };
    }
  }
  
  return { condition: conditionResult };
}

function evaluateCondition(condition, previousResults) {
  // Simple condition evaluation - in reality would be more complex
  if (typeof condition === 'string' && condition.startsWith('$ref:')) {
    const refPath = condition.substring(5).split('.');
    let refValue = previousResults;
    
    for (const pathPart of refPath) {
      if (refValue && refValue[pathPart] !== undefined) {
        refValue = refValue[pathPart];
      } else {
        refValue = null;
        break;
      }
    }
    
    return !!refValue; // Convert to boolean
  }
  
  return !!condition; // Default: treat as boolean
}

async function executeLoopStep(config, previousResults) {
  const iterations = parseInt(config.iterations) || 1;
  const results = [];
  
  for (let i = 0; i < iterations; i++) {
    if (config.steps && Array.isArray(config.steps)) {
      const iterationResults = {};
      for (const step of config.steps) {
        // Here we'd recursively call step execution, but for simplicity we're just 
        // simulating it with a return value
        iterationResults[step.id] = { 
          executed: true, 
          step: step.name,
          iteration: i 
        };
      }
      results.push(iterationResults);
    }
  }
  
  return { iterations, results };
}

async function executeNotificationStep(config) {
  // In a real system, this would send an actual notification
  console.log(`NOTIFICATION: ${config.message || 'No message provided'}`);
  return { 
    notified: true, 
    timestamp: new Date().toISOString(),
    message: config.message || 'No message provided'
  };
}

async function executeGenericStep(config, inputParams, previousResults) {
  // For other step types, just return a generic result
  return { 
    executed: true,
    stepType: config.type || 'generic',
    timestamp: new Date().toISOString(),
    config: { ...config }
  };
} 