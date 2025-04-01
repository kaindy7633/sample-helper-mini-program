export default defineAppConfig({
  pages: [
    "pages/start/index",
    "pages/login/index",
    "pages/index/index",
    "pages/task/index",
    "pages/study/index",
    "pages/mine/index",
    "pages/agreement/index",
    "pages/privacy/index",
    "pages/message/index",
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
        pagePath: "pages/task/index",
        text: "任务",
        iconPath: "assets/images/tabbar/tab_task.png",
        selectedIconPath: "assets/images/tabbar/tab_task_active.png",
      },
      {
        pagePath: "pages/study/index",
        text: "学习",
        iconPath: "assets/images/tabbar/tab_app.png",
        selectedIconPath: "assets/images/tabbar/tab_app_active.png",
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "assets/images/tabbar/tab_mine.png",
        selectedIconPath: "assets/images/tabbar/tab_mine_active.png",
      },
    ],
  },
});
