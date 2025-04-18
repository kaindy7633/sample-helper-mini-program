import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { Empty, Loading, Divider } from "@taroify/core";
import { ArrowLeft } from "@taroify/icons";
import "./index.less";

import { useCategoryList, useQuestionList } from "./hooks";

/**
 * 常见问题页面组件
 * @returns {JSX.Element} 常见问题页面
 */
const CommonProblemPage: React.FC = () => {
  const router = useRouter();
  const { category = "0" } = router.params;

  // 当前选中的分类ID
  const [activeCategory, setActiveCategory] = useState<string>(category);

  // 获取分类列表和问题列表
  const { categoryList, loading: categoryLoading } = useCategoryList();
  const {
    questionList,
    loading: questionLoading,
    finished,
  } = useQuestionList(activeCategory);

  /**
   * 处理标签点击
   * @param {string} id 分类ID
   */
  const handleTabClick = (id: string) => {
    if (id !== activeCategory) {
      setActiveCategory(id);
    }
  };

  /**
   * 查看问题详情
   * @param {Object} question 问题对象
   */
  const handleQuestionClick = (question) => {
    // 详情页还未创建，直接显示弹窗
    Taro.showModal({
      title: question.title,
      content: question.content,
      showCancel: false,
      confirmText: "知道了",
    });
  };

  /**
   * 返回上一页
   */
  const handleBackClick = () => {
    Taro.navigateBack();
  };

  /**
   * 前往问答页面
   */
  const handleQAClick = () => {
    // QA页面尚未创建，显示提示
    Taro.showToast({
      title: "问答功能开发中",
      icon: "none",
      duration: 2000,
    });
  };

  return (
    <View className="common-problem-container">
      {/* 导航栏 */}
      <View className="nav-bar">
        <View className="nav-bar-left" onClick={handleBackClick}>
          <ArrowLeft />
        </View>
        <View className="nav-bar-title">常见问题</View>
        <View className="nav-bar-right">
          <Text className="qa-button" onClick={handleQAClick}>
            问答
          </Text>
        </View>
      </View>

      {/* 顶部信息区域 */}
      <View className="top-info">
        <Text className="top-info-text">更多问题请加入</Text>
        <Text className="top-info-link">全国食品问题交流群</Text>
      </View>

      {/* 分类标签栏 */}
      <ScrollView className="category-scroll" scrollX scrollWithAnimation>
        <View className="category-list">
          {!categoryLoading &&
            categoryList.map((item) => (
              <View
                key={item.id}
                className={`category-item ${
                  activeCategory === item.id ? "category-item-active" : ""
                }`}
                onClick={() => handleTabClick(item.id)}
              >
                {item.name}
              </View>
            ))}
        </View>
      </ScrollView>

      {/* 问题列表 */}
      <View className="question-container">
        {questionLoading ? (
          <View className="loading-container">
            <Loading type="spinner" />
          </View>
        ) : questionList.length > 0 ? (
          <View className="question-list">
            {questionList.map((item, index) => (
              <View key={item.id}>
                <View
                  className="question-item"
                  onClick={() => handleQuestionClick(item)}
                >
                  <View className="question-icon">Q</View>
                  <View className="question-content">
                    <View className="question-title">{item.title}</View>
                  </View>
                </View>
                {index < questionList.length - 1 && <Divider />}
              </View>
            ))}
            {/* 加载状态或底部提示 */}
            {questionLoading ? (
              <View className="list-loading">
                <Loading size="24px">加载中...</Loading>
              </View>
            ) : (
              finished && (
                <View className="list-finished">
                  {questionList.length >= 10 ? "没有更多了" : ""}
                </View>
              )
            )}
          </View>
        ) : (
          <View className="empty-container">
            <Empty>
              <Empty.Image />
              <Empty.Description>暂无相关问题</Empty.Description>
            </Empty>
          </View>
        )}
      </View>
    </View>
  );
};

export default CommonProblemPage;
