import {acceptHMRUpdate, defineStore} from "pinia";
import {ref} from "vue";

export const usePageStore = defineStore('pages-store', () =>{
  const pageData = ref({
    title: ''
  })

  return { pageData }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePageStore, import.meta.hot))
}
