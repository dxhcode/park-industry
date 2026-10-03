import { computed } from 'vue'

export function dateModel(read: () => string, write: (value: string) => void) {
  return computed({
    get: () => read() || undefined,
    set: (value?: string) => {
      write(value ?? '')
    },
  })
}
