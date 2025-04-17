/**
 * 消息相关服务
 */
import request from "./request";
import { API_PATHS } from "./config";

/**
 * 最新动态消息项类型
 */
export interface NewsItem {
  /** ID */
  id?: string;
  /** 新闻标题 */
  newsName: string;
  /** 文件URL */
  originalFileUrl: string;
  /** 文件名 */
  originalFileName: string;
  /** 新闻时间 */
  newsTime: string;
}

/**
 * 常见问题项类型
 */
export interface CommonProblemItem {
  /** ID */
  id?: string;
  /** 删除标记 */
  delFlag?: number;
  /** 创建人 */
  createBy?: string | null;
  /** 创建时间 */
  createTime?: string;
  /** 更新人 */
  updateBy?: string | null;
  /** 更新时间 */
  updateTime?: string;
  /** 问题名称 */
  problemName: string;
  /** 问题类型ID */
  typeId?: string;
  /** 问题类型名称 */
  problemTypeName?: string;
  /** 答案 */
  answer: string;
}

/**
 * 分页查询参数
 */
export interface PageParams {
  /** 页码 */
  current?: number;
  /** 每页条数 */
  size?: number;
}

/**
 * 分页结果类型
 */
export interface PageResult<T> {
  /** 数据列表 */
  records: T[];
  /** 总数 */
  total: number | string;
  /** 当前页码 */
  current: number | string;
  /** 每页条数 */
  size: number | string;
  /** 总页数 */
  pages: number | string;
}

/**
 * API响应类型
 */
export interface ApiResponse<T> {
  /** 状态码 */
  code: number;
  /** 是否成功 */
  success: boolean;
  /** 数据 */
  data: T;
  /** 消息 */
  msg: string;
}

/**
 * 最新动态消息响应类型
 */
export interface NewsResponse {
  /** 数据列表 */
  data: NewsItem[];
}

/**
 * 抽样细则项类型
 */
export interface SamplingRegulationItem {
  /** ID */
  id?: string;
  /** 删除标记 */
  delFlag?: number;
  /** 创建人 */
  createBy?: string | null;
  /** 创建时间 */
  createTime?: string;
  /** 更新人 */
  updateBy?: string | null;
  /** 更新时间 */
  updateTime?: string;
  /** 细则名称 */
  regulationName: string;
  /** 发布时间 */
  publishTime: string;
  /** 文件URL */
  fileUrl?: string;
  /** 文件名 */
  fileName?: string;
  /** 原始文件URL */
  originalFileUrl?: string;
  /** 原始文件名 */
  originalFileName?: string;
}

/**
 * 获取最新动态消息
 * @returns 消息列表
 */
export function getNewsMessages(): Promise<NewsItem[]> {
  return request<NewsItem[]>({
    url: API_PATHS.HOME.SAMPLE_MESSAGE,
    method: "GET",
  });
}

/**
 * 获取常见问题列表
 * @param params 分页参数
 * @returns 常见问题分页列表
 */
export function getCommonProblems(
  params?: PageParams
): Promise<PageResult<CommonProblemItem>> {
  return request<PageResult<CommonProblemItem>>({
    url: API_PATHS.LEARN.COMMON_PROBLEM,
    method: "GET",
    data: params || { current: 1, size: 10 },
  });
}

/**
 * 获取抽样细则列表
 * @param params 分页参数
 * @returns 抽样细则分页列表
 */
export function getSamplingRegulations(
  params?: PageParams
): Promise<PageResult<SamplingRegulationItem>> {
  return request<PageResult<SamplingRegulationItem>>({
    url: API_PATHS.LEARN.SAMPLING_REGULATION,
    method: "GET",
    data: params || { current: 1, size: 10 },
  });
}

// 导出消息模块的API
const messageApi = {
  getNewsMessages,
  getCommonProblems,
  getSamplingRegulations,
};

export default messageApi;
