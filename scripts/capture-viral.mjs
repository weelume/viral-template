/** 三端截图与交互验收；生成物只写入工程 .work，不覆盖原始截图。 */
import assert from 'node:assert/strict'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { openBrowser, delay } from './lib/browser-cdp.mjs'
import { previewServer } from './lib/preview-server.mjs'
import { loadEnvironment } from './lib/environment.mjs'

loadEnvironment()

await mkdir(resolve('.work/captures'), { recursive: true })
const output = await mkdtemp(resolve('.work/captures/run-'))
const server = await previewServer()
let browser
const checks = []
const basePath = '/templates/viral/site'
const shots = [{ name: 'home', path: '' }, { name: 'features', path: '/about' }, { name: 'blog', path: '/blog' }, { name: 'contact', path: '/book-a-call' }]
const devices = [{ prefix: '', width: 1440, height: 1000 }, { prefix: 'tablet-', width: 834, height: 1180 }, { prefix: 'mobile-', width: 390, height: 844 }]
try {
  browser = await openBrowser()
  const navigate = async path => {
    const url = `${server.origin}${basePath}${path}`
    await browser.page('Page.navigate', { url })
    let ready = false
    for (let attempt = 0; attempt < 100; attempt++) {
      ready = await browser.evaluate(`location.href === ${JSON.stringify(url)} && document.readyState === 'complete' && !!document.querySelector('.vl-footer')`)
      if (ready) break
      await delay(100)
    }
    assert(ready, `页面未就绪：${path}`)
    await browser.evaluate(`(async () => { await document.fonts.ready; [...document.images].forEach(image => { image.loading = 'eager' }); })()`)
    await delay(1500)
    assert(await browser.evaluate(`!!document.querySelector('[data-template="viral"] .vl-site') && getComputedStyle(document.querySelector('.vl-nav')).display === 'flex'`), '模板样式作用域未挂载，页面主题未生效')
  }
  for (const locale of ['', '/en']) {
    for (const page of ['', '/about', '/case-studies', '/blog', '/blog/short-form-playbook', '/book-a-call', '/privacy-policy', '/terms-of-service', '/404']) {
      assert.equal((await fetch(`${server.origin}${basePath}${locale}${page}`)).status, 200, `${locale}${page}`)
    }
  }
  assert.equal((await fetch(`${server.origin}${basePath}/missing-page`)).status, 404)
  checks.push('18 个双语页面 HTTP 200，未知路由 HTTP 404')
  await browser.page('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  for (const device of devices) {
    await browser.page('Emulation.setDeviceMetricsOverride', { width: device.width, height: device.height, deviceScaleFactor: 1, mobile: false })
    for (const shot of shots) {
      await navigate(shot.path)
      assert(await browser.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), `水平溢出：${device.prefix}${shot.name}`)
      const screenshot = await browser.page('Page.captureScreenshot', { format: 'webp', quality: 86, captureBeyondViewport: false })
      await writeFile(join(output, `${device.prefix}${shot.name}.webp`), Buffer.from(screenshot.data, 'base64'))
    }
  }
  checks.push('桌面 1440、平板 834、手机 390：12 张截图且无水平溢出')
  await navigate('')
  assert(await browser.evaluate('document.querySelectorAll("video").length > 0 && [...document.querySelectorAll("video")].some(v => v.readyState >= 1)'), '视频未载入')
  await browser.evaluate('document.querySelector(".vl-menu-toggle").click()')
  await delay(150)
  assert.equal(await browser.evaluate('document.querySelector(".vl-menu-toggle").getAttribute("aria-expanded")'), 'true')
  await browser.page('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await browser.page('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await delay(150)
  assert.equal(await browser.evaluate('document.querySelector(".vl-menu-toggle").getAttribute("aria-expanded")'), 'false')
  checks.push('本地视频载入、移动菜单展开与 Escape 收起')
  await navigate('/en')
  assert.match(await browser.evaluate('document.querySelector("h1").innerText'), /Short form\s+done right/)
  assert.equal(await browser.evaluate('document.querySelector(".vl-language").getAttribute("href")'), basePath, '英文页语言开关应返回中文首页')
  assert.equal(await browser.evaluate(`document.querySelector('.vl-nav a[aria-label="viral home"]').getAttribute('href')`), basePath + '/en', '英文导航必须保留语言前缀')
  await browser.evaluate('document.querySelector(".vl-language").click()')
  await delay(1000)
  assert.equal(await browser.evaluate('location.pathname'), basePath)
  checks.push('英文文案、英文导航保留前缀，点击语言开关返回中文')
  await navigate('/book-a-call')
  await browser.evaluate('document.querySelector("form").requestSubmit()')
  assert.equal(await browser.evaluate('!!document.querySelector(".vl-form-status")'), false)
  const eventOffset = browser.events.length
  await browser.evaluate(`(() => {
    for (const [name, value] of Object.entries({ name: 'TPL Local Test', email: 'tpl@example.invalid', message: '仅本地验收' })) {
      const el = document.querySelector('[name="' + name + '"]'); el.value = value; el.dispatchEvent(new Event('input', { bubbles: true }));
    }
    document.querySelector('form').requestSubmit();
  })()`)
  await delay(200)
  assert.match(await browser.evaluate('document.querySelector(".vl-form-status")?.innerText || ""'), /尚未发送数据/)
  assert(!browser.events.slice(eventOffset).some(event => event.method === 'Network.requestWillBeSent' && ['Fetch', 'XHR'].includes(event.params.type)), '演示表单不应发出 API 请求')
  assert(!browser.events.some(event => event.method === 'Runtime.exceptionThrown'), '页面有未捕获脚本异常')
  checks.push('表单必填校验、成功提示且无 Fetch/XHR 提交；无未捕获脚本异常')
  await writeFile(join(output, 'report.json'), JSON.stringify({ status: 'passed', checkedAt: new Date().toISOString(), checks, screenshots: 12, browser: 'local Chrome headless' }, null, 2) + '\n')
  console.log(JSON.stringify({ status: 'passed', output, checks }, null, 2))
} catch (error) {
  await writeFile(join(output, 'report.json'), JSON.stringify({ status: 'failed', checks, error: String(error) }, null, 2) + '\n')
  throw error
} finally {
  try { await browser?.close() } finally { await server.close() }
}
