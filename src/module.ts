import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addPlugin,
  installModule,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { Nuxt } from '@nuxt/schema'
import { registerTailwindPath } from '@owdproject/core/kit/authoring'

export interface KitPrimevueModuleOptions {
  /**
   * Register `DesktopExplorer*` components (Workspace, FileEntry, …).
   * Requires `@owdproject/module-fs` in the app when enabled (default).
   * Set `false` for PrimeVue + dialogs only.
   */
  explorer?: boolean
}

function primevueModuleDependency(nuxt: Nuxt) {
  const existing = nuxt.options.primevue ?? {}
  const components = { ...(existing.components ?? {}) }
  const include = components.include
  if (
    include &&
    include !== '*' &&
    Array.isArray(include) &&
    !include.includes('ConfirmDialog')
  ) {
    components.include = [...include, 'ConfirmDialog']
  }

  return {
    defaults: defu(
      {
        options: { theme: {} },
        components,
      },
      existing,
    ),
  }
}

export default defineNuxtModule<KitPrimevueModuleOptions>({
  meta: {
    name: 'owd-kit-primevue',
    configKey: 'kitPrimevue',
  },
  defaults: {
    explorer: true,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    await installModule(
      '@primevue/nuxt-module',
      primevueModuleDependency(nuxt),
    )

    addPlugin({
      src: resolve('./runtime/plugins/01.desktop-primevue-dialogs.client'),
      mode: 'client',
      order: 1,
    })

    if (options.explorer !== false) {
      addComponentsDir({
        path: resolve('./runtime/components/explorer'),
        prefix: 'DesktopExplorer',
        pathPrefix: false,
      })

      registerTailwindPath(
        nuxt,
        resolve('./runtime/components/explorer/**/*.{vue,mjs,ts}'),
      )
    }
  },
})
