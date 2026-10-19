import assert from 'node:assert/strict'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'
import test from 'node:test'
import { loadEnvironment } from '../scripts/lib/environment.mjs'

test('原生命令加载 .env，保留进程环境的优先级；没有文件时无需配置', async () => {
  const root = await mkdtemp(join(tmpdir(), 'viral-env-'))
  const previous = process.env.TPL_ENV_FIXTURE
  try {
    delete process.env.TPL_ENV_FIXTURE
    loadEnvironment(root)
    assert.equal(process.env.TPL_ENV_FIXTURE, undefined)
    await writeFile(join(root, '.env'), 'TPL_ENV_FIXTURE=from-file\n')
    loadEnvironment(root)
    assert.equal(process.env.TPL_ENV_FIXTURE, 'from-file')
    process.env.TPL_ENV_FIXTURE = 'from-process'
    loadEnvironment(root)
    assert.equal(process.env.TPL_ENV_FIXTURE, 'from-process')
  } finally {
    if (previous === undefined) delete process.env.TPL_ENV_FIXTURE
    else process.env.TPL_ENV_FIXTURE = previous
    if (!resolve(root).startsWith(`${resolve(tmpdir())}${sep}viral-env-`)) throw new Error('临时目录越界')
    await rm(root, { recursive: true, force: true })
  }
})
