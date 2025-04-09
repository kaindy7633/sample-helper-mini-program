/**
 * 应用相关服务
 */
import request from "./request";
import { API_PATHS } from "./config";

/**
 * 获取应用菜单
 * @returns 菜单列表
 */
export function getAppMenu(): Promise<Record<string, any>> {
  return request<Record<string, any>>({
    url: API_PATHS.APP.GET_APP_MENU,
    method: "GET",
  });
}
