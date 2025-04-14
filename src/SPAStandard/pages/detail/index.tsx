import React, { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { ArrowLeft } from "@taroify/icons";
import Taro from "@tarojs/taro";
import { standardApi } from "../../../services/standard";
import "./index.less";

/**
 * 标准详情页
 * @returns {JSX.Element} 标准详情页
 */
const StandardDetailPage: React.FC = (): JSX.Element => {
  // 标准详情
  const [standard, setStandard] = useState<standardApi.StandardDetail | null>(null);
  
  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * 返回上一页
   */
  const handleBack = () => {
    Taro.navigateBack();
  };

  /**
   * 格式化日期
   */
  const formatDate = (timestamp: number) => {
    if (!timestamp) return '-';
    
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  /**
   * 渲染信息项
   */
  const renderInfoItem = (label: string, value: string) => {
    return (
      <View className="info-item">
        <Text className="info-label">{label}</Text>
        <Text className="info-value">{value || '-'}</Text>
      </View>
    );
  };

  /**
   * 初始加载
   */
  useEffect(() => {
    // 从缓存获取标准详情
    try {
      const standardJson = Taro.getStorageSync('current_standard');
      if (standardJson) {
        const parsedStandard = JSON.parse(standardJson);
        setStandard(parsedStandard);
      }
    } catch (error) {
      console.error('获取标准详情失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View className="container">
      {/* 顶部导航栏 */}
      <View className="header">
        <View className="back-btn" onClick={handleBack}>
          <ArrowLeft size="24" />
        </View>
        <Text className="header-title">标准详情</Text>
      </View>

      {/* 内容区域 */}
      <View className="content">
        {loading ? (
          <View className="loading-container">加载中...</View>
        ) : standard ? (
          <View className="detail-card">
            <View className="detail-title">{standard.name}</View>
            
            <View className="detail-section">
              <View className="section-title">基本信息</View>
              {renderInfoItem('标准号', standard.number)}
              {renderInfoItem('省份', standard.province)}
              {renderInfoItem('标准等级', (() => {
                const grades = {
                  '1': '国家标准',
                  '2': '行业标准',
                  '3': '地方标准',
                  '4': '企业标准'
                };
                return grades[standard.standardGrade] || standard.standardGrade;
              })())}
            </View>
            
            <View className="detail-section">
              <View className="section-title">日期信息</View>
              {renderInfoItem('发布日期', formatDate(standard.publishDate))}
              {renderInfoItem('实施日期', formatDate(standard.applyDate))}
            </View>
            
            <View className="detail-section">
              <View className="section-title">部门信息</View>
              {renderInfoItem('发布部门', standard.publishDep)}
              {renderInfoItem('创建部门', standard.createDep)}
            </View>
            
            {standard.cnClassify || standard.gbClassify ? (
              <View className="detail-section">
                <View className="section-title">分类信息</View>
                {standard.cnClassify ? renderInfoItem('中国分类', standard.cnClassify) : null}
                {standard.gbClassify ? renderInfoItem('GB分类', standard.gbClassify) : null}
              </View>
            ) : null}
          </View>
        ) : (
          <View className="empty-container">未找到标准详情</View>
        )}
      </View>
    </View>
  );
};

export default StandardDetailPage;