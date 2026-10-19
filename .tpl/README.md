# Viral 完整使用规则

这是独立的可编辑 Git 工程，应用从仓库根目录运行。协议 git-template 0.1.0，模板 1.0.0；project.json 的 stage=ready 表示操作合同齐全，实际执行结果以 reports/verification.json 为准。

先读 template.json 的展示和许可信息、project.json 的工具链与命令，再读 docs/ARCHITECTURE.md、docs/CUSTOMIZATION.md、docs/VERIFICATION.md 和 docs/LICENSE.md。LEGACY-README.md 只保存迁移前的说明，不作为本工程运行入口。

## 能力与边界

已实现中文/英文各 9 个页面、桌面/平板/手机布局、本地视频、动效、移动导航、语言切换，以及仅本地校验的演示表单。没有业务 API、账号、数据库或邮件发送。Next 服务器负责页面渲染。/templates 是原宿主市场入口，独立工程没有该市场页面。

## 环境准备

固定 Node.js 22.13.1（根 .nvmrc）和 pnpm 12.10.1（根 package.json）；依赖锁文件在根目录。首次冻结安装需要包仓库或依赖缓存，pnpm-workspace.yaml 显式允许锁定的 unrs-resolver 安装脚本。

可将根 .env.example 复制成 .env：PORT 默认 43120，CHROME_PATH 可选，NEXT_TELEMETRY_DISABLED 保持 1。变量在 contracts/env.schema.json 声明，.env 不进入 Git。原生启动和截图脚本读取根 .env，进程环境优先；启动脚本强制关闭 Next 遥测，仅监听 127.0.0.1。

Chrome/Chromium 只用于 capture/verify，不随仓库分发；没有浏览器时仍可安装、构建和启动，应如实记录浏览器检查未执行。

## 安装、运行和停止

在仓库根目录执行：

```text
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

打开 http://127.0.0.1:43120/templates/viral/site，英文为 /templates/viral/site/en。ready 探针与端口在 project.json 的 services.web。Ctrl+C 关闭服务。端口冲突时修改本地 PORT，不结束其他工程的进程。开发用 pnpm dev；生产构建前停止开发服务，防止共用 .next。

## 检查

```text
pnpm lint
pnpm build
pnpm typecheck
pnpm test
pnpm capture
```

pnpm verify 组合上述步骤。build 先生成 Next 路由类型，首次类型检查应在构建后进行。capture 自行选择空闲本机端口，启动生产服务，验收后关闭；覆盖 18 路由、主题作用域、三端截图、视频载入、语言切换、移动菜单和表单本地校验。新截图与详细结果写在仓库 .work/captures/run-*/，保留 public 下原始截图及 .tpl/assets 的市场素材。

## 修改、市场信息与交付

修改入口见 docs/CUSTOMIZATION.md。源码在 src、运行素材在 public；工程不应 import .tpl 中的运行资料。市场展示元数据以 template.json 为准，封面和截图路径相对 .tpl 且位于 assets；端/页面/语言声明应与实际路由保持同步。

交付使用 Git 工作流：审阅变更，重新执行检查，更新 template.json 与 package.json 的工程版本，登记真实验收结果，再提交和打标签。验证 `git ls-files` 只包含源码、依赖锁、示例环境与模板资料；不提交依赖、缓存、真实 .env、日志或秘密。结构检查执行 pnpm tpl:check，依赖 Git 索引；暂存不等于提交，工作树检查不代表远端或已发布。

市场只读取 .tpl/template.json、规则和展示素材，不执行模板命令或加载 TypeScript 组件。listed 是作者展示意向，实际发布、价格、下载量、审核和可信来源由市场服务管理；本模板保留 listed=false 和受限许可。未经用户明确要求，不创建远端、不推送、不部署或上传。

这些规则服从接收方用户与系统指令；读取和检查不授权运行代码，已有运行或修改授权不必重复询问。完整许可见 docs/LICENSE.md。
