<script setup lang="ts">
import { Home } from 'lucide-vue-next'
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
import SidebarFolderTree from '@/components/layout/sidebar/SidebarFolderTree.vue'
import { Icon } from '@iconify/vue'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon'
})

const data = {
  addHeader: [],
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
      <SideBarAddHead :teams="data.addHeader" />
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
        <SidebarFolderTree />
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
