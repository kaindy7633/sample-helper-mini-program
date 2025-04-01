import React from "react";
import { View, Text } from "@tarojs/components";
import "./index.less";

/**
 * 消息中心页面
 * @returns {JSX.Element} 消息中心组件
 */
const Message: React.FC = () => {
  return (
    <View className="message-container">
      <View className="header">
        <Text className="title">消息中心</Text>
      </View>
      <View className="content">
        {/* 消息列表将在这里实现 */}
      </View>
    </View>
  );
};

export default Message;