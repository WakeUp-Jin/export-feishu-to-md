/**
 * 配置管理
 * 支持环境变量和 CLI 参数两种配置方式
 */

export interface AppConfig {
  /** 飞书应用 App ID */
  appId: string;
  /** 飞书应用 App Secret */
  appSecret: string;
  /** 飞书 API 端点 */
  endpoint: string;
  /** 输出目录 */
  outputDir: string;
}

/**
 * 从环境变量和 CLI 参数合并配置
 * CLI 参数优先级高于环境变量
 */
export function resolveConfig(cliOptions: Partial<AppConfig>): AppConfig {
  const config: AppConfig = {
    appId: cliOptions.appId || process.env.FEISHU_APP_ID || "",
    appSecret: cliOptions.appSecret || process.env.FEISHU_APP_SECRET || "",
    endpoint:
      cliOptions.endpoint ||
      process.env.FEISHU_ENDPOINT ||
      "https://open.feishu.cn",
    outputDir: cliOptions.outputDir || process.env.OUTPUT_DIR || "./output",
  };

  return config;
}

/**
 * 校验必要配置是否存在
 */
export function validateConfig(config: AppConfig): string[] {
  const errors: string[] = [];

  if (!config.appId) {
    errors.push(
      "缺少 App ID，请通过 --app-id 参数或 FEISHU_APP_ID 环境变量提供"
    );
  }

  if (!config.appSecret) {
    errors.push(
      "缺少 App Secret，请通过 --app-secret 参数或 FEISHU_APP_SECRET 环境变量提供"
    );
  }

  return errors;
}
