/**
 * 飞书媒体文件 API
 * 下载图片、文件、画板等附件
 *
 * 直接接收 accessToken，不再内部调用认证 API
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { FileToken } from "../converter/types.ts";
import { logger } from "../utils/logger.ts";
import { apiCounter } from "./counter.ts";

const RATE_LIMIT_DELAY = 350;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 根据文件 token 获取文件扩展名
 */
function getExtension(type: FileToken["type"], contentType?: string): string {
  if (type === "image") {
    if (contentType?.includes("png")) return ".png";
    if (contentType?.includes("gif")) return ".gif";
    if (contentType?.includes("webp")) return ".webp";
    if (contentType?.includes("svg")) return ".svg";
    return ".jpg";
  }
  if (type === "board") {
    return ".png";
  }
  return "";
}

/**
 * 批量下载所有媒体文件
 * 返回 token -> 本地相对路径 的映射
 *
 * @param accessToken 已获取的 tenant_access_token，不再内部请求
 */
export async function downloadAllMedia(
  endpoint: string,
  accessToken: string,
  fileTokens: FileToken[],
  outputDir: string
): Promise<Map<string, string>> {
  const tokenToPath = new Map<string, string>();

  if (fileTokens.length === 0) {
    return tokenToPath;
  }

  const imagesDir = join(outputDir, "images");
  const filesDir = join(outputDir, "files");
  await mkdir(imagesDir, { recursive: true });
  await mkdir(filesDir, { recursive: true });

  let downloaded = 0;
  let failed = 0;

  for (const ft of fileTokens) {
    await sleep(RATE_LIMIT_DELAY);

    try {
      const url = `${endpoint}/open-apis/drive/v1/medias/${ft.token}/download`;
      logger.debug(`下载 ${ft.type}: ${url}`);

      apiCounter.increment("mediaDownload");
      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!resp.ok) {
        logger.warn(`下载失败 (${ft.token}): HTTP ${resp.status}`);
        failed++;
        continue;
      }

      const contentType = resp.headers.get("content-type") || "";
      const ext = getExtension(ft.type, contentType);

      let subDir: string;
      if (ft.type === "image" || ft.type === "board") {
        subDir = "images";
      } else {
        subDir = "files";
      }

      const fileName = `${ft.token}${ext}`;
      const localPath = join(subDir, fileName);
      const fullPath = join(outputDir, localPath);

      const buffer = Buffer.from(await resp.arrayBuffer());
      await writeFile(fullPath, buffer);

      tokenToPath.set(ft.token, localPath);
      downloaded++;

      logger.progress(
        `下载进度: ${downloaded + failed}/${fileTokens.length}    `
      );
    } catch (err) {
      logger.warn(`下载异常 (${ft.token}): ${err}`);
      failed++;
    }
  }

  // 清除进度行
  process.stdout.write("\n");

  return tokenToPath;
}
