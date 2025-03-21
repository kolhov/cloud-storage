<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, type SidebarProps
} from '@/components/ui/sidebar'
import SideBarAddHead from '@/components/layout/sidebar/SideBarAddHead.vue'
import SidebarCurrentFolder from '@/components/layout/sidebar/SidebarCurrentFolder.vue'
import { Icon } from '@iconify/vue'
import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/stores/storageStore.ts'
import SidebarFolderTree from '@/components/layout/sidebar/SidebarFolderTree.vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon'
})

const { folders, sidebarFoldersTree } = storeToRefs(useStorageStore());
const data = {
  content: [
    {
      title: 'Home',
      url: '/home',
      icon: 'akar-icons:home-alt1'
    }
  ]
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <SideBarAddHead />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>My drive</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in data.content" :key="item.title">
              <SidebarMenuButton asChild>
                <RouterLink :to="item.url">
                  <Icon :icon="item.icon" />
                  <span>{{ item.title }}</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>My folders</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarFolderTree v-for="(item, index) in sidebarFoldersTree" :key="index" :item="item" />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Current folder</SidebarGroupLabel>
        <SidebarCurrentFolder :folders="folders" v-if="folders" />
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
