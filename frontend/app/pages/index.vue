<script setup lang="ts">
import { computed, h } from 'vue'
import { useFetch, useI18n, useLocalePath } from '#imports'
import { PortableText } from '@portabletext/vue'

const { locale, t } = useI18n()
const localePath = useLocalePath()

// Dados estáticos locais (fallback) para estruturar a interface
const fallbackProjects = [
  {
    slug: 'misplica',
    title: 'MISplica',
     categoryKey: 'misplica.category',
     descriptionKey: 'misplica.description',
    thumbnailImage: { horizontal: { asset: { url: '/images/projects/misplica.jpg' } } },
    tags: ['Vue.js', 'Nuxt', 'UI/UX']
  },
  {
    slug: 'vagabuilder',
    title: 'VagaBuilder',
     categoryKey: 'vagabuilder.category',
     descriptionKey: 'vagabuilder.description',
    thumbnailImage: { horizontal: { asset: { url: '/images/projects/vagabuilder.jpg' } } },
    tags: ['JavaScript', 'Vue', 'Design System']
  }
]

type HomePageData = {
  hero?: {pt?: any[]; en?: any[]}
  resume?: {pt?: string; en?: string}
}

type HomeResponse = {
  homePage?: {hero?: {pt?: any[]; en?: any[]}; resumePt?: string; resumeEn?: string}
  projects?: any[]
}

const { data: homeData } = await useFetch<HomeResponse>('/api/home')
const sanityProjects = computed(() => homeData.value?.projects || [])
const homePage = computed(() => {
  const page = homeData.value?.homePage
  if (!page) return null
  return {
    hero: page.hero,
    resume: {pt: page.resumePt, en: page.resumeEn},
  } as HomePageData
})

const getLocalized = (value: any) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale.value] || value.pt || value.en || ''
}

const featuredProjects = computed(() => {
  const source = sanityProjects.value?.length ? sanityProjects.value : fallbackProjects

  return source.map((project) => ({
    ...project,
    slug: typeof project.slug === 'string' ? project.slug : project.slug?.current,
    title: getLocalized(project.title),
    category: getLocalized(project.category),
    description: getLocalized(project.description),
    tags: project.tags?.map((tag: any) => getLocalized(tag.title || tag)) || [],
    thumbnailImage: project.thumbnailHorizontalUrl ? {
      horizontal: {asset: {url: project.thumbnailHorizontalUrl}},
      alt: getLocalized(project.thumbnailAlt),
    } : project.thumbnailImage,
  }))
})

const localizedHeroContent = computed(() => homePage.value?.hero?.[locale.value as 'pt' | 'en'] || homePage.value?.hero?.pt || [])
const resumeUrl = computed(() => homePage.value?.resume?.[locale.value as 'pt' | 'en'] || homePage.value?.resume?.pt || '/files/cv-fellipe-mayan.pdf')

const heroPortableTextComponents = {
  block: {
    h1: (_: any, {slots}: any) => h('h1', {class: 'hero-title'}, slots.default?.()),
    h2: (_: any, {slots}: any) => h('h2', {class: 'hero-subtitle'}, slots.default?.()),
    normal: (_: any, {slots}: any) => h('p', {class: 'hero-subtitle'}, slots.default?.()),
  },
  marks: {
    em: (_: any, {slots}: any) => h('em', slots.default?.()),
    spanId: (props: any, {slots}: any) => h('span', {id: props.value.id}, slots.default?.()),
  },
}
</script>

<template>
  <div class="home-page">
    <!-- Seção Hero com Animação -->
    <MotionSlideUp :delay="0">
      <section class="hero-section">
        <template v-if="localizedHeroContent.length">
          <PortableText :value="localizedHeroContent" :components="heroPortableTextComponents" />
        </template>
        <template v-else>
          <h1 class="hero-title">{{ t('home.fallbackTitle') }}</h1>
          <p class="hero-subtitle">{{ t('home.heroSubtitle') }}</p>
        </template>
        <ul >
           <li>{{ t('home.skills.informationArchitecture') }}</li>
           <li>{{ t('home.skills.uxUi') }}</li>
           <li>{{ t('home.skills.graphicEditorial') }}</li>
           <li>{{ t('home.skills.frontend') }}</li>
        </ul>
        <div class="hero-actions">
          <NuxtLink :to="localePath('/projetos')" class="btn primary-btn">
            {{ t('home.viewProjects') }}
          </NuxtLink>
          <a :href="resumeUrl" target="_blank" rel="noopener noreferrer" class="btn secondary-btn">
             {{ t('home.resume') }}
          </a>
        </div>
      </section>
    </MotionSlideUp>

    <!-- Seção de Projetos em Destaque com Animação em Cascata -->
    <MotionSlideUp :delay="150">
      <section class="featured-projects-section">
        <div class="section-header">
          <h2>{{ t('home.featuredProjects') }}</h2>
          <NuxtLink :to="localePath('/projetos')" class="view-all-link">
            {{ t('home.viewAll') }} →
          </NuxtLink>
        </div>

        <div class="projects-grid">
          <div v-for="project in featuredProjects" :key="project.slug" class="project-card">
            <div class="project-image-wrapper">
              <NuxtImg 
                :src="project.thumbnailImage?.horizontal?.asset?.url || '/images/projects/misplica.jpg'" 
                :alt="project.title"
                width="600"
                height="400"
                loading="lazy"
              />
            </div>
            <div class="project-info">
               <span class="project-category">{{ project.category || t(`home.projects.${project.categoryKey}`) }}</span>
              <h3>
                <NuxtLink :to="localePath(`/projetos/${project.slug}`)">
                  {{ project.title }}
                </NuxtLink>
              </h3>
               <p>{{ project.description || t(`home.projects.${project.descriptionKey}`) }}</p>
              
              <div class="project-tags">
                <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionSlideUp>

    <MotionSlideUp :delay="300">
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">
            {{ t('home.ctaTitle') }}
          </h2>
          <p class="cta-description">
            {{ t('home.ctaDescription') }}
          </p>
          <div class="cta-actions">
            <NuxtLink :to="localePath('/contato')" class="btn primary-btn">
              {{ t('home.ctaContact') }}
            </NuxtLink>
            <NuxtLink :to="localePath('/projetos')" class="btn secondary-btn">
              {{ t('home.viewProjects') }}
            </NuxtLink>
          </div>
        </div>
      </section>
    </MotionSlideUp>
  </div>
</template>

<style scoped>

</style>