/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { View, Text, Input, Image } from "@tarojs/components";
import { Button, Toast } from "@taroify/core";
import { Cross, Delete, Fire, Scan } from "@taroify/icons";
import Taro from "@tarojs/taro";
import "@taroify/core/button/style";
import "@taroify/core/toast/style";
import "@taroify/icons/style";
import { foodClassApi } from "../../../services";
import SearchIcon from "../../../assets/images/ico_search_grey.png";
import "./index.less";

/**
 * 食品分类查询页面
 * @returns {JSX.Element} 食品分类查询页面
 */
const FoodClassPage: React.FC = () => {
  // 搜索关键词
  const [keyword, setKeyword] = useState<string>("");
  // 历史搜索记录
  const [historyList, setHistoryList] = useState<string[]>([]);
  // 热门搜索记录
  const [hotList, setHotList] = useState<string[]>([]);
  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
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
   * 获取搜索项数据
   */
  const fetchSearchItems = async () => {
    try {
      setLoading(true);
      const response = await foodClassApi.getSearchItems();

      // 提取历史搜索记录的searchName
      const historyItems =
        response.history?.map((item) => item.searchName) || [];
      setHistoryList(historyItems);

      // 提取热门搜索的searchName
      const hotItems = response.hot?.map((item) => item.searchName) || [];
      setHotList(hotItems);
    } catch (error) {
      console.error("获取搜索项失败:", error);
      showToast("fail", "获取数据失败");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理扫码
   */
  const handleScan = () => {
    Taro.scanCode({
      success: (res) => {
        console.log("扫码结果:", res);
        if (res.result) {
          setKeyword(res.result);
          // handleSearch();
        }
      },
      fail: (err) => {
        console.error("扫码失败:", err);
        showToast("fail", "扫码失败");
      },
    });
  };

  /**
   * 清空历史记录
   */
  const clearHistory = () => {
    setHistoryList([]);
    // 实际项目中应该调用API清除历史记录
  };

  /**
   * 处理搜索
   */
  const handleSearch = async (key: string) => {
    if (!key.trim()) {
      showToast("fail", "请输入食品名称");
      return;
    }

    // 直接跳转到详情页，让详情页调用 API
    Taro.navigateTo({
      url: `/SPAFoodClass/pages/fooddetail/index?name=${encodeURIComponent(
        key
      )}`,
    });

    // 更新历史记录（实际项目中应该由后端处理）
    if (!historyList.includes(key)) {
      setHistoryList([key, ...historyList.slice(0, 9)]);
    }
  };

  /**
   * 组件挂载时获取数据
   */
  useEffect(() => {
    fetchSearchItems();
  }, []);

  return (
    <View className="foodclass-container">
      {/* 搜索栏 */}
      <View className="search-header">
        <View className="search-box">
          <Image src={SearchIcon} style={{ width: 22, height: 22 }} />
          <Input
            className="search-input"
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            placeholder="请输入样品名称信息"
            confirmType="search"
            onConfirm={(e) => handleSearch(e.detail.value)}
          />
          <View className="scan-icon" onClick={handleScan}>
            <Scan size="24" color="#666" />
          </View>
        </View>
        <Button
          className="search-btn"
          variant="text"
          color="primary"
          size="small"
          onClick={() => handleSearch(keyword)}
        >
          搜索
        </Button>
      </View>

      {/* 搜索提示区域 */}
      <View className="search-content">
        <View className="note-text">
          注：请输入【抽样样品全称】，点击搜索开始查找样品相关信息，也可以点击搜索框右侧扫描icon扫描样品条形码识别。
        </View>

        {/* 历史搜索 */}
        {historyList.length > 0 && (
          <View className="search-section">
            <View className="section-header">
              <Text className="section-title">历史搜索</Text>
              <View className="clear-history" onClick={clearHistory}>
                <Delete size="18" />
              </View>
            </View>
            <View className="tags-container">
              {historyList.map((item, index) => (
                <View
                  key={`history-${index}`}
                  className="tag-item"
                  onClick={() => {
                    setKeyword(item);
                    handleSearch(item);
                  }}
                >
                  {item}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 热门搜索 */}
        {hotList.length > 0 && (
          <View className="search-section">
            <View className="section-header">
              <Text className="section-title">
                热门搜索 <Fire color="red" size="16" />
              </Text>
            </View>
            <View className="tags-container">
              {hotList.map((item, index) => (
                <View
                  key={`hot-${index}`}
                  className="tag-item"
                  onClick={() => {
                    setKeyword(item);
                    handleSearch(item);
                  }}
                >
                  {item}
                </View>
              ))}
            </View>
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

export default FoodClassPage;
