# Sample Helper Mini Program - 微信小程序

[![Taro Version](https://img.shields.io/badge/Taro-3.6.0+-blue.svg)](https://taro.js.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

一个基于 Taro 框架开发的微信小程序示例助手，提供常用功能模板和开发最佳实践。

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
  - [环境要求](#环境要求)
  - [安装步骤](#安装步骤)
- [项目结构](#项目结构)
- [开发指南](#开发指南)
- [构建与部署](#构建与部署)
- [贡献指南](#贡献指南)
- [许可证](#许可证)
- [致谢](#致谢)

## 功能特性

- 📚 常用功能示例集合（表单验证、API调用、组件交互等）
- 🔍 示例代码分类搜索功能
- ⭐ 收藏常用代码片段
- 📱 响应式布局适配多端
- 🚀 微信原生能力集成（分享、订阅消息、云开发等）
- 🔄 数据缓存与本地存储管理
- 📦 模块化代码组织架构

## 技术栈

- **框架**: Taro 3.x + React + TypeScript
- **UI 组件库**: [NutUI](https://nutui.jd.com/) + 自定义组件
- **状态管理**: Redux Toolkit / Mobx（按需选择）
- **路由管理**: Taro 原生路由系统
- **网络请求**: Taro.request 封装 + Axios 风格拦截器
- **代码规范**: ESLint + Prettier + Stylelint
- **构建工具**: Webpack 5
- **CI/CD**: GitHub Actions（可选）

## 快速开始

### 环境要求

- Node.js >= 16.13.0
- Taro CLI >= 3.6.0
- 微信开发者工具（最新稳定版）

### 安装步骤

1.克隆仓库

```bash
git clone http://172.18.141.178:6062/ejc-frontend-group/sample-helper-mini-program.git
cd sample-helper-mini-program
```

2.安装依赖

推荐使用 `pnpm` 来安装、更新三方依赖

```bash
pnpm install
```

3.开发模式运行

```bash
pnpm dev:weapp
```

4.使用微信开发者工具打开项目目录下的 `dist` 文件夹

5.生产环境构建

```bash
pnpm build:weapp
```

## 项目结构

```text
sample-helper-mini-program/
├── config/               # Taro 配置
├── src/
│   ├── app.tsx           # 入口文件
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── config/           # 项目配置
│   ├── models/           # 数据模型
│   ├── pages/            # 页面组件
│   ├── services/         # API 服务
│   ├── store/            # 状态管理
│   ├── styles/           # 全局样式
│   ├── utils/            # 工具函数
│   └── types/            # 类型定义
├── package.json
└── tsconfig.json
```

## 开发指南

### 代码规范

- 使用 ESLint + Prettier 进行代码格式校验
- 组件命名遵循 PascalCase 规范
- 页面文件存放于 `src/pages` 目录
- 公共组件存放于 `src/components` 目录
- API 请求统一管理在 `src/services` 目录

### 分支管理

- `main` 分支：生产环境代码
- `develop` 分支：开发主分支
- `feature/*` 分支：新功能开发
- `hotfix/*` 分支：紧急修复

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
git commit -m "feat: 新增用户登录功能"
git commit -m "fix: 修复表单验证逻辑问题"
git commit -m "docs: 更新README安装说明"
```

## 构建与部署

1.生产环境构建

```bash
npm run build:weapp
```

2.使用微信开发者工具：

- 打开生成的 `dist/weapp` 目录
- 点击 "上传" 按钮
- 在微信公众平台提交审核

## 贡献指南

欢迎提交 Pull Request，请遵循以下步骤：

1. Fork 本仓库
2. 创建 feature 分支 (`git checkout -b feature/your-feature`)
3. 提交修改 (`git commit -am 'Add some feature'`)
4. 推送分支 (`git push origin feature/your-feature`)
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE)

## 致谢

- Taro 开发团队
- 微信小程序文档
- NutUI 组件库贡献者

---
