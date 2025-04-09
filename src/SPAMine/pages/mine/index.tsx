/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { View, Text, Image } from "@tarojs/components";
import "./index.less";

// 导入图片资源
import avatarImg from "../../../assets/images/tabbar/tab_mine_active.png";
import msgIcon from "../../../assets/images/ico_msg.png";
import shequIcon from "../../../assets/images/ico_shequ.png";
import shoucangIcon from "../../../assets/images/ico_collect.png";
import settingIcon from "../../../assets/images/ico_setting.png";
import helpIcon from "../../../assets/images/ico_kefu.png";
import aboutIcon from "../../../assets/images/ico_aboutus.png";
import rightArrowIcon from "../../../assets/images/ico_right_grey.png";

/**
 * 菜单项组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.icon - 图标组件
 * @param {string} props.title - 菜单标题
 * @param {string} props.rightText - 右侧文本（可选）
 * @returns {JSX.Element} 菜单项组件
 */
const MenuItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  rightText?: string;
}> = ({
  icon,
  title,
  rightText,
}: {
  icon: React.ReactNode;
  title: string;
  rightText?: string;
}): JSX.Element => {
  return (
    <View className="menu-item">
      <View className="menu-left">
        <View className="menu-icon">{icon}</View>
        <Text className="menu-title">{title}</Text>
      </View>
      <View className="menu-right">
        {rightText && <Text className="menu-right-text">{rightText}</Text>}
        <View className="menu-arrow">
          <Image className="arrow-icon" src={rightArrowIcon} />
        </View>
      </View>
    </View>
  );
};

/**
 * 我的页面组件
 * @returns {JSX.Element} 我的页面
 */
const MinePage: React.FC = (): JSX.Element => {
  return (
    <View className="container">
      {/* 右上角聊天图标 */}
      <View className="chat-icon-container">
        <View className="chat-icon">
          <Image className="message-icon" src={msgIcon} />
        </View>
      </View>

      {/* 用户信息区域 */}
      <View className="user-info-section">
        <View className="user-profile">
          <View className="avatar-container">
            <Image className="avatar" src={avatarImg} />
          </View>
          <View className="username">超级管理员</View>
        </View>
      </View>

      {/* 菜单列表 */}
      <View className="menu-section">
        <MenuItem
          icon={<Image className="icon-image" src={shequIcon} />}
          title="社区"
          rightText="交流、吐槽、提建议"
        />

        <View className="menu-divider"></View>

        <MenuItem
          icon={<Image className="icon-image" src={shoucangIcon} />}
          title="收藏"
        />

        <View className="menu-divider"></View>

        <MenuItem
          icon={<Image className="icon-image" src={settingIcon} />}
          title="设置"
          rightText="个人信息"
        />

        <View className="menu-divider"></View>

        <MenuItem
          icon={<Image className="icon-image" src={helpIcon} />}
          title="帮助与反馈"
        />

        <View className="menu-divider"></View>

        <MenuItem
          icon={<Image className="icon-image" src={aboutIcon} />}
          title="关于我们"
        />
      </View>
    </View>
  );
};

export default MinePage;
