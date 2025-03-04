<script setup lang="ts">
import {Icon} from "@iconify/vue";
import {Button} from "@/components/ui/button";

defineProps<{
  message: string,
  customCode: number,
  statusCode: number,
  code: string | null,
  hint: string | null,
  details: string | null
}>()
</script>

<template>
  <div>
    <icon icon="lucide:triangle-alert" class="error__icon text-center w-full" />
    <h1 class="error__code">{{ customCode || statusCode }}</h1>
    <p v-if="code" class="error__code">{{ code }}</p>
    <p class="error__msg">{{ message }}</p>
    <p v-if="hint" class="">{{ hint }}</p>
    <p v-if="details" class="">{{ details }}</p>
    <div class="error-footer">
      <p class="error-footer__text">You'll find lots to explore on the home page.</p>
      <RouterLink to="/">
        <Button class="max-w-36"> Back to homepage </Button>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>
