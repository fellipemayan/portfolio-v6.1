<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useLocalePath, useI18n } from '#imports'

const localePath = useLocalePath()
const { t } = useI18n()
const route = useRoute()

defineProps<{
  links: Array<{
    key: string
    path: string
    isTranslationKey?: boolean
    label?: string
  }>
}>()

const { slideUp } = useAnimations()

const listRef = ref<HTMLElement | null>(null)
const indicatorTop = ref(0)
const indicatorOpacity = ref(0)

// Bloqueia qualquer aparição visual no carregamento
const isReady = ref(false) 

const updateIndicator = () => {
  if (!listRef.value) return

  const activeEl = listRef.value.querySelector('.nav-link.active') as HTMLElement
  
  if (activeEl) {
    const listRect = listRef.value.getBoundingClientRect()
    const activeRect = activeEl.getBoundingClientRect()

    indicatorTop.value = activeRect.top - listRect.top + (activeRect.height / 2)
    indicatorOpacity.value = 1
  } else {
    indicatorOpacity.value = 0
  }
}

watch(() => route.path, () => {
  nextTick(() => {
    updateIndicator()
    setTimeout(updateIndicator, 50)
    setTimeout(updateIndicator, 300) 
  })
}, { immediate: true })

onMounted(() => {
  updateIndicator()
  window.addEventListener('resize', updateIndicator)

  // Dá tempo suficiente para o navegador renderizar todas as fontes e margens.
  // Somente após 500ms ele injeta a classe que torna o ponto visível.
  setTimeout(() => {
    isReady.value = true
  }, 500)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateIndicator)
})
</script>

<template>
  <aside class="side-nav">
    <nav>
      <ul 
        ref="listRef" 
        class="nav-list"
        :class="{ 'is-ready': isReady }"
        :style="{
          '--indicator-top': `${indicatorTop}px`,
          '--indicator-opacity': indicatorOpacity
        }"
      >
        <li v-for="item in links" :key="item.path" v-motion="slideUp(0)">
          <NuxtLink
            :to="item.isTranslationKey ? localePath(item.path) : item.path"
            exact-active-class="active"
            class="nav-link"
          >
            {{ item.isTranslationKey ? t(`nav.${item.key}`) : item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.side-nav {
  position: sticky;
  top: calc(56px + var(--gap-xl) + var(--spacing-xs)); 
  align-self: start; 
}

.nav-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* 1. ESTADO DE CARREGAMENTO (Escondido) */
.nav-list::before {
  content: '';
  position: absolute;
  left: 0;
  top: var(--indicator-top, 0px);
  
  /* FORÇA opacidade 0 ignorando a variável do Vue até estabilizar */
  opacity: 0;
  
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--color-time-base);
  pointer-events: none;
  transform: translateY(-50%);
  z-index: 1;

  /* FORÇA zero animação. O ponto teletransporta invisível enquanto a página pula */
  transition: none;
}

/* 2. ESTADO ESTÁVEL (Visível e Animado) */
.nav-list.is-ready::before {
  /* Agora sim passa a ler a variável (que será 1 se tiver link ativo) */
  opacity: var(--indicator-opacity, 0);
  
  /* Ativa as animações para os cliques subsequentes */
  transition: top 0.35s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.25s ease;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  
  transition: transform 0.3s ease, color 0.3s ease;
  user-select: none;
  transform-origin: left center;
}

.nav-link:hover,
.nav-link:focus-visible {
  color: var(--color-text-base);
}

.nav-link.active {
  transform: translateX(1rem); 
  color: var(--color-time-strong);
}

@media (max-width: 1280px) {
  .side-nav {
    display: none;
  }
}
</style>