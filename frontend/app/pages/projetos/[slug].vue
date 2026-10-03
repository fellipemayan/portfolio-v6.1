<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n, useLocalePath, useFetch } from '#imports'
import { PortableText } from '@portabletext/vue'
import { ArrowLeftIcon, ArrowRightIcon
  , ListBulletIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import { h } from 'vue'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const slug = route.params.slug as string

// ==========================================
// FUNÇÃO DE TRADUÇÃO NÍVEL-DE-CAMPO
// ==========================================
const getLocaleString = (val: any) => {
  if (!val) return ''
  if (typeof val === 'string') return val
  // Puxa o idioma ativo do i18n, com fallback para 'pt'
  if (val[locale.value]) return val[locale.value]
  if (val.pt) return val.pt
  if (val.en) return val.en
  return ''
}

const getRoleLabel = (role: string | {title?: LocalizedValue}) =>
  getLocaleString(typeof role === 'string' ? role : role.title)

const getRoleKey = (role: string | {_key?: string}, index: number) =>
  typeof role === 'string' ? `${role}-${index}` : role._key || index

type LocalizedValue = { pt?: string; en?: string }
type ProjectData = {
  title: LocalizedValue
  description: LocalizedValue
  year?: number | string
  duration?: LocalizedValue
  role?: Array<string | { _key?: string; title?: LocalizedValue }>
  tags?: Array<{ _id?: string; _key?: string; title: LocalizedValue }>
  toolsAndskills?: Array<{ _id?: string; _key?: string; title: LocalizedValue }>
  externalLinks?: Array<{ label: LocalizedValue; url: string }>
  isComingSoon?: boolean
  isPasswordProtected?: boolean
  thumbnailImage?: {
    horizontal?: { asset?: { url?: string } }
    vertical?: { asset?: { url?: string } }
    alt?: LocalizedValue
  }
  content?: Record<string, any[] | undefined>
  gallery?: any[]
}

const project = ref<ProjectData>({
  title: {},
  description: {},
})

useHead(() => ({
  title: `${getLocaleString(project.value.title)} | Fellipe Mayan ✸ Portfólio`,
}))

type ProjectResponse = { project?: ProjectData; requiresPassword?: boolean }
const { data: projectResponse } = await useFetch<ProjectResponse>(`/api/projects/${encodeURIComponent(slug)}`)

if (projectResponse.value?.project) {
  project.value = projectResponse.value.project
}

const isPasswordProtected = computed(() => projectResponse.value?.requiresPassword === true)
const isUnlocked = ref(!isPasswordProtected.value)
const accessPassword = ref('')
const accessError = ref('')
const isSubmittingPassword = ref(false)

const unlockProject = async () => {
  accessError.value = ''
  isSubmittingPassword.value = true

  try {
    const response = await $fetch<{project: ProjectData}>(`/api/projects/${encodeURIComponent(slug)}/access`, {
      method: 'POST',
      body: {password: accessPassword.value},
    })

    project.value = response.project
    isUnlocked.value = true
    accessPassword.value = ''
  } catch (error: any) {
    accessError.value = error?.data?.statusMessage || t('project.passwordError')
  } finally {
    isSubmittingPassword.value = false
  }
}

const localizedContent = computed(() => project.value.content?.[locale.value] || project.value.content?.pt || [])

// ==========================================
// CONFIGURAÇÃO DO PORTABLE TEXT (VUE)
// ==========================================
const portableTextComponents = {
  block: {
    normal: (_: any, { slots }: any) => h('p', slots.default?.()),
    h2: (props: any, { slots }: any) => h('h2', { id: `pt-block-${props.value._key}` }, slots.default?.()),
    h3: (_: any, { slots }: any) => h('h3', slots.default?.())
  },
  marks: {
    link: (props: any, { slots }: any) => h('a', { href: props.value.href, target: '_blank', class: 'external-link' }, slots.default?.())
  },
  types: {
    image: (props: any) => {
      const src = props.value.asset?.url
      if (!src) return null
      const alt = getLocaleString(props.value.alt)
      const caption = getLocaleString(props.value.caption)
      return h('figure', [
        h('img', { src, alt, width: 600, height: 300, class: 'gallery-image', loading: 'lazy' }),
        caption ? h('figcaption', caption) : null
      ])
    },
    contentImage: (props: any) => {
      const src = props.value.asset?.url
      if (!src) return null
      const alt = getLocaleString(props.value.alt)
      const caption = getLocaleString(props.value.caption)
      return h('figure', [
        h('img', { src, alt, width: 600, height: 300, class: 'gallery-image', loading: 'lazy' }),
        caption ? h('figcaption', caption) : null
      ])
    },
    embeddedMedia: (props: any) => {
      const src = props.value.url
      if (!src) return null
      const caption = getLocaleString(props.value.caption)
      return h('figure', { class: 'embedded-media' }, [
        h('iframe', {
          src,
          title: caption || getLocaleString(project.value.title),
          loading: 'lazy',
          allow: 'fullscreen; picture-in-picture',
          referrerpolicy: 'strict-origin-when-cross-origin',
        }),
        caption ? h('figcaption', caption) : null,
      ])
    }
  }
}
</script>

<template>
  <main v-if="!isUnlocked" class="project-access-page">
    <section class="project-access-panel" aria-labelledby="project-access-title">
      <NuxtLink :to="localePath('/projetos')" class="btn ghost-btn back-link">
        <ArrowLeftIcon class="icon-md" /> {{ t('project.back') }}
      </NuxtLink>
      <h1 id="project-access-title">{{ t('project.passwordTitle') }}</h1>
      <p>{{ t('project.passwordDescription') }}</p>
      <form class="project-access-form" @submit.prevent="unlockProject">
        <label for="project-password">{{ t('project.passwordLabel') }}</label>
        <input
          id="project-password"
          v-model="accessPassword"
          type="password"
          autocomplete="current-password"
          required
        />
        <p v-if="accessError" class="project-access-error" role="alert">{{ accessError }}</p>
        <button class="btn primary-btn" type="submit" :disabled="isSubmittingPassword">
          {{ isSubmittingPassword ? t('project.passwordChecking') : t('project.passwordSubmit') }}
        </button>
      </form>
      <NuxtLink :to="localePath('/contato')" class="external-link">
        {{ t('project.requestPassword') }}
      </NuxtLink>
    </section>
  </main>

  <main v-else class="project-page">

    <!-- ESTADO: EM BREVE -->
    <section v-if="project.isComingSoon" class="coming-soon-project-page">
      <MotionSlideUp class="coming-soon-message">
        <h1>{{ t('project.comingSoonTitle') }}</h1>
        <p>{{ t('project.comingSoonDescription') }}</p>
      </MotionSlideUp>
      
    </section>

    <!-- ESTADO: PROJETO DISPONÍVEL -->
    <template v-else>
      
      <!-- HEADER DO PROJETO COM POPOVER MENU -->
      <div class="contianer-grid full-width project-header" style="display: flex; justify-content: space-between; margin-bottom: 2rem;">
        <NuxtLink :to="localePath('/projetos')" class="btn ghost-btn back-link icon-only">
          <ArrowLeftIcon class="icon-md" /> {{ t('project.back') }}
        </NuxtLink>
        <button popovertarget="project-menu" class="menu-btn btn secondary-btn icon-only">
          <ListBulletIcon class="icon-md" />
        </button>
      </div>

      <!-- POPOVER MENU (TOC) -->
      <div id="project-menu" popover="auto" class="project-menu">
        <nav class="content-summary">
          <!-- Você pode construir os links de navegação extraindo os H2 do Portable Text aqui -->
          <p>{{ t('project.summary') }}</p>
        </nav>
        <span aria-hidden="true" class="highlight-text">//////////////</span>
        <button popovertarget="project-menu" popovertargetaction="hide" class="btn secondary-btn close-btn right icon-only">
          <XMarkIcon class="icon-md" />
        </button>
      </div>

      <!-- VISÃO GERAL -->
      <section id="project-overview" style="margin-bottom: 4rem;">
        <MotionSlideUp>
          <h1>{{ getLocaleString(project.title) }}</h1>
        </MotionSlideUp>
        
        <MotionSlideUp :delay="0.1">
          <ul v-if="project.tags?.length" class="tag-list">
            <li v-for="tag in project.tags" :key="tag._id" class="tag">
              {{ getLocaleString(tag.title) }}
            </li>
          </ul>
        </MotionSlideUp>
        
        <MotionSlideUp :delay="0.2">
          <p class="project-subtitle">{{ getLocaleString(project.description) }}</p>
        </MotionSlideUp>
      </section>

      <!-- IMAGEM PRINCIPAL HERO -->
      <section class="breakout" style="margin-bottom: 4rem;">
        <MotionSlideUp>
          <picture v-if="project.thumbnailImage?.horizontal?.asset?.url || project.thumbnailImage?.vertical?.asset?.url">
            <source v-if="project.thumbnailImage.vertical?.asset?.url" media="(max-width: 767px)" :srcset="project.thumbnailImage.vertical.asset.url" />
            <source v-if="project.thumbnailImage.horizontal?.asset?.url" media="(min-width: 768px)" :srcset="project.thumbnailImage.horizontal.asset.url" />
            <img 
              :src="project.thumbnailImage.horizontal?.asset?.url || project.thumbnailImage.vertical?.asset?.url" 
              :alt="getLocaleString(project.thumbnailImage.alt) || getLocaleString(project.title)"
              class="breakout project-image"
              loading="eager"
              style="width: 100%; height: auto;"
            />
          </picture>
        </MotionSlideUp>
      </section>

      <!-- METADADOS E CONTEÚDO PRINCIPAL -->
      <section class="full-width project-body-grid" style="display: grid; grid-template-columns: 1fr 3fr; gap: 2rem; margin-bottom: 4rem;">
        
        <!-- Sidebar Esquerda (Metadados) -->
        <aside id="projet-metadata" class="right">
          <MotionSlideUp>
            <div class="meta-group">
              <h2>{{ t('project.year') }}</h2>
              <ul class="metadata-list"><li class="metadata-period">{{ project.year || '—' }}</li></ul>
            </div>
          </MotionSlideUp>

          <MotionSlideUp :delay="0.1">
            <div class="meta-group">
              <h2>{{ t('project.duration') }}</h2>
              <ul class="metadata-list"><li class="metadata-period">{{ getLocaleString(project.duration) || '—' }}</li></ul>
            </div>
          </MotionSlideUp>

          <MotionSlideUp v-if="project.role?.length" :delay="0.2" >
            <div class="meta-group">
              <h2>{{ t('project.role') }}</h2>
              <ul class="metadata-list">
                <li v-for="(role, index) in project.role" :key="getRoleKey(role, index)" class="tag">
                  {{ getRoleLabel(role) }}
                </li>
              </ul>
            </div>
          </MotionSlideUp>

          <MotionSlideUp :delay="0.3">
            <div class="meta-group">
              <h2>{{ t('project.tools') }}</h2>
              <ul class="metadata-list">
                <li v-for="tool in project.toolsAndskills" :key="tool._id" class="tag">{{ getLocaleString(tool.title) }}</li>
              </ul>
            </div>
          </MotionSlideUp>

          <MotionSlideUp v-if="project.externalLinks?.length" :delay="0.4">
            <div class="meta-group">
              <h2>{{ t('project.viewProject') }}</h2>
              <ul class="metadata-list">
                <li v-for="link in project.externalLinks" :key="link.url">
                  <a :href="link.url" target="_blank" rel="noopener noreferrer" class="external-link">{{ getLocaleString(link.label) }}</a>
                </li>
              </ul>
            </div>
          </MotionSlideUp>
        </aside>

        <!-- Coluna Direita (Rich Text) -->
        <div class="content content-blocks">
          <MotionSlideUp v-for="(block, idx) in localizedContent" :key="block._key || idx" :delay="0.1 * (idx % 5)">
            <PortableText :value="[block]" :components="portableTextComponents" />
          </MotionSlideUp>
        </div>
      </section>

      <!-- GALERIA DE IMAGENS -->
      <section v-if="project.gallery?.length" id="gallery" class="breakout" style="margin-bottom: 4rem;">
        <MotionSlideUp v-for="(img, idx) in project.gallery" :key="idx" :delay="0.1 * idx">
           <!-- Sua lógica de picture para a galeria vai aqui (similar à do Hero) -->
        </MotionSlideUp>
      </section>

      <!-- CTA BANNER DINÂMICO -->
      <CtaBanner
        :title="t('project.ctaTitle')"
        :description="t('project.ctaDescription')"
        :primary-action="{ label: t('project.sendMessage'), path: '/contato' }"
        :secondary-action="{ label: t('projects.viewAll'), path: '/projetos' }"
      />

    </template>
  </main>
</template>

<style scoped>
.project-access-page {
  min-height: 70vh;
  display: grid;
  place-items: center;
  padding: 3rem 1.5rem;
}

.project-access-panel {
  width: min(100%, 34rem);
  display: grid;
  gap: 1rem;
}

.project-access-panel h1 {
  margin: 2rem 0 0;
}

.project-access-form {
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0 0.5rem;
}

.project-access-form input {
  min-height: 2.75rem;
  padding: 0.65rem 0.75rem;
}

.project-access-error {
  color: #a32828;
  margin: 0;
}

.project-access-form button {
  justify-self: start;
  margin-top: 0.5rem;
}

.embedded-media {
  margin: 2rem 0;
}

.embedded-media iframe {
  display: block;
  width: 100%;
  min-height: 30rem;
  border: 0;
}

@media (max-width: 767px) {
  .project-access-page {
    min-height: 75vh;
    padding-inline: 1rem;
  }

  .embedded-media iframe {
    min-height: 20rem;
  }
}
</style>