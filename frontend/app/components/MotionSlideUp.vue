<script setup lang="ts">
defineProps<{
  delay?: number
}>()

const { isReducedMotion } = useAnimationPreferences()
</script>

<template>
  <Motion
    as="div"
    :initial="isReducedMotion ? undefined : { y: 40, opacity: 0 }"
    :enter="isReducedMotion ? undefined : { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 400, 
        delay: delay || 0, 
        ease: [0.33, 1, 0.68, 1] 
      } 
    }"
  >
    <slot />
  </Motion>
</template>