/**
 * 将 bun build 输出的 shebang 从 bun 替换为 node
 * 用于 npm 发包前处理
 */
const file = "bin/fm.mjs";
let content = await Bun.file(file).text();
content = content.replace("#!/usr/bin/env bun", "#!/usr/bin/env node");
content = content.replace("// @bun\n", "");
await Bun.write(file, content);
console.log("✔ shebang fixed: bin/fm.mjs");
