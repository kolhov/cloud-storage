<script setup lang="ts">
import {
  Command, CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput, CommandItem,
  CommandList, CommandSeparator
} from '@/components/ui/command'
import { Icon } from '@iconify/vue'
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import type { AllFiles, AllFolders } from '@/lib/supabase/supabaseQueryTypes.ts'
import { getAllFiles, getAllFolders } from '@/lib/fileManager.ts'

const open = ref(false);
const files = ref<AllFiles | null>(null);
const folders = ref<AllFolders | null>(null);

watch(() => open.value, async () => {
  if (open.value){
    files.value = await getAllFiles();
    folders.value = await getAllFolders();
  } else {
    files.value = null;
    folders.value = null;
  }
});
</script>

<template>
  <Button variant="outline" class="relative h-fit w-full max-w-56 overflow-hidden"
          @click="open = !open">
    <Icon
      class="absolute top-[50%] translate-y-[-50%] left-2.5 text-muted-foreground"
      icon="akar-icons:search"
    />
    <span class="text-muted-foreground -translate-x-8">Search file...</span>
  </Button>
  <CommandDialog v-model:open="open">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList class="scroll">
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Folders">
        <CommandItem v-if="folders" v-for="item in folders" :value="item.name" asChild>
          <RouterLink :to="item.folder ? `/folder/${item.folder}` : '/'" @click="open = !open">
            <Icon :icon="item.icon" />
            {{item.name}}
          </RouterLink>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Files">
        <CommandItem v-if="files" v-for="item in files" :value="item.name" asChild>
          <RouterLink :to="item.folder ? `/folder/${item.folder}` : '/'" @click="open = !open">
            <Icon :icon="item.icon" />
            {{item.name}}
          </RouterLink>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
</template>

<style scoped>
.scroll::-webkit-scrollbar {
  @apply bg-muted w-[8px]
}
.scroll::-webkit-scrollbar-thumb {
  @apply bg-slate-600 rounded-full
}
</style>
