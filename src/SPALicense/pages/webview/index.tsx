import React, { useEffect, useState } from "react";
import { WebView } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";

/**
 * WebView页面，用于打开外部链接
 * @returns {JSX.Element} WebView页面
 */
const WebViewPage: React.FC = () => {
  const router = useRouter();
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const { url: routerUrl, title } = router.params;

    if (routerUrl) {
      setUrl(decodeURIComponent(routerUrl));

      // 如果有标题，设置导航栏标题
      if (title) {
        Taro.setNavigationBarTitle({
          title: decodeURIComponent(title),
        });
      }
    } else {
      Taro.showToast({
        title: "链接无效",
        icon: "none",
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    }
  }, [router.params]);

  return <>{url && <WebView src={url} />}</>;
};

export default WebViewPage;
