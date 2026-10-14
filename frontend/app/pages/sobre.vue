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
  return new Intl.DateTimeFormat(locale.value, { year: 'numeric' }).format(new Date(`${value}T00:00:00`))}  

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
      logoUrl: item.logoUrl || '',
      logoAlt: getLocalized(item.logoAlt) || '',
    }))
  }

  return []
})

const educationItems = computed(() => {
  if (aboutData.value?.education?.length) {
    return aboutData.value.education.map((item: any) => ({
      title: getLocalized(item.title),
      degree: getLocalized(item.degree),
      institution: getLocalized(item.institution),
      startDate: formatDate(item.startDate),
      endDate: formatDate(item.endDate),
      isCurrent: item.isCurrent,
      description: getLocalized(item.description),
      logoUrl: item.logoUrl || item.logo?.asset?.url || '',
      logoAlt: getLocalized(item.logoAlt) || '',
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

const { slideUp } = useAnimations()

</script>

<template>
  <section
    class="hero-section"
  >
    <h1 v-motion="slideUp(0)">{{ t('about.title') }}</h1>
    <p v-motion="slideUp(100)">
      {{ t('about.introBeforeYears') }} <span data-cursor-text="!">{{ t('about.years') }}</span> {{ t('about.introAfterYears') }}
    </p>
    <p v-motion="slideUp(200)">{{ t('about.endeavorsIntro') }}</p>
    <ul class="endeavors-list">
      <li v-for="(endeavor, index) in currentEndeavorItems" :key="index" v-motion="slideUp(300+index*50)">
        {{ endeavor }}
      </li>
    </ul>
  </section>

  <section class="resume-section half-left">
    <h2 v-motion="slideUp(0)">{{ t('about.experienceTitle') }}</h2>
    <ul class="resume-list">
      <li v-for="(experience, index) in experienceItems" :key="index" class="resume-item" v-motion="slideUp(100+index*50)">
        <div class="item-header">
          <img v-if="experience.logoUrl" :src="experience.logoUrl" :alt="experience.company" class="company-logo" />
          <h3>{{ experience.company }}</h3>

          <span class="item-dutarion">{{ experience.startDate }} - {{ experience.isCurrent ? t('about.present') : experience.endDate }}</span>
        </div>
        <ul class="metadata">
          <li>{{ experience.title }}</li>
          <li>{{ experience.location }}</li>
        </ul>
      </li>
    </ul>
  </section>

  <section
    v-if="educationItems.length"
    class="resume-section half-right"
  >
  <h2 v-motion="slideUp(0)">{{ t('about.educationTitle') }}</h2>
    <ul class="resume-list">
      <li v-for="(edu, index) in educationItems" :key="index" class="resume-item" v-motion="slideUp(100+index*50)">
        <div class="item-header">
          <img v-if="edu.logoUrl" :src="edu.logoUrl" :alt="edu.logoAlt || edu.institution" class="company-logo" />
          <h3>{{ edu.institution }}</h3>
          <span class="item-dutarion">{{ edu.startDate }} - {{ edu.isCurrent ? t('about.present') : edu.endDate }}</span class="item-dutarion">
        </div>
          <ul class="metadata">
          <li>{{ edu.title }}</li>
          <li>{{ edu.degree }}</li>
        </ul>
      </li>
    </ul>
  </section>

  <!-- <section
    v-if="researchItems.length"
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
  </section> -->

  <section
    class="resume-section"
  >
    <div class="resume-header">
      <h2 v-motion="slideUp(0)">{{ t('about.clientsTitle') }}</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
    <ul class="client-list">
      <li v-for="client in clientItems" :key="client" v-motion="slideUp(100)">{{ client }}</li>
    </ul>
  </section>

  <section
    class="cta-about-section"
    id="cta"
  >
    <h2 v-motion="slideUp(0)">{{ t('about.ctaTitle') }}</h2>
    <p class="about-descriprion" v-motion="slideUp(100)">{{ t('about.ctaDescription') }}</p>
    <div class="actions" v-motion="slideUp(200)">
      <NuxtLink :to="localePath('/contato')" class="btn primary-btn">
        {{ t('about.ctaContact') }}
      </NuxtLink>
      <NuxtLink :to="localePath('/projetos')" class="btn secondary-btn">
        {{ t('home.viewProjects') }}
      </NuxtLink>
    </div>
  </section>
</template>


<style scoped>
.endeavors-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);

  li {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    &::before {
      content: '⬩';
      color: var(--color-time-strong);
      font-weight: bold;
      display: inline-block;
      margin-right: var(--spacing-sm);
    }
  }
}

.company-logo {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
  border-radius: 0.25rem;
  border: 1px solid var(--color-border-overlay);
}

.resume-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);

  h3 {
    font-size: var(--font-size-md);
  }

  > li {
    display: flex;
    flex-direction: column;
    padding-bottom: var(--spacing-sm);
    
    &:not(:last-child) {
      border-bottom: 1px solid var(--color-border);
   }
}
}

.item-header {
  display: flex;
  gap: var(--spacing-sm);
  align-items: flex-end;

  .item-dutarion {
    margin-left: auto;
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
  }
}

.resume-item > ul {
  margin-top: var(--spacing-sm);
  display: flex;
  color: var(--color-text-muted);
}

.metadata {
  display: flex;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);

  li:not(:last-child)::after {
    content: '/';
    margin-left: var(--spacing-sm);
  }
}

.client-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gap-md);
}

@media (max-width: 768px) {
  .half-left, .half-right {
    grid-column: content;
  }
}
</style>