/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { Loading, Toast, Button, Steps } from "@taroify/core";
import Taro, { useRouter } from "@tarojs/taro";
import "@taroify/core/loading/style";
import "@taroify/core/toast/style";
import "@taroify/core/button/style";
import "@taroify/core/steps/style";
import "@taroify/icons/style";
import { foodClassApi } from "../../../services";
import "./index.less";

/**
 * 食品详情页面
 * @returns {JSX.Element} 食品详情页面
 */
const FoodDetailPage: React.FC = () => {
  const router = useRouter();
  const { name } = router.params;

  // 食品详情
  const [foodInfo, setFoodInfo] = useState<foodClassApi.FoodClassInfo | null>(
    null
  );
  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);
  // 错误状态
  const [errorMsg, setErrorMsg] = useState<string>("");
  // Toast状态
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "loading" as "loading" | "success" | "fail",
  });

  /**
   * 显示Toast提示
   */
  const showToast = (type: "loading" | "success" | "fail", message: string) => {
    setToast({
      open: true,
      type,
      message,
    });

    // 自动关闭(loading类型不自动关闭)
    if (type !== "loading") {
      setTimeout(() => {
        setToast((prev) => ({ ...prev, open: false }));
      }, 2000);
    }
  };

  /**
   * 查看抽样方法
   * @param samplingMethod 抽样方法
   * @param sampleName 样品名称
   */
  const viewSamplingMethod = (foodItem) => {
    const {
      sampleName,
      samplingMethod,
      ratio,
      ratioNum,
      ratioTotal,
      firstCategory,
      secondCategory,
      thirdCategory,
      fourthCategory,
    } = foodItem;

    // 构建批次信息
    const batch = ratioNum && ratioTotal ? `${ratioNum}/${ratioTotal}` : "";

    // 构建分类信息数组，用于步骤条显示
    const categories = [
      firstCategory,
      secondCategory,
      thirdCategory,
      fourthCategory,
    ].filter(Boolean);

    Taro.navigateTo({
      url: `/SPAFoodClass/pages/samplingmethod/index?name=${encodeURIComponent(
        sampleName
      )}&method=${encodeURIComponent(
        samplingMethod
      )}&ratio=${encodeURIComponent(ratio || "0%")}&batch=${encodeURIComponent(
        batch
      )}&categories=${encodeURIComponent(JSON.stringify(categories))}`,
    });
  };

  /**
   * 加载食品详情
   */
  const loadFoodDetail = async () => {
    if (!name) {
      setErrorMsg("未指定食品名称");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      showToast("loading", "正在查询...");
      const result = await foodClassApi.identifyFood(decodeURIComponent(name));
      setFoodInfo(result);
      setToast((prev) => ({ ...prev, open: false }));
    } catch (err) {
      console.error("获取食品详情失败:", err);
      setErrorMsg("获取详情失败，请重试");
      showToast("fail", "获取详情失败");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 组件挂载时加载数据
   */
  useEffect(() => {
    loadFoodDetail();
  }, [name]);

  /**
   * 渲染单个食品分类卡片
   */
  const renderFoodCard = (foodItem, index) => {
    // 获取推荐比例，格式化为百分比
    const ratio = foodItem.ratio || "0%";
    // 获取批次信息
    const batchInfo =
      foodItem.ratioNum && foodItem.ratioTotal
        ? `${foodItem.ratioNum}/${foodItem.ratioTotal}`
        : "";

    return (
      <View className="food-card" key={`food-${index}`}>
        <View className="food-header">
          <Text className="food-name">{foodItem.sampleName}</Text>
          <View className="food-ratio">
            <Text className="ratio-text">{ratio}</Text>
            {batchInfo && (
              <Text className="batch-text">占比批次情况: {batchInfo}</Text>
            )}
          </View>
        </View>

        <View className="food-content">
          {/* 使用Steps组件显示分类层级 */}
          <View className="classification-steps">
            <Steps className="custom-steps" value={4} direction="vertical">
              {foodItem.firstCategory && (
                <Steps.Step>
                  <View className="step-content">
                    <Text className="step-value">{foodItem.firstCategory}</Text>
                  </View>
                </Steps.Step>
              )}
              {foodItem.secondCategory && (
                <Steps.Step>
                  <View className="step-content">
                    <Text className="step-value">
                      {foodItem.secondCategory}
                    </Text>
                  </View>
                </Steps.Step>
              )}
              {foodItem.thirdCategory && (
                <Steps.Step>
                  <View className="step-content">
                    <Text className="step-value">{foodItem.thirdCategory}</Text>
                  </View>
                </Steps.Step>
              )}
              {foodItem.fourthCategory && (
                <Steps.Step>
                  <View className="step-content">
                    <Text className="step-value">
                      {foodItem.fourthCategory}
                    </Text>
                  </View>
                </Steps.Step>
              )}
              {foodItem.ordinarySample &&
                foodItem.ordinarySample.length > 0 && (
                  <Steps.Step>
                    <View className="step-content">
                      <View className="sample-info">
                        <View className="sample-item">
                          <Text className="sample-label">抽样数量:</Text>
                          <Text className="sample-value">
                            {foodItem.ordinarySample[0].minSampleQuantity ||
                              "-"}
                          </Text>
                        </View>
                        <View className="sample-item">
                          <Text className="sample-label">备样数量:</Text>
                          <Text className="sample-value">
                            {foodItem.ordinarySample[0].minBackupWeight || "-"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Steps.Step>
                )}
            </Steps>
          </View>
        </View>

        {/* 查看抽样方法按钮 */}
        <View className="sampling-button-container">
          <Button
            className="sampling-button"
            variant="outlined"
            color="primary"
            shape="round"
            onClick={() => viewSamplingMethod(foodItem)}
          >
            查看抽样方法及数量
          </Button>
        </View>

        {/* 易混淆提示 */}
        {/* {foodItem.confusable && (
          <View className="confusion-tip">
            <Text className="confusion-text">{foodItem.confusable}</Text>
          </View>
        )} */}
      </View>
    );
  };

  return (
    <View className="fooddetail-container">
      {/* 搜索信息 */}
      <View className="search-info">
        <Text className="search-text">
          搜索样品名称: {decodeURIComponent(name || "")}
        </Text>
      </View>

      {/* 内容区域 */}
      <View className="content">
        {loading ? (
          <View className="loading-container">
            <Loading type="spinner">加载中...</Loading>
          </View>
        ) : errorMsg ? (
          <View className="error-container">
            <Text className="error-text">{errorMsg}</Text>
          </View>
        ) : foodInfo && foodInfo.voList && foodInfo.voList.length > 0 ? (
          <View className="food-results">
            {foodInfo.voList.map((item, index) => renderFoodCard(item, index))}
          </View>
        ) : (
          <View className="empty-container">
            <Text className="empty-text">未找到该食品的分类信息</Text>
          </View>
        )}
      </View>

      {/* Toast 提示 */}
      <Toast
        open={toast.open}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        {toast.message}
      </Toast>
    </View>
  );
};

export default FoodDetailPage;
