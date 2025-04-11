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
  // 学习模块
  LEARN: {
    // 常见问题列表
    COMMON_PROBLEM: "/api/learnPublish/commonProblem/pageList",
  },
  // 食品分类查询
  FOOD_CLASS: {
    // 获取搜索项
    SEARCH_ITEMS: "/api/app/center/searchItem",
    // 识别食品
    IDENTIFY_FOOD: "/api/app/center/identify",
  },
  // 任务管理
  TASK: {
    // 获取任务列表
    PLAN_TASKS: "/planTask/detailPage",
    // 完成任务
    COMPLETE_TASK: "/planTask/complete",
    // 取消任务
    CANCEL_TASK: "/planTask/cancel",
  },
};
