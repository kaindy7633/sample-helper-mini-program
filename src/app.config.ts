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
});
