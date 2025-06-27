// Global type declarations for Nuxt auto-imports
declare global {
  const useProjectsStore: () => import('~/stores/projects').ProjectsStore
  const useCodebaseRulesStore: () => import('~/stores/codebaseRules').CodebaseRulesStore
  const defineNuxtConfig: (config: any) => any
  const defineEventHandler: (handler: any) => any
  const readBody: (event: any) => Promise<any>
  const createError: (error: any) => Error
  const storeToRefs: (store: any) => any
  const reactive: (obj: any) => any
  const ref: (value: any) => any
  const computed: (fn: () => any) => any
  const onMounted: (fn: () => void) => void
  const watchEffect: (fn: () => void) => void
  const navigateTo: (path: string) => Promise<void>
  const useRoute: () => any
  const useNuxtApp: () => any
  const $fetch: (url: string, options?: any) => Promise<any>
}

export {}
