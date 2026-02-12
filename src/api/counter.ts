/**
 * API 调用计数器
 * 帮助用户追踪飞书 API 配额消耗
 */

export interface ApiCallStats {
  /** 认证接口 */
  auth: number;
  /** Wiki 节点查询（node_token -> obj_token） */
  wikiNode: number;
  /** 获取文档信息 */
  documentInfo: number;
  /** 获取文档块（分页） */
  documentBlocks: number;
  /** 下载媒体文件 */
  mediaDownload: number;
}

/** stats key -> 紧凑显示名称 */
const LABEL_MAP: Record<keyof ApiCallStats, string> = {
  auth: "auth",
  wikiNode: "wiki",
  documentInfo: "doc",
  documentBlocks: "blocks",
  mediaDownload: "media",
};

class ApiCounter {
  private stats: ApiCallStats = {
    auth: 0,
    wikiNode: 0,
    documentInfo: 0,
    documentBlocks: 0,
    mediaDownload: 0,
  };

  increment(type: keyof ApiCallStats, count: number = 1): void {
    this.stats[type] += count;
  }

  get total(): number {
    return Object.values(this.stats).reduce((a, b) => a + b, 0);
  }

  getStats(): ApiCallStats {
    return { ...this.stats };
  }

  /**
   * 返回紧凑的一行摘要字符串
   * 例: "共 6 次 (auth:1, wiki:1, doc:1, blocks:1, media:2)"
   */
  formatSummary(): string {
    const parts: string[] = [];
    const keys = Object.keys(LABEL_MAP) as (keyof ApiCallStats)[];

    for (const key of keys) {
      if (this.stats[key] > 0) {
        parts.push(`${LABEL_MAP[key]}:${this.stats[key]}`);
      }
    }

    return `共 ${this.total} 次 (${parts.join(", ")})`;
  }

  reset(): void {
    this.stats = {
      auth: 0,
      wikiNode: 0,
      documentInfo: 0,
      documentBlocks: 0,
      mediaDownload: 0,
    };
  }
}

/** 全局单例计数器 */
export const apiCounter = new ApiCounter();
