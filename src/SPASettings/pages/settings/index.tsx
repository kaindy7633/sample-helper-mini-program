import React from "react";
import { View } from "@tarojs/components";
import { Cell, Button } from "@taroify/core";
import { Arrow } from "@taroify/icons";
import Taro from "@tarojs/taro";
import "./index.less";

const SettingsPage: React.FC = () => {
  // 退出登录逻辑
  const handleLogout = () => {
    try {
      // 1. 删除本地存储的 user_token
      Taro.removeStorageSync("user_token");
      console.log("用户 Token 已清除");

      // 2. 显示退出成功提示
      Taro.showToast({ title: "已退出登录", icon: "success", duration: 1500 });

      // 3. 延迟跳转到登录页，给用户看提示的时间
      setTimeout(() => {
        Taro.reLaunch({ url: "/SPALogin/pages/login/index" });
      }, 1500);
    } catch (e) {
      console.error("退出登录时发生错误:", e);
      Taro.showToast({ title: "退出失败，请稍后重试", icon: "none" });
    }
  };

  // 跳转到其他页面（示例）
  const navigateTo = (url: string) => {
    Taro.navigateTo({ url });
  };

  return (
    <View className="settings-page">
      <Cell.Group inset={false}>
        <Cell
          title="账号与安全"
          clickable
          rightIcon={<Arrow />}
          onClick={() =>
            Taro.showToast({ title: "账号与安全功能待实现", icon: "none" })
          }
        />
        <Cell
          title="收集个人信息清单"
          clickable
          rightIcon={<Arrow />}
          onClick={() => Taro.showToast({ title: "功能待实现", icon: "none" })}
        />
        <Cell
          title="第三方共享信息清单"
          clickable
          rightIcon={<Arrow />}
          onClick={() => Taro.showToast({ title: "功能待实现", icon: "none" })}
        />
      </Cell.Group>

      {/* 退出登录按钮 */}
      <View className="logout-button-container">
        <Button
          className="logout-button"
          color="primary"
          shape="round"
          block
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </View>
    </View>
  );
};

export default SettingsPage;
