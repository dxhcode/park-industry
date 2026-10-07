export {}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    group?: string
    description?: string
    hints?: string[]
    public?: boolean
  }
}
