<script setup lang="ts">
import SidebarFolderTree from '@/components/layout/sidebar/SidebarFolderTree.vue'
import type { FolderTreeNode } from '@/types/folder.tree.type.ts'
import { useStorageStore } from '@/stores/storageStore.ts'
import { nextTick, onMounted } from 'vue'

const props = defineProps<{
  items: FolderTreeNode[] | null
}>()

onMounted( async () => {
  setTimeout(async () => {
    await useStorageStore().refreshFoldersTree();
  }, 1000)
})
</script>

<template>
  <SidebarFolderTree v-if="items" v-for="(item, index) in items" :key="index" :item="item" />
</template>

<style scoped>

</style>
