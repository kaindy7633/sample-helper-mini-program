/**
 * 全局配置
 */

// 业务系统接口域名
export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.TARO_APP_API_BASE_URL || "http://172.18.142.38:9998"
    : "https://cloud.cyznzs.com";

/**
 * 接口路径
 */
export const API_PATHS = {
  // 用户
  USER: {
    LOGIN: "/api/auth/login",
  },
  // 首页
  HOME: {
    // 首页数据
    FRONT_PAGE: "/api/app/consumer/frontPage",
    // 待确认消息
    SAMPLE_MESSAGE: "/api/app/center/latestNews",
  },
  // 应用
  APP: {
    // 获取应用菜单
    GET_APP_MENU: "/api/app/consumer/getAppMenu",
  },
  // 轮播图
  BANNER: {
    // 获取轮播图数据
    GET_EXCHANGE_DETAILS:
      "/api/smartCoinsManagement/exchange/appExchangeDetails",
  },
};
