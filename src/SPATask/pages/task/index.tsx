import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Input, Image } from "@tarojs/components";
import { Button } from "@taroify/core";
import { ArrowDown, Replay } from "@taroify/icons";
import Taro from "@tarojs/taro";
import SearchIcon from "../../../assets/images/ico_search_grey.png";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);

  /**
   * 获取任务列表数据
   */
  const fetchTaskList = async () => {
    try {
      setLoading(true);
      const isFinish = activeTab === "pending" ? "0" : "1";

      // 调用API获取任务列表
      const response = await Taro.request({
        url: "/planTask/detailPage",
        method: "GET",
        data: {
          current,
          size: pageSize,
          isFinish,
          classA: filterA !== "报送分类A" ? filterA : undefined,
          classB: filterB !== "报送分类B" ? filterB : undefined,
          keyword: keyword || undefined,
        },
      });

      const { data } = response;

      if (data.code === 200 && data.success) {
        if (activeTab === "pending") {
          setPendingTasks(data.data.records);
        } else {
          setCompletedTasks(data.data.records);
        }

        setTotal(Number(data.data.total));
      } else {
        showToastMessage("error", "获取任务列表失败");
      }
    } catch (error) {
      console.error("获取任务列表失败:", error);
      showToastMessage("error", "获取任务列表失败");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 完成任务
   * @param taskId 任务ID
   */
  const handleCompleteTask = async (taskId: string) => {
    try {
      const response = await Taro.request({
        url: `/planTask/complete/${taskId}`,
        method: "POST",
      });

      if (response.data.code === 200 && response.data.success) {
        showToastMessage("success", "完成任务");
        fetchTaskList();
      } else {
        showToastMessage("error", response.data.msg || "操作失败");
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
      const response = await Taro.request({
        url: `/planTask/cancel/${taskId}`,
        method: "POST",
      });

      if (response.data.code === 200 && response.data.success) {
        showToastMessage("error", "取消任务");
        fetchTaskList();
      } else {
        showToastMessage("error", response.data.msg || "操作失败");
      }
    } catch (error) {
      console.error("取消任务失败:", error);
      showToastMessage("error", "取消任务失败");
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchTaskList();
  }, [activeTab, current, pageSize]);

  // 切换Tab
  const handleTabChange = (tab: "pending" | "completed") => {
    setActiveTab(tab);
    setCurrent(1); // 切换Tab时重置页码
  };

  // 处理搜索
  const handleSearch = () => {
    setCurrent(1); // 搜索时重置页码
    fetchTaskList();
  };

  // 切换排序方式
  const toggleOrder = () => {
    setIsDescOrder(!isDescOrder);
  };

  // 重置筛选条件
  const handleReset = () => {
    setFilterA("报送分类A");
    setFilterB("报送分类B");
    setKeyword("");
    setCurrent(1);
    fetchTaskList();
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
  const currentTasks = activeTab === "pending" ? pendingTasks : completedTasks;

  /**
   * 渲染任务详情表格
   * @param cateList 食品类别数据
   */
  const renderTaskDetails = (
    cateList: TaskDetail["cateList"]
  ): DetailItem[] => {
    // 将逗号分隔的字符串转为数组
    const cate2Array = cateList.cate2.split(",");
    const cate3Array = cateList.cate3.split(",");
    const cate4Array = cateList.cate4.split(",");
    const maxLength = Math.max(
      cate2Array.length,
      cate3Array.length,
      cate4Array.length
    );

    const details: DetailItem[] = [];
    for (let i = 0; i < maxLength; i++) {
      details.push({
        category: i === 0 ? cateList.cate1 : "",
        subcategory: cate2Array[i] || "",
        property: cate3Array[i] || "",
        brand: cate4Array[i] || "",
      });
    }

    return details;
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
              placeholder="输入食品大类"
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
              // onClick={() => setDistancePriorityOpen(true)}
            >
              <Text style={{ marginRight: 3, fontSize: 16 }}>{filterA}</Text>
              <ArrowDown />
            </View>
            <View
              className="filter-item"
              // onClick={() => setCompanyTypeOpen(true)}
            >
              <Text style={{ marginRight: 3, fontSize: 16 }}>{filterB}</Text>
              <ArrowDown />
            </View>
          </View>
          <View className="filter-divider"></View>
          <View className="reset-button" onClick={handleReset}>
            <Replay size="18" />
            <Text style={{ fontSize: 16 }}>重置</Text>
          </View>
        </View>
      </View>

      {/* 内容区域 */}
      <ScrollView className="content" scrollY>
        {loading ? (
          <View className="loading-indicator">加载中...</View>
        ) : (
          <View className="task-list">
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <View key={task.id} className="task-card">
                  {/* 抽样单号 */}
                  <View className="task-id-row">
                    <Text className="task-id-label">抽样单编号：</Text>
                    <Text className="task-id-value">{task.sampleNo}</Text>
                    <View className="task-print-btn">打印</View>
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
                      <View className="table-cell">食品属性</View>
                      <View className="table-cell">食品品牌</View>
                    </View>

                    {renderTaskDetails(task.cateList).map((detail, index) => (
                      <View key={index} className="table-row">
                        <View className="table-cell">{detail.category}</View>
                        <View className="table-cell">{detail.subcategory}</View>
                        <View className="table-cell">{detail.property}</View>
                        <View className="table-cell">{detail.brand}</View>
                      </View>
                    ))}
                  </View>

                  {/* 任务操作按钮 - 仅在待执行tab下显示 */}
                  {activeTab === "pending" && (
                    <View className="task-actions">
                      <View
                        className="task-action-btn cancel"
                        onClick={() =>
                          showConfirmModal("cancel", String(task.id))
                        }
                      >
                        取消任务
                      </View>
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
            ) : (
              <View className="empty-state">暂无任务数据</View>
            )}
          </View>
        )}

        {/* 底部空白占位，防止内容被底部导航遮挡 */}
        <View className="bottom-spacer"></View>
      </ScrollView>

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
