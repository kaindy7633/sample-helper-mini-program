import React, { useState } from "react";
import { View, Text, Input, InputProps } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useUser } from "../../stores/userStore";
import { LOGIN_API_BASE_URL, API_PATHS } from "../../services/config";
import "./index.less";

/**
 * 登录页面组件
 * @returns {JSX.Element} 登录页面
 */
const LoginPage: React.FC = () => {
  // 用户名和密码状态
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const userStore = useUser();

  /**
   * 处理登录请求
   */
  const handleLogin = async () => {
    // 表单校验
    if (!username.trim()) {
      Taro.showToast({
        title: "请输入账号",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    if (!password.trim()) {
      Taro.showToast({
        title: "请输入密码",
        icon: "none",
        duration: 2000,
      });
      return;
    }

    try {
      Taro.showLoading({
        title: "登录中...",
      });

      // 调用登录API
      const res = await Taro.request({
        url: `${LOGIN_API_BASE_URL}${API_PATHS.USER.LOGIN}`,
        method: "POST",
        data: {
          name: username,
          pwd: password,
          level: 1,
        },
      });

      Taro.hideLoading();

      // 登录成功处理
      if (res.statusCode === 200 && res.data) {
        const { data, token } = res.data;

        // 存储用户信息和token到全局状态
        userStore.setUserInfo(data);
        userStore.setToken(token);

        // 跳转到首页
        Taro.switchTab({
          url: "/pages/index/index",
        });
      } else {
        // 登录失败
        Taro.showToast({
          title: "登录失败，请稍后再试",
          icon: "none",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("登录异常：", error);
      Taro.hideLoading();
      Taro.showToast({
        title: "登录失败，请检查网络后重试",
        icon: "none",
        duration: 2000,
      });
    }
  };

  /**
   * 切换密码显示状态
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * 跳转到用户协议页面
   */
  const goToUserAgreement = () => {
    Taro.navigateTo({
      url: "/pages/agreement/index",
    });
  };

  /**
   * 跳转到隐私政策页面
   */
  const goToPrivacyPolicy = () => {
    Taro.navigateTo({
      url: "/pages/privacy/index",
    });
  };

  return (
    <View className="login-container">
      <View className="login-header">
        <Text className="login-title">密码登录</Text>
      </View>

      <View className="login-form">
        <View className="form-item">
          <Input
            className="form-input"
            type="text"
            placeholder="账号"
            value={username}
            onInput={(e) => setUsername(e.detail.value)}
          />
        </View>

        <View className="form-item">
          <View className="password-input-container">
            <Input
              className="form-input"
              type={showPassword ? "text" : ("password" as InputProps["type"])}
              placeholder="密码"
              value={password}
              onInput={(e) => setPassword(e.detail.value)}
            />
            <View className="eye-icon" onClick={togglePasswordVisibility}>
              {/* 眼睛图标 */}
            </View>
          </View>
        </View>
      </View>

      <View className="agreement-text">
        <Text className="normal-text">登录即代表您已阅读并同意 </Text>
        <Text className="link-text" onClick={goToUserAgreement}>
          《用户协议》
        </Text>
        <Text className="normal-text">及</Text>
        <Text className="link-text" onClick={goToPrivacyPolicy}>
          《隐私政策》
        </Text>
      </View>

      <View className="login-button" onClick={handleLogin}>
        <Text className="button-text">登录</Text>
      </View>
    </View>
  );
};

export default LoginPage;
