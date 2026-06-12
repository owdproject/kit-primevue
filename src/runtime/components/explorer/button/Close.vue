<script setup>
import ChromeButton from './ChromeButton.vue'
</script>

<template>
  <ChromeButton variant="close">
    <div class="owd-button__icon owd-button__icon--close" />
  </ChromeButton>
</template>

<style scoped>
.owd-button__icon {
  width: 12px;
  height: 12px;
  position: relative;
  flex-shrink: 0;
  transform: rotate(45deg);
}

.owd-button__icon:before,
.owd-button__icon:after {
  position: absolute;
  background: rgb(var(--owd-theme-color-black));
  content: '';
}

.owd-button__icon:before {
  height: 100%;
  width: 2px;
  left: 50%;
  transform: translateX(-50%);
}

.owd-button__icon:after {
  height: 2px;
  width: 100%;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
