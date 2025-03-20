<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/vue'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { computed, ref } from 'vue'
import type { Files, Folder } from '@/lib/supabase/supabaseQueryTypes.ts'
import {
  updateFilePublic,
  updateFolderPublic
} from '@/lib/fileManager.ts'
import DialogDeleteItem from '@/components/ui/dialog-content/DialogDeleteItem.vue'
import DialogMoveToItem from '@/components/ui/dialog-content/DialogMoveToItem.vue'
import DialogRenameItem from '@/components/ui/dialog-content/DialogRenameItem.vue'

const prop = defineProps<{
  item: Files[0] | Folder,
}>();

enum dialog {
  delete = 'delete',
  moveTo = 'move-to',
  rename = 'rename'
}

const currentDialog = ref(dialog.delete);

const dialogComponents = {
  [dialog.delete]: DialogDeleteItem,
  [dialog.moveTo]: DialogMoveToItem,
  [dialog.rename]: DialogRenameItem,
}

function setDialog(selectDialog: dialog) {
  currentDialog.value = selectDialog;

}

function copyLink() {
  let link = window.location.origin;
  if (isFile) {
    link += `/shared/${prop.item.id}`;
  } else {
    link += `/shared/folder/${prop.item.id}`;
  }
  navigator.clipboard.writeText(link);
}

function makeItemPublic(){
  if (isFile) {
    updateFilePublic(prop.item.id, true);
  } else {
    updateFolderPublic(prop.item.id, true);
  }
}

function makeItemPrivate(){
  if (isFile) {
    updateFilePublic(prop.item.id, false);
  } else {
    updateFolderPublic(prop.item.id, false);
  }
}

const isFile = computed(() => {
  return 'size' in prop.item;
})
</script>

<template>
  <Dialog>
    <DropdownMenu :modal="false">
      <DropdownMenuTrigger asChild>
        <Icon icon="akar-icons:more-vertical" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Download</DropdownMenuItem>

        <DialogTrigger asChild @click="setDialog(dialog.moveTo)">
          <DropdownMenuItem>
            Move to...
          </DropdownMenuItem>
        </DialogTrigger>

        <DialogTrigger asChild @click="setDialog(dialog.rename)">
          <DropdownMenuItem>
            Rename
          </DropdownMenuItem>
        </DialogTrigger>

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
      <component
        :is="dialogComponents[currentDialog]"
        :item="item"
        :is-file="isFile"
      />
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
