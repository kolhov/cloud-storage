<script setup lang="ts">
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Icon } from '@iconify/vue'
import type { FolderTreeNode } from '@/types/folder.tree.type.ts'
import { ref } from 'vue'

const props = defineProps<{
  item: FolderTreeNode
}>()
const isOpen = ref(false);
</script>

<template>
  <SidebarMenuButton
    class="mr-0 pr-0"
    v-if="item.folders.length == 0"
    asChild
  >
    <RouterLink :to="`/folder/${item.id}`">
      <Icon icon="akar-icons:folder" />
      <span>{{ item.name }}</span>
    </RouterLink>
  </SidebarMenuButton>
  <SidebarMenuItem v-else>
    <Collapsible
      class="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      v-model:open="isOpen"
    >
      <CollapsibleTrigger asChild class="mr-0 pr-0">
        <SidebarMenuButton>
          <Icon icon="akar-icons:chevron-right-small" class="transition-transform" />
          <RouterLink :to="`/folder/${item.id}`"
                      class="peer/menu-button flex text-sm gap-2 justify-items-start items-center"
                      @click.stop
          >
            <Icon icon="akar-icons:folder" class="text-base w-4" />
            <span class="min-w-24" >{{ item.name }}</span>
          </RouterLink>
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub class="mr-0 pr-0">
          <SidebarFolderTree v-for="(subItem, index) in item.folders" :key="index" :item="subItem" />
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  </SidebarMenuItem>
</template>

<style scoped>

</style>
