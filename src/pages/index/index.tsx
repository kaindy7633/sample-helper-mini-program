import React from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";
import homeLogo from "../../assets/images/ico_homelogo.png";
import messageIcon from "../../assets/images/ico_msg.png";

/**
 * 主页组件
 * @returns {JSX.Element} 主页
 */
const Index: React.FC = () => {
  // 模拟天气数据
  const weatherData = {
    temperature: "12.3°C",
    condition: "多云",
    quote: "生活就是创新，只有与时俱进才能跟上时代。",
  };

  // 模拟范围抽样数据
  const scopeSamplingItems = [
    {
      id: 1,
      title: "抽样重复查询",
      icon: "scope-query",
    },
  ];

  // 模拟规范抽备数据
  const normalSamplingItems = [
    {
      id: 1,
      title: "食品分类查询",
      icon: "food-category",
    },
    {
      id: 2,
      title: "标法查询",
      icon: "standard-law",
    },
    {
      id: 3,
      title: "抽样单验证",
      icon: "sample-verify",
    },
  ];

  // 模拟便捷工具数据
  const toolItems = [
    {
      id: 1,
      title: "企业证照查询",
      icon: "company-license",
    },
  ];

  // 模拟社区讨论数据
  const communityPosts = [
    {
      id: 1,
      type: "科普",
      title: "抽样食品时，抽样单中的属性分类",
      author: "超级管理员",
      likes: 3,
      comments: 29,
    },
    {
      id: 2,
      type: "求助",
      title: "抽样餐饮具时，抽样单中样品属性是什么？",
      author: "张银海",
      likes: 3,
      comments: 7,
    },
  ];

  /**
   * 跳转到消息中心
   */
  const handleMessageClick = () => {
    Taro.navigateTo({
      url: "/pages/message/index",
    });
  };

  return (
    <View className="container">
      {/* 头部区域 */}
      <View className="header">
        <View className="header-left">
          <Image className="home-logo" src={homeLogo} mode="aspectFit" />
          <Text className="logo-text">抽样助手</Text>
        </View>
        <Image
          className="message-icon"
          src={messageIcon}
          mode="aspectFit"
          onClick={handleMessageClick}
        />
      </View>

      {/* 内容区域 */}
      <ScrollView className="content" scrollY>
        {/* 天气信息 */}
        <View className="weather-card">
          <View className="weather-info">
            <Text className="temperature">
              {weatherData.temperature} {weatherData.condition}
            </Text>
            <Text className="quote">{weatherData.quote}</Text>
          </View>

          {/* 大型横幅 */}
          <View className="banner">
            <View className="banner-title">不知如何抽检？</View>
            <View className="banner-subtitle">/问题推行/</View>
            <View className="banner-tag">祝您抽检顺利</View>
          </View>
        </View>

        {/* 范围抽样 */}
        <View className="section">
          <View className="section-title">范围抽样</View>
          <View className="items-grid">
            {scopeSamplingItems.map((item) => (
              <View key={item.id} className="grid-item">
                <View className={`item-icon ${item.icon}`}></View>
                <Text className="item-title">{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 规范抽备 */}
        <View className="section">
          <View className="section-title">规范抽备</View>
          <View className="items-grid">
            {normalSamplingItems.map((item) => (
              <View key={item.id} className="grid-item">
                <View className={`item-icon ${item.icon}`}></View>
                <Text className="item-title">{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 便捷工具 */}
        <View className="section">
          <View className="section-title">便捷工具</View>
          <View className="items-grid">
            {toolItems.map((item) => (
              <View key={item.id} className="grid-item">
                <View className={`item-icon ${item.icon}`}></View>
                <Text className="item-title">{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 大家在聊 */}
        <View className="section">
          <View className="section-title">大家在聊</View>
          <View className="community-posts">
            {communityPosts.map((post) => (
              <View key={post.id} className="post-item">
                <View className="post-header">
                  <View className="post-type">{post.type}</View>
                  <Text className="post-title">{post.title}</Text>
                </View>
                <View className="post-footer">
                  <View className="post-author">{post.author}</View>
                  <View className="post-stats">
                    <Text className="post-comments">{post.comments}评论</Text>
                    <Text className="post-likes">{post.likes}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 底部空白占位，防止内容被底部导航遮挡 */}
        <View className="bottom-spacer"></View>
      </ScrollView>
    </View>
  );
};

export default Index;
