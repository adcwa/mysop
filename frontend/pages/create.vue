<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Create New Scene</h1>
    
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
          <label for="sceneDefinition" class="form-label">Scene Definition (JSON)</label>
          <div class="relative">
            <textarea 
              id="sceneDefinition" 
              v-model="sceneDefinitionStr" 
              class="form-textarea font-mono" 
              rows="15"
              @input="validateJson"
              required
            ></textarea>
            <div v-if="jsonError" class="text-red-500 text-sm mt-1">{{ jsonError }}</div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-4">
          <button type="button" @click="useTemplateScene" class="btn btn-secondary">Use Template</button>
          <button type="submit" class="btn btn-primary" :disabled="loading || !!jsonError">
            <span v-if="loading">Creating...</span>
            <span v-else>Create Scene</span>
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
const jsonError = ref('');

const sceneForm = reactive({
  name: '',
  description: '',
});

const sceneDefinitionStr = ref('{}');

function validateJson() {
  try {
    JSON.parse(sceneDefinitionStr.value);
    jsonError.value = '';
  } catch (error) {
    jsonError.value = 'Invalid JSON format';
  }
}

function useTemplateScene() {
  const template = {
    version: '1.0',
    title: 'Example Scene',
    objects: [
      {
        id: 'cube',
        type: 'box',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        material: {
          color: '#FF0000',
          roughness: 0.5,
          metalness: 0.5
        }
      },
      {
        id: 'light',
        type: 'directionalLight',
        position: { x: 5, y: 10, z: 7 },
        intensity: 1.5,
        color: '#FFFFFF'
      }
    ],
    camera: {
      position: { x: 5, y: 5, z: 5 },
      lookAt: { x: 0, y: 0, z: 0 }
    },
    animations: [
      {
        targetId: 'cube',
        property: 'rotation.y',
        keyframes: [
          { time: 0, value: 0 },
          { time: 2, value: 6.28 }
        ],
        loop: true
      }
    ]
  };
  
  sceneDefinitionStr.value = JSON.stringify(template, null, 2);
  validateJson();
}

async function createScene() {
  if (jsonError.value) return;
  
  try {
    loading.value = true;
    const sceneData = JSON.parse(sceneDefinitionStr.value);
    
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/scenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: sceneForm.name,
        description: sceneForm.description,
        sceneData
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create scene');
    }
    
    const newScene = await response.json();
    router.push(`/scenes/${newScene.id}`);
  } catch (error) {
    console.error('Error creating scene:', error);
    // Handle error (show notification, etc.)
  } finally {
    loading.value = false;
  }
}
</script> 