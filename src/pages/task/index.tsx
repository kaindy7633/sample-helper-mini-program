import React, { useState } from "react";
import { View, Text } from "@tarojs/components";
import CustomTabbar from "../../components/Tabbar";
import "./index.less";

/**
 * 任务页面组件
 * @returns {JSX.Element} 任务页面
 */
const TaskPage: React.FC = () => {
  // 当前激活的tabbar
  const [activeTab, setActiveTab] = useState<string>("task");

  return (
    <View className="container">
      <View className="header">
        <View className="title">任务</View>
      </View>
      <View className="content">
        <Text className="placeholder">任务页面内容</Text>
      </View>
      <CustomTabbar active={activeTab} onChange={setActiveTab} />
    </View>
  );
};

export default TaskPage;
