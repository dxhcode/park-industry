import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const marker = resolve(root, 'vendor/park-shared/packages/theme/package.json')

if (existsSync(marker)) {
  process.exit(0)
}

execFileSync('git', ['submodule', 'update', '--init', 'vendor/park-shared'], {
  cwd: root,
  stdio: 'inherit',
})
