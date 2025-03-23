<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">{{ scene.name }}</h1>
      <div class="flex space-x-2">
        <button @click="executeScene" class="btn btn-primary" :disabled="isExecuting">
          <span v-if="isExecuting">Executing...</span>
          <span v-else>Execute Scene</span>
        </button>
        <button @click="editScene" class="btn btn-secondary">Edit</button>
        <button @click="deleteDialog = true" class="btn btn-danger">Delete</button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-2">
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">YAML Configuration</h2>
          <pre class="bg-gray-100 p-4 rounded-md overflow-auto font-mono text-sm">{{ scene.yamlContent }}</pre>
        </div>
        
        <div v-if="executionResult" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Execution Result</h2>
          <div class="mb-4">
            <span class="inline-block px-3 py-1 rounded-full" 
                  :class="executionResult.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ executionResult.status }}
            </span>
            <span class="text-gray-500 ml-2">{{ executionTime }}</span>
          </div>
          <pre class="bg-gray-100 p-4 rounded-md overflow-auto font-mono text-sm">{{ JSON.stringify(executionResult.data, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="md:col-span-1">
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Scene Details</h2>
          <div class="mb-4">
            <h3 class="text-sm font-medium text-gray-500">Description</h3>
            <p class="mt-1">{{ scene.description || 'No description provided' }}</p>
          </div>
          <div class="mb-4">
            <h3 class="text-sm font-medium text-gray-500">Created</h3>
            <p class="mt-1">{{ formatDate(scene.created_at) }}</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-500">Last Updated</h3>
            <p class="mt-1">{{ formatDate(scene.updated_at) }}</p>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">Execution History</h2>
          <div v-if="executionHistory.length === 0" class="text-gray-500">
            No execution history yet
          </div>
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="(execution, index) in executionHistory" :key="index" class="py-3">
              <div class="flex justify-between">
                <span class="inline-block px-2 py-1 text-xs rounded-full" 
                      :class="execution.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ execution.status }}
                </span>
                <span class="text-xs text-gray-500">{{ formatDate(execution.timestamp) }}</span>
              </div>
              <div class="mt-2 text-sm text-gray-700">
                {{ execution.duration }}ms
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <div v-if="deleteDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Delete Scene</h2>
        <p class="mb-6">Are you sure you want to delete this scene? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="deleteDialog = false" class="btn btn-secondary">Cancel</button>
          <button @click="confirmDelete" class="btn btn-danger" :disabled="isDeleting">
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const sceneId = route.params.id;

const scene = ref({
  id: '',
  name: '',
  description: '',
  yamlContent: '',
  created_at: null,
  updated_at: null
});

const executionResult = ref(null);
const executionHistory = ref([]);
const executionTime = ref('');
const isExecuting = ref(false);
const deleteDialog = ref(false);
const isDeleting = ref(false);

onMounted(async () => {
  await loadScene();
  await loadExecutionHistory();
});

async function loadScene() {
  try {
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/yaml-scenes/${sceneId}`);
    if (!response.ok) {
      throw new Error('Failed to load scene');
    }
    scene.value = await response.json();
  } catch (error) {
    console.error('Error loading scene:', error);
  }
}

async function loadExecutionHistory() {
  try {
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/yaml-scenes/${sceneId}/history`);
    if (!response.ok) {
      throw new Error('Failed to load execution history');
    }
    executionHistory.value = await response.json();
  } catch (error) {
    console.error('Error loading execution history:', error);
  }
}

async function executeScene() {
  isExecuting.value = true;
  const startTime = new Date();
  
  try {
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/yaml-scenes/${sceneId}/execute`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to execute scene');
    }
    
    executionResult.value = await response.json();
    const endTime = new Date();
    executionTime.value = `Executed in ${endTime - startTime}ms`;
    
    // Refresh execution history
    await loadExecutionHistory();
  } catch (error) {
    console.error('Error executing scene:', error);
    executionResult.value = {
      status: 'error',
      data: { error: error.message }
    };
  } finally {
    isExecuting.value = false;
  }
}

function editScene() {
  router.push(`/yaml-scenes/${sceneId}/edit`);
}

async function confirmDelete() {
  isDeleting.value = true;
  
  try {
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/yaml-scenes/${sceneId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete scene');
    }
    
    router.push('/yaml-scenes');
  } catch (error) {
    console.error('Error deleting scene:', error);
  } finally {
    isDeleting.value = false;
    deleteDialog.value = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
</script> 