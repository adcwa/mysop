# MySOP - 场景编排平台

基于MidScense引擎的场景编排平台，支持YAML场景的创建、管理和执行。

## 功能特性

- 使用YAML定义场景流程
- 创建、编辑、查看和删除场景
- 一键执行场景并查看结果
- 记录执行历史和详细日志

## 技术栈

### 后端
- Node.js
- Express
- PostgreSQL
- MidScense场景引擎

### 前端
- Vue.js 2.x
- Nuxt.js
- Tailwind CSS
- Axios

## 快速开始

### 前提条件
- Node.js 14+
- PostgreSQL 12+
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/mysop.git
cd mysop
```

2. 安装依赖
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

3. 配置环境变量
创建`.env`文件在backend目录，添加以下配置：
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=mysop
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
```

4. 初始化数据库
```bash
cd backend
npm run init-db
```

5. 启动应用
```bash
# 启动后端
cd backend
npm run dev

# 启动前端（新终端）
cd frontend
npm run dev
```

6. 打开浏览器，访问 http://localhost:8000

## YAML场景示例

```yaml
name: 简单示例场景
description: 演示基本场景执行流程

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
    message: 场景执行完成
```

## 许可证

MIT License
