/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from "react";
import { View, Text, Input, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import {
  Button,
  Picker,
  Empty,
  Popup,
  List,
  PullRefresh,
  Skeleton,
} from "@taroify/core";
import { ArrowDown, Location, Search } from "@taroify/icons";
import { standardApi, fileApi } from "../../../services";
import type { StandardDetail } from "../../../services/standard";
import { CHINA_PROVINCES } from "../../../constants";
import downloadIcon from "../../../assets/images/download-cloud-line.svg";
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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 初始加载状态 - 用于显示骨架屏
  const [initialLoading, setInitialLoading] = useState<boolean>(false);

  // 标准列表
  const [standardList, setStandardList] = useState<StandardDetail[]>([]);

  // 分页信息
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // 是否已执行过搜索
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // 地区选项列表 - 使用公共常量
  const regionOptions = CHINA_PROVINCES;

  /**
   * 处理标准文件预览
   * @param e 事件对象
   * @param fileId 文件ID
   */
  const handlePreviewFile = (e: any, fileId: number) => {
    e.stopPropagation();
    fileApi.previewStandardFile(fileId);
  };

  /**
   * 处理标准文件下载
   * @param e 事件对象
   * @param fileId 文件ID
   * @param fileName 文件名称
   */
  const handleDownloadFile = (e: any, fileId: number, fileName: string) => {
    e.stopPropagation();
    fileApi.downloadStandardFile(fileId, fileName);
  };

  /**
   * 处理搜索
   * @param isRefresh 是否是刷新操作
   */
  const handleSearch = async (isRefresh: boolean = false) => {
    if (!keyword.trim()) {
      // 只在用户主动搜索时提示
      if (!hasSearched) {
        setHasSearched(true);
        return;
      }
      Taro.showToast({
        title: "请输入搜索关键词",
        icon: "none",
      });
      return;
    }

    // 只在主动搜索时显示骨架屏，下拉刷新时不显示骨架屏
    if (!hasSearched || (!isRefresh && current === 1)) {
      setInitialLoading(true);
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const pageNum = isRefresh ? 1 : current;
      const params = {
        input: keyword.trim(),
        province: region !== "地区" ? region : "四川省",
        currentPage: pageNum,
        pageSize: pageSize,
      };

      const result = await standardApi.queryStandards(params);

      // 添加1秒延迟，让加载效果更明显
      setTimeout(() => {
        if (isRefresh) {
          setStandardList(result.rows);
          setCurrent(1);
        } else {
          setStandardList((prev) => [...prev, ...result.rows]);
        }

        setTotal(Number(result.total));
        setHasSearched(true);

        // 判断是否还有更多数据
        const hasMoreData =
          result.rows.length > 0 && pageNum * pageSize < result.total;
        setHasMore(hasMoreData);

        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }

        // 首次加载完成后，关闭骨架屏显示
        setInitialLoading(false);
      }, 1000);
    } catch (error) {
      console.error("查询标准失败:", error);
      Taro.showToast({
        title: "查询失败，请稍后重试",
        icon: "none",
      });

      // 出错时也需要关闭骨架屏
      setInitialLoading(false);

      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  /**
   * 处理下拉刷新
   */
  const onRefresh = () => {
    if (!hasSearched || !keyword.trim()) {
      setRefreshing(false);
      return;
    }
    handleSearch(true);
  };

  /**
   * 处理滚动加载
   */
  const onLoad = () => {
    if (!hasSearched || !keyword.trim() || !hasMore || loading) return;

    // 计算新页码
    const nextPage = current + 1;
    setCurrent(nextPage);

    // 直接调用加载函数并传递新页码
    handleSearchWithPage(nextPage);
  };

  /**
   * 使用指定页码进行搜索
   * @param pageNum 页码
   */
  const handleSearchWithPage = async (pageNum: number) => {
    try {
      setLoading(true);

      const params = {
        input: keyword.trim(),
        province: region !== "地区" ? region : "四川省",
        currentPage: pageNum,
        pageSize: pageSize,
      };

      const result = await standardApi.queryStandards(params);

      // 添加1秒延迟，让加载效果更明显
      setTimeout(() => {
        setStandardList((prev) => [...prev, ...result.rows]);
        setTotal(Number(result.total));

        // 判断是否还有更多数据
        const hasMoreData =
          result.rows.length > 0 && pageNum * pageSize < result.total;
        setHasMore(hasMoreData);
        setLoading(false);

        // 关闭骨架屏显示
        setInitialLoading(false);
      }, 1000);
    } catch (error) {
      console.error("查询标准失败:", error);
      Taro.showToast({
        title: "查询失败，请稍后重试",
        icon: "none",
      });

      setInitialLoading(false);
      setLoading(false);
    }
  };

  /**
   * 渲染骨架屏
   */
  const renderSkeleton = () => {
    return (
      <View>
        {[1, 2, 3].map((item) => (
          <View key={item} className="standard-item skeleton-card">
            <View className="skeleton-row">
              <Skeleton style={{ width: "80%", height: "32px" }} />
            </View>
            <View className="skeleton-row">
              <Skeleton style={{ width: "60%", height: "26px" }} />
            </View>
            <View className="skeleton-row">
              <Skeleton style={{ width: "90%", height: "24px" }} />
            </View>
            <View className="skeleton-row">
              <Skeleton style={{ width: "50%", height: "24px" }} />
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="container">
      {/* 搜索区域 */}
      <View className="search-area">
        {/* 地区选择 */}
        <View className="region-selector" onClick={() => setRegionOpen(true)}>
          <Location size="18" color="#1677ff" />
          <Text className="region-text">{region}</Text>
          <ArrowDown size="16" />
        </View>

        {/* 搜索框 */}
        <View className="search-box">
          <Input
            className="search-input"
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            placeholder="输入标准编号、标准名称"
            placeholderStyle="color: #999; font-size: 28rpx;"
            confirmType="search"
            onConfirm={() => handleSearch(true)}
          />
        </View>

        {/* 搜索按钮 */}
        <Text className="search-text" onClick={() => handleSearch(true)}>
          {loading ? "搜索中..." : "搜索"}
        </Text>
      </View>

      {/* 内容区域 */}
      <View className="content">
        <PullRefresh
          loading={refreshing}
          onRefresh={onRefresh}
          style={{ height: "100%" }}
        >
          <List
            loading={loading}
            hasMore={hasMore}
            offset={100}
            immediateCheck={false}
            fixedHeight
            onLoad={onLoad}
            className="standard-list-container"
            style={{ height: "100%" }}
          >
            {initialLoading ? (
              renderSkeleton()
            ) : !hasSearched ? (
              <View className="empty-container">
                <Empty>
                  <Empty.Image src="search" />
                  <Empty.Description>请输入关键词搜索</Empty.Description>
                </Empty>
              </View>
            ) : standardList.length === 0 ? (
              <View className="empty-container">
                <Empty>
                  <Empty.Image src="search" />
                  <Empty.Description>暂无数据</Empty.Description>
                </Empty>
              </View>
            ) : (
              <View className="standard-list">
                {standardList.map((standard) => (
                  <View key={standard.fileId} className="standard-item">
                    <View className="standard-title">{standard.name}</View>

                    <View className="standard-file-row">
                      <Text className="standard-label">标准文件：</Text>
                      <Text
                        className="standard-file-name"
                        onClick={(e) => handlePreviewFile(e, standard.fileId)}
                      >
                        {standard.name}.pdf
                      </Text>
                      <Image
                        className="download-icon"
                        src={downloadIcon}
                        onClick={(e) =>
                          handleDownloadFile(
                            e,
                            standard.fileId,
                            `${standard.name}.pdf`
                          )
                        }
                      />
                    </View>

                    <View className="standard-info-row">
                      <Text className="standard-label">标准编号：</Text>
                      <Text className="standard-value">{standard.number}</Text>
                    </View>

                    <View className="standard-date">
                      发布日期：
                      {new Date(standard.publishDate).toLocaleDateString()} |
                      实施日期：
                      {new Date(standard.applyDate).toLocaleDateString()}
                    </View>
                  </View>
                ))}
              </View>
            )}
            <List.Placeholder>
              {loading && <View className="list-loading">加载中...</View>}
              {!hasMore && standardList.length > 0 && (
                <View className="list-finished">没有更多数据了</View>
              )}
              {/* 底部额外空间 */}
              <View style={{ height: "40px" }}></View>
            </List.Placeholder>
          </List>
        </PullRefresh>
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
          columns={regionOptions}
          onCancel={() => setRegionOpen(false)}
          onConfirm={(value) => {
            console.log("选择的地区:", value);
            // 在Taroify的Picker中，单列选择时value就是选中项的值
            const selectedOption = regionOptions.find(
              (option) => option.value === value[0]
            );
            if (selectedOption) {
              setRegion(selectedOption.value);
            }
            setRegionOpen(false);
          }}
        />
      </Popup>
    </View>
  );
};

export default StandardPage;
