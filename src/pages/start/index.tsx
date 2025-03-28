import React, { useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getUserState } from "../../stores/userStore";
import "./index.less";

/**
 * 启动页组件
 * @returns {JSX.Element} 启动页
 */
const StartPage: React.FC = () => {
  useEffect(() => {
    // 3秒后检查用户登录状态并跳转
    const timer = setTimeout(() => {
      const userState = getUserState();

      if (userState.isLoggedIn && userState.token) {
        // 已登录，跳转到首页
        Taro.switchTab({
          url: "/pages/index/index",
        });
      } else {
        // 未登录，跳转到登录页
        Taro.redirectTo({
          url: "/pages/login/index",
        });
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="start-page">
      <View className="logo">
        {/* 使用灰色块状替代暂时没有的图标 */}
        <View className="logo-placeholder"></View>
      </View>
      <View className="slogan">让抽样 更简单</View>
    </View>
  );
};

export default StartPage;
