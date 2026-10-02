<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n, useLocalePath } from '#imports'
import { useColorMode } from '@vueuse/core'
import { Bars3Icon, MoonIcon, SunIcon } from '@heroicons/vue/20/solid'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const colorMode = useColorMode() 
const isMounted = ref(false)

const isAvailableForWork = ref(true)

const navLinks = ref([
  { key: 'projects', path: '/projetos' },
  { key: 'about', path: '/sobre' },
  { key: 'contact', path: '/contato' }
])

watch(() => route.path, () => {
  const menu = document.getElementById('mobile-menu')
  if (menu && typeof (menu as any).hidePopover === 'function') {
    (menu as any).hidePopover()
  }
})

const toggleTheme = () => {
  colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
}

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <div>
    <Motion
      as="header"
      class="header full-width"
      :initial="{ y: '-100%', opacity: 0 }"
      :enter="{ 
        y: '0%', 
        opacity: 1, 
        transition: { 
          duration: 300, 
          ease: [0.33, 1, 0.68, 1] 
        } 
      }"
    >
      <div class="left" style="display: flex; align-items: center; gap: 1rem;">
        <NuxtLink :to="localePath('/')" class="name-link" data-cursor-text="Oi :)">
          Fellipe Mayan
        </NuxtLink>
        
        <div v-if="isAvailableForWork" class="availability-badge" :title="t('header.available')">
          <span class="status-dot"></span>
        </div>
      </div>

      <nav class="header-nav">
        <ul>
          <li v-for="item in navLinks" :key="item.path">
            <NuxtLink
              :to="localePath(item.path)"
              active-class="active"
              @click="(e) => (e.currentTarget as HTMLElement).blur()"
            >
              {{ t(`nav.${item.key}`) }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="options right">
        <button 
          class="menu-btn btn secondary-btn icon-only" 
          :aria-label="t('header.toggleTheme')"
          @click="toggleTheme" 
        >
          <MoonIcon v-if="!isMounted || colorMode === 'light'" class="icon-md" />
          <SunIcon v-else class="icon-md" />
        </button>

        <button
          popovertarget="mobile-menu"
          class="menu-btn btn secondary-btn icon-only"
        >
          <Bars3Icon class="icon-md" />
        </button>
      </div>
    </Motion>

    <MobileMenu :nav-links="navLinks" />
  </div>
</template>