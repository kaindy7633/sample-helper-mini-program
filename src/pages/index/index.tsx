/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import { Swiper } from "@taroify/core";
import Taro from "@tarojs/taro";
import { getFrontPageData } from "../../services/home";
import type { FrontPageData } from "../../services/home";
import { appApi } from "../../services";
import "./index.less";
import homeLogo from "../../assets/images/ico_homelogo.png";
import messageIcon from "../../assets/images/ico_msg.png";

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

  // 添加状态控制滚动文字显示
  const [showScrollText, setShowScrollText] = useState<boolean>(false);

  // 应用菜单状态
  // const [menuItems, setMenuItems] = useState<Record<string, any>[]>([]);

  // 轮播图数据
  const [bannerList, setBannerList] = useState<Record<string, any>[]>([]);

  // 靶向抽样模块菜单
  const [scopeSamplingItems, setScopeSamplingItems] = useState<
    Record<string, any>[]
  >([]);

  // 规范抽备模块菜单
  const [normalSamplingItems, setNormalSamplingItems] = useState<
    Record<string, any>[]
  >([]);

  // 便捷工具模块菜单
  const [convenientToolsItems, setConvenientToolsItems] = useState<
    Record<string, any>[]
  >([]);

  useEffect(() => {
    fetchFrontPageData();
    fetchAppMenu();

    // 延迟显示滚动文字，确保首次渲染时样式已经正确应用
    const timer = setTimeout(() => {
      setShowScrollText(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  /**
   * 获取首页数据
   * 这里也包含了轮播图的数据
   */
  const fetchFrontPageData = async () => {
    try {
      const data = await getFrontPageData();
      setFrontPageData({
        weather: data.weather,
        chickenSoupContent: removeHtmlTags(data.chickenSoupContent),
      });
      setBannerList(data.resourceList || []);
    } catch (error) {
      console.error("获取首页数据失败:", error);
    }
  };

  /**
   * 获取应用菜单
   * 这里其实是首页应用中的菜单数据
   */
  const fetchAppMenu = async () => {
    try {
      const { studyList, tools } = await appApi.getAppMenu();
      // setMenuItems(tools);
      setScopeSamplingItems(
        tools?.filter(
          (item: Record<string, any>) => item.appName === "抽样重复查询"
        )
      );
      setNormalSamplingItems(
        tools?.filter(
          (item: Record<string, any>) =>
            item.appName === "食品分类查询" ||
            item.appName === "标法查询" ||
            item.appName === "抽样单验证"
        )
      );
      setConvenientToolsItems(
        tools?.filter(
          (item: Record<string, any>) => item.appName === "企业证照查询"
        )
      );

      // 将学习模块菜单数据存储到storage中
      if (studyList && studyList.length > 0) {
        Taro.setStorageSync("study_menu_list", studyList);
      }
    } catch (error) {
      console.error("获取应用菜单失败:", error);
    }
  };

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
      url: "/SPAMessage/pages/message/index",
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
                {showScrollText && (
                  <Text className="quote">
                    {frontPageData.chickenSoupContent}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* 轮播图区域 */}
        <View className="banner-section">
          {bannerList.length > 0 && (
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
          )}
        </View>

        {/* 范围抽样 - 修改为靶向抽样 */}
        <View className="section">
          <View className="section-title">靶向抽样</View>
          <View className="items-grid">
            {scopeSamplingItems.map((item) => (
              <View
                key={item.id}
                className="grid-item"
                onClick={() => {
                  Taro.navigateTo({
                    url: "/SPASampling/pages/sampling/index",
                  });
                }}
              >
                <Image
                  className="item-icon"
                  src={item.appIcon}
                  mode="aspectFit"
                />
                <Text className="item-title">{item.appName}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 规范抽备 */}
        <View className="section">
          <View className="section-title">规范抽备</View>
          <View className="items-grid">
            {normalSamplingItems.map((item) => (
              <View
                key={item.id}
                className="grid-item"
                onClick={() => {
                  // 根据应用名称跳转到不同页面
                  if (item.appName === "食品分类查询") {
                    Taro.navigateTo({
                      url: "/SPAFoodClass/pages/foodclass/index",
                    });
                  } else if (item.appName === "标法查询") {
                    Taro.navigateTo({
                      url: "/SPAStandard/pages/standard/index",
                    });
                  } else if (item.appName === "抽样单验证") {
                    Taro.navigateTo({
                      url: "/SPASampleValidation/pages/validation/list/index",
                    });
                  } else {
                    // 其他应用暂时没有实现，可以显示提示
                    Taro.showToast({
                      title: `${item.appName}功能开发中`,
                      icon: "none",
                    });
                  }
                }}
              >
                <Image
                  className="item-icon"
                  src={item.appIcon}
                  mode="aspectFit"
                />
                <Text className="item-title">{item.appName}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 便捷工具 */}
        <View className="section">
          <View className="section-title">便捷工具</View>
          <View className="items-grid">
            {convenientToolsItems.map((item) => (
              <View
                key={item.id}
                className="grid-item"
                onClick={() => {
                  if (item.appName === "企业证照查询") {
                    Taro.navigateTo({
                      url: "/SPALicense/pages/license/index",
                    });
                  } else {
                    // 其他工具暂未实现，显示提示
                    Taro.showToast({
                      title: `${item.appName}功能开发中`,
                      icon: "none",
                    });
                  }
                }}
              >
                <Image
                  className="item-icon"
                  src={item.appIcon}
                  mode="aspectFit"
                />
                <Text className="item-title">{item.appName}</Text>
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
