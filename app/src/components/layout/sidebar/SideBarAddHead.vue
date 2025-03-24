<script setup lang="ts">
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent
} from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/vue'
import DialogNewFolder from '@/components/ui/dialog-content/DialogNewFolder.vue'
import { createFolder } from '@/lib/fileManager.ts'
import {
  DialogContent,
  DialogTrigger,
  Dialog,
} from '@/components/ui/dialog'
import { useFileUploader } from '@/stores/fileUploader.ts'
import { useStorageStore } from '@/stores/storageStore.ts'
import type { FileWithFolderId } from '@/types/expanded.file.system.types.ts'

const { isMobile } = useSidebar()

function addFolder(name: string) {
  createFolder(name)
}

function uploadFileClicked() {
  const { currentFolderId } = useStorageStore();
  const { uploadFiles } = useFileUploader();
  const files: FileWithFolderId[] = [];

  const input = document.createElement('input');
  input.setAttribute('type','file');
  input.multiple = true;

  input.addEventListener('change', (event) => {
    const data = (event.target as HTMLInputElement).files
    if (!data) {
      input.remove();
      return;
    }
    for (const file of data) {
      files.push({
        file: file,
        folderId: currentFolderId
      } as FileWithFolderId)
    }
    uploadFiles(files, currentFolderId);
    input.remove();
  });

  input.click();
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <Dialog>
        <DropdownMenu :modal="false" v-if="!isMobile">
          <DropdownMenuTrigger as-child>
            <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent bg-slate-800"
            >
              <div
                class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
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
            side="right"
            :side-offset="4"
          >
            <DialogTrigger asChild>
              <DropdownMenuItem
                class="gap-2 p-2"
              >
                <div class="flex size-4 items-center justify-center">
                  <Icon icon="akar-icons:folder" class="size-4 shrink-0 " />
                </div>
                New folder
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuItem
              class="gap-2 p-2"
              @click="uploadFileClicked"
            >
              <div class="flex size-4 items-center justify-center">
                <Icon icon="akar-icons:attach" class="size-4 shrink-0" />
              </div>
              Upload files
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogTrigger asChild v-else>
        <SidebarMenuButton
          class="data-[state=open]:bg-sidebar-accent bg-slate-800"
        >
          <div
            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Icon icon="akar-icons:plus" class="size-4" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="font-semibold">
                Add folder
              </span>
          </div>
        </SidebarMenuButton>
        </DialogTrigger>
        <SidebarMenuButton
          v-if="isMobile"
          class="data-[state=open]:bg-sidebar-accent bg-slate-800 mt-2"
          @click="uploadFileClicked"
        >
          <div
            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Icon icon="akar-icons:plus" class="size-4" />
          </div>
          <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="font-semibold">
                Add file
              </span>
          </div>
        </SidebarMenuButton>
        <DialogContent>
          <DialogNewFolder name="New folder" @sendName="addFolder" />
        </DialogContent>
      </Dialog>
    </SidebarMenuItem>
  </SidebarMenu>
</template>

<style scoped>

</style>
