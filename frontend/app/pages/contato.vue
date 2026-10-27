<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useFetch, useI18n } from '#imports'
import { ChevronDownIcon, CheckCircleIcon, SwatchIcon, CodeBracketIcon, PaintBrushIcon, ChatBubbleLeftRightIcon } from '@heroicons/vue/20/solid'

const { t, locale } = useI18n()
type LocalizedString = { pt?: string; en?: string }
type SocialLink = {
  _key?: string
  name?: LocalizedString
  url: string
  order?: number
  isVisible?: boolean
}

type SiteSettings = {
  socialLinks?: SocialLink[]
  isAvailableForWork?: boolean
}

const { data: siteSettings } = await useFetch<SiteSettings>('/api/site-settings')
const config = useRuntimeConfig()
const formspreeId = config.public.formspreeId
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const shake = ref(false)

// Vamos permitir alternar ou usar a configuração real do siteSettings (aqui simulado com true/false, mas controlável)
// const isAvailable = computed(() => siteSettings.value?.isAvailableForWork ?? true)
const isAvailable = ref(true) // Simulação de disponibilidade 

const formData = reactive({
  name: '',
  email: '',
  services: [] as string[],
  budget: '',
  timeline: '',
  message: '',
  hp: ''
})

const servicesOptions = [
  { id: 'uiUx', icon: SwatchIcon },
  { id: 'frontend', icon: CodeBracketIcon },
  { id: 'graphicDesign', icon: PaintBrushIcon },
  { id: 'consulting', icon: ChatBubbleLeftRightIcon }
]

const budgetOptions = ['under3000', 'from3000To8000', 'from8000To15000', 'over15000']
const timelineOptions = ['asSoonAsPossible', 'oneToTwoMonths', 'threeToSixMonths', 'noRush']

const socialLinks = computed(() =>
  (siteSettings.value?.socialLinks || [])
    .filter((link) => link.isVisible !== false)
    .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
    .map((link) => ({
      key: link._key || link.url,
      name: link.name?.[locale.value] || link.name?.pt || link.name?.en || link.url,
      isVisible: link.isVisible !== false,
      url: link.url,
    })),
)

const MAX_FILE_SIZE_MB = 10
const MAX_FILES = 5

const uploadedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

const triggerFileInput = (accept = '*') => {
  if (fileInput.value) {
    fileInput.value.accept = accept
    fileInput.value.click()
  }
}

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    
    if (uploadedFiles.value.length + newFiles.length > MAX_FILES) {
      alert(t('contact.maxFilesError', `Você pode anexar no máximo ${MAX_FILES} arquivos.`))
      return
    }

    const currentSize = uploadedFiles.value.reduce((acc, file) => acc + file.size, 0)
    const newSize = newFiles.reduce((acc, file) => acc + file.size, 0)
    
    if ((currentSize + newSize) > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(t('contact.maxSizeError', `O tamanho total dos anexos não pode ultrapassar ${MAX_FILE_SIZE_MB}MB.`))
      return
    }

    uploadedFiles.value.push(...newFiles)
  }
  if (fileInput.value) fileInput.value.value = ''
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
}

const copyEmailToClipboard = async () => {
  await navigator.clipboard.writeText('fellipemayan.design@gmail.com')
  alert(t('contact.emailCopied', 'E-mail copiado!'))
}

const handleNameBlur = () => {
  const firstName = formData.name.trim().split(' ')[0]
  if (firstName) {
    // Action do Pinia
  }
}

const triggerError = () => {
  status.value = 'error'
  shake.value = true
  setTimeout(() => (shake.value = false), 500)
  setTimeout(() => (status.value = 'idle'), 3000)
}

const submitForm = async (e: Event) => {
  e.preventDefault()
  
  if (!formData.email.includes('@')) {
    triggerError()
    return
  }

  status.value = 'loading'

  const submitData = new FormData()
  submitData.append('name', formData.name)
  submitData.append('email', formData.email)
  submitData.append('formType', isAvailable.value ? 'project_proposal' : 'waitlist_inquiry')
  
  formData.services.forEach(service => {
    submitData.append('services', service)
  })
  
  submitData.append('budget', formData.budget)
  submitData.append('timeline', formData.timeline)
  submitData.append('message', formData.message)

  uploadedFiles.value.forEach((file, index) => {
    submitData.append(`attachment_${index}`, file)
  })

  // Campo Honeypot anti-spam reconhecido automaticamente pelo Formspree
  submitData.append('_gotcha', formData.hp)

  try {
    await $fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      body: submitData,
      headers: { 'Accept': 'application/json' }
    })
    
    status.value = 'success'

    setTimeout(() => {
      status.value = 'idle'
      Object.assign(formData, { name: '', email: '', services: [], budget: '', timeline: '', message: '' })
      uploadedFiles.value = []
    }, 2600)

  } catch (err) {
    triggerError()
  }
}

const { slideUp } = useAnimations()
</script>

<template>
  <main class="contact-page">
    
    <section id="hero">
      <h1 v-motion="slideUp(0)">{{ t('contact.title') }}</h1>
      <p v-motion="slideUp(150)">
        {{ t('contact.introPrefix') }}
        <button class="copy-btn" @click="copyEmailToClipboard">{{ t('contact.emailLink') }}</button>
        {{ t('contact.introSuffix') }}
      </p>
        <ul class="contact-info horizontal">
          <li v-for="contact in socialLinks.filter(l => l.isVisible)" :key="contact.name">
            <a :href="contact.url" target="_blank" rel="noopener noreferrer" class="external-link">
              {{ contact.name }}
            </a>
          </li>
        </ul>
    </section>

    <section id="form-section">
      <!-- Aviso Dinâmico: Se indisponível, convida a deixar mensagem para contato futuro -->
      <div class="availability-banner" :class="{ 'is-closed': !isAvailable }">
        <div class="banner-icon">{{ isAvailable ? '✨' : '📬' }}</div>
        <div class="banner-text">
          <h3>{{ isAvailable ? t('contact.availableTitle', 'Disponível para novos projetos') : t('contact.unavailableTitle', 'Agenda Fechada no Momento') }}</h3>
          <p>{{ isAvailable ? t('contact.availableMessage', 'Preencha o formulário abaixo para iniciar uma proposta ou conversarmos sobre o seu projeto.') : t('contact.unavailableMessage', 'Atualmente estou com a agenda lotada para novos projetos. No entanto, você pode deixar sua mensagem e e-mail abaixo para entrar na lista de contato e conversarmos assim que eu tiver nova disponibilidade!') }}</p>
        </div>
      </div>

      <form 
        class="contact-form" 
        :class="{'shake-animation': shake}" 
        v-motion="slideUp(0)"
        @submit="submitForm"
      >
        <!-- Campo Honeypot Oculto Anti-Spam -->
        <div class="hp-field" aria-hidden="true">
          <label for="hp">Website</label>
          <input type="text" id="hp" v-model="formData.hp" tabindex="-1" autocomplete="off" />
        </div>

        <!-- 1. NOME -->
        <div class="form-group">
          <label for="name">{{ t('contact.nameLabel', 'Seu Nome') }}</label>
          <div class="input-wrapper">
            <input id="name" v-model="formData.name" type="text" required :placeholder="t('contact.namePlaceholder', 'Digite seu nome')" @blur="handleNameBlur" />
            <svg class="validation-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg>
          </div>
        </div>

        <!-- 2. EMAIL -->
        <div class="form-group">
          <label for="email">{{ t('contact.emailLabel', 'E-mail profissional') }}</label>
          <div class="input-wrapper">
            <input id="email" v-model="formData.email" type="email" required :placeholder="t('contact.emailPlaceholder', 'seu@email.com')" />
            <svg class="validation-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" /></svg>
          </div>
        </div>

        <!-- 3. SERVIÇOS (Linha Completa) -->
        <div class="form-group full-width services-block">
          <label>{{ t('contact.servicesLabel', 'Tipo de Projeto') }}</label>
          <div class="services-cards-grid">
            <label 
              v-for="service in servicesOptions" 
              :key="service.id" 
              class="service-card" 
              :class="{ 'selected': formData.services.includes(service.id) }"
            >
              <input 
                v-model="formData.services" 
                type="checkbox" 
                :value="service.id" 
                class="sr-only" 
              />
              
              <component :is="service.icon" class="service-icon" />
              <span class="service-name">{{ t(`contact.services.${service.id}`) }}</span>
              
              <transition name="pop">
                <CheckCircleIcon v-if="formData.services.includes(service.id)" class="selected-indicator" />
              </transition>
            </label>
          </div>
        </div>

        <!-- 4. ORÇAMENTO -->
        <div class="form-group">
          <label for="budget">{{ t('contact.budgetLabel', 'Orçamento') }}</label>
          <div class="input-wrapper select-wrapper">
            <select id="budget" v-model="formData.budget" required>
              <option value="" disabled>{{ t('contact.selectBudget', 'Selecione o orçamento (opcional)') }}</option>
              <option v-for="budget in budgetOptions" :key="budget" :value="budget">{{ t(`contact.budget.${budget}`) }}</option>
            </select>
            <ChevronDownIcon class="select-chevron" />
          </div>
        </div>

        <!-- 5. PRAZO -->
        <div class="form-group">
          <label for="timeline">{{ t('contact.timelineLabel', 'Prazo') }}</label>
          <div class="input-wrapper select-wrapper" required>
            <select id="timeline" v-model="formData.timeline">
              <option value="" disabled>{{ t('contact.selectTimeline', 'Selecione o prazo (opcional)') }}</option>
              <option v-for="time in timelineOptions" :key="time" :value="time">{{ t(`contact.timeline.${time}`) }}</option>
            </select>
            <ChevronDownIcon class="select-chevron" />
          </div>
        </div>

        <!-- 6. MENSAGEM (Linha Completa) -->
        <div class="form-group full-width editor-wrapper">
          <label for="message">{{ t('contact.messageLabel', 'Mensagem do Projeto') }}</label>
          <div class="editor-container">
            <textarea 
              id="message" 
              v-model="formData.message" 
              rows="5" 
              required
              :placeholder="t('contact.messagePlaceholder', 'Descreva o seu projeto, os objetivos e o que espera da nossa colaboração. Você pode anexar PDFs ou imagens úteis usando a barra inferior.')"
            ></textarea>
            
            <!-- Lista de Arquivos Anexados -->
            <div v-if="uploadedFiles.length > 0" class="attachments-list">
              <div v-for="(file, index) in uploadedFiles" :key="index" class="attachment-item">
                <span class="file-icon">📎</span>
                <span class="file-name">{{ file.name }}</span>
                <button type="button" class="remove-file" @click="removeFile(index)" aria-label="Remover">×</button>
              </div>
            </div>

            <div class="editor-toolbar">
              <input type="file" multiple ref="fileInput" @change="handleFileUpload" class="sr-only" tabindex="-1" />
              
              <button type="button" class="btn ghost-btn icon-only" @click="triggerFileInput('*')" aria-label="Anexar arquivo" title="Anexar arquivo">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-sm">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 1 0 1-6.364-6.364l10.94-10.94A3 3 1 0 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 1 0 0 2.112 2.13" />
                </svg>
              </button>
              <button type="button" class="btn ghost-btn icon-only" @click="triggerFileInput('image/*')" aria-label="Adicionar imagem" title="Adicionar imagem">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-sm">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 1 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 1 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 1 0 0 1.5-1.5V6a1.5 1.5 1 0 0-1.5-1.5H3.75A1.5 1.5 1 0 0 2.25 6v12a1.5 1.5 1 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 1 1 1-.75 0 .375.375 1 0 1 .75 0Z" />
                </svg>
              </button>
              
              <span class="toolbar-hint" v-if="uploadedFiles.length === 0">
                {{ t('contact.attachHint', 'Adicionar anexos') }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- 7. BOTÃO SUBMETER (Dinâmico conforme disponibilidade) -->
        <div class="form-group full-width btn-row">
          <button 
            type="submit" 
            class="btn primary-btn submit-btn" 
            :class="status"
            :disabled="status === 'loading' || status === 'success'"
          >
            <transition name="fade" mode="out-in">
              <span :key="status">
                {{ 
                  status === 'loading' ? t('contact.submitLoading', 'Enviando...') : 
                  status === 'success' ? t('contact.submitSuccess', 'Mensagem enviada com sucesso!') : 
                  status === 'error' ? t('contact.submitError', 'Erro ao enviar. Tente novamente.') : 
                  isAvailable ? t('contact.submit', 'Enviar Proposta') : t('contact.submitWaitlist', 'Entrar na Lista de Espera')
                }}
              </span>
            </transition>
          </button>
        </div>

      </form>
    </section>

  </main>
</template>

<style scoped>
.copy-btn {
  background: none;
  border: none;
  color: var(--color-time-base);
  cursor: pointer;
  font-size: var(--font-size-md);
  padding: 0;
}

.hp-field {
  position: absolute;
  left: -9999px;
  top: -9999px;
  opacity: 0;
  visibility: hidden;
  height: 0;
  width: 0;
  pointer-events: none;
}


.contact-form {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding: 0;

  > .form-group {
    flex: 1 1 100%;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: 0;
}

@media (min-width: 768px) {
  .contact-form {
    grid-template-columns: 1fr 1fr;
  }
}

.full-width {
  grid-column: 1 / -1;
}

/* -------------------------------------
   LABELS & INPUTS
-------------------------------------- */
label {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-text-heading);
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input[type="text"],
input[type="email"],
select {
  width: 100%;
  padding: var(--spacing-md);
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text-base);
  font-family: inherit;
  font-size: var(--font-size-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

select option {
  background-color: var(--color-time-background-muted); 
  color: var(--color-text-base);
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--color-time-base);
  box-shadow: 0 0 0 2px var(--color-time-muted);
}

.validation-icon {
  position: absolute;
  right: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-time-base);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

input:valid:not(:placeholder-shown),
textarea:valid:not(:placeholder-shown) {
  border-color: var(--color-text-base);
}

select:valid {
  border-color: var(--color-text-base);
}

input:valid:not(:placeholder-shown) ~ .validation-icon {
  opacity: 1;
}

select {
  appearance: none;
  cursor: pointer;
  padding-right: 2.5rem;
}

.select-chevron {
  position: absolute;
  right: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-muted);
  pointer-events: none;
  transition: color var(--transition-fast);
}

select:focus ~ .select-chevron {
  color: var(--color-time-base);
}

/* -------------------------------------
   CARDS DE SERVIÇOS
-------------------------------------- */
.services-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

@media (min-width: 1024px) {
  .services-cards-grid {
    grid-template-columns: repeat(4, 1fr); 
  }
}

.service-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
  background: transparent;
  transition: all var(--transition-fast);
  user-select: none;
}

.service-card:hover {
  border-color: var(--color-time-muted);
  background-color: var(--color-time-background-muted);
}

.service-card.selected {
  background-color: var(--color-time-base);
  border-color: var(--color-time-base);
  color: var(--color-bg-base); 
}

.service-icon {
  width: 1rem;
  height: 1rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-muted);
  transition: color var(--transition-fast);
}

.service-card.selected .service-icon {
  color: var(--color-bg-base);
}

.service-name {
  font-weight: 500;
  font-size: var(--font-size-sm);
  line-height: 1.2;
}

.selected-indicator {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-bg-base);
}

.pop-enter-active, .pop-leave-active {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
}
.pop-enter-from, .pop-leave-to {
  transform: scale(0);
  opacity: 0;
}

/* -------------------------------------
   EDITOR DE MENSAGEM
-------------------------------------- */
.editor-container {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  background: transparent;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  overflow: hidden;
}

.editor-container:focus-within {
  border-color: var(--color-time-base);
  box-shadow: 0 0 0 2px var(--color-time-muted);
}

.editor-container textarea {
  border: none;
  border-radius: 0;
  padding: var(--spacing-md);
  resize: vertical;
  background: transparent;
  color: var(--color-text-base);
  font-family: inherit;
  font-size: var(--font-size-sm);
}

.editor-container textarea:focus { outline: none; box-shadow: none; }

.editor-container textarea::placeholder {
  color: var(--color-text-muted);
  opacity: 0.7;
}

.attachments-list {
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-top: 1px dashed var(--color-border);
}

.attachment-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--color-time-background-muted);
  color: var(--color-text-base);
  border: 1px solid var(--color-border);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-family: var(--font-family-mono);
}

.remove-file {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0 0.2rem;
  opacity: 0.7;
}
.remove-file:hover { opacity: 1; color: var(--color-text-base); }

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-time-background-muted);
  border-top: 1px solid var(--color-border);
}

.editor-toolbar .btn {
  height: 2rem;
  width: 2rem;
  padding: 0;
  color: var(--color-text-muted);
}

.editor-toolbar .btn:hover:not(:disabled) {
  color: var(--color-time-base);
  background-color: transparent;
}

.toolbar-hint {
  margin-left: auto;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  opacity: 0.7;
}

.icon-sm { width: 1.25rem; height: 1.25rem; }

/* -------------------------------------
   BOTÃO ENVIAR
-------------------------------------- */
.btn-row {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--font-size-md);
}

@media (min-width: 768px) {
  .submit-btn {
    width: auto;
    min-width: 200px;
  }
}

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
.shake-animation { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
</style>
