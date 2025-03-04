<script setup lang="ts">
import TopNavBar from "@/components/layout/TopNavBar.vue";
import SideBar from "@/components/layout/SideBar.vue";
import {usePageStore} from "@/stores/pages.ts";
import {storeToRefs} from "pinia";

const {pageData} = storeToRefs(usePageStore());
</script>

<template>
  <SideBar/>
  <div class="flex flex-col lg:ml-52 ml-16 transition-[margin]">
    <TopNavBar/>
    <main class="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
      <div class="flex items-center">
        <h1 class="text-lg font-semibold md:text-2xl">{{ pageData.title }}</h1>
      </div>
      <slot />
    </main>
  </div>
</template>

<style scoped>

</style>
