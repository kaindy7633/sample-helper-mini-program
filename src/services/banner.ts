/**
 * 轮播图相关服务
 */
import request from "./request";
import { API_PATHS } from "./config";

/**
 * 轮播图数据类型
 */
export interface BannerItem {
  /** ID */
  id: string;
  /** 图片URL */
  imageUrl: string;
  /** 标题 */
  title: string;
  /** 链接地址 */
  linkUrl?: string;
  /** 排序 */
  sort?: number;
  /** 状态 */
  status?: number;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
}

/**
 * 获取轮播图数据
 * @returns 轮播图列表
 */
export function getBannerList(): Promise<BannerItem[]> {
  return request<BannerItem[]>({
    url: API_PATHS.BANNER.GET_EXCHANGE_DETAILS,
    method: "GET",
  });
}
