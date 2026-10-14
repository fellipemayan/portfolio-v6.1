<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useFetch, useI18n, useLocalePath } from '#imports'

type LocalizedString = { pt?: string; en?: string }
type SocialLink = {
  _key?: string
  name?: LocalizedString
  url: string
  order?: number
  isVisible?: boolean
}

const props = defineProps<{
  socialLinks?: SocialLink[]
}>()

const { t, locale, locales, setLocale } = useI18n()
const localePath = useLocalePath()

const localizedSocialLinks = computed(() =>
  (siteSettings.value?.socialLinks || [])
    .filter((link) => link.isVisible !== false)
    .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
    .map((link) => ({
      key: link._key || link.url,
      name: typeof link.name === 'string' 
              ? link.name 
              : (link.name?.[locale.value as 'pt' | 'en'] || link.name?.pt || link.name?.en || link.url),
      url: link.url,
    })),
)
type SiteSettings = { 
  version?: string; 
  lastUpdated?: string;
  socialLinks?: SocialLink[];
}
const { data: siteSettings } = await useFetch<SiteSettings>('/api/site-settings')


  
const currentTime = ref('')
const isNight = ref(false)
let timer: ReturnType<typeof setInterval>

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

</script>

<template>
  <footer class="content-grid">
    <p class="copyright left">
      &copy; {{ new Date().getFullYear() }} Fellipe Mayan. {{ t('footer.copyright') }} 
    </p>

    <ul class="social-links right">
        <li v-for="link in localizedSocialLinks" :key="link.key">
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


  </footer>
</template>

<style scoped>
footer {
  background-color: var(--color-bg-base);
  border-top: 1px solid var(--color-border);
  padding-block: var(--spacing-lg);
}

.copyright {
  text-wrap: nowrap;
}

.social-links {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  list-style: none;
  padding: 0;
  margin: 0;

  a:hover {
    text-decoration: wavy underline;
  }
}

</style>