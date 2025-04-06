<script setup lang="ts">
import SidebarFolderTree from '@/components/layout/sidebar/SidebarFolderTree.vue'
import type { FolderTreeNode } from '@/types/folder.tree.type.ts'
import { useStorageStore } from '@/stores/storageStore.ts'
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.ts'

const props = defineProps<{
  items: FolderTreeNode[] | null
}>()

const {user} = storeToRefs(useAuthStore());
watch(() => user.value,(user) => {
  if (user) useStorageStore().refreshFoldersTree();
})
</script>

<template>
  <SidebarFolderTree v-if="items" v-for="(item, index) in items" :key="index" :item="item" />
</template>

<style scoped>

</style>
