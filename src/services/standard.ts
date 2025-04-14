/**
 * 标法查询相关服务
 */
import Taro from "@tarojs/taro";

/**
 * 外部标法查询基础路径
 */
const STANDARD_BASE_URL = "https://retrieval.ejclims.com";

/**
 * 标准详情接口
 */
export interface StandardDetail {
  /** 适用日期 */
  applyDate: number;
  /** 中国分类 */
  cnClassify: string;
  /** 创建部门 */
  createDep: string;
  /** 文件ID */
  fileId: number;
  /** GB分类 */
  gbClassify: string;
  /** 是否介绍 */
  isIntroduce: string;
  /** 标准名称 */
  name: string;
  /** 标准编号 */
  number: string;
  /** 省份 */
  province: string;
  /** 发布日期 */
  publishDate: number;
  /** 发布部门 */
  publishDep: string;
  /** 标准等级 */
  standardGrade: string;
  /** 状态码 */
  stateNum: number;
}

/**
 * 标准查询参数
 */
export interface StandardQueryParams {
  /** 搜索内容 */
  input: string;
  /** 省份 */
  province: string;
  /** 每页数量 */
  pageSize: number;
  /** 当前页码 */
  currentPage: number;
}

/**
 * 分页响应结构
 */
export interface StandardResponse {
  /** 数据行 */
  rows: StandardDetail[];
  /** 总数量 */
  total: number;
}

/**
 * 标准查询接口响应
 */
export interface StandardApiResponse {
  /** 状态码 */
  code: number;
  /** 数据 */
  data: StandardResponse;
  /** 消息 */
  msg: string;
}

/**
 * 查询标准列表
 * @param params 查询参数
 * @returns 标准列表
 */
export async function queryStandards(
  params: StandardQueryParams
): Promise<StandardResponse> {
  try {
    // 显示加载状态
    Taro.showLoading({ title: "加载中...", mask: true });

    // 构建完整URL
    const url = `${STANDARD_BASE_URL}/api/retrieval/externalApi/samplingAssistant`;

    // 发送请求
    const response = await Taro.request<StandardApiResponse>({
      url,
      method: "GET",
      data: params,
    });

    // 处理响应
    if (response.statusCode === 200 && response.data.code === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询标准列表失败:", error);
    Taro.showToast({
      title: `查询失败: ${error.message || "网络异常"}`,
      icon: "none",
      duration: 2000,
    });
    return { rows: [], total: 0 };
  } finally {
    Taro.hideLoading();
  }
}

/**
 * 获取标准详情
 * @param id 标准ID
 * @returns 标准详情
 */
export async function getStandardDetail(
  id: number
): Promise<StandardDetail | null> {
  try {
    // 显示加载状态
    Taro.showLoading({ title: "加载中...", mask: true });

    // 构建完整URL
    const url = `${STANDARD_BASE_URL}/api/retrieval/externalApi/samplingAssistant/${id}`;

    // 发送请求
    const response = await Taro.request<StandardApiResponse>({
      url,
      method: "GET",
    });

    // 处理响应
    if (response.statusCode === 200 && response.data.code === 200) {
      return response.data.data.rows[0] || null;
    } else {
      throw new Error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取标准详情失败:", error);
    Taro.showToast({
      title: `获取详情失败: ${error.message || "网络异常"}`,
      icon: "none",
      duration: 2000,
    });
    return null;
  } finally {
    Taro.hideLoading();
  }
}

// 导出API
export const standardApi = {
  queryStandards,
  getStandardDetail,
};
