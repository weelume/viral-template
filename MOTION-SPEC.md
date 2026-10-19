# Viral 动效与媒体标准

## 页面级动效

使用 `framer-motion` 的 `MotionConfig reducedMotion="user"` 包裹模板 Shell。页面主内容使用淡入：

```tsx
<motion.main
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: reduced ? 0 : 0.45 }}
/>
```

## 滚动进入

服务卡、案例结果和内容区块使用透明度 + Y 轴位移：

```tsx
<motion.article
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
/>
```

同一组卡片使用递增 delay，避免所有元素同时出现。动效只表达层级和阅读顺序，不添加持续闪烁或自动漂移。

## Hero 视频轮播

- 三个视频叠放在同一媒体卡片中，只让当前视频拥有 `is-active` 类。
- `autoPlay`、`muted`、`playsInline`、`preload="auto"` 必须同时设置。
- 顶部进度条显示已完成、当前进度和待播放状态。
- 视频结束时切换到下一个，最后一个回到第一个。
- 允许进度条和左右箭头手动切换；箭头默认透明，悬停或键盘聚焦时显示。
- 视频切换使用约 240ms 的 opacity 过渡。

## 可访问性与降运动

- `prefers-reduced-motion: reduce` 时关闭滚动位移动画和按钮过渡，视频仍可静音播放。
- 每个视频和按钮有 `aria-label`；装饰性媒体使用 `aria-hidden`。
- 焦点状态不能被 opacity 或 transform 隐藏。
- 移动端固定入口避开 `safe-area-inset-bottom`。

## 媒体性能

视频使用本地静态资源路径，避免运行时远程依赖。首屏媒体可预加载，其余视频保留 `preload="auto"` 以复刻视觉；正式生产项目可根据带宽策略改为 `metadata`，但要保留海报图和无视频降级背景。
