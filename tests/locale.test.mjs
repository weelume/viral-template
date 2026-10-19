import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = await readFile(new URL('../src/features/site-templates/locale-routing.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { resolveSurfaceLocale, surfaceLocalePath } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)

test('双语路由保留中文默认路径，英文去除且只去除首个前缀', () => {
  const surface = { locales: ['zh', 'en'] }
  assert.deepEqual(resolveSurfaceLocale(surface, ''), { locale: 'zh', pageSlug: '' })
  assert.deepEqual(resolveSurfaceLocale(surface, 'en'), { locale: 'en', pageSlug: '' })
  assert.deepEqual(resolveSurfaceLocale(surface, 'en/blog/short-form-playbook'), { locale: 'en', pageSlug: 'blog/short-form-playbook' })
  assert.deepEqual(resolveSurfaceLocale(surface, 'blog/en'), { locale: 'zh', pageSlug: 'blog/en' })
})
test('未声明英文的模板保留 en slug，语言切换保留挂载路径', () => {
  assert.deepEqual(resolveSurfaceLocale({}, 'en/about'), { locale: 'zh', pageSlug: 'en/about' })
  assert.equal(surfaceLocalePath('/templates/viral/site', 'en'), '/templates/viral/site/en')
  assert.equal(surfaceLocalePath('/templates/viral/site', 'zh'), '/templates/viral/site')
})
