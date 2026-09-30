<script setup lang="ts">
import { ref } from 'vue'
import { useI18n, useLocalePath } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()

// Dados simulados locais (substituirão o Sanity posteriormente)
const currentEndeavors = ref([
  'reactAccessibility',
  'writingArticles',
  'readingMemorias',
  'exploringFiarlongo',
])

const experiences = ref([
  {
    titleKey: 'experience.productDesigner',
    startYear: '2023',
    isPresent: true,
    endYear: '',
    companyKey: 'experience.independentProjects',
    typeKey: 'experience.remote',
    locationKey: 'experience.cearaBrazil',
    descriptionKey: 'experience.description'
  }
])

const education = ref([
  {
    titleKey: 'education.digitalDesign',
    startYear: '2021',
    isPresent: false,
    endYear: '2025',
    institutionKey: 'education.ufc',
    descriptionKey: 'education.digitalDesignDescription'
  },
  {
    titleKey: 'education.uxPostgraduate',
    startYear: '2025',
    isPresent: true,
    institutionKey: 'education.pucrs',
    descriptionKey: 'education.uxPostgraduateDescription'
  }
])

const research = ref([
  {
    titleKey: 'research.zoteroTitle',
    eventKey: 'research.academicResearch',
    locationKey: 'research.ufcQuixada',
    publishingYear: '2025',
    descriptionKey: 'research.description'
  }
])
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
        <li v-for="(endeavor, index) in currentEndeavors" :key="index">
          {{ t(`about.endeavors.${endeavor}`) }}
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
        <li v-for="(experience, index) in experiences" :key="index" class="resume-item">
          <div class="item-header">
            <h3>{{ t(`about.${experience.titleKey}`) }}</h3>
            <p class="metadata-duration">
              {{ experience.startYear }} - {{ experience.isPresent ? t('about.present') : experience.endYear }}
            </p>
          </div>
          <div class="info">
            <p class="metadata">
              <span>{{ t(`about.${experience.companyKey}`) }}</span>
              <span>{{ t(`about.${experience.typeKey}`) }}</span>
              <span>{{ t(`about.${experience.locationKey}`) }}</span>
            </p>
            <p class="description">{{ t(`about.${experience.descriptionKey}`) }}</p>
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
        <li v-for="(edu, index) in education" :key="index" class="resume-item">
          <div class="item-header">
            <h3>{{ t(`about.${edu.titleKey}`) }}</h3>
            <p class="metadata-duration">
              {{ edu.startYear }} - {{ edu.isPresent ? t('about.present') : edu.endYear }}
            </p>
          </div>
          <div class="info">
            <p class="metadata">
              <span>{{ t(`about.${edu.institutionKey}`) }}</span>
            </p>
            <p class="description">{{ t(`about.${edu.descriptionKey}`) }}</p>
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
        <li v-for="(item, index) in research" :key="index" class="resume-item">
          <h3>{{ t(`about.${item.titleKey}`) }}</h3>
          <div class="info">
            <p class="metadata">
              <span class="first-item">{{ t(`about.${item.eventKey}`) }}</span>
              <span>{{ t(`about.${item.locationKey}`) }}</span>
              <span>{{ item.publishingYear }}</span>
            </p>
            <p class="description">{{ t(`about.${item.descriptionKey}`) }}</p>
          </div>
        </li>
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
