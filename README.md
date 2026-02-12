# fm

飞书文档转 Markdown 的 CLI 工具。单文件二进制或 npx 直接运行，无需复杂配置。

## 安装

#### 方式一：npx 直接运行（有 Node.js 环境）

无需安装，直接用：

```bash
npx fm-ka export -d doxcnXXXXXXXXXX
npx fm-ka export -w V0gQw6yEZikjBAkKcrVcd8OlnYe
```

或者全局安装：

```bash
npm i -g fm-ka
fm export -d doxcnXXXXXXXXXX
```

#### 方式二：下载预编译二进制（无需任何运行时）

从 [Releases](../../releases/latest) 下载对应平台的文件：

```bash
# macOS Apple Silicon
sudo curl -Lo /usr/local/bin/fm https://github.com/WakeUp-Jin/export-feishu-to-md/releases/latest/download/fm-darwin-arm64 && sudo chmod +x /usr/local/bin/fm

# macOS Intel
sudo curl -Lo /usr/local/bin/fm https://github.com/WakeUp-Jin/export-feishu-to-md/releases/latest/download/fm-darwin-x64 && sudo chmod +x /usr/local/bin/fm

# Linux
sudo curl -Lo /usr/local/bin/fm https://github.com/WakeUp-Jin/export-feishu-to-md/releases/latest/download/fm-linux-x64 && sudo chmod +x /usr/local/bin/fm
```

Windows 用户下载 `fm-windows-x64.exe`，放到 PATH 目录下即可。

## 前置准备

1. 访问 [飞书开放平台](https://open.feishu.cn/app) 创建应用
2. 获取 **App ID** 和 **App Secret**
3. 开通权限：
   - `docx:document:readonly` - 读取文档
   - `drive:drive:readonly` - 下载图片/附件
   - `wiki:wiki:readonly` - 读取知识库（如需导出知识库文档）
4. 发布应用并审批通过

## 使用

```bash
# 设置凭证（加到 ~/.zshrc 或 ~/.bashrc 中可永久生效）
export FEISHU_APP_ID=cli_xxxxxxxx
export FEISHU_APP_SECRET=xxxxxxxxxxxxxxxx

# 导出云文档
fm export -d doxcnXXXXXXXXXX
fm export -d "https://your-company.feishu.cn/docx/doxcnXXXXXXXXXX"

# 导出知识库文档
fm export -w V0gQw6yEZikjBAkKcrVcd8OlnYe
fm export -w "https://my.feishu.cn/wiki/V0gQw6yEZikjBAkKcrVcd8OlnYe"

# 更多选项
fm export -d <token> -o ./my-docs        # 指定输出目录
fm export -d <token> --no-images          # 不下载图片
fm export -d <token> --debug              # 调试日志
fm export -d <token> --app-id x --app-secret x  # 命令行传凭证
```

输出示例：

```
① 认证成功
② 解析知识库节点: "Agent的评估" -> Mwa9dywpfomAmgxMVLzcNWpdnJq
③ 获取文档: Agent的评估 (131 个块)
④ 转换 Markdown 完成
⑤ 下载媒体: 2/2 完成

✔ 导出完成: output/Agent的评估.md
  API 调用: 共 6 次 (auth:1, wiki:1, doc:1, blocks:1, media:2)
```

## 从源码构建

```bash
# 需要 Bun (https://bun.sh)
bun install
bun run build          # 编译当前平台 -> dist/fm
bun run build:all      # 编译所有平台
```

## 发布

打 tag 推送即可，GitHub Actions 自动编译 Release + 发布 npm：

```bash
git tag v0.1.0
git push origin v0.1.0
```

> 需要在仓库 Settings -> Secrets 中添加 `NPM_TOKEN`。

## 贡献

欢迎提交 Issue 和 PR，详见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## License

[MIT](LICENSE)
