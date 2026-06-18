import {
  defineNuxtModule,
  createResolver,
  addComponentsDir,
  addPlugin,
  installModule,
} from '@nuxt/kit'
import { defu } from 'defu'
import type { Nuxt } from '@nuxt/schema'
import PrimeUI from 'tailwindcss-primeui'
import { registerTailwindPath } from './kit/registerTailwindPath'

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

function flattenTailwindContentPaths(content: unknown): string[] {
  const paths: string[] = []

  if (typeof content === 'string') {
    paths.push(content)
    return paths
  }

  if (Array.isArray(content)) {
    for (const entry of content) {
      paths.push(...flattenTailwindContentPaths(entry))
    }
    return paths
  }

  if (content && typeof content === 'object') {
    const record = content as Record<string, unknown>
    if (Array.isArray(record.files)) {
      for (const entry of record.files) {
        if (typeof entry === 'string') paths.push(entry)
      }
    }
    for (const [key, value] of Object.entries(record)) {
      if (key === 'files') continue
      paths.push(...flattenTailwindContentPaths(value))
    }
  }

  return paths
}

function mergeDesktopTailwindContent(
  nuxt: Nuxt,
  config: { content?: unknown; plugins?: unknown[]; darkMode?: unknown },
) {
  const registered = [...(nuxt.options.desktopTailwindContent ?? [])]
  const prior = flattenTailwindContentPaths(config.content)
  const merged = [...new Set([...prior, ...registered])]

  if (merged.length > 0) {
    // `{ files: [...] }` — a plain array becomes `{ "0": path, ... }` in the
    // generated postcss template and Tailwind will not scan those paths.
    config.content = { files: merged }
  }

  config.plugins = [...(config.plugins ?? []), PrimeUI]
  config.darkMode = ['class', '.p-dark']

  if (nuxt.options.dev && merged.length > 0) {
    console.info(
      '[desktop-kit-primevue] Tailwind content:',
      merged.length,
      'paths:',
      merged,
    )
  }
}

async function setupDesktopTailwind(nuxt: Nuxt) {
  // Must install during module setup — not on `modules:done`. @nuxtjs/tailwindcss
  // registers its own `modules:done` handler to wire PostCSS; installing too late
  // skips that hook and no global utilities are generated.
  nuxt.hook('tailwindcss:config', (config) => {
    mergeDesktopTailwindContent(nuxt, config)
  })

  await installModule('@nuxtjs/tailwindcss', {
    viewer: false,
    quiet: true,
  })
}

export default defineNuxtModule<KitPrimevueModuleOptions>({
  meta: {
    name: 'desktop-kit-primevue',
    configKey: 'kitPrimevue',
  },
  defaults: {
    explorer: true,
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    await setupDesktopTailwind(nuxt)

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
