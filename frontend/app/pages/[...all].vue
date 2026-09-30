<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()

const projects = [
  { title: 'VagaBuilder', slug: 'vagabuilder' },
  { title: 'MoLIC.dg', slug: 'molic' },
  { title: 'Caixotim', slug: 'caixotim' },
  { title: 'MISplica', slug: 'misplica' } 
]

const randomProject = ref(projects[0])

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * projects.length)
  randomProject.value = projects[randomIndex]
})
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
        <h1>Página não encontrada :/</h1>
      </MotionSlideUp>
      
      <MotionSlideUp :delay="0.2">
        <p>Mas tudo bem, eu pensei nessa possibilidade.</p>
      </MotionSlideUp>

      <MotionSlideUp :delay="0.3" style="margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center;">
        <div class="backup-link">
          <NuxtLink class="btn four-o-four-link" :to="localePath('/')">
            Voltar para a Home
          </NuxtLink>
        </div>

        <div class="backup-link">
          <NuxtLink class="btn four-o-four-link" :to="localePath('/contato')">
            Entrar em contato
          </NuxtLink>
        </div>
      </MotionSlideUp>
      
      <MotionSlideUp :delay="0.4" style="margin-top: 4rem;">
        <h2 class="or-text">Ou confira um projeto aleatório:</h2>
        <ul class="single-project-list" style="list-style: none; padding: 0;">
          <li>
            <NuxtLink
              :to="localePath(`/projetos/${randomProject.slug}`)"
              class="btn four-o-four-link"
            >
              Ver projeto aleatório: {{ randomProject.title }}
            </NuxtLink>
          </li>
        </ul>
      </MotionSlideUp>

    </section>
  </main>
</template>