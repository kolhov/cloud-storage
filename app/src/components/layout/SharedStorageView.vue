<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { useErrorStore } from '@/stores/errorStore.ts'
import {
  sharedFilesQuery,
  sharedFoldersQuery
} from '@/lib/supabase/supabaseQueries.ts'
import type { Files, Folders } from '@/lib/supabase/supabaseQueryTypes.ts'
import { useRoute } from 'vue-router'
import ContentTable from '@/components/ui/content-table/ContentTable.vue'

const files: Ref<Files | null> = ref(null);
const folders: Ref<Folders | null> = ref(null);
const route = useRoute("/shared/folder/[uuid]");

async function getAllFiles(folder: string) {
  const { data, error, status } = await sharedFilesQuery(folder);

  if (error) useErrorStore().setError({ error, customCode: status });
  files.value = data;
}

async function getAllFolders(folder: string) {
  const { data, error, status } = await sharedFoldersQuery(folder);

  if (error) useErrorStore().setError({ error, customCode: status });
  folders.value = data;
}

async function getCurrentStorage(){
  let folderUuid = route.params.uuid as string;

  await getAllFiles(folderUuid);
  await getAllFolders(folderUuid);
}

await getCurrentStorage();

watch(() => route.params, async () => {
  files.value = null;
  folders.value = null;

  await getCurrentStorage();
})
</script>

<template>
  <ContentTable :files="files" :folders="folders" />
</template>
