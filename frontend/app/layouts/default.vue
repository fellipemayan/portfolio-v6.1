<script setup lang="ts">
import { useWindowScroll, useWindowSize } from '@vueuse/core'
import { ArrowUpIcon } from '@heroicons/vue/20/solid'

const { y } = useWindowScroll()
const { height } = useWindowSize()

const showScrollToTop = computed(() => y.value > height.value)

const scrollToTop = () => {
  window.scrollTo({ 
    top: 0, 
    behavior: 'smooth' 
  })
}
</script>

<template>
  <div class="app-wrapper">
    <Header />
    <main class="main-content content-grid">
      <slot />
    </main>
    <Footer />
    <Colophon />
    <Presence>
      <Motion
        v-if="showScrollToTop"
        as="button"
        class="btn primary-btn icon-only scroll-to-top"
        @click="scrollToTop"
        aria-label="Voltar ao topo"
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ 
          opacity: 1, 
          y: 0, 
          transition: { duration: 300, ease: [0.33, 1, 0.68, 1] } 
        }"
        :leave="{ 
          opacity: 0, 
          y: 20, 
          transition: { duration: 300, ease: [0.33, 1, 0.68, 1] } 
        }"
      >
        <ArrowUpIcon class="icon-md" />
      </Motion>
    </Presence>
  </div>
</template>

<style scoped>
.scroll-to-top {
  height: 2.5rem;
  width: 2.5rem;
  padding-inline: 0;
  justify-content: center;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>