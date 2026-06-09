<script setup>
defineProps({
  icon: { type: String, required: true }
});
</script>

<template>
  <div class="owd-window-nav__icon">
    <Icon :name="icon" :size="18" />
  </div>
</template>

<style scoped>
.owd-window-nav__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
