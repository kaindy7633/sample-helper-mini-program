/**
 * 用户相关服务
 */
import request from "./request";
import { API_PATHS } from "./config";

/**
 * 登录响应数据接口
 */
export interface LoginResponse {
  orgId: string;
  orgName: string;
  id: string;
  account: string | null;
  userName: string;
  phoneNumber: string | null;
  email: string | null;
  status: string | null;
  orgProvince: string;
  orgCity: string | null;
  orgArea: string | null;
  orgAddress: string;
  orgContact: string | null;
  orgTel: string | null;
  orgEmail: string | null;
  orgZip: string | null;
  orgFax: string | null;
  userRealName: string | null;
  realName: string;
  groups: string | null;
  userLimsLevel: string | null;
  token: string;
}

/**
 * 用户登录
 * @param params 登录参数
 */
export async function login(params: {
  username: string;
  password: string;
}): Promise<LoginResponse> {
  return request<LoginResponse>({
    url: API_PATHS.USER.LOGIN,
    method: "POST",
    data: params,
    showLoading: true,
    loadingText: "登录中...",
  });
}

/**
 * 获取用户信息
 */
export async function getUserInfo(): Promise<API.UserInfo> {
  return request<API.UserInfo>({
    url: "/api/user/info",
    method: "GET",
  });
}

/**
 * 更新用户资料
 * @param params 用户资料
 */
export async function updateUserProfile(
  params: Partial<API.UserInfo>
): Promise<boolean> {
  return request<boolean>({
    url: "/api/user/profile",
    method: "PUT",
    data: params,
    showLoading: true,
  });
}
