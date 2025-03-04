<script setup lang="ts">
import {useErrorStore} from "@/stores/errorStore.ts";

useErrorStore().setError({
  error: 'Page not found',
  customCode: 404
})
</script>

<template>

</template>

