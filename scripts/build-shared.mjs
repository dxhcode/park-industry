import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

execFileSync(
  'pnpm',
  ['--filter', '@park/theme', '--filter', '@park/mock', '--filter', '@park/components', 'run', 'build'],
  { cwd: root, stdio: 'inherit' },
)
