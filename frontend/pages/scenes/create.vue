<template>
  <div>
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <div class="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
        <div class="ml-4 mt-2">
          <h3 class="text-lg leading-6 font-medium text-gray-900">创建场景</h3>
          <p class="mt-1 text-sm text-gray-500">使用YAML创建新的场景流程</p>
        </div>
        <div class="ml-4 mt-2 flex-shrink-0">
          <button @click="$router.go(-1)" class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3">
            取消
          </button>
          <button @click="saveScene" type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            保存场景
          </button>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
      <!-- 场景基本信息 -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">基本信息</h3>
          <p class="mt-1 text-sm text-gray-500">填写场景的基本信息</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">场景名称</label>
              <input type="text" name="name" id="name" v-model="scene.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="输入场景名称">
              <p class="mt-2 text-sm text-gray-500">名称应简洁明了，描述场景的主要功能</p>
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">场景描述</label>
              <textarea id="description" name="description" v-model="scene.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="详细描述场景的用途和功能"></textarea>
            </div>
            
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700">场景类型</label>
              <select id="type" name="type" v-model="scene.type" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                <option value="yaml">YAML</option>
                <option value="data-process">数据处理</option>
                <option value="notification">通知</option>
                <option value="integration">集成</option>
                <option value="custom">自定义</option>
              </select>
            </div>
            
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700">标签</label>
              <input type="text" name="tags" id="tags" v-model="scene.tags" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="用逗号分隔多个标签">
              <p class="mt-2 text-sm text-gray-500">标签有助于组织和搜索场景</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- YAML编辑器 -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">YAML定义</h3>
          <p class="mt-1 text-sm text-gray-500">使用YAML格式定义场景的执行步骤</p>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div>
            <div class="flex justify-between items-center mb-2">
              <label for="yaml" class="block text-sm font-medium text-gray-700">YAML内容</label>
              <div class="space-x-2">
                <button type="button" @click="loadTemplate" class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  加载模板
                </button>
                <button type="button" @click="validateYaml" class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  验证YAML
                </button>
                <button type="button" @click="testRun" class="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  测试运行
                </button>
              </div>
            </div>
            
            <div class="mt-1 bg-gray-50 rounded-md border border-gray-300">
              <textarea id="yaml" name="yaml" v-model="scene.yaml" rows="20" class="block w-full border-0 bg-transparent py-2 px-3 focus:ring-0 sm:text-sm font-mono" placeholder="输入YAML格式的场景定义"></textarea>
            </div>
            
            <div class="mt-4">
              <div v-if="validationResult" class="rounded-md p-4" :class="validationResult.valid ? 'bg-green-50' : 'bg-red-50'">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg v-if="validationResult.valid" class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium" :class="validationResult.valid ? 'text-green-800' : 'text-red-800'">
                      {{ validationResult.message }}
                    </h3>
                    <div v-if="!validationResult.valid" class="mt-2 text-sm text-red-700">
                      <p>{{ validationResult.error }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 测试运行结果 -->
            <div v-if="runResult" class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">执行结果:</h4>
              <div class="bg-gray-50 rounded-md border border-gray-300 p-4 overflow-auto h-64">
                <pre class="text-xs">{{ JSON.stringify(runResult, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 保存按钮 -->
    <div class="mt-6 flex justify-end">
      <button @click="$router.go(-1)" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3">
        取消
      </button>
      <button @click="saveScene" type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        保存场景
      </button>
    </div>
    
    <!-- 加载中遮罩 -->
    <div v-if="loading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p class="mt-4 text-center text-gray-700">{{ loadingMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import yaml from 'js-yaml';

export default {
  name: 'CreateScenePage',
  data() {
    return {
      scene: {
        name: '',
        description: '',
        type: 'yaml',
        tags: '',
        yaml: ''
      },
      validationResult: null,
      runResult: null,
      loading: false,
      loadingMessage: '处理中...'
    }
  },
  methods: {
    async saveScene() {
      // 验证表单
      if (!this.scene.name.trim()) {
        alert('场景名称不能为空');
        return;
      }
      
      if (!this.scene.yaml.trim()) {
        alert('YAML内容不能为空');
        return;
      }
      
      // 验证YAML格式
      try {
        yaml.load(this.scene.yaml);
      } catch (error) {
        if (!confirm('YAML格式可能有误，是否继续保存？')) {
          return;
        }
      }
      
      this.loading = true;
      this.loadingMessage = '保存场景中...';
      
      try {
        // 调用API保存场景
        const response = await this.$axios.$post('/api/scenes', {
          name: this.scene.name,
          description: this.scene.description,
          type: this.scene.type,
          tags: this.scene.tags,
          yaml_content: this.scene.yaml
        });
        
        this.loading = false;
        alert('场景保存成功');
        this.$router.push('/scenes');
      } catch (error) {
        this.loading = false;
        console.error('保存场景失败', error);
        alert('保存场景失败: ' + (error.response?.data?.message || error.message || '未知错误'));
      }
    },
    
    loadTemplate() {
      // 加载模板YAML
      this.scene.yaml = `name: 示例场景
description: 这是一个示例场景

steps:
  - id: step1
    name: 初始化
    type: initialize
    data:
      message: 开始执行场景
      
  - id: step2
    name: 处理数据
    type: transform
    data:
      input: $ref:step1.result
      transform: uppercase
      
  - id: step3
    name: 完成
    type: notification
    data:
      message: 场景执行完成`;
    },
    
    validateYaml() {
      try {
        // 验证YAML格式
        yaml.load(this.scene.yaml);
        this.validationResult = {
          valid: true,
          message: 'YAML格式有效'
        };
      } catch (error) {
        this.validationResult = {
          valid: false,
          message: 'YAML格式无效',
          error: error.message
        };
      }
    },
    
    async testRun() {
      // 首先验证YAML
      this.validateYaml();
      if (this.validationResult && !this.validationResult.valid) {
        return;
      }
      
      this.loading = true;
      this.loadingMessage = '测试执行中...';
      
      try {
        // 使用后端的测试运行接口
        const result = await this.$axios.$post('/api/scenes/test-run', {
          yaml_content: this.scene.yaml,
          params: {}
        });
        
        this.runResult = result;
        this.loading = false;
      } catch (error) {
        this.loading = false;
        this.runResult = {
          error: true,
          message: error.response?.data?.message || error.message || '执行失败'
        };
        console.error('执行YAML失败', error);
      }
    }
  }
}
</script> 