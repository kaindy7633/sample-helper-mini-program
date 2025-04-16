/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { View, Text, Image } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { Button, Skeleton, Loading, Empty } from "@taroify/core";
import "@taroify/core/loading/style";
import "@taroify/core/empty/style";
import "@taroify/core/button/style";
import { sampleValidationApi } from "../../../../services";
import readIcon from "../../../../assets/images/icon_isread.png";
import "./index.less";

// 验证状态枚举
enum ValidationStatus {
  INSPECTING = "0", // 检验中
  VALIDATING = "1", // 验证中
  ABNORMAL = "2", // 有异常
  NORMAL = "3", // 无异常
  FAILED = "4", // 验证失败
}

// 阅读状态枚举
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

// 详情页接口返回数据类型
interface ValidationDetailData {
  id: number;
  sampleNo?: string;
  sampleName?: string;
  taskName?: string;
  title?: string;
  createTime: string;
  status: string;
  createUser: string;
  createUserId: string;
  isDel: number;
  orgId: string;
  isRead: number;
  spotNo?: string;
  // 抽样单位信息
  unitName?: string;
  unitAddress?: string;
  businessLicense?: string;
  productionLicense?: string;
  legalRepresentative?: string;
  contactPerson?: string;
  contactPhone?: string;
  // 抽样场所信息
  location?: string;
  sampleType?: string;
  sampleStage?: string;
  samplePoint?: string;
  regionType?: string;
  // 生产企业信息
  productionEnterprise?: string;
  productionAddress?: string;
}

/**
 * 抽样单详情页面
 */
const ValidationDetailPage = () => {
  const router = useRouter();
  const taskId = router.params.id; // 获取路由参数中的ID

  // 详情数据
  const [detailData, setDetailData] = useState<ValidationDetailData | null>(
    null
  );

  // 加载状态
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // 当前选中的标签页索引
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  // 标签页列表
  const tabs = [
    { title: "抽样基础信息", badge: 0 },
    { title: "抽样单位信息", badge: 2 },
    { title: "抽样场所信息", badge: 2 },
    { title: "生产企业信息", badge: 0 },
    { title: "抽检样品信息", badge: 0 },
  ];

  /**
   * 获取详情数据
   */
  const fetchDetailData = async () => {
    if (!taskId) {
      setError("缺少必要的任务ID参数");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await sampleValidationApi.getValidationDetail(
        Number(taskId)
      );
      setDetailData(response);
      setLoading(false);
    } catch (err) {
      console.error("获取详情失败:", err);
      setError("获取详情数据失败");
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchDetailData();
  }, [taskId]);

  // 处理标签切换
  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

  // 渲染标签页
  const renderTabs = () => {
    return (
      <View className="tabs">
        {tabs.map((tab, index) => (
          <View
            key={index}
            className={`tab-item ${activeTabIndex === index ? "active" : ""}`}
            onClick={() => handleTabChange(index)}
          >
            <View className="tab-title-container">
              <Text className="tab-title">{tab.title}</Text>
              {tab.badge > 0 && <Text className="tab-badge">{tab.badge}</Text>}
            </View>
            {activeTabIndex === index && <View className="tab-indicator" />}
          </View>
        ))}
      </View>
    );
  };

  // 渲染抽样单位信息
  const renderUnitInfo = () => {
    if (!detailData) return null;

    return (
      <View className="detail-section">
        <View className="detail-item">
          <Text className="label">单位名称</Text>
          <Text className="value">{detailData.unitName || "暂无数据"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">单位地址</Text>
          <Text className="value">{detailData.unitAddress || "暂无数据"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">营业执照号/统一社会信用代码</Text>
          <Text className="value">
            {detailData.businessLicense || "暂无数据"}
          </Text>
        </View>
        <View className="detail-item">
          <Text className="label">经营许可证</Text>
          <Text className="value">{detailData.productionLicense || "/"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">生产许可证</Text>
          <Text className="value notification">
            {detailData.productionLicense || "暂无数据"}
          </Text>
        </View>
        <View className="detail-item">
          <Text className="label">法定代表人(负责人)</Text>
          <Text className="value">
            {detailData.legalRepresentative || "暂无数据"}
          </Text>
        </View>
        <View className="detail-item">
          <Text className="label">联系人</Text>
          <Text className="value">
            {detailData.contactPerson || "暂无数据"}
          </Text>
        </View>
        <View className="detail-item">
          <Text className="label">联系电话</Text>
          <Text className="value">{detailData.contactPhone || "暂无数据"}</Text>
        </View>
      </View>
    );
  };

  // 渲染抽样场所信息
  const renderSampleLocationInfo = () => {
    if (!detailData) return null;

    return (
      <View className="detail-section">
        <View className="detail-item">
          <Text className="label">所在地</Text>
          <Text className="value">{detailData.location || "暂无数据"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">抽样类型</Text>
          <Text className="value">{detailData.sampleType || "暂无数据"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">抽样环节</Text>
          <Text className="value">{detailData.sampleStage || "暂无数据"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">抽样地点</Text>
          <Text className="value">{detailData.samplePoint || "暂无数据"}</Text>
        </View>
        <View className="detail-item notification-item">
          <Text className="label">区域类型</Text>
          <Text className="value">{detailData.regionType || "暂无数据"}</Text>
        </View>
        <View className="notification-text">
          {detailData.regionType && (
            <Text>
              疑点提醒:当前填写区域类型是&ldquo;城市&rdquo;，被抽样单位地址含&ldquo;镇&rdquo;，建议区域类型应为&ldquo;乡镇&rdquo;。
            </Text>
          )}
        </View>
      </View>
    );
  };

  // 渲染生产企业信息
  const renderProductionInfo = () => {
    if (!detailData) return null;

    return (
      <View className="detail-section">
        <View className="detail-item">
          <Text className="label">生产企业名称</Text>
          <Text className="value">
            {detailData.productionEnterprise || "暂无数据"}
          </Text>
        </View>
        <View className="detail-item">
          <Text className="label">生产企业地址</Text>
          <Text className="value">
            {detailData.productionAddress || "暂无数据"}
          </Text>
        </View>
      </View>
    );
  };

  // 渲染抽样基础信息
  const renderBasicInfo = () => {
    if (!detailData) return null;

    return (
      <View className="detail-section">
        <View className="detail-item">
          <Text className="label">抽样单号</Text>
          <Text className="value">{detailData.sampleNo || "暂无数据"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">样品名称</Text>
          <Text className="value">{detailData.sampleName || "暂无数据"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">任务名称</Text>
          <Text className="value">
            {detailData.taskName || detailData.title || "暂无数据"}
          </Text>
        </View>
        <View className="detail-item">
          <Text className="label">创建时间</Text>
          <Text className="value">{detailData.createTime || "暂无数据"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">验证状态</Text>
          <View className="status-container">
            {detailData.isRead === ReadStatus.READ && (
              <Image src={readIcon} className="read-icon" />
            )}
            <Text
              className={`status-text ${getStatusClassName(detailData.status)}`}
            >
              {getStatusText(detailData.status)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // 渲染抽检样品信息
  const renderSampleInfo = () => {
    if (!detailData) return null;

    return (
      <View className="detail-section">
        <View className="detail-item">
          <Text className="label">抽样单号</Text>
          <Text className="value">{detailData.sampleNo || "暂无数据"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">样品名称</Text>
          <Text className="value">{detailData.sampleName || "暂无数据"}</Text>
        </View>
        <View className="detail-item">
          <Text className="label">样品规格</Text>
          <Text className="value">暂无数据</Text>
        </View>
        <View className="detail-item">
          <Text className="label">样品批号</Text>
          <Text className="value">暂无数据</Text>
        </View>
        <View className="detail-item">
          <Text className="label">样品数量</Text>
          <Text className="value">暂无数据</Text>
        </View>
        <View className="detail-item">
          <Text className="label">抽样方式</Text>
          <Text className="value">暂无数据</Text>
        </View>
      </View>
    );
  };

  // 渲染当前选中的标签页内容
  const renderTabContent = () => {
    switch (activeTabIndex) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderUnitInfo();
      case 2:
        return renderSampleLocationInfo();
      case 3:
        return renderProductionInfo();
      case 4:
        return renderSampleInfo();
      default:
        return null;
    }
  };

  // 渲染确认阅读按钮
  const renderConfirmButton = () => {
    return (
      <View className="confirm-button-wrapper">
        <Button className="confirm-button" color="primary">
          确认阅读
        </Button>
      </View>
    );
  };

  // 根据loading和error状态渲染不同内容
  if (loading) {
    return (
      <View className="detail-container">
        <View className="content loading-content">
          <Loading className="loading" type="spinner">
            加载中...
          </Loading>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="detail-container">
        <View className="content empty-content">
          <Empty>
            <Empty.Image />
            <Empty.Description>{error}</Empty.Description>
          </Empty>
        </View>
      </View>
    );
  }

  if (!detailData) {
    return (
      <View className="detail-container">
        <View className="content empty-content">
          <Empty>
            <Empty.Image />
            <Empty.Description>未找到抽样单数据</Empty.Description>
          </Empty>
        </View>
      </View>
    );
  }

  return (
    <View className="detail-container">
      <View className="content">
        {/* 标签页 */}
        {renderTabs()}

        {/* 标签页内容 */}
        <View className="tab-content">{renderTabContent()}</View>
      </View>

      {/* 确认阅读按钮 */}
      {renderConfirmButton()}
    </View>
  );
};

export default ValidationDetailPage;
