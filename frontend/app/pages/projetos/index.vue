<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch, useI18n, useLocalePath } from '#imports'
import { Squares2X2Icon, Bars4Icon } from '@heroicons/vue/20/solid'

const router = useRouter()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const viewStyle = ref<'grid' | 'list'>('grid')
const displayLimit = ref(6)

const fallbackProjects = [
  {
    slug: 'vagabuilder',
    title: 'VagaBuilder',
    descriptionKey: 'vagabuilderDescription',
    isComingSoon: false,
    isVisible: true,
    tags: ['Vue.js', 'Pinia', 'Game Design'],
    externalLinks: [{ label: 'GitHub', url: 'https://github.com/fellipemayan' }],
    thumbnailImage: {
      altKey: 'vagabuilderAlt',
      horizontal: { asset: { url: 'https://placehold.co/800x450/333/FFF?text=Horizontal' } },
      vertical: { asset: { url: 'https://placehold.co/640x800/333/FFF?text=Vertical' } }
    }
  },
  {
    slug: 'caixotim',
    title: 'Caixotim',
    descriptionKey: 'caixotimDescription',
    isComingSoon: true,
    isVisible: true,
    tags: ['Product Design', 'Desktop'],
    externalLinks: [],
    thumbnailImage: {
      altKey: 'caixotimAlt',
      horizontal: { asset: { url: 'https://placehold.co/800x450/111/FFF?text=Em+breve' } }
    }
  }
]

const { data: sanityProjects } = await useFetch<any[]>('/api/projects')

const getLocalized = (value: any) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale.value] || value.pt || value.en || ''
}

const projects = computed(() => {
  const source = sanityProjects.value?.length ? sanityProjects.value : fallbackProjects

  return source.map((project: any) => ({
    ...project,
    slug: typeof project.slug === 'string' ? project.slug : project.slug?.current,
    title: getLocalized(project.title),
    description: getLocalized(project.description),
    tags: project.tags?.map((tag: any) => getLocalized(tag.title || tag)) || [],
    externalLinks: project.externalLinks?.map((link: any) => ({
      ...link,
      label: getLocalized(link.label),
    })) || [],
    thumbnailImage: project.thumbnailHorizontalUrl || project.thumbnailVerticalUrl ? {
      horizontal: project.thumbnailHorizontalUrl ? {asset: {url: project.thumbnailHorizontalUrl}} : undefined,
      vertical: project.thumbnailVerticalUrl ? {asset: {url: project.thumbnailVerticalUrl}} : undefined,
      alt: getLocalized(project.thumbnailAlt),
    } : project.thumbnailImage ? {
      ...project.thumbnailImage,
      alt: getLocalized(project.thumbnailImage.alt),
    } : undefined,
  }))
})

const visibleProjects = computed(() => {
  return projects.value
    .filter((p: any) => p.isVisible !== false)
    .slice(0, displayLimit.value)
})

const hasMoreProjects = computed(() => {
  const totalVisible = projects.value.filter((p: any) => p.isVisible !== false).length
  return displayLimit.value < totalVisible
})

const loadMore = () => {
  displayLimit.value += 6
}

const navigateToProject = (slug: string, isComingSoon: boolean, e: Event) => {
  if (isComingSoon) return
  if ((e.target as HTMLElement).closest('.external-link, a, button')) return
  router.push(localePath(`/projetos/${slug}`))
}
</script>

<template>
  <main class="projects-page">
    
    <!-- CABEÇALHO E CONTROLES -->
    <section class="projects-header" style="display: flex; justify-content: space-between; align-items: end; margin-bottom: 2rem;">
      <MotionSlideUp>
        <h1>{{ t('projects.title') }}</h1>
        <p>{{ t('projects.description') }}</p>
      </MotionSlideUp>

      <!-- Toggle Grid/List -->
      <MotionSlideUp :delay="0.1">
        <div class="view-toggle" style="display: flex; gap: 0.5rem;">
          <button 
          class="btn icon-only secondary-btn" 
            :class="{ active: viewStyle === 'grid' }"
            :aria-label="t('projects.gridView')"
            @click="viewStyle = 'grid'" 
          >
            <Squares2X2Icon class="icon-md" />
          </button>
          <button 
            class="btn icon-only secondary-btn" 
            :class="{ active: viewStyle === 'list' }"
            :aria-label="t('projects.listView')"
            @click="viewStyle = 'list'" 
          >
            <Bars4Icon class="icon-md" />
          </button>
        </div>
      </MotionSlideUp>
    </section>

    <!-- LISTA DE PROJETOS -->
    <ul :class="['breakout project-list', viewStyle]">
      <MotionSlideUp 
        is="li"
        v-for="(project, index) in visibleProjects" 
        :key="project.slug"
        :delay="0.1 * (index % 6)" 
        :class="`card-${viewStyle}`"
      >
        <article
          class="project-card-article"
          :class="{ 'coming-soon': project.isComingSoon }"
          tabindex="0"
          role="link"
          :aria-label="t('projects.viewProjectAria', { title: project.title })"
          :aria-disabled="project.isComingSoon ? 'true' : undefined"
          :style="project.isComingSoon ? { opacity: 0.95 } : {}"
          @click="(e) => navigateToProject(project.slug, project.isComingSoon, e)"
          @keydown.enter.space.prevent="(e) => navigateToProject(project.slug, project.isComingSoon, e)"
        >
          
          <!-- THUMBNAIL RESPONSIVA (Native Picture) -->
          <div class="thumbnail-container">
            <picture v-if="project.thumbnailImage?.horizontal?.asset?.url || project.thumbnailImage?.vertical?.asset?.url">
              <source 
                v-if="project.thumbnailImage?.vertical?.asset?.url"
                media="(max-width: 767px)" 
                :srcset="project.thumbnailImage.vertical.asset.url" 
              />
              <source 
                v-if="project.thumbnailImage?.horizontal?.asset?.url"
                media="(min-width: 768px)" 
                :srcset="project.thumbnailImage.horizontal.asset.url" 
              />
              <img 
                :src="project.thumbnailImage?.horizontal?.asset?.url || project.thumbnailImage?.vertical?.asset?.url" 
                :alt="project.thumbnailImage?.alt || t('projects.missingImage')"
                class="thumbnail" 
                loading="lazy"
                :data-cursor-text="project.isComingSoon ? t('projects.comingSoon') : t('projects.viewProject')"
                style="width: 100%; height: auto; object-fit: cover;"
              />
            </picture>
            <div v-else class="thumbnail-missing">{{ t('projects.missingImage') }}</div>

            <span v-if="project.isComingSoon" class="coming-soon-tag" :aria-label="t('projects.comingSoon')">
              {{ t('projects.comingSoon') }}
            </span>
          </div>

          <!-- CONTEÚDO DO CARD -->
          <div class="project-card-content">
            <h3 :data-cursor-text="project.isComingSoon ? t('projects.comingSoon') : t('projects.viewProject')">
              <NuxtLink 
                :to="project.isComingSoon ? '#' : localePath(`/projetos/${project.slug}`)"
                tabindex="-1"
                :aria-label="project.title"
                :style="project.isComingSoon ? { pointerEvents: 'none', color: '#aaa' } : {}"
              >
                {{ project.title }}
              </NuxtLink>
            </h3>
            
            <ul class="tag-list">
              <li v-for="tag in project.tags" :key="tag" class="tag">
                {{ tag }}
              </li>
            </ul>
            
            <p>{{ project.description || t(`projects.${project.descriptionKey}`) }}</p>
            
            <ul v-if="project.externalLinks?.length" class="link-list">
              <li v-for="link in project.externalLinks" :key="link.url">
                <a 
                  :href="link.url" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="external-link"
                >
                  {{ link.label }}
                </a>
              </li>
            </ul>
          </div>
        </article>
      </MotionSlideUp>
    </ul>

    <!-- BOTÃO CARREGAR MAIS -->
    <MotionSlideUp v-if="hasMoreProjects" :delay="0.2" style="text-align: center; margin-top: 3rem;">
      <button class="btn secondary-btn" @click="loadMore">
        {{ t('projects.loadMore') }}
      </button>
    </MotionSlideUp>

  </main>
</template>