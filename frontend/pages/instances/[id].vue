<template>
  <div>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading instance...</p>
    </div>
    
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
      <p>{{ error }}</p>
      <NuxtLink to="/" class="mt-4 inline-block btn btn-primary">Back to Scenes</NuxtLink>
    </div>
    
    <template v-else>
      <div class="flex justify-between items-center mb-6">
        <div>
          <NuxtLink :to="`/scenes/${instance.sceneId}`" class="text-blue-600 hover:underline mb-2 inline-block">
            &larr; Back to Scene
          </NuxtLink>
          <h1 class="text-3xl font-bold">{{ instance.scene.name }} Instance</h1>
        </div>
        <div class="flex items-center">
          <span class="inline-block w-3 h-3 rounded-full mr-2" 
                :class="{
                  'bg-green-500': instance.status === 'completed',
                  'bg-blue-500': instance.status === 'running',
                  'bg-red-500': instance.status === 'failed'
                }"></span>
          <span class="font-semibold capitalize">{{ instance.status }}</span>
        </div>
      </div>
      
      <div class="grid grid-cols-1 gap-6">
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Instance Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-sm text-gray-500">Created</p>
              <p>{{ new Date(instance.createdAt).toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Updated</p>
              <p>{{ new Date(instance.updatedAt).toLocaleString() }}</p>
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="text-lg font-semibold mb-2">Input Parameters</h3>
            <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{{ JSON.stringify(instance.inputParams, null, 2) }}</pre>
          </div>
          
          <div v-if="instance.outputResult">
            <h3 class="text-lg font-semibold mb-2">Output Result</h3>
            <pre class="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{{ JSON.stringify(instance.outputResult, null, 2) }}</pre>
          </div>
        </div>
        
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Execution Steps</h2>
          
          <div v-if="!instance.steps || instance.steps.length === 0" class="text-gray-500 text-center py-4">
            No steps recorded yet
          </div>
          
          <div v-else class="space-y-4">
            <div v-for="step in instance.steps" :key="step.id" class="border-l-4 pl-4" 
                  :class="{
                    'border-green-500': step.status === 'completed',
                    'border-blue-500': step.status === 'running',
                    'border-red-500': step.status === 'failed'
                  }">
              <div class="flex justify-between">
                <h3 class="font-semibold">{{ step.stepName }}</h3>
                <span class="text-sm capitalize" 
                      :class="{
                        'text-green-600': step.status === 'completed',
                        'text-blue-600': step.status === 'running',
                        'text-red-600': step.status === 'failed'
                      }">{{ step.status }}</span>
              </div>
              
              <div class="text-sm text-gray-500 mb-2">
                Started: {{ new Date(step.startTime).toLocaleString() }}
                <span v-if="step.endTime">
                  | Completed: {{ new Date(step.endTime).toLocaleString() }}
                </span>
              </div>
              
              <div class="bg-gray-50 p-3 rounded-md text-sm">
                <div>Step Data:</div>
                <pre class="overflow-x-auto mt-1">{{ JSON.stringify(step.stepData, null, 2) }}</pre>
              </div>
            </div>
          </div>
          
          <div v-if="instance.status === 'running'" class="mt-6 text-center">
            <button @click="fetchInstance" class="btn btn-primary">Refresh Status</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const instanceId = route.params.id;

const loading = ref(true);
const error = ref(null);
const instance = ref(null);

async function fetchInstance() {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await fetch(`${useRuntimeConfig().public.apiBase}/instances/${instanceId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Instance not found');
      }
      throw new Error('Failed to fetch instance');
    }
    
    instance.value = await response.json();
  } catch (err) {
    console.error('Error fetching instance:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchInstance();
});
</script> 