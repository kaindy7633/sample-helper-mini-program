export default defineAppConfig({
  pages: ["pages/index/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#3f7efd",
    navigationBarTitleText: "抽样助手",
    navigationBarTextStyle: "white",
  },
  // 全局配置 TabBar 请取消下面注释
  // tabBar: {
  //   color: "#646566",
  //   selectedColor: "#3f7efd",
  //   backgroundColor: "#ffffff",
  //   list: [
  //     {
  //       pagePath: "pages/index/index",
  //       text: "首页",
  //       iconPath: "assets/images/home.png",
  //       selectedIconPath: "assets/images/home-active.png"
  //     },
  //     {
  //       pagePath: "pages/index/index",
  //       text: "我的",
  //       iconPath: "assets/images/user.png",
  //       selectedIconPath: "assets/images/user-active.png"
  //     }
  //   ]
  // }
});
