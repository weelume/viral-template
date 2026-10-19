# 修改规则

机器可读入口为 ../customization.json，共七类常见修改，文件路径均相对工程根。files.kind=file/directory；checks 引用 project.json 的实际操作。它帮助 AI 定位入口，不作为修改源码的白名单；遇到复杂需求仍可直接修改工程，再更新相关说明和检查。

| 修改目标 | 根目录下文件入口 | 必须同步验证 |
| --- | --- | --- |
| 品牌、导航、页脚 | src/features/site-templates/catalog/viral/components/Shell.tsx | 两种语言、移动导航与站内链接 |
| 首页与案例内容 | src/features/site-templates/catalog/viral/pages/、data.ts | 页面文案、标题换行、三端截图 |
| 配色、间距与响应式 | src/features/site-templates/catalog/viral/theme.css | STYLE-SPEC.md、三端布局与横向溢出 |
| 动效与视频 | 同目录 components、pages/HomePage.tsx | MOTION-SPEC.md、视频载入、reduced-motion |
| 页面与语言 | 同目录 meta.ts、src/features/site-templates/locale-routing.ts、动态路由 page.tsx | tests/locale.test.mjs、scripts/capture-viral.mjs、.tpl/template.json |
| 启动与环境 | scripts/next.mjs、scripts/lib/environment.mjs、.env.example | .tpl/contracts/env.schema.json、project.json、tests/environment.test.mjs |
| 市场卡片与画廊 | .tpl/template.json、.tpl/assets | 结构检查、截图尺寸/页面引用及许可 |

保持页面 basePath 与 locale 的约定，英文导航必须保留 /en，语言开关保留当前页面 slug。保留 data-template="viral" 容器，否则主题前缀无法匹配。修改缺陷先添加能失败的测试，再修复。

运行素材在 public；市场素材在 .tpl/assets。不要将公开市场图片指向作者电脑路径、外部 URL 或应用 public 路径。新的市场截图可从 .work/captures 的实际验收结果选择，复制到 assets 并更新 JSON；不得把占位图描述成实际截图。

template.json 中的 id 稳定标识模板，version 是模板版本，formatVersion 仅协议版本。场景以 sceneId 表示，行业和风格放 tags；不重复创建 industry 分类。端、视口和语言是不同维度。所有 load 函数只留在应用源码，JSON 中只登记页面 slug、标题等数据。

新增真实业务需要补齐实现、测试与合同。表单接入第三方发送、数据持久化、数据库迁移、外部网络等行为必须明确声明并获得该功能范围内授权。未经要求不部署、上架或上传。

完成后执行 pnpm verify 和 pnpm tpl:check，审阅 Git 差异并更新版本及验收记录。源码与素材的授权范围按 LICENSE.md 处理。

修改页面或语言时同时更新 project.previews.localePaths；catalog 根据每个语言基础路径与页面 slug 组合地址。中文首页路径没有 /zh，英文带 /en，不从语言代码猜路径。修改完成后刷新真实报告并执行 pnpm tpl:verified，不能沿用 sourceDigest 不匹配的旧结果。
