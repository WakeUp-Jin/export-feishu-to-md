/**
 * 日志工具
 *
 * 两种模式：
 * - 默认模式：步骤式简洁输出
 * - Debug 模式：额外输出 API URL、分页详情等调试信息
 */

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  bold: "\x1b[1m",
};

/** 带圈数字 ①②③④⑤⑥⑦⑧⑨⑩ */
const CIRCLED_NUMBERS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

function circledNum(n: number): string {
  if (n >= 1 && n <= 10) return CIRCLED_NUMBERS[n - 1]!;
  return `(${n})`;
}

let _debug = false;

export const logger = {
  /** 设置 debug 模式 */
  setDebug(enabled: boolean) {
    _debug = enabled;
  },

  /** 是否处于 debug 模式 */
  get isDebug() {
    return _debug;
  },

  /** 步骤式输出：① 认证成功 */
  step(num: number, msg: string) {
    console.log(`${colors.cyan}${circledNum(num)}${colors.reset} ${msg}`);
  },

  /** 完成提示：✔ 导出完成 */
  done(msg: string) {
    console.log(`\n${colors.green}${colors.bold}✔ ${msg}${colors.reset}`);
  },

  /** 灰色辅助信息（缩进） */
  hint(msg: string) {
    console.log(`${colors.gray}  ${msg}${colors.reset}`);
  },

  /** 警告（任何模式都显示） */
  warn(msg: string, ...args: unknown[]) {
    console.warn(`${colors.yellow}⚠ ${msg}${colors.reset}`, ...args);
  },

  /** 错误（任何模式都显示） */
  error(msg: string, ...args: unknown[]) {
    console.error(`${colors.red}✖ ${msg}${colors.reset}`, ...args);
  },

  /** Debug 信息（仅 --debug 模式输出） */
  debug(msg: string, ...args: unknown[]) {
    if (_debug) {
      console.log(`${colors.gray}  [debug] ${msg}${colors.reset}`, ...args);
    }
  },

  /** 信息（仅 --debug 模式输出，用于保留原有的详细过程日志） */
  info(msg: string, ...args: unknown[]) {
    if (_debug) {
      console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`, ...args);
    }
  },

  /** 下载进度（实时覆盖行） */
  progress(msg: string) {
    process.stdout.write(`${colors.cyan}  ${msg}${colors.reset}\r`);
  },
};
