<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-2xl font-bold text-blue-600">MidScense Manager</NuxtLink>
        <nav class="flex space-x-4">
          <NuxtLink to="/" class="px-3 py-2 rounded-md hover:bg-gray-100">Scenes</NuxtLink>
          <NuxtLink to="/create" class="px-3 py-2 rounded-md hover:bg-gray-100">Create Scene</NuxtLink>
        </nav>
      </div>
    </header>
    
    <main class="flex-grow container mx-auto px-4 py-8">
      <slot />
    </main>
    
    <footer class="bg-gray-800 text-white py-6">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; {{ new Date().getFullYear() }} MidScense Scene Manager</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Component setup script
</script>

<style scoped>
/* Component styles */
</style> 