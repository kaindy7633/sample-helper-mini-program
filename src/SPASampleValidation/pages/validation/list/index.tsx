/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { View, Text, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import {
  Empty,
  PullRefresh,
  List,
  Skeleton,
  Button,
  Dialog,
  Toast,
} from "@taroify/core";
import Taro from "@tarojs/taro";
import { sampleValidationApi } from "../../../../services";
import {
  uploadValidationFileByRequest,
  type ValidationItem,
  FileUploadResponse,
} from "../../../../services/sampleValidation";
import readIcon from "../../../../assets/images/icon_isread.png";
import "./index.less";

// 扩展API接口参数类型，添加isRead参数
interface ValidationQueryParams {
  currentPage: number;
  pageSize: number;
  isRead?: number; // 阅读状态：0-未读，1-已读
}

/**
 * 验证状态枚举
 */
enum ValidationStatus {
  INSPECTING = "0", // 检验中
  VALIDATING = "1", // 验证中
  ABNORMAL = "2", // 有异常
  NORMAL = "3", // 无异常
  FAILED = "4", // 验证失败
}

/**
 * 阅读状态枚举
 */
enum ReadStatus {
  UNREAD = 0, // 未读
  READ = 1, // 已读
}

/**
 * 获取验证状态文本
 * @param status 状态码
 * @returns 状态文本
 */
const getStatusText = (status: string): string => {
  switch (status) {
    case ValidationStatus.INSPECTING:
      return "检验中";
    case ValidationStatus.VALIDATING:
      return "验证中";
    case ValidationStatus.ABNORMAL:
      return "有异常";
    case ValidationStatus.NORMAL:
      return "无异常";
    case ValidationStatus.FAILED:
      return "验证失败";
    default:
      return "未知状态";
  }
};

/**
 * 获取验证状态样式类名
 * @param status 状态码
 * @returns 样式类名
 */
const getStatusClassName = (status: string): string => {
  switch (status) {
    case ValidationStatus.INSPECTING:
      return "status-pending";
    case ValidationStatus.VALIDATING:
      return "status-pending";
    case ValidationStatus.ABNORMAL:
      return "status-abnormal";
    case ValidationStatus.NORMAL:
      return "status-normal";
    case ValidationStatus.FAILED:
      return "status-failed";
    default:
      return "status-unknown";
  }
};

/**
 * 抽样单验证页面组件
 * @returns {JSX.Element} 抽样单验证页面
 */
const ValidationPage: React.FC = (): JSX.Element => {
  // 验证列表
  const [validationList, setValidationList] = useState<ValidationItem[]>([]);

  // 分页信息
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // 加载状态
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 初始加载状态 - 用于显示骨架屏
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // 首次加载标记
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  // 文件上传状态
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  /**
   * 获取验证列表数据
   * @param isRefresh 是否是刷新操作
   */
  const fetchValidationList = async (isRefresh: boolean = false) => {
    try {
      const pageNum = isRefresh ? 1 : current;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // 使用API获取数据，使用自定义的请求参数类型
      const params: ValidationQueryParams = {
        currentPage: pageNum,
        pageSize: pageSize,
      };

      const result = await sampleValidationApi.getValidationList(params);

      // 添加1秒延迟，让加载效果更明显
      setTimeout(() => {
        // 获取API返回的数据
        const records = result.records || [];

        if (isRefresh) {
          setValidationList(records);
          setCurrent(1);
        } else {
          setValidationList((prev) => [...prev, ...records]);
        }

        // 更新总数
        const totalCount = Number(result.total || 0);
        setTotal(totalCount);

        // 判断是否还有更多数据
        const hasMoreData =
          records.length > 0 && pageNum * pageSize < Number(result.total || 0);
        setHasMore(hasMoreData);

        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }

        // 首次加载完成后，关闭骨架屏显示
        setInitialLoading(false);
        setIsFirstLoad(false);
      }, 1000);
    } catch (error) {
      console.error("获取验证列表失败:", error);

      // 显示测试数据
      setValidationList([]);
      setTotal(0);
      setHasMore(false);

      Taro.showToast({
        title: "获取列表数据失败",
        icon: "none",
      });

      setInitialLoading(false);
      setIsFirstLoad(false);

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
    setIsFirstLoad(true);
    fetchValidationList(true);
  };

  /**
   * 处理滚动加载
   */
  const onLoad = () => {
    if (!hasMore || loading) return;

    // 计算新页码
    const nextPage = current + 1;
    setCurrent(nextPage);

    // 直接使用新页码加载
    handleLoadWithPage(nextPage);
  };

  /**
   * 使用指定页码加载数据
   * @param pageNum 页码
   */
  const handleLoadWithPage = async (pageNum: number) => {
    try {
      setLoading(true);

      // 使用自定义的请求参数类型
      const params: ValidationQueryParams = {
        currentPage: pageNum,
        pageSize: pageSize,
      };

      const result = await sampleValidationApi.getValidationList(params);

      setTimeout(() => {
        const records = result.records || [];
        setValidationList((prev) => [...prev, ...records]);
        setTotal(Number(result.total || 0));

        // 判断是否还有更多数据
        const hasMoreData =
          records.length > 0 && pageNum * pageSize < Number(result.total || 0);
        setHasMore(hasMoreData);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("加载更多数据失败:", error);
      setLoading(false);
      Taro.showToast({
        title: "加载失败，请稍后重试",
        icon: "none",
      });
    }
  };

  /**
   * 渲染骨架屏
   */
  const renderSkeleton = () => {
    return (
      <View>
        {[1, 2, 3].map((item) => (
          <View key={item} className="validation-item skeleton-card">
            <View className="skeleton-row">
              <Skeleton style={{ width: "90%", height: "32px" }} />
            </View>
            <View className="skeleton-row">
              <Skeleton style={{ width: "30%", height: "28px" }} />
              <Skeleton style={{ width: "60%", height: "28px" }} />
            </View>
            <View className="skeleton-row">
              <Skeleton style={{ width: "30%", height: "28px" }} />
              <Skeleton style={{ width: "60%", height: "28px" }} />
            </View>
            <View className="skeleton-row">
              <Skeleton style={{ width: "30%", height: "28px" }} />
              <Skeleton style={{ width: "60%", height: "28px" }} />
            </View>
            <View className="skeleton-row">
              <Skeleton style={{ width: "30%", height: "28px" }} />
              <Skeleton style={{ width: "20%", height: "32px" }} />
            </View>
          </View>
        ))}
      </View>
    );
  };

  // 初始化加载数据
  useEffect(() => {
    fetchValidationList(true);
  }, []);

  // 返回上一页
  const handleBack = () => {
    Taro.navigateBack();
  };

  /**
   * 处理列表项点击事件
   * @param item 验证项
   */
  const handleItemClick = (item: ValidationItem) => {
    Taro.navigateTo({
      url: `/SPASampleValidation/pages/validation/details/index?id=${item.id}&isRead=${item.isRead}`,
    });
  };

  const renderValidationItem = (item: ValidationItem) => {
    // 获取状态文本和样式
    const statusText = getStatusText(item.status);
    const statusClassName = getStatusClassName(item.status);

    // 是否已读
    const isRead = item.isRead === ReadStatus.READ;

    return (
      <View
        className="validation-item"
        key={item.id}
        onClick={() => handleItemClick(item)}
      >
        <View className="validation-item-title">
          {item.taskName || item.title}
        </View>
        <View className="validation-item-row">
          <Text className="label">抽样单号</Text>
          <Text className="value">{item.sampleNo || "暂无数据"}</Text>
        </View>
        <View className="validation-item-row">
          <Text className="label">样品名称</Text>
          <Text className="value">{item.sampleName || "暂无数据"}</Text>
        </View>
        <View className="validation-item-row">
          <Text className="label">创建时间</Text>
          <Text className="value">{item.createTime || "暂无数据"}</Text>
        </View>
        <View className="validation-status-row">
          <Text className="label">验证状态</Text>
          <View className="status-container">
            {isRead && <Image src={readIcon} className="read-icon" />}
            <Text className={`validation-status ${statusClassName}`}>
              {statusText}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * 选择图片上传
   * @param sourceType 来源类型: 相机或相册
   */
  const chooseImageUpload = async (sourceType: "camera" | "album") => {
    setIsUploading(true);
    setUploadProgress(0);

    Taro.chooseImage({
      count: sourceType === "camera" ? 1 : 9, // 拍照只选1张，相册可以9张
      sourceType: sourceType === "camera" ? ["camera"] : ["album"],
      success: async (res) => {
        const filePaths = res.tempFilePaths;

        try {
          // 使用服务中的方法上传文件
          const result = await sampleValidationApi.uploadValidationFiles(
            filePaths,
            (percent) => {
              setUploadProgress(percent);
            }
          );

          // 显示上传结果
          Taro.showToast({
            title: result.message,
            icon: result.success ? "success" : "none",
            duration: 2000,
          });

          // 如果成功上传了至少一个文件，刷新列表
          if (result.success) {
            onRefresh();
          }
        } catch (error) {
          Taro.showToast({
            title: "上传过程发生错误",
            icon: "none",
            duration: 2000,
          });
        } finally {
          setIsUploading(false);
        }
      },
      fail: () => {
        setIsUploading(false);
        Taro.showToast({
          title: "已取消选择",
          icon: "none",
          duration: 1500,
        });
      },
    });
  };

  /**
   * 拍照上传处理函数
   */
  const handleCameraUpload = () => {
    chooseImageUpload("camera");
  };

  /**
   * 文件上传处理函数
   */
  const handleFileUpload = () => {
    chooseImageUpload("album");
  };

  return (
    <View className="container">
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
            className="validation-list-container"
            style={{ height: "100%" }}
          >
            {initialLoading ? (
              renderSkeleton()
            ) : validationList.length === 0 ? (
              <View className="empty-container">
                <Empty>
                  <Empty.Image src="search" />
                  <Empty.Description>暂无验证数据</Empty.Description>
                </Empty>
              </View>
            ) : (
              <View className="validation-list">
                {validationList.map(renderValidationItem)}
              </View>
            )}
            <List.Placeholder>
              {loading && <View className="list-loading">加载中...</View>}
              {!hasMore && validationList.length > 0 && (
                <View className="list-finished">没有更多数据了</View>
              )}
              {/* 底部额外空间 */}
              <View style={{ height: "40px" }}></View>
            </List.Placeholder>
          </List>
        </PullRefresh>
      </View>

      {/* 底部上传按钮区域 */}
      <View className="upload-buttons-wrapper">
        <Button
          className="upload-button camera-button"
          color="primary"
          onClick={handleCameraUpload}
          loading={isUploading}
          disabled={isUploading}
        >
          拍照上传
        </Button>
        <Button
          className="upload-button file-button"
          color="primary"
          onClick={handleFileUpload}
          loading={isUploading}
          disabled={isUploading}
        >
          文件上传
        </Button>
      </View>

      {/* 上传进度对话框 */}
      <Dialog open={isUploading}>
        <Dialog.Header>文件上传中</Dialog.Header>
        <Dialog.Content>
          <View style={{ padding: "20px 0" }}>
            <View style={{ marginBottom: "10px", textAlign: "center" }}>
              已上传 {uploadProgress}%
            </View>
            <View className="upload-progress-bar">
              <View
                className="upload-progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    </View>
  );
};

export default ValidationPage;
