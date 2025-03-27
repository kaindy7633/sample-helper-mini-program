/**
 * 用户相关服务
 */
import request from "./request";

/**
 * 用户登录
 * @param params 登录参数
 */
export async function login(params: API.LoginParams): Promise<API.LoginResult> {
  return request<API.LoginResult>({
    url: "/api/user/login",
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
