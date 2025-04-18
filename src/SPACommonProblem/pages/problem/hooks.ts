import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import request from "../../../services/request";
import { API_PATHS } from "../../../services/config";

// 分类数据接口
export interface Category {
  id: string;
  name: string;
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
          // 处理接口返回的数据
          const formattedCategories = [
            { id: "0", name: "全部" }, // 添加"全部"选项
            ...response.map((item) => ({
              id:
                String(item.id) || String(item.typeId) || String(Math.random()),
              name: item.typeName || "未命名分类",
            })),
          ];
          setCategoryList(formattedCategories);
        } else {
          // 如果接口没有返回预期数据，使用默认数据
          setCategoryList([
            { id: "0", name: "全部" },
            { id: "1", name: "新国抽使用问题" },
            { id: "2", name: "农产品抽检" },
            { id: "3", name: "食品安全问题" },
          ]);
        }
      } catch (error) {
        console.error("获取问题分类失败:", error);
        // 接口调用失败时使用默认数据
        setCategoryList([
          { id: "0", name: "全部" },
          { id: "1", name: "新国抽使用问题" },
          { id: "2", name: "农产品抽检" },
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
 * @returns {Object} 问题列表数据、加载状态和是否加载完成
 */
export const useQuestionList = (categoryId: string) => {
  const [questionList, setQuestionList] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [finished, setFinished] = useState<boolean>(false);
  const [pageSize] = useState<number>(20);

  useEffect(() => {
    // 重置状态
    setQuestionList([]);
    setLoading(true);
    setFinished(false);

    const fetchQuestions = async () => {
      try {
        // 构建查询参数
        const params: Record<string, any> = {
          current: 1,
          size: pageSize,
        };

        // 如果选择了特定分类，添加分类ID参数
        if (categoryId !== "0") {
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
            categoryId: String(item.typeId || "0"),
          }));

          setQuestionList(formattedQuestions);

          // 判断是否还有更多数据
          const total = Number(response.total) || 0;
          setFinished(total <= pageSize);
        } else {
          setQuestionList([]);
          setFinished(true);
        }
      } catch (error) {
        console.error("获取问题列表失败:", error);
        setQuestionList([]);
        setFinished(true);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [categoryId, pageSize]);

  return { questionList, loading, finished };
};
