# 产业运营平台

园区产业运营前端原型。第一天搭建 pnpm monorepo，包含两个可点击的中文界面壳：

- `apps/admin-app`：运营中台
- `apps/screen-app`：产业驾驶舱

页面路由已经接通。第二天补上运营中台的本地登录，以及招商项目、签约合同的列表、详情和表单。线索、拜访、履约一并可点。其余菜单仍是占位。接口、图表、地图和后端不在本日范围。

## 环境

- Node.js `>= 22.12`
- pnpm `10`

```bash
pnpm install
```

## 本地开发

```bash
pnpm dev:admin
pnpm dev:screen
```

- 运营中台：<http://localhost:5173/park-industry/admin/>
- 产业驾驶舱：<http://localhost:5174/park-industry/screen/>

Vite `base` 分别为 `/park-industry/admin/` 和 `/park-industry/screen/`，与 GitHub Pages 项目站点路径一致。

## 登录

运营中台除登录页外都需要本地会话，会话写在 `localStorage` 键 `park-industry.session`。演示密码都是 `demo123`。

| 账号 | 姓名 | 角色 | 默认园区 |
| --- | --- | --- | --- |
| `chenqm` | 陈启明 | 园区管理员 | 滨江云栖科创园 |
| `zhoulan` | 周岚 | 招商经理 | 临港智造产业园 |
| `liucheng` | 刘澄 | 签约专员 | 光谷生命科学园 |

退出登录在顶栏右侧。招商和签约的改动保存在 `park-industry.pipeline.v1`，顶栏「恢复示例」可以盖回初始数据。

## 招商与签约

产业招商：

- 项目库：`/investment/projects`，列表、详情、新建和编辑
- 线索：`/investment/leads`，可转化为项目
- 拜访：`/investment/visits`，挂在项目或线索上

签约管理：

- 合同：`/signing/contracts`，必须关联招商项目
- 履约：`/signing/performance`，挂在合同上

样例园区与 park-shared 主数据对齐：滨江云栖科创园、临港智造产业园、光谷生命科学园。企业、电话和金额都是虚构的。

## 菜单

运营中台：

- 工作台
- 产业招商：项目库、线索、拜访
- 签约管理：合同、履约
- 企业档案
- 产业空间
- 政策兑现
- 投资促进
- 数据分析
- 系统设置

产业驾驶舱：

- 招商态势
- 签约看板
- 企业分布
- 空间利用
- 政策兑现
- 告警中心

## 构建

```bash
pnpm build
pnpm typecheck
pnpm pages:build
```

`pnpm build` 分别产出 `apps/admin-app/dist` 和 `apps/screen-app/dist`。

`pnpm pages:build` 生成可放到 GitHub Pages 的聚合目录：

```text
dist/index.html
dist/404.html
dist/.nojekyll
dist/admin/
dist/screen/
```

`dist/index.html` 是入口页，链接到两个应用。`dist/404.html` 用来在 Pages 上刷新深链接时回到对应的单页应用。

## 推送到 dist 分支

Pages 站点计划在第四天开启。脚本已经备好，今晚不必执行，也不必在仓库设置里打开 Pages。

确认工作区已提交后：

```bash
pnpm pages:publish
```

脚本会重新执行 `pages:build`，再把 `dist/` 里的构建产物强制推送到 `dist` 分支。这个分支只保存静态产物，不保存源码。手改 `dist` 分支会被下一次发布覆盖。

发布后，在 GitHub 仓库 Settings → Pages 中选择：

- Source：Deploy from a branch
- Branch：`dist`，目录 `/ (root)`

站点路径：

- `https://<owner>.github.io/park-industry/`
- `https://<owner>.github.io/park-industry/admin/`
- `https://<owner>.github.io/park-industry/screen/`
