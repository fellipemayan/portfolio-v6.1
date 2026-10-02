<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n, useLocalePath, useSanityQuery } from '#imports'
import { PortableText } from '@portabletext/vue'
import { ArrowLeftIcon } from '@heroicons/vue/20/solid'

const { locale, t } = useI18n()
const localePath = useLocalePath()

type ChangelogPage = {
  title?: {pt?: string; en?: string}
  content?: Record<string, any[] | undefined>
}

const changelogQuery = `*[_type == "changelogPage"][0]{title, content}`
const { data: sanityChangelog } = await useSanityQuery(changelogQuery)
const changelog = computed(() => sanityChangelog.value as ChangelogPage | null)

const getLocalized = (value: ChangelogPage['title']) => {
  if (!value) return ''
  return value[locale.value as 'pt' | 'en'] || value.pt || value.en || ''
}

const pageTitle = computed(() => getLocalized(changelog.value?.title) || t('changelog.title'))
const localizedContent = computed(() => changelog.value?.content?.[locale.value] || changelog.value?.content?.pt || [])

const portableTextComponents = {
  marks: {
    link: (props: any, {slots}: any) => h('a', {
      href: props.value.href,
      target: '_blank',
      rel: 'noopener noreferrer',
      class: 'external-link',
    }, slots.default?.()),
  },
}
</script>

<template>
  <main class="changelog-page">
    <NuxtLink :to="localePath('/')" class="btn ghost-btn back-link">
      <ArrowLeftIcon class="icon-md" /> {{ t('project.back') }}
    </NuxtLink>

    <header class="changelog-header">
      <h1>{{ pageTitle }}</h1>
    </header>

    <section class="content changelog-content">
      <PortableText v-if="localizedContent.length" :value="localizedContent" :components="portableTextComponents" />
      <p v-else>{{ t('changelog.empty') }}</p>
    </section>
  </main>
</template>

<style scoped>
.changelog-page {
  max-width: 52rem;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem;
}

.changelog-header {
  margin: 4rem 0 2rem;
}

.changelog-content {
  max-width: 46rem;
}

@media (max-width: 767px) {
  .changelog-page {
    padding-inline: 1rem;
  }
}
</style>
