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
    const savedUserInfo = Taro.getStorageSync("user_info");
    return savedUserInfo ? JSON.parse(savedUserInfo) : null;
  });

  const [token, setTokenState] = useState<string | null>(() => {
    return Taro.getStorageSync("user_token") || null;
  });

  const isLoggedIn = !!token && !!userInfo;

  // 设置用户信息
  const setUserInfo = (info: UserInfo | null) => {
    setUserInfoState(info);
    if (info) {
      Taro.setStorageSync("user_info", JSON.stringify(info));
    } else {
      Taro.removeStorageSync("user_info");
    }
  };

  // 设置 token
  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      Taro.setStorageSync("user_token", newToken);
    } else {
      Taro.removeStorageSync("user_token");
    }
  };

  // 登出
  const logout = () => {
    setUserInfo(null);
    setToken(null);
    Taro.removeStorageSync("user_info");
    Taro.removeStorageSync("user_token");
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
    const userInfo = Taro.getStorageSync("user_info")
      ? JSON.parse(Taro.getStorageSync("user_info"))
      : null;
    const token = Taro.getStorageSync("user_token") || null;

    userState = {
      userInfo,
      token,
      isLoggedIn: !!token && !!userInfo,
      // 这些方法在非组件环境下使用时仍然会更新存储
      setUserInfo: (info) => {
        if (userState) {
          userState.userInfo = info;
          if (info) {
            Taro.setStorageSync("user_info", JSON.stringify(info));
          } else {
            Taro.removeStorageSync("user_info");
          }
        }
      },
      setToken: (newToken) => {
        if (userState) {
          userState.token = newToken;
          if (newToken) {
            Taro.setStorageSync("user_token", newToken);
          } else {
            Taro.removeStorageSync("user_token");
          }
        }
      },
      logout: () => {
        if (userState) {
          userState.userInfo = null;
          userState.token = null;
          userState.isLoggedIn = false;
          Taro.removeStorageSync("user_info");
          Taro.removeStorageSync("user_token");
        }
      },
    };
  }

  return userState;
};
