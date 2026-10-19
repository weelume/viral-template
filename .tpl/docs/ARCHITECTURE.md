# 架构

根 package.json、pnpm-lock.yaml、.nvmrc 是原生工程工具链；src/app 是 Next App Router，public 是运行素材，scripts 是启动与截图验收。没有 workspace 包装目录、CT 运行器或业务后端。

| 模块 | 职责与入口 |
| --- | --- |
| src/app | layout.tsx 加载全局样式，page.tsx 重定向到模板首页 |
| src/app/templates/viral/site/[[...slug]]/page.tsx | 解析页面与语言，挂载 data-template="viral" 容器，将正确的语言 basePath 传给页面 |
| src/features/site-templates/types.ts | 模板公共类型 SiteTemplatePageProps 等 |
| src/features/site-templates/locale-routing.ts | 语言前缀与路径纯函数 |
| src/features/site-templates/catalog/viral/meta.ts | 应用端运行时页面注册及动态 import；不得由市场加载其中的函数 |
| catalog/viral/components | Shell 导航/页脚/菜单与 Locale 文案上下文 |
| catalog/viral/pages、data.ts、theme.css | 页面实现、数据、主题和响应式样式 |
| public/templates/viral | 本地图片、视频、原始截图及素材来源 |
| .tpl | 使用规则、声明式市场元数据、运行合同及市场展示素材 |

页面统一使用 Shell，并通过公共 SiteTemplatePageProps 接收 basePath/locale。跨模块通过公共类型和出口引用，避免循环依赖。应用路由以代码为实际实现；新增页面或语言时同步 .tpl/template.json 的市场清单和浏览器检查。

template.json 的 platform 表示独立业务端，device 表示截图视口，不能因为有手机截图就虚构一个手机业务端。当前只有一个 site 端，支持中英文与三种视口。

环境由 scripts/lib/environment.mjs 读取并由启动入口消费，服务器只渲染页面。没有数据库或服务端秘密。真实提交功能必须新增业务 API、环境/数据/迁移合同和验证，不能直接把本地表单当作已接入服务。
