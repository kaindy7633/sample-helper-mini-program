import React from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";

/**
 * 底部导航组件
 * @param {Object} props 组件属性
 * @param {string} props.active 当前活动的选项卡
 * @param {Function} props.onChange 选项卡切换回调
 * @returns {JSX.Element} 底部导航组件
 */
const CustomTabbar: React.FC<{
  active: string;
  onChange: (value: string) => void;
}> = ({ active, onChange }) => {
  const switchTab = (tab: string) => {
    if (active === tab) return;

    onChange(tab);

    // 根据tab切换页面
    const url = `/pages/${tab}/index`;

    // 使用switchTab而不是redirectTo来切换TabBar页面
    Taro.switchTab({ url });
  };

  return (
    <View className="tabbar-container">
      <View
        className={`tab-item ${active === "index" ? "active" : ""}`}
        onClick={() => switchTab("index")}
      >
        <View className="icon-placeholder"></View>
        <View className="tab-text">应用</View>
      </View>
      <View
        className={`tab-item ${active === "task" ? "active" : ""}`}
        onClick={() => switchTab("task")}
      >
        <View className="icon-placeholder"></View>
        <View className="tab-text">任务</View>
      </View>
      <View
        className={`tab-item ${active === "study" ? "active" : ""}`}
        onClick={() => switchTab("study")}
      >
        <View className="icon-placeholder"></View>
        <View className="tab-text">学习</View>
      </View>
      <View
        className={`tab-item ${active === "mine" ? "active" : ""}`}
        onClick={() => switchTab("mine")}
      >
        <View className="icon-placeholder"></View>
        <View className="tab-text">我的</View>
      </View>
    </View>
  );
};

export default CustomTabbar;
