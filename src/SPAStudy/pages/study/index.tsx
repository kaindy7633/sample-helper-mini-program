/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Skeleton, PullRefresh, List, Loading } from "@taroify/core";
import { messageApi } from "../../../services";
import icoNew from "../../../assets/images/ico_new.png";
import "./index.less";

/**
 * 问题卡片组件
 * @param {Object} props - 组件属性
 * @param {string} props.icon - 图标内容
 * @param {string} props.question - 问题标题
 * @param {string} props.answer - 问题答案
 * @returns {JSX.Element} 问题卡片组件
 */
const QuestionCard: React.FC<{
  icon: string;
  question: string;
  answer: string;
}> = ({ icon, question, answer }) => {
  /**
   * 处理点击问题卡片事件，跳转到常见问题页面
   */
  const handleQuestionClick = () => {
    Taro.navigateTo({
      url: "/SPACommonProblem/pages/problem/index",
      success: () => {
        console.log("导航到常见问题页面成功");
      },
      fail: (err) => {
        console.error("导航到常见问题页面失败:", err);
        Taro.showToast({
          title: "页面跳转失败",
          icon: "none",
        });
      },
    });
  };

  return (
    <View className="faq-card" onClick={handleQuestionClick}>
      <View className="faq-icon-container">
        <View className="faq-icon">{icon}</View>
      </View>
      <View className="faq-content">
        <View className="faq-question">{question}</View>
        <View className="faq-answer">{answer}</View>
      </View>
    </View>
  );
};

/**
 * 新闻卡片组件
 * @param {Object} props - 组件属性
 * @param {string} props.title - 新闻标题
 * @param {string} props.date - 发布日期
 * @param {string} props.fileUrl - PDF文件URL
 * @returns {JSX.Element} 新闻卡片组件
 */
const NewsCard: React.FC<{
  title: string;
  date: string;
  fileUrl?: string;
}> = ({ title, date, fileUrl }) => {
  /**
   * 处理点击新闻卡片事件
   */
  const handleNewsClick = () => {
    if (fileUrl) {
      // 打开PDF文件
      Taro.showLoading({ title: "文件加载中..." });

      // 使用Taro.downloadFile下载文件后再打开
      Taro.downloadFile({
        url: fileUrl,
        success: (res) => {
          Taro.hideLoading();
          if (res.statusCode === 200) {
            Taro.openDocument({
              filePath: res.tempFilePath,
              success: () => {
                console.log("打开文档成功");
              },
              fail: (error) => {
                console.error("打开文档失败", error);
                Taro.showToast({
                  title: "无法打开文件",
                  icon: "none",
                });
              },
            });
          }
        },
        fail: (error) => {
          Taro.hideLoading();
          console.error("下载文件失败", error);
          Taro.showToast({
            title: "文件下载失败",
            icon: "none",
          });
        },
      });
    }
  };

  return (
    <View className="news-card" onClick={handleNewsClick}>
      <View className="news-title">{title}</View>
      <View className="news-date">{date}</View>
    </View>
  );
};

/**
 * 获取图标颜色类名
 * @param index 索引号
 * @returns 对应的颜色类名
 */
const getColorClass = (index: number): string => {
  const colorClasses = [
    "topic-color-red",
    "topic-color-blue",
    "topic-color-orange",
    "topic-color-green",
    "topic-color-indigo",
  ];
  return colorClasses[index % colorClasses.length];
};

/**
 * 学习页面组件
 * @returns {JSX.Element} 学习页面
 */
const StudyPage: React.FC = () => {
  // 学习专题数据状态
  const [studyTopics, setStudyTopics] = useState<Record<string, any>[]>([
    {
      id: 1,
      icon: "细",
      title: "抽样细则",
      path: "/SPASamplingRegulation/pages/regulation/index",
    },
    {
      id: 2,
      icon: "范",
      title: "抽样规范",
      path: "/SPASamplingSpecification/pages/specification/index",
    },
    {
      id: 3,
      icon: "?",
      title: "常见问题",
      path: "/SPACommonProblem/pages/problem/index",
    },
    {
      id: 4,
      icon: "食",
      title: "食安云学堂",
      path: "/SPAFoodSchool/pages/course/index",
    },
    {
      id: 5,
      icon: "讯",
      title: "大家再聊",
    },
  ]);

  // 最新动态数据状态
  const [newsItems, setNewsItems] = useState<Record<string, any>[]>([]);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  // 初始加载状态 - 用于显示骨架屏
  const [initialNewsLoading, setInitialNewsLoading] = useState<boolean>(true);
  // 下拉刷新状态
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // 常见问题数据状态
  const [faqItems, setFaqItems] = useState<Record<string, any>[]>([]);
  // 常见问题加载状态
  const [faqLoading, setFaqLoading] = useState<boolean>(false);
  // 常见问题初始加载状态
  const [initialFaqLoading, setInitialFaqLoading] = useState<boolean>(true);
  // 常见问题分页状态
  const [faqPagination, setFaqPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
    hasMore: false,
  });

  // 滚动容器ref
  const scrollRef = useRef<any>(null);

  // 主滚动区域高度
  const [scrollViewHeight, setScrollViewHeight] = useState<string>("100vh");

  /**
   * 获取学习专题数据
   */
  const fetchStudyTopics = () => {
    try {
      const studyMenuList = Taro.getStorageSync("study_menu_list");
      if (studyMenuList && studyMenuList.length > 0) {
        console.log("从storage获取到学习模块菜单数据", studyMenuList);

        // 转换数据格式
        const formattedTopics = studyMenuList.map((item, index) => {
          let path;
          switch (item.appName) {
            case "抽样细则":
              path = "/SPASamplingRegulation/pages/regulation/index";
              break;
            case "抽样规范":
              path = "/SPASamplingSpecification/pages/specification/index";
              break;
            case "常见问题":
              path = "/SPACommonProblem/pages/problem/index";
              break;
            case "食安云学堂":
              path = "/SPAFoodSchool/pages/course/index";
              break;
            default:
              path = undefined;
          }
          return {
            id: item.id || index + 1,
            appIcon: item.appIcon,
            icon: item.appName?.substring(0, 1) || "?",
            title: item.appName || item.name || "未命名",
            path: path, // 使用计算出的path
          };
        });

        setStudyTopics(formattedTopics);
      }
    } catch (error) {
      console.error("获取学习模块菜单数据失败:", error);
    }
  };

  // 获取所有数据
  useEffect(() => {
    // 计算ScrollView的高度，减去Tab栏高度
    const systemInfo = Taro.getSystemInfoSync();
    const tabBarHeight = 100; // 预估标签栏高度，单位rpx
    const pixelRatio = 750 / systemInfo.windowWidth;
    const tabBarHeightPx = tabBarHeight / pixelRatio;
    const scrollHeight = `${systemInfo.windowHeight - tabBarHeightPx}px`;
    setScrollViewHeight(scrollHeight);

    // 获取学习专题数据
    fetchStudyTopics();
    // 获取最新动态数据
    fetchNewsMessages();
    // 获取常见问题数据
    fetchCommonProblems();
  }, []);

  /**
   * 获取最新动态数据
   */
  const fetchNewsMessages = async () => {
    try {
      setLoading(true);
      setInitialNewsLoading(true);
      const response = await messageApi.getNewsMessages();

      // 处理数据并更新状态
      if (response && response.length > 0) {
        // 格式化日期并按日期降序排序
        const formattedMessages = response
          .map((item) => ({
            id: item.id || String(Math.random()),
            title: item.newsName,
            publishDate: item.newsTime,
            fileUrl: item.originalFileUrl,
            fileName: item.originalFileName,
          }))
          .sort((a, b) => {
            // 降序排序（最新的在前面）
            return (
              new Date(b.publishDate).getTime() -
              new Date(a.publishDate).getTime()
            );
          });

        setNewsItems(formattedMessages);
      } else {
        setNewsItems([]);
      }
    } catch (error) {
      console.error("获取最新动态数据失败:", error);
      // 设置默认数据
      setNewsItems([
        {
          id: "1",
          title: "国家食品安全监督抽检实施细则（2025年版）抽样板块",
          publishDate: "2025-03-13",
        },
        {
          id: "2",
          title: "2025年国抽细则变化",
          publishDate: "2025-03-13",
        },
      ]);
    } finally {
      setLoading(false);
      setInitialNewsLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * 获取常见问题数据
   * @param refresh 是否刷新列表
   */
  const fetchCommonProblems = async (refresh = true) => {
    try {
      setFaqLoading(true);
      if (refresh) {
        setInitialFaqLoading(true);
      }

      // 只获取5条数据
      const response = await messageApi.getCommonProblems({
        current: 1,
        size: 5,
      });

      // 处理数据并更新状态
      if (response && response.records && response.records.length > 0) {
        // 将API返回的数据转换为组件需要的格式
        const formattedFaqs = response.records.map((item, index) => {
          // HTML内容处理：移除HTML标签
          const cleanAnswer = item.answer.replace(/<\/?[^>]+(>|$)/g, "");

          return {
            id: item.id || String(index + 1),
            icon: "Q",
            question: item.problemName,
            answer: cleanAnswer,
          };
        });

        // 更新状态
        setFaqItems(formattedFaqs);

        // 添加"查看更多"按钮状态
        setFaqPagination({
          current: 1,
          size: 5,
          total: Number(response.total) || 0,
          hasMore: false, // 不再支持加载更多
        });
      } else {
        // 如果没有数据，则清空列表
        setFaqItems([]);
        setFaqPagination({
          current: 1,
          size: 5,
          total: 0,
          hasMore: false,
        });
      }
    } catch (error) {
      console.error("获取常见问题数据失败:", error);
      setFaqItems([]);
      setFaqPagination({
        current: 1,
        size: 5,
        total: 0,
        hasMore: false,
      });
    } finally {
      setFaqLoading(false);
      setInitialFaqLoading(false);
    }
  };

  // 处理下拉刷新
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchStudyTopics(),
      fetchNewsMessages(),
      fetchCommonProblems(true),
    ]);
    setRefreshing(false);
  };

  // 渲染骨架屏
  const renderSkeleton = (type: "news" | "faq") => {
    const count = type === "news" ? 3 : 4;
    return (
      <View className="skeleton-container">
        {Array.from({ length: count }).map((_, index) => (
          <View key={index} className={`skeleton-card ${type}-skeleton`}>
            {type === "news" ? (
              <>
                <Skeleton
                  style={{ width: "90%", height: "32px", marginBottom: "16px" }}
                />
                <Skeleton style={{ width: "40%", height: "24px" }} />
              </>
            ) : (
              <>
                <View style={{ display: "flex", alignItems: "flex-start" }}>
                  <Skeleton
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "16px",
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Skeleton
                      style={{
                        width: "80%",
                        height: "28px",
                        marginBottom: "12px",
                      }}
                    />
                    <Skeleton style={{ width: "95%", height: "24px" }} />
                    <Skeleton
                      style={{ width: "70%", height: "24px", marginTop: "8px" }}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        ))}
      </View>
    );
  };

  /**
   * 处理专题项点击
   * @param topic 专题数据
   */
  const handleTopicClick = (topic: Record<string, any>) => {
    // 添加调试日志
    console.log("点击了专题：", topic);

    // 对抽样细则特殊处理
    if (topic.title === "抽样细则") {
      const path = "/SPASamplingRegulation/pages/regulation/index";
      console.log("准备导航到抽样细则页面:", path);
      Taro.navigateTo({
        url: path,
        success: () => {
          console.log("导航成功!");
        },
        fail: (err) => {
          console.error("导航失败:", err);
          Taro.showToast({
            title: "页面跳转失败: " + JSON.stringify(err),
            icon: "none",
            duration: 3000,
          });
        },
      });
      return;
    }

    // 检查是否有路径配置
    if (topic.path) {
      // 使用Taro导航到指定页面
      console.log("准备导航到页面:", topic.path);
      Taro.navigateTo({
        url: topic.path,
        success: () => {
          console.log("导航成功!");
        },
        fail: (err) => {
          console.error("导航失败:", err);
          Taro.showToast({
            title: "页面跳转失败",
            icon: "none",
          });
        },
      });
    } else {
      // TODO: 处理其他专题的点击事件
      Taro.showToast({
        title: "不确定业务模块或功能开发中",
        icon: "none",
      });
    }
  };

  return (
    <View className="container">
      <PullRefresh loading={refreshing} onRefresh={onRefresh}>
        <List
          loading={false}
          hasMore={false}
          offset={100}
          immediateCheck={false}
          style={{ minHeight: scrollViewHeight }}
        >
          {/* 学习专题部分 */}
          <View className="section">
            <View className="section-title">学习专题</View>
            <View className="topics-grid">
              {studyTopics.map((topic, index) => (
                <View
                  className="topic-item"
                  key={topic.id}
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic.appIcon ? (
                    <Image
                      className="topic-icon-image"
                      src={topic.appIcon}
                      mode="aspectFit"
                    />
                  ) : (
                    <View className={`topic-icon-bg ${getColorClass(index)}`}>
                      <Text className="topic-icon-text">{topic.icon}</Text>
                    </View>
                  )}
                  <Text className="topic-title">{topic.title}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 最新动态部分 */}
          <View className="section">
            <View className="section-header">
              <View className="section-title-container">
                <Image className="now-badge" src={icoNew} mode="aspectFit" />
                <Text className="section-title">最新动态</Text>
              </View>
            </View>
            <View className="news-list">
              {initialNewsLoading ? (
                renderSkeleton("news")
              ) : newsItems.length > 0 ? (
                newsItems.map((item) => (
                  <NewsCard
                    key={item.id}
                    title={item.title}
                    date={item.publishDate || ""}
                    fileUrl={item.fileUrl}
                  />
                ))
              ) : (
                <View className="empty-text">暂无最新动态</View>
              )}
            </View>
          </View>

          {/* 常见问题部分 */}
          <View className="section">
            <View className="section-header">
              <View className="section-title-container">
                <Text className="section-title">常见问题</Text>
              </View>
            </View>
            <View className="faq-list">
              {initialFaqLoading ? (
                renderSkeleton("faq")
              ) : faqItems.length > 0 ? (
                faqItems.map((item) => (
                  <QuestionCard
                    key={item.id}
                    icon={item.icon}
                    question={item.question}
                    answer={item.answer}
                  />
                ))
              ) : (
                <View className="empty-text">暂无常见问题</View>
              )}
            </View>
          </View>
        </List>
      </PullRefresh>
    </View>
  );
};

export default StudyPage;
