<script setup>
import { ref, watch } from 'vue'
import {
  formatExplorerDisplayPath,
  parseExplorerVfsPath,
} from '@owdproject/module-fs/runtime/utils/utilExplorerDisplayPath'

const props = defineProps({
  address: { type: String, required: true },
})

const emit = defineEmits(['update:modelValue'])

const addressInput = ref(formatExplorerDisplayPath(props.address))

watch(
  () => props.address,
  (address) => {
    addressInput.value = formatExplorerDisplayPath(address)
  },
)

function onEnter() {
  emit('update:modelValue', parseExplorerVfsPath(addressInput.value))
}
</script>

<template>
  <div class="desktop-explorer-address-bar">
    <span class="desktop-explorer-address-bar__label">
      {{ $t('apps.explorer.address') }}
    </span>
    <InputText
      v-model="addressInput"
      class="desktop-explorer-address-bar__input"
      spellcheck="false"
      @keydown.enter="onEnter"
    />
  </div>
</template>
