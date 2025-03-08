<script setup lang="ts">
import { ref } from 'vue'

const isShow = ref(false)
let inActiveTimeout: any = null

function showBlock(ev: Event){
  isShow.value = true
  clearTimeout(inActiveTimeout)
}
function hideBlock(){
  inActiveTimeout = setTimeout(() => {
    isShow.value = false
  }, 50)
}
function dropFileHandler(ev: Event){
  isShow.value = false
  //TODO отправка
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
