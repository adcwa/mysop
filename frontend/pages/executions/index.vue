<template>
  <div>
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div class="ml-4 mt-2">
          <h3 class="text-lg leading-6 font-medium text-gray-900">执行历史</h3>
          <p class="mt-1 text-sm text-gray-500">查看所有场景的执行记录和结果</p>
        </div>
        <div class="ml-4 mt-2 flex-shrink-0">
          <button type="button" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            清除所有历史
          </button>
        </div>
      </div>
    </div>
    
    <!-- 历史记录筛选 -->
    <div class="bg-white py-6 px-4 sm:px-6 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div class="flex-1">
          <label for="search" class="sr-only">搜索执行记录</label>
          <div class="relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
            </div>
            <input type="text" name="search" id="search" class="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md" placeholder="搜索场景名称">
          </div>
        </div>
        <div class="w-full sm:w-48">
          <select class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
            <option value="">所有状态</option>
            <option value="success">成功</option>
            <option value="failed">失败</option>
            <option value="running">执行中</option>
          </select>
        </div>
        <div class="w-full sm:w-48">
          <select class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
            <option value="">所有时间</option>
            <option value="today">今天</option>
            <option value="week">本周</option>
            <option value="month">本月</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 执行历史列表 -->
    <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">场景名称</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">状态</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">开始时间</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">结束时间</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">耗时</th>
            <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span class="sr-only">操作</span>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="execution in executions" :key="execution.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
              <div class="font-medium text-gray-900">{{ execution.sceneName }}</div>
              <div class="text-gray-500">ID: {{ execution.id }}</div>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm">
              <span class="inline-flex rounded-full px-2 text-xs font-semibold leading-5" 
                    :class="{
                      'bg-green-100 text-green-800': execution.status === 'success',
                      'bg-red-100 text-red-800': execution.status === 'failed',
                      'bg-yellow-100 text-yellow-800': execution.status === 'running'
                    }">
                {{ getStatusText(execution.status) }}
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ formatDateTime(execution.startTime) }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ execution.endTime ? formatDateTime(execution.endTime) : '-' }}
            </td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {{ execution.duration }}
            </td>
            <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
              <button class="text-primary hover:text-primary-dark mr-4">查看详情</button>
              <button class="text-gray-500 hover:text-gray-700">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 空状态 -->
      <div v-if="executions.length === 0" class="text-center py-12 bg-white">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">没有执行记录</h3>
        <p class="mt-1 text-sm text-gray-500">当场景被执行后，记录将显示在这里</p>
        <div class="mt-6">
          <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            返回场景列表
          </button>
        </div>
      </div>
      
      <!-- 分页 -->
      <div v-if="executions.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
              <span class="font-medium">{{ executions.length }}</span>
              条，共
              <span class="font-medium">{{ executions.length }}</span>
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
  name: 'ExecutionsListPage',
  data() {
    return {
      executions: []
    }
  },
  created() {
    // 模拟数据
    this.executions = [
      {
        id: 'exec-001',
        sceneName: '数据导入场景',
        status: 'success',
        startTime: '2023-06-15T14:30:00Z',
        endTime: '2023-06-15T14:32:15Z',
        duration: '2分15秒'
      },
      {
        id: 'exec-002',
        sceneName: '数据清洗流程',
        status: 'failed',
        startTime: '2023-06-15T12:10:00Z',
        endTime: '2023-06-15T12:10:45Z',
        duration: '45秒'
      },
      {
        id: 'exec-003',
        sceneName: '定时备份流程',
        status: 'success',
        startTime: '2023-06-15T00:00:00Z',
        endTime: '2023-06-15T00:05:30Z',
        duration: '5分30秒'
      },
      {
        id: 'exec-004',
        sceneName: '异常通知流程',
        status: 'running',
        startTime: '2023-06-15T15:45:00Z',
        endTime: null,
        duration: '进行中'
      },
      {
        id: 'exec-005',
        sceneName: '月度报表生成',
        status: 'success',
        startTime: '2023-06-01T10:00:00Z',
        endTime: '2023-06-01T10:12:28Z',
        duration: '12分28秒'
      }
    ];
  },
  methods: {
    formatDateTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    },
    getStatusText(status) {
      const statusMap = {
        'success': '成功',
        'failed': '失败',
        'running': '执行中'
      };
      return statusMap[status] || status;
    }
  }
}
</script> 