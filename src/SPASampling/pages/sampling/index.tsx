import React, { useState } from "react";
import { View } from "@tarojs/components";
import { Tabs } from "@taroify/core";
import "@taroify/core/tabs/style";

import PlaceTab from "./components/PlaceTab";
import CompanyTab from "./components/CompanyTab";
import ProductTab from "./components/ProductTab";

import "./index.less";

/**
 * 抽样重复查询页面
 * @returns {JSX.Element} 抽样重复查询页面
 */
const SamplingPage: React.FC = () => {
  // 当前选中的标签页
  const [activeTab, setActiveTab] = useState<string | number>(0);

  return (
    <View className="sampling-container">
      <Tabs value={activeTab} onChange={setActiveTab} sticky>
        <Tabs.TabPane title="查场所">
          <PlaceTab />
        </Tabs.TabPane>
        <Tabs.TabPane title="查企业">
          <CompanyTab />
        </Tabs.TabPane>
        <Tabs.TabPane title="查产品">
          <ProductTab />
        </Tabs.TabPane>
      </Tabs>
    </View>
  );
};

export default SamplingPage;
