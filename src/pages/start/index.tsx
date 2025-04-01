/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { View, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useUser } from "../../stores/userStore";
// 正确引用图片资源
import splashImg from "../../assets/images/start-page/ico_splash.png";
import logoImg from "../../assets/images/start-page/ico_splashlopgo.png";
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
        console.log("开始检查登录状态...");

        // 获取存储中的所有keys，检查是否存在user_info
        const storageInfo = Taro.getStorageInfoSync();
        console.log("当前存储的所有keys:", storageInfo.keys);

        const storedUserInfo = Taro.getStorageSync("user_info");
        console.log("存储中的用户信息:", storedUserInfo ? "有数据" : "无数据");

        if (storedUserInfo) {
          try {
            // 将存储的信息更新到userStore中
            const userInfo = JSON.parse(storedUserInfo);
            console.log("解析后的用户信息对象结构:", Object.keys(userInfo));

            // 直接使用完整的用户信息和token
            userStore.setUserInfo(userInfo);
            userStore.setToken(userInfo?.SSOTGTCookie);

            console.log("检测到登录信息，自动登录成功");
            console.log(
              "用户信息已更新到Store中, 登录状态:",
              userStore.isLoggedIn
            );
          } catch (err) {
            console.error("解析用户信息失败:", err);
          }
        }

        // 延迟后根据登录状态跳转
        setTimeout(() => {
          console.log("准备跳转，当前登录状态:", userStore.isLoggedIn);
          console.log("当前token:", userStore.token ? "存在" : "不存在");

          if (userStore.isLoggedIn && userStore.token) {
            // 已登录，跳转到首页
            console.log("跳转到首页");
            Taro.switchTab({
              url: "/pages/index/index",
            });
          } else {
            // 未登录，跳转到登录页
            console.log("跳转到登录页");
            Taro.redirectTo({
              url: "/pages/login/index",
            });
          }
        }, 1000);
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
