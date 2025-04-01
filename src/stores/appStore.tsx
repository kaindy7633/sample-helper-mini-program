/**
 * 应用全局状态管理 (使用 React Context API)
 */
import React, { createContext, useContext, useState, ReactNode } from "react";
import Taro from "@tarojs/taro";

// 主题类型
export type ThemeType = "light" | "dark";

// 定义状态类型
export interface AppState {
  theme: ThemeType;
  loading: boolean;
  setTheme: (theme: ThemeType) => void;
  setLoading: (loading: boolean) => void;
}

// 创建上下文
export const AppContext = createContext<AppState | null>(null);

// 自定义 Provider 组件
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 从本地存储中获取初始数据
  const [theme, setThemeState] = useState<ThemeType>(() => {
    return (Taro.getStorageSync("app_theme") as ThemeType) || "light";
  });

  const [loading, setLoadingState] = useState(false);

  // 设置主题
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    Taro.setStorage({
      key: "app_theme",
      data: newTheme,
    });
  };

  // 设置加载状态
  const setLoading = (isLoading: boolean) => {
    setLoadingState(isLoading);
  };

  const value = {
    theme,
    loading,
    setTheme,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 自定义 Hook
export const useApp = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp 必须在 AppProvider 内部使用");
  }
  return context;
};

// 导出一个获取状态的方法（用于在非组件中使用）
let appState: AppState | null = null;

export const getAppState = (): AppState => {
  if (!appState) {
    // 如果未初始化，从存储中获取
    const theme = (Taro.getStorageSync("app_theme") as ThemeType) || "light";

    appState = {
      theme,
      loading: false,
      // 这些方法在非组件环境下使用时仍然会更新存储
      setTheme: (newTheme) => {
        if (appState) {
          appState.theme = newTheme;
          Taro.setStorage({
            key: "app_theme",
            data: newTheme,
          });
        }
      },
      setLoading: (isLoading) => {
        if (appState) {
          appState.loading = isLoading;
        }
      },
    };
  }

  return appState;
};
