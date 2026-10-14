<script setup lang="ts">
import { computed } from 'vue'
import { useI18n, useLocalePath } from '#imports'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

const { t } = useI18n()
const localePath = useLocalePath()

interface SanityPaletteColor {
  background?: string
  foreground?: string
  population?: number
  title?: string
}

interface SanityImageMetadata {
  palette?: {
    dominant?: SanityPaletteColor
    vibrant?: SanityPaletteColor
    muted?: SanityPaletteColor
    darkMuted?: SanityPaletteColor
    lightVibrant?: SanityPaletteColor
  }
}

interface SanityImageWithMetadata {
  asset?: {
    url: string
    metadata?: SanityImageMetadata
  }
}

interface Project {
  slug: string | { current: string }
  title: string
  category?: string
  categoryKey?: string
  description?: string
  descriptionKey?: string
  thumbnailImage?: {
    horizontal?: SanityImageWithMetadata
    vertical?: SanityImageWithMetadata
    alt?: string
  }
  tags?: string[]
  externalLinks?: Array<{ url: string, label?: any }> 
  externalLink?: string
}

const props = withDefaults(defineProps<{
  project: Project
  layout?: 'grid' | 'list'
}>(), {
  layout: 'grid'
})

const projectSlug = computed(() => {
  return typeof props.project.slug === 'object' 
    ? props.project.slug.current 
    : props.project.slug
})

const mainExternalLink = computed(() => {
  if (props.project.externalLinks && props.project.externalLinks.length > 0) {
    return props.project.externalLinks[0]!.url
  }
  return props.project.externalLink || null
})

const hasVerticalImage = computed(() => {
  return !!props.project.thumbnailImage?.vertical?.asset?.url
})
</script>

<template>
  <article :class="['project-card', `layout-${layout}`]">
    <!-- Imagem e Link de Canto -->
    <div 
      class="project-image-wrapper" 
      :class="{ 'has-vertical': hasVerticalImage }"
    >
      <NuxtLink :to="localePath(`/projetos/${projectSlug}`)">
        
        <!-- Imagem Horizontal -->
        <NuxtImg 
          :src="project.thumbnailImage?.horizontal?.asset?.url || '/images/projects/misplica.jpg'" 
          :alt="project.title"
          width="600"
          height="400"
          loading="lazy"
          class="project-image img-horizontal"
        />

        <!-- Imagem Vertical (Mobile) -->
        <NuxtImg 
          v-if="hasVerticalImage"
          :src="project.thumbnailImage!.vertical!.asset!.url" 
          :alt="project.title"
          width="400"
          height="600"
          loading="lazy"
          class="project-image img-vertical"
        />

      </NuxtLink>

      <!-- Ícone flutuante: Aparece APENAS se houver link externo -->
      <a 
        v-if="mainExternalLink"
        :href="mainExternalLink"
        target="_blank"
        rel="noopener noreferrer"
        class="btn primary-btn icon-btn active-link-badge"
        :aria-label="t('home.viewExternal', 'Ver projeto externo')"
      >
        <ArrowTopRightOnSquareIcon class="icon-md" />
      </a>
    </div>

    <!-- Corpo do Card -->
    <div class="project-info">
      <div class="project-info-header"> 
        <!-- Título -->
      <h3 class="project-title">
        <NuxtLink :to="localePath(`/projetos/${projectSlug}`)">
          {{ project.title }}
        </NuxtLink>
      </h3>
      
      <!-- Tags -->
      <div class="project-tags">
        <span v-for="tag in project.tags" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
      </div>

      <!-- Descrição -->
      <p class="project-description">
        {{ project.description || t(`home.projects.${project.descriptionKey}`) }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  gap: var(--gap-sm);
  position: relative;
  background-color: var(--color-bg-base);
  transition: all 0.3s ease;
}

.project-info-header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-sm);
  justify-content: space-between;
  align-items: center;
}

.project-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 1em;
  border: 1px solid var(--color-border-overlay);
  background-color: var(--color-bg-muted);
  display: flex;
  flex-shrink: 0;
}

.project-image {
  display: block;
  width: 100%;
  height: auto; 
  aspect-ratio: auto;
  object-fit: cover;
  transition: transform var(--transition-medium, 0.3s ease);
}

.project-card:hover .project-image {
  transform: scale(1.05);
}

/* Link flutuante superior direito */
.active-link-badge {
  position: absolute;
  height: 2.5rem;
  width: 2.5rem;
  top: .5rem;
  right: .5rem;
  z-index: 2;
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
  transition: all 0.2s ease;
}

.icon-md {
  width: 1.5rem;
  height: 1.5rem;
}

.project-card:hover .active-link-badge {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto; /* Volta a ser clicável */
}

.img-vertical {
  display: none !important; 
}

@media (max-width: 768px) {
  .has-vertical .img-horizontal {
    display: none !important;
  }
  .has-vertical .img-vertical {
    display: block !important;
  }

  .active-link-badge {
    top: .25rem;
    right: .25rem;
    opacity: 1;
  }
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.project-title a {
  color: inherit;
  text-decoration: none;
}

.project-title a:hover {
  text-decoration: wavy underline;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: var(--font-size-xs, 0.75rem);
  font-family: var(--font-family-mono);
  padding: 0.2rem 0.6rem;
  background-color: var(--color-time-background-muted);
  border-radius: 4px;
  text-transform: uppercase;
}

.project-description {
  line-height: var(--line-height-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.layout-grid {
  flex-direction: column;
}

.layout-list {
  flex-direction: row;
  align-items: flex-start;
}

.layout-list .project-info {
  flex: 1;
}

@media (max-width: 768px) {
  .layout-list {
    flex-direction: column;
  }
  
  .layout-list .project-image-wrapper {
    flex: none;
    width: 100%;
    aspect-ratio: auto;
  }
}
</style>