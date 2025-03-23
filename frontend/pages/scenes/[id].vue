<template>
  <div>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading scene...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
      <p>{{ error }}</p>
      <NuxtLink to="/" class="mt-4 inline-block btn btn-primary">Back to Scenes</NuxtLink>
    </div>
    
    <template v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">{{ scene.name }}</h1>
        <div class="flex space-x-3">
          <button @click="runScene" class="btn btn-primary" :disabled="runningInstance">
            <span v-if="runningInstance">Running...</span>
            <span v-else>Run Scene</span>
          </button>
          <button @click="confirmDelete = true" class="btn btn-danger">Delete</button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="card">
            <h2 class="text-xl font-bold mb-4">Scene Details</h2>
            <p class="mb-4 text-gray-700">{{ scene.description || 'No description provided' }}</p>
            
            <div class="mt-4">
              <h3 class="text-lg font-semibold mb-2">Scene Definition</h3>
              <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{{ JSON.stringify(scene.sceneData, null, 2) }}</pre>
            </div>
          </div>
        </div>
        
        <div>
          <div class="card">
            <h2 class="text-xl font-bold mb-4">Recent Instances</h2>
            
            <div v-if="!scene.instances || scene.instances.length === 0" class="text-gray-500 text-center py-4">
              No instances yet
            </div>
            
            <div v-else>
              <div v-for="instance in scene.instances" :key="instance.id" class="border-b last:border-b-0 py-3">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="flex items-center">
                      <span class="inline-block w-2 h-2 rounded-full mr-2" 
                            :class="{
                              'bg-green-500': instance.status === 'completed',
                              'bg-blue-500': instance.status === 'running',
                              'bg-red-500': instance.status === 'failed'
                            }"></span>
                      <span class="capitalize">{{ instance.status }}</span>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ new Date(instance.createdAt).toLocaleString() }}
                    </div>
                  </div>
                  <NuxtLink :to="`/instances/${instance.id}`" class="text-blue-600 hover:underline">
                    Details
                  </NuxtLink>
                </div>
              </div>
            </div>
            
            <div v-if="scene.instances && scene.instances.length > 0" class="mt-4 text-center">
              <NuxtLink :to="`/scenes/${scene.id}/instances`" class="text-blue-600 hover:underline">
                View All Instances
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div v-if="confirmDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 class="text-xl font-bold mb-4">Confirm Delete</h2>
          <p class="mb-6">Are you sure you want to delete this scene? This action cannot be undone.</p>
          <div class="flex justify-end space-x-3">
            <button @click="confirmDelete = false" class="btn btn-secondary">Cancel</button>
            <button @click="deleteScene" class="btn btn-danger" :disabled="deleting">
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const sceneId = route.params.id;

const loading = ref(true);
const error = ref(null);
const scene = ref(null);
const confirmDelete = ref(false);
const deleting = ref(false);
const runningInstance = ref(false);

async function fetchScene() {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/scenes/${sceneId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Scene not found');
      }
      throw new Error('Failed to fetch scene');
    }
    
    scene.value = await response.json();
  } catch (err) {
    console.error('Error fetching scene:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

async function deleteScene() {
  try {
    deleting.value = true;
    
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/scenes/${sceneId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete scene');
    }
    
    router.push('/');
  } catch (err) {
    console.error('Error deleting scene:', err);
    // Show error message
    confirmDelete.value = false;
  } finally {
    deleting.value = false;
  }
}

async function runScene() {
  try {
    runningInstance.value = true;
    
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/instances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sceneId: sceneId,
        inputParams: {}
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to run scene');
    }
    
    const instance = await response.json();
    router.push(`/instances/${instance.id}`);
  } catch (err) {
    console.error('Error running scene:', err);
    // Show error message
  } finally {
    runningInstance.value = false;
  }
}

onMounted(() => {
  fetchScene();
});
</script> 