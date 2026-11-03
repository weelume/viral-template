import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const directory = resolve('.work/host-test')
await mkdir(directory, { recursive: true })
for (const [name, source] of [['brand.mjs', 'config/brand.ts'], ['host.mjs', 'host.tsx']]) {
  const content = await readFile(new URL('../src/features/site-templates/catalog/viral/' + source, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(content, { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } })
  await writeFile(resolve(directory, name), outputText.replaceAll("'./config/brand'", "'./brand.mjs'"))
}
const { ViralHostProvider, useViralBrand, useViralHost } = await import(pathToFileURL(resolve(directory, 'host.mjs')))

function Probe({ locale }) {
  const brand = useViralBrand(locale)
  const host = useViralHost()
  return createElement('output', null, JSON.stringify({ brand, marketplaceHref: host.marketplaceHref ?? null }))
}

test('独立使用两种语言时采用默认品牌，不生成外部市场入口', () => {
  for (const locale of ['zh', 'en']) {
    const markup = renderToStaticMarkup(createElement(Probe, { locale }))
    assert.match(markup, /Viral/)
    assert.match(markup, /hello@example.com/)
    assert.match(markup, /marketplaceHref&quot;:null/)
  }
})

test('集成方品牌、邮箱、Logo 和市场配置按语言注入，彼此隔离', () => {
  for (const [locale, label] of [['zh', '自定义品牌'], ['en', 'Custom Brand']]) {
    const markup = renderToStaticMarkup(createElement(ViralHostProvider, {
      brandName: { zh: '自定义品牌', en: 'Custom Brand' }, logo: '/custom/logo.svg', contactEmail: 'demo@example.invalid', marketplaceHref: '/catalog',
    }, createElement(Probe, { locale })))
    assert.match(markup, new RegExp(label))
    assert.match(markup, /demo@example.invalid/)
    assert.match(markup, /\/custom\/logo.svg/)
    assert.match(markup, /\/catalog/)
    assert.doesNotMatch(markup, /hello@example.com/)
  }
  assert.match(renderToStaticMarkup(createElement(Probe, { locale: 'en' })), /hello@example.com/)
})
