<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Edit YAML Scene</h1>
    
    <div v-if="loading" class="flex justify-center my-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
    
    <div v-else class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="updateScene">
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
              rows="20"
              @input="validateYaml"
              required
            ></textarea>
            <div v-if="yamlError" class="text-red-500 text-sm mt-1">{{ yamlError }}</div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-between">
          <button type="button" @click="goBack" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="isSaving || !!yamlError">
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const sceneId = route.params.id;

const loading = ref(true);
const isSaving = ref(false);
const yamlError = ref('');

const sceneForm = reactive({
  name: '',
  description: '',
  yamlContent: ''
});

onMounted(async () => {
  await loadScene();
});

async function loadScene() {
  try {
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/yaml-scenes/${sceneId}`);
    if (!response.ok) {
      throw new Error('Failed to load scene');
    }
    const scene = await response.json();
    
    sceneForm.name = scene.name;
    sceneForm.description = scene.description || '';
    sceneForm.yamlContent = scene.yamlContent;
  } catch (error) {
    console.error('Error loading scene:', error);
    yamlError.value = 'Failed to load scene data. Please try again.';
  } finally {
    loading.value = false;
  }
}

async function validateYaml() {
  try {
    // Here we would ideally validate the YAML client-side
    // But for simplicity, we'll just clear any existing errors
    yamlError.value = '';
  } catch (error) {
    yamlError.value = 'Invalid YAML format';
  }
}

async function updateScene() {
  if (yamlError.value) return;
  
  isSaving.value = true;
  
  try {
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/yaml-scenes/${sceneId}`, {
      method: 'PUT',
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
      throw new Error(errorData.message || 'Failed to update scene');
    }
    
    router.push(`/yaml-scenes/${sceneId}`);
  } catch (error) {
    console.error('Error updating scene:', error);
    yamlError.value = error.message;
  } finally {
    isSaving.value = false;
  }
}

function goBack() {
  router.back();
}
</script> 