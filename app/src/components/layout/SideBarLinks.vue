<script setup lang="ts">
import {Icon} from "@iconify/vue";
import type { LinkProp } from "@/types/sidebar.linkprop.ts";

defineProps<{
  links: LinkProp[],
}>()

defineEmits<{
  actionClicked: [string]
}>()

</script>

<template>
  <template v-for="link in links" :key="link.title">
    <RouterLink
      exact-active-class="text-primary bg-muted"
      v-if="link.to"
      :to="link.to"
      class="nav-links"
    >
      <Icon :icon="link.icon"></Icon>
      <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
    </RouterLink>
    <div v-else class="nav-links cursor-pointer" @click="$emit('actionClicked', link.title)">
      <Icon :icon="link.icon"></Icon>
      <span class="hidden lg:block text-nowrap">{{ link.title }}</span>
    </div>
  </template>
</template>

<style scoped>
.nav-links {
  @apply flex items-center gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary justify-center lg:justify-normal text-muted-foreground;
}
</style>
