<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from '#imports'
import { ArrowUpIcon } from '@heroicons/vue/16/solid'

defineProps<{
  socialLinks?: Array<{ name: string; url: string }>
}>()

const { t, locale, locales, setLocale } = useI18n()

const currentTime = ref('')
const isNight = ref(false)
let timer: ReturnType<typeof setInterval>

const currentDate = computed(() => new Date().toLocaleDateString(
  locale.value === 'pt' ? 'pt-BR' : 'en-US'
))

const updateTime = () => {
  const now = new Date()
  const timeZone = 'America/Fortaleza'
  
  currentTime.value = new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    timeStyle: 'short',
  }).format(now)

  const currentHour = parseInt(new Intl.DateTimeFormat('pt-BR', {
    timeZone,
    hour: 'numeric',
    hour12: false,
  }).format(now), 10)
  
  isNight.value = currentHour >= 18 || currentHour < 6
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 60000) 
})

onUnmounted(() => {
  clearInterval(timer)
})

const currentWeather = ref({
  data: { description: 'nublado', temp: 32 }
})

const weatherDescription = computed(() => locale.value === 'pt' ? 'nublado' : 'cloudy')

const weatherIcon = computed(() => {
  if (!currentWeather.value?.data) return ''
  const desc = weatherDescription.value
  if (desc.includes('chuva') || desc.includes('garoa') || desc.includes('tempestade')) return 'cloud'
  if (desc.includes('nublado') || desc.includes('nuven') || desc.includes('nuvem')) return 'cloud'
  return isNight.value ? 'moon' : 'sun'
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const changeLocale = (event: Event) => {
  const nextLocale = (event.target as HTMLSelectElement).value
  if (nextLocale === 'pt' || nextLocale === 'en') {
    setLocale(nextLocale)
  }
}

const reduceMotion = ref(false)
</script>

<template>
  <footer class="full-width footer">
    <div class="footer-grid">
      <MotionSlideUp class="left">
        <button class="btn primary-btn" @click="scrollToTop">
          <ArrowUpIcon class="icon-md" /> {{ t('footer.backToTop') }}
        </button>
      </MotionSlideUp>

      <MotionSlideUp :delay="0.1" class="middle-left">
        <ul>
          <li v-for="link in socialLinks" :key="link.name">
            <a 
              :href="link.url" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="external-link"
            >
              {{ link.name }}
            </a>
          </li>
        </ul>
      </MotionSlideUp>

      <MotionSlideUp :delay="0.2" class="middle-right">
        <p class="footer-location">{{ t('footer.location') }}</p>
        <p>{{ t('footer.currentTime', { time: currentTime }) }}</p>
        <p v-if="currentWeather.data">
          {{ t('footer.weatherPrefix') }}
          <span
            id="weather-description"
            :data-cursor-icon="weatherIcon"
            data-cursor-icon-pos="only"
          >
            {{ weatherDescription }}
          </span>{{ t('footer.weatherSuffix', { temp: currentWeather.data.temp }) }}
        </p>
      </MotionSlideUp>

      <MotionSlideUp :delay="0.3" class="copy-right">
        <p>&copy; {{ new Date().getFullYear() }} Fellipe Mayan.</p>
        <p>{{ t('footer.copyright') }}</p>
        
        <div class="footer-settings" style="margin-top: 1rem; display: flex; gap: 1rem; flex-direction: column;">
          <label>
            {{ t('footer.language') }}:
            <select :value="locale" @change="changeLocale" class="footer-select">
              <option v-for="l in locales" :key="l.code" :value="l.code">
                {{ l.name }}
              </option>
            </select>
          </label>
          
          <label>
            {{ t('footer.animations') }}:
            <select v-model="reduceMotion" class="footer-select">
              <option :value="false">{{ t('footer.animationDefault') }}</option>
              <option :value="true">{{ t('footer.animationReduced') }}</option>
            </select>
          </label>
        </div>
      </MotionSlideUp>
    </div>

    <MotionSlideUp :delay="0.4" class="colophon" style="margin-top: 4rem; text-transform: uppercase; font-size: 0.8rem; text-align: center;">
      <p>
        {{ t('footer.createdWith') }} <a href="https://nuxt.com" target="_blank">Nuxt.js</a> {{ t('footer.createdWithSuffix') }}
      </p>
      <p>
        {{ t('footer.iconsPrefix') }} <a href="https://heroicons.com" target="_blank">Heroicons</a>. {{ t('footer.motionPrefix') }} <a href="https://motion.dev" target="_blank">Motion.dev</a>. {{ t('footer.sourcePrefix') }} <a href="#" target="_blank">GitHub</a>.
      </p>
      <p>
        {{ t('footer.fontsPrefix') }} <a href="#">Zalando Sans</a> (&copy; 2025 The Zalando Sans Project Authors) {{ t('footer.and') }} <a href="#">NKDuy</a> (&copy; 2022 NKDuy).
      </p>
      <p style="margin-top: 2rem;">
        {{ t('footer.version') }} | {{ t('footer.lastUpdated', { date: currentDate }) }} | <a href="#">{{ t('footer.changelog') }}</a> :)
      </p>
    </MotionSlideUp>
  </footer>
</template>

<style scoped>
.footer-select {
  background: transparent;
  border: 1px solid currentColor;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: inherit;
  color: inherit;
}
</style>