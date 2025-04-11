/**
 * 标法查询相关服务
 */
import request from "../request";
import { API_PATHS } from "../config";

/**
 * 标准查询参数
 */
export interface StandardQueryParams {
  /** 关键词 */
  keyword?: string;
  /** 地区 */
  region?: string;
  /** 当前页码 */
  current?: number;
  /** 每页条数 */
  size?: number;
}

/**
 * 标准详情
 */
export interface StandardDetail {
  /** ID */
  id: string;
  /** 标准编号 */
  standardCode: string;
  /** 标准名称 */
  standardName: string;
  /** 发布日期 */
  publishDate: string;
  /** 实施日期 */
  implementDate: string;
  /** 标准类型 */
  standardType: string;
  /** 标准状态 */
  standardStatus: string;
  /** 地区 */
  region: string;
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
 * 查询标准列表
 * @param params 查询参数
 * @returns 标准列表分页数据
 */
export async function queryStandards(params: StandardQueryParams) {
  return request<PaginatedResponse<StandardDetail>>({
    url: "/api/standard/query",
    method: "GET",
    data: params,
    showLoading: true,
    loadingText: "搜索中...",
  });
}

/**
 * 获取标准详情
 * @param standardId 标准ID
 * @returns 标准详情
 */
export async function getStandardDetail(standardId: string) {
  return request<StandardDetail>({
    url: `/api/standard/detail/${standardId}`,
    method: "GET",
    showLoading: true,
    loadingText: "加载中...",
  });
}