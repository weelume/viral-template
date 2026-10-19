# 接入现有 Next.js 模板系统

## 1. 复制资源

将以下目录复制到目标项目：

```text
src/features/site-templates/catalog/viral
public/templates/viral
```

同时确保目标项目已有 `SiteTemplate`、`SiteTemplatePageProps`、`TemplateLocale` 类型；如果类型路径不同，只调整 Viral 文件中的相对 import。

## 2. 注册模板

在模板注册表中导入 `viralTemplate` 并加入 `SITE_TEMPLATES`：

```ts
import { viralTemplate } from './catalog/viral/meta'

export const SITE_TEMPLATES = [/* existing templates */, viralTemplate]
```

`meta.ts` 应保持 `id: 'viral'`、`surface.id: 'site'`、`locales: ['zh', 'en']`，并保留所有页面 slug 的动态 import。

## 3. 路由约定

模板页面组件接收：

```ts
type SiteTemplatePageProps = {
  basePath: string
  locale?: 'zh' | 'en'
}
```

所有站内链接都使用 `${basePath}/...`。英文路径由路由层把 `/en` 解析为 `locale: 'en'`，页面组件只负责读取 `useCopy(locale)`。

## 4. 全局样式

在应用入口加载 `theme.css` 或让 `Shell.tsx` 引入它。模板所有选择器都带 `[data-template='viral']` 前缀，避免影响其他模板。宿主项目若已有全局 reset，应确认 `box-sizing`、按钮字体和视频默认样式不会覆盖 Viral 主题。

路由必须用 `<div data-template="viral">` 包裹页面；只导入 CSS 不会使带作用域前缀的主题生效。独立工程的动态路由已提供此容器，浏览器验收检查主题的实际计算样式。

## 5. 运行与验收

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
pnpm capture
```

浏览器验收路径：

- `/templates/viral/site`
- `/templates/viral/site/en`
- `/templates/viral/site/book-a-call`
- `/templates/viral/site/en/book-a-call`

确认中英文、居中联系页、标题字号、固定右下角入口、Hero 视频轮播和移动端无横向溢出。
