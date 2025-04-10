/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from "react";
import { View, Text, Input } from "@tarojs/components";
import { Picker, Button, Popup, Toast } from "@taroify/core";
import "@taroify/core/cell/style";
import "@taroify/core/picker/style";
import "@taroify/core/field/style";
import "@taroify/core/button/style";
import "@taroify/core/popup/style";
import "@taroify/core/toast/style";
import { Search, ArrowDown, Replay, Location, Aim } from "@taroify/icons";
import "@taroify/icons/style";
import Taro from "@tarojs/taro";

/**
 * 查场所标签页组件
 * @returns {JSX.Element} 查场所标签页
 */
const PlaceTab: React.FC = (): JSX.Element => {
  // 当前选择的位置
  const [location, setLocation] = useState<string>("请选择位置");
  // 位置坐标
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  // 定位状态
  const [locating, setLocating] = useState<boolean>(false);
  // Toast状态
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "loading" as "loading" | "success" | "fail",
  });

  // 搜索关键词
  const [keyword, setKeyword] = useState<string>("");

  // 距离优先选项
  const [distancePriority, setDistancePriority] = useState<string>("距离优先");
  const [distancePriorityOpen, setDistancePriorityOpen] =
    useState<boolean>(false);
  const distancePriorityOptions = ["距离优先", "数量优先"];

  // 企业类型选项
  const [companyType, setCompanyType] = useState<string>("企业类型");
  const [companyTypeOpen, setCompanyTypeOpen] = useState<boolean>(false);
  const companyTypeOptions = ["生产企业", "流通企业", "餐饮企业"];

  // 处理搜索
  const handleSearch = () => {
    console.log("搜索场所:", keyword);
    // 这里应该调用API
  };

  // 重置筛选条件
  const handleReset = () => {
    setDistancePriority("距离优先");
    setCompanyType("企业类型");
  };

  /**
   * 获取用户位置
   */
  const getLocation = async () => {
    setLocating(true);
    showToast("loading", "定位中...");

    try {
      // 检查权限状态
      const authSetting = await Taro.getSetting();

      // 如果用户未授权，则主动请求授权
      if (!authSetting.authSetting["scope.userLocation"]) {
        try {
          const authRes = await Taro.authorize({
            scope: "scope.userLocation",
          });
          console.log("授权成功:", authRes);
        } catch (authError) {
          console.error("用户拒绝授权:", authError);
          handleLocationError(authError);
          setLocating(false);
          return;
        }
      }

      // 获取当前位置（高精度）
      const res = await Taro.getLocation({
        type: "gcj02",
        isHighAccuracy: true,
        highAccuracyExpireTime: 3000,
      });

      setCoordinates({
        latitude: res.latitude,
        longitude: res.longitude,
      });

      // 获取位置名称
      const addressRes = await getAddressFromLocation(
        res.latitude,
        res.longitude
      );
      setLocation(addressRes || "已获取位置");
      showToast("success", "定位成功");

      // 缓存位置信息
      Taro.setStorageSync("lastLocation", {
        latitude: res.latitude,
        longitude: res.longitude,
        address: addressRes,
      });
    } catch (error) {
      console.error("定位失败:", error);
      handleLocationError(error);
    } finally {
      setLocating(false);
    }
  };

  /**
   * 根据坐标获取地址名称
   * @param latitude 纬度
   * @param longitude 经度
   */
  const getAddressFromLocation = async (
    latitude: number,
    longitude: number
  ): Promise<string | null> => {
    try {
      // 实际项目中应该调用腾讯地图、高德地图等API获取详细地址
      // 由于目前没有集成地图API，我们可以尝试使用微信的逆地址解析API

      try {
        // 调用微信小程序的逆地址解析API
        const result = await Taro.request({
          url: "https://apis.map.qq.com/ws/geocoder/v1/",
          data: {
            location: `${latitude},${longitude}`,
            key: "IMRBZ-Q7JWU-JVLVP-2JBCH-RDKTV-VXB4K", // 这是一个示例key，实际使用时请替换为正确的key
          },
        });

        if (result.statusCode === 200 && result.data && result.data.result) {
          // 根据实际返回结构进行提取
          return result.data.result.address || "未知地点";
        }
      } catch (apiError) {
        console.log("逆地址解析失败:", apiError);
        // 如果API调用失败，回退到显示坐标
      }

      // 如果上面的API调用失败，则返回坐标信息
      return `位置(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    } catch (error) {
      console.error("获取地址信息失败:", error);
      return "未知位置";
    }
  };

  /**
   * 处理定位错误
   */
  const handleLocationError = (error: any) => {
    // 隐藏加载提示
    setToast((prev) => ({ ...prev, open: false }));

    // 根据错误类型显示不同提示
    if (
      error.errMsg &&
      (error.errMsg.includes("auth deny") ||
        error.errMsg.includes("authorize:fail"))
    ) {
      showToast("fail", "位置权限被拒绝");
      setTimeout(() => {
        Taro.showModal({
          title: "权限提示",
          content: "需要位置权限才能继续使用，是否去设置开启权限？",
          success: (res) => {
            if (res.confirm) {
              Taro.openSetting({
                success(settingRes) {
                  console.log("设置结果:", settingRes);
                  if (settingRes.authSetting["scope.userLocation"]) {
                    getLocation(); // 用户在设置页面打开了权限，重新获取位置
                  }
                },
              });
            }
          },
        });
      }, 1500);
    } else if (error.errMsg && error.errMsg.includes("getLocation:fail")) {
      showToast("fail", "获取位置失败");
    } else {
      showToast("fail", "定位失败，请重试");
    }
  };

  /**
   * 显示Toast提示
   */
  const showToast = (type: "loading" | "success" | "fail", message: string) => {
    setToast({
      open: true,
      type,
      message,
    });

    // 自动关闭(loading类型不自动关闭)
    if (type !== "loading") {
      setTimeout(() => {
        setToast((prev) => ({ ...prev, open: false }));
      }, 2000);
    }
  };

  /**
   * 重新定位
   */
  const handleRelocate = () => {
    if (!locating) {
      getLocation();
    }
  };

  /**
   * 组件挂载时自动获取位置
   */
  useEffect(() => {
    // 尝试从缓存获取上次位置
    const cachedLocation = Taro.getStorageSync("lastLocation");
    if (cachedLocation) {
      setCoordinates({
        latitude: cachedLocation.latitude,
        longitude: cachedLocation.longitude,
      });
      if (cachedLocation.address) {
        setLocation(cachedLocation.address);
      } else {
        // 如果缓存中没有地址，但有坐标，尝试重新获取地址
        getAddressFromLocation(
          cachedLocation.latitude,
          cachedLocation.longitude
        )
          .then((address) => {
            if (address) setLocation(address);
          })
          .catch(console.error);
      }
    }

    // 获取新的位置
    getLocation();
  }, []);

  return (
    <View className="place-tab">
      {/* 位置选择 */}
      <View className="location-section">
        <View className="location-button">
          <View className="location-icon-wrapper">
            <Location color="#1C71FB" size="24" />
          </View>
          <Text className="location-text">{location}</Text>
        </View>
        <View className="location-divider"></View>
        <View className="refresh-button" onClick={handleRelocate}>
          <Text className="refresh-text">重新定位</Text>
          <Aim />
        </View>
      </View>

      {/* 搜索框 */}
      <View className="search-section">
        <View className="search-box">
          <Search size="24" />
          <Input
            className="search-input"
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            placeholder="输入场所名称/营业执照号/社会信用代码"
          />
        </View>
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={handleSearch}
        >
          搜索
        </Button>
      </View>

      {/* 筛选条件 */}
      <View className="filter-section">
        <View className="filter-left">
          <View
            className="filter-item"
            onClick={() => setDistancePriorityOpen(true)}
          >
            <Text>{distancePriority}</Text>
            <ArrowDown />
          </View>
          <View
            className="filter-item"
            onClick={() => setCompanyTypeOpen(true)}
          >
            <Text>{companyType}</Text>
            <ArrowDown />
          </View>
        </View>
        <View className="filter-divider"></View>
        <View className="reset-button" onClick={handleReset}>
          <Replay size="18" />
          <Text>重置</Text>
        </View>
      </View>

      {/* 搜索结果列表 - 这里先放置一个占位 */}
      <View className="result-list">
        {/* 如果这里有数据，可以遍历渲染列表项 */}
        {/* 这里暂时留白，后续可以根据API返回数据进行填充 */}
      </View>

      {/* 距离优先选择弹窗 */}
      <Popup
        open={distancePriorityOpen}
        rounded
        placement="bottom"
        onClose={() => setDistancePriorityOpen(false)}
      >
        <Picker
          onCancel={() => setDistancePriorityOpen(false)}
          onConfirm={(val) => {
            setDistancePriority(val.toString());
            setDistancePriorityOpen(false);
          }}
          value={distancePriority}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>请选择</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            {distancePriorityOptions.map((option) => (
              <Picker.Option key={option} value={option}>
                {option}
              </Picker.Option>
            ))}
          </Picker.Column>
        </Picker>
      </Popup>

      {/* 企业类型选择弹窗 */}
      <Popup
        open={companyTypeOpen}
        rounded
        placement="bottom"
        onClose={() => setCompanyTypeOpen(false)}
      >
        <Picker
          onCancel={() => setCompanyTypeOpen(false)}
          onConfirm={(val) => {
            setCompanyType(val.toString());
            setCompanyTypeOpen(false);
          }}
          value={companyType}
        >
          <Picker.Toolbar>
            <Picker.Button>取消</Picker.Button>
            <Picker.Title>请选择</Picker.Title>
            <Picker.Button>确认</Picker.Button>
          </Picker.Toolbar>
          <Picker.Column>
            {companyTypeOptions.map((option) => (
              <Picker.Option key={option} value={option}>
                {option}
              </Picker.Option>
            ))}
          </Picker.Column>
        </Picker>
      </Popup>

      {/* Toast 提示 */}
      <Toast
        open={toast.open}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      >
        {toast.message}
      </Toast>
    </View>
  );
};

export default PlaceTab;
