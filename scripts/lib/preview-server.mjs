import { createServer } from 'node:net'
import { spawn } from 'node:child_process'
import { delay } from './browser-cdp.mjs'

export async function previewServer() {
  const reservation = createServer()
  await new Promise((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve) })
  const port = reservation.address().port
  await new Promise(resolve => reservation.close(resolve))
  const child = spawn(process.execPath, ['scripts/next.mjs', 'start'], {
    env: { ...process.env, PORT: String(port), NEXT_TELEMETRY_DISABLED: '1' },
    stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
  })
  let output = ''
  child.stdout.on('data', data => { output = (output + data).slice(-8000) })
  child.stderr.on('data', data => { output = (output + data).slice(-8000) })
  let error
  child.on('error', value => { error = value })
  const close = async () => {
    if (child.exitCode !== null) return
    const exited = new Promise(resolve => child.once('exit', resolve))
    child.kill()
    await Promise.race([exited, delay(5000)])
    if (child.exitCode === null) child.kill('SIGKILL')
    await exited
  }
  const origin = `http://127.0.0.1:${port}`
  try {
    for (let i = 0; i < 150; i++) {
      if (error || child.exitCode !== null) throw error || new Error(output)
      try { if ((await fetch(`${origin}/templates/viral/site`, { signal: AbortSignal.timeout(1000) })).ok) return { origin, close } } catch {}
      await delay(200)
    }
    throw new Error(`预览服务超时：${output}`)
  } catch (error) { await close(); throw error }
}
