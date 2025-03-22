<script setup lang="ts">
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/vue'

const { isMobile } = useSidebar()

function addFolder(){

}
function uploadFiles(){

}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent bg-slate-800"
          >
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Icon icon="akar-icons:plus" class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="font-semibold">
                Add
              </span>
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          :side="isMobile ? 'bottom' : 'right'"
          :side-offset="4"
        >
          <DropdownMenuItem
            class="gap-2 p-2"
            @click="addFolder"
          >
            <div class="flex size-4 items-center justify-center">
              <Icon icon="akar-icons:folder" class="size-4 shrink-0 " />
            </div>
            New folder
          </DropdownMenuItem>
          <DropdownMenuItem
            class="gap-2 p-2"
            @click="uploadFiles"
          >
            <div class="flex size-4 items-center justify-center">
              <Icon icon="akar-icons:attach" class="size-4 shrink-0" />
            </div>
            Upload files
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<style scoped>

</style>
