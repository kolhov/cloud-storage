<script setup lang="ts">
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/stores/storageStore.ts'
import { Icon } from '@iconify/vue'
import type { Folders } from '@/lib/supabase/supabaseQueryTypes.ts'

defineProps<{
  folders: Folders
}>()
</script>

<template>
  <SidebarGroupContent v-if="folders">
    <SidebarMenu>
      <SidebarMenuItem v-for="item in folders" :key="item.id">
        <SidebarMenuButton asChild>
          <RouterLink :to="`/folder/${item.id}`">
            <Icon icon="akar-icons:folder" />
            <span>{{ item.name }}</span>
          </RouterLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarGroupContent>
</template>

<style scoped>

</style>
