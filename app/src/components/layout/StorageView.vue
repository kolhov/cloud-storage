<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useStorageStore } from '@/stores/storageStore.ts'
import ContentTable from '@/components/ui/content-table/ContentTable.vue'

const {files, folders} = storeToRefs(useStorageStore());
const {setCurrentFolderId} = useStorageStore();
const route = useRoute();

await setCurrentFolderId(route.params?.uuid as string || null);
watch(() => route.params, async () => {
  await setCurrentFolderId(route.params?.uuid as string || null);
})
</script>

<template>
  <ContentTable :files="files" :folders="folders" />
</template>
