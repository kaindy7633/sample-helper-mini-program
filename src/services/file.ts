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

    // 请求文件预览接口
    const result = await request<any>({
      url: "/api/standardDownLoad/downLoad",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: `fileId=${fileId}&type=${FileOperationType.PREVIEW}`,
    });

    console.log("文件预览接口响应:", result);

    // 检查业务状态码
    if (!result || !result.url) {
      Taro.showToast({
        title: "获取文件链接失败",
        icon: "none",
      });
      return;
    }

    // 使用返回的URL直接预览
    const fileUrl = result.url;

    // 使用Taro提供的方法打开网页预览PDF
    Taro.showLoading({ title: "正在打开文件...", mask: true });
    await Taro.downloadFile({
      url: fileUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          Taro.openDocument({
            filePath: res.tempFilePath,
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
        } else {
          Taro.showToast({
            title: "文件下载失败",
            icon: "none",
          });
        }
      },
      fail: (error) => {
        console.error("下载文件失败:", error);
        Taro.showToast({
          title: "文件下载失败",
          icon: "none",
        });
      },
      complete: () => {
        Taro.hideLoading();
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

    // 请求文件下载接口
    const result = await request<any>({
      url: "/api/standardDownLoad/downLoad",
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: `fileId=${fileId}&type=${FileOperationType.DOWNLOAD}`,
    });

    console.log("文件下载接口响应:", result);

    // 检查返回数据
    if (!result || !result.url) {
      Taro.showToast({
        title: "获取文件链接失败",
        icon: "none",
      });
      return;
    }

    // 使用返回的URL直接下载
    const fileUrl = result.url;

    // 使用Taro的文件下载和保存功能
    Taro.downloadFile({
      url: fileUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          Taro.saveFile({
            tempFilePath: res.tempFilePath,
            success: (saveRes) => {
              const savedFilePath = saveRes.savedFilePath;
              console.log("文件已保存:", savedFilePath);
              Taro.showToast({
                title: "下载成功",
                icon: "success",
              });
            },
            fail: (error) => {
              console.error("保存文件失败:", error);
              Taro.showToast({
                title: "文件保存失败",
                icon: "none",
              });
            },
          });
        } else {
          Taro.showToast({
            title: "文件下载失败",
            icon: "none",
          });
        }
      },
      fail: (error) => {
        console.error("下载文件失败:", error);
        Taro.showToast({
          title: "文件下载失败",
          icon: "none",
        });
      },
    });
  } catch (error) {
    console.error("下载文件失败:", error);
    Taro.showToast({
      title: "文件下载失败",
      icon: "none",
    });
  } finally {
    Taro.hideLoading();
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

// 导出API
const fileApi = {
  previewStandardFile,
  downloadStandardFile,
  FileOperationType,
};

export default fileApi;
