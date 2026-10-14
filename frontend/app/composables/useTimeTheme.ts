import { ref, onMounted, onUnmounted } from 'vue'

export const useTimeTheme = () => {
  const timeThemeClass = ref('theme-day') 
  let interval: ReturnType<typeof setInterval>

  const updateTheme = () => {
    const options = { timeZone: 'America/Fortaleza', hour: 'numeric', hour12: false }
    const hourString = new Intl.DateTimeFormat('en-US', { 
      timeZone: 'America/Fortaleza', 
      hour: 'numeric', 
      hour12: false 
    }).format(new Date())
    const hour = parseInt(hourString, 10)

    if (hour >= 5 && hour < 7) {
      timeThemeClass.value = 'theme-morning'
    } else if (hour >= 7 && hour < 16) {
      timeThemeClass.value = 'theme-day'
    } else if (hour >= 16 && hour < 18) {
      timeThemeClass.value = 'theme-evening'
    } else {
      timeThemeClass.value = 'theme-night'
    }
  }

  onMounted(() => {
    updateTheme()
    interval = setInterval(updateTheme, 300000) 
  })

  onUnmounted(() => {
    if (interval) clearInterval(interval)
  })

  return { timeThemeClass }
}