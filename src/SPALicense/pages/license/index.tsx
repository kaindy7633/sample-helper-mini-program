import React from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.less";
import styles from "./index.module.less";

/**
 * 企业证照查询页面组件
 * @returns {JSX.Element} 企业证照查询页面
 */
const LicensePage: React.FC = () => {
  /**
   * 打开外部链接的通用方法
   * @param url 外部链接URL
   * @param title 链接标题
   */
  const openExternalLink = (url: string, title: string) => {
    // 小程序中通过web-view打开外部链接
    Taro.navigateTo({
      url: `/SPALicense/pages/webview/index?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
    }).catch(() => {
      // 如果web-view页面不存在，则尝试复制链接
      Taro.setClipboardData({
        data: url,
        success: () => {
          Taro.showToast({
            title: "链接已复制，请在浏览器中打开",
            icon: "none",
          });
        },
      });
    });
  };

  /**
   * 处理食品生产许可获证企业信息查询点击
   */
  const handleFoodProductionLicenseClick = () => {
    const url = "https://spaqjg.e-cqs.cn/spscxk/";
    const title = "食品生产许可获证企业信息查询平台";
    openExternalLink(url, title);
  };

  /**
   * 处理天眼查点击
   */
  const handleTianYanChaClick = () => {
    const url = "https://www.tianyancha.com/";
    const title = "天眼查";
    openExternalLink(url, title);
  };

  /**
   * 处理信用中国点击
   */
  const handleCreditChinaClick = () => {
    const url = "https://www.creditchina.gov.cn/";
    const title = "信用中国";
    openExternalLink(url, title);
  };

  return (
    <View className="license-container">
      <View className="license-content">
        {/* 查许可 */}
        <View className="license-section">
          <Text className="section-title">查许可:</Text>
          <View
            className="query-item"
            onClick={handleFoodProductionLicenseClick}
          >
            <Text className="query-text">食品生产许可获证企业信息查询平台</Text>
          </View>
        </View>

        {/* 查营业执照 */}
        <View className="license-section">
          <Text className="section-title">查营业执照:</Text>
          <View className="query-item" onClick={handleTianYanChaClick}>
            <Text className="query-text">天眼查</Text>
          </View>

          <View className="query-item" onClick={handleCreditChinaClick}>
            <Text className="query-text">信用中国</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LicensePage;
