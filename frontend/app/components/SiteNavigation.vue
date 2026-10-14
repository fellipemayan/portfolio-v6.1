<script setup lang="ts">
import { useLocalePath, useI18n } from '#imports'

const localePath = useLocalePath()
const { t } = useI18n()

// Aceita uma lista de links. Assim é 100% reutilizável.
defineProps<{
  links: Array<{
    key: string
    path: string
    isTranslationKey?: boolean // Se true, usa o i18n. Se false, usa o texto direto.
    label?: string
  }>
}>()

const { slideUp } = useAnimations()

</script>

<template>
  <aside class="side-nav">
    <nav>
      <ul>
        <li v-for="item in links" :key="item.path" v-motion="slideUp(0)">
          <!-- O exact-active-class="active" é mágico aqui -->
          <NuxtLink
            :to="item.isTranslationKey ? localePath(item.path) : item.path"
            exact-active-class="active"
            class="nav-link"
          >
            <!-- O texto do link -->
            {{ item.isTranslationKey ? t(`nav.${item.key}`) : item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.side-nav {
  position: sticky;
  /* margin-top: var(--gap-xl); */
  top: calc(56px + var(--gap-xl) + var(--spacing-xs)); 
  align-self: start; 
}

ul {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.nav-link {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: 500;
  position: relative;
  transition: color var(--transition-medium);
  user-select: none;
  /* padding-left: 1.25rem;  */
}

.nav-link:hover,
.nav-link:focus-visible {
  color: var(--color-text-base);
}

.nav-link.active {
  color: var(--color-time-strong);}

/* O marcador super minimalista (um ponto) à esquerda */
.nav-link::before {
  content: '';
  position: absolute;
  left: -1rem;
  top: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: var(--color-time-base);

  /* Estado inicial (escondido) */
  transform: translateY(-50%) scale(0);
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.3s ease;
}

.nav-link.active::before {
  transform: translateY(-50%) scale(1);
  opacity: 1;
}

@media (max-width: 1280px) {
  .side-nav {
    display: none; /* Esconde a navegação lateral em telas menores */
  }
}
</style>