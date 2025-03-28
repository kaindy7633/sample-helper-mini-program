import React from "react";
import { View, Text } from "@tarojs/components";
import "./index.less";

/**
 * 菜单项组件
 * @param {Object} props - 组件属性
 * @param {string} props.icon - 图标名称
 * @param {string} props.title - 菜单标题
 * @param {string} props.rightText - 右侧文本（可选）
 * @returns {JSX.Element} 菜单项组件
 */
const MenuItem: React.FC<{
  icon: string;
  title: string;
  rightText?: string;
}> = ({ icon, title, rightText }) => {
  return (
    <View className="menu-item">
      <View className="menu-left">
        <View className="menu-icon">{icon}</View>
        <Text className="menu-title">{title}</Text>
      </View>
      <View className="menu-right">
        {rightText && <Text className="menu-right-text">{rightText}</Text>}
        <View className="menu-arrow">〉</View>
      </View>
    </View>
  );
};

/**
 * 我的页面组件
 * @returns {JSX.Element} 我的页面
 */
const MinePage: React.FC = () => {
  return (
    <View className="container">
      {/* 用户信息区域 */}
      <View className="user-info-section">
        <View className="user-profile">
          <View className="avatar-container">
            <View className="avatar"></View>
          </View>
          <View className="username">超级管理员</View>
        </View>
      </View>

      {/* 菜单列表 */}
      <View className="menu-section">
        <MenuItem icon="🌍" title="社区" rightText="交流、吐槽、提建议" />

        <View className="menu-divider"></View>

        <MenuItem icon="❤" title="收藏" />

        <View className="menu-divider"></View>

        <MenuItem icon="⬡" title="设置" rightText="个人信息" />

        <View className="menu-divider"></View>

        <MenuItem icon="🎧" title="帮助与反馈" />

        <View className="menu-divider"></View>

        <MenuItem icon="☺" title="关于我们" />
      </View>
    </View>
  );
};

export default MinePage;
