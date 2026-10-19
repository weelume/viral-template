# Viral Site Project Baseline

这是一个可以直接复制的 Viral 社媒增长网站工程基线。使用时先复制完整工程，再在这个工程上根据用户需求调整内容、路由、页面结构和交互；保留现有的 Next.js、React、TypeScript、pnpm、组件、素材、样式系统和动效实现。

## 快速使用

```bash
corepack enable
pnpm install
pnpm dev
```

建议先启动复制后的工程，确认基线页面正常，再开始修改。模板通过 `Shell` 统一承载导航、页脚、主题、语言和动效；页面组件接收 `basePath` 与可选 `locale`。

## 包管理与依赖标准

- 包管理器：`pnpm`，版本由 `packageManager: pnpm@12.10.1` 固定。
- 运行时：Node.js 22 LTS 或更新的偶数版本。
- 框架：Next.js 15.3、React 19、React DOM 19、TypeScript 6。
- 动效：`framer-motion` 12；页面切换、滚动进入和视频切换统一使用它。
- CSS：项目使用 CSS 变量和组件级主题选择器；Tailwind CSS 4 可用于宿主项目布局工具，Viral 的视觉常量保留在 `theme.css`。
- 质量命令：`pnpm lint`、`pnpm typecheck`、`pnpm build`、`pnpm capture`。
- 修改依赖后同步提交 `pnpm-lock.yaml`。

## 基线复制范围

复制以下完整目录和文件：

- `src/`
- `public/`
- `scripts/`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `README.md`
- `STYLE-SPEC.md`
- `MOTION-SPEC.md`
- `INTEGRATION.md`

复制完成后，在这份工程上修改用户要求的内容。页面、组件、素材、路由、语言和动效均以复制后的代码为基础继续演进。

## 页面与路由

中文默认路径和英文 `/en` 路径均需实现：首页、关于与服务、客户案例、博客、博客文章、预约通话、隐私政策、服务条款和 404。

页面内部链接基于 `basePath` 拼接，页面组件通过 `locale` 读取中英文文案。

## 视觉系统

详见 `STYLE-SPEC.md`。核心标准如下：

- 页面底色：`#efede7`；卡片底色：`#f7f2ea`；正文：近黑色；辅助文字使用低饱和灰。
- 主字体：`Inter`，中文回退为 `Weelume MiSans`、`PingFang SC`、`Microsoft YaHei`。
- 桌面标题层级：Hero 72px、内页 H1 56px、区块 H2 50px、案例结果 H2 46px、卡片 H2 38px、CTA 44px、引用 40px。
- 移动标题层级：Hero/H1 36px、区块 H2 36px、案例 H2 36px、CTA 32px、引用 23px。
- 标题行高：英文约 `1.08–1.16`；中文约 `1.12–1.20`。
- 联系页标题居中且保持单行；服务标题“我们如何帮助你增增增”在桌面保持单行。
- 页面内容宽度基准 1200px，桌面左右内边距 64px，移动端水平内边距 24px。

## 动效与验收

详见 `MOTION-SPEC.md`。复制后的工程应保留首屏淡入、滚动进入、Hero 三视频轮播、服务和案例视频媒体、移动导航、reduced-motion 和右下角“微域生光”入口。

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm capture
```

截图需覆盖 1440×1000、834×1180、390×844 三种视口的首页、关于、博客、联系页，共 12 张。人工检查中英文切换、标题换行、联系页居中、移动端横向滚动、视频状态和固定入口。

## CT 封装运行说明

本副本的固定运行时为 Node.js 22.13.1，pnpm 12.10.1。锁文件实际安装 Next.js 15.5.28；以上基线框架描述保留原始说明，实际版本以锁文件为准。安装使用 `pnpm install --frozen-lockfile`；工作区显式允许锁定的 unrs-resolver 安装脚本。

已开启 TypeScript strict。dev/build/start 经 scripts/next.mjs 关闭 Next 遥测并将服务绑定 127.0.0.1，默认 PORT=43120。先停止开发预览再构建生产版本，避免共用 .next。

接收方建议使用上一级 START.md 的 CT 命令；业务表单为不发送数据的本地演示。独立工程未实现宿主市场 /templates 页面。

`pnpm test` 验证语言路由，`pnpm capture` 需先完成 build，并需要本机 Chrome/Chromium（可设置 CHROME_PATH）。它自行启动临时本地生产服务，完成 18 路由、三端布局、视频、语言、菜单和表单检查，保存 12 张新截图到 `../.work/captures/run-*/`，不覆盖 public 中的截图基准。

素材仅按原 sources.json 声明用于内部模板演示；正式公开使用前需取得权利人许可。更多见上一级 licenses/README.md。
