import React, { useState } from "react";
import { View, Text, Input } from "@tarojs/components";
import { Button } from "@taroify/core";
import "@taroify/core/button/style";
import { Search, FilterOutlined } from "@taroify/icons";
import "@taroify/icons/style";

/**
 * 查产品标签页组件
 * @returns {JSX.Element} 查产品标签页
 */
const ProductTab: React.FC = () => {
  // 搜索关键词
  const [keyword, setKeyword] = useState<string>("");

  // 处理搜索
  const handleSearch = () => {
    console.log("搜索产品:", keyword);
    // 这里应该调用API
  };

  return (
    <View className="product-tab">
      {/* 搜索框 */}
      <View className="search-section">
        <View className="search-box">
          <Search size="24" />
          <Input
            className="search-input"
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            placeholder="输入样品名称、许可证号"
          />
          <FilterOutlined size="24" />
        </View>
        <Button color="primary" size="small" onClick={handleSearch}>
          搜索
        </Button>
      </View>

      {/* 空状态图 */}
      <View className="empty-state">
        <View className="empty-image">
          {/* 这里可以放置一个表示空状态的图片 */}
          <View className="image-placeholder"></View>
        </View>
        <Text className="empty-text">暂时没有找到相关数据</Text>
      </View>
    </View>
  );
};

export default ProductTab;
