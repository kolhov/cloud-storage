<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell, TableFileName,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Icon } from '@iconify/vue'
import type { Files, Folders } from '@/lib/supabase/supabaseQueryTypes.ts'
import { computed } from 'vue'
import { bytesToString } from '@/lib/utils.ts'
import ItemMenu from '@/components/ui/item-menu/ItemMenu.vue'

const props = defineProps<{
  files: Files | null,
  folders: Folders | null
}>();

const formattedFiles = computed(() => {
  if (!props.files) return;
  return props.files.map(file => {
    return {
      ...file,
      formattedSize: bytesToString(file?.size ?? 10)
    }
  })
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
          <ItemMenu :item="folder"/>
        </TableCell>
      </TableRow>

      <!-- files   -->
      <TableRow v-for="file in formattedFiles" :key="file.id">
        <TableCell class="font-medium">
          <TableFileName :name="file.name" :mime="file.mime" :is-public="file.public" />
        </TableCell>
        <TableCell>{{ file.formattedSize }}</TableCell>
        <TableCell class="text-right">
          <ItemMenu :item="file"/>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<style scoped>

</style>
