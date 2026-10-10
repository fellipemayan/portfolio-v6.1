import { computed, onMounted, ref } from 'vue'
import { useMediaQuery, useStorage } from '@vueuse/core'

export const useAnimationPreferences = () => {
  const userPreference = useStorage('reduced-motion-preference', false)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isHydrated = ref(false)

  onMounted(() => {
    isHydrated.value = true
  })

  const isReducedMotion = computed(() => (
    isHydrated.value && (prefersReducedMotion.value || userPreference.value)
  ))

  return {
    userPreference,
    prefersReducedMotion,
    isReducedMotion
  }
}
