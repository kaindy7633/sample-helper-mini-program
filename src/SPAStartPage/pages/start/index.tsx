/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useUser } from "../../../stores/userStore";
// 正确引用图片资源
import splashImg from "../../../assets/images/start-page/ico_splash.png";
import logoImg from "../../../assets/images/start-page/ico_splashlopgo.png";
import "./index.less";

/**
 * 启动页组件
 * @returns {JSX.Element} 启动页
 */
const StartPage: React.FC = () => {
  // 使用useUser钩子获取用户状态管理方法
  const userStore = useUser();

  useEffect(() => {
    // 检查token是否存在
    const checkLoginStatus = async () => {
      try {
        // 获取存储中的token
        const token = Taro.getStorageSync("user_token");

        if (token) {
          // 设置token到用户状态
          userStore.setToken(token);
        }

        // 延迟后根据登录状态跳转
        setTimeout(() => {
          if (userStore.token) {
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
        }, 2000);
      } catch (error) {
        console.error("检查登录状态时出错:", error);
        // 发生错误时，默认跳转到登录页
        setTimeout(() => {
          Taro.redirectTo({
            url: "/pages/login/index",
          });
        }, 1000);
      }
    };

    // 执行登录状态检查
    checkLoginStatus();
  }, []);

  return (
    <View className="start-page">
      <View className="splash-container">
        <Image className="splash-image" src={splashImg} mode="aspectFit" />
      </View>
      <View className="logo-container">
        <Image className="logo-image" src={logoImg} mode="aspectFit" />
        <View className="slogan">让抽样 更简单</View>
      </View>
    </View>
  );
};

export default StartPage;
