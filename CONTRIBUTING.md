# Contributing

感谢你对本项目的关注！欢迎提交 Issue 和 Pull Request。

## 开发环境

- [Bun](https://bun.sh) >= 1.0
- TypeScript

```bash
git clone https://github.com/WakeUp-Jin/export-feishu-to-md.git
cd export-feishu-to-md
bun install
```

## 开发流程

1. Fork 本仓库
2. 创建你的分支：`git checkout -b feat/your-feature`
3. 开发并测试：`bun run dev -- export -d <token>`
4. 提交：`git commit -m "feat: add your feature"`
5. 推送：`git push origin feat/your-feature`
6. 创建 Pull Request

## Commit 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

- `feat:` 新功能
- `fix:` 修复
- `docs:` 文档
- `refactor:` 重构
- `chore:` 构建/工具

## 目录结构

```
src/
  index.ts              # CLI 入口
  config.ts             # 配置解析
  api/                  # 飞书 API 调用
    auth.ts             # 认证
    document.ts         # 文档/Wiki API
    media.ts            # 媒体下载
    counter.ts          # API 调用计数
  converter/            # Markdown 转换
    markdown.ts         # 核心渲染器
    types.ts            # 类型定义
    buffer.ts           # 字符串拼接工具
    emoji.ts            # Emoji 映射
  utils/
    logger.ts           # 日志
    file.ts             # 文件操作
```

## 提交 Issue

- Bug 请附上错误日志（`--debug` 模式输出）
- Feature 请描述使用场景
