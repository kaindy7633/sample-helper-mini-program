import React from "react";
import { View, Text } from "@tarojs/components";
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
 * @returns {JSX.Element} 新闻卡片组件
 */
const NewsCard: React.FC<{ title: string; date: string }> = ({
  title,
  date,
}) => {
  return (
    <View className="news-card">
      <View className="news-title">{title}</View>
      <View className="news-date">{date}</View>
    </View>
  );
};

/**
 * 学习页面组件
 * @returns {JSX.Element} 学习页面
 */
const StudyPage: React.FC = () => {
  // 学习专题数据
  const studyTopics = [
    {
      id: 1,
      icon: "细则",
      bgColor: "#ffebee",
      iconColor: "#ff5252",
      title: "抽样细则",
    },
    {
      id: 2,
      icon: "规范",
      bgColor: "#e3f2fd",
      iconColor: "#2196f3",
      title: "抽样规范",
    },
    {
      id: 3,
      icon: "?",
      bgColor: "#fff8e1",
      iconColor: "#ff9800",
      title: "常见问题",
    },
    {
      id: 4,
      icon: "食",
      bgColor: "#e8f5e9",
      iconColor: "#4caf50",
      title: "食安云学堂",
    },
    {
      id: 5,
      icon: "视",
      bgColor: "#e8eaf6",
      iconColor: "#3f51b5",
      title: "大家再聊",
    },
  ];

  // 最新动态数据
  const newsItems = [
    {
      id: 1,
      title: "国家食品安全监督抽检实施细则（2025年版）抽样板块",
      date: "2025-03-13",
    },
    {
      id: 2,
      title: "2025年国抽细则变化",
      date: "2025-03-13",
    },
    {
      id: 3,
      title: "全国食品安全监督抽检实施细则（2024年版）",
      date: "2024-02-23",
    },
    {
      id: 4,
      title: "国家食品安全抽样检验抽样单填表说明",
      date: "2024-02-23",
    },
  ];

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
      {/* 头部标题 */}
      <View className="study-header">
        <Text className="study-title">学习</Text>
      </View>

      {/* 学习专题部分 */}
      <View className="section">
        <View className="section-title">学习专题</View>
        <View className="topics-grid">
          {studyTopics.map((topic) => (
            <View className="topic-item" key={topic.id}>
              <View
                className="topic-icon-bg"
                style={{ backgroundColor: topic.bgColor }}
              >
                <Text
                  className="topic-icon-text"
                  style={{ color: topic.iconColor }}
                >
                  {topic.icon}
                </Text>
              </View>
              <Text className="topic-title">{topic.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 最新动态部分 */}
      <View className="section">
        <View className="section-header">
          <View className="section-title-container">
            <View className="now-badge">Now</View>
            <Text className="section-title">最新动态</Text>
          </View>
        </View>
        <View className="news-list">
          {newsItems.map((item) => (
            <NewsCard key={item.id} title={item.title} date={item.date} />
          ))}
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
