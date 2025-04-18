import React, { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Empty, PullRefresh, List, Loading, Skeleton } from "@taroify/core";
import { messageApi } from "../../../services";
import { SamplingRegulationItem } from "../../../services/message";
import "./index.less";

/**
 * 抽样细则条目组件
 * @param {Object} props - 组件属性
 * @param {SamplingRegulationItem} props.item - 细则项数据
 * @returns {JSX.Element} 抽样细则条目组件
 */
const RegulationItem: React.FC<{
  item: SamplingRegulationItem;
}> = ({ item }: { item: SamplingRegulationItem }): JSX.Element => {
  /**
   * 处理点击条目事件
   */
  const handleItemClick = () => {
    // 使用originalFileUrl字段
    const fileUrl = item.originalFileUrl || item.fileUrl;
    if (!fileUrl) {
      Taro.showToast({
        title: "暂无可预览的文件",
        icon: "none",
      });
      return;
    }

    // 直接预览PDF文件
    openPdfFile(fileUrl);
  };

  /**
   * 打开PDF文件
   * @param url 文件URL
   */
  const openPdfFile = async (url: string) => {
    try {
      // 显示加载提示
      Taro.showLoading({ title: "文件加载中...", mask: true });

      // 下载文件
      const downloadResult = await Taro.downloadFile({
        url,
        timeout: 60000, // 60秒超时
      });

      if (downloadResult.statusCode !== 200) {
        throw new Error("下载失败: 状态码 " + downloadResult.statusCode);
      }

      // 打开文档预览
      await Taro.openDocument({
        filePath: downloadResult.tempFilePath,
        showMenu: true, // 显示右上角菜单
        success: () => {
          console.log("打开文档成功");
        },
        fail: (error) => {
          console.error("打开文档失败", error);
          Taro.showToast({
            title: "无法打开文件",
            icon: "none",
          });
        },
      });
    } catch (error) {
      console.error("文件加载失败:", error);
      Taro.showToast({
        title: "文件加载失败",
        icon: "none",
      });
    } finally {
      Taro.hideLoading();
    }
  };

  // 格式化日期时间
  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return { date: "", time: "" };

    // 假设输入格式为 "2025-03-13 17:04:02"
    try {
      // 分割日期和时间
      const [datePart, timePart] = dateTimeStr.split(" ");
      return { date: datePart || "", time: timePart || "" };
    } catch (error) {
      console.error("日期格式化错误:", error);
      return { date: dateTimeStr, time: "" };
    }
  };

  // 处理日期时间
  const { date, time } = formatDateTime(
    item.createTime || item.publishTime || ""
  );

  return (
    <View className="regulation-item" onClick={handleItemClick}>
      <Text className="regulation-title">{item.regulationName}</Text>
      <View>
        <Text className="regulation-date">{date}</Text>
        {time && <Text className="regulation-time">{time}</Text>}
      </View>
    </View>
  );
};

/**
 * 抽样细则页面组件
 * @returns {JSX.Element} 抽样细则页面组件
 */
const SamplingRegulationPage: React.FC = (): JSX.Element => {
  // 抽样细则列表数据
  const [regulationList, setRegulationList] = useState<
    SamplingRegulationItem[]
  >([]);

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
    hasMore: true,
  });

  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // 设置页面标题
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "抽样细则",
    });
  }, []);

  /**
   * 获取抽样细则数据
   * @param isRefresh 是否是下拉刷新
   */
  const fetchRegulationList = async (isRefresh = false) => {
    try {
      setLoading(true);
      if (isRefresh) {
        setInitialLoading(true);
      }

      const currentPage = isRefresh ? 1 : pagination.current;

      const response = await messageApi.getSamplingRegulations({
        current: currentPage,
        size: pagination.size,
      });

      console.log("抽样细则数据:", response); // 调试日志

      if (response && response.records) {
        // 更新分页信息
        const total = Number(response.total) || 0;
        const current = Number(response.current) || 1;
        const size = Number(response.size) || 10;
        const hasMore = total > current * size;

        setPagination({
          current: current,
          size: size,
          total: total,
          hasMore: hasMore,
        });

        // 更新列表数据
        if (isRefresh) {
          setRegulationList(response.records);
        } else {
          setRegulationList((prev) => [...prev, ...response.records]);
        }
      } else {
        if (isRefresh) {
          setRegulationList([]);
          setPagination({
            ...pagination,
            hasMore: false,
          });
        }
      }
    } catch (error) {
      console.error("获取抽样细则数据失败:", error);
      if (isRefresh) {
        setRegulationList([]);
        setPagination({
          ...pagination,
          hasMore: false,
        });
      }
      Taro.showToast({
        title: "获取数据失败",
        icon: "none",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
      setInitialLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchRegulationList(true);
  }, []);

  // 处理下拉刷新
  const onRefresh = () => {
    setRefreshing(true);
    setPagination({
      ...pagination,
      current: 1,
      hasMore: true,
    });
    fetchRegulationList(true);
  };

  // 加载更多数据
  const onLoadMore = () => {
    if (!pagination.hasMore || loading) {
      return;
    }

    setPagination({
      ...pagination,
      current: pagination.current + 1,
    });
    fetchRegulationList(false);
  };

  // 渲染骨架屏
  const renderSkeleton = () => {
    return (
      <View className="skeleton-container">
        {Array.from({ length: 4 }).map((_, index) => (
          <View
            key={index}
            className={`skeleton-item ${
              index === 3 ? "skeleton-item-last" : ""
            }`}
          >
            <Skeleton
              style={{ width: "90%", height: "32px", marginBottom: "16px" }}
            />
            <Skeleton style={{ width: "40%", height: "24px" }} />
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="container">
      <PullRefresh loading={refreshing} onRefresh={onRefresh}>
        <List
          loading={loading && !initialLoading}
          hasMore={pagination.hasMore}
          onLoad={onLoadMore}
        >
          <View className="regulation-list">
            {initialLoading ? (
              renderSkeleton()
            ) : regulationList.length > 0 ? (
              regulationList.map((item) => (
                <RegulationItem key={item.id} item={item} />
              ))
            ) : (
              <View className="empty-state">
                <Empty>
                  <Empty.Image />
                  <Empty.Description>暂无抽样细则数据</Empty.Description>
                </Empty>
              </View>
            )}
          </View>

          {/* 列表加载状态 */}
          <List.Placeholder>
            {loading && !initialLoading && (
              <Loading className="list-loading">加载中...</Loading>
            )}
            {!loading && !pagination.hasMore && regulationList.length > 0 && (
              <View className="list-finished">没有更多数据了</View>
            )}
          </List.Placeholder>
        </List>
      </PullRefresh>
    </View>
  );
};

export default SamplingRegulationPage;
