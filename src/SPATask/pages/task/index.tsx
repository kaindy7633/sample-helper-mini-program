/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, Input, Image } from "@tarojs/components";
import {
  Button,
  Empty,
  Loading,
  Popup,
  Picker,
  PullRefresh,
  List,
  Skeleton,
} from "@taroify/core";
import { ArrowDown, Replay, WarningOutlined } from "@taroify/icons";
import SearchIcon from "../../../assets/images/ico_search_grey.png";
import { taskApi } from "../../../services";
import "./index.less";

/**
 * 任务详情接口
 */
interface TaskDetail {
  /** ID */
  id: number;
  /** 抽检监测类别 */
  classA: string;
  /** 抽检计划名称 */
  classB: string;
  /** 食品大类 */
  cate1: string;
  /** 食品具体类型 */
  cate4: string;
  /** 是否完成 0-未完成 1-已完成 */
  isFinish: string;
  /** 抽样人员 */
  sampleTeam: string;
  /** 抽样单编号 */
  sampleNo: string;
  /** 创建日期 */
  createDate: string;
  /** 完成日期 */
  finishDate: string | null;
  /** 食品类别列表 */
  cateList: {
    /** 食品大类 */
    cate1: string;
    /** 食品亚类 */
    cate2: string;
    /** 食品属性 */
    cate3: string;
    /** 具体食品 */
    cate4: string;
  };
  /** 抽样链接 */
  sampleLink: string;
  /** 计划任务代码ID */
  planTaskCodeId: string | null;
}

/**
 * 详情表格项接口
 */
interface DetailItem {
  /** 食品大类 */
  category: string;
  /** 食品亚类 */
  subcategory: string;
  /** 食品属性 */
  property: string;
  /** 食品品牌 */
  brand: string;
}

/**
 * 任务页面组件
 * @returns {JSX.Element} 任务页面
 */
const TaskPage: React.FC = (): JSX.Element => {
  // 当前激活的tab
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending"
  );

  // 搜索关键词
  const [keyword, setKeyword] = useState<string>("");

  // 筛选选项
  const [filterA, setFilterA] = useState<string>("报送分类A");
  const [filterB, setFilterB] = useState<string>("报送分类B");

  // 分类下拉状态
  const [classAOpen, setClassAOpen] = useState<boolean>(false);
  const [classBOpen, setClassBOpen] = useState<boolean>(false);
  const [classTreeData, setClassTreeData] = useState<taskApi.ClassTreeNode[]>(
    []
  );
  const [classBOptions, setClassBOptions] = useState<taskApi.ClassTreeNode[]>(
    []
  );

  // 是否降序排列
  const [isDescOrder, setIsDescOrder] = useState<boolean>(true);

  // 确认Modal状态
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"complete" | "cancel">("complete");
  const [currentTaskId, setCurrentTaskId] = useState<string>("");

  // Toast状态
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState<string>("");

  // 任务数据状态
  const [pendingTasks, setPendingTasks] = useState<TaskDetail[]>([]);
  const [completedTasks, setCompletedTasks] = useState<TaskDetail[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);

  // 加载状态
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 首次加载标记
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  // 初始加载状态 - 用于显示骨架屏
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  /**
   * 获取分类树数据
   */
  const fetchClassTree = async () => {
    try {
      console.log("获取分类树数据开始");
      const result = await taskApi.getClassTree();
      console.log("获取到分类树数据:", result);
      setClassTreeData(result || []);
    } catch (error) {
      console.error("获取分类树数据失败:", error);
      showToastMessage("error", "获取分类树数据失败");
    }
  };

  /**
   * 获取任务列表数据
   * @param isRefresh 是否是下拉刷新
   */
  const fetchTaskList = async (isRefresh: boolean = false) => {
    try {
      const isFinish = activeTab === "pending" ? "0" : "1";
      const pageNum = isRefresh ? 1 : current;

      // 如果是刷新，同时设置initialLoading为true
      if (isRefresh) {
        setInitialLoading(true);
      }

      // 使用taskApi服务获取任务列表
      const result = await taskApi.getPlanTasks({
        current: Number(pageNum),
        size: Number(pageSize),
        isFinish,
        classa: filterA === "报送分类A" ? undefined : filterA,
        classb: filterB === "报送分类B" ? undefined : filterB,
        cate1: keyword || undefined,
      });

      const newRecords = result?.records || [];
      const totalCount = Number(result?.total || 0);

      // 添加1秒延迟，让加载效果更明显
      setTimeout(() => {
        if (activeTab === "pending") {
          if (isRefresh) {
            setPendingTasks(newRecords);
          } else {
            setPendingTasks((prev) => [...prev, ...newRecords]);
          }
        } else {
          if (isRefresh) {
            setCompletedTasks(newRecords);
          } else {
            setCompletedTasks((prev) => [...prev, ...newRecords]);
          }
        }

        setTotal(totalCount);

        // 判断是否还有更多数据可加载
        const hasMoreData =
          newRecords.length > 0 && pageNum * pageSize < totalCount;

        setHasMore(hasMoreData);

        if (isRefresh) {
          setRefreshing(false);
          setCurrent(1);
        } else {
          setLoading(false);
        }

        // 首次加载完成后，关闭骨架屏显示
        setInitialLoading(false);
      }, 1000); // 延迟1秒更新状态
    } catch (error) {
      console.error("获取任务列表失败:", error);
      // 发生错误时延迟1秒清空数据，保持统一的加载时间感
      setTimeout(() => {
        if (isRefresh) {
          if (activeTab === "pending") {
            setPendingTasks([]);
          } else {
            setCompletedTasks([]);
          }
          setTotal(0);
          setRefreshing(false);
        } else {
          setLoading(false);
        }
        // 出错时也需要关闭骨架屏
        setInitialLoading(false);
        showToastMessage("error", "获取任务列表失败");
      }, 1000);
    }
  };

  /**
   * 完成任务
   * @param taskId 任务ID
   */
  const handleCompleteTask = async (taskId: string) => {
    try {
      console.log("完成任务 - 接收到的任务ID:", taskId);

      // 根据ID找到当前任务对象
      const currentTask = currentTasks.find(
        (task) => String(task.id) === taskId
      );
      console.log("完成任务 - 当前任务详情:", currentTask);

      // 检查任务是否存在
      if (!currentTask) {
        showToastMessage("error", "找不到对应的任务");
        return;
      }

      // 检查planTaskCodeId是否存在
      if (!currentTask.planTaskCodeId) {
        showToastMessage("error", "该任务缺少必要的计划任务代码");
        return;
      }

      // 将字符串ID转为数字
      const numericId = parseInt(currentTask.planTaskCodeId, 10);
      console.log("完成任务 - 转换后的planTaskCodeId:", numericId);

      if (Number.isNaN(numericId)) {
        showToastMessage("error", "任务代码ID无效");
        return;
      }

      // 使用新接口完成任务，传递ID数组
      console.log("完成任务 - 传递给API的ID数组:", [numericId]);
      const success = await taskApi.updateFinishTask([numericId]);

      if (success) {
        showToastMessage("success", "完成任务");
        onRefresh();
      } else {
        showToastMessage("error", "操作失败");
      }
    } catch (error) {
      console.error("完成任务失败:", error);
      showToastMessage("error", "完成任务失败");
    }
  };

  /**
   * 取消任务
   * @param taskId 任务ID
   */
  const handleCancelTask = async (taskId: string) => {
    try {
      const success = await taskApi.cancelTask(taskId);

      if (success) {
        showToastMessage("error", "取消任务");
        fetchTaskList();
      } else {
        showToastMessage("error", "操作失败");
      }
    } catch (error) {
      console.error("取消任务失败:", error);
      showToastMessage("error", "取消任务失败");
    }
  };

  // 切换Tab
  const handleTabChange = (tab: "pending" | "completed") => {
    setActiveTab(tab);
    // 设置初始加载状态，显示骨架屏
    setInitialLoading(true);
    // 标记为首次加载，避免触发额外的加载
    setIsFirstLoad(true);
    // 重置其他状态
    setCurrent(1);
    setHasMore(true);
  };

  // 处理搜索
  const handleSearch = () => {
    onRefresh();
  };

  // 切换排序方式
  const toggleOrder = () => {
    setIsDescOrder(!isDescOrder);
  };

  // 重置筛选条件
  const handleReset = () => {
    // 重置筛选条件
    setFilterA("报送分类A");
    setFilterB("报送分类B");
    setKeyword("");

    // 显示骨架屏加载
    setInitialLoading(true);

    // 标记为首次加载，避免触发额外的加载
    setIsFirstLoad(true);

    // 重置分页状态
    setCurrent(1);
    setHasMore(true);

    // 刷新数据
    setRefreshing(true);
    fetchTaskList(true);
  };

  // 处理分类A选择
  const handleClassASelect = (value: string) => {
    setFilterA(value);
    setClassAOpen(false);
    // 筛选条件改变时显示骨架屏
    setInitialLoading(true);
  };

  // 处理分类B选择
  const handleClassBSelect = (value: string) => {
    setFilterB(value);
    setClassBOpen(false);
    // 筛选条件改变时显示骨架屏
    setInitialLoading(true);
  };

  // 显示确认Modal
  const showConfirmModal = (type: "complete" | "cancel", taskId: string) => {
    setModalType(type);
    setCurrentTaskId(taskId);
    setShowModal(true);
  };

  // 关闭确认Modal
  const closeModal = () => {
    setShowModal(false);
  };

  // 确认操作
  const confirmAction = () => {
    closeModal();

    if (modalType === "complete") {
      handleCompleteTask(currentTaskId);
    } else {
      handleCancelTask(currentTaskId);
    }
  };

  // 显示Toast消息
  const showToastMessage = (type: "success" | "error", message: string) => {
    setToastType(type);
    setToastMessage(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // 获取当前显示的任务列表
  const currentTasks = useMemo(() => {
    return activeTab === "pending" ? pendingTasks : completedTasks;
  }, [activeTab, pendingTasks, completedTasks]);

  /**
   * 渲染任务详情表格
   * @param task 任务详情数据
   */
  const renderTaskDetails = (task: TaskDetail): DetailItem[] => {
    const details: DetailItem[] = [];

    if (!task.cateList) {
      return details;
    }

    // 将逗号分隔的字符串转为数组
    const cate2List = task.cateList.cate2?.split(",") || [];
    const cate3List = task.cateList.cate3?.split(",") || [];
    const cate4List = task.cateList.cate4?.split(",") || [];

    // 获取最大长度,确保所有数组能对齐
    const maxLength = Math.max(
      cate2List.length,
      cate3List.length,
      cate4List.length
    );

    // 生成每一行的数据
    for (let i = 0; i < maxLength; i++) {
      details.push({
        category: i === 0 ? task.cateList.cate1 || "" : "", // 只在第一行显示 cate1
        subcategory: cate2List[i] || "",
        property: cate3List[i] || "",
        brand: cate4List[i] || "",
      });
    }

    return details;
  };

  /**
   * 渲染表格单元格
   * @param content 单元格内容
   * @param isFirstColumn 是否是第一列
   * @param rowSpan 行合并数
   */
  const renderTableCell = (
    content: string,
    isFirstColumn: boolean = false,
    rowSpan: number = 1
  ) => {
    return (
      <View
        className="table-cell"
        style={{
          visibility:
            isFirstColumn && rowSpan > 1 && content === ""
              ? "hidden"
              : "visible",
        }}
      >
        {content}
      </View>
    );
  };

  // 处理下拉刷新
  const onRefresh = () => {
    // 标记为首次加载，避免触发额外的加载
    setIsFirstLoad(true);
    // 设置刷新状态
    setRefreshing(true);
    setHasMore(true);
    setCurrent(1); // 重置为第一页
    fetchTaskList(true);
  };

  // 加载更多数据
  const onLoad = () => {
    if (!hasMore || loading) {
      return;
    }

    setLoading(true);
    setCurrent((prev) => prev + 1);
  };

  // 监听页码变化加载数据
  useEffect(() => {
    // 跳过首次加载，因为初始化时已经加载了第一页
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }

    // 只有页码大于1时才触发加载更多
    if (current > 1) {
      fetchTaskList(false);
    }
  }, [current, isFirstLoad]);

  // 初始化加载数据
  useEffect(() => {
    // 加载分类树数据
    fetchClassTree();

    // 重置状态，但不触发加载
    setHasMore(true);
    setLoading(false);
    setRefreshing(false);

    // 直接调用一次fetchTaskList加载第一页数据
    setCurrent(1);
    fetchTaskList(true);
  }, [activeTab]);

  // 当选择分类A时，更新分类B的选项
  useEffect(() => {
    if (filterA !== "报送分类A") {
      // 查找当前选择的分类A节点
      const selectedNode = classTreeData.find((node) => node.name === filterA);
      if (selectedNode && selectedNode.children) {
        setClassBOptions(selectedNode.children);
      } else {
        setClassBOptions([]);
      }

      // 如果切换了分类A，重置分类B的选择
      setFilterB("报送分类B");
    } else {
      setClassBOptions([]);
    }
  }, [filterA, classTreeData]);

  // 当选择分类A或分类B时，刷新列表
  useEffect(() => {
    if (
      (filterA !== "报送分类A" || filterB !== "报送分类B") &&
      // 确保不是初始化时触发
      classTreeData.length > 0
    ) {
      setCurrent(1); // 重置页码
      onRefresh(); // 使用onRefresh代替fetchTaskList
    }
  }, [filterA, filterB]);

  // 在点击分类A和分类B时记录值
  const openClassAPopup = () => {
    // 即使没有数据也显示弹窗
    setClassAOpen(true);
  };

  const openClassBPopup = () => {
    if (filterA === "报送分类A") {
      return;
    }
    setClassBOpen(true);
  };

  return (
    <View className="container">
      {/* Tab标签页 */}
      <View className="task-tabs">
        <View
          className={`tab-item ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => handleTabChange("pending")}
        >
          <Text className="tab-text">待执行</Text>
          {activeTab === "pending" && <View className="tab-indicator"></View>}
        </View>
        <View
          className={`tab-item ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => handleTabChange("completed")}
        >
          <Text className="tab-text">已完成</Text>
          {activeTab === "completed" && <View className="tab-indicator"></View>}
        </View>
      </View>

      {/* 搜索和筛选区域 */}
      <View className="search-filter-section">
        {/* 搜索框 */}
        <View className="search-header">
          <View className="search-box">
            <Image
              src={SearchIcon}
              style={{ width: 22, height: 22, marginRight: 5 }}
            />
            <Input
              className="search-input"
              value={keyword}
              onInput={(e) => setKeyword(e.detail.value)}
              placeholder="请输入食品大类名称"
              confirmType="search"
              onConfirm={() => handleSearch()}
            />
          </View>
          <Button
            className="search-btn"
            variant="text"
            color="primary"
            size="small"
            onClick={() => handleSearch()}
          >
            搜索
          </Button>
        </View>

        {/* 筛选器 */}
        <View className="filter-section">
          <View className="filter-left">
            <View
              className="filter-item"
              onClick={openClassAPopup}
              style={{ display: "flex", alignItems: "center", padding: "8px" }}
            >
              <Text style={{ marginRight: 3, fontSize: 16 }}>{filterA}</Text>
              <ArrowDown />
            </View>
            <View
              className="filter-item"
              onClick={openClassBPopup}
              style={{ display: "flex", alignItems: "center", padding: "8px" }}
            >
              <Text style={{ marginRight: 3, fontSize: 16 }}>{filterB}</Text>
              <ArrowDown />
            </View>
          </View>
          <View className="filter-divider"></View>
          <View
            className="reset-button"
            onClick={handleReset}
            style={{ padding: "8px", cursor: "pointer" }}
          >
            <Replay size="18" />
            <Text style={{ fontSize: 16 }}>重置</Text>
          </View>
        </View>
      </View>

      {/* 内容区域 - 必须在所有上方控件之后渲染，避免覆盖问题 */}
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
            className="task-list-container"
            style={{ height: "100%" }}
          >
            <View className="task-list">
              {initialLoading ? (
                // 骨架屏 - 显示3个卡片的骨架
                <View>
                  {[1, 2, 3].map((item) => (
                    <View key={item} className="task-card skeleton-card">
                      <View className="skeleton-row">
                        <Skeleton style={{ width: "40%", height: "36px" }} />
                        <Skeleton style={{ width: "30%", height: "28px" }} />
                      </View>
                      <View className="skeleton-row">
                        <Skeleton style={{ width: "70%", height: "28px" }} />
                      </View>
                      <View className="skeleton-row">
                        <Skeleton style={{ width: "50%", height: "28px" }} />
                        <Skeleton style={{ width: "40%", height: "28px" }} />
                      </View>
                      <View className="skeleton-row">
                        <Skeleton style={{ width: "50%", height: "28px" }} />
                        <Skeleton style={{ width: "40%", height: "28px" }} />
                      </View>
                      <View className="skeleton-table">
                        <View className="skeleton-header">
                          <Skeleton style={{ width: "100%", height: "40px" }} />
                        </View>
                        <View className="skeleton-row">
                          <Skeleton style={{ width: "100%", height: "40px" }} />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : currentTasks.length > 0 ? (
                currentTasks.map((task) => (
                  <View key={task.id} className="task-card">
                    {/* 抽样单号 */}
                    <View className="task-id-row">
                      <Text className="task-id-label">抽样单编号：</Text>
                      <Text className="task-id-value">{task.sampleNo}</Text>
                      <Text className="task-link-tag">{task.sampleLink}</Text>
                      <Text style={{ fontSize: "10px", color: "#999" }}>
                        总数:{total}
                      </Text>
                    </View>

                    {/* 任务名称 */}
                    <View className="task-title-row">
                      <Text className="task-title">{task.classB}</Text>
                    </View>

                    {/* 抽样人员 */}
                    <View className="task-info-row">
                      <Text className="task-info-label">抽样人员：</Text>
                      <Text className="task-info-value">{task.sampleTeam}</Text>
                    </View>

                    {/* 下达时间 */}
                    <View className="task-info-row">
                      <Text className="task-info-label">下达时间：</Text>
                      <Text className="task-info-value">{task.createDate}</Text>
                    </View>

                    {/* 食品详情表格 */}
                    <View className="task-details-table">
                      <View className="table-header">
                        <View className="table-cell">食品大类</View>
                        <View className="table-cell">食品亚类</View>
                        <View className="table-cell">食品品种</View>
                        <View className="table-cell">食品细类</View>
                      </View>

                      {renderTaskDetails(task).map((detail, index) => (
                        <View key={index} className="table-row">
                          {renderTableCell(detail.category, true)}
                          {renderTableCell(detail.subcategory)}
                          {renderTableCell(detail.property)}
                          {renderTableCell(detail.brand)}
                        </View>
                      ))}
                    </View>

                    {/* 任务操作按钮 - 仅在待执行tab下显示 */}
                    {activeTab === "pending" && (
                      <View className="task-actions">
                        <View
                          className="task-action-btn complete"
                          onClick={() =>
                            showConfirmModal("complete", String(task.id))
                          }
                        >
                          完成任务
                        </View>
                      </View>
                    )}
                  </View>
                ))
              ) : refreshing ? null : ( // 下拉刷新状态 - 不显示任何内容，因为PullRefresh已经有加载指示器
                <View className="empty-state">
                  <Empty>
                    <Empty.Image src="search" />
                    <Empty.Description>暂无任务数据</Empty.Description>
                  </Empty>
                </View>
              )}
            </View>

            {/* 列表加载状态 - 只在非刷新状态且列表有数据时才可能显示 */}
            <List.Placeholder>
              {loading &&
                !refreshing &&
                !initialLoading &&
                currentTasks.length > 0 && (
                  <Loading className="list-loading">加载中...</Loading>
                )}
              {!loading &&
                !refreshing &&
                !hasMore &&
                currentTasks.length > 0 && (
                  <View className="list-finished">没有更多数据了</View>
                )}
              {/* 底部额外空间 */}
              <View style={{ height: "40px" }}></View>
            </List.Placeholder>
          </List>
        </PullRefresh>
      </View>

      {/* 分类A选择弹出层 */}
      <Popup
        open={classAOpen}
        placement="bottom"
        rounded
        onClose={() => setClassAOpen(false)}
      >
        <Popup.Close />
        <View style={{ padding: "16px 16px 0" }}>
          <Text style={{ fontWeight: "bold", fontSize: "16px" }}>
            选择报送分类A
          </Text>
        </View>
        <Picker
          onCancel={() => setClassAOpen(false)}
          onConfirm={(val) => {
            console.log("选择分类A:", val);
            if (val && val !== "暂无数据") {
              handleClassASelect(val.toString());
            }
          }}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>选择报送分类A</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            {classTreeData.length > 0 ? (
              classTreeData.map((item) => (
                <Picker.Option key={item.name} value={item.name}>
                  {item.name}
                </Picker.Option>
              ))
            ) : (
              <Picker.Option value="暂无数据">暂无数据</Picker.Option>
            )}
          </Picker.Column>
        </Picker>
      </Popup>

      {/* 分类B选择弹出层 */}
      <Popup
        open={classBOpen}
        placement="bottom"
        rounded
        onClose={() => setClassBOpen(false)}
      >
        <Popup.Close />
        <View style={{ padding: "16px 16px 0" }}>
          <Text style={{ fontWeight: "bold", fontSize: "16px" }}>
            选择报送分类B
          </Text>
        </View>
        <Picker
          onCancel={() => setClassBOpen(false)}
          onConfirm={(val) => {
            console.log("选择分类B:", val);
            if (val && val !== "暂无数据") {
              handleClassBSelect(val.toString());
            }
          }}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>选择报送分类B</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            {classBOptions.length > 0 ? (
              classBOptions.map((item) => (
                <Picker.Option key={item.name} value={item.name}>
                  {item.name}
                </Picker.Option>
              ))
            ) : (
              <Picker.Option value="暂无数据">暂无数据</Picker.Option>
            )}
          </Picker.Column>
        </Picker>
      </Popup>

      {/* 确认Modal */}
      {showModal && (
        <View className="modal-overlay">
          <View className="modal-content">
            <View className="modal-icon">
              {modalType === "complete" ? (
                <View className="modal-icon-warning"></View>
              ) : (
                <View className="modal-icon-warning"></View>
              )}
            </View>
            <View className="modal-text">
              {modalType === "complete"
                ? "是否确定已完成抽样单填报？"
                : "是否确定取消任务？"}
            </View>
            <View className="modal-actions">
              <View className="modal-btn cancel" onClick={closeModal}>
                取消
              </View>
              <View className="modal-btn confirm" onClick={confirmAction}>
                确定
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Toast提示 */}
      {showToast && (
        <View
          className={`toast-message ${
            toastType === "success" ? "success" : "error"
          }`}
        >
          <View
            className={`toast-icon ${
              toastType === "success" ? "success" : "error"
            }`}
          ></View>
          <Text className="toast-text">{toastMessage}</Text>
        </View>
      )}
    </View>
  );
};

export default TaskPage;
