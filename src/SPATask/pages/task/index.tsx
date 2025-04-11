/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, Input, Image } from "@tarojs/components";
import { Button, Empty, Loading } from "@taroify/core";
import { ArrowDown, Replay } from "@taroify/icons";
import Taro from "@tarojs/taro";
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
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);

  /**
   * 获取任务列表数据
   */
  const fetchTaskList = async () => {
    try {
      const isFinish = activeTab === "pending" ? "0" : "1";

      // 使用taskApi服务获取任务列表
      const result = await taskApi.getPlanTasks({
        current: Number(current),
        size: Number(pageSize),
        isFinish,
        classa: filterA === "报送分类A" ? undefined : filterA,
        classb: filterB === "报送分类B" ? undefined : filterB,
      });

      if (activeTab === "pending") {
        setPendingTasks(result?.records || []);
      } else {
        setCompletedTasks(result?.records || []);
      }

      setTotal(Number(result?.total || 0));
    } catch (error) {
      console.error("获取任务列表失败:", error);
      // 发生错误时清空数据
      if (activeTab === "pending") {
        setPendingTasks([]);
      } else {
        setCompletedTasks([]);
      }
      setTotal(0);
      showToastMessage("error", "获取任务列表失败");
    }
  };

  /**
   * 完成任务
   * @param taskId 任务ID
   */
  const handleCompleteTask = async (taskId: string) => {
    try {
      const success = await taskApi.completeTask(taskId);

      if (success) {
        showToastMessage("success", "完成任务");
        fetchTaskList();
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
        <View className="task-list">
          {currentTasks.length > 0 ? (
            currentTasks.map((task) => (
              <View key={task.id} className="task-card">
                {/* 抽样单号 */}
                <View className="task-id-row">
                  <Text className="task-id-label">抽样单编号：</Text>
                  <Text className="task-id-value">{task.sampleNo}</Text>
                  <Text className="task-link-tag">{task.sampleLink}</Text>
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
                    {/* 暂时屏蔽取消任务按钮 */}
                    {/*<View
                      className="task-action-btn cancel"
                      onClick={() =>
                        showConfirmModal("cancel", String(task.id))
                      }
                    >
                      取消任务
                    </View>*/}
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
            <View className="empty-state">
              <Empty>
                <Empty.Image src="search" />
                <Empty.Description>暂无任务数据</Empty.Description>
              </Empty>
            </View>
          )}
        </View>

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
