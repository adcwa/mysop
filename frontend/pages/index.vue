<template>
  <div>
    <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-lg font-medium text-gray-900">欢迎使用 MySOP 场景编排平台</h2>
        <p class="mt-1 text-sm text-gray-500">基于MidScense引擎构建的YAML场景管理工具</p>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <!-- 场景统计卡片 -->
          <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-primary-light rounded-md p-3">
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    场景总数
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ sceneCount }}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
            <div class="bg-gray-100 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <NuxtLink to="/scenes" class="font-medium text-primary hover:text-primary-dark">
                  查看所有场景
                  <span aria-hidden="true"> &rarr;</span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- 最近执行卡片 -->
          <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-primary-light rounded-md p-3">
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    最近执行
                  </dt>
                  <dd class="flex items-baseline">
                    <div class="text-2xl font-semibold text-gray-900">
                      {{ executionCount }}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
            <div class="bg-gray-100 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <NuxtLink to="/executions" class="font-medium text-primary hover:text-primary-dark">
                  查看执行历史
                  <span aria-hidden="true"> &rarr;</span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- 快速操作卡片 -->
          <div class="bg-gray-50 overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-primary-light rounded-md p-3">
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    快速操作
                  </dt>
                  <dd class="mt-2">
                    <button type="button" class="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      创建新场景
                    </button>
                  </dd>
                </div>
              </div>
            </div>
            <div class="bg-gray-100 px-4 py-4 sm:px-6">
              <div class="text-sm">
                <a href="#" class="font-medium text-primary hover:text-primary-dark">
                  查看教程
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近场景列表 -->
    <div class="mt-8 bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium text-gray-900">最近场景</h3>
        <p class="mt-1 text-sm text-gray-500">最近创建或更新的场景</p>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <div class="flow-root">
          <ul v-if="recentScenes.length > 0" class="-my-5 divide-y divide-gray-200">
            <li v-for="scene in recentScenes" :key="scene.id" class="py-4">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ scene.name }}
                  </p>
                  <p class="text-sm text-gray-500 truncate">
                    {{ scene.description }}
                  </p>
                </div>
                <div class="flex items-center">
                  <button class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-dark bg-primary-light hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark mr-2">
                    查看
                  </button>
                  <button class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    执行
                  </button>
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="text-center py-6">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">暂无场景</h3>
            <p class="mt-1 text-sm text-gray-500">开始创建您的第一个场景</p>
            <div class="mt-6">
              <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                创建场景
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      sceneCount: 0,
      executionCount: 0,
      recentScenes: []
    }
  },
  created() {
    // 模拟数据，实际项目中应该从API获取
    this.sceneCount = 5;
    this.executionCount = 12;
    this.recentScenes = [
      {
        id: 1,
        name: '数据导入场景',
        description: '从CSV文件导入数据并进行处理'
      },
      {
        id: 2,
        name: '数据清洗流程',
        description: '对原始数据进行清洗和转换'
      },
      {
        id: 3,
        name: '定时备份流程',
        description: '每日定时将数据备份到S3存储'
      }
    ];
  }
}
</script> 