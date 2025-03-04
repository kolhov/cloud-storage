<script setup lang="ts">
import {useRouter} from "vue-router";
import {useErrorStore} from "@/stores/errorStore.ts";
import {defineAsyncComponent, ref} from "vue";

const errorStore = useErrorStore();
const error = ref(errorStore.activeError);
const message = ref('');
const customCode = ref(0);
const statusCode = ref(0);
const hint = ref('');
const details = ref('');
const code = ref('');

if (error.value && !('code' in error.value)){
  message.value = error.value.message;
  customCode.value = error.value.customCode ?? 0;
}

// Postgrest error
if (error.value && ('code' in error.value)){
  message.value = error.value.message;
  statusCode.value = error.value.statusCode ?? 0;
  hint.value = error.value.hint;
  details.value = error.value.details;
  code.value = error.value.code;
}

const ErrorComponent = import.meta.env.DEV
  ? defineAsyncComponent(() => import('./AppErrorDev.vue'))
  : defineAsyncComponent(() => import('./AppErrorProd.vue'))

const router = useRouter();
router.afterEach(() => {
  errorStore.clearError();
})
</script>

<template>
	<section class="error">
    <ErrorComponent :code :custom-code :details :hint :message :status-code :isErrorCustom="errorStore.isErrorCustom" />
  </section>
</template>

<style scoped>
.error {
  @apply mx-auto flex justify-center items-center flex-1 p-10 text-center -mt-20 min-h-[90vh];
}
:deep(.error__icon) {
  @apply text-7xl text-destructive;
}
:deep(.error__code) {
  @apply font-extrabold text-7xl text-secondary;
}
:deep(.error__msg) {
  @apply text-3xl font-extrabold text-primary;
}
:deep(.error-footer) {
  @apply flex flex-col items-center justify-center gap-5 mt-6 font-light;
}
:deep(.error-footer__text) {
  @apply text-lg text-muted-foreground;
}
p {
  @apply my-2;
}
</style>
