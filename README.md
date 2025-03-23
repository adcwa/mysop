# MySOP - 基于MidScense引擎的YAML场景编排平台

MySOP 是一个用于管理和执行YAML场景的编排平台，基于MidScense引擎构建。它提供了一个直观的用户界面来创建、管理、执行和监控YAML场景。

## 功能特点

- **场景管理**：创建、编辑、删除和查看YAML场景
- **YAML编辑器**：内置YAML编辑器，支持验证和测试运行
- **场景执行**：执行YAML场景并查看实时日志
- **历史记录**：查看所有场景的执行历史和结果

## 技术栈

- **前端**：Vue.js、Nuxt.js、TailwindCSS
- **后端**：Node.js、Express、PostgreSQL
- **其他**：MidScense引擎 (@midscene/cli)、JS-YAML

## 系统要求

- Node.js >= 14.x
- npm >= 6.x
- PostgreSQL >= 12.x (可选，如不需要持久化存储可使用内存模式)

## 快速开始

### 安装

1. 克隆仓库
   ```
   git clone https://github.com/yourusername/mysop.git
   cd mysop
   ```

2. 安装 MidScene CLI
   ```
   npm install -g @midscene/cli
   ```

3. 安装依赖并启动应用
   ```
   chmod +x start.sh
   ./start.sh
   ```

如果您希望分别安装和运行前后端：

### 数据库设置

1. 创建PostgreSQL数据库
   ```
   createdb mysop
   ```

2. 配置环境变量
   ```
   cd backend
   cp .env.sample .env
   ```
   然后编辑`.env`文件，配置您的数据库连接信息。

3. 初始化数据库
   ```
   cd backend
   npm run init-db
   ```

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 http://localhost:3030 运行。

### 后端

```bash
cd backend
npm install
npm run dev
```

后端API将在 http://localhost:3000 运行。

## 使用指南

1. **创建场景**：点击界面上的"创建场景"按钮，填写场景信息并编写YAML定义
2. **验证YAML**：使用内置的验证功能确保YAML格式正确
3. **测试运行**：在保存前测试运行YAML，查看执行结果
4. **执行场景**：在场景列表中点击"执行"按钮运行场景
5. **查看历史**：在执行历史页面查看所有场景的执行记录和结果

## MidScene CLI

本项目使用 MidScene CLI 执行 YAML 场景。更多信息请参考 [MidScene 示例仓库](https://github.com/web-infra-dev/midscene-example/tree/main/yaml-scripts-demo)。

## YAML场景示例

```yaml
name: 示例场景
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
      message: 场景执行完成
```

## 许可

MIT
