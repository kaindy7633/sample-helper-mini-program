import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { Empty, Loading, Divider } from "@taroify/core";
import { ArrowLeft } from "@taroify/icons";
import QrcodeImg from "../../../assets/images/qrcode_manager.jpg";
import "./index.less";

import { useCategoryList, useQuestionList } from "./hooks";
import type { Category, Question } from "./hooks";

/**
 * 骨架屏组件
 */
const Skeleton: React.FC = () => {
  return (
    <View className="skeleton-container">
      {[1, 2, 3].map((item) => (
        <View key={item} className="skeleton-item">
          <View className="skeleton-question">
            <View className="skeleton-icon" />
            <View className="skeleton-title" />
          </View>
          <View className="skeleton-answer">
            <View className="skeleton-icon" />
            <View className="skeleton-content">
              <View className="skeleton-line" />
              <View className="skeleton-line" />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

/**
 * 常见问题页面组件
 * @returns {JSX.Element} 常见问题页面
 */
const CommonProblemPage: React.FC = () => {
  const router = useRouter();
  const { typeId = "" } = router.params;

  // 当前选中的分类ID
  const [activeCategory, setActiveCategory] = useState<string>(typeId);
  const [current, setCurrent] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [showQrcodeModal, setShowQrcodeModal] = useState(false);

  // 获取分类列表和问题列表
  const { categoryList, loading: categoryLoading } = useCategoryList();
  const {
    questionList,
    loading: questionLoading,
    finished,
    refresh,
    loadMore,
    total,
  } = useQuestionList(activeCategory, current);

  // 设置页面标题
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: "常见问题" });
  }, []);

  /**
   * 处理标签点击
   * @param {string} id 分类ID
   */
  const handleTabClick = (id: string) => {
    if (id !== activeCategory) {
      setActiveCategory(id);
      setCurrent(1);
    }
  };

  /**
   * 处理下拉刷新
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    setCurrent(1);
    await refresh();
    setRefreshing(false);
    Taro.showToast({
      title: "刷新成功",
      icon: "success",
      duration: 2000,
    });
  };

  /**
   * 处理滚动加载
   */
  const handleScrollToLower = async () => {
    if (!finished && !questionLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      const nextPage = current + 1;
      setTimeout(async () => {
        setCurrent(nextPage);
        await loadMore(nextPage);
        setIsLoadingMore(false);
      }, 1000);
    }
  };

  /**
   * 查看问题详情
   * @param {Question} question 问题对象
   */
  const handleQuestionClick = (question: Question) => {
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
      {/* 顶部信息区域 */}
      <View className="top-info">
        <Text className="top-info-text">更多问题请加入</Text>
        <Text
          className="top-info-link"
          onClick={() => setShowQrcodeModal(true)}
        >
          全国食品问题交流群
        </Text>
      </View>

      {/* 二维码弹窗 */}
      {showQrcodeModal && (
        <View className="qrcode-modal-mask">
          <View className="qrcode-modal">
            <View className="qrcode-modal-title">扫描二维码管理员邀请入群</View>
            <Image className="qrcode-img" src={QrcodeImg} mode="aspectFit" />
            <View className="qrcode-modal-desc">
              北京信睿-全国食品企业标准服务交流群
            </View>
            <View
              className="qrcode-modal-close"
              onClick={() => setShowQrcodeModal(false)}
            >
              关闭
            </View>
          </View>
        </View>
      )}

      {/* 固定区域 */}
      <View className="fixed-area">
        {/* 分类标签栏 */}
        <ScrollView className="category-scroll" scrollX scrollWithAnimation>
          <View className="category-list">
            <View
              className={`category-item ${
                !activeCategory ? "category-item-active" : ""
              }`}
              onClick={() => handleTabClick("")}
            >
              全部
            </View>
            {!categoryLoading &&
              categoryList.map((item: Category) => (
                <View
                  key={item.id}
                  className={`category-item ${
                    activeCategory === item.id ? "category-item-active" : ""
                  }`}
                  onClick={() => handleTabClick(item.id)}
                >
                  {item.problemTypeName}
                </View>
              ))}
            <View className="category-list-gap" />
          </View>
        </ScrollView>
      </View>

      {/* 可滚动的问题列表区域 */}
      <ScrollView
        className="scrollable-area"
        scrollY
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
        onScrollToLower={handleScrollToLower}
        enableBackToTop
      >
        <View className="question-container">
          {questionLoading && current === 1 ? (
            <Skeleton />
          ) : questionList.length > 0 ? (
            <View className="question-list">
              {questionList.map((item) => (
                <View key={item.id} className="question-item">
                  <View className="question-section">
                    <View className="question-icon">Q</View>
                    <View className="question-title">{item.title}</View>
                  </View>
                  <View className="answer-section">
                    <View className="answer-icon">A</View>
                    <View className="answer-content">{item.content}</View>
                  </View>
                </View>
              ))}
              {/* 加载状态或底部提示 */}
              {isLoadingMore ? (
                <View className="list-loading">
                  <Loading size="24px">加载中...</Loading>
                </View>
              ) : !finished && questionList.length > 0 ? (
                <View className="list-more-btn" onClick={handleScrollToLower}>
                  加载更多
                </View>
              ) : (
                finished && (
                  <View className="list-finished">
                    {total > 0 ? "没有更多了" : ""}
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
      </ScrollView>
    </View>
  );
};

export default CommonProblemPage;
