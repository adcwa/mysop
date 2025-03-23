<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Create New YAML Scene</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="createScene">
        <div class="form-group">
          <label for="name" class="form-label">Scene Name</label>
          <input 
            id="name" 
            v-model="sceneForm.name" 
            type="text" 
            class="form-input" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea 
            id="description" 
            v-model="sceneForm.description" 
            class="form-textarea" 
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="yamlContent" class="form-label">YAML Content</label>
          <div class="relative">
            <textarea 
              id="yamlContent" 
              v-model="sceneForm.yamlContent" 
              class="form-textarea font-mono" 
              rows="15"
              @input="validateYaml"
              required
            ></textarea>
            <div v-if="yamlError" class="text-red-500 text-sm mt-1">{{ yamlError }}</div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-4">
          <button type="button" @click="useTemplateScene" class="btn btn-secondary">Use Template</button>
          <button type="submit" class="btn btn-primary" :disabled="loading || !!yamlError">
            <span v-if="loading">Creating...</span>
            <span v-else>Create YAML Scene</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const yamlError = ref('');

const sceneForm = reactive({
  name: '',
  description: '',
  yamlContent: ''
});

async function validateYaml() {
  try {
    // YAML validation happens on the server
    // We could add client-side validation with a YAML library but for now we'll keep it simple
    yamlError.value = '';
  } catch (error) {
    yamlError.value = 'Invalid YAML format';
  }
}

function useTemplateScene() {
  const template = `# Scene configuration
name: Example Scene
description: A demonstration of YAML scene configuration

# Scene steps to execute
steps:
  - id: step1
    name: Initialize
    type: initialize
    data:
      message: Starting the scene execution
      
  - id: step2
    name: Wait
    type: wait
    duration: 2000
    
  - id: step3
    name: Process Data
    type: transform
    data:
      input: $ref:step1.result
      transform: uppercase
      
  - id: step4
    name: Conditional Step
    type: conditional
    condition: $ref:step3.success
    then:
      - id: step4_success
        name: Success Path
        type: notification
        message: Data processing was successful
    else:
      - id: step4_failure
        name: Failure Path
        type: notification
        message: Data processing failed
        
  - id: step5
    name: Loop Step
    type: loop
    iterations: 3
    steps:
      - id: substep1
        name: Sub-step in Loop
        type: generic
        data:
          counter: $ref:index
          
  - id: step6
    name: Finalize
    type: notification
    message: Scene execution completed`;
  
  sceneForm.yamlContent = template;
  validateYaml();
}

async function createScene() {
  if (yamlError.value) return;
  
  try {
    loading.value = true;
    
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/yaml-scenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: sceneForm.name,
        description: sceneForm.description,
        yamlContent: sceneForm.yamlContent
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create YAML scene');
    }
    
    const newScene = await response.json();
    router.push(`/yaml-scenes/${newScene.id}`);
  } catch (error) {
    console.error('Error creating YAML scene:', error);
    yamlError.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script> 