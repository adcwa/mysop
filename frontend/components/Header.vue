<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-bold text-gray-800">MySOP</h1>
          </div>
          <nav class="ml-6 flex space-x-8">
            <NuxtLink to="/" class="inline-flex items-center px-1 pt-1 border-b-2"
              :class="[$route.path === '/' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">
              首页
            </NuxtLink>
            <NuxtLink to="/scenes" class="inline-flex items-center px-1 pt-1 border-b-2"
              :class="[$route.path.includes('/scenes') ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">
              场景管理
            </NuxtLink>
            <NuxtLink to="/executions" class="inline-flex items-center px-1 pt-1 border-b-2"
              :class="[$route.path.includes('/executions') ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']">
              执行历史
            </NuxtLink>
          </nav>
        </div>
        <div class="flex items-center">
          <button type="button" class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium">
            创建场景
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script> 