/* eslint-disable @typescript-eslint/no-unused-vars */
import Taro from "@tarojs/taro";
import request from "./request";
import { API_PATHS } from "./config";

/**
 * 文件操作类型
 */
export enum FileOperationType {
  /** 预览 */
  PREVIEW = "1",
  /** 下载 */
  DOWNLOAD = "2",
}

/**
 * 文件下载响应结构
 */
export interface FileDownloadResponse {
  /** 文件路径 */
  filePath: string;
  /** 文件URL */
  url: string;
}

/**
 * 预览标准文件
 * @param fileId 文件ID
 * @returns 预览URL
 */
export async function previewStandardFile(fileId: number): Promise<void> {
  try {
    // 显示加载提示
    Taro.showLoading({ title: "文件加载中...", mask: true });

    // 第一步：获取文件的OSS URL
    const result = await request<any>({
      url: "/api/standardDownLoad/downLoad",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: `fileId=${fileId}&type=${FileOperationType.PREVIEW}`,
    });

    // 检查返回数据
    if (!result || !result.url) {
      Taro.showToast({
        title: "获取文件链接失败",
        icon: "none",
      });
      return;
    }

    // 获取OSS URL
    const fileUrl = result.url;

    // 第二步：下载文件内容
    const downloadResult = await Taro.downloadFile({
      url: fileUrl,
      timeout: 30000, // 设置超时为30秒
    });

    if (downloadResult.statusCode !== 200) {
      Taro.showToast({
        title: "文件下载失败",
        icon: "none",
      });
      return;
    }

    // 获取临时文件路径
    const tempFilePath = downloadResult.tempFilePath;

    // 第三步：打开文档预览
    await Taro.openDocument({
      filePath: tempFilePath,
      showMenu: true,
      success: () => {
        console.log("打开文档成功");
      },
      fail: (error) => {
        console.error("打开文档失败:", error);
        Taro.showToast({
          title: "文件预览失败",
          icon: "none",
        });
      },
    });
  } catch (error) {
    console.error("预览文件失败:", error);
    Taro.showToast({
      title: "文件预览失败",
      icon: "none",
    });
  } finally {
    Taro.hideLoading();
  }
}

/**
 * 下载标准文件
 * @param fileId 文件ID
 * @param fileName 文件名称
 */
export async function downloadStandardFile(
  fileId: number,
  fileName: string
): Promise<void> {
  try {
    // 显示加载提示
    Taro.showLoading({ title: "文件下载中...", mask: true });

    // 第一步：获取文件的OSS URL
    const result = await request<any>({
      url: "/api/standardDownLoad/downLoad",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: `fileId=${fileId}&type=${FileOperationType.PREVIEW}`,
    });

    // 检查返回数据
    if (!result || !result.url) {
      Taro.hideLoading();
      Taro.showModal({
        title: "下载失败",
        content: "获取文件链接失败，请稍后重试",
        showCancel: false,
      });
      return;
    }

    // 获取OSS URL
    const fileUrl = result.url;

    // 第二步：下载文件
    const downloadResult = await Taro.downloadFile({
      url: fileUrl,
      timeout: 60000, // 超时时间60秒
    });

    if (downloadResult.statusCode !== 200) {
      Taro.hideLoading();
      Taro.showModal({
        title: "下载失败",
        content: "文件下载失败，请检查网络后重试",
        showCancel: false,
      });
      return;
    }

    // 获取临时文件路径
    const tempFilePath = downloadResult.tempFilePath;

    // 隐藏下载loading
    Taro.hideLoading();

    // 第三步：使用openDocument打开文件，并显示右上角菜单，允许用户保存文件
    Taro.showModal({
      title: "下载成功",
      content:
        "文件已下载完成，点击确定打开文件，然后点击右上角「...」菜单选择「保存到手机」",
      showCancel: false,
      success: async (res) => {
        if (res.confirm) {
          try {
            // 尝试确定文件类型
            let fileType: keyof Taro.openDocument.FileType | undefined;
            if (fileName) {
              const extension = fileName.split(".").pop()?.toLowerCase();
              if (
                extension === "pdf" ||
                extension === "doc" ||
                extension === "docx" ||
                extension === "xls" ||
                extension === "xlsx" ||
                extension === "ppt" ||
                extension === "pptx" ||
                extension === "txt"
              ) {
                fileType = extension as keyof Taro.openDocument.FileType;
              }
            }

            // 打开文档预览，显示菜单让用户可以保存
            await Taro.openDocument({
              filePath: tempFilePath,
              fileType,
              showMenu: true,
              success: () => {
                console.log("文件预览成功，用户可以从右上角菜单保存");
              },
              fail: (openError) => {
                console.error("打开文件失败:", openError);
                Taro.showModal({
                  title: "打开失败",
                  content: "文件无法打开，请重试",
                  showCancel: false,
                });
              },
            });
          } catch (error) {
            console.error("打开文档失败:", error);
            Taro.showModal({
              title: "打开失败",
              content: "文件无法打开，请重试",
              showCancel: false,
            });
          }
        }
      },
    });
  } catch (error) {
    console.error("下载文件过程中发生错误:", error);
    Taro.hideLoading();
    Taro.showModal({
      title: "下载失败",
      content: "未知错误，请稍后重试",
      showCancel: false,
    });
  }
}

/**
 * 将二进制数据保存为临时文件
 * @param data 二进制数据
 * @param fileType 文件类型
 * @returns 临时文件路径
 */
const saveTemporaryFile = async (
  data: ArrayBuffer,
  fileType: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 生成临时文件路径
    const tempFilePath = `${
      Taro.env.USER_DATA_PATH
    }/temp_${Date.now()}.${fileType}`;

    // 将ArrayBuffer写入文件
    Taro.getFileSystemManager().writeFile({
      filePath: tempFilePath,
      data,
      encoding: "binary",
      success: () => {
        resolve(tempFilePath);
      },
      fail: (error) => {
        console.error("写入临时文件失败:", error);
        reject(error);
      },
    });
  });
};

/**
 * 获取标准文件预览URL
 * @param fileId 文件ID
 * @returns 预览URL
 */
export async function getPreviewUrl(
  fileId: number
): Promise<{ url: string; filePath: string }> {
  try {
    // 显示加载提示
    Taro.showLoading({ title: "获取文件链接...", mask: true });

    // 请求文件预览接口
    const result = await request<any>({
      url: "/api/standardDownLoad/downLoad",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: `fileId=${fileId}&type=${FileOperationType.PREVIEW}`,
    });

    // 检查返回数据
    if (!result || !result.url) {
      Taro.showToast({
        title: "获取预览链接失败",
        icon: "none",
      });
      return { url: "", filePath: "" };
    }

    return result;
  } catch (error) {
    console.error("获取预览链接失败:", error);
    Taro.showToast({
      title: "获取预览链接失败",
      icon: "none",
    });
    return { url: "", filePath: "" };
  } finally {
    Taro.hideLoading();
  }
}

// 导出API
const fileApi = {
  previewStandardFile,
  downloadStandardFile,
  getPreviewUrl,
  FileOperationType,
};

export default fileApi;
