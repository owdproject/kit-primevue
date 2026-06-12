<script setup lang="ts">
import { inject } from 'vue'
const windowContent = inject<any>('windowContent', {})
</script>

<template>
  <WindowContent>
    <div :class="['desktop-explorer-body', { 'desktop-explorer-body--centered': windowContent?.centered }]">
      <slot />
    </div>
  </WindowContent>
</template>

<style scoped>
.desktop-explorer-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  height: 100%;
}
.desktop-explorer-body--centered {
  justify-content: center;
  align-items: center;
}
</style>
