import type { NuxtApp } from 'nuxt/app'
import ConfirmationService from 'primevue/confirmationservice'
import type { useConfirm } from 'primevue/useconfirm'
import { DESKTOP_DIALOG_PROVIDER_KEY } from '@owdproject/core/runtime/constants/desktopShellKeys'
import type { DesktopDialogProvider } from '@owdproject/core/runtime/dialogs/desktopDialogProvider'
import { createDesktopDialogs } from './createDesktopDialogs'

type ConfirmApi = ReturnType<typeof useConfirm>

function resolveConfirmApi(nuxtApp: NuxtApp): ConfirmApi {
  const confirm = nuxtApp.vueApp.config.globalProperties.$confirm
  if (!confirm || typeof confirm.require !== 'function') {
    throw new Error(
      '[kit-primevue] PrimeVue ConfirmationService is not registered on vueApp.',
    )
  }
  return confirm as ConfirmApi
}

/**
 * Registers PrimeVue ConfirmationService and provides {@link DESKTOP_DIALOG_PROVIDER_KEY}.
 * Themes with a custom provider pass a factory (e.g. win11); default uses createDesktopDialogs.
 */
export function setupDesktopDialogProvider(
  nuxtApp: NuxtApp,
  factory: (confirm: ConfirmApi) => DesktopDialogProvider = createDesktopDialogs,
): void {
  nuxtApp.vueApp.use(ConfirmationService)
  nuxtApp.vueApp.provide(
    DESKTOP_DIALOG_PROVIDER_KEY,
    factory(resolveConfirmApi(nuxtApp)),
  )
}
