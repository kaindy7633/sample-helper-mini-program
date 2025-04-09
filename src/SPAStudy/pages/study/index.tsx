import React, { useState, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { messageApi } from "../../../services";
import type { NewsResponse, NewsItem } from "../../../services/message";
import icoNew from "../../../assets/images/ico_new.png";
import "./index.less";

/**
 * 问题卡片组件
 * @param {Object} props - 组件属性
 * @param {string} props.icon - 图标路径
 * @param {string} props.question - 问题标题
 * @param {string} props.answer - 问题答案
 * @returns {JSX.Element} 问题卡片组件
 */
const QuestionCard: React.FC<{
  icon: string;
  question: string;
  answer: string;
}> = ({ icon, question, answer }) => {
  return (
    <View className="faq-card">
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
 * 格式化日期
 * @param dateString 日期字符串
 * @returns 格式化后的日期（YYYY-MM-DD）
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  } catch (error) {
    console.error("日期格式化失败:", error);
    return dateString;
  }
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
    },
    {
      id: 2,
      icon: "范",
      title: "抽样规范",
    },
    {
      id: 3,
      icon: "?",
      title: "常见问题",
    },
    {
      id: 4,
      icon: "食",
      title: "食安云学堂",
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

  // 获取学习专题数据
  useEffect(() => {
    try {
      const studyMenuList = Taro.getStorageSync("study_menu_list");
      if (studyMenuList && studyMenuList.length > 0) {
        console.log("从storage获取到学习模块菜单数据", studyMenuList);

        // 转换数据格式
        const formattedTopics = studyMenuList.map((item, index) => ({
          id: item.id || index + 1,
          appIcon: item.appIcon, // 服务器返回的图标URL
          icon: item.appName?.substring(0, 1) || "?", // 取名称第一个字作为图标
          title: item.appName || item.name || "未命名",
        }));

        setStudyTopics(formattedTopics);
      }
    } catch (error) {
      console.error("获取学习模块菜单数据失败:", error);
    }
  }, []);

  // 获取最新动态数据
  useEffect(() => {
    fetchNewsMessages();
  }, []);

  /**
   * 获取最新动态数据
   */
  const fetchNewsMessages = async () => {
    try {
      setLoading(true);
      const response = await messageApi.getNewsMessages();
      console.log("获取到的最新动态数据:", response);

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
    }
  };

  // 常见问题数据
  const faqItems = [
    {
      id: 1,
      icon: "Q",
      question: "电子签章出现问题，如何处理？",
      answer:
        "建议在新国抽首页登录页找联系方式进行联系。服务群内反馈即可，企业微信客服实时受理。",
    },
    {
      id: 2,
      icon: "Q",
      question: "新国抽上异议处置结果撤回异议是申请情况下选择？",
      answer:
        "老国抽系统，异议分三部，登记，受理，处置。现在新系统只有登记和处置两个步骤，具体操作请咨询你呼我应。",
    },
    {
      id: 3,
      icon: "Q",
      question: "10+3+1限制条件范围？",
      answer:
        "仅在星级报送分类任务中限制重复抽检有效，对于市市县县级别无法限制。",
    },
    {
      id: 4,
      icon: "Q",
      question: "样品信息如需修改",
      answer:
        "修改后下载数据中心模块数据，仍是之前的数据数据，注意在3小时后下载数据才能更新为已调整数据。",
    },
    {
      id: 5,
      icon: "Q",
      question: "报告签章时报错？",
      answer:
        "签章时检签章规则判断错误，检查检测模块的签章配置的规则和信步云是否一致。",
    },
  ];

  return (
    <View className="container">
      {/* 学习专题部分 */}
      <View className="section">
        <View className="section-title">学习专题</View>
        <View className="topics-grid">
          {studyTopics.map((topic, index) => (
            <View className="topic-item" key={topic.id}>
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
          {loading ? (
            <View className="loading-text">加载中...</View>
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
        <View className="section-title">常见问题</View>
        <View className="faq-list">
          {faqItems.map((item) => (
            <QuestionCard
              key={item.id}
              icon={item.icon}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default StudyPage;
