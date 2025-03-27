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
    <View className="p-4 index">
      <View className="mb-4 text-lg font-bold text-center">
        {isLoggedIn
          ? `欢迎回来，${userInfo?.nickname || "用户"}`
          : "欢迎使用抽样助手小程序"}
      </View>

      <ExampleComponent title="组件示例" />
    </View>
  );
}
