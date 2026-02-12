/**
 * 飞书文档 API
 * 获取文档信息和文档块
 *
 * 所有函数直接接收 accessToken，不再内部调用认证 API
 */

import type {
  Block,
  DocumentBlocksResponse,
  DocumentInfo,
  FeishuApiResponse,
  WikiNodeInfo,
} from "../converter/types.ts";
import { logger } from "../utils/logger.ts";
import { apiCounter } from "./counter.ts";

/**
 * 飞书 API 请求的速率限制延迟（ms）
 * 飞书 API 限制每分钟 100 次请求
 */
const RATE_LIMIT_DELAY = 350;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 发起带认证的飞书 API 请求
 * 直接使用传入的 accessToken，不再内部获取
 */
async function feishuRequest<T>(
  endpoint: string,
  accessToken: string,
  path: string
): Promise<T> {
  await sleep(RATE_LIMIT_DELAY);

  const url = `${endpoint}${path}`;
  logger.debug(`GET ${url}`);

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  if (!resp.ok) {
    throw new Error(`飞书 API 请求失败: HTTP ${resp.status} ${resp.statusText}`);
  }

  const data = (await resp.json()) as FeishuApiResponse<T>;

  if (data.code !== 0) {
    throw new Error(`飞书 API 错误: [${data.code}] ${data.msg}`);
  }

  return data.data;
}

/**
 * 获取知识库 Wiki 节点信息
 * 通过 node_token 获取 obj_token（即真正的 document_id）
 *
 * Wiki URL: https://xxx.feishu.cn/wiki/{node_token}
 * 需要先用此接口将 node_token 转为 obj_token，才能用文档 API 获取内容
 */
export async function getWikiNodeInfo(
  endpoint: string,
  accessToken: string,
  nodeToken: string
): Promise<WikiNodeInfo> {
  apiCounter.increment("wikiNode");
  return feishuRequest<WikiNodeInfo>(
    endpoint,
    accessToken,
    `/open-apis/wiki/v2/spaces/get_node?token=${nodeToken}`
  );
}

/**
 * 获取文档基本信息
 */
export async function getDocumentInfo(
  endpoint: string,
  accessToken: string,
  documentId: string
): Promise<DocumentInfo> {
  apiCounter.increment("documentInfo");
  return feishuRequest<DocumentInfo>(
    endpoint,
    accessToken,
    `/open-apis/docx/v1/documents/${documentId}`
  );
}

/**
 * 获取文档所有块（自动处理分页）
 */
export async function getAllDocumentBlocks(
  endpoint: string,
  accessToken: string,
  documentId: string
): Promise<Block[]> {
  const allBlocks: Block[] = [];
  let pageToken: string | undefined;
  let pageNum = 1;

  do {
    logger.debug(`获取文档块（第 ${pageNum} 页）...`);

    let path = `/open-apis/docx/v1/documents/${documentId}/blocks?document_revision_id=-1&page_size=500`;
    if (pageToken) {
      path += `&page_token=${pageToken}`;
    }

    apiCounter.increment("documentBlocks");
    const data = await feishuRequest<DocumentBlocksResponse>(
      endpoint,
      accessToken,
      path
    );

    if (data.items) {
      allBlocks.push(...data.items);
    }

    pageToken = data.has_more ? data.page_token : undefined;
    pageNum++;
  } while (pageToken);

  logger.debug(`共获取到 ${allBlocks.length} 个文档块`);
  return allBlocks;
}
