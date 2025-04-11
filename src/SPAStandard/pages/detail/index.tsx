/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import { standardApi } from "../../../services";
import type { StandardDetail } from "../../../services/standard";
import "./index.less";

/**
 * 标准详情页面组件
 * @returns {JSX.Element} 标准详情页面
 */
const StandardDetailPage: React.FC = (): JSX.Element => {
  const router = useRouter();
  const standardId = router.params.id || "";
  
  // 标准详情
  const [standard, setStandard] = useState<StandardDetail | null>(null);
  
  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);

  // 获取标准详情
  useEffect(() => {
    if (standardId) {
      fetchStandardDetail(standardId);
    } else {
      setLoading(false);
      Taro.showToast({
        title: "标准ID不存在",
        icon: "none",
      });
    }
  }, [standardId]);

  /**
   * 获取标准详情
   */
  const fetchStandardDetail = async (id: string) => {
    try {
      setLoading(true);
      const data = await standardApi.getStandardDetail(id);
      setStandard(data);
    } catch (error) {
      console.error("获取标准详情失败:", error);
      Taro.showToast({
        title: "获取标准详情失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 返回上一页
   */
  const handleBack = () => {
    Taro.navigateBack();
  };

  if (loading) {
    return (
      <View className="loading-container">
        <Text>加载中...</Text>
      </View>
    );
  }

  if (!standard) {
    return (
      <View className="error-container">
        <Text>标准不存在或已被删除</Text>
        <View className="back-btn" onClick={handleBack}>
          返回
        </View>
      </View>
    );
  }

  return (
    <View className="container">
      {/* 顶部栏 */}
      <View className="header">
        <View className="back-icon" onClick={handleBack}></View>
        <Text className="title">标准详情</Text>
        <View className="placeholder"></View>
      </View>

      {/* 详情内容 */}
      <View className="content">
        <View className="detail-card">
          <View className="standard-name">{standard.standardName}</View>
          
          <View className="detail-item">
            <Text className="item-label">标准编号：</Text>
            <Text className="item-value">{standard.standardCode}</Text>
          </View>
          
          <View className="detail-item">
            <Text className="item-label">标准类型：</Text>
            <Text className="item-value">{standard.standardType}</Text>
          </View>
          
          <View className="detail-item">
            <Text className="item-label">标准状态：</Text>
            <Text className="item-value">{standard.standardStatus}</Text>
          </View>
          
          <View className="detail-item">
            <Text className="item-label">发布日期：</Text>
            <Text className="item-value">{standard.publishDate}</Text>
          </View>
          
          <View className="detail-item">
            <Text className="item-label">实施日期：</Text>
            <Text className="item-value">{standard.implementDate}</Text>
          </View>
          
          <View className="detail-item">
            <Text className="item-label">地区：</Text>
            <Text className="item-value">{standard.region}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StandardDetailPage;