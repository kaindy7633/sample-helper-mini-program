import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import CustomTabbar from "../../components/Tabbar";
import "./index.less";

/**
 * 我的页面组件
 * @returns {JSX.Element} 我的页面
 */
const MinePage: React.FC = () => {
  // 当前激活的tabbar
  const [activeTab, setActiveTab] = useState<string>("mine");

  return (
    <View className="container">
      <View className="header">
        <View className="title">我的</View>
      </View>
      <View className="content">
        <Text className="placeholder">我的页面内容</Text>
      </View>
      <CustomTabbar active={activeTab} onChange={setActiveTab} />
    </View>
  );
};

export default MinePage;
