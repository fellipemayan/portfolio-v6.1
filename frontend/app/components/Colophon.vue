<script setup lang="ts">
import { useI18n, useLocalePath } from '#imports'

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

const { t } = useI18n()
const localePath = useLocalePath()

</script>


<template>
  <div class="colophon content-grid">
      <p>
        {{ t('footer.createdWith') }} <a href="https://nuxt.com" target="_blank">Nuxt.js</a> {{ t('footer.createdWithSuffix') }}
      <!-- </p>
      <p> -->
        {{ t('footer.iconsPrefix') }} <a href="https://heroicons.com" target="_blank">Heroicons</a>. {{ t('footer.motionPrefix') }} <a href="https://motion.dev" target="_blank">Motion.dev</a>.
        {{ t('footer.sourcePrefix') }} <a href="#" target="_blank">GitHub</a>.
      <!-- </p>
      <p> -->
        {{ t('footer.fontsPrefix') }} <a href="#">Zalando Sans</a> (&copy; 2025 The Zalando Sans Project Authors) {{ t('footer.and') }} <a href="#">NKDuy</a> (&copy; 2022 NKDuy).
      </p>
      <p>
        {{ t('footer.version') }} | {{ t('footer.lastUpdated' ) }} |
        <NuxtLink :to="localePath('/changelog')">{{ t('footer.changelog') }}</NuxtLink> | :)
      </p>
    </div>
  </template>

<style>
.colophon {  
  position: sticky;
  bottom: 0;
  z-index: -10;
  background-color: var(--color-bg-secondary);
  padding-block: var(--gap-lg);

  p {
    font-size: var(--font-size-sm);
    font-family: var(--font-family-mono);
    text-transform: uppercase;
    text-align: justify;
    text-align-last: justify;
    line-height: var(--line-height-md);

    strong {
      font-weight: 500;
    }

    &:not(:last-child) {
      margin-bottom: var(--spacing-md);
    }
    a {
      font-size: var(--font-size-sm);
      text-decoration: underline;
      &:hover {
        text-decoration-style: wavy;
      }
    }
  }
}

</style>