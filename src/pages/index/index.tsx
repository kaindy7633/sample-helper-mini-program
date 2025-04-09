import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import { Swiper } from "@taroify/core";
import Taro from "@tarojs/taro";
import { getFrontPageData } from "../../services/home";
import type { FrontPageData } from "../../services/home";
import "./index.less";
import homeLogo from "../../assets/images/ico_homelogo.png";
import messageIcon from "../../assets/images/ico_msg.png";
// 导入轮播图图片
import swiper01 from "../../assets/images/temp/swiper-01.png";
import swiper02 from "../../assets/images/temp/swiper-02.png";
import swiper03 from "../../assets/images/temp/swiper-03.png";
import swiper04 from "../../assets/images/temp/swiper-04.png";

/**
 * 移除字符串中的HTML标签
 * @param html HTML字符串
 * @returns 清理后的文本
 */
const removeHtmlTags = (html: string): string => {
  return html?.replace(/<[^>]+>/g, "") || "";
};

/**
 * 主页组件
 * @returns {JSX.Element} 主页
 */
const Index: React.FC = (): JSX.Element => {
  const [frontPageData, setFrontPageData] = useState<FrontPageData>({
    weather: {
      location: "",
      toDayWeather: "",
      temperature: "",
      weatherIcon: "",
    },
    chickenSoupContent: "",
  });

  // 修改轮播图数据为本地数据
  const [bannerList] = useState<
    Array<{ id: number; resourceUrl: string; resourceName: string }>
  >([
    { id: 1, resourceUrl: swiper01, resourceName: "轮播图1" },
    { id: 2, resourceUrl: swiper02, resourceName: "轮播图2" },
    { id: 3, resourceUrl: swiper03, resourceName: "轮播图3" },
    { id: 4, resourceUrl: swiper04, resourceName: "轮播图4" },
  ]);

  useEffect(() => {
    fetchFrontPageData();
  }, []);

  /**
   * 获取首页数据
   */
  const fetchFrontPageData = async () => {
    try {
      const data = await getFrontPageData();
      setFrontPageData({
        weather: data.weather,
        chickenSoupContent: removeHtmlTags(data.chickenSoupContent),
      });
    } catch (error) {
      console.error("获取首页数据失败:", error);
    }
  };

  // 修改为靶向抽样数据
  const scopeSamplingItems = [
    {
      id: 1,
      title: "抽样重复查询",
      icon: "targeted-sampling",
    },
  ];

  // 模拟规范抽备数据
  const normalSamplingItems = [
    {
      id: 1,
      title: "食品分类查询",
      icon: "food_category_search",
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

      {/* 内容区域 - 所有内容放入 ScrollView */}
      <ScrollView className="content" scrollY>
        {/* 天气信息区域 */}
        <View className="weather-section">
          <View className="weather-info">
            <Image
              className="weather-icon"
              src={frontPageData.weather.weatherIcon}
              mode="aspectFit"
            />
            <View className="weather-content">
              <View className="weather-detail">
                <Text className="temperature">
                  {frontPageData.weather.toDayWeather}
                </Text>
                <Text className="weather-type">
                  {frontPageData.weather.temperature}{" "}
                  {frontPageData.weather.location}
                </Text>
              </View>
              <View className="scroll-text">
                <Text className="quote">
                  {frontPageData.chickenSoupContent}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 轮播图区域 */}
        <View className="banner-section">
          <Swiper className="banner-swiper" autoplay={4000} lazyRender>
            <Swiper.Indicator />
            {bannerList.map((banner) => (
              <Swiper.Item key={banner.id}>
                <Image
                  className="banner-image"
                  src={banner.resourceUrl}
                  mode="aspectFill"
                />
              </Swiper.Item>
            ))}
          </Swiper>
        </View>

        {/* 范围抽样 - 修改为靶向抽样 */}
        <View className="section">
          <View className="section-title">靶向抽样</View>
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
