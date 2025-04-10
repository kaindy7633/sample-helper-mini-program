/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { View, Text, Input } from "@tarojs/components";
import { Picker, Button, Popup } from "@taroify/core";
import "@taroify/core/cell/style";
import "@taroify/core/picker/style";
import "@taroify/core/field/style";
import "@taroify/core/button/style";
import "@taroify/core/popup/style";
import { Search, Arrow, Replay, Location, Aim } from "@taroify/icons";
import "@taroify/icons/style";

/**
 * 查场所标签页组件
 * @returns {JSX.Element} 查场所标签页
 */
const PlaceTab: React.FC = (): JSX.Element => {
  // 当前选择的位置
  const [location, setLocation] = useState<string>("请选择位置");

  // 搜索关键词
  const [keyword, setKeyword] = useState<string>("");

  // 距离优先选项
  const [distancePriority, setDistancePriority] = useState<string>("距离优先");
  const [distancePriorityOpen, setDistancePriorityOpen] =
    useState<boolean>(false);
  const distancePriorityOptions = ["距离优先", "数量优先"];

  // 企业类型选项
  const [companyType, setCompanyType] = useState<string>("企业类型");
  const [companyTypeOpen, setCompanyTypeOpen] = useState<boolean>(false);
  const companyTypeOptions = ["生产企业", "流通企业", "餐饮企业"];

  // 处理搜索
  const handleSearch = () => {
    console.log("搜索场所:", keyword);
    // 这里应该调用API
  };

  // 重置筛选条件
  const handleReset = () => {
    setDistancePriority("距离优先");
    setCompanyType("企业类型");
  };

  return (
    <View className="place-tab">
      {/* 位置选择 */}
      <View className="location-section">
        <View className="location-button">
          <View className="location-icon-wrapper">
            <Location color="#1C71FB" size="24" />
          </View>
          <Text className="location-text">{location}</Text>
        </View>
        <View className="refresh-button">
          <Text className="refresh-text">重新定位</Text>
          <Aim />
        </View>
      </View>

      {/* 搜索框 */}
      <View className="search-section">
        <View className="search-box">
          <Search size="24" />
          <Input
            className="search-input"
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            placeholder="输入场所名称/营业执照号/社会信用代码"
          />
        </View>
        <Button color="primary" size="small" onClick={handleSearch}>
          搜索
        </Button>
      </View>

      {/* 筛选条件 */}
      <View className="filter-section">
        <View
          className="filter-item"
          onClick={() => setDistancePriorityOpen(true)}
        >
          <Text>{distancePriority}</Text>
          <Arrow />
        </View>
        <View className="filter-item" onClick={() => setCompanyTypeOpen(true)}>
          <Text>{companyType}</Text>
          <Arrow />
        </View>
        <View className="reset-button" onClick={handleReset}>
          <Replay size="18" />
          <Text>重置</Text>
        </View>
      </View>

      {/* 搜索结果列表 - 这里先放置一个占位 */}
      <View className="result-list">
        {/* 如果这里有数据，可以遍历渲染列表项 */}
        {/* 这里暂时留白，后续可以根据API返回数据进行填充 */}
      </View>

      {/* 距离优先选择弹窗 */}
      <Popup
        open={distancePriorityOpen}
        rounded
        placement="bottom"
        onClose={() => setDistancePriorityOpen(false)}
      >
        <Picker
          onCancel={() => setDistancePriorityOpen(false)}
          onConfirm={(val) => {
            setDistancePriority(val.toString());
            setDistancePriorityOpen(false);
          }}
          value={distancePriority}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>请选择</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            {distancePriorityOptions.map((option) => (
              <Picker.Option key={option} value={option}>
                {option}
              </Picker.Option>
            ))}
          </Picker.Column>
        </Picker>
      </Popup>

      {/* 企业类型选择弹窗 */}
      <Popup
        open={companyTypeOpen}
        rounded
        placement="bottom"
        onClose={() => setCompanyTypeOpen(false)}
      >
        <Picker
          onCancel={() => setCompanyTypeOpen(false)}
          onConfirm={(val) => {
            setCompanyType(val.toString());
            setCompanyTypeOpen(false);
          }}
          value={companyType}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>请选择</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            {companyTypeOptions.map((option) => (
              <Picker.Option key={option} value={option}>
                {option}
              </Picker.Option>
            ))}
          </Picker.Column>
        </Picker>
      </Popup>
    </View>
  );
};

export default PlaceTab;
