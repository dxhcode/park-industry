import { execFileSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')

function run(command, args, cwd = root) {
  execFileSync(command, args, { cwd, stdio: 'inherit' })
}

function capture(command, args, cwd = root) {
  return execFileSync(command, args, { cwd, encoding: 'utf8' }).trim()
}

const status = capture('git', ['status', '--porcelain'])
if (status) {
  console.error('工作区有未提交改动。请先提交，再执行 pages:publish。')
  process.exit(1)
}

run('node', ['scripts/pages-build.mjs'])

const remote = capture('git', ['remote', 'get-url', 'origin'])
rmSync(resolve(dist, '.git'), { recursive: true, force: true })
run('git', ['init', '-b', 'dist'], dist)
run('git', ['add', '-A'], dist)
run(
  'git',
  [
    '-c',
    'user.name=park-industry pages',
    '-c',
    'user.email=pages@localhost',
    'commit',
    '-m',
    'chore: publish GitHub Pages bundle',
  ],
  dist,
)
run('git', ['push', '--force', remote, 'HEAD:dist'], dist)
rmSync(resolve(dist, '.git'), { recursive: true, force: true })

console.log('已强制更新 dist 分支。')
console.log('GitHub Pages 需在仓库设置里选择 dist 分支的根目录。计划在第四天开启，今晚不必发布。')
