<script setup lang="ts">
import { ref } from 'vue'
import { useFileUploader } from '@/stores/fileUploader.ts'
import { useRoute } from 'vue-router'

const isShow = ref(false)
const route = useRoute();
let inActiveTimeout: any = null

function showBlock() {
  isShow.value = true
  clearTimeout(inActiveTimeout)
}

function hideBlock() {
  inActiveTimeout = setTimeout(() => {
    isShow.value = false
  }, 50)
}

const {uploadFiles} = useFileUploader();
function dropFileHandler(ev: Event) {
  isShow.value = false

  const data = (ev as InputEvent).dataTransfer?.items ?? null
  if (data) uploadFiles(data, route.params.uuid ?? null);
}
</script>

<template>
  <div @drop.prevent="dropFileHandler"
       @dragenter.prevent="showBlock"
       @dragover.prevent="showBlock"
       @dragleave.prevent="hideBlock"
       :class="{dragActive: isShow}">
    <div v-if="isShow" class="p-4 flex justify-center items-center text-gray-500 text-xl">
      Drop files to upload
    </div>
    <slot />
  </div>
</template>

<style scoped>
.dragActive {
  @apply bg-slate-900 outline rounded-md outline-blue-800 outline-2 outline-offset-2
}
</style>
