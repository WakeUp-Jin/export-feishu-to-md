/**
 * 飞书认证 API
 * 在初始化时一次性获取 tenant_access_token，后续复用
 */

import type { TenantAccessTokenResponse } from "../converter/types.ts";
import { logger } from "../utils/logger.ts";
import { apiCounter } from "./counter.ts";

/**
 * 获取 tenant_access_token（仅调用一次）
 */
export async function fetchTenantAccessToken(
  endpoint: string,
  appId: string,
  appSecret: string
): Promise<string> {
  const url = `${endpoint}/open-apis/auth/v3/tenant_access_token/internal`;
  logger.debug(`POST ${url}`);

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      app_id: appId,
      app_secret: appSecret,
    }),
  });

  apiCounter.increment("auth");

  if (!resp.ok) {
    throw new Error(
      `获取 tenant_access_token 失败: HTTP ${resp.status} ${resp.statusText}`
    );
  }

  const data = (await resp.json()) as TenantAccessTokenResponse;

  if (data.code !== 0) {
    throw new Error(
      `获取 tenant_access_token 失败: [${data.code}] ${data.msg}`
    );
  }

  return data.tenant_access_token;
}
