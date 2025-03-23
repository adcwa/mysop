<template>
  <footer class="bg-white">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500">
          &copy; {{ new Date().getFullYear() }} MySOP 场景编排平台
        </div>
        <div class="text-sm text-gray-500">
          基于 MidScense 引擎构建
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script> 