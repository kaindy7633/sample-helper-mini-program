/**
 * 用户状态管理 (使用 React Context API)
 */
import React, { createContext, useContext, useState, ReactNode } from "react";
import Taro from "@tarojs/taro";

// 定义用户信息类型
export interface UserInfo {
  id?: string;
  nickname?: string;
  avatar?: string;
  [key: string]: any; // 添加索引签名以支持动态属性
}

// 定义状态类型
export interface UserState {
  userInfo: UserInfo | null;
  token: string | null;
  isLoggedIn: boolean;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

// 创建上下文
export const UserContext = createContext<UserState | null>(null);

// 自定义 Provider 组件
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 从本地存储中获取初始数据
  const [userInfo, setUserInfoState] = useState<UserInfo | null>(() => {
    try {
      const savedUserInfo = Taro.getStorageSync("user_info");
      return savedUserInfo ? JSON.parse(savedUserInfo) : null;
    } catch (e) {
      console.error("读取用户信息失败:", e);
      return null;
    }
  });

  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return Taro.getStorageSync("user_token") || null;
    } catch (e) {
      console.error("读取用户token失败:", e);
      return null;
    }
  });

  const isLoggedIn = !!token && !!userInfo;

  // 设置用户信息
  const setUserInfo = (info: UserInfo | null) => {
    setUserInfoState(info);
    try {
      if (info) {
        Taro.setStorageSync("user_info", JSON.stringify(info));
        console.log("用户信息已保存到本地存储");
      } else {
        Taro.removeStorageSync("user_info");
        console.log("用户信息已从本地存储移除");
      }
    } catch (e) {
      console.error("保存用户信息失败:", e);
    }
  };

  // 设置 token
  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    try {
      if (newToken) {
        Taro.setStorageSync("user_token", newToken);
        console.log("用户token已保存到本地存储");
      } else {
        Taro.removeStorageSync("user_token");
        console.log("用户token已从本地存储移除");
      }
    } catch (e) {
      console.error("保存token失败:", e);
    }
  };

  // 登出
  const logout = () => {
    setUserInfo(null);
    setToken(null);
    try {
      Taro.removeStorageSync("user_info");
      Taro.removeStorageSync("user_token");
      console.log("用户已登出，所有数据已清除");
    } catch (e) {
      console.error("清除用户数据失败:", e);
    }
  };

  const value = {
    userInfo,
    token,
    isLoggedIn,
    setUserInfo,
    setToken,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 自定义 Hook
export const useUser = (): UserState => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser 必须在 UserProvider 内部使用");
  }
  return context;
};

// 导出一个获取状态的方法（用于在非组件中使用）
let userState: UserState | null = null;

export const getUserState = (): UserState => {
  if (!userState) {
    // 如果未初始化，从存储中获取
    try {
      const storedUserInfo = Taro.getStorageSync("user_info");
      const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
      const token = Taro.getStorageSync("user_token") || null;

      userState = {
        userInfo,
        token,
        isLoggedIn: !!token && !!userInfo,
        // 这些方法在非组件环境下使用时仍然会更新存储
        setUserInfo: (info) => {
          if (userState) {
            userState.userInfo = info;
            try {
              if (info) {
                Taro.setStorageSync("user_info", JSON.stringify(info));
              } else {
                Taro.removeStorageSync("user_info");
              }
            } catch (e) {
              console.error("保存用户信息失败:", e);
            }
          }
        },
        setToken: (newToken) => {
          if (userState) {
            userState.token = newToken;
            try {
              if (newToken) {
                Taro.setStorageSync("user_token", newToken);
              } else {
                Taro.removeStorageSync("user_token");
              }
            } catch (e) {
              console.error("保存token失败:", e);
            }
          }
        },
        logout: () => {
          if (userState) {
            userState.userInfo = null;
            userState.token = null;
            userState.isLoggedIn = false;
            try {
              Taro.removeStorageSync("user_info");
              Taro.removeStorageSync("user_token");
            } catch (e) {
              console.error("清除用户数据失败:", e);
            }
          }
        },
      };
    } catch (e) {
      console.error("初始化用户状态失败:", e);
      userState = {
        userInfo: null,
        token: null,
        isLoggedIn: false,
        setUserInfo: () => {},
        setToken: () => {},
        logout: () => {},
      };
    }
  }

  return userState;
};
