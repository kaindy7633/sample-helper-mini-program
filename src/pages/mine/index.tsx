import React from "react";
import { View, Text } from "@tarojs/components";
import "./index.less";

/**
 * 我的页面组件
 * @returns {JSX.Element} 我的页面
 */
const MinePage: React.FC = () => {
  return (
    <View className="container">
      <View className="header">
        <View className="title">我的</View>
      </View>
      <View className="content">
        <Text className="placeholder">我的页面内容</Text>
      </View>
    </View>
  );
};

export default MinePage;
