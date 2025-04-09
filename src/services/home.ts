/**
 * 首页相关接口
 */
import request from "./request";
import { API_PATHS } from "./config";

/**
 * 天气信息
 */
export interface WeatherData {
  location: string;
  toDayWeather: string;
  temperature: string;
  weatherIcon: string;
}

/**
 * 首页数据
 */
export interface FrontPageData {
  weather: WeatherData;
  chickenSoupContent: string;
  resourceList?: Record<string, any>[];
}

/**
 * 轮播图数据
 */
export interface SampleMessage {
  id: string;
  resourceName: string;
  resourceUrl: string;
  detailUrl: string | null;
}

/**
 * 获取首页数据
 */
export function getFrontPageData() {
  return request<FrontPageData>({
    url: API_PATHS.HOME.FRONT_PAGE,
    method: "GET",
  });
}

/**
 * 获取轮播图数据
 */
export function getSampleMessages() {
  return request<SampleMessage[]>({
    url: API_PATHS.HOME.SAMPLE_MESSAGE,
    method: "GET",
  });
}
