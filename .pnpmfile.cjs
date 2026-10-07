const { existsSync } = require('node:fs')
const { execFileSync } = require('node:child_process')

// pnpm 解析 workspace 之前就会加载这个文件。子模块目录空着时先拉下来，
// 这样紧接着的 `pnpm install` 才能找到 @park/*。
if (!existsSync('vendor/park-shared/packages/theme/package.json')) {
  execFileSync('git', ['submodule', 'update', '--init', 'vendor/park-shared'], {
    stdio: 'inherit',
  })
}

module.exports = {
  hooks: {},
}
