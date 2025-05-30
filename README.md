# Sample Helper Mini Program - 微信小程序

[![Taro Version](https://img.shields.io/badge/Taro-4.0.0+-blue.svg)](https://taro.js.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8.x+-orange.svg)](https://pnpm.io/)

基于 Taro 4.x + Vite + React 的企业级微信小程序开发模板

## 目录

- [技术架构](#技术架构)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [开发规范](#开发规范)
- [构建部署](#构建部署)
- [代码提交](#代码提交)

## 技术架构

### 核心框架

- **Taro 4.x** - 多端开发框架
- **React 18 + TypeScript 5** - 主开发语言
- **Vite 4** - 构建工具

### 主要依赖

- **状态管理**: React Context API
- **UI 组件库**: [Taroify 0.6.4+](https://taroify.github.io/taroify.com/introduce/)
- **工具链**: pnpm 8.x + SWC

## 环境要求

- Node.js 18.x+
- pnpm 8.x+ (`npm install -g pnpm`)
- 微信开发者工具 (最新稳定版)
- Taro CLI 4.x (`pnpm add -g @tarojs/cli`)

## 快速开始

### 克隆仓库

```bash
git clone http://172.18.141.178:6062/ejc-frontend-group/sample-helper-mini-program.git
cd sample-helper-mini-program
```

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev:weapp
# 使用微信开发者工具打开 dist/weapp 目录
```

### 生产构建

```bash
pnpm run build:weapp -- --mode production
```

## 项目结构

```text
sample-helper-mini-program/
├── .swc/                # SWC 编译配置
├── config/              # Taro 环境配置
│   ├── dev.ts
│   ├── index.ts
│   └── prod.ts
├── src/
│   ├── pages/           # 小程序页面
│   ├── components/      # 公共组件
│   ├── stores/          # 状态管理
│   ├── services/        # API 服务
│   ├── app.config.ts    # 全局配置
│   ├── app.less         # 全局样式
│   └── app.tsx          # 应用入口
├── types/               # 类型声明
├── .env.*               # 多环境变量配置
├── vite.config.ts       # Vite 主配置
└── package.json
```

## 开发规范

### UI 组件使用

1. 统一使用 Taroify 组件库
2. 组件按需引入：

```typescript
import { Button } from "@taroify/core";
import "@taroify/core/button/style"; // 导入对应组件样式
```

### 状态管理

1. 使用 React Context API 进行状态管理
2. 状态文件存放于 `src/stores`
3. 示例：

```typescript
// stores/userStore.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import Taro from "@tarojs/taro";

// 定义状态类型
interface UserState {
  userInfo: any;
  isLoggedIn: boolean;
  setUserInfo: (info: any) => void;
  logout: () => void;
}

// 创建上下文
const UserContext = createContext<UserState | null>(null);

// Provider 组件
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userInfo, setUserInfoState] = useState(null);
  const isLoggedIn = !!userInfo;

  const setUserInfo = (info: any) => {
    setUserInfoState(info);
    if (info) {
      Taro.setStorage("user_info", JSON.stringify(info));
    }
  };

  const logout = () => {
    setUserInfoState(null);
    Taro.removeStorageSync("user_info");
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        isLoggedIn,
        setUserInfo,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// 自定义 Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser 必须在 UserProvider 内部使用");
  }
  return context;
};
```

### 样式规范

- 使用 Less 预处理器
- 页面样式文件与组件同名
- 全局样式通过 `app.less` 管理

## 构建部署

### 多环境构建

```bash
# 测试环境
pnpm build:weapp --mode test

# 生产环境
pnpm build:weapp --mode production
```

### 发布流程

1. 执行生产环境构建
2. 使用微信开发者工具上传代码
3. 在管理后台提交审核
4. 通过内部 CI 系统同步 CDN 资源

## 代码提交

### 分支策略

- `main`: 受保护主分支
- `feat/*`: 功能开发分支
- `fix/*`: 问题修复分支

### 提交消息格式

```bash
<type>(<scope>): <subject>
# 示例
feat(user): 新增手机号登录功能
fix(orders): 修复价格计算错误
```

---

**注意事项**：

1. 敏感配置请通过 `.env` 文件管理
2. 不要直接修改 `dist/` 目录下的文件
3. 组件开发需包含类型定义文件（.d.ts）
