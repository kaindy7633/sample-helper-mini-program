/**
 * 统一请求工具
 */
import Taro from "@tarojs/taro";
import { API_BASE_URL } from "./config";

/**
 * 统一响应结构
 */
export interface BaseResponse<T = any> {
  /** 状态码 */
  code: number;
  /** 数据 */
  data: T;
  /** 消息 */
  message: string;
}

/**
 * 网络请求配置
 */
export interface RequestOptions
  extends Omit<Taro.request.Option, "success" | "fail"> {
  /** 是否显示loading */
  showLoading?: boolean;
  /** loading提示文字 */
  loadingText?: string;
  /** 是否显示错误提示 */
  showErrorToast?: boolean;
  /** 是否在401时自动跳转到登录页 */
  autoRedirectOnUnauthorized?: boolean;
}

/**
 * 默认请求配置
 */
const DEFAULT_OPTIONS: Partial<RequestOptions> = {
  showLoading: false,
  loadingText: "加载中...",
  showErrorToast: true,
  autoRedirectOnUnauthorized: true,
};

/** 业务接口域名 */
const BASE_URL = API_BASE_URL;

// 标记是否已经显示了401提示，避免重复提示
let hasShownUnauthorizedToast = false;

/**
 * 获取请求头
 * @returns 包含认证信息的请求头
 */
function getRequestHeader(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const token = Taro.getStorageSync("user_token");
    // const userInfo = JSON.parse(Taro.getStorageSync("user_info"));

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("获取认证信息失败:", error);
  }
  return headers;
}

/**
 * 统一请求函数
 * @param options 请求配置
 * @returns Promise
 */
export default function request<T = any>(options: RequestOptions): Promise<T> {
  const opt = { ...DEFAULT_OPTIONS, ...options };
  const {
    showLoading,
    loadingText,
    showErrorToast,
    autoRedirectOnUnauthorized,
    ...requestOptions
  } = opt;

  // 显示loading
  if (showLoading) {
    Taro.showLoading({ title: loadingText || "加载中...", mask: true });
  }

  // 处理 URL
  const url = /^(http|https):\/\//.test(requestOptions.url || "")
    ? requestOptions.url
    : `${BASE_URL}${requestOptions.url}`;

  // 添加认证头
  const headers = {
    ...requestOptions.header,
    ...getRequestHeader(),
  };

  return new Promise<T>((resolve, reject) => {
    Taro.request({
      ...requestOptions,
      url,
      header: headers,
      success: (res) => {
        const { statusCode } = res;
        const result = res.data as BaseResponse<T>;

        // 请求成功
        if (statusCode >= 200 && statusCode < 300) {
          // 业务成功 - 修改判断逻辑，同时支持 code 为 0 或 200 的情况
          if (result.code === 0 || result.code === 200) {
            resolve(result.data);
          } else {
            // 业务失败
            if (showErrorToast) {
              Taro.showToast({
                title: result.message || "请求失败",
                icon: "none",
                duration: 2000,
              });
            }
            reject(result);
          }
        } else if (statusCode === 401) {
          // 处理 401 未授权错误（token失效）
          if (autoRedirectOnUnauthorized && !hasShownUnauthorizedToast) {
            hasShownUnauthorizedToast = true;

            console.log("Token已失效，需要重新登录");

            Taro.showToast({
              title: "登录已过期，请重新登录",
              icon: "none",
              duration: 2000,
              complete: () => {
                // 清除登录信息
                try {
                  Taro.removeStorageSync("user_info");
                  Taro.removeStorageSync("token");
                  console.log("已清除过期的登录信息");
                } catch (e) {
                  console.error("清除登录信息失败:", e);
                }

                // 延迟跳转，确保Toast能够显示
                setTimeout(() => {
                  hasShownUnauthorizedToast = false;
                  Taro.redirectTo({
                    url: "/SPALogin/pages/login/index",
                  });
                }, 1500);
              },
            });
          }
          reject(res);
        } else {
          // 其他 HTTP 错误
          if (showErrorToast) {
            Taro.showToast({
              title: `请求错误: ${statusCode}`,
              icon: "none",
              duration: 2000,
            });
          }
          reject(res);
        }
      },
      fail: (err) => {
        if (showErrorToast) {
          Taro.showToast({
            title: "网络异常，请检查网络连接",
            icon: "none",
            duration: 2000,
          });
        }
        reject(err);
      },
      complete: () => {
        if (showLoading) {
          Taro.hideLoading();
        }
      },
    });
  });
}
