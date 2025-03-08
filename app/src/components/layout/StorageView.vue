<script setup lang="ts">
import { ref, type Ref, watch } from 'vue'
import { useErrorStore } from '@/stores/errorStore.ts'
import { filesQuery, foldersQuery } from '@/lib/supabase/supabaseQueries.ts'
import type { Files, Folders } from '@/lib/supabase/supabaseQueryTypes.ts'
import {
  Table, TableBody,
  TableCell,
  TableFileName,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore.ts'
import { useRoute } from 'vue-router'

const { user } = storeToRefs(useAuthStore());
const files: Ref<Files | null> = ref(null);
const folders: Ref<Folders | null> = ref(null);
const route = useRoute();

async function getAllFiles(folder?: string | null) {
  if (!user.value) return;
  const { data, error, status } = await filesQuery(user?.value.id, folder);

  if (error) useErrorStore().setError({ error, customCode: status });
  files.value = data;
}

async function getAllFolders(folder?: string | null) {
  if (!user.value) return;
  const { data, error, status } = await foldersQuery(user?.value.id, folder);

  if (error) useErrorStore().setError({ error, customCode: status });
  folders.value = data;
}

async function getCurrentStorage(){
  let folderUuid = route.params.uuid as string || null;
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
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-auto">Name</TableHead>
        <TableHead class="w-[150px]">Size</TableHead>
        <TableHead class="w-[50px]">
          <Icon icon="akar-icons:more-vertical" />
        </TableHead>
      </TableRow>
    </TableHeader>

    <TableBody v-if="files && folders">
      <!-- folders first -->
      <TableRow v-for="folder in folders" :key="folder.id">
        <TableCell class="font-medium p-0">
          <RouterLink class="hover:bg-muted h-full block p-4" :to="`/folder/${folder.id}`">
            <TableFileName :name="folder.name" mime="folder" :is-public="folder.public" />
          </RouterLink>
        </TableCell>
        <TableCell></TableCell>
        <TableCell class="text-right">
          <Icon icon="akar-icons:more-vertical" />
        </TableCell>

      </TableRow>

      <!-- files   -->
      <TableRow v-for="file in files" :key="file.id">
        <TableCell class="font-medium">
          <TableFileName :name="file.name" :mime="file.mime" :is-public="file.public" />
        </TableCell>
        <TableCell>{{ file.size }}</TableCell>
        <TableCell class="text-right">
          <Icon icon="akar-icons:more-vertical" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
