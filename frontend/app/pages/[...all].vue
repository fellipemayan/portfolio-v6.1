<script setup lang="ts">
import { useI18n, useLocalePath } from '#imports'

const { t } = useI18n()
const localePath = useLocalePath()

</script>

<template>
  <main class="not-found-page" style="padding: 4rem 0; text-align: center;">
    <section class="not-found">
      
      <MotionSlideUp>
        <span class="four-o-four" aria-hidden="true" style="font-size: clamp(4rem, 10vw, 8rem); font-weight: bold;">
          404
        </span>
      </MotionSlideUp>

      <MotionSlideUp :delay="0.1">
        <h1>{{ t('notFound.title') }}</h1>
      </MotionSlideUp>
      
      <MotionSlideUp :delay="0.2">
        <p>{{ t('notFound.description') }}</p>
      </MotionSlideUp>

      <MotionSlideUp :delay="0.3" style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
        <div class="backup-link">
          <NuxtLink class="btn four-o-four-link" :to="localePath('/')">
            {{ t('notFound.backHome') }}
          </NuxtLink>
        </div>

        <div class="backup-link">
          <NuxtLink class="btn four-o-four-link" :to="localePath('/contato')">
            {{ t('notFound.contact') }}
          </NuxtLink>
        </div>
      </MotionSlideUp>
      
    </section>
  </main>
</template>