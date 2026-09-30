<script setup lang="ts">
import { useI18n, useLocalePath } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()

// Dados estáticos locais (fallback) para estruturar a interface
const featuredProjects = ref([
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
])

const resumeUrl = ref('/files/cv-fellipe-mayan.pdf')
</script>

<template>
  <div class="home-page">
    <!-- Seção Hero com Animação -->
    <MotionSlideUp :delay="0">
      <section class="hero-section">
        <h1 class="hero-title">{{ t('home.fallbackTitle') }}</h1>
        <p class="hero-subtitle">
           {{ t('home.heroSubtitle') }}
        </p>
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
                :src="project.thumbnailImage.horizontal.asset.url" 
                :alt="project.title"
                width="600"
                height="400"
                loading="lazy"
              />
            </div>
            <div class="project-info">
               <span class="project-category">{{ t(`home.projects.${project.categoryKey}`) }}</span>
              <h3>{{ project.title }}</h3>
               <p>{{ t(`home.projects.${project.descriptionKey}`) }}</p>
              
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