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
 * 最新动态消息响应类型
 */
export interface NewsResponse {
  /** 数据列表 */
  data: NewsItem[];
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
