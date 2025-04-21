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
      url: API_BASE_URL + "/api/sampleValidation/upload",
      filePath: filePath,
      name: "files", // 后端接收参数为 files
      header: {
        ...getRequestHeader(),
      },
    });

    Taro.hideLoading();
    if (result.statusCode === 200) {
      let data;
      try {
        data =
          typeof result.data === "string"
            ? JSON.parse(result.data)
            : result.data;
      } catch (e) {
        return { success: false, message: "响应数据解析失败" };
      }

      if (data.success || data.code === 200) {
        return { success: true, message: "上传成功", fileId: data.data };
      } else {
        return { success: false, message: data.msg || "上传失败" };
      }
    } else {
      return { success: false, message: `服务器错误: ${result.statusCode}` };
    }
  } catch (error: any) {
    Taro.hideLoading();
    return { success: false, message: error.errMsg || "上传失败" };
  }
}

/**
 * 上传多个验证文件
 * @param filePaths 文件路径数组
 * @param onProgress 上传进度回调
 * @returns 上传结果
 */
export async function uploadValidationFiles(
  filePaths: string[],
  onProgress?: (percent: number) => void
): Promise<{
  success: boolean;
  successCount: number;
  failCount: number;
  message: string;
}> {
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < filePaths.length; i++) {
    try {
      // 获取文件信息并进行基本检查
      const fileInfo = await Taro.getFileInfo({ filePath: filePaths[i] });

      // 检查文件大小 (限制为 5MB)
      //@ts-ignore
      if (fileInfo.size > 5 * 1024 * 1024) {
        failCount++;
        continue;
      }

      // 上传单个文件
      const result = await uploadValidationFile(filePaths[i]);

      if (result.success) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (error) {
      failCount++;
    }

    // 更新进度
    if (onProgress) {
      onProgress(Math.round(((i + 1) / filePaths.length) * 100));
    }
  }

  // 返回总体结果
  if (successCount > 0) {
    if (failCount > 0) {
      return {
        success: true,
        successCount,
        failCount,
        message: `上传完成：${successCount}个成功，${failCount}个失败`,
      };
    } else {
      return {
        success: true,
        successCount,
        failCount,
        message: "全部上传成功",
      };
    }
  } else {
    return {
      success: false,
      successCount: 0,
      failCount,
      message: "上传失败",
    };
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
      file: base64Data,
    };

    // 发送请求
    const result = await request<FileUploadResponse>({
      url: "/api/sampleValidation/processed",
      method: "POST",
      data: formData,
      header: {
        ...getRequestHeader(),
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

/**
 * 获取验证详情
 * @param taskId 任务ID
 * @returns 验证详情数据
 */
export async function getValidationDetail(taskId: number) {
  return request({
    url: "/api/sampleValidation/detail",
    method: "GET",
    data: { taskId },
  });
}

/**
 * 标记抽样单为已处理（已阅读）
 * @param taskId 任务ID
 * @returns 处理结果
 */
export async function markProcessed(taskId: string) {
  return request({
    url: "/api/sampleValidation/processed",
    method: "POST",
    data: { taskId },
  });
}

// 导出API
const sampleValidationApi = {
  getValidationList,
  uploadValidationFile,
  uploadValidationFiles,
  uploadValidationFileByRequest,
  getValidationDetail,
  markProcessed,
};

export default sampleValidationApi;
