/**
 * 任务相关服务
 */
import request from "./request";
import { API_PATHS } from "./config";

/**
 * 任务详情接口
 */
export interface TaskDetail {
  /** ID */
  id: number;
  /** 抽检监测类别 */
  classA: string;
  /** 抽检计划名称 */
  classB: string;
  /** 食品大类 */
  cate1: string;
  /** 食品具体类型 */
  cate4: string;
  /** 是否完成 0-未完成 1-已完成 */
  isFinish: string;
  /** 抽样人员 */
  sampleTeam: string;
  /** 抽样人员ID */
  sampleTeamId: string | null;
  /** 批次 */
  batch: string;
  /** 已使用批次 */
  useBatch: number;
  /** 创建用户ID */
  createUserId: number;
  /** 创建用户名 */
  createUserName: string;
  /** 抽样环节 */
  sampleLink: string;
  /** 创建日期 */
  createDate: string;
  /** 完成日期 */
  finishDate: string | null;
  /** 组织ID */
  orgId: number;
  /** HNY ID */
  hnyId: string;
  /** 抽样单编号 */
  sampleNo: string;
  /** 计划任务代码ID */
  planTaskCodeId: string | null;
  /** 食品类别列表 */
  cateList: {
    /** 食品大类 */
    cate1: string;
    /** 食品亚类 */
    cate2: string;
    /** 食品属性 */
    cate3: string;
    /** 具体食品 */
    cate4: string;
  };
}

/**
 * 任务查询参数
 */
export interface TaskQueryParams {
  /** 当前页码 */
  current?: number;
  /** 每页大小 */
  size?: number;
  /** 抽检监测类别 */
  classa?: string;
  /** 抽检计划名称 */
  classb?: string;
  /** 是否完成 0-未完成 1-已完成 */
  isFinish?: string;
  /** 搜索关键词(食品大类) */
  keyword?: string;
}

/**
 * 分页响应结构
 */
export interface PaginatedResponse<T> {
  /** 记录列表 */
  records: T[];
  /** 总记录数 */
  total: string;
  /** 每页大小 */
  size: string;
  /** 当前页码 */
  current: string;
  /** 总页数 */
  pages: string;
}

/**
 * 获取任务列表
 * @param params 查询参数
 * @returns 任务列表分页数据
 */
export async function getPlanTasks(params: TaskQueryParams) {
  return request<PaginatedResponse<TaskDetail>>({
    url: API_PATHS.TASK.PLAN_TASKS,
    method: "GET",
    data: params,
    showLoading: true,
    loadingText: "加载中...",
  });
}

/**
 * 完成任务
 * @param taskId 任务ID
 * @returns 操作结果
 */
export async function completeTask(taskId: string) {
  return request<boolean>({
    url: `${API_PATHS.TASK.COMPLETE_TASK}/${taskId}`,
    method: "POST",
    showLoading: true,
    loadingText: "处理中...",
  });
}

/**
 * 取消任务
 * @param taskId 任务ID
 * @returns 操作结果
 */
export async function cancelTask(taskId: string) {
  return request<boolean>({
    url: `${API_PATHS.TASK.CANCEL_TASK}/${taskId}`,
    method: "POST",
    showLoading: true,
    loadingText: "处理中...",
  });
}

/**
 * 分类树节点接口
 */
export interface ClassTreeNode {
  /** 分类名称 */
  name: string;
  /** 子分类节点 */
  children: ClassTreeNode[] | null;
}

/**
 * 获取分类树数据
 * @returns 分类树数据
 */
export async function getClassTree() {
  return request<ClassTreeNode[]>({
    url: API_PATHS.TASK.LIST_CLASS_TREE,
    method: "GET",
    showLoading: true,
    loadingText: "加载中...",
  });
}
