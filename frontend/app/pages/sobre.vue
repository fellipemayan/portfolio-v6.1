<script setup lang="ts">
import { computed } from 'vue'
import { useFetch, useI18n, useLocalePath } from '#imports'

const { locale, t } = useI18n()
const localePath = useLocalePath()

type AboutData = {
  currentFocus?: Array<{title: any}>
  experiences?: any[]
  education?: any[]
  research?: any[]
  clients?: Array<{name: any}>
}

const { data: aboutData } = await useFetch<AboutData>('/api/about')

const getLocalized = (value: any) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale.value] || value.pt || value.en || ''
}

const formatDate = (value?: string) => {
  if (!value) return ''
  return new Intl.DateTimeFormat(locale.value, {month: 'short', year: 'numeric'}).format(new Date(`${value}T00:00:00`))
}

const currentEndeavorItems = computed(() => {
  if (aboutData.value?.currentFocus?.length) {
    return aboutData.value.currentFocus.map((item: any) => getLocalized(item.title))
  }
  return []
})

const experienceItems = computed(() => {
  if (aboutData.value?.experiences?.length) {
    return aboutData.value.experiences.map((item: any) => ({
      title: getLocalized(item.title),
      company: getLocalized(item.company),
      type: getLocalized(item.employmentType),
      location: getLocalized(item.location),
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      isCurrent: item.isCurrent,
      description: getLocalized(item.description),
      logo: item.logoUrl ? {
        src: item.logoUrl,
        alt: getLocalized(item.logoAlt),
      } : undefined,
    }))
  }

  return []
})

const educationItems = computed(() => {
  if (aboutData.value?.education?.length) {
    return aboutData.value.education.map((item: any) => ({
      title: getLocalized(item.title),
      institution: getLocalized(item.institution),
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      isCurrent: item.isCurrent,
      description: getLocalized(item.description),
    }))
  }

  return []
})

const researchItems = computed(() => {
  if (aboutData.value?.research?.length) {
    return aboutData.value.research.map((item: any) => ({
      title: getLocalized(item.title),
      event: getLocalized(item.event),
      location: getLocalized(item.location),
      publicationYear: item.publicationYear,
      description: getLocalized(item.description),
      publicationUrl: item.publicationUrl,
    }))
  }

  return []
})

const clientItems = computed(() =>
  aboutData.value?.clients?.map((item: any) => getLocalized(item.name)) || [],
)
</script>

<template>
  <div class="about-page">
    <!-- Seção de Introdução -->
    <Motion
      as="section"
      :initial="{ y: 30, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 400, ease: [0.33, 1, 0.68, 1] } }"
      class="about-hero"
    >
      <h1>{{ t('about.title') }}</h1>
      <p>
        {{ t('about.introBeforeYears') }} <span data-cursor-text="!">{{ t('about.years') }}</span> {{ t('about.introAfterYears') }}
      </p>
      <p>{{ t('about.endeavorsIntro') }}</p>
      <ul class="endeavors-list">
        <li v-for="(endeavor, index) in currentEndeavorItems" :key="index">
          {{ endeavor }}
        </li>
      </ul>
    </Motion>

    <!-- Seção de Experiência -->
    <Motion
      as="section"
      :initial="{ y: 30, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 400, delay: 100, ease: [0.33, 1, 0.68, 1] } }"
      class="resume-section"
    >
      <h2>{{ t('about.experienceTitle') }}</h2>
      <ul class="resume-list">
        <li v-for="(experience, index) in experienceItems" :key="index" class="resume-item">
          <img v-if="experience.logo" :src="experience.logo.src" :alt="experience.logo.alt || experience.company" class="resume-logo" />
          <div class="item-header">
            <h3>{{ experience.title }}</h3>
            <p class="metadata-duration">
              {{ experience.startDate }} - {{ experience.isCurrent ? t('about.present') : experience.endDate }}
            </p>
          </div>
          <div class="info">
            <p class="metadata">
              <span>{{ experience.company }}</span>
              <span>{{ experience.type }}</span>
              <span>{{ experience.location }}</span>
            </p>
            <p class="description">{{ experience.description }}</p>
          </div>
        </li>
      </ul>
    </Motion>

    <!-- Seção de Educação -->
    <Motion
      as="section"
      :initial="{ y: 30, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 400, delay: 200, ease: [0.33, 1, 0.68, 1] } }"
      class="resume-section"
    >
      <h2>{{ t('about.educationTitle') }}</h2>
      <ul class="resume-list">
        <li v-for="(edu, index) in educationItems" :key="index" class="resume-item">
          <div class="item-header">
            <h3>{{ edu.title }}</h3>
            <p class="metadata-duration">
              {{ edu.startDate }} - {{ edu.isCurrent ? t('about.present') : edu.endDate }}
            </p>
          </div>
          <div class="info">
            <p class="metadata">
              <span>{{ edu.institution }}</span>
            </p>
            <p class="description">{{ edu.description }}</p>
          </div>
        </li>
      </ul>
    </Motion>

    <!-- Seção de Pesquisa -->
    <Motion
      as="section"
      :initial="{ y: 30, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 400, delay: 300, ease: [0.33, 1, 0.68, 1] } }"
      class="resume-section"
    >
      <h2>{{ t('about.researchTitle') }}</h2>
      <ul class="resume-list">
        <li v-for="(item, index) in researchItems" :key="index" class="resume-item">
          <h3>{{ item.title }}</h3>
          <div class="info">
            <p class="metadata">
              <span class="first-item">{{ item.event }}</span>
              <span>{{ item.location }}</span>
              <span>{{ item.publicationYear }}</span>
            </p>
            <p class="description">{{ item.description }}</p>
            <a v-if="item.publicationUrl" :href="item.publicationUrl" target="_blank" rel="noopener noreferrer" class="external-link">
              {{ t('about.viewPublication') }}
            </a>
          </div>
        </li>
      </ul>
    </Motion>

    <!-- Seção de Clientes -->
    <Motion
      v-if="clientItems.length"
      as="section"
      :initial="{ y: 30, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 400, delay: 400, ease: [0.33, 1, 0.68, 1] } }"
      class="resume-section"
    >
      <h2>{{ t('about.clientsTitle') }}</h2>
      <ul class="client-list">
        <li v-for="client in clientItems" :key="client">{{ client }}</li>
      </ul>
    </Motion>

    <!-- Seção CTA (Call to Action) Final -->
    <Motion
      as="section"
      :initial="{ y: 30, opacity: 0 }"
      :enter="{ y: 0, opacity: 1, transition: { duration: 400, delay: 400, ease: [0.33, 1, 0.68, 1] } }"
      class="full-width cta-about-section"
      id="cta"
    >
      <h2>{{ t('about.ctaTitle') }}</h2>
      <p>{{ t('about.ctaDescription') }}</p>
      <div class="cta-actions">
        <NuxtLink :to="localePath('/contato')" class="btn primary-btn">
          {{ t('about.ctaContact') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/projetos')" class="btn secondary-btn">
          {{ t('home.viewProjects') }}
        </NuxtLink>
      </div>
    </Motion>
  </div>
</template>
