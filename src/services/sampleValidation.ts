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
 * Base64编码函数（替代btoa）
 * @param str 需要编码的字符串
 * @returns Base64编码后的字符串
 */
function base64Encode(str: string): string {
  // Base64字符集
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let out = "";
  let i = 0;

  // 3个字节一组进行编码
  while (i < str.length) {
    const c1 = str.charCodeAt(i++);
    const c2 = i < str.length ? str.charCodeAt(i++) : 0;
    const c3 = i < str.length ? str.charCodeAt(i++) : 0;

    const triplet = (c1 << 16) | (c2 << 8) | c3;

    out += chars[(triplet >> 18) & 0x3f];
    out += chars[(triplet >> 12) & 0x3f];
    if (i > str.length - 2) {
      out += "=";
    } else {
      out += chars[(triplet >> 6) & 0x3f];
    }
    if (i > str.length - 3) {
      out += "=";
    } else {
      out += chars[triplet & 0x3f];
    }
  }

  return out;
}

/**
 * 将ArrayBuffer转换为Base64字符串
 * @param buffer ArrayBuffer数据
 * @returns Base64字符串
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const uint8Array = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return base64Encode(binary);
}

/**
 * 使用自定义request方法上传验证文件
 * @param filePath 文件路径
 * @returns 上传结果
 */
export async function uploadValidationFileByRequest(
  filePath: string
): Promise<FileUploadResponse> {
  try {
    Taro.showLoading({ title: "上传中...", mask: true });

    // 读取文件
    const fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
      Taro.getFileSystemManager().readFile({
        filePath: filePath,
        success: (res) => {
          console.log("res", res);
          resolve(res.data as ArrayBuffer);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });

    // 获取文件信息
    const fileInfo = await Taro.getFileInfo({ filePath });
    const fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
    const ext = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

    console.log("文件信息:", {
      name: fileName,
      //@ts-ignore
      size: fileInfo.size,
      type: ext,
    });

    // 将文件数据转换为Base64
    const base64Data = arrayBufferToBase64(fileData);
    console.log("Base64数据长度:", base64Data.length);

    // 确定文件的MIME类型
    let mimeType = "application/octet-stream";
    if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
    else if (ext === "png") mimeType = "image/png";
    else if (ext === "pdf") mimeType = "application/pdf";

    // 构建请求数据
    const formData = {
      files: base64Data,
    };

    // 发送请求
    const result = await request<FileUploadResponse>({
      url: "/api/sampleValidation/processed",
      method: "POST",
      data: formData,
      header: {
        ...getRequestHeader(),
        "Content-Type": "application/json", // 使用JSON格式
      },
    });

    Taro.hideLoading();
    return result;
  } catch (error: any) {
    console.error("文件上传失败:", error);
    Taro.hideLoading();
    return {
      success: false,
      message: error.errMsg || error.message || "上传失败",
    };
  }
}

// 导出API
const sampleValidationApi = {
  getValidationList,
  uploadValidationFile,
  uploadValidationFileByRequest,
};

export default sampleValidationApi;
