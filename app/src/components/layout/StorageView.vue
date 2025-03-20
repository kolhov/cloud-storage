<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useStorageStore } from '@/stores/storageStore.ts'
import ContentTable from '@/components/ui/content-table/ContentTable.vue'

const storageStore = useStorageStore();
const {files, folders} = storeToRefs(storageStore);
const route = useRoute();

const currentId = computed(() => route.params?.uuid as string || null);

watch(currentId, async (newId) => {
  await storageStore.setCurrentFolderId(newId);
}, { immediate: true });
</script>

<template>
  <ContentTable :files="files" :folders="folders" />
</template>
