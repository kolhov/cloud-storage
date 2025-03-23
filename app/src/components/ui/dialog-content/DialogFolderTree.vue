<script setup lang="ts">
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Icon } from '@iconify/vue'
import type { FolderTreeNode } from '@/types/folder.tree.type.ts'

const props = defineProps<{
  item: FolderTreeNode
}>();

const emit = defineEmits<{
  folderSelect: [string]
}>();

function folderSelect(id: string){
  emit('folderSelect', id);
}
</script>

<template>
  <div
    v-if="item.folders.length == 0"
    class="pl-[2.1rem]"
  >
    <div class="button folder" @click="folderSelect(item.id)">
    <Icon icon="akar-icons:folder" class="text-base" />
    <span class="min-w-24">{{ item.name }}</span>
    </div>
  </div>
  <div v-else>
    <Collapsible
      class="group/collapsible space-y-1 [&[data-state=open]>div>button>svg:first-child]:rotate-90">
      <div class="flex">
        <CollapsibleTrigger>
          <Icon icon="akar-icons:chevron-right-small"
                class="bg-slate-800 m-2 transition-transform text-lg hover:bg-muted rounded box-content" />
        </CollapsibleTrigger>
        <div class="button folder" @click="folderSelect(item.id)">
          <Icon icon="akar-icons:folder" class="text-base w-4" />
          <span class="min-w-24">{{ item.name }}</span>
        </div>
      </div>
      <CollapsibleContent class="pl-[2rem] space-y-1">
        <DialogFolderTree @folderSelect="folderSelect" v-for="(subItem, index) in item.folders" :key="index" :item="subItem" />
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>

<style scoped>
.folder {
  @apply flex justify-items-start items-center gap-2 text-sm border-2 p-1.5 rounded w-full
}
.button {
  @apply hover:cursor-pointer hover:bg-muted
}
</style>
