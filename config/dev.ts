import type { UserConfigExport } from "@tarojs/cli";

export default {
  /** 开发环境API配置 */
  env: {
    // API_BASE_URL: "http://172.18.142.38:9998",
    API_BASE_URL: "https://cloud.cyznzs.com",
  },
  mini: {},
  h5: {},
} satisfies UserConfigExport<"vite">;
