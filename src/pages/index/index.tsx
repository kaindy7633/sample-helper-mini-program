import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import ExampleComponent from "../../components/ExampleComponent";
import { useUser } from "../../stores";
import "./index.less";

export default function Index() {
  // 使用 Context API 状态管理
  const { userInfo, isLoggedIn } = useUser();

  useLoad(() => {
    console.log("Page loaded.");
  });

  return (
    <View className="index">
      <View className="welcome">
        {isLoggedIn
          ? `欢迎回来，${userInfo?.nickname || "用户"}`
          : "欢迎使用抽样助手小程序"}
      </View>

      <View className="hello">Hello world!</View>

      <ExampleComponent title="组件示例" />
    </View>
  );
}
