# Viral 社媒增长模板

这是独立 Git 工程，根目录直接保留 Next.js 源码、package.json、pnpm-lock.yaml、public 和 scripts。模板市场资料及完整使用规则集中在 [.tpl/README.md](.tpl/README.md)。协议为 git-template 0.2.0，模板版本 1.1.0。

固定 Node.js 22.13.1、pnpm 12.10.1。在工程根目录运行：

```text
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

打开 http://127.0.0.1:43120/templates/viral/site，英文在末尾加 /en。Ctrl+C 停止服务。需要自定义 PORT 或 Chrome 路径时，将 .env.example 复制成 .env 并填写，已有进程环境优先；不需要个人密钥。

开发用 `pnpm dev`。完整验收用 `pnpm verify`，其中截图验收需要本机 Chrome/Chromium；通过 CHROME_PATH 指定位置。先停止开发预览再生产构建，避免同时写入 .next。截图写在本工程 .work/captures，市场素材在 .tpl/assets，运行素材在 public。

市场读取 [.tpl/template.json](.tpl/template.json)，AI 读取 [.tpl/project.json](.tpl/project.json) 与使用规则。结构检查为 `pnpm tpl:check`，它要求交付文件已加入 Git 索引，不运行应用。首次提交前请审阅 git diff --cached；提交与标签遵循项目流程。没有自定义压缩包或解包运行器。

此模板的表单仅本地演示，没有业务 API 或数据库。固定品牌入口 /templates 来自原宿主系统，本独立工程没有模板市场页面。

常见修改入口见 [.tpl/customization.json](.tpl/customization.json)。执行 `pnpm tpl:doctor --operation capture` 诊断该操作所需工具；缺少浏览器不影响安装、构建和普通预览。`pnpm tpl:verified` 检查当前源码是否有有效通过报告，报告过期时需重新验收。project.json 的 previews 明确声明两种语言的预览路径，供未来市场读取。

原始素材限定内部演示，公开使用及再分发前需取得相应许可，详见 [.tpl/docs/LICENSE.md](.tpl/docs/LICENSE.md)。
