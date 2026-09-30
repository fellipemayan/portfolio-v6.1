<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useI18n } from '#imports'

const { t } = useI18n()
const formspreeId = 'SEU_ID_AQUI'
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const shake = ref(false)
const isPulverizing = ref(false)
const pulverizeScale = ref(0)

const formData = reactive({
  name: '',
  email: '',
  services: [] as string[],
  budget: '',
  timeline: '',
  message: ''
})

const servicesOptions = ['uiUx', 'frontend', 'graphicDesign', 'consulting']
const budgetOptions = ['under3000', 'from3000To8000', 'from8000To15000', 'over15000']
const timelineOptions = ['asSoonAsPossible', 'oneToTwoMonths', 'threeToSixMonths', 'noRush']

const socialLinks = ref([
  { name: 'LinkedIn', url: 'https://linkedin.com/in/fellipemayan', isVisible: true },
  { name: 'Behance', url: 'https://behance.net/fellipemayan', isVisible: true },
  { name: 'GitHub', url: 'https://github.com/fellipemayan', isVisible: true }
])

const copyEmailToClipboard = async () => {
  await navigator.clipboard.writeText('fmayan999@gmail.com')
  alert(t('contact.emailCopied'))
}

const handleNameBlur = () => {
  const firstName = formData.name.trim().split(' ')[0]
  if (firstName) {
    // TODO: Disparar action do Pinia aqui para atualizar o cursor global:
    // cursorStore.setDynamicText(`Oi, ${firstName} :)`)
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

  try {
    // Comunicação direta com a API do Formspree
    await $fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    
    status.value = 'success'

    // Reset do formulário
    setTimeout(() => {
      status.value = 'idle'
      isPulverizing.value = false
      pulverizeScale.value = 0
      Object.assign(formData, { name: '', email: '', services: [], budget: '', timeline: '', message: '' })
    }, 2600)

  } catch (err) {
    triggerError()
  }
}
</script>

<template>
  <main class="contact-page">
    
    <!-- SEÇÃO HERO -->
    <section id="hero" style="margin-bottom: 4rem;">
      <MotionSlideUp>
        <h1>{{ t('contact.title') }}</h1>
      </MotionSlideUp>
      
      <MotionSlideUp :delay="0.1">
        <p>
          {{ t('contact.introPrefix') }}
          <button class="copy" @click="copyEmailToClipboard">{{ t('contact.emailLink') }}</button>
          {{ t('contact.introSuffix') }}
        </p>
      </MotionSlideUp>

      <MotionSlideUp :delay="0.2">
        <ul class="contact-info horizontal">
          <li v-for="contact in socialLinks.filter(l => l.isVisible)" :key="contact.name">
            <a :href="contact.url" target="_blank" rel="noopener noreferrer" class="external-link">
              {{ contact.name }}
            </a>
          </li>
        </ul>
      </MotionSlideUp>
    </section>

    <!-- SEÇÃO DO FORMULÁRIO (Estilo Otherwhere) -->
    <section id="form-section" class="full-width">
      <MotionSlideUp :delay="0.3">
        
        <form 
          class="contact-form" 
          :class="{ 'pulverizing': isPulverizing, 'shake-animation': shake }" 
          @submit="submitForm"
        >
          <div class="form-group">
            <label for="name">{{ t('contact.nameLabel') }}</label>
            <input id="name" v-model="formData.name" type="text" required :placeholder="t('contact.namePlaceholder')" @blur="handleNameBlur" />
          </div>

          <div class="form-group">
            <label for="email">{{ t('contact.emailLabel') }}</label>
            <input id="email" v-model="formData.email" type="email" required :placeholder="t('contact.emailPlaceholder')" />
          </div>

          <div class="form-group checkboxes">
            <label>{{ t('contact.servicesLabel') }}</label>
            <div class="checkbox-grid">
              <label v-for="service in servicesOptions" :key="service" class="checkbox-label">
                <input v-model="formData.services" type="checkbox" :value="service" />
                {{ t(`contact.services.${service}`) }}
              </label>
            </div>
          </div>

          <div class="form-group grid-2">
            <div>
              <label for="budget">{{ t('contact.budgetLabel') }}</label>
              <select id="budget" v-model="formData.budget" required>
                <option value="" disabled>{{ t('contact.selectBudget') }}</option>
                <option v-for="budget in budgetOptions" :key="budget" :value="budget">{{ t(`contact.budget.${budget}`) }}</option>
              </select>
            </div>
            <div>
              <label for="timeline">{{ t('contact.timelineLabel') }}</label>
              <select id="timeline" v-model="formData.timeline" required>
                <option value="" disabled>{{ t('contact.selectTimeline') }}</option>
                <option v-for="time in timelineOptions" :key="time" :value="time">{{ t(`contact.timeline.${time}`) }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="message">{{ t('contact.messageLabel') }}</label>
            <textarea id="message" v-model="formData.message" rows="4" required :placeholder="t('contact.messagePlaceholder')"></textarea>
          </div>

          <button 
            type="submit" 
            class="btn submit-btn" 
            :class="status"
            :disabled="status === 'loading' || status === 'success'"
          >
            <transition name="fade" mode="out-in">
              <span :key="status">
                {{ 
                  status === 'loading' ? t('contact.submitLoading') : 
                  status === 'success' ? t('contact.submitSuccess') : 
                  status === 'error' ? t('contact.submitError') : 
                  t('contact.submit') 
                }}
              </span>
            </transition>
          </button>
        </form>

      </MotionSlideUp>
    </section>

  </main>
</template>
