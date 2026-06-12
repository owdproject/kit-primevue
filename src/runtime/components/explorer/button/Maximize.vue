<script setup>
import ChromeButton from "./ChromeButton.vue";
</script>

<template>
  <ChromeButton variant="maximize">
    <Icon class="owd-button__icon" name="mdi:window-maximize" />
  </ChromeButton>
</template>

<style scoped>
.owd-button__icon {
  flex-shrink: 0;
}
</style>
