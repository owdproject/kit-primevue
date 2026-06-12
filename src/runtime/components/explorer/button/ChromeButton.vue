<script setup>
defineProps({
  variant: { type: String, required: false },
})
</script>

<template>
  <Button
    :class="[
      'p-button--window-nav',
      variant ? `p-button--window-nav-${variant}` : '',
    ]"
  >
    <span class="owd-button__window-nav-content">
      <slot />
    </span>
  </Button>
</template>

<style scoped>
:deep(.p-button.p-button--window-nav) {
  overflow: visible;
}

.owd-button__window-nav-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  line-height: 0;
}
</style>
