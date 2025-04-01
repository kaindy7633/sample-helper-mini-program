/**
 * 全局配置
 */

// 登录系统接口域名
export const LOGIN_API_BASE_URL = "https://login.ejclims.com";

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
    LOGIN: "/service/external/getUserByNamePwdLims",
  },
  // 首页
  HOME: {
    // 首页数据
    FRONT_PAGE: "/api/app/consumer/frontPage",
    // 待确认消息
    SAMPLE_MESSAGE: "/api/sampleMessage/toBeConfirmedCount",
  },
};
