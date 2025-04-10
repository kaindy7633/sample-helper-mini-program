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
 * 根据名称识别食品分类
 * @param name 食品名称
 * @returns 食品分类信息
 */
export async function identifyFood(name: string): Promise<FoodClassInfo> {
  return request<FoodClassInfo>({
    url: `${API_PATHS.FOOD_CLASS.IDENTIFY_FOOD}?name=${encodeURIComponent(
      name
    )}`,
    method: "GET",
  });
}
