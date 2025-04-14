import request from "./request";

/**
 * 抽样单验证项
 */
export interface ValidationItem {
  /** 标题 */
  title: string;
  /** 抽样单号 */
  sampleNo: string;
  /** 样品名称 */
  sampleName: string;
  /** 创建时间 */
  createTime: string;
  /** 验证状态 0-正常 1-异常 */
  status: number;
}

/**
 * 抽样单验证列表请求参数
 */
export interface ValidationListParams {
  /** 页码 */
  currentPage: number;
  /** 每页条数 */
  pageSize: number;
}

/**
 * 抽样单验证列表响应
 */
export interface ValidationListResponse {
  /** 总数 */
  total: number | string;
  /** 列表数据 */
  records: ValidationItem[];
  /** 当前页 */
  current: number | string;
  /** 每页大小 */
  size: number | string;
  /** 总页数 */
  pages: number | string;
}

/**
 * 获取抽样单验证列表
 * @param params 请求参数
 * @returns 验证列表数据
 */
export const getValidationList = async (
  params: ValidationListParams
): Promise<ValidationListResponse> => {
  return request({
    url: "/api/sampleValidation/list",
    method: "POST",
    data: params,
  });
};

// 导出命名空间
const sampleValidationApi = {
  getValidationList,
};

export default sampleValidationApi;
