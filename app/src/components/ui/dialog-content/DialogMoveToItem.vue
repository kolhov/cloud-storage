<script setup lang="ts">
import {
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import type { Files, Folder } from '@/lib/supabase/supabaseQueryTypes.ts'
import { updateFIleFolder, updateFolderFolder } from '@/lib/fileManager.ts'
import { onMounted, ref } from 'vue'
import DialogFolderTree from '@/components/ui/dialog-content/DialogFolderTree.vue'
import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/stores/storageStore.ts'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  isFile: boolean,
  item: Files[0] | Folder
}>();

const storageStore = useStorageStore();
const { foldersTree } = storeToRefs(storageStore);

function moveItem(id: string | null){
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
  <div class="button folder" @click="moveItem(null)">
    <Icon icon="akar-icons:home-alt1" class="text-base" />
    <span class="min-w-24">Home</span>
  </div>
  <DialogFolderTree @folderSelect="moveItem" v-for="(subItem, index) in foldersTree" :key="index" :item="subItem" />
</template>

<style scoped>
.folder {
  @apply flex justify-items-start items-center gap-2 text-sm border-2 p-1.5 rounded w-full
}
.button {
  @apply hover:cursor-pointer hover:bg-muted
}
</style>
