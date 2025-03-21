<script setup lang="ts">
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  item: string | any[]
}>()
const [name, ...items] = Array.isArray(props.item) ? props.item : [props.item]

</script>

<template>
  <SidebarMenuButton
    class="mr-0 pr-0"
    v-if="!items.length"
  >
    <RouterLink :to="`/folder/${item.id}`">
      <Icon icon="akar-icons:folder" />
      <span>{{ item.name }}</span>
    </RouterLink>
  </SidebarMenuButton>
  <SidebarMenuItem v-else>
    <Collapsible
      class="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
    >
      <CollapsibleTrigger as-child class="mr-0 pr-0">
        <SidebarMenuButton>
          <Icon icon="akar-icons:chevron-right-small" class="transition-transform" />
          <Icon icon="akar-icons:folder"/>
          {{ name }}
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub class="mr-0 pr-0">
          <SidebarFolderTree v-for="(subItem, index) in items" :key="index" :item="subItem" />
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  </SidebarMenuItem>
</template>

<style scoped>

</style>
