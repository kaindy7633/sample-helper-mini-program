/**
 * 统一请求工具
 */
import Taro from "@tarojs/taro";

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
}

/**
 * 默认请求配置
 */
const DEFAULT_OPTIONS: Partial<RequestOptions> = {
  showLoading: false,
  loadingText: "加载中...",
  showErrorToast: true,
};

/** 接口域名 */
const BASE_URL = process.env.API_BASE_URL || "";

/**
 * 统一请求函数
 * @param options 请求配置
 * @returns Promise
 */
export default function request<T = any>(options: RequestOptions): Promise<T> {
  const opt = { ...DEFAULT_OPTIONS, ...options };
  const { showLoading, loadingText, showErrorToast, ...requestOptions } = opt;

  // 显示loading
  if (showLoading) {
    Taro.showLoading({ title: loadingText || "加载中...", mask: true });
  }

  // 处理 URL
  const url = /^(http|https):\/\//.test(requestOptions.url || "")
    ? requestOptions.url
    : `${BASE_URL}${requestOptions.url}`;

  return new Promise<T>((resolve, reject) => {
    Taro.request({
      ...requestOptions,
      url,
      success: (res) => {
        const { statusCode } = res;
        const result = res.data as BaseResponse<T>;

        // 请求成功
        if (statusCode >= 200 && statusCode < 300) {
          // 业务成功
          if (result.code === 0) {
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
        } else {
          // HTTP 错误
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
