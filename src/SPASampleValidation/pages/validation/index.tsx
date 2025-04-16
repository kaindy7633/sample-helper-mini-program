import Taro from "@tarojs/taro";
import { useEffect } from "react";

/**
 * 抽样单验证页重定向组件
 * 将原来的首页移动到了list文件夹，此组件用于重定向
 */
const ValidationPageRedirect = () => {
  useEffect(() => {
    // 立即重定向到列表页面
    Taro.redirectTo({
      url: "/SPASampleValidation/pages/validation/list/index",
    });
  }, []);

  return null;
};

export default ValidationPageRedirect;
