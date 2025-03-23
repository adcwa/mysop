<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">YAML Scenes</h1>
      <router-link to="/yaml-create" class="btn btn-primary">
        Create New Scene
      </router-link>
    </div>
    
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="flex justify-center p-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="scenes.length === 0" class="p-12 text-center">
        <p class="text-xl text-gray-500 mb-4">No scenes found</p>
        <router-link to="/yaml-create" class="text-primary hover:underline">Create your first scene</router-link>
      </div>
      
      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="scene in scenes" :key="scene.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  <router-link :to="`/yaml-scenes/${scene.id}`" class="hover:text-primary">
                    {{ scene.name }}
                  </router-link>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 truncate max-w-xs">
                  {{ scene.description || 'No description' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(scene.created_at) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(scene.updated_at) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="executeScene(scene.id)" class="text-primary hover:text-primary-dark">Execute</button>
                  <router-link :to="`/yaml-scenes/${scene.id}/edit`" class="text-indigo-600 hover:text-indigo-900">Edit</router-link>
                  <button @click="confirmDelete(scene)" class="text-red-600 hover:text-red-900">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <div v-if="deleteDialog.show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4">Delete Scene</h2>
        <p class="mb-6">Are you sure you want to delete <span class="font-semibold">{{ deleteDialog.scene?.name }}</span>? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="deleteDialog.show = false" class="btn btn-secondary">Cancel</button>
          <button @click="deleteScene" class="btn btn-danger" :disabled="deleteDialog.isDeleting">
            {{ deleteDialog.isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const scenes = ref([]);
const loading = ref(true);

const deleteDialog = reactive({
  show: false,
  scene: null,
  isDeleting: false
});

onMounted(async () => {
  await loadScenes();
});

async function loadScenes() {
  try {
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/yaml-scenes`);
    if (!response.ok) {
      throw new Error('Failed to load scenes');
    }
    scenes.value = await response.json();
  } catch (error) {
    console.error('Error loading scenes:', error);
  } finally {
    loading.value = false;
  }
}

async function executeScene(sceneId) {
  try {
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/yaml-scenes/${sceneId}/execute`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Failed to execute scene');
    }
    
    router.push(`/yaml-scenes/${sceneId}`);
  } catch (error) {
    console.error('Error executing scene:', error);
  }
}

function confirmDelete(scene) {
  deleteDialog.scene = scene;
  deleteDialog.show = true;
}

async function deleteScene() {
  if (!deleteDialog.scene) return;
  
  deleteDialog.isDeleting = true;
  
  try {
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/yaml-scenes/${deleteDialog.scene.id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete scene');
    }
    
    // Remove the scene from the list
    scenes.value = scenes.value.filter(s => s.id !== deleteDialog.scene.id);
    deleteDialog.show = false;
  } catch (error) {
    console.error('Error deleting scene:', error);
  } finally {
    deleteDialog.isDeleting = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('default', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}
</script> 