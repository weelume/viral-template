import assert from 'node:assert/strict'
import test from 'node:test'
import { previewServer } from '../scripts/lib/preview-server.mjs'

test('已有预览服务仅接受显式本机地址，拒绝远端、凭据及路径', async () => {
  const previous = process.env.VIRAL_PREVIEW_URL
  try {
    for (const origin of ['http://127.0.0.1:43120', 'http://localhost:43120/']) {
      process.env.VIRAL_PREVIEW_URL = origin
      const service = await previewServer()
      assert.equal(service.origin, new URL(origin).origin)
      await service.close()
    }
    for (const value of ['https://localhost:43120', 'http://example.com', 'http://user:pass@localhost:43120', 'http://localhost:43120/path', 'http://localhost:43120/?key=value']) {
      process.env.VIRAL_PREVIEW_URL = value
      await assert.rejects(previewServer(), /必须是无路径及凭据的本机 HTTP 地址/)
    }
  } finally {
    if (previous === undefined) delete process.env.VIRAL_PREVIEW_URL
    else process.env.VIRAL_PREVIEW_URL = previous
  }
})
