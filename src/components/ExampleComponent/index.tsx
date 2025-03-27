import React, { useState } from "react";
import { View } from "@tarojs/components";
import { Button, Cell, Switch } from "@taroify/core";
import { ArrowDown } from "@taroify/icons";
import Taro from "@tarojs/taro";

// 导入所需的样式
import "@taroify/core/button/style";
import "@taroify/core/toast/style";
import "@taroify/core/cell/style";
import "@taroify/core/switch/style";

import { useApp } from "../../stores";

import styles from "./index.module.less";

interface ExampleComponentProps {
  title?: string;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title = "示例组件",
}) => {
  // 使用 Context API 状态管理
  const { theme, setTheme } = useApp();
  const [isDarkMode, setIsDarkMode] = useState(theme === "dark");

  const showToast = (msg: string) => {
    Taro.showToast({
      title: msg,
      icon: "success",
      duration: 2000,
    });
  };

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    setTheme(checked ? "dark" : "light");
  };

  return (
    <View className={styles.container}>
      <Cell.Group inset title={title}>
        <Cell title="示例按钮">
          <Button
            color="primary"
            onClick={() => showToast("按钮点击成功")}
            className="mr-2"
          >
            主要按钮
          </Button>
        </Cell>

        <Cell title="图标示例">
          <ArrowDown />
        </Cell>

        <Cell title="暗黑模式">
          <Switch checked={isDarkMode} onChange={handleThemeChange} />
        </Cell>
      </Cell.Group>

      {/* 使用 TailwindCSS 样式 */}
      <View className="mt-4 p-4 bg-white rounded-lg shadow">
        <View className="text-lg font-bold text-primary mb-2">
          TailwindCSS 示例
        </View>
        <View className="text-sm text-text-secondary">
          这是使用 TailwindCSS 样式的示例文本
        </View>
        <Button color="success" size="small" className="mt-2">
          成功按钮
        </Button>
      </View>
    </View>
  );
};

export default ExampleComponent;
