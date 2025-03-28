export default defineAppConfig({
  pages: [
    "pages/start/index",
    "pages/index/index",
    "pages/task/index",
    "pages/study/index",
    "pages/mine/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#3f7efd",
    navigationBarTitleText: "抽样助手",
    navigationBarTextStyle: "white",
  },
  tabBar: {
    color: "#646566",
    selectedColor: "#3f7efd",
    backgroundColor: "#ffffff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "应用",
        iconPath: "assets/images/home.png",
        selectedIconPath: "assets/images/home-active.png",
      },
      {
        pagePath: "pages/task/index",
        text: "任务",
        iconPath: "assets/images/task.png",
        selectedIconPath: "assets/images/task-active.png",
      },
      {
        pagePath: "pages/study/index",
        text: "学习",
        iconPath: "assets/images/study.png",
        selectedIconPath: "assets/images/study-active.png",
      },
      {
        pagePath: "pages/mine/index",
        text: "我的",
        iconPath: "assets/images/mine.png",
        selectedIconPath: "assets/images/mine-active.png",
      },
    ],
  },
});
