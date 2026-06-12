<script setup>
import { ref, onMounted, useTemplateRef, computed, watch } from 'vue'
import { VueSelecto } from 'vue3-selecto'
import { useExplorerExternalDrop } from '@owdproject/module-fs/runtime/composables/useExplorerExternalDrop'
import { explorerEntryAbsolutePath } from '@owdproject/module-fs/runtime/utils/utilExplorerEntryPath'

const props = defineProps({
  fsExplorer: { type: Object, required: true },
  dropEnabled: { type: Boolean, required: false },
})

const dropEnabled = computed(() => props.dropEnabled ?? true)
const { isDragOver, onDragEnter, onDragOver, onDragLeave, onDrop } =
  useExplorerExternalDrop(props.fsExplorer, {
    enabled: () => dropEnabled.value,
  })

const selectoContainer = useTemplateRef('selectoContainer')
const windowContentContainer = ref()
const container = typeof document !== 'undefined' ? document.body : undefined
const files = ref([])

watch(
  () => props.fsExplorer.selectedFiles.value,
  (newSelected) => {
    files.value = newSelected ? [...newSelected] : []
  },
  { deep: true, immediate: true }
)

function resolveEntryPath(fileName) {
  return explorerEntryAbsolutePath(props.fsExplorer.basePath.value, fileName)
}

function onSelect(e) {
  e.added.forEach((el) => {
    const name = el.getAttribute('data-filename')
    if (!name) return
    const path = resolveEntryPath(name)
    if (!files.value.includes(path)) {
      files.value.push(path)
    }
    props.fsExplorer.selectFiles(files.value)
  })

  e.removed.forEach((el) => {
    const name = el.getAttribute('data-filename')
    if (!name) return
    const path = resolveEntryPath(name)
    const fileIndex = files.value.indexOf(path)
    if (fileIndex > -1) {
      files.value.splice(fileIndex, 1)
    }
    props.fsExplorer.selectFiles(files.value)
  })
}

onMounted(() => {
  const root = selectoContainer.value
  if (root) {
    windowContentContainer.value =
      root.closest('.owd-window__content') ?? undefined
  }
})
</script>

<template>
  <div
    ref="selectoContainer"
    class="desktop-explorer-dropzone"
    :class="{ 'desktop-explorer-dropzone--active': isDragOver }"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <VueSelecto
      v-if="container && windowContentContainer"
      :rootContainer="windowContentContainer"
      :dragContainer="windowContentContainer"
      :selectableTargets='[".owd-file"]'
      :selectByClick="true"
      :selectFromInside="true"
      :continueSelect="false"
      toggleContinueSelect="ctrl"
      :keyContainer="container"
      :hitRate="60"
      @select="onSelect"
    />

    <slot />
  </div>
</template>
