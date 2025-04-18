import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import Taro, { usePullDownRefresh } from "@tarojs/taro";
import { List, PullRefresh, Loading, Empty } from "@taroify/core";
import "./index.less";

interface CourseItem {
  id: string;
  title: string;
  cover: string;
  level: string;
  range: string;
}

const PAGE_SIZE = 10;

const CourseCenter: React.FC = () => {
  const [list, setList] = useState<CourseItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 获取课程列表
  const fetchCourseList = useCallback(
    async (isRefresh = false) => {
      if (loading) return;
      setLoading(true);
      if (isRefresh) setInitialLoading(true);
      try {
        const res = await Taro.request({
          url: "https://mp.fscelearning.com/api/public/homePage/promoteCourseV2",
          method: "GET",
          header: { Authorization: "" },
          data: {
            page: isRefresh ? 1 : page,
            size: PAGE_SIZE,
          },
        });
        const data = res.data?.data || {};
        const records = data.records || [];
        const total = data.total || 0;
        const newList = records.map((item: any) => ({
          id: String(item.id),
          title: item.title,
          cover: item.cover,
          level: item.levelName,
          range: item.rangeName,
        }));
        if (isRefresh) {
          setList(newList);
          setPage(2);
        } else {
          setList((prev) => [...prev, ...newList]);
          setPage((prev) => prev + 1);
        }
        setHasMore(
          (isRefresh ? newList.length : list.length + newList.length) < total
        );
      } catch (e) {
        Taro.showToast({ title: "获取课程失败", icon: "none" });
      } finally {
        setLoading(false);
        setRefreshing(false);
        setInitialLoading(false);
      }
    },
    [loading, page, list.length]
  );

  // 初始加载
  useEffect(() => {
    fetchCourseList(true);
  }, [fetchCourseList]);

  // 下拉刷新
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourseList(true);
    setRefreshing(false);
  };

  usePullDownRefresh(onRefresh);

  // 滚动加载
  const onLoadMore = () => {
    if (!loading && hasMore) {
      fetchCourseList(false);
    }
  };

  return (
    <View className="course-center-container">
      <PullRefresh loading={refreshing} onRefresh={onRefresh}>
        <List
          loading={loading && !initialLoading}
          hasMore={hasMore}
          onLoad={onLoadMore}
        >
          <View className="course-list">
            {initialLoading ? (
              <View className="course-skeleton-list">
                {[1, 2, 3, 4, 5].map((i) => (
                  <View className="course-skeleton-item" key={i} />
                ))}
              </View>
            ) : list.length > 0 ? (
              list.map((item) => (
                <View className="course-item" key={item.id}>
                  <Image
                    className="course-cover"
                    src={item.cover}
                    mode="aspectFill"
                  />
                  <View className="course-info">
                    <View className="course-title">{item.title}</View>
                    <View className="course-meta">
                      <Text className="course-level">{item.level}</Text>
                      <Text className="course-range">
                        适用范围：{item.range}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Empty>
                <Empty.Image />
                <Empty.Description>暂无课程</Empty.Description>
              </Empty>
            )}
          </View>
          <List.Placeholder>
            {loading && !initialLoading && (
              <Loading className="list-loading">加载中...</Loading>
            )}
            {!loading && !hasMore && list.length > 0 && (
              <View className="list-finished">没有更多课程了</View>
            )}
          </List.Placeholder>
        </List>
      </PullRefresh>
    </View>
  );
};

export default CourseCenter;
