import React from "react";
import { View, Text, Image } from "@tarojs/components";
import "./index.less";

import commentIcon from "../../../assets/images/message/ico_mc1.png";
import likeIcon from "../../../assets/images/message/ico_mc2.png";
import shareIcon from "../../../assets/images/message/ico_mc3.png";
import clearUnreadIcon from "../../../assets/images/ico_clearunread.png";

/**
 * 消息中心页面
 * @returns {JSX.Element} 消息中心组件
 */
const Message: React.FC = () => {
  return (
    <View className="message-container">
      <View className="message-summary">
        <View className="message-count">全部0条消息</View>
        <View className="read-all">
          <Image className="clear-icon" src={clearUnreadIcon} />
          全部已读
        </View>
      </View>
      <View className="message-types">
        <View className="message-type">
          <View className="icon-wrapper comment">
            <Image className="icon" src={commentIcon} />
          </View>
          <Text className="type-name">评论</Text>
        </View>
        <View className="message-type">
          <View className="icon-wrapper like">
            <Image className="icon" src={likeIcon} />
          </View>
          <Text className="type-name">点赞</Text>
        </View>
        <View className="message-type">
          <View className="icon-wrapper share">
            <Image className="icon" src={shareIcon} />
          </View>
          <Text className="type-name">转发</Text>
        </View>
      </View>
    </View>
  );
};

export default Message;
