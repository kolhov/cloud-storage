<script setup lang="ts">
import StorageView from '@/components/layout/StorageView.vue'
import DropZone from '@/components/ui/drop-zone/DropZone.vue'
import ProgressUpload from '@/components/ui/progress-upload/ProgressUpload.vue'

</script>

<template>
  <DropZone>
    <ProgressUpload />
    <StorageView />
  </DropZone>
</template>
