/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { View, Text, Input, Image } from "@tarojs/components";
import { Button, Toast, Dialog } from "@taroify/core";
import { DeleteOutlined, Fire, Scan } from "@taroify/icons";
import Taro, { useDidShow } from "@tarojs/taro";
import "@taroify/core/button/style";
import "@taroify/core/toast/style";
import "@taroify/core/dialog/style";
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
  // 确认对话框状态
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
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
   * 页面显示时触发，清空搜索框
   */
  useDidShow(() => {
    // 每次页面显示时清空搜索框
    setKeyword("");
  });

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
        if (res.result) {
          // 设置关键词（用于显示）
          setKeyword(res.result);

          // 跳转到详情页面，使用barCode参数
          Taro.navigateTo({
            url: `/SPAFoodClass/pages/fooddetail/index?barCode=${encodeURIComponent(
              res.result
            )}`,
          });

          // 更新历史记录
          if (!historyList.includes(res.result)) {
            setHistoryList([res.result, ...historyList.slice(0, 9)]);
          }
        }
      },
      fail: (err) => {
        console.error("扫码失败:", err);
        showToast("fail", "扫码失败");
      },
    });
  };

  /**
   * 删除历史记录
   */
  const handleDeleteHistory = async () => {
    try {
      showToast("loading", "正在删除...");

      // 调用删除历史记录API
      await foodClassApi.deleteSearchHistory();

      // 更新本地状态
      setHistoryList([]);
      showToast("success", "历史记录已清空");
    } catch (error) {
      console.error("删除历史记录失败:", error);
      showToast("fail", "删除失败");
    }
  };

  /**
   * 清空历史记录确认
   */
  const confirmClearHistory = () => {
    setDialogVisible(true);
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
              <View className="clear-history" onClick={confirmClearHistory}>
                <DeleteOutlined size="18" />
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

      {/* 确认对话框 */}
      <Dialog open={dialogVisible} onClose={() => setDialogVisible(false)}>
        <Dialog.Header>确认删除</Dialog.Header>
        <Dialog.Content>是否确认清空所有历史搜索记录？</Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setDialogVisible(false)}>取消</Button>
          <Button
            color="primary"
            onClick={() => {
              setDialogVisible(false);
              handleDeleteHistory();
            }}
          >
            确认
          </Button>
        </Dialog.Actions>
      </Dialog>

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
