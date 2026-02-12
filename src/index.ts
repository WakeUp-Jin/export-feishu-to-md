#!/usr/bin/env bun
/**
 * fm - 飞书文档转 Markdown CLI 工具
 *
 * 将飞书文档转换为 Markdown 格式，支持图片下载到本地
 */

import { Command } from "commander";
import { join } from "node:path";
import { fetchTenantAccessToken } from "./api/auth.ts";
import { apiCounter } from "./api/counter.ts";
import { downloadAllMedia } from "./api/media.ts";
import { getAllDocumentBlocks, getDocumentInfo, getWikiNodeInfo } from "./api/document.ts";
import { resolveConfig, validateConfig } from "./config.ts";
import { MarkdownRenderer } from "./converter/markdown.ts";
import { replaceFileTokens, sanitizeFilename, writeFile } from "./utils/file.ts";
import { logger } from "./utils/logger.ts";

const VERSION = "0.1.0";

const program = new Command();

program
  .name("fm")
  .description("将飞书文档转换为 Markdown 格式的 CLI 工具")
  .version(VERSION);

// --- export 子命令 ---

program
  .command("export")
  .description("导出飞书文档为 Markdown")
  .option("-d, --doc <token>", "云文档的 document_id 或 URL")
  .option("-w, --wiki <token>", "知识库文档的 node_token 或 URL")
  .option("--app-id <id>", "飞书应用 App ID（也可通过 FEISHU_APP_ID 环境变量设置）")
  .option("--app-secret <secret>", "飞书应用 App Secret（也可通过 FEISHU_APP_SECRET 环境变量设置）")
  .option("-o, --output <dir>", "输出目录", "./output")
  .option("--endpoint <url>", "飞书 API 端点", "https://open.feishu.cn")
  .option("--no-images", "不下载图片，保持 token 引用")
  .option("--debug", "输出详细调试日志")
  .action(async (options: Record<string, unknown>) => {
    try {
      await exportDocument(options);
    } catch (err) {
      logger.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

/** 文档来源类型 */
type DocSource =
  | { type: "docx"; token: string }
  | { type: "wiki"; nodeToken: string };

/**
 * 从 URL 中提取 token 部分
 * 如果是完整 URL 则解析出最后的 path 段，否则原样返回（当作纯 token）
 */
function extractToken(input: string): string {
  try {
    const url = new URL(input);
    const pathParts = url.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 1) {
      return pathParts[pathParts.length - 1]!;
    }
  } catch {
    // 不是 URL，原样返回
  }
  return input;
}

/**
 * 根据 CLI 参数解析文档来源
 */
function resolveDocSource(options: Record<string, unknown>): DocSource {
  const docInput = options.doc as string | undefined;
  const wikiInput = options.wiki as string | undefined;

  if (docInput && wikiInput) {
    logger.error("-d 和 -w 不能同时使用，请选择其中一个");
    process.exit(1);
  }

  if (!docInput && !wikiInput) {
    logger.error("请指定要导出的文档:");
    logger.hint("-d <token>  云文档的 document_id 或 URL");
    logger.hint("-w <token>  知识库文档的 node_token 或 URL");
    console.log("");
    logger.hint("示例:");
    logger.hint('  fm export -d doxcnXXXXXXXX');
    logger.hint('  fm export -w V0gQw6yEZikjBAkKcrVcd8OlnYe');
    logger.hint('  fm export -d "https://xxx.feishu.cn/docx/doxcnXXXXXX"');
    logger.hint('  fm export -w "https://my.feishu.cn/wiki/V0gQw6yEZikj..."');
    process.exit(1);
  }

  if (wikiInput) {
    return { type: "wiki", nodeToken: extractToken(wikiInput) };
  }

  return { type: "docx", token: extractToken(docInput!) };
}

/**
 * 核心导出流程
 */
async function exportDocument(
  options: Record<string, unknown>
): Promise<void> {
  // 设置 debug 模式
  logger.setDebug(options.debug === true);

  const docSource = resolveDocSource(options);

  // 解析配置
  const config = resolveConfig({
    appId: options.appId as string | undefined,
    appSecret: options.appSecret as string | undefined,
    endpoint: options.endpoint as string | undefined,
    outputDir: options.output as string | undefined,
  });

  // 校验配置
  const errors = validateConfig(config);
  if (errors.length > 0) {
    for (const err of errors) {
      logger.error(err);
    }
    console.log("");
    logger.hint("使用方式:");
    logger.hint("  方式一: 设置环境变量 FEISHU_APP_ID 和 FEISHU_APP_SECRET");
    logger.hint("  方式二: 通过 --app-id 和 --app-secret 参数传入");
    console.log("");
    logger.hint("如何获取 App ID/Secret:");
    logger.hint("  1. 访问 https://open.feishu.cn/app 创建应用");
    logger.hint("  2. 开通 docx:document:readonly、drive:drive:readonly 权限");
    logger.hint("  3. 若需导出知识库，还需开通 wiki:wiki:readonly 权限");
    logger.hint("  4. 发布应用并审批通过");
    process.exit(1);
  }

  // 步骤计数器
  let step = 1;

  // ===== 第 1 步: 认证 =====
  const accessToken = await fetchTenantAccessToken(
    config.endpoint,
    config.appId,
    config.appSecret
  );
  logger.step(step++, "认证成功");

  // ===== 第 2 步: Wiki 解析（仅知识库文档） =====
  let documentId: string;

  if (docSource.type === "wiki") {
    const wikiInfo = await getWikiNodeInfo(
      config.endpoint,
      accessToken,
      docSource.nodeToken
    );

    const objType = wikiInfo.node.obj_type;
    documentId = wikiInfo.node.obj_token;

    if (objType !== "docx" && objType !== "doc") {
      throw new Error(
        `该知识库节点类型为 "${objType}"，目前仅支持 docx 类型文档的导出`
      );
    }

    logger.step(step++, `解析知识库节点: "${wikiInfo.node.title}" -> ${documentId}`);
  } else {
    documentId = docSource.token;
  }

  // ===== 第 3 步: 获取文档信息 + 文档块（合并为一步输出） =====
  const docInfo = await getDocumentInfo(
    config.endpoint,
    accessToken,
    documentId
  );
  const docTitle = docInfo.document.title || documentId;

  const blocks = await getAllDocumentBlocks(
    config.endpoint,
    accessToken,
    documentId
  );
  logger.step(step++, `获取文档: ${docTitle} (${blocks.length} 个块)`);

  // ===== 第 4 步: 转换 Markdown =====
  const renderer = new MarkdownRenderer();
  let markdown = renderer.parse(blocks);
  logger.step(step++, "转换 Markdown 完成");

  // ===== 第 5 步: 下载媒体文件 =====
  const downloadImages = options.images !== false;
  const fileTokens = renderer.fileTokens;

  if (downloadImages && fileTokens.length > 0) {
    const tokenToPath = await downloadAllMedia(
      config.endpoint,
      accessToken,
      fileTokens,
      config.outputDir
    );

    markdown = replaceFileTokens(markdown, tokenToPath);
    logger.step(step++, `下载媒体: ${fileTokens.length}/${fileTokens.length} 完成`);
  } else if (fileTokens.length > 0) {
    logger.step(step++, `跳过下载 ${fileTokens.length} 个媒体文件（--no-images）`);
  }

  // ===== 写入文件 =====
  const fileName = `${sanitizeFilename(docTitle)}.md`;
  const outputPath = join(config.outputDir, fileName);
  await writeFile(outputPath, markdown);

  // ===== 结果输出 =====
  logger.done(`导出完成: ${outputPath}`);

  if (fileTokens.length > 0 && downloadImages) {
    logger.hint(`媒体文件: ${config.outputDir}/images/`);
  }

  // API 统计始终显示
  logger.hint(`API 调用: ${apiCounter.formatSummary()}`);
}

// 解析命令行参数
program.parse();
