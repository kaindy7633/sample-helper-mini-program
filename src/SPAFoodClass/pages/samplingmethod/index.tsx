import React from "react";
import { View, Text } from "@tarojs/components";
import { Steps } from "@taroify/core";
import { useRouter } from "@tarojs/taro";
import "@taroify/core/steps/style";
import "@taroify/icons/style";
import "./index.less";

/**
 * 抽样方法页面
 * @returns {JSX.Element} 抽样方法页面
 */
const SamplingMethodPage: React.FC = () => {
  const router = useRouter();
  const {
    name,
    method,
    ratio = "40%",
    batch = "",
    categories: categoriesParam = "",
  } = router.params;

  // 解析分类数组
  const categories = categoriesParam
    ? JSON.parse(decodeURIComponent(categoriesParam))
    : [];

  return (
    <View className="samplingmethod-container">
      {/* 顶部信息 */}
      <View className="header-section">
        <View className="food-title">
          <Text className="food-name">{decodeURIComponent(name || "")}</Text>
          <View className="food-ratio">
            <Text className="ratio-text">{decodeURIComponent(ratio)}</Text>
            {batch && (
              <Text className="batch-text">
                占比批次情况: {decodeURIComponent(batch)}
              </Text>
            )}
          </View>
        </View>

        {/* 步骤条 */}
        <View className="steps-container">
          <Steps
            className="custom-steps"
            value={categories.length}
            direction="vertical"
          >
            {categories.map((category, index) => (
              <Steps.Step key={`step-${index}`}>{category}</Steps.Step>
            ))}
          </Steps>
        </View>
      </View>

      {/* 抽样方法内容 */}
      <View className="content">
        <View className="method-title">查看抽样方法及数量</View>
        <View className="method-card">
          <Text className="method-text">
            {decodeURIComponent(method || "")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SamplingMethodPage;
