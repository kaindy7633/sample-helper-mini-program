/**
 * 应用相关服务
 */
import request from "./request";
import { API_PATHS } from "./config";

/**
 * 菜单项类型
 */
export interface AppMenuItem {
  /** 菜单ID */
  id: string;
  /** 菜单名称 */
  name: string;
  /** 菜单图标 */
  icon: string;
  /** 菜单链接 */
  url?: string;
  /** 是否需要登录 */
  requireLogin?: boolean;
  /** 排序 */
  sort?: number;
}

/**
 * 获取应用菜单
 * @returns 菜单列表
 */
export function getAppMenu(): Promise<AppMenuItem[]> {
  return request<AppMenuItem[]>({
    url: API_PATHS.APP.GET_APP_MENU,
    method: "GET",
  });
}
