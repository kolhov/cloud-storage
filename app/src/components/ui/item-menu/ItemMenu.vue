<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

enum dialog {
  share,
  copyLink,
  delete,
  moveTo,
  rename
}

const prop = defineProps<{
  item: Files[0] | Folder,
}>()

const currentDialog = ref(dialog.delete);

function setDialog(selectDialog: dialog){
  currentDialog.value = selectDialog;
}

function copyLink(){
  let link = window.location.origin;
  if ('size' in prop.item){
    link += `/shared/${prop.item.id}`;
  } else {
    link += `/shared/folder/${prop.item.id}`;
  }
  navigator.clipboard.writeText(link);
}

</script>

<template>
  <Dialog >
    <DropdownMenu :modal="false">
      <DropdownMenuTrigger asChild>
        <Icon icon="akar-icons:more-vertical" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Download</DropdownMenuItem>

        <DialogTrigger asChild @click="setDialog(dialog.share)">
          <DropdownMenuItem>
            Manage access
          </DropdownMenuItem>
        </DialogTrigger>
        <DropdownMenuItem v-if="item.public" @click="copyLink()">
          Copy link to file
        </DropdownMenuItem>
        <DropdownMenuItem v-else disabled>
          Copy link to file
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Share link</DialogTitle>
        <DialogDescription>
          Anyone who has this link will be able to view this.
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-center space-x-2">
        <div class="grid flex-1 gap-2">
          <Label for="link" class="sr-only">
            Link
          </Label>
          <Input
            id="link"
            default-value="https://shadcn-vue.com/docs/installation"
            read-only
          />
        </div>
        <Button type="submit" size="sm" class="px-3">
          <span class="sr-only">Copy</span>
          <Icon icon="akar-icons:copy" class="w-4 h-4" />
        </Button>
      </div>
      <DialogFooter class="sm:justify-start">
        <DialogClose as-child>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
