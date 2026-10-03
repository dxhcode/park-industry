import type { Component } from 'vue'
import {
  AccountBookOutlined,
  AuditOutlined,
  BankOutlined,
  BuildOutlined,
  DashboardOutlined,
  FundProjectionScreenOutlined,
  PieChartOutlined,
  RocketOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'

export interface MenuLeaf {
  key: string
  title: string
  path: string
  description: string
  hints: string[]
}

export interface MenuNode {
  key: string
  title: string
  icon: Component
  path?: string
  description?: string
  hints?: string[]
  children?: MenuLeaf[]
}

export interface FlatPage {
  key: string
  title: string
  path: string
  group: string
  description: string
  hints: string[]
}

export const adminMenus: MenuNode[] = [
  {
    key: 'workbench',
    title: '工作台',
    icon: DashboardOutlined,
    path: '/workbench',
    description: '汇总待办、待跟进线索、在谈项目和本周拜访，作为运营人员进入系统后的起点。',
    hints: ['待跟进线索', '在谈项目', '本周拜访'],
  },
  {
    key: 'investment',
    title: '产业招商',
    icon: FundProjectionScreenOutlined,
    children: [
      {
        key: 'investment-projects',
        title: '项目库',
        path: '/investment/projects',
        description: '管理储备、在谈和已落地的招商项目，跟踪阶段、意向面积与责任人。',
        hints: ['储备项目', '在谈项目', '已落地'],
      },
      {
        key: 'investment-leads',
        title: '线索',
        path: '/investment/leads',
        description: '登记推介会、渠道和主动咨询带来的招商线索，并分配跟进人。',
        hints: ['新线索', '跟进中', '已转化'],
      },
      {
        key: 'investment-visits',
        title: '拜访',
        path: '/investment/visits',
        description: '安排企业走访与来园接待，沉淀沟通纪要和下一步动作。',
        hints: ['今日拜访', '待写纪要', '待回访'],
      },
    ],
  },
  {
    key: 'signing',
    title: '签约管理',
    icon: AuditOutlined,
    children: [
      {
        key: 'signing-contracts',
        title: '合同',
        path: '/signing/contracts',
        description: '登记投资协议、租赁合同与补充协议，查看签约主体和关键条款。',
        hints: ['起草中', '待签署', '已生效'],
      },
      {
        key: 'signing-performance',
        title: '履约',
        path: '/signing/performance',
        description: '跟踪投资强度、税收承诺、开工与投产节点是否按约推进。',
        hints: ['正常履约', '即将到期', '逾期节点'],
      },
    ],
  },
  {
    key: 'enterprises',
    title: '企业档案',
    icon: BankOutlined,
    path: '/enterprises',
    description: '维护入驻企业的工商信息、产业分类、用房情况与联系人。',
    hints: ['在园企业', '重点企业', '待完善档案'],
  },
  {
    key: 'space',
    title: '产业空间',
    icon: BuildOutlined,
    path: '/space',
    description: '查看楼宇、厂房和可租可售资源的楼层、面积与空置情况。',
    hints: ['可招商面积', '在租面积', '空置资源'],
  },
  {
    key: 'policy',
    title: '政策兑现',
    icon: AccountBookOutlined,
    path: '/policy',
    description: '管理扶持政策的申报、审核与兑付进度。',
    hints: ['申报中', '审核中', '待兑付'],
  },
  {
    key: 'promotion',
    title: '投资促进',
    icon: RocketOutlined,
    path: '/promotion',
    description: '组织推介活动、考察接待和渠道合作，服务外出招商与来园考察。',
    hints: ['近期活动', '待接待', '合作渠道'],
  },
  {
    key: 'analytics',
    title: '数据分析',
    icon: PieChartOutlined,
    path: '/analytics',
    description: '登记各园区的阶段快报，留下线索转化、签约额和入驻率。图表在产业驾驶舱。',
    hints: ['线索转化', '签约额', '入驻率'],
  },
  {
    key: 'settings',
    title: '系统设置',
    icon: SettingOutlined,
    path: '/settings',
    description: '维护组织架构、数据字典和角色权限。登录仍使用三个演示账号。',
    hints: ['组织架构', '数据字典', '角色权限'],
  },
]

export function flattenMenus(menus: MenuNode[]): FlatPage[] {
  const pages: FlatPage[] = []
  for (const menu of menus) {
    if (menu.children) {
      for (const child of menu.children) {
        pages.push({
          key: child.key,
          title: child.title,
          path: child.path,
          group: menu.title,
          description: child.description,
          hints: child.hints,
        })
      }
      continue
    }
    if (menu.path && menu.description && menu.hints) {
      pages.push({
        key: menu.key,
        title: menu.title,
        path: menu.path,
        group: menu.title,
        description: menu.description,
        hints: menu.hints,
      })
    }
  }
  return pages
}
