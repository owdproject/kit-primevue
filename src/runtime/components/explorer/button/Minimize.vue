<script setup>
import ChromeButton from './ChromeButton.vue'
</script>

<template>
  <ChromeButton variant="minimize">
    <div class="owd-button__icon" />
  </ChromeButton>
</template>

<style scoped>
.owd-button__icon {
  width: 11px;
  height: 14px;
  position: relative;
  flex-shrink: 0;
}

.owd-button__icon:before {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 3px;
  height: 3px;
  background: rgb(var(--owd-theme-color-black));
  content: '';
}
</style>
