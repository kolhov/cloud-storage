<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

let fileIcon: string = 'akar-icons:paper';
const props = defineProps<{
  name: string,
  icon: string,
  isPublic: boolean
}>();

</script>

<template>
  <div class="flex flex-row items-center">
    <Icon :icon="icon" class="icons mr-3"></Icon>
    {{name}}
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Icon icon="akar-icons:people-group" v-if="isPublic"  class="icons mx-3" title="Shared"> </Icon>
        </TooltipTrigger>
        <TooltipContent>
          <p>Shared</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>

</template>

<style scoped>
.icons{
  @apply  text-lg
}
</style>
