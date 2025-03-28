import React from "react";
import { View, Text } from "@tarojs/components";
import "./index.less";

/**
 * 学习页面组件
 * @returns {JSX.Element} 学习页面
 */
const StudyPage: React.FC = () => {
  return (
    <View className="container">
      <View className="header">
        <View className="title">学习</View>
      </View>
      <View className="content">
        <Text className="placeholder">学习页面内容</Text>
      </View>
    </View>
  );
};

export default StudyPage;
