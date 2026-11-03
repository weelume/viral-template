import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, mkdtemp, readFile, writeFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve, join } from 'node:path'
import { invocation } from '../.tpl/tools/doctor.mjs'

const exec = promisify(execFile)
const root = resolve(import.meta.dirname, '..')
await mkdir(join(root, '.work/packages'), { recursive: true })
const output = await mkdtemp(join(root, '.work/packages/bundle-'))
const command = await invocation('pnpm', ['pack', '--pack-destination', output])
await exec(command.file, command.args, { cwd: root, windowsHide: true, maxBuffer: 1024 * 1024 })
const filename = (await readdir(output)).find(name => name.endsWith('.tgz'))
if (!filename) throw new Error('pnpm pack 未生成模板运行包')
const archive = join(output, filename)
const sha256 = createHash('sha256').update(await readFile(archive)).digest('hex')
const sourceCommit = (await exec('git', ['rev-parse', 'HEAD'], { cwd: root, windowsHide: true })).stdout.trim()
const dirty = (await exec('git', ['status', '--porcelain'], { cwd: root, windowsHide: true })).stdout.trim() !== ''
const report = { archive, sha256, sourceCommit, sourceDirty: dirty, createdAt: new Date().toISOString() }
await writeFile(join(output, 'bundle.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
