import React, { useState } from "react";
import { View, Text, ScrollView, Input, Image } from "@tarojs/components";
import { Button } from "@taroify/core";
import { ArrowDown, Replay } from "@taroify/icons";
import SearchIcon from "../../../assets/images/ico_search_grey.png";
import "./index.less";

/**
 * 任务页面组件
 * @returns {JSX.Element} 任务页面
 */
const TaskPage: React.FC = () => {
  // 当前激活的tab
  const [activeTab, setActiveTab] = useState<"pending" | "completed">(
    "pending"
  );

  // 搜索关键词
  const [keyword, setKeyword] = useState<string>("");

  // 搜索关键词
  const [searchKeyword, setSearchKeyword] = useState<string>("");

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

  // 模拟任务列表数据 - 待执行
  const pendingTasks = [
    {
      id: "DC12874612876498123",
      title: "2026湖北省监督抽检专项任务",
      inspectors: ["张三", "李四"],
      deadline: "2025-5-1",
      details: [
        {
          category: "食品大类",
          subcategory: "小麦粉",
          property: "小麦粉",
          brand: "大米",
        },
        {
          category: "粮食加工品",
          subcategory: "挂面",
          property: "挂面",
          brand: "挂面",
        },
        {
          category: "其他粮食加工品",
          subcategory: "",
          property: "谷物加工品",
          brand: "",
        },
      ],
    },
    {
      id: "DC12874612876498124",
      title: "2025湖北省监督抽检专项任务",
      inspectors: ["张三", "李四"],
      deadline: "2025-5-1",
      details: [
        {
          category: "食品大类",
          subcategory: "小麦粉",
          property: "小麦粉",
          brand: "大米",
        },
        {
          category: "粮食加工品",
          subcategory: "挂面",
          property: "挂面",
          brand: "挂面",
        },
        {
          category: "其他粮食加工品",
          subcategory: "",
          property: "谷物加工品",
          brand: "",
        },
      ],
    },
  ];

  // 模拟任务列表数据 - 已完成
  const completedTasks = [
    {
      id: "DC12874612876498125",
      title: "2024湖北省监督抽检专项任务",
      inspectors: ["王五", "赵六"],
      deadline: "2024-5-1",
      details: [
        {
          category: "食品大类",
          subcategory: "小麦粉",
          property: "小麦粉",
          brand: "大米",
        },
        {
          category: "粮食加工品",
          subcategory: "挂面",
          property: "挂面",
          brand: "挂面",
        },
      ],
    },
  ];

  // 切换Tab
  const handleTabChange = (tab: "pending" | "completed") => {
    setActiveTab(tab);
  };

  // 处理搜索
  const handleSearch = () => {
    console.log("搜索关键词:", searchKeyword);
    // 实际应用中这里会调用API或过滤数据
  };

  // 切换排序方式
  const toggleOrder = () => {
    setIsDescOrder(!isDescOrder);
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
      // 实际应用中这里会调用API完成任务
      console.log("确认完成任务:", currentTaskId);
      showToastMessage("success", "完成任务");
    } else {
      // 实际应用中这里会调用API取消任务
      console.log("确认取消任务:", currentTaskId);
      showToastMessage("error", "取消任务");
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
              // onConfirm={(e) => handleSearch(e.detail.value)}
            />
          </View>
          <Button
            className="search-btn"
            variant="text"
            color="primary"
            size="small"
            // onClick={() => handleSearch(keyword)}
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
          <View className="reset-button" onClick={() => {}}>
            <Replay size="18" />
            <Text style={{ fontSize: 16 }}>重置</Text>
          </View>
        </View>

        {/* <View className="filters">
          <View className="filter-item">
            <Text className="filter-text">{filterA}</Text>
            <View className="filter-arrow">▼</View>
          </View>
          <View className="filter-item">
            <Text className="filter-text">{filterB}</Text>
            <View className="filter-arrow">▼</View>
          </View>
          <View className="order-toggle" onClick={toggleOrder}>
            <Text className="order-text">重置</Text>
            <View className="refresh-icon">⟳</View>
          </View>
        </View> */}
      </View>

      {/* 内容区域 */}
      <ScrollView className="content" scrollY>
        {/* 任务列表 */}
        <View className="task-list">
          {currentTasks.map((task) => (
            <View key={task.id} className="task-card">
              {/* 抽样单号 */}
              <View className="task-id-row">
                <Text className="task-id-label">抽样单编号：</Text>
                <Text className="task-id-value">{task.id}</Text>
                <View className="task-print-btn">打印</View>
              </View>

              {/* 任务名称 */}
              <View className="task-title-row">
                <Text className="task-title">{task.title}</Text>
              </View>

              {/* 抽样人员 */}
              <View className="task-info-row">
                <Text className="task-info-label">抽样人员：</Text>
                <Text className="task-info-value">
                  {task.inspectors.join("、")}
                </Text>
              </View>

              {/* 下达时间 */}
              <View className="task-info-row">
                <Text className="task-info-label">下达时间：</Text>
                <Text className="task-info-value">{task.deadline}</Text>
              </View>

              {/* 食品详情表格 */}
              <View className="task-details-table">
                <View className="table-header">
                  <View className="table-cell">食品大类</View>
                  <View className="table-cell">食品亚类</View>
                  <View className="table-cell">食品属性</View>
                  <View className="table-cell">食品品牌</View>
                </View>

                {task.details.map((detail, index) => (
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
                    onClick={() => showConfirmModal("cancel", task.id)}
                  >
                    取消任务
                  </View>
                  <View
                    className="task-action-btn complete"
                    onClick={() => showConfirmModal("complete", task.id)}
                  >
                    完成任务
                  </View>
                </View>
              )}
            </View>
          ))}
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
          <Text className="toast-text">
            {toastType === "success" ? "完成任务" : "取消任务"}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TaskPage;
