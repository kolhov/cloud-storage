<script setup lang="ts">
import AuthLayout from "@/components/layout/main/AuthLayout.vue";
import AppErrorPage from "@/components/AppError/AppErrorPage.vue";
import {useErrorStore} from "@/stores/errorStore.ts";
import {onErrorCaptured, onMounted} from "vue";
import {useAuthStore} from "@/stores/authStore.ts";

const errorStore = useErrorStore();

onErrorCaptured((error) => {
  errorStore.setError({error});
})

onMounted(async () => {
  useAuthStore().trackAuthChanges();
})

</script>

<template>
  <AuthLayout>
    <AppErrorPage v-if="errorStore.activeError" />
    <RouterView v-else v-slot="{Component, route}">
      <Suspense v-if="Component" :timeout="0">
        <Component :is="Component" :key="route.name"></Component>
        <template #fallback>Loading...</template>
      </Suspense>
    </RouterView>
  </AuthLayout>
</template>
