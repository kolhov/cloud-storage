<script setup lang="ts">
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Files, Folder } from '@/lib/supabase/supabaseQueryTypes.ts'

const props = defineProps<{
  isFile: boolean,
  item: Files[0] | Folder
}>();
</script>

<template>
  <DialogHeader>
    <DialogTitle>Are you sure?</DialogTitle>
    <DialogDescription>
      This action cannot be undone. Are you sure you want to permanently
      delete this {{isFile? 'file' : 'folder with all files inside'}} from your drive?
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
</template>

<style scoped>

</style>
