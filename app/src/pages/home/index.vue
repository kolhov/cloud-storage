<script setup lang="ts">
import { usePageStore } from '@/stores/pages.ts'
import { ref, type Ref } from 'vue'
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

usePageStore().pageData.title = 'Projects';
const files: Ref<Files | null> = ref(null);
const folders: Ref<Folders | null> = ref(null);

async function getAllFiles(){
  const {data, error, status} = await filesQuery();

  if (error) useErrorStore().setError({error, customCode: status});
  files.value = data;
}
async function getAllFolders(){
  const {data, error, status} = await foldersQuery();

  if (error) useErrorStore().setError({error, customCode: status});
  folders.value = data;
}

await getAllFiles();
await getAllFolders();
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-auto">Name</TableHead>
        <TableHead class="w-[150px]">Size</TableHead>
        <TableHead class="w-[50px]"><Icon icon="akar-icons:more-vertical"/></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <!-- folders  -->
      <TableRow v-for="folder in folders" :key="folder.id">
        <TableCell class="font-medium">
          <TableFileName :name="folder.name" mime="folder" :is-public="folder.public" />
        </TableCell>
        <TableCell></TableCell>
        <TableCell class="text-right">
          <Icon icon="akar-icons:more-vertical"/>
        </TableCell>
      </TableRow>
      <!-- files   -->
      <TableRow v-for="file in files" :key="file.id">
        <TableCell class="font-medium">
          <TableFileName :name="file.name" :mime="file.mime" :is-public="file.public" />
        </TableCell>
        <TableCell>{{file.size}}</TableCell>
        <TableCell class="text-right">
          <Icon icon="akar-icons:more-vertical"/>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
