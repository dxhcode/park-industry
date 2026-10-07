export interface DemoAccount {
  username: string
  password: string
  name: string
  role: string
  title: string
  parkId: string
  parkName: string
}

/** 演示账号。密码只用于本地原型，不代表真实身份。 */
export const demoAccounts: DemoAccount[] = [
  {
    username: 'chenqm',
    password: 'demo123',
    name: '陈启明',
    role: '园区管理员',
    title: '运营总监',
    parkId: 'park-binjiang',
    parkName: '滨江云栖科创园',
  },
  {
    username: 'zhoulan',
    password: 'demo123',
    name: '周岚',
    role: '招商经理',
    title: '招商主管',
    parkId: 'park-lingang',
    parkName: '临港智造产业园',
  },
  {
    username: 'liucheng',
    password: 'demo123',
    name: '刘澄',
    role: '签约专员',
    title: '签约主管',
    parkId: 'park-guanggu',
    parkName: '光谷生命科学园',
  },
]

export interface SessionUser {
  username: string
  name: string
  role: string
  title: string
  parkId: string
  parkName: string
}

export function toSessionUser(account: DemoAccount): SessionUser {
  return {
    username: account.username,
    name: account.name,
    role: account.role,
    title: account.title,
    parkId: account.parkId,
    parkName: account.parkName,
  }
}
