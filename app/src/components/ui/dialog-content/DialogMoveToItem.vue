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
import { updateFIleFolder, updateFolderFolder } from '@/lib/fileManager.ts'
import { onMounted, ref } from 'vue'
import DialogFolderTree from '@/components/ui/dialog-content/DialogFolderTree.vue'
import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/stores/storageStore.ts'

const props = defineProps<{
  isFile: boolean,
  item: Files[0] | Folder
}>();

const storageStore = useStorageStore();
const { foldersTree } = storeToRefs(storageStore);

function moveItem(id: string){
  if (props.isFile){
    updateFIleFolder(props.item.id, id);
  } else {
    updateFolderFolder(props.item.id, id);
  }
}

onMounted(async () => {
  if (!foldersTree.value){
    await storageStore.refreshFoldersTree();
  }
})
</script>

<template>
  <DialogHeader>
    <DialogTitle>Move to...</DialogTitle>
    <DialogDescription>
      Select a folder to move the {{isFile? 'file' : 'folder'}} to.
    </DialogDescription>
  </DialogHeader>
  <DialogFolderTree @folderSelect="moveItem" v-for="(subItem, index) in foldersTree" :key="index" :item="subItem" />
</template>

<style scoped>

</style>
