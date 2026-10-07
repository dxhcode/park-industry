import { execFileSync } from 'node:child_process'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: 'inherit' })
}

const fallbackHtml = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>产业运营平台</title>
    <script>
      ;(function () {
        var base = '/park-industry/'
        var loc = window.location
        var path = loc.pathname
        var apps = ['admin', 'screen']
        var matched = ''
        for (var i = 0; i < apps.length; i++) {
          var prefix = base + apps[i] + '/'
          if (path.indexOf(prefix) === 0) {
            matched = apps[i]
            break
          }
        }
        if (!matched) {
          loc.replace(base)
          return
        }
        var rest = path.slice((base + matched + '/').length)
        var query = loc.search ? '&' + loc.search.slice(1).replace(/&/g, '~and~') : ''
        loc.replace(
          loc.protocol +
            '//' +
            loc.hostname +
            (loc.port ? ':' + loc.port : '') +
            base +
            matched +
            '/?/' +
            rest.replace(/&/g, '~and~') +
            query +
            loc.hash,
        )
      })()
    </script>
  </head>
  <body></body>
</html>
`

await rm(dist, { recursive: true, force: true })
run('node', ['scripts/build-shared.mjs'])
run('pnpm', ['--filter', 'admin-app', 'build'])
run('pnpm', ['--filter', 'screen-app', 'build'])

await mkdir(dist, { recursive: true })
await cp(resolve(root, 'apps/admin-app/dist'), resolve(dist, 'admin'), { recursive: true })
await cp(resolve(root, 'apps/screen-app/dist'), resolve(dist, 'screen'), { recursive: true })
await cp(resolve(root, 'pages/index.html'), resolve(dist, 'index.html'))
await writeFile(resolve(dist, '404.html'), fallbackHtml)
await writeFile(resolve(dist, '.nojekyll'), '')

const adminHtml = await readFile(resolve(dist, 'admin/index.html'), 'utf8')
const screenHtml = await readFile(resolve(dist, 'screen/index.html'), 'utf8')
if (!adminHtml.includes('/park-industry/admin/')) {
  throw new Error('admin 构建产物缺少 base /park-industry/admin/')
}
if (!screenHtml.includes('/park-industry/screen/')) {
  throw new Error('screen 构建产物缺少 base /park-industry/screen/')
}

console.log('Pages 构建完成:')
console.log('  dist/index.html')
console.log('  dist/404.html')
console.log('  dist/admin/')
console.log('  dist/screen/')
console.log('  dist/.nojekyll')
