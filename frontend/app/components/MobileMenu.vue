<script setup lang="ts">
import { useI18n, useLocalePath } from '#imports'
import { XMarkIcon } from '@heroicons/vue/20/solid'

defineProps<{
  navLinks: Array<{ key: string; path: string }>
}>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div
    id="mobile-menu"
    popover="auto"
    class="mobile-menu grid-content"
    autofocus
  >
    <h1 class="content">Menu</h1>
    
    <nav class="mobile-nav content">
      <ul>
        <li v-for="(item, idx) in navLinks" :key="item.path || idx">
          <NuxtLink
            :to="localePath(item.path)"
            active-class="active"
            popovertarget="mobile-menu"
            popovertargetaction="hide"
          >
            {{ t(`nav.${item.key}`) }}
          </NuxtLink>
        </li>
      </ul>
      <span aria-hidden="true" class="highlight-text">//////////////</span>
    </nav>

    <button
      popovertarget="mobile-menu"
      popovertargetaction="hide"
      class="btn secondary-btn close-btn right icon-only"
    >
      <XMarkIcon class="icon-md" />
    </button>
  </div>
</template>