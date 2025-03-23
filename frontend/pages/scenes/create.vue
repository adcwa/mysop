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
              <div>
                <button type="button" @click="loadTemplate" class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  加载模板
                </button>
              </div>
            </div>
            
            <div class="mt-1 bg-gray-50 rounded-md border border-gray-300">
              <textarea id="yaml" name="yaml" v-model="scene.yaml" rows="20" class="block w-full border-0 bg-transparent py-2 px-3 focus:ring-0 sm:text-sm font-mono" placeholder="输入YAML格式的场景定义"></textarea>
            </div>
            
            <div class="mt-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <button @click="validateYaml" type="button" class="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    验证YAML
                  </button>
                </div>
                <div class="ml-3 text-sm" v-if="validationResult">
                  <p :class="validationResult.valid ? 'text-green-600' : 'text-red-600'">
                    {{ validationResult.message }}
                  </p>
                </div>
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
  </div>
</template>

<script>
export default {
  name: 'CreateScenePage',
  data() {
    return {
      scene: {
        name: '',
        description: '',
        type: 'data-process',
        tags: '',
        yaml: ''
      },
      validationResult: null
    }
  },
  methods: {
    saveScene() {
      // 验证表单
      if (!this.scene.name.trim()) {
        alert('场景名称不能为空');
        return;
      }
      
      if (!this.scene.yaml.trim()) {
        alert('YAML内容不能为空');
        return;
      }
      
      // 保存场景逻辑，实际项目中应该调用API
      console.log('保存场景', this.scene);
      
      // 模拟保存成功
      alert('场景保存成功');
      this.$router.push('/scenes');
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
        // 实际项目中应该调用API或使用库进行验证
        // 这里简单模拟验证成功
        this.validationResult = {
          valid: true,
          message: 'YAML格式有效'
        };
      } catch (error) {
        this.validationResult = {
          valid: false,
          message: `YAML格式无效: ${error.message}`
        };
      }
    }
  }
}
</script> 