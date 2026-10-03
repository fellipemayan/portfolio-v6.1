<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFetch, useI18n, useLocalePath } from '#imports'
import { Squares2X2Icon, Bars4Icon } from '@heroicons/vue/20/solid'

const router = useRouter()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const viewStyle = ref<'grid' | 'list'>('grid')
const displayLimit = ref(6)
const selectedCategory = ref('')

const { data: sanityProjects } = await useFetch<any[]>('/api/projects')

const getLocalized = (value: any) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale.value] || value.pt || value.en || ''
}

const projects = computed(() => {
  const source = sanityProjects.value || []

  return source.map((project: any) => ({
    ...project,
    slug: typeof project.slug === 'string' ? project.slug : project.slug?.current,
    title: getLocalized(project.title),
    category: getLocalized(project.category),
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

const categoryOptions = computed(() => {
  return [...new Set(projects.value.map((project: any) => project.category).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second, locale.value))
})

const filteredProjects = computed(() => {
  if (!selectedCategory.value) return projects.value
  return projects.value.filter((project: any) => project.category === selectedCategory.value)
})

const visibleProjects = computed(() => {
  return filteredProjects.value
    .filter((p: any) => p.isVisible !== false)
    .slice(0, displayLimit.value)
})

const hasMoreProjects = computed(() => {
  const totalVisible = filteredProjects.value.filter((p: any) => p.isVisible !== false).length
  return displayLimit.value < totalVisible
})

watch(selectedCategory, () => {
  displayLimit.value = 6
})

watch(locale, () => {
  selectedCategory.value = ''
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
  <main>
    
    <!-- CABEÇALHO E CONTROLES -->
    <section>
      <MotionSlideUp>
        <h1>{{ t('projects.title') }}</h1>
        <p>{{ t('projects.description') }}</p>
      </MotionSlideUp>

      <!-- Filtros e alternador Grid/Lista -->
      <MotionSlideUp :delay="0.1">
        <div>
          <div v-if="categoryOptions.length">
            <button
              type="button"
              @click="selectedCategory = ''"
            >
              {{ t('projects.allCategories') }}
            </button>
            <button
              v-for="category in categoryOptions"
              :key="category"
              type="button"
              @click="selectedCategory = category"
            >
              {{ category }}
            </button>
          </div>

          <div>
          <button 
            :aria-label="t('projects.gridView')"
            @click="viewStyle = 'grid'" 
          >
            <Squares2X2Icon />
          </button>
          <button 
            :aria-label="t('projects.listView')"
            @click="viewStyle = 'list'" 
          >
            <Bars4Icon />
          </button>
          </div>
        </div>
      </MotionSlideUp>
    </section>

    <!-- LISTA DE PROJETOS -->
    <ul>
      <MotionSlideUp 
        is="li"
        v-for="(project, index) in visibleProjects" 
        :key="project.slug"
        :delay="0.1 * (index % 6)" 
      >
        <article
          tabindex="0"
          role="link"
          :aria-label="t('projects.viewProjectAria', { title: project.title })"
          :aria-disabled="project.isComingSoon ? 'true' : undefined"
          :style="project.isComingSoon ? { opacity: 0.95 } : {}"
          @click="(e) => navigateToProject(project.slug, project.isComingSoon, e)"
          @keydown.enter.space.prevent="(e) => navigateToProject(project.slug, project.isComingSoon, e)"
        >
          
          <!-- THUMBNAIL RESPONSIVA (Native Picture) -->
          <div>
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
                loading="lazy"
                :data-cursor-text="project.isComingSoon ? t('projects.comingSoon') : t('projects.viewProject')"
                style="width: 100%; height: auto; object-fit: cover;"
              />
            </picture>
            <div v-else>{{ t('projects.missingImage') }}</div>

            <span v-if="project.isComingSoon" :aria-label="t('projects.comingSoon')">
              {{ t('projects.comingSoon') }}
            </span>
          </div>

          <!-- CONTEÚDO DO CARD -->
          <div>
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
            
            <ul>
              <li v-for="tag in project.tags" :key="tag">
                {{ tag }}
              </li>
            </ul>
            
            <p>{{ project.description || t(`projects.${project.descriptionKey}`) }}</p>
            
            <ul v-if="project.externalLinks?.length">
              <li v-for="link in project.externalLinks" :key="link.url">
                <a 
                  :href="link.url" 
                  target="_blank" 
                  rel="noopener noreferrer" 
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
    <MotionSlideUp v-if="hasMoreProjects" :delay="0.2">
      <button @click="loadMore">
        {{ t('projects.loadMore') }}
      </button>
    </MotionSlideUp>

  </main>
</template>