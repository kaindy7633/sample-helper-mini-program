import { defineConfig, type UserConfigExport } from "@tarojs/cli";

import devConfig from "./dev";
import prodConfig from "./prod";

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<"vite">(async (merge) => {
  const baseConfig: UserConfigExport<"vite"> = {
    projectName: "sample-helper-mini-program",
    date: "2025-3-26",
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: "src",
    outputRoot: "dist",
    plugins: [],
    defineConstants: {
      // 在打包时注入环境变量
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
    copy: {
      patterns: [],
      options: {},
    },
    framework: "react",
    compiler: "vite",
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {
            selectorBlackList: ["page"],
          },
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    h5: {
      publicPath: "/",
      staticDirectory: "static",

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: "css/[name].[hash].css",
        chunkFilename: "css/[name].[chunkhash].css",
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          },
        },
      },
    },
    rn: {
      appName: "taroDemo",
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        },
      },
    },
  };

  if (process.env.NODE_ENV === "development") {
    // 本地开发构建配置（不混淆压缩）
    const envConfig = devConfig as any;
    return merge({}, baseConfig, {
      ...devConfig,
      defineConstants: {
        ...baseConfig.defineConstants,
        "process.env.TARO_APP_API_BASE_URL": JSON.stringify(
          envConfig.env.API_BASE_URL
        ),
      },
    });
  }
  // 生产构建配置（默认开启压缩混淆等）
  const envConfig = prodConfig as any;
  return merge({}, baseConfig, {
    ...prodConfig,
    defineConstants: {
      ...baseConfig.defineConstants,
      "process.env.TARO_APP_API_BASE_URL": JSON.stringify(
        envConfig.env.API_BASE_URL
      ),
    },
  });
});
