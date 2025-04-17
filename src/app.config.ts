export default defineAppConfig({
  pages: [
    "SPAStartPage/pages/start/index",
    "pages/index/index",
    "SPATask/pages/task/index",
    "SPAStudy/pages/study/index",
    "SPAMine/pages/mine/index",
  ],
  subPackages: [
    // 登录模块分包
    {
      root: "SPALogin",
      name: "subpackage-login",
      pages: ["pages/login/index"],
    },
    // 协议模块分包
    {
      root: "SPAProtocol",
      name: "subpackage-protocol",
      pages: ["pages/agreement/index", "pages/privacy/index"],
    },
    // 消息中心分包
    {
      root: "SPAMessage",
      name: "subpackage-message",
      pages: ["pages/message/index"],
    },
    // 抽样重复查询分包
    {
      root: "SPASampling",
      name: "subpackage-sampling",
      pages: ["pages/sampling/index"],
    },
    // 食品分类查询分包
    {
      root: "SPAFoodClass",
      name: "subpackage-foodclass",
      pages: [
        "pages/foodclass/index",
        "pages/fooddetail/index",
        "pages/samplingmethod/index",
      ],
    },
    // 标法查询分包
    {
      root: "SPAStandard",
      name: "subpackage-standard",
      pages: ["pages/standard/index"],
    },
    // 抽样单验证分包
    {
      root: "SPASampleValidation",
      name: "subpackage-validation",
      pages: [
        "pages/validation/index",
        "pages/validation/list/index",
        "pages/validation/details/index",
      ],
    },
    // 企业证照查询分包
    {
      root: "SPALicense",
      name: "subpackage-license",
      pages: ["pages/license/index", "pages/webview/index"],
    },
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#3f7efd",
    navigationBarTitleText: "抽样助手",
    navigationBarTextStyle: "white",
    backgroundColor: "#F8F8F8",
  },
  tabBar: {
    color: "#646566",
    selectedColor: "#3f7efd",
    backgroundColor: "#ffffff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "应用",
        iconPath: "assets/images/tabbar/tab_home.png",
        selectedIconPath: "assets/images/tabbar/tab_home_active.png",
      },
      {
        pagePath: "SPATask/pages/task/index",
        text: "任务",
        iconPath: "assets/images/tabbar/tab_task.png",
        selectedIconPath: "assets/images/tabbar/tab_task_active.png",
      },
      {
        pagePath: "SPAStudy/pages/study/index",
        text: "学习",
        iconPath: "assets/images/tabbar/tab_app.png",
        selectedIconPath: "assets/images/tabbar/tab_app_active.png",
      },
      {
        pagePath: "SPAMine/pages/mine/index",
        text: "我的",
        iconPath: "assets/images/tabbar/tab_mine.png",
        selectedIconPath: "assets/images/tabbar/tab_mine_active.png",
      },
    ],
  },
  // 申请获取位置信息权限
  requiredPrivateInfos: ["getLocation"],
  // 详细描述位置权限
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于获取附近的场所信息",
    },
  },
  // 启用组件按需注入
  lazyCodeLoading: "requiredComponents",
});
