<script setup lang="ts">
import SidebarFolderTree from '@/components/layout/sidebar/SidebarFolderTree.vue'
import type { FolderTreeNode } from '@/types/folder.tree.type.ts'
import { useStorageStore } from '@/stores/storageStore.ts'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.ts'
import { watchDebounced } from '@vueuse/core'

const props = defineProps<{
  items: FolderTreeNode[] | null
}>()

const {foldersTree} = storeToRefs(useStorageStore());

const {user} = storeToRefs(useAuthStore());
watchDebounced(() => user.value,(user) => {
  if (user && !foldersTree.value) {
    console.log(1)
    useStorageStore().refreshFoldersTree();
  }
}, {debounce: 500});
</script>

<template>
  <SidebarFolderTree v-if="items" v-for="(item, index) in items" :key="index" :item="item" />
</template>

<style scoped>

</style>
