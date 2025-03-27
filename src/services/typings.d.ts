/**
 * API 类型定义
 */
declare namespace API {
  /** 登录参数 */
  interface LoginParams {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  }

  /** 登录结果 */
  interface LoginResult {
    /** 用户token */
    token: string;
    /** 用户id */
    userId: string;
  }

  /** 用户信息 */
  interface UserInfo {
    /** 用户ID */
    id: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 头像 */
    avatar: string;
    /** 手机号 */
    phone?: string;
    /** 邮箱 */
    email?: string;
    /** 创建时间 */
    createTime: string;
  }

  /** 分页参数 */
  interface PageParams {
    /** 当前页码 */
    current: number;
    /** 每页条数 */
    pageSize: number;
  }

  /** 分页结果 */
  interface PageResult<T> {
    /** 数据列表 */
    list: T[];
    /** 总数 */
    total: number;
    /** 当前页码 */
    current: number;
    /** 每页条数 */
    pageSize: number;
  }
}
