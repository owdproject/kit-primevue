<script setup>
import { useExplorerWindow } from '@owdproject/module-fs/runtime/composables/useExplorerWindow'
import { useI18n } from 'vue-i18n'
import { explorerEntryAbsolutePath } from '@owdproject/module-fs/runtime/utils/utilExplorerEntryPath'
import Frame from './Frame.vue'
import Chrome from './Chrome.vue'
import FilePane from './FilePane.vue'
import AddressBar from './AddressBar.vue'
import DefaultToolbar from './presets/DefaultToolbar.vue'

const props = defineProps({
  config: { type: Object, required: false },
  window: { type: Object, required: true },
  frameClass: { type: String, required: false },
})

const { t } = useI18n()
const fsExplorer = useExplorerWindow(props.window, t)
props.window.fsExplorer = fsExplorer
void fsExplorer.initialize()
</script>

<template>
  <Frame
    :window="window"
    :frame-class="frameClass"
  >
    <template v-if="$slots.nav" #nav>
      <slot name="nav" />
    </template>

    <Chrome>
      <div class="desktop-explorer-menubar-row">
        <div class="desktop-explorer-menubar-row__menu">
          <Menubar :breakpoint="'0px'" :model="window.menu" />
        </div>
        <Divider layout="vertical" />

        <div class="desktop-explorer-brand">
          <img
            class="desktop-explorer-brand__logo"
            alt=""
            src="data:image/gif;base64,R0lGODlhTAAsAIQQAAAAAAAAMAgICBAQEB8fHyAgIAAwMCgoKAAwZwAwmABnmDBnZzBnmDBnzzCYzzCY/7KysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysiH5BAEKABAALAAAAABMACwAAAX+ICCOZGmeaKqubOu+cCzPqCAEQVHQfH/aOJ1vOCMQFIpGg8FAOBE2onRlRCqZT6hgSjQ6F4tEgvl4IKMAmxfBHa7BYrJZgVYTnO2ZwaAs+/9+Snglg3kwe32AioJshI2GLUh/TJKKgExohZArlWWUCpaXDJmPmyhyDg5ZqaGKSDqapiaoqk+srX+vBbGyIntlSjYHB5NNCHKhSAMDvSa/D8ECw8VOyJbKzM0kVwy+Bn9CJdZ/Stom3N7gO+IMoeXmIstIIjh/qTh7ezidlkbw8groBbDnAF++faBa+YM3wsYtXBD98NLm0EHEiw8mNuOHEZfGXhw7hvq4qZ6lVHu3nAxzkq9lvmEL4ZlUhNKAygMsXbaESYAhgHGA0JAYxo2JEmw+gf4ROoLoEiYMjipYBu8ZLiVUAVg96cDnVncNsn4FlCppuwcPW6UNhcNsmbVcI7ZlqORegEQi/+xhqq1uwbsN8gLau4Vhqnc2kMANZZevucMNRCRWsJgrDsfaKu2RLMAJN7/cNvs8odkAZ89PQT8VPbqEjkRQjWXF3PrE68APYjuZXbj2CyNZfbshEFy48ePIR4QAADs="
          />
        </div>
      </div>

      <Divider />

      <slot name="toolbar">
        <DefaultToolbar
          :arrows-disabled="fsExplorer.fsDirectoryNavigation.history.value.length <= 1"
          @back="fsExplorer.directoryBack"
          @forward="fsExplorer.directoryForward"
          @up="fsExplorer.directoryUp"
          @cut="fsExplorer.cutSelectedFiles"
          @copy="fsExplorer.copySelectedFiles"
          @paste="() => fsExplorer.fsController?.pasteClipboardFiles()"
          @delete="() => fsExplorer.fsController?.deleteSelectedFiles()"
          @properties="fsExplorer.fileProperties"
        />
      </slot>

      <Divider />

      <slot name="address">
        <AddressBar
          :address="fsExplorer.basePath.value ?? ''"
          @update:model-value="(value) => {
            fsExplorer.basePath.value = value
          }"
        />
      </slot>

      <Divider />

      <slot name="file-pane">
        <FilePane>
          <DesktopExplorerSelectableArea
            v-if="!String(window.meta.path ?? '').startsWith('http')"
            :fs-explorer="fsExplorer"
          >
            <DesktopExplorerFileEntry
              v-for="fileName of fsExplorer.fsEntries.value"
              :key="fileName"
              :data-filename="fileName"
              :basePath="fsExplorer.basePath.value"
              :fileName="fileName"
              :layout="fsExplorer.layout.value"
              :selected="fsExplorer.selectedFiles.value.includes(explorerEntryAbsolutePath(fsExplorer.basePath.value, fileName))"
              :cutted="fsExplorer.fsClipboard.clipboardFiles.value.includes(explorerEntryAbsolutePath(fsExplorer.basePath.value, fileName)) && fsExplorer.fsClipboard.clipboardType.value === 'cut'"
              :window="window"
            />
          </DesktopExplorerSelectableArea>
          <iframe
            v-else
            class="desktop-explorer-file-pane__iframe"
            :src="window.meta.path ?? ''"
          />
        </FilePane>
      </slot>
    </Chrome>
  </Frame>
</template>

<style scoped>
iframe.desktop-explorer-file-pane__iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

:deep(.owd-window:not(.owd-window--focused)) iframe.desktop-explorer-file-pane__iframe {
  pointer-events: none;
}
</style>
