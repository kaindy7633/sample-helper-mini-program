/* eslint-disable @typescript-eslint/no-unused-vars */
import Taro from "@tarojs/taro";
import request from "./request";
import { API_BASE_URL } from "./config";

/**
 * 获取请求头函数（从request.ts中提取）
 * @returns 包含认证信息的请求头
 */
function getRequestHeader(): Record<string, string> {
  const headers: Record<string, string> = {};
  try {
    const token = Taro.getStorageSync("user_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("获取认证信息失败:", error);
  }
  return headers;
}

/**
 * 抽样单验证相关服务
 */

/**
 * 验证条目接口
 */
export interface ValidationItem {
  /** ID */
  id: number;
  /** 抽样单号 */
  sampleNo?: string | null;
  /** 样品名称 */
  sampleName?: string | null;
  /** 任务名称 */
  taskName?: string;
  /** 任务标题 (旧版) */
  title?: string;
  /** 创建时间 */
  createTime: string;
  /** 创建用户 */
  createUser: string;
  /** 创建用户ID */
  createUserId: string;
  /** 状态 0-正常 其他-异常 */
  status: string;
  /** 是否删除 */
  isDel: number;
  /** 组织ID */
  orgId: string;
  /** 是否已读 */
  isRead: number;
  /** 任务编号 */
  spotNo?: string | null;
}

/**
 * 验证列表查询参数
 */
export interface ValidationQueryParams {
  /** 当前页码 */
  currentPage?: number;
  /** 每页数量 */
  pageSize?: number;
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
 * 文件上传响应结构
 */
export interface FileUploadResponse {
  /** 是否成功 */
  success: boolean;
  /** 消息 */
  message: string;
  /** 文件ID或路径 */
  fileId?: string;
}

/**
 * 获取验证列表
 * @param params 查询参数
 * @returns 验证列表分页数据
 */
export async function getValidationList(params: ValidationQueryParams) {
  return request<PaginatedResponse<ValidationItem>>({
    url: "/api/sampleValidation/list",
    method: "POST",
    data: params,
  });
}

/**
 * 上传验证文件
 * @param filePath 文件路径
 * @param onProgress 上传进度回调
 * @returns 上传结果
 */
export async function uploadValidationFile(
  filePath: string,
  onProgress?: (percent: number) => void
): Promise<FileUploadResponse> {
  try {
    Taro.showLoading({ title: "上传中...", mask: true });

    const result = await Taro.uploadFile({
      url: API_BASE_URL + "/api/sampleValidation/processed",
      filePath: filePath,
      name: "file", // 这里用 file
      header: {
        ...getRequestHeader(),
        // 不要手动加 Content-Type
      },
      // formData: {}, // 如有需要可加
      success: (res) => {
        // 这里的 success 只在小程序端用，实际返回值用 result
      },
      fail: (error) => {
        throw error;
      },
    });

    Taro.hideLoading();
    if (result.statusCode === 200) {
      return { success: true, message: "上传成功", fileId: result.data };
    } else {
      return { success: false, message: `服务器错误: ${result.statusCode}` };
    }
  } catch (error: any) {
    Taro.hideLoading();
    return { success: false, message: error.errMsg || "上传失败" };
  }
}

/**
 * 使用 request 方法上传验证文件
 * @param fileBuffer 文件的 ArrayBuffer 或 base64 字符串
 * @param fileName 文件名
 * @returns 上传结果
 */
export async function uploadValidationFileByRequest(
  fileBuffer: ArrayBuffer | string
): Promise<FileUploadResponse> {
  try {
    Taro.showLoading({ title: "上传中...", mask: true });

    // 构造 formData
    const formData: Record<string, any> = {
      files: fileBuffer,
    };

    const result = await request<FileUploadResponse>({
      url: "/api/sampleValidation/processed",
      method: "POST",
      header: {
        ...getRequestHeader(),
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      showLoading: false,
    });

    Taro.hideLoading();
    return result;
  } catch (error: any) {
    Taro.hideLoading();
    return { success: false, message: error.message || "上传失败" };
  }
}

// 导出API
const sampleValidationApi = {
  getValidationList,
  uploadValidationFile,
  uploadValidationFileByRequest,
};

export default sampleValidationApi;
