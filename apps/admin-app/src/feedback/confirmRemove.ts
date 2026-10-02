import { Modal } from 'ant-design-vue'

export function confirmRemove(name: string, onOk: () => void) {
  Modal.confirm({
    title: `删除「${name}」？`,
    content: '只从本机数据里移除。顶栏「恢复示例」可以找回。',
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk,
  })
}
