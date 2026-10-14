<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n, useLocalePath, useCookie } from '#imports'
import { useColorMode } from '@vueuse/core'
import { Bars3Icon, MoonIcon, SunIcon, LanguageIcon } from '@heroicons/vue/20/solid'

const route = useRoute()
const { t, locale, setLocale } = useI18n()
const localePath = useLocalePath()

// 1. Apenas o cookie do idioma aqui
const langCookie = useCookie('i18n_redirected', { maxAge: 31536000 })
const themeCookie = useCookie('theme-preference', { maxAge: 31536000 })

// O VueUse cuida do tema no cliente
const colorMode = useColorMode({
  attribute: 'data-theme',
  modes: { light: 'light', dark: 'dark' }
})

// Sincroniza a escolha com o cookie para o servidor ler depois
watch(colorMode, (newMode) => {
  themeCookie.value = newMode
})

const isMounted = ref(false)
const isDark = computed(() => colorMode.value === 'dark')
const isAvailableForWork = ref(true)  

const navLinks = ref([
  { key: 'projects', path: '/' },
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
  colorMode.value = isDark.value ? 'light' : 'dark'
}

const toggleLanguage = async () => {
  const nextLocale = locale.value === 'pt' ? 'en' : 'pt'
  await setLocale(nextLocale)
  langCookie.value = nextLocale
}

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
    <header class="site-header content-grid slide-down">
    <div class="left">
      <NuxtLink 
        :to="localePath('/')" 
        :aria-label="t('header.home')"
        class="header-name"
        data-cursor-text="Oi :)">
        Fellipe Mayan
      </NuxtLink>

      <div v-if="isAvailableForWork" class="availability-badge" :title="t('header.available')">
        <span class="status-dot"></span>
      </div>
    </div>

    <div class="options right">
      <button 
        class="btn ghost-btn lang-btn" 
        :aria-label="t('header.toggleLanguage', 'Trocar idioma')"
        @click="toggleLanguage" 
      >
        <LanguageIcon class="icon-md" />
        <span>{{ locale === 'pt' ? 'EN' : 'PT' }}</span>
      </button>

      <button 
        class="btn ghost-btn icon-only header-btn" 
        :aria-label="t('header.toggleTheme')"
        @click="toggleTheme" 
      >
        <MoonIcon v-if="!isMounted || !isDark" class="icon-md" />
        <SunIcon v-else class="icon-md" />
      </button>

      <button
        popovertarget="mobile-menu"
        class="btn ghost-btn icon-only mobile-btn-display"
        :aria-label="t('header.toggleMobileMenu')"
      >
        <Bars3Icon class="icon-md" />
      </button>
    </div>

    <MobileMenu :nav-links="navLinks" />
    </header>
</template>

<style scoped>
.site-header {
  z-index: 10;
  /* TODO: bg em telas menores */
  padding-block: var(--spacing-sm); 
  position: sticky;
  top: 0;
  align-items: center;
}

@keyframes slideDownOnce {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slide-down {
  animation: slideDownOnce 400ms cubic-bezier(0.33, 1, 0.68, 1) forwards;
}

/* Respeito por acessibilidade */
@media (prefers-reduced-motion: reduce) {
  .slide-down {
    animation: none;
  }
}

.header-name {
  font-weight: 700;
  font-size: var(--font-size-lg);
  text-wrap: nowrap;
  text-decoration: none;
}

.options {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

.lang-btn {
  padding-inline: var(--spacing-md);
  
  span {
    margin-left: var(--spacing-xs);
  }
}

.header-btn, .mobile-btn-display {
  height: 2.5rem;
  width: 2.5rem;
  padding-inline: 0;
  justify-content: center;
}

@media (min-width: 1280px) {
  nav {
    display: block;
  }

  .header-nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    isolation: isolate;

    transform: translateX(calc(var(--spacing-sm) * -1));

    > ul {
      display: flex;
      margin: 0;
      padding: 0;
      list-style: none;
      font-weight: 400;
      font-size: var(--font-size-sm);
    }

    a {
      display: block;
      color: var(--color-text-base);
      padding: var(--spacing-sm) var(--spacing-sm);
      text-decoration: none !important;

      transition: color var(--transition-medium);

      &:hover,
      &:focus-visible {
        color: var(--color-black);
      }
    }

    &::after {
      content: '';
      position: absolute;
      z-index: -1;
      background-color: var(--color-text-base);
      border-radius: 4px;

      top: calc(anchor(bottom) - 4px);
      left: calc(anchor(left) + var(--spacing-sm));
      right: calc(anchor(right) + var(--spacing-sm));
      bottom: calc(anchor(bottom) + 2px);

      position-anchor: --default-anchor;

      transition: var(--transition-medium);
    }

    &:has(a:hover)::after,
    &:has(a:focus)::after {
      top: anchor(top);
      left: anchor(left);
      right: anchor(right);
      bottom: anchor(bottom);
      border-radius: var(--spacing-sm);

      position-anchor: --active-link;

      background-color: var(--color-yellow);
      color: var(--color-bg-base);
    }

    li:hover,
    li:has(a:hover),
    li:has(a:focus-within) {
      anchor-name: --active-link;
    }

    li:has(.active) {
      anchor-name: --default-anchor;
    }
  }

  .mobile-btn-display {
    display: none !important;
  }
}
</style>