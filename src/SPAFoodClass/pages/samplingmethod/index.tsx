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
    ordinarySample: ordinarySampleParam = "[]",
  } = router.params;

  // 解析分类数组
  const categories = categoriesParam
    ? JSON.parse(decodeURIComponent(categoriesParam))
    : [];

  // 解析ordinarySample数组
  const ordinarySample = ordinarySampleParam
    ? JSON.parse(decodeURIComponent(ordinarySampleParam))
    : [
        // 如果没有传入数据，使用默认值
        {
          samplingLink: "全部环节",
          specification: "预包装食品或非主食包装食品、无包装食品",
          minSampleQuantity: "2个独立包装",
          minSampleWeight: "500g",
          minBackupWeight: "250g",
        },
      ];

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

        {/* 步骤条 - 按照官方文档使用默认样式 */}
        <View className="steps-container">
          <Steps
            className="transparent-steps"
            value={categories.length}
            direction="vertical"
          >
            {categories.map((category, index) => (
              <Steps.Step className="transparent-step" key={`step-${index}`}>
                {category}
              </Steps.Step>
            ))}
          </Steps>
        </View>
      </View>

      {/* 生产企业名称（已屏蔽） */}
      {/* <View className="company-info-section">
        <Text className="section-title">生产企业名称</Text>
        <View className="company-table">
          <View className="table-row table-header">
            <View className="table-cell">生产企业许可证编号</View>
            <View className="table-cell">联系方式</View>
            <View className="table-cell">判定标准</View>
          </View>
          <View className="table-row">
            <View className="table-cell">{mockCompanyData.licenseNo}</View>
            <View className="table-cell">{mockCompanyData.contactPhone}</View>
            <View className="table-cell">{mockCompanyData.standard}</View>
          </View>
        </View>
      </View> */}

      {/* 抽备样数量 */}
      <View className="sample-quantity-section">
        <Text className="section-title">抽备样数量</Text>
        <View className="sample-table">
          <View className="table-row table-header">
            <View className="table-cell">抽样环节</View>
            <View className="table-cell">型号规格</View>
            <View className="table-cell">最少抽样数量</View>
            <View className="table-cell">最少抽样重量</View>
            <View className="table-cell">最少备样重量</View>
          </View>
          {ordinarySample.map((item, index) => (
            <View className="table-row" key={`sample-row-${index}`}>
              <View className="table-cell">{item.samplingLink || "-"}</View>
              <View className="table-cell">{item.specification || "-"}</View>
              <View className="table-cell">
                {item.minSampleQuantity || "-"}
              </View>
              <View className="table-cell">{item.minSampleWeight || "-"}</View>
              <View className="table-cell">{item.minBackupWeight || "-"}</View>
            </View>
          ))}
        </View>
      </View>

      {/* 特殊类别抽备样数量（已屏蔽） */}
      {/* <View className="special-sample-section">
        <Text className="section-title">特殊类别抽备样数量</Text>
        <View className="special-category-tag">
          <View className="dot"></View>
          <Text className="special-category-text">
            {mockSpecialSampleData.specialCategory}
          </Text>
        </View>
        <View className="sample-table">
          <View className="table-row table-header">
            <View className="table-cell">抽样环节</View>
            <View className="table-cell">型号规格</View>
            <View className="table-cell">最小抽样数量</View>
            <View className="table-cell">最小抽样重量</View>
            <View className="table-cell">最小备样重量</View>
          </View>
          <View className="table-row">
            <View className="table-cell">
              {mockSpecialSampleData.samplingLink}
            </View>
            <View className="table-cell">
              {mockSpecialSampleData.specification}
            </View>
            <View className="table-cell">
              {mockSpecialSampleData.minSampleQuantity}
            </View>
            <View className="table-cell">
              {mockSpecialSampleData.minSampleWeight}
            </View>
            <View className="table-cell">
              {mockSpecialSampleData.minBackupWeight}
            </View>
          </View>
        </View>
      </View> */}

      {/* 抽样方法内容 */}
      <View className="content">
        <View className="method-title">具体细则描述</View>
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
