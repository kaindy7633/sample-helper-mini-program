/**
 * 状态管理导出入口
 */
import { useUser, UserProvider, getUserState } from "./userStore";
import { useApp, AppProvider, getAppState } from "./appStore";

// 导出自定义 Hook
export {
  useUser,
  useApp,
  UserProvider,
  AppProvider,
  getUserState,
  getAppState,
};
