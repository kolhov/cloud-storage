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
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { updateFileName, updateFolderName } from '@/lib/fileManager.ts'
import { ref } from 'vue'

const props = defineProps<{
  isFile: boolean,
  item: Files[0] | Folder
}>();

const newName = ref<string>(props.item.name);

async function renameItem(){
  if (props.isFile){
    await updateFileName(props.item.id, newName.value);
  } else {
    await updateFolderName(props.item.id, newName.value);
  }
}
</script>

<template>
  <DialogHeader>
    <DialogTitle>Rename {{isFile? 'file' : 'folder'}} </DialogTitle>
    <DialogDescription>
      Write the new name. Click save when you're done.
    </DialogDescription>
  </DialogHeader>
  <div class="grid grid-cols-4 items-center gap-4">
    <Label for="name" class="text-right">
      Name
    </Label>
    <Input id="name" class="col-span-3" v-model="newName" />
  </div>
  <DialogFooter class="justify-end">
    <DialogClose as-child>
      <Button @click="renameItem">
        Save
      </Button>
    </DialogClose>
  </DialogFooter>
</template>

<style scoped>

</style>
