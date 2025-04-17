import React, { useCallback, useEffect, useState, useRef } from "react";
import { View, Text } from "@tarojs/components";
import Taro, { usePullDownRefresh } from "@tarojs/taro";
import { Empty, PullRefresh, List, Loading, Skeleton } from "@taroify/core";
import messageApi, {
  SamplingSpecificationItem,
} from "../../../services/message";
import { formatDateTime } from "../../../utils/date";
import "./index.less";

/**
 * 抽样规范条目组件
 * @param {Object} props - 组件属性
 * @param {SamplingSpecificationItem} props.item - 规范项数据
 * @returns {JSX.Element} 抽样规范条目组件
 */
const SpecificationItem: React.FC<{
  item: SamplingSpecificationItem;
}> = ({ item }) => {
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

      // 检查URL格式
      if (!url.startsWith("http")) {
        throw new Error("无效的文件URL");
      }

      console.log("准备下载文件:", url);

      // 下载文件，增加超时时间
      const downloadResult = await Taro.downloadFile({
        url: url as string,
        timeout: 120000, // 2分钟超时
      });

      console.log("文件下载结果:", downloadResult);

      if (downloadResult.statusCode !== 200) {
        throw new Error("下载失败: 状态码 " + downloadResult.statusCode);
      }

      // 验证临时文件路径
      if (!downloadResult.tempFilePath) {
        throw new Error("下载的文件路径无效");
      }

      // 打开文档预览
      await Taro.openDocument({
        filePath: downloadResult.tempFilePath,
        showMenu: true, // 显示右上角菜单
        fileType: "pdf", // 明确指定文件类型为PDF
        success: () => {
          console.log("打开文档成功");
        },
        fail: (error) => {
          console.error("打开文档失败", error);
          throw new Error("无法打开文件: " + JSON.stringify(error));
        },
      });
    } catch (error) {
      console.error("文件加载失败:", error);
      let errorMsg = "文件加载失败";

      // 根据错误类型提供更具体的错误信息
      if (error instanceof Error) {
        if (error.message.includes("网络")) {
          errorMsg = "网络连接失败，请检查网络";
        } else if (error.message.includes("超时")) {
          errorMsg = "文件下载超时，请重试";
        } else if (error.message.includes("无效")) {
          errorMsg = "文件格式不支持或已损坏";
        }
      }

      Taro.showToast({
        title: errorMsg,
        icon: "none",
        duration: 3000,
      });
    } finally {
      Taro.hideLoading();
    }
  };

  // 格式化日期时间
  const formatDateTimeObj = (dateTimeStr: string) => {
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
  const { date, time } = formatDateTimeObj(
    item.publishTime || item.createTime || ""
  );

  return (
    <View className="regulation-item" onClick={handleItemClick}>
      <Text className="regulation-title">{item.specificationName}</Text>
      <View>
        <Text className="regulation-date">{date}</Text>
        {time && <Text className="regulation-time">{time}</Text>}
      </View>
    </View>
  );
};

/**
 * 抽样规范页面组件
 * @returns {JSX.Element} 抽样规范页面
 */
const Specification = (): JSX.Element => {
  // 抽样规范列表数据
  const [specificationList, setSpecificationList] = useState<
    SamplingSpecificationItem[]
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

  // 用于取消异步操作
  const isMountedRef = useRef(true);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // 设置页面标题
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "抽样规范",
    });
  }, []);

  /**
   * 获取抽样规范数据
   * @param isRefresh 是否是下拉刷新
   */
  const fetchSpecificationList = useCallback(async (isRefresh = false) => {
    if (loading || !isMountedRef.current) return;

    try {
      setLoading(true);
      if (isRefresh) {
        setInitialLoading(true);
      }

      const currentPage = isRefresh ? 1 : pagination.current;

      const response = await messageApi.getSamplingSpecifications({
        current: currentPage,
        size: pagination.size,
      });

      // 检查组件是否仍然挂载
      if (!isMountedRef.current) return;

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
          setSpecificationList(response.records);
        } else {
          setSpecificationList((prev) => [...prev, ...response.records]);
        }
      } else {
        if (isRefresh) {
          setSpecificationList([]);
          setPagination((prev) => ({
            ...prev,
            hasMore: false,
          }));
        }
      }
    } catch (error) {
      if (!isMountedRef.current) return;

      console.error("获取抽样规范数据失败:", error);
      if (isRefresh) {
        setSpecificationList([]);
        setPagination((prev) => ({
          ...prev,
          hasMore: false,
        }));
      }
      Taro.showToast({
        title: "获取数据失败",
        icon: "none",
      });
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setRefreshing(false);
        setInitialLoading(false);
      }
    }
  }, []);

  // 初始加载数据
  useEffect(() => {
    fetchSpecificationList(true);
  }, [fetchSpecificationList]);

  // 处理下拉刷新
  const onRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    setPagination((prev) => ({
      ...prev,
      current: 1,
      hasMore: true,
    }));
    fetchSpecificationList(true);
  }, [refreshing, fetchSpecificationList]);

  // 添加系统下拉刷新事件监听
  usePullDownRefresh(() => {
    onRefresh();
    Taro.stopPullDownRefresh();
  });

  // 加载更多数据
  const onLoadMore = useCallback(() => {
    if (!pagination.hasMore || loading) {
      return;
    }

    setPagination((prev) => ({
      ...prev,
      current: prev.current + 1,
    }));
    fetchSpecificationList(false);
  }, [pagination.hasMore, loading, fetchSpecificationList]);

  // 渲染骨架屏
  const renderSkeleton = () => {
    return (
      <View className="skeleton-container">
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} className="skeleton-item">
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
            ) : specificationList.length > 0 ? (
              specificationList.map((item) => (
                <SpecificationItem key={item.id} item={item} />
              ))
            ) : (
              <View className="empty-state">
                <Empty>
                  <Empty.Image />
                  <Empty.Description>暂无抽样规范数据</Empty.Description>
                </Empty>
              </View>
            )}
          </View>

          {/* 列表加载状态 */}
          <List.Placeholder>
            {loading && !initialLoading && (
              <Loading className="list-loading">加载中...</Loading>
            )}
            {!loading &&
              !pagination.hasMore &&
              specificationList.length > 0 && (
                <View className="list-finished">没有更多数据了</View>
              )}
          </List.Placeholder>
        </List>
      </PullRefresh>
    </View>
  );
};

export default Specification;
