import request from "./request";

/**
 * 抽样单验证相关服务
 */

/**
 * 验证条目接口
 */
export interface ValidationItem {
  /** ID */
  id: number;
  /** 抽样单号 */
  sampleNo?: string | null;
  /** 样品名称 */
  sampleName?: string | null;
  /** 任务名称 */
  taskName?: string;
  /** 任务标题 (旧版) */
  title?: string;
  /** 创建时间 */
  createTime: string;
  /** 创建用户 */
  createUser: string;
  /** 创建用户ID */
  createUserId: string;
  /** 状态 0-正常 其他-异常 */
  status: string;
  /** 是否删除 */
  isDel: number;
  /** 组织ID */
  orgId: string;
  /** 是否已读 */
  isRead: number;
  /** 任务编号 */
  spotNo?: string | null;
}

/**
 * 验证列表查询参数
 */
export interface ValidationQueryParams {
  /** 当前页码 */
  currentPage?: number;
  /** 每页数量 */
  pageSize?: number;
}

/**
 * 分页响应结构
 */
export interface PaginatedResponse<T> {
  /** 记录列表 */
  records: T[];
  /** 总记录数 */
  total: string;
  /** 每页大小 */
  size: string;
  /** 当前页码 */
  current: string;
  /** 总页数 */
  pages: string;
}

/**
 * 获取验证列表
 * @param params 查询参数
 * @returns 验证列表分页数据
 */
export async function getValidationList(params: ValidationQueryParams) {
  return request<PaginatedResponse<ValidationItem>>({
    url: "/api/sampleValidation/list",
    method: "POST",
    data: params,
  });
}

// 导出API
const sampleValidationApi = {
  getValidationList,
};

export default sampleValidationApi;
