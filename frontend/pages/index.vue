<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Scenes</h1>
    
    <div class="mb-6 flex justify-between items-center">
      <div>
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Search scenes..." 
          class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <NuxtLink to="/create" class="btn btn-primary">Create New Scene</NuxtLink>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading scenes...</p>
    </div>
    
    <div v-else-if="scenes.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
      <h3 class="text-xl font-medium text-gray-500">No scenes found</h3>
      <p class="mt-2 text-gray-400">Create your first scene to get started</p>
      <NuxtLink to="/create" class="mt-4 inline-block btn btn-primary">Create Scene</NuxtLink>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="scene in filteredScenes" :key="scene.id" class="card hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-bold mb-2">{{ scene.name }}</h3>
        <p class="text-gray-600 mb-4 line-clamp-2">{{ scene.description || 'No description provided' }}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">
            Created: {{ new Date(scene.createdAt).toLocaleDateString() }}
          </span>
          <NuxtLink :to="`/scenes/${scene.id}`" class="btn btn-primary text-sm">View Details</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const loading = ref(true);
const scenes = ref([]);
const searchTerm = ref('');

const filteredScenes = computed(() => {
  if (!searchTerm.value) return scenes.value;
  
  const term = searchTerm.value.toLowerCase();
  return scenes.value.filter(scene => 
    scene.name.toLowerCase().includes(term) || 
    (scene.description && scene.description.toLowerCase().includes(term))
  );
});

async function fetchScenes() {
  try {
    loading.value = true;
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/scenes`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch scenes');
    }
    
    scenes.value = await response.json();
  } catch (error) {
    console.error('Error fetching scenes:', error);
    // You could add error handling, notification, etc.
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchScenes();
});
</script> 