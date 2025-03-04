import {acceptHMRUpdate, defineStore} from "pinia";
import {ref} from "vue";
import type {CustomError, ExtendedPostgresError} from "@/types/Error.ts";
import type {PostgrestError} from "@supabase/supabase-js";
import {usePageStore} from "@/stores/pages.ts";

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<CustomError | ExtendedPostgresError | null >(null);
  const isErrorCustom = ref(false);

  function setError({error, customCode}: {
    error: string | PostgrestError | Error,
    customCode?: number
  }) {

    if (typeof error === 'string') isErrorCustom.value = true;

    if (typeof error === 'string' || error instanceof Error) {
      activeError.value = typeof error === 'string'? Error(error) : error;
      activeError.value.customCode = customCode || 500;
      return
    }

    activeError.value = error;
    (activeError.value as ExtendedPostgresError ).statusCode = customCode || 500;
  }

  function clearError() {
    activeError.value = null;
    isErrorCustom.value = false;
  }

  return {
    activeError,
    setError,
    isErrorCustom,
    clearError
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
