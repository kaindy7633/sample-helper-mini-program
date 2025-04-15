/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { View, Text } from "@tarojs/components";
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
import { sampleValidationApi } from "../../../services";
import {
  uploadValidationFileByRequest,
  type ValidationItem,
} from "../../../services/sampleValidation";
import "./index.less";

/**
 * 测试数据生成
 * @returns 模拟的验证列表数据
 */
const generateMockData = (): ValidationItem[] => {
  return [
    {
      id: 1,
      sampleNo: "DBJ253310000051304321",
      sampleName: "原味松子（油炸类）",
      taskName: "抽样单验证2025-03-14 10:56:04",
      title: "抽样单验证2025-03-14 10:56:04 [测试数据]",
      createTime: "2025-03-14 10:56:05",
      status: "0",
      createUser: "admin",
      createUserId: "6430",
      isDel: 0,
      orgId: "0",
      isRead: 0,
      spotNo: null,
    },
    {
      id: 2,
      sampleNo: "DBJ253310000051304322",
      sampleName: "原味松子（油炸类）",
      taskName: "抽样单验证2025-03-14 10:56:04",
      title: "抽样单验证2025-03-14 10:56:04 [测试数据]",
      createTime: "2025-03-14 10:56:05",
      status: "4",
      createUser: "admin",
      createUserId: "6430",
      isDel: 0,
      orgId: "0",
      isRead: 0,
      spotNo: null,
    },
    {
      id: 3,
      sampleNo: "DBJ253310000051304323",
      sampleName: "椒盐花生（油炸类）",
      taskName: "抽样单验证2025-03-15 09:23:17",
      title: "抽样单验证2025-03-15 09:23:17 [测试数据]",
      createTime: "2025-03-15 09:23:18",
      status: "4",
      createUser: "admin",
      createUserId: "6430",
      isDel: 0,
      orgId: "0",
      isRead: 0,
      spotNo: null,
    },
  ];
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
  // 上传选择对话框
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);

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

      // 使用API获取数据
      const result = await sampleValidationApi.getValidationList({
        currentPage: pageNum,
        pageSize: pageSize,
      });

      // 添加1秒延迟，让加载效果更明显
      setTimeout(() => {
        // 获取真实接口返回的数据
        const apiRecords = result.records || [];

        // 获取测试数据
        const mockData = generateMockData();

        // 将测试数据添加到真实数据后面
        const combinedRecords = [...apiRecords, ...mockData];

        if (isRefresh) {
          setValidationList(combinedRecords);
          setCurrent(1);
        } else {
          setValidationList((prev) => [...prev, ...combinedRecords]);
        }

        // 更新总数，同时考虑真实数据和测试数据
        const totalCount = Number(result.total || 0) + mockData.length;
        setTotal(totalCount);

        // 判断是否还有更多数据
        const hasMoreData =
          apiRecords.length > 0 &&
          pageNum * pageSize < Number(result.total || 0);
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

      // 使用模拟数据
      const mockData = generateMockData();
      setValidationList(mockData);
      setTotal(mockData.length);
      setHasMore(false);

      Taro.showToast({
        title: "使用测试数据显示",
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

      const result = await sampleValidationApi.getValidationList({
        currentPage: pageNum,
        pageSize: pageSize,
      });

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
    // 如果是测试数据，提示用户
    if (item.title?.includes("[测试数据]")) {
      Taro.showToast({
        title: "这是测试数据，无法查看详情",
        icon: "none",
      });
      return;
    }

    Taro.navigateTo({
      url: `/pages/validation/detail/index?id=${item.id}`,
    });
  };

  const renderValidationItem = (item: ValidationItem) => {
    // 检查状态值，"0"表示正常，非"0"表示异常
    const isNormal = item.status === "0";
    const statusText = isNormal ? "正常" : "有异常";

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
            <Text
              className={`validation-status ${
                isNormal ? "status-normal" : "status-abnormal"
              }`}
            >
              {statusText}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * 处理文件上传按钮点击
   */
  const handleFileUpload = () => {
    setShowUploadDialog(true);
  };

  /**
   * 选择图片或拍照上传
   * @param sourceType 来源类型: 相机或相册
   */
  const chooseImageUpload = async (sourceType: "camera" | "album") => {
    Taro.chooseImage({
      success: async (res) => {
        const filePath = res.tempFilePaths[0];
        const result = await uploadValidationFileByRequest(filePath);
        console.log("上传结果:", result);
      },
    });

    // setShowUploadDialog(false);

    // try {
    //   // 选择图片
    //   const result = await Taro.chooseImage({
    //     count: 1,
    //     sizeType: ["original", "compressed"],
    //     sourceType: sourceType === "camera" ? ["camera"] : ["album"],
    //   });

    //   if (result.tempFilePaths && result.tempFilePaths.length > 0) {
    //     const filePath = result.tempFilePaths[0];

    //     // 文件大小限制: 10MB
    //     const maxSize = 10 * 1024 * 1024;
    //     if (result.tempFiles && result.tempFiles[0].size > maxSize) {
    //       Toast.open({
    //         message: "图片大小不能超过10MB",
    //         duration: 2000,
    //       });
    //       return;
    //     }

    //     // 开始上传
    //     setIsUploading(true);
    //     setUploadProgress(0);

    //     try {
    //       const uploadResult = await sampleValidationApi.uploadValidationFile(
    //         filePath
    //       );

    //       setIsUploading(false);

    //       if (uploadResult.success) {
    //         Toast.success({
    //           message: "上传成功",
    //           duration: 2000,
    //         });

    //         // 上传成功后刷新列表
    //         onRefresh();
    //       } else {
    //         // 根据错误消息显示不同的提示
    //         if (uploadResult.message.includes("415")) {
    //           Toast.fail({
    //             message: "服务器不支持当前文件格式，请联系管理员",
    //             duration: 3000,
    //           });
    //         } else if (
    //           uploadResult.message.includes("401") ||
    //           uploadResult.message.includes("身份验证")
    //         ) {
    //           Toast.fail({
    //             message: "登录已过期，请重新登录",
    //             duration: 3000,
    //           });

    //           // 提示用户需要重新登录
    //           setTimeout(() => {
    //             Taro.navigateTo({
    //               url: "/SPALogin/pages/login/index",
    //             });
    //           }, 2000);
    //         } else {
    //           Toast.fail({
    //             message: uploadResult.message || "上传失败，请重试",
    //             duration: 2000,
    //           });
    //         }
    //       }
    //     } catch (uploadError: any) {
    //       setIsUploading(false);

    //       // 尝试获取更详细的错误信息
    //       const errorMsg = uploadError.message || "上传失败，请重试";
    //       console.error("文件上传失败:", uploadError);

    //       if (errorMsg.includes("415")) {
    //         Toast.fail({
    //           message: "服务器不支持当前文件格式，请联系管理员",
    //           duration: 3000,
    //         });
    //       } else if (errorMsg.includes("401")) {
    //         Toast.fail({
    //           message: "登录已过期，请重新登录",
    //           duration: 3000,
    //         });
    //       } else {
    //         Toast.fail({
    //           message: errorMsg,
    //           duration: 2000,
    //         });
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.error("选择图片失败:", error);
    //   Toast.fail({
    //     message: "选择图片失败",
    //     duration: 2000,
    //   });
    // }
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

      {/* 文件上传按钮 */}
      <View className="upload-button-wrapper">
        <Button
          className="upload-button"
          color="primary"
          onClick={handleFileUpload}
          loading={isUploading}
          disabled={isUploading}
        >
          {isUploading ? `上传中 ${uploadProgress}%` : "文件上传"}
        </Button>
      </View>

      {/* 上传方式选择对话框 */}
      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
      >
        <Dialog.Header>选择上传方式</Dialog.Header>
        <Dialog.Content>
          <View style={{ padding: "20px 0" }}>
            <Text>可以拍照上传抽样单文件图片</Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            style={{ marginRight: "8px" }}
            onClick={() => setShowUploadDialog(false)}
          >
            取消
          </Button>
          <Button onClick={() => chooseImageUpload("album")}>从相册选择</Button>
          <Button
            style={{ marginLeft: "8px" }}
            color="primary"
            onClick={() => chooseImageUpload("camera")}
          >
            拍照上传
          </Button>
        </Dialog.Actions>
      </Dialog>

      {/* 上传进度对话框 */}
      <Dialog open={isUploading}>
        <Dialog.Header>文件上传中</Dialog.Header>
        <Dialog.Content>
          <View style={{ padding: "20px 0" }}>
            <View style={{ marginBottom: "10px", textAlign: "center" }}>
              已上传 {uploadProgress}%
            </View>
            <View
              style={{
                height: "6px",
                backgroundColor: "#f2f2f2",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${uploadProgress}%`,
                  height: "100%",
                  backgroundColor: "#1989fa",
                  transition: "width 0.2s",
                }}
              />
            </View>
          </View>
        </Dialog.Content>
      </Dialog>
    </View>
  );
};

export default ValidationPage;
