<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/vue'
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'
import type { Files, Folder } from '@/lib/supabase/supabaseQueryTypes.ts'
import {
  deleteFile,
  deleteFolder,
  updateFilePublic,
  updateFolderPublic
} from '@/lib/fileManager.ts'

const prop = defineProps<{
  item: Files[0] | Folder,
}>();

enum dialog {
  delete,
  moveTo,
  rename
}

const currentDialog = ref(dialog.delete);

function setDialog(selectDialog: dialog) {
  currentDialog.value = selectDialog;
}

function copyLink() {
  let link = window.location.origin;
  if ('size' in prop.item) {
    link += `/shared/${prop.item.id}`;
  } else {
    link += `/shared/folder/${prop.item.id}`;
  }
  navigator.clipboard.writeText(link);
}

function deleteItem() {
  if ('size' in prop.item) {
    deleteFile(prop.item.id);
  } else {
    deleteFolder(prop.item.id);
  }
}

function makeItemPublic(){
  if ('size' in prop.item) {
    updateFilePublic(prop.item.id, true);
  } else {
    updateFolderPublic(prop.item.id, true);
  }
}

function makeItemPrivate(){
  if ('size' in prop.item) {
    updateFilePublic(prop.item.id, false);
  } else {
    updateFolderPublic(prop.item.id, false);
  }
}
</script>

<template>
  <Dialog>
    <DropdownMenu :modal="false">
      <DropdownMenuTrigger asChild>
        <Icon icon="akar-icons:more-vertical" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>

        <DropdownMenuItem>Download</DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem v-if="item.public" @click="makeItemPrivate">
          <span>Make private</span>
        </DropdownMenuItem>
        <DropdownMenuItem v-else @click="makeItemPublic">
          <span>Make public</span>
        </DropdownMenuItem>

        <DropdownMenuItem v-if="item.public" @click="copyLink()">
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem v-else disabled>
          Copy link
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DialogTrigger asChild @click="setDialog(dialog.delete)">
          <DropdownMenuItem>
            Delete
          </DropdownMenuItem>
        </DialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>

    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to permanently
          delete this {{item?.size? 'file' : 'folder with all files inside'}} from your drive?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="justify-end">
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            No
          </Button>
        </DialogClose>
        <DialogClose as-child>
          <Button type="button" variant="destructive" @click="deleteItem">
            Delete
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
