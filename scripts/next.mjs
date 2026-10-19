import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { loadEnvironment } from './lib/environment.mjs'

loadEnvironment()

const command = process.argv[2]
if (!['dev', 'build', 'start'].includes(command)) throw new Error('Usage: node scripts/next.mjs dev|build|start')
// 从原生工程命令启动时关闭遥测。
process.env.NEXT_TELEMETRY_DISABLED = '1'
const cli = createRequire(import.meta.url).resolve('next/dist/bin/next')
const options = command === 'build' ? [] : ['--hostname', '127.0.0.1', '--port', process.env.PORT || '43120']
process.argv = [process.execPath, cli, command, ...options, ...process.argv.slice(3)]
await import(pathToFileURL(cli).href)
