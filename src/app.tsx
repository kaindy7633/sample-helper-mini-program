import { PropsWithChildren } from "react";
import { useLaunch } from "@tarojs/taro";
// 引入taroify组件库样式
import "@taroify/core/index.scss";

// 相对导入
import { UserProvider, AppProvider, getUserState, getAppState } from "./stores";
// 导入tailwind样式
import "./app.less";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");

    // 初始化全局状态
    const userState = getUserState();
    const appState = getAppState();

    // 如果需要在启动时进行一些初始化操作，可以在这里添加
    console.log("初始主题:", appState.theme);
  });

  // 使用 Context 提供全局状态
  return (
    <AppProvider>
      <UserProvider>{children}</UserProvider>
    </AppProvider>
  );
}

export default App;
