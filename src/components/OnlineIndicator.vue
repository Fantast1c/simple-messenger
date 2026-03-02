<script setup lang="ts">
defineProps<{
  isOnline: boolean
}>()
</script>

<template>
  <span
    role="status"
    :aria-label="isOnline ? 'онлайн' : 'оффлайн'"
    class="indicator"
    :class="{ 'indicator--online': isOnline }"
  />
</template>

<style scoped lang="scss">
.indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  background-color: var(--color-offline);
  transition: background-color 150ms ease;

  &--online {
    background-color: var(--color-online);
  }
}
</style>
