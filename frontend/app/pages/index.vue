<script setup lang="ts">
import { computed, h } from 'vue'
import { useFetch, useI18n, useLocalePath } from '#imports'
import { PortableText } from '@portabletext/vue'

const { locale, t } = useI18n()
const localePath = useLocalePath()

type HomePageData = {
  hero?: {pt?: any[]; en?: any[]}
  resume?: {pt?: string; en?: string}
  roles?: string[]
}

type HomeResponse = {
  homePage?: {hero?: {pt?: any[]; en?: any[]}; resumePt?: string; resumeEn?: string; roles?: string[]}
  projects?: any[]
}

const { data: homeData } = await useFetch<HomeResponse>('/api/home')
const sanityProjects = computed(() => homeData.value?.projects || [])
const homePage = computed(() => {
  const page = homeData.value?.homePage
  if (!page) return null
  return {
    hero: page.hero,
    roles: page.roles, 
    resume: {pt: page.resumePt, en: page.resumeEn},
  } as HomePageData
})

const getLocalized = (value: any) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale.value] || value.pt || value.en || ''
}

const featuredProjects = computed(() => {
  const source = sanityProjects.value || []

  return source.map((project) => ({
    ...project,
    // Extrai o slug do formato do Sanity
    slug: typeof project.slug === 'string' ? project.slug : project.slug?.current,
    
    // Textos localizados
    title: getLocalized(project.title),
    category: getLocalized(project.category),
    description: getLocalized(project.description),
    tags: project.tags?.map((tag: any) => getLocalized(tag.title || tag)) || [],
    
    // Mantém o suporte antigo (thumbnailHorizontalUrl) mas privilegia o formato novo de thumbnailImage do Sanity
    thumbnailImage: {
      horizontal: {
        asset: { 
          url: project.thumbnailImage?.horizontal?.asset?.url || project.thumbnailHorizontalUrl || '',
          metadata: project.thumbnailImage?.horizontal?.asset?.metadata 
        }
      },
      vertical: {
        asset: { 
          url: project.thumbnailImage?.vertical?.asset?.url || project.thumbnailVerticalUrl || '',
          metadata: project.thumbnailImage?.vertical?.asset?.metadata 
        }
      },
      alt: getLocalized(project.thumbnailImage?.alt || project.thumbnailAlt)
    },
    
    // Garante que o array de links externos passe para o card poder exibir o ícone
    externalLinks: project.externalLinks || []
  }))
})

const localizedHeroContent = computed(() => homePage.value?.hero?.[locale.value as 'pt' | 'en'] || homePage.value?.hero?.pt || [])

const localizedRoles = computed(() => {
  const rawRoles = homePage.value?.roles || []
  return rawRoles.map((role: any) => getLocalized(role))
})


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

const { isReducedMotion } = useAnimationPreferences()

const slideUp = (delay = 0) => {
  if (isReducedMotion.value) return undefined
  
  return {
    initial: { y: 40, opacity: 0 },
    visibleOnce: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 400, 
        delay, 
        ease: [0.33, 1, 0.68, 1] 
      } 
    }
  }
}
</script>

<template>
    <!-- Seção Hero com Animação -->
    <section class="hero-section" v-motion="slideUp(0)">
      <template v-if="localizedHeroContent.length">
        <PortableText :value="localizedHeroContent" :components="heroPortableTextComponents" />
      </template>
      <template v-else>
        <h1 class="hero-title">{{ t('home.fallbackTitle') }}</h1>
      </template>
      <ul v-if="localizedRoles.length" class="skills-list">
      <li v-for="(role, index) in localizedRoles" :key="index">
        {{ role }}
      </li>
    </ul>
      <div class="actions">
        <NuxtLink :to="localePath('/contato')" class="btn primary-btn">
          {{ t('home.enterInContact') }}
        </NuxtLink>
        <a :href="resumeUrl" target="_blank" rel="noopener noreferrer" class="btn secondary-btn">
           {{ t('home.resume') }}
        </a>
      </div>
    </section>

    <!-- Seção de Projetos em Destaque com Animação em Cascata -->
    <section class="featured-section" v-motion="slideUp(150)">
      <h2>{{ t('home.featuredProjects') }}</h2>

      <ul class="projects-grid">
        <li v-for="project in featuredProjects" :key="project.slug">
          <ProjectCard :project="project" layout="grid" />
        </li>
      </ul>
    </section>

    <!-- <section class="cta-section" v-motion="slideUp(300)">
      <h2 class="cta-title">
        {{ t('home.ctaTitle') }}
      </h2>
      <p class="cta-description">
        {{ t('home.ctaDescription') }}
      </p>
      <div class="actions">
        <NuxtLink :to="localePath('/contato')" class="btn primary-btn">
          {{ t('home.ctaContact') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/projetos')" class="btn secondary-btn">
          {{ t('home.viewProjects') }}
        </NuxtLink>
      </div>
    </section> -->
</template>

<style scoped>

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-muted);
  list-style: none;
  padding: 0;

  & li:not(:first-child)::before {
    content: '•';
    margin-right: var(--spacing-sm);
  }
}

.actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--gap-md);
}


.featured-section {
  display: flex;
  flex-direction: column;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--gap-md);
}

.view-all-link {
  text-decoration: none;
  /* transform: translateX(var(--spacing-lg)); */
}
</style>