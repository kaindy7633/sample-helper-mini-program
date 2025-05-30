/**
 * 食品分类查询服务
 */
import request from "./request";
import { API_PATHS } from "./config";

/**
 * 历史搜索项接口
 */
export interface HistoryItem {
  id: string;
  searchName: string;
  searchUserId: string;
  createTime: string;
}

/**
 * 热门搜索项接口
 */
export interface HotItem {
  searchName: string;
  searchCount: number;
}

/**
 * 搜索项接口
 */
export interface SearchItemsResponse {
  history: HistoryItem[];
  hot: HotItem[];
}

/**
 * 食品样品信息
 */
export interface FoodSample {
  id: string;
  foodCategory: string;
  foodSubcategory: string;
  foodVariety: string;
  foodDetail: string;
  specialCategory: string | null;
  samplingLink: string;
  specification: string;
  minSampleQuantity: string;
  minSampleWeight: string;
  minBackupWeight: string;
  samplingMethod: string;
  remarks: string | null;
  commonConfusion: string | null;
  isDeleted: boolean;
  createTime: string;
  updateTime: string;
}

/**
 * 食品分类信息接口
 */
export interface FoodClassInfo {
  isOcrSame: boolean;
  memberStatus: number;
  memberTips: string;
  freeOcrTimes: number;
  remainOcrTimes: number | null;
  memberOver: boolean;
  message: string;
  resultCode: number;
  isSuccess: boolean;
  voList: Array<{
    sampleName: string;
    firstCategory: string;
    secondCategory: string;
    thirdCategory: string;
    fourthCategory: string;
    ratio: string;
    ratioNum: string;
    ratioTotal: string;
    byNum: string | null;
    cyNum: string | null;
    samplingMethod: string;
    ordinarySample: FoodSample[];
    special: any[];
    remark: string | null;
    confusable: string | null;
    specialType: string | null;
  }>;
  searchType: number;
}

/**
 * 获取搜索项（历史搜索和热门搜索）
 * @returns 搜索项数据
 */
export async function getSearchItems(): Promise<SearchItemsResponse> {
  return request<SearchItemsResponse>({
    url: API_PATHS.FOOD_CLASS.SEARCH_ITEMS,
    method: "GET",
  });
}

/**
 * 根据名称或条形码识别食品分类
 * @param query 食品名称或条形码查询参数
 * @returns 食品分类信息
 */
export async function identifyFood(query: string): Promise<FoodClassInfo> {
  // 判断是名称查询还是条形码查询
  const isBarCode = query.startsWith("barCode=");

  let url = `${API_PATHS.FOOD_CLASS.IDENTIFY_FOOD}?`;

  if (isBarCode) {
    // 条形码查询，query已经包含了barCode=xxx格式
    url += query;
  } else {
    // 名称查询
    url += `name=${encodeURIComponent(query)}`;
  }

  return request<FoodClassInfo>({
    url,
    method: "GET",
  });
}

/**
 * 删除历史搜索记录
 * @returns 删除结果
 */
export async function deleteSearchHistory(): Promise<any> {
  return request({
    url: "/api/app/center/deleteSearchHistory",
    method: "GET",
  });
}
