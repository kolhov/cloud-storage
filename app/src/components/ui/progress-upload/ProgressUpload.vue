<script setup lang="ts">
import { Progress } from '@/components/ui/progress'
import { storeToRefs } from 'pinia'
import { useFileUploader } from '@/stores/fileUploader.ts'
import { Icon } from '@iconify/vue'

const {loadingFiles} = storeToRefs(useFileUploader());
</script>

<template>
  <div v-for="(file, index) in loadingFiles"
       :key="index"
       class="flex sm:flex-row py-4 px-2 pr-4 flex-col justify-between items-center border-y-[1px]"
  >
    <span class="sm:w-1/3 flex flex-row justify-start items-center pl-2">
      <Icon :icon="file.icon" class="text-lg flex-shrink-0" />
      <span class="px-2 text-sm">{{file.name}}</span>
    </span>
    <div class="sm:w-2/3 pt-2 sm:pt-0 w-full max-w-80">
      <div class="flex flex-row justify-between text-sm">
        <span v-if="file.rate && file.progressBar < 100">{{file.rate}}/s</span>
        <span v-if="file.progressBar >= 100">Completed</span>
        <span v-if="file.duration">{{file.duration}}</span>
        <span>{{file.loaded}}/{{file.total}}</span>
      </div>
      <Progress v-model="file.progressBar" class="h-2" />
    </div>
  </div>
</template>

<style scoped>

</style>
