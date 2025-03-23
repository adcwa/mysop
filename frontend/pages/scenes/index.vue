<template>
  <div>
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div class="ml-4 mt-2">
          <h3 class="text-lg leading-6 font-medium text-gray-900">场景管理</h3>
          <p class="mt-1 text-sm text-gray-500">管理所有YAML场景定义</p>
        </div>
        <div class="ml-4 mt-2 flex-shrink-0">
          <button type="button" class="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            创建场景
          </button>
        </div>
      </div>
    </div>
    
    <!-- 场景搜索筛选 -->
    <div class="bg-white py-6 px-4 sm:px-6 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div class="flex-1">
          <label for="search" class="sr-only">搜索场景</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input type="text" name="search" id="search" class="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="搜索场景名称或描述">
          </div>
        </div>
        <div class="w-full sm:w-64">
          <select class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
            <option value="">所有类型</option>
            <option value="data-process">数据处理</option>
            <option value="notification">通知</option>
            <option value="integration">集成</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 场景列表 -->
    <div class="bg-white overflow-hidden shadow">
      <ul class="divide-y divide-gray-200" v-if="scenes.length > 0">
        <li v-for="scene in scenes" :key="scene.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="min-w-0 flex-1">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-primary-light text-white rounded-md p-2">
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-sm font-medium text-gray-900">{{ scene.name }}</h4>
                  <p class="text-sm text-gray-500 mt-1">{{ scene.description }}</p>
                  <div class="mt-2 flex items-center text-xs text-gray-500">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                      {{ scene.type }}
                    </span>
                    <span>更新于 {{ formatDate(scene.updated_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="ml-5 flex-shrink-0 flex items-center space-x-2">
              <button class="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button class="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button class="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                执行
              </button>
            </div>
          </div>
        </li>
      </ul>
      
      <!-- 空状态 -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">没有场景</h3>
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
      
      <!-- 分页 -->
      <div v-if="scenes.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            上一页
          </a>
          <a href="#" class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            下一页
          </a>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示第
              <span class="font-medium">1</span>
              到
              <span class="font-medium">{{ scenes.length }}</span>
              条，共
              <span class="font-medium">{{ scenes.length }}</span>
              条
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">上一页</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </a>
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">下一页</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScenesListPage',
  data() {
    return {
      scenes: []
    }
  },
  created() {
    // 模拟数据
    this.scenes = [
      {
        id: 1,
        name: '数据导入场景',
        description: '从CSV文件导入数据并进行处理',
        type: '数据处理',
        updated_at: '2023-06-15T14:30:00Z'
      },
      {
        id: 2,
        name: '数据清洗流程',
        description: '对原始数据进行清洗和转换',
        type: '数据处理',
        updated_at: '2023-06-14T10:15:00Z'
      },
      {
        id: 3,
        name: '定时备份流程',
        description: '每日定时将数据备份到S3存储',
        type: '集成',
        updated_at: '2023-06-10T16:45:00Z'
      },
      {
        id: 4,
        name: '异常通知流程',
        description: '监控数据并在异常时发送通知',
        type: '通知',
        updated_at: '2023-06-05T09:20:00Z'
      },
      {
        id: 5,
        name: '月度报表生成',
        description: '自动生成和发送月度统计报表',
        type: '数据处理',
        updated_at: '2023-05-28T11:10:00Z'
      }
    ];
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
  }
}
</script> 