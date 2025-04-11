/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { View, Text, Input } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { Button, Picker, Empty, Popup } from "@taroify/core";
import { ArrowDown } from "@taroify/icons";
import { standardApi } from "../../../services";
import type { StandardDetail } from "../../../services/standard";
import "./index.less";

/**
 * 标法查询页面组件
 * @returns {JSX.Element} 标法查询页面
 */
const StandardPage: React.FC = (): JSX.Element => {
  // 搜索关键词
  const [keyword, setKeyword] = useState<string>("");

  // 选中的地区
  const [region, setRegion] = useState<string>("地区");

  // 地区选择器开关
  const [regionOpen, setRegionOpen] = useState<boolean>(false);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);

  // 标准列表
  const [standardList, setStandardList] = useState<StandardDetail[]>([]);

  // 分页信息
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // 是否已搜索过
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // 地区选项列表
  const regionOptions = [
    { value: "全国", text: "全国" },
    { value: "北京", text: "北京" },
    { value: "上海", text: "上海" },
    { value: "广东", text: "广东" },
    { value: "浙江", text: "浙江" },
    { value: "山西", text: "山西" },
  ];

  /**
   * 处理搜索
   */
  const handleSearch = async () => {
    if (!keyword.trim()) {
      Taro.showToast({
        title: "请输入搜索关键词",
        icon: "none",
      });
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const params = {
        keyword: keyword.trim(),
        region: region !== "地区" ? region : undefined,
        current,
        size: pageSize,
      };

      const result = await standardApi.queryStandards(params);
      setStandardList(result.records);
      setTotal(Number(result.total));
    } catch (error) {
      console.error("查询标准失败:", error);
      Taro.showToast({
        title: "查询失败，请稍后重试",
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

  /**
   * 查看标准详情
   * @param standardId 标准ID
   */
  const viewStandardDetail = (standardId: string) => {
    // 保存查询参数到本地缓存
    Taro.setStorageSync("standard_query_params", {
      keyword,
      region,
      current,
      pageSize,
    });

    // 跳转到详情页面
    Taro.navigateTo({
      url: `/SPAStandard/pages/detail/index?id=${standardId}`,
    });
  };

  return (
    <View className="container">
      {/* 顶部栏 */}
      <View className="header">
        <View className="back-icon" onClick={handleBack}></View>
        <Text className="title">标法查询</Text>
        <View className="placeholder"></View>
      </View>

      {/* 搜索区域 */}
      <View className="search-area">
        {/* 地区选择 */}
        <View className="region-selector" onClick={() => setRegionOpen(true)}>
          <Text className="region-text">{region}</Text>
          <ArrowDown size="18" />
        </View>

        {/* 搜索框 */}
        <View className="search-box">
          <Input
            className="search-input"
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            placeholder="输入标准编号、标准名称"
            placeholderClass="placeholder"
            confirmType="search"
            onConfirm={handleSearch}
          />
        </View>

        {/* 搜索按钮 */}
        <Button className="search-btn" loading={loading} onClick={handleSearch}>
          搜索
        </Button>
      </View>

      {/* 内容区域 */}
      <View className="content">
        {loading ? (
          <View className="loading">加载中...</View>
        ) : hasSearched && standardList.length === 0 ? (
          <View className="empty-container">
            <Empty>
              <Empty.Image src="search" />
              <Empty.Description>暂无数据</Empty.Description>
            </Empty>
          </View>
        ) : (
          <View className="standard-list">
            {standardList.map((standard) => (
              <View
                key={standard.id}
                className="standard-item"
                onClick={() => viewStandardDetail(standard.id)}
              >
                <View className="standard-title">{standard.standardName}</View>
                <View className="standard-code">{standard.standardCode}</View>
                <View className="standard-date">
                  发布日期：{standard.publishDate} | 实施日期：
                  {standard.implementDate}
                </View>
                <View className="standard-info">
                  {standard.standardType} | {standard.standardStatus}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 地区选择器弹出层 */}
      <Popup
        open={regionOpen}
        rounded
        placement="bottom"
        onClose={() => setRegionOpen(false)}
      >
        <Popup.Backdrop />
        <Picker
          title="选择地区"
          cancelText="取消"
          confirmText="确认"
          columns={[regionOptions]}
          onCancel={() => setRegionOpen(false)}
          onConfirm={(values) => {
            const selectedIndex = parseInt(values[0] as string, 10);
            setRegion(regionOptions[selectedIndex].text);
            setRegionOpen(false);
          }}
        />
      </Popup>
    </View>
  );
};

export default StandardPage;
