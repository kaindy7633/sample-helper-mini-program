/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useUser } from "../../stores/userStore";
import "./index.less";

/**
 * 启动页组件
 * @returns {JSX.Element} 启动页
 */
const StartPage: React.FC = () => {
  // 使用useUser钩子获取用户状态管理方法
  const userStore = useUser();

  useEffect(() => {
    // 检查存储中是否有用户信息和token
    const checkLoginStatus = async () => {
      try {
        const storedUserInfo = Taro.getStorageSync("user_info");

        if (storedUserInfo) {
          // 将存储的信息更新到userStore中
          const userInfo = JSON.parse(storedUserInfo);
          userStore.setUserInfo(userInfo?.user || {});
          userStore.setToken(userInfo?.SSOTGTCookie);

          console.log("检测到登录信息，自动登录成功");
        }

        // 3秒后根据登录状态跳转
        setTimeout(() => {
          if (userStore.isLoggedIn && userStore.token) {
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
      } catch (error) {
        console.error("检查登录状态时出错:", error);
        // 发生错误时，默认跳转到登录页
        setTimeout(() => {
          Taro.redirectTo({
            url: "/pages/login/index",
          });
        }, 3000);
      }
    };

    // 执行登录状态检查
    checkLoginStatus();
  }, []); // 添加userStore作为依赖

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
