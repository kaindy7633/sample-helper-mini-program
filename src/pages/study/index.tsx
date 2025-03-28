import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import CustomTabbar from "../../components/Tabbar";
import "./index.less";

/**
 * 学习页面组件
 * @returns {JSX.Element} 学习页面
 */
const StudyPage: React.FC = () => {
  // 当前激活的tabbar
  const [activeTab, setActiveTab] = useState<string>("study");

  return (
    <View className="container">
      <View className="header">
        <View className="title">学习</View>
      </View>
      <View className="content">
        <Text className="placeholder">学习页面内容</Text>
      </View>
      <CustomTabbar active={activeTab} onChange={setActiveTab} />
    </View>
  );
};

export default StudyPage;
