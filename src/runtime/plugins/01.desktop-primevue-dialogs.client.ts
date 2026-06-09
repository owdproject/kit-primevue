import { defineNuxtPlugin } from 'nuxt/app'
import ConfirmationService from 'primevue/confirmationservice'
import { useConfirm } from 'primevue/useconfirm'
import { DESKTOP_DIALOG_PROVIDER_KEY } from '@owdproject/core/runtime/constants/desktopShellKeys'
import { createDesktopDialogs } from '../dialogs/createDesktopDialogs'

export default defineNuxtPlugin({
  name: 'owd-kit-primevue-dialogs',
  enforce: 'pre',
  setup(nuxtApp) {
    nuxtApp.vueApp.use(ConfirmationService)
    const confirm = nuxtApp.runWithContext(() => useConfirm())
    nuxtApp.vueApp.provide(
      DESKTOP_DIALOG_PROVIDER_KEY,
      createDesktopDialogs(confirm),
    )
  },
})
