import { useState, useEffect, useCallback } from "react";
import Taro from "@tarojs/taro";
import request from "../../../services/request";
import { API_PATHS } from "../../../services/config";

// 分类数据接口
export interface Category {
  id: string;
  problemTypeName: string;
  createTime?: string;
  updateTime?: string;
  delFlag?: number;
  orderNum?: number;
}

// 问题数据接口
export interface Question {
  id: string;
  title: string;
  content: string;
  categoryId: string;
}

/**
 * 获取分类列表的hook
 * @returns {Object} 分类列表数据和加载状态
 */
export const useCategoryList = () => {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // 调用问题类型列表接口
        const response = await request({
          url: API_PATHS.LEARN.COMMON_PROBLEM_TYPES,
          method: "GET",
        });

        if (response && Array.isArray(response)) {
          setCategoryList(response);
        } else {
          // 如果接口没有返回预期数据，使用默认数据
          setCategoryList([
            {
              id: "1",
              problemTypeName: "新国抽使用问题",
              createTime: "2025-03-04 15:44:19",
              updateTime: "2025-03-04 15:44:19",
              delFlag: 0,
              orderNum: 0,
            },
          ]);
        }
      } catch (error) {
        console.error("获取问题分类失败:", error);
        // 接口调用失败时使用默认数据
        setCategoryList([
          {
            id: "1",
            problemTypeName: "新国抽使用问题",
            createTime: "2025-03-04 15:44:19",
            updateTime: "2025-03-04 15:44:19",
            delFlag: 0,
            orderNum: 0,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categoryList, loading };
};

/**
 * 获取问题列表的hook
 * @param {string} categoryId 分类ID
 * @param {number} currentPage 当前页码
 * @returns {Object} 问题列表数据、加载状态和是否加载完成
 */
export const useQuestionList = (categoryId: string, currentPage: number) => {
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [finished, setFinished] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const pageSize = 5; // 每页显示5条数据

  /**
   * 获取问题列表数据
   * @param {number} page 页码
   * @param {boolean} isLoadMore 是否为加载更多
   */
  const fetchQuestions = useCallback(
    async (page: number, isLoadMore = false) => {
      try {
        setLoading(true);
        // 构建查询参数
        const params: Record<string, any> = {
          current: page,
          size: pageSize,
        };

        // 如果选择了特定分类，添加分类ID参数
        if (categoryId) {
          params.typeId = categoryId;
        }

        // 调用获取常见问题列表接口
        const response = await request({
          url: API_PATHS.LEARN.COMMON_PROBLEM,
          method: "GET",
          data: params,
        });

        if (response && response.records && Array.isArray(response.records)) {
          // 格式化问题数据
          const formattedQuestions = response.records.map((item) => ({
            id: item.id || String(Math.random()),
            title: item.problemName || "未命名问题",
            content: item.answer?.replace(/<\/?[^>]+(>|$)/g, "") || "暂无答案",
            categoryId: String(item.typeId || ""),
          }));

          // 更新列表数据
          setQuestionList((prev) =>
            isLoadMore ? [...prev, ...formattedQuestions] : formattedQuestions
          );

          // 更新总数
          setTotal(Number(response.total) || 0);

          // 判断是否还有更多数据
          setFinished(page * pageSize >= (Number(response.total) || 0));
        } else {
          if (!isLoadMore) {
            setQuestionList([]);
          }
          setFinished(true);
        }
      } catch (error) {
        console.error("获取问题列表失败:", error);
        if (!isLoadMore) {
          setQuestionList([]);
        }
        setFinished(true);
      } finally {
        setLoading(false);
      }
    },
    [categoryId, pageSize]
  );

  // 监听分类ID变化，重置列表
  useEffect(() => {
    setQuestionList([]);
    setFinished(false);
    fetchQuestions(1, false);
  }, [categoryId]);

  // 监听页码变化，加载更多数据
  useEffect(() => {
    if (currentPage > 1) {
      fetchQuestions(currentPage, true);
    }
  }, [currentPage]);

  /**
   * 刷新列表
   */
  const refresh = useCallback(async () => {
    setQuestionList([]);
    setFinished(false);
    await fetchQuestions(1, false);
  }, [fetchQuestions]);

  /**
   * 加载更多
   * @param {number} page 页码
   */
  const loadMore = useCallback(
    async (page: number) => {
      if (!finished && !loading) {
        await fetchQuestions(page, true);
      }
    },
    [fetchQuestions, finished, loading]
  );

  return {
    questionList,
    loading,
    finished,
    refresh,
    loadMore,
    total,
  };
};
