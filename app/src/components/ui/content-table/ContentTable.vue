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

//TODO сортировать
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
        <TableHead class="w-[50px] p-2">
          <Icon icon="akar-icons:more-vertical" />
        </TableHead>
      </TableRow>
    </TableHeader>

    <TableBody v-if="files && folders">
      <!-- folders first -->
      <!-- draggable mb? -->
      <TableRow v-for="item in folders" :key="item.id" >
        <TableCell class="font-medium p-0">
          <RouterLink class="hover:bg-muted h-full block p-4" :to="`/folder/${item.id}`">
            <TableFileName :name="item.name" :icon="item.icon" :is-public="item.public" />
          </RouterLink>
        </TableCell>
        <TableCell></TableCell>
        <TableCell class="text-right p-0">
          <ItemMenu :item="item"/>
        </TableCell>
      </TableRow>

      <!-- files   -->
      <TableRow v-for="item in formattedFiles" :key="item.id">
        <TableCell class="font-medium">
          <TableFileName :name="item.name" :icon="item.icon" :is-public="item.public" />
        </TableCell>
        <TableCell>{{ item.formattedSize }}</TableCell>
        <TableCell class="text-right p-0">
          <ItemMenu :item="item" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<style scoped>

</style>
