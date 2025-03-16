<script setup lang="ts">
import { watch } from 'vue'
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
import { useRoute } from 'vue-router'
import { useStorageStore } from '@/stores/storageStore.ts'

const {files, folders} = storeToRefs(useStorageStore());
const {setCurrentFolderId} = useStorageStore();
const route = useRoute();

await setCurrentFolderId(route.params?.uuid as string || null);
watch(() => route.params, async () => {
  await setCurrentFolderId(route.params?.uuid as string || null);
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
      <!-- draggable mb? -->
      <TableRow v-for="folder in folders" :key="folder.id" >
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
